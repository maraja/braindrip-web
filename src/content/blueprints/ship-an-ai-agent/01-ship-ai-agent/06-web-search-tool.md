# Step 6: Web Search Tool

One-Line Summary: Replace the placeholder web search with a real implementation using DuckDuckGo so your agent can find current information — no API key required.

Prerequisites: Agent loop from Step 5

---

## Why DuckDuckGo

Your agent needs access to current information. DuckDuckGo search gives you:

- **Web results** with titles, URLs, and descriptions
- **No API key required** — install the package and it works
- **No rate limit concerns** for development and learning

Other options work too (Brave Search, SerpAPI, Tavily), but DuckDuckGo has the lowest setup friction.

## Implement the Search

Update the `handle_web_search` function in `tools.py`. Replace the placeholder with:

```python
# Add this import at the top of tools.py
from duckduckgo_search import DDGS


# ------------------------------------------
# Web Search — DuckDuckGo (no API key needed)
# ------------------------------------------

def handle_web_search(query: str, count: int = 5) -> str:
    """Search the web using DuckDuckGo."""
    try:
        ddgs = DDGS()
        results = list(ddgs.text(query, max_results=min(count, 10)))

        if not results:
            return json.dumps({"results": [], "message": "No results found"})

        formatted = []
        for item in results:
            formatted.append({
                "title": item.get("title", ""),
                "url": item.get("href", ""),
                "snippet": item.get("body", ""),
            })

        return json.dumps({"results": formatted, "query": query})

    except Exception as e:
        return json.dumps({"error": f"Search failed: {str(e)}", "query": query})
```

## Updated tools.py

Here is the complete, updated file with all imports and the real search implementation:

```python
# tools.py
# ==========================================
# Tool Definitions and Implementations
# ==========================================

import json
import math
from duckduckgo_search import DDGS

# ------------------------------------------
# Storage for saved notes (in-memory)
# ------------------------------------------
saved_notes: list[dict] = []

# ------------------------------------------
# Tool Schemas
# ------------------------------------------

TOOLS = [
    {
        "name": "web_search",
        "description": (
            "Search the web for current information on a topic. "
            "Use this when you need up-to-date facts, statistics, news, "
            "or information beyond your training data. "
            "Returns a list of search results with titles, URLs, and snippets."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query. Be specific for better results."
                },
                "count": {
                    "type": "integer",
                    "description": "Number of results to return (1-10). Default is 5.",
                    "default": 5
                }
            },
            "required": ["query"]
        }
    },
    {
        "name": "calculator",
        "description": (
            "Perform mathematical calculations. Use this for any arithmetic, "
            "percentages, unit conversions, or statistical calculations. "
            "Supports standard math operations and common functions like "
            "sqrt, log, pow, round, abs, min, max."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": (
                        "Mathematical expression to evaluate. "
                        "Examples: '(150 * 1.08) / 12', 'sqrt(144)', 'round(3.14159, 2)'"
                    )
                }
            },
            "required": ["expression"]
        }
    },
    {
        "name": "save_note",
        "description": (
            "Save an important finding or note during research. "
            "Use this to record key facts, statistics, or insights "
            "that should be included in the final research report. "
            "Notes are accumulated throughout the research session."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "Short title for this note"
                },
                "content": {
                    "type": "string",
                    "description": "The content of the note — facts, quotes, or analysis"
                },
                "source": {
                    "type": "string",
                    "description": "Where this information came from (URL or description)"
                }
            },
            "required": ["title", "content"]
        }
    },
]

# ------------------------------------------
# Tool Handlers
# ------------------------------------------

SAFE_MATH = {
    "sqrt": math.sqrt, "log": math.log, "log10": math.log10,
    "pow": pow, "abs": abs, "round": round,
    "min": min, "max": max, "sum": sum,
    "pi": math.pi, "e": math.e,
    "ceil": math.ceil, "floor": math.floor,
}


def handle_calculator(expression: str) -> str:
    """Evaluate a math expression safely."""
    try:
        result = eval(expression, {"__builtins__": {}}, SAFE_MATH)
        return json.dumps({"result": result, "expression": expression})
    except Exception as e:
        return json.dumps({"error": str(e), "expression": expression})


def handle_save_note(title: str, content: str, source: str = "not specified") -> str:
    """Save a research note to the session."""
    note = {"title": title, "content": content, "source": source}
    saved_notes.append(note)
    return json.dumps({
        "status": "saved",
        "note_number": len(saved_notes),
        "title": title,
    })


def handle_web_search(query: str, count: int = 5) -> str:
    """Search the web using DuckDuckGo."""
    try:
        ddgs = DDGS()
        results = list(ddgs.text(query, max_results=min(count, 10)))

        if not results:
            return json.dumps({"results": [], "message": "No results found"})

        formatted = []
        for item in results:
            formatted.append({
                "title": item.get("title", ""),
                "url": item.get("href", ""),
                "snippet": item.get("body", ""),
            })

        return json.dumps({"results": formatted, "query": query})

    except Exception as e:
        return json.dumps({"error": f"Search failed: {str(e)}", "query": query})


# ------------------------------------------
# Tool Router
# ------------------------------------------

def execute_tool(tool_name: str, tool_input: dict) -> str:
    """Route a tool call to the correct handler."""
    if tool_name == "web_search":
        return handle_web_search(**tool_input)
    elif tool_name == "calculator":
        return handle_calculator(**tool_input)
    elif tool_name == "save_note":
        return handle_save_note(**tool_input)
    else:
        return json.dumps({"error": f"Unknown tool: {tool_name}"})
```

## Test It

```bash
python agent.py
```

Now try: `"Search for the latest news about AI agents and summarize the top 3 results"`

You should see real search results flowing through the `[Tool]` output, and Claude will summarize them in its final response.

---

[← Agent Loop](05-agent-loop.md) | [Next: Step 7 - Memory and Context →](07-memory-and-context.md)
