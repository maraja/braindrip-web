# Calibration

**One-Line Summary**: When a model says "80% confidence" it should be right 80% of the time -- reliability diagrams, Platt scaling, and isotonic regression.

**Prerequisites**: Probability fundamentals, logistic regression, classification metrics, cross-validation.

## What Is Calibration?

Imagine a weather forecaster who says "70% chance of rain" on 100 different days. If it actually rains on 70 of those days, the forecaster is **well-calibrated**. If it rains on only 40 of those days, the forecaster is overconfident -- the stated probabilities do not match observed frequencies. Model calibration is precisely this concept applied to machine learning: it measures whether a model's predicted probabilities reflect the true likelihood of outcomes.

Formally, a model is perfectly calibrated if for all probability values $p \in [0, 1]$:

$$P(Y = 1 \mid \hat{p}(X) = p) = p$$

That is, among all examples where the model predicts probability $p$, the actual fraction of positives should be $p$.

## How It Works

### Why Calibration Matters Beyond Accuracy

A model can have excellent discrimination (high AUC-ROC) while being poorly calibrated. Consider a model that correctly ranks all positives above all negatives (AUC = 1.0) but assigns probabilities of 0.99 to everything. Its ranking is perfect, but its probabilities are meaningless. Calibration matters whenever decisions depend on the **magnitude** of predicted probabilities:

- Medical diagnosis: "Is this 90% cancer or 60% cancer?" determines whether to biopsy immediately or monitor.
- Advertising: Bid price should be proportional to the probability of a click.
- Risk assessment: Insurance premiums require calibrated probability estimates.

### Calibration vs. Discrimination

These are orthogonal properties:

| | Good Discrimination | Poor Discrimination |
|---|---|---|
| **Good Calibration** | Ideal model | Correct probabilities but poor ranking |
| **Poor Calibration** | Good ranking but misleading confidence | Worst case |

You can fix calibration without changing discrimination (by monotonically transforming probabilities). You cannot easily fix discrimination after training.

### Reliability Diagrams

A reliability diagram (or calibration curve) is the primary diagnostic tool. Construction:

1. Sort predictions by predicted probability.
2. Group predictions into $B$ bins (e.g., $B = 10$: [0, 0.1), [0.1, 0.2), ...).
3. For each bin, compute the **mean predicted probability** (x-axis) and the **observed fraction of positives** (y-axis).
4. Plot the points. A perfectly calibrated model lies on the diagonal $y = x$.

Common patterns:
- **Sigmoid shape (above then below diagonal)**: Overconfident -- extreme probabilities are too extreme.
- **Below the diagonal everywhere**: Systematically overconfident.
- **Above the diagonal everywhere**: Systematically underconfident.

### Expected Calibration Error (ECE)

ECE quantifies calibration quality as a single number:

$$\text{ECE} = \sum_{b=1}^{B} \frac{n_b}{N} \left| \text{acc}(b) - \text{conf}(b) \right|$$

where $n_b$ is the number of samples in bin $b$, $\text{acc}(b)$ is the observed accuracy in bin $b$, and $\text{conf}(b)$ is the mean predicted confidence in bin $b$.

ECE is a weighted average of the calibration gap across bins. Lower is better, with ECE = 0 indicating perfect calibration. A related metric, **Maximum Calibration Error (MCE)**, reports the worst bin:

$$\text{MCE} = \max_{b} \left| \text{acc}(b) - \text{conf}(b) \right|$$

### Platt Scaling

Platt scaling (Platt, 1999) fits a logistic regression model on top of the raw model outputs (logits or scores):

$$p_{\text{calibrated}} = \sigma(a \cdot z + b)$$

where $z$ is the uncalibrated model output (logit), $\sigma$ is the sigmoid function, and $a, b$ are learned parameters. The parameters are fit by minimizing log loss on a held-out calibration set (or via cross-validation to avoid overfitting).

**When it works**: Platt scaling is effective when the calibration function is approximately sigmoidal, which is common for SVMs and many neural networks.

**Limitation**: With only two parameters, Platt scaling assumes a specific functional form. It cannot correct complex, non-monotonic miscalibration patterns.

### Temperature Scaling

A special case of Platt scaling where $b = 0$ and $a = 1/T$:

$$p_{\text{calibrated}} = \sigma(z / T)$$

The single parameter $T > 0$ is called the **temperature**. When $T > 1$, predictions are softened (less confident). When $T < 1$, predictions are sharpened (more confident). Temperature scaling is the recommended post-hoc calibration method for deep neural networks because:

- It has only one parameter (minimal overfitting risk).
- It preserves the model's ranking (does not change AUC or accuracy).
- It is effective because neural networks are often miscalibrated in a uniform, systematic way.

### Isotonic Regression

Isotonic regression fits a non-decreasing step function that maps uncalibrated scores to calibrated probabilities:

$$p_{\text{calibrated}} = g(z) \quad \text{where } g \text{ is monotonically non-decreasing}$$

The function $g$ is fit by minimizing squared error subject to the monotonicity constraint, solved efficiently by the Pool Adjacent Violators (PAV) algorithm.

**Advantages**: Non-parametric -- can correct any monotonic miscalibration pattern, no matter how complex.

**Disadvantages**: More parameters mean higher risk of overfitting, especially with small calibration sets. Typically requires at least 1,000+ calibration examples to be reliable.

### Why Neural Networks Are Often Overconfident

Modern deep neural networks are frequently miscalibrated, particularly overconfident. Several factors contribute:

- **Over-parameterization**: Networks with many more parameters than training examples can fit the training data perfectly, pushing predicted probabilities toward 0 and 1.
- **Batch normalization and weight decay** interact in ways that affect calibration.
- **Training to convergence** on cross-entropy loss drives logits to large magnitudes.
- **Lack of calibration-aware training**: Standard training maximizes log-likelihood without explicitly penalizing miscalibration.

Guo et al. (2017) demonstrated that deeper and wider networks have increasingly poor calibration despite improving accuracy -- a surprising finding that motivated temperature scaling as a simple fix.

### Multiclass Calibration

For $C$ classes, calibration requires:

$$P(Y = c \mid \hat{p}_c(X) = p) = p \quad \forall \, c \in \{1, \ldots, C\}$$

Temperature scaling extends naturally: divide all logits by a single temperature $T$ before the softmax. Platt scaling and isotonic regression can be applied per-class using a one-vs-all scheme.

## Why It Matters

Calibration is the bridge between a model's output and actionable decisions. An uncalibrated model may have great ranking ability but cannot be used to set thresholds reliably, compute expected values, or feed into downstream systems that assume probabilities are meaningful. In domains like healthcare, finance, and autonomous driving, the difference between a model that says "95% safe" (and is right 95% of the time) and one that says "95% safe" (but is right only 70% of the time) can be a matter of life and safety.

## Key Technical Details

- **Calibration set**: Platt scaling and isotonic regression require a held-out calibration set. Never calibrate on training data. Cross-validation can be used when data is limited.
- **Binning schemes**: ECE is sensitive to the number and type of bins (equal-width vs. equal-frequency). Equal-frequency bins are more robust.
- **Calibration does not change ranking**: Platt scaling and temperature scaling are monotonic transformations. AUC-ROC and accuracy at a fixed threshold are preserved.
- **Brier score**: An alternative to log loss that decomposes into calibration, refinement, and uncertainty: $\text{Brier} = \frac{1}{N} \sum (y_i - \hat{p}_i)^2$. The calibration component directly measures calibration error.

## Common Misconceptions

- **"A model with high accuracy is well-calibrated."** Accuracy measures the fraction of correct hard predictions. A model can be highly accurate while assigning extreme and poorly calibrated probabilities to its correct predictions.
- **"AUC-ROC measures calibration."** AUC-ROC measures discrimination (ranking quality), which is entirely independent of calibration. A model with perfect AUC can have arbitrarily bad calibration.
- **"Deep learning models output probabilities."** Softmax outputs are often interpreted as probabilities but are frequently overconfident. Post-hoc calibration is almost always necessary for deep networks.
- **"Platt scaling always works."** Platt scaling assumes a sigmoidal calibration curve. For complex miscalibration patterns, isotonic regression or binning approaches may be needed.

## Connections to Other Concepts

- `classification-metrics.md`: Log loss directly rewards calibration. AUC-ROC does not. MCC and F1 depend on the threshold but not on probability values.
- `cross-validation.md`: Used to generate calibration sets and to estimate ECE reliably.
- `model-comparison.md`: Two models may rank similarly on AUC but differ substantially in calibration quality. Compare ECE alongside discrimination metrics.
- `learning-curves.md`: Tracking ECE across training iterations reveals when overconfidence emerges.
- `hyperparameter-tuning.md`: When the downstream objective depends on calibrated probabilities, tune hyperparameters with log loss or Brier score rather than accuracy or AUC.

## Further Reading

- Guo et al., "On Calibration of Modern Neural Networks" (2017) -- Landmark paper showing neural networks are miscalibrated and that temperature scaling is an effective fix.
- Niculescu-Mizil & Caruana, "Predicting Good Probabilities with Supervised Learning" (2005) -- Compares calibration of various classifiers (boosting, SVMs, neural nets, random forests).
- Platt, "Probabilistic Outputs for Support Vector Machines" (1999) -- Original paper on Platt scaling for SVMs.
