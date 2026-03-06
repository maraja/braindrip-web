# Agent Handoffs

**One-Line Summary**: Agents transfer control directly to each other using the Command API, forming a peer network where any agent can hand off to any other without a central supervisor.

**Prerequisites**: `the-command-api.md`, `nodes.md`, `edges-and-routing.md`

## What Are Agent Handoffs?

Imagine a hospital where specialists refer patients directly to each other. A general practitioner examines you and refers you to a cardiologist. The cardiologist runs tests, decides you also need a nutritionist, and sends you there directly. No central scheduler is involved -- each doctor decides who the patient should see next based on their own expertise.

In LangGraph, agent handoffs work the same way using the `Command` object. Instead of returning a plain state dict, an agent returns `Command(update={...}, goto="agent_b")`, which simultaneously updates the state and transfers control to the target agent. This creates a decentralized peer network where any agent can route to any other agent.

The handoff pattern is ideal when agents have domain knowledge about which specialist should handle the next step. It avoids the bottleneck of a central supervisor and allows more natural, context-driven routing. The tradeoff is that routing logic is distributed across agents rather than centralized.

## How It Works

### Defining Agents with Command Returns

```python
from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.types import Command

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    current_agent: str

def triage_agent(state: AgentState) -> Command[Literal["billing", "technical", "FINISH"]]:
    # Analyze the request and decide who handles it
    user_msg = state["messages"][-1].content
    if "invoice" in user_msg or "payment" in user_msg:
        return Command(
            update={"current_agent": "billing"},
            goto="billing",
        )
    elif "error" in user_msg or "bug" in user_msg:
        return Command(
            update={"current_agent": "technical"},
            goto="technical",
        )
    return Command(update={}, goto="FINISH")
```

### Type Hints for Safe Routing

The `Command[Literal[...]]` return type tells LangGraph which nodes this agent can hand off to. The framework validates these at compile time:

```python
def billing_agent(state: AgentState) -> Command[Literal["technical", "triage"]]:
    result = billing_llm.invoke(state["messages"])
    if needs_technical_help(result):
        return Command(
            update={"messages": [result]},
            goto="technical",  # Direct handoff to peer
        )
    return Command(
        update={"messages": [result]},
        goto="triage",  # Hand back for next request
    )

def technical_agent(state: AgentState) -> Command[Literal["billing", "triage"]]:
    result = tech_llm.invoke(state["messages"])
    return Command(
        update={"messages": [result]},
        goto="triage",
    )
```

### Assembling the Peer Network

```python
builder = StateGraph(AgentState)
builder.add_node("triage", triage_agent)
builder.add_node("billing", billing_agent)
builder.add_node("technical", technical_agent)

builder.add_edge(START, "triage")
# No add_edge or add_conditional_edges needed between agents --
# Command handles all routing dynamically

graph = builder.compile()
```

Notice that no explicit edges are defined between agents. The `Command` return type declares the possible transitions, and LangGraph infers the graph structure from the type hints.

### Ending the Conversation

An agent can end the workflow by routing to `END`:

```python
from langgraph.graph import END

def final_agent(state) -> Command[Literal["__end__"]]:
    return Command(update={"messages": ["Done!"]}, goto=END)
```

## Why It Matters

1. **Decentralized routing** -- each agent decides the next step based on its own domain expertise, enabling more natural workflows.
2. **No bottleneck** -- removing the central supervisor eliminates a single point of failure and reduces unnecessary LLM calls.
3. **Compile-time safety** -- `Command[Literal[...]]` type hints ensure the graph structure is validated before runtime.
4. **Simpler wiring** -- no need for conditional edges or routing functions; the Command API replaces both.

## Key Technical Details

- `Command(update={...}, goto="node_name")` both updates state and routes in a single return.
- The `goto` value must match a registered node name or `END`.
- `Command[Literal["a", "b"]]` as a return type hint declares valid handoff targets for graph validation.
- When a node returns `Command`, LangGraph ignores any edges defined for that node.
- Multiple agents can hand off to the same target agent -- the network can have any topology.
- The `update` dict follows the same rules as normal node returns: partial state, merged via reducers.
- Handoffs work seamlessly with checkpointers -- each handoff creates a new checkpoint.
- You can mix Command-based nodes and edge-based nodes in the same graph.

## Common Misconceptions

- **"Handoffs require a supervisor to coordinate."** The entire point of the handoff pattern is that agents route directly to each other without any central coordinator.
- **"Command replaces edges entirely."** Command replaces the need for conditional edges between agents, but you still use `add_edge(START, ...)` for the entry point and can use edges for non-Command nodes.
- **"Agents can only hand off to one other agent."** The `Literal` type hint lists all possible targets. An agent can conditionally hand off to any of them at runtime.
- **"Handoff patterns are always better than supervisors."** Distributed routing is harder to debug and audit. When you need centralized control and clear accountability, the supervisor pattern is often preferable.

## Connections to Other Concepts

- `the-command-api.md` -- the foundational API that makes handoffs possible
- `supervisor-pattern.md` -- the centralized alternative to peer-to-peer handoffs
- `subgraph-architecture.md` -- handoff targets can be subgraphs with private internal state
- `edges-and-routing.md` -- Command-based routing as an alternative to conditional edges
- `evaluator-optimizer-pattern.md` -- can be implemented using handoffs between generator and evaluator

## Further Reading

- [LangGraph Command API Documentation](https://langchain-ai.github.io/langgraph/concepts/low_level/#command)
- [LangGraph Agent Handoffs Tutorial](https://langchain-ai.github.io/langgraph/how-tos/command/)
- [LangGraph Multi-Agent Concepts](https://langchain-ai.github.io/langgraph/concepts/multi_agent/)
