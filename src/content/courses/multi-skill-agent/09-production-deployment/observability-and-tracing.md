# Observability and Tracing

**One-Line Summary**: Observability for AI agents means capturing structured traces of every reasoning step, tool call, and decision so you can understand, debug, and optimize agent behavior in production.

**Prerequisites**: `anatomy-of-a-multi-skill-agent.md`, `agent-runtime-loop.md`

## What Is Agent Observability?

Think of observability like a flight data recorder on an aircraft. The pilots fly the plane, but the black box records every instrument reading, every control input, and every communication. When something goes wrong — or when you simply want to understand why a flight used more fuel than expected — the recorder provides the complete picture. Agent observability serves the same purpose: it records every LLM call, every tool invocation, every decision point, and every intermediate result so you can reconstruct exactly what happened during any agent run.

Traditional software observability focuses on request-response cycles measured in milliseconds. Agent observability is fundamentally different because agents are multi-step, non-deterministic, and self-directed. The same user query might produce a 3-step trace one time and an 8-step trace the next. The agent might choose different tools, encounter different errors, and arrive at different conclusions. Without structured tracing, debugging an agent failure is like debugging a program without stack traces — you know it failed, but not where or why.

The three pillars of agent observability are structured logging (what happened), distributed tracing (how steps connect), and metrics (aggregate patterns over time). Together they answer the questions that matter in production: Why did this task take 45 seconds? Why did the agent use 12 steps instead of 5? Why did costs spike at 3pm? Why did the agent hallucinate a tool that doesn't exist?

## How It Works

### Structured Logging for Agent Steps

Every agent step should emit a structured log entry containing the inputs, outputs, timing, and cost of that step:

```python
import json
import time
import logging
from dataclasses import dataclass, asdict
from typing import Optional
from uuid import uuid4

logger = logging.getLogger("agent.trace")


@dataclass
class AgentStepLog:
    """Structured log entry for a single agent step."""
    trace_id: str
    step_number: int
    step_type: str              # "llm_call" | "tool_execution" | "decision"
    model: Optional[str] = None
    input_tokens: int = 0
    output_tokens: int = 0
    tool_name: Optional[str] = None
    tool_input: Optional[dict] = None
    tool_output_summary: Optional[str] = None
    duration_seconds: float = 0.0
    cost_usd: float = 0.0
    error: Optional[str] = None
    timestamp: float = 0.0

    def emit(self):
        self.timestamp = time.time()
        logger.info(json.dumps(asdict(self)))


class AgentTracer:
    """Captures a full execution trace for one agent task."""

    def __init__(self, task_id: Optional[str] = None):
        self.trace_id = task_id or str(uuid4())
        self.steps: list[AgentStepLog] = []
        self._step_counter = 0

    def log_llm_call(self, model: str, input_tokens: int,
                     output_tokens: int, duration: float, cost: float):
        self._step_counter += 1
        step = AgentStepLog(
            trace_id=self.trace_id,
            step_number=self._step_counter,
            step_type="llm_call",
            model=model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            duration_seconds=duration,
            cost_usd=cost,
        )
        step.emit()
        self.steps.append(step)

    def log_tool_call(self, tool_name: str, tool_input: dict,
                      output_summary: str, duration: float,
                      cost: float = 0.0, error: str = None):
        self._step_counter += 1
        step = AgentStepLog(
            trace_id=self.trace_id,
            step_number=self._step_counter,
            step_type="tool_execution",
            tool_name=tool_name,
            tool_input=tool_input,
            tool_output_summary=output_summary[:500],
            duration_seconds=duration,
            cost_usd=cost,
            error=error,
        )
        step.emit()
        self.steps.append(step)

    def summary(self) -> dict:
        return {
            "trace_id": self.trace_id,
            "total_steps": len(self.steps),
            "total_duration": sum(s.duration_seconds for s in self.steps),
            "total_cost": sum(s.cost_usd for s in self.steps),
            "total_tokens": sum(s.input_tokens + s.output_tokens for s in self.steps),
            "tools_used": list(set(
                s.tool_name for s in self.steps if s.tool_name
            )),
            "errors": [s.error for s in self.steps if s.error],
        }
```

### Distributed Tracing with OpenTelemetry

OpenTelemetry provides a vendor-neutral standard for distributed tracing. Each agent task becomes a trace, and each step becomes a span within that trace:

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import (
    OTLPSpanExporter,
)

# Initialize the tracer
provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter(endpoint="localhost:4317"))
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("multi-skill-agent")


async def traced_agent_loop(goal: str, tools: list):
    """Agent loop instrumented with OpenTelemetry spans."""
    with tracer.start_as_current_span("agent_task") as task_span:
        task_span.set_attribute("agent.goal", goal[:200])
        task_span.set_attribute("agent.tool_count", len(tools))
        messages = [{"role": "user", "content": goal}]
        step = 0

        while step < 15:
            step += 1

            # Trace the LLM call
            with tracer.start_as_current_span(f"llm_call_{step}") as llm_span:
                response = await call_llm(messages, tools)
                llm_span.set_attribute("llm.model", response.model)
                llm_span.set_attribute("llm.input_tokens", response.usage.input)
                llm_span.set_attribute("llm.output_tokens", response.usage.output)

            if response.stop_reason == "end_turn":
                task_span.set_attribute("agent.total_steps", step)
                return response.content

            # Trace the tool call
            with tracer.start_as_current_span(f"tool_{step}") as tool_span:
                tool_name = response.tool_use.name
                tool_span.set_attribute("tool.name", tool_name)
                tool_span.set_attribute("tool.input", str(response.tool_use.input)[:500])
                result = await execute_tool(tool_name, response.tool_use.input)
                tool_span.set_attribute("tool.output_length", len(str(result)))

            messages.append(response)
            messages.append({"role": "tool", "content": result})
```

### LangSmith and LangFuse Integration

For teams using LangChain or LangGraph, purpose-built platforms provide agent-aware tracing out of the box:

```python
# LangSmith integration with LangGraph
import os
from langgraph.graph import StateGraph

# Enable LangSmith tracing with environment variables
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "ls_..."
os.environ["LANGCHAIN_PROJECT"] = "research-agent-prod"

# LangFuse integration (open-source alternative)
from langfuse.callback import CallbackHandler

langfuse_handler = CallbackHandler(
    public_key="pk-...",
    secret_key="sk-...",
    host="https://cloud.langfuse.com",
)

# Attach to any LangGraph invocation
result = await graph.ainvoke(
    {"query": "Research quantum computing advances"},
    config={"callbacks": [langfuse_handler]},
)
```

Both platforms automatically capture LLM inputs/outputs, tool calls, token counts, latencies, and costs. They provide a tree-view UI where you can expand each agent step, inspect the exact prompt sent to the model, and see the raw tool output.

### Key Metrics for Production Dashboards

A production agent observability dashboard should track these metrics:

```
COMPLETION METRICS
├── Task completion rate          — % of tasks reaching a final answer
├── Avg steps to completion       — Mean number of agent loop iterations
├── P50 / P90 / P99 task latency — Wall-clock time distribution
└── Partial result rate           — % of tasks returning incomplete answers

COST METRICS
├── Cost per task (P50/P90/P99)   — Dollar distribution
├── Tokens per task               — Input + output token totals
├── Cost by model                 — Breakdown across model tiers
└── Hourly/daily spend rate       — Burn rate for budget alerts

ERROR METRICS
├── Tool failure rate             — % of tool calls returning errors
├── LLM timeout rate              — % of LLM calls exceeding timeout
├── Budget exceeded rate          — % of tasks hitting cost limit
├── Invalid tool selection rate   — % of steps where LLM picks wrong tool
└── Retry rate                    — % of steps requiring retry

QUALITY METRICS
├── User feedback score           — Thumbs up/down or 1-5 rating
├── Tool call accuracy            — % of tool calls that return useful results
└── Hallucination rate            — % of final answers containing unverifiable claims
```

### Dashboard Mockup Description

The production dashboard is organized into four quadrants. The top-left shows a real-time feed of active agent tasks, each displayed as a horizontal timeline bar with colored segments (blue for LLM calls, green for tool executions, red for errors). The top-right displays aggregate metrics: completion rate as a large number with a 7-day trend sparkline, average cost per task, and P90 latency. The bottom-left contains a filterable table of recent traces, sortable by duration, cost, step count, or error status, with each row expandable to show the full step-by-step trace. The bottom-right shows three time-series charts: hourly task volume, hourly cost, and hourly error rate, each with alert threshold lines drawn in orange.

## Why It Matters

### Agents Are Non-Deterministic by Nature

The same input can produce different execution paths across runs. Without tracing, you cannot answer basic questions like "Why did this task cost $0.80 when similar tasks cost $0.10?" or "Why did the agent loop 12 times instead of stopping at 5?" Observability transforms agent behavior from a black box into something you can reason about and improve.

### Production Debugging Requires Full Context

When a user reports that the agent gave a wrong answer, you need to see every step: what the LLM was asked, what it decided, what the tool returned, and how the LLM interpreted that result. A simple error log saying "task failed" is useless. A full trace showing that the web_search tool returned a 403 error on step 3, the agent retried with a different query, got irrelevant results, and then hallucinated an answer — that is actionable.

## Key Technical Details

- A typical agent trace for a 7-step task generates 2-5 KB of structured log data
- OpenTelemetry span export adds less than 1ms overhead per span when using async batch exporters
- LangSmith charges per traced LLM call; LangFuse is open-source and self-hostable
- Storing traces for 30 days at 10,000 tasks/day requires approximately 1-5 GB of storage
- Sampling at 10% in high-traffic production still provides statistically meaningful metrics while reducing storage costs by 90%
- The most common root cause of agent failures (40-60% of cases) is tool execution errors, not LLM reasoning errors

## Common Misconceptions

**"Standard application logging is sufficient for agents"**: Standard logging captures individual events but not the causal chain between them. An agent step that returns an error is meaningless without knowing what the LLM asked for, why it chose that tool, and what it did with the error. Agent observability requires trace-level context that links steps together into a coherent narrative.

**"Tracing adds too much overhead for production"**: Modern tracing libraries like OpenTelemetry use asynchronous batch exporters that add sub-millisecond overhead per span. Compared to the 2-10 seconds each LLM call takes, the tracing overhead is negligible. The cost of not tracing — hours spent debugging blind — far exceeds the engineering cost of instrumentation.

## Connections to Other Concepts

- `cost-tracking-and-optimization.md` — Cost metrics are derived from the data captured by the tracing system
- `latency-budgets-and-timeouts.md` — Latency measurements come from span durations in the trace
- `scaling-agent-workloads.md` — Observability is essential for capacity planning and scaling decisions
- `error-recovery-and-retry-strategies.md` — Error traces reveal which retry strategies are effective
- `anatomy-of-a-multi-skill-agent.md` — The three-layer architecture defines what to instrument

## Further Reading

- Harrison Chase, "LangSmith Documentation" (2024) — Official guide to tracing and evaluating LangChain/LangGraph applications
- LangFuse Team, "LangFuse: Open Source LLM Observability" (2024) — Self-hostable alternative for LLM tracing
- Majors et al., "Observability Engineering" (2022) — Comprehensive treatment of observability principles applied to modern systems
- OpenTelemetry Project, "Getting Started with OpenTelemetry in Python" (2024) — Official guide to instrumenting Python applications
