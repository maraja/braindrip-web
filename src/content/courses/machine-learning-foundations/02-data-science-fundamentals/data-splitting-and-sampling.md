# Data Splitting and Sampling

**One-Line Summary**: Train/validation/test splits, stratification, and handling class imbalance -- the foundation of honest evaluation.

**Prerequisites**: Basic probability, data types and structures, exploratory data analysis, introductory machine learning concepts.

## What Is Data Splitting?

Imagine studying for an exam using a textbook. If the exam questions are drawn directly from the textbook, your score reflects memorization, not understanding. To measure genuine comprehension, the exam must contain *new* questions you have never seen. Data splitting enforces this principle for machine learning: by partitioning data into separate subsets for training, tuning, and final evaluation, we estimate how a model will perform on truly unseen data rather than on the examples it memorized.

Formally, given a dataset $D = \{(x_i, y_i)\}_{i=1}^n$, we partition it into disjoint subsets $D_{\text{train}}$, $D_{\text{val}}$, and $D_{\text{test}}$ such that $D_{\text{train}} \cup D_{\text{val}} \cup D_{\text{test}} = D$ and the subsets are pairwise disjoint. The model learns parameters from $D_{\text{train}}$, hyperparameters are tuned using $D_{\text{val}}$, and final generalization performance is estimated on $D_{\text{test}}$.

## How It Works

### Train/Test Split

The simplest scheme: reserve a fraction (commonly 20-30%) of the data for testing and train on the rest. For a dataset of $n$ observations with a test fraction $\alpha$:

$$|D_{\text{test}}| = \lfloor \alpha \cdot n \rfloor, \quad |D_{\text{train}}| = n - |D_{\text{test}}|$$

The split should be random but reproducible (set a random seed). The test set is touched exactly once -- at the very end -- to report final performance.

**Limitation**: A single random split can be unrepresentative, especially with small datasets. One unlucky split might place all hard examples in the test set, giving a pessimistic estimate.

### Train/Validation/Test Split

Adding a validation set separates two concerns:

- **Training set** ($\sim$60-70%): Learn model parameters (weights, coefficients).
- **Validation set** ($\sim$15-20%): Tune hyperparameters (learning rate, regularization strength, tree depth), select among candidate models, and decide when to stop training.
- **Test set** ($\sim$15-20%): Final, unbiased performance estimate. Never use for any decision-making during development.

A common mistake is repeatedly evaluating on the test set during development. Each evaluation leaks information, and the test score becomes an optimistic estimate. The validation set absorbs this iterative feedback loop, preserving the test set's integrity.

### K-Fold Cross-Validation

Cross-validation reduces the variance of the performance estimate by averaging over multiple splits:

1. Partition $D$ into $K$ equal-sized folds $\{F_1, F_2, \ldots, F_K\}$.
2. For each fold $k$: train on $D \setminus F_k$, evaluate on $F_k$.
3. Report the mean and standard deviation of the $K$ performance scores.

$$\text{CV score} = \frac{1}{K} \sum_{k=1}^{K} \mathcal{L}(f_{-k}, F_k)$$

where $f_{-k}$ is the model trained on all folds except fold $k$, and $\mathcal{L}$ is the evaluation metric. Common choices: $K=5$ or $K=10$. Leave-one-out cross-validation (LOOCV) sets $K = n$ -- maximizes training data per fold but is computationally expensive and has high variance.

**Important**: Cross-validation replaces the validation set, not the test set. A held-out test set is still needed for the final evaluation.

### Stratified Splitting

When the target variable is imbalanced (e.g., 95% negative, 5% positive), a random split might produce a test fold with 0% positives by chance. Stratified splitting ensures each subset maintains the same class proportions as the full dataset.

For a binary target with $p$ as the positive class fraction, stratified splitting guarantees:

$$\frac{|D_{\text{train}}^+|}{|D_{\text{train}}|} \approx \frac{|D_{\text{test}}^+|}{|D_{\text{test}}|} \approx p$$

Use `train_test_split(X, y, stratify=y)` in scikit-learn or `StratifiedKFold` for cross-validation. Stratification extends to multi-class and even continuous targets (by binning first).

### Time Series Splitting

Standard random splitting is invalid for time series data because it allows the model to train on future data and predict the past -- a severe form of data leakage.

**Temporal split**: Train on data before time $t$, test on data after $t$. The split respects chronological order: $D_{\text{train}} = \{(x_i, y_i) : t_i < t\}$ and $D_{\text{test}} = \{(x_i, y_i) : t_i \geq t\}$.

**Expanding window cross-validation**: Iteratively grow the training window while always testing on the next time period. Fold 1: train on months 1-6, test on month 7. Fold 2: train on months 1-7, test on month 8. And so on. Scikit-learn provides `TimeSeriesSplit` for this.

### Group Splitting

When observations are grouped (e.g., multiple records per patient, multiple images per photographer), random splitting can place different records from the same group in both train and test sets. If the model learns patient-specific patterns, its test performance is inflated.

**GroupKFold** ensures that all records from a given group appear in the same fold. This produces an honest estimate of performance on *new groups* not seen during training.

### Data Leakage Pitfalls

Data leakage occurs when information from outside the training set improperly influences the model during training:

- **Preprocessing before splitting**: Computing the mean for imputation, the min/max for scaling (see **Feature Scaling and Normalization**), or target statistics for encoding (see **Encoding Categorical Variables**) on the full dataset before splitting leaks test-set information into training.
- **Temporal leakage**: Using future information to predict the past, or features that are only available after the prediction target is determined.
- **Duplicate/near-duplicate leakage**: If the same observation (or a near-duplicate) appears in both train and test sets after data augmentation or fuzzy deduplication failure (see **Data Cleaning and Preprocessing**).
- **Target leakage**: A feature that is a proxy for or derived from the target variable. Example: including "treatment outcome" as a feature when predicting "disease diagnosis," if treatment only occurs after diagnosis.

**Prevention**: Use `sklearn.pipeline.Pipeline` to encapsulate all preprocessing within the cross-validation loop. Every transform that learns from data (scalers, imputers, encoders) must be fit inside the loop.

## Handling Class Imbalance

When one class vastly outnumbers another, models tend to predict the majority class, achieving high accuracy but poor recall on the minority class. EDA (see **Exploratory Data Analysis**) reveals imbalance; the strategies below address it.

### Oversampling the Minority Class

**Random oversampling**: Duplicate minority-class examples at random. Simple but can cause overfitting -- the model memorizes repeated examples.

**SMOTE (Synthetic Minority Oversampling Technique)**: Generates synthetic minority examples by interpolating between existing minority neighbors. For a minority observation $x_i$ and one of its $k$ nearest minority neighbors $x_{nn}$:

$$x_{\text{new}} = x_i + \lambda \cdot (x_{nn} - x_i), \quad \lambda \sim \text{Uniform}(0, 1)$$

SMOTE creates plausible new examples rather than duplicates, reducing overfitting. Variants include Borderline-SMOTE (focuses on examples near the decision boundary) and SMOTE-ENN (combines oversampling with cleaning via edited nearest neighbors).

**Important**: Apply oversampling to the training set only, after splitting. Oversampling before splitting creates duplicate or synthetic examples that appear in both train and test sets.

### Undersampling the Majority Class

**Random undersampling**: Discard majority-class examples to balance counts. Fast but discards potentially useful information.

**Tomek links**: Remove majority-class examples that form Tomek links (nearest-neighbor pairs from different classes), cleaning the decision boundary.

### Algorithmic Approaches

**Class weights**: Most algorithms accept a `class_weight` parameter that scales the loss function. Setting `class_weight='balanced'` in scikit-learn weights each class inversely proportional to its frequency:

$$w_c = \frac{n}{k \cdot n_c}$$

where $n$ is the total sample size, $k$ is the number of classes, and $n_c$ is the count of class $c$. This achieves the effect of resampling without altering the dataset.

**Threshold tuning**: Instead of the default 0.5 decision threshold, optimize the threshold using the validation set to balance precision and recall according to the task's requirements.

## Why It Matters

Every performance number you report -- accuracy, AUC, F1 -- is only as trustworthy as the evaluation protocol. A model evaluated on leaked data, an improperly shuffled time series, or an unrepresentative single split produces numbers that do not generalize. In high-stakes domains (medicine, finance, autonomous driving), misleading evaluation can have real consequences.

## Key Technical Details

- **Test set size**: Must be large enough for statistically meaningful estimates. For binary classification, at least 100-200 positive examples in the test set are needed for a reliable precision estimate.
- **Reproducibility**: Always set a random seed for splits and document it. Use deterministic splitting functions.
- **Nested cross-validation**: For joint hyperparameter tuning and performance estimation, use an outer loop (for evaluation) wrapping an inner loop (for tuning). This prevents the hyperparameter search from overfitting to the evaluation folds.
- **Never resample the test set.** Oversampling and undersampling apply to training data only. The test set must reflect the true data distribution.

## Common Misconceptions

- **"A bigger test set is always better."** A larger test set reduces evaluation variance but shrinks the training set, increasing model variance. The right balance depends on $n$: with 100 million rows, 1% is more than enough for testing; with 500 rows, even 30% is marginal.
- **"Cross-validation eliminates the need for a test set."** Cross-validation estimates generalization performance averaged over folds, but if you use it to select the best model or hyperparameters, the CV score is optimistically biased. A held-out test set is still essential.
- **"Class imbalance always requires oversampling."** Many algorithms handle imbalance well with class weights or appropriate metrics (AUC-ROC instead of accuracy). Oversampling adds complexity and can introduce artifacts, especially with SMOTE on high-dimensional data.
- **"Random splitting is always fine."** It fails for time series, grouped data, and any scenario where observations are not independent and identically distributed.

## Connections to Other Concepts

- `exploratory-data-analysis.md`: EDA reveals class imbalance, temporal structure, and group structure -- all of which determine the splitting strategy.
- `feature-scaling-and-normalization.md`: Scaler parameters must be computed on the training fold only.
- `handling-missing-data.md`: Imputation parameters must be fit on training data only.
- `encoding-categorical-variables.md`: Target encoding must use training-fold targets to avoid leakage.
- `data-cleaning-and-preprocessing.md`: Deduplication should occur before splitting to prevent the same record from appearing in both train and test sets.

## Further Reading

- Hastie, Tibshirani & Friedman, *The Elements of Statistical Learning*, 2nd ed. (2009) -- Chapter 7 covers model assessment and cross-validation with rigorous statistical foundations.
- Chawla et al., "SMOTE: Synthetic Minority Over-sampling Technique," *JAIR* (2002) -- The original SMOTE paper, one of the most cited works in imbalanced learning.
- Kaufman et al., "Leakage in data mining," *TKDD* (2012) -- Comprehensive taxonomy and case studies of data leakage in real ML projects.
