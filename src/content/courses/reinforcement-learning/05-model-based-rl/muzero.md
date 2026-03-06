# MuZero

**One-Line Summary**: A planning algorithm that learns its own model of the environment -- predicting rewards, values, and policies in a latent space -- achieving superhuman performance across board games, Atari, and beyond, without ever being told the rules.

**Prerequisites**: `monte-carlo-tree-search.md`, `model-based-vs-model-free.md`, `world-models.md`, `../01-foundations/value-functions.md`

## What Is MuZero?

Imagine you are learning a card game you have never seen before. You do not know the rules -- you cannot look them up, and nobody explains them. But after playing hundreds of games, you develop an intuition: "If I play this card in this situation, something good usually happens next, the game feels like it is in a strong position, and the best follow-up moves are probably these." You have not learned the actual rules of the game. Instead, you have learned something arguably more useful: a **planning-relevant model** that predicts what matters for decision-making (rewards, values, good actions) without predicting the full game state.

MuZero (Schrittwieser et al., 2020) formalizes this idea. It combines the powerful MCTS planning of AlphaZero with a **learned model** that operates entirely in a latent space. Unlike AlphaZero, which requires a perfect simulator (the game rules), MuZero learns three neural networks that together enable planning without any knowledge of the environment's rules. Unlike world models that reconstruct observations, MuZero's model only predicts quantities directly relevant to planning: rewards, values, and policies.

## How It Works

### The Three Networks

MuZero learns three interconnected neural networks:

**1. Representation Network** $h_\theta$: Encodes a real observation (or stack of recent observations) into an initial latent state:

$$s^0 = h_\theta(o_1, o_2, \ldots, o_t)$$

This compresses the raw observation history into a latent representation suitable for planning. The representation is not trained to reconstruct observations -- it is trained end-to-end so that *planning in latent space produces good decisions*.

**2. Dynamics Network** $g_\theta$: Predicts the next latent state and immediate reward given a latent state and action:

$$s^{k+1}, r^k = g_\theta(s^k, a^{k+1})$$

This is the learned "physics engine" of the model. Crucially, $s^{k+1}$ is a latent state with no explicit correspondence to any real observation. It exists solely because it is useful for multi-step planning.

**3. Prediction Network** $f_\theta$: Produces a policy and value estimate from any latent state:

$$\mathbf{p}^k, v^k = f_\theta(s^k)$$

This is identical in function to AlphaZero's policy-value head, but it operates on learned latent states rather than known game states.

### Planning with MCTS in Latent Space

At decision time, MuZero runs MCTS using these three networks:

1. **Root encoding**: Convert the current real observation into a latent state $s^0 = h_\theta(o_t)$.
2. **Selection**: Traverse the tree using PUCT (see `monte-carlo-tree-search.md`), with $P(a|s)$ and $V(s)$ from the prediction network.
3. **Expansion**: At a leaf node at depth $k$, apply the dynamics network: $s^{k+1}, r^k = g_\theta(s^k, a^{k+1})$. Then evaluate the new state with the prediction network: $\mathbf{p}^{k+1}, v^{k+1} = f_\theta(s^{k+1})$.
4. **Backpropagation**: Update node statistics along the path using the predicted reward $r^k$ and value $v^{k+1}$.

After a fixed number of simulations (typically 50 for Atari, 800 for board games), the most-visited root action is selected.

### Training: Learning to Plan

MuZero trains on trajectories stored in a replay buffer. For each sampled trajectory, the model unrolls $K$ hypothetical steps (typically $K = 5$) from each real state and is trained on three losses:

**Policy loss**: The predicted policy at each unrolled step $k$ should match the MCTS policy computed during data collection:

$$\ell_p = -\sum_a \pi_{\text{MCTS}}^k(a) \ln p^k(a)$$

**Value loss**: The predicted value should match a bootstrapped target combining real rewards and the MCTS value at the end of the unrolled sequence:

$$\ell_v = \left( v^k - z^k \right)^2 \quad \text{where } z^k = \sum_{i=0}^{n-1} \gamma^i r_{t+k+i} + \gamma^n v_{\text{MCTS}}^{t+k+n}$$

**Reward loss**: The predicted reward should match the actual observed reward:

$$\ell_r = \left( r^k - r_{t+k} \right)^2$$

The total loss, summed over all $K$ unrolled steps, is:

$$\mathcal{L} = \sum_{k=0}^{K} \left[ \ell_p^k + \ell_v^k + \ell_r^k \right]$$

Gradients flow through the dynamics network across all $K$ steps, training the latent space to support accurate multi-step planning.

### How MuZero Differs from AlphaZero

| Component | AlphaZero | MuZero |
|---|---|---|
| Model | Perfect simulator (known rules) | Learned dynamics network |
| State representation | Ground truth game state | Learned latent representation |
| Applicability | Perfect-information games | Any sequential domain |
| Observation decoding | Not needed | Not needed (latent-only) |
| Reward prediction | From simulator | Learned reward network |

The critical difference is that MuZero does not need the rules. AlphaZero calls the game engine to simulate moves; MuZero calls its own learned dynamics network. This makes MuZero applicable to environments where the rules are unknown -- including Atari games played from raw pixels.

## Why It Matters

MuZero demonstrated that an agent can achieve superhuman performance across fundamentally different domains -- Go, chess, shogi, and 57 Atari games -- using a single algorithm with a learned model. This bridges two previously separate achievements: AlphaZero's superhuman game play (which required known rules) and model-free Atari agents like R2D2 (which did not plan). MuZero's latent planning approach showed that explicit observation reconstruction is unnecessary for effective model-based RL, influencing subsequent work on world models, decision transformers, and planning-based agents.

## Key Technical Details

- MuZero uses 800 MCTS simulations per move in board games, 50 simulations in Atari. Even with just 50 simulations, the search significantly improves over the raw policy network.
- The unroll depth during training is $K = 5$ steps. Deeper unrolls were not found to improve performance, likely due to compounding latent-space errors.
- For Atari, MuZero uses a stack of the 32 most recent observations as input to the representation network, providing temporal context.
- MuZero achieved a new state of the art on the Atari benchmark, surpassing both model-free (R2D2) and prior model-based methods, while simultaneously matching AlphaZero on board games.
- **MuZero Reanalyze** (Schrittwieser et al., 2021) further improves sample efficiency by re-running MCTS on old trajectories with the current (improved) model, producing fresher training targets without additional environment interaction.
- The latent state has no explicit semantic meaning -- it is whatever representation makes planning work. This is learned entirely through the planning-relevant losses.
- Training MuZero for board games required approximately 1,000 TPUs over several days. For Atari, training used 8 TPUs for approximately 12 hours per game.

## Common Misconceptions

**"MuZero learns the rules of the game."** MuZero never learns explicit transition rules. It learns to predict what matters for planning -- rewards, values, and policies -- from latent states. The dynamics network produces abstract latent states, not interpretable game states.

**"MuZero's latent states must correspond to real states."** There is no reconstruction loss and no constraint that latent states resemble real observations. The latent space is shaped purely by the planning losses. Two very different real states could map to similar latent states if they require similar planning.

**"MuZero replaces model-free methods everywhere."** MuZero's computational cost per decision is significantly higher than model-free methods due to the MCTS planning. For applications requiring fast real-time decisions (sub-millisecond), model-free policies evaluated in a single forward pass remain preferable.

**"The dynamics model must be accurate for many steps."** MuZero trains with only $K = 5$ unrolled steps, and MCTS corrects for model imperfections through its search. Short-horizon model accuracy is sufficient because the value network provides a "shortcut" for estimating long-term consequences.

## Connections to Other Concepts

- `monte-carlo-tree-search.md` -- MuZero's planning engine. Understanding MCTS and PUCT is essential.
- `world-models.md` -- An alternative latent-space model-based approach. Dreamer uses actor-critic in imagination; MuZero uses MCTS.
- `model-based-vs-model-free.md` -- MuZero is the ultimate hybrid: a learned model (model-based) training a value function and policy (model-free components).
- `dyna-architecture.md` -- MuZero can be viewed as a sophisticated Dyna system where "planning" is MCTS rather than random sampling.
- `planning-with-learned-models.md` -- Alternative planning strategies (MPC, CEM) that use learned models differently.

## Further Reading

- **Schrittwieser et al. (2020)** -- "Mastering Atari, Go, Chess and Shogi by Planning with a Learned Model." *Nature*. The MuZero paper demonstrating superhuman performance across domains without known rules.
- **Silver et al. (2017)** -- "Mastering the game of Go without human knowledge." *Nature*. AlphaZero, MuZero's predecessor requiring known game rules.
- **Schrittwieser et al. (2021)** -- "Online and Offline Reinforcement Learning by Planning with a Learned Model." *NeurIPS*. MuZero Reanalyze: improving sample efficiency by recomputing targets.
- **Ye et al. (2021)** -- "Mastering Atari Games with Limited Data." *NeurIPS*. EfficientZero: MuZero with self-supervised consistency, achieving superhuman Atari performance with just 2 hours of data.
- **Hubert et al. (2021)** -- "Learning and Planning in Complex Action Spaces." *ICML*. Sampled MuZero: extending MuZero to large and continuous action spaces.
