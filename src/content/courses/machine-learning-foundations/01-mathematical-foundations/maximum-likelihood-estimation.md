# Maximum Likelihood Estimation

**One-Line Summary**: Finding the parameter values that make observed data most probable -- the dominant paradigm for fitting ML models.

**Prerequisites**: Probability Fundamentals, Derivatives and Gradients, Optimization and Gradient Descent.

## What Is Maximum Likelihood Estimation?

Suppose you flip a coin 100 times and observe 73 heads. What is the most reasonable estimate of the coin's bias $p$? Intuitively, $\hat{p} = 0.73$ -- the value that makes the observed outcome most probable. This intuition is **Maximum Likelihood Estimation (MLE)**: choose the parameter values that maximize the probability of the data you actually observed.

More formally, given observed data $D = \{x_1, x_2, \ldots, x_n\}$ assumed to be generated from a distribution $p(x|\theta)$, MLE finds:

$$\hat{\theta}_{\text{MLE}} = \arg\max_{\theta} \, p(D|\theta)$$

MLE is the single most important estimation principle in ML. When you train a logistic regression, fit a Gaussian mixture model, or minimize cross-entropy loss in a neural network, you are (often unknowingly) performing MLE.

## How It Works

### The Likelihood Function

The **likelihood function** $\mathcal{L}(\theta)$ is the joint probability of the observed data, viewed as a function of the parameters:

$$\mathcal{L}(\theta) = p(D|\theta) = \prod_{i=1}^{n} p(x_i|\theta)$$

The product arises from assuming the observations are **independent and identically distributed (i.i.d.)**. Critically, the likelihood is *not* a probability distribution over $\theta$ -- it does not integrate to 1 over parameter space.

### The Log-Likelihood

Products of many small probabilities cause numerical underflow. Taking the logarithm converts products to sums and is monotonic, so the maximizer is unchanged:

$$\ell(\theta) = \log \mathcal{L}(\theta) = \sum_{i=1}^{n} \log p(x_i|\theta)$$

The **negative log-likelihood** (NLL) $-\ell(\theta)$ is the quantity minimized in practice, turning maximum likelihood into a minimization problem compatible with gradient descent.

### MLE for a Gaussian Distribution

Given $x_1, \ldots, x_n \sim \mathcal{N}(\mu, \sigma^2)$, the log-likelihood is:

$$\ell(\mu, \sigma^2) = -\frac{n}{2}\log(2\pi) - \frac{n}{2}\log(\sigma^2) - \frac{1}{2\sigma^2}\sum_{i=1}^n (x_i - \mu)^2$$

Setting $\frac{\partial \ell}{\partial \mu} = 0$:

$$\hat{\mu}_{\text{MLE}} = \frac{1}{n}\sum_{i=1}^n x_i = \bar{x}$$

Setting $\frac{\partial \ell}{\partial \sigma^2} = 0$:

$$\hat{\sigma}^2_{\text{MLE}} = \frac{1}{n}\sum_{i=1}^n (x_i - \bar{x})^2$$

Note that $\hat{\sigma}^2_{\text{MLE}}$ divides by $n$, not $n-1$, making it a **biased** estimator (it systematically underestimates the true variance). This bias vanishes as $n \to \infty$.

### MLE for a Bernoulli Distribution

Given $x_1, \ldots, x_n \sim \text{Bernoulli}(p)$ where $x_i \in \{0, 1\}$:

$$\ell(p) = \sum_{i=1}^n [x_i \log p + (1 - x_i)\log(1-p)]$$

Setting $\frac{\partial \ell}{\partial p} = 0$:

$$\hat{p}_{\text{MLE}} = \frac{1}{n}\sum_{i=1}^n x_i = \bar{x}$$

This log-likelihood is precisely the **negative binary cross-entropy** loss. When you train a logistic regression model by minimizing binary cross-entropy, you are performing MLE under a Bernoulli model.

### Connection to Cross-Entropy Loss

For a classification model with predicted probabilities $q(y|x)$ and true distribution $p(y|x)$:

$$\text{Cross-Entropy} = -\sum_{y} p(y|x) \log q(y|x)$$

For one-hot encoded labels ($p$ puts all mass on the true class), this becomes $-\log q(y_{\text{true}}|x)$ -- exactly the negative log-likelihood. Minimizing cross-entropy loss is MLE.

### Regularity Conditions and Properties

Under regularity conditions (the parameter space is open, the model is identifiable, the log-likelihood is sufficiently smooth), MLE has several attractive asymptotic properties:

- **Consistency**: $\hat{\theta}_{\text{MLE}} \xrightarrow{p} \theta_{\text{true}}$ as $n \to \infty$.
- **Asymptotic normality**: $\sqrt{n}(\hat{\theta}_{\text{MLE}} - \theta_{\text{true}}) \xrightarrow{d} \mathcal{N}(0, I(\theta)^{-1})$, where $I(\theta)$ is the Fisher information.
- **Asymptotic efficiency**: MLE achieves the Cramer-Rao lower bound asymptotically -- no consistent estimator has lower variance.
- **Invariance**: If $\hat{\theta}$ is the MLE of $\theta$, then $g(\hat{\theta})$ is the MLE of $g(\theta)$ for any function $g$.

### From MLE to MAP Estimation

**Maximum a posteriori (MAP)** estimation adds a prior $p(\theta)$:

$$\hat{\theta}_{\text{MAP}} = \arg\max_{\theta} \, p(\theta|D) = \arg\max_{\theta} \, [p(D|\theta) \cdot p(\theta)]$$

In log space:

$$\hat{\theta}_{\text{MAP}} = \arg\max_{\theta} \, [\ell(\theta) + \log p(\theta)]$$

The prior acts as a **regularizer**:
- Gaussian prior $p(\theta) = \mathcal{N}(0, \tau^2 I)$ adds $-\frac{1}{2\tau^2}\|\theta\|^2$ to the log-likelihood, equivalent to **L2 regularization** (weight decay).
- Laplace prior $p(\theta) = \text{Laplace}(0, b)$ adds $-\frac{1}{b}\|\theta\|_1$, equivalent to **L1 regularization** (promoting sparsity).

MAP is MLE with a flat (uninformative) prior. As the dataset grows, the likelihood dominates the prior and MAP converges to MLE.

## Why It Matters

MLE is the default method for fitting parametric models in ML. Nearly every loss function you encounter in supervised learning -- mean squared error, cross-entropy, Poisson regression loss -- corresponds to MLE under a specific probabilistic model. Understanding this connection lets you derive loss functions from first principles, diagnose when a loss function is inappropriate, and extend models by changing distributional assumptions.

## Key Technical Details

- MLE can **overfit** with limited data. For example, the MLE for a Gaussian with one data point sets $\sigma^2 = 0$. Regularization (MAP) or Bayesian inference mitigate this.
- For **exponential family** distributions, the MLE has a closed-form solution in terms of sufficient statistics.
- The **EM algorithm** (Expectation-Maximization) extends MLE to models with latent variables (e.g., Gaussian Mixture Models) by iterating between computing expected sufficient statistics and maximizing the expected log-likelihood.
- **Fisher information** $I(\theta) = -\mathbb{E}[\nabla^2 \ell(\theta)]$ is the expected curvature of the log-likelihood. It determines both the Cramer-Rao bound and the asymptotic variance of MLE.
- For neural networks, MLE with Gaussian noise assumption yields MSE loss; MLE with Bernoulli assumption yields binary cross-entropy; MLE with categorical assumption yields categorical cross-entropy.

## Common Misconceptions

- **"MLE always gives the best estimate."** MLE can overfit, especially in small samples or high-dimensional settings. Bayesian methods or regularized MLE often perform better.
- **"MLE and MAP are fundamentally different philosophies."** MAP is MLE plus a penalty term. With a uniform prior, MAP reduces to MLE. They are points on a spectrum from fully frequentist to fully Bayesian.
- **"Minimizing cross-entropy is unrelated to probability."** Cross-entropy minimization IS maximum likelihood estimation under a categorical model. The loss function has a direct probabilistic interpretation.

## Connections to Other Concepts

- `probability-fundamentals.md`: MLE is defined in terms of the likelihood, which is the joint probability of data under a parametric model.
- `derivatives-and-gradients.md`: Finding the MLE analytically requires setting the gradient of the log-likelihood to zero. Numerically, gradient descent on the NLL is the standard approach.
- `cost-latency-optimization.md`: Training a model by minimizing NLL is an optimization problem. Adam, SGD, and other optimizers are the tools.
- `information-theory.md`: The negative log-likelihood is the cross-entropy between the empirical data distribution and the model. MLE minimizes this cross-entropy, which is equivalent to minimizing KL divergence from the true distribution.
- `statistical-inference.md`: MLE is a point estimator with known asymptotic properties. Fisher information connects MLE variance to the Cramer-Rao bound.
- `norms-and-distance-metrics.md`: L1 and L2 regularization correspond to Laplace and Gaussian priors in the MAP framework.

## Further Reading

- Casella & Berger, *Statistical Inference*, Chapter 7 (2002) -- Rigorous treatment of MLE properties, sufficiency, and the Cramer-Rao bound.
- Murphy, *Machine Learning: A Probabilistic Perspective*, Chapter 8 (2012) -- MLE and MAP in the context of ML models.
- Myung, "Tutorial on Maximum Likelihood Estimation" (2003) -- Accessible introduction with worked examples.
