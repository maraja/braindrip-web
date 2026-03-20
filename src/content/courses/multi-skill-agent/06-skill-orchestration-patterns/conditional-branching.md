# Conditional Branching

**One-Line Summary**: Conditional branching lets agents dynamically route execution based on intermediate results, choosing different skills or strategies depending on what the data looks like at runtime.

**Prerequisites**: `sequential-skill-chains.md`, basic understanding of LangGraph state and edges

## What Is Conditional Branching?

When you search for a restaurant and find it is permanently closed, you do not follow the original plan of making a reservation. You branch: search for alternatives instead. When a doctor orders a blood test and the results are abnormal, they do not proceed with the standard checkup -- they branch into diagnostic mode. Intelligent behavior requires responding to what you find, not rigidly following a predetermined path.

Conditional branching in agent orchestration means routing execution through different skill paths based on the content of intermediate results. If a web search returns no results, try a different query. If extracted data is numerical, send it to a calculator; if it is text, send it to a summarizer. If the user's request is in a foreign language, route to translation first.

This is what separates a scripted pipeline from an intelligent agent. The branching logic can be rule-based (simple if/else on result properties), LLM-based (ask the model to classify the result and choose a path), or hybrid (rules for common cases, LLM for ambiguous ones).

## How It Works

### Router Functions and Conditional Edges

A router function examines the current state and returns a string indicating which node to execute next. In LangGraph, this becomes a conditional edge via `add_conditional_edges`.

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict

class AgentState(TypedDict):
    query: str
    search_results: list[dict]
    extracted_data: dict
    final_answer: str

def search_node(state: AgentState) -> dict:
    results = search_tool.invoke(state["query"])
    return {"search_results": results}

def route_after_search(state: AgentState) -> str:
    results = state["search_results"]
    if not results:
        return "alternative_search"
    if any(r.get("type") == "numeric_table" for r in results):
        return "data_extraction"
    return "text_summarization"

# Build the graph with conditional routing
graph = StateGraph(AgentState)
graph.add_node("search", search_node)
graph.add_node("alternative_search", alternative_search_node)
graph.add_node("data_extraction", data_extraction_node)
graph.add_node("text_summarization", text_summarization_node)

graph.add_edge(START, "search")
graph.add_conditional_edges("search", route_after_search, {
    "alternative_search": "alternative_search",
    "data_extraction": "data_extraction",
    "text_summarization": "text_summarization",
})

graph.add_edge("alternative_search", "text_summarization")
graph.add_edge("data_extraction", "format_answer")
graph.add_edge("text_summarization", END)
graph.add_edge("format_answer", END)

app = graph.compile()
```

### LLM-Based Routing

For complex or ambiguous routing decisions, delegate classification to the LLM:

```python
ROUTER_PROMPT = """Classify the following data to determine the next processing step.

Data: {data}

Categories:
- NUMERIC: Primarily numbers, tables, or quantitative information
- TEXT: Primarily narrative text or descriptions
- EMPTY: No useful data was retrieved

Respond with exactly one category name."""

def llm_router(state: AgentState) -> str:
    response = llm.invoke(
        ROUTER_PROMPT.format(data=str(state["search_results"])[:2000])
    )
    category = response.content.strip().upper()
    routing_map = {
        "NUMERIC": "data_extraction",
        "TEXT": "text_summarization",
        "EMPTY": "alternative_search",
    }
    return routing_map.get(category, "text_summarization")
```

### Fallback Chains

A common branching pattern is the fallback chain: try the preferred approach first, and if it fails, fall back to alternatives in priority order.

```python
def build_fallback_chain():
    """Search with fallback: primary API -> secondary API -> web scrape."""
    graph = StateGraph(SearchState)
    graph.add_node("primary_search", primary_api_search)
    graph.add_node("secondary_search", secondary_api_search)
    graph.add_node("web_scrape", web_scrape_search)
    graph.add_node("process_results", process_results)

    graph.add_edge(START, "primary_search")
    graph.add_conditional_edges("primary_search", check_results, {
        "has_results": "process_results",
        "no_results": "secondary_search",
    })
    graph.add_conditional_edges("secondary_search", check_results, {
        "has_results": "process_results",
        "no_results": "web_scrape",
    })
    graph.add_edge("web_scrape", "process_results")
    graph.add_edge("process_results", END)
    return graph.compile()

def check_results(state: SearchState) -> str:
    return "has_results" if state.get("search_results") else "no_results"
```

## Why It Matters

### Handling Real-World Variability

Agent inputs and tool outputs are unpredictable. A web page might return HTML, JSON, or an error page. An API might return results in English or another language. Conditional branching lets the agent handle this variability gracefully instead of failing when the first assumption proves wrong.

### Resource Efficiency

Without branching, the agent either runs every possible path (wasteful) or commits to one path and hopes for the best (fragile). Conditional branching runs only the relevant path, saving tokens, time, and API quota. A numeric question routed directly to a calculator avoids an expensive LLM summarization step.

## Key Technical Details

- Router functions should execute in under 100ms; use heuristic checks before falling back to LLM-based routing
- LLM-based routing adds 500-1500ms and 200-500 tokens per routing decision
- Limit branching depth to 2-3 levels; deeper nesting becomes difficult to test and debug
- Every branch should have a default/fallback path to prevent the agent from getting stuck
- In LangGraph, conditional edge maps must be exhaustive -- every possible router return value must map to a node
- Test each branch independently with mock inputs before testing the full graph

## Common Misconceptions

**"Conditional branching replaces planning"**: Branching handles tactical decisions during execution -- which tool to use for this specific data. Planning handles strategic decisions before execution -- what steps to take and in what order. They operate at different levels and complement each other.

**"More branches mean a smarter agent"**: Excessive branching creates complexity without value. If 90% of inputs follow the same path, the branching logic for the other 10% should be simple fallbacks, not an elaborate routing tree. Profile your actual input distribution before adding branches.

## Connections to Other Concepts

- `sequential-skill-chains.md` -- The base pattern that branching extends with decision points
- `parallel-skill-execution.md` -- Branches can execute in parallel when they are independent
- `the-supervisor-pattern.md` -- Supervisors use branching logic to delegate to the right worker agent

## Further Reading

- LangGraph Documentation, "Conditional Edges" (2024) -- Official guide to building branching logic in LangGraph
- Gamma et al., "Strategy Pattern" in Design Patterns (1994) -- The classic OOP pattern that conditional branching implements
- Norvig, "Correcting a Widespread Error in Unification Algorithms" (1991) -- Early work on conditional program execution relevant to agent routing
