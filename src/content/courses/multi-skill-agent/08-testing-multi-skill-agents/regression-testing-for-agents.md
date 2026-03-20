# Regression Testing for Agents

**One-Line Summary**: Techniques for ensuring that changes to an agent do not break existing capabilities, including golden test sets, trajectory snapshot testing, statistical regression detection, and CI/CD integration.

**Prerequisites**: `evaluation-with-test-suites.md`, `integration-testing-skill-chains.md`, familiarity with CI/CD concepts

## What Is Regression Testing for Agents?

Imagine a hospital that updates its treatment protocols. Before rolling out a new protocol, they verify that it does not make outcomes worse for patients who were already being treated successfully. Regression testing for agents works the same way: you maintain a set of tasks with known good results and verify that every change still handles them correctly.

Regression testing is uniquely challenging for AI agents because of non-determinism. A traditional software regression test is binary -- the function returns the right answer or it does not. An agent might produce a slightly different but equally valid answer each time. This means regression testing requires statistical approaches: instead of asking "did this test pass?", you ask "did the pass rate drop by a statistically significant amount?"

The goal is to catch two types of regressions: capability regressions (the agent can no longer do something it used to do) and efficiency regressions (the agent still succeeds but takes more steps, time, or money).

## How It Works

### Golden Test Sets

A golden test set is a curated collection of tasks with verified-correct outputs -- your highest-confidence regression indicators.

```python
from dataclasses import dataclass
from pathlib import Path
import json

@dataclass
class GoldenTestCase:
    test_id: str
    input_prompt: str
    reference_output: str
    required_facts: list[str]
    max_acceptable_steps: int
    max_acceptable_cost: float
    category: str

class GoldenSetValidator:
    def __init__(self, llm_client):
        self.llm = llm_client

    async def validate(self, case: GoldenTestCase, output: str, steps: int, cost: float) -> dict:
        output_lower = output.lower()
        facts_found = [f for f in case.required_facts if f.lower() in output_lower]
        fact_score = len(facts_found) / len(case.required_facts) if case.required_facts else 1.0

        equivalence = await self._check_equivalence(case.reference_output, output)
        efficiency_ok = steps <= case.max_acceptable_steps and cost <= case.max_acceptable_cost

        return {"test_id": case.test_id, "fact_score": fact_score,
                "semantic_equivalence": equivalence, "efficiency_ok": efficiency_ok,
                "passed": fact_score >= 0.8 and equivalence >= 0.7 and efficiency_ok}

    async def _check_equivalence(self, reference: str, candidate: str) -> float:
        prompt = f"""Compare for semantic equivalence. Score 0.0-1.0.
Reference: {reference[:1500]}
Candidate: {candidate[:1500]}
Respond with JSON: {{"score": <float>, "reason": "<brief>"}}"""
        result = json.loads((await self.llm.generate(prompt, max_tokens=150)).text)
        return result["score"]
```

### Snapshot Testing of Trajectories

Instead of just checking final output, snapshot the entire agent trajectory and compare against a known-good reference.

```python
@dataclass
class TrajectorySnapshot:
    test_id: str
    tools_used: list[str]
    total_steps: int
    total_duration_ms: int
    final_output_hash: str

class TrajectoryComparator:
    def compare(self, reference: TrajectorySnapshot, current: TrajectorySnapshot) -> dict:
        ref_tools = set(reference.tools_used)
        cur_tools = set(current.tools_used)
        step_delta = current.total_steps - reference.total_steps
        step_regression = step_delta > max(2, reference.total_steps * 0.5)
        duration_ratio = current.total_duration_ms / max(reference.total_duration_ms, 1)

        return {
            "tools_added": list(cur_tools - ref_tools),
            "tools_removed": list(ref_tools - cur_tools),
            "step_delta": step_delta,
            "step_regression": step_regression,
            "duration_ratio": duration_ratio,
            "has_regression": step_regression or duration_ratio > 2.0 or len(ref_tools - cur_tools) > 0,
        }
```

### Statistical Regression Detection

Non-determinism requires statistical methods to distinguish real regressions from random variation.

```python
import numpy as np
from scipy import stats

class RegressionDetector:
    def __init__(self, significance_level: float = 0.05):
        self.alpha = significance_level

    def detect_completion_rate_regression(
        self, baseline: list[bool], current: list[bool]
    ) -> dict:
        """Two-proportion z-test: has completion rate significantly decreased?"""
        n1, n2 = len(baseline), len(current)
        p1, p2 = sum(baseline) / n1, sum(current) / n2
        p_pool = (sum(baseline) + sum(current)) / (n1 + n2)
        if p_pool in (0, 1):
            return {"regression_detected": False, "p_value": 1.0}
        se = np.sqrt(p_pool * (1 - p_pool) * (1/n1 + 1/n2))
        z = (p1 - p2) / se if se > 0 else 0
        p_value = 1 - stats.norm.cdf(z)
        return {"regression_detected": p_value < self.alpha, "p_value": p_value,
                "baseline_rate": p1, "current_rate": p2, "delta": p2 - p1}

    def detect_efficiency_regression(
        self, baseline_steps: list[int], current_steps: list[int]
    ) -> dict:
        """Welch's t-test: has average step count significantly increased?"""
        t_stat, p_two = stats.ttest_ind(current_steps, baseline_steps, equal_var=False)
        p_value = p_two / 2
        return {"regression_detected": p_value < self.alpha and t_stat > 0,
                "baseline_mean": np.mean(baseline_steps),
                "current_mean": np.mean(current_steps)}
```

### CI/CD Integration

Integrate regression testing into your deployment pipeline so regressions are caught before production.

```yaml
# .github/workflows/agent-regression.yml
name: Agent Regression Tests
on:
  pull_request:
    paths: ['agent/**', 'prompts/**', 'tools/**']

jobs:
  regression-eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install -r requirements-test.txt
      - name: Run regression suite (3 trials)
        env: { OPENAI_API_KEY: '${{ secrets.OPENAI_API_KEY }}' }
        run: |
          python scripts/run_regression.py \
            --suite golden_tests.json --trials 3 \
            --baseline results/baseline.json \
            --output results/current.json --significance 0.05
      - name: Check for regressions
        run: python scripts/check_regression.py --baseline results/baseline.json \
            --current results/current.json --fail-on-regression
```

## Why It Matters

### Preventing Silent Degradation

Agent systems have many knobs -- prompts, tool configurations, model versions, temperature settings. Changing one knob can silently break a capability that no one tests manually. Without regression testing, these regressions accumulate until users complain. With it, you catch them before deployment.

### Confidence to Iterate

Regression tests give developers confidence to make changes. Without them, teams become afraid to update prompts or refactor tool code because they cannot verify existing capabilities still work. A solid regression suite acts as a safety net that enables rapid iteration.

## Key Technical Details

- Run the golden test set at least 3 times per evaluation to account for non-determinism
- 30 tasks x 3 trials = 90 data points, sufficient to detect a 15% regression at p < 0.05
- To detect a 10% regression reliably, you need ~200 data points (50 tasks x 4 trials)
- Store baseline results in version control alongside the test suite
- Update baselines explicitly when performance improves -- never auto-update
- Track both capability metrics (pass rate) and efficiency metrics (steps, cost, latency)
- Budget $3-15 per regression run depending on suite size and model

## Common Misconceptions

**"Non-determinism makes regression testing impossible"**: Non-determinism makes individual results unreliable, not the aggregate. With enough trials, statistical tests reliably detect real regressions. A 5% drop measured across 90 trials is statistically distinguishable from random variation.

**"You should update the golden set every time the agent improves"**: Baselines should be updated deliberately, not automatically. Manually verify improvements are real before updating. Automatic updates would silently accept degradations that coincide with other changes.

## Connections to Other Concepts

- `evaluation-with-test-suites.md` -- Evaluation suites provide the tasks; regression testing adds temporal comparison
- `unit-testing-individual-skills.md` -- Unit tests run first in CI; regression tests run after
- `integration-testing-skill-chains.md` -- Integration tests catch structural regressions; regression tests catch behavioral ones

## Further Reading

- Ribeiro et al., "Beyond Accuracy: Behavioral Testing of NLP Models with CheckList" (2020) -- Regression-aware testing of language models
- Breck et al., "The ML Test Score" (2017) -- Google's framework for ML system testing maturity
- Srivastava et al., "Beyond the Imitation Game" (2022) -- Large-scale benchmark methodology applicable to agent evaluation
