# Handling High-Cardinality Features

**One-Line Summary**: Target encoding, hashing, and embedding approaches for categorical features with thousands of unique values.

**Prerequisites**: One-hot encoding, overfitting and regularization, cross-validation, neural network basics, feature selection methods.

## What Is High-Cardinality Feature Handling?

Imagine trying to represent every ZIP code in the United States as a one-hot vector: you would create over 40,000 binary columns for a single feature. Most entries would be zero, the matrix would be enormous, and many ZIP codes would appear only once or twice in the training set. This is the high-cardinality problem -- when a categorical variable has so many unique values that naive encoding methods break down.

A categorical feature is considered high-cardinality when the number of unique levels $|\mathcal{C}|$ is large enough that one-hot encoding creates a prohibitively wide, sparse matrix. Practical thresholds depend on dataset size, but features with hundreds to millions of categories (user IDs, product SKUs, IP addresses, city names) routinely appear in industry datasets. The challenge is encoding these features into a compact numerical representation that preserves their predictive signal without overfitting or blowing up memory.

## How It Works

### Problems with One-Hot Encoding at Scale

One-hot encoding maps a categorical feature with $|\mathcal{C}|$ levels to a binary vector of length $|\mathcal{C}|$. This creates several problems when cardinality is high:

- **Dimensionality explosion**: $p$ features with average cardinality $c$ produce $p \cdot c$ columns after encoding. With user IDs, this can mean millions of columns.
- **Sparsity**: Each row has exactly one nonzero entry per original feature, creating extremely sparse matrices that waste memory and slow computation.
- **Insufficient statistics**: Rare categories may appear only a few times, providing too little data for the model to learn a reliable coefficient or split point.
- **Tree depth**: Decision trees must allocate many splits to traverse one-hot features, reducing their capacity for other signals.

### Target Encoding (Mean Encoding)

Target encoding replaces each category with the mean (or other statistic) of the target variable for that category:

$$\text{encoded}(c) = \frac{1}{|D_c|} \sum_{i \in D_c} y_i$$

where $D_c$ is the set of training examples with category $c$. For classification, this becomes the empirical probability of the positive class.

**The leakage problem.** Naively computing target statistics on the training set and using them as features in the same training set leaks target information, causing severe overfitting. Two standard mitigations:

**Regularized (smoothed) target encoding** blends the category mean with the global mean using a smoothing parameter $m$:

$$\text{encoded}(c) = \frac{n_c \cdot \bar{y}_c + m \cdot \bar{y}_{\text{global}}}{n_c + m}$$

Categories with few observations ($n_c \ll m$) collapse toward the global mean, reducing overfitting. The parameter $m$ controls the strength of regularization.

**Leave-one-out / cross-validated encoding** computes the target statistic for each row while excluding that row (leave-one-out) or by computing encodings only from other cross-validation folds. This breaks the direct target-to-feature feedback loop.

### Frequency Encoding

Replace each category with its frequency (count or proportion) in the training set:

$$\text{encoded}(c) = \frac{n_c}{n}$$

Frequency encoding is simple, fast, and carries no risk of target leakage since it uses no label information. It works well when the frequency of a category is itself predictive (e.g., popular products sell differently from niche ones). However, categories with identical frequencies become indistinguishable, losing ordinal information that target encoding would preserve.

### Feature Hashing (The Hashing Trick)

Feature hashing maps each category through a hash function to one of $k$ predetermined buckets:

$$\text{index}(c) = \text{hash}(c) \mod k$$

This produces a fixed-size binary (or count) vector of dimension $k$, regardless of the original cardinality. The key advantages are:

- **Fixed memory**: The output dimension $k$ is chosen in advance (typically $2^{10}$ to $2^{18}$).
- **No dictionary**: New categories at inference time are automatically handled -- they simply hash to some bucket.
- **Speed**: Hashing is $O(1)$ per category.

The cost is **hash collisions**: distinct categories may map to the same bucket, conflating their signals. Signed hashing (using a second hash function to determine $\pm 1$ multipliers) reduces collision bias in expectation. The parameter $k$ trades off collision rate against dimensionality.

### Embedding Layers (Learned Representations)

Neural networks can learn dense, low-dimensional representations for categories through embedding layers. Each category $c$ is mapped to a trainable vector $\mathbf{e}_c \in \mathbb{R}^d$ where $d \ll |\mathcal{C}|$ (typically 10-100):

$$\text{Embedding}: c \mapsto \mathbf{e}_c = W[c, :]$$

where $W \in \mathbb{R}^{|\mathcal{C}| \times d}$ is the embedding matrix, learned end-to-end via backpropagation. Embeddings capture semantic similarity -- categories that behave similarly in the data end up with nearby embedding vectors. Entity embeddings for categorical variables (Guo and Berkhahn, 2016) demonstrated that embeddings learned on tabular data can be extracted and reused with tree-based models, often improving their performance.

Practical choices for embedding dimension: a common heuristic is $d \approx \min(50, \lceil |\mathcal{C}|/2 \rceil)$ or $d \approx 1.6 \cdot |\mathcal{C}|^{0.56}$ (from fast.ai). For very large vocabularies (millions of users), embeddings are the only practical dense representation.

### Grouping Rare Categories

A straightforward preprocessing step: categories appearing fewer than a threshold $t$ times are collapsed into a single "OTHER" or "RARE" bucket. This reduces effective cardinality and ensures every remaining category has sufficient statistics. The threshold $t$ is typically chosen so that each surviving category has enough observations for reliable encoding (e.g., $t = 10$ or $t = 50$).

Grouping can be combined with any encoding method: group rare categories first, then apply target encoding or embeddings to the reduced set.

### Practical Example: Encoding ZIP Codes

Consider a fraud detection model with a "merchant_zip" feature containing 30,000 unique ZIP codes. A practical encoding pipeline:

1. **Group rare ZIPs**: Collapse ZIPs appearing fewer than 20 times into "OTHER" (reduces to ~5,000 categories).
2. **Frequency encode**: Add `zip_frequency = count(zip) / total_rows` as a feature capturing location popularity.
3. **Target encode with CV**: Compute 5-fold cross-validated target encoding, yielding the fraud rate per ZIP code with leakage protection.
4. **Add geographic features**: Map ZIPs to latitude/longitude, state, and urban/rural classification -- these lower-cardinality features complement the encoding.

This layered approach captures both the direct signal (fraud rate per ZIP) and structural patterns (geography, population density) while controlling overfitting.

### Choosing the Right Encoding Method

The best encoding depends on the downstream model and the dataset characteristics:

- **Linear models**: Target encoding or hashing, since they need numerical inputs and cannot learn complex category interactions.
- **Tree-based models**: Target encoding or ordinal encoding (which preserves ordering information that trees can split on). Frequency encoding works well when count is predictive.
- **Neural networks**: Embedding layers are the natural choice, learned jointly with the task.
- **Very large cardinality ($> 10^6$)**: Feature hashing or embeddings, since target encoding requires storing a mapping for every category.

## Why It Matters

High-cardinality features are ubiquitous in industry: e-commerce (product IDs, seller IDs), advertising (campaign IDs, creative IDs), finance (merchant codes, account IDs), and healthcare (diagnosis codes, medication IDs). Ignoring these features discards valuable signal; naively one-hot encoding them creates intractable models. Mastering high-cardinality encoding is often the difference between a proof-of-concept and a production-grade system.

## Key Technical Details

- Target encoding must always use out-of-fold computation or regularization; in-fold encoding overfits severely, especially with small categories.
- Feature hashing with $k$ buckets has an expected collision rate of approximately $1 - (1 - 1/k)^{|\mathcal{C}|-1}$ for any given category. Doubling $k$ roughly halves the collision probability.
- Embeddings require sufficient training data per category to learn meaningful vectors. Categories seen fewer than ~5-10 times during training get essentially random embeddings.
- For gradient-boosted trees, target encoding or frequency encoding are typically the most effective approaches; embeddings require a neural network training step.
- When combining multiple high-cardinality features, be cautious of their cross product -- the interaction of two features with cardinalities $c_1$ and $c_2$ can produce up to $c_1 \cdot c_2$ combinations.

## Common Misconceptions

- **"One-hot encoding is always fine for categorical features."** It works for low cardinality (< ~20 categories), but becomes harmful or infeasible at high cardinality due to dimensionality, sparsity, and insufficient statistics per category.
- **"Target encoding is just label leakage."** Done properly with cross-validation or regularization, target encoding introduces no more leakage than any other supervised feature engineering step. The key is computing encodings out-of-fold.
- **"Feature hashing is too lossy to be useful."** In practice, with a sufficiently large hash space (e.g., $2^{16}$ to $2^{18}$), collision effects are minimal and hashing often matches or exceeds one-hot encoding performance.
- **"Embeddings are only for NLP."** Categorical embeddings for tabular data are highly effective and increasingly standard in modern deep learning pipelines for structured data.

## Connections to Other Concepts

- **Feature Selection Methods**: After encoding high-cardinality features, feature selection (especially permutation importance) helps identify which encoded representations carry genuine signal.
- **Feature Extraction and Transformation**: High-cardinality encoding is a specialized form of feature transformation, converting raw categories into numerical representations.
- **Automated Feature Engineering**: AutoML systems must handle high-cardinality features automatically; most implement some form of target encoding or hashing internally.
- **Regularization**: Target encoding regularization (smoothing toward the global mean) is a direct application of Bayesian shrinkage concepts.
- **Neural Network Fundamentals**: Embedding layers are standard neural network components, with the embedding matrix trained via gradient descent like any other weight matrix.

## Further Reading

- Micci-Barreca, "A Preprocessing Scheme for High-Cardinality Categorical Attributes in Classification and Prediction Problems" (2001) -- Foundational paper on target encoding with smoothing.
- Weinberger et al., "Feature Hashing for Large Scale Multitask Learning" (2009) -- Introduces the hashing trick for high-dimensional categorical features.
- Guo and Berkhahn, "Entity Embeddings of Categorical Variables" (2016) -- Demonstrates learned embeddings for tabular categorical features, with transfer to tree models.
