# Monte Carlo Tree Search

**One-Line Summary**: A tree-based planning algorithm that combines random simulation with upper confidence bounds to efficiently search large decision spaces -- the planning engine that powered AlphaGo's victory over the world Go champion.

**Prerequisites**: `model-based-vs-model-free.md`, `../01-foundations/exploration-vs-exploitation.md`, `../01-foundations/value-functions.md`

## What Is Monte Carlo Tree Search?

Imagine you are exploring a massive cave system. You cannot map every tunnel, so you adopt a strategy: you preferentially explore tunnels that have looked promising so far (exploitation), while occasionally venturing down unexplored passages (exploration). Each time you complete an expedition, you update your mental map of which tunnels tend to lead to treasure. Over time, your map becomes increasingly detailed in the most valuable regions while remaining sparse in unpromising areas.

**Monte Carlo Tree Search (MCTS)** applies this principle to decision-making in sequential problems. It builds a search tree incrementally, focusing computational effort on the most promising branches. Unlike exhaustive search (infeasible in games like Go with $\sim 10^{170}$ possible positions), MCTS uses random simulations to estimate the value of actions, guided by an upper confidence bound to balance exploration and exploitation. It is an **anytime algorithm**: it can return a reasonable action after any amount of computation, and more computation yields better decisions.

## How It Works

### The Four Phases

Each iteration of MCTS consists of four phases:

**Phase 1 -- Selection**: Starting from the root node (current game state), traverse the tree by selecting child nodes according to a **tree policy**. At each internal node, choose the child that maximizes the **Upper Confidence Bound for Trees (UCT)**:

$$\text{UCT}(s, a) = \bar{Q}(s, a) + c \sqrt{\frac{\ln N(s)}{N(s, a)}}$$

where $\bar{Q}(s, a)$ is the average return from taking action $a$ in state $s$, $N(s)$ is the visit count of state $s$, $N(s, a)$ is the visit count of the state-action pair, and $c$ is the exploration constant (typically $c = \sqrt{2}$ from the UCB1 theory of Auer et al., 2002). Selection continues until a node with unexpanded children is reached.

**Phase 2 -- Expansion**: Add one or more child nodes to the tree for actions not yet explored from the selected node. This grows the tree by one level in the most promising direction.

**Phase 3 -- Simulation (Rollout)**: From the newly expanded node, play out the game to completion using a **default policy** -- often a random (uniform) policy, though domain-specific heuristics can significantly improve performance. The outcome (win/loss/score) provides a Monte Carlo estimate of the node's value.

**Phase 4 -- Backpropagation**: Propagate the simulation result back up the tree, updating the visit counts $N(s, a)$ and average values $\bar{Q}(s, a)$ for every node along the traversed path:

$$\bar{Q}(s, a) \leftarrow \bar{Q}(s, a) + \frac{1}{N(s, a)} \left[ G - \bar{Q}(s, a) \right]$$

where $G$ is the return from the simulation.

After many iterations (typically thousands to millions), the action from the root with the highest visit count (not the highest value -- visit count is more robust) is selected.

### UCT: The Exploration-Exploitation Balance

The UCT formula elegantly solves the multi-armed bandit problem at each tree node. The first term $\bar{Q}(s, a)$ exploits actions with high estimated value. The second term $c \sqrt{\ln N(s) / N(s,a)}$ explores actions that have been tried relatively few times. As $N(s, a) \to \infty$, the exploration term vanishes, ensuring convergence. Kocsis and Szepesvari (2006) proved that UCT converges to the optimal action as the number of simulations grows.

### PUCT: The AlphaGo Variant

AlphaGo and AlphaZero replaced UCT with **Predictor + UCT (PUCT)**, incorporating a neural network policy prior $P(a|s)$:

$$\text{PUCT}(s, a) = Q(s, a) + c_{\text{puct}} \cdot P(a|s) \cdot \frac{\sqrt{N(s)}}{1 + N(s, a)}$$

This is transformative: instead of exploring uniformly, the search is biased toward moves that the neural network considers promising. In early iterations (when $N(s,a)$ is small), the prior $P(a|s)$ dominates, so the tree explores expert-like moves first. As simulations accumulate, the $Q$-value term takes over, correcting the prior when the search discovers better moves. The exploration constant $c_{\text{puct}}$ was set to 2.5 in AlphaZero.

Additionally, AlphaGo replaced random rollouts with a **learned value network** $V(s)$, evaluating leaf nodes directly instead of simulating to completion. The final leaf evaluation is:

$$V_{\text{leaf}}(s) = (1 - \lambda) \cdot V_\theta(s) + \lambda \cdot G_{\text{rollout}}$$

AlphaZero simplified this further by using only the value network ($\lambda = 0$), eliminating rollouts entirely.

### Computational Scaling

MCTS has a remarkable scaling property: performance improves smoothly with more computation. In AlphaGo's match against Lee Sedol, each move involved approximately 100,000 simulations computed across 48 TPUs and 1,202 CPUs over 30-60 seconds of thinking time. The anytime property means that even with 100 simulations, MCTS produces a reasonable move; with 100,000, it produces a world-champion-level move.

## Why It Matters

MCTS made it possible to achieve superhuman performance in Go, a game where the branching factor (~250 legal moves per position) renders traditional minimax search with alpha-beta pruning completely infeasible. Beyond games, MCTS is used in scheduling, combinatorial optimization, program synthesis, and as the planning backbone of MuZero (see `muzero.md`). Its combination with neural networks created the template for modern AI planning systems.

## Key Technical Details

- **Branching factor tolerance**: MCTS handles branching factors of 250+ (Go), compared to ~35 for chess. This is possible because MCTS samples actions rather than enumerating them.
- **Simulation count**: AlphaGo used ~100,000 simulations per move; AlphaZero used ~800 simulations per move (but with a stronger network). Even 50-100 simulations provide meaningful improvement over the raw network policy.
- **Temperature-based action selection**: At the root, actions are selected proportionally to $N(s,a)^{1/\tau}$ where $\tau$ is a temperature parameter. Early in the game $\tau = 1$ encourages exploration; later $\tau \to 0$ selects the most-visited action deterministically.
- **Virtual loss**: For parallel MCTS, a "virtual loss" is subtracted when a thread begins traversing a path, discouraging other threads from following the same path. This enables efficient parallelization across many cores.
- **Transpositions**: Standard MCTS uses a tree, but some implementations use a directed acyclic graph (DAG) to handle transpositions -- different action sequences reaching the same state.
- **Dirichlet noise**: AlphaZero adds Dirichlet noise to the root prior: $P'(a) = (1 - \epsilon) P(a|s) + \epsilon \cdot \eta_a$, where $\eta \sim \text{Dir}(\alpha)$ with $\alpha = 0.03$ for Go, ensuring root-level exploration during self-play.

## Common Misconceptions

**"MCTS requires random rollouts."** Classical MCTS uses rollouts, but modern variants (AlphaZero, MuZero) replace them entirely with learned value functions. The rollout is the least essential component of the MCTS framework.

**"MCTS only works for games with discrete actions."** While most successful, MCTS has been adapted for continuous action spaces using progressive widening (Couetoux et al., 2011), where new actions are added to the tree at a rate proportional to $N(s)^{\alpha}$ for $\alpha < 1$.

**"More simulations always help linearly."** Returns are diminishing. Performance scales roughly logarithmically with simulation count -- doubling simulations from 100 to 200 helps much more than doubling from 10,000 to 20,000.

**"MCTS needs a perfect model."** MCTS needs a model to simulate forward, but the model need not be perfect. MuZero demonstrates that a *learned* model is sufficient for superhuman performance (see `muzero.md`).

## Connections to Other Concepts

- `model-based-vs-model-free.md` -- MCTS is a quintessential model-based planning algorithm.
- `muzero.md` -- Applies MCTS with a learned latent model instead of known game rules.
- `planning-with-learned-models.md` -- Alternative planning approaches (MPC, shooting methods) that solve similar problems differently.
- `../01-foundations/exploration-vs-exploitation.md` -- UCT directly instantiates the exploration-exploitation tradeoff.
- `dyna-architecture.md` -- Like MCTS, Dyna uses a model to generate simulated experience, but without tree structure.

## Further Reading

- **Kocsis & Szepesvari (2006)** -- "Bandit-based Monte-Carlo Planning." *ECML*. Introduces UCT, the theoretical foundation for MCTS.
- **Coulom (2007)** -- "Efficient Selectivity and Backup Operators in Monte-Carlo Tree Search." *Computers and Games*. One of the first applications of MCTS to Go.
- **Browne et al. (2012)** -- "A Survey of Monte Carlo Tree Search Methods." *IEEE Transactions on CI and AI in Games*. The definitive survey covering variants, enhancements, and applications.
- **Silver et al. (2016)** -- "Mastering the game of Go with deep neural networks and tree search." *Nature*. AlphaGo: MCTS + deep learning defeats world champion.
- **Silver et al. (2017)** -- "Mastering the game of Go without human knowledge." *Nature*. AlphaZero: MCTS + self-play, no human games, surpassing AlphaGo.
