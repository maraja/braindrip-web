# Building Action Skills

**One-Line Summary**: Action skills modify external state -- writing files, calling APIs, updating databases, sending messages -- and require idempotency, confirmation patterns, and dry-run modes to prevent irreversible mistakes.

**Prerequisites**: `designing-effective-tool-schemas.md`, `output-contracts.md`, `input-validation-and-type-safety.md`

## What Are Action Skills?

If retrieval skills are the agent's eyes and ears, action skills are its hands. They reach out and change the world: creating files, sending emails, updating database records, deploying code, posting to Slack. This ability to act is what separates a useful agent from a fancy search engine. But it also introduces risk that retrieval skills never carry. A retrieval skill that runs twice returns the same results. An action skill that runs twice might send two emails, create duplicate records, or charge a credit card twice.

Action skills are tools that have side effects. They modify state outside the agent's own context. Every action is potentially irreversible or at least consequential. This is fundamentally different from retrieval: you can search the web a hundred times with no harm, but sending a hundred emails is a serious problem. This asymmetry means action skills need defensive patterns that retrieval skills do not: input validation must be stricter, confirmation may be required before destructive operations, and idempotency must be baked into the design.

Technically, an action skill takes structured inputs from the LLM, performs a state-changing operation on an external system, and returns a structured result indicating exactly what happened. The skill is responsible for validating inputs, handling partial failures, rolling back when possible, and reporting results in a way the LLM can verify. The agent runtime may additionally enforce policies like requiring user confirmation for certain action types or limiting how many actions can be taken per session.

## How It Works

### File Operations Skill

File creation and modification is one of the most common action skills. The key safeguards are path validation, automatic backup creation, and size limits:

```python
from pathlib import Path
from pydantic import BaseModel, Field, field_validator
import shutil
from datetime import datetime

WORKSPACE = Path("/workspace")

class WriteFileInput(BaseModel):
    path: str = Field(..., description="File path relative to workspace root.")
    content: str = Field(..., max_length=100000, description="Full file content to write.")
    create_backup: bool = Field(default=True, description="Backup existing file before overwriting.")

    @field_validator("path")
    @classmethod
    def validate_safe_path(cls, v):
        resolved = (WORKSPACE / v).resolve()
        if not resolved.is_relative_to(WORKSPACE):
            raise ValueError("Path must be within the workspace directory.")
        if resolved.suffix in [".env", ".key", ".pem", ".secret"]:
            raise ValueError(f"Cannot write to sensitive file type: {resolved.suffix}")
        return v

def write_file_skill(params: WriteFileInput) -> dict:
    """Write content to a file in the workspace."""
    target = (WORKSPACE / params.path).resolve()

    try:
        # Track whether this is a creation or update
        existed = target.exists()
        old_size = target.stat().st_size if existed else 0

        # Create backup if file exists and backup is requested
        backup_path = None
        if existed and params.create_backup:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = target.with_suffix(f".bak.{timestamp}")
            shutil.copy2(target, backup_path)

        # Create parent directories if needed
        target.parent.mkdir(parents=True, exist_ok=True)

        # Write the file
        target.write_text(params.content, encoding="utf-8")
        new_size = target.stat().st_size
        action = "Updated" if existed else "Created"

        return {
            "status": "success",
            "message": f"{action} file '{params.path}' ({new_size} bytes, {params.content.count(chr(10)) + 1} lines).",
            "data": {"path": params.path, "action": action.lower()},
            "metadata": {
                "previous_size": old_size if existed else None,
                "new_size": new_size,
                "backup_path": str(backup_path) if backup_path else None,
            },
        }
    except PermissionError:
        return {
            "status": "error",
            "message": f"Permission denied writing to '{params.path}'.",
            "error_code": "PERMISSION_DENIED",
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to write file: {str(e)}",
            "error_code": "WRITE_ERROR",
        }
```

### API Call Skill

External API calls let the agent interact with third-party services. The key patterns are timeout management, response normalization, and clear error categorization:

```python
import httpx
from pydantic import BaseModel, Field, HttpUrl

class ApiCallInput(BaseModel):
    method: str = Field(..., pattern="^(GET|POST|PUT|PATCH|DELETE)$")
    url: HttpUrl
    headers: dict[str, str] = Field(default_factory=dict)
    body: dict | None = Field(default=None, description="JSON request body for POST/PUT/PATCH.")
    timeout_seconds: int = Field(default=15, ge=1, le=60)

def api_call_skill(params: ApiCallInput) -> dict:
    """Make an HTTP request to an external API."""
    try:
        with httpx.Client(timeout=params.timeout_seconds) as client:
            response = client.request(
                method=params.method,
                url=str(params.url),
                headers=params.headers,
                json=params.body if params.body else None,
            )

        # Parse response body, truncating if very large
        try:
            response_data = response.json()
        except ValueError:
            response_data = response.text[:2000]

        is_success = 200 <= response.status_code < 300

        return {
            "status": "success" if is_success else "error",
            "message": f"{params.method} {params.url} returned HTTP {response.status_code}.",
            "data": response_data,
            "metadata": {
                "status_code": response.status_code,
                "content_type": response.headers.get("content-type", "unknown"),
                "response_size": len(response.content),
            },
        }
    except httpx.TimeoutException:
        return {
            "status": "error",
            "message": f"Request timed out after {params.timeout_seconds}s. Try increasing timeout or simplifying the request.",
            "error_code": "TIMEOUT",
        }
    except httpx.ConnectError:
        return {
            "status": "error",
            "message": f"Could not connect to {params.url}. Check the URL and try again.",
            "error_code": "CONNECTION_ERROR",
        }
```

### Database Write Skill

Database mutations need the strictest safeguards: parameterized queries to prevent injection, transaction safety with rollback on failure, and optional dry-run mode:

```python
import sqlite3
from pydantic import BaseModel, Field, field_validator

class DatabaseWriteInput(BaseModel):
    operation: str = Field(..., description="SQL INSERT, UPDATE, or DELETE statement. Use ? placeholders.")
    params: list = Field(
        default_factory=list,
        description="Parameterized values to prevent SQL injection."
    )
    dry_run: bool = Field(
        default=False,
        description="If true, validate the query without executing it."
    )

    @field_validator("operation")
    @classmethod
    def must_be_write_operation(cls, v):
        normalized = v.strip().upper()
        if normalized.startswith("SELECT"):
            raise ValueError("Use query_database for SELECT. This tool is for writes only.")
        if any(normalized.startswith(kw) for kw in ["DROP", "ALTER", "TRUNCATE"]):
            raise ValueError("Schema modifications (DROP, ALTER, TRUNCATE) are not allowed.")
        allowed = ("INSERT", "UPDATE", "DELETE")
        if not any(normalized.startswith(op) for op in allowed):
            raise ValueError(f"Only INSERT, UPDATE, DELETE allowed. Got: {normalized[:20]}")
        return v

def database_write_skill(params: DatabaseWriteInput) -> dict:
    """Execute a write operation on the application database."""
    conn = None
    try:
        conn = sqlite3.connect("app.db")

        if params.dry_run:
            # Validate without executing by using EXPLAIN
            cursor = conn.execute(f"EXPLAIN {params.operation}", params.params)
            plan = cursor.fetchall()
            return {
                "status": "success",
                "data": {"query_plan": str(plan[:5])},
                "message": "Dry run: query is valid and would execute successfully.",
                "metadata": {"dry_run": True},
            }

        cursor = conn.execute(params.operation, params.params)
        affected = cursor.rowcount
        conn.commit()

        op = params.operation.strip().split()[0].upper()
        return {
            "status": "success",
            "message": f"{op} affected {affected} row(s).",
            "data": {"rows_affected": affected, "operation": op},
            "metadata": {
                "rows_affected": affected,
                "last_row_id": cursor.lastrowid,
            },
        }
    except sqlite3.IntegrityError as e:
        if conn:
            conn.rollback()
        return {
            "status": "error",
            "message": f"Integrity error: {str(e)}. Check for duplicates or constraint violations.",
            "error_code": "INTEGRITY_ERROR",
        }
    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        return {
            "status": "error",
            "message": f"Database error: {str(e)}. Operation was rolled back.",
            "error_code": "DB_WRITE_ERROR",
        }
    finally:
        if conn:
            conn.close()
```

### Sending Messages Skill

Messaging skills send notifications to humans or other systems. Because sent messages cannot be unsent, preview mode is essential:

```python
from pydantic import BaseModel, Field

class SendMessageInput(BaseModel):
    channel: str = Field(..., pattern="^(email|slack|webhook)$", description="Delivery channel.")
    recipient: str = Field(..., description="Email address, Slack channel, or webhook URL.")
    subject: str = Field(default="", max_length=200)
    body: str = Field(..., min_length=1, max_length=10000)
    preview_only: bool = Field(
        default=False,
        description="If true, return a preview without sending."
    )

def send_message_skill(params: SendMessageInput) -> dict:
    """Send a message via email, Slack, or webhook."""
    preview = {
        "channel": params.channel,
        "recipient": params.recipient,
        "subject": params.subject,
        "body_preview": params.body[:200] + ("..." if len(params.body) > 200 else ""),
    }

    if params.preview_only:
        return {
            "status": "success",
            "data": preview,
            "message": "Preview generated. Set preview_only=false to send.",
            "metadata": {"preview_only": True, "body_length": len(params.body)},
        }

    try:
        if params.channel == "email":
            send_email(params.recipient, params.subject, params.body)
        elif params.channel == "slack":
            post_to_slack(params.recipient, params.body)
        elif params.channel == "webhook":
            httpx.post(params.recipient, json={"text": params.body}, timeout=10)

        return {
            "status": "success",
            "data": preview,
            "message": f"Message sent via {params.channel} to {params.recipient}.",
            "metadata": {"sent": True, "body_length": len(params.body)},
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to send via {params.channel}: {str(e)}",
            "error_code": "SEND_ERROR",
        }
```

### Idempotency: Making Actions Safe to Retry

An idempotent operation produces the same result whether you execute it once or ten times. This is critical because agents may retry failed steps, or the LLM may lose track of what it already did in long conversations:

```python
import hashlib
import json

# Simple idempotency store (use Redis or a database in production)
_executed_keys: dict[str, dict] = {}

def make_idempotent(func):
    """Decorator that prevents duplicate execution of action skills."""
    def wrapper(params) -> dict:
        key_data = f"{func.__name__}:{json.dumps(params.model_dump(), sort_keys=True)}"
        idempotency_key = hashlib.sha256(key_data.encode()).hexdigest()[:16]

        if idempotency_key in _executed_keys:
            original = _executed_keys[idempotency_key]
            return {
                "status": "success",
                "data": original.get("data"),
                "message": "Action already completed (duplicate detected). Returning original result.",
                "metadata": {"idempotent_skip": True, "key": idempotency_key},
            }

        result = func(params)
        if result.get("status") == "success":
            _executed_keys[idempotency_key] = result

        return result
    return wrapper

@make_idempotent
def send_message_skill(params: SendMessageInput) -> dict:
    # ... same implementation as above
    pass
```

Content-based idempotency works well for file writes:

```python
def idempotent_write_file(params: WriteFileInput) -> dict:
    """Write file only if content has actually changed."""
    target = WORKSPACE / params.path

    if target.exists():
        existing_hash = hashlib.sha256(target.read_bytes()).hexdigest()
        new_hash = hashlib.sha256(params.content.encode()).hexdigest()
        if existing_hash == new_hash:
            return {
                "status": "success",
                "message": f"File '{params.path}' already has the expected content. No changes made.",
                "data": {"path": params.path, "action": "unchanged"},
            }

    return write_file_skill(params)
```

### Confirmation and Dry-Run Patterns

For destructive operations, use a two-phase pattern where the first call previews effects and the second call executes:

```python
class DeleteFilesInput(BaseModel):
    pattern: str = Field(..., description="Glob pattern of files to delete.")
    confirm: bool = Field(
        default=False,
        description="Must be true to actually delete. False returns a preview."
    )

def delete_files_skill(params: DeleteFilesInput) -> dict:
    """Delete files matching a pattern. Requires confirm=true to execute."""
    matches = list(WORKSPACE.rglob(params.pattern))
    file_list = [str(p.relative_to(WORKSPACE)) for p in matches if p.is_file()]

    if not params.confirm:
        return {
            "status": "success",
            "data": {"files_to_delete": file_list[:20]},
            "message": f"Would delete {len(file_list)} files. Set confirm=true to proceed.",
            "metadata": {"dry_run": True, "total_files": len(file_list)},
        }

    deleted = 0
    errors = []
    for path in matches:
        if path.is_file():
            try:
                path.unlink()
                deleted += 1
            except Exception as e:
                errors.append(f"{path.name}: {e}")

    status = "success" if not errors else "error"
    return {
        "status": status,
        "data": {"deleted_count": deleted, "errors": errors[:5]},
        "message": f"Deleted {deleted} files." + (f" {len(errors)} errors occurred." if errors else ""),
        "metadata": {"deleted_count": deleted, "error_count": len(errors)},
    }
```

The agent calls the tool once with `confirm=false`, reviews the preview in its reasoning step, and then calls again with `confirm=true` only if the preview matches its intent. This two-phase pattern catches mistakes before they cause harm.

## Why It Matters

### Action Skills Are Where Agents Create Real Value

An agent that can only search and read is a research assistant. An agent that can also write files, create tickets, send messages, and update databases is an autonomous worker that completes tasks end-to-end. Action skills close the loop from "here is what you should do" to "done."

### Action Skills Are Where Agents Cause Real Harm

The same power that makes action skills valuable makes them dangerous. A retrieval skill that returns wrong results wastes a few iterations. An action skill that deletes the wrong files, sends an email to the wrong person, or writes corrupt data to a production database causes real damage that may be impossible to reverse. Every safeguard in this concept -- strict validation, idempotency, confirmation gates, dry-run modes -- exists because action skills interact with the real world in ways that cannot always be undone.

## Key Technical Details

- Action skills should always report exactly what they did: "Created file report.pdf (2,450 bytes)" not just "success"
- Idempotency keys should be based on the full parameter set so identical calls produce identical results
- Dry-run mode should run full validation and precondition checks, stopping only at the actual execution step
- Database writes must use parameterized queries to prevent SQL injection, even when inputs come from an LLM
- File writes should create automatic backups before overwriting to enable recovery from mistakes
- Set conservative rate limits on external actions: no more than 5 emails per minute or 100 API calls per session
- Log every action with full inputs and outputs for auditability and debugging

## Common Misconceptions

**"The LLM will use action skills responsibly on its own"**: LLMs have no inherent sense of consequence. They will send an email, delete a file, or call a paid API if the task seems to call for it. Safety must be built into the skill implementation and the runtime policy, not trusted to the model's judgment. Always validate inputs, enforce rate limits, and require confirmation for irreversible operations.

**"Idempotency is only needed for retries"**: Idempotency also protects against the agent calling the same action multiple times within a single run. If the agent loses track of what it already did, which happens with long conversations that push earlier context out of the window, it might re-execute an action. Idempotent skills handle this gracefully. Non-idempotent skills create duplicates, send duplicate messages, or double-charge accounts.

## Connections to Other Concepts

- `building-retrieval-skills.md` -- The read-only counterpart to action skills, with fundamentally different safety properties
- `input-validation-and-type-safety.md` -- Especially critical for action skills where bad inputs cause irreversible side effects
- `output-contracts.md` -- Action results must clearly state what was done so the LLM can verify success
- `designing-effective-tool-schemas.md` -- Action tool descriptions must clearly communicate their side effects and destructive potential

## Further Reading

- Anthropic, "Tool Use Best Practices" (2024) -- Guidelines for building safe and effective tool integrations
- Helland, "Idempotence Is Not a Medical Condition" (2012) -- Classic essay on why idempotency matters in distributed systems
- Stripe API Documentation, "Idempotent Requests" (2024) -- Production-grade patterns for making API operations safe to retry
- Leveson, "Engineering a Safer World" (2011) -- Systems thinking about safety constraints in automated systems
