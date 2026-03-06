# Trust Region Methods

**One-Line Summary**: Constraining each policy update to a "trust region" where the local approximation is reliable, preventing the catastrophic performance collapses that plague unconstrained policy gradients -- realized through TRPO and natural policy gradients.

**Prerequisites**: Policy Gradient Theorem (`policy-gradient-theorem.md`), KL divergence, advantage estimation (`advantage-estimation.md`), actor-critic methods (`actor-critic-methods.md`), second-order optimization (Hessians, Fisher information matrix), conjugate gradient method.

## What Is a Trust Region Method?

Imagine tuning a guitar string. Small, careful turns of the tuning peg make the pitch better. But if you wrench the peg too far in one motion, the string snaps -- catastrophic failure from an over-aggressive update. A trust region is like deciding in advance: "I will only turn the peg at most a quarter turn, because within that range I trust my sense of which direction improves the pitch."

In policy optimization, the vanilla policy gradient gives a direction of improvement, but says nothing about how far to step. A step that is too large can move the policy into a region where the gradient approximation is wildly inaccurate, causing performance to collapse. Recovery from such collapses is difficult because the agent now collects bad data under the ruined policy, creating a vicious cycle. Trust region methods bound the size of each policy update using a KL divergence constraint, ensuring that each step provably improves (or at least does not catastrophically worsen) the true expected return.

## How It Works

### Monotonic Improvement Theory

Kakade & Langford (2002) established that the performance difference between two policies $\pi$ and $\tilde{\pi}$ can be expressed exactly as:

$$J(\tilde{\pi}) = J(\pi) + \mathbb{E}_{s \sim d^{\tilde{\pi}}} \left[ \mathbb{E}_{a \sim \tilde{\pi}} [A^\pi(s,a)] \right]$$

where $d^{\tilde{\pi}}$ is the state visitation distribution under the **new** policy $\tilde{\pi}$. The problem is that we cannot sample from $d^{\tilde{\pi}}$ before actually deploying $\tilde{\pi}$. Schulman et al. (2015) showed that by replacing $d^{\tilde{\pi}}$ with $d^\pi$ (the old policy's state distribution) and adding a KL penalty, we obtain a **surrogate objective** $L_\pi(\tilde{\pi})$ that lower-bounds the true improvement:

$$J(\tilde{\pi}) \geq L_\pi(\tilde{\pi}) - C \cdot \max_s D_{KL}(\pi(\cdot|s) \| \tilde{\pi}(\cdot|s))$$

where $C = \frac{4 \epsilon \gamma}{(1-\gamma)^2}$ and $\epsilon = \max_{s,a} |A^\pi(s,a)|$.

### The TRPO Optimization Problem

TRPO (Trust Region Policy Optimization) replaces the penalty with a hard constraint:

$$\max_\theta \quad \mathbb{E}_{s \sim d^{\pi_{\theta_\text{old}}}} \left[ \frac{\pi_\theta(a|s)}{\pi_{\theta_\text{old}}(a|s)} \hat{A}_t \right]$$

$$\text{subject to} \quad \mathbb{E}_s \left[ D_{KL}(\pi_{\theta_\text{old}}(\cdot|s) \| \pi_\theta(\cdot|s)) \right] \leq \delta$$

The constraint $\delta$ defines the trust region size (typically $\delta = 0.01$). The ratio $\frac{\pi_\theta(a|s)}{\pi_{\theta_\text{old}}(a|s)}$ is called the **importance sampling ratio** $r_t(\theta)$.

### Conjugate Gradient Implementation

Directly solving this constrained optimization with the Hessian of the KL divergence is prohibitively expensive for neural network policies (the Hessian has $|\theta|^2$ entries). TRPO uses two key approximations:

1. **Fisher Information Matrix**: The Hessian of the KL divergence equals the Fisher information matrix $F$, which can be computed via Fisher-vector products without materializing the full matrix.

$$F = \mathbb{E} \left[ \nabla_\theta \log \pi_\theta(a|s) \nabla_\theta \log \pi_\theta(a|s)^T \right]$$

2. **Conjugate Gradient**: To compute $F^{-1}g$ (where $g$ is the policy gradient), TRPO uses the conjugate gradient (CG) algorithm, which requires only matrix-vector products $Fv$, not the full matrix $F$. Each CG iteration costs $O(|\theta|)$.

3. **Line Search**: After computing the CG direction, TRPO performs a backtracking line search to find the largest step that satisfies both the KL constraint and improves the surrogate objective.

### Natural Policy Gradients

The natural gradient is the steepest ascent direction in the space of probability distributions (as opposed to parameter space). It is computed as:

$$\tilde{\nabla}_\theta J(\theta) = F^{-1} \nabla_\theta J(\theta)$$

The Fisher information matrix $F$ acts as a preconditioner that accounts for the geometry of the policy's distribution space. Moving 0.01 in parameter space could mean a tiny or enormous change in the distribution, depending on the parameterization. The natural gradient normalizes this, producing updates that are invariant to reparameterization of the policy.

TRPO can be understood as natural policy gradient with a specific step size chosen to satisfy the KL constraint.

## Why It Matters

Before TRPO, deep policy gradient methods were notoriously unstable. A single bad update could destroy a well-performing policy, and recovery could take thousands of episodes -- or might never happen. TRPO provided the first practical algorithm with theoretical monotonic improvement guarantees for deep neural network policies. It demonstrated stable learning on complex continuous control tasks (MuJoCo locomotion) where vanilla policy gradients consistently failed. TRPO's ideas directly inspired PPO, the dominant algorithm in modern RL including RLHF for language models.

## Key Technical Details

- **KL constraint $\delta$**: Typically set to 0.01. Smaller values are more conservative; larger values allow faster but riskier learning. Values above 0.05 often cause instability.
- **Conjugate gradient iterations**: 10-20 iterations are standard, providing a good approximate solution to $F^{-1}g$ without computing $F$ explicitly.
- **Line search**: Exponential backtracking with factor 0.5, typically up to 10 steps. This ensures the actual KL divergence satisfies the constraint (the CG solution is approximate).
- **Computational cost**: Each TRPO update requires multiple forward passes for the CG procedure and line search, making it 3-5x more expensive per update than vanilla policy gradients.
- **Batch size**: TRPO requires relatively large batches (thousands of transitions) to accurately estimate the surrogate objective and KL constraint.
- **GAE**: TRPO uses GAE (`advantage-estimation.md`) with $\lambda = 0.97$ for advantage estimation.
- The Fisher information matrix is always positive semi-definite, ensuring the natural gradient direction is well-defined and a direction of ascent.

## Common Misconceptions

- **"TRPO guarantees monotonic improvement in practice."** The theoretical guarantee requires exact optimization and exact KL computation. In practice with function approximation, stochastic estimation, and finite batches, the guarantee is approximate. TRPO still occasionally degrades performance, just far less often than unconstrained methods.
- **"The KL constraint prevents all large policy changes."** The constraint bounds the average KL divergence over states. In rarely visited states, the policy can still change substantially. This is both a feature (flexibility where data is sparse) and a risk.
- **"TRPO is a second-order method."** Partially true. It uses second-order information (the Fisher matrix) for the constraint, but the objective is linearized (first-order). It is more accurately described as a first-order objective with a second-order constraint.
- **"Natural gradient is just gradient with a different learning rate."** The natural gradient changes the direction of the update, not just its magnitude. It preconditions the gradient using the Fisher matrix, which accounts for parameter space curvature.

## Connections to Other Concepts

- `policy-gradient-theorem.md` -- TRPO optimizes a surrogate objective built on policy gradients.
- `proximal-policy-optimization.md` -- PPO approximates TRPO's trust region constraint with a simpler clipping mechanism, trading theoretical elegance for practical simplicity.
- `advantage-estimation.md` -- TRPO relies on GAE for advantage estimates in the surrogate objective.
- `actor-critic-methods.md` -- TRPO is an actor-critic method where the critic provides value estimates for GAE and the actor update uses the constrained surrogate objective.

## Further Reading

- **Schulman et al. (2015), "Trust Region Policy Optimization"** -- The TRPO paper. Derives the monotonic improvement bound, presents the practical CG+line-search algorithm, and demonstrates stable learning on Atari and MuJoCo tasks.
- **Kakade (2001), "A Natural Policy Gradient"** -- Introduces natural policy gradients to RL, showing that they converge faster than vanilla gradients by respecting the geometry of policy space.
- **Kakade & Langford (2002), "Approximately Optimal Approximate Reinforcement Learning"** -- Establishes the performance difference lemma and conservative policy iteration, the theoretical predecessors of TRPO's monotonic improvement framework.
- **Peters & Schaal (2008), "Natural Actor-Critic"** -- Combines natural gradients with actor-critic architectures, providing efficient natural gradient computation for continuous control.
- **Martens (2010), "Deep Learning via Hessian-Free Optimization"** -- Introduces the conjugate gradient approach for large-scale second-order optimization that TRPO adapts for policy optimization.
