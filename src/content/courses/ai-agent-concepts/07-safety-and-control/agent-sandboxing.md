# Agent Sandboxing

**One-Line Summary**: Agent sandboxing constrains the execution environment of AI agents using container isolation, network restrictions, and filesystem limits to ensure that even if an agent behaves unexpectedly, the damage it can cause is bounded.

**Prerequisites**: Container technology (Docker), operating system security, principle of least privilege, agent tool use

## What Is Agent Sandboxing?

Imagine giving a toddler access to a full kitchen -- knives, gas stove, cleaning chemicals, and all. No responsible parent would do this. Instead, you might set up a play kitchen where they can practice cooking with safe materials. If they make a mess, the damage is contained. Agent sandboxing applies this same principle to AI agents: give them an environment where they can operate effectively, but where the worst-case outcome of any action is bounded and recoverable.

An AI agent with code execution capabilities, file system access, or network access is powerful but dangerous. A coding agent might accidentally execute `rm -rf /` instead of cleaning up a temporary directory. A web-browsing agent might make unauthorized API calls or access malicious websites. An agent with database access might drop a table instead of querying it. These are not hypothetical risks -- they are the natural consequences of probabilistic systems that occasionally make errors.

Sandboxing wraps the agent's execution environment in layers of isolation. The agent operates inside a container (like Docker or Firecracker) with restricted filesystem access, limited network connectivity, constrained resource usage, and no access to the host system. The sandbox defines the maximum blast radius of any agent error: even a completely compromised agent cannot escape its sandbox to affect the broader system.

*Recommended visual: Nested box diagram showing the host system containing a container/microVM, which contains the agent runtime, which contains the execution environment with restricted filesystem, network, and resource access — see [Firecracker Documentation](https://github.com/firecracker-microvm/firecracker)*

## How It Works

### Container Isolation

The primary sandboxing mechanism is containerization. Docker containers provide process isolation, filesystem isolation, and network namespace separation from the host. Firecracker microVMs go further, providing hardware-level isolation with a minimal virtual machine that boots in under 125ms. The agent's tools execute inside the container, and all file operations, code execution, and system calls are confined to the container's namespace. If the agent corrupts its environment, the container is destroyed and a fresh one is spun up.

### Filesystem Restrictions

Within the sandbox, the filesystem is tightly controlled. The agent typically gets a writable workspace directory (for creating and modifying files), read-only access to relevant code repositories or documents, and no access to system files, other users' data, or sensitive configurations. Bind mounts expose specific host directories (read-only) into the container. Temporary filesystems (tmpfs) ensure that agent-created files do not persist beyond the session unless explicitly exported.

*Recommended visual: Comparison diagram showing Docker container isolation (shared kernel) vs Firecracker microVM isolation (separate lightweight VM) with their respective security boundaries — see [Sultan et al., 2019 — Container Security](https://arxiv.org/abs/1904.12535)*

### Network Controls

Network restrictions prevent agents from making unauthorized external connections. A strict sandbox blocks all outbound network access, allowing only approved API endpoints through an allowlist. A moderate sandbox allows outbound HTTPS but blocks internal network access (preventing the agent from reaching other services, databases, or infrastructure). DNS filtering can block access to known malicious domains. Network policies are enforced at the container runtime level, making them impossible for the agent to circumvent through code execution.

### Resource Limits

Containers enforce resource limits: maximum CPU time, memory allocation, disk usage, and process count. These prevent runaway agent processes (infinite loops, memory leaks, fork bombs) from affecting the host system. Limits are set based on expected workload: a coding agent might need 2GB RAM and 4 CPU cores; a document processing agent might need 8GB RAM but minimal CPU. Exceeding limits triggers container termination with an appropriate error message.

## Why It Matters

### Defense in Depth

No safety mechanism is perfect on its own. Prompt engineering can be circumvented, guardrails can be bypassed, and permission systems can have bugs. Sandboxing provides a hard, infrastructure-level safety boundary that does not depend on the agent's cooperation. Even if every other safety layer fails -- prompt injection succeeds, guardrails are evaded, permissions are misconfigured -- the sandbox limits what can actually happen.

### Enabling Powerful Capabilities Safely

Without sandboxing, organizations face a choice between giving agents minimal capabilities (safe but limited) or full capabilities (powerful but dangerous). Sandboxing unlocks a third option: give agents powerful capabilities (code execution, file system access, network access) within a controlled environment. This dramatically increases what agents can accomplish while maintaining safety guarantees.

### Incident Recovery

When an agent does go wrong inside a sandbox, recovery is straightforward: destroy the container and start fresh. There is no need to assess what the agent might have touched outside its boundaries, no need to trace side effects across systems, and no risk of persistent damage. The ephemeral nature of sandboxes makes incidents contained and recoverable by design.

## Key Technical Details

- **Docker security profiles**: AppArmor or Seccomp profiles restrict which system calls the container can make. A well-configured profile blocks dangerous syscalls (mount, reboot, module loading) while allowing normal operation. Docker's default seccomp profile blocks about 44 of the 300+ Linux syscalls.
- **Firecracker vs Docker**: Docker provides OS-level isolation (shared kernel). Firecracker provides hardware-level isolation (separate lightweight VM). Firecracker is more secure but adds ~125ms boot time and slightly more memory overhead. For multi-tenant environments where agents from different users share infrastructure, Firecracker's stronger isolation is preferred.
- **Ephemeral environments**: Sandboxes are created fresh for each agent session and destroyed afterward. No state persists between sessions unless explicitly exported through a controlled output channel. This prevents agents from establishing persistent footholds.
- **Output sanitization**: When the agent produces results that leave the sandbox (files, API responses, messages), the output channel sanitizes them to prevent sandbox escape through output manipulation. This includes scanning for executable content, scripts, or encoded payloads.
- **Monitoring within the sandbox**: System call tracing (strace/dtrace) and file system monitoring (inotify) inside the sandbox log every action the agent takes. These logs are stored outside the sandbox for post-hoc analysis and anomaly detection.
- **Warm sandbox pools**: Spinning up a fresh container for every request adds latency. Production systems maintain pools of pre-warmed, clean sandbox instances that can be assigned to agents instantly and recycled after use.
- **Nested sandboxing**: For agents that execute user-provided code (coding assistants), the agent itself runs in a sandbox, and user code executes in a further-restricted sandbox within. This prevents user code from accessing the agent's tools and context.

## Common Misconceptions

- **"Sandboxing slows agents down."** With warm container pools and modern container runtimes, sandbox overhead is typically under 100ms for container assignment and negligible for runtime performance. The agent's execution speed inside a sandbox is essentially identical to bare-metal execution for most workloads.

- **"Docker is secure enough for any use case."** Docker containers share the host kernel, meaning kernel exploits can escape the container. For high-security applications or multi-tenant environments, microVMs (Firecracker, gVisor) provide stronger isolation. The right isolation technology depends on the threat model.

- **"If the agent has no code execution, sandboxing is unnecessary."** Agents with tool access can still cause damage through tool misuse -- sending wrong API calls, modifying databases, or accessing unauthorized files. Sandboxing constrains not just code execution but all system interactions.

- **"Sandboxing eliminates all security risks."** Sandboxing limits the blast radius but does not prevent the agent from causing damage within the sandbox boundaries. An agent with database write access inside its sandbox can still corrupt that database. Sandboxing must be combined with other safety layers (permissions, guardrails, HITL).

## Connections to Other Concepts

- `authorization-and-permissions.md` -- Permissions define what the agent is allowed to do; sandboxing enforces the physical boundaries of what it can do. They are complementary: permissions are policy, sandboxing is enforcement.
- `resource-limits.md` -- Resource limits are a specific aspect of sandboxing, preventing runaway resource consumption. They are typically implemented through container resource constraints.
- `monitoring-and-observability.md` -- Sandbox monitoring (syscall logs, file access logs, network logs) feeds into the broader observability system, providing detailed visibility into agent behavior.
- `rollback-and-undo.md` -- Ephemeral sandboxes inherently support rollback -- destroying and recreating the container restores a clean state.
- `prompt-injection-defense.md` -- Sandboxing is a critical defense layer against prompt injection: even if an attacker successfully injects instructions, the agent's actions are bounded by the sandbox.

## Further Reading

- **Aggarwal et al., 2024** -- "On the Design of AI-powered Code Assistants." Discusses sandboxing architectures for coding agents, including the security-usability tradeoffs of different isolation levels.
- **Firecracker Team, 2020** -- "Firecracker: Lightweight Virtualization for Serverless Applications." The foundational paper on Firecracker microVMs, explaining the security model used by AWS Lambda and applicable to agent sandboxing.
- **Young et al., 2019** -- "The True Cost of Containing: A gVisor Case Study." Evaluates the performance and security tradeoffs of gVisor, an application kernel providing sandbox isolation between Docker and full VMs.
- **Sultan et al., 2019** -- "Container Security: Issues, Challenges, and the Road Ahead." Comprehensive survey of container security mechanisms, vulnerabilities, and best practices relevant to agent sandboxing.
