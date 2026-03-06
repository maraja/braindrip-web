# A2C and A3C

**One-Line Summary**: Parallel actor-critic training through multiple environment workers -- A3C uses asynchronous gradient updates for decorrelation, while A2C's synchronous batching often matches performance and better utilizes GPUs.

**Prerequisites**: Actor-Critic Methods (`actor-critic-methods.md`), advantage estimation (`advantage-estimation.md`), policy gradient theorem (`policy-gradient-theorem.md`), parallel computing concepts, stochastic gradient descent.

## What Is A2C/A3C?

Imagine training a team of scouts, each exploring a different part of an unknown territory simultaneously. Rather than sending a single scout on one long expedition, you send 16 scouts in 16 different directions. They each report back what they learned. Because they explored independently, their reports contain diverse, uncorrelated information -- far richer than what any single scout could provide.

**A3C** (Asynchronous Advantage Actor-Critic) launches multiple workers, each running its own copy of the environment and computing gradients independently. Workers asynchronously push their gradient updates to a shared parameter server, then pull the latest parameters back. **A2C** (Advantage Actor-Critic, synchronous) collects experiences from all workers in parallel, synchronizes them into a single batch, computes one combined gradient, and applies a single update. A2C emerged from the practical observation that the asynchronous nature of A3C was not the key ingredient -- parallel data collection was.

## How It Works

### A3C Architecture

Each of $N$ workers (typically 16-32) runs the following loop independently:

1. Sync local parameters $\theta' \leftarrow \theta$ from the global network.
2. Collect $n$-step trajectory $(s_t, a_t, r_t, \ldots, s_{t+n})$ using $\pi_{\theta'}$.
3. Compute n-step returns and advantages:
   $$\hat{A}_t = \sum_{k=0}^{n-1} \gamma^k r_{t+k} + \gamma^n V_{\phi'}(s_{t+n}) - V_{\phi'}(s_t)$$
4. Compute gradients of the combined loss:
   $$L = L_\text{policy} + c_1 L_\text{value} - c_2 H[\pi_\theta]$$
   where $L_\text{policy} = -\sum_t \log \pi_\theta(a_t|s_t) \hat{A}_t$, $L_\text{value} = \sum_t (V_\phi(s_t) - G_t^{(n)})^2$, and $H$ is the entropy bonus.
5. Apply gradients to global parameters asynchronously (no locking).
6. Go to step 1.

### Why Parallelism Helps: Decorrelation

The fundamental benefit is **data decorrelation**. A single agent's trajectory is temporally correlated: state $s_{t+1}$ depends on state $s_t$. This correlation violates the i.i.d. assumption of SGD and can cause learning to diverge. DQN solved this with a replay buffer. A3C solves it differently: because workers explore different parts of the state space simultaneously, the combined gradient is computed from diverse, weakly correlated experiences. This stabilizes training without requiring any replay buffer, which is essential for on-policy methods that cannot reuse old data.

### A2C: The Synchronous Alternative

A2C simplifies A3C by synchronizing all workers:

1. All $N$ workers collect $n$-step trajectories in parallel.
2. Wait for all workers to finish (synchronization barrier).
3. Stack all experiences into a single batch.
4. Compute one gradient update from the combined batch.
5. Broadcast updated parameters to all workers.

This is simpler to implement, deterministic (for debugging), and better suited to GPU acceleration since the large synchronized batch can be processed as a single forward/backward pass on the GPU.

### Loss Function Components

The total loss combines three terms with balancing coefficients:

$$L = -\frac{1}{N \cdot n} \sum_{i,t} \log \pi_\theta(a_t^{(i)}|s_t^{(i)}) \hat{A}_t^{(i)} + c_1 \frac{1}{N \cdot n} \sum_{i,t} \left(V_\phi(s_t^{(i)}) - G_t^{(i)}\right)^2 - c_2 \frac{1}{N \cdot n} \sum_{i,t} H[\pi_\theta(\cdot|s_t^{(i)})]$$

Standard coefficients from Mnih et al. (2016): $c_1 = 0.5$, $c_2 = 0.01$.

### GPU vs. CPU Trade-offs

A3C was originally designed for CPU execution -- each worker runs on its own CPU thread with a lightweight copy of the environment. Asynchronous updates are CPU-friendly because workers never wait. A2C better exploits GPUs: the synchronized batch creates a large tensor that can be processed efficiently on GPU hardware. In practice with modern GPU infrastructure, A2C with a single GPU often outperforms A3C with many CPU cores in wall-clock time.

## Why It Matters

A3C was a landmark result (Mnih et al., 2016) demonstrating that deep RL could be scaled through parallelism rather than replay buffers. It trained agents to play Atari games and navigate 3D environments using only a multi-core CPU, matching or exceeding DQN's performance. A2C then showed that the asynchronous aspect was not essential, simplifying the algorithm while retaining the benefits. The A2C architecture became the default baseline for policy gradient research and a direct precursor to PPO.

## Key Technical Details

- **Number of workers**: 16-32 is standard. More workers provide better decorrelation but with diminishing returns and increased communication overhead.
- **N-step returns**: $n = 5$ is the canonical choice from the original A3C paper. Larger $n$ reduces bias but increases variance.
- **Shared vs. separate networks**: The original A3C paper uses a shared convolutional network with separate policy and value heads. This is computationally efficient but can cause gradient interference.
- **Optimizer**: A3C originally used RMSProp with shared running statistics across workers. A2C commonly uses Adam with a learning rate of $2.5 \times 10^{-4}$ to $7 \times 10^{-4}$.
- **No replay buffer**: Both A2C and A3C are on-policy. Data is used once and discarded. This is both a feature (no stale data) and a limitation (sample inefficiency).
- **Entropy coefficient** $c_2 = 0.01$ is standard. Without entropy regularization, policies can collapse to deterministic behavior early in training, especially with many parallel workers that may all converge to the same suboptimal strategy.
- A3C can suffer from **stale gradients**: a worker may compute gradients based on outdated parameters if other workers have updated the global network in the meantime.

## Common Misconceptions

- **"A3C is better than A2C because it is asynchronous."** Empirical evidence (OpenAI baselines, DeepMind experiments) shows A2C matches or exceeds A3C performance on most benchmarks. The asynchronous updates in A3C introduce gradient staleness that can hurt performance.
- **"Parallelism replaces experience replay."** They solve the same problem (data decorrelation) differently. Parallelism does not provide the sample reuse that replay buffers offer. A2C/A3C are therefore less sample-efficient than methods like SAC that combine off-policy learning with replay.
- **"A2C/A3C are state-of-the-art."** They are foundational but have been largely superseded by PPO, which adds clipped surrogate objectives for more stable updates. A2C remains an important baseline and educational algorithm.
- **"More workers always means faster training."** Communication overhead, synchronization costs, and GPU memory limits create practical ceilings. Beyond 32-64 workers, scaling gains typically plateau.

## Connections to Other Concepts

- `actor-critic-methods.md` -- A2C/A3C are specific instantiations of the actor-critic paradigm with parallel data collection.
- `advantage-estimation.md` -- A2C/A3C use n-step advantage estimates. GAE can be substituted for improved bias-variance control.
- `proximal-policy-optimization.md` -- PPO builds on the A2C framework, adding a clipped surrogate objective for more stable updates.
- `entropy-regularization.md` -- The entropy bonus is a critical component of the A2C/A3C loss function that prevents premature convergence.
- `policy-gradient-theorem.md` -- The theoretical foundation underlying the policy gradient component of the loss.

## Further Reading

- **Mnih et al. (2016), "Asynchronous Methods for Deep Reinforcement Learning"** -- The original A3C paper. Demonstrates asynchronous training on Atari and continuous control, showing that parallel CPU workers can match GPU-trained DQN. Introduces the A3C architecture with shared convolutional networks.
- **OpenAI Baselines (2017), A2C implementation** -- The practical demonstration that synchronous A2C matches A3C. Became a widely used reference implementation for policy gradient research.
- **Stooke & Abbeel (2018), "Accelerated Methods for Deep Reinforcement Learning"** -- Analyzes GPU-accelerated A2C and demonstrates that large-batch synchronous training with proper learning rate scaling can achieve near-linear speedups, making A2C substantially faster than A3C in practice.
- **Espeholt et al. (2018), "IMPALA: Scalable Distributed Deep-RL with Importance Weighted Actor-Learner Architectures"** -- Extends the parallel actor-critic idea to massive scale (hundreds of workers) with off-policy corrections via V-trace.
