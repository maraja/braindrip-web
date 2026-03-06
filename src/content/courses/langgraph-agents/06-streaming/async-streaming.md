# Async Streaming

**One-Line Summary**: LangGraph's `astream()` and `ainvoke()` methods provide non-blocking async execution, essential for concurrent web applications built with FastAPI or asyncio.

**Prerequisites**: `stream-modes.md`, `token-streaming.md`, `../01-langgraph-foundations/graph-compilation.md`

## What Is Async Streaming?

Think of a restaurant with a single waiter versus many waiters. With synchronous streaming, your waiter stands at one table watching the chef prepare food -- no other table gets served until that dish is done. With async streaming, the waiter takes an order, walks away to serve other tables, and comes back when the kitchen signals the dish is ready. The food arrives just as fast, but dozens of tables are served concurrently.

In Python, `async/await` provides this concurrency model. LangGraph mirrors every synchronous method with an async counterpart: `graph.astream()` replaces `graph.stream()`, and `graph.ainvoke()` replaces `graph.invoke()`. These async methods yield control back to the event loop while waiting for LLM responses, database queries, or network calls, allowing your application to handle many users simultaneously on a single thread.

This matters most in production web servers. A FastAPI endpoint using synchronous `graph.stream()` blocks the entire worker thread for each request. The async equivalent handles hundreds of concurrent requests without spawning hundreds of threads.

## How It Works

### Basic Async Streaming

```python
import asyncio
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o")
agent = create_react_agent(llm, tools=[])

async def run():
    async for chunk in agent.astream(
        {"messages": [("user", "What is LangGraph?")]},
        stream_mode="updates",
    ):
        print(chunk)

asyncio.run(run())
```

The only syntactic differences are `async for` instead of `for` and `astream()` instead of `stream()`. All four stream modes work identically.

### Async Token Streaming

```python
async def stream_tokens(user_message: str):
    async for msg, metadata in agent.astream(
        {"messages": [("user", user_message)]},
        stream_mode="messages",
    ):
        if msg.content and metadata.get("langgraph_node") == "agent":
            print(msg.content, end="", flush=True)
```

### Async Non-Streaming Invocation

When you need the final result without intermediate chunks, use `ainvoke()`.

```python
async def get_answer(question: str) -> str:
    result = await agent.ainvoke(
        {"messages": [("user", question)]}
    )
    return result["messages"][-1].content
```

### FastAPI Integration

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

@app.post("/chat")
async def chat(message: str):
    async def generate():
        async for msg, metadata in agent.astream(
            {"messages": [("user", message)]},
            stream_mode="messages",
        ):
            if msg.content:
                yield msg.content
    return StreamingResponse(generate(), media_type="text/plain")
```

### Running Multiple Graphs Concurrently

Async streaming lets you run independent graphs in parallel with `asyncio.gather()`.

```python
async def parallel_research(topics: list[str]):
    tasks = [
        agent.ainvoke({"messages": [("user", f"Research: {topic}")]})
        for topic in topics
    ]
    results = await asyncio.gather(*tasks)
    return [r["messages"][-1].content for r in results]
```

## Why It Matters

1. **Concurrent request handling** -- A single server process can handle hundreds of streaming connections without thread-per-request overhead.
2. **Framework compatibility** -- FastAPI, Starlette, and other ASGI frameworks require async handlers for streaming responses.
3. **Parallel execution** -- Multiple independent agent calls can run concurrently using `asyncio.gather()` or task groups.
4. **Resource efficiency** -- Async I/O uses far less memory than spawning threads, critical for high-traffic deployments.

## Key Technical Details

- Every sync method has an async twin: `invoke`/`ainvoke`, `stream`/`astream`, `batch`/`abatch`.
- `astream()` accepts the same `stream_mode` parameter and all modes behave identically to sync.
- You must use `async for` to iterate over `astream()` -- a regular `for` loop will raise a `TypeError`.
- `asyncio.run()` is the entry point for async code in scripts; web frameworks like FastAPI manage the event loop for you.
- Checkpointers with async support (like `AsyncSqliteSaver`) should be used in async contexts to avoid blocking.
- Mixing sync and async calls in the same application can cause deadlocks -- choose one model and stick with it.
- LLM providers handle async natively; `ChatOpenAI` and `ChatAnthropic` both support async under the hood.

## Common Misconceptions

- **"Async streaming is faster than sync streaming."** Individual requests take the same time. The advantage is concurrency -- handling many requests simultaneously, not making one request faster.
- **"You need to rewrite your graph for async."** The graph definition (nodes, edges, state) is identical. Only the invocation call changes from `stream()` to `astream()`.
- **"Async means multi-threaded."** Python async is single-threaded concurrency. It yields control during I/O waits but does not use multiple CPU cores.
- **"You can mix sync and async freely."** Calling sync `stream()` inside an async handler blocks the event loop. Always use the async variant in async contexts.

## Connections to Other Concepts

- `stream-modes.md` -- The four streaming modes that `astream()` supports.
- `token-streaming.md` -- Token-level streaming works identically in async with `astream(stream_mode="messages")`.
- `streaming-in-production.md` -- Production SSE and WebSocket patterns built on async streaming.
- `../04-memory-and-persistence/checkpointers.md` -- Async-compatible checkpointers for async graph execution.
- `../09-deployment/fastapi-deployment.md` -- FastAPI endpoints that rely on `astream()` for non-blocking responses.

## Further Reading

- [LangGraph Async Streaming How-To](https://langchain-ai.github.io/langgraph/how-tos/streaming/) -- Official examples of async streaming patterns.
- [Python asyncio Documentation](https://docs.python.org/3/library/asyncio.html) -- Core reference for Python's async runtime.
- [FastAPI Streaming Responses](https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse) -- How FastAPI handles streaming with async generators.
- [ASGI Specification](https://asgi.readthedocs.io/) -- The server interface standard that enables async Python web applications.
