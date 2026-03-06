# Multi-Agent Decision Framework

**One-Line Summary**: A decision framework for determining when multi-agent architectures are justified and how to design agent boundaries, communication, and coordination when they are.

**Prerequisites**: `architecture-selection-framework.md`, `cost-latency-optimization.md`.

## What Is the Multi-Agent Decision Framework?

Think about hiring employees. If you run a small bakery and you are considering whether to hire five specialized workers -- one to mix dough, one to shape loaves, one to manage the oven, one to handle the register, one to clean -- the answer is probably no. One skilled baker can do all of those things, and the overhead of coordinating five people (scheduling, communication, handoffs) would slow down the operation and cost more than the specialization gains. But if you run a factory producing 10,000 loaves a day, specialization pays off: each worker becomes expert at their task, throughput increases, and the coordination overhead is amortized across high volume.

The same logic applies to multi-agent systems. A single agent with the right tools can handle most tasks. Multi-agent architectures introduce real costs -- coordination overhead, context isolation, communication latency, debugging complexity -- that are only justified when a single agent demonstrably cannot meet the requirements. The most common mistake in agent architecture is premature decomposition: splitting a single-agent task across multiple agents because it feels architecturally elegant, without proving that one agent cannot handle it.

![Agent architecture overview -- showing a single agent's full capability (planning, memory, tools) to establish the baseline before considering multi-agent](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Figure: The single-agent architecture (from Lilian Weng, 2023). Before splitting into multiple agents, verify that one agent with this full architecture -- planning, memory, and tools -- cannot meet your requirements. In practice, 70-80% of tasks designed as multi-agent can be handled by a well-designed single agent.*

This framework provides a structured process for making the single-vs-multi decision and, when multi-agent is justified, designing the system to minimize coordination overhead.

## How It Works

### The Single-Agent Ceiling Test

Before designing a multi-agent system, prove that a single agent cannot meet your requirements. This is the most important step and the one most often skipped.

**Test protocol:**

1. Build the simplest possible single-agent implementation using your best available model.
2. Evaluate it on your full task suite.
3. Identify where it fails and categorize the failure mode:

| Failure Mode | Single-Agent Fix | Multi-Agent Needed? |
|---|---|---|
| Context window overflow | Summarize, compress, use retrieval | Only if compression loses critical detail |
| Tool count too high (>15-20 tools) | Group tools, use tool routing | Only if routing cannot reduce per-step choices |
| Task requires conflicting personas | Switch persona mid-task via prompt | Only if persona switching degrades quality |
| Task requires parallel execution | Sequential execution (slower) | Only if latency budget cannot accommodate serial |
| Subtasks require isolated state | Manage sub-states within single context | Only if state cross-contamination causes errors |
| Task requires >50 steps | Use checkpoint/resume within single agent | Only if single-agent error rate compounds beyond threshold |

**The threshold question:** A single agent fails the ceiling test when its success rate on the evaluation suite is below your quality floor AND you have evidence that the failure is caused by one of the structural limitations above (not by prompt quality, tool design, or model capability, which should be fixed first).

**Typical finding:** In practice, 70-80% of tasks that teams initially design as multi-agent can be handled by a well-designed single agent. The single-agent ceiling test prevents unnecessary complexity.

### Agent Boundary Design

When multi-agent is justified, the next decision is where to draw the boundaries between agents.

**Separation of concerns:** Each agent should own a coherent domain of responsibility. Good boundaries are defined by:

- **Distinct tool sets**: Agent A uses database tools, Agent B uses email tools. Minimal tool overlap between agents.
- **Distinct knowledge domains**: Agent A is an expert in legal analysis, Agent B is an expert in financial modeling. Each has a specialized system prompt.
- **Distinct trust levels**: Agent A has read-only access, Agent B has write access. Security boundaries align with agent boundaries.
- **Distinct output types**: Agent A produces analysis reports, Agent B produces code. Different output formats and evaluation criteria.

**Bad boundaries** (signs your decomposition is wrong):

- Two agents frequently need to share intermediate results to proceed.
- One agent cannot start until another finishes, creating a serial bottleneck with no parallelism benefit.
- Agents have overlapping tool sets and are often confused about which agent should handle a request.
- One agent delegates most of its work to another agent (it is just a passthrough).

**Context isolation:** Each agent has its own context window. This is both a benefit (prevents context overflow) and a cost (agents cannot see each other's reasoning). Design the information that crosses agent boundaries carefully -- send structured summaries, not raw conversation histories.

*Recommended visual: For visual architecture diagrams of multi-agent coordination patterns (hierarchical supervisors, flat debate, and shared-blackboard systems), see Hong et al.'s [MetaGPT paper (2023)](https://arxiv.org/abs/2308.00352) and Wu et al.'s [AutoGen paper (2023)](https://arxiv.org/abs/2308.08155), both of which include system-level architecture diagrams showing inter-agent message flows.*

### Communication Protocol Selection

How agents exchange information determines the system's coupling, latency, and debuggability.

| Protocol | How It Works | Latency | Coupling | Best For |
|---|---|---|---|---|
| Direct message passing | Agent A sends structured message to Agent B | Low | High | Simple coordinator-worker patterns |
| Shared state (blackboard) | Agents read/write to a shared data structure | Medium | Medium | Collaborative document editing, analysis |
| Event-driven | Agents publish events; others subscribe and react | Low-Medium | Low | Pipeline architectures, async workflows |
| Orchestrator-mediated | Central orchestrator routes messages between agents | Medium | Low (between workers) | Complex workflows with dynamic routing |

**Protocol selection criteria:**

1. **If agents work on subtasks independently and report results to a coordinator:** Use direct message passing or orchestrator-mediated.
2. **If agents collaboratively build a shared artifact:** Use shared state.
3. **If agents react to each other's outputs asynchronously:** Use event-driven.
4. **If the workflow topology changes based on intermediate results:** Use orchestrator-mediated.

**Message design:** Regardless of protocol, messages between agents should be structured (JSON or typed objects), include a task ID for tracing, include the sender's confidence level or status, and carry only the information the receiving agent needs (not the full conversation history).

### Coordination Overhead Analysis

Multi-agent systems pay a coordination tax. Quantify it before committing to the architecture.

**Sources of overhead:**

| Overhead Source | Typical Cost | How to Measure |
|---|---|---|
| Inter-agent messages | 200-1000 tokens per message | Token count of all cross-agent messages |
| Orchestrator LLM calls | $0.005-0.05 per routing decision | Count orchestrator calls, multiply by model cost |
| Serialization latency | 100-500ms per handoff | Time between agent A finishing and agent B starting |
| Coordination failures | 5-15% of multi-agent tasks | Rate of tasks that fail due to miscommunication |
| Context reconstruction | 500-2000 tokens per agent | Tokens spent rebuilding context that would be free in single-agent |

**Break-even analysis:** Calculate the total overhead cost and compare it to the quality improvement from multi-agent. If the multi-agent system achieves 92% success rate versus single-agent's 78%, but costs 3x as much in tokens and takes 2x as long, is the 14-point quality improvement worth it? The answer depends on your quality floor and cost/latency constraints.

**Rule of thumb:** If coordination overhead exceeds 30% of total token usage, the agent boundaries are too chatty and should be redesigned. Target coordination overhead below 15%.

### Common Anti-Patterns

**Premature decomposition.** Splitting a task into multiple agents before proving a single agent cannot handle it. Symptom: each agent is trivially simple and most of the complexity is in the coordination layer. Fix: consolidate into a single agent with better tools and prompts.

**Chatty agents.** Agents that exchange many small messages rather than batch information into fewer, richer messages. Symptom: coordination overhead exceeds 30% of total tokens. Fix: redesign message schemas to include all needed information in each message. Prefer fewer, larger messages over many small ones.

**The god agent.** One agent that does 80% of the work while other agents do 20%. The "helper" agents add coordination overhead without meaningful specialization. Symptom: one agent's token usage dwarfs all others combined. Fix: either merge the helpers into the god agent or redistribute responsibilities to create genuine specialization.

**Circular delegation.** Agent A asks Agent B, which asks Agent C, which asks Agent A. Symptom: infinite loops or repeated work. Fix: enforce a strict delegation hierarchy (agents can only delegate downward, never laterally or upward) or add cycle detection at the orchestrator.

**Homogeneous agents.** Using multiple instances of the same agent (same tools, same prompt) to "parallelize" work that could be done by one agent in sequence. This only helps if the subtasks are truly independent and latency is the binding constraint. If the subtasks require shared context, homogeneous agents will produce inconsistent or duplicated work.

## Why It Matters

### Complexity Has a Compounding Cost

Every additional agent multiplies the state space of the system. A two-agent system has interactions between agent A's behavior, agent B's behavior, and their communication. A three-agent system has six pairwise interactions. Debugging a multi-agent failure requires understanding the full trajectory of every agent plus their interactions. In practice, debugging time scales superlinearly with agent count.

### Multi-Agent Systems Are Harder to Evaluate

Evaluating a single agent requires measuring whether it completes tasks. Evaluating a multi-agent system requires measuring task completion AND diagnosing which agent is responsible for failures. Was the task failure caused by Agent A's analysis, Agent B's code generation, or the orchestrator's routing decision? This attribution problem makes it harder to improve multi-agent systems iteratively.

### The Right Architecture Saves Months of Development

Choosing between single-agent and multi-agent at the start of a project is a high-leverage decision. A team that builds a multi-agent system unnecessarily will spend months managing coordination complexity. A team that refuses to use multi-agent when it is genuinely needed will hit a single-agent ceiling they cannot break through. The decision framework here prevents both mistakes.

## Key Technical Details

- **Single-agent ceiling**: In practice, 70-80% of tasks that teams initially design as multi-agent can be handled by a well-designed single agent with the right model, tools, and prompts.
- **Coordination overhead target**: Below 15% of total token usage. Alert at 30%.
- **Agent count guideline**: Most justified multi-agent systems use 2-4 agents. Systems with 5+ agents should be scrutinized for premature decomposition. Systems with 10+ agents are almost always overengineered.
- **Handoff latency**: Each agent-to-agent handoff adds 100-500ms plus the receiving agent's first LLM call. Budget 0.5-2 seconds per handoff in latency calculations.
- **Context reconstruction cost**: When Agent B needs to understand Agent A's work, expect 500-2000 tokens of context reconstruction per handoff. This is context that would be free in a single-agent system.
- **Failure attribution**: In multi-agent systems, 30-50% of failures are caused by coordination issues (miscommunication, wrong routing, context loss), not by individual agent capability. Track coordination failures separately.
- **Debugging overhead**: Expect 2-3x longer debugging cycles for multi-agent systems compared to single-agent systems of similar task complexity.

## Common Misconceptions

**"Multi-agent is always better for complex tasks."** Multi-agent is better only when the task exceeds a single agent's structural limits (context window, tool count, parallelism needs). For tasks within those limits, a single agent is simpler, faster, cheaper, and easier to debug.

**"More agents means more capability."** Adding agents adds coordination overhead. Each additional agent must provide enough marginal capability to offset its coordination cost. Beyond 3-4 agents, the overhead usually dominates.

**"Agents can coordinate as effectively as humans."** LLM-based agents are poor at nuanced coordination. They misinterpret messages, lose context across handoffs, and cannot negotiate ambiguity the way human teams do. Design for structured, unambiguous communication with minimal back-and-forth.

**"Multi-agent is needed when you have many tools."** Tool routing within a single agent (grouping tools, using a tool selection layer) can handle 15-20+ tools effectively. Multi-agent is only justified when tools genuinely require different contexts or trust levels, not just because there are many of them.

## Connections to Other Concepts

- `architecture-selection-framework.md` provides the initial architecture decision that determines whether multi-agent is even a candidate pattern.
- `cost-latency-optimization.md` provides the framework for analyzing whether the coordination overhead of multi-agent is acceptable within the cost and latency budget.
- `tool-interface-design.md` determines tool groupings, which directly influence agent boundary design.
- `multi-agent-architectures.md` in the ai-agent-concepts collection covers the technical architecture patterns (hierarchical, flat, debate) that this framework helps you choose between.
- `inter-agent-communication.md` in the ai-agent-concepts collection explores communication protocols in depth -- this file focuses on when and why to choose each one.
- `agent-delegation.md` in the ai-agent-concepts collection covers delegation mechanics relevant to the coordinator-worker patterns described here.

## Further Reading

- Wu, Q. et al. (2023). "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation." *arXiv:2308.08155*. Influential multi-agent framework; study the examples critically to distinguish justified from premature decomposition.
- Hong, S. et al. (2023). "MetaGPT: Meta Programming for a Multi-Agent Collaborative Framework." *arXiv:2308.00352*. Demonstrates role-based multi-agent systems with structured communication protocols.
- Anthropic (2024). "Building Effective Agents." Anthropic research blog. Explicitly argues for single-agent simplicity and provides criteria for when multi-agent is justified.
- Shinn, N. et al. (2023). "Reflexion: Language Agents with Verbal Reinforcement Learning." *NeurIPS 2023*. Shows how a single agent with self-reflection can achieve results previously attributed to multi-agent systems.
- Brooks, F. (1975). *The Mythical Man-Month*. Addison-Wesley. The original argument for why adding more workers to a project increases communication overhead -- directly applicable to multi-agent systems.
