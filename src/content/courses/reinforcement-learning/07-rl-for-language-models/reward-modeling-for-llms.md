# Reward Modeling for LLMs

**One-Line Summary**: Training a neural network to predict human preferences from pairwise comparisons -- the critical bottleneck in LLM alignment where Goodhart's Law meets the impossibility of specifying what "good" means mathematically.

**Prerequisites**: RLHF pipeline (`07-rl-for-language-models/rlhf-pipeline.md`), supervised learning, logistic regression, reward shaping (`06-advanced-methods/reward-shaping.md`), inverse reinforcement learning (`06-advanced-methods/inverse-reinforcement-learning.md`).

## What Is Reward Modeling for LLMs?

Imagine you are judging a cooking competition but cannot write down a recipe for "delicious." You cannot specify the exact temperature, spice ratios, or plating arrangement that makes a dish great. But you *can* taste two dishes side by side and say "I prefer this one." A reward model is a neural network trained to replicate this comparative judgment at scale -- learning to score any dish (or any LLM response) from thousands of such pairwise comparisons.

In the RLHF pipeline, the reward model bridges the gap between human preferences and mathematical optimization. Humans cannot provide reward signals for millions of training examples, so instead they label tens of thousands of pairwise comparisons, and a reward model generalizes from these to score any new response. This learned reward function then serves as the optimization objective for PPO.

## How It Works

### The Bradley-Terry Preference Model

Given a prompt $x$ and two responses $y_w$ (preferred) and $y_l$ (dispreferred), the Bradley-Terry model assumes the probability that $y_w$ is preferred follows a logistic function of the reward difference:

$$P(y_w \succ y_l | x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) = \frac{1}{1 + e^{-(r_\phi(x, y_w) - r_\phi(x, y_l))}}$$

The reward model $r_\phi$ is trained by maximizing the log-likelihood of observed preferences:

$$\mathcal{L}_{\text{RM}}(\phi) = -\mathbb{E}_{(x, y_w, y_l)} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]$$

Note that only *differences* in reward matter. The absolute scale is arbitrary -- adding a constant to all rewards does not change the loss.

### Architecture

The reward model is typically a transformer initialized from the SFT model checkpoint:

1. Remove the language modeling head (token prediction layer)
2. Add a scalar projection: the final hidden state of the last token is projected to a single scalar $r \in \mathbb{R}$
3. Fine-tune the full model (or apply LoRA) on preference data

Using the SFT model as initialization is critical: the reward model must understand language well enough to evaluate response quality, and the pretrained representations provide this foundation.

### Preference Data Collection

Human annotators are presented with a prompt and $K$ candidate responses (typically $K = 4$--$9$) and rank them. From $K$ responses, $\binom{K}{2}$ pairwise comparisons can be extracted, providing significant data efficiency. InstructGPT collected rankings over $K = 4$--$9$ responses per prompt, yielding roughly $\binom{K}{2} = 6$--$36$ comparisons per annotation task.

### The Overoptimization Problem (Goodhart's Law)

The reward model is an imperfect proxy for true human preferences. As the policy is optimized against this proxy, it eventually finds inputs that score highly on $r_\phi$ but are not genuinely good -- this is Goodhart's Law: "When a measure becomes a target, it ceases to be a good measure."

Gao et al. (2023) quantified this precisely. Defining the "gold" reward $r^*$ (from a much larger, more capable reward model) and the proxy reward $r_\phi$:

$$r^* \approx \alpha \sqrt{D_{\text{KL}}(\pi_\theta \| \pi_{\text{ref}})} - \beta \, D_{\text{KL}}(\pi_\theta \| \pi_{\text{ref}})$$

True quality initially increases with KL divergence (the policy is genuinely improving), then peaks and decreases (the policy is exploiting reward model errors). The optimal KL budget depends on reward model quality.

### Ensemble Approaches

To mitigate overoptimization, practitioners train multiple reward models and use conservative reward estimates:

$$r_{\text{ensemble}}(x, y) = \mu_{\text{RM}}(x, y) - \alpha \cdot \sigma_{\text{RM}}(x, y)$$

where $\mu_{\text{RM}}$ and $\sigma_{\text{RM}}$ are the mean and standard deviation across ensemble members. This penalizes responses where reward models disagree, which correlates with regions where the proxy is unreliable.

## Why It Matters

The reward model is the critical bottleneck in LLM alignment. If the reward model is wrong, PPO will optimize toward the wrong objective -- producing models that are confidently bad. Every failure mode of RLHF (sycophancy, verbosity, reward hacking) can be traced back to reward model limitations. Improving reward modeling is arguably more important than improving the RL algorithm.

## Key Technical Details

- **Data scale**: InstructGPT used ~33K comparisons; modern systems use 100K--1M+ comparisons. Quality matters more than quantity.
- **Inter-annotator agreement**: Typically 60--75% on pairwise comparisons for open-ended tasks, setting a ceiling on reward model accuracy.
- **Reward model size**: Usually the same architecture as the policy model, or smaller. InstructGPT used a 6B RM for a 175B policy.
- **Calibration**: Reward models are poorly calibrated in absolute terms. A reward of 2.0 vs 1.0 does not mean "twice as good." Only the ordering matters.
- **Training epochs**: 1--2 epochs over preference data. Overfitting to preference data causes reward models to memorize rather than generalize.
- **Reward model accuracy**: State-of-the-art models achieve 65--75% accuracy on held-out preference test sets, roughly matching inter-annotator agreement.
- **Length bias**: Reward models often assign higher scores to longer responses, conflating verbosity with quality. Length normalization or length-conditional training mitigates this.

## Common Misconceptions

- **"The reward model learns an absolute quality score."** It learns only to *rank* responses. The absolute scale is meaningless, and a reward of 3.5 does not indicate a specific quality level.
- **"More preference data always improves the reward model."** Data quality matters more than quantity. Noisy labels from low-agreement annotators can degrade performance. Filtering by annotator agreement improves results.
- **"The reward model captures all of human values."** It captures statistical patterns in the preferences of a specific group of annotators for a specific set of prompts. It does not generalize to unseen domains or cultural contexts without additional data.
- **"A perfect reward model would solve alignment."** Even with a perfect reward model, the optimization process itself introduces challenges: distributional shift, mode collapse, and the difficulty of balancing multiple objectives (helpfulness vs. harmlessness).

## Connections to Other Concepts

- `rlhf-pipeline.md` -- Reward modeling is Stage 2 of the RLHF pipeline, feeding into PPO optimization.
- `ppo-for-language-models.md` -- The reward model provides the training signal that PPO optimizes against.
- `dpo-as-implicit-rl.md` -- DPO eliminates the explicit reward model by deriving an implicit one from the policy itself.
- `grpo.md` -- GRPO can use either a learned reward model or verifiable rewards, sidestepping some overoptimization concerns.
- `rlaif-and-constitutional-ai.md` -- Replaces human annotators in preference data collection with AI-generated labels.
- `rlvr.md` -- Uses objectively verifiable rewards instead of learned reward models, completely avoiding Goodhart's Law.
- `06-advanced-methods/inverse-reinforcement-learning.md` -- Reward modeling is conceptually a form of inverse RL: inferring the reward function from demonstrations of preference.
- `06-advanced-methods/reward-shaping.md` -- Understanding how reward signals guide optimization and the risks of misspecified rewards.

## Further Reading

- **Christiano et al. (2017), "Deep Reinforcement Learning from Human Preferences"** -- Introduced the framework of training reward models from pairwise human comparisons and using them for RL optimization.
- **Gao et al. (2023), "Scaling Laws for Reward Model Overoptimization"** -- Rigorously quantifies how proxy reward diverges from true quality as optimization pressure increases, establishing the $\sqrt{\text{KL}}$ relationship.
- **Coste et al. (2023), "Reward Model Ensembles Help Mitigate Overoptimization"** -- Demonstrates that ensembles of reward models provide more robust training signals and delay the onset of overoptimization.
- **Lambert et al. (2024), "RewardBench: Evaluating Reward Models for Language Modeling"** -- A comprehensive benchmark for evaluating reward model quality across safety, reasoning, and instruction-following dimensions.
