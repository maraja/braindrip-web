# Monte Carlo Methods

**One-Line Summary**: Learning value estimates from complete episode returns -- model-free RL through averaging sampled outcomes.

**Prerequisites**: `markov-decision-processes.md`, `return-and-discount-factor.md`, `value-functions.md`, `policies.md`, `exploration-vs-exploitation.md`

## What Is Monte Carlo Methods?

Imagine learning to cook without a recipe book. You try a dish, taste the final result, and adjust. If the meal was great, you remember what you did; if it was terrible, you try something different next time. Crucially, you judge each cooking session only by the *finished dish* -- you don't evaluate individual steps mid-preparation. Monte Carlo (MC) methods in RL work identically: the agent completes full episodes (start to termination), observes the total return, and uses these complete outcomes to update its value estimates.

Unlike dynamic programming, MC methods require *no model* of the environment. They learn directly from experience -- sequences of states, actions, and rewards gathered by interacting with the environment. The only requirement is that episodes eventually terminate, so that we can compute a finite return for each visited state.

The name "Monte Carlo" comes from the famous casino district in Monaco, reflecting the method's reliance on random sampling. The approach was formalized for numerical computation by Stanislaw Ulam and John von Neumann during the Manhattan Project in the 1940s.

## How It Works

### MC Prediction (Estimating $V^\pi$)

The core idea: $V^\pi(s) = \mathbb{E}_\pi[G_t \mid S_t = s]$, so we estimate this expectation by averaging observed returns from state $s$.

**First-Visit MC**: For each episode, only the *first* time state $s$ is visited contributes a return sample. After many episodes:

$$V(s) \approx \frac{1}{N(s)} \sum_{i=1}^{N(s)} G_t^{(i)}$$

where $N(s)$ is the count of first visits to $s$ and $G_t^{(i)}$ is the return following the $i$-th first visit.

**Every-Visit MC**: Every occurrence of $s$ within an episode contributes a return sample. Both variants converge to $V^\pi(s)$ as $N(s) \to \infty$ by the law of large numbers, though first-visit MC produces unbiased estimates with cleaner theoretical guarantees.

The **incremental update** form avoids storing all returns:

$$V(s) \leftarrow V(s) + \alpha \left[ G_t - V(s) \right]$$

where $\alpha = 1/N(s)$ recovers exact averaging, or a constant $\alpha$ provides a recency-weighted average suitable for non-stationary environments.

### MC Control (Finding $\pi^*$)

To improve the policy, we estimate action-value functions $Q(s, a)$ rather than $V(s)$, since $Q$ allows policy improvement without a model:

$$\pi'(s) = \arg\max_a Q(s, a)$$

**MC with Exploring Starts**: Guarantees coverage by starting each episode from a random state-action pair. The algorithm then follows $\pi$ and updates $Q$ from the observed return. This is theoretically clean but impractical in most real environments where we cannot control the start state.

### On-Policy MC Control ($\varepsilon$-Greedy)

Instead of exploring starts, maintain an $\varepsilon$-greedy policy:

$$\pi(a \mid s) = \begin{cases} 1 - \varepsilon + \varepsilon / |A(s)| & \text{if } a = \arg\max_{a'} Q(s, a') \\ \varepsilon / |A(s)| & \text{otherwise} \end{cases}$$

This guarantees all state-action pairs are visited infinitely often (given infinite episodes), enabling convergence to the best policy *within the class of $\varepsilon$-soft policies*.

### Off-Policy MC with Importance Sampling

Off-policy methods learn about a *target policy* $\pi$ while following a different *behavior policy* $b$. This requires correcting for the distribution mismatch via importance sampling ratios:

$$\rho_{t:T-1} = \prod_{k=t}^{T-1} \frac{\pi(A_k \mid S_k)}{b(A_k \mid S_k)}$$

**Ordinary importance sampling**:
$$V(s) = \frac{\sum_{t \in \mathcal{T}(s)} \rho_{t:T-1} G_t}{|\mathcal{T}(s)|}$$

**Weighted importance sampling**:
$$V(s) = \frac{\sum_{t \in \mathcal{T}(s)} \rho_{t:T-1} G_t}{\sum_{t \in \mathcal{T}(s)} \rho_{t:T-1}}$$

Ordinary IS is unbiased but has potentially infinite variance. Weighted IS is biased (bias vanishes asymptotically) but has dramatically lower variance -- it is almost always preferred in practice.

> **Recommended visual**: Blackjack value function learned via MC methods.
> *Source*: Sutton & Barto, *Reinforcement Learning: An Introduction*, Figure 5.1.

## Why It Matters

MC methods are the first *model-free* algorithms in the RL toolkit. They introduced two fundamental ideas that permeate all modern RL: (1) learning from sampled experience rather than computed expectations, and (2) the on-policy/off-policy distinction that shapes algorithm design to this day. MC methods remain practical for episodic problems where the model is unknown and episodes are short, and they serve as the conceptual foundation for policy gradient methods like REINFORCE.

## Key Technical Details

- **Requires episodic tasks**: MC methods need complete returns, so episodes must terminate. They cannot be applied to continuing (infinite-horizon) tasks without modification.
- **High variance, zero bias**: MC returns $G_t$ are unbiased estimates of $V^\pi(s)$ but can have high variance since they depend on all subsequent rewards in the episode.
- **No bootstrapping**: MC does not update estimates based on other estimates, unlike TD methods. This means MC does not suffer from bias introduced by inaccurate value estimates.
- **Convergence**: First-visit MC converges to $V^\pi(s)$ with probability 1 and has a mean-squared error that falls as $O(1/N(s))$.
- **Off-policy importance sampling** ratios can be exponentially large for long episodes, making off-policy MC impractical for long-horizon problems.
- **Sample complexity**: Requires many complete episodes to reduce variance, especially in stochastic environments with long episodes.

## Common Misconceptions

- **"MC is always worse than TD because it has higher variance."** MC has higher variance but *zero bias*, which can make it preferable when function approximation introduces bias. In tabular settings with sufficient data, MC converges to the correct values.
- **"First-visit and every-visit MC are equivalent."** They converge to the same value but have different finite-sample properties. First-visit MC yields unbiased estimates; every-visit MC is biased (slightly) but often has lower mean-squared error for small sample sizes.
- **"You need a model for MC methods."** No -- MC is model-free. The confusion arises because MC *simulation* (generating episodes from a known model) is a different concept from MC *learning* (learning from experienced episodes).

## Connections to Other Concepts

- `dynamic-programming.md` -- DP computes exact expectations over the model; MC estimates them by sampling. MC trades model requirements for sample requirements.
- `temporal-difference-learning.md` -- TD combines MC's model-free sampling with DP's bootstrapping, offering a middle ground in the bias-variance trade-off.
- `n-step-methods.md` -- N-step returns interpolate between one-step TD ($n=1$) and full MC returns ($n=\infty$).
- `eligibility-traces.md` -- TD($\lambda$) with $\lambda = 1$ is equivalent to every-visit MC, providing a smooth continuum between TD and MC.
- `exploration-vs-exploitation.md` -- MC control requires exploration strategies ($\varepsilon$-greedy, exploring starts) to ensure sufficient coverage.
- `reinforce.md` -- The REINFORCE algorithm is essentially MC policy gradient: using complete episode returns to update policy parameters.

## Further Reading

1. **"Reinforcement Learning: An Introduction," Chapter 5 (Sutton & Barto, 2018)** -- Comprehensive treatment of MC prediction, control, and importance sampling with the blackjack example.
2. **"Monte Carlo Sampling Methods Using Markov Chains and Their Applications" (Hastings, 1970)** -- The foundational paper on MCMC methods that provides broader context for Monte Carlo estimation.
3. **"Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning" (Williams, 1992)** -- Introduces REINFORCE, which extends MC methods to policy gradient optimization.
4. **"Off-Policy Monte-Carlo Simulation of Markov Reward Processes" (Precup, Sutton & Singh, 2000)** -- Rigorous analysis of importance sampling for off-policy MC evaluation.
