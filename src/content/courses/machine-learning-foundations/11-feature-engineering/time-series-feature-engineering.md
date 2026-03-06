# Time-Series Feature Engineering

**One-Line Summary**: Lags, rolling statistics, seasonality decomposition, and calendar features -- encoding temporal patterns for ML models.

**Prerequisites**: Time-series basics, feature extraction and transformation, cross-validation, autocorrelation, Fourier analysis fundamentals.

## What Is Time-Series Feature Engineering?

Think of predicting tomorrow's temperature. You would naturally consider today's temperature, the trend over the past week, whether it is winter or summer, and whether tomorrow is typically warmer or cooler than today. Each of these intuitions corresponds to a class of time-series features: lags, rolling statistics, seasonal indicators, and trend components.

Time-series feature engineering is the process of transforming a temporally ordered sequence $\{y_1, y_2, \ldots, y_T\}$ (and possibly associated covariates) into a tabular feature matrix suitable for supervised learning. The key constraint is **temporal causality**: every feature computed for time $t$ must use only information available before time $t$. Violating this constraint creates data leakage -- the model appears to perform well in training but fails in production because it had access to future information.

## How It Works

### Lag Features

The most fundamental time-series features are lagged values of the target or covariates:

$$x_t^{(\text{lag-}k)} = y_{t-k}$$

A lag-1 feature gives the model yesterday's value; lag-7 gives the value from the same day last week. For a model predicting $y_t$, common lag sets include:

- **Short-term**: lags 1, 2, 3 (recent momentum)
- **Seasonal**: lag 7 (weekly), lag 30 (monthly), lag 365 (yearly)
- **Domain-specific**: lag 24 for hourly data with daily cycles

The number of lags is a hyperparameter. Too few lags miss important autocorrelation; too many inflate the feature space. The autocorrelation function (ACF) and partial autocorrelation function (PACF) guide lag selection -- significant spikes in the PACF at lag $k$ suggest that lag $k$ carries independent predictive information.

### Rolling and Expanding Window Statistics

Rolling window features capture local trends and volatility by aggregating over a window of recent observations:

$$\text{rolling\_mean}_t(w) = \frac{1}{w} \sum_{i=1}^{w} y_{t-i}$$

$$\text{rolling\_std}_t(w) = \sqrt{\frac{1}{w-1} \sum_{i=1}^{w} (y_{t-i} - \text{rolling\_mean}_t(w))^2}$$

Common rolling statistics include mean, standard deviation, min, max, median, skewness, and quantiles. Multiple window sizes (e.g., 7, 14, 30 days) capture patterns at different time scales.

**Expanding window** statistics use all available history up to time $t$:

$$\text{expanding\_mean}_t = \frac{1}{t-1} \sum_{i=1}^{t-1} y_i$$

These are useful for cumulative metrics (e.g., running average purchase frequency per customer). Critically, rolling and expanding windows must only include past observations -- never include $y_t$ itself.

**Exponentially weighted** statistics place more weight on recent observations:

$$\text{ewm}_t = \alpha \cdot y_{t-1} + (1 - \alpha) \cdot \text{ewm}_{t-1}$$

where $\alpha \in (0, 1)$ is the decay factor. These react faster to recent changes than equal-weight rolling averages.

### Date and Time Decomposition

Raw timestamps contain rich information that must be explicitly extracted:

- **Calendar features**: year, month, day of month, day of week (0=Monday to 6=Sunday), hour, minute, quarter, week of year
- **Binary indicators**: is_weekend, is_month_start, is_month_end, is_quarter_start, is_year_end
- **Holiday indicators**: is_holiday, days_until_next_holiday, days_since_last_holiday (using country-specific holiday calendars)
- **Business features**: is_business_day, trading_day_of_month

These features allow models to capture calendar-driven patterns like higher retail sales on weekends or lower trading volume on Fridays.

### Fourier Features for Seasonality

Cyclic patterns (daily, weekly, yearly) are poorly represented by raw calendar integers because, for instance, day 7 (Sunday) is adjacent to day 1 (Monday), but their integer encoding places them far apart. Fourier features encode periodicity as sine-cosine pairs:

$$\text{sin\_feature}_k = \sin\!\left(\frac{2\pi k \cdot t}{P}\right), \quad \text{cos\_feature}_k = \cos\!\left(\frac{2\pi k \cdot t}{P}\right)$$

where $P$ is the period (e.g., 7 for weekly, 365.25 for yearly) and $k = 1, 2, \ldots, K$ controls the number of harmonics. Using $K$ harmonics with $2K$ features can approximate complex seasonal shapes. Lower $K$ captures smooth seasonality; higher $K$ captures sharp patterns.

The advantage over dummy encoding (one indicator per period unit) is dimensionality: 4 Fourier pairs (8 features) can often capture yearly seasonality that would require 52 weekly dummies.

### Trend Features

Explicit trend features help models capture long-term directional movement:

- **Linear trend**: simply the time index $t$ (or days since a reference date)
- **Piecewise linear trends**: separate slopes for different regimes, with changepoints detected by algorithms like PELT or Prophet
- **Difference features**: $\Delta y_t = y_t - y_{t-1}$ (first difference) removes linear trend; $\Delta^2 y_t = \Delta y_t - \Delta y_{t-1}$ (second difference) removes quadratic trend

Differencing is also the standard technique for making a non-stationary series stationary, which is a prerequisite for many classical time-series models (ARIMA).

### Autocorrelation-Based Features

Features derived from the autocorrelation structure itself:

- **Autocorrelation at lag $k$**: computed over a rolling window, captures how self-similar the series is at different horizons
- **Partial autocorrelation**: the correlation at lag $k$ after removing the effects of shorter lags
- **Entropy measures**: approximate entropy or sample entropy of a recent window, quantifying the regularity/predictability of the series

These meta-features are especially useful in heterogeneous forecasting settings (e.g., forecasting thousands of products) where the temporal dynamics vary across series.

## Why It Matters

Standard ML models (gradient boosting, neural networks) have no inherent concept of time -- they treat each row independently. Time-series feature engineering injects temporal structure into the feature matrix, allowing these powerful models to compete with or surpass specialized time-series methods. In practice, LightGBM with well-engineered time-series features is a dominant approach in forecasting competitions and production systems at major tech companies.

## Key Technical Details

- **Leakage prevention is paramount.** Every feature at time $t$ must be computed using only data from times $< t$. A rolling mean that includes $y_t$ in its window leaks the target.
- Lag features introduce missing values at the beginning of the series (the first $k$ rows for lag $k$). Handle these by trimming the initial rows or imputing with expanding-window statistics.
- Rolling features with large windows (e.g., 365-day rolling mean) smooth out noise but respond slowly to regime changes. Use multiple window sizes to capture both fast and slow dynamics.
- For cross-validation with time-series data, always use **temporal splits** (e.g., walk-forward validation). Random splits violate the temporal ordering assumption and produce overly optimistic evaluations.
- Holiday effects often have asymmetric lead/lag impacts (e.g., sales increase before Christmas but drop immediately after). Include both "days until" and "days since" holiday features.
- When forecasting multiple steps ahead, be aware that lag features for distant horizons require either recursive prediction (using predicted values as inputs) or direct multi-step models.

## Common Misconceptions

- **"Lag-1 is always the most important lag."** In many seasonal series, the seasonal lag (e.g., lag 7 for daily data with weekly patterns) carries more information than lag 1. Always check the ACF.
- **"More rolling window sizes are always better."** Correlated rolling features (e.g., 28-day and 30-day rolling means) add redundancy without new information. Choose window sizes that correspond to meaningful time scales.
- **"Fourier features replace calendar dummies entirely."** Fourier features capture smooth periodic patterns but miss sharp, one-day effects (e.g., New Year's Day). Combine Fourier features with explicit holiday indicators.
- **"You cannot use standard cross-validation for time series."** Correct -- standard $k$-fold cross-validation shuffles data randomly, breaking temporal order. Use walk-forward, expanding window, or sliding window validation instead.

## Connections to Other Concepts

- **Feature Extraction and Transformation**: Time-series feature engineering is a domain-specific application of the general extraction framework, with the added constraint of temporal causality.
- **Feature Selection Methods**: With many lag and rolling features, selection (e.g., permutation importance) is essential to avoid an unwieldy feature set.
- **Handling High-Cardinality Features**: Time-series datasets often include high-cardinality identifiers (store IDs, product IDs) that require specialized encoding alongside temporal features.
- **Automated Feature Engineering**: Tools like tsfresh and Featuretools can automate lag, rolling, and calendar feature generation at scale.
- **Regularization**: The large number of candidate time-series features makes regularization (L1/L2) critical for preventing overfitting.

## Further Reading

- Hyndman and Athanasopoulos, "Forecasting: Principles and Practice" (3rd ed., 2021) -- Comprehensive treatment of time-series decomposition, seasonality, and feature construction.
- Christ et al., "Time Series FeatuRe Extraction on basis of Scalable Hypothesis tests (tsfresh)" (2018) -- Automated extraction of hundreds of time-series features with statistical relevance filtering.
- Januschowski et al., "Criteria for Classifying Forecasting Methods" (2020) -- Surveys ML-based forecasting methods and the feature engineering strategies underpinning them.
