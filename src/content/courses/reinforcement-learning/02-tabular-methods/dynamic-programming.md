# Dynamic Programming

**One-Line Summary**: Computing optimal policies via iterative Bellman updates when the full environment model is known -- the theoretical foundation of reinforcement learning.

**Prerequisites**: `markov-decision-processes.md`, `value-functions.md`, `bellman-equations.md`, `policies.md`

## What Is Dynamic Programming?

Imagine you have a complete map of a city -- every road, every traffic delay, every shortcut. With this map in hand, you don't need to wander around discovering routes. You can sit at your desk and compute the best route from any location to any destination by working backward from the goal. Dynamic programming (DP) in reinforcement learning works exactly this way: given perfect knowledge of the environment's transition dynamics $p(s', r \mid s, a)$, it computes optimal policies through systematic, iterative computation rather than trial-and-error interaction.

DP methods are *planning* algorithms. They require a complete model of the MDP (all transition probabilities and rewards), which makes them impractical for most real-world problems. Yet they are indispensable as theoretical foundations -- virtually every RL algorithm can be understood as an approximation to one of the two core DP algorithms: policy iteration or value iteration.

The term "dynamic programming" was coined by Richard Bellman in the 1950s. The "programming" refers to optimization (as in linear programming), and "dynamic" refers to the sequential, multi-stage nature of the problems.

## How It Works

### Policy Evaluation (Prediction)

Given a fixed policy $\pi$, policy evaluation computes the state-value function $V^\pi(s)$ by iteratively applying the Bellman expectation equation as an update rule:

$$V_{k+1}(s) = \sum_a \pi(a \mid s) \sum_{s', r} p(s', r \mid s, a) \left[ r + \gamma V_k(s') \right]$$

Starting from an arbitrary $V_0$, each *sweep* over all states produces a better approximation. The sequence $\{V_k\}$ converges to $V^\pi$ as $k \to \infty$. In practice, convergence is declared when $\max_s |V_{k+1}(s) - V_k(s)| < \theta$ for some small threshold $\theta$.

> **Recommended visual**: Gridworld value function converging over successive sweeps.
> *Source*: Sutton & Barto, *Reinforcement Learning: An Introduction*, Figure 4.1.

### Policy Improvement

Once we have $V^\pi$, we can construct a strictly better (or equal) policy by acting *greedily* with respect to the current value function:

$$\pi'(s) = \arg\max_a \sum_{s', r} p(s', r \mid s, a) \left[ r + \gamma V^\pi(s') \right]$$

The **policy improvement theorem** guarantees that if $\pi' \neq \pi$, then $V^{\pi'}(s) \geq V^\pi(s)$ for all states $s$. If $\pi' = \pi$, then $\pi$ is already optimal.

### Policy Iteration

Policy iteration alternates between evaluation and improvement:

1. **Initialize** $\pi$ arbitrarily.
2. **Policy Evaluation**: Compute $V^\pi$ (iterative sweeps until convergence).
3. **Policy Improvement**: Derive $\pi'$ by acting greedily w.r.t. $V^\pi$.
4. If $\pi' = \pi$, stop (optimal policy found). Otherwise, set $\pi \leftarrow \pi'$ and go to step 2.

Since a finite MDP has a finite number of deterministic policies, and each iteration produces a strictly better policy (unless already optimal), policy iteration terminates in a finite number of steps. In practice, convergence is remarkably fast -- often in fewer than 10 iterations even for large state spaces.

### Value Iteration

Value iteration collapses evaluation and improvement into a single update by applying the Bellman *optimality* equation directly:

$$V_{k+1}(s) = \max_a \sum_{s', r} p(s', r \mid s, a) \left[ r + \gamma V_k(s') \right]$$

This is equivalent to performing a single sweep of policy evaluation followed by policy improvement at every step. The optimal policy is extracted at the end:

$$\pi^*(s) = \arg\max_a \sum_{s', r} p(s', r \mid s, a) \left[ r + \gamma V^*(s') \right]$$

Value iteration converges to $V^*$ under the same conditions as policy evaluation, since the Bellman optimality operator is a contraction mapping with factor $\gamma$.

### Convergence Guarantees

Both algorithms rest on the **contraction mapping theorem**. The Bellman operator $T$ satisfies:

$$\| T V_1 - T V_2 \|_\infty \leq \gamma \| V_1 - V_2 \|_\infty$$

This guarantees a unique fixed point and geometric convergence at rate $\gamma$. After $k$ iterations, the error is bounded by $\gamma^k \| V_0 - V^* \|_\infty$.

## Why It Matters

DP provides the *correctness benchmark* for all of reinforcement learning. When we say Q-learning "converges to the optimal policy," we mean it converges to the same solution DP would compute -- but without requiring the model. Every model-free algorithm (MC, TD, Q-learning, SARSA) is, in a deep sense, trying to approximate DP using sampled experience.

DP methods are also directly practical for moderate-scale problems where the model is known: inventory management, queueing systems, and MDPs with up to millions of states can be solved exactly with modern implementations.

## Key Technical Details

- **Computational complexity**: Each sweep of policy evaluation or value iteration costs $O(|S|^2 |A|)$ -- iterating over all states, all actions, and all successor states.
- **Policy iteration** typically converges in very few outer iterations (often $< 10$) but each policy evaluation step may require many sweeps.
- **Value iteration** requires more total sweeps but each sweep is cheaper (no inner convergence loop).
- **Asynchronous DP** updates states in any order, enabling prioritized sweeping of states with the largest Bellman residuals.
- **Discount factor** $\gamma < 1$ is required for convergence guarantees in infinite-horizon problems. For episodic tasks with absorbing terminal states, $\gamma = 1$ is also valid.
- **In-place updates** (updating $V(s)$ immediately rather than maintaining separate $V_k$ and $V_{k+1}$ arrays) often converge faster in practice.

## Common Misconceptions

- **"DP requires visiting states through interaction."** No. DP uses the model to compute expectations *analytically*. It never generates a single trajectory. This is what makes it a *planning* method, not a *learning* method.
- **"Value iteration is always faster than policy iteration."** Not necessarily. Policy iteration often converges in fewer total computation steps because each policy evaluation phase can use warm-starting. The comparison depends on the specific MDP structure.
- **"DP is only of theoretical interest."** DP is used in production systems for operations research, logistics, and finance -- anywhere the model is known and the state space is tractable.

## Connections to Other Concepts

- `bellman-equations.md` -- DP directly operationalizes the Bellman equations as iterative update rules.
- `value-functions.md` -- DP computes the exact value functions that model-free methods estimate from samples.
- `monte-carlo-methods.md` and `temporal-difference-learning.md` -- These approximate DP when the model is unknown, using sampled returns or bootstrapped estimates.
- `q-learning.md` -- Asynchronous, sample-based approximation to value iteration applied to Q-values.
- `dyna-architecture.md` -- Combines model-free learning with model-based DP-style planning, bridging both paradigms.

## Further Reading

1. **"Dynamic Programming" (Bellman, 1957)** -- The foundational monograph that introduced DP and the principle of optimality for sequential decision problems.
2. **"Reinforcement Learning: An Introduction," Chapter 4 (Sutton & Barto, 2018)** -- The definitive textbook treatment of DP for RL, with gridworld examples and convergence analysis.
3. **"Prioritized Sweeping: Reinforcement Learning with Less Data and Less Real Time" (Moore & Atkeson, 1993)** -- Introduces asynchronous DP with intelligent state ordering, dramatically improving convergence speed.
4. **"Markov Decision Processes: Discrete Stochastic Dynamic Programming" (Puterman, 1994)** -- The comprehensive mathematical reference for MDP theory and DP algorithms.
