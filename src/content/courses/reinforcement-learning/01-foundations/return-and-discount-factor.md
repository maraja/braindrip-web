# Return and Discount Factor

**One-Line Summary**: Cumulative future reward geometrically discounted by gamma -- the objective every RL agent optimizes.

**Prerequisites**: `what-is-reinforcement-learning.md`, `markov-decision-processes.md`, `states-actions-rewards.md`.

## What Is the Return?

Imagine you are offered two deals: $100 today, or $100 one year from now. Most people prefer the money today -- not just because of inflation, but because the future is uncertain and immediate rewards can be reinvested. RL agents face the same tradeoff. The **return** formalizes "total value of future rewards," and the **discount factor** $\gamma$ controls how much the agent cares about the distant future versus the immediate present.

The return is the single number that an RL agent is trying to maximize. It transforms a stream of individual rewards into one scalar objective, making it possible to compare different policies and define what "optimal" means.

## How It Works

### Undiscounted Return

The simplest aggregation of rewards is the **undiscounted return** -- the sum of all future rewards from timestep $t$:

$$G_t = R_{t+1} + R_{t+2} + R_{t+3} + \cdots = \sum_{k=0}^{T-t-1} R_{t+k+1}$$

This works for **episodic tasks** with a finite horizon $T$ (e.g., a game that always ends). But for **continuing tasks** where $T = \infty$, this sum can diverge to infinity, making comparison between policies meaningless.

### Discounted Return

The **discounted return** solves this by geometrically decaying future rewards:

$$G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \cdots = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}$$

where $\gamma \in [0, 1)$ is the **discount factor**.

This sum is guaranteed to converge when rewards are bounded ($|R_t| \leq R_{\max}$):

$$|G_t| \leq \sum_{k=0}^{\infty} \gamma^k R_{\max} = \frac{R_{\max}}{1 - \gamma}$$

### The Recursive Structure

A crucial property of the discounted return is its **recursive decomposition**:

$$G_t = R_{t+1} + \gamma G_{t+1}$$

This identity is the foundation of the Bellman equations (see `bellman-equations.md`) and enables all temporal-difference learning algorithms.

<!-- Recommended visual: Bar chart showing exponential decay of reward weighting for different gamma values
     Source: Plot gamma^k for k=0..20 with gamma = 0.5, 0.9, 0.99 -->

### Why Discount? Three Perspectives

**Mathematical necessity.** For continuing tasks with unbounded horizons, discounting ensures the return is finite and well-defined.

**Economic intuition.** Future rewards are uncertain. A reward of $+1$ at $t+100$ might never materialize if the episode terminates or the environment shifts. Discounting reflects this uncertainty, analogous to the "time value of money" in finance.

**Algorithmic convenience.** Discounting creates a contraction mapping in the Bellman operator, guaranteeing convergence of value iteration and Q-learning:

$$\| T^* V - T^* V' \|_\infty \leq \gamma \| V - V' \|_\infty$$

where $T^*$ is the Bellman optimality operator. The contraction factor is exactly $\gamma$.

### The Effect of Gamma on Behavior

| $\gamma$ | Behavior | Effective Horizon | Character |
|---|---|---|---|
| $0$ | Purely myopic: maximize immediate reward | 1 step | Greedy |
| $0.9$ | Moderate foresight | $\frac{1}{1-\gamma} = 10$ steps | Balanced |
| $0.99$ | Long-term planning | $\frac{1}{1-\gamma} = 100$ steps | Far-sighted |
| $0.999$ | Very long horizon | $\frac{1}{1-\gamma} = 1000$ steps | Patient |
| $1$ | No discounting (episodic only) | $\infty$ | Undiscounted |

The **effective horizon** $\frac{1}{1-\gamma}$ gives the approximate number of future steps that significantly influence the return. Rewards beyond this horizon contribute negligibly.

### Gamma as a Hyperparameter

In practice, $\gamma$ is a tunable hyperparameter with profound effects on learning:

- **Low $\gamma$ (0.9--0.95)**: Faster learning, more stable training, but the agent may miss long-term strategies. Good for problems with short-horizon dependencies.
- **High $\gamma$ (0.99--0.999)**: Agent accounts for distant consequences, but variance of return estimates increases, requiring more samples. Standard for complex tasks like game playing.
- **$\gamma = 1$**: Used in episodic tasks where every reward is equally important regardless of timing. Requires finite episodes.

The variance of the return estimate scales approximately as $\frac{1}{(1-\gamma)^2}$, meaning $\gamma = 0.99$ produces roughly $100\times$ more variance than $\gamma = 0.9$.

### Formal Objective

The RL objective is to find a policy $\pi$ maximizing the expected return:

$$\pi^* = \arg\max_\pi \; \mathbb{E}_\pi [G_t] = \arg\max_\pi \; \mathbb{E}_\pi \left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \right]$$

This expectation is taken over the stochasticity in the policy, the transitions, and the rewards. The value function $V^\pi(s) = \mathbb{E}_\pi[G_t \mid S_t = s]$ captures this expected return from each state (see `value-functions.md`).

## Why It Matters

The return is the objective function of RL. Every algorithm -- Q-learning, SARSA, policy gradient, actor-critic -- ultimately aims to maximize the expected return. The discount factor is not merely a mathematical convenience; it fundamentally shapes what the agent learns. Changing $\gamma$ can transform an agent from myopically grabbing nearby rewards to patiently executing long-horizon plans.

## Key Technical Details

- **Typical values**: Most deep RL implementations use $\gamma = 0.99$ (Atari DQN, PPO for MuJoCo, AlphaGo). Some sparse-reward tasks use $\gamma = 0.999$.
- **GAE (Generalized Advantage Estimation)** uses a separate discount parameter $\lambda$ in addition to $\gamma$ for bias-variance control in advantage estimates (Schulman et al., 2016).
- **Reward normalization** interacts with $\gamma$: normalizing returns by their running standard deviation helps stabilize training when $\gamma$ is close to 1.
- **Average reward formulation**: An alternative to discounting for continuing tasks uses the average reward rate $\rho^\pi = \lim_{T \to \infty} \frac{1}{T} \sum_{t=1}^{T} \mathbb{E}[R_t \mid \pi]$ as the objective.
- The $n$-step return interpolates between TD(0) ($n=1$) and Monte Carlo ($n=\infty$): $G_t^{(n)} = \sum_{k=0}^{n-1} \gamma^k R_{t+k+1} + \gamma^n V(S_{t+n})$.

## Common Misconceptions

**"Gamma represents the probability of episode termination."** This interpretation exists in some formulations (where $1 - \gamma$ is the termination probability at each step), but in general, $\gamma$ is a preference parameter controlling the tradeoff between short-term and long-term reward.

**"Lower gamma always makes learning easier."** Lower $\gamma$ reduces variance but introduces bias toward short-sighted strategies. If the optimal behavior requires long-horizon planning, low $\gamma$ makes the optimal policy unreachable.

**"Gamma = 1 means the agent values all rewards equally."** Technically yes, but only in episodic settings. In continuing tasks, $\gamma = 1$ makes the return undefined (potentially infinite), breaking most algorithms.

**"The discount factor is just a training trick."** Changing $\gamma$ changes the optimization objective itself, which can change the optimal policy. It is a fundamental part of the problem specification, not merely an implementation detail.

## Connections to Other Concepts

- `markov-decision-processes.md` -- Gamma is the fifth element of the MDP tuple.
- `states-actions-rewards.md` -- The return aggregates the reward signal.
- `value-functions.md` -- Value functions are defined as expected returns.
- `bellman-equations.md` -- The recursive structure $G_t = R_{t+1} + \gamma G_{t+1}$ is the basis for Bellman equations.
- `policies.md` -- The optimal policy maximizes the expected return.

## Further Reading

- **Sutton & Barto (2018)** -- *Reinforcement Learning: An Introduction*, Section 3.3--3.4. Clear exposition of returns and discounting with examples.
- **Schulman et al. (2016)** -- "High-dimensional continuous control using generalized advantage estimation." *ICLR*. Introduces GAE, showing how $\gamma$ and $\lambda$ jointly control bias-variance tradeoff.
- **Blackwell (1962)** -- "Discrete dynamic programming." *Annals of Mathematical Statistics*. Foundational work on discounted and average reward criteria for MDPs.
- **Kakade (2001)** -- "Optimizing average reward using discounted rewards." *COLT*. Proves formal relationships between discounted and average-reward objectives.
- **Amit et al. (2020)** -- "Discount factor as a regularizer in reinforcement learning." *ICML*. Analyzes the regularizing effect of $\gamma$ on policy optimization.
