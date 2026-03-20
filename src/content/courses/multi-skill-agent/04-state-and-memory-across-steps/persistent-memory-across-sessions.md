# Persistent Memory Across Sessions

**One-Line Summary**: Working memory vanishes when an agent session ends; persistent memory uses checkpointing, databases, and long-term stores to let agents remember information across separate invocations.

**Prerequisites**: `conversation-as-working-memory.md`, `structured-state-management.md`

## What Is Persistent Memory?

Consider the difference between a conversation with a colleague and a conversation with a stranger on a train. Your colleague remembers last week's meeting, your project preferences, and where you left off on the shared task. The stranger knows nothing about you — every interaction starts from zero. Without persistent memory, every agent session is the stranger on the train.

Persistent memory is the mechanism by which an agent retains information across separate invocations — across different API calls, different user sessions, or even different days. When a user says "continue where we left off" or "use the same format as last time," they expect the agent to remember. Without persistence, the agent cannot.

There are two fundamentally different things to persist: **state** (where the agent was in a workflow, what data it had collected) and **knowledge** (user preferences, learned facts, historical context). State enables resumption. Knowledge enables personalization. Both require storage outside the ephemeral conversation.

## How It Works

### Checkpointing with LangGraph

LangGraph provides built-in checkpointing that saves the full agent state — including conversation messages and structured state — after every step.

```python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.checkpoint.sqlite import SqliteSaver

# Option 1: In-memory checkpointing (lost on process restart)
memory_saver = InMemorySaver()

# Option 2: SQLite checkpointing (persists to disk)
sqlite_saver = SqliteSaver.from_conn_string("checkpoints.db")

# Build the graph with a checkpointer
graph = StateGraph(AgentState)
graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)
graph.set_entry_point("agent")
graph.add_edge("agent", "tools")
graph.add_edge("tools", "agent")

# Compile with the checkpointer
app = graph.compile(checkpointer=sqlite_saver)
```

### Thread IDs: The Key to Multi-Turn Persistence

Checkpointing alone is not enough — you need a way to associate a checkpoint with a specific conversation. Thread IDs solve this.

```python
# First invocation: start a new thread
config = {"configurable": {"thread_id": "user-alice-session-42"}}

result = app.invoke(
    {"messages": [{"role": "user", "content": "Find the Q4 revenue report"}]},
    config=config
)
# State is checkpointed under thread_id "user-alice-session-42"

# Later invocation: resume the same thread
# The agent picks up where it left off, with full message history
result = app.invoke(
    {"messages": [{"role": "user", "content": "Now email it to the finance team"}]},
    config=config  # Same thread_id
)
# The agent remembers the Q4 report from the previous invocation
```

Without the thread ID, the second invocation would have no idea what "it" refers to in "email it to the finance team." With the thread ID, the full conversation and state from the first invocation are loaded automatically.

### Database-Backed Persistence

For production systems, you need a real database — not SQLite or in-memory stores.

```python
from langgraph.checkpoint.postgres import PostgresSaver

# Production checkpointer with PostgreSQL
pg_saver = PostgresSaver.from_conn_string(
    "postgresql://user:pass@db-host:5432/agent_state"
)

app = graph.compile(checkpointer=pg_saver)
```

You can also build a custom persistence layer if you are not using LangGraph:

```python
import json
import redis
from datetime import datetime, timedelta

class AgentMemoryStore:
    """Custom persistent memory using Redis."""

    def __init__(self, redis_url="redis://localhost:6379"):
        self.redis = redis.from_url(redis_url)

    def save_session(self, thread_id: str, state: dict, ttl_hours=72):
        """Save agent state with expiration."""
        key = f"agent:session:{thread_id}"
        self.redis.setex(
            key,
            timedelta(hours=ttl_hours),
            json.dumps(state, default=str)
        )

    def load_session(self, thread_id: str) -> dict | None:
        """Load previous session state, if it exists."""
        key = f"agent:session:{thread_id}"
        data = self.redis.get(key)
        if data:
            return json.loads(data)
        return None

    def save_user_preferences(self, user_id: str, prefs: dict):
        """Save long-term user preferences (no expiration)."""
        key = f"agent:prefs:{user_id}"
        self.redis.set(key, json.dumps(prefs))

    def load_user_preferences(self, user_id: str) -> dict:
        """Load user preferences."""
        key = f"agent:prefs:{user_id}"
        data = self.redis.get(key)
        return json.loads(data) if data else {}
```

### Long-Term Memory Stores

Beyond session state, agents benefit from long-term memory: facts learned across many sessions that inform future behavior.

```python
class LongTermMemory:
    """
    Stores facts the agent has learned about a user or domain
    across many sessions. Injected into the system prompt.
    """

    def __init__(self, db):
        self.db = db

    def remember(self, user_id: str, fact: str, source: str):
        """Store a fact learned during an agent session."""
        self.db.insert("memories", {
            "user_id": user_id,
            "fact": fact,
            "source": source,  # Which session/interaction produced this
            "created_at": datetime.now(),
            "access_count": 0,
        })

    def recall(self, user_id: str, limit=10) -> list[str]:
        """Retrieve the most relevant memories for this user."""
        memories = self.db.query(
            "SELECT fact FROM memories WHERE user_id = %s "
            "ORDER BY access_count DESC, created_at DESC LIMIT %s",
            (user_id, limit)
        )
        # Update access counts
        for m in memories:
            self.db.execute(
                "UPDATE memories SET access_count = access_count + 1 "
                "WHERE user_id = %s AND fact = %s",
                (user_id, m["fact"])
            )
        return [m["fact"] for m in memories]

    def inject_into_prompt(self, user_id: str, system_prompt: str) -> str:
        """Add remembered facts to the system prompt."""
        facts = self.recall(user_id)
        if not facts:
            return system_prompt
        memory_block = "\n## What You Know About This User\n"
        for fact in facts:
            memory_block += f"- {fact}\n"
        return system_prompt + memory_block


# Usage in agent initialization
memory = LongTermMemory(db)
memory.remember("alice", "Prefers reports in CSV format", "session-42")
memory.remember("alice", "Timezone is US/Pacific", "session-38")
memory.remember("alice", "Manager of the analytics team", "session-35")

# When Alice starts a new session, the agent already knows:
prompt = memory.inject_into_prompt("alice", BASE_SYSTEM_PROMPT)
# System prompt now includes:
# ## What You Know About This User
# - Prefers reports in CSV format
# - Timezone is US/Pacific
# - Manager of the analytics team
```

### Contrast: Working Memory vs. Persistent Memory

| Property | Working Memory (Conversation) | Persistent Memory (Storage) |
|----------|------------------------------|---------------------------|
| Lifetime | One session/invocation | Across sessions |
| Storage | In-memory (API call payload) | Database, file, or cache |
| Size limit | Context window (128K-200K tokens) | Practically unlimited |
| Access speed | Instant (already in context) | Requires load step |
| Cost | Tokens billed on every call | Storage costs only |
| Fidelity | Exact messages preserved | May be summarized |
| Risk of loss | Lost when session ends | Survives restarts |

### Deciding What to Persist

Not everything should be persisted. Persisting too much creates noise; persisting too little forces users to repeat themselves.

```python
PERSISTENCE_RULES = """
ALWAYS persist:
- User preferences (format, timezone, communication style)
- Task outcomes (what was accomplished, key results)
- Error patterns (what failed and why, to avoid repeating)

SOMETIMES persist:
- Intermediate state (only if the task might be resumed)
- Tool results (only if they are expensive to reproduce)

NEVER persist:
- Raw conversation logs (too verbose, summarize instead)
- Sensitive data (API keys, passwords, PII without consent)
- Transient state (retry counts, temporary variables)
"""
```

## Why It Matters

### Users Expect Continuity

Humans have persistent memory. When a user says "remember that I like weekly reports in PDF," they expect the agent to honor that forever — not just for the current conversation. Agents without persistent memory feel broken and untrustworthy. Every session starts cold, and the user must re-explain their preferences every time.

### Resumption Saves Time and Money

A complex task interrupted at step 8 of 12 should be resumable, not restartable. Without checkpointing, the user must re-run the entire task from the beginning. With checkpointing, the agent resumes at step 9. This saves the cost of 8 redundant steps and the user's time.

## Key Technical Details

- LangGraph's `InMemorySaver` is suitable for development; use `PostgresSaver` or `SqliteSaver` for production
- Thread IDs should encode user identity and session context (e.g., `user-{user_id}-session-{session_id}`)
- Checkpoint size for a 10-step agent is typically 5-20 KB of serialized state
- Redis with a 72-hour TTL is a common pattern for session state that may be resumed
- Long-term memory injection into the system prompt should be limited to 10-20 facts (~200-400 tokens) to avoid context pollution
- Memory retrieval can use vector similarity search for relevance-based recall instead of recency-based
- GDPR and data privacy regulations require that persistent user data be deletable on request
- Checkpoint storage costs are negligible compared to API costs — a PostgreSQL row per step is pennies vs. dollars per API call

## Common Misconceptions

**"The LLM remembers previous conversations"**: It does not. Every API call starts fresh. Any appearance of memory is because your application code loads previous state and includes it in the messages. The model itself is stateless.

**"Persistent memory means storing the entire conversation"**: Storing raw conversations is wasteful and creates privacy risks. Instead, extract and store structured facts, preferences, and task outcomes. A 50-token summary of a 5,000-token conversation captures the useful information at 1% of the storage cost.

**"You need a vector database for agent memory"**: Vector databases are useful for semantic search over large memory collections, but most agents benefit more from simple key-value or relational storage. If you have fewer than 100 facts per user, a PostgreSQL table with a text column works fine. Vector search becomes valuable when you have thousands of memories and need relevance-based retrieval.

## Connections to Other Concepts

- `conversation-as-working-memory.md` — Persistent memory extends working memory beyond the boundaries of a single session
- `structured-state-management.md` — Structured state is what gets checkpointed; well-designed state schemas make persistence straightforward
- `context-window-pressure.md` — Persistent memory can offload information from the context window, reducing pressure
- `system-prompt-as-agent-dna.md` — Long-term memories are injected into the system prompt to inform the agent's behavior
- `when-to-stop.md` — Agents that checkpoint can be safely terminated and later resumed, making termination less costly

## Further Reading

- LangGraph Documentation, "Persistence and Checkpointing" (2024) — Official guide on InMemorySaver, SqliteSaver, and PostgresSaver
- Park et al., "Generative Agents: Interactive Simulacra of Human Behavior" (2023) — Comprehensive memory architecture with reflection and retrieval
- Packer et al., "MemGPT: Towards LLMs as Operating Systems" (2023) — Virtual memory management for LLMs, paging context in and out
- Letta (formerly MemGPT), "Building Agents with Persistent Memory" (2024) — Production patterns for long-term agent memory
