# Variance Decomposition

**One-Line Summary**: Variance decomposition identifies whether evaluation noise comes from model sampling, environment instability, task difficulty spread, or evaluator inconsistency -- and tells you which source to fix first.

**Prerequisites**: `sample-size-and-power-analysis.md`, `confidence-intervals-for-agent-metrics.md`, `../01-foundations-of-agent-evaluation/what-is-agent-evaluation.md`

## What Is Variance Decomposition?

Imagine you are trying to measure how fast a runner completes a mile, but your measurements are noisy. The noise could come from the stopwatch (measurement error), wind conditions (environment), the runner's daily form (subject variability), or track quality (context). Without knowing which source dominates, you might invest in a better stopwatch when the real problem is the wind. Variance decomposition tells you where to invest.

In agent evaluation, observed variance in performance metrics is a mixture of several sources: the randomness inherent in LLM sampling (temperature, nucleus sampling), the instability of external environments (API timeouts, web page changes), the spread of task difficulty within the evaluation suite, and the inconsistency of the evaluation method itself (especially LLM-as-judge approaches). Each source contributes to the total variance, and they interact in complex ways.

Decomposing variance is not merely an academic exercise. It directly determines the most cost-effective strategy for improving evaluation precision. If 80% of your variance comes from model sampling, setting temperature to 0 or averaging over seeds eliminates most noise for free. If evaluator inconsistency dominates, you need a better rubric or judge -- more runs will not help much. The decomposition converts a vague "our results are noisy" into an actionable diagnosis.

## How It Works

### The ANOVA Model

Model agent evaluation results as a linear random-effects model. Let $Y_{ijkl}$ be the outcome for model run $l$, evaluated by judge $k$, on task $j$, in environment instance $i$:

$$Y_{ijkl} = \mu + \alpha_i + \beta_j + \gamma_k + \delta_l + \epsilon_{ijkl}$$

where:
- $\mu$ = grand mean (true agent performance)
- $\alpha_i \sim N(0, \sigma^2_{\text{env}})$ = environment variance
- $\beta_j \sim N(0, \sigma^2_{\text{task}})$ = task difficulty variance
- $\gamma_k \sim N(0, \sigma^2_{\text{judge}})$ = evaluator variance
- $\delta_l \sim N(0, \sigma^2_{\text{model}})$ = model sampling variance
- $\epsilon_{ijkl} \sim N(0, \sigma^2_{\text{resid}})$ = residual/interaction variance

The total variance decomposes as:

$$\sigma^2_{\text{total}} = \sigma^2_{\text{env}} + \sigma^2_{\text{task}} + \sigma^2_{\text{model}} + \sigma^2_{\text{judge}} + \sigma^2_{\text{resid}}$$

### Estimation via Nested ANOVA

To estimate each component, run a factorial experiment:

1. Select $T$ tasks from the evaluation suite.
2. For each task, run the agent $R$ times with different random seeds.
3. For each run, instantiate $E$ environment configurations.
4. For each trajectory, evaluate with $J$ different judge instances (or the same LLM judge with different seeds).

Compute mean squares for each factor and solve the expected mean square equations:

$$\hat{\sigma}^2_{\text{model}} = \frac{MS_{\text{model}} - MS_{\text{resid}}}{E \times J}$$

$$\hat{\sigma}^2_{\text{env}} = \frac{MS_{\text{env}} - MS_{\text{resid}}}{R \times J}$$

$$\hat{\sigma}^2_{\text{judge}} = \frac{MS_{\text{judge}} - MS_{\text{resid}}}{R \times E}$$

### The Intraclass Correlation Coefficient

Report each component as a fraction of total variance using the Intraclass Correlation Coefficient (ICC):

$$\text{ICC}_{\text{source}} = \frac{\hat{\sigma}^2_{\text{source}}}{\hat{\sigma}^2_{\text{total}}}$$

A practical summary might look like:

| Source | $\hat{\sigma}^2$ | ICC | Action |
|--------|----------|-----|--------|
| Model sampling | 0.042 | 38% | Fix seed or average over $k$ runs |
| Environment | 0.008 | 7% | Acceptable; use containers |
| Task difficulty | 0.035 | 32% | Expected; stratify analysis |
| Judge inconsistency | 0.021 | 19% | Improve rubric or use ensemble |
| Residual | 0.004 | 4% | -- |

### Practical Decomposition Protocol

A minimal but informative decomposition study requires:

1. **Select 20+ tasks** spanning the difficulty range.
2. **Run each task 10+ times** with different random seeds (model variance).
3. **Use 2-3 environment instances** per task where feasible (environment variance).
4. **Evaluate each trajectory with 3+ judge passes** (evaluator variance).
5. **Fit the random-effects model** using REML (restricted maximum likelihood) estimation.
6. **Report ICCs** and the implied optimal allocation strategy.

Total cost: $20 \times 10 \times 3 \times 3 = 1{,}800$ evaluations. At $\$1$/run, this is $\$1{,}800$ -- a one-time investment that guides all future evaluation design.

## Why It Matters

1. **Targeted noise reduction**: Instead of blindly increasing sample size, fix the dominant variance source. This can reduce required $n$ by 50-80%.
2. **Evaluation credibility**: Reporting variance components alongside results lets readers assess the reliability of each dimension independently.
3. **Cost optimization**: If model sampling dominates, use temperature=0 for evaluations. If judge noise dominates, invest in better evaluation methods rather than more runs.
4. **Fair comparison**: Two agents can only be fairly compared if the evaluation's noise floor is below the effect size of interest. Decomposition reveals whether this condition is met.
5. **Debugging pipeline**: Sudden increases in a specific variance component signal infrastructure problems (environment instability) or evaluation drift (judge model updates).

## Key Technical Details

- **REML estimation** is preferred over ML for variance components because it corrects for the downward bias in ML estimates, especially in small samples.
- **Negative variance estimates** can occur with ANOVA-style estimation. Set these to zero and redistribute using constrained REML.
- **For binary outcomes**, use a generalized linear mixed model (GLMM) with a logit link: $\text{logit}(p_{ijkl}) = \mu + \alpha_i + \beta_j + \gamma_k + \delta_l$. Variance components are on the latent logit scale.
- **Crossed vs nested designs**: Tasks crossed with seeds is standard. Judges may be nested within runs (each run gets a fresh judge sample) or crossed (same judge set evaluates all runs). The design affects the estimable components.
- **Generalizability theory** (G-theory) extends classical ANOVA by computing a generalizability coefficient $E\rho^2$, which estimates how well observed scores generalize to the universe of possible evaluation conditions.

## Common Misconceptions

- **"Just run more trials to reduce noise."** If 80% of variance comes from judge inconsistency, running more agent trials barely helps. You are averaging over a small noise source while the big one persists. Always diagnose before treating.
- **"Temperature=0 eliminates all model variance."** Temperature=0 makes sampling deterministic for a given prompt, but prompt variation (e.g., from environment state differences), batching effects, and API-level non-determinism can still introduce model-side variance.
- **"Task difficulty variance is noise that should be reduced."** Task variance is inherent and informative -- it reflects the spread of the evaluation suite. The goal is not to reduce it but to account for it properly (see `stratified-evaluation-design.md`).
- **"One decomposition study is sufficient forever."** Variance structure changes as models improve, environments are updated, and evaluation methods evolve. Re-run decomposition when any major pipeline component changes.

## Connections to Other Concepts

- `sample-size-and-power-analysis.md` -- Variance decomposition informs optimal allocation of samples across tasks and runs per task.
- `confidence-intervals-for-agent-metrics.md` -- The relevant variance for CI computation depends on which sources are averaged over.
- `stratified-evaluation-design.md` -- Task difficulty variance motivates stratified analysis rather than simple aggregation.
- `meta-evaluation.md` -- Evaluator variance is a key input to meta-evaluation: a high-variance evaluator is unreliable.
- `../08-evaluation-tooling-and-infrastructure/evaluation-reporting.md` -- Variance component reporting should be standard in evaluation dashboards.
- `../04-trajectory-and-process-analysis/llm-as-judge.md` -- Judge inconsistency is one of the primary variance sources and a direct concern for LLM-as-judge methods.

## Further Reading

- "The Theory of Generalizability: A Liberation of Reliability Theory" -- Lee J. Cronbach, Goldine C. Gleser, Harinder Nanda, Nageswari Rajaratnam, 1972
- "Design and Analysis of Cross-Over Trials" -- Byron Jones, Michael G. Kenward, 2014
- "Variance Component Estimation in Mixed Models" -- Jiming Jiang, 2007
- "Understanding Sources of Variability in LLM Evaluations" -- inspired by modern agent evaluation practice, 2024
