# Short-Term Context Memory

**One-Line Summary**: Short-term context memory is the agent's working memory implemented through the LLM context window, a finite buffer of tokens that holds the current conversation, recent observations, and active reasoning, constrained by the fundamental limit of context window size.

**Prerequisites**: Memory architecture overview, LLM context windows, tokenization basics

## What Is Short-Term Context Memory?

Think of a whiteboard in a meeting room. Everything currently relevant to the discussion is written on it: the agenda, key points raised, decisions made, action items. The whiteboard is immediately visible to everyone -- no one needs to look anything up. But the whiteboard has finite space. As the meeting progresses, less relevant items must be erased to make room for new information. The challenge is deciding what to erase: if you remove something that becomes relevant again later, you lose it. This is the fundamental tension of short-term context memory.

For LLM-based agents, the context window IS the working memory. Every token in the context window is "on the whiteboard": directly accessible to the model's attention mechanism during generation. This includes the system prompt, the conversation history, recent tool outputs, intermediate reasoning traces, and any retrieved memories. The model attends to all of this simultaneously when deciding what to do or say next. Unlike human working memory (which holds approximately 7 items), LLM context windows can hold thousands to hundreds of thousands of tokens, but the fundamental constraint is the same: capacity is finite, and managing it is critical.

*Recommended visual: A diagram showing the context window as a fixed-size buffer with competing components: system prompt, conversation history, tool outputs, retrieved memories, and reserved response space — see [Packer et al., "MemGPT: Towards LLMs as Operating Systems" (2023)](https://arxiv.org/abs/2310.08560)*

The practical challenge is that everything competes for space in the context window. A long system prompt reduces space for conversation history. Verbose tool outputs crowd out past reasoning. Retrieving memories from long-term storage adds tokens. Every design decision about what to include in the context window is a decision about what the agent can effectively reason about, because information outside the context window is effectively invisible to the model.

## How It Works

### Conversation Buffers

The simplest context memory strategy is a conversation buffer: store all messages in order and include as many as fit in the context window. When the buffer exceeds the token limit, the oldest messages are removed (FIFO -- First In, First Out).

```
Token budget: 8000 tokens
System prompt: 500 tokens (fixed)
Available for conversation: 7500 tokens

Message history (newest first):
  Assistant response: 300 tokens
  User message: 100 tokens
  Tool output: 2000 tokens
  Assistant reasoning: 500 tokens
  User message: 150 tokens
  ... (continue until 7500 tokens)

Older messages are dropped.
```

This is straightforward but suboptimal: the oldest messages might contain the user's original goal or critical context that is still relevant, while recent messages might contain verbose but unimportant tool outputs.

### Sliding Window Strategies

A sliding window keeps the most recent N messages (or N tokens) in context. Variants include:

**Fixed-count window**: Keep the last K messages regardless of length. Simple but does not account for varying message sizes.

**Token-budget window**: Keep messages from newest to oldest until the token budget is exhausted. Better than fixed-count because it adapts to message length.

**Anchored window**: Always keep certain messages (system prompt, first user message, current task description) regardless of how old they are, plus the most recent messages. This preserves critical context while maintaining recency.

```
Context layout (anchored window):
[System prompt - always present]
[First user message - always present]
[Task description - always present]
--- gap (older messages dropped) ---
[Last 5 exchanges - sliding window]
[Current message]
```

### Smart Context Management

Beyond simple windowing, sophisticated agents actively manage their context:

**Selective inclusion**: Not all tool outputs need full inclusion. A search that returned 10 results can be summarized to the top 3. A file that was read for a single function can include just that function, not the entire file.

**Priority-based retention**: Messages are scored by relevance to the current task. High-relevance messages are retained longer; low-relevance messages are dropped first. Relevance can be scored by semantic similarity to the current goal, recency, or explicit importance markers.

**Lazy loading**: Instead of keeping all potentially relevant information in context, store references and load the full content only when needed. "File src/main.py was modified in step 3 [full content available on request]."

### Token Budget Allocation

A well-designed agent allocates its token budget explicitly:

| Component | Typical Allocation |
|---|---|
| System prompt | 5-15% |
| Retrieved memories | 10-20% |
| Conversation history | 30-50% |
| Current tool output | 10-20% |
| Reserved for response | 15-25% |

These allocations should be configurable and may vary by task type. A research task might allocate more to retrieved memories; a conversation task might allocate more to history.

## Why It Matters

### Determines Agent Capability Ceiling

The effective working memory of the agent sets an upper bound on task complexity. An agent with a 4K token effective context cannot handle tasks that require simultaneously reasoning about 20 related code files. Increasing the effective use of the context window (through better management strategies) directly increases what the agent can accomplish.

### Affects Response Quality

When critical context is dropped from the window, the agent loses access to it. This causes well-documented failure modes: forgetting the user's original instructions, contradicting earlier statements, repeating actions that already failed, or losing track of the current plan. Better context management directly translates to more coherent, consistent agent behavior.

### The "Lost in the Middle" Problem

Research has shown that LLMs attend more strongly to information at the beginning and end of the context window, with weaker attention to information in the middle. This means that where information is placed within the context matters as much as whether it is included. Critical information should be positioned at the start or end, not buried in the middle of a long context.

## Key Technical Details

- **Effective vs nominal context window**: A model with a 128K token context window does not use all 128K tokens equally. Performance degrades for information placed in the middle of very long contexts. Effective working memory is typically 20-40K tokens for reliable use
- **Token counting**: Accurate token counting requires the model's actual tokenizer (tiktoken for OpenAI, SentencePiece for many open-source models). Approximate counting (4 characters per token) is unreliable for non-English text, code, and structured data
- **Message role optimization**: System messages get special attention weight in most models. Placing critical instructions in the system prompt is more effective than placing them in early user messages
- **Context window sizes (as of early 2025)**: Claude 3.5 Sonnet: 200K tokens. GPT-4 Turbo: 128K tokens. Gemini 1.5 Pro: up to 2M tokens. Llama 3.1: 128K tokens
- **Cost implications**: Longer context windows cost more per request (input tokens are billed). A 100K token context costs roughly 25x more than a 4K token context. Context management is also cost management
- **Conversation buffer libraries**: LangChain provides `ConversationBufferMemory`, `ConversationBufferWindowMemory`, `ConversationSummaryMemory`, and `ConversationSummaryBufferMemory` as standard components
- **Cache-friendly ordering**: Some API providers cache prompt prefixes. Keeping the system prompt and early context stable across calls enables cache hits, reducing latency and cost

## Common Misconceptions

- **"The context window is unlimited working memory."** Even a 2M-token context window has practical limits. Attention quality degrades over very long contexts. The "lost in the middle" effect means information placement matters. And cost scales linearly with context length.

- **"FIFO is a good default strategy."** FIFO drops the oldest messages first, but the oldest messages often contain the most important context (the user's original request, the task definition, the initial plan). Anchored windowing or priority-based retention outperforms FIFO on most tasks.

- **"You should always use the full context window."** Filling the context window with marginally relevant information can degrade performance by diluting attention. Including only high-relevance information in a smaller context often outperforms including everything in a larger context.

- **"Context window management is handled by the framework."** While frameworks provide basic conversation buffer implementations, optimal context management requires task-specific decisions about what to include, summarize, or drop. This is an agent design decision, not a framework feature.

## Connections to Other Concepts

- `memory-architecture-overview.md` — Short-term context memory is the working memory layer in the three-layer architecture; it interfaces with both sensory input (new messages/observations) and long-term storage (retrieved memories)
- `memory-compression.md` — When the context window fills up, compression techniques (summarization, hierarchical compression) create space by reducing the token footprint of older information
- `conversation-management.md` — Conversation management strategies determine how dialogue history is structured within the context window, including message role assignment and multi-turn tracking
- `memory-retrieval-strategies.md` — Retrieved memories are loaded into the context window, consuming token budget; retrieval strategies must balance relevance against the cost of context space
- `long-term-persistent-memory.md` — When information is evicted from the context window, it can be persisted to long-term memory for later retrieval, creating a two-tier memory system

## Further Reading

- Liu, N., Lin, K., Hewitt, J., et al. (2023). "Lost in the Middle: How Language Models Use Long Contexts." Demonstrates that LLMs attend preferentially to information at the beginning and end of context, with degraded performance for information in the middle.
- Packer, C., Wooders, S., Lin, K., et al. (2023). "MemGPT: Towards LLMs as Operating Systems." Implements context window management as virtual memory, with automatic paging between main context and external storage.
- Xu, W., Alon, U., Neubig, G. (2023). "A Critical Evaluation of Context Length in Language Models." Evaluates how different context lengths affect task performance across multiple benchmarks.
- Ratner, N., Aberdam, Y., Berger, A., et al. (2023). "Parallel Context Windows for Large Language Models." Proposes parallel processing of multiple context windows to effectively increase working memory capacity.
