# AlphaGo and Board Games

**One-Line Summary**: From AlphaGo to AlphaZero: defeating world champions in Go, Chess, and Shogi through self-play and Monte Carlo Tree Search.

**Prerequisites**: `monte-carlo-tree-search.md`, `deep-q-networks.md`, `policy-gradient-theorem.md`, `value-functions.md`, `muzero.md`

## What Is the AlphaGo Line of Work?

Imagine a game so complex that there are more possible board positions ($\sim 2 \times 10^{170}$) than atoms in the observable universe ($\sim 10^{80}$). For decades, the ancient game of Go was considered the "grand challenge" of AI because its enormous branching factor ($\sim 250$ legal moves per position vs. $\sim 35$ in chess) rendered brute-force search hopeless. In March 2016, DeepMind's AlphaGo defeated 18-time world champion Lee Sedol 4--1 in a five-game match watched by over 200 million people. It was a watershed moment not just for RL, but for artificial intelligence as a field.

What followed was even more remarkable. AlphaGo Zero (2017) surpassed the original AlphaGo *without using any human game data*, learning entirely through self-play. AlphaZero (2018) generalized the approach to chess and shogi, defeating the strongest existing programs in each game within hours of training. The progression from "learning from human experts" to "learning from scratch" to "generalizing across games" is one of the most elegant arcs in AI research.

## How It Works

### AlphaGo (2016): Human Data + RL + MCTS

AlphaGo combined four components:

1. **Supervised learning policy network** $p_\sigma(a|s)$: A 13-layer CNN trained on 30 million positions from expert human games on the KGS Go server, achieving 57% accuracy in predicting expert moves.

2. **RL-refined policy network** $p_\rho(a|s)$: The supervised network was further trained via self-play using REINFORCE (`reinforce.md`), playing against random previous versions of itself. This improved the win rate against the supervised network from 50% to 80%.

3. **Value network** $v_\theta(s)$: A neural network trained to predict the outcome (win/loss) from position $s$, using 30 million positions generated from self-play. This estimates:

$$v_\theta(s) \approx \mathbb{E}[z | s, \pi]$$

where $z \in \{-1, +1\}$ is the game outcome.

4. **Monte Carlo Tree Search** (see `monte-carlo-tree-search.md`): During play, MCTS combines the policy and value networks to search the game tree. Each edge $(s, a)$ in the tree stores:

$$Q(s, a) = \frac{1}{N(s,a)} \sum_{i=1}^{N(s,a)} V(s_L^i)$$

where $V(s_L)$ is a weighted combination of the value network output and rollout outcome. Actions are selected using the PUCT formula:

$$a_t = \arg\max_a \left[ Q(s, a) + c_{puct} \cdot P(s, a) \cdot \frac{\sqrt{\sum_b N(s,b)}}{1 + N(s, a)} \right]$$

where $P(s, a)$ comes from the policy network and guides the search toward promising moves.

### AlphaGo Zero (2017): No Human Data

AlphaGo Zero made three fundamental simplifications:

1. **No human data**: Training started from random weights and used only self-play.
2. **Single network**: One network with two heads -- a policy head $\mathbf{p} = f_\theta^p(s)$ and a value head $v = f_\theta^v(s)$ -- replaced the separate policy and value networks.
3. **No rollouts**: The value head replaced Monte Carlo rollouts entirely, making search faster.

The training loop is elegant: the network plays games against itself using MCTS, then trains on the resulting data to better predict the MCTS-improved policy and the game outcome:

$$L(\theta) = (z - v_\theta(s))^2 - \boldsymbol{\pi}^\top \log \mathbf{p}_\theta(s) + c \|\theta\|^2$$

where $z$ is the actual game outcome and $\boldsymbol{\pi}$ is the MCTS visit-count distribution. After just 3 days and 4.9 million self-play games, AlphaGo Zero surpassed the version that defeated Lee Sedol. After 40 days, it surpassed all previous versions with an Elo rating over 5,000.

### AlphaZero (2018): Generalization Across Games

AlphaZero applied the same algorithm to Go, chess, and shogi with minimal game-specific modification. Key differences from AlphaGo Zero:

- Draws are handled (chess and shogi have draws; Go does not)
- The network uses the same architecture across all three games
- No data augmentation exploiting Go's rotational symmetry

AlphaZero defeated Stockfish (chess, rated ~3,400 Elo) 155--6 in 1,000 games, Elmo (shogi) 91.2--8.8, and the previous AlphaGo Zero in Go. In chess, it discovered opening variations and positional concepts that surprised grandmasters, demonstrating genuine strategic creativity.

### Move 37: Machine Creativity

In Game 2 against Lee Sedol, AlphaGo played a move on the 37th turn -- a shoulder hit on the fifth line -- that no human expert had considered. Professional commentators initially called it a mistake. It won the game. AlphaGo's policy network assigned this move a prior probability of only $\sim 0.003$, but MCTS search recognized its long-term strategic value. Move 37 became emblematic of RL systems discovering strategies beyond human intuition.

## Why It Matters

The AlphaGo line of work demonstrated three progressively stronger claims: (1) RL combined with deep learning and search can defeat humans at tasks once thought to require human intuition; (2) human knowledge is not necessary -- self-play from scratch can surpass human-guided training; (3) the same algorithm can master qualitatively different games without domain-specific engineering. These results reshaped expectations about what RL could achieve and directly influenced subsequent work on RL for language model training (see `rlhf-pipeline.md`) and scientific discovery.

## Key Technical Details

- **AlphaGo computational cost**: Distributed across 1,920 CPUs and 280 GPUs for match play; the policy network trained on 50 GPUs for 3 weeks.
- **AlphaGo Zero**: Trained on 4 TPUs for 3 days to surpass Lee Sedol version; 40 days on 4 TPUs for maximum strength.
- **AlphaZero chess training**: 9 hours on 5,000 first-generation TPUs (approximately 44 million self-play games).
- **MCTS simulations per move**: AlphaGo used ~10,000 simulations per move; AlphaZero used 800 simulations in chess.
- **Network architecture**: AlphaZero uses a 20-block ResNet (40 convolutional layers) with 256 filters per layer.
- **Self-play data generation**: AlphaZero generates data continuously with the latest network, using a window of the most recent 500,000 games for training.
- **Temperature parameter**: For the first 30 moves, actions are sampled proportionally to visit counts ($\tau = 1$); after that, the most-visited move is selected ($\tau \to 0$).
- **Elo ratings**: AlphaZero chess achieved ~3,600 Elo (estimated), far beyond any human (~2,882 for Magnus Carlsen at peak).

## Common Misconceptions

**"AlphaGo won because of superior brute-force computation."** AlphaGo searched approximately $10^4$ positions per move. The 1997 Deep Blue searched $2 \times 10^8$ positions per move in chess. AlphaGo's advantage was *intelligent* search guided by neural networks, not computational brute force.

**"AlphaZero proves RL does not need human data."** AlphaZero works in perfect-information, deterministic, two-player, zero-sum games with known rules. Removing human data is feasible precisely because self-play provides an infinite, perfectly labeled training signal. In partial-information, stochastic, or open-ended environments, bootstrapping from human data remains essential.

**"AlphaZero's chess play is incomprehensible to humans."** Grandmasters analyzing AlphaZero's games found its play highly instructive -- favoring piece activity and long-term positional factors over material. The games are not mysterious; they revealed strategic principles humans had underweighted.

**"MCTS alone would suffice with enough computation."** Without the neural network's policy prior to guide search, MCTS devolves into near-random exploration of the game tree. The policy network focuses search on promising branches, and the value network provides accurate position evaluations without full rollouts. The synergy is essential.

## Connections to Other Concepts

- `monte-carlo-tree-search.md` -- The planning algorithm at the core of all AlphaGo variants, combining exploration with neural network guidance.
- `muzero.md` -- The successor that learns the dynamics model rather than relying on known game rules, extending AlphaZero to environments without a perfect simulator.
- `policy-gradient-theorem.md` -- REINFORCE was used to refine AlphaGo's policy network through self-play.
- `value-functions.md` -- The value network provides position evaluation, replacing hand-crafted evaluation functions.
- `atari-and-arcade-games.md` -- DQN preceded AlphaGo and demonstrated deep RL's potential, but AlphaGo demonstrated it on a far harder task.
- `multi-agent-reinforcement-learning.md` -- Self-play is a form of multi-agent training where the agent is both player and opponent.
- `model-based-vs-model-free.md` -- AlphaGo is model-based: it uses the known game rules as a perfect model for MCTS planning.

## Further Reading

- **Silver et al. (2016), "Mastering the game of Go with deep neural networks and tree search," *Nature*, 529** -- The original AlphaGo paper. Describes the four-component system and the match preparation.
- **Silver et al. (2017), "Mastering the game of Go without human knowledge," *Nature*, 550** -- AlphaGo Zero: superhuman Go from pure self-play, eliminating human data entirely.
- **Silver et al. (2018), "A general reinforcement learning algorithm that masters chess, shogi, and Go through self-play," *Science*, 362** -- AlphaZero: one algorithm for three games, demonstrating the generality of the approach.
- **Schrittwieser et al. (2020), "Mastering Atari, Go, chess and shogi by planning with a learned model," *Nature*, 588** -- MuZero: extending AlphaZero to environments without known rules by learning a dynamics model.
- **Sutton (2019), "The Bitter Lesson"** -- An influential essay arguing that general methods leveraging computation (like AlphaZero's search + learning) consistently outperform human-knowledge-heavy approaches.
