# Expectation-Maximization

**One-Line Summary**: Iteratively inferring latent variables (E-step) and optimizing parameters (M-step) -- the workhorse for incomplete data.

**Prerequisites**: Maximum likelihood estimation, probability theory, Jensen's inequality, latent variable models.

## What Is Expectation-Maximization?

Suppose you walk into a room where two people are flipping coins, but you cannot see who flipped which coin -- you only see the outcomes. You want to estimate the bias of each coin, but you are missing crucial information (which coin produced which flip). The Expectation-Maximization (EM) algorithm solves exactly this kind of problem: iteratively guessing the missing information given current parameter estimates, then updating the parameters given those guesses.

EM is a general-purpose algorithm for finding maximum likelihood (or MAP) estimates in models with **latent (unobserved) variables**. Given observed data $X$, latent variables $Z$, and parameters $\theta$, the goal is to maximize the incomplete-data log-likelihood:

$$\ell(\theta) = \log p(X \mid \theta) = \log \int p(X, Z \mid \theta) \, dZ$$

Direct optimization of this marginal log-likelihood is often intractable because the integral (or sum) over latent variables couples the parameters in complex ways. EM sidesteps this by iterating two steps that are each tractable.

## How It Works

### The EM Framework

Starting from an initial parameter estimate $\theta^{(0)}$, EM alternates:

**E-step (Expectation)**: Compute the expected value of the complete-data log-likelihood with respect to the posterior distribution of latent variables given the current parameters:

$$Q(\theta \mid \theta^{(t)}) = \mathbb{E}_{Z \mid X, \theta^{(t)}}\!\left[\log p(X, Z \mid \theta)\right]$$

This requires computing $p(Z \mid X, \theta^{(t)})$, the posterior over latent variables. In practice, this often means computing expected sufficient statistics.

**M-step (Maximization)**: Find the parameters that maximize $Q$:

$$\theta^{(t+1)} = \arg\max_\theta \, Q(\theta \mid \theta^{(t)})$$

Because the complete-data log-likelihood $\log p(X, Z \mid \theta)$ typically has a simpler form than the marginal $\log p(X \mid \theta)$, the M-step is often available in closed form.

### Derivation via Jensen's Inequality and the ELBO

For any distribution $q(Z)$ over latent variables, Jensen's inequality gives:

$$\log p(X \mid \theta) = \log \int p(X, Z \mid \theta) \, dZ = \log \int q(Z) \frac{p(X, Z \mid \theta)}{q(Z)} \, dZ \geq \int q(Z) \log \frac{p(X, Z \mid \theta)}{q(Z)} \, dZ$$

The right-hand side is the **Evidence Lower Bound (ELBO)**:

$$\text{ELBO}(q, \theta) = \mathbb{E}_{q}[\log p(X, Z \mid \theta)] - \mathbb{E}_{q}[\log q(Z)]$$

The gap between $\log p(X \mid \theta)$ and the ELBO is exactly $\text{KL}(q(Z) \| p(Z \mid X, \theta))$. The E-step sets $q(Z) = p(Z \mid X, \theta^{(t)})$, closing this gap to zero. The M-step then maximizes the ELBO with respect to $\theta$. This guarantees that each EM iteration increases (or maintains) the log-likelihood:

$$\ell(\theta^{(t+1)}) \geq \ell(\theta^{(t)})$$

### Convergence Properties

EM monotonically increases the incomplete-data log-likelihood and is guaranteed to converge to a **local maximum** (or saddle point) of $\ell(\theta)$. It does not guarantee finding the global maximum. In practice, multiple random restarts are used to mitigate sensitivity to initialization.

The rate of convergence depends on the "fraction of missing information" -- when latent variables carry a large fraction of the total information, convergence can be slow.

### Canonical Example: Gaussian Mixture Models

A Gaussian Mixture Model (GMM) models data as arising from $K$ Gaussian components:

$$p(x \mid \theta) = \sum_{k=1}^{K} \pi_k \, \mathcal{N}(x \mid \mu_k, \Sigma_k)$$

where $\pi_k$ are mixing weights, and $\theta = \{\pi_k, \mu_k, \Sigma_k\}_{k=1}^K$. The latent variable $z_i \in \{1, \ldots, K\}$ indicates which component generated observation $x_i$.

**E-step**: Compute responsibilities (posterior assignment probabilities):

$$r_{ik} = \frac{\pi_k \, \mathcal{N}(x_i \mid \mu_k, \Sigma_k)}{\sum_{j=1}^{K} \pi_j \, \mathcal{N}(x_i \mid \mu_j, \Sigma_j)}$$

**M-step**: Update parameters using responsibilities as soft weights:

$$\mu_k^{\text{new}} = \frac{\sum_i r_{ik} x_i}{\sum_i r_{ik}}, \quad \Sigma_k^{\text{new}} = \frac{\sum_i r_{ik} (x_i - \mu_k^{\text{new}})(x_i - \mu_k^{\text{new}})^\top}{\sum_i r_{ik}}, \quad \pi_k^{\text{new}} = \frac{\sum_i r_{ik}}{n}$$

### K-Means as Hard EM

K-means clustering can be viewed as a limiting case of EM for GMMs where responsibilities are "hard" (0 or 1) rather than soft. Each point is assigned to exactly one cluster (hard E-step), and cluster centroids are updated (M-step). This corresponds to EM with isotropic covariances $\Sigma_k = \epsilon I$ as $\epsilon \to 0$.

### Applications Beyond GMMs

EM is used in a wide range of models with latent variables and tractable complete-data likelihoods:

- **Hidden Markov Models**: The Baum-Welch algorithm is EM applied to HMMs. The E-step computes forward-backward probabilities; the M-step updates transition and emission parameters.
- **Probabilistic PCA and Factor Analysis**: Latent low-dimensional representations are inferred in the E-step; loading matrices and noise variances are updated in the M-step.
- **Topic Models**: Latent Dirichlet Allocation (LDA) uses a variational EM variant where the E-step itself requires approximate inference over per-document topic proportions.
- **Missing Data Imputation**: When data entries are missing at random, EM imputes the expected values of missing entries (E-step) and re-estimates model parameters (M-step).
- **Semi-supervised Learning**: EM leverages unlabeled data by treating labels as latent variables, combining the supervised signal from labeled data with structure discovered in unlabeled data.

### Practical Considerations

Initialization significantly impacts EM's final solution. Common strategies include running K-means first (for GMMs), using random restarts, or employing heuristic initializations based on domain knowledge. Monitoring the log-likelihood across iterations helps verify correct implementation -- any decrease indicates a bug. Convergence is typically declared when the relative change in log-likelihood falls below a threshold (e.g., $10^{-6}$).

## Why It Matters

EM is one of the most widely used algorithms in statistical machine learning. Whenever data is incomplete -- whether due to missing observations, unobserved cluster assignments, or hidden states -- EM provides a principled, general-purpose framework for parameter estimation. Its simplicity (each step is often closed-form) and monotonic convergence guarantee make it a reliable workhorse.

## Key Technical Details

- EM monotonically increases the incomplete-data log-likelihood at each iteration.
- Convergence is to a local maximum; multiple restarts are recommended.
- The E-step computes the posterior over latent variables $p(Z \mid X, \theta^{(t)})$.
- The M-step maximizes the expected complete-data log-likelihood $Q(\theta \mid \theta^{(t)})$.
- EM can be derived as coordinate ascent on the ELBO, alternating over $q$ and $\theta$.
- Convergence speed depends on the fraction of missing information.
- Variants include hard EM, stochastic EM, and variational EM (for intractable E-steps).

## Common Misconceptions

- **"EM always finds the global optimum."** EM converges to a local maximum. The log-likelihood surface for mixture models is typically multimodal, so initialization matters significantly.

- **"EM is only for Gaussian mixtures."** GMMs are the canonical example, but EM applies to any latent variable model with a tractable complete-data likelihood: HMMs, factor analysis, missing data problems, and many more.

- **"The E-step always requires computing the full posterior."** In some models, only the expected sufficient statistics are needed, not the full posterior distribution. This can simplify computation considerably.

- **"EM is a Bayesian method."** Standard EM produces maximum likelihood point estimates. It does not maintain uncertainty over parameters. However, it can be extended to MAP estimation by adding a prior, and it has deep connections to variational inference.

## Connections to Other Concepts

- `variational-inference.md`: EM is a special case of variational inference where the E-step sets $q(Z) = p(Z \mid X, \theta)$ exactly. When this exact E-step is intractable, variational EM uses an approximate $q(Z)$.
- `bayesian-inference.md`: EM finds point estimates of parameters; full Bayesian treatment would place a prior on $\theta$ and integrate it out.
- `graphical-models.md`: Many graphical models (HMMs, LDA) use EM or its variants for parameter estimation. The structure of the graphical model determines the form of the E-step.
- `gaussian-processes.md`: Hyperparameter optimization in GPs via marginal likelihood can be seen as a type-II ML procedure related to the M-step of EM.
- **MCMC**: When the E-step is intractable, Monte Carlo EM replaces the expectation with samples from the posterior over latent variables.

## Further Reading

- Dempster, Laird, and Rubin, "Maximum Likelihood from Incomplete Data via the EM Algorithm" (1977) -- The foundational paper.
- Bishop, "Pattern Recognition and Machine Learning" (2006), Ch. 9 -- Clear derivation of EM for GMMs with the ELBO perspective.
- McLachlan and Krishnan, "The EM Algorithm and Extensions" (2008) -- Comprehensive treatment including convergence theory and variants.
- Neal and Hinton, "A View of the EM Algorithm That Justifies Incremental, Sparse, and Other Variants" (1998) -- The ELBO-based view that connects EM to variational inference.
