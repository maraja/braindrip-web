# Regression Diagnostics

**One-Line Summary**: Residual analysis, heteroscedasticity, multicollinearity, and influence points -- verifying assumptions before trusting results.

**Prerequisites**: Linear regression (OLS, assumptions, R-squared), probability distributions (normal, chi-squared), hypothesis testing (p-values, test statistics).

## What Is Regression Diagnostics?

You have fit a linear regression model, obtained coefficients, and computed $R^2$. Can you trust the results? Regression diagnostics is the practice of systematically checking whether the model's assumptions hold and whether individual data points are unduly driving the results. Think of it as a medical checkup for your model: the regression may look healthy on the surface, but diagnostics can reveal hidden pathologies -- non-constant variance, correlated predictors, or single observations that change the entire fit.

Without diagnostics, you risk reporting confidence intervals that are too narrow, p-values that are misleading, and predictions that are unreliable. Diagnostics transform regression from a black-box procedure into a principled statistical analysis.

## How It Works

### Residual Plots

Residuals $e_i = y_i - \hat{y}_i$ are the primary diagnostic tool. Under correct model specification, residuals should appear as random noise with no discernible pattern.

**Residuals vs. Fitted Values**: Plot $e_i$ against $\hat{y}_i$. Look for:
- A horizontal band of constant width centered at zero (good).
- A funnel shape (heteroscedasticity).
- A curved pattern (nonlinearity -- consider polynomial terms or a transformation).

**Residuals vs. Predictors**: Plot $e_i$ against each predictor $x_j$. Patterns suggest that the functional form for $x_j$ is misspecified (e.g., a quadratic term is needed).

**Q-Q Plot (Normal Quantile-Quantile)**: Plot the ordered standardized residuals against theoretical quantiles of $\mathcal{N}(0,1)$. Points should fall along the diagonal. Deviations in the tails indicate heavy-tailed or skewed error distributions. Standardized residuals are computed as:

$$r_i = \frac{e_i}{s\sqrt{1 - h_{ii}}}$$

where $s$ is the residual standard error and $h_{ii}$ is the $i$-th diagonal element of the hat matrix $H = X(X^TX)^{-1}X^T$.

**Scale-Location Plot**: Plot $\sqrt{|r_i|}$ against $\hat{y}_i$. A horizontal trend confirms homoscedasticity; an increasing trend indicates variance that grows with the predicted value.

### Heteroscedasticity

When $\text{Var}(\epsilon_i | \mathbf{x}_i)$ is not constant, OLS estimates remain unbiased but are no longer efficient, and standard errors are incorrect.

**Breusch-Pagan Test**: Regress the squared residuals $e_i^2$ on the predictors. Under homoscedasticity, the $R^2$ of this auxiliary regression should be near zero. The test statistic $nR^2 \sim \chi^2_p$ under $H_0$.

**White Test**: A more general version that includes squares and cross-products of predictors in the auxiliary regression, detecting nonlinear forms of heteroscedasticity.

**Remedies**: Use heteroscedasticity-consistent (HC) standard errors (White's robust standard errors), apply a variance-stabilizing transformation (e.g., $\log y$), or use weighted least squares (WLS) where $w_i = 1/\text{Var}(\epsilon_i)$.

### Multicollinearity

When predictors are highly correlated, individual coefficient estimates become unstable -- small changes in the data produce large changes in $\hat{\beta}_j$.

**Variance Inflation Factor (VIF)**: For predictor $x_j$, regress $x_j$ on all other predictors and compute $R^2_j$. Then:

$$\text{VIF}_j = \frac{1}{1 - R^2_j}$$

A VIF of 1 means no collinearity. VIF $> 5$ is a warning; VIF $> 10$ is a serious problem. The variance of $\hat{\beta}_j$ is inflated by the factor VIF$_j$ relative to the case of uncorrelated predictors.

**Remedies**: Remove or combine collinear predictors, apply principal component regression, or use Ridge regression (which was specifically designed to handle multicollinearity).

### Influential Points and Outliers

Not all observations contribute equally to the fit. Some may disproportionately determine the regression surface.

**Leverage**: The $i$-th diagonal element of the hat matrix, $h_{ii}$, measures how far $\mathbf{x}_i$ is from the center of the predictor space. High-leverage points have unusual predictor values. The average leverage is $(p+1)/n$; points with $h_{ii} > 2(p+1)/n$ deserve scrutiny.

**Cook's Distance**: Combines leverage and residual size to measure each observation's influence on the entire coefficient vector:

$$D_i = \frac{r_i^2}{p+1} \cdot \frac{h_{ii}}{1 - h_{ii}}$$

A common rule of thumb: $D_i > 4/n$ or $D_i > 1$ warrants investigation. Cook's distance answers: "How much would the fit change if observation $i$ were removed?"

**DFFITS and DFBETAS**: DFFITS measures the change in the fitted value $\hat{y}_i$ when observation $i$ is deleted. DFBETAS measures the change in each individual coefficient $\hat{\beta}_j$.

### Autocorrelation

When observations have a natural ordering (e.g., time series), errors may be correlated.

**Durbin-Watson Test**: Tests for first-order autocorrelation in the residuals. The test statistic is:

$$DW = \frac{\sum_{i=2}^{n} (e_i - e_{i-1})^2}{\sum_{i=1}^{n} e_i^2}$$

$DW \approx 2$ suggests no autocorrelation; $DW \ll 2$ indicates positive autocorrelation (common in time series); $DW \gg 2$ indicates negative autocorrelation.

**Remedies**: Include lagged variables, use time-series models (ARIMA), or apply Newey-West standard errors that are robust to autocorrelation.

### What to Do When Assumptions Are Violated

| Violation | Consequence | Remedy |
|-----------|------------|--------|
| Nonlinearity | Biased predictions | Add polynomial/interaction terms, transform variables |
| Heteroscedasticity | Invalid standard errors | Robust SE, WLS, log transform |
| Multicollinearity | Unstable coefficients | Ridge regression, drop/combine variables, PCA |
| Non-normal errors | Invalid confidence intervals | Bootstrap, transform $y$, use robust regression |
| Autocorrelation | Underestimated SE | Time-series methods, Newey-West SE |
| Influential points | Distorted fit | Investigate, robust regression (Huber, M-estimators) |

## Why It Matters

A regression model is only as trustworthy as its assumptions. Publishing coefficients and p-values without checking assumptions is like reporting a patient's temperature without calibrating the thermometer. In practice, assumption violations are the norm, not the exception. Diagnostics tell you which violations are present, how severe they are, and what corrective actions to take. They are the difference between statistical analysis and numerical fortune-telling.

## Key Technical Details

- Standardized residuals, studentized residuals, and externally studentized residuals differ in how they estimate the error variance. Externally studentized residuals (leaving out observation $i$) follow a $t_{n-p-2}$ distribution under normality, making them useful for formal outlier tests.
- The hat matrix $H$ is idempotent ($H^2 = H$) and symmetric, with eigenvalues 0 and 1. The trace $\text{tr}(H) = p + 1$ equals the number of parameters.
- Cook's distance can be decomposed as the product of a leverage component and a residual component, showing that influence requires both unusual predictors and a large residual.
- VIF is directly related to the eigenvalues of the correlation matrix of predictors; small eigenvalues correspond to high VIF directions.

## Common Misconceptions

- **"If R-squared is high, the model is fine."** A high $R^2$ says nothing about whether assumptions hold. A model with severe heteroscedasticity or influential outliers can have $R^2 > 0.95$ and still produce misleading inference.
- **"Outliers should always be removed."** Outliers may be the most informative observations in the dataset. Remove them only if they result from data entry errors or measurement failures; otherwise, use robust methods.
- **"The Shapiro-Wilk test on residuals is essential."** Formal normality tests are overpowered on large samples (rejecting trivial deviations) and underpowered on small samples. Q-Q plots are more informative in practice.
- **"Multicollinearity makes the model wrong."** It does not bias predictions; it inflates the variance of individual coefficients. If prediction (not interpretation) is the goal, multicollinearity is less of a concern.
- **"Diagnostics are only needed once."** After any model change (adding variables, transformations, removing observations), diagnostics should be rerun.

## Connections to Other Concepts

- `linear-regression.md`: Diagnostics verify the assumptions that justify OLS estimation and inference.
- `polynomial-regression.md`: Residual plots with curved patterns suggest adding polynomial terms to the model.
- `ridge-and-lasso-regression.md`: High VIF values are a direct indicator that regularization may improve the model.
- `generalized-linear-models.md`: GLMs have their own diagnostic tools (deviance residuals, Pearson residuals) analogous to those for linear regression.
- `bias-variance-tradeoff.md`: Influential points can dramatically affect both bias and variance of the estimator.
- `cross-validation.md`: Complements diagnostics by providing an assumption-free estimate of predictive performance.

## Further Reading

- Belsley, Kuh, and Welsch, "Regression Diagnostics" (1980) -- The definitive reference on influence measures, leverage, and collinearity diagnostics.
- Fox, "Applied Regression Analysis and Generalized Linear Models" (2015) -- Excellent treatment of diagnostic methods with practical examples.
- Cook and Weisberg, "Residuals and Influence in Regression" (1982) -- Foundational work on Cook's distance and related influence diagnostics.
