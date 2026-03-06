# Multi-Agent Architectures

**One-Line Summary**: Multi-agent architectures define how multiple AI agents are organized and coordinated — pipeline, debate, hierarchy, swarm, and blackboard patterns each suit different problem types, much like different team structures suit different organizations.

**Prerequisites**: Agent fundamentals, tool chaining, prompt engineering, distributed systems basics

## What Is Multi-Agent Architectures?

Consider how different organizations structure their teams. A factory assembly line passes work sequentially from station to station (pipeline). A courtroom has prosecution and defense arguing before a judge (debate). A corporation has executives directing managers who direct individual contributors (hierarchy). A flock of birds navigates without a leader, each bird following simple rules about its neighbors (swarm). A hospital emergency room has a shared whiteboard where doctors, nurses, and specialists post and read updates (blackboard). Each structure evolved because it solves a specific coordination problem better than the alternatives.

Multi-agent architectures apply these same organizational patterns to AI agents. Instead of relying on a single monolithic agent to handle everything, the system distributes work across multiple specialized agents that interact through defined patterns. Each architecture makes different trade-offs between coordination overhead, fault tolerance, task complexity, and scalability. The choice of architecture fundamentally shapes what the system can accomplish and how reliably it performs.

The field has matured rapidly since 2023, with frameworks like AutoGen, CrewAI, LangGraph, and OpenAI Swarm each favoring different architectural patterns. Understanding the taxonomy of architectures is essential for choosing the right pattern for a given application rather than defaulting to the most popular or most recently hyped approach.

![Overview of LLM-powered autonomous agent system with Planning, Action, and Memory components](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Source: [Lilian Weng, "LLM Powered Autonomous Agents" (2023)](https://lilianweng.github.io/posts/2023-06-23-agent/) — Multi-agent architectures extend this single-agent blueprint by composing multiple such agents with different specializations and coordination patterns.*

## How It Works

### Pipeline (Sequential Handoff)

Agents process work in a fixed sequence, each receiving the output of the previous agent and producing input for the next. Agent A drafts content, Agent B reviews it, Agent C formats it, Agent D publishes it. This is the simplest multi-agent pattern and works well when tasks have clear, non-overlapping stages.

**Strengths**: Simple to implement, easy to debug (linear flow), each stage can be optimized independently. **Weaknesses**: Slow (sequential bottleneck), fragile (one stage failure halts everything), no feedback loops without explicit looping mechanisms.

### Debate (Adversarial)

Two or more agents take opposing roles — one proposes, another critiques, and optionally a third judges. This creates a dialectic process where ideas are stress-tested before acceptance. Used for reasoning tasks where overconfidence or hallucination is a risk.

**Strengths**: Catches errors single agents miss, reduces hallucination, produces more balanced outputs. **Weaknesses**: Higher cost (multiple agents running), can be slow, may produce false disagreements or fail to converge.

### Hierarchy (Manager-Worker)

A manager agent receives a complex task, decomposes it into subtasks, delegates each to specialist worker agents, and synthesizes their results. The hierarchy can be multi-level: a CEO agent delegates to manager agents, who delegate to worker agents. This mirrors corporate organizational structure.

**Strengths**: Handles complex tasks through decomposition, specialist agents can be optimized for narrow tasks, scales to large problems. **Weaknesses**: Manager is a single point of failure, communication overhead between levels, manager quality bottlenecks the whole system.

### Swarm (Emergent)

![Switch Transformer MoE architecture showing how inputs are routed to specialized experts](https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/blog/moe/00_switch_transformer.png)
*Source: [HuggingFace, "Mixture of Experts" blog](https://huggingface.co/blog/moe) — The Mixture of Experts routing pattern is conceptually analogous to multi-agent swarm routing: inputs are directed to specialized sub-systems based on local routing decisions.*

Multiple agents operate with simple individual rules and interact with a shared environment. No central coordinator exists. Complex behavior emerges from local interactions — similar to ant colonies or bird flocks. OpenAI's Swarm framework exemplifies this: agents have instructions and tools, and they can hand off conversations to other agents based on local conditions.

**Strengths**: Resilient (no single point of failure), scales naturally, adapts to changing conditions. **Weaknesses**: Hard to predict or debug emergent behavior, difficult to guarantee task completion, limited to problems where local decision-making suffices.

### Blackboard (Shared State)

All agents read from and write to a shared workspace (the "blackboard"). Each agent monitors the blackboard for information relevant to its expertise and contributes when it can. A controller may determine which agent acts next based on the current state. This pattern originated in classic AI systems like HEARSAY-II for speech understanding.

**Strengths**: Flexible (agents engage when relevant), supports heterogeneous agents, natural for problems requiring integration of multiple knowledge sources. **Weaknesses**: Shared state can become a bottleneck, conflict resolution for concurrent writes is complex, harder to reason about than linear flows.

## Why It Matters

### Right Tool for the Right Job

Different tasks demand different coordination patterns. Code review benefits from debate (proposer + reviewer). Research reports benefit from pipeline (research, write, edit). Complex project execution benefits from hierarchy (decompose and delegate). Choosing the wrong architecture leads to unnecessary complexity or insufficient coordination.

### Scaling Agent Capabilities

Single agents hit capability ceilings. Context windows limit how much information one agent can process. Specialization limits how many domains one agent can handle expertly. Multi-agent architectures bypass these limits by distributing work across multiple agents, each with its own context and specialization.

### Reliability Through Redundancy

Multi-agent systems can be more reliable than single agents. Debate catches hallucinations. Parallel execution with voting reduces random errors. Hierarchical supervision catches worker mistakes. These patterns trade compute cost for output quality — a trade-off that is worthwhile for high-stakes applications.

## Key Technical Details

- **Agent identity**: Each agent typically has its own system prompt defining its role, capabilities, and behavior. The system prompt is the primary mechanism for differentiation — all agents may use the same underlying model.
- **Communication overhead**: Each inter-agent message costs tokens. A hierarchy with 3 levels and 5 workers can consume 10-20x more tokens than a single agent doing the same task. Architecture selection must consider cost.
- **Shared vs. isolated context**: Some architectures share context between agents (blackboard), others pass only specific outputs (pipeline). Shared context enables richer coordination but increases token usage and can introduce confusion.
- **Orchestration frameworks**: AutoGen (Microsoft) favors conversational multi-agent patterns. CrewAI emphasizes role-based crews. LangGraph provides graph-based orchestration. OpenAI Swarm implements lightweight agent handoffs. Each framework has architectural opinions.
- **Determinism**: Multi-agent systems are less deterministic than single agents. The interaction of multiple stochastic models amplifies variability. Testing and evaluation become significantly harder.
- **Failure modes**: Multi-agent systems introduce new failure types: infinite delegation loops, agents talking past each other, contradictory outputs from different agents, and coordination deadlocks.
- **When NOT to use multi-agent**: If a single agent with the right tools can handle the task, a multi-agent architecture adds unnecessary complexity and cost. Multi-agent systems should be reserved for tasks that genuinely exceed single-agent capabilities.

## Common Misconceptions

- **"More agents always means better results"**: Additional agents add coordination overhead, increase cost, and introduce new failure modes. Many tasks are handled better by a single well-prompted agent with good tools than by a team of agents.
- **"Multi-agent systems require different models for different agents"**: Most multi-agent systems use the same underlying model for all agents, differentiated only by system prompts and tools. Using different models (e.g., a fast model for simple tasks, a powerful model for complex ones) is an optimization, not a requirement.
- **"Swarm architectures are always better because they're decentralized"**: Swarm patterns work for specific problem types (routing, triage) but fail for tasks requiring coordinated multi-step plans. Most business workflows need explicit coordination, not emergent behavior.
- **"Multi-agent debate always catches errors"**: Debate is effective when agents have genuinely different perspectives or information. When all agents share the same training data and biases, they may agree on incorrect answers, creating a false sense of verification.
- **"These architectures are mutually exclusive"**: Production systems often combine patterns. A hierarchy might use debate at the review stage and pipeline for the execution stages. The taxonomy is a vocabulary for discussion, not a set of rigid categories.

## Connections to Other Concepts

- `agent-delegation.md` — Delegation is the core mechanism of hierarchical architectures: how a manager agent assigns work to specialists.
- `agent-debate-and-verification.md` — The debate architecture pattern explored in depth, including specific verification strategies.
- `inter-agent-communication.md` — All architectures require communication; the pattern determines what kind (message passing, shared state, events).
- `hierarchical-agent-systems.md` — Deep dive into multi-level hierarchies, including recursive delegation and escalation.
- `swarm-and-emergent-behavior.md` — Detailed exploration of swarm architectures, emergence, and the OpenAI Swarm framework.

## Further Reading

- Wu et al., "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation" (2023) — Introduces AutoGen's conversational multi-agent framework, supporting pipeline, debate, and group chat patterns.
- Hong et al., "MetaGPT: Meta Programming for a Multi-Agent Collaborative Framework" (2023) — Multi-agent system where agents take software engineering roles (product manager, architect, engineer) in a pipeline architecture.
- Li et al., "CAMEL: Communicative Agents for 'Mind' Exploration of Large Language Model Society" (2023) — Foundational work on role-playing multi-agent communication, exploring how agent pairs collaborate through structured dialogue.
- OpenAI, "Swarm: An Educational Framework for Lightweight Multi-Agent Orchestration" (2024) — OpenAI's framework demonstrating handoff-based agent coordination with minimal overhead.
- Anthropic, "Building Effective Agents" (2024) — Practical guidance on when multi-agent architectures add value versus when single-agent approaches are sufficient.
