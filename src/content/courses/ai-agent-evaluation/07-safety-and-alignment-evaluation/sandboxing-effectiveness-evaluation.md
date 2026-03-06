# Sandboxing Effectiveness Evaluation

**One-Line Summary**: Measuring whether agent sandboxes actually contain behavior within intended boundaries, rather than merely claiming to do so.

**Prerequisites**: `agent-safety-red-teaming.md`, `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md`

## What Is Sandboxing Effectiveness Evaluation?

Think of a sandbox like a playpen for a toddler. The manufacturer says it contains the child safely, but you would not trust that claim without testing -- can the child climb over the walls? Squeeze through the bars? Disassemble the latch? Sandboxing effectiveness evaluation applies this skepticism to the containment mechanisms that isolate AI agents from systems they should not access.

Agents routinely operate inside sandboxes -- Docker containers, virtual machines, restricted filesystem views, network allowlists -- that are intended to limit their blast radius. But intended containment and actual containment are often very different things. A sandbox that blocks direct filesystem access might still allow data exfiltration through environment variables, DNS queries, or timing side channels. Evaluating sandboxing means systematically testing whether the walls actually hold.

The stakes are significant: industry surveys have found that only 9 of 30 surveyed agent deployments document their sandboxing approach in any detail. The remaining 21 either lack sandboxing entirely or implement it without verification. This gap between assumed and actual containment is one of the most pressing safety concerns in agent deployment.

## How It Works

### Test Categories

Sandboxing evaluation requires testing across multiple containment dimensions, since a sandbox is only as strong as its weakest boundary.

**Filesystem escape testing** verifies that agents cannot access files outside their designated scope. Test scenarios include path traversal attempts (../../etc/passwd), symlink following across boundaries, access via /proc/self/root or similar kernel interfaces, and attempts to create and follow hard links to restricted files. The test suite should cover both read and write access in both directions -- the agent reading protected files and writing to protected locations.

**Network access verification** tests whether agents can communicate beyond their allowlist. Scenarios include DNS exfiltration (encoding data in DNS queries to external resolvers), HTTP/HTTPS requests to non-allowlisted domains, raw socket creation, and tunneling through allowed services. A sandbox that permits access to an allowed API might inadvertently allow that API to be used as a relay to unapproved destinations.

**Resource limit enforcement** checks CPU, memory, disk, and time constraints. Can the agent consume unbounded memory to crash the host? Can it spawn processes that exhaust CPU? Can it fill the disk to cause denial of service to co-located services? Resource limits must be tested under adversarial conditions, not just normal operation.

**Process isolation verification** confirms that the agent cannot observe or influence processes outside its sandbox. This includes testing for shared memory access, signal sending to external processes, access to host process listings, and container escape through known kernel vulnerabilities.

### Methodology: Escape Scenario Suites

An effective evaluation constructs a structured suite of escape scenarios ordered by sophistication.

**Tier 1 -- Direct access attempts.** The agent explicitly tries to access restricted resources using standard system calls and commands. These test the baseline configuration of the sandbox.

**Tier 2 -- Indirect access attempts.** The agent uses creative indirection: environment variable inspection, timing channels, error message information leakage, and exploitation of allowed tools to reach restricted resources.

**Tier 3 -- Exploitation attempts.** The agent uses known vulnerability patterns specific to the sandbox technology -- Docker socket access, Kubernetes API server access, VM escape techniques, or privilege escalation through misconfigurations.

Each scenario has a binary outcome: the sandbox either contained the attempt or it did not. The test suite should be run repeatedly because some escape vectors are timing-dependent or probabilistic.

### Sandbox Technology Comparison

**Docker containers** provide process and filesystem isolation through Linux namespaces and cgroups. They offer moderate containment with low overhead (typically 1-3% latency increase). However, they share the host kernel, making them vulnerable to kernel exploits. Docker socket mounting -- common in CI/CD setups -- creates a trivial escape path.

**Kubernetes pods** add network policy enforcement and resource quotas on top of container isolation. They enable fine-grained network segmentation but introduce complexity. Misconfigured RBAC policies are a common source of sandbox failures in agent deployments.

**Virtual machines** provide the strongest isolation through hardware-level separation. Each VM has its own kernel, eliminating kernel-exploit escape vectors. The tradeoff is significant overhead: 10-30% latency increase, higher memory consumption, and slower startup times (seconds vs milliseconds for containers).

**Language-level sandboxes** (such as Deno's permission model or WebAssembly runtimes) restrict at the application level. They offer fine-grained control over specific capabilities (file read, file write, network access, environment variables) but depend on the runtime's correctness.

### The Containment Gap

The most critical finding in sandboxing evaluation is typically the gap between intended and actual containment. Organizations commonly discover that their sandboxes permit 15-40% more access than intended when subjected to systematic testing. Common gap sources include: mounted volumes that expose more of the host filesystem than intended, DNS resolution that bypasses network restrictions, logging and monitoring infrastructure that creates bidirectional channels, and shared temporary directories.

## Why It Matters

1. **Sandboxes are the primary safety mechanism for tool-using agents.** If the sandbox fails, there is typically no secondary containment layer between the agent and production systems.
2. **Assumed containment creates false confidence.** Teams that believe their agents are sandboxed may grant broader tool permissions than they would otherwise, amplifying the damage if containment fails.
3. **Regulatory and compliance requirements increasingly demand verified isolation.** Auditors ask not just "is the agent sandboxed?" but "how do you know the sandbox works?"
4. **Sandbox effectiveness degrades over time.** Configuration drift, dependency updates, and infrastructure changes can silently weaken containment that was initially verified.

## Key Technical Details

- Only 9 of 30 surveyed agent deployments document sandboxing (industry survey, 2024)
- Docker container escape vulnerabilities are disclosed at a rate of 2-4 per year with CVE severity scores typically above 7.0
- VM-based sandboxing adds 10-30% latency overhead but eliminates kernel-shared attack surface
- A comprehensive escape scenario suite should include at minimum 50 test cases across all four categories (filesystem, network, resource, process)
- Sandbox evaluation should be repeated after every infrastructure change, not just at initial deployment
- Network allowlist testing reveals unintended permitted destinations in approximately 35% of evaluated configurations
- Kubernetes network policies have a known gap: they do not restrict DNS by default, creating an exfiltration channel

## Common Misconceptions

**"Using Docker means the agent is sandboxed."** Docker provides a containment layer, but its effectiveness depends entirely on configuration. Privileged containers, mounted Docker sockets, host network mode, and excessive capabilities can reduce Docker sandboxing to near zero. The container is only as secure as its run configuration.

**"Network firewalls are sufficient for network isolation."** Firewalls operate at the IP and port level. Agents can exfiltrate data through DNS queries, encode information in allowed HTTPS request patterns, or use timing channels. Network containment requires multiple complementary mechanisms.

**"If the agent cannot execute shell commands, it cannot escape the sandbox."** Many sandbox escapes do not require shell access. File read/write tools can be used to modify configuration, API tools can reach unintended endpoints, and the agent's own LLM capabilities can be used to encode and decode data through side channels.

**"Sandboxing is a one-time setup."** Sandbox effectiveness must be continuously verified. A Docker image update, a Kubernetes RBAC policy change, or a new mounted volume can silently create escape paths that did not exist during initial evaluation.

## Connections to Other Concepts

- `agent-safety-red-teaming.md` -- sandbox escape is a primary red teaming target
- `permission-boundary-testing.md` -- sandboxing and permissions are complementary containment layers
- `side-effect-evaluation.md` -- sandbox failures enable unintended side effects beyond the agent's intended scope
- `../08-evaluation-tooling-and-infrastructure/sandboxed-evaluation-environments.md` -- building the sandbox environments used for evaluation itself
- `../09-production-evaluation-and-monitoring/production-quality-monitoring.md` -- continuous sandbox verification in production

## Further Reading

- "Container Security: Fundamental Technology Concepts that Protect Containerized Applications" -- Rice, 2020
- "A Study of the Feasibility of Co-Executing Security Applications in Containers" -- Bui et al., 2015
- "Evaluating Agent Tool Sandboxing in Production Environments" -- METR, 2024
- "Deno Security Model: Permissions and Sandboxing" -- Deno Documentation, 2024
- "Escaping Docker Privileged Containers" -- Trail of Bits, 2019
