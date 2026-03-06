# Activation Functions

**One-Line Summary**: Nonlinear transforms between layers -- ReLU, sigmoid, tanh, and why the choice matters for gradient flow and expressivity.

**Prerequisites**: Derivatives and chain rule, perceptrons and multilayer networks, backpropagation, vanishing gradients concept.

## What Are Activation Functions?

Think of a neuron as a judge scoring a performance. The weighted sum of inputs produces a raw score, but the activation function decides how to express that score -- should it be a smooth probability, a sharp yes/no, or a "pass-through only if positive"? The activation function is the nonlinear transformation applied to each neuron's pre-activation value, and it is what gives neural networks their power to model complex, nonlinear relationships.

Formally, given a pre-activation $z = \mathbf{w}^\top \mathbf{x} + b$, the activation function $f(z)$ produces the neuron's output $h = f(z)$. Without nonlinear activations, a multilayer network collapses to a single linear transformation, regardless of depth. The choice of $f$ profoundly affects training dynamics, gradient flow, and the kinds of functions the network can efficiently represent.

## How It Works

### Sigmoid

$$\sigma(z) = \frac{1}{1 + e^{-z}}, \quad \sigma'(z) = \sigma(z)(1 - \sigma(z))$$

The sigmoid squashes inputs to $(0, 1)$, making it natural for probabilities. However, it has two critical problems: (1) **saturation** -- for $|z| \gg 0$, the derivative $\sigma'(z) \approx 0$, causing vanishing gradients; and (2) **non-zero-centered outputs** -- since $\sigma(z) > 0$ always, gradients on weights are always the same sign for a given layer, causing inefficient zig-zag updates during optimization.

The maximum derivative is $\sigma'(0) = 0.25$, meaning even in the best case, each layer attenuates gradients by at least 75%.

### Tanh

$$\tanh(z) = \frac{e^z - e^{-z}}{e^z + e^{-z}}, \quad \tanh'(z) = 1 - \tanh^2(z)$$

Tanh outputs are in $(-1, 1)$ and are **zero-centered**, solving one of sigmoid's problems. Its maximum derivative is $\tanh'(0) = 1$, which is better for gradient flow. However, it still **saturates** for large $|z|$, so vanishing gradients remain an issue in deep networks.

### ReLU (Rectified Linear Unit)

$$\text{ReLU}(z) = \max(0, z), \quad \text{ReLU}'(z) = \begin{cases} 1 & z > 0 \\ 0 & z \leq 0 \end{cases}$$

ReLU was the breakthrough activation that enabled training of deep networks (Nair and Hinton, 2010; Glorot et al., 2011). Its advantages: (1) no saturation for positive inputs -- the gradient is exactly 1; (2) computational simplicity -- just a threshold; (3) **sparse activation** -- roughly half the neurons output zero, which can be computationally efficient and may provide a form of implicit regularization.

The **dying ReLU problem** occurs when a neuron's pre-activation is always negative, making its gradient permanently zero. Once dead, the neuron never recovers. This can happen with large learning rates or poor initialization.

### Leaky ReLU

$$\text{LeakyReLU}(z) = \begin{cases} z & z > 0 \\ \alpha z & z \leq 0 \end{cases}$$

where $\alpha$ is a small constant (typically 0.01). This ensures a nonzero gradient everywhere, preventing dying neurons. Parametric ReLU (PReLU) makes $\alpha$ a learnable parameter.

### ELU (Exponential Linear Unit)

$$\text{ELU}(z) = \begin{cases} z & z > 0 \\ \alpha(e^z - 1) & z \leq 0 \end{cases}$$

ELU has negative outputs that push mean activations toward zero, combining benefits of ReLU (no saturation for $z > 0$) with zero-centered behavior. The exponential for $z < 0$ makes it smoother than Leaky ReLU but more expensive to compute.

### GELU (Gaussian Error Linear Unit)

$$\text{GELU}(z) = z \cdot \Phi(z) \approx 0.5z\left(1 + \tanh\left[\sqrt{2/\pi}(z + 0.044715z^3)\right]\right)$$

where $\Phi(z)$ is the standard Gaussian CDF. GELU applies a **stochastic** gating: inputs are weighted by the probability that they are "positive" under a Gaussian distribution. It is the default activation in BERT, GPT, and most modern transformers. GELU is smooth, non-monotonic near zero, and empirically outperforms ReLU in language and vision transformers.

### SiLU / Swish

$$\text{SiLU}(z) = z \cdot \sigma(z)$$

Swish (Ramachandran et al., 2017) was discovered via automated search over activation functions. It is smooth, non-monotonic, and closely related to GELU. It is the default activation in EfficientNet and many modern vision architectures.

### Softmax (Output Layer)

$$\text{softmax}(\mathbf{z})_i = \frac{e^{z_i}}{\sum_j e^{z_j}}$$

Softmax converts a vector of logits into a probability distribution over classes. It is used exclusively in the output layer for multi-class classification, paired with cross-entropy loss. Numerically, the log-softmax formulation is preferred for stability.

## Why It Matters

The activation function is arguably the most consequential single design choice in a neural network layer. Sigmoid and tanh dominated early networks but made deep training difficult due to vanishing gradients. ReLU enabled the deep learning revolution of the 2010s. GELU and SiLU now dominate transformer-based architectures. Choosing the wrong activation can make training fail entirely or converge orders of magnitude slower.

## Key Technical Details

- **Gradient magnitude**: Sigmoid max derivative is 0.25; tanh is 1.0; ReLU is exactly 1.0 (for $z > 0$).
- **Computational cost**: ReLU is cheapest (one comparison). GELU and SiLU require exponentiation or tanh.
- **Sparse activation**: ReLU naturally zeros out ~50% of activations; this sparsity is absent in smooth activations.
- **Output layer conventions**: Sigmoid for binary classification, softmax for multi-class, linear (no activation) for regression.
- **Activation choice affects initialization**: He initialization is derived assuming ReLU; Xavier assumes linear/tanh-like activations.

## Common Misconceptions

- **"ReLU is always the best choice."** For transformers, GELU consistently outperforms ReLU. For very deep convolutional networks, careful choices like SiLU or ELU can help. The best activation depends on architecture and task.
- **"Smooth activations are better because they are differentiable everywhere."** ReLU is not differentiable at zero, yet it works excellently. The subgradient at zero (typically set to 0) causes no practical issues. Smoothness helps in theory but is not a decisive practical advantage.
- **"Activation functions add nonlinearity, so any nonlinear function works."** The function must have useful gradient properties. For example, a step function is nonlinear but has zero gradient almost everywhere, making gradient-based learning impossible.

## Connections to Other Concepts

- **Backpropagation**: The activation derivative $f'(z)$ appears directly in the backward pass and determines gradient flow.
- **Weight Initialization**: He initialization is specifically derived for ReLU; using it with sigmoid leads to poor results, and vice versa.
- **Batch Normalization**: Normalizing pre-activations before applying the activation function keeps inputs in the non-saturating regime.
- **Perceptrons and Multilayer Networks**: Activation functions are what distinguish a multilayer network from a single linear transformation.
- **Universal Approximation Theorem**: The theorem requires non-constant, bounded, or non-polynomial activation functions.

## Further Reading

- Nair and Hinton, "Rectified Linear Units Improve Restricted Boltzmann Machines" (2010) -- Introduction of ReLU to deep learning.
- Hendrycks and Gimpel, "Gaussian Error Linear Units (GELUs)" (2016) -- The activation behind modern transformers.
- Ramachandran et al., "Searching for Activation Functions" (2017) -- Automated discovery of Swish/SiLU.
- Clevert et al., "Fast and Accurate Deep Network Learning by Exponential Linear Units (ELUs)" (2015) -- The ELU paper with variance analysis.
