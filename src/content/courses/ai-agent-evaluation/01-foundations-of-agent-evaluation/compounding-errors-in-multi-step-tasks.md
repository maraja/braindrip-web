# Compounding Errors in Multi-Step Tasks

**One-Line Summary**: When an agent executes a sequence of steps with independent per-step success probability $p$, the overall success probability decays exponentially as $p^n$, making long-horizon task evaluation fundamentally different from single-step evaluation.

**Prerequisites**: `why-agent-evaluation-is-hard.md`, `the-non-determinism-problem.md`

## What Is Error Compounding?

Picture a relay race with 10 runners. If each runner has a 95% chance of completing their leg without dropping the baton, the team's chance of a clean race is not 95% -- it is $0.95^{10} \approx 60\%$. Each handoff is an independent opportunity for failure, and the failures multiply.

AI agents face the same dynamic. Every tool call, every reasoning step, every environment interaction is a potential failure point. An agent that appears highly capable on individual steps can fail frequently on realistic multi-step tasks. This exponential decay is perhaps the most counterintuitive property of agent performance and has profound implications for both evaluation design and system architecture.

The implication for evaluation is stark: testing agents on short tasks systematically overestimates their performance on the long tasks that matter in production. An evaluation suite dominated by 3-5 step tasks will paint a misleading picture of an agent that must handle 20-50 step workflows in deployment.

## How It Works

### The Basic Mathematical Model

Under the simplifying assumption that each step succeeds independently with probability $p$, the probability of an $n$-step task succeeding is:

$$P(\text{success}) = p^n$$

This gives us the following concrete numbers:

| Per-Step Success ($p$) | 5 Steps | 10 Steps | 15 Steps | 20 Steps | 30 Steps |
|----------------------|---------|----------|----------|----------|----------|
| 99% | 95.1% | 90.4% | 86.0% | 81.8% | 74.0% |
| 97% | 85.9% | 73.7% | 63.3% | 54.4% | 40.1% |
| 95% | 77.4% | 59.9% | 46.3% | 35.8% | 21.5% |
| 90% | 59.0% | 34.9% | 20.6% | 12.2% | 4.2% |
| 85% | 44.4% | 19.7% | 8.7% | 3.9% | 0.8% |
| 80% | 32.8% | 10.7% | 3.5% | 1.2% | 0.1% |

The numbers are sobering. Even at 95% per-step reliability -- which sounds excellent -- an agent fails nearly two-thirds of 20-step tasks. At 90% per-step (still sounds good), 20-step success drops to 12%. This is not a theoretical concern; real coding tasks routinely involve 10-30 tool calls.

### Relaxing the Independence Assumption

The $p^n$ model assumes independent step failures. In practice, step outcomes are often correlated:

**Positive correlation (makes things worse):** A misunderstanding in step 1 propagates to subsequent steps. If the agent misidentifies the root cause of a bug, every subsequent action builds on that misdiagnosis. The effective per-step probability conditional on a prior error drops below $p$, making the actual task success rate worse than $p^n$.

**Negative correlation (makes things better):** Error recovery mechanisms create negative correlation. If the agent detects a mistake at step 5, it can backtrack and correct it, effectively making later steps conditional on error detection. This means the effective $p$ increases for later steps, making the actual success rate better than $p^n$.

A more realistic model accounts for error recovery:

$$P(\text{success}) = p^n + \sum_{i=1}^{n} p^{i-1}(1-p) \cdot r_i \cdot p^{n-i}$$

where $r_i$ is the probability of recovering from an error at step $i$. Even modest recovery probabilities ($r_i \approx 0.3$) significantly improve outcomes for long trajectories.

### Empirical Evidence

Data from real agent benchmarks confirms the compounding effect:

- **SWE-bench**: Tasks requiring 1-3 file edits are resolved at roughly 2x the rate of tasks requiring 5+ file edits across all tested agents
- **WebArena**: Multi-page web navigation tasks (10+ steps) see success rates 40-60% lower than single-page tasks for the same agents
- **GAIA benchmark**: Level 3 tasks (multi-step reasoning with tools) have success rates 3-5x lower than Level 1 tasks (single-step) across frontier models
- **tau-bench**: The airline domain (longer interaction sequences) shows consistently lower success than the retail domain (shorter sequences) for every evaluated agent

### Implications for Evaluation Design

#### 1. Test Long Trajectories, Not Just Short Ones

Evaluation suites must include tasks spanning the full range of trajectory lengths expected in production. A suite of only 3-5 step tasks gives no information about 20-step performance due to the nonlinear relationship.

Recommended distribution for a general-purpose agent evaluation suite:
- 20% tasks with 1-3 steps (baseline capability)
- 30% tasks with 4-8 steps (moderate complexity)
- 30% tasks with 9-15 steps (realistic workflows)
- 20% tasks with 16+ steps (stress testing)

#### 2. Measure Per-Step and End-to-End Independently

Decomposing end-to-end success into per-step metrics reveals whether failures come from individual step weakness or compounding. If per-step accuracy is 98% but 20-step success is only 20% (far below $0.98^{20} = 67\%$), the agent has a correlated-error problem -- mistakes cascade rather than occurring independently.

#### 3. Evaluate Error Recovery Explicitly

Create evaluation tasks where errors are deliberately injected or where the environment provides misleading initial information. An agent's ability to detect and recover from errors is a critical differentiator for long-horizon tasks.

#### 4. Report Trajectory-Length-Conditioned Metrics

Rather than a single pass rate, report success as a function of trajectory length. This allows users to predict performance on their specific workflow lengths.

### Mitigation Strategies (and Their Evaluation)

Agents and agent frameworks use several strategies to combat error compounding:

- **Checkpointing and rollback**: Save state at key points and revert to the last good state on failure. Evaluation should test whether rollback is triggered appropriately.
- **Planning and decomposition**: Break large tasks into subtasks, each of which can be verified independently. Evaluation should check plan quality, not just final outcomes.
- **Self-verification**: The agent checks its own work after each step. Evaluation should measure verification accuracy (does it catch real errors?) and false positive rate (does it flag correct actions?).
- **Retries with variation**: On failure, retry with a modified approach rather than repeating the same action. Evaluation should distinguish between blind retries and adaptive retries.

## Why It Matters

1. **Short-task benchmarks systematically mislead.** An agent that looks 90% capable on 3-step tasks may be 35% capable on production-length workflows. Evaluation that does not account for compounding overestimates readiness.
2. **Per-step improvement has outsized returns.** Improving per-step success from 90% to 95% improves 20-step success from 12% to 36% -- a 3x improvement from a seemingly modest 5-point gain. This tells teams where to focus optimization effort.
3. **Architecture decisions have compounding implications.** Agents that verify each step, checkpoint state, and recover from errors have dramatically different compounding profiles than those that execute linearly. Evaluation must capture this.
4. **Trajectory length is a confound in evaluation.** When comparing agents on a benchmark with mixed trajectory lengths, the agent that happens to get more short tasks will appear better even if its per-step capability is identical.

## Key Technical Details

- Moving per-step accuracy from 95% to 99% improves 20-step success from 36% to 82% -- a 2.3x improvement
- Empirical per-step accuracy for frontier coding agents ranges from 85-95% depending on step complexity
- Self-verification (checking your own work) can improve effective per-step accuracy by 5-10 percentage points but adds cost and latency
- The "effective number of independent steps" in a task is often less than the raw tool-call count because many calls are trivially correct (e.g., reading a file)
- Agent frameworks that implement planning-then-execution show lower compounding rates than pure reactive agents, because planning errors affect all subsequent steps but reduce per-step decision complexity

## Common Misconceptions

**"95% per-step accuracy is good enough."** It depends entirely on trajectory length. For 5-step tasks, 95% per step yields 77% success -- acceptable for many use cases. For 20-step tasks, it yields 36% -- unacceptable for most production systems. "Good enough" is meaningless without specifying the number of steps.

**"You can evaluate multi-step capability by testing individual steps."** Individual step tests miss correlated errors, cascading failures, and the agent's ability to maintain coherent plans over long horizons. A step that works perfectly in isolation may fail in context because the agent has accumulated a misleading internal state.

**"Error compounding makes long-horizon agents impractical."** Error recovery, checkpointing, and self-verification substantially mitigate compounding. The goal is not to eliminate per-step errors but to build systems that detect and recover from them. Human experts also make per-step errors but recover effectively.

**"More steps always means lower success."** If additional steps are verification or correction steps, they can increase overall success rate even though they increase trajectory length. The key variable is not raw step count but the number of unverified decision points.

## Connections to Other Concepts

- `the-non-determinism-problem.md` -- non-determinism at each step is the underlying cause of compounding
- `why-agent-evaluation-is-hard.md` -- compounding is one of the six fundamental challenges
- `outcome-vs-process-evaluation.md` -- process evaluation can detect compounding before outcome failure
- `evaluation-dimensions-taxonomy.md` -- reliability/consistency dimension is directly affected by compounding
- `../04-trajectory-and-process-analysis/error-recovery-analysis.md` -- methods for evaluating recovery capabilities
- `../02-benchmark-ecosystem/swe-bench-deep-dive.md` -- how task complexity correlates with trajectory length in SWE-bench

## Further Reading

- "Scaling LLM Test-Time Compute Optimally Can Be More Effective Than Scaling Model Parameters" -- Snell et al., 2024
- "Tree of Thoughts: Deliberate Problem Solving with Large Language Models" -- Yao et al., 2023
- "On the Planning Abilities of Large Language Models" -- Valmeekam et al., 2023
- "Agent-as-a-Judge: Evaluate Agents with Agents" -- Zhuge et al., 2024
- "Error Analysis and Recovery in Multi-Step LLM Agent Trajectories" -- Workshop Paper, 2024
