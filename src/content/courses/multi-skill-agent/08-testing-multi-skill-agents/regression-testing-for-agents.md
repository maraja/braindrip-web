# Regression Testing for Agents

**One-Line Summary**: Techniques for ensuring that changes to an agent do not break existing capabilities, including golden test sets, trajectory snapshot testing, statistical regression detection, and CI/CD integration.

**Prerequisites**: `evaluation-with-test-suites.md`, `integration-testing-skill-chains.md`, familiarity with CI/CD concepts

## What Is Regression Testing for Agents?

Imagine a hospital that updates its treatment protocols. Before rolling out a new protocol, they verify that it does not make outcomes worse for patients who were already being treated successfully. They maintain a registry of cases with known good outcomes and check new protocols against it. Regression testing for agents works the same way: you maintain a set of tasks with known good results and verify that every change to the agent still handles them correctly.

Regression testing is uniquely challenging for AI agents because of non-determinism. A traditional software regression test is binary — the function returns the right answer or it does not. An agent might produce a slightly different but equally valid answer each time. It might take 5 steps instead of 4, or use a different tool sequence that still reaches the correct result. This means regression testing for agents requires statistical approaches: instead of asking "did this specific test case pass?", you ask "did the pass rate on this set of test cases drop by a statistically significant amount?"

The goal is to catch two types of regressions: capability regressions (the agent can no longer do something it used to do) and efficiency regressions (the agent still succeeds but takes more steps, more time, or more money). Both matter in production. A capability regression means users see failures. An efficiency regression means costs increase and latencies grow, even if the final answer is correct.

## How It Works

### Golden Test Sets

A golden test set is a curated collection of tasks with verified-correct outputs. These are your highest-confidence regression indicators.

```python
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


@dataclass
class GoldenTestCase:
    """A test case with a verified-correct reference output."""
    test_id: str
    input_prompt: str
    reference_output: str
    acceptable_variations: list[str]
    required_facts: list[str]
    max_acceptable_steps: int
    max_acceptable_cost: float
    category: str
    added_date: str
    last_verified: str


def load_golden_set(path: Path) -> list[GoldenTestCase]:
    """Load golden test cases from a JSON file."""
    with open(path) as f:
        data = json.load(f)
    return [GoldenTestCase(**case) for case in data["test_cases"]]


class GoldenSetValidator:
    """Validates agent output against golden test cases."""

    def __init__(self, llm_client):
        self.llm_client = llm_client

    async def validate(
        self, case: GoldenTestCase, agent_output: str, steps: int, cost: float
    ) -> dict:
        # Check required facts
        facts_present = []
        facts_missing = []
        output_lower = agent_output.lower()

        for fact in case.required_facts:
            if fact.lower() in output_lower:
                facts_present.append(fact)
            else:
                facts_missing.append(fact)

        fact_score = len(facts_present) / len(case.required_facts) if case.required_facts else 1.0

        # Check semantic equivalence with reference output
        equivalence = await self._check_equivalence(
            case.reference_output, agent_output
        )

        # Check efficiency
        efficiency_ok = (
            steps <= case.max_acceptable_steps
            and cost <= case.max_acceptable_cost
        )

        return {
            "test_id": case.test_id,
            "fact_score": fact_score,
            "facts_missing": facts_missing,
            "semantic_equivalence": equivalence,
            "efficiency_ok": efficiency_ok,
            "steps": steps,
            "cost": cost,
            "passed": fact_score >= 0.8 and equivalence >= 0.7 and efficiency_ok,
        }

    async def _check_equivalence(self, reference: str, candidate: str) -> float:
        prompt = f"""Compare these two responses for semantic equivalence.
Are they conveying the same key information?

Reference: {reference[:1500]}

Candidate: {candidate[:1500]}

Score from 0.0 (completely different) to 1.0 (semantically equivalent).
Respond with ONLY a JSON object: {{"score": <float>, "reason": "<brief>"}}"""

        response = await self.llm_client.generate(prompt, max_tokens=150)
        result = json.loads(response.text)
        return result["score"]
```

### Trajectory Snapshot Testing

Instead of just checking the final output, snapshot the entire agent trajectory (tool calls, intermediate results, decisions) and compare against a known-good trajectory.

```python
@dataclass
class TrajectoryStep:
    """A single step in an agent's execution trajectory."""
    step_number: int
    tool_name: str
    tool_params: dict
    tool_output_hash: str  # Hash of output, not full output (for storage)
    decision_reasoning: str
    duration_ms: int


@dataclass
class TrajectorySnapshot:
    """A complete snapshot of an agent's execution."""
    test_id: str
    steps: list[TrajectoryStep]
    final_output_hash: str
    total_steps: int
    total_duration_ms: int
    tools_used: list[str]
    timestamp: str


class TrajectoryComparator:
    """Compares agent trajectories against reference snapshots."""

    def compare(
        self, reference: TrajectorySnapshot, current: TrajectorySnapshot
    ) -> dict:
        # Compare tool sequence
        ref_tools = [s.tool_name for s in reference.steps]
        cur_tools = [s.tool_name for s in current.steps]
        tool_sequence_match = ref_tools == cur_tools

        # Compare tool set (order-independent)
        ref_tool_set = set(ref_tools)
        cur_tool_set = set(cur_tools)
        tools_added = cur_tool_set - ref_tool_set
        tools_removed = ref_tool_set - cur_tool_set

        # Compare step count
        step_delta = current.total_steps - reference.total_steps
        step_regression = step_delta > max(2, reference.total_steps * 0.5)

        # Compare duration
        duration_ratio = current.total_duration_ms / max(reference.total_duration_ms, 1)
        duration_regression = duration_ratio > 2.0

        return {
            "tool_sequence_match": tool_sequence_match,
            "tools_added": list(tools_added),
            "tools_removed": list(tools_removed),
            "step_delta": step_delta,
            "step_regression": step_regression,
            "duration_ratio": duration_ratio,
            "duration_regression": duration_regression,
            "has_regression": step_regression or duration_regression or len(tools_removed) > 0,
        }
```

### Statistical Regression Detection

Because agent outputs are non-deterministic, you need statistical methods to distinguish real regressions from random variation.

```python
import numpy as np
from scipy import stats


class RegressionDetector:
    """Detects statistically significant regressions in agent performance."""

    def __init__(self, significance_level: float = 0.05):
        self.significance_level = significance_level

    def detect_completion_rate_regression(
        self,
        baseline_results: list[bool],  # True = passed, from previous version
        current_results: list[bool],   # True = passed, from current version
    ) -> dict:
        """Test if completion rate has significantly decreased."""
        baseline_rate = sum(baseline_results) / len(baseline_results)
        current_rate = sum(current_results) / len(current_results)

        # Two-proportion z-test (one-sided: is current worse?)
        n1 = len(baseline_results)
        n2 = len(current_results)
        p1 = baseline_rate
        p2 = current_rate
        p_pooled = (sum(baseline_results) + sum(current_results)) / (n1 + n2)

        if p_pooled == 0 or p_pooled == 1:
            return {"regression_detected": False, "p_value": 1.0,
                    "baseline_rate": p1, "current_rate": p2}

        se = np.sqrt(p_pooled * (1 - p_pooled) * (1/n1 + 1/n2))
        z_stat = (p1 - p2) / se if se > 0 else 0
        p_value = 1 - stats.norm.cdf(z_stat)  # One-sided

        return {
            "regression_detected": p_value < self.significance_level,
            "p_value": p_value,
            "baseline_rate": p1,
            "current_rate": p2,
            "delta": p2 - p1,
            "z_statistic": z_stat,
        }

    def detect_efficiency_regression(
        self,
        baseline_steps: list[int],
        current_steps: list[int],
    ) -> dict:
        """Test if average step count has significantly increased."""
        # Welch's t-test (one-sided: is current using more steps?)
        t_stat, p_value_two_sided = stats.ttest_ind(
            current_steps, baseline_steps, equal_var=False
        )
        p_value = p_value_two_sided / 2  # One-sided

        return {
            "regression_detected": p_value < self.significance_level and t_stat > 0,
            "p_value": p_value,
            "baseline_mean": np.mean(baseline_steps),
            "current_mean": np.mean(current_steps),
            "delta": np.mean(current_steps) - np.mean(baseline_steps),
            "t_statistic": t_stat,
        }

    def minimum_sample_size(
        self, baseline_rate: float, detectable_drop: float, power: float = 0.8
    ) -> int:
        """Calculate minimum runs needed to detect a given regression."""
        from statsmodels.stats.power import NormalIndPower
        analysis = NormalIndPower()
        effect_size = detectable_drop / np.sqrt(
            baseline_rate * (1 - baseline_rate)
        )
        n = analysis.solve_power(
            effect_size=effect_size,
            alpha=self.significance_level,
            power=power,
            alternative="larger",
        )
        return int(np.ceil(n))
```

### CI/CD Integration

Integrate regression testing into your deployment pipeline so regressions are caught before reaching production.

```yaml
# .github/workflows/agent-regression.yml
name: Agent Regression Tests

on:
  pull_request:
    paths:
      - 'agent/**'
      - 'prompts/**'
      - 'tools/**'

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements-test.txt
      - run: pytest tests/unit/ -v --tb=short

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements-test.txt
      - run: pytest tests/integration/ -v --tb=short

  regression-eval:
    runs-on: ubuntu-latest
    needs: integration-tests
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements-test.txt
      - name: Run regression suite (3 trials)
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          python scripts/run_regression.py \
            --suite golden_tests.json \
            --trials 3 \
            --baseline results/baseline.json \
            --output results/current.json \
            --significance 0.05
      - name: Check for regressions
        run: |
          python scripts/check_regression.py \
            --baseline results/baseline.json \
            --current results/current.json \
            --fail-on-regression
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: regression-results
          path: results/
```

```python
# scripts/run_regression.py
import argparse
import asyncio
import json


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--suite", required=True)
    parser.add_argument("--trials", type=int, default=3)
    parser.add_argument("--baseline", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--significance", type=float, default=0.05)
    args = parser.parse_args()

    suite = load_golden_set(Path(args.suite))
    agent = build_agent()
    harness = EvaluationHarness(agent, scorers=build_scorers())

    all_results = []
    for trial in range(args.trials):
        print(f"Trial {trial + 1}/{args.trials}")
        results = await harness.run_suite(suite)
        all_results.extend(results)

    # Save results
    with open(args.output, "w") as f:
        json.dump({
            "trials": args.trials,
            "results": [
                {
                    "task_id": r.task_id,
                    "passed": r.passed,
                    "score": r.score,
                    "steps": r.steps_taken,
                    "cost": r.cost_usd,
                    "duration": r.duration_seconds,
                }
                for r in all_results
            ],
        }, f, indent=2)

    # Compare against baseline
    with open(args.baseline) as f:
        baseline_data = json.load(f)

    detector = RegressionDetector(significance_level=args.significance)
    baseline_passed = [r["passed"] for r in baseline_data["results"]]
    current_passed = [r.passed for r in all_results]

    result = detector.detect_completion_rate_regression(baseline_passed, current_passed)
    print(f"Baseline rate: {result['baseline_rate']:.1%}")
    print(f"Current rate:  {result['current_rate']:.1%}")
    print(f"P-value:       {result['p_value']:.4f}")
    print(f"Regression:    {'YES' if result['regression_detected'] else 'No'}")


if __name__ == "__main__":
    asyncio.run(main())
```

## Why It Matters

### Preventing Silent Degradation

Agent systems have many knobs — prompts, tool configurations, model versions, temperature settings. Changing one knob can silently break a capability that no one tests manually. Without regression testing, these regressions accumulate until users complain. With regression testing, you catch them before deployment.

### Confidence to Iterate

Regression tests give developers confidence to make changes. Without them, teams become afraid to update prompts or refactor tool code because they cannot verify that existing capabilities still work. This fear slows development and leads to technical debt. A solid regression suite acts as a safety net that enables rapid iteration.

## Key Technical Details

- Run the golden test set at least 3 times per evaluation to account for non-determinism
- A suite of 30 tasks run 3 times gives 90 data points — sufficient to detect a 15% regression at p < 0.05
- To detect a 10% regression reliably, you need approximately 200 data points (50 tasks x 4 trials)
- Store baseline results in version control alongside the test suite
- Update baselines explicitly when performance improves — never auto-update
- Track both capability metrics (pass rate) and efficiency metrics (steps, cost, latency)
- CI/CD pipeline should gate deployment on regression checks passing
- Budget approximately $3–15 per regression run (varies by suite size and model)

## Common Misconceptions

**"Non-determinism makes regression testing impossible"**: Non-determinism makes individual test results unreliable, not the aggregate. With enough trials, statistical tests reliably detect real regressions. The key is running multiple trials and using proper statistical methods rather than treating each test as pass/fail. A 5% drop measured across 90 trials is statistically distinguishable from random variation.

**"You should update the golden set every time the agent improves"**: Golden test baselines should be updated deliberately, not automatically. When you improve the agent and the regression suite shows better performance, manually verify the improvement is real, then update the baseline. Automatic updates defeat the purpose of regression testing — they would silently accept degradations that happen to coincide with other changes.

## Connections to Other Concepts

- `evaluation-with-test-suites.md` — Evaluation suites provide the tasks; regression testing adds temporal comparison
- `unit-testing-individual-skills.md` — Unit tests run first in the CI pipeline; regression tests run after
- `integration-testing-skill-chains.md` — Integration tests catch structural regressions; regression tests catch behavioral ones
- `self-correction-and-reflection.md` — Regression tests verify that self-correction improvements are maintained over time
- `graceful-degradation.md` — Regression tests should include scenarios where degradation is the expected behavior

## Further Reading

- Ribeiro et al., "Beyond Accuracy: Behavioral Testing of NLP Models with CheckList" (2020) — Systematic approach to regression-aware testing of language models
- Breck et al., "The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction" (2017) — Google's framework for ML system testing maturity
- Srivastava et al., "Beyond the Imitation Game: Quantifying and Extrapolating the Capabilities of Language Models" (2022) — Large-scale benchmark methodology applicable to agent evaluation
