# Vectors and Matrices

**One-Line Summary**: The fundamental data structures of ML -- representing data as points in high-dimensional space and transformations as matrices.

**Prerequisites**: Basic algebra, coordinate geometry.

## What Are Vectors and Matrices?

Imagine you are describing a house to a buyer. You might list its square footage, number of bedrooms, age, and price. Each of these numbers is a *feature*, and together they form a vector -- an ordered list of numbers that locates the house as a single point in a four-dimensional "feature space." Now imagine describing ten thousand houses: you stack their feature vectors into rows and get a matrix, a rectangular grid of numbers that encodes an entire dataset in one object.

Formally, a **vector** $\mathbf{x} \in \mathbb{R}^n$ is an element of an $n$-dimensional real vector space. A **matrix** $A \in \mathbb{R}^{m \times n}$ is a rectangular array with $m$ rows and $n$ columns. In ML the convention is almost universal: each row of a data matrix $X \in \mathbb{R}^{m \times n}$ is one sample and each column is one feature.

## How It Works

### Vector Spaces and Operations

A vector space over $\mathbb{R}$ is a set $V$ equipped with vector addition and scalar multiplication satisfying closure, associativity, commutativity, and the existence of additive identity and inverses. The canonical example is $\mathbb{R}^n$.

Key operations on vectors:

- **Addition**: $\mathbf{x} + \mathbf{y} = (x_1 + y_1, \ldots, x_n + y_n)$
- **Scalar multiplication**: $c\mathbf{x} = (cx_1, \ldots, cx_n)$
- **Dot product**: $\mathbf{x} \cdot \mathbf{y} = \sum_{i=1}^{n} x_i y_i = \|\mathbf{x}\| \|\mathbf{y}\| \cos\theta$

The dot product deserves special attention. It simultaneously measures (a) the projection of one vector onto another, and (b) how "aligned" two vectors are. When $\mathbf{x} \cdot \mathbf{y} = 0$ the vectors are orthogonal -- completely unrelated directions. This idea powers everything from cosine similarity in NLP to the normal equations in linear regression.

### Matrix Multiplication as Linear Transformation

Matrix multiplication is not just a computational recipe; it is the algebraic encoding of a **linear transformation**. If $A \in \mathbb{R}^{m \times n}$, then the map $\mathbf{x} \mapsto A\mathbf{x}$ sends vectors in $\mathbb{R}^n$ to vectors in $\mathbb{R}^m$. This single idea unifies:

- **Rotation and scaling** (geometric transformations)
- **Projection** (dimensionality reduction via PCA)
- **Neural network layers** (a dense layer computes $\mathbf{h} = \sigma(W\mathbf{x} + \mathbf{b})$)

The product $C = AB$ where $A \in \mathbb{R}^{m \times p}$ and $B \in \mathbb{R}^{p \times n}$ is defined element-wise as:

$$C_{ij} = \sum_{k=1}^{p} A_{ik} B_{kj}$$

This requires the inner dimensions to match and yields $C \in \mathbb{R}^{m \times n}$.

### Transpose and Symmetry

The transpose $A^T$ is obtained by swapping rows and columns: $(A^T)_{ij} = A_{ji}$. A matrix is **symmetric** if $A = A^T$. Covariance matrices, Hessians, and kernel matrices are all symmetric, which grants computational advantages such as guaranteed real eigenvalues.

### Inverse and Rank

A square matrix $A$ is **invertible** if there exists $A^{-1}$ such that $AA^{-1} = A^{-1}A = I$. The inverse exists if and only if $\det(A) \neq 0$, equivalently when $A$ has full rank.

The **rank** of a matrix is the dimension of its column space (equivalently, its row space). For $A \in \mathbb{R}^{m \times n}$:

$$\text{rank}(A) \leq \min(m, n)$$

When the rank is less than $\min(m, n)$, the matrix is **rank-deficient** -- some features are linearly dependent. This signals multicollinearity in regression and motivates regularization techniques.

### Column Space and Null Space

The **column space** $\text{Col}(A)$ is the span of $A$'s columns -- the set of all vectors $\mathbf{b}$ for which $A\mathbf{x} = \mathbf{b}$ has a solution. The **null space** $\text{Null}(A)$ is the set of all $\mathbf{x}$ satisfying $A\mathbf{x} = \mathbf{0}$. Together they satisfy the rank-nullity theorem:

$$\text{rank}(A) + \dim(\text{Null}(A)) = n$$

## Why It Matters

Nearly every ML algorithm begins by organizing data into a matrix. Linear regression solves $X\mathbf{w} = \mathbf{y}$. PCA finds eigenvectors of $X^TX$. Neural networks chain matrix multiplications with nonlinearities. Understanding how matrices encode transformations, when systems are solvable, and what rank reveals about data redundancy is prerequisite knowledge for almost everything that follows in ML.

## Key Technical Details

- Matrix multiplication is **not commutative**: $AB \neq BA$ in general.
- $(AB)^T = B^T A^T$ -- the transpose reverses the order of multiplication.
- The **Gram matrix** $X^TX \in \mathbb{R}^{n \times n}$ encodes pairwise dot products between features; $XX^T \in \mathbb{R}^{m \times m}$ encodes pairwise dot products between samples.
- Computational cost of naive matrix multiplication of two $n \times n$ matrices is $O(n^3)$; Strassen's algorithm achieves $O(n^{2.81})$.
- **Sparse matrices** (most entries zero) arise in NLP bag-of-words and graph adjacency matrices, enabling specialized storage formats (CSR, CSC) that reduce memory from $O(mn)$ to $O(\text{nnz})$.
- An **orthogonal matrix** $Q$ satisfies $Q^TQ = I$, meaning its columns are orthonormal. Orthogonal matrices preserve lengths and angles, which is why they appear in SVD and QR decomposition.

## Common Misconceptions

- **"A matrix is just a table of numbers."** A matrix is an operator. The same grid of numbers can represent a dataset, a linear map, a covariance structure, or a graph adjacency. Interpreting it correctly depends on context.
- **"Inverse always exists for square matrices."** Only if the determinant is nonzero. Singular matrices (rank-deficient) have no inverse, which is precisely when the system $A\mathbf{x} = \mathbf{b}$ may have no solution or infinitely many solutions.
- **"Higher-dimensional vectors can't be visualized, so intuition fails."** Many properties -- orthogonality, projection, span -- generalize perfectly from 2D/3D. Building geometric intuition in low dimensions transfers reliably.

## Connections to Other Concepts

- **Matrix Decompositions**: Eigendecomposition and SVD factor matrices to expose latent structure, rank, and enable compression.
- **Derivatives and Gradients**: Gradients are vectors; Jacobians and Hessians are matrices. Backpropagation is a sequence of matrix-vector products.
- **Norms and Distance Metrics**: The L2 norm $\|\mathbf{x}\|_2 = \sqrt{\mathbf{x} \cdot \mathbf{x}}$ is defined via the dot product; the Mahalanobis distance uses the inverse covariance matrix.
- **Probability Fundamentals**: Covariance matrices encode the joint variability of random variables.
- **Optimization and Gradient Descent**: The Hessian matrix determines the curvature of the loss surface and the conditioning of optimization.

## Further Reading

- Strang, *Introduction to Linear Algebra* (2016) -- The gold-standard textbook for building geometric intuition about vector spaces.
- Boyd & Vandenberghe, *Introduction to Applied Linear Algebra* (2018) -- Focused on applications in data science and ML, freely available online.
- Goodfellow et al., *Deep Learning*, Chapter 2 (2016) -- A concise review of the linear algebra needed specifically for deep learning.
