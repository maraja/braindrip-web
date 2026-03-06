# Meta-Evaluation

**One-Line Summary**: Meta-evaluation evaluates the evaluation itself -- measuring whether your benchmark suite actually discriminates between good and bad agents and has not become a stale, gameable target.

**Prerequisites**: `sample-size-and-power-analysis.md`, `variance-decomposition.md`, `stratified-evaluation-design.md`, `effect-size-and-practical-significance.md`

## What Is Meta-Evaluation?

Imagine using a bathroom scale that always reads 150 pounds regardless of who stands on it. The scale is useless -- not because 150 is wrong for everyone, but because it fails to discriminate. Your agent evaluation suite can suffer the same problem: if every agent scores between 70-75%, the suite is not measuring meaningful differences. Meta-evaluation is the practice of rigorously testing whether your evaluation instruments are actually doing their job.

The concept draws from a long tradition in measurement theory. Just as psychometricians validate tests by checking reliability, validity, and sensitivity, agent evaluation practitioners must verify that their benchmarks detect real performance differences, correlate with real-world outcomes, and resist gaming. Without meta-evaluation, you might spend months optimizing against a benchmark that has decoupled from actual agent quality.

This becomes especially urgent as Goodhart's Law takes hold. When a benchmark becomes a target -- when teams optimize specifically to improve their benchmark score rather than genuine capability -- the benchmark ceases to be a reliable measure of what it originally intended to capture. Meta-evaluation detects this drift before it wastes development effort and misleads stakeholders.

## How It Works

### Sensitivity Analysis

Sensitivity measures whether the evaluation can detect known performance changes. The procedure:

1. **Create synthetic regressions**: Take a known-good agent and deliberately degrade it -- drop tool calls randomly, inject errors into reasoning, reduce context window. Create versions with 5%, 10%, and 20% degradation.
2. **Run the evaluation suite** on both the original and degraded agents.
3. **Compute detection rate**: For each degradation level, what fraction of metrics correctly identifies the regression at significance level $\alpha$?

Define sensitivity formally as:

$$\text{Sensitivity}(\delta) = P(\text{eval detects regression} \mid \text{true regression} = \delta)$$

This is exactly the statistical power of the evaluation at effect size $\delta$. A well-designed suite should achieve:

| Degradation | Target Sensitivity |
|-------------|-------------------|
| 20% regression | $\geq 0.99$ |
| 10% regression | $\geq 0.90$ |
| 5% regression | $\geq 0.70$ |

If your suite cannot detect a 10% regression with 90% probability, it is too noisy or too small to be useful.

### Specificity Analysis

Specificity measures the false alarm rate: how often does the evaluation flag a regression when nothing has changed?

$$\text{Specificity} = P(\text{eval does not flag regression} \mid \text{no regression})$$

Estimate this by running the same agent twice under identical conditions (different random seeds) and measuring how often the comparison test rejects the null:

$$\hat{\text{FPR}} = \frac{\text{number of false alarms}}{B}$$

where $B$ is the number of repeated same-vs-same comparisons. Target: $\text{FPR} \leq \alpha$ (the nominal significance level). If $\alpha = 0.05$ but the observed FPR is 0.15, something is wrong -- likely violated independence assumptions or uncontrolled environment variance.

### Discriminative Power

Beyond binary detection, measure how well the evaluation rank-orders agents. Given $K$ agents with known capability ordering (established via extensive human evaluation), compute:

**Kendall's $\tau$**: Correlation between evaluation ranking and ground-truth ranking:

$$\tau = \frac{(\text{concordant pairs}) - (\text{discordant pairs})}{\binom{K}{2}}$$

Values range from $-1$ (perfect inversion) to $+1$ (perfect agreement). A good evaluation suite should achieve $\tau \geq 0.8$.

**Item discrimination index**: For each task $j$, measure how well it separates strong from weak agents:

$$D_j = \hat{p}_{j,\text{top}} - \hat{p}_{j,\text{bottom}}$$

where $\hat{p}_{j,\text{top}}$ and $\hat{p}_{j,\text{bottom}}$ are success rates for the top and bottom quartile of agents. Tasks with $D_j < 0.1$ contribute little to discrimination and may be candidates for replacement.

### Detecting Goodhart's Law Degradation

Signs that your evaluation has become a Goodharted target:

1. **Score-capability divergence**: Benchmark scores improve while production metrics (user satisfaction, task completion in the wild) stagnate or decline. Formally, track $\rho(\text{benchmark}, \text{production})$ over time. Decreasing $\rho$ signals Goodhart drift.

2. **Ceiling compression**: All agents cluster near the top of the scale. Compute the coefficient of variation:

$$\text{CV} = \frac{\sigma_{\text{scores}}}{\mu_{\text{scores}}}$$

When CV drops below 0.05, the benchmark is losing discriminative power.

3. **Task-specific overfitting**: Agents perform suspiciously well on benchmark tasks but poorly on similar held-out tasks. Measure the generalization gap:

$$\Delta_{\text{gen}} = \hat{p}_{\text{benchmark}} - \hat{p}_{\text{held-out}}$$

A gap exceeding 10% suggests benchmark-specific optimization.

4. **Reward hacking patterns**: Agents find shortcuts that satisfy evaluation criteria without genuine capability -- for example, producing verbose outputs that score well with length-biased LLM judges while containing no substance.

### Evaluation Suite Refresh Strategies

When meta-evaluation reveals degradation, apply targeted refreshes:

- **Task rotation**: Replace 10-20% of tasks per evaluation cycle with fresh items from the same distribution. Maintain a held-out pool never exposed to developers.
- **Adversarial augmentation**: Add tasks specifically designed to exploit known failure modes or gaming strategies. Use red-teaming to generate adversarial inputs.
- **Production-correlated tasks**: Add tasks drawn from production failures -- real cases where agents failed in deployment. This directly ties the benchmark to real-world relevance.
- **Difficulty recalibration**: As agents improve, easy tasks contribute less discrimination. Periodically replace saturated tasks ($\hat{p} > 0.95$ for most agents) with harder variants.
- **Multi-version anchoring**: Maintain a fixed "anchor" subset (never rotated) to enable longitudinal comparison across evaluation suite versions.

## Why It Matters

1. **Prevents wasted optimization**: If your evaluation does not discriminate, improving benchmark scores is not improving the agent. Meta-evaluation catches this before months of effort are wasted.
2. **Maintains measurement validity**: Evaluations naturally degrade as agents evolve, teams optimize against them, and the production environment shifts. Regular meta-evaluation is preventive maintenance.
3. **Builds stakeholder trust**: Demonstrating that your evaluation is itself rigorously validated gives leadership and customers confidence in reported metrics.
4. **Catches gaming early**: Goodhart effects can be subtle and gradual. By the time they are obvious, significant resources have been misallocated.
5. **Enables benchmark evolution**: Meta-evaluation provides a principled basis for updating benchmarks -- replace what is broken, keep what works, add what is missing.

## Key Technical Details

- **Minimum agents for discrimination analysis**: Kendall's $\tau$ requires $K \geq 5$ agents for a meaningful estimate. With fewer, use pairwise accuracy instead.
- **Item Response Theory (IRT)**: For sophisticated item analysis, fit a 2-parameter IRT model: $P(\text{success}_{ij}) = \frac{1}{1+e^{-a_j(\theta_i - b_j)}}$ where $a_j$ is discrimination, $b_j$ is difficulty, and $\theta_i$ is agent ability. Items with $a_j < 0.5$ are poor discriminators.
- **Test-retest reliability**: Run the same evaluation twice on the same agent. Compute Pearson's $r$ between the two score vectors. Target: $r \geq 0.90$. Lower values indicate excessive evaluation noise (see `variance-decomposition.md`).
- **Contamination detection**: Check whether benchmark tasks appear in model training data. Use canary strings, membership inference attacks, or verbatim completion tests.
- **Versioned evaluation suites**: Always version your evaluation suite and log which version produced which results. This enables retrospective meta-analysis when Goodhart effects are suspected.

## Common Misconceptions

- **"A widely-used benchmark is automatically a good benchmark."** Popularity is not validity. MNIST remained a standard benchmark long after it ceased to discriminate between modern architectures. Similarly, popular agent benchmarks can saturate or become gamed without anyone noticing until meta-evaluation is applied.
- **"If scores are improving, the evaluation is working."** Scores can improve because the evaluation is being gamed rather than because agents are genuinely getting better. Meta-evaluation distinguishes real capability improvement from benchmark overfitting by checking correlation with independent measures.
- **"Refreshing the benchmark invalidates historical comparisons."** A well-designed refresh strategy maintains anchor tasks for longitudinal comparison while rotating discriminative tasks. The alternative -- keeping a stale benchmark forever -- invalidates future comparisons much more thoroughly.
- **"Meta-evaluation is too expensive."** A basic sensitivity study (3 degradation levels, 2 reruns) costs 5x the base evaluation. This is cheap insurance against the much larger cost of optimizing against a broken metric for months.

## Connections to Other Concepts

- `variance-decomposition.md` -- High evaluator variance reduces test-retest reliability, a primary meta-evaluation concern.
- `stratified-evaluation-design.md` -- Discriminative power may vary across strata; meta-evaluation should be stratified as well.
- `effect-size-and-practical-significance.md` -- The MDE of the evaluation suite determines the smallest meaningful difference it can detect.
- `sample-size-and-power-analysis.md` -- Sensitivity analysis is exactly power analysis applied to the evaluation suite itself.
- `regression-detection-statistics.md` -- The false alarm rate from specificity analysis informs the calibration of regression detection thresholds.
- `../08-evaluation-tooling-and-infrastructure/evaluation-reporting.md` -- Meta-evaluation results should be reported alongside agent evaluation results.
- `../10-frontier-research-and-open-problems/benchmark-saturation.md` -- Benchmark saturation is the most common failure mode that meta-evaluation detects.

## Further Reading

- "Goodhart's Law: Its Origins, Meaning and Implications for Monetary Policy" -- Charles A. E. Goodhart, 1975
- "Educational Measurement" -- Robert L. Brennan (Ed.), 2006
- "Item Response Theory for Psychologists" -- Susan E. Embretson, Steven P. Reise, 2000
- "Dynabench: Rethinking Benchmarking in NLP" -- Douwe Kiela et al., 2021
- "Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference" -- Wei-Lin Chiang et al., 2024
