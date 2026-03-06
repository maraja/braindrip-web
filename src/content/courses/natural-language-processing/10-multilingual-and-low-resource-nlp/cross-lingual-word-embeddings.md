# Cross-Lingual Word Embeddings

**One-Line Summary**: Aligning word vector spaces from different languages into a shared space so that "cat" in English and "gato" in Spanish occupy nearby points -- enabling cross-lingual transfer without parallel corpora.

**Prerequisites**: `word2vec.md`, `glove.md`, `fasttext.md`, `sentence-embeddings.md`

## What Is Cross-Lingual Word Embeddings?

Imagine two cities that evolved independently, each with its own street grid, naming conventions, and landmarks. Now imagine you discover that both cities have the same underlying geography -- the same rivers, hills, and coastline. If you could rotate and scale one city's map to overlay the other's, the landmarks would align: the hospital in City A falls on top of the hospital in City B, the park overlaps with the park. Cross-lingual word embeddings do exactly this with language: they rotate and transform monolingual word vector spaces so that words with similar meanings across languages end up in the same region of a shared space.

More formally, given monolingual embedding spaces X (source language) and Y (target language), cross-lingual word embedding methods learn a mapping W such that WX approximates Y for translation pairs. Once aligned, the shared space supports bilingual dictionary induction (finding translations by nearest-neighbor search), cross-lingual information retrieval, and zero-shot transfer of NLP models trained in one language to another.

This approach was the dominant paradigm for cross-lingual NLP before `multilingual-transformers.md` models like mBERT and XLM-R, and it remains valuable for languages not covered by large multilingual models.

## How It Works

### Supervised Alignment: The Linear Mapping Approach

Mikolov et al. (2013) made the foundational observation that monolingual word embedding spaces exhibit similar geometric structures across languages. They proposed learning a linear mapping W from source to target space using a seed bilingual dictionary of n word pairs {(x_i, y_i)}:

```
minimize ||WX - Y||_F^2
```

where X is the d x n matrix of source embeddings and Y is the corresponding target embeddings for the dictionary entries, and ||.||_F is the Frobenius norm.

This is a simple least-squares regression, solvable in closed form:

```
W = YX^T (XX^T)^{-1}
```

With just 5,000 translation pairs as supervision, this approach achieves surprisingly strong results, reaching 30--40% precision@1 on bilingual lexicon induction for European language pairs.

### The Procrustes Solution

Xing et al. (2015) and Smith et al. (2017) showed that constraining W to be orthogonal (preserving distances within each language's space) significantly improves alignment quality. The optimization becomes the orthogonal Procrustes problem:

```
minimize ||WX - Y||_F^2   subject to W^T W = I
```

This has the elegant closed-form solution:

```
W = UV^T   where U Sigma V^T = SVD(YX^T)
```

The orthogonality constraint ensures the mapping is a pure rotation (plus optional reflection), preventing the distortion of within-language relationships. This single change improved precision@1 by 5--10 percentage points on standard benchmarks.

### Unsupervised Alignment: MUSE

Conneau et al. (2018) demonstrated that cross-lingual alignment is possible without any bilingual dictionary at all. Their MUSE (Multilingual Unsupervised and Supervised Embeddings) system uses adversarial training:

1. **Adversarial step**: Train a discriminator D to distinguish between WX_s (mapped source embeddings) and Y_t (target embeddings). Simultaneously train the mapping W to fool D. This produces a rough initial alignment.
2. **Procrustes refinement**: Use the rough alignment to induce a synthetic dictionary (mutual nearest neighbors), then apply the Procrustes solution iteratively.
3. **CSLS retrieval**: Replace standard nearest-neighbor retrieval with Cross-Domain Similarity Local Scaling, which penalizes "hub" vectors that are spuriously close to many points:

```
CSLS(Wx_s, y_t) = 2*cos(Wx_s, y_t) - r_T(Wx_s) - r_S(y_t)
```

where r_T(Wx_s) is the mean cosine similarity of Wx_s to its K nearest target neighbors. CSLS alone improves retrieval precision by 3--5 points over standard cosine similarity.

### Evaluation: Bilingual Lexicon Induction (BLI)

The standard evaluation task is bilingual lexicon induction: given a source word, retrieve its translation from the target embedding space by nearest-neighbor search. The MUSE benchmark covers 30 language pairs with ground-truth dictionaries.

Typical precision@1 scores:
- **Supervised (5K pairs)**: English-French 82%, English-German 75%, English-Chinese 45%.
- **Unsupervised (MUSE)**: English-French 78%, English-German 71%, English-Chinese 32%.
- **Distant pairs** (English-Japanese, English-Finnish): Drop by 15--30 points due to structural dissimilarity.

## Why It Matters

1. **Foundation for cross-lingual transfer**: Before multilingual transformers, cross-lingual embeddings were the primary mechanism for transferring NLP models across languages without parallel data.
2. **Resource efficiency**: Requires only monolingual corpora and optionally a small bilingual dictionary -- far less supervision than training a full MT system.
3. **Bilingual dictionary induction**: Automatically creates translation dictionaries for language pairs with no existing bilingual resources, supporting lexicography and language documentation.
4. **Interpretable geometry**: The linear mapping assumption reveals structural universals across languages -- semantically similar relationships are encoded in geometrically similar ways.
5. **Complementary to multilingual transformers**: For the 7,000+ languages not covered by mBERT or XLM-R, cross-lingual embedding alignment remains one of the few viable approaches.

## Key Technical Details

- Monolingual embeddings of dimension 300 (fastText or word2vec) are standard inputs; the mapping W is therefore a 300 x 300 matrix with only 90,000 parameters.
- Supervised methods need as few as 1,000--5,000 seed translation pairs to achieve competitive results; performance saturates around 20,000 pairs.
- Unsupervised MUSE achieves within 3--5 points of supervised methods for closely related language pairs (e.g., English-Spanish) but degrades sharply for distant pairs.
- The isomorphism assumption -- that monolingual embedding spaces have similar structure -- breaks down for typologically distant languages (Sogaard et al., 2018), with English-Japanese alignment being 20+ points worse than English-French.
- VecMap (Artetxe et al., 2018) is an alternative unsupervised method using iterative Procrustes refinement without adversarial training, achieving comparable or better results than MUSE.
- Hub words (vectors that appear as nearest neighbors of many queries) are a major failure mode; CSLS retrieval reduces hubness by 40--60%.

## Common Misconceptions

- **"Cross-lingual embeddings require parallel corpora."** Unsupervised methods like MUSE and VecMap require only monolingual corpora from each language. Even supervised methods need only a small bilingual dictionary (1K--5K pairs), not sentence-aligned parallel text.

- **"A linear mapping is too simple to capture cross-lingual structure."** The linearity is actually well-motivated: Mikolov et al. showed that the geometric structure of embedding spaces is remarkably consistent across languages, and the Procrustes constraint (orthogonal W) leverages this insight. Non-linear mappings tend to overfit without improving BLI performance.

- **"Unsupervised alignment works for any language pair."** Unsupervised methods rely on the isomorphism assumption, which fails for distant language pairs. Vulovic et al. (2020) showed that MUSE fails entirely for 87 out of 210 language pairs tested, particularly those involving low-resource languages with small training corpora.

- **"Cross-lingual embeddings are obsolete now that we have mBERT."** Multilingual transformers cover only 100--104 languages. For the remaining 7,000+ languages, cross-lingual embedding alignment is often the only available method. Additionally, static embeddings are far more computationally efficient than running a transformer.

## Connections to Other Concepts

- **`word2vec.md`**: Provides the monolingual embeddings that serve as input to cross-lingual alignment methods.
- **`fasttext.md`**: FastText embeddings are preferred inputs because their subword information handles morphological variation and out-of-vocabulary words.
- **`multilingual-transformers.md`**: The successor paradigm that learns cross-lingual representations jointly during pre-training rather than through post-hoc alignment.
- **`multilingual-nlp.md`**: Cross-lingual embeddings are one of the core techniques enabling multilingual NLP systems.
- **`low-resource-nlp.md`**: Cross-lingual embedding transfer is a key strategy for languages with scarce labeled data.
- **`machine-translation-approaches.md`**: Bilingual dictionary induction from aligned embeddings bootstraps MT for low-resource language pairs.
- **`cross-lingual-transfer.md`**: Cross-lingual embeddings provide the representation layer that makes task-level cross-lingual transfer possible.
- **`sentence-embeddings.md`**: Extensions like LASER (Artetxe and Schwenk, 2019) learn cross-lingual sentence embeddings for retrieval and mining.

## Further Reading

- Mikolov et al., "Exploiting Similarities Among Languages for Machine Translation" (2013) -- The foundational paper showing that a linear mapping aligns embedding spaces across languages.
- Conneau et al., "Word Translation Without Parallel Data" (2018) -- The MUSE paper introducing unsupervised cross-lingual alignment via adversarial training.
- Artetxe et al., "A Robust Self-Learning Method for Fully Unsupervised Cross-Lingual Mappings of Word Embeddings" (2018) -- VecMap, an alternative unsupervised approach using iterative refinement.
- Sogaard et al., "On the Limitations of Unsupervised Bilingual Dictionary Induction" (2018) -- Critical analysis showing when the isomorphism assumption fails.
- Ruder et al., "A Survey of Cross-Lingual Word Embedding Models" (2019) -- Comprehensive taxonomy of supervised, semi-supervised, and unsupervised alignment methods.
- Smith et al., "Offline Bilingual Word Vectors, Orthogonal Transformations and the Inverted Softmax" (2017) -- The Procrustes refinement and inverted softmax for improved retrieval.
