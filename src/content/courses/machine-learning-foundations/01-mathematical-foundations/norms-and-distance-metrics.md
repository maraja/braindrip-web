# Norms and Distance Metrics

**One-Line Summary**: Measuring size and similarity in feature space -- L1, L2, cosine, Mahalanobis, and when each is appropriate.

**Prerequisites**: Vectors and Matrices, Probability Fundamentals (for Mahalanobis distance).

## What Are Norms and Distance Metrics?

Every ML algorithm that compares data points needs a notion of "how far apart" or "how similar" two points are. K-nearest neighbors classifies based on proximity. K-means clusters by distance to centroids. Regularization penalizes "large" parameters. But *how* you measure size and distance profoundly affects what the algorithm learns.

Think of navigating a city. Euclidean distance (L2) is the straight-line path a bird would fly. Manhattan distance (L1) follows the street grid. If you are finding the nearest coffee shop, the relevant distance depends on whether you are a bird or a pedestrian. Similarly, the right distance metric for your ML problem depends on the geometry of your data.

## How It Works

### Norms: Measuring Vector Size

A **norm** $\|\cdot\|$ on a vector space assigns a non-negative "length" to each vector, satisfying:

1. $\|\mathbf{x}\| \geq 0$ with equality iff $\mathbf{x} = \mathbf{0}$ (positive definiteness)
2. $\|c\mathbf{x}\| = |c|\|\mathbf{x}\|$ (absolute homogeneity)
3. $\|\mathbf{x} + \mathbf{y}\| \leq \|\mathbf{x}\| + \|\mathbf{y}\|$ (triangle inequality)

### The $L^p$ Norm Family

For $\mathbf{x} \in \mathbb{R}^n$ and $p \geq 1$:

$$\|\mathbf{x}\|_p = \left(\sum_{i=1}^n |x_i|^p\right)^{1/p}$$

**$L^1$ norm (Manhattan norm)**: $\|\mathbf{x}\|_1 = \sum_{i=1}^n |x_i|$. The sum of absolute values. The unit ball is a diamond (2D) or cross-polytope. L1 **promotes sparsity** because its unit ball has corners on the coordinate axes -- optimization solutions tend to land on these corners, zeroing out components.

**$L^2$ norm (Euclidean norm)**: $\|\mathbf{x}\|_2 = \sqrt{\sum_{i=1}^n x_i^2}$. The familiar straight-line length. The unit ball is a circle (2D) or hypersphere. L2 distributes penalty smoothly across all components, preferring many small values over a few large ones.

**$L^\infty$ norm (max norm)**: $\|\mathbf{x}\|_\infty = \max_i |x_i|$. The largest absolute component. The unit ball is a hypercube. Used in adversarial robustness (measuring the maximum perturbation in any single feature).

**$L^0$ "norm"**: $\|\mathbf{x}\|_0 = |\{i : x_i \neq 0\}|$. Counts nonzero entries. Not a true norm (violates homogeneity) but conceptually important -- it measures sparsity directly. L0 minimization is NP-hard, motivating the L1 relaxation.

### Distance Metrics

A **metric** $d(\mathbf{x}, \mathbf{y})$ satisfies: (1) $d(\mathbf{x}, \mathbf{y}) \geq 0$, (2) $d(\mathbf{x}, \mathbf{y}) = 0 \iff \mathbf{x} = \mathbf{y}$, (3) $d(\mathbf{x}, \mathbf{y}) = d(\mathbf{y}, \mathbf{x})$, (4) $d(\mathbf{x}, \mathbf{z}) \leq d(\mathbf{x}, \mathbf{y}) + d(\mathbf{y}, \mathbf{z})$.

Any norm induces a distance: $d(\mathbf{x}, \mathbf{y}) = \|\mathbf{x} - \mathbf{y}\|$.

**Euclidean distance**: $d(\mathbf{x}, \mathbf{y}) = \|\mathbf{x} - \mathbf{y}\|_2 = \sqrt{\sum_i (x_i - y_i)^2}$. The default choice when features are on comparable scales.

**Manhattan distance**: $d(\mathbf{x}, \mathbf{y}) = \|\mathbf{x} - \mathbf{y}\|_1 = \sum_i |x_i - y_i|$. More robust to outliers than Euclidean distance because it does not square differences.

### Cosine Similarity and Distance

**Cosine similarity** measures the angle between vectors, ignoring magnitude:

$$\text{sim}(\mathbf{x}, \mathbf{y}) = \frac{\mathbf{x} \cdot \mathbf{y}}{\|\mathbf{x}\|_2 \|\mathbf{y}\|_2} = \cos\theta \in [-1, 1]$$

**Cosine distance**: $d(\mathbf{x}, \mathbf{y}) = 1 - \text{sim}(\mathbf{x}, \mathbf{y})$.

Cosine similarity is the workhorse of NLP and information retrieval. Two documents with different lengths but similar topic proportions will have high cosine similarity, whereas their Euclidean distance may be large simply due to differing magnitudes. It is also central to attention mechanisms in Transformers, where query-key similarity is computed via (scaled) dot products.

### Mahalanobis Distance

Euclidean distance treats all directions equally. If features are correlated or have different variances, this can be misleading. The **Mahalanobis distance** accounts for the covariance structure:

$$d_M(\mathbf{x}, \mathbf{y}) = \sqrt{(\mathbf{x} - \mathbf{y})^T \Sigma^{-1} (\mathbf{x} - \mathbf{y})}$$

where $\Sigma$ is the covariance matrix. Geometrically, Mahalanobis distance measures how many standard deviations apart two points are, after decorrelating and normalizing the features. When $\Sigma = I$ (identity), it reduces to Euclidean distance.

Mahalanobis distance appears in:
- **Gaussian likelihood**: The exponent of a multivariate Gaussian is $-\frac{1}{2}d_M(\mathbf{x}, \boldsymbol{\mu})^2$.
- **Anomaly detection**: Points with large Mahalanobis distance from the mean are outliers.
- **Linear discriminant analysis**: Classification boundaries are defined by equal Mahalanobis distances to class means.

### When to Use Which

| Metric | Best For | Watch Out For |
|---|---|---|
| L2 / Euclidean | General purpose, comparable-scale features | Sensitive to scale differences and outliers |
| L1 / Manhattan | High-dimensional sparse data, outlier robustness | Less geometrically intuitive |
| Cosine | Text, embeddings, direction matters more than magnitude | Ignores magnitude entirely |
| Mahalanobis | Correlated features, anomaly detection | Requires estimating $\Sigma$ (expensive, needs $n > d$) |
| L-infinity | Adversarial robustness, worst-case perturbation | Ignores all but the largest component |

### Connection to Regularization

Regularization adds a norm-based penalty to the loss function:

$$\mathcal{L}_{\text{reg}}(\boldsymbol{\theta}) = \mathcal{L}(\boldsymbol{\theta}) + \lambda \|\boldsymbol{\theta}\|_p^p$$

**L1 regularization** ($p=1$): Produces **sparse** solutions by driving irrelevant parameters exactly to zero. Used in Lasso regression and feature selection. The non-differentiability at zero is handled by subgradient methods or proximal operators.

**L2 regularization** ($p=2$): Produces **smooth** solutions by penalizing large parameter values evenly. Used in Ridge regression and weight decay. Equivalent to a Gaussian prior on parameters in the MAP framework.

**Elastic Net** combines both: $\lambda_1\|\boldsymbol{\theta}\|_1 + \lambda_2\|\boldsymbol{\theta}\|_2^2$, getting sparsity from L1 and stability from L2.

## Why It Matters

The choice of norm and distance metric implicitly defines the geometry of your problem. It determines which points are "neighbors," how regularization shapes the model, and what "similar" means. Using L2 distance in a high-dimensional space where most features are irrelevant will perform poorly because every point is approximately equidistant (the curse of dimensionality). Using cosine similarity for features where magnitude matters (e.g., income) would discard crucial information.

## Key Technical Details

- **Curse of dimensionality**: In high dimensions, the ratio of the distance to the nearest and farthest neighbor approaches 1, making distance-based methods (KNN, kernel methods) less discriminative. L1 distance degrades more gracefully than L2.
- **Matrix norms**: The Frobenius norm $\|A\|_F = \sqrt{\sum_{ij} A_{ij}^2}$ is the L2 norm of the vectorized matrix. The spectral norm $\|A\|_2 = \sigma_{\max}(A)$ is the largest singular value.
- **Dual norms**: The dual of $L^p$ is $L^q$ where $\frac{1}{p} + \frac{1}{q} = 1$. This duality appears in optimization (Lagrangian duality of regularized problems).
- For unit-normalized vectors ($\|\mathbf{x}\| = \|\mathbf{y}\| = 1$): $\|\mathbf{x} - \mathbf{y}\|_2^2 = 2(1 - \cos\theta)$. Euclidean distance and cosine distance become monotonically related.
- **Kernel trick**: Many kernel functions (RBF, polynomial) are defined in terms of norms: $k(\mathbf{x}, \mathbf{y}) = \exp(-\gamma\|\mathbf{x} - \mathbf{y}\|^2)$.

## Common Misconceptions

- **"Euclidean distance is always the natural choice."** It is the natural choice only when features are independent, equally scaled, and magnitude differences are meaningful. For text embeddings, cosine similarity is far more appropriate.
- **"L1 and L2 regularization just prevent overfitting."** They do, but they also encode different structural assumptions. L1 assumes the true model is sparse; L2 assumes parameters are small but nonzero. Choosing between them is a modeling decision, not just a technical one.
- **"Cosine similarity handles any embedding."** Cosine similarity assumes direction is meaningful. For embeddings where norms encode confidence or importance (e.g., some GNN outputs), discarding magnitude loses information.

## Connections to Other Concepts

- **Vectors and Matrices**: Norms are defined on vector spaces; matrix norms generalize them to transformations. The dot product underlies cosine similarity.
- **Matrix Decompositions**: The spectral norm and Frobenius norm are defined through singular values. Low-rank approximation minimizes the Frobenius norm of the error.
- **Optimization and Gradient Descent**: Regularization terms (L1, L2) modify the loss landscape. The choice of norm affects the geometry of the constraint set and the resulting optimization.
- **Maximum Likelihood Estimation**: L2 regularization corresponds to a Gaussian prior; L1 to a Laplace prior. Regularized MLE is MAP estimation.
- **Probability Fundamentals**: Mahalanobis distance is defined through the covariance matrix and appears in the exponent of the multivariate Gaussian.
- **Information Theory**: KL divergence measures distributional "distance" and complements geometric norms that measure feature-space distance.

## Further Reading

- Deza & Deza, *Encyclopedia of Distances* (2009) -- Comprehensive catalog of distance functions across mathematics and computer science.
- Hastie, Tibshirani & Friedman, *The Elements of Statistical Learning*, Chapters 3 & 18 (2009) -- Detailed treatment of L1/L2 regularization and high-dimensional distance.
- Aggarwal, Hinneburg & Keim, "On the Surprising Behavior of Distance Metrics in High Dimensional Space" (2001) -- Foundational paper on the curse of dimensionality for distance metrics.
