# K-Nearest Neighbors

**One-Line Summary**: Classify by majority vote of the K closest training examples -- no training phase, all computation at prediction time.

**Prerequisites**: Distance metrics, basic probability, curse of dimensionality.

## What Is K-Nearest Neighbors?

Imagine moving to a new city and trying to guess whether a neighborhood is expensive. The simplest strategy: look at the K houses closest to the one you are evaluating and take the average of their prices. K-Nearest Neighbors (KNN) does exactly this -- it classifies a new point by polling its K closest neighbors in the training data and taking a majority vote.

Formally, given a query point $x_q$, KNN finds the set $N_K(x_q)$ of the $K$ training points closest to $x_q$ under some distance metric $d(x, x')$, then predicts:

$$\hat{y} = \arg\max_c \sum_{i \in N_K(x_q)} \mathbb{1}[y_i = c]$$

KNN is a **lazy learner** (or instance-based learner): it stores the entire training set and defers all computation to prediction time. There is no explicit model-fitting step.

## How It Works

### The Algorithm

1. **Store** the entire training set $\{(x_i, y_i)\}_{i=1}^n$.
2. **Given** a query $x_q$, compute the distance $d(x_q, x_i)$ to every training point.
3. **Select** the $K$ training points with the smallest distances.
4. **Vote**: return the most common class among those $K$ neighbors.

The simplicity is the appeal: no parameters to fit, no assumptions about the data distribution. But this simplicity comes with real computational costs.

### Choice of K

The hyperparameter $K$ controls the bias-variance tradeoff:

- **$K = 1$**: The decision boundary is highly irregular, perfectly fitting the training data (zero training error). This gives low bias but high variance.
- **Large $K$**: The boundary smooths out, approaching the global majority class as $K \to n$. This gives high bias but low variance.
- **Odd $K$ for binary classification**: Avoids ties in the vote. For multiclass, ties can be broken by distance-weighted voting.

A common default is $K = \sqrt{n}$, but cross-validation is the reliable way to choose $K$. The optimal $K$ depends on the noise level and the complexity of the true decision boundary.

### Distance Metrics

The choice of distance metric fundamentally shapes KNN's behavior:

- **Euclidean** ($L_2$): $d(x, x') = \sqrt{\sum_{j=1}^d (x_j - x'_j)^2}$ -- the default choice. Sensitive to feature scale.
- **Manhattan** ($L_1$): $d(x, x') = \sum_{j=1}^d |x_j - x'_j|$ -- more robust to outliers in individual features.
- **Minkowski** ($L_p$): $d(x, x') = \left(\sum_{j=1}^d |x_j - x'_j|^p\right)^{1/p}$ -- generalizes both ($p=1$ is Manhattan, $p=2$ is Euclidean).
- **Cosine distance**: $d(x, x') = 1 - \frac{x \cdot x'}{\|x\| \|x'\|}$ -- useful for text data where magnitude is irrelevant.

Feature scaling (standardization or min-max normalization) is essential for Euclidean and Manhattan distances. Without it, features with larger ranges dominate the distance calculation.

### Weighted KNN

Standard KNN gives equal weight to all $K$ neighbors, but closer neighbors are more informative. Weighted KNN assigns weight inversely proportional to distance:

$$\hat{y} = \arg\max_c \sum_{i \in N_K(x_q)} w_i \cdot \mathbb{1}[y_i = c], \quad w_i = \frac{1}{d(x_q, x_i)^2}$$

This softens the hard $K$ boundary and often improves performance. It also reduces sensitivity to the exact value of $K$.

### Curse of Dimensionality

KNN suffers acutely from the curse of dimensionality. In high dimensions:

- Distances between points converge: for uniformly distributed data in $d$ dimensions, the ratio of the nearest to the farthest neighbor approaches 1 as $d$ grows. All points become "equally far."
- The volume of a fixed-radius neighborhood grows exponentially, so maintaining $K$ neighbors at a fixed density requires exponentially more data.
- Meaningful "locality" breaks down. A neighbor in 1000-dimensional space may share almost nothing in common with the query point.

Dimensionality reduction (PCA, t-SNE) or feature selection is often necessary before applying KNN in high-dimensional settings.

### Efficient Search Structures

Brute-force KNN computes $O(nd)$ distances per query, which is prohibitive for large datasets. Tree-based data structures accelerate this:

- **KD-trees**: Partition the space along coordinate axes using a binary tree. Average query time is $O(d \log n)$ in low dimensions, but degrades to $O(dn)$ when $d > 20$ or so.
- **Ball trees**: Partition using hyperspheres instead of axis-aligned planes. More effective in moderate dimensions than KD-trees because the partitions adapt to the data geometry.
- **Locality-sensitive hashing (LSH)**: Approximate nearest neighbors in sublinear time by hashing similar points to the same bucket. Trades exactness for speed.

For very large datasets, approximate nearest neighbor libraries (FAISS, Annoy, ScaNN) are standard in production.

### KNN for Regression

KNN extends naturally to regression by replacing majority vote with averaging:

$$\hat{y} = \frac{1}{K} \sum_{i \in N_K(x_q)} y_i$$

or with distance-weighted averaging. The same bias-variance tradeoff with $K$ applies. KNN regression produces piecewise-constant predictions (for unweighted) or smooth predictions (for weighted), but never extrapolates beyond the range of training data.

## Why It Matters

KNN is the simplest non-parametric classifier, requiring zero assumptions about the data distribution. It is a universal approximator: as $n \to \infty$ and $K/n \to 0$ (with $K \to \infty$), the KNN error rate converges to at most twice the Bayes optimal error rate for $K=1$, and to the Bayes rate itself for growing $K$. This theoretical guarantee, proved by Cover and Hart in 1967, makes it an important reference algorithm, even when it is not the production choice due to computational costs.

In practice, KNN serves as an indispensable sanity check: if a sophisticated model cannot outperform KNN, the problem may lack learnable structure, or the model may be poorly configured. KNN is also used in recommender systems (finding similar users or items) and in missing value imputation (replacing a missing feature with the average of its K nearest neighbors' values).

## Key Technical Details

- **Training time**: $O(1)$ (just store the data). **Prediction time**: $O(nd)$ brute-force, $O(d \log n)$ with KD-trees in low dimensions.
- **Memory**: $O(nd)$ -- the entire training set must be stored.
- **No feature importance**: KNN provides no insight into which features drive predictions.
- **Sensitive to irrelevant features**: Every feature contributes to the distance equally (unless weighted). Feature selection is critical.
- **Non-parametric**: The model complexity grows with the data, which is both a strength and a liability.
- **Boundary shape**: Decision boundaries are piecewise linear (Voronoi-like), becoming smoother as $K$ increases.
- **Ties**: When $K$ is even or the number of classes exceeds 2, tie-breaking strategies (random, distance-weighted, or nearest single neighbor) are needed.

## Common Misconceptions

- **"KNN has no training phase, so it's fast."** The training phase is trivial, but prediction is expensive: $O(nd)$ per query without acceleration structures. In production, this is often the bottleneck.
- **"K=1 always overfits."** In low-noise settings with abundant data, $K=1$ can actually perform very well. Overfitting depends on the noise level relative to the data density.
- **"KNN works well in high dimensions."** The curse of dimensionality makes KNN unreliable when $d$ is large. Distances lose meaning, and the method degrades.
- **"All distance metrics work the same."** The metric choice can dramatically change results. Euclidean distance on raw text features is nearly meaningless; cosine similarity is far more appropriate.

## Connections to Other Concepts

- **Decision Trees**: Both are non-parametric and can capture complex boundaries, but trees partition the space recursively while KNN relies on local neighborhoods. Trees are faster at prediction time.
- **Kernel Methods**: KNN can be viewed as a kernel method with a data-dependent kernel. The RBF kernel SVM is a smoother, more principled version of weighted KNN.
- **Naive Bayes**: Naive Bayes makes strong distributional assumptions and is very fast; KNN makes no assumptions but is computationally heavy. They represent opposite ends of the parametric/non-parametric spectrum.
- **Logistic Regression**: Linear boundary vs. arbitrarily complex boundary. Logistic regression is preferred when the true boundary is approximately linear; KNN is preferred for complex, nonlinear boundaries with sufficient data.

## Further Reading

- Cover, Hart, "Nearest Neighbor Pattern Classification" (1967) -- The foundational paper proving the asymptotic error bound for 1-NN.
- Hastie, Tibshirani, Friedman, "The Elements of Statistical Learning" (2009) -- Chapter 13 on prototype methods and nearest neighbors.
- Indyk, Motwani, "Approximate Nearest Neighbors: Towards Removing the Curse of Dimensionality" (1998) -- Introduces locality-sensitive hashing.
- Friedman, Bentley, Finkel, "An Algorithm for Finding Best Matches in Logarithmic Expected Time" (1977) -- The KD-tree paper.
