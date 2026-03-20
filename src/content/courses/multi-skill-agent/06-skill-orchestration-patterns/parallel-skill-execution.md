# Parallel Skill Execution

**One-Line Summary**: Running multiple independent skills concurrently using asyncio and LangGraph fan-out patterns dramatically reduces agent latency when tasks have no data dependencies.

**Prerequisites**: `sequential-skill-chains.md`, Python asyncio basics, `dependency-graphs-for-skill-execution.md`

## What Is Parallel Skill Execution?

Imagine you need to check the weather, stock prices, and sports scores for a morning briefing. You would not check the weather, wait for the answer, then check stocks, wait, then check scores. You would open three browser tabs simultaneously. Each query is independent -- none needs the other's result. Parallel skill execution is the agent doing exactly this: launching multiple tool calls at the same time and waiting for all of them to complete.

In technical terms, parallel execution dispatches independent skill invocations as concurrent tasks, runs them simultaneously (typically via async I/O), and collects all results before proceeding. Since most agent tools are I/O-bound (API calls, web requests, database queries), concurrency yields near-linear speedup: three 1-second API calls complete in ~1 second total instead of ~3 seconds.

The key constraint is independence. Skills can only run in parallel when they have no data dependencies between them. If skill B needs the output of skill A, they must run sequentially. Identifying which skills are independent is the job of the dependency graph -- parallel execution is the runtime mechanism that exploits that independence.

## How It Works

### Basic asyncio Pattern

The foundation of parallel skill execution in Python is `asyncio.gather`:

```python
import asyncio
from typing import Any

async def run_parallel_skills(
    skills: list[dict],
    timeout: float = 30.0,
) -> list[Any]:
    """Run multiple independent skills concurrently.

    Each skill dict has: {"name": str, "fn": Callable, "input": Any}
    """
    async def execute_one(skill: dict) -> dict:
        try:
            result = await skill["fn"](skill["input"])
            return {"name": skill["name"], "status": "success", "result": result}
        except Exception as e:
            return {"name": skill["name"], "status": "error", "error": str(e)}

    tasks = [execute_one(s) for s in skills]
    results = await asyncio.wait_for(
        asyncio.gather(*tasks, return_exceptions=False),
        timeout=timeout,
    )
    return results
```

### Three API Lookups in Parallel

Here is a concrete example: an agent gathers stock price, recent news, and company financials simultaneously for an investment briefing.

```python
import aiohttp

async def fetch_stock_price(symbol: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"https://api.finance.example/quote/{symbol}"
        ) as resp:
            return await resp.json()

async def fetch_news(query: str) -> list[dict]:
    async with aiohttp.ClientSession() as session:
        async with session.get(
            "https://api.news.example/search",
            params={"q": query, "limit": 5},
        ) as resp:
            return await resp.json()

async def fetch_financials(symbol: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"https://api.finance.example/financials/{symbol}"
        ) as resp:
            return await resp.json()

async def generate_briefing(symbol: str, company_name: str) -> str:
    # Fan-out: three independent lookups
    stock_task = fetch_stock_price(symbol)
    news_task = fetch_news(company_name)
    financials_task = fetch_financials(symbol)

    stock, news, financials = await asyncio.gather(
        stock_task, news_task, financials_task
    )

    # Fan-in: merge results and summarize
    context = {
        "stock_price": stock,
        "recent_news": news,
        "financials": financials,
    }
    return await llm_summarize(context)

# Sequential: ~3s (1s + 1s + 1s)
# Parallel:   ~1s (max of the three)
```

### LangGraph Fan-Out Nodes

LangGraph supports parallel execution natively through fan-out edges where multiple nodes execute from the same source:

```python
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END

class ResearchState(TypedDict):
    query: str
    stock_data: dict
    news_data: list
    financial_data: dict
    briefing: str

def fetch_stock_node(state: ResearchState) -> dict:
    """Fetch stock price -- runs in parallel."""
    result = stock_api.get_quote(state["query"])
    return {"stock_data": result}

def fetch_news_node(state: ResearchState) -> dict:
    """Fetch news -- runs in parallel."""
    result = news_api.search(state["query"])
    return {"news_data": result}

def fetch_financials_node(state: ResearchState) -> dict:
    """Fetch financials -- runs in parallel."""
    result = finance_api.get_financials(state["query"])
    return {"financial_data": result}

def merge_and_summarize(state: ResearchState) -> dict:
    """Fan-in: combine all data and produce briefing."""
    briefing = llm.invoke(
        f"Stock: {state['stock_data']}\n"
        f"News: {state['news_data']}\n"
        f"Financials: {state['financial_data']}\n"
        "Generate a concise investment briefing."
    )
    return {"briefing": briefing.content}

# Build the graph with fan-out / fan-in
graph = StateGraph(ResearchState)
graph.add_node("stock", fetch_stock_node)
graph.add_node("news", fetch_news_node)
graph.add_node("financials", fetch_financials_node)
graph.add_node("summarize", merge_and_summarize)

# Fan-out: START feeds three parallel nodes
graph.add_edge(START, "stock")
graph.add_edge(START, "news")
graph.add_edge(START, "financials")

# Fan-in: all three feed into summarize
graph.add_edge("stock", "summarize")
graph.add_edge("news", "summarize")
graph.add_edge("financials", "summarize")

graph.add_edge("summarize", END)

app = graph.compile()
result = app.invoke({"query": "AAPL"})
```

### Aggregating Parallel Results

When parallel skills return different data shapes, the aggregation step must normalize and merge them. A common pattern uses a reducer function in the state definition:

```python
from operator import add

class ParallelState(TypedDict):
    query: str
    # Annotated with a reducer: list results are concatenated
    search_results: Annotated[list[dict], add]
    final_summary: str
```

For more complex merging, use a dedicated aggregation node:

```python
def aggregate_results(state: ParallelState) -> dict:
    """Deduplicate and rank results from parallel searches."""
    all_results = state["search_results"]
    seen_urls = set()
    unique = []
    for r in all_results:
        if r.get("url") not in seen_urls:
            seen_urls.add(r.get("url"))
            unique.append(r)
    # Sort by relevance score
    unique.sort(key=lambda x: x.get("score", 0), reverse=True)
    return {"search_results": unique[:10]}
```

### Error Handling in Parallel Execution

When one parallel skill fails, the others should not be affected. Use `return_exceptions=True` or individual try/except blocks:

```python
async def safe_parallel_execute(skills: list[dict]) -> dict:
    """Execute skills in parallel, handling individual failures."""
    results = await asyncio.gather(
        *[s["fn"](s["input"]) for s in skills],
        return_exceptions=True,
    )

    output = {}
    for skill, result in zip(skills, results):
        if isinstance(result, Exception):
            output[skill["name"]] = {
                "status": "failed",
                "error": str(result),
                "fallback": skill.get("default_value"),
            }
        else:
            output[skill["name"]] = {"status": "success", "result": result}

    return output
```

## Why It Matters

### Latency Reduction

For agents making multiple independent API calls, parallel execution reduces wall-clock time from the sum of all call durations to the duration of the slowest call. In practice, this means 2-5x speedups for common multi-source research tasks.

### Better User Experience

Users waiting for an agent response are sensitive to latency. A 10-second wait feels sluggish; a 3-second wait feels responsive. Parallel execution often makes the difference between these two experiences without any change to the quality of results.

## Key Technical Details

- asyncio parallelism is concurrency, not true CPU parallelism -- it works because agent tools are I/O-bound (waiting on network responses)
- Cap parallel fan-out at 5-10 concurrent tasks to avoid overwhelming rate-limited APIs
- Set per-task timeouts (10-30s) in addition to an overall timeout to prevent one slow task from blocking others
- LangGraph executes fan-out nodes in separate threads by default, handling both sync and async tool functions
- Memory overhead per concurrent task is minimal (~1KB for the coroutine frame); the bottleneck is always I/O and rate limits
- When parallel results have different latencies, consider returning partial results to the user while slower tasks complete

## Common Misconceptions

**"All agent tasks benefit from parallelism"**: Many agent tasks are inherently sequential -- each step depends on the previous one. Parallelism only helps when independent sub-tasks exist. A search-then-summarize chain has zero parallelism. A multi-source-search-then-summarize has parallelism only in the search phase.

**"asyncio makes everything faster"**: asyncio only speeds up I/O-bound operations. If your skill is CPU-bound (running a local ML model, processing a large dataset), asyncio will not help and may even add overhead. For CPU-bound parallel work, use `concurrent.futures.ProcessPoolExecutor` instead.

## Connections to Other Concepts

- `sequential-skill-chains.md` -- The alternative when tasks have strict data dependencies
- `dependency-graphs-for-skill-execution.md` -- The DAG analysis that identifies which skills can run in parallel
- `conditional-branching.md` -- Sometimes parallel branches produce results that determine which branch to follow next
- `the-supervisor-pattern.md` -- Supervisors often dispatch multiple worker agents in parallel

## Further Reading

- Python Documentation, "asyncio -- Asynchronous I/O" (2024) -- Official guide to Python's concurrency primitives
- LangGraph Documentation, "Fan-out and Fan-in" (2024) -- Tutorial on parallel node execution in LangGraph
- Pike, "Concurrency Is Not Parallelism" (2012) -- Essential talk clarifying why asyncio works for I/O-bound agent tools
