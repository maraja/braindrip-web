# Sandboxed Evaluation Environments

**One-Line Summary**: Sandboxed environments provide the reproducible, isolated, and realistic execution contexts that agent evaluations require, ensuring that every evaluation run starts from an identical state and that agent actions cannot affect other evaluations or production systems.

**Prerequisites**: `../01-foundations-of-agent-evaluation/what-is-agent-evaluation.md`, `inspect-ai-and-open-source-frameworks.md`, `../02-benchmark-ecosystem/benchmark-design-principles.md`

## What Is a Sandboxed Evaluation Environment?

Consider a driving test conducted on a closed course. The course is reset to identical conditions for every candidate: the same cones, the same traffic signals, the same simulated pedestrians. No candidate's maneuvers affect the course for the next candidate. Yet the course is realistic enough that performance on it predicts real-world driving ability. The closed course is a sandbox -- an isolated, reproducible, realistic environment for evaluation.

Agent evaluation sandboxes serve the same function for AI systems. When an agent is asked to "find and fix the bug in this repository," it needs a real repository to work with -- files to read, code to execute, tests to run. But that repository must be pristine for every evaluation run (reproducibility), the agent's edits must not affect other concurrent evaluations (isolation), and the development environment must match what the agent would encounter in actual use (realism). Achieving all three properties simultaneously is the core challenge of sandboxed evaluation.

The stakes of getting this wrong are significant. Without deterministic reset, evaluation scores fluctuate based on leftover state from previous runs. Without isolation, concurrent evaluations interfere with each other, producing corrupted results. Without realism, strong evaluation performance does not predict production success. Sandboxing is the infrastructure that makes evaluation results trustworthy.

## How It Works

### Core Requirements

Every sandboxed evaluation environment must satisfy four properties:

**Deterministic reset**: The environment must return to an identical starting state before each evaluation task. "Identical" means byte-for-byte identical file systems, database contents, network configurations, and system state. Even subtle differences -- different timestamps, different random seeds in pre-loaded data, different process IDs -- can affect agent behavior in unpredictable ways.

**Isolation**: An agent's actions during one evaluation task must have zero effect on other evaluation tasks, whether concurrent or sequential. This includes file system changes, network state, database modifications, running processes, and system resource consumption. One runaway agent should not be able to consume all CPU or memory, degrading other evaluations.

**Realism**: The sandboxed environment must be close enough to production conditions that evaluation results generalize. An agent evaluated in an environment with different library versions, different file structures, or mocked APIs that behave differently from real ones may learn to exploit sandbox-specific shortcuts rather than developing genuinely useful capabilities.

**Performance**: Environment setup and teardown must be fast enough to be practical. If each evaluation task requires 10 minutes of environment initialization, a 500-task evaluation suite takes over 83 hours just for setup -- before any actual evaluation occurs.

### Implementation Approaches

**Docker containers** are the most common sandbox implementation for agent evaluation. Each evaluation task runs in a fresh container built from a defined image. Docker provides strong file system isolation, configurable resource limits, and fast startup (typically 2-5 seconds). Container images can be pre-built with specific tool chains, libraries, and data, ensuring deterministic starting state. Docker Compose extends this to multi-container environments where agents interact with databases, web servers, or other services.

Limitations: Docker shares the host kernel, providing weaker isolation than VMs. Container networking can be complex for evaluations requiring specific network topologies. Docker Desktop on macOS and Windows adds overhead compared to native Linux.

**Virtual machine snapshots** provide stronger isolation at the cost of slower startup. Each evaluation task restores a VM from a known snapshot, providing full operating system-level isolation including kernel state. VM-based sandboxes are appropriate when evaluations require kernel-level access, when agents install system packages, or when security isolation between evaluations is critical (e.g., evaluating potentially adversarial agents).

Typical VM restore times: 15-60 seconds for lightweight VMs, 1-5 minutes for full desktop environments. Proxmox, used by Inspect AI, provides efficient VM management for evaluation workloads.

**Cloud sandboxes** (Modal, AWS Lambda, Google Cloud Run) provide on-demand compute without managing infrastructure. Each evaluation task runs in a fresh cloud instance that is destroyed after completion. Cloud sandboxes are ideal for burst evaluation workloads -- running 500 evaluations in parallel during a pre-release assessment, then paying nothing when no evaluations are running.

Trade-offs: Network latency to cloud providers adds 50-200ms per interaction. Cold start times vary by provider (Modal: 1-3 seconds, Lambda: 5-15 seconds for container images). Costs scale linearly with evaluation volume.

### Environment State Management

**Database seeding**: Evaluations requiring database interaction need the database pre-populated with specific data. Seed scripts should be deterministic (no random data, fixed timestamps) and versioned alongside the evaluation dataset. Common patterns include SQL dump restoration (fast, brittle to schema changes) and programmatic seeding (slower, more maintainable).

**File system initialization**: For coding agent evaluations, the sandbox must contain specific repository states. Git-based initialization (cloning a specific commit) is clean but slow for large repositories. Layered Docker images (pre-clone in the image, apply task-specific patches at runtime) balance speed and flexibility.

**API mocking vs. live services**: When agents interact with external APIs (web search, code execution, third-party services), evaluators must choose between mocked and live endpoints.

- **Mocked APIs**: Deterministic responses ensure reproducibility. Fast execution. But mock fidelity degrades over time as real APIs evolve, and overly simplified mocks may not test the agent's ability to handle real-world API behavior.
- **Live APIs**: Realistic but non-deterministic. API responses change over time, introducing variance. Rate limits and costs constrain evaluation scale. Appropriate for final-stage validation but not for day-to-day regression testing.
- **Recorded replays**: A middle ground. Record real API interactions once, then replay them deterministically in subsequent evaluations. Provides realism without ongoing API costs or non-determinism. Requires periodic re-recording to prevent staleness.

### Network Simulation

Advanced evaluation scenarios require controlling network conditions:

- **Latency injection**: Add artificial latency to API calls to test agent behavior under slow network conditions. Does the agent handle timeouts gracefully? Does it retry appropriately?
- **Failure simulation**: Randomly drop or error network requests to test agent resilience. Can the agent recover from transient failures without losing progress?
- **Bandwidth throttling**: Restrict network bandwidth to test agent behavior with large data transfers.
- **Network partitioning**: Selectively block access to specific endpoints to test the agent's behavior when expected services are unavailable.

Tools like `tc` (traffic control) on Linux, Toxiproxy, or Chaos Monkey-style injectors can be integrated into Docker-based sandboxes.

### The Gap Between Evaluation and Production

No sandbox perfectly replicates production. Key gaps to be aware of:

- **User behavior**: Sandboxed evaluations use scripted tasks; real users are unpredictable, underspecified, and interrupt mid-conversation.
- **Scale effects**: Production systems handle concurrent requests, shared state, and resource contention that single-agent sandboxes do not replicate.
- **Temporal dynamics**: Production environments change over time -- databases grow, APIs deprecate, external conditions evolve. Sandboxes capture a single point-in-time snapshot.
- **Feedback loops**: In production, agent outputs influence subsequent user inputs. Sandboxed evaluations rarely capture this interactive dynamic.

Acknowledging these gaps is important for calibrating confidence in evaluation results. Sandbox evaluations provide necessary but not sufficient evidence of production readiness.

### Cost of Environment Management at Scale

At scale, sandbox management becomes a significant infrastructure concern:

- **Storage**: Each Docker image or VM snapshot consumes storage. A library of 50 evaluation environments at 2-10GB each requires 100-500GB of maintained, versioned image storage.
- **Build time**: Rebuilding sandbox images when dependencies update can take 10-60 minutes per image. CI-based image building and registry caching help manage this.
- **Orchestration**: Running hundreds of concurrent sandboxes requires container orchestration (Kubernetes), resource scheduling, and cleanup of orphaned containers.
- **Maintenance**: Sandbox definitions drift from production as dependencies and configurations evolve. Quarterly audits ensure sandbox fidelity.

## Why It Matters

1. **Reproducibility is non-negotiable**: Without deterministic environments, evaluation scores are not comparable across runs, teams, or time. Reproducibility is the minimum standard for scientific evaluation.
2. **Safety requires isolation**: Evaluating agents that execute code, browse the web, or modify files demands strong isolation. Without sandboxing, a misbehaving agent can damage shared infrastructure or leak sensitive data.
3. **Realism drives validity**: Evaluation results only predict production performance if the evaluation environment matches production conditions. The closer the sandbox mirrors reality, the more trustworthy the results.
4. **Parallelism enables scale**: Isolated sandboxes can run concurrently without interference, enabling large evaluation suites to complete in hours rather than days.

## Key Technical Details

- Docker container startup: 2-5 seconds (pre-pulled image), 15-60 seconds (image pull required)
- VM snapshot restore: 15-60 seconds (Proxmox/QEMU), 1-5 minutes (full desktop environments)
- Modal serverless startup: 1-3 seconds (warm), 10-30 seconds (cold)
- Typical Docker image sizes for agent evaluation: 500MB-5GB depending on toolchain complexity
- Resource limits per container: typically 2-4 CPU cores, 4-8GB RAM, 10-50GB disk
- Concurrent sandbox capacity on a 32-core, 128GB RAM host: 8-32 Docker containers or 4-8 VMs
- Network simulation overhead: less than 1ms with tc; 2-5ms with proxy-based tools like Toxiproxy
- Container cleanup should include explicit volume removal and network pruning to prevent resource leaks

## Common Misconceptions

**"Docker provides sufficient security isolation for adversarial evaluations."** Docker provides process and file system isolation, but containers share the host kernel. A sufficiently sophisticated agent could potentially escape container isolation. For evaluations involving untrusted or adversarial agents, VM-level isolation or microVM solutions (Firecracker, gVisor) are more appropriate.

**"Mocking all external services is always the right approach."** Over-mocking creates a gap between evaluation and production. Agents that perform well against simplified mocks may fail when confronting real API behavior, including rate limits, pagination, error responses, and undocumented edge cases. Use mocks for determinism during development; validate against live services before deployment.

**"Environment setup time does not matter if you are running evaluations overnight."** Slow environment setup limits iteration speed during development, when rapid feedback matters most. It also multiplies costs for cloud-based sandboxes, where per-minute billing makes startup time directly translate to dollars.

**"A single sandbox configuration works for all evaluation tasks."** Different tasks require different environments. A coding evaluation needs language runtimes and build tools; a web browsing evaluation needs a browser and target websites; a data analysis evaluation needs databases and datasets. Maintaining a library of task-specific sandbox configurations is essential.

## Connections to Other Concepts

- `inspect-ai-and-open-source-frameworks.md` describes Inspect AI's built-in Docker, Kubernetes, Modal, and Proxmox sandbox support
- `ci-cd-integration-for-agent-evaluation.md` covers how sandboxed environments are created and destroyed within CI pipelines
- `evaluation-dataset-management.md` addresses the data that is loaded into sandboxed environments for each evaluation
- `custom-evaluator-development.md` discusses building evaluators that interact with sandbox state
- `../09-production-evaluation-and-monitoring/online-evaluation-and-ab-testing.md` contrasts sandboxed evaluation with production evaluation
- `../07-safety-and-alignment-evaluation/red-teaming-and-adversarial-evaluation.md` requires the strongest isolation guarantees for adversarial testing

## Further Reading

- "Sandboxing for AI Safety Evaluations" -- UK AI Safety Institute, 2024
- "Docker in Practice" -- Miell and Sayers, 2019
- "Firecracker: Lightweight Virtualization for Serverless Applications" -- Agache et al. (AWS), 2020
- "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" -- Jimenez et al., 2024
- "Reproducibility in Machine Learning Research" -- Pineau et al., 2021
