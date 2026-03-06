# Reference-Free Evaluation

**One-Line Summary**: Reference-free evaluation assesses agent output quality without gold-standard answers, using methods like self-consistency checks, constraint satisfaction verification, logical coherence analysis, and execution-based testing.

**Prerequisites**: `../llm-concepts/llm-as-judge.md`, `rubric-engineering.md`, `code-execution-based-evaluation.md`

## What Is Reference-Free Evaluation?

Imagine grading a student's creative writing assignment. There is no single "correct" answer to compare against -- you cannot look up the right essay in an answer key. Instead, you evaluate internal qualities: Is the argument logically consistent? Does it meet the assignment constraints (word count, topic, format)? Is the writing coherent from paragraph to paragraph? You are evaluating quality without a reference solution.

Reference-free evaluation applies this principle to agent assessment. For many real-world agent tasks, gold-standard answers either do not exist, are prohibitively expensive to create, or are not unique (multiple valid solutions exist). A coding agent asked to "refactor this module for better readability" has no single correct output. A research agent asked to "summarize recent developments in quantum computing" produces answers that depend on which sources it finds and how it synthesizes them.

Reference-free methods evaluate the intrinsic properties of agent output -- its internal consistency, adherence to specified constraints, logical soundness, and executable correctness -- rather than comparing it to a predetermined answer. This makes evaluation possible in domains where reference creation is impractical while introducing new challenges around what "quality" means without an external anchor.

## How It Works

### Self-Consistency Checks

Run the agent on the same task multiple times (typically 5-10 runs) and measure agreement across outputs. High self-consistency suggests the agent has a reliable process for this task type; low consistency indicates uncertainty or sensitivity to random factors.

Specific techniques:
- **Exact match rate**: For tasks with discrete answers, measure how often runs produce identical outputs
- **Semantic similarity**: For open-ended outputs, compute embedding similarity across runs (cosine similarity > 0.85 suggests strong consistency)
- **Claim-level agreement**: Extract factual claims from each run and measure claim overlap using F1 score
- **Decision agreement**: For tasks involving choices (which file to edit, which API to call), measure whether the agent makes the same decisions across runs

Self-consistency is necessary but not sufficient for quality: an agent that consistently produces the wrong answer scores high on consistency but low on correctness. Combine with other methods.

### Constraint Satisfaction

Many tasks come with explicit or implicit constraints that can be verified programmatically:

- **Format constraints**: Does the output match the required schema (JSON, XML, specific data structure)?
- **Length constraints**: Does the response stay within specified word or token limits?
- **Content constraints**: Does the output include all required sections, address all sub-questions, or cover all specified topics?
- **Behavioral constraints**: Did the agent stay within its authorized actions? Did it avoid prohibited operations?
- **Temporal constraints**: Did the agent complete within the allotted time?

Constraint satisfaction is binary for each constraint (met or not met) but can be aggregated as a satisfaction ratio. A score of 14/15 constraints met is more informative than a holistic "good" or "bad."

### Logical Coherence Analysis

Evaluate the internal logical structure of agent output and reasoning:

- **Entailment checking**: Do later statements logically follow from earlier ones? Use NLI (Natural Language Inference) models to detect contradictions within the agent's output.
- **Reasoning chain validation**: For agents that show their work, verify each reasoning step follows from the previous step. Flag non-sequiturs or unsupported leaps.
- **Goal-action alignment**: Do the agent's actions align with its stated plan? If the agent says "I will now check the database" but instead calls a web search API, this is a coherence failure.
- **Conclusion-evidence alignment**: Does the agent's final answer follow from the evidence it gathered? An agent that gathers data showing X but concludes Y has a coherence gap.

### Execution-Based Verification

For tasks with executable outputs, run the output and evaluate the result:

- **Code execution**: Does generated code compile and run without errors?
- **Test generation and execution**: Have the agent generate its own test cases, then check if its solution passes them (see `code-execution-based-evaluation.md`)
- **API call validation**: Do generated API calls return successful responses?
- **Script execution**: Do generated automation scripts produce the intended effects?

Execution-based verification provides the strongest signal among reference-free methods because it grounds evaluation in observable behavior rather than textual analysis.

### When Reference-Free Works vs. When References Are Essential

**Reference-free works well for:**
- Open-ended tasks with multiple valid solutions (code refactoring, summarization, creative tasks)
- Tasks where constraints are well-specified and verifiable
- Tasks with executable outputs where correctness can be tested
- Tasks where self-consistency is a strong proxy for quality

**References are essential for:**
- Tasks with a single correct answer (factual QA, mathematical computation)
- Tasks where subtle errors are indistinguishable from valid alternatives without ground truth
- Safety-critical evaluations where missing a failure mode has severe consequences
- Benchmarking against a fixed standard for cross-system comparison

## Why It Matters

1. **Gold-standard creation does not scale.** Creating reference answers for thousands of diverse agent tasks requires domain experts spending hours per task. Reference-free methods make continuous evaluation economically viable.

2. **Many real-world tasks lack unique correct answers.** When an agent writes code, plans a trip, or drafts a document, multiple valid outputs exist. Forcing evaluation through a single reference penalizes valid alternatives.

3. **Reference-free methods evaluate process, not just outcome.** Self-consistency and coherence analysis reveal whether the agent's reasoning process is reliable, which predicts future performance better than outcome matching alone.

4. **Execution-based verification provides objective signal without subjective reference creation.** When code runs correctly, that is a fact, not an opinion -- and no human needed to write the expected output.

## Key Technical Details

- Self-consistency checks require 5-10 independent runs, multiplying agent execution costs by that factor
- Constraint satisfaction achieves near-perfect inter-rater reliability (kappa > 0.95) because constraints are binary and objective
- Logical coherence analysis using NLI models achieves approximately 85-90% accuracy on detecting contradictions in well-structured text, but drops to 70-75% on informal or complex reasoning chains
- Execution-based verification is the highest-signal reference-free method but is limited to tasks with executable outputs
- Combining multiple reference-free methods (constraint satisfaction + self-consistency + execution) provides a more robust overall assessment than any single method
- Reference-free methods are harder to calibrate (see `judge-calibration-and-validation.md`) because there is no human ground truth to validate against directly

## Common Misconceptions

**"Reference-free evaluation is less rigorous than reference-based evaluation."** For the right task types, reference-free methods can be more rigorous. Execution-based verification provides objective ground truth that reference comparison cannot -- a program either runs correctly or it does not.

**"Self-consistency means the agent is correct."** An agent can be consistently wrong. Self-consistency measures reliability, not accuracy. It is a necessary but not sufficient condition for quality.

**"Constraint satisfaction covers all quality dimensions."** Constraints capture the "what" (did the agent do what was asked?) but not the "how well" (was the solution elegant, efficient, maintainable?). Combine with qualitative methods for complete evaluation.

**"Reference-free evaluation eliminates the need for human judgment."** Reference-free methods still require humans to define what constraints matter, what consistency threshold is acceptable, and what constitutes logical coherence. The human judgment is pushed upstream into evaluation design rather than eliminated.

## Connections to Other Concepts

- Complements reference-based approaches in `code-execution-based-evaluation.md` and `environment-state-evaluation.md`
- Uses rubrics from `rubric-engineering.md` to define quality dimensions when no reference exists
- Harder to calibrate using methods in `judge-calibration-and-validation.md` due to the absence of ground truth
- Can be combined with `multi-dimensional-debate-evaluation.md` where each dimension uses different reference-free methods
- Integrated into production systems via `evaluation-pipeline-architecture.md`

## Further Reading

- "SelfCheckGPT: Zero-Resource Black-Box Hallucination Detection for Generative Large Language Models" -- Manakul et al., 2023
- "Self-Consistency Improves Chain of Thought Reasoning in Language Models" -- Wang et al., 2023
- "FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation" -- Min et al., 2023
- "Reference-Free Evaluation of Code Generation" -- Evtikhiev et al., 2023
