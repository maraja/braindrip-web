# N-Step Methods

**One-Line Summary**: Bridging Monte Carlo and TD by bootstrapping after $n$ steps -- tunable bias-variance trade-off.

**Prerequisites**: `temporal-difference-learning.md`, `monte-carlo-methods.md`, `return-and-discount-factor.md`, `value-functions.md`

## What Is N-Step Methods?

Imagine predicting the weather. A one-step forecast ("what will tomorrow be like based on today?") is low variance but relies heavily on your current model's accuracy. A full-season forecast ("average of all days this season") uses real data but is noisy. An $n$-day forecast -- looking ahead a week before trusting your model -- balances these extremes. N-step methods in RL work identically: instead of bootstrapping after one step (TD) or waiting until the end of the episode (MC), they wait $n$ steps, using real observed rewards for those steps and then bootstrapping from the estimated value at step $n$.

N-step methods provide a continuous, tunable bridge between TD(0) at one extreme ($n = 1$) and Monte Carlo at the other ($n = \infty$). The parameter $n$ controls the bias-variance trade-off: small $n$ gives low variance but higher bias (from bootstrapping off potentially inaccurate estimates), while large $n$ gives lower bias but higher variance (from accumulating stochastic rewards).

## How It Works

### The N-Step Return

The $n$-step return from time $t$ is defined as:

$$G_{t:t+n} = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \cdots + \gamma^{n-1} R_{t+n} + \gamma^n V(S_{t+n})$$

More compactly:

$$G_{t:t+n} = \sum_{k=0}^{n-1} \gamma^k R_{t+k+1} + \gamma^n V(S_{t+n})$$

Special cases reveal the unifying nature:
- $n = 1$: $G_{t:t+1} = R_{t+1} + \gamma V(S_{t+1})$ -- the TD(0) target.
- $n = T - t$ (remaining episode length): $G_{t:T} = \sum_{k=0}^{T-t-1} \gamma^k R_{t+k+1}$ -- the full MC return (with $V(S_T) = 0$ for terminal states).

### N-Step TD Prediction

The value update uses the $n$-step return as the target:

$$V(S_t) \leftarrow V(S_t) + \alpha \left[ G_{t:t+n} - V(S_t) \right]$$

This update can only be made at time $t + n$ (when $R_{t+n}$ and $S_{t+n}$ are known), introducing a delay of $n$ steps between experiencing a transition and updating the value.

```
N-Step TD Prediction:
Initialize V(s) arbitrarily
For each episode:
    Store S_0; T <- infinity
    For t = 0, 1, 2, ...:
        If t < T:
            Take action, observe R_{t+1}, S_{t+1}
            If S_{t+1} is terminal: T <- t + 1
        tau <- t - n + 1  (time of state being updated)
        If tau >= 0:
            G <- sum_{k=tau+1}^{min(tau+n, T)} gamma^{k-tau-1} * R_k
            If tau + n < T: G <- G + gamma^n * V(S_{tau+n})
            V(S_tau) <- V(S_tau) + alpha * [G - V(S_tau)]
    until tau = T - 1
```

> **Recommended visual**: Performance of $n$-step TD on the 19-state random walk as a function of $n$ and $\alpha$.
> *Source*: Sutton & Barto, *Reinforcement Learning: An Introduction*, Figure 7.2.

### N-Step SARSA

Extending to control, $n$-step SARSA uses action-value $n$-step returns:

$$G_{t:t+n} = R_{t+1} + \gamma R_{t+2} + \cdots + \gamma^{n-1} R_{t+n} + \gamma^n Q(S_{t+n}, A_{t+n})$$

The update becomes:

$$Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha \left[ G_{t:t+n} - Q(S_t, A_t) \right]$$

This naturally extends to $n$-step Expected SARSA by replacing $Q(S_{t+n}, A_{t+n})$ with $\sum_a \pi(a \mid S_{t+n}) Q(S_{t+n}, a)$.

### N-Step Off-Policy Learning

For off-policy $n$-step methods, importance sampling ratios correct for the distribution mismatch:

$$\rho_{t:t+n-1} = \prod_{k=t}^{t+n-1} \frac{\pi(A_k \mid S_k)}{b(A_k \mid S_k)}$$

The update becomes:

$$V(S_t) \leftarrow V(S_t) + \alpha \rho_{t:t+n-1} \left[ G_{t:t+n} - V(S_t) \right]$$

The product of $n$ importance sampling ratios can have high variance for large $n$, which is a practical limitation of off-policy $n$-step methods.

### The Bias-Variance Trade-Off

The choice of $n$ controls a fundamental trade-off:

| Property | Small $n$ (TD-like) | Large $n$ (MC-like) |
|----------|-------------------|---------------------|
| **Bias** | Higher (bootstraps from estimates) | Lower (uses more real rewards) |
| **Variance** | Lower (fewer random variables) | Higher (product of many random rewards) |
| **Speed of propagation** | Slow (one step at a time) | Fast (information travels $n$ steps per update) |
| **Sensitivity to initial values** | Higher (bootstraps from them) | Lower (actual returns dominate) |

The optimal $n$ is problem-dependent. The classic result from Sutton and Barto's 19-state random walk shows that intermediate values of $n$ (around 4-8) consistently outperform both extremes across a range of learning rates. This demonstrates that the best trade-off is rarely at either extreme.

### Truncated N-Step Returns

Near episode boundaries, when fewer than $n$ steps remain, the return is naturally truncated:

$$G_{t:T} = \sum_{k=0}^{T-t-1} \gamma^k R_{t+k+1}$$

This graceful degradation means $n$-step methods automatically become MC-like near episode termination, using whatever steps are available.

## Why It Matters

N-step methods formalize the intuition that neither pure TD nor pure MC is universally optimal. They provide practitioners with a tunable knob ($n$) to adapt to the specific characteristics of their problem: use smaller $n$ for problems with accurate value estimates and high reward variance, and larger $n$ for problems with poor initial estimates or strong sequential dependencies. N-step returns also serve as the conceptual stepping stone to eligibility traces, which elegantly average over all values of $n$ simultaneously.

## Key Technical Details

- **Optimal $n$**: Problem-dependent, but $n \in [4, 16]$ frequently outperforms TD(0) and MC in tabular benchmarks.
- **Memory requirement**: Must store the last $n$ states, actions, and rewards, requiring $O(n)$ additional memory per episode.
- **Update delay**: Values for $S_t$ cannot be updated until time $t + n$, delaying credit assignment. This means the first $n - 1$ transitions of each episode produce no updates.
- **Computational cost**: Each update costs $O(n)$ to compute the $n$-step return, compared to $O(1)$ for TD(0).
- **Off-policy instability**: The product of $n$ importance sampling ratios $\rho_{t:t+n-1}$ grows exponentially in variance with $n$, making off-policy $n$-step methods impractical for large $n$.
- **Convergence**: $N$-step TD converges to $V^\pi$ under the same conditions as TD(0), with the rate depending on $n$, $\alpha$, and the environment structure.

## Common Misconceptions

- **"Larger $n$ is always better because it reduces bias."** While larger $n$ reduces bias from bootstrapping, it increases variance from reward stochasticity. The optimal $n$ balances these effects and is almost never $n = \infty$ (full MC).
- **"N-step methods are just a theoretical construct."** N-step returns are directly used in practical algorithms. A3C uses $n$-step returns (typically $n = 5$ or $n = 20$) as its primary update target. Many deep RL implementations use $n$-step returns for improved sample efficiency.
- **"You must choose a single $n$ in advance."** Eligibility traces (TD($\lambda$)) and compound returns allow effectively averaging over multiple values of $n$, but even fixed $n$ can be tuned as a hyperparameter.

## Connections to Other Concepts

- `temporal-difference-learning.md` -- TD(0) is the special case $n = 1$. N-step methods generalize TD by deferring bootstrapping.
- `monte-carlo-methods.md` -- MC is the special case $n = \infty$ (or $n = T - t$). N-step methods recover MC when $n$ equals the remaining episode length.
- `eligibility-traces.md` -- TD($\lambda$) can be viewed as a geometric average over all $n$-step returns, providing a more elegant way to trade off bias and variance.
- `sarsa.md` -- N-step SARSA extends SARSA by using $n$-step returns, often substantially improving performance.
- `q-learning.md` -- N-step Q-learning (e.g., "tree backup" algorithm) extends Q-learning to multi-step off-policy updates.
- `a2c-and-a3c.md` -- A3C uses $n$-step returns as its default update target in deep RL, typically with $n = 5$.

## Further Reading

1. **"Reinforcement Learning: An Introduction," Chapter 7 (Sutton & Barto, 2018)** -- The definitive treatment of $n$-step methods, including prediction, control, off-policy corrections, and the random walk experiments.
2. **"Multi-Step Reinforcement Learning: A Unifying Algorithm" (De Asis et al., 2018)** -- Proposes a unified $n$-step algorithm encompassing Q-learning, SARSA, Expected SARSA, and Tree Backup as special cases.
3. **"Asynchronous Methods for Deep Reinforcement Learning" (Mnih et al., 2016)** -- The A3C paper that popularized $n$-step returns in deep RL, demonstrating their effectiveness with neural network function approximation.
4. **"Safe and Efficient Off-Policy Reinforcement Learning" (Munos et al., 2016)** -- Introduces Retrace($\lambda$), addressing the high variance of importance sampling in multi-step off-policy learning.
