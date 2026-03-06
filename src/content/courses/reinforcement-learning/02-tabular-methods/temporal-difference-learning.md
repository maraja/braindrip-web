# Temporal Difference Learning

**One-Line Summary**: Bootstrapping value estimates from incomplete episodes by updating toward one-step lookahead targets.

**Prerequisites**: `markov-decision-processes.md`, `value-functions.md`, `bellman-equations.md`, `return-and-discount-factor.md`

## What Is Temporal Difference Learning?

Imagine you are driving to a new restaurant and estimating your arrival time. With a Monte Carlo approach, you would wait until you arrive to assess your estimate. But with a temporal difference (TD) approach, you revise your estimate *at every intersection* based on what you can see from here. After each block, you think: "Given where I am now and what I know about the remaining distance, I think I'll arrive in 12 minutes" -- and you adjust your original estimate accordingly. You don't wait for the final outcome; you learn *during* the journey.

TD learning is the most central and distinctive idea in reinforcement learning. It combines two powerful principles: **sampling** from experience (like Monte Carlo methods, requiring no model) and **bootstrapping** (like dynamic programming, updating estimates based on other estimates). This hybrid enables learning from incomplete episodes, step by step, which is impossible with pure MC methods.

Richard Sutton formalized TD learning in his 1988 paper, though the idea traces back to Samuel's 1959 checkers player, which updated value estimates based on the difference between successive predictions -- the *temporal difference*.

## How It Works

### The TD(0) Update Rule

The simplest TD method, TD(0), updates the value of a state immediately after observing the next reward and next state:

$$V(S_t) \leftarrow V(S_t) + \alpha \left[ R_{t+1} + \gamma V(S_{t+1}) - V(S_t) \right]$$

The key quantity is the **TD error** (or TD residual):

$$\delta_t = R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$$

This measures the discrepancy between the current estimate $V(S_t)$ and the **TD target** $R_{t+1} + \gamma V(S_{t+1})$. If $\delta_t > 0$, the actual transition was better than expected; if $\delta_t < 0$, it was worse.

### Comparison: TD vs MC vs DP

The three methods differ in what target they drive the value estimate toward:

| Method | Update Target | Model Required? | Bootstraps? |
|--------|--------------|-----------------|-------------|
| DP | $\sum_{s',r} p(s',r \mid s,a)[r + \gamma V(s')]$ | Yes | Yes |
| MC | $G_t$ (actual complete return) | No | No |
| TD(0) | $R_{t+1} + \gamma V(S_{t+1})$ | No | Yes |

- **MC target** $G_t$ is an *unbiased* estimate of $V^\pi(S_t)$ but has high variance (it depends on all subsequent random events in the episode).
- **TD target** $R_{t+1} + \gamma V(S_{t+1})$ is *biased* (because $V(S_{t+1})$ is itself an estimate) but has much lower variance (it depends on only one random transition).

### Why Bootstrapping Helps

Bootstrapping introduces bias but dramatically reduces variance. In practice, this trade-off is overwhelmingly favorable: TD methods typically learn useful value estimates much faster than MC methods, especially in environments with long episodes or high stochasticity.

Intuitively, TD makes use of the Markov property -- the fact that the future depends on the present state, not the full history. By updating $V(S_t)$ toward $R_{t+1} + \gamma V(S_{t+1})$, TD exploits this structure, propagating learned information backward through the state space one step at a time.

> **Recommended visual**: Random walk example showing TD(0) vs MC convergence curves.
> *Source*: Sutton & Barto, *Reinforcement Learning: An Introduction*, Figure 6.2.

### TD Prediction Algorithm

```
Initialize V(s) arbitrarily for all s, V(terminal) = 0
For each episode:
    Initialize S
    For each step of episode:
        A <- action given by pi for S
        Take action A, observe R, S'
        V(S) <- V(S) + alpha * [R + gamma * V(S') - V(S)]
        S <- S'
    until S is terminal
```

Note that unlike MC, the value update happens *at every step*, not at the end of the episode. This allows TD to learn online and from incomplete episodes.

### The Batch TD Solution

When the same finite batch of experience is replayed repeatedly, TD(0) converges to a different solution than MC. TD converges to the **maximum-likelihood MDP estimate** -- the value function of the MDP that best explains the observed transitions. MC converges to the values that minimize mean-squared error on the observed returns. The TD solution is generally superior because it exploits the Markov structure of the problem.

## Why It Matters

TD learning is the algorithmic backbone of modern reinforcement learning. The Q-learning and SARSA algorithms that drove early RL successes are TD methods. Deep Q-Networks (DQN) -- the breakthrough that launched deep RL -- uses TD updates with neural network function approximation. The TD error $\delta_t$ has even been found to correlate with dopamine neuron firing patterns in the brain, suggesting that biological reward learning may use a TD-like mechanism (Schultz et al., 1997).

## Key Technical Details

- **Step size** $\alpha$: Constant $\alpha \in (0, 1]$ enables tracking in non-stationary environments. For guaranteed convergence to $V^\pi$, $\alpha$ must satisfy the Robbins-Monro conditions: $\sum_t \alpha_t = \infty$ and $\sum_t \alpha_t^2 < \infty$.
- **Convergence**: TD(0) converges to $V^\pi$ with probability 1 under the Robbins-Monro conditions and sufficient state visitation. Convergence has been proven for the tabular case (Dayan, 1992; Tsitsiklis, 1994).
- **Online learning**: TD updates after every transition, enabling learning mid-episode and in continuing (non-episodic) tasks -- a major advantage over MC.
- **Computational cost per step**: $O(1)$ -- only the current state's value is updated, compared to $O(T)$ for MC (where $T$ is episode length) when processing at termination.
- **Sensitivity to initial values**: Because TD bootstraps, poor initial value estimates propagate through updates. MC is immune to this since it uses actual returns.

## Common Misconceptions

- **"TD bias means TD converges to the wrong answer."** The bias in TD is *transient* -- it arises because $V(S_{t+1})$ is initially inaccurate. As $V$ improves, the bias vanishes and TD converges to the correct $V^\pi$. The bias is in the *update direction*, not the asymptotic solution.
- **"TD is always better than MC."** TD is typically faster in tabular settings due to lower variance, but when combined with function approximation, TD's bootstrapping can cause instability (the "deadly triad"). MC with function approximation is more stable, though slower.
- **"TD(0) uses only one-step information."** While each update uses one step, information propagates backward through the value function over multiple updates. After many sweeps, TD(0) effectively incorporates multi-step return information.

## Connections to Other Concepts

- `dynamic-programming.md` -- TD can be viewed as a sampled, model-free version of DP. The TD(0) update is a stochastic approximation to the Bellman expectation equation.
- `monte-carlo-methods.md` -- MC and TD represent two ends of a spectrum: full returns vs one-step bootstrapping. TD trades MC's zero bias for dramatically lower variance.
- `q-learning.md` -- Q-learning applies TD updates to action-value functions with a greedy maximization, enabling off-policy control.
- `sarsa.md` -- SARSA applies TD updates to Q-values using the action actually taken, giving on-policy TD control.
- `n-step-methods.md` -- N-step TD generalizes TD(0) by bootstrapping after $n$ steps rather than one, interpolating toward MC.
- `eligibility-traces.md` -- TD($\lambda$) elegantly unifies TD(0) and MC by maintaining traces of visited states, controlled by $\lambda \in [0, 1]$.

## Further Reading

1. **"Learning to Predict by the Methods of Temporal Differences" (Sutton, 1988)** -- The foundational paper that formalized TD learning and proved convergence of TD($\lambda$) for the linear case.
2. **"Reinforcement Learning: An Introduction," Chapter 6 (Sutton & Barto, 2018)** -- The definitive textbook treatment of TD prediction, with the random walk and driving examples.
3. **"A Predictive Model of Dopamine Neurons" (Schultz, Dayan & Montague, 1997)** -- The landmark neuroscience paper showing that dopamine signals resemble TD errors, bridging RL theory and biology.
4. **"Convergence Results for Some Temporal Difference Methods" (Tsitsiklis, 1994)** -- Rigorous convergence proofs for TD methods using stochastic approximation theory.
