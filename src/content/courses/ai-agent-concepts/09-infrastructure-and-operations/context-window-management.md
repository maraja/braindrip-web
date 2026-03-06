# Context Window Management

**One-Line Summary**: Context window management is the art of selecting, prioritizing, and compressing information to fit an LLM's limited input capacity while preserving the context most critical for the current reasoning step.

**Prerequisites**: Prompt engineering, retrieval-augmented generation, agent orchestration

## What Is Context Window Management?

Imagine packing for a trip with a strict carry-on limit. You have clothes, toiletries, electronics, documents, and snacks -- far more than fits in one bag. You must prioritize: passport and wallet are non-negotiable, a change of clothes is essential, the third novel is nice-to-have. Context window management is this same packing problem for LLMs. The agent has accumulated system instructions, conversation history, tool outputs, retrieved documents, memories, and intermediate reasoning -- potentially hundreds of thousands of tokens -- but the model can only process a fixed window (8K, 32K, 128K, or 200K tokens depending on the model).

The challenge is acute for agents because they accumulate context over time. A simple chatbot processes one user message and one response. An agent running a 30-step task accumulates 30 rounds of thought-action-observation, each potentially thousands of tokens. By step 20, the raw accumulated context might exceed 100K tokens. Even models with 200K context windows degrade in quality when processing very long inputs -- the "lost in the middle" phenomenon means information in the center of a long context is attended to less than information at the start or end.

*Recommended visual: Diagram showing a context window divided into priority tiers — system prompt (always), current task (always), recent turns (essential), active tool outputs (current step), memories (relevant), older history (compressed/dropped) — with token budget allocations — see [Liu et al., 2023 — Lost in the Middle](https://arxiv.org/abs/2307.03172)*

Context window management is therefore not just about fitting within the limit. It is about maximizing the signal-to-noise ratio of what the model sees. A well-managed context gives the model exactly the information it needs for the current step, organized for easy retrieval: critical instructions first, relevant recent history, pertinent tool outputs, and supporting memories. An poorly managed context buries the relevant information in a sea of irrelevant prior steps.

## How It Works

### Priority-Based Inclusion
Not all context is equally important. A practical priority hierarchy: (1) System prompt with agent identity, capabilities, and constraints -- always included. (2) Current task description and goals -- always included. (3) Most recent 2-3 conversation turns -- essential for continuity. (4) Active tool outputs from the current step -- the model needs these to reason. (5) Retrieved memories relevant to the current task. (6) Older conversation history -- progressively summarized or truncated. (7) Background knowledge from RAG retrieval. Each tier gets a token budget, and lower-priority tiers are compressed or dropped when the total exceeds the window.

### Compression Strategies
When raw context exceeds the window, compression reduces token count while preserving information. Common strategies include: **Summarization** -- use a smaller, cheaper LLM to summarize older conversation turns into a paragraph. **Selective retention** -- keep only tool outputs that are still relevant (drop the results of superseded searches). **Deduplication** -- remove repeated information across multiple tool outputs. **Structured extraction** -- convert verbose tool outputs into structured key-value pairs. A 5,000-token API response might compress to 200 tokens of extracted facts.

### Sliding Window and Summarization
The sliding window approach keeps the N most recent messages verbatim and summarizes everything older. A variation: maintain a "running summary" that is updated after every K turns. The running summary captures key decisions, facts, and intermediate results from older turns. This gives the model temporal context (what happened earlier) without consuming tokens proportional to the full conversation length. The trade-off: summarization loses nuance and detail, so if the model needs to reference a specific earlier detail, it may not be available.

*Recommended visual: Before/after comparison showing a bloated 100K-token context (with redundant tool outputs and stale history) vs a managed 15K-token context (summarized history, only relevant outputs) — see [Xu et al., 2023 — Retrieval Meets Long Context LLMs](https://arxiv.org/abs/2310.03025)*

### Dynamic Context Assembly
Advanced agents assemble context dynamically based on the current step. A coding agent about to write a function retrieves only the relevant source files, not the entire repository. A research agent about to synthesize findings retrieves only the extracted facts, not the raw articles. This step-aware context assembly is more effective than static approaches because the information needed changes dramatically across steps. Implementation requires a context assembly function that runs before each LLM call, selecting and organizing context based on the current state and upcoming action.

## Why It Matters

### Agent Performance Degrades with Context Overload
Experiments consistently show that LLM performance degrades when context is excessively long or poorly organized. The "lost in the middle" paper (Liu et al., 2023) demonstrated that models perform worse on information placed in the middle of long contexts compared to the beginning or end. For agents, this means that relevant information from step 5 of a 20-step task may be effectively invisible if it sits in the middle of a 50K-token context. Careful context management mitigates this by placing critical information at the start and end.

### Cost Scales with Context Length
LLM API pricing is per-token. If your agent sends 100K tokens of context for each of 30 steps, that is 3 million input tokens per task. At $3/million input tokens (Claude Sonnet pricing), that is $9 per task. With context management reducing each call to 10K tokens, the same task costs $0.90. For agents running thousands of tasks per day, context management is a direct cost lever. Output caching (where the API caches and skips re-processing unchanged prompt prefixes) can further reduce costs, but only if the context is structured so the prefix remains stable across calls.

### Enables Long-Running Agents
Without context management, agents hit a wall when their accumulated context exceeds the model's window. A 30-step research task with detailed tool outputs easily generates 200K+ tokens. Context management enables indefinite agent execution by continuously compressing older context, keeping the effective context within the window regardless of how many steps the agent has taken. This is what makes multi-hour, multi-hundred-step agent tasks possible.

## Key Technical Details

- **Token counting** must be done with the model's actual tokenizer (tiktoken for OpenAI, the appropriate tokenizer for Claude) since word count is an unreliable proxy for token count
- **Prompt caching** (available in Claude and GPT APIs) reduces cost for stable context prefixes; structure your context so the system prompt and stable instructions come first, with variable content at the end
- **The "lost in the middle" effect** is strongest for models with shorter context windows; 200K-context models like Claude show less degradation but are not immune
- **Summarization quality** depends on the summarizer model; using GPT-4o-mini or Claude Haiku for summarization is cost-effective while preserving key information
- **Token budgets** should reserve 20-30% of the context window for the model's output, especially when generating long responses or detailed plans
- **Context assembly latency** matters for real-time agents; RAG retrieval and summarization add 100-500ms per LLM call, which compounds over many steps
- **Structured state** (JSON, key-value pairs) is more token-efficient than natural language for conveying factual information the model needs to reference

## Common Misconceptions

- **"Larger context windows solve the problem."** Larger windows help but do not eliminate the need for context management. Performance still degrades with length, costs still scale with tokens, and most accumulated agent context is irrelevant to the current step.
- **"Just truncate old messages."** Naive truncation drops information that may be critical later. A decision made in step 3 might be essential context for step 25. Summarization preserves the key information while reducing token count.
- **"RAG replaces context management."** RAG retrieves external knowledge; context management selects and organizes all context (conversation history, tool outputs, RAG results, memories) for the current LLM call. They are complementary.
- **"The model will ignore irrelevant context."** Models do not reliably ignore irrelevant information. Irrelevant context can distract the model, introduce contradictory information, and degrade output quality. Less is often more.
- **"Context management is a one-time design decision."** Context needs change dynamically as the agent progresses through a task. Effective management requires per-step context assembly that adapts to the current state.

## Connections to Other Concepts

- `agent-orchestration.md` -- The orchestrator manages the state object from which context is assembled for each LLM call
- `cost-optimization.md` -- Context management is one of the most effective cost optimization techniques, directly reducing per-call token usage
- `error-handling-and-retries.md` -- When retrying a failed step, context management must decide whether to include the error information from the failed attempt
- `logging-tracing-and-debugging.md` -- Logging the assembled context for each step enables debugging cases where the model lacked critical information
- `state-machines-and-graphs.md` -- Graph-based agents can attach context assembly logic to each node, tailoring the context to the specific action being performed

## Further Reading

- **Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023)** -- Demonstrates that LLMs attend less to information in the middle of long contexts, motivating careful context organization
- **Anthropic, "Prompt Caching Documentation" (2024)** -- Technical reference for implementing prompt caching to reduce costs when context prefixes remain stable across calls
- **Xu et al., "Retrieval Meets Long Context LLMs" (2023)** -- Compares RAG with long context approaches and finds that combining both outperforms either alone
- **"Managing Context for AI Agents" (LangChain blog, 2024)** -- Practical patterns for context window management in production agent systems, including token budgeting and dynamic assembly
