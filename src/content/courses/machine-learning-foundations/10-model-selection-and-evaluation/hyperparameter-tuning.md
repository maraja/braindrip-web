# Hyperparameter Tuning

**One-Line Summary**: Grid search, random search, and Bayesian optimization -- finding optimal settings without overfitting to the validation set.

**Prerequisites**: Cross-validation, bias-variance trade-off, model complexity, supervised learning basics.

## What Is Hyperparameter Tuning?

Think of a machine learning model as a musical instrument. The **parameters** (weights, coefficients) are the notes you play -- learned from data during training. The **hyperparameters** (learning rate, regularization strength, tree depth) are how you tune the instrument beforehand -- they control how learning proceeds but are not learned by it. Hyperparameter tuning is the process of finding the instrument settings that produce the best music on new, unseen pieces.

Formally, given a model family $f_\theta$ parameterized by $\theta$ and governed by hyperparameters $\lambda$, tuning solves:

$$\lambda^* = \arg\min_{\lambda \in \Lambda} \hat{E}_{\text{CV}}(\lambda)$$

where $\hat{E}_{\text{CV}}(\lambda)$ is the cross-validated estimate of generalization error when training with hyperparameters $\lambda$.

## How It Works

### Hyperparameters vs. Parameters

| | Parameters | Hyperparameters |
|---|---|---|
| Learned from | Training data (gradient descent, etc.) | Set before training |
| Examples | Weights, biases, split thresholds | Learning rate, $K$ in KNN, $C$ in SVM |
| Number | Often millions | Typically 2-20 |
| Optimization | Continuous, gradient-based | Discrete/continuous, black-box |

### Grid Search

Grid search evaluates every combination in a predefined grid. If you have 3 hyperparameters with 5 values each, you evaluate $5^3 = 125$ configurations.

**Advantages**: Exhaustive, simple to implement, easily parallelizable.

**Disadvantages**: Cost grows exponentially with the number of hyperparameters (the curse of dimensionality). Most budget is wasted on unimportant hyperparameters -- if only 1 of 3 hyperparameters matters, grid search still explores all $5^2 = 25$ combinations of the irrelevant two for each value of the important one.

### Random Search

Random search samples hyperparameter configurations uniformly (or from specified distributions) over the search space.

The key insight from **Bergstra & Bengio (2012)**: when only a few hyperparameters matter, random search explores the important dimensions more efficiently than grid search. With a grid of 25 points in 2D, you get only 5 unique values per dimension. With 25 random points, you get 25 unique values per dimension.

$$P(\text{finding top } 5\% \text{ region in } n \text{ trials}) = 1 - (0.95)^n$$

With $n = 60$ random trials, there is a 95% chance of finding a configuration in the top 5% of the search space. This makes random search surprisingly effective for moderate budgets.

### Bayesian Optimization

Bayesian optimization builds a **surrogate model** of the objective function $\hat{E}_{\text{CV}}(\lambda)$ and uses it to decide where to evaluate next. The procedure is sequential:

1. **Initialize**: Evaluate a few random configurations.
2. **Fit surrogate**: Build a probabilistic model (typically a Gaussian Process or Tree-structured Parzen Estimator) of the mapping from $\lambda$ to performance.
3. **Acquisition function**: Choose the next $\lambda$ to evaluate by maximizing an acquisition function that balances exploration (high uncertainty) and exploitation (predicted good performance). Common choices:
   - **Expected Improvement (EI)**: $\text{EI}(\lambda) = \mathbb{E}[\max(0, f^* - f(\lambda))]$
   - **Upper Confidence Bound (UCB)**: $\text{UCB}(\lambda) = \mu(\lambda) - \kappa \cdot \sigma(\lambda)$ (for minimization)
4. **Evaluate**: Train the model with the chosen $\lambda$, observe performance.
5. **Update**: Incorporate the new observation into the surrogate and repeat.

**Advantages**: Sample-efficient -- finds good configurations in fewer evaluations than random search. Particularly valuable when each evaluation is expensive (e.g., training a deep network for hours).

**Disadvantages**: Sequential nature limits parallelism. Surrogate model itself has overhead. Scales poorly beyond ~20 hyperparameters.

### Successive Halving and Hyperband

These methods exploit the idea that bad configurations can be identified early. **Successive halving** starts many configurations with a small budget (few epochs, small data subset), evaluates them, discards the bottom half, doubles the budget for survivors, and repeats.

**Hyperband** runs successive halving with multiple bracket configurations to hedge between aggressive early stopping and giving configurations more budget upfront. It automates the exploration-exploitation trade-off of how much budget to allocate initially.

### Practical Search Space Design

- **Log-uniform scales** for learning rate, regularization strength: search over $[10^{-5}, 10^{0}]$ rather than $[0, 1]$.
- **Integer/categorical** for tree depth, number of layers, activation functions.
- **Conditional hyperparameters**: Some hyperparameters only matter when others take certain values (e.g., momentum is only relevant when using SGD with momentum).

### Avoiding Overfitting to the Validation Set

When tuning many hyperparameters on the same validation set, you risk overfitting to validation noise. Mitigations:

- **Nested cross-validation**: The outer loop estimates the true performance of the entire tuning procedure. The inner loop selects hyperparameters.
- **Separate test set**: After tuning, evaluate once on a held-out test set that was never used during selection.
- **Regularize the search**: Fewer hyperparameters, coarser grids, and early stopping of the search itself.

## Why It Matters

Default hyperparameters rarely yield optimal performance. The difference between well-tuned and poorly-tuned hyperparameters can be larger than the difference between model families. A well-tuned logistic regression can outperform a poorly-tuned neural network. Systematic tuning also ensures fair model comparison -- comparing models at their best rather than at arbitrary settings.

## Key Technical Details

- **Budget allocation**: With a fixed compute budget, random search with 60-100 trials is a strong baseline. Bayesian optimization shines when each trial is expensive and the budget is < 50 trials.
- **Warm starting**: Some Bayesian optimization frameworks can initialize from previous runs, transferring knowledge across related tasks.
- **Multi-fidelity**: Evaluating on smaller datasets or fewer epochs as a proxy. Hyperband automates this.
- **Reproducibility**: Always fix random seeds for the CV splits (not just the model) to ensure comparable evaluations across configurations.

## Common Misconceptions

- **"Grid search is the gold standard."** Grid search is the most wasteful approach in high dimensions. Random search is strictly better for the same budget when some hyperparameters are unimportant.
- **"Bayesian optimization always beats random search."** For very small budgets (< 10 trials) or very high-dimensional spaces (> 20 hyperparameters), Bayesian optimization's surrogate model may be inaccurate, and random search can be competitive.
- **"Tuning on the validation set gives an unbiased performance estimate."** The performance of the selected model on the validation set is optimistically biased. Use nested CV or a separate test set.
- **"More hyperparameters to tune is always better."** Each additional hyperparameter increases the search space and the risk of overfitting to validation noise. Only tune hyperparameters that meaningfully affect performance.

## Connections to Other Concepts

- **Cross-Validation**: Provides the objective function for tuning. Nested CV separates tuning from evaluation.
- **Learning Curves**: Can diagnose whether tuning improved bias, variance, or both.
- **Model Comparison**: After tuning, statistical tests determine whether one model genuinely outperforms another.
- **Regularization (L1/L2)**: Regularization strength is one of the most important hyperparameters to tune.
- **Classification Metrics / Regression Metrics**: The tuning objective must be the metric that matters for the application.

## Further Reading

- Bergstra & Bengio, "Random Search for Hyper-Parameter Optimization" (2012) -- Demonstrates random search's superiority over grid search.
- Snoek, Larochelle & Adams, "Practical Bayesian Optimization of Machine Learning Algorithms" (2012) -- Foundational paper on Gaussian Process-based Bayesian optimization for ML.
- Li et al., "Hyperband: A Novel Bandit-Based Approach to Hyperparameter Optimization" (2018) -- Introduces the Hyperband algorithm for efficient early stopping.
