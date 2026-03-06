# Agent Deployment

**One-Line Summary**: Deploying agents to production involves containerization, scaling strategies, version management of prompts and tools, and operational practices that account for agents being fundamentally harder to deploy than traditional APIs.

**Prerequisites**: Agent orchestration, error handling and retries, logging tracing and debugging

## What Is Agent Deployment?

Deploying a traditional API is like opening a restaurant with a fixed menu: you know exactly what goes in and what comes out. Deploying an agent is like opening a restaurant where the chef improvises every dish based on the customer's mood, available ingredients, and current weather. The inputs are unpredictable, the execution path varies wildly, latency is non-deterministic, and the output quality depends on a stochastic model. This makes agent deployment an order of magnitude harder than API deployment.

An agent in production is not a single service -- it is a system of components: the LLM provider (OpenAI, Anthropic, Google), the orchestration runtime (your agent code), the tool services (APIs, databases, file systems the agent accesses), the state store (checkpoints, memory), and the observability stack (tracing, logging, monitoring). Each component must be deployed, versioned, scaled, and monitored independently. A change to any component can alter agent behavior in unexpected ways.

*Recommended visual: Architecture diagram showing the agent deployment stack — LLM provider, orchestration runtime, tool services, state store, and observability stack — with version tags on each component — see [Kreuzberger et al., 2023 — MLOps Survey](https://arxiv.org/abs/2205.02302)*

The deployment challenge is compounded by the fact that agent behavior is hard to test comprehensively. A traditional API can be tested with fixed input-output pairs. An agent's behavior depends on the model's stochastic output, which means the same input can produce different execution paths. You cannot write a deterministic test that covers all possible behaviors. This requires a fundamentally different approach to deployment: canary releases, shadow deployments, real-time evaluation, and rapid rollback capabilities.

## How It Works

### Containerization
Agent code, dependencies, and configuration are packaged into Docker containers. The container includes: the orchestration framework (LangGraph, CrewAI), tool implementations, prompt templates, configuration files, and any local models or embeddings. Environment variables provide secrets (API keys, database credentials) and runtime configuration (model selection, temperature, token limits). Multi-stage Docker builds keep images small: a build stage installs dependencies, a runtime stage copies only the necessary artifacts. Typical agent container images range from 500MB (Python + minimal dependencies) to 2GB+ (with local embedding models).

### Scaling Strategies
Agents present unique scaling challenges. **Horizontal scaling** for concurrent users: run multiple agent container replicas behind a load balancer. Each replica handles one or more concurrent agent sessions. **Vertical scaling** for complex tasks: some agent tasks require more memory (large context windows, many tool results) or compute (local model inference). **Autoscaling** based on queue depth: if using an event-driven architecture, scale replicas based on the number of pending tasks in the queue. **The critical constraint**: each agent session may hold significant state (conversation history, intermediate results), so sticky sessions or externalized state stores are required for horizontal scaling.

### Versioning
Agent behavior depends on at least three versioned components: **Prompt versions** (system prompts, tool descriptions, few-shot examples), **Tool versions** (API schemas, tool implementations, external service versions), and **Model versions** (GPT-4-turbo-2024-04-09 vs GPT-4o-2024-08-06). A deployment artifact must pin all three. Prompt changes are the most frequent and highest-impact: a single word change in the system prompt can dramatically alter behavior. Best practice: store prompts in version control alongside code, tag deployments with a composite version (prompt-v3.2 + tools-v1.5 + model-gpt4o-20240806), and maintain the ability to roll back any component independently.

*Recommended visual: Blue-green deployment diagram showing two identical environments with a traffic router switching between them, plus a canary deployment variant with 10/90 traffic split — see [Kubernetes Documentation — Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)*

### A/B Testing and Canary Releases
Given the stochastic nature of agents, A/B testing is essential for evaluating changes. Route 10% of traffic to the new agent configuration and 90% to the current production version. Compare metrics: task completion rate, user satisfaction (thumbs up/down), average latency, cost per task, and error rate. Canary releases are a more conservative variant: deploy the new version to a single replica, monitor for anomalies, and gradually increase traffic if metrics are healthy. Blue-green deployments maintain two complete environments: "blue" runs the current version, "green" runs the new version. Traffic switches atomically from blue to green, with instant rollback by switching back.

## Why It Matters

### Agents Are Not APIs
Traditional deployment practices assume deterministic, stateless services with predictable latency. Agents violate all three assumptions: they are non-deterministic (stochastic model outputs), stateful (multi-step execution with accumulated context), and have wildly variable latency (a simple query takes 2 seconds, a complex research task takes 5 minutes). Deployment infrastructure must accommodate 100x latency variation, per-session state management, and quality monitoring that goes beyond HTTP status codes.

### The Cost of Bad Deployments
A bad agent deployment does not just return errors -- it returns confidently wrong answers, takes unauthorized actions, or runs up massive API bills. A prompt regression that causes the agent to call tools unnecessarily could 10x your API costs before anyone notices. A model version change that degrades reasoning quality could silently reduce task completion rates. The blast radius of agent deployment failures is larger and harder to detect than traditional service failures.

### Regulatory and Compliance Requirements
Agents that interact with customer data, make financial decisions, or operate in regulated industries must meet audit requirements. This means: immutable deployment artifacts (you must be able to reproduce exactly what ran for any given task), complete trace logs (every LLM input/output must be recorded), access control (who can deploy, who can modify prompts), and change management (formal review before production changes). These requirements elevate deployment from an engineering concern to a governance concern.

## Key Technical Details

- **Health checks** for agent services must go beyond HTTP 200: verify that the LLM provider is reachable, tool services are healthy, and the state store is accessible. A "deep health check" runs a simple agent task end-to-end.
- **Graceful shutdown** must wait for in-progress agent tasks to complete (or checkpoint) before terminating the container, preventing partial execution and data loss
- **Resource limits** are critical: set CPU, memory, and timeout limits per agent task to prevent runaway executions from consuming cluster resources
- **Prompt management platforms** (Humanloop, PromptLayer, LangSmith Hub) provide versioning, A/B testing, and rollback for prompts independently of code deployments
- **Model fallback chains** configure a primary model with fallbacks: if Claude Sonnet returns a 503, fall back to GPT-4o; if that fails, fall back to a local model for critical paths
- **Secret rotation** must not require redeployment: use a secrets manager (AWS Secrets Manager, HashiCorp Vault) and refresh credentials at runtime
- **Rate limit management** at the deployment level prevents multiple agent replicas from collectively exceeding API rate limits; use a shared rate limiter (Redis-based) across replicas

## Common Misconceptions

- **"Deploying an agent is like deploying a microservice."** Agents have non-deterministic behavior, variable latency (seconds to minutes), stateful execution, and quality that depends on external model providers. Standard microservice patterns are necessary but insufficient.
- **"If the tests pass, it is safe to deploy."** Agent tests cover a tiny fraction of possible behaviors. A prompt change that passes 50 test cases might fail on the 51st pattern. A/B testing in production is essential for validating changes on real traffic.
- **"You can roll back an agent instantly."** Rolling back code is fast, but if the issue is a model version change at the provider, you may not be able to roll back. Maintain fallback model configurations for critical paths.
- **"Agents do not need SLAs."** Production agents serving users or business processes need latency SLAs (95th percentile response time), availability SLAs (99.9% uptime), and quality SLAs (task completion rate above threshold). These SLAs must account for LLM provider downtime.

## Connections to Other Concepts

- `error-handling-and-retries.md` -- Production deployment must include retry policies, circuit breakers, and fallback configurations as part of the deployment artifact
- `logging-tracing-and-debugging.md` -- Deployment pipelines should verify that tracing is functional before routing production traffic to a new version
- `cost-optimization.md` -- Deployment configurations include model routing, token budgets, and caching policies that directly affect operating costs
- `event-driven-architectures.md` -- Serverless deployment pairs naturally with event-driven agent architectures, providing automatic scaling and pay-per-use pricing
- `agent-orchestration.md` -- The orchestration framework is the core component being deployed; its configuration (graph structure, state schema) is part of the deployment artifact

## Further Reading

- **"Building Effective Agents" (Anthropic, 2024)** -- Includes practical guidance on deploying agent systems with emphasis on evaluation, monitoring, and iterative improvement
- **Kubernetes Documentation (CNCF, 2024)** -- Container orchestration platform used for deploying and scaling agent services, with support for autoscaling, rolling updates, and health checks
- **"MLOps: Machine Learning Operations" (Kreuzberger et al., 2023)** -- Survey of operational practices for ML systems, many directly applicable to agent deployment (model versioning, A/B testing, monitoring)
- **"Prompt Management Best Practices" (Humanloop, 2024)** -- Patterns for versioning, testing, and deploying prompts independently of application code
