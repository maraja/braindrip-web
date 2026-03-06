# Evaluating Refusal Behavior

**One-Line Summary**: Measuring the quality of when agents say "no" -- balancing over-refusal that frustrates users against under-refusal that permits harmful actions.

**Prerequisites**: `harmful-action-detection-metrics.md`, `alignment-measurement.md`, `agent-safety-red-teaming.md`

## What Is Refusal Behavior Evaluation?

Consider a pharmacist who must decide when to fill a prescription and when to refuse. Refuse too readily -- declining valid prescriptions because the dosage looks unusual -- and patients go without needed medication. Refuse too rarely -- filling every prescription without question -- and dangerous drug interactions go unchecked. The skill is not in saying yes or no, but in saying the right one at the right time, with a clear explanation in either case.

Agent refusal behavior operates on the same spectrum. An agent that refuses everything risky is safe but useless. An agent that accepts everything is useful but dangerous. The goal is calibrated refusal: the agent's refusal rate should match the actual risk level of requests, it should decline genuinely harmful requests while accepting legitimate ones, and when it does refuse, it should explain why clearly and suggest alternatives where possible.

Evaluating refusal quality is critical because it directly determines the user experience of safety. Users do not experience the agent's internal safety mechanisms -- they experience refusals. If refusals are poorly calibrated, users perceive the agent as either recklessly permissive or frustratingly restrictive, regardless of the sophistication of the underlying safety architecture.

## How It Works

### Over-Refusal: The Safety Cost of Caution

Over-refusal occurs when an agent declines safe, legitimate requests. This is the most common user-facing complaint about safety-tuned agents and one of the hardest problems to evaluate because it requires determining ground truth for whether a request was actually safe.

**Measuring over-refusal rate** requires a benchmark set of clearly safe requests that a well-calibrated agent should accept. These requests may touch on sensitive topics (medical information, security concepts, controversial subjects) but are clearly legitimate in context. The over-refusal rate is the percentage of clearly safe requests the agent incorrectly refuses.

**Category-specific over-refusal** breaks down refusal patterns by topic area. Agents commonly over-refuse in predictable categories: security-related requests (even from security professionals), medical information requests (even factual, non-prescriptive ones), and requests involving code that manipulates sensitive data (even for legitimate development). Identifying these category-specific patterns enables targeted calibration.

**Context sensitivity testing** evaluates whether the agent considers context when deciding to refuse. The same request -- "how do I access the database credentials" -- should be handled differently when it comes from a developer on the team with database access versus an unknown user in a public-facing system. Over-refusal evaluation must include scenarios where context makes a request legitimate.

### Under-Refusal: The Usefulness Cost of Permissiveness

Under-refusal occurs when an agent accepts requests it should decline. This is the direct safety risk and the primary concern of red teaming (see `agent-safety-red-teaming.md`).

**Measuring under-refusal rate** requires a benchmark set of clearly harmful requests that a well-calibrated agent should refuse. These include requests for dangerous information, attempts to bypass safety mechanisms, instructions to harm users or systems, and requests that would violate the agent's operational policies. The under-refusal rate is the percentage of clearly harmful requests the agent incorrectly accepts.

**Severity-weighted under-refusal** recognizes that not all failures to refuse are equally bad. Accepting a mildly inappropriate request is a minor failure. Accepting a request that leads to data exfiltration or system damage is a critical failure. Under-refusal metrics should weight failures by the severity of the potential consequence.

**Adversarial under-refusal** tests whether the agent can be manipulated into accepting harmful requests through social engineering, prompt injection, or gradual context shifting. This overlaps significantly with red teaming but specifically focuses on the refusal decision point rather than the broader attack surface.

### Refusal Calibration

The ideal agent has a refusal curve that closely tracks the actual risk distribution of incoming requests. Calibration measures the alignment between the agent's refusal probability and the true probability that a request is harmful.

**Calibration curves** plot the agent's estimated risk level (implicit in its refusal decision) against the actual risk level (determined by human experts). A perfectly calibrated agent produces a 45-degree line: when it judges a request as 70% likely to be harmful, human experts agree approximately 70% of the time.

**Expected Calibration Error (ECE)** quantifies the average gap between the agent's confidence in its refusal decisions and the accuracy of those decisions, binned across confidence levels. Lower ECE indicates better calibration. Frontier agents typically achieve ECE of 0.08-0.15 on refusal calibration benchmarks.

**The ambiguous middle** is where calibration matters most. Clearly safe and clearly harmful requests are easy -- most agents handle them correctly. The evaluation challenge lies in the broad middle zone of ambiguous requests where reasonable people disagree about the appropriate response. Benchmarks must include a substantial fraction (30-50%) of deliberately ambiguous cases to stress-test calibration in this zone.

### Refusal Quality Metrics

Beyond the binary refuse/accept decision, the quality of refusals matters.

**Explanation clarity** measures whether the agent explains why it refused. A bare refusal ("I can't do that") provides no guidance. A quality refusal explains the specific concern ("This would require modifying production data, which is outside my authorization"), enabling the user to understand the boundary and either rephrase their request or escalate appropriately.

**Alternative suggestion rate** measures whether the agent offers constructive alternatives when it refuses. "I cannot directly access the production database, but I can query the staging replica, or you could run this query yourself with your admin credentials." Suggesting alternatives transforms a refusal from a dead end into a productive redirection.

**Consistency** measures whether the agent refuses the same type of request consistently across different phrasings, contexts, and sessions. Inconsistent refusal -- accepting a request in one phrasing but refusing it in another semantically equivalent phrasing -- undermines user trust and signals poor underlying calibration.

### Benchmark Design for Refusal Evaluation

A well-designed refusal benchmark includes three tiers of requests in specific proportions.

**Clearly safe requests (40-50%)** establish the over-refusal baseline. These should span diverse topics and include requests that superficially resemble dangerous ones but are legitimate in context.

**Clearly unsafe requests (20-30%)** establish the under-refusal baseline. These should cover the full range of harmful categories and include both obvious and sophisticated harmful requests.

**Ambiguous requests (25-35%)** test calibration in the critical gray zone. These should be requests where reasonable experts disagree about the appropriate response, annotated with the expert disagreement rate to enable calibration analysis.

### Safety-Helpfulness Tradeoff Data

Real-world data from deployed systems illustrates the range of achievable safety-helpfulness tradeoffs.

Claude's safety performance across modalities (Anthropic, 2025) demonstrates how refusal calibration varies by deployment context. In MCP (Model Context Protocol) tool-use scenarios, Claude achieved 94% attack prevention rate -- meaning it correctly refused 94% of adversarial MCP-based attacks while maintaining high helpfulness on legitimate tool-use requests. In CLI (command line interface) contexts, the prevention rate was 82.6%, reflecting the broader action space and greater ambiguity of command-line operations. In computer use scenarios, the rate reached 99.4%, reflecting more conservative calibration appropriate for the high-stakes nature of direct computer control.

These numbers illustrate a key principle: optimal refusal calibration varies by context. Computer use warrants more aggressive refusal (higher safety, lower helpfulness) because the consequences of under-refusal are severe. CLI contexts warrant somewhat more permissive calibration because the user population is more technical and the requests are more inherently ambiguous.

## Why It Matters

1. **Refusal is the user-facing surface of safety.** Users experience the agent's safety posture entirely through its refusal behavior. Poorly calibrated refusal creates either a perception of incompetence (over-refusal) or reckless permissiveness (under-refusal).
2. **Over-refusal drives user workarounds.** Users frustrated by excessive refusal learn to rephrase requests to avoid triggering safety filters, effectively training themselves to circumvent the safety mechanisms. This is worse than properly calibrated refusal.
3. **Under-refusal creates concrete harm.** Every harmful request that should have been refused but was not represents a real risk that materialized. The consequences range from minor (inappropriate content) to catastrophic (data breach, system destruction).
4. **Refusal calibration is a competitive differentiator.** Agents that are simultaneously safe and helpful outperform those that sacrifice one for the other. The market rewards the right calibration point.

## Key Technical Details

- Frontier agents have over-refusal rates of 5-15% on safe-request benchmarks, meaning 1 in 7 to 1 in 20 legitimate requests are incorrectly refused
- Under-refusal rates on adversarial benchmarks range from 5-20%, improving with model scale and safety training
- Claude MCP attack prevention: 94%; CLI: 82.6%; computer use: 99.4% (Anthropic, 2025)
- Expected Calibration Error for refusal decisions ranges from 0.08-0.15 for frontier models
- Refusal explanation quality correlates with user satisfaction at r = 0.65 -- users tolerate refusals much better when they are clearly explained
- Alternative suggestion rates for well-tuned agents range from 40-70% of refusals, significantly reducing user frustration
- Consistency of refusal across paraphrased requests averages 80-90% for frontier models, with lower consistency on ambiguous requests
- Refusal benchmarks should include at minimum 200 scenarios with human expert annotations for reliable calibration measurement

## Common Misconceptions

**"Zero under-refusal is the correct target."** Targeting zero under-refusal inevitably drives over-refusal to unacceptable levels. The correct target is the Pareto-optimal point where further reduction in under-refusal produces unacceptable increases in over-refusal for the given deployment context.

**"Refusal evaluation only needs clearly safe and clearly unsafe examples."** The hardest and most informative evaluation happens in the ambiguous zone. An agent that handles only clear cases correctly but fails on ambiguous ones will perform poorly in the real world, where the majority of interesting refusal decisions involve ambiguity.

**"Users always prefer less refusal."** Research shows that users prefer appropriate refusal over inappropriate compliance. When an agent completes a request that the user later realizes was harmful, user trust decreases more than when the agent refused and explained why. Users want an agent that exercises good judgment, not one that blindly complies.

**"Refusal quality is binary -- the agent either refuses or it does not."** Refusal exists on a spectrum: hard refusal (complete decline), soft refusal (decline with alternatives), partial compliance (doing the safe parts while declining the unsafe parts), and compliance with caveats (proceeding but flagging concerns). Evaluating only hard refusal misses the rich space of nuanced refusal behaviors.

## Connections to Other Concepts

- `agent-safety-red-teaming.md` -- red teaming specifically targets under-refusal by attempting to elicit harmful compliance
- `alignment-measurement.md` -- refusal behavior is a direct expression of alignment quality
- `harmful-action-detection-metrics.md` -- detection systems and refusal mechanisms are complementary safety layers
- `trust-calibration-evaluation.md` -- refusal quality directly affects user trust calibration
- `../04-trajectory-and-process-analysis/specification-gaming-detection.md` -- agents may find ways to technically comply while avoiding the spirit of a refusal
- `../09-production-evaluation-and-monitoring/user-feedback-as-evaluation-signal.md` -- user feedback reveals real-world over-refusal and under-refusal patterns

## Further Reading

- "Constitutional AI: Harmlessness from AI Feedback" -- Bai et al., 2022
- "The Safety-Helpfulness Tradeoff in Language Model Alignment" -- Anthropic Technical Report, 2024
- "Refusal in Language Models Is Mediated by a Single Direction" -- Arditi et al., 2024
- "Measuring and Reducing Over-Refusal in Safety-Tuned Language Models" -- Cui et al., 2024
- "Do-Not-Answer: Evaluating Safeguards in LLMs" -- Wang et al., 2023
- "XSTest: A Test Suite for Identifying Exaggerated Safety Behaviours in Large Language Models" -- Rottger et al., 2024
