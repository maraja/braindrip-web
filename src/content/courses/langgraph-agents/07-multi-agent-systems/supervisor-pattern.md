# Supervisor Pattern

**One-Line Summary**: A central supervisor agent receives every user request, decides which specialist sub-agent should handle it, routes work via conditional edges, and aggregates results before deciding the next step.

**Prerequisites**: `nodes.md`, `edges-and-routing.md`, `state-and-state-schema.md`

## What Is the Supervisor Pattern?

Imagine an emergency dispatch center. Every 911 call reaches the same dispatcher, who listens to the situation and routes it to fire, police, or medical services. The specialist handles the emergency and reports back; the dispatcher then decides whether to send additional units or close the case. No specialist ever talks to another specialist directly -- all coordination flows through the central dispatcher.

In LangGraph, the supervisor pattern works the same way. A single supervisor node receives the user request, analyzes it, and sets a `next_agent` field that conditional edges use for routing. The chosen specialist node runs, returns its output, and control flows back to the supervisor. The supervisor inspects the result and either routes to another specialist or ends the conversation.

This hub-and-spoke topology is the most common multi-agent architecture because it is simple to reason about, easy to extend with new specialists, and naturally centralizes decision-making in one LLM call.

## How It Works

### Defining the State

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class SupervisorState(TypedDict):
    messages: Annotated[list, add_messages]
    next_agent: str
```

The `next_agent` field acts as a routing signal. The supervisor writes to it; conditional edges read from it.

### Building the Supervisor and Specialists

```python
from langchain_openai import ChatOpenAI

supervisor_llm = ChatOpenAI(model="gpt-4o")
research_llm = ChatOpenAI(model="gpt-4o-mini")
writing_llm = ChatOpenAI(model="gpt-4o-mini")

def supervisor(state):
    response = supervisor_llm.invoke(state["messages"])
    return {"messages": [response], "next_agent": response.next_agent}

def research_agent(state):
    result = research_llm.invoke(state["messages"])
    return {"messages": [result]}

def writing_agent(state):
    result = writing_llm.invoke(state["messages"])
    return {"messages": [result]}
```

### Wiring the Graph

```python
from langgraph.graph import StateGraph, START, END

builder = StateGraph(SupervisorState)
builder.add_node("supervisor", supervisor)
builder.add_node("researcher", research_agent)
builder.add_node("writer", writing_agent)

builder.add_edge(START, "supervisor")
builder.add_conditional_edges("supervisor", lambda s: s["next_agent"])
builder.add_edge("researcher", "supervisor")
builder.add_edge("writer", "supervisor")

graph = builder.compile()
```

Every specialist has a fixed edge back to the supervisor. The supervisor is the only node with conditional outbound edges, keeping the routing logic in one place.

### Ending the Loop

The supervisor can route to `END` when the task is complete:

```python
builder.add_conditional_edges(
    "supervisor",
    lambda s: s["next_agent"],
    {"researcher": "researcher", "writer": "writer", "FINISH": END},
)
```

## Why It Matters

1. **Centralized control** -- one node owns all routing decisions, making the system easier to debug and audit.
2. **Easy extensibility** -- adding a new specialist is one `add_node` call plus one edge back to the supervisor.
3. **Clear responsibility** -- each specialist focuses on a single domain; the supervisor handles orchestration only.
4. **Natural observability** -- every routing decision passes through a single point that can be logged and traced.

## Key Technical Details

- The supervisor node typically uses structured output or tool calling to produce the `next_agent` value reliably.
- Conditional edges read from state, so the routing field must be set before the edge evaluates.
- Specialists should not set `next_agent`; only the supervisor should control routing.
- The supervisor can invoke multiple specialists sequentially by looping through them one at a time.
- Adding a checkpointer enables pausing between any supervisor-specialist handoff for human review.
- The supervisor's system prompt should list available specialists and describe when to use each one.
- Cost can be managed by using a cheaper model for specialists and reserving a stronger model for the supervisor.

## Common Misconceptions

- **"Specialists can route to each other directly."** In the supervisor pattern, all routing goes through the supervisor. Direct specialist-to-specialist communication is the handoff pattern, not the supervisor pattern.
- **"The supervisor must be a more powerful model."** The supervisor needs good routing judgment, but a well-prompted smaller model often suffices. Specialist models may need more capability for domain-specific tasks.
- **"You need one LLM per specialist."** Multiple specialists can share the same underlying model with different system prompts and tool bindings.
- **"The supervisor pattern scales to dozens of agents."** With many specialists, the supervisor's routing prompt becomes unwieldy. Beyond 5-7 specialists, consider hierarchical supervisors or the handoff pattern.

## Connections to Other Concepts

- `subgraph-architecture.md` -- encapsulating each specialist as an independent subgraph for better isolation
- `agent-handoffs.md` -- the peer-to-peer alternative where agents route directly to each other
- `evaluator-optimizer-pattern.md` -- a specialized two-agent loop that can live inside a supervisor system
- `edges-and-routing.md` -- the conditional edges mechanism that powers supervisor routing
- `structured-output.md` -- ensuring the supervisor produces reliable routing decisions

## Further Reading

- [LangGraph Multi-Agent Supervisor Tutorial](https://langchain-ai.github.io/langgraph/tutorials/multi_agent/agent_supervisor/)
- [LangGraph Multi-Agent Concepts](https://langchain-ai.github.io/langgraph/concepts/multi_agent/)
- [LangGraph Conditional Edges Documentation](https://langchain-ai.github.io/langgraph/concepts/low_level/#conditional-edges)
