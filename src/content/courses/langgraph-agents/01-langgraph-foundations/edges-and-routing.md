# Edges and Routing

**One-Line Summary**: Edges define execution flow between nodes — static edges for fixed paths, conditional edges for dynamic routing based on state, and parallel edges for concurrent fan-out execution.

**Prerequisites**: `what-is-langgraph.md`, `state-and-state-schema.md`, `nodes.md`

## What Are Edges?

If nodes are the rooms in a building, edges are the hallways and doors connecting them. Some hallways are fixed — you always walk from the lobby to the elevator. Others have a guard who checks your badge (state) and sends you left or right. And sometimes a hallway forks into two parallel corridors that you walk simultaneously, merging again at a common room downstream.

LangGraph provides three edge types to model these patterns: **normal (static) edges** for unconditional transitions, **conditional edges** where a routing function inspects state and picks the next node, and **parallel fan-out edges** where multiple edges from a single source trigger concurrent execution. Two sentinel values — `START` and `END` — mark where execution begins and terminates.

## How It Works

### Normal (Static) Edges

A static edge creates a fixed connection. After node A finishes, node B always runs next.

```python
from langgraph.graph import StateGraph, START, END

builder = StateGraph(AgentState)
builder.add_node("step_one", step_one)
builder.add_node("step_two", step_two)

builder.add_edge(START, "step_one")
builder.add_edge("step_one", "step_two")
builder.add_edge("step_two", END)
```

### Conditional Edges

A conditional edge calls a routing function that examines state and returns the name of the next node (or `END`).

```python
def should_continue(state: AgentState) -> str:
    last_message = state["messages"][-1]
    # If the LLM made tool calls, route to the tool node
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    # Otherwise, finish
    return END

builder.add_conditional_edges(
    source="assistant",
    path=should_continue,           # routing function
    path_map={                      # optional: explicit mapping
        "tools": "tool_executor",
        END: END,
    },
)
```

The `path_map` is optional. If omitted, the routing function's return value must exactly match a node name or `END`.

### Parallel Fan-Out Edges

Adding multiple static edges from the same source causes all targets to execute concurrently:

```python
builder.add_edge(START, "fetch_weather")
builder.add_edge(START, "fetch_news")
builder.add_edge(START, "fetch_stocks")

# All three run in parallel; results merge via reducers
builder.add_edge("fetch_weather", "summarize")
builder.add_edge("fetch_news", "summarize")
builder.add_edge("fetch_stocks", "summarize")
```

When parallel nodes update the same state key, reducers (e.g., `operator.add`) ensure correct merging.

### Conditional Fan-Out

A routing function can return a **list** of node names to trigger parallel conditional execution:

```python
def route_to_specialists(state: AgentState) -> list[str]:
    needed = []
    if "weather" in state["query"]:
        needed.append("weather_agent")
    if "finance" in state["query"]:
        needed.append("finance_agent")
    return needed if needed else [END]

builder.add_conditional_edges("classifier", route_to_specialists)
```

### The START and END Sentinels

```python
from langgraph.graph import START, END

# START — the entry point; edges from START define which nodes run first
# END   — the exit point; equivalent to the string "__end__"
builder.add_edge(START, "first_node")
builder.add_edge("last_node", END)
```

## Why It Matters

1. **Dynamic control flow** — Conditional edges let the LLM's output determine what happens next, enabling tool-use loops, retry logic, and branching conversations.
2. **Parallelism for free** — Fan-out edges run nodes concurrently without manual threading, reducing latency for independent tasks.
3. **Readable architecture** — The graph's edge structure is a visual flowchart of your agent's logic, making it easy to audit and explain.
4. **Cycle support** — Conditional edges can route back to earlier nodes, enabling iterative agent loops (e.g., ReAct-style tool calling).

## Key Technical Details

- `add_edge(a, b)` creates a static edge from node `a` to node `b`.
- `add_conditional_edges(source, path, path_map=None)` creates a conditional edge.
- The routing function receives the full current state and must return a `str` or `list[str]`.
- `END` is interchangeable with the string `"__end__"`.
- Parallel branches must eventually converge to a common downstream node; orphaned branches fail at compile time.
- A conditional edge's `path_map` can map return values to different node names, decoupling routing logic from node naming.
- Routing functions should be fast and side-effect-free; heavy logic belongs in nodes.

## Common Misconceptions

- **"Conditional edges call the next node's function."** The routing function only returns a name. LangGraph then invokes the corresponding node.
- **"You cannot have cycles in the graph."** Conditional edges can route back to previous nodes, forming loops. This is how tool-calling agents iterate.
- **"Fan-out edges require special syntax."** Simply adding multiple `add_edge` calls from the same source node is enough to trigger parallel execution.
- **"The routing function can modify state."** Routing functions must be pure — they read state and return a string. Use `the-command-api.md` if you need to update state and route simultaneously.

## Connections to Other Concepts

- `nodes.md` — Edges connect the nodes that do the actual computation.
- `state-and-state-schema.md` — Reducers resolve conflicts when parallel branches update the same key.
- `graph-compilation.md` — Compile step validates that all edges resolve to registered nodes.
- `the-command-api.md` — Alternative to conditional edges that combines routing with state updates.
- `../05-human-in-the-loop/` — Interrupt points often sit on edges to pause before a critical node.
- `../07-multi-agent-systems/` — Multi-agent handoffs rely heavily on conditional routing.

## Further Reading

- [LangGraph Edges Documentation](https://langchain-ai.github.io/langgraph/concepts/low_level/#edges) — Official reference for all edge types.
- [LangGraph Conditional Edges How-To](https://langchain-ai.github.io/langgraph/how-tos/branching/) — Recipes for branching and fan-out patterns.
- [LangGraph Parallel Execution](https://langchain-ai.github.io/langgraph/concepts/low_level/#send) — Details on concurrent node execution and state merging.
