# Context Assembly Patterns

**One-Line Summary**: Context assembly patterns are software engineering approaches for dynamically constructing the LLM context window at runtime, selecting and arranging information based on the current query, user state, and application logic.
**Prerequisites**: `what-is-context-engineering.md`, `context-budget-allocation.md`.

## What Is Context Assembly?

Think of a DJ building a setlist based on the crowd's energy. The DJ has a vast library of tracks, but each set is assembled in real time — reading the room, selecting tracks that match the current mood, transitioning smoothly between songs, and adapting when the energy shifts. A wedding DJ plays different music than a club DJ, and the same DJ plays differently at 9 PM versus 2 AM. The music library is static; the assembly is dynamic.

Context assembly works the same way. Your application has access to system prompts, user preferences, conversation histories, knowledge bases, tool definitions, and examples. At runtime — when a user sends a query — the context assembly system selects from these sources, formats the selections, and arranges them into the context window. The same query from different users, at different points in a conversation, or with different retrieved documents produces a different assembled context.

This is fundamentally a software engineering problem, not a prompt engineering problem. Context assembly involves conditional logic, data retrieval, formatting pipelines, token counting, and budget enforcement. In production applications, the context assembly layer is often more complex than the prompt itself.

*Recommended visual: A four-quadrant diagram showing the four context assembly patterns: top-left "Static Templates" (fixed slots filled at runtime, simplest), top-right "Conditional Assembly" (if/else logic selecting blocks by user role or state), bottom-left "Relevance-Scored Assembly" (embedding + scoring pipeline ranking candidates to fill budget), bottom-right "Step-Aware Assembly" (state machine changing context at each agent step), with complexity increasing from top-left to bottom-right.*
*Source: Adapted from Khattab et al., "DSPy" (2023) and Chase, "LangChain" (2022)*

![Agent system architecture showing dynamic context assembly across planning, tool use, and memory components](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Source: Lilian Weng, "LLM Powered Autonomous Agents," lilianweng.github.io (2023) -- illustrates how context assembly in agentic applications involves dynamically selecting from memory, tool outputs, and planning state at each step*

## How It Works

### Static Templates

The simplest context assembly pattern uses fixed templates with variable slots. The template defines the structure; variables are filled at runtime:

```
[SYSTEM PROMPT - fixed]
[USER PREFERENCES - from user profile database]
[RETRIEVED DOCUMENTS - from RAG pipeline]
[CONVERSATION HISTORY - last N turns]
[CURRENT QUERY - user's message]
```

Static templates work well for applications with predictable context structures. The positions are fixed, the budget is pre-allocated per section, and the assembly logic is straightforward string concatenation with token counting. Most production LLM applications start with static templates and graduate to more sophisticated patterns as requirements evolve.

### Conditional Assembly

More sophisticated applications assemble different contexts based on runtime conditions:

**Role-based conditioning**: Include admin instructions only for admin users, include content moderation rules only for public-facing interactions, include developer documentation only for technical users. The context structure changes based on who is asking.

**State-based conditioning**: Include onboarding instructions for new users, troubleshooting context when the user reports an error, escalation procedures when sentiment analysis detects frustration. The context adapts to the current state of the interaction.

**Feature-based conditioning**: Include tool definitions only for tools relevant to the current task, include domain-specific examples only when the query matches that domain, include safety guardrails only for sensitive topic areas.

Conditional assembly is implemented as if/else logic in the context construction code. Each condition block adds or removes context sections, adjusts token budgets, and may reorder sections. The key engineering challenge is testing — the number of possible context configurations grows combinatorially with the number of conditions.

### Relevance-Scored Assembly

For applications with large candidate pools of context material — many possible documents, many possible examples, many possible tool definitions — relevance scoring dynamically ranks candidates and fills the budget with the highest-scoring entries.

The pattern is:

1. Generate an embedding of the user's query.
2. Score all context candidates against the query (cosine similarity, BM25, or hybrid).
3. Rank candidates by score.
4. Fill the allocated budget with the highest-scoring candidates.
5. Apply ordering rules (most relevant at the top and bottom, least relevant in the middle).

This is the core pattern behind RAG systems, but it extends beyond document retrieval. You can relevance-score few-shot examples, tool definitions, and even system prompt sections to include only the most pertinent ones for each query.

### Step-Aware Assembly

In agentic applications, the context should change at each step of a multi-step process. The context for "planning which tools to use" is different from the context for "executing a specific tool" and different again from "synthesizing results into a final answer."

Step-aware assembly maintains a state machine that determines which context sections are active at each step:

- **Planning step**: Include tool descriptions, available data sources, and the user's goal. Exclude previous tool outputs (not yet available).
- **Execution step**: Include the specific tool's documentation and schema. Exclude other tools' documentation to reduce distraction.
- **Synthesis step**: Include all tool results, the user's original query, and output format instructions. Exclude tool documentation (no longer needed).

This pattern is common in agent frameworks like LangChain, CrewAI, and AutoGen, where context management is a core architectural concern.

## Why It Matters

### Runtime Flexibility

Static prompts are the same for every request. Runtime context assembly creates bespoke contexts optimized for each specific query, user, and situation. This personalization directly improves response relevance and user satisfaction.

### Scalability of Knowledge

Without dynamic assembly, scaling an LLM application to handle more topics, tools, or document types requires a proportionally larger static prompt. Dynamic assembly scales by selecting from a growing pool of context candidates, keeping the assembled context within budget regardless of how large the knowledge base grows.

### Engineering Maintainability

Context assembly patterns impose structure on what would otherwise be unmanageable string concatenation. Templates, conditional blocks, and scoring pipelines are testable, versionable, and debuggable software components. This engineering discipline is essential as LLM applications grow in complexity.

## Key Technical Details

- **Static templates are sufficient** for 60-70% of LLM applications that have predictable, stable context structures.
- **Conditional assembly introduces combinatorial testing requirements**: N binary conditions create 2^N possible context configurations. Test the critical paths, not all combinations.
- **Relevance scoring adds 50-200ms of latency** per request (embedding generation + similarity search), which is typically small relative to LLM inference latency.
- **Step-aware assembly reduces per-step context size by 30-60%** compared to including all context at every step, improving both cost and quality.
- **Token counting must be exact** in the assembly layer — approximate counting can cause context window overflow at runtime.
- **Context assembly code is the highest-churn code** in most LLM applications, changing more frequently than prompt text or model parameters.
- **Caching assembled contexts** for repeated patterns (same user role + similar query type) can reduce assembly latency by 70-90%.

## Common Misconceptions

- **"Context assembly is just string concatenation."** Assembly involves retrieval, scoring, ranking, conditional logic, token counting, budget enforcement, ordering, and formatting. It is a software engineering system, not a string operation.
- **"The same context works for every user."** Personalized context assembly — based on user role, preferences, history, and state — dramatically improves relevance. One-size-fits-all contexts are a significant quality compromise.
- **"More context candidates are always better."** A larger candidate pool improves the chance of finding relevant content, but only if the scoring function effectively surfaces the best candidates. Poor scoring with a large pool can introduce more noise than a small, curated set.
- **"Context assembly happens before the LLM call and then is done."** In multi-turn and agentic applications, context is reassembled for every LLM call. A 5-step agent process involves 5 separate context assembly operations, each potentially different.

## Connections to Other Concepts

- `what-is-context-engineering.md` — Context assembly is the runtime implementation of context engineering principles.
- `context-budget-allocation.md` — Assembly logic enforces budget constraints, compressing or truncating sections that exceed their allocation.
- `information-priority-and-ordering.md` — Assembly must arrange selected content according to attention-optimized ordering rules.
- `conversation-history-management.md` — History management is a key input to the assembly process, determining how much and which conversation context is included.
- `context-caching-and-prefix-reuse.md` — Assembly patterns that keep stable prefixes enable caching optimizations.

## Further Reading

- Khattab et al., "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines" (2023) — Programmatic context assembly with signatures and modules.
- Chase, "LangChain: Building Applications with LLMs Through Composability" (2022) — Early framework establishing context assembly patterns for production applications.
- Anthropic, "Building Effective Agents" (2024) — Practical patterns for context assembly in agentic applications.
- Zamfirescu-Pereira et al., "Why Johnny Can't Prompt" (2023) — Demonstrates how context assembly complexity exceeds most users' mental models.
