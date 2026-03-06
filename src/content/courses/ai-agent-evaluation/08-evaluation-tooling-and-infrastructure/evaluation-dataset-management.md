# Evaluation Dataset Management

**One-Line Summary**: Effective evaluation requires disciplined dataset management -- building representative tasks, curating for quality, versioning for reproducibility, and preventing contamination to ensure results remain meaningful.

**Prerequisites**: `../01-foundations-of-agent-evaluation/what-is-agent-evaluation.md`, `../02-benchmark-ecosystem/benchmark-design-principles.md`, `../05-statistical-methods-for-evaluation/sample-size-and-statistical-power.md`

## What Is Evaluation Dataset Management?

Consider a medical school's question bank for licensing exams. The questions must cover all relevant specialties in proportion to their clinical importance. They must be periodically reviewed: some become outdated as medical knowledge advances, some prove ambiguous when students consistently misinterpret them, and new questions must be added as new treatments emerge. The question bank is versioned so that year-over-year pass rates are comparable. And the questions are closely guarded -- if they leak, the exam loses its ability to distinguish competent from incompetent physicians.

Evaluation datasets for AI agents face identical challenges. A dataset is not a static artifact you create once; it is a living collection that requires ongoing management. The tasks must representatively cover the agent's intended capabilities. The ground-truth answers must be accurate and unambiguous. The dataset must evolve as the agent's deployment context changes, yet remain stable enough for meaningful comparisons over time. And in an era where training data is scraped from every corner of the internet, contamination prevention is a first-order concern.

Dataset management is the unglamorous foundation that determines whether evaluation results are trustworthy. A brilliant scoring methodology applied to a poorly managed dataset produces misleading results. Conversely, even simple metrics yield actionable insights when the underlying dataset is carefully constructed and maintained.

## How It Works

### Building Evaluation Datasets

**Task selection** requires balancing three dimensions:

- **Representative coverage**: Tasks should reflect the actual distribution of work the agent will encounter. If 60% of real-world queries involve simple lookups and 5% involve complex multi-step reasoning, the dataset should roughly mirror this distribution -- unless you intentionally oversample hard cases for sensitivity.
- **Difficulty distribution**: Include tasks spanning the full difficulty range. Easy tasks establish baseline competence; medium tasks differentiate good from great; hard tasks probe the frontier of capability. A common split is 30% easy, 50% medium, 20% hard.
- **Edge cases**: Deliberately include adversarial inputs, ambiguous requests, out-of-distribution queries, and tasks that require the agent to refuse or ask for clarification. Edge cases reveal failure modes that representative sampling alone would miss.

**Golden answer creation** is often the most expensive step:

- **Human annotation**: Domain experts create reference answers for each task. For complex tasks, multiple annotators should independently create answers, with inter-annotator agreement measured to ensure consistency.
- **Expert review**: Even after initial annotation, a second expert should review golden answers for accuracy, completeness, and lack of ambiguity. Tasks with low inter-annotator agreement should be revised or removed.
- **Acceptable answer sets**: For many agent tasks, multiple correct answers exist. Golden answers should capture the set of acceptable responses, not just a single reference. This is critical for open-ended tasks where phrasing varies.

### Curating for Quality

Ongoing curation keeps datasets reliable:

- **Remove ambiguous tasks**: If human experts disagree on the correct answer after discussion, the task is likely ambiguous. Remove it rather than forcing a single interpretation.
- **Update stale tasks**: Tasks referencing specific APIs, documentation, or world knowledge can become outdated. Schedule quarterly reviews to identify and refresh stale content.
- **Balance difficulty**: As agents improve, tasks that were once "hard" become "easy." Periodically recalibrate difficulty labels using current model performance, and add harder tasks to maintain discriminative power at the frontier.
- **Eliminate duplicates and near-duplicates**: Semantic deduplication prevents specific skills from being overweighted. Use embedding similarity to flag tasks that test essentially the same capability.

### Versioning and Reproducibility

Dataset versioning ensures that evaluation results remain comparable:

- **Semantic versioning**: Use major versions for structural changes (new task categories, changed scoring criteria), minor versions for task additions/removals, and patch versions for answer corrections.
- **Immutable snapshots**: Each version should be an immutable snapshot. Never modify a released version in place -- create a new version instead.
- **Changelog documentation**: Record what changed in each version and why. This metadata is essential for interpreting trend data that spans multiple dataset versions.
- **Content hashing**: Generate cryptographic hashes of dataset contents to verify integrity and detect unauthorized modifications.

### Contamination Prevention

Training data contamination -- where evaluation tasks appear in model training data -- is the most serious threat to evaluation validity:

- **Dataset rotation**: Regularly retire evaluation tasks and replace them with fresh ones. Tasks that have been public for more than 6-12 months should be considered potentially contaminated for frontier models.
- **Held-out sets**: Maintain a private subset of evaluation tasks that are never published or shared. Compare performance on public vs. held-out tasks to detect contamination signals.
- **Synthetic generation**: Use procedural or LLM-based methods to generate novel tasks on demand. Parameterized task templates can produce unlimited variants that test the same capability without exact memorization.
- **Canary strings**: Embed unique identifiers in datasets and periodically search training data dumps for these strings to detect leakage.

### Lifecycle Management

Datasets follow a lifecycle: creation, active use, aging, and retirement.

- **When to add tasks**: After discovering new failure modes in production, when the agent gains new capabilities that need testing, or when existing tasks lose discriminative power because all models score above 95%.
- **When to retire tasks**: When tasks become contaminated, when the underlying domain knowledge becomes obsolete, or when tasks no longer differentiate between model versions.
- **Maintaining freshness**: Aim to replace 15-25% of tasks annually for long-lived evaluation suites. This balances continuity (for trend analysis) with freshness (for contamination prevention).

### Size Guidelines

Dataset size depends on the evaluation's purpose:

- **20-50 tasks**: Rapid iteration during development. Enough for directional signal but insufficient for statistical confidence. Useful for smoke testing and quick regression checks.
- **200-500 tasks**: Comprehensive evaluation for release decisions. Provides enough statistical power to detect 5-10% performance differences with 95% confidence. The sweet spot for most production evaluation suites.
- **1,000+ tasks**: High-statistical-power evaluation for research publications, safety certifications, or fine-grained capability comparisons. Required when detecting small effect sizes (2-3% differences) or analyzing performance across many subcategories.

## Why It Matters

1. **Evaluation validity**: A poorly constructed dataset can make a weak agent look strong or a strong agent look weak. Dataset quality is the ceiling on evaluation quality.
2. **Reproducibility**: Without versioned, immutable datasets, it is impossible to compare results across time, teams, or organizations. Reproducibility is the foundation of scientific evaluation.
3. **Contamination defense**: As models train on ever-larger internet corpora, the risk that evaluation tasks appear in training data grows. Active contamination prevention is necessary, not optional.
4. **Cost efficiency**: Well-curated datasets avoid wasting evaluation budget on ambiguous tasks, stale content, or redundant tests. Every task in the dataset should earn its place.
5. **Regulatory readiness**: Emerging AI regulations increasingly require documented evaluation procedures. Versioned, well-documented datasets provide the audit trail regulators expect.

## Key Technical Details

- Inter-annotator agreement for golden answers should exceed Cohen's kappa of 0.8 for high-stakes evaluations
- Embedding-based deduplication typically uses cosine similarity threshold of 0.92-0.95 to flag near-duplicates
- Dataset version control can use Git LFS for large datasets or DVC (Data Version Control) for ML-specific workflows
- Content hashing with SHA-256 provides sufficient integrity verification for most evaluation datasets
- Contamination detection via held-out sets requires at least 50-100 held-out tasks for meaningful comparison
- Synthetic task generation using LLMs should be validated by human review, with typical acceptance rates of 60-80%
- Golden answer creation costs $5-50 per task for simple tasks, $50-500+ per task for complex domain-specific evaluations

## Common Misconceptions

**"More data is always better."** Beyond a threshold determined by the evaluation's statistical requirements, additional tasks add cost without improving signal. A well-curated dataset of 300 tasks often outperforms a sloppy dataset of 3,000 that includes ambiguous, redundant, or stale content.

**"Datasets only need to be created once."** Datasets are living artifacts. Models improve, deployment contexts shift, and contamination risk grows over time. A dataset that was excellent two years ago may be largely worthless today if it has not been maintained.

**"Synthetic data solves the contamination problem."** Synthetic generation reduces contamination risk but introduces its own biases -- generated tasks may cluster around patterns the generating model finds natural, missing the unusual cases that are most important to evaluate. Synthetic and human-created tasks should be blended.

**"Golden answers must be single correct responses."** For most agent tasks, multiple valid responses exist. Evaluation datasets should capture acceptable answer ranges, alternative phrasings, and partial credit criteria -- not just a single reference string.

## Connections to Other Concepts

- `inspect-ai-and-open-source-frameworks.md` describes how Inspect AI's Dataset component loads and manages evaluation data
- `ci-cd-integration-for-agent-evaluation.md` covers how datasets are consumed in automated evaluation pipelines
- `custom-evaluator-development.md` discusses building scorers that handle the complexity of multi-answer golden sets
- `../02-benchmark-ecosystem/benchmark-design-principles.md` provides theoretical grounding for task selection and difficulty calibration
- `../05-statistical-methods-for-evaluation/sample-size-and-statistical-power.md` explains the statistics behind dataset size guidelines
- `../10-frontier-research-and-open-problems/contamination-and-benchmark-integrity.md` dives deeper into contamination detection and prevention

## Further Reading

- "Benchmark Contamination in Large Language Models: A Survey" -- Deng et al., 2024
- "Data-Centric AI: Perspectives and Challenges" -- Zha et al., 2023
- "Dynabench: Rethinking Benchmarking in NLP" -- Kiela et al., 2021
- "Holistic Evaluation of Language Models" -- Liang et al. (HELM), 2022
- "Best Practices for Annotation in Machine Learning" -- Monarch, 2021
