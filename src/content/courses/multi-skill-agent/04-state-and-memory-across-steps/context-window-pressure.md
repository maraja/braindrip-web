# Context Window Pressure

**One-Line Summary**: Every agent step consumes context window space, and when the window fills up, the agent must either summarize, prune, or fail — making token budgeting a core engineering concern for long-running agents.

**Prerequisites**: `conversation-as-working-memory.md`, understanding of LLM token limits

## What Is Context Window Pressure?

Think of the context window as a whiteboard with a fixed surface area. Every tool call, every result, every piece of reasoning takes up space on the board. Early on, there is plenty of room. But after 10 or 15 steps, the board is almost full. Now you face a choice: erase some old notes to make room for new ones, write smaller, or stop working entirely. There is no option to get a bigger board mid-task.

Context window pressure is the progressive consumption of available context space as an agent operates. Every LLM has a maximum context length — 128K tokens for GPT-4 Turbo, 200K for Claude 3.5, 1M+ for Gemini 1.5. These sound generous, but an agent that makes 20 tool calls with verbose results can exhaust even large windows. The system prompt, the conversation history, the tool definitions, and the accumulated tool results all compete for the same finite space.

The consequence of running out of context space is not just a technical error — it is a reasoning failure. As the window fills, the model pays less attention to information in the middle (the "lost in the middle" phenomenon), and eventually the API will reject the request entirely. Managing context window pressure is therefore not optional — it is a reliability requirement.

## How It Works

### Token Budgeting: The Math

Let us work through a concrete example. Consider an agent with a 128K token context window:

```
Fixed costs (present in every call):
  System prompt:           2,000 tokens
  Tool definitions (8 tools): 1,500 tokens
  User's original message:   200 tokens
  ─────────────────────────────────────
  Fixed total:             3,700 tokens

Per-step costs (accumulate):
  Agent reasoning/CoT:       150 tokens
  Tool call (function + args): 100 tokens
  Tool result:               500 tokens
  ─────────────────────────────────────
  Per-step total:            750 tokens

Output reserved:
  Model's next response:   1,000 tokens (must be reserved)
  ─────────────────────────────────────
  Available for steps: 128,000 - 3,700 - 1,000 = 123,300 tokens
  Maximum steps: 123,300 / 750 ≈ 164 steps
```

That looks comfortable — 164 steps. But this assumes a *modest* 500 tokens per tool result. In practice, tool results vary enormously:

| Tool Result Type | Typical Tokens | Impact on Budget |
|-----------------|---------------|-----------------|
| Simple API response | 50-200 | Minimal |
| Database query (10 rows) | 200-500 | Moderate |
| Web page content | 2,000-8,000 | Heavy |
| File contents | 1,000-50,000 | Potentially catastrophic |
| Error with stack trace | 500-2,000 | Moderate |
| Search results (10 items) | 1,000-3,000 | Heavy |

If even one tool call returns a full web page (5,000 tokens), the budget for that step is 10x what we planned. Five such results and you have consumed 25,000 tokens — 20% of your window in just 5 steps.

### The Real Formula

```python
def estimate_context_usage(
    system_prompt_tokens: int,
    tool_definitions_tokens: int,
    steps: list[dict],
    output_reserve: int = 1000
) -> dict:
    """Calculate context window usage for an agent run."""
    fixed = system_prompt_tokens + tool_definitions_tokens
    accumulated = sum(
        step["reasoning_tokens"] +
        step["tool_call_tokens"] +
        step["tool_result_tokens"]
        for step in steps
    )
    total = fixed + accumulated + output_reserve

    return {
        "fixed_tokens": fixed,
        "accumulated_tokens": accumulated,
        "total_tokens": total,
        "utilization_pct": (total / 128_000) * 100,
        "remaining_tokens": 128_000 - total,
        "estimated_steps_remaining": max(
            0, (128_000 - total - output_reserve) // 750
        ),
    }
```

### Summarization Strategies

When the context window is filling up, summarization compresses earlier conversation turns into a shorter representation.

```python
def summarize_conversation(messages, keep_recent=4):
    """Compress old messages into a summary, keep recent ones intact."""
    if len(messages) <= keep_recent + 2:  # +2 for system + user
        return messages  # Nothing to summarize

    system_msg = messages[0]
    user_msg = messages[1]
    old_messages = messages[2:-keep_recent]
    recent_messages = messages[-keep_recent:]

    # Use a fast, cheap model for summarization
    summary = llm_fast.chat(messages=[{
        "role": "user",
        "content": (
            "Summarize the following agent conversation steps into a "
            "concise paragraph. Preserve all key data points, decisions "
            "made, and results obtained. Omit verbose tool outputs.\n\n"
            + format_messages(old_messages)
        )
    }])

    # Reconstruct the conversation with the summary
    summary_message = {
        "role": "system",
        "content": (
            f"[CONVERSATION SUMMARY - Steps 1 through "
            f"{len(old_messages)//2}]\n{summary.content}"
        )
    }

    return [system_msg, user_msg, summary_message] + recent_messages
```

This approach typically reduces the token count of old messages by 70-90% while preserving the essential information.

### Selective Message Pruning

Instead of summarizing, you can selectively remove messages that are no longer relevant.

```python
def prune_messages(messages, token_budget):
    """Remove the least-important messages to fit within budget."""
    # Never prune: system prompt, user's request, last 4 messages
    protected_indices = {0, 1} | set(range(len(messages)-4, len(messages)))

    # Score remaining messages by importance
    scored = []
    for i, msg in enumerate(messages):
        if i in protected_indices:
            continue
        score = compute_importance(msg, i, len(messages))
        scored.append((i, score, count_tokens(msg["content"])))

    # Sort by importance (ascending) — prune least important first
    scored.sort(key=lambda x: x[1])

    current_tokens = sum(count_tokens(m.get("content", "")) for m in messages)
    pruned_indices = set()

    for idx, score, tokens in scored:
        if current_tokens <= token_budget:
            break
        pruned_indices.add(idx)
        current_tokens -= tokens

    return [m for i, m in enumerate(messages) if i not in pruned_indices]

def compute_importance(message, position, total_messages):
    """Heuristic importance scoring for messages."""
    score = 0.0
    # Tool results with data are more important than reasoning
    if message["role"] == "tool":
        score += 0.5
    # Recent messages are more important (recency bias)
    score += position / total_messages
    # Short messages are less important (usually acknowledgments)
    if len(message.get("content", "")) < 50:
        score -= 0.3
    return score
```

### Sliding Window Approach

The simplest strategy: keep the system prompt, the original user message, and only the last N messages.

```python
def sliding_window(messages, window_size=10):
    """Keep system prompt, user message, and last N messages."""
    if len(messages) <= window_size + 2:
        return messages
    return messages[:2] + messages[-(window_size):]
```

This is fast and predictable but loses all information from early steps. It works best for tasks where recent context matters most and earlier steps are independent.

### Strategies for Long-Running Agents

For agents that run 20+ steps, a hybrid approach works best:

```python
def manage_context_for_long_agent(messages, max_tokens=100_000):
    """Hybrid strategy for long-running agents."""
    current_tokens = count_total_tokens(messages)

    if current_tokens < max_tokens * 0.6:
        # Under 60% utilization: no action needed
        return messages

    if current_tokens < max_tokens * 0.8:
        # 60-80% utilization: truncate large tool results
        return truncate_large_results(messages, max_result_tokens=500)

    if current_tokens < max_tokens * 0.95:
        # 80-95% utilization: summarize old conversation
        return summarize_conversation(messages, keep_recent=6)

    # Over 95%: aggressive pruning + summarization
    messages = summarize_conversation(messages, keep_recent=4)
    messages = truncate_large_results(messages, max_result_tokens=200)
    return messages
```

## Why It Matters

### Context Exhaustion Causes Hard Failures

When the context window is full, the API returns an error and the agent stops. Unlike soft degradation (where the agent gets slightly worse), this is a total failure. The user gets no result and the tokens spent on all previous steps are wasted. Proactive context management avoids this cliff edge.

### Attention Quality Degrades Before the Window Fills

You do not need to hit the hard limit for problems to appear. Research shows that LLM attention to information in the middle of long contexts degrades significantly at 50-60% utilization. An agent at 80% of its context window may already be ignoring important earlier results. Managing context is about preserving reasoning quality, not just avoiding errors.

## Key Technical Details

- GPT-4 Turbo: 128K tokens. Claude 3.5 Sonnet: 200K tokens. Gemini 1.5 Pro: up to 2M tokens
- System prompt + tool definitions typically consume 2,000-5,000 fixed tokens per call
- Each agent step adds 200-1,000 tokens under normal conditions, but can spike to 10,000+ with verbose tool results
- Summarization using a fast model (GPT-4o-mini, Claude 3.5 Haiku) costs ~$0.001 per summarization call
- The "lost in the middle" phenomenon begins affecting results at roughly 50-60% context utilization
- Truncating tool results to 500 tokens max reduces context accumulation rate by ~40% with minimal information loss
- Token counting libraries (`tiktoken` for OpenAI, `anthropic.count_tokens` for Claude) enable precise budget tracking
- A 10-step agent with moderate tool results uses approximately 8,000-12,000 tokens of accumulated context

## Common Misconceptions

**"128K tokens is basically unlimited — I don't need to worry about context"**: 128K tokens sounds like a lot, but a single web page can be 5,000-10,000 tokens, and a database result with 100 rows can be 3,000-5,000 tokens. An agent that fetches 10 web pages has consumed 50,000-100,000 tokens on tool results alone. Context limits are real even with large windows.

**"I should just use the model with the biggest context window"**: Larger windows help, but they do not solve the attention degradation problem. A 1M-token context window does not mean the model pays equal attention to all 1M tokens. Shorter, well-managed contexts produce better reasoning than bloated ones, even when the window is not full.

**"Summarization loses critical information"**: Good summarization preserves key data points while discarding verbosity. A 5,000-token database result that says "Widget Pro: $524K, Gadget Plus: $412K, Sensor Kit: $389K" can be summarized to 50 tokens without losing anything actionable. The raw JSON formatting, column headers, and null fields are noise.

## Connections to Other Concepts

- `conversation-as-working-memory.md` — Context window pressure is the constraint on working memory capacity
- `structured-state-management.md` — Structured state is not subject to context window limits and survives pruning
- `persistent-memory-across-sessions.md` — Offloading information to persistent memory reduces context pressure
- `when-to-stop.md` — Context exhaustion is a valid termination condition
- `system-prompt-as-agent-dna.md` — The system prompt is a fixed cost against the context window
- `chain-of-thought-for-multi-step-tasks.md` — CoT reasoning adds tokens but reduces total steps, creating a net positive tradeoff

## Further Reading

- Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023) — Research demonstrating attention degradation in long contexts
- Anthropic, "Long Context Window Tips" (2024) — Practical guide for managing information in Claude's 200K context
- Ratner et al., "MemGPT: Towards LLMs as Operating Systems" (2023) — Virtual context management that pages information in and out of the context window
- OpenAI, "Managing Tokens and Costs" (2024) — Token counting, budgeting, and cost optimization strategies
