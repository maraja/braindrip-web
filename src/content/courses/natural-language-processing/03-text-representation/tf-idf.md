# TF-IDF

**One-Line Summary**: Weighting words by term frequency times inverse document frequency to surface discriminative terms and suppress ubiquitous ones.

**Prerequisites**: Bag of Words (`bag-of-words.md`), Tokenization (`02-text-preprocessing/tokenization-in-nlp.md`), Stopword Removal (`02-text-preprocessing/stopword-removal.md`).

## What Is TF-IDF?

Imagine you are searching for articles about "black holes." The word "the" appears in every article, so it tells you nothing about relevance. The word "singularity," however, appears in very few articles -- and when it does, those articles are probably about black holes. TF-IDF captures this intuition mathematically: it amplifies words that are frequent *in a specific document* but rare *across the corpus*.

TF-IDF stands for Term Frequency--Inverse Document Frequency. It assigns each word in a document a weight that is the product of two components: how often the word appears in that document (TF) and how rare the word is across all documents (IDF). The result is a weighted vector where generic words like "the" and "is" receive near-zero weights, while topic-specific terms receive high weights.

## How It Works

### Term Frequency (TF) Variants

Given a term t in document d:

- **Raw count**: tf(t, d) = f(t, d), the number of times t appears in d.
- **Log-normalized**: tf(t, d) = 1 + log(f(t, d)) if f(t, d) > 0, else 0. This dampens the effect of high-frequency terms -- a word appearing 100 times is not 100x more important than a word appearing once.
- **Boolean**: tf(t, d) = 1 if t is in d, else 0. Equivalent to binary Bag of Words.
- **Augmented frequency**: tf(t, d) = 0.5 + 0.5 * f(t, d) / max(f(t', d) for t' in d). Normalizes by the maximum term frequency in the document to prevent bias toward longer documents.

### Inverse Document Frequency (IDF)

Given a corpus of N documents and a term t appearing in df(t) documents:

```
idf(t) = log(N / df(t))
```

Variants include adding 1 to the denominator to avoid division by zero (smooth IDF):

```
idf(t) = log(N / (1 + df(t))) + 1
```

A word appearing in all N documents gets idf = log(1) = 0 (or near-zero with smoothing). A word appearing in only 1 of 10,000 documents gets idf = log(10000) = 9.21. This is the discriminative power of IDF.

### TF-IDF Weighting

The combined weight is simply:

```
tfidf(t, d) = tf(t, d) * idf(t)
```

### L2 Normalization

After computing TF-IDF weights, each document vector is typically L2-normalized so that all vectors have unit length:

```
v_normalized = v / ||v||_2
```

This allows cosine similarity between documents to be computed as a simple dot product, and prevents longer documents from having inherently larger magnitudes.

### Implementation with scikit-learn

```python
from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer(
    max_features=50000,    # Vocabulary cap
    min_df=2,              # Ignore terms in fewer than 2 documents
    max_df=0.95,           # Ignore terms in more than 95% of documents
    sublinear_tf=True,     # Apply log normalization to TF
    norm='l2'              # L2 normalization
)
tfidf_matrix = vectorizer.fit_transform(documents)
```

The resulting `tfidf_matrix` is a sparse CSR matrix of shape (n_documents, n_features).

## Why It Matters

1. **Document ranking**: TF-IDF is the foundation of classical information retrieval. Search engines used TF-IDF-based scoring (with refinements) for decades before neural approaches.
2. **Feature quality**: Compared to raw BoW, TF-IDF features consistently improve classification accuracy by 2-5% on standard benchmarks by suppressing noise from common words.
3. **Keyword extraction**: The highest TF-IDF terms in a document are natural keyword candidates, used in summarization and topic identification.
4. **Scalability**: TF-IDF computations are embarrassingly parallel and work efficiently on corpora with millions of documents using sparse matrix operations.
5. **Baseline for modern systems**: Even in the era of dense retrieval, BM25 (a TF-IDF descendant) remains the first-stage retriever in most production search systems.

## Key Technical Details

- **BM25 connection**: BM25 (Best Matching 25) extends TF-IDF with saturation (diminishing returns for term frequency) and document length normalization. The TF component becomes `(f(t,d) * (k1 + 1)) / (f(t,d) + k1 * (1 - b + b * dl/avgdl))`, where k1 = 1.2 and b = 0.75 are standard parameters.
- **Typical vocabulary sizes**: After pruning with min_df=2 and max_df=0.95, English corpora typically yield 10,000-100,000 features. The 20 Newsgroups dataset produces roughly 130,000 features without pruning, 25,000-35,000 after.
- **Sparsity**: TF-IDF matrices are even sparser than raw BoW since many weights are driven toward zero by IDF. Sparsity is typically 99.5%+ for large vocabularies.
- **Cosine similarity**: The standard similarity metric for TF-IDF vectors. Two documents with cosine similarity > 0.3 are generally considered related; > 0.7 is highly similar.
- **Performance ceiling**: On the 20 Newsgroups classification benchmark, TF-IDF + linear SVM achieves roughly 82-85% accuracy, compared to 85-88% for fine-tuned BERT.

## Common Misconceptions

- **"TF-IDF eliminates the need for stopword removal."** While IDF does downweight common words, explicit stopword removal still helps by reducing vocabulary size and computation. Some very common non-stopwords (e.g., "said" in news corpora) can still receive non-trivial TF-IDF weights.

- **"Higher TF-IDF always means a better keyword."** TF-IDF can assign high weights to rare misspellings, proper nouns, or domain jargon that are frequent in one document but absent elsewhere. These are not necessarily good keywords -- they are just rare. Post-filtering is often needed.

- **"TF-IDF captures word meaning."** TF-IDF is purely statistical -- it knows nothing about synonyms, antonyms, or semantic relationships. "Automobile" and "car" are as orthogonal in TF-IDF space as "automobile" and "banana." This limitation is what motivated distributional embeddings like `word2vec.md`.

## Connections to Other Concepts

- **Bag of Words** (`bag-of-words.md`): TF-IDF starts from BoW counts and adds IDF weighting. Understanding raw BoW is a prerequisite.
- **Information Retrieval** (`07-information-extraction-and-retrieval/information-retrieval.md`): TF-IDF scoring is central to the vector space model and BM25 that power classical search engines.
- **Document Similarity** (`07-information-extraction-and-retrieval/document-similarity.md`): Cosine similarity on TF-IDF vectors is the classic approach to measuring document similarity.
- **Keyword Extraction** (`07-information-extraction-and-retrieval/keyword-extraction.md`): TF-IDF is one of the simplest and most widely used methods for extracting representative keywords.
- **Topic Modeling** (`07-information-extraction-and-retrieval/topic-modeling.md`): TF-IDF-weighted document-term matrices often serve as input to LSA, NMF, and other topic models.
- **Document Embeddings** (`document-embeddings.md`): TF-IDF combined with dimensionality reduction (SVD/LSA) is one pathway to dense document representations.
- **Word2Vec** (`word2vec.md`): Dense embeddings were developed partly to address TF-IDF's inability to capture semantic similarity between words.

## Further Reading

- Sparck Jones, "A Statistical Interpretation of Term Specificity and Its Application in Retrieval" (1972) -- The original paper introducing inverse document frequency.
- Salton and Buckley, "Term-Weighting Approaches in Automatic Text Retrieval" (1988) -- Comprehensive comparison of TF-IDF weighting schemes.
- Robertson et al., "Okapi at TREC-3" (1994) -- Introduces BM25, the most successful TF-IDF variant for information retrieval.
- Manning et al., "Introduction to Information Retrieval" (2008) -- Chapter 6 provides detailed treatment of TF-IDF scoring and its variants.
