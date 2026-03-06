# Long-Horizon Task Evaluation

**One-Line Summary**: Evaluating tasks that span hours, days, or weeks requires fundamentally different approaches than short-task benchmarks, including milestone-based progress measurement, context persistence strategies, and principled handling of environmental change.

**Prerequisites**: `../01-foundations-of-agent-evaluation/what-makes-agent-evaluation-hard.md`, `../04-trajectory-and-process-analysis/trajectory-evaluation-methods.md`, `../06-cost-quality-latency-tradeoffs/cost-aware-evaluation-frameworks.md`

## What Is Long-Horizon Task Evaluation?

Consider the difference between evaluating a sprinter and a marathon runner. For the sprinter, you need a stopwatch and a finish line. For the marathon runner, you need intermediate checkpoints, pacing analysis, nutrition strategy assessment, injury monitoring, and adaptation to changing weather conditions. The finish time alone tells you very little about the quality of the run. Long-horizon task evaluation is the marathon problem applied to AI agents.

Most current agent benchmarks test tasks completable in seconds to minutes: answer a question, write a function, navigate a website. But the highest-value agent applications involve tasks spanning much longer timeframes -- conducting a multi-day research project, maintaining a codebase over weeks, monitoring a system for anomalies over months. These long-horizon tasks introduce evaluation challenges that short-task benchmarks simply do not face.

The gap between what we can evaluate and what we want agents to do is one of the largest open problems in the field. An agent might score 90% on SWE-bench (tasks completable in minutes) yet fail catastrophically on a week-long development project. Until we solve long-horizon evaluation, we are flying blind on the tasks that matter most.

## How It Works

### Challenges Unique to Long-Horizon Evaluation

**Context persistence across sessions.** Long tasks inevitably span multiple agent invocations. Between sessions, the agent must maintain relevant context: what has been accomplished, what approaches were tried, what remains to be done. Evaluating context persistence requires measuring: does the agent correctly recall prior work? Does it avoid repeating failed approaches? Does it maintain consistent goals across sessions? Current LLM agents lose 30-60% of task-relevant context across session boundaries, even with explicit memory systems.

**Measuring intermediate progress.** For a task that takes days, waiting for the final outcome before evaluating wastes enormous resources. But measuring intermediate progress is harder than it sounds. How do you quantify "making progress on a research paper" after day two of a five-day effort? Partial completion metrics must balance sensitivity (detecting real progress) against noise (not rewarding activity that looks like progress but is not).

**Environmental change during execution.** In a week-long task, the environment changes. Dependencies update, new information becomes available, requirements shift, other actors modify shared resources. The agent must adapt. Evaluation must distinguish between failures caused by the agent's inability and failures caused by environmental changes that would challenge any agent. This requires counterfactual reasoning: would the agent have succeeded had the environment remained static?

**Knowing when to stop.** Long-horizon tasks often lack clear termination conditions. When is a research project "done"? When is a codebase "clean enough"? Evaluating the agent's stopping decision is itself a challenge. Stopping too early wastes the investment of prior work; stopping too late wastes resources on diminishing returns.

### Milestone-Based Evaluation

The most practical current approach defines intermediate milestones and evaluates progress toward each. A well-designed milestone framework has the following properties:

**Hierarchical decomposition.** Break the task into phases, phases into milestones, milestones into checkpoints. For a research project: Phase 1 (Literature Review) might have milestones for identifying key papers, synthesizing themes, and identifying gaps. Each milestone has checkpoints: "at least 20 relevant papers identified," "three major themes articulated."

**Partial credit scoring.** Rather than binary pass/fail, each milestone awards partial credit based on completeness and quality. A milestone 70% complete is better than 0% complete, and the evaluation should reflect this. Weighted scoring allows higher-value milestones to count more.

**Dependency-aware ordering.** Some milestones depend on others. Evaluation should credit an agent that completes prerequisite milestones before dependent ones, rather than one that cherry-picks easy milestones out of order.

### Exploration-Exploitation Tradeoff

Long-horizon tasks introduce a strategic dimension absent from short tasks: the agent must decide when to explore new approaches versus exploit known good approaches. Early in a task, exploration is valuable -- trying different strategies to find what works. Late in a task, exploitation is optimal -- refining the best approach found so far.

Evaluating this tradeoff requires measuring: does the agent's exploration rate decrease over time (as it should)? Does the agent abandon failing strategies quickly enough? Does the agent over-commit to the first approach that shows promise? Optimal exploration-exploitation balance depends on the task horizon (how much time remains) and the variance of available strategies.

### Resource Management Over Extended Periods

Long-horizon tasks have budgets: API calls, compute time, token usage, financial cost. An agent that achieves 95% quality while spending 10x the necessary resources is poorly evaluated by outcome-only metrics. Long-horizon evaluation must track:

- **Cumulative cost curves**: how does spending relate to progress over time?
- **Efficiency milestones**: at what cost level was each milestone achieved?
- **Resource pacing**: does the agent budget appropriately, or does it burn resources early and starve later phases?
- **Diminishing returns detection**: does the agent recognize when additional effort produces negligible improvement?

## Why It Matters

1. **The highest-value agent applications are long-horizon.** Research, software development, project management, and monitoring all span extended periods. Short-task benchmarks provide no signal about whether agents can handle these applications.

2. **Long-horizon failure modes are qualitatively different.** Short tasks fail through incorrect answers. Long tasks fail through goal drift, context loss, resource exhaustion, and inability to adapt. These failure modes are invisible to short-task evaluation.

3. **Economic viability depends on long-horizon capability.** An agent that requires human intervention every 30 minutes provides less value than one that works autonomously for days. Evaluating long-horizon autonomy is essential for assessing economic impact.

4. **Current benchmarks create a misleading capability picture.** An agent scoring well on minute-scale benchmarks may be fundamentally incapable of hour-scale or day-scale tasks. Without long-horizon evaluation, deployment decisions are based on irrelevant evidence.

## Key Technical Details

- Current state-of-the-art: most published benchmarks test tasks completable in under 10 minutes; fewer than 5% of benchmarks in agent evaluation literature test tasks exceeding 1 hour
- Context loss across session boundaries: agents retain 40-70% of task-relevant information when using explicit memory systems, dropping to 15-30% without structured memory
- Milestone-based evaluation requires 3-5x more evaluation design effort than outcome-only evaluation, but provides 10-20x more diagnostic information
- The exploration-exploitation tradeoff becomes measurable only for tasks with horizons exceeding approximately 20 decision steps, below which there is insufficient time for strategic allocation
- Resource efficiency variance increases dramatically with task length: coefficient of variation for cost-per-quality is 0.2-0.3 for 10-minute tasks but 0.6-1.0 for multi-hour tasks
- Environmental change rate in realistic settings: software dependencies change at a rate of 2-5 relevant updates per week; information environments change faster

## Common Misconceptions

**"Long-horizon evaluation is just short-horizon evaluation repeated many times."** This fundamentally misunderstands the challenge. Long-horizon tasks have emergent properties -- context management, strategic planning, resource allocation, adaptation -- that do not appear in any number of short-task repetitions. Evaluating 100 five-minute tasks tells you nothing about one eight-hour task.

**"Milestone-based evaluation solves the long-horizon problem."** Milestones help, but they introduce their own challenges: defining good milestones requires domain expertise, milestones may not cover all aspects of task quality, and agents can game milestone metrics (optimizing for checkpoints rather than overall task success). Milestones are a necessary tool, not a complete solution.

**"If an agent can plan well, it can handle long-horizon tasks."** Planning is necessary but insufficient. Long-horizon execution requires replanning (adapting to unexpected results), context management (maintaining relevant information), and resource management (budgeting over time). Many agents that generate excellent initial plans fail during multi-step execution.

**"We should just wait until agents are more capable before tackling long-horizon evaluation."** This creates a chicken-and-egg problem. Without evaluation, we cannot measure progress toward long-horizon capability, and without measurement, we cannot systematically improve. Building evaluation frameworks now -- even imperfect ones -- enables the feedback loop that drives improvement.

## Connections to Other Concepts

- `evaluation-for-learning-agents.md` -- agents that learn during long-horizon tasks combine two open problems: the task context changes and the agent's capabilities change simultaneously
- `the-evaluation-scaling-problem.md` -- long-horizon tasks are among the first where agent work exceeds human ability to fully review, making scalable oversight critical
- `../04-trajectory-and-process-analysis/trajectory-evaluation-methods.md` -- trajectory analysis provides tools for evaluating the process of long-horizon execution, not just outcomes
- `../06-cost-quality-latency-tradeoffs/cost-aware-evaluation-frameworks.md` -- resource management over extended periods directly connects to cost-aware evaluation
- `../09-production-evaluation-and-monitoring/drift-detection-and-regression-testing.md` -- long-horizon tasks in production require continuous monitoring for drift in agent behavior over time

## Further Reading

- "SUPER: Evaluating Agents on Setting Up and Executing Tasks from Research Repositories" -- Bogin et al., 2024
- "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" -- Jimenez et al., 2024
- "Measuring Progress in Long-Horizon AI Tasks: A Milestone Framework" -- Chen et al., 2024
- "Planning and Acting in Stochastic Domains: The Long-Horizon Challenge" -- Kaelbling and Lozano-Perez, 2023
- "RE-Bench: Evaluating Frontier AI R&D Capabilities of Language Model Agents Against Human Experts" -- Wijk et al., 2024
