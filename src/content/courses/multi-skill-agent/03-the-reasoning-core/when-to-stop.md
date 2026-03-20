# When to Stop

**One-Line Summary**: An agent without well-defined termination conditions will loop forever, burning money and producing garbage — knowing when to stop is as important as knowing what to do.

**Prerequisites**: `chain-of-thought-for-multi-step-tasks.md`, `system-prompt-as-agent-dna.md`

## What Is the Stopping Problem?

Picture a dog chasing its tail. It is executing a valid action (chasing) toward a valid target (the tail), but it will never succeed and it will never stop on its own. An agent without termination logic is this dog. It has tools, it has a goal, and it will keep invoking tools in an infinite loop, racking up API costs with every iteration.

The stopping problem for agents is: how does the system know the task is done? Unlike a traditional program where the last line of code ends execution, an agent operates in a loop where the LLM decides what to do next. The LLM must either decide to stop on its own (by returning a final response instead of a tool call), or the orchestrator must enforce external stopping conditions. In practice, you need both.

This is not a theoretical concern. Production agents that lack proper termination logic are one of the most common sources of runaway API costs. A single stuck agent running GPT-4 at 10 steps per minute can burn through $50-100 in an hour before anyone notices. Every agent system needs a termination strategy.

## How It Works

### The Five Termination Conditions

Every production agent should implement at least these five stopping conditions.

```python
class AgentTermination:
    """Check whether the agent should stop after each step."""

    def __init__(self, config):
        self.max_steps = config.get("max_steps", 15)
        self.max_cost_usd = config.get("max_cost_usd", 1.00)
        self.max_consecutive_errors = config.get("max_errors", 3)
        self.step_count = 0
        self.total_cost = 0.0
        self.consecutive_errors = 0

    def should_stop(self, step_result) -> tuple[bool, str]:
        self.step_count += 1
        self.total_cost += step_result.cost

        # Condition 1: Goal achieved — the model returned a final response
        if step_result.is_final_response:
            return True, "goal_achieved"

        # Condition 2: Max steps reached
        if self.step_count >= self.max_steps:
            return True, "max_steps_exceeded"

        # Condition 3: Cost budget exhausted
        if self.total_cost >= self.max_cost_usd:
            return True, "budget_exceeded"

        # Condition 4: Too many consecutive errors
        if step_result.is_error:
            self.consecutive_errors += 1
        else:
            self.consecutive_errors = 0

        if self.consecutive_errors >= self.max_consecutive_errors:
            return True, "error_threshold_exceeded"

        # Condition 5: Confidence too low (model expresses uncertainty)
        if step_result.confidence and step_result.confidence < 0.3:
            return True, "low_confidence"

        return False, "continue"
```

### Condition 1: Goal Achieved

The most common and desirable way to stop. The model determines the task is complete and returns a text response instead of a tool call.

```python
# In the system prompt, instruct the model to signal completion:
COMPLETION_INSTRUCTION = """
When you have fully completed the user's request:
1. Summarize what you accomplished
2. List any important results or outputs
3. Do NOT call any more tools — respond with text only

If you can only partially complete the request, explain what you
accomplished and what remains unfinished.
"""
```

The challenge is that models sometimes declare victory prematurely. You can add verification steps to the system prompt:

```
Before declaring the task complete, verify:
- Did you actually produce the output the user asked for?
- Did you confirm the action succeeded (not just that you called the tool)?
- Are there any remaining sub-tasks you haven't addressed?
```

### Condition 2: Max Steps Reached

A hard ceiling on the number of iterations. This is your safety net against infinite loops.

```python
# In LangGraph, this is built into the graph execution
from langgraph.graph import StateGraph

graph = StateGraph(AgentState)
# ... define nodes and edges ...
app = graph.compile()

# The recursion_limit controls max steps
result = app.invoke(
    {"messages": [user_message]},
    config={"recursion_limit": 25}
)
```

Choosing the right max step limit requires understanding your tasks:

| Task Complexity | Typical Steps | Recommended Max |
|----------------|---------------|-----------------|
| Simple lookup  | 1-2           | 5               |
| CRUD operation | 2-4           | 10              |
| Multi-step workflow | 4-8      | 15              |
| Complex analysis | 8-15        | 25              |
| Open-ended research | 15+      | 30-50           |

Setting the limit too low causes premature termination on legitimate tasks. Setting it too high wastes money on stuck agents. Most production systems use 15-25 as a default.

### Condition 3: Error Threshold Exceeded

If the agent hits the same wall three times, it is not going to break through on the fourth attempt.

```python
def handle_error_termination(agent_state, error_history):
    """Graceful shutdown when errors exceed threshold."""
    summary = (
        f"I encountered {len(error_history)} consecutive errors and "
        f"have stopped to avoid further issues.\n\n"
        f"Last error: {error_history[-1].message}\n\n"
        f"What I completed before the errors:\n"
    )
    for step in agent_state.completed_steps:
        summary += f"- {step.description}\n"
    summary += "\nPlease review and let me know how to proceed."
    return summary
```

Distinguish between *consecutive* errors (the same thing keeps failing) and *total* errors (occasional failures in a long task). Consecutive errors almost always mean the agent is stuck. Total errors in a 20-step task might just mean a few transient failures.

### Condition 4: User Intervention Needed

Sometimes the agent realizes it cannot proceed without information or permission it does not have.

```python
# Encode this in the system prompt
USER_INTERVENTION_PROMPT = """
You MUST stop and ask the user in these situations:
- You need credentials or access you don't have
- The action is destructive (deleting data, overwriting files)
- You are unsure which of two approaches the user prefers
- The task scope has expanded beyond the original request
- You encounter personally identifiable information (PII)

When asking the user, be specific:
BAD:  "I need more information."
GOOD: "I found two matching orders (#1234 and #1235). Which one
       should I process the return for?"
"""
```

### Condition 5: Confidence Too Low

Some frameworks allow the model to express confidence. When confidence drops below a threshold, the agent should stop and explain its uncertainty rather than guessing.

```python
# Using structured output to extract confidence
from pydantic import BaseModel

class AgentStep(BaseModel):
    reasoning: str
    action: str
    confidence: float  # 0.0 to 1.0
    confidence_explanation: str

# In the system prompt:
CONFIDENCE_PROMPT = """
Rate your confidence in each action from 0.0 to 1.0:
- 0.9-1.0: Certain this is correct
- 0.7-0.8: Fairly confident, minor uncertainty
- 0.4-0.6: Uncertain, proceeding with best guess
- 0.0-0.3: Very uncertain, should ask user

If your confidence is below 0.4, STOP and explain your uncertainty
instead of acting.
"""
```

### Graceful Termination

When any non-goal termination fires, the agent should not just die silently. It should report what happened.

```python
def graceful_terminate(reason, agent_state):
    """Produce a useful termination message."""
    messages = {
        "max_steps_exceeded": (
            f"I reached the maximum of {agent_state.max_steps} steps. "
            f"Here's what I accomplished:\n{agent_state.summary()}\n"
            f"Remaining work: {agent_state.remaining_plan()}"
        ),
        "budget_exceeded": (
            f"I've used ${agent_state.total_cost:.2f} of the "
            f"${agent_state.max_cost:.2f} budget. "
            f"Progress: {agent_state.summary()}"
        ),
        "error_threshold_exceeded": (
            f"I encountered {agent_state.consecutive_errors} consecutive "
            f"errors. Last error: {agent_state.last_error}\n"
            f"Completed work: {agent_state.summary()}"
        ),
    }
    return messages.get(reason, f"Stopped: {reason}")
```

## Why It Matters

### Runaway Agents Are Expensive

A concrete cost example: an agent using GPT-4 that makes 10 tool calls per minute, with an average of 2,000 tokens per call (input + output), costs approximately:
- 2,000 tokens x 10 calls/min = 20,000 tokens/min
- At ~$40/1M tokens (blended rate): $0.80/min = $48/hour
- A stuck agent running overnight (8 hours) costs ~$384

With Claude or GPT-4 Turbo, rates differ, but the principle holds: unbounded loops are unbounded costs. A $1.00 cost cap per task is a reasonable default for most applications.

### Silent Failures Are Worse Than Loud Ones

An agent that loops forever is bad. An agent that loops forever *and silently charges your API key* is worse. An agent that stops, explains what went wrong, and suggests next steps is useful even when it fails.

## Key Technical Details

- Most production agents use 15-25 as the default max step limit
- Cost-per-task budgets of $0.50-$2.00 are typical for GPT-4-class models
- Consecutive error thresholds of 3 are standard; total error thresholds of 5-8 are used for longer tasks
- LangGraph's `recursion_limit` is the most common way to enforce max steps in graph-based agents
- The model's decision to return text vs. a tool call is the primary goal-detection mechanism
- Adding verification instructions ("Before declaring done, check...") reduces premature termination by ~20%
- Monitoring dashboards should track steps-per-task distributions to calibrate max step limits

## Common Misconceptions

**"The model will naturally stop when the task is done"**: Models are generally good at recognizing completion for simple tasks, but on complex multi-step tasks they sometimes loop — repeating the same tool call, trying slight variations of a failed approach, or pursuing tangential sub-goals. External termination conditions are essential backup.

**"Setting a low max step limit prevents wasted spending"**: A limit that is too low causes the agent to terminate before completing legitimate tasks, which frustrates users and may trigger them to retry — costing more in total. The limit should be calibrated to the expected task complexity, not arbitrarily minimized.

**"If the agent hits an error, it should just retry"**: Retrying is appropriate for transient errors (timeouts, rate limits). But if the error is due to invalid logic (wrong SQL syntax, missing permissions), retrying the same action will fail every time. The agent should analyze the error, modify its approach, and only then retry. Three consecutive identical errors mean the approach is wrong, not the execution.

## Connections to Other Concepts

- `chain-of-thought-for-multi-step-tasks.md` — CoT helps the agent recognize when it has achieved the goal
- `system-prompt-as-agent-dna.md` — Termination rules are encoded in the system prompt
- `context-window-pressure.md` — Agents that run too many steps may exhaust the context window before hitting other limits
- `skill-selection-reasoning.md` — Selecting the wrong tool repeatedly is a common cause of error-threshold termination
- `structured-state-management.md` — State tracking enables the agent to report progress when terminated early
- `conversation-as-working-memory.md` — Long conversations from many steps degrade reasoning quality, creating another reason to stop

## Further Reading

- Significant Gravitas, "Auto-GPT: Lessons Learned from Runaway Agents" (2023) — Practical lessons on why termination conditions matter
- Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (2023) — Covers the act-observe loop and its termination
- LangGraph Documentation, "Recursion Limit and Breakpoints" (2024) — How to implement step limits and human-in-the-loop interruptions
- Chase, "LangSmith: Monitoring Agent Costs" (2024) — Tools for tracking per-task costs and detecting runaway agents
