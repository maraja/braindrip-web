# Evaluation Budget Optimization

**One-Line Summary**: Given a fixed evaluation budget, maximize the information gained about agent performance through adaptive testing, early stopping, progressive evaluation, and intelligent budget allocation between breadth and depth.

**Prerequisites**: `the-evaluation-triangle.md`, `cost-controlled-benchmarking.md`, `../05-statistical-methods-for-evaluation/sample-size-and-power-analysis.md`, `../05-statistical-methods-for-evaluation/confidence-intervals-for-agent-metrics.md`

## What Is Evaluation Budget Optimization?

Imagine you have $1,000 to spend understanding how well your agent performs. You could run 2,000 tasks once each, 200 tasks 10 times each, or 50 tasks 40 times each -- all for the same cost. Each allocation tells you something different: the first gives broad but noisy coverage, the second gives moderate coverage with statistical stability, and the third gives deep confidence on a narrow slice. Evaluation budget optimization is the science of choosing the allocation that maximizes actionable insight.

This problem is analogous to experimental design in clinical trials, where researchers must decide how many patients to enroll, how many measurements to take per patient, and which subgroups to oversample. In agent evaluation, the "patients" are tasks, the "measurements" are runs, and the "subgroups" are difficulty levels, task categories, or capability dimensions. The stakes are similar too: under-powered evaluation leads to bad decisions.

The core challenge is that you do not know in advance which tasks are informative and which are redundant. A task where the agent succeeds 100% of the time provides almost no signal. A task where the agent succeeds 50% of the time is maximally informative about the agent's capability boundary. Budget optimization techniques aim to discover and exploit this structure during the evaluation process itself.

## How It Works

### Adaptive Testing

Adaptive testing allocates evaluation runs dynamically based on observed results, rather than committing to a fixed number of runs per task upfront.

The basic algorithm works as follows: start by running each task once. Tasks where the agent clearly succeeds (high confidence) or clearly fails (high confidence) receive no additional runs. Tasks with uncertain outcomes -- perhaps the agent succeeded on the first run but you suspect it might fail on subsequent attempts -- receive additional runs until confidence reaches a target threshold or the budget is exhausted.

Formally, after $k$ runs of task $i$ with $s_i$ successes, the posterior distribution of the task's pass rate is $\text{Beta}(s_i + 1, k - s_i + 1)$. The width of the 95% credible interval determines whether more runs are needed. If the interval is narrow enough (say, width < 0.15), stop running that task and reallocate the budget.

This approach typically reduces the number of runs needed by 40-60% compared to fixed-depth evaluation while achieving the same confidence level. Tasks with pass rates near 0% or 100% are identified within 2-3 runs; only borderline tasks (30-70% pass rates) consume the full run budget.

### Early Stopping

Early stopping is a special case of adaptive testing focused on efficiency at the extremes. If an agent fails a task on 9 out of 10 runs, continuing to 20 runs is unlikely to change the conclusion. Similarly, if it succeeds on all 10 runs, additional runs provide diminishing information.

A practical early stopping rule: after $n$ runs, if the observed pass rate is below 0.1 or above 0.9, stop. This uses the binomial confidence interval -- with 10 runs and 0 or 1 successes, the 95% upper bound on the true pass rate is approximately 26%, which is sufficient for most classification purposes.

For budget-constrained scenarios, more aggressive stopping is warranted: stop after 5 runs if the pass rate is 0% or 100%. The expected budget savings from early stopping alone are 20-35% on a typical evaluation suite where many tasks are clearly easy or clearly hard.

### Progressive Evaluation

Progressive evaluation applies increasingly expensive evaluation methods only when cheaper methods produce ambiguous results. It functions as a cost-efficient evaluation cascade:

**Tier 1 -- Syntax and static checks** ($0.001/task): Does the output parse? Does the code compile? Are there obvious format violations? Cost: near zero. Eliminates 10-20% of candidates immediately.

**Tier 2 -- Basic functional tests** ($0.05-0.10/task): Does the output pass simple test cases? Does the agent's code produce the expected output for basic inputs? Eliminates another 20-30%.

**Tier 3 -- Full test suite execution** ($0.30-1.00/task): Run the comprehensive test suite in a sandboxed environment. This is where most traditional evaluation stops. Resolves 80-90% of tasks.

**Tier 4 -- LLM-as-judge evaluation** ($0.50-2.00/task): For tasks where test suites are insufficient or ambiguous, apply an LLM judge with a detailed rubric. Used for 10-20% of tasks.

**Tier 5 -- Human expert review** ($5.00-15.00/task): For tasks where automated methods disagree or high stakes demand human verification. Used for 2-5% of tasks.

By only escalating to expensive tiers when cheaper tiers are inconclusive, progressive evaluation reduces average cost per task by 3-5x compared to applying the most expensive tier universally.

### Item Response Theory for Task Selection

Item Response Theory (IRT), borrowed from psychometrics, models both task difficulty and agent ability simultaneously. Each task $j$ has a difficulty parameter $\beta_j$ and a discrimination parameter $\alpha_j$. The probability of agent $i$ with ability $\theta_i$ passing task $j$ is modeled by the logistic function:

$$P(\text{pass}) = \frac{1}{1 + e^{-\alpha_j(\theta_i - \beta_j)}}$$

After fitting IRT parameters from initial runs, you can identify which tasks are most informative for distinguishing between agents of different ability levels. Tasks with difficulty near the agent's estimated ability provide the most information. Tasks far above or below the agent's ability level add minimal signal.

Using IRT-guided task selection, you can estimate an agent's overall pass rate to within 2-3 percentage points using only 30-50 strategically selected tasks instead of 200-500 uniformly sampled ones -- a 4-10x reduction in evaluation cost.

### Breadth vs. Depth Allocation

The fundamental budget allocation decision is between breadth (more tasks, fewer runs each) and depth (fewer tasks, more runs each). The optimal split depends on two factors:

1. **Task-level variance**: If the agent's pass rate varies widely across tasks (some easy, some hard), breadth is more valuable because sampling more tasks reduces uncertainty about the overall distribution.
2. **Run-level variance**: If the agent's behavior is highly non-deterministic (variable across runs on the same task), depth is more valuable because repeated runs reduce uncertainty about per-task pass rates.

A practical heuristic: start with 3 runs per task. If the within-task variance (across runs) is much smaller than the between-task variance (across tasks), shift budget toward breadth. If within-task variance is high, shift toward depth. Variance decomposition (see `../05-statistical-methods-for-evaluation/variance-decomposition.md`) provides the formal framework for this decision.

## Why It Matters

1. **Doubles effective evaluation coverage.** Adaptive techniques extract 2-3x more information from the same budget, equivalent to doubling or tripling your evaluation investment.
2. **Enables faster iteration.** By reducing the cost of a statistically valid evaluation cycle, teams can evaluate more frequently and make more informed decisions per unit time.
3. **Makes rigorous evaluation accessible to smaller teams.** A startup with a $200 evaluation budget can get near-enterprise-quality signal by applying these optimization techniques.
4. **Improves evaluation fairness.** Spending equal evaluation budget on easy and hard tasks wastes resources on easy tasks and under-evaluates hard ones. Adaptive allocation is more equitable across the difficulty spectrum.

## Key Technical Details

- Adaptive testing reduces total runs by 40-60% compared to fixed-depth evaluation at equivalent confidence levels
- Early stopping saves 20-35% of budget on typical evaluation suites with mixed-difficulty tasks
- Progressive evaluation reduces average per-task cost by 3-5x compared to uniform application of the most expensive evaluation method
- IRT-based task selection can estimate overall pass rates within 2-3 percentage points using 30-50 tasks instead of 200-500
- The optimal breadth-depth split is approximately 70/30 for most agent evaluations (favoring breadth), but this is strongly influenced by the agent's non-determinism level
- Budget for human review should be reserved for the 2-5% of cases where automated methods are most uncertain

## Common Misconceptions

**"Every task needs the same number of runs."** Equal allocation is the most common and most wasteful evaluation strategy. Tasks with extreme pass rates (near 0% or 100%) need far fewer runs than borderline tasks. Adaptive allocation exploits this structure.

**"You need to run all tasks in your benchmark."** If budget is constrained, strategically selecting a subset of maximally informative tasks via IRT or stratified sampling produces better estimates than running the full suite with fewer runs per task.

**"Progressive evaluation introduces bias."** When properly designed, progressive evaluation does not bias results because each tier is strictly more stringent than the previous one. Tasks that pass at Tier 1 would also pass at Tier 5 -- you are just avoiding the cost of confirming this.

**"Budget optimization is only relevant for large evaluations."** Even small evaluations benefit. A team with 50 tasks and $100 that uses adaptive testing instead of fixed 3-runs-per-task can either save 40% of budget or increase confidence intervals by the equivalent margin.

## Connections to Other Concepts

- `the-evaluation-triangle.md` provides the overarching framework where budget optimization operates on the cost-thoroughness edge
- `cost-controlled-benchmarking.md` addresses agent operational costs, complementary to this concept's focus on evaluation process costs
- `latency-aware-evaluation.md` examines the speed dimension that interacts with budget through parallelization and tiered evaluation
- `../05-statistical-methods-for-evaluation/sample-size-and-power-analysis.md` provides the statistical foundations for determining minimum evaluation depth
- `../05-statistical-methods-for-evaluation/variance-decomposition.md` informs the breadth-vs-depth allocation decision
- `../05-statistical-methods-for-evaluation/stratified-evaluation-design.md` provides principled task selection strategies that complement IRT
- `../08-evaluation-tooling-and-infrastructure/custom-evaluator-development.md` covers implementation of progressive evaluation tiers

## Further Reading

- "Adaptive Testing for Large Language Models" -- Wang et al., 2024
- "Efficient Benchmarking of Language Models via Item Response Theory" -- Polo et al., 2024
- "Computerized Adaptive Testing: Theory and Practice" -- van der Linden and Glas, 2010
- "Optimal Experimental Design for Agent Evaluation" -- Kumar et al., 2025
- "Sequential Testing and Early Stopping in LLM Evaluation" -- Zhao et al., 2025
