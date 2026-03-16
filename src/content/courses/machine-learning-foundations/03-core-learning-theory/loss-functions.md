# Loss Functions

**One-Line Summary**: The objective being optimized -- MSE, cross-entropy, hinge loss, and how the choice shapes what the model learns.

**Prerequisites**: What Is Machine Learning, basic calculus, basic probability.

## What Is a Loss Function?

Think of a loss function as a scoring rubric for an exam. Two teachers might grade the same essay differently depending on their rubric -- one penalizes small mistakes lightly, the other harshly. Similarly, the loss function defines *how wrong* each prediction is. A model trained with one loss function will learn different behavior than the same architecture trained with another, even on the same data.

Formally, a loss function $\mathcal{L}(y, \hat{y})$ maps a true value $y$ and a predicted value $\hat{y}$ to a non-negative real number quantifying the prediction's cost. The learning algorithm minimizes the aggregate loss over the training set:

$$\hat{\theta} = \arg\min_{\theta} \frac{1}{n} \sum_{i=1}^{n} \mathcal{L}(y_i, f_\theta(\mathbf{x}_i))$$

## How It Works

### Regression Losses

**Mean Squared Error (MSE)**:

$$\mathcal{L}_{\text{MSE}} = \frac{1}{n}\sum_{i=1}^n (y_i - \hat{y}_i)^2$$

MSE penalizes large errors quadratically, making it sensitive to outliers. It corresponds to maximum likelihood estimation under Gaussian noise: if $y = f(\mathbf{x}) + \epsilon$ with $\epsilon \sim \mathcal{N}(0, \sigma^2)$, then minimizing MSE is equivalent to maximizing the log-likelihood.

**Mean Absolute Error (MAE)**:

$$\mathcal{L}_{\text{MAE}} = \frac{1}{n}\sum_{i=1}^n |y_i - \hat{y}_i|$$

MAE penalizes all errors linearly, making it more **robust to outliers** than MSE. It corresponds to maximum likelihood under Laplace-distributed noise. The optimal prediction under MAE is the conditional median rather than the conditional mean.

**Huber Loss** -- a hybrid:

$$\mathcal{L}_\delta(r) = \begin{cases} \frac{1}{2}r^2 & \text{if } |r| \leq \delta \\ \delta(|r| - \frac{1}{2}\delta) & \text{otherwise} \end{cases}$$

where $r = y - \hat{y}$. Huber loss behaves like MSE for small errors (smooth, easy to optimize) and like MAE for large errors (robust to outliers). The parameter $\delta$ controls the transition.

### Classification Losses

**Binary Cross-Entropy (Log Loss)**:

For binary classification where $\hat{p} = P(y=1|\mathbf{x})$:

$$\mathcal{L}_{\text{BCE}} = -\frac{1}{n}\sum_{i=1}^n \left[ y_i \log(\hat{p}_i) + (1 - y_i)\log(1 - \hat{p}_i) \right]$$

Cross-entropy measures the dissimilarity between the true distribution (one-hot label) and the predicted probability distribution. It is derived from maximum likelihood: if the model outputs $\hat{p}_i$ and the label is $y_i \in \{0, 1\}$, the likelihood is $\hat{p}_i^{y_i}(1-\hat{p}_i)^{1-y_i}$, and the negative log-likelihood gives cross-entropy.

**Multi-Class Cross-Entropy**:

For $K$ classes with predicted probabilities $\hat{p}_k = P(y = k | \mathbf{x})$:

$$\mathcal{L}_{\text{CE}} = -\frac{1}{n}\sum_{i=1}^n \sum_{k=1}^K y_{ik} \log(\hat{p}_{ik})$$

where $y_{ik}$ is 1 if sample $i$ belongs to class $k$ and 0 otherwise. Used with the softmax output layer in neural networks.

**Hinge Loss** (SVM):

$$\mathcal{L}_{\text{hinge}} = \frac{1}{n}\sum_{i=1}^n \max(0, 1 - y_i \cdot f(\mathbf{x}_i))$$

where $y_i \in \{-1, +1\}$ and $f(\mathbf{x}_i)$ is the raw model output (no sigmoid). Hinge loss is zero when the prediction is correct and confident (margin $\geq 1$), and increases linearly when the margin is insufficient. This produces **sparse solutions** -- only support vectors (points near or on the wrong side of the boundary) affect the learned model.

### How Loss Choice Shapes Learning

The loss function determines:

1. **What the model optimizes for**: MSE targets the mean, MAE targets the median, quantile loss targets a specific percentile.
2. **Sensitivity to outliers**: Squared losses amplify outlier influence; absolute and Huber losses bound it.
3. **Probability calibration**: Cross-entropy encourages well-calibrated probabilities; hinge loss only cares about correct classification with margin.
4. **Gradient behavior**: MSE gradients grow with error magnitude (can speed convergence on large errors); MAE gradients are constant (stable but slower near the optimum); cross-entropy gradients vanish when the model is confident and correct but remain large when confident and wrong.

### Surrogate Losses

Many evaluation metrics (accuracy, AUC, F1) are non-differentiable and cannot be directly optimized by gradient descent. **Surrogate losses** are differentiable functions that serve as proxies:

- Cross-entropy is a surrogate for 0-1 loss (accuracy).
- Hinge loss is a surrogate for 0-1 loss that encourages margin.
- Smooth approximations exist for ranking losses (NDCG, MAP).

A good surrogate loss is **calibrated**: minimizing the surrogate also minimizes the true metric of interest.

### Custom Loss Functions

Domain-specific problems often require tailored losses:

- **Weighted cross-entropy** for class imbalance: multiply the loss for minority classes by a factor $w_k > 1$.
- **Focal loss** $(1-\hat{p})^\gamma \cdot \text{CE}$ for extreme imbalance: down-weights easy examples, focusing learning on hard cases.
- **Dice loss** for segmentation: directly optimizes overlap between predicted and true regions.
- **CTC loss** for sequence-to-sequence alignment without explicit alignment labels.

## Why It Matters

The loss function is the bridge between your business objective and what the optimization algorithm actually does. A mismatch between the loss function and the true goal is one of the most common and subtle errors in ML. For example, training a medical diagnosis system with unweighted cross-entropy on imbalanced data will produce a model that predicts "healthy" almost always -- technically minimizing loss but clinically useless.

## Key Technical Details

- Cross-entropy is always non-negative, and equals zero only when predicted probabilities match the true labels exactly.
- The gradient of cross-entropy with respect to the logits (pre-softmax values) has the elegant form $\hat{p}_k - y_k$, which is computationally efficient and numerically stable.
- **Log-sum-exp trick**: Computing $\log \sum_k \exp(z_k)$ naively causes overflow. Subtracting $\max(z_k)$ before exponentiating resolves this.
- MSE can cause **vanishing gradients** with sigmoid activations because the sigmoid saturates at 0 and 1, making the product of the MSE gradient and sigmoid derivative very small.
- KL divergence $D_{\text{KL}}(p \| q) = \sum p \log(p/q)$ is related to cross-entropy: $H(p, q) = H(p) + D_{\text{KL}}(p \| q)$.

## Common Misconceptions

- **"MSE and cross-entropy are interchangeable for classification."** MSE can technically be used for classification, but cross-entropy produces better-calibrated probabilities and has more favorable gradient properties with sigmoid/softmax outputs.
- **"Lower loss always means a better model."** On the training set, yes. But on a held-out set, loss can decrease then increase (overfitting). Also, different losses are not directly comparable in magnitude.
- **"The loss function is the same as the evaluation metric."** Often they differ. You might train with cross-entropy but evaluate with F1-score, AUC, or business-specific KPIs.
- **"Hinge loss is outdated because of cross-entropy."** Hinge loss and its variants remain important in max-margin classifiers, structured prediction, and certain adversarial robustness settings.

## Connections to Other Concepts

- `empirical-risk-minimization.md`: The loss function is the $\mathcal{L}$ in ERM. Different losses define different risk functionals.
- `regularization.md`: The regularized objective is loss + penalty. The loss measures data fit; regularization measures complexity.
- `bias-variance-tradeoff.md`: The bias-variance decomposition is cleanest for MSE. Different losses induce different decompositions.
- `overfitting-and-underfitting.md`: Monitoring loss on train vs. validation sets is the primary diagnostic for these problems.
- `what-is-machine-learning.md`: The loss function operationalizes the "performance measure $P$" in Mitchell's definition.

## Further Reading

- Rosasco, L. et al., "Are Loss Functions All the Same?" (2004) -- Theoretical comparison of loss functions for classification.
- Lin, T. et al., "Focal Loss for Dense Object Detection" (2017) -- Introduces focal loss for addressing class imbalance.
- Barron, J., "A General and Adaptive Robust Loss Function" (2019) -- Unifying framework that includes MSE, MAE, Huber, and others as special cases.
- Goodfellow, I., Bengio, Y., Courville, A., *Deep Learning* (2016), Chapter 6 -- Loss functions in the context of deep learning.
