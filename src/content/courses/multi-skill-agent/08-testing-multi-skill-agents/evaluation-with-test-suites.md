# Evaluation with Test Suites

**One-Line Summary**: How to build a structured evaluation harness of 20-50 tasks to measure agent performance using automated scoring methods including exact match, LLM-as-judge, and rubric-based assessment.

**Prerequisites**: `unit-testing-individual-skills.md`, `integration-testing-skill-chains.md`, basic understanding of LLM evaluation concepts

## What Is Evaluation with Test Suites?

Imagine hiring a new employee. You would not decide if they are competent based on a single task. You would give them a range of assignments -- some easy, some hard, some routine, some novel -- and evaluate their performance across the full set. An evaluation test suite for an agent works the same way: a curated collection of tasks with defined success criteria that gives you a reliable picture of the agent's capabilities and limitations.

Evaluation test suites differ from unit and integration tests in a critical way: they test the agent as a complete system, including the LLM's reasoning. Results are non-deterministic -- the same agent might score 85% on one run and 82% on the next. The goal is statistical measurement of aggregate performance: task completion rate, average steps, average cost, and output quality.

Building a good evaluation suite is part engineering and part test design. Tasks must span the agent's intended capabilities, vary in difficulty, cover edge cases, and have clear success criteria that can be scored automatically. A suite of 20-50 tasks strikes the balance between statistical significance and practical running time.

## How It Works

### Designing Evaluation Tasks

```python
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional

class Difficulty(Enum):
    EASY = "easy"      # 1-2 skills, straightforward
    MEDIUM = "medium"  # 2-4 skills, some ambiguity
    HARD = "hard"      # 4+ skills, complex reasoning

class ScoringMethod(Enum):
    EXACT_MATCH = "exact_match"
    CONTAINS = "contains"
    LLM_JUDGE = "llm_judge"
    RUBRIC = "rubric"

@dataclass
class EvalTask:
    task_id: str
    input_prompt: str
    difficulty: Difficulty
    scoring_method: ScoringMethod
    scoring_config: dict = field(default_factory=dict)
    max_steps: int = 20
    max_cost_usd: float = 0.50
    tags: list[str] = field(default_factory=list)

EVAL_SUITE = [
    EvalTask(task_id="search_001", input_prompt="What is the population of Tokyo?",
             difficulty=Difficulty.EASY, scoring_method=ScoringMethod.CONTAINS,
             scoring_config={"must_contain": ["13", "million"]}, tags=["search"]),
    EvalTask(task_id="analysis_001",
             input_prompt="Download the CSV, calculate average sales by region, find top 3.",
             difficulty=Difficulty.MEDIUM, scoring_method=ScoringMethod.RUBRIC,
             scoring_config={"rubric": [
                 {"criterion": "Calculated averages", "points": 3},
                 {"criterion": "Correct top 3", "points": 3},
                 {"criterion": "Clear presentation", "points": 2}],
                 "passing_score": 6}, tags=["analysis", "code"]),
    EvalTask(task_id="research_001",
             input_prompt="Compare climate policies of three G7 nations.",
             difficulty=Difficulty.HARD, scoring_method=ScoringMethod.LLM_JUDGE,
             scoring_config={"judge_prompt": "Does this accurately compare 3 G7 nations "
                            "with specific emissions targets? Score 1-5.", "passing_score": 3},
             tags=["research", "synthesis"]),
]
```

### Automated Scoring Methods

```python
class ContainsScorer:
    async def score(self, task: EvalTask, output: str) -> dict:
        terms = task.scoring_config["must_contain"]
        text = output.lower()
        found = [t for t in terms if t.lower() in text]
        score = len(found) / len(terms) if terms else 0.0
        return {"passed": score >= 1.0, "score": score, "missing": list(set(terms) - set(found))}

class LLMJudgeScorer:
    def __init__(self, llm_client):
        self.llm = llm_client

    async def score(self, task: EvalTask, output: str) -> dict:
        prompt = f"""Task: {task.input_prompt}\nOutput: {output[:3000]}
Criteria: {task.scoring_config['judge_prompt']}
Respond with JSON: {{"score": <1-5>, "reasoning": "<brief>"}}"""
        response = await self.llm.generate(prompt, max_tokens=200)
        result = json.loads(response.text)
        passing = task.scoring_config.get("passing_score", 3)
        return {"passed": result["score"] >= passing, "score": result["score"] / 5.0,
                "reasoning": result["reasoning"]}

class RubricScorer:
    def __init__(self, llm_client):
        self.llm = llm_client

    async def score(self, task: EvalTask, output: str) -> dict:
        rubric = task.scoring_config["rubric"]
        total = sum(c["points"] for c in rubric)
        criteria = "\n".join(f"- {c['criterion']} ({c['points']} pts)" for c in rubric)
        prompt = f"""Task: {task.input_prompt}\nOutput: {output[:3000]}
Rubric:\n{criteria}\nAward 0 to max points per criterion.
Respond with JSON: {{"scores": [...], "total": N}}"""
        result = json.loads((await self.llm.generate(prompt, max_tokens=500)).text)
        passing = task.scoring_config.get("passing_score", total * 0.7)
        return {"passed": result["total"] >= passing, "score": result["total"] / total}
```

### Building the Evaluation Harness

```python
import asyncio, time

@dataclass
class EvalResult:
    task_id: str
    passed: bool
    score: float
    steps_taken: int
    cost_usd: float
    duration_seconds: float
    error: Optional[str] = None

class EvaluationHarness:
    def __init__(self, agent, scorers: dict):
        self.agent = agent
        self.scorers = scorers

    async def run_suite(self, tasks: list[EvalTask], concurrency: int = 3) -> list[EvalResult]:
        sem = asyncio.Semaphore(concurrency)
        async def run_one(task):
            async with sem:
                return await self._evaluate_task(task)
        return await asyncio.gather(*[run_one(t) for t in tasks])

    async def _evaluate_task(self, task: EvalTask) -> EvalResult:
        start = time.time()
        try:
            output = await asyncio.wait_for(self.agent.execute(task.input_prompt),
                                            timeout=120)
            result = await self.scorers[task.scoring_method].score(task, output.text)
            return EvalResult(task.task_id, result["passed"], result["score"],
                              output.steps_taken, output.cost_usd, time.time() - start)
        except Exception as e:
            return EvalResult(task.task_id, False, 0.0, 0, 0.0, time.time() - start, str(e))

    def summarize(self, results: list[EvalResult]) -> dict:
        n = len(results)
        return {
            "completion_rate": sum(r.passed for r in results) / n,
            "avg_score": sum(r.score for r in results) / n,
            "avg_steps": sum(r.steps_taken for r in results) / n,
            "avg_cost_usd": sum(r.cost_usd for r in results) / n,
            "total_cost_usd": sum(r.cost_usd for r in results),
        }
```

### Recommended Suite Composition

A well-balanced 30-task suite: 10 easy (baseline, should pass 95%+), 12 medium (core competency, target 75-85%), 8 hard (stretch capability, accept 50-65%). Distribute scoring: 30% exact match/contains, 40% rubric-based, 30% LLM-as-judge.

## Why It Matters

### Quantitative Development Decisions

Without an evaluation suite, agent development is driven by vibes. With one, you can say "completion rate went from 72% to 81% after adding the reflection step, at a cost increase of $0.03 per task." This enables data-driven decisions about which improvements to ship.

### Comparing Agent Versions

Run the same suite against different LLM models, prompt strategies, or tool configurations. This is how you know whether GPT-4o or Claude performs better for your specific task distribution.

## Key Technical Details

- A suite of 20-50 tasks provides statistically meaningful results
- Run each suite at least 3 times and average results for non-determinism
- Easy tasks should pass 95%+; consistent failures indicate bugs, not capability gaps
- LLM-as-judge has 80-90% agreement with human raters on 5-point scales
- Budget $1-5 per full suite run depending on model and complexity
- Concurrency of 3-5 parallel tasks balances speed against rate limits
- Tag tasks by capability (search, code, analysis) to identify skill-specific weaknesses

## Common Misconceptions

**"More tasks is always better"**: Beyond 50 tasks, marginal improvement in statistical confidence is small relative to cost and time. A well-designed 30-task suite with good difficulty and capability coverage provides more signal than a 200-task suite with redundant easy tasks.

**"LLM-as-judge is unreliable"**: It achieves 80-90% human agreement when criteria are specific. "Is this good?" produces unreliable scores. "Does the response include emissions targets for at least 3 countries with specific numbers?" produces consistent scores.

## Connections to Other Concepts

- `unit-testing-individual-skills.md` -- Unit tests form the base; evaluation suites are the top of the testing pyramid
- `integration-testing-skill-chains.md` -- Integration tests verify chains; evaluation suites verify the full agent
- `regression-testing-for-agents.md` -- Using evaluation suites to detect performance regressions over time

## Further Reading

- Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" (2023) -- Validating LLM-as-judge approaches
- Liu et al., "AgentBench: Evaluating LLMs as Agents" (2023) -- Comprehensive benchmark for agent evaluation
- Ribeiro et al., "Beyond Accuracy: Behavioral Testing of NLP Models with CheckList" (2020) -- Systematic evaluation suite design
