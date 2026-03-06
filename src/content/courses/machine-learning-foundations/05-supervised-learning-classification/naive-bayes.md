# Naive Bayes

**One-Line Summary**: Applying Bayes' theorem with a strong independence assumption -- surprisingly effective despite being "wrong" in theory.

**Prerequisites**: Probability theory, Bayes' theorem, conditional independence, maximum likelihood estimation.

## What Is Naive Bayes?

Imagine a doctor diagnosing a patient. She considers each symptom -- fever, cough, headache -- and mentally updates her belief about the disease. She treats each symptom as independent evidence, even though fever and headache often co-occur. This is essentially what Naive Bayes does: it applies Bayes' theorem to compute the probability of each class, assuming that all features contribute independently.

Formally, given a feature vector $x = (x_1, x_2, \ldots, x_d)$ and a class label $y$, Bayes' theorem states:

$$P(y \mid x) = \frac{P(x \mid y) \, P(y)}{P(x)}$$

The **naive** assumption is that features are conditionally independent given the class:

$$P(x \mid y) = \prod_{j=1}^d P(x_j \mid y)$$

This simplifies the estimation problem from learning a joint distribution over $d$ features to learning $d$ univariate distributions per class. The classification rule becomes:

$$\hat{y} = \arg\max_c \, P(y = c) \prod_{j=1}^d P(x_j \mid y = c)$$

Since $P(x)$ is constant across classes, it drops out of the argmax.

## How It Works

### Estimating the Components

Naive Bayes requires two things:
1. **Class priors** $P(y = c)$: estimated as the fraction of training examples in class $c$.
2. **Likelihoods** $P(x_j \mid y = c)$: estimated differently depending on the feature type, giving rise to different Naive Bayes variants.

### Gaussian Naive Bayes

For continuous features, assume each $P(x_j \mid y = c)$ is Gaussian:

$$P(x_j \mid y = c) = \frac{1}{\sqrt{2\pi \sigma_{jc}^2}} \exp\left(-\frac{(x_j - \mu_{jc})^2}{2\sigma_{jc}^2}\right)$$

where $\mu_{jc}$ and $\sigma_{jc}^2$ are the mean and variance of feature $j$ for class $c$, estimated from the training data. This variant works well when features are roughly bell-shaped but can fail on skewed or multimodal distributions.

### Multinomial Naive Bayes

For count-valued features (e.g., word counts in a document), the multinomial model is appropriate. Given a document represented as word counts $x = (x_1, \ldots, x_d)$:

$$P(x \mid y = c) \propto \prod_{j=1}^d \theta_{jc}^{x_j}$$

where $\theta_{jc} = P(\text{word } j \mid \text{class } c)$ is estimated as:

$$\hat{\theta}_{jc} = \frac{\text{count of word } j \text{ in class } c}{\text{total word count in class } c}$$

This is the standard model for text classification tasks like spam detection and sentiment analysis.

### Bernoulli Naive Bayes

For binary features (word present/absent rather than counts):

$$P(x \mid y = c) = \prod_{j=1}^d \theta_{jc}^{x_j}(1 - \theta_{jc})^{1-x_j}$$

Unlike the multinomial model, Bernoulli NB explicitly penalizes the *absence* of features. For short documents, this distinction matters: a word not appearing in a spam email is itself evidence.

### Laplace Smoothing

If a feature value never appears with a particular class in the training data, $P(x_j \mid y = c) = 0$, which zeroes out the entire product. **Laplace smoothing** (additive smoothing) fixes this:

$$\hat{\theta}_{jc} = \frac{\text{count}(x_j, c) + \alpha}{\text{total count in } c + \alpha \cdot V}$$

where $\alpha > 0$ is the smoothing parameter (typically $\alpha = 1$) and $V$ is the vocabulary size. This ensures no probability is ever exactly zero.

### Working in Log-Space

In practice, multiplying many small probabilities causes numerical underflow. The standard implementation works in log-space:

$$\log P(y = c \mid x) \propto \log P(y = c) + \sum_{j=1}^d \log P(x_j \mid y = c)$$

This turns products into sums, which is both numerically stable and computationally efficient.

### Spam Filtering Example

Consider classifying an email with words $\{$"free", "money", "meeting"$\}$:

1. Compute $\log P(\text{spam}) + \log P(\text{"free"} \mid \text{spam}) + \log P(\text{"money"} \mid \text{spam}) + \log P(\text{"meeting"} \mid \text{spam})$.
2. Compute $\log P(\text{ham}) + \log P(\text{"free"} \mid \text{ham}) + \log P(\text{"money"} \mid \text{ham}) + \log P(\text{"meeting"} \mid \text{ham})$.
3. Predict whichever class has the higher log-posterior.

"Free" and "money" will have high likelihood under spam; "meeting" under ham. The model weighs all evidence and the prior to make a decision.

## Why It Matters

Naive Bayes is the go-to baseline for text classification. It trains in a single pass through the data ($O(nd)$), requires minimal memory, handles high-dimensional sparse features naturally, and works surprisingly well even when the independence assumption is grossly violated. The seminal analysis by Domingos and Pazzani (1997) showed that Naive Bayes can be optimal even when the independence assumption fails, because the argmax only needs the *ranking* of class probabilities to be correct, not the probabilities themselves. This insight reveals a deeper truth: a model can make correct decisions even with incorrect probability estimates.

## Key Technical Details

- **Training complexity**: $O(nd)$ -- a single pass through the data.
- **Prediction complexity**: $O(dc)$ -- compute $d$ likelihoods for each of $c$ classes.
- **Generative model**: Naive Bayes models $P(x, y) = P(x \mid y)P(y)$, unlike discriminative models like logistic regression that model $P(y \mid x)$ directly.
- **Missing features**: Easily handled by simply omitting the missing feature from the product.
- **Incremental learning**: Parameters can be updated online as new data arrives without retraining from scratch.
- **Probability calibration**: Raw probabilities from Naive Bayes tend to be poorly calibrated (pushed toward 0 and 1). Use Platt scaling or isotonic regression if calibrated probabilities are needed.
- **Feature engineering**: Discretizing continuous features (binning) can sometimes improve Multinomial or Bernoulli NB performance by better matching the assumed distribution.

## Common Misconceptions

- **"The independence assumption makes Naive Bayes unreliable."** The independence assumption is almost always violated, yet the classifier often works well. What matters is the rank ordering of posterior probabilities, not their exact values.
- **"Naive Bayes is only for text."** The Gaussian variant works on continuous features, and Bernoulli NB handles binary features. The approach generalizes to any feature type with an appropriate likelihood model.
- **"Naive Bayes gives good probability estimates."** The class predictions are often good, but the probability estimates are typically overconfident. Post-hoc calibration is necessary if you need reliable probability scores.
- **"It cannot handle correlated features at all."** It handles them in the sense that predictions are often still correct. But highly correlated features effectively double-count evidence, which distorts the posterior.

## Connections to Other Concepts

- **Logistic Regression**: Naive Bayes and logistic regression form a generative-discriminative pair. They share the same linear decision boundary form (in log-space), but Naive Bayes estimates parameters via class-conditional densities while logistic regression optimizes the conditional likelihood directly. With sufficient data, logistic regression generally wins.
- **K-Nearest Neighbors**: KNN makes no distributional assumptions but is computationally expensive. Naive Bayes makes strong assumptions but is extremely fast. They are complementary baselines.
- **Multi-Class Classification**: Naive Bayes is natively multiclass -- no need for one-vs-rest or one-vs-one wrappers. The argmax simply extends over all classes.
- **Support Vector Machines**: SVMs optimize a discriminative margin; Naive Bayes optimizes a generative likelihood. In high dimensions with limited data (e.g., text), both can perform well.

## Further Reading

- Domingos, Pazzani, "On the Optimality of the Simple Bayesian Classifier under Zero-One Loss" (1997) -- Explains why Naive Bayes works despite violated assumptions.
- McCallum, Nigam, "A Comparison of Event Models for Naive Bayes Text Classification" (1998) -- Multinomial vs. multivariate Bernoulli for text.
- Manning, Raghavan, Schutze, "Introduction to Information Retrieval" (2008) -- Chapter 13 is an excellent practical treatment of Naive Bayes for text classification.
- Bishop, "Pattern Recognition and Machine Learning" (2006) -- Section 4.2 covers the generative approach and the connection to logistic regression.
