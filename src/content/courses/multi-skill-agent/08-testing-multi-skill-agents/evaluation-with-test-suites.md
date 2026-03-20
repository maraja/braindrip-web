# Evaluation with Test Suites

**One-Line Summary**: How to build a structured evaluation harness of 20–50 tasks to measure agent performance using automated scoring methods including exact match, LLM-as-judge, and rubric-based assessment.

**Prerequisites**: `unit-testing-individual-skills.md`, `integration-testing-skill-chains.md`, basic understanding of LLM evaluation concepts

## What Is Evaluation with Test Suites?

Imagine hiring a new employee. You would not decide if they are competent based on a single task. You would give them a range of assignments — some easy, some hard, some routine, some novel — and evaluate their performance across the full set. An evaluation test suite for an agent works the same way: it is a curated collection of tasks with defined success criteria that, taken together, gives you a reliable picture of the agent's capabilities and limitations.

Evaluation test suites differ from unit and integration tests in a critical way: they test the agent as a complete system, including the LLM's reasoning. This means results are non-deterministic — the same agent might score 85% on one run and 82% on the next. The goal is not pass/fail on individual tasks but statistical measurement of aggregate performance: task completion rate, average number of steps, average cost, and quality of outputs. These metrics become the agent's scorecard, used to compare versions, detect regressions, and guide development priorities.

Building a good evaluation suite is part engineering and part test design. The tasks must span the agent's intended capabilities, vary in difficulty, cover edge cases, and have clear success criteria that can be scored automatically or semi-automatically. A suite of 20–50 tasks strikes the balance between statistical significance and practical running time.

## How It Works

### Designing Evaluation Tasks

Each evaluation task specifies an input, expected behavior, and scoring criteria.

```python
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Optional


class Difficulty(Enum):
    EASY = "easy"        # 1-2 skills, straightforward
    MEDIUM = "medium"    # 2-4 skills, some ambiguity
    HARD = "hard"        # 4+ skills, complex reasoning, edge cases


class ScoringMethod(Enum):
    EXACT_MATCH = "exact_match"
    CONTAINS = "contains"
    LLM_JUDGE = "llm_judge"
    RUBRIC = "rubric"
    CUSTOM = "custom"


@dataclass
class EvalTask:
    """A single evaluation task with scoring criteria."""
    task_id: str
    description: str
    input_prompt: str
    difficulty: Difficulty
    expected_skills: list[str]
    scoring_method: ScoringMethod
    scoring_config: dict = field(default_factory=dict)
    max_steps: int = 20
    max_cost_usd: float = 0.50
    timeout_seconds: int = 120
    tags: list[str] = field(default_factory=list)


# Example task suite covering different capabilities and difficulties
EVAL_SUITE = [
    EvalTask(
        task_id="search_001",
        description="Simple factual search",
        input_prompt="What is the population of Tokyo as of 2024?",
        difficulty=Difficulty.EASY,
        expected_skills=["web_search"],
        scoring_method=ScoringMethod.CONTAINS,
        scoring_config={"must_contain": ["13", "million"], "case_sensitive": False},
        tags=["search", "factual"],
    ),
    EvalTask(
        task_id="analysis_001",
        description="Multi-step data analysis",
        input_prompt="Download the CSV from [url], calculate the average sales "
                     "by region, and identify the top 3 regions.",
        difficulty=Difficulty.MEDIUM,
        expected_skills=["web_fetch", "code_executor"],
        scoring_method=ScoringMethod.RUBRIC,
        scoring_config={
            "rubric": [
                {"criterion": "Downloaded data correctly", "points": 2},
                {"criterion": "Calculated averages", "points": 3},
                {"criterion": "Identified correct top 3", "points": 3},
                {"criterion": "Clear presentation", "points": 2},
            ],
            "passing_score": 7,
        },
        tags=["analysis", "code", "data"],
    ),
    EvalTask(
        task_id="research_001",
        description="Complex multi-source research",
        input_prompt="Compare the climate policies of three G7 nations and "
                     "summarize their emissions reduction targets.",
        difficulty=Difficulty.HARD,
        expected_skills=["web_search", "text_extractor", "summarizer"],
        scoring_method=ScoringMethod.LLM_JUDGE,
        scoring_config={
            "judge_prompt": "Evaluate if this response accurately compares "
                           "climate policies of 3 G7 nations with specific "
                           "emissions targets. Score 1-5.",
            "passing_score": 3,
        },
        tags=["research", "synthesis", "multi-source"],
    ),
]
```

### Automated Scoring Methods

```python
from typing import Protocol


class Scorer(Protocol):
    async def score(self, task: EvalTask, agent_output: str) -> dict: ...


class ExactMatchScorer:
    """Scores based on exact string match (with optional normalization)."""

    async def score(self, task: EvalTask, agent_output: str) -> dict:
        expected = task.scoring_config["expected"]
        normalize = task.scoring_config.get("normalize", True)

        if normalize:
            agent_output = agent_output.strip().lower()
            expected = expected.strip().lower()

        passed = agent_output == expected
        return {"passed": passed, "score": 1.0 if passed else 0.0, "method": "exact_match"}


class ContainsScorer:
    """Scores based on presence of required strings in output."""

    async def score(self, task: EvalTask, agent_output: str) -> dict:
        must_contain = task.scoring_config["must_contain"]
        case_sensitive = task.scoring_config.get("case_sensitive", False)

        text = agent_output if case_sensitive else agent_output.lower()
        found = []
        missing = []

        for term in must_contain:
            check = term if case_sensitive else term.lower()
            if check in text:
                found.append(term)
            else:
                missing.append(term)

        score = len(found) / len(must_contain) if must_contain else 0.0
        return {
            "passed": score >= 1.0,
            "score": score,
            "found": found,
            "missing": missing,
            "method": "contains",
        }


class LLMJudgeScorer:
    """Uses an LLM to evaluate the quality of agent output."""

    def __init__(self, llm_client):
        self.llm_client = llm_client

    async def score(self, task: EvalTask, agent_output: str) -> dict:
        judge_prompt = f"""You are evaluating an AI agent's output.

Task given to agent: {task.input_prompt}

Agent's output:
{agent_output[:3000]}

Evaluation criteria: {task.scoring_config['judge_prompt']}

Respond with ONLY a JSON object:
{{"score": <1-5>, "reasoning": "<brief explanation>"}}"""

        response = await self.llm_client.generate(judge_prompt, max_tokens=200)
        import json
        result = json.loads(response.text)

        passing = task.scoring_config.get("passing_score", 3)
        return {
            "passed": result["score"] >= passing,
            "score": result["score"] / 5.0,
            "reasoning": result["reasoning"],
            "method": "llm_judge",
        }


class RubricScorer:
    """Scores based on a multi-criterion rubric using an LLM judge."""

    def __init__(self, llm_client):
        self.llm_client = llm_client

    async def score(self, task: EvalTask, agent_output: str) -> dict:
        rubric = task.scoring_config["rubric"]
        total_points = sum(c["points"] for c in rubric)
        criteria_text = "\n".join(
            f"- {c['criterion']} ({c['points']} points)" for c in rubric
        )

        judge_prompt = f"""Evaluate this agent output against a rubric.

Task: {task.input_prompt}

Output:
{agent_output[:3000]}

Rubric:
{criteria_text}

For each criterion, award 0 to max points. Respond with ONLY a JSON object:
{{"scores": [{{"criterion": "...", "awarded": N, "reason": "..."}}], "total": N}}"""

        response = await self.llm_client.generate(judge_prompt, max_tokens=500)
        import json
        result = json.loads(response.text)

        passing = task.scoring_config.get("passing_score", total_points * 0.7)
        return {
            "passed": result["total"] >= passing,
            "score": result["total"] / total_points,
            "details": result["scores"],
            "method": "rubric",
        }
```

### Building the Evaluation Harness

```python
import asyncio
import time
from dataclasses import dataclass


@dataclass
class EvalResult:
    task_id: str
    passed: bool
    score: float
    steps_taken: int
    cost_usd: float
    duration_seconds: float
    scoring_details: dict
    error: Optional[str] = None


class EvaluationHarness:
    """Runs an evaluation suite against an agent and collects metrics."""

    def __init__(self, agent, scorers: dict[ScoringMethod, Scorer]):
        self.agent = agent
        self.scorers = scorers

    async def run_suite(
        self, tasks: list[EvalTask], concurrency: int = 3
    ) -> list[EvalResult]:
        """Run all evaluation tasks with limited concurrency."""
        semaphore = asyncio.Semaphore(concurrency)
        results = []

        async def run_one(task: EvalTask) -> EvalResult:
            async with semaphore:
                return await self._evaluate_task(task)

        results = await asyncio.gather(
            *[run_one(task) for task in tasks],
            return_exceptions=True,
        )

        return [
            r if isinstance(r, EvalResult)
            else EvalResult(
                task_id="unknown", passed=False, score=0.0,
                steps_taken=0, cost_usd=0.0, duration_seconds=0.0,
                scoring_details={}, error=str(r),
            )
            for r in results
        ]

    async def _evaluate_task(self, task: EvalTask) -> EvalResult:
        start = time.time()

        try:
            agent_output = await asyncio.wait_for(
                self.agent.execute(task.input_prompt),
                timeout=task.timeout_seconds,
            )

            scorer = self.scorers[task.scoring_method]
            scoring_result = await scorer.score(task, agent_output.text)

            return EvalResult(
                task_id=task.task_id,
                passed=scoring_result["passed"],
                score=scoring_result["score"],
                steps_taken=agent_output.steps_taken,
                cost_usd=agent_output.cost_usd,
                duration_seconds=time.time() - start,
                scoring_details=scoring_result,
            )
        except asyncio.TimeoutError:
            return EvalResult(
                task_id=task.task_id, passed=False, score=0.0,
                steps_taken=0, cost_usd=0.0,
                duration_seconds=time.time() - start,
                scoring_details={}, error="Timeout",
            )
        except Exception as e:
            return EvalResult(
                task_id=task.task_id, passed=False, score=0.0,
                steps_taken=0, cost_usd=0.0,
                duration_seconds=time.time() - start,
                scoring_details={}, error=str(e),
            )

    def summarize(self, results: list[EvalResult]) -> dict:
        """Generate aggregate metrics from evaluation results."""
        passed = [r for r in results if r.passed]
        failed = [r for r in results if not r.passed]

        return {
            "total_tasks": len(results),
            "passed": len(passed),
            "failed": len(failed),
            "completion_rate": len(passed) / len(results) if results else 0,
            "avg_score": sum(r.score for r in results) / len(results) if results else 0,
            "avg_steps": sum(r.steps_taken for r in results) / len(results) if results else 0,
            "avg_cost_usd": sum(r.cost_usd for r in results) / len(results) if results else 0,
            "avg_duration_s": sum(r.duration_seconds for r in results) / len(results) if results else 0,
            "total_cost_usd": sum(r.cost_usd for r in results),
            "by_difficulty": self._group_by(results, lambda r: self._get_difficulty(r.task_id)),
            "by_tag": self._group_by_tags(results),
        }
```

### Recommended Suite Composition

A well-balanced 30-task suite:

| Difficulty | Count | Purpose |
|---|---|---|
| Easy | 10 | Baseline sanity — should pass 95%+ |
| Medium | 12 | Core competency — target 75–85% |
| Hard | 8 | Stretch capability — accept 50–65% |

Distribute scoring methods: 30% exact match / contains (cheap, fast), 40% rubric-based (thorough), 30% LLM-as-judge (flexible for open-ended tasks).

## Why It Matters

### Quantitative Development Decisions

Without an evaluation suite, agent development is driven by vibes — "it seems to work better now." With one, you can say "task completion rate went from 72% to 81% after adding the reflection step, at a cost increase of $0.03 per task." This enables data-driven decisions about which improvements to ship and which to revert.

### Comparing Agent Versions

Evaluation suites let you compare agent versions objectively: different LLM models, different prompt strategies, different tool configurations. Run the same suite against each version and compare completion rates, costs, and latencies. This is how you know whether GPT-4o or Claude performs better for your specific task distribution.

## Key Technical Details

- A suite of 20–50 tasks provides statistically meaningful results for most agents
- Run each suite at least 3 times and average results to account for LLM non-determinism
- Easy tasks should have a 95%+ pass rate; consistently failing easy tasks indicate bugs, not capability gaps
- LLM-as-judge scoring has 80–90% agreement with human raters on 5-point scales
- Budget approximately $1–5 per full suite run (varies by model and task complexity)
- Evaluation concurrency of 3–5 parallel tasks balances speed against rate limits
- Track metrics over time: completion rate, average steps, average cost, average duration
- Tag tasks by capability (search, code, analysis) to identify skill-specific weaknesses

## Common Misconceptions

**"More tasks in the suite is always better"**: Beyond 50 tasks, the marginal improvement in statistical confidence is small relative to the cost and time of running the suite. A well-designed 30-task suite with good coverage across difficulties and capabilities provides more signal than a 200-task suite with redundant easy tasks. Focus on task quality and coverage, not quantity.

**"LLM-as-judge is unreliable"**: LLM-as-judge achieves 80–90% agreement with human raters when the evaluation criteria are specific and well-defined. The key is a precise judging prompt. Vague criteria like "is this a good response?" produce unreliable scores. Specific criteria like "does the response include emissions reduction targets for at least 3 countries with specific numbers?" produce consistent scores.

## Connections to Other Concepts

- `unit-testing-individual-skills.md` — Unit tests form the base; evaluation suites are the top of the testing pyramid
- `integration-testing-skill-chains.md` — Integration tests verify skill chains; evaluation suites verify the full agent
- `regression-testing-for-agents.md` — Using evaluation suites to detect performance regressions over time
- `self-correction-and-reflection.md` — Evaluation suites measure the impact of self-correction on task success rates

## Further Reading

- Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" (2023) — Research validating LLM-as-judge approaches
- Liu et al., "AgentBench: Evaluating LLMs as Agents" (2023) — Comprehensive benchmark for agent evaluation
- Ribeiro et al., "Beyond Accuracy: Behavioral Testing of NLP Models with CheckList" (2020) — Systematic approach to building evaluation suites with capability coverage
