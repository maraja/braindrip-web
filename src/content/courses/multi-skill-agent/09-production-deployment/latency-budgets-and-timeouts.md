# Latency Budgets and Timeouts

**One-Line Summary**: Latency budgets decompose end-to-end response time targets into per-step limits, ensuring multi-skill agents deliver results within acceptable time frames.

**Prerequisites**: `anatomy-of-a-multi-skill-agent.md`, `breaking-complex-tasks-into-steps.md`

## What Is a Latency Budget?

Imagine ordering food at a restaurant with a strict lunch break. You have 45 minutes total. The host seats you in 2 minutes, you order in 5, the kitchen takes 20, the food arrives in 3, you eat in 12, and you pay in 3. Each phase has an implicit budget, and if the kitchen takes 35 minutes, you are late back to work no matter how fast everything else goes. A latency budget for an AI agent works the same way: you allocate a total time limit and distribute it across the steps the agent needs to complete.

In technical terms, a latency budget is a structured allocation of wall-clock time across the phases of an agent task. Each LLM inference call, each tool execution, and each data transfer step receives a maximum allowed duration. If any step exceeds its allocation, the system must decide whether to retry, skip, or abort. The budget also accounts for overhead: serialization, network round-trips, and queue wait times that individually seem negligible but compound across ten or more steps.

This matters because agent latency is fundamentally different from traditional API latency. A single API call takes 50-200ms. An agent that chains five LLM calls with three tool executions can easily take 30-60 seconds. Users accustomed to sub-second web responses will abandon tasks that take too long, making latency management a product-critical concern, not just an engineering nicety.

## How It Works

### Anatomy of Agent Latency

A typical agent task accumulates latency from distinct sources at each step:

```
Total Task Latency = Σ(LLM inference + tool execution + overhead) per step

Step breakdown for a 5-step agent:
┌──────────┬───────────┬────────────┬──────────┬─────────┐
│  Step     │ LLM Call  │ Tool Exec  │ Overhead │  Total  │
├──────────┼───────────┼────────────┼──────────┼─────────┤
│ 1: Plan   │   3.2s    │    —       │  0.1s    │  3.3s   │
│ 2: Search │   2.8s    │   1.5s     │  0.2s    │  4.5s   │
│ 3: Read   │   3.5s    │   2.0s     │  0.2s    │  5.7s   │
│ 4: Reason │   4.1s    │    —       │  0.1s    │  4.2s   │
│ 5: Write  │   5.0s    │    —       │  0.1s    │  5.1s   │
├──────────┼───────────┼────────────┼──────────┼─────────┤
│ Total     │  18.6s    │   3.5s     │  0.7s    │ 22.8s   │
└──────────┴───────────┴────────────┴──────────┴─────────┘
```

LLM inference latency scales with output token count (roughly 50-100 tokens per second for large models). A step generating 500 tokens takes 5-10 seconds. Tool execution varies wildly: a cached database lookup takes 10ms, a web page fetch takes 1-3 seconds, and a code execution sandbox might take 5-15 seconds.

### Implementing a Latency Budget

```python
import asyncio
import time
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class LatencyBudget:
    """Manages time allocation across agent steps."""
    total_budget_seconds: float
    per_step_llm_limit: float = 15.0
    per_step_tool_limit: float = 10.0
    start_time: float = field(default_factory=time.monotonic)
    step_timings: list[dict] = field(default_factory=list)

    @property
    def elapsed(self) -> float:
        return time.monotonic() - self.start_time

    @property
    def remaining(self) -> float:
        return max(0, self.total_budget_seconds - self.elapsed)

    def check_budget(self) -> bool:
        """Returns False if the overall budget is exhausted."""
        return self.remaining > 0

    def step_llm_timeout(self) -> float:
        """Timeout for the next LLM call, capped by remaining budget."""
        return min(self.per_step_llm_limit, self.remaining)

    def step_tool_timeout(self) -> float:
        """Timeout for the next tool call, capped by remaining budget."""
        return min(self.per_step_tool_limit, self.remaining)

    def record_step(self, step_name: str, llm_time: float,
                    tool_time: Optional[float] = None):
        self.step_timings.append({
            "step": step_name,
            "llm_seconds": llm_time,
            "tool_seconds": tool_time,
            "cumulative_seconds": self.elapsed,
        })


async def run_with_timeout(coro, timeout: float, fallback=None):
    """Execute a coroutine with a timeout, returning fallback on expiry."""
    try:
        return await asyncio.wait_for(coro, timeout=timeout)
    except asyncio.TimeoutError:
        return fallback
```

### Timeout Strategies

There are three levels of timeout to implement, each serving a different purpose:

**Per-step timeouts** prevent a single slow LLM call or tool execution from consuming the entire budget. If the LLM usually responds in 3 seconds but occasionally takes 30, a 15-second per-step limit ensures one bad call does not doom the task.

```python
async def execute_step(budget: LatencyBudget, llm_call, tool_call=None):
    """Execute one agent step with per-component timeouts."""
    t0 = time.monotonic()

    # LLM call with step-level timeout
    llm_result = await run_with_timeout(
        llm_call(),
        timeout=budget.step_llm_timeout(),
        fallback={"error": "LLM timeout", "partial": True}
    )
    llm_time = time.monotonic() - t0

    tool_time = None
    tool_result = None
    if tool_call and "error" not in llm_result:
        t1 = time.monotonic()
        tool_result = await run_with_timeout(
            tool_call(llm_result),
            timeout=budget.step_tool_timeout(),
            fallback={"error": "Tool timeout"}
        )
        tool_time = time.monotonic() - t1

    budget.record_step("step", llm_time, tool_time)
    return llm_result, tool_result
```

**Overall task timeout** caps the total wall-clock time regardless of how many steps remain. This is the user-facing SLA.

```python
async def agent_loop(goal: str, budget: LatencyBudget, max_steps: int = 15):
    """Main agent loop with overall timeout enforcement."""
    messages = [{"role": "user", "content": goal}]

    for step in range(max_steps):
        if not budget.check_budget():
            return compile_partial_result(messages, reason="timeout")

        llm_result, tool_result = await execute_step(
            budget,
            llm_call=lambda: call_llm(messages),
            tool_call=lambda r: execute_tool(r) if needs_tool(r) else None,
        )

        messages.append(llm_result)
        if tool_result:
            messages.append(tool_result)

        if is_final_answer(llm_result):
            return llm_result

    return compile_partial_result(messages, reason="max_steps")
```

**Adaptive timeouts** adjust limits based on observed performance. If the first three steps each took 2 seconds, the system can tighten the remaining per-step budget to leave room for the final output step, which typically needs more tokens and therefore more time.

```python
def adaptive_step_timeout(budget: LatencyBudget, steps_remaining: int) -> float:
    """Distribute remaining budget across remaining steps."""
    if steps_remaining <= 0:
        return 0.0
    # Reserve 30% of remaining time for the final answer step
    if steps_remaining == 1:
        return budget.remaining
    available = budget.remaining * 0.7
    return available / steps_remaining
```

### Streaming Partial Results

Users tolerate long waits better when they see progress. Streaming reduces perceived latency even when actual latency stays the same:

```python
async def stream_agent_progress(goal: str, budget: LatencyBudget):
    """Stream step-by-step progress to the client."""
    async def on_step_start(step_name: str):
        yield {"type": "status", "message": f"Working on: {step_name}"}

    async def on_step_complete(step_name: str, duration: float):
        yield {
            "type": "progress",
            "step": step_name,
            "duration_seconds": round(duration, 1),
            "time_remaining": round(budget.remaining, 1),
        }

    async def on_llm_token(token: str):
        yield {"type": "token", "content": token}
```

## Why It Matters

### User Experience Degrades Rapidly with Latency

Research on web application latency shows that user satisfaction drops sharply after 3 seconds and abandonment rates spike after 10 seconds. Agent tasks inherently take longer, but without budgeting, a 5-step task can silently balloon to 60+ seconds. Explicit budgets force architectural decisions that keep latency within the range users will tolerate for complex tasks (typically 15-45 seconds).

### Timeouts Prevent Resource Exhaustion

An agent stuck in a retry loop or waiting on a stalled API call consumes a worker process, an open LLM connection, and memory for its full context. Without timeouts, a handful of stuck tasks can exhaust server resources and degrade performance for all users.

## Key Technical Details

- LLM inference latency is dominated by output token generation: 50-100 tokens/second for GPT-4o class models, 100-200 tokens/second for smaller models
- Network round-trip to LLM APIs adds 100-300ms per call, more from regions far from the API provider
- Tool execution latency ranges from 5ms (cached lookup) to 30s (complex code execution)
- Streaming the first token from an LLM typically takes 0.5-2s (time-to-first-token), with remaining tokens arriving incrementally
- A 60-second overall budget comfortably accommodates 8-12 agent steps with typical LLM and tool latencies
- P99 latency is typically 3-5x the P50 for LLM calls due to variable server load

## Common Misconceptions

**"Just set a generous timeout and don't worry about it"**: A generous timeout masks performance problems until they cascade into failures. If your 120-second timeout fires 2% of the time, that is 2% of users getting a hard failure with no partial result. Tight, well-structured budgets with graceful degradation (returning partial results) provide a far better user experience than a binary succeed-or-timeout approach.

**"Parallel execution always reduces latency"**: Parallel tool execution helps only when the tools are independent. If step 3 depends on step 2's output, they must run sequentially. Moreover, parallel LLM calls against the same API can trigger rate limits, actually increasing latency. Parallel execution is a powerful tool but requires careful dependency analysis.

## Connections to Other Concepts

- `cost-tracking-and-optimization.md` — Timeouts directly prevent cost overruns by capping execution time
- `observability-and-tracing.md` — Latency metrics feed into the tracing and monitoring stack
- `scaling-agent-workloads.md` — Timeout policies prevent resource starvation at scale
- `breaking-complex-tasks-into-steps.md` — Task decomposition determines how many steps need to fit within the budget
- `parallel-skill-execution.md` — Parallel execution is a key strategy for reducing total latency

## Further Reading

- Google, "Tail at Scale" — Jeff Dean and Luiz Barroso (2013) — Foundational paper on managing latency variability in distributed systems
- Anthropic, "Streaming Messages API" (2024) — Official documentation for streaming LLM responses to reduce perceived latency
- Nygard, "Release It!" (2018) — Comprehensive coverage of timeout patterns, circuit breakers, and bulkheads for production systems
