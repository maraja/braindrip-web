# FastText

**One-Line Summary**: Subword-aware embeddings that represent each word as the sum of its character n-gram vectors, gracefully handling morphology and out-of-vocabulary words.

**Prerequisites**: Word2Vec (`word2vec.md`), Morphology (`01-foundations-of-language/morphology.md`), Tokenization (`02-text-preprocessing/tokenization-in-nlp.md`).

## What Is FastText?

Imagine you encounter the word "unfriendliness" for the first time. Even without having seen it before, you can parse its meaning: "un-" (negation) + "friend" (the root) + "-li" + "-ness" (noun-forming suffix). You decompose the word into familiar parts. FastText does the same thing -- instead of treating each word as an atomic unit (as Word2Vec and GloVe do), it represents every word as a collection of character n-grams and sums their vectors to produce the word's embedding.

Developed by Facebook AI Research (Bojanowski, Grave, Joulin, and Mikolov) in 2017, FastText extends the Word2Vec Skip-gram model by enriching it with subword information. This seemingly simple change addresses two major limitations of standard word embeddings: inability to handle out-of-vocabulary (OOV) words and insensitivity to morphological structure.

## How It Works

### Character N-Gram Representation

Each word is augmented with special boundary markers "<" and ">", then decomposed into character n-grams of sizes 3 to 6 (by default). For example, the word "where" becomes:

```
<where> -> {<wh, whe, her, ere, re>, <whe, wher, here, ere>, <wher, where, here>, <where, where>}
```

Plus the word itself as a special token. In practice, FastText typically generates 3-grams through 6-grams. The word "where" produces character n-grams like: <wh, whe, her, ere, re>, wher, here, ere>, and so on.

### Embedding Computation

The vector for a word w is the sum of its constituent n-gram vectors:

```
v_w = z_w + sum_{g in G(w)} z_g
```

where z_w is the vector for the whole word (if in vocabulary), G(w) is the set of character n-grams of w, and z_g is the embedding vector for n-gram g. This summation is what allows FastText to construct embeddings for words it has never seen during training.

### Training Objective

FastText uses the same Skip-gram objective as Word2Vec, but with the enriched word representation. For a target-context pair (w_t, w_c):

```
score(w_t, w_c) = sum_{g in G(w_t)} z_g^T * v_{w_c}
```

The model is trained with negative sampling, identical to Word2Vec's approach.

### Handling OOV Words

When encountering a word not in the training vocabulary, FastText computes its embedding by summing the vectors of its character n-grams -- which were learned during training from many different words. The word "transformerized" may never appear in training, but its n-grams (trans, ransf, ansfo, form, former, ...) were learned from words like "transform," "former," and "organized."

### FastText for Text Classification

Beyond embeddings, the fastText library includes a text classification model that is remarkably fast and accurate:

```
import fasttext
model = fasttext.train_supervised('train.txt', epoch=25, lr=1.0, wordNgrams=2)
result = model.test('test.txt')
```

The classifier averages word (and n-gram) embeddings for the input text and feeds them through a linear classifier. On the AG News dataset, fastText achieves ~92% accuracy -- within 1-2% of deep learning models -- while training in under 10 seconds on a single CPU.

## Why It Matters

1. **OOV robustness**: In production NLP systems, encountering unknown words is inevitable -- misspellings, neologisms, technical jargon, and morphological variants. FastText handles these gracefully instead of falling back to a generic "unknown" vector.
2. **Morphologically rich languages**: For languages like Finnish, Turkish, Hungarian, and Arabic, where a single root can generate thousands of surface forms, FastText dramatically outperforms Word2Vec. Turkish has an estimated 2+ million word forms from roughly 50,000 roots -- word-level embeddings cannot cover this.
3. **Training efficiency**: The fastText library is written in optimized C++ and can train embeddings on a billion-word corpus in under 10 minutes on a multicore CPU, without requiring GPUs.
4. **Classification at scale**: The fastText classifier processes millions of examples per second, making it suitable for production classification where latency matters.
5. **Pre-trained vectors for 157 languages**: Facebook released pre-trained FastText vectors for 157 languages trained on Common Crawl and Wikipedia, providing ready-to-use embeddings for low-resource languages.

## Key Technical Details

- **N-gram range**: Default character n-gram sizes are 3 to 6. Shorter n-grams (2-3) capture common prefixes and suffixes; longer ones (5-6) capture word stems. The total number of unique character n-grams is bounded using a hashing trick with a default bucket size of 2 million.
- **Vocabulary and n-gram count**: A typical training run with 1 million unique words and 2 million n-gram buckets yields roughly 3 million vectors to learn.
- **Performance on morphological analogy**: On German, French, and Spanish morphological analogy tasks, FastText outperforms Word2Vec by 10-25% absolute accuracy.
- **Word similarity benchmarks**: On English word similarity tasks (WS-353, SimLex-999), FastText performs comparably to Word2Vec and GloVe. The advantage appears primarily on morphological and OOV-heavy evaluations.
- **Model size**: A 300-dimensional FastText model with 2 million n-gram buckets occupies roughly 2-4 GB uncompressed. Quantized models reduce this to 300-500 MB with minimal accuracy loss.
- **Comparison to BPE tokenizers**: Modern subword tokenization (BPE, as used in `02-text-preprocessing/tokenization-in-nlp.md`) addresses OOV at the tokenization level. FastText addresses it at the embedding level. The approaches are complementary.

## Common Misconceptions

- **"FastText is just Word2Vec with character n-grams."** While architecturally similar, the subword enrichment fundamentally changes the model's behavior. FastText shares parameters across morphologically related words, enabling generalization that Word2Vec cannot achieve. A Word2Vec model that has seen "teach" and "teacher" treats them as independent; FastText recognizes their shared substructure.

- **"FastText always outperforms Word2Vec."** On English benchmarks with full vocabulary coverage (no OOV words), Word2Vec and FastText perform comparably. FastText's advantage is most pronounced when OOV words are common, the language is morphologically rich, or the training corpus is small relative to the vocabulary.

- **"Character n-grams capture true morphology."** FastText's n-grams are a statistical approximation of morphology, not a linguistic analysis. The n-grams "tion" and "sion" happen to correspond to real suffixes, but "atio" (from "nation") does not. FastText works because useful morphological substrings are statistically prominent, not because it performs morphological parsing.

## Connections to Other Concepts

- **Word2Vec** (`word2vec.md`): FastText extends Word2Vec's Skip-gram with subword information. Understanding Word2Vec is essential background.
- **GloVe** (`glove.md`): Unlike FastText, GloVe has no subword mechanism. GloVe and FastText represent different design choices: global co-occurrence statistics vs. subword-enriched prediction.
- **Morphology** (`01-foundations-of-language/morphology.md`): FastText's character n-grams implicitly capture morphological patterns -- prefixes, suffixes, and stems -- without explicit linguistic analysis.
- **Tokenization** (`02-text-preprocessing/tokenization-in-nlp.md`): FastText's subword approach relates to BPE and WordPiece tokenization, which also decompose words into subword units, though at the tokenization stage rather than the embedding stage.
- **Text Classification** (`05-core-nlp-tasks-analysis/text-classification.md`): The fastText classifier is a widely-used baseline for text classification, especially when training speed and simplicity are priorities.
- **Multilingual NLP** (`10-multilingual-and-low-resource-nlp/multilingual-nlp.md`): Pre-trained FastText vectors for 157 languages provide a starting point for multilingual and low-resource NLP.
- **Stemming and Lemmatization** (`02-text-preprocessing/stemming-and-lemmatization.md`): FastText reduces the need for explicit stemming because morphological variants naturally share subword vectors.

## Further Reading

- Bojanowski et al., "Enriching Word Vectors with Subword Information" (2017) -- The original FastText embeddings paper introducing character n-gram enrichment of Skip-gram.
- Joulin et al., "Bag of Tricks for Efficient Text Classification" (2017) -- Introduces the fastText text classification model that achieves near-state-of-the-art accuracy with extreme speed.
- Grave et al., "Learning Word Vectors for 157 Languages" (2018) -- Describes the pre-trained FastText vectors released for 157 languages trained on Common Crawl.
- Mikolov et al., "Advances in Pre-Training Distributed Word Representations" (2018) -- Discusses refinements to FastText including position-dependent weighting and improved training procedures.
