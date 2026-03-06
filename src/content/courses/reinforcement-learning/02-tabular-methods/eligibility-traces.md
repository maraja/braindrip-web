# Eligibility Traces

**One-Line Summary**: Credit assignment mechanism that blends TD and Monte Carlo through exponentially decaying memory of visited states.

**Prerequisites**: `temporal-difference-learning.md`, `monte-carlo-methods.md`, `return-and-discount-factor.md`.

## What Are Eligibility Traces?

Imagine you're training a dog. The dog performs a sequence of tricks -- sit, shake, roll over -- and you give it a treat at the end. Which trick earned the treat? The most recent one (roll over) deserves the most credit, but the earlier ones contributed too. You might assign decreasing credit backward through time: roll over gets the most, shake gets some, and sit gets a little.

Eligibility traces implement exactly this idea in RL. They maintain a decaying memory of which states were recently visited, so when a reward signal arrives (via the TD error), credit is distributed backward to all recently visited states -- not just the immediately preceding one. This bridges the gap between TD learning (which updates only one step back) and Monte Carlo methods (which wait until the episode ends).

## How It Works

### The Forward View: $\lambda$-Return

The **$\lambda$-return** is a weighted average of all $n$-step returns:

$$G_t^\lambda = (1 - \lambda) \sum_{n=1}^{\infty} \lambda^{n-1} G_t^{(n)}$$

where $G_t^{(n)} = R_{t+1} + \gamma R_{t+2} + \cdots + \gamma^{n-1} R_{t+n} + \gamma^n V(S_{t+n})$ is the $n$-step return.

The geometric weighting $(1 - \lambda)\lambda^{n-1}$ sums to 1, creating a valid average. This smoothly interpolates:
- **$\lambda = 0$**: Only the 1-step return $G_t^{(1)}$ -- equivalent to TD(0)
- **$\lambda = 1$**: The full Monte Carlo return $G_t$ (no bootstrapping)
- **$0 < \lambda < 1$**: A blend, with exponentially decreasing weight on longer returns

### The Backward View: Eligibility Traces

Computing the $\lambda$-return in the forward view requires waiting until the end of the episode. The **backward view** achieves the same result incrementally using eligibility traces.

Each state $s$ has an **eligibility trace** $e_t(s)$ that tracks how recently and frequently state $s$ was visited:

**Accumulating traces:**

$$e_t(s) = \begin{cases} \gamma \lambda \, e_{t-1}(s) + 1 & \text{if } s = S_t \\ \gamma \lambda \, e_{t-1}(s) & \text{otherwise} \end{cases}$$

**Replacing traces:**

$$e_t(s) = \begin{cases} 1 & \text{if } s = S_t \\ \gamma \lambda \, e_{t-1}(s) & \text{otherwise} \end{cases}$$

The trace decays by $\gamma\lambda$ at each step and gets a boost when the state is visited. Replacing traces cap the trace at 1 upon revisiting, preventing inflated updates in loops.

### TD($\lambda$) Algorithm

At each time step:

1. Observe transition $(S_t, A_t, R_{t+1}, S_{t+1})$
2. Compute TD error: $\delta_t = R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$
3. Update trace: $e_t(s)$ for all states
4. Update all state values: $V(s) \leftarrow V(s) + \alpha \, \delta_t \, e_t(s)$ for all $s$

The key insight: the same TD error $\delta_t$ is used to update *every* state, but weighted by its eligibility trace. States visited long ago have decayed traces and receive small updates. The state just visited has a trace near 1 and receives the full update.

### SARSA($\lambda$) and Q($\lambda$)

Eligibility traces extend naturally to control:

**SARSA($\lambda$):** Maintain traces over state-action pairs $(s, a)$:

$$e_t(s, a) = \begin{cases} \gamma \lambda \, e_{t-1}(s, a) + 1 & \text{if } s = S_t, a = A_t \\ \gamma \lambda \, e_{t-1}(s, a) & \text{otherwise} \end{cases}$$

$$Q(s, a) \leftarrow Q(s, a) + \alpha \, \delta_t \, e_t(s, a) \quad \forall (s, a)$$

**Watkins's Q($\lambda$):** Combines Q-learning with traces, but cuts the trace to zero whenever a non-greedy action is taken (because Q-learning is off-policy, and the trace should only credit the greedy path):

$$e_t(s, a) = \begin{cases} 0 & \text{if } A_t \neq \arg\max_{a'} Q(S_t, a') \text{ (non-greedy)} \\ \gamma \lambda \, e_{t-1}(s, a) + 1 & \text{if } s = S_t, a = A_t \\ \gamma \lambda \, e_{t-1}(s, a) & \text{otherwise} \end{cases}$$

### The Equivalence

Sutton & Barto (2018) prove that the forward view ($\lambda$-return) and backward view (eligibility traces) produce identical total updates over an episode (for the offline/batch case). The backward view is computationally preferable because it updates incrementally at each step.

## Why It Matters

Eligibility traces provide a **unifying framework** for TD and Monte Carlo methods. Rather than choosing between TD(0) (low variance, high bias) and Monte Carlo (high variance, zero bias), the practitioner can tune $\lambda$ to find the optimal bias-variance trade-off for their problem.

In practice, intermediate $\lambda$ values (0.8-0.95) often outperform both extremes. Traces propagate reward information faster than TD(0) without waiting for full episodes like Monte Carlo, making learning significantly more sample-efficient in many environments.

## Key Technical Details

- **Computational cost**: TD($\lambda$) requires storing and updating a trace for every state (or state-action pair) at each step, making it $O(|\mathcal{S}|)$ per step instead of $O(1)$ for TD(0). This motivated truncated traces and sparse implementations.
- **Common $\lambda$ values**: 0.8-0.95 typically works best. $\lambda = 0.9$ is a common default.
- **Replacing vs accumulating traces**: Replacing traces often work better in practice, especially in environments with loops or repeated state visits. Singh & Sutton (1996) showed replacing traces can be significantly faster.
- **In deep RL**, eligibility traces are less commonly used because experience replay (which randomly samples transitions) breaks the temporal structure that traces rely on. GAE (Generalized Advantage Estimation) is the modern equivalent, computing $\lambda$-weighted advantages for policy gradient methods.
- **GAE connection**: The Generalized Advantage Estimation used in PPO and A2C is mathematically equivalent to using a $\lambda$-return for advantage estimation: $\hat{A}_t^{\text{GAE}(\gamma, \lambda)} = \sum_{l=0}^{\infty} (\gamma\lambda)^l \delta_{t+l}$

## Common Misconceptions

- **"Eligibility traces are just a historical curiosity."** While less prominent in modern deep RL, the $\lambda$-return idea lives on as GAE, which is central to PPO and modern policy gradient methods. Understanding traces is essential for understanding GAE.
- **"$\lambda = 1$ is always equivalent to Monte Carlo."** This is true only for episodic tasks. For continuing tasks, $\lambda = 1$ can cause issues because traces never fully decay.
- **"Traces require storing all visited states."** In practice, traces below a threshold can be zeroed out (sparse traces), and only recently visited states need active traces.
- **"The backward view is an approximation."** It produces identical total updates to the forward view over a complete episode (Sutton & Barto, 2018, Chapter 12).

## Connections to Other Concepts

- `temporal-difference-learning.md` -- TD(0) is the special case $\lambda = 0$.
- `monte-carlo-methods.md` -- Monte Carlo is the special case $\lambda = 1$.
- `n-step-methods.md` -- $n$-step returns are individual components of the $\lambda$-return mixture.
- `advantage-estimation.md` -- GAE is the modern descendant of eligibility traces for policy gradient methods.
- `q-learning.md` -- Q($\lambda$) extends Q-learning with traces but requires trace-cutting for off-policy correctness.

## Further Reading

1. **Sutton & Barto (2018)** -- *Reinforcement Learning: An Introduction*, Chapter 12. Definitive treatment of eligibility traces, forward/backward equivalence, and practical variants.
2. **Singh & Sutton (1996)** -- "Reinforcement learning with replacing eligibility traces." *Machine Learning*. Demonstrates the advantages of replacing over accumulating traces.
3. **Schulman et al. (2016)** -- "High-dimensional continuous control using generalized advantage estimation." *ICLR*. The modern application of $\lambda$-weighted returns as GAE for policy gradients.
4. **van Seijen et al. (2016)** -- "True Online TD($\lambda$)." *JMLR*. An improved online implementation that exactly matches the forward-view $\lambda$-return update at every step, not just in aggregate.
