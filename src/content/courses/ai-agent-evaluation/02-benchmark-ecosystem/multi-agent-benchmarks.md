# Multi-Agent Benchmarks

**One-Line Summary**: Multi-agent benchmarks evaluate systems of cooperating (or competing) AI agents, measuring coordination quality, communication efficiency, and emergent group behavior that single-agent benchmarks cannot capture.

**Prerequisites**: `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md`, `../01-foundations-of-agent-evaluation/evaluation-dimensions-taxonomy.md`, `benchmark-design-methodology.md`

## What Is Multi-Agent Benchmarking?

Imagine evaluating a sports team by only measuring each player individually -- tracking their running speed, shooting accuracy, and stamina. You would miss everything that makes the team effective or ineffective: passing coordination, defensive coverage, strategic adaptation, and communication. Multi-agent benchmarks address this exact gap for AI systems.

As agent architectures evolve from monolithic systems to compositions of specialized agents -- a planner agent, a coder agent, a reviewer agent, a tester agent -- we need evaluation methods that capture how well these agents work together. A multi-agent system can be composed of individually excellent agents that collectively fail due to miscommunication, redundant work, conflicting actions, or coordination deadlocks.

Multi-agent benchmarking is still in its early stages. Most benchmarks in this space emerged in 2024-2025, and the community has not yet converged on standard metrics or evaluation protocols. This makes the area both challenging and critical: as production systems increasingly adopt multi-agent architectures, the gap between single-agent evaluation and multi-agent reality grows wider.

## How It Works

### MultiAgentBench (ACL 2025)

MultiAgentBench is the first systematic benchmark specifically designed for multi-agent system evaluation. It introduces two key innovations:

**Milestone-based KPIs**: Rather than evaluating only the final output, MultiAgentBench defines intermediate milestones that the agent group should achieve during task execution. For a software development task, milestones might include: (1) requirements clarified, (2) architecture decided, (3) components assigned, (4) code implemented, (5) tests passing, (6) code reviewed.

**Coordination topology evaluation**: MultiAgentBench tests systems across four coordination patterns:

- **Star topology**: One central coordinator delegates to specialist agents. Measures the coordinator's ability to decompose tasks and synthesize results.
- **Chain topology**: Agents pass work sequentially (like an assembly line). Measures handoff quality and information preservation across transitions.
- **Tree topology**: Hierarchical delegation with sub-coordinators. Measures multi-level planning and aggregation.
- **Graph topology**: Peer-to-peer communication with no fixed structure. Measures emergent coordination and conflict resolution.

Each topology presents different failure modes. Star topologies bottleneck at the coordinator; chains lose information across handoffs; trees struggle with cross-branch coordination; graphs can devolve into communication storms.

### DPAI Arena (JetBrains)

DPAI (Developer Productivity AI) Arena evaluates multi-agent systems on complete developer workflows:

- **Feature implementation**: From spec to working code with tests
- **Bug triage and fix**: From bug report through diagnosis to verified resolution
- **Code review and refactoring**: Multi-pass review with iterative improvement
- **CI/CD pipeline management**: Monitoring, debugging, and fixing build pipelines

DPAI Arena is distinctive in evaluating full multi-workflow sequences where agents must maintain context across related tasks (e.g., a feature implementation followed by code review followed by CI fix). This tests long-horizon coordination that single-task benchmarks miss.

### MedAgentBoard

MedAgentBoard applies multi-agent evaluation to the medical domain, where agent teams must collaborate on:

- Differential diagnosis (combining specialist perspectives)
- Treatment planning (coordinating across care providers)
- Medical literature review (dividing and synthesizing research)
- Clinical trial matching (cross-referencing patient data with trial criteria)

The medical domain is particularly suited to multi-agent evaluation because real clinical practice inherently involves multi-specialist coordination, providing natural task decompositions and clear quality criteria.

### Measuring Coordination Quality

Multi-agent benchmarks must evaluate dimensions that do not exist in single-agent contexts:

- **Communication efficiency**: Messages sent per task, information content per message, redundant communication ratio
- **Task decomposition quality**: Whether the work division matches agent specializations and minimizes dependencies
- **Conflict resolution**: How agents handle disagreements, contradictory information, or competing resource demands
- **Emergent behavior**: Positive (spontaneous specialization, adaptive role-switching) and negative (social loafing, echo chambers, escalation spirals)
- **Failure attribution**: When the group fails, which agent or interaction was responsible?

## Why It Matters

1. **Architecture reflects reality**: Production agent systems like Devin, Factory, and enterprise automation platforms use multi-agent architectures. Evaluating them with single-agent benchmarks creates a dangerous measurement gap.
2. **Coordination is the bottleneck**: In practice, multi-agent systems fail more often from coordination failures than from individual agent incompetence. Benchmarks must capture this.
3. **Emergent behavior detection**: Multi-agent systems exhibit behaviors that no individual agent was designed to produce. Without explicit evaluation, these behaviors -- both beneficial and harmful -- go undetected.
4. **Scaling evaluation**: As systems grow from 2-3 agents to dozens, the combinatorial explosion of interaction patterns demands structured evaluation frameworks.

## Key Technical Details

- MultiAgentBench evaluates systems with 2-6 agents per task; DPAI Arena supports up to 10
- Communication overhead is measured in tokens exchanged: efficient systems use 2-5x fewer tokens than naive approaches for equivalent task quality
- Coordination topology significantly impacts performance: star topologies outperform graph topologies on well-defined tasks by 15-25%, but graph topologies show 10-15% advantages on ambiguous, exploratory tasks
- Failure attribution in multi-agent systems requires tracing causal chains across agent interactions -- currently done via post-hoc trajectory analysis
- MedAgentBoard uses domain-expert-validated rubrics with inter-rater reliability (Cohen's kappa) of 0.72-0.85
- Agent-to-agent communication formats (structured JSON vs. natural language) impact coordination quality by 10-20%
- Multi-agent evaluation runs cost 3-10x more than equivalent single-agent evaluations due to inter-agent communication overhead

## Common Misconceptions

**"Multi-agent systems are always better than single-agent systems."** For many tasks, a single capable agent outperforms a team of specialized agents because coordination overhead exceeds the benefit of specialization. Multi-agent architectures become advantageous primarily when tasks genuinely require diverse capabilities or parallel execution.

**"You can evaluate multi-agent systems by evaluating each agent individually."** Individual agent quality is necessary but not sufficient. A team of strong agents with poor coordination protocols will underperform a team of adequate agents with excellent coordination. The interaction effects dominate.

**"More agents means better performance."** Adding agents increases communication complexity quadratically (in fully connected topologies). Beyond 4-5 agents, most current systems show diminishing or negative returns unless the coordination architecture is carefully designed.

**"Multi-agent benchmarks are just harder single-agent benchmarks."** The evaluation dimensions are fundamentally different. Multi-agent benchmarks must measure communication quality, role adherence, coordination overhead, and emergent behavior -- none of which exist in single-agent contexts.

## Connections to Other Concepts

- `swe-bench-deep-dive.md` covers the single-agent coding benchmarks that DPAI Arena extends to multi-agent settings
- `tool-use-benchmarks.md` discusses tool-use evaluation, which becomes more complex when multiple agents share tools
- `benchmark-design-methodology.md` addresses the unique design challenges of multi-agent evaluation (topology selection, milestone definition)
- `../01-foundations-of-agent-evaluation/compounding-errors-in-multi-step-tasks.md` explains how error compounding intensifies in multi-agent chains
- `../04-trajectory-and-process-analysis/trajectory-quality-metrics.md` discusses metrics adaptable to multi-agent trajectories
- `../10-frontier-research-and-open-problems/multi-agent-evaluation-theory.md` explores the theoretical foundations this area needs

## Further Reading

- "MultiAgentBench: Evaluating the Collaboration and Competition of LLM Agents" -- Qian et al., 2025
- "DPAI Arena: Benchmarking Multi-Agent Developer Productivity Systems" -- JetBrains Research, 2025
- "MedAgentBoard: Evaluating Multi-Agent Medical Consultation Systems" -- Wang et al., 2025
- "Communicative Agents for Software Development" -- Qian et al., 2024
- "AgentVerse: Facilitating Multi-Agent Collaboration" -- Chen et al., 2024
