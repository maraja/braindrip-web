# Planning with Learned Models

**One-Line Summary**: Using neural network dynamics models for lookahead search, trajectory optimization, and data augmentation.

**Prerequisites**: `model-based-vs-model-free.md`, `dyna-architecture.md`, `world-models.md`.

## What Is Planning with Learned Models?

Imagine a chess player who can't memorize the rules but can *predict* what will happen after each move by pattern-matching against thousands of previous games. They think ahead by imagining sequences of moves and counter-moves, evaluating each imagined position, and choosing the path that looks best. Their predictions aren't perfect -- they occasionally hallucinate illegal positions -- but thinking ahead, even approximately, beats just reacting.

Planning with learned models brings this ability to RL agents. Instead of relying on a known simulator or environment model, the agent learns a **dynamics model** $f_\phi(s_t, a_t) \to (\hat{s}_{t+1}, \hat{r}_{t+1})$ from experience and uses it for lookahead planning, trajectory optimization, or generating synthetic data. The promise is dramatic sample efficiency gains; the challenge is that model errors compound over multi-step predictions.

## How It Works

### Learning the Dynamics Model

The dynamics model predicts next state and reward given current state and action:

$$\hat{s}_{t+1}, \hat{r}_{t+1} = f_\phi(s_t, a_t)$$

Training uses supervised learning on collected transitions $(s_t, a_t, s_{t+1}, r_{t+1})$:

$$\mathcal{L}(\phi) = \mathbb{E}_{(s, a, s', r) \sim \mathcal{D}} \left[ \|f_\phi(s, a) - (s', r)\|^2 \right]$$

For stochastic environments, the model may predict a distribution: $p_\phi(s_{t+1}, r_{t+1} | s_t, a_t)$, trained via maximum likelihood. Common architectures include deterministic MLPs, probabilistic ensembles, and latent-space models (VAEs, RSSMs).

### Model Predictive Control (MPC)

At each time step, use the learned model to plan a short horizon ahead using **shooting methods**:

1. **Sample** $N$ candidate action sequences of length $H$: $\{a_0^{(i)}, \ldots, a_{H-1}^{(i)}\}_{i=1}^N$
2. **Simulate** each sequence through the learned model to predict returns
3. **Select** the first action from the best sequence
4. **Execute** that action, observe the real next state, and repeat

$$a_0^* = \arg\max_{a_0} \left[ \max_{a_1, \ldots, a_{H-1}} \sum_{t=0}^{H-1} \gamma^t \hat{r}(s_t, a_t) \right]$$

This is **model predictive control** (MPC): plan, execute one step, replan from the new observed state. Replanning from the true state at each step corrects for model error accumulation.

### Cross-Entropy Method (CEM)

CEM is the most popular action optimization method for MPC with learned models:

1. Initialize a distribution over action sequences: $a_{0:H-1} \sim \mathcal{N}(\mu, \sigma^2)$
2. Sample $N$ candidate sequences
3. Evaluate each via model rollouts, compute total predicted return
4. Select the top-$K$ sequences (the "elite" set)
5. Refit $\mu$ and $\sigma$ to the elite set
6. Repeat for $M$ iterations

CEM is derivative-free (works with non-differentiable models), simple to implement, and parallelizes well on GPUs. PETS (Chua et al., 2018) demonstrated that CEM + probabilistic ensembles achieves strong results with very few environment interactions.

### Model Ensembles for Uncertainty

A single neural network model gives overconfident predictions. **Ensembles** of $B$ independently trained models (typically $B = 5-7$) provide uncertainty estimation:

$$\hat{s}_{t+1}^{(b)} = f_{\phi_b}(s_t, a_t), \quad b = 1, \ldots, B$$

The disagreement between ensemble members indicates epistemic uncertainty. Planning algorithms can:
- **Average** predictions across ensemble members
- **Sample** a different model for each step in a rollout (trajectory sampling)
- **Penalize** actions that lead to high-disagreement states (pessimistic planning)

PETS uses trajectory sampling: for each simulated rollout, randomly select which ensemble member to query at each step, propagating both aleatoric and epistemic uncertainty through the plan.

### Model-Based Policy Optimization (MBPO)

Janner et al. (2019) introduced a principled framework for combining learned models with model-free policy optimization:

1. Collect real data by interacting with the environment
2. Train an ensemble dynamics model on real data
3. Generate synthetic rollouts of length $k$ from real states using the model
4. Add synthetic data to the replay buffer
5. Update the policy using model-free RL (e.g., SAC) on the augmented buffer
6. Repeat

The key insight: **short rollouts** (small $k$) from real states limit compounding error while still providing substantial data augmentation. MBPO provides a theoretical bound on the policy's real performance as a function of model error and rollout length:

$$\eta[\pi] \geq \hat{\eta}[\pi] - C \cdot \epsilon_m \cdot k$$

where $\hat{\eta}$ is the performance under the model, $\epsilon_m$ is model error, and $k$ is rollout length. This suggests using longer rollouts only as the model improves.

### The Compounding Error Problem

Model errors compound exponentially over multi-step predictions:

$$\text{Error at step } H \approx \epsilon \cdot \frac{(1 + \epsilon)^H - 1}{\epsilon} \approx \epsilon \cdot H \text{ (for small } \epsilon \text{)}$$

For a model with 1% single-step error, a 50-step rollout accumulates roughly 50% total error. Mitigation strategies include:
- **Short rollout horizons** (MBPO uses $k = 1-5$)
- **Ensembles** to detect when predictions diverge
- **Replanning** from real states (MPC)
- **Latent-space models** where predictions stay in a compressed, learned representation (DreamerV3)
- **Termination functions** that halt rollouts when uncertainty exceeds a threshold

### Differentiable Planning

When the dynamics model is differentiable (neural network), gradients can be backpropagated through the model to directly optimize action sequences:

$$\nabla_{a_{0:H-1}} \sum_{t=0}^{H-1} \gamma^t r(\hat{s}_t, a_t)$$

This is **analytic shooting** or **backpropagation through time applied to planning**. It avoids the need for sampling but suffers from vanishing/exploding gradients over long horizons and can get stuck in local optima.

SVG (Stochastic Value Gradients, Heess et al., 2015) and PILCO (Deisenroth & Rasmussen, 2011) use differentiable models for policy optimization, achieving remarkable sample efficiency on robotics tasks.

## Why It Matters

Planning with learned models offers the potential for **orders-of-magnitude better sample efficiency** compared to model-free RL. MBPO achieves the same performance as SAC with 10-100x fewer environment interactions on MuJoCo benchmarks. This is critical for real-world applications (robotics, healthcare, resource management) where environment interactions are expensive, slow, or dangerous.

The trade-off is **computational cost at inference time** (planning takes many model evaluations per action) and **sensitivity to model accuracy** (bad models produce bad plans). As model learning improves, model-based methods are increasingly competitive with model-free approaches while being dramatically more sample-efficient.

## Key Technical Details

- **PETS** (Chua et al., 2018): Ensemble of 5 probabilistic neural networks + CEM planning. 200 candidate sequences, 3 CEM iterations, planning horizon $H = 30$. Matches model-free methods at ~1/100th the samples on MuJoCo.
- **MBPO** (Janner et al., 2019): Rollout length $k$ increases from 1 to 5 as the model improves. Uses SAC for policy optimization. Achieves near-asymptotic SAC performance with ~20x fewer samples.
- **DreamerV3** (Hafner et al., 2023): Plans in latent space using an RSSM, achieving state-of-the-art on Atari, DMControl, and Minecraft with a single set of hyperparameters.
- **Model horizon selection**: Too short = insufficient benefit from planning. Too long = compounding error degrades performance. Adaptive horizon based on model uncertainty is an active research direction.
- **Computational overhead**: MPC with CEM typically requires 200-1000 model evaluations per real environment step. GPU parallelism makes this feasible but adds latency.

## Common Misconceptions

- **"Learned models are too inaccurate for planning."** Short-horizon planning (1-5 steps) from real states is remarkably robust to model error. MPC with replanning further mitigates errors since the agent corrects itself at each real step.
- **"Model-based RL is always more sample-efficient."** If the state space is very high-dimensional (e.g., raw images), learning an accurate model may require as many samples as learning a good policy directly. Latent-space models help but add complexity.
- **"Planning replaces learning."** Most successful approaches (MBPO, DreamerV3) combine model-based planning with model-free learning. The model generates data; the model-free algorithm learns a policy from that data.
- **"CEM is too simple to work well."** Despite being derivative-free and relatively unsophisticated, CEM with ensembles is among the most robust planning methods in practice, outperforming many more complex alternatives.

## Connections to Other Concepts

- `model-based-vs-model-free.md` -- The foundational distinction that planning with learned models bridges.
- `dyna-architecture.md` -- The original framework for interleaving real and simulated experience.
- `world-models.md` -- Latent-space dynamics models that enable planning in compressed spaces.
- `muzero.md` -- Planning with learned models that predict values/policies/rewards without state reconstruction.
- `monte-carlo-tree-search.md` -- Tree-based planning that can use learned models instead of perfect simulators.

## Further Reading

1. **Chua et al. (2018)** -- "Deep Reinforcement Learning in a Handful of Trials using Probabilistic Dynamics Models." *NeurIPS*. PETS: ensembles + CEM for dramatically sample-efficient RL.
2. **Janner et al. (2019)** -- "When to Trust Your Model: Model-Based Policy Optimization." *NeurIPS*. MBPO with theoretical analysis of short-horizon model usage.
3. **Hafner et al. (2023)** -- "Mastering Diverse Domains through World Models." *arXiv*. DreamerV3: general-purpose model-based RL with a single hyperparameter set.
4. **Deisenroth & Rasmussen (2011)** -- "PILCO: A Model-Based and Data-Efficient Approach to Policy Search." *ICML*. Gaussian process dynamics models with analytic policy gradients.
5. **Wang & Ba (2020)** -- "Exploring Model-based Planning with Policy Networks." *ICLR*. Analysis of when model-based planning helps vs. hurts.
