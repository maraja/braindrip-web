# Conversation as Working Memory

**One-Line Summary**: The message history in an agent loop is not just a chat log — it is the agent's working memory, accumulating context, tool results, and reasoning that the LLM draws on for every subsequent decision.

**Prerequisites**: `system-prompt-as-agent-dna.md`, `chain-of-thought-for-multi-step-tasks.md`

## What Is Conversation as Working Memory?

Think of a detective working a case with a whiteboard. Every time they interview a witness, they pin the notes to the board. Every lab result gets taped up next to the evidence photos. When deciding what to investigate next, the detective scans the entire whiteboard — all the accumulated facts — and reasons about what is missing. The whiteboard is their working memory.

For an LLM agent, the message history *is* the whiteboard. Every user request, every tool call, every tool result, and every piece of reasoning the agent generates gets appended to the conversation. When the model is called again to decide the next step, it receives the entire conversation as input. This means the conversation is not a passive log — it is the active substrate of the agent's cognition.

This has profound implications. The quality of the agent's reasoning at step 7 depends on the quality and clarity of everything that happened in steps 1-6. A cluttered conversation degrades reasoning just like a cluttered whiteboard confuses the detective. Managing this working memory is a core design challenge.

## How It Works

### How Context Accumulates Through the Agent Loop

Each iteration of the agent loop adds messages to the conversation. Here is the anatomy of a typical multi-step interaction:

```python
messages = [
    # Always present: the system prompt
    {"role": "system", "content": "You are a data analysis agent..."},

    # Step 0: User's original request
    {"role": "user", "content": "What were our top 3 products by revenue last quarter?"},

    # Step 1: Agent reasons and calls a tool
    {"role": "assistant", "content": None, "tool_calls": [{
        "id": "call_1",
        "function": {
            "name": "query_database",
            "arguments": '{"query": "SELECT product_name, SUM(revenue) as total FROM sales WHERE quarter = \'Q4-2025\' GROUP BY product_name ORDER BY total DESC LIMIT 3"}'
        }
    }]},

    # Step 1 result: Tool output appended as a message
    {"role": "tool", "tool_call_id": "call_1", "content": '[{"product_name": "Widget Pro", "total": 524000}, {"product_name": "Gadget Plus", "total": 412000}, {"product_name": "Sensor Kit", "total": 389000}]'},

    # Step 2: Agent reasons about the result and responds
    {"role": "assistant", "content": "Here are the top 3 products by revenue last quarter:\n1. Widget Pro — $524,000\n2. Gadget Plus — $412,000\n3. Sensor Kit — $389,000"},
]
```

Notice how each step adds 2 messages (assistant + tool result) to the conversation. After 5 tool calls, the conversation contains at minimum 12 messages: 1 system + 1 user + 10 (5 pairs of tool call + tool result). If the agent also includes reasoning text, the count grows further.

### Tool Results as Memory Entries

Tool results are appended as messages with the `tool` role. The model treats these as factual inputs on subsequent turns. This is how the agent "remembers" what it learned from previous steps.

```python
def run_agent_loop(messages, tools, max_steps=15):
    """The core agent loop showing how memory accumulates."""
    for step in range(max_steps):
        # The ENTIRE message history is sent on every call
        response = llm.chat(messages=messages, tools=tools)

        if response.has_tool_call:
            # Append the assistant's tool call to the conversation
            messages.append({
                "role": "assistant",
                "content": response.content,
                "tool_calls": response.tool_calls
            })

            # Execute the tool and append the result
            for tool_call in response.tool_calls:
                result = execute_tool(tool_call)
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": str(result)
                })
            # Loop continues — model sees all previous results
        else:
            # No tool call: the agent is done
            messages.append({
                "role": "assistant",
                "content": response.content
            })
            return messages

    return messages  # Max steps reached
```

The critical line is `llm.chat(messages=messages, ...)`. The *entire* message list is passed every time. The model does not have a separate memory — it re-reads the whole conversation on each iteration.

### Conversation Length and Reasoning Quality

There is a non-obvious relationship between conversation length and reasoning quality. It follows an inverted-U curve:

```
Reasoning Quality
       ^
       |        ___
       |      /     \
       |    /         \
       |  /             \
       | /                 \___
       |/                       \___
       +----------------------------> Conversation Length
       0    Sweet Spot     Too Long
```

- **Too short** (steps 1-2): The model has insufficient context and may make uninformed decisions.
- **Sweet spot** (steps 3-8): The model has enough context from previous results to make well-informed choices.
- **Too long** (steps 10+): The model starts losing track of earlier information, repeating steps, or getting distracted by irrelevant details.

This degradation at high step counts is why context window management (see `context-window-pressure.md`) is critical for long-running agents.

### Strategies for Keeping Conversation Focused

You can shape working memory to keep it useful rather than letting it become noise.

**Strategy 1: Summarize tool results before appending**

```python
def summarize_tool_result(raw_result, tool_name):
    """Condense large tool results to save context space."""
    if len(str(raw_result)) > 2000:
        # Use a fast model to summarize
        summary = llm_fast.chat(
            messages=[{
                "role": "user",
                "content": f"Summarize this {tool_name} result in under "
                           f"200 words, keeping all key data points:\n\n"
                           f"{raw_result}"
            }]
        )
        return f"[Summarized] {summary.content}"
    return str(raw_result)
```

**Strategy 2: Mark completed sub-tasks to reduce re-processing**

```python
# After completing a sub-task, inject a summary message
messages.append({
    "role": "system",  # or "assistant" depending on API
    "content": (
        "[CHECKPOINT] Sub-task complete: Retrieved Q4 revenue data. "
        "Key finding: Widget Pro is the top product at $524K. "
        "The raw data above can be skimmed — this summary captures "
        "the essential result."
    )
})
```

**Strategy 3: Structure the initial request to prevent scope creep**

```python
# In the system prompt:
FOCUS_INSTRUCTION = """
Stay focused on the user's original request. If you discover
related issues while working, note them but do not investigate
unless they block the current task. Side quests waste context
space and dilute your working memory.
"""
```

### What NOT to Put in Working Memory

Not everything belongs in the conversation. Large data dumps, full file contents, and verbose error traces should be truncated or summarized before being appended.

```python
# BAD: Appending a 10,000-line log file as a tool result
messages.append({"role": "tool", "content": full_log_file})  # 50,000 tokens!

# GOOD: Appending only the relevant lines
messages.append({"role": "tool", "content": (
    f"[Log file: 10,247 lines. Showing 12 relevant error lines]\n"
    f"{relevant_lines}"
)})
```

## Why It Matters

### The Conversation IS the Agent's Brain

Unlike traditional software where memory is explicitly managed (variables, databases, caches), an LLM agent's memory is implicitly managed through the conversation. If information is not in the conversation, the agent does not know it. If the conversation is cluttered, the agent's reasoning is impaired. Understanding this is the foundation for building agents that stay coherent over long interactions.

### Memory Quality Determines Output Quality

The principle of "garbage in, garbage out" applies directly. If previous tool results are dumped in raw, the model wastes attention parsing them. If they are summarized and annotated, the model can quickly identify relevant facts and make better decisions. Every token in the conversation either helps or hinders the next step.

## Key Technical Details

- Each agent step typically adds 200-1,000 tokens to the conversation (tool call + result)
- A 5-step agent interaction consumes approximately 2,000-5,000 tokens of accumulated context
- The system prompt (1,000-3,000 tokens) is a fixed cost present in every call
- Total input tokens for step N = system prompt + all N previous messages
- At step 10 with a 2,000-token system prompt and 500 tokens/step, total input is ~7,000 tokens
- Reasoning quality begins to measurably degrade around 50-60% context window utilization
- Summarizing tool results can reduce per-step memory consumption by 60-80% for verbose outputs
- Models attend more strongly to the beginning (system prompt) and end (recent messages) of the conversation — information in the middle receives less attention

## Common Misconceptions

**"The agent has persistent memory between API calls"**: It does not. Every API call sends the entire conversation from scratch. The model has no hidden state — its only memory is the message list you provide. If you drop a message from the list, it is as if it never happened.

**"More context is always better"**: Beyond a certain point, more context hurts. The model's attention is finite, and adding irrelevant information dilutes its focus on the parts that matter. A 50-token summary of a database result is often more useful than the 5,000-token raw result.

**"The agent remembers everything equally"**: Attention in transformer models is not uniform. Information near the start and end of the context receives more attention than information in the middle (the "lost in the middle" phenomenon). Critical context should be placed in the system prompt (always first) or in recent messages (always last).

## Connections to Other Concepts

- `context-window-pressure.md` — Working memory is bounded by the context window; this concept covers what happens when you run out
- `structured-state-management.md` — When conversation-based memory is insufficient, structured state provides an alternative
- `persistent-memory-across-sessions.md` — Working memory is ephemeral; persistent memory survives between sessions
- `chain-of-thought-for-multi-step-tasks.md` — CoT reasoning becomes part of working memory, helping the agent track its plan
- `system-prompt-as-agent-dna.md` — The system prompt is the permanent fixture in working memory, consuming space on every call
- `when-to-stop.md` — Long conversations degrade reasoning, creating a natural pressure to terminate

## Further Reading

- Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023) — Research on attention patterns and positional bias in long contexts
- Park et al., "Generative Agents: Interactive Simulacra of Human Behavior" (2023) — Memory architecture for long-running LLM agents
- LangChain Documentation, "Message History and Memory" (2024) — Practical patterns for managing conversation memory in agent loops
- Anthropic, "Long Context Prompting Guide" (2024) — Best practices for structuring information in long conversations
