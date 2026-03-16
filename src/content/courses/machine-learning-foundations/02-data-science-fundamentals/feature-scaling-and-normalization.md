# Feature Scaling and Normalization

**One-Line Summary**: Standardization, min-max scaling, and robust scaling -- ensuring features contribute equally regardless of their original units.

**Prerequisites**: Descriptive statistics (mean, variance, median, IQR), data types and structures, exploratory data analysis.

## What Is Feature Scaling?

Imagine two runners competing in a triathlon. One segment is measured in kilometers, another in seconds, and a third in calories burned. If you simply added the raw numbers to compute a total score, the segment measured in seconds (values in the thousands) would dominate the one measured in kilometers (values in the tens). To compare fairly, you need to put all three on the same scale. Feature scaling does exactly this for machine learning: it transforms numerical features so that differences in units and magnitudes do not distort the algorithm's behavior.

Formally, feature scaling applies a transformation $\phi: \mathbb{R} \to \mathbb{R}$ to each feature column so that the transformed values occupy a comparable range or distribution. The choice of $\phi$ depends on the data's distribution, the presence of outliers, and the requirements of the downstream algorithm.

## How It Works

### Standardization (Z-Score Normalization)

Standardization centers each feature at zero mean and unit variance:

$$x' = \frac{x - \mu}{\sigma}$$

where $\mu = \frac{1}{n}\sum_{i=1}^n x_i$ is the sample mean and $\sigma = \sqrt{\frac{1}{n-1}\sum_{i=1}^n (x_i - \mu)^2}$ is the sample standard deviation. After transformation, $x'$ has mean $\approx 0$ and standard deviation $\approx 1$.

**When to use**: The default choice for most algorithms. Works well when the feature is approximately normally distributed. Algorithms that assume zero-centered data (PCA, many neural network initializations) benefit directly.

**Limitation**: Sensitive to outliers because both $\mu$ and $\sigma$ are influenced by extreme values.

### Min-Max Normalization

Min-max scaling maps values to a fixed range, typically $[0, 1]$:

$$x' = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$$

To scale to an arbitrary range $[a, b]$:

$$x' = a + \frac{(x - x_{\min})(b - a)}{x_{\max} - x_{\min}}$$

**When to use**: When you need bounded outputs (e.g., pixel values in $[0, 1]$ for image models, features for algorithms that require a specific range like KNN with bounded distance metrics).

**Limitation**: Extremely sensitive to outliers. A single outlier at $x = 10{,}000$ in a feature where most values are in $[0, 100]$ will compress 99.9% of the data into $[0, 0.01]$.

### Robust Scaling

Robust scaling uses the median and interquartile range (IQR), which are resistant to outliers:

$$x' = \frac{x - \tilde{x}}{Q_3 - Q_1}$$

where $\tilde{x}$ is the median, $Q_1$ is the 25th percentile, and $Q_3$ is the 75th percentile.

**When to use**: When the data contains significant outliers that you want to retain (not remove) but do not want to dominate the scaling. Particularly useful after EDA reveals heavy-tailed distributions (see **Exploratory Data Analysis**).

### Log Transformation

For right-skewed data spanning several orders of magnitude (income, population, word frequencies):

$$x' = \log(x + 1)$$

The $+1$ handles zero values. Log transforms compress the upper tail and expand the lower range, often making the distribution more approximately normal.

**When to use**: When the data is log-normally distributed or when the ratio between values matters more than the absolute difference (e.g., the difference between $\$10{,}000$ and $\$20{,}000$ is more meaningful than between $\$1{,}000{,}000$ and $\$1{,}010{,}000$).

### Box-Cox Transformation

A generalized power transformation parameterized by $\lambda$:

$$x'(\lambda) = \begin{cases} \frac{x^{\lambda} - 1}{\lambda} & \text{if } \lambda \neq 0 \\ \ln(x) & \text{if } \lambda = 0 \end{cases}$$

The optimal $\lambda$ is chosen to maximize the log-likelihood of the data being normally distributed. This subsumes the log transform ($\lambda = 0$), square root ($\lambda = 0.5$), and reciprocal ($\lambda = -1$) as special cases.

**Constraint**: Requires $x > 0$. For data with zeros or negative values, use the Yeo-Johnson transformation, which extends Box-Cox to the entire real line.

### Which Algorithms Need Scaling?

| Algorithm | Needs scaling? | Why |
|---|---|---|
| Linear / Logistic regression | Yes (for regularized variants) | L1/L2 penalties compare coefficient magnitudes across features |
| SVM | Yes | Kernel computations depend on feature distances |
| KNN | Yes | Distance metrics ($L^2$, $L^1$) are scale-dependent |
| Neural networks | Yes | Gradient descent converges faster with scaled inputs; batch norm helps but does not eliminate the need |
| Decision trees | No | Splits are based on thresholds within each feature independently |
| Random forests | No | Ensembles of trees inherit scale invariance |
| Gradient-boosted trees (XGBoost, LightGBM) | No | Same reasoning as individual trees |
| Naive Bayes | No | Operates on likelihoods within each feature independently |

### Implementation: Fit on Train, Transform on All

A critical rule: **compute scaling parameters ($\mu$, $\sigma$, $x_{\min}$, $x_{\max}$, etc.) from the training set only**, then apply those same parameters to validation and test sets.

```
scaler.fit(X_train)        # Learn parameters from training data
X_train = scaler.transform(X_train)
X_val = scaler.transform(X_val)     # Use training parameters
X_test = scaler.transform(X_test)   # Use training parameters
```

Fitting on the full dataset before splitting leaks test-set statistics into training, which is a form of data leakage (see **Data Splitting and Sampling**).

## Why It Matters

Without scaling, features measured in large units dominate distance-based and gradient-based computations. A feature ranging from 0 to 1,000,000 will overpower one ranging from 0 to 1, regardless of their actual predictive importance. This manifests as:

- **Slow convergence** in gradient descent: elongated loss surfaces cause oscillations.
- **Biased regularization**: L2 penalty $\lambda \sum w_j^2$ penalizes larger-magnitude weights, which correspond to small-scale features, effectively ignoring features with large scales.
- **Distorted distances**: In KNN, the feature with the largest range monopolizes the distance computation.

## Key Technical Details

- **Standardization does not make data Gaussian.** It shifts the mean to zero and scales variance to one, but the shape of the distribution is unchanged. If normality is required, use Box-Cox or Yeo-Johnson.
- **One-hot encoded features**: Do not scale binary (0/1) columns. They are already on a natural scale, and standardization shifts them off the $\{0, 1\}$ support.
- **Target variable scaling**: For regression, scaling the target can improve training stability. Predictions must be inverse-transformed before evaluation.
- **Scaling in pipelines**: Use `sklearn.pipeline.Pipeline` to bundle scaling with the model. This ensures correct fit/transform behavior during cross-validation.

## Common Misconceptions

- **"Normalization and standardization are the same thing."** Normalization typically refers to min-max scaling (mapping to $[0,1]$), while standardization refers to z-score scaling (zero mean, unit variance). The terms are often used loosely, so always clarify.
- **"All features must be scaled."** Tree-based models are scale-invariant. Scaling them wastes computation and can even hurt interpretability (the original units are more meaningful).
- **"Feature scaling changes the information content."** Linear scaling is a bijective transformation -- no information is gained or lost. The data are rearranged, not altered in substance.
- **"You should always fit the scaler on the full dataset for better estimates."** This leaks information from the test set. Always fit on training data only.

## Connections to Other Concepts

- `exploratory-data-analysis.md`: EDA reveals whether features are skewed (suggesting log or Box-Cox transforms) or contain outliers (suggesting robust scaling).
- `data-cleaning-and-preprocessing.md`: Outlier treatment during cleaning directly affects scaling. Unaddressed extreme values can dominate min-max normalization.
- `data-types-and-structures.md`: Scaling applies only to numerical features. Categorical features require encoding (see **Encoding Categorical Variables**), not scaling.
- `handling-missing-data.md`: Imputed values should be scaled alongside observed values. If using mean imputation, the imputed value equals the training mean, which standardization maps to zero.
- `data-splitting-and-sampling.md`: Scaler parameters must be computed on the training fold only to prevent data leakage.

## Further Reading

- Zheng & Casari, *Feature Engineering for Machine Learning* (2018) -- Practical guide to scaling, transformation, and feature construction.
- Scikit-learn documentation, "Preprocessing data" -- Reference for `StandardScaler`, `MinMaxScaler`, `RobustScaler`, and `PowerTransformer`.
- Box & Cox, "An Analysis of Transformations," *JRSS-B* (1964) -- The original paper introducing the Box-Cox family of power transformations.
