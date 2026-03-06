# Chunking for Context Quality

**One-Line Summary**: How you split documents into chunks for retrieval determines not just what gets found but how well the model can reason over and generate from retrieved context.
**Prerequisites**: `rag-prompt-design.md`, `06-context-engineering-fundamentals/conversation-history-management.md`

## What Is Chunking for Context Quality?

Think of chunking like cutting a pizza. Cut the slices too small and the toppings fall off — you get fragments with no coherent meaning. Cut them too large and they are unwieldy — you waste context window space on irrelevant material. The ideal slice gives you a complete, self-contained portion that is satisfying on its own. The right chunking strategy balances precision (finding exactly what is relevant) against coherence (providing enough surrounding context for the model to generate well).

Chunking is the process of splitting source documents into smaller segments for embedding and retrieval. While chunking is often discussed purely as a retrieval problem (does the right chunk get found?), it is equally a generation quality problem. The chunk that arrives in the model's context window must be self-contained enough to support faithful answer generation, coherent enough to avoid confusing the model, and appropriately sized to fit within token budgets.

The impact is measurable: switching from naive fixed-size chunking to semantic chunking can improve end-to-end RAG answer quality by 15-25% on benchmarks like Natural Questions and HotpotQA, even without changing the retrieval model or the prompt template.

*Recommended visual: A side-by-side comparison diagram showing the same document split into chunks using five strategies (fixed-size, sentence-level, paragraph-level, semantic, and recursive), with color-coded boundaries highlighting how each strategy preserves or breaks topical coherence differently.*
*Source: Adapted from Kamradt, "Chunking Strategies for LLM Applications," 2023, and Anthropic, "Contextual Retrieval," 2024.*

*Recommended visual: A scatter plot showing the trade-off between chunk size (x-axis, from 128 to 2048 tokens) and end-to-end RAG answer quality (y-axis), with separate curves for Q&A, summarization, and conversational tasks -- illustrating the optimal size ranges per use case.*
*Source: Adapted from Chen et al., "Benchmarking Large Language Models in Retrieval-Augmented Generation," 2024.*

## How It Works

### Chunking Strategies

**Fixed-size chunking** splits documents at regular token or character intervals (e.g., every 512 tokens). This is simple and predictable but often breaks mid-sentence or mid-paragraph, producing fragments that lack coherence. A chunk that starts with "...which means the regulation requires" gives the model no context about what regulation or what "which" refers to.

**Sentence-level chunking** splits at sentence boundaries. This produces precise, grammatically complete units but often lacks the surrounding context needed for the model to understand significance. A single sentence like "The threshold was raised to 5%" is useless without knowing what threshold and in what context.

**Paragraph-level chunking** uses paragraph breaks as boundaries. This preserves topical coherence and typically produces chunks of 100-300 tokens. However, paragraphs vary wildly in length, and long paragraphs may contain multiple topics, diluting retrieval precision.

**Semantic chunking** uses embedding similarity between consecutive sentences to detect topic boundaries. When the cosine similarity between adjacent sentence embeddings drops below a threshold (typically 0.7-0.8), a chunk boundary is placed. This produces topically coherent chunks of varying sizes.

**Recursive splitting** starts with large chunks and recursively splits by paragraph, then sentence, then character boundaries until chunks fall within a target size range. This preserves document structure while maintaining size constraints.

### Overlap Strategies

Chunk overlap — repeating a portion of text at the boundary between adjacent chunks — addresses the problem of information split across chunk boundaries. Common approaches include:

- **Fixed overlap**: 10-20% of chunk size (e.g., 50-100 tokens for 512-token chunks)
- **Sentence overlap**: Repeat the last 1-2 sentences of the previous chunk at the start of the next
- **Sliding window**: Create overlapping windows that advance by a fixed stride (e.g., 512-token chunks with 128-token stride)

Overlap increases storage and embedding costs proportionally (20% overlap means 20% more chunks) but reduces the risk of splitting critical information across chunk boundaries by 30-40%.

### Optimal Sizes by Use Case

Chunk size selection should be driven by the downstream task:

- **Question answering**: 256-512 tokens. Smaller chunks improve precision — the model gets focused, relevant context without noise. Short factual answers benefit from precise chunks.
- **Summarization**: 1024-2048 tokens. Larger chunks preserve document flow and narrative structure, which the model needs to produce coherent summaries.
- **Conversational RAG**: 512-1024 tokens. Medium chunks balance precision with enough context for natural dialogue responses.
- **Legal/regulatory analysis**: 512-1024 tokens, split at section boundaries. Legal text has explicit structural boundaries (sections, clauses) that should be respected.
- **Code retrieval**: Function-level or class-level chunking (variable size). Code has natural structural units that should not be broken mid-function.

### Metadata Enrichment

Raw chunks lose document-level context. Metadata enrichment adds structural information back:

- **Parent document reference**: Link each chunk to its source document, section, and page
- **Contextual header prepending**: Prepend the document title and section heading to each chunk (e.g., "From: Annual Report 2024, Section: Revenue Analysis\n\n[chunk text]")
- **Summary augmentation**: Attach a one-sentence summary of the parent section to each chunk
- **Structural position**: Mark whether a chunk is from the introduction, body, or conclusion

Studies show that contextual header prepending alone improves retrieval accuracy by 10-15% because it gives the embedding model document-level context signals.

## Why It Matters

### Chunk Quality Bottlenecks Generation Quality

Even with a perfect prompt template, poor chunking produces poor answers. A chunk that splits a key statistic from its explanation forces the model to either hallucinate context or produce a partial answer. The chunk is the atomic unit of context in RAG — if the atoms are broken, the molecules will be too.

### Cost and Latency Implications

Smaller chunks mean more chunks stored, more embeddings computed, and more retrieval calls. A 1-million-token document produces approximately 2,000 chunks at 512 tokens versus 500 chunks at 2048 tokens. However, smaller chunks also mean less wasted context window space per chunk, so fewer total tokens may be needed in the prompt. The trade-off must be optimized for each use case.

### Retrieval Precision vs Generation Coherence

This is the fundamental tension in chunking. Smaller chunks improve retrieval precision (the right fact is in the retrieved chunk) but hurt generation coherence (the model lacks surrounding context). Larger chunks improve coherence but dilute precision with irrelevant content. The optimal point depends on the task, and there is no universal best size.

## Key Technical Details

- Optimal chunk sizes for Q&A tasks are typically 256-512 tokens; for summarization, 1024-2048 tokens; studies show performance drops of 10-15% when sizes deviate significantly from these ranges.
- Chunk overlap of 10-20% reduces boundary information loss by 30-40% at the cost of proportionally increased storage.
- Semantic chunking (embedding similarity-based splitting) improves end-to-end RAG quality by 15-25% over fixed-size chunking on standard benchmarks.
- Contextual header prepending (adding document title and section header to each chunk) improves retrieval accuracy by 10-15%.
- Token counts vary significantly by language: English averages 1 token per word, while Chinese and Japanese average 2-3 tokens per character, requiring language-specific chunk size tuning.
- Recursive character text splitting (LangChain default) uses the hierarchy: double newline, single newline, sentence boundary, space, character.
- Embedding models have their own maximum input lengths (typically 512 tokens for BERT-based, 8192 for newer models like E5-Mistral), and chunks exceeding this are truncated silently.

## Common Misconceptions

- **"One chunk size fits all use cases."** The optimal chunk size varies by 4-8x between use cases. Q&A, summarization, and conversational tasks each have distinct optimal ranges. Always benchmark chunk sizes against your specific task.

- **"Chunking is only a retrieval problem."** Chunk quality directly affects generation. A chunk that retrieves perfectly (high recall) but lacks coherence will produce poor generated answers. Chunking must optimize for both retrieval and generation.

- **"Semantic chunking is always better than fixed-size."** Semantic chunking adds computational overhead and can produce chunks of wildly varying sizes (some very small, some very large). For well-structured documents with consistent formatting, paragraph-level chunking often performs comparably at lower cost.

- **"More overlap is always better."** Beyond 20-25% overlap, the marginal benefit is minimal while storage and embedding costs continue to increase linearly. Diminishing returns set in quickly.

- **"Chunk the whole document the same way."** Different sections of a document may benefit from different strategies. Tables should be chunked as whole units, code blocks should not be split mid-function, and narrative text can use semantic splitting. Multi-strategy chunking produces better results.

## Connections to Other Concepts

- `rag-prompt-design.md` — The prompt template must accommodate the chunk format and size chosen during the chunking phase.
- `reranking-and-context-selection.md` — Reranking operates on retrieved chunks; chunk quality determines the upper bound of reranking effectiveness.
- `retrieval-query-design.md` — Query design and chunk design must be co-optimized; the granularity of queries should match the granularity of chunks.
- `hybrid-retrieval-context-patterns.md` — Different retrieval methods (dense, sparse, structured) may require different chunking strategies for optimal performance.
- `06-context-engineering-fundamentals/context-budget-allocation.md` — Chunk size directly determines token consumption per retrieval result.

## Further Reading

- Kamradt, G. (2023). "Chunking Strategies for LLM Applications." Practical guide comparing chunking strategies with benchmarks across multiple use cases.
- Anthropic (2024). "Contextual Retrieval." Research on prepending contextual information to chunks to improve retrieval quality.
- Chen, J., Lin, H., Han, X., & Sun, L. (2024). "Benchmarking Large Language Models in Retrieval-Augmented Generation." Systematic evaluation of chunking impact on RAG performance.
- LangChain Documentation (2024). "Text Splitters." Comprehensive reference for recursive, semantic, and document-specific splitting strategies.
