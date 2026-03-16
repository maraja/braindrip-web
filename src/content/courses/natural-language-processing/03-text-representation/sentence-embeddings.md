# Sentence Embeddings

**One-Line Summary**: Fixed-length vector representations of entire sentences -- from simple word vector averaging to dedicated neural encoders trained for semantic similarity.

**Prerequisites**: Word2Vec (`word2vec.md`), GloVe (`glove.md`), Contextual Embeddings (`contextual-embeddings.md`), Semantics (`01-foundations-of-language/semantics.md`).

## What Is a Sentence Embedding?

Imagine you need to file thousands of sentences into folders based on their meaning. Reading each pair and comparing them manually would take forever. What if you could represent each sentence as a point on a map, where similar sentences cluster together and dissimilar ones are far apart? That is a sentence embedding: a dense vector (typically 256-1024 dimensions) that encodes the meaning of a complete sentence, enabling fast similarity computation via a single dot product.

Sentence embeddings solve a critical problem: word embeddings represent individual words, but most NLP tasks operate on sentences, paragraphs, or documents. You need a way to go from variable-length word sequences to fixed-length vectors that capture the overall meaning.

## How It Works

### Averaging Word Vectors

The simplest approach: average all word vectors in the sentence.

```python
sentence_vec = mean([word2vec[w] for w in sentence.split()])
```

Surprisingly effective for many tasks. SIF (Smooth Inverse Frequency) weighting improves this by downweighting common words (similar to IDF) and removing the first principal component:

```
v_s = (1 / |s|) * sum_{w in s} a / (a + p(w)) * v_w
```

where a is a parameter (typically 10^-3) and p(w) is the word's unigram probability. SIF averages achieve ~75% of supervised sentence embedding performance on STS benchmarks.

### Doc2Vec / Paragraph Vectors

Proposed by Le and Mikolov (2014), Doc2Vec extends Word2Vec by adding a "paragraph ID" vector that is concatenated with word vectors during training. Two variants exist:

- **PV-DM (Distributed Memory)**: Like CBOW but with an additional paragraph vector that acts as memory of the sentence context.
- **PV-DBOW (Distributed Bag of Words)**: Like Skip-gram but predicts random words from the paragraph vector alone.

PV-DBOW is generally preferred for its simplicity and competitive performance.

### InferSent

Developed by Facebook AI Research (Conneau et al., 2017), InferSent trains a BiLSTM encoder on the Stanford Natural Language Inference (SNLI) dataset (570,000 sentence pairs). The key insight: learning to predict entailment, contradiction, and neutrality between sentence pairs forces the encoder to produce semantically meaningful representations.

Architecture: BiLSTM encoder with max-pooling over hidden states, producing 4096-dimensional sentence vectors. These vectors transfer well to downstream tasks including sentiment analysis, question type classification, and paraphrase detection.

### Universal Sentence Encoder (USE)

Released by Google in 2018, USE comes in two variants:

- **Transformer-based**: Higher accuracy, slower. Uses a transformer encoder trained on multiple tasks (skip-thought, conversational response prediction, NLI).
- **DAN (Deep Averaging Network)**: Faster, slightly lower accuracy. Averages word and bigram embeddings then passes through feedforward layers.

Both produce 512-dimensional sentence vectors. The DAN variant encodes ~1000 sentences per second on CPU.

### Sentence-BERT (SBERT)

The current standard for sentence embeddings (Reimers and Gurevych, 2019). SBERT fine-tunes a pre-trained BERT model using a Siamese or triplet network architecture on NLI and STS data:

1. Pass sentence A through BERT, apply mean pooling over token embeddings to get vector u.
2. Pass sentence B through the same BERT, apply mean pooling to get vector v.
3. Train with cosine similarity loss (for STS) or softmax classification (for NLI).

The resulting model produces 768-dimensional sentence vectors that capture semantic meaning far better than using raw BERT [CLS] tokens (which were not trained for this purpose). SBERT achieves a Spearman correlation of ~85% on STS Benchmark, compared to ~70% for averaged GloVe and ~29% for raw BERT [CLS].

### Contrastive Learning Approaches

More recent methods use contrastive learning to train sentence encoders without labeled data:

- **SimCSE** (Gao et al., 2021): Uses dropout as minimal data augmentation -- the same sentence passed through the encoder twice with different dropout masks produces a positive pair. Unsupervised SimCSE achieves ~82% on STS Benchmark.
- **E5** (Wang et al., 2022): Pre-trains on large-scale text pairs from the web, followed by multi-task fine-tuning.
- **GTE** and **BGE**: Competitive open-source sentence embedding models trained with contrastive objectives on curated datasets.

## Why It Matters

1. **Semantic search**: Sentence embeddings enable searching by meaning rather than keyword matching. A query "How to fix a flat tire" can match "Changing a punctured wheel" despite zero word overlap.
2. **Semantic textual similarity (STS)**: Directly computing similarity between sentence pairs is essential for duplicate detection, paraphrase identification, and FAQ matching.
3. **Clustering and topic discovery**: Embedding sentences into a vector space allows k-means or HDBSCAN clustering to discover topics without predefined categories.
4. **Retrieval-Augmented Generation (RAG)**: Sentence and passage embeddings power the retrieval component of RAG systems that provide context to large language models.
5. **Efficiency**: Comparing 10,000 sentence pairs with cross-encoder BERT requires 10,000 forward passes. With sentence embeddings, you encode each sentence once (200 forward passes) and compute 10,000 dot products in milliseconds.

## Key Technical Details

- **STS Benchmark results (Spearman correlation)**: Averaged GloVe ~58%, Averaged BERT ~47% (surprisingly poor), BERT [CLS] ~29%, InferSent ~68%, USE ~74%, SBERT (bert-base) ~85%, SimCSE (unsupervised) ~82%, all-MiniLM-L6-v2 ~82% (6x faster than SBERT-base).
- **Dimensionality**: Common dimensions are 384 (MiniLM), 512 (USE), 768 (SBERT-base), 1024 (SBERT-large). Matryoshka representation learning allows truncating vectors to smaller dimensions with graceful degradation.
- **Speed vs. accuracy trade-off**: all-MiniLM-L6-v2 encodes ~14,000 sentences/sec on GPU vs. ~2,000/sec for SBERT-base, with only ~3% lower STS correlation.
- **Maximum sequence length**: Most sentence embedding models handle up to 256-512 tokens. Longer inputs are truncated, making them unsuitable for full documents (see `document-embeddings.md`).
- **Normalization**: Sentence embedding vectors are typically L2-normalized so that cosine similarity reduces to a dot product, enabling efficient approximate nearest neighbor search.

## Common Misconceptions

- **"BERT's [CLS] token is a good sentence embedding."** Raw BERT [CLS] tokens produce poor sentence representations (29% Spearman on STS). BERT was trained with masked language modeling and next sentence prediction, not semantic similarity. Fine-tuning with a Siamese objective (as in SBERT) is required.

- **"Averaging word vectors is always outperformed by neural encoders."** Weighted averaging (SIF) with good word vectors is competitive with many neural approaches and is orders of magnitude faster. For low-resource scenarios or when labeled data is unavailable, SIF averaging remains a strong baseline.

- **"Sentence embeddings capture everything about a sentence."** Fixed-length vectors inevitably lose information. Negation ("I love this" vs. "I don't love this"), quantification ("all cats" vs. "some cats"), and complex reasoning are often poorly captured. Cross-encoder models that process both sentences jointly are more accurate but much slower.

## Connections to Other Concepts

- `word2vec.md` / **GloVe** (`glove.md`): Averaging these static word vectors is the simplest sentence embedding method and a natural baseline.
- `contextual-embeddings.md`: SBERT and SimCSE fine-tune contextual models (BERT) to produce sentence-level representations.
- `document-embeddings.md`: Extending sentence embedding ideas to longer texts requires handling the sequence length limitation.
- `08-semantic-understanding/semantic-similarity.md`: Sentence embeddings are the primary tool for computing semantic similarity between text pairs.
- `07-information-extraction-and-retrieval/information-retrieval.md`: Dense passage retrieval uses sentence/passage embeddings as an alternative to BM25 for first-stage retrieval.
- `08-semantic-understanding/natural-language-inference.md`: NLI data is used to train many sentence embedding models (InferSent, SBERT).
- `09-pre-trained-models-for-nlp/bert.md`: SBERT is built on BERT, and understanding BERT's architecture is essential for understanding modern sentence embeddings.

## Further Reading

- Le and Mikolov, "Distributed Representations of Sentences and Documents" (2014) -- Introduces Doc2Vec/Paragraph Vectors.
- Conneau et al., "Supervised Learning of Universal Sentence Representations from Natural Language Inference Data" (2017) -- The InferSent paper showing NLI-supervised sentence encoders transfer well.
- Reimers and Gurevych, "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks" (2019) -- Introduces SBERT, the most widely-used sentence embedding approach.
- Gao et al., "SimCSE: Simple Contrastive Learning of Sentence Embeddings" (2021) -- Shows that simple contrastive learning with dropout as augmentation produces strong sentence embeddings.
- Arora et al., "A Simple but Tough-to-Beat Baseline for Sentence Embeddings" (2017) -- The SIF paper demonstrating that weighted averaging of word vectors is surprisingly competitive.
