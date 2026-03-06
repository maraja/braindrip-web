# Polynomial Regression

**One-Line Summary**: Capturing nonlinear relationships within the linear regression framework by adding polynomial feature terms.

**Prerequisites**: Linear regression (OLS, normal equations), bias-variance tradeoff, cross-validation, feature engineering basics.

## What Is Polynomial Regression?

Suppose you are studying how a car's fuel efficiency changes with engine RPM. At low RPMs efficiency climbs, peaks in a mid-range, and then drops at high RPMs -- a clear curve, not a line. Polynomial regression captures such curvature by adding powers of the predictor as new features. The model remains "linear" in its parameters (and thus solvable by OLS), but the decision boundary in the original feature space is a curve, surface, or higher-dimensional manifold.

For a single predictor $x$ and degree $d$, the polynomial regression model is:

$$y = \beta_0 + \beta_1 x + \beta_2 x^2 + \beta_3 x^3 + \dots + \beta_d x^d + \epsilon$$

This is equivalent to constructing an augmented feature vector $\boldsymbol{\phi}(x) = (1, x, x^2, \dots, x^d)^T$ and fitting:

$$y = \boldsymbol{\phi}(x)^T \boldsymbol{\beta} + \epsilon$$

which is a standard linear regression in the transformed feature space.

## How It Works

### Polynomial Feature Expansion

Given the original feature matrix $X \in \mathbb{R}^{n \times p}$, we construct an expanded matrix $\Phi$ that includes all polynomial terms up to degree $d$. For a single feature, the mapping is:

$$x \mapsto (x, x^2, x^3, \dots, x^d)$$

For multiple features $x_1, x_2$, a degree-2 expansion includes:

$$x_1, \; x_2, \; x_1^2, \; x_1 x_2, \; x_2^2$$

The number of features in a full degree-$d$ expansion of $p$ variables is $\binom{p + d}{d} - 1$, which grows rapidly. With $p = 10$ and $d = 3$, this yields 285 features.

### Still Linear in Parameters

A critical insight: despite modeling nonlinear relationships in the original features, polynomial regression is **linear in parameters**. The coefficient vector $\boldsymbol{\beta}$ enters the model linearly, so the OLS closed-form solution applies directly:

$$\hat{\boldsymbol{\beta}} = (\Phi^T \Phi)^{-1} \Phi^T \mathbf{y}$$

This means all the statistical machinery of linear regression -- confidence intervals, hypothesis tests, $R^2$ -- carries over without modification.

### Interaction Terms

Beyond pure powers, interaction terms capture how the effect of one predictor depends on another. For predictors $x_1$ and $x_2$:

$$y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \beta_3 x_1 x_2 + \epsilon$$

Here $\beta_3$ represents the change in the slope of $y$ with respect to $x_1$ per unit change in $x_2$. Interaction terms are a special case of the polynomial expansion and are often more interpretable than higher-order pure powers.

### Overfitting with High-Degree Polynomials

Polynomial regression vividly illustrates the bias-variance tradeoff:

- **Low degree** ($d = 1$): High bias, the model cannot capture curvature. Underfitting.
- **Moderate degree** ($d = 2$ or $3$): Often the sweet spot -- enough flexibility without excess variance.
- **High degree** ($d \geq 10$): The polynomial oscillates wildly between data points (Runge's phenomenon). Training error drops to near zero, but test error explodes.

Mathematically, a degree-$n-1$ polynomial can perfectly interpolate $n$ data points, achieving zero training error while being useless for prediction.

### Choosing Polynomial Degree via Cross-Validation

The degree $d$ is a hyperparameter. The standard approach:

1. For each candidate $d \in \{1, 2, 3, \dots, d_{max}\}$, construct the polynomial features.
2. Perform $k$-fold cross-validation, computing the average validation MSE.
3. Select the $d$ with the lowest CV error, or use the one-standard-error rule to prefer simplicity.

A typical workflow in practice:

| Degree | Training MSE | CV MSE  |
|--------|-------------|---------|
| 1      | 12.4        | 13.1    |
| 2      | 3.2         | 4.0     |
| 3      | 2.9         | 3.8     |
| 4      | 2.7         | 5.2     |
| 7      | 0.8         | 18.6    |

Here, degree 3 minimizes the CV error; degree 7 badly overfits.

### Comparison with Other Nonlinear Approaches

Polynomial regression is not the only way to model nonlinearity:

- **Splines** (piecewise polynomials): Fit low-degree polynomials on local intervals joined at knots. They avoid the wild oscillations of high-degree global polynomials. Cubic splines with $k$ knots use only $k + 4$ parameters versus $d + 1$ for a degree-$d$ polynomial.
- **Kernel regression**: Uses a kernel function to weight nearby observations, making local predictions. No explicit feature expansion needed, but computationally expensive at prediction time ($O(n)$ per query).
- **Basis function expansions**: Polynomial features are one choice of basis; others include radial basis functions, Fourier bases, and wavelets, each suited to different kinds of structure in the data.

### Practical Example

Modeling the trajectory of a projectile (height $y$ as a function of time $t$):

$$y = \beta_0 + \beta_1 t + \beta_2 t^2 + \epsilon$$

Physics tells us this should be quadratic (constant gravitational acceleration). Fitting to observed data might yield $\hat{y} = 1.2 + 15.3t - 4.9t^2$, where $-4.9$ closely matches $-g/2 \approx -4.905$. A degree-1 model would miss the curvature entirely; a degree-5 model would fit noise in the measurements.

## Why It Matters

Polynomial regression is the simplest bridge between linear models and nonlinear modeling. It requires no new estimation machinery -- just feature engineering -- making it easy to implement and interpret. It serves as an important pedagogical tool for understanding overfitting, model complexity, and the bias-variance tradeoff in a concrete setting. In practice, low-degree polynomial terms (especially quadratic and interaction terms) are routinely included in linear models across science and engineering.

## Key Technical Details

- The design matrix $\Phi$ can become ill-conditioned for high degrees because $x^d$ spans many orders of magnitude. Centering and scaling features (e.g., $z = (x - \bar{x})/s_x$) before expansion mitigates this.
- Orthogonal polynomials (Legendre, Chebyshev) provide numerically stable alternatives to raw powers.
- Regularization (Ridge or Lasso) applied to polynomial features controls overfitting more gracefully than simply capping the degree.
- The effective degrees of freedom of a polynomial model equal $d + 1$ (including the intercept), directly governing the bias-variance balance.
- For multivariate expansions, use only interaction terms or limit the total degree to avoid combinatorial explosion of features.

## Common Misconceptions

- **"Polynomial regression is a nonlinear model."** It is nonlinear in the *features* but linear in the *parameters*. This distinction matters because OLS and all its theory still apply.
- **"Higher degree always means better fit."** Higher degree reduces training error but typically increases test error beyond a point. This is the classic overfitting trap.
- **"Polynomial regression extrapolates well."** Polynomials diverge rapidly outside the training range. A degree-5 fit that looks reasonable within $[0, 10]$ can produce absurd predictions at $x = 15$.
- **"You need polynomial regression for any nonlinear pattern."** Often, a log or square root transformation of $x$ or $y$ captures the nonlinearity more parsimoniously than adding polynomial terms.

## Connections to Other Concepts

- **Linear Regression**: Polynomial regression is a special case of linear regression applied to an expanded feature space.
- **Ridge and Lasso Regression**: Regularization is essential when using high-degree polynomial features to prevent overfitting and multicollinearity in the expanded design matrix.
- **Bias-Variance Tradeoff**: Polynomial degree directly controls model complexity; increasing it reduces bias but increases variance.
- **Cross-Validation**: The primary tool for selecting the polynomial degree hyperparameter.
- **Regression Diagnostics**: Residual plots reveal whether polynomial terms of sufficient degree have been included -- structured patterns in residuals suggest remaining nonlinearity.
- **Feature Engineering**: Polynomial expansion is one of the most common feature engineering techniques.

## Further Reading

- Hastie, Tibshirani, and Friedman, "The Elements of Statistical Learning" (2009) -- Chapter 5 on basis expansions and splines contextualizes polynomial regression among broader nonlinear methods.
- Bishop, "Pattern Recognition and Machine Learning" (2006) -- Section 1.1 uses polynomial curve fitting as the motivating example for the entire book.
- James et al., "An Introduction to Statistical Learning" (2013) -- Chapter 7 gives an accessible treatment of polynomial regression and its limitations.
