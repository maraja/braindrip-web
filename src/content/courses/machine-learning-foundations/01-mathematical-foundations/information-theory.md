# Information Theory

**One-Line Summary**: Entropy, KL divergence, and mutual information -- quantifying uncertainty, surprise, and the difference between distributions.

**Prerequisites**: Probability Fundamentals, Maximum Likelihood Estimation.

## What Is Information Theory?

Imagine you learn that the sun rose this morning. That is unsurprising -- it carries almost no information. Now imagine learning that a major earthquake just struck your city. That is highly surprising and carries enormous information. **Information theory**, founded by Claude Shannon in 1948, formalizes this intuition: unlikely events carry more information, and the *average* information content of a source is its **entropy**.

In ML, information theory provides the mathematical foundation for loss functions (cross-entropy), model comparison (KL divergence), feature selection (mutual information), and the theoretical limits of data compression and communication. It is the bridge between probability and learning.

## How It Works

### Shannon Entropy

The **entropy** of a discrete random variable $X$ with PMF $p(x)$ is:

$$H(X) = -\sum_{x} p(x) \log p(x)$$

By convention, $0 \log 0 = 0$ (justified by continuity). When using $\log_2$, entropy is measured in **bits**; with $\ln$, in **nats**.

Entropy quantifies the average uncertainty or "surprise" in a distribution:

- **Deterministic** ($p(x) = 1$ for some $x$): $H = 0$ bits. No surprise.
- **Uniform over $k$ outcomes**: $H = \log k$ bits. Maximum surprise for $k$ outcomes.
- **Biased coin** ($p = 0.9$): $H \approx 0.47$ bits. Less surprising than fair coin ($H = 1$ bit).

For continuous variables, the **differential entropy** is:

$$h(X) = -\int f(x) \log f(x) \, dx$$

Unlike discrete entropy, differential entropy can be negative. Among continuous distributions with fixed variance $\sigma^2$, the Gaussian maximizes differential entropy: $h(X) = \frac{1}{2}\log(2\pi e \sigma^2)$.

### Cross-Entropy

The **cross-entropy** between a true distribution $p$ and a model distribution $q$ is:

$$H(p, q) = -\sum_{x} p(x) \log q(x)$$

Cross-entropy measures the average number of bits needed to encode data from $p$ using a code optimized for $q$. It decomposes as:

$$H(p, q) = H(p) + D_{\text{KL}}(p \| q)$$

Since $H(p)$ is constant with respect to $q$, minimizing cross-entropy is equivalent to minimizing KL divergence. This is precisely why cross-entropy is the standard loss function for classification: it drives the model distribution $q$ toward the data distribution $p$.

### KL Divergence

The **Kullback-Leibler divergence** from $q$ to $p$ is:

$$D_{\text{KL}}(p \| q) = \sum_{x} p(x) \log \frac{p(x)}{q(x)} = H(p, q) - H(p)$$

Key properties:

- $D_{\text{KL}}(p \| q) \geq 0$ (Gibbs' inequality), with equality iff $p = q$.
- **Not symmetric**: $D_{\text{KL}}(p \| q) \neq D_{\text{KL}}(q \| p)$ in general. This asymmetry has practical consequences.
- **Not a metric**: Violates symmetry and the triangle inequality.

The asymmetry matters in practice:

- **Forward KL** $D_{\text{KL}}(p \| q)$: penalizes $q$ for assigning low probability where $p$ is high. Produces **mean-seeking** approximations. Used in MLE.
- **Reverse KL** $D_{\text{KL}}(q \| p)$: penalizes $q$ for assigning high probability where $p$ is low. Produces **mode-seeking** approximations. Used in variational inference.

### Mutual Information

The **mutual information** between $X$ and $Y$ measures how much knowing one reduces uncertainty about the other:

$$I(X; Y) = D_{\text{KL}}(p(x,y) \| p(x)p(y)) = H(X) - H(X|Y) = H(Y) - H(Y|X)$$

where $H(X|Y) = -\sum_{x,y} p(x,y)\log p(x|y)$ is the **conditional entropy**.

Properties:

- $I(X; Y) \geq 0$, with equality iff $X$ and $Y$ are independent.
- $I(X; Y) = I(Y; X)$ (symmetric, unlike KL divergence).
- $I(X; X) = H(X)$ (self-information equals entropy).

Mutual information is used in:

- **Feature selection**: Rank features by $I(\text{feature}; \text{target})$.
- **Information Bottleneck**: Compress representations while preserving relevant information.
- **Representation learning**: InfoNCE loss in contrastive learning is a lower bound on mutual information.

### Information Gain and Decision Trees

**Information gain** is the reduction in entropy achieved by splitting on a feature:

$$IG(Y; X) = H(Y) - H(Y|X) = I(Y; X)$$

This is exactly mutual information. Decision tree algorithms like ID3 and C4.5 greedily select the feature with maximum information gain at each split. CART uses the closely related **Gini impurity** instead, which approximates entropy near its maximum.

### Connection to ML Loss Functions

The deep connection between information theory and ML loss functions:

| ML Loss | Information-Theoretic View |
|---|---|
| Binary cross-entropy | $H(p, q)$ for Bernoulli distributions |
| Categorical cross-entropy | $H(p, q)$ for categorical distributions |
| MSE (Gaussian model) | Proportional to $-\log q(x)$ under Gaussian $q$ |
| KL loss in VAEs | $D_{\text{KL}}(q(z|x) \| p(z))$ regularization term |

## Why It Matters

Information theory provides the theoretical underpinning for why certain loss functions work. Cross-entropy is not an arbitrary choice -- it is the information-theoretically optimal objective for matching distributions. KL divergence tells you exactly how "far apart" two distributions are. Mutual information quantifies relevance without assuming linearity. These tools are essential for understanding generative models (VAEs, diffusion), contrastive learning, and the information-theoretic limits of learning.

## Key Technical Details

- **Jensen's inequality** underlies the non-negativity of KL divergence: $\mathbb{E}[\log(X)] \leq \log(\mathbb{E}[X])$ for concave $\log$.
- **Data processing inequality**: For a Markov chain $X \to Y \to Z$, $I(X; Z) \leq I(X; Y)$. Processing data cannot create information.
- **KL divergence for Gaussians** has a closed form: $D_{\text{KL}}(\mathcal{N}_0 \| \mathcal{N}_1) = \frac{1}{2}[\log\frac{|\Sigma_1|}{|\Sigma_0|} - d + \text{tr}(\Sigma_1^{-1}\Sigma_0) + (\mu_1-\mu_0)^T\Sigma_1^{-1}(\mu_1-\mu_0)]$.
- **Label smoothing** in classification adds a small uniform component to one-hot labels, preventing the model from driving $q$ to extreme values and implicitly regularizing the cross-entropy.
- Entropy is **maximized** by the uniform distribution (discrete) or the Gaussian (continuous, given fixed variance). This is the principle of maximum entropy, used to derive least-informative priors.

## Common Misconceptions

- **"KL divergence is a distance metric."** It is not symmetric and does not satisfy the triangle inequality. The Jensen-Shannon divergence $\frac{1}{2}D_{\text{KL}}(p\|m) + \frac{1}{2}D_{\text{KL}}(q\|m)$ where $m = \frac{p+q}{2}$ is a true metric (after taking the square root).
- **"Cross-entropy and KL divergence are different objectives."** When optimizing over model parameters, they differ only by a constant ($H(p)$), so they have identical gradients and optima.
- **"Low entropy means a good model."** A model can have low entropy by being overconfident about wrong predictions. Calibration matters as much as sharpness.

## Connections to Other Concepts

- **Probability Fundamentals**: Entropy is defined in terms of probability distributions. All information-theoretic quantities are functions of distributions.
- **Maximum Likelihood Estimation**: MLE minimizes cross-entropy, which equals KL divergence up to a constant. This is the fundamental link between information theory and parameter estimation.
- **Statistical Inference**: Fisher information (different from Shannon information) bounds estimator variance but is conceptually related -- both quantify "information" in data.
- **Derivatives and Gradients**: The gradient of cross-entropy loss drives parameter updates in neural network training.
- **Norms and Distance Metrics**: KL divergence measures distributional distance, complementing geometric distances (L2, cosine) in feature space.

## Further Reading

- Cover & Thomas, *Elements of Information Theory* (2006) -- The standard reference, comprehensive and rigorous.
- MacKay, *Information Theory, Inference, and Learning Algorithms* (2003) -- Beautifully written, bridges information theory and ML; freely available online.
- Shannon, "A Mathematical Theory of Communication" (1948) -- The foundational paper that started it all.
