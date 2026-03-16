# Topic Modeling

**One-Line Summary**: Discovering latent themes in document collections by learning probabilistic or algebraic decompositions that map documents to topic mixtures and topics to word distributions.

**Prerequisites**: Bag of Words (`03-text-representation/bag-of-words.md`), TF-IDF (`03-text-representation/tf-idf.md`), Document Embeddings (`03-text-representation/document-embeddings.md`).

## What Is Topic Modeling?

Imagine browsing a library with no catalog. You open books at random, notice clusters of co-occurring words -- "election," "vote," "candidate" in one cluster; "protein," "cell," "genome" in another -- and gradually infer the library's subject categories. Topic modeling automates this: given a collection of documents with no labels, it discovers the hidden thematic structure.

Formally, a topic model is a generative statistical model that explains a corpus as a mixture of latent topics, where each topic is a probability distribution over words and each document is a mixture of topics. If a corpus has K topics, then topic k is characterized by a distribution phi_k over the vocabulary (e.g., topic "sports" assigns high probability to "goal," "team," "score"), and document d is characterized by a distribution theta_d over topics (e.g., a sports news article might be 70% "sports," 20% "business," 10% "politics"). The model learns both sets of distributions simultaneously from the observed word counts.

## How It Works

### Latent Semantic Analysis (LSA)

LSA (Deerwester et al., 1990) applies Truncated Singular Value Decomposition (SVD) to the term-document matrix. Given a term-document matrix X of size |V| x N (vocabulary by documents), SVD decomposes it as:

```
X ≈ U_k * S_k * V_k^T
```

Where U_k (|V| x k) contains term-topic associations, S_k (k x k) holds singular values capturing topic importance, and V_k (N x k) contains document-topic associations. Setting k = 100-300 captures the major semantic dimensions while filtering noise. LSA captures synonymy (different words, same topic) and polysemy (same word, different topics) to some degree, but its components can contain negative values, making interpretation difficult.

### Latent Dirichlet Allocation (LDA)

LDA (Blei, Pritchard, and Ng, 2003) is the most influential topic model. It defines a fully generative process:

**The Generative Story:**
1. For each topic k = 1, ..., K: draw a word distribution phi_k ~ Dirichlet(beta)
2. For each document d = 1, ..., N:
   a. Draw a topic distribution theta_d ~ Dirichlet(alpha)
   b. For each word position n = 1, ..., N_d:
      - Draw a topic assignment z_{d,n} ~ Multinomial(theta_d)
      - Draw a word w_{d,n} ~ Multinomial(phi_{z_{d,n}})

**Plate Notation**: In graphical model notation, alpha and beta are hyperparameters outside all plates. The outer plate (over D documents) contains theta_d. The inner plate (over N_d words in document d) contains z_{d,n} and the observed word w_{d,n}. phi_k sits in a plate over K topics.

**Inference**: The posterior p(theta, z, phi | w, alpha, beta) is intractable. Two primary inference methods exist:
- **Variational Bayes (Blei et al., 2003)**: Approximate the posterior with a factored distribution and optimize via coordinate ascent. Faster but biased.
- **Collapsed Gibbs Sampling (Griffiths and Steyvers, 2004)**: Iteratively resample each z_{d,n} conditioned on all other assignments. Slower but asymptotically exact. Typically 1000-2000 iterations suffice for convergence.

**Hyperparameters**: alpha controls document-topic sparsity (smaller alpha = documents focus on fewer topics); beta controls topic-word sparsity (smaller beta = topics focus on fewer words). Common defaults: alpha = 50/K, beta = 0.01.

### Non-negative Matrix Factorization (NMF)

NMF (Lee and Seung, 1999, applied to text by Xu et al., 2003) factorizes the term-document matrix X ≈ W * H, where all entries in W (|V| x K, topic-word matrix) and H (K x N, document-topic matrix) are non-negative. This non-negativity constraint produces parts-based, interpretable decompositions -- each topic is an additive combination of word weights, never a subtraction. NMF is deterministic, faster than LDA on moderate-sized corpora, and often produces comparably coherent topics. It is optimized by minimizing the Frobenius norm ||X - WH||_F or KL divergence.

### Neural Topic Models

Recent approaches combine the generative framework of LDA with neural network flexibility:

- **ProdLDA** (Srivastava and Sutton, 2017): Replaces LDA's Dirichlet prior with a logistic-normal approximation and uses a Variational Autoencoder (VAE) architecture. The encoder maps BoW input to topic proportions; the decoder reconstructs the BoW from topic proportions. Produces more coherent topics than vanilla LDA on many benchmarks.
- **Embedded Topic Model (ETM)** (Dieng et al., 2020): Represents words and topics in the same embedding space. Each topic is a point in embedding space; the probability of a word given a topic is proportional to the softmax of the dot product between the word embedding and the topic embedding. ETM handles large vocabularies better than LDA and captures semantic relationships.
- **BERTopic** (Grootendorst, 2022): A non-generative approach that clusters document embeddings (from sentence transformers) using HDBSCAN, then extracts topic representations via class-based TF-IDF (c-TF-IDF). BERTopic leverages the semantic power of pre-trained transformers and often produces more coherent topics than LDA on short texts.

### Evaluation

Topic model evaluation is notoriously difficult because ground truth is rarely available:

- **Topic coherence** (Mimno et al., 2011): Measures whether the top-N words in a topic tend to co-occur in a reference corpus. C_V coherence (Roder et al., 2015) combines normalized pointwise mutual information with cosine similarity. Higher coherence indicates more interpretable topics. Typical C_V scores: 0.4-0.6 for LDA, 0.5-0.7 for neural topic models.
- **Topic diversity**: The percentage of unique words across all topics' top-25 word lists. Diversity of 0.8+ indicates minimal topic overlap.
- **Perplexity**: The held-out likelihood of test documents. Lower perplexity means better generalization, but Chang et al. (2009) showed perplexity does not correlate well with human judgments of topic quality.
- **Extrinsic evaluation**: Use topics as features for downstream tasks (classification, retrieval) and measure task performance.

### The Number-of-Topics Selection Problem

Choosing K (the number of topics) remains an open challenge:
- **Heuristic approaches**: Try K = 10, 20, 50, 100 and select based on coherence scores.
- **Hierarchical Dirichlet Process (HDP)**: A nonparametric extension of LDA that infers K from data, though it tends to produce many small topics.
- **Elbow method**: Plot coherence vs. K and look for the point of diminishing returns.
- In practice, domain knowledge and interpretability often determine K. A news corpus might use K = 20-50; a large scientific corpus might need K = 100-300.

## Why It Matters

1. **Exploratory data analysis**: Topic models reveal the thematic structure of unlabeled corpora -- invaluable for understanding large document collections.
2. **Document organization**: Automatically categorizing documents by topic for browsing, filtering, and recommendation.
3. **Trend analysis**: Tracking topic prevalence over time reveals emerging trends in scientific literature, news, or social media.
4. **Feature engineering**: Topic proportions serve as low-dimensional features for classification and clustering.
5. **Content discovery**: Identifying underexplored topics in a research field helps researchers find gaps in the literature.

## Key Technical Details

- **LDA scalability**: Online variational Bayes (Hoffman et al., 2010) processes documents in mini-batches, scaling LDA to millions of documents with constant memory.
- **Typical corpus sizes**: LDA works well with 1,000+ documents; fewer than 500 often yields unstable topics. NMF can work with smaller corpora.
- **Short text challenge**: Standard LDA struggles with tweets and short posts due to sparse word co-occurrence. Biterm Topic Model (BTM) and BERTopic address this.
- **Training time**: LDA with Gibbs sampling on 100K documents with 50 topics takes 5-30 minutes on a modern CPU; BERTopic's bottleneck is the initial embedding step.
- **ProdLDA vs. LDA**: ProdLDA achieves 5-15% higher topic coherence than LDA on 20Newsgroups and Wiki20K benchmarks.

## Common Misconceptions

**"Topics correspond to human-labeled categories."** Topics are statistical patterns of word co-occurrence, not predefined categories. A topic might blend what a human would consider two separate themes, or split a single theme into multiple topics based on vocabulary variation.

**"More topics always give a finer-grained understanding."** Beyond a certain K, additional topics become redundant or incoherent. There is a sweet spot where topics are both distinct and interpretable -- more is not always better.

**"Topic models understand word meaning."** Classical topic models like LDA operate on word co-occurrence statistics, not semantics. "Bank" in a finance topic and "bank" in a geography topic are the same word to LDA. Neural topic models (ETM, BERTopic) partially address this through embeddings.

**"Low perplexity means good topics."** Chang et al. (2009) demonstrated that models with lower perplexity can produce less interpretable topics. Coherence metrics and human evaluation are more reliable indicators of topic quality.

## Connections to Other Concepts

- `03-text-representation/bag-of-words.md`: LDA and NMF operate on BoW document representations.
- `03-text-representation/tf-idf.md`: NMF is often applied to TF-IDF matrices; BERTopic uses class-based TF-IDF for topic representation.
- `03-text-representation/document-embeddings.md`: BERTopic and ETM leverage document embeddings for topic discovery.
- `keyword-extraction.md`: Topic top-words are a form of corpus-level keyword discovery; document-level keywords complement topic assignments.
- `document-similarity.md`: Topic proportions can define a document similarity measure -- documents with similar topic distributions are thematically similar.
- `03-text-representation/sentence-embeddings.md`: BERTopic clusters sentence embeddings to discover topics.
- `05-core-nlp-tasks-analysis/text-classification.md`: Topic proportions serve as features for classification tasks.

## Further Reading

- Blei, Ng, and Jordan, "Latent Dirichlet Allocation," 2003 -- The foundational paper introducing LDA and variational inference for topic models.
- Griffiths and Steyvers, "Finding Scientific Topics," 2004 -- Introduced collapsed Gibbs sampling for LDA, the most widely used inference method.
- Srivastava and Sutton, "Autoencoding Variational Inference for Topic Models," 2017 -- ProdLDA, bringing VAE-based neural inference to topic modeling.
- Dieng et al., "Topic Modeling in Embedding Spaces," 2020 -- ETM, combining word embeddings with topic models for richer representations.
- Grootendorst, "BERTopic: Neural Topic Modeling with a Class-based TF-IDF Procedure," 2022 -- A modern, practical topic modeling approach leveraging transformer embeddings.
- Chang et al., "Reading Tea Leaves: How Humans Interpret Topic Models," 2009 -- The influential study showing perplexity does not predict human interpretability.
