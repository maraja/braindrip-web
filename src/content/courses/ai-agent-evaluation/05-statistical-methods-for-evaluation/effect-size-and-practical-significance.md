# Effect Size and Practical Significance

**One-Line Summary**: Statistical significance tells you whether a difference is real; effect size and practical significance tell you whether it matters -- a distinction that prevents wasted deployments and missed opportunities.

**Prerequisites**: `sample-size-and-power-analysis.md`, `confidence-intervals-for-agent-metrics.md`

## What Is Effect Size and Practical Significance?

Imagine a pharmaceutical trial finds that a new drug lowers blood pressure by 0.5 mmHg with $p < 0.001$. The effect is "statistically significant" but clinically meaningless -- no doctor would prescribe it. Conversely, a trial finding a 15 mmHg reduction with $p = 0.08$ (not significant) should not be dismissed; the sample was probably just too small. This distinction between statistical and practical significance is one of the most important -- and most frequently ignored -- concepts in agent evaluation.

In the agent evaluation context, practical significance asks: "Given the costs of deploying this new agent version (re-testing, migration, risk), does the observed improvement justify the effort?" A 2% improvement in benchmark accuracy that is statistically significant ($p = 0.03$) may not warrant the operational overhead of a deployment. Meanwhile, a 10% improvement that fails to reach significance ($p = 0.12$) because of limited evaluation budget may represent a genuinely important advance that deserves further investigation.

Effect size measures quantify the magnitude of a difference on a standardized scale, independent of sample size. They answer "how big is the difference?" rather than "is there a difference?" -- and for decision-making, magnitude almost always matters more than mere existence.

## How It Works

### Cohen's h for Proportion Differences

When comparing binary success rates -- the most common agent evaluation setting -- Cohen's $h$ measures effect size on the arcsine-transformed scale:

$$h = 2\arcsin\sqrt{p_1} - 2\arcsin\sqrt{p_2}$$

This transformation stabilizes variance across the range of proportions. Conventional benchmarks:

| $|h|$ | Interpretation | Example |
|-------|---------------|---------|
| 0.20 | Small effect | 70% vs 73% |
| 0.50 | Medium effect | 70% vs 81% |
| 0.80 | Large effect | 70% vs 90% |

For comparing an agent at $p_1 = 0.75$ and $p_2 = 0.70$:

$$h = 2\arcsin\sqrt{0.75} - 2\arcsin\sqrt{0.70} = 2(1.0472 - 0.9911) = 0.112$$

This is a small effect -- detectable only with large samples and unlikely to be practically important in most contexts.

### Cohen's d for Continuous Metrics

For continuous metrics (cost, latency, trajectory quality scores), Cohen's $d$ standardizes the mean difference by the pooled standard deviation:

$$d = \frac{\bar{X}_1 - \bar{X}_2}{s_p}$$

where:

$$s_p = \sqrt{\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}}$$

Conventional benchmarks: $|d| = 0.2$ (small), $0.5$ (medium), $0.8$ (large). For agent evaluation, these conventions are starting points -- the actual threshold for practical significance depends on the specific application.

### The Cost-Benefit Framework

Practical significance requires a decision-theoretic framework. Define:

- $\Delta p$ = observed improvement in success rate
- $C_{\text{eval}}$ = total evaluation cost to confirm the improvement
- $C_{\text{deploy}}$ = deployment cost (re-testing, migration, risk)
- $V_{\text{task}}$ = value of each successful task completion
- $N_{\text{prod}}$ = expected production volume

The improvement is practically justified if:

$$\Delta p \times V_{\text{task}} \times N_{\text{prod}} > C_{\text{eval}} + C_{\text{deploy}}$$

For example, a 2% improvement on a task worth $\$50$ with 10,000 monthly executions yields $0.02 \times 50 \times 10{,}000 = \$10{,}000$/month in added value. If $C_{\text{eval}} + C_{\text{deploy}} = \$5{,}000$, the improvement pays for itself in two weeks. The same 2% on a task run 100 times/month yields only $\$100$/month -- not worth the deployment cost.

### Minimum Detectable Effect (MDE)

The MDE is the smallest effect size your evaluation can reliably detect given its budget. For a two-proportion z-test:

$$\text{MDE} \approx (z_{\alpha/2} + z_{\beta}) \sqrt{\frac{2p(1-p)}{n}}$$

For $n = 200$, $p = 0.70$, $\alpha = 0.05$, $\beta = 0.20$:

$$\text{MDE} \approx 2.80 \sqrt{\frac{2 \times 0.70 \times 0.30}{200}} \approx 0.091$$

Your evaluation can detect ~9 percentage-point differences but is blind to anything smaller. If the expected improvement is 3-5%, this evaluation design is underpowered. The MDE should be computed before running evaluations and compared against the minimum improvement that would be practically significant.

### Confidence Intervals as Effect Size Communication

A well-constructed confidence interval for the difference communicates both statistical and practical significance simultaneously:

$$(\hat{p}_1 - \hat{p}_2) \pm z_{\alpha/2}\sqrt{\frac{\hat{p}_1(1-\hat{p}_1)}{n_1} + \frac{\hat{p}_2(1-\hat{p}_2)}{n_2}}$$

Overlay this interval on a region of practical significance $[\delta_{\min}, \infty)$:

- If the entire CI is above $\delta_{\min}$: practically and statistically significant.
- If the CI includes $\delta_{\min}$ but excludes 0: statistically significant but uncertain practical significance.
- If the CI includes 0 but the upper bound exceeds $\delta_{\min}$: inconclusive; need more data.
- If the entire CI is below $\delta_{\min}$: the improvement, even if real, is too small to matter.

## Why It Matters

1. **Prevents wasted deployments**: Shipping a statistically significant but trivially small improvement wastes engineering time and introduces deployment risk for negligible gain.
2. **Rescues promising results**: A practically meaningful improvement that fails to reach significance due to small samples should trigger more evaluation investment, not rejection.
3. **Enables rational budget allocation**: The MDE connects evaluation budget to the smallest improvement worth detecting, preventing both over- and under-investment.
4. **Improves communication**: Reporting effect sizes alongside p-values gives stakeholders an intuitive sense of magnitude that p-values alone cannot provide.
5. **Aligns evaluation with business value**: The cost-benefit framework connects statistical results directly to organizational decision-making.

## Key Technical Details

- **Always report both**: p-values and effect sizes serve complementary functions. A significant result with a tiny effect size is noteworthy for different reasons than a significant result with a large effect size.
- **Effect size CI**: Report confidence intervals for effect sizes, not just point estimates. For Cohen's $h$: $\text{SE}(h) \approx \sqrt{1/n_1 + 1/n_2}$.
- **Equivalence testing (TOST)**: To actively demonstrate that two agents are equivalent (not just that you failed to detect a difference), use two one-sided tests. Reject $H_0: |\Delta p| \geq \delta$ if both one-sided tests are significant.
- **Non-inferiority margins**: In many settings, the new agent need not be better -- just not worse by more than $\delta$. Non-inferiority testing uses $H_0: p_{\text{new}} \leq p_{\text{old}} - \delta$ and is more appropriate for regression testing than superiority testing.
- **Domain-specific thresholds**: A 2% improvement on safety metrics may be critically important; a 2% improvement on a convenience metric may be irrelevant. Practical significance thresholds should be metric-specific.

## Common Misconceptions

- **"If it's statistically significant, it's important."** Statistical significance is a function of sample size. With enough data, any non-zero difference becomes significant. A p-value tells you about evidence against the null, not about the magnitude or importance of the effect.
- **"If it's not significant, there's no effect."** Non-significance with low power simply means inconclusive. Calculate the power of your test; if it is below 80% for the effect size of interest, the non-significant result is uninformative.
- **"Cohen's benchmarks (small/medium/large) are universal."** Cohen himself called these benchmarks "a last resort" when domain-specific standards are unavailable. In agent evaluation, a "small" effect on a safety metric may be enormous in practical terms, while a "large" effect on a minor convenience metric may be negligible.
- **"The p-value is the probability the result is due to chance."** The p-value is $P(\text{data} \mid H_0)$, not $P(H_0 \mid \text{data})$. This distinction matters when base rates of true effects vary.

## Connections to Other Concepts

- `sample-size-and-power-analysis.md` -- Power analysis requires specifying the minimum effect size of interest, which should be the MDE aligned with practical significance.
- `confidence-intervals-for-agent-metrics.md` -- CIs for the difference between agents communicate both significance and effect size in a single visual.
- `regression-detection-statistics.md` -- Regression thresholds should be based on practical significance, not arbitrary statistical conventions.
- `stratified-evaluation-design.md` -- Effect sizes may vary dramatically across strata; a practically significant improvement in hard tasks may coexist with no change in easy tasks.
- `../06-cost-quality-latency-tradeoffs/cost-of-evaluation.md` -- The cost-benefit framework ties effect size directly to evaluation economics.

## Further Reading

- "Statistical Power Analysis for the Behavioral Sciences" -- Jacob Cohen, 1988
- "The Earth Is Round (p < .05)" -- Jacob Cohen, 1994
- "Moving to a World Beyond 'p < 0.05'" -- Ronald L. Wasserstein, Allen L. Schirm, Nicole A. Lazar, 2019
- "Testing Statistical Hypotheses of Equivalence and Noninferiority" -- Stefan Wellek, 2010
- "The New Statistics: Why and How" -- Geoff Cumming, 2014
