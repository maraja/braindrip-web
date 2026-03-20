# Adaptive Replanning

**One-Line Summary**: Adaptive replanning enables agents to revise their execution plan on the fly when reality diverges from expectations, balancing persistence with flexibility.

**Prerequisites**: `plan-then-execute-pattern.md`, `breaking-complex-tasks-into-steps.md`

## What Is Adaptive Replanning?

Military strategists say no plan survives first contact with the enemy. The same applies to AI agents. An agent plans to scrape a pricing page, but the page requires authentication. It expects JSON from an API, but gets XML. It plans to use a calculator tool, but the extracted numbers are in a format it cannot parse. The plan was reasonable when created, but reality has introduced information the planner did not have.

Adaptive replanning is the agent's ability to detect when its current plan is no longer viable and to construct a revised plan that accounts for new information. This is distinct from simple error handling (retrying a failed API call) -- replanning means changing the strategy itself. The agent might switch from web scraping to API access, substitute one data source for another, or skip an entire branch of the task tree that has become irrelevant.

The challenge is knowing when to replan. Too eager and the agent wastes time generating new plans after every minor hiccup. Too stubborn and it grinds through a doomed plan, wasting tool calls and tokens. Good replanning strategies define clear triggers and escalation paths.

## How It Works

### Three Replanning Strategies

Agents use three main approaches to replanning, each suited to different situations:

**Reactive Replanning** re-evaluates the plan after every step. The agent checks whether the output of the current step matches expectations and adjusts the remaining plan accordingly. This is thorough but expensive.

**Triggered Replanning** monitors a deviation metric and only replans when it crosses a threshold. For example, if the plan assumed 5 competitors but the search found 12, the deviation is large enough to warrant replanning. Small deviations (a URL slightly different from expected) do not trigger replanning.

**Full Replanning** discards the current plan entirely and generates a new one from scratch, incorporating all results gathered so far. This is the nuclear option -- expensive but necessary when the original plan's assumptions are fundamentally wrong.

### Decision Flow: Replan vs Retry vs Abort

When a step fails or produces unexpected output, the agent follows a decision tree:

```
Step produced unexpected result
│
├── Is the result usable despite being unexpected?
│   └── YES → Continue with adjusted expectations (no replan)
│
├── Is this a transient error (timeout, rate limit)?
│   └── YES → Retry (max 2 attempts)
│       └── Retry failed → Escalate to replan
│
├── Is there an alternative tool/approach for this step?
│   └── YES → Triggered replan (substitute this step only)
│
├── Does this failure invalidate downstream steps?
│   └── YES → Full replan from current state
│
└── Is the overall goal still achievable?
    ├── YES → Full replan with remaining budget
    └── NO → Abort with partial results and explanation
```

### Implementation with State Tracking

The key to adaptive replanning is maintaining rich state that the replanner can use to make informed decisions:

```python
from dataclasses import dataclass, field
from enum import Enum

class StepStatus(Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    SKIPPED = "skipped"

@dataclass
class ExecutionState:
    original_goal: str
    current_plan: list[dict]
    step_results: dict[str, any] = field(default_factory=dict)
    step_statuses: dict[str, StepStatus] = field(default_factory=dict)
    replan_count: int = 0
    max_replans: int = 3
    total_tokens_used: int = 0
    token_budget: int = 50_000

    def completed_steps_summary(self) -> str:
        """Summarize what has been accomplished so far."""
        lines = []
        for step_id, result in self.step_results.items():
            status = self.step_statuses.get(step_id, StepStatus.PENDING)
            lines.append(f"Step {step_id} [{status.value}]: {str(result)[:200]}")
        return "\n".join(lines)

    def can_replan(self) -> bool:
        return (
            self.replan_count < self.max_replans
            and self.total_tokens_used < self.token_budget * 0.8
        )
```

### The Replanning Prompt

When replanning is triggered, the agent sends the original goal, the completed steps with their results, the failed step with its error, and asks for a revised plan:

```python
REPLAN_PROMPT = """You are a replanning agent. The original plan has encountered
an issue and needs revision.

Original goal: {goal}

Completed steps and results:
{completed_summary}

Failed step: {failed_step}
Error: {error}

Remaining original steps (now potentially invalid):
{remaining_steps}

Generate a revised plan that:
1. Builds on the results already obtained (do NOT repeat completed steps)
2. Works around the failure using alternative approaches
3. Still achieves the original goal or the closest achievable approximation
4. Stays within the remaining budget of {remaining_budget} tokens

If the goal is no longer achievable, set "achievable": false and explain why.

Output as JSON:
{{
  "achievable": true,
  "revised_plan": [...],
  "explanation": "Why the plan was revised"
}}
"""
```

### Integrating Replanning into the Execution Loop

```python
async def execute_with_replanning(state: ExecutionState) -> dict:
    """Main execution loop with adaptive replanning."""
    step_index = 0

    while step_index < len(state.current_plan):
        step = state.current_plan[step_index]
        step_id = f"step_{step['step']}"

        try:
            result = await execute_step(step, state.step_results)
            state.step_results[step_id] = result
            state.step_statuses[step_id] = StepStatus.SUCCESS

            # Reactive check: does this result change the plan?
            if needs_reactive_replan(step, result, state):
                revised = await generate_revised_plan(state, step, result)
                state.current_plan = (
                    state.current_plan[:step_index + 1] + revised
                )
                state.replan_count += 1

            step_index += 1

        except ToolError as e:
            # Retry once
            try:
                result = await execute_step(step, state.step_results)
                state.step_results[step_id] = result
                state.step_statuses[step_id] = StepStatus.SUCCESS
                step_index += 1
            except ToolError as retry_error:
                state.step_statuses[step_id] = StepStatus.FAILED
                state.step_results[step_id] = str(retry_error)

                if not state.can_replan():
                    return {"status": "aborted", "results": state.step_results}

                revised = await generate_revised_plan(
                    state, step, retry_error
                )
                if not revised.get("achievable", True):
                    return {
                        "status": "infeasible",
                        "reason": revised["explanation"],
                        "partial_results": state.step_results,
                    }

                state.current_plan = (
                    state.current_plan[:step_index] + revised["revised_plan"]
                )
                state.replan_count += 1
                # Don't increment step_index; retry at current position

    return {"status": "complete", "results": state.step_results}
```

### Deviation Detection for Triggered Replanning

```python
def needs_reactive_replan(step: dict, result: any, state: ExecutionState) -> bool:
    """Determine if a successful but unexpected result warrants replanning."""
    expected = step.get("expected_output", "")
    if not expected:
        return False

    # Ask LLM to assess deviation
    assessment = llm.invoke([
        SystemMessage(content="Compare the expected and actual output. "
                      "Rate deviation as LOW, MEDIUM, or HIGH."),
        HumanMessage(content=f"Expected: {expected}\nActual: {str(result)[:500]}")
    ])

    return "HIGH" in assessment.content
```

## Why It Matters

### Robustness in Unpredictable Environments

Real-world tool outputs are messy. APIs change, websites go down, data formats vary. An agent without replanning fails catastrophically at the first unexpected result. An agent with replanning degrades gracefully, finding alternative paths to the goal or delivering partial results with clear explanations.

### Efficient Resource Usage

Blind persistence wastes tokens and API calls on a doomed plan. Premature abandonment wastes the work already completed. Adaptive replanning finds the middle ground: invest in recovery when the goal is reachable, and cut losses when it is not.

## Key Technical Details

- Replanning costs 1000-3000 tokens per invocation; cap at 3 replans per task to control costs
- Track cumulative token usage and reserve 20% of the budget for replanning overhead
- The replanner must receive completed step results to avoid repeating work -- this context is non-negotiable
- Deviation detection via LLM adds ~500ms per step; use heuristic checks first (type mismatch, empty result) before invoking the LLM
- Log every replan trigger, reason, and revised plan for post-hoc analysis and prompt tuning
- Full replanning from scratch should only occur if more than 50% of remaining steps are invalidated

## Common Misconceptions

**"Replanning means the original plan was bad"**: Not necessarily. Plans are made with incomplete information. A well-constructed plan that needs revision after discovering new facts is working as designed. The quality of a planning system is measured by how well it handles revisions, not by whether revisions are needed.

**"The agent should always try to achieve the original goal exactly"**: Sometimes the right move is to adjust the goal. If the user asked for pricing data from five competitors but two have no public pricing, the agent should deliver results for three with a clear explanation, not hallucinate data for the missing two.

## Connections to Other Concepts

- `plan-then-execute-pattern.md` -- The base pattern that replanning extends
- `breaking-complex-tasks-into-steps.md` -- Replanning often involves re-decomposing remaining work
- `dependency-graphs-for-skill-execution.md` -- Replanning must account for dependency changes when steps are added or removed
- `human-in-the-loop-checkpoints.md` -- Major replanning decisions can be escalated to the user

## Further Reading

- Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning" (2023) -- Self-reflective replanning where the agent critiques its own failures
- Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (2023) -- The interleaved approach that adaptive replanning improves upon
- Brooks, "A Robust Layered Control System for a Mobile Robot" (1986) -- Classic robotics paper on reactive planning that inspired many agent architectures
