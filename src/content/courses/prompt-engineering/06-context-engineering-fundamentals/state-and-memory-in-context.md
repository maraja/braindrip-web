# State and Memory in Context

**One-Line Summary**: State and memory patterns — including scratchpads, pinned facts, running tallies, and working memory blocks — enable LLMs to maintain, update, and reference persistent information within and across conversation turns.
**Prerequisites**: `what-is-context-engineering.md`, `conversation-history-management.md`.

## What Is State and Memory in Context?

Think of the difference between sticky notes on your desk and a notebook. Sticky notes are quick-access, always-visible reminders — "client budget: $50K," "deadline: March 15," "prefers email over phone." The notebook holds your detailed working notes — calculations in progress, evolving drafts, and step-by-step reasoning. Both are forms of memory, but they serve different purposes: sticky notes are persistent reference facts, while the notebook is active working memory.

LLMs are fundamentally stateless — each inference call starts fresh with no memory of previous calls. Any sense of "memory" or "state" is an illusion created by including relevant information in the context window. Every fact the model "remembers" is actually present in the prompt text. Every running calculation is explicitly written into the context.

State and memory patterns formalize this illusion into reliable engineering patterns. Instead of relying on conversation history to implicitly carry state (fragile, token-expensive, easily lost), these patterns explicitly represent state as structured data within the context. A user preference is not just mentioned in turn 3 and hoped to survive — it is captured in a pinned facts section that is included in every subsequent context assembly.

*Recommended visual: A four-panel diagram showing the four state patterns side by side: "Scratchpad" (a notepad icon with evolving work-in-progress notes across turns), "Pinned Facts" (a pushpin icon with stable key-value pairs that persist unchanged), "Running Tallies" (a calculator icon with incrementally updated numerical state), and "Working Memory" (a structured form with goal, phase, evaluated items, next step), each with a sample content snippet and token cost annotation.*
*Source: Adapted from Park et al., "Generative Agents" (2023) and Shinn et al., "Reflexion" (2023)*

*Recommended visual: A timeline diagram showing a 15-turn conversation with two parallel tracks: "Implicit state (conversation history only)" showing gradual information loss and contradiction errors at turns 8 and 12, versus "Explicit state (pinned facts + running tally)" showing consistent, accurate state maintained throughout, with an annotation noting "40-60% reduction in contradictions" for the explicit state approach.*
*Source: Adapted from Anthropic, "Building Effective Agents" (2024) and Weng, "LLM Powered Autonomous Agents" (2023)*

## How It Works

### Scratchpads (Working Memory)

A scratchpad is a designated section of the context where the model can write intermediate reasoning, partial results, and work-in-progress computations. Unlike chain-of-thought (which happens within a single response), a scratchpad persists across turns, allowing multi-turn reasoning processes.

**Implementation**: Include a `<scratchpad>` section in the context that the model reads and writes to:

```
<scratchpad>
Current analysis state:
- Reviewed 3 of 7 documents
- Key findings so far: revenue grew 12% YoY, expenses grew 8%
- Outstanding questions: Q4 data not yet analyzed
- Working hypothesis: profitable growth trend, pending Q4 confirmation
</scratchpad>
```

After each turn, extract the scratchpad content from the model's response and inject the updated version into the next turn's context. The model sees its own previous working notes and can build on them.

**Best for**: Multi-step analysis tasks, iterative refinement, complex reasoning that spans multiple turns, and agentic workflows where the model tracks its own progress.

### Pinned Facts (Persistent Reference)

Pinned facts are key-value pairs or structured data that persist across the entire conversation, representing stable information that should always be accessible:

```
<user_context>
Name: Sarah Chen
Role: Senior Product Manager
Company: Acme Corp
Budget: $50,000
Preferred communication: Email
Previous products launched: 3
Key constraint: Launch must be before Q3
</user_context>
```

Pinned facts are populated from user profiles, CRM data, onboarding conversations, or explicit user statements. Once pinned, they are included in every context assembly regardless of conversation length, ensuring the model never "forgets" critical user information.

**Implementation**: Store pinned facts in a database keyed by user/session. Include them in every context assembly in a fixed position (typically after the system prompt, before conversation history). Allow both automatic pinning (when the user states a preference) and manual pinning (user explicitly says "remember this").

### Running Tallies (Accumulated State)

Running tallies maintain numerical or categorical state that updates incrementally:

```
<session_state>
Items discussed: 5
Approved items: 3 (Widget A, Widget B, Widget D)
Rejected items: 1 (Widget C)
Pending review: 1 (Widget E)
Total approved budget: $32,000 / $50,000
Remaining budget: $18,000
</session_state>
```

Running tallies prevent a common failure mode: the model losing track of accumulated state across many turns. Without explicit tallies, asking "how much budget is left?" in turn 15 requires the model to scan all previous turns, find every approval, extract amounts, and sum them — a fragile computation that frequently produces errors.

**Implementation**: After each turn that modifies state, update the tally programmatically (not by asking the model to count). If the model approves a $5,000 item, your code updates the approved budget and remaining budget. The updated tally is injected into the next turn's context.

### Working Memory Patterns

Working memory is an explicit state tracking block that captures the model's current understanding, goals, and plan. It is more structured than a scratchpad and more dynamic than pinned facts:

```
<working_memory>
Current goal: Help user select a project management tool
Phase: Comparison (3 of 4 phases completed)
Tools evaluated: Jira (score: 7/10), Asana (score: 8/10), Monday.com (score: 6/10)
Key decision criteria: integration with Slack, under $10/user/month, Gantt charts
Next step: Evaluate Linear against criteria
Blockers: Need user to confirm team size for pricing comparison
</working_memory>
```

Working memory differs from scratchpads in that it has a defined structure (goal, phase, evaluated options, next step), making it more reliable for complex multi-step processes. The structure prevents drift and keeps the model aligned with the task plan.

**Implementation**: Define a working memory schema appropriate to your application. After each turn, either have the model update the working memory (extract from its response) or update it programmatically based on observed actions.

## Why It Matters

### Reliability of Long Interactions

Without explicit state, model behavior degrades over long conversations. The model "forgets" earlier decisions, loses track of accumulated results, and contradicts itself. Explicit state prevents these failures by making every relevant fact directly accessible in every turn, regardless of when it was originally stated.

### Reducing Token Cost

Explicit state is more token-efficient than relying on full conversation history. A 200-token state block replaces thousands of tokens of conversation history from which the same information must be inferred. The model reads a concise summary of state rather than re-processing every turn where state was modified.

### Enabling Complex Workflows

Multi-step workflows — project planning, document review, data analysis, iterative design — require state tracking that exceeds what conversation history can reliably provide. Working memory and scratchpad patterns enable workflows that span dozens of turns while maintaining coherence and accuracy.

## Key Technical Details

- **Pinned facts should be 100-300 tokens** — enough for 10-20 key-value pairs covering the most important persistent information.
- **Scratchpad size should be capped at 500-1,000 tokens** to prevent it from dominating the context budget. Summarize or rotate old scratchpad content.
- **Programmatic state updates** (your code computes the new state) are more reliable than model-computed updates (asking the model to update a tally). Models make arithmetic and counting errors at rates of 5-15%.
- **State should be positioned in the high-attention zone** (beginning of context, after system prompt) to ensure the model consistently references it.
- **Working memory updates add one LLM call per turn** if the model generates the update, or zero if updates are programmatic.
- **State versioning** (keeping the last 2-3 versions of state) enables rollback when errors are detected and provides the model with a sense of how state has changed.
- **Explicit state reduces contradictions by 40-60%** in conversations exceeding 10 turns, compared to relying on conversation history alone.

## Common Misconceptions

- **"Conversation history is sufficient memory."** History carries state implicitly, but extracting it requires the model to scan, locate, and synthesize — operations that fail with increasing frequency as conversations grow. Explicit state is direct access; history is search-and-inference.
- **"The model can accurately maintain its own running tallies."** LLMs make arithmetic errors, lose count, and occasionally hallucinate numbers. Critical numerical state should be maintained by code, not the model. Use the model for reasoning, not accounting.
- **"State management adds too much complexity."** A simple pinned facts block adds 5 lines of code and 100 tokens per request. The complexity is minimal, and the reliability improvement is substantial. Start simple and add complexity only as needed.
- **"Scratchpads are just chain-of-thought."** Chain-of-thought is within-turn reasoning. Scratchpads persist across turns, enabling multi-turn reasoning processes. The persistence is what makes scratchpads powerful for complex tasks.
- **"You need a vector database for memory."** Vector databases are useful for long-term, cross-session memory retrieval. For within-session state, explicit context blocks are simpler, more reliable, and more deterministic. Use the right tool for the scope.

## Connections to Other Concepts

- `what-is-context-engineering.md` — State and memory patterns are context engineering techniques for maintaining information persistence across turns.
- `conversation-history-management.md` — Explicit state reduces dependence on conversation history, enabling more aggressive history compression.
- `context-budget-allocation.md` — State blocks require dedicated budget allocation, typically 200-500 tokens in the system prompt zone.
- `context-assembly-patterns.md` — State blocks are assembled into the context from external storage (databases, session stores) at each turn.
- `context-compression-techniques.md` — State blocks are compressed representations of information that would otherwise require thousands of tokens of conversation history.

## Further Reading

- Park et al., "Generative Agents: Interactive Simulacra of Human Behavior" (2023) — Implements memory streams, reflection, and planning as persistent state for long-running agents.
- Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning" (2023) — Uses explicit working memory and self-reflection state for multi-step agent improvement.
- Anthropic, "Building Effective Agents" (2024) — Practical patterns for state management in Claude-based agent applications.
- Weng, "LLM Powered Autonomous Agents" (2023) — Survey of memory architectures for LLM agents, including short-term and long-term memory patterns.
