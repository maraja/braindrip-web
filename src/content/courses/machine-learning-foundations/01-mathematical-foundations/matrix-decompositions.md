# Matrix Decompositions

**One-Line Summary**: Eigendecomposition, SVD, and Cholesky -- factoring matrices to reveal structure, compress data, and solve systems efficiently.

**Prerequisites**: Vectors and Matrices, basic linear algebra (rank, inverse, transpose).

## What Are Matrix Decompositions?

Think of factoring the integer 60 into $2^2 \times 3 \times 5$. The factorization reveals structure -- which primes compose it and in what proportions. Matrix decompositions do the same for matrices: they break a matrix into a product of simpler, interpretable factors. These factors expose the principal directions of variation in data, enable dramatic compression, and transform hard computational problems into easy ones.

Formally, a matrix decomposition expresses $A$ as a product of structured matrices. The three workhorses for ML are eigendecomposition ($A = Q\Lambda Q^{-1}$), singular value decomposition ($A = U\Sigma V^T$), and Cholesky factorization ($A = LL^T$).

## How It Works

### Eigendecomposition

An **eigenvector** $\mathbf{v}$ of a square matrix $A$ satisfies:

$$A\mathbf{v} = \lambda \mathbf{v}$$

where $\lambda$ is the corresponding **eigenvalue**. Geometrically, $A$ stretches $\mathbf{v}$ by a factor of $\lambda$ without changing its direction. If $A$ is a covariance matrix, eigenvectors point along the axes of maximum variance and eigenvalues quantify the variance along each axis.

For a diagonalizable matrix with $n$ linearly independent eigenvectors:

$$A = Q\Lambda Q^{-1}$$

where $Q = [\mathbf{v}_1 | \cdots | \mathbf{v}_n]$ and $\Lambda = \text{diag}(\lambda_1, \ldots, \lambda_n)$. When $A$ is symmetric (real), $Q$ is orthogonal ($Q^{-1} = Q^T$), which simplifies computation and guarantees all eigenvalues are real.

### Singular Value Decomposition (SVD)

SVD generalizes eigendecomposition to **any** matrix $A \in \mathbb{R}^{m \times n}$, not just square ones:

$$A = U \Sigma V^T$$

where $U \in \mathbb{R}^{m \times m}$ (left singular vectors), $\Sigma \in \mathbb{R}^{m \times n}$ (diagonal matrix of singular values $\sigma_1 \geq \sigma_2 \geq \cdots \geq 0$), and $V \in \mathbb{R}^{n \times n}$ (right singular vectors).

**Geometric interpretation**: Any linear transformation can be decomposed into three steps: (1) rotate/reflect by $V^T$, (2) scale along coordinate axes by $\Sigma$, (3) rotate/reflect by $U$.

Key relationships:

- Singular values: $\sigma_i = \sqrt{\lambda_i(A^TA)}$
- $\text{rank}(A)$ = number of nonzero singular values
- $\|A\|_F = \sqrt{\sum_i \sigma_i^2}$ (Frobenius norm)

### Truncated SVD for Compression

The **Eckart-Young theorem** states that the best rank-$k$ approximation (in both Frobenius and spectral norm) is obtained by keeping only the top $k$ singular values:

$$A_k = U_k \Sigma_k V_k^T$$

where $U_k$ has $k$ columns, $\Sigma_k$ is $k \times k$, and $V_k$ has $k$ columns. The approximation error is:

$$\|A - A_k\|_F = \sqrt{\sum_{i=k+1}^{r} \sigma_i^2}$$

This is the mathematical foundation of **latent semantic analysis** in NLP, image compression, and recommendation systems (matrix factorization).

### Cholesky Decomposition

If $A$ is **symmetric positive definite** (all eigenvalues $> 0$), then it has a unique factorization:

$$A = LL^T$$

where $L$ is lower triangular with positive diagonal entries. Cholesky is roughly twice as fast as LU decomposition and numerically more stable. It is used to:

- Solve $A\mathbf{x} = \mathbf{b}$ via forward/backward substitution
- Sample from multivariate Gaussians: if $\mathbf{z} \sim \mathcal{N}(\mathbf{0}, I)$, then $L\mathbf{z} + \boldsymbol{\mu} \sim \mathcal{N}(\boldsymbol{\mu}, A)$
- Compute log-determinants efficiently: $\log\det(A) = 2\sum_i \log L_{ii}$

### Connection to PCA

**Principal Component Analysis** is eigendecomposition of the covariance matrix $C = \frac{1}{n-1}X^TX$ (for centered data $X$). Equivalently, PCA can be computed via SVD of $X$ itself. If $X = U\Sigma V^T$, then the principal components are the columns of $V$, and the variance explained by each component is $\sigma_i^2 / (n-1)$.

## Why It Matters

Matrix decompositions are the computational backbone of ML. PCA (via eigendecomposition or SVD) is the most widely used dimensionality reduction technique. SVD powers recommender systems and low-rank matrix completion. Cholesky enables efficient Gaussian process inference and sampling. Without these tools, many models would be computationally intractable.

## Key Technical Details

- **Eigendecomposition** applies only to square matrices; **SVD** applies to any matrix.
- Not all matrices are diagonalizable. Defective matrices require the Jordan normal form, but this rarely arises in ML where matrices of interest (covariance, kernel) are symmetric.
- Computing full SVD of $A \in \mathbb{R}^{m \times n}$ costs $O(\min(m^2 n, mn^2))$. Randomized SVD algorithms reduce this for the truncated case.
- The **condition number** $\kappa(A) = \sigma_{\max}/\sigma_{\min}$ measures sensitivity to perturbation. Ill-conditioned matrices ($\kappa \gg 1$) cause numerical instability.
- For positive semi-definite matrices (eigenvalues $\geq 0$, not strictly $> 0$), Cholesky can be applied with pivoting or a small diagonal shift (Tikhonov regularization: $A + \epsilon I$).
- **Eigenvalue decomposition of symmetric matrices** is guaranteed to yield real eigenvalues and orthogonal eigenvectors -- a fact that underpins PCA, spectral clustering, and Laplacian-based methods.

## Common Misconceptions

- **"SVD and eigendecomposition are the same thing."** Eigendecomposition requires a square matrix and may not exist. SVD exists for every matrix and decomposes it into orthogonal bases for both the domain and codomain.
- **"Keeping more singular values is always better."** Truncated SVD acts as a regularizer. Retaining noise-dominated components can hurt generalization -- this is the bias-variance tradeoff applied to representation.
- **"PCA always works."** PCA finds linear directions of maximum variance. If the data lies on a nonlinear manifold, PCA may miss its structure entirely. Kernel PCA or autoencoders may be more appropriate.

## Connections to Other Concepts

- **Vectors and Matrices**: Decompositions require fluency with rank, column space, and matrix operations.
- **Optimization and Gradient Descent**: The condition number from SVD determines how fast gradient descent converges. Preconditioning uses decompositions to accelerate optimization.
- **Probability Fundamentals**: The covariance matrix is the object being decomposed in PCA; its eigenvalues are variances along principal axes.
- **Norms and Distance Metrics**: The spectral norm $\|A\|_2 = \sigma_{\max}$ and Frobenius norm $\|A\|_F = \sqrt{\sum \sigma_i^2}$ are defined through singular values.
- **Statistical Inference**: Decompositions enable efficient computation of likelihoods involving multivariate Gaussians.

## Further Reading

- Strang, *Linear Algebra and Its Applications* (2006) -- Thorough treatment of eigendecomposition and SVD with geometric intuition.
- Trefethen & Bau, *Numerical Linear Algebra* (1997) -- The definitive reference on the numerical aspects and stability of matrix decompositions.
- Halko, Martinsson & Tropp, "Finding Structure with Randomness" (2011) -- Landmark paper on randomized algorithms for low-rank approximation.
