# Model Cascading Evaluation

**One-Line Summary**: Model cascading routes easy tasks to cheap, fast models and hard tasks to expensive, capable models -- and evaluating these routing strategies requires measuring both the router's accuracy and the system's aggregate cost-quality tradeoff.

**Prerequisites**: `cost-controlled-benchmarking.md`, `latency-aware-evaluation.md`, `the-evaluation-triangle.md`, `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md`

## What Is Model Cascading Evaluation?

Think of a hospital triage system. A nurse screens patients at the door: minor ailments go to a general practitioner, moderate cases to a specialist, and emergencies to the trauma surgeon. The system's effectiveness depends on two things: the accuracy of the triage decisions and the quality of each tier's care. If the nurse sends a heart attack patient to the GP, someone dies. If the nurse sends every headache to the surgeon, the hospital goes bankrupt.

Model cascading works identically. A routing layer classifies incoming agent tasks by difficulty and directs them to the appropriate model tier: a small, cheap model for straightforward tasks, a mid-tier model for moderate complexity, and a frontier reasoning model for genuinely hard problems. The appeal is compelling -- most real-world task distributions are dominated by easy requests, so routing 60-80% to cheap models can slash costs by 10x or more while maintaining near-frontier quality on the tasks that need it.

But evaluating whether a cascade actually works requires more than measuring overall accuracy. You must evaluate the router, the per-tier performance, the failure modes at routing boundaries, and the aggregate economic outcome. This makes cascading evaluation meaningfully more complex than single-model evaluation.

## How It Works

### Cascade Architecture

A typical cascade has three components:

1. **Router**: Classifies task difficulty and selects the appropriate model. Can be a small LLM, a classifier trained on task features, a rule-based system, or a combination.
2. **Model tiers**: Two to four models of increasing capability and cost. Example: Llama-3-8B ($0.001/task) -> Claude Sonnet ($0.05/task) -> Claude Opus with extended thinking ($0.80/task).
3. **Escalation logic**: Rules for when a lower-tier model's output should be sent to a higher tier for verification or retry. May trigger on low confidence scores, execution failures, or quality heuristics.

### Evaluating the Router

The router is the lynchpin. A perfect router would send each task to the cheapest model capable of solving it. Evaluation measures how close the actual router comes to this ideal.

**Routing accuracy**: For each task, determine the cheapest model that can solve it (by running all tiers and observing outcomes). Then measure what percentage of tasks the router sends to that tier. Decompose errors into:

- **Over-routing rate**: Percentage of tasks sent to a more expensive tier than necessary. Increases cost without improving quality.
- **Under-routing rate**: Percentage of tasks sent to a cheaper tier than needed. Degrades quality while saving cost.

The asymmetry matters: under-routing is usually worse than over-routing because it produces user-visible failures, while over-routing only wastes money.

**Difficulty calibration**: Does the router's confidence score correlate with actual task difficulty? Plot the router's predicted difficulty against the observed pass rate of the cheap model. A well-calibrated router shows a clear negative correlation -- tasks it rates as "hard" genuinely have lower pass rates on cheap models.

### Comparing Cascade vs. Single-Model Performance

The key comparison is not "cascade vs. best single model" but "cascade vs. single model at equivalent cost." If the cascade costs $0.10/task on average and achieves 78% accuracy, the fair comparison is against whatever single model achieves the best accuracy at $0.10/task -- not against a $0.80/task frontier model.

To construct this comparison:

1. Run the full benchmark on each individual model tier separately
2. Run the full benchmark through the cascade
3. Plot all configurations on the accuracy-cost plane
4. Check whether the cascade sits on the Pareto frontier

A well-designed cascade should dominate all single-model configurations at its cost point -- that is, achieve higher accuracy than any single model at the same average cost.

### Failure Mode Analysis

Cascading introduces failure modes that do not exist in single-model systems:

**Cost blowup**: The router sends too many tasks to the expensive tier, often because the difficulty classifier is poorly calibrated or because the task distribution has shifted. If the router escalates 50% of tasks instead of the expected 20%, average cost triples.

**Quality cliff**: The router sends genuinely hard tasks to the cheap model, which fails silently -- producing plausible but incorrect outputs that pass shallow quality checks. This is more dangerous than outright failure because it erodes trust gradually.

**Escalation storms**: The cheap model fails, triggers escalation to the mid-tier, which also fails, triggering escalation to the frontier model. For tasks the frontier model also fails, the cascade has spent 3x the cost of the frontier model alone with no benefit.

**Distribution shift sensitivity**: The router was trained or calibrated on one task distribution but deployed on another. A router calibrated on coding tasks may route customer service tasks poorly.

Evaluation must specifically test for these failure modes, not just measure aggregate performance.

### Routing Threshold Sensitivity Analysis

Most routers use a confidence or difficulty threshold to decide which tier receives each task. Evaluating the cascade requires sweeping this threshold and measuring performance at each setting:

| Threshold (% to cheap model) | Avg Cost/Task | Accuracy | Quality Failures |
|-------------------------------|---------------|----------|-----------------|
| 90% cheap                     | $0.03         | 68%      | 12%             |
| 70% cheap                     | $0.08         | 76%      | 5%              |
| 50% cheap                     | $0.15         | 80%      | 2%              |
| 30% cheap                     | $0.25         | 82%      | 1%              |
| 10% cheap                     | $0.40         | 83%      | 0.5%            |

This sensitivity analysis reveals the operating range where the cascade provides a meaningful advantage over single-model deployment. Typically there is a sweet spot where routing 60-80% of traffic to cheap models achieves 90-95% of frontier quality at 20-30% of frontier cost.

### Industry Economics

Real-world cascading deployments demonstrate substantial cost savings:

- **Customer service agents**: Strategic routing sends 70-80% of requests to small models, reducing per-user costs from approximately $25/month to $2-3/month while maintaining 90%+ user satisfaction.
- **Coding assistants**: Autocomplete and simple edits route to fast, cheap models; complex refactoring and debugging route to frontier models. Cost reduction: 5-8x.
- **Document processing**: Classification, extraction, and simple Q&A use small models; complex reasoning and synthesis use frontier models. Typical routing split: 65% cheap, 25% mid-tier, 10% frontier.

The common thread: real task distributions are heavy-tailed, with most requests being straightforward. Cascading exploits this distribution structure.

## Why It Matters

1. **Cost reduction without proportional quality loss.** A well-designed cascade achieves 90-95% of frontier model quality at 15-30% of the cost, fundamentally changing deployment economics.
2. **Latency improvement for easy tasks.** Small models respond faster, so cascading also improves median latency by routing the majority of requests to faster models.
3. **Evaluation of routing is evaluation of a system, not a model.** Cascading evaluation requires system-level thinking -- testing component interactions and emergent behavior -- which builds evaluation maturity.
4. **Failure mode diversity requires broader testing.** Cascading introduces novel failure modes (silent under-routing, escalation storms) that single-model evaluation would never surface.

## Key Technical Details

- Well-calibrated cascades route 60-80% of requests to the cheapest tier in production deployments
- Per-user cost reductions of 8-12x are achievable for conversational agents with cascading, from ~$25/month to ~$2-3/month
- Router accuracy of 85-90% on difficulty classification is typically sufficient for cost-effective cascading; above 95% shows diminishing returns
- Under-routing (hard tasks to cheap models) has 3-5x the user impact of over-routing (easy tasks to expensive models)
- Escalation adds 15-40% latency overhead per tier hop due to additional inference and context transfer
- The optimal routing threshold changes with task distribution, requiring periodic recalibration in production
- A/B testing cascades requires stratified analysis -- comparing overall metrics can mask routing-tier-specific regressions

## Common Misconceptions

**"Cascading is just about saving money."** While cost is the primary motivation, cascading also improves latency (most tasks hit faster models), enables graceful degradation (if the expensive model is down, cheap models still serve easy requests), and provides natural monitoring signals (routing distribution shifts indicate task distribution shifts).

**"You only need to evaluate the overall cascade, not the router."** If the router is poorly calibrated but happens to work on your benchmark distribution, it will fail when deployed on a different distribution. Evaluating the router's difficulty predictions independently from end-to-end performance is essential for robustness.

**"More tiers are always better."** Each additional tier adds routing complexity, latency overhead from potential escalation, and evaluation surface area. In practice, two to three tiers capture most of the benefit. Four or more tiers rarely justify the added complexity.

**"Cascading eliminates the need for a good cheap model."** The cascade's economics depend on the cheap model handling the majority of requests well. If the cheap model only solves 30% of tasks correctly, cascading saves little because most requests escalate. The cheap model's quality on easy tasks is the foundation.

## Connections to Other Concepts

- `cost-controlled-benchmarking.md` provides the accuracy-cost framework used to evaluate whether cascades sit on the Pareto frontier
- `latency-aware-evaluation.md` covers the latency dimension that cascading also optimizes
- `the-evaluation-triangle.md` frames cascading as a strategy for moving toward the cost vertex without fully sacrificing thoroughness
- `evaluation-at-scale.md` addresses the infrastructure needed to evaluate cascading at production scale
- `../04-trajectory-and-process-analysis/tool-use-correctness.md` is relevant because routing decisions are a form of tool selection
- `../09-production-evaluation-and-monitoring/a-b-testing-for-agents.md` covers the A/B testing methodology needed to validate cascading in production
- `../09-production-evaluation-and-monitoring/drift-detection-and-model-updates.md` applies to detecting when routing distributions shift unexpectedly

## Further Reading

- "FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance" -- Chen et al., 2023
- "Routing to the Expert: Efficient Reward-Guided Ensemble of Large Language Models" -- Lu et al., 2024
- "AutoMix: Automatically Mixing Language Models" -- Madaan et al., 2024
- "Hybrid LLM: Cost-Efficient and Quality-Aware Query Routing" -- Ding et al., 2024
- "Cascading Large Language Models for Salient Information Extraction" -- Singh et al., 2025
