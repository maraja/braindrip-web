# A/B Testing for Agents

**One-Line Summary**: A/B testing for AI agents compares agent versions on live traffic through controlled experiments, but requires larger sample sizes and longer durations than traditional A/B tests due to agent non-determinism and high output variance.

**Prerequisites**: `online-vs-offline-evaluation.md`, `../05-statistical-methods-for-evaluation/sample-size-and-power-analysis.md`, `../05-statistical-methods-for-evaluation/confidence-intervals-for-agent-metrics.md`

## What Is A/B Testing for Agents?

Consider a restaurant that wants to test a new menu. They cannot just ask people hypothetically which menu they prefer -- they need to serve both menus to real diners and measure actual outcomes: how much people order, how often they return, how they rate their experience. A/B testing for agents works the same way: real users interact with different agent versions, and real behavioral outcomes determine which version is better.

A/B testing (also called split testing or controlled experimentation) randomly assigns users or sessions to one of two or more agent variants and compares outcomes under identical production conditions. Unlike offline evaluation, which tests against curated scenarios, A/B testing captures the full complexity of production interactions -- real user intent distributions, real conversation dynamics, and real downstream consequences.

The fundamental challenge is that agent systems are far noisier than the web applications where A/B testing originated. When testing two colors of a "Buy" button, the outcome (click or no click) has low variance. When testing two agent versions, the outcome (task completion, user satisfaction, conversation quality) has extremely high variance due to the diversity of user requests and the non-determinism of LLM-based responses. This noise demands careful experimental design.

## How It Works

### Traffic Splitting

The foundation of any A/B test is random assignment. Users (or sessions, for anonymous systems) are assigned to agent variants through a hashing function applied to a stable identifier. Common approaches:

- **User-level assignment**: Hash the user ID to determine variant. Ensures a consistent experience across sessions. Preferred when evaluating multi-session behaviors like retention.
- **Session-level assignment**: Hash the session ID. Allows faster data accumulation but may confuse users who get different agent behavior between sessions.
- **Request-level assignment**: Hash individual requests. Maximum data efficiency but creates an inconsistent user experience. Only suitable for single-turn, stateless interactions.

A typical split is 50/50 for maximum statistical power, but asymmetric splits (90/10 or 95/5) are common when the new version carries risk. A 95/5 split limits exposure while still collecting meaningful data, though it requires 4-5x longer to reach the same statistical power as a 50/50 split.

### Metric Selection

Choosing the right metrics is often harder than running the experiment itself. A well-designed agent A/B test tracks three categories of metrics.

**Primary metrics** are what you are trying to improve. Examples: task completion rate, user satisfaction score (collected via feedback), quality score from LLM-as-judge evaluation on sampled interactions. Choose 1-2 primary metrics to avoid multiple comparison problems.

**Guardrail metrics** are what you are trying not to break. Examples: safety violation rate, mean response latency, cost per interaction, error rate, escalation rate to human support. Guardrail metrics have one-sided thresholds -- you accept the new version only if guardrails do not degrade beyond a predefined tolerance (e.g., latency must not increase by more than 10%).

**Diagnostic metrics** help explain results but are not used for decision-making. Examples: average number of tool calls per interaction, conversation length distribution, specific capability scores. If the primary metric moves, diagnostic metrics help you understand why.

### Duration Calculation

How long must an experiment run? The answer depends on four factors: the minimum detectable effect (MDE) you care about, the variance of your primary metric, the traffic volume, and your desired statistical significance and power.

For a binary metric (e.g., task completion rate) with baseline rate p = 0.70 and desired MDE of 3 percentage points (detecting a shift from 70% to 73%), at alpha = 0.05 and power = 0.80, a standard power calculation yields approximately 3,200 samples per variant. At 1,000 interactions per day with a 50/50 split, this requires about 6.4 days.

However, agent non-determinism inflates variance substantially. The same user query might succeed on one attempt and fail on another, injecting noise that does not exist in deterministic systems. Empirically, agent A/B tests require 2-3x the sample size calculated from standard formulas. The 6.4-day estimate above becomes 13-19 days in practice.

A common minimum duration rule: never conclude an experiment in less than one full week, regardless of sample size, to capture day-of-week effects in user behavior.

### Sequential Testing

Waiting weeks for results is painful. Sequential testing methods allow you to monitor accumulating data and stop early if results are conclusive, without inflating false positive rates.

**Group sequential designs** pre-specify interim analysis points (e.g., at 25%, 50%, 75% of target sample size) with adjusted significance thresholds (O'Brien-Fleming or Pocock boundaries). If the effect is large and clear, you can stop at the first interim analysis.

**Always-valid confidence sequences** provide confidence intervals that are valid at every point in time, not just at pre-specified checkpoints. These are particularly well-suited to agent experiments where you want continuous monitoring without predetermined stopping points. The tradeoff is slightly wider confidence intervals compared to fixed-horizon tests.

### Statistical Challenges Unique to Agents

**High variance**: Agent outputs vary dramatically across the spectrum of user intents. A coding agent might achieve 90% success on simple tasks and 20% on complex ones. If the new version improves complex task handling but traffic is dominated by simple tasks, the signal is drowned in noise. Stratified analysis by task difficulty is essential.

**Non-stationarity**: User behavior shifts during an experiment. Early adopters of a new agent feature behave differently from later users. Novelty effects can inflate initial quality scores. Always check for time trends in your metric before declaring a winner.

**Interaction effects and feedback loops**: If agent version B provides better answers, users may ask harder questions over time, which could paradoxically lower B's measured success rate. This dynamic coupling between agent quality and user behavior does not exist in traditional A/B testing and can lead to seriously misleading results in long-running experiments.

**Carryover effects**: In multi-session experiments, a user's experience with version A in session 1 may affect their behavior with version B in session 2 (if using session-level randomization). User-level randomization avoids this but reduces effective sample size.

## Why It Matters

1. **Causal evidence beats correlational analysis**: A/B testing is the only production evaluation method that establishes causation. Monitoring can show that quality changed; only A/B testing can prove that a specific agent change caused the improvement.

2. **Prevents shipping regressions disguised as improvements**: An agent change might improve average quality while degrading performance for a critical minority of use cases. A/B testing with guardrail metrics catches this before full rollout.

3. **Quantifies the value of changes**: Beyond "better or worse," A/B testing measures how much better. Knowing that version B improves task completion by 4.2 +/- 1.1 percentage points enables rational prioritization of engineering effort.

4. **Builds organizational confidence in agent changes**: When stakeholders see rigorous experimental evidence, they trust deployment decisions. Without A/B testing, agent updates rely on intuition and offline metrics that may not reflect production impact.

## Key Technical Details

- Minimum sample sizes for agent A/B tests are typically 2-3x larger than standard power calculations suggest, due to LLM non-determinism
- Use user-level randomization for multi-turn agents to avoid inconsistent experiences; session-level only for single-turn stateless systems
- Always run experiments for at least 7 days to capture weekly seasonality, regardless of when statistical significance is reached
- Apply Bonferroni or Benjamini-Hochberg correction when testing multiple primary metrics simultaneously
- Log the full agent trace (not just final output) for every experimental interaction to enable post-hoc diagnostic analysis
- Implement automated guardrail checks that halt experiments if safety metrics degrade beyond pre-specified thresholds
- Consider variance reduction techniques like CUPED (Controlled-experiment Using Pre-Experiment Data) to increase sensitivity by 20-50%

## Common Misconceptions

**"We can just compare this week's metrics to last week's."** Before-after comparisons confound the agent change with every other change that occurred (traffic patterns, user demographics, external events). Only randomized assignment isolates the effect of the agent change itself.

**"Statistical significance means the result matters."** A statistically significant 0.1 percentage point improvement in task completion is real but possibly not worth the added complexity of the new version. Always pair significance testing with a practical significance threshold -- the minimum improvement that justifies deployment.

**"We need to A/B test every change."** A/B testing is expensive in time and organizational attention. Reserve it for changes where the direction of impact is uncertain or the stakes are high. Clear bug fixes and unambiguous improvements can ship with offline evaluation and monitoring alone.

**"More variants means faster learning."** Running A/B/C/D tests with four variants divides traffic four ways, requiring 4x the duration of a two-variant test to reach equivalent power. Unless you have very high traffic, stick to two variants (control and treatment).

## Connections to Other Concepts

- `online-vs-offline-evaluation.md` positions A/B testing within the broader evaluation strategy
- `production-quality-monitoring.md` provides the metric infrastructure that A/B tests depend on
- `user-feedback-as-evaluation-signal.md` describes feedback signals commonly used as A/B test metrics
- `../05-statistical-methods-for-evaluation/sample-size-and-power-analysis.md` covers the statistical foundations of experiment sizing
- `../05-statistical-methods-for-evaluation/confidence-intervals-for-agent-metrics.md` details how to report experimental results with appropriate uncertainty
- `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md` explains the non-determinism that makes agent A/B testing uniquely challenging

## Further Reading

- "Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing" -- Kohavi, Tang, and Xu, 2020
- "A/B Testing Intuition Busters" -- Kohavi et al., 2022
- "Always Valid Inference: Continuous Monitoring of A/B Tests" -- Johari et al., 2017
- "Peeking at A/B Tests: Why It Matters, and What to Do About It" -- Johari et al., 2017
- "Improving the Sensitivity of Online Controlled Experiments with CUPED" -- Deng et al., 2013
