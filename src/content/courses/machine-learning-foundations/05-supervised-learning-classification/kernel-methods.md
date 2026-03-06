# Kernel Methods

**One-Line Summary**: The kernel trick maps data to higher dimensions without explicit computation -- making linear methods handle nonlinear boundaries.

**Prerequisites**: Linear algebra, inner products, support vector machines (dual formulation), feature spaces.

## What Is a Kernel Method?

Imagine trying to separate red and blue coins on a table with a straight line -- impossible if they are arranged in concentric circles. But if you could lift the coins into three dimensions, placing red coins high and blue coins low, a flat plane could separate them easily. Kernel methods accomplish exactly this: they implicitly map data into a higher-dimensional space where a linear separator exists, without ever computing the coordinates in that space.

Formally, a **feature mapping** $\phi: \mathbb{R}^d \to \mathcal{H}$ takes input data into a (potentially infinite-dimensional) feature space $\mathcal{H}$. A **kernel function** computes the inner product in that space directly:

$$K(x, x') = \langle \phi(x), \phi(x') \rangle_{\mathcal{H}}$$

The **kernel trick** is the observation that many algorithms (SVMs, ridge regression, PCA) depend on the data only through inner products $x_i^T x_j$. By replacing these with $K(x_i, x_j)$, we implicitly operate in the feature space without ever computing $\phi(x)$ explicitly.

## How It Works

### Feature Mapping Example

Consider input $x = (x_1, x_2) \in \mathbb{R}^2$ and the polynomial mapping:

$$\phi(x) = (x_1^2, \sqrt{2}\, x_1 x_2, x_2^2)$$

The inner product in feature space is:

$$\phi(x)^T \phi(x') = x_1^2 x_1'^2 + 2 x_1 x_2 x_1' x_2' + x_2^2 x_2'^2 = (x^T x')^2$$

So $K(x, x') = (x^T x')^2$ computes the inner product in the 3D feature space using only operations in the original 2D space. For degree-$p$ polynomials in $d$ dimensions, the feature space has $\binom{d+p}{p}$ dimensions, but the kernel evaluation costs only $O(d)$.

### Common Kernel Functions

**Linear Kernel**:
$$K(x, x') = x^T x'$$
No mapping at all -- this recovers the standard linear model. Useful as a baseline and when the data is already high-dimensional (e.g., text with TF-IDF).

**Polynomial Kernel**:
$$K(x, x') = (x^T x' + c)^p$$
Maps to a feature space of all monomials up to degree $p$. The parameter $c \geq 0$ controls the influence of lower-order terms. Setting $c = 0$ gives only degree-$p$ terms; $c > 0$ includes all degrees up to $p$.

**RBF (Gaussian) Kernel**:
$$K(x, x') = \exp\left(-\frac{\|x - x'\|^2}{2\sigma^2}\right)$$
Often written with $\gamma = \frac{1}{2\sigma^2}$ as $K(x, x') = \exp(-\gamma \|x - x'\|^2)$. This is the most widely used kernel. It maps to an *infinite-dimensional* feature space. The bandwidth parameter $\sigma$ (or $\gamma$) controls the locality of the kernel: small $\sigma$ means each point influences only very close neighbors (risk of overfitting), large $\sigma$ means broad influence (risk of underfitting).

**Sigmoid Kernel**:
$$K(x, x') = \tanh(\alpha \, x^T x' + c)$$
Historically motivated by neural network connections, but it is not positive semi-definite for all parameter values, so it is not a valid Mercer kernel in general. Rarely used in modern practice.

### Mercer's Theorem

Not every function of two arguments is a valid kernel. **Mercer's theorem** states that $K(x, x')$ is a valid kernel if and only if the kernel matrix (Gram matrix) $\mathbf{K}_{ij} = K(x_i, x_j)$ is positive semi-definite for any set of input points. Equivalently, there exists a feature mapping $\phi$ such that $K(x, x') = \langle \phi(x), \phi(x') \rangle$. This condition guarantees that the optimization problems (e.g., SVM dual) remain convex.

Key properties of valid kernels:
- The sum of two kernels is a kernel.
- The product of two kernels is a kernel.
- A positive scalar times a kernel is a kernel.
- These closure properties allow constructing complex kernels from simple building blocks.

### Kernel SVM

The SVM dual formulation depends on data only through inner products:

$$\max_\alpha \sum_{i=1}^n \alpha_i - \frac{1}{2}\sum_{i,j} \alpha_i \alpha_j y_i y_j K(x_i, x_j)$$

Replacing $x_i^T x_j$ with $K(x_i, x_j)$ is all that is needed to "kernelize" the SVM. The decision function becomes:

$$f(x) = \text{sign}\left(\sum_{i \in SV} \alpha_i y_i \, K(x_i, x) + b\right)$$

With the RBF kernel, the decision boundary can approximate any continuous boundary given enough support vectors. This makes kernel SVMs extremely powerful nonlinear classifiers.

### Kernel Ridge Regression

Ridge regression with a kernel replaces the linear solution $w = (X^T X + \lambda I)^{-1} X^T y$ with:

$$\alpha = (K + \lambda I)^{-1} y$$

where $K$ is the $n \times n$ kernel matrix. Predictions for a new point $x^*$ are:

$$\hat{y} = \sum_{i=1}^n \alpha_i K(x_i, x^*)$$

This is known as **kernel ridge regression** and generalizes linear ridge regression to arbitrary nonlinear feature spaces.

### Computational Cost

The central limitation of kernel methods is computational:
- **Kernel matrix**: Computing and storing the $n \times n$ Gram matrix requires $O(n^2)$ space and $O(n^2 d)$ time.
- **Training**: Solving kernel SVM or kernel ridge regression costs $O(n^3)$ (matrix inversion or QP solving).
- **Prediction**: Each prediction requires computing $K(x^*, x_i)$ for all support vectors, costing $O(n_{SV} \cdot d)$.

For large $n$, this is prohibitive. Approximation methods include:
- **Nystrom approximation**: Approximate $K$ using a low-rank matrix from a subset of columns.
- **Random Fourier features**: Approximate the RBF kernel via a random explicit feature mapping, reducing the problem to linear methods.

## Why It Matters

Kernel methods are one of the most elegant ideas in machine learning. They allow practitioners to apply powerful nonlinear transformations without the computational burden of explicitly computing high-dimensional features. The RBF kernel SVM was the state-of-the-art classifier for many problems from the late 1990s through the 2010s. Even in the deep learning era, kernel methods provide theoretical insights: neural tangent kernels (NTKs) show that infinitely wide neural networks behave like kernel methods, connecting the two frameworks.

## Key Technical Details

- **Kernel hyperparameters**: The RBF bandwidth $\gamma$ and the SVM regularization $C$ are typically tuned jointly via grid search with cross-validation.
- **Feature scaling**: Critical for RBF and polynomial kernels, since the kernel value depends on distances or inner products.
- **String and graph kernels**: Kernels can be defined on non-vectorial data (sequences, trees, graphs), extending SVM-style methods to structured data.
- **Representer theorem**: For any kernel method with a regularized loss, the optimal solution lies in the span of the kernel evaluations at the training points: $f(x) = \sum_{i=1}^n \alpha_i K(x_i, x)$.

## Common Misconceptions

- **"You need to choose the right feature mapping."** The whole point of the kernel trick is that you never need to define $\phi$ explicitly. You choose a kernel, and the feature mapping is implicit.
- **"The RBF kernel always works best."** The RBF kernel is a good default, but linear kernels are often superior for high-dimensional sparse data (text), and polynomial kernels can capture specific interaction structures.
- **"Kernel methods scale to any dataset."** The $O(n^2)$ to $O(n^3)$ cost makes pure kernel methods impractical for datasets beyond roughly $10^4$ to $10^5$ points without approximations.
- **"A higher-dimensional feature space always helps."** Mapping to a very high-dimensional space without sufficient regularization leads to overfitting. The kernel must be matched to the problem structure.

## Connections to Other Concepts

- **Support Vector Machines**: SVMs are the most prominent application of kernel methods. The dual formulation of SVMs is what makes kernelization natural.
- **K-Nearest Neighbors**: KNN with an RBF weighting resembles a kernel method. Both are instance-based, but kernel SVMs produce a sparse solution (support vectors only).
- **Logistic Regression**: Kernel logistic regression exists but is less common than kernel SVMs because the logistic regression dual is not as clean.
- **Decision Trees**: Trees are nonlinear without kernels but cannot leverage the geometric structure that kernels exploit. Ensemble methods (random forests) are the tree-based alternative to kernel SVMs.

## Further Reading

- Scholkopf, Smola, "Learning with Kernels" (2002) -- The definitive reference on kernel methods.
- Shawe-Taylor, Cristianini, "Kernel Methods for Pattern Analysis" (2004) -- Practical guide with applications to text, images, and sequences.
- Rahimi, Recht, "Random Features for Large-Scale Kernel Machines" (2007) -- Introduced random Fourier features for scalable kernel approximation.
- Hofmann, Scholkopf, Smola, "Kernel Methods in Machine Learning" (2008) -- Comprehensive survey in Annals of Statistics.
