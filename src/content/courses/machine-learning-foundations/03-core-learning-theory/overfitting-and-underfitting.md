# Overfitting and Underfitting

**One-Line Summary**: Memorizing training data vs. failing to capture patterns -- the two failure modes of every learning algorithm.

**Prerequisites**: What Is Machine Learning, Bias-Variance Tradeoff, basic statistics.

## What Are Overfitting and Underfitting?

Imagine studying for an exam. **Underfitting** is like skimming the textbook once and missing the core ideas -- you fail because you did not learn enough. **Overfitting** is like memorizing every practice problem word-for-word, including the typos -- you ace the practice set but bomb the actual exam because you memorized specifics instead of understanding principles.

Formally, **overfitting** occurs when a model performs significantly better on training data than on unseen test data, indicating it has captured noise or idiosyncratic patterns in the training set rather than the true underlying relationship. **Underfitting** occurs when the model performs poorly on *both* training and test data, indicating it has failed to capture the underlying structure.

## How It Works

### Detecting the Problem

The primary diagnostic is the **gap between training performance and validation performance**.

| Scenario | Training Error | Validation Error | Diagnosis |
|---|---|---|---|
| Both high | High | High | Underfitting |
| Train low, val high | Low | High | Overfitting |
| Both low | Low | Low | Good fit |

Quantitatively, if training loss is $\mathcal{L}_{\text{train}}$ and validation loss is $\mathcal{L}_{\text{val}}$:

- Underfitting: $\mathcal{L}_{\text{train}}$ is high (the model cannot fit even the training data).
- Overfitting: $\mathcal{L}_{\text{val}} - \mathcal{L}_{\text{train}} \gg 0$ (large generalization gap).

### Causes of Overfitting

**Model too complex.** A polynomial of degree 20 fitting 25 data points will interpolate perfectly but generalize terribly. The model has more effective parameters than the signal in the data can support.

**Insufficient training data.** With $n$ small, even a moderately complex model can memorize the data. The variance term in the bias-variance decomposition scales roughly as $O(\text{complexity}/n)$.

**Training too long.** In iterative methods (neural networks, boosting), the model's effective complexity increases with training iterations. Early epochs capture broad patterns; later epochs fit noise.

**Noisy or mislabeled data.** If the training set contains errors, the model may learn to reproduce those errors.

**Feature leakage.** If features inadvertently contain information about the target that would not be available at prediction time, the model learns a spurious shortcut.

### Causes of Underfitting

**Model too simple.** A linear model cannot capture a quadratic relationship. The hypothesis class $\mathcal{H}$ does not contain a good approximation of the true function.

**Wrong features.** The input representation $\mathbf{x}$ lacks the information needed to predict $y$. No amount of model complexity compensates for missing signal.

**Excessive regularization.** Regularization that is too strong pushes model weights toward zero, preventing the model from fitting even the training data.

**Insufficient training.** The optimizer has not converged -- the model could fit the data but has not been given enough iterations.

### Diagnostic Tools

**Learning Curves.** Plot training and validation error as a function of training set size $n$:

- *Overfitting signature*: Training error is low and increases slowly with $n$; validation error is high but decreases. A large gap persists.
- *Underfitting signature*: Both curves converge to a high error. Adding more data does not help because the model class is too restricted.

**Validation Curves.** Plot training and validation error as a function of a hyperparameter controlling complexity (e.g., polynomial degree, regularization strength $\lambda$, number of tree leaves):

- As complexity increases from low: training error decreases, validation error first decreases then increases.
- The minimum of the validation curve suggests the optimal complexity.

**Residual Analysis.** For regression, plot residuals $(y_i - \hat{y}_i)$ against predicted values. Systematic patterns in residuals suggest underfitting. Random scatter suggests a good fit.

### Remedies for Overfitting

1. **Regularization**: Add a penalty term to the loss. L1, L2, dropout, and early stopping all constrain effective model complexity.
2. **More training data**: Reducing variance by increasing $n$.
3. **Data augmentation**: Synthetically increasing the effective dataset size through transformations.
4. **Feature selection / dimensionality reduction**: Remove irrelevant features that contribute noise.
5. **Simpler model architecture**: Fewer layers, fewer parameters, shallower trees.
6. **Ensemble methods**: Bagging averages out variance across multiple models.
7. **Cross-validation**: Use k-fold CV to get robust estimates of generalization and tune hyperparameters.

### Remedies for Underfitting

1. **More complex model**: Deeper networks, higher-degree polynomials, more trees.
2. **Better features**: Feature engineering, domain-specific transformations, polynomial features.
3. **Reduce regularization**: Lower $\lambda$ to allow the model more flexibility.
4. **Train longer**: Increase epochs or iterations to allow convergence.
5. **Change model family**: Switch from linear to non-linear models entirely.

### A Concrete Example

Fitting a sine curve $y = \sin(x) + \epsilon$ with polynomials:

- Degree 1 (linear): Training MSE = 0.43, Test MSE = 0.45. Both are high. **Underfitting**.
- Degree 4: Training MSE = 0.02, Test MSE = 0.03. Both are low. **Good fit**.
- Degree 15 with $n = 20$: Training MSE = 0.0001, Test MSE = 0.85. Massive gap. **Overfitting**.

## Why It Matters

Overfitting and underfitting are not theoretical curiosities -- they are the most common failure modes in practice. A deployed model that overfits makes confident but wrong predictions on new data. An underfitting model wastes the signal in your data. Every decision in the ML pipeline -- model choice, feature engineering, regularization, training duration, data collection -- affects where you land on the spectrum. Diagnosing which problem you face determines the right corrective action.

## Key Technical Details

- **Effective degrees of freedom** quantify model complexity more precisely than raw parameter count. A 1000-parameter model with strong regularization may have fewer effective degrees of freedom than a 50-parameter unregularized model.
- **Double descent**: Extremely over-parameterized models (parameters $\gg n$) can generalize well despite interpolating training data, challenging the classic view. This occurs due to implicit regularization in gradient descent.
- **Cross-validation** is the gold standard for estimating generalization error. $k$-fold CV trains $k$ models, each on $\frac{k-1}{k}$ of the data, and evaluates on the held-out fold:

$$\hat{\mathcal{L}}_{\text{CV}} = \frac{1}{k}\sum_{j=1}^{k} \mathcal{L}(\hat{f}_{-j}, \mathcal{D}_j)$$

- **Train-validation-test split**: The validation set is for hyperparameter tuning; the test set is for final evaluation. Using the test set for tuning introduces optimistic bias.

## Common Misconceptions

- **"A model with 100% training accuracy is good."** It may be memorizing the data. Always check validation performance.
- **"Overfitting only happens with small datasets."** Large models can overfit large datasets too -- the relative ratio of model capacity to data complexity matters.
- **"Underfitting means the algorithm is broken."** It often means the model class is too restrictive or the features are insufficient. The algorithm may be working perfectly within its constraints.
- **"Regularization always prevents overfitting."** Too little regularization leaves overfitting unchecked; too much regularization causes underfitting. It must be tuned.

## Connections to Other Concepts

- **Bias-Variance Tradeoff**: Underfitting corresponds to high bias; overfitting corresponds to high variance. This file describes the practical symptoms; the tradeoff provides the theoretical explanation.
- **Regularization**: The primary toolkit for combating overfitting, explored in detail in its own concept file.
- **Loss Functions**: The choice of loss function affects how overfitting manifests -- MAE is more robust to outliers than MSE, for example.
- **Empirical Risk Minimization**: Overfitting is exactly what happens when minimizing empirical risk does not minimize true risk.
- **Curse of Dimensionality**: High dimensions make overfitting more likely because the model has more ways to fit noise.

## Further Reading

- Hastie, T., Tibshirani, R., Friedman, J., *The Elements of Statistical Learning* (2009), Chapter 7 -- Model selection and the bias-variance tradeoff in depth.
- Goodfellow, I., Bengio, Y., Courville, A., *Deep Learning* (2016), Chapter 5 -- Machine learning basics including overfitting in the deep learning context.
- Arlot, S. & Celisse, A., "A Survey of Cross-Validation Procedures for Model Selection" (2010) -- Thorough treatment of cross-validation methods.
- Zhang, C. et al., "Understanding Deep Learning Requires Rethinking Generalization" (2017) -- Showed deep networks can memorize random labels, challenging conventional generalization theory.
