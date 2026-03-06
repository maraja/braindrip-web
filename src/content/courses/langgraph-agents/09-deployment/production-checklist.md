# Production Checklist

**One-Line Summary**: Twelve essential steps that transform a working LangGraph prototype into a reliable, observable, and maintainable production system.

**Prerequisites**: `fastapi-deployment.md`, `checkpointers.md`, `containerization.md`, `langsmith-tracing.md`

## What Is the Production Checklist?

Think of the difference between a test flight and a commercial airline route. The plane might fly perfectly in both cases, but the commercial route requires checklists for fuel reserves, weather contingencies, maintenance schedules, passenger safety systems, and communication protocols. Your LangGraph agent that works flawlessly in a notebook needs the same treatment before real users depend on it.

Most agent failures in production are not from bad prompts or wrong tools -- they come from missing infrastructure: conversations lost because state was in memory, runaway loops burning hundreds of dollars in API calls, silent failures with no alerting, and debugging sessions that take hours because there is no execution trace. Each item below addresses a specific failure mode that teams discover the hard way. Skip any one of them and you are building a time bomb with a random fuse.

## How It Works

### 1. Use PostgreSQL Checkpointer

```python
# WRONG: state lost on restart, no multi-worker support
from langgraph.checkpoint.memory import MemorySaver
checkpointer = MemorySaver()

# RIGHT: persistent, concurrent, survives restarts
from langgraph.checkpoint.postgres import PostgresSaver
checkpointer = PostgresSaver(conn_string="postgresql://user:pass@host/db")
```

### 2. Enable LangSmith Tracing

```python
# Set environment variables -- zero code changes needed
# LANGSMITH_TRACING=true
# LANGSMITH_API_KEY=your-key
# LANGSMITH_PROJECT=production-agent

import os
os.environ["LANGSMITH_TRACING"] = "true"
```

### 3. Set Recursion Limit

```python
# Prevent infinite loops from burning your API budget
config = {
    "configurable": {"thread_id": "user-123"},
    "recursion_limit": 25,  # default is 25, set explicitly
}
result = agent.invoke({"messages": [...]}, config=config)
```

### 4. Add Retry Policy

```python
from langgraph.pregel import RetryPolicy

# Retry transient failures in tool-calling nodes
retry = RetryPolicy(max_attempts=3, backoff_factor=2.0)

graph_builder.add_node("search", search_node, retry=retry)
```

### 5. Implement Graceful Degradation

```python
async def resilient_tool_node(state):
    try:
        result = await call_external_api(state["query"])
    except Exception as e:
        result = f"Service temporarily unavailable: {str(e)}"
    return {"messages": [AIMessage(content=result)]}
```

### 6. Tie Thread IDs to User Sessions

```python
@app.post("/chat")
async def chat(request: ChatRequest, user=Depends(get_current_user)):
    # Thread ID includes user scope to prevent cross-user data leaks
    thread_id = f"{user.id}:{request.conversation_id}"
    config = {"configurable": {"thread_id": thread_id}}
    result = agent.invoke({"messages": [...]}, config=config)
    return {"response": result["messages"][-1].content}
```

### 7-9. Health Checks, Rate Limiting, Structured Logging

```python
import logging, time
from fastapi import Request
from collections import defaultdict

logging.basicConfig(format='{"time":"%(asctime)s","level":"%(levelname)s","msg":"%(message)s"}')
request_counts = defaultdict(list)

@app.middleware("http")
async def rate_limit(request: Request, call_next):
    client_ip = request.client.host
    now = time.time()
    request_counts[client_ip] = [t for t in request_counts[client_ip] if now - t < 60]
    if len(request_counts[client_ip]) >= 30:
        return JSONResponse(status_code=429, content={"error": "Rate limit exceeded"})
    request_counts[client_ip].append(now)
    return await call_next(request)
```

### 10-12. Testing, Cost Monitoring, Prompt Versioning

```python
def test_agent_responds():
    config = {"configurable": {"thread_id": "test-integration"}}
    result = agent.invoke(
        {"messages": [{"role": "user", "content": "What is 2+2?"}]}, config=config,
    )
    assert result["messages"][-1].content  # non-empty response

# Prompt versioning -- store prompts with version metadata
AGENT_PROMPT_V2 = "You are a helpful assistant. Version: 2.1. Always cite sources."
# LangSmith automatically tracks token usage, costs, and latency per trace
```

## Why It Matters

1. **Prevents data loss** -- PostgreSQL checkpointer ensures conversations survive restarts, deployments, and crashes.
2. **Controls costs** -- recursion limits and monitoring prevent a single runaway loop from generating a thousand-dollar API bill overnight.
3. **Enables debugging** -- LangSmith traces let you replay any user interaction step by step, reducing incident investigation from hours to minutes.
4. **Ensures reliability** -- retry policies and graceful degradation keep the agent functional even when external services fail.
5. **Protects users** -- scoped thread IDs, rate limiting, and authentication prevent data leaks and abuse.

## Key Technical Details

- `recursion_limit` defaults to 25 in LangGraph; set it explicitly so the limit is visible and intentional.
- `RetryPolicy` accepts `max_attempts`, `backoff_factor`, and `retry_on` (a callable that filters which exceptions to retry).
- LangSmith tracing is activated entirely through environment variables -- no code instrumentation required.
- PostgresSaver requires the `langgraph-checkpoint-postgres` package and a running PostgreSQL instance.
- Thread IDs should be namespaced by user to prevent one user from accessing another user's conversation history.
- Structured JSON logging integrates with log aggregation services (Datadog, CloudWatch, ELK) out of the box.
- Version your prompts in code or a configuration store so you can roll back when a new version degrades quality.
- Write integration tests that invoke the full compiled graph, not just individual nodes, to catch wiring errors.

## Common Misconceptions

- **"MemorySaver is fine if you only have one server."** A single server still restarts during deployments, crashes, and OS updates. Every restart loses all conversation history.
- **"Setting recursion_limit to 100 gives the agent more room to think."** High limits let buggy graphs burn through API credits in loops. Set the limit to the lowest value that covers your legitimate use cases.
- **"LangSmith tracing adds too much latency for production."** Tracing is asynchronous and adds negligible latency. The debugging value during incidents far outweighs the sub-millisecond overhead.
- **"You can add production hardening later."** Each item in this checklist addresses a failure that gets harder to fix after launch. Retrofitting persistence or observability into a live system is significantly more disruptive than building it in from the start.

## Connections to Other Concepts

- `checkpointers.md` -- item 1, the foundation of production persistence
- `fastapi-deployment.md` -- the API layer where most checklist items are implemented
- `containerization.md` -- Docker packaging that makes deployment reproducible
- `langsmith-tracing.md` -- item 2, the observability layer for debugging production issues
- `interrupt-and-resume.md` -- human-in-the-loop patterns that depend on persistent checkpointers
- `thread-based-memory.md` -- item 6, scoping threads to users for data isolation

## Further Reading

- [LangGraph Production Best Practices](https://langchain-ai.github.io/langgraph/how-tos/)
- [LangSmith Production Monitoring](https://docs.smith.langchain.com/)
- [PostgresSaver Setup Guide](https://langchain-ai.github.io/langgraph/how-tos/persistence_postgres/)
- [The Twelve-Factor App](https://12factor.net/) -- general principles that apply to agent deployments
