# Confidence Intervals for Agent Metrics

**One-Line Summary**: Confidence intervals transform meaningless point estimates like "72% success rate" into informative statements like "72% +/- 4.2% (95% CI)," making uncertainty explicit and comparisons honest.

**Prerequisites**: `sample-size-and-power-analysis.md`, `../01-foundations-of-agent-evaluation/what-is-agent-evaluation.md`

## What Is a Confidence Interval for Agent Metrics?

Imagine a weather forecast that says "tomorrow's temperature will be 68 degrees." Now imagine one that says "68 degrees, give or take 3 degrees." The second forecast is far more useful because it communicates uncertainty. Agent evaluation faces the same problem: reporting "our agent scores 72% on SWE-bench" without a confidence interval is like the first forecast -- it sounds precise but conceals how much you actually know.

A confidence interval (CI) provides a range of plausible values for the true performance metric, given the observed data. A 95% CI means that if you repeated the entire evaluation procedure many times, 95% of the resulting intervals would contain the true parameter. For agent evaluation, this is critical because stochastic sampling (temperature > 0), environment variability, and limited task sets all inject noise into observed metrics.

The choice of CI method matters more than most practitioners realize. The standard normal approximation breaks down badly for proportions near 0 or 1 -- exactly where high-performing agents operate. Using the wrong interval can produce impossible results (like a lower bound below 0%) or intervals that are far too narrow, giving false confidence.

## How It Works

### The Wald (Normal Approximation) Interval

The simplest approach uses the Central Limit Theorem:

$$\hat{p} \pm z_{\alpha/2} \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}$$

where $\hat{p}$ is the observed success rate and $n$ is the number of trials. For $\hat{p} = 0.72$ and $n = 200$:

$$0.72 \pm 1.96 \sqrt{\frac{0.72 \times 0.28}{200}} = 0.72 \pm 0.062$$

This gives a 95% CI of $[0.658, 0.782]$. The Wald interval is easy to compute but has well-documented problems: it undercovers (actual coverage < 95%) for small $n$ and extreme $\hat{p}$, and it can produce bounds outside $[0, 1]$.

### The Wilson Score Interval

The Wilson interval inverts the score test and performs substantially better:

$$\frac{\hat{p} + \frac{z^2}{2n} \pm z\sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}}$$

For the same example ($\hat{p} = 0.72$, $n = 200$, $z = 1.96$):

$$\frac{0.72 + 0.0096 \pm 1.96\sqrt{0.001008 + 0.0000240}}{1 + 0.0192} \approx [0.654, 0.779]$$

The Wilson interval is always contained in $[0, 1]$, has better coverage properties for small samples, and handles extreme proportions gracefully. It should be the default for agent evaluation.

### The Clopper-Pearson Exact Interval

For conservative guarantees, the Clopper-Pearson interval uses the exact binomial distribution:

$$\left[B\left(\frac{\alpha}{2}; x, n-x+1\right), \; B\left(1-\frac{\alpha}{2}; x+1, n-x\right)\right]$$

where $B(\cdot)$ is the beta distribution quantile function and $x$ is the number of successes. This interval guarantees at least $1-\alpha$ coverage for any true $p$, but it is conservative (often wider than necessary). Use it when you need guaranteed coverage -- for example, in safety-critical evaluations where undercoverage is unacceptable.

### Bootstrap Confidence Intervals for Complex Metrics

Many agent metrics are not simple proportions. Trajectory quality scores, cost efficiency, latency distributions, and composite metrics require more flexible methods. The bootstrap procedure:

1. From your $n$ evaluation results, draw $B$ bootstrap samples (typically $B = 10{,}000$) of size $n$ with replacement.
2. Compute the metric $\hat{\theta}_b$ for each bootstrap sample $b = 1, \ldots, B$.
3. The percentile interval is $[\hat{\theta}_{(\alpha/2)}, \hat{\theta}_{(1-\alpha/2)}]$.

For improved accuracy, use the bias-corrected and accelerated (BCa) bootstrap:

$$\left[\hat{\theta}^*_{(\alpha_1)}, \hat{\theta}^*_{(\alpha_2)}\right]$$

where $\alpha_1$ and $\alpha_2$ are adjusted quantiles accounting for bias $\hat{z}_0$ and acceleration $\hat{a}$:

$$\alpha_1 = \Phi\left(\hat{z}_0 + \frac{\hat{z}_0 + z_{\alpha/2}}{1 - \hat{a}(\hat{z}_0 + z_{\alpha/2})}\right)$$

The BCa bootstrap is the recommended general-purpose method for non-standard agent metrics.

## Why It Matters

1. **Honest reporting**: A 72% score from 50 runs ($\text{CI} = [58\%, 83\%]$) tells a fundamentally different story than 72% from 500 runs ($\text{CI} = [68\%, 76\%]$). Without CIs, these are indistinguishable.
2. **Meaningful comparisons**: Two agents scoring 72% and 68% look different, but if their 95% CIs overlap substantially, you cannot conclude either is better.
3. **Decision support**: Deployment decisions should depend on whether the lower bound of the CI exceeds an acceptable threshold, not whether the point estimate does.
4. **Reproducibility**: CIs make it immediately obvious when a result is based on too little data, incentivizing adequate sample sizes.
5. **Regulatory and publication standards**: As agent evaluation matures, reporting standards increasingly require uncertainty quantification.

## Key Technical Details

- **Wilson vs Wald**: Always prefer Wilson for binary metrics. The Wald interval has actual coverage as low as 85% when nominal is 95%, especially for $n < 100$ or $p > 0.9$.
- **Bootstrap sample count**: Use $B \geq 10{,}000$ for publication-quality CIs. For quick iteration, $B = 2{,}000$ is acceptable.
- **Simultaneous CIs**: When reporting CIs for $k$ metrics simultaneously, apply the Bonferroni correction ($\alpha' = \alpha/k$) or use Scheffe's method to maintain family-wise coverage.
- **Clustered data**: If runs within a task are correlated, use cluster-robust standard errors: $\text{SE}_{\text{cluster}} = \text{SE}_{\text{naive}} \times \sqrt{D}$ where $D = 1 + (m-1)\hat{\rho}$ is the design effect.
- **Reporting format**: Always report: metric name, point estimate, CI bounds, confidence level, sample size, and CI method. Example: "Success rate: 72.0% [67.8%, 76.2%] (95% Wilson CI, $n = 200$)."

## Common Misconceptions

- **"A 95% CI means there's a 95% probability the true value is in this interval."** The true value is fixed; the interval is random. The correct interpretation is that 95% of intervals constructed this way contain the true value. This frequentist nuance matters when making decisions.
- **"Overlapping confidence intervals mean no significant difference."** Two 95% CIs can overlap and the difference can still be statistically significant at $\alpha = 0.05$. The correct approach is to compute a CI for the difference directly: $(\hat{p}_1 - \hat{p}_2) \pm z_{\alpha/2}\sqrt{\text{SE}_1^2 + \text{SE}_2^2}$.
- **"The normal approximation is fine for large samples."** Even at $n = 200$, if $\hat{p} > 0.95$, the Wald interval can have actual coverage below 90%. Always use Wilson or Clopper-Pearson for extreme proportions.
- **"Bootstrap CIs are always more accurate."** The basic percentile bootstrap can have poor coverage for small $n$. Use BCa or studentized bootstrap for reliable results.

## Connections to Other Concepts

- `sample-size-and-power-analysis.md` -- Sample size directly controls CI width; the relationship is $\text{width} \propto 1/\sqrt{n}$.
- `effect-size-and-practical-significance.md` -- CIs naturally encode practical significance: if the entire CI falls above a meaningful threshold, the effect is both statistically and practically significant.
- `variance-decomposition.md` -- Variance components determine which source of uncertainty dominates the CI width.
- `regression-detection-statistics.md` -- CIs for the difference between versions are the foundation of regression detection.
- `../08-evaluation-tooling-and-infrastructure/evaluation-reporting.md` -- Proper CI reporting is a core component of evaluation reports.

## Further Reading

- "Interval Estimation for a Binomial Proportion" -- Lawrence D. Brown, T. Tony Cai, Anirban DasGupta, 2001
- "Approximate Is Better than 'Exact' for Interval Estimation of Binomial Proportions" -- Alan Agresti, Brent A. Coull, 1998
- "Bootstrap Methods and Their Application" -- A.C. Davison, D.V. Hinkley, 1997
- "Better Approximate Confidence Intervals for a Binomial Parameter" -- Robert G. Newcombe, 1998
