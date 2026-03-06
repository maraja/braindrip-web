# Data Cleaning and Preprocessing

**One-Line Summary**: Handling noise, inconsistencies, and formatting issues -- garbage in, garbage out is the first law of ML.

**Prerequisites**: Data types and structures, exploratory data analysis, basic statistics.

## What Is Data Cleaning?

Imagine a chef receiving a delivery of fresh produce. Some tomatoes are bruised, a few onions are mislabeled as garlic, and there is a rock mixed in with the potatoes. No recipe can compensate for rotten ingredients -- the chef must inspect, sort, and prep before cooking. Data cleaning is that prep work: the systematic process of detecting and correcting (or removing) corrupt, inaccurate, and inconsistent records from a dataset so that downstream analysis and modeling operate on reliable inputs.

Formally, data cleaning transforms a raw dataset $D_{\text{raw}}$ into a curated dataset $D_{\text{clean}}$ by applying a sequence of operations -- deduplication, type correction, outlier treatment, noise reduction, and validation -- such that $D_{\text{clean}}$ satisfies predefined quality constraints (completeness, consistency, accuracy, timeliness). The widely cited "80/20 rule" of data science holds that roughly 80% of project time is spent on data preparation, and cleaning is the largest component.

## How It Works

### Detecting and Removing Duplicates

Exact duplicates (identical rows) are straightforward: `df.drop_duplicates()`. Near-duplicates require fuzzy matching. For string fields, Levenshtein distance or Jaccard similarity on token sets can identify records like "John Smith, 123 Main St" and "Jon Smith, 123 Main Street" as likely duplicates.

Key decisions:
- **Which columns define uniqueness?** Two rows may share a name but differ in timestamp -- are they duplicates or repeat events?
- **Which duplicate to keep?** Usually the most recent or most complete record.
- **Scale considerations**: For millions of records, blocking (grouping by a coarse key like zip code) reduces the $O(n^2)$ comparison space.

### Handling Inconsistent Formats

Real-world data arrives in inconsistent formats:

- **Dates**: "2024-03-15", "03/15/2024", "March 15, 2024", "15-Mar-24" all represent the same day. Parse everything into a canonical format (ISO 8601: `YYYY-MM-DD`) using `pd.to_datetime()` with explicit format strings.
- **Strings**: "new york", "New York", "NEW YORK", "NY", "N.Y.C." Standardize casing, strip whitespace, and map abbreviations to canonical forms.
- **Units**: mixing kilometers and miles, Celsius and Fahrenheit, dollars and euros. Always convert to a single unit system and document it.
- **Encoding**: UTF-8 vs. Latin-1 mismatches cause garbled characters. Detect encoding with `chardet` and convert explicitly.

### Outlier Detection and Treatment

Outliers are observations that deviate markedly from the bulk of the data. They are not inherently errors -- a $10 million transaction in a dataset of retail purchases may be legitimate. EDA (see **Exploratory Data Analysis**) identifies them; domain knowledge determines the response.

**Detection methods:**

- **Z-score**: For approximately normal data, flag points where $|z_i| > 3$:

$$z_i = \frac{x_i - \bar{x}}{s}$$

This identifies values more than 3 standard deviations from the mean -- roughly 0.3% of a normal distribution.

- **IQR method**: More robust to non-normal distributions. Compute the interquartile range $\text{IQR} = Q_3 - Q_1$, then flag points below $Q_1 - 1.5 \cdot \text{IQR}$ or above $Q_3 + 1.5 \cdot \text{IQR}$.

- **Modified Z-score**: Uses the median absolute deviation (MAD) instead of mean and standard deviation, making it robust to the very outliers it aims to detect:

$$M_i = \frac{0.6745 \cdot (x_i - \tilde{x})}{\text{MAD}}$$

where $\text{MAD} = \text{median}(|x_i - \tilde{x}|)$.

**Treatment options:**

- **Removal**: Delete the observation. Only appropriate when you are confident it is an error.
- **Winsorization**: Cap extreme values at a chosen percentile (e.g., clip to the 1st and 99th percentiles). Preserves the observation while limiting its influence.
- **Transformation**: Apply a log or square-root transform to compress the range. This is especially effective for right-skewed data (see **Feature Scaling and Normalization**).
- **Separate modeling**: If outliers represent a distinct population (e.g., enterprise vs. consumer users), model them separately.

### Noise Reduction

Noise is random variation that obscures the true signal.

- **Smoothing**: Moving averages or LOESS for time series data.
- **Binning**: Discretize a noisy continuous variable into intervals, replacing individual values with bin means or medians.
- **Rounding**: Sensor data recorded to 12 decimal places may carry meaningful information in only the first 3; truncating reduces noise without losing signal.

### Data Validation

Validation enforces domain constraints:

- **Range checks**: Age $\in [0, 120]$, probability $\in [0, 1]$, temperature $> -273.15°C$.
- **Consistency checks**: If `discharge_date < admission_date`, something is wrong.
- **Referential integrity**: Every `customer_id` in the orders table should exist in the customers table.
- **Schema validation**: Libraries like `pandera` or `great_expectations` let you define expectations programmatically and run them as automated tests.

### A Practical Cleaning Pipeline

A typical cleaning workflow proceeds in this order:

1. **Load and inspect** dtypes, shape, and a sample of rows.
2. **Deduplicate** on appropriate key columns.
3. **Standardize formats** (dates, strings, units).
4. **Correct dtypes** (e.g., cast "42" from string to integer).
5. **Handle missing values** (see **Handling Missing Data** for strategies).
6. **Detect and treat outliers** using the methods above.
7. **Validate** against domain constraints.
8. **Document** every transformation for reproducibility.

## Why It Matters

No model can recover from systematically corrupted inputs. A logistic regression trained on data where "New York" and "new york" are treated as two separate cities will learn spurious coefficients. A neural network trained with outlier-inflated features will have unstable gradients. A time-series model fed dates in mixed formats will misorder events. Cleaning is not glamorous, but it is where the highest-leverage improvements to model performance are found.

## Key Technical Details

- **Cleaning must happen before splitting.** If you deduplicate after splitting, the same record could appear in both train and test sets, causing data leakage (see **Data Splitting and Sampling**).
- **Imputation vs. cleaning**: Cleaning fixes *errors*; imputation fills *gaps*. A temperature reading of -9999 is a sentinel value (cleaning issue), not a missing value.
- **Idempotency**: A well-designed cleaning pipeline produces the same output when run twice on the same input. This is critical for reproducibility.
- **Version your data**: Store raw data immutably and maintain cleaning scripts as code. Never overwrite the original dataset.
- **Monitor data quality in production**: Data drift and schema changes are ongoing threats. Automated validation checks should run on every new data batch.

## Common Misconceptions

- **"Clean data exists in the wild."** It does not. Every real-world dataset has quality issues. The question is not *whether* to clean, but *how much* effort is justified given the project's goals and timeline.
- **"Removing outliers always improves the model."** Removing legitimate extreme values destroys information. A fraud detection model that discards high-value transactions will miss the very events it is designed to catch.
- **"Automated cleaning tools handle everything."** Tools like `pyjanitor` or `cleanlab` accelerate common tasks, but they cannot make domain-specific judgment calls. A tool does not know that a temperature of 451 degrees in a medical dataset is an error while the same value in an industrial furnace dataset is plausible.
- **"Once cleaned, data stays clean."** Data quality degrades over time as source systems change, new edge cases appear, and upstream processes introduce new error modes.

## Connections to Other Concepts

- **Exploratory Data Analysis**: EDA reveals the problems -- duplicates, outliers, inconsistent formats -- that cleaning addresses. Always do EDA before and after cleaning.
- **Data Types and Structures**: Correct type inference is the first step in cleaning. A zip code stored as an integer will lose leading zeros.
- **Handling Missing Data**: Cleaning and imputation are distinct but intertwined processes. Sentinel values like -999 must be converted to proper `NaN` before imputation.
- **Feature Scaling and Normalization**: Outlier treatment during cleaning directly affects scaling. Unaddressed extreme values can dominate min-max normalization.
- **Encoding Categorical Variables**: Inconsistent string formatting (casing, whitespace, abbreviations) inflates cardinality, making encoding harder.

## Further Reading

- Dasu & Johnson, *Exploratory Data Mining and Data Cleaning* (2003) -- Systematic framework for data quality assessment and cleaning strategies.
- Ilyas & Chu, *Data Cleaning* (2019) -- Modern survey covering both classical methods and ML-assisted cleaning.
- Hynes et al., "The Data Linter," *NeurIPS MLSys Workshop* (2017) -- Automated detection of data quality issues in ML pipelines.
