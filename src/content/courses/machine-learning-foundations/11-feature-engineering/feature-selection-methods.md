# Feature Selection Methods

**One-Line Summary**: Filter, wrapper, and embedded approaches for identifying the most informative features -- removing noise to improve generalization.

**Prerequisites**: Supervised learning basics, overfitting and regularization, correlation and mutual information, decision trees.

## What Is Feature Selection?

Imagine you are packing for a week-long trip but can only bring a carry-on bag. You must choose the items that provide the most utility while leaving behind anything redundant or useless. Feature selection applies this same logic to machine learning: given a potentially large set of input variables, which subset yields the best predictive performance?

Formally, given a dataset with $p$ features $\{X_1, X_2, \ldots, X_p\}$ and a target $y$, feature selection seeks a subset $S \subset \{1, \ldots, p\}$ of size $|S| = k \ll p$ that maximizes some criterion of model quality -- accuracy, information gain, or generalization performance -- while discarding features that are noisy, redundant, or irrelevant.

Feature selection differs from dimensionality reduction (e.g., PCA) in a crucial way: it preserves the original feature space, keeping selected variables interpretable rather than projecting into a new coordinate system.

## How It Works

### Comparison of Approaches

| Criterion | Filter | Wrapper | Embedded |
|-----------|--------|---------|----------|
| Speed | Fast ($O(p \cdot n)$) | Slow ($O(p^2)$ model fits) | Moderate (single training run) |
| Interaction awareness | No | Yes | Partial to full |
| Model dependency | Model-agnostic | Tied to specific model | Tied to specific model |
| Risk of overfitting | Low | High (without careful CV) | Moderate |
| Scalability to large $p$ | Excellent | Poor | Good |

A practical pipeline often chains approaches: use filters to reduce from thousands of features to hundreds, then apply embedded or wrapper methods for the final selection.

### Filter Methods

Filter methods evaluate each feature independently of any learning algorithm using statistical tests or information-theoretic measures. They are fast, scalable, and model-agnostic.

**Variance Threshold.** The simplest filter removes features whose variance falls below a threshold $\tau$. A feature with near-zero variance is nearly constant and carries almost no discriminative information:

$$\text{Remove } X_j \text{ if } \operatorname{Var}(X_j) < \tau$$

**Correlation Coefficient.** For regression tasks, Pearson correlation measures linear association between a feature $X_j$ and target $y$:

$$r_{j} = \frac{\sum_{i=1}^{n}(x_{ij} - \bar{x}_j)(y_i - \bar{y})}{\sqrt{\sum_{i=1}^{n}(x_{ij} - \bar{x}_j)^2 \sum_{i=1}^{n}(y_i - \bar{y})^2}}$$

Features with $|r_j|$ below a threshold are discarded. Note that Pearson correlation only captures linear relationships; Spearman rank correlation handles monotonic nonlinearities.

**Mutual Information.** Mutual information captures arbitrary (including nonlinear) dependencies between $X_j$ and $y$:

$$I(X_j; y) = \sum_{x, y} p(x, y) \log \frac{p(x, y)}{p(x) \, p(y)}$$

A value of zero means statistical independence. Estimation typically uses $k$-nearest-neighbor methods (Kraskov estimator) for continuous variables.

**Chi-Squared Test.** For categorical features and classification targets, the chi-squared statistic tests independence between a feature and the class label using observed vs. expected frequency counts. Higher $\chi^2$ values indicate stronger association.

**ANOVA F-Test.** For continuous features and categorical targets, the F-statistic compares between-class variance to within-class variance. A large F-value suggests the feature's mean differs significantly across classes.

### Wrapper Methods

Wrapper methods use a specific learning algorithm as a black box and evaluate feature subsets by model performance (e.g., cross-validated accuracy). They are more expensive but capture feature interactions.

**Forward Selection.** Start with an empty set. At each step, add the single feature that most improves model performance. Stop when no addition yields improvement beyond a threshold.

**Backward Elimination.** Start with all $p$ features. At each step, remove the feature whose removal hurts performance least (or even improves it). Continue until further removals degrade performance unacceptably.

**Recursive Feature Elimination (RFE).** Train a model, rank features by importance (e.g., linear model coefficients or tree importances), remove the least important feature(s), and repeat. RFE with cross-validation (RFECV) uses cross-validated performance to select the optimal number of features automatically.

The computational cost of exhaustive wrapper search is $O(2^p)$, making greedy strategies like forward/backward selection (each $O(p^2)$ model fits) the practical choice.

### Embedded Methods

Embedded methods perform feature selection as part of the model training process, combining the advantages of filters (efficiency) and wrappers (interaction awareness).

**L1 Regularization (Lasso).** Adding an $\ell_1$ penalty to the loss function drives some coefficients exactly to zero:

$$\min_{\beta} \frac{1}{2n} \|y - X\beta\|_2^2 + \lambda \|\beta\|_1$$

Features with $\beta_j = 0$ are effectively removed. The regularization parameter $\lambda$ controls sparsity -- larger $\lambda$ yields fewer selected features.

**Tree-Based Feature Importance.** Decision trees and ensembles (Random Forest, Gradient Boosting) provide importance scores based on the total reduction in impurity (Gini or entropy) contributed by each feature across all splits. Features with low importance can be pruned.

**Permutation Importance.** After training, randomly shuffle one feature's values and measure the drop in model performance. A large drop indicates high importance. Unlike impurity-based importance, permutation importance is unbiased toward high-cardinality features and works with any model.

### Stability Selection

Stability selection (Meinshausen and Buhlmann, 2010) addresses the instability of feature selection by running a base selection method (e.g., Lasso) on many random subsamples of the data and retaining features that are selected in a high proportion of runs. A feature is deemed stable if its selection frequency exceeds a threshold $\pi_{\text{thr}}$ (typically 0.6-0.9). This provides finite-sample control of false discoveries -- features that appear by chance in any single subsample are unlikely to be selected consistently across many subsamples.

## Why It Matters

Feature selection directly combats the **curse of dimensionality**: as $p$ grows relative to $n$, models overfit to noise, distances become meaningless, and computational costs explode. Removing irrelevant features improves generalization, reduces training time, lowers storage and inference costs, and enhances model interpretability. In regulated industries like healthcare and finance, being able to explain which features drive predictions is often a legal requirement.

Consider a clinical dataset with 500 gene expression features and 200 patient samples. Without feature selection, most models will overfit to noise in the high-dimensional space. Applying mutual information filtering to reduce to the top 50 features, followed by RFE with a random forest to identify the final 15, can transform an unreliable model into a robust diagnostic tool. The selected features also become candidates for biological interpretation -- potentially revealing which genes are most relevant to the disease.

## Key Technical Details

- Filter methods assume features contribute independently; they miss interaction effects (e.g., $X_1 \cdot X_2$ is predictive but neither alone is).
- Wrapper methods capture interactions but are computationally expensive and risk overfitting to the validation set.
- L1 regularization can be unstable when features are highly correlated -- it may arbitrarily select one of several correlated features. Elastic Net ($\ell_1 + \ell_2$) mitigates this.
- Permutation importance should be computed on a held-out set to avoid inflated scores from overfitting.
- For very high-dimensional data ($p \gg n$), filter methods are often the only practical first pass before applying wrapper or embedded methods.
- Feature selection should be performed inside cross-validation folds, not before, to avoid data leakage.

## Common Misconceptions

- **"Removing correlated features always helps."** Correlation between features does not mean redundancy with respect to the target. Two correlated features may each contribute unique predictive information from different angles.
- **"Higher mutual information always means a better feature."** Mutual information estimates can be noisy in small samples. A feature with slightly lower MI but more stable behavior may generalize better.
- **"Tree importance is the ground truth."** Impurity-based importance is biased toward features with more categories or higher cardinality. Always cross-check with permutation importance.
- **"Feature selection is a one-time step."** The optimal feature set depends on the model, the sample size, and the task. Revisit selection when data or objectives change.
- **"Wrapper methods always find the best subset."** Greedy search (forward/backward) can get stuck in local optima. The globally optimal subset of size $k$ may not contain the optimal subset of size $k-1$, so incremental approaches can miss it.

## Connections to Other Concepts

- `regularization.md`: L1 regularization is an embedded feature selection method; L2 shrinks coefficients but does not zero them out.
- **Dimensionality Reduction (PCA)**: PCA transforms features into a new basis; feature selection retains original features. They address the same underlying problem from different angles.
- `handling-high-cardinality-features.md`: High-cardinality categoricals inflate dimensionality after encoding, making feature selection critical.
- `feature-extraction-and-transformation.md`: Feature selection operates after features are engineered -- the two steps are complementary.
- `cross-validation.md`: Wrapper methods and proper feature selection pipelines require cross-validation to avoid optimistic bias.
- `automated-feature-engineering.md`: Automated systems generate many candidate features, making rigorous selection even more critical to prevent the feature set from growing uncontrollably.

## Further Reading

- Guyon and Elisseeff, "An Introduction to Variable and Feature Selection" (2003) -- The foundational survey covering filters, wrappers, and embedded methods.
- Hastie, Tibshirani, and Friedman, "The Elements of Statistical Learning" (2009) -- Chapter 3 covers L1 regularization and subset selection in depth.
- Altmann et al., "Permutation importance: a corrected feature importance measure" (2010) -- Introduces corrected permutation importance with statistical testing.
- Meinshausen and Buhlmann, "Stability Selection" (2010) -- Combines subsampling with selection to control false discovery rates.
