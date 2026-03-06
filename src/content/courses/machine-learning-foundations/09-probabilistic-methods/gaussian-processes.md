# Gaussian Processes

**One-Line Summary**: Nonparametric Bayesian regression defining distributions over functions -- elegant uncertainty quantification with $O(n^3)$ cost.

**Prerequisites**: Bayesian inference, multivariate Gaussian distribution, linear algebra (matrix inversion), kernel methods.

## What Is a Gaussian Process?

Imagine you are sketching a curve through a handful of data points. There are infinitely many curves that pass through those points. A Gaussian Process (GP) does not commit to a single curve -- instead it maintains a probability distribution over *all possible functions*, and the data progressively constrain which functions are plausible. Where data is dense, uncertainty is low; where data is sparse, uncertainty balloons. This is the function-space view of Bayesian regression.

Formally, a Gaussian Process is a collection of random variables, any finite number of which have a joint Gaussian distribution. A GP is fully specified by a **mean function** $m(x)$ and a **covariance (kernel) function** $k(x, x')$:

$$f \sim \mathcal{GP}(m(x), \, k(x, x'))$$

For any finite set of inputs $\{x_1, \ldots, x_n\}$, the function values $\mathbf{f} = [f(x_1), \ldots, f(x_n)]^\top$ follow a multivariate Gaussian:

$$\mathbf{f} \sim \mathcal{N}(\mathbf{m}, \, \mathbf{K})$$

where $\mathbf{m}_i = m(x_i)$ and $\mathbf{K}_{ij} = k(x_i, x_j)$.

## How It Works

### GP Regression

Given training data $\{(\mathbf{x}_i, y_i)\}_{i=1}^n$ with observation model $y_i = f(\mathbf{x}_i) + \epsilon$ where $\epsilon \sim \mathcal{N}(0, \sigma_n^2)$, and test inputs $X_*$, the posterior predictive distribution is:

$$f_* \mid X_*, X, \mathbf{y} \sim \mathcal{N}(\bar{f}_*, \, \text{cov}(f_*))$$

with:

$$\bar{f}_* = K(X_*, X) \left[K(X, X) + \sigma_n^2 I\right]^{-1} \mathbf{y}$$

$$\text{cov}(f_*) = K(X_*, X_*) - K(X_*, X) \left[K(X, X) + \sigma_n^2 I\right]^{-1} K(X, X_*)$$

The posterior mean $\bar{f}_*$ is a weighted combination of observed outputs. The posterior covariance shrinks near training points and reverts to the prior covariance far from data -- this is the GP's natural uncertainty quantification.

### Predictive Uncertainty

At a test point $x_*$, the predictive distribution provides both a best estimate (the mean) and a calibrated uncertainty (the variance). This is invaluable for decision-making: a GP can say "I am confident here" vs "I have no idea here" -- something point-estimate models cannot do natively.

### Kernel Selection

The kernel function encodes assumptions about the function being modeled -- its smoothness, periodicity, and length scale. Common choices include:

**Radial Basis Function (RBF / Squared Exponential)**:

$$k_{\text{RBF}}(x, x') = \sigma_f^2 \exp\!\left(-\frac{\|x - x'\|^2}{2\ell^2}\right)$$

Produces infinitely differentiable (very smooth) functions. The length scale $\ell$ controls how quickly correlations decay with distance, and $\sigma_f^2$ controls the output variance.

**Matern Kernel**:

$$k_{\text{Mat\acute{e}rn}}(x, x') = \frac{2^{1-\nu}}{\Gamma(\nu)} \left(\frac{\sqrt{2\nu}\|x - x'\|}{\ell}\right)^\nu K_\nu\!\left(\frac{\sqrt{2\nu}\|x - x'\|}{\ell}\right)$$

The parameter $\nu$ controls smoothness. Common choices are $\nu = 1/2$ (Ornstein-Uhlenbeck, rough), $\nu = 3/2$ (once differentiable), and $\nu = 5/2$ (twice differentiable). As $\nu \to \infty$, the Matern kernel converges to the RBF.

**Periodic Kernel**:

$$k_{\text{per}}(x, x') = \sigma_f^2 \exp\!\left(-\frac{2 \sin^2(\pi |x - x'| / p)}{\ell^2}\right)$$

Captures repeating structure with period $p$. Kernels can be composed by addition and multiplication to model complex structure (e.g., a long-term trend plus a periodic component).

Kernel hyperparameters are typically learned by maximizing the **log marginal likelihood**:

$$\log p(\mathbf{y} \mid X) = -\frac{1}{2}\mathbf{y}^\top (K + \sigma_n^2 I)^{-1}\mathbf{y} - \frac{1}{2}\log|K + \sigma_n^2 I| - \frac{n}{2}\log 2\pi$$

### GP Classification

For classification, the likelihood is non-Gaussian (e.g., Bernoulli), so the posterior is no longer analytically tractable. Approximations such as the Laplace approximation or Expectation Propagation are used to obtain an approximate Gaussian posterior over the latent function, which is then passed through a sigmoid to produce class probabilities.

### Computational Cost and Sparse Approximations

The dominant cost in GP regression is inverting the $n \times n$ kernel matrix, requiring $O(n^3)$ time and $O(n^2)$ storage. This limits standard GPs to datasets of roughly $n \leq 10{,}000$.

**Sparse GP approximations** address this by selecting $m \ll n$ **inducing points** $Z$ and approximating the full GP. The Sparse Variational GP (SVGP) optimizes the inducing points and a variational distribution, reducing cost to $O(nm^2)$. This enables GP-scale uncertainty quantification on datasets with millions of observations.

### Connection to Neural Networks

Neal (1996) showed that a single-hidden-layer neural network with i.i.d. random weights converges to a GP as the width goes to infinity. More recently, the Neural Tangent Kernel (NTK) framework established that infinitely wide deep networks trained by gradient descent also correspond to GPs. This connection reveals that GPs can be seen as a limiting case of neural networks, providing a bridge between Bayesian nonparametrics and deep learning.

### A Concrete Example

Consider modeling temperature as a function of time of day with 10 noisy observations. A GP with an RBF kernel ($\ell = 3$ hours, $\sigma_f^2 = 5$, $\sigma_n^2 = 0.5$) produces a smooth posterior mean that interpolates between observations, with narrow uncertainty bands near data points and wide bands during unobserved hours (e.g., 2-5 AM if no data was collected then). Adding a periodic kernel component with $p = 24$ hours would further encode the daily cycle, improving extrapolation beyond the observed window.

## Why It Matters

GPs are the gold standard for uncertainty-aware regression in low-to-moderate dimensional settings. They power **Bayesian optimization** (used to tune hyperparameters of expensive models), geostatistics (kriging), and active learning. Their principled uncertainty estimates enable intelligent exploration in reinforcement learning and experimental design. When you need to know what you do not know, GPs are a natural choice.

## Key Technical Details

- A GP is fully specified by its mean function and kernel function.
- The posterior predictive distribution is available in closed form for regression with Gaussian noise.
- Kernel hyperparameters are learned by maximizing the log marginal likelihood (type-II maximum likelihood).
- Standard GP regression costs $O(n^3)$ in time and $O(n^2)$ in memory.
- Sparse approximations with $m$ inducing points reduce cost to $O(nm^2)$.
- Kernel choice encodes inductive bias: smoothness, periodicity, stationarity.
- Kernels can be composed (summed, multiplied) to model complex structure.

## Common Misconceptions

- **"GPs only work for small datasets."** Sparse approximations and GPU-accelerated frameworks (GPyTorch, KeOps) enable GPs on datasets with hundreds of thousands or even millions of points.

- **"The RBF kernel is always a safe default."** The RBF kernel assumes infinite smoothness, which can lead to overconfident predictions between data points. The Matern kernel with finite $\nu$ is often a more realistic choice for physical processes.

- **"GPs are just kernel regression."** GPs provide a full probabilistic framework with uncertainty estimates, marginal likelihood for model selection, and principled handling of noise -- kernel regression alone does not.

- **"GP uncertainty is always calibrated."** Uncertainty quality depends heavily on kernel choice. A misspecified kernel can produce overconfident or poorly calibrated uncertainty bands.

## Connections to Other Concepts

- **Bayesian Inference**: GPs are a canonical example of full Bayesian nonparametric inference -- the posterior over functions is computed exactly (for regression).
- **Variational Inference**: Sparse variational GPs use variational methods to scale GPs to large datasets, optimizing a variational ELBO.
- **Expectation-Maximization**: Hyperparameter optimization for GPs via marginal likelihood is related to type-II ML estimation.
- **Graphical Models**: GPs can be placed within graphical model frameworks, e.g., GP-LVMs (Gaussian Process Latent Variable Models) for unsupervised learning.
- **MCMC**: When the kernel has complex hyperparameter posteriors, MCMC can be used for fully Bayesian hyperparameter inference.

## Further Reading

- Rasmussen and Williams, "Gaussian Processes for Machine Learning" (2006) -- The definitive textbook, available free online.
- Hensman et al., "Scalable Variational Gaussian Process Classification" (2015) -- Key paper on sparse variational GPs.
- Wilson et al., "Kernel Interpolation for Scalable Structured Gaussian Processes (KISS-GP)" (2015) -- Exploiting structure for scalable inference.
- Gardner et al., "GPyTorch: Blackbox Matrix-Matrix Gaussian Process Inference with GPU Acceleration" (2018) -- Modern computational framework.
