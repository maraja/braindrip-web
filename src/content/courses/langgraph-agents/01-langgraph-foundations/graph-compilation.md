# Graph Compilation

**One-Line Summary**: Calling `builder.compile()` validates the graph structure, resolves all edges and nodes, and returns a frozen, executable `CompiledGraph` object that supports invoke, stream, and async execution.

**Prerequisites**: `what-is-langgraph.md`, `state-and-state-schema.md`, `nodes.md`, `edges-and-routing.md`

## What Is Graph Compilation?

Building a LangGraph application is like drafting an architectural blueprint. You sketch rooms (nodes) and corridors (edges) on the `StateGraph` builder. But a blueprint is not a building — you cannot walk through it. **Compilation** is the moment the blueprint is reviewed by an inspector, certified, and turned into a structure you can actually use. The inspector checks that every corridor leads somewhere, every room is reachable, and the floor plan is structurally sound. Once approved, the building is locked — no more changes.

`builder.compile()` performs this validation and returns a `CompiledGraph`, which implements the LangChain Runnable interface. This means you get a consistent API — `invoke()`, `stream()`, `ainvoke()`, `astream()` — for executing your agent. Compilation happens once; the compiled graph is reused across many invocations.

## How It Works

### Basic Compilation

```python
from langgraph.graph import StateGraph, START, END

builder = StateGraph(AgentState)
builder.add_node("think", think_node)
builder.add_node("respond", respond_node)
builder.add_edge(START, "think")
builder.add_edge("think", "respond")
builder.add_edge("respond", END)

# Compile: validate + freeze
graph = builder.compile()
```

### Execution Methods

```python
# Full run — returns the final state
result = graph.invoke({"messages": ["Hello"], "step_count": 0})

# Streaming — yields chunks as nodes complete
for chunk in graph.stream({"messages": ["Hello"], "step_count": 0}):
    print(chunk)

# Async variants
result = await graph.ainvoke({"messages": ["Hello"], "step_count": 0})
async for chunk in graph.astream({"messages": ["Hello"], "step_count": 0}):
    print(chunk)
```

### Compile with a Checkpointer

Passing a checkpointer enables persistence, time-travel, and human-in-the-loop interrupts:

```python
from langgraph.checkpoint.memory import MemorySaver

memory = MemorySaver()
graph = builder.compile(checkpointer=memory)

# Each invocation requires a thread_id when using a checkpointer
config = {"configurable": {"thread_id": "user-123"}}
result = graph.invoke({"messages": ["Hi"]}, config=config)
```

### Compile with Interrupt Points

You can specify nodes where execution should pause for human review:

```python
graph = builder.compile(
    checkpointer=memory,
    interrupt_before=["execute_action"],  # pause before this node
)
```

### Compile with a Store

A `Store` provides cross-thread, long-term memory:

```python
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()
graph = builder.compile(
    checkpointer=memory,
    store=store,
)
```

### What Compile Validates

The compilation step checks for:

1. **All edges resolve** — every target name matches a registered node or `END`.
2. **No orphaned nodes** — every node is reachable from `START`.
3. **Entry point exists** — at least one edge leaves `START`.
4. **Exit path exists** — at least one path eventually reaches `END`.
5. **No duplicate node names** — each node name is unique.

If validation fails, LangGraph raises a descriptive error at compile time, not at runtime.

## Why It Matters

1. **Fail-fast validation** — Structural errors surface immediately at compile time rather than mid-execution when a user is waiting.
2. **Immutable runtime graph** — After compilation, the graph cannot be modified, ensuring consistent behavior across invocations.
3. **Unified execution API** — The Runnable interface means compiled graphs compose with other LangChain runnables and can be deployed uniformly.
4. **Configuration injection** — Checkpointers, stores, and interrupt points are attached at compile time, separating infrastructure concerns from graph logic.

## Key Technical Details

- `builder.compile()` returns a `CompiledGraph` instance that implements the `Runnable` protocol.
- The compiled graph is immutable — calling `add_node` or `add_edge` after compile has no effect.
- `invoke()` returns the complete final state dict after the graph reaches `END`.
- `stream()` yields a dict per node execution: `{"node_name": {partial_state_update}}`.
- `astream_events()` provides fine-grained streaming including LLM token-by-token output.
- A graph without a checkpointer is stateless between invocations — each call starts fresh.
- Compilation is fast (milliseconds) and should be done once at application startup, not per request.

## Common Misconceptions

- **"You can modify the graph after compiling."** The compiled graph is frozen. To change structure, modify the builder and compile again.
- **"compile() runs the graph."** Compilation only validates and freezes. Execution happens when you call `invoke()` or `stream()`.
- **"You need a checkpointer for basic usage."** Checkpointers are optional. Without one, the graph runs statelessly — fine for single-turn tasks.
- **"stream() only works with LLM token streaming."** `stream()` yields state updates per node. For token-level streaming, use `astream_events()`.

## Connections to Other Concepts

- `what-is-langgraph.md` — Compilation is the final step of the define-build-compile lifecycle.
- `nodes.md` — Compile validates that all registered nodes are reachable and correctly typed.
- `edges-and-routing.md` — Compile ensures every edge target resolves to a valid node.
- `state-and-state-schema.md` — The state schema is locked at compile time and cannot change between invocations.
- `../04-memory-and-persistence/` — Checkpointers passed at compile time enable persistence and replay.
- `../06-streaming/` — Streaming modes are invoked on the compiled graph object.

## Further Reading

- [LangGraph Compilation Reference](https://langchain-ai.github.io/langgraph/concepts/low_level/#compiling-your-graph) — Official docs on compile options.
- [LangGraph Checkpointer Guide](https://langchain-ai.github.io/langgraph/concepts/persistence/) — How checkpointers integrate with compilation.
- [LangChain Runnable Interface](https://python.langchain.com/docs/concepts/runnables/) — The protocol that `CompiledGraph` implements.
- [LangGraph Streaming Guide](https://langchain-ai.github.io/langgraph/concepts/streaming/) — All streaming modes available on compiled graphs.
