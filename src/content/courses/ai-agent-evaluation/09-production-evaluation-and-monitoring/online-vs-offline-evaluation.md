# Online vs Offline Evaluation

**One-Line Summary**: Offline evaluation tests agents against fixed datasets before deployment for reproducibility, while online evaluation assesses agents on live traffic under production conditions -- and a complete evaluation strategy requires both.

**Prerequisites**: `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md`, `../03-automated-evaluation-methods/agent-as-judge.md`, `../05-statistical-methods-for-evaluation/sample-size-and-power-analysis.md`

## What Is Online vs Offline Evaluation?

Think of it like testing a new hire. Offline evaluation is the interview process: standardized questions, controlled conditions, a quiet conference room. You learn a lot, but you cannot fully predict how the candidate will perform in the chaos of actual work. Online evaluation is the probationary period: the employee handles real tasks, interacts with real customers, and encounters situations no interview could anticipate. Neither alone gives the full picture.

Offline evaluation runs agents against pre-collected, fixed datasets in a controlled environment before deployment. Inputs, expected outputs, and environmental conditions are known and reproducible. You can run the same evaluation hundreds of times, compare results across model versions, and catch regressions with high confidence. The limitation is that no fixed dataset perfectly represents the ever-shifting landscape of production traffic.

Online evaluation assesses agents on live user requests under real production conditions. It captures distribution shift, genuine user interaction patterns, edge cases that no dataset designer anticipated, and the true latency and cost profile of the system. The tradeoff is that mistakes affect real users, experiments are expensive to run, and results are harder to reproduce.

## How It Works

### Offline Evaluation

Offline evaluation pipelines typically follow a standardized pattern. A curated dataset of input-output pairs (or input-trajectory pairs for agentic systems) is maintained in version control. Each candidate agent version runs against this dataset in a sandboxed environment with mocked or recorded external dependencies. Results are scored by automated metrics, LLM-as-judge evaluators, or both, and compared against baseline scores.

The key properties of offline evaluation are reproducibility (same inputs every time), speed (no waiting for real users), safety (failures affect no one), and cost control (you choose exactly how many evaluations to run). A typical offline suite for an agent system might include 200-500 curated test cases spanning common scenarios, edge cases, and known failure modes, with evaluation completing in 10-30 minutes on parallel infrastructure.

### Online Evaluation

Online evaluation instruments the production system to assess quality on live traffic. This can take several forms: sampling a percentage of interactions for automated scoring, running A/B tests between agent versions (see `a-b-testing-for-agents.md`), tracking implicit quality signals from user behavior (see `user-feedback-as-evaluation-signal.md`), or deploying LLM-as-judge evaluators on production conversations.

The key advantage is ecological validity -- you are measuring exactly the thing you care about. A 2024 LangChain survey of AI engineering practitioners found that only 37.3% of teams run online evaluations, meaning the majority of deployed agents operate without systematic production quality assessment. This gap is one of the largest risks in production AI systems.

### What Each Approach Catches

Offline evaluation excels at catching regressions -- if a model update breaks a capability that previously worked, offline tests surface this before any user is affected. It also catches systematic errors (e.g., the agent consistently fails at date parsing) and provides quick feedback during development iteration.

Online evaluation catches a different class of problems. Distribution shift -- where real-world queries diverge from your test set -- is invisible to offline evaluation. User interaction patterns (how people actually phrase requests, what follow-up questions they ask, how they respond to agent errors) are nearly impossible to simulate realistically. Edge cases that occur at a rate of 1-in-1000 requests may never appear in a curated dataset but surface daily at production scale.

### Shadow Evaluation

Shadow evaluation (also called shadow mode or dark launching) bridges the two approaches. A new agent version processes production traffic in parallel with the current version, but only the current version's responses are served to users. The shadow version's outputs are logged and scored, providing online-like data without online-like risk. Shadow evaluation is particularly valuable for high-stakes deployments where errors carry significant cost.

The main limitation of shadow evaluation is that it cannot capture multi-turn interaction dynamics -- since users never see the shadow agent's responses, you cannot evaluate how they would react to them. It also doubles compute cost during the shadow period. Typical shadow deployments run for 24-72 hours on 10-100% of traffic before a go/no-go decision.

### Building a Combined Strategy

A mature evaluation strategy layers both approaches. A recommended pipeline is:

1. **Development**: offline evaluation on every code change (fast feedback, 5-10 minutes)
2. **Pre-deployment**: full offline suite with expanded test cases (30-60 minutes)
3. **Shadow deployment**: shadow evaluation on production traffic (24-72 hours)
4. **Canary release**: serve new version to 1-5% of traffic with intensive monitoring
5. **Full rollout**: gradual traffic increase with continuous online evaluation

Each stage acts as a gate. Failures at any stage halt progression to the next.

## Why It Matters

1. **Offline-only evaluation creates blind spots**: Fixed datasets inevitably diverge from production reality. Teams that rely exclusively on offline evaluation routinely encounter production failures that their test suites never anticipated.

2. **Online-only evaluation is reactive**: Without offline evaluation, you discover problems only after they affect users. Catching a 15% quality regression in production means hundreds or thousands of users already received degraded service.

3. **The combination is multiplicative, not additive**: Offline evaluation provides fast, cheap feedback during development. Online evaluation validates that offline metrics actually predict production quality. Together, they create a calibration loop where production findings improve offline test suites, and offline improvements are verified in production.

4. **Resource allocation depends on understanding both**: Knowing that offline evaluation costs $50 per run while online evaluation costs $500 per day of monitoring helps teams budget effectively and decide which problems to solve with which approach.

5. **Calibration between the two builds confidence**: When offline metrics consistently predict online outcomes, the team gains confidence in shipping changes based on offline results alone for low-risk modifications, reserving expensive online evaluation for high-stakes changes.

## Key Technical Details

- Offline datasets should be refreshed quarterly by sampling recent production traffic to combat dataset staleness
- Shadow evaluation typically adds 80-120% additional compute cost during the evaluation window (nearly doubling inference costs)
- Online evaluation sampling rates of 1-5% of traffic provide sufficient signal for most metrics while keeping LLM-as-judge costs manageable
- The correlation between offline and online metrics should itself be tracked -- if offline scores stop predicting online performance, the offline suite needs updating
- Latency measurement is meaningful only in online evaluation; offline environments rarely replicate production network conditions and load patterns
- For non-deterministic agents, offline evaluation should run each test case 3-5 times and report aggregate statistics (see `../05-statistical-methods-for-evaluation/confidence-intervals-for-agent-metrics.md`)
- Canary deployments (serving the new version to 1-5% of traffic) provide a middle ground between shadow evaluation and full rollout, offering real interaction data with limited blast radius
- Version all evaluation datasets and configurations alongside agent code to maintain reproducibility as the evaluation suite evolves
- Offline evaluation environments should pin external dependencies (mock API responses, frozen database snapshots) to prevent environmental variance from contaminating results

## Common Misconceptions

**"If our offline eval scores are high, we don't need online evaluation."** Offline scores reflect performance on your test distribution, which is always a simplified approximation of production. High offline scores with no online evaluation is like having a perfect driving simulation score but never taking the car on an actual road.

**"Online evaluation means A/B testing."** A/B testing is one form of online evaluation, but not the only one. Continuous quality monitoring, user feedback analysis, and shadow evaluation are all online evaluation methods that do not require traffic splitting. Many teams begin online evaluation with monitoring long before they build A/B testing infrastructure.

**"Shadow evaluation gives you the same signal as full online evaluation."** Shadow evaluation cannot capture user reactions to agent responses, making it blind to multi-turn conversation quality, user satisfaction, and behavioral signals like retry rates. It is excellent for evaluating single-turn quality and catching regressions, but it does not replace live traffic evaluation.

**"Offline evaluation is just for catching regressions."** While regression detection is a primary use case, offline evaluation also serves for capability profiling (understanding what categories of tasks the agent handles well), cost estimation (measuring token usage before deployment), and comparative analysis (evaluating multiple candidate approaches side by side).

## Connections to Other Concepts

- `production-quality-monitoring.md` covers the infrastructure for continuous online evaluation
- `a-b-testing-for-agents.md` details the most rigorous form of online evaluation
- `user-feedback-as-evaluation-signal.md` describes implicit and explicit online signals
- `drift-detection-and-model-updates.md` addresses why offline evaluation alone degrades over time
- `../05-statistical-methods-for-evaluation/sample-size-and-power-analysis.md` applies to both offline dataset sizing and online experiment duration
- `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md` explains the non-determinism that complicates both approaches

## Further Reading

- "Offline Evaluation of LLM-based Recommender Systems" -- Li et al., 2024
- "A/B Testing Intuition Busters" -- Kohavi et al., 2022
- "The State of AI Engineering: LangChain Developer Survey" -- LangChain, 2024
- "Challenges in Deploying Machine Learning: A Survey of Case Studies" -- Paleyes et al., 2022
- "Shadow Testing for Production ML Systems" -- Google Research, 2023
