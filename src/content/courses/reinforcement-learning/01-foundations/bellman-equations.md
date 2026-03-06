# Bellman Equations

**One-Line Summary**: The recursive decomposition of value into immediate reward plus discounted future value -- the fundamental identity of RL.

**Prerequisites**: `markov-decision-processes.md`, `return-and-discount-factor.md`, `policies.md`, `value-functions.md`.

## What Are the Bellman Equations?

Imagine planning a cross-country road trip. You don't need to evaluate the entire route at once. Instead, you reason: "The value of being in Denver equals the pleasure of driving the next leg to Salt Lake City, plus the value of being in Salt Lake City." You decompose a global evaluation into a local step plus the value of where you end up. That recursive insight -- the value of now equals the reward of the next step plus the discounted value of later -- is the **Bellman equation**.

Named after Richard Bellman (1957), these equations are the mathematical backbone of nearly every RL algorithm. They convert the problem of evaluating an infinite sum of future rewards into a system of simultaneous equations, one for each state.

## How It Works

### Bellman Expectation Equation for $V^\pi$

Starting from the definition of the state-value function and using the recursive structure of the return ($G_t = R_{t+1} + \gamma G_{t+1}$):

$$V^\pi(s) = \mathbb{E}_\pi[G_t \mid S_t = s] = \mathbb{E}_\pi[R_{t+1} + \gamma G_{t+1} \mid S_t = s]$$

Expanding the expectation over actions and next states:

$$V^\pi(s) = \sum_{a} \pi(a \mid s) \sum_{s'} P(s' \mid s, a) \left[ R(s, a, s') + \gamma V^\pi(s') \right]$$

This says: the value of state $s$ under policy $\pi$ equals the expected immediate reward plus the discounted value of the next state, averaged over the policy's action choices and the environment's stochastic transitions.

### Bellman Expectation Equation for $Q^\pi$

Similarly, for the action-value function:

$$Q^\pi(s, a) = \sum_{s'} P(s' \mid s, a) \left[ R(s, a, s') + \gamma \sum_{a'} \pi(a' \mid s') \, Q^\pi(s', a') \right]$$

This decomposes $Q^\pi$ into the immediate reward plus the discounted Q-value of the next state-action pair, weighted by the policy at $s'$.

### The Four Bellman Equations (Summary)

| Equation | Recursive Form |
|---|---|
| $V^\pi$ | $V^\pi(s) = \sum_a \pi(a \mid s) \left[ r(s,a) + \gamma \sum_{s'} P(s' \mid s,a) V^\pi(s') \right]$ |
| $Q^\pi$ | $Q^\pi(s,a) = r(s,a) + \gamma \sum_{s'} P(s' \mid s,a) \sum_{a'} \pi(a' \mid s') Q^\pi(s',a')$ |
| $V^*$ | $V^*(s) = \max_a \left[ r(s,a) + \gamma \sum_{s'} P(s' \mid s,a) V^*(s') \right]$ |
| $Q^*$ | $Q^*(s,a) = r(s,a) + \gamma \sum_{s'} P(s' \mid s,a) \max_{a'} Q^*(s',a')$ |

<!-- Recommended visual: Backup diagrams showing V -> Q -> V and Q -> V -> Q relationships
     Source: Sutton & Barto (2018), Figures 3.4 and 3.5 -->

### Bellman Optimality Equations

The **Bellman optimality equation** for $V^*$ replaces the policy average with a maximization:

$$V^*(s) = \max_a \left[ R(s, a) + \gamma \sum_{s'} P(s' \mid s, a) \, V^*(s') \right]$$

For $Q^*$:

$$Q^*(s, a) = R(s, a) + \gamma \sum_{s'} P(s' \mid s, a) \max_{a'} Q^*(s', a')$$

The key difference: the expectation equations use $\pi$ to weight actions, while the optimality equations use $\max$. The optimality equations are **nonlinear** (due to the $\max$) and generally cannot be solved in closed form.

### Derivation Sketch

Starting from $V^\pi(s) = \mathbb{E}_\pi[G_t \mid S_t = s]$:

1. Substitute $G_t = R_{t+1} + \gamma G_{t+1}$
2. Apply the law of total expectation, conditioning on $A_t$ and $S_{t+1}$
3. Use the Markov property: $\mathbb{E}[G_{t+1} \mid S_{t+1} = s'] = V^\pi(s')$
4. The result is the Bellman expectation equation

For the optimality equation, replace the policy average $\sum_a \pi(a \mid s) [\cdots]$ with $\max_a [\cdots]$, reflecting that the optimal policy always selects the best action.

### Matrix Form (Finite MDPs)

For a finite MDP with $n = |\mathcal{S}|$ states, the Bellman expectation equation for $V^\pi$ is a linear system:

$$\mathbf{v}^\pi = \mathbf{r}^\pi + \gamma \mathbf{P}^\pi \mathbf{v}^\pi$$

where $\mathbf{v}^\pi \in \mathbb{R}^n$, $\mathbf{r}^\pi \in \mathbb{R}^n$ is the expected reward vector, and $\mathbf{P}^\pi \in \mathbb{R}^{n \times n}$ is the state transition matrix under $\pi$. The closed-form solution is:

$$\mathbf{v}^\pi = (\mathbf{I} - \gamma \mathbf{P}^\pi)^{-1} \mathbf{r}^\pi$$

This requires $O(n^3)$ computation for the matrix inverse, which is feasible for small MDPs but intractable for large ones ($n = 10^6$ states would require $10^{18}$ operations).

### The Bellman Operator

Define the **Bellman operator** $T^\pi$ for policy evaluation:

$$(T^\pi V)(s) = \sum_a \pi(a \mid s) \left[ R(s, a) + \gamma \sum_{s'} P(s' \mid s, a) V(s') \right]$$

And the **Bellman optimality operator** $T^*$:

$$(T^* V)(s) = \max_a \left[ R(s, a) + \gamma \sum_{s'} P(s' \mid s, a) V(s') \right]$$

Both operators are **$\gamma$-contractions** in the $\ell_\infty$ norm:

$$\| T^\pi V - T^\pi V' \|_\infty \leq \gamma \| V - V' \|_\infty$$

By the **Banach fixed-point theorem**, each operator has a unique fixed point, and repeated application converges to it. This is the theoretical foundation for:
- **Policy evaluation** (iterative application of $T^\pi$) converging to $V^\pi$.
- **Value iteration** (iterative application of $T^*$) converging to $V^*$.

### Algorithms Built on Bellman Equations

| Algorithm | Bellman Equation Used | Approach |
|---|---|---|
| Policy Evaluation | $V^\pi$ expectation | Iterative $T^\pi$ |
| Value Iteration | $V^*$ optimality | Iterative $T^*$ |
| Q-Learning | $Q^*$ optimality | Sample-based $T^*$ |
| SARSA | $Q^\pi$ expectation | Sample-based $T^\pi$ |
| TD(0) | $V^\pi$ expectation | Sample-based $T^\pi$ |

## Why It Matters

The Bellman equations transform the RL problem from "evaluate an infinite sum of future rewards" to "solve a system of equations relating neighboring states." This recursive structure enables:
- **Dynamic programming** algorithms that solve MDPs exactly when the model is known.
- **Temporal-difference learning** that bootstraps (estimates values from other estimates), enabling online, incremental learning.
- **Convergence guarantees** through the contraction mapping property.

Without Bellman equations, RL would require evaluating complete trajectories for every value estimate -- the Bellman decomposition makes tractable learning possible.

## Key Technical Details

- **Value iteration** converges at rate $O(\gamma^k)$: after $k$ iterations, $\|V_k - V^*\|_\infty \leq \gamma^k \|V_0 - V^*\|_\infty$. For $\gamma = 0.99$, reaching $\epsilon$-accuracy requires $k \approx \frac{\log(1/\epsilon)}{1 - \gamma} \approx 100 \log(1/\epsilon)$ iterations.
- **Policy iteration** alternates between solving $V^\pi$ (policy evaluation) and updating $\pi$ greedily (policy improvement). It converges in at most $|\mathcal{A}|^{|\mathcal{S}|}$ iterations (the number of deterministic policies), but in practice converges much faster.
- **The deadly triad**: Combining bootstrapping (Bellman equations), function approximation, and off-policy learning can cause divergence. This fundamental tension motivates algorithms like fitted Q-iteration, gradient TD, and emphatic TD.
- **Q-learning's update rule** is a stochastic approximation to the Bellman optimality equation: $Q(s,a) \leftarrow Q(s,a) + \alpha[r + \gamma \max_{a'} Q(s',a') - Q(s,a)]$.

## Common Misconceptions

**"The Bellman equation is an update rule."** The Bellman equation is an identity -- a condition that the true value function must satisfy. Algorithms like TD learning and value iteration use update rules *inspired by* the Bellman equation, but the equation itself is a mathematical relationship, not a procedure.

**"You need the transition model to use Bellman equations."** Model-free methods (TD, Q-learning, SARSA) use *sample-based* Bellman updates, replacing the expectation over transitions with single observed transitions. The model is not required.

**"Bellman optimality equations can be solved directly."** The $\max$ operator makes them nonlinear. Unlike the expectation equations, there is no closed-form solution. They must be solved iteratively (value iteration) or via linear programming.

## Connections to Other Concepts

- `value-functions.md` -- Bellman equations define the recursive structure of value functions.
- `return-and-discount-factor.md` -- The recursive decomposition $G_t = R_{t+1} + \gamma G_{t+1}$ is the starting point.
- `policies.md` -- The expectation equations depend on $\pi$; the optimality equations define $\pi^*$.
- `markov-decision-processes.md` -- Bellman equations exploit the Markov property.
- `exploration-vs-exploitation.md` -- Q-learning (based on Bellman optimality) is combined with exploration strategies.

## Further Reading

- **Bellman (1957)** -- *Dynamic Programming*. The origin of the principle of optimality and the Bellman equation.
- **Sutton & Barto (2018)** -- *Reinforcement Learning: An Introduction*, Chapters 3-4. Derivation and use of Bellman equations in dynamic programming.
- **Bertsekas (2012)** -- *Dynamic Programming and Optimal Control* (4th edition). Rigorous treatment of Bellman equations, contraction mappings, and convergence theory.
- **Watkins & Dayan (1992)** -- "Q-learning." *Machine Learning*, 8. Proves convergence of Q-learning to the Bellman optimality fixed point.
- **Tsitsiklis & Van Roy (1997)** -- "An analysis of temporal-difference learning with function approximation." *IEEE Transactions on Automatic Control*. Foundational analysis of TD learning and Bellman equation approximation.
