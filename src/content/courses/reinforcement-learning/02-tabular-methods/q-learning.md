# Q-Learning

**One-Line Summary**: Off-policy TD control that learns the optimal action-value function regardless of the behavior policy -- the most influential tabular RL algorithm.

**Prerequisites**: `value-functions.md`, `bellman-equations.md`, `temporal-difference-learning.md`, `exploration-vs-exploitation.md`, `policies.md`

## What Is Q-Learning?

Imagine a new employee who follows their cautious supervisor's instructions (the behavior policy) but mentally keeps track of what the *best possible* action would have been in each situation (the target policy). Over time, this employee builds a mental model of the optimal strategy -- even though they never actually followed it. Q-learning works the same way: it follows an exploratory policy (e.g., $\varepsilon$-greedy) to gather diverse experience, but updates its Q-values toward the *greedy optimal* action, regardless of what action was actually taken.

Q-learning, introduced by Chris Watkins in his 1989 PhD thesis, was the first RL algorithm proven to converge to the optimal policy without requiring a model of the environment. It remains one of the most important algorithms in all of RL -- the direct ancestor of Deep Q-Networks (DQN) that launched the deep RL revolution.

## How It Works

### The Q-Learning Update Rule

After taking action $A_t$ in state $S_t$, observing reward $R_{t+1}$ and next state $S_{t+1}$, Q-learning updates:

$$Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha \left[ R_{t+1} + \gamma \max_a Q(S_{t+1}, a) - Q(S_t, A_t) \right]$$

The critical term is $\max_a Q(S_{t+1}, a)$. Rather than using the Q-value of whatever action was *actually* selected next, Q-learning uses the Q-value of the *best* action. This is what makes it **off-policy**: the update target reflects the optimal policy $\pi^*(s) = \arg\max_a Q(s, a)$, not the behavior policy being followed.

### Relationship to Bellman Optimality

The Q-learning update is a stochastic approximation to the Bellman optimality equation for action-values:

$$Q^*(s, a) = \sum_{s', r} p(s', r \mid s, a) \left[ r + \gamma \max_{a'} Q^*(s', a') \right]$$

Each observed transition $(S_t, A_t, R_{t+1}, S_{t+1})$ provides a single sample of this expectation, and the Q-learning update moves the estimate toward this sample. Over many updates, Q-values converge to $Q^*$.

### The Off-Policy Advantage

Because Q-learning always targets the greedy policy, the behavior policy used for data collection is decoupled from the policy being learned. This means:

- The agent can explore aggressively (e.g., with high $\varepsilon$) without corrupting the learned Q-values.
- Data from any source -- human demonstrations, random policies, or other agents -- can be used to update Q.
- Importantly, the behavior policy $b$ must ensure sufficient exploration: every state-action pair must be visited infinitely often.

### Q-Learning Algorithm

```
Initialize Q(s, a) arbitrarily for all s, a; Q(terminal, .) = 0
For each episode:
    Initialize S
    For each step of episode:
        Choose A from S using policy derived from Q (e.g., epsilon-greedy)
        Take action A, observe R, S'
        Q(S, A) <- Q(S, A) + alpha * [R + gamma * max_a Q(S', a) - Q(S, A)]
        S <- S'
    until S is terminal
```

### Convergence Conditions

Q-learning converges to $Q^*$ with probability 1 provided two conditions hold:

1. **Sufficient exploration**: All state-action pairs are visited infinitely often.
2. **Robbins-Monro step sizes**: The learning rate schedule satisfies $\sum_t \alpha_t(s, a) = \infty$ and $\sum_t \alpha_t^2(s, a) < \infty$ for all $(s, a)$.

In practice, a constant learning rate $\alpha$ is often used, which means Q-learning tracks rather than converges -- suitable for non-stationary environments but technically violating convergence conditions.

> **Recommended visual**: The cliff-walking gridworld comparing Q-learning and SARSA paths.
> *Source*: Sutton & Barto, *Reinforcement Learning: An Introduction*, Figure 6.5.

### The Cliff-Walking Example

The cliff-walking gridworld is the canonical illustration of Q-learning's character. An agent must navigate from start to goal along a cliff edge. Falling off the cliff yields a large negative reward (-100). Q-learning learns the *optimal* path -- walking right along the cliff edge -- because it evaluates the greedy policy, which would never step off the cliff. However, because the agent *behaves* $\varepsilon$-greedily during training, it occasionally falls off. SARSA, being on-policy, learns to take the safer (longer) path away from the cliff. Q-learning finds the shorter optimal path but suffers more during training.

### Maximization Bias

Q-learning suffers from **maximization bias**: the $\max$ operator systematically overestimates Q-values when estimates are noisy. Consider a state where all true Q-values equal zero but estimates have random noise. The $\max$ of noisy estimates is positive on average, inflating the target. Double Q-learning addresses this by maintaining two independent Q-tables and using one to select the action and the other to evaluate it.

## Why It Matters

Q-learning is arguably the single most important algorithm in reinforcement learning history. It demonstrated that an agent can learn optimal behavior purely from interaction, without a model, and without even following the optimal policy during learning. This off-policy property is the conceptual foundation for experience replay (storing and reusing past transitions) and Deep Q-Networks, which combined Q-learning with neural networks to achieve human-level Atari play. Nearly every modern value-based deep RL algorithm is a descendant of Q-learning.

## Key Technical Details

- **Table size**: $|S| \times |A|$ entries, making tabular Q-learning feasible only for small discrete state-action spaces (typically $< 10^6$ entries).
- **Learning rate**: Common practice is $\alpha \in [0.01, 0.5]$, often decayed over time. Higher $\alpha$ speeds initial learning but increases asymptotic noise.
- **Exploration**: $\varepsilon$-greedy with $\varepsilon$ decayed from ~0.1 to ~0.01 is standard. Too little exploration causes premature convergence; too much slows learning.
- **Convergence speed**: Empirically, tabular Q-learning often requires $O(|S||A|/\alpha)$ total steps to approach optimality, though worst-case bounds are much looser.
- **Maximization bias**: Can overestimate Q-values by 5-30% in stochastic environments. Double Q-learning eliminates this bias.
- **Memory**: $O(|S| \times |A|)$ -- just the Q-table. No episode storage required (unlike MC).

## Common Misconceptions

- **"Q-learning learns from off-policy data without any conditions."** Q-learning can *update* from any data, but *convergence* requires that the behavior policy visits all state-action pairs infinitely often. A policy that never visits state $s_7$ will never learn $Q^*(s_7, \cdot)$.
- **"The max in Q-learning always helps."** The $\max$ operator is what makes Q-learning target the optimal policy, but it also introduces maximization bias. In highly stochastic environments, this bias can significantly slow or distort learning.
- **"Q-learning always finds the optimal policy faster than SARSA."** Q-learning finds the *optimal* policy, while SARSA finds the best policy *given the exploration*. But SARSA can accumulate more reward during training because it accounts for its own exploratory behavior, as shown in the cliff-walking example.

## Connections to Other Concepts

- `bellman-equations.md` -- Q-learning directly approximates the Bellman optimality equation using sampled transitions.
- `temporal-difference-learning.md` -- Q-learning is a TD control algorithm; its update rule is a TD(0) update applied to Q-values with the greedy $\max$ operator.
- `sarsa.md` -- The on-policy counterpart to Q-learning, using the actual next action instead of the greedy $\max$.
- `dynamic-programming.md` -- Q-learning can be viewed as asynchronous, sample-based value iteration on Q-values.
- `deep-q-networks.md` -- DQN extends Q-learning to high-dimensional state spaces using neural networks, experience replay, and target networks.
- `double-dqn.md` -- Addresses Q-learning's maximization bias by decoupling action selection from evaluation.
- `exploration-vs-exploitation.md` -- Q-learning separates learning (off-policy) from acting (behavior policy), but still requires sufficient exploration.

## Further Reading

1. **"Learning from Delayed Rewards" (Watkins, 1989)** -- Watkins' PhD thesis introducing Q-learning with convergence analysis.
2. **"Q-Learning" (Watkins & Dayan, 1992)** -- The journal paper providing the formal convergence proof for tabular Q-learning.
3. **"Reinforcement Learning: An Introduction," Section 6.5 (Sutton & Barto, 2018)** -- The textbook treatment with the cliff-walking example and comparison to SARSA.
4. **"Double Q-Learning" (Hasselt, 2010)** -- Introduces Double Q-learning to address the maximization bias inherent in standard Q-learning.
5. **"Human-Level Control Through Deep Reinforcement Learning" (Mnih et al., 2015)** -- The DQN paper that scaled Q-learning to Atari games, demonstrating its enduring power.
