# Human-Agent Collaboration Evaluation

**One-Line Summary**: Evaluating human-agent teamwork requires measuring joint performance, handoff quality, shared understanding, and trust calibration -- metrics that neither human-only nor agent-only evaluation frameworks can capture.

**Prerequisites**: `../01-foundations-of-agent-evaluation/what-makes-agent-evaluation-hard.md`, `multi-agent-evaluation-theory.md`, `../03-automated-evaluation-methods/llm-as-judge.md`

## What Is Human-Agent Collaboration Evaluation?

Consider a pilot and an autopilot system. Evaluating the autopilot alone tells you how well it flies in isolation. Evaluating the pilot alone tells you how well they fly manually. Neither evaluation tells you the most important thing: how well do they work together? Does the pilot understand what the autopilot is doing? Does the autopilot clearly communicate its state? When the pilot takes over, is the transition smooth? Does the human-autopilot team outperform either alone? These are collaboration evaluation questions.

Human-agent collaboration is the dominant deployment model for AI agents today. Pure autonomy remains rare in high-stakes settings; instead, humans and agents work together -- the human provides strategic direction, reviews critical decisions, and handles edge cases, while the agent handles routine execution, information gathering, and draft generation. Yet most evaluation frameworks measure the agent in isolation, as if the human were not part of the system.

This gap matters because the quality of collaboration often determines the quality of outcomes more than the capability of either party alone. A brilliant agent paired with a confused human produces worse outcomes than a mediocre agent paired with a human who understands the collaboration model. Evaluation must capture the team, not just the components.

## How It Works

### Joint Performance Metrics

The foundational metric compares three baselines:

**Performance uplift.** Compare joint human-agent performance against human-only and agent-only baselines on identical tasks. The collaboration is valuable if: Performance(human+agent) > max(Performance(human), Performance(agent)). This condition -- superadditive performance -- is not guaranteed. In some configurations, the agent creates overhead that makes the team perform worse than the human alone.

Current empirical data shows mixed results. For coding tasks, human-agent collaboration produces 20-40% performance uplift over human-only baselines for mid-level developers. For expert developers, the uplift drops to 5-15%, and in some cases collaboration introduces negative value due to the cost of reviewing agent-generated code. For research tasks, the pattern is similar: agents provide the most uplift for moderate-expertise humans.

**Efficiency metrics.** Beyond raw performance, collaboration affects speed and resource use. Time-to-completion for human-agent teams vs. human-only teams. Effective throughput (tasks completed per unit time) accounting for review and correction overhead. Cost efficiency (total cost per quality-adjusted output).

### Handoff Quality

The transitions between human work and agent work are critical failure points. Handoff quality measures:

**Context transfer completeness.** When the human hands off to the agent, does the agent understand the current state, goals, and constraints? When the agent hands back to the human, does the human understand what was accomplished and what decisions were made? Measured by having the receiving party summarize their understanding and comparing against ground truth.

**Transition smoothness.** Abrupt handoffs create discontinuities in the work product. Smooth handoffs maintain consistency in style, approach, and quality. Measured by blind evaluators rating the coherence of the final product -- work products with poor handoffs show detectable seams.

**Error propagation at boundaries.** Errors made by one party before handoff are often compounded by the other party after handoff, because the receiving party assumes prior work is correct. Measuring error propagation across handoff boundaries quantifies how well each party validates the other's work.

### Shared Mental Model

A shared mental model means both human and agent have compatible understanding of: the current task state, the division of responsibilities, each other's capabilities, and the plan going forward.

**Mutual understanding accuracy.** Ask the human: "What is the agent doing and why?" Ask the agent (via probing prompts): "What has the human done and what do they expect next?" Compare both answers to ground truth. Current human-agent teams show mutual understanding accuracy of 50-70%, meaning significant misalignment is the norm.

**Expectation alignment.** Does the human expect the agent to do X while the agent plans to do Y? Misaligned expectations cause wasted effort and frustration. Measured by independently eliciting expectations from both parties before interaction and comparing them.

**Communication effectiveness.** When the agent explains its reasoning, does the human correctly understand it? When the human provides instructions, does the agent correctly interpret them? Communication effectiveness can be measured through comprehension tests after exchanges.

### Trust Calibration

Trust calibration -- trusting the agent the right amount -- is among the most important and difficult aspects of collaboration evaluation.

**Over-trust (automation bias).** The human accepts agent outputs without adequate review. Over-trust is measured by: rate of undetected agent errors when human review is the last line of defense. Studies show automation bias rates of 20-40% in human-agent coding collaborations -- humans accept 20-40% of agent errors without detection.

**Under-trust.** The human wastes time re-doing work the agent has done correctly. Under-trust is measured by: rate of correct agent outputs that the human unnecessarily modifies or rejects. Under-trust rates of 15-30% are common, representing significant efficiency loss.

**Calibrated trust.** The ideal state: the human trusts the agent's output proportionally to its actual reliability. Calibration is measured by plotting the human's acceptance rate against the agent's actual accuracy across different task types and difficulty levels. Perfect calibration is a 45-degree line; over-trust appears as acceptance > accuracy, and under-trust as acceptance < accuracy.

### The Centaur Model

The Centaur model -- named after chess centaurs (human-computer teams) -- proposes a division: human strategic oversight with agent tactical execution. Evaluating this model requires:

**Strategic quality.** Does the human make good high-level decisions about goals, priorities, and approach? Measured independently of execution quality.

**Tactical quality.** Does the agent execute the human's strategy effectively? Measured conditional on the strategy being correct.

**Strategy-execution alignment.** Does the agent's execution actually follow the human's strategy, or does it diverge? Measured by comparing the agent's actions against the human's stated intentions.

### Evaluation Design: Controlled Studies

Rigorous human-agent collaboration evaluation requires controlled experiments with real human participants:

**Within-subjects design.** Each participant completes tasks in three conditions: human-only, agent-only (with human judging final output), and human-agent collaboration. This controls for individual differences in human capability.

**Task stratification.** Include tasks at multiple difficulty levels and from multiple domains to avoid confounding collaboration quality with task-specific factors.

**Cognitive load measurement.** Use validated instruments (NASA-TLX, dual-task paradigms) to measure whether the agent reduces or increases the human's mental burden. A collaboration that improves output quality but doubles cognitive load may not be sustainable.

**Longitudinal design.** Evaluate the same human-agent pairs over extended periods. Collaboration quality typically improves as the human learns the agent's strengths and weaknesses (calibration improves), but can also degrade as complacency sets in (over-trust increases).

## Why It Matters

1. **Collaboration is the deployment reality.** Most production AI agents work with humans, not instead of humans. Evaluating agents in isolation fails to measure the most common use case.

2. **Collaboration quality determines ROI.** An agent that technically performs well but creates overhead for its human collaborator may have negative economic value. Collaboration evaluation captures this.

3. **Trust calibration is a safety issue.** Over-trust leads to undetected errors in critical systems. Under-trust leads to humans ignoring valuable agent contributions. Both failure modes have real consequences.

4. **Human factors drive adoption.** Agents that are technically capable but frustrating to work with will not be adopted. Collaboration evaluation captures usability dimensions that capability benchmarks miss.

## Key Technical Details

- Controlled human-agent collaboration studies require a minimum of 20-30 participants per condition for statistical power, making them expensive relative to automated benchmarks
- Trust calibration typically requires 50-100 interactions to stabilize, meaning short evaluation sessions measure initial trust rather than calibrated trust
- Automation bias rates are higher for time-pressured tasks (30-50%) than for unpressured tasks (15-25%), indicating that evaluation conditions strongly influence results
- Cognitive load measurements show that agent collaboration reduces load for routine subtasks by 30-50% but increases load for review and integration subtasks by 20-40%, with net effect depending on task composition
- Human-agent performance uplift is strongly moderated by the human's expertise level: novices see 30-50% uplift, intermediates see 15-30%, experts see 0-15% (and sometimes negative uplift)
- Communication effectiveness between humans and agents averages 60-75% as measured by comprehension accuracy, compared to 80-90% for human-human communication

## Common Misconceptions

**"Better agents always improve collaboration outcomes."** Counterintuitively, more capable agents can worsen collaboration if they change behavior in ways the human does not expect. A sudden capability upgrade can break calibrated trust, as the human's model of the agent's abilities becomes inaccurate. Gradual improvement with clear communication of capability changes produces better collaboration outcomes.

**"Human-agent collaboration evaluation is just user experience testing."** While UX is a component, collaboration evaluation includes performance measurement, trust calibration, cognitive load assessment, and handoff quality -- quantitative dimensions that go far beyond subjective satisfaction surveys.

**"If the agent explains its reasoning, the human will understand."** Explanation and understanding are not the same thing. Agents that produce verbose explanations can actually decrease human understanding by overwhelming working memory. Effective explanation is calibrated to the human's knowledge level and attention capacity. Evaluation must measure understanding, not explanation quantity.

**"Automation bias is an agent design problem."** Automation bias is a human cognitive tendency, not an agent flaw. It can be mitigated through agent design (e.g., expressing uncertainty, requiring human confirmation for high-stakes decisions) but never eliminated. Evaluation must account for human cognitive limitations as a permanent feature of the system.

## Connections to Other Concepts

- `multi-agent-evaluation-theory.md` -- human-agent teams are a special case of multi-agent systems; game-theoretic metrics for coordination quality and communication efficiency apply directly
- `the-evaluation-scaling-problem.md` -- as agents become more capable, the human's ability to evaluate agent work degrades, directly impacting trust calibration and handoff quality
- `long-horizon-task-evaluation.md` -- long-horizon collaboration introduces additional challenges: trust calibration shifts over time, cognitive load accumulates, and handoff frequency increases
- `evaluation-for-learning-agents.md` -- human feedback is a primary learning signal for many agents; collaboration evaluation must account for the agent changing in response to human interaction
- `../03-automated-evaluation-methods/llm-as-judge.md` -- LLM judges can evaluate some collaboration dimensions (handoff coherence, explanation quality) but cannot replace human-subject studies for trust and cognitive load

## Further Reading

- "The Centaur's Dilemma: National Security and the Human-AI Team" -- Scharre, 2023
- "Evaluating Human-AI Collaboration: A Framework for Assessment" -- Bansal et al., 2021
- "Does the Whole Exceed its Parts? The Effect of AI Explanations on Complementary Team Performance" -- Bansal et al., 2021
- "Automation Bias in AI-Assisted Decision Making: A Systematic Review" -- Goddard et al., 2024
- "Calibrated Trust in Human-AI Collaboration" -- Zhang et al., 2024
