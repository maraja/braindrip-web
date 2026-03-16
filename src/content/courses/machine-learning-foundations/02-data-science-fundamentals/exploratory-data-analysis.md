# Exploratory Data Analysis

**One-Line Summary**: Visualizing distributions, correlations, and anomalies before modeling -- the most undervalued step in the ML pipeline.

**Prerequisites**: Descriptive statistics (mean, median, variance), data types and structures, basic probability.

## What Is Exploratory Data Analysis?

Imagine moving into a new apartment. Before arranging furniture, you walk through every room, check the plumbing, test the outlets, note the cracked tile. You do not blindly shove a couch through the door. Exploratory Data Analysis (EDA) is that walkthrough for your dataset: a systematic, mostly visual investigation that reveals structure, quirks, and potential hazards *before* you commit to any model.

Formally, EDA is the practice of summarizing a dataset's main characteristics using statistical graphics and descriptive statistics, with the goal of generating hypotheses, detecting anomalies, checking assumptions, and guiding feature engineering. The term was popularized by John Tukey in 1977, and his core insight remains: **let the data speak before imposing a model on it**.

## How It Works

### Univariate Analysis

Univariate analysis examines one variable at a time.

**Histograms** partition a continuous variable into bins and count observations per bin. The choice of bin width $h$ matters: too narrow produces noise, too wide obscures structure. Freedman-Diaconis rule sets $h = 2 \cdot \text{IQR} \cdot n^{-1/3}$, where IQR is the interquartile range and $n$ is the sample size.

**Kernel Density Estimation (KDE)** smooths the histogram into a continuous estimate of the probability density:

$$\hat{f}(x) = \frac{1}{n h} \sum_{i=1}^{n} K\left(\frac{x - x_i}{h}\right)$$

where $K$ is a kernel function (commonly Gaussian) and $h$ is the bandwidth. KDE reveals multimodality and skewness more gracefully than histograms.

**Box plots** display the five-number summary (min, Q1, median, Q3, max) and flag outliers beyond $1.5 \times \text{IQR}$ from the quartiles. They are especially useful for comparing distributions across groups.

**Skewness and Kurtosis** quantify distribution shape. Skewness $\gamma_1 = \mathbb{E}\left[\left(\frac{X - \mu}{\sigma}\right)^3\right]$ measures asymmetry: positive skew has a long right tail (e.g., income), negative skew has a long left tail. Kurtosis $\gamma_2 = \mathbb{E}\left[\left(\frac{X - \mu}{\sigma}\right)^4\right] - 3$ measures tail heaviness relative to the normal distribution. High kurtosis signals potential outliers and warns that mean-based statistics may be misleading.

For categorical variables, use **bar charts** (counts per category) and **frequency tables**. Watch for class imbalance -- if one category dominates 95% of observations, stratified splitting becomes essential (see **Data Splitting and Sampling**).

### Bivariate Analysis

Bivariate analysis explores relationships between pairs of variables.

**Scatter plots** display two continuous variables against each other. Look for linear trends, clusters, curved relationships, and heteroscedasticity (variance that changes with the x-axis).

**Pearson correlation** measures linear association:

$$r_{XY} = \frac{\text{Cov}(X, Y)}{\sigma_X \sigma_Y} = \frac{\sum_{i=1}^n (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum(x_i - \bar{x})^2}\sqrt{\sum(y_i - \bar{y})^2}}$$

with $r \in [-1, 1]$. However, Pearson only captures *linear* relationships -- Anscombe's quartet famously demonstrates four datasets with identical $r$ but wildly different structure.

**Spearman rank correlation** $\rho_s$ measures monotonic (not necessarily linear) association by computing Pearson correlation on the rank-transformed data. Use it when variables are ordinal or the relationship is nonlinear but monotonic.

**Correlation matrices** (heatmaps) display all pairwise correlations simultaneously. They quickly surface redundant features (high mutual correlation) and potential multicollinearity issues for linear models.

### Multivariate Analysis

**Pair plots** (scatter plot matrices) extend bivariate analysis to all variable pairs in a grid, with histograms or KDEs along the diagonal. In Seaborn: `sns.pairplot(df, hue='target')` colors by class label, revealing separation (or lack thereof) between classes.

**Dimensionality reduction** via PCA or t-SNE can project high-dimensional data to 2D for visual inspection. If classes form distinct clusters in the projection, simpler models may suffice.

**Grouped statistics**: compute mean, variance, and quantiles conditioned on a categorical variable (e.g., average income by education level). This reveals effect sizes and interaction patterns.

### Identifying Outliers

Outliers demand attention because they can dominate loss functions, inflate variance estimates, and bias model parameters.

- **Visual methods**: box plots, scatter plots with extreme points.
- **Z-score method**: flag observations where $|z_i| = |({x_i - \bar{x}})/{\sigma}| > 3$.
- **IQR method**: flag observations below $Q_1 - 1.5 \cdot \text{IQR}$ or above $Q_3 + 1.5 \cdot \text{IQR}$.
- **Isolation Forest**: an unsupervised model-based approach for multivariate outlier detection.

See **Data Cleaning and Preprocessing** for how to handle outliers once identified.

### Distribution Shapes to Watch For

- **Normal / Gaussian**: symmetric bell curve -- many algorithms assume this.
- **Log-normal**: right-skewed, common in financial data and biological measurements. A log transform often normalizes it.
- **Bimodal / multimodal**: multiple peaks suggest latent subgroups in the data.
- **Uniform**: all values equally likely -- may indicate synthetic or poorly measured data.
- **Heavy-tailed**: extreme values are more probable than a Gaussian would predict. Mean and variance become unreliable summaries.

## Why It Matters

EDA prevents costly modeling mistakes. If you skip it, you might:

1. Train a linear model on a quadratic relationship and wonder why $R^2$ is low.
2. Feed an algorithm data where 30% of a critical feature is missing -- and only discover this after a week of hyperparameter tuning.
3. Miss a data entry error where ages range from 0 to 999.
4. Overlook a feature that perfectly predicts the target (data leakage).
5. Build a model on heavily skewed features without transformation, leading to poor convergence in gradient-based methods.

Tukey said it best: "The greatest value of a picture is when it forces us to notice what we never expected to see."

## Key Technical Details

- **Always plot before computing statistics.** The mean of a bimodal distribution is meaningless despite being mathematically correct.
- **Check for data leakage during EDA.** If a feature correlates suspiciously well ($r > 0.95$) with the target, investigate whether it was derived from the target or is only available at prediction time.
- **Use log-scale axes** for features spanning several orders of magnitude (e.g., income, population). Linear-scale histograms will compress the bulk of the data into a single bin.
- **EDA is iterative.** Initial findings lead to new questions. A bimodal distribution prompts: "What subgroups exist?" A sudden drop in a time series prompts: "Was there a data collection change?"
- **Document your findings.** EDA notebooks should be reproducible artifacts, not throwaway explorations.

## Common Misconceptions

- **"EDA is just making pretty plots."** Visualization is a tool, not the goal. EDA is hypothesis generation and assumption verification. A plot that does not inform a decision is decoration.
- **"Correlation implies causation."** A strong correlation between ice cream sales and drowning deaths reflects a common cause (summer heat), not a causal link. EDA reveals associations; causal claims require experimental design or causal inference methods.
- **"Normal distributions are the default."** Real-world data is rarely Gaussian. Income, survival times, click counts, and neural network activations all follow non-normal distributions. Check rather than assume.
- **"Outliers should always be removed."** An outlier may be an error, a rare but legitimate event, or the most interesting observation in your dataset. The right action depends on domain knowledge.

## Connections to Other Concepts

- `data-types-and-structures.md`: The type of a variable determines which EDA techniques apply -- histograms for continuous, bar charts for categorical, autocorrelation plots for time series.
- `data-cleaning-and-preprocessing.md`: EDA identifies the problems (missing values, outliers, inconsistent formats); cleaning resolves them.
- `feature-scaling-and-normalization.md`: EDA reveals whether features need transformation (e.g., heavy skew suggests log transform) before scaling.
- `handling-missing-data.md`: EDA quantifies missingness patterns -- is it random, or correlated with other variables? This determines the imputation strategy.
- `data-splitting-and-sampling.md`: EDA on the target variable reveals class imbalance, which dictates the splitting strategy.

## Further Reading

- Tukey, *Exploratory Data Analysis* (1977) -- The foundational text that established EDA as a discipline.
- Wickham & Grolemund, *R for Data Science*, 2nd ed. (2023) -- Modern, practical EDA workflow using the tidyverse.
- Few, *Show Me the Numbers*, 2nd ed. (2012) -- Principles of effective quantitative visualization for analytical purposes.
