# RLHF Pipeline

**One-Line Summary**: The three-stage process (SFT, reward model, PPO) that transformed language models from text predictors into aligned assistants -- the alignment breakthrough where a 1.3B parameter RLHF model outperformed a 175B parameter supervised-only model.

**Prerequisites**: Policy gradient theorem (`04-policy-gradient-methods/policy-gradient-theorem.md`), PPO (`04-policy-gradient-methods/proximal-policy-optimization.md`), reward shaping (`06-advanced-methods/reward-shaping.md`), KL divergence, supervised fine-tuning basics.

## What Is the RLHF Pipeline?

Imagine training a new employee. First, you give them a manual and have them practice standard procedures (supervised fine-tuning). Then, you have experienced managers evaluate pairs of their work samples and say which is better (reward modeling). Finally, you let them work independently while a scoring system trained on those manager preferences guides their improvement (PPO optimization). At no point did you write an explicit rulebook for "good work" -- instead, the system learned what humans prefer.

Reinforcement Learning from Human Feedback (RLHF) is this three-stage pipeline applied to language models. A pretrained LLM first learns to follow instructions through supervised fine-tuning (SFT), then a reward model learns to predict human preferences from pairwise comparisons, and finally PPO optimizes the language model's policy against this learned reward signal. This pipeline, formalized in the InstructGPT paper (Ouyang et al., 2022), is the process that turned GPT-3 from an autocomplete engine into ChatGPT.

## How It Works

### Stage 1: Supervised Fine-Tuning (SFT)

The pretrained language model $\pi_{\text{pretrain}}$ is fine-tuned on high-quality demonstration data -- typically prompt-response pairs written by human annotators:

$$\mathcal{L}_{\text{SFT}}(\theta) = -\mathbb{E}_{(x,y) \sim \mathcal{D}_{\text{demo}}} \left[ \sum_{t=1}^{T} \log \pi_\theta(y_t | x, y_{<t}) \right]$$

This produces $\pi_{\text{SFT}}$, which can follow instructions but lacks nuance in quality. InstructGPT used roughly 13,000 demonstration examples for this stage.

### Stage 2: Reward Model Training

Human annotators compare pairs of model outputs $(y_w, y_l)$ for the same prompt $x$, indicating which response is preferred. A reward model $r_\phi(x, y)$ is trained using the Bradley-Terry preference model:

$$\mathcal{L}_{\text{RM}}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_{\text{pref}}} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]$$

where $\sigma$ is the sigmoid function. The reward model is typically initialized from the SFT model with the final unembedding layer replaced by a scalar projection head. InstructGPT collected approximately 33,000 pairwise comparisons for this stage.

### Stage 3: PPO Optimization

The SFT model is further optimized using PPO against the learned reward model. The objective includes a critical KL divergence penalty:

$$\mathcal{J}(\theta) = \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot|x)} \left[ r_\phi(x, y) - \beta \, D_{\text{KL}}\left(\pi_\theta(\cdot|x) \,\|\, \pi_{\text{SFT}}(\cdot|x)\right) \right]$$

The KL penalty $\beta \, D_{\text{KL}}$ serves two purposes: (1) it prevents the policy from drifting too far from the SFT model, avoiding mode collapse and incoherent text, and (2) it acts as a regularizer against reward model overoptimization (exploiting flaws in $r_\phi$ rather than genuinely improving quality).

### How Each Stage Maps to RL Concepts

| RLHF Stage | RL Concept |
|---|---|
| SFT model $\pi_{\text{SFT}}$ | Behavioral cloning / imitation learning |
| Reward model $r_\phi$ | Learned reward function (inverse RL) |
| PPO optimization | Policy gradient with clipped surrogate |
| KL penalty | Entropy regularization / trust region |
| Text generation | Sequential decision-making (token-level actions) |

## Why It Matters

The InstructGPT paper demonstrated a stunning result: a 1.3B parameter model trained with RLHF was preferred by human raters over the 175B parameter GPT-3 without RLHF. This 100x parameter disadvantage overcome by alignment training showed that *how* a model is trained matters more than *how big* it is for producing useful outputs. RLHF is the reason modern chatbots are helpful, harmless, and honest rather than producing the unfiltered, often toxic outputs of raw pretrained models.

## Key Technical Details

- **Scale of human data**: InstructGPT used ~13K demonstrations for SFT and ~33K comparisons for reward modeling -- tiny relative to pretraining data (hundreds of billions of tokens).
- **KL coefficient**: Typical $\beta$ values range from 0.01 to 0.2. Too low leads to reward hacking; too high prevents meaningful optimization.
- **Four models in memory**: During PPO, four models must be loaded simultaneously: the active policy $\pi_\theta$, the reference policy $\pi_{\text{SFT}}$ (for KL computation), the reward model $r_\phi$, and the value function $V_\psi$.
- **Reward model size**: InstructGPT used a 6B reward model. Larger reward models generally produce better alignment, but with diminishing returns beyond the policy model's size.
- **Training instability**: RLHF with PPO is notoriously sensitive to hyperparameters. Learning rates of $1 \times 10^{-6}$ to $5 \times 10^{-6}$ are common, far lower than standard supervised training.
- **Reward hacking**: Without the KL penalty, models quickly learn to exploit reward model weaknesses -- generating verbose, sycophantic, or formulaic responses that score highly but are not genuinely better.

## Common Misconceptions

- **"RLHF requires millions of human labels."** InstructGPT used fewer than 50K total human annotations across both stages. The leverage comes from the pretrained model already knowing language -- RLHF just steers it.
- **"The reward model replaces human judgment."** The reward model is an imperfect proxy. It captures patterns in human preferences but can be exploited. This is why the KL penalty and reward model ensembles are critical.
- **"SFT alone is sufficient for alignment."** SFT teaches the model the *format* of helpful responses but not the *quality gradient*. RLHF provides the signal for "this response is better than that one," which SFT cannot express.
- **"RLHF is just fine-tuning with extra steps."** The RL stage fundamentally changes optimization dynamics. Unlike supervised learning which pushes toward specific targets, RLHF explores the generation space and reinforces high-reward regions, discovering behaviors not present in the training data.

## Connections to Other Concepts

- `ppo-for-language-models.md` -- The detailed mechanics of how PPO is adapted for the text generation setting in Stage 3.
- `reward-modeling-for-llms.md` -- Deep dive into Stage 2, including the Bradley-Terry model, data collection, and overoptimization.
- `dpo-as-implicit-rl.md` -- An alternative that collapses Stages 2 and 3 into a single supervised objective, eliminating the RL loop entirely.
- `rlaif-and-constitutional-ai.md` -- Replacing human annotators in Stage 2 with AI-generated preferences for scalability.
- `04-policy-gradient-methods/proximal-policy-optimization.md` -- The underlying RL algorithm powering Stage 3.
- `06-advanced-methods/inverse-reinforcement-learning.md` -- Reward modeling can be seen as a form of inverse RL: inferring the reward from human demonstrations of preference.
- `06-advanced-methods/reward-shaping.md` -- The KL penalty is a form of potential-based reward shaping that preserves the optimal policy relative to the reference.

## Further Reading

- **Ouyang et al. (2022), "Training Language Models to Follow Instructions with Human Feedback"** -- The InstructGPT paper that formalized the three-stage RLHF pipeline and demonstrated the 1.3B vs 175B result.
- **Christiano et al. (2017), "Deep Reinforcement Learning from Human Preferences"** -- The foundational work on learning reward models from pairwise human comparisons, originally applied to Atari and MuJoCo.
- **Stiennon et al. (2020), "Learning to Summarize from Human Feedback"** -- Applied RLHF to text summarization, demonstrating that RL optimization against a learned reward model significantly outperforms supervised fine-tuning alone.
- **Bai et al. (2022), "Training a Helpful and Harmless Assistant with Reinforcement Learning from Human Feedback"** -- Anthropic's comprehensive study scaling RLHF and analyzing the tension between helpfulness and harmlessness.
