# The Evaluation Triangle

**One-Line Summary**: Every evaluation decision involves a three-way tradeoff between thoroughness (how deep and broad the evaluation), cost (compute, API calls, human time), and speed (time to get actionable results).

**Prerequisites**: `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md`, `../01-foundations-of-agent-evaluation/evaluation-driven-development.md`

## What Is the Evaluation Triangle?

Think of project management's classic "fast, good, cheap -- pick two" constraint. Agent evaluation has its own version: thoroughness, cost, and speed form a triangle where optimizing for any two inevitably compromises the third. You can run exhaustive evaluations across thousands of tasks with many repetitions -- but it will be expensive and slow. You can get fast, cheap signal -- but it will be shallow. Understanding this triangle is the foundation for making rational evaluation decisions.

The evaluation triangle is not just a theoretical framework. It is the daily reality of every team building AI agents. A startup prototyping a new coding assistant cannot afford to run full SWE-bench Verified with 10 repetitions per task before each commit. A company preparing a production release cannot rely on the five hand-picked test cases that take 30 seconds to run. The art of agent evaluation is choosing the right position on this triangle for each decision context.

What makes this particularly challenging for agent evaluation -- as opposed to traditional software testing -- is that the costs are dramatically higher on all three axes. Agent evaluations consume expensive LLM API calls, require sandboxed environments, take minutes per task instead of milliseconds, and often need multiple runs due to non-determinism. The triangle's constraints are not theoretical inconveniences; they are budget-defining realities.

## How It Works

### The Three Dimensions

**Thoroughness** encompasses three sub-dimensions: breadth (how many distinct tasks), depth (how many runs per task to account for non-determinism), and granularity (how detailed the analysis -- binary pass/fail vs. trajectory scoring vs. multi-dimensional rubric evaluation). A maximally thorough evaluation would test every task in your suite, run each task 20+ times, and apply both automated and human evaluation to every trajectory.

**Cost** includes direct compute costs (LLM API calls, sandbox infrastructure, GPU time), human costs (engineer time to design, run, and interpret evaluations), and opportunity costs (what could the team build instead of evaluating). For frontier models, a single SWE-bench evaluation run costs $500-1,000 in API calls alone.

**Speed** measures wall-clock time from "I want to know if this change is good" to "I have actionable results." This includes environment setup, task execution, result aggregation, and analysis. A full SWE-bench Verified run takes 4-8 hours even with parallelization.

### Development Stage Profiles

Different development stages demand fundamentally different positions on the evaluation triangle.

### Prototyping Stage

During prototyping, speed dominates. The goal is rapid iteration on agent architecture, prompt design, and tool integration. You need signal in minutes, not hours.

- **Breadth**: 5-15 hand-picked representative tasks
- **Depth**: 1-2 runs per task (accept noisy signal)
- **Granularity**: Binary pass/fail, maybe manual inspection of failures
- **Cost**: $5-20 per evaluation cycle
- **Speed**: Under 15 minutes end-to-end
- **Budget allocation**: 80% on fast iteration, 20% on task selection

### Iteration Stage

During active development, the balance shifts toward moderate thoroughness. You are making specific changes and need to detect regressions without waiting overnight.

- **Breadth**: 30-80 tasks stratified across difficulty levels
- **Depth**: 3-5 runs per task for statistical stability
- **Granularity**: Pass/fail plus cost tracking, basic trajectory metrics
- **Cost**: $50-200 per evaluation cycle
- **Speed**: 1-2 hours with parallelization
- **Budget allocation**: 50% breadth, 30% depth, 20% analysis tooling

### Pre-Release Stage

Before shipping, thoroughness takes priority. You need high confidence that the agent meets quality bars across the full task distribution.

- **Breadth**: Full benchmark suite (200-500+ tasks)
- **Depth**: 5-10 runs per task, more for high-variance tasks
- **Granularity**: Multi-dimensional scoring, trajectory analysis, failure categorization
- **Cost**: $1,000-5,000 per evaluation cycle
- **Speed**: 8-24 hours (often run overnight)
- **Budget allocation**: 40% breadth, 35% depth, 25% analysis and human review

### Production Monitoring Stage

In production, evaluation becomes continuous and must be cost-controlled. You cannot run the full suite on every request, so sampling and lightweight metrics dominate.

- **Breadth**: Statistical sample of live traffic (1-5%)
- **Depth**: Single observation per task (the actual production run)
- **Granularity**: Automated quality scores, user satisfaction signals, cost tracking
- **Cost**: Fixed monthly budget, typically 5-10% of production compute costs
- **Speed**: Real-time dashboards with hourly/daily aggregation
- **Budget allocation**: 60% automated monitoring, 25% periodic deep dives, 15% human review of flagged cases

### Navigating the Triangle in Practice

The key insight is that evaluation strategy is not static. Teams should consciously move around the triangle as their needs change. A common anti-pattern is getting stuck at one position -- either permanently in prototyping mode (fast and cheap, never thorough) or permanently in pre-release mode (thorough but slow, blocking development velocity).

Effective teams maintain multiple evaluation tiers that run at different frequencies: a fast smoke test on every commit (5 minutes, $2), a medium regression suite nightly (2 hours, $100), and a comprehensive evaluation weekly or before releases (12 hours, $2,000). This tiered approach approximates all three vertices of the triangle across different time horizons.

## Why It Matters

1. **Prevents under-evaluation before release.** Teams that only run fast, cheap evaluations ship agents with undiscovered failure modes that damage user trust and require costly rollbacks.
2. **Prevents over-evaluation during iteration.** Teams that insist on running full benchmark suites for every prompt change slow development to a crawl, losing competitive advantage.
3. **Enables rational budget allocation.** Understanding the triangle lets teams make explicit, defensible decisions about where to invest evaluation resources at each development stage.
4. **Aligns evaluation with business context.** A research prototype and a production system serving millions of users require fundamentally different evaluation strategies, and the triangle provides the vocabulary for that conversation.
5. **Supports organizational maturity.** Moving from ad hoc evaluation to a deliberate, stage-appropriate strategy is a key marker of agent development maturity.

## Key Technical Details

- A single SWE-bench Verified evaluation with 10 runs per task costs approximately $5,000-10,000 in API calls for frontier models
- Parallelizing across 50 sandboxed environments can reduce a 500-task evaluation from 24 hours to under 2 hours, but increases infrastructure cost
- Statistical power analysis (see `../05-statistical-methods-for-evaluation/sample-size-and-power-analysis.md`) shows that 3 runs per task detect 15+ percentage point regressions; 10 runs detect 5-point regressions
- The marginal value of additional evaluation runs follows diminishing returns: going from 1 to 3 runs is far more informative than going from 10 to 12
- Human evaluation costs roughly $5-15 per trajectory for expert review, making it 10-50x more expensive than automated evaluation per task

## Common Misconceptions

**"More evaluation is always better."** Beyond a point, additional evaluation runs produce diminishing returns while linearly increasing cost. The optimal evaluation intensity depends on the decision being made, not on some absolute standard of rigor.

**"You should run the same evaluation suite at every stage."** Using your full pre-release suite during prototyping wastes resources and slows iteration. Using your prototyping suite for release decisions risks shipping broken agents. The evaluation must match the decision context.

**"Cost is the main constraint."** For many teams, speed is actually the binding constraint. An evaluation that costs $100 but takes 8 hours blocks a full day of development. The same information delivered in 30 minutes at $200 might be a far better investment.

**"Automated evaluation eliminates the cost-thoroughness tradeoff."** Automated evaluation reduces per-task cost dramatically but does not eliminate the tradeoff. You still face decisions about breadth, depth, and the sophistication of automated scoring, each with real cost and time implications.

## Connections to Other Concepts

- `cost-controlled-benchmarking.md` applies the cost dimension specifically to benchmark result interpretation
- `evaluation-budget-optimization.md` provides techniques for getting maximum signal at each position on the triangle
- `latency-aware-evaluation.md` explores the speed dimension in depth, including time-as-quality-metric
- `evaluation-at-scale.md` examines what happens when you scale thoroughness to the limit
- `../01-foundations-of-agent-evaluation/evaluation-driven-development.md` provides the development methodology that the triangle supports
- `../05-statistical-methods-for-evaluation/sample-size-and-power-analysis.md` gives the statistical foundations for depth decisions
- `../08-evaluation-tooling-and-infrastructure/ci-cd-integration-for-agent-evaluation.md` implements the tiered evaluation approach

## Further Reading

- "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" -- Jimenez et al., 2024
- "tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains" -- Yao et al., 2024
- "Evaluating Language-Model Agents on Realistic Autonomous Tasks" -- METR, 2024
- "The Evaluation Tax: Quantifying the Cost of Rigorous Agent Assessment" -- Chen et al., 2025
- "Adaptive Testing for Large Language Models" -- Wang et al., 2024
