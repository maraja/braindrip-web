# CI/CD Integration for Agent Evaluation

**One-Line Summary**: Integrating agent evaluations into CI/CD pipelines transforms evaluation from an occasional manual activity into an automated quality gate that catches regressions before they reach production.

**Prerequisites**: `../01-foundations-of-agent-evaluation/what-is-agent-evaluation.md`, `evaluation-dataset-management.md`, `inspect-ai-and-open-source-frameworks.md`, `../05-statistical-methods-for-evaluation/sample-size-and-statistical-power.md`

## What Is CI/CD Integration for Agent Evaluation?

Software engineering learned decades ago that testing should not be a phase -- it should be continuous. Every commit triggers unit tests, every pull request triggers integration tests, and every release candidate passes through a full test suite. CI/CD (Continuous Integration / Continuous Delivery) pipelines automate this entirely, ensuring that no code reaches production without passing quality gates.

Agent evaluation faces the same need but with fundamentally harder constraints. Traditional software tests are deterministic: the same input always produces the same output, and a test either passes or fails. Agent evaluations are stochastic: the same prompt can produce different outputs across runs, and quality exists on a spectrum rather than a binary. A CI pipeline for agents must handle non-determinism, manage significant per-run costs (each evaluation may consume thousands of API calls), and make statistically sound pass/fail decisions rather than relying on exact-match assertions.

The "eval-as-code" pattern addresses these challenges by treating evaluation configurations as first-class code artifacts. Evaluation definitions, dataset references, scoring rubrics, and statistical thresholds are all checked into the repository alongside the agent code. When the agent changes, the evaluation runs automatically. When the evaluation criteria change, they go through the same code review process as any other change.

## How It Works

### Trigger Strategies

Different evaluation scopes are appropriate for different pipeline stages:

**Every commit (fast, cheap evals)**: Run a small suite of 20-50 tasks with deterministic or near-deterministic scoring. Focus on smoke tests: does the agent still produce valid outputs? Do basic tool calls still work? Are response formats correct? Target execution time under 5 minutes and cost under $1 per run.

**Every pull request (medium evals)**: Run 100-200 tasks covering core capabilities with LLM-as-judge scoring. Include regression tests for previously identified failure modes. Target execution time of 15-30 minutes and cost of $5-20 per run. This is the primary quality gate for code review.

**Pre-release (full eval suite)**: Run the complete evaluation suite of 500+ tasks across all capability categories, difficulty levels, and edge cases. Include multi-run statistical analysis for non-deterministic evaluations. Target execution time of 1-4 hours and cost of $50-200 per run. This is the gate for production deployment.

### Cost Management

Agent evaluations consume real API credits, making cost management essential:

- **Budget limits per pipeline run**: Set hard spending caps. If an evaluation exceeds its budget (due to runaway agent loops or unexpected token consumption), fail the run rather than draining the team's API budget. Typical limits: $2 for commit-level, $25 for PR-level, $300 for release-level.
- **Caching previous results**: If neither the agent code nor the evaluation dataset has changed, reuse cached results. Implement content-addressable caching keyed on the hash of agent code + dataset version + model version.
- **Incremental evaluation**: Only re-evaluate tasks in categories affected by the code change. If a PR modifies the tool-calling module, re-run tool-use evaluations but skip pure reasoning tasks. Requires mapping code paths to evaluation categories.
- **Model cost tiers**: Use cheaper models for commit-level evals (sufficient for basic regression detection) and reserve expensive frontier models for pre-release evaluation.

### Pass/Fail Criteria

Naive pass/fail criteria ("score > 0.85") fail in practice because evaluation scores have inherent variance. Robust criteria account for statistical uncertainty:

**Statistical thresholds**: Instead of "score > X," use "score > X with 95% confidence." This requires running multiple evaluation passes and computing confidence intervals. A score of 0.87 +/- 0.04 passes a threshold of 0.85; a score of 0.87 +/- 0.06 does not, because the lower bound of the confidence interval dips below the threshold.

**Regression detection**: Compare the current run against a baseline (typically the main branch's most recent evaluation). Flag regressions where the current score is statistically significantly lower than the baseline, using paired tests that account for task-level variance.

**Category-level gates**: Set different thresholds for different capability categories. An agent might need 95% accuracy on safety-critical tasks but only 80% on style/formatting tasks. Category-level gates prevent overall-score averaging from hiding regressions in critical areas.

**Trend-based alerts**: Beyond point-in-time thresholds, track score trends over the last N evaluations. A gradual decline that stays above the absolute threshold still warrants investigation.

### Handling Non-Determinism in Deterministic CI

CI systems expect deterministic outcomes: a pipeline either passes or fails, and rerunning it should produce the same result. Agent evaluations violate this expectation. Strategies to bridge the gap:

- **Multiple runs with aggregation**: Run each evaluation 3-5 times and use the median or mean score for pass/fail decisions. This reduces variance but multiplies cost proportionally.
- **Temperature pinning**: Set LLM temperature to 0 for evaluation runs. This does not guarantee determinism (top-p sampling and batching can still introduce variance) but substantially reduces it.
- **Flaky test policies**: Define a tolerance band. If an evaluation score falls within 2% of the threshold across multiple runs, classify it as "flaky" rather than "failed." Flaky results require human review rather than blocking the pipeline.
- **Seed-based reproducibility**: When the model provider supports it, fix the random seed for evaluation runs. This enables exact reproducibility for debugging while acknowledging that production behavior will vary.

### Pipeline Configuration Examples

A typical GitHub Actions workflow for agent evaluation:

```yaml
# .github/workflows/agent-eval.yml
on:
  push:
    branches: [main]
  pull_request:

jobs:
  quick-eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install inspect_ai
      - run: inspect eval tasks/smoke_tests.py --limit 50
        env:
          OPENAI_API_KEY: ${{ secrets.EVAL_API_KEY }}
          EVAL_BUDGET_LIMIT: "2.00"

  full-eval:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install inspect_ai
      - run: inspect eval tasks/full_suite.py --limit 500
      - run: python scripts/check_thresholds.py results/
```

### The Eval-as-Code Pattern

Treating evaluation as code means:

- **Evaluation configs live in the repo**: Task definitions, scoring rubrics, dataset references, and threshold configurations are version-controlled alongside agent code.
- **Changes go through code review**: Modifying a pass/fail threshold or changing the scoring rubric requires a pull request, just like changing agent behavior. This prevents evaluation criteria from silently drifting.
- **Evaluation code is tested**: Scorers have unit tests. Dataset loaders have integration tests. The evaluation infrastructure itself is evaluated.
- **History is preserved**: Git history shows not just how the agent changed over time, but how the evaluation criteria evolved alongside it.

## Why It Matters

1. **Catch regressions early**: Without automated evaluation, regressions in agent quality may not be detected until users report them. CI integration catches degradation within minutes of the responsible code change.
2. **Enforce quality standards**: Automated gates prevent the common failure mode where "we'll evaluate it later" becomes "we never evaluated it." The pipeline enforces the standard impartially.
3. **Enable faster iteration**: Paradoxically, mandatory evaluation gates speed up development by giving developers immediate feedback on whether their changes improved or degraded agent behavior.
4. **Create accountability**: When evaluation results are tied to specific commits and PRs, there is a clear audit trail connecting code changes to quality outcomes.
5. **Scale evaluation practice**: Manual evaluation does not scale with team size. CI-integrated evaluation scales automatically: more PRs simply mean more evaluation runs.

## Key Technical Details

- GitHub Actions provides 2,000 free minutes/month for public repos; private repos require paid plans
- Typical agent evaluation API costs: $0.01-0.10 per task (GPT-4-class), $0.001-0.01 per task (GPT-3.5-class)
- Content-addressable caching can reduce evaluation costs by 40-70% for incremental changes
- Confidence interval computation requires minimum 3 runs per evaluation; 5 runs provides substantially tighter bounds
- Docker-based sandboxes add 10-30 seconds overhead per pipeline run for container initialization
- Most teams converge on 3 evaluation tiers (commit/PR/release) within 6 months of adopting CI-integrated evaluation
- Evaluation pipelines should have their own timeout limits (typically 30-60 minutes) independent of the CI system's global timeout

## Common Misconceptions

**"Agent evaluation is too slow for CI."** The tiered approach solves this. Commit-level evaluations (20-50 tasks, deterministic scoring) complete in under 5 minutes. Only pre-release evaluations need the full multi-hour suite. Most regressions are caught at the fast tier.

**"Non-determinism makes CI evaluation unreliable."** Statistical methods exist precisely for this. Running multiple passes and applying confidence intervals converts stochastic evaluation into reliable pass/fail decisions. The key is budgeting for the additional runs.

**"Evaluation costs will spiral out of control."** Caching, incremental evaluation, and tiered model selection keep costs manageable. A well-optimized pipeline spends $100-500/month for a team making 50 PRs/week -- comparable to a single developer's cloud IDE subscription.

**"We can just use traditional unit tests for agents."** Unit tests verify specific code paths with exact expected outputs. Agent evaluation assesses emergent behavior across a distribution of inputs. Both are necessary, but they are not substitutes for each other.

## Connections to Other Concepts

- `inspect-ai-and-open-source-frameworks.md` provides the evaluation framework that CI pipelines invoke
- `evaluation-dataset-management.md` covers how to build and version the datasets that CI pipelines consume
- `evaluation-result-analysis-and-visualization.md` discusses how to interpret and visualize the results CI pipelines produce
- `sandboxed-evaluation-environments.md` addresses the isolated environments that CI-triggered evaluations run within
- `../05-statistical-methods-for-evaluation/sample-size-and-statistical-power.md` provides the statistical foundations for pass/fail threshold design
- `../06-cost-quality-latency-tradeoffs/cost-aware-evaluation-design.md` informs the cost management strategies for pipeline budgeting

## Further Reading

- "Continuous Integration for Machine Learning Systems" -- Sculley et al., 2015
- "Testing and Validating LLM-Based Applications" -- Ribeiro et al., 2023
- "The ML Test Score: A Rubric for ML Production Readiness" -- Breck et al. (Google), 2017
- "Inspect AI Documentation: Task Configuration and Execution" -- UK AISI, 2024
- "Evaluating Large Language Models in Production" -- Shankar et al., 2024
