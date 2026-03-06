# Linear Regression

**One-Line Summary**: Fitting a hyperplane to data by minimizing squared errors -- the most interpretable and foundational predictive model.

**Prerequisites**: Linear algebra (matrix operations, projections), calculus (partial derivatives), probability (expected value, variance), loss functions and optimization basics.

## What Is Linear Regression?

Imagine you are an appraiser estimating house prices. You notice that price tends to increase with square footage, number of bedrooms, and neighborhood quality. Linear regression formalizes this intuition: it finds the best-fitting flat surface (a hyperplane) through a cloud of data points so that the overall prediction error is as small as possible.

Formally, we model the relationship between a response variable $y$ and a vector of $p$ predictors $\mathbf{x} = (x_1, x_2, \dots, x_p)^T$ as:

$$y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_p x_p + \epsilon$$

In matrix notation for $n$ observations, this becomes:

$$\mathbf{y} = X\boldsymbol{\beta} + \boldsymbol{\epsilon}$$

where $X$ is the $n \times (p+1)$ design matrix (with a column of ones for the intercept), $\boldsymbol{\beta}$ is the $(p+1) \times 1$ coefficient vector, and $\boldsymbol{\epsilon}$ is the $n \times 1$ error vector with $\mathbb{E}[\boldsymbol{\epsilon}] = \mathbf{0}$ and $\text{Cov}(\boldsymbol{\epsilon}) = \sigma^2 I_n$.

## How It Works

### The Ordinary Least Squares (OLS) Objective

We seek $\boldsymbol{\beta}$ that minimizes the sum of squared residuals:

$$\hat{\boldsymbol{\beta}} = \arg\min_{\boldsymbol{\beta}} \| \mathbf{y} - X\boldsymbol{\beta} \|^2 = \arg\min_{\boldsymbol{\beta}} (\mathbf{y} - X\boldsymbol{\beta})^T(\mathbf{y} - X\boldsymbol{\beta})$$

Taking the gradient with respect to $\boldsymbol{\beta}$, setting it to zero, and solving yields the **normal equations**:

$$X^T X \hat{\boldsymbol{\beta}} = X^T \mathbf{y}$$

When $X^T X$ is invertible (i.e., no perfect multicollinearity), the closed-form solution is:

$$\hat{\boldsymbol{\beta}} = (X^T X)^{-1} X^T \mathbf{y}$$

### Geometric Interpretation

OLS has an elegant geometric meaning. The fitted values $\hat{\mathbf{y}} = X\hat{\boldsymbol{\beta}}$ are the **orthogonal projection** of $\mathbf{y}$ onto the column space of $X$. The residual vector $\mathbf{e} = \mathbf{y} - \hat{\mathbf{y}}$ is perpendicular to every column of $X$, which is precisely the condition $X^T \mathbf{e} = \mathbf{0}$ -- the normal equations restated geometrically. The hat matrix $H = X(X^TX)^{-1}X^T$ is the projection matrix satisfying $\hat{\mathbf{y}} = H\mathbf{y}$.

### Gradient Descent Alternative

When $n$ or $p$ is very large, inverting $X^TX$ (an $O(p^3)$ operation) becomes impractical. Gradient descent offers an iterative alternative. The gradient of the MSE loss with respect to $\boldsymbol{\beta}$ is:

$$\nabla_{\boldsymbol{\beta}} \text{MSE} = \frac{2}{n} X^T(X\boldsymbol{\beta} - \mathbf{y})$$

At each step $t$, we update:

$$\boldsymbol{\beta}^{(t+1)} = \boldsymbol{\beta}^{(t)} - \alpha \cdot \frac{2}{n} X^T(X\boldsymbol{\beta}^{(t)} - \mathbf{y})$$

where $\alpha$ is the learning rate. Three major variants exist:

- **Batch gradient descent**: Uses all $n$ observations per update. Exact gradient but expensive per step.
- **Stochastic gradient descent (SGD)**: Uses a single random observation per update. Noisy but extremely fast per step and scales to massive datasets.
- **Mini-batch gradient descent**: Uses a random subset of $b$ observations (typically $b = 32$ to $256$). Balances noise and computational efficiency; the dominant approach in practice.

For linear regression with MSE loss, the loss surface is a convex quadratic (a paraboloid in coefficient space), guaranteeing that gradient descent converges to the global minimum for a sufficiently small $\alpha$. The condition number $\kappa = d_{max}^2 / d_{min}^2$ of $X^TX$ (ratio of largest to smallest eigenvalue) controls convergence speed: ill-conditioned problems converge slowly and benefit from feature scaling.

### Assumptions of Classical Linear Regression

1. **Linearity**: The true relationship between $\mathbf{x}$ and $\mathbb{E}[y|\mathbf{x}]$ is linear in parameters.
2. **Independence**: Observations are independent of one another.
3. **Homoscedasticity**: The error variance is constant: $\text{Var}(\epsilon_i | \mathbf{x}_i) = \sigma^2$ for all $i$.
4. **Normality of errors**: $\epsilon_i \sim \mathcal{N}(0, \sigma^2)$. This is needed for exact inference (t-tests, F-tests) but not for OLS estimation itself.
5. **No perfect multicollinearity**: No predictor is an exact linear combination of others.

When these hold, the Gauss-Markov theorem guarantees that OLS is the **Best Linear Unbiased Estimator** (BLUE) -- it has the smallest variance among all linear unbiased estimators.

### R-Squared and Model Fit

The coefficient of determination measures the proportion of variance explained:

$$R^2 = 1 - \frac{SS_{res}}{SS_{tot}} = 1 - \frac{\sum_i (y_i - \hat{y}_i)^2}{\sum_i (y_i - \bar{y})^2}$$

$R^2$ always increases (or stays the same) when predictors are added, so the **adjusted** $R^2$ penalizes model complexity:

$$R^2_{adj} = 1 - \frac{SS_{res} / (n - p - 1)}{SS_{tot} / (n - 1)}$$

### Practical Example

Predicting house prices with square footage ($x_1$) and number of bedrooms ($x_2$):

$$\hat{y} = 25000 + 150 \cdot x_1 + 8000 \cdot x_2$$

Interpretation: holding bedrooms constant, each additional square foot adds \$150 to the predicted price. This direct interpretability is linear regression's greatest practical strength.

## Why It Matters

Linear regression is far more than a toy model. It is the baseline against which all other regression methods are compared. Its closed-form solution makes it computationally cheap and analytically tractable. The interpretability of coefficients -- each $\beta_j$ represents the expected change in $y$ per unit change in $x_j$, holding all else constant -- makes it indispensable in science, economics, and policy. Many advanced techniques (ridge regression, LASSO, generalized linear models) are direct extensions of linear regression.

Beyond prediction, linear regression plays a central role in causal inference. In randomized experiments, regressing the outcome on treatment assignment recovers the average treatment effect. In observational studies, regression adjustment is the most common method for controlling confounders, though this requires strong assumptions about model specification. Understanding when regression coefficients have causal meaning versus merely predictive meaning is one of the most important distinctions in applied statistics.

## Key Technical Details

- The OLS estimator is unbiased: $\mathbb{E}[\hat{\boldsymbol{\beta}}] = \boldsymbol{\beta}$ under correct specification.
- The variance of the estimator is $\text{Var}(\hat{\boldsymbol{\beta}}) = \sigma^2 (X^TX)^{-1}$, estimated by replacing $\sigma^2$ with $s^2 = SS_{res}/(n-p-1)$.
- Inverting $X^TX$ costs $O(p^3)$; for large $p$, use gradient descent or QR decomposition.
- Adding irrelevant predictors inflates variance without reducing bias (bias-variance tradeoff).
- Standardizing features (zero mean, unit variance) before fitting makes coefficients comparable in magnitude.

## Common Misconceptions

- **"A high R-squared means the model is good."** $R^2$ can be high due to overfitting, spurious correlations, or irrelevant predictors. Always check residuals and use adjusted $R^2$ or cross-validation.
- **"Linear regression assumes y is normally distributed."** The normality assumption applies to the errors $\epsilon$, not to $y$ itself. The distribution of $y$ conditional on $\mathbf{x}$ is what matters.
- **"Linear regression can only model straight lines."** It models linear relationships in the *parameters*. You can include polynomial features like $x^2$ or interaction terms like $x_1 x_2$ and still use OLS.
- **"OLS always has a unique solution."** When $X^TX$ is singular (perfect multicollinearity), the solution is not unique. Regularization methods like Ridge regression resolve this.

## Connections to Other Concepts

- **Polynomial Regression**: Extends linear regression by adding powers of predictors as features while retaining the OLS framework.
- **Ridge and Lasso Regression**: Add penalty terms to the OLS objective to combat overfitting and multicollinearity.
- **Regression Diagnostics**: The toolkit for verifying whether linear regression assumptions actually hold for your data.
- **Generalized Linear Models**: Extend the linear regression framework to non-normal response distributions via link functions.
- **Gradient Descent**: The iterative optimization alternative when the closed-form solution is computationally infeasible.
- **Bias-Variance Tradeoff**: Linear regression is low-bias for truly linear relationships but can have high variance with many correlated predictors.

## Further Reading

- Hastie, Tibshirani, and Friedman, "The Elements of Statistical Learning" (2009) -- Chapter 3 provides a rigorous treatment of linear methods for regression.
- Shalev-Shwartz and Ben-David, "Understanding Machine Learning" (2014) -- Formalizes linear regression within the PAC learning framework.
- Angrist and Pischke, "Mostly Harmless Econometrics" (2009) -- Explains the causal interpretation of regression coefficients and when it is valid.
