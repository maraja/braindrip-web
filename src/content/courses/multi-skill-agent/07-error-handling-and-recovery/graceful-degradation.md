# Graceful Degradation

**One-Line Summary**: Strategies for maintaining useful agent behavior when one or more skills are unavailable, including fallback chains, capability degradation matrices, and user notification patterns.

**Prerequisites**: `error-categories-in-agent-systems.md`, `retry-strategies-and-backoff.md`

## What Is Graceful Degradation?

Imagine a restaurant where the grill breaks down mid-service. A bad restaurant closes entirely. A good restaurant switches to stovetop cooking — the steaks might not be chargrilled, but customers still get fed. The best restaurants tell customers what happened, offer alternatives, and adjust the menu in real time. That is graceful degradation: delivering reduced but still valuable service when full capability is unavailable.

In a multi-skill agent, graceful degradation means the agent continues to make progress on a user's task even when some tools or services fail permanently (after retries are exhausted). Instead of returning a generic "something went wrong" error, the agent falls back to alternative skills, reduces the scope of the task, or delivers partial results with clear caveats about what is missing. This keeps the user's workflow moving rather than halting it completely.

The key design principle is that degradation should be planned in advance, not improvised at runtime. Each skill should have predefined fallback paths, and the agent should understand which parts of a task can be completed without which capabilities. An agent that plans for failure delivers dramatically better user experience than one that only plans for success.

## How It Works

### Fallback Chains

A fallback chain defines an ordered list of alternative approaches for a given capability. When the primary skill fails, the agent tries the next option in the chain.

```python
from dataclasses import dataclass, field
from typing import Callable, Any, Optional


@dataclass
class FallbackChain:
    """An ordered sequence of skills that can fulfill a capability."""
    capability: str
    skills: list[str]
    _registry: dict[str, Callable] = field(repr=False, default_factory=dict)

    async def execute(self, params: dict, registry: dict[str, Callable]) -> dict:
        errors = []

        for skill_name in self.skills:
            try:
                skill_fn = registry[skill_name]
                result = await skill_fn(**params)
                return {
                    "status": "success" if skill_name == self.skills[0] else "degraded",
                    "skill_used": skill_name,
                    "result": result,
                    "fallbacks_attempted": len(errors),
                }
            except Exception as e:
                errors.append({"skill": skill_name, "error": str(e)})
                continue

        return {
            "status": "failed",
            "result": None,
            "errors": errors,
        }


# Define fallback chains for common capabilities
FALLBACK_CHAINS = {
    "web_search": FallbackChain(
        capability="web_search",
        skills=["google_search", "bing_search", "duckduckgo_search", "cached_search"],
    ),
    "code_execution": FallbackChain(
        capability="code_execution",
        skills=["sandbox_executor", "docker_executor", "static_analysis_only"],
    ),
    "data_retrieval": FallbackChain(
        capability="data_retrieval",
        skills=["live_api_query", "cached_data_lookup", "llm_knowledge_fallback"],
    ),
}
```

### Capability Degradation Matrix

A degradation matrix maps each task type to the minimum set of skills required and the degraded modes available when some skills are missing.

```python
DEGRADATION_MATRIX = {
    "research_report": {
        "full": {
            "required_skills": ["web_search", "document_reader", "text_generator"],
            "description": "Full report with live sources and citations",
        },
        "degraded_1": {
            "required_skills": ["document_reader", "text_generator"],
            "description": "Report from provided documents only (no web search)",
            "caveats": ["No live web sources", "May miss recent developments"],
        },
        "degraded_2": {
            "required_skills": ["text_generator"],
            "description": "Report from LLM knowledge only",
            "caveats": [
                "No external sources",
                "Knowledge may be outdated",
                "No citations available",
            ],
        },
    },
    "data_analysis": {
        "full": {
            "required_skills": ["code_executor", "data_loader", "chart_generator"],
            "description": "Full analysis with code execution and visualizations",
        },
        "degraded_1": {
            "required_skills": ["code_executor", "data_loader"],
            "description": "Analysis with tables but no charts",
            "caveats": ["Visualizations unavailable — results in text/table format"],
        },
        "degraded_2": {
            "required_skills": ["data_loader"],
            "description": "Raw data summary without computed analysis",
            "caveats": [
                "No computed statistics",
                "Manual review of raw data required",
            ],
        },
    },
}
```

```python
def determine_execution_mode(
    task_type: str, available_skills: set[str]
) -> tuple[str, dict]:
    """Determine the best execution mode given available skills."""
    matrix = DEGRADATION_MATRIX.get(task_type)
    if not matrix:
        return "unknown_task", {}

    for mode_name in ["full", "degraded_1", "degraded_2", "degraded_3"]:
        mode = matrix.get(mode_name)
        if mode is None:
            continue
        required = set(mode["required_skills"])
        if required.issubset(available_skills):
            return mode_name, mode

    return "impossible", {"description": "No viable execution mode available"}
```

### User Notification Patterns

When the agent operates in a degraded mode, it must clearly communicate what happened, what it can still do, and what the user should expect. Transparency builds trust.

```python
def format_degradation_notice(mode: str, mode_config: dict, task_type: str) -> str:
    """Generate a user-facing notice about degraded operation."""
    if mode == "full":
        return ""

    notice_parts = [
        f"**Notice**: Operating in degraded mode for this {task_type}.",
        f"Mode: {mode_config['description']}.",
    ]

    if "caveats" in mode_config:
        notice_parts.append("Limitations:")
        for caveat in mode_config["caveats"]:
            notice_parts.append(f"  - {caveat}")

    notice_parts.append(
        "You may want to retry later when all services are available "
        "for a complete result."
    )

    return "\n".join(notice_parts)
```

Example output:

```
**Notice**: Operating in degraded mode for this research_report.
Mode: Report from provided documents only (no web search).
Limitations:
  - No live web sources
  - May miss recent developments
You may want to retry later when all services are available for a complete result.
```

### Partial Results with Scope Reduction

Sometimes the best degradation strategy is to complete as much of the task as possible and clearly mark what is missing.

```python
@dataclass
class PartialResult:
    """A result that may be incomplete due to degradation."""
    completed_steps: list[str]
    skipped_steps: list[str]
    result: Any
    completeness: float  # 0.0 to 1.0
    caveats: list[str]

    def to_user_message(self) -> str:
        pct = int(self.completeness * 100)
        msg = f"Task completed at {pct}% capacity.\n\n"

        if self.skipped_steps:
            msg += "The following steps could not be completed:\n"
            for step in self.skipped_steps:
                msg += f"  - {step}\n"

        if self.caveats:
            msg += "\nPlease note:\n"
            for caveat in self.caveats:
                msg += f"  - {caveat}\n"

        return msg


async def execute_with_degradation(task: Task, agent: Agent) -> PartialResult:
    """Execute a task, collecting partial results if some steps fail."""
    completed = []
    skipped = []
    caveats = []
    accumulated_result = {}

    for step in task.steps:
        try:
            step_result = await agent.execute_step(step)
            accumulated_result[step.name] = step_result
            completed.append(step.name)
        except NonRecoverableError as e:
            skipped.append(step.name)
            caveats.append(f"{step.name}: {e.user_message}")

            if step.critical:
                # Cannot continue without this step
                caveats.append("Stopped early due to critical step failure.")
                break

    completeness = len(completed) / len(task.steps) if task.steps else 0.0

    return PartialResult(
        completed_steps=completed,
        skipped_steps=skipped,
        result=accumulated_result,
        completeness=completeness,
        caveats=caveats,
    )
```

## Why It Matters

### User Experience Under Failure

Without graceful degradation, a single tool failure halts the entire agent. In production, this means users see failures on 15–30% of complex tasks. With degradation, many of those failures become partial successes — the user gets 70–80% of what they asked for, immediately, with clear information about what is missing. User satisfaction surveys consistently show that partial results with transparency are preferred over complete failure followed by a retry.

### System Resilience

Graceful degradation makes agent systems resilient to partial outages. If one of five integrated APIs goes down, the agent continues serving requests rather than becoming completely unavailable. This is especially important for agents deployed in production environments where uptime expectations are high.

## Key Technical Details

- Fallback chains should contain 2–4 alternatives; more than 4 adds complexity with diminishing returns
- Degradation matrices should be defined at design time, not discovered at runtime
- User notifications should include: what happened, what the agent can still do, and what is missing
- Partial results with 60%+ completeness are generally more useful to users than a retry
- Fallback latency budget should be capped — typically 2x the normal skill timeout
- The LLM's own knowledge is always the last-resort fallback for information retrieval
- Circuit breakers should feed into the degradation matrix: when a skill is "open," exclude it from available skills

## Common Misconceptions

**"Degradation means lower quality"**: Degradation means reduced scope, not necessarily lower quality. An agent that writes a thorough analysis from three sources instead of five is not producing low-quality work — it is producing high-quality work on a narrower evidence base. The key is to maintain quality within the reduced scope and clearly communicate the limitations.

**"Users would rather wait for a full result"**: Research on user behavior shows the opposite for most tasks. Users prefer receiving an 80% result in 10 seconds over a 100% result in 2 minutes. The ability to review partial results, provide feedback, and iterate is more valuable than waiting for perfection — especially since the "full" result might still contain errors.

## Connections to Other Concepts

- `error-categories-in-agent-systems.md` — The error types that trigger degradation
- `retry-strategies-and-backoff.md` — Retries happen before degradation; degradation happens after retries are exhausted
- `self-correction-and-reflection.md` — Self-correction can help the agent choose the best degradation path
- `evaluation-with-test-suites.md` — Evaluating agent performance in degraded modes

## Further Reading

- Nygard, "Release It!" (2018) — Comprehensive patterns for building resilient systems including degradation strategies
- Humble and Farley, "Continuous Delivery" (2010) — Discusses feature toggles and capability flags that support graceful degradation
- Netflix Technology Blog, "Fault Tolerance in a High Volume, Distributed System" (2012) — Real-world degradation at massive scale
