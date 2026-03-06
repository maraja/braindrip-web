# Ridge and Lasso Regression

**One-Line Summary**: L2 and L1 penalties that shrink coefficients toward zero -- Ridge for stability, Lasso for sparsity and feature selection.

**Prerequisites**: Linear regression (OLS, normal equations), matrix algebra, bias-variance tradeoff, cross-validation, norms ($\ell_1$, $\ell_2$).

## What Is Regularized Regression?

Suppose you are predicting a patient's blood pressure from 500 genomic markers measured on only 100 patients. OLS fails spectacularly here: with $p > n$, the system is underdetermined and $X^TX$ is singular. Even when $p < n$, highly correlated predictors inflate coefficient variance, producing unstable and unreliable estimates. Regularization adds a penalty term to the OLS objective that constrains the coefficients, trading a small increase in bias for a large reduction in variance.

Ridge and Lasso regression are the two most important regularized regression methods. They differ in the geometry of their penalty, and this geometric difference has profound consequences for the solutions they produce.

## How It Works

### Ridge Regression (L2 Penalty)

Ridge regression minimizes the penalized objective:

$$\hat{\boldsymbol{\beta}}_{ridge} = \arg\min_{\boldsymbol{\beta}} \left\{ \|\mathbf{y} - X\boldsymbol{\beta}\|_2^2 + \lambda \|\boldsymbol{\beta}\|_2^2 \right\}$$

where $\lambda \geq 0$ is the regularization parameter. The closed-form solution is:

$$\hat{\boldsymbol{\beta}}_{ridge} = (X^TX + \lambda I)^{-1} X^T\mathbf{y}$$

The addition of $\lambda I$ to $X^TX$ ensures invertibility regardless of multicollinearity. As $\lambda \to 0$, the solution approaches OLS; as $\lambda \to \infty$, all coefficients shrink toward zero (but never reach exactly zero).

In terms of the singular value decomposition $X = UDV^T$, the Ridge estimator shrinks each OLS coefficient along the principal component directions by a factor of $d_j^2 / (d_j^2 + \lambda)$, where $d_j$ is the $j$-th singular value. Components with small singular values (high-variance directions) are shrunk the most.

### Lasso Regression (L1 Penalty)

The Lasso (Least Absolute Shrinkage and Selection Operator) replaces the $\ell_2$ penalty with an $\ell_1$ penalty:

$$\hat{\boldsymbol{\beta}}_{lasso} = \arg\min_{\boldsymbol{\beta}} \left\{ \|\mathbf{y} - X\boldsymbol{\beta}\|_2^2 + \lambda \|\boldsymbol{\beta}\|_1 \right\}$$

where $\|\boldsymbol{\beta}\|_1 = \sum_{j=1}^{p} |\beta_j|$. Unlike Ridge, the Lasso has **no closed-form solution** and requires iterative algorithms such as coordinate descent or ISTA (Iterative Shrinkage-Thresholding Algorithm).

The defining property of Lasso is **sparsity**: for sufficiently large $\lambda$, many coefficients are driven to exactly zero, effectively performing feature selection.

### Geometric Interpretation

The regularization objectives can be rewritten as constrained optimization problems:

- **Ridge**: Minimize $\|\mathbf{y} - X\boldsymbol{\beta}\|^2$ subject to $\|\boldsymbol{\beta}\|_2^2 \leq t$
- **Lasso**: Minimize $\|\mathbf{y} - X\boldsymbol{\beta}\|^2$ subject to $\|\boldsymbol{\beta}\|_1 \leq t$

Geometrically, the OLS solution lies at the center of elliptical contours of the loss function. The constraint region for Ridge is a **sphere** ($\ell_2$ ball), while for Lasso it is a **diamond** ($\ell_1$ ball). The solution is where the elliptical contours first touch the constraint region.

The diamond shape of the $\ell_1$ ball has **corners** aligned with the coordinate axes. The expanding elliptical contours are far more likely to first make contact at a corner of the diamond than at a generic point on its surface. At a corner, one or more coordinates are exactly zero -- this is the geometric reason Lasso produces sparse solutions. The sphere, having no corners, almost never yields exact zeros.

### Elastic Net

The Elastic Net combines both penalties:

$$\hat{\boldsymbol{\beta}}_{enet} = \arg\min_{\boldsymbol{\beta}} \left\{ \|\mathbf{y} - X\boldsymbol{\beta}\|^2 + \lambda_1 \|\boldsymbol{\beta}\|_1 + \lambda_2 \|\boldsymbol{\beta}\|_2^2 \right\}$$

Or equivalently, with a mixing parameter $\alpha \in [0,1]$:

$$\lambda \left[ \alpha \|\boldsymbol{\beta}\|_1 + (1 - \alpha) \|\boldsymbol{\beta}\|_2^2 \right]$$

Elastic Net inherits Lasso's sparsity while resolving its tendency to arbitrarily select one variable from a group of highly correlated predictors. When predictors come in correlated groups, Elastic Net tends to select or exclude the entire group together.

### The Regularization Path

As $\lambda$ varies from $0$ to $\infty$, the coefficients trace out a **regularization path**. For Ridge, each coefficient shrinks smoothly and monotonically toward zero. For Lasso, the path is piecewise linear: coefficients enter or leave the active set at discrete values of $\lambda$. The LARS (Least Angle Regression) algorithm computes the entire Lasso path at essentially the cost of a single OLS fit.

### Coordinate Descent for Lasso

The most widely used algorithm for Lasso is **coordinate descent**. It cycles through each coefficient $\beta_j$ and applies the soft-thresholding operator:

$$\hat{\beta}_j \leftarrow S\left(\frac{1}{n}\sum_{i=1}^{n} x_{ij}(y_i - \hat{y}_i^{(-j)}), \; \lambda/2\right)$$

where $\hat{y}_i^{(-j)}$ is the prediction excluding predictor $j$, and the soft-thresholding operator is:

$$S(z, \gamma) = \text{sign}(z) \cdot \max(|z| - \gamma, 0)$$

When $|z| \leq \gamma$, the coefficient is set exactly to zero. This is the mechanism by which Lasso achieves sparsity algorithmically. Coordinate descent is fast because each step has a closed-form solution, and it exploits sparsity by skipping zero coefficients.

### Choosing Lambda via Cross-Validation

The standard practice is:

1. Define a grid of $\lambda$ values (typically on a log scale, from $\lambda_{max}$ where all Lasso coefficients are zero down to $\lambda_{max}/1000$).
2. For each $\lambda$, perform $k$-fold cross-validation and record the mean CV error.
3. Select $\lambda_{min}$ (minimizing CV error) or $\lambda_{1se}$ (largest $\lambda$ within one standard error of the minimum, preferring simpler models).

The value $\lambda_{max} = \frac{1}{n}\|X^T\mathbf{y}\|_\infty$ is the smallest $\lambda$ for which all Lasso coefficients are zero, providing a natural upper bound for the search grid.

### Practical Example

Predicting gene expression from 1000 SNPs (genetic variants) on 200 samples. OLS is impossible ($p > n$). Ridge regression produces a model using all 1000 SNPs with small but nonzero coefficients. Lasso selects 15 SNPs with nonzero coefficients, identifying a sparse set of putatively causal variants. The biologist can then focus experiments on these 15 genes.

## Why It Matters

Regularization is arguably the single most important idea in modern supervised learning. It provides a principled mechanism for controlling model complexity, preventing overfitting, and handling the $p > n$ regime that is ubiquitous in genomics, text analysis, and high-dimensional data. Ridge and Lasso are the workhorses of regularized regression and serve as the foundation for understanding more complex penalized models.

The practical impact is enormous. In genomics, Lasso enables genome-wide association studies to identify disease-associated genes from millions of candidate variants. In natural language processing, regularized regression handles sparse bag-of-words features with vocabularies exceeding 100,000 terms. In finance, Ridge regression stabilizes portfolio optimization when the covariance matrix is estimated from limited data. The core idea -- penalizing complexity -- extends far beyond linear models to neural networks (weight decay is $\ell_2$ regularization), support vector machines, and virtually every modern machine learning method.

## Key Technical Details

- Always standardize features before applying Ridge or Lasso so the penalty treats all coefficients equally. The intercept is typically not penalized.
- Ridge has a Bayesian interpretation: it corresponds to a Gaussian prior $\beta_j \sim \mathcal{N}(0, \tau^2)$ on the coefficients. Lasso corresponds to a Laplace prior $\beta_j \sim \text{Laplace}(0, b)$.
- Lasso is inconsistent for variable selection unless the **irrepresentable condition** holds (a constraint on the correlation structure of $X$).
- The degrees of freedom for Ridge regression are $\text{df}(\lambda) = \text{tr}[X(X^TX + \lambda I)^{-1}X^T] = \sum_j d_j^2/(d_j^2 + \lambda)$.
- Computational cost: Ridge is $O(p^3)$ via the closed form; Lasso via coordinate descent is $O(np)$ per iteration, typically converging in few iterations.

## Common Misconceptions

- **"Ridge and Lasso are fundamentally different methods."** Both are penalized least squares; they differ only in the norm used for the penalty. This single geometric difference (sphere vs. diamond) drives all downstream differences.
- **"Lasso always outperforms Ridge."** When the true model is dense (many small nonzero coefficients), Ridge typically outperforms Lasso. Lasso excels when the truth is sparse.
- **"Setting lambda to zero gives the best possible model."** Zero regularization recovers OLS, which overfits in high dimensions. Some nonzero $\lambda$ almost always improves out-of-sample performance.
- **"Lasso selects the correct variables."** Lasso can miss relevant variables or select irrelevant ones, especially with correlated predictors. It is a useful heuristic for feature selection, not an oracle.

## Connections to Other Concepts

- **Linear Regression**: Ridge and Lasso generalize OLS by adding a penalty term; they reduce to OLS when $\lambda = 0$.
- **Polynomial Regression**: Regularization is critical when using high-degree polynomial features to prevent the coefficient explosion that causes overfitting.
- **Bias-Variance Tradeoff**: $\lambda$ directly controls the bias-variance balance. Increasing $\lambda$ increases bias but decreases variance.
- **Regression Diagnostics**: Multicollinearity (high VIF) is a signal that Ridge or Lasso may improve over OLS.
- **Cross-Validation**: The standard method for selecting the regularization strength $\lambda$.
- **Generalized Linear Models**: Regularization extends naturally to GLMs, yielding penalized logistic regression and penalized Poisson regression.

## Further Reading

- Hastie, Tibshirani, and Friedman, "The Elements of Statistical Learning" (2009) -- Chapter 3 provides comprehensive coverage of Ridge, Lasso, and Elastic Net.
- Tibshirani, "Regression Shrinkage and Selection via the Lasso" (1996) -- The original Lasso paper; foundational reading.
- Zou and Hastie, "Regularization and Variable Selection via the Elastic Net" (2005) -- Introduces the Elastic Net and explains when it is preferred over Lasso.
- Efron et al., "Least Angle Regression" (2004) -- Describes the LARS algorithm for computing the full Lasso path efficiently.
