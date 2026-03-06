# Bagging and Bootstrap

**One-Line Summary**: Training multiple models on bootstrapped samples and averaging predictions -- reducing variance through diversity.

**Prerequisites**: Bias-variance tradeoff, decision trees, sampling theory, expected value and variance.

## What Is Bagging?

Imagine you want to estimate the temperature outside. Instead of trusting a single thermometer that might be miscalibrated, you place ten thermometers around your yard and average their readings. Each thermometer has its own quirks (variance), but averaging them cancels out individual errors, giving you a more stable estimate.

Bagging -- short for **Bootstrap AGGregating** -- applies this same logic to machine learning. Introduced by Leo Breiman in 1996, bagging trains multiple instances of a base learner on different random subsets of the training data, then combines their predictions through averaging (regression) or majority voting (classification). The random subsets are generated via **bootstrap sampling**, a statistical resampling technique that draws samples with replacement from the original dataset.

## How It Works

### Bootstrap Sampling

Given a training set $D = \{(x_1, y_1), \ldots, (x_n, y_n)\}$, a bootstrap sample $D^{*}_b$ is formed by drawing $n$ examples uniformly at random **with replacement** from $D$. Because sampling is done with replacement, some examples appear multiple times while others are omitted entirely.

The probability that a specific example is **not** selected in any single draw is:

$$P(\text{not selected in one draw}) = 1 - \frac{1}{n}$$

Over $n$ independent draws, the probability of never being selected is:

$$P(\text{not in bootstrap sample}) = \left(1 - \frac{1}{n}\right)^n \xrightarrow{n \to \infty} \frac{1}{e} \approx 0.368$$

Therefore, each bootstrap sample contains approximately **63.2%** of the unique training examples. The remaining ~36.8% form the **out-of-bag (OOB)** set for that particular bootstrap iteration.

### The Bagging Algorithm

1. For $b = 1, 2, \ldots, B$:
   - Draw a bootstrap sample $D^{*}_b$ of size $n$ from $D$.
   - Train a base learner $\hat{f}_b$ on $D^{*}_b$.
2. Combine predictions:
   - **Regression**: $\hat{f}_{\text{bag}}(x) = \frac{1}{B} \sum_{b=1}^{B} \hat{f}_b(x)$
   - **Classification**: $\hat{f}_{\text{bag}}(x) = \text{argmax}_c \sum_{b=1}^{B} \mathbb{1}[\hat{f}_b(x) = c]$

### Variance Reduction Proof

The core theoretical justification for bagging rests on a fundamental property of averaging. Let $Z_1, Z_2, \ldots, Z_B$ be identically distributed random variables each with variance $\sigma^2$, and let $\rho$ be the pairwise correlation between any two variables. The variance of their average is:

$$\text{Var}\left(\frac{1}{B}\sum_{b=1}^{B} Z_b\right) = \rho \sigma^2 + \frac{1 - \rho}{B} \sigma^2$$

When predictors are perfectly **uncorrelated** ($\rho = 0$), averaging reduces variance by exactly $1/B$. In practice, bagged models are trained on overlapping data, so $\rho > 0$. The second term shrinks with more models, but the first term $\rho\sigma^2$ sets a floor. This is precisely why Random Forests introduce additional randomization to reduce $\rho$ further.

### Out-of-Bag Estimation

Since each bootstrap sample leaves out ~36.8% of the data, we get a free validation mechanism. For each training example $x_i$, we collect predictions only from models whose bootstrap sample did **not** include $x_i$:

$$\hat{f}_{\text{OOB}}(x_i) = \frac{1}{|S_i|} \sum_{b \in S_i} \hat{f}_b(x_i)$$

where $S_i = \{b : (x_i, y_i) \notin D^{*}_b\}$. The OOB error computed across all training examples is nearly identical to leave-one-out cross-validation error, but comes at no additional computational cost.

## Why It Matters

Bagging is one of the most reliable variance-reduction techniques in machine learning. It transforms unstable learners (those with high variance) into stable ensembles without increasing bias appreciably. In practice, bagging is the backbone of Random Forests, one of the most successful algorithms in machine learning history. It also provides built-in error estimation through OOB, eliminating the need for a separate validation set in many scenarios.

## Key Technical Details

- **Base learner choice**: Bagging benefits models with high variance and low bias -- deep, unpruned decision trees are the canonical choice. Linear models gain little from bagging because they are already low-variance.
- **Number of models $B$**: Unlike boosting, bagging does not overfit as $B$ increases. Performance monotonically improves and plateaus. Typical values range from 100 to 500.
- **Computational cost**: Each bootstrap model is independent, making bagging **embarrassingly parallel**. Training scales linearly with the number of processors.
- **Bias preservation**: Bagging does not reduce bias. If each base learner has bias $\beta$, the ensemble also has bias $\beta$ because $E[\frac{1}{B}\sum \hat{f}_b] = E[\hat{f}_b]$.
- **Bootstrap sample size**: While the standard approach draws $n$ samples, sub-bagging (using smaller samples without replacement) can sometimes achieve comparable results with less computation.

## Common Misconceptions

- **"Bagging always improves any model."** Bagging primarily reduces variance. For high-bias models (e.g., shallow trees, linear regression), bagging provides negligible improvement because averaging biased estimators does not remove the bias. The model must be sufficiently complex (low bias, high variance) for bagging to help.

- **"More bagged models always means better performance."** Performance plateaus once variance has been reduced to its floor (the $\rho\sigma^2$ term). Beyond that point, additional models increase computation without improving accuracy.

- **"Bootstrap samples are independent."** The bootstrap samples overlap substantially (~63.2% unique overlap on average), which introduces correlation between the trained models. This correlation limits the variance reduction achievable by averaging.

- **"OOB error is just an approximation."** OOB error has been shown to be asymptotically equivalent to leave-one-out cross-validation. For sufficiently large $B$, it is a highly reliable estimate of generalization error.

## Connections to Other Concepts

- **Random Forests**: Extend bagging by adding random feature selection at each split, further decorrelating the ensemble members and pushing $\rho$ closer to zero.
- **AdaBoost**: Represents the opposite philosophy -- sequential rather than parallel, focusing on bias reduction rather than variance reduction.
- **Gradient Boosting**: Also sequential, but frames the ensemble as gradient descent in function space. Bagging's subsampling idea appears in stochastic gradient boosting.
- **Stacking and Blending**: While bagging combines identical model types, stacking combines diverse model families through a learned meta-model.
- **Bias-Variance Tradeoff**: Bagging is the textbook intervention for the variance side of the tradeoff without increasing bias.

## Further Reading

- Breiman, "Bagging Predictors" (1996) -- The foundational paper introducing the bagging framework and OOB estimation.
- Efron and Tibshirani, "An Introduction to the Bootstrap" (1993) -- Comprehensive treatment of bootstrap methods in statistics.
- Bühlmann and Yu, "Analyzing Bagging" (2002) -- Theoretical analysis proving bagging's variance reduction for unstable learners.
- Hastie, Tibshirani, and Friedman, "The Elements of Statistical Learning" (2009), Chapter 8 -- Rigorous treatment of bagging within the ensemble learning framework.
