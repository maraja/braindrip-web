# Task Completion Metrics

**One-Line Summary**: Task completion metrics measure agent success through binary (pass/fail), graded (partial credit), and comparative (vs baseline) scoring systems, with domain-specific metrics for coding, research, and customer service tasks, addressing the fundamental challenge of defining what "done" means for diverse agent tasks.

**Prerequisites**: Agent evaluation methods, success criteria design, statistical measurement, domain-specific evaluation

## What Is Task Completion Metrics?

Imagine grading a student's essay. A math teacher might use binary grading (correct or incorrect). An English teacher might use a rubric with points for thesis, evidence, grammar, and style. A debate coach might compare the essay against other students' work. Each approach reveals different aspects of quality, and the best choice depends on what you are trying to measure. Task completion metrics for agents face the same design challenge: how do you measure whether an agent accomplished what it was supposed to?

Defining "done" for an agent task is surprisingly difficult. When is a coding task complete -- when the code compiles, when it passes tests, when it follows style guidelines, or when it solves the problem optimally? When is a research task complete -- when it finds one relevant source, when it synthesizes multiple sources, or when it provides a nuanced analysis? When is a customer service interaction complete -- when the customer's question is answered, when the underlying issue is resolved, or when the customer is satisfied?

*Recommended visual: Three-panel comparison showing binary metrics (pass/fail bar chart), graded metrics (radar chart with multiple quality dimensions), and comparative metrics (ELO-style ranking), illustrating what each paradigm reveals — see [Jimenez et al., 2024 — SWE-bench](https://arxiv.org/abs/2310.06770)*

Task completion metrics formalize these judgments into measurable, reproducible scores. The three primary paradigms -- binary, graded, and comparative -- each trade off simplicity against informativeness. The choice of metric shapes what gets optimized: binary metrics push for completion at any quality; graded metrics push for quality across dimensions; comparative metrics push for improvement relative to alternatives.

## How It Works

### Binary (Pass/Fail) Metrics

Binary metrics classify each task outcome as success or failure. For coding tasks: do all tests pass? For data extraction: does the output match the expected structure? For navigation: did the agent reach the target page? Binary metrics are unambiguous, easy to compute, and easy to aggregate (success rate = successes / total). Their weakness is that they lose information: a coding agent that passes 19 of 20 tests scores the same as one that passes 0. Binary metrics work best for tasks with clear, objective success criteria.

### Graded (Partial Credit) Metrics

Graded metrics assign scores on a continuous or multi-level scale. A research task might score 0.3 for finding relevant sources, 0.6 for accurate summarization, 0.8 for synthesis across sources, and 1.0 for nuanced analysis with caveats. Graded metrics capture quality gradations that binary metrics miss. Common implementations include rubric-based scoring (human or LLM evaluator scores against criteria), component scoring (each sub-task scored independently then aggregated), and Likert scales (1-5 quality ratings). The challenge is designing rubrics that are specific enough to be consistent across evaluators.

### Comparative (vs Baseline) Metrics

Comparative metrics evaluate the agent against a reference: another agent, a human, or a previous version. Instead of "how good is this output?", the question is "is this better than the baseline?" ELO ratings, win rates, and preference scores are comparative metrics. They are particularly useful for tasks where absolute quality is hard to define (creative writing, open-ended research) but relative quality is assessable. The main disadvantage is that scores are relative -- a win rate against a weak baseline is not informative.

*Recommended visual: Table showing domain-specific metrics — coding (test pass rate, code quality), research (factual accuracy, source quality), customer service (resolution rate, satisfaction) — with example scoring rubrics — see [Zhou et al., 2024 — WebArena](https://arxiv.org/abs/2307.13854)*

### Domain-Specific Metrics

Different task domains require specialized metrics. **Coding tasks**: test pass rate, code correctness (exact match or functional equivalence), code quality (linting, complexity), and whether the code solves the underlying problem (not just the test cases). **Research tasks**: factual accuracy (verified against ground truth), source quality (authority of cited sources), completeness (coverage of the topic), and coherence (logical flow of the analysis). **Customer service**: resolution rate (was the issue resolved), first-contact resolution (resolved without escalation), customer satisfaction (post-interaction survey), and response appropriateness (tone, accuracy).

## Why It Matters

### Defining Success Drives Behavior

The metric chosen shapes agent development. If the metric is binary test-passing, developers optimize for test-passing (potentially at the expense of code quality or readability). If the metric is graded quality, developers optimize across quality dimensions. Choosing the right metric is a design decision with significant downstream consequences -- the agent will optimize for whatever you measure.

### Partial Credit Reveals Improvement Opportunities

Binary metrics hide progress. An agent that improves from passing 0 of 20 tests to passing 18 of 20 shows zero improvement if the binary metric is "all tests pass." Graded metrics reveal this progress and guide development effort toward the remaining gaps. For iterative agent development, graded metrics provide much richer signal.

### Standardized Metrics Enable Comparison

When the community agrees on metrics for a task category, different agents can be meaningfully compared. The coding agent community's adoption of SWE-bench's "resolved" metric (does the generated patch resolve the issue and pass tests?) enables direct comparison across research papers. Without standardized metrics, each paper evaluates on its own criteria, making comparison impossible.

## Key Technical Details

- **Test-as-oracle for coding**: For coding tasks, automated test suites serve as evaluation oracles. But tests can be incomplete (missing edge cases), overfitted (only testing the specific solution approach), or wrong (tests that pass for incorrect code). High-quality evaluation requires well-crafted test suites that cover diverse solution approaches.
- **Inter-annotator agreement**: For graded metrics using human evaluators, measure inter-annotator agreement (Cohen's kappa or Krippendorff's alpha). Agreement below 0.7 suggests the rubric needs refinement. Low agreement means the metric is measuring evaluator variance, not agent quality.
- **Aggregation methods**: When a task has multiple metric dimensions, aggregation method matters. Simple averaging weights all dimensions equally. Weighted averaging reflects dimension importance. Minimum score (weakest dimension determines the grade) enforces baseline quality across all dimensions.
- **Metric sensitivity**: A good metric is sensitive to meaningful quality differences and insensitive to irrelevant variation. A coding metric that scores formatting differences the same as logical errors has poor sensitivity. Test metrics on known-quality examples to verify they discriminate meaningfully.
- **Partial credit calibration**: Graded metrics need calibration: what score corresponds to "barely acceptable," "good," and "excellent"? Calibrate by scoring a set of known-quality outputs and adjusting the rubric until scores match expectations.
- **Time-to-completion as a metric**: Beyond quality, time to completion matters for user experience. Two agents that produce identical quality outputs differ meaningfully if one takes 10 seconds and the other takes 5 minutes.
- **Metric gaming**: Agents optimized heavily on a metric will find ways to game it. Periodically review whether metric improvements correspond to actual quality improvements, and update metrics when gaming is detected.

## Common Misconceptions

- **"Binary metrics are always inferior to graded metrics."** Binary metrics are appropriate when the task has truly binary success criteria (the file was uploaded or it was not, the email was sent or it was not). Forcing graded metrics onto binary tasks creates artificial distinctions. Choose the metric that matches the task's natural success structure.

- **"Higher scores always mean better performance."** Metric scores are only as good as the metric design. A high score on a poorly designed metric is meaningless. Always validate that metric improvements correspond to genuine quality improvements through spot-checking and human review.

- **"One metric is sufficient."** No single metric captures all quality dimensions. A coding agent with 100% test pass rate but terrible code readability is not truly high-quality. A multi-dimensional evaluation with separate metrics for different quality aspects provides a complete picture.

- **"Comparative metrics are enough for development."** Comparative metrics tell you which version is better but not whether either version is good enough for deployment. You need absolute metrics (is the success rate above the deployment threshold?) in addition to comparative metrics.

## Connections to Other Concepts

- `agent-evaluation-methods.md` -- Task completion metrics are one component of the broader evaluation framework, providing the quantitative scores that evaluation methods produce.
- `trajectory-evaluation.md` -- Task completion metrics measure outcomes; trajectory evaluation measures process. Together they provide a complete picture of agent quality.
- `agent-benchmarks.md` -- Benchmarks define standardized tasks with standardized metrics, enabling cross-agent comparison on consistent criteria.
- `cost-efficiency-metrics.md` -- Task completion metrics combined with cost data yield cost-efficiency metrics (cost per successful completion).
- `regression-testing.md` -- Task completion metrics on a fixed test suite form the basis of regression testing, detecting quality degradation over time.

## Further Reading

- **Jimenez et al., 2024** -- "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" Defines the "resolved" metric for coding agent evaluation, becoming the standard evaluation metric for software engineering agents.
- **Hendrycks et al., 2021** -- "Measuring Massive Multitask Language Understanding." Introduces the MMLU benchmark with standardized accuracy metrics, demonstrating how metric standardization enables meaningful comparison.
- **Zhou et al., 2024** -- "WebArena: A Realistic Web Environment for Building Autonomous Agents." Defines task-specific completion metrics for web navigation tasks, including partial credit for sub-task completion.
- **Mialon et al., 2023** -- "GAIA: A Benchmark for General AI Assistants." Proposes evaluation metrics for general-purpose assistant tasks, addressing the challenge of measuring open-ended task completion.
