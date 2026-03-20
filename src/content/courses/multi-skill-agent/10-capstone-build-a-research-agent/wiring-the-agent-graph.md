# Wiring the Agent Graph

**One-Line Summary**: Assembling the five research skills into a complete LangGraph state machine with typed state, conditional routing, and a system prompt that guides the agent through the research workflow.

**Prerequisites**: `implementing-the-skill-set.md`, `project-overview-and-requirements.md`, `choosing-your-framework.md`

## What Is the Agent Graph?

Think of the individual skills as instruments in an orchestra. Each musician can play their part perfectly in isolation, but without a conductor and a score, there is no symphony. The agent graph is both the conductor and the score: it defines the order in which skills execute, the conditions under which the flow branches, and the shared state that passes information from one skill to the next.

In LangGraph terms, the agent graph is a `StateGraph` — a directed graph where each node is a function that reads from and writes to a shared state object, and each edge defines the transition between nodes. Some edges are unconditional (always proceed to the next node) and some are conditional (choose the next node based on the current state). The graph compiles into a runnable that executes the research workflow from start to finish.

This is where architecture meets implementation. The decisions you make about state shape, edge conditions, and node boundaries determine whether the agent is robust or fragile, fast or slow, debuggable or opaque.

## How It Works

### State Definition

The shared state carries all data between nodes. Every node reads what it needs from state and writes its results back:

```python
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import add_messages
from pydantic import BaseModel


class ResearchState(TypedDict):
    """Complete state for the research agent graph."""
    # Input
    topic: str
    depth: str                              # "quick" | "standard" | "deep"
    focus_areas: list[str]

    # Search phase
    search_queries: list[str]
    search_results: list[dict]              # WebSearchResult as dicts
    search_rounds_completed: int

    # Read phase
    pages_read: list[dict]                  # ReadPageOutput as dicts
    pages_failed: list[str]                 # URLs that failed

    # Summarize phase
    summaries: list[dict]                   # SummarizeOutput as dicts
    all_claims: list[dict]                  # {"claim": str, "source_url": str}

    # Fact check phase
    fact_checks: list[dict]                 # FactCheckOutput as dicts

    # Output
    report: dict | None                     # WriteReportOutput as dict
    metadata: dict                          # timing, cost, step count

    # Control flow
    status: str                             # "searching" | "reading" | ... | "done"
    error_log: list[str]


DEPTH_TO_SOURCES = {"quick": 3, "standard": 5, "deep": 8}
```

### Node Functions

Each node corresponds to one phase of the research process. Nodes are pure functions that take state and return a partial state update:

```python
import asyncio
import time


async def generate_queries_node(state: ResearchState) -> dict:
    """Generate search queries based on the topic and focus areas."""
    topic = state["topic"]
    focus_areas = state.get("focus_areas", [])

    prompt = f"""Generate 3 diverse web search queries to research: {topic}
    {"Focus on: " + ", ".join(focus_areas) if focus_areas else ""}
    Return as a JSON list of strings."""

    response = await llm_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    import json
    queries = json.loads(response.choices[0].message.content)["queries"]

    return {
        "search_queries": queries,
        "search_rounds_completed": 0,
        "status": "searching",
    }


async def search_node(state: ResearchState) -> dict:
    """Execute web searches for all queries."""
    queries = state["search_queries"]
    existing_urls = {r["url"] for r in state.get("search_results", [])}

    all_results = []
    for query in queries:
        output = await web_search(WebSearchInput(query=query, num_results=5))
        for r in output.results:
            if r.url not in existing_urls:
                all_results.append(r.model_dump())
                existing_urls.add(r.url)

    return {
        "search_results": state.get("search_results", []) + all_results,
        "search_rounds_completed": state["search_rounds_completed"] + 1,
        "status": "reading",
    }


async def read_pages_node(state: ResearchState) -> dict:
    """Fetch and extract content from search result URLs."""
    depth = state.get("depth", "standard")
    target_count = DEPTH_TO_SOURCES[depth]
    already_read = {p["url"] for p in state.get("pages_read", [])}

    # Select URLs not yet read
    urls_to_read = [
        r["url"] for r in state["search_results"]
        if r["url"] not in already_read
    ][:target_count]

    # Read pages concurrently
    tasks = [
        read_page(ReadPageInput(url=url, max_chars=10000))
        for url in urls_to_read
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    pages_read = list(state.get("pages_read", []))
    pages_failed = list(state.get("pages_failed", []))
    error_log = list(state.get("error_log", []))

    for result in results:
        if isinstance(result, Exception):
            error_log.append(f"Page read exception: {str(result)[:200]}")
            continue
        if result.success:
            pages_read.append(result.model_dump())
        else:
            pages_failed.append(result.url)
            error_log.append(result.error or f"Failed: {result.url}")

    return {
        "pages_read": pages_read,
        "pages_failed": pages_failed,
        "error_log": error_log,
        "status": "summarizing",
    }


async def summarize_node(state: ResearchState) -> dict:
    """Summarize each successfully read page."""
    pages = state["pages_read"]
    topic = state["topic"]

    # Only summarize pages not yet summarized
    summarized_urls = {s.get("source_url") for s in state.get("summaries", [])}
    new_pages = [p for p in pages if p["url"] not in summarized_urls]

    tasks = [
        summarize(SummarizeInput(
            text=page["content"],
            focus=topic,
            max_sentences=5,
            source_url=page["url"],
        ))
        for page in new_pages
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    summaries = list(state.get("summaries", []))
    all_claims = list(state.get("all_claims", []))

    for result in results:
        if isinstance(result, Exception):
            continue
        summaries.append(result.model_dump())
        for claim in result.key_claims:
            all_claims.append({
                "claim": claim,
                "source_url": result.source_url,
            })

    return {
        "summaries": summaries,
        "all_claims": all_claims,
        "status": "checking_coverage",
    }


async def fact_check_node(state: ResearchState) -> dict:
    """Verify the most important claims from the research."""
    claims = state["all_claims"]

    # Select top 3-5 claims to verify (prioritize specific, quantitative claims)
    claims_to_check = claims[:5]

    tasks = [
        fact_check(FactCheckInput(
            claim=c["claim"],
            original_source=c["source_url"],
        ))
        for c in claims_to_check
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    fact_checks = [
        r.model_dump() for r in results
        if not isinstance(r, Exception)
    ]

    return {
        "fact_checks": fact_checks,
        "status": "writing",
    }


async def write_report_node(state: ResearchState) -> dict:
    """Compile all findings into a structured report."""
    report_input = WriteReportInput(
        topic=state["topic"],
        summaries=[SummarizeOutput(**s) for s in state["summaries"]],
        fact_checks=[FactCheckOutput(**fc) for fc in state["fact_checks"]],
        sources=[WebSearchResult(**r) for r in state["search_results"]],
    )

    report = await write_report(report_input)

    return {
        "report": report.model_dump(),
        "status": "done",
    }
```

### Edge Logic and Conditional Routing

The graph needs two conditional edges: one to decide whether enough sources have been gathered, and one to limit search rounds:

```python
def should_search_more(state: ResearchState) -> str:
    """Decide whether to search for more sources or proceed."""
    depth = state.get("depth", "standard")
    target = DEPTH_TO_SOURCES[depth]
    successful_pages = len(state.get("summaries", []))
    rounds = state.get("search_rounds_completed", 0)

    if successful_pages >= target:
        return "enough_sources"
    if rounds >= 3:
        # Cap at 3 search rounds to prevent infinite loops
        return "enough_sources"
    return "need_more"
```

### Complete Graph Construction

```python
from langgraph.graph import StateGraph, END, START


def build_research_graph() -> StateGraph:
    """Construct the complete research agent graph."""
    graph = StateGraph(ResearchState)

    # Add nodes
    graph.add_node("generate_queries", generate_queries_node)
    graph.add_node("search", search_node)
    graph.add_node("read_pages", read_pages_node)
    graph.add_node("summarize", summarize_node)
    graph.add_node("fact_check", fact_check_node)
    graph.add_node("write_report", write_report_node)

    # Add edges
    graph.add_edge(START, "generate_queries")
    graph.add_edge("generate_queries", "search")
    graph.add_edge("search", "read_pages")
    graph.add_edge("read_pages", "summarize")

    # Conditional: enough sources or search more?
    graph.add_conditional_edges(
        "summarize",
        should_search_more,
        {
            "enough_sources": "fact_check",
            "need_more": "generate_queries",
        },
    )

    graph.add_edge("fact_check", "write_report")
    graph.add_edge("write_report", END)

    return graph


# Compile the graph into a runnable
research_graph = build_research_graph().compile()
```

### The System Prompt

While the graph structure handles routing, the system prompt guides LLM behavior within nodes:

```python
RESEARCH_AGENT_SYSTEM_PROMPT = """You are a thorough research assistant. Your job
is to investigate topics by searching for information, reading sources carefully,
verifying claims, and producing well-structured reports.

Guidelines:
1. Generate diverse search queries that cover different angles of the topic.
2. When summarizing, focus on facts, data, and specific claims rather than
   generalities.
3. Extract concrete, verifiable claims — include numbers, dates, and names.
4. When fact-checking, look for independent corroboration. A claim verified
   by the same original source does not count as independently verified.
5. In the final report, clearly distinguish between verified facts and
   unverified claims. Always cite sources.
6. If information is contradictory across sources, present both perspectives
   and note the disagreement.
7. Never fabricate information. If you cannot find something, say so."""
```

### Running the Agent

```python
async def run_research_agent(
    topic: str,
    depth: str = "standard",
    focus_areas: list[str] | None = None,
) -> dict:
    """Execute the research agent and return the report."""
    start_time = time.monotonic()

    initial_state: ResearchState = {
        "topic": topic,
        "depth": depth,
        "focus_areas": focus_areas or [],
        "search_queries": [],
        "search_results": [],
        "search_rounds_completed": 0,
        "pages_read": [],
        "pages_failed": [],
        "summaries": [],
        "all_claims": [],
        "fact_checks": [],
        "report": None,
        "metadata": {},
        "status": "starting",
        "error_log": [],
    }

    final_state = await research_graph.ainvoke(initial_state)

    elapsed = time.monotonic() - start_time
    final_state["metadata"] = {
        "duration_seconds": round(elapsed, 1),
        "sources_found": len(final_state["search_results"]),
        "pages_read": len(final_state["pages_read"]),
        "pages_failed": len(final_state["pages_failed"]),
        "claims_extracted": len(final_state["all_claims"]),
        "claims_checked": len(final_state["fact_checks"]),
        "search_rounds": final_state["search_rounds_completed"],
        "errors": final_state["error_log"],
    }

    return final_state


# Usage
result = await run_research_agent(
    topic="Current state of solid-state battery technology",
    depth="standard",
    focus_areas=["energy density", "manufacturing challenges", "timeline to market"],
)
print(result["report"]["title"])
print(result["report"]["executive_summary"])
```

## Why It Matters

### The Graph Is the Architecture

The graph definition is not boilerplate — it is the core architectural decision. Where you draw node boundaries determines what can be parallelized, what can be retried independently, and what can be observed in traces. A graph with too few nodes is opaque and hard to debug. A graph with too many is slow due to overhead. The five-node structure here hits the right balance for a research workflow.

### Conditional Routing Enables Adaptive Behavior

The `should_search_more` function is what makes this an agent rather than a pipeline. A pipeline always executes the same steps. The conditional edge allows the agent to adapt: if the first search round yields five good sources, it proceeds directly to fact checking. If it yields only two, it searches again with refined queries. This adaptability is the core value of the agent pattern.

## Key Technical Details

- LangGraph's `StateGraph` uses a reducer pattern: each node returns only the fields it modifies, and these are merged into the full state
- Conditional edges are evaluated synchronously after each node completes; they should be fast (no LLM calls in edge functions)
- The `asyncio.gather` pattern in read_pages and summarize nodes enables parallel execution within a single graph step
- Graph compilation validates the structure (no orphan nodes, all edges resolve) at build time, not at runtime
- State serialization adds roughly 1-5ms of overhead per node transition, which is negligible compared to LLM call latency

## Common Misconceptions

**"The LLM should decide which node to visit next"**: In this architecture, the graph structure handles routing, not the LLM. The conditional edge function is deterministic Python code that examines the state. This is more reliable than asking the LLM "should we search more?" because routing logic is not a language task — it is a programmatic check. Reserve LLM calls for tasks that require language understanding.

**"You need to pass the full state to every node"**: LangGraph passes the full state dict to every node, but each node should only read the fields it needs and write only the fields it modifies. This discipline keeps nodes focused and testable. A node that reads and writes everything is a sign that the state shape needs refactoring.

## Connections to Other Concepts

- `implementing-the-skill-set.md` — The skill functions called by each node
- `project-overview-and-requirements.md` — The architecture diagram this code implements
- `running-and-iterating.md` — How to test and improve this graph
- `choosing-your-framework.md` — Why LangGraph was chosen for this implementation
- `dependency-graphs-for-skill-execution.md` — The theoretical foundation for graph-based orchestration
- `observability-and-tracing.md` — LangGraph integrates with LangSmith for automatic tracing

## Further Reading

- Harrison Chase, "LangGraph: Build Stateful Agents" (2024) — Official documentation and tutorials for LangGraph
- LangChain Team, "How to Create a StateGraph" (2024) — Step-by-step guide to the StateGraph API
- Pregel, "A System for Large-Scale Graph Processing" (2010) — The graph computation model that inspired LangGraph's design
- Anthropic, "Building Effective Agents" (2024) — Architectural patterns for multi-step agent systems
