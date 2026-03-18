# Step 6: Web Search Tool

One-Line Summary: Replace the placeholder web search with a real implementation using httpx and the Brave Search API so your agent can find current information.

Prerequisites: Agent loop from Step 5, a Brave Search API key

---

## Why Brave Search

Your agent needs access to current information. The Brave Search API gives you:

- **Web results** with titles, URLs, and descriptions
- **A free tier** with 2,000 queries per month
- **A simple REST API** — one endpoint, one query parameter

Other options work too (SerpAPI, Tavily, Google Custom Search), but Brave has the best free tier for learning.

## Implement the Search

Update the `handle_web_search` function in `tools.py`. Replace the placeholder with:

```python
# Add this import at the top of tools.py
import httpx
from config import BRAVE_API_KEY

# ------------------------------------------
# Web Search — Brave Search API
# ------------------------------------------

async def handle_web_search_async(query: str, count: int = 5) -> str:
    """Search the web using Brave Search API."""
    url = "https://api.search.brave.com/res/v1/web/search"
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": BRAVE_API_KEY,
    }
    params = {
        "q": query,
        "count": min(count, 10),  # Brave allows up to 20, we cap at 10
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()

        # Extract the web results
        results = []
        for item in data.get("web", {}).get("results", [])[:count]:
            results.append({
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "snippet": item.get("description", ""),
            })

        if not results:
            return json.dumps({"results": [], "message": "No results found"})

        return json.dumps({"results": results, "query": query})

    except httpx.TimeoutException:
        return json.dumps({"error": "Search request timed out", "query": query})
    except httpx.HTTPStatusError as e:
        return json.dumps({"error": f"Search API error: {e.response.status_code}", "query": query})
    except Exception as e:
        return json.dumps({"error": f"Search failed: {str(e)}", "query": query})


def handle_web_search(query: str, count: int = 5) -> str:
    """Synchronous wrapper for web search."""
    import asyncio
    return asyncio.run(handle_web_search_async(query, count))
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
import asyncio
import httpx
from config import BRAVE_API_KEY

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


async def handle_web_search_async(query: str, count: int = 5) -> str:
    """Search the web using Brave Search API."""
    url = "https://api.search.brave.com/res/v1/web/search"
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": BRAVE_API_KEY,
    }
    params = {"q": query, "count": min(count, 10)}

    try:
        async with httpx.AsyncClient() as http_client:
            response = await http_client.get(url, headers=headers, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()

        results = []
        for item in data.get("web", {}).get("results", [])[:count]:
            results.append({
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "snippet": item.get("description", ""),
            })

        if not results:
            return json.dumps({"results": [], "message": "No results found"})

        return json.dumps({"results": results, "query": query})

    except httpx.TimeoutException:
        return json.dumps({"error": "Search request timed out", "query": query})
    except httpx.HTTPStatusError as e:
        return json.dumps({"error": f"Search API error: {e.response.status_code}", "query": query})
    except Exception as e:
        return json.dumps({"error": f"Search failed: {str(e)}", "query": query})


def handle_web_search(query: str, count: int = 5) -> str:
    """Synchronous wrapper for web search."""
    return asyncio.run(handle_web_search_async(query, count))


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
