# Evaluation for Learning Agents

**One-Line Summary**: Agents that improve through feedback, experience, or self-modification present a moving-target evaluation problem where capabilities change during the assessment period, requiring dynamic evaluation frameworks that measure learning itself, not just learned outcomes.

**Prerequisites**: `../01-foundations-of-agent-evaluation/what-makes-agent-evaluation-hard.md`, `long-horizon-task-evaluation.md`, `../09-production-evaluation-and-monitoring/drift-detection-and-regression-testing.md`

## What Is Evaluation for Learning Agents?

Imagine evaluating a medical student. You cannot simply give them one exam and declare them competent -- you need to assess how quickly they learn from clinical rotations, whether they retain knowledge from earlier courses while acquiring new skills, and whether their diagnostic reasoning improves with experience. The evaluation must capture the trajectory of learning, not just a snapshot of current ability. This is the challenge of evaluating learning agents.

A learning agent is one whose capabilities change over time through interaction with its environment. This includes agents that learn from user feedback, improve through self-reflection, accumulate experience in memory systems, or modify their own prompts and strategies. Unlike static agents (whose capabilities are fixed at deployment), learning agents present a fundamental evaluation paradox: by the time you finish measuring their capability, that capability has changed.

Most current agent benchmarks assume static capabilities. They evaluate an agent at a single point in time, as if photographing a river and calling it a measurement of flow. For learning agents, we need video -- evaluation frameworks that capture the dynamics of improvement, not just the current state.

## How It Works

### The Moving Target Problem

Static evaluation measures P(success | agent, task). For learning agents, the function is P(success | agent(t), task), where agent(t) denotes the agent at time t. The agent's capability is a function, not a constant. This creates several concrete problems:

**Evaluation timing sensitivity.** When you evaluate matters. An agent tested after 10 interactions will score differently than the same agent tested after 100 interactions. Results are only meaningful relative to the agent's experience level, and reporting scores without specifying experience level is misleading.

**Non-stationarity.** Statistical methods designed for static evaluation (confidence intervals, significance tests) assume the underlying distribution is stable. Learning agents violate this assumption. An agent's success rate might be 40% for tasks 1-50 and 70% for tasks 51-100 -- the overall average of 55% represents neither the starting capability nor the current capability.

**Evaluation interference.** The act of evaluation provides data that the agent can learn from. This means evaluation changes the thing being evaluated. Evaluation tasks must be carefully designed so that evaluation data does not leak into the agent's learning process, or the evaluation must account for this effect.

### Learning Curves

The learning curve -- performance as a function of experience -- is the primary evaluation tool for learning agents. Key metrics extracted from learning curves include:

**Learning rate.** How quickly does performance improve? Measured as the slope of the learning curve during the initial improvement phase. Higher learning rates indicate more efficient learning. Current self-improving agents show learning rates of 0.5-2.0 percentage points per interaction cycle on structured tasks.

**Asymptotic performance.** What ceiling does the agent approach? Some agents learn quickly but plateau at mediocre levels; others learn slowly but reach high performance. The asymptote matters as much as the rate, and predicting the asymptote early (before the agent has fully converged) is an open problem.

**Sample efficiency.** How many experiences does the agent need to reach a given performance level? An agent that reaches 80% accuracy in 20 interactions is more sample-efficient than one that requires 200 interactions for the same level. Sample efficiency has direct cost implications: each interaction has computational and sometimes monetary cost.

**Learning stability.** Does performance improve monotonically, or does it oscillate? Unstable learning curves -- sharp improvements followed by regressions -- indicate fragile learning mechanisms. Variance in the learning curve is itself a metric.

### Skill Acquisition Evaluation

Beyond overall performance improvement, learning agents can be evaluated on their ability to acquire specific new skills:

**Novel tool use.** Given a new tool with documentation, can the agent learn to use it effectively? Measured by providing a previously unseen tool and evaluating how quickly the agent progresses from zero competence to proficient use. Current agents typically require 5-15 demonstration examples to achieve basic tool competence and 20-50 for proficient use.

**Domain adaptation.** Given experience in a familiar domain, can the agent transfer to an adjacent domain? Measured by evaluating performance on the new domain as a function of exposure. This connects to cross-domain generalization but adds a temporal dimension: generalization at interaction 1 vs. interaction 50.

**Strategy learning.** Can the agent discover and adopt new problem-solving strategies? This requires evaluation tasks where the optimal strategy is not obvious from the task description alone and must be discovered through exploration. Measured by whether the agent's strategy distribution shifts toward more effective approaches over time.

### Knowledge Retention (Catastrophic Forgetting)

A critical failure mode for learning agents: acquiring new capabilities at the expense of existing ones. This catastrophic forgetting is well-documented in neural networks and appears in agent systems as well.

**Retention testing.** Periodically re-evaluate the agent on previously mastered tasks while it learns new ones. The retention score is: R = Performance_current(old_tasks) / Performance_peak(old_tasks). A retention score of 1.0 means no forgetting; lower scores indicate capability loss.

**Learning-forgetting tradeoff.** Plot new skill acquisition against old skill retention. The ideal agent improves on new tasks without losing ground on old ones (the upper-right quadrant). Agents that gain new skills but forget old ones (upper-left) are trading capability rather than building it.

Current self-improving agent systems show retention scores of 0.7-0.9, meaning they lose 10-30% of previously mastered capability when learning substantially new material.

### Evaluating the Learning Process

Beyond measuring learned outcomes, evaluation can target the learning process itself:

**Feedback integration.** When given explicit feedback (error messages, human corrections, reward signals), how quickly and accurately does the agent update its behavior? Measured by comparing performance before and after feedback on similar tasks.

**Self-reflection quality.** For agents that self-reflect, evaluate whether the agent's self-assessment is accurate. Does it correctly identify its mistakes? Does it generate actionable improvement plans? Self-reflection accuracy can be measured by comparing agent self-assessment against ground truth error analysis.

**Learning transfer.** When the agent learns to solve problem type A, does it become better at related problem type B? Measured as the correlation between improvement on A and subsequent improvement on B.

## Why It Matters

1. **Self-improving agents are the frontier of capability.** Agents that learn from experience will eventually surpass static agents. Evaluation frameworks must keep pace with this architectural trend.

2. **Static benchmarks are misleading for learning agents.** A learning agent evaluated once will score differently than the same agent evaluated after deployment experience. Static scores provide a distorted picture of deployed capability.

3. **Learning introduces new failure modes.** Catastrophic forgetting, unstable learning, and evaluation interference are failure modes unique to learning agents. Without targeted evaluation, these failures go undetected.

4. **Economic value depends on learning efficiency.** An agent that learns slowly costs more to bring up to speed. Sample efficiency directly translates to deployment cost and time-to-value.

## Key Technical Details

- Learning rate measurement requires a minimum of 30-50 evaluation points across the learning trajectory to distinguish real improvement from noise
- Sample efficiency varies by 5-10x across current agent architectures for the same task type, making it a strong differentiator
- Catastrophic forgetting becomes measurable after the agent has acquired 3-5 substantially new skills; smaller numbers of new skills show minimal forgetting
- Evaluation interference effects are strongest for in-context learning agents (which learn directly from evaluation data) and weakest for agents that learn only from separate training pipelines
- Learning curve extrapolation (predicting asymptotic performance from early data) achieves reliability of 0.6-0.8 using power-law fitting, but can be misleading for agents with phase transitions in learning
- Current benchmark suites for learning agents include only 2-3 published frameworks, compared to dozens for static agent evaluation

## Common Misconceptions

**"Evaluate a learning agent after it has finished learning."** Learning agents in realistic deployments never finish learning -- they continuously adapt to new tasks, users, and environments. There is no stable endpoint at which static evaluation becomes appropriate. Evaluation must be continuous.

**"A learning agent that improves on the benchmark is cheating."** If the agent legitimately learns from experience (rather than memorizing test answers), improvement is the desired behavior, not a flaw. The evaluation framework must distinguish between genuine skill acquisition and test set memorization, but should not penalize real learning.

**"Learning always improves performance."** Learning can degrade performance through catastrophic forgetting, overfitting to recent experiences, or adopting strategies that exploit evaluation metrics rather than genuinely solving tasks. Not all learning is good learning, and evaluation must detect these failure modes.

**"In-context learning and long-term learning are the same problem."** In-context learning (adapting within a single conversation) and persistent learning (improving across conversations) present different evaluation challenges. In-context learning is measurable within a single session; persistent learning requires longitudinal evaluation across sessions, with all the context persistence challenges that implies.

## Connections to Other Concepts

- `long-horizon-task-evaluation.md` -- long-horizon tasks create more learning opportunities, and learning agents may improve mid-task, complicating evaluation of the task itself
- `cross-domain-generalization-measurement.md` -- learning agents may generalize differently than static agents because they can adapt to new domains during evaluation
- `evaluating-emergent-system-behavior.md` -- learning can produce emergent behaviors as the agent discovers novel strategies through experience
- `../09-production-evaluation-and-monitoring/drift-detection-and-regression-testing.md` -- production monitoring of learning agents must distinguish beneficial learning from harmful drift
- `../ai-agent-concepts/10-advanced-and-frontier/self-improving-agents.md` -- self-improving agents are the primary target of learning agent evaluation

## Further Reading

- "Voyager: An Open-Ended Embodied Agent with Large Language Models" -- Wang et al., 2023
- "Self-Refine: Iterative Refinement with Self-Feedback" -- Madaan et al., 2023
- "Reflexion: Language Agents with Verbal Reinforcement Learning" -- Shinn et al., 2023
- "Continual Learning for Large Language Models: A Survey" -- Wu et al., 2024
- "Evaluating the Learning Dynamics of In-Context Learning in Large Language Models" -- Akyurek et al., 2023
