# Step 7: Memory and Context

One-Line Summary: Add conversation history and context management so your agent can handle multi-turn research sessions without losing track of earlier findings.

Prerequisites: Working agent with web search from Step 6

---

## The Problem

Right now, each call to `run_agent` can maintain context within a single research task (Claude sees the tool calls and results). But between separate requests, the agent forgets everything. A user cannot say "search for X" and then later say "compare that with Y" — the agent has no memory of the first request.

We need two things:

1. **Conversation history** — persist messages across multiple turns
2. **Context management** — prevent the conversation from growing too large

## Session-Based Memory

Create a session manager that stores conversation history keyed by session ID:

```python
# memory.py
# ==========================================
# Session Memory and Context Management
# ==========================================
# Stores conversation history per session and manages
# context window size to stay within token limits.

import time
import json
from dataclasses import dataclass, field

# ------------------------------------------
# Session data structure
# ------------------------------------------

@dataclass
class Session:
    """Holds the state for one research session."""
    session_id: str
    messages: list = field(default_factory=list)
    notes: list = field(default_factory=list)
    created_at: float = field(default_factory=time.time)
    last_active: float = field(default_factory=time.time)

    def add_user_message(self, content: str):
        """Add a user message to the conversation."""
        self.messages.append({"role": "user", "content": content})
        self.last_active = time.time()

    def add_assistant_message(self, content):
        """Add an assistant message (can be text or content blocks)."""
        self.messages.append({"role": "assistant", "content": content})
        self.last_active = time.time()

    def add_tool_results(self, tool_results: list):
        """Add tool results as a user message."""
        self.messages.append({"role": "user", "content": tool_results})
        self.last_active = time.time()


# ------------------------------------------
# Session store — in-memory for now
# ------------------------------------------

class SessionStore:
    """Manages multiple research sessions."""

    def __init__(self, max_sessions: int = 100):
        self._sessions: dict[str, Session] = {}
        self._max_sessions = max_sessions

    def get_or_create(self, session_id: str) -> Session:
        """Get an existing session or create a new one."""
        if session_id not in self._sessions:
            # Evict oldest session if at capacity
            if len(self._sessions) >= self._max_sessions:
                self._evict_oldest()
            self._sessions[session_id] = Session(session_id=session_id)
        return self._sessions[session_id]

    def delete(self, session_id: str):
        """Delete a session."""
        self._sessions.pop(session_id, None)

    def _evict_oldest(self):
        """Remove the least recently active session."""
        if not self._sessions:
            return
        oldest_id = min(self._sessions, key=lambda k: self._sessions[k].last_active)
        del self._sessions[oldest_id]


# ------------------------------------------
# Singleton store instance
# ------------------------------------------

store = SessionStore()
```

## Context Window Management

Claude has a context window limit. Long research sessions with many tool calls can fill it up. Add a trimming strategy:

```python
# Add this function to memory.py

def trim_conversation(messages: list, max_pairs: int = 20) -> list:
    """
    Trim conversation history to stay within context limits.

    Strategy: Keep the first user message (establishes the research topic)
    and the most recent message pairs. This preserves the original request
    and recent context while dropping older tool call/result cycles.

    Args:
        messages: Full conversation history
        max_pairs: Maximum number of message pairs to keep

    Returns:
        Trimmed message list
    """
    if len(messages) <= max_pairs * 2:
        return messages

    # Always keep the first message (the original research request)
    first_message = messages[0]

    # Keep the most recent messages
    recent_messages = messages[-(max_pairs * 2 - 1):]

    # Add a summary marker so Claude knows history was trimmed
    summary_marker = {
        "role": "user",
        "content": (
            "[System note: Earlier parts of this conversation were trimmed "
            "to save space. The original request and recent context are preserved. "
            "Refer to any saved notes for key findings from earlier in the session.]"
        ),
    }

    return [first_message, summary_marker] + recent_messages
```

## Update the Agent to Use Sessions

Update `agent.py` to use session-based memory:

```python
# agent.py (updated run_agent function)
# ==========================================
# Agent loop with session memory
# ==========================================

from memory import store, trim_conversation

def run_agent(user_message: str, session_id: str = "default") -> str:
    """
    Run the agent loop with session memory.

    Args:
        user_message: The user's input
        session_id: Session identifier for conversation continuity

    Returns:
        The agent's final text response
    """
    # Get or create the session
    session = store.get_or_create(session_id)

    # Add the user message to session history
    session.add_user_message(user_message)

    # Trim if conversation is getting long
    working_messages = trim_conversation(session.messages)

    iterations = 0

    while iterations < MAX_ITERATIONS:
        iterations += 1

        # Send to Claude
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=working_messages,
        )

        # Claude is done — return the text
        if response.stop_reason == "end_turn":
            assistant_text = ""
            for block in response.content:
                if block.type == "text":
                    assistant_text += block.text

            # Save to session history
            session.add_assistant_message(response.content)
            return assistant_text

        # Claude wants to use tools
        if response.stop_reason == "tool_use":
            # Add assistant response to both working and session messages
            working_messages.append({"role": "assistant", "content": response.content})
            session.add_assistant_message(response.content)

            # Execute each tool call
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    print(f"  [Tool] {block.name}({block.input})")
                    result = execute_tool(block.name, block.input)
                    print(f"  [Result] {result[:200]}...")

                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            # Add tool results
            working_messages.append({"role": "user", "content": tool_results})
            session.add_tool_results(tool_results)

    return "Reached maximum research steps for this turn."
```

## Test Multi-Turn Conversations

```bash
python agent.py
```

Now try a multi-turn session:

1. `"Search for the top 3 programming languages in 2025"`
2. `"Now compare those with the top languages from 5 years ago"`
3. `"Save a note summarizing the trends you found"`

The agent remembers what it found in step 1 when answering step 2 — that is session memory in action.

---

[← Web Search Tool](06-web-search-tool.md) | [Next: Step 8 - Deploy as API →](08-deploy-as-api.md)
