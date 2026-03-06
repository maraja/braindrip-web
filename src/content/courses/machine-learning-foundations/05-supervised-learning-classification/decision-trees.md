# Decision Trees

**One-Line Summary**: Recursive binary splitting that produces interpretable if-then rules -- the building block of ensemble methods.

**Prerequisites**: Basic probability, entropy and information theory, greedy algorithms.

## What Is a Decision Tree?

Imagine diagnosing a car problem by asking a series of yes/no questions: "Does the engine start?" If no, "Is the battery dead?" If yes, "Does it make a clicking sound?" Each question narrows the possibilities until you reach a diagnosis. A decision tree works the same way: it recursively partitions the feature space using binary questions about individual features, forming a tree of if-then rules that terminate in class predictions (or regression values) at the leaves.

Formally, a decision tree is a directed acyclic graph where each internal node applies a test $x_j \leq t$ (for feature $j$ at threshold $t$), each branch corresponds to the test outcome, and each leaf node assigns a class label (classification) or a continuous value (regression). The prediction for a new input follows a path from root to leaf.

## How It Works

### Greedy Splitting (The CART Algorithm)

The **Classification and Regression Trees (CART)** algorithm builds the tree top-down via greedy recursive splitting:

1. **For each feature** $j$ and each possible threshold $t$, split the current node's data into two groups: $\{x : x_j \leq t\}$ and $\{x : x_j > t\}$.
2. **Evaluate** each split using an impurity measure (below).
3. **Select** the feature and threshold that produce the largest decrease in impurity.
4. **Recurse** on each child node until a stopping criterion is met.

The greedy approach does not guarantee the globally optimal tree (finding the optimal tree is NP-hard), but it is fast and works well in practice.

### Splitting Criteria

The impurity measure determines which splits the algorithm prefers. Let $p_c$ be the fraction of samples in a node belonging to class $c$.

**Gini Impurity**:
$$G = 1 - \sum_{c=1}^C p_c^2$$

Gini impurity measures the probability that a randomly chosen sample would be misclassified if labeled according to the distribution of classes in the node. It is zero when the node is pure (all one class) and maximized when classes are uniformly distributed.

**Entropy (Information Gain)**:
$$H = -\sum_{c=1}^C p_c \log_2 p_c$$

Entropy measures the uncertainty in the class distribution. The **information gain** of a split is the reduction in entropy:

$$IG = H(\text{parent}) - \sum_{k \in \{\text{left, right}\}} \frac{n_k}{n} H(\text{child}_k)$$

Gini and entropy typically produce very similar trees. Gini is slightly faster to compute (no logarithm), so it is the default in most implementations.

**MSE for Regression Trees**:
For regression, the impurity of a node is the variance (or mean squared error) of the target values:

$$\text{MSE} = \frac{1}{n} \sum_{i=1}^n (y_i - \bar{y})^2$$

The split that minimizes the weighted sum of child MSE values is selected. Leaf predictions are the mean of the target values in that leaf.

### Stopping Criteria

Without constraints, a tree will keep splitting until every leaf is pure, which perfectly memorizes the training data (overfitting). Common stopping criteria include:

- **Maximum depth**: Limit the number of levels in the tree.
- **Minimum samples per leaf**: Require at least $m$ samples in every leaf.
- **Minimum impurity decrease**: Only split if the impurity reduction exceeds a threshold.
- **Maximum number of leaf nodes**: Cap the total number of leaves.

### Pruning

Stopping criteria (pre-pruning) can be too aggressive or too conservative. **Post-pruning** grows a full tree and then removes branches that do not improve generalization:

**Cost-Complexity Pruning (Minimal Cost-Complexity Pruning)**:
Define the cost-complexity criterion for subtree $T$:

$$R_\alpha(T) = R(T) + \alpha \, |T|$$

where $R(T)$ is the total misclassification rate (or MSE) of the tree, $|T|$ is the number of leaves, and $\alpha \geq 0$ is a complexity parameter. For each $\alpha$, there is a smallest subtree that minimizes $R_\alpha(T)$. The optimal $\alpha$ is chosen via cross-validation.

This is analogous to L1 regularization: $\alpha$ penalizes complexity (number of leaves) just as $\lambda$ penalizes weight magnitudes.

### Feature Importance

Decision trees provide a natural measure of feature importance. The importance of feature $j$ is the total reduction in impurity across all nodes that split on feature $j$:

$$\text{Importance}(j) = \sum_{\text{nodes } t \text{ splitting on } j} n_t \cdot \Delta \text{Impurity}(t)$$

normalized to sum to 1 across all features. This is computed as a byproduct of training and requires no additional computation.

### Handling Missing Values

CART handles missing values via **surrogate splits**: at each node, the algorithm identifies alternative features that produce splits most similar to the chosen split. When a test-time example has a missing value for the primary split feature, the surrogate split is used instead. This makes decision trees one of the few algorithms that handle missing data natively without imputation.

### Computational Complexity

- **Training**: For $n$ samples and $d$ features, each split requires sorting each feature ($O(n \log n)$ per feature) and evaluating all thresholds. Total: $O(d \cdot n \log n)$ per node, and $O(d \cdot n \log^2 n)$ for a balanced tree.
- **Prediction**: $O(\text{depth})$ per sample -- typically $O(\log n)$ for a balanced tree.

## Why It Matters

Decision trees are uniquely interpretable: you can follow the path from root to leaf and understand exactly why a prediction was made. In regulated domains (healthcare, finance, criminal justice), this transparency is essential. But trees are more than standalone models -- they are the foundation of the most powerful ensemble methods in machine learning. Random forests (bagging many trees) and gradient-boosted trees (XGBoost, LightGBM, CatBoost) consistently dominate tabular data competitions and production systems. Understanding single trees is prerequisite to understanding these ensembles.

## Key Technical Details

- **Axis-aligned splits**: Standard trees split on one feature at a time, producing rectangular decision regions. Oblique trees split on linear combinations but are more expensive.
- **Instability**: Small changes in data can produce very different trees. This is a feature, not a bug, for ensemble methods that exploit this variance.
- **Categorical features**: Trees handle categorical features naturally by testing subset membership (which categories go left vs. right).
- **No feature scaling needed**: Because splits are based on thresholds within each feature, trees are invariant to monotone transformations of features.
- **Extrapolation**: Regression trees cannot extrapolate beyond the range of training data. Predictions outside the training range are clamped to the nearest leaf value.

## Common Misconceptions

- **"Decision trees are weak learners."** A single deep tree can have very high capacity and overfit badly. The term "weak learner" refers to shallow (depth-1 or depth-2) trees used in boosting, not trees in general.
- **"Gini impurity and entropy always give different trees."** In practice, they produce nearly identical trees. The difference is rarely significant.
- **"Pruning always improves test accuracy."** Pruning improves generalization on average, but on any specific dataset, a pruned tree might perform slightly worse if the unpruned tree happened to capture useful structure.
- **"Trees can model any function well."** Trees approximate smooth functions with staircase-like boundaries, which requires many splits. They are poorly suited for problems where the decision boundary is a smooth curve (where SVMs or neural nets excel).

## Connections to Other Concepts

- **Logistic Regression**: Trees capture nonlinear boundaries automatically; logistic regression requires explicit feature engineering. However, logistic regression provides smooth probability estimates, while tree probabilities are piecewise constant.
- **K-Nearest Neighbors**: Both are non-parametric, but trees partition the space globally (each leaf is a region) while KNN uses local neighborhoods. Trees are much faster at prediction time.
- **Support Vector Machines**: SVMs find a single optimal boundary with margin; trees find a piecewise axis-aligned boundary. For tabular data, ensembles of trees often outperform SVMs.
- **Kernel Methods**: Kernel SVMs produce smooth nonlinear boundaries; trees produce jagged, axis-aligned boundaries. The choice depends on the problem geometry.
- **Multi-Class Classification**: Trees are natively multiclass -- no wrapper needed. Each leaf simply stores the majority class (or the class distribution).

## Further Reading

- Breiman, Friedman, Stone, Olshen, "Classification and Regression Trees" (1984) -- The original CART book. Foundational and still relevant.
- Quinlan, "C4.5: Programs for Machine Learning" (1993) -- Introduces the C4.5 algorithm with entropy-based splitting and rule extraction.
- Hastie, Tibshirani, Friedman, "The Elements of Statistical Learning" (2009) -- Chapter 9 provides an excellent treatment of tree-based methods.
- Louppe, "Understanding Random Forests" (2014) -- PhD thesis with deep analysis of tree-based feature importance and ensemble properties.
