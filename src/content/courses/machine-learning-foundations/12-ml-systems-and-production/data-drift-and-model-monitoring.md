# Data Drift and Model Monitoring

**One-Line Summary**: Detecting when production data diverges from training data -- models degrade silently without monitoring.

**Prerequisites**: Probability distributions, hypothesis testing, model evaluation metrics, ML pipelines.

## What Is Data Drift?

Imagine you trained a weather prediction model using data from temperate climates, and then deployed it in the tropics. The model never saw monsoon patterns during training, so its predictions silently deteriorate. Nobody notices until a costly failure occurs.

Data drift is the phenomenon where the statistical properties of production data diverge from those of the training data over time. Because ML models are fundamentally pattern-matching machines fitted to a training distribution, any shift in that distribution degrades model performance -- often without any explicit error signal. The model keeps producing predictions; they just become increasingly wrong.

## How It Works

### Types of Drift

There are several distinct forms of drift, each with different causes and detection strategies:

**Covariate Shift (Feature Drift)**: The input distribution $P(X)$ changes while the relationship $P(Y|X)$ remains stable. Example: a loan default model trained on applications from 2019 encounters COVID-era applications with very different income and employment patterns. The mapping from features to outcomes hasn't changed, but the model is now operating in an unfamiliar region of feature space.

**Concept Drift**: The relationship $P(Y|X)$ itself changes, even if $P(X)$ stays the same. Example: user click behavior shifts because a competitor launches a new product. The same user profiles now exhibit different behavior.

$$\text{Covariate shift: } P_{\text{train}}(X) \neq P_{\text{prod}}(X), \quad P_{\text{train}}(Y|X) = P_{\text{prod}}(Y|X)$$
$$\text{Concept drift: } P_{\text{train}}(Y|X) \neq P_{\text{prod}}(Y|X)$$

**Label Drift**: The distribution of target values $P(Y)$ changes. Example: fraud rates spike seasonally, so a fraud classifier trained during low-fraud months encounters a different class balance.

**Upstream Data Changes**: Schema changes, broken data pipelines, sensor calibration drift, or changes in how features are computed. These are *data quality* issues rather than distributional drift, but their effect on model performance is identical.

### Drift Detection Methods

**Kolmogorov-Smirnov (KS) Test**: A nonparametric test comparing two distributions. For each feature, compute the maximum difference between the empirical CDFs of the training and production data:

$$D = \sup_x |F_{\text{train}}(x) - F_{\text{prod}}(x)|$$

Reject the null hypothesis (distributions are identical) when $D$ exceeds a critical value determined by sample size and significance level. Works well for continuous features.

**Population Stability Index (PSI)**: Widely used in finance. Partition the feature range into bins, then compute:

$$\text{PSI} = \sum_{i=1}^{k} (p_i^{\text{prod}} - p_i^{\text{train}}) \cdot \ln\!\left(\frac{p_i^{\text{prod}}}{p_i^{\text{train}}}\right)$$

Rules of thumb: PSI < 0.1 indicates no significant shift; 0.1-0.25 indicates moderate drift; > 0.25 indicates major drift requiring investigation.

**KL Divergence**: Measures how one probability distribution diverges from another:

$$D_{KL}(P_{\text{prod}} \| P_{\text{train}}) = \sum_x P_{\text{prod}}(x) \ln\!\left(\frac{P_{\text{prod}}(x)}{P_{\text{train}}(x)}\right)$$

Note that KL divergence is asymmetric and undefined when $P_{\text{train}}(x) = 0$ for any $x$ where $P_{\text{prod}}(x) > 0$. In practice, use smoothed distributions.

### Model Performance Monitoring

Drift detection is a *leading indicator*. The *lagging indicator* is actual model performance degradation. Monitor:

- **Prediction distribution**: Are prediction scores shifting? A fraud model that suddenly predicts 0.5 for everything signals a problem.
- **Ground truth metrics** (when labels are available): Track accuracy, precision, recall, AUC over time with sliding windows.
- **Proxy metrics**: When ground truth is delayed (e.g., loan defaults take months), use proxy signals (e.g., early payment behavior).

### Alerting Thresholds

Set alerts at multiple severity levels:
- **Warning**: PSI > 0.1 on any feature, or KS test p-value < 0.05 on multiple features simultaneously.
- **Critical**: PSI > 0.25, or model performance drops below a defined SLA (e.g., AUC < 0.85).
- **Emergency**: Prediction distribution collapses (e.g., >90% of predictions in a single class).

### Retraining Strategies

**Scheduled retraining**: Retrain on a fixed cadence (weekly, monthly). Simple but wasteful if data is stable, and too slow if drift is rapid.

**Triggered retraining**: Retrain when monitoring detects significant drift or performance degradation. More efficient but requires robust monitoring infrastructure.

**Continuous learning**: Incrementally update the model with new data. Suitable for online learning scenarios but risks catastrophic forgetting without careful design.

### Shadow Mode Deployment

Before replacing a production model, deploy the new candidate in *shadow mode*: it receives the same traffic and makes predictions, but those predictions are not served to users. Compare shadow predictions against the current production model to validate improvement before switching.

## Why It Matters

Models degrade silently. Unlike traditional software that throws errors when something breaks, an ML model will happily produce confident but wrong predictions on drifted data. Without monitoring, you discover drift only when business metrics collapse -- weeks or months after the problem began. Production monitoring closes this feedback loop.

## Key Technical Details

- **Window size tradeoff**: Small monitoring windows detect drift quickly but are noisy. Large windows are stable but slow to detect changes. Adaptive windowing methods (e.g., ADWIN) balance this.
- **Multivariate drift**: Testing features independently misses correlations. Consider multivariate tests (e.g., Maximum Mean Discrepancy) for joint distribution shifts.
- **Seasonal patterns**: Not all distribution changes are drift. Some are expected seasonal variation. Build seasonality into your baseline distributions.
- **Reference dataset selection**: Use a representative validation set as the reference distribution, not necessarily the entire training set.

## Common Misconceptions

- **"If accuracy is stable, there's no drift."** Accuracy can be maintained by compensating errors. Feature drift may be present even when aggregate metrics look fine, creating a fragile situation where small additional changes cause sudden collapse.
- **"Retraining on the latest data always fixes drift."** If concept drift has occurred, old model architectures or features may be fundamentally wrong. Sometimes you need to redesign, not just retrain.
- **"Drift detection only matters for real-time systems."** Batch prediction systems are equally vulnerable. A monthly churn prediction model can drift just as badly as a real-time recommendation system.

## Connections to Other Concepts

- **ML Pipelines**: Monitoring systems trigger pipeline re-execution when drift is detected. Data validation stages within pipelines are the first line of defense.
- **A/B Testing for ML**: Drift can confound A/B tests. If the data distribution shifts during a test, measured treatment effects may not be causal.
- **Experiment Tracking**: Monitoring is experiment tracking for production. The same discipline of logging metrics and comparing results applies, just continuously.
- **Model Deployment and Serving**: Canary and shadow deployments are deployment strategies that inherently support monitoring by running models in parallel.

## Further Reading

- Rabanser et al., "Failing Loudly: An Empirical Study of Methods for Detecting Dataset Shift" (2019) -- Comprehensive comparison of drift detection methods.
- Lipton et al., "Detecting and Correcting for Label Shift with Black Box Predictors" (2018) -- Formal treatment of label shift and correction methods.
- Sculley et al., "Hidden Technical Debt in Machine Learning Systems" (2015) -- Frames monitoring as a critical component of ML system maintenance.
