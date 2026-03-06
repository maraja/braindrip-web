# Document Similarity

**One-Line Summary**: Measuring how alike two documents are -- from lexical overlap measures like Jaccard and cosine similarity to semantic approaches like Word Mover's Distance and embedding-based comparison.

**Prerequisites**: Bag of Words (`03-text-representation/bag-of-words.md`), TF-IDF (`03-text-representation/tf-idf.md`), Word2Vec (`03-text-representation/word2vec.md`), Sentence Embeddings (`03-text-representation/sentence-embeddings.md`).

## What Is Document Similarity?

Imagine you are an editor who receives a new article and needs to check if something substantially similar has already been published. You might skim both pieces, comparing topics, vocabulary, and arguments. Document similarity automates this judgment: it assigns a numerical score reflecting how alike two documents are, enabling search engines to find related articles, plagiarism detectors to flag copied content, and clustering algorithms to group documents by theme.

Formally, document similarity is a function sim(d_1, d_2) -> [0, 1] (or sometimes [-1, 1]) that quantifies the resemblance between two documents. The challenge lies in deciding what "similar" means: two documents might share exact words (lexical similarity), discuss the same topic using different words (semantic similarity), have the same structure, or express the same argument with opposite conclusions. Different similarity measures capture different aspects of resemblance, and the right choice depends entirely on the application.

## How It Works

### Jaccard Similarity

The simplest set-based measure. Treat each document as a set of words (or n-grams) and compute:

```
Jaccard(A, B) = |A ∩ B| / |A ∪ B|
```

Jaccard similarity ranges from 0 (no overlap) to 1 (identical sets). It ignores word frequency entirely -- a word appearing once counts the same as a word appearing 100 times. Jaccard is fast to compute and works well for near-duplicate detection, where high lexical overlap is expected.

**MinHash approximation**: For large-scale deduplication (billions of web pages), exact Jaccard computation is infeasible. MinHash (Broder, 1997) approximates Jaccard similarity using random hash functions: for each document, compute k hash signatures; the fraction of matching signatures estimates the Jaccard similarity. With k = 200 hash functions, the estimate is accurate to within +/- 5%. Locality-Sensitive Hashing (LSH) extends MinHash to efficiently find all similar pairs in a corpus without comparing every pair.

### Cosine Similarity on TF-IDF Vectors

The workhorse of traditional document similarity. Represent each document as a TF-IDF vector (see `03-text-representation/tf-idf.md`) and compute:

```
cos(d_1, d_2) = (d_1 . d_2) / (||d_1|| * ||d_2||)
```

Cosine similarity ranges from 0 (orthogonal, no shared terms) to 1 (identical term distributions), assuming non-negative TF-IDF weights. It is length-normalized, so a 10-page document and a 1-page abstract on the same topic can still have high similarity. TF-IDF cosine similarity has been the default document similarity measure in information retrieval for decades (see `information-retrieval.md`).

**Strengths**: Interpretable, efficient with sparse vectors, handles vocabulary mismatch partially through IDF weighting. **Weakness**: Purely lexical -- "automobile" and "car" contribute zero similarity because they are different tokens.

### Soft Cosine Measure

The Soft Cosine Measure (Sidorov et al., 2014) generalizes cosine similarity by incorporating word-level similarity. Instead of treating vocabulary dimensions as orthogonal, it uses a word similarity matrix S where S_ij = similarity(word_i, word_j), computed from word embeddings:

```
soft_cos(d_1, d_2) = (d_1^T * S * d_2) / (sqrt(d_1^T * S * d_1) * sqrt(d_2^T * S * d_2))
```

This means "car" and "automobile" contribute to similarity even when documents use different terms. The Soft Cosine Measure bridges lexical and semantic similarity, often improving over standard cosine by 5-15% on similarity benchmarks. The computational cost increases from O(|V|) to O(|V|^2) per pair, though sparse approximations of S mitigate this.

### Word Mover's Distance (WMD)

WMD (Kusner et al., 2015) measures the minimum cumulative distance that words in document 1 must "travel" in embedding space to match words in document 2. Formally, it solves an optimal transport problem:

```
WMD(d_1, d_2) = min_T sum_{i,j} T_ij * ||x_i - x_j||_2
```

Where T is a transport matrix, x_i and x_j are word embeddings (e.g., from Word2Vec; see `03-text-representation/word2vec.md`), and the constraints ensure all probability mass from d_1's word distribution flows to d_2's word distribution.

**Intuition**: If document 1 talks about "king" and "queen" and document 2 talks about "monarch" and "ruler," the distances in embedding space are small, so WMD is low (documents are similar). WMD achieves state-of-the-art performance on document classification (via k-NN with WMD distance) on 6 of 8 benchmarks tested by Kusner et al.

**Computational cost**: Exact WMD requires solving a linear program in O(p^3 log p) where p is the vocabulary size of the two documents. Approximations include Relaxed WMD (RWMD), which provides a tight lower bound in O(p^2) and can prune the k-NN search.

### Embedding-Based Similarity

Modern approaches represent entire documents as dense vectors and compute similarity via cosine distance or dot product:

- **Averaging word embeddings**: Compute the mean of all word vectors in a document. Simple but surprisingly effective for short texts. Performance degrades for longer documents where the average washes out specific content.
- **Sentence transformers** (Reimers and Gurevych, 2019): Models like all-MiniLM-L6-v2 or all-mpnet-base-v2 produce 384-768 dimensional embeddings that capture semantic meaning (see `03-text-representation/sentence-embeddings.md`). For documents, encode paragraphs or chunks and aggregate.
- **Document embeddings**: Dedicated models like Doc2Vec (Le and Mikolov, 2014) or Longformer-based encoders produce document-level embeddings (see `03-text-representation/document-embeddings.md`).

Embedding-based similarity captures semantic relatedness even with zero lexical overlap: "The cat sat on the mat" and "A feline rested on the rug" have high embedding similarity despite sharing no content words.

### Comparison of Methods

| Method | Captures Semantics | Speed | Best For |
|--------|-------------------|-------|----------|
| Jaccard | No | Very fast | Near-duplicate detection |
| TF-IDF Cosine | Partially (via IDF) | Fast | General retrieval |
| Soft Cosine | Yes | Moderate | Short texts with vocabulary mismatch |
| WMD | Yes | Slow | High-accuracy classification |
| Embedding Cosine | Yes | Fast (after encoding) | Semantic search, clustering |

## Why It Matters

1. **Duplicate and near-duplicate detection**: Search engines use document similarity to deduplicate web crawls -- Google's index of trillions of pages requires efficient similarity computation to avoid showing users the same content from different URLs.
2. **Plagiarism detection**: Academic and publishing platforms compare submitted documents against a corpus of existing works. Turnitin reportedly checks against a database of 1.5+ billion pages.
3. **Document clustering**: Grouping similar documents for topic discovery, organizing search results, and content recommendation (related to `topic-modeling.md`).
4. **Information retrieval**: Ranking documents by similarity to a query is the foundation of search (see `information-retrieval.md`).
5. **Redundancy removal in summarization**: Multi-document summarization uses similarity to avoid selecting redundant sentences (see `06-core-nlp-tasks-generation/text-summarization.md`).

## Key Technical Details

- **TF-IDF cosine efficiency**: With sparse vectors, cosine similarity of two documents with average 300 non-zero terms each takes microseconds. Over a corpus of 1 million documents, pre-computed inverted indices enable sub-second query times.
- **WMD k-NN accuracy**: On 8 document classification datasets, WMD-based k-NN achieved the lowest error rate on 6, with an average error reduction of 4-8% over TF-IDF cosine.
- **MinHash with k = 200 signatures**: Estimates Jaccard similarity with standard error of ~0.05. Combined with LSH using 20 bands of 10 rows, candidate pairs with Jaccard > 0.5 are detected with ~97% probability.
- **Sentence transformer encoding speed**: all-MiniLM-L6-v2 encodes ~14,000 sentences per second on a single GPU; the bottleneck shifts from comparison to encoding.
- **Dimensionality**: TF-IDF vectors are sparse and high-dimensional (10,000-100,000 dims); embedding vectors are dense and low-dimensional (256-1024 dims). Storage and comparison trade-offs differ accordingly.

## Common Misconceptions

**"High cosine similarity means the documents say the same thing."** Two documents can have high TF-IDF cosine similarity because they use the same vocabulary but express opposite viewpoints. Sentiment-aware similarity and argument-level comparison are distinct problems. Semantic similarity alone does not capture stance or argumentative structure.

**"Embedding-based similarity is always superior to lexical methods."** For exact term matching (e.g., finding documents containing a specific error code, part number, or person's name), TF-IDF cosine or Jaccard outperforms embedding methods, which may conflate semantically similar but factually distinct entities.

**"Document similarity is symmetric."** Most measures (Jaccard, cosine, WMD) are symmetric by definition: sim(A, B) = sim(B, A). However, conceptual "similarity" can be asymmetric -- "a dog is similar to an animal" feels more natural than "an animal is similar to a dog." Asymmetric measures exist but are rarely used for documents.

**"One similarity measure works for all tasks."** Different applications demand different similarity notions. Plagiarism detection needs lexical overlap; topic clustering needs semantic similarity; code search needs structural similarity. Always choose the measure that matches the downstream task.

## Connections to Other Concepts

- **TF-IDF** (`03-text-representation/tf-idf.md`): The term weighting scheme underlying cosine similarity for documents.
- **Bag of Words** (`03-text-representation/bag-of-words.md`): BoW vectors are the raw input to Jaccard and cosine similarity.
- **Word2Vec** (`03-text-representation/word2vec.md`): Word embeddings power WMD, Soft Cosine, and averaged embedding similarity.
- **Sentence Embeddings** (`03-text-representation/sentence-embeddings.md`): Sentence transformers provide dense representations for embedding-based document similarity.
- **Document Embeddings** (`03-text-representation/document-embeddings.md`): Dedicated document embedding models for dense similarity computation.
- **Information Retrieval** (`information-retrieval.md`): Document similarity is the core mechanism for ranking documents in response to queries.
- **Topic Modeling** (`topic-modeling.md`): Topic distributions provide another document similarity measure -- documents with similar topic mixtures are thematically alike.
- **Semantic Similarity** (`08-semantic-understanding/semantic-similarity.md`): The broader concept of measuring meaning overlap, applied at word, sentence, and document levels.
- **Text Summarization** (`06-core-nlp-tasks-generation/text-summarization.md`): Similarity is used in multi-document summarization to remove redundancy.

## Further Reading

- Kusner et al., "From Word Embeddings to Document Distances," 2015 -- Introduced Word Mover's Distance, applying optimal transport theory to document similarity.
- Sidorov et al., "Soft Similarity and Soft Cosine Measure: Similarity of Features in Vector Space Model," 2014 -- The Soft Cosine Measure incorporating word-level similarity into document comparison.
- Broder, "On the Resemblance and Containment of Documents," 1997 -- MinHash and shingling for efficient near-duplicate detection at web scale.
- Reimers and Gurevych, "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks," 2019 -- Sentence transformers that produce embeddings enabling efficient semantic similarity computation.
- Le and Mikolov, "Distributed Representations of Sentences and Documents," 2014 -- Doc2Vec, extending Word2Vec to learn document-level embeddings.
- Huang, "Similarity Measures for Text Document Clustering," 2008 -- A practical survey comparing similarity measures for document clustering applications.
