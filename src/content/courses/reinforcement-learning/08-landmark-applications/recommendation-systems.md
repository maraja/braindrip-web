# Recommendation Systems

**One-Line Summary**: Modeling user interaction as a sequential decision problem -- optimizing long-term engagement over immediate clicks.

**Prerequisites**: `what-is-reinforcement-learning.md`, `markov-decision-processes.md`, `q-learning.md`, `offline-reinforcement-learning.md`.

## What Is RL for Recommendation Systems?

Imagine a librarian who recommends books. A naive librarian suggests whatever is most likely to be checked out today (the supervised learning approach -- maximize immediate click-through). A wise librarian thinks further ahead: "If I recommend this challenging book now, the reader will develop broader tastes, leading to deeper engagement for years." This long-term thinking is exactly what RL brings to recommendation systems.

Traditional recommenders optimize for immediate metrics -- click-through rate, purchase probability, or rating prediction. But user engagement is a **sequential** process: today's recommendation shapes tomorrow's preferences. Recommending only popular items creates a filter bubble. Recommending only high-confidence items never surfaces new interests. RL frames recommendation as a sequential decision problem where the goal is to maximize long-term user satisfaction, not just the next click.

## How It Works

### The Recommendation MDP

The recommendation problem maps naturally to an MDP:

- **State**: User's interaction history, profile, context (time, device, session features)
- **Actions**: Items to recommend (or a ranked list/slate of items)
- **Reward**: User engagement signals (clicks, dwell time, purchases, ratings, return visits)
- **Transition**: User state evolves based on their interaction with the recommendation

$$s_{t+1} = f(s_t, a_t, \text{user\_response}_t)$$

The key challenge: the state space is enormous (all possible user histories), the action space is huge (millions of items), and the environment is non-stationary (user preferences drift).

### Slate Recommendation

Real recommenders present **slates** (ordered lists) of items, not single items. This creates a combinatorial action space: for $N$ items and slate size $k$, there are $\binom{N}{k} \cdot k!$ possible slates.

**SlateQ** (Ie et al., 2019) decomposes slate-level Q-values into item-level Q-values:

$$Q(s, \text{slate}) \approx g(Q(s, a_1), Q(s, a_2), \ldots, Q(s, a_k))$$

where $g$ is an aggregation function. This reduces the problem from exponential to linear in the catalog size.

### Session-Based RL

Within a single user session, the recommender adapts based on real-time feedback:

1. User arrives (initial state from history)
2. System recommends an item
3. User clicks (or skips) -- reward signal
4. System updates its belief about user intent
5. Next recommendation incorporates updated belief
6. Session ends when user leaves

This intra-session loop is naturally an RL problem with short episodes. DRN (Zheng et al., 2018) applied dueling DQN to news recommendation, treating each news session as an episode.

### Exploration for Recommendations

Exploration is critical but risky in recommender systems:

- **Exploitation**: Recommend items the system is confident the user will like (safe, but creates filter bubbles)
- **Exploration**: Recommend uncertain items to learn user preferences (risky, may drive users away)

The cost of exploration is asymmetric: a bad recommendation can cause a user to leave the platform. Approaches include:

- **Epsilon-greedy with safety constraints**: Explore only within "safe" item categories
- **Thompson sampling**: Maintain uncertainty over user preferences, sample optimistically
- **Contextual bandits**: Treat each recommendation as a bandit arm with contextual features
- **Upper confidence bound**: Recommend items with high uncertainty-adjusted predicted value

### Off-Policy Evaluation and Offline RL

Deploying a new RL-based recommender is risky -- you can't test it on real users without potentially degrading their experience. **Off-policy evaluation (OPE)** estimates how a new policy would perform using data collected by the old policy:

$$V(\pi_{\text{new}}) \approx \mathbb{E}_{(s, a, r) \sim \pi_{\text{old}}} \left[ \frac{\pi_{\text{new}}(a|s)}{\pi_{\text{old}}(a|s)} \cdot r \right]$$

This importance-sampling estimator is unbiased but high-variance when the new and old policies differ significantly. **Offline RL** methods (CQL, IQL) learn policies entirely from logged interaction data without environment access (see `offline-reinforcement-learning.md`).

### Production Architectures

Real-world RL recommenders typically use a two-stage architecture:

1. **Candidate generation**: Retrieve a manageable set (100-1000) from millions of items using embedding similarity or collaborative filtering
2. **RL ranking**: Apply the RL policy to rank/select from the candidate set

This keeps the RL action space tractable while leveraging the full catalog through the retrieval stage.

## Why It Matters

Recommendation systems generate enormous economic value -- Netflix estimates its recommender saves $1B/year in customer retention, and 35% of Amazon's revenue comes from recommendations. Even small improvements in recommendation quality have massive business impact.

RL addresses fundamental limitations of supervised recommenders: it can optimize for long-term engagement instead of immediate clicks, naturally handle the exploration-exploitation trade-off (discovering new user interests vs. exploiting known preferences), and adapt to user preference drift over time.

## Key Technical Details

- **YouTube** uses RL for video recommendation, optimizing for long-term watch time rather than immediate click probability (Chen et al., 2019). They report significant engagement improvements from the RL approach.
- **Spotify** uses contextual bandits for playlist personalization, with Thompson sampling for exploration.
- **Action space reduction**: For catalogs of millions of items, direct RL is intractable. Practical systems use embedding-based action representations, hierarchical actions (category then item), or candidate pre-filtering.
- **Reward design**: Clicks alone are a poor reward (clickbait scores high). Better rewards combine dwell time, explicit ratings, repeat visits, and subscription retention. Reward shaping is critical and domain-specific.
- **Non-stationarity**: User preferences, item catalogs, and trends change over time. RL policies must be periodically retrained or use continual learning approaches.
- **Delayed rewards**: The value of a recommendation may not be apparent for weeks (e.g., a book recommendation that builds reading habits). Long discount horizons ($\gamma$ close to 1) are needed but make learning harder.

## Common Misconceptions

- **"RL is better than supervised learning for all recommenders."** For simple, stateless recommendation tasks (e.g., "similar items"), supervised learning is simpler and often sufficient. RL shines when sequential dynamics and long-term outcomes matter.
- **"You need an RL simulator to train."** Offline RL methods train directly from logged interaction data. Building a realistic user simulator is extremely difficult and often unnecessary.
- **"Exploration means showing random items."** Good exploration in recommendations is targeted -- exploring items similar to what the user might like but hasn't been exposed to, not random catalog items.
- **"RL can solve the cold-start problem."** RL still needs data. For completely new users or items, contextual bandit approaches or meta-learning are more appropriate than full RL.

## Connections to Other Concepts

- `offline-reinforcement-learning.md` -- Most recommendation RL is trained on logged data.
- `exploration-vs-exploitation.md` -- The core trade-off in surfacing new vs. familiar content.
- `reward-shaping.md` -- Designing reward signals that capture long-term user satisfaction.
- `q-learning.md` -- DQN variants are commonly used for session-based recommendation.
- `meta-reinforcement-learning.md` -- Adapting quickly to new users mirrors few-shot task adaptation.

## Further Reading

1. **Ie et al. (2019)** -- "SlateQ: A Tractable Decomposition for Reinforcement Learning with Recommendation Sets." *IJCAI*. Decomposes slate-level Q-values for tractable RL recommendation.
2. **Chen et al. (2019)** -- "Top-K Off-Policy Correction for a REINFORCE Recommender System." *WSDM*. YouTube's production RL recommendation system.
3. **Zheng et al. (2018)** -- "DRN: A Deep Reinforcement Learning Framework for News Recommendation." *WWW*. Dueling DQN applied to news session recommendation.
4. **Afsar et al. (2022)** -- "Reinforcement Learning based Recommender Systems: A Survey and New Perspectives." *ACM Computing Surveys*. Comprehensive survey of RL for recommendations.
