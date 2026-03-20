# Output Contracts

**One-Line Summary**: Consistent, structured tool outputs with clear success/error distinction and metadata enable the LLM to reliably parse results and make confident decisions about what to do next.

**Prerequisites**: `designing-effective-tool-schemas.md`, `input-validation-and-type-safety.md`

## What Are Output Contracts?

Imagine two coworkers reporting back on assigned tasks. The first says "Done." The second says "Completed the competitor analysis. Found 12 companies in the space. Three are direct threats based on feature overlap. The full report is at /reports/Q1-analysis.pdf. Took 3 hours of research. Let me know if you need the raw data." The first response forces you to ask follow-up questions. The second gives you everything you need to decide your next step. Output contracts are about making every tool in your agent behave like the second coworker.

An output contract is a standardized response format that every skill returns, regardless of whether it succeeded or failed. It defines what information is always included, how success is distinguished from failure, and what metadata accompanies the result. When every tool in your agent returns data in the same shape, the LLM can reliably extract what it needs without guessing at the format or writing special parsing logic for each tool.

This matters because the LLM's next decision depends entirely on what the previous tool returned. If a search tool returns raw JSON one time and a formatted string the next, the LLM has to handle both cases. If an error comes back as a Python traceback instead of a clear message, the LLM struggles to diagnose the problem. Consistent output contracts make the agent's reasoning loop predictable, debuggable, and robust.

## How It Works

### The ToolResult Standard Format

Define a universal response structure that all skills use. This is the contract:

```python
from dataclasses import dataclass, field
from typing import Any, Optional
import json

@dataclass
class ToolResult:
    status: str              # "success" or "error"
    data: Any                # The actual result payload (on success)
    message: str             # Human-readable summary of what happened
    error_code: Optional[str] = None   # Machine-readable error type
    metadata: Optional[dict] = field(default_factory=dict)

    def to_dict(self) -> dict:
        result = {
            "status": self.status,
            "message": self.message,
        }
        if self.status == "success" and self.data is not None:
            result["data"] = self.data
        if self.error_code:
            result["error_code"] = self.error_code
        if self.metadata:
            result["metadata"] = self.metadata
        return result

    def to_string(self) -> str:
        """Format for the LLM to consume in the conversation."""
        if self.status == "success":
            parts = ["Status: success", f"Result: {self.message}"]
            if self.data:
                parts.append(f"Data:\n{self._format_data()}")
            if self.metadata:
                parts.append(f"Metadata: {json.dumps(self.metadata)}")
            return "\n".join(parts)
        else:
            parts = ["Status: error", f"Error: {self.message}"]
            if self.error_code:
                parts.append(f"Error code: {self.error_code}")
            return "\n".join(parts)

    def _format_data(self) -> str:
        if isinstance(self.data, list):
            return "\n".join(f"- {item}" for item in self.data[:20])
        if isinstance(self.data, dict):
            return json.dumps(self.data, indent=2)
        return str(self.data)
```

Every skill returns a `ToolResult`. The LLM always knows to check `status` first, read `message` for context, and look at `data` for the payload.

### Before and After: The Impact of Consistent Outputs

**Before -- inconsistent, unpredictable formats**:

```python
# Search tool returns raw API response
def web_search(query: str) -> str:
    response = requests.get(f"https://api.search.com?q={query}")
    return str(response.json())
    # Returns: "{'results': [{'title': '...', 'url': '...'}], 'total': 1234}"

# File read tool returns bare content
def read_file(path: str) -> str:
    with open(path) as f:
        return f.read()
    # Returns: raw file content, no metadata, no status

# Database tool returns yet another format
def query_db(sql: str) -> str:
    rows = db.execute(sql)
    return f"Found {len(rows)} rows: {rows}"
    # Returns: "Found 3 rows: [(1, 'Alice'), (2, 'Bob')]"
```

The LLM sees three completely different formats. It has to guess the structure each time and cannot reliably detect errors.

**After -- consistent, self-describing ToolResult**:

```python
def web_search(query: str) -> ToolResult:
    try:
        response = requests.get(
            "https://api.search.com/search",
            params={"q": query},
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        results = [
            {"title": r["title"], "url": r["url"], "snippet": r["snippet"]}
            for r in data["results"][:10]
        ]
        return ToolResult(
            status="success",
            data=results,
            message=f"Found {len(results)} results for '{query}'.",
            metadata={"total_available": data["total"], "latency_ms": data["took_ms"]},
        )
    except requests.Timeout:
        return ToolResult(
            status="error",
            data=None,
            message="Search timed out after 10 seconds. Try a simpler query.",
            error_code="TIMEOUT",
        )

def read_file(path: str) -> ToolResult:
    try:
        content = Path(path).read_text()
        line_count = content.count("\n") + 1
        return ToolResult(
            status="success",
            data=content,
            message=f"Read '{path}' ({line_count} lines, {len(content)} chars).",
            metadata={"lines": line_count, "size_bytes": len(content.encode())},
        )
    except FileNotFoundError:
        return ToolResult(
            status="error",
            data=None,
            message=f"File not found: '{path}'. Check the path and try again.",
            error_code="FILE_NOT_FOUND",
        )

def query_db(sql: str) -> ToolResult:
    try:
        rows = db.execute(sql)
        data = [dict(row) for row in rows]
        return ToolResult(
            status="success",
            data=data,
            message=f"Query returned {len(data)} rows.",
            metadata={"columns": list(data[0].keys()) if data else []},
        )
    except Exception as e:
        return ToolResult(
            status="error",
            data=None,
            message=f"Query failed: {str(e)}. Check SQL syntax.",
            error_code="QUERY_ERROR",
        )
```

Now every tool returns the same shape. The LLM learns the pattern once and applies it everywhere.

### Designing Error Responses That Enable Recovery

Errors are the most important part of output contracts. When a tool succeeds, the LLM usually does fine regardless of format. When a tool fails, the error format determines whether the agent recovers or spirals into confusion.

Good error outputs have three qualities:

```python
# 1. Clear problem statement
"File not found: '/data/report.csv'. Check the path and try again."
# Not: "OSError: [Errno 2] No such file or directory: '/data/report.csv'"

# 2. Actionable suggestion
"Search returned 0 results for 'xq7z'. Try broader keywords or check spelling."
# Not: "No results found."

# 3. Context that enables self-correction
"Rate limited by GitHub API. 0 requests remaining. Resets in 58 seconds."
# Not: "HTTP 429"
```

Categorize errors so the LLM knows whether to retry, try something else, or give up:

```python
class ErrorCategory:
    INVALID_INPUT = "invalid_input"     # Bad params: LLM should fix and retry
    NOT_FOUND = "not_found"             # Missing resource: try alternatives
    PERMISSION_DENIED = "permission"     # Not authorized: do not retry
    RATE_LIMITED = "rate_limited"        # Temporary: wait then retry
    TIMEOUT = "timeout"                  # Temporary: retry or simplify request
    INTERNAL_ERROR = "internal_error"    # Our bug: try a different approach
```

### Truncation and Size Management

Tool outputs go into the LLM's context window. Large outputs consume tokens and can push out important earlier context. Manage output size proactively:

```python
def truncate_output(data: Any, max_chars: int = 5000) -> tuple[Any, bool]:
    """Truncate tool output to fit within token budgets."""
    text = str(data)
    if len(text) <= max_chars:
        return data, False

    if isinstance(data, list):
        truncated = data[:10]
        return truncated, True
    elif isinstance(data, str):
        return text[:max_chars] + "\n... [truncated]", True
    else:
        return text[:max_chars] + "\n... [truncated]", True


def make_result(data: Any, message: str, **kwargs) -> ToolResult:
    """Helper that auto-truncates and adds truncation metadata."""
    truncated_data, was_truncated = truncate_output(data)
    metadata = kwargs.get("metadata", {})
    if was_truncated:
        metadata["truncated"] = True
        metadata["original_size"] = len(str(data))
    return ToolResult(
        status="success",
        data=truncated_data,
        message=message,
        metadata=metadata,
    )
```

### Metadata That Informs Decisions

Metadata gives the LLM context for planning without cluttering the main result:

```python
# Search: total results available vs. returned
metadata = {"total_results": 1240, "returned": 5, "latency_ms": 120}

# File read: file properties for context
metadata = {"lines": 450, "size_bytes": 12400, "encoding": "utf-8"}

# Database query: schema information for follow-up queries
metadata = {"columns": ["id", "name", "price"], "row_count": 25, "truncated": False}

# API call: rate limit status for pacing decisions
metadata = {"rate_limit_remaining": 45, "rate_limit_reset": "2025-06-15T10:30:00Z"}
```

This metadata helps the LLM make informed follow-up decisions: "There are 1240 total results but I only got 5, so I should refine my query" or "Only 45 API calls remaining, so I should batch my requests."

## Why It Matters

### The LLM's Next Step Depends on What the Tool Returns

Every tool result feeds directly into the LLM's next reasoning step. If the output is ambiguous about whether it succeeded or failed, the LLM's next action will be uncertain. If the output clearly states what happened, what data is available, and what constraints exist, the LLM can make a confident decision. Output quality directly determines agent reliability across multi-step tasks.

### Errors Are More Important Than Successes

Success cases are forgiving. The LLM usually figures out what to do with useful data even if the format varies. Error cases are where agents either recover gracefully or spiral into failure. A well-formatted error that says "File not found, similar files in directory: report_q1.csv, report_q2.csv" leads to self-correction. A raw Python traceback leads to confusion and wasted iterations.

## Key Technical Details

- Keep tool output under 5000 characters when possible to avoid context window pressure
- Always distinguish success from error using a machine-parseable status field, not just prose
- Include counts and totals so the LLM knows if it has all the data or needs to paginate
- Return data in structured form (dicts and lists) over formatted strings when practical
- Error messages should be 1-2 sentences containing the problem and a suggested fix
- Truncation should preserve the most relevant data (first N items, not random middle items)
- Metadata costs tokens so include only fields that genuinely help the LLM make decisions

## Common Misconceptions

**"Just return the raw API response"**: Raw API responses contain fields the LLM does not need (request IDs, internal headers, pagination cursors) and may be missing context the LLM does need (what the query was, how many total results exist). Your tool is a translator between the external API and the LLM. Normalize, filter, and enrich the output to serve the LLM's decision-making needs.

**"Returning more data is always better"**: Large outputs consume context window tokens that could be used for reasoning. A search tool that returns full page content for 10 results might use 50,000 tokens, leaving little room for the agent to think. Return summaries and snippets by default. Let the agent request full content for specific items when it needs the detail.

## Connections to Other Concepts

- `designing-effective-tool-schemas.md` — Schemas define the input contract; output contracts define the return contract
- `input-validation-and-type-safety.md` — Validation prevents bad inputs; output contracts report errors clearly when they occur
- `agent-runtime-loop.md` — Tool outputs feed into the observe phase of the agent loop
- `building-retrieval-skills.md` — Retrieval skills need especially careful output design for large result sets

## Further Reading

- Anthropic, "Tool Use: Handling Results" (2024) — How Claude processes and reasons about tool results
- Microsoft, "API Design Guidelines" (2023) — Enterprise patterns for consistent API response envelopes
- Fielding, "Architectural Styles and the Design of Network-based Software Architectures" (2000) — The original argument for uniform interfaces
- Google, "API Design Guide: Errors" (2023) — Standard error response patterns adopted widely across the industry
