# Self-Correction and Reflection

**One-Line Summary**: Techniques for building agents that detect their own mistakes and fix them, including output validation, reflection prompts, the Reflexion pattern, and post-tool-call verification — typically improving task success rates by 10–25%.

**Prerequisites**: `error-categories-in-agent-systems.md`, familiarity with LLM prompting techniques

## What Is Self-Correction and Reflection?

Think about how an experienced professional works. A surgeon does not just complete a procedure and walk away — they check vital signs, verify the outcome, and review what happened. A pilot runs through a checklist after each phase of flight. These are not signs of incompetence; they are disciplined practices that catch errors before they compound. Self-correction in agents works the same way: after each action, the agent pauses to verify the result before moving on.

In technical terms, self-correction refers to a set of techniques where an agent evaluates its own outputs and actions, detects errors or suboptimal results, and takes corrective action without external intervention. This can range from simple output validation (checking that a function returned valid JSON) to sophisticated reflection (asking the LLM to critique its own reasoning and revise its plan). The underlying principle is that catching an error one step after it occurs is far cheaper than discovering it five steps later, when the agent has built an entire chain of reasoning on a faulty foundation.

Research on self-correcting agents consistently shows success rate improvements of 10–25% on complex multi-step tasks. The improvement is largest on tasks where the agent must synthesize information from multiple tool calls, because these tasks have more opportunities for small errors to compound. The cost is modest — typically 15–30% more tokens per task — and the reduction in full task failures more than compensates.

## How It Works

### Output Validation After Tool Calls

The simplest form of self-correction is checking that a tool's output matches expectations before feeding it into the next step.

```python
from typing import Any
from dataclasses import dataclass
import json


@dataclass
class ValidationRule:
    """A rule for validating tool output."""
    name: str
    check: callable  # function(output) -> bool
    error_message: str


class OutputValidator:
    """Validates tool outputs against predefined rules."""

    def __init__(self):
        self._rules: dict[str, list[ValidationRule]] = {}

    def add_rule(self, tool_name: str, rule: ValidationRule):
        self._rules.setdefault(tool_name, []).append(rule)

    def validate(self, tool_name: str, output: Any) -> list[str]:
        """Returns a list of validation errors (empty if valid)."""
        errors = []
        for rule in self._rules.get(tool_name, []):
            try:
                if not rule.check(output):
                    errors.append(f"{rule.name}: {rule.error_message}")
            except Exception as e:
                errors.append(f"{rule.name}: validation itself failed — {e}")
        return errors


# Example: setting up validators for common tools
validator = OutputValidator()

validator.add_rule("web_search", ValidationRule(
    name="has_results",
    check=lambda out: isinstance(out, dict) and len(out.get("results", [])) > 0,
    error_message="Search returned no results — query may need reformulation",
))

validator.add_rule("code_executor", ValidationRule(
    name="no_errors",
    check=lambda out: out.get("exit_code") == 0,
    error_message="Code execution failed — check for syntax or runtime errors",
))

validator.add_rule("read_file", ValidationRule(
    name="non_empty",
    check=lambda out: out and len(str(out).strip()) > 0,
    error_message="File read returned empty content",
))
```

### Reflection Prompts

Reflection prompts ask the LLM to evaluate its own work before proceeding. This catches reasoning errors that structural validation cannot detect.

```python
REFLECTION_PROMPT = """You just completed the following step in a multi-step task.

Task: {task_description}
Step completed: {step_description}
Tool used: {tool_name}
Tool output (summary): {output_summary}

Before proceeding, evaluate this step:

1. Did the tool output contain the information you expected?
2. Is the output consistent with what you already know about the task?
3. Did you use the right tool for this step, or would a different tool have been better?
4. Are there any signs that the output might be incorrect or incomplete?

Respond with one of:
- PROCEED: Everything looks correct, continue to the next step.
- RETRY: The step should be retried with modified parameters. Explain what to change.
- REVISE_PLAN: The overall plan needs adjustment based on this result. Explain how.
"""


async def reflect_on_step(
    llm_client,
    task_description: str,
    step_description: str,
    tool_name: str,
    output_summary: str,
) -> dict:
    """Ask the LLM to reflect on a completed step."""
    prompt = REFLECTION_PROMPT.format(
        task_description=task_description,
        step_description=step_description,
        tool_name=tool_name,
        output_summary=output_summary[:2000],  # Truncate long outputs
    )

    response = await llm_client.generate(prompt, max_tokens=300)
    text = response.text.strip()

    if text.startswith("PROCEED"):
        return {"action": "proceed", "reasoning": text}
    elif text.startswith("RETRY"):
        return {"action": "retry", "reasoning": text}
    elif text.startswith("REVISE_PLAN"):
        return {"action": "revise_plan", "reasoning": text}
    else:
        # Default to proceeding if response is ambiguous
        return {"action": "proceed", "reasoning": text}
```

### The Reflexion Pattern

Reflexion, introduced by Shinn et al. (2023), is a more structured approach where the agent maintains an explicit memory of past failures and uses them to improve future attempts. After a task attempt fails, the agent generates a verbal reflection on what went wrong and stores it. On the next attempt, this reflection is included in the prompt.

```python
@dataclass
class ReflexionMemory:
    """Stores reflections from past attempts for a task."""
    task_id: str
    reflections: list[str]
    attempt_count: int = 0
    max_attempts: int = 3

    def add_reflection(self, reflection: str):
        self.reflections.append(reflection)
        self.attempt_count += 1

    def get_context(self) -> str:
        if not self.reflections:
            return ""
        header = f"You have attempted this task {self.attempt_count} time(s) before. "
        header += "Here are your reflections on previous attempts:\n\n"
        entries = []
        for i, ref in enumerate(self.reflections, 1):
            entries.append(f"Attempt {i} reflection: {ref}")
        return header + "\n".join(entries)

    @property
    def can_retry(self) -> bool:
        return self.attempt_count < self.max_attempts


async def run_with_reflexion(agent, task: Task) -> Any:
    """Execute a task with the Reflexion pattern."""
    memory = ReflexionMemory(task_id=task.id)

    while memory.can_retry:
        # Include past reflections in the agent's context
        context = memory.get_context()
        task_with_context = task.with_additional_context(context)

        result = await agent.execute(task_with_context)

        # Evaluate the result
        evaluation = await evaluate_result(result, task.success_criteria)

        if evaluation.passed:
            return result

        # Generate reflection on failure
        reflection = await agent.reflect(
            task=task,
            result=result,
            evaluation=evaluation,
            prompt="What went wrong in this attempt? What specific changes "
                   "should you make in the next attempt? Be concrete.",
        )

        memory.add_reflection(reflection)

    raise MaxAttemptsExceeded(f"Failed after {memory.max_attempts} attempts")
```

### Post-Tool-Call Verification Pipeline

Combining validation and reflection into a unified pipeline that runs after every tool call:

```python
class VerificationPipeline:
    """Runs after each tool call to catch errors early."""

    def __init__(self, validator: OutputValidator, llm_client, reflection_frequency: int = 3):
        self.validator = validator
        self.llm_client = llm_client
        self.reflection_frequency = reflection_frequency
        self._step_count = 0

    async def verify(
        self, tool_name: str, output: Any, task_context: dict
    ) -> dict:
        self._step_count += 1
        issues = []

        # Layer 1: Structural validation (every step, near-zero cost)
        validation_errors = self.validator.validate(tool_name, output)
        if validation_errors:
            issues.extend(validation_errors)

        # Layer 2: Type and format checks (every step, near-zero cost)
        format_issues = self._check_format(tool_name, output)
        if format_issues:
            issues.extend(format_issues)

        # Layer 3: LLM reflection (every Nth step, moderate cost)
        if self._step_count % self.reflection_frequency == 0:
            reflection = await reflect_on_step(
                self.llm_client,
                task_description=task_context.get("task", ""),
                step_description=task_context.get("current_step", ""),
                tool_name=tool_name,
                output_summary=str(output)[:1000],
            )
            if reflection["action"] != "proceed":
                issues.append(f"Reflection: {reflection['reasoning']}")

        return {
            "passed": len(issues) == 0,
            "issues": issues,
            "step_number": self._step_count,
        }

    def _check_format(self, tool_name: str, output: Any) -> list[str]:
        """Basic format checks independent of tool-specific rules."""
        issues = []
        if output is None:
            issues.append("Tool returned None")
        if isinstance(output, str) and output.strip() == "":
            issues.append("Tool returned empty string")
        if isinstance(output, dict) and "error" in output:
            issues.append(f"Tool output contains error field: {output['error']}")
        return issues
```

## Why It Matters

### Compound Error Prevention

In a 10-step task, if each step has a 10% error rate, the probability of completing the task without any error is only 35%. Self-correction at each step reduces the effective per-step error rate. Dropping it from 10% to 5% raises the task completion probability from 35% to 60%. This is why self-correction produces disproportionate improvements on longer tasks.

### Reduced Human Intervention

Agents without self-correction frequently require human review and correction. Each interruption breaks the user's workflow and reduces the agent's value. Self-correcting agents handle 10–25% more tasks autonomously, reducing the supervision burden and making the agent practical for real work.

## Key Technical Details

- Self-correction improves task success rates by 10–25% on multi-step tasks (Shinn et al., 2023)
- Token overhead for reflection is typically 15–30% per task
- Structural validation (type checks, format checks) is nearly free and should run on every step
- LLM reflection is expensive and is best applied every 2–3 steps or after high-risk tool calls
- The Reflexion pattern is most effective with a maximum of 3 attempts — beyond that, diminishing returns set in
- Combining validation + reflection catches more errors than either alone (roughly 60% of detectable errors vs 35–40% for either individually)
- Self-correction is least effective on tasks where the agent lacks the knowledge to evaluate its own output

## Common Misconceptions

**"Self-correction can fix any mistake"**: Self-correction works well for catching factual errors, wrong tool selections, and format issues. It is much less effective at catching subtle reasoning errors where the agent lacks the domain expertise to evaluate its own output. An agent that does not understand chemistry cannot reliably verify its chemistry answers, no matter how many reflection steps you add. Self-correction amplifies existing capability; it does not substitute for it.

**"Reflection makes the agent slower and more expensive without benefit"**: The 15–30% token overhead is real, but it must be weighed against the cost of task failure. A failed task wastes 100% of the tokens spent on it and requires human intervention. If self-correction prevents even one in five failures, it pays for itself in reduced rework and improved user experience.

## Connections to Other Concepts

- `error-categories-in-agent-systems.md` — Self-correction primarily addresses LLM reasoning errors
- `retry-strategies-and-backoff.md` — Retries handle transient tool failures; self-correction handles reasoning failures
- `graceful-degradation.md` — When self-correction fails, graceful degradation is the next fallback
- `evaluation-with-test-suites.md` — Measuring the impact of self-correction on task success rates
- `regression-testing-for-agents.md` — Ensuring self-correction logic does not regress

## Further Reading

- Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning" (2023) — The original Reflexion paper with detailed experimental results
- Madaan et al., "Self-Refine: Iterative Refinement with Self-Feedback" (2023) — A complementary approach focused on iterative output improvement
- Kim et al., "Language Agent Tree Search Unifies Reasoning Acting and Planning in Language Models" (2023) — Extends self-correction into a search process over possible action sequences
