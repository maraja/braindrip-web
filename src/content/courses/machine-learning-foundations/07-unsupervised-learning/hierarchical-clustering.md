# Hierarchical Clustering

**One-Line Summary**: Building a tree of nested clusters via agglomerative merging or divisive splitting -- revealing multi-scale data structure.

**Prerequisites**: Distance metrics, K-means clustering (for comparison), basic graph theory.

## What Is Hierarchical Clustering?

Imagine organizing a library without predefined categories. You could start by grouping the two most similar books together, then merging the next most similar pair or group, continuing until everything is in one collection. At any point, you can slice the hierarchy at a chosen level to get a flat clustering. This bottom-up construction is hierarchical clustering.

Unlike K-means, which demands you specify $K$ upfront, hierarchical clustering produces a complete hierarchy of partitions -- from $n$ singleton clusters to a single all-encompassing cluster. The result is a tree structure called a **dendrogram** that encodes relationships at every granularity.

## How It Works

### Agglomerative (Bottom-Up) Approach

The standard algorithm proceeds as follows:

1. Start with $n$ clusters, each containing a single point.
2. Compute the distance between every pair of clusters.
3. Merge the two closest clusters into one.
4. Recompute distances involving the new cluster.
5. Repeat steps 3-4 until a single cluster remains.

The critical design choice is the **linkage criterion** -- how distance between two clusters $A$ and $B$ is defined.

### Linkage Criteria

- **Single linkage** (nearest neighbor):
$$d(A, B) = \min_{a \in A, b \in B} \|a - b\|$$
Tends to produce elongated, chain-like clusters. Sensitive to noise bridges between clusters.

- **Complete linkage** (farthest neighbor):
$$d(A, B) = \max_{a \in A, b \in B} \|a - b\|$$
Produces compact, roughly equal-diameter clusters. Sensitive to outliers.

- **Average linkage** (UPGMA):
$$d(A, B) = \frac{1}{|A||B|} \sum_{a \in A} \sum_{b \in B} \|a - b\|$$
A compromise between single and complete linkage. Robust but computationally heavier.

- **Ward's linkage**:
$$d(A, B) = \sqrt{\frac{2|A||B|}{|A|+|B|}} \|\mu_A - \mu_B\|$$
Minimizes the increase in total within-cluster variance upon merging. Tends to produce balanced, spherical clusters and is often the default choice.

### Divisive (Top-Down) Approach

Start with all points in one cluster and recursively split. At each step, choose the cluster with the largest diameter (or highest variance) and partition it -- often using K-means with $K=2$ or by finding the point most dissimilar to the rest. Divisive methods are less common because they are computationally more expensive and require a splitting heuristic, but they can produce more meaningful top-level structure.

### Dendrogram Interpretation

A dendrogram is a tree diagram where:
- Leaves represent individual data points.
- The height at which two branches merge represents the distance at which those clusters were joined.
- A horizontal cut at height $h$ yields a flat clustering: every subtree below the cut is one cluster.

To choose the number of clusters, look for large gaps in merge heights -- tall vertical bars in the dendrogram indicate well-separated clusters. This is the hierarchical analog of the elbow method.

### The Lance-Williams Recurrence

Rather than recomputing all pairwise distances after each merge, the Lance-Williams formula provides a unified update rule. When clusters $A$ and $B$ merge into $A \cup B$, the distance to any other cluster $C$ is:

$$d(A \cup B, C) = \alpha_A \, d(A, C) + \alpha_B \, d(B, C) + \beta \, d(A, B) + \gamma \, |d(A, C) - d(B, C)|$$

Different linkage criteria correspond to different values of $\alpha_A, \alpha_B, \beta, \gamma$. For example, single linkage uses $\alpha_A = \alpha_B = 0.5$, $\beta = 0$, $\gamma = -0.5$; Ward's uses $\alpha_A = \frac{|A| + |C|}{|A| + |B| + |C|}$, $\alpha_B = \frac{|B| + |C|}{|A| + |B| + |C|}$, $\beta = \frac{-|C|}{|A| + |B| + |C|}$, $\gamma = 0$.

### Practical Example

In gene expression analysis, researchers cluster genes based on expression profiles across conditions. Using average linkage with Pearson correlation distance, the resulting dendrogram groups co-expressed genes into functional modules. Cutting at different heights reveals different levels of biological organization -- from tight co-regulatory groups to broad functional categories like "immune response" or "cell cycle."

### When to Prefer Hierarchical Over K-Means

Choose hierarchical clustering when:
- The natural number of clusters is unknown and you want to explore multiple granularities from a single run.
- You need a nested, interpretable structure (taxonomy, organizational hierarchy).
- The dataset is small enough (under ~10,000 points) that $O(n^2)$ space is acceptable.
- Different linkage criteria let you encode prior beliefs about cluster shape (elongated vs. compact).

Choose K-means when scalability, speed, or simplicity is paramount, or when you have a strong prior on $K$.

## Why It Matters

Hierarchical clustering is indispensable when the data has multi-scale structure -- for instance, in taxonomy (species, genus, family), document organization, or gene expression analysis. It requires no a priori choice of $K$, and the dendrogram provides a rich, interpretable summary of data relationships. In exploratory data analysis, the dendrogram itself is often more valuable than any single flat clustering.

## Key Technical Details

- **Naive complexity**: $O(n^3)$ time and $O(n^2)$ space for the distance matrix
- **Optimized**: With priority queues and nearest-neighbor chains, single linkage achieves $O(n^2)$, and average/complete linkage achieve $O(n^2 \log n)$
- **Monotonicity**: For single, complete, average, and Ward's linkage, merge distances increase monotonically -- ensuring the dendrogram has no inversions
- **Cophenetic correlation**: Measures how faithfully the dendrogram preserves pairwise distances; higher values indicate better representation
- **Irreversibility**: Once two clusters are merged (agglomerative) or split (divisive), the decision is permanent. Early mistakes propagate through the entire hierarchy
- **Distance matrix storage**: The $n \times n$ distance matrix requires $O(n^2)$ memory. For $n = 50{,}000$, this is approximately 10 GB with 64-bit floats, setting a practical upper bound on dataset size
- **Scalable approximations**: BIRCH (Balanced Iterative Reducing and Clustering using Hierarchies) pre-summarizes the data into cluster feature vectors, enabling hierarchical clustering on datasets too large for the full distance matrix

## Common Misconceptions

- **"Hierarchical clustering always gives better results than K-means."** Not necessarily. Ward's linkage on spherical clusters gives similar results to K-means. The advantage is flexibility and interpretability, not universal superiority.
- **"Single linkage is a poor choice."** It excels at detecting elongated and irregular clusters. The chaining problem is a weakness only when clusters are compact and well-separated.
- **"The dendrogram gives one correct answer."** Different linkage criteria produce different dendrograms from the same data. The choice of linkage encodes your assumptions about cluster shape.
- **"Hierarchical clustering scales well."** The $O(n^2)$ space requirement alone makes it impractical for datasets much beyond $10^4$--$10^5$ points without approximation.

## Connections to Other Concepts

- `k-means-clustering.md`: K-means gives a flat partition and requires specifying $K$; hierarchical clustering gives a full tree. Ward's linkage produces K-means-like clusters. A common hybrid approach uses hierarchical clustering on a small sample to estimate $K$, then runs K-means on the full dataset.
- `dbscan.md`: Single-linkage hierarchical clustering is closely related to DBSCAN; both are based on connectivity. HDBSCAN (hierarchical DBSCAN) explicitly builds a hierarchy from density-based clusters, combining the strengths of both paradigms.
- `gaussian-mixture-models.md`: GMMs provide soft probabilistic assignments; hierarchical clustering provides hard, nested assignments at multiple scales. Bayesian hierarchical clustering extends the idea with probabilistic merge decisions.
- `anomaly-detection.md`: Outliers appear as singletons or small clusters that merge only at high distances in the dendrogram, providing a natural anomaly signal.
- `principal-component-analysis.md`: For high-dimensional data, applying PCA before hierarchical clustering reduces both computational cost and noise, often improving dendrogram quality.

## Implementation Notes

In scikit-learn, `AgglomerativeClustering` supports Ward's, complete, average, and single linkage. For dendrogram visualization, use `scipy.cluster.hierarchy.dendrogram` with the linkage matrix from `scipy.cluster.hierarchy.linkage`. When working with precomputed distance matrices (for non-Euclidean metrics), note that Ward's linkage requires Euclidean distances -- use average or complete linkage instead.

For datasets in the range of 10,000-50,000 points, the computation is feasible on a modern laptop. Beyond 50,000, consider using BIRCH as a preprocessing step or switching to scalable alternatives like mini-batch K-means with hierarchical postprocessing.

## Further Reading

- Johnson, "Hierarchical Clustering Schemes" (1967) -- Foundational paper establishing linkage-based agglomerative methods.
- Murtagh and Contreras, "Algorithms for Hierarchical Clustering: An Overview" (2012) -- Comprehensive survey of computational approaches and optimizations.
- Ward, "Hierarchical Grouping to Optimize an Objective Function" (1963) -- The original Ward's method paper motivating variance-based merging.
- Müllner, "Modern Hierarchical, Agglomerative Clustering Algorithms" (2011) -- Efficient algorithms with practical implementation guidance.
- Zhang, Ramakrishnan, and Livny, "BIRCH: An Efficient Data Clustering Method for Very Large Databases" (1996) -- Scalable hierarchical clustering via clustering features.
