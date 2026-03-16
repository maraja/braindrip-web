# N-Gram Language Models

**One-Line Summary**: Predicting the next word from the previous N-1 words using maximum likelihood estimation -- the statistical foundation of language modeling.

**Prerequisites**: Bag of Words (`bag-of-words.md`), Tokenization (`02-text-preprocessing/tokenization-in-nlp.md`), Text as Data (`01-foundations-of-language/text-as-data.md`).

## What Is an N-Gram Language Model?

Imagine you are texting and your phone suggests the next word. If you have typed "New York," it might suggest "City" or "Times." The phone is not understanding language -- it is recalling which words have historically followed "New York" in a large corpus of text. That is an n-gram language model: it estimates the probability of each next word based on the preceding n-1 words.

Formally, a language model assigns a probability P(w_1, w_2, ..., w_m) to a sequence of words. By the chain rule, this factors into:

```
P(w_1, ..., w_m) = P(w_1) * P(w_2|w_1) * P(w_3|w_1,w_2) * ... * P(w_m|w_1,...,w_{m-1})
```

The n-gram approximation applies the Markov assumption: the probability of each word depends only on the preceding n-1 words, not the entire history. A bigram model (n=2) uses one word of context, a trigram (n=3) uses two, and so on.

## How It Works

### Maximum Likelihood Estimation

The probability of a word given its context is estimated by counting:

```
P(w_n | w_{n-1}) = count(w_{n-1}, w_n) / count(w_{n-1})     [bigram]
P(w_n | w_{n-2}, w_{n-1}) = count(w_{n-2}, w_{n-1}, w_n) / count(w_{n-2}, w_{n-1})   [trigram]
```

For example, if "New York" appears 5,000 times in a corpus and "New York City" appears 2,000 times, then P("City" | "New York") = 2000/5000 = 0.4.

### The Data Sparsity Problem

As n increases, the number of possible n-grams grows as |V|^n. With a vocabulary of 50,000 words, there are 2.5 billion possible bigrams and 125 trillion possible trigrams. Most of these will never appear in training data, leading to zero probability estimates for perfectly valid word sequences. This is the fundamental limitation that drives the need for smoothing.

### Smoothing Techniques

**Laplace (Add-1) Smoothing**: Add 1 to every n-gram count:

```
P_Laplace(w_n | w_{n-1}) = (count(w_{n-1}, w_n) + 1) / (count(w_{n-1}) + |V|)
```

Simple but crude -- it steals too much probability mass from observed events and distributes it evenly to unobserved ones.

**Add-k Smoothing**: A refinement using a fractional k (typically 0.01-0.5) instead of 1.

**Kneser-Ney Smoothing**: The gold standard for n-gram smoothing. Instead of simple backoff, it uses the *continuation probability* -- how many different contexts a word appears in -- as the lower-order distribution. A word like "Francisco" has high unigram frequency but appears almost exclusively after "San," so its continuation probability is low. Kneser-Ney captures this:

```
P_KN(w_i | w_{i-1}) = max(count(w_{i-1}, w_i) - d, 0) / count(w_{i-1}) + lambda(w_{i-1}) * P_continuation(w_i)
```

where d is a discount (typically 0.75) and lambda is a normalizing constant.

**Interpolation**: Combines estimates from different orders. Jelinek-Mercer interpolation:

```
P(w_n | w_{n-2}, w_{n-1}) = lambda_3 * P_ML(w_n | w_{n-2}, w_{n-1}) + lambda_2 * P_ML(w_n | w_{n-1}) + lambda_1 * P_ML(w_n)
```

where lambda values sum to 1 and are optimized on held-out data.

### Perplexity

The standard evaluation metric for language models. Perplexity is the inverse probability of the test set, normalized by the number of words:

```
PP(W) = P(w_1, w_2, ..., w_N)^{-1/N}
```

Lower perplexity means the model assigns higher probability to the test data. Intuition: a perplexity of 100 means the model is, on average, as uncertain as if it were choosing uniformly among 100 words at each step.

Typical perplexities on the Penn Treebank: unigram ~960, bigram ~170, trigram ~110, 5-gram with Kneser-Ney ~70. Neural language models achieve ~55-65 on the same benchmark.

## Why It Matters

1. **Foundation of language modeling**: N-gram models established the core task -- predicting the next word -- that all modern language models (LSTMs, Transformers, GPT) still perform.
2. **Speech recognition**: N-gram language models remain part of production ASR systems as rescoring components, constraining decoder output to likely word sequences.
3. **Spelling correction and autocomplete**: Most keyboard suggestion systems still use n-gram statistics, often combined with neural models.
4. **Machine translation**: Statistical MT systems (pre-neural) relied heavily on n-gram language models for fluency scoring.
5. **Baseline for neural models**: N-gram perplexity serves as the benchmark against which neural language models demonstrate improvement.

## Key Technical Details

- **Common orders**: Bigrams and trigrams are most common in practice. 4-grams and 5-grams are used in speech recognition with massive corpora. Beyond 5-grams, data sparsity makes estimation unreliable even with smoothing.
- **Storage**: Google's 1T Web n-gram corpus (2006) contains 1 trillion tokens, 13 million unique words, 314 million bigrams, and 977 million trigrams. Storage requires compact trie structures or hash tables.
- **Training data requirements**: Rough guideline: reliable trigram estimates need at least 1 million tokens; 5-grams need 100 million+ tokens.
- **Backoff vs. interpolation**: Backoff uses lower-order models only when higher-order counts are zero. Interpolation always combines all orders. Modified Kneser-Ney with interpolation consistently outperforms backoff variants.
- **Start and end tokens**: Special tokens <s> and </s> are added to mark sentence boundaries, allowing the model to learn which words likely begin and end sentences.

## Common Misconceptions

- **"N-gram models understand language."** They capture statistical regularities only. An n-gram model may assign high probability to "colorless green ideas sleep furiously" if trained on a linguistics corpus where Chomsky's example appears, without any notion that the sentence is semantically anomalous.

- **"Larger n always improves the model."** Increasing n beyond the data can support leads to worse generalization. A 5-gram model trained on 1 million tokens will severely overfit, assigning zero probability to most test sequences. The optimal n depends on training corpus size.

- **"N-gram models are obsolete."** While neural language models surpass n-grams in perplexity and generation quality, n-gram models remain in production for low-latency applications (keyboard prediction, ASR decoding), on-device deployment where model size is constrained, and as interpolation components in hybrid systems.

## Connections to Other Concepts

- `bag-of-words.md`: BoW is essentially a unigram model that discards order. N-gram models restore local word order through the Markov assumption.
- `word2vec.md`: Word2Vec's CBOW model can be seen as a neural n-gram model that predicts the center word from a context window, but with shared dense representations instead of discrete counts.
- `04-sequence-models/recurrent-neural-networks.md`: RNNs remove the fixed-context limitation of n-grams, conditioning on the entire history through a hidden state vector.
- `06-core-nlp-tasks-generation/text-generation.md`: N-gram models were the first text generation systems, sampling words sequentially from the conditional distributions.
- `11-speech-and-multimodal-nlp/automatic-speech-recognition.md`: N-gram language models constrain ASR decoder output to fluent word sequences.
- `01-foundations-of-language/morphology.md`: Character-level n-grams (used in `fasttext.md`) capture morphological patterns that word-level n-grams miss.

## Further Reading

- Shannon, "A Mathematical Theory of Communication" (1948) -- Introduced the concept of entropy and language modeling that n-gram models operationalize.
- Kneser and Ney, "Improved Backing-Off for M-Gram Language Modeling" (1995) -- Presents Kneser-Ney smoothing, still the best-performing smoothing technique for n-grams.
- Chen and Goodman, "An Empirical Study of Smoothing Techniques for Language Modeling" (1999) -- Comprehensive comparison of smoothing methods establishing modified Kneser-Ney as the standard.
- Jurafsky and Martin, "Speech and Language Processing" (3rd edition) -- Chapters 3-4 provide an accessible and thorough treatment of n-gram language models.
