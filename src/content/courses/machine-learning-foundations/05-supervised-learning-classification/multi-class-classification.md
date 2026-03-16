# Multi-Class Classification

**One-Line Summary**: Extending binary classifiers to multiple classes via one-vs-rest, one-vs-one, and native multi-class approaches.

**Prerequisites**: Binary classification, logistic regression, probability basics, evaluation metrics.

## What Is Multi-Class Classification?

Most real-world classification problems have more than two categories: recognizing handwritten digits (10 classes), classifying news articles by topic (dozens of categories), or diagnosing diseases (hundreds of possible conditions). While some algorithms handle multiple classes natively, many of the most powerful classifiers -- logistic regression, SVMs -- are inherently binary. Multi-class classification encompasses the strategies and algorithms for extending binary classifiers to problems with $K > 2$ classes, as well as evaluation frameworks for measuring performance across many categories.

Formally, given input $x \in \mathbb{R}^d$, the goal is to predict $y \in \{1, 2, \ldots, K\}$. A multi-class classifier produces a decision function $f: \mathbb{R}^d \to \{1, \ldots, K\}$, often via $K$ score functions $f_1(x), \ldots, f_K(x)$ with the prediction $\hat{y} = \arg\max_k f_k(x)$.

## How It Works

### One-vs-Rest (OvR) Strategy

The most common reduction from multi-class to binary. For each class $k$:

1. **Construct a binary problem**: label all examples of class $k$ as positive, all others as negative.
2. **Train** a binary classifier $f_k(x)$ that outputs a confidence score.
3. **At prediction time**, compute $f_1(x), \ldots, f_K(x)$ and predict $\hat{y} = \arg\max_k f_k(x)$.

This requires training $K$ binary classifiers. Each classifier sees all $n$ training examples, so the total cost is $K$ times the cost of one binary classifier.

**Advantages**: Simple, parallelizable, uses all data for each classifier.

**Disadvantages**: Class imbalance is inherent -- each binary problem has one class vs. all others combined, which can severely skew the ratio. Score calibration across classifiers can be inconsistent, since each binary model is trained independently and may output scores on different scales.

### One-vs-One (OvO) Strategy

For each pair of classes $(i, j)$:

1. **Construct a binary problem** using only examples from classes $i$ and $j$.
2. **Train** a classifier $f_{ij}(x)$ for this pair.
3. **At prediction time**, each of the $\binom{K}{2}$ classifiers votes for one of its two classes. The class with the most votes wins.

This requires $\binom{K}{2} = K(K-1)/2$ classifiers, each trained on a smaller subset of the data.

**Advantages**: Each classifier trains on a smaller, balanced dataset. Algorithms that scale poorly with $n$ (like kernel SVMs, which are $O(n^2)$ to $O(n^3)$) benefit because each subproblem is much smaller.

**Disadvantages**: The number of classifiers grows quadratically with $K$. For $K = 100$, you need 4,950 classifiers. Voting can produce ties or ambiguous regions where no class has a clear majority.

### Native Multi-Class Methods

Some algorithms handle multiple classes directly without decomposition:

**Softmax Regression (Multinomial Logistic Regression)**:
Assigns a weight vector $w_k$ to each class and computes:

$$P(y = k \mid x) = \frac{e^{w_k^T x}}{\sum_{j=1}^K e^{w_j^T x}}$$

The loss is the categorical cross-entropy:

$$\mathcal{L} = -\frac{1}{n} \sum_{i=1}^n \log P(y = y_i \mid x_i)$$

This is the multi-class generalization of logistic regression and the standard output layer for neural network classifiers.

**Decision Trees**: Natively multiclass. Each leaf stores a class distribution, and the predicted class is the majority class in that leaf. No decomposition needed.

**Naive Bayes**: Natively multiclass. The posterior $P(y = k \mid x)$ is computed for each class, and the argmax is taken.

**K-Nearest Neighbors**: Natively multiclass. The majority vote among $K$ neighbors naturally handles any number of classes.

### Multi-Label Classification

Multi-class classification assigns exactly one label per example. **Multi-label classification** allows multiple labels simultaneously -- for example, a news article can be about both "politics" and "economics."

**Binary Relevance**: Train one binary classifier per label independently. Simple but ignores label correlations. If "politics" and "economics" often co-occur, this approach cannot exploit that relationship.

**Classifier Chains**: Order the labels and train sequentially, where each classifier receives the predictions of all previous classifiers as additional features:

$$P(y_1, y_2, \ldots, y_L \mid x) = \prod_{j=1}^L P(y_j \mid x, y_1, \ldots, y_{j-1})$$

This captures label dependencies but is sensitive to label ordering. Ensemble methods over random orderings can mitigate this.

### Error-Correcting Output Codes (ECOC)

ECOC generalizes OvR and OvO by encoding each class as a binary codeword of length $L$. For each bit position $l$, a binary classifier is trained to distinguish the two groups defined by that bit. At prediction time, each classifier predicts a bit, producing a binary string. The predicted class is the one whose codeword is closest (e.g., Hamming distance) to the predicted string.

If codewords have sufficient Hamming distance between them, the method can correct errors from individual classifiers, similar to error-correcting codes in information theory. A code with minimum distance $d_{\min}$ can correct up to $\lfloor (d_{\min} - 1) / 2 \rfloor$ classifier errors.

### Computational Tradeoffs

| Strategy | Number of Classifiers | Training Data per Classifier | Prediction Cost |
|----------|----------------------|--------------------------|-----------------|
| OvR | $K$ | $n$ (all data) | $O(K \cdot t)$ |
| OvO | $K(K-1)/2$ | $n_i + n_j$ (two classes) | $O(K^2 \cdot t)$ |
| Native (softmax) | 1 | $n$ (all data) | $O(K \cdot d)$ |
| ECOC | $L$ (code length) | $n$ (all data) | $O(L \cdot t + K \cdot L)$ |

where $t$ is the prediction cost of a single binary classifier.

### Evaluation Metrics for Multi-Class

Standard binary metrics (precision, recall, F1) must be adapted for $K > 2$ classes:

**Macro Averaging**: Compute the metric for each class independently, then average:

$$\text{Macro-F1} = \frac{1}{K} \sum_{k=1}^K F1_k$$

This treats all classes equally regardless of their frequency. Rare classes have the same weight as common ones.

**Micro Averaging**: Pool all predictions across classes, then compute the metric globally:

$$\text{Micro-Precision} = \frac{\sum_k TP_k}{\sum_k TP_k + \sum_k FP_k}$$

For single-label multi-class classification, micro-precision, micro-recall, and micro-F1 all equal the overall accuracy.

**Weighted Averaging**: Weight each class's metric by its support (number of true instances):

$$\text{Weighted-F1} = \sum_{k=1}^K \frac{n_k}{n} F1_k$$

**Confusion Matrix**: The $K \times K$ matrix where entry $(i, j)$ is the number of examples with true class $i$ predicted as class $j$. Visualizing this matrix reveals which classes are being confused and guides targeted improvements.

## Why It Matters

Nearly every production classification system is multi-class. Understanding the tradeoffs between decomposition strategies (OvR, OvO) and native methods matters for choosing the right approach based on the algorithm, dataset size, number of classes, and computational budget. Evaluation choices (macro vs. micro averaging) can dramatically change which model appears best, especially with imbalanced class distributions. Selecting the appropriate averaging strategy must reflect the application's priorities.

## Key Technical Details

- **Probability calibration**: OvR and OvO do not naturally produce calibrated probabilities. Platt scaling or isotonic regression can be applied post-hoc.
- **Class imbalance**: Imbalance is amplified in OvR (one class vs. all others). Class weights, SMOTE, or stratified sampling can help.
- **Hierarchical classification**: When classes have a natural hierarchy (e.g., animal taxonomy), hierarchical approaches that classify at each level can be more accurate and efficient than flat multi-class methods.
- **Scalability**: For very large $K$ (thousands of classes), approximate methods like hierarchical softmax or sampled softmax are necessary.

## Common Misconceptions

- **"OvR always outperforms OvO."** OvO can be better for algorithms like SVMs where the $O(n^2)$ training cost means smaller subproblems are much cheaper. The answer depends on the algorithm and dataset.
- **"Accuracy is sufficient for multi-class evaluation."** Accuracy hides performance on minority classes. A model predicting the majority class 90% of the time achieves 90% accuracy even if it fails completely on other classes.
- **"Multi-class and multi-label are the same."** Multi-class assigns one label per example; multi-label assigns zero or more. They require different algorithms and evaluation metrics.
- **"Softmax probabilities are always well-calibrated."** Softmax outputs are often overconfident, especially in deep networks. Temperature scaling is a common fix.

## Connections to Other Concepts

- `logistic-regression.md`: Softmax regression is the natural multi-class extension. OvR with logistic regression is an alternative that sometimes performs comparably.
- `support-vector-machines.md`: SVMs are binary by design. OvO is the default multi-class strategy in most SVM implementations (e.g., libSVM) because the smaller subproblems exploit SVMs' $O(n^2)$ scaling.
- `decision-trees.md`: Natively multiclass -- each leaf stores a distribution over all classes. No decomposition needed.
- `naive-bayes.md`: Natively multiclass via the posterior over all classes. One of the simplest multi-class classifiers.
- `k-nearest-neighbors.md`: Natively multiclass via majority vote. Ties are more common with many classes; distance weighting helps.

## Further Reading

- Allwein, Schapire, Singer, "Reducing Multiclass to Binary: A Unifying Approach for Margin Classifiers" (2000) -- Unifies OvR, OvO, and ECOC under a single framework.
- Dietterich, Bakiri, "Solving Multiclass Learning Problems via Error-Correcting Output Codes" (1995) -- The original ECOC paper.
- Tsoumakas, Katakis, "Multi-Label Classification: An Overview" (2007) -- Comprehensive survey of multi-label methods.
- Bishop, "Pattern Recognition and Machine Learning" (2006) -- Sections 4.1-4.3 cover multi-class discriminant functions and softmax regression.
