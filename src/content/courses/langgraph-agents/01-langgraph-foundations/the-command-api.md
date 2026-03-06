# The Command API

**One-Line Summary**: The `Command` object lets a node simultaneously update state and control routing in a single return value, replacing the need for separate conditional edges in many scenarios.

**Prerequisites**: `what-is-langgraph.md`, `state-and-state-schema.md`, `nodes.md`, `edges-and-routing.md`

## What Is the Command API?

Picture an air traffic controller who can both update a flight's status on the board *and* direct it to a specific runway in a single radio call. Without this ability, you would need one person to update the board and a separate person to wave the plane to the runway. That two-step separation is what happens when you use a normal node return (update state) plus a separate conditional edge (pick the next node).

The `Command` API collapses both actions into one. A node returns a `Command` object that carries a state update *and* a routing directive. This is especially powerful in multi-agent systems where one agent decides both what to record and which agent should act next — a pattern called a **handoff**.

Before `Command`, achieving this required a routing function that re-read state to figure out what the node had just decided. With `Command`, the decision and the routing happen atomically in the same return.

## How It Works

### Basic Command Usage

```python
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command
from typing import Literal

def triage(state: AgentState) -> Command[Literal["billing", "technical"]]:
    query = state["messages"][-1]
    if "invoice" in query.lower():
        return Command(
            update={"messages": ["Routing to billing..."]},
            goto="billing",
        )
    return Command(
        update={"messages": ["Routing to technical support..."]},
        goto="technical",
    )
```

The type hint `Command[Literal["billing", "technical"]]` tells LangGraph (and the compile validator) which nodes this function may route to.

### Registering a Command-Returning Node

```python
builder = StateGraph(AgentState)
builder.add_node("triage", triage)
builder.add_node("billing", billing_node)
builder.add_node("technical", technical_node)

builder.add_edge(START, "triage")
# No conditional edge needed — Command handles routing
builder.add_edge("billing", END)
builder.add_edge("technical", END)

graph = builder.compile()
```

Notice there is no `add_conditional_edges` call from `triage`. The `Command` return handles it.

### Multi-Agent Handoff Pattern

```python
def supervisor(state: AgentState) -> Command[Literal["researcher", "coder", "__end__"]]:
    # Ask the LLM which agent should act next
    response = llm.invoke(state["messages"])
    next_agent = parse_routing(response)

    return Command(
        update={"messages": [response]},
        goto=next_agent,  # "researcher", "coder", or "__end__"
    )
```

The supervisor simultaneously records the LLM's response in state and routes to the chosen sub-agent.

### Command with goto=END

To terminate the graph from within a node:

```python
from langgraph.graph import END

def maybe_done(state: AgentState) -> Command[Literal["continue", "__end__"]]:
    if state["step_count"] > 10:
        return Command(update={"messages": ["Max steps reached."]}, goto=END)
    return Command(update={"step_count": state["step_count"] + 1}, goto="continue")
```

### Command with Multiple Destinations (Fan-Out)

`goto` can accept a list for parallel execution:

```python
def dispatch(state: AgentState) -> Command[Literal["fetch_a", "fetch_b"]]:
    return Command(
        update={"messages": ["Dispatching parallel tasks..."]},
        goto=["fetch_a", "fetch_b"],
    )
```

## Why It Matters

1. **Atomic update + route** — Eliminates the gap between "what the node decided" and "where the graph goes next," reducing bugs in complex flows.
2. **Cleaner multi-agent handoffs** — A supervisor node picks the next agent and records its reasoning in a single return, the canonical pattern for LangGraph multi-agent systems.
3. **Fewer conditional edges** — Many graphs can replace `add_conditional_edges` with `Command`, resulting in less boilerplate and a cleaner builder definition.
4. **Type-safe routing** — The `Literal` type hint ensures the compile step validates that all target nodes actually exist.

## Key Technical Details

- `Command` is imported from `langgraph.types`.
- The `update` field is a dict identical to what a normal node would return — it is merged via reducers.
- The `goto` field accepts a node name string, `END` (or `"__end__"`), or a list of names for fan-out.
- The type hint `Command[Literal["a", "b"]]` is used by the compiler to register valid routing targets.
- If a node has a `Command` type hint, you do **not** need `add_conditional_edges` from that node.
- `Command` can be used alongside normal edges on other nodes in the same graph.
- A node can conditionally return either a `Command` or a plain dict — but mixing patterns reduces clarity.
- `Command` works with both `StateGraph` and `MessageGraph`.

## Common Misconceptions

- **"Command replaces all edges."** Command replaces conditional edges from the node that returns it. You still need static edges for other nodes.
- **"You must use Command for every node."** Command is optional. It is most valuable when a node needs to both update state and decide the next step. Simple nodes that always go to the same place should use static edges.
- **"The type hint is purely decorative."** `Command[Literal["a", "b"]]` is used at compile time to validate that the routing targets exist. Omitting or mistyping it can cause compile errors.
- **"Command cannot route to END."** It can. Use `goto=END` or `goto="__end__"` to terminate the graph.

## Connections to Other Concepts

- `edges-and-routing.md` — Command is an alternative to `add_conditional_edges` for dynamic routing.
- `nodes.md` — Command-returning nodes follow the same input signature but have a different return type.
- `state-and-state-schema.md` — The `update` field in a Command is merged using the same reducer logic as normal node returns.
- `graph-compilation.md` — The compiler reads `Command[Literal[...]]` type hints to validate routing targets.
- `../07-multi-agent-systems/` — The supervisor and handoff patterns rely heavily on Command.
- `../05-human-in-the-loop/` — Command can route to interrupt points for human approval before proceeding.

## Further Reading

- [LangGraph Command API Reference](https://langchain-ai.github.io/langgraph/concepts/low_level/#command) — Official documentation on the Command object.
- [LangGraph Multi-Agent Handoffs](https://langchain-ai.github.io/langgraph/concepts/multi_agent/#handoffs) — How Command enables agent-to-agent transfers.
- [LangGraph How-To: Command](https://langchain-ai.github.io/langgraph/how-tos/command/) — Step-by-step recipes using Command for routing.
