# A/B Testing for ML

**One-Line Summary**: Comparing model versions in production with statistical rigor -- offline metrics don't always predict online impact.

**Prerequisites**: Hypothesis testing, confidence intervals, probability distributions, model evaluation metrics.

## What Is A/B Testing for ML?

Imagine you have developed a new recommendation model that achieves 5% better recall on your test set. You deploy it, expecting a revenue increase -- and revenue drops. What happened? The test set did not capture user fatigue, network effects, or the feedback loops that exist in a live system.

A/B testing is the gold standard for measuring the *causal* effect of a model change in production. Users are randomly split into groups: the control group receives predictions from the current model (A), and the treatment group receives predictions from the new model (B). By comparing business metrics between groups, you isolate the effect of the model change from all other confounding factors.

## How It Works

### Why Offline Evaluation Is Not Enough

Offline metrics (accuracy, AUC, RMSE on held-out data) measure how well a model fits historical patterns. But production introduces dynamics that offline evaluation cannot capture:

- **Feedback loops**: A recommendation model influences what users see, which influences future behavior, which influences future training data.
- **User experience effects**: A model might optimize click-through rate but reduce user satisfaction (clickbait problem).
- **System-level interactions**: A new model may increase latency, causing users to abandon the page before seeing predictions.
- **Distribution mismatch**: The test set may not represent the current production distribution.

### A/B Test Design

**Randomization unit**: Users are the most common unit. Randomize at the user level (not request level) to avoid inconsistent experiences. Use a hash of the user ID modulo the number of buckets:

$$\text{bucket}(u) = \text{hash}(u) \mod N$$

This ensures deterministic assignment: the same user always sees the same variant.

**Sample size calculation**: Before launching, compute the required sample size. For a two-sample proportion test:

$$n = \frac{(z_{\alpha/2} + z_{\beta})^2 \cdot 2\hat{p}(1-\hat{p})}{(\delta)^2}$$

where $\hat{p}$ is the baseline proportion, $\delta$ is the minimum detectable effect (MDE), $\alpha$ is the significance level (typically 0.05), and $\beta = 1 - \text{power}$ (typically targeting 80% power).

**Duration**: Run the test long enough to capture weekly cycles (at minimum 1-2 full weeks) and to achieve the required sample size. Stopping early when results "look significant" inflates false positive rates (peeking problem).

### Statistical Significance and Power

**Significance ($\alpha$)**: The probability of declaring a winner when there is no true difference (Type I error). Standard threshold: $\alpha = 0.05$.

**Power ($1-\beta$)**: The probability of detecting a real effect when one exists. Standard target: 80% power. Low power means you will miss real improvements.

**p-value**: The probability of observing a result at least as extreme as the measured difference, assuming no true effect. If $p < \alpha$, reject the null hypothesis.

**Confidence interval**: Report the effect size with uncertainty. A 95% CI of [+0.5%, +2.1%] in conversion rate is far more informative than just "p < 0.05."

### Multiple Testing Correction

When testing multiple metrics simultaneously (click-through rate, conversion rate, revenue, retention), the probability of at least one false positive grows rapidly:

$$P(\text{at least one false positive}) = 1 - (1-\alpha)^m$$

For $m = 20$ metrics at $\alpha = 0.05$: $P = 0.64$ -- a 64% chance of a spurious "win."

**Bonferroni correction**: Divide $\alpha$ by the number of tests: $\alpha_{\text{adj}} = \alpha / m$. Conservative but simple.

**Benjamini-Hochberg (FDR control)**: Rank p-values, compare each to $\frac{i}{m} \cdot \alpha$. Controls the expected *fraction* of false discoveries rather than the probability of *any* false discovery. Less conservative, more appropriate when testing many metrics.

### Interleaving Experiments

For ranking systems (search, recommendations), interleaving is more statistically efficient than A/B testing. Instead of splitting users into groups, *interleave* results from both models into a single ranked list shown to each user. Measure which model's results users prefer by tracking clicks.

Interleaving requires roughly 100x fewer samples than traditional A/B tests to detect the same effect size, because each user serves as their own control.

### Multi-Armed Bandits

Traditional A/B tests allocate traffic equally between variants for the entire experiment. Multi-armed bandits (Thompson Sampling, UCB) dynamically shift traffic toward better-performing variants during the test:

- **Advantage**: Reduces the opportunity cost of sending traffic to inferior variants.
- **Disadvantage**: Complicates statistical inference. Effect size estimates are biased because traffic allocation depends on observed outcomes.
- **Best for**: Scenarios where the cost of serving the inferior variant is high (e.g., pricing optimization) and where you care more about cumulative reward than precise effect estimation.

### Online vs. Offline Metrics Disconnect

Common patterns of disconnect:

| Offline metric | Online metric | What happened |
|----------------|---------------|---------------|
| RMSE improved | Revenue unchanged | Model improved accuracy in low-stakes predictions but not high-value ones |
| AUC improved | Click-through dropped | Model became more confident but less diverse, reducing exploration |
| Loss decreased | User retention dropped | Overfitting to short-term engagement signals at the expense of long-term satisfaction |

## Why It Matters

A/B testing is the only reliable way to measure the *causal* impact of model changes in production. Offline evaluation tells you whether a model is better at pattern matching; A/B testing tells you whether it makes the product better. Companies like Google, Netflix, and Microsoft run thousands of A/B tests annually, and many changes that look promising offline show no effect -- or negative effects -- online.

## Key Technical Details

- **Novelty and primacy effects**: Users may initially engage more (or less) with a new experience simply because it is different. Run tests long enough for these effects to wash out.
- **Network effects and interference**: If users interact with each other (social platforms), treating one user may affect control users, violating the stable unit treatment value assumption (SUTVA). Solutions include cluster randomization.
- **Guardrail metrics**: Define metrics that must *not* degrade (e.g., page load time, crash rate). A model that improves revenue but increases crashes is not a win.
- **Sequential testing**: Methods like always-valid p-values allow continuous monitoring of test results without inflating false positive rates.

## Common Misconceptions

- **"Statistical significance means practical significance."** A statistically significant +0.01% improvement in click-through rate may not justify the engineering cost of deploying a new model. Always evaluate effect size, not just p-values.
- **"A/B tests are simple -- just split traffic 50/50."** Proper A/B tests require careful sample size planning, runtime estimation, multiple testing correction, and novelty effect mitigation.
- **"If the p-value is 0.06, the test failed."** The 0.05 threshold is arbitrary. Report confidence intervals and let stakeholders make informed decisions.

## Connections to Other Concepts

- `data-drift-and-model-monitoring.md`: Drift during an A/B test can confound results. Monitor for drift as a diagnostic alongside the test.
- `experiment-tracking.md`: A/B test results should be logged in the experiment tracking system, linking online outcomes back to offline model runs.
- `model-deployment-and-serving.md`: A/B tests require serving infrastructure that supports traffic splitting (canary deployment, feature flags).
- `ml-pipelines.md`: Automated pipelines can trigger A/B tests as a deployment gate: train model, evaluate offline, deploy to shadow/canary, then A/B test before full rollout.

## Further Reading

- Kohavi, Tang, and Xu, "Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing" (2020) -- The definitive book on A/B testing at scale.
- Chapelle et al., "Large-Scale Validation and Analysis of Interleaved Search Evaluation" (2012) -- Foundational work on interleaving for ranking systems.
- Johari et al., "Peeking at A/B Tests: Why It Matters and What to Do About It" (2017) -- Rigorous treatment of the peeking problem with solutions.
