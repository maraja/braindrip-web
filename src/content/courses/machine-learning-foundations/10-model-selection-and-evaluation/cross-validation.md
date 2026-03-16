# Cross-Validation

**One-Line Summary**: K-fold, stratified, and leave-one-out validation -- maximizing use of limited data for both training and evaluation.

**Prerequisites**: Train-test split, overfitting, bias-variance trade-off, supervised learning basics.

## What Is Cross-Validation?

Imagine you have only 500 labeled examples to build and evaluate a model. Setting aside 100 for testing means training on just 400 -- you might underfit. Using all 500 for training means you have nothing left to estimate real-world performance. Cross-validation solves this dilemma by systematically rotating which portion of data is held out, so that every example serves as both a training point and a test point across different iterations. It is the Swiss Army knife of model evaluation.

Formally, cross-validation is a resampling procedure that partitions a dataset into complementary training and validation subsets multiple times, aggregating performance estimates to reduce the variance of evaluation.

## How It Works

### The Holdout Method and Its Limitations

The simplest approach is a single train/test split (e.g., 80/20). Problems:

1. **High variance**: The estimate depends heavily on which points end up in test.
2. **Wasted data**: A large test set means less training data.
3. **No confidence interval**: A single number tells you nothing about estimate uncertainty.

### K-Fold Cross-Validation

The data is partitioned into $K$ equally sized folds. For each fold $k = 1, \ldots, K$:

1. Train on all folds except fold $k$.
2. Evaluate on fold $k$.

The final estimate is the average over all $K$ folds:

$$\hat{E}_{\text{CV}} = \frac{1}{K} \sum_{k=1}^{K} L_k$$

where $L_k$ is the loss (or metric) computed on fold $k$.

Common choices: $K = 5$ or $K = 10$. With $K = 10$, each model trains on 90% of the data -- close to the full dataset -- while every observation appears in exactly one test fold.

### Stratified K-Fold

Standard K-fold can produce folds where a minority class is absent or over-represented, especially with imbalanced data. **Stratified K-fold** ensures each fold preserves the class distribution of the full dataset. This is the default choice for classification tasks.

For regression, stratified variants bin the target variable and stratify on the bins.

### Leave-One-Out Cross-Validation (LOOCV)

LOOCV is K-fold with $K = N$ (one fold per data point). Each iteration trains on $N - 1$ examples and tests on the single held-out point.

$$\hat{E}_{\text{LOOCV}} = \frac{1}{N} \sum_{i=1}^{N} L(y_i, \hat{f}_{-i}(x_i))$$

**Pros**: Nearly unbiased estimate (training sets are almost the full dataset). Deterministic (no random partitioning).

**Cons**: Extremely expensive ($N$ model fits). High variance because the $N$ training sets overlap by $N - 2$ points, making the fold-level estimates highly correlated.

### Repeated Cross-Validation

Run $K$-fold CV multiple times with different random partitions and average the results. This reduces the variance of the CV estimate. A common configuration is 10 repetitions of 10-fold CV (100 model fits total).

### Nested Cross-Validation

When you use CV to select hyperparameters **and** evaluate performance, you risk an optimistic bias: the same data that chose the best model also estimates its performance. **Nested CV** addresses this with two loops:

- **Outer loop**: $K_{\text{outer}}$ folds for performance estimation.
- **Inner loop**: Within each outer training set, $K_{\text{inner}}$-fold CV selects the best hyperparameters.

The outer loop provides an unbiased estimate of the generalization performance of the entire model selection procedure.

### Time Series Cross-Validation

Standard K-fold is invalid for time series because it allows training on future data. Two alternatives:

**Expanding window**: Train on all data up to time $t$, validate on $t+1, \ldots, t+h$. The training set grows at each step.

**Sliding window**: Train on a fixed-size window ending at time $t$, validate on $t+1, \ldots, t+h$. The training set size stays constant.

Both respect temporal ordering and prevent data leakage.

### Group K-Fold

When data contains groups (e.g., multiple measurements per patient), standard K-fold may place different measurements from the same patient in both train and test, causing data leakage. **Group K-fold** ensures all observations from a group appear in the same fold.

## Bias and Variance of CV Estimates

The CV estimator has both bias and variance, and they trade off with $K$:

| $K$ | Bias | Variance | Computational Cost |
|---|---|---|---|
| Small (e.g., 2) | High (trains on only 50%) | Lower | Low |
| Medium (5-10) | Moderate | Moderate | Moderate |
| $N$ (LOOCV) | Nearly zero | High (correlated folds) | High |

$K = 5$ or $K = 10$ is generally recommended as a good compromise. Empirically, 10-fold CV tends to have lower bias than 5-fold with only moderately higher variance.

### Choosing K in Practice

- **Small datasets** ($N < 1000$): Use 10-fold or LOOCV. Data efficiency matters most.
- **Medium datasets** ($1000 < N < 50000$): 5-fold is usually sufficient.
- **Large datasets** ($N > 50000$): Even a single holdout split can give a reliable estimate. Use 3-fold if you want CV.

## Why It Matters

Cross-validation is the most widely used technique for estimating how a model will perform on unseen data. It underpins hyperparameter tuning (providing the objective function to optimize), model comparison (providing the scores to compare), and learning curve analysis (repeated evaluations at different training set sizes). Without cross-validation, you risk either overfitting your evaluation or wasting valuable training data.

## Key Technical Details

- **Variance of the CV estimate**: The standard error of K-fold CV is difficult to compute exactly because fold-level errors are not independent (they share training data). Naive $\text{SE} = \text{SD}(L_1, \ldots, L_K) / \sqrt{K}$ underestimates the true uncertainty.
- **Computational cost**: K-fold requires $K$ model fits. For expensive models (deep networks), $K = 3$ or $K = 5$ may be the practical limit.
- **Stratification is almost free**: Always use stratified K-fold for classification. There is no downside and it reduces variance.
- **Shuffling**: Always shuffle data before splitting unless temporal or group structure exists.

## Common Misconceptions

- **"Cross-validation prevents overfitting."** CV detects overfitting by estimating generalization performance, but it does not prevent it. The model can still overfit the training folds.
- **"More folds are always better."** LOOCV has nearly zero bias but can have higher variance than 10-fold due to correlated training sets. It is also much more expensive.
- **"You can use the same CV loop for tuning and for final evaluation."** This produces optimistically biased estimates. Use nested CV to separate selection from evaluation.
- **"K-fold works for any data."** It assumes data points are i.i.d. For time series or grouped data, specialized CV strategies are required.

## Connections to Other Concepts

- `hyperparameter-tuning.md`: CV provides the objective function that grid search, random search, and Bayesian optimization maximize.
- `model-comparison.md`: Statistical tests (paired t-test, Wilcoxon) are applied to CV fold-level scores.
- `learning-curves.md`: Generated by running CV at multiple training set sizes.
- `classification-metrics.md`: CV produces per-fold estimates of these metrics.
- `calibration.md`: Calibration should be evaluated on held-out data, ideally through cross-validation.

## Further Reading

- Hastie, Tibshirani & Friedman, "The Elements of Statistical Learning," Chapter 7 (2009) -- Thorough treatment of CV bias, variance, and model selection.
- Varma & Simon, "Bias in Error Estimation When Using Cross-Validation for Model Selection" (2006) -- Demonstrates the need for nested CV.
- Arlot & Celisse, "A Survey of Cross-Validation Procedures for Model Selection" (2010) -- Comprehensive review of CV variants and their properties.
