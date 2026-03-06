# Real-World vs Synthetic Benchmarks

**One-Line Summary**: The choice between benchmarks derived from real-world data and those constructed synthetically represents a fundamental tradeoff between ecological validity and experimental control, with hybrid approaches increasingly favored.

**Prerequisites**: `benchmark-design-methodology.md`, `benchmark-saturation-and-evolution.md`, `swe-bench-deep-dive.md`

## What Is the Real-World vs Synthetic Distinction?

Imagine two approaches to testing whether a self-driving car can navigate city streets. Approach one: record real drives through actual cities and replay them as evaluation scenarios, with all the unpredictability, construction zones, and jaywalking pedestrians that entails. Approach two: design a simulation with parameterized traffic patterns, controlled weather, and reproducible scenarios. The first approach guarantees realism; the second guarantees control. Neither alone is sufficient.

Real-world benchmarks draw tasks from naturally occurring data. SWE-bench pulls from actual GitHub issues. GAIA uses questions answerable through real web research. Cline Bench uses snapshots of genuine software projects. These benchmarks inherit the complexity, ambiguity, and distribution of actual work. Their weakness is that the same connection to the real world that gives them validity also exposes them to contamination, staleness, and messy edge cases.

Synthetic benchmarks construct tasks programmatically or through careful human authoring with controlled parameters. They can generate unlimited fresh instances, precisely calibrate difficulty, and isolate specific capabilities for targeted testing. Their weakness is that artificial tasks may reward strategies that do not transfer to real work -- an agent might ace a synthetic file-manipulation benchmark while failing on actual sysadmin tasks because the synthetic tasks lack the context ambiguity and environmental complexity of real systems.

## How It Works

### Real-World Benchmarks

**SWE-bench** is the canonical example. Tasks come directly from merged pull requests on popular Python repositories. The process:

1. Scrape merged PRs from repositories with good test coverage
2. Extract the issue description, pre-fix codebase snapshot, and post-fix tests
3. Validate that the issue is solvable from the description alone
4. Package as a reproducible evaluation instance

Strengths: Tasks reflect actual developer work in frequency, complexity, and style. Solutions must work in real codebases with real dependencies. The difficulty distribution mirrors what agents encounter in practice.

Weaknesses: Contamination is a persistent concern -- the issues, codebases, and sometimes solutions appear in LLM training data. Tasks age as repositories evolve. Some tasks have ambiguous specifications or flawed test oracles (addressed by Verified variant). The benchmark is limited to repositories with sufficient test coverage, biasing toward well-maintained projects.

**Cline Bench** takes a different real-world approach: capturing snapshots of software projects at specific points and defining tasks based on what the developers actually did next (features they added, bugs they fixed). This provides temporal anchoring and clear ground truth.

**Production trace benchmarks** (emerging in 2025-2026) capture real agent interactions from production systems, anonymize them, and use them as evaluation instances. These have the highest ecological validity but the most severe privacy and contamination challenges.

### Synthetic Benchmarks

**Parameterized task generation**: Define a task template with variable parameters, then generate instances by sampling parameter values. For example, a file-manipulation benchmark might have templates like "Find all files matching [pattern] in [directory structure] and [operation] them to [destination]" with thousands of possible instantiations.

**Procedural environment generation**: Create environments (codebases, websites, file systems) algorithmically. Each evaluation generates a fresh environment, eliminating memorization. The challenge is ensuring generated environments have the structural properties of real ones.

**LLM-generated tasks**: Using language models to generate evaluation tasks (with human validation). This scales task creation but risks the generated tasks reflecting LLM biases rather than real-world distributions.

**Adversarial construction**: Deliberately designing tasks that target known failure modes. These are highly informative for capability testing but may not reflect natural task distributions.

### Ecological Validity vs. Experimental Control

The core tradeoff can be characterized along several axes:

| Dimension | Real-World | Synthetic |
|-----------|-----------|-----------|
| Ecological validity | High | Low to medium |
| Contamination risk | High | Low (renewable) |
| Reproducibility | Medium (env drift) | High |
| Difficulty calibration | Uncontrolled | Precise |
| Task supply | Limited | Unlimited |
| Maintenance cost | High (ongoing) | Low (after initial design) |
| Edge case coverage | Incidental | Targeted |
| Distribution match | Exact (by definition) | Approximate |

### Hybrid Approaches

The most effective modern benchmarks combine both approaches:

**Template-from-real**: Extract structural patterns from real tasks, then generate new instances following those patterns. This preserves the distribution properties of real work while enabling fresh task generation.

**Real tasks with synthetic perturbation**: Take real benchmark instances and modify them (rename variables, change numbers, alter specifications) to create contamination-resistant variants. SWE-bench's Rebench protocol follows this approach.

**Synthetic-then-validate**: Generate tasks synthetically, then have domain experts validate that they represent realistic work. AppWorld uses this approach, with human experts validating that generated multi-app workflows reflect actual user needs.

**Staged evaluation**: Use synthetic benchmarks for rapid, cheap, high-frequency testing (CI/CD integration) and real-world benchmarks for periodic, thorough capability assessment. This mirrors the distinction between unit tests and integration tests in software engineering.

### The 2026 AI Safety Report Finding

The International AI Safety Report (2026) highlighted that pre-deployment testing increasingly fails to reflect real-world behavior of deployed systems. Benchmark performance -- whether real-world or synthetic -- correlated only moderately (r = 0.4-0.6) with production performance metrics across multiple deployment domains. The report specifically noted that "the gap between controlled evaluation and deployment reality is growing, not shrinking, as systems become more capable and deployment contexts more diverse." This finding strengthens the case for hybrid evaluation strategies that combine pre-deployment benchmarks with production monitoring.

## Why It Matters

1. **No single benchmark type is sufficient**: Real-world benchmarks miss capabilities that synthetic benchmarks can target, and vice versa. A comprehensive evaluation strategy uses both.
2. **Contamination drives the choice**: As LLM training data grows to encompass more of the internet, real-world benchmarks face accelerating contamination. Synthetic and hybrid approaches provide a path forward.
3. **Deployment context determines priority**: For high-stakes applications (medical, financial), ecological validity dominates and real-world benchmarks are essential. For rapid development iteration, synthetic benchmarks' speed and cost advantages are more important.
4. **The validity-control spectrum is navigable**: Hybrid approaches demonstrate that ecological validity and experimental control are not in strict opposition. Thoughtful design can achieve meaningful levels of both.

## Key Technical Details

- SWE-bench contamination analysis: models show 8-15% higher resolution rates on pre-cutoff vs. post-cutoff instances of matched difficulty
- Synthetic benchmark generation costs: approximately $0.01-0.10 per task (LLM-generated with human validation) vs. $5-50 per task for curated real-world instances
- The correlation between synthetic benchmark scores and real-world deployment performance ranges from r = 0.3 (poorly designed synthetic) to r = 0.8 (well-designed hybrid)
- Renewable synthetic benchmarks can generate 1,000+ fresh instances per hour; real-world benchmarks typically add 10-50 new instances per month
- Template-from-real approaches retain approximately 70-85% of the ecological validity of pure real-world benchmarks while gaining full contamination resistance
- The AI Safety Report found that benchmark-to-production correlation was weakest for tasks involving ambiguity (r = 0.3) and strongest for well-defined procedural tasks (r = 0.7)
- Production trace benchmarks show a 15-25% performance gap versus lab benchmarks for the same agents, attributed to distribution shift, environmental noise, and user behavior variability

## Common Misconceptions

**"Real-world benchmarks are always more valid."** A real-world benchmark with severe contamination is less valid than a well-designed synthetic benchmark. Validity depends on the benchmark's actual ability to predict performance on unseen tasks, not just on the provenance of its data.

**"Synthetic benchmarks are just toy problems."** Modern synthetic benchmarks like AppWorld feature hundreds of realistic APIs, complex multi-step workflows, and difficulty levels that stump frontier models. The "synthetic" label does not imply simplicity; it implies controlled construction.

**"If an agent passes both real and synthetic benchmarks, it is ready for production."** Both benchmark types exist in controlled, reproducible settings. Production environments introduce user variability, environmental drift, adversarial inputs, and scale effects that no benchmark fully captures. Benchmarks are necessary but not sufficient for deployment readiness.

**"The real-world vs. synthetic distinction is binary."** In practice, most benchmarks fall on a spectrum. SWE-bench Verified is "real-world" but has been curated and filtered. AppWorld is "synthetic" but was designed to mirror real app ecosystems. The useful question is not "which type?" but "where on the spectrum does this benchmark fall, and is that appropriate for my evaluation goals?"

## Connections to Other Concepts

- `swe-bench-deep-dive.md` is the primary example of a real-world benchmark, including its contamination challenges
- `tool-use-benchmarks.md` covers AppWorld as an example of high-quality synthetic benchmark design
- `benchmark-saturation-and-evolution.md` discusses how real and synthetic benchmarks have different saturation dynamics
- `benchmark-design-methodology.md` provides the framework for making the real-vs-synthetic decision
- `gaia-and-general-assistant-benchmarks.md` represents a hybrid approach (human-curated questions about real-world data)
- `../09-production-evaluation-and-monitoring/online-vs-offline-evaluation.md` extends this discussion to the pre-deployment vs. post-deployment axis
- `../05-statistical-methods-for-evaluation/meta-evaluation.md` discusses how to measure whether a benchmark (of either type) actually predicts what it claims

## Further Reading

- "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" -- Jimenez et al., 2024
- "AppWorld: A Controllable World of Apps and People for Benchmarking Interactive Coding Agents" -- Trivedi et al., 2024
- "Cline Bench: A Software Engineering Benchmark for Practical AI Agent Evaluation" -- Cline Team, 2025
- "International AI Safety Report 2026" -- International Scientific Committee on AI Safety, 2026
- "On the Ecological Validity of AI Benchmarks" -- Raji et al., 2024
- "Synthetic Data for AI Evaluation: Opportunities and Pitfalls" -- Liu et al., 2025
