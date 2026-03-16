# Bag of Words

**One-Line Summary**: Representing text as unordered word frequency vectors -- simple, interpretable, and surprisingly effective for many classification and retrieval tasks.

**Prerequisites**: Tokenization (`02-text-preprocessing/tokenization-in-nlp.md`), Stopword Removal (`02-text-preprocessing/stopword-removal.md`), Text as Data (`01-foundations-of-language/text-as-data.md`).

## What Is Bag of Words?

Imagine dumping every word from a book into a bag, shaking it up, and counting how many times each word appears. You lose all information about word order -- "dog bites man" and "man bites dog" become identical -- but you retain a surprisingly useful fingerprint of what the text is *about*. That is the Bag of Words (BoW) model.

Formally, BoW represents a document as a vector in R^|V|, where |V| is the vocabulary size. Each dimension corresponds to one word in the vocabulary, and the value at that dimension indicates the word's presence or frequency in the document. Despite discarding syntax and word order, this representation powered the majority of text classification and information retrieval systems from the 1960s through the early 2010s.

## How It Works

### Vocabulary Construction

First, build a vocabulary V = {w_1, w_2, ..., w_|V|} from the entire corpus. Typical steps include lowercasing, removing punctuation, applying stopword removal, and optionally stemming or lemmatizing. Vocabulary sizes range from a few thousand (after aggressive filtering) to hundreds of thousands for large corpora.

### Document-Term Matrix

Given a corpus of N documents and vocabulary size |V|, the result is an N x |V| matrix where entry (i, j) encodes how document i relates to word j. Three common encoding schemes exist:

- **Binary BoW**: 1 if word is present, 0 otherwise. Ignores frequency entirely.
- **Count BoW (raw term frequency)**: The integer count of each word in the document. "the" appearing 12 times gets value 12.
- **Normalized BoW**: Counts divided by document length, producing relative frequencies that sum to 1. This prevents longer documents from dominating simply because they contain more words.

### Example

Given two documents:
- D1: "the cat sat on the mat"
- D2: "the dog sat on the log"

Vocabulary: {cat, dog, log, mat, on, sat, the}

Count vectors:
- D1: [1, 0, 0, 1, 1, 1, 2]
- D2: [0, 1, 1, 0, 1, 1, 2]

### N-Gram Extension

Instead of single words (unigrams), BoW can use n-grams as features. Bigram BoW adds pairs like "cat_sat" and "sat_on" to the vocabulary, partially recovering local word order. In practice, unigrams + bigrams is a common choice, though the vocabulary grows quadratically: a 50,000-word vocabulary produces up to 2.5 billion possible bigrams, requiring aggressive pruning by minimum document frequency.

### Use in Classifiers

BoW vectors feed directly into classical machine learning models:

- **Naive Bayes**: Assumes feature independence -- each word contributes independently to the class probability. Multinomial Naive Bayes uses count BoW; Bernoulli Naive Bayes uses binary BoW.
- **Support Vector Machines (SVMs)**: Linear SVMs on BoW features were state-of-the-art for text classification through the mid-2010s. Wang and Manning (2012) showed that Naive Bayes + SVM hybrids on bigram BoW matched early neural approaches on sentiment classification.
- **Logistic Regression**: Often competitive with SVMs and easier to interpret through learned feature weights.

## Why It Matters

1. **Simplicity and interpretability**: BoW is fully transparent -- you can inspect which words drive a prediction by examining feature weights.
2. **Computational efficiency**: Sparse matrix operations make BoW feasible for corpora with millions of documents.
3. **Strong baselines**: On many text classification benchmarks, well-tuned BoW + SVM remains competitive with neural approaches, especially with limited training data.
4. **Foundation for TF-IDF**: BoW provides the raw term frequency component that `tf-idf.md` builds upon with inverse document frequency weighting.
5. **Feature engineering starting point**: Many practical NLP pipelines begin with BoW features before deciding whether the complexity of embeddings is warranted.

## Key Technical Details

- **Sparsity**: A typical BoW vector is over 99% zeros. A vocabulary of 100,000 words means each document vector has 100,000 dimensions, but an average document might use only 200-500 unique words.
- **Storage**: Sparse matrix formats (CSR, CSC) reduce storage from O(N x |V|) to O(nnz), where nnz is the number of non-zero entries.
- **Vocabulary pruning**: Removing words appearing in fewer than 2-5 documents (min_df) and more than 80-95% of documents (max_df) typically reduces vocabulary by 50-80% with minimal performance loss.
- **scikit-learn implementation**: `CountVectorizer` builds the document-term matrix with configurable tokenization, n-gram range, and frequency thresholds in a single API call.
- **Zipf's law**: A small number of words dominate counts (the top 100 words account for roughly 50% of all tokens in English), which motivates stopword removal and TF-IDF reweighting.

## Common Misconceptions

- **"BoW is obsolete because of word embeddings."** BoW remains the right choice in many scenarios -- small datasets, high-dimensional sparse features for linear classifiers, interpretability requirements, and as a feature in ensemble systems. Practitioners should benchmark BoW before assuming neural embeddings will outperform it.

- **"BoW captures no meaning at all."** While BoW discards word order, the distribution of words still carries substantial semantic signal. Two documents about "machine learning" will share vocabulary even without order. The distributional hypothesis that underlies embeddings is, in a sense, a refined extension of this same observation.

- **"Larger vocabularies always improve BoW performance."** Beyond a certain point, rare words add noise rather than signal. Aggressive vocabulary pruning (keeping 10,000-50,000 features) often outperforms using the full vocabulary, particularly on smaller datasets.

## Connections to Other Concepts

- `tf-idf.md`: Extends raw BoW counts with inverse document frequency weighting to downweight common words and upweight discriminative ones.
- `n-gram-language-models.md`: While BoW discards order entirely, n-gram models make it central -- predicting each word from the previous n-1 words.
- `word2vec.md`: Dense embeddings emerged as a response to BoW's sparsity and inability to capture semantic similarity -- "happy" and "joyful" are orthogonal in BoW but nearby in Word2Vec space.
- `05-core-nlp-tasks-analysis/text-classification.md`: BoW remains a go-to representation for classification tasks, especially as a baseline.
- `07-information-extraction-and-retrieval/information-retrieval.md`: BoW underpins classical retrieval models like the vector space model.
- `07-information-extraction-and-retrieval/topic-modeling.md`: LDA and related models operate directly on BoW representations to discover latent themes.
- `02-text-preprocessing/tokenization-in-nlp.md`: The quality of BoW features depends entirely on how text is tokenized.

## Further Reading

- Salton et al., "A Vector Space Model for Automatic Indexing" (1975) -- The foundational paper introducing the vector space model that BoW operationalizes.
- Wang and Manning, "Baselines and Bigrams: Simple, Good Sentiment and Topic Classification" (2012) -- Demonstrates that Naive Bayes + SVM on bigram BoW features rivals neural approaches for text classification.
- Joachims, "Text Categorization with Support Vector Machines" (1998) -- Established SVMs on BoW features as the standard for text categorization.
- Manning et al., "Introduction to Information Retrieval" (2008) -- Chapters 1-6 provide comprehensive coverage of the BoW model and its role in retrieval.
