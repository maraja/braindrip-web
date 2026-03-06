# Complexity Gradient

**One-Line Summary**: Start with the simplest LLM pattern that could work and add complexity only when measured evidence proves it insufficient.

**Prerequisites**: `do-you-need-an-agent.md`.

## What Is the Complexity Gradient?

Think about building a house. You start with the foundation and framing. You do not begin by installing a smart home system and then try to figure out where the walls go. Yet this is exactly what many teams do with LLM applications: they reach for a multi-agent framework on day one, before they have even confirmed that a single prompt can do the job.

The complexity gradient is a design principle: arrange your options from simplest to most complex, start at the bottom, and climb only when you have evidence that the current rung fails. Each rung up the ladder buys you more capability but costs you predictability, debuggability, speed, and money. The goal is to find the lowest rung that meets your requirements --- not the most impressive one.

Anthropic's "Building Effective Agents" guide (2024) makes this the central recommendation: "The most successful agent implementations we've seen start with simple, composable patterns." This is not modesty. It is engineering discipline.

![Agent architecture overview -- the top rung of the complexity ladder, showing the full planning-memory-tools architecture of an autonomous agent](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Figure: The full agent architecture (from Lilian Weng, 2023) represents the top of the complexity ladder. Most tasks should be solved at a lower rung before climbing to this level of complexity.*

## How It Works

### The Complexity Ladder

| Rung | Pattern | Typical Token Cost | Typical Latency | Determinism |
|------|---------|-------------------|-----------------|-------------|
| 1 | **Single LLM call** | 1x | 0.5-2s | High |
| 2 | **Prompt chain** | 2-3x | 2-6s | High |
| 3 | **Routed workflow** | 2-4x | 2-8s | Medium-High |
| 4 | **Single agent (tool-use loop)** | 6-10x | 5-30s | Low-Medium |
| 5 | **Multi-agent system** | 10-30x | 15-120s | Low |

Each rung is a strict superset of capability. A prompt chain can do everything a single call can do, plus handle multi-step transformations. An agent can do everything a routed workflow can do, plus handle unpredictable branching. The question is always: do you need that "plus"?

### Criteria for Climbing Up

Move to the next rung **only** when you can demonstrate one or more of these with data:

| Current Rung | Climb When |
|-------------|------------|
| Single LLM call | Output quality requires breaking the task into distinct steps (e.g., extract-then-format), OR the task exceeds what a single prompt can reliably handle. |
| Prompt chain | Different inputs require fundamentally different processing paths, not just different prompts. |
| Routed workflow | The correct next step depends on interpreting the output of the previous step in ways you cannot enumerate as branches. |
| Single agent | The task requires multiple specialized capabilities that degrade when combined in one system prompt, OR parallelism across subtasks would improve latency. |

**The evidence rule**: Before climbing, run your current rung on at least 50 representative inputs and measure failure rate. If it exceeds your tolerance threshold (typically 5-15% depending on domain), identify whether the failures are due to insufficient complexity or due to fixable prompt/tool issues. Most failures at lower rungs are prompt problems, not architecture problems.

### Criteria for Simplifying Down

Move down when:

- **Over-budget**: Your token costs exceed what the task's business value supports. An agent that costs $0.12 per run for a task worth $0.05 needs simplification.
- **Over-latent**: Users are waiting too long. If 80% of agent runs follow the same 2-3 tool call sequence, hardcode that sequence as a workflow.
- **Over-failing**: Your agent's error rate is higher than the simpler pattern it replaced. This happens more often than people admit.
- **Under-utilizing**: Tracing data shows the agent uses only 2 of its 8 tools in 90% of runs. That is a workflow wearing an agent costume.

![Tree of Thoughts -- a structured reasoning approach that sits between simple prompting and full agent autonomy](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/tree-of-thoughts.png)
*Figure: Tree of Thoughts (Yao et al., 2023) illustrates an intermediate rung -- structured reasoning that is more capable than a single prompt but less complex than a full agent loop.*

### The Empirical Validation Loop

For each rung, apply this process:

1. **Baseline**: Implement the pattern. Measure success rate, token cost, latency, and user satisfaction on a representative eval set (minimum 50 examples, ideally 200+).
2. **Error analysis**: For failures, categorize root causes: prompt issue (fixable at current rung), missing tool (fixable at current rung), or architectural limitation (requires next rung).
3. **Fix first**: Address prompt and tool issues before climbing. Teams routinely find that 60-80% of failures at a given rung are fixable without adding complexity.
4. **Climb with intent**: If architectural limitations account for more than your failure tolerance, promote to the next rung with a clear hypothesis about what the added complexity will fix.
5. **Validate the climb**: After promotion, re-measure. If the new rung does not measurably improve the metric that motivated the climb, roll back.

## Why It Matters

### Complexity Has Compound Costs

Each rung up the ladder does not just add one cost --- it multiplies across several dimensions simultaneously. An agent is not just "more tokens." It is more tokens AND more latency AND more failure modes AND more debugging time AND more monitoring infrastructure AND more testing surface area. These costs compound. A system that is 2x harder to debug, 3x more expensive, and 2x less reliable is not incrementally worse; it is qualitatively harder to operate.

### Premature Complexity Is the Root of Most Agent Failures

When teams report that "agents don't work," the root cause is almost always that they skipped rungs. They went directly from "we need an LLM feature" to "let's build a multi-agent system." The agent then fails on tasks that a prompt chain could have handled, and the team concludes that LLM applications are unreliable. The LLM was fine. The architecture was wrong.

### The Gradient Enables Incremental Investment

Starting simple means you can ship a working v1 fast (often in days), learn from real usage, and invest in complexity where the data tells you to. This is faster and cheaper than building a complex system, discovering it fails in unexpected ways, and trying to figure out which of the 15 moving parts is responsible.

## Key Technical Details

- A single well-crafted LLM call handles **70-80% of production LLM features** (classification, extraction, summarization, simple generation). Most applications never need to leave rung 1.
- Prompt chains add roughly **1-2 seconds of latency per step**. A 4-step chain takes 4-8 seconds, which is acceptable for most asynchronous workflows.
- Routed workflows with 3-5 branches typically achieve **90-95% routing accuracy** when the routing prompt is well-designed. Below 90%, the router needs better examples, not a more complex architecture.
- Moving from a coded workflow to a single agent typically increases token cost by **3-5x** and latency by **2-4x** while decreasing reliability by **10-20 percentage points** initially.
- Multi-agent systems require at least **3-5 inter-agent messages** per task, each of which is a full LLM call. A 3-agent system with 5 messages averages 15 LLM calls per task.
- In production LangSmith traces, **over 40%** of deployed "agents" follow the same tool-call sequence in 80%+ of runs --- they are effectively workflows and should be refactored as such.
- The median time to debug an agent failure is **3-5x longer** than debugging a workflow failure, based on practitioner reports.

## Common Misconceptions

**"Starting simple means building a throwaway prototype."** No. Each rung is production-grade code. A well-built prompt chain is not a prototype --- it is a production system. If you later need an agent, the chain becomes the "happy path" that the agent follows in the majority of cases, with the agent loop handling only the exceptions.

**"More capable models eliminate the need for this gradient."** Better models make each rung more capable, which means you can stay at lower rungs for more tasks. GPT-4-class models handle prompt chains that would have required agents with GPT-3.5. Model improvement reinforces the gradient, not replaces it.

**"The gradient is just about saving money."** Cost is one factor, but the more important factors are reliability, latency, and debuggability. Even with unlimited budget, an unnecessary agent is harder to maintain and more likely to fail than a workflow that does the same job.

**"You cannot go back down once you have climbed."** You can and should. If tracing data shows your agent consistently follows 2-3 predictable paths, extract those paths into a routed workflow. You will get faster, cheaper, more reliable execution for the common cases and can keep the agent for the remaining edge cases.

## Connections to Other Concepts

- `do-you-need-an-agent.md` applies this principle to the specific question of whether to use an agent at all.
- `architecture-selection-framework.md` helps you choose between patterns once the gradient tells you which rung you are on.
- `agent-vs-workflow.md` defines the core distinction between the lower rungs (workflows) and upper rungs (agents).
- `autonomy-spectrum.md` provides a parallel framing focused on how much control to delegate to the LLM.
- `cost-optimization.md` provides techniques for reducing cost at whatever rung you land on.

## Further Reading

- Anthropic, "Building Effective Agents," 2024 --- The primary source for the "start simple" principle, with concrete examples of each pattern.
- Khattab et al., "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines," 2023 --- Demonstrates how systematic optimization at each rung can eliminate the need to climb.
- Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning," NeurIPS 2023 --- Shows how adding a reflection loop (rung 4) improves results, but only for tasks where rung 3 measurably fails.
- LangChain, "How to Evaluate Agents," 2024 --- Practical guide to measuring whether a rung change improved outcomes.
- Weng, Lilian, "LLM Powered Autonomous Agents," 2023 --- Good conceptual map of the landscape that helps calibrate where different tasks fall on the gradient.
