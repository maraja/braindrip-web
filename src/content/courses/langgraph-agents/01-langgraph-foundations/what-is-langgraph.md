# What Is LangGraph

**One-Line Summary**: LangGraph is a low-level orchestration framework that models AI agent logic as a directed graph of nodes, edges, and shared state.

**Prerequisites**: None

## What Is LangGraph?

Think of LangGraph as a railroad switching yard. Each track section (node) performs a specific job — loading cargo, inspecting cars, coupling engines — and the switches (edges) determine which track a train follows next. The shared manifest traveling with the train (state) keeps every station informed about what has happened so far. Unlike a single straight track where you have no control over stops, LangGraph gives you explicit control over every junction.

LangGraph is a Python (and TypeScript) framework built by the LangChain team for constructing stateful, multi-step AI agent applications. While it shares a parent organization with LangChain, it is a standalone library — you can use it without importing anything from `langchain`. Its core abstraction is a directed graph where **nodes** are units of work, **edges** define execution flow, and **state** is the shared data structure that every node can read from and write to.

The key differentiator is control. Many agent frameworks treat the reasoning loop as a black box: you hand the LLM a prompt and tools, and it decides everything. LangGraph inverts this — you design the exact topology of decisions, fallbacks, and parallel paths your agent can take, while still letting the LLM make dynamic choices at specific branch points.

## How It Works

### The Three Primitives

Every LangGraph application is built from three pieces:

1. **State** — a shared data object (typically a `TypedDict`) that flows through the graph.
2. **Nodes** — Python functions that read state, do work, and return updates.
3. **Edges** — connections that determine which node runs next.

### Minimal Example

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class AgentState(TypedDict):
    question: str
    answer: str

def think(state: AgentState) -> dict:
    return {"answer": f"Thinking about: {state['question']}"}

def respond(state: AgentState) -> dict:
    return {"answer": state["answer"] + " ...done!"}

# Build the graph
builder = StateGraph(AgentState)
builder.add_node("think", think)
builder.add_node("respond", respond)

builder.add_edge(START, "think")
builder.add_edge("think", "respond")
builder.add_edge("respond", END)

graph = builder.compile()
result = graph.invoke({"question": "What is LangGraph?"})
print(result["answer"])  # "Thinking about: What is LangGraph? ...done!"
```

### Graph Lifecycle

1. **Define** the state schema.
2. **Add nodes** — each is a callable that receives state and returns a partial update.
3. **Add edges** — static, conditional, or parallel.
4. **Compile** — validates the graph and produces a runnable object.
5. **Invoke / Stream** — execute the graph with an initial state.

## Why It Matters

1. **Explicit control flow** — You can see, test, and debug every path your agent can take, unlike opaque ReAct loops.
2. **Built-in persistence** — Checkpointing lets you pause, resume, and replay agent runs across server restarts.
3. **Human-in-the-loop by design** — The graph can pause at any node, wait for human approval, and resume.
4. **Multi-agent composition** — Each sub-agent can be its own graph, then composed into a parent graph as a single node.
5. **Streaming-first** — Every node transition and state update can be streamed to clients in real time.

## Key Technical Details

- LangGraph is installed via `pip install langgraph` (separate package from `langchain`).
- The `StateGraph` class is the primary builder; it is parameterized by the state type.
- `START` and `END` are sentinel objects imported from `langgraph.graph`; the string `"__end__"` is equivalent to `END`.
- Graphs are compiled once and can be invoked many times with different inputs.
- Supports both sync (`invoke`, `stream`) and async (`ainvoke`, `astream`) execution.
- A `checkpointer` can be passed at compile time to enable persistence and time-travel debugging.
- LangGraph Platform provides deployment infrastructure but the core library runs anywhere.

## Common Misconceptions

- **"LangGraph requires LangChain."** Incorrect. LangGraph depends only on `langgraph-checkpoint` and a few lightweight packages. You can use any LLM client — OpenAI SDK, Anthropic SDK, or raw HTTP calls.
- **"LangGraph is just another wrapper around LLM calls."** It is an orchestration framework. It does not call LLMs itself; your node functions do.
- **"Graphs must be acyclic."** LangGraph fully supports cycles, which is how iterative agent loops (tool-calling, reflection) are implemented.
- **"You need to learn graph theory."** The API is add_node / add_edge. If you can draw a flowchart, you can build a LangGraph application.

## Connections to Other Concepts

- `state-and-state-schema.md` — Deep dive into the shared state object referenced here.
- `nodes.md` — Details on how node functions receive and return state.
- `edges-and-routing.md` — Full coverage of static, conditional, and parallel edges.
- `graph-compilation.md` — What happens when you call `builder.compile()`.
- `../02-tools-and-models/` — How to wire LLMs and tools into nodes.

## Further Reading

- [LangGraph Official Documentation](https://langchain-ai.github.io/langgraph/) — Canonical reference for all APIs and concepts.
- [LangGraph GitHub Repository](https://github.com/langchain-ai/langgraph) — Source code, examples, and issue tracker.
- [LangGraph "Why LangGraph?" Guide](https://langchain-ai.github.io/langgraph/concepts/why-langgraph/) — The team's own explanation of design motivations.
