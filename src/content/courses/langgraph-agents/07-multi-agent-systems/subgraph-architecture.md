# Subgraph Architecture

**One-Line Summary**: Each agent is a fully independent StateGraph with its own state schema, compiled separately and invoked as a single node inside a parent graph for maximum encapsulation and modularity.

**Prerequisites**: `nodes.md`, `state-and-state-schema.md`, `graph-compilation.md`

## What Is Subgraph Architecture?

Think of a large corporation with autonomous departments. The marketing department has its own internal processes, roles, and documents that the engineering department never sees. When the CEO needs a marketing campaign, they send a brief to marketing and receive a finished deliverable. The CEO does not manage marketing's internal steps -- they just provide input and receive output.

In LangGraph, a subgraph is a complete StateGraph that is compiled independently and then added as a node in a parent graph. The subgraph can have an entirely different state schema from the parent. It maintains private internal state that the parent never sees. State transformation happens at the boundaries -- input is mapped from parent state into the subgraph's schema on entry, and results are mapped back on exit.

This architecture is essential when building complex multi-agent systems where each agent has domain-specific internal logic, private working memory, and a different data model. The parent graph only knows the agent's public interface, not its internals.

## How It Works

### Defining a Subgraph with Its Own Schema

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

# The subgraph has its OWN state schema
class ResearchState(TypedDict):
    topic: str
    sources: list[str]
    draft: str
    internal_notes: list[str]  # Private -- parent never sees this

def gather_sources(state: ResearchState):
    return {"sources": ["arxiv.org/paper1", "arxiv.org/paper2"]}

def synthesize(state: ResearchState):
    summary = f"Research on {state['topic']} from {len(state['sources'])} sources"
    return {"draft": summary, "internal_notes": ["Used academic sources only"]}

research_builder = StateGraph(ResearchState)
research_builder.add_node("gather", gather_sources)
research_builder.add_node("synthesize", synthesize)
research_builder.add_edge(START, "gather")
research_builder.add_edge("gather", "synthesize")
research_builder.add_edge("synthesize", END)

research_graph = research_builder.compile()
```

### Embedding the Subgraph in a Parent Graph

```python
class ParentState(TypedDict):
    messages: Annotated[list, add_messages]
    research_output: str

def call_research(state: ParentState) -> dict:
    # Transform parent state into subgraph input
    result = research_graph.invoke({"topic": state["messages"][-1].content})
    # Transform subgraph output back to parent state
    return {"research_output": result["draft"]}

parent_builder = StateGraph(ParentState)
parent_builder.add_node("research", call_research)
parent_builder.add_edge(START, "research")
parent_builder.add_edge("research", END)

parent_graph = parent_builder.compile()
```

### Overlapping Keys for Automatic State Mapping

When parent and subgraph share key names, LangGraph can map state automatically:

```python
class ParentState(TypedDict):
    messages: Annotated[list, add_messages]
    topic: str

class SubState(TypedDict):
    topic: str          # Shared key -- mapped automatically
    internal_data: str  # Private key -- not visible to parent

sub_builder = StateGraph(SubState)
# ... add nodes and edges ...
sub_graph = sub_builder.compile()

parent_builder.add_node("sub_agent", sub_graph)  # Direct embedding
```

## Why It Matters

1. **Encapsulation** -- each agent's internal complexity is hidden behind a clean input/output boundary.
2. **Independent development** -- teams can build, test, and iterate on subgraphs without touching the parent.
3. **Schema isolation** -- subgraphs can track private fields like retry counts, intermediate drafts, or internal notes that would pollute the parent state.
4. **Reusability** -- a compiled subgraph can be embedded in multiple parent graphs as a reusable component.
5. **Independent testing** -- each subgraph can be invoked and tested in isolation with its own test data.

## Key Technical Details

- A compiled subgraph is added via `builder.add_node("name", compiled_subgraph)` -- it behaves like any other node.
- Keys that exist in both parent and subgraph schemas are automatically mapped at the boundary.
- Keys that exist only in the subgraph schema remain private and invisible to the parent graph.
- Subgraphs can have their own checkpointers, enabling independent persistence of internal state.
- A wrapper function (as shown in `call_research`) gives full control over the state transformation logic.
- Subgraphs can be nested -- a subgraph can itself contain subgraphs for hierarchical architectures.
- The parent graph's streaming events include subgraph events, so observability is not lost.
- Each subgraph `invoke()` call is a complete execution from START to END of that subgraph.

## Common Misconceptions

- **"Subgraphs must share the same state schema as the parent."** Subgraphs can have completely different schemas. That is one of their primary advantages over plain nodes.
- **"The parent can read the subgraph's internal state."** Only keys shared between both schemas are visible to the parent. Private subgraph fields are inaccessible from the parent.
- **"Subgraphs add significant performance overhead."** A subgraph invocation is essentially a function call. The overhead is negligible compared to the LLM calls happening inside the subgraph.
- **"You must use subgraphs for multi-agent systems."** Simple multi-agent systems work fine with plain nodes. Subgraphs become valuable when agents need private state or independent schemas.

## Connections to Other Concepts

- `supervisor-pattern.md` -- supervisor systems often encapsulate each specialist as a subgraph
- `agent-handoffs.md` -- handoffs can route between subgraph-based agents
- `nodes.md` -- subgraphs are registered as nodes, following the same `add_node` API
- `graph-compilation.md` -- each subgraph is compiled independently before embedding
- `state-and-state-schema.md` -- schema design determines the boundary contract between parent and subgraph
- `checkpointers.md` -- subgraphs can have independent checkpointer configurations

## Further Reading

- [LangGraph Subgraph How-To Guide](https://langchain-ai.github.io/langgraph/how-tos/subgraph/)
- [LangGraph Multi-Agent Concepts](https://langchain-ai.github.io/langgraph/concepts/multi_agent/)
- [LangGraph Low-Level API: Subgraphs](https://langchain-ai.github.io/langgraph/concepts/low_level/#subgraphs)
