# Error Categories in Agent Systems

**One-Line Summary**: A taxonomy of the four major error categories in AI agent systems — tool execution failures, LLM reasoning errors, state corruption, and environmental errors — along with their frequency, severity, and appropriate handling strategies.

**Prerequisites**: Basic understanding of AI agent architecture, familiarity with tool-use patterns

## What Are Error Categories in Agent Systems?

Think of an AI agent like a new employee at a company. Some mistakes happen because the tools they use break (the printer jams), some because they misunderstand instructions (they file a report in the wrong folder), some because their notes get scrambled (they lose track of where they left off), and some because the environment changes unexpectedly (the office moved and nobody told them). Each type of mistake requires a fundamentally different response — you would not fix a jammed printer the same way you correct a misunderstanding.

In agent systems, errors fall into four broad categories: tool execution failures, LLM reasoning errors, state corruption, and environmental errors. Each category has distinct causes, frequencies, severity levels, and mitigation strategies. Understanding this taxonomy is critical because applying the wrong recovery strategy to an error can make things worse — retrying an LLM reasoning error without changing the prompt will produce the same wrong answer, and retrying a non-idempotent operation that actually succeeded but timed out can cause duplicate side effects.

Production agent systems typically encounter errors on 15–30% of complex multi-step tasks. The distribution skews heavily toward tool execution failures (roughly 40–50% of all errors), followed by LLM reasoning errors (25–35%), environmental errors (15–20%), and state corruption (5–10%). Knowing these distributions helps you prioritize which error-handling infrastructure to build first.

## How It Works

### Tool Execution Failures

Tool execution failures occur when an external service or API that the agent depends on does not behave as expected. These are the most common errors in production agent systems.

| Failure Type | Frequency | Severity | Typical Response |
|---|---|---|---|
| API timeout | High | Medium | Retry with backoff |
| HTTP 404 / resource not found | Medium | Medium | Abort or fallback |
| Rate limiting (429) | High | Low | Wait and retry |
| Authentication failure (401/403) | Low | Critical | Abort, alert operator |
| Malformed response | Medium | Medium | Retry once, then fallback |
| Service outage (500/503) | Low | High | Fallback to alternative |

```python
class ToolExecutionError(AgentError):
    """Raised when a tool call fails at the execution level."""

    def __init__(self, tool_name: str, status_code: int, message: str, retryable: bool):
        self.tool_name = tool_name
        self.status_code = status_code
        self.message = message
        self.retryable = retryable
        self.severity = self._classify_severity(status_code)

    def _classify_severity(self, code: int) -> str:
        if code in (401, 403):
            return "critical"
        if code in (500, 502, 503):
            return "high"
        if code in (404, 422):
            return "medium"
        if code == 429:
            return "low"
        return "medium"
```

### LLM Reasoning Errors

These errors originate from the language model itself — they happen when the model picks the wrong tool, fabricates parameters, misinterprets results, or enters loops. They are harder to detect because the system does not crash; it simply does the wrong thing.

Common LLM reasoning errors include:

- **Wrong tool selection**: The agent picks `search_web` when it should use `query_database`. Occurs in roughly 8–12% of multi-tool tasks.
- **Hallucinated parameters**: The agent invents a function argument that does not exist, such as passing `format="xlsx"` to a tool that only supports CSV. Occurs in 5–10% of tool calls.
- **Misinterpreted results**: The agent reads a tool output correctly but draws the wrong conclusion from it.
- **Infinite loops**: The agent repeats the same failing action without changing strategy. Detected by tracking action history.

```python
def detect_reasoning_error(agent_state: AgentState) -> Optional[str]:
    """Detect common LLM reasoning errors from agent behavior."""
    recent_actions = agent_state.action_history[-5:]

    # Detect loops: same action repeated 3+ times
    if len(recent_actions) >= 3:
        last_three = [a.tool_name + str(a.params) for a in recent_actions[-3:]]
        if len(set(last_three)) == 1:
            return "loop_detected"

    # Detect hallucinated parameters
    last_action = recent_actions[-1]
    valid_params = get_tool_schema(last_action.tool_name).get("parameters", {})
    for param in last_action.params:
        if param not in valid_params:
            return "hallucinated_parameter"

    # Detect wrong tool via output validation
    if last_action.result and last_action.expected_type:
        if not isinstance(last_action.result, last_action.expected_type):
            return "wrong_tool_likely"

    return None
```

### State Corruption

State corruption occurs when the agent's internal representation of the task becomes inconsistent with reality. This is the rarest category but often the most damaging because the agent continues operating on false assumptions.

Causes include:

- **Lost context**: Conversation history exceeds the context window and critical information is truncated. This begins to happen around 80–100 tool calls in most systems.
- **Stale data**: The agent caches a result that changes between steps (e.g., a file it read was modified by another process).
- **Partial writes**: A multi-step write operation completes only partially, leaving data in an inconsistent state.
- **Counter drift**: Step counters, token budgets, or progress trackers become out of sync with actual progress.

Detection strategies typically involve checksums on critical state, periodic state validation, and comparing expected state against actual state after each step.

### Environmental Errors

Environmental errors come from the operating context — the file system, network, permissions, or resource availability. They differ from tool execution failures in that the tool code itself works correctly but the environment prevents success.

```python
ENVIRONMENTAL_ERRORS = {
    "FileNotFoundError": {"retryable": False, "severity": "medium"},
    "PermissionError": {"retryable": False, "severity": "high"},
    "DiskQuotaExceeded": {"retryable": False, "severity": "critical"},
    "ConnectionRefusedError": {"retryable": True, "severity": "medium"},
    "DNSResolutionError": {"retryable": True, "severity": "medium"},
    "MemoryError": {"retryable": False, "severity": "critical"},
}
```

Environmental errors account for 15–20% of all agent errors in production. Unlike tool failures, they often require human intervention (granting permissions, freeing disk space) rather than automated recovery.

## Why It Matters

### Targeted Recovery Strategies

Without a clear error taxonomy, teams build one-size-fits-all error handlers — typically a simple retry loop. This leads to wasted retries on non-retryable errors, missed opportunities for graceful degradation, and debugging sessions that conflate fundamentally different failure modes. A structured taxonomy lets you route each error to its optimal recovery path.

### Observability and Debugging

Categorizing errors makes dashboards and alerting meaningful. A spike in tool execution failures points to an upstream API issue. A spike in reasoning errors after a prompt change points to a regression. A spike in environmental errors points to infrastructure problems. Without categories, all you see is "errors went up" — with them, you know where to look.

## Key Technical Details

- Tool execution failures make up 40–50% of all errors in production multi-skill agents
- LLM reasoning errors occur in 15–25% of complex multi-step tasks
- State corruption is rare (5–10% of errors) but has the highest mean time to resolution
- Environmental errors account for 15–20% and often require human intervention
- Loop detection (same action 3+ times) catches roughly 70% of reasoning-error loops
- Parameter validation against tool schemas catches 90%+ of hallucinated parameters
- Context window overflow typically begins around 80–100 tool calls in a session

## Common Misconceptions

**"All errors should be retried"**: Retrying is only appropriate for transient failures — network timeouts, rate limits, and temporary service outages. Retrying an authentication failure will never succeed. Retrying an LLM reasoning error without modifying the prompt or context will produce the same wrong answer. A well-designed system classifies errors first and only retries those marked as retryable.

**"LLM errors are random and unpredictable"**: While LLM outputs are non-deterministic, reasoning errors follow patterns. Certain tool combinations reliably confuse certain models. Ambiguous tool descriptions consistently lead to wrong-tool selection. These patterns are discoverable through evaluation and can be mitigated through better tool descriptions, few-shot examples, and guardrails.

## Connections to Other Concepts

- `retry-strategies-and-backoff.md` — Detailed strategies for handling retryable tool execution failures
- `graceful-degradation.md` — What to do when errors are non-recoverable
- `self-correction-and-reflection.md` — Techniques for detecting and fixing LLM reasoning errors
- `unit-testing-individual-skills.md` — Testing error handling in individual skills
- `integration-testing-skill-chains.md` — Testing error propagation across skill chains

## Further Reading

- Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning" (2023) — Foundational work on agents that learn from their own errors
- Madaan et al., "Self-Refine: Iterative Refinement with Self-Feedback" (2023) — Framework for self-correcting LLM outputs
- Nygard, "Release It!" (2018) — Comprehensive guide to stability patterns including error categorization in distributed systems
