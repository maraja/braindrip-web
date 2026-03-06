# Evaluation at Scale

**One-Line Summary**: Scaling agent evaluation from 50 hand-run tasks to 50,000 automated runs requires fundamental shifts in infrastructure, organization, data management, and cost discipline -- transforming evaluation from a developer activity into a production service.

**Prerequisites**: `the-evaluation-triangle.md`, `cost-controlled-benchmarking.md`, `evaluation-budget-optimization.md`, `../08-evaluation-tooling-and-infrastructure/evaluation-pipeline-architecture.md`

## What Is Evaluation at Scale?

Consider the difference between a home kitchen and a commercial bakery. A home baker can taste every batch, adjust recipes by feel, and track results in a notebook. A commercial bakery producing 10,000 loaves daily needs production lines, quality sampling, batch tracking systems, and a quality assurance team. The recipes matter, but so does the entire operational infrastructure around them. Scaling agent evaluation follows the same trajectory.

At the early stage, one engineer runs 50 tasks on a laptop, eyeballs the results, and reports pass rates in a Slack message. This works when the evaluation suite is small, the team is small, and the stakes are low. But when you need to evaluate multiple agent configurations across hundreds of tasks with multiple runs each -- and do this repeatedly across weeks and months -- the manual approach collapses. You need distributed execution, automated result aggregation, cost tracking, trend analysis, and organizational processes to interpret and act on results.

The largest AI labs run evaluation at a scale most teams have never encountered. Anthropic, OpenAI, and Google DeepMind each maintain evaluation suites spanning tens of thousands of tasks, executed across hundreds of parallel workers, producing millions of data points per evaluation cycle. Understanding how evaluation operates at this scale reveals principles that apply at every scale -- because the challenges of coordination, cost, and data management emerge well before you reach 50,000 tasks.

## How It Works

### Infrastructure Requirements

#### Distributed Execution

At scale, evaluation tasks must run in parallel across many workers. A suite of 5,000 tasks with 10 runs each requires 50,000 individual task executions. At 5 minutes per execution, serial processing takes 173 days. With 100 parallel workers, it takes approximately 42 hours.

The execution infrastructure must handle:

- **Sandbox provisioning**: Each task needs an isolated environment (Docker container, VM, or managed sandbox) with the correct dependencies, repository state, and tool access. Provisioning 100+ sandboxes concurrently requires orchestration tooling (Kubernetes, cloud functions, or dedicated evaluation platforms).
- **Task scheduling**: Distribute tasks across workers while respecting dependencies, rate limits, and resource constraints. Some tasks require GPU access; others need specific API keys or network configurations.
- **Fault tolerance**: At 50,000 executions, infrastructure failures are certain. Workers crash, API calls time out, sandboxes run out of disk space. The system must retry failed tasks, detect stuck workers, and continue without losing completed results.
- **Resource scaling**: Evaluation demand is bursty -- peak demand before a release may be 10x the weekly average. Infrastructure must scale up for bursts and scale down to control costs.

#### Result Aggregation

Raw results from 50,000 executions must be aggregated into actionable metrics. This requires:

- Per-task pass rates with confidence intervals
- Per-category breakdowns (by difficulty, domain, task type)
- Cost and latency distributions per task and per configuration
- Comparison against previous evaluation runs (regression detection)
- Statistical significance tests for observed differences

Aggregation pipelines must handle incomplete results (some tasks may still be running), partial failures (some runs crashed but others succeeded), and multi-dimensional scoring (accuracy, cost, latency, trajectory quality simultaneously).

### Organizational Practices

#### Evaluation Teams

At scale, evaluation becomes a dedicated function, not a side responsibility. Large labs structure evaluation teams with distinct roles:

- **Evaluation engineers**: Build and maintain execution infrastructure, pipeline tooling, and result dashboards. Focus on reliability, speed, and cost efficiency.
- **Evaluation scientists**: Design evaluation suites, select metrics, perform statistical analysis, and interpret results. Focus on signal quality and experimental rigor.
- **Domain experts**: Create and curate tasks for specific domains (coding, research, customer service). Focus on task quality and relevance.
- **Evaluation reviewers**: Review evaluation design decisions, challenge metric choices, and approve release evaluations. Serve as a quality check on the evaluation process itself.

#### Evaluation Review Processes

Pre-release evaluation at scale requires formal review processes similar to code review:

1. **Evaluation plan review**: Before running an expensive evaluation, the plan (task selection, number of runs, metrics, acceptance criteria) is reviewed by evaluation scientists.
2. **Result review**: After execution, results are reviewed for anomalies -- unexpected score distributions, infrastructure artifacts, or statistical red flags.
3. **Decision review**: The interpretation of results (ship/no-ship, investigate further, accept regression) is discussed in a cross-functional meeting, not decided unilaterally.

#### Evaluation Dashboards

Real-time dashboards are essential for monitoring evaluation progress and results:

- **Execution dashboard**: Tasks completed, in progress, failed. Estimated time to completion. Cost accumulating.
- **Results dashboard**: Aggregate metrics updating as results arrive. Trend lines against historical baselines. Alerts for anomalies.
- **Cost dashboard**: Spend by model tier, by task category, by evaluation type. Budget remaining. Projected total cost.

### Data Management

#### Storing Evaluation Results

Millions of evaluation runs generate substantial data. A single run might produce:

- Task metadata (ID, category, difficulty, parameters): ~1 KB
- Agent trajectory (all LLM calls, tool invocations, intermediate outputs): 50-500 KB
- Environment state (file diffs, database changes, screenshots): 10 KB - 10 MB
- Evaluation scores (pass/fail, rubric scores, judge outputs): 1-10 KB

At 1 million runs, total storage ranges from 60 GB to 10 TB depending on what is retained. Most organizations adopt a tiered retention policy:

- **Hot storage** (30 days): Full trajectories and environment states for recent runs. Enables debugging and detailed analysis.
- **Warm storage** (6 months): Aggregated metrics, sampled trajectories, and full metadata. Supports trend analysis and regression investigation.
- **Cold storage** (indefinite): Aggregate metrics and metadata only. Provides long-term trend baselines.

#### Querying Results Efficiently

Evaluation queries span multiple dimensions: "Show me the pass rate for coding tasks at difficulty 3+ on the latest agent version, compared to the version from two weeks ago, broken down by repository." Efficient querying requires:

- Columnar storage (Parquet, ClickHouse) for fast aggregation across millions of rows
- Pre-computed rollups for common query patterns (by date, by category, by agent version)
- Indexing on task ID, agent version, date, and category for flexible ad-hoc queries

#### Tracking Trends Over Time

Long-term trend analysis reveals patterns invisible in individual evaluation runs:

- Gradual accuracy drift as model providers update their APIs
- Seasonal patterns in task difficulty (if tasks are drawn from live sources)
- Cost trends driven by API pricing changes
- The impact of accumulated evaluation suite improvements

### Cost Management at Scale

The arithmetic of scale is unforgiving. Consider a monthly evaluation cadence:

| Component | Unit Cost | Quantity | Monthly Cost |
|-----------|-----------|----------|-------------|
| Tasks     | --        | 5,000    | --          |
| Runs per task | $0.50 | 10       | --          |
| Total runs | $0.50   | 50,000   | $25,000     |
| Infrastructure | $0.05 | 50,000  | $2,500      |
| Human review (5%) | $10 | 2,500  | $25,000     |
| **Total** |           |          | **$52,500** |

At full scale -- 50,000 tasks, 10 runs each, $0.50/run -- a single evaluation cycle costs $250,000 in API calls alone. Adding infrastructure and human review can push the total past $300,000. This is why budget optimization techniques from `evaluation-budget-optimization.md` become existentially important at scale.

Cost management strategies include:

- **Tiered execution**: Run the full suite monthly, a 20% stratified sample weekly, and a 5% smoke test daily
- **Adaptive depth**: Allocate runs adaptively rather than uniformly (see `evaluation-budget-optimization.md`)
- **Caching**: Cache results for unchanged tasks when evaluating minor agent modifications
- **Spot pricing**: Use spot/preemptible instances for sandbox infrastructure to reduce compute costs by 60-70%

### The Transition: From Manual to Production Service

The evolution from manual evaluation to evaluation-as-a-service follows a predictable path:

**Stage 1 -- Ad hoc** (1-2 engineers): Scripts run on laptops. Results in spreadsheets. No reproducibility. Works for up to ~100 tasks.

**Stage 2 -- Scripted** (2-4 engineers): Evaluation scripts in a repository. Results in a database. Basic CI integration. Handles up to ~1,000 tasks.

**Stage 3 -- Orchestrated** (4-8 engineers, dedicated eval lead): Distributed execution on cloud infrastructure. Dashboards and alerting. Formal evaluation plans. Handles up to ~10,000 tasks.

**Stage 4 -- Production service** (dedicated eval team, 8-20 people): Evaluation runs as a managed internal service with SLAs. Self-service for agent teams. Full data management. Handles 50,000+ tasks.

Most organizations underestimate the infrastructure investment required to move from Stage 2 to Stage 3. The jump is not just more compute -- it is a fundamentally different operational model.

## Why It Matters

1. **Comprehensive coverage requires scale.** A 50-task evaluation samples a tiny fraction of real-world task diversity. Scaling to thousands of tasks is the only way to achieve meaningful coverage across difficulty levels, domains, and edge cases.
2. **Statistical power demands volume.** Detecting a 2-percentage-point regression with high confidence requires thousands of observations, not dozens. Scale is a prerequisite for rigorous statistical evaluation.
3. **Production decisions need production-grade evidence.** Shipping an agent to millions of users based on 50 evaluation tasks is like launching a drug based on 5 patients. Scale provides the evidence base that high-stakes decisions require.
4. **Organizational maturity tracks evaluation maturity.** Teams that invest in evaluation infrastructure make better, faster decisions about agent development, creating a compounding advantage over teams that evaluate ad hoc.

## Key Technical Details

- A 5,000-task evaluation with 10 runs at $0.50/run costs $25,000 in API calls per cycle
- Parallelizing across 100 workers reduces wall-clock time from 173 days to ~42 hours for 50,000 executions
- Full trajectory storage for 1 million runs requires 60 GB to 10 TB depending on retention granularity
- Large labs maintain 10,000-50,000 evaluation tasks across multiple benchmarks and internal suites
- The transition from manual to production-grade evaluation typically takes 6-12 months of dedicated engineering effort
- Spot/preemptible instance pricing reduces sandbox infrastructure costs by 60-70% with proper fault tolerance
- Pre-release evaluation cycles at top labs run 48-72 hours with hundreds of parallel workers

## Common Misconceptions

**"You can scale evaluation just by adding more machines."** More machines help with execution speed but do not address data management, result analysis, cost control, or organizational processes. Scaling evaluation is a systems problem, not just a compute problem.

**"Large evaluation suites are only for large companies."** The principles of structured evaluation -- stratified task selection, adaptive depth, trend tracking -- apply at every scale. A startup with 200 tasks benefits from the same organizational practices, just at smaller scale.

**"Running evaluation once is enough."** Evaluation is a continuous process, not a one-time event. Agent behavior changes with model updates, prompt changes, tool modifications, and environment drift. Regular re-evaluation is necessary to maintain confidence in agent quality.

**"The cost of evaluation is a sunk cost."** Evaluation costs should be viewed as an investment with measurable returns: fewer production incidents, faster iteration cycles, better agent quality. Teams that track the ROI of their evaluation investment consistently find it positive.

## Connections to Other Concepts

- `the-evaluation-triangle.md` provides the framework for understanding the thoroughness-cost-speed tradeoffs that define evaluation at scale
- `evaluation-budget-optimization.md` provides essential techniques for managing costs at scale through adaptive testing and progressive evaluation
- `cost-controlled-benchmarking.md` applies the cost discipline mindset to both agent evaluation and agent deployment
- `model-cascading-evaluation.md` is one example of a complex system that requires scale evaluation to validate properly
- `../08-evaluation-tooling-and-infrastructure/evaluation-pipeline-architecture.md` covers the engineering of evaluation execution pipelines
- `../08-evaluation-tooling-and-infrastructure/sandboxed-evaluation-environments.md` addresses the sandbox infrastructure critical to distributed evaluation
- `../08-evaluation-tooling-and-infrastructure/evaluation-result-analysis-and-visualization.md` covers the dashboards and analysis tools needed at scale
- `../09-production-evaluation-and-monitoring/online-vs-offline-evaluation.md` bridges pre-deployment evaluation at scale with continuous production monitoring

## Further Reading

- "Evaluating Language-Model Agents on Realistic Autonomous Tasks" -- METR, 2024
- "Holistic Evaluation of Language Models (HELM)" -- Liang et al., 2022
- "BIG-bench: A Collaborative Benchmark for Measuring and Extrapolating Language Model Capabilities" -- Srivastava et al., 2023
- "Scaling Evaluation Infrastructure for Foundation Models" -- Anthropic Research, 2025
- "The MLOps Lifecycle: From Experimentation to Production Evaluation" -- Shankar et al., 2024
