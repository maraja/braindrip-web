# Proximal Policy Optimization (PPO)

**One-Line Summary**: A clipped surrogate objective that approximates trust region constraints using only first-order optimization -- the dominant algorithm in modern reinforcement learning and the engine behind RLHF for large language models.

**Prerequisites**: Trust Region Methods (`trust-region-methods.md`), advantage estimation (`advantage-estimation.md`), actor-critic methods (`actor-critic-methods.md`), policy gradient theorem (`policy-gradient-theorem.md`), importance sampling basics.

## What Is PPO?

Imagine TRPO is a careful surgeon performing a delicate operation with specialized instruments, constant monitoring, and precise measurements at every step. PPO is the experienced field medic who achieves nearly the same outcomes using simple, robust techniques that work reliably under any conditions. Both prevent catastrophic harm, but PPO does it with a fraction of the complexity.

PPO, introduced by Schulman et al. (2017), replaces TRPO's computationally expensive constrained optimization (conjugate gradients, line search, Fisher-vector products) with a simple clipped objective function that can be optimized with standard stochastic gradient descent. This simplicity, combined with strong empirical performance, has made PPO the default choice for virtually every major RL application -- from OpenAI Five (Dota 2) to InstructGPT and ChatGPT (RLHF), to robotic control and game playing.

## How It Works

### The Probability Ratio

Define the ratio between the new and old policy's probability of taking action $a_t$ in state $s_t$:

$$r_t(\theta) = \frac{\pi_\theta(a_t | s_t)}{\pi_{\theta_\text{old}}(a_t | s_t)}$$

When $\theta = \theta_\text{old}$, this ratio equals 1. The standard surrogate objective from TRPO is:

$$L^{CPI}(\theta) = \mathbb{E}_t \left[ r_t(\theta) \hat{A}_t \right]$$

Without any constraint, maximizing $L^{CPI}$ can lead to destructively large policy updates when $r_t(\theta)$ deviates far from 1.

### The PPO-Clip Objective

PPO constrains the ratio by clipping it:

$$L^{CLIP}(\theta) = \mathbb{E}_t \left[ \min \left( r_t(\theta) \hat{A}_t, \; \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon) \hat{A}_t \right) \right]$$

where $\epsilon$ is the clipping parameter (default: 0.2). The $\min$ operation selects the more pessimistic (conservative) estimate of the improvement. Here is how it works for the two cases:

**When $\hat{A}_t > 0$** (the action was better than average):
- We want to increase $\pi_\theta(a_t|s_t)$, making $r_t > 1$.
- But $r_t$ is clipped at $1 + \epsilon$, so the objective flattens beyond that point.
- Gradient becomes zero for $r_t > 1 + \epsilon$: no further incentive to increase probability.

**When $\hat{A}_t < 0$** (the action was worse than average):
- We want to decrease $\pi_\theta(a_t|s_t)$, making $r_t < 1$.
- But $r_t$ is clipped at $1 - \epsilon$, so the objective flattens below that point.
- Gradient becomes zero for $r_t < 1 - \epsilon$: no further incentive to decrease probability.

The clipping creates a "trust region" in probability ratio space: the policy can change, but only within the band $[1-\epsilon, 1+\epsilon]$ per update. This is a first-order approximation to TRPO's KL divergence constraint.

### The Full PPO Algorithm

1. Collect a batch of trajectories using the current policy $\pi_{\theta_\text{old}}$.
2. Compute advantages $\hat{A}_t$ using GAE (`advantage-estimation.md`).
3. For $K$ epochs (typically 3-10) over the collected batch:
   - Compute ratios $r_t(\theta)$ and clipped surrogate loss $L^{CLIP}$.
   - Compute value function loss: $L^{VF} = (V_\phi(s_t) - V_t^{\text{target}})^2$.
   - Compute entropy bonus: $L^{ENT} = H[\pi_\theta(\cdot|s_t)]$.
   - Update $\theta$ to maximize: $L^{CLIP} - c_1 L^{VF} + c_2 L^{ENT}$.
4. Set $\theta_\text{old} \leftarrow \theta$ and return to step 1.

The key innovation is step 3: **multiple gradient steps on the same batch**. The clipping prevents the policy from moving too far from $\pi_{\theta_\text{old}}$, so reusing the batch is safe. This dramatically improves sample efficiency compared to single-update methods like A2C.

### PPO vs. TRPO: Simplicity Wins

| Aspect | TRPO | PPO |
|---|---|---|
| Constraint mechanism | KL divergence (exact) | Probability ratio clipping |
| Optimization | Conjugate gradient + line search | Standard SGD/Adam |
| Implementation | ~500 lines of specialized code | ~50 lines beyond A2C |
| Second-order info | Fisher-vector products | None needed |
| Multiple epochs per batch | No (constraint violations) | Yes (clipping protects) |
| Wall-clock speed | Slower per update | 3-5x faster per update |
| Performance | Strong | Equal or better |

### PPO for RLHF (Language Models)

In Reinforcement Learning from Human Feedback, PPO is used to fine-tune a language model $\pi_\theta$ to maximize a learned reward model $R$ while staying close to a reference policy $\pi_\text{ref}$. The RLHF objective is:

$$\max_\theta \; \mathbb{E}_{x \sim D, y \sim \pi_\theta(\cdot|x)} \left[ R(x, y) - \beta D_{KL}(\pi_\theta(\cdot|x) \| \pi_\text{ref}(\cdot|x)) \right]$$

PPO optimizes this by treating token generation as a sequential decision process. Each token is an action; the reward is assigned at the end of the sequence. The KL penalty prevents the model from drifting too far from the pretrained policy (reward hacking). PPO's stability under this setup is why it became the standard for aligning language models with human preferences.

## Why It Matters

PPO is arguably the single most important RL algorithm of the past decade. It powers:

- **OpenAI Five**: Dota 2 at superhuman level (2018-2019).
- **InstructGPT and ChatGPT**: RLHF alignment of GPT models (2022-2023).
- **Claude, Gemini**: RLHF and RLAIF pipelines for language model alignment.
- **OpenAI Gym / MuJoCo benchmarks**: Default baseline for continuous control research.
- **Robotic control**: Dexterous manipulation policies via sim-to-real transfer.

Its combination of simplicity, stability, and strong performance makes it the first algorithm most practitioners reach for. When a new RL problem arises, PPO is typically the default starting point.

## Key Technical Details

- **Clipping parameter $\epsilon$**: 0.2 is the near-universal default. Smaller values (0.1) are more conservative; larger values (0.3) allow faster but riskier updates.
- **Number of epochs $K$**: 3-10 per batch. More epochs extract more from each batch but risk overfitting to it. PPO for RLHF typically uses $K = 1$-$4$.
- **Minibatch size**: The batch is usually split into minibatches (e.g., 32-512 transitions) for stochastic optimization within each epoch.
- **GAE parameters**: $\gamma = 0.99$, $\lambda = 0.95$ are standard defaults.
- **Value function clipping**: Some implementations clip the value function update similarly to the policy, preventing large changes: $V_\text{clipped} = V_{\text{old}} + \text{clip}(V - V_{\text{old}}, -\epsilon, \epsilon)$.
- **Learning rate**: Typically $3 \times 10^{-4}$ for Atari, $3 \times 10^{-4}$ for MuJoCo, often with linear decay to zero over training. RLHF uses $\sim 1 \times 10^{-5}$ to $5 \times 10^{-6}$.
- **Advantage normalization**: Advantages are normalized (zero mean, unit standard deviation) per minibatch. This is critical for stable training.
- **Gradient clipping**: Max gradient norm of 0.5 is standard to prevent spikes.
- The original paper also proposes PPO-Penalty (using adaptive KL penalty instead of clipping), but PPO-Clip dominates in practice.

## Common Misconceptions

- **"PPO clips the gradient."** PPO clips the objective (the probability ratio), not the gradient. The gradient flows normally through the unclipped region and is zero in the clipped region. Gradient clipping (by max norm) is a separate, standard technique used alongside PPO.
- **"PPO is an on-policy algorithm."** It is quasi-on-policy. Within a single iteration, PPO reuses the same batch across $K$ epochs, which is a mild form of off-policy learning. The clipping ensures this reuse is safe.
- **"PPO guarantees monotonic improvement."** Unlike TRPO, PPO has no formal theoretical guarantee. The clipping is a heuristic approximation of the trust region. In practice, PPO can still occasionally degrade performance, though far less frequently than unconstrained methods.
- **"PPO-Clip and PPO-Penalty are equivalent."** They produce different behaviors. PPO-Clip is a hard constraint (objective is flat beyond the clip), while PPO-Penalty is a soft penalty (large changes are penalized but not prevented). Clip dominates practice.
- **"A higher clip ratio means faster learning."** Beyond $\epsilon \approx 0.3$, the "trust region" becomes too loose and training destabilizes. The optimal $\epsilon$ depends on the problem but 0.2 is robust across diverse settings.

## Connections to Other Concepts

- `trust-region-methods.md` -- PPO approximates TRPO's KL constraint with a simpler clipping mechanism. Understanding TRPO theory clarifies why PPO works.
- `advantage-estimation.md` -- PPO uses GAE to compute $\hat{A}_t$. The quality of advantage estimates directly affects PPO's performance.
- `actor-critic-methods.md` -- PPO is an actor-critic method: the policy is the actor and the value function is the critic.
- `entropy-regularization.md` -- The entropy bonus $c_2 H[\pi_\theta]$ in PPO's loss prevents premature convergence.
- `a2c-and-a3c.md` -- PPO can be viewed as A2C with a clipped surrogate objective and multiple epochs per batch.
- `reinforce.md` -- PPO descends from REINFORCE through the lineage: REINFORCE -> Actor-Critic -> A2C -> TRPO -> PPO.

## Further Reading

- **Schulman et al. (2017), "Proximal Policy Optimization Algorithms"** -- The original PPO paper. Compares clipping and penalty variants across Atari, MuJoCo, and roboschool tasks, demonstrating that PPO-Clip matches or exceeds TRPO performance with dramatically simpler implementation.
- **Zheng et al. (2023), "Secrets of RLHF in Large Language Models Part I: PPO"** -- Detailed analysis of PPO implementation for RLHF, covering reward model design, KL penalty tuning, and practical tricks for stable language model training.
- **Engstrom et al. (2020), "Implementation Matters in Deep Policy Gradients: A Case Study on PPO and TRPO"** -- Demonstrates that much of PPO's advantage over TRPO comes from code-level implementation details (reward normalization, advantage normalization, gradient clipping) rather than the clipped objective alone.
- **Ouyang et al. (2022), "Training Language Models to Follow Instructions with Human Feedback"** -- The InstructGPT paper, demonstrating PPO's central role in the RLHF pipeline that transformed modern language model alignment.
