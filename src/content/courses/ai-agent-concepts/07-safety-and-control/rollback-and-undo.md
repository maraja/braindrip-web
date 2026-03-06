# Rollback and Undo

**One-Line Summary**: Rollback and undo mechanisms enable the reversal of agent actions through version control, database transactions, compensating actions, and checkpoint strategies, ensuring that agent mistakes are recoverable rather than permanent.

**Prerequisites**: Version control systems, database transactions, idempotency, agent tool use, state management

## What Is Rollback and Undo?

Imagine writing a document without an undo button. Every typo, every deleted paragraph, every formatting mistake is permanent. You would write incredibly carefully, incredibly slowly, and still make irreversible errors. The undo button transforms writing from a high-stakes, anxiety-inducing activity into a fluid, experimental process. Rollback and undo provide this same transformation for AI agents -- turning irreversible agent mistakes into recoverable events.

When an AI agent takes actions in the real world -- modifying files, updating databases, sending messages, creating resources -- those actions have consequences. Some consequences are easily reversible (deleting a file that exists in version control). Some are difficult but possible to reverse (retracting a sent email). Some are genuinely irreversible (posting on social media, executing a financial transaction, deleting data with no backup). The design of rollback and undo systems determines which category agent actions fall into.

Designing for reversibility means building agent systems where every action either has a natural undo operation, creates a checkpoint that can be restored, or is explicitly flagged as irreversible (requiring additional safety checks). This shifts the safety model from "prevent all mistakes" (impossible) to "ensure mistakes are recoverable" (achievable), while reserving the strongest preventive measures for the truly irreversible actions.

*Recommended visual: Diagram showing three rollback strategies — version control revert for file operations, database transaction rollback for data operations, and compensating actions for API/external operations — with arrows showing forward action and reverse action paths — see [Garcia-Molina & Salem, 1987 — Sagas](https://dl.acm.org/doi/10.1145/38713.38742)*

## How It Works

### Version Control Integration

For file-based operations, version control provides natural rollback. Before an agent modifies files, it creates a commit (or saves a snapshot). If the modifications are wrong, a simple `git revert` or restore restores the previous state. Coding agents particularly benefit from this pattern: every code change is a committed revision that can be undone. The key design principle is atomic commits -- each logical agent action is a single commit, making it possible to undo individual actions without affecting other changes.

### Database Transactions and Savepoints

For database operations, transactions provide atomicity: a group of changes either all succeed or all fail. Agents that modify databases should wrap their operations in transactions with explicit savepoints. If the agent realizes (or a guardrail detects) that the operation is wrong, the transaction is rolled back to the savepoint. For multi-step database modifications, nested savepoints allow partial rollback -- undoing the last step while preserving earlier steps.

### Compensating Actions

Some operations cannot be directly undone but can be compensated. If an agent creates a cloud resource (a VM, a database, a queue), the compensating action is to delete it. If an agent posts a message, the compensating action might be to post a correction or delete the message. The agent (or its orchestrator) maintains a compensating action log -- for every forward action, it records the corresponding reverse action. If rollback is needed, the compensating actions are executed in reverse order, similar to the saga pattern in distributed systems.

*Recommended visual: Saga pattern timeline showing a sequence of agent actions (T1, T2, T3) with corresponding compensating actions (C1, C2, C3), and a failure at T3 triggering compensations in reverse order (C2, C1) — see [Kleppmann, 2017 — Designing Data-Intensive Applications](https://dataintensive.net/)*

### Checkpoint Strategies

Before executing a sequence of actions, the agent takes a system-level checkpoint capturing the current state. This might be a database snapshot, a filesystem snapshot, a VM snapshot, or a combination. If the entire action sequence fails, the system restores from the checkpoint. Checkpoints are especially useful when the agent performs multiple coordinated actions across different systems, where individual rollbacks might leave the systems in an inconsistent intermediate state. The tradeoff is that checkpoints are resource-intensive (storage, time to create).

## Why It Matters

### Enabling Agent Experimentation

When actions are reversible, agents can take a more exploratory approach to problem-solving. A coding agent can try a refactoring, run tests, and revert if tests fail -- all without risk. A data analysis agent can modify a query, check results, and undo if they do not make sense. Reversibility enables the trial-and-error approach that leads to better outcomes.

### Reducing the Cost of Errors

Without rollback, every agent error requires manual intervention, investigation, and repair -- often by a human engineer who must understand what the agent did and how to fix it. With rollback, recovery is a single operation: revert to the last known good state. This reduces the human cost of agent errors from hours of investigation to seconds of rollback.

### Shifting the Safety Architecture

A system that relies entirely on preventing errors is brittle. A system that combines prevention with recovery is resilient. Rollback allows safety systems to be less conservative: instead of blocking any action that might be wrong, they can allow actions that are reversible and focus stringent prevention on truly irreversible actions. This balance between prevention and recovery enables more useful agents with acceptable risk.

## Key Technical Details

- **Atomic action boundaries**: Each agent action should be an atomic unit that can be independently rolled back. If an action involves multiple sub-steps (create file, write content, set permissions), they should be wrapped together so rollback reverts all sub-steps or none.
- **Rollback time window**: Rollback becomes harder over time as dependent actions accumulate. A file change that happened 5 minutes ago is easy to revert; one from 3 weeks ago may have downstream dependencies. Systems should define a rollback window (typically 1-24 hours) within which rollback is guaranteed to be safe.
- **Irreversibility classification**: Each tool should be tagged with its reversibility: fully reversible (file write with version control), partially reversible (email with recall capability), or irreversible (financial transaction, social media post). This classification drives the safety policy: irreversible actions get the strictest HITL and guardrail requirements.
- **Compensating action registry**: For each forward action type, the system maintains a registered compensating action. This registry is checked at deployment time to ensure all agent actions have defined rollback paths. Actions without compensating actions are flagged as irreversible.
- **State consistency verification**: After rollback, the system verifies that the state is actually consistent. A rollback might succeed technically but leave related systems out of sync. Post-rollback verification checks cross-system consistency.
- **Rollback testing**: Rollback mechanisms must be tested regularly. A rollback path that has never been executed may not work when needed. Include rollback scenarios in integration tests.

## Common Misconceptions

- **"Just don't let the agent make mistakes."** Error prevention is important but insufficient. No system achieves zero errors, especially non-deterministic AI systems. Designing for recovery is not admitting defeat; it is engineering for reality.

- **"Git solves all rollback needs."** Version control handles file changes but not database modifications, API calls, resource creation, or communication actions. A complete rollback strategy must cover all action types the agent can perform.

- **"Rollback is always possible."** Some actions are genuinely irreversible. Data that has been viewed by unauthorized parties cannot be "unviewed." Financial transactions may have settlement windows. External communications cannot be unsent. The system must clearly identify which actions lack rollback paths.

- **"Compensating actions always restore the exact original state."** Compensating actions approximate reversal but may not achieve exact restoration. Deleting a recreated resource may leave audit logs, cost traces, or notification artifacts. Compensating actions restore functional equivalence, not bit-level identity.

- **"Automatic rollback is always better than manual."** Automatic rollback on error detection is fast but can mask problems. Sometimes the correct response is to pause, alert a human, and let them decide whether to roll back, continue, or take a different corrective action. The choice depends on the action's consequences and the confidence of the error detection.

## Connections to Other Concepts

- `human-in-the-loop.md` -- HITL approval requirements should be calibrated based on reversibility. Irreversible actions require stricter approval; reversible actions can have higher autonomy.
- `agent-sandboxing.md` -- Ephemeral sandboxes inherently support rollback by destroying and recreating the environment. This is the simplest form of rollback for contained execution.
- `monitoring-and-observability.md` -- Rollback decisions depend on monitoring data: detecting that an action produced wrong results triggers the rollback. Traces provide the information needed to determine which actions need reversal.
- `agent-guardrails.md` -- Action guards can classify actions by reversibility and apply different safety policies accordingly.
- `regression-testing.md` -- Rollback mechanisms should be included in regression test suites to ensure they remain functional as the system evolves.

## Further Reading

- **Garcia-Molina & Salem, 1987** -- "Sagas." The foundational paper on the saga pattern for long-lived transactions with compensating actions, directly applicable to multi-step agent rollback.
- **Helland, 2012** -- "Idempotence is Not a Medical Condition." Explains idempotency and its role in building reliable, recoverable distributed systems, applicable to agent action design.
- **Kleppmann, 2017** -- "Designing Data-Intensive Applications." Covers transaction isolation, rollback, and consistency patterns in modern distributed systems relevant to agent infrastructure.
- **Burns et al., 2016** -- "Borg, Omega, and Kubernetes: Lessons Learned from Three Container-Management Systems over a Decade." Discusses infrastructure-level rollback and recovery patterns applicable to agent deployment.
