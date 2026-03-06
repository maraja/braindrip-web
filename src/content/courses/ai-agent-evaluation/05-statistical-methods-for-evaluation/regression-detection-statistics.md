# Regression Detection Statistics

**One-Line Summary**: Regression detection uses hypothesis testing and sequential analysis to distinguish genuine performance drops from natural variance, balancing fast detection against false alarms.

**Prerequisites**: `sample-size-and-power-analysis.md`, `confidence-intervals-for-agent-metrics.md`, `effect-size-and-practical-significance.md`

## What Is Regression Detection?

Imagine a factory quality inspector who checks products coming off an assembly line. They need to sound the alarm when quality drops, but not every defective item means the machine is broken -- some defects are normal. The challenge is detecting real problems quickly while avoiding false alarms that halt production unnecessarily. Agent regression detection is exactly this problem applied to AI systems.

When you update an agent -- changing the underlying model, modifying prompts, adjusting tool definitions, or altering the orchestration logic -- you need to know whether the new version is worse than the old one. A naive approach compares success rates directly ("old: 74%, new: 71% -- regression!"), but natural variance means a 3% drop can easily occur by chance alone. Regression detection statistics formalize the decision process, controlling both the probability of missing a real regression (Type II error) and the probability of flagging a false one (Type I error).

The practical challenge is speed. In a fast-iteration development cycle, you want to detect regressions with as few evaluation runs as possible. Classical fixed-sample tests require committing to a sample size upfront. Sequential methods -- the workhorse of modern regression detection -- let you evaluate evidence as data arrives, often reaching a decision 30-50% faster.

## How It Works

### Chi-Squared Test for Success Rate Comparison

The most basic approach compares success rates between agent versions using a chi-squared test. Given $n_1$ trials of the old agent with $x_1$ successes and $n_2$ trials of the new agent with $x_2$ successes:

$$\chi^2 = \frac{(x_1 n_2 - x_2 n_1)^2 \cdot (n_1 + n_2)}{n_1 \cdot n_2 \cdot (x_1 + x_2)(n_1 + n_2 - x_1 - x_2)}$$

Reject the null hypothesis of equal rates if $\chi^2 > \chi^2_{1, \alpha}$. For a one-sided test (detecting regression specifically), use $z = \sqrt{\chi^2}$ and compare against $z_\alpha$.

For small samples, Fisher's exact test is preferable:

$$p = \frac{\binom{x_1+x_2}{x_1}\binom{n_1+n_2-x_1-x_2}{n_1-x_1}}{\binom{n_1+n_2}{n_1}}$$

### Sequential Probability Ratio Test (SPRT)

SPRT evaluates evidence continuously as each data point arrives. For binary outcomes, define the log-likelihood ratio after $n$ observations:

$$\Lambda_n = \sum_{i=1}^{n} \log \frac{P(Y_i \mid p = p_1)}{P(Y_i \mid p = p_0)}$$

where $p_0$ is the baseline success rate and $p_1 = p_0 - \delta$ is the regression threshold. For binary outcomes:

$$\Lambda_n = s_n \log\frac{p_1}{p_0} + (n - s_n)\log\frac{1-p_1}{1-p_0}$$

where $s_n$ is the cumulative number of successes. The decision boundaries are:

- **Declare regression** if $\Lambda_n \leq \log\frac{\beta}{1-\alpha}$ (lower boundary $B$)
- **Declare no regression** if $\Lambda_n \geq \log\frac{1-\beta}{\alpha}$ (upper boundary $A$)
- **Continue testing** if $B < \Lambda_n < A$

For $\alpha = 0.05$ and $\beta = 0.20$: $A \approx 2.77$ and $B \approx -1.39$.

SPRT reaches decisions in 30-50% fewer samples than fixed-sample tests on average, making it ideal for expensive agent evaluations.

### CUSUM (Cumulative Sum) for Monitoring

For ongoing monitoring of deployed agents, CUSUM detects shifts in the mean performance over time. Define the cumulative sum:

$$S_n = \max\left(0, S_{n-1} + (\mu_0 - Y_n) - \frac{\delta}{2}\right)$$

where $\mu_0$ is the target performance level and $\delta$ is the minimum shift to detect. Signal an alarm when $S_n > h$, where $h$ is calibrated to control the average run length (ARL) under no-change conditions.

The ARL under the null (no regression) should be set based on your tolerance for false alarms. For daily monitoring with weekly acceptable false alarm rate:

$$\text{ARL}_0 \approx \frac{7}{\alpha_{\text{daily}}}$$

### Multiple Comparison Correction

When monitoring $m$ metrics simultaneously (success rate, cost, latency, safety violations), the family-wise error rate inflates. Corrections include:

- **Bonferroni**: Test each metric at $\alpha' = \alpha/m$. Simple but conservative.
- **Holm-Bonferroni**: Sequentially rejective, uniformly more powerful than Bonferroni.
- **Benjamini-Hochberg (FDR)**: Controls the false discovery rate rather than the family-wise error rate. For 10+ metrics, this is substantially more powerful: $p_{(i)} \leq \frac{i}{m} \cdot \alpha$.

### Choosing Significance Thresholds

The conventional $\alpha = 0.05$ is not universally appropriate:

| Context | Recommended $\alpha$ | Rationale |
|---------|---------------------|-----------|
| Daily development iteration | 0.10 | Fast detection; easy to revert |
| Pre-release validation | 0.05 | Standard balance |
| Safety-critical deployment | 0.01 | Low false negative tolerance |
| Production monitoring | Calibrate via ARL | Control false alarm frequency |

## Why It Matters

1. **Prevents shipping regressions**: Without statistical tests, teams rely on intuition ("it looks about the same"), which systematically fails for small-to-medium regressions.
2. **Enables fast iteration**: Sequential methods let teams make confident ship/no-ship decisions in hours rather than days, directly accelerating development velocity.
3. **Controls false alarms**: A team that cries wolf too often -- flagging noise as regressions -- loses trust in the evaluation system. Formal error control prevents this.
4. **Supports automated pipelines**: CI/CD pipelines for agents need programmatic go/no-go decisions. Statistical tests provide the formal decision rule.

## Key Technical Details

- **One-sided vs two-sided tests**: For regression detection, use one-sided tests ($H_1: p_{\text{new}} < p_{\text{old}}$). Two-sided tests waste power on detecting improvements, which is not the goal during regression testing.
- **SPRT maximum sample size**: Truncated SPRT adds a maximum sample size $N_{\max}$ to guarantee termination. Set $N_{\max}$ to 2-3x the fixed-sample equivalent.
- **Paired vs unpaired**: If both agent versions are evaluated on the same tasks, use McNemar's test for binary outcomes: $\chi^2 = \frac{(b-c)^2}{b+c}$ where $b$ and $c$ are discordant pairs. This substantially increases power.
- **Effect of non-stationarity**: Agent performance can drift over time due to external API changes. Detrend data before applying change-point detection.
- **Combining SPRT with CUSUM**: Use SPRT for version-to-version comparisons and CUSUM for continuous monitoring. They complement each other.

## Common Misconceptions

- **"If the p-value is 0.06, we are safe to ship."** A p-value of 0.06 is weak evidence against the null, not evidence for it. With low power (small $n$), a true 5% regression might easily produce $p = 0.06$. Always report power alongside the p-value.
- **"We tested 15 metrics and found one regression at p < 0.05, so something is wrong."** With 15 independent tests at $\alpha = 0.05$, you expect $0.75$ false positives. A single significant result is entirely consistent with no regression. Apply multiple comparison correction.
- **"Sequential testing lets you peek at the data as much as you want."** SPRT controls error rates for the specific sequential decision boundaries. If you compute a p-value at each step without adjusting, your actual Type I error rate can be 2-4x the nominal level. Use the correct sequential boundaries.
- **"A/B testing methods from web experiments transfer directly to agent evaluation."** Web A/B tests assume IID observations. Agent evaluation runs on the same task are correlated, and tasks vary enormously in difficulty. Account for this structure or risk invalid conclusions.

## Connections to Other Concepts

- `sample-size-and-power-analysis.md` -- Power analysis determines the sample size for fixed-sample regression tests and the expected stopping time for sequential tests.
- `effect-size-and-practical-significance.md` -- The minimum detectable effect should reflect practical significance, not convenience.
- `confidence-intervals-for-agent-metrics.md` -- CIs for the difference between versions provide a complementary view to hypothesis tests.
- `variance-decomposition.md` -- High environment variance inflates the noise floor, requiring larger samples or more stringent variance control.
- `../09-production-evaluation-and-monitoring/online-monitoring.md` -- CUSUM and SPRT are the statistical backbone of production monitoring systems.

## Further Reading

- "Sequential Analysis" -- Abraham Wald, 1947
- "Sequential Tests of Statistical Hypotheses" -- Abraham Wald, 1945
- "Page's Cumulative Sum Charts for Monitoring" -- E.S. Page, 1954
- "Controlling the False Discovery Rate: A Practical and Powerful Approach to Multiple Testing" -- Yoav Benjamini, Yosef Hochberg, 1995
- "Always Valid Inference: Continuous Monitoring of A/B Tests" -- Ramesh Johari, Pete Koomen, Leonid Pekelis, David Walsh, 2017
