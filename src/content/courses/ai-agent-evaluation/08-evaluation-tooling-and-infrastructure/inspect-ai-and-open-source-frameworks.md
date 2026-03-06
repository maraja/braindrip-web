# Inspect AI and Open-Source Evaluation Frameworks

**One-Line Summary**: Inspect AI is the leading open-source agent evaluation framework, built by the UK AI Safety Institute, providing a composable architecture of Tasks, Solvers, Scorers, and Datasets for rigorous and reproducible agent assessment.

**Prerequisites**: `../01-foundations-of-agent-evaluation/what-is-agent-evaluation.md`, `../02-benchmark-ecosystem/benchmark-design-principles.md`, `../03-automated-evaluation-methods/llm-as-judge.md`

## What Is Inspect AI?

Think of Inspect AI as a laboratory workbench for AI agent evaluation. Just as a well-designed lab has standardized equipment -- beakers, pipettes, centrifuges -- that researchers combine in different ways to run experiments, Inspect AI provides standardized building blocks that evaluators compose to assess any agent behavior. The framework imposes just enough structure to ensure reproducibility without constraining what you can evaluate.

Inspect AI was developed by the UK AI Safety Institute (AISI) as a MIT-licensed framework for evaluating large language models and AI agents. It has become the de facto standard for safety evaluation, adopted by organizations including METR (Model Evaluation and Threat Research) and Apollo Research. The framework's core insight is that evaluation is not a monolithic activity but a composition of four distinct concerns: what to evaluate, how the agent should behave, how to grade results, and what data to use.

Beyond Inspect AI, a growing ecosystem of open-source frameworks addresses specialized evaluation needs. Vivaria (by METR) focuses on agent elicitation research, Bloom (by Anthropic) handles automated behavioral evaluations, and BrowserGym (by ServiceNow) provides a unified interface for web-based agent evaluation. Understanding when to use each framework is a critical skill for evaluation practitioners.

## How It Works

### The Four-Component Architecture

Inspect AI decomposes every evaluation into four composable primitives:

**Tasks** define what to evaluate. A Task bundles together a dataset, a solver pipeline, and one or more scorers. Tasks are the top-level unit of evaluation -- you run a Task, and you get back scored results. Tasks can be parameterized, allowing the same evaluation logic to run across different models, configurations, or difficulty levels.

**Solvers** define agent behavior. A Solver is a pipeline of steps that transforms an input prompt into an output. Simple solvers might just call an LLM once. Complex solvers chain together tool use, chain-of-thought prompting, multi-turn dialogue, and planning loops. Solvers are composable: you can stack `chain_of_thought()`, `use_tools()`, and `generate()` into a pipeline that mirrors real agent architectures.

**Scorers** define how to grade outputs. Scorers range from exact string matching to LLM-as-judge evaluation to custom domain-specific rubrics. Multiple scorers can be applied to the same output, and scorers can return structured feedback beyond pass/fail -- partial credit, categorical ratings, and detailed justifications.

**Datasets** provide the evaluation data. Datasets are collections of input-output pairs (or just inputs for open-ended evaluation). They support loading from CSV, JSON, or Hugging Face, and can include metadata for stratified analysis.

### Sandboxing Infrastructure

Agent evaluation often requires agents to execute code, browse the web, or manipulate files. Inspect AI provides first-class sandboxing support across multiple backends:

- **Docker**: The default sandbox. Each evaluation sample runs in an isolated container with configurable images, network access, and resource limits. Setup is defined via `compose.yaml` files.
- **Kubernetes**: For large-scale evaluations requiring cluster-level orchestration and resource management.
- **Modal**: Serverless cloud sandboxing for burst evaluation workloads without managing infrastructure.
- **Proxmox**: VM-level isolation for evaluations requiring full operating system access or hardware-level security boundaries.

### Running an Evaluation

A typical Inspect AI evaluation follows this flow: define a Task that references a dataset, configure a Solver pipeline that represents the agent behavior under test, attach Scorers that grade the output, then execute with `inspect eval`. The framework handles parallelism, logging, retry logic, and result aggregation automatically.

### The Broader Open-Source Ecosystem

**Vivaria** (METR) is purpose-built for agent elicitation research -- studying how capable an agent can become under optimal prompting and scaffolding. It provides infrastructure for long-running agent tasks, detailed trajectory logging, and human-in-the-loop oversight during evaluation.

**Bloom** (Anthropic) focuses on automated behavioral evaluations at scale. It generates evaluation scenarios programmatically, runs them against target models, and identifies behavioral patterns across thousands of test cases. Its strength is breadth: testing for subtle behavioral tendencies rather than pass/fail capabilities.

**BrowserGym** (ServiceNow) provides a unified OpenAI Gym-style interface for web agent evaluation. It wraps benchmarks like WebArena, WorkArena, and MiniWoB++ into a consistent API, enabling apples-to-apples comparison of web agents across different task environments.

## Why It Matters

1. **Reproducibility**: Inspect AI's declarative Task definitions and deterministic sandboxing ensure that evaluations produce consistent results across different machines, teams, and time periods -- a prerequisite for scientific evaluation.
2. **Composability**: The four-component architecture lets teams mix and match components. A new scoring method can be applied to existing tasks; a new dataset can reuse existing solver pipelines. This dramatically reduces the marginal cost of new evaluations.
3. **Safety-critical adoption**: When organizations like METR and Apollo Research use the same evaluation framework, results become comparable across the safety ecosystem. Shared tooling creates shared language.
4. **Lower barrier to entry**: MIT licensing and comprehensive documentation mean that any organization can run state-of-the-art evaluations without building custom infrastructure from scratch.
5. **Ecosystem convergence**: As open-source frameworks mature, they reduce fragmentation. Teams spend less time on infrastructure and more time on evaluation design -- which is where the real intellectual work lies.

## Key Technical Details

- Inspect AI is MIT-licensed, written in Python, and installable via `pip install inspect_ai`
- Tasks support parallel execution across multiple samples with configurable concurrency limits
- Solver pipelines support branching, conditional logic, and state management between steps
- Built-in scorers include exact match, fuzzy match, model-graded, and pattern-based scoring
- Evaluation logs are stored in structured JSON format, supporting automated analysis and comparison
- Docker sandboxes typically initialize in 2-5 seconds per sample; Kubernetes sandboxes in 10-30 seconds
- Vivaria supports agent runs lasting hours to days, with checkpoint/resume capabilities
- BrowserGym provides a `step(action) -> observation, reward, done, info` interface consistent with OpenAI Gym conventions
- Inspect AI integrates with major model providers: OpenAI, Anthropic, Google, Mistral, and local models via Hugging Face

## Common Misconceptions

**"Inspect AI is only for safety evaluation."** While developed by a safety institute, Inspect AI is a general-purpose evaluation framework. It is equally effective for evaluating coding agents, customer service bots, or research assistants. The architecture is domain-agnostic.

**"Open-source frameworks lack the polish of commercial platforms."** Inspect AI, in particular, is production-grade software with extensive documentation, active development, and adoption by well-resourced organizations. The trade-off is not quality but support model: community-driven rather than vendor-supported.

**"You should pick one framework and standardize on it."** Different frameworks serve different purposes. Inspect AI excels at structured, repeatable evaluations. Vivaria is better for open-ended elicitation research. BrowserGym is purpose-built for web agents. A mature evaluation practice uses multiple frameworks.

**"Frameworks handle everything -- you just plug in data."** Frameworks handle infrastructure and orchestration, but evaluation design -- choosing what to test, how to score, and how to interpret results -- remains a deeply human activity. The framework is the instrument; the evaluator is the scientist.

## Connections to Other Concepts

- `sandboxed-evaluation-environments.md` covers the isolation and reproducibility principles that Inspect AI's sandboxing implements
- `custom-evaluator-development.md` explains how to extend Inspect AI's Scorer interface for domain-specific needs
- `observability-platforms-for-evaluation.md` discusses commercial alternatives and how they complement open-source frameworks
- `evaluation-dataset-management.md` details best practices for the Dataset component of the Inspect AI architecture
- `../02-benchmark-ecosystem/benchmark-design-principles.md` provides the theoretical foundation for designing Tasks
- `../03-automated-evaluation-methods/llm-as-judge.md` covers the LLM-based scoring approaches available in Inspect AI's Scorer library

## Further Reading

- "Inspect: A Framework for Large Language Model Evaluation" -- UK AI Safety Institute, 2024
- "Evaluating Language-Model Agents on Realistic Autonomous Tasks" -- Kinniment et al. (METR), 2024
- "BrowserGym: A Unified Platform for Web Agent Evaluation" -- Drouin et al., 2024
- "Measuring the Persuasion Capabilities of Language Models" -- Anthropic (Bloom framework), 2024
- "Vivaria: A Tool for Running AI Agent Evaluations" -- METR, 2024
