# Random Forests

**One-Line Summary**: Bagged decision trees with random feature subsets -- robust, parallelizable, and hard to overfit with more trees.

**Prerequisites**: Decision trees, bagging and bootstrap, variance-bias tradeoff, feature importance concepts.

## What Is Random Forests?

Suppose you are assembling a panel of experts to diagnose a complex case. If all experts have the same training background, they will make the same mistakes. But if each expert specializes in different aspects -- one focuses on symptoms, another on lab results, a third on patient history -- their collective judgment is far more reliable because their errors are uncorrelated.

Random Forests, introduced by Leo Breiman in 2001, operationalize exactly this idea. They extend bagging by training each decision tree not only on a different bootstrap sample but also by restricting each split to a random subset of features. This **feature randomization** decorrelates the trees, breaking past the variance floor that limits ordinary bagging.

## How It Works

### The Random Forest Algorithm

1. For $b = 1, 2, \ldots, B$:
   - Draw a bootstrap sample $D^{*}_b$ of size $n$ from the training data $D$.
   - Grow a decision tree $T_b$ on $D^{*}_b$, but at each internal node:
     - Select $m$ features uniformly at random from the full set of $p$ features.
     - Choose the best split among only those $m$ features.
     - Split the node. Do **not** prune the tree.
2. Output the ensemble:
   - **Regression**: $\hat{f}_{\text{RF}}(x) = \frac{1}{B}\sum_{b=1}^{B} T_b(x)$
   - **Classification**: $\hat{f}_{\text{RF}}(x) = \text{majority vote of } \{T_b(x)\}_{b=1}^B$

### Random Feature Selection

The key hyperparameter is $m$, the number of candidate features at each split:

- **Classification**: $m = \lfloor\sqrt{p}\rfloor$ (Breiman's default recommendation)
- **Regression**: $m = \lfloor p/3 \rfloor$
- **Extreme case** $m = 1$: Extremely Randomized Trees (Extra-Trees), which select both the feature and split point randomly.

When $m = p$, Random Forest reduces to standard bagging of decision trees.

### The Decorrelation Effect

Recall from the bagging analysis that the variance of the ensemble average is:

$$\text{Var}(\hat{f}_{\text{RF}}) = \rho \sigma^2 + \frac{1 - \rho}{B}\sigma^2$$

By restricting each split to a random subset of features, Random Forests reduce the pairwise correlation $\rho$ between trees. If the dataset has one dominant feature, bagged trees will all split on it first, producing highly correlated trees. Random Forests force trees to explore alternative splitting features, creating genuinely diverse models. This pushes $\rho$ lower, and the irreducible first term $\rho\sigma^2$ shrinks accordingly.

### Feature Importance

Random Forests provide two built-in measures of feature relevance:

**Permutation importance (Mean Decrease Accuracy):** For each feature $j$, randomly shuffle its values in the OOB data and measure the increase in OOB error:

$$\text{Imp}(j) = \frac{1}{B}\sum_{b=1}^{B}\left[\text{Err}_{\text{OOB}}^{(\pi_j)}(T_b) - \text{Err}_{\text{OOB}}(T_b)\right]$$

This measures how much the model depends on the actual values of feature $j$. It is generally considered more reliable but computationally expensive.

**Impurity-based importance (Mean Decrease Impurity):** Sum the reduction in the splitting criterion (Gini impurity or MSE) across all nodes where feature $j$ is used, averaged over all trees:

$$\text{MDI}(j) = \frac{1}{B}\sum_{b=1}^{B}\sum_{t \in T_b} \mathbb{1}[\text{split feature at } t = j] \cdot \Delta I(t)$$

This is faster to compute but has a known **bias toward high-cardinality features** (features with many unique values get more opportunities to split).

### OOB Error Estimate

Like bagging, Random Forests leverage out-of-bag samples for internal validation. Each tree $T_b$ was not trained on approximately 36.8% of the data. Aggregating OOB predictions across all trees gives an unbiased estimate of generalization error without requiring a separate test set or cross-validation.

### Proximity Matrix

Random Forests can compute an $n \times n$ proximity matrix where entry $(i, j)$ counts how often observations $i$ and $j$ land in the same terminal node across all trees, normalized by $B$. This matrix enables:
- Outlier detection (observations with low average proximity to their class)
- Missing value imputation (weighted average using proximities as weights)
- Low-dimensional visualization via multidimensional scaling

## Why It Matters

Random Forests are one of the most successful off-the-shelf algorithms in machine learning. They consistently rank among top performers on tabular data, require minimal hyperparameter tuning, handle mixed feature types gracefully, and provide built-in feature importance and error estimation. Their embarrassingly parallel training makes them efficient on modern hardware. The algorithm is remarkably resistant to overfitting: adding more trees never degrades performance, it only improves or plateaus.

## Key Technical Details

- **Key hyperparameters**: `n_estimators` (number of trees, typically 100--1000), `max_features` ($m$, the number of candidate features per split), `max_depth` (tree depth limit, often left unlimited), `min_samples_leaf` (minimum leaf size for regularization).
- **Overfitting behavior**: Increasing $B$ (more trees) does not overfit. However, growing very deep trees with small `min_samples_leaf` can increase individual tree variance, though the ensemble averaging mitigates this.
- **Missing values**: Random Forests can handle missing data through surrogate splits or proximity-based imputation, unlike many other algorithms.
- **Scalability**: Training is $O(B \cdot n \cdot m \cdot \log n)$ where each tree considers $m$ features at each of $O(\log n)$ depth levels across $n$ samples.
- **Categorical features**: Breiman's original formulation handles categorical features natively by considering all possible binary partitions of categories at each split.

## Common Misconceptions

- **"Random Forests cannot overfit."** Individual trees in the forest can overfit. The ensemble averaging prevents overfitting with respect to $B$ (number of trees), but excessively deep trees on small datasets can still cause the ensemble to overfit. Tuning `max_depth` and `min_samples_leaf` remains important.

- **"Feature importance rankings are definitive."** Impurity-based importance is biased toward high-cardinality and correlated features. Permutation importance is more reliable but can underestimate the importance of correlated feature groups. Use both measures and interpret cautiously.

- **"Random Forests are always inferior to gradient boosting."** While gradient boosting (XGBoost, LightGBM) often wins competitions on tabular data, Random Forests are more robust to hyperparameter choices, easier to parallelize, and more resistant to overfitting. For many practical applications, Random Forests are the better default choice.

- **"All trees in the forest are weak learners."** Unlike boosting, Random Forest trees are fully grown, high-capacity models. They are individually strong learners with low bias and high variance. The ensemble reduces the variance.

## Connections to Other Concepts

- `bagging-and-bootstrap.md`: Random Forests are a direct extension of bagging, adding feature randomization to achieve lower correlation between ensemble members.
- `gradient-boosting.md`: The main alternative ensemble approach for tabular data. Gradient boosting builds trees sequentially (reducing bias), while Random Forests build them independently (reducing variance).
- `xgboost-lightgbm-catboost.md`: Industrial-strength gradient boosting implementations that compete with Random Forests on most benchmarks but require more careful tuning.
- `adaboost.md`: Another ensemble method that builds trees sequentially, but with a different theoretical foundation (exponential loss minimization).
- `stacking-and-blending.md`: Random Forests often serve as strong base learners in stacking ensembles due to their reliability and low correlation with other model families.

## Further Reading

- Breiman, "Random Forests" (2001) -- The landmark paper that defined the algorithm and established its theoretical properties.
- Louppe, "Understanding Random Forests" (2014) -- Excellent PhD thesis providing deep theoretical analysis of feature importance and bias in Random Forests.
- Strobl et al., "Bias in Random Forest Variable Importance Measures" (2007) -- Critical analysis of impurity-based importance bias.
- Hastie, Tibshirani, and Friedman, "The Elements of Statistical Learning" (2009), Chapter 15 -- Thorough treatment including variance reduction analysis.
