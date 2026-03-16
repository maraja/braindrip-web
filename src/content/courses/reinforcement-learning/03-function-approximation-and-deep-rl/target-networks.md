# Target Networks

**One-Line Summary**: A frozen copy of the Q-network providing stable regression targets -- preventing the "moving target" instability.

**Prerequisites**: `q-learning.md`, `function-approximation.md`, `deep-q-networks.md`, `bellman-equations.md`

## What Are Target Networks?

Imagine trying to hit a bullseye on a target that moves every time you throw a dart. No matter how good your aim, the constant movement makes consistent improvement nearly impossible. Now imagine the target stays fixed for 100 throws, then moves to a new position. Suddenly, you can actually practice and improve between resets. Target networks apply this same principle to Q-learning: instead of letting the regression target shift with every gradient update, we freeze a copy of the network and use it to compute stable targets for thousands of steps before refreshing it.

In standard Q-learning with function approximation, the TD target $r + \gamma \max_{a'} Q(s', a'; \mathbf{w})$ depends on the same weights $\mathbf{w}$ being updated. This creates a feedback loop: each weight update changes both the prediction *and* the target, causing oscillation or divergence. Target networks break this loop by using a separate, periodically updated copy $\mathbf{w}^-$ for the target computation.

## How It Works

### The Instability Problem

Consider the Q-learning update with function approximation. At each step, we minimize:

$$L(\mathbf{w}) = \mathbb{E}\left[\left(y - Q(s, a; \mathbf{w})\right)^2\right]$$

where the target is $y = r + \gamma \max_{a'} Q(s', a'; \mathbf{w})$. The gradient is:

$$\nabla_\mathbf{w} L = -\mathbb{E}\left[\left(y - Q(s, a; \mathbf{w})\right) \nabla_\mathbf{w} Q(s, a; \mathbf{w})\right]$$

The problem: $y$ itself depends on $\mathbf{w}$. When we update $\mathbf{w}$ to make $Q(s, a; \mathbf{w})$ closer to $y$, we simultaneously change $y$. In supervised learning, labels are fixed; in Q-learning with function approximation, the "labels" move with every gradient step. This is analogous to a dog chasing its own tail -- the optimization target recedes as the agent approaches it, and generalization in the neural network means that updating one state's value can unpredictably shift values for other states.

### Hard Target Updates

DQN's original approach (Mnih et al., 2015) uses **hard updates**: maintain a target network $Q(s, a; \mathbf{w}^-)$ that is an exact copy of the online network, refreshed every $C$ steps:

$$\mathbf{w}^- \leftarrow \mathbf{w} \quad \text{every } C \text{ steps}$$

Between updates, $\mathbf{w}^-$ is completely frozen. The TD target becomes:

$$y = r + \gamma \max_{a'} Q(s', a'; \mathbf{w}^-)$$

This target is stationary for $C$ consecutive gradient steps, converting the RL problem into a sequence of supervised regression problems (each with a fixed target for $C$ steps). DQN uses $C = 10{,}000$, meaning the target network is refreshed roughly every 40,000 environment frames.

### Soft (Polyak) Updates

An alternative introduced by Lillicrap et al. (2016) in DDPG uses **soft updates** (also called Polyak averaging):

$$\mathbf{w}^- \leftarrow \tau \mathbf{w} + (1 - \tau) \mathbf{w}^-$$

This is applied after *every* gradient step, with $\tau \ll 1$ (typically $\tau = 0.005$ or $\tau = 0.001$). The target network slowly tracks the online network, providing smoother transitions than the abrupt hard update. The target weights become an exponential moving average of online weights.

> **Recommended visual**: Plot comparing the target network weight trajectory under hard updates (staircase function) vs. soft updates (smooth exponential tracking) over training steps.

### Why This Works: Stabilizing the Optimization Landscape

Target networks convert a non-stationary optimization problem into a series of approximately stationary ones. Between target updates, the loss surface $L(\mathbf{w})$ has a fixed shape because the targets $y$ are constant. The optimizer can make genuine progress toward the current target before the landscape shifts.

Formally, the Bellman operator $\mathcal{T}$ is a $\gamma$-contraction in the tabular case:

$$\|\mathcal{T}Q_1 - \mathcal{T}Q_2\|_\infty \leq \gamma \|Q_1 - Q_2\|_\infty$$

Target networks approximate applying $\mathcal{T}$ to a fixed $Q^-$ and then fitting $Q$ to the result, which more closely mirrors the provably convergent iteration $Q_{k+1} = \mathcal{T}Q_k$ than the fully online alternative where $Q$ and the target change simultaneously.

## Why It Matters

Target networks are one of the two innovations (alongside experience replay) that made deep Q-learning practical. Without them, the Q-network's loss landscape shifts erratically with each weight update, causing training to oscillate or diverge. The technique is now ubiquitous: virtually every value-based deep RL algorithm uses target networks, and the concept has been extended to actor-critic methods (DDPG, TD3, SAC) where both the critic and sometimes the actor have target copies.

## Key Technical Details

- **Hard update frequency**: DQN uses $C = 10{,}000$ gradient steps. Values too small (e.g., $C = 100$) provide insufficient stability; values too large (e.g., $C = 100{,}000$) cause the target to lag excessively behind the learned value.
- **Soft update rate**: $\tau = 0.005$ is standard for continuous-control algorithms (DDPG, TD3, SAC). Larger $\tau$ values track faster but provide less stability.
- **Hard vs. soft**: Hard updates are simpler but create discontinuities when the target network suddenly jumps. Soft updates are smoother but add a hyperparameter. In practice, soft updates are preferred for continuous-action domains; hard updates remain common for discrete-action domains.
- **Memory cost**: Target networks double the model's parameter memory. For DQN's ~1.7M parameters this is negligible; for large models it can matter.
- **No gradient through targets**: The target $y = r + \gamma \max_{a'} Q(s', a'; \mathbf{w}^-)$ is treated as a constant during backpropagation. Gradients flow through $Q(s, a; \mathbf{w})$ only.
- **Initialization**: The target network is initialized as an exact copy of the online network at the start of training.

## Common Misconceptions

- **"Target networks eliminate instability entirely."** They reduce it substantially but do not guarantee convergence. The combination of function approximation, bootstrapping, and off-policy data (the deadly triad from `function-approximation.md`) remains a fundamental challenge. Target networks make training *practical*, not *provably stable*.

- **"Soft updates are always better than hard updates."** This depends on the domain. Hard updates with appropriate $C$ work well for discrete-action problems (Atari). Soft updates are preferred in continuous control. There is no universal winner.

- **"The target network learns slower on purpose."** The target network does not *learn* at all -- it is passively updated (copied or blended) from the online network. Only the online network receives gradient updates. The target network is a reference point, not a learner.

## Connections to Other Concepts

- `double-dqn.md`: (`deep-q-networks.md`) introduced hard target updates as one of its two key innovations.
- `experience-replay.md`: (`experience-replay.md`) is the complementary stabilization mechanism, addressing data correlation rather than target non-stationarity.
- `double-dqn.md`: (`double-dqn.md`) uses the target network for value evaluation while the online network selects actions, further leveraging the two-network structure.
- `function-approximation.md`: (`function-approximation.md`) explains the deadly triad that necessitates target networks.
- `actor-critic-methods.md`: (`actor-critic-methods.md`) extend the target network concept to both policy and value networks.
- `bellman-equations.md`: (`bellman-equations.md`) provide the theoretical basis for the TD targets that the target network stabilizes.

## Further Reading

1. **"Human-level control through deep reinforcement learning" (Mnih et al., 2015)** -- Introduces hard target updates in the DQN context, with ablation showing their importance.
2. **"Continuous control with deep reinforcement learning" (Lillicrap et al., 2016)** -- Introduces soft (Polyak) target updates in the DDPG algorithm for continuous action spaces.
3. **"Addressing Function Approximation Error in Actor-Critic Methods" (Fujimoto, van Hoof & Precup, 2018)** -- TD3 paper that uses target networks for both critic networks and the actor, with delayed policy updates.
4. **"Deep Reinforcement Learning that Matters" (Henderson et al., 2018)** -- Empirical study showing how target network hyperparameters ($C$ and $\tau$) interact with other design choices, often in surprising ways.
