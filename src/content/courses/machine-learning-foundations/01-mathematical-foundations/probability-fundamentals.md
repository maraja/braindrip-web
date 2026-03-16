# Probability Fundamentals

**One-Line Summary**: Random variables, distributions, Bayes' theorem, and conditional probability -- the language of uncertainty in ML.

**Prerequisites**: Basic set theory, Vectors and Matrices.

## What Is Probability?

Uncertainty is inescapable in machine learning. Training data is a noisy sample from a larger population. Predictions are inherently uncertain. Models must quantify *how confident* they are. Probability theory provides the rigorous mathematical framework for reasoning about uncertainty.

Think of probability as a way to assign a number between 0 and 1 to events, where 0 means impossible and 1 means certain. If you flip a fair coin, the probability of heads is 0.5 -- not because the outcome is inherently random (physics could predict it) but because your *information* about the outcome is incomplete. This information-theoretic view connects naturally to the Bayesian perspective used throughout modern ML.

## How It Works

### Sample Spaces, Events, and Axioms

A **sample space** $\Omega$ is the set of all possible outcomes. An **event** $A \subseteq \Omega$ is a subset of outcomes. A **probability measure** $P$ assigns values to events satisfying Kolmogorov's axioms:

1. $P(A) \geq 0$ for all events $A$
2. $P(\Omega) = 1$
3. For mutually exclusive events $A_1, A_2, \ldots$: $P(\bigcup_i A_i) = \sum_i P(A_i)$

From these axioms, all of probability theory follows.

### Conditional Probability and Independence

The probability of $A$ given that $B$ has occurred:

$$P(A|B) = \frac{P(A \cap B)}{P(B)}, \quad P(B) > 0$$

Events $A$ and $B$ are **independent** if $P(A \cap B) = P(A)P(B)$, equivalently $P(A|B) = P(A)$. In ML, feature independence is a strong assumption (used in Naive Bayes) that rarely holds exactly but often works surprisingly well.

### Bayes' Theorem

Bayes' theorem reverses conditioning:

$$P(\theta|D) = \frac{P(D|\theta) P(\theta)}{P(D)}$$

In ML language: **posterior** $\propto$ **likelihood** $\times$ **prior**. This is the foundation of Bayesian inference:

- $P(\theta)$: prior belief about parameters before seeing data
- $P(D|\theta)$: likelihood of observing data given parameters
- $P(\theta|D)$: posterior belief after observing data
- $P(D) = \int P(D|\theta)P(\theta)d\theta$: marginal likelihood (evidence)

### Random Variables

A **random variable** $X$ is a function from the sample space to real numbers: $X: \Omega \to \mathbb{R}$.

**Discrete** random variables take countably many values. They are characterized by a **probability mass function (PMF)**: $p(x) = P(X = x)$.

**Continuous** random variables take values in intervals. They are characterized by a **probability density function (PDF)** $f(x)$ where:

$$P(a \leq X \leq b) = \int_a^b f(x) \, dx$$

Note that $f(x)$ itself is not a probability -- it can exceed 1. Only integrals of the PDF over intervals yield probabilities.

The **cumulative distribution function (CDF)** $F(x) = P(X \leq x)$ works for both discrete and continuous variables and is always non-decreasing from 0 to 1.

### Common Distributions

**Bernoulli($p$)**: Binary outcome with $P(X=1) = p$. Models coin flips, click/no-click, spam/not-spam.

**Binomial($n, p$)**: Number of successes in $n$ independent Bernoulli trials. $P(X=k) = \binom{n}{k}p^k(1-p)^{n-k}$.

**Poisson($\lambda$)**: Count of events in a fixed interval. $P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}$. Models rare events (website visits, hardware failures).

**Uniform($a, b$)**: $f(x) = \frac{1}{b-a}$ for $x \in [a, b]$. Maximum ignorance about where a value falls in an interval.

**Gaussian (Normal)** $\mathcal{N}(\mu, \sigma^2)$:

$$f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)$$

The most important distribution in ML. The Central Limit Theorem justifies its ubiquity: sums of many independent random variables tend to be Gaussian, regardless of their individual distributions.

### Expectation, Variance, and Covariance

**Expectation** (mean):

$$\mathbb{E}[X] = \sum_x x \cdot p(x) \quad \text{(discrete)}, \quad \mathbb{E}[X] = \int x \cdot f(x) \, dx \quad \text{(continuous)}$$

**Variance**:

$$\text{Var}(X) = \mathbb{E}[(X - \mathbb{E}[X])^2] = \mathbb{E}[X^2] - (\mathbb{E}[X])^2$$

**Covariance** measures linear co-dependence between two variables:

$$\text{Cov}(X, Y) = \mathbb{E}[(X - \mathbb{E}[X])(Y - \mathbb{E}[Y])]$$

The **covariance matrix** $\Sigma$ for a random vector $\mathbf{X}$ has entries $\Sigma_{ij} = \text{Cov}(X_i, X_j)$. It is always symmetric and positive semi-definite, making it amenable to eigendecomposition for PCA.

### The Multivariate Gaussian

For a random vector $\mathbf{X} \in \mathbb{R}^n$:

$$f(\mathbf{x}) = \frac{1}{(2\pi)^{n/2}|\Sigma|^{1/2}} \exp\left(-\frac{1}{2}(\mathbf{x} - \boldsymbol{\mu})^T \Sigma^{-1} (\mathbf{x} - \boldsymbol{\mu})\right)$$

The exponent $(\mathbf{x} - \boldsymbol{\mu})^T \Sigma^{-1}(\mathbf{x} - \boldsymbol{\mu})$ is the **Mahalanobis distance** -- a key quantity linking probability to distance metrics.

## Why It Matters

Probability is the language in which ML models express uncertainty. Classification outputs are probabilities. Generative models define probability distributions over data. Loss functions like cross-entropy are derived from probabilistic principles. Without probability, there is no principled way to handle noise, make predictions under uncertainty, or compare models.

## Key Technical Details

- **Law of total probability**: $P(A) = \sum_i P(A|B_i)P(B_i)$ for a partition $\{B_i\}$.
- **Linearity of expectation**: $\mathbb{E}[aX + bY] = a\mathbb{E}[X] + b\mathbb{E}[Y]$, even if $X$ and $Y$ are dependent.
- $\text{Var}(aX + b) = a^2\text{Var}(X)$.
- **Correlation**: $\rho(X,Y) = \text{Cov}(X,Y)/(\sigma_X \sigma_Y) \in [-1, 1]$. Zero correlation does not imply independence (except for Gaussians).
- The **softmax** function maps logits to a valid probability distribution: $p_i = e^{z_i}/\sum_j e^{z_j}$.

## Common Misconceptions

- **"Probability and likelihood are the same."** Probability is a function of outcomes given fixed parameters. Likelihood is a function of parameters given fixed data. This distinction is crucial for MLE and Bayesian inference.
- **"A PDF value is a probability."** The PDF can exceed 1. Only the integral of the PDF over an interval is a probability.
- **"Uncorrelated means independent."** Uncorrelated means zero linear dependence. Two variables can be uncorrelated yet strongly dependent (e.g., $X$ and $X^2$ where $X$ is symmetric around 0).

## Connections to Other Concepts

- `statistical-inference.md`: Uses probability distributions to draw conclusions about populations from samples.
- `maximum-likelihood-estimation.md`: Finds parameters that maximize the probability of observed data under a model.
- `information-theory.md`: Entropy and KL divergence are defined in terms of probability distributions.
- `matrix-decompositions.md`: Eigendecomposition of the covariance matrix reveals the principal axes of variation.
- `norms-and-distance-metrics.md`: The Mahalanobis distance is defined through the inverse covariance matrix.

## Further Reading

- Blitzstein & Hwang, *Introduction to Probability* (2019) -- Clear, example-driven probability textbook with ML-relevant exercises.
- Bishop, *Pattern Recognition and Machine Learning*, Chapter 1-2 (2006) -- Probability theory presented in the context of ML.
- Jaynes, *Probability Theory: The Logic of Science* (2003) -- Deep philosophical treatment of probability as extended logic.
