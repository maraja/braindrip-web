# Memory Retrieval Strategies

**One-Line Summary**: Memory retrieval strategies determine how agents find the right memories at the right time, combining recency (recent is relevant), relevance (semantic similarity), and importance (scored by impact) into hybrid scoring functions that surface the most useful information.

**Prerequisites**: Long-term persistent memory, vector embeddings, semantic similarity

## What Is Memory Retrieval?

Consider a librarian helping a researcher. The researcher asks about "recent advances in CRISPR gene editing for sickle cell disease." The librarian does not randomly pull books off shelves. They use multiple strategies simultaneously: they check the newest journals (recency), search the catalog for books about CRISPR and sickle cell (relevance), and prioritize landmark publications and highly-cited reviews (importance). They might also consider which materials the researcher has found useful before (personalization). The librarian's skill is not in having more books but in finding the right ones.

Memory retrieval for agents is this same challenge: given a vast store of memories (past conversations, facts, experiences, documents), how does the agent find the specific items that will be most useful for the current task? The store might contain thousands to millions of entries. Retrieving too many floods the context window. Retrieving too few misses critical information. Retrieving the wrong ones wastes token budget on irrelevant context. The retrieval strategy is often the difference between a helpful and a useless memory system.

```mermaid
flowchart LR
    S1["recency"]
    S2["relevance"]
    S3["importance"]
    S1 --> S2
    S2 --> S3
```

The key insight is that no single retrieval signal is sufficient. Recency alone misses important old memories. Relevance alone surfaces semantically similar but contextually inappropriate items. Importance alone ignores the current task context. Effective retrieval combines these signals into a hybrid score that balances all three dimensions, often with additional signals like source trustworthiness and user preferences.

## How It Works

### Recency-Based Retrieval

The simplest retrieval signal: prefer memories from the recent past.

**Exponential decay**: Each memory's recency score decays exponentially with time:

```
recency_score = exp(-decay_rate * hours_since_creation)

With decay_rate = 0.01:
  1 hour ago: score = 0.99
  24 hours ago: score = 0.79
  7 days ago: score = 0.19
  30 days ago: score = 0.0007
```

**Step function**: Memories within a time window (e.g., last 7 days) get full score; older memories get zero. Simpler but creates an arbitrary cliff.

**Logarithmic decay**: Slower decay than exponential, keeping older memories relevant longer: `recency_score = 1 / (1 + log(1 + hours_since_creation))`

Recency is effective when the user's context and the agent's environment change slowly, so recent interactions are the best predictors of current needs.

### Relevance-Based Retrieval

The most sophisticated retrieval signal: semantic similarity between the current query and stored memories.

**Vector similarity search**: The current query or context is embedded into the same vector space as stored memories. Cosine similarity (or inner product) between the query embedding and each memory embedding produces a relevance score:

```
relevance_score = cosine_similarity(query_embedding, memory_embedding)
```

Typically, a vector database performs approximate nearest neighbor (ANN) search to find the top-k most similar memories without comparing against every stored item.

**Keyword matching**: For exact or near-exact matches, keyword search (BM25, TF-IDF) can outperform vector search. "What is the user's email address?" is better served by keyword search for "email" than by semantic similarity.

**Hybrid search**: Combining vector similarity and keyword matching captures both semantic (similar meaning) and lexical (exact term) matches:

```
hybrid_score = alpha * vector_similarity + (1 - alpha) * bm25_score
```

Alpha is typically 0.5-0.7, weighting vector search more heavily, but optimal values depend on the domain and query types.

### Importance-Based Retrieval

Not all memories are equally important. Some are critical (user preferences, task outcomes, error patterns) while others are routine (standard greetings, trivial observations).

**LLM-scored importance**: When a memory is created, the LLM rates its importance on a scale of 1-10:

```
Prompt: "On a scale of 1-10, rate the importance of this memory for
future reference. 1 = completely mundane, 10 = critical information
that should always be remembered."

Memory: "The user mentioned they are presenting to the board next Tuesday
and the analysis must be completed by Monday evening."
Importance: 9

Memory: "The user said 'thanks' at the end of the conversation."
Importance: 2
```

**Access frequency**: Memories that are retrieved frequently are likely important. Tracking access count and boosting frequently-accessed memories creates a feedback loop where useful memories become easier to find.

**Explicit user flagging**: Users can explicitly mark information as important ("Remember that our production database is read-only on weekends"). Flagged memories receive a permanent importance boost.

### Hybrid Scoring

The state-of-the-art approach combines all three signals into a single score:

```
final_score = w_recency * recency_score
            + w_relevance * relevance_score
            + w_importance * importance_score

Typical weights:
  w_recency = 0.2
  w_relevance = 0.5
  w_importance = 0.3
```

The Generative Agents paper (Park et al., 2023) used a similar formula, normalizing each component to [0,1] before weighting. The optimal weights depend on the application: research tasks emphasize relevance, personal assistants emphasize recency and importance, and knowledge-intensive tasks emphasize importance and relevance.

### Time-Weighted Retrieval

A specific variant where recency modulates relevance. Instead of treating recency and relevance as independent signals, the relevance score is multiplied by a time decay:

```
time_weighted_score = relevance_score * recency_factor
```

This ensures that a highly relevant but very old memory scores lower than a moderately relevant but recent memory. Useful in fast-changing domains where old information is likely outdated.

### Reranking

After initial retrieval returns the top-k candidates (typically 10-20), a reranking step uses a more expensive model to refine the ranking:

1. **Initial retrieval**: Fast vector search returns top-20 candidates
2. **Reranking**: A cross-encoder model or LLM scores each candidate for relevance to the specific query context
3. **Final selection**: Top-3 to top-5 reranked results are loaded into the context window

Reranking is more expensive but significantly more accurate than vector similarity alone, because cross-encoders can model fine-grained interactions between the query and each candidate.

## Why It Matters

### Retrieval Quality Determines Memory Usefulness

A memory system is only as good as its retrieval. A perfect store of memories with poor retrieval is functionally equivalent to having no memory: the agent cannot find what it needs. Investing in retrieval quality has a higher return than investing in storage quantity.

### Prevents Context Window Pollution

Loading irrelevant memories into the context window wastes tokens and dilutes the model's attention. Precise retrieval ensures that every token spent on memory retrieval contributes to task performance.

### Enables Scalable Memory Systems

As the memory store grows from hundreds to millions of items, naive retrieval (scan everything) becomes infeasible. Efficient retrieval strategies (ANN search, hybrid scoring, reranking) enable the system to scale without degrading retrieval quality or latency.

## Key Technical Details

- **Top-k selection**: Retrieve 3-5 memories for injection into context. Below 3 risks missing relevant information; above 5 risks context pollution. For very important tasks, retrieve 10, then rerank to top-5
- **Embedding model choice matters**: Specialized retrieval models (Cohere embed-v3, Voyage-2) outperform general-purpose models (OpenAI ada-002) on retrieval benchmarks by 5-15% NDCG
- **BM25 + vector hybrid**: Research consistently shows 5-10% improvement over vector-only retrieval when combining with BM25 keyword search
- **Reranking cost**: A cross-encoder reranking step costs ~10ms per candidate. Reranking 20 candidates adds ~200ms latency. Worth it for high-stakes retrieval; excessive for routine queries
- **Minimum relevance threshold**: Set a minimum similarity score (typically 0.3-0.5 cosine similarity) below which memories are not retrieved, even if they are the "most similar." Retrieving low-relevance memories is worse than retrieving nothing
- **Cold start problem**: When the memory store is empty or small, retrieval returns few or no results. Handle this gracefully: the agent should function without memories and not error when retrieval returns empty
- **Score normalization**: When combining multiple signals (recency, relevance, importance), normalize each to [0,1] before weighting, otherwise the signal with the largest raw range dominates

## Common Misconceptions

- **"Semantic similarity is sufficient for memory retrieval."** Semantic similarity finds memories that are about similar topics, but does not consider recency, importance, or contextual appropriateness. A memory about "Python performance" from 2 years ago about Python 3.8 is semantically similar to a current query about Python performance but may contain outdated information.

- **"More retrieval results are better."** Each additional memory consumes context window tokens. Beyond the most relevant 3-5 memories, additional results provide diminishing value and increasing noise. Quality over quantity.

- **"Retrieval should be the same for all queries."** Different types of queries benefit from different retrieval strategies. Factual queries ("What is the user's timezone?") benefit from exact keyword match. Conceptual queries ("How did we handle performance issues before?") benefit from semantic search. Adaptive strategy selection improves overall retrieval quality.

- **"Retrieval weights should be fixed."** Optimal weights for recency, relevance, and importance vary by task type, user, and domain. Fixed weights are a reasonable starting point, but adaptive weights (tuned based on retrieval feedback) can improve by 10-20%.

## Connections to Other Concepts

- `long-term-persistent-memory.md` — Retrieval strategies operate on the long-term memory store; the storage format and indexing directly affect what retrieval strategies are possible
- `episodic-memory.md` — Episodic memory retrieval emphasizes recency and situational similarity, often using outcome-based filtering (retrieve successful episodes for a similar task)
- `semantic-memory.md` — Semantic memory retrieval emphasizes exact match and structured queries over vector similarity, because factual lookups require precision
- `short-term-context-memory.md` — Retrieved memories are loaded into short-term context memory, consuming token budget. Retrieval strategies must account for the context window budget
- `memory-compression.md` — Compression can be applied to retrieved memories before injection into context, reducing the token cost per retrieved item

## Further Reading

- Park, J., O'Brien, J., Cai, C., et al. (2023). "Generative Agents: Interactive Simulacra of Human Behavior." Introduces the recency-relevance-importance retrieval formula that has become the standard for agent memory retrieval.
- Karpukhin, V., Oguz, B., Min, S., et al. (2020). "Dense Passage Retrieval for Open-Domain Question Answering." Foundational paper on using dense embeddings for retrieval, the basis for vector-based memory retrieval.
- Ma, X., Zhang, X., Pradeep, R., et al. (2023). "Fine-Tuning LLaMA for Multi-Stage Text Retrieval." Demonstrates LLM-based reranking for improved retrieval precision.
- Chen, J., Xiao, S., Zhang, P., et al. (2024). "BGE M3-Embedding: Multi-Lingual, Multi-Functionality, Multi-Granularity Text Embeddings Through Self-Knowledge Distillation." State-of-the-art embedding model combining dense, sparse, and multi-vector retrieval.
