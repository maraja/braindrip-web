# Model-Based vs. Model-Free RL

**One-Line Summary**: The fundamental architectural choice in reinforcement learning -- learn a model of how the world works and plan with it, or learn what to do directly from raw experience.

**Prerequisites**: `../01-foundations/what-is-reinforcement-learning.md`, `../01-foundations/markov-decision-processes.md`, `../01-foundations/value-functions.md`

## What Is the Model-Based vs. Model-Free Distinction?

Imagine two people learning to cook. The first person reads the recipe, understands the chemistry of how heat transforms proteins, how salt affects osmotic pressure, and mentally simulates what will happen before touching a pan. The second person just starts cooking repeatedly, learning from taste tests alone -- no theory, no mental simulation, pure trial and error. The first is model-based: they build an internal representation of how cooking works. The second is model-free: they map situations directly to actions through experience.

In reinforcement learning, a **model-free** agent learns a policy $\pi(a|s)$ or value function $Q(s,a)$ directly from interactions with the environment. It never explicitly learns *how* the environment works. A **model-based** agent learns an environment model -- the transition dynamics $\hat{T}(s'|s,a)$ and reward function $\hat{R}(s,a)$ -- and uses this model to plan, simulate, or otherwise reason about consequences before acting.

This distinction is arguably the most consequential architectural decision in RL system design, affecting sample efficiency, computational cost, and the types of problems an agent can solve.

## How It Works

### Model-Free Methods

Model-free algorithms optimize behavior without learning environment dynamics.

**Value-based methods** learn $Q^*(s,a)$ and derive a policy from it:

$$Q(s,a) \leftarrow Q(s,a) + \alpha \left[ r + \gamma \max_{a'} Q(s', a') - Q(s,a) \right]$$

Examples: Q-learning, DQN, Rainbow.

**Policy gradient methods** directly optimize the parameterized policy $\pi_\theta$:

$$\nabla_\theta J(\theta) = \mathbb{E}_{\pi_\theta} \left[ \nabla_\theta \log \pi_\theta(a|s) \cdot A^{\pi}(s,a) \right]$$

Examples: REINFORCE, PPO, SAC.

These methods are conceptually simpler and avoid model bias, but they are notoriously sample-hungry. DQN requires approximately 200 million frames (roughly 39 days of real-time Atari play) to reach human-level performance.

### Model-Based Methods

Model-based algorithms learn an approximate model of the environment:

$$\hat{T}(s'|s,a) \approx P(S_{t+1}=s' | S_t=s, A_t=a)$$
$$\hat{R}(s,a) \approx \mathbb{E}[R_{t+1} | S_t=s, A_t=a]$$

The agent then uses this model for **planning** -- generating simulated experience, performing lookahead search, or optimizing trajectories. This allows the agent to extract far more learning signal from each real interaction.

### The Sample Efficiency Gap

Model-based methods can be 10x-100x more sample-efficient than model-free counterparts. On continuous control benchmarks, MBPO (Janner et al., 2019) matches SAC's asymptotic performance using roughly 1/10th the environment interactions. The intuition is straightforward: a single real transition $(s, a, r, s')$ teaches a model-free agent about one state-action pair, but it teaches a model-based agent about the underlying dynamics, enabling generalization across many hypothetical situations.

### The Model Error Problem

The Achilles' heel of model-based RL is **compounding model error**. When the agent plans $H$ steps into the future using a model with per-step error $\epsilon$, the total error can grow as:

$$\text{Error after } H \text{ steps} \sim O(H \cdot \epsilon)$$

In the worst case, errors compound exponentially, making long-horizon plans unreliable. This is why many model-based methods use short planning horizons or employ ensembles to quantify uncertainty (see `planning-with-learned-models.md`).

### Hybrid Approaches

The cleanest boundary is often blurred in practice:

- **Dyna** (Sutton, 1991) interleaves real experience with model-generated experience to update a model-free value function (see `dyna-architecture.md`).
- **AlphaGo/AlphaZero** uses MCTS (model-based planning) guided by a neural network policy and value function (model-free components). See `monte-carlo-tree-search.md`.
- **Dreamer** learns a latent world model and trains an actor-critic entirely within imagined trajectories (see `world-models.md`).
- **MBPO** uses short model-generated rollouts to augment real data for training an off-policy model-free algorithm.

### When to Use Which

| Criterion | Model-Free | Model-Based |
|---|---|---|
| Sample budget | Large (millions+) | Small (thousands) |
| Compute budget | Lower per step | Higher per step |
| Environment complexity | Any | Easier to model |
| Asymptotic performance | Often higher | Risk of model bias |
| Real-world deployment | Needs sim or offline data | Better for real robots |

## Why It Matters

The model-based vs. model-free choice directly determines whether an RL system is practical for real-world applications. In robotics, where each real interaction is slow and costly, model-based methods enable learning in thousands of steps rather than millions. In video games with fast simulators, model-free methods can achieve superior asymptotic performance without the complexity of learning a model. Understanding this tradeoff is essential for any RL practitioner.

## Key Technical Details

- Model-free methods like PPO typically require $10^6$--$10^8$ environment steps on Atari; model-based methods like SimPLe (Kaiser et al., 2020) achieve reasonable performance in $10^5$ steps -- a 100x reduction.
- Model accuracy degrades in stochastic, high-dimensional environments. Pixel-based models are far harder to learn than low-dimensional state-based models.
- Model ensembles (typically 5-7 models) are standard practice to estimate epistemic uncertainty and prevent exploitation of model errors.
- The distinction has a neuroscience parallel: the dorsolateral prefrontal cortex supports model-based planning, while the dorsal striatum supports habitual (model-free) behavior (Daw et al., 2005).
- Offline RL is predominantly model-free, though model-based offline methods (MOReL, MOPO) use pessimistic models to avoid distributional shift.

## Common Misconceptions

**"Model-based RL is always more sample efficient."** Only when the model is accurate enough. In highly stochastic or adversarial environments, a poor model can actually hurt performance by introducing systematic bias that model-free methods would avoid.

**"Model-free means the agent has no internal representations."** Model-free agents still learn rich representations (e.g., convolutional features in DQN). The distinction is about whether the agent explicitly models state transitions and rewards, not about representation learning generally.

**"You must choose one or the other."** Modern state-of-the-art systems are overwhelmingly hybrid. MuZero, Dreamer, and MBPO all blend model-based and model-free components (see `muzero.md`).

**"Model-based RL requires a known model."** Classical planning (e.g., dynamic programming, MCTS with known rules) uses a given model, but modern model-based RL *learns* the model from data. These are fundamentally different settings.

## Connections to Other Concepts

- `dyna-architecture.md` -- The foundational hybrid framework interleaving real and simulated experience.
- `world-models.md` -- Learning compressed latent dynamics models for imagination-based planning.
- `monte-carlo-tree-search.md` -- Tree-search planning that can use either known or learned models.
- `muzero.md` -- Planning in learned latent spaces without explicit state-transition modeling.
- `planning-with-learned-models.md` -- Practical methods for trajectory optimization with neural network models.
- `../03-function-approximation-and-deep-rl/dqn.md` -- The landmark model-free deep RL algorithm.
- `../04-policy-gradient-methods/ppo.md` -- The workhorse model-free policy gradient method.

## Further Reading

- **Sutton & Barto (2018)** -- *Reinforcement Learning: An Introduction*, Chapter 8. Introduces the model-based/model-free distinction and the Dyna architecture.
- **Moerland et al. (2023)** -- "Model-based Reinforcement Learning: A Survey." *Foundations and Trends in ML*. Comprehensive modern survey covering taxonomy, algorithms, and open problems.
- **Daw et al. (2005)** -- "Uncertainty-based competition between prefrontal and dorsostriatal systems for behavioral control." *Nature Neuroscience*. The neuroscience perspective on model-based vs. model-free learning.
- **Wang et al. (2019)** -- "Benchmarking Model-Based Reinforcement Learning." Systematic comparison across algorithms and environments revealing when model-based methods help and when they do not.
- **Janner et al. (2019)** -- "When to Trust Your Model: Model-Based Policy Optimization." Introduces MBPO and provides theoretical analysis of model-based rollout horizons.
