# Hierarchical Reinforcement Learning

**One-Line Summary**: Hierarchical RL decomposes complex, long-horizon tasks into layered subtask hierarchies, enabling agents to reason at multiple timescales through temporal abstraction.

**Prerequisites**: Markov decision processes, policy gradient methods, value functions, goal-conditioned policies

## What Is Hierarchical Reinforcement Learning?

Consider how you plan a cross-country road trip. You do not decide each individual steering adjustment from the start. Instead, you first plan a route through major cities, then navigate between cities by choosing highways, and finally handle the low-level driving -- lane changes, speed control, turns. Each level of this hierarchy operates at a different timescale and abstraction level. You do not rethink your destination city at every traffic light.

Hierarchical reinforcement learning (HRL) brings this same structure to RL agents. Instead of choosing primitive actions at every timestep, the agent operates through a hierarchy where high-level policies select goals or subtasks, and low-level policies execute the primitive actions needed to achieve them. This **temporal abstraction** -- the ability to commit to extended courses of action -- is the key idea that makes HRL powerful.

## How It Works

### The Options Framework

The most influential formalization of HRL is the **options framework** (Sutton, Precup, and Singh, 1999). An option $\omega$ is a triple $(I_\omega, \pi_\omega, \beta_\omega)$ where:

- $I_\omega \subseteq S$ is the **initiation set** (states where the option can start)
- $\pi_\omega(a \mid s)$ is the **intra-option policy** (how the option behaves)
- $\beta_\omega(s) \in [0, 1]$ is the **termination condition** (probability of stopping in state $s$)

A policy over options $\mu(\omega \mid s)$ selects which option to execute, and the chosen option runs until it terminates according to $\beta_\omega$. The resulting process is a **semi-Markov decision process (SMDP)** because actions (options) take variable numbers of steps.

The option-value function satisfies a generalized Bellman equation:

$$Q_\mu(s, \omega) = \sum_a \pi_\omega(a \mid s) \left[ R(s, a) + \gamma \sum_{s'} T(s' \mid s, a) \, U_\mu(s', \omega) \right]$$

where the continuation value $U_\mu$ accounts for whether the option terminates:

$$U_\mu(s', \omega) = (1 - \beta_\omega(s')) \, Q_\mu(s', \omega) + \beta_\omega(s') \sum_{\omega'} \mu(\omega' \mid s') \, Q_\mu(s', \omega')$$

### Feudal Networks and Feudal Hierarchies

Feudal RL (Dayan and Hinton, 1993; Vezhnevets et al., 2017) structures agents as a manager-worker hierarchy. The **manager** operates at a coarser timescale, producing a goal or direction vector $g_t$ every $k$ steps. The **worker** executes primitive actions conditioned on the current goal:

$$g_t = f_{\text{manager}}(s_t), \quad a_t = \pi_{\text{worker}}(s_t, g_t)$$

In FeUdal Networks (FuN), the manager produces goal vectors in a learned latent space, and the worker is rewarded for moving in the direction of the goal via an intrinsic reward:

$$r_t^{\text{intrinsic}} = \frac{1}{k} \cos\left(s_{t+k} - s_t, \; g_t\right)$$

This directional reward allows the manager to guide the worker without specifying exact states to reach.

### Goal-Conditioned RL and HIRO

Goal-conditioned RL trains a universal policy $\pi(a \mid s, g)$ that can achieve arbitrary goals $g$ from the goal space $\mathcal{G}$. The reward function is typically sparse:

$$R(s, a, g) = -\mathbf{1}[\|s' - g\| > \epsilon]$$

or shaped using the negative distance $R = -\|s' - g\|$.

**HIRO** (Nachum et al., 2018) combines goal-conditioned policies with a two-level hierarchy. The high-level policy proposes subgoals in the state space every $k$ steps, and the low-level policy is trained to reach those subgoals:

$$g_t^{\text{high}} = \pi_{\text{high}}(s_t), \quad a_t = \pi_{\text{low}}(s_t, g_t^{\text{high}})$$

HIRO introduces **off-policy correction** for the high-level policy: since the low-level policy changes during training, past high-level transitions become stale. HIRO relabels stored subgoals with the subgoal that maximizes the likelihood of the observed low-level behavior.

### Hierarchy of Abstract Machines (HAM)

HAMs (Parr and Russell, 1998) constrain the agent's policy space using partial programs -- finite-state machines with states that can call lower-level machines, choose actions, or branch stochastically. The partial program specifies the hierarchical structure, and RL fills in the unspecified choice points. The constrained policy space reduces the search problem but requires domain knowledge to design the machine structure.

### Subgoal Discovery

A central open problem in HRL is **automatic subgoal discovery** -- finding the right abstractions without human specification. Approaches include:

- **Bottleneck states**: identifying states that lie on many optimal trajectories (graph-theoretic methods on state transition graphs)
- **Skill chaining**: learning options that initiate where the previous option terminates
- **Variational option discovery**: using mutual information objectives to discover diverse, distinguishable skills (e.g., DIAYN)

## Why It Matters

Flat RL struggles with tasks requiring hundreds or thousands of coordinated steps. Navigation in large environments, multi-step manipulation, and long-horizon planning all benefit enormously from hierarchical decomposition. HRL also enables **transfer**: low-level skills learned in one task can be reused in another, and high-level strategies can be adapted without relearning motor primitives.

## Key Technical Details

- The options framework reduces to standard MDPs when all options are single-step (primitive actions)
- Temporal abstraction provides exponential reduction in planning horizon: a $T$-step problem with $k$-step options becomes a $T/k$-step abstract problem
- HIRO uses a high-level action repeat of $k = 10$ steps in MuJoCo locomotion tasks
- **Option-critic** (Bacon et al., 2017) learns options end-to-end by differentiating through termination conditions using the policy gradient theorem
- The **degenerate option problem**: without explicit regularization, learned options often collapse to single-step primitives, eliminating the benefits of temporal abstraction
- Goal-conditioned policies are commonly trained with **hindsight experience replay** (HER), relabeling failed trajectories with achieved states as goals

## Common Misconceptions

- **"HRL always outperforms flat RL"**: On short-horizon, dense-reward tasks, flat RL often matches or beats hierarchical methods. HRL's advantages emerge primarily with long horizons and sparse rewards.
- **"The hierarchy must be designed by hand"**: While early work (HAMs, MAXQ) required manual hierarchy design, modern methods like option-critic and DIAYN learn hierarchies automatically. However, learned hierarchies often remain inferior to well-designed manual ones.
- **"More levels are always better"**: Deeper hierarchies introduce more non-stationarity between levels and are harder to train. Two-level hierarchies dominate practical applications.

## Connections to Other Concepts

- Goal-conditioned RL interfaces directly with `reward-shaping.md` through subgoal reward design
- Temporal abstraction changes the exploration problem addressed in `curiosity-driven-exploration.md`
- Skill reuse across tasks connects to `meta-reinforcement-learning.md`
- Subgoal discovery from demonstrations links to `imitation-learning.md` and `inverse-reinforcement-learning.md`

## Further Reading

- **Sutton, Precup, and Singh, "Between MDPs and Semi-MDPs: A Framework for Temporal Abstraction in Reinforcement Learning" (1999)**: The foundational options framework paper, introducing initiation sets, intra-option policies, and termination conditions.
- **Nachum et al., "Data-Efficient Hierarchical Reinforcement Learning" (HIRO, 2018)**: Goal-conditioned hierarchical RL with off-policy correction for continuous control.
- **Bacon, Harb, and Precup, "The Option-Critic Architecture" (2017)**: End-to-end learning of options using policy gradient over termination functions.
- **Vezhnevets et al., "FeUdal Networks for Hierarchical Reinforcement Learning" (2017)**: Modern feudal architecture with directional subgoals in learned latent spaces.
- **Eysenbach et al., "Diversity Is All You Need (DIAYN)" (2019)**: Unsupervised skill discovery through mutual information maximization.
