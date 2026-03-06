# Classification Metrics

**One-Line Summary**: Accuracy, precision, recall, F1, AUC-ROC, and AUC-PR -- choosing the right metric depends on what errors cost.

**Prerequisites**: Supervised learning basics, probability fundamentals, binary classification.

## What Are Classification Metrics?

Imagine you are a doctor screening patients for a rare disease. You could achieve 99% accuracy by simply declaring everyone healthy -- but you would miss every sick patient. Classification metrics are the different lenses through which we evaluate a classifier's predictions, and choosing the wrong lens can hide catastrophic failures. Each metric answers a different question about where and how a model makes mistakes.

Formally, classification metrics are scalar functions that map a set of predictions and ground-truth labels to a real number summarizing some aspect of predictive quality.

## How It Works

### The Confusion Matrix

Every binary classification metric derives from four counts in the **confusion matrix**:

|  | Predicted Positive | Predicted Negative |
|---|---|---|
| **Actual Positive** | True Positive (TP) | False Negative (FN) |
| **Actual Negative** | False Positive (FP) | True Negative (TN) |

All metrics below are functions of TP, FP, TN, and FN.

### Accuracy and Its Pitfalls

$$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$

Accuracy measures the overall fraction of correct predictions. It works well when classes are balanced. On a dataset with 1% positives, a model that always predicts negative achieves 99% accuracy while catching zero positive cases. This is the **accuracy paradox**.

### Precision and Recall

**Precision** (positive predictive value) answers: "Of all the items I flagged positive, how many truly are?"

$$\text{Precision} = \frac{TP}{TP + FP}$$

**Recall** (sensitivity, true positive rate) answers: "Of all the actual positives, how many did I catch?"

$$\text{Recall} = \frac{TP}{TP + FN}$$

These two are in tension. A spam filter with very high precision rarely marks legitimate email as spam, but may let spam through (low recall). Cranking the threshold down catches more spam (higher recall) but flags more legitimate email (lower precision).

### F1 Score

The F1 score is the **harmonic mean** of precision and recall:

$$F_1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2 \, TP}{2 \, TP + FP + FN}$$

The harmonic mean is used rather than the arithmetic mean because it penalizes extreme imbalances: if either precision or recall is near zero, $F_1$ is pulled down sharply. The generalized form, $F_\beta$, weights recall $\beta$ times as much as precision:

$$F_\beta = (1 + \beta^2) \cdot \frac{\text{Precision} \cdot \text{Recall}}{\beta^2 \cdot \text{Precision} + \text{Recall}}$$

### ROC Curve and AUC-ROC

The **Receiver Operating Characteristic** curve plots the True Positive Rate (TPR = Recall) against the False Positive Rate ($FPR = FP / (FP + TN)$) at every classification threshold.

- A random classifier traces the diagonal (AUC = 0.5).
- A perfect classifier reaches the top-left corner (AUC = 1.0).

**AUC-ROC** (Area Under the ROC Curve) provides a threshold-independent measure of discriminative ability. It equals the probability that the model scores a randomly chosen positive higher than a randomly chosen negative:

$$\text{AUC-ROC} = P(s(x^+) > s(x^-))$$

### Precision-Recall Curve and AUC-PR

When the positive class is rare, the ROC curve can look optimistic because FPR remains low even with many false positives (since TN dominates the denominator). The **precision-recall curve** plots precision vs. recall at every threshold and exposes weakness that ROC hides.

**AUC-PR** is the area under this curve. A random classifier has an AUC-PR approximately equal to the prevalence of the positive class, making it a much more informative baseline for imbalanced problems.

**Concrete example**: On a fraud detection dataset with 0.1% positives, a model with AUC-ROC = 0.97 might have AUC-PR = 0.35 -- revealing that most flagged transactions are false alarms.

### Log Loss (Cross-Entropy)

Log loss evaluates the quality of predicted probabilities, not just hard classifications:

$$\text{Log Loss} = -\frac{1}{N} \sum_{i=1}^{N} \left[ y_i \log(\hat{p}_i) + (1 - y_i) \log(1 - \hat{p}_i) \right]$$

A model that is confident and correct is rewarded; one that is confident and wrong is severely punished. This metric matters when downstream decisions depend on probability estimates (see **calibration**).

### Matthews Correlation Coefficient (MCC)

$$\text{MCC} = \frac{TP \cdot TN - FP \cdot FN}{\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}$$

MCC ranges from $-1$ (total disagreement) to $+1$ (perfect prediction), with $0$ indicating random performance. It uses all four cells of the confusion matrix and is considered one of the most balanced metrics, especially for imbalanced datasets.

## Why It Matters

The choice of metric encodes your **value system**. In medical diagnosis, missing a cancer (FN) is far worse than a false alarm (FP), so recall is paramount. In email spam filtering, falsely quarantining an important email (FP) may be worse than letting spam through (FN), so precision matters more. Optimizing the wrong metric can produce a model that looks excellent on paper but fails in deployment.

## Key Technical Details

- **Threshold dependence**: Precision, recall, F1, and accuracy all depend on the classification threshold. AUC-ROC and AUC-PR summarize performance across all thresholds.
- **Multiclass extension**: Metrics extend to multiclass via macro-averaging (compute per class, then average), micro-averaging (pool all TP/FP/FN globally), or weighted averaging.
- **Class imbalance**: AUC-PR, MCC, and F1 are more informative than accuracy and AUC-ROC on imbalanced data.
- **Log loss requires calibrated probabilities**: A model with good AUC-ROC can have poor log loss if its probability estimates are miscalibrated.

## Common Misconceptions

- **"High accuracy means a good model."** On imbalanced datasets, accuracy can be misleading. A model predicting the majority class always achieves high accuracy while being useless. Always check class distribution first.
- **"AUC-ROC is always the best single metric."** AUC-ROC can be overly optimistic when the negative class vastly outnumbers the positive class. AUC-PR is often more appropriate for imbalanced problems.
- **"F1 treats precision and recall equally."** Standard $F_1$ does, but this is only appropriate when false positives and false negatives have equal cost. Use $F_\beta$ to adjust the balance.
- **"You should always maximize a single metric."** In practice, you often face trade-offs. Reporting multiple metrics and examining the confusion matrix gives a fuller picture.

## Connections to Other Concepts

- **Calibration**: Log loss directly rewards well-calibrated probabilities. Good AUC does not imply good calibration.
- **Cross-Validation**: Metrics must be estimated on held-out data; cross-validation provides robust estimates.
- **Learning Curves**: Plotting metrics vs. training set size reveals whether more data helps.
- **Regression Metrics**: Analogous evaluation tools for continuous predictions (MSE, MAE, R-squared).
- **Model Comparison**: Statistical tests determine whether metric differences between models are significant.

## Further Reading

- Davis & Goadrich, "The Relationship Between Precision-Recall and ROC Curves" (2006) -- Proves AUC-PR is more informative than AUC-ROC under class imbalance.
- Chicco & Jurman, "The Advantages of the Matthews Correlation Coefficient over F1 Score and Accuracy" (2020) -- Makes the case for MCC as a primary metric.
- Fawcett, "An Introduction to ROC Analysis" (2006) -- Definitive tutorial on ROC curves and AUC interpretation.
