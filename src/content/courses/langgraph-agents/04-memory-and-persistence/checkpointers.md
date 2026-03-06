# Checkpointers

**One-Line Summary**: Checkpointers save graph state at every step, enabling persistence, human-in-the-loop workflows, memory, time travel, and fault recovery.

**Prerequisites**: `graph-state.md`, `stategraph-and-nodes.md`, `compiling-and-invoking.md`

## What Are Checkpointers?

Think of a checkpointer as an automatic save system in a video game. Every time you complete a level (a node in your graph), the game saves your progress. If you quit and come back later, you pick up exactly where you left off. If you make a mistake, you can reload a previous save and try a different path.

In LangGraph, a checkpointer automatically snapshots the entire graph state after every node execution. This single mechanism unlocks five powerful capabilities: persistence between sessions (your agent remembers past conversations), human-in-the-loop (pause execution, get human input, resume), memory across conversations (the agent accumulates knowledge), time travel (replay or branch from any previous state), and fault recovery (restart from the last successful step after a crash).

Without a checkpointer, every graph invocation starts from scratch. The agent has no memory, no ability to pause, and no way to recover from failures. Adding a checkpointer is often the single most impactful change you can make to a LangGraph agent.

## How It Works

### Choosing a Checkpointer Backend

LangGraph provides three checkpointer backends for different stages of development:

```python
import sqlite3
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.checkpoint.postgres import PostgresSaver

# Development only -- state lives in process memory, lost on restart
memory = MemorySaver()

# Local persistence -- state saved to a SQLite file on disk
checkpointer = SqliteSaver(sqlite3.connect("agent.db"))

# Production -- state in PostgreSQL, supports concurrent access
checkpointer = PostgresSaver(connection_string="postgresql://user:pass@host/db")
```

### Compiling with a Checkpointer

Attach the checkpointer when you compile the graph. This is the only integration point -- nodes and edges remain unchanged:

```python
graph = builder.compile(checkpointer=checkpointer)
```

### Thread-Based Invocation

Every invocation requires a `thread_id` in the config. The checkpointer uses this to organize state per conversation:

```python
config = {"configurable": {"thread_id": "user-123"}}

# First invocation -- starts fresh
result = graph.invoke({"messages": [("user", "Hi, I'm Alice")]}, config=config)

# Second invocation -- same thread, agent remembers Alice
result = graph.invoke({"messages": [("user", "What's my name?")]}, config=config)
```

### Inspecting Saved State

Retrieve the current state or full history for any thread:

```python
# Current state and which node runs next
state = graph.get_state(config)
print(state.values["messages"])
print(state.next)  # tuple of next node names

# Full checkpoint history for time travel
for checkpoint in graph.get_state_history(config):
    print(checkpoint.config["configurable"]["checkpoint_id"])
```

## Why It Matters

1. **Conversational memory becomes trivial** -- just add a checkpointer and every thread automatically remembers its full history.
2. **Human-in-the-loop is built in** -- pause at any node via `interrupt_before` or `interrupt_after`, then resume with `graph.invoke(None, config)`.
3. **Production reliability** -- if a node fails mid-execution, restarting the graph picks up from the last successful checkpoint rather than replaying the entire workflow.
4. **Debugging superpowers** -- replay any conversation from any point in time to reproduce bugs or test alternative paths.
5. **Zero node-level changes** -- checkpointing is orthogonal to your graph logic; add or remove it without touching a single node function.

## Key Technical Details

- Checkpoints are saved **after** each node executes, not before.
- `MemorySaver` is an alias for `InMemorySaver` -- both are in-process and non-persistent across restarts.
- `SqliteSaver` requires `langgraph-checkpoint-sqlite`; `PostgresSaver` requires `langgraph-checkpoint-postgres`.
- The `thread_id` is the primary key for organizing state; different threads are fully isolated.
- `checkpoint_id` uniquely identifies a specific snapshot within a thread for time travel.
- Checkpointers store the full state object, not diffs, so storage grows with state size and step count.
- All checkpointer backends implement the same `BaseCheckpointSaver` interface, making them interchangeable.

## Common Misconceptions

- **"MemorySaver is fine for production."** MemorySaver stores everything in process memory. It is lost on restart and does not support multi-process deployments. Use PostgresSaver in production.
- **"You need to manually call save after each step."** Checkpointing is fully automatic. LangGraph saves state after every node execution without any explicit save calls.
- **"Checkpointers only store messages."** Checkpointers save the entire state object -- messages, counters, flags, tool results, and any custom fields you define.
- **"Each checkpoint stores only the diff from the previous one."** Each checkpoint stores the full state snapshot, which simplifies replay but means storage grows linearly with steps.

## Connections to Other Concepts

- `thread-based-memory.md` -- short-term memory that checkpointers directly enable
- `long-term-memory-store.md` -- cross-thread memory that complements checkpointers
- `state-inspection-and-replay.md` -- using checkpointer data for time travel and debugging
- `state-schema-design.md` -- designing state that checkpointers will persist
- `interrupt-and-resume.md` -- human-in-the-loop patterns powered by checkpointers
- `graph-state.md` -- the state object that checkpointers save and restore

## Further Reading

- [LangGraph Persistence Documentation](https://langchain-ai.github.io/langgraph/concepts/persistence/)
- [LangGraph Checkpointer How-To Guides](https://langchain-ai.github.io/langgraph/how-tos/#persistence)
- [PostgresSaver Setup Guide](https://langchain-ai.github.io/langgraph/how-tos/persistence_postgres/)
- [Human-in-the-Loop with Checkpointers](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/breakpoints/)
