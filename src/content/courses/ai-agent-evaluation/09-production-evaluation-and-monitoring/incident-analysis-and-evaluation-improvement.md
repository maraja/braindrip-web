# Incident Analysis and Evaluation Improvement

**One-Line Summary**: Every meaningful production failure should be systematically analyzed, converted into a regression test case, and used to identify gaps in the evaluation suite -- creating a feedback loop where incidents continuously strengthen the evaluation system that prevents future incidents.

**Prerequisites**: `production-quality-monitoring.md`, `drift-detection-and-model-updates.md`, `online-vs-offline-evaluation.md`, `../04-trajectory-and-process-analysis/error-recovery-evaluation.md`

## What Is Incident Analysis and Evaluation Improvement?

Think of aviation safety. Every plane crash, every near-miss, every mechanical anomaly is meticulously investigated, classified, and fed back into training programs, maintenance procedures, and aircraft design. The aviation industry does not just fix the broken plane -- it asks "why didn't our existing safety systems prevent this?" and strengthens those systems accordingly. Over decades, this feedback loop has made commercial aviation extraordinarily safe.

Incident analysis for AI agents follows the same philosophy. When an agent fails in production -- providing dangerous medical advice, executing an irreversible action incorrectly, hallucinating a critical fact -- the response should go far beyond patching the immediate problem. The incident becomes raw material for strengthening the entire evaluation system. Why did the failure occur? Why did existing evaluations not catch it? What new test case would have caught it? What pattern of leading indicators, if monitored, could have predicted it?

This practice transforms production failures from purely negative events into the most valuable source of evaluation improvement. Teams that systematically implement this feedback loop see their incident rates decline over time as their evaluation suites become increasingly comprehensive and production-calibrated.

## How It Works

### Post-Incident Analysis

Structured post-incident analysis follows a consistent process, ideally completed within 48 hours of incident detection while details are fresh.

**Root cause identification** traces the failure back to its origin. For agent systems, root causes typically fall into several categories: model capability gaps (the LLM cannot reliably perform the required reasoning), prompt or instruction deficiencies (the system prompt does not adequately constrain behavior), tool integration failures (an external API returned unexpected data), retrieval failures (the agent retrieved irrelevant or outdated context), or evaluation gaps (the agent's behavior was within its normal operating range but the quality bar was set too low).

A single incident often has multiple contributing causes. A customer service agent that provides incorrect refund information might suffer from a retrieval failure (it pulled the wrong policy document), a reasoning gap (it did not recognize the ambiguity), and an evaluation gap (the test suite never tested refund scenarios with ambiguous eligibility criteria). All three must be addressed.

**Failure classification** assigns each incident to a taxonomy of failure types. A practical taxonomy for agent systems includes: factual hallucination, instruction violation, safety boundary violation, tool misuse, incomplete task execution, latency failure (correct answer but too slow), cost overrun (correct answer but excessive token usage), and graceful degradation failure (agent did not recognize its own inability to handle the request). Consistent classification enables trend analysis -- if 40% of incidents over the past quarter involve factual hallucination, that signals a systemic issue requiring a systematic response.

**Severity assessment** determines the impact of the incident using a standardized scale. A common framework:

- **S1 (Critical)**: Safety violation, data loss, financial harm, or regulatory breach. Requires immediate response and executive notification.
- **S2 (High)**: Significant quality failure affecting multiple users or a high-value use case. Requires response within 24 hours.
- **S3 (Medium)**: Noticeable quality degradation for a subset of users. Requires response within one week.
- **S4 (Low)**: Minor quality issue noticed by internal review or a single user complaint. Addressed in the next sprint.

### The Failure-to-Test-Case Pipeline

The most operationally valuable outcome of incident analysis is converting failures into regression test cases. This pipeline ensures that every meaningful production failure makes the evaluation suite permanently stronger.

**Step 1: Reproduce the failure.** Extract the exact input (user query, conversation history, system state) that triggered the failure. Attempt to reproduce it in an offline environment. For non-deterministic agents, reproducing may require multiple attempts -- run the scenario 10-20 times to estimate the failure probability.

**Step 2: Minimize the test case.** Reduce the input to the smallest example that still triggers the failure. A 15-message conversation might reduce to a 3-message sequence. A complex tool-use scenario might simplify to a single tool call with specific parameters. Minimal test cases are easier to maintain and more clearly diagnostic.

**Step 3: Define the expected behavior.** Write explicit acceptance criteria for the test case. This might be a specific correct answer, a constraint that must be satisfied (e.g., "the agent must not recommend medication dosages"), or a quality threshold on a rubric dimension.

**Step 4: Add to the evaluation suite.** Integrate the test case into the appropriate evaluation tier: the fast regression suite (run on every code change), the comprehensive pre-deployment suite, or a specialized safety-critical suite. Tag the test case with its origin incident ID for traceability.

**Step 5: Verify coverage.** Confirm that the current agent version fails the new test case (if the underlying issue has not yet been fixed) or passes it (if a fix has already been deployed). A test case that passes against the current agent without any fix provides no regression protection and may need refinement.

A mature team targets a 72-hour turnaround from incident detection to test case integration for S1 and S2 incidents.

### Evaluation Gap Identification

Beyond creating individual test cases, incident analysis should answer a deeper question: "Why didn't our evaluation suite catch this?"

Common evaluation gaps include:

- **Missing coverage categories**: The evaluation suite never tested the scenario type at all (e.g., no test cases for multi-language interactions, no test cases involving ambiguous user intent).
- **Insufficient depth**: The evaluation tested the scenario type but only with easy examples. The production failure involved a harder variant.
- **Wrong metrics**: The evaluation measured the wrong quality dimension. A test case might check factual accuracy while the real failure was in tone appropriateness.
- **Stale test data**: The evaluation dataset reflects conditions that no longer match production (outdated API schemas, deprecated features, old policy documents).
- **Missing adversarial cases**: The failure was triggered by unusual but valid input that no one thought to test.

Each identified gap should generate not just one test case but a category of test cases addressing the systematic weakness.

### Leading vs Lagging Indicators

Incidents are lagging indicators -- by definition, they happen after the failure. Effective incident analysis also identifies leading indicators that could have predicted the failure earlier.

**Leading indicators** are metrics that shift before quality incidents occur. Examples: increased tool call error rates (tools are failing, and the agent is about to start producing incorrect outputs), rising average conversation length (the agent is struggling to resolve requests efficiently), increased variance in quality scores (the agent is becoming inconsistent, with more interactions at both extremes), or declining retrieval relevance scores (the knowledge base is drifting out of alignment with user queries).

For each incident, ask: "What metric, if we had been watching it, would have shown an anomaly 24-48 hours before this incident became user-visible?" Add that metric to the monitoring dashboard with appropriate alerting thresholds (see `production-quality-monitoring.md`).

### Building an Incident Database

Individual incidents are valuable; a searchable database of all incidents is transformative. An incident database should record: the incident date, severity, category, root cause analysis, affected user count, time to detection, time to resolution, test cases generated, evaluation gaps identified, and the corrective actions taken.

Over time, this database becomes organizational knowledge. It answers questions like: "What are our most common failure modes?", "How has our mean time to detection improved?", "Which evaluation categories have the most gaps?", and "Are incidents from model provider updates increasing or decreasing?"

### Blameless Post-Mortems

Agent failures are system failures, not individual failures. Blameless post-mortems focus on process and systemic improvements rather than assigning personal blame. The core questions are:

- What happened? (Timeline of events)
- Why did it happen? (Root cause chain, often using "5 Whys")
- Why didn't we catch it earlier? (Evaluation and monitoring gaps)
- What will we change? (Concrete action items with owners and deadlines)
- How will we know the change worked? (Measurable success criteria)

Post-mortem documents should be accessible to the entire team. Transparency about failures builds a culture where problems are surfaced quickly rather than hidden.

## Why It Matters

1. **Production failures are the highest-signal evaluation data**: No hypothetical scenario designed at a desk matches the specificity and relevance of a real production failure. Each incident teaches you exactly where your agent breaks under real conditions.

2. **Evaluation suites without production feedback calcify**: An evaluation suite that is never updated from production data becomes increasingly disconnected from reality. Within 6-12 months, it may be testing scenarios that no longer occur while missing scenarios that now dominate production traffic.

3. **The feedback loop creates compounding returns**: Each incident that becomes a test case prevents a recurrence. As the test suite grows, fewer incidents escape to production, and the ones that do are increasingly novel -- pushing the agent toward genuine capability improvement rather than repeated failure on known issues.

4. **Organizational learning accelerates**: An incident database transforms individual experiences into institutional knowledge. New team members can study historical incidents to quickly understand the system's failure modes without experiencing them firsthand.

5. **Stakeholder confidence requires accountability**: Being able to say "we had 3 S2 incidents this quarter, down from 7 last quarter, and each one resulted in new test cases that prevent recurrence" demonstrates rigorous quality management to leadership and customers.

## Key Technical Details

- Target 72-hour turnaround from incident detection to test case integration for S1/S2 severity incidents
- Maintain a failure taxonomy with 8-12 categories; more granular taxonomies become unwieldy, coarser taxonomies lose diagnostic value
- Incident database entries should include the raw conversation log, the root cause analysis, and links to resulting test cases and code changes
- Track "time to detection" (incident start to alert trigger) and "time to resolution" (alert to fix deployed) as meta-metrics for the monitoring system itself
- Run the full regression suite (including new incident-derived test cases) before every deployment; this is the test-case pipeline's enforcement mechanism
- Review the incident database quarterly to identify trends and update the failure taxonomy as new patterns emerge
- Assign each action item from a post-mortem a specific owner and due date; unowned action items do not get completed

## Common Misconceptions

**"Once we fix the bug, we are done."** Fixing the immediate issue is necessary but insufficient. Without a corresponding test case, the same failure pattern can reappear in a future agent version. Without evaluation gap analysis, similar-but-different failures will continue to slip through.

**"We only need post-mortems for severe incidents."** S3 and S4 incidents, while individually minor, collectively reveal patterns that S1/S2 analysis misses. A lightweight analysis process for lower-severity incidents (30-minute review, 1-paragraph write-up, test case creation) captures these patterns without the full post-mortem overhead.

**"Our evaluation suite is comprehensive enough -- we just need better monitoring."** Monitoring detects problems in production; evaluation prevents them from reaching production. These are complementary, not substitutable. An incident that monitoring catches is still an incident -- users were still affected. The goal is to catch failures in evaluation before they reach production at all.

**"Blameless means no accountability."** Blameless post-mortems assign accountability for systemic improvements (action items with owners and deadlines) without blaming individuals for the initial failure. The distinction is between "who should fix the system" (accountability) and "whose fault was it" (blame). The former drives improvement; the latter drives concealment.

## Connections to Other Concepts

- `production-quality-monitoring.md` provides the detection layer that surfaces incidents for analysis
- `drift-detection-and-model-updates.md` covers a specific class of incidents caused by external changes
- `user-feedback-as-evaluation-signal.md` describes how user reports contribute to incident identification
- `online-vs-offline-evaluation.md` explains the two tiers where incident-derived test cases are deployed
- `../04-trajectory-and-process-analysis/error-recovery-evaluation.md` provides tools for analyzing how agents fail in multi-step scenarios
- `../07-safety-and-alignment-evaluation/agent-safety-red-teaming.md` covers proactive failure discovery that complements reactive incident analysis

## Further Reading

- "Learning from Incidents in Software" -- Allspaw, 2020
- "The Field Guide to Understanding Human Error" -- Dekker, 2014
- "Evaluating Large Language Models: A Comprehensive Survey" -- Guo et al., 2023
- "Site Reliability Engineering: How Google Runs Production Systems" -- Beyer et al., 2016
- "Post-Mortems at Amazon and Lessons Learned" -- Amazon Builder's Library, 2023
