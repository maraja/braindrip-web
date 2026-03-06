# Policies

**One-Line Summary**: The agent's decision rule mapping states to actions -- the central object that RL algorithms learn.

**Prerequisites**: `what-is-reinforcement-learning.md`, `markov-decision-processes.md`, `states-actions-rewards.md`.

## What Is a Policy?

A policy is like a playbook. A basketball coach's playbook says: "When the shot clock is under 5 seconds and we're trailing, run play X." It maps situations to decisions. In RL, a **policy** $\pi$ maps states to actions -- it is the complete specification of how an agent behaves. If you know the policy, you know exactly what the agent will do (or the probability of what it will do) in every possible situation.

The entire goal of reinforcement learning can be stated in one sentence: **find the best policy.** Every algorithm -- value-based, policy-based, or model-based -- is ultimately a different strategy for searching the space of policies.

## How It Works

### Formal Definition

A policy $\pi$ is a mapping from states to actions (or distributions over actions):

$$\pi : \mathcal{S} \to \mathcal{A} \quad \text{(deterministic)}$$

$$\pi(a \mid s) = \Pr(A_t = a \mid S_t = s) \quad \text{(stochastic)}$$

A stochastic policy assigns a probability to each action in each state, satisfying:

$$\sum_{a \in \mathcal{A}} \pi(a \mid s) = 1, \quad \pi(a \mid s) \geq 0 \quad \forall s, a$$

### Deterministic vs. Stochastic Policies

**Deterministic policies** select a single action in each state: $a = \pi(s)$. They are simpler and, in fully observable MDPs, sufficient -- there always exists a deterministic optimal policy (Puterman, 1994).

**Stochastic policies** assign probabilities to actions: $a \sim \pi(\cdot \mid s)$. They are essential in several scenarios:

- **Partial observability (POMDPs)**: When the agent cannot distinguish between states, a stochastic policy can outperform any deterministic one.
- **Multi-agent settings**: Mixed strategies (stochastic policies) are necessary for Nash equilibria in competitive games (e.g., rock-paper-scissors has no deterministic equilibrium).
- **Exploration**: Stochastic policies naturally explore by sampling different actions.
- **Policy gradient methods**: Algorithms like REINFORCE and PPO optimize stochastic policies, using the gradient of the expected return with respect to policy parameters.

### Policy Parameterization

In practice, policies are represented by parameterized functions $\pi_\theta$ with parameters $\theta$.

**Tabular policies.** For small, discrete state-action spaces, the policy is stored as a lookup table with $|\mathcal{S}| \times |\mathcal{A}|$ entries. Each entry stores $\pi(a \mid s)$.

**Linear policies.** The action probabilities are a linear function of state features:

$$\pi_\theta(a \mid s) = \text{softmax}(\theta^\top \phi(s, a))$$

where $\phi(s, a)$ is a feature vector.

**Neural network policies.** A neural network takes the state as input and outputs either:
- Action probabilities (discrete): $\pi_\theta(a \mid s) = \text{softmax}(f_\theta(s))$
- Distribution parameters (continuous): $\mu_\theta(s), \sigma_\theta(s)$ for a Gaussian $\pi_\theta(a \mid s) = \mathcal{N}(a \mid \mu_\theta(s), \sigma_\theta^2(s))$

<!-- Recommended visual: Diagram showing neural network policy with state input, hidden layers,
     and output layer producing action probabilities
     Source: Standard policy network architecture diagram -->

### The Optimal Policy

The **optimal policy** $\pi^*$ achieves the highest expected return from every state simultaneously:

$$\pi^* = \arg\max_\pi V^\pi(s) \quad \forall s \in \mathcal{S}$$

where $V^\pi(s)$ is the state-value function under $\pi$ (see `value-functions.md`).

A fundamental theorem of MDPs (Puterman, 1994): for any finite MDP, there exists at least one deterministic optimal policy, and it can be derived from the optimal action-value function:

$$\pi^*(s) = \arg\max_a Q^*(s, a)$$

This result is why value-based methods (like Q-learning) work: learn $Q^*$, then act greedily.

### Policy Classes

**Greedy policies** always choose the action with the highest estimated value:

$$\pi_{\text{greedy}}(s) = \arg\max_a Q(s, a)$$

**Epsilon-greedy policies** explore with probability $\epsilon$ and exploit with probability $1 - \epsilon$ (see `exploration-vs-exploitation.md`):

$$\pi_\epsilon(a \mid s) = \begin{cases} 1 - \epsilon + \frac{\epsilon}{|\mathcal{A}|} & \text{if } a = \arg\max_{a'} Q(s, a') \\ \frac{\epsilon}{|\mathcal{A}|} & \text{otherwise} \end{cases}$$

**Softmax (Boltzmann) policies** choose actions proportionally to exponentiated values:

$$\pi_\tau(a \mid s) = \frac{\exp(Q(s, a) / \tau)}{\sum_{a'} \exp(Q(s, a') / \tau)}$$

where $\tau > 0$ is a temperature parameter. As $\tau \to 0$, this converges to the greedy policy; as $\tau \to \infty$, it becomes uniform.

### Behavior Policy vs. Target Policy

In **off-policy** learning, two policies coexist:
- The **behavior policy** $b(a \mid s)$ generates the data (the actions actually taken).
- The **target policy** $\pi(a \mid s)$ is the policy being evaluated or improved.

Q-learning uses an epsilon-greedy behavior policy while learning the greedy (optimal) target policy. Importance sampling corrects for the mismatch: $\rho_t = \frac{\pi(A_t \mid S_t)}{b(A_t \mid S_t)}$.

## Why It Matters

The policy is the deliverable of an RL system. After training, the policy is deployed -- it is what the robot executes, what the game AI uses, what the recommendation engine applies. Choosing the right policy representation (tabular, linear, neural network) and the right policy class (deterministic, stochastic, parameterized) directly determines the expressiveness, trainability, and deployability of the RL solution.

## Key Technical Details

- **Policy gradient theorem** (Sutton et al., 2000): $\nabla_\theta J(\theta) = \mathbb{E}_\pi \left[ \nabla_\theta \log \pi_\theta(a \mid s) \cdot Q^\pi(s, a) \right]$. This enables gradient-based optimization of stochastic policies.
- A **stationary policy** does not change over time: $\pi(a \mid s)$ is independent of $t$. Optimal policies for infinite-horizon discounted MDPs are always stationary.
- **Policy entropy** $H(\pi(\cdot \mid s)) = -\sum_a \pi(a \mid s) \log \pi(a \mid s)$ measures exploration. Maximum entropy RL (e.g., SAC) adds an entropy bonus to the objective.
- In continuous action spaces, the policy typically outputs a squashed Gaussian: $a = \tanh(\mu_\theta(s) + \sigma_\theta(s) \cdot \epsilon)$, $\epsilon \sim \mathcal{N}(0, I)$, to bound actions within a valid range.

## Common Misconceptions

**"A stochastic policy is always suboptimal."** In fully observable MDPs, a deterministic optimal policy always exists. But stochastic policies can be optimal in POMDPs and are necessary in competitive multi-agent games. Furthermore, during training, stochastic policies are essential for exploration.

**"Policy-based and value-based methods are fundamentally different."** They are deeply connected. Value-based methods implicitly define a policy (greedy w.r.t. $Q$). Actor-critic methods explicitly maintain both. The policy gradient theorem itself involves the value function $Q^\pi$.

**"The optimal policy is unique."** Multiple policies can be optimal if they achieve the same maximum value in all states but differ in states where multiple actions are equally good (ties in $\arg\max_a Q^*(s, a)$).

## Connections to Other Concepts

- `markov-decision-processes.md` -- Policies are solutions to MDPs.
- `value-functions.md` -- Value functions evaluate the quality of a policy.
- `bellman-equations.md` -- The Bellman equations characterize value functions under a given policy.
- `exploration-vs-exploitation.md` -- Epsilon-greedy and Boltzmann policies are exploration strategies.
- `return-and-discount-factor.md` -- The policy maximizes the expected return.

## Further Reading

- **Sutton et al. (2000)** -- "Policy gradient methods for reinforcement learning with function approximation." *NeurIPS*. Proves the policy gradient theorem, enabling gradient-based policy optimization.
- **Puterman (1994)** -- *Markov Decision Processes*. Proves existence of deterministic optimal policies for finite MDPs.
- **Schulman et al. (2017)** -- "Proximal Policy Optimization algorithms." *arXiv*. Introduces PPO, the most widely used policy optimization algorithm in practice.
- **Haarnoja et al. (2018)** -- "Soft actor-critic: Off-policy maximum entropy deep reinforcement learning." *ICML*. Introduces SAC with maximum-entropy policy optimization.
- **Silver et al. (2014)** -- "Deterministic policy gradient algorithms." *ICML*. Extends the policy gradient theorem to deterministic policies, enabling DPG and DDPG.
