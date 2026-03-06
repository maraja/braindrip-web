# Evaluation Dimensions Taxonomy

**One-Line Summary**: A systematic framework for the full space of agent evaluation dimensions -- accuracy, cost, latency, safety, reliability, tool use, planning quality, and security -- because single-metric evaluation is almost always misleading.

**Prerequisites**: `why-agent-evaluation-is-hard.md`, `outcome-vs-process-evaluation.md`

## What Is an Evaluation Dimensions Taxonomy?

Think of evaluating an agent like evaluating a restaurant. A restaurant with incredible food but two-hour wait times, rude service, and health code violations is not a "good" restaurant -- even if the food scores 10/10. You need multiple dimensions: taste, service, ambiance, hygiene, price, wait time. Collapsing all of these into a single star rating loses critical information.

Agent evaluation faces the same problem. An agent that resolves 70% of coding tasks but costs $8 per task, takes 15 minutes per run, and occasionally executes `rm -rf /` is not meaningfully comparable to one that resolves 55% of tasks at $0.50 per task in 30 seconds with no safety incidents. Single-metric leaderboards -- which dominate public benchmarks -- hide these tradeoffs.

A taxonomy of evaluation dimensions provides the structured vocabulary needed to make these tradeoffs explicit. It tells you what to measure, why each dimension matters, and how dimensions interact.

## How It Works

### The CLASS Framework

The CLASS framework (adapted from production AI system evaluation) organizes the primary dimensions:

| Dimension | Abbreviation | What It Measures |
|-----------|-------------|------------------|
| **C**ost | C | Total resource expenditure per task (tokens, API calls, compute) |
| **L**atency | L | Wall-clock time from task submission to completion |
| **A**ccuracy | A | Task completion rate, correctness, quality of output |
| **S**afety | S | Absence of harmful, dangerous, or policy-violating behaviors |
| **S**tability | S | Consistency of performance across runs, inputs, and environments |

This framework provides a useful starting point, but production agent evaluation requires additional dimensions.

### Extended Taxonomy

#### 1. Accuracy / Task Completion

The most obvious dimension. Measured as:
- **Pass rate**: Percentage of tasks where the agent produces a fully correct result
- **Partial credit**: Fraction of requirements satisfied (useful for complex multi-objective tasks)
- **Pass@k**: Probability of at least one success in $k$ independent attempts -- formally $\text{pass@k} = 1 - \binom{n-c}{k} / \binom{n}{k}$ where $n$ is total runs and $c$ is successful runs

#### 2. Cost

Direct financial cost of agent execution:
- **Token cost**: Input and output tokens consumed, priced at model-specific rates
- **Tool call cost**: API calls to external services (search, code execution, database queries)
- **Compute cost**: GPU time, sandbox infrastructure, environment setup/teardown
- Typical ranges: $0.01-$0.50 for simple tasks, $1-$10 for SWE-bench-class problems, $10-$100+ for extended research tasks

#### 3. Latency

Time dimensions:
- **End-to-end latency**: Total wall-clock time from input to final output
- **Time-to-first-action**: How quickly the agent begins meaningful work
- **Per-step latency**: Average time per decision point (important for interactive agents)
- Typical ranges: 5-30 seconds for simple tool-use tasks, 1-15 minutes for coding tasks, hours for research tasks

#### 4. Safety

Absence of harmful behavior:
- **Destructive actions**: File deletion, data corruption, unintended system modifications
- **Information leakage**: Exposing secrets, credentials, or private data
- **Policy violations**: Ignoring user constraints, exceeding authorized scope
- **Harmful content**: Generating unsafe code (SQL injection, buffer overflows) in outputs

#### 5. Reliability / Consistency

Stability across repeated runs:
- **Variance**: Standard deviation of success rate across multiple runs
- **Worst-case performance**: Minimum score observed across $n$ runs
- **Degradation patterns**: Whether performance drops under specific conditions (long context, complex inputs)
- See `the-non-determinism-problem.md` for statistical methods

#### 6. Tool Use Correctness

Quality of interaction with external tools:
- **Argument validity**: Are tool calls syntactically and semantically correct?
- **Tool selection**: Does the agent choose the right tool for the task?
- **Sequencing**: Are tool calls in a logical and efficient order?
- **Error handling**: Does the agent recover gracefully from tool failures?
- tau-bench measures this explicitly with per-tool accuracy metrics

#### 7. Planning Quality

Cognitive quality of the agent's approach:
- **Task decomposition**: Does the agent break complex tasks into appropriate subtasks?
- **Information gathering**: Does the agent collect necessary context before acting?
- **Backtracking**: Does the agent recognize and recover from wrong paths?
- **Over-engineering detection**: Does the agent add unnecessary complexity? (a key metric in Claude Code evaluations)

#### 8. Security and Compliance

Enterprise-critical dimensions:
- **Prompt injection resistance**: Does the agent resist adversarial inputs embedded in tool outputs?
- **Credential handling**: Does the agent properly manage secrets and access tokens?
- **Audit trail**: Does the agent produce sufficient logs for compliance review?
- **Scope adherence**: Does the agent stay within its authorized permissions?

### Why Single-Metric Evaluation Is Misleading

Consider two agents evaluated on SWE-bench Verified:

| Metric | Agent A | Agent B |
|--------|---------|---------|
| Resolve rate | 49% | 42% |
| Cost per instance | $4.20 | $0.35 |
| Median latency | 8 min | 45 sec |
| Safety incidents | 3 / 500 | 0 / 500 |
| Consistency (std dev) | 12% | 3% |

A leaderboard showing only resolve rate ranks Agent A higher. But Agent B is 12x cheaper, 10x faster, safer, and more consistent. For most production use cases, Agent B is the better choice. The single-metric framing actively misleads.

## Why It Matters

1. **Tradeoff-aware decision-making.** Real deployment decisions involve tradeoffs between dimensions. A taxonomy makes these tradeoffs explicit and negotiable rather than hidden.
2. **Preventing Goodhart's Law.** When a single metric becomes the target, agents (and their developers) optimize for it at the expense of unmeasured dimensions. A multi-dimensional taxonomy resists this.
3. **Stakeholder communication.** Different stakeholders care about different dimensions: engineers care about accuracy, finance cares about cost, security teams care about safety, users care about latency. A taxonomy provides a shared vocabulary.
4. **Regression detection.** Improving one dimension often regresses another. Multi-dimensional evaluation detects these regressions before they reach production.

## Key Technical Details

- The median SWE-bench instance costs $0.50-$5.00 across frontier agents, but the distribution is heavily right-skewed -- some instances cost $50+
- Agent latency follows a log-normal distribution: median and mean can differ by 3-5x
- Safety evaluation is often binary per-incident but should be weighted by severity -- a credential leak is worse than an unnecessary file creation
- Industry surveys show cost and latency are the most under-measured dimensions: teams frequently track accuracy but ignore efficiency
- The Pareto frontier across dimensions is the right optimization target -- not maximizing any single metric

## Common Misconceptions

**"Accuracy is the most important dimension."** For production systems, reliability and safety often dominate. An agent that solves 60% of tasks with zero safety incidents and low variance may be preferable to one that solves 75% of tasks but occasionally deletes files and has high run-to-run variance.

**"Cost is just a scaling issue."** Cost is a fundamental evaluation dimension, not a deployment detail. An agent that costs 10x more to achieve the same accuracy is a worse agent, full stop. Cost also constrains evaluation itself -- if each eval run costs $500, you cannot iterate quickly.

**"These dimensions are independent."** Dimensions interact strongly. Increasing the number of retries improves accuracy but increases cost and latency. Adding safety checks increases latency. Using cheaper models reduces cost but may reduce accuracy. Evaluation must capture these interactions.

**"You need to measure all dimensions for every evaluation."** Pragmatically, you should measure the dimensions that matter for your use case and phase. During research, accuracy dominates. During productionization, cost, latency, and safety become critical. But you should always measure at least accuracy + cost + one safety metric.

## Connections to Other Concepts

- `outcome-vs-process-evaluation.md` -- accuracy is primarily an outcome dimension; planning quality and tool use are process dimensions
- `the-non-determinism-problem.md` -- reliability/consistency is directly related to non-determinism
- `why-agent-evaluation-is-hard.md` -- the multi-dimensional nature of evaluation is one of the core challenges
- `../06-cost-quality-latency-tradeoffs/cost-per-task-metrics.md` -- deep dive into cost measurement
- `../07-safety-and-alignment-evaluation/safety-evaluation-frameworks.md` -- detailed safety dimension analysis
- `../05-statistical-methods-for-evaluation/confidence-intervals-for-agent-metrics.md` -- statistical rigor for each dimension

## Further Reading

- "Benchmarking Large Language Model Agent Systems: A Survey" -- Survey, 2024
- "CORE-Bench: Fostering the Credibility of Published Research through a Computational Reproducibility Agent Benchmark" -- Siegel et al., 2024
- "The CLASS Framework for Evaluating AI Systems in Production" -- Industry Report, 2024
- "Holistic Evaluation of Language Models (HELM)" -- Liang et al., 2023
- "Beyond Accuracy: Evaluating the Trustworthiness of AI Agent Systems" -- Workshop Paper, 2024
