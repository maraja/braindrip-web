# Curiosity-Driven Exploration

**One-Line Summary**: Curiosity-driven exploration replaces external reward with intrinsic motivation from prediction error or information gain, enabling agents to explore systematically by seeking novelty rather than stumbling upon it by accident.

**Prerequisites**: Deep RL basics, reward signals, exploration-exploitation tradeoff, neural network prediction, information theory

## What Is Curiosity-Driven Exploration?

A child does not need a reward to explore a new room. They poke at unfamiliar objects, peek behind curtains, and test what happens when they press buttons -- driven purely by curiosity about the unknown. Curiosity-driven exploration gives RL agents this same intrinsic motivation: a reward signal that is high when the agent encounters something it cannot yet predict and low when the world is familiar.

Standard RL exploration strategies like $\epsilon$-greedy and entropy bonuses are undirected -- they add randomness without prioritizing which unknown states to visit. In environments with sparse or no extrinsic rewards, undirected exploration fails catastrophically. An agent randomly stumbling through a large maze has a vanishingly small probability of reaching the goal. Curiosity provides a directed exploration signal: go where your model of the world is wrong, because that is where there is something left to learn.

## How It Works

### Prediction Error as Curiosity

The core idea: maintain a predictive model of the environment and define curiosity as the model's prediction error. States where the model predicts poorly are novel and worth exploring. The intrinsic reward for transitioning from $s_t$ to $s_{t+1}$ after taking action $a_t$ is:

$$r_t^{\text{intrinsic}} = \| f_\theta(s_t, a_t) - \text{target}(s_{t+1}) \|^2$$

where $f_\theta$ is a learned forward model and "target" is some representation of the next state. The total reward becomes:

$$r_t = r_t^{\text{extrinsic}} + \eta \, r_t^{\text{intrinsic}}$$

where $\eta$ scales the curiosity bonus. As the model improves, prediction error decreases for visited regions, naturally pushing the agent toward unexplored territory.

### The Intrinsic Curiosity Module (ICM)

The ICM (Pathak et al., 2017) addresses a critical problem: predicting raw observations (pixels) is dominated by irrelevant details like texture noise and lighting. ICM operates in a **learned feature space** that captures only task-relevant information.

ICM consists of three components:

1. **Feature encoder** $\phi(s)$: maps observations to feature vectors
2. **Forward model** $\hat{\phi}(s_{t+1}) = f(\phi(s_t), a_t)$: predicts the next state's features from current features and action
3. **Inverse model** $\hat{a}_t = g(\phi(s_t), \phi(s_{t+1}))$: predicts the action from consecutive feature pairs

The inverse model is the clever part -- it trains the feature encoder to capture only aspects of the state that are **controllable by the agent's actions**, filtering out irrelevant visual noise. The curiosity reward is the forward model error in this filtered feature space:

$$r_t^{\text{ICM}} = \frac{1}{2}\| \hat{\phi}(s_{t+1}) - \phi(s_{t+1}) \|^2$$

### Random Network Distillation (RND)

RND (Burda et al., 2019) provides a simpler and remarkably effective alternative. It uses two neural networks:

- A **fixed, randomly initialized** target network $f_{\text{target}}(s)$
- A **trainable** predictor network $f_{\text{predictor}}(s; \theta)$

The intrinsic reward is the prediction error:

$$r_t^{\text{RND}} = \| f_{\text{predictor}}(s_{t+1}; \theta) - f_{\text{target}}(s_{t+1}) \|^2$$

For frequently visited states, the predictor learns to match the target, so prediction error (curiosity) drops. For novel states, the predictor has not been trained, so error is high. RND avoids the forward dynamics modeling entirely -- it is purely a novelty detector.

RND achieved the first meaningful exploration of Montezuma's Revenge without demonstrations, obtaining a mean score of 10,000+ compared to near-zero for standard methods.

### Count-Based Exploration

Classical exploration theory uses **visit counts** $N(s)$ to bonus rarely visited states:

$$r_t^{\text{count}} = \frac{1}{\sqrt{N(s_t)}}$$

In continuous or high-dimensional state spaces, exact counts are impossible. **Pseudo-counts** (Bellemare et al., 2016) approximate visit counts using density models:

$$\hat{N}(s) = \frac{\rho(s)(1 - \rho'(s))}{\rho'(s) - \rho(s)}$$

where $\rho(s)$ is the density model's probability before seeing $s$ and $\rho'(s)$ is the probability after updating on $s$. States that significantly change the density model have low pseudo-counts and receive high bonuses.

### The Noisy TV Problem

A fundamental failure mode of prediction-error curiosity is the **noisy TV problem** (Burda et al., 2019): if the environment contains a source of stochastic, unpredictable transitions (like a TV showing random static), the forward model's prediction error will remain permanently high regardless of how much data it collects. The agent becomes "mesmerized" by the noise, spending all its time watching the TV rather than exploring meaningful parts of the environment.

This occurs because prediction error conflates two sources of uncertainty:

- **Epistemic uncertainty** (reducible): the model has not seen enough data -- this is true curiosity
- **Aleatoric uncertainty** (irreducible): the environment is inherently stochastic -- this is noise

RND partially mitigates this because a deterministic target network does not produce variable outputs for the same input, making stochastic observations less problematic. More principled solutions use **information gain** rather than prediction error.

### Information Gain Approaches

Information gain measures the **reduction in uncertainty** about the agent's model of the world:

$$r_t^{\text{info}} = H(\theta \mid \mathcal{D}_t) - H(\theta \mid \mathcal{D}_t \cup \{(s_t, a_t, s_{t+1})\})$$

where $H(\theta \mid \mathcal{D})$ is the entropy of the posterior over model parameters $\theta$. This directly targets epistemic uncertainty: stochastic transitions do not reduce model uncertainty (the model already knows they are random), so the noisy TV produces zero information gain.

VIME (Variational Information Maximizing Exploration; Houthooft et al., 2016) approximates information gain using variational inference over Bayesian neural network dynamics models. The practical approximation uses:

$$r_t^{\text{VIME}} = D_{\text{KL}}\left[p(\theta \mid \mathcal{D}_{t+1}) \| p(\theta \mid \mathcal{D}_t)\right]$$

This KL divergence between consecutive posteriors is large when the new observation meaningfully updates the agent's beliefs.

## Why It Matters

Sparse-reward environments are the norm, not the exception. Real-world tasks rarely provide continuous feedback. Curiosity-driven exploration has enabled breakthroughs in notoriously hard exploration games (Montezuma's Revenge, Pitfall), open-ended environments (Minecraft), and real-world robotics where reward engineering is impractical. It is also foundational to the broader goal of building agents that can autonomously acquire knowledge and skills.

## Key Technical Details

- ICM scales the curiosity bonus $\eta$ between $0.01$ and $1.0$ depending on the sparsity of extrinsic rewards; purely intrinsic settings use $\eta = 1.0$ with no extrinsic reward
- RND uses a separate value head and reward normalization for intrinsic vs. extrinsic rewards, with non-episodic returns for the intrinsic stream
- Count-based methods use the $1/\sqrt{N}$ bonus rather than $1/N$ because the former decays more slowly, sustaining exploration longer
- Prediction-error curiosity is non-stationary: the intrinsic reward distribution changes as the model learns, complicating value function estimation
- Combining curiosity with extrinsic rewards requires careful reward scaling; a common approach is to normalize intrinsic rewards to have unit variance
- RND is surprisingly simple to implement: approximately 50 lines of code on top of a standard PPO implementation

## Common Misconceptions

- **"Curiosity replaces extrinsic rewards"**: Curiosity is an exploration bonus, not a task specification. Without extrinsic rewards, the agent explores broadly but has no task objective. Curiosity and extrinsic rewards are complementary.
- **"Prediction error always equals novelty"**: The noisy TV problem shows that high prediction error can arise from irreducible stochasticity, not novelty. Only epistemic uncertainty signals true novelty.
- **"Curious agents will explore everything"**: Curiosity-driven agents can still get stuck in "curiosity traps" -- regions where the model is slow to improve (high-dimensional chaotic dynamics) but the agent is not learning anything useful.
- **"More complex curiosity formulations are always better"**: RND, one of the simplest methods, often matches or beats more theoretically grounded approaches. Simplicity and stability matter enormously in practice.

## Connections to Other Concepts

- Curiosity rewards are a form of intrinsic `reward-shaping.md` -- they augment the reward without changing the task
- In `hierarchical-reinforcement-learning.md`, curiosity can drive subgoal discovery by identifying states with high prediction error
- `meta-reinforcement-learning.md` agents can learn exploration strategies that subsume hand-designed curiosity bonuses
- Curiosity-driven exploration complements `offline-reinforcement-learning.md` by improving the quality of data collection before going offline
- `multi-agent-reinforcement-learning.md` agents can use social curiosity -- novelty from other agents' behavior

## Further Reading

- **Pathak et al., "Curiosity-driven Exploration by Self-Supervised Prediction" (ICM, 2017)**: Introduces feature-space prediction error for curiosity, with the inverse model for feature learning.
- **Burda et al., "Exploration by Random Network Distillation" (RND, 2019)**: Simpler-is-better approach using fixed random networks as exploration targets; first to explore Montezuma's Revenge without demonstrations.
- **Bellemare et al., "Unifying Count-Based Exploration and Intrinsic Motivation" (2016)**: Connects pseudo-counts from density models to classical exploration theory.
- **Houthooft et al., "VIME: Variational Information Maximizing Exploration" (2016)**: Information-theoretic curiosity using Bayesian neural network dynamics models.
- **Burda et al., "Large-Scale Study of Curiosity-Driven Learning" (2019)**: Comprehensive empirical study showing that curiosity alone (no extrinsic reward) can drive meaningful progress across dozens of environments.
