# Weight Initialization

**One-Line Summary**: Xavier, He, and orthogonal initialization -- breaking symmetry and controlling signal magnitude at the start of training.

**Prerequisites**: Variance and expected value, perceptrons and multilayer networks, activation functions, backpropagation.

## What Is Weight Initialization?

Imagine tuning a chain of amplifiers connected in series. If each amplifier boosts the signal even slightly too much, the output at the end is deafening static. If each attenuates slightly too much, the output is silence. Weight initialization is the art of setting the initial gain of every "amplifier" (layer) in a neural network so that signals flow through the network at a stable magnitude during both the forward and backward passes.

Formally, weight initialization is the procedure for setting the initial values of weight matrices $\mathbf{W}^{(l)}$ and biases $\mathbf{b}^{(l)}$ before training begins. The choice of initialization determines whether activations and gradients maintain reasonable magnitudes through deep networks, which directly affects whether training converges at all and how quickly.

## How It Works

### Why Not Initialize to Zero?

If all weights are zero (or any identical value), every neuron in a layer computes the same function of the input. During backpropagation, all neurons receive identical gradients and update identically. This **symmetry** is never broken, so the network effectively has one neuron per layer regardless of width. Random initialization breaks this symmetry, allowing different neurons to specialize.

Biases are typically initialized to zero because symmetry breaking only requires the weights to differ. An exception: biases in LSTM forget gates are often initialized to 1 to encourage remembering at the start of training.

### Variance Analysis Through Layers

Consider a fully connected layer $z_j = \sum_{i=1}^{n_{in}} w_{ij} x_i$ where weights $w_{ij}$ and inputs $x_i$ are independent with zero mean. The variance of the output is:

$$\text{Var}(z_j) = n_{in} \cdot \text{Var}(w) \cdot \text{Var}(x)$$

To keep $\text{Var}(z_j) = \text{Var}(x_i)$ (signal preservation), we need $\text{Var}(w) = 1/n_{in}$. After $L$ layers, if each layer multiplies the variance by a factor $c$, the signal scales as $c^L$ -- exponential growth or decay unless $c = 1$.

### Xavier / Glorot Initialization

Glorot and Bengio (2010) analyzed both the forward and backward passes. Preserving variance in the forward pass requires $\text{Var}(w) = 1/n_{in}$; preserving it in the backward pass requires $\text{Var}(w) = 1/n_{out}$. The Xavier compromise averages both:

$$\text{Var}(w) = \frac{2}{n_{in} + n_{out}}$$

In practice, this is implemented as either:
- **Uniform**: $w \sim U\left[-\sqrt{\frac{6}{n_{in}+n_{out}}},\; \sqrt{\frac{6}{n_{in}+n_{out}}}\right]$
- **Normal**: $w \sim \mathcal{N}\left(0,\; \frac{2}{n_{in}+n_{out}}\right)$

Xavier initialization assumes the activation function is approximately linear near zero (valid for tanh and sigmoid in their linear regime). It does not account for ReLU, which zeroes out half of its inputs.

### He Initialization

He et al. (2015) extended the variance analysis to ReLU activations. Since ReLU sets negative pre-activations to zero, the effective fan-in is halved. The corrected initialization is:

$$\text{Var}(w) = \frac{2}{n_{in}}$$

- **Normal**: $w \sim \mathcal{N}\left(0,\; \frac{2}{n_{in}}\right)$
- **Uniform**: $w \sim U\left[-\sqrt{\frac{6}{n_{in}}},\; \sqrt{\frac{6}{n_{in}}}\right]$

He initialization is the default for networks using ReLU and its variants. Using Xavier initialization with ReLU causes activations to shrink exponentially through layers; using He initialization with tanh causes them to grow.

### Orthogonal Initialization

Orthogonal initialization sets $\mathbf{W}$ to a random orthogonal matrix (or a submatrix of one if the layer is not square). An orthogonal matrix preserves norms exactly: $\|\mathbf{W}\mathbf{x}\|_2 = \|\mathbf{x}\|_2$. This prevents both vanishing and exploding signals in linear networks and provides strong signal preservation in the early stages of training nonlinear networks.

The procedure is: (1) sample a matrix from a Gaussian distribution; (2) compute its QR or SVD decomposition; (3) use the orthogonal factor as $\mathbf{W}$, optionally scaled by a gain factor appropriate for the activation function.

### LSUV (Layer-Sequential Unit-Variance)

LSUV (Mishkin and Matas, 2015) is a data-driven initialization that works for any architecture:

1. Initialize all layers with orthogonal matrices.
2. For each layer sequentially, forward a mini-batch of data through the network.
3. Rescale the layer's weights so that the output variance equals 1.

This procedure adapts to the actual data distribution rather than relying on theoretical assumptions about activations.

## Why It Matters

Proper initialization can mean the difference between a network that trains in hours and one that never converges. Before the development of principled initialization schemes, training deep networks (more than 5-10 layers) was essentially impossible without unsupervised pre-training. Xavier and He initialization, combined with normalization techniques, were key enablers of the deep learning revolution.

Initialization remains critical even in modern architectures. The scaling factors in transformer attention mechanisms (dividing by $\sqrt{d_k}$) serve a similar purpose: controlling signal magnitude to prevent softmax saturation.

## Key Technical Details

- Xavier: $\text{Var}(w) = \frac{2}{n_{in} + n_{out}}$. Best for sigmoid, tanh, or linear activations.
- He: $\text{Var}(w) = \frac{2}{n_{in}}$. Best for ReLU and variants.
- Orthogonal: Preserves $\ell_2$ norms exactly. Effective for RNNs and very deep networks.
- Biases: Almost always initialized to zero. Exception: LSTM forget gate biases initialized to 1.
- The $\sqrt{d_k}$ scaling in transformer attention is an initialization-like variance control technique.
- For residual networks, some schemes scale initialization by $1/\sqrt{N}$ where $N$ is the number of residual blocks, to prevent the signal from growing with depth.

## Common Misconceptions

- **"Initialization only matters for the first few steps."** Poor initialization can create loss landscape regions from which the optimizer never escapes. Neurons that start dead (in ReLU networks) may never activate. The initial condition shapes the entire training trajectory.
- **"Xavier and He initialization are the same thing with different scaling."** They are derived from different assumptions. Xavier assumes a linear activation regime; He accounts for the ReLU non-linearity that zeroes half the inputs. Using the wrong one for your activation function defeats the purpose.
- **"Larger random weights are better because they break symmetry more."** Overly large weights cause activations to saturate (for sigmoid/tanh) or explode, leading to numerical instability and divergence.

## Connections to Other Concepts

- `activation-functions.md`: The initialization scheme must match the activation function -- He for ReLU, Xavier for tanh/sigmoid.
- `backpropagation.md`: Initialization controls the magnitude of gradients flowing backward, directly affecting trainability.
- `batch-normalization.md`: BatchNorm reduces sensitivity to initialization by normalizing activations at each layer, but proper initialization still helps convergence speed.
- `perceptrons-and-multilayer-networks.md`: Initialization is what enables training of networks with many stacked layers.
- `optimizers.md`: Adaptive optimizers like Adam are more robust to initialization than vanilla SGD, but still benefit from principled initialization.

## Further Reading

- Glorot and Bengio, "Understanding the Difficulty of Training Deep Feedforward Neural Networks" (2010) -- The Xavier initialization paper.
- He et al., "Delving Deep into Rectifiers" (2015) -- He initialization derived for ReLU networks.
- Saxe et al., "Exact Solutions to the Nonlinear Dynamics of Learning in Deep Linear Networks" (2013) -- Theoretical analysis motivating orthogonal initialization.
- Mishkin and Matas, "All You Need Is a Good Init" (2015) -- The LSUV initialization procedure.
