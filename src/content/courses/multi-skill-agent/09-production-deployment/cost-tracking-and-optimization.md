# Cost Tracking and Optimization

**One-Line Summary**: Managing and minimizing the financial cost of running multi-skill AI agents in production through systematic tracking, budgeting, and optimization strategies.

**Prerequisites**: `anatomy-of-a-multi-skill-agent.md`, `observability-and-tracing.md`

## What Is Cost Tracking for AI Agents?

Running a single LLM call is cheap. Running an agent that makes ten LLM calls, executes five tool invocations, and retries twice on failure is not. Think of an AI agent like a taxi ride with the meter running: every reasoning step ticks the meter forward, every tool call adds a surcharge, and every retry doubles the fare. Without tracking, you discover the bill only at the end of the month.

Cost tracking for AI agents means instrumenting every billable operation — LLM inference, tool execution, external API calls, and compute time — so you can attribute costs to individual tasks, users, or workflows. This gives you the data to set budgets, detect runaway agents, and optimize where it matters most.

Unlike traditional software where compute cost is relatively predictable, agent costs are inherently variable. A simple query might resolve in two steps; a complex one might take fifteen. This variability makes proactive cost management essential rather than optional.

## How It Works

### Breaking Down Agent Costs

Every agent task accumulates cost from three primary sources:

```python
from dataclasses import dataclass, field
from typing import Optional

@dataclass
class StepCost:
    """Cost breakdown for a single agent step."""
    step_number: int
    llm_input_tokens: int
    llm_output_tokens: int
    llm_cost_usd: float
    tool_name: Optional[str] = None
    tool_cost_usd: float = 0.0
    compute_time_seconds: float = 0.0

    @property
    def total_cost_usd(self) -> float:
        return self.llm_cost_usd + self.tool_cost_usd


@dataclass
class TaskCost:
    """Total cost breakdown for an entire agent task."""
    task_id: str
    steps: list[StepCost] = field(default_factory=list)

    @property
    def total_llm_cost(self) -> float:
        return sum(s.llm_cost_usd for s in self.steps)

    @property
    def total_tool_cost(self) -> float:
        return sum(s.tool_cost_usd for s in self.steps)

    @property
    def total_cost(self) -> float:
        return self.total_llm_cost + self.total_tool_cost

    @property
    def total_tokens(self) -> int:
        return sum(s.llm_input_tokens + s.llm_output_tokens for s in self.steps)
```

### Cost Calculation Example

Consider a 10-step research agent using GPT-4o at $2.50 per 1M input tokens and $10.00 per 1M output tokens:

```python
# Realistic 10-step agent cost breakdown
COST_PER_1K_INPUT = 0.0025   # $2.50 / 1M tokens
COST_PER_1K_OUTPUT = 0.01    # $10.00 / 1M tokens

steps = [
    # Step 1: Parse query (small context)
    {"input_tokens": 500,  "output_tokens": 100, "tool": None,         "tool_cost": 0.00},
    # Step 2: Plan research (growing context)
    {"input_tokens": 800,  "output_tokens": 300, "tool": None,         "tool_cost": 0.00},
    # Step 3: Web search
    {"input_tokens": 1200, "output_tokens": 150, "tool": "web_search", "tool_cost": 0.005},
    # Step 4: Read page 1
    {"input_tokens": 2500, "output_tokens": 200, "tool": "read_page",  "tool_cost": 0.001},
    # Step 5: Read page 2
    {"input_tokens": 3800, "output_tokens": 200, "tool": "read_page",  "tool_cost": 0.001},
    # Step 6: Summarize findings
    {"input_tokens": 4500, "output_tokens": 500, "tool": None,         "tool_cost": 0.00},
    # Step 7: Fact-check search
    {"input_tokens": 5200, "output_tokens": 150, "tool": "web_search", "tool_cost": 0.005},
    # Step 8: Read verification source
    {"input_tokens": 6000, "output_tokens": 200, "tool": "read_page",  "tool_cost": 0.001},
    # Step 9: Draft report
    {"input_tokens": 6800, "output_tokens": 1000,"tool": None,         "tool_cost": 0.00},
    # Step 10: Final formatting
    {"input_tokens": 7500, "output_tokens": 400, "tool": None,         "tool_cost": 0.00},
]

total_input = sum(s["input_tokens"] for s in steps)     # 38,800 tokens
total_output = sum(s["output_tokens"] for s in steps)    # 3,200 tokens
total_tool = sum(s["tool_cost"] for s in steps)          # $0.013

llm_cost = (total_input / 1000) * COST_PER_1K_INPUT + \
           (total_output / 1000) * COST_PER_1K_OUTPUT
# LLM cost: $0.097 + $0.032 = $0.129
# Tool cost: $0.013
# Total per task: ~$0.142
```

Note how input tokens grow at each step because the full conversation history is sent. This context accumulation is the single largest cost driver in multi-step agents.

### Optimization Strategies

```python
from functools import lru_cache
import hashlib
import json

# Strategy 1: Model routing — use cheaper models for simple steps
MODEL_ROUTING = {
    "parse_query": "gpt-4o-mini",      # $0.15 / 1M input
    "plan_research": "gpt-4o",          # $2.50 / 1M input
    "summarize": "gpt-4o-mini",         # Simple extraction
    "fact_check": "gpt-4o",             # Needs reasoning
    "write_report": "gpt-4o",           # Quality matters
}

# Strategy 2: Cache frequent tool results
class ToolCache:
    def __init__(self, ttl_seconds: int = 3600):
        self._cache: dict[str, tuple[float, any]] = {}
        self._ttl = ttl_seconds

    def cache_key(self, tool_name: str, args: dict) -> str:
        raw = json.dumps({"tool": tool_name, "args": args}, sort_keys=True)
        return hashlib.sha256(raw.encode()).hexdigest()

    def get(self, tool_name: str, args: dict):
        key = self.cache_key(tool_name, args)
        if key in self._cache:
            timestamp, result = self._cache[key]
            if time.time() - timestamp < self._ttl:
                return result
        return None

    def set(self, tool_name: str, args: dict, result):
        key = self.cache_key(tool_name, args)
        self._cache[key] = (time.time(), result)

# Strategy 3: Early termination with cost budgets
class CostBudget:
    def __init__(self, max_cost_usd: float = 0.50):
        self.max_cost = max_cost_usd
        self.spent = 0.0

    def record(self, cost: float):
        self.spent += cost
        if self.spent >= self.max_cost:
            raise BudgetExceededError(
                f"Task exceeded budget: ${self.spent:.3f} >= ${self.max_cost:.3f}"
            )

# Strategy 4: Context window summarization to reduce token growth
def compress_history(messages: list[dict], keep_last: int = 3) -> list[dict]:
    """Summarize older messages to reduce input token count."""
    if len(messages) <= keep_last + 1:
        return messages
    system = messages[0]
    old = messages[1:-keep_last]
    recent = messages[-keep_last:]
    summary = llm_summarize(old)  # Cheap model call
    return [system, {"role": "assistant", "content": summary}] + recent
```

### Cost Monitoring Dashboard Design

A production cost dashboard should display four panels:

1. **Real-Time Cost Ticker** — Current spend rate ($/hour), active tasks, projected daily cost.
2. **Per-Task Breakdown** — Table showing task ID, step count, total tokens, LLM cost, tool cost, total cost. Sortable by any column. Flag tasks exceeding 2x median cost in red.
3. **Cost Distribution Chart** — Histogram of cost-per-task over the last 24 hours. Overlay the P50, P90, and P99 lines. Alert if P90 drifts upward.
4. **Optimization Opportunities** — Auto-detected suggestions: "42% of summarize calls could use gpt-4o-mini", "web_search cache hit rate is 12% — consider increasing TTL", "15 tasks hit budget limit — review max_steps."

## Why It Matters

### Costs Scale Non-Linearly

A single agent task costs $0.14. Serve 1,000 users per day and that is $140/day, $4,200/month. But agents with retries, long conversations, or complex tools can cost 5-10x more than the median. Without tracking, a handful of runaway tasks can dominate your bill.

### Optimization Compounds

Routing 40% of steps to a model that is 15x cheaper reduces total LLM cost by roughly 50%. Adding tool caching with a 30% hit rate saves another 15% on tool costs. Compressing conversation history after step 5 cuts input tokens by 35% for longer tasks. Combined, these bring the $0.14 task down to $0.05.

## Key Technical Details

- Context accumulation causes input tokens to grow roughly linearly with step count, making later steps disproportionately expensive
- GPT-4o-mini is ~15x cheaper than GPT-4o for input tokens ($0.15 vs $2.50 per 1M)
- Tool caching is most effective for search queries — identical or near-identical searches are common across users
- A hard budget of $0.50 per task catches 99.9% of runaway agents while allowing complex tasks to complete
- Batching multiple agent tasks into a single API call is not straightforward because agents are inherently sequential, but tool calls within a single step can be batched

## Common Misconceptions

**"LLM cost is the only cost that matters"**: Tool execution costs, compute time for hosting the agent loop, and external API fees (search engines, databases) can collectively rival or exceed LLM costs, especially when tools involve paid APIs. Always track the full cost stack.

**"Caching does not work for agents because every query is different"**: While the high-level queries differ, the underlying tool calls often overlap significantly. Two users researching related topics will hit many of the same web pages. Tool-level caching with content-addressable keys typically achieves 20-40% hit rates in production.

**"Using a cheaper model always saves money"**: A cheaper model that requires more steps to reach the same result can cost more overall. If GPT-4o solves a task in 5 steps but GPT-4o-mini needs 12 steps, the mini path may actually be more expensive. Measure end-to-end cost, not per-token cost.

## Connections to Other Concepts

- `observability-and-tracing.md` — Cost metrics are a key dimension of the observability stack
- `latency-budgets-and-timeouts.md` — Timeouts prevent runaway costs by capping execution time
- `scaling-agent-workloads.md` — At scale, cost optimization has outsized impact on infrastructure budgets
- `anatomy-of-a-multi-skill-agent.md` — Understanding the agent loop is essential for identifying cost hotspots

## Further Reading

- Harrison Chase, "LangSmith Documentation: Cost Tracking" (2024) — Practical guide to tracking LLM costs in LangChain applications
- OpenAI, "API Pricing and Token Counting" (2024) — Official reference for understanding token-based billing
- Chip Huyen, "Building LLM Applications for Production" (2023) — Covers cost optimization as part of production ML systems
