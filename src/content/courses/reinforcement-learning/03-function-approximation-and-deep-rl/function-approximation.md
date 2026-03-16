# Function Approximation

**One-Line Summary**: Replacing lookup tables with parameterized functions to generalize across the vast state spaces of real-world problems.

**Prerequisites**: `value-functions.md`, `bellman-equations.md`, `temporal-difference-learning.md`, `q-learning.md`

## What Is Function Approximation?

Imagine you are a real estate appraiser. Early in your career, you memorize the price of every house you have seen -- a mental lookup table. But when you encounter a new house, you are helpless. Eventually, you learn *rules*: square footage matters, neighborhood matters, number of bedrooms matters. You build a mental *model* that generalizes from houses you have seen to houses you have not. Function approximation in RL is this exact shift -- moving from memorizing a value for every state to learning a parameterized function $\hat{v}(s; \mathbf{w})$ that generalizes across states.

In tabular RL, we store one value per state in a table of size $|\mathcal{S}|$. For a game like Backgammon ($\sim 10^{20}$ states) or Go ($\sim 10^{170}$ states), or any problem with continuous state spaces (robotics, autonomous driving), a table is physically impossible. Function approximation replaces the table with a compact function parameterized by a weight vector $\mathbf{w} \in \mathbb{R}^d$, where $d \ll |\mathcal{S}|$, enabling generalization to unseen states.

## How It Works

### The Core Idea

Instead of maintaining a table $V(s)$ for each state, we learn a parameterized approximation:

$$\hat{v}(s; \mathbf{w}) \approx v_\pi(s)$$

We update the weight vector $\mathbf{w}$ using stochastic gradient descent (SGD) to minimize the mean squared value error:

$$\overline{VE}(\mathbf{w}) = \sum_{s \in \mathcal{S}} d_\pi(s) \left[ v_\pi(s) - \hat{v}(s; \mathbf{w}) \right]^2$$

where $d_\pi(s)$ is the on-policy state distribution. The general SGD update rule is:

$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha \left[ U_t - \hat{v}(S_t; \mathbf{w}_t) \right] \nabla_\mathbf{w} \hat{v}(S_t; \mathbf{w}_t)$$

where $U_t$ is the update target (Monte Carlo return, TD target, etc.).

### Linear Function Approximation

The simplest form uses a feature vector $\mathbf{x}(s) \in \mathbb{R}^d$ and linear weights:

$$\hat{v}(s; \mathbf{w}) = \mathbf{w}^\top \mathbf{x}(s) = \sum_{i=1}^d w_i \, x_i(s)$$

The gradient is simply $\nabla_\mathbf{w} \hat{v}(s; \mathbf{w}) = \mathbf{x}(s)$, making updates efficient. With on-policy TD(0), the weight update becomes:

$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha \left[ R_{t+1} + \gamma \hat{v}(S_{t+1}; \mathbf{w}_t) - \hat{v}(S_t; \mathbf{w}_t) \right] \mathbf{x}(S_t)$$

Linear methods converge to a point near the optimum under mild conditions:

$$\overline{VE}(\mathbf{w}_{TD}) \leq \frac{1}{1 - \gamma} \min_\mathbf{w} \overline{VE}(\mathbf{w})$$

### Neural Network Approximation

Neural networks are nonlinear function approximators that learn their own features. A network $\hat{v}(s; \mathbf{w})$ with parameters $\mathbf{w}$ (all weights and biases) is trained via backpropagation. This removes the burden of manual feature engineering but introduces challenges: the loss surface is non-convex, and convergence guarantees from the linear case no longer hold.

> **Recommended visual**: Diagram comparing tabular lookup vs. linear features vs. neural network function approximation.

### The Deadly Triad

Sutton and Barto (2018) identify three elements that, when combined, can cause divergence in value-function learning:

1. **Function approximation** -- generalizing from a subset of states
2. **Bootstrapping** -- updating estimates from other estimates (as in TD learning)
3. **Off-policy training** -- learning about a policy different from the one generating data

Any two of three are safe. All three together can cause weight updates to spiral to infinity. This is not merely a theoretical concern -- early attempts at combining Q-learning (off-policy + bootstrapping) with neural networks (function approximation) routinely diverged. The DQN innovations in `deep-q-networks.md` were designed specifically to tame this instability.

## Why It Matters

Function approximation is the bridge between textbook RL and real-world applications. Without it, RL is limited to toy problems with small, discrete state spaces. Every modern RL success -- Atari, Go, robotics, language model alignment -- relies on neural network function approximation. It is also what makes RL *hard*: most of the instabilities, divergence failures, and training difficulties in deep RL trace back to the challenges of combining function approximation with bootstrapping and off-policy data.

## Key Technical Details

- **Tile coding** is a popular linear method using overlapping grids; typically 8--16 tilings with learning rate $\alpha = 0.1 / \text{num\_tilings}$.
- **Radial basis functions (RBFs)** provide smooth generalization with Gaussian features centered at prototype states.
- Linear TD(0) converges in the mean for diminishing step sizes satisfying the Robbins-Monro conditions: $\sum \alpha_t = \infty$, $\sum \alpha_t^2 < \infty$.
- Nonlinear function approximation (neural networks) with bootstrapping has *no* general convergence guarantees, even on-policy.
- **Batch methods** like least-squares TD (LSTD) solve for the fixed point directly in $O(d^2)$ per step and $O(d^2)$ memory but converge faster with fewer samples.
- The feature vector $\mathbf{x}(s)$ defines the representational capacity: poor features make even optimal weights inadequate.

## Common Misconceptions

- **"Function approximation just means neural networks."** Neural networks are one choice. Linear methods, decision trees, kernel methods, and even Fourier basis functions are all valid function approximators. Linear methods remain important because they have convergence guarantees that nonlinear methods lack.

- **"More parameters always means better approximation."** Over-parameterization can cause overfitting to recently visited states and catastrophic forgetting of earlier ones. The interplay between approximation capacity and training stability is delicate.

- **"The deadly triad means we should avoid function approximation."** The triad warns about a specific dangerous *combination*. Careful algorithmic design (experience replay, target networks, on-policy methods) mitigates the risks. The triad is a design constraint, not a prohibition.

## Connections to Other Concepts

- **Tabular methods** (`q-learning.md`, `sarsa.md`, `temporal-difference-learning.md`) are the special case where every state has its own parameter -- a table entry.
- `deep-q-networks.md`: (`deep-q-networks.md`) combine neural network approximation with two stabilization techniques to overcome the deadly triad.
- `experience-replay.md`: (`experience-replay.md`) and **target networks** (`target-networks.md`) are direct responses to the instabilities introduced by function approximation.
- **Policy gradient methods** (`policy-gradient-theorem.md`) approximate the *policy* rather than the value function, facing their own approximation challenges.

## Further Reading

1. **"Reinforcement Learning: An Introduction," Chapter 9-11 (Sutton & Barto, 2018)** -- The definitive textbook treatment of function approximation, including the deadly triad, convergence theory, and on-policy/off-policy distinctions.
2. **"Residual Algorithms: Reinforcement Learning with Function Approximation" (Baird, 1995)** -- The foundational paper demonstrating divergence with function approximation and bootstrapping.
3. **"Linear Least-Squares Algorithms for Temporal Difference Learning" (Bradtke & Barto, 1996)** -- Introduces LSTD, the batch linear method that solves for the TD fixed point directly.
4. **"An Analysis of Temporal-Difference Learning with Function Approximation" (Tsitsiklis & Van Roy, 1997)** -- Rigorous convergence analysis for linear TD methods, proving the $1/(1-\gamma)$ bound.
