# Cost-Controlled Benchmarking

**One-Line Summary**: Instead of asking "what is the best score an agent can achieve?", cost-controlled benchmarking asks "what is the best score at a given cost per task?" -- a question far more relevant to production deployment decisions.

**Prerequisites**: `the-evaluation-triangle.md`, `../02-benchmark-ecosystem/swe-bench-deep-dive.md`, `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md`

## What Is Cost-Controlled Benchmarking?

Imagine two restaurants both claiming five-star food. One charges $20 per plate, the other $300. Without knowing the price, you might declare the $300 restaurant "better" -- but most diners care about the best meal they can get within their budget. The same logic applies to agent evaluation: a benchmark score without a cost figure is an incomplete data point.

Traditional benchmarking optimizes for peak performance: throw unlimited compute, retries, and model upgrades at the problem and report the highest number. This creates a misleading picture for teams making deployment decisions. An agent scoring 85% on SWE-bench Verified at $15 per task and one scoring 80% at $2 per task are not five percentage points apart -- they are operating in fundamentally different economic regimes. For a company processing 10,000 coding tasks per month, the difference is $150,000 versus $20,000 in monthly costs.

Cost-controlled benchmarking reframes the question. It treats cost as a first-class evaluation dimension alongside accuracy, enabling apples-to-apples comparisons between agent configurations that reflect real-world deployment constraints.

## How It Works

### The Pareto Frontier

The central analytical tool in cost-controlled benchmarking is the Pareto frontier: a curve plotting the maximum achievable accuracy at each cost point. To construct it, you evaluate multiple agent configurations -- different models, retry strategies, scaffolding complexity, tool sets -- and plot each configuration as a point in accuracy-cost space.

Configurations on the Pareto frontier represent the best possible accuracy at their cost level. Configurations below the frontier are strictly dominated: another configuration achieves higher accuracy at the same or lower cost. The frontier reveals the true cost-accuracy tradeoff, showing exactly how much additional accuracy each additional dollar buys.

### Cost Metrics and Normalization

Several normalization approaches make cost comparisons tractable:

**Cost-per-resolved-task**: Total evaluation cost divided by the number of successfully completed tasks. If an agent spends $500 on 100 tasks and resolves 40, the cost per resolved task is $12.50. This penalizes agents that spend heavily on tasks they ultimately fail.

**Accuracy-per-dollar**: Pass rate divided by average cost per task. An agent scoring 80% at $2/task achieves 40 accuracy-points per dollar. An agent scoring 85% at $15/task achieves 5.67 accuracy-points per dollar -- a 7x efficiency gap.

**Cost-adjusted accuracy**: Accuracy multiplied by a discount factor based on cost. One formulation: $\text{Score} = \text{Accuracy} \times \max(0, 1 - \alpha \cdot \text{cost})$ where $\alpha$ controls cost sensitivity. This produces a single scalar that balances both dimensions.

### SWE-bench Cost Reporting

The SWE-bench leaderboard now includes cost metrics alongside accuracy, reflecting the community's recognition that cost matters. As of early 2026, top agents on SWE-bench Verified show:

- **High-accuracy tier**: ~79% accuracy at $3-8 per task (frontier reasoning models with sophisticated scaffolding)
- **Mid-accuracy tier**: ~60-70% accuracy at $1-3 per task (smaller models with good prompting)
- **Cost-efficient tier**: ~45-55% accuracy at $0.20-0.80 per task (open-source or small models)

The median cost per resolved issue for top-performing agents has converged around $1.26, down from $5-10 in early 2024, driven by model cost reductions and more efficient scaffolding.

### Constructing Cost-Controlled Leaderboards

A cost-controlled leaderboard ranks agents at fixed budget tiers rather than by peak performance:

| Budget Tier   | Best Agent     | Accuracy | Cost/Task |
|---------------|----------------|----------|-----------|
| $0.50/task    | Agent C        | 52%      | $0.45     |
| $2.00/task    | Agent A        | 73%      | $1.80     |
| $5.00/task    | Agent B        | 80%      | $4.50     |
| $15.00/task   | Agent D        | 85%      | $14.20    |

This format immediately reveals which agent is best for a given deployment budget, which is the actual question most teams need answered.

### Cost Components and Attribution

Agent costs decompose into several categories that teams can independently optimize:

- **LLM inference**: Typically 60-85% of total cost. Includes input tokens (context, retrieved code) and output tokens (reasoning, generated code)
- **Retries and self-repair**: 10-25% for agents that re-attempt after test failures
- **Tool execution**: 5-15% for code execution, search, file operations
- **Infrastructure**: Sandbox provisioning, network, storage -- often amortized

Understanding this decomposition reveals optimization opportunities. An agent spending 30% of its budget on retries might benefit more from improving first-attempt quality than from switching to a cheaper model.

## Why It Matters

1. **Enables honest deployment decisions.** A team with a $2/task budget should not choose an agent benchmarked at $15/task, regardless of its accuracy advantage. Cost-controlled results map directly to real-world feasibility.
2. **Reveals true innovation.** Pushing accuracy from 80% to 85% through brute-force retries is engineering. Achieving 80% at half the cost is efficiency innovation that benefits all users.
3. **Prevents misleading comparisons.** Without cost normalization, leaderboards incentivize wasteful configurations -- maximum retries, ensemble voting, multiple model calls -- that inflate scores but are impractical at production scale.
4. **Aligns research with deployment.** When researchers optimize for cost-adjusted metrics, their innovations are immediately applicable to production systems rather than requiring costly re-engineering.

## Key Technical Details

- SWE-bench Verified top agents average ~$1.26 per resolved issue as of early 2026, down from ~$8 in early 2024
- Cost per input token has fallen roughly 100x from GPT-4 (2023) to frontier models (2026), but agent cost reductions have been only 5-10x due to increased scaffolding complexity
- Retry-based agents typically spend 2-4x the cost of single-attempt agents for a 5-15 percentage point accuracy gain
- The accuracy-cost Pareto frontier is typically concave: the first dollars buy large accuracy gains; later dollars buy diminishing returns
- At the $0.50/task budget tier, open-source models (Qwen, Llama variants) are competitive with proprietary APIs

## Common Misconceptions

**"The highest-scoring agent is the best agent."** Without cost context, this statement is meaningless. The highest-scoring configuration might use ensemble voting across three frontier models with five retry attempts -- a setup costing $50 per task that no production system would deploy.

**"Cost will become irrelevant as models get cheaper."** Model inference costs are falling, but agent scaffolding costs (retries, tool use, context management) are not falling at the same rate. And as models get cheaper, teams expand usage rather than pocketing savings -- the cost constraint shifts but does not disappear.

**"You can just compare cost per resolved task."** Cost per resolved task penalizes agents that attempt hard tasks. An agent that only attempts easy tasks might have a low cost-per-resolution but fail completely on the tasks that matter most. Cost metrics must be paired with task difficulty stratification.

**"API pricing is the only cost that matters."** Engineering time to maintain agent scaffolding, infrastructure costs for sandboxing, and the cost of evaluating agents themselves are all significant. A "cheaper" open-source model that requires 3x the engineering effort to scaffold may not be cheaper in total cost of ownership.

## Connections to Other Concepts

- `the-evaluation-triangle.md` provides the overarching framework where cost is one of three competing dimensions
- `evaluation-budget-optimization.md` addresses cost optimization for the evaluation process itself, complementary to this concept's focus on agent operational cost
- `model-cascading-evaluation.md` evaluates a specific cost-reduction strategy where routing reduces average cost per task
- `../02-benchmark-ecosystem/swe-bench-deep-dive.md` details the benchmark where cost-controlled reporting has become standard practice
- `../02-benchmark-ecosystem/benchmark-design-methodology.md` covers how to design benchmarks that include cost as a first-class metric
- `../09-production-evaluation-and-monitoring/production-quality-monitoring.md` connects cost-controlled benchmarking to real production cost tracking

## Further Reading

- "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" -- Jimenez et al., 2024
- "OpenHands: An Open Platform for AI Software Developers as Generalist Agents" -- Wang et al., 2024
- "The Pareto Frontier of Cost-Performance Tradeoffs in LLM Agents" -- Li et al., 2025
- "Cost-Aware Evaluation of Language Model Agents" -- Zhang et al., 2025
- "Rebench: Evaluating AI Agents on Real-World Software Issues at Scale" -- Beck et al., 2025
