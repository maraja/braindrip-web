# Experience Replay

**One-Line Summary**: Storing and randomly sampling past transitions to break temporal correlations and improve sample efficiency.

**Prerequisites**: `temporal-difference-learning.md`, `q-learning.md`, `function-approximation.md`

## What Is Experience Replay?

Imagine studying for an exam by reading your textbook once, cover to cover, and never looking back. You would remember the last chapter vividly but forget the first. Now imagine keeping flashcards of key concepts and reviewing them in random order -- you would learn far more effectively. Experience replay is the flashcard system for RL agents. Instead of learning from each experience once and discarding it, the agent stores transitions in a memory buffer and samples them randomly for training, breaking the temporal order and reusing valuable data.

The idea was first proposed by Lin (1992) and became a cornerstone of modern deep RL when it was adopted as a key component of DQN (Mnih et al., 2013). Without experience replay, training a neural network Q-function on sequential, correlated data is unstable and sample-wasteful.

## How It Works

### The Replay Buffer

A replay buffer (or replay memory) $\mathcal{D}$ is a fixed-size circular buffer that stores transitions:

$$\mathcal{D} = \{(s_t, a_t, r_t, s_{t+1}, d_t)\}_{t=1}^{N}$$

where $d_t$ is a boolean terminal flag. When the buffer is full, the oldest transitions are overwritten. At each training step, a minibatch of $B$ transitions is sampled uniformly at random:

$$\{(s_j, a_j, r_j, s_j', d_j)\}_{j=1}^{B} \sim \text{Uniform}(\mathcal{D})$$

These samples are used to compute the loss and update the network weights via standard SGD or its variants.

### Why Random Sampling Helps

Neural network training assumes that minibatch samples are approximately i.i.d. (independent and identically distributed). Sequential RL experience violates this in two ways:

1. **Temporal correlation**: Consecutive states $s_t, s_{t+1}, s_{t+2}, \ldots$ are highly correlated. Training on correlated batches causes the network to overfit to recent experience and oscillate.
2. **Non-stationarity**: The data distribution shifts as the agent's policy changes. Early experiences come from a nearly random policy; later experiences come from a more informed one.

Random sampling from a large buffer approximately decorrelates the training data, producing minibatches that resemble i.i.d. samples drawn from a mixture of past policies. This dramatically stabilizes gradient descent on the Q-network loss.

### Prioritized Experience Replay (PER)

Not all transitions are equally informative. Schaul et al. (2016) proposed sampling transitions with probability proportional to their TD error magnitude:

$$P(i) = \frac{p_i^\alpha}{\sum_k p_k^\alpha}$$

where $p_i = |\delta_i| + \epsilon$ is the priority of transition $i$, $\delta_i$ is the TD error, $\epsilon$ is a small constant preventing zero probability, and $\alpha \in [0, 1]$ controls how much prioritization is used ($\alpha = 0$ is uniform, $\alpha = 1$ is full prioritization).

Because prioritized sampling introduces bias (the expected gradient no longer matches uniform sampling), PER corrects with importance-sampling weights:

$$w_i = \left( \frac{1}{N} \cdot \frac{1}{P(i)} \right)^\beta$$

where $\beta$ is annealed from an initial value (typically $\beta_0 = 0.4$) to 1.0 over the course of training. These weights are applied to the loss:

$$L = \frac{1}{B} \sum_{j=1}^{B} w_j \left( y_j - Q(s_j, a_j; \mathbf{w}) \right)^2$$

> **Recommended visual**: Diagram comparing uniform replay sampling vs. prioritized replay with a sum-tree data structure. See Figure 1 in Schaul et al. (2016).

### Efficient Implementation: The Sum Tree

Naive prioritized sampling from $N$ transitions requires $O(N)$ time. PER uses a **sum tree** (a binary tree where each leaf stores a priority and each parent stores the sum of its children) to achieve $O(\log N)$ sampling and $O(\log N)$ priority updates. For a buffer of $N = 1{,}000{,}000$ transitions, this means ~20 operations per sample instead of 1{,}000{,}000.

## Why It Matters

Experience replay provides two critical benefits that make deep RL practical:

1. **Sample efficiency**: Each transition is used in many gradient updates rather than just one. DQN reuses each transition approximately 8 times on average over training.
2. **Training stability**: By breaking temporal correlations, replay prevents the catastrophic feedback loops where the network overfits to its current trajectory and forgets everything else.

Without experience replay, DQN fails to learn on most Atari games. It is arguably the more important of DQN's two innovations (alongside target networks) -- ablation studies in the original paper show that removing replay causes larger performance drops than removing target networks.

## Key Technical Details

- **Buffer size**: DQN uses $N = 1{,}000{,}000$ transitions. Larger buffers retain more diverse data but consume more memory and may retain very stale transitions.
- **Minibatch size**: Typically $B = 32$ for DQN. Larger batches (64--256) can improve stability but increase computation per update.
- **Memory cost**: Storing 1M Atari transitions naively requires ~7 GB (84x84 uint8 frames). Optimization: store frames once and reconstruct stacks by index, reducing memory to ~1.5 GB.
- **PER hyperparameters**: $\alpha = 0.6$, $\beta_0 = 0.4$ (annealed to 1.0), $\epsilon = 10^{-6}$ are standard values from the PER paper.
- **Replay ratio**: The number of gradient updates per environment step. DQN uses a replay ratio of 1 (one gradient step per 4 environment frames). Higher replay ratios improve sample efficiency but risk overfitting to the buffer.
- **Warm-up**: DQN fills the buffer with 50,000 random transitions before training begins, ensuring initial batches have sufficient diversity.

## Common Misconceptions

- **"Bigger buffers are always better."** Excessively large buffers retain transitions from very old (and poor) policies. For rapidly improving agents, these stale transitions can slow learning. Some algorithms (like SAC) perform well with smaller buffers of 100K--1M transitions.

- **"Experience replay makes RL on-policy."** Replay explicitly makes learning *off-policy*: the agent trains on data generated by past versions of its policy. This is why experience replay is part of the deadly triad (`function-approximation.md`) and requires care.

- **"PER is strictly better than uniform replay."** PER adds computational overhead (sum tree, importance-sampling weights) and introduces new hyperparameters. On some tasks, uniform replay with a well-tuned buffer size matches or exceeds PER. The overhead is most justified when transitions have highly variable informativeness.

## Connections to Other Concepts

- **DQN** (`deep-q-networks.md`) introduced replay as one of its two core innovations for stable deep RL.
- **Target networks** (`target-networks.md`) are the complementary stabilization technique used alongside replay.
- **Off-policy learning** is enabled by replay; the relationship to `q-learning.md` (inherently off-policy) is fundamental.
- **Rainbow DQN** (`rainbow-dqn.md`) uses prioritized experience replay as one of its six combined improvements.
- **Offline RL** (`offline-reinforcement-learning.md`) can be viewed as the extreme case: learning entirely from a fixed replay buffer with no new data collection.
- The deadly triad (`function-approximation.md`) explains why replay (off-policy data) combined with function approximation and bootstrapping requires stabilization.

## Further Reading

1. **"Self-Improving Reactive Agents Based on Reinforcement Learning, Planning, and Teaching" (Lin, 1992)** -- The original proposal of experience replay for RL, decades ahead of its time.
2. **"Prioritized Experience Replay" (Schaul et al., 2016)** -- Introduces priority-based sampling with importance-sampling correction, yielding significant performance gains over uniform replay.
3. **"A Deeper Look at Experience Replay" (Zhang & Sutton, 2017)** -- Systematic analysis of replay buffer design choices: size, age of data, and the combined effect on learning.
4. **"Revisiting Fundamentals of Experience Replay" (Fedus et al., 2020)** -- Investigates the replay ratio and finds that increasing replay (more gradient steps per environment step) is a simple way to improve sample efficiency across many algorithms.
