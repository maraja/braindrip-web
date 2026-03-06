# Conversation History Management

**One-Line Summary**: Conversation history management applies strategies like sliding windows, summarization, and selective retention to maintain conversational coherence while keeping token costs within the context budget.
**Prerequisites**: `what-is-context-engineering.md`, `context-budget-allocation.md`.

## What Is Conversation History Management?

Think of the difference between recording every word of a meeting versus taking meeting notes. A full recording captures everything — the small talk, the tangents, the repeated explanations — but it is hours long and mostly irrelevant when you need to recall a specific decision. Meeting notes distill the conversation to key points, decisions, and action items, fitting on a single page while preserving everything that matters.

Conversation history management does the same for multi-turn LLM interactions. Every user message and assistant response in a conversation consumes tokens in the context window. A 20-turn conversation can easily reach 10,000-20,000 tokens, and a 50-turn conversation can exceed the entire context window of smaller models. Without management, history either crowds out other context components (system prompt, retrieved documents, tool outputs) or causes hard failures when the window overflows.

The goal is not to preserve every token of history, but to preserve conversational coherence — the model's ability to reference previous turns, maintain topic continuity, and honor commitments made earlier. Different management strategies make different trade-offs between token cost and coherence preservation.

*Recommended visual: A four-panel comparison showing the same 20-turn conversation managed by four strategies: "Sliding Window" (turns 1-10 gone, turns 11-20 kept verbatim), "Summarization" (turns 1-15 compressed into a 500-token summary, turns 16-20 verbatim), "Selective Retention" (important turns 3, 7, 12 kept plus turns 16-20, gaps marked), "Running Summary" (200-token living summary + turns 18-20 verbatim), with token counts annotated for each.*
*Source: Adapted from Park et al., "Generative Agents" (2023) and LangChain Memory documentation (2023)*

*Recommended visual: A line graph showing "Conversational coherence" (y-axis) versus "Token cost" (x-axis) for each history management strategy, with "Full history" in the top-right corner (high coherence, high cost), "Running summary + recent turns" near the top-left (high coherence, low cost), "Sliding window" in the middle, and "Aggressive truncation" in the bottom-left (low coherence, low cost), illustrating the coherence-cost trade-off frontier.*
*Source: Adapted from Xu et al., "Beyond Goldfish Memory" (2022)*

## How It Works

### Sliding Window (Last N Turns)

The simplest strategy keeps only the most recent N turns and drops everything older. When the conversation exceeds N turns, the oldest turn is removed before adding the newest one.

**Implementation**: Maintain a list of turns. When len(turns) > N, remove turns[0]. Typical values for N: 5-10 for focused task assistants, 10-20 for general conversational assistants, 20-50 for complex multi-step workflows.

**Strengths**: Simple to implement, predictable token cost, preserves recent context perfectly.

**Weaknesses**: Abrupt amnesia — the model has no memory of anything before the window. If a user made a request in turn 3 and asks about it in turn 15 (with N=10), the model has no record of the original request. There is no graceful degradation; memory is either perfect (within window) or absent (outside window).

### Summarization (Compress Old Turns)

Summarization uses an LLM to compress older conversation turns into a shorter summary. The recent 3-5 turns are kept in full, and everything older is replaced by a running summary.

**Implementation**: After every K turns (typically 5-10), generate a summary of the oldest turns using a prompt like "Summarize the following conversation, preserving key decisions, user preferences, and pending tasks." Replace the original turns with the summary. Keep recent turns verbatim.

**Token economics**: A 20-turn conversation at ~500 tokens per turn is 10,000 tokens. Summarizing the first 15 turns into a 500-token summary and keeping the last 5 turns verbatim uses 3,000 tokens — a 70% reduction.

**Strengths**: Preserves key information across the entire conversation. Graceful degradation — older information becomes less detailed but is not entirely lost.

**Weaknesses**: Summarization is lossy — nuances, exact quotes, and minor details are lost. The summary itself consumes an additional LLM call per summarization cycle, adding latency and cost. Cascading summarization (summarizing a summary) progressively loses fidelity.

### Selective Retention

Selective retention keeps certain turns based on importance criteria and drops unimportant ones. Importance can be determined by:

- **Content type**: Keep turns where the user stated preferences, made decisions, or provided critical information. Drop turns with small talk, confirmations like "ok thanks," or repetitive exchanges.
- **Explicit markers**: Let the model or user tag turns as important ("Remember this for later").
- **Relevance scoring**: Score each turn's relevance to the current query and keep only relevant ones.

**Implementation**: Each turn is scored or tagged. When budget pressure requires history reduction, the lowest-scored turns are removed. High-importance turns are retained regardless of age.

**Strengths**: Preserves the most valuable information across the entire conversation. More token-efficient than summarization for conversations with high variance in turn importance.

**Weaknesses**: Requires an importance scoring mechanism (which itself may need an LLM call). Non-contiguous history (with gaps) can confuse the model if the remaining turns reference removed ones.

### Running Summary (Incrementally Updated)

A running summary is a single document that is updated after every turn, maintaining a current snapshot of the conversation's state. Unlike batch summarization, the running summary is a living document — new information is integrated incrementally.

**Implementation**: After each assistant response, update the running summary: "Given the previous summary and this new exchange, update the summary to reflect any new information, decisions, or changes." The running summary replaces conversation history in the context.

**Token cost**: The running summary is typically 200-500 tokens regardless of conversation length. Combined with the last 2-3 verbatim turns, total history usage stays under 1,000-1,500 tokens even for very long conversations.

**Strengths**: Extremely token-efficient. Scales to conversations of any length. The incremental update ensures no information is lost at the point it occurs.

**Weaknesses**: Each turn requires a summary update LLM call, adding consistent latency. The summary format (a flat summary document) loses conversational structure — who said what and when becomes blurred.

## Why It Matters

### Enabling Long Conversations

Without history management, conversations hit a hard wall — the context window fills up, and the application must either error, truncate blindly, or ignore history. Management strategies remove this wall, enabling arbitrarily long conversations within a fixed token budget.

### Cost Control

Conversation history is typically the largest and fastest-growing component of the context window. Unmanaged history in a 50-turn conversation at $15 per million input tokens costs 10-50x more per turn than a managed conversation. History management is the primary cost control lever for conversational applications.

### Maintaining Coherence

Users expect conversational AI to remember what they said earlier. "I told you my budget is $500" in turn 3 should still be known in turn 30. History management strategies that preserve key information while reducing token count maintain this coherence, while blind truncation destroys it.

## Key Technical Details

- **Sliding windows with N=10 turns are the most common default** in production conversational applications due to simplicity and predictability.
- **Summarization achieves 60-80% token reduction** on conversation history while preserving 80-90% of key information.
- **Running summaries maintain constant token cost** (~200-500 tokens) regardless of conversation length, at the cost of one additional LLM call per turn.
- **Average turn length** in conversational AI is 200-500 tokens (user + assistant combined), meaning 20 turns consume 4,000-10,000 tokens.
- **Cascading summarization** (summarizing summaries) loses approximately 10-15% of key information per cycle — limit to 2-3 cascades maximum.
- **Hybrid strategies** (running summary + last 3-5 verbatim turns) offer the best coherence-to-token ratio for most applications.
- **Importance scoring** for selective retention can use simple heuristics (turn length, presence of names/numbers/decisions) or LLM-based scoring.

## Common Misconceptions

- **"Full conversation history is always the best option."** Full history maximizes coherence but at extreme token cost and potential quality degradation (lost-in-the-middle effects). Managed history often outperforms full history by focusing attention on relevant information.
- **"Summarization preserves everything important."** Summarization is inherently lossy. Specific numbers, exact quotes, nuanced preferences, and minor details are frequently lost. Design for this — keep critical facts in persistent state outside the summary.
- **"Sliding window is too simple for production."** Sliding window with N=10 handles the majority of production use cases. Most conversations are short (under 10 turns), and the strategy only loses information in the long-tail conversations. Start with sliding window and upgrade only if coherence failures are observed.
- **"Users always notice when the model forgets."** In practice, users rarely reference information from more than 5 turns ago. History management strategies that preserve recent turns well and older turns approximately match user expectations without perfect recall.

## Connections to Other Concepts

- `what-is-context-engineering.md` — Conversation history management is a core component of context engineering for conversational applications.
- `context-budget-allocation.md` — History management enforces the conversation history zone's token budget.
- `context-compression-techniques.md` — Summarization and selective retention are compression techniques applied specifically to conversation history.
- `information-priority-and-ordering.md` — Recent turns should be positioned near the end of the context for maximum attention.
- `state-and-memory-in-context.md` — Running summaries and pinned facts are forms of state management that complement history strategies.

## Further Reading

- Park et al., "Generative Agents: Interactive Simulacra of Human Behavior" (2023) — Implements sophisticated memory management including summarization and importance-weighted retrieval for long-running agent conversations.
- Xu et al., "Beyond Goldfish Memory: Long-Term Open-Domain Conversation" (2022) — Evaluates conversation history management strategies for coherence in long dialogues.
- LangChain, "Memory" documentation (2023) — Practical implementations of sliding window, summarization, and hybrid memory strategies.
- Anthropic, "Multi-Turn Conversations" documentation (2024) — Official guidance on managing conversation history in Claude applications.
