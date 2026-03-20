# Step 4: Add Custom Tools

One-Line Summary: Define custom Python functions as tools — a calculator and a note saver — and connect them to your agent so Gemini can call them.

Prerequisites: Working agent from Step 3

---

## How ADK Tools Work

In ADK, any Python function can become a tool. The framework inspects your function's **name**, **docstring**, **parameters**, and **type hints** to generate a schema that tells Gemini what the tool does and how to call it.

The flow:

1. You write a regular Python function
2. You add it to your agent's `tools` list
3. ADK generates a schema from the function signature
4. Gemini sees the schema and decides when to call the function
5. ADK executes the function and returns the result to Gemini

No JSON schemas to write by hand. No separate registration step. Just Python functions.

## Create the Tools File

Create `research_agent/tools.py` with two custom tools:

```python
# research_agent/tools.py
# ==========================================
# Custom tools for the research agent
# ==========================================
# Each function becomes a tool that Gemini can call.
# ADK reads the function name, docstring, and type hints
# to generate the tool schema automatically.

import math

# ------------------------------------------
# In-memory storage for saved notes
# ------------------------------------------
saved_notes: list[dict] = []


def calculator(expression: str) -> dict:
    """Evaluate a mathematical expression and return the result.

    Use this tool for any arithmetic, percentages, unit conversions,
    or statistical calculations during research.

    Args:
        expression: A mathematical expression to evaluate.
            Examples: '(150 * 1.08) / 12', 'sqrt(144)', 'round(3.14159, 2)'

    Returns:
        A dictionary with the result or an error message.
    """
    # Safe math functions — no access to builtins
    safe_functions = {
        "sqrt": math.sqrt, "log": math.log, "log10": math.log10,
        "pow": pow, "abs": abs, "round": round,
        "min": min, "max": max, "sum": sum,
        "pi": math.pi, "e": math.e,
        "ceil": math.ceil, "floor": math.floor,
    }
    try:
        result = eval(expression, {"__builtins__": {}}, safe_functions)
        return {"result": result, "expression": expression}
    except Exception as e:
        return {"error": str(e), "expression": expression}


def save_note(title: str, content: str, source: str = "not specified") -> dict:
    """Save an important finding or note during research.

    Use this tool to record key facts, statistics, or insights
    that should be included in the final research report.
    Notes are accumulated throughout the research session.

    Args:
        title: A short title for this note.
        content: The content — facts, quotes, or analysis.
        source: Where this information came from (URL or description).

    Returns:
        Confirmation that the note was saved.
    """
    note = {"title": title, "content": content, "source": source}
    saved_notes.append(note)
    return {
        "status": "saved",
        "note_number": len(saved_notes),
        "title": title,
    }


def get_notes() -> dict:
    """Retrieve all saved research notes from this session.

    Use this tool to review what has been recorded so far,
    especially when compiling a final summary or report.

    Returns:
        All saved notes and the total count.
    """
    return {
        "notes": saved_notes,
        "total": len(saved_notes),
    }
```

## Why This Pattern Works

Notice how each tool function follows the same pattern:

1. **Clear function name** — `calculator`, `save_note`, `get_notes`. Gemini uses the name to understand what the tool does.
2. **Detailed docstring** — This is the tool's description. The more specific it is, the better Gemini will use it.
3. **Type hints on parameters** — `expression: str`, `title: str`. ADK uses these to build the input schema.
4. **Return a dictionary** — Structured results that Gemini can reason about.

> **Key insight:** The docstring matters more than you might think. It is the primary way Gemini understands *when* to use a tool. Write it like you are explaining the tool to a colleague.

## Connect Tools to the Agent

Update `research_agent/agent.py` to import and use the tools:

```python
# research_agent/agent.py
# ==========================================
# Research agent with custom tools
# ==========================================

from google.adk.agents import Agent
from .tools import calculator, save_note, get_notes

root_agent = Agent(
    name="research_agent",
    model="gemini-2.5-flash",
    description="A research assistant that investigates topics and compiles reports.",
    instruction="""You are a research agent. Your job is to help users investigate topics,
analyze information, and compile research reports.

Your tools:
- calculator: Perform any mathematical calculations
- save_note: Record important findings as you research
- get_notes: Review all saved notes

Your approach:
1. Break the user's request into specific research questions
2. Use the calculator for any numerical analysis
3. Save key findings as notes with save_note
4. Use get_notes to review findings before writing a final summary

Guidelines:
- Use save_note to record critical findings as you go
- Be thorough but concise — quality over quantity
- If you cannot find information, say so honestly""",
    tools=[calculator, save_note, get_notes],
)
```

## Test It

Start the web UI and try your tools:

```bash
adk web
```

Try these prompts:

- `"What is the square root of 1764?"` — Gemini will use the calculator
- `"Save a note titled 'Test' with content 'Custom tools are working'"` — uses save_note
- `"What notes do I have saved?"` — uses get_notes
- `"Calculate compound interest on $10,000 at 5% for 10 years, then save the result as a note"` — uses both tools

Watch the tool calls in the web UI. You can see exactly what Gemini decides to call and what comes back.

## Using FunctionTool Explicitly

ADK automatically wraps your functions as `FunctionTool` objects. But you can do it explicitly for more control:

```python
from google.adk.tools import FunctionTool

# Explicit wrapping — same result as passing the function directly
calculator_tool = FunctionTool(func=calculator)

root_agent = Agent(
    name="research_agent",
    model="gemini-2.5-flash",
    tools=[calculator_tool, save_note, get_notes],
    # ...
)
```

This is useful when you need to customize tool behavior or use advanced features like `ToolContext` (covered in later steps).

## Key Takeaways

- **Any Python function can be a tool** — ADK reads the signature and docstring to generate the schema
- **Docstrings are critical** — they tell Gemini when and how to use the tool
- **Type hints define the input schema** — use `str`, `int`, `float`, `bool`, and `list`
- **Return dictionaries** — structured data that Gemini can reason about
- **`FunctionTool`** wraps functions explicitly when you need more control

---

**Reference:** [ADK Function Tools](https://google.github.io/adk-docs/tools-custom/function-tools/) · [ADK Custom Tools](https://google.github.io/adk-docs/tools-custom/)

[← Your First Agent](03-your-first-agent.md) | [Next: Step 5 - The Agent Loop →](05-the-agent-loop.md)
