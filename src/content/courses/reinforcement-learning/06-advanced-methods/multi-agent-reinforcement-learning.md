# Multi-Agent Reinforcement Learning

**One-Line Summary**: Multiple agents learning simultaneously in a shared environment create a non-stationary world where each agent's optimal strategy depends on what every other agent is doing.

**Prerequisites**: Markov decision processes, Q-learning, policy gradient methods, game theory basics (Nash equilibrium)

## What Is Multi-Agent Reinforcement Learning?

Imagine a crowded dance floor. If you are the only dancer, you can plan your moves freely -- the floor is your stage. But add fifty other dancers, each improvising their own routine, and suddenly the environment itself is alive and unpredictable. Your best move depends on what everyone else does, and their best moves depend on you. This mutual dependency is the core challenge of multi-agent reinforcement learning (MARL).

In MARL, two or more agents interact within a shared environment, each pursuing its own objective. The environment is no longer stationary from any single agent's perspective because the other agents are simultaneously learning and changing their policies. This breaks the foundational Markov property that single-agent RL relies on: the transition dynamics now depend on the joint actions of all agents, not just one.

## How It Works

### Problem Formulation: Stochastic Games

MARL extends the MDP to a **stochastic game** (also called a Markov game), defined by the tuple $(N, S, \{A_i\}_{i=1}^N, T, \{R_i\}_{i=1}^N, \gamma)$ where $N$ is the number of agents, $S$ is the shared state space, $A_i$ is the action space of agent $i$, and the transition function depends on the joint action:

$$T(s' \mid s, a_1, a_2, \dots, a_N)$$

Each agent $i$ receives its own reward $R_i(s, a_1, \dots, a_N)$ and seeks to maximize its own expected return. When all $R_i$ are identical, the game is **fully cooperative**. When $R_1 = -R_2$ (two-player), it is **fully competitive** (zero-sum). Most real-world problems are **mixed** -- partially cooperative, partially competitive.

### Independent Learners

The simplest approach is to have each agent run its own single-agent RL algorithm while treating other agents as part of the environment. Agent $i$ learns $Q_i(s, a_i)$ ignoring the actions of others. This is computationally cheap but theoretically fragile: the environment is non-stationary from each agent's viewpoint, violating the convergence guarantees of Q-learning. Surprisingly, independent learners often work reasonably well in practice, especially with experience replay modifications.

### Centralized Training with Decentralized Execution (CTDE)

The dominant paradigm in modern MARL is **CTDE**: during training, a central critic has access to all agents' observations and actions, but during execution, each agent acts using only its local observations. This resolves the non-stationarity problem at training time while remaining practical for deployment.

The critic for agent $i$ in an actor-critic CTDE framework estimates:

$$Q_i^{\text{central}}(s, a_1, a_2, \dots, a_N)$$

while each agent's policy $\pi_i(a_i \mid o_i)$ conditions only on its local observation $o_i$.

### QMIX: Monotonic Value Decomposition

QMIX (Rashid et al., 2018) is a cooperative MARL algorithm that factors the joint action-value function into individual utilities while enforcing a monotonicity constraint:

$$Q_{\text{tot}}(s, \mathbf{a}) = f_s(Q_1(o_1, a_1), Q_2(o_2, a_2), \dots, Q_N(o_N, a_N))$$

where $f_s$ is a mixing network with non-negative weights (ensuring $\frac{\partial Q_{\text{tot}}}{\partial Q_i} \geq 0$). This guarantees that a greedy action selection on each $Q_i$ individually yields the greedy joint action on $Q_{\text{tot}}$, enabling decentralized execution.

### MAPPO: Multi-Agent PPO

Multi-Agent PPO (Yu et al., 2022) applies proximal policy optimization in the CTDE framework. Each agent has its own policy network $\pi_{\theta_i}(a_i \mid o_i)$ and shares a centralized value function $V_\phi(s)$. The policy loss for each agent uses the standard PPO clipped objective:

$$L_i(\theta_i) = \mathbb{E}\left[\min\left(r_t(\theta_i) \hat{A}_t, \; \text{clip}(r_t(\theta_i), 1-\epsilon, 1+\epsilon) \hat{A}_t\right)\right]$$

Despite its simplicity, MAPPO has proven surprisingly competitive with more complex MARL algorithms.

### Nash Equilibrium and Solution Concepts

In competitive settings, the goal shifts from joint reward maximization to finding a **Nash equilibrium** -- a joint policy where no agent can improve its return by unilaterally changing its strategy:

$$\forall i, \; J_i(\pi_i^*, \pi_{-i}^*) \geq J_i(\pi_i, \pi_{-i}^*) \quad \text{for all } \pi_i$$

Computing Nash equilibria is PPAD-complete in general, making it intractable for large games. Practical algorithms approximate equilibria through self-play or population-based training.

### Emergent Communication

When agents are given a discrete communication channel alongside their action space, they can develop emergent communication protocols. Agent $i$ produces a message $m_i \sim \pi_i^{\text{comm}}(o_i)$ that is observed by other agents. Research has shown that meaningful, compositional language can emerge when communication is necessary for task success.

## Why It Matters

Multi-agent systems are everywhere: autonomous vehicle fleets negotiating intersections, trading agents in financial markets, robotic warehouse teams coordinating pick-and-place, and multiplayer game AI. Any system where multiple decision-makers interact requires MARL thinking. The 2019 OpenAI Five Dota 2 system and DeepMind's AlphaStar for StarCraft II demonstrated MARL at scale in competitive settings.

## Key Technical Details

- **Scalability wall**: joint action space grows as $|A|^N$, making naive centralized approaches intractable beyond a handful of agents
- **Non-stationarity**: from agent $i$'s perspective, $P(s' \mid s, a_i)$ changes as other agents update their policies
- **Credit assignment**: in cooperative settings, determining which agent's action caused a team reward is the **multi-agent credit assignment** problem; QMIX and COMA address this differently
- **Self-play** is the standard approach for competitive settings; fictitious self-play maintains a population of past policies to avoid cyclic non-convergence
- **Parameter sharing** across agents of the same type can dramatically reduce sample complexity in homogeneous teams
- MAPPO typically uses 15 PPO epochs per batch with a clipping parameter of $\epsilon = 0.2$

## Common Misconceptions

- **"Independent learners cannot work"**: While theoretically unjustified, independent Q-learners with experience replay often perform competitively. The non-stationarity is often mild in practice, especially with large replay buffers.
- **"More communication is always better"**: Unrestricted communication channels often lead to information overload. Bandwidth-limited channels can produce more efficient, structured communication.
- **"Nash equilibria are always the right solution concept"**: Nash equilibria can be highly suboptimal in cooperative games. Correlated equilibria or team-optimal solutions are often more appropriate.

## Connections to Other Concepts

- Builds on single-agent foundations from `policy-gradient-theorem.md` and `deep-q-networks.md`
- Self-play in competitive MARL relates to `reward-shaping.md` through opponent-induced curricula
- Emergent communication connects to `meta-reinforcement-learning.md` through learned adaptation protocols
- Cooperative MARL credit assignment parallels the reward attribution problem in `curiosity-driven-exploration.md`

## Further Reading

- **Rashid et al., "QMIX: Monotonic Value Function Factorisation for Deep Multi-Agent Reinforcement Learning" (2018)**: Introduces the monotonic mixing network for cooperative value decomposition.
- **Yu et al., "The Surprising Effectiveness of PPO in Cooperative Multi-Agent Games" (2022)**: Demonstrates that well-tuned MAPPO matches or beats specialized MARL algorithms.
- **Lowe et al., "Multi-Agent Actor-Critic for Mixed Cooperative-Competitive Environments" (2017)**: Proposes MADDPG, a foundational CTDE algorithm for continuous action spaces.
- **Foerster et al., "Learning to Communicate with Deep Multi-Agent Reinforcement Learning" (2016)**: Early work on differentiable inter-agent communication channels.
- **Lanctot et al., "OpenSpiel: A Framework for Reinforcement Learning in Games" (2019)**: Comprehensive benchmark suite for multi-agent research.
