# SARSA

**One-Line Summary**: On-policy TD control that updates Q-values using the action actually taken -- safer than Q-learning in stochastic environments.

**Prerequisites**: `value-functions.md`, `bellman-equations.md`, `temporal-difference-learning.md`, `exploration-vs-exploitation.md`, `policies.md`

## What Is SARSA?

Imagine a cautious hiker planning a mountain trail. Rather than evaluating each route based on ideal conditions (what Q-learning does), this hiker evaluates routes based on *how they actually hike* -- including their tendency to occasionally stumble on loose rocks. A route along a cliff edge might be shortest, but the hiker knows they sometimes misstep, so they factor that in and choose the safer ridge path. SARSA thinks like this cautious hiker: it evaluates actions based on the policy the agent is *actually following*, including all its exploratory mistakes.

SARSA (State-Action-Reward-State-Action) is an on-policy TD control algorithm. Its name comes from the quintuple $(S_t, A_t, R_{t+1}, S_{t+1}, A_{t+1})$ used in each update. Unlike Q-learning, which evaluates the hypothetical greedy action, SARSA evaluates the action the agent *will actually take* next. This seemingly small change has profound implications for safety-sensitive environments.

SARSA was introduced by Rummery and Niranjan (1994), initially called "Modified Connectionist Q-Learning," and later named by Sutton.

## How It Works

### The SARSA Update Rule

After taking action $A_t$ in state $S_t$, observing reward $R_{t+1}$ and next state $S_{t+1}$, the agent selects its next action $A_{t+1}$ according to the current policy, then updates:

$$Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha \left[ R_{t+1} + \gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t) \right]$$

The key difference from Q-learning: the target uses $Q(S_{t+1}, A_{t+1})$ -- the Q-value of the action *actually selected* by the behavior policy -- rather than $\max_a Q(S_{t+1}, a)$.

### SARSA Algorithm

```
Initialize Q(s, a) arbitrarily for all s, a; Q(terminal, .) = 0
For each episode:
    Initialize S
    Choose A from S using policy derived from Q (e.g., epsilon-greedy)
    For each step of episode:
        Take action A, observe R, S'
        Choose A' from S' using policy derived from Q (e.g., epsilon-greedy)
        Q(S, A) <- Q(S, A) + alpha * [R + gamma * Q(S', A') - Q(S, A)]
        S <- S';  A <- A'
    until S is terminal
```

Notice that the next action $A'$ is chosen *before* the update and then *actually executed* on the next step. This is what makes SARSA on-policy: the same policy generates the data and is being evaluated.

### On-Policy Nature

SARSA evaluates and improves the policy it is *currently following*. With an $\varepsilon$-greedy behavior policy, SARSA converges to the optimal *$\varepsilon$-soft* policy -- the best policy that still explores with probability $\varepsilon$. This means SARSA's Q-values account for the cost of future exploratory actions, including occasionally random (and potentially catastrophic) moves.

For convergence to $Q^*$ (the truly optimal values), $\varepsilon$ must be decayed to zero over time using a GLIE (Greedy in the Limit with Infinite Exploration) schedule: explore sufficiently early but become greedy asymptotically.

### The Cliff-Walking Comparison

The cliff-walking gridworld crystallizes the Q-learning vs SARSA difference:

- **Q-learning** learns Q-values for the greedy policy and discovers the shortest path along the cliff edge. But during training with $\varepsilon$-greedy exploration, the agent frequently falls off the cliff, incurring -100 penalties.
- **SARSA** learns Q-values that account for the $\varepsilon$ probability of random actions. It discovers that walking near the cliff is dangerous *given its own exploration* and learns the safer path further from the edge.

Result: SARSA accumulates significantly more reward *during training*, while Q-learning finds the theoretically optimal (but training-dangerous) path.

> **Recommended visual**: Cliff-walking reward curves for Q-learning vs SARSA.
> *Source*: Sutton & Barto, *Reinforcement Learning: An Introduction*, Figure 6.5.

### Expected SARSA

Expected SARSA replaces the sampled next action with the expectation over all next actions under the current policy:

$$Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha \left[ R_{t+1} + \gamma \sum_a \pi(a \mid S_{t+1}) Q(S_{t+1}, a) - Q(S_t, A_t) \right]$$

This eliminates the variance introduced by sampling $A_{t+1}$, producing more stable updates. Expected SARSA:

- With an $\varepsilon$-greedy policy, it is on-policy like SARSA but with lower variance.
- With a greedy target policy, it reduces to Q-learning (since $\sum_a \pi_{\text{greedy}}(a \mid s) Q(s, a) = \max_a Q(s, a)$).
- Empirically, Expected SARSA generally outperforms both SARSA and Q-learning across a range of step sizes.

Expected SARSA is computationally more expensive per update ($O(|A|)$ vs $O(1)$), but the variance reduction typically more than compensates.

## Why It Matters

SARSA demonstrates a fundamental principle: in safety-critical environments where exploratory mistakes carry real costs, learning about the policy you are *actually executing* is more prudent than learning about a hypothetical optimal policy. This on-policy philosophy extends to modern algorithms like PPO and A2C, which optimize the policy currently being used for data collection. SARSA also introduced Expected SARSA, which is arguably the best tabular TD control algorithm and forms the basis for expected-value-based updates in deep RL.

## Key Technical Details

- **Convergence**: SARSA converges to $Q^\pi$ (Q-values of the current policy) under standard Robbins-Monro conditions. With a GLIE policy ($\varepsilon \to 0$), it converges to $Q^*$.
- **On-policy data requirement**: SARSA cannot effectively learn from data generated by a different policy (unlike Q-learning). Replaying old experience is problematic because the data distribution no longer matches the current policy.
- **Variance**: Standard SARSA has higher per-update variance than Expected SARSA because $A_{t+1}$ is sampled. Lower variance than MC because only one-step sampling is involved.
- **Step size sensitivity**: SARSA is generally less sensitive to the choice of $\alpha$ than Q-learning, because its targets are less noisy (no $\max$ operator amplifying estimation errors).
- **Expected SARSA cost**: $O(|A|)$ per update vs $O(1)$ for SARSA and Q-learning, but the improved stability often allows larger $\alpha$ values, leading to faster overall learning.
- **Safety advantage**: In environments with catastrophic states (cliffs, obstacles), SARSA's on-policy nature produces more conservative, often safer, behavior during training.

## Common Misconceptions

- **"SARSA is just a worse version of Q-learning."** SARSA optimizes a different objective: the value of the policy being followed, not the value of the optimal policy. When exploration is risky, SARSA's "worse" asymptotic policy may yield far more reward during training. The right algorithm depends on the setting.
- **"SARSA cannot find the optimal policy."** SARSA converges to $Q^*$ if $\varepsilon$ is properly decayed to zero (GLIE schedule). The caveat is that with a fixed $\varepsilon > 0$, it converges to the best $\varepsilon$-soft policy, which is suboptimal.
- **"Expected SARSA is always on-policy."** Expected SARSA can be either on-policy or off-policy depending on the target policy used in the expectation. When the target policy is greedy, Expected SARSA is mathematically identical to Q-learning.

## Connections to Other Concepts

- `q-learning.md` -- The off-policy counterpart to SARSA. Where SARSA uses $Q(S_{t+1}, A_{t+1})$, Q-learning uses $\max_a Q(S_{t+1}, a)$.
- `temporal-difference-learning.md` -- SARSA is TD(0) applied to action-value functions for control. The TD error is $\delta_t = R_{t+1} + \gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t)$.
- `n-step-methods.md` -- N-step SARSA extends the idea by bootstrapping after $n$ steps, using the $n$-step return as the target.
- `eligibility-traces.md` -- SARSA($\lambda$) combines SARSA with eligibility traces for more efficient credit assignment.
- `exploration-vs-exploitation.md` -- SARSA's on-policy nature means its value estimates inherently account for the cost of exploration.
- `proximal-policy-optimization.md` -- PPO is a modern on-policy algorithm that shares SARSA's philosophy of optimizing the policy being executed, extended to continuous action spaces with neural networks.

## Further Reading

1. **"On-Line Q-Learning Using Connectionist Systems" (Rummery & Niranjan, 1994)** -- The original paper introducing SARSA (as "Modified Connectionist Q-Learning").
2. **"Reinforcement Learning: An Introduction," Section 6.4 (Sutton & Barto, 2018)** -- The textbook treatment of SARSA with the cliff-walking example and Expected SARSA.
3. **"A Theoretical and Empirical Analysis of Expected Sarsa" (van Seijen et al., 2009)** -- Formal analysis showing Expected SARSA's variance reduction and empirical superiority.
4. **"Between MDPs and Semi-MDPs: A Framework for Temporal Abstraction in Reinforcement Learning" (Sutton, Precup & Singh, 1999)** -- Extends on-policy methods including SARSA to temporally abstract options.
