# Memory Architecture Overview

**One-Line Summary**: Agent memory architectures mirror cognitive science's division of memory into sensory (raw input buffering), working (active processing), and long-term (persistent storage), with each type serving a distinct purpose and implemented through different technical mechanisms.

**Prerequisites**: LLM context windows, embedding basics, vector databases

## What Is Memory Architecture?

Consider how human memory works when you cook a complex recipe. Your sensory memory captures the immediate input: the sound of oil sizzling, the smell of garlic. Your working memory holds the active information: "I'm on step 4, the sauce needs to simmer for 10 more minutes, and I still need to prepare the salad." Your long-term memory provides background knowledge: how to julienne vegetables, that saffron pairs well with seafood, and that last time you made this dish you used too much salt. These three systems work together seamlessly, but they have fundamentally different capacities, durations, and access patterns.

![Agent memory architecture showing sensory memory, short-term memory, and long-term memory components](https://lilianweng.github.io/posts/2023-06-23-agent/memory.png)
*Source: [Lilian Weng, "LLM Powered Autonomous Agents" (2023)](https://lilianweng.github.io/posts/2023-06-23-agent/) — Memory architecture for agents mirrors cognitive science: sensory, short-term (working), and long-term memory each serve distinct roles.*

AI agent memory architecture applies this same tripartite structure to organize how agents store, retrieve, and use information. Sensory memory corresponds to the raw input the agent receives (the full API response, the complete file contents, the user's unprocessed message). Working memory corresponds to the agent's active context: what it is currently reasoning about, the plan it is executing, the intermediate results of the current task. Long-term memory corresponds to persistent stores that survive beyond the current conversation: vector databases, knowledge graphs, user preference files, and accumulated experiences.

The architecture matters because each type of memory faces different constraints and requires different solutions. Sensory memory is large but ephemeral. Working memory is small but immediately accessible. Long-term memory is vast but requires explicit retrieval. A well-designed memory architecture manages the flow of information between these layers, ensuring the agent has the right information at the right time without overwhelming its limited working memory.

## How It Works

### Sensory Memory: Raw Input Processing

In cognitive science, sensory memory holds unprocessed perceptual input for a very brief period (milliseconds to seconds). For agents, the analog is the raw data that arrives from the environment before any processing:

- The full text of a web page before extraction
- The complete API response including headers, metadata, and body
- The entire file contents before the agent selects relevant sections
- The user's raw message before intent classification

Sensory memory is large (potentially megabytes) but short-lived. The agent processes it immediately, extracts what is relevant, and discards the rest. In practice, this is often handled implicitly by the framework: the tool returns a response, the agent processes it, and only the processed summary enters working memory.

### Working Memory: The Context Window

Working memory is the agent's active processing space, and for LLM-based agents, it maps directly to the context window. This is where the agent holds:

- The current conversation history
- The active plan and progress status
- Recent tool outputs and observations
- Intermediate reasoning traces
- The system prompt and instructions

The fundamental constraint of working memory is capacity. Current context windows range from 8K to 200K tokens, but effective working memory is smaller: models struggle to attend to all information equally across very long contexts. The practical working memory limit where information is reliably used is approximately 20-40K tokens for most models, even with larger context windows.

### Long-Term Memory: Persistent Storage

Long-term memory stores information that persists beyond the current context window and across sessions. This includes:

- **Vector stores**: Embeddings of past conversations, documents, and knowledge, retrieved by semantic similarity
- **Databases**: Structured data stores (SQL, key-value) for facts, preferences, and configurations
- **File systems**: Persistent files written by the agent or provided by the user
- **Knowledge graphs**: Entity-relationship stores that capture structured knowledge

Long-term memory has virtually unlimited capacity but requires explicit retrieval. The agent must decide what to store, how to index it, and when and how to retrieve it. This retrieval process is the bottleneck: finding the right information among millions of stored items is a search problem.

### Information Flow Between Layers

The memory architecture defines how information moves between layers:

1. **Encoding (Sensory -> Working)**: Raw input is processed, summarized, and loaded into the context window. This often involves truncation, extraction, or summarization to fit within token limits.
2. **Consolidation (Working -> Long-Term)**: Important information from the current session is written to persistent storage. This includes conversation summaries, learned facts, and task outcomes.
3. **Retrieval (Long-Term -> Working)**: When the agent needs past information, it queries long-term memory and loads relevant results into the context window. This is analogous to "remembering" — pulling stored information back into active processing.
4. **Forgetting**: Information that is no longer relevant is removed from working memory (dropped from context) or deprioritized in long-term memory (reduced relevance score). Forgetting is essential to prevent information overload.

## Why It Matters

### Overcomes the Context Window Bottleneck

The context window is the single most limiting factor in agent capability. Without long-term memory, agents cannot remember anything from previous sessions, cannot handle tasks that require more information than fits in context, and cannot learn from past experiences. Memory architecture transforms the finite context window from a hard limit into a managed resource.

### Enables Learning and Personalization

Long-term memory allows agents to accumulate knowledge over time: user preferences, past successes and failures, domain-specific facts. This enables personalization (adapting to individual users) and improvement (performing better on tasks similar to past tasks).

### Supports Complex Multi-Session Tasks

Real-world tasks often span multiple conversations or sessions. A research project might unfold over days, with the agent gathering information in one session and synthesizing it in another. Memory architecture enables this by persisting intermediate results and context across sessions.

## Key Technical Details

- **Working memory effective limit**: ~20-40K tokens for reliable information use, even in models with 100K+ context windows, due to attention dilution in the "lost in the middle" phenomenon
- **Long-term memory retrieval latency**: Vector store queries take 10-100ms; database queries take 1-50ms. This is fast enough for interactive use but adds up over many retrievals per agent step
- **Embedding dimensions**: Common embedding models produce 768-3072 dimensional vectors. Higher dimensions capture more semantic nuance but increase storage and retrieval costs
- **Memory consolidation trigger**: Common strategies include consolidating at end-of-conversation, at regular intervals (every N messages), or when working memory exceeds a threshold
- **Retrieval count**: Loading 3-5 relevant memory chunks per agent step is typical; more risks overwhelming working memory, fewer risks missing critical context
- **Storage formats**: Conversation memories are typically stored as (text, embedding, metadata) tuples where metadata includes timestamp, topic, importance score, and source
- **Cross-session state**: Persistent state between sessions requires explicit serialization (saving to a file or database) and deserialization (loading at session start). Stateless APIs do not provide this automatically

## Common Misconceptions

- **"Larger context windows eliminate the need for memory systems."** Larger context windows expand working memory but do not replace long-term memory. A 200K-token context window cannot hold a year of conversation history. Moreover, performance degrades with very long contexts, making active memory management essential even within large windows.

- **"Vector search is all you need for memory retrieval."** Vector search finds semantically similar content, but memory retrieval also requires recency awareness (recent memories are more relevant), importance scoring (critical memories should surface more often), and structured queries (looking up specific facts by key). Hybrid retrieval strategies outperform pure vector search.

- **"Memory should be managed automatically without user awareness."** Users benefit from understanding what the agent remembers and does not remember. Transparency about memory capabilities and limitations prevents mismatched expectations. Some users want to correct or delete specific memories.

- **"All information should be stored in long-term memory."** Storing everything creates noise that makes retrieval less effective. Selective storage (only important, novel, or user-flagged information) produces a higher-quality memory store.

## Connections to Other Concepts

- `short-term-context-memory.md` — Deep dive into working memory management: conversation buffers, sliding windows, and strategies for maximizing useful context within token limits
- `long-term-persistent-memory.md` — Details on implementing persistent memory with vector stores, the MemGPT approach, and cross-session persistence patterns
- `episodic-memory.md` — Specialized long-term memory for past experiences and interactions, enabling agents to learn from their history
- `semantic-memory.md` — Specialized long-term memory for factual knowledge, implemented through knowledge graphs and structured databases
- `memory-compression.md` — Techniques for managing the transition from working memory to long-term memory through summarization, hierarchical compression, and forgetting strategies

## Further Reading

- Packer, C., Wooders, S., Lin, K., et al. (2023). "MemGPT: Towards LLMs as Operating Systems." Proposes hierarchical memory management inspired by OS virtual memory, with main context (working memory) and external storage (long-term memory).
- Atkinson, R. and Shiffrin, R. (1968). "Human Memory: A Proposed System and Its Control Processes." The foundational cognitive science paper on the multi-store model of memory that inspires agent memory architectures.
- Park, J., O'Brien, J., Cai, C., et al. (2023). "Generative Agents: Interactive Simulacra of Human Behavior." Implements a full memory architecture (observation, reflection, planning) for simulated agents in a virtual town.
- Zhang, Z., Zhang, A., Li, M., et al. (2024). "A Survey on the Memory Mechanism of Large Language Model Based Agents." Comprehensive survey categorizing memory approaches across agent architectures.
