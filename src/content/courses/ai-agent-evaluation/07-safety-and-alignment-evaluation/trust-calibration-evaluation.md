# Trust Calibration Evaluation

**One-Line Summary**: Evaluating whether agents accurately communicate their confidence and limitations, so that users can make well-informed decisions about when to trust agent output.

**Prerequisites**: `alignment-measurement.md`, `evaluating-refusal-behavior.md`, `../01-foundations-of-agent-evaluation/outcome-vs-process-evaluation.md`

## What Is Trust Calibration Evaluation?

Imagine consulting two weather forecasters. One says "it will definitely rain tomorrow" regardless of actual conditions -- sometimes right, sometimes wrong, but always certain. The other says "there is a 70% chance of rain" and is correct about 70% of the time when making such predictions. The second forecaster is well-calibrated: their expressed confidence matches their actual accuracy. You can trust their uncertainty signals to make better decisions about whether to carry an umbrella.

Trust calibration evaluation assesses whether agents function like the second forecaster. When an agent says "I'm confident this code is correct," is it actually right more often than when it says "I think this might work but I'm not sure"? When it expresses uncertainty, does that uncertainty reflect genuine knowledge limitations? Users rely on these confidence signals -- explicitly stated or implicitly conveyed through hedging language, certainty markers, and qualifying statements -- to decide how much verification an agent's output needs.

The stakes for agents are higher than for chatbots. A chatbot's overconfident incorrect answer might mislead someone in a conversation. An agent's overconfident incorrect action might execute destructive code, deploy a broken system, or make irreversible changes -- all while signaling that everything is fine.

## How It Works

### Calibration Measurement

Calibration measures the correspondence between expressed confidence and actual accuracy. The core methodology borrows from probability calibration in forecasting and extends it to agent behavior.

**Confidence extraction** is the first challenge. Agents express confidence through multiple channels: explicit statements ("I'm certain this is correct"), hedging language ("this should work," "I believe," "probably"), qualifying phrases ("assuming the database schema hasn't changed"), and behavioral signals (running tests before declaring completion vs not). Evaluation systems must extract a numerical confidence estimate from these heterogeneous signals. LLM-based confidence extractors achieve approximately 80-85% agreement with human confidence ratings.

**Binned calibration analysis** groups agent outputs by their expressed confidence level (0-10%, 10-20%, ..., 90-100%) and computes the actual accuracy within each bin. A perfectly calibrated agent produces actual accuracy equal to expressed confidence in each bin. The **Expected Calibration Error (ECE)** is the weighted average absolute difference between confidence and accuracy across bins. Frontier agents typically achieve ECE of 0.10-0.20 on general tasks, with significant variation by domain.

**Reliability diagrams** visualize calibration by plotting expressed confidence (x-axis) against actual accuracy (y-axis). A well-calibrated agent produces points along the diagonal. Points above the diagonal indicate underconfidence (the agent is better than it thinks). Points below indicate overconfidence (the agent is worse than it thinks). Most current agents show systematic overconfidence, particularly in the 70-95% confidence range.

### Overconfidence Detection

Overconfidence -- asserting incorrect information with high certainty -- is the most dangerous calibration failure for agents because it suppresses the user's natural impulse to verify.

**Factual overconfidence** occurs when the agent states incorrect facts with certainty. Testing involves presenting the agent with questions that have verifiable answers, requesting not just the answer but a confidence level, and measuring accuracy at each confidence tier. A well-calibrated agent should have near-100% accuracy on claims it makes with near-100% confidence.

**Procedural overconfidence** occurs when the agent expresses certainty about a course of action that turns out to be wrong. A coding agent that says "this fix will resolve the issue" but introduces a regression is procedurally overconfident. Testing involves tasks with verifiable outcomes where the agent's confidence in its approach can be compared against actual success.

**Domain-specific overconfidence** recognizes that calibration varies by domain. An agent might be well-calibrated on coding tasks (where it has extensive training data) but severely overconfident on infrastructure operations (where its training data is sparser). Evaluation must assess calibration per domain rather than relying on aggregate metrics.

### Underconfidence Detection

Underconfidence -- excessive hedging on correct output -- is less dangerous but reduces user trust and efficiency.

**Capability underconfidence** occurs when the agent unnecessarily hedges on tasks within its demonstrated competence. If an agent correctly answers 95% of Python debugging questions but qualifies each answer with "I'm not entirely sure," it is underconfident. Testing measures whether hedging language correlates with actual error rates.

**Asymmetric hedging** occurs when the agent hedges more on certain topics due to training incentives rather than genuine uncertainty. Safety training may cause agents to express low confidence on sensitive topics where they are actually well-informed, creating underconfidence specifically in domains where clear communication is most important.

**The confidence gap** quantifies the difference between the agent's expressed confidence and its actual accuracy. A positive gap indicates overconfidence; a negative gap indicates underconfidence. Evaluation should report the confidence gap at each confidence tier and identify systematic patterns.

### Measuring Uncertainty Expression

Beyond binary confident/uncertain, evaluation should assess the quality and granularity of the agent's uncertainty communication.

**Appropriate qualifier usage** measures whether the agent uses linguistically appropriate hedging. "This might work" is appropriate for a 60% confidence situation. "I'm fairly confident" is appropriate for an 80% situation. "This is certainly correct" is appropriate only for 95%+ confidence. Evaluation maps the agent's qualifier vocabulary to calibrated confidence ranges.

**Source attribution for uncertainty** assesses whether the agent communicates why it is uncertain. "I'm not sure because I don't have access to the database schema" is more useful than "I'm not sure." Source-attributed uncertainty helps users decide whether to provide additional information or take over the task.

**Graduated uncertainty expression** tests whether the agent can express multiple confidence levels rather than binary certain/uncertain. A well-calibrated agent distinguishes between "I have no idea" (0-20%), "I'm guessing" (20-40%), "I think" (40-60%), "I'm fairly confident" (60-80%), and "I'm certain" (80-100%) in ways that correspond to its actual accuracy at each level.

### The Hallucination Confidence Problem

The most pernicious calibration failure is confident hallucination: the agent fabricates information and presents it with high confidence. This is qualitatively different from ordinary overconfidence because the agent is not merely wrong about a judgment call -- it has generated false information indistinguishable in tone and presentation from its accurate outputs.

**Hallucination confidence measurement** compares the agent's confidence on factual claims against a verified ground truth database. The hallucination confidence score is the average confidence level attached to claims that turn out to be fabricated. Current frontier models exhibit hallucination confidence scores of 0.75-0.90, meaning they present fabricated information with 75-90% apparent confidence.

**Detection difficulty** is measured by whether humans can distinguish hallucinated content from accurate content based on the agent's confidence signals. If the agent's confidence on hallucinations is indistinguishable from its confidence on accurate claims, users have no reliable signal for when to verify. Studies show that human detection of LLM hallucinations drops below 50% (chance level) when the hallucinated content is presented with high confidence.

**Calibration under hallucination** evaluates whether the agent's calibration metrics hold when hallucinated outputs are included in the analysis. An agent might appear well-calibrated on a test set that happens to contain few hallucination-triggering queries, then show severe miscalibration when hallucination-prone domains are included.

### User Trust Dynamics

Trust calibration extends beyond the agent's expressed confidence to how users respond to those signals.

**Trust transfer measurement** assesses whether users appropriately adjust their trust based on the agent's confidence signals. In user studies, participants are given agent outputs with varying confidence levels and asked to decide how much verification to perform. Well-calibrated agents should produce well-calibrated user trust: users verify more when the agent hedges and less when it is confident.

**Trust erosion after miscalibration** measures how user trust recovers after the agent is revealed to be miscalibrated. Research shows that a single high-confidence error reduces user trust more than multiple low-confidence errors, even if the total error count is higher in the latter case. This asymmetry means that overconfidence on a few claims can destroy trust earned through hundreds of accurate ones.

**Automation bias interaction** examines how agent confidence interacts with users' tendency to over-rely on automated systems. Users with high automation bias may trust overconfident agents too readily, while users with low automation bias may dismiss well-calibrated confidence signals. Evaluation should assess calibration impact across users with varying automation bias levels.

## Why It Matters

1. **Users make downstream decisions based on agent confidence.** A developer who trusts an agent's "this code is correct" claim may skip code review. A manager who trusts an agent's "this analysis is comprehensive" claim may base strategy decisions on incomplete data. Miscalibrated confidence leads to miscalibrated decisions.
2. **Overconfidence hides errors.** The most dangerous agent errors are the ones users do not check because the agent appeared certain. Better calibration ensures that errors come with appropriate uncertainty flags that trigger verification.
3. **Trust calibration determines delegation scope.** Organizations deciding how much autonomy to give agents rely on trust calibration. Agents that accurately communicate their limitations can be given broader autonomy because users know when to intervene.
4. **Competitive differentiation through reliable uncertainty.** An agent that says "I don't know" when it genuinely does not know is more valuable than one that always projects confidence, because users can rely on its positive signals.

## Key Technical Details

- Expected Calibration Error (ECE) for frontier agents ranges from 0.10-0.20 on general tasks, with coding tasks showing better calibration than open-ended reasoning
- Hallucination confidence scores average 0.75-0.90, meaning fabricated content is presented with high apparent confidence
- Human detection of LLM hallucinations drops below 50% when hallucinated content is accompanied by high-confidence framing
- LLM-based confidence extractors agree with human confidence ratings at approximately 80-85%
- A single high-confidence error reduces user trust by 2-3x more than the equivalent number of low-confidence errors
- Calibration improves with model scale but degrades on out-of-distribution queries, creating domain-specific calibration profiles
- Reliability diagrams typically show 10-15% overconfidence in the 70-95% expressed confidence range for frontier models
- Underconfidence is most pronounced on sensitive topics where safety training creates asymmetric hedging

## Common Misconceptions

**"If the agent is usually correct, calibration does not matter."** An agent that is 90% accurate but expresses 99% confidence on everything is dangerously miscalibrated. Users trust the 99% confidence, skip verification, and the 10% error rate produces undetected mistakes. Calibration matters precisely because it determines which outputs users verify.

**"Confidence should be expressed as a probability."** While useful for evaluation, explicit probability statements ("I am 73% confident") are unnatural and poorly understood by most users. Well-calibrated agents communicate confidence through natural language hedging, which must be consistent and reliable even if not numerically precise.

**"Training agents to express more uncertainty solves overconfidence."** Uniform uncertainty increase creates underconfidence without improving calibration. The goal is not more uncertainty but correctly placed uncertainty: high confidence on things the agent gets right, low confidence on things it gets wrong. This requires calibration, not just hedging.

**"Hallucinations are always detectable by the user."** Confident hallucinations in the agent's areas of apparent expertise are frequently undetectable without independent verification. Users cannot distinguish between the agent retrieving accurate information and fabricating plausible-sounding information when both are presented with the same confidence level.

## Connections to Other Concepts

- `alignment-measurement.md` -- trust calibration is an alignment dimension; a well-aligned agent communicates its limitations honestly
- `evaluating-refusal-behavior.md` -- refusal is an extreme form of uncertainty expression; the agent is so uncertain about the appropriateness of a request that it declines
- `harmful-action-detection-metrics.md` -- overconfident harmful actions are harder to detect because they do not trigger uncertainty-based monitoring
- `../01-foundations-of-agent-evaluation/outcome-vs-process-evaluation.md` -- calibration affects process evaluation when process includes the agent's self-assessment
- `../09-production-evaluation-and-monitoring/user-feedback-as-evaluation-signal.md` -- user trust dynamics generate feedback signals about calibration quality
- `../10-frontier-research-and-open-problems/the-evaluation-scaling-problem.md` -- as agents become more capable, calibration evaluation becomes harder because human evaluators struggle to assess accuracy

## Further Reading

- "Language Models (Mostly) Know What They Know" -- Kadavath et al., 2022
- "Teaching Models to Express Their Uncertainty in Words" -- Lin et al., 2022
- "Calibrating Large Language Models Using Their Generations" -- Tian et al., 2023
- "Long-Form Factuality in Large Language Models" -- Min et al., 2023
- "Can LLMs Express Their Uncertainty? An Empirical Evaluation of Confidence Elicitation in LLMs" -- Xiong et al., 2024
- "The Calibration Gap in Large Language Models" -- OpenAI Technical Report, 2024
