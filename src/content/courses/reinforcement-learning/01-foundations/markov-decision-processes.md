# Markov Decision Processes

**One-Line Summary**: The mathematical framework formalizing sequential decision-making with states, actions, transition probabilities, and rewards.

**Prerequisites**: Basic probability theory, conditional probability, `what-is-reinforcement-learning.md`.

## What Is a Markov Decision Process?

Imagine you are navigating a city with a GPS. At every intersection (state), you choose a road (action). The traffic conditions (transition probabilities) determine where you actually end up, and you incur a travel time cost (reward). Your GPS does not care about how you arrived at the current intersection -- only where you are now matters for deciding the best next turn. That "only the present matters" property is the **Markov property**, and the entire setup is a **Markov Decision Process** (MDP).

An MDP provides the precise mathematical language for describing any problem where an agent makes sequential decisions under uncertainty. It is to reinforcement learning what the loss function is to supervised learning: the formal object that defines the problem.

## How It Works

### The MDP Tuple

An MDP is defined by a 5-tuple $(\mathcal{S}, \mathcal{A}, P, R, \gamma)$:

- $\mathcal{S}$ -- A set of **states** (finite or infinite). See `states-actions-rewards.md`.
- $\mathcal{A}$ -- A set of **actions** available to the agent (may depend on state: $\mathcal{A}(s)$).
- $P$ -- **Transition dynamics**: $P(s' \mid s, a) = \Pr(S_{t+1} = s' \mid S_t = s, A_t = a)$.
- $R$ -- **Reward function**: $R(s, a, s')$ or sometimes $R(s, a)$. The expected reward is $r(s, a) = \mathbb{E}[R_{t+1} \mid S_t = s, A_t = a]$.
- $\gamma$ -- **Discount factor**: $\gamma \in [0, 1]$. See `return-and-discount-factor.md`.

The transition function satisfies:

$$\sum_{s' \in \mathcal{S}} P(s' \mid s, a) = 1 \quad \forall s \in \mathcal{S}, \; a \in \mathcal{A}(s)$$

### The Markov Property

The defining feature of an MDP is the **Markov property** (also called "memorylessness"):

$$\Pr(S_{t+1} = s', R_{t+1} = r \mid S_t, A_t, S_{t-1}, A_{t-1}, \ldots, S_0, A_0) = \Pr(S_{t+1} = s', R_{t+1} = r \mid S_t, A_t)$$

The future depends on the past only through the present state. This is not a restriction on the environment -- it is a requirement on the **state representation**. If the state captures all relevant information, the Markov property holds by construction.

<!-- Recommended visual: MDP state transition diagram with 3-4 states
     Source: Draw a simple directed graph with states as nodes, actions labeling edges,
     and transition probabilities on each edge -->

### Finite vs. Infinite MDPs

**Finite MDPs** have finite state and action spaces ($|\mathcal{S}| < \infty$, $|\mathcal{A}| < \infty$). The transition dynamics can be stored as a $|\mathcal{S}| \times |\mathcal{A}| \times |\mathcal{S}|$ tensor. Most theoretical results in RL are proven for finite MDPs.

**Continuous MDPs** have continuous state spaces (e.g., $\mathcal{S} \subseteq \mathbb{R}^n$), continuous action spaces (e.g., $\mathcal{A} \subseteq \mathbb{R}^m$), or both. Robotics problems typically involve continuous MDPs. The transition function becomes a conditional density: $p(s' \mid s, a)$.

### Episodic vs. Continuing Tasks

**Episodic tasks** have a natural terminal state. The interaction breaks into **episodes**, each starting from an initial state and ending at termination. Examples: a game of chess, navigating a maze, a dialogue turn.

The return for an episode of length $T$ is:

$$G_t = \sum_{k=0}^{T-t-1} \gamma^k R_{t+k+1}$$

**Continuing tasks** have no terminal state and run indefinitely. Examples: process control, server load balancing, a robot maintaining balance. Here, discounting ($\gamma < 1$) is essential to keep the return finite:

$$G_t = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}$$

Sutton & Barto (2018) unify both cases using an **absorbing state** that transitions only to itself with zero reward, allowing episodic tasks to be treated as a special case of continuing tasks.

### The Dynamics Function

The full dynamics of an MDP are captured by the four-argument function:

$$p(s', r \mid s, a) = \Pr(S_{t+1} = s', R_{t+1} = r \mid S_t = s, A_t = a)$$

From this, we can derive:
- **Transition probabilities**: $P(s' \mid s, a) = \sum_r p(s', r \mid s, a)$
- **Expected reward**: $r(s, a) = \sum_r r \sum_{s'} p(s', r \mid s, a)$
- **Expected reward given transition**: $r(s, a, s') = \sum_r r \cdot \frac{p(s', r \mid s, a)}{P(s' \mid s, a)}$

### Extensions Beyond Standard MDPs

| Extension | What Changes | Example |
|---|---|---|
| **POMDP** | Agent observes $O_t$ instead of $S_t$ | Robot with noisy sensors |
| **Semi-MDP** | Actions take variable time | Options framework |
| **Dec-POMDP** | Multiple agents, partial observability | Multi-robot coordination |
| **Constrained MDP** | Additional cost constraints | Safe RL |
| **Factored MDP** | State is a product of variables | Large structured domains |

## Why It Matters

Every RL algorithm -- from tabular Q-learning to PPO to RLHF -- implicitly or explicitly assumes an underlying MDP (or extension thereof). Understanding MDPs is essential for: (1) correctly formulating a real-world problem as an RL problem, (2) understanding what theoretical guarantees apply, and (3) diagnosing failures when the Markov assumption is violated.

## Key Technical Details

- A finite MDP with $|\mathcal{S}|$ states and $|\mathcal{A}|$ actions requires $|\mathcal{S}|^2 \times |\mathcal{A}|$ parameters to specify the transition function.
- The Markov property is about the **state representation**, not the environment. History-dependent environments can still be Markovian if the state is augmented (e.g., using frame stacking in Atari, where DQN concatenates the last 4 frames).
- **Ergodic MDPs** -- where every state is reachable from every other state under any policy -- guarantee that the value function is well-defined for all policies.
- When the transition function $P$ and reward function $R$ are known, the MDP can be solved exactly via **dynamic programming**. When they are unknown, we enter the realm of RL.

## Common Misconceptions

**"The Markov property means the environment has no memory."** The environment can have arbitrarily complex dynamics. The Markov property states that the state representation captures all information needed for prediction. If it does not, you need a richer state (or a POMDP formulation).

**"Real-world problems are never truly Markov."** True in theory, but in practice, a sufficiently rich state representation makes the Markov assumption a reasonable approximation. Deep RL uses neural networks to learn representations that are approximately Markov.

**"MDPs require discrete states and actions."** MDPs generalize naturally to continuous spaces. Continuous-state MDPs are standard in control theory and robotics.

## Connections to Other Concepts

- `what-is-reinforcement-learning.md` -- MDPs formalize the RL problem.
- `states-actions-rewards.md` -- Detailed treatment of the components of the MDP tuple.
- `return-and-discount-factor.md` -- The objective function defined over MDPs.
- `policies.md` -- Solutions to MDPs are expressed as policies.
- `bellman-equations.md` -- The recursive equations that characterize value functions in MDPs.
- `value-functions.md` -- How to evaluate policies within the MDP framework.

## Further Reading

- **Puterman (1994)** -- *Markov Decision Processes: Discrete Stochastic Dynamic Programming*. The authoritative mathematical treatment of MDPs covering existence of optimal policies, solution methods, and structural results.
- **Sutton & Barto (2018)** -- *Reinforcement Learning: An Introduction*, Chapters 3-4. Accessible introduction to the MDP formalism and dynamic programming solutions.
- **Bellman (1957)** -- *Dynamic Programming*. The foundational work introducing the principle of optimality and the Bellman equation.
- **Kaelbling, Littman & Cassandra (1998)** -- "Planning and acting in partially observable stochastic domains." *Artificial Intelligence*, 101. Definitive treatment of POMDPs.
- **Bertsekas & Tsitsiklis (1996)** -- *Neuro-Dynamic Programming*. Bridges MDPs with approximate/neurally parameterized solutions.
