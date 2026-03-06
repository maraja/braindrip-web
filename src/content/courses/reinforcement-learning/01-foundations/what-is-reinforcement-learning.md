# What Is Reinforcement Learning?

**One-Line Summary**: An agent learns to make sequential decisions by interacting with an environment and maximizing cumulative reward -- the third paradigm of machine learning.

**Prerequisites**: Basic probability, familiarity with supervised and unsupervised learning concepts.

## What Is Reinforcement Learning?

Imagine teaching a dog a new trick. You don't show the dog a labeled dataset of "correct sit positions" (supervised learning), and you don't ask the dog to find hidden clusters in its behavior (unsupervised learning). Instead, you let the dog try things, and when it does something right, you give it a treat. Over time, the dog learns which actions lead to treats. That is reinforcement learning (RL).

Reinforcement learning is the computational framework for learning from interaction. An **agent** takes **actions** in an **environment**, observes the resulting **state** and **reward**, and gradually discovers a strategy -- called a **policy** -- that maximizes the total reward accumulated over time.

Unlike supervised learning, the agent receives no explicit "correct answer" for each situation. Unlike unsupervised learning, there is a clear evaluative signal: reward. RL occupies a distinct third paradigm where the learner must actively experiment with its environment to discover what works.

## How It Works

### The Agent-Environment Loop

The interaction follows a discrete-time loop. At each timestep $t$:

1. The agent observes state $S_t$
2. The agent selects action $A_t$ according to its policy $\pi$
3. The environment transitions to state $S_{t+1}$ and emits reward $R_{t+1}$
4. The agent updates its knowledge

This cycle generates a **trajectory**: $S_0, A_0, R_1, S_1, A_1, R_2, S_2, \ldots$

<!-- Recommended visual: Agent-environment interaction loop diagram
     Source: Sutton & Barto (2018), Figure 3.1 -->

### The Three Paradigms Compared

| Property | Supervised | Unsupervised | Reinforcement |
|---|---|---|---|
| Feedback type | Correct labels | None | Evaluative reward |
| Data | i.i.d. dataset | i.i.d. dataset | Sequential, correlated |
| Goal | Predict labels | Find structure | Maximize cumulative reward |
| Agent influence | None | None | Actions affect future data |

### Key Characteristics

**Sequential decision-making.** Actions have consequences that unfold over time. A move in chess does not just affect the current board -- it shapes every future position.

**Delayed rewards.** The reward for a good decision may not arrive until many steps later. A financial investment made today may only pay off in years.

**Exploration vs. exploitation.** The agent must balance trying new actions (exploration) with choosing actions it already knows are good (exploitation). See `exploration-vs-exploitation.md` for a deep treatment.

**Non-stationarity from the agent's perspective.** As the agent's policy improves, the distribution of states it visits changes, making the learning problem inherently non-stationary.

### The Objective

The agent aims to find a policy $\pi^*$ that maximizes the **expected return** -- the cumulative discounted reward:

$$\pi^* = \arg\max_\pi \mathbb{E}_\pi \left[ \sum_{t=0}^{\infty} \gamma^t R_{t+1} \right]$$

where $\gamma \in [0, 1)$ is the discount factor (see `return-and-discount-factor.md`).

### A Brief History

- **1950s**: Richard Bellman develops dynamic programming and the Bellman equation.
- **1972**: Klopf's "hedonistic neuron" hypothesis links RL to neuroscience.
- **1988**: Sutton introduces temporal-difference learning (TD(0)).
- **1989**: Watkins proposes Q-learning, the first off-policy TD control algorithm.
- **1992**: Tesauro's TD-Gammon masters backgammon using TD learning with neural networks.
- **2013**: Mnih et al. introduce Deep Q-Networks (DQN), playing Atari from raw pixels.
- **2016**: Silver et al.'s AlphaGo defeats world champion Lee Sedol using RL + Monte Carlo tree search.
- **2017**: Schulman et al. propose Proximal Policy Optimization (PPO), a workhorse of modern RL.
- **2023-present**: RL from Human Feedback (RLHF) becomes central to aligning large language models.

## Why It Matters

RL provides the theoretical and algorithmic foundation for building autonomous agents that improve through experience. Its applications span robotics (manipulation, locomotion), game playing (Go, StarCraft, Dota 2), recommendation systems, resource allocation, chip design, and the fine-tuning of large language models. Any problem involving sequential decisions under uncertainty is a candidate for RL.

## Key Technical Details

- The formal framework underlying RL is the **Markov Decision Process** (see `markov-decision-processes.md`).
- RL algorithms broadly divide into **model-free** (learn directly from experience) and **model-based** (learn a model of the environment, then plan).
- Model-free methods further split into **value-based** (e.g., Q-learning), **policy-based** (e.g., REINFORCE), and **actor-critic** (hybrid).
- The sample complexity of RL is typically orders of magnitude higher than supervised learning: DQN on Atari requires ~50 million frames (~38 days of real-time play).
- Convergence guarantees require assumptions like sufficient exploration and appropriate function approximation.

## Common Misconceptions

**"RL is just trial and error."** Trial and error is a component, but RL also involves systematic credit assignment -- determining which past actions were responsible for current rewards -- via mechanisms like temporal-difference learning and eligibility traces.

**"RL always needs a simulator."** While simulators dramatically accelerate training, real-world RL (e.g., robotic manipulation, clinical trials) is an active research area. Offline RL learns from pre-collected datasets without any environment interaction.

**"RL replaces supervised learning."** RL and supervised learning solve different problems. In practice, RL systems rely heavily on supervised learning components (e.g., learning state representations, pre-training networks).

**"Reward design is trivial."** Reward shaping is one of the hardest practical challenges in RL. Poorly designed rewards lead to reward hacking, where the agent finds unintended shortcuts.

## Connections to Other Concepts

- `markov-decision-processes.md` -- The formal mathematical framework for RL problems.
- `states-actions-rewards.md` -- Detailed treatment of the three primitives in the agent-environment loop.
- `policies.md` -- The decision rule the agent learns.
- `value-functions.md` -- How the agent evaluates states and actions.
- `exploration-vs-exploitation.md` -- The fundamental dilemma of learning from interaction.

## Further Reading

- **Sutton & Barto (2018)** -- *Reinforcement Learning: An Introduction* (2nd edition). The definitive textbook covering the full breadth of RL theory and algorithms.
- **Mnih et al. (2015)** -- "Human-level control through deep reinforcement learning." *Nature*, 518. The DQN paper that launched the deep RL era.
- **Silver et al. (2016)** -- "Mastering the game of Go with deep neural networks and tree search." *Nature*, 529. AlphaGo's landmark achievement.
- **Kaelbling, Littman & Moore (1996)** -- "Reinforcement Learning: A Survey." *JAIR*, 4. A classic survey of foundational RL methods.
- **Ouyang et al. (2022)** -- "Training language models to follow instructions with human feedback." Introduced RLHF for instruction-tuned LLMs (InstructGPT).
