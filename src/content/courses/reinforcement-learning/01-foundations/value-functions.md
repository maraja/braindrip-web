# Value Functions

**One-Line Summary**: Expected future return from a state (V) or state-action pair (Q) -- the backbone of most RL algorithms.

**Prerequisites**: `markov-decision-processes.md`, `return-and-discount-factor.md`, `policies.md`.

## What Are Value Functions?

Imagine you are house-hunting. Some neighborhoods are objectively more desirable: good schools, low crime, close to transit. The "value" of being in a neighborhood captures not just what you experience today, but all the future benefits of living there. In RL, a **value function** does exactly this -- it estimates the total future reward an agent can expect from a given situation, accounting for everything that will happen from that point onward.

Value functions are the agent's internal estimate of "how good is it to be here?" They compress the infinite complexity of future trajectories into a single number per state, enabling the agent to make locally informed decisions with globally optimal consequences.

## How It Works

### State-Value Function $V^\pi(s)$

The **state-value function** under policy $\pi$ gives the expected return starting from state $s$ and following $\pi$ thereafter:

$$V^\pi(s) = \mathbb{E}_\pi [G_t \mid S_t = s] = \mathbb{E}_\pi \left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \;\middle|\; S_t = s \right]$$

This answers: "How good is it to be in state $s$ if I follow policy $\pi$?"

### Action-Value Function $Q^\pi(s, a)$

The **action-value function** (or Q-function) under policy $\pi$ gives the expected return starting from state $s$, taking action $a$, and following $\pi$ thereafter:

$$Q^\pi(s, a) = \mathbb{E}_\pi [G_t \mid S_t = s, A_t = a] = \mathbb{E}_\pi \left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \;\middle|\; S_t = s, A_t = a \right]$$

This answers: "How good is it to take action $a$ in state $s$ and then follow policy $\pi$?"

<!-- Recommended visual: Grid-world with V(s) values displayed in each cell,
     and arrows showing the greedy policy derived from V
     Source: Sutton & Barto (2018), Figure 3.2 or similar grid-world value visualization -->

### Relationship Between V and Q

The two value functions are intimately connected:

$$V^\pi(s) = \sum_{a \in \mathcal{A}} \pi(a \mid s) \, Q^\pi(s, a)$$

The state-value is the policy-weighted average of the action-values. Conversely:

$$Q^\pi(s, a) = R(s, a) + \gamma \sum_{s'} P(s' \mid s, a) \, V^\pi(s')$$

The action-value equals the immediate reward plus the discounted value of the next state, averaged over transition uncertainty.

### The Advantage Function

The **advantage function** measures how much better action $a$ is compared to the average action under $\pi$:

$$A^\pi(s, a) = Q^\pi(s, a) - V^\pi(s)$$

Key properties:
- $\sum_a \pi(a \mid s) A^\pi(s, a) = 0$ (the advantage is zero on average).
- $A^\pi(s, a) > 0$ means action $a$ is better than the policy's average.
- The advantage function is central to policy gradient methods (A2C, A3C, PPO, GAE).

### Optimal Value Functions

The **optimal state-value function** $V^*(s)$ is the maximum value achievable from state $s$ under any policy:

$$V^*(s) = \max_\pi V^\pi(s) = \max_a Q^*(s, a)$$

The **optimal action-value function** $Q^*(s, a)$ is the maximum expected return achievable starting from $(s, a)$:

$$Q^*(s, a) = \max_\pi Q^\pi(s, a) = R(s, a) + \gamma \sum_{s'} P(s' \mid s, a) \, V^*(s')$$

Once $Q^*$ is known, the optimal policy is immediately available:

$$\pi^*(s) = \arg\max_a Q^*(s, a)$$

This is why Q-learning and DQN focus on learning $Q^*$ -- the optimal policy falls out as a byproduct.

### Computing Value Functions

**Tabular case.** For small state spaces, $V$ and $Q$ are stored as tables (arrays). $V$ requires $|\mathcal{S}|$ entries; $Q$ requires $|\mathcal{S}| \times |\mathcal{A}|$ entries.

**Function approximation.** For large or continuous spaces, value functions are approximated:
- **Linear**: $V_\theta(s) = \theta^\top \phi(s)$, where $\phi(s)$ is a feature vector.
- **Neural network**: $V_\theta(s) = f_\theta(s)$, where $f_\theta$ is a deep network. DQN uses a CNN that takes $84 \times 84 \times 4$ frames as input and outputs $Q(s, a)$ for each of 18 Atari actions.

**Monte Carlo estimation.** Estimate $V^\pi(s)$ by averaging observed returns from state $s$ over many episodes:

$$V^\pi(s) \approx \frac{1}{N(s)} \sum_{i=1}^{N(s)} G_t^{(i)}$$

**Temporal-difference (TD) estimation.** Update $V$ after each step using bootstrapping:

$$V(S_t) \leftarrow V(S_t) + \alpha \left[ R_{t+1} + \gamma V(S_{t+1}) - V(S_t) \right]$$

The term $\delta_t = R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$ is called the **TD error**.

### Value Function Geometry

For a finite MDP with $|\mathcal{S}|$ states, the value function $V^\pi$ is a vector in $\mathbb{R}^{|\mathcal{S}|}$. The set of all achievable value functions forms a polytope in this space. The optimal value function $V^*$ sits at a vertex of this polytope, and policy improvement moves toward it.

## Why It Matters

Value functions are the workhorse of RL. They enable:
- **Policy evaluation**: Assessing how good a policy is without running it indefinitely.
- **Policy improvement**: Acting greedily with respect to $Q$ produces a better policy.
- **Planning**: In model-based RL, value functions guide lookahead search (e.g., AlphaZero uses a learned $V$ to evaluate board positions in MCTS).
- **Credit assignment**: Value functions propagate information about future rewards backward through time, solving the credit assignment problem.

## Key Technical Details

- **DQN** (Mnih et al., 2015) approximates $Q^*$ with a CNN and uses experience replay (buffer of $10^6$ transitions) and a target network (updated every $10{,}000$ steps) for stability.
- **Double Q-learning** (van Hasselt et al., 2016) addresses overestimation bias in Q-learning by decoupling action selection from evaluation.
- **Dueling networks** (Wang et al., 2016) decompose $Q(s, a) = V(s) + A(s, a)$ architecturally, sharing representation for the state-value.
- **Value function approximation can diverge** in the off-policy, function approximation, bootstrapping setting (the "deadly triad" identified by Sutton & Barto).
- For continuous actions, representing $Q(s, a)$ as a table or discrete output is impossible. Algorithms like DDPG and SAC use a separate network $Q_\theta(s, a)$ taking both $s$ and $a$ as input.

## Common Misconceptions

**"V and Q contain different information."** They encode the same information differently. Given the MDP dynamics, $V$ and $Q$ are fully interconvertible. $Q$ is more directly useful for action selection because you can compare actions without knowing the transition model.

**"Higher V(s) means the state is inherently better."** $V^\pi(s)$ depends on the policy $\pi$. A state might have high value under a good policy and low value under a bad one. Only $V^*(s)$ reflects the intrinsic quality of a state.

**"Value functions are always accurate after training."** Function approximation introduces systematic errors. Overestimation bias is a well-documented issue in Q-learning with function approximation, motivating techniques like double Q-learning and clipped double Q (used in TD3 and SAC).

**"You always need value functions for RL."** Pure policy gradient methods (e.g., REINFORCE) learn policies without explicitly maintaining a value function. However, adding a value function baseline dramatically reduces variance, which is why actor-critic methods dominate in practice.

## Connections to Other Concepts

- `return-and-discount-factor.md` -- Value functions are expected returns.
- `policies.md` -- Value functions evaluate policies; the optimal policy is derived from $Q^*$.
- `bellman-equations.md` -- The recursive equations that value functions satisfy.
- `markov-decision-processes.md` -- Value functions are defined within the MDP framework.
- `exploration-vs-exploitation.md` -- Value estimates guide the exploitation side of the tradeoff.

## Further Reading

- **Sutton & Barto (2018)** -- *Reinforcement Learning: An Introduction*, Chapters 3-6. Comprehensive treatment from definition through Monte Carlo and TD estimation.
- **Mnih et al. (2015)** -- "Human-level control through deep reinforcement learning." *Nature*, 518. DQN: the breakthrough in neural value function approximation.
- **van Hasselt et al. (2016)** -- "Deep reinforcement learning with double Q-learning." *AAAI*. Identifies and corrects overestimation bias in DQN.
- **Wang et al. (2016)** -- "Dueling network architectures for deep reinforcement learning." *ICML*. Introduces the V + A decomposition for Q-networks.
- **Baird (1995)** -- "Residual algorithms: Reinforcement learning with function approximation." *ICML*. Early identification of divergence issues with value function approximation.
