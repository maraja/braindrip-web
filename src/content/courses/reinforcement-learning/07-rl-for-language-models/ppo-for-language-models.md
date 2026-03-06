# PPO for Language Models

**One-Line Summary**: Adapting Proximal Policy Optimization from game environments to text generation -- where actions are tokens, episodes are sequences, rewards arrive only at the end, and four full-sized neural networks must coexist in GPU memory.

**Prerequisites**: Proximal Policy Optimization (`04-policy-gradient-methods/proximal-policy-optimization.md`), advantage estimation (`04-policy-gradient-methods/advantage-estimation.md`), actor-critic methods (`04-policy-gradient-methods/actor-critic-methods.md`), KL divergence, language model basics (autoregressive generation).

## What Is PPO for Language Models?

Imagine PPO was originally designed to teach a robot to walk -- it takes a step, observes the ground, decides on the next movement, and gets continuous feedback about balance and forward progress. Now imagine instead teaching someone to write a poem: they must choose one word at a time from a vocabulary of 50,000+ options, they receive no feedback until the entire poem is finished, and "good" is defined not by physics but by subjective human taste. That is the challenge of applying PPO to language models.

In the language model setting, PPO optimizes an autoregressive policy $\pi_\theta$ (the LLM) that generates text token by token. Each token selection is an action, the growing sequence is the state, and the reward comes only after the full response is generated. This creates a credit assignment problem far more extreme than typical RL: a 500-token response means 500 sequential decisions, but only one reward signal at the end.

## How It Works

### Text Generation as a Markov Decision Process

The text generation process is cast as an MDP:

- **State** $s_t$: The prompt $x$ concatenated with all tokens generated so far $(y_1, \ldots, y_{t-1})$
- **Action** $a_t$: The next token $y_t$ selected from vocabulary $\mathcal{V}$ (typically $|\mathcal{V}| \approx 32{,}000$--$128{,}000$)
- **Transition**: Deterministic -- appending the chosen token to the sequence
- **Reward**: $r_t = 0$ for $t < T$, and $r_T = r_\phi(x, y_{1:T}) - \beta \sum_{t=1}^{T} \log \frac{\pi_\theta(y_t|s_t)}{\pi_{\text{ref}}(y_t|s_t)}$ at the final token

The per-token KL penalty can also be distributed across timesteps rather than applied at the end:

$$r_t = \begin{cases} -\beta \log \frac{\pi_\theta(y_t|s_t)}{\pi_{\text{ref}}(y_t|s_t)} & t < T \\ r_\phi(x, y_{1:T}) - \beta \log \frac{\pi_\theta(y_t|s_t)}{\pi_{\text{ref}}(y_t|s_t)} & t = T \end{cases}$$

### The PPO Objective for LLMs

The clipped surrogate objective from standard PPO applies directly:

$$\mathcal{L}^{\text{CLIP}}(\theta) = \mathbb{E}_t \left[ \min\left( \rho_t(\theta) \hat{A}_t, \, \text{clip}(\rho_t(\theta), 1-\epsilon, 1+\epsilon) \hat{A}_t \right) \right]$$

where $\rho_t(\theta) = \frac{\pi_\theta(y_t|s_t)}{\pi_{\theta_{\text{old}}}(y_t|s_t)}$ is the importance sampling ratio and $\hat{A}_t$ is the estimated advantage using GAE:

$$\hat{A}_t = \sum_{l=0}^{T-t} (\gamma \lambda)^l \delta_{t+l}, \quad \delta_t = r_t + \gamma V_\psi(s_{t+1}) - V_\psi(s_t)$$

### The Four-Model Architecture

PPO for LLMs requires four models in GPU memory simultaneously:

1. **Active policy** $\pi_\theta$: The LLM being optimized (generates responses, gets updated)
2. **Reference policy** $\pi_{\text{ref}}$: A frozen copy of $\pi_{\text{SFT}}$ (computes KL penalty, never updated)
3. **Reward model** $r_\phi$: Predicts human preference scores (frozen during PPO)
4. **Value function** $V_\psi$: Estimates expected future return for advantage computation (trained alongside the policy)

For a 7B parameter policy, this means roughly 4 $\times$ 7B = 28B parameters in memory (the value head is typically a small addition to a copy of the policy network). This massive memory footprint is a primary engineering constraint and motivator for alternatives like DPO and GRPO.

### The Generation-Training Loop

Unlike standard RL where environment steps are cheap, each "environment step" in LLM PPO involves full autoregressive generation:

1. **Sample prompts** from dataset $\mathcal{D}$
2. **Generate responses** from $\pi_\theta$ (expensive: sequential token generation)
3. **Score responses** with $r_\phi$ (single forward pass per response)
4. **Compute KL penalties** using $\pi_{\text{ref}}$ (forward pass per response)
5. **Estimate advantages** using $V_\psi$ and GAE
6. **Update** $\pi_\theta$ and $V_\psi$ with multiple PPO epochs on the collected batch

Steps 2--6 repeat for each batch. Generation (step 2) often dominates wall-clock time.

## Why It Matters

PPO for language models is the optimization engine behind ChatGPT, Claude, and most commercial LLM assistants. Despite its complexity, it remains the most well-validated approach for converting human preference signals into policy improvements. The specific adaptations -- distributing KL penalties, handling sparse terminal rewards, managing four-model memory -- represent hard-won engineering knowledge that determines whether RLHF succeeds or produces degenerate outputs.

## Key Technical Details

- **Clip parameter**: $\epsilon = 0.2$ is standard, sometimes reduced to $0.1$ for LLMs to enforce more conservative updates.
- **Learning rate**: Typically $1 \times 10^{-6}$ to $5 \times 10^{-6}$, an order of magnitude lower than SFT learning rates.
- **Batch size**: 64--512 prompts per batch, with each prompt generating a response of 256--2048 tokens.
- **PPO epochs**: 1--4 optimization epochs per batch of generated data. More epochs risk overfitting to stale data.
- **GAE parameters**: $\gamma = 1.0$ (no discounting within a response) and $\lambda = 0.95$ are common starting points.
- **KL coefficient**: $\beta \approx 0.01$--$0.2$. Some implementations use adaptive KL targeting, increasing $\beta$ when KL exceeds a target and decreasing when below.
- **Value function initialization**: $V_\psi$ is typically initialized from the SFT model with a scalar output head. Poor value function initialization causes large advantage estimation errors early in training.
- **Gradient accumulation**: With large models, effective batch sizes are achieved through gradient accumulation across micro-batches.

## Common Misconceptions

- **"PPO for LLMs is the same algorithm as PPO for Atari."** The algorithm is mathematically identical, but the engineering is radically different. The action space (50K+ discrete tokens vs. ~18 Atari actions), episode length (hundreds of tokens vs. thousands of frames), reward structure (terminal only vs. dense), and memory requirements (four LLMs vs. small CNNs) create fundamentally different challenges.
- **"The KL penalty is just regularization."** It is regularization, but it also prevents a specific failure mode: without it, the policy rapidly finds adversarial inputs to the reward model -- sequences that score highly but are nonsensical or degenerate. The KL penalty is as much about reward model robustness as policy stability.
- **"More PPO training always improves quality."** There is a characteristic "alignment tax" curve: quality improves rapidly, plateaus, and then degrades as the model begins to overoptimize against the reward model. Knowing when to stop is critical.
- **"The value function is optional."** Without $V_\psi$, you must use REINFORCE-style Monte Carlo returns, which have much higher variance. The value function baseline is essential for stable training, though alternatives like GRPO eliminate it through different means.

## Connections to Other Concepts

- `rlhf-pipeline.md` -- PPO is Stage 3 of the RLHF pipeline; this file details the specific mechanics.
- `reward-modeling-for-llms.md` -- The reward model $r_\phi$ that provides the training signal for PPO.
- `grpo.md` -- An alternative that eliminates the value function $V_\psi$ entirely through group-relative advantages.
- `dpo-as-implicit-rl.md` -- Eliminates the PPO loop entirely by deriving the optimal policy in closed form.
- `04-policy-gradient-methods/proximal-policy-optimization.md` -- The base PPO algorithm before LLM-specific adaptations.
- `04-policy-gradient-methods/advantage-estimation.md` -- GAE, the advantage estimation method used within PPO for LLMs.
- `04-policy-gradient-methods/entropy-regularization.md` -- The KL penalty in RLHF is conceptually related to entropy regularization in standard RL.

## Further Reading

- **Ziegler et al. (2019), "Fine-Tuning Language Models from Human Preferences"** -- The first application of PPO to language model fine-tuning, establishing the core four-model architecture and KL penalty approach.
- **Ouyang et al. (2022), "Training Language Models to Follow Instructions with Human Feedback"** -- InstructGPT: the most detailed public description of PPO applied to large-scale LLM alignment.
- **Zheng et al. (2023), "Secrets of RLHF in Large Language Models Part I: PPO"** -- Practical analysis of PPO hyperparameters, training stability, and implementation details for LLMs.
- **Huang et al. (2024), "The N+ Implementation Details of RLHF with PPO"** -- An exhaustive catalog of implementation details that determine success or failure of PPO for LLMs.
- **Schulman et al. (2017), "Proximal Policy Optimization Algorithms"** -- The original PPO paper; essential context for understanding the base algorithm before LLM adaptations.
