# Information Retrieval

**One-Line Summary**: Finding relevant documents from large collections in response to a user's information need -- from classical term-matching models like BM25 to modern neural dense retrieval.

**Prerequisites**: Bag of Words (`03-text-representation/bag-of-words.md`), TF-IDF (`03-text-representation/tf-idf.md`), Sentence Embeddings (`03-text-representation/sentence-embeddings.md`).

## What Is Information Retrieval?

Every time you type a question into a search engine and get back a ranked list of web pages, you are using an Information Retrieval (IR) system. Think of IR as a librarian with superhuman speed: given a query, they scan millions of books in milliseconds and hand you the most relevant ones, sorted by likely usefulness.

Formally, Information Retrieval is the task of finding material (usually documents) of an unstructured nature (usually text) that satisfies an information need from within large collections. Unlike Information Extraction (see `information-extraction.md`), which pulls structured facts *out of* documents, IR selects *which documents* to surface. The fundamental challenge is the vocabulary mismatch problem: a user searching for "heart attack symptoms" needs documents that mention "myocardial infarction" -- bridging this lexical gap has driven 70 years of IR research.

## How It Works

### The Boolean Model

The simplest retrieval model treats queries as Boolean expressions. A query like `"machine learning" AND "neural networks" NOT "deep learning"` returns all documents satisfying the Boolean predicate exactly. No ranking is involved -- documents either match or they don't. While limited for general search, the Boolean model remains useful in legal and patent search where precision and completeness are paramount.

### The Vector Space Model (VSM)

Salton's vector space model (1975) represents both documents and queries as vectors in R^|V|, where |V| is the vocabulary size. Each dimension holds a TF-IDF weight (see `03-text-representation/tf-idf.md`). Relevance is computed as the cosine similarity between the query vector and each document vector:

```
sim(q, d) = (q . d) / (||q|| * ||d||)
```

Documents are ranked by decreasing similarity. The VSM handles partial matches gracefully -- a document matching 3 of 4 query terms ranks higher than one matching only 1 -- and established the ranking paradigm that dominates modern search.

### BM25: The Workhorse of Lexical Retrieval

BM25 (Best Match 25), proposed by Robertson et al. (1994), refines TF-IDF scoring with saturation and document length normalization. For a query Q containing terms q_1, ..., q_n, the score of document D is:

```
BM25(D, Q) = sum_{i=1}^{n} IDF(q_i) * (f(q_i, D) * (k1 + 1)) / (f(q_i, D) + k1 * (1 - b + b * |D| / avgdl))
```

Where:
- `f(q_i, D)` is the term frequency of q_i in document D
- `|D|` is the document length, `avgdl` is the average document length
- `k1` (typically 1.2) controls term frequency saturation -- the 10th occurrence matters less than the 1st
- `b` (typically 0.75) controls document length normalization
- `IDF(q_i) = log((N - n(q_i) + 0.5) / (n(q_i) + 0.5))` where N is total documents and n(q_i) is documents containing q_i

BM25 works because: (1) it captures the diminishing returns of repeated term occurrences through saturation, (2) it normalizes for document length so long documents don't unfairly dominate, and (3) IDF upweights rare, discriminative terms. BM25 remains the default baseline in IR and is used in production by Elasticsearch, Solr, and Lucene.

### Inverted Indices

Efficient retrieval requires an **inverted index**: a data structure mapping each term to a posting list of (document_id, term_frequency, positions) tuples. For a vocabulary of 1 million terms and 100 million documents, the inverted index enables query-time lookup in O(|Q| * avg_posting_length) rather than scanning every document. Modern search engines also store skip pointers, compression (variable-byte or PForDelta encoding), and tiered indices for further speedup.

### Relevance Feedback

Users often cannot articulate their information need precisely. Relevance feedback refines the query using user judgments:
- **Explicit feedback**: The user marks documents as relevant/non-relevant; the system reformulates the query (Rocchio algorithm: move the query vector toward relevant documents and away from non-relevant ones).
- **Pseudo-relevance feedback (PRF)**: Assume the top-k retrieved documents are relevant and expand the query with their terms. PRF improves recall by 10-15% on average but can hurt precision when top results are off-topic.
- **Implicit feedback**: Use click-through data, dwell time, and scrolling behavior as relevance signals.

### Neural Dense Retrieval

Traditional IR suffers from the lexical gap: queries and documents must share exact terms. **Dense retrieval** encodes queries and documents into dense vectors using neural encoders, then retrieves via approximate nearest-neighbor (ANN) search in vector space.

**DPR (Dense Passage Retrieval)** (Karpukhin et al., 2020): Uses two separate BERT encoders -- one for queries, one for passages. The similarity score is the dot product of their [CLS] embeddings. DPR is trained with in-batch negatives: for each (query, positive_passage) pair, all other passages in the batch serve as negatives. On Natural Questions, DPR achieved 79.4% top-20 retrieval accuracy vs. BM25's 59.1%.

**ColBERT** (Khattab and Zaharia, 2020): Performs late interaction -- each query token's embedding interacts with each document token's embedding via MaxSim, enabling richer matching while maintaining pre-computability of document embeddings.

### The Retrieve-Then-Rerank Paradigm

Modern IR typically uses a two-stage architecture:
1. **Retrieval stage**: A fast model (BM25 or dense retriever) retrieves the top 100-1000 candidates from the full collection.
2. **Reranking stage**: A more expensive cross-encoder (e.g., a BERT model that takes the concatenation of query and document as input) rescores the candidates for final ranking.

This architecture balances efficiency with effectiveness: BM25 can score millions of documents per second, while a cross-encoder reranker achieves higher relevance quality but is too slow to apply to the full collection.

### Evaluation Metrics

- **Precision@k**: Fraction of top-k results that are relevant. P@10 is standard for web search.
- **Recall@k**: Fraction of all relevant documents appearing in the top-k results.
- **Mean Average Precision (MAP)**: Average of precision values at each relevant document's rank, averaged over queries. Sensitive to the entire ranking.
- **Normalized Discounted Cumulative Gain (NDCG)**: Accounts for graded relevance (not just binary) and discounts relevance by log rank: `DCG@k = sum_{i=1}^{k} (2^{rel_i} - 1) / log2(i + 1)`. NDCG normalizes by the ideal DCG.
- **Mean Reciprocal Rank (MRR)**: The reciprocal of the rank of the first relevant result, averaged over queries. Ideal for factoid search where one answer suffices.

## Why It Matters

1. **Web search**: Google processes ~8.5 billion searches daily. IR is the core technology enabling this scale.
2. **Enterprise search**: Organizations use IR to find information across internal documents, emails, wikis, and codebases.
3. **Retrieval-Augmented Generation (RAG)**: Modern LLM applications use IR to fetch relevant documents before generation, grounding outputs in factual sources and reducing hallucination.
4. **Legal and patent search**: Exhaustive recall of prior art or relevant case law depends on sophisticated IR techniques.
5. **Biomedical literature**: PubMed's search engine serves millions of queries daily from researchers navigating 36+ million abstracts.

## Key Technical Details

- **BM25 parameters**: k1 = 1.2 and b = 0.75 are robust defaults. Tuning on specific collections yields 2-5% MAP improvements.
- **DPR performance**: On Natural Questions, DPR achieves 79.4% top-20 accuracy vs. 59.1% for BM25; on TriviaQA, the gap narrows (79.4% vs. 66.9%).
- **Hybrid retrieval**: Combining BM25 and dense retrieval scores (typically via linear interpolation) outperforms either alone by 3-8% across BEIR benchmarks.
- **Index size**: A FAISS HNSW index for 21 million Wikipedia passages (768-dim vectors) requires ~65 GB of memory; BM25 inverted index for the same collection fits in ~2 GB.
- **Latency**: BM25 retrieval over millions of documents takes 5-20ms; dense retrieval with ANN takes 10-50ms; cross-encoder reranking of 100 candidates takes 200-500ms on GPU.

## Common Misconceptions

**"BM25 is obsolete because of neural retrieval."** BM25 remains extremely competitive. On the BEIR benchmark (Thakur et al., 2021), BM25 outperforms DPR on 8 of 18 datasets, particularly on domain-specialized corpora where dense models trained on Natural Questions fail to generalize. Production search systems almost universally include BM25 as a component.

**"Dense retrieval understands semantics perfectly."** Dense retrievers learn from training data distributions and can fail on out-of-domain queries, rare entities, and precise lexical matching (e.g., searching for a specific error code). This is why hybrid approaches combining sparse and dense signals are increasingly standard.

**"More documents indexed means better search."** Indexing irrelevant documents adds noise and can degrade precision. Corpus curation, deduplication, and quality filtering are critical preprocessing steps.

**"Evaluation metrics are interchangeable."** MAP assumes binary relevance and emphasizes recall; NDCG handles graded relevance; MRR only cares about the first relevant hit. Choosing the wrong metric leads to optimizing for the wrong user experience.

## Connections to Other Concepts

- **TF-IDF** (`03-text-representation/tf-idf.md`): The term weighting scheme underlying the vector space model and closely related to BM25.
- **Bag of Words** (`03-text-representation/bag-of-words.md`): BoW representations power classical term-matching retrieval.
- **Sentence Embeddings** (`03-text-representation/sentence-embeddings.md`): Dense retrieval relies on learned sentence/passage embeddings.
- **Document Embeddings** (`03-text-representation/document-embeddings.md`): Representing entire documents as dense vectors for retrieval and clustering.
- **Document Similarity** (`document-similarity.md`): Cosine similarity and other measures used in both retrieval and duplicate detection.
- **Information Extraction** (`information-extraction.md`): While IR finds relevant documents, IE extracts structured facts from within them.
- **Question Answering** (`06-core-nlp-tasks-generation/question-answering.md`): Open-domain QA depends on IR to retrieve candidate passages before extracting or generating answers.
- **Keyword Extraction** (`keyword-extraction.md`): Extracted keywords can serve as query terms or document descriptors in retrieval systems.

## Further Reading

- Manning, Raghavan, and Schutze, *Introduction to Information Retrieval*, 2008 -- The standard textbook covering Boolean retrieval, vector space models, evaluation, and relevance feedback.
- Robertson and Zaragoza, "The Probabilistic Relevance Framework: BM25 and Beyond," 2009 -- The definitive reference on BM25 and its theoretical foundations.
- Karpukhin et al., "Dense Passage Retrieval for Open-Domain Question Answering," 2020 -- Introduced DPR, establishing dense retrieval as competitive with BM25 for QA.
- Khattab and Zaharia, "ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT," 2020 -- Proposed the late interaction paradigm balancing effectiveness and efficiency.
- Thakur et al., "BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models," 2021 -- The benchmark revealing that dense retrieval does not universally outperform BM25 across domains.
