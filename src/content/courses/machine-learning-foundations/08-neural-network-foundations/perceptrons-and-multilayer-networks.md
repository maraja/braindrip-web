# Perceptrons and Multilayer Networks

**One-Line Summary**: From single linear classifiers to universal function approximators -- stacking layers creates representational power.

**Prerequisites**: Linear algebra (matrix multiplication), linear classifiers, gradient descent basics, loss functions.

## What Is a Perceptron?

Imagine a committee member who votes yes or no on a proposal. They weigh different factors (cost, timeline, quality), multiply each by how much they care about it, sum the weighted opinions, and decide: if the total exceeds some threshold, they vote yes. A single perceptron works exactly this way -- it is the simplest possible neural network.

Formally, the perceptron is a binary classifier proposed by Frank Rosenblatt in 1958. Given an input vector $\mathbf{x} \in \mathbb{R}^d$, the perceptron computes:

$$y = \sigma\left(\sum_{i=1}^{d} w_i x_i + b\right) = \sigma(\mathbf{w}^\top \mathbf{x} + b)$$

where $\mathbf{w}$ is a weight vector, $b$ is a bias term, and $\sigma$ is a step function that outputs 1 if the argument is positive and 0 otherwise. The decision boundary is a hyperplane in $\mathbb{R}^d$.

## How It Works

### The Perceptron Learning Rule

The perceptron learning algorithm updates weights only when a misclassification occurs. For a training example $(\mathbf{x}, y^*)$ where $y^*$ is the true label and $\hat{y}$ is the prediction:

$$\mathbf{w} \leftarrow \mathbf{w} + \eta (y^* - \hat{y}) \mathbf{x}$$
$$b \leftarrow b + \eta (y^* - \hat{y})$$

where $\eta$ is the learning rate. The Perceptron Convergence Theorem guarantees that if the data is linearly separable, this algorithm will converge in a finite number of steps. The bound on the number of updates is $\left(\frac{R \|\mathbf{w}^*\|}{\gamma}\right)^2$, where $R$ is the radius of the data, $\mathbf{w}^*$ is the optimal weight vector, and $\gamma$ is the margin.

### The XOR Problem

The XOR function outputs 1 when exactly one of two binary inputs is 1. No single hyperplane can separate the positive from negative examples in this case. Minsky and Papert proved this formally in 1969, showing that a single perceptron cannot compute XOR. This result contributed to the first "AI winter," a period of reduced funding and interest in neural networks.

The XOR problem is not a curiosity -- it represents any situation where classes are not linearly separable. Real-world data is almost never linearly separable in its raw feature space.

### Multilayer Perceptrons (MLPs)

The solution to XOR -- and to the broader limitation of single perceptrons -- is to stack multiple layers. A multilayer perceptron consists of:

1. **Input layer**: Receives raw features $\mathbf{x} \in \mathbb{R}^{d_0}$.
2. **Hidden layers**: Each layer $l$ computes $\mathbf{h}^{(l)} = f(\mathbf{W}^{(l)} \mathbf{h}^{(l-1)} + \mathbf{b}^{(l)})$, where $f$ is a nonlinear activation function.
3. **Output layer**: Produces predictions (e.g., class probabilities via softmax).

For a network with $L$ layers, the forward pass computes:

$$\mathbf{h}^{(0)} = \mathbf{x}$$
$$\mathbf{z}^{(l)} = \mathbf{W}^{(l)} \mathbf{h}^{(l-1)} + \mathbf{b}^{(l)} \quad \text{(pre-activation)}$$
$$\mathbf{h}^{(l)} = f(\mathbf{z}^{(l)}) \quad \text{(post-activation)}$$
$$\hat{\mathbf{y}} = g(\mathbf{z}^{(L)}) \quad \text{(output transformation)}$$

Each layer in a standard MLP is **fully connected** (or "dense"): every neuron in layer $l$ connects to every neuron in layer $l+1$. A layer with $n_{in}$ inputs and $n_{out}$ outputs has $n_{in} \times n_{out}$ weight parameters plus $n_{out}$ bias parameters.

### Representational Power

Each hidden layer learns a new representation of the data. The first layer might learn simple features (edges, thresholds), the second layer combines those into more abstract features, and so on. A two-layer MLP can solve XOR by learning a representation where the classes become linearly separable.

The key insight is that nonlinear activation functions are essential. Without them, composing linear transformations yields another linear transformation: $\mathbf{W}^{(2)}(\mathbf{W}^{(1)}\mathbf{x}) = (\mathbf{W}^{(2)}\mathbf{W}^{(1)})\mathbf{x}$. The entire deep network would collapse to a single linear layer.

## Why It Matters

MLPs are the backbone of modern deep learning. Convolutional networks, recurrent networks, and transformers all build upon the fundamental MLP idea of stacking differentiable layers. Understanding how simple perceptrons extend to multilayer networks provides the conceptual foundation for every architecture that followed.

In practice, MLPs remain widely used as components within larger systems -- the feed-forward sublayers in transformers are two-layer MLPs, and many tabular data problems are still best served by well-tuned MLPs.

## Key Technical Details

- A single perceptron computes a linear decision boundary (a hyperplane in $\mathbb{R}^d$).
- The perceptron learning rule converges in finite steps if and only if the data is linearly separable.
- MLPs with at least one hidden layer and nonlinear activations are universal function approximators (see the Universal Approximation Theorem concept).
- Parameter count for a fully connected layer: $n_{in} \times n_{out} + n_{out}$.
- Depth (number of layers) provides exponential efficiency gains over width for many function classes.
- The forward pass is a sequence of matrix multiplications interleaved with elementwise nonlinearities.

## Common Misconceptions

- **"A perceptron is the same as logistic regression."** A perceptron uses a step activation and the perceptron learning rule; logistic regression uses a sigmoid activation and maximizes likelihood. They share the linear decision boundary but differ in training and output semantics.
- **"More layers always help."** Without proper initialization, normalization, and regularization, deeper networks can be harder to train due to vanishing or exploding gradients. Depth helps only when paired with the right training infrastructure.
- **"The XOR problem means single-layer networks are useless."** Single-layer models work well when features are already well-engineered or when the problem is approximately linearly separable. The XOR problem highlights the need for learned representations, not the uselessness of linear models.

## Connections to Other Concepts

- **Backpropagation**: The algorithm that makes training MLPs feasible by efficiently computing gradients through all layers.
- **Activation Functions**: The nonlinearities between layers that give MLPs their representational power.
- **Weight Initialization**: Proper initialization is critical for training deep MLPs; naive initialization causes signal to vanish or explode.
- **Universal Approximation Theorem**: Formalizes the theoretical power of MLPs with sufficient width or depth.
- **Batch Normalization**: A technique that stabilizes training of deep MLPs by normalizing intermediate activations.

## Further Reading

- Rosenblatt, "The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain" (1958) -- The original perceptron paper.
- Minsky and Papert, *Perceptrons* (1969) -- The formal analysis of perceptron limitations that shaped the field.
- Rumelhart, Hinton, and Williams, "Learning Representations by Back-Propagating Errors" (1986) -- Demonstrated that multilayer networks could be trained effectively.
- Goodfellow, Bengio, and Courville, *Deep Learning* (2016), Chapter 6 -- Modern treatment of feedforward networks.
