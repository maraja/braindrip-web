# State Inspection and Replay

**One-Line Summary**: Checkpointers let you inspect the current state, walk through the full history, and replay execution from any previous checkpoint -- enabling time travel for debugging and recovery.

**Prerequisites**: `checkpointers.md`, `thread-based-memory.md`, `graph-state.md`

## What Is State Inspection and Replay?

Imagine you have a security camera system that records every room in a building. At any moment you can check the live feed (current state), rewind the tape to see what happened at 2:47 PM (state history), or start a new recording branch from any point in the past (replay). That is exactly what LangGraph provides when you use a checkpointer.

Every time a node executes, the checkpointer saves a snapshot of the entire graph state. These snapshots form a timeline that you can inspect, search, and branch from. This is not just logging -- you can actually resume execution from any historical checkpoint, making it possible to debug issues, test alternative paths, and recover from errors by rolling back to a known good state.

State inspection and replay transform agent development from "run it and hope" to "run it, see everything that happened, and try again from any point." This is particularly valuable for complex multi-step agents where failures can occur deep in a workflow.

## How It Works

### Inspecting Current State

`get_state()` returns the current state of a thread along with metadata about what would execute next:

```python
config = {"configurable": {"thread_id": "debug-session"}}

# Run the graph
graph.invoke({"messages": [("user", "Analyze this data")]}, config=config)

# Inspect current state
state_snapshot = graph.get_state(config)

# The full state values
print(state_snapshot.values["messages"])

# Which nodes would run next (empty if graph is complete)
print(state_snapshot.next)  # e.g., ("tools",) or ()

# The checkpoint config for this exact snapshot
print(state_snapshot.config)
```

### Walking Through State History

`get_state_history()` returns every checkpoint in reverse chronological order:

```python
config = {"configurable": {"thread_id": "debug-session"}}

for snapshot in graph.get_state_history(config):
    checkpoint_id = snapshot.config["configurable"]["checkpoint_id"]
    node_count = len(snapshot.values.get("messages", []))
    next_nodes = snapshot.next

    print(f"Checkpoint: {checkpoint_id}")
    print(f"  Messages so far: {node_count}")
    print(f"  Next to execute: {next_nodes}")
    print()
```

### Replaying from a Specific Checkpoint

To resume execution from a historical checkpoint, include its `checkpoint_id` in the config:

```python
# Find the checkpoint you want to replay from
target_config = None
for snapshot in graph.get_state_history(config):
    if some_condition(snapshot):
        target_config = snapshot.config
        break

# Resume from that exact point -- pass None as input to continue
result = graph.invoke(None, config=target_config)
```

### Branching with Modified State

You can also modify state before replaying, creating an alternative execution branch:

```python
# Get a historical checkpoint
for snapshot in graph.get_state_history(config):
    if snapshot.next == ("agent",):
        # Update the state at this checkpoint
        graph.update_state(
            snapshot.config,
            {"messages": [("user", "Try a different approach instead")]}
        )
        # Resume from the modified state
        result = graph.invoke(None, config=snapshot.config)
        break
```

### Practical Debugging Workflow

```python
def debug_thread(graph, thread_id: str):
    """Print a complete execution trace for a thread."""
    config = {"configurable": {"thread_id": thread_id}}

    print(f"=== Execution trace for thread: {thread_id} ===\n")
    snapshots = list(graph.get_state_history(config))

    for i, snap in enumerate(reversed(snapshots)):
        step = len(snapshots) - i - 1
        msgs = snap.values.get("messages", [])
        last_msg = msgs[-1].content[:80] if msgs else "(empty)"
        print(f"Step {step}: next={snap.next} | last_msg={last_msg}")
```

## Why It Matters

1. **Debugging complex agents** -- instead of adding print statements and re-running, inspect the exact state at every step of a failed execution.
2. **Reproducing bugs** -- share a `thread_id` and `checkpoint_id` to reproduce the exact conditions that caused an issue.
3. **A/B testing agent behavior** -- replay from a checkpoint with different prompts, tools, or state modifications to compare outcomes.
4. **Error recovery** -- when a node fails partway through a long workflow, roll back to the last successful checkpoint and retry.
5. **Audit trails** -- maintain a complete record of every state transition for compliance or analysis.

## Key Technical Details

- `get_state()` returns a `StateSnapshot` with `values`, `next`, `config`, `metadata`, and `parent_config`.
- `get_state_history()` yields snapshots in reverse chronological order (newest first).
- Each snapshot's `config` contains a unique `checkpoint_id` that identifies that exact point in time.
- `update_state()` writes a new checkpoint with modified values, creating a branch in the history.
- Replaying from a checkpoint re-executes nodes from that point forward; it does not skip to the end.
- The `parent_config` field links each snapshot to its predecessor, forming a chain.

## Common Misconceptions

- **"Replay re-runs the entire graph from the start."** Replay starts from the specified checkpoint. All state up to that point is restored from the saved snapshot, and only subsequent nodes are re-executed.
- **"You can only inspect state after the graph finishes."** You can inspect state at any time, including while the graph is paused at an interrupt point.
- **"State history is only available with PostgresSaver."** All checkpointer backends (MemorySaver, SqliteSaver, PostgresSaver) support full state history and replay.
- **"update_state modifies the original checkpoint."** It creates a new checkpoint with the modified values. The original checkpoint remains unchanged, preserving the full history.

## Connections to Other Concepts

- `checkpointers.md` -- the persistence layer that makes inspection and replay possible
- `thread-based-memory.md` -- threads organize the state history being inspected
- `interrupt-and-resume.md` -- human-in-the-loop patterns that rely on state inspection
- `state-schema-design.md` -- well-designed state makes inspection output meaningful
- `long-term-memory-store.md` -- cross-thread knowledge that complements per-thread state history

## Further Reading

- [LangGraph Time Travel Guide](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/time-travel/)
- [LangGraph State Management Concepts](https://langchain-ai.github.io/langgraph/concepts/persistence/)
- [How to View and Update State](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/review-tool-calls/)
