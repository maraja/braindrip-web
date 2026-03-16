# Generalized Linear Models

**One-Line Summary**: Extending linear regression to non-normal responses via link functions -- unifying logistic, Poisson, and other regression types.

**Prerequisites**: Linear regression (OLS, assumptions), probability distributions (Bernoulli, Poisson, exponential family), maximum likelihood estimation, calculus (chain rule, Newton's method).

## What Is a Generalized Linear Model?

Ordinary linear regression assumes that the response variable is continuous and normally distributed around its mean. But what if you are predicting whether a customer will churn (binary outcome), how many accidents occur at an intersection per year (count data), or how long until a machine fails (positive continuous)? Forcing these responses into a standard linear regression violates fundamental assumptions: binary data is not Gaussian, counts cannot be negative, and durations are not symmetric.

Generalized linear models (GLMs) extend linear regression to handle all of these situations within a single unified framework. The key idea is elegant: instead of modeling the response mean directly as a linear function of predictors, GLMs model a **transformation** of the mean (the link function) as linear, while allowing the response to follow any distribution from the exponential family.

Think of it this way: linear regression draws a straight line through the data. GLMs draw a straight line through a *transformed* version of the data, then invert the transformation to produce predictions on the original scale.

## How It Works

### The Three Components of a GLM

Every GLM is specified by three components:

1. **Random Component**: The response $y_i$ follows a distribution from the exponential family:

$$f(y_i | \theta_i, \phi) = \exp\left\{\frac{y_i \theta_i - b(\theta_i)}{a(\phi)} + c(y_i, \phi)\right\}$$

where $\theta_i$ is the natural (canonical) parameter, $\phi$ is a dispersion parameter, and $b(\cdot)$, $a(\cdot)$, $c(\cdot)$ are known functions defining the specific distribution. The mean and variance are:

$$\mu_i = \mathbb{E}[y_i] = b'(\theta_i), \qquad \text{Var}(y_i) = b''(\theta_i) \cdot a(\phi)$$

2. **Systematic Component**: A linear predictor formed from the covariates:

$$\eta_i = \mathbf{x}_i^T \boldsymbol{\beta} = \beta_0 + \beta_1 x_{i1} + \dots + \beta_p x_{ip}$$

3. **Link Function**: A monotonic, differentiable function $g$ that connects the mean to the linear predictor:

$$g(\mu_i) = \eta_i \qquad \Longleftrightarrow \qquad \mu_i = g^{-1}(\eta_i)$$

### Exponential Family Distributions

The exponential family includes many common distributions:

| Distribution | Support | Natural Parameter $\theta$ | $b(\theta)$ | Canonical Link |
|-------------|---------|---------------------------|-------------|----------------|
| Normal | $\mathbb{R}$ | $\mu$ | $\theta^2/2$ | Identity: $g(\mu) = \mu$ |
| Bernoulli | $\{0, 1\}$ | $\log\frac{\mu}{1-\mu}$ | $\log(1+e^\theta)$ | Logit: $g(\mu) = \log\frac{\mu}{1-\mu}$ |
| Poisson | $\{0, 1, 2, \dots\}$ | $\log \mu$ | $e^\theta$ | Log: $g(\mu) = \log \mu$ |
| Gamma | $(0, \infty)$ | $-1/\mu$ | $-\log(-\theta)$ | Inverse: $g(\mu) = 1/\mu$ |

The **canonical link** function sets $g(\mu) = \theta$, linking the linear predictor directly to the natural parameter. Using the canonical link simplifies estimation and yields desirable statistical properties, but non-canonical links can also be used.

### Logistic Regression as a GLM

Binary classification via logistic regression is a GLM with:
- Random component: $y_i \sim \text{Bernoulli}(\mu_i)$
- Link function: logit, $g(\mu_i) = \log\frac{\mu_i}{1 - \mu_i}$
- Model: $\log\frac{P(y_i = 1 | \mathbf{x}_i)}{P(y_i = 0 | \mathbf{x}_i)} = \mathbf{x}_i^T \boldsymbol{\beta}$

The inverse link gives the predicted probability:

$$P(y_i = 1 | \mathbf{x}_i) = \frac{1}{1 + e^{-\mathbf{x}_i^T \boldsymbol{\beta}}}$$

Coefficients are interpreted on the log-odds scale: a unit increase in $x_j$ multiplies the odds by $e^{\beta_j}$.

### Poisson Regression as a GLM

For count data (e.g., number of insurance claims):
- Random component: $y_i \sim \text{Poisson}(\mu_i)$
- Link function: log, $g(\mu_i) = \log \mu_i$
- Model: $\log \mathbb{E}[y_i | \mathbf{x}_i] = \mathbf{x}_i^T \boldsymbol{\beta}$

The inverse link ensures predictions are non-negative: $\hat{\mu}_i = e^{\mathbf{x}_i^T \boldsymbol{\beta}}$. Coefficients are interpreted as multiplicative: a unit increase in $x_j$ multiplies the expected count by $e^{\beta_j}$.

### Estimation via IRLS

GLMs are fit by maximum likelihood. The log-likelihood for the exponential family is:

$$\ell(\boldsymbol{\beta}) = \sum_{i=1}^{n} \frac{y_i \theta_i - b(\theta_i)}{a(\phi)} + \text{const.}$$

There is generally no closed-form solution (except for the normal distribution, which recovers OLS). Instead, we use **Iteratively Reweighted Least Squares (IRLS)**:

1. Initialize $\boldsymbol{\beta}^{(0)}$ (e.g., from OLS on the link-transformed responses).
2. At each iteration $t$, compute working responses $z_i^{(t)}$ and weights $w_i^{(t)}$:

$$z_i^{(t)} = \eta_i^{(t)} + (y_i - \mu_i^{(t)}) \cdot g'(\mu_i^{(t)})$$

$$w_i^{(t)} = \frac{1}{g'(\mu_i^{(t)})^2 \cdot \text{Var}(y_i | \mu_i^{(t)})}$$

3. Update: $\boldsymbol{\beta}^{(t+1)} = (X^T W^{(t)} X)^{-1} X^T W^{(t)} \mathbf{z}^{(t)}$
4. Repeat until convergence.

Each iteration is a weighted least squares problem, hence the name. IRLS is a form of Fisher scoring, which is equivalent to Newton-Raphson when the canonical link is used.

### Overdispersion

The Poisson distribution assumes $\text{Var}(y) = \mu$ (mean equals variance). In practice, count data often exhibits **overdispersion**: $\text{Var}(y) > \mu$. Ignoring overdispersion leads to underestimated standard errors and spuriously significant coefficients.

Remedies include:
- **Quasi-Poisson**: Introduces a dispersion parameter $\phi$ so that $\text{Var}(y) = \phi \mu$, estimated from the data.
- **Negative binomial regression**: Models count data with a variance function $\text{Var}(y) = \mu + \mu^2/\kappa$, accommodating extra-Poisson variation.

### Deviance as Goodness of Fit

The **deviance** generalizes the residual sum of squares to GLMs:

$$D = 2 \left[ \ell(\hat{\boldsymbol{\mu}}_{saturated}) - \ell(\hat{\boldsymbol{\mu}}_{model}) \right]$$

where the saturated model has one parameter per observation (fitting the data perfectly). The deviance measures how far the fitted model is from this perfect fit. For the normal distribution with identity link, the deviance reduces to the RSS.

The **null deviance** (intercept-only model) minus the **residual deviance** (fitted model) measures the explained deviance, analogous to $R^2$. For nested models, the difference in deviances follows approximately a $\chi^2$ distribution, enabling likelihood ratio tests.

## Why It Matters

GLMs unify an enormous range of statistical models under a single theoretical and computational framework. Instead of learning separate methods for binary outcomes, counts, and continuous data, a practitioner learns one framework and selects the appropriate distribution and link function for the problem at hand. This is both conceptually elegant and practically powerful. GLMs are the backbone of statistical modeling in epidemiology, insurance, ecology, and many other fields where response variables are not Gaussian.

## Key Technical Details

- GLMs estimate $p+1$ parameters (including intercept) via maximum likelihood, not OLS. Standard errors come from the observed or expected Fisher information matrix.
- The canonical link guarantees that the sufficient statistic for $\boldsymbol{\beta}$ is $X^T\mathbf{y}$, and the log-likelihood is concave, ensuring a unique maximum.
- Residual types for GLMs include deviance residuals, Pearson residuals, and working residuals, each useful for different diagnostic purposes.
- AIC and BIC can be used for model comparison across GLMs with the same response distribution.
- Regularized GLMs (e.g., penalized logistic regression with $\ell_1$ or $\ell_2$ penalties) are standard in high-dimensional settings.

## Common Misconceptions

- **"GLMs are nonlinear models."** GLMs are linear in the *link-transformed* mean. The systematic component $\eta = X\boldsymbol{\beta}$ is linear; only the mapping from $\eta$ to $\mu$ is nonlinear.
- **"You need the canonical link."** Non-canonical links are perfectly valid. For example, the probit link (inverse normal CDF) is a common alternative to logit for binary data and may be preferable when the latent variable interpretation is natural.
- **"R-squared works for GLMs."** The classical $R^2$ is not well-defined for GLMs. Use deviance explained, pseudo-$R^2$ measures (McFadden's, Nagelkerke's), or information criteria instead.
- **"GLMs handle any response distribution."** Only distributions in the exponential family are covered. Heavy-tailed distributions (Cauchy) or mixture distributions require other approaches.
- **"Logistic regression is unrelated to linear regression."** Logistic regression is a GLM that shares the same linear predictor structure as standard linear regression, differing only in the choice of distribution and link function.

## Connections to Other Concepts

- `linear-regression.md`: Linear regression is a GLM with a normal distribution and identity link function -- the simplest special case.
- `ridge-and-lasso-regression.md`: Regularization extends directly to GLMs, producing penalized logistic regression and penalized Poisson regression for high-dimensional problems.
- `regression-diagnostics.md`: GLMs have analogous diagnostic tools (deviance residuals, leverage in the working model, Cook's distance for GLMs) for checking model adequacy.
- `polynomial-regression.md`: Polynomial and interaction terms can be included in the linear predictor $\eta$ of any GLM.
- `maximum-likelihood-estimation.md`: GLM fitting is a direct application of MLE, with IRLS as the optimization algorithm.
- `zero-shot-classification.md`: Logistic regression (a GLM) is the foundational classifier and the bridge between regression and classification in supervised learning.

## Further Reading

- McCullagh and Nelder, "Generalized Linear Models" (1989) -- The definitive reference on GLM theory, estimation, and diagnostics.
- Nelder and Wedderburn, "Generalized Linear Models" (1972) -- The original paper introducing the GLM framework and IRLS.
- Agresti, "Foundations of Linear and Generalized Linear Models" (2015) -- A modern and accessible treatment bridging linear models and GLMs.
- Hastie, Tibshirani, and Friedman, "The Elements of Statistical Learning" (2009) -- Chapter 4 covers logistic regression in the GLM context with a machine learning perspective.
