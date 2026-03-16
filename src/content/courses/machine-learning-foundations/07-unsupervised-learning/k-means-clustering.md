# K-Means Clustering

**One-Line Summary**: Partitioning data into K groups by iteratively assigning points to nearest centroids -- simple, fast, and surprisingly effective.

**Prerequisites**: Euclidean distance, basic linear algebra, expectation-maximization (conceptual).

---

## What Is K-Means Clustering?

Imagine you dump a bag of mixed coins onto a table and want to sort them into piles. You start by placing K cups at random positions, then push each coin toward its nearest cup. After every coin is assigned, you move each cup to the center of its pile. Repeat until nothing changes. That is K-means.

Formally, K-means seeks to partition $n$ observations $\{x_1, \ldots, x_n\}$ into $K$ disjoint clusters $C_1, \ldots, C_K$ by minimizing the within-cluster sum of squares (WCSS):

$$J = \sum_{k=1}^{K} \sum_{x_i \in C_k} \|x_i - \mu_k\|^2$$

where $\mu_k = \frac{1}{|C_k|} \sum_{x_i \in C_k} x_i$ is the centroid of cluster $k$.

## How It Works

### Lloyd's Algorithm (1982)

The standard K-means procedure, known as Lloyd's algorithm, alternates two steps:

1. **Assignment step**: Assign each point to the cluster whose centroid is nearest:
$$C_k^{(t)} = \{x_i : \|x_i - \mu_k^{(t)}\|^2 \leq \|x_i - \mu_j^{(t)}\|^2 \;\forall\; j \neq k\}$$

2. **Update step**: Recompute centroids as the mean of assigned points:
$$\mu_k^{(t+1)} = \frac{1}{|C_k^{(t)}|} \sum_{x_i \in C_k^{(t)}} x_i$$

These steps repeat until assignments stabilize. Each iteration is guaranteed to decrease (or maintain) $J$, and since there are finitely many partitions, the algorithm always converges -- though possibly to a local minimum.

### K-Means++ Initialization

Random initialization often leads to poor local minima. K-means++ (Arthur and Vassilvitskii, 2007) provides a principled seeding strategy:

1. Choose the first centroid uniformly at random from the data.
2. For each remaining centroid, select a point with probability proportional to $D(x)^2$, where $D(x)$ is the distance from $x$ to its nearest existing centroid.
3. Repeat until $K$ centroids are chosen.

This yields an $O(\log K)$-competitive approximation to the optimal WCSS in expectation, and in practice dramatically reduces convergence time.

### Choosing K

There is no single correct method; several heuristics exist:

- **Elbow method**: Plot WCSS vs. $K$ and look for a "bend." The point where adding another cluster yields diminishing returns suggests a natural $K$. This is often subjective.
- **Silhouette score**: For each point, compute $s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$, where $a(i)$ is the mean intra-cluster distance and $b(i)$ is the mean nearest-cluster distance. Average over all points; higher is better.
- **Gap statistic** (Tibshirani et al., 2001): Compare WCSS to that of a reference null distribution (uniform random data). The optimal $K$ maximizes the gap between observed and reference.
- **Information-theoretic criteria**: AIC and BIC can be applied when K-means is viewed as a special case of GMMs, penalizing the number of parameters to avoid overfitting.

### Mini-Batch K-Means

For large datasets, mini-batch K-means (Sculley, 2010) updates centroids using small random batches rather than the full dataset. Each iteration samples $b$ points, assigns them, and takes a weighted average update:

$$\mu_k \leftarrow \mu_k + \frac{1}{n_k}(x_i - \mu_k)$$

This trades a slight loss in cluster quality for significant speedup -- often 10-100x faster on millions of points. The quality loss is typically negligible: mini-batch K-means WCSS is usually within 1-3% of the full K-means result.

### Variants and Extensions

- **K-Medoids (PAM)**: Instead of centroids (means), use actual data points (medoids) as cluster representatives. This allows arbitrary distance metrics and is more robust to outliers, but at $O(n^2)$ cost per iteration.
- **Bisecting K-Means**: Start with one cluster, repeatedly split the cluster with the highest variance using K-means with $K=2$. Produces a hierarchical structure and often finds better solutions than direct K-means for large $K$.
- **Spherical K-Means**: Normalizes data to the unit hypersphere and uses cosine similarity. Widely used in text clustering where documents are represented as TF-IDF vectors.

### Practical Example

Consider clustering customer purchase data with features: annual spending, visit frequency, and average basket size. After standardizing features (zero mean, unit variance), run K-means++ with $K = 3$--$8$, compute silhouette scores, and select the $K$ with the highest average score. The resulting clusters might reveal segments like "high-value loyal customers," "occasional bargain shoppers," and "new customers exploring," each actionable for marketing.

## Why It Matters

K-means is the workhorse of unsupervised learning. Its $O(nKd)$ per-iteration cost makes it scalable to massive datasets. It serves as a preprocessing step for feature engineering (cluster assignments as features), vector quantization in image compression, and a baseline against which more sophisticated clustering methods are compared. Many real-world pipelines use K-means not because it is optimal, but because it is fast, interpretable, and good enough.

In vector quantization, K-means compresses data by replacing each point with its nearest centroid, reducing storage from $n \times d$ to $K \times d$ plus $n$ integer labels. This principle underlies image compression (color quantization), audio codebook design, and the product quantization technique used in approximate nearest-neighbor search for billion-scale retrieval systems.

K-means also serves as a building block for more sophisticated methods. In the bag-of-visual-words pipeline for image classification, K-means clusters local image descriptors (like SIFT features) to create a visual vocabulary. In document clustering, K-means on TF-IDF vectors groups articles by topic. Its simplicity makes it the go-to method for initial data exploration before committing to more complex models.

## Key Technical Details

- **Time complexity**: $O(nKdT)$ where $T$ is the number of iterations, $d$ is dimensionality
- **Space complexity**: $O(nK + Kd)$ for assignments and centroids -- very memory efficient
- **Convergence**: Guaranteed to a local minimum; global optimum is NP-hard in general even for $K = 2$
- **Typical iterations**: In practice, K-means converges in 10-100 iterations for most datasets, though worst-case iteration count can be exponential
- **Implicit assumption**: Clusters are spherical (isotropic) and roughly equal in size
- **Distance metric**: Standard K-means uses squared Euclidean; using other metrics requires K-medoids
- **Connection to EM**: K-means is a special case of EM for Gaussian mixture models with isotropic, equal-variance covariances and hard assignments
- **Sensitivity to outliers**: A single extreme outlier can pull a centroid far from the true cluster center. Consider robust alternatives like K-medoids or preprocessing to remove outliers before clustering

## Common Misconceptions

- **"K-means always finds the best clustering."** It converges to a local minimum. Run multiple times with different initializations and keep the best result (lowest $J$). In practice, 10-20 restarts with K-means++ initialization is sufficient.
- **"K-means works for any cluster shape."** It assumes roughly spherical clusters. Elongated, ring-shaped, or irregular clusters require methods like DBSCAN or spectral clustering.
- **"The elbow method gives a definitive K."** The elbow is often ambiguous. Use multiple criteria (elbow, silhouette, gap statistic) and domain knowledge together.
- **"K-means handles categorical data."** Standard K-means requires continuous features. K-modes or K-prototypes extend the idea to categorical data.
- **"More clusters are always better."** WCSS decreases monotonically with $K$ and reaches zero when $K = n$. The goal is not to minimize WCSS absolutely but to find a $K$ that balances compactness against interpretability.
- **"Feature scaling doesn't matter."** Because K-means uses Euclidean distance, features with larger scales dominate the clustering. Always standardize features to zero mean and unit variance unless you have a specific reason not to.

## Connections to Other Concepts

- `gaussian-mixture-models.md`: K-means is the hard-assignment, isotropic-covariance limit of GMMs. GMMs generalize K-means to soft assignments and arbitrary covariance structures. Understanding K-means first makes GMMs intuitive.
- `dbscan.md`: An alternative that discovers arbitrary shapes and does not require specifying $K$, at the cost of two other parameters ($\varepsilon$ and MinPts). DBSCAN also naturally labels outliers, which K-means cannot do.
- `principal-component-analysis.md`: Often used before K-means to reduce dimensionality and remove noise, improving both speed and cluster quality. PCA + K-means is one of the most common unsupervised pipelines.
- `hierarchical-clustering.md`: Provides a multi-resolution view of cluster structure, while K-means gives a single flat partition. Ward's linkage in hierarchical clustering minimizes the same variance objective as K-means.
- `tsne-and-umap.md`: K-means is sometimes applied to low-dimensional embeddings from t-SNE or UMAP, though this is controversial since these embeddings distort distances.
- `anomaly-detection.md`: Points far from all centroids (high distance to nearest centroid) can serve as a simple anomaly score, though dedicated methods are more principled.

## Implementation Notes

In scikit-learn, the default `KMeans` uses K-means++ initialization and runs 10 restarts (`n_init=10`), selecting the best result. For large datasets (millions of points), switch to `MiniBatchKMeans` with a batch size of 1,000-10,000. Always scale features with `StandardScaler` before clustering. Monitor convergence by checking the inertia (WCSS) and the number of iterations used.

When K-means produces empty clusters (a centroid with no assigned points), most implementations reinitialize the orphaned centroid to a random data point and continue. This is rare with K-means++ initialization but can occur with unlucky random seeds or highly imbalanced data.

## Further Reading

- MacQueen, "Some Methods for Classification and Analysis of Multivariate Observations" (1967) -- The original K-means paper.
- Arthur and Vassilvitskii, "k-means++: The Advantages of Careful Seeding" (2007) -- The initialization method used in virtually all modern implementations.
- Sculley, "Web-Scale K-Means Clustering" (2010) -- Mini-batch variant for large-scale applications.
- Tibshirani, Walther, and Hastie, "Estimating the Number of Clusters via the Gap Statistic" (2001) -- A principled approach to choosing K.
- Bishop, *Pattern Recognition and Machine Learning* (2006), Chapter 9 -- Derives K-means as a limit of EM for Gaussian mixtures.
- Jain, "Data Clustering: 50 Years Beyond K-Means" (2010) -- Retrospective on K-means and its lasting influence on the clustering landscape.
