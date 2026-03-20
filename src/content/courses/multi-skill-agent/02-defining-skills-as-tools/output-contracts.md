# Output Contracts

**One-Line Summary**: Consistent, structured tool outputs with clear success/error distinction and metadata enable the LLM to reliably parse results and make good decisions about next steps.

**Prerequisites**: `designing-effective-tool-schemas.md`, `input-validation-and-type-safety.md`

## What Are Output Contracts?

Imagine two coworkers reporting back on tasks. One says: "Done." The other says: "Completed the market analysis. Found 12 competitors. Three are direct threats. The full report is in shared drive at /reports/Q1-analysis.pdf. Took 3 hours. Let me know if you need the raw data." The first response forces you to ask follow-up questions. The second gives you everything you need to decide what to do next. Output contracts are about making your tools behave like the second coworker.

An output contract is a standardized format that every skill returns, regardless of whether it succeeded or failed. It defines what information is included in the response, how success and failure are distinguished, and what metadata accompanies the result. When every tool in your agent returns data in the same shape, the LLM can reliably extract what it needs without guessing at the format.

This matters because the LLM's next decision depends entirely on what the previous tool returned. If a search tool returns raw JSON one time and a formatted string the next, the LLM has to handle both cases. If an error comes back as a Python traceback instead of a clear message, the LLM struggles to diagnose the problem. Consistent outputs make the agent's reasoning loop predictable and robust.

## How It Works

### A Standard Output Format

Define a universal response structure that all skills use:

```python
from dataclasses import dataclass
from typing import Any, Optional

@dataclass
class ToolOutput:
    status: str              # "success" or "error"
    data: Any                # The actual result (on success)
    message: str             # Human-readable summary
    error_code: Optional[str] = None  # Machine-readable error type
    metadata: Optional[dict] = None   # Timing, counts, pagination info

    def to_string(self) -> str:
        """Format for the LLM to consume."""
        if self.status == "success":
            parts = [f"Status: success", f"Result: {self.message}"]
            if self.data:
                parts.append(f"Data:\n{self._format_data()}")
            if self.metadata:
                parts.append(f"Metadata: {self.metadata}")
            return "\n".join(parts)
        else:
            parts = [
                f"Status: error",
                f"Error: {self.message}",
            ]
            if self.error_code:
                parts.append(f"Error code: {self.error_code}")
            return "\n".join(parts)

    def _format_data(self) -> str:
        if isinstance(self.data, list):
            return "\n".join(f"- {item}" for item in self.data[:20])
        if isinstance(self.data, dict):
            import json
            return json.dumps(self.data, indent=2)
        return str(self.data)
```

### Before and After: Poorly vs. Well-Structured Outputs

**Before — inconsistent, hard to parse**:

```python
# Search tool returns raw API response
def web_search(query: str) -> str:
    response = requests.get(f"https://api.search.com?q={query}")
    return str(response.json())
    # Output: "{'results': [{'title': '...', 'url': '...', 'snippet': '...'}], 'total': 1234, 'took_ms': 45}"

# File read tool returns just the content
def read_file(path: str) -> str:
    with open(path) as f:
        return f.read()
    # Output: the raw file contents, no metadata

# Database tool returns something else entirely
def query_db(sql: str) -> str:
    rows = db.execute(sql)
    return f"Found {len(rows)} rows: {rows}"
    # Output: "Found 3 rows: [(1, 'Alice'), (2, 'Bob'), (3, 'Carol')]"
```

The LLM sees three completely different formats. It has to figure out the structure each time.

**After — consistent, self-describing**:

```python
def web_search(query: str) -> ToolOutput:
    try:
        response = requests.get(
            "https://api.search.com/search",
            params={"q": query},
            timeout=10,
        )
        data = response.json()
        results = [
            {"title": r["title"], "url": r["url"], "snippet": r["snippet"]}
            for r in data["results"][:10]
        ]
        return ToolOutput(
            status="success",
            data=results,
            message=f"Found {len(results)} results for '{query}'.",
            metadata={"total_available": data["total"], "latency_ms": data["took_ms"]},
        )
    except requests.Timeout:
        return ToolOutput(
            status="error",
            data=None,
            message="Search timed out after 10 seconds. Try a simpler query.",
            error_code="TIMEOUT",
        )
    except Exception as e:
        return ToolOutput(
            status="error",
            data=None,
            message=f"Search failed: {str(e)}",
            error_code="SEARCH_ERROR",
        )


def read_file(path: str) -> ToolOutput:
    try:
        with open(path) as f:
            content = f.read()
        line_count = content.count("\n") + 1
        return ToolOutput(
            status="success",
            data=content,
            message=f"Read file '{path}' ({line_count} lines, {len(content)} characters).",
            metadata={"lines": line_count, "size_bytes": len(content.encode())},
        )
    except FileNotFoundError:
        return ToolOutput(
            status="error",
            data=None,
            message=f"File not found: '{path}'. Check the path and try again.",
            error_code="FILE_NOT_FOUND",
        )


def query_db(sql: str) -> ToolOutput:
    try:
        rows = db.execute(sql)
        return ToolOutput(
            status="success",
            data=[dict(row) for row in rows],
            message=f"Query returned {len(rows)} rows.",
            metadata={"columns": list(rows[0].keys()) if rows else []},
        )
    except Exception as e:
        return ToolOutput(
            status="error",
            data=None,
            message=f"Query failed: {str(e)}. Check SQL syntax.",
            error_code="QUERY_ERROR",
        )
```

Now every tool returns the same shape. The LLM always knows to check `status` first, read `message` for context, and look at `data` for details.

### Error Design

Errors are the most important part of output contracts. When a tool succeeds, the LLM usually does fine regardless of format. When a tool fails, the error format determines whether the agent recovers or spirals.

Good error outputs have three qualities:

```python
# 1. Clear problem statement
"File not found: '/data/report.csv'. Check the path and try again."
# Not: "OSError: [Errno 2] No such file or directory: '/data/report.csv'"

# 2. Actionable suggestion
"Search returned no results for 'xq7z'. Try broader keywords or check spelling."
# Not: "No results found."

# 3. Context for self-correction
"Rate limited by GitHub API. Wait 60 seconds before retrying, or reduce request frequency."
# Not: "HTTP 429"
```

A pattern for categorizing errors:

```python
class ErrorCategory:
    INVALID_INPUT = "invalid_input"       # LLM sent bad params — should retry with fixes
    NOT_FOUND = "not_found"               # Resource doesn't exist — LLM should try alternatives
    PERMISSION_DENIED = "permission"       # Not authorized — LLM should not retry
    RATE_LIMITED = "rate_limited"          # Temporary — LLM should wait or reduce calls
    TIMEOUT = "timeout"                    # Temporary — LLM should retry or simplify
    INTERNAL_ERROR = "internal_error"      # Our bug — LLM should try a different approach
```

### Truncation and Size Management

Tool outputs go into the LLM's context window. Large outputs consume tokens and can push out important earlier context:

```python
def truncate_output(data: Any, max_chars: int = 5000) -> tuple[Any, bool]:
    """Truncate tool output to fit within token budgets."""
    text = str(data)
    if len(text) <= max_chars:
        return data, False

    if isinstance(data, list):
        # Truncate lists by taking fewer items
        truncated = data[:10]
        return truncated, True
    elif isinstance(data, str):
        # Truncate strings with indicator
        return text[:max_chars] + "\n... [truncated]", True
    else:
        return text[:max_chars] + "\n... [truncated]", True


def make_output(data: Any, message: str, **kwargs) -> ToolOutput:
    truncated_data, was_truncated = truncate_output(data)
    metadata = kwargs.get("metadata", {})
    if was_truncated:
        metadata["truncated"] = True
        metadata["original_size"] = len(str(data))
    return ToolOutput(
        status="success",
        data=truncated_data,
        message=message,
        metadata=metadata,
    )
```

### Metadata That Helps

Metadata gives the LLM context without cluttering the main result:

```python
# Search: how many total results exist
metadata={"total_results": 1240, "returned": 5, "latency_ms": 120}

# File read: file properties
metadata={"lines": 450, "size_bytes": 12400, "encoding": "utf-8"}

# Database query: schema information
metadata={"columns": ["id", "name", "price"], "row_count": 25}

# API call: rate limit status
metadata={"rate_limit_remaining": 45, "rate_limit_reset": "2025-06-15T10:30:00Z"}
```

This metadata helps the LLM make informed decisions: "There are 1240 results but I only got 5 — I should refine my query" or "Only 45 API calls remaining — I should batch my requests."

## Why It Matters

### The LLM's Next Step Depends on the Output

Every tool result feeds directly into the LLM's next reasoning step. If the output is ambiguous, the LLM's next action will be uncertain. If the output clearly states what happened, what data is available, and what constraints exist, the LLM can make a confident decision. Output quality directly determines agent reliability.

### Errors Are More Important Than Successes

Success cases are forgiving — the LLM usually figures out what to do with good data. Error cases are where agents fail or recover. A well-formatted error message that says "File not found, did you mean /data/reports/q1.csv?" leads to self-correction. A raw traceback leads to confusion.

## Key Technical Details

- Keep tool output under 5000 characters when possible to avoid context window pressure
- Always distinguish success from error in a machine-parseable way (status field, not just text)
- Include counts and totals so the LLM knows if it has all the data or needs to paginate
- Return data in the most structured form practical (dicts and lists over formatted strings)
- Error messages should be 1-2 sentences with the problem and a suggested fix
- Truncation should preserve the most relevant data (first N items of a list, not middle)
- Metadata costs tokens — include only what genuinely helps the LLM make decisions

## Common Misconceptions

**"Just return the raw API response"**: Raw API responses contain fields the LLM doesn't need (request IDs, headers, pagination cursors) and may be missing context the LLM does need (what the query was, how many results exist). Normalize and filter the output. Your tool is a translator between the external API and the LLM's needs.

**"Returning more data is always better"**: Large outputs consume context window space that could be used for reasoning. A search tool that returns full page content for 10 results might use 50,000 tokens — leaving little room for the agent to think. Return summaries and snippets; let the agent request full content when it needs it.

## Connections to Other Concepts

- `designing-effective-tool-schemas.md` — Schemas define inputs; output contracts define outputs
- `input-validation-and-type-safety.md` — Validation prevents errors; output contracts report them
- `agent-runtime-loop.md` — Tool outputs feed into the observe phase of the loop
- `building-retrieval-skills.md` — Retrieval skills need especially careful output design for large result sets

## Further Reading

- Anthropic, "Tool Use: Handling Results" (2024) — How Claude processes tool results
- Microsoft, "API Design Guidelines" (2023) — Enterprise patterns for consistent API responses
- Fielding, "REST Architectural Style" (2000) — The original argument for uniform interfaces
- Google, "API Design Guide: Errors" (2023) — Standard error response patterns for APIs
