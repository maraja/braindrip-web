# RL in Production

**One-Line Summary**: The engineering challenges of deploying RL systems: safety constraints, evaluation, monitoring, and the sim-to-real gap.

**Prerequisites**: `what-is-reinforcement-learning.md`, `offline-reinforcement-learning.md`, `reward-shaping.md`.

## What Is RL in Production?

Imagine the difference between a self-driving car that works perfectly in simulation and one you'd actually ride in. The simulation car can crash a million times during training at zero cost. The real car cannot crash once. This gap between RL in research and RL in production is enormous, and it's why the vast majority of RL success stories come from games and simulations, not deployed systems.

RL in production means deploying RL policies in real-world systems where actions have consequences: financial losses, user churn, equipment damage, or safety incidents. It requires solving problems that research papers rarely address: how to evaluate a policy before deployment, how to ensure safety during exploration, how to monitor for degradation, and how to know when RL is the wrong tool entirely.

## How It Works

### The Production RL Pipeline

A production RL system involves far more than training an agent:

```
[Offline Data] → [Simulator/Model] → [Policy Training] → [Off-Policy Evaluation]
       ↓                                        ↓
[Safety Validation] → [Canary Deployment] → [Full Deployment] → [Monitoring]
       ↑                                                              ↓
       ←←←←←←←←←←←←← [Rollback / Retrain] ←←←←←←←←←←←←←←←←←←←←←←←
```

Each stage introduces engineering challenges absent from research:

### Off-Policy Evaluation (OPE)

Before deploying a new policy, estimate its performance using historical data collected by the current policy:

**Importance Sampling (IS)**:

$$\hat{V}(\pi_{\text{new}}) = \frac{1}{N} \sum_{i=1}^{N} \prod_{t=0}^{T_i} \frac{\pi_{\text{new}}(a_t^{(i)}|s_t^{(i)})}{\pi_{\text{old}}(a_t^{(i)}|s_t^{(i)})} \cdot G_i$$

The product of importance ratios causes exponential variance over long horizons, making IS unreliable for long episodes.

**Doubly Robust (DR) estimator**: Combines IS with a value function estimate to reduce variance:

$$\hat{V}_{\text{DR}} = \hat{V}_{\text{model}} + \text{IS correction for model error}$$

**Fitted Q Evaluation (FQE)**: Train a Q-function on historical data under the new policy, then evaluate. More stable than IS for long horizons but introduces function approximation bias.

**Practical guidance**: Use multiple OPE methods and check agreement. Large disagreements signal that the evaluation is unreliable. OPE cannot replace online A/B testing but can filter out clearly bad policies.

### Safety Constraints

Production RL must operate within hard constraints:

**Action masking**: Prevent the agent from taking dangerous actions by setting their probability to zero:

$$\pi_{\text{safe}}(a|s) = \begin{cases} 0 & \text{if } a \in \mathcal{A}_{\text{unsafe}}(s) \\ \frac{\pi(a|s)}{\sum_{a' \notin \mathcal{A}_{\text{unsafe}}} \pi(a'|s)} & \text{otherwise} \end{cases}$$

**Constrained MDPs (CMDPs)**: Optimize the primary objective subject to constraint budgets:

$$\max_\pi J(\pi) \quad \text{s.t.} \quad C_i(\pi) \leq d_i, \quad i = 1, \ldots, m$$

where $C_i$ are cost functions (e.g., safety violations, latency, resource usage) and $d_i$ are thresholds.

**Safe fallback**: Always maintain a fallback policy (the current production policy or a conservative rule-based policy). If the RL agent's confidence drops below a threshold or its actions are flagged, defer to the fallback.

**Human-in-the-loop**: For high-stakes domains, require human approval for actions outside a pre-approved envelope. The RL agent suggests actions; humans approve or override.

### Reward Specification

Reward design is the most common failure mode in production RL:

- **Proxy rewards**: The metric you can measure (clicks, revenue) is a proxy for what you actually want (user satisfaction, long-term value). Optimizing the proxy leads to Goodhart's Law failures.
- **Reward hacking**: RL agents exploit unintended shortcuts. A recommender optimizing engagement might learn to show inflammatory content. A cooling controller might find a loophole that technically reduces PUE but stresses equipment.
- **Multi-objective rewards**: Production systems balance competing objectives (cost vs. quality, latency vs. throughput). Reward weights must be carefully tuned and regularly validated.

**Best practice**: Start with simple, well-understood rewards. Monitor a broader set of metrics beyond the reward signal. Include safety metrics that trigger automatic policy rollback if violated.

### Monitoring and Drift Detection

Deployed RL systems can degrade silently:

- **Distribution shift**: The environment changes (new user behaviors, market conditions, seasonal effects), but the policy was trained on old data.
- **Reward drift**: The relationship between the proxy reward and the true objective changes.
- **Performance degradation**: Gradual decline that triggers retraining or rollback.

**Monitoring signals**:
- Policy action distributions (sudden shifts indicate something changed)
- Reward moving averages and percentiles
- State distribution overlap between training and production data
- Value function prediction error (if the critic's predictions diverge from observed returns)
- Business metrics that the RL system indirectly affects

### Canary Deployment and A/B Testing

Deploy new policies gradually:

1. **Shadow mode**: Run the new policy alongside the old one, logging what it *would* do, without acting
2. **Canary**: Deploy to 1-5% of traffic, monitor all metrics
3. **Gradual rollout**: Increase traffic over days/weeks if metrics are stable
4. **Full deployment**: 100% traffic with continuous monitoring

A/B testing RL policies is harder than A/B testing static features because RL policies create feedback loops: the policy influences the data it sees, which influences future policy behavior. Long evaluation windows (weeks, not hours) are often necessary.

### When Not to Use RL

RL is the wrong choice when:

- **The problem is stateless or single-step**: Use supervised learning or contextual bandits instead.
- **The reward is unclear or unmeasurable**: If you can't define what good looks like, RL will optimize something you don't want.
- **The action space is trivially small**: A rule-based system or exhaustive search is simpler and more predictable.
- **Safety is paramount and exploration is unacceptable**: Use offline RL or imitation learning from expert demonstrations.
- **The environment is fully deterministic with known dynamics**: Use classical optimization (LP, MIP, dynamic programming).

## Why It Matters

The gap between RL research and production is the primary bottleneck preventing broader RL adoption. Thousands of RL papers are published annually, but deployed RL systems remain rare outside of a few domains (recommendation, data center management, game AI). Closing this gap requires engineering discipline: rigorous evaluation, safety constraints, monitoring, and organizational readiness to handle the complexity of adaptive systems.

The organizations that have successfully deployed RL (Google, Netflix, Spotify, ByteDance) report significant business value, but also emphasize that deployment engineering consumed far more effort than algorithm development.

## Key Technical Details

- **OPE reliability**: Thomas & Brunskill (2016) showed that IS-based estimators with safety guarantees (high-confidence off-policy evaluation) can provide statistical assurance that a new policy improves over the baseline with probability $\geq 1 - \delta$.
- **Retraining cadence**: Production RL systems typically retrain on fresh data weekly to monthly, depending on environment non-stationarity. Continuous learning is possible but introduces additional stability risks.
- **Fallback activation**: Best practice is to trigger fallback when any of: (1) reward drops below 2 standard deviations of the baseline mean, (2) a safety constraint is violated, (3) the state distribution diverges significantly from training data (measured by KL divergence or MMD).
- **Latency requirements**: Production RL policies must make decisions within milliseconds (recommendations) to seconds (cooling control). Complex planning methods (MCTS) may be too slow; amortized policies (neural networks) are preferred.
- **Organizational readiness**: Deploying RL requires buy-in from multiple teams (ML engineering, domain experts, operations, product). Lack of explainability is a common organizational barrier.

## Common Misconceptions

- **"If RL works in simulation, it will work in production."** The sim-to-real gap encompasses model inaccuracy, unmodeled dynamics, distributional shift, and the absence of safety constraints. Simulation results are necessary but not sufficient.
- **"Online A/B testing is enough for evaluation."** Online testing is expensive and risky. OPE should filter out bad policies before any live testing. A bad RL policy deployed to even 1% of users can cause significant damage.
- **"RL is always better than rule-based systems."** For well-understood problems with stable dynamics, rule-based systems are simpler, more predictable, more explainable, and easier to maintain. RL should be used when the complexity of the optimization exceeds human design capacity.
- **"You need a simulator to deploy RL."** Offline RL trains directly from logged data. However, a simulator is extremely valuable for safe exploration and policy iteration.

## Connections to Other Concepts

- `offline-reinforcement-learning.md` -- Most production RL starts with offline training from logged data.
- `reward-shaping.md` -- Reward specification is the most critical and error-prone step.
- `exploration-vs-exploitation.md` -- Production exploration must be safe and bounded.
- `resource-optimization.md` -- The domain with the most successful production RL deployments.
- `recommendation-systems.md` -- The largest-scale production RL application by user reach.

## Further Reading

1. **Dulac-Arnold et al. (2021)** -- "Challenges of Real-World Reinforcement Learning." *JMLR*. Comprehensive taxonomy of 9 challenges for deploying RL in production systems.
2. **Thomas & Brunskill (2016)** -- "Data-Efficient Off-Policy Policy Evaluation for Reinforcement Learning." *ICML*. High-confidence OPE with safety guarantees.
3. **Levine et al. (2020)** -- "Offline Reinforcement Learning: Tutorial, Review, and Perspectives on Open Problems." *arXiv*. Foundational perspective on RL without online interaction.
4. **Matsushima et al. (2021)** -- "Deployment-Efficient Reinforcement Learning via Model-Based Offline Optimization." *ICLR*. Minimizing the number of deployment rounds needed.
5. **Google (2018)** -- "Safety-first AI for autonomous data centre cooling and industrial control." *DeepMind Blog*. Practical lessons from deploying RL in Google's data centers.
