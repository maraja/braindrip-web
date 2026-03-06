# Evaluation Result Analysis and Visualization

**One-Line Summary**: Evaluation results only drive improvement when they are analyzed for actionable patterns and visualized in ways that communicate clearly to developers, managers, and stakeholders.

**Prerequisites**: `../01-foundations-of-agent-evaluation/what-is-agent-evaluation.md`, `../05-statistical-methods-for-evaluation/sample-size-and-statistical-power.md`, `evaluation-dataset-management.md`, `ci-cd-integration-for-agent-evaluation.md`

## What Is Evaluation Result Analysis?

A hospital does not just record patient vital signs -- it displays them on monitors with trend lines, threshold alerts, and color coding so that nurses and doctors can act quickly on meaningful changes. Raw numbers in a chart are data; a nurse noticing that blood pressure has been gradually rising over six hours is insight. The same distinction applies to agent evaluation. Running evaluations produces data; analysis and visualization transform that data into decisions.

Evaluation result analysis encompasses the full pipeline from raw scores to organizational action. This includes statistical analysis (are these differences significant?), failure mode identification (what patterns explain the failures?), comparative analysis (is version B better than version A?), and communication (what do stakeholders need to know?). Each audience -- developers debugging a regression, engineering managers prioritizing work, and executives deciding on deployment readiness -- needs results presented differently.

The discipline of result analysis is often underinvested. Teams spend weeks building evaluation infrastructure and hours running evaluations, then spend minutes glancing at aggregate scores. This is backwards. The analysis phase is where evaluation results become engineering decisions, and it deserves proportional investment.

## How It Works

### Dashboards and Score Tracking

Effective evaluation dashboards track multiple dimensions:

**Score trends over time**: Plot evaluation scores across agent versions, model updates, and dataset revisions. Time-series visualization reveals gradual degradation that point-in-time comparisons miss. Include confidence bands to distinguish meaningful trends from noise.

**Per-category breakdowns**: Aggregate scores hide important variation. An agent scoring 82% overall might score 95% on simple tasks and 45% on multi-step reasoning. Category-level dashboards expose these disparities and direct attention to the areas with the most room for improvement.

**Cost tracking**: Plot per-evaluation costs alongside quality scores. The goal is not to minimize cost or maximize quality independently, but to optimize the cost-quality frontier. Visualizing both together enables informed tradeoff decisions.

**Throughput and latency**: Track how long evaluations take to run, both in wall-clock time and in API tokens consumed. Increasing evaluation latency may signal agent inefficiency (more tool calls, longer reasoning chains) even when quality scores remain stable.

### Comparative Analysis

**Version-over-version comparison**: For each new agent version, generate a comparison report against the previous version. Show per-category score deltas with statistical significance indicators. Highlight categories where performance changed by more than one standard error in either direction.

**Model-over-model comparison**: When evaluating the same agent architecture across different underlying models (e.g., GPT-4o vs. Claude 3.5 Sonnet), use paired comparisons on the same evaluation tasks. Paired analysis removes task-difficulty variance, isolating the model's contribution to performance differences.

**Ablation analysis**: When an agent change modifies multiple components simultaneously, comparative analysis helps attribute performance changes. Run evaluations with each change individually to decompose the overall effect into component contributions.

### Failure Analysis

**Failure mode clustering**: Group failed evaluation tasks by similarity -- shared topics, similar error types, or common intermediate steps before failure. Manual inspection of 5-10 examples per cluster often reveals a single root cause. Common clusters include: tool selection errors, instruction following failures, hallucinated facts, and premature termination.

**Pattern identification**: Look for systematic patterns in failures. Do failures correlate with task length, number of required tool calls, specific tool types, or ambiguity in the task description? Correlation analysis between task metadata and failure rates surfaces structural weaknesses.

**Prioritizing fixes**: Not all failures are equally important. Prioritize by: frequency in production (how often do users encounter this failure mode?), severity (does the failure cause user harm or just inconvenience?), and fixability (is there a clear path to improvement?). A prioritization matrix combining these dimensions focuses engineering effort where it has the most impact.

### Visualization Techniques

**Confusion matrices for task categories**: When tasks fall into discrete categories, a confusion matrix shows where the agent succeeds and fails across categories. This is particularly useful for classification-style evaluations, revealing systematic biases (e.g., the agent consistently misclassifies "refund requests" as "complaints").

**Radar charts for multi-dimensional scores**: When an agent is evaluated across multiple capability dimensions (reasoning, tool use, safety, helpfulness, efficiency), radar charts provide an intuitive shape comparison between versions or models. A version that excels at reasoning but regresses on safety creates a visually distinct shape from a balanced improvement.

**Waterfall charts for score decomposition**: Break down an aggregate score into contributing components. For example, a composite score of 0.78 might decompose into: base accuracy (+0.85), multi-step penalty (-0.05), safety bonus (+0.03), efficiency adjustment (-0.05). Waterfall charts make these contributions visible and show where gains or losses originate.

**Heatmaps for cross-dimensional analysis**: Plot task difficulty on one axis and capability category on the other, with color intensity representing pass rate. Heatmaps quickly reveal which difficulty-category combinations are the agent's blind spots.

### Communicating to Different Audiences

**Developers** need detailed, task-level breakdowns: which specific tasks failed, what the agent's trajectory looked like, where in the reasoning chain things went wrong. They benefit from links directly to trace logs and diff views showing how agent behavior changed between versions.

**Engineering managers** need category-level trends and regression summaries: which capabilities improved, which regressed, what is the overall trajectory. They benefit from weekly or sprint-level evaluation reports that connect quality trends to the engineering work being done.

**Executives and stakeholders** need capability summaries and deployment readiness assessments: is the agent ready for the next use case? How does it compare to competitors? What are the remaining risks? They benefit from single-page summaries with clear go/no-go recommendations backed by the underlying data.

### Automated Alerting on Regressions

Proactive alerting prevents regressions from reaching production:

- **Threshold alerts**: Trigger when any category score drops below an absolute threshold (e.g., safety score below 0.95).
- **Regression alerts**: Trigger when any category score drops significantly relative to the rolling baseline (e.g., more than 2 standard deviations below the 10-run moving average).
- **Anomaly alerts**: Trigger on unusual patterns even if scores remain above thresholds -- sudden score variance increases, bimodal score distributions, or unexpected correlations between categories.
- **Cost alerts**: Trigger when evaluation cost per task increases beyond expected bounds, which may signal agent efficiency regressions.

## Why It Matters

1. **Bridge data to decisions**: Without analysis, evaluation results are just numbers. Analysis transforms them into engineering priorities, deployment decisions, and capability roadmaps.
2. **Detect subtle regressions**: Aggregate scores can remain stable while specific capabilities degrade. Dimensional analysis catches regressions that headline numbers miss.
3. **Accelerate debugging**: Failure clustering and pattern identification reduce the time from "the agent got worse" to "here is the specific code change causing the specific failure mode."
4. **Align stakeholders**: Different audiences need different views of the same data. Proper visualization prevents misunderstandings and builds organizational confidence in evaluation processes.
5. **Prevent normalization of failure**: Automated alerting ensures that regressions are noticed and addressed, not silently accepted as the new baseline.

## Key Technical Details

- Time-series score tracking should include at minimum: mean score, standard deviation, sample size, and 95% confidence interval per data point
- Version comparison reports typically use McNemar's test or paired bootstrap tests for statistical significance on per-task pass/fail data
- Failure clustering using embedding similarity (e.g., cosine similarity on task descriptions + agent outputs) typically reveals 5-15 distinct failure clusters for a 500-task evaluation
- Radar charts should display no more than 8-10 dimensions; beyond that, the visualization becomes unreadable
- Automated regression alerts should have a suppression window (typically 24-48 hours) to avoid alert fatigue from known temporary regressions
- Dashboard refresh cadence should match development velocity: continuous for CI-integrated teams, daily or weekly for slower-moving evaluations

## Common Misconceptions

**"A single aggregate score is sufficient for tracking quality."** Aggregate scores are useful headlines, but they compress away the dimensional information needed for debugging and prioritization. A score that goes from 0.83 to 0.82 might hide a safety regression from 0.97 to 0.88 offset by reasoning improvements.

**"Visualization is a nice-to-have, not a requirement."** Visualization is how humans process complex, multi-dimensional data. Teams that rely on raw score tables consistently miss patterns that would be obvious in a well-designed chart. Visualization is infrastructure, not decoration.

**"Automated alerts can replace human analysis."** Alerts catch known failure patterns (threshold violations, statistical regressions). They cannot catch novel failure modes, subtle behavioral shifts, or problems that only become apparent when combining information across multiple evaluation runs. Human analysis remains essential.

**"More charts means better communication."** Overloaded dashboards create information paralysis. Each visualization should answer a specific question for a specific audience. If you cannot articulate the decision a chart enables, remove it.

## Connections to Other Concepts

- `ci-cd-integration-for-agent-evaluation.md` produces the raw evaluation data that analysis and visualization consume
- `evaluation-dataset-management.md` influences how results should be stratified and compared across dataset versions
- `observability-platforms-for-evaluation.md` provides trace-level data for deep failure analysis
- `custom-evaluator-development.md` defines the scoring functions whose outputs flow into analysis pipelines
- `../05-statistical-methods-for-evaluation/sample-size-and-statistical-power.md` provides the statistical methods underlying comparative analysis and alerting
- `../09-production-evaluation-and-monitoring/online-evaluation-and-ab-testing.md` extends these analysis techniques to production monitoring

## Further Reading

- "Visualization Analysis and Design" -- Munzner, 2014
- "Effective Data Visualization: The Right Chart for the Right Data" -- Evergreen, 2019
- "Challenges in Deploying Machine Learning: A Survey of Case Studies" -- Paleyes et al., 2022
- "Holistic Evaluation of Language Models" -- Liang et al. (HELM), 2022
- "Communicating Data with Tableau" -- Jones, 2020
