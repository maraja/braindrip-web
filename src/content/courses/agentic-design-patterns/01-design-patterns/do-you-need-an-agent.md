# Do You Need an Agent?

**One-Line Summary**: A decision framework for determining whether your problem requires an autonomous agent or whether a simpler alternative will perform better at lower cost.

**Prerequisites**: None.

## What Is This Decision?

Imagine you need to get across town. You could walk, take a bus, hail a taxi, or charter a helicopter. Each option trades off cost, speed, flexibility, and reliability differently. Walking is cheap and predictable but slow. A taxi is flexible but expensive. A helicopter can go anywhere but costs orders of magnitude more and introduces new failure modes. Choosing a helicopter to go three blocks is not just wasteful --- it is worse than walking because of the overhead.

The same logic applies when building with LLMs. An autonomous agent (the helicopter) gives you maximum flexibility: it can reason, use tools, adapt to unexpected situations, and pursue open-ended goals. But that flexibility costs 6-10x more tokens than a coded workflow for the same task, introduces non-deterministic behavior, and is harder to debug. Most LLM-powered features do not need an agent. The first design decision you should make is whether you need one at all.

![Agent architecture overview -- showing the full components of an LLM-powered autonomous agent, including planning, memory, and tool use](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Figure: The full architecture of an LLM-powered agent (from Lilian Weng, 2023). Before building all of this, ask whether your task actually requires it -- most do not.*

## How It Works

### The Five-Question Triage

Before reaching for an agent framework, answer these five questions about your task:

| # | Question | If "No" | If "Yes" |
|---|----------|---------|----------|
| 1 | Does the task require **multiple tool calls** whose sequence cannot be predicted in advance? | Consider a prompt chain or coded workflow. | Continue to Q2. |
| 2 | Does the task require **adaptive decision-making** based on intermediate results? | A DAG workflow or routed pipeline likely suffices. | Continue to Q3. |
| 3 | Can the task tolerate **non-deterministic outputs** and occasional failures? | Use a coded workflow with retries. | Continue to Q4. |
| 4 | Is the task **high-value enough** to justify 6-10x token cost and added latency? | Use a simpler pattern. | Continue to Q5. |
| 5 | Do you have **observability infrastructure** to monitor and debug autonomous behavior? | Build that infrastructure first. | An agent is appropriate. |

If you answered "No" to any question, that row tells you the simpler alternative to use.

### The Alternatives Spectrum

| Pattern | Token Cost (relative) | Latency | Determinism | Best For |
|---------|----------------------|---------|-------------|----------|
| **Direct LLM call** | 1x | Low | High | Classification, extraction, summarization |
| **Prompt chain** | 2-3x | Medium | High | Multi-step transforms with known sequence |
| **RAG pipeline** | 1.5-2x | Medium | High | Knowledge-grounded Q&A |
| **Routed workflow** | 2-4x | Medium | High | Tasks with branching logic based on input type |
| **Coded workflow with tools** | 3-5x | Medium | Medium-High | Structured multi-tool tasks with known steps |
| **Single agent** | 6-10x | High | Low | Open-ended tasks requiring adaptive tool use |
| **Multi-agent system** | 10-30x | Very High | Very Low | Complex tasks requiring specialized roles |

### Problem Complexity Scoring

Score your problem on these four dimensions (1-5 each):

- **Path unpredictability**: How many different tool-call sequences could solve the task? (1 = one known path, 5 = completely open-ended)
- **Intermediate reasoning**: How much does step N+1 depend on interpreting the result of step N? (1 = not at all, 5 = completely)
- **Error recovery need**: How often will tool calls fail or return unexpected results that require re-planning? (1 = rarely, 5 = frequently)
- **Domain breadth**: How many distinct tool categories does the task span? (1 = one tool, 5 = five or more tool types)

**Scoring guide**:
- **4-8 total**: Use a direct call, prompt chain, or coded workflow.
- **9-13 total**: Use a routed workflow or coded workflow with tools.
- **14-20 total**: An agent is justified.

*Recommended visual: For a detailed visual of the ReAct agent loop that drives most agent behavior, see Yao et al.'s [ReAct paper (ICLR 2023)](https://arxiv.org/abs/2210.03629) -- understanding this loop helps clarify when it adds value vs. overhead.*

### Cost Reality Check

Concrete cost comparison for a "research a topic and write a summary" task:

- **Prompt chain** (retrieve, synthesize, format): ~4,000 tokens input + ~1,500 output = ~5,500 tokens total. Predictable, fast.
- **Single agent** (iterative search, evaluate, search more, synthesize): ~25,000-40,000 tokens across 5-8 loops. Better results on ambiguous queries, but 5-7x the cost.

If you run this task 10,000 times per day, the difference is $15/day vs $90/day at typical API pricing. Over a year, that is $5,400 vs $32,400. The agent must deliver meaningfully better outcomes to justify that gap.

## Why It Matters

### Over-Engineering Is the Default Failure Mode

The most common mistake in LLM application development is reaching for an agent when a prompt chain would work. Agent frameworks are exciting, well-marketed, and feel like the "advanced" choice. But complexity is a liability, not an asset. Every additional reasoning step is a chance for the model to hallucinate, choose the wrong tool, or get stuck in a loop. Simpler systems fail in simpler, more debuggable ways.

### Agents Shine in Specific Niches

Agents genuinely excel when: the user's intent is ambiguous and requires clarification, the tool-call graph cannot be known in advance, intermediate results materially change the strategy, and the task is high-value enough to absorb cost and latency. Coding assistants, research agents, and complex customer service workflows are legitimate agent use cases. Reformatting a JSON payload is not.

### The Reversibility Principle

Start with the simplest pattern that could work. You can always promote a prompt chain into an agent later by wrapping it in a reasoning loop. Going the other direction --- simplifying an agent into a workflow --- is much harder because you have to reverse-engineer the implicit decision logic the agent was performing.

## Key Technical Details

- Agents use **6-10x more tokens** than coded workflows performing the same task, based on benchmarks from Anthropic and LangChain evaluations.
- Each agent loop iteration adds **1-3 seconds of latency** per LLM call, making 5-loop agents take 5-15 seconds minimum.
- Agent success rates on tool-use benchmarks (e.g., BFCL, ToolBench) range from **65-85%**, meaning 15-35% of runs produce errors or suboptimal results.
- Prompt chains with hardcoded tool sequences achieve **95%+ reliability** for structured tasks.
- The median production agent (per LangSmith traces) makes **3-7 tool calls** per task. If your task needs exactly 2 calls in a known order, you do not need an agent.
- Multi-agent systems multiply cost roughly linearly with agent count: 3 agents cost roughly 3x a single agent.
- Debugging an agent failure requires tracing the full reasoning trajectory. Without observability tooling, you are flying blind.

## Common Misconceptions

**"Agents are always better because they can handle edge cases."** Agents handle edge cases by spending more tokens reasoning about them. If your edge cases are enumerable, explicit branching in a coded workflow handles them more cheaply and reliably. Agents are for edge cases you cannot enumerate in advance.

**"I need an agent because my task uses tools."** Tool use does not require an agent. A coded workflow can call tools in a fixed or branching sequence. An agent is only needed when the model must decide which tools to call and in what order, dynamically.

**"Agents are too unreliable for production."** Agents are unreliable for tasks that do not need agents. When applied to genuinely open-ended problems with proper guardrails, they achieve production-grade reliability. The issue is misapplication, not the pattern itself.

**"Starting with an agent and simplifying later is fine."** It is not. Agent codebases accumulate implicit decision logic that is hard to extract. Starting simple and promoting to an agent is dramatically easier than the reverse.

## Connections to Other Concepts

- `complexity-gradient.md` formalizes the principle of starting simple that this decision framework embodies.
- `architecture-selection-framework.md` picks up where this file leaves off --- once you have decided you need an agent, it helps you choose which agent architecture.
- `agent-vs-workflow.md` provides the foundational distinction between agents and workflows that this framework applies.
- `autonomy-spectrum.md` maps the range of autonomy levels, helping you calibrate how much control to hand to the LLM.
- `cost-optimization.md` covers how to reduce costs once you have committed to a pattern.

## Further Reading

- Anthropic, "Building Effective Agents," 2024 --- Argues strongly for preferring simpler patterns and provides concrete workflow examples.
- Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models," ICLR 2023 --- Establishes the agent loop pattern, useful for understanding what agents actually do.
- LangChain, "Agent Evaluation with LangSmith," 2024 --- Real production data on agent token usage, latency, and success rates.
- Weng, Lilian, "LLM Powered Autonomous Agents," 2023 --- Comprehensive survey that clarifies where agents add value vs. overhead.
