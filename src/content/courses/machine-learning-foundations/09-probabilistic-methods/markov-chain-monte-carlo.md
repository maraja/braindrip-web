# Markov Chain Monte Carlo

**One-Line Summary**: Sampling from complex posterior distributions by constructing Markov chains -- when exact inference is intractable.

**Prerequisites**: Bayesian inference, probability distributions, Markov chains, Monte Carlo integration.

## What Is Markov Chain Monte Carlo?

Imagine you need to explore a vast, mountainous landscape to understand the distribution of altitude. You cannot see the whole terrain at once, and you cannot compute the average altitude analytically. Instead, you drop a hiker at a random point and let them wander: at each step they propose moving to a nearby location and accept the move based on certain rules. Over time, the hiker spends more time at higher-altitude regions (or lower, depending on the objective). By recording the hiker's path, you build up a picture of the entire landscape. This is the core idea of MCMC.

In Bayesian inference, we need to compute expectations under the posterior distribution:

$$\mathbb{E}_{p(\theta \mid D)}[f(\theta)] = \int f(\theta) \, p(\theta \mid D) \, d\theta$$

When the posterior $p(\theta \mid D)$ is high-dimensional or has no closed form, this integral is intractable. MCMC constructs a **Markov chain** whose stationary distribution is exactly $p(\theta \mid D)$. After the chain converges, samples $\theta^{(1)}, \theta^{(2)}, \ldots, \theta^{(T)}$ approximate the posterior, and expectations are estimated as:

$$\mathbb{E}[f(\theta)] \approx \frac{1}{T} \sum_{t=1}^{T} f(\theta^{(t)})$$

## How It Works

### Markov Chains and Stationary Distributions

A Markov chain is a sequence of random variables $\theta^{(0)}, \theta^{(1)}, \ldots$ where the distribution of $\theta^{(t+1)}$ depends only on $\theta^{(t)}$, not on earlier states. A chain has a **stationary distribution** $\pi(\theta)$ if, once the chain's state is distributed as $\pi$, all subsequent states remain distributed as $\pi$.

For MCMC, we design a transition kernel $T(\theta' \mid \theta)$ such that the stationary distribution is our target posterior $p(\theta \mid D)$. A sufficient condition is **detailed balance**:

$$p(\theta \mid D) \, T(\theta' \mid \theta) = p(\theta' \mid D) \, T(\theta \mid \theta')$$

### The Metropolis-Hastings Algorithm

Metropolis-Hastings (MH) is the foundational MCMC algorithm. Given current state $\theta^{(t)}$:

1. **Propose** a candidate $\theta'$ from a proposal distribution $q(\theta' \mid \theta^{(t)})$.
2. **Compute** the acceptance probability:

$$\alpha = \min\!\left(1, \; \frac{p(\theta' \mid D) \, q(\theta^{(t)} \mid \theta')}{p(\theta^{(t)} \mid D) \, q(\theta' \mid \theta^{(t)})}\right)$$

3. **Accept** $\theta'$ with probability $\alpha$ (set $\theta^{(t+1)} = \theta'$); otherwise stay ($\theta^{(t+1)} = \theta^{(t)}$).

A key advantage: only the *ratio* $p(\theta' \mid D) / p(\theta^{(t)} \mid D)$ is needed, so the intractable normalizing constant $P(D)$ cancels. We only need to evaluate the unnormalized posterior $p(D \mid \theta)p(\theta)$.

The proposal $q$ is a design choice. A common option is a symmetric random walk: $q(\theta' \mid \theta) = \mathcal{N}(\theta' \mid \theta, \sigma^2 I)$. If $\sigma$ is too small, the chain takes tiny steps and explores slowly. If $\sigma$ is too large, most proposals land in low-probability regions and are rejected. Tuning $\sigma$ to achieve an acceptance rate of roughly 23% (in high dimensions) is a standard heuristic.

### Gibbs Sampling

Gibbs sampling is a special case of MH where each variable is sampled from its **full conditional distribution** while holding all other variables fixed:

$$\theta_j^{(t+1)} \sim p(\theta_j \mid \theta_1^{(t+1)}, \ldots, \theta_{j-1}^{(t+1)}, \theta_{j+1}^{(t)}, \ldots, \theta_d^{(t)})$$

Every proposal is accepted ($\alpha = 1$). Gibbs sampling is efficient when full conditionals are easy to sample from, which is common in conjugate models and graphical models (each variable's full conditional depends only on its Markov blanket).

However, Gibbs sampling can be slow when variables are strongly correlated, because it can only move along coordinate axes and has difficulty traversing narrow diagonal ridges in the posterior.

### Burn-In and Thinning

**Burn-in**: The initial samples before the chain has converged to the stationary distribution are discarded. These early samples are influenced by the arbitrary initialization and do not represent the target posterior.

**Thinning**: Because consecutive MCMC samples are correlated (they form a Markov chain), practitioners sometimes keep only every $k$-th sample to reduce autocorrelation. However, thinning discards information; it is often better to keep all post-burn-in samples and account for autocorrelation when computing standard errors.

### Convergence Diagnostics

Since we never know for certain whether a chain has converged, several diagnostics help assess convergence:

- **Trace plots**: Visual inspection of parameter values over iterations. A converged chain should look like a "fuzzy caterpillar" with no trends or drifts.
- **$\hat{R}$ (R-hat, Gelman-Rubin statistic)**: Compares within-chain and between-chain variance across multiple independent chains. Values near 1.0 (typically $\hat{R} < 1.01$) suggest convergence.
- **Effective Sample Size (ESS)**: Estimates the number of independent samples accounting for autocorrelation. An ESS of at least 400 per parameter is a common recommendation for reliable posterior summaries.

### Hamiltonian Monte Carlo (HMC)

HMC exploits gradient information to make large, informed moves through parameter space. It treats the negative log-posterior as a "potential energy" and introduces auxiliary "momentum" variables $\mathbf{r}$:

$$H(\theta, \mathbf{r}) = -\log p(\theta \mid D) + \frac{1}{2}\mathbf{r}^\top \mathbf{r}$$

The algorithm simulates Hamiltonian dynamics using **leapfrog integration** for $L$ steps with step size $\epsilon$:

1. Half-step update of momentum: $\mathbf{r} \leftarrow \mathbf{r} - \frac{\epsilon}{2}\nabla_\theta(-\log p(\theta \mid D))$
2. Full-step update of position: $\theta \leftarrow \theta + \epsilon \, \mathbf{r}$
3. Half-step update of momentum: $\mathbf{r} \leftarrow \mathbf{r} - \frac{\epsilon}{2}\nabla_\theta(-\log p(\theta \mid D))$

The proposal is the endpoint after $L$ leapfrog steps, accepted via the Metropolis criterion using the Hamiltonian $H$. HMC can traverse the posterior far more efficiently than random-walk MH, especially in high dimensions, because it follows the geometry of the distribution.

### The No-U-Turn Sampler (NUTS)

HMC requires choosing the number of leapfrog steps $L$ and step size $\epsilon$. The **No-U-Turn Sampler** (NUTS) eliminates the need to set $L$ by automatically determining when the simulated trajectory begins to "turn around" (double back on itself). Combined with dual averaging for adapting $\epsilon$, NUTS is the default sampler in Stan and PyMC and is considered state-of-the-art for differentiable posteriors.

## Why It Matters

MCMC is the backbone of practical Bayesian inference. It enables fitting complex hierarchical models, nonparametric models, and any posterior that lacks a closed-form solution. Modern probabilistic programming languages (Stan, PyMC, NumPyro) rely heavily on MCMC -- particularly HMC and NUTS -- to make Bayesian modeling accessible. MCMC provides asymptotically exact samples from the true posterior, giving it a fundamental correctness guarantee that approximate methods like variational inference lack.

## Key Technical Details

- MCMC requires only the unnormalized posterior -- the normalizing constant cancels in acceptance ratios.
- Metropolis-Hastings is the general framework; Gibbs sampling and HMC are important special cases.
- Convergence diagnostics ($\hat{R}$, ESS, trace plots) are essential -- never blindly trust MCMC output.
- HMC requires gradients of the log-posterior, which modern autodiff frameworks provide automatically.
- NUTS removes the need to hand-tune leapfrog trajectory length in HMC.
- MCMC provides asymptotically exact samples but can be slow for very high-dimensional problems or highly multimodal posteriors.

## Common Misconceptions

- **"More samples always means better results."** If the chain has not converged or mixes poorly, a million correlated samples may be less informative than a hundred well-mixed ones. Effective sample size matters, not raw sample count.

- **"A single long chain is sufficient."** Running multiple independent chains enables convergence diagnostics (like $\hat{R}$) and helps detect if a chain is stuck in one mode of a multimodal posterior.

- **"MCMC is always slow."** For well-conditioned, moderate-dimensional posteriors, NUTS in Stan can produce thousands of effective samples in seconds. MCMC is slow when the posterior is very high-dimensional, strongly correlated, or multimodal.

- **"Thinning is always necessary."** Thinning reduces storage but discards information. It is generally better to store all samples and compute effective sample sizes appropriately.

## Connections to Other Concepts

- **Bayesian Inference**: MCMC is the primary computational tool for performing Bayesian inference when the posterior is intractable.
- **Variational Inference**: VI is the main alternative to MCMC. MCMC is asymptotically exact but slower; VI is faster but provides an approximation. The choice depends on the problem scale and accuracy requirements.
- **Expectation-Maximization**: Monte Carlo EM replaces the intractable E-step expectation with MCMC samples from the posterior over latent variables.
- **Graphical Models**: Gibbs sampling exploits graphical model structure -- each variable is sampled conditional on its Markov blanket.
- **Gaussian Processes**: Fully Bayesian GP hyperparameter inference uses MCMC to sample from the posterior over kernel hyperparameters rather than optimizing a point estimate.

## Further Reading

- Brooks et al., "Handbook of Markov Chain Monte Carlo" (2011) -- Comprehensive reference covering theory and practice.
- Betancourt, "A Conceptual Introduction to Hamiltonian Monte Carlo" (2017) -- Outstanding exposition of HMC geometry and intuition.
- Hoffman and Gelman, "The No-U-Turn Sampler" (2014) -- The NUTS algorithm that powers modern probabilistic programming.
- Gelman et al., "Bayesian Data Analysis" (3rd Ed., 2013), Ch. 11-12 -- Practical guidance on running and diagnosing MCMC.
