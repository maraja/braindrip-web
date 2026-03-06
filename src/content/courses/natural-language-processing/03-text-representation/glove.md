# GloVe

**One-Line Summary**: Global matrix factorization of word co-occurrence statistics producing word vectors with linear substructures -- bridging count-based and prediction-based embedding methods.

**Prerequisites**: Word2Vec (`word2vec.md`), Bag of Words (`bag-of-words.md`), Semantics (`01-foundations-of-language/semantics.md`).

## What Is GloVe?

Imagine you have a massive spreadsheet where every row and every column is a word, and each cell records how often those two words appear near each other across an entire library. This co-occurrence matrix contains a wealth of information about word relationships, but it is enormous and noisy. GloVe (Global Vectors for Word Representation) is an algorithm that compresses this matrix into compact word vectors -- typically 50 to 300 dimensions -- while preserving the essential relationships.

Developed by Pennington, Socher, and Manning at Stanford in 2014, GloVe explicitly targets a mathematical property: the ratio of co-occurrence probabilities between words should be captured by the difference of their vectors. If "ice" co-occurs frequently with "solid" but rarely with "gas," and "steam" co-occurs frequently with "gas" but rarely with "solid," then the ratio P(solid|ice)/P(solid|steam) is large, and GloVe ensures this is reflected in the vector geometry.

## How It Works

### Building the Co-occurrence Matrix

First, scan the entire corpus with a symmetric context window of size c (typically 10). For each word pair (i, j) within the window, increment X_ij. Closer words receive higher weight: a word 1 position away contributes 1, a word k positions away contributes 1/k. The result is a symmetric, sparse matrix X of size |V| x |V|.

### The Objective Function

GloVe trains word vectors w_i and context vectors w_j (plus bias terms b_i, b_j) to satisfy:

```
w_i^T * w_j + b_i + b_j = log(X_ij)
```

The loss function is a weighted least squares objective:

```
J = sum_{i,j=1}^{|V|} f(X_ij) * (w_i^T * w_j + b_i + b_j - log(X_ij))^2
```

### The Weighting Function

The function f(X_ij) prevents rare and very frequent co-occurrences from dominating:

```
f(x) = (x / x_max)^alpha   if x < x_max
f(x) = 1                    if x >= x_max
```

where x_max = 100 and alpha = 3/4 in the standard configuration. This means co-occurrence counts above 100 are treated equally, and very rare co-occurrences (which are noisy) receive reduced weight.

### Connection to Matrix Factorization

GloVe is explicitly a matrix factorization method. It approximately factorizes the log co-occurrence matrix (adjusted by biases) into the product of two low-rank matrices: W (word vectors) and W' (context vectors). This connects GloVe to Latent Semantic Analysis (LSA), which factorizes the TF-IDF-weighted document-term matrix via SVD. The key difference is that GloVe uses a weighted objective and operates on a word-word co-occurrence matrix rather than a word-document matrix.

### Why Ratios Matter

The central insight of GloVe is that *ratios* of co-occurrence probabilities, not raw probabilities, are the meaningful quantities. Consider three words: "ice," "steam," and a probe word k.

| k       | P(k\|ice) | P(k\|steam) | Ratio |
|---------|-----------|-------------|-------|
| solid   | 1.9e-4    | 2.2e-5      | 8.9   |
| gas     | 6.6e-5    | 7.8e-4      | 0.085 |
| water   | 3.0e-3    | 2.2e-3      | 1.36  |
| fashion | 1.7e-5    | 1.8e-5      | 0.96  |

The ratio distinguishes related words (large or small ratio) from unrelated ones (ratio near 1). GloVe's objective ensures these ratios are captured by vector differences.

### Training at Scale

The pre-trained GloVe vectors are available in several sizes:
- **6B tokens** (Wikipedia 2014 + Gigaword 5): 50d, 100d, 200d, 300d vectors for 400,000 words.
- **42B tokens** (Common Crawl): 300d vectors for 1.9 million words.
- **840B tokens** (Common Crawl): 300d vectors for 2.2 million words.

Training on 6B tokens takes roughly 25 minutes on 8 CPU threads for 50d vectors and several hours for 300d. The 840B model took approximately 2 days on a large cluster.

## Why It Matters

1. **Unified framework**: GloVe demonstrated that count-based methods (LSA) and prediction-based methods (Word2Vec) are not fundamentally different -- both capture co-occurrence statistics, just with different loss functions.
2. **Reproducibility**: Because GloVe operates on a fixed co-occurrence matrix, training is more reproducible than Word2Vec's stochastic gradient descent over streaming text. The same matrix always yields the same vectors (modulo initialization).
3. **Competitive performance**: On standard word analogy and similarity benchmarks, GloVe matches or exceeds Word2Vec, especially when both use comparable training data.
4. **Widely adopted**: GloVe embeddings became the default initialization for deep learning NLP models from 2014-2018, used in landmark papers on reading comprehension, sentiment analysis, and machine translation.
5. **Interpretability of the objective**: The explicit connection between vector dot products and log co-occurrence counts makes GloVe's mathematical properties easier to analyze than Word2Vec's.

## Key Technical Details

- **Analogy task performance**: GloVe 300d trained on 6B tokens achieves ~75% accuracy on the word analogy task, compared to ~65% for Word2Vec on comparable data. On 42B tokens, GloVe reaches ~82%.
- **Word similarity correlations**: On the WordSim-353 dataset, GloVe 300d achieves a Spearman correlation of 0.75-0.80 with human similarity judgments.
- **Training parameters**: Default settings use 50-100 training iterations, initial learning rate of 0.05 with AdaGrad, and x_max = 100 with alpha = 0.75.
- **Symmetry**: Because the co-occurrence matrix is symmetric, w_i and w'_i (word and context vectors) are interchangeable. The final word vector is typically their sum: w_final = w_i + w'_i, which slightly improves performance.
- **Memory requirements**: The co-occurrence matrix for a 400,000-word vocabulary has up to 160 billion potential entries but is highly sparse. On the 6B corpus, the non-zero entries number approximately 1 billion.

## Common Misconceptions

- **"GloVe is fundamentally different from Word2Vec."** Levy and Goldberg (2014) showed that Word2Vec's Skip-gram with negative sampling implicitly factorizes a shifted PMI matrix. GloVe explicitly factorizes a log co-occurrence matrix. Both are matrix factorization methods operating on co-occurrence statistics -- they differ in the specific matrix and the loss function, not in kind.

- **"GloVe always outperforms Word2Vec."** Performance depends on the specific task, training data, and hyperparameters. On intrinsic evaluation (analogies, similarity), GloVe often has a slight edge with large corpora. On extrinsic tasks (NER, sentiment), the differences are typically within 1%, and the choice often matters less than tuning the downstream model.

- **"GloVe embeddings are context-aware."** Like Word2Vec, GloVe produces a single static vector per word type. The word "bank" gets the same vector whether it appears in "river bank" or "bank account." Contextual embeddings (see `contextual-embeddings.md`) were developed to address this limitation.

## Connections to Other Concepts

- **Word2Vec** (`word2vec.md`): The primary comparison point. GloVe uses global statistics while Word2Vec uses local prediction, but both produce comparable word vectors.
- **TF-IDF** (`tf-idf.md`): GloVe's co-occurrence matrix is related to the term co-occurrence matrices used in distributional semantics, which TF-IDF also builds upon.
- **Document Embeddings** (`document-embeddings.md`): GloVe vectors can be averaged to create simple document representations, or used as input features for more sophisticated document encoders.
- **FastText** (`fasttext.md`): Extends the Word2Vec approach (not GloVe) with subword information, addressing OOV words that GloVe cannot handle.
- **Contextual Embeddings** (`contextual-embeddings.md`): Static embeddings like GloVe motivated the development of contextual models (ELMo, BERT) that produce different representations for each occurrence of a word.
- **Topic Modeling** (`07-information-extraction-and-retrieval/topic-modeling.md`): Both LSA/SVD (a topic modeling input) and GloVe perform dimensionality reduction on co-occurrence matrices, but GloVe operates on word-word co-occurrence while LSA operates on word-document co-occurrence.

## Further Reading

- Pennington et al., "GloVe: Global Vectors for Word Representation" (2014) -- The original paper introducing GloVe, its objective, and extensive empirical evaluation.
- Levy et al., "Improving Distributional Similarity with Lessons Learned from Word Embeddings" (2015) -- Shows that many design choices in Word2Vec and GloVe can be transferred to traditional count-based methods with similar results.
- Levy and Goldberg, "Neural Word Embedding as Implicit Matrix Factorization" (2014) -- Proves that Word2Vec is also doing matrix factorization, connecting it to GloVe's explicit approach.
- Baroni et al., "Don't Count, Predict! A Systematic Comparison of Context-Counting vs. Context-Predicting Semantic Vectors" (2014) -- Comprehensive comparison between count-based (GloVe-family) and prediction-based (Word2Vec-family) methods.
