# REINFORCE

**One-Line Summary**: The simplest policy gradient algorithm -- sample a complete trajectory, weight each action's log-probability by the return that followed it, and update the policy in the direction that reinforces successful behavior.

**Prerequisites**: Policy Gradient Theorem (`policy-gradient-theorem.md`), Monte Carlo estimation, stochastic gradient ascent, parameterized policies $\pi_\theta(a|s)$.

## What Is REINFORCE?

Imagine a stand-up comedian trying new material. She performs an entire set (a complete episode), notes which jokes got laughs and which fell flat, then adjusts her routine accordingly. Jokes that produced big laughs get repeated more often; jokes that bombed get dropped. She has to finish the whole set before she can assess anything -- she cannot update mid-performance. This is REINFORCE: a complete-episode, Monte Carlo policy gradient method.

REINFORCE, introduced by Ronald Williams in 1992, is the most direct instantiation of the policy gradient theorem. It collects a full trajectory, computes the return from each time step, and updates the policy parameters to increase the probability of actions that led to high returns.

## How It Works

### The Algorithm

1. Initialize policy parameters $\theta$.
2. Repeat:
   - Sample a complete trajectory $\tau = (s_0, a_0, r_0, \ldots, s_{T-1}, a_{T-1}, r_{T-1})$ by following $\pi_\theta$.
   - For each time step $t$, compute the return: $G_t = \sum_{k=t}^{T-1} \gamma^{k-t} r_k$.
   - Update parameters:

$$\theta \leftarrow \theta + \alpha \sum_{t=0}^{T-1} \gamma^t G_t \nabla_\theta \log \pi_\theta(a_t | s_t)$$

That is it. No value function, no bootstrapping, no replay buffer. Pure Monte Carlo policy gradient.

### The High Variance Problem

REINFORCE suffers from extreme variance. Consider why: the return $G_t$ is a single random sample of the expected future reward. In a stochastic environment, two identical actions in the same state can produce wildly different returns due to randomness in transitions and future actions. This noise propagates directly into the gradient estimate.

Variance scales with trajectory length, reward magnitude, and stochasticity of the environment. In practice, raw REINFORCE can require millions of episodes to converge on even simple tasks.

### Baseline Subtraction

The most important variance reduction technique is subtracting a **baseline** $b(s_t)$ from the return:

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau} \left[ \sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t|s_t) \cdot (G_t - b(s_t)) \right]$$

Crucially, any baseline that depends only on the state (not the action) leaves the gradient **unbiased**. This follows from:

$$\mathbb{E}_{a \sim \pi_\theta} \left[ b(s) \nabla_\theta \log \pi_\theta(a|s) \right] = b(s) \nabla_\theta \sum_a \pi_\theta(a|s) = b(s) \nabla_\theta 1 = 0$$

The optimal baseline in the minimum-variance sense is a weighted average of returns, but in practice, the state-value function $V(s_t)$ is used. This transforms the raw return into an advantage-like quantity $G_t - V(s_t)$: how much better was this trajectory than expected?

### REINFORCE with Baseline (Pseudocode)

1. Initialize policy parameters $\theta$ and value parameters $\phi$.
2. Repeat:
   - Sample trajectory $\tau$ under $\pi_\theta$.
   - Compute returns $G_t$ for each $t$.
   - Update value function: minimize $\sum_t (V_\phi(s_t) - G_t)^2$.
   - Update policy: $\theta \leftarrow \theta + \alpha \sum_t \nabla_\theta \log \pi_\theta(a_t|s_t)(G_t - V_\phi(s_t))$.

## Why It Matters

REINFORCE is the conceptual starting point for all policy gradient methods. Understanding its strengths (simplicity, unbiasedness, generality) and weaknesses (high variance, sample inefficiency) motivates every subsequent algorithm in the policy gradient lineage. Actor-critic methods reduce its variance by bootstrapping. PPO constrains its update step for stability. But the core mechanism -- reinforcing good actions via the score function -- remains unchanged throughout the entire family.

## Key Technical Details

- REINFORCE is **on-policy**: each trajectory is used for exactly one gradient update, then discarded. This is highly sample-inefficient.
- The $\gamma^t$ factor in front of $G_t$ is often omitted in practice (using undiscounted weighting of the gradient), which changes the objective but can improve empirical performance.
- Typical learning rates range from $10^{-4}$ to $10^{-2}$ depending on the task and parameterization.
- Batch REINFORCE collects $N$ trajectories before computing a single gradient update, reducing variance by a factor of $\sqrt{N}$ but requiring $N$ times more samples per update.
- Reward normalization (subtracting mean and dividing by standard deviation of returns across a batch) is a practical heuristic that acts as an adaptive baseline.
- For discrete action spaces, $\pi_\theta$ is typically a softmax over logits. For continuous actions, it is commonly a Gaussian $\mathcal{N}(\mu_\theta(s), \sigma_\theta(s)^2)$.

## Common Misconceptions

- **"REINFORCE with a baseline becomes actor-critic."** Not quite. REINFORCE with a baseline still uses Monte Carlo returns $G_t$. Actor-critic methods replace $G_t$ with bootstrapped estimates (e.g., TD targets), introducing bias but substantially reducing variance. The distinction is Monte Carlo vs. bootstrapping.
- **"The baseline must be the value function."** Any state-dependent function works. A constant baseline (e.g., the running average of returns) already helps significantly. The value function is simply the most effective common choice.
- **"REINFORCE cannot work in practice."** It can and does, especially for short-horizon problems or when combined with variance reduction. Williams' original experiments and many modern hyperparameter search methods use REINFORCE-style updates.
- **"More trajectories per batch always helps."** There are diminishing returns. Variance decreases as $O(1/N)$, so doubling the batch from 1000 to 2000 trajectories only reduces standard deviation by about 30%.

## Connections to Other Concepts

- `policy-gradient-theorem.md` -- The theoretical result that REINFORCE directly implements.
- `actor-critic-methods.md` -- The natural evolution of REINFORCE that introduces a learned critic to reduce variance via bootstrapping.
- `advantage-estimation.md` -- Generalizes the baseline subtraction idea into the full GAE framework.
- `entropy-regularization.md` -- Often added to the REINFORCE objective to prevent premature convergence in the absence of a critic.

## Further Reading

- **Williams (1992), "Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning"** -- The original paper introducing REINFORCE. Remarkably clear and readable, it establishes the log-probability trick and baseline subtraction as the core machinery of policy gradient methods.
- **Sutton & Barto (2018), "Reinforcement Learning: An Introduction," Chapter 13** -- The textbook treatment of REINFORCE with detailed derivations and pedagogical examples, including the short-corridor gridworld that illustrates why value-based methods struggle where policy gradients succeed.
- **Greensmith, Bartlett, & Baxter (2004), "Variance Reduction Techniques for Gradient Estimates in Reinforcement Learning"** -- A thorough analysis of baseline design and variance reduction for policy gradient estimators.
