# Custom Evaluator Development

**One-Line Summary**: When generic evaluation frameworks cannot capture domain-specific quality signals, teams must build custom evaluators -- scoring functions, composite metrics, and domain-aware assessment tools -- treated with the same engineering rigor as production code.

**Prerequisites**: `../01-foundations-of-agent-evaluation/what-is-agent-evaluation.md`, `inspect-ai-and-open-source-frameworks.md`, `../03-automated-evaluation-methods/llm-as-judge.md`, `evaluation-dataset-management.md`

## What Is Custom Evaluator Development?

Imagine grading a medical school exam. A generic grading system can check whether the student selected the correct multiple-choice answer. But evaluating a clinical case write-up -- where the student must identify the right diagnosis, justify it with evidence from the patient history, order appropriate tests in the right sequence, and flag relevant drug interactions -- requires a grader who understands medicine. Generic scoring cannot capture whether the reasoning chain reflects sound clinical judgment.

Custom evaluator development is the practice of building domain-specific evaluation tools when off-the-shelf frameworks provide insufficient signal. A legal AI assistant that drafts contracts needs evaluators that understand contractual language, regulatory compliance, and jurisdictional requirements. A financial analysis agent needs evaluators that verify numerical accuracy, check for disclosure requirements, and assess risk characterization. These domain-specific quality signals cannot be captured by generic string matching, BLEU scores, or even general-purpose LLM-as-judge approaches.

The key insight is that custom evaluators are software systems, not scripts. They need the same engineering practices as production code: version control, testing, documentation, code review, and maintenance. A buggy evaluator produces misleading results that cascade into bad engineering decisions -- a failure mode that is harder to detect than a buggy agent, because evaluator correctness is rarely independently verified.

## How It Works

### Custom Scorers

A scorer is a function that takes an agent's output (and optionally the input and reference answer) and produces a structured assessment. Custom scorers encode domain knowledge into this function.

**Medical diagnosis evaluation**: A scorer for a diagnostic agent might check: (1) whether the primary diagnosis is correct, (2) whether the differential diagnosis list includes the correct answer within the top 3, (3) whether contraindicated treatments were avoided, and (4) whether the urgency level is appropriate. Each component produces a sub-score, and domain rules define how they combine.

**Legal document evaluation**: A scorer for a contract-drafting agent might verify: (1) presence of required clauses (governing law, limitation of liability, termination), (2) consistency of defined terms across the document, (3) compliance with jurisdiction-specific requirements, and (4) absence of known problematic language patterns. This requires a combination of regex matching, structural analysis, and domain-specific rule sets.

**Financial analysis evaluation**: A scorer for a financial agent might check: (1) numerical accuracy of calculations (recompute independently), (2) consistency between narrative claims and underlying data, (3) proper risk disclosures, and (4) adherence to regulatory formatting requirements. Numerical accuracy checking requires the evaluator to independently compute the expected results.

### Composite Metrics

Real-world evaluation rarely reduces to a single score. Composite metrics combine multiple signals into an actionable summary:

**Weighted aggregation**: Assign importance weights to individual sub-scores. For a customer service agent, accuracy might weight 0.4, tone 0.2, completeness 0.2, and efficiency 0.2. Weights should reflect business priorities and be explicitly documented, not hidden in code.

**Hierarchical scoring**: Define prerequisite relationships between sub-scores. Safety passes must precede quality assessment -- if the agent produces an unsafe output, the quality score is irrelevant. Implement this as a scoring tree where parent nodes gate child evaluation.

**Threshold-gated composites**: Some sub-scores act as hard gates. An agent that produces factually incorrect information scores zero regardless of how well-written the response is. Implement this as: `composite = quality_score if accuracy > 0.95 else 0`.

**Pareto-based ranking**: When comparing agents across multiple dimensions and no single composite metric is appropriate, use Pareto dominance. Agent A dominates Agent B if it is better on at least one dimension and no worse on all others. This avoids the arbitrary weight assignments of linear composites.

### Domain Evaluators

Domain evaluators go beyond scoring individual outputs to assess domain-specific patterns across an evaluation suite:

**Consistency evaluators**: Do the agent's answers remain consistent when the same question is asked in different ways? For a medical agent, does it give the same diagnosis regardless of whether symptoms are presented as a list or a narrative?

**Compliance evaluators**: Does the agent's behavior conform to domain-specific regulations? A financial agent must comply with SEC guidelines; a healthcare agent must handle PHI (Protected Health Information) according to HIPAA rules. Compliance evaluators encode these rules programmatically.

**Calibration evaluators**: When the agent expresses uncertainty ("I am 80% confident"), is that confidence level accurate? Calibration evaluation compares expressed confidence levels to actual accuracy across many tasks, producing calibration curves.

### Software Engineering Practices

Evaluation code is production code. It makes decisions about what gets deployed and what does not. Treating it casually leads to subtle bugs that corrupt evaluation results:

**Testing evaluators**: Write unit tests for scoring functions using known input-output pairs. Include edge cases: empty outputs, malformed responses, outputs that partially match the reference. A scorer that crashes on unexpected input produces missing data, which silently biases aggregate statistics.

**Code review**: Scoring logic should go through the same review process as agent code. Reviewers should verify that scoring criteria match the documented evaluation rubric and that edge cases are handled correctly.

**Documentation**: Each custom evaluator should document: what it measures, why this metric matters, what inputs it expects, what outputs it produces, known limitations, and how to interpret the results. This documentation is for future evaluators -- including your future self.

**Logging and debugging**: Evaluators should produce detailed logs showing how they arrived at each score. When a score seems wrong, the evaluator's logs should make it possible to trace the scoring logic step by step.

### Versioning Evaluators Alongside the Agent

Evaluator versioning requires care because evaluator changes affect result interpretation:

- **Pin evaluator versions to evaluation runs**: Every evaluation result should record which evaluator version produced it. Results produced by different evaluator versions are not directly comparable.
- **Maintain backward compatibility**: When updating a scorer, keep the previous version available so that historical results can be reproduced. Use evaluator version tags in evaluation metadata.
- **Co-evolve with the agent**: When the agent gains new capabilities, the evaluator must be updated to assess them. When the agent's output format changes, the evaluator's parser must be updated. Track agent and evaluator versions together.

### When to Build Custom vs. Use Off-the-Shelf

Build custom evaluators when:

- Your domain has quality criteria that general-purpose tools cannot capture (medical accuracy, legal compliance, financial regulations)
- The agent's output format is non-standard and requires domain-specific parsing
- You need composite metrics that combine signals in domain-specific ways
- Existing scorers produce false positives or false negatives at unacceptable rates for your use case

Use off-the-shelf evaluators when:

- General-purpose LLM-as-judge scoring with custom rubrics provides sufficient signal
- The evaluation task is well-covered by existing benchmarks (coding, math, general knowledge)
- The team lacks the domain expertise to build and validate custom scoring logic
- Speed of evaluation setup matters more than scoring precision

### The Evaluator Development Lifecycle

Custom evaluators follow their own development lifecycle:

1. **Requirements gathering**: Work with domain experts to define what "good" looks like. Document quality criteria, failure modes, and edge cases.
2. **Prototype**: Build a minimal scorer and test it on 20-50 examples. Have domain experts review the scores for reasonableness.
3. **Calibration**: Run the scorer on a larger set (100-200 examples) with human-assigned ground-truth scores. Compute correlation between evaluator scores and human scores. Target Pearson correlation above 0.85 for production use.
4. **Hardening**: Add error handling, logging, tests, and documentation. Handle all edge cases discovered during calibration.
5. **Deployment**: Integrate into the evaluation pipeline. Run in parallel with human evaluation for an initial validation period.
6. **Maintenance**: Monitor evaluator-human agreement over time. Update as domain requirements evolve.

## Why It Matters

1. **Domain fidelity**: Generic evaluators miss the quality signals that matter most in specialized domains. A medical agent that gives plausible-sounding but clinically dangerous advice scores well on fluency but fails on the dimension that actually matters.
2. **Actionable feedback**: Custom evaluators produce specific, actionable feedback ("the agent missed the drug interaction between warfarin and aspirin") rather than generic assessments ("the answer was partially correct"). This feedback directly informs improvement.
3. **Automation at scale**: Human expert evaluation is the gold standard but does not scale. Custom evaluators that correlate well with human judgment enable automated evaluation across thousands of tasks at a fraction of the cost.
4. **Evaluation as institutional knowledge**: Custom evaluators codify domain expertise into executable form. When an expert leaves the organization, their quality criteria persist in the evaluator code.

## Key Technical Details

- Custom scorers in Inspect AI implement the `score()` method, accepting a `TaskState` and returning a `Score` with value and explanation
- Evaluator-human correlation above 0.85 (Pearson) is generally acceptable for production use; above 0.90 is excellent
- Composite metrics should be sensitivity-tested: vary each sub-score while holding others constant to verify the composite responds appropriately
- Domain evaluators typically require 50-100 hours of domain expert time for initial development and calibration
- Evaluator test suites should include at least 30 hand-scored examples covering the full range of scores and common edge cases
- LLM-as-judge with custom rubrics often provides 70-80% of the accuracy of fully custom evaluators at 10% of the development cost -- a useful first step before committing to custom development
- Evaluator bugs have a multiplier effect: one scoring error affects every task in the dataset, potentially corrupting thousands of results

## Common Misconceptions

**"LLM-as-judge makes custom evaluators unnecessary."** LLM judges are powerful but not omniscient. They struggle with numerical verification, domain-specific compliance rules, and cases where surface quality diverges from substantive quality. Custom evaluators handle the cases where general-purpose LLM judgment is insufficient.

**"Custom evaluators are too expensive to build."** The alternative is either relying on inadequate generic metrics (leading to bad deployment decisions) or manual human evaluation (which does not scale). Custom evaluators have high upfront cost but low marginal cost per evaluation, making them economical over the evaluation suite's lifetime.

**"Once built, evaluators do not need maintenance."** Domain requirements evolve, agent output formats change, and edge cases are discovered over time. Evaluators that are not maintained drift from the actual quality criteria, producing increasingly misleading results.

**"Evaluator correctness is obvious."** Evaluator bugs are insidious because they produce plausible-looking scores. A scorer that incorrectly handles partial credit might consistently rate agents 5-10% higher than they deserve -- a bias that is nearly impossible to detect without systematic evaluator validation against human judgments.

## Connections to Other Concepts

- `inspect-ai-and-open-source-frameworks.md` provides the Scorer interface that custom evaluators implement
- `evaluation-dataset-management.md` covers the golden answer sets that custom scorers compare against
- `evaluation-result-analysis-and-visualization.md` discusses how to analyze and present custom evaluator outputs
- `ci-cd-integration-for-agent-evaluation.md` covers how custom evaluators are invoked in automated pipelines
- `../03-automated-evaluation-methods/llm-as-judge.md` provides the LLM-as-judge approaches that complement or precede custom evaluators
- `../04-trajectory-and-process-analysis/trajectory-evaluation-fundamentals.md` informs custom evaluators that assess agent processes, not just outputs

## Further Reading

- "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" -- Zheng et al., 2023
- "Domain-Specific Evaluation of Large Language Models" -- Chang et al., 2024
- "Software Engineering for Machine Learning: A Case Study" -- Amershi et al. (Microsoft), 2019
- "Building Reliable Evaluation Pipelines for LLM Applications" -- Ribeiro et al., 2023
- "Human Evaluation of Text Generation: A Survey" -- Celikyilmaz et al., 2020
