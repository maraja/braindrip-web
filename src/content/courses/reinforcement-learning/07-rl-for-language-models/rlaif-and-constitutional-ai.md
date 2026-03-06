# RLAIF and Constitutional AI

**One-Line Summary**: Replacing human annotators with AI-generated feedback guided by explicit principles for scalable alignment -- reducing the cost per preference comparison from $1--$10 to approximately $0.001 while achieving comparable quality.

**Prerequisites**: RLHF pipeline (`07-rl-for-language-models/rlhf-pipeline.md`), reward modeling (`07-rl-for-language-models/reward-modeling-for-llms.md`), supervised fine-tuning basics, prompting techniques.

## What Is RLAIF / Constitutional AI?

Imagine you are training thousands of new employees, but instead of hiring managers to evaluate each one individually, you write a detailed code of conduct and hire a single senior employee to judge performance based on that code. The senior employee can work around the clock, evaluating millions of work samples per day, applying the same principles consistently, and at a fraction of the cost of a human management team.

Constitutional AI (CAI), introduced by Anthropic (Bai et al., 2022), and RLAIF (Reinforcement Learning from AI Feedback) follow this approach. Instead of collecting expensive human preference labels, an AI model generates preferences guided by a set of explicit principles (a "constitution"). These AI-generated labels then train a reward model or directly optimize the policy, just as in standard RLHF. The key insight is that AI feedback, properly guided by principles, achieves quality comparable to human feedback at three to four orders of magnitude lower cost.

## How It Works

### The Constitutional AI Pipeline

CAI operates in two phases, replacing human annotation at both the SFT and RL stages:

**Phase 1: Supervised Learning from AI Self-Critique**

1. Generate responses to harmful or adversarial prompts using a helpful-only model
2. Ask the model to critique its own response according to a principle (e.g., "Which response is more harmful?")
3. Ask the model to revise its response based on the critique
4. Fine-tune on the revised (improved) responses

This "Red Team, Critique, Revise" loop can be applied iteratively, progressively improving response quality through self-refinement.

**Phase 2: RLAIF -- RL from AI Feedback**

1. For each prompt $x$, generate two candidate responses $(y_1, y_2)$
2. Present both responses to an AI evaluator alongside a constitutional principle
3. The AI evaluator selects the preferred response based on the principle
4. Use these AI-generated preferences to train a reward model $r_\phi$ via Bradley-Terry:

$$\mathcal{L}_{\text{RM}}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_{\text{AI}}} \left[\log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)\right]$$

5. Optimize the policy against $r_\phi$ using PPO (or GRPO, DPO, etc.)

### The Constitution

The constitution is a set of natural language principles that guide AI judgment. Examples from Anthropic's original paper:

- "Choose the response that is most helpful, honest, and harmless."
- "Choose the response that is least likely to be used for illegal or harmful purposes."
- "Choose the response that most accurately reflects the AI's uncertainty about the answer."

Different principles can be applied to different prompts or combined via chain-of-thought reasoning. The AI evaluator is prompted with the principle and asked to reason about which response better satisfies it before making a selection.

### The RLAIF Preference Generation Process

For a prompt $x$ with candidate responses $y_1, y_2$, the AI evaluator is given:

```
Consider the following principle: [PRINCIPLE]
Response A: [y_1]
Response B: [y_2]
Which response better adheres to the principle? Think step by step.
```

The AI produces chain-of-thought reasoning and a final selection. The probability assigned to each choice can also be used as a soft label:

$$P_{\text{AI}}(y_1 \succ y_2 | x, \text{principle}) \approx \frac{P_{\text{LLM}}(\text{"A"} | \text{prompt})}{P_{\text{LLM}}(\text{"A"} | \text{prompt}) + P_{\text{LLM}}(\text{"B"} | \text{prompt})}$$

Using soft probabilities rather than hard binary labels reduces noise in the preference data.

### Cost Analysis

The economics are decisive:

| | Human Feedback | AI Feedback |
|---|---|---|
| Cost per comparison | $1--$10 | ~$0.001 |
| Throughput | ~100/day/annotator | ~100,000/day/GPU |
| Consistency | Variable (60--75% agreement) | High (deterministic given temperature=0) |
| Scalability | Linear in annotator count | Near-unlimited with compute |
| Nuance | High (cultural context, edge cases) | Lower (follows principles literally) |

For 100K comparisons: human feedback costs $100K--$1M; AI feedback costs approximately $100.

## Why It Matters

RLAIF removes the most expensive and least scalable component of the alignment pipeline: human annotation. This has three profound implications. First, alignment can iterate much faster when feedback is generated in minutes rather than weeks. Second, the constitutional principles make the alignment objectives explicit, auditable, and modifiable -- unlike the implicit preferences embedded in human annotator judgments. Third, it enables alignment research to scale with compute rather than with human labor, which is essential as models become more capable.

## Key Technical Details

- **AI evaluator quality**: The evaluator model should be at least as capable as the policy being trained. Using a stronger model (e.g., a larger model) as evaluator improves label quality.
- **Position bias**: AI evaluators exhibit position bias (preferring the first or second response). Mitigate by evaluating each pair twice with swapped positions and averaging.
- **Principle selection**: Different principles can be applied to different categories of prompts. Safety principles for potentially harmful queries, helpfulness principles for benign queries.
- **Chain-of-thought**: Requiring the evaluator to reason before selecting dramatically improves label quality compared to direct selection.
- **Temperature**: AI evaluation at temperature 0 produces deterministic labels; temperature 0.7--1.0 with sampling provides soft probability estimates.
- **Human-AI agreement**: Lee et al. (2023) found RLAIF labels agree with human labels at roughly the same rate as humans agree with each other (approximately 60--75% for open-ended tasks).
- **Label noise**: AI labels are noisier for subjective preferences (humor, creativity) but comparable or better for objective criteria (factual accuracy, safety).

## Common Misconceptions

- **"AI feedback is circular -- the model is training on its own preferences."** The evaluator and the policy being trained are typically different models, or the same base model used at different stages. More importantly, the constitution provides external grounding -- the principles encode human values even if the evaluation is performed by AI.
- **"RLAIF produces worse alignment than RLHF."** Multiple studies (Lee et al., 2023; Bai et al., 2022) show that RLAIF achieves comparable alignment quality to RLHF for most tasks. The gap is largest for culturally nuanced or highly subjective tasks.
- **"Constitutional AI means the AI decides what is right."** The constitution is written by humans. The AI merely applies human-specified principles consistently. Changing the constitution changes the behavior, giving humans ultimate control.
- **"RLAIF eliminates the need for any human involvement."** Humans are still needed to write and refine the constitution, validate that AI feedback aligns with intended values, and handle edge cases. RLAIF reduces human labor, not human oversight.

## Connections to Other Concepts

- `rlhf-pipeline.md` -- RLAIF replaces human annotators in Stage 2 (reward model training) of the RLHF pipeline.
- `reward-modeling-for-llms.md` -- The reward model architecture and training procedure are identical; only the source of preference labels changes.
- `dpo-as-implicit-rl.md` -- AI-generated preference labels can also be used directly with DPO, bypassing both the reward model and RL loop.
- `ppo-for-language-models.md` -- The PPO optimization stage remains the same; only the reward model's training data source changes.
- `rlvr.md` -- Both RLAIF and RLVR reduce dependence on human annotators, but through different mechanisms: AI judgment vs. objective verification.
- `06-advanced-methods/reward-shaping.md` -- Constitutional principles can be seen as a form of high-level reward specification that the AI evaluator translates into comparative signals.
- `06-advanced-methods/inverse-reinforcement-learning.md` -- RLAIF inverts the IRL direction: instead of inferring rewards from human behavior, it generates reward labels from AI behavior guided by human principles.

## Further Reading

- **Bai et al. (2022), "Constitutional AI: Harmlessness from AI Feedback"** -- The foundational paper introducing Constitutional AI, the critique-revise pipeline, and AI-generated preference labels for RLHF.
- **Lee et al. (2023), "RLAIF: Scaling Reinforcement Learning from Human Feedback with AI Feedback"** -- Google's systematic study demonstrating that RLAIF achieves comparable quality to RLHF, with detailed analysis of AI evaluator design choices.
- **Sun et al. (2023), "Principle-Driven Self-Alignment of Language Models from Scratch with Minimal Human Supervision"** -- Extends constitutional AI with self-alignment, where the model generates its own training data guided by principles.
- **Tunstall et al. (2023), "Zephyr: Direct Distillation of LM Alignment"** -- Demonstrates that AI-generated preference data combined with DPO can produce well-aligned models from smaller base models with minimal human data.
