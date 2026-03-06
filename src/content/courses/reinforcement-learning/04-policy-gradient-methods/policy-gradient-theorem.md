# Policy Gradient Theorem

**One-Line Summary**: The mathematical foundation that enables direct optimization of parameterized policies via gradient ascent on expected return, bypassing the need to differentiate through unknown environment dynamics.

**Prerequisites**: Parameterized policies $\pi_\theta(a|s)$, expected return $J(\theta)$, basic calculus (chain rule, logarithmic derivatives), Markov Decision Processes, stochastic gradient ascent.

## What Is the Policy Gradient Theorem?

Imagine you are a blindfolded chef trying to perfect a recipe. You cannot see the stove, the ingredients, or the chemical reactions happening in the pan -- but you can taste the final dish and remember what actions you took. The Policy Gradient Theorem tells you exactly how to adjust your cooking habits based solely on the outcomes you observe, without needing to understand the physics of cooking.

In reinforcement learning, we want to find a policy $\pi_\theta(a|s)$ that maximizes expected cumulative reward. The naive approach would require differentiating through the environment's transition dynamics $P(s'|s,a)$, which are unknown. The Policy Gradient Theorem sidesteps this entirely: it expresses the gradient of expected return purely in terms of quantities the agent can sample -- action probabilities and observed rewards.

## How It Works

### The Objective

We seek to maximize the expected return under policy $\pi_\theta$:

$$J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta} \left[ \sum_{t=0}^{T} \gamma^t r_t \right]$$

where $\tau = (s_0, a_0, r_0, s_1, a_1, r_1, \ldots)$ is a trajectory sampled under $\pi_\theta$.

### Why Differentiation Is Non-Trivial

Expanding $J(\theta)$ reveals the problem. The probability of a trajectory is:

$$P(\tau | \theta) = \rho(s_0) \prod_{t=0}^{T-1} \pi_\theta(a_t|s_t) \cdot P(s_{t+1}|s_t, a_t)$$

Differentiating $J(\theta) = \sum_\tau P(\tau|\theta) R(\tau)$ requires $\nabla_\theta P(\tau|\theta)$, which involves the unknown dynamics $P(s'|s,a)$. We cannot differentiate through what we do not know.

### The Log-Probability Trick

The key identity is deceptively simple. For any function $f(x)$:

$$\nabla_\theta P(\tau|\theta) = P(\tau|\theta) \nabla_\theta \log P(\tau|\theta)$$

This follows from $\nabla \log f = \frac{\nabla f}{f}$. Substituting into the gradient of $J$:

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta} \left[ R(\tau) \nabla_\theta \log P(\tau|\theta) \right]$$

### The Dynamics Cancel

Taking the log of the trajectory probability:

$$\log P(\tau|\theta) = \log \rho(s_0) + \sum_{t=0}^{T-1} \left[ \log \pi_\theta(a_t|s_t) + \log P(s_{t+1}|s_t, a_t) \right]$$

When we differentiate with respect to $\theta$, the initial state distribution $\rho(s_0)$ and the transition dynamics $P(s'|s,a)$ vanish because they do not depend on $\theta$. This yields the **Policy Gradient Theorem**:

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta} \left[ \sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t|s_t) \cdot R_t \right]$$

where $R_t = \sum_{t'=t}^{T-1} \gamma^{t'-t} r_{t'}$ is the return from time $t$ onward. Each action's log-probability is weighted by the reward that followed it.

### The Score Function Estimator

The term $\nabla_\theta \log \pi_\theta(a|s)$ is called the **score function**. It indicates the direction in parameter space that increases the probability of action $a$ in state $s$. The theorem says: move in this direction, but scale the step by how good the outcome was. Good outcomes reinforce the actions that led to them; bad outcomes suppress them.

## Why It Matters

The Policy Gradient Theorem is the theoretical bedrock upon which every policy gradient algorithm rests -- from REINFORCE to PPO to the RLHF systems training modern large language models. Without it, we would need a differentiable model of the environment, which is unavailable in most real-world problems (robotics, game playing, language model alignment). It converts an intractable optimization problem into a tractable one solvable with Monte Carlo sampling.

## Key Technical Details

- The theorem holds for both episodic (finite horizon) and continuing (infinite horizon with discounting or average reward) settings.
- The score function $\nabla_\theta \log \pi_\theta(a|s)$ has expectation zero: $\mathbb{E}_{a \sim \pi_\theta}[\nabla_\theta \log \pi_\theta(a|s)] = 0$. This allows subtracting any state-dependent baseline without introducing bias.
- For Gaussian policies $\pi_\theta(a|s) = \mathcal{N}(\mu_\theta(s), \sigma^2)$, the score function is $\frac{(a - \mu_\theta(s))}{\sigma^2} \nabla_\theta \mu_\theta(s)$.
- For softmax (categorical) policies, the score function is $\nabla_\theta \log \pi_\theta(a|s) = \phi(s,a) - \mathbb{E}_{a' \sim \pi_\theta}[\phi(s,a')]$, where $\phi$ are features.
- The raw Monte Carlo estimator of the policy gradient has notoriously high variance, motivating baselines (`advantage-estimation.md`) and critic networks (`actor-critic-methods.md`).

## Common Misconceptions

- **"The policy gradient theorem requires a differentiable environment."** False -- this is precisely what the theorem avoids. The environment is treated as a black box; only the policy must be differentiable with respect to $\theta$.
- **"Policy gradients only work for discrete action spaces."** The theorem applies to continuous actions equally well. Gaussian policies are the standard choice for continuous control.
- **"The log-probability trick is just a mathematical convenience."** It is fundamental. Without it, the gradient estimator would require knowledge of $P(s'|s,a)$, making model-free policy optimization impossible.
- **"Higher returns always mean larger gradient updates."** The gradient also depends on the score function magnitude. Actions the policy already takes with high confidence produce smaller score function values, creating a natural dampening effect.

## Connections to Other Concepts

- `reinforce.md` -- The simplest algorithm built directly on the policy gradient theorem using Monte Carlo returns.
- `actor-critic-methods.md` -- Replaces Monte Carlo returns with learned value function estimates to reduce variance.
- `advantage-estimation.md` -- Provides sophisticated estimators for the $R_t$ term in the gradient to control bias-variance trade-off.
- `trust-region-methods.md` -- Addresses the fact that the theorem gives a local gradient direction but says nothing about safe step sizes.
- `proximal-policy-optimization.md` -- The practical descendant that clips the gradient-based update for stability.

## Further Reading

- **Sutton et al. (1999), "Policy Gradient Methods for Reinforcement Learning with Function Approximation"** -- The foundational paper that formally proves the policy gradient theorem for function approximation settings and establishes its compatibility with temporal-difference learning.
- **Williams (1992), "Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning"** -- Introduces REINFORCE and the log-probability trick that underlies the score function estimator.
- **Peters & Schaal (2008), "Reinforcement Learning of Motor Skills with Policy Gradients"** -- An excellent survey connecting policy gradient theory to robotics applications with clear derivations.
- **Schulman (2016), PhD Thesis, "Optimizing Expectations: From Deep Reinforcement Learning to Stochastic Computation Graphs"** -- Generalizes the policy gradient theorem to stochastic computation graphs, providing deep theoretical insight.
