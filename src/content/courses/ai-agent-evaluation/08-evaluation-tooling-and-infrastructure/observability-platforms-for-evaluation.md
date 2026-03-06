# Observability Platforms for Evaluation

**One-Line Summary**: Observability platforms combine tracing, logging, and evaluation capabilities into unified systems that let teams debug agent behavior in development and extract evaluation datasets from production.

**Prerequisites**: `../01-foundations-of-agent-evaluation/what-is-agent-evaluation.md`, `../04-trajectory-and-process-analysis/trajectory-evaluation-fundamentals.md`, `../09-production-evaluation-and-monitoring/online-evaluation-and-ab-testing.md`

## What Is Observability for Evaluation?

Imagine a flight data recorder on an aircraft. It captures every instrument reading, every control input, and every communication -- not just so investigators can reconstruct what happened after a crash, but so engineers can continuously improve aircraft design. Observability platforms serve the same function for AI agents: they capture the full trace of agent behavior so teams can both debug failures and systematically evaluate performance.

The key insight driving modern observability platforms is that **observability and evaluation are converging**. A trace that records every LLM call, tool invocation, and intermediate reasoning step during production use is essentially the same data structure needed for trajectory evaluation. Platforms that started as debugging tools now include scoring pipelines, and platforms that started as evaluation frameworks now include production tracing. The line between "monitoring" and "evaluating" is dissolving.

This convergence is practical, not just theoretical. Production traces become evaluation datasets. Evaluation failures surface monitoring alerts. The same dashboard that shows latency trends also shows accuracy trends. Organizations that treat observability and evaluation as separate systems end up duplicating infrastructure and losing the feedback loop between production behavior and offline assessment.

## How It Works

### LangSmith

LangSmith, built by LangChain, provides deep integration with the LangChain and LangGraph ecosystems. Its core capabilities include:

- **Step-by-step agent tracing**: Every node in a LangGraph agent -- LLM calls, tool uses, routing decisions -- is captured as a nested span with full input/output data, token counts, and latency measurements.
- **Trajectory evaluation**: Traces can be scored not just on final output but on the entire sequence of actions. Did the agent use tools in the right order? Did it avoid unnecessary API calls?
- **LLM-as-judge scoring**: Built-in support for configuring LLM evaluators that grade traces against rubrics, with human override and calibration workflows.
- **Dataset management**: Production traces can be promoted into evaluation datasets with one click, creating a tight loop between what agents do in production and what they are tested against.

LangSmith is commercially licensed, with free tiers for individual developers and usage-based pricing for teams.

### Langfuse

Langfuse takes an open-source-first approach to LLM observability. Key differentiators:

- **MIT-licensed** with no usage limits on the self-hosted version -- organizations can instrument millions of traces without per-event charges.
- **Full tracing**: Nested spans capture multi-step agent workflows, including parallel tool calls and branching logic.
- **Framework agnostic**: Official integrations with LangChain, LlamaIndex, OpenAI SDK, and Anthropic SDK, plus a low-level SDK for custom frameworks.
- **Evaluation integration**: Traces can be annotated with scores (human or automated), and datasets can be created from production traces for offline evaluation.
- **Prompt management**: Versioned prompt storage with A/B testing support, linking prompt changes to evaluation outcomes.

The self-hosted model makes Langfuse attractive for organizations with data residency requirements or those evaluating sensitive workloads.

### Braintrust

Braintrust differentiates through framework agnosticism and performance engineering:

- **Custom database architecture**: Purpose-built storage engine claims 86x faster search than generic alternatives, enabling real-time exploration of large evaluation datasets.
- **Unified observability and evaluation**: The same platform handles production logging, offline evaluation, prompt experimentation, and dataset management without context-switching.
- **Framework agnostic**: No dependency on specific agent frameworks. Works with any LLM provider, any orchestration library, and any deployment pattern.
- **Scoring pipelines**: Configurable evaluation pipelines that can combine automated scorers, LLM judges, and human review into composite assessment workflows.

### AgentOps

AgentOps targets enterprise requirements with a SaaS-first model:

- **Usage-based pricing**: Pay per event, with no infrastructure management overhead.
- **Compliance**: SOC 2 Type II and HIPAA compliance certifications, critical for healthcare and financial services agent deployments.
- **Agent-specific telemetry**: Purpose-built for multi-step agent workflows rather than adapted from general-purpose APM (Application Performance Monitoring) tools.
- **Session replay**: Visual replay of agent sessions showing the full decision tree, tool calls, and state transitions.

### Bloom (Anthropic)

Bloom occupies a unique position as an open-source framework specifically designed for automated behavioral evaluation:

- **Scenario generation**: Programmatically generates thousands of evaluation scenarios to test specific behavioral tendencies.
- **Pattern detection**: Identifies subtle behavioral patterns across large evaluation runs -- not just whether the agent fails, but how it tends to fail.
- **Behavioral profiling**: Creates multi-dimensional profiles of agent behavior, surfacing tendencies that individual test cases might miss.

### The Observability-Evaluation Feedback Loop

The most powerful pattern emerging from these platforms is the production-to-evaluation pipeline:

1. **Capture**: Production traces are collected automatically during normal agent operation.
2. **Identify**: Interesting traces -- failures, edge cases, high-latency interactions -- are flagged by automated rules or human review.
3. **Curate**: Flagged traces are promoted into evaluation datasets with ground-truth labels added by domain experts.
4. **Evaluate**: New agent versions are tested against these production-derived datasets before deployment.
5. **Deploy**: Improved agents go to production, generating new traces, and the cycle repeats.

This loop ensures that evaluations stay grounded in real-world usage patterns rather than drifting toward synthetic scenarios that may not reflect actual deployment conditions.

## Why It Matters

1. **Debug complex failures**: Multi-step agent failures are nearly impossible to diagnose from final outputs alone. Tracing reveals where in the reasoning chain things went wrong -- a critical capability as agents grow more autonomous.
2. **Production-grounded evaluation**: Evaluation datasets built from production traces test what agents actually encounter, not what evaluators imagine they might encounter. This closes the gap between offline evaluation and production performance.
3. **Cost visibility**: Observability platforms track token usage, API calls, and compute costs per trace, enabling teams to optimize the cost-quality tradeoff with actual data rather than estimates.
4. **Compliance and auditability**: For regulated industries, the ability to replay and audit every agent decision is not optional. Observability platforms provide the audit trail that compliance teams require.

## Key Technical Details

- LangSmith traces capture median overhead of 5-15ms per span, negligible for most agent workflows
- Langfuse self-hosted deployments typically require PostgreSQL + ClickHouse, with storage scaling linearly with trace volume
- Braintrust's custom database supports sub-second queries over millions of evaluation records
- AgentOps claims SOC 2 Type II and HIPAA compliance, with data encryption at rest and in transit
- Most platforms support OpenTelemetry-compatible trace export, enabling integration with existing infrastructure monitoring
- Production-to-evaluation dataset pipelines typically surface 10-50 high-value test cases per week from moderate-traffic deployments
- Trace storage costs range from $0.001-0.01 per trace depending on platform and trace complexity

## Common Misconceptions

**"Observability is just logging with a fancier name."** Logging captures events. Observability captures structured relationships between events -- the causal chain from input to tool call to intermediate reasoning to output. This structure is what makes traces useful for evaluation, not just debugging.

**"You need to pick either an observability platform or an evaluation framework."** These serve complementary purposes. An observability platform captures production behavior; an evaluation framework runs controlled experiments. The most effective setups use both, with the observability platform feeding data into the evaluation framework.

**"Open-source platforms are always cheaper."** Self-hosted platforms eliminate per-event fees but introduce infrastructure management costs: server provisioning, database maintenance, upgrades, and on-call responsibilities. For small teams, managed SaaS platforms may have lower total cost of ownership.

**"All platforms capture the same data."** Trace granularity varies significantly. Some platforms capture only LLM inputs and outputs; others capture internal agent state, memory contents, and planning steps. The depth of capture determines what evaluations are possible downstream.

## Connections to Other Concepts

- `inspect-ai-and-open-source-frameworks.md` covers the open-source evaluation frameworks that observability platforms complement
- `evaluation-result-analysis-and-visualization.md` discusses how to make sense of the data these platforms collect
- `evaluation-dataset-management.md` details the dataset curation practices that production-to-evaluation pipelines support
- `../04-trajectory-and-process-analysis/trajectory-evaluation-fundamentals.md` provides the theoretical basis for trace-based evaluation
- `../09-production-evaluation-and-monitoring/online-evaluation-and-ab-testing.md` covers how observability feeds into production evaluation strategies
- `../06-cost-quality-latency-tradeoffs/cost-aware-evaluation-design.md` connects to the cost tracking capabilities of observability platforms

## Further Reading

- "LangSmith Documentation: Tracing and Evaluation" -- LangChain, 2024
- "Langfuse: Open Source LLM Engineering Platform" -- Langfuse Team, 2024
- "Building Observable LLM Applications" -- Braintrust AI, 2024
- "Observability for Large Language Model Applications" -- Shankar et al., 2024
- "The Convergence of Monitoring and Evaluation in AI Systems" -- Paleyes et al., 2023
