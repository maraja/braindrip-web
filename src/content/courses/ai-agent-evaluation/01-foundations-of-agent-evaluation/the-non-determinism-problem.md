# The Non-Determinism Problem

**One-Line Summary**: Agent evaluation must account for inherent randomness from LLM sampling, stochastic tool responses, and environment variability -- requiring multiple runs, confidence intervals, and specialized metrics like pass^k to produce reliable results.

**Prerequisites**: `why-agent-evaluation-is-hard.md`

## What Is the Non-Determinism Problem?

Imagine flipping a coin to decide whether your software works. You flip once, it lands heads, and you declare the software functional. Obviously absurd -- but this is essentially what single-run agent evaluation does. When an agent's behavior varies across runs due to inherent randomness, a single evaluation tells you what happened once, not what will typically happen.

The non-determinism problem is the recognition that AI agents are stochastic systems. Unlike traditional software, where the same input produces the same output, agents may succeed on one run and fail on the next with identical inputs. This is not a bug -- it is a fundamental property of systems built on probabilistic language models operating in dynamic environments.

This property has profound implications for how we evaluate agents. Statistical methods borrowed from clinical trials and A/B testing become necessary. Single-number benchmarks become unreliable. And the cost of evaluation increases substantially because you must run each task multiple times to get a stable signal.

## How It Works

### Sources of Non-Determinism

#### 1. LLM Sampling Temperature

The most direct source. At temperature $T > 0$, the LLM samples from its output distribution rather than always selecting the highest-probability token. Even at temperature 0, GPU floating-point operations are not perfectly deterministic -- different hardware, batching configurations, and parallelization strategies can produce different outputs. In practice, exact reproducibility of LLM outputs requires identical hardware, software versions, and execution ordering, which is rarely guaranteed.

#### 2. Stochastic Tool Responses

External tools introduce their own randomness:
- **Web search**: Results change based on time, location, and personalization
- **API calls**: Rate limiting, load balancing, and backend updates alter responses
- **Code execution**: Timing-dependent operations, random seeds, and concurrent processes affect outcomes
- **Database queries**: Data changes between runs; eventual consistency means different reads at different times

#### 3. Environment Variability

The execution environment itself is not static:
- File systems accumulate changes from previous runs if not properly reset
- Network conditions affect API latency and timeout behavior
- System load influences execution timing, which can affect agents that use timeouts or retries
- Package versions may update between evaluation runs

#### 4. Cascading Divergence

A small difference at step 1 can produce completely different trajectories by step 10. If the agent's first tool call returns slightly different results, the subsequent plan may diverge entirely. This butterfly effect means that even tiny sources of randomness get amplified through the agent's decision-making chain.

### Statistical Implications

#### Multi-Run Evaluation Is Mandatory

The tau-bench benchmark (Yao et al., 2024) demonstrated this dramatically. They measured agent performance across multiple runs and found:

| Metric | Single Run | 5 Runs (mean) | 5 Runs (std dev) |
|--------|-----------|---------------|------------------|
| Agent A pass rate | 62% | 54% | 8.2% |
| Agent B pass rate | 48% | 51% | 5.1% |

A single run suggested Agent A was significantly better. Multiple runs revealed they were comparable, with Agent A being less consistent. Single-run evaluation would have led to the wrong deployment decision.

#### Confidence Intervals

For a binary pass/fail metric with $n$ runs and $k$ successes, the estimated pass rate $\hat{p} = k/n$ has a confidence interval. Using the Wilson score interval:

$$\hat{p} \pm z \sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}$$

For $n = 5$ runs with $k = 3$ successes ($\hat{p} = 0.60$), the 95% confidence interval is approximately [0.23, 0.88]. This is enormous. With $n = 30$ runs and $k = 18$ successes, it narrows to [0.42, 0.76]. Reliable evaluation requires substantial sample sizes.

#### The pass^k Metric

Introduced in tau-bench, pass^k measures the probability that the agent succeeds on all $k$ consecutive runs of the same task:

$$\text{pass}^k = \left(\frac{c}{n}\right)^k$$

where $c$ is successes out of $n$ total runs. This metric is stricter than pass@k (at least one success in $k$ tries) and captures reliability rather than best-case performance. For an agent with 80% single-run pass rate:

| $k$ | pass@k | pass^k |
|-----|--------|--------|
| 1 | 0.80 | 0.80 |
| 3 | 0.99 | 0.51 |
| 5 | ~1.00 | 0.33 |
| 10 | ~1.00 | 0.11 |

pass^k reveals that an agent with 80% reliability fails to deliver consistent performance in repeated use -- a critical insight for production deployment.

### How Many Runs to Perform

The required number of runs depends on desired precision:

| Desired CI Width | Required Runs (approximate) | Cost Multiplier |
|-----------------|-----------------------------|-----------------|
| +/- 20% | 5-10 | 5-10x |
| +/- 10% | 25-50 | 25-50x |
| +/- 5% | 100-200 | 100-200x |
| +/- 2% | 500+ | 500x+ |

**Practical guidance**: For development iteration, 3-5 runs per task provide enough signal to detect large improvements. For benchmark publication, 10-30 runs is the emerging standard. For production deployment decisions, run counts should be informed by the cost of false positives (deploying a bad agent) versus false negatives (rejecting a good one).

#### Stratified Sampling

Not all tasks need equal runs. A cost-effective strategy:
1. Run each task once to identify high-variance tasks (those near 50% pass rate)
2. Allocate additional runs to high-variance tasks where more data will most reduce uncertainty
3. Keep low-variance tasks (those that always pass or always fail) at fewer runs

## Why It Matters

1. **Single-run benchmarks are unreliable.** Publishing or acting on a single evaluation run is equivalent to reporting a clinical trial with one patient. The result may be correct but provides no statistical confidence.
2. **Agent comparison requires statistical rigor.** Claiming Agent A is better than Agent B requires that the difference exceeds statistical noise. With high-variance agents, a 5% difference in pass rate may not be meaningful.
3. **Production reliability demands consistency measurement.** Users do not experience average performance -- they experience individual runs. An agent with 80% average accuracy but 30% variance delivers a frustrating and unpredictable experience.
4. **Evaluation cost scales linearly with runs.** Multi-run evaluation is expensive. Understanding the non-determinism problem helps teams allocate their evaluation budget efficiently by focusing runs where they provide the most signal.

## Key Technical Details

- Temperature 0 does not guarantee determinism: GPU floating-point non-determinism can still produce different outputs, especially with large batch sizes or tensor parallelism
- tau-bench recommends a minimum of 5 runs per task for development and 10+ for publication
- The coefficient of variation (standard deviation / mean) across runs is a useful summary statistic for agent reliability
- Variance tends to be higher for tasks near the agent's capability boundary -- tasks that are clearly too easy or too hard show low variance
- Environment reset between runs is critical: improperly isolated runs can produce artificially correlated results

## Common Misconceptions

**"Setting temperature to 0 makes evaluation deterministic."** Temperature 0 eliminates sampling randomness but not GPU non-determinism, tool response variability, or environment changes. End-to-end determinism in agent evaluation is practically unattainable without heroic isolation efforts.

**"More runs always helps."** Beyond a certain point, additional runs provide diminishing returns. The confidence interval narrows as $1/\sqrt{n}$, so going from 10 to 100 runs (10x cost) only narrows the interval by ~3x. The right number of runs is a cost-precision tradeoff, not "as many as possible."

**"High variance means the agent is bad."** Some variance is inherent and acceptable. An agent with 85% mean accuracy and 5% standard deviation is well-characterized and predictable. Variance becomes problematic when it makes the agent's behavior unpredictable for users or makes evaluation unreliable for developers.

**"pass@k is the right metric for production."** pass@k (at least one success in $k$ tries) measures best-case performance with retries. For user-facing systems where the agent runs once per request, pass^k or simple pass rate is more relevant. pass@k is appropriate when the system includes automatic retry logic.

## Connections to Other Concepts

- `why-agent-evaluation-is-hard.md` -- non-determinism is one of the six fundamental challenges
- `compounding-errors-in-multi-step-tasks.md` -- non-determinism at each step compounds across the trajectory
- `evaluation-dimensions-taxonomy.md` -- reliability/consistency is a first-class evaluation dimension
- `evaluation-driven-development.md` -- practical workflows must account for evaluation noise
- `../05-statistical-methods-for-evaluation/confidence-intervals-for-agent-metrics.md` -- detailed statistical methodology
- `../05-statistical-methods-for-evaluation/pass-at-k-and-related-metrics.md` -- formal treatment of pass@k and pass^k

## Further Reading

- "tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains" -- Yao et al., 2024
- "Is Your LLM Secretly a World Model of the Internet? Model-Based Planning for Web Agents" -- Guan et al., 2024
- "Statistical Methods for Evaluating Non-Deterministic AI Systems" -- Technical Report, 2024
- "On the Reproducibility of Large Language Model Evaluations" -- Chen et al., 2024
- "How Many Runs? A Statistical Framework for Benchmark Reliability" -- Workshop Paper, 2024
