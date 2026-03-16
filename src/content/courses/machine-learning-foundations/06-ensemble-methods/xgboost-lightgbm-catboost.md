# XGBoost, LightGBM, and CatBoost

**One-Line Summary**: Industrial-strength gradient boosting implementations with regularization, histogram binning, and GPU acceleration.

**Prerequisites**: Gradient boosting, decision trees, regularization, loss functions, second-order optimization.

## What Are XGBoost, LightGBM, and CatBoost?

If gradient boosting is the blueprint for a race car, then XGBoost, LightGBM, and CatBoost are three high-performance builds of that car, each engineered with different design philosophies to maximize speed, accuracy, and reliability. They share the same fundamental boosting framework -- sequentially fitting trees to pseudo-residuals -- but diverge dramatically in their tree construction algorithms, data handling strategies, and regularization techniques.

These three libraries have collectively dominated tabular machine learning since 2016, powering the majority of winning solutions on Kaggle and serving as workhorses in production systems across industry.

## How It Works

### XGBoost (eXtreme Gradient Boosting)

Introduced by Tianqi Chen in 2016, XGBoost was the first library to make gradient boosting both fast and scalable.

**Regularized objective.** XGBoost augments the loss with explicit regularization on tree complexity:

$$\mathcal{L}(\phi) = \sum_{i=1}^n L(y_i, \hat{y}_i) + \sum_{t=1}^T \Omega(f_t), \quad \Omega(f) = \gamma J + \frac{1}{2}\lambda \sum_{j=1}^{J} w_j^2$$

where $J$ is the number of leaves, $w_j$ are leaf weights, $\gamma$ penalizes tree complexity (number of leaves), and $\lambda$ is L2 regularization on leaf values. This regularized objective directly combats overfitting -- a critical improvement over Friedman's original formulation.

**Second-order approximation.** XGBoost performs a second-order Taylor expansion of the loss:

$$\mathcal{L}^{(t)} \approx \sum_{i=1}^n \left[g_i f_t(x_i) + \frac{1}{2} h_i f_t^2(x_i)\right] + \Omega(f_t)$$

where $g_i = \partial L / \partial \hat{y}_i$ and $h_i = \partial^2 L / \partial \hat{y}_i^2$ are the first and second derivatives of the loss. This yields a closed-form solution for the optimal leaf weight:

$$w_j^* = -\frac{\sum_{i \in I_j} g_i}{\sum_{i \in I_j} h_i + \lambda}$$

and the corresponding gain for a candidate split:

$$\text{Gain} = \frac{1}{2}\left[\frac{(\sum_{i \in I_L} g_i)^2}{\sum_{i \in I_L} h_i + \lambda} + \frac{(\sum_{i \in I_R} g_i)^2}{\sum_{i \in I_R} h_i + \lambda} - \frac{(\sum_{i \in I} g_i)^2}{\sum_{i \in I} h_i + \lambda}\right] - \gamma$$

**Weighted quantile sketch.** For approximate split finding, XGBoost uses a novel distributed weighted quantile sketch that proposes candidate split points based on the distribution of second-order gradients $h_i$, not uniform quantiles. This ensures more candidates in regions of high curvature.

**Sparsity-aware splitting.** XGBoost assigns a default direction for missing values at each node. During training, it tries both directions and picks the one that maximizes gain, handling missing data without imputation.

**Column block structure.** Data is stored in compressed column (CSC) format with pre-sorted indices. This enables parallel split evaluation across features and efficient cache access patterns.

### LightGBM (Light Gradient Boosting Machine)

Released by Microsoft in 2017, LightGBM prioritizes training speed and memory efficiency, often achieving 10--20x speedups over XGBoost.

**Leaf-wise (best-first) tree growth.** While XGBoost grows trees level-wise (all nodes at the same depth before proceeding deeper), LightGBM grows leaf-wise, always splitting the leaf with the highest gain reduction. This produces asymmetric trees that can achieve lower loss with fewer leaves, though it risks overfitting on small datasets. The `max_depth` parameter constrains this tendency.

**Gradient-based One-Side Sampling (GOSS).** GOSS keeps all instances with large gradients (the most informative for learning) and randomly samples instances with small gradients. Specifically, it keeps the top $a \times 100\%$ instances by gradient magnitude and samples $b \times 100\%$ from the rest, amplifying the sampled instances by factor $\frac{1-a}{b}$ to preserve the data distribution. This reduces computation while maintaining accuracy.

**Exclusive Feature Bundling (EFB).** Features that are rarely non-zero simultaneously (e.g., one-hot encoded features) are bundled into single features. This reduces the effective number of features from $p$ to the number of bundles, dramatically speeding up split finding on high-dimensional sparse data. The bundling problem is NP-hard but approximated greedily.

**Histogram-based splitting.** Instead of evaluating all unique feature values as candidate splits, LightGBM bins continuous features into discrete histograms (default 255 bins). Split finding scans histogram bins rather than individual data points, reducing time complexity from $O(n \cdot p)$ to $O(\text{bins} \cdot p)$ per tree level. The histogram for a sibling node can be computed by subtraction from the parent histogram, halving the work.

### CatBoost (Categorical Boosting)

Developed by Yandex in 2018, CatBoost addresses two subtle but important issues in gradient boosting: target leakage and categorical feature handling.

**Ordered boosting.** Standard gradient boosting computes pseudo-residuals using the same data used to train the current model, introducing a form of target leakage that biases gradient estimates. CatBoost uses **ordered boosting**: for each training example $i$, the model used to compute its residual is trained only on examples that precede $i$ in a random permutation. This requires maintaining multiple models during training but eliminates the conditional shift between training and inference distributions.

**Native categorical handling.** CatBoost replaces standard one-hot or label encoding with **ordered target statistics**. For a categorical feature value $c$ and example $i$, the encoding is:

$$\hat{x}_i^c = \frac{\sum_{j < \sigma(i)} \mathbb{1}[x_j = c] \cdot y_j + a \cdot p}{\sum_{j < \sigma(i)} \mathbb{1}[x_j = c] + a}$$

where $\sigma$ is a random permutation, $a$ is a smoothing parameter, and $p$ is the prior (dataset average). Using only preceding examples in the permutation prevents target leakage. CatBoost also automatically generates feature combinations from categorical features.

**Symmetric (oblivious) trees.** CatBoost uses oblivious decision trees where the same splitting condition is applied to all nodes at each level. This produces balanced trees that are faster to evaluate (important for low-latency serving), act as natural regularizers, and enable efficient CPU and GPU inference.

## Why It Matters

These three libraries have made gradient boosting the dominant paradigm for tabular machine learning. XGBoost democratized high-performance boosting and remains the most widely cited ML library. LightGBM pushed the boundaries of training speed, enabling gradient boosting on datasets with hundreds of millions of rows. CatBoost solved the categorical feature problem and target leakage in a principled way. Together, they handle the vast majority of real-world tabular prediction tasks in both competition and production settings.

## Key Technical Details

- **XGBoost key hyperparameters**: `max_depth` (3--10), `learning_rate` (0.01--0.3), `n_estimators` (100--10000), `reg_alpha` (L1), `reg_lambda` (L2), `subsample`, `colsample_bytree`.
- **LightGBM key hyperparameters**: `num_leaves` (31--255, controls leaf-wise complexity), `learning_rate`, `n_estimators`, `min_child_samples`, `feature_fraction`, `bagging_fraction`.
- **CatBoost key hyperparameters**: `depth` (6--10), `learning_rate`, `iterations`, `l2_leaf_reg`, `random_strength`, `bagging_temperature`.
- **GPU acceleration**: All three support GPU training. XGBoost and CatBoost offer robust GPU implementations; LightGBM's GPU mode uses histogram-based methods that are particularly efficient.
- **Benchmarks**: On most tabular benchmarks, all three achieve comparable accuracy. LightGBM is typically fastest in training. CatBoost often wins when data has many categorical features. XGBoost is the most mature and widely supported.

## Common Misconceptions

- **"XGBoost is always the best choice."** Each library has strengths. LightGBM is faster on large datasets, CatBoost handles categoricals better, and XGBoost has the broadest ecosystem support. The performance differences on accuracy are usually small; the choice often depends on data characteristics and engineering constraints.

- **"Histogram binning loses important information."** With 255 bins, the information loss is negligible for most practical purposes. The massive speedup far outweighs the tiny accuracy cost. Fine-grained features are only affected when the exact split point matters, which is rare.

- **"Leaf-wise growth always overfits."** LightGBM's leaf-wise growth can overfit on small datasets, but with proper `max_depth` and `min_child_samples` constraints, it generalizes well. On large datasets, it often outperforms level-wise growth.

- **"These libraries have replaced all other ML methods."** For tabular data, yes, they dominate. But for images, text, time series, and graph data, deep learning approaches are generally superior. Even for tabular data, simpler models (logistic regression, Random Forests) can be preferable when interpretability or robustness matters more than marginal accuracy gains.

## Connections to Other Concepts

- `gradient-boosting.md`: All three are optimized implementations of Friedman's gradient boosting framework. Understanding the core algorithm is essential before diving into implementation-specific features.
- `adaboost.md`: The historical precursor. XGBoost's regularized objective and second-order approximation can be seen as principled improvements over AdaBoost's exponential loss formulation.
- `random-forests.md`: The main competing ensemble paradigm. Random Forests are simpler to tune and more robust to hyperparameters, while these boosting implementations typically achieve lower error with careful tuning.
- `bagging-and-bootstrap.md`: Subsampling in all three libraries (subsample/bagging_fraction) borrows directly from the bagging framework to introduce stochasticity.
- `stacking-and-blending.md`: These boosting models are the most common base learners in stacking ensembles, often combined with each other and with Random Forests for maximum diversity.

## Further Reading

- Chen and Guestrin, "XGBoost: A Scalable Tree Boosting System" (2016) -- The definitive XGBoost paper describing the regularized objective and systems design.
- Ke et al., "LightGBM: A Highly Efficient Gradient Boosting Decision Tree" (2017) -- Introduces GOSS, EFB, and histogram-based splitting.
- Prokhorenkova et al., "CatBoost: Unbiased Boosting with Categorical Features" (2018) -- Formally analyzes target leakage in gradient boosting and introduces ordered boosting.
- Bentejac et al., "A Comparative Analysis of XGBoost" (2021) -- Thorough empirical comparison of all three libraries across diverse benchmarks.
