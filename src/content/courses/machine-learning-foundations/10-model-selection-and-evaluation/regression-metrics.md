# Regression Metrics

**One-Line Summary**: MSE, RMSE, MAE, MAPE, and R-squared -- each captures different aspects of prediction quality.

**Prerequisites**: Basic statistics (mean, variance), supervised learning basics.

## What Are Regression Metrics?

Imagine you are estimating house prices. One model is off by \$5,000 on every prediction. Another is nearly perfect for 99 houses but wildly off by \$500,000 on one. Which model is "better"? The answer depends on which regression metric you use. Each metric weighs the pattern of errors differently -- some punish large outlier errors severely, others treat all errors equally, and still others express error as a proportion of the true value. Understanding these differences is essential for choosing and tuning regression models.

Formally, given $N$ observations with true values $y_i$ and predictions $\hat{y}_i$, regression metrics are scalar summaries of the residuals $e_i = y_i - \hat{y}_i$.

## How It Works

### Mean Squared Error (MSE)

$$\text{MSE} = \frac{1}{N} \sum_{i=1}^{N} (y_i - \hat{y}_i)^2$$

MSE squares each residual before averaging. This has two consequences: (1) large errors are penalized quadratically, so a single prediction off by 10 contributes as much as one hundred predictions off by 1; (2) the units are squared (e.g., dollars-squared), making direct interpretation difficult.

MSE is the default loss for least-squares regression and is differentiable everywhere, making it convenient for optimization.

### Root Mean Squared Error (RMSE)

$$\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{\frac{1}{N} \sum_{i=1}^{N} (y_i - \hat{y}_i)^2}$$

RMSE restores the original units of $y$. If RMSE = 3.2 and the target is temperature in Celsius, then typical errors are around 3.2 degrees. RMSE retains the same sensitivity to large errors as MSE because the square root is monotonic.

### Mean Absolute Error (MAE)

$$\text{MAE} = \frac{1}{N} \sum_{i=1}^{N} |y_i - \hat{y}_i|$$

MAE treats all errors proportionally to their magnitude -- an error of 10 counts exactly ten times as much as an error of 1. This makes MAE **more robust to outliers** than MSE/RMSE. The optimal constant prediction under MAE is the **median** of $y$ (whereas for MSE it is the **mean**).

**Trade-off**: MAE is not differentiable at zero, which complicates gradient-based optimization. In practice, smooth approximations (Huber loss) can bridge the gap.

### Median Absolute Error (MedAE)

$$\text{MedAE} = \text{median}(|y_1 - \hat{y}_1|, \ldots, |y_N - \hat{y}_N|)$$

Even more robust than MAE, MedAE ignores outlier residuals entirely. It is useful as a diagnostic -- if MedAE is much smaller than MAE, outlier errors are inflating the mean.

### Mean Absolute Percentage Error (MAPE)

$$\text{MAPE} = \frac{100\%}{N} \sum_{i=1}^{N} \left| \frac{y_i - \hat{y}_i}{y_i} \right|$$

MAPE expresses errors as a percentage of the true value, providing a scale-independent measure. An error of 5 on a target of 100 is 5%, while the same error on a target of 10 is 50%.

**Limitations**: MAPE is undefined when $y_i = 0$ and is asymmetric -- it penalizes over-prediction more heavily than under-prediction when $y_i > 0$. Symmetric MAPE (sMAPE) and weighted MAPE address some of these issues.

### R-squared (Coefficient of Determination)

$$R^2 = 1 - \frac{\sum_{i=1}^{N} (y_i - \hat{y}_i)^2}{\sum_{i=1}^{N} (y_i - \bar{y})^2} = 1 - \frac{SS_{\text{res}}}{SS_{\text{tot}}}$$

$R^2$ measures the proportion of variance in $y$ explained by the model. It compares the model's residual sum of squares ($SS_{\text{res}}$) to the variance of a naive baseline that always predicts the mean $\bar{y}$.

- $R^2 = 1$: perfect predictions.
- $R^2 = 0$: model is no better than predicting the mean.
- $R^2 < 0$: model is **worse** than predicting the mean. This is possible and indicates a very poor fit (common when evaluating on out-of-distribution data).

### Adjusted R-squared

$$R^2_{\text{adj}} = 1 - \frac{(1 - R^2)(N - 1)}{N - p - 1}$$

where $p$ is the number of predictors. Standard $R^2$ can only increase (or stay the same) as features are added, even if those features are pure noise. Adjusted $R^2$ penalizes model complexity by accounting for $p$, and can decrease when irrelevant features are included.

### Choosing the Right Metric

| Scenario | Recommended Metric | Reason |
|---|---|---|
| General regression | RMSE | Same units as target, penalizes large errors |
| Outlier-prone data | MAE or MedAE | Robust to extreme residuals |
| Percentage matters | MAPE | Scale-independent, intuitive for stakeholders |
| Comparing models across datasets | $R^2$ | Normalized, 1.0 = perfect regardless of scale |
| Feature selection | Adjusted $R^2$ | Penalizes unnecessary complexity |

**Concrete example**: Consider predicting daily sales. RMSE = 50 units and MAE = 20 units. The large gap tells you a few days have very large errors (stockout days, holidays). If you care about average-day performance, MAE is more representative. If the cost of errors grows quadratically (e.g., warehousing costs), RMSE is more appropriate.

## Why It Matters

Choosing the wrong metric can lead to models that are optimal on paper but disastrous in practice. A model minimizing MSE may chase outliers at the expense of typical performance. A model minimizing MAPE may systematically underpredict when values are small. The metric must reflect the **actual cost structure** of the problem.

## Key Technical Details

- **MSE is decomposable**: $\text{MSE} = \text{Bias}^2 + \text{Variance} + \text{Irreducible Noise}$, linking it directly to the bias-variance trade-off.
- **Robustness hierarchy**: MedAE > MAE > RMSE > MSE (from most to least robust to outliers).
- **$R^2$ on test data**: When computed on held-out data, $R^2$ is not bounded below by zero. Negative values signal the model generalizes poorly.
- **RMSE vs. MAE ratio**: If $\text{RMSE} / \text{MAE}$ is close to 1, errors are uniform in magnitude. A large ratio signals the presence of large outlier errors.
- **Heteroscedasticity**: When error variance depends on $y$, percentage-based metrics (MAPE) or log-transformed targets may be more appropriate.

## Common Misconceptions

- **"$R^2$ cannot be negative."** It can, when the model is evaluated on test data or any data where it performs worse than the naive mean baseline.
- **"Higher $R^2$ always means a better model."** $R^2$ increases with model complexity even for irrelevant features. Use adjusted $R^2$ or evaluate on held-out data.
- **"RMSE and MAE rank models the same way."** They often disagree. A model with a few large errors may have a much worse RMSE but similar MAE compared to a model with many moderate errors.
- **"MAPE is always a good default."** MAPE is undefined when true values are zero and can be highly skewed. It also penalizes over-prediction and under-prediction asymmetrically.

## Connections to Other Concepts

- **Classification Metrics**: Analogous evaluation framework for discrete outcomes (accuracy, F1, AUC-ROC).
- **Cross-Validation**: Regression metrics should be estimated via cross-validation for reliable model comparison.
- **Learning Curves**: Plotting RMSE or MAE vs. training set size diagnoses bias and variance issues.
- **Hyperparameter Tuning**: The choice of regression metric as the objective function changes which hyperparameters are selected.
- **Model Comparison**: Statistical tests applied to regression metric differences (e.g., paired t-test on fold-level RMSE) determine whether improvements are significant.

## Further Reading

- Hyndman & Koehler, "Another Look at Measures of Forecast Accuracy" (2006) -- Comprehensive comparison of MAPE, MAE, and alternatives for forecasting.
- Willmott & Matsuura, "Advantages of the Mean Absolute Error over RMSE" (2005) -- Argues MAE is a more natural measure of average error.
- Kvalseth, "Cautionary Note about R-squared" (1985) -- Details the many ways $R^2$ can be misleading.
