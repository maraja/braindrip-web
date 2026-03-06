# Bayesian Inference

**One-Line Summary**: Updating beliefs with evidence via Bayes' theorem -- treating parameters as distributions rather than fixed values.

**Prerequisites**: Probability theory, conditional probability, maximum likelihood estimation, calculus (integration).

## What Is Bayesian Inference?

Imagine you hear a strange noise outside at night. Your initial guess might be "it's a cat" based on past experience -- that is your **prior**. Then you look out the window and see a large shadow -- that is your **evidence**. You combine your prior guess with this new data to update your belief: maybe it is actually a raccoon. This updating process is exactly what Bayesian inference formalizes.

Bayesian inference treats model parameters $\theta$ not as fixed unknown constants (the frequentist view) but as random variables with their own probability distributions. Given observed data $D$, we update our beliefs about $\theta$ using Bayes' theorem:

$$P(\theta \mid D) = \frac{P(D \mid \theta) \, P(\theta)}{P(D)}$$

Each component has a name and a role:

- **Prior** $P(\theta)$: What we believe about $\theta$ before seeing data.
- **Likelihood** $P(D \mid \theta)$: How probable the observed data is under a specific $\theta$.
- **Posterior** $P(\theta \mid D)$: Our updated belief after incorporating data.
- **Evidence** $P(D) = \int P(D \mid \theta) P(\theta) \, d\theta$: The marginal likelihood, a normalizing constant ensuring the posterior integrates to one.

## How It Works

### The Prior

The prior encodes domain knowledge or regularization assumptions. A **vague prior** (e.g., a very wide Gaussian) expresses minimal prior knowledge, while an **informative prior** (e.g., a narrow Gaussian centered on a physically meaningful value) encodes strong domain expertise.

Choosing the prior is both a strength and a criticism of the Bayesian approach. It makes assumptions explicit, but results can be sensitive to this choice, especially with limited data.

### Conjugate Priors

A prior is **conjugate** to a likelihood if the resulting posterior belongs to the same distribution family as the prior. This yields closed-form updates, avoiding expensive integration.

**Beta-Binomial**: For coin-flip data with likelihood $\text{Binomial}(n, \theta)$ and prior $\theta \sim \text{Beta}(\alpha, \beta)$, the posterior after observing $k$ heads in $n$ flips is:

$$\theta \mid D \sim \text{Beta}(\alpha + k, \, \beta + n - k)$$

The prior pseudo-counts $\alpha$ and $\beta$ act as "imaginary" observations.

**Gaussian-Gaussian**: If data $x_i \sim \mathcal{N}(\mu, \sigma^2)$ with known variance $\sigma^2$ and prior $\mu \sim \mathcal{N}(\mu_0, \sigma_0^2)$, the posterior on $\mu$ is Gaussian with precision-weighted mean:

$$\mu \mid D \sim \mathcal{N}\!\left(\frac{\frac{\mu_0}{\sigma_0^2} + \frac{n\bar{x}}{\sigma^2}}{\frac{1}{\sigma_0^2} + \frac{n}{\sigma^2}}, \; \left(\frac{1}{\sigma_0^2} + \frac{n}{\sigma^2}\right)^{-1}\right)$$

As $n$ grows, the posterior concentrates around the sample mean $\bar{x}$, and the prior's influence vanishes.

### MAP Estimation vs Full Bayesian

**Maximum A Posteriori (MAP)** estimation finds the single most probable parameter value:

$$\hat{\theta}_{\text{MAP}} = \arg\max_\theta \, P(\theta \mid D) = \arg\max_\theta \, \log P(D \mid \theta) + \log P(\theta)$$

MAP is a point estimate. It is equivalent to maximum likelihood with a regularization penalty -- a Gaussian prior on $\theta$ yields L2 regularization, and a Laplace prior yields L1.

**Full Bayesian inference** retains the entire posterior distribution and makes predictions by marginalizing over all possible parameter values:

$$P(x^* \mid D) = \int P(x^* \mid \theta) \, P(\theta \mid D) \, d\theta$$

This integral naturally accounts for parameter uncertainty. Predictions are hedged: regions of parameter space with low posterior probability contribute less.

### Credible Intervals vs Confidence Intervals

A **95% Bayesian credible interval** $[a, b]$ satisfies $P(a \le \theta \le b \mid D) = 0.95$. It directly states: "Given the data, there is a 95% probability that $\theta$ lies in this interval."

A **95% frequentist confidence interval** means: "If we repeated this experiment many times, 95% of computed intervals would contain the true $\theta$." It says nothing about the probability for any single interval.

### Bayesian Model Comparison

Given competing models $M_1$ and $M_2$, the **Bayes factor** compares how well each explains the data:

$$\text{BF}_{12} = \frac{P(D \mid M_1)}{P(D \mid M_2)} = \frac{\int P(D \mid \theta_1, M_1) P(\theta_1 \mid M_1) \, d\theta_1}{\int P(D \mid \theta_2, M_2) P(\theta_2 \mid M_2) \, d\theta_2}$$

The marginal likelihood $P(D \mid M)$ embodies an automatic **Occam's razor**: complex models spread their prior probability over a larger parameter space, so they are penalized unless the data strongly favors that complexity.

### Comparison with the Frequentist Approach

The fundamental philosophical difference: frequentists treat $\theta$ as a fixed (but unknown) constant and reason about the long-run behavior of estimators across repeated experiments. Bayesians treat $\theta$ as a random variable and condition on the *actually observed* data.

| Aspect | Frequentist | Bayesian |
|---|---|---|
| Parameters | Fixed constants | Random variables with distributions |
| Inference | Point estimates + confidence intervals | Full posterior distribution |
| Prior knowledge | Not formally incorporated | Encoded via prior $P(\theta)$ |
| Uncertainty | Long-run frequency properties | Degree of belief given data |
| Model comparison | Likelihood ratio tests, AIC | Bayes factors, marginal likelihood |

In practice, the two approaches often agree for large datasets. Bayesian methods shine when data is scarce, prior knowledge is available, or calibrated uncertainty is essential.

### When Bayesian Is Practical vs Intractable

Bayesian inference requires computing the posterior, which in turn requires evaluating or approximating $P(D)$. For conjugate models, this is exact. For low-dimensional problems, numerical integration or grid approximation works. For high-dimensional or complex models, exact computation is intractable and we turn to Markov Chain Monte Carlo (MCMC) or Variational Inference (VI).

Modern probabilistic programming frameworks (Stan, PyMC, NumPyro) automate much of the computational machinery, making Bayesian inference accessible even for complex hierarchical models with thousands of parameters.

## Why It Matters

Bayesian inference provides a principled framework for reasoning under uncertainty. In safety-critical applications (medical diagnosis, autonomous driving), knowing not just a prediction but *how confident* that prediction is can be the difference between a sound decision and a catastrophic one. It also provides a natural mechanism for incorporating prior knowledge, updating incrementally as data arrives (online learning), and comparing models without held-out test sets.

## Key Technical Details

- The posterior is proportional to the product of likelihood and prior: $P(\theta \mid D) \propto P(D \mid \theta) P(\theta)$.
- Conjugate priors enable closed-form posterior updates; non-conjugate priors require approximate inference.
- MAP estimation is equivalent to penalized maximum likelihood (Gaussian prior gives L2, Laplace prior gives L1).
- The evidence $P(D)$ is often intractable in high dimensions, motivating MCMC and variational methods.
- With sufficient data, the posterior concentrates and the influence of the prior diminishes (Bernstein-von Mises theorem).
- Bayesian model comparison via Bayes factors naturally penalizes unnecessary complexity.

## Common Misconceptions

- **"Bayesian inference always requires subjective priors."** Objective or reference priors (e.g., Jeffreys prior) exist and are designed to be minimally informative. Moreover, with enough data, reasonable priors converge to the same posterior.

- **"Bayesian methods are always computationally expensive."** For conjugate models, updates are trivial. Modern approximate methods (variational inference, stochastic gradient MCMC) scale to large datasets and complex models.

- **"MAP and full Bayesian are essentially the same."** MAP discards uncertainty information. Full Bayesian predictions integrate over the posterior, capturing multi-modal distributions and providing calibrated uncertainty -- MAP cannot do this.

- **"A wider credible interval means the model is worse."** A wider interval may simply reflect honest uncertainty given limited data. Overconfident narrow intervals from point estimates can be far more dangerous.

## Connections to Other Concepts

- **Gaussian Processes**: GPs are a fully Bayesian nonparametric model where the posterior over functions is computed in closed form for regression tasks.
- **Markov Chain Monte Carlo**: MCMC provides samples from the posterior when exact computation of $P(\theta \mid D)$ is intractable.
- **Variational Inference**: VI approximates the posterior with a simpler distribution, converting inference into an optimization problem.
- **Expectation-Maximization**: EM can be viewed as a special case of variational inference with a degenerate approximate posterior over latent variables.
- **Graphical Models**: Bayesian networks are directed graphical models where Bayesian inference is performed over the joint distribution.

## Further Reading

- Gelman et al., "Bayesian Data Analysis" (3rd Ed., 2013) -- The comprehensive reference for applied Bayesian methods.
- Bishop, "Pattern Recognition and Machine Learning" (2006), Ch. 2-3 -- Excellent coverage of conjugate priors and Bayesian model comparison.
- McElreath, "Statistical Rethinking" (2020) -- Accessible introduction with practical examples and code.
- Jaynes, "Probability Theory: The Logic of Science" (2003) -- Deep philosophical foundations for the Bayesian viewpoint.
