# Variational Inference

**One-Line Summary**: Approximating intractable posteriors by optimization rather than sampling -- trading exactness for scalability.

**Prerequisites**: Bayesian inference, KL divergence, probability distributions, optimization (gradient descent), expectation-maximization.

## What Is Variational Inference?

Imagine you need to describe the shape of a complex, rugged coastline. Drawing it exactly is prohibitively difficult, but you can approximate it with smooth curves that capture the essential bays and peninsulas. Variational Inference (VI) does the same for probability distributions: when the true posterior $p(\theta \mid D)$ is intractable to compute or sample from, VI finds the "closest" tractable distribution from a simpler family.

The key insight is to convert an **inference problem** (computing a posterior) into an **optimization problem** (finding the best approximation). This makes VI dramatically faster than MCMC for large-scale problems, at the cost of introducing approximation error.

Formally, VI posits a family of approximate distributions $\mathcal{Q}$ and finds the member $q^*(\theta)$ that minimizes the Kullback-Leibler divergence from $q$ to the true posterior:

$$q^*(\theta) = \arg\min_{q \in \mathcal{Q}} \; \text{KL}(q(\theta) \| p(\theta \mid D))$$

## How It Works

### The Evidence Lower Bound (ELBO)

Direct minimization of $\text{KL}(q \| p(\theta \mid D))$ is impossible because it requires evaluating $p(\theta \mid D)$, which is exactly what we cannot compute. However, we can decompose the log-evidence:

$$\log p(D) = \text{ELBO}(q) + \text{KL}(q(\theta) \| p(\theta \mid D))$$

where the ELBO is:

$$\text{ELBO}(q) = \mathbb{E}_{q(\theta)}[\log p(D, \theta)] - \mathbb{E}_{q(\theta)}[\log q(\theta)]$$

Since $\log p(D)$ is a constant with respect to $q$, minimizing the KL divergence is equivalent to **maximizing the ELBO**. The ELBO can also be written as:

$$\text{ELBO}(q) = \mathbb{E}_{q(\theta)}[\log p(D \mid \theta)] - \text{KL}(q(\theta) \| p(\theta))$$

This reveals an intuitive interpretation: the first term encourages $q$ to place mass on parameters that explain the data well (data fit), while the second term penalizes $q$ for deviating from the prior (complexity penalty). This mirrors the bias-variance tradeoff from a Bayesian perspective.

### The Direction of KL Divergence

VI minimizes $\text{KL}(q \| p)$ (the "reverse KL" or "exclusive KL"), not $\text{KL}(p \| q)$ (the "forward KL" or "inclusive KL"). This choice has important consequences:

- **Reverse KL** ($\text{KL}(q \| p)$): The approximation $q$ tends to be **mode-seeking**. It concentrates on one mode of the posterior and underestimates variance. It avoids placing mass where $p$ is near zero.
- **Forward KL** ($\text{KL}(p \| q)$): The approximation would be **mass-covering**, trying to cover all modes even at the cost of spreading mass into low-probability regions.

In practice, the mode-seeking behavior of reverse KL means that VI can miss important modes of multimodal posteriors.

### Mean-Field Approximation

The most common variational family is the **mean-field** family, where the approximate posterior fully factorizes over parameters:

$$q(\theta) = \prod_{j=1}^{d} q_j(\theta_j)$$

Each factor $q_j$ is optimized independently. This assumption ignores all posterior correlations between parameters, which can be a significant limitation for models with strong parameter dependencies.

### Coordinate Ascent Variational Inference (CAVI)

Under the mean-field assumption, the optimal update for each factor $q_j$ is:

$$\log q_j^*(\theta_j) = \mathbb{E}_{q_{-j}}[\log p(D, \theta)] + \text{const}$$

where $\mathbb{E}_{q_{-j}}$ denotes the expectation with respect to all factors except $q_j$. CAVI iterates through the factors, updating each in turn while holding the others fixed. Each update is guaranteed to increase (or maintain) the ELBO, producing a monotonically converging algorithm -- similar in spirit to the EM algorithm.

For conjugate-exponential family models, each update has a closed-form solution, making CAVI especially clean.

### Stochastic Variational Inference (SVI)

CAVI requires processing the entire dataset at each iteration, which is impractical for large-scale data. **Stochastic Variational Inference** (Hoffman et al., 2013) uses stochastic optimization: at each step, subsample a minibatch of data, compute a noisy gradient of the ELBO, and take a gradient step. This enables VI to scale to massive datasets -- millions of documents for topic models, for instance.

The key requirement is that the ELBO decomposes as a sum over data points (which it does for i.i.d. models), allowing unbiased gradient estimates from minibatches.

### The Reparameterization Trick

For continuous latent variables with differentiable densities, the **reparameterization trick** enables low-variance gradient estimates. Instead of sampling $\theta \sim q_\phi(\theta)$ directly, we write:

$$\theta = g(\phi, \epsilon), \quad \epsilon \sim p(\epsilon)$$

where $g$ is a differentiable function and $p(\epsilon)$ is a fixed, simple distribution (e.g., $\mathcal{N}(0, I)$). For example, if $q_\phi(\theta) = \mathcal{N}(\mu, \sigma^2)$, we reparameterize as $\theta = \mu + \sigma \cdot \epsilon$ with $\epsilon \sim \mathcal{N}(0, 1)$.

This moves the stochasticity out of the distribution being optimized, enabling standard backpropagation through the sampling operation. Gradients with respect to $\phi = (\mu, \sigma)$ flow through $g$, producing much lower variance estimates than the score function (REINFORCE) estimator.

### Variational Autoencoders (VAEs)

Variational Autoencoders (Kingma and Welling, 2014) marry variational inference with deep learning. A VAE defines a generative model $p_\theta(x \mid z) p(z)$ with latent variables $z$ and an **inference network** (encoder) $q_\phi(z \mid x)$ that amortizes the cost of inference by learning a shared mapping from data to approximate posteriors.

The VAE objective is the ELBO:

$$\mathcal{L}(\theta, \phi) = \mathbb{E}_{q_\phi(z \mid x)}[\log p_\theta(x \mid z)] - \text{KL}(q_\phi(z \mid x) \| p(z))$$

Both $\theta$ (decoder) and $\phi$ (encoder) are jointly optimized using the reparameterization trick and stochastic gradient descent. VAEs are a foundational architecture in deep generative modeling, enabling generation of images, text, and molecular structures.

### Black-Box Variational Inference

**Black-box VI** (Ranganath et al., 2014) removes the need for model-specific derivations. It uses score function estimators (or the reparameterization trick where applicable) to compute gradients of the ELBO for arbitrary models. This makes VI applicable to any model where we can evaluate the joint log-probability $\log p(D, \theta)$ and sample from $q(\theta)$.

Modern probabilistic programming systems (Pyro, NumPyro, TensorFlow Probability) implement black-box VI, enabling users to specify a model and an approximate posterior family and automatically perform inference.

## Why It Matters

VI transforms Bayesian inference from an integration problem into an optimization problem, unlocking scalability to massive datasets and complex models. It powers topic models (LDA), deep generative models (VAEs), Bayesian neural networks, and many more. When MCMC is too slow -- particularly for models with millions of parameters or billions of data points -- VI is often the only practical option for approximate Bayesian inference.

## Key Technical Details

- VI maximizes the ELBO, which is equivalent to minimizing $\text{KL}(q \| p(\theta \mid D))$.
- The ELBO is a lower bound on the log-evidence $\log p(D)$; the gap is the KL divergence.
- Mean-field VI assumes a fully factorized posterior, ignoring parameter correlations.
- Reverse KL ($\text{KL}(q \| p)$) produces mode-seeking approximations.
- The reparameterization trick enables low-variance gradient estimation for continuous variables.
- SVI uses minibatch gradients to scale VI to large datasets.
- VAEs combine variational inference with neural network encoders and decoders.
- The ELBO can also be used for model comparison (as an approximation to the log-evidence).

## Common Misconceptions

- **"VI always underestimates posterior uncertainty."** Mean-field VI with reverse KL tends to underestimate variance, but richer variational families (normalizing flows, mixture posteriors) can capture complex posterior structure, including multimodality.

- **"VI is just a faster version of MCMC."** VI solves a different problem -- it finds the best approximation within a family, while MCMC generates asymptotically exact samples. They have different error characteristics: VI has approximation bias that does not vanish with more computation; MCMC has sampling noise that does.

- **"A higher ELBO always means a better model."** The ELBO depends on both the model and the variational family. A higher ELBO could reflect a better model or a more expressive variational approximation. Comparing ELBOs across different variational families is not straightforward.

- **"Mean-field is always sufficient."** For posteriors with strong correlations (common in hierarchical models), mean-field can produce severely biased approximations. Structured or full-rank variational families are needed.

## Connections to Other Concepts

- `bayesian-inference.md`: VI is an approximate method for Bayesian posterior computation. It complements exact methods (conjugate models) and sampling methods (MCMC).
- **MCMC**: The main alternative to VI. MCMC is asymptotically exact but slower; VI is fast but approximate. Practitioners often validate VI results against MCMC on smaller problems.
- `expectation-maximization.md`: EM is a special case of variational inference where the approximate posterior over latent variables is set to the exact conditional (a delta function over point estimates for parameters).
- `gaussian-processes.md`: Sparse variational GPs use inducing points and a variational ELBO to scale GP inference from $O(n^3)$ to $O(nm^2)$.
- `graphical-models.md`: The structure of graphical models informs the design of the variational family -- structured variational inference respects the conditional independence structure of the model.

## Further Reading

- Blei, Kucukelbir, and McAuliffe, "Variational Inference: A Review for Statisticians" (2017) -- Excellent modern review of VI theory and practice.
- Kingma and Welling, "Auto-Encoding Variational Bayes" (2014) -- The VAE paper that launched deep generative modeling.
- Hoffman et al., "Stochastic Variational Inference" (2013) -- The foundational paper on scaling VI with stochastic optimization.
- Ranganath, Gerrish, and Blei, "Black Box Variational Inference" (2014) -- General-purpose VI without model-specific derivations.
- Zhang et al., "Advances in Variational Inference" (2019) -- Survey of modern VI techniques including normalizing flows and amortized inference.
