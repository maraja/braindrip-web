# Drift Detection and Model Updates

**One-Line Summary**: Agent performance can degrade without any change to your code due to model provider updates, user behavior shifts, and environmental changes -- and detecting these silent regressions requires systematic statistical monitoring of quality distributions over time.

**Prerequisites**: `production-quality-monitoring.md`, `online-vs-offline-evaluation.md`, `../05-statistical-methods-for-evaluation/confidence-intervals-for-agent-metrics.md`

## What Is Drift Detection?

Imagine you own a sailboat that performs perfectly on its first voyage. You change nothing -- same sails, same hull, same rigging. But over the following months, performance subtly degrades. Barnacles accumulate on the hull. Currents shift with the season. The harbor where you dock is reconfigured. Nothing you did caused the change, yet the boat sails slower. AI agents in production face exactly this problem: the world changes around them while their code stays the same.

Drift detection is the practice of continuously monitoring for performance changes that occur without deliberate code modifications. In traditional software, if you do not change the code, behavior does not change. In AI agent systems, this guarantee does not hold. The model behind your API endpoint gets updated. Users begin asking different types of questions. External APIs that your agent depends on change their response formats. Seasonal trends shift the distribution of queries. Any of these can silently degrade agent quality.

The insidious nature of drift is its gradual onset. A sudden failure is easy to detect and diagnose. A 0.5% weekly decline in task completion rate compounds to a 23% decline over a year, yet no single week's change is alarming enough to trigger investigation. Drift detection systems are designed to catch both sudden shifts and these slow, cumulative degradations.

## How It Works

### Sources of Drift

Understanding what causes drift is essential to detecting and responding to it.

**Model provider updates** are the most common and most frustrating source of drift. When your agent calls an LLM API (OpenAI, Anthropic, Google), the model behind that endpoint can change without notice. Providers routinely update model weights, modify safety filters, adjust tokenizers, and deprecate model versions. A GPT-4o update in mid-2024 caused measurable behavior changes for downstream applications despite no version identifier change. These "silent updates" can alter response formatting, reasoning capabilities, refusal patterns, and latency characteristics simultaneously.

**User behavior shifts** occur as your user base evolves. Early adopters tend to be technical and forgiving; mainstream users bring different expectations and query patterns. Seasonal effects are real: a tax preparation agent sees dramatically different query distributions in January versus July. Viral content or media coverage can suddenly drive an influx of users with unfamiliar use cases.

**Environmental changes** affect agents that interact with external systems. APIs deprecate endpoints or change response schemas. Websites that agents scrape redesign their layout. Databases grow, changing query performance characteristics. Regulatory changes alter what information is available or how it must be presented. Each of these can break agent capabilities that worked perfectly the previous week.

**Data distribution changes** are particularly relevant for agents with retrieval components. If the knowledge base grows, shrinks, or shifts in topic distribution, retrieval quality changes. If the embedding model used for retrieval is updated, similarity scores shift, altering which documents are retrieved for which queries.

### Detection Methods

#### Statistical Process Control Charts

Control charts, borrowed from manufacturing quality management, are the workhouse of drift detection. A quality metric (e.g., daily task completion rate) is plotted over time. The center line represents the historical baseline (typically the mean over a stable reference period of 30-60 days). Control limits are set at 2 or 3 standard deviations from the mean.

A single point outside the 3-sigma control limits has less than a 0.3% probability of occurring by chance -- strong evidence of a real shift. The Western Electric rules add sensitivity for subtler patterns: 2 of 3 consecutive points beyond 2 sigma, 4 of 5 beyond 1 sigma, or 8 consecutive points on the same side of the center line all signal drift before a single dramatic violation occurs.

Control charts should be maintained for multiple metrics simultaneously: overall quality score, per-category quality, latency percentiles, cost per interaction, tool call success rates, and safety violation rates.

#### Distribution Comparison Tests

When you need to formally test whether the distribution of a metric has shifted, statistical tests provide rigorous answers.

**The Kolmogorov-Smirnov (KS) test** compares two distributions nonparametrically. It detects any change in shape, location, or spread. For drift detection, compare this week's quality score distribution against a reference period. A KS statistic above 0.1 with p < 0.05 on a sample of 500+ interactions is a reliable drift signal. Its limitation is sensitivity to sample size -- with very large samples, it detects statistically significant but practically meaningless shifts.

**Population Stability Index (PSI)** quantifies how much a distribution has shifted from a baseline. PSI below 0.1 indicates negligible drift. PSI between 0.1 and 0.25 indicates moderate drift warranting investigation. PSI above 0.25 indicates significant drift requiring action. PSI is widely used in financial model monitoring and adapts well to agent quality monitoring.

**Jensen-Shannon Divergence (JSD)** measures the similarity between two probability distributions. Unlike KL divergence, JSD is symmetric and bounded between 0 and 1, making it easier to set thresholds. A JSD above 0.05-0.10 between current and reference quality distributions typically warrants investigation.

#### Automated Regression Detection on Rolling Windows

Rather than comparing fixed time periods, rolling window analysis continuously compares recent performance (e.g., last 24 hours) against a longer baseline (e.g., last 30 days). This approach detects both sudden drops and gradual trends.

Implementation: compute the metric mean and standard deviation over the 30-day baseline. For each new 24-hour window, compute a z-score: (current_mean - baseline_mean) / (baseline_std / sqrt(n)). Z-scores beyond +/- 2.5 trigger alerts. Update the baseline on a weekly or monthly cadence, but only after confirming that the current period is not itself anomalous.

### Response Playbooks

Detection without response is useless. A drift response playbook defines concrete actions for each scenario.

**Immediate rollback** is appropriate when a sudden, severe quality drop is detected (e.g., quality score drops by more than 20% within 24 hours). Roll back to the last known-good model version or configuration. This requires maintaining the ability to pin specific model versions, which not all providers support.

**Evaluator retraining** is needed when drift occurs in user query distribution rather than agent quality. If users are asking fundamentally new types of questions, existing evaluators may score these interactions inaccurately. Retrain or recalibrate LLM-as-judge evaluators using recent production samples with human labels.

**Benchmark updates** are warranted when drift reflects legitimate environmental changes (e.g., a new API version, a redesigned website). Update offline evaluation datasets to reflect the new reality rather than trying to preserve performance on outdated benchmarks.

**Provider communication** is the appropriate response to suspected silent model updates. Contact the model provider, report the observed behavior change, and request information about recent model modifications. Document the incident regardless of the provider's response.

### The Silent Update Problem

Model providers updating models without notification deserves special attention because it is both common and difficult to manage. Practical defenses include:

- Running a fixed set of "canary" prompts against the API daily and tracking response characteristics (length, formatting, key phrases)
- Pinning to specific model version identifiers where available (e.g., `gpt-4o-2024-08-06` rather than `gpt-4o`)
- Maintaining a local evaluation benchmark that runs nightly against the production API
- Subscribing to provider changelogs and status pages for early warning
- Archiving raw API responses to enable forensic comparison when drift is detected

## Why It Matters

1. **Code stability does not guarantee behavior stability**: The traditional software assumption that unchanged code produces unchanged behavior is fundamentally violated in LLM-based systems. Without drift detection, teams operate with a false sense of security.

2. **Silent degradation erodes user trust gradually**: A sudden outage is visible and gets fixed quickly. A slow quality decline persists for weeks or months, during which users form increasingly negative opinions and may permanently abandon the product.

3. **Attribution is impossible without monitoring**: When a user reports that "the agent used to handle this correctly," without drift detection data you have no way to determine when the regression began, what caused it, or whether other capabilities are also affected.

4. **Evaluation suites themselves drift**: If your offline evaluation dataset was curated 6 months ago and user behavior has since shifted, your evaluation is measuring the wrong thing. Drift detection on production data signals when it is time to refresh evaluation benchmarks.

## Key Technical Details

- Control chart baselines should be recalculated every 30-60 days using only periods confirmed to be stable
- The KS test requires a minimum of 200-500 samples per comparison window for reliable results at practical effect sizes
- PSI thresholds: < 0.1 (no action), 0.1-0.25 (investigate), > 0.25 (act immediately)
- Pin model versions wherever API providers support it; avoid using aliases like "latest" or unversioned model names in production
- Canary prompt suites should include 20-50 diverse prompts covering all critical capability areas, run at least daily
- Maintain at least 90 days of historical metric data to support trend analysis and seasonal comparisons
- Drift detection alert latency should target under 4 hours for severe shifts and under 24 hours for moderate trends

## Common Misconceptions

**"We pin our model version, so drift cannot affect us."** Pinning prevents one source of drift (model updates) but not others. User behavior shifts, environmental changes, and upstream API modifications all cause drift regardless of your model version. Pinning is necessary but not sufficient.

**"Drift detection is only relevant for ML models, not rule-based systems."** Any system that interacts with external data sources, APIs, or users is subject to drift. Even a purely rule-based agent that calls external tools will experience drift when those tools change behavior.

**"If our metrics are stable this week, there is no drift."** Short-term stability does not rule out slow drift. A 0.3% weekly decline in quality is invisible in any single week's data but represents a 15% annual decline. Monthly and quarterly trend analysis is essential alongside daily monitoring.

**"Model providers will notify us of changes."** History suggests otherwise. Major providers have made significant model changes with minimal or no advance notification. Treat provider changelogs as a supplement to, not a substitute for, your own drift detection systems.

## Connections to Other Concepts

- `production-quality-monitoring.md` provides the metrics infrastructure that drift detection depends on
- `online-vs-offline-evaluation.md` explains why offline evaluation alone cannot catch drift
- `incident-analysis-and-evaluation-improvement.md` covers the response process when drift detection triggers an alert
- `a-b-testing-for-agents.md` can be used to evaluate proposed fixes for detected drift
- `../05-statistical-methods-for-evaluation/confidence-intervals-for-agent-metrics.md` covers the statistical foundations for control chart design
- `../04-trajectory-and-process-analysis/error-recovery-evaluation.md` may reveal drift-specific failure patterns in agent trajectories

## Further Reading

- "Failing Loudly: An Empirical Study of Methods for Detecting Dataset Shift" -- Rabanser et al., 2019
- "Monitoring Machine Learning Models in Production" -- Sculley et al., 2015
- "Hidden Technical Debt in Machine Learning Systems" -- Sculley et al., 2015
- "Detecting and Correcting for Label Shift with Black Box Predictors" -- Lipton et al., 2018
- "Challenges in Deploying Machine Learning: A Survey of Case Studies" -- Paleyes et al., 2022
