# States, Actions, and Rewards

**One-Line Summary**: The three primitives of every RL problem: where you are, what you can do, and what you get for doing it.

**Prerequisites**: `what-is-reinforcement-learning.md`, `markov-decision-processes.md`.

## What Are States, Actions, and Rewards?

Think of learning to cook. Your **state** is everything you can observe: the ingredients on the counter, what is in the pan, the temperature of the burner, and the timer reading. Your **actions** are the things you can do: chop, stir, adjust heat, add seasoning. Your **reward** is the quality of the final dish (and the intermediate feedback -- does it smell right? does the sauce thicken properly?). Every RL problem, no matter how complex, reduces to these three primitives.

Getting these representations right is arguably the most important design decision in applied RL. A well-chosen state representation, action space, and reward function can make a problem trivially solvable; poor choices can make it impossible.

## How It Works

### States

The state $S_t \in \mathcal{S}$ is the information available to the agent at time $t$. It should satisfy the Markov property (see `markov-decision-processes.md`): the state must contain enough information to predict future states and rewards without knowledge of the history.

**Discrete state spaces.** The state is one of a finite set: $\mathcal{S} = \{s_1, s_2, \ldots, s_n\}$. Examples: board positions in chess ($|\mathcal{S}| \approx 10^{47}$ legal positions), grid-world cells, inventory levels.

**Continuous state spaces.** The state is a vector in $\mathbb{R}^n$: $\mathcal{S} \subseteq \mathbb{R}^n$. Examples: joint angles and velocities of a robot arm ($n = 14$ for a 7-DOF arm), position and velocity in physics simulations.

**High-dimensional observations.** Raw pixel inputs produce states in $\mathbb{R}^{H \times W \times C}$. Atari DQN uses $84 \times 84 \times 4$ grayscale frames (4-frame stack to capture motion), yielding a state space of effective dimensionality $\approx 28{,}224$.

**Partial observability.** When the agent cannot see the full state, the problem becomes a **Partially Observable MDP** (POMDP). The agent receives an observation $O_t$ generated from the true state via an observation function $\mathcal{O}(o \mid s)$. Common remedies:
- **Frame stacking**: Concatenate recent observations (e.g., DQN's 4-frame approach).
- **Recurrent networks**: Use LSTMs or GRUs to maintain a learned memory (Hausknecht & Stone, 2015).
- **Belief states**: Maintain a probability distribution over possible states.

### Actions

The action $A_t \in \mathcal{A}$ (or $A_t \in \mathcal{A}(S_t)$ when actions depend on state) represents the agent's choice at time $t$.

**Discrete action spaces.** A finite set of choices: $\mathcal{A} = \{a_1, a_2, \ldots, a_m\}$. Examples: Atari games (typically 4--18 actions), board games (Go has up to 361 legal moves per turn).

**Continuous action spaces.** Actions are real-valued vectors: $\mathcal{A} \subseteq \mathbb{R}^m$. Examples: torques applied to robot joints, throttle and steering angle in autonomous driving. Algorithms like DDPG, TD3, and SAC are designed specifically for continuous actions.

**Hybrid action spaces.** Some problems combine discrete and continuous elements. Example: in a strategy game, the agent first chooses an action type (discrete) then specifies parameters (continuous).

**Multi-dimensional action spaces.** When the action has multiple components, the space grows combinatorially. For $m$ binary sub-actions, the joint space has $2^m$ elements. Factored action representations and action decomposition address this.

### Rewards

The reward $R_{t+1} \in \mathbb{R}$ is a scalar signal the agent receives after taking action $A_t$ in state $S_t$. It encodes the designer's objective.

The **reward hypothesis** (Sutton & Barto, 2018): all goals can be described by the maximization of expected cumulative reward. This is a strong assumption and an active area of philosophical and technical debate.

**Dense rewards** provide feedback at every timestep. Example: in a racing game, reward proportional to forward velocity. Dense rewards are easier to learn from but may require careful engineering.

**Sparse rewards** provide non-zero feedback only at critical moments. Example: $+1$ for winning a game, $0$ otherwise. Sparse rewards are easier to specify correctly but create a difficult **credit assignment** problem -- the agent must determine which of thousands of actions led to the final outcome.

$$R_{\text{sparse}}(s, a) = \begin{cases} +1 & \text{if } s' \text{ is a goal state} \\ 0 & \text{otherwise} \end{cases}$$

### Reward Design Challenges

**Reward shaping** adds intermediate rewards to guide learning without changing the optimal policy. Ng et al. (1999) proved that **potential-based reward shaping** preserves optimal policies:

$$F(s, a, s') = \gamma \Phi(s') - \Phi(s)$$

where $\Phi : \mathcal{S} \to \mathbb{R}$ is an arbitrary potential function.

**Reward hacking** occurs when the agent exploits the reward function in unintended ways. The classic example: a boat-racing agent that collects power-ups in a circle instead of finishing the race, because power-up rewards exceed completion rewards.

<!-- Recommended visual: Spectrum from sparse to dense rewards with examples
     Source: Create a horizontal spectrum diagram -->

## Why It Matters

The choice of state representation determines what the agent can learn: too little information violates the Markov property; too much creates an unnecessarily large learning problem. The action space determines the granularity of control. The reward function determines what behavior the agent will actually optimize -- which may differ from what the designer intended. In applied RL, practitioners report spending more time on state/action/reward design than on algorithm selection.

## Key Technical Details

- **State aliasing** occurs when different true states map to the same observation, confusing the agent. This is the core issue in POMDPs.
- For continuous actions, policies typically output parameters of a distribution (e.g., mean and variance of a Gaussian), then sample: $a \sim \mathcal{N}(\mu_\theta(s), \sigma_\theta^2(s))$.
- Reward clipping (e.g., DQN clips all rewards to $[-1, +1]$) stabilizes training but distorts the relative magnitude of outcomes.
- **Intrinsic motivation** augments external rewards with curiosity-driven bonuses: $R_{\text{total}} = R_{\text{extrinsic}} + \beta \cdot R_{\text{intrinsic}}$, where $R_{\text{intrinsic}}$ might measure prediction error or state novelty (Pathak et al., 2017).
- A common guideline: reward functions should specify **what** you want, not **how** to achieve it.

## Common Misconceptions

**"The state is the same as the observation."** In a fully observable MDP, yes. In a POMDP, the observation $O_t$ is a lossy projection of the true state $S_t$. Conflating them leads to policies that fail when the missing information is decision-relevant.

**"More reward signal is always better."** Overly engineered dense rewards can introduce bias, guiding the agent toward a suboptimal strategy that happens to collect intermediate rewards. Sometimes less is more.

**"Continuous action spaces are always harder."** They eliminate the possibility of exhaustive enumeration, but algorithms like SAC achieve strong performance by leveraging gradient-based optimization through the policy. The difficulty depends on the structure of the problem, not just the space type.

## Connections to Other Concepts

- `markov-decision-processes.md` -- States, actions, and rewards are the building blocks of the MDP tuple.
- `return-and-discount-factor.md` -- The return aggregates rewards over time.
- `policies.md` -- Policies map states to actions.
- `value-functions.md` -- Value functions evaluate the expected cumulative reward from states and state-action pairs.
- `exploration-vs-exploitation.md` -- Sparse rewards make exploration critical.

## Further Reading

- **Sutton & Barto (2018)** -- *Reinforcement Learning: An Introduction*, Chapter 3. Foundational treatment of the agent-environment interface.
- **Ng, Harada & Russell (1999)** -- "Policy invariance under reward transformations." *ICML*. Proves conditions under which reward shaping preserves optimal policies.
- **Pathak et al. (2017)** -- "Curiosity-driven exploration by self-supervised prediction." *ICML*. Introduces intrinsic curiosity as an exploration reward.
- **Dulac-Arnold et al. (2021)** -- "Challenges of real-world reinforcement learning." *JMLR*. Catalogs practical issues including reward design and state representation.
- **Hausknecht & Stone (2015)** -- "Deep recurrent Q-learning for partially observable MDPs." *AAAI-SDLRL Workshop*. Addresses partial observability with recurrent architectures.
