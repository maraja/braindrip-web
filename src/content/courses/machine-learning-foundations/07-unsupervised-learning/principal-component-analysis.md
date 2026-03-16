# Principal Component Analysis

**One-Line Summary**: Projecting data onto orthogonal directions of maximum variance -- the foundational dimensionality reduction technique.

**Prerequisites**: Linear algebra (eigenvalues, eigenvectors), covariance matrix, matrix decomposition (SVD).

## What Is Principal Component Analysis?

Imagine photographing a three-dimensional sculpture. Each photograph is a 2D projection that captures some but not all of the object's shape. PCA finds the "camera angles" that capture the most information -- specifically, the directions along which the data varies the most. By projecting onto these directions, you reduce dimensionality while preserving as much structure as possible.

The method was introduced by Karl Pearson in 1901 and independently by Harold Hotelling in 1933. It remains the most widely used dimensionality reduction technique more than a century later.

Formally, PCA finds a set of orthogonal axes (principal components) such that the projection of the data onto the first $k$ axes retains the maximum possible variance. Given centered data $X \in \mathbb{R}^{n \times d}$ (mean-subtracted), PCA seeks an orthogonal matrix $W \in \mathbb{R}^{d \times k}$ that maximizes:

$$\text{Var}(XW) = \text{tr}(W^T \Sigma W)$$

where $\Sigma = \frac{1}{n-1} X^T X$ is the sample covariance matrix, subject to $W^T W = I_k$.

## How It Works

### Eigendecomposition Approach

1. Center the data: subtract the mean $\bar{x}$ from each observation.
2. Compute the covariance matrix: $\Sigma = \frac{1}{n-1} X^T X$.
3. Compute eigenvalues $\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_d$ and corresponding eigenvectors $v_1, v_2, \ldots, v_d$ of $\Sigma$.
4. The first $k$ eigenvectors form the projection matrix $W = [v_1, \ldots, v_k]$.
5. Project: $Z = XW$, where $Z \in \mathbb{R}^{n \times k}$.

Each eigenvalue $\lambda_i$ equals the variance of the data along direction $v_i$.

### SVD Approach

For large $d$, computing $\Sigma$ explicitly is expensive ($O(d^2 n)$ space). Instead, compute the thin SVD of the centered data matrix directly:

$$X = U S V^T$$

The columns of $V$ are the principal component directions (identical to the eigenvectors of $\Sigma$). The singular values satisfy $s_i = \sqrt{(n-1)\lambda_i}$. The projected data is $Z = US$, where we keep the first $k$ columns.

The SVD approach is numerically more stable and works even when $d > n$ (more features than samples).

### Choosing the Number of Components

- **Explained variance ratio**: The fraction of total variance captured by the first $k$ components is $\sum_{i=1}^k \lambda_i / \sum_{i=1}^d \lambda_i$. A common threshold is 90-95%.
- **Scree plot**: Plot eigenvalues in decreasing order. Look for an "elbow" where eigenvalues drop off sharply -- components beyond the elbow contribute little.
- **Kaiser criterion**: Retain components with eigenvalues greater than 1 (when data is standardized), though this is a rough heuristic.
- **Parallel analysis**: Compare observed eigenvalues to those from random data of the same dimensions. Retain components whose eigenvalues exceed the random baseline -- a more rigorous alternative to the Kaiser criterion.

### PCA for Preprocessing

Beyond dimensionality reduction, PCA performs two useful transformations:

- **Decorrelation**: The projected coordinates $Z = XW$ are uncorrelated by construction. This benefits algorithms that assume feature independence (e.g., Naive Bayes).
- **Whitening**: Scaling each principal component by $1/\sqrt{\lambda_i}$ yields unit-variance, uncorrelated features. This normalizes the geometry of the feature space, which can accelerate gradient-based optimization. Whitened features have the identity matrix as their covariance -- all directions are equally scaled.
- **Noise reduction**: By discarding low-variance components (those capturing noise rather than signal), PCA can denoise data before passing it to downstream models. This is especially effective when the signal-to-noise ratio is high in the top components.

### Kernel PCA

Standard PCA captures only linear structure. Kernel PCA (Scholkopf et al., 1998) applies PCA in a high-dimensional feature space induced by a kernel function $\kappa(x_i, x_j)$, without explicitly computing the mapping. The kernel matrix $K_{ij} = \kappa(x_i, x_j)$ is eigendecomposed instead of the covariance matrix. Common kernels include the RBF kernel $\kappa(x, y) = \exp(-\gamma \|x - y\|^2)$ and polynomial kernels. This captures nonlinear manifold structure.

### Probabilistic PCA

Probabilistic PCA (Tipping and Bishop, 1999) provides a latent variable interpretation. The generative model assumes:

$$z \sim \mathcal{N}(0, I_k), \quad x = Wz + \mu + \epsilon, \quad \epsilon \sim \mathcal{N}(0, \sigma^2 I)$$

where $W \in \mathbb{R}^{d \times k}$ is the loading matrix. Maximum likelihood estimation of $W$ recovers the principal components (up to rotation). This formulation enables handling missing data via EM, provides a principled noise model, and connects PCA to the broader family of latent variable models including factor analysis and Gaussian mixture models.

### Practical Example

In a genomics study with 20,000 gene expression measurements across 500 patients, direct analysis in 20,000 dimensions is infeasible. Applying PCA and retaining the top 50 components (capturing 85% of variance) reduces the problem to a manageable size. The first two components, when plotted, often separate patients by disease subtype or ancestry -- providing immediate biological insight and a compressed representation for downstream clustering or classification.

## Why It Matters

PCA is ubiquitous in machine learning and data science. It reduces computational cost by lowering feature dimensionality, mitigates the curse of dimensionality, removes multicollinearity, and enables visualization of high-dimensional data. In genomics, PCA on gene expression data reveals population structure. In finance, PCA on asset returns identifies latent risk factors. In computer vision, "eigenfaces" use PCA for face recognition. It is often the first step in any analytical pipeline dealing with high-dimensional data.

## Key Technical Details

- **Time complexity**: $O(\min(nd^2, n^2d))$ for full decomposition; randomized SVD achieves $O(ndk)$ for the top $k$ components
- **Centering is essential**: PCA on uncentered data finds the direction of the mean, not of maximum variance. Always subtract $\bar{x}$ before computing the covariance matrix
- **Scale sensitivity**: Features with larger scales dominate. Standardize features (zero mean, unit variance) when they are on different scales. Using the correlation matrix instead of the covariance matrix is equivalent to standardizing first
- **Linearity**: PCA only captures linear relationships. For nonlinear structure, use kernel PCA, t-SNE, or UMAP
- **Reconstruction**: The original data can be approximately recovered as $\hat{X} = ZW^T + \bar{x}$, with reconstruction error equal to $\sum_{i=k+1}^{d} \lambda_i$
- **Incremental PCA**: For datasets too large to fit in memory, incremental PCA processes the data in mini-batches, updating the eigendecomposition as new data arrives. This is available in scikit-learn as `IncrementalPCA`
- **Sparse PCA**: Adds an L1 penalty to the loadings to produce sparse principal components, improving interpretability at the cost of orthogonality. Each component loads on only a few features rather than all of them
- **Equivalence of viewpoints**: PCA simultaneously (1) maximizes variance of projections, (2) minimizes reconstruction error, and (3) decorrelates the data. These three formulations yield the same solution
- **Sensitivity to outliers**: PCA is based on the covariance matrix, which is sensitive to outliers. A single extreme point can dominate the first principal component. Robust PCA variants (e.g., using the median absolute deviation or the minimum covariance determinant) address this

## Common Misconceptions

- **"PCA finds the most important features."** PCA finds directions of maximum variance, which are linear combinations of all features. High variance does not necessarily mean high importance for a downstream task.
- **"You should always use PCA before modeling."** If the original features are already low-dimensional and interpretable, PCA obscures their meaning. Use it when dimensionality reduction is genuinely needed.
- **"The first principal component is the best predictor."** Maximum variance directions are unsupervised -- they may be orthogonal to the target variable. For supervised reduction, consider PLS or LDA instead.
- **"PCA removes noise."** It removes components with small variance, which often correspond to noise -- but not always. Signal can exist in low-variance directions.
- **"PCA and feature selection are the same."** Feature selection picks a subset of the original features; PCA creates new features as linear combinations. PCA components are harder to interpret but capture more variance per dimension.
- **"You need more samples than features for PCA."** The SVD approach works even when $d > n$ (the "wide" data regime common in genomics). However, with $n < d$, at most $n - 1$ components will have nonzero variance.

## Connections to Other Concepts

- `k-means-clustering.md`: PCA is commonly applied before K-means to reduce dimensionality and improve cluster quality. The top principal components often align with cluster-separating directions. PCA + K-means is arguably the most common unsupervised pipeline in practice.
- `gaussian-mixture-models.md`: Probabilistic PCA is a single-component latent variable model closely related to GMMs. Factor analysis extends this with component-specific noise. GMMs on PCA-reduced data combine dimensionality reduction with soft clustering.
- `tsne-and-umap.md`: These nonlinear methods complement PCA. It is common practice to first reduce to 50 dimensions with PCA, then apply t-SNE or UMAP for 2D visualization. PCA preprocessing dramatically speeds up both methods.
- `anomaly-detection.md`: Points with high reconstruction error under a PCA model (large residuals in discarded components) are potential anomalies. This is one of the simplest and most effective anomaly detection approaches.
- `association-rules.md`: While association rules operate on discrete transactional data, PCA operates on continuous numerical data. Both aim to discover latent structure, but in fundamentally different data types.

## Implementation Notes

In scikit-learn, `PCA` computes the full SVD by default, which is exact but slow for large $d$. For large datasets, use `PCA(svd_solver='randomized')` to compute a rank-$k$ approximation in $O(ndk)$ time. For out-of-core processing, use `IncrementalPCA` with a specified batch size.

Always inspect the explained variance ratio before choosing $k$. A cumulative explained variance plot provides more information than a single threshold. When features have different units, use `StandardScaler` before PCA -- otherwise the component with the largest absolute scale will dominate the first principal component regardless of its informational content.

For interpretability, examine the loadings (rows of $W$) to understand which original features contribute most to each principal component. Large absolute loadings indicate strong contribution.

## Further Reading

- Pearson, "On Lines and Planes of Closest Fit to Systems of Points in Space" (1901) -- The original PCA paper framing it as minimizing projection error.
- Hotelling, "Analysis of a Complex of Statistical Variables into Principal Components" (1933) -- Established PCA in modern statistical form.
- Jolliffe, *Principal Component Analysis* (2002) -- The definitive reference covering theory, computation, and applications.
- Halko, Martinsson, and Tropp, "Finding Structure with Randomness" (2011) -- Randomized algorithms for large-scale SVD/PCA.
- Tipping and Bishop, "Probabilistic Principal Component Analysis" (1999) -- The probabilistic formulation connecting PCA to latent variable models.
- Scholkopf, Smola, and Muller, "Nonlinear Component Analysis as a Kernel Eigenvalue Problem" (1998) -- The kernel PCA paper for nonlinear dimensionality reduction.
