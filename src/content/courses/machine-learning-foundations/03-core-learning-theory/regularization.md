# Regularization

**One-Line Summary**: Constraining model complexity to improve generalization -- L1, L2, dropout, early stopping, and the bias-variance connection.

**Prerequisites**: Bias-Variance Tradeoff, Overfitting and Underfitting, Loss Functions, basic calculus.

## What Is Regularization?

Imagine you are writing an essay and your teacher says: "Explain this concept, but you can only use 100 words." That constraint forces you to focus on what matters and discard filler. Regularization does the same for models -- it imposes a penalty or constraint that discourages the model from becoming too complex, forcing it to capture genuine patterns rather than noise.

Formally, regularization modifies the learning objective to include a penalty term $\Omega(\theta)$ that discourages complex models:

$$\hat{\theta} = \arg\min_{\theta} \left[ \frac{1}{n}\sum_{i=1}^n \mathcal{L}(f_\theta(\mathbf{x}_i), y_i) + \lambda \, \Omega(\theta) \right]$$

where $\lambda \geq 0$ controls the strength of the penalty. The result is a controlled increase in bias in exchange for a larger decrease in variance, improving generalization.

## How It Works

### L2 Regularization (Ridge / Weight Decay)

The penalty is the squared L2 norm of the parameter vector:

$$\Omega(\theta) = \|\theta\|_2^2 = \sum_j \theta_j^2$$

The full objective becomes:

$$\hat{\theta} = \arg\min_{\theta} \left[ \frac{1}{n}\sum_{i=1}^n \mathcal{L}(f_\theta(\mathbf{x}_i), y_i) + \lambda \sum_j \theta_j^2 \right]$$

**Effect**: Weights are shrunk toward zero but never exactly to zero. Large weights are penalized quadratically, so the model distributes information across many features rather than relying heavily on a few. For linear regression, the closed-form solution changes from $\hat{\theta} = (X^T X)^{-1} X^T y$ to:

$$\hat{\theta}_{\text{ridge}} = (X^T X + \lambda I)^{-1} X^T y$$

The addition of $\lambda I$ makes the matrix invertible even when $X^T X$ is singular, improving numerical stability.

### L1 Regularization (Lasso)

The penalty is the L1 norm:

$$\Omega(\theta) = \|\theta\|_1 = \sum_j |\theta_j|$$

**Effect**: L1 drives some weights exactly to zero, producing **sparse** models. This performs automatic feature selection -- irrelevant features get zeroed out. The geometry explains why: the L1 constraint region is a diamond (in 2D) with corners on the axes. The loss contours are more likely to intersect a corner, setting one coordinate to zero.

### Elastic Net

Combines L1 and L2:

$$\Omega(\theta) = \alpha \|\theta\|_1 + (1 - \alpha) \|\theta\|_2^2$$

where $\alpha \in [0, 1]$ controls the mix. This gets the sparsity benefits of L1 while retaining the stability of L2, particularly useful when features are correlated (L1 alone may arbitrarily select one from a group of correlated features).

### Early Stopping

In iterative optimization (gradient descent), the model's effective complexity increases with training iterations. Early stopping halts training when validation error begins to increase, even if training error continues to decrease.

The number of training steps $t$ acts as an inverse regularization parameter: fewer steps correspond to stronger regularization. For linear models with gradient descent, early stopping is mathematically equivalent to L2 regularization with $\lambda \propto 1/t$.

### Dropout (Neural Networks)

During each training step, randomly set each neuron's activation to zero with probability $p$ (typically $p = 0.5$ for hidden layers). At test time, use all neurons but scale weights by $(1 - p)$.

**Interpretation**: Dropout trains an implicit ensemble of $2^n$ sub-networks (where $n$ is the number of neurons) and averages their predictions at test time. It prevents co-adaptation -- neurons cannot rely on specific other neurons being present, so each must learn more robust features.

### Data Augmentation as Regularization

Applying transformations to training data -- rotations, flips, crops, color jitter for images; synonym replacement, back-translation for text -- effectively increases the training set size and encodes invariances. This is a form of regularization because it prevents the model from overfitting to idiosyncratic training examples.

### Bayesian Interpretation

Regularization has a clean Bayesian interpretation. The loss function corresponds to the **likelihood** $p(\mathcal{D}|\theta)$, and the regularization term corresponds to a **prior** $p(\theta)$:

$$\hat{\theta}_{\text{MAP}} = \arg\max_{\theta} \left[ \log p(\mathcal{D}|\theta) + \log p(\theta) \right]$$

- L2 regularization corresponds to a **Gaussian prior**: $p(\theta) \propto \exp(-\lambda \|\theta\|_2^2)$.
- L1 regularization corresponds to a **Laplace prior**: $p(\theta) \propto \exp(-\lambda \|\theta\|_1)$.

The Laplace prior has more mass at zero, explaining why L1 produces sparsity.

### Tuning the Regularization Hyperparameter

The strength $\lambda$ must be tuned via cross-validation:

1. Define a grid or range of $\lambda$ values (often logarithmically spaced: $10^{-5}, 10^{-4}, \ldots, 10^{2}$).
2. For each $\lambda$, train the model and evaluate on a validation set (or use $k$-fold CV).
3. Select the $\lambda$ that minimizes validation error.

Too small $\lambda$: the penalty is negligible, overfitting persists. Too large $\lambda$: the model is overly constrained, underfitting occurs.

## Why It Matters

Regularization is the single most important practical technique for improving generalization. Nearly every modern ML system uses some form of it. Without regularization, deep neural networks memorize training data trivially (as shown by Zhang et al., 2017). With appropriate regularization, these same networks achieve state-of-the-art generalization. The choice and tuning of regularization often has a larger effect on performance than the choice of model architecture.

## Key Technical Details

- **Weight decay** in neural network optimizers (like AdamW) is L2 regularization applied directly to the weight update, which is not exactly equivalent to adding $\lambda \|\theta\|_2^2$ to the loss when using adaptive optimizers like Adam.
- **Batch normalization** acts as an implicit regularizer by adding noise through mini-batch statistics.
- **Label smoothing** regularizes by replacing hard targets (0 or 1) with soft targets ($\epsilon/K$ and $1 - \epsilon + \epsilon/K$), preventing the model from becoming overconfident.
- **Spectral norm regularization** constrains the Lipschitz constant of neural network layers.
- For kernel methods, regularization controls the smoothness of the learned function in the reproducing kernel Hilbert space.

## Common Misconceptions

- **"Regularization always hurts training performance."** True, but that is the point. The goal is not to minimize training loss -- it is to minimize test loss. The slight increase in training error is the bias cost of reduced variance.
- **"L1 is always better than L2 because it does feature selection."** L1 is better when true sparsity exists. L2 is better when many features contribute small amounts. Elastic net hedges between the two.
- **"Dropout is just noise injection."** While it does inject noise, its effect is more nuanced: it creates an implicit ensemble and prevents co-adaptation. Simple noise injection (e.g., adding Gaussian noise to inputs) has different regularization properties.
- **"More regularization is always safer."** Excessive regularization causes underfitting. The optimal $\lambda$ depends on the dataset size, model complexity, and signal-to-noise ratio.

## Connections to Other Concepts

- **Bias-Variance Tradeoff**: Regularization explicitly trades increased bias for decreased variance.
- **Overfitting and Underfitting**: Regularization is the primary remedy for overfitting; excessive regularization is a cause of underfitting.
- **Loss Functions**: The regularized objective is $\mathcal{L}_{\text{data}} + \lambda \, \Omega(\theta)$ -- the regularization term modifies the loss landscape.
- **Empirical Risk Minimization**: Regularized ERM is called structural risk minimization, which balances data fit with model complexity.
- **Curse of Dimensionality**: In high dimensions, regularization becomes essential because the model has more ways to overfit.

## Further Reading

- Hastie, T., Tibshirani, R., Friedman, J., *The Elements of Statistical Learning* (2009), Chapters 3-4 -- Thorough treatment of L1 and L2 for linear models.
- Srivastava, N. et al., "Dropout: A Simple Way to Prevent Neural Networks from Overfitting" (2014) -- The original dropout paper.
- Tibshirani, R., "Regression Shrinkage and Selection via the Lasso" (1996) -- The foundational L1 regularization paper.
- Loshchilov, I. & Hutter, F., "Decoupled Weight Decay Regularization" (2019) -- Explains why weight decay and L2 regularization differ for adaptive optimizers.
