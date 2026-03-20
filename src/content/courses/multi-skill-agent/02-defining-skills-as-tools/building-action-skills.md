# Building Action Skills

**One-Line Summary**: Action skills modify external state — writing files, calling APIs, updating databases, sending messages — and require special care around idempotency, confirmation, and dry-run modes to be safe in an autonomous agent loop.

**Prerequisites**: `designing-effective-tool-schemas.md`, `output-contracts.md`, `building-retrieval-skills.md`

## What Are Action Skills?

If retrieval skills are the agent's eyes and ears, action skills are its hands. They reach out and change the world: creating a file, sending an email, updating a database record, deploying code, posting to Slack. This ability to act is what separates a useful agent from a fancy search engine. But it also introduces risk. A retrieval skill that runs twice returns the same results. An action skill that runs twice might send two emails, create two files, or charge a credit card twice.

Action skills are tools that have side effects — they modify state outside the agent's own context. Every action is potentially irreversible or at least consequential. This is fundamentally different from retrieval: you can search the web 100 times with no harm, but sending 100 emails is a problem. This asymmetry means action skills need defensive patterns that retrieval skills do not: input validation is stricter, confirmation may be required, and idempotency must be considered.

Technically, an action skill takes structured inputs from the LLM, performs a state-changing operation on an external system, and returns a structured result indicating what happened. The skill is responsible for validating inputs, handling partial failures, and reporting results in a way the LLM can verify. The agent runtime may additionally enforce policies like requiring user confirmation for certain action types or limiting how many actions can be taken per session.

## How It Works

### File Operations Skill

File creation and modification is one of the most common action skills:

```python
from pathlib import Path
from pydantic import BaseModel, Field, field_validator

WORKSPACE = Path("/workspace")

class WriteFileInput(BaseModel):
    path: str = Field(..., description="File path relative to workspace root.")
    content: str = Field(..., description="Full file content to write.")
    create_dirs: bool = Field(
        default=True,
        description="Create parent directories if they don't exist."
    )

    @field_validator("path")
    @classmethod
    def validate_path(cls, v):
        resolved = (WORKSPACE / v).resolve()
        if not resolved.is_relative_to(WORKSPACE):
            raise ValueError("Path must be within the workspace directory.")
        return v

def write_file_skill(params: WriteFileInput) -> dict:
    """Write content to a file in the workspace."""
    target = WORKSPACE / params.path

    try:
        # Track whether this is a creation or an update
        existed = target.exists()
        old_size = target.stat().st_size if existed else 0

        if params.create_dirs:
            target.parent.mkdir(parents=True, exist_ok=True)

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
            },
        }
    except PermissionError:
        return {
            "status": "error",
            "message": f"Permission denied writing to '{params.path}'.",
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to write file: {str(e)}",
        }
```

### API Call Skill

A generic HTTP skill for calling external APIs:

```python
import httpx
from pydantic import BaseModel, Field, HttpUrl

class HttpRequestInput(BaseModel):
    method: str = Field(..., pattern="^(GET|POST|PUT|PATCH|DELETE)$")
    url: HttpUrl
    headers: dict[str, str] = Field(default_factory=dict)
    body: dict | None = Field(default=None, description="JSON request body for POST/PUT/PATCH.")
    timeout_seconds: int = Field(default=15, ge=1, le=60)

def http_request_skill(params: HttpRequestInput) -> dict:
    """Make an HTTP request to an external API."""
    try:
        with httpx.Client(timeout=params.timeout_seconds) as client:
            response = client.request(
                method=params.method,
                url=str(params.url),
                headers=params.headers,
                json=params.body if params.body else None,
            )

        # Parse response
        try:
            response_data = response.json()
        except ValueError:
            response_data = response.text[:2000]

        is_success = 200 <= response.status_code < 300

        return {
            "status": "success" if is_success else "error",
            "message": f"{params.method} {params.url} returned {response.status_code}.",
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
            "message": f"Request to {params.url} timed out after {params.timeout_seconds}s.",
        }
    except httpx.ConnectError:
        return {
            "status": "error",
            "message": f"Could not connect to {params.url}. Check the URL and try again.",
        }
```

### Database Write Skill

Database mutations need transaction safety:

```python
import sqlite3
from pydantic import BaseModel, Field, field_validator

class DatabaseWriteInput(BaseModel):
    sql: str = Field(..., description="SQL INSERT, UPDATE, or DELETE statement.")
    params: list = Field(
        default_factory=list,
        description="Parameterized values to prevent SQL injection. Use ? placeholders in SQL."
    )

    @field_validator("sql")
    @classmethod
    def must_be_write(cls, v):
        normalized = v.strip().upper()
        if normalized.startswith("SELECT"):
            raise ValueError("Use query_database for SELECT queries. This tool is for writes only.")
        if any(normalized.startswith(kw) for kw in ["DROP", "ALTER", "TRUNCATE"]):
            raise ValueError("Schema modifications (DROP, ALTER, TRUNCATE) are not allowed.")
        return v

def database_write_skill(params: DatabaseWriteInput) -> dict:
    """Execute a write operation (INSERT, UPDATE, DELETE) on the database."""
    conn = None
    try:
        conn = sqlite3.connect("app.db")
        cursor = conn.execute(params.sql, params.params)
        affected = cursor.rowcount
        conn.commit()

        # Determine operation type for clear messaging
        op = params.sql.strip().split()[0].upper()

        return {
            "status": "success",
            "message": f"{op} affected {affected} row(s).",
            "data": {"rows_affected": affected, "operation": op},
        }
    except sqlite3.IntegrityError as e:
        if conn:
            conn.rollback()
        return {
            "status": "error",
            "message": f"Integrity error: {str(e)}. Check for duplicate keys or constraint violations.",
        }
    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        return {
            "status": "error",
            "message": f"Database error: {str(e)}. Check SQL syntax and table/column names.",
        }
    finally:
        if conn:
            conn.close()
```

### Idempotency

Idempotency means that performing the same operation multiple times produces the same result as performing it once. This is critical for action skills because agents may retry failed steps:

```python
import hashlib

def idempotent_write_file(params: WriteFileInput) -> dict:
    """Write file only if content has actually changed."""
    target = WORKSPACE / params.path

    # Check if file already has this exact content
    if target.exists():
        existing_hash = hashlib.sha256(target.read_bytes()).hexdigest()
        new_hash = hashlib.sha256(params.content.encode()).hexdigest()

        if existing_hash == new_hash:
            return {
                "status": "success",
                "message": f"File '{params.path}' already has the expected content. No changes made.",
                "data": {"path": params.path, "action": "unchanged"},
            }

    # Content differs or file doesn't exist — proceed with write
    return write_file_skill(params)


def idempotent_create_record(table: str, unique_key: dict, data: dict) -> dict:
    """Create a record only if it doesn't already exist."""
    conn = sqlite3.connect("app.db")

    # Check for existing record
    where_clause = " AND ".join(f"{k} = ?" for k in unique_key)
    existing = conn.execute(
        f"SELECT 1 FROM {table} WHERE {where_clause}",
        list(unique_key.values())
    ).fetchone()

    if existing:
        return {
            "status": "success",
            "message": f"Record already exists in {table} with {unique_key}. No duplicate created.",
            "data": {"action": "already_exists"},
        }

    # Insert new record
    all_data = {**unique_key, **data}
    columns = ", ".join(all_data.keys())
    placeholders = ", ".join("?" * len(all_data))
    conn.execute(
        f"INSERT INTO {table} ({columns}) VALUES ({placeholders})",
        list(all_data.values())
    )
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": f"Created new record in {table}.",
        "data": {"action": "created"},
    }
```

### Confirmation Patterns

For high-risk actions, require explicit confirmation:

```python
class ConfirmableAction:
    """Wraps an action skill with a two-phase confirmation pattern."""

    def __init__(self, skill_fn, risk_level: str = "medium"):
        self.skill_fn = skill_fn
        self.risk_level = risk_level
        self.pending_actions = {}

    def preview(self, params: dict) -> dict:
        """Phase 1: Show what would happen without doing it."""
        action_id = hashlib.sha256(str(params).encode()).hexdigest()[:12]
        self.pending_actions[action_id] = params

        return {
            "status": "pending_confirmation",
            "message": f"Action preview (ID: {action_id}): This will {self.describe(params)}. "
                       f"Call confirm_action with action_id='{action_id}' to proceed.",
            "data": {"action_id": action_id, "params": params},
        }

    def confirm(self, action_id: str) -> dict:
        """Phase 2: Execute the confirmed action."""
        if action_id not in self.pending_actions:
            return {"status": "error", "message": f"No pending action with ID '{action_id}'."}

        params = self.pending_actions.pop(action_id)
        return self.skill_fn(params)
```

### Dry-Run Mode

Dry-run mode lets the agent test an action without executing it:

```python
class DryRunnable:
    """Mixin that adds dry-run support to action skills."""

    def execute(self, params: dict, dry_run: bool = False) -> dict:
        if dry_run:
            return self.simulate(params)
        return self.perform(params)

    def simulate(self, params: dict) -> dict:
        """Describe what would happen without doing it."""
        # Validate inputs (this still runs)
        validation_result = self.validate(params)
        if not validation_result["valid"]:
            return {"status": "error", "message": validation_result["error"]}

        return {
            "status": "success",
            "message": f"[DRY RUN] Would {self.describe_action(params)}. No changes made.",
            "data": {"dry_run": True, "would_affect": self.estimate_impact(params)},
        }
```

Add `dry_run` as a parameter in the tool schema:

```json
{
    "name": "send_email",
    "input_schema": {
        "properties": {
            "to": {"type": "string"},
            "subject": {"type": "string"},
            "body": {"type": "string"},
            "dry_run": {
                "type": "boolean",
                "default": false,
                "description": "If true, validates inputs and shows what would be sent without actually sending."
            }
        }
    }
}
```

## Why It Matters

### Actions Are What Make Agents Useful

An agent that can only search and read is a research assistant. An agent that can also write files, call APIs, and send messages is a productivity tool. Action skills are what close the loop from "finding information" to "getting things done."

### Side Effects Require Defensive Design

Every action skill is a potential source of real-world harm if misused. Sending an email to the wrong person, overwriting a critical file, or deleting database records cannot be undone with a retry. Defensive patterns like validation, confirmation, idempotency, and dry-run modes are not optional luxuries — they are essential safety measures for autonomous systems.

## Key Technical Details

- Action skills should always return what they actually did, not just "success" — include specifics like "Created file report.pdf (2,450 bytes)"
- Idempotency keys should be based on the semantic intent, not the raw inputs (same email to same recipient = same action)
- Dry-run mode should validate all inputs and check preconditions — it should fail if the real action would fail
- Database writes should use parameterized queries to prevent SQL injection, even from an LLM
- File writes should be atomic when possible (write to temp file, then rename) to prevent partial writes
- Set reasonable rate limits: no more than 5 emails per minute, 100 API calls per session
- Log every action with full inputs and outputs for auditability

## Common Misconceptions

**"The LLM will use action skills responsibly on its own"**: LLMs have no inherent sense of consequence. They will happily send an email, delete a file, or call a paid API if the task seems to call for it. Safety must be built into the skill implementation and the runtime policy, not trusted to the model's judgment. Always validate, always limit, and consider confirmation for irreversible actions.

**"Idempotency is only needed for retries"**: Idempotency also protects against the agent calling the same action multiple times within a single run. If the agent loses track of what it already did (common with long context), it might re-execute an action. Idempotent skills handle this gracefully; non-idempotent skills create duplicates.

## Connections to Other Concepts

- `building-retrieval-skills.md` — The read-only counterpart to action skills
- `input-validation-and-type-safety.md` — Especially critical for action skills due to side effects
- `output-contracts.md` — Action results must clearly state what was done
- `agent-runtime-loop.md` — The runtime can enforce policies on which actions require confirmation
- `designing-effective-tool-schemas.md` — Action tool descriptions must clearly state their side effects

## Further Reading

- Anthropic, "Tool Use Safety" (2024) — Guidelines for building safe tool implementations
- Pat Helland, "Idempotence Is Not a Medical Condition" (2012) — Classic essay on idempotency in distributed systems
- Stripe API Documentation, "Idempotent Requests" (2024) — Production example of idempotency keys
- OWASP, "API Security Top 10" (2023) — Security considerations for tools that call external APIs
