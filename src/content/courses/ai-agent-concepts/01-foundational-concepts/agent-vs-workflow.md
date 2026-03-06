# Agent vs. Workflow

**One-Line Summary**: Agents and workflows represent two fundamentally different approaches to automating tasks — agents use LLM reasoning to dynamically decide each step, while workflows follow predetermined coded paths — and choosing between them is one of the most consequential architectural decisions in building AI systems.

**Prerequisites**: `what-is-an-ai-agent.md`, `agent-loop.md`

## What Is the Agent vs. Workflow Distinction?

Consider two approaches to navigating an unfamiliar city. The workflow approach is GPS turn-by-turn navigation: every decision is predetermined, each step follows a fixed rule ("in 200 meters, turn right"), and deviations from the path trigger recalculation using the same deterministic algorithm. The agent approach is hiring a local guide who knows the city: they make judgment calls in real time, adapt to unexpected road closures, suggest a better restaurant they just remembered, and handle ambiguity that no pre-programmed route could anticipate. Both get you to your destination, but they handle complexity and uncertainty in fundamentally different ways.

A **workflow** is a deterministic sequence of steps where the logic is coded explicitly. Each step may involve an LLM call, but the *orchestration* — what happens after each step, what branches to take, how errors are handled — is defined in code. A workflow is a program that happens to use LLMs at certain steps. An **agent** is a system where the LLM itself decides the orchestration: which step comes next, which tool to call, when to retry, and when to stop. The LLM is both the worker and the manager.

This distinction matters because agents and workflows have sharply different tradeoffs in predictability, cost, latency, debuggability, and capability. Using an agent where a workflow would suffice wastes money and introduces unnecessary variability. Using a workflow where an agent is needed produces brittle systems that break on edge cases. The decision framework presented here helps make this choice systematically.

*Recommended visual: A side-by-side comparison — Left: a workflow as a DAG with fixed nodes and edges. Right: an agent as a loop with the LLM deciding the next step dynamically — see [Anthropic, "Building Effective Agents" (2024)](https://www.anthropic.com/research/building-effective-agents)*

![Agent overview showing how the LLM dynamically orchestrates planning, memory, and tool use in a flexible loop](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Source: [Lilian Weng, "LLM Powered Autonomous Agents" (2023)](https://lilianweng.github.io/posts/2023-06-23-agent/) — This agent architecture contrasts with fixed workflow DAGs by having the LLM dynamically decide each step.*

## How It Works

### Workflow Architecture

A workflow is structured as a directed graph of steps. Each step performs a specific operation — an LLM call, an API request, a data transformation — and the edges between steps are defined in code. Common patterns include:

- **Prompt chaining**: LLM Call A produces output that feeds into LLM Call B. Example: generate a summary, then translate the summary.
- **Routing**: An LLM classifies input, and the classification determines which branch of code executes. Example: classify a customer email as billing/technical/general, then route to the appropriate handler.
- **Map-reduce**: Split input into chunks, process each with an LLM in parallel, then aggregate results. Example: summarize each chapter of a book, then synthesize chapter summaries into a book summary.
- **Validation loops**: An LLM generates output, a validator checks it, and if validation fails, the LLM regenerates with the validation feedback. The retry logic is coded, not LLM-decided.

Workflows are implemented using standard programming constructs (functions, conditionals, loops) or orchestration frameworks (LangChain LCEL, Prefect, Temporal, Airflow).

### Agent Architecture

An agent places the LLM at the center of the control flow. Instead of coded edges between steps, the LLM decides what to do next based on the full context of the task so far. The agent runtime provides:

- A set of available tools (the action space).
- The conversation history (including all previous tool calls and results).
- The system prompt (defining the agent's role and constraints).

The LLM outputs either a tool call (continue working) or a final response (task complete). There is no coded graph — the execution path is determined entirely at runtime by the LLM's reasoning.

### The Decision Framework

Use this framework to choose between agents and workflows:

| Factor | Favors Workflow | Favors Agent |
|--------|----------------|--------------|
| **Task definition** | Well-defined, predictable steps | Open-ended, variable steps |
| **Input variability** | Inputs are structured and constrained | Inputs are diverse and ambiguous |
| **Error handling** | Errors are predictable and enumerable | Errors are diverse and require judgment |
| **Cost sensitivity** | High — every token matters | Moderate — value justifies cost |
| **Latency requirements** | Strict — must complete in seconds | Flexible — minutes are acceptable |
| **Debuggability need** | Must trace exact execution path | Acceptable to have non-deterministic paths |
| **Correctness verification** | Hard to verify outputs automatically | Outputs can be tested or reviewed |
| **Task complexity** | Low to moderate | Moderate to high |

### Hybrid Approaches

In practice, the best systems combine both. Common patterns:

- **Workflow with agent steps**: A coded pipeline where one or more steps are handled by an agent. Example: a data pipeline that uses a workflow for ETL but invokes an agent for anomaly investigation.
- **Agent with workflow subroutines**: An agent that calls pre-defined workflow functions as tools. Example: a coding agent that has a `run_test_suite` tool (a workflow) as one of its available actions.
- **Escalation patterns**: Start with a workflow; if the workflow encounters an edge case it cannot handle, escalate to an agent. Example: automated customer support that handles routine queries via workflow and escalates complex issues to an agent.

## Why It Matters

### Cost and Efficiency

Workflows are dramatically cheaper per execution. A three-step prompt chain might use 5,000 total tokens. The equivalent agent, reasoning about which steps to take, might use 30,000-50,000 tokens to arrive at the same three steps — a 6-10x cost increase. For tasks executed thousands of times per day (email classification, data extraction, content moderation), this difference is decisive.

### Reliability and Predictability

Workflows produce deterministic results given the same input (assuming temperature=0). Agents do not — they may take different paths, use different tools, and produce different outputs across runs. For compliance-sensitive applications (financial reporting, medical record processing), workflow predictability may be a hard requirement.

### Capability Ceiling

Workflows break when they encounter situations not anticipated by their designers. An email routing workflow fails on emails that do not fit any pre-defined category. A data extraction pipeline fails on documents with unexpected formats. Agents handle these cases naturally because the LLM can reason about novel situations. For tasks with high variability and many edge cases, agents are the only viable approach.

## Key Technical Details

- **Token efficiency ratio**: Workflows use 3-10x fewer tokens than agents for equivalent tasks with well-defined steps, because the LLM does not need to reason about orchestration.
- **Latency comparison**: A three-step workflow with parallel execution completes in the time of the slowest step (1-3 seconds). An agent taking 3 steps sequentially takes 3-10 seconds due to serial LLM calls.
- **Failure modes differ fundamentally**: Workflows fail predictably (step X returned error Y). Agents fail unpredictably (the LLM chose a suboptimal strategy, hallucinated a file path, or got stuck in a retry loop). Workflow failures are easier to diagnose and fix.
- **Workflow execution frameworks**: LangGraph (graph-based orchestration), Prefect/Airflow (data pipeline orchestration), Temporal (durable workflow execution), and custom code. Agent frameworks: Claude Agent SDK, OpenAI Assistants API, LangGraph (agent mode), CrewAI.
- **Testing approaches differ**: Workflows can be unit-tested step by step with mocked inputs and expected outputs. Agents require evaluation suites with diverse test cases and scoring rubrics, similar to testing a human employee.
- **Maintenance burden**: Workflows require maintenance when requirements change (new branches, new steps). Agents adapt to requirement changes via system prompt updates — cheaper to modify but harder to verify.
- **Break-even complexity**: Empirically, tasks requiring fewer than 5 deterministic steps are almost always better as workflows. Tasks requiring 10+ steps with branching and error recovery are almost always better as agents. The 5-10 step range is the decision boundary.

## Common Misconceptions

**"Agents are always better because they're more flexible."**
Flexibility comes at the cost of predictability, cost, and debuggability. For well-defined tasks, a workflow is strictly superior — faster, cheaper, more reliable, and easier to test. Using an agent for a task that could be a workflow is an anti-pattern.

**"Workflows can't use LLMs."**
Workflows frequently use LLMs at individual steps — for classification, extraction, summarization, or generation. The distinction is not whether LLMs are involved, but whether the LLM controls the orchestration (agent) or the code controls the orchestration (workflow).

**"You must choose one or the other."**
Hybrid approaches are the norm in production systems. A common and effective pattern is a workflow backbone with agent-powered steps for subtasks that require judgment and flexibility.

**"Agents are just workflows with more steps."**
The difference is qualitative, not quantitative. A workflow's execution path is determined at design time. An agent's execution path is determined at runtime by the LLM. This means agents can handle situations their designers never anticipated — and also means they can take unanticipated wrong turns.

**"Deterministic workflows are outdated now that we have agents."**
For high-volume, well-defined tasks (data processing pipelines, content moderation, email routing), deterministic workflows remain the gold standard. Agents supplement workflows for complex, variable tasks; they do not replace them.

## Connections to Other Concepts

- `agent-loop.md` — The agent loop is what distinguishes agent architecture from workflow architecture at the implementation level.
- `autonomy-spectrum.md` — Workflows typically operate at copilot/assistant autonomy levels, while agents span the full spectrum.
- `determinism-vs-stochasticity.md` — The predictability differences between agents and workflows are a direct consequence of LLM stochasticity.
- `llm-as-reasoning-engine.md` — In agent architecture, the LLM is the reasoning engine that replaces coded control flow. In workflow architecture, the LLM is a processing component within coded control flow.
- `action-space-design.md` — Agent action spaces and workflow step definitions serve the same purpose (defining available operations) but with different design constraints.

## Further Reading

- **Anthropic, "Building Effective Agents" (2024)** — Strongly advocates starting with workflows and graduating to agents only when necessary, with detailed guidance on when each is appropriate.
- **Harrison Chase, "Don't Build a Workflow When You Need an Agent (and Vice Versa)" (2024)** — LangChain founder's perspective on the decision framework, with concrete examples from production deployments.
- **Camunda, "Orchestrating AI Agents with Process Orchestration" (2024)** — Enterprise perspective on integrating LLM agents into existing workflow orchestration systems.
- **Chip Huyen, "Building a LLM Application" (2023)** — Practical guide covering the spectrum from simple LLM calls through prompt chains to agent systems, with cost and performance analysis.
