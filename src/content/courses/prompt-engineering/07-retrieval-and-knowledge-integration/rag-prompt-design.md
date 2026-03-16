# RAG Prompt Design

**One-Line Summary**: The prompt template that wraps retrieved documents and user queries determines whether a RAG system produces faithful, well-cited answers or hallucinates despite having the right information.
**Prerequisites**: `06-context-engineering-fundamentals/conversation-history-management.md`, `04-system-prompts-and-instruction-design/system-prompt-anatomy.md`

## What Is RAG Prompt Design?

Think of RAG prompt design like writing a research paper with specific source materials laid out in front of you. You have the assignment (the user query), the sources (retrieved documents), and the writing rules (formatting, citation requirements, staying faithful to sources). How you arrange these elements on your desk — what you look at first, how you mark important passages, what rules you keep top of mind — determines the quality of your final paper.

RAG prompt design is the discipline of structuring the prompt template that combines retrieved context, user queries, and instructions into a coherent input for the language model. This is distinct from the retrieval step itself; even with perfect retrieval, a poorly designed prompt template can produce unfaithful answers, miss key information, or fail to cite sources properly.

The design decisions here are surprisingly consequential. The order of context and query, the specificity of faithfulness instructions, the format of citation directives, and the separation between retrieved content and system instructions all measurably affect output quality. Research from Microsoft (2023) showed that simply reordering context placement in the prompt changed answer accuracy by up to 15 percentage points.

![LLM-powered autonomous agent system overview showing the interaction between planning, memory, and tool use components](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Source: Lilian Weng, "LLM Powered Autonomous Agents," 2023. This agent architecture diagram illustrates how retrieved context, instructions, and memory integrate in systems that rely on RAG prompt design.*

```mermaid
flowchart LR
    S1["user query"]
    S2["retrieved documents"]
    S3["faithfulness instructions"]
    S4["with labeled sections for context-before-q"]
    S5["query-before-context patterns."]
    S1 --> S2
    S2 --> S3
    S3 --> S4
    S4 --> S5
```
*Source: Adapted from Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," 2020.*

## How It Works

### Context Injection Patterns

There are two primary patterns for positioning retrieved documents relative to the user query:

**Context-before-query (most common)**: Place retrieved documents first, followed by the user question. This works well because the model processes context before encountering the question, allowing it to "read" the sources before formulating an answer. This pattern aligns with how the attention mechanism prioritizes earlier tokens in many architectures.

**Query-before-context**: Place the user question first, then provide the context. This can help the model focus its reading of the context on what is relevant to the question. However, it risks the "lost in the middle" problem where central context is underweighted. This pattern works better with shorter context windows (under 4K tokens).

**Interleaved context**: For multi-source answers, alternate between context chunks and sub-questions. This is more complex but can improve multi-hop reasoning tasks by 10-20%.

### Faithfulness Prompting

Faithfulness instructions constrain the model to answer only from provided context rather than its parametric knowledge. Effective patterns include:

- **Hard grounding**: "Answer ONLY based on the provided context. If the context does not contain the answer, say 'I don't have enough information to answer this.'"
- **Soft grounding**: "Prefer information from the provided context. If the context is insufficient, you may supplement with general knowledge but clearly indicate which parts are from context and which are not."
- **Quote-first patterns**: "First extract relevant quotes from the context, then synthesize your answer from those quotes." This forces the model to ground its reasoning in specific passages before generating.

### Citation Instruction Design

Citation instructions must be explicit and formatted consistently. Vague instructions like "cite your sources" produce inconsistent results. Effective patterns include:

- Numbering source documents explicitly: `[Source 1]`, `[Source 2]`
- Providing a citation template: "After each claim, add the source number in brackets, e.g., [1]"
- Requiring inline citations: "Every factual statement must include at least one citation"
- Requesting a reference list: "End your response with a numbered list of all sources cited"

### Separating Context from Instructions

A critical design decision is how to visually and semantically separate retrieved context from system instructions. Without clear boundaries, the model may treat retrieved content as instructions (prompt injection risk) or treat instructions as context to summarize. Effective separation techniques include:

- XML-style tags: `<context>...</context>` and `<instructions>...</instructions>`
- Markdown headers with explicit labels: `## Retrieved Documents` vs `## Your Task`
- Triple-delimiter blocks: `"""context"""` or `---BEGIN CONTEXT---`
- Role-based separation in multi-turn formats: context as a "user" message, instructions as a "system" message

## Why It Matters

### Faithfulness Is Not Automatic

Models with RAG still hallucinate at rates of 20-30% without proper grounding instructions. The retrieved context competes with the model's parametric knowledge, and without explicit instructions to prefer context, the model may default to its training data — which could be outdated or incorrect for the specific domain.

### Citation Quality Drives Trust

In enterprise and research applications, an answer without citations is essentially unverifiable. Users cannot distinguish between faithful retrieval-based answers and hallucinated ones without proper attribution. Studies show that user trust in RAG systems increases by 40-60% when responses include verifiable inline citations.

### Template Design Affects Latency and Cost

Poorly designed templates waste context window space with redundant instructions or excessive formatting. A well-designed template efficiently allocates tokens between context (60-70% of available space), instructions (10-15%), query (5-10%), and output budget (15-25%).

## Key Technical Details

- Context-before-query ordering improves faithfulness by 8-15% compared to query-before-context in benchmarks with context windows over 4K tokens.
- The "lost in the middle" effect (Liu et al., 2023) shows models underweight information in the middle 30-50% of long contexts; placing critical context at the beginning or end mitigates this.
- Explicit "do not use outside knowledge" instructions reduce hallucination rates from approximately 25% to 8-12% in domain-specific RAG.
- Quote-then-answer patterns improve faithfulness by 15-20% over direct-answer patterns by forcing the model to ground responses in specific passages.
- XML-style delimiters for context separation reduce prompt injection success rates by 60-80% compared to plain-text separation.
- Optimal RAG prompt templates allocate 60-70% of the context window to retrieved documents, with diminishing returns beyond 5-7 source chunks.
- Adding "If you don't know, say so" instructions reduces false-positive answer rates by 30-40% but increases false-negative rates by 5-10%.
- Few-shot citation examples (2-3 examples of properly cited answers) improve citation consistency by 25-35% over zero-shot citation instructions.

## Common Misconceptions

- **"More retrieved context always means better answers."** Beyond 5-7 relevant chunks, additional context introduces noise and can degrade answer quality. The model's attention becomes diluted across too many sources, and irrelevant passages can mislead generation.

- **"RAG eliminates hallucination."** RAG reduces but does not eliminate hallucination. Models can still generate claims not supported by context, misinterpret context, or blend context with parametric knowledge. Proper grounding prompts are essential to minimize this.

- **"The retrieval step is all that matters; the prompt is trivial."** Template design has been shown to swing answer quality by 10-20 percentage points even with identical retrieved documents. The prompt template is as important as retrieval quality.

- **"Citation instructions are cosmetic."** Well-designed citation instructions fundamentally change how the model processes context. They force the model to maintain explicit links between claims and sources, which improves both faithfulness and verifiability.

## Connections to Other Concepts

- `grounding-and-faithfulness.md` — Grounding techniques are the core mechanism that RAG prompt templates use to enforce context-faithful generation.
- `citation-and-attribution-prompting.md` — Citation patterns are a key component of RAG prompt templates, ensuring outputs are verifiable.
- `chunking-for-context-quality.md` — The chunk format and size directly affect how well context integrates into the prompt template.
- `reranking-and-context-selection.md` — Reranking determines which chunks make it into the prompt template's limited context budget.
- `06-context-engineering-fundamentals/conversation-history-management.md` — RAG prompt design is fundamentally a context window allocation problem.

## Further Reading

- Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., & Liang, P. (2023). "Lost in the Middle: How Language Models Use Long Contexts." Foundational study on positional bias in context utilization.
- Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., ... & Kiela, D. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." The original RAG paper establishing the paradigm.
- Gao, L., Ma, X., Lin, J., & Callan, J. (2023). "Precise Zero-Shot Dense Retrieval without Relevance Labels." HyDE approach relevant to prompt-retrieval interaction.
- Asai, A., Wu, Z., Wang, Y., Sil, A., & Hajishirzi, H. (2024). "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection." Advances in self-reflective RAG prompting.
