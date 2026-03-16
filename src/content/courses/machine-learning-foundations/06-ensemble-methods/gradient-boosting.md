# Gradient Boosting

**One-Line Summary**: Building an additive model by fitting each new tree to the residual errors of the ensemble -- the most powerful tabular method.

**Prerequisites**: Gradient descent, loss functions, decision trees, AdaBoost, Taylor expansion basics.

## What Is Gradient Boosting?

Imagine a sculptor starting with a rough block of marble. The first pass removes large chunks to establish a coarse shape. Each subsequent pass focuses on finer details -- smoothing surfaces, refining edges, adding texture. The sculptor never starts over; each pass corrects the remaining imperfections from the previous one.

Gradient Boosting, formalized by Jerome Friedman in 2001, builds predictive models in exactly this way. It constructs an ensemble by **sequentially adding** models that correct the errors of the current ensemble. Each new model is fit not to the original targets but to the **negative gradient of the loss function** evaluated at the current predictions. This reframes ensemble construction as gradient descent in function space -- a profound insight that generalizes AdaBoost to arbitrary differentiable loss functions.

## How It Works

### The Gradient Boosting Framework

We seek a function $F(x)$ that minimizes a loss $L(y, F(x))$ over the training data. Gradient Boosting builds $F$ as an additive expansion:

$$F_T(x) = F_0(x) + \sum_{t=1}^{T} \nu \cdot h_t(x)$$

where $F_0(x)$ is an initial estimate (e.g., the mean of $y$ for squared error loss), $h_t$ are base learners (typically small decision trees), and $\nu \in (0, 1]$ is the **learning rate** (shrinkage parameter).

### Algorithm: Gradient Boosting Machine

**Initialize**: $F_0(x) = \arg\min_\gamma \sum_{i=1}^n L(y_i, \gamma)$

**For** $t = 1, 2, \ldots, T$:

1. **Compute pseudo-residuals** (negative gradients):

$$r_{it} = -\left[\frac{\partial L(y_i, F(x_i))}{\partial F(x_i)}\right]_{F = F_{t-1}}$$

2. **Fit a base learner** $h_t(x)$ to the pseudo-residuals $\{(x_i, r_{it})\}_{i=1}^n$.

3. **Compute the optimal step size** (for tree-based learners, optimize within each leaf region $R_{jt}$):

$$\gamma_{jt} = \arg\min_\gamma \sum_{x_i \in R_{jt}} L(y_i, F_{t-1}(x_i) + \gamma)$$

4. **Update the model**:

$$F_t(x) = F_{t-1}(x) + \nu \sum_{j=1}^{J_t} \gamma_{jt} \cdot \mathbb{1}[x \in R_{jt}]$$

### Gradient Descent in Function Space

The key insight -- Friedman's central contribution -- is interpreting this procedure as **gradient descent in function space**. In ordinary gradient descent, we update parameters: $\theta \leftarrow \theta - \nu \nabla_\theta L$. In gradient boosting, we update the function itself:

$$F_t = F_{t-1} - \nu \cdot \nabla_F L(y, F)|_{F = F_{t-1}}$$

The pseudo-residuals $r_{it}$ are the components of the functional gradient. Since we cannot represent arbitrary functions, we project the gradient onto the space of base learners by fitting $h_t$ to the pseudo-residuals.

### Loss Functions and Their Pseudo-Residuals

Different loss functions yield different pseudo-residuals:

| Loss Function | $L(y, F)$ | Pseudo-Residual $r_i$ |
|---|---|---|
| Squared Error (MSE) | $\frac{1}{2}(y - F)^2$ | $y_i - F(x_i)$ (actual residuals) |
| Absolute Error (MAE) | $|y - F|$ | $\text{sign}(y_i - F(x_i))$ |
| Huber Loss | Hybrid | Residual if small, sign if large |
| Log Loss (classification) | $\log(1 + e^{-yF})$ | $y_i - \sigma(F(x_i))$ where $\sigma$ is sigmoid |

For squared error, the pseudo-residuals are literally the residuals, which gives the intuitive "fit trees to residuals" description. For other losses, the pseudo-residuals point in the direction of steepest descent for each observation.

### Key Hyperparameters

**Learning rate (shrinkage) $\nu$**: Controls the contribution of each tree. Smaller values (0.01--0.1) require more trees but produce better generalization through regularization. Friedman showed empirically that $\nu \leq 0.1$ almost always improves test performance.

**Tree depth (interaction depth) $J$**: Controls the complexity of each base learner and the order of feature interactions. A tree with $J$ leaves can capture at most $(J-1)$-way interactions:
- $J = 2$: Stumps, additive model only (no interactions)
- $J = 4$--$8$: Typical range, captures moderate interactions
- Higher $J$: More complex interactions but higher variance per tree

**Number of trees $T$**: Must be tuned via cross-validation. Unlike Random Forests, gradient boosting **can overfit** with too many trees.

### Stochastic Gradient Boosting

Friedman (2002) proposed training each tree on a random **subsample** of the training data (without replacement), typically 50--80%. This introduces randomness analogous to stochastic gradient descent:

- Reduces computation per iteration
- Acts as regularization, reducing overfitting
- Often improves generalization over deterministic gradient boosting
- Enables out-of-bag error estimation similar to bagging

## Why It Matters

Gradient Boosting is arguably the most successful algorithm for structured/tabular data. It dominates machine learning competitions on platforms like Kaggle, powers critical systems in industry (fraud detection, recommendation, ranking, risk scoring), and provides a flexible framework that accommodates virtually any differentiable loss function. Its formulation as functional gradient descent provides deep theoretical grounding and connects ensemble learning to optimization theory. The modern implementations -- XGBoost, LightGBM, and CatBoost -- have made gradient boosting the default choice for tabular machine learning.

## Key Technical Details

- **Bias reduction**: Unlike bagging, gradient boosting primarily reduces bias. Each new tree corrects systematic errors in the current ensemble.
- **Regularization is critical**: Without shrinkage ($\nu < 1$), subsampling, or depth limits, gradient boosting easily overfits. The interplay between $\nu$ and $T$ is key: smaller $\nu$ requires larger $T$.
- **Feature importance**: Like Random Forests, gradient boosting provides impurity-based feature importance summed across all trees in the ensemble.
- **Monotone constraints**: Many implementations allow enforcing monotonic relationships between features and predictions, useful for regulated industries.
- **Early stopping**: Monitor validation loss and stop adding trees when it begins to increase. This is more principled than fixing $T$ in advance.

## Common Misconceptions

- **"Gradient boosting fits trees to residuals."** This is only true for squared error loss. For general losses, the trees are fit to **pseudo-residuals** (negative gradients), which are not the same as actual residuals. The "residual" intuition is a useful simplification but technically imprecise.

- **"A lower learning rate is always better."** While smaller $\nu$ generally improves generalization, it requires proportionally more trees, increasing training time. There is a practical optimum where the computational budget is balanced against the regularization benefit.

- **"Gradient boosting cannot handle categorical features."** While the base algorithm uses decision trees that naturally handle ordered splits, standard implementations require encoding categoricals. However, CatBoost was specifically designed to handle categorical features natively.

- **"More trees always improve the model."** Unlike Random Forests, gradient boosting can and does overfit with excessive trees. The training loss continues to decrease, but test loss eventually rises. Early stopping or cross-validation is essential.

## Connections to Other Concepts

- `adaboost.md`: Gradient boosting with exponential loss recovers AdaBoost. Gradient boosting generalizes AdaBoost to any differentiable loss, making it more robust (e.g., log loss is less sensitive to outliers than exponential loss).
- `bagging-and-bootstrap.md`: Stochastic gradient boosting borrows the subsampling idea from bagging. However, bagging reduces variance while boosting reduces bias -- they attack different problems.
- `random-forests.md`: The main alternative for tabular data. Random Forests are easier to tune and parallelize; gradient boosting generally achieves lower error with careful tuning.
- `xgboost-lightgbm-catboost.md`: Industrial implementations that add regularization, approximate splitting, and engineering optimizations to the gradient boosting framework.
- `stacking-and-blending.md`: Gradient boosting models are frequently used as base learners in stacking ensembles, often paired with Random Forests and linear models for diversity.

## Further Reading

- Friedman, "Greedy Function Approximation: A Gradient Boosting Machine" (2001) -- The foundational paper deriving gradient boosting as functional gradient descent.
- Friedman, "Stochastic Gradient Boosting" (2002) -- Introduces subsampling for regularization and variance reduction.
- Friedman, Hastie, and Tibshirani, "Additive Logistic Regression: A Statistical View of Boosting" (2000) -- Bridges AdaBoost and gradient boosting through the lens of statistical modeling.
- Natekin and Knoll, "Gradient Boosting Machines: A Tutorial" (2013) -- Accessible tutorial covering theory and practical considerations.
