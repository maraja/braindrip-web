# Tool Error Handling

**One-Line Summary**: Robust tool error handling in LangGraph means catching failures, storing them in state, and routing back to the LLM so it can analyze what went wrong and adapt its approach -- turning errors into recovery opportunities rather than crashes.

**Prerequisites**: `tool-node.md`, `langchain-tool-decorator.md`, `edges-and-routing.md`, `the-command-api.md`

## What Is Tool Error Handling?

Think of a GPS navigation system. When you miss a turn, the GPS does not crash or give up -- it recalculates a new route from your current position. Good tool error handling works the same way. When a tool fails (API timeout, invalid input, rate limit hit), the agent should not crash. Instead, the error is captured and fed back to the LLM, which can then decide whether to retry with different parameters, try an alternative tool, or inform the user.

In LangGraph, there are three levels of error handling. First, `ToolNode` has built-in behavior: if a tool raises an exception, it catches it and returns the error message as the `ToolMessage` content. Second, you can handle errors explicitly inside your tool functions, returning informative error messages instead of exceptions. Third, for graph-level recovery, you can use the `Command` API to catch errors in custom nodes and route the execution flow back to the LLM with error context stored in state.

The key principle is that LLMs are remarkably good at recovering from errors when given clear information about what went wrong. A message like "API returned 429: rate limit exceeded, try again in 30 seconds" is often enough for the model to wait and retry or switch to an alternative approach.

## How It Works

### Level 1: ToolNode Built-in Error Handling

```python
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode

@tool
def divide(a: float, b: float) -> float:
    """Divide a by b.

    Args:
        a: The numerator.
        b: The denominator.
    """
    return a / b  # Raises ZeroDivisionError if b=0

tool_node = ToolNode([divide])

# If the LLM calls divide(10, 0), ToolNode catches the ZeroDivisionError
# and returns: ToolMessage(content="Error: ZeroDivisionError: division by zero")
# The LLM sees this and can inform the user or try a different approach
```

### Level 2: Explicit Error Handling in Tools

```python
import httpx

@tool
def search_web(query: str) -> str:
    """Search the web for current information.

    Args:
        query: The search query.
    """
    try:
        response = httpx.get(
            "https://api.search.com/search",
            params={"q": query},
            timeout=10.0,
        )
        response.raise_for_status()
        return response.json()["results"]
    except httpx.TimeoutException:
        return "Search timed out. The service may be slow. Try a simpler query."
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            return "Search rate limit hit. Wait a moment before searching again."
        return f"Search failed with status {e.response.status_code}. Try rephrasing the query."
    except Exception as e:
        return f"Search unavailable: {str(e)}. Use your existing knowledge instead."
```

### Level 3: Command-Based Error Recovery

For custom graph nodes (not using `ToolNode`), use the `Command` API to route errors back to the LLM:

```python
from typing import Literal
from langgraph.types import Command

def execute_tool(state: dict) -> Command[Literal["agent", "execute_tool"]]:
    try:
        result = run_tool(state["tool_call"])
        return Command(
            update={"tool_result": result},
            goto="agent",
        )
    except ToolError as e:
        # Route back to agent with the error context
        return Command(
            update={"tool_result": f"Tool error: {str(e)}"},
            goto="agent",
        )
```

### Retry with Backoff at the Node Level

```python
from langgraph.pregel import RetryPolicy

graph_builder.add_node(
    "search",
    search_node,
    retry=RetryPolicy(
        max_attempts=3,
        backoff_factor=2.0,    # exponential backoff: 2s, 4s, 8s
        retry_on=lambda e: isinstance(e, (httpx.TimeoutException, httpx.HTTPStatusError)),
    ),
)
```

### Graceful Degradation Pattern

```python
@tool
def get_stock_price(symbol: str) -> str:
    """Get the current stock price for a given ticker symbol.

    Args:
        symbol: Stock ticker symbol like AAPL, GOOGL.
    """
    try:
        price = fetch_live_price(symbol)
        return f"{symbol}: ${price:.2f} (live)"
    except Exception:
        try:
            price = fetch_cached_price(symbol)
            return f"{symbol}: ${price:.2f} (cached, may be delayed)"
        except Exception:
            return f"Unable to fetch price for {symbol}. The market data service is currently unavailable."
```

## Why It Matters

1. **Agents recover instead of crashing** -- errors become information the LLM uses to adapt, not exceptions that halt execution.
2. **LLMs are good at error recovery** -- given clear error context, models can retry with different parameters, switch tools, or inform users appropriately.
3. **Graceful degradation preserves user experience** -- falling back to cached data or acknowledging limitations is better than a 500 error.
4. **RetryPolicy handles transient failures automatically** -- network blips and rate limits resolve themselves with exponential backoff.
5. **Informative error messages improve agent reasoning** -- "rate limit exceeded" tells the LLM far more than "request failed."

## Key Technical Details

- `ToolNode` catches all exceptions by default and returns the error as `ToolMessage` content, keeping the agent loop alive.
- For tools where you want the exception to propagate (halting the graph), raise it outside the tool function or configure `ToolNode` to not handle errors.
- `RetryPolicy` applies at the node level, not the tool level. It retries the entire node function on transient failures.
- `retry_on` accepts a callable that receives the exception and returns `True` to retry or `False` to propagate immediately.
- The `Command` API enables routing to any node after an error, not just back to the agent -- useful for fallback flows.
- Error messages should be actionable: include what failed, why, and what the LLM could do differently.
- Avoid generic error messages like "Something went wrong" -- they give the LLM no basis for recovery.
- Set `recursion_limit` to prevent infinite retry loops where the LLM keeps calling a failing tool.

## Common Misconceptions

- **"ToolNode crashes when a tool raises an exception."** By default, it catches exceptions and returns the error as a message. The agent loop continues.
- **"RetryPolicy retries individual tool calls."** It retries the entire node. If a node executes three tools and one fails, all three are re-executed on retry.
- **"You should always retry on failure."** Some errors are not transient (invalid API key, nonexistent resource). Retry only on errors that are likely to resolve: timeouts, rate limits, temporary server errors.
- **"The LLM cannot understand error messages."** LLMs are excellent at interpreting structured error information and adjusting their approach accordingly.

## Connections to Other Concepts

- `tool-node.md` -- ToolNode's built-in error handling is the first line of defense
- `the-command-api.md` -- Command enables routing to recovery paths after errors
- `langchain-tool-decorator.md` -- error handling is implemented inside `@tool`-decorated functions
- `production-checklist.md` -- retry policies and graceful degradation are key production hardening steps
- `edges-and-routing.md` -- conditional edges can route based on error state

## Further Reading

- [LangGraph Error Handling Patterns](https://docs.langchain.com/oss/python/langgraph/thinking-in-langgraph)
- [LangGraph RetryPolicy Reference](https://langchain-ai.github.io/langgraph/reference/graphs/#langgraph.pregel.retry.RetryPolicy)
- [LangGraph Command API Guide](https://langchain-ai.github.io/langgraph/how-tos/command/)
- [ToolNode API Reference](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.tool_node.ToolNode)
