# Step 4: Define Tools

One-Line Summary: Define three tools — web search, calculator, and save note — using Claude's tool-use format so the model can take real actions.

Prerequisites: Basic Claude call from Step 3

---

## How Claude Tool Use Works

When you pass tools to the Messages API, Claude can choose to call them. The flow is:

1. You define tools as JSON schemas (name, description, input parameters)
2. Claude sees the tool definitions and decides when to use them
3. When Claude wants to use a tool, it returns a `tool_use` content block with the tool name and arguments
4. You execute the tool and return the result
5. Claude uses the result to continue reasoning

The tool definitions are the contract between your code and Claude. Good descriptions help Claude pick the right tool at the right time.

## Define the Tools

Create `tools.py` with the tool definitions and their implementations:

```python
# tools.py
# ==========================================
# Tool Definitions and Implementations
# ==========================================
# Each tool has two parts:
# 1. A schema (tells Claude what the tool does and what inputs it needs)
# 2. A handler function (actually executes the tool)

import json
import math

# ------------------------------------------
# Storage for saved notes (in-memory)
# ------------------------------------------
saved_notes: list[dict] = []

# ------------------------------------------
# Tool Schemas — sent to Claude with each request
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
# Tool Handlers — execute tool calls
# ------------------------------------------

# Safe math functions available to the calculator
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
        # Evaluate with only safe math functions — no builtins
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
    """Placeholder — we implement the real version in Step 6."""
    return json.dumps({
        "results": [
            {
                "title": f"Search result for: {query}",
                "url": "https://example.com",
                "snippet": "This is a placeholder. We will implement real search in Step 6."
            }
        ]
    })


# ------------------------------------------
# Tool Router — maps tool names to handlers
# ------------------------------------------

def execute_tool(tool_name: str, tool_input: dict) -> str:
    """Route a tool call to the correct handler and return the result."""
    if tool_name == "web_search":
        return handle_web_search(**tool_input)
    elif tool_name == "calculator":
        return handle_calculator(**tool_input)
    elif tool_name == "save_note":
        return handle_save_note(**tool_input)
    else:
        return json.dumps({"error": f"Unknown tool: {tool_name}"})
```

## Test the Tools Locally

```python
# test_tools.py
# ==========================================
# Verify tools work before connecting to Claude
# ==========================================

from tools import execute_tool, saved_notes

# Test calculator
result = execute_tool("calculator", {"expression": "sqrt(144) + 10 * 2"})
print(f"Calculator: {result}")

# Test save_note
result = execute_tool("save_note", {
    "title": "Test Finding",
    "content": "AI agent market expected to reach $65B by 2030",
    "source": "https://example.com/report"
})
print(f"Save note: {result}")
print(f"Notes saved: {len(saved_notes)}")

# Test web_search (placeholder for now)
result = execute_tool("web_search", {"query": "AI agents 2025"})
print(f"Web search: {result}")
```

```bash
python test_tools.py
```

The calculator and note-saving work now. Web search returns a placeholder — we will wire up the real implementation in Step 6.

---

[← Basic Claude Call](03-basic-claude-call.md) | [Next: Step 5 - Agent Loop →](05-agent-loop.md)
