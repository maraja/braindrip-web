# Statistical Inference

**One-Line Summary**: Drawing conclusions about populations from samples -- hypothesis testing, confidence intervals, and the frequentist-Bayesian divide.

**Prerequisites**: Probability Fundamentals, Derivatives and Gradients (for MLE connection).

## What Is Statistical Inference?

You have a dataset of 10,000 customer transactions. The full population -- all transactions that have ever occurred or will occur -- is unknowable. Statistical inference is the art and science of using the sample you have to make rigorous statements about the population you cannot observe.

Think of it like tasting soup. You stir the pot (randomize), take a spoonful (sample), and judge the entire pot. If the soup is well-mixed and the spoon is big enough, your judgment will be reliable. Statistical inference formalizes exactly how reliable, quantifying the uncertainty inherent in generalizing from parts to wholes.

## How It Works

### Point Estimation

A **point estimator** $\hat{\theta}$ is a function of the sample that produces a single "best guess" for a population parameter $\theta$. For example, the sample mean $\bar{X} = \frac{1}{n}\sum_{i=1}^n X_i$ estimates the population mean $\mu$.

Desirable properties of estimators:

- **Unbiasedness**: $\mathbb{E}[\hat{\theta}] = \theta$. The estimator is correct on average.
- **Consistency**: $\hat{\theta} \xrightarrow{p} \theta$ as $n \to \infty$. More data leads to better estimates.
- **Efficiency**: Among unbiased estimators, the one with the smallest variance is most efficient. The **Cramer-Rao lower bound** provides a floor:

$$\text{Var}(\hat{\theta}) \geq \frac{1}{nI(\theta)}$$

where $I(\theta) = -\mathbb{E}\left[\frac{\partial^2}{\partial\theta^2}\log p(X|\theta)\right]$ is the **Fisher information**.

### Confidence Intervals

A **95% confidence interval** $[L, U]$ is constructed so that, over many hypothetical repetitions of the experiment, 95% of such intervals would contain the true parameter $\theta$.

For a Gaussian population with known variance $\sigma^2$:

$$\bar{X} \pm z_{\alpha/2} \frac{\sigma}{\sqrt{n}}$$

where $z_{\alpha/2} = 1.96$ for 95% confidence. Key insight: the interval width shrinks as $1/\sqrt{n}$ -- to halve uncertainty, you need four times as much data.

For unknown variance, replace $\sigma$ with the sample standard deviation $s$ and use the $t$-distribution with $n-1$ degrees of freedom.

### Hypothesis Testing

**Hypothesis testing** formalizes the question "Is this effect real or just noise?"

1. State the **null hypothesis** $H_0$ (no effect, e.g., $\mu = 0$) and **alternative** $H_1$ (effect exists, e.g., $\mu \neq 0$).
2. Choose a **significance level** $\alpha$ (commonly 0.05).
3. Compute a **test statistic** from the data (e.g., $z = \frac{\bar{X} - \mu_0}{\sigma/\sqrt{n}}$).
4. Compute the **p-value**: the probability of observing a test statistic as extreme as the one obtained, assuming $H_0$ is true.
5. Reject $H_0$ if $p < \alpha$.

**Type I error** (false positive): rejecting $H_0$ when it is true. Probability = $\alpha$.
**Type II error** (false negative): failing to reject $H_0$ when $H_1$ is true. Probability = $\beta$.
**Power** = $1 - \beta$: the probability of correctly detecting a real effect.

### The Central Limit Theorem

The **CLT** is the reason Gaussian distributions dominate statistical inference. For independent, identically distributed random variables $X_1, \ldots, X_n$ with mean $\mu$ and variance $\sigma^2$:

$$\frac{\bar{X} - \mu}{\sigma/\sqrt{n}} \xrightarrow{d} \mathcal{N}(0, 1) \quad \text{as } n \to \infty$$

Regardless of the shape of the original distribution, the sample mean is approximately Gaussian for large $n$. This justifies using Gaussian-based confidence intervals and tests even for non-Gaussian data.

### The Law of Large Numbers

The **strong law** states that $\bar{X}_n \to \mu$ almost surely as $n \to \infty$. This guarantees that sample averages converge to population averages -- the theoretical basis for Monte Carlo estimation, which underlies stochastic gradient descent, reinforcement learning policy evaluation, and Bayesian approximate inference.

### Frequentist vs. Bayesian Perspectives

**Frequentist**: Parameters are fixed but unknown. Probability describes long-run frequencies of events. Inference uses sampling distributions of estimators. A 95% confidence interval says: "If I repeated this experiment infinitely, 95% of my intervals would contain the true value."

**Bayesian**: Parameters are random variables with prior distributions. Probability describes degrees of belief. Inference updates the prior to a posterior via Bayes' theorem:

$$p(\theta|D) \propto p(D|\theta)p(\theta)$$

A 95% **credible interval** says: "Given the data, there is a 95% probability that $\theta$ lies in this interval." This is often the interpretation people intuitively want from a confidence interval.

In ML, the Bayesian perspective enables:
- **Regularization as prior**: L2 regularization is equivalent to a Gaussian prior on weights.
- **Model comparison**: The marginal likelihood $p(D)$ automatically penalizes complexity (Occam's razor).
- **Uncertainty quantification**: Posterior predictive distributions express uncertainty in predictions.

## Why It Matters

Statistical inference connects data to decisions. In ML, it appears in model evaluation (are two models significantly different?), A/B testing (did the new feature improve engagement?), feature selection (is this variable's coefficient significantly nonzero?), and the theoretical foundations of generalization (PAC learning, VC dimension). Understanding inference prevents the all-too-common error of mistaking noise for signal.

## Key Technical Details

- The **bootstrap** resamples the data with replacement to empirically estimate the sampling distribution of any statistic, bypassing distributional assumptions.
- **Multiple comparisons problem**: Testing many hypotheses inflates the Type I error rate. Bonferroni correction divides $\alpha$ by the number of tests; the Benjamini-Hochberg procedure controls the false discovery rate.
- **Sufficient statistics**: A statistic $T(X)$ is sufficient for $\theta$ if $p(X|T, \theta) = p(X|T)$. For exponential family distributions, sufficient statistics exist and are used by MLE.
- p-values do **not** give the probability that $H_0$ is true. They give the probability of data as extreme as observed under $H_0$.
- In high-dimensional settings ($p \gg n$), classical inference breaks down and regularization or Bayesian methods become essential.

## Common Misconceptions

- **"A p-value of 0.03 means there is a 3% chance the null is true."** The p-value is $P(\text{data}|H_0)$, not $P(H_0|\text{data})$. The latter requires Bayes' theorem and a prior on $H_0$.
- **"Failing to reject the null means the null is true."** It means the data did not provide sufficient evidence against the null at the chosen significance level.
- **"Bayesian methods are subjective and therefore unscientific."** All statistical methods involve choices (significance level, test statistic, model). Bayesian priors make assumptions explicit rather than hidden.

## Connections to Other Concepts

- `probability-fundamentals.md`: Inference is built on top of probability theory; Bayes' theorem is the bridge between prior and posterior.
- `maximum-likelihood-estimation.md`: MLE is a point estimation method that arises naturally from the frequentist perspective and connects to MAP estimation in the Bayesian perspective.
- `information-theory.md`: Fisher information quantifies the amount of information data carry about a parameter and bounds estimator variance.
- `cost-latency-optimization.md`: Finding MLE or MAP estimates requires optimization; the Fisher information matrix is related to the Hessian of the log-likelihood.

## Further Reading

- Casella & Berger, *Statistical Inference* (2002) -- The standard graduate-level reference covering both frequentist and decision-theoretic perspectives.
- Wasserman, *All of Statistics* (2004) -- A concise, ML-oriented statistics textbook covering inference, bootstrapping, and Bayesian methods.
- Gelman et al., *Bayesian Data Analysis* (2013) -- The definitive text on applied Bayesian inference.
