# Derivatives and Gradients

**One-Line Summary**: The mathematical machinery for measuring how outputs change with inputs -- the foundation of all learning algorithms.

**Prerequisites**: Vectors and Matrices, single-variable calculus (limits, derivatives).

## What Are Derivatives and Gradients?

Imagine you are standing on a hilly landscape and you want to walk downhill as efficiently as possible. At any point you can feel the steepness of the slope in every direction. The **gradient** is the vector that points in the direction of the steepest uphill climb, and its magnitude tells you how steep that climb is. Walk in the opposite direction and you descend most rapidly. This is, in essence, what every gradient-based learning algorithm does: it evaluates the gradient of a loss function with respect to model parameters and steps in the negative gradient direction.

Formally, the **derivative** of a scalar function $f: \mathbb{R} \to \mathbb{R}$ at a point $x$ is:

$$f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

When $f$ depends on multiple variables, we generalize to **partial derivatives** and collect them into a **gradient vector**.

## How It Works

### Partial Derivatives

For $f: \mathbb{R}^n \to \mathbb{R}$, the partial derivative with respect to $x_i$ measures how $f$ changes when only $x_i$ varies:

$$\frac{\partial f}{\partial x_i} = \lim_{h \to 0} \frac{f(x_1, \ldots, x_i + h, \ldots, x_n) - f(x_1, \ldots, x_n)}{h}$$

### The Gradient Vector

The gradient collects all partial derivatives into a single vector:

$$\nabla f(\mathbf{x}) = \left(\frac{\partial f}{\partial x_1}, \frac{\partial f}{\partial x_2}, \ldots, \frac{\partial f}{\partial x_n}\right)^T$$

Two critical properties: (1) $\nabla f$ points in the direction of **steepest ascent**, and (2) $\nabla f$ is **orthogonal to level sets** of $f$ (the contours where $f$ is constant).

### Directional Derivatives

The rate of change of $f$ in an arbitrary direction $\mathbf{u}$ (unit vector) is:

$$D_{\mathbf{u}} f(\mathbf{x}) = \nabla f(\mathbf{x}) \cdot \mathbf{u} = \|\nabla f\| \cos\theta$$

This is maximized when $\mathbf{u}$ is parallel to $\nabla f$ (confirming the steepest ascent interpretation) and zero when $\mathbf{u}$ is perpendicular to it.

### The Chain Rule

The chain rule is the single most important calculus result for ML. If $y = f(g(x))$, then:

$$\frac{dy}{dx} = \frac{dy}{dg} \cdot \frac{dg}{dx}$$

In the multivariate case, if $\mathbf{y} = f(\mathbf{g}(\mathbf{x}))$ where $f: \mathbb{R}^m \to \mathbb{R}^p$ and $\mathbf{g}: \mathbb{R}^n \to \mathbb{R}^m$:

$$\frac{\partial \mathbf{y}}{\partial \mathbf{x}} = \frac{\partial \mathbf{y}}{\partial \mathbf{g}} \cdot \frac{\partial \mathbf{g}}{\partial \mathbf{x}}$$

This is a product of Jacobian matrices. **Backpropagation** in neural networks is precisely the repeated application of this multivariate chain rule, propagating derivatives from the loss backward through each layer.

### The Jacobian Matrix

For a vector-valued function $\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m$, the **Jacobian** $J \in \mathbb{R}^{m \times n}$ collects all first-order partial derivatives:

$$J_{ij} = \frac{\partial f_i}{\partial x_j}$$

The Jacobian generalizes the gradient to functions with vector outputs. In a neural network, the Jacobian of a layer's output with respect to its input determines how errors propagate.

### The Hessian Matrix

For $f: \mathbb{R}^n \to \mathbb{R}$, the **Hessian** $H \in \mathbb{R}^{n \times n}$ contains all second-order partial derivatives:

$$H_{ij} = \frac{\partial^2 f}{\partial x_i \partial x_j}$$

The Hessian encodes the **curvature** of $f$. If $H$ is positive definite at a critical point, that point is a local minimum. If it has mixed signs, the point is a saddle point. Newton's method uses the Hessian to take curvature-informed steps: $\mathbf{x}_{t+1} = \mathbf{x}_t - H^{-1}\nabla f$.

### Automatic Differentiation

Computing derivatives in practice uses one of three approaches:

- **Symbolic differentiation**: Applies calculus rules to produce an exact derivative expression. Can lead to expression swell for complex functions.
- **Numerical differentiation**: Approximates via finite differences $\frac{f(x+h) - f(x)}{h}$. Simple but suffers from floating-point errors and scales poorly with dimension.
- **Automatic differentiation (AD)**: Decomposes the function into elementary operations and applies the chain rule mechanically. Forward mode computes one directional derivative per pass; reverse mode (backpropagation) computes the full gradient in one pass regardless of the number of parameters.

Modern ML frameworks (PyTorch, JAX, TensorFlow) all implement reverse-mode AD, enabling gradients of loss functions with millions of parameters to be computed with roughly the same cost as a single forward evaluation.

## Why It Matters

Every parameter update in supervised, unsupervised, and reinforcement learning relies on gradient computation. Without efficient, accurate gradient calculation, training deep networks with billions of parameters would be impossible. The gradient tells the optimizer *which direction to move* and *how far* -- it is the feedback signal that enables learning.

## Key Technical Details

- The gradient $\nabla f$ lives in the same space as $\mathbf{x}$ (parameter space), not in the output space.
- For $f: \mathbb{R}^n \to \mathbb{R}$, reverse-mode AD computes the full gradient in $O(1)$ backward passes (relative to the forward pass cost). Forward-mode requires $O(n)$ passes.
- The Hessian has $O(n^2)$ entries, making it impractical to store for large models. Approximations include diagonal Hessians, Hessian-vector products, and the Fisher information matrix.
- **Clairaut's theorem**: If second partials are continuous, $\frac{\partial^2 f}{\partial x_i \partial x_j} = \frac{\partial^2 f}{\partial x_j \partial x_i}$, so the Hessian is symmetric.
- **Vanishing and exploding gradients**: In deep networks, repeated chain rule applications can cause gradients to shrink toward zero or grow unboundedly. Architectural choices (residual connections, layer normalization) and careful initialization mitigate this.

## Common Misconceptions

- **"The gradient IS the derivative."** The gradient is the derivative of a scalar function with respect to a vector. For vector-valued functions, the appropriate generalization is the Jacobian, not the gradient.
- **"Zero gradient means global minimum."** A zero gradient ($\nabla f = 0$) is a necessary condition for any critical point: local minimum, local maximum, or saddle point. The Hessian is needed to distinguish among these.
- **"Automatic differentiation is just numerical differentiation."** AD computes exact derivatives (up to floating-point precision) using the chain rule, not finite differences. It is fundamentally different in both accuracy and computational cost.

## Connections to Other Concepts

- **Optimization and Gradient Descent**: Gradients provide the update direction; the Hessian informs second-order methods and learning rate selection.
- **Vectors and Matrices**: Gradients are vectors; Jacobians and Hessians are matrices. Matrix calculus is the language of multivariable derivatives.
- **Maximum Likelihood Estimation**: MLE requires differentiating the log-likelihood with respect to parameters and setting the gradient to zero.
- **Information Theory**: The gradient of cross-entropy loss is directly related to the KL divergence between predicted and true distributions.

## Further Reading

- Rudin, *Principles of Mathematical Analysis* (1976) -- Rigorous treatment of limits, derivatives, and the multivariate chain rule.
- Griewank & Walther, *Evaluating Derivatives* (2008) -- The definitive reference on automatic differentiation.
- Baydin et al., "Automatic Differentiation in Machine Learning: a Survey" (2018) -- Accessible overview of AD modes and their use in ML frameworks.
