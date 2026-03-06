# Multi-Dimensional Debate Evaluation

**One-Line Summary**: Multiple LLM judge agents, each representing a different evaluative dimension, debate the quality of agent output to surface issues that single-judge evaluation misses.

**Prerequisites**: `agent-as-judge.md`, `rubric-engineering.md`, `../llm-concepts/llm-as-judge.md`

## What Is Multi-Dimensional Debate Evaluation?

Consider how a hiring panel works. One interviewer focuses on technical skills, another on communication, a third on cultural fit. After individual assessments, they deliberate -- and the discussion often reveals insights none of them reached alone. The technical interviewer might not have noticed a communication red flag, and the communication evaluator might have missed a subtle technical weakness.

Multi-dimensional debate evaluation applies this panel model to automated agent evaluation. Instead of a single LLM judge scoring all aspects of quality, multiple specialized judge agents each assess a specific dimension (correctness, efficiency, safety, style) and then engage in structured argumentation. The debate process creates adversarial pressure: each dimension advocate must defend its assessment against challenges from others, forcing more rigorous and nuanced evaluation.

This approach addresses a fundamental limitation of single-judge evaluation: a lone judge optimizes for internal consistency, which can mean overlooking tensions between dimensions. An output might score highly on "helpfulness" and poorly on "safety," but a single judge may unconsciously trade off one for the other. Separate dimension advocates make these tensions explicit.

## How It Works

### Architecture

The debate evaluation system consists of:

1. **Dimension Advocates**: Separate LLM judge instances, each prompted with a specific evaluative dimension and its associated rubric. Common dimensions include:
   - Correctness Advocate: evaluates factual accuracy and task completion
   - Efficiency Advocate: evaluates resource usage, step count, and computational cost
   - Safety Advocate: evaluates adherence to safety constraints and risk exposure
   - Style Advocate: evaluates code quality, communication clarity, and adherence to conventions

2. **Debate Moderator**: An orchestration layer (which may itself be an LLM) that manages the discussion flow, ensures each advocate addresses challenges, and synthesizes the final assessment.

### Debate Protocol

**Round 1 -- Independent Assessment**: Each advocate evaluates the agent output against its dimension's rubric, producing a score and justification. No advocate sees others' assessments.

**Round 2 -- Cross-Examination**: Each advocate receives the other advocates' assessments and must respond to any tensions or conflicts. For example, the Efficiency Advocate might challenge the Correctness Advocate: "The agent achieved correctness but took 47 steps for a task that should require 8. Should this affect the overall assessment?"

**Round 3 -- Rebuttal and Revision**: Advocates may revise their scores based on cross-examination. The Safety Advocate might initially score 4/5, but after the Correctness Advocate points out that the agent's approach introduces a race condition, revise down to 2/5.

**Synthesis**: The moderator aggregates the final positions into an overall assessment.

### Consensus Protocols

Different synthesis methods suit different evaluation contexts:

- **Majority Vote**: Each advocate casts a pass/fail vote on its dimension. The agent output passes overall only if a majority (or all) dimensions pass. Simple, interpretable, but loses nuance.
- **Weighted Synthesis**: Dimensions receive pre-assigned weights (e.g., safety: 0.3, correctness: 0.4, efficiency: 0.15, style: 0.15). Final score is a weighted combination. Requires careful weight calibration.
- **Structured Argumentation**: The moderator identifies points of agreement and disagreement, then produces a narrative assessment that captures the multi-dimensional picture. Most informative but least scalable.
- **Minimum-Score Gating**: The final score cannot exceed the lowest dimension score by more than one level. This prevents a high correctness score from masking a critical safety failure.

### Cost Analysis

For a 4-dimension debate with 3 rounds:
- Round 1: 4 independent LLM calls
- Round 2: 4 cross-examination calls (each receiving 3 other assessments)
- Round 3: 4 rebuttal calls
- Synthesis: 1 moderator call
- **Total: 13 LLM calls per evaluation** (vs. 1 for standard LLM-as-Judge)

At ~$0.06 per LLM call, a full debate evaluation costs approximately $0.78 per evaluation. This positions it between LLM-as-Judge ($0.06) and Agent-as-Judge ($0.96) in cost, while providing richer dimensional analysis than either.

## Why It Matters

1. **Adversarial pressure improves evaluation rigor.** When a Safety Advocate must defend its assessment against a Correctness Advocate's challenge, both assessments become more carefully reasoned.

2. **Dimension tensions become explicit.** Real-world quality involves trade-offs. Debate evaluation surfaces these trade-offs rather than hiding them inside a single score.

3. **Single judges have blind spots.** Research on LLM judge biases shows that individual judges are systematically biased toward certain output properties (length, fluency, confidence). Multiple advocates with different focuses partially mitigate these biases.

4. **Debate traces provide diagnostic value.** The argumentation record reveals not just the score but why each dimension scored as it did and where tensions exist -- information valuable for agent improvement.

## Key Technical Details

- Using different model families for different advocates (e.g., Claude for safety, GPT-4 for correctness) reduces correlated judge biases
- Debate evaluation is most valuable for complex, multi-objective tasks where dimension trade-offs are common
- The moderator should be a capable model since synthesis quality depends on reasoning ability
- Limiting debate to 2-3 rounds prevents circular argumentation and controls cost
- Dimension advocates should be prevented from seeing the agent's identity or model type to avoid self-preference bias
- Empirically, 3-5 dimensions provides the best cost-quality trade-off; beyond 5, the debate becomes unwieldy and the marginal value of additional dimensions drops

## Common Misconceptions

**"More judges always produce better evaluation."** Additional judges increase cost and can introduce noise if their dimensions overlap or if the consensus protocol is poorly designed. The value comes from dimensional diversity, not judge count.

**"The debate always converges to a consensus."** Legitimate disagreement between dimensions is a feature, not a bug. When the Safety Advocate and the Helpfulness Advocate genuinely conflict, the correct output is a documented tension, not a forced consensus.

**"Debate evaluation eliminates bias."** It reduces the impact of any single judge's bias but introduces new risks: groupthink (if advocates are prompted too similarly), anchoring (if Round 1 scores overly influence later rounds), and moderator bias (if the synthesis model has its own preferences).

**"This approach is always worth the cost overhead."** For simple, single-dimension tasks (e.g., "did the agent produce syntactically valid JSON?"), debate evaluation is pure overhead. Reserve it for complex tasks with genuine multi-dimensional quality concerns.

## Connections to Other Concepts

- Requires well-designed rubrics from `rubric-engineering.md` for each dimension advocate
- Individual advocates may use `agent-as-judge.md` capabilities for tool-assisted evaluation
- Must be validated using methods from `judge-calibration-and-validation.md`
- Can incorporate `reference-free-evaluation.md` methods when gold-standard answers are unavailable
- Integrated into production systems via `evaluation-pipeline-architecture.md`

## Further Reading

- "Scalable AI Safety via Doubly-Efficient Debate" -- Irving et al., 2018
- "ChatEval: Towards Better LLM-based Evaluators through Multi-Agent Debate" -- Chan et al., 2023
- "Large Language Models Are Not Fair Evaluators" -- Wang et al., 2023
- "PRD: Peer Rank and Discussion Improve Large Language Model Based Evaluation" -- Li et al., 2023
