# Backpropagation

**One-Line Summary**: Computing gradients layer by layer via the chain rule -- the algorithm that makes deep learning computationally feasible.

**Prerequisites**: Chain rule (single and multivariate calculus), computational graphs, matrix calculus basics, perceptrons and multilayer networks.

## What Is Backpropagation?

Imagine you are managing a long assembly line where each station modifies a product. A defect appears at the end. To fix it, you trace backward through each station, asking: "How much did your adjustment contribute to the final defect?" Backpropagation does exactly this for neural networks -- it propagates error information backward through the layers to determine how each weight contributed to the loss.

Technically, backpropagation is an efficient algorithm for computing the gradient of a scalar loss function $L$ with respect to every parameter in a neural network. It applies the chain rule of calculus systematically on a computational graph, reusing intermediate results to avoid redundant computation. Without backpropagation, computing gradients for a network with $N$ parameters would require $O(N)$ separate forward passes; backpropagation does it in one forward pass plus one backward pass.

## How It Works

### The Chain Rule for Compositions

For a composite function $L = L(f(g(\mathbf{x})))$, the chain rule gives:

$$\frac{\partial L}{\partial \mathbf{x}} = \frac{\partial L}{\partial f} \cdot \frac{\partial f}{\partial g} \cdot \frac{\partial g}{\partial \mathbf{x}}$$

In a neural network with $L$ layers, the loss depends on the parameters through a chain of compositions. Backpropagation evaluates this chain from right to left (output to input), accumulating products of local Jacobians.

### Forward Pass

Given input $\mathbf{x}$, the forward pass computes and caches all intermediate quantities:

$$\mathbf{z}^{(l)} = \mathbf{W}^{(l)} \mathbf{h}^{(l-1)} + \mathbf{b}^{(l)}, \quad \mathbf{h}^{(l)} = f(\mathbf{z}^{(l)})$$

for $l = 1, \ldots, L$, followed by the loss $\mathcal{L} = \text{Loss}(\mathbf{h}^{(L)}, \mathbf{y})$.

### Backward Pass

Starting from $\frac{\partial \mathcal{L}}{\partial \mathbf{h}^{(L)}}$, we propagate gradients backward. At each layer $l$:

$$\frac{\partial \mathcal{L}}{\partial \mathbf{z}^{(l)}} = \frac{\partial \mathcal{L}}{\partial \mathbf{h}^{(l)}} \odot f'(\mathbf{z}^{(l)})$$

$$\frac{\partial \mathcal{L}}{\partial \mathbf{W}^{(l)}} = \frac{\partial \mathcal{L}}{\partial \mathbf{z}^{(l)}} \left(\mathbf{h}^{(l-1)}\right)^\top$$

$$\frac{\partial \mathcal{L}}{\partial \mathbf{b}^{(l)}} = \frac{\partial \mathcal{L}}{\partial \mathbf{z}^{(l)}}$$

$$\frac{\partial \mathcal{L}}{\partial \mathbf{h}^{(l-1)}} = \left(\mathbf{W}^{(l)}\right)^\top \frac{\partial \mathcal{L}}{\partial \mathbf{z}^{(l)}}$$

The symbol $\odot$ denotes elementwise multiplication. The gradient with respect to $\mathbf{h}^{(l-1)}$ is then passed to layer $l-1$, continuing the recursion.

### Worked Example: Two-Layer Network

Consider a network with one hidden layer, ReLU activation, and mean squared error loss. Input $x \in \mathbb{R}$, hidden unit $h = \max(0, w_1 x + b_1)$, output $\hat{y} = w_2 h + b_2$, loss $\mathcal{L} = \frac{1}{2}(\hat{y} - y)^2$.

**Forward pass**: Compute $z_1 = w_1 x + b_1$, $h = \max(0, z_1)$, $\hat{y} = w_2 h + b_2$, $\mathcal{L} = \frac{1}{2}(\hat{y} - y)^2$.

**Backward pass**:
1. $\frac{\partial \mathcal{L}}{\partial \hat{y}} = \hat{y} - y$
2. $\frac{\partial \mathcal{L}}{\partial w_2} = (\hat{y} - y) \cdot h$, $\quad \frac{\partial \mathcal{L}}{\partial b_2} = \hat{y} - y$
3. $\frac{\partial \mathcal{L}}{\partial h} = (\hat{y} - y) \cdot w_2$
4. $\frac{\partial \mathcal{L}}{\partial z_1} = \frac{\partial \mathcal{L}}{\partial h} \cdot \mathbb{1}[z_1 > 0]$
5. $\frac{\partial \mathcal{L}}{\partial w_1} = \frac{\partial \mathcal{L}}{\partial z_1} \cdot x$, $\quad \frac{\partial \mathcal{L}}{\partial b_1} = \frac{\partial \mathcal{L}}{\partial z_1}$

### Computational Graphs and Automatic Differentiation

Modern frameworks (PyTorch, JAX, TensorFlow) implement backpropagation through **automatic differentiation** (autodiff). Each operation records itself on a computational graph during the forward pass. The backward pass traverses this graph in reverse topological order.

There are two modes of autodiff:
- **Forward mode**: Computes $\frac{\partial \text{output}}{\partial x_i}$ for one input $x_i$ at a time. Efficient when there are few inputs and many outputs.
- **Reverse mode**: Computes $\frac{\partial L}{\partial x_i}$ for all inputs simultaneously given one scalar output $L$. This is backpropagation. Efficient when there is one scalar loss and many parameters -- exactly the neural network setting.

The computational cost of reverse-mode autodiff is roughly 2-3 times the cost of the forward pass, regardless of the number of parameters.

### Vanishing and Exploding Gradients

When gradients propagate through many layers, they are repeatedly multiplied by weight matrices and activation derivatives. If these factors are consistently less than 1, gradients **vanish** (shrink exponentially). If consistently greater than 1, they **explode** (grow exponentially).

For a network with $L$ layers and identical weights $\mathbf{W}$, the gradient at layer 1 involves a term proportional to $\prod_{l=1}^{L} \text{diag}(f'(\mathbf{z}^{(l)})) \mathbf{W}$. If the largest singular value of each factor is $\sigma$, the gradient scales as $\sigma^L$ -- exponential in depth.

Solutions include careful weight initialization (He or Xavier), normalization techniques (BatchNorm, LayerNorm), residual connections, and gradient clipping.

## Why It Matters

Backpropagation is the engine of deep learning. Without it, training networks with millions or billions of parameters would be computationally intractable. The 1986 paper by Rumelhart, Hinton, and Williams demonstrating backpropagation's effectiveness on multilayer networks reignited interest in neural networks after the post-perceptron AI winter.

Every modern deep learning framework is built around efficient implementations of reverse-mode automatic differentiation, making backpropagation the single most important algorithm in the field.

## Key Technical Details

- Time complexity: one backward pass costs roughly 2x the forward pass in FLOPs.
- Memory complexity: all intermediate activations must be stored for the backward pass, which is the primary memory bottleneck in training.
- Gradient checkpointing trades compute for memory by recomputing activations during the backward pass instead of storing them.
- Backpropagation computes exact gradients (up to floating-point precision), unlike finite differences which are approximate and $O(N)$ times more expensive.
- For a mini-batch of size $B$, gradients are averaged across examples: $\nabla_\theta \mathcal{L} = \frac{1}{B} \sum_{i=1}^{B} \nabla_\theta \mathcal{L}_i$.

## Common Misconceptions

- **"Backpropagation is a learning algorithm."** Backpropagation only computes gradients. It must be paired with an optimization algorithm (SGD, Adam, etc.) that uses those gradients to update weights.
- **"Backpropagation was invented in 1986."** The chain rule and its application to networks were known earlier (Linnainmaa 1970, Werbos 1974). Rumelhart, Hinton, and Williams popularized it and demonstrated its practical effectiveness.
- **"Vanishing gradients mean the network learns nothing."** Vanishing gradients primarily affect early layers. Later layers may still train, but the network fails to learn useful low-level features, leading to poor overall performance.

## Connections to Other Concepts

- `perceptrons-and-multilayer-networks.md`: Backpropagation is the algorithm that makes training multilayer networks practical.
- `activation-functions.md`: The derivative $f'(\mathbf{z})$ appears directly in the backward pass; activation choice critically affects gradient flow.
- `weight-initialization.md`: Proper initialization prevents gradients from vanishing or exploding at the start of training.
- `optimizers.md`: Consume the gradients computed by backpropagation to update network parameters.
- `batch-normalization.md`: Designed partly to improve gradient flow through deep networks.

## Further Reading

- Rumelhart, Hinton, and Williams, "Learning Representations by Back-Propagating Errors" (1986) -- The landmark paper that popularized backpropagation.
- Griewank and Walther, *Evaluating Derivatives* (2008) -- The definitive reference on automatic differentiation.
- Baydin et al., "Automatic Differentiation in Machine Learning: A Survey" (2018) -- Comprehensive modern survey of autodiff techniques.
- Goodfellow, Bengio, and Courville, *Deep Learning* (2016), Chapter 6.5 -- Clear textbook treatment of backpropagation.
