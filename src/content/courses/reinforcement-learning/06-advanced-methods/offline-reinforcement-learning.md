# Offline Reinforcement Learning

**One-Line Summary**: Offline RL learns policies entirely from a fixed dataset of previously collected interactions, without any further environment access -- bringing RL into the data-driven regime where healthcare, robotics, and dialogue systems actually operate.

**Prerequisites**: Q-learning, Bellman equations, off-policy learning, distributional shift, policy evaluation

## What Is Offline Reinforcement Learning?

Imagine you inherit a retired doctor's complete case files -- thousands of patients, treatments administered, outcomes recorded. You want to learn the best treatment policy, but you cannot run new experiments on patients. You must learn entirely from the historical data, warts and all. This is offline reinforcement learning: extracting the best possible policy from a fixed dataset, with no ability to collect additional interactions.

Also called **batch RL**, offline RL operates under a constraint that is natural in most real-world settings. Hospitals cannot run arbitrary treatment experiments. Self-driving cars cannot crash to learn. Dialogue systems cannot antagonize real users. In all these domains, we have logged data from past behavior, and we need to learn the best policy we can from that data alone.

## How It Works

### The Offline RL Problem

The agent is given a static dataset $\mathcal{D} = \{(s_i, a_i, r_i, s_i')\}_{i=1}^N$ collected by some unknown **behavior policy** $\pi_\beta$. The goal is to learn a policy $\pi$ that maximizes:

$$J(\pi) = \mathbb{E}_\pi\left[\sum_{t=0}^{\infty} \gamma^t r_t\right]$$

using only $\mathcal{D}$, with no environment interaction. The critical constraint is that $\pi$ may wish to take actions in states where $\mathcal{D}$ provides no information about the consequences.

### Why Offline RL Is Hard: Extrapolation Error

The fundamental challenge is **extrapolation error** (also called distributional shift in the action dimension). Standard Q-learning updates use:

$$Q(s, a) \leftarrow r + \gamma \max_{a'} Q(s', a')$$

The $\max$ operator selects the action with the highest Q-value in the next state. But if that action $a' = \arg\max Q(s', a')$ was never taken from state $s'$ in the dataset, the Q-value $Q(s', a')$ is an unreliable extrapolation. Worse, the bootstrapping in Q-learning propagates and amplifies these errors:

$$\text{Error}(Q) \propto \frac{\gamma}{1 - \gamma} \cdot \mathbb{E}_{s' \sim d^\pi}\left[\max_{a' \notin \text{supp}(\pi_\beta)} |Q(s', a') - Q^*(s', a')|\right]$$

Out-of-distribution actions get erroneously high Q-values, the policy exploits these phantom values, and performance collapses. This is why naively applying DQN or SAC to a fixed dataset typically produces policies far worse than the behavior policy.

### Conservative Q-Learning (CQL)

CQL (Kumar et al., 2020) addresses extrapolation error by adding a regularizer that explicitly pushes down Q-values for out-of-distribution actions:

$$\mathcal{L}_{\text{CQL}}(\theta) = \alpha \left(\mathbb{E}_{s \sim \mathcal{D}, a \sim \mu(a|s)}[Q_\theta(s, a)] - \mathbb{E}_{(s,a) \sim \mathcal{D}}[Q_\theta(s, a)]\right) + \frac{1}{2}\mathbb{E}_{(s,a,r,s') \sim \mathcal{D}}\left[\left(Q_\theta(s,a) - \hat{\mathcal{B}}^\pi \hat{Q}(s,a)\right)^2\right]$$

The first term penalizes high Q-values under a sampling distribution $\mu$ (typically uniform or the current policy) while boosting Q-values for dataset actions. This produces a **lower bound** on the true Q-function for the learned policy, ensuring conservative policy improvement. The hyperparameter $\alpha$ controls the degree of conservatism.

### Batch-Constrained Q-Learning (BCQ)

BCQ (Fujimoto et al., 2019) takes a different approach: explicitly constraining the policy to only select actions similar to those in the dataset. It trains a generative model $G_\omega(s)$ of the behavior policy and restricts action selection:

$$\pi(s) = \arg\max_{a_i + \xi_\phi(s, a_i)} Q_\theta(s, a_i + \xi_\phi(s, a_i)), \quad a_i \sim G_\omega(s)$$

where $\xi_\phi$ is a small perturbation network. By only evaluating actions near the data support, BCQ avoids querying Q-values in unreliable regions.

### Implicit Q-Learning (IQL)

IQL (Kostrikov et al., 2022) avoids querying out-of-distribution actions entirely by reformulating the Bellman backup. Instead of using $\max_{a'} Q(s', a')$, IQL learns the value function using **expectile regression**:

$$\mathcal{L}_\tau(V) = \mathbb{E}_{(s,a) \sim \mathcal{D}}\left[|\tau - \mathbf{1}(Q(s,a) - V(s) < 0)| \cdot (Q(s,a) - V(s))^2\right]$$

where $\tau \in (0, 1)$ controls the expectile. As $\tau \to 1$, the expectile approaches the maximum, approximating the $\max$ operator without ever evaluating actions outside the dataset. The policy is then extracted via advantage-weighted regression:

$$\pi(a \mid s) \propto \pi_\beta(a \mid s) \exp\left(\beta (Q(s,a) - V(s))\right)$$

### Decision Transformers

Decision Transformer (Chen et al., 2021) reframes offline RL as **sequence modeling**. It trains a transformer to predict actions conditioned on the desired return:

$$a_t = \text{Transformer}(R_1, s_1, a_1, \dots, R_t, s_t)$$

where $R_t = \sum_{t'=t}^T r_{t'}$ is the return-to-go. At test time, conditioning on a high return-to-go prompts the model to generate high-performing actions. This completely bypasses Q-learning, temporal difference errors, and bootstrapping, recasting RL as conditional generation.

## Why It Matters

Offline RL unlocks reinforcement learning for domains where online interaction is expensive, dangerous, or impossible. Healthcare treatment optimization, industrial process control, recommendation systems, and dialogue all generate massive historical datasets but cannot afford exploratory failures. Offline RL is also the foundation of RLHF pipelines: the reward model is trained offline from preference data, and initial policy training often uses offline RL before online fine-tuning.

## Key Technical Details

- The quality of the behavior policy $\pi_\beta$ is the primary determinant of offline RL performance; no algorithm can reliably find policies much better than the best behavior in $\mathcal{D}$
- CQL uses $\alpha$ values typically in $[0.5, 5.0]$; too high produces overly conservative policies, too low fails to prevent extrapolation error
- IQL expectile $\tau$ is typically set to $0.7$--$0.9$; $\tau = 0.5$ recovers mean regression (no improvement over behavior), $\tau \to 1.0$ approaches the problematic max
- Decision Transformer uses context lengths of 20 states on D4RL benchmarks and a GPT-2 architecture with 4 layers
- **D4RL** (Fu et al., 2020) is the standard benchmark suite, containing datasets from MuJoCo locomotion, AntMaze navigation, and kitchen manipulation tasks
- Dataset composition matters enormously: "medium-replay" datasets (containing both poor and improving data) are easier than "medium" datasets (containing only mediocre behavior)

## Common Misconceptions

- **"Offline RL can learn any policy from any dataset"**: Offline RL cannot reliably discover strategies entirely absent from the data. It excels at stitching together good sub-trajectories from mediocre data, not at inventing novel strategies.
- **"Decision Transformer solves offline RL"**: DT struggles with trajectory stitching -- combining the best parts of different trajectories. It tends to reproduce trajectories similar to those in the dataset rather than composing novel high-return paths.
- **"Just use off-policy RL on a fixed dataset"**: Standard off-policy algorithms like SAC and TD3 fail catastrophically in the offline setting due to extrapolation error. The offline setting is qualitatively different, not just quantitatively harder.
- **"More data always helps"**: Adding low-quality data (e.g., random behavior) can hurt performance by diluting the signal from good trajectories, especially for methods like Decision Transformer.

## Connections to Other Concepts

- Offline RL is the natural framework for optimizing rewards recovered by `inverse-reinforcement-learning.md`
- Behavioral cloning from `imitation-learning.md` is a special case of offline RL that ignores rewards entirely
- `reward-shaping.md` can improve offline RL by making sparse dataset rewards denser in hindsight
- Conservative value estimation in CQL shares motivation with pessimism in `curiosity-driven-exploration.md`, but applied in the opposite direction
- Decision Transformers connect offline RL to the sequence modeling paradigm underlying `meta-reinforcement-learning.md` in-context approaches

## Further Reading

- **Kumar et al., "Conservative Q-Learning for Offline Reinforcement Learning" (CQL, 2020)**: Introduces Q-value regularization for provably conservative offline policy evaluation and improvement.
- **Fujimoto, Meger, and Precup, "Off-Policy Deep Reinforcement Learning without Exploration" (BCQ, 2019)**: Identifies extrapolation error as the core offline RL challenge and proposes batch-constrained action selection.
- **Kostrikov, Nair, and Levine, "Offline Reinforcement Learning with Implicit Q-Learning" (IQL, 2022)**: Expectile regression approach that avoids evaluating out-of-distribution actions entirely.
- **Chen et al., "Decision Transformer: Reinforcement Learning via Sequence Modeling" (2021)**: Reframes offline RL as return-conditioned sequence generation using transformers.
- **Levine et al., "Offline Reinforcement Learning: Tutorial, Review, and Perspectives on Open Problems" (2020)**: Comprehensive overview of the offline RL landscape, challenges, and open questions.
