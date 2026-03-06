# Optimization and Gradient Descent

**One-Line Summary**: Iteratively adjusting parameters to minimize a loss function -- the engine that drives model training.

**Prerequisites**: Derivatives and Gradients, Vectors and Matrices.

## What Is Optimization in ML?

Training a machine learning model is, at its core, an optimization problem. You have a **loss function** $\mathcal{L}(\boldsymbol{\theta})$ that quantifies how poorly the model (parameterized by $\boldsymbol{\theta}$) fits the data, and your goal is to find the parameter values that minimize it:

$$\boldsymbol{\theta}^* = \arg\min_{\boldsymbol{\theta}} \mathcal{L}(\boldsymbol{\theta})$$

Imagine you are blindfolded on a mountain range and can only feel the slope beneath your feet. You take a step downhill, feel the slope again, step again. This is gradient descent: a simple, iterative algorithm that uses local slope information to navigate toward a minimum.

## How It Works

### Convex vs. Non-Convex Optimization

A function $f$ is **convex** if the line segment between any two points on its graph lies above or on the graph:

$$f(\lambda \mathbf{x} + (1-\lambda)\mathbf{y}) \leq \lambda f(\mathbf{x}) + (1-\lambda)f(\mathbf{y}), \quad \forall \lambda \in [0,1]$$

For convex functions, every local minimum is a **global minimum**, and gradient descent is guaranteed to converge to it. Linear regression and logistic regression have convex loss surfaces.

**Non-convex** functions have multiple local minima, saddle points, and plateaus. Deep neural network loss surfaces are highly non-convex. Despite this, gradient-based methods work surprisingly well in practice, partly because saddle points are more common than poor local minima in high dimensions.

### The Gradient Descent Update Rule

The basic update at iteration $t$ is:

$$\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \nabla \mathcal{L}(\boldsymbol{\theta}_t)$$

where $\eta > 0$ is the **learning rate**. The negative gradient $-\nabla \mathcal{L}$ is the direction of steepest descent.

### The Learning Rate

The learning rate $\eta$ is arguably the most important hyperparameter:

- **Too large**: The updates overshoot, oscillate, or diverge.
- **Too small**: Convergence is painfully slow and the optimizer may get stuck in shallow local minima.
- **Just right**: Rapid, stable convergence.

For a quadratic loss $\mathcal{L}(\boldsymbol{\theta}) = \frac{1}{2}\boldsymbol{\theta}^T H \boldsymbol{\theta}$, convergence requires $\eta < 2/\lambda_{\max}(H)$, and the optimal fixed learning rate is $\eta^* = 2/(\lambda_{\max} + \lambda_{\min})$.

### Variants: Batch, Stochastic, and Mini-Batch

**Batch gradient descent** computes the gradient over the entire dataset:

$$\nabla \mathcal{L}(\boldsymbol{\theta}) = \frac{1}{N}\sum_{i=1}^{N} \nabla \ell(\boldsymbol{\theta}; x_i, y_i)$$

This is exact but expensive for large $N$.

**Stochastic gradient descent (SGD)** uses a single random sample:

$$\nabla \mathcal{L}(\boldsymbol{\theta}) \approx \nabla \ell(\boldsymbol{\theta}; x_i, y_i)$$

This is an unbiased estimator of the true gradient but has high variance, introducing noise that can help escape shallow local minima.

**Mini-batch SGD** compromises by using a batch of $B$ samples, reducing variance while maintaining computational efficiency. Typical batch sizes range from 32 to 512.

### Momentum

Vanilla SGD oscillates in ravines (directions with high curvature) and progresses slowly along the bottom (low curvature). **Momentum** adds a velocity term that accumulates past gradients:

$$\mathbf{v}_{t+1} = \beta \mathbf{v}_t + \nabla \mathcal{L}(\boldsymbol{\theta}_t)$$
$$\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \mathbf{v}_{t+1}$$

where $\beta \in [0, 1)$ (typically 0.9). This dampens oscillations and accelerates progress along consistent gradient directions, much like a ball rolling downhill gains speed.

**Nesterov accelerated gradient** evaluates the gradient at a "look-ahead" position $\boldsymbol{\theta}_t - \eta \beta \mathbf{v}_t$, yielding better convergence rates.

### Adaptive Learning Rate Methods

Different parameters may need different learning rates. Adaptive methods adjust per-parameter:

- **AdaGrad**: Scales learning rate by inverse square root of accumulated squared gradients. Good for sparse data but can decay too aggressively.
- **RMSProp**: Uses exponential moving average of squared gradients, preventing premature decay.
- **Adam**: Combines momentum (first moment) and RMSProp (second moment) with bias correction:

$$m_t = \beta_1 m_{t-1} + (1-\beta_1)g_t, \quad v_t = \beta_2 v_{t-1} + (1-\beta_2)g_t^2$$
$$\hat{m}_t = \frac{m_t}{1-\beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1-\beta_2^t}$$
$$\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon}\hat{m}_t$$

Adam (with defaults $\beta_1=0.9$, $\beta_2=0.999$, $\epsilon=10^{-8}$) is the most widely used optimizer in deep learning.

### Learning Rate Schedules

Rather than a fixed $\eta$, schedules systematically reduce it during training:

- **Step decay**: Reduce $\eta$ by a factor every $k$ epochs.
- **Cosine annealing**: $\eta_t = \eta_{\min} + \frac{1}{2}(\eta_{\max} - \eta_{\min})(1 + \cos(\pi t / T))$.
- **Warmup**: Start with a small $\eta$ and linearly increase it over the first few thousand steps, then decay. Critical for training Transformers.

### Local Minima and Saddle Points

In high-dimensional non-convex optimization, **saddle points** (where some eigenvalues of the Hessian are positive and others negative) vastly outnumber local minima. Gradient descent naturally escapes saddle points because the negative curvature directions provide descent. Stochastic noise further helps escape.

## Why It Matters

Optimization is the bridge between a model's mathematical formulation and its practical usefulness. A perfectly specified model is worthless if you cannot find good parameters. The choice of optimizer, learning rate, and schedule directly determines whether training converges, how fast, and to what quality of solution.

## Key Technical Details

- **Convergence rate** for convex, smooth functions with batch GD: $O(1/T)$ for general convex, $O(\rho^T)$ for strongly convex (linear convergence) where $\rho = 1 - \eta\lambda_{\min}$.
- **Gradient clipping** caps the norm of the gradient to prevent exploding updates: $\mathbf{g} \leftarrow \mathbf{g} \cdot \min(1, c/\|\mathbf{g}\|)$.
- **Weight decay** adds $\lambda\|\boldsymbol{\theta}\|^2$ to the loss, equivalent to L2 regularization in SGD but subtly different in Adam (decoupled weight decay, or AdamW).
- Second-order methods (Newton, L-BFGS) use Hessian information and converge faster per step but are impractical for very large models due to memory and computation costs.

## Common Misconceptions

- **"SGD is worse than Adam."** SGD with momentum often generalizes better than Adam in practice, especially for image classification. Adam converges faster but can converge to sharper, less generalizable minima.
- **"Non-convex means gradient descent fails."** In high-dimensional spaces, the loss landscape of overparameterized models is often benign: most local minima have loss values close to the global minimum.
- **"Learning rate is just a small number."** The learning rate interacts with batch size, architecture, and initialization. Scaling rules (e.g., linear scaling with batch size) and warmup schedules are essential for stable training.

## Connections to Other Concepts

- **Derivatives and Gradients**: The gradient $\nabla \mathcal{L}$ is the input to every optimization step. The Hessian determines curvature and convergence speed.
- **Matrix Decompositions**: The condition number $\kappa = \lambda_{\max}/\lambda_{\min}$ of the Hessian (obtained via eigendecomposition) determines how elongated the loss contours are and thus how fast GD converges.
- **Maximum Likelihood Estimation**: MLE is an optimization problem -- find the $\boldsymbol{\theta}$ maximizing the likelihood (or equivalently minimizing negative log-likelihood).
- **Norms and Distance Metrics**: L1 and L2 norms appear in regularization terms added to the loss, changing the geometry of the optimization landscape.

## Further Reading

- Boyd & Vandenberghe, *Convex Optimization* (2004) -- The standard reference for convex optimization theory, freely available online.
- Bottou, Curtis & Nocedal, "Optimization Methods for Large-Scale Machine Learning" (2018) -- Comprehensive survey of SGD variants and their convergence properties.
- Kingma & Ba, "Adam: A Method for Stochastic Optimization" (2015) -- The original Adam paper with derivations and empirical results.
