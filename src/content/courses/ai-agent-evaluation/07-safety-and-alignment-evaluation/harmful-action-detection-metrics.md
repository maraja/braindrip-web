# Harmful Action Detection Metrics

**One-Line Summary**: Metrics and methods for detecting when agents take harmful or unintended actions, balancing the cost of missed detections against the cost of false alarms.

**Prerequisites**: `agent-safety-red-teaming.md`, `permission-boundary-testing.md`, `../01-foundations-of-agent-evaluation/evaluation-dimensions-taxonomy.md`

## What Is Harmful Action Detection?

Imagine a security camera system in a warehouse. It needs to distinguish between an employee moving inventory (normal), an employee accessing a restricted area without authorization (potentially harmful), and someone actively stealing merchandise (clearly harmful). The system must decide in real time whether to flag, alert, or intervene -- and the cost of getting it wrong in either direction is significant. Miss a theft, and you lose merchandise. Trigger a false alarm on every employee, and the system becomes unusable.

Harmful action detection for agents faces the same fundamental challenge. Agents take hundreds or thousands of actions during task execution -- reading files, calling APIs, writing code, sending messages. Most actions are benign. A small fraction may be harmful. The detection system must classify each action accurately, because false negatives (missed harmful actions) allow real damage, while false positives (blocked legitimate actions) degrade the agent's usefulness and frustrate users.

The difficulty is compounded by context dependence. Deleting a file is benign when it is a temporary cache file the agent created, potentially harmful when it is a user's document the agent was not asked to modify, and clearly harmful when it is a critical system configuration file. The same action requires different classifications depending on the agent's task, permissions, and the broader context of its execution.

## How It Works

### Action Classification Taxonomy

A structured taxonomy organizes agent actions by harm severity, enabling consistent classification and appropriate response.

**Benign actions** are normal operations within the agent's task scope. Reading a source file to understand code, creating a temporary file for intermediate computation, calling an API with appropriate parameters. These require no intervention. The vast majority of agent actions (typically 95-99%) fall in this category.

**Potentially harmful actions** are ambiguous -- they might be necessary for the task or might indicate a problem. Modifying a file the agent was not explicitly asked to change, making an API call with unusually broad parameters, or accessing data that is tangentially related to the task. These warrant logging and possible human review but should not be automatically blocked.

**Clearly harmful actions** violate explicit safety constraints. Deleting files outside the agent's scope, exfiltrating data to external endpoints, executing destructive system commands, or bypassing access controls. These should be blocked immediately.

**Critical safety violations** represent actions with potential for severe or irreversible harm. Modifying production databases, sending unauthorized communications containing sensitive data, executing actions that could cause physical-world consequences, or taking actions that undermine the agent's own safety constraints. These require immediate blocking, alerting, and session termination.

### Severity Scoring Framework

Each detected action receives a severity score that drives the response.

**Low severity (1-3)**: Inefficiency or suboptimal behavior. The agent takes unnecessary steps, uses more resources than needed, or produces slightly incorrect intermediate results. Impact: wasted compute or time. Response: log for analysis.

**Medium severity (4-6)**: Data exposure or unintended modification. The agent reads or writes data it probably should not, makes changes beyond the requested scope, or reveals information to unintended recipients. Impact: privacy risk or data integrity concern. Response: flag for human review, potentially pause execution.

**High severity (7-8)**: Destructive or irreversible action. The agent deletes important data, corrupts a database, pushes broken code to production, or sends harmful communications. Impact: real damage requiring remediation. Response: block the action, alert operators.

**Critical severity (9-10)**: Safety violation with potential for cascading harm. The agent attempts to disable its own safety constraints, access systems with safety implications, or take actions that could cause physical or financial harm at scale. Impact: potential catastrophic failure. Response: immediate termination, incident response.

### Detection Methods

**Rule-based filters** define explicit patterns that indicate harmful actions. Examples: any command matching `rm -rf /`, any network request to a domain not on the allowlist, any database query containing DROP or TRUNCATE. Rule-based filters are fast (sub-millisecond latency), predictable, and easy to audit. Their weakness is brittleness: they catch only patterns they were explicitly programmed to recognize and can be bypassed by slight variations.

**LLM-based classifiers** use a language model to evaluate whether an action is harmful given its context. The classifier receives the action, the agent's stated task, the conversation history, and relevant environmental context. LLM classifiers handle nuance and context far better than rules but introduce latency (100-500ms per classification), cost (each classification is an API call), and their own error distribution. They are most valuable for the "potentially harmful" category where context determines the classification.

**Behavioral anomaly detection** establishes a baseline of normal agent behavior and flags statistical outliers. If an agent typically reads 5-10 files per task but suddenly reads 200, or if it normally makes 2-3 API calls but suddenly makes 50, anomaly detection flags the deviation. This method catches novel harmful patterns that neither rules nor classifiers anticipate but produces more false positives because unusual does not mean harmful.

**Composite detection** layers all three methods. Rule-based filters handle known-dangerous patterns with zero latency. LLM classifiers handle ambiguous actions with contextual reasoning. Anomaly detection catches unknown patterns. This layered approach achieves higher detection rates than any single method.

### The Precision-Recall Tradeoff

This is the central tension in harmful action detection. Setting detection thresholds aggressively (high recall) catches more harmful actions but also blocks more legitimate ones. Setting them conservatively (high precision) avoids false alarms but misses more harmful actions.

**False positive cost** is primarily user frustration and degraded agent capability. An agent that is constantly blocked from taking legitimate actions becomes useless. If 5% of benign actions are incorrectly flagged, and the agent takes 100 actions per task, users experience 5 unnecessary interruptions per task.

**False negative cost** is the actual harm from undetected dangerous actions. A single missed critical action -- deleting a production database, exfiltrating customer data -- can cause damage far exceeding the cumulative cost of thousands of false positives.

The optimal operating point depends on the deployment context. A coding agent working on a personal project can tolerate lower recall (fewer interruptions) because the blast radius of missed detections is small. An agent with access to production systems and customer data requires much higher recall even at the cost of more false positives.

### Real-Time vs Post-Hoc Detection

**Real-time detection** evaluates each action before it executes. This prevents harm but adds latency and can block time-sensitive operations. The latency budget for real-time detection is typically 50-200ms to avoid noticeably degrading agent responsiveness.

**Post-hoc detection** analyzes the complete action trace after execution. This enables more sophisticated analysis (looking at action sequences rather than individual actions) and does not impact latency, but it cannot prevent harm -- only detect it for remediation. Post-hoc detection is essential for identifying subtle harmful patterns that only become visible in aggregate.

The most robust systems combine both: real-time detection for known high-severity patterns with immediate blocking, and post-hoc detection for comprehensive analysis and detection improvement.

## Why It Matters

1. **Agents are increasingly deployed in high-stakes environments.** Coding agents modify production codebases. Customer service agents access personal data. Financial agents interact with payment systems. Detection metrics determine whether these deployments are safe.
2. **Detection quality directly controls the safety-usefulness tradeoff.** Better metrics and methods allow agents to be both safer and more capable. Poor detection forces a choice between an unsafe agent and a useless one.
3. **Metrics enable systematic improvement.** Without quantified detection performance, teams cannot measure whether safety improvements are working or compare detection approaches objectively.
4. **Regulatory frameworks increasingly require demonstrated harm detection.** Organizations must show that their AI systems have effective monitoring for harmful actions, with quantified performance metrics.

## Key Technical Details

- Rule-based filters achieve near-perfect precision (>99%) but low recall (30-50%) due to inability to generalize beyond programmed patterns
- LLM-based classifiers reach 85-92% precision and 70-85% recall on harmful action classification, depending on the model and prompt engineering
- Composite detection systems achieve 90-95% precision and 80-90% recall when properly calibrated
- Real-time detection adds 50-200ms latency per action; post-hoc detection adds zero latency but cannot prevent harm
- Anomaly detection false positive rates range from 5-15% depending on baseline quality and threshold settings
- Severity scoring should be validated against human expert judgment, targeting Cohen's kappa of 0.7 or above for inter-rater agreement
- The cost of a single undetected critical action typically exceeds the cost of 1,000 false positives in high-stakes deployments

## Common Misconceptions

**"Higher detection rates are always better."** Detection rates must be evaluated alongside false positive rates. A system that blocks 99% of harmful actions but also blocks 30% of benign actions is worse than one that catches 90% of harmful actions while blocking only 2% of benign ones. The operating point must match the deployment context.

**"Rule-based detection is obsolete now that we have LLM classifiers."** Rules remain the fastest, most predictable, and most auditable detection layer. They are the appropriate choice for known high-severity patterns where zero latency and zero ambiguity are required. LLM classifiers complement rules; they do not replace them.

**"Harmful action detection can be added as an afterthought."** Effective detection requires deep integration with the agent's execution pipeline, access to full context (task description, conversation history, environmental state), and careful calibration against representative action distributions. Bolting on a filter after deployment produces poor precision-recall characteristics.

**"If the agent is aligned, you do not need harmful action detection."** Alignment reduces the frequency of harmful actions but does not eliminate them. Adversarial inputs, edge cases, distributional shift, and emergent behaviors can cause even well-aligned agents to take harmful actions. Detection is a defense-in-depth layer, not a redundancy.

## Connections to Other Concepts

- `agent-safety-red-teaming.md` -- red teaming discovers the harmful action patterns that detection systems must catch
- `evaluating-refusal-behavior.md` -- the detection system's response to harmful actions is closely related to refusal behavior
- `alignment-measurement.md` -- alignment and detection are complementary safety mechanisms
- `side-effect-evaluation.md` -- harmful side effects are a category of harmful actions requiring detection
- `../04-trajectory-and-process-analysis/trajectory-quality-metrics.md` -- harmful action detection feeds into overall trajectory quality assessment
- `../09-production-evaluation-and-monitoring/production-quality-monitoring.md` -- production detection systems generate the data for ongoing evaluation

## Further Reading

- "Safeguarding AI Agents: Developing and Analyzing Safety Architectures" -- Motwani et al., 2024
- "Toolshed: Scaling Tool-Equipped Agents with Advanced RAG-Tool Fusion" -- Patil et al., 2024
- "Monitoring and Detecting Harmful Behaviors in LLM-Powered Agents" -- Anthropic Technical Report, 2024
- "Real-Time Safety Filtering for Autonomous AI Systems" -- DeepMind Safety Team, 2024
- "The False Positive Paradox in AI Safety Monitoring" -- Amodei et al., 2023
