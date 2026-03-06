# GRPO

**One-Line Summary**: DeepSeek's Group Relative Policy Optimization eliminates the value function entirely by estimating advantages from groups of sampled outputs -- a critic-free RL algorithm that is simpler, cheaper, and powered the reasoning breakthroughs in DeepSeek-R1.

**Prerequisites**: PPO for language models (`07-rl-for-language-models/ppo-for-language-models.md`), advantage estimation (`04-policy-gradient-methods/advantage-estimation.md`), policy gradient theorem (`04-policy-gradient-methods/policy-gradient-theorem.md`), REINFORCE (`04-policy-gradient-methods/reinforce.md`).

## What Is GRPO?

Imagine a teacher grading essays. Traditional PPO is like having two systems: one that grades each essay on an absolute scale (the reward model) and another that predicts what grade each student will typically get (the value function/critic). The teacher then focuses improvement efforts on essays that exceeded expectations (positive advantage) and discourages those that fell short (negative advantage).

GRPO takes a simpler approach: for each prompt, generate a *group* of essays, score them all, and then rank them relative to each other. No prediction of expected performance is needed -- the group itself provides the baseline. If you wrote five essays and one scored significantly above the group average, that one gets reinforced. This is the core insight: **the group replaces the critic**.

Group Relative Policy Optimization (GRPO), introduced by DeepSeek (Shao et al., 2024), removes the value function $V_\psi$ from the PPO pipeline and instead computes advantages by normalizing rewards within a group of sampled outputs for the same prompt.

## How It Works

### The GRPO Algorithm

For each prompt $x_i$ in a training batch:

**Step 1: Group Sampling.** Sample a group of $G$ complete responses from the current policy:

$$\{y_i^1, y_i^2, \ldots, y_i^G\} \sim \pi_\theta(\cdot | x_i)$$

Typical group sizes are $G = 8$--$64$.

**Step 2: Reward Scoring.** Compute rewards for each response:

$$r_i^j = r(x_i, y_i^j), \quad j = 1, \ldots, G$$

These can be from a learned reward model or verifiable reward functions (as in RLVR).

**Step 3: Group-Relative Advantage.** Normalize rewards within the group to compute advantages:

$$\hat{A}_i^j = \frac{r_i^j - \text{mean}(\{r_i^1, \ldots, r_i^G\})}{\text{std}(\{r_i^1, \ldots, r_i^G\})}$$

This z-score normalization means that within every group, some responses have positive advantages and some have negative, regardless of the absolute reward scale.

**Step 4: Policy Optimization.** Apply the PPO-style clipped objective using these group-relative advantages. For each token $y_{i,t}^j$ in response $y_i^j$:

$$\mathcal{L}_{\text{GRPO}}(\theta) = -\frac{1}{G} \sum_{j=1}^{G} \frac{1}{|y_i^j|} \sum_{t=1}^{|y_i^j|} \min\left(\rho_{i,t}^j \hat{A}_i^j, \, \text{clip}(\rho_{i,t}^j, 1-\epsilon, 1+\epsilon) \hat{A}_i^j \right)$$

where $\rho_{i,t}^j = \frac{\pi_\theta(y_{i,t}^j | s_{i,t}^j)}{\pi_{\theta_{\text{old}}}(y_{i,t}^j | s_{i,t}^j)}$ and $\hat{A}_i^j$ is applied uniformly to all tokens in the response.

**Step 5: KL Regularization.** A KL penalty is added to prevent divergence from the reference policy:

$$\mathcal{J}(\theta) = \mathcal{L}_{\text{GRPO}}(\theta) - \beta \, D_{\text{KL}}(\pi_\theta \| \pi_{\text{ref}})$$

### Why Group Normalization Works

The group-relative advantage serves the same purpose as the value function baseline in PPO: variance reduction. In standard PPO, $\hat{A}_t = R_t - V_\psi(s_t)$ subtracts the expected return as a baseline. In GRPO, the group mean $\text{mean}(\{r_i^j\})$ serves as an empirical estimate of this expected return, and dividing by the standard deviation further stabilizes the gradient signal.

The key trade-off: GRPO's baseline has higher variance than a well-trained value function (it is estimated from $G$ samples rather than learned over the entire training history), but it has zero bias (no function approximation error) and zero additional parameters.

### Comparison with PPO

| Aspect | PPO for LLMs | GRPO |
|---|---|---|
| Models in memory | 4 (policy, reference, reward, value) | 3 (policy, reference, reward) |
| Advantage estimation | GAE with learned $V_\psi$ | Group normalization of rewards |
| Advantage per token | Token-level (varies within response) | Sequence-level (same for all tokens) |
| Additional training | Value function must be trained | No additional training needed |
| Memory savings | Baseline | ~25% reduction (no value model) |
| Hyperparameter sensitivity | High (GAE $\lambda$, value loss coeff.) | Lower (group size $G$ is main choice) |

## Why It Matters

GRPO was the RL algorithm behind DeepSeek-R1, one of the most capable open reasoning models. Its simplicity matters: removing the value function eliminates an entire source of instability (value function approximation error), reduces memory requirements by roughly 25%, and removes multiple hyperparameters ($\gamma$, $\lambda$, value function learning rate, value loss coefficient). For teams with limited compute, going from four models to three in memory is the difference between training on available hardware and needing to upgrade.

## Key Technical Details

- **Group size**: $G = 16$--$64$ is typical. Larger groups provide better baseline estimates but require more generation compute.
- **Sequence-level advantages**: Unlike PPO's token-level advantages, GRPO assigns the same advantage to every token in a response. This is a simplification that works well in practice because the reward itself is sequence-level.
- **Length normalization**: Dividing the objective by response length $|y_i^j|$ prevents a bias toward shorter responses when using sequence-level advantages.
- **Reward sources**: GRPO is reward-agnostic. DeepSeek-R1 used it with both verifiable rewards (math, code) and learned reward models.
- **Generation cost**: The main cost of GRPO is generating $G$ responses per prompt vs. 1 in PPO. However, generation can be parallelized efficiently, and the elimination of value function training and storage partially offsets this.
- **No warm-start needed**: Unlike PPO's value function, which requires careful initialization and warm-up, GRPO works immediately since advantages are computed from scratch each iteration.
- **Clip parameter**: $\epsilon = 0.2$ is used, consistent with standard PPO.

## Common Misconceptions

- **"GRPO is just REINFORCE with a different baseline."** While conceptually related, GRPO incorporates PPO's clipped objective for stable updates and per-group normalization for robust advantage estimation. Standard REINFORCE with a batch-mean baseline does not include clipping and uses a global rather than per-prompt baseline.
- **"Removing the value function always hurts performance."** For language models with sequence-level rewards, the value function's benefit is smaller than in environments with dense rewards. The value function primarily helps with credit assignment within an episode, but GRPO sidesteps this by assigning uniform advantages across tokens.
- **"GRPO only works with verifiable rewards."** While it was popularized with RLVR for math and code, GRPO works with any reward signal, including learned reward models. The group normalization is reward-agnostic.
- **"Larger groups are always better."** Beyond $G \approx 64$, the marginal improvement in baseline quality diminishes rapidly while generation costs scale linearly. The optimal group size balances statistical quality with compute budget.

## Connections to Other Concepts

- `ppo-for-language-models.md` -- GRPO directly simplifies PPO by removing the value function; understanding PPO's four-model architecture clarifies what GRPO eliminates.
- `rlhf-pipeline.md` -- GRPO can replace PPO in Stage 3 of the RLHF pipeline.
- `rlvr.md` -- GRPO paired with verifiable rewards was the training recipe for DeepSeek-R1's reasoning capabilities.
- `reward-modeling-for-llms.md` -- GRPO can use either learned reward models or verifiable rewards as the reward source.
- `04-policy-gradient-methods/reinforce.md` -- GRPO's group normalization can be seen as a structured form of REINFORCE's baseline.
- `04-policy-gradient-methods/advantage-estimation.md` -- GRPO replaces GAE with a simpler, bias-free but higher-variance group-based estimator.
- `04-policy-gradient-methods/proximal-policy-optimization.md` -- GRPO retains PPO's clipped surrogate objective while discarding its critic.

## Further Reading

- **Shao et al. (2024), "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models"** -- Introduces GRPO and demonstrates its effectiveness for mathematical reasoning, showing it matches or exceeds PPO performance with simpler implementation.
- **DeepSeek-AI (2025), "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning"** -- Uses GRPO as the core RL algorithm for training DeepSeek-R1, demonstrating emergent chain-of-thought reasoning from pure RL with verifiable rewards.
- **Ahmadian et al. (2024), "Back to Basics: Revisiting REINFORCE-Style Optimization for Learning from Human Feedback in LLMs"** -- Provides theoretical and empirical analysis showing that simpler policy gradient methods (including GRPO-like approaches) can match PPO for LLM alignment.
- **Schulman et al. (2017), "Proximal Policy Optimization Algorithms"** -- The original PPO paper; necessary context for understanding what GRPO preserves (clipping) and what it discards (the critic).
