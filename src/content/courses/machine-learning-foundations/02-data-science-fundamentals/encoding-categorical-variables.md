# Encoding Categorical Variables

**One-Line Summary**: One-hot, label, target, and embedding-based encoding -- translating categories into numbers without introducing false relationships.

**Prerequisites**: Data types and structures, basic linear algebra, exploratory data analysis.

## What Is Categorical Encoding?

Imagine teaching a computer to understand the concept of "color." A human intuitively knows that red, blue, and green are distinct categories with no inherent ordering. But machine learning algorithms operate on numbers -- they compute distances, gradients, and dot products. Encoding is the translation layer: converting categorical labels into numerical representations that preserve the true relationships (or lack thereof) among categories while enabling mathematical computation.

Formally, given a categorical feature $X$ taking values in a set $\mathcal{C} = \{c_1, c_2, \ldots, c_k\}$ with cardinality $k = |\mathcal{C}|$, an encoding is a function $\phi: \mathcal{C} \to \mathbb{R}^d$ that maps each category to a $d$-dimensional numerical vector. The critical design choice is what structure $\phi$ introduces -- or avoids introducing.

## How It Works

### Label Encoding (Integer Encoding)

Label encoding assigns each category an integer: $\phi(c_i) = i$. If colors are $\{\text{red}, \text{green}, \text{blue}\}$, the encoding might be $\text{red} \to 0$, $\text{green} \to 1$, $\text{blue} \to 2$.

**When appropriate**: Only for genuinely ordinal data where the integer assignment reflects a meaningful order. Examples: education level (high school=1, bachelor's=2, master's=3, PhD=4), satisfaction rating (1-5).

**The critical pitfall**: For nominal data (no inherent order), label encoding fabricates a metric structure. A linear model receiving $\text{red}=0$, $\text{green}=1$, $\text{blue}=2$ will "learn" that green is between red and blue, and that the distance from red to blue is twice that from red to green. This is meaningless and harmful. Tree-based models are partially immune because they split on thresholds rather than computing distances, but the arbitrary ordering still constrains the splits the tree can make.

### One-Hot Encoding

One-hot encoding maps each category to a binary vector of length $k$ with a single 1:

$$\phi(c_i) = \mathbf{e}_i \in \{0, 1\}^k$$

For colors: $\text{red} \to [1, 0, 0]$, $\text{green} \to [0, 1, 0]$, $\text{blue} \to [0, 0, 1]$.

This ensures that all categories are equidistant: $\|\phi(c_i) - \phi(c_j)\|_2 = \sqrt{2}$ for $i \neq j$. No false ordinal relationships are introduced.

**The dummy variable trap**: In linear models, if all $k$ one-hot columns are included alongside an intercept, the columns are perfectly collinear (they sum to 1 in every row). The solution is **dummy encoding**: drop one column (the reference category), leaving $k-1$ binary features. The dropped category's effect is absorbed into the intercept.

**Cardinality explosion**: A feature with $k = 50{,}000$ categories (e.g., zip codes, product IDs) produces 50,000 new columns. This is computationally prohibitive and creates extremely sparse representations. For high-cardinality features, use alternative encodings below.

### Target Encoding (Mean Encoding)

Target encoding replaces each category with the mean of the target variable for that category:

$$\phi(c_i) = \frac{1}{|S_i|} \sum_{j \in S_i} y_j$$

where $S_i = \{j : X_j = c_i\}$ is the set of observations with category $c_i$.

This compresses a high-cardinality feature into a single numeric column that directly captures the feature's relationship with the target. However, it introduces a serious risk: **target leakage**. Each observation's encoding is computed from target values that include its own label.

**Regularization strategies** to mitigate leakage:

- **Leave-one-out**: Exclude the current observation when computing the mean for its category.
- **K-fold target encoding**: Split training data into $K$ folds; encode each fold using statistics from the other $K-1$ folds.
- **Bayesian smoothing**: Blend the category mean with the global mean, weighting by sample size:

$$\phi(c_i) = \frac{n_i \cdot \bar{y}_i + m \cdot \bar{y}_{\text{global}}}{n_i + m}$$

where $n_i = |S_i|$ is the category count and $m$ is a smoothing parameter. Categories with few observations are pulled toward the global mean, reducing overfitting.

### Binary Encoding

Binary encoding converts the integer label to binary representation and uses each bit as a separate feature. For $k$ categories, this produces $\lceil \log_2 k \rceil$ columns instead of $k$.

Example with 8 categories: category 5 $\to$ integer 5 $\to$ binary 101 $\to$ features $[1, 0, 1]$.

**When appropriate**: A middle ground between label encoding (too few dimensions, false ordering) and one-hot encoding (too many dimensions). Works well with moderate-to-high cardinality features where the exact category identity matters less than grouping.

### Feature Hashing (The Hashing Trick)

Apply a hash function $h: \mathcal{C} \to \{0, 1, \ldots, m-1\}$ to map categories to a fixed-size feature vector of length $m$, where $m \ll k$:

$$\phi(c)_j = \begin{cases} 1 & \text{if } h(c) = j \\ 0 & \text{otherwise} \end{cases}$$

Hash collisions mean multiple categories map to the same bucket, introducing some noise. But for very high cardinality (millions of categories), hashing is the only practical option. It is stateless (no vocabulary to store), handles unseen categories gracefully, and has $O(1)$ memory per encoding.

**When appropriate**: Online learning, extremely high cardinality (user IDs, URL strings), and situations where a small amount of collision noise is acceptable.

### Embedding Encoding

Learned dense representations map each category to a low-dimensional continuous vector $\phi(c_i) \in \mathbb{R}^d$ where $d \ll k$. The embedding matrix $\mathbf{E} \in \mathbb{R}^{k \times d}$ is trained end-to-end with the model (common in deep learning).

Embeddings capture semantic similarity: categories that behave similarly in predicting the target end up with similar vectors. For example, a product embedding might place "iPhone 15" and "iPhone 14" close together but far from "garden hose."

**When appropriate**: Deep learning models, high-cardinality features, and situations where you want to capture latent structure among categories. Requires sufficient data to learn meaningful representations.

### Choosing the Right Encoding

| Encoding | Cardinality | Data type | Model type | Pros | Cons |
|---|---|---|---|---|---|
| Label | Any | Ordinal only | Trees (tolerant) | Simple, compact | False ordering for nominal |
| One-hot | Low (< 15-20) | Nominal | Any | No false relationships | Dimensionality explosion |
| Dummy | Low | Nominal | Linear models | Avoids collinearity | Same explosion risk |
| Target | High | Any | Any | Single column, captures signal | Leakage risk |
| Binary | Medium-high | Nominal | Any | Compact, no false ordering | Some information loss |
| Hashing | Very high | Nominal | Online / large-scale | Stateless, fixed memory | Hash collisions |
| Embedding | High | Nominal | Deep learning | Learns semantics | Requires large data |

## Why It Matters

Categorical features are everywhere: customer segments, product categories, geographic regions, device types, diagnostic codes. A dataset may have more categorical than numerical features. The encoding choice directly affects model performance, interpretability, and training efficiency. Incorrect encoding (ordinal encoding of nominal data) is one of the most common silent errors in ML pipelines -- the model trains without errors but learns spurious patterns.

## Key Technical Details

- **Encode after splitting.** Target encoding statistics must be computed on training data only. Even one-hot encoding should learn its category vocabulary from training data; unseen categories in the test set should map to a catch-all "unknown" column (see **Data Splitting and Sampling**).
- **Handle unseen categories.** Production data will contain categories not seen during training. Strategies: map to "unknown," use hashing (which handles novel values by design), or use a fallback value in target encoding (the global mean).
- **Interaction with missing data.** A missing category can be treated as its own level ("missing") or imputed before encoding. See **Handling Missing Data**.
- **Cardinality vs. frequency.** A feature with 1,000 categories where 990 appear fewer than 5 times is effectively a 10-category feature with noise. Group rare categories into an "other" bucket before encoding.

## Common Misconceptions

- **"One-hot encoding is always the best default."** It is safe but not always optimal. For high-cardinality features, it creates sparse, high-dimensional representations that slow training and may degrade performance compared to target or embedding-based encoding.
- **"Label encoding is fine for tree-based models."** Trees can work around arbitrary integer assignments, but they are still constrained to threshold splits. A category labeled 5 can only be grouped with categories labeled 1-4 or 6-10 in a single split; arbitrary groupings like {2, 5, 7} require multiple splits, reducing efficiency.
- **"Target encoding always causes leakage."** Properly regularized target encoding (K-fold or Bayesian smoothing) controls leakage effectively. The risk comes from naive implementation, not the method itself.
- **"Encoding is a one-time preprocessing step."** In production, the encoding scheme must handle evolving category sets, frequency shifts, and new categories gracefully.

## Connections to Other Concepts

- **Data Types and Structures**: Understanding whether a feature is nominal or ordinal is the prerequisite for choosing the correct encoding.
- **Exploratory Data Analysis**: EDA reveals cardinality, frequency distributions, and the relationship between categories and the target -- all of which inform encoding choice.
- **Data Cleaning and Preprocessing**: Inconsistent string formatting ("New York" vs. "new york") inflates cardinality. Clean before encoding.
- **Feature Scaling and Normalization**: One-hot encoded features are already on a $\{0, 1\}$ scale and should not be further standardized. Target-encoded features, however, should be scaled alongside other numerical features.
- **Data Splitting and Sampling**: Target encoding must be computed per-fold during cross-validation to prevent leakage.

## Further Reading

- Zheng & Casari, *Feature Engineering for Machine Learning* (2018) -- Practical coverage of encoding strategies with Python examples.
- Micci-Barreca, "A preprocessing scheme for high-cardinality categorical attributes in classification and prediction problems," *SIGKDD Explorations* (2001) -- The foundational paper on target encoding with smoothing.
- Guo & Berkhahn, "Entity Embeddings of Categorical Variables," *arXiv* (2016) -- Demonstrated that learned embeddings for categorical features outperform one-hot encoding in tabular deep learning.
