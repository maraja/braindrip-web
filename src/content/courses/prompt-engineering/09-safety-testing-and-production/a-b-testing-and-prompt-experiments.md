# A/B Testing and Prompt Experiments

**One-Line Summary**: A/B testing prompts applies controlled experimentation to compare prompt variants with real users, measuring causal impact on task success, user satisfaction, and cost through statistically rigorous traffic splitting.
**Prerequisites**: `prompt-testing-and-evaluation.md`, `prompt-optimization-techniques.md`.

## What Is A/B Testing for Prompts?

Imagine you are developing two recipes for the same dish and you want to know which one people prefer. You would not just taste them yourself — your own preference might not reflect your customers'. Instead, you set up a blind taste test: a panel of judges each tries one version without knowing which is which, and you collect their ratings. A/B testing prompts works the same way — you serve different prompt variants to different users and measure which one performs better on real-world metrics.

Offline evaluation (see `prompt-testing-and-evaluation.md`) tells you how a prompt performs on curated test cases. A/B testing tells you how it performs with real users, real queries, and real-world conditions. These are complementary: offline eval is faster, cheaper, and catches obvious regressions, while A/B testing captures effects that eval suites miss — user satisfaction, engagement, edge cases in the long tail of real queries, and interactions with production infrastructure. The gold standard workflow is: offline eval gates deployment, A/B testing validates real-world impact.

A/B testing is particularly valuable for prompts because small wording changes can have large, unpredictable effects on user experience. A prompt that scores identically on an eval suite might produce noticeably different user satisfaction scores — perhaps because it changes the tone, length, or formatting of responses in ways the eval rubric does not capture. Only real user data reveals these effects.

*Recommended visual: A split-funnel experiment design diagram showing incoming user traffic randomly divided into Control (current prompt) and Treatment (new prompt variant) groups, with each group's responses flowing through the same metrics collection pipeline (task success, satisfaction, cost, latency, safety), converging at a statistical comparison dashboard that outputs a significance verdict.*
*Source: Adapted from Kohavi, Tang, & Xu, "Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing," 2020.*

*Recommended visual: A power analysis nomogram showing the relationship between sample size per variant (x-axis), minimum detectable effect size (y-axis, 1-10 percentage points), and statistical power curves (0.80 and 0.90), with an annotated example point at 3,000 users / 3 percentage-point MDE / 80% power for a binary metric with 70% baseline.*
*Source: Adapted from Larsen et al., "Statistical Challenges in Online Controlled Experiments," 2024.*

## How It Works

### Traffic Splitting and Experiment Design

In a prompt A/B test, incoming requests are randomly assigned to one of two (or more) prompt variants. The randomization unit is typically the user (not the request) to ensure each user has a consistent experience throughout the experiment. A 50/50 split maximizes statistical power, but a 90/10 split is common when the variant is risky and you want to limit exposure. The control group receives the current production prompt; the treatment group receives the new variant.

Key design decisions include: (1) the randomization unit (user-level vs. session-level vs. request-level), (2) the split ratio, (3) stratification variables (ensuring balanced distribution across user segments, query types, or geographies), and (4) experiment duration. A poorly designed experiment — for example, one that assigns morning users to the control and evening users to the treatment — produces confounded results that do not reflect the prompt's actual impact.

### Metrics Selection

Choosing the right metrics is critical. Primary metrics (also called "decision metrics") directly measure the goal of the experiment:

- **Task success rate**: Did the user accomplish their goal? Measured by downstream actions (clicks, purchases, task completions) or explicit feedback (thumbs up/down).
- **User satisfaction**: Measured via CSAT surveys, NPS, or implicit signals like session duration and return rate.
- **Response quality**: Measured by LLM-as-judge on a sample of production responses, or by human review of a stratified sample.

Secondary metrics (also called "guardrail metrics") ensure the experiment does not cause unintended harm:

- **Cost per request**: Token usage, API costs, compute overhead.
- **Latency**: Response time (p50, p95, p99).
- **Safety incidents**: Guardrail trigger rates, user-reported issues.
- **Engagement**: Response length, follow-up question rates, conversation depth.

### Statistical Power Analysis and Experiment Duration

Before launching, calculate the minimum sample size needed to detect a meaningful difference. Statistical power analysis requires four inputs: (1) baseline metric value, (2) minimum detectable effect (MDE) — the smallest improvement worth detecting, (3) significance level (typically 0.05), and (4) desired power (typically 0.80). For a binary metric like task success rate with a 70% baseline and a 3-percentage-point MDE, you need approximately 3,000 users per variant. For continuous metrics with high variance (like satisfaction scores), you may need 5,000-10,000 per variant.

Experiment duration depends on traffic volume. At 1,000 daily active users, a 3,000-user-per-variant experiment takes 6 days with a 50/50 split. Running experiments too short (underpowered) produces unreliable results; running them too long wastes opportunity cost and risks external confounds (holidays, news events, model updates).

### When to Use A/B Testing vs. Offline Evaluation

A/B testing is expensive — it requires production traffic, engineering infrastructure, and time. Use it when: (1) the prompt change affects user-facing experience, (2) the offline eval cannot capture the relevant quality dimensions (tone, engagement, satisfaction), (3) the stakes are high enough to justify the investment, or (4) you need to measure downstream business metrics (conversion, retention). Use offline evaluation when: (1) the change is purely technical (format, structure), (2) the eval suite has strong coverage, (3) you need fast iteration, or (4) you are in early development without production traffic.

A useful decision framework: if the prompt change can be fully evaluated by automated metrics (format compliance, extraction accuracy, classification precision), use offline eval. If the change involves subjective quality dimensions that affect user experience (tone, helpfulness, verbosity, engagement), add A/B testing. Most teams find that 80% of their prompt iterations are adequately served by offline eval, with A/B testing reserved for the 20% of changes that fundamentally alter the user experience.

## Why It Matters

### Causal Evidence for Decision-Making

Offline eval scores and stakeholder opinions are useful but not definitive. A/B testing provides causal evidence — it tells you that prompt A caused better outcomes than prompt B, controlling for all other variables. This evidence is especially important in organizations where prompt changes affect revenue, user retention, or safety, and decisions must be justified with data rather than intuition.

For example, a team might test a prompt variant that provides more detailed step-by-step explanations. Offline eval shows identical accuracy scores. But the A/B test reveals that the detailed variant reduces customer support escalation by 12%, saves the company $50,000/month in support costs, and increases user satisfaction scores by 0.3 points. Without the A/B test, this business impact would never have been measured, and the "equivalent" variant would never have been deployed.

### Discovering Hidden Effects

Prompts interact with users in complex ways that eval suites cannot fully capture. A more concise prompt might score the same on accuracy but dramatically improve user satisfaction because users prefer shorter responses. A prompt with better formatting might increase user engagement because it is easier to scan. A prompt with slightly different tone might reduce escalation rates to human agents. A/B testing reveals these effects that are invisible to automated evaluation.

### Risk Mitigation for High-Impact Changes

For high-traffic applications (millions of queries per day), a bad prompt change can cost millions of dollars or damage user trust within hours. A/B testing with a conservative split ratio (e.g., 95/5) limits blast radius: if the variant performs poorly, only 5% of users are affected, and the experiment can be stopped immediately. This controlled rollout approach is standard practice in production engineering and applies directly to prompt deployment.

## Key Technical Details

- A 50/50 traffic split maximizes statistical power; 90/10 splits require 5x more total traffic to achieve the same power.
- For a binary metric with 70% baseline and 3-percentage-point MDE at 80% power and 5% significance, you need approximately 3,000 users per variant.
- Experiment duration should account for weekly cycles — run for at least 7 days to capture day-of-week effects, ideally 14 days for stability.
- User-level randomization is preferred over request-level to avoid inconsistent experiences within a single user's session.
- Multiple-comparison correction (Bonferroni or Benjamini-Hochberg) is required when testing more than 2-3 metrics simultaneously to avoid false positives.
- Peeking at results before the planned sample size is reached inflates false positive rates from 5% to as high as 30%; use sequential testing methods if early stopping is needed.
- Segment analysis (breaking results down by user type, query category, or geography) can reveal that a prompt variant helps one group while hurting another, even when the aggregate effect is neutral.
- Infrastructure requirements include: a randomization service, a logging pipeline that tags each request with its experiment variant, and an analysis dashboard.
- For prompt experiments specifically, log the full prompt text (or a version hash) alongside each response to enable post-hoc analysis of which prompt variant produced which response patterns.

## Common Misconceptions

- **"A/B testing is always better than offline eval."** A/B testing is slow, expensive, and requires production traffic. For most prompt iterations, offline eval is faster and sufficient. Reserve A/B testing for high-stakes changes where user experience effects cannot be captured by eval suites.
- **"If the result is not statistically significant, the prompts are equivalent."** Non-significance means you failed to detect a difference, not that no difference exists. The experiment may have been underpowered. Check your power analysis before concluding equivalence.
- **"You can test many prompt variants simultaneously."** Multi-arm experiments (A/B/C/D/...) require larger sample sizes and multiple-comparison corrections. Testing more than 3-4 variants simultaneously is rarely practical unless you have very high traffic volumes.
- **"Short experiments are fine if you have high traffic."** Even with millions of daily users, experiments need at least 7 days to account for day-of-week effects. A weekend-only experiment produces results that do not generalize to weekday traffic patterns.
- **"A/B testing replaces the need for monitoring after launch."** A/B testing validates the prompt at launch, but performance can degrade over time due to changing user behavior, model updates, or data drift. Post-launch monitoring remains essential.
- **"You need custom infrastructure to A/B test prompts."** While dedicated experimentation platforms (LaunchDarkly, Optimizely, Statsig) provide full-featured A/B testing, a minimal setup using feature flags and structured logging is sufficient for most teams to start. The key requirement is consistent randomization and variant-tagged logging, not sophisticated tooling.

## Connections to Other Concepts

- `prompt-testing-and-evaluation.md` — Offline eval gates which prompts enter A/B testing; A/B testing validates the winners with real users.
- `prompt-optimization-techniques.md` — Optimization generates candidate prompt variants; A/B testing determines which variant to deploy in production.
- `cost-and-latency-optimization.md` — Cost and latency are guardrail metrics in every prompt A/B test, ensuring improvements in quality do not come at unacceptable efficiency costs.
- `prompt-debugging-and-failure-analysis.md` — A/B test logs provide rich data for debugging; variant-tagged logs allow comparing failure modes between prompt versions.
- `guardrails-and-output-filtering.md` — Guardrail trigger rates should be tracked as safety metrics during A/B experiments.

## Further Reading

- Kohavi, Tang, & Xu, "Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing," 2020 (Cambridge University Press). The definitive reference on A/B testing methodology, metrics design, and statistical analysis.
- Fabijan et al., "The Evolution of Continuous Experimentation in Software Product Development," 2017. Describes how experimentation culture scales in large organizations, directly applicable to prompt experimentation.
- Larsen et al., "Statistical Challenges in Online Controlled Experiments: A Review of A/B Testing Methodology," 2024. Covers modern statistical methods including sequential testing, variance reduction, and heterogeneous treatment effects.
- Microsoft Research, "ExP Platform: Large-Scale Online Experimentation," 2024. Practical infrastructure patterns for running experiments at scale, applicable to prompt A/B testing systems.
- Bojinov et al., "Online Experimentation: Benefits, Operational and Methodological Challenges, and Scaling Guide," 2023 (Harvard Business School). Business-oriented guide to experimentation with emphasis on decision-making frameworks.
