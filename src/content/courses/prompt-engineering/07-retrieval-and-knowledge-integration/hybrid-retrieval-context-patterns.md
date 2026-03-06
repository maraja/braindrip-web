# Hybrid Retrieval Context Patterns

**One-Line Summary**: Combining dense (embedding), sparse (keyword), and structured (SQL/graph) retrieval methods through fusion produces more robust context than any single method alone.
**Prerequisites**: `retrieval-query-design.md`, `reranking-and-context-selection.md`

## What Is Hybrid Retrieval?

Think of hybrid retrieval like searching for a house. You might use Zillow's structured filters (3 bedrooms, under $500K, good school district), Google Maps satellite view to assess the neighborhood visually, and conversations with neighbors to learn things no database captures. No single method finds the perfect house alone — you combine structured filters for hard requirements, visual inspection for subjective quality, and local knowledge for hidden information. Hybrid retrieval applies the same principle to document search.

Hybrid retrieval combines multiple retrieval methods — typically dense (embedding-based semantic search), sparse (keyword-based methods like BM25), and structured (SQL queries, knowledge graphs, metadata filters) — to produce a more complete and accurate set of candidate documents. Each method has distinct strengths and weaknesses, and combining them covers gaps that any single method leaves open.

The empirical evidence is clear: hybrid retrieval consistently outperforms any individual method by 5-15% on standard benchmarks. The improvement is particularly pronounced on queries that mix semantic concepts with specific terminology, such as "What is the GDPR penalty for data breaches affecting more than 1000 users?" — where semantic search captures the legal concept while keyword search anchors on "GDPR" and "1000 users."

*Recommended visual: A Venn diagram showing the complementary strengths of three retrieval methods -- dense retrieval (semantic understanding, paraphrase matching), sparse retrieval (exact terms, rare words, codes), and structured retrieval (filters, date ranges, numerical constraints) -- with the overlap region labeled "hybrid retrieval" and annotated with the 5-15% improvement over single methods.*
*Source: Adapted from Chen et al., "BGE M3-Embedding," 2024, and Formal et al., "SPLADE v2," 2022.*

*Recommended visual: A system architecture diagram showing the hybrid retrieval pipeline -- user query fanning out to three parallel retrieval paths (dense via vector DB, sparse via BM25/Elasticsearch, structured via SQL/graph), results converging through reciprocal rank fusion (RRF), then feeding into a cross-encoder reranker before final context assembly.*
*Source: Adapted from Bruch, "Foundations of Vector Retrieval," 2023.*

## How It Works

### Dense Retrieval (Embedding Similarity)

Dense retrieval encodes queries and documents into high-dimensional vectors (embeddings) using neural models, then finds documents whose embeddings are closest to the query embedding (typically by cosine similarity or dot product).

**Strengths**: Captures semantic meaning, synonyms, and paraphrases. "Car accident" matches documents about "vehicle collision" even without keyword overlap. Handles natural language queries well.

**Weaknesses**: Struggles with exact terms, rare words, and specific identifiers. "Error code E-4721" may not match a document containing that exact code if the embedding model has not learned that specific token. Also struggles with negation and numerical comparisons.

**Common models**: OpenAI text-embedding-3-small/large, Cohere embed-v3, BGE-M3, E5-Mistral-7B. Vector databases: Pinecone, Weaviate, Qdrant, Chroma.

### Sparse Retrieval (BM25 Keyword Matching)

Sparse retrieval uses term frequency-inverse document frequency (TF-IDF) variants — most commonly BM25 — to score documents based on exact keyword overlap with the query.

**Strengths**: Excellent at exact term matching, rare words, proper nouns, codes, and identifiers. "SEC filing 10-K" retrieves exactly the right documents. No training data needed; works out of the box. Fast and well-understood.

**Weaknesses**: No semantic understanding. "Automobile crash" does not match "car accident." Cannot handle paraphrases or conceptual queries. Sensitive to query phrasing and vocabulary mismatch.

**Common implementations**: Elasticsearch BM25, Apache Lucene, rank-bm25 (Python library). Can also be implemented as sparse vectors using SPLADE or similar learned sparse models.

### Structured Retrieval (SQL, Graph, Metadata)

Structured retrieval queries databases or knowledge graphs using precise filters:

- **SQL queries**: "SELECT * FROM products WHERE price < 100 AND category = 'electronics'" — exact filtering on structured attributes
- **Knowledge graph traversal**: "Find all entities connected to 'GDPR' within 2 hops" — relationship-based discovery
- **Metadata filters**: Filter by date range, author, document type, department, or other categorical attributes

**Strengths**: Precise filtering on structured attributes, date ranges, numerical comparisons. Essential when the query contains quantitative or categorical constraints.

**Weaknesses**: Requires structured data (not all information is in databases), rigid schema, and the ability to translate natural language queries into structured queries.

### Fusion Methods

Merging results from multiple retrieval methods requires a principled fusion approach:

**Reciprocal Rank Fusion (RRF)**: The standard fusion method. For each document d appearing in any result list, compute: RRF(d) = sum over lists of 1/(k + rank(d)), with k=60 as the standard constant. Simple, effective, and parameter-free beyond k.

**Weighted fusion**: Assign weights to each retrieval method based on query type. For keyword-heavy queries, upweight BM25; for conceptual queries, upweight dense. Weights can be learned from relevance feedback or set heuristically.

**Cascaded retrieval**: Use one method to generate initial candidates (typically sparse, for speed), then apply a second method to rerank or filter. This is computationally efficient because the expensive method (dense) operates on a smaller candidate set.

**Conditional routing**: Classify the query type first, then route to the appropriate retrieval method. Technical queries with codes and identifiers go to BM25; conceptual questions go to dense; queries with filters go to structured. This avoids the cost of running all methods for every query.

## Why It Matters

### No Single Method Is Complete

Dense retrieval fails on exact terms and identifiers (20-30% of real queries contain specific codes, names, or numbers). Sparse retrieval fails on semantic paraphrases (30-40% of queries require synonym matching). Structured retrieval only handles the subset of information in databases. Only hybrid retrieval covers all three query types.

### Robustness to Query Variation

Users formulate the same information need in different ways. One user searches "Python async await" (keyword-friendly), another searches "how to write non-blocking code in Python" (semantic-friendly), and a third searches "asyncio examples since Python 3.10" (needs date filtering). Hybrid retrieval handles all three formulations; single-method retrieval handles at most one well.

### Enterprise Data Is Heterogeneous

Real enterprise knowledge bases include unstructured documents (PDFs, wiki pages), semi-structured data (JSON configs, logs), and structured databases (CRM, ERP). A hybrid approach retrieves across all data types, assembling context from whatever source best answers the question.

## Key Technical Details

- Hybrid retrieval (dense + sparse) outperforms either method alone by 5-15% on BEIR benchmarks, with larger gains on heterogeneous query sets.
- BM25 outperforms dense retrieval on 30-40% of query types, particularly those with rare terms, exact codes, and proper nouns.
- RRF with k=60 is the most widely used fusion method and requires no training; it is the default in Elasticsearch 8.x hybrid search.
- Learned sparse models (SPLADE, SPLADE++) bridge the gap between sparse and dense by learning term expansions, achieving 80-90% of hybrid performance with single-method simplicity.
- Dense retrieval typically has latency of 10-50ms for top-100 retrieval from million-document collections (with approximate nearest neighbor indexes like HNSW).
- BM25 retrieval adds 5-20ms latency, making the hybrid combination (dense + sparse + fusion) achievable within 50-100ms total.
- Metadata pre-filtering (applying structured filters before dense/sparse retrieval) reduces the search space and improves both relevance and latency.
- The optimal fusion weight between dense and sparse retrieval varies by domain: legal and medical domains benefit from higher BM25 weight (60-70% sparse) due to precise terminology, while general knowledge domains favor dense (60-70% dense).

## Common Misconceptions

- **"Dense retrieval has made keyword search obsolete."** BM25 remains superior for exact term matching, rare words, and domain-specific jargon. On the BEIR benchmark, BM25 outperforms the best dense models on 4 out of 18 datasets, and it provides complementary signal on all of them.

- **"Hybrid retrieval is too complex for production."** Modern search platforms (Elasticsearch 8.x, Weaviate, Qdrant) support hybrid retrieval with built-in RRF fusion as a configuration option. The implementation complexity is minimal.

- **"You need to choose between dense and sparse."** This is a false dichotomy. The marginal cost of running both methods is small (BM25 adds 5-20ms), and the quality improvement of 5-15% is substantial. There is rarely a good reason not to use hybrid retrieval.

- **"All fusion methods perform similarly."** RRF consistently outperforms simple score combination and interleaving, particularly when the score distributions of different methods are not comparable (BM25 scores and cosine similarities are on different scales).

## Connections to Other Concepts

- `retrieval-query-design.md` — Different retrieval methods benefit from different query formulations; keyword expansion helps BM25 while HyDE helps dense retrieval.
- `reranking-and-context-selection.md` — Reranking is applied after fusion to produce the final ranked list; RRF provides the initial combined ranking that rerankers refine.
- `rag-prompt-design.md` — Context assembled from hybrid retrieval may include heterogeneous source types that the prompt template must handle.
- `chunking-for-context-quality.md` — Dense and sparse retrieval may benefit from different chunk sizes; dense works better with larger semantic chunks while sparse works better with shorter, keyword-dense chunks.
- `dynamic-context-augmentation.md` — Dynamic retrieval can selectively invoke different retrieval methods based on what initial results reveal.

## Further Reading

- Chen, J., Xiao, S., Zhang, P., Luo, K., Lian, D., & Liu, Z. (2024). "BGE M3-Embedding: Multi-Lingual, Multi-Functionality, Multi-Granularity Text Embeddings Through Self-Knowledge Distillation." State-of-the-art hybrid embedding model supporting dense and sparse in a single model.
- Formal, T., Piwowarski, B., & Clinchant, S. (2022). "SPLADE v2: Sparse Lexical and Expansion Model for Information Retrieval." Learned sparse retrieval bridging dense and sparse approaches.
- Ma, X., Gong, Y., He, P., Zhao, H., & Duan, N. (2023). "Query Rewriting for Retrieval-Augmented Large Language Models." Analysis of query optimization for different retrieval paradigms.
- Bruch, S. (2023). "Foundations of Vector Retrieval." Comprehensive treatment of dense retrieval infrastructure and algorithms.
