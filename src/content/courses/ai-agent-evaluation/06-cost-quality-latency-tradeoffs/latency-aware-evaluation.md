# Latency-Aware Evaluation

**One-Line Summary**: Time is a critical and often overlooked evaluation dimension -- measuring not just whether an agent succeeds but how quickly it succeeds, where the time goes, and how latency interacts with perceived and actual quality.

**Prerequisites**: `the-evaluation-triangle.md`, `cost-controlled-benchmarking.md`, `../01-foundations-of-agent-evaluation/evaluation-dimensions-taxonomy.md`

## What Is Latency-Aware Evaluation?

Imagine two plumbers arriving to fix a leak. One diagnoses the problem in 5 minutes and fixes it in 15. The other spends 2 hours carefully inspecting every pipe before performing a slightly more thorough repair. For an actively flooding kitchen, the first plumber is clearly better -- even if the second one's work is marginally superior. Agent evaluation faces the same tension: an agent that produces a perfect answer in 10 minutes may be less useful than one that produces a good-enough answer in 30 seconds.

Traditional agent benchmarks report accuracy as a single number, collapsing time into a binary "completed/not completed" judgment. But in production, time is a first-class quality dimension. A coding agent that takes 45 minutes to resolve an issue competes directly with a human developer who might solve it in 30 minutes. A customer service agent that responds in 3 seconds feels fundamentally different from one that responds in 30 seconds, even if both responses are correct. Latency-aware evaluation makes time an explicit axis of measurement and analysis.

This matters doubly for modern reasoning models (like o1, o3, DeepSeek-R2), which trade latency for quality by performing extended chain-of-thought reasoning. Evaluating these models without measuring latency misses half the story.

## How It Works

### Time Metrics Taxonomy

Latency-aware evaluation requires multiple time metrics, each capturing a different aspect of the user experience:

**Time-to-first-action (TTFA)**: How long before the agent begins doing something visible to the user. For a coding agent, this is the time from receiving a task to making the first file edit or running the first command. Low TTFA provides responsiveness signal to users even if total completion time is long.

**Time-to-completion (TTC)**: Total wall-clock time from task start to final output. This is the headline metric but can be misleading in isolation -- an agent that produces partial results quickly is often preferable to one that produces complete results slowly.

**Time-to-first-correct-output**: For iterative agents that produce intermediate results, how long before the first output that would satisfy the user. An agent that generates a working patch in 2 minutes, then spends 8 more minutes on unnecessary refinements, has a TTC of 10 minutes but a time-to-first-correct of 2 minutes.

### Distribution Analysis

Reporting median latency alone is as misleading as reporting mean pass rate. Latency distributions for agents are typically heavy-tailed: most tasks complete quickly, but a minority take dramatically longer. The key percentiles to report:

- **P50 (median)**: The typical experience. Useful for marketing and general communication.
- **P90**: The experience of the unluckiest 10% of users. Critical for user satisfaction.
- **P95**: The threshold most SLAs target. An agent with P95 = 60 seconds means 1 in 20 tasks takes over a minute.
- **P99**: Worst-case planning. Determines timeout settings and user patience thresholds.

A concrete example: a coding agent might show P50 = 45 seconds, P90 = 3 minutes, P95 = 8 minutes, P99 = 25 minutes. The gap between P50 and P99 reveals that the "average" experience is drastically different from the worst case.

### Latency Budgets as Evaluation Criteria

Production deployments set latency budgets -- maximum acceptable completion times that function as hard evaluation criteria:

- "Must complete in under 60 seconds for 95% of tasks" (interactive coding assistant)
- "Must produce first response in under 5 seconds" (customer support agent)
- "Must complete in under 30 minutes for 99% of tasks" (background automation agent)

Evaluation then measures **budget compliance rate**: the percentage of tasks completing within the latency budget. An agent scoring 85% accuracy with 92% latency budget compliance may be superior to one scoring 90% accuracy with 70% compliance, depending on the application.

### The Quality-Latency Pareto Frontier

Just as cost-controlled benchmarking plots accuracy against cost, latency-aware evaluation plots accuracy against completion time to reveal the quality-latency Pareto frontier.

Modern reasoning models illustrate this vividly. A standard model might achieve 65% accuracy with a median completion time of 15 seconds. The same model family with extended reasoning achieves 80% at 90 seconds. With maximum reasoning budget, it reaches 85% at 5 minutes. The frontier shows the exact quality premium each additional second of thinking time buys.

For evaluation, this means testing agents at multiple latency budgets:

| Latency Budget | Best Config       | Accuracy |
|----------------|-------------------|----------|
| 10 seconds     | Fast model, no CoT | 55%     |
| 30 seconds     | Standard model     | 68%     |
| 2 minutes      | Reasoning model    | 79%     |
| 10 minutes     | Full reasoning + retries | 85% |

### Where Time Goes: Latency Decomposition

Understanding time allocation reveals optimization opportunities. A typical agent task decomposes as:

- **LLM inference**: 30-60% of total time. Includes prompt processing (input tokens) and generation (output tokens). Reasoning models spend 50-80% here.
- **Tool execution**: 15-30%. Code execution, file I/O, API calls, search queries. Often the most variable component.
- **Network overhead**: 5-15%. API round-trips, context window transfers. Accumulates across many LLM calls.
- **Planning and orchestration**: 5-15%. Agent framework overhead, decision routing, context management.
- **Waiting and retries**: 0-30%. Rate limiting, failed attempts, self-correction loops. Highly variable.

Agents spending over 40% on retries have an architectural problem. Agents spending over 60% on LLM inference are compute-bound and benefit most from model-level latency improvements.

### Perceived Latency and User Experience

Research on human-computer interaction reveals a counterintuitive finding: adding deliberate latency signals can make agents feel more competent to users. Showing "Analyzing your codebase..." for 2 seconds before a pre-computed response feels more trustworthy than an instant reply. This phenomenon, sometimes called the "labor illusion," means that raw speed is not always optimal from a user experience perspective.

However, there is a critical threshold: responses that take longer than about 10 seconds without progress indicators cause user abandonment. Agents that provide streaming output, progress updates, or intermediate results maintain engagement at latencies that would be intolerable in a silent-until-complete mode.

## Why It Matters

1. **Users experience latency, not just accuracy.** A 5% accuracy improvement is invisible to users if it comes with a 10x latency increase. Time directly affects user satisfaction, adoption, and retention.
2. **Latency determines viable use cases.** An agent that takes 5 minutes per task is suitable for background automation but not for interactive assistance. Latency defines the product category.
3. **Reasoning model evaluation is incomplete without time.** Extended thinking models explicitly trade time for quality. Evaluating them on accuracy alone ignores the most important design parameter.
4. **Latency budgets are contractual requirements.** Production SLAs specify response time guarantees. An agent that violates these is unsuitable regardless of its accuracy.
5. **Cost and latency are correlated but not identical.** A fast model that requires many retries may have low latency but high cost, or vice versa. Both dimensions must be measured independently.

## Key Technical Details

- Reasoning models show a roughly logarithmic quality-latency relationship: doubling thinking time yields diminishing accuracy returns
- P95 latency is typically 3-8x the P50 for agent tasks due to heavy-tailed distributions
- Tool execution latency is the most variable component, with standard deviations often exceeding the mean
- User abandonment rates increase sharply after 10 seconds of silence and approach 50% at 30 seconds without progress feedback
- Streaming first tokens within 1-2 seconds reduces perceived latency by 40-60% in user satisfaction studies
- Adding progress indicators allows users to tolerate 3-5x longer actual completion times
- Latency decomposition often reveals that 20-30% of time is spent on non-essential operations that can be parallelized or eliminated

## Common Misconceptions

**"Faster is always better."** For complex tasks, premature responses harm quality. The quality-latency frontier shows that some tasks genuinely require more time. The goal is not minimum latency but optimal latency for the quality requirement.

**"Median latency is sufficient to report."** Median latency describes the typical case but hides worst-case behavior. An agent with a 5-second median but a 5-minute P99 has a fundamentally different reliability profile than one with a 10-second median and 15-second P99.

**"Latency is purely a systems engineering problem."** Agent latency is substantially determined by the agent's cognitive architecture -- how many reasoning steps it takes, how it decides when to stop thinking, how it handles uncertainty. These are AI design decisions, not infrastructure decisions.

**"Users want instant responses."** Research consistently shows that users prefer a 3-second response that feels considered over a 0.5-second response that feels reflexive, especially for complex tasks. The optimal latency depends on task complexity and user expectations.

## Connections to Other Concepts

- `the-evaluation-triangle.md` positions speed as one of three competing evaluation dimensions
- `cost-controlled-benchmarking.md` provides the parallel framework for the cost dimension; cost and latency are often correlated but independently important
- `model-cascading-evaluation.md` explores routing strategies where latency-sensitive requests go to faster models
- `evaluation-budget-optimization.md` addresses the speed of the evaluation process itself, not the agent being evaluated
- `../01-foundations-of-agent-evaluation/evaluation-dimensions-taxonomy.md` places latency within the broader taxonomy of evaluation dimensions
- `../04-trajectory-and-process-analysis/trajectory-quality-metrics.md` includes efficiency metrics that correlate with latency
- `../09-production-evaluation-and-monitoring/production-quality-monitoring.md` covers real-time latency monitoring in production

## Further Reading

- "Scaling LLM Test-Time Compute Optimally Can be More Effective Than Scaling Model Parameters" -- Snell et al., 2024
- "Let Me Think: Investigating the Effect of Deliberation Time on LLM Response Quality" -- OpenAI Research, 2024
- "The Labor Illusion: How Operational Transparency Increases Perceived Value" -- Buell and Norton, 2011
- "Latency-Quality Tradeoffs in Large Language Model Serving" -- Zhong et al., 2025
- "Time-Constrained Evaluation of Language Model Agents" -- Park et al., 2025
