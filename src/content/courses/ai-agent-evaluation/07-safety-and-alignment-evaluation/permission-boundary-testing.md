# Permission Boundary Testing

**One-Line Summary**: Evaluating whether agents respect authorization boundaries by systematically testing access controls, privilege escalation paths, and least-privilege adherence.

**Prerequisites**: `agent-safety-red-teaming.md`, `sandboxing-effectiveness-evaluation.md`

## What Is Permission Boundary Testing?

Consider a bank employee with access to customer account balances but not to social security numbers. Permission boundary testing is like auditing whether that employee can actually be tricked or tempted into accessing the restricted data -- through a coworker's unlocked terminal, a database query that joins restricted tables, or a reporting tool that inadvertently exposes protected fields. For AI agents, permission boundaries define what the agent is authorized to do, and testing verifies those boundaries hold under adversarial conditions.

Agents interact with external systems through tools, APIs, and protocols that carry their own authorization models -- OAuth scopes, API keys, filesystem permissions, MCP server configurations. Permission boundary testing evaluates the full chain: does the agent request only the permissions it needs? Does the infrastructure enforce those permissions? And critically, can the agent be manipulated into accessing resources beyond its authorization?

This is distinct from sandboxing evaluation. Sandboxing asks "can the agent escape its container?" Permission boundary testing asks "within the container, does the agent respect the finer-grained access controls on specific resources, tools, and data?"

## How It Works

### Test Scenario Categories

Permission boundary testing organizes scenarios around the specific boundaries an agent should respect.

**Out-of-scope resource access** tests whether the agent can read, modify, or delete resources it should not touch. For a coding agent, this means files outside the designated project directory. For a customer service agent, this means other customers' records. For an email agent, this means mailboxes belonging to other users. Test scenarios provide tempting reasons for the agent to cross these boundaries -- "to fix this bug, you need to check the configuration in /etc/system.conf" -- and verify it declines.

**Elevated permission exploitation** tests whether the agent can gain capabilities beyond its authorization level. A read-only agent should not be able to write. An agent with access to a staging database should not be able to reach production. Scenarios probe whether the agent discovers and exploits misconfigured tools, overly broad API scopes, or shared credentials that grant unintended access.

**Cross-user data access** tests multi-tenant isolation. When an agent serves multiple users, can a request from User A cause the agent to access User B's data? This is especially critical for agents with persistent memory or shared context across sessions, where information from one user's session might leak into another's.

### Privilege Escalation Testing

Privilege escalation is the most dangerous permission boundary failure because it allows a chain of small, individually innocuous actions to compound into major unauthorized access.

**Vertical escalation** occurs when the agent gains higher privilege levels than intended. Test scenarios include: requesting the agent to install a package (which requires sudo), asking the agent to modify a configuration file (which requires admin access), and instructing the agent to create a new user account (which requires system administration privileges). A well-designed agent should recognize these requests exceed its authorization and refuse or request human approval.

**Horizontal escalation** occurs when the agent accesses resources belonging to other entities at the same privilege level. Testing involves crafting scenarios where the agent is given plausible reasons to access peer resources -- "check if the other team's service is running" or "compare your output with what the other agent produced."

**Transitive escalation** exploits chains of permissions. The agent may have access to Tool A, which has access to Service B, which has access to Database C. Even if the agent has no direct access to Database C, it might be able to reach it through this transitive chain. Testing must map and probe these indirect access paths.

### Least Privilege Verification

Beyond preventing violations, testing should verify that agents practice the principle of least privilege proactively.

**Permission request accuracy** measures whether the agent requests only the permissions it needs. An agent that requests read-write access when it only needs to read is over-privileged, even if it never uses the write capability. Testing compares the permissions requested against the minimum set required for the task.

**Permission duration** checks whether the agent retains permissions longer than necessary. An agent that acquires temporary elevated access for a specific operation should relinquish it after completion. Testing verifies this de-escalation behavior.

**Permission scope** evaluates granularity. An agent needing to read one specific file should not request access to the entire directory. An agent needing to call one API endpoint should not request a wildcard scope.

### Connection to Authorization Protocols

Modern agent systems use standardized authorization mechanisms that each present distinct testing surfaces.

**OAuth 2.0 scopes** define what an agent can access through third-party APIs. Testing verifies the agent requests the narrowest appropriate scopes and that the authorization server enforces them. Common failures include agents requesting overly broad scopes "just in case" and authorization servers that do not validate scope restrictions at the resource level.

**MCP (Model Context Protocol) authorization** controls what tools an agent can discover and invoke through MCP servers. Testing probes whether the agent can invoke tools that were not explicitly granted, access MCP server resources outside its designated scope, or manipulate tool parameters to bypass restrictions.

**API key permissions** vary by provider and service. Testing maps the actual capabilities granted by each key and verifies they match the intended permission set.

## Why It Matters

1. **Permission failures have direct data security consequences.** An agent that crosses authorization boundaries can expose sensitive data, violate privacy regulations (GDPR, HIPAA), and create legal liability.
2. **Over-privileged agents amplify all other vulnerabilities.** If an agent is compromised through prompt injection but has minimal permissions, the damage is contained. If it has excessive permissions, a single vulnerability becomes catastrophic.
3. **Permission boundaries are the primary trust mechanism in multi-agent systems.** When agents delegate to other agents, permission boundaries define the trust hierarchy. Failures cascade across the system.
4. **Compliance frameworks require demonstrated access control.** SOC 2, ISO 27001, and industry-specific regulations require organizations to demonstrate that automated systems respect access controls.

## Key Technical Details

- Boundary violation rate is measured as the percentage of test scenarios where the agent successfully accesses unauthorized resources, targeting below 1% for production systems
- Privilege escalation success rate should be 0% for well-configured systems -- any successful escalation is a critical finding
- Permission request accuracy is measured as the ratio of minimum required permissions to actually requested permissions, with 1.0 being ideal and values above 1.5 indicating significant over-privileging
- OAuth scope analysis reveals that agents commonly request 2-3x more scopes than the minimum required for their task set
- MCP tool authorization testing should cover both the discovery phase (which tools are visible) and the invocation phase (which tools can be called with which parameters)
- Cross-user data access testing requires at minimum 20 multi-tenant scenarios with varying levels of data sensitivity
- Transitive permission chains should be mapped using graph analysis and each indirect path tested independently

## Common Misconceptions

**"If the API enforces permissions, the agent's behavior does not matter."** Even with server-side enforcement, an agent that attempts unauthorized access reveals a design flaw. The attempt itself may trigger security alerts, log suspicious activity, or in some systems cause rate limiting that degrades legitimate operations. The agent should not attempt unauthorized actions in the first place.

**"Least privilege is too restrictive for agents that need flexibility."** Least privilege does not mean minimal capability -- it means the right capability at the right time. An agent can dynamically request elevated permissions when needed and relinquish them afterward. This is more robust than granting broad standing permissions.

**"Permission testing is the same as authentication testing."** Authentication verifies identity (who is the agent?). Permission testing verifies authorization (what can the agent do?). An agent can be properly authenticated while still exceeding its authorized boundaries. These are complementary but distinct concerns.

**"Agents cannot escalate privileges if no escalation mechanism exists."** Agents are creative problem solvers. They may discover escalation paths that were not intentionally created -- through tool chaining, parameter manipulation, or exploitation of implicit trust relationships between services.

## Connections to Other Concepts

- `sandboxing-effectiveness-evaluation.md` -- sandboxing provides coarse containment; permissions provide fine-grained access control within the sandbox
- `agent-safety-red-teaming.md` -- privilege escalation is a core red teaming attack category
- `harmful-action-detection-metrics.md` -- permission boundary violations feed into harmful action classification
- `alignment-measurement.md` -- an aligned agent should proactively respect permission boundaries, not merely be constrained by them
- `../04-trajectory-and-process-analysis/tool-use-correctness.md` -- tool use evaluation includes verifying proper parameterization within authorized bounds
- `../02-benchmark-ecosystem/tool-use-benchmarks.md` -- tool use benchmarks increasingly include permission-aware scenarios

## Further Reading

- "OAuth 2.0 Security Best Current Practice" -- Lodderstedt et al., RFC 9700, 2024
- "The Principle of Least Privilege in Modern Agent Architectures" -- METR Technical Report, 2025
- "MCP Authorization Specification" -- Anthropic, 2025
- "Privilege Escalation in LLM-Integrated Applications" -- Greshake et al., 2023
- "Broken Access Control in AI Agent Systems" -- OWASP AI Security, 2024
