# Nodes

**One-Line Summary**: Nodes are Python functions that receive the current graph state, perform a unit of work, and return a partial state update dict — they are the computational building blocks of every LangGraph application.

**Prerequisites**: `what-is-langgraph.md`, `state-and-state-schema.md`

## What Are Nodes?

Think of nodes as stations on an assembly line. Each station receives the product (state), performs one specific operation — welding, painting, inspection — and passes the updated product to the next station via the conveyor belt (edges). A station never reaches over to another station to grab parts; it works only with what arrives on the belt and sends only what it changed.

In LangGraph, a node is any Python callable that accepts the current state as its first argument and returns a dictionary containing only the fields it wants to update. The framework handles merging that partial update back into the full state using the reducers defined in the schema. Nodes are deliberately simple — they are ordinary functions, not special classes — which means you can unit-test them with a plain dict.

Nodes can do anything: call an LLM, execute a tool, query a database, run business logic, or simply transform data. The only contract is: take state in, return a partial update out.

## How It Works

### Defining a Node

```python
from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    step_count: int

def call_llm(state: AgentState) -> dict:
    # Read from state
    last_message = state["messages"][-1]
    # Do work (call an LLM, run logic, etc.)
    response = f"Echo: {last_message}"
    # Return ONLY the keys you want to update
    return {
        "messages": [response],
        "step_count": state["step_count"] + 1,
    }
```

### Registering Nodes on the Graph

```python
from langgraph.graph import StateGraph, START, END

builder = StateGraph(AgentState)

# Pass the function directly — the string is the node's name
builder.add_node("call_llm", call_llm)

# Or let LangGraph use the function name automatically
builder.add_node(call_llm)  # node name becomes "call_llm"
```

### Nodes That Call LLMs

```python
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o")

def assistant(state: AgentState) -> dict:
    response = model.invoke(state["messages"])
    return {"messages": [response]}
```

### Nodes That Return Nothing

A node can signal "no changes" by returning an empty dict or `None`:

```python
def log_state(state: AgentState) -> dict:
    print(f"Current step: {state['step_count']}")
    return {}  # State is unchanged
```

### Nodes as Classes

Any callable works, including class instances with `__call__`:

```python
class RateLimitedNode:
    def __init__(self, max_calls: int):
        self.max_calls = max_calls
        self.call_count = 0

    def __call__(self, state: AgentState) -> dict:
        self.call_count += 1
        if self.call_count > self.max_calls:
            return {"messages": ["Rate limit reached."]}
        return {"messages": [f"Call {self.call_count}"]}

builder.add_node("rate_limited", RateLimitedNode(max_calls=5))
```

### Full Mini-Graph

```python
builder = StateGraph(AgentState)
builder.add_node("assistant", assistant)
builder.add_node("log", log_state)

builder.add_edge(START, "assistant")
builder.add_edge("assistant", "log")
builder.add_edge("log", END)

graph = builder.compile()
result = graph.invoke({"messages": ["Hello!"], "step_count": 0})
```

## Why It Matters

1. **Testability** — Each node is a pure function of state, so you can test it in isolation with a simple dict input.
2. **Composability** — Nodes are interchangeable; swap one LLM-calling node for a mock without touching the rest of the graph.
3. **Observability** — Because each node has a name, streaming and tracing tools can report exactly which step is executing.
4. **Separation of concerns** — Business logic, LLM calls, and data transformations live in distinct, named functions.

## Key Technical Details

- A node function signature is `(state: StateType) -> dict | None`.
- The returned dict must contain only keys that exist in the state schema.
- Returning a key triggers its reducer; omitting a key leaves it unchanged.
- Node names must be unique strings within a graph; duplicate names raise an error at compile time.
- Nodes execute synchronously by default; define `async def` nodes for async execution.
- A compiled sub-graph can be added as a node via `builder.add_node("sub", compiled_subgraph)`.
- LangGraph does not impose a limit on the number of nodes in a graph.

## Common Misconceptions

- **"Nodes must return the entire state."** Nodes return only the keys they modify. LangGraph merges the partial update into the existing state.
- **"Nodes can mutate the state dict passed to them."** Mutating the input state directly leads to undefined behavior. Always return a new dict.
- **"Every node must call an LLM."** Nodes are generic Python functions. Many nodes contain pure business logic, data validation, or routing preparation with no LLM involvement.
- **"Node execution order is alphabetical."** Order is determined entirely by edges. Node names have no effect on execution sequence.

## Connections to Other Concepts

- `state-and-state-schema.md` — Defines the schema and reducers that govern how node returns are merged.
- `edges-and-routing.md` — Edges wire nodes together and determine execution order.
- `graph-compilation.md` — Compile step validates that every node is reachable and properly connected.
- `the-command-api.md` — An alternative return type that lets a node update state and route simultaneously.
- `../02-tools-and-models/` — Practical patterns for nodes that invoke LLMs and tools.
- `../03-building-your-first-agent/` — End-to-end example assembling nodes into a working agent.

## Further Reading

- [LangGraph Nodes Documentation](https://langchain-ai.github.io/langgraph/concepts/low_level/#nodes) — Official reference for node registration and behavior.
- [LangGraph How-To: Add Nodes](https://langchain-ai.github.io/langgraph/how-tos/) — Step-by-step recipes for common node patterns.
- [Python Callables](https://docs.python.org/3/reference/datamodel.html#object.__call__) — Background on why classes with `__call__` work as nodes.
