# Sample Size and Power Analysis

**One-Line Summary**: Power analysis determines how many evaluation runs you need to draw statistically valid conclusions about agent performance, balancing rigor against cost.

**Prerequisites**: `../01-foundations-of-agent-evaluation/what-is-agent-evaluation.md`, `confidence-intervals-for-agent-metrics.md`

## What Is Sample Size and Power Analysis?

Imagine you flip a coin 3 times and get 2 heads. Would you conclude the coin is biased? Probably not -- 3 flips is far too few to distinguish bias from luck. Agent evaluation faces the same problem: running an agent on 10 tasks and observing a 70% success rate tells you almost nothing about its true capability. Sample size and power analysis is the statistical framework for answering "how many runs do I actually need?"

Power analysis quantifies the relationship between four interconnected quantities: sample size ($n$), effect size (the difference you want to detect), significance level ($\alpha$, your false positive tolerance), and statistical power ($1 - \beta$, your probability of detecting a real effect). Fix any three, and the fourth is determined. In agent evaluation, we typically fix $\alpha = 0.05$, power $= 0.80$, and the minimum effect size we care about, then solve for the required sample size.

The results are often sobering. Detecting a 5% difference between two agents with reasonable confidence requires hundreds of evaluation runs per agent -- far more than the handful of examples many teams use. This creates a fundamental tension between statistical rigor and the practical cost of running evaluations, especially when each run involves expensive LLM API calls and complex environment setups.

## How It Works

### Power Analysis for Binary Outcomes

Most agent evaluations produce binary outcomes: the agent either completed the task or it didn't. Comparing two agents' success rates is a two-proportion z-test. The required sample size per group is:

$$n = \left(\frac{z_{\alpha/2}\sqrt{2\bar{p}(1-\bar{p})} + z_{\beta}\sqrt{p_1(1-p_1) + p_2(1-p_2)}}{p_1 - p_2}\right)^2$$

where $\bar{p} = (p_1 + p_2)/2$, $z_{\alpha/2} \approx 1.96$ for $\alpha = 0.05$, and $z_{\beta} \approx 0.84$ for 80% power.

For the common scenario of comparing an agent at $p_1 = 0.70$ against one at $p_2 = 0.75$ (a 5 percentage-point difference):

$$n \approx \left(\frac{1.96\sqrt{2 \times 0.725 \times 0.275} + 0.84\sqrt{0.70 \times 0.30 + 0.75 \times 0.25}}{0.05}\right)^2 \approx 780$$

That is approximately 780 tasks per agent to detect a 5% difference with 80% power.

### Variance Near Extreme Proportions

The required sample size depends on where the proportions fall. The variance of a Bernoulli variable is $p(1-p)$, which is maximized at $p = 0.5$ and approaches zero near $p = 0$ or $p = 1$. This means:

- Comparing agents at 50% vs 55%: ~$780$ tasks per agent
- Comparing agents at 90% vs 95%: ~$435$ tasks per agent
- Comparing agents at 10% vs 15%: ~$435$ tasks per agent

As benchmarks saturate (agents approaching 95%+ success), you actually need fewer samples to detect differences -- a small silver lining.

### Minimum Sample Sizes for Common Goals

| Goal | Minimum $n$ | Rationale |
|------|-------------|-----------|
| Rough confidence interval | 30 per task | CLT approximation validity |
| Reliable agent comparison | 100+ per task | Detect ~10% differences |
| Precise comparison (5%) | 780+ per task | 80% power at $\alpha = 0.05$ |
| Near-ceiling discrimination | 400+ per task | Detect 3% differences near $p = 0.95$ |

### The Cost Equation

Every evaluation run has a cost. At $\bar{c}$ dollars per run, the total evaluation budget for comparing two agents is:

$$\text{Budget} = 2 \times n \times k \times \bar{c}$$

where $k$ is the number of distinct tasks and $n$ is runs per task. For $k = 100$ tasks, $n = 30$ runs, and $\bar{c} = \$1$/run, that is $2 \times 30 \times 100 \times 1 = \$6{,}000$ per pairwise comparison. Teams iterating daily face evaluation budgets that dwarf development costs.

### Practical Budget-Sample Trade-offs

The tension between statistical rigor and budget is the central challenge of evaluation design. Consider three realistic scenarios:

**Startup with limited budget ($500/evaluation):** At $\$1$/run, you can afford 500 total runs. Spread across 50 tasks with 5 runs each per agent, you can detect only ~25 percentage-point differences. Strategy: focus on a narrow task set, use paired designs, accept lower power for rapid iteration.

**Mid-size team ($5,000/evaluation):** At $\$1$/run across 100 tasks, you can run 25 trials per agent per task. This detects ~12 percentage-point differences with 80% power. Adequate for comparing meaningfully different agent architectures but insufficient for incremental prompt changes.

**Production evaluation pipeline ($50,000/quarter):** This budget supports rigorous evaluation at scale. Allocate 60% to routine regression testing (high frequency, moderate power) and 40% to deep evaluation studies (low frequency, high power with full variance decomposition).

The optimal allocation between number of tasks $k$ and runs per task $n$ depends on the variance structure. If between-task variance dominates, increase $k$; if within-task variance (model sampling) dominates, increase $n$. See `variance-decomposition.md` for diagnosing which case applies.

## Why It Matters

1. **Prevents false conclusions**: Without adequate sample sizes, teams routinely ship "improvements" that are just noise, or reject real improvements that happened to produce unlucky samples.
2. **Budget planning**: Power analysis lets you estimate evaluation costs before running anything, enabling informed trade-offs between precision and budget.
3. **Benchmarking credibility**: Published results without power analysis or confidence intervals are scientifically incomplete. Reviewers and practitioners increasingly demand sample size justification.
4. **Iterative development**: Understanding the sample/power trade-off lets teams choose faster, lower-power tests for daily iteration and reserve high-power tests for release decisions.

## Key Technical Details

- For paired designs (same tasks, two agents), use McNemar's test: $n = \frac{(z_{\alpha/2} + z_{\beta})^2}{(\text{OR} - 1)^2 \cdot p_d}$ where $p_d$ is the discordant pair proportion. Paired designs can reduce $n$ by 40-60%.
- The continuity correction adds approximately $\frac{1}{\Delta p}$ to the sample size, which matters for small $\Delta p$.
- For multi-agent comparisons, apply Bonferroni correction: use $\alpha' = \alpha / \binom{k}{2}$ for $k$ agents, substantially increasing required $n$.
- Sequential testing (see `regression-detection-statistics.md`) can reduce average sample size by 30-50% when effects are large.
- Cluster effects: if tasks within a domain are correlated, the effective sample size is reduced by the design effect $D = 1 + (m-1)\rho$ where $m$ is cluster size and $\rho$ is intra-cluster correlation.

## Common Misconceptions

- **"30 runs is always enough."** Thirty runs gives you a rough confidence interval for a single agent, but it is woefully insufficient for comparing two agents. Detecting a 5% difference requires an order of magnitude more data.
- **"If the p-value is 0.06, the result is not significant, so the agents are equal."** Absence of evidence is not evidence of absence. A non-significant result with low power simply means the test was inconclusive. Always report power alongside p-values.
- **"We ran the benchmark once and got 72%, so our agent achieves 72%."** A single run conflates agent capability with the specific random seed, API latency, and other stochastic factors. The true performance is a distribution, not a point.
- **"More tasks are always better than more runs per task."** This depends on whether task variance or within-task variance dominates. Variance decomposition (see `variance-decomposition.md`) should guide allocation.

## Connections to Other Concepts

- `confidence-intervals-for-agent-metrics.md` -- CI width is directly determined by sample size; power analysis tells you the $n$ needed for a target CI width.
- `variance-decomposition.md` -- Understanding where variance comes from informs whether to increase tasks, runs, or both.
- `effect-size-and-practical-significance.md` -- Power analysis requires specifying a minimum effect size, which should reflect practical significance, not arbitrary convention.
- `regression-detection-statistics.md` -- Sequential testing methods can achieve the same power with smaller expected sample sizes.
- `../06-cost-quality-latency-tradeoffs/cost-of-evaluation.md` -- The cost equation links statistical rigor directly to evaluation budget.

## Further Reading

- "Statistical Power Analysis for the Behavioral Sciences" -- Jacob Cohen, 1988
- "The Design of Experiments" -- Ronald A. Fisher, 1935
- "Sample Size Determination and Power" -- Thomas P. Ryan, 2013
- "Power Analysis and Determination of Sample Size for Covariance Structure Modeling" -- Robert C. MacCallum, Michael W. Browne, Hazuki M. Sugawara, 1996
