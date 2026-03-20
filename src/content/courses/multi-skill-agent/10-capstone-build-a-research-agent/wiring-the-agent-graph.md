# Wiring the Agent Graph

**One-Line Summary**: Assembling the five research skills into a complete LangGraph state machine with typed state, conditional routing, and a system prompt that guides the agent through the research workflow.

**Prerequisites**: `implementing-the-skill-set.md`, `project-overview-and-requirements.md`, `choosing-your-framework.md`

## What Is the Agent Graph?

Think of skills as instruments in an orchestra -- each plays perfectly alone, but without a conductor and score, there is no symphony. The agent graph is both: it defines execution order, branching conditions, and the shared state passing information between skills.

In LangGraph terms, the agent graph is a `StateGraph` where each node reads from and writes to shared state, and edges define transitions. Some edges are unconditional, others conditional based on state. The graph compiles into a runnable that executes the full research workflow. Your decisions about state shape, edge conditions, and node boundaries determine whether the agent is robust or fragile.

## How It Works

### State Definition

The shared state carries all data between nodes:

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
import asyncio, json, time

DEPTH_TO_SOURCES = {"quick": 3, "standard": 5, "deep": 8}

class ResearchState(TypedDict):
    topic: str
    depth: str                        # "quick" | "standard" | "deep"
    focus_areas: list[str]
    search_queries: list[str]
    search_results: list[dict]
    search_rounds_completed: int
    pages_read: list[dict]
    pages_failed: list[str]
    summaries: list[dict]
    all_claims: list[dict]            # {"claim": str, "source_url": str}
    fact_checks: list[dict]
    report: dict | None
    metadata: dict
    status: str
    error_log: list[str]
```

### Node Functions

Each node takes the current state and returns a partial state update:

```python
async def generate_queries_node(state: ResearchState) -> dict:
    topic, focus = state["topic"], state.get("focus_areas", [])
    prompt = (f"Generate 3 diverse search queries to research: {topic}\n"
              f"{'Focus on: ' + ', '.join(focus) if focus else ''}\n"
              f'Return JSON: {{"queries": ["q1", "q2", "q3"]}}')
    resp = await llm_client.chat.completions.create(model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}, temperature=0.7)
    queries = json.loads(resp.choices[0].message.content)["queries"]
    return {"search_queries": queries, "search_rounds_completed": 0}

async def search_node(state: ResearchState) -> dict:
    existing = {r["url"] for r in state.get("search_results", [])}
    new = []
    for q in state["search_queries"]:
        out = await web_search(WebSearchInput(query=q, num_results=5))
        for r in out.results:
            if r.url not in existing:
                new.append(r.model_dump()); existing.add(r.url)
    return {"search_results": state.get("search_results", []) + new,
            "search_rounds_completed": state["search_rounds_completed"] + 1}

async def read_pages_node(state: ResearchState) -> dict:
    target = DEPTH_TO_SOURCES[state.get("depth", "standard")]
    read_urls = {p["url"] for p in state.get("pages_read", [])}
    urls = [r["url"] for r in state["search_results"]
            if r["url"] not in read_urls][:target]
    results = await asyncio.gather(
        *[read_page(ReadPageInput(url=u)) for u in urls],
        return_exceptions=True)
    pages, failed, errors = list(state.get("pages_read", [])), [], []
    for r in results:
        if isinstance(r, Exception): errors.append(str(r)[:200])
        elif r.success: pages.append(r.model_dump())
        else: failed.append(r.url); errors.append(r.error or "")
    return {"pages_read": pages, "pages_failed": failed,
            "error_log": state.get("error_log", []) + errors}

async def summarize_node(state: ResearchState) -> dict:
    done = {s.get("source_url") for s in state.get("summaries", [])}
    new_pages = [p for p in state["pages_read"] if p["url"] not in done]
    results = await asyncio.gather(
        *[summarize(SummarizeInput(text=p["content"], focus=state["topic"],
            source_url=p["url"])) for p in new_pages], return_exceptions=True)
    sums, claims = list(state.get("summaries", [])), list(state.get("all_claims", []))
    for r in results:
        if isinstance(r, Exception): continue
        sums.append(r.model_dump())
        claims.extend({"claim": c, "source_url": r.source_url} for c in r.key_claims)
    return {"summaries": sums, "all_claims": claims}

async def fact_check_node(state: ResearchState) -> dict:
    results = await asyncio.gather(
        *[fact_check(FactCheckInput(claim=c["claim"], original_source=c["source_url"]))
          for c in state["all_claims"][:5]], return_exceptions=True)
    return {"fact_checks": [r.model_dump() for r in results if not isinstance(r, Exception)]}

async def write_report_node(state: ResearchState) -> dict:
    report = await write_report(WriteReportInput(
        topic=state["topic"],
        summaries=[SummarizeOutput(**s) for s in state["summaries"]],
        fact_checks=[FactCheckOutput(**fc) for fc in state["fact_checks"]],
        sources=[WebSearchResult(**r) for r in state["search_results"]]))
    return {"report": report.model_dump(), "status": "done"}
```

### Edge Logic and Conditional Routing

A single routing function decides whether to loop back for more sources or proceed:

```python
def should_search_more(state: ResearchState) -> str:
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

```python
SYSTEM_PROMPT = """You are a thorough research assistant. Guidelines:
1. Generate diverse queries covering different angles of the topic.
2. When summarizing, focus on facts, data, and specific claims.
3. Extract concrete, verifiable claims with numbers, dates, and names.
4. When fact-checking, look for independent corroboration.
5. Distinguish verified facts from unverified claims in the final report.
6. If information is contradictory, present both perspectives.
7. Never fabricate information. If you cannot find something, say so."""
```

### Compile and Run

```python
async def run_research_agent(topic: str, depth: str = "standard",
                              focus_areas: list[str] | None = None) -> dict:
    start = time.monotonic()
    state: ResearchState = {
        "topic": topic, "depth": depth, "focus_areas": focus_areas or [],
        "search_queries": [], "search_results": [], "search_rounds_completed": 0,
        "pages_read": [], "pages_failed": [], "summaries": [], "all_claims": [],
        "fact_checks": [], "report": None, "metadata": {}, "status": "starting",
        "error_log": []}
    final = await research_graph.ainvoke(state)
    final["metadata"] = {"duration_s": round(time.monotonic() - start, 1),
        "sources": len(final["search_results"]), "pages": len(final["pages_read"])}
    return final
```

## Why It Matters

### The Graph Is the Architecture

Where you draw node boundaries determines what can be parallelized, retried independently, and observed in traces. The six-node structure balances granularity with overhead for a research workflow.

### Conditional Routing Enables Adaptive Behavior

`should_search_more` makes this an agent rather than a pipeline. If the first round yields enough sources, it proceeds; if not, it loops back. This adaptability is the core value of the agent pattern.

## Key Technical Details

- Each node returns only modified fields, merged into full state via the reducer pattern
- Conditional edges are synchronous -- keep them fast with no LLM calls
- `asyncio.gather` in read and summarize nodes enables 3-5x speedup via parallel execution
- Graph compilation validates structure at build time (orphan nodes, dangling edges)
- State serialization: roughly 1-5ms per transition, negligible vs. LLM latency

## Common Misconceptions

**"The LLM should decide which node to visit next"**: The graph handles routing with deterministic Python code. This is more reliable than asking the LLM "should we search more?" because routing is a programmatic check, not a language task.

**"You need to pass the full state to every node"**: LangGraph passes the full state, but each node should only read the fields it needs and write only what it modifies. A node that touches everything signals the state shape needs refactoring.

## Connections to Other Concepts

- `implementing-the-skill-set.md` -- The skill functions called by each node
- `project-overview-and-requirements.md` -- The architecture diagram this code implements
- `running-and-iterating.md` -- How to test and improve this graph
- `choosing-your-framework.md` -- Why LangGraph was chosen for this implementation
- `dependency-graphs-for-skill-execution.md` -- Theoretical foundation for graph-based orchestration

## Further Reading

- Harrison Chase, "LangGraph: Build Stateful Agents" (2024) -- Official documentation and tutorials
- LangChain Team, "How to Create a StateGraph" (2024) -- Step-by-step guide to the StateGraph API
- Pregel, "A System for Large-Scale Graph Processing" (2010) -- The computation model that inspired LangGraph
- Anthropic, "Building Effective Agents" (2024) -- Architectural patterns for multi-step agent systems
