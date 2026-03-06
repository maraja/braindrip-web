# Semantic Similarity

**One-Line Summary**: Semantic similarity measures the degree of meaning overlap between two linguistic units -- words, sentences, or documents -- providing a graded, continuous score rather than a categorical judgment.

**Prerequisites**: `semantics.md`, `word2vec.md`, `glove.md`, `sentence-embeddings.md`, `contextual-embeddings.md`, `tf-idf.md`.

## What Is Semantic Similarity?

Think of semantic similarity as measuring the "distance" between ideas. The words "car" and "automobile" are near-synonyms and extremely similar. "Car" and "bicycle" are less similar but still related (both are vehicles). "Car" and "democracy" are semantically distant. Semantic similarity quantifies this intuition on a continuous scale, typically normalized to [0, 1] or [0, 5].

Unlike textual entailment, which asks a directional yes/no question ("does A imply B?"), semantic similarity is symmetric and graded. "A dog is playing in the park" and "A puppy is running in a garden" might receive a similarity score of 4.2 out of 5 -- they convey nearly the same idea without one logically entailing the other. This distinction makes semantic similarity a complementary tool to entailment for understanding meaning relationships.

Semantic similarity operates at multiple granularities. **Word-level similarity** asks how related two individual words are. **Sentence-level similarity** compares the overall meaning of two sentences. **Document-level similarity** (covered more thoroughly in `document-similarity.md`) extends this to longer texts. Each level requires different techniques and evaluation frameworks, but the core idea remains the same: map linguistic units to a representation space where distance reflects meaning.

## How It Works

### Word-Level Similarity

**WordNet Path Similarity**

WordNet organizes words into a taxonomy where hypernymy ("is-a") links connect specific concepts to general ones. Path similarity measures semantic closeness as the inverse of the shortest path between two synsets in this taxonomy:

```
path_similarity(s1, s2) = 1 / (1 + shortest_path_length(s1, s2))
```

For example, "dog" and "cat" are both hyponyms of "carnivore" (path length ~3), yielding moderate similarity. "Dog" and "canine" are directly linked (path length 1), yielding high similarity. Limitations include: the taxonomy is incomplete, not all semantic relationships follow hierarchical paths, and path length ignores the density of the taxonomy at different levels.

**Wu-Palmer Similarity** improves on raw path length by incorporating the depth of the least common subsumer (LCS) -- the most specific shared ancestor:

```
wu_palmer(s1, s2) = 2 * depth(LCS) / (depth(s1) + depth(s2))
```

This normalizes for the fact that distinctions deeper in the taxonomy are finer-grained.

**Distributional Similarity**

The distributional hypothesis -- "a word is characterized by the company it keeps" (Firth, 1957) -- underlies all embedding-based similarity. Words appearing in similar contexts have similar meanings. Cosine similarity between word vectors is the standard measure:

```
cosine(u, v) = (u . v) / (||u|| * ||v||)
```

With Word2Vec or GloVe embeddings, this captures both synonymy and broader relatedness. king:queen :: man:woman demonstrates that vector arithmetic preserves semantic relationships. Word2Vec cosine similarities correlate with human judgments at approximately 0.65-0.75 Spearman's rho on benchmarks like WordSim-353 and SimLex-999.

**SimLex-999 vs. WordSim-353**: A critical distinction in evaluation is similarity vs. relatedness. "Coffee" and "cup" are highly related but not similar (they are different kinds of things). WordSim-353 conflates these; SimLex-999 (Hill et al., 2015) specifically targets genuine similarity, providing a cleaner benchmark. Human inter-annotator agreement on SimLex-999 is approximately 0.67 Spearman correlation, setting a practical ceiling.

### Sentence-Level Similarity

**The STS Benchmark**

The Semantic Textual Similarity (STS) Benchmark (Cer et al., 2017) is the standard evaluation for sentence-level similarity. It contains 8,628 sentence pairs drawn from image captions, news headlines, and forum posts, each annotated with a human similarity score from 0 (completely different) to 5 (semantically equivalent). The benchmark is split into train (5,749), development (1,500), and test (1,379) pairs.

Evaluation uses Pearson and Spearman correlation between system scores and human judgments. Pearson measures linear correlation; Spearman measures rank correlation. Both are reported, but Spearman is typically considered more robust for ordinal similarity judgments.

**Baseline Approaches**

Simple approaches provide surprisingly competitive baselines:

- **Word overlap (Jaccard similarity)**: |A intersection B| / |A union B|, where A and B are the word sets of two sentences. Achieves approximately 0.60 Spearman on STS-B.
- **Averaged word embeddings**: Averaging GloVe vectors for all words in a sentence and computing cosine similarity. Achieves approximately 0.58 Spearman on STS-B.
- **TF-IDF weighted averaging**: Weighting word vectors by their IDF scores before averaging improves over uniform averaging to approximately 0.65 Spearman.
- **Smooth inverse frequency (SIF)**: Arora et al. (2017) showed that weighting by a/(a + p(w)), where p(w) is word frequency and a is a parameter, followed by removing the first principal component, achieves approximately 0.72 Spearman -- remarkably strong for its simplicity.

**Neural Sentence Encoders**

Dedicated sentence encoders learn representations optimized for similarity:

- **InferSent** (Conneau et al., 2017): BiLSTM trained on SNLI data, achieving approximately 0.76 Spearman on STS-B.
- **Universal Sentence Encoder** (Cer et al., 2018): Transformer or DAN architecture trained on diverse tasks, achieving approximately 0.78 Spearman.
- **SBERT (Sentence-BERT)** (Reimers and Gurevych, 2019): Fine-tunes BERT using siamese and triplet networks on NLI and STS data. SBERT achieves approximately 0.85 Spearman on STS-B while producing fixed-size sentence embeddings that enable efficient cosine similarity search. This was a major breakthrough because raw BERT requires feeding both sentences through the model simultaneously (O(n^2) for comparing n sentences), while SBERT encodes each sentence independently (O(n) for computing embeddings, then O(n^2) cosine comparisons are trivial).
- **SimCSE** (Gao et al., 2021): Contrastive learning framework achieving approximately 0.86 Spearman on STS-B. The unsupervised variant uses dropout as data augmentation, while the supervised variant uses NLI data.

### Evaluation Metrics

**Pearson Correlation (r)**: Measures linear association between predicted and gold similarity scores. Sensitive to the actual scale of predictions. A model that perfectly ranks pairs but uses a different scale will get penalized.

**Spearman Correlation (rho)**: Measures monotonic association based on ranks only. More robust to non-linear relationships between predicted and gold scores. If a model correctly identifies that pair A is more similar than pair B for all pairs, Spearman will be perfect regardless of absolute scores.

Both metrics range from -1 to +1, with +1 indicating perfect positive correlation. For STS evaluation, models typically report both, with Spearman being the more widely cited metric.

### The Role of Sentence Embeddings

The evolution of sentence similarity is closely tied to the evolution of sentence embeddings (see `sentence-embeddings.md`). The key insight from SBERT and subsequent work is that pre-trained models like BERT are excellent at computing similarity when given a pair, but producing standalone sentence embeddings requires fine-tuning with appropriate objectives (contrastive loss, triplet loss, or multiple negatives ranking loss). Modern sentence embedding models like E5, GTE, and text-embedding-3 from OpenAI achieve Spearman correlations above 0.86 on STS-B while supporting efficient nearest-neighbor retrieval.

## Why It Matters

1. **Information retrieval**: Semantic similarity powers dense retrieval systems, matching queries to documents by meaning rather than keyword overlap (see `information-retrieval.md`).
2. **Duplicate detection**: Identifying duplicate questions (e.g., on StackOverflow or Quora), near-duplicate documents, or paraphrased content relies on sentence-level similarity.
3. **Clustering and topic discovery**: Grouping semantically similar texts enables automatic topic organization and content recommendation.
4. **Machine translation evaluation**: Metrics like BERTScore use semantic similarity between translation and reference, improving over surface-level metrics like BLEU (see `evaluation-metrics-for-nlp.md`).
5. **Retrieval-augmented generation**: RAG systems use semantic similarity to find relevant passages for grounding LLM responses, directly impacting factual accuracy.

## Key Technical Details

- STS Benchmark contains 8,628 sentence pairs scored on a 0-5 scale across three domains (captions, news, forums).
- SBERT achieves approximately 0.85 Spearman correlation on STS-B, a dramatic improvement over averaged GloVe (approximately 0.58) and raw BERT CLS token (approximately 0.20 -- notably poor without fine-tuning).
- SimCSE achieves approximately 0.86 Spearman on STS-B using contrastive learning with NLI supervision.
- Human inter-annotator agreement on STS-B is approximately 0.83 Spearman, meaning current models approach the human ceiling.
- WordSim-353 contains 353 word pairs rated on a 0-10 scale; SimLex-999 contains 999 pairs specifically targeting similarity rather than relatedness.
- SIF (smooth inverse frequency) averaging achieves approximately 0.72 Spearman on STS-B with no training -- a remarkably strong unsupervised baseline.
- Computing pairwise similarity for 10,000 sentences using BERT cross-encoding takes approximately 65 million forward passes; SBERT reduces this to 10,000 forward passes plus trivial cosine computations.

## Common Misconceptions

**"Semantic similarity and semantic relatedness are the same thing."**
Similarity measures how much two words are alike (synonymy, near-synonymy). Relatedness is broader, capturing any semantic connection including part-whole, cause-effect, or functional association. "Coffee" and "mug" are highly related but not semantically similar. Benchmarks differ in which they measure: WordSim-353 captures relatedness; SimLex-999 targets similarity.

**"Cosine similarity between BERT [CLS] tokens gives good sentence similarity."**
Without fine-tuning, BERT's [CLS] token produces sentence representations that correlate poorly with human similarity judgments -- approximately 0.20 Spearman on STS-B, worse than averaged GloVe vectors. BERT must be fine-tuned with appropriate objectives (e.g., siamese networks on NLI data) to produce useful sentence embeddings.

**"Higher-dimensional embeddings always give better similarity estimates."**
Embedding dimensionality interacts with training data size and model capacity. Increasing dimensions beyond what the data supports leads to overfitting and sparser representations. Empirically, 768-dimensional SBERT embeddings outperform 300-dimensional GloVe, but gains diminish well before reaching thousands of dimensions.

**"Semantic similarity is symmetric, so it captures all meaning relationships."**
Symmetry is a feature but also a limitation. "A dog is an animal" and "An animal is a dog" have identical similarity scores, but the entailment relationship is asymmetric. For directional semantic relationships, entailment or inference tasks are needed (see `textual-entailment.md`).

## Connections to Other Concepts

- `sentence-embeddings.md` covers the representation methods that underpin modern sentence similarity computation.
- `word2vec.md` and `glove.md` provide the word-level embeddings used in distributional similarity and as building blocks for sentence representations.
- `contextual-embeddings.md` explains why BERT-family models produce context-sensitive representations that improve over static embeddings.
- `textual-entailment.md` and `natural-language-inference.md` provide directional semantic inference that complements symmetric similarity.
- `information-retrieval.md` and `document-similarity.md` apply semantic similarity at the document retrieval scale.
- `evaluation-metrics-for-nlp.md` covers BERTScore and other similarity-based evaluation metrics.
- `paraphrase-generation.md` both depends on and produces training data for semantic similarity models.
- `word-sense-disambiguation.md` is needed when polysemous words distort similarity estimates (a single static vector for "bank" conflates financial and river senses).

## Further Reading

- Cer, D. et al., "SemEval-2017 Task 1: Semantic Textual Similarity Multilingual and Cross-lingual Focused Evaluation," 2017 -- Establishes the STS Benchmark and evaluation methodology.
- Reimers, N. and Gurevych, I., "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks," 2019 -- The breakthrough making BERT practical for sentence similarity via siamese fine-tuning.
- Gao, T., Yao, X., and Chen, D., "SimCSE: Simple Contrastive Learning of Sentence Embeddings," 2021 -- Contrastive learning framework achieving state-of-the-art sentence similarity with elegant simplicity.
- Arora, S., Liang, Y., and Ma, T., "A Simple but Tough-to-Beat Baseline for Sentence Embeddings," 2017 -- SIF weighted averaging providing a remarkably strong unsupervised baseline.
- Hill, F., Reichart, R., and Korhonen, A., "SimLex-999: Evaluating Semantic Models With (Genuine) Similarity Estimation," 2015 -- Benchmark distinguishing similarity from relatedness.
- Agirre, E. et al., "A Study on Similarity and Relatedness Using Distributional and WordNet-Based Approaches," 2009 -- Systematic comparison of knowledge-based and distributional similarity methods.
