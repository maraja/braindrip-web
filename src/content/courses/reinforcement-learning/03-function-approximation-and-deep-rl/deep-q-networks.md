# Deep Q-Networks

**One-Line Summary**: Neural network Q-function with experience replay and target networks -- the breakthrough that launched deep RL.

**Prerequisites**: `q-learning.md`, `function-approximation.md`, `bellman-equations.md`, `exploration-vs-exploitation.md`

## What Is a Deep Q-Network?

Imagine trying to learn chess by playing random games and keeping a notebook with one entry per board position. You would need more notebooks than atoms in the observable universe. Instead, you develop *intuition* -- pattern recognition that lets you evaluate novel positions you have never seen before. Deep Q-Networks (DQN) give a Q-learning agent this same power by replacing the Q-table with a deep neural network that maps raw sensory input (like game pixels) directly to action values.

DQN, introduced by Mnih et al. at DeepMind, was the first algorithm to successfully combine deep neural networks with reinforcement learning at scale. The 2015 Nature paper demonstrated a single architecture and set of hyperparameters that achieved human-level performance across 49 Atari 2600 games, learning directly from raw 210x160 pixel frames -- a feat previously considered far beyond reach.

## How It Works

### Architecture

DQN takes a stack of the last 4 grayscale game frames (84x84 pixels each) as input and outputs a Q-value for each possible action. The architecture for Atari is:

1. **Input**: $4 \times 84 \times 84$ preprocessed grayscale frames
2. **Conv Layer 1**: 32 filters, $8 \times 8$ kernel, stride 4, ReLU
3. **Conv Layer 2**: 64 filters, $4 \times 4$ kernel, stride 2, ReLU
4. **Conv Layer 3**: 64 filters, $3 \times 3$ kernel, stride 1, ReLU
5. **Fully Connected**: 512 units, ReLU
6. **Output**: One Q-value per action (typically 4--18 actions for Atari)

> **Recommended visual**: DQN architecture diagram showing frames input through convolutional layers to Q-value outputs. See Figure 1 in Mnih et al. (2015), *Nature* 518, pp. 529--533.

### The Loss Function

DQN minimizes the mean squared Bellman error. For a transition $(s, a, r, s')$ sampled from the replay buffer, the loss is:

$$L(\mathbf{w}) = \mathbb{E}\left[\left( r + \gamma \max_{a'} Q(s', a'; \mathbf{w}^-) - Q(s, a; \mathbf{w}) \right)^2\right]$$

where $\mathbf{w}$ are the online network weights and $\mathbf{w}^-$ are the target network weights (a periodically frozen copy). The gradient with respect to $\mathbf{w}$ is:

$$\nabla_\mathbf{w} L = -\mathbb{E}\left[\left( r + \gamma \max_{a'} Q(s', a'; \mathbf{w}^-) - Q(s, a; \mathbf{w}) \right) \nabla_\mathbf{w} Q(s, a; \mathbf{w})\right]$$

Note that the gradient does *not* flow through the target network term $Q(s', a'; \mathbf{w}^-)$ -- this is critical for stability.

### Two Key Innovations

DQN overcame the deadly triad (see `function-approximation.md`) with two stabilization mechanisms:

**1. Experience Replay** (detailed in `experience-replay.md`): Transitions $(s_t, a_t, r_t, s_{t+1})$ are stored in a circular buffer of size $N = 1{,}000{,}000$. Training samples minibatches of 32 transitions uniformly at random. This breaks temporal correlations and allows each transition to be reused multiple times.

**2. Target Network** (detailed in `target-networks.md`): A separate copy $Q(s, a; \mathbf{w}^-)$ provides the regression target. This copy is updated by cloning $\mathbf{w}$ every $C = 10{,}000$ steps, preventing the destabilizing feedback loop where the network chases its own shifting predictions.

### Training Procedure

1. Initialize replay buffer $\mathcal{D}$ with capacity $N$; initialize $Q$ with random weights $\mathbf{w}$; set $\mathbf{w}^- = \mathbf{w}$.
2. For each episode, observe initial state $s_1$ (stack of 4 frames).
3. Select action $a_t$ using $\epsilon$-greedy: random action with probability $\epsilon$, otherwise $a_t = \arg\max_a Q(s_t, a; \mathbf{w})$.
4. Execute $a_t$, observe $r_t$ and $s_{t+1}$. Store $(s_t, a_t, r_t, s_{t+1})$ in $\mathcal{D}$.
5. Sample random minibatch of 32 transitions from $\mathcal{D}$.
6. Compute targets: $y_j = r_j + \gamma \max_{a'} Q(s_j', a'; \mathbf{w}^-)$ (or $y_j = r_j$ if terminal).
7. Perform gradient descent step on $(y_j - Q(s_j, a_j; \mathbf{w}))^2$.
8. Every $C$ steps, set $\mathbf{w}^- \leftarrow \mathbf{w}$.
9. Anneal $\epsilon$ from 1.0 to 0.1 over the first 1M frames.

## Why It Matters

DQN was a watershed moment in AI. Before 2013, combining neural networks with RL was considered unstable and impractical. DQN proved that a single agent, with a single architecture, could learn to play dozens of visually distinct games at human level or above -- directly from pixels, with no game-specific engineering. This result catalyzed the entire field of deep reinforcement learning and directly led to AlphaGo, robotic manipulation, and eventually RLHF for language models.

## Key Technical Details

- **Training time**: 50 million frames per game (~38 days of game time at 60 FPS), approximately 10 days on a single GPU (circa 2015).
- **Reward clipping**: All rewards clipped to $[-1, +1]$ to standardize across games.
- **Frame skipping**: The agent selects an action every 4 frames (action repeat), with the last action repeated in between.
- **Optimizer**: RMSProp with learning rate $0.00025$, no momentum, $\epsilon_{RMS} = 0.01$.
- **Discount factor**: $\gamma = 0.99$.
- **Replay buffer memory**: 1M transitions $\approx$ 7 GB for Atari-sized frames (with frame deduplication optimization).
- **Superhuman on 29 of 49 games**, but notably struggled on Montezuma's Revenge (sparse rewards, deep exploration) and games requiring long-term planning.

## Common Misconceptions

- **"DQN learns to play games like humans do."** DQN exploits pixel-level patterns and has no concept of game semantics. It may find strategies humans would never use -- and fail at tasks trivial for humans (like navigating a maze in Montezuma's Revenge).

- **"The convolutional architecture is what made DQN work."** The CNN architecture is important for processing pixels, but the algorithmic innovations -- experience replay and target networks -- are what made training stable. Without them, even perfect architectures diverge.

- **"DQN is sample efficient."** DQN requires roughly 200 million frames (about 925 hours of gameplay) across training. Humans typically achieve comparable performance in minutes. DQN's strength is final performance, not sample efficiency.

## Connections to Other Concepts

- `q-learning.md`: (`q-learning.md`) is the tabular foundation; DQN is Q-learning with neural function approximation.
- `experience-replay.md`: (`experience-replay.md`) and **target networks** (`target-networks.md`) are DQN's two core stabilization innovations.
- `double-dqn.md`: (`double-dqn.md`), **Dueling DQN** (`dueling-dqn.md`), and **Rainbow** (`rainbow-dqn.md`) are direct improvements built on the DQN framework.
- The **deadly triad** (`function-approximation.md`) explains *why* DQN's innovations were necessary.
- `benchmarks.md`: (`atari-and-arcade-games.md`) provide the canonical evaluation environment for DQN and its successors.

## Further Reading

1. **"Playing Atari with Deep Reinforcement Learning" (Mnih et al., 2013)** -- The original NIPS workshop paper introducing DQN with experience replay.
2. **"Human-level control through deep reinforcement learning" (Mnih et al., 2015)** -- The landmark Nature paper adding target networks and demonstrating performance across 49 games. One of the most cited papers in modern AI.
3. **"Deep Reinforcement Learning with Double Q-learning" (van Hasselt, Guez & Silver, 2016)** -- The immediate follow-up addressing DQN's overestimation bias (see `double-dqn.md`).
4. **"Massively Parallel Methods for Deep Reinforcement Learning" (Nair et al., 2015)** -- Gorila: distributed DQN training across many machines, demonstrating scalability.
