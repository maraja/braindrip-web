# Logistic Regression

**One-Line Summary**: Linear model with sigmoid output for probability estimation -- the workhorse baseline for binary classification.

**Prerequisites**: Linear algebra, gradient descent, probability basics, maximum likelihood estimation.

## What Is Logistic Regression?

Imagine you are sorting mail into two bins: spam and not-spam. You could score each email on a continuous scale -- more spammy features push the score higher, more legitimate features push it lower. But you need a *probability*, not an unbounded score. Logistic regression takes a linear combination of features and squashes it through a curve that maps any real number to a value between 0 and 1.

Formally, logistic regression models the probability that an input $x \in \mathbb{R}^d$ belongs to class 1 as:

$$P(y = 1 \mid x) = \sigma(w^T x + b) = \frac{1}{1 + e^{-(w^T x + b)}}$$

where $\sigma(z) = \frac{1}{1 + e^{-z}}$ is the **sigmoid function**, $w \in \mathbb{R}^d$ is the weight vector, and $b$ is the bias term. Despite its name, logistic regression is a classification algorithm, not a regression algorithm. The "regression" refers to the fact that it estimates a continuous quantity (a probability) before thresholding.

## How It Works

### The Sigmoid Function

The sigmoid $\sigma(z)$ has several useful properties:
- Its output is always in $(0, 1)$, suitable for probabilities.
- It is monotonically increasing: higher scores mean higher probability.
- Its derivative has a clean form: $\sigma'(z) = \sigma(z)(1 - \sigma(z))$.
- It is symmetric: $\sigma(-z) = 1 - \sigma(z)$.

### Log-Odds Interpretation

Logistic regression is linear *in log-odds space*. The log-odds (logit) of the positive class is:

$$\log \frac{P(y=1 \mid x)}{P(y=0 \mid x)} = w^T x + b$$

This means each feature $x_j$ contributes additively to the log-odds. Increasing $x_j$ by one unit changes the log-odds by $w_j$, or equivalently multiplies the odds by $e^{w_j}$. This interpretability is one of the model's greatest strengths.

### Decision Boundary

The model predicts class 1 when $P(y=1 \mid x) \geq 0.5$, which occurs when $w^T x + b \geq 0$. This defines a **hyperplane** in feature space. In 2D, it is a line; in 3D, a plane. The boundary is always linear in the original feature space, which is both a strength (simplicity) and a limitation (cannot capture nonlinear patterns without feature engineering).

### Cross-Entropy Loss Derivation

Given training data $\{(x_i, y_i)\}_{i=1}^n$ with $y_i \in \{0,1\}$, the likelihood of the data under the model is:

$$L(w, b) = \prod_{i=1}^n \hat{p}_i^{y_i}(1 - \hat{p}_i)^{1 - y_i}$$

where $\hat{p}_i = \sigma(w^T x_i + b)$. Taking the negative log-likelihood gives the **binary cross-entropy loss**:

$$\mathcal{L}(w, b) = -\frac{1}{n}\sum_{i=1}^n \left[ y_i \log(\hat{p}_i) + (1 - y_i) \log(1 - \hat{p}_i) \right]$$

This loss is convex in $w$ and $b$, guaranteeing that gradient descent finds the global minimum. There is no closed-form solution, unlike ordinary least squares for linear regression.

### Gradient Descent for Logistic Regression

The gradient of the cross-entropy loss with respect to the weights is:

$$\frac{\partial \mathcal{L}}{\partial w} = \frac{1}{n} \sum_{i=1}^n (\hat{p}_i - y_i) x_i$$

This has the same form as the gradient for linear regression with MSE loss, but with $\hat{p}_i$ replacing $\hat{y}_i$. The update rule is:

$$w \leftarrow w - \eta \cdot \frac{1}{n} \sum_{i=1}^n (\hat{p}_i - y_i) x_i$$

In practice, stochastic gradient descent (SGD) or mini-batch variants are used for large datasets.

### Regularized Logistic Regression

To prevent overfitting, we add a penalty to the loss:

- **L2 regularization** (Ridge): $\mathcal{L} + \frac{\lambda}{2} \|w\|_2^2$ -- shrinks weights toward zero.
- **L1 regularization** (Lasso): $\mathcal{L} + \lambda \|w\|_1$ -- encourages sparse weights, performing implicit feature selection.
- **Elastic Net**: $\mathcal{L} + \lambda_1 \|w\|_1 + \frac{\lambda_2}{2} \|w\|_2^2$ -- combines both penalties.

The regularization strength $\lambda$ (or equivalently $C = 1/\lambda$ in scikit-learn) is a critical hyperparameter chosen via cross-validation.

### Multiclass via Softmax

For $K > 2$ classes, logistic regression generalizes to **softmax regression** (multinomial logistic regression). Each class $k$ has its own weight vector $w_k$, and the probability of class $k$ is:

$$P(y = k \mid x) = \frac{e^{w_k^T x}}{\sum_{j=1}^K e^{w_j^T x}}$$

The loss becomes the categorical cross-entropy. This is the same mechanism used in the output layer of neural networks for classification. See the multi-class classification concept for alternative strategies.

### Connection to Generalized Linear Models (GLMs)

Logistic regression is a GLM with a Bernoulli response distribution and the logit link function. The canonical link for the Bernoulli is $g(\mu) = \log(\mu / (1 - \mu))$, which is exactly the logit. This places logistic regression in a broader family alongside linear regression (Gaussian + identity link) and Poisson regression (Poisson + log link).

## Why It Matters

Logistic regression is the default first model for any binary classification problem. It trains fast, scales to millions of features (e.g., text classification with bag-of-words), produces calibrated probabilities, and its coefficients are directly interpretable. In medicine, finance, and social science, interpretability often matters more than marginal accuracy gains from complex models. It also serves as the conceptual foundation for neural network output layers and as a strong baseline against which fancier models must justify their complexity.

## Key Technical Details

- **Convex loss**: Cross-entropy is convex, so any local minimum is the global minimum.
- **No closed-form solution**: Must use iterative optimization (gradient descent, Newton's method, L-BFGS).
- **Feature scaling matters**: Gradient descent converges faster with standardized features.
- **Probability calibration**: Logistic regression outputs are naturally well-calibrated, unlike SVMs or random forests.
- **Linearly separable data**: Weights diverge to infinity without regularization; L2 regularization prevents this.
- **Computational complexity**: Training is $O(ndk)$ per epoch, where $n$ is samples, $d$ is features, $k$ is classes.
- **Newton's method**: Second-order optimization (IRLS -- Iteratively Reweighted Least Squares) converges faster than gradient descent for moderate-dimensional problems, using the Hessian matrix.

## Common Misconceptions

- **"Logistic regression is a regression algorithm."** Despite the name, it is a classifier. The "regression" refers to estimating a continuous probability, but the task is classification.
- **"It can only handle linearly separable data."** The decision boundary is linear, but you can add polynomial or interaction features to capture nonlinear boundaries. Kernel logistic regression also exists.
- **"It always outputs well-calibrated probabilities."** Calibration is good by default but degrades with strong regularization, class imbalance, or model misspecification. Always verify with reliability diagrams.
- **"You need balanced classes."** Logistic regression handles moderate imbalance. For severe imbalance, use class weights, oversampling, or adjust the decision threshold.

## Connections to Other Concepts

- **Support Vector Machines**: SVMs with a linear kernel optimize hinge loss instead of cross-entropy; both find linear decision boundaries but with different loss geometries.
- **Naive Bayes**: Both are linear classifiers in log-space. Naive Bayes estimates parameters generatively; logistic regression is discriminative.
- **Decision Trees**: Trees capture nonlinear boundaries natively but sacrifice the smooth probability estimates logistic regression provides.
- **Multi-Class Classification**: Softmax regression extends logistic regression to K classes directly, while OvR/OvO strategies wrap binary logistic regression.
- **Neural Networks**: A single-layer neural network with sigmoid activation *is* logistic regression. Deep networks generalize this with additional layers.

## Further Reading

- Hastie, Tibshirani, Friedman, "The Elements of Statistical Learning" (2009) -- Chapter 4 covers logistic regression in the context of linear classifiers.
- Bishop, "Pattern Recognition and Machine Learning" (2006) -- Section 4.3 provides the Bayesian perspective on logistic regression.
- Andrew Ng, CS229 Lecture Notes -- Clear derivation of gradient descent for logistic regression.
- Agresti, "Categorical Data Analysis" (2002) -- Definitive reference for logistic regression in applied statistics.
- McCullagh, Nelder, "Generalized Linear Models" (1989) -- The canonical reference for GLMs, placing logistic regression in its broader statistical context.
