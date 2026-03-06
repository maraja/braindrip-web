# Document Embeddings

**One-Line Summary**: Representing documents as dense vectors for retrieval, clustering, and classification at scale -- from TF-IDF with dimensionality reduction to neural encoders for long text.

**Prerequisites**: TF-IDF (`tf-idf.md`), Word2Vec (`word2vec.md`), Sentence Embeddings (`sentence-embeddings.md`), Bag of Words (`bag-of-words.md`).

## What Is a Document Embedding?

Imagine a librarian who can instantly judge how similar two books are by their content -- not just their titles or keywords, but their deeper themes and arguments. A document embedding gives a machine this capability by compressing an entire document (hundreds or thousands of words) into a single fixed-length vector, typically 128-1024 dimensions. Documents with similar content end up as nearby points in vector space, enabling fast similarity search, clustering, and classification over millions of documents.

The challenge is greater than for sentences: documents are longer (often exceeding model context windows), contain multiple topics, and require representations that capture both local detail and global structure.

## How It Works

### TF-IDF + Dimensionality Reduction (LSA/SVD)

The classic approach constructs a TF-IDF-weighted document-term matrix and then applies truncated Singular Value Decomposition (SVD) to reduce dimensionality:

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD

tfidf = TfidfVectorizer(max_features=50000)
X = tfidf.fit_transform(documents)        # Shape: (n_docs, 50000)
svd = TruncatedSVD(n_components=300)
X_reduced = svd.fit_transform(X)           # Shape: (n_docs, 300)
```

This is Latent Semantic Analysis (LSA). The SVD discovers latent "concepts" that group co-occurring terms. A 300-dimensional LSA representation captures roughly 30-40% of the variance in the original matrix but often improves retrieval by smoothing out synonymy (different words, same concept) and polysemy (same word, different concepts).

### Doc2Vec (Paragraph Vectors)

Introduced by Le and Mikolov (2014), Doc2Vec extends Word2Vec with a document-specific vector:

- **PV-DM**: Concatenates a document vector with word vectors in a sliding window to predict the next word. The document vector serves as a "memory" of the document's topic.
- **PV-DBOW**: Predicts random words from the document vector alone (analogous to Skip-gram).

Doc2Vec produces dense vectors (typically 100-300 dimensions) that capture topical information. It requires training on the target corpus, making it less portable than pre-trained word vector averaging.

### Averaging Word/Sentence Embeddings

A simple and competitive approach:

```python
doc_embedding = mean([word_embedding[w] for w in document_words])
```

Weighted variants (TF-IDF weights, SIF) typically improve over uniform averaging. Alternatively, segment the document into sentences, embed each with a sentence encoder (see `sentence-embeddings.md`), and average the sentence vectors.

### Neural Document Encoders

Modern transformer-based approaches:

**Hierarchical models**: Encode sentences independently with a sentence encoder, then aggregate sentence vectors with a second-level transformer or attention mechanism. This two-stage approach handles documents of arbitrary length.

**Longformer** (Beltagy et al., 2020): Replaces BERT's quadratic self-attention with a combination of local sliding-window attention and global attention on select tokens. This reduces complexity from O(n^2) to O(n), allowing processing of documents up to 4,096 tokens (roughly 3,000 words). Extended variants handle 16,384 tokens.

**BigBird** (Zaheer et al., 2020): Combines random attention, sliding window attention, and global attention tokens to achieve O(n) complexity. Supports sequences up to 4,096 tokens with comparable performance to full attention on document classification and QA tasks.

**LED (Longformer Encoder-Decoder)**: Combines Longformer's efficient attention with a seq2seq architecture, enabling long-document summarization and generation.

### Retrieval-Oriented Document Embeddings

For information retrieval specifically:

- **DPR (Dense Passage Retrieval)**: Encodes passages (typically 100-word chunks) with BERT, trained with contrastive learning on question-passage pairs.
- **ColBERT**: Retains per-token embeddings and uses late interaction (MaxSim) instead of a single vector, offering finer-grained matching at the cost of more storage.
- **Contriever** and **GTR**: Large-scale contrastive models trained on diverse retrieval data.

## Why It Matters

1. **Document retrieval**: Dense document embeddings enable semantic search that goes beyond keyword matching, finding relevant documents even when query terms do not appear in the text.
2. **Document clustering**: Embedding large document collections allows unsupervised discovery of topics and themes using standard clustering algorithms (k-means, HDBSCAN) on dense vectors.
3. **Classification at scale**: Dense representations feed efficient classifiers (linear SVMs, nearest-neighbor) for document categorization, routing, and triage.
4. **Deduplication**: Cosine similarity between document embeddings identifies near-duplicates in large corpora -- essential for dataset curation and search engine indexing.
5. **Recommendation systems**: Representing articles, papers, or products as document vectors enables content-based recommendation through nearest-neighbor lookup.

## Key Technical Details

- **LSA dimensions**: Typical choices are 100-500 components. On the 20 Newsgroups dataset, 300 SVD components retain roughly 35% of variance but improve classification accuracy by 1-3% over raw TF-IDF due to noise reduction.
- **Doc2Vec training**: Requires 10-20 epochs over the corpus. The gensim library provides a standard implementation. PV-DBOW with 300 dimensions is the most common configuration.
- **Long document handling**: Standard BERT handles 512 tokens (roughly 400 words). Strategies for longer documents include truncation (fast but lossy), chunking + pooling (encode chunks separately, then average or max-pool), and efficient transformers (Longformer, BigBird).
- **Longformer performance**: On IMDB classification (long reviews), Longformer achieves 95.7% accuracy vs. RoBERTa's 95.3% (with truncation at 512 tokens). The gap widens for longer documents.
- **Retrieval benchmarks**: On the MS MARCO passage retrieval benchmark, DPR achieves MRR@10 of ~31%, compared to BM25's ~19%. ColBERT achieves ~36% through late interaction.
- **Storage requirements**: A corpus of 1 million documents with 768-dimensional float32 embeddings requires ~3 GB of storage. Quantization to int8 reduces this to ~768 MB.

## Common Misconceptions

- **"A single vector can fully represent a long document."** Long documents contain multiple topics, arguments, and nuances that a single 768-dimensional vector cannot fully capture. This is why multi-vector approaches (ColBERT) and hierarchical methods often outperform single-vector representations for fine-grained retrieval.

- **"Longer input always produces better document embeddings."** Feeding more text into a fixed-context model does not guarantee better representations. If the model's attention mechanism cannot effectively attend to all tokens (due to context length limitations or attention dilution), the embedding quality may plateau or degrade. Strategic chunking with aggregation often outperforms brute-force long-context encoding.

- **"Document embeddings have replaced TF-IDF for retrieval."** In production systems, BM25/TF-IDF often remains the first-stage retriever with dense embeddings used for re-ranking. Hybrid systems combining both consistently outperform either alone. BM25 handles exact term matching (product codes, proper nouns) that dense models sometimes miss.

- **"Doc2Vec is the standard approach for document embeddings."** While historically important, Doc2Vec has been largely superseded by transformer-based approaches for accuracy. It remains useful when training data is limited to the target corpus and no pre-trained models are applicable.

## Connections to Other Concepts

- **TF-IDF** (`tf-idf.md`): TF-IDF vectors are the starting point for LSA-based document embeddings, and BM25 (a TF-IDF variant) remains a competitive baseline for retrieval.
- **Sentence Embeddings** (`sentence-embeddings.md`): Many document embedding approaches build on sentence encoders, either by averaging sentence vectors or using hierarchical architectures.
- **Word2Vec** (`word2vec.md`) / **GloVe** (`glove.md`): Averaging word vectors is the simplest dense document embedding method and a natural baseline.
- **Topic Modeling** (`07-information-extraction-and-retrieval/topic-modeling.md`): Both LSA (a document embedding method) and LDA discover latent themes in document collections, but LSA produces continuous vectors while LDA produces probability distributions over topics.
- **Information Retrieval** (`07-information-extraction-and-retrieval/information-retrieval.md`): Document embeddings power the dense retrieval paradigm that complements traditional keyword-based retrieval.
- **Document Similarity** (`07-information-extraction-and-retrieval/document-similarity.md`): Cosine similarity between document embeddings is a standard approach to measuring document similarity.
- **Contextual Embeddings** (`contextual-embeddings.md`): Longformer and BigBird extend the contextual embedding paradigm to long documents.
- **BERT** (`09-pre-trained-models-for-nlp/bert.md`): Most modern document embedding models are built on BERT or its variants.

## Further Reading

- Le and Mikolov, "Distributed Representations of Sentences and Documents" (2014) -- The Doc2Vec paper introducing paragraph vectors as an extension of Word2Vec.
- Deerwester et al., "Indexing by Latent Semantic Analysis" (1990) -- The foundational LSA paper showing that SVD of term-document matrices captures latent semantics.
- Beltagy et al., "Longformer: The Long-Document Transformer" (2020) -- Introduces efficient attention for processing documents up to 4,096 tokens.
- Zaheer et al., "Big Bird: Transformers for Longer Sequences" (2020) -- Sparse attention mechanisms enabling transformer processing of long documents.
- Karpukhin et al., "Dense Passage Retrieval for Open-Domain Question Answering" (2020) -- The DPR paper establishing dense retrieval as competitive with BM25.
