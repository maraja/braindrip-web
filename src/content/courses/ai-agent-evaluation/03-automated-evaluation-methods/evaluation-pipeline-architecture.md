# Evaluation Pipeline Architecture

**One-Line Summary**: Evaluation pipeline architecture is the end-to-end engineering of systems that orchestrate task loading, environment provisioning, agent execution, output collection, scoring, and result aggregation into a reliable, scalable evaluation infrastructure.

**Prerequisites**: `agent-as-judge.md`, `code-execution-based-evaluation.md`, `environment-state-evaluation.md`, `rubric-engineering.md`

## What Is Evaluation Pipeline Architecture?

Think of an automobile assembly line. Raw materials enter one end, and finished cars emerge from the other. Between those endpoints, a precisely orchestrated sequence of stations performs specific operations: chassis welding, paint application, engine installation, quality inspection. Each station has defined inputs, outputs, quality checks, and failure handling. The assembly line's value is not in any single station but in the reliable orchestration of all stations together.

An evaluation pipeline is the assembly line for agent assessment. Tasks enter one end, and scored evaluation results emerge from the other. Between those endpoints, a sequence of components handles environment setup, agent execution, output collection, scoring by one or more evaluation methods, result aggregation, and report generation. Each component has defined interfaces, failure modes, and recovery strategies.

Getting each evaluation method right (LLM-as-Judge, code execution, state checking) is necessary but insufficient. Without robust pipeline engineering, evaluations fail silently, results are lost, costs spiral uncontrolled, and the team cannot trust the numbers they are making decisions from.

## How It Works

### Core Pipeline Components

**Task Loader**: Reads task definitions from a task suite or benchmark. Handles task filtering (run only coding tasks, only safety tasks), sampling (run a random 10% for quick checks), and versioning (ensure the task set has not changed between evaluation runs). Task definitions include the task prompt, metadata (difficulty, category, expected duration), and pointers to any required resources.

**Environment Provisioner**: Creates the isolated environment each agent execution needs. For coding tasks, this means spinning up a Docker container with the correct language runtime, dependencies, and codebase. For web tasks, launching a browser instance pointed at the correct URL. For OS tasks, restoring a virtual machine snapshot. Key requirements:
- Environments must be isolated (one agent run cannot affect another)
- Environments must be reproducible (same provisioning produces same starting state)
- Environments must be disposable (clean teardown after each run)
- Provisioning must be fast enough to not dominate total evaluation time

**Agent Runner**: Executes the agent within its provisioned environment. Manages:
- Agent initialization with the task prompt and any configuration
- Tool access permissions (which tools the agent can use)
- Timeout enforcement (kill the agent if it exceeds the time limit)
- Resource limits (CPU, memory, network bandwidth)
- Trajectory logging (record every action, observation, and decision)

**Output Collector**: Captures all evaluation-relevant artifacts:
- Agent's final output (text, code, file changes)
- Action trajectory (sequence of tool calls and observations)
- Environment state after execution
- Resource usage metrics (tokens consumed, API calls made, wall-clock time)
- Any errors or exceptions encountered

**Scorer**: Applies one or more evaluation methods to the collected outputs:
- Test suite execution (see `code-execution-based-evaluation.md`)
- Environment state checks (see `environment-state-evaluation.md`)
- LLM-as-Judge scoring (see `../llm-concepts/llm-as-judge.md`)
- Agent-as-Judge assessment (see `agent-as-judge.md`)
- Reference comparison metrics (exact match, BLEU, ROUGE)

**Result Aggregator**: Combines individual task scores into summary metrics:
- Overall pass rate and confidence intervals
- Per-category breakdowns (by task type, difficulty, domain)
- Statistical significance tests comparing agent versions
- Cost and efficiency summaries

**Report Generator**: Produces human-readable evaluation reports:
- Summary dashboards with key metrics
- Detailed per-task results with failure analysis
- Trend charts across evaluation runs
- Flagged anomalies (unexpected score drops, timeout spikes)

### Orchestration Concerns

**Parallel Execution**: Running tasks sequentially is too slow. A 500-task evaluation at 5 minutes per task takes 42 hours sequentially but 1.5 hours with 30 parallel workers. Key decisions:
- Worker pool sizing based on available compute and API rate limits
- Task scheduling (round-robin, priority-based, dependency-aware)
- Rate limiting for LLM API calls shared across parallel workers

**Failure Handling**: In a 500-task evaluation, some tasks will fail due to timeouts, environment provisioning errors, API outages, or agent crashes. The pipeline must:
- Distinguish infrastructure failures from agent failures (a timeout due to a slow container launch is not the agent's fault)
- Retry transient failures with exponential backoff
- Record and report persistent failures without blocking the overall evaluation
- Support resumption from the point of failure rather than restarting from scratch

**Timeout Management**: Agents can hang indefinitely on difficult tasks. A layered timeout strategy:
- Per-action timeout: Kill individual tool calls that exceed 30-60 seconds
- Per-task timeout: Kill the entire agent execution after 5-30 minutes (task-dependent)
- Per-evaluation timeout: Abort the overall evaluation run after a maximum wall-clock duration
- Graceful degradation: Timed-out tasks receive a "timeout" result, not a crash

### Infrastructure

**Containerized Environments**: Docker containers (or lightweight VMs) provide the isolation and reproducibility that evaluation demands. Each task runs in a fresh container built from a version-pinned image. Container orchestration platforms (Kubernetes, Docker Swarm) manage resource allocation across parallel evaluations.

**Result Storage**: Evaluation results need durable, queryable storage:
- Structured data (scores, metrics, metadata) in a database (PostgreSQL, SQLite for local runs)
- Artifacts (trajectories, logs, screenshots) in object storage (S3, GCS, or local filesystem)
- Experiment tracking platforms (Weights & Biases, MLflow) for cross-run comparison and visualization

**Cost Tracking**: Agent evaluations consume expensive resources (LLM API calls, compute infrastructure). The pipeline should track:
- Per-task token consumption and API costs
- Per-task compute time and infrastructure costs
- Cumulative costs per evaluation run with budget alerts
- Cost breakdowns by evaluation method (LLM-as-Judge calls vs. agent execution vs. environment provisioning)

### How Production Frameworks Architect Their Pipelines

**Inspect AI** (by UK AISI): Defines evaluations as Python functions with decorators. Tasks are loaded from datasets, agents run in sandboxed environments (Docker, local processes), and scorers are modular functions that can be composed. The framework handles parallel execution, state management, and result logging. A distinctive feature is its solver-based architecture where the agent's reasoning strategy is defined separately from the task and evaluation.

**LangSmith** (by LangChain): Provides tracing infrastructure that captures every LLM call, tool use, and chain step. Evaluation runs compare agent outputs against datasets using configurable evaluators (LLM-based, heuristic, or custom). Results are stored in a managed backend with dashboards for visualization. Integrates tightly with LangChain agent implementations.

**Braintrust**: Focuses on experiment tracking and LLM evaluation. Provides a managed evaluation pipeline with scoring functions, dataset management, and comparative analysis. Emphasizes rapid iteration with a web UI for reviewing individual results and identifying failure patterns.

## Why It Matters

1. **Reliable evaluation requires reliable infrastructure.** A flaky pipeline that drops 5% of results or misattributes scores undermines all evaluation conclusions.

2. **Evaluation cost management depends on pipeline design.** Without cost tracking and parallel execution, large-scale evaluation becomes prohibitively expensive or slow.

3. **Reproducibility is an engineering problem.** Running "the same evaluation" next month requires version-pinned environments, frozen task sets, and deterministic orchestration.

4. **Failure analysis requires comprehensive logging.** When an agent scores poorly, the team needs trajectory logs, environment states, and scorer outputs to diagnose why.

5. **Pipeline architecture determines evaluation velocity.** A well-engineered pipeline lets teams run evaluations in hours, not days, enabling rapid iteration on agent development.

## Key Technical Details

- Typical parallel worker counts: 10-50 for API-based agents, 5-20 for locally-run agents (constrained by GPU availability)
- Container startup overhead: 2-10 seconds for pre-built images, 30-120 seconds with dependency installation
- Result storage footprint: approximately 1-10 MB per task (trajectory logs dominate)
- A 500-task evaluation with 30 parallel workers and 5-minute average task duration completes in approximately 90 minutes
- Budget alerts should trigger at 80% of expected cost; evaluate whether remaining tasks justify continuing
- Evaluation runs should be tagged with agent version, task suite version, and pipeline configuration for reproducibility

## Common Misconceptions

**"A script that loops over tasks and prints scores is a sufficient pipeline."** It works for prototyping but fails at scale. No parallelism, no failure recovery, no cost tracking, no reproducibility guarantees.

**"The evaluation framework handles everything."** Frameworks like Inspect AI and LangSmith provide building blocks, but teams still need to configure environments, write custom scorers, manage infrastructure, and build reporting tailored to their needs.

**"More parallelism is always better."** Parallelism is bounded by API rate limits, compute availability, and cost. Hitting LLM API rate limits with 100 parallel workers causes cascading failures and wasted retries.

**"Evaluation pipeline complexity is not worth the investment for small teams."** Even a 50-task evaluation benefits from containerized environments, basic failure handling, and result persistence. The investment scales with team size, but the fundamentals matter at every scale.

## Connections to Other Concepts

- Orchestrates all evaluation methods: `agent-as-judge.md`, `code-execution-based-evaluation.md`, `environment-state-evaluation.md`, `reference-free-evaluation.md`
- Applies rubrics from `rubric-engineering.md` through the scorer component
- Incorporates judge validation from `judge-calibration-and-validation.md` as a quality assurance step
- Can run `multi-dimensional-debate-evaluation.md` as a composed scoring strategy
- Connects to `../ai-agent-concepts/tool-use.md` for provisioning agent tool access

## Further Reading

- "Inspect AI: A Framework for Large Language Model Evaluations" -- UK AI Safety Institute, 2024
- "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" -- Jimenez et al., 2024
- "Holistic Evaluation of Language Models (HELM)" -- Liang et al., 2023
- "EleutherAI Language Model Evaluation Harness" -- Gao et al., 2023
