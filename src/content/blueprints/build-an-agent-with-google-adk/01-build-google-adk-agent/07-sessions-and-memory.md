# Step 7: Sessions and Memory

One-Line Summary: Add session management and state persistence so your agent remembers context across conversations — using ADK's built-in session services.

Prerequisites: Working agent with web search from Step 6

---

## The Problem

Right now, each conversation session exists only in memory. If the server restarts, everything is gone. And there is no way to share state between turns beyond what the conversation history captures.

ADK solves this with three concepts:

| Concept | What It Does |
|---------|-------------|
| **Session** | A single conversation thread — messages, state, and metadata |
| **State** | Key-value data attached to a session — persists across turns |
| **Memory** | Long-term knowledge that spans multiple sessions |

## Sessions in ADK

A **Session** is the container for one conversation. It holds:

- The message history (what the user said, what the agent responded)
- State variables (custom data you want to persist)
- Metadata (user ID, session ID, timestamps)

```python
from google.adk.sessions import InMemorySessionService

session_service = InMemorySessionService()

# Create a new session
session = await session_service.create_session(
    app_name="research_app",
    user_id="user_1",
    session_id="session_abc",
)

# The session tracks everything automatically
# as the Runner processes messages
```

## State: Persistent Key-Value Data

State lets your tools store and retrieve data that persists across turns within a session. You access it through the `ToolContext`:

```python
# research_agent/tools.py (updated with state)
# ==========================================
# Tools with state management
# ==========================================

import math
from google.adk.tools import ToolContext


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


def save_note(title: str, content: str, tool_context: ToolContext, source: str = "not specified") -> dict:
    """Save an important finding or note during research.

    Use this tool to record key facts, statistics, or insights
    that should be included in the final research report.
    Notes are accumulated throughout the research session.

    Args:
        title: A short title for this note.
        content: The content — facts, quotes, or analysis.
        tool_context: Provided automatically by ADK.
        source: Where this information came from (URL or description).

    Returns:
        Confirmation that the note was saved.
    """
    # Retrieve existing notes from session state
    notes = tool_context.state.get("research_notes", [])

    # Add the new note
    note = {"title": title, "content": content, "source": source}
    notes.append(note)

    # Save back to session state — persists across turns
    tool_context.state["research_notes"] = notes

    return {
        "status": "saved",
        "note_number": len(notes),
        "title": title,
    }


def get_notes(tool_context: ToolContext) -> dict:
    """Retrieve all saved research notes from this session.

    Use this tool to review what has been recorded so far,
    especially when compiling a final summary or report.

    Args:
        tool_context: Provided automatically by ADK.

    Returns:
        All saved notes and the total count.
    """
    notes = tool_context.state.get("research_notes", [])
    return {
        "notes": notes,
        "total": len(notes),
    }
```

### How ToolContext Works

When ADK sees `tool_context: ToolContext` as a parameter, it automatically injects the context — Gemini never sees this parameter. It just calls `save_note(title="...", content="...")` and ADK fills in the rest.

The `tool_context.state` dictionary:

- **Reads and writes** like a normal Python dict
- **Persists** across turns within the same session
- **Tracks changes** automatically — the session service saves deltas

## State Scopes

ADK supports different scopes for state data using key prefixes:

```python
# Session-scoped (default) — lives for this conversation only
tool_context.state["research_notes"] = [...]

# User-scoped — persists across all sessions for this user
tool_context.state["user:preferred_language"] = "English"

# App-scoped — shared across all users and sessions
tool_context.state["app:total_queries"] = 42

# Temporary — exists only during this execution, not saved
tool_context.state["temp:working_data"] = {...}
```

| Prefix | Scope | Use Case |
|--------|-------|----------|
| *(none)* | Session | Notes, findings, conversation-specific data |
| `user:` | User | Preferences, saved settings across sessions |
| `app:` | Application | Global counters, shared configuration |
| `temp:` | Temporary | Working data that should not persist |

## Session Service Options

For development, `InMemorySessionService` is fine. For production, ADK offers persistent options:

```python
# Development — fast, no setup, data lost on restart
from google.adk.sessions import InMemorySessionService
session_service = InMemorySessionService()

# Production — persists to a database
from google.adk.sessions import DatabaseSessionService
session_service = DatabaseSessionService(
    db_url="sqlite+aiosqlite:///./agent_sessions.db"
)
```

| Service | Persistence | Best For |
|---------|-------------|----------|
| `InMemorySessionService` | None | Development and testing |
| `DatabaseSessionService` | SQLite, PostgreSQL, MySQL | Production deployments |
| `VertexAiSessionService` | Vertex AI managed | Cloud-scale production |

## Test Sessions in Action

```bash
adk web
```

Try a multi-turn research session:

1. `"Search for the top 3 AI companies by market cap"`
2. `"Save a note with those findings"`
3. `"Now search for their revenue growth rates and calculate the average"`
4. `"Save that as a note too"`
5. `"Show me all my notes and compile a summary"`

The agent remembers everything — search results, saved notes, and conversation context — because it is all stored in the session.

## Key Takeaways

- **Sessions** track entire conversations — messages, state, and metadata
- **`ToolContext`** gives tools access to session state — just add it as a parameter
- **State persists** across turns within a session — no manual storage needed
- **Scope prefixes** (`user:`, `app:`, `temp:`) control how long data lives
- **`DatabaseSessionService`** provides persistence for production use

---

**Reference:** [ADK Sessions](https://google.github.io/adk-docs/sessions/session/) · [ADK State](https://google.github.io/adk-docs/sessions/state/) · [ADK Memory](https://google.github.io/adk-docs/sessions/memory/)

[← Web Search](06-web-search.md) | [Next: Step 8 - Deploy to Cloud Run →](08-deploy-to-cloud-run.md)
