# Actor-Critic Methods

**One-Line Summary**: A two-network architecture that combines a policy (the actor) with a learned value function (the critic) to reduce the high variance of pure policy gradient methods while maintaining low bias.

**Prerequisites**: REINFORCE (`reinforce.md`), Policy Gradient Theorem (`policy-gradient-theorem.md`), Temporal Difference learning, value function approximation, bias-variance trade-off.

## What Is Actor-Critic?

Imagine a figure skater and her coach. The skater (the actor) performs routines and makes real-time decisions about jumps, spins, and footwork. The coach (the critic) watches each move and provides immediate feedback: "that triple axel was above your average -- do more of that" or "that spin was below your usual standard -- adjust your technique." The skater does not have to wait until the end of the entire program to learn. She improves move by move, guided by the coach's running evaluation.

In RL terms, the actor is a parameterized policy $\pi_\theta(a|s)$ that selects actions. The critic is a learned value function $V_\phi(s)$ (or $Q_\phi(s,a)$) that evaluates how good the current situation is. The critic's feedback replaces the noisy Monte Carlo returns used in REINFORCE with lower-variance, bootstrapped estimates.

## How It Works

### The Core Idea: Bootstrapped Policy Gradients

REINFORCE uses the full Monte Carlo return $G_t$ to weight the policy gradient. Actor-critic replaces this with a **bootstrapped target** based on the TD error:

$$\delta_t = r_t + \gamma V_\phi(s_{t+1}) - V_\phi(s_t)$$

The TD error $\delta_t$ is an unbiased estimate of the advantage $A(s_t, a_t)$ when $V_\phi = V^\pi$ (the true value function). The policy gradient becomes:

$$\nabla_\theta J(\theta) \approx \mathbb{E} \left[ \sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t|s_t) \cdot \delta_t \right]$$

### One-Step Actor-Critic Algorithm

1. Initialize actor parameters $\theta$ and critic parameters $\phi$.
2. Observe initial state $s_0$.
3. For each time step $t$:
   - Sample action $a_t \sim \pi_\theta(\cdot | s_t)$.
   - Execute $a_t$, observe reward $r_t$ and next state $s_{t+1}$.
   - Compute TD error: $\delta_t = r_t + \gamma V_\phi(s_{t+1}) - V_\phi(s_t)$.
   - Update critic: $\phi \leftarrow \phi + \alpha_\phi \delta_t \nabla_\phi V_\phi(s_t)$.
   - Update actor: $\theta \leftarrow \theta + \alpha_\theta \delta_t \nabla_\theta \log \pi_\theta(a_t|s_t)$.

This is an **online** algorithm: it updates after every single transition, not after complete episodes.

### The Bias-Variance Trade-off vs. REINFORCE

| Property | REINFORCE | Actor-Critic |
|---|---|---|
| Return estimate | Monte Carlo $G_t$ (unbiased, high variance) | Bootstrapped $\delta_t$ (biased, lower variance) |
| Update frequency | End of episode | Every time step |
| Sample efficiency | Low (full episodes wasted) | Higher (learns from each transition) |
| Requires critic | No (optional baseline) | Yes |
| Bias source | None | Imperfect value function $V_\phi \neq V^\pi$ |

The critic introduces bias because $V_\phi$ is an approximation. Early in training, when $V_\phi$ is poor, the bias can be substantial. However, the variance reduction is so significant that actor-critic methods almost always converge faster in practice.

### N-Step Actor-Critic

The one-step TD error uses a single reward before bootstrapping. We can interpolate between pure TD (one step) and pure Monte Carlo (all steps) using **n-step returns**:

$$G_t^{(n)} = \sum_{k=0}^{n-1} \gamma^k r_{t+k} + \gamma^n V_\phi(s_{t+n})$$

$$\delta_t^{(n)} = G_t^{(n)} - V_\phi(s_t)$$

Larger $n$ reduces bias (more real rewards, less reliance on the imperfect critic) but increases variance (more randomness in the sampled trajectory). This idea is generalized fully by GAE in `advantage-estimation.md`.

### Shared vs. Separate Networks

A practical design choice is whether the actor and critic share neural network layers. Shared representations can improve data efficiency (both learn useful features), but can also create harmful gradient interference -- the critic's loss landscape may push shared features in directions that harm the actor. Common architectures use a shared trunk with separate heads for policy logits and value predictions.

## Why It Matters

Actor-critic methods are the backbone of nearly all modern policy gradient algorithms. A3C, A2C, PPO, SAC, and IMPALA are all actor-critic methods at their core. The actor-critic paradigm resolved the central practical limitation of REINFORCE (high variance) while preserving the ability to optimize stochastic policies directly. Without this architecture, policy gradient methods would be too sample-inefficient for complex tasks like robotic manipulation, game playing, or language model alignment.

## Key Technical Details

- Separate learning rates for actor ($\alpha_\theta$) and critic ($\alpha_\phi$) are standard. The critic typically uses a higher learning rate (e.g., $3 \times 10^{-4}$) than the actor (e.g., $1 \times 10^{-4}$) because a good critic accelerates actor learning.
- The critic loss is typically MSE: $L_\phi = \frac{1}{2}(V_\phi(s_t) - G_t^{\text{target}})^2$, sometimes clipped to prevent large updates.
- Entropy regularization (`entropy-regularization.md`) is almost always added to the actor's objective in practice.
- The critic can estimate $V(s)$, $Q(s,a)$, or $A(s,a)$. V-function critics are most common because they require no action input, simplifying the architecture.
- Gradient clipping (e.g., max norm of 0.5) is standard to prevent destabilizing updates from rare, high-magnitude TD errors.

## Common Misconceptions

- **"Actor-critic is a specific algorithm."** It is an architecture and design pattern, not a single algorithm. A2C, A3C, PPO, SAC, and TD3 are all actor-critic algorithms with very different update rules.
- **"The critic's only purpose is to reduce variance."** The critic also enables online learning (no need to wait for episode termination), handles continuing (non-episodic) tasks naturally, and provides the advantage estimates needed by advanced methods like PPO.
- **"Bias from bootstrapping is always harmful."** In practice, the bias from a reasonably trained critic is small and decreasing over time, while the variance reduction is immediate and large. The net effect is strongly positive.
- **"Shared actor-critic networks are always better."** Shared networks can suffer from conflicting gradient signals. Many high-performance implementations (e.g., OpenAI's PPO for RLHF) use separate networks.

## Connections to Other Concepts

- `reinforce.md` -- The pure Monte Carlo predecessor. Actor-critic can be viewed as REINFORCE with bootstrapped returns replacing Monte Carlo returns.
- `advantage-estimation.md` -- GAE provides the sophisticated advantage estimates used in modern actor-critic implementations.
- `a2c-and-a3c.md` -- Specific parallel actor-critic architectures that scale the paradigm to multiple workers.
- `proximal-policy-optimization.md` -- The most widely used actor-critic algorithm, adding clipped surrogate objectives for stability.
- `entropy-regularization.md` -- A critical addition to the actor's loss to maintain exploration in actor-critic training.

## Further Reading

- **Konda & Tsitsiklis (2003), "On Actor-Critic Algorithms"** -- A rigorous convergence analysis of two-timescale actor-critic methods, proving convergence under appropriate learning rate schedules.
- **Sutton & Barto (2018), "Reinforcement Learning: An Introduction," Chapter 13.5** -- Textbook treatment of actor-critic methods with clear derivations and the episodic semi-gradient one-step actor-critic algorithm.
- **Grondman et al. (2012), "A Survey of Actor-Critic Reinforcement Learning"** -- Comprehensive overview of actor-critic variants, covering natural gradients, compatible function approximation, and continuous action spaces.
- **Mnih et al. (2016), "Asynchronous Methods for Deep Reinforcement Learning"** -- Introduces A3C, the deep actor-critic method that demonstrated the architecture's scalability.
