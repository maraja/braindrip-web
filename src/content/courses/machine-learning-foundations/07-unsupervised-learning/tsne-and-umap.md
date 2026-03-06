# t-SNE and UMAP

**One-Line Summary**: Nonlinear dimensionality reduction for visualization -- preserving local neighborhood structure in 2D/3D plots.

**Prerequisites**: Principal component analysis, probability distributions, gradient descent, nearest-neighbor graphs.

## What Are t-SNE and UMAP?

Imagine you have a social network graph with thousands of people and want to draw it on a whiteboard so that friends appear close together. A simple linear projection (like PCA) would collapse the rich community structure into a blob. What you need is a method that can warp and bend the space to preserve who is near whom. This is exactly what t-SNE and UMAP do for high-dimensional data: they create 2D (or 3D) embeddings that faithfully represent local neighborhood relationships.

Both methods are nonlinear dimensionality reduction techniques designed primarily for visualization. They excel at revealing clusters, sub-populations, and manifold structure that linear methods miss entirely.

t-SNE was introduced by van der Maaten and Hinton in 2008, building on earlier stochastic neighbor embedding (SNE) work. UMAP was introduced by McInnes, Healy, and Melville in 2018. Together they have become the dominant visualization tools in fields from genomics to natural language processing.

## How It Works

### t-SNE (t-Distributed Stochastic Neighbor Embedding)

**Step 1: Pairwise similarities in high-D.** For each pair of points $x_i, x_j$, define a conditional probability reflecting how likely $x_j$ is a neighbor of $x_i$ under a Gaussian centered at $x_i$:

$$p_{j|i} = \frac{\exp(-\|x_i - x_j\|^2 / 2\sigma_i^2)}{\sum_{k \neq i} \exp(-\|x_i - x_k\|^2 / 2\sigma_i^2)}$$

Symmetrize: $p_{ij} = \frac{p_{j|i} + p_{i|j}}{2n}$. The bandwidth $\sigma_i$ is set so that the effective number of neighbors (perplexity) matches a user-specified value, typically 5-50.

**Step 2: Pairwise similarities in low-D.** In the embedding space, use a Student's t-distribution with one degree of freedom (Cauchy distribution) instead of a Gaussian:

$$q_{ij} = \frac{(1 + \|y_i - y_j\|^2)^{-1}}{\sum_{k \neq l} (1 + \|y_k - y_l\|^2)^{-1}}$$

The heavy-tailed t-distribution is the key innovation: it allows distant points in high-D to be mapped even farther apart in low-D, alleviating the "crowding problem" where moderate distances in high-D all collapse to the same small distance in low-D.

**Step 3: Minimize KL divergence.** Find the embedding $\{y_i\}$ that minimizes:

$$\text{KL}(P \| Q) = \sum_{i \neq j} p_{ij} \log \frac{p_{ij}}{q_{ij}}$$

This is optimized via gradient descent. The gradient has an intuitive interpretation: each pair of points exerts an attractive force (proportional to $p_{ij}$) pulling them together and a repulsive force (proportional to $q_{ij}$) pushing them apart.

### UMAP (Uniform Manifold Approximation and Projection)

UMAP (McInnes et al., 2018) is motivated by topological data analysis and Riemannian geometry, but its practical algorithm can be understood as follows:

**Step 1: Build a fuzzy topological representation.** Construct a weighted $k$-nearest-neighbor graph. Edge weights decay with distance, calibrated so that each point's local connectivity is approximately uniform:

$$w_{ij} = \exp\left(-\frac{d(x_i, x_j) - \rho_i}{\sigma_i}\right)$$

where $\rho_i$ is the distance to the nearest neighbor and $\sigma_i$ is a local scale parameter. The graph is symmetrized via fuzzy set union: $w_{ij}^{\text{sym}} = w_{ij} + w_{ji} - w_{ij} \cdot w_{ji}$.

**Step 2: Optimize a low-dimensional layout.** Define similar edge weights in the embedding space using a smooth approximation: $v_{ij} = (1 + a \|y_i - y_j\|^{2b})^{-1}$, where $a$ and $b$ are fitted to match a target curve. Minimize the cross-entropy between the high-D and low-D graphs:

$$\mathcal{L} = \sum_{(i,j)} \left[ w_{ij} \log \frac{w_{ij}}{v_{ij}} + (1 - w_{ij}) \log \frac{1 - w_{ij}}{1 - v_{ij}} \right]$$

The cross-entropy objective (rather than KL divergence) means UMAP penalizes both false neighbors and missed neighbors, leading to better preservation of global structure.

### Key Differences Between t-SNE and UMAP

| Aspect | t-SNE | UMAP |
|--------|-------|------|
| Objective | KL divergence | Cross-entropy |
| Global structure | Often poor | Better preserved |
| Speed | $O(n \log n)$ with Barnes-Hut | $O(n)$ approximate |
| Scalability | Practical to ~100K points | Handles millions |
| Determinism | Stochastic (varies between runs) | Also stochastic |
| Theoretical basis | Information theory | Algebraic topology |

### When to Use Which

- **Use t-SNE** when: You have a moderately sized dataset (up to ~100K points), you want fine-grained local structure visualization, and you are willing to tune perplexity carefully.
- **Use UMAP** when: You need speed and scalability (millions of points), you want better global structure preservation, or you need to embed new points into an existing layout (UMAP supports transform on unseen data; t-SNE does not without approximation).
- **Use PCA** when: You need a linear, interpretable, and deterministic reduction, or you are preprocessing for a downstream model rather than visualizing.

### Practical Example

In single-cell RNA sequencing, a dataset may contain gene expression measurements for 30,000 genes across 100,000 individual cells. The standard workflow is: (1) select the 2,000 most variable genes, (2) apply PCA to reduce to 50 dimensions, (3) run UMAP to produce a 2D embedding. The resulting plot reveals clusters corresponding to cell types (T cells, B cells, macrophages), with continuous trajectories visible for differentiating cells. Coloring points by known marker genes confirms biological identity.

## Why It Matters

These methods are the standard tools for visualizing high-dimensional data. In single-cell genomics, t-SNE and UMAP plots of gene expression data reveal cell types and developmental trajectories. In NLP, they visualize word embedding spaces. In computer vision, they show how learned representations cluster by class. Whenever a human needs to look at high-dimensional data, one of these methods is almost certainly involved.

## Key Technical Details

- **Perplexity (t-SNE)**: Controls the effective neighborhood size. Low perplexity (5-10) emphasizes very local structure; high perplexity (30-50) incorporates more global context. Results can change qualitatively with different perplexity values. A perplexity of 30 is a common default.
- **n_neighbors (UMAP)**: Analogous to perplexity. Larger values yield more global structure at the cost of local detail. Default is typically 15.
- **min_dist (UMAP)**: Controls how tightly points can pack in the embedding. Smaller values create denser clusters; larger values spread them out. Default is 0.1.
- **Pre-reduction with PCA**: For data with hundreds or thousands of features, reducing to 50-100 dimensions with PCA before applying t-SNE or UMAP dramatically improves speed and often quality. This is standard practice.
- **Reproducibility**: Both methods are stochastic. Set random seeds and report parameters for reproducibility. Even with fixed seeds, different implementations may yield different results.
- **Barnes-Hut approximation (t-SNE)**: The naive t-SNE gradient computation is $O(n^2)$. The Barnes-Hut approximation reduces this to $O(n \log n)$ by grouping distant points, making t-SNE practical for datasets up to ~100K points.
- **Negative sampling (UMAP)**: UMAP uses negative sampling to approximate repulsive forces, achieving $O(n)$ effective complexity per epoch and making it practical for millions of points.
- **Early exaggeration (t-SNE)**: During the first 50-250 iterations, the $p_{ij}$ values are multiplied by a factor (typically 12), encouraging tight initial cluster formation. This is an important implementation detail that affects final layout quality.

## Common Misconceptions

- **"Distances between clusters are meaningful."** Neither t-SNE nor UMAP reliably preserves inter-cluster distances. Two clusters far apart in the plot may or may not be far apart in the original space. Only within-cluster neighborhoods are trustworthy.
- **"Cluster sizes reflect true data proportions."** t-SNE tends to equalize apparent cluster sizes regardless of the true number of points per cluster. UMAP is somewhat better but still not reliable for this.
- **"These methods can be used for general dimensionality reduction."** They are optimized for visualization (2-3 dimensions). For preprocessing before modeling, PCA or autoencoders are more appropriate because they provide stable, reproducible transformations and can handle new data points without re-running the entire embedding.
- **"t-SNE/UMAP results are definitive."** Different hyperparameters produce different plots. Always explore multiple parameter settings before drawing conclusions.
- **"Clusters in the plot are always real."** Both methods can create spurious visual clusters from continuous data, or split a single true cluster into multiple visual fragments. Always validate clusters with external evidence or quantitative metrics in the original space.
- **"Running longer always helps."** For t-SNE, too many iterations can lead to over-optimization where the embedding memorizes individual data points. The default of 1,000 iterations is usually sufficient.

## Connections to Other Concepts

- **Principal Component Analysis**: PCA is linear and preserves global variance; t-SNE/UMAP are nonlinear and preserve local neighborhoods. PCA is typically used as a preprocessing step before t-SNE/UMAP to reduce dimensionality and computational cost.
- **K-Means Clustering**: After producing a 2D embedding, K-means or DBSCAN is sometimes applied to the embedded coordinates for cluster assignment -- though this is controversial since the embedding distorts distances. Clustering in the original (or PCA-reduced) space is generally more reliable.
- **DBSCAN**: DBSCAN on UMAP embeddings is a common pipeline for discovering clusters in high-dimensional data, particularly in single-cell biology. The Leiden algorithm is another popular choice for community detection on the shared nearest-neighbor graph.
- **Anomaly Detection**: Outliers in t-SNE/UMAP plots (isolated points far from clusters) may indicate anomalies, though this should always be verified in the original feature space since embedding distortions can create spurious isolation.
- **Gaussian Mixture Models**: GMMs can be applied to UMAP embeddings for soft cluster assignment in the visualization space, though the same caveats about distance distortion apply.

## Implementation Notes

For t-SNE, scikit-learn provides `TSNE` with Barnes-Hut acceleration (default for $n > 1000$). Set `perplexity` between 5 and 50, `n_iter` to at least 1000 (default), and always use `init='pca'` for more stable results. The `openTSNE` library offers additional features including callbacks and faster performance.

For UMAP, the `umap-learn` Python package is the reference implementation. Key parameters: `n_neighbors` (default 15), `min_dist` (default 0.1), and `metric` (default 'euclidean'). UMAP supports a `transform` method for embedding new data points into an existing layout, which t-SNE does not natively support.

Always run PCA to 50-100 dimensions first. For very large datasets ($n > 500{,}000$), UMAP is the practical choice. Report all hyperparameters alongside any published visualization to ensure reproducibility.

## Further Reading

- van der Maaten and Hinton, "Visualizing Data using t-SNE" (2008) -- The original t-SNE paper.
- McInnes, Healy, and Melville, "UMAP: Uniform Manifold Approximation and Projection for Dimension Reduction" (2018) -- The UMAP paper with topological foundations.
- Wattenberg, Viegas, and Johnson, "How to Use t-SNE Effectively" (2016) -- Essential guide on interpreting t-SNE plots and avoiding common pitfalls (distill.pub).
- Kobak and Berens, "The Art of Using t-SNE for Single-Cell Transcriptomics" (2019) -- Practical advice for a major application domain.
- Linderman et al., "Fast Interpolation-Based t-SNE for Improved Visualization of Single-Cell RNA-seq Data" (2019) -- FIt-SNE, a faster implementation scaling to millions of points.
