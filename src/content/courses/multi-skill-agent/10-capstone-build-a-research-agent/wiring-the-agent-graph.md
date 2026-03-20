# Wiring the Agent Graph

**One-Line Summary**: Assembling the five research skills into a complete LangGraph state machine with typed state, conditional routing, and a system prompt that guides the agent through the research workflow.

**Prerequisites**: `implementing-the-skill-set.md`, `project-overview-and-requirements.md`, `choosing-your-framework.md`

## What Is the Agent Graph?

Think of the individual skills as instruments in an orchestra. Each musician can play their part perfectly in isolation, but without a conductor and a score, there is no symphony. The agent graph is both the conductor and the score: it defines the order in which skills execute, the conditions under which the flow branches, and the shared state that passes information from one skill to the next.

In LangGraph terms, the agent graph is a `StateGraph` -- a directed graph where each node is a function that reads from and writes to a shared state object, and each edge defines the transition between nodes. Some edges are unconditional (always proceed to the next node) and some are conditional (choose the next node based on the current state). The graph compiles into a runnable that executes the research workflow from start to finish.

This is where architecture meets implementation. The decisions you make about state shape, edge conditions, and node boundaries determine whether the agent is robust or fragile, fast or slow, debuggable or opaque.

## How It Works

### State Definition

The shared state carries all data between nodes:

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END

DEPTH_TO_SOURCES = {"quick": 3, "standard": 5, "deep": 8}

class ResearchState(TypedDict):
    topic: str
    depth: str                        # "quick" | "standard" | "deep"
    focus_areas: list[str]
    search_queries: list[str]
    search_results: list[dict]        # WebSearchResult as dicts
    search_rounds_completed: int
    pages_read: list[dict]            # ReadPageOutput as dicts
    pages_failed: list[str]
    summaries: list[dict]             # SummarizeOutput as dicts
    all_claims: list[dict]            # {"claim": str, "source_url": str}
    fact_checks: list[dict]           # FactCheckOutput as dicts
    report: dict | None
    metadata: dict
    status: str                       # tracks current phase
    error_log: list[str]
```

### Node Functions

Each node takes the current state and returns a partial state update:

```python
import asyncio, json, time

async def generate_queries_node(state: ResearchState) -> dict:
    """Generate search queries based on the topic."""
    topic = state["topic"]
    focus_areas = state.get("focus_areas", [])
    prompt = (f"Generate 3 diverse search queries to research: {topic}\n"
              f"{'Focus on: ' + ', '.join(focus_areas) if focus_areas else ''}\n"
              f'Return as JSON: {{"queries": ["q1", "q2", "q3"]}}')
    response = await llm_client.chat.completions.create(
        model="gpt-4o-mini", temperature=0.7,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"})
    queries = json.loads(response.choices[0].message.content)["queries"]
    return {"search_queries": queries, "search_rounds_completed": 0, "status": "searching"}

async def search_node(state: ResearchState) -> dict:
    """Execute web searches for all queries."""
    existing_urls = {r["url"] for r in state.get("search_results", [])}
    new_results = []
    for query in state["search_queries"]:
        output = await web_search(WebSearchInput(query=query, num_results=5))
        for r in output.results:
            if r.url not in existing_urls:
                new_results.append(r.model_dump())
                existing_urls.add(r.url)
    return {"search_results": state.get("search_results", []) + new_results,
            "search_rounds_completed": state["search_rounds_completed"] + 1}

async def read_pages_node(state: ResearchState) -> dict:
    """Fetch and extract content from search result URLs concurrently."""
    target = DEPTH_TO_SOURCES[state.get("depth", "standard")]
    already_read = {p["url"] for p in state.get("pages_read", [])}
    urls = [r["url"] for r in state["search_results"] if r["url"] not in already_read][:target]
    results = await asyncio.gather(
        *[read_page(ReadPageInput(url=u, max_chars=10000)) for u in urls],
        return_exceptions=True)
    pages, failed, errors = list(state.get("pages_read", [])), list(state.get("pages_failed", [])), []
    for r in results:
        if isinstance(r, Exception):
            errors.append(str(r)[:200])
        elif r.success:
            pages.append(r.model_dump())
        else:
            failed.append(r.url)
            errors.append(r.error or f"Failed: {r.url}")
    return {"pages_read": pages, "pages_failed": failed,
            "error_log": state.get("error_log", []) + errors}

async def summarize_node(state: ResearchState) -> dict:
    """Summarize each successfully read page."""
    summarized_urls = {s.get("source_url") for s in state.get("summaries", [])}
    new_pages = [p for p in state["pages_read"] if p["url"] not in summarized_urls]
    results = await asyncio.gather(
        *[summarize(SummarizeInput(text=p["content"], focus=state["topic"],
                                    source_url=p["url"])) for p in new_pages],
        return_exceptions=True)
    summaries, claims = list(state.get("summaries", [])), list(state.get("all_claims", []))
    for r in results:
        if isinstance(r, Exception):
            continue
        summaries.append(r.model_dump())
        for claim in r.key_claims:
            claims.append({"claim": claim, "source_url": r.source_url})
    return {"summaries": summaries, "all_claims": claims}

async def fact_check_node(state: ResearchState) -> dict:
    """Verify the most important claims."""
    claims_to_check = state["all_claims"][:5]
    results = await asyncio.gather(
        *[fact_check(FactCheckInput(claim=c["claim"], original_source=c["source_url"]))
          for c in claims_to_check], return_exceptions=True)
    return {"fact_checks": [r.model_dump() for r in results if not isinstance(r, Exception)]}

async def write_report_node(state: ResearchState) -> dict:
    """Compile all findings into a structured report."""
    report = await write_report(WriteReportInput(
        topic=state["topic"],
        summaries=[SummarizeOutput(**s) for s in state["summaries"]],
        fact_checks=[FactCheckOutput(**fc) for fc in state["fact_checks"]],
        sources=[WebSearchResult(**r) for r in state["search_results"]]))
    return {"report": report.model_dump(), "status": "done"}
```

### Edge Logic and Conditional Routing

The graph needs a conditional edge to decide whether enough sources have been gathered:

```python
def should_search_more(state: ResearchState) -> str:
    """Decide whether to search for more sources or proceed."""
    target = DEPTH_TO_SOURCES[state.get("depth", "standard")]
    if len(state.get("summaries", [])) >= target:
        return "enough_sources"
    if state.get("search_rounds_completed", 0) >= 3:
        return "enough_sources"  # Cap to prevent infinite loops
    return "need_more"
```

### Complete Graph Construction

```python
def build_research_graph() -> StateGraph:
    """Construct the complete research agent graph."""
    graph = StateGraph(ResearchState)
    graph.add_node("generate_queries", generate_queries_node)
    graph.add_node("search", search_node)
    graph.add_node("read_pages", read_pages_node)
    graph.add_node("summarize", summarize_node)
    graph.add_node("fact_check", fact_check_node)
    graph.add_node("write_report", write_report_node)

    graph.add_edge(START, "generate_queries")
    graph.add_edge("generate_queries", "search")
    graph.add_edge("search", "read_pages")
    graph.add_edge("read_pages", "summarize")
    graph.add_conditional_edges("summarize", should_search_more,
        {"enough_sources": "fact_check", "need_more": "generate_queries"})
    graph.add_edge("fact_check", "write_report")
    graph.add_edge("write_report", END)
    return graph

research_graph = build_research_graph().compile()
```

### System Prompt

The system prompt guides LLM behavior within nodes:

```python
RESEARCH_AGENT_SYSTEM_PROMPT = """You are a thorough research assistant.
Guidelines:
1. Generate diverse search queries covering different angles of the topic.
2. When summarizing, focus on facts, data, and specific claims.
3. Extract concrete, verifiable claims with numbers, dates, and names.
4. When fact-checking, look for independent corroboration.
5. In the final report, distinguish verified facts from unverified claims.
6. If information is contradictory, present both perspectives.
7. Never fabricate information. If you cannot find something, say so."""
```

### Compile and Run

```python
async def run_research_agent(topic: str, depth: str = "standard",
                              focus_areas: list[str] | None = None) -> dict:
    start_time = time.monotonic()
    initial_state: ResearchState = {
        "topic": topic, "depth": depth, "focus_areas": focus_areas or [],
        "search_queries": [], "search_results": [], "search_rounds_completed": 0,
        "pages_read": [], "pages_failed": [], "summaries": [], "all_claims": [],
        "fact_checks": [], "report": None, "metadata": {}, "status": "starting",
        "error_log": []}
    final_state = await research_graph.ainvoke(initial_state)
    final_state["metadata"] = {
        "duration_seconds": round(time.monotonic() - start_time, 1),
        "sources_found": len(final_state["search_results"]),
        "pages_read": len(final_state["pages_read"]),
        "claims_checked": len(final_state["fact_checks"]),
        "search_rounds": final_state["search_rounds_completed"]}
    return final_state

# Usage
result = await run_research_agent(
    "Current state of solid-state battery technology",
    depth="standard", focus_areas=["energy density", "timeline to market"])
```

## Why It Matters

### The Graph Is the Architecture

The graph definition is the core architectural decision. Where you draw node boundaries determines what can be parallelized, retried independently, and observed in traces. The five-node structure here balances granularity with overhead for a research workflow.

### Conditional Routing Enables Adaptive Behavior

The `should_search_more` function is what makes this an agent rather than a pipeline. It allows the agent to adapt: if the first round yields enough sources, it proceeds directly. If not, it searches again. This adaptability is the core value of the agent pattern.

## Key Technical Details

- LangGraph's `StateGraph` uses a reducer pattern: each node returns only modified fields, merged into full state
- Conditional edges are evaluated synchronously; they should be fast with no LLM calls
- `asyncio.gather` in read_pages and summarize enables parallel execution within a single graph step
- Graph compilation validates structure (no orphan nodes, all edges resolve) at build time
- State serialization adds roughly 1-5ms overhead per transition, negligible vs. LLM latency

## Common Misconceptions

**"The LLM should decide which node to visit next"**: The graph structure handles routing with deterministic Python code. This is more reliable than asking the LLM "should we search more?" because routing logic is a programmatic check, not a language task. Reserve LLM calls for tasks that require language understanding.

**"You need to pass the full state to every node"**: LangGraph passes the full state dict, but each node should only read the fields it needs and write only the fields it modifies. A node that reads and writes everything is a sign the state shape needs refactoring.

## Connections to Other Concepts

- `implementing-the-skill-set.md` -- The skill functions called by each node
- `project-overview-and-requirements.md` -- The architecture diagram this code implements
- `running-and-iterating.md` -- How to test and improve this graph
- `choosing-your-framework.md` -- Why LangGraph was chosen for this implementation
- `dependency-graphs-for-skill-execution.md` -- Theoretical foundation for graph-based orchestration

## Further Reading

- Harrison Chase, "LangGraph: Build Stateful Agents" (2024) -- Official documentation and tutorials for LangGraph
- LangChain Team, "How to Create a StateGraph" (2024) -- Step-by-step guide to the StateGraph API
- Pregel, "A System for Large-Scale Graph Processing" (2010) -- The graph computation model that inspired LangGraph
- Anthropic, "Building Effective Agents" (2024) -- Architectural patterns for multi-step agent systems
