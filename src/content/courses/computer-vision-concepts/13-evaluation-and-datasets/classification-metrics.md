# Classification Metrics

**One-Line Summary**: Classification metrics -- accuracy, precision, recall, F1, and their variants -- quantify model performance from different angles, with the choice of metric depending on class balance, error costs, and deployment context.

**Prerequisites**: Image Classification in Practice, Probability and Statistics Basics

## What Is Classification Metrics?

Imagine a model that screens medical images for cancer. It labels 95% of images correctly, but it misses 40% of actual cancers. Is it a good model? Accuracy says 95% -- sounds great. Recall says 60% -- dangerously low. Classification metrics are different lenses for evaluating the same model, each revealing a different aspect of performance. Choosing the right metric is as important as choosing the right model.

Technically, classification metrics are scalar summaries computed from the confusion matrix -- a table counting how predictions align with ground truth across all classes. Different metrics prioritize different types of errors (false positives vs. false negatives) and handle class imbalance differently.

## How It Works

### The Confusion Matrix

For a binary classifier with classes Positive (P) and Negative (N):

|  | Predicted P | Predicted N |
|--|------------|------------|
| **Actual P** | True Positive (TP) | False Negative (FN) |
| **Actual N** | False Positive (FP) | True Negative (TN) |

For $K$ classes, the confusion matrix is $K \times K$, where entry $(i, j)$ counts samples of true class $i$ predicted as class $j$.

### Core Metrics

**Accuracy**: Fraction of correct predictions.

$$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$

Simple and intuitive, but misleading under class imbalance. A model predicting "no cancer" for every image achieves 99% accuracy if only 1% of images have cancer.

**Top-1 and Top-5 Accuracy**: Standard for ImageNet evaluation. Top-1 counts a prediction as correct if the highest-scoring class matches the label. Top-5 counts it as correct if the true label is among the five highest-scoring classes. ImageNet top-5 accuracy is typically 5--10 points higher than top-1 (e.g., ResNet-50: 76.1% top-1, 92.9% top-5).

**Precision**: Of all predicted positives, how many are actually positive?

$$\text{Precision} = \frac{TP}{TP + FP}$$

High precision means few false alarms. Critical when false positives are costly (e.g., spam detection -- you do not want to delete real emails).

**Recall (Sensitivity, True Positive Rate)**: Of all actual positives, how many are correctly identified?

$$\text{Recall} = \frac{TP}{TP + FN}$$

High recall means few missed positives. Critical when false negatives are costly (e.g., cancer screening -- you do not want to miss tumors).

**F1 Score**: Harmonic mean of precision and recall, balancing both:

$$F1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2 \cdot TP}{2 \cdot TP + FP + FN}$$

F1 = 0 when either precision or recall is 0; F1 = 1 when both are perfect.

**F-beta Score**: Generalizes F1 with a parameter $\beta$ weighting recall $\beta$ times more than precision:

$$F_\beta = (1 + \beta^2) \cdot \frac{\text{Precision} \cdot \text{Recall}}{\beta^2 \cdot \text{Precision} + \text{Recall}}$$

$F_2$ (recall-heavy) is common in medical screening; $F_{0.5}$ (precision-heavy) is used in spam filtering.

### Multi-Class Averaging

For $K$-class problems, per-class precision and recall must be aggregated:

**Macro Average**: Compute the metric for each class, then average. Treats all classes equally regardless of size.

$$\text{Macro-F1} = \frac{1}{K} \sum_{k=1}^{K} F1_k$$

**Micro Average**: Aggregate TP, FP, FN across all classes, then compute the metric. Equivalent to accuracy for multi-class single-label classification.

$$\text{Micro-F1} = \frac{2 \sum_k TP_k}{2 \sum_k TP_k + \sum_k FP_k + \sum_k FN_k}$$

**Weighted Average**: Average per-class metrics weighted by class frequency (support). A compromise between macro and micro.

**When to use which**:
- Macro: When all classes matter equally, even rare ones. Penalizes poor performance on minority classes.
- Micro: When overall correctness matters most. Dominated by majority classes.
- Weighted: When you want class-frequency-proportional importance.

### Threshold-Independent Metrics

**ROC-AUC (Receiver Operating Characteristic - Area Under Curve)**: Plots True Positive Rate vs. False Positive Rate at all thresholds. AUC = 1.0 is perfect; AUC = 0.5 is random. Insensitive to class imbalance in the positive direction (but can be misleading when negative class is very large).

**PR-AUC (Precision-Recall Area Under Curve)**: Plots precision vs. recall. More informative than ROC-AUC under severe class imbalance because it focuses on the positive class.

### Calibration Metrics

**Expected Calibration Error (ECE)**: Measures how well predicted probabilities match actual correctness rates. Bins predictions by confidence, computes the gap between average confidence and accuracy per bin:

$$ECE = \sum_{b=1}^{B} \frac{|B_b|}{N} |\text{acc}(B_b) - \text{conf}(B_b)|$$

A well-calibrated model has ECE close to 0. Modern deep networks typically have ECE of 10--15% before calibration.

## Why It Matters

1. Metric selection directly affects model development: optimizing for accuracy vs. F1 vs. recall leads to fundamentally different models.
2. In medical imaging, a model with 99% accuracy but 50% recall for rare diseases is clinically useless.
3. Leaderboard rankings depend on the chosen metric; ImageNet uses top-1 accuracy, COCO uses mAP -- different metrics incentivize different architectural innovations.
4. Business decisions (deploy or not) hinge on whether the right metric exceeds the required threshold.

## Key Technical Details

- ImageNet benchmarks: top-1 and top-5 accuracy on 50K validation images across 1,000 classes.
- For binary classification with 1% positive rate, a model predicting all negatives achieves 99% accuracy, 0% precision (undefined), 0% recall, and 0% F1.
- Macro-F1 on a 1000-class dataset can be heavily influenced by classes with very few test samples; ensure sufficient samples per class for stable estimates.
- Cohen's Kappa ($\kappa$) adjusts accuracy for chance agreement; $\kappa > 0.8$ is generally considered strong agreement.
- Matthews Correlation Coefficient (MCC) is considered the most balanced metric for binary classification with imbalanced classes: $MCC = \frac{TP \cdot TN - FP \cdot FN}{\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}$.

## Common Misconceptions

- **"Accuracy is the best metric for classification."** Accuracy is only meaningful when classes are balanced and all errors are equally costly. In most real-world applications, neither condition holds.
- **"High AUC means the model is good."** AUC measures ranking ability, not calibration. A model with AUC = 0.99 can still produce poorly calibrated probabilities, leading to bad decisions at any fixed threshold.
- **"F1 score is always the right compromise."** F1 weights precision and recall equally. If false negatives are 10x more costly than false positives (e.g., cancer screening), $F_2$ or a custom cost-weighted metric is more appropriate.

## Connections to Other Concepts

- `image-classification-in-practice.md`: Metric selection is part of production deployment; calibration metrics are essential for reliable confidence scores.
- `detection-metrics.md`: mAP extends precision-recall curves to object detection with IoU thresholds.
- `segmentation-metrics.md`: Pixel-level classification uses IoU and Dice, which are related to precision and recall.
- `benchmark-leaderboards.md`: Standardized metrics enable fair comparison across methods and papers.

## Further Reading

- Sokolova & Lapalme, "A Systematic Analysis of Performance Measures for Classification Tasks" (2009) -- Comprehensive survey of classification metrics.
- Chicco & Jurman, "The advantages of the Matthews correlation coefficient (MCC) over F1 score and accuracy" (2020) -- Argues for MCC in imbalanced settings.
- Guo et al., "On Calibration of Modern Neural Networks" (2017) -- ECE measurement and calibration methods.
- Flach & Kull, "Precision-Recall-Gain Curves" (2015) -- Alternative to standard PR curves with better interpretability.
