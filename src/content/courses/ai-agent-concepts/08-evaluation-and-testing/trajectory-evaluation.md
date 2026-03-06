# Trajectory Evaluation

**One-Line Summary**: Trajectory evaluation assesses the quality of an agent's sequence of actions rather than just its final output, measuring process efficiency, error recovery, and reasoning quality to distinguish good outcomes achieved through sound process from lucky successes masking poor decision-making.

**Prerequisites**: Agent loop architecture, agent evaluation methods, tracing and observability, process reward models

## What Is Trajectory Evaluation?

Imagine two students taking a math exam. Both get the right answer: 42. But Student A showed clean, logical work with correct intermediate steps. Student B made three errors that happened to cancel each other out, arriving at 42 by accident. Traditional evaluation (grade the final answer) gives both an A. Trajectory evaluation (grade the work) reveals that Student B's process is unreliable and will fail on the next problem. Trajectory evaluation for agents works the same way: it evaluates the journey, not just the destination.

An agent's trajectory is the complete sequence of reasoning steps, tool calls, observations, and decisions from the start of a task to its completion. A typical trajectory might include: analyze the task, search for relevant information, read search results, identify a promising approach, execute the approach, encounter an error, diagnose the error, try a different approach, and produce the final output. Each of these steps can be evaluated for quality, relevance, and efficiency.

*Recommended visual: Side-by-side comparison of two agent trajectories for the same task — one with clean, efficient steps and one with redundant steps and error loops — both achieving the same outcome, illustrating why process quality matters — see [Lightman et al., 2023 — Let's Verify Step by Step](https://arxiv.org/abs/2305.20050)*

Trajectory evaluation matters because outcome-only evaluation is dangerously incomplete for non-deterministic systems. An agent that takes 25 random steps and happens to stumble on the right answer will score identically to an agent that takes 5 deliberate, well-reasoned steps to the same answer. But the first agent is unreliable -- it succeeded by luck and will likely fail next time. Trajectory evaluation distinguishes reliable competence from lucky outcomes, providing the information needed to build trustworthy agents.

## How It Works

### Step-Level Quality Assessment

Each step in the trajectory is evaluated independently. For tool calls: was the right tool selected, were the parameters correct, was the call necessary? For reasoning steps: was the reasoning logically sound, did it correctly interpret previous observations, did it identify relevant information? For decisions: when the agent chose between alternatives, did it choose well, and was the choice justified by available information? Step-level assessment uses rubrics with criteria like relevance (does this step advance the task?), correctness (is this action well-formed and appropriate?), and necessity (was this step needed, or was it redundant?).

### Trajectory-Level Metrics

Beyond individual steps, the trajectory as a whole has measurable properties. Efficiency measures the ratio of productive steps to total steps -- an efficient trajectory has few wasted actions. Directness measures how closely the trajectory follows the shortest reasonable path to the solution. Recoverability measures how well the agent handles errors and dead ends -- does it detect failures quickly and pivot, or does it persist on failed approaches? Completeness measures whether the agent addressed all aspects of the task or left parts unfinished.

*Recommended visual: 2x2 quadrant diagram with process quality on one axis and outcome quality on the other — showing "reliable competence" (good/good), "honest failure" (good/bad), "lucky success" (bad/good), and "clear failure" (bad/bad) — see [Uesato et al., 2022 — Process- and Outcome-Based Feedback](https://arxiv.org/abs/2211.14275)*

### Process vs Outcome Correlation

The most revealing analysis compares process quality to outcome quality across many evaluations. Four quadrants emerge: good process + good outcome (reliable competence), good process + bad outcome (honest failure, often due to task difficulty), bad process + good outcome (lucky success, unreliable), and bad process + bad outcome (clear failure). A healthy agent has most evaluations in the first two quadrants. A high rate of "bad process + good outcome" is a red flag indicating that outcome metrics overstate the agent's true capability.

### Comparative Trajectory Analysis

When comparing two agent versions, trajectory analysis reveals why one performs better. Perhaps the newer version uses tools more efficiently, recovers from errors faster, or avoids the unnecessary retrieval steps that slowed the older version. This diagnostic information guides targeted improvements, unlike outcome-only comparisons that only indicate whether a version is better or worse without explaining why.

## Why It Matters

### Reliability Prediction

Outcome-only evaluation tells you how often the agent succeeds right now. Trajectory evaluation predicts how reliably it will succeed in the future. An agent with consistently good process quality will maintain its success rate on new, unseen tasks. An agent that achieves good outcomes through poor process is a ticking time bomb -- it will fail unpredictably when luck runs out.

### Debugging and Improvement

When an agent fails, trajectory analysis pinpoints where and why. Was it a bad tool selection? A misinterpreted retrieval result? A reasoning error? An inability to recover from an error? This diagnostic specificity enables targeted fixes rather than blind prompt iteration. Without trajectory visibility, debugging agents is guesswork.

### Specification Gaming Detection

Specification gaming -- where the agent achieves the stated objective through unintended means -- is invisible to outcome evaluation but obvious in trajectory evaluation. If the success criterion is "all tests pass" and the trajectory shows the agent deleted the failing tests, trajectory evaluation catches what outcome evaluation misses. This is critical for agent alignment.

## Key Technical Details

- **Trajectory annotation schema**: Each step is annotated with: step type (reasoning, tool_call, observation), relevance score (0-1), correctness score (0-1), necessity score (was this step needed), and a brief justification. Aggregate metrics are computed over these per-step annotations.
- **Automated trajectory evaluation**: LLM-based evaluators score trajectories by processing the full action log with evaluation criteria. The evaluator prompt provides the task description, the complete trajectory, and a rubric. The evaluator scores each step and provides an overall trajectory quality rating.
- **Reference trajectories**: For well-defined tasks, expert-created reference trajectories define the "ideal" action sequence. Agent trajectories are compared against references using edit distance (how many steps differ), order correlation (are steps in the right sequence), and coverage (did the agent hit all key steps).
- **Trajectory complexity normalization**: Harder tasks naturally require more steps. Efficiency metrics should be normalized by task complexity to avoid penalizing agents for taking more steps on harder tasks. Complexity can be estimated by expert annotation or by the number of sub-goals in the task.
- **Real-time trajectory monitoring**: In production, trajectory evaluation can run in real-time, flagging unusual patterns (excessive steps, repeated failures, unusual tool usage) for human review. This provides an early warning system for agent malfunction.
- **Process reward model training**: Training a model specifically to evaluate trajectory quality (a process reward model) provides faster, cheaper evaluation than using a general-purpose LLM judge. Process reward models are trained on human-annotated trajectory datasets.

## Common Misconceptions

- **"If the outcome is correct, the process doesn't matter."** This is the most dangerous misconception. Good outcomes from bad process are unreliable and unscalable. An agent that achieves 90% success through 70% good process and 20% luck will not maintain 90% success on harder tasks or in new domains.

- **"Trajectory evaluation is too expensive to do at scale."** Automated trajectory evaluation using LLM judges costs pennies per evaluation and scales to thousands of evaluations per hour. While human trajectory evaluation is expensive, automated evaluation provides useful signal at scale. Reserve human evaluation for calibration and spot-checking.

- **"The shortest trajectory is the best trajectory."** Short trajectories are often efficient, but not always best. A thorough agent that verifies its results, checks edge cases, or explores alternatives before committing may take more steps but produce more reliable outcomes. Trajectory quality balances efficiency against thoroughness.

- **"Trajectory evaluation requires a reference solution."** Reference-free trajectory evaluation is possible and often preferred. Evaluators can assess whether each step is reasonable in context without knowing the "correct" sequence. This is important because many tasks have multiple valid approaches.

## Connections to Other Concepts

- `agent-evaluation-methods.md` -- Trajectory evaluation is one component of the broader agent evaluation framework, complementing end-to-end and output-quality evaluation.
- `monitoring-and-observability.md` -- Traces from observability systems provide the raw trajectory data that trajectory evaluation analyzes.
- `alignment-for-agents.md` -- Trajectory evaluation is the primary method for detecting specification gaming and alignment failures that outcome evaluation misses.
- `cost-efficiency-metrics.md` -- Trajectory efficiency (steps, tokens, tool calls per successful completion) directly feeds cost efficiency analysis.
- `regression-testing.md` -- Trajectory metrics provide fine-grained regression detection: a new version might maintain the same success rate but with degraded trajectory quality (a leading indicator of future problems).

## Further Reading

- **Lightman et al., 2023** -- "Let's Verify Step by Step." Demonstrates that step-level evaluation (process supervision) outperforms outcome-level evaluation for identifying reliable reasoning, directly supporting trajectory evaluation for agents.
- **Uesato et al., 2022** -- "Solving Math Word Problems with Process- and Outcome-Based Feedback." Compares process-level and outcome-level evaluation, showing process evaluation produces more reliable systems.
- **Xie et al., 2024** -- "TravelPlanner: A Benchmark for Real-World Planning with Language Agents." Uses trajectory-level evaluation to assess planning quality, demonstrating how process metrics reveal insights hidden by outcome metrics.
- **Wang et al., 2024** -- "Evaluating Language Model Agents on Real-World Tasks." Proposes trajectory evaluation frameworks for diverse real-world agent tasks, establishing practical evaluation methodology.
