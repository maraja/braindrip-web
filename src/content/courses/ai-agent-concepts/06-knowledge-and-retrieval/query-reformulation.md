# Query Reformulation

**One-Line Summary**: Query reformulation improves retrieval quality by iteratively transforming user queries into more effective search queries through expansion, decomposition, and hypothetical document generation techniques.

**Prerequisites**: Retrieval-Augmented Generation basics, embedding search, semantic similarity, agentic RAG

## What Is Query Reformulation?

Imagine asking a librarian for "that book about the thing with the boats from the war." A good librarian does not search the catalog with your exact words. They mentally reformulate your vague request into something more precise: perhaps "naval warfare World War II" or "Pacific theater battleships history." They might even ask clarifying questions or try multiple searches with different terms. Query reformulation is the AI agent equivalent of this skill.

When a user asks a question, their phrasing is optimized for human communication, not for search systems. The vocabulary mismatch between how people ask questions and how information is stored in retrieval systems is a fundamental challenge. "Why is my code slow?" is a natural question, but the relevant documentation might use terms like "performance optimization," "profiling," or "computational complexity." Query reformulation bridges this gap.

The process is iterative. The agent issues an initial query, evaluates the relevance of returned results, and if they are insufficient, reformulates and tries again. This might involve expanding the query with synonyms, breaking a complex question into sub-queries, or generating a hypothetical answer and using it as the search query. Each reformulation round aims to get closer to the information the user actually needs.

*Recommended visual: Flowchart showing the query reformulation loop — original query → initial retrieval → relevance evaluation → reformulate (expand/decompose/HyDE) → re-retrieve → evaluate again — see [Ma et al., 2023 — Query Rewriting for RAG](https://arxiv.org/abs/2305.14283)*

## How It Works

### Query Expansion

Query expansion enriches the original query with related terms, synonyms, and contextual keywords. An LLM can generate expanded queries by reasoning about what terms relevant documents would likely contain. For example, "LLM memory" might expand to "large language model memory management context window conversation history state persistence." Expansion increases recall by casting a wider net, at the slight cost of precision. Pseudo-relevance feedback takes this further: retrieve initial results, extract key terms from top results, and add those terms to a second query.

### Query Decomposition

Complex questions often contain multiple information needs bundled together. "Compare the pricing, features, and customer reviews of Slack and Microsoft Teams" is really three sub-queries. Decomposition breaks the original query into independent sub-queries, each targeting a specific information need. The agent retrieves for each sub-query separately and then synthesizes the results. This is particularly important for multi-hop questions where the answer to one sub-query is needed to formulate the next (e.g., "Who is the CEO of the company that acquired Twitter?" requires first finding the acquiring company, then finding its CEO).

*Recommended visual: Side-by-side comparison showing query expansion (adding synonyms), query decomposition (splitting into sub-queries), and HyDE (generating hypothetical answer then embedding it) — see [Gao et al., 2023 — HyDE](https://arxiv.org/abs/2212.10496)*

### Hypothetical Document Embeddings (HyDE)

HyDE flips the retrieval paradigm. Instead of searching with the question, the agent first generates a hypothetical answer to the question (without retrieval), then uses that hypothetical answer as the search query. The intuition is that a hypothetical answer, even if factually wrong, will share vocabulary and semantic space with real documents containing the correct answer. A question like "How does photosynthesis work?" generates a paragraph about photosynthesis, and that paragraph is closer in embedding space to relevant documents than the short question is.

### Iterative Refinement

When initial retrieval returns poor results, the agent assesses what went wrong. Were results off-topic (query was too vague)? Were results too broad (query lacked specificity)? Were results from the wrong domain? Based on this analysis, the agent reformulates with corrective adjustments. This can involve adding domain qualifiers ("in the context of Kubernetes"), excluding irrelevant terms, or switching retrieval strategies entirely (e.g., from semantic to keyword search for an exact identifier).

## Why It Matters

### Bridging the Vocabulary Gap

The single biggest failure mode in retrieval systems is vocabulary mismatch. Users ask "Why does my app crash on startup?" while the knowledge base contains "application initialization failure due to null pointer exception." Without reformulation, the semantic similarity between these may be too low for retrieval to surface the right document. Reformulation can improve retrieval recall by 20-40% on real-world queries with vocabulary mismatch.

### Enabling Multi-Hop Reasoning

Many valuable questions require information from multiple documents that no single retrieval query can surface. "What safety certifications are required for medical devices that use machine learning in the EU?" requires retrieving information about EU medical device regulations, ML-specific requirements, and safety certification standards. Only query decomposition makes this tractable.

### Recovering from Poor Initial Results

In any retrieval system, a significant percentage of queries (often 20-30%) return inadequate results on the first attempt. Without reformulation, these queries produce poor answers or hallucinations. With reformulation, the agent gets a second (and third) chance to find the right information, dramatically reducing the rate of retrieval-induced failures.

## Key Technical Details

- **HyDE implementation**: Generate a hypothetical answer using the LLM (zero-shot), encode it with the same embedding model used for the document corpus, and use the resulting vector for similarity search. This typically improves retrieval by 10-20% on diverse query sets.
- **Sub-query generation prompt**: The decomposition prompt instructs the LLM to identify independent information needs and generate self-contained sub-queries. Each sub-query should be answerable independently.
- **Relevance feedback loop**: After each retrieval round, the agent scores result relevance (using either an LLM or a cross-encoder reranker). If the top result relevance score falls below a threshold (e.g., 0.7), reformulation is triggered.
- **Maximum reformulation rounds**: Typically capped at 2-3 rounds to prevent infinite loops. Each round has diminishing returns, and beyond 3 rounds, the issue is usually with the knowledge base, not the query.
- **Fusion strategies**: When multiple reformulated queries each return results, reciprocal rank fusion (RRF) combines the ranked lists into a single ranking that benefits from the diversity of different query formulations.
- **Query type detection**: The reformulation strategy depends on query type. Factoid questions benefit from expansion, analytical questions from decomposition, and vague questions from HyDE.

## Common Misconceptions

- **"Query reformulation is just adding synonyms."** Expansion is one technique among many. Decomposition, HyDE, and iterative refinement based on result analysis are fundamentally different approaches that address different failure modes. The most effective systems combine multiple techniques.

- **"The user's original query is always the best starting point."** User queries are optimized for human conversation, not retrieval. A reformulated query that looks nothing like the original can dramatically outperform it. HyDE demonstrates this -- a generated paragraph bears little resemblance to the original question but retrieves better.

- **"Reformulation adds too much latency."** A single LLM call for reformulation adds 200-500ms but can eliminate multiple failed retrieval rounds. The net effect is often faster time-to-correct-answer, even if time-to-first-retrieval increases.

- **"Semantic search eliminates the need for reformulation."** Embedding-based search reduces vocabulary mismatch but does not eliminate it. Complex queries, domain-specific jargon, and multi-hop information needs still require active reformulation even with state-of-the-art embedding models.

## Connections to Other Concepts

- `agentic-rag.md` -- Query reformulation is a core capability within the agentic RAG loop, triggered when the agent evaluates retrieved results as insufficient.
- `dynamic-retrieval-decisions.md` -- The decision to reformulate versus accept results is a dynamic retrieval decision, governed by relevance thresholds and retrieval budgets.
- `hybrid-search-strategies.md` -- Reformulation may involve switching between search strategies (semantic to keyword, or vice versa) based on what failed in the initial retrieval.
- `knowledge-graph-navigation.md` -- For multi-hop questions, decomposition may route sub-queries to a knowledge graph for structured traversal rather than unstructured search.

## Further Reading

- **Gao et al., 2023** -- "Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE)." Introduces hypothetical document embeddings for zero-shot dense retrieval, showing strong improvements without any relevance training data.
- **Ma et al., 2023** -- "Query Rewriting for Retrieval-Augmented Large Language Models." Systematic study of LLM-based query rewriting techniques and their impact on downstream generation quality.
- **Press et al., 2023** -- "Measuring and Narrowing the Compositionality Gap in Language Models." Analyzes multi-hop question decomposition and how breaking complex questions into sub-questions improves accuracy.
- **Wang et al., 2023** -- "Query2Doc: Query Expansion with Large Language Models." Shows that using LLMs to expand queries with generated pseudo-documents improves both sparse and dense retrieval.
