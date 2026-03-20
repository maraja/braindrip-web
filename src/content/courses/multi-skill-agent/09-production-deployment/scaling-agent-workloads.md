# Scaling Agent Workloads

**One-Line Summary**: Scaling multi-skill agents requires managing concurrent sessions, queuing task execution, enforcing rate limits, and distributing work across multiple processes to serve hundreds or thousands of simultaneous users.

**Prerequisites**: `anatomy-of-a-multi-skill-agent.md`, `latency-budgets-and-timeouts.md`, `cost-tracking-and-optimization.md`

## What Is Agent Scaling?

Imagine a consulting firm with one senior consultant. That consultant can handle one client project at a time, spending hours on research, analysis, and writing. Now imagine the firm has 200 clients who all want projects done today. You cannot make the one consultant work 200 times faster. You need more consultants, a receptionist to manage the queue, and a system to ensure no client waits forever. Scaling AI agents is the same problem: each agent task consumes LLM API calls, tool executions, and memory, and you need infrastructure to handle many concurrent tasks without degrading quality or exhausting resources.

Technically, scaling agent workloads means designing a system architecture that can process many agent tasks concurrently while respecting external constraints: LLM API rate limits, tool API quotas, memory per session, and cost budgets. Unlike scaling a stateless web API (where you just add more servers), agents are stateful, long-running, and resource-intensive. A single agent task might hold an open connection for 30 seconds, consume 50K tokens of context, and make five external API calls. Naively running 100 of these concurrently will exceed API rate limits, exhaust memory, and produce cascading failures.

The core challenge is that agents have an inherently sequential inner loop (each step depends on the previous step's output) but the outer workload (many independent tasks) is embarrassingly parallel. The architecture must exploit this outer parallelism while respecting the constraints of each individual task.

## How It Works

### Architecture for 100+ Concurrent Sessions

The standard production architecture separates task ingestion from task execution using a message queue:

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│   API        │     │   Task      │     │  Worker Pool     │
│   Gateway    │────▶│   Queue     │────▶│  (N workers)     │
│  (FastAPI)   │     │  (Redis /   │     │                  │
│              │     │   RabbitMQ) │     │  ┌──────────┐   │
│  - Auth      │     │             │     │  │ Worker 1  │   │
│  - Rate limit│     │  - Priority │     │  │ (agent    │   │
│  - Validate  │     │  - TTL      │     │  │  loop)    │   │
│              │     │  - Retry    │     │  ├──────────┤   │
└─────────────┘     └─────────────┘     │  │ Worker 2  │   │
                                         │  ├──────────┤   │
┌─────────────┐                          │  │ Worker 3  │   │
│   Result     │◀────────────────────────│  ├──────────┤   │
│   Store      │                          │  │ ...       │   │
│  (Redis /    │                          │  ├──────────┤   │
│   Postgres)  │                          │  │ Worker N  │   │
└─────────────┘                          │  └──────────┘   │
                                         └──────────────────┘
```

```python
import asyncio
import redis.asyncio as redis
from dataclasses import dataclass
from uuid import uuid4
import json


@dataclass
class AgentTask:
    task_id: str
    user_id: str
    goal: str
    priority: int = 0          # 0 = normal, 1 = high
    max_steps: int = 15
    budget_usd: float = 0.50
    timeout_seconds: float = 60.0


class TaskQueue:
    """Redis-backed task queue with priority support."""

    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis = redis.from_url(redis_url)
        self.queue_key = "agent:tasks"
        self.result_prefix = "agent:result:"

    async def enqueue(self, task: AgentTask) -> str:
        """Add a task to the queue. Returns task_id."""
        task_data = json.dumps({
            "task_id": task.task_id,
            "user_id": task.user_id,
            "goal": task.goal,
            "max_steps": task.max_steps,
            "budget_usd": task.budget_usd,
            "timeout_seconds": task.timeout_seconds,
        })
        # Use sorted set for priority queuing
        await self.redis.zadd(self.queue_key, {task_data: task.priority})
        return task.task_id

    async def dequeue(self) -> AgentTask | None:
        """Pop the highest-priority task from the queue."""
        results = await self.redis.zpopmax(self.queue_key, count=1)
        if not results:
            return None
        task_data, _ = results[0]
        data = json.loads(task_data)
        return AgentTask(**data)

    async def store_result(self, task_id: str, result: dict, ttl: int = 3600):
        key = f"{self.result_prefix}{task_id}"
        await self.redis.setex(key, ttl, json.dumps(result))

    async def get_result(self, task_id: str) -> dict | None:
        key = f"{self.result_prefix}{task_id}"
        data = await self.redis.get(key)
        return json.loads(data) if data else None
```

### Worker Pool with Concurrency Control

Each worker runs one agent task at a time. The pool size is determined by API rate limits and memory constraints, not CPU:

```python
class WorkerPool:
    """Pool of agent workers with concurrency and rate limiting."""

    def __init__(self, queue: TaskQueue, max_workers: int = 10,
                 llm_rate_limit: int = 50):
        self.queue = queue
        self.max_workers = max_workers
        self.semaphore = asyncio.Semaphore(max_workers)
        self.llm_semaphore = asyncio.Semaphore(llm_rate_limit)
        self.active_tasks: dict[str, asyncio.Task] = {}

    async def rate_limited_llm_call(self, messages, tools):
        """LLM call that respects the global rate limit."""
        async with self.llm_semaphore:
            return await call_llm(messages, tools)

    async def run_agent_task(self, task: AgentTask):
        """Execute a single agent task within resource limits."""
        async with self.semaphore:
            try:
                result = await asyncio.wait_for(
                    agent_loop(
                        goal=task.goal,
                        max_steps=task.max_steps,
                        budget_usd=task.budget_usd,
                        llm_call_fn=self.rate_limited_llm_call,
                    ),
                    timeout=task.timeout_seconds,
                )
                await self.queue.store_result(task.task_id, {
                    "status": "completed",
                    "result": result,
                })
            except asyncio.TimeoutError:
                await self.queue.store_result(task.task_id, {
                    "status": "timeout",
                    "error": "Task exceeded time limit",
                })
            except Exception as e:
                await self.queue.store_result(task.task_id, {
                    "status": "error",
                    "error": str(e),
                })

    async def run(self):
        """Main worker loop: pull tasks and execute them."""
        while True:
            task = await self.queue.dequeue()
            if task is None:
                await asyncio.sleep(0.5)
                continue
            # Launch task execution without blocking the dequeue loop
            asyncio.create_task(self.run_agent_task(task))
```

### Rate Limiting for External APIs

LLM providers enforce rate limits (e.g., 60 requests per minute for GPT-4). A token bucket algorithm distributes capacity fairly across workers:

```python
import time


class TokenBucket:
    """Rate limiter using the token bucket algorithm."""

    def __init__(self, rate: float, capacity: int):
        self.rate = rate              # tokens added per second
        self.capacity = capacity      # max burst size
        self.tokens = capacity
        self.last_refill = time.monotonic()

    async def acquire(self, tokens: int = 1):
        """Wait until enough tokens are available."""
        while True:
            now = time.monotonic()
            elapsed = now - self.last_refill
            self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
            self.last_refill = now

            if self.tokens >= tokens:
                self.tokens -= tokens
                return
            # Wait for enough tokens to accumulate
            wait_time = (tokens - self.tokens) / self.rate
            await asyncio.sleep(wait_time)


# Example: 60 requests per minute = 1 per second, burst of 5
llm_rate_limiter = TokenBucket(rate=1.0, capacity=5)

async def rate_limited_call(messages, tools):
    await llm_rate_limiter.acquire()
    return await call_llm(messages, tools)
```

### Horizontal Scaling

For workloads exceeding what a single machine can handle, deploy multiple worker processes behind a shared queue:

```python
# docker-compose.yml (conceptual)
SCALING_CONFIG = """
services:
  api:
    image: agent-api:latest
    replicas: 2
    ports: ["8000:8000"]
    environment:
      REDIS_URL: redis://redis:6379

  worker:
    image: agent-worker:latest
    replicas: 5                    # Scale this up based on demand
    environment:
      REDIS_URL: redis://redis:6379
      MAX_CONCURRENT_TASKS: 10     # Per worker
      LLM_RATE_LIMIT: 12          # Per worker (60 total / 5 workers)

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
"""

# Scaling math:
# 5 workers x 10 concurrent tasks = 50 concurrent agent sessions
# Each session averages 7 steps x 3s per step = 21s duration
# Throughput: 50 / 21 ≈ 2.4 tasks completed per second
# Daily capacity: 2.4 * 86400 ≈ 207,000 tasks/day
```

### Memory Management

Each agent session holds its full conversation history in memory. At scale, this becomes a significant constraint:

```python
import sys

def estimate_session_memory(avg_steps: int = 7,
                            tokens_per_step: int = 1500) -> int:
    """Estimate memory per agent session in bytes."""
    # ~4 bytes per token in Python string representation
    bytes_per_token = 4
    total_tokens = avg_steps * tokens_per_step
    message_overhead = avg_steps * 200  # dict overhead per message
    return total_tokens * bytes_per_token + message_overhead

# Per session: 7 * 1500 * 4 + 7 * 200 ≈ 43,400 bytes ≈ 42 KB
# 100 concurrent sessions: ~4.2 MB (manageable)
# 1000 concurrent sessions: ~42 MB (still fine)
# 10000 concurrent sessions: ~420 MB (need to plan for this)
```

## Why It Matters

### Real Workloads Are Bursty

Production traffic does not arrive uniformly. A SaaS product might see 10 agent tasks per minute during quiet hours and 200 per minute after a marketing email goes out. Without queue-based architecture and elastic scaling, the system either wastes resources during quiet times or drops requests during peaks.

### API Rate Limits Are the True Bottleneck

Unlike traditional web applications where CPU or database connections are the bottleneck, agent workloads are constrained by external API rate limits. OpenAI's rate limits, search API quotas, and tool API throttling all create hard ceilings. The scaling architecture must distribute these limited resources fairly across concurrent tasks rather than letting one runaway task consume the entire quota.

## Key Technical Details

- A single LLM API call blocks for 2-10 seconds, making async execution essential (sync workers would be idle 95%+ of the time)
- GPT-4 rate limits are typically 500-10,000 RPM depending on tier; plan worker count around this constraint
- Redis can handle 100,000+ queue operations per second, so it is never the bottleneck
- Memory per session is typically 20-100 KB; 1,000 concurrent sessions need ~100 MB
- Auto-scaling based on queue depth (scale up when queue > 50, scale down when queue < 5) provides good cost-latency tradeoff
- Connection pooling for LLM APIs reduces TLS handshake overhead from ~200ms to near zero for subsequent calls

## Common Misconceptions

**"Just run more servers to handle more load"**: Adding servers helps only if the bottleneck is compute. For agent workloads, the bottleneck is almost always external API rate limits. Ten servers sharing a 60 RPM rate limit are no faster than one server. Scaling requires either higher API tiers, model routing to spread load across providers, or caching to reduce the total number of API calls.

**"Agents need GPU servers"**: Unless you are self-hosting open-source models, agent workloads are CPU-light and IO-heavy. The worker processes spend most of their time waiting for LLM API responses and tool executions. Standard cloud VMs or even serverless functions are appropriate. GPU servers are only needed if you are running local model inference.

## Connections to Other Concepts

- `cost-tracking-and-optimization.md` — At scale, even small per-task savings multiply to significant budget impact
- `latency-budgets-and-timeouts.md` — Timeouts prevent stuck tasks from consuming worker capacity
- `observability-and-tracing.md` — Queue depth, worker utilization, and error rates are essential scaling metrics
- `parallel-skill-execution.md` — Intra-task parallelism reduces per-task duration, improving throughput
- `error-recovery-and-retry-strategies.md` — Retries at scale require careful backoff to avoid amplifying rate limit pressure

## Further Reading

- Sam Newman, "Building Microservices" (2021) — Architectural patterns for scaling distributed systems
- Martin Kleppmann, "Designing Data-Intensive Applications" (2017) — Comprehensive treatment of queues, scaling, and distributed processing
- AWS, "Serverless Patterns for AI Agents" (2024) — Cloud-native approaches to scaling LLM-powered applications
- OpenAI, "Rate Limits and Best Practices" (2024) — Official guidance on managing API quotas at scale
