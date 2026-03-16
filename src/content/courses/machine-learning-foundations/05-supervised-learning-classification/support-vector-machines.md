# Support Vector Machines

**One-Line Summary**: Finding the maximum-margin hyperplane that separates classes -- elegant geometry with strong theoretical guarantees.

**Prerequisites**: Linear algebra, optimization (constrained), hyperplanes, convex optimization basics, Lagrange multipliers.

## What Is a Support Vector Machine?

Imagine you have red and blue marbles on a table and want to place a ruler between them so that it separates the two colors. Many ruler positions work, but which is best? Intuitively, you want the ruler to be as far as possible from the closest marble on either side. Support Vector Machines (SVMs) formalize this idea: they find the hyperplane that maximizes the **margin** -- the distance to the nearest data point from either class.

Formally, given labeled training data $\{(x_i, y_i)\}_{i=1}^n$ with $y_i \in \{-1, +1\}$ and $x_i \in \mathbb{R}^d$, the SVM finds parameters $w$ and $b$ defining the hyperplane $w^T x + b = 0$ that maximizes the margin while correctly classifying all training points.

## How It Works

### Maximum Margin Intuition

The distance from a point $x_i$ to the hyperplane $w^T x + b = 0$ is $\frac{|w^T x_i + b|}{\|w\|}$. For correctly classified points, $y_i(w^T x_i + b) > 0$, so the distance is $\frac{y_i(w^T x_i + b)}{\|w\|}$. The margin is twice the distance to the closest point:

$$\text{margin} = \frac{2}{\|w\|} \quad \text{(after rescaling so } \min_i y_i(w^T x_i + b) = 1\text{)}$$

Maximizing $\frac{2}{\|w\|}$ is equivalent to minimizing $\frac{1}{2}\|w\|^2$.

### Hard-Margin SVM Formulation

When the data is linearly separable, the hard-margin SVM solves:

$$\min_{w, b} \frac{1}{2} \|w\|^2 \quad \text{subject to} \quad y_i(w^T x_i + b) \geq 1 \quad \forall i$$

This is a convex quadratic program with linear inequality constraints. The constraint $y_i(w^T x_i + b) \geq 1$ ensures every point is on the correct side of the margin.

### Support Vectors

The solution depends only on the training points that lie exactly on the margin boundary (where $y_i(w^T x_i + b) = 1$). These are the **support vectors**. All other points could be moved or removed without changing the solution. This sparsity is a key property: the model complexity depends on the number of support vectors, not the total training set size.

### Soft-Margin SVM

Real data is rarely perfectly separable. The **soft-margin SVM** introduces slack variables $\xi_i \geq 0$ that allow violations of the margin:

$$\min_{w, b, \xi} \frac{1}{2} \|w\|^2 + C \sum_{i=1}^n \xi_i \quad \text{subject to} \quad y_i(w^T x_i + b) \geq 1 - \xi_i, \quad \xi_i \geq 0$$

The parameter $C > 0$ controls the tradeoff:
- **Large $C$**: Small margin, few violations -- risk of overfitting.
- **Small $C$**: Large margin, more violations tolerated -- risk of underfitting.

A point with $\xi_i = 0$ is correctly classified outside the margin. A point with $0 < \xi_i < 1$ is correctly classified but inside the margin. A point with $\xi_i > 1$ is misclassified.

### Hinge Loss Interpretation

The soft-margin objective can be rewritten without explicit constraints as:

$$\min_{w, b} \frac{1}{2}\|w\|^2 + C \sum_{i=1}^n \max(0, 1 - y_i(w^T x_i + b))$$

The function $\ell(z) = \max(0, 1 - z)$ is the **hinge loss**. It is zero when $z \geq 1$ (correct classification with margin) and increases linearly when $z < 1$. Compare this to logistic regression's cross-entropy loss, which is smooth and never exactly zero. The hinge loss is what produces the sparsity of support vectors: points with $z > 1$ contribute zero gradient.

### The Dual Formulation

Using Lagrange multipliers $\alpha_i \geq 0$, the SVM dual is:

$$\max_\alpha \sum_{i=1}^n \alpha_i - \frac{1}{2} \sum_{i,j} \alpha_i \alpha_j y_i y_j x_i^T x_j \quad \text{s.t.} \quad 0 \leq \alpha_i \leq C, \quad \sum_i \alpha_i y_i = 0$$

The dual formulation is important for two reasons. First, the data enters only through inner products $x_i^T x_j$, which enables the kernel trick (see Kernel Methods). Second, $\alpha_i > 0$ only for support vectors, making the solution sparse. The decision function becomes:

$$f(x) = \text{sign}\left(\sum_{i \in SV} \alpha_i y_i \, x_i^T x + b\right)$$

where $SV$ is the set of support vectors.

### SVM vs. Logistic Regression

Both find linear decision boundaries, but they differ in important ways:

| Aspect | SVM | Logistic Regression |
|--------|-----|-------------------|
| Loss | Hinge (flat beyond margin) | Log loss (always nonzero) |
| Probabilities | Not natively | Yes |
| Sparsity | Only support vectors matter | All points contribute |
| Optimization | Quadratic program | Unconstrained convex |
| Kernel extension | Natural via dual | Possible but less standard |

In practice, their accuracy is often comparable on linearly separable or near-separable data. Logistic regression is preferred when calibrated probabilities are needed; SVMs are preferred when the kernel trick is beneficial.

### VC Dimension and Generalization

SVMs have strong theoretical backing through VC (Vapnik-Chervonenkis) theory. The generalization error is bounded by:

$$\text{error} \leq \frac{1}{n}\left(\text{training error} + O\left(\sqrt{\frac{h \log(n/h)}{n}}\right)\right)$$

where $h$ is the VC dimension. For maximum-margin classifiers, the VC dimension depends on the margin, not the input dimensionality. A large margin implies a smaller effective VC dimension, which implies better generalization. This is why SVMs can work well even in very high dimensions -- the margin-based complexity control is independent of $d$.

## Why It Matters

SVMs were the dominant classification method from the mid-1990s through the late 2000s, before deep learning took over many tasks. They remain excellent for medium-sized datasets, high-dimensional problems (e.g., text, genomics), and situations where theoretical guarantees matter. The kernel trick extends SVMs to nonlinear boundaries without ever computing explicit feature mappings, making them remarkably flexible. SVMs also influenced modern machine learning theory profoundly: concepts like margin, structural risk minimization, and kernel methods originated or were popularized through SVM research.

## Key Technical Details

- **Optimization**: The primal is a QP; the dual is also a QP. Efficient solvers include SMO (Sequential Minimal Optimization) and libSVM.
- **Scaling**: Standard SVMs scale $O(n^2)$ to $O(n^3)$ in memory and time due to the kernel matrix. For large datasets, linear SVMs (liblinear) are $O(nd)$.
- **Multiclass**: SVMs are inherently binary. Multiclass is handled via one-vs-rest or one-vs-one (see Multi-Class Classification).
- **Feature scaling**: Critical -- SVMs are sensitive to feature magnitudes because the margin depends on distances.
- **Probability estimates**: Platt scaling fits a sigmoid on top of SVM scores to produce calibrated probabilities, but this is a post-hoc approximation, not a native output of the model.

## Common Misconceptions

- **"SVMs always find the globally optimal solution."** The primal and dual are convex, so the optimizer does find the global minimum of the SVM objective. However, the choice of $C$ and kernel parameters still requires tuning.
- **"More support vectors means a worse model."** Many support vectors may indicate a complex boundary, but it can also reflect noisy data. The number of support vectors alone is not diagnostic.
- **"SVMs are obsolete because of deep learning."** SVMs remain competitive on tabular data, small datasets, and high-dimensional sparse data (e.g., text with TF-IDF features). They are far from obsolete.
- **"The SVM decision boundary always passes through the middle of the two classes."** It maximizes the margin, which is the distance to the nearest points. It does not bisect the class means.

## Connections to Other Concepts

- `kernel-methods.md`: The dual formulation enables replacing $x_i^T x_j$ with $K(x_i, x_j)$, mapping data to high-dimensional spaces implicitly. This is the foundation of kernel SVMs.
- `logistic-regression.md`: Both learn linear boundaries; the key difference is hinge loss vs. log loss, leading to sparse vs. dense solutions.
- `decision-trees.md`: Trees are nonlinear and interpretable but have no margin concept. SVMs are linear (in feature space) with strong generalization theory.
- `naive-bayes.md`: A generative classifier with different inductive bias. In high-dimensional text classification, both SVMs and Naive Bayes perform well.

## Further Reading

- Vapnik, "The Nature of Statistical Learning Theory" (1995) -- The foundational book on SVMs and VC theory.
- Cortes, Vapnik, "Support-Vector Networks" (1995) -- The original soft-margin SVM paper.
- Burges, "A Tutorial on Support Vector Machines for Pattern Recognition" (1998) -- Highly accessible introduction to SVM theory.
- Scholkopf, Smola, "Learning with Kernels" (2002) -- Comprehensive treatment of SVMs and kernel methods.
