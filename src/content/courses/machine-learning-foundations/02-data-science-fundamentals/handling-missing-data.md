# Handling Missing Data

**One-Line Summary**: Deletion, imputation, and model-based approaches -- the strategy depends on why data is missing, not just how much.

**Prerequisites**: Descriptive statistics, probability distributions, data types and structures, exploratory data analysis.

## What Is Missing Data?

Imagine conducting a survey where some respondents skip the income question. The blank answers are not random noise -- wealthy individuals may consider income private, while low-income respondents may feel embarrassed. The *reason* for the blank shapes everything: if you simply ignore those rows, your remaining sample skews toward middle-income respondents, and every statistic you compute is biased. Missing data handling is the art and science of dealing with these gaps without introducing or amplifying bias.

Formally, a dataset $D$ with $n$ observations and $p$ features has a missingness indicator matrix $\mathbf{M} \in \{0, 1\}^{n \times p}$, where $M_{ij} = 1$ if $D_{ij}$ is missing. The distribution of $\mathbf{M}$ -- its relationship to the observed and unobserved values -- determines which handling strategies are valid.

## How It Works

### The Rubin Taxonomy of Missingness

Donald Rubin's 1976 framework classifies missing data into three categories. Understanding which type you face is the single most important step.

**Missing Completely at Random (MCAR)**: The probability of a value being missing is independent of both the observed and missing data:

$$P(M_{ij} = 1) = \alpha \quad \text{(constant)}$$

Example: A sensor fails due to a random power fluctuation, independent of the measurement it would have recorded. MCAR is the most benign case -- complete-case analysis (listwise deletion) yields unbiased estimates, though it reduces sample size.

**Missing at Random (MAR)**: The probability of missingness depends on observed data but not on the missing value itself, conditional on what is observed:

$$P(M_{ij} = 1 \mid D_{\text{obs}}, D_{\text{miss}}) = P(M_{ij} = 1 \mid D_{\text{obs}})$$

Example: Older patients are less likely to complete a digital health survey, but among patients of the same age, missingness is unrelated to the health outcome. MAR is the most common real-world scenario. Imputation methods conditioned on observed variables can correct the bias.

**Missing Not at Random (MNAR)**: The probability of missingness depends on the missing value itself:

$$P(M_{ij} = 1 \mid D_{\text{obs}}, D_{\text{miss}}) \neq P(M_{ij} = 1 \mid D_{\text{obs}})$$

Example: Patients with severe depression are less likely to show up for follow-up assessments -- the very outcome you want to measure determines whether you observe it. MNAR is the hardest case. No imputation method fully corrects the bias without modeling the missingness mechanism explicitly (e.g., Heckman selection models).

### Deletion Methods

**Listwise deletion (complete-case analysis)**: Drop any row with at least one missing value. Simple but wasteful -- if 20 features each have 5% missingness independently, you lose $1 - 0.95^{20} \approx 64\%$ of rows. Valid only under MCAR.

**Pairwise deletion**: For correlation or covariance estimation, use all available pairs. Feature $X_j$ and $X_k$ are compared using only rows where both are observed. This preserves more data but can produce non-positive-definite covariance matrices.

**Column deletion**: Drop a feature entirely if its missingness rate exceeds a threshold (e.g., 60-80%). This is a pragmatic choice when a feature is too sparse to impute reliably.

### Simple Imputation Methods

**Mean imputation**: Replace missing values with the feature's mean $\bar{x}_j$. Fast and simple but reduces variance (all imputed values are identical) and distorts correlations. The feature's standard deviation shrinks, and relationships with other features are attenuated.

**Median imputation**: Replace with the median $\tilde{x}_j$. More robust than mean imputation for skewed distributions or data with outliers (see **Data Cleaning and Preprocessing** for outlier context).

**Mode imputation**: Replace with the most frequent value. The natural choice for categorical features, but problematic when the mode dominates -- it reinforces the majority class.

**Constant imputation**: Fill with a domain-specific default (e.g., 0 for a count feature that is likely zero when unrecorded). Requires domain knowledge to avoid introducing bias.

### Model-Based Imputation

**KNN imputation**: For a missing value in observation $i$, find the $k$ nearest neighbors (using observed features) and impute with the neighbors' mean (or mode for categorical data). Respects local data structure but is $O(n^2)$ in distance computation and sensitive to the choice of $k$ and distance metric. Features should be scaled first (see **Feature Scaling and Normalization**).

**Multivariate Imputation by Chained Equations (MICE)**: Also called iterative imputation. Each feature with missing values is modeled as a function of the other features in a round-robin fashion:

1. Initialize all missing values with simple imputation (e.g., mean).
2. For each feature $j$ with missing values, fit a regression model $x_j = f(x_{-j}) + \epsilon$ using only the rows where $x_j$ is observed.
3. Predict (impute) the missing values of $x_j$ using the fitted model.
4. Repeat steps 2-3 for all features.
5. Iterate until convergence (typically 5-10 rounds).

MICE is the gold standard for MAR data. Scikit-learn provides `IterativeImputer` (experimental) which implements this approach. The choice of inner model matters: linear regression for continuous features, logistic regression or random forests for categorical ones.

**Matrix factorization**: For large, sparse matrices (e.g., recommendation systems), low-rank matrix factorization decomposes the observation matrix as $\mathbf{D} \approx \mathbf{U}\mathbf{V}^T$ where $\mathbf{U} \in \mathbb{R}^{n \times r}$ and $\mathbf{V} \in \mathbb{R}^{p \times r}$ with $r \ll \min(n, p)$. Missing entries are predicted from the low-rank reconstruction.

### Missing Indicator Features

A complementary strategy is to add a binary indicator feature $M_j \in \{0, 1\}$ for each feature $j$ with missing values, where $M_j = 1$ if the original value was missing. This lets the model learn that *the fact of being missing* is itself informative (e.g., a missing credit score may predict default risk). Combine this with any imputation method -- the indicator preserves the missingness signal that imputation overwrites.

### Choosing the Right Approach

| Scenario | Recommended approach |
|---|---|
| MCAR, < 5% missing | Listwise deletion or simple imputation |
| MAR, moderate missingness | MICE or KNN imputation |
| MNAR | Model the missingness mechanism explicitly; add missing indicators |
| Very high missingness (> 60%) | Drop the feature; add a missing indicator if the pattern is informative |
| Production systems | Simple imputation (mean/median) for speed; missing indicators for signal |

## Why It Matters

Missing data is ubiquitous. Medical records have incomplete lab results. Sensor networks have dropout periods. Survey responses have skipped questions. Ignoring the problem (e.g., letting scikit-learn throw an error, or silently dropping rows) introduces bias and reduces statistical power. The choice of strategy directly affects model fairness -- if missingness correlates with a protected attribute (e.g., income is more often missing for minorities), naive deletion amplifies existing disparities.

## Key Technical Details

- **Impute after splitting, never before.** Compute imputation parameters (means, medians, KNN distances) on the training set and apply them to validation and test sets. Otherwise, test-set information leaks into training (see **Data Splitting and Sampling**).
- **Multiple imputation**: Create $m$ imputed datasets (each with different plausible values), fit the model on each, and pool the results. This propagates imputation uncertainty into downstream estimates -- critical for statistical inference, less common in pure prediction tasks.
- **Sentinel values are not missing data.** A value of -999 or "N/A" is a data cleaning problem (see **Data Cleaning and Preprocessing**), not a missingness problem. Convert sentinels to proper `NaN` before imputing.
- **Tree-based models can handle missingness natively.** XGBoost and LightGBM learn optimal split directions for missing values during training, often outperforming explicit imputation.

## Common Misconceptions

- **"Just drop rows with missing values."** Listwise deletion is only unbiased under MCAR, which is rarely verified and even more rarely true. Under MAR or MNAR, it introduces systematic bias.
- **"Mean imputation is harmless."** It artificially reduces variance, distorts the correlation structure, and biases standard errors downward. It is acceptable only as a quick baseline or when missingness is negligible.
- **"More sophisticated imputation always improves results."** If data is MCAR and missingness is below 5%, the difference between mean imputation and MICE is often negligible. Complexity should be proportional to the severity and mechanism of missingness.
- **"Missing data is always a problem."** Sometimes the missingness pattern itself is the signal. In fraud detection, the absence of a phone number may be more predictive than the number itself.

## Connections to Other Concepts

- `exploratory-data-analysis.md`: EDA quantifies missingness rates per feature, identifies patterns (is missingness correlated across features?), and visualizes missing data matrices (using `missingno` library heatmaps).
- `data-cleaning-and-preprocessing.md`: Sentinel values must be converted to `NaN` before imputation. Cleaning and imputation are sequential steps in the same pipeline.
- `feature-scaling-and-normalization.md`: KNN imputation requires scaled features for meaningful distance computation. Imputed values should be scaled alongside observed values.
- `encoding-categorical-variables.md`: Categorical features with missing values need special treatment -- a "missing" category is sometimes the most honest encoding.
- `data-splitting-and-sampling.md`: Imputation parameters must be fit on training data only to avoid leakage.

## Further Reading

- Rubin, *Multiple Imputation for Nonresponse in Surveys* (1987) -- The foundational theoretical framework for missing data mechanisms and multiple imputation.
- van Buuren, *Flexible Imputation of Missing Data*, 2nd ed. (2018) -- Comprehensive and practical guide to MICE and related methods.
- Sterne et al., "Multiple imputation for missing data in epidemiological and clinical research," *BMJ* (2009) -- Accessible introduction to when and how to use multiple imputation in applied research.
