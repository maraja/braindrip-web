# Authorization and Permissions

**One-Line Summary**: Authorization and permissions control what resources and actions an AI agent can access, applying the principle of least privilege through scope-based permissions, credential management, and dynamic access control to minimize the damage from agent errors or compromise.

**Prerequisites**: Principle of least privilege, OAuth and API authentication, role-based access control (RBAC), agent tool use

## What Is Authorization and Permissions?

Imagine hiring a contractor to renovate your kitchen. You give them a key to your house, but only during working hours. They can access the kitchen, the garage (for tools), and the bathroom. They cannot enter your bedroom, your home office, or your safe. You do not hand them the master key to every room -- you give them exactly the access they need to do their job, and no more. Authorization and permissions for agents follow this same principle.

When an AI agent connects to external systems -- databases, APIs, file systems, communication tools -- it needs credentials and permissions. The critical question is: how much access should the agent have? The temptation is to give the agent admin-level access to everything, because that avoids permission errors and makes development easier. But this creates catastrophic risk: an agent with admin access that makes a mistake (or is compromised through prompt injection) can cause maximum damage.

Authorization and permissions define the boundaries of what an agent can do in connected systems. This includes which resources the agent can access (read user profiles but not billing data), what operations it can perform (read but not write, create but not delete), which credentials it uses and how those credentials are managed (never exposed in the prompt, rotated regularly), and how access is scoped to the minimum needed for the current task.

*Recommended visual: Diagram showing an agent with scoped OAuth tokens — separate read/write/delete permission scopes for different resources (files, database, API), with credentials injected at the tool layer below the LLM — see [RFC 6749 — OAuth 2.0 Framework](https://datatracker.ietf.org/doc/html/rfc6749)*

## How It Works

### Scope-Based Permissions

Rather than binary access (full access or none), permissions are scoped to specific resources and operations. OAuth 2.0 scopes provide a natural model: `read:files`, `write:files`, `delete:files` are separate permissions that can be granted independently. An agent that summarizes documents needs `read:files` but not `write:files` or `delete:files`. A coding agent needs `read:repo` and `write:repo` but not `admin:repo`. Scopes should be as granular as the target system supports.

### Credential Management

Agents need credentials (API keys, tokens, database passwords) to access external systems. These credentials must never be exposed to the agent's reasoning process -- they should be injected at the tool execution layer, invisible to the LLM. This prevents prompt injection attacks from extracting credentials and prevents the agent from accidentally logging or displaying them. Credentials should be stored in a secrets manager (HashiCorp Vault, AWS Secrets Manager), rotated regularly, and scoped to the minimum permissions needed.

### Dynamic Access Control

Some permissions should vary based on context. An agent handling a routine query might have read-only database access, but the same agent handling an approved data correction might temporarily receive write access. Dynamic access control adjusts permissions based on the current task, the user's authorization level, the trust level of the input, and whether human approval has been granted. Permissions are elevated only when needed and revoked immediately after the specific operation.

*Recommended visual: Architecture diagram showing credential isolation — LLM sees only tool names and parameters, while a credential broker injects secrets from a vault at the tool execution layer — see [He et al., 2024 — LLM Agent Security Survey](https://arxiv.org/abs/2403.04247)*

### Per-Task Permission Scoping

Each agent task should run with the minimum permissions required for that specific task, not the union of all permissions the agent might ever need. If the current task requires only reading from the CRM and writing an email, the agent's database write permissions and file system access should be revoked for this task. Per-task scoping is implemented by creating short-lived credential tokens with task-specific scopes.

## Why It Matters

### Blast Radius Containment

When an agent makes an error -- and all agents eventually will -- the damage is limited to what its permissions allow. An agent with read-only database access cannot corrupt data, no matter how badly it malfunctions. An agent without delete permissions cannot destroy resources. Proper permission scoping transforms catastrophic failures into minor incidents.

### Prompt Injection Mitigation

Prompt injection attacks attempt to make the agent perform unauthorized actions. If an attacker injects "delete all customer records" but the agent only has read permissions, the attack fails at the infrastructure level regardless of whether the agent's reasoning was compromised. Permissions provide a defense layer that is independent of the agent's ability to resist adversarial inputs.

### Regulatory Compliance

Data protection regulations (GDPR, HIPAA, SOC 2) require access controls and audit trails for systems that handle sensitive data. AI agents accessing customer data, health records, or financial information must operate under the same access control frameworks as human users. This includes documented permissions, access logging, and regular access reviews.

## Key Technical Details

- **OAuth 2.0 for agents**: OAuth scopes are the most natural permission model for API-connected agents. The agent authenticates with scoped tokens that grant specific capabilities. Token expiration ensures permissions are time-limited.
- **Credential isolation**: The LLM prompt layer should never see raw credentials. Tool implementations inject credentials at runtime from a secure store. The LLM sees only the tool name and parameters, not the authentication details.
- **Permission manifests**: Each agent (or agent template) has a permission manifest declaring what resources and operations it requires. This manifest is reviewed during deployment, similar to mobile app permission declarations.
- **Break-glass procedures**: For emergency situations where an agent needs elevated permissions not in its normal scope, break-glass procedures provide a documented, audited path to temporary elevated access. These should require human authorization and be time-limited.
- **Service accounts**: Agents should use dedicated service accounts (not personal user accounts) with permissions scoped to agent operations. This separates agent access from human access in audit logs and enables independent permission management.
- **Permission monitoring**: Track which permissions the agent actually uses versus what it has been granted. Permissions that are granted but never used should be reviewed and potentially revoked (permission right-sizing).
- **Multi-tenant isolation**: In systems serving multiple users, each user's agent session must be scoped to only that user's data. Cross-user data access is a critical security boundary that must be enforced at the infrastructure level, not by the agent's reasoning.

## Common Misconceptions

- **"Admin access makes development easier, so it's fine for production."** Development convenience is not a production requirement. The 10 minutes saved by not configuring proper permissions costs days of incident response when the agent misuses its access. Always scope production permissions to least privilege.

- **"The agent will follow its instructions not to use certain permissions."** Instruction-level restrictions are unreliable. The agent might misunderstand, hallucinate, or be manipulated through prompt injection. Permissions must be enforced at the infrastructure level, not the instruction level. If the agent should not delete files, revoke the delete permission -- do not just tell it not to delete.

- **"API keys in environment variables are secure enough."** Environment variables inside the agent's sandbox may be accessible through code execution or debugging tools. Credentials should be injected at the tool layer by a credential broker that the agent cannot directly access.

- **"Once permissions are set up, they don't need maintenance."** Permissions should be reviewed regularly (quarterly minimum) as agent capabilities, connected systems, and organizational policies change. Stale permissions accumulate over time, gradually expanding the agent's access beyond what is needed.

## Connections to Other Concepts

- `agent-sandboxing.md` -- Sandboxing enforces physical execution boundaries; permissions enforce logical access boundaries. Together they create comprehensive access control.
- `human-in-the-loop.md` -- HITL approval can serve as a dynamic permission elevation mechanism: the agent requests elevated access for a specific action, the human approves, and the permission is granted temporarily.
- `trust-boundaries.md` -- Permission levels should align with trust boundaries. Low-trust inputs should not be able to trigger high-permission actions without additional verification.
- `prompt-injection-defense.md` -- Permissions provide infrastructure-level defense against prompt injection: even successful injection is limited to the agent's current permission scope.
- `monitoring-and-observability.md` -- Permission usage should be logged and monitored. Unusual permission usage patterns (e.g., sudden increase in write operations) may indicate agent compromise or malfunction.

## Further Reading

- **Hardt, 2012** -- "OAuth 2.0 Authorization Framework (RFC 6749)." The foundational standard for token-based authorization that provides the technical framework for agent permission scoping.
- **Saltzer & Schroeder, 1975** -- "The Protection of Information in Computer Systems." Introduces the principle of least privilege and other security design principles directly applicable to agent authorization.
- **He et al., 2024** -- "Emerged Security and Privacy of LLM Agent: A Survey of Threats, Countermeasures, and Future." Surveys security threats to LLM agents including permission-related vulnerabilities and mitigation strategies.
- **Ruan et al., 2024** -- "Identifying the Risks of LM Agents with an LM-Emulated Sandbox." Analyzes risks from LLM agents with excessive permissions and proposes emulated sandbox testing.
