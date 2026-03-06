# What Is Context Engineering

**One-Line Summary**: Context engineering is the discipline of designing what information enters an LLM's context window and how it is organized, determining model performance more than the prompt instructions themselves.
**Prerequisites**: None.

## What Is Context Engineering?

Imagine curating a museum exhibit. You have a vast archive of artifacts, documents, photographs, and interactive displays, but the exhibit hall has limited floor space. What you include, what you exclude, and how you arrange everything determines whether visitors leave informed and inspired or confused and overwhelmed. The labels on the exhibits (your prompts) matter, but the selection and arrangement of what is on display (your context) matters more.

Context engineering is this curatorial discipline applied to LLMs. As Andrej Karpathy framed it, context engineering is "the art of filling the context window with the right information at the right time." It encompasses deciding what system instructions, conversation history, retrieved documents, tool outputs, user data, and examples to include — and equally importantly, what to leave out.

This is distinct from prompt engineering, though the two are deeply related. Prompt engineering focuses on how you phrase instructions and questions. Context engineering focuses on what information surrounds those instructions. A perfectly crafted prompt will fail if the context is missing critical information, is cluttered with irrelevant data, or is organized in a way that buries important details. As context windows have grown from 4K to 128K to 200K+ tokens, context engineering has become the dominant factor in LLM application quality — the challenge has shifted from "fitting everything in" to "choosing what deserves to be in."

![Agent overview showing how context flows through an LLM system with planning, memory, and tool use](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Source: Lilian Weng, "LLM Powered Autonomous Agents," lilianweng.github.io (2023) -- illustrates how context engineering encompasses the entire information architecture surrounding the LLM, including memory, tools, and planning components*

*Recommended visual: A diagram showing the context window as a container divided into labeled zones -- "System Prompt (5-15%)" at the top, "Retrieved Knowledge (20-30%)" and "Conversation History (30-40%)" in the middle, "Tool Results (10-20%)" and "Safety Buffer (5-10%)" at the bottom -- with the user query at the very end. An outer label reads "Prompt Engineering" pointing to just the system prompt, while "Context Engineering" brackets the entire container.*
*Source: Adapted from Andrej Karpathy's context engineering framing (2025) and Anthropic Prompt Engineering Guide (2024)*

## How It Works

### The Context Window as a Resource

The context window is a fixed-size resource measured in tokens. Every piece of information — system prompt, conversation history, retrieved documents, tool results, examples — competes for space in this resource. Context engineering treats the context window as a budget to be allocated strategically, not a container to be filled to capacity.

Filling the context window to its maximum is almost always counterproductive. Models perform best when context is relevant, well-organized, and not excessively large. A 128K context window filled with 120K tokens of loosely relevant documents will underperform a 30K-token context with carefully selected, highly relevant information.

### The Three Dimensions of Context Design

Context engineering operates along three dimensions:

**Selection**: What information to include. This involves relevance scoring, recency filtering, importance ranking, and strategic inclusion of supporting vs critical information. Retrieval-augmented generation (RAG), conversation history management, and tool result filtering are all selection problems.

**Organization**: How to arrange the included information. Position within the context affects how much attention the model pays to each piece. Critical instructions at the beginning, key data near the end, supporting details in the middle — ordering decisions directly impact output quality.

**Representation**: How to format the included information. Raw text, structured JSON, summarized abstracts, key-value pairs — the format affects both token efficiency and model comprehension. The same information can consume 500 tokens or 100 tokens depending on representation, with varying impact on model understanding.

### Context Engineering vs Prompt Engineering

Prompt engineering is a subset of context engineering. A prompt is the instruction layer — the "what do you want the model to do" part. Context engineering encompasses the prompt plus everything else in the context window:

| Aspect | Prompt Engineering | Context Engineering |
|--------|-------------------|---------------------|
| Focus | Instruction phrasing | Total context design |
| Scope | System/user messages | All context window content |
| Concern | Clarity of request | Information architecture |
| Bottleneck | Wording quality | Information selection and arrangement |

In modern LLM applications — agents, RAG systems, multi-turn assistants — the prompt instructions are typically 5-15% of the total context. The remaining 85-95% is context that must be engineered with equal care.

### Why Context Engineering Is Growing in Importance

Three trends drive the increasing importance of context engineering:

**Expanding context windows**: Larger windows create more design space and more opportunities for both effective and ineffective context construction. A 200K context window is not just "more space" — it is a fundamentally different design challenge.

**Agentic applications**: AI agents that use tools, maintain state, and operate over multiple steps require sophisticated context management. Each step produces information that may or may not be relevant to future steps.

**RAG and knowledge integration**: Most production LLM applications retrieve external knowledge. How that knowledge is selected, ranked, formatted, and positioned in the context is a context engineering problem that directly determines response quality.

## Why It Matters

### Performance Is Bottlenecked by Context, Not Models

The same model can produce excellent or terrible results depending on context quality. In RAG systems, retrieval quality (a context engineering concern) typically explains 60-80% of answer quality variance, while prompt phrasing explains 10-20%. Improving the context delivers more impact per engineering hour than improving the prompt.

### Context Engineering Is Software Engineering

Building reliable LLM applications requires treating context assembly as a software engineering problem. Context templates, conditional logic for what to include, caching strategies, compression algorithms, and testing frameworks — these are engineering disciplines, not art. Teams that approach context engineering with engineering rigor build more reliable applications.

### The Shift from Art to Discipline

Early prompt engineering was often ad-hoc: try different phrasings, see what works, iterate informally. Context engineering demands systematic approaches because the design space is too large for trial and error. With 200K tokens of context to fill, you need principled frameworks for allocation, selection, and organization.

## Key Technical Details

- **Context windows range from 8K to 200K+ tokens** across current frontier models, with effective performance often degrading before the nominal limit.
- **Prompt instructions typically occupy 5-15% of the context** in production applications; the remaining 85-95% is engineered context.
- **Retrieval quality explains 60-80% of answer quality variance** in RAG systems, making context selection the dominant quality lever.
- **Filling context to maximum capacity degrades performance** — models perform best with relevant, well-organized context that leaves some buffer.
- **Context assembly latency** (retrieval, formatting, compression) often exceeds model inference latency in production systems.
- **Karpathy's framing** — "the art of filling the context window with the right information" — captures the core insight: it is about what goes in, not just how you ask.
- **Context engineering costs are primarily compute costs**: embedding queries, running retrieval, compressing history, and assembling context all consume resources before the LLM call even begins.

## Common Misconceptions

- **"Context engineering is just prompt engineering with a new name."** Prompt engineering focuses on instruction phrasing. Context engineering encompasses the entire context window: what information to include, how to organize it, what to compress, what to cache, and how to manage state across turns. The prompt is one component of the context.
- **"Bigger context windows solve context engineering problems."** Larger windows create more design space but do not eliminate the need for careful selection and organization. A 200K window filled with irrelevant documents performs worse than an 8K window with precisely relevant information.
- **"Just put everything in the context and let the model figure it out."** Models struggle with information overload just as humans do. Irrelevant context dilutes attention on relevant information, increases hallucination risk, and degrades output quality. Curation is essential.
- **"Context engineering is a one-time design task."** In production systems, context is assembled dynamically at runtime. Different queries retrieve different documents, different conversation histories require different management strategies, and different users need different context. Context engineering is runtime software, not static configuration.

## Connections to Other Concepts

- `context-budget-allocation.md` — The practical framework for dividing the context window into zones with specific purposes and token budgets.
- `information-priority-and-ordering.md` — How to arrange information within the context for maximum model attention and comprehension.
- `context-assembly-patterns.md` — Software engineering patterns for dynamically constructing context at runtime.
- `conversation-history-management.md` — Strategies for managing the largest and most dynamic portion of context in conversational applications.
- `long-context-design-patterns.md` — Specialized techniques for context engineering with 100K+ token windows.

## Further Reading

- Karpathy, "Context Engineering" (2025) — The framing of context engineering as a distinct discipline, emphasizing information selection over instruction phrasing.
- Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (2020) — Foundational RAG paper demonstrating the impact of context selection on output quality.
- Anthropic, "Prompt Engineering Guide" (2024) — Practical context design patterns including system prompts, examples, and document formatting.
- Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023) — Empirical evidence that information position within context significantly affects model performance.
