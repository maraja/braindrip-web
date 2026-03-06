# Stratified Evaluation Design

**One-Line Summary**: Stratified evaluation replaces misleading single aggregate scores with performance profiles across task dimensions, revealing patterns like "excellent at easy tasks, catastrophic at hard ones" that flat averages hide.

**Prerequisites**: `sample-size-and-power-analysis.md`, `variance-decomposition.md`, `confidence-intervals-for-agent-metrics.md`

## What Is Stratified Evaluation Design?

Imagine grading a student by averaging their scores across all subjects. A student scoring 95% in art and 30% in math gets a "passing" 62.5%. The average conceals a critical deficit. Agent evaluation faces exactly this problem: an aggregate "74% on SWE-bench" might mean 95% on easy fixes and 12% on complex refactors. These two performance profiles demand entirely different deployment strategies, but the aggregate number hides the distinction.

Stratified evaluation design divides the task pool into meaningful subgroups (strata) and evaluates performance within each stratum separately. The strata reflect dimensions that matter for deployment decisions: task difficulty, domain, task type, or edge case categories. The result is a performance profile -- a multi-dimensional view of agent capability -- rather than a single misleading number.

This is not merely a reporting technique. Stratification fundamentally changes how you design evaluation suites, allocate evaluation budget, and interpret results. By ensuring adequate representation across strata, you prevent the common failure mode where easy tasks dominate the evaluation suite and inflate aggregate metrics, masking poor performance on the hard tasks that matter most in production.

## How It Works

### Defining Strata

Effective stratification requires dimensions that are both meaningful and estimable. Common stratification dimensions for agent evaluation:

**Task Difficulty**:
- Easy / Medium / Hard (based on human solve rates or expert annotation)
- Objective proxy: number of required steps, tool calls, or reasoning depth

**Domain**:
- Code generation / Web navigation / Research / Data analysis
- Within code: Python / JavaScript / Rust / multi-language

**Task Type**:
- Creation (write from scratch) / Modification (edit existing) / Debugging (find and fix)
- Information retrieval / Multi-step reasoning / Tool orchestration

**Edge Cases**:
- Error recovery (handle tool failures, API errors)
- Ambiguous inputs (underspecified requirements)
- Adversarial inputs (prompt injection, misleading context)

### Allocation Strategies

Given a total evaluation budget of $N$ runs across $K$ strata, how should you allocate?

**Proportional allocation** assigns samples proportional to stratum size in the production distribution:

$$n_k = N \times \frac{W_k}{\sum_{j=1}^{K} W_j}$$

where $W_k$ is the proportion of production tasks in stratum $k$. This optimizes the aggregate estimate but may leave rare-but-important strata undersampled.

**Equal allocation** assigns $n_k = N/K$ to each stratum regardless of size. This maximizes the precision of stratum-specific estimates but is inefficient for the aggregate.

**Neyman (optimal) allocation** minimizes the variance of the overall estimate by allocating proportional to both stratum size and variability:

$$n_k = N \times \frac{W_k \sigma_k}{\sum_{j=1}^{K} W_j \sigma_j}$$

where $\sigma_k$ is the within-stratum standard deviation. Strata with high variance get more samples.

**Practical recommendation**: Use a hybrid approach. Set a minimum floor per stratum (e.g., $n_{\min} = 30$ for CI computation), then allocate remaining budget via Neyman allocation. This ensures every stratum has a reportable estimate while optimizing overall precision.

### Computing Stratified Estimates

The stratified estimate of the overall success rate uses stratum weights:

$$\hat{p}_{\text{strat}} = \sum_{k=1}^{K} W_k \hat{p}_k$$

with variance:

$$\text{Var}(\hat{p}_{\text{strat}}) = \sum_{k=1}^{K} W_k^2 \frac{\hat{p}_k(1-\hat{p}_k)}{n_k}$$

This is always at least as precise as the unstratified estimate when strata are informative (which they almost always are). The variance reduction factor is:

$$\text{VRF} = 1 - \frac{\sum_k W_k (\hat{p}_k - \hat{p}_{\text{strat}})^2}{\hat{p}_{\text{strat}}(1-\hat{p}_{\text{strat}})}$$

When strata have very different success rates, the VRF can exceed 50%, meaning stratification effectively doubles your sample size for free.

### Performance Profile Visualization

Report results as a performance matrix rather than a single number:

| Stratum | $n$ | $\hat{p}$ | 95% CI | vs. Baseline |
|---------|-----|-----------|--------|-------------|
| Easy tasks | 120 | 0.94 | [0.88, 0.97] | +2% |
| Medium tasks | 100 | 0.71 | [0.61, 0.80] | +8% |
| Hard tasks | 80 | 0.23 | [0.14, 0.33] | -5% |
| Error recovery | 50 | 0.38 | [0.25, 0.52] | +12% |
| Ambiguous inputs | 50 | 0.44 | [0.30, 0.58] | -3% |

This profile reveals that the "overall improvement" is driven entirely by medium tasks, while hard tasks actually regressed -- a critical finding invisible in the aggregate.

### Post-Stratification

When historical data was not collected with stratification, post-stratification can still improve estimates. If you know the stratum membership of each completed evaluation, reweight after the fact:

$$\hat{p}_{\text{post}} = \sum_{k=1}^{K} W_k \hat{p}_k$$

This adjusts for any imbalance between the evaluation sample and the target population, though it cannot fix strata with zero observations.

## Why It Matters

1. **Reveals hidden failure modes**: Aggregate metrics can be "good enough" while an agent completely fails on critical task categories. Stratification exposes these blindspots.
2. **Informs deployment decisions**: A product team deciding whether to deploy an agent needs to know "does it work for our use case?" not "does it work on average across all possible use cases?"
3. **Improves precision for free**: Stratified estimation always reduces variance compared to simple random sampling when strata have different success rates. This is equivalent to getting more data at no additional cost.
4. **Enables targeted improvement**: When you know which strata an agent struggles with, you can focus development effort (fine-tuning, prompt engineering, tool improvement) on those specific areas.
5. **Supports fair benchmarking**: Two agents with the same aggregate score but different performance profiles are not interchangeable. Stratified reporting prevents misleading claims of equivalence.

## Key Technical Details

- **Minimum stratum sample size**: For the Wilson CI to be reliable, require $n_k \geq 30$ per stratum. With fewer, use Clopper-Pearson exact intervals.
- **Stratum count vs precision trade-off**: More strata provide finer-grained profiles but dilute the per-stratum sample size. For budget $N$, limit to $K \leq N / 30$ strata.
- **Interaction effects**: Task difficulty $\times$ domain interactions can be significant (an agent may handle easy code tasks well but easy research tasks poorly). Consider crossed designs when budget permits.
- **Stratification by difficulty requires calibration**: Task difficulty labels must come from an independent source (human solve rates, prior agent versions). Using the current agent's performance to define difficulty is circular.
- **Simpson's paradox**: Stratification can reverse aggregate conclusions. Agent A may outperform Agent B in every stratum while underperforming in the aggregate if it is tested more on hard tasks. Always report both stratified and aggregate results.

## Common Misconceptions

- **"A single aggregate score is simpler and therefore better."** Simplicity is a virtue only when it does not mislead. An aggregate score that averages over dramatically different strata is not simple -- it is wrong. A performance profile is more complex but more honest.
- **"Equal allocation is fair."** Equal allocation gives each stratum the same number of samples, but if production traffic is 80% easy tasks and 5% hard tasks, equal allocation massively overweights hard tasks in the aggregate. Use proportional or Neyman allocation for unbiased aggregate estimates and equal allocation only when stratum-specific estimates are the primary goal.
- **"Post-stratification is just as good as planned stratification."** Post-stratification adjusts for imbalance but cannot reduce within-stratum variance. Planned stratification with Neyman allocation achieves lower variance because it optimizes the sampling design.
- **"More strata are always better."** Over-stratification fragments the data into strata too small for reliable estimation. The optimal number of strata depends on the available budget, the heterogeneity of performance across dimensions, and the granularity needed for decision-making.

## Connections to Other Concepts

- `variance-decomposition.md` -- Task difficulty variance, identified through decomposition, is the primary motivation for stratification.
- `sample-size-and-power-analysis.md` -- Per-stratum power analysis determines the minimum $n_k$ for each stratum.
- `confidence-intervals-for-agent-metrics.md` -- Report Wilson CIs within each stratum for proper uncertainty quantification.
- `effect-size-and-practical-significance.md` -- Effect sizes may vary across strata; aggregate effect size can be misleading.
- `meta-evaluation.md` -- Stratified evaluation is a key defense against evaluation suite staleness: when easy tasks dominate, the eval loses discriminative power.
- `../08-evaluation-tooling-and-infrastructure/evaluation-reporting.md` -- Evaluation dashboards should display stratified profiles by default.

## Further Reading

- "Sampling Techniques" -- William G. Cochran, 1977
- "Stratified Sampling" -- Stephen L. Lohr, 2019
- "Model Evaluation, Model Selection, and Algorithm Selection in Machine Learning" -- Sebastian Raschka, 2018
- "Evaluating Large Language Models: A Comprehensive Survey" -- Zishan Guo et al., 2023
