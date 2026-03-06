# Consensus and Voting

**One-Line Summary**: Consensus and voting mechanisms use multiple agents (or multiple samples from one agent) to produce answers, then aggregate them through majority vote, weighted voting, or structured debate to improve reliability — exploiting the statistical principle that independent errors cancel out.

**Prerequisites**: Multi-agent architectures, agent debate and verification, probability basics, self-consistency

## What Is Consensus and Voting?

Imagine asking a room of 100 people to estimate the number of jellybeans in a jar. Individual guesses will be wildly inaccurate — some too high, some too low. But the average of all 100 guesses will be remarkably close to the true number. This is the "wisdom of crowds" effect: independent errors tend to cancel out when aggregated. Consensus and voting in multi-agent systems apply the same principle to AI reasoning: multiple agents (or multiple samples from the same model) independently answer a question, and the aggregated answer is more reliable than any individual response.

Consensus mechanisms in AI agent systems range from simple (majority vote across 5 responses) to sophisticated (structured debate followed by weighted judgment). The simplest form — self-consistency — does not even require multiple agents: you sample multiple chain-of-thought reasoning paths from the same model and take the most common final answer. Multi-agent consensus extends this by using agents with different prompts, roles, or even different underlying models, creating more diverse perspectives that improve the aggregation.

The core theoretical insight is error independence. If five agents each have an 80% chance of being correct and their errors are independent, majority vote produces a correct answer ~94% of the time (binomial probability of 3+ out of 5 being correct). In practice, errors are not fully independent (agents share training data and biases), but partial independence still yields significant reliability gains.

*Recommended visual: A diagram showing the self-consistency mechanism: a single prompt branches into N reasoning paths (with temperature > 0), each producing a final answer, and the most frequent answer is selected via majority vote — see [Wang et al., "Self-Consistency Improves Chain of Thought Reasoning in Language Models" (2023)](https://arxiv.org/abs/2203.11171)*

## How It Works

### Majority Vote

The simplest consensus mechanism:

1. N agents (or N samples from one agent) independently answer the same question.
2. Each answer is normalized (e.g., extracting the final numerical answer or classification label).
3. The answer that appears most frequently is selected.

This works best for questions with discrete, easily comparable answers: multiple choice, yes/no, numerical, or classification tasks. It struggles with open-ended generation where no two answers are identical.

### Weighted Voting

Not all agents are equally reliable. Weighted voting assigns different weights to different agents:

- **Model-based weights**: Agents using more capable models get higher weights.
- **Confidence-based weights**: Agents that express higher confidence (or whose reasoning is more detailed) get higher weights.
- **Track-record weights**: Agents that have been correct more often in previous rounds get higher weights (requires a feedback mechanism).
- **Diversity weights**: Agents whose answers are unusual (compared to the majority) might get higher weights if past experience shows the majority is often wrong in similar cases.

### Self-Consistency (Single Model)

Self-consistency, introduced by Wang et al. (2023), applies voting to a single model:

1. Prompt the model with a chain-of-thought (CoT) question.
2. Sample N responses with temperature > 0 (typically temperature 0.7-1.0, N = 5-20).
3. Extract the final answer from each response.
4. Return the most common answer.

This is not a multi-agent technique strictly, but it uses the same aggregation principle. It improves accuracy on math, reasoning, and commonsense tasks by 5-20% over single greedy decoding, at the cost of N times the compute.

### Structured Debate Before Vote

A more sophisticated approach combines debate and voting:

1. Multiple agents independently generate answers with reasoning.
2. Each agent sees all other agents' answers and reasoning.
3. Agents update their answers (or not) based on the arguments they find persuasive.
4. After 1-2 rounds of debate, a final vote is taken.
5. Optionally, a judge agent evaluates the debate and makes the final decision.

This outperforms naive voting because agents can be convinced by strong arguments, leading to convergence on the correct answer rather than a purely statistical aggregation.

### Answer Normalization

For voting to work, answers must be comparable. This requires normalization:

- **Numerical answers**: Round to the same precision, handle equivalent representations (1/2 vs. 0.5).
- **Classification**: Map synonyms to canonical labels ("positive"/"good"/"favorable" all map to "positive").
- **Code**: Compare by output/behavior rather than exact text (two different implementations that produce the same result should count as the same answer).
- **Open-ended text**: Use embedding similarity to cluster responses, then vote across clusters rather than exact strings.

## Why It Matters

### Measurable Reliability Improvement

Consensus is one of the most reliable ways to improve LLM accuracy with a clear mathematical basis. On tasks where individual accuracy is 70-85%, majority vote over 5 samples typically pushes accuracy to 85-95%. This improvement is consistent across models, tasks, and domains, making it one of the most dependable techniques in the agent toolbox.

### Error Detection Without Ground Truth

In production, you rarely have ground truth to check answers against. But disagreement among agents is a detectable signal that something may be wrong. When 5 agents agree, confidence is high. When they split 3-2, the system can flag the answer as uncertain and request human review. This calibration is valuable even without explicit ground truth.

### Complementary to Other Techniques

Consensus composes well with other quality-improvement techniques. You can apply debate within each voting agent, use chain-of-thought reasoning for each sample, and chain the voted answer into a verification step. These techniques are additive, not competing.

## Key Technical Details

- **Optimal N (number of voters)**: 3-7 voters provide the best cost-accuracy trade-off for most tasks. Beyond 7, marginal accuracy gains diminish while cost scales linearly. Use odd numbers to avoid ties.
- **Temperature for self-consistency**: Higher temperature (0.7-1.0) produces more diverse samples, improving the voting effect. Temperature 0 (greedy) produces identical samples, making voting pointless. The optimal temperature depends on the task and model.
- **Error correlation**: The voting advantage degrades as error correlation increases. If all agents make the same mistake (due to shared training data or similar prompts), voting cannot correct it. Maximizing diversity — different prompts, different models, different reasoning approaches — improves error independence.
- **Cost**: N-sample voting costs N times the inference of a single sample. For production systems, this means 3-7x the API cost. This is justified for high-stakes decisions and can be mitigated by using cheaper models for voting and reserving expensive models for tie-breaking.
- **Tie-breaking**: When no majority exists (e.g., 5 agents produce 5 different answers), strategies include: pick the answer with the most detailed reasoning, consult a separate judge model, ask a human, or increase N. Ties are more common for genuinely ambiguous questions.
- **Latency**: Voting samples can be generated in parallel, so wall-clock latency is similar to a single sample (assuming the API supports concurrent requests). This makes voting a pure cost trade-off, not a latency trade-off.
- **Cascading**: Start with a single sample. Only invoke voting if the model's confidence is below a threshold. This saves cost on easy questions while providing reliability gains on uncertain ones.

## Common Misconceptions

- **"Majority vote always gives the right answer"**: If the majority of agents are wrong (e.g., due to a shared systematic bias), voting amplifies the error. Voting works when errors are random, not when they are systematic.
- **"Self-consistency is the same as multi-agent debate"**: Self-consistency is a statistical aggregation technique with no inter-agent communication. Debate involves agents seeing and responding to each other's reasoning, which can change their answers. Debate is more powerful but more expensive and complex.
- **"You need different models for effective voting"**: Same-model voting with diverse prompts or high temperature is effective. Different models add diversity but are not required. The key is diverse reasoning paths, not diverse model architectures.
- **"Voting works for any type of output"**: Voting requires comparable, normalizable outputs. It works well for classification, numerical answers, and short factual responses. It is much harder to apply to long-form generation (essays, code, reports) where no two outputs are identical and there is no clear way to "count votes."
- **"More voters is always better"**: Beyond 7-11 voters, the accuracy curve flattens significantly. The marginal improvement from voter 8 is much smaller than from voter 2. Cost scales linearly while accuracy gains are logarithmic.

## Connections to Other Concepts

- `agent-debate-and-verification.md` — Debate is a structured form of consensus-building where agents exchange arguments before reaching agreement, as opposed to independent voting.
- `multi-agent-architectures.md` — Voting can be used within any architecture: pipeline (vote at quality-check stages), hierarchy (workers vote before reporting to manager), debate (vote after rounds of argument).
- `role-based-specialization.md` — Diverse roles improve voting effectiveness. A coder, a security expert, and an architect reviewing the same code will catch different issues.
- `inter-agent-communication.md` — Voting requires a communication protocol for collecting and aggregating votes. Structured debate additionally requires exchange protocols.
- `swarm-and-emergent-behavior.md` — Consensus in swarms emerges from local interactions rather than explicit voting rounds.

## Further Reading

- Wang et al., "Self-Consistency Improves Chain of Thought Reasoning in Language Models" (2023) — The foundational paper introducing self-consistency: sample multiple reasoning chains and marginalize over them by majority voting.
- Du et al., "Improving Factuality and Reasoning in Language Models through Multiagent Debate" (2023) — Demonstrates that structured debate before consensus significantly outperforms independent voting for factual questions.
- Li et al., "More Agents Is All You Need" (2024) — Empirically demonstrates that simply scaling the number of voting agents continues to improve performance, with diminishing but positive returns.
- Chen et al., "Universal Self-Consistency for Large Language Model Generation" (2024) — Extends self-consistency beyond answer extraction to open-ended generation by using an LLM to identify the most consistent response.
- Surowiecki, "The Wisdom of Crowds" (2004) — The foundational popular science book on collective intelligence and the conditions under which group judgment exceeds individual judgment.
