# User Feedback as Evaluation Signal

**One-Line Summary**: User feedback -- both explicit ratings and implicit behavioral signals like task abandonment and retry patterns -- provides irreplaceable evaluation data, but requires careful bias correction because feedback providers are not representative of all users.

**Prerequisites**: `online-vs-offline-evaluation.md`, `production-quality-monitoring.md`, `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md`

## What Is User Feedback as Evaluation Signal?

Imagine a restaurant with two sources of information about food quality. The first is a suggestion box by the door -- a few passionate diners write detailed complaints or praise. The second is the surveillance camera showing how people actually eat: do they finish their plates, do they order dessert, do they come back next week? The suggestion box gives you articulate, specific feedback from a biased minority. The camera gives you broad behavioral truth from everyone, but requires interpretation. User feedback for AI agents works exactly the same way, split between explicit signals (the suggestion box) and implicit signals (the camera).

Explicit feedback is what users deliberately tell you about their experience: thumbs up/down buttons, star ratings, free-text comments, or satisfaction surveys. Implicit feedback is what users reveal through their behavior without intending to: abandoning a conversation, rephrasing their question three times, copying the agent's output without modification, or escalating to a human support channel.

Both signal types are essential and complementary. Explicit feedback tells you what specific problems users notice. Implicit feedback tells you how widespread those problems actually are. Neither alone gives a complete picture, and both require careful interpretation to avoid misleading conclusions.

## How It Works

### Explicit Feedback Collection

**Thumbs up/down** is the simplest and most widely deployed mechanism. Its advantages are low user friction (one click), high response rates relative to other methods (typically 3-8% of interactions), and easy aggregation. Its limitation is extreme coarseness -- a thumbs-down does not tell you whether the answer was wrong, unhelpful, slow, unsafe, or simply not what the user expected.

**Star ratings (1-5)** provide more granularity but suffer from distribution compression. In practice, most ratings cluster at 1 or 5 (J-shaped distribution), with the middle range underused. The effective information content is often only marginally better than binary feedback.

**Free-text comments** are the richest explicit signal. A user writing "the agent gave me Python 2 syntax when I asked for Python 3" provides actionable diagnostic information that no numerical rating can capture. The challenge is volume and processing: only 0.5-2% of users leave text comments, and extracting structured insights from unstructured text requires NLP analysis or manual review. LLM-based classification of free-text feedback into failure categories is increasingly practical and cost-effective.

**Follow-up surveys** sent after task completion can achieve 10-20% response rates if they are short (3-5 questions) and timely (within minutes of the interaction). They allow targeted questions about specific quality dimensions but introduce recall bias -- users reconstruct their experience from memory rather than reporting it in real time.

### Implicit Feedback Signals

Implicit signals are observable in every interaction, not just those where users choose to provide feedback. The key signals, ordered roughly by interpretability:

**Task abandonment** occurs when a user disengages mid-conversation without completing their goal. High abandonment rates (e.g., more than 40% of multi-turn conversations ending without resolution) strongly indicate quality problems. Abandonment is measured by detecting sessions that end without an explicit completion signal and where the user's last message suggests an unresolved need.

**Retry patterns** manifest when users rephrase the same question or request. A user asking "What's the weather in NYC?" then "NYC weather today" then "Tell me the current temperature in New York City" is almost certainly not getting satisfactory answers. Detecting retries requires semantic similarity comparison between consecutive user messages; a cosine similarity above 0.75-0.85 on message embeddings is a common threshold.

**Escalation rates** measure how often users abandon the agent and seek human help (via support tickets, live chat, phone calls). This is among the most unambiguous negative signals: the user explicitly determined that the agent could not solve their problem. Escalation rate is a lagging indicator -- by the time you measure it, the user has already had a bad experience -- but it is also one of the most reliable quality metrics.

**Edit distance** measures how much a user modifies the agent's output before using it. If a coding agent generates a function and the user copies it verbatim, that is a strong positive signal. If the user rewrites 60% of the code, the agent's contribution was marginal at best. Edit distance is applicable whenever the agent produces content that the user can modify: code, emails, reports, configuration files.

**Time-to-next-action** captures how long users pause after receiving an agent response. Very short pauses before the next message may indicate the user is rapidly rephrasing (negative signal). Very long pauses may indicate the user is carefully studying a detailed, helpful response (positive signal) or has simply left (negative signal). This signal requires contextual interpretation and is the most ambiguous of the implicit signals.

### Bias Correction

The central challenge with user feedback is that feedback providers are not representative of all users. Known biases include:

**Negativity bias**: Users are 2-5x more likely to provide feedback after negative experiences than positive ones. Aggregating raw feedback scores systematically underestimates true quality.

**Power user bias**: Frequent users are overrepresented in feedback data. Their experience may differ significantly from occasional users who encounter more friction with the interface.

**Selection bias**: Users who provide feedback tend to have stronger opinions. The "silent majority" -- users with middling, unremarkable experiences -- are systematically absent from explicit feedback.

Correction approaches include: weighting feedback inversely by user response propensity (users who frequently rate are downweighted), calibrating explicit feedback rates against implicit behavioral baselines, and using stratified analysis to separate feedback patterns by user segment.

### Integrating User Signals with Automated Evaluation

User feedback serves a critical secondary purpose: training and calibrating automated evaluators. When a user marks an interaction as thumbs-down and writes "the agent hallucinated a nonexistent API endpoint," this becomes a labeled example for improving LLM-as-judge evaluators and rule-based quality checks. Over time, a corpus of user-labeled interactions becomes a gold-standard calibration dataset.

The pipeline works as follows: collect user feedback, cluster feedback into failure categories, generate evaluation test cases from representative examples in each category, and validate that automated evaluators correctly identify these failure modes. This creates a feedback loop where production experience continuously improves pre-deployment evaluation.

### Privacy Considerations

User feedback data often contains sensitive information -- the content of their queries, their behavioral patterns, and their explicit assessments of their experience. Responsible feedback collection requires: anonymizing user identifiers before analysis, establishing data retention policies (e.g., raw conversation data retained for 90 days, aggregated metrics retained indefinitely), providing users with opt-out mechanisms for behavioral tracking, and ensuring feedback data is not used to train models without appropriate consent.

## Why It Matters

1. **User experience is the ultimate ground truth**: No automated metric fully captures whether a user's actual need was met. User signals -- especially implicit behavioral signals -- are the closest approximation to ground truth available in production.

2. **Coverage that no test suite can match**: Users collectively explore the input space far more thoroughly than any curated dataset. Their natural behavior surfaces edge cases, ambiguous requests, and use patterns that evaluation designers never anticipated.

3. **Early warning for subtle quality shifts**: Aggregate behavioral signals like retry rates and abandonment rates can detect quality degradation before it shows up in automated metrics, because users are sensitive to quality dimensions that automated evaluators may miss.

4. **Calibration anchor for automated evaluation**: Without user feedback, automated evaluators operate in a vacuum. User labels provide the ground truth needed to ensure that LLM-as-judge scores actually correlate with user satisfaction.

## Key Technical Details

- Thumbs up/down response rates typically range from 3-8% of interactions; free-text comments from 0.5-2%
- Implicit signals (abandonment, retries, escalation) are available for 100% of interactions, making them far more statistically powerful than explicit feedback
- Retry detection using embedding cosine similarity works best with a threshold of 0.78-0.85 depending on the embedding model
- Negativity bias correction: multiply the positive-to-negative feedback ratio by an empirically determined factor (typically 2-4x) to estimate true satisfaction distribution
- Edit distance metrics require instrumented client-side tracking, which adds development overhead but provides uniquely actionable signal
- Feedback data older than 90 days should be aggregated and anonymized; raw conversation logs should follow organizational data retention policies

## Common Misconceptions

**"Low feedback volume means users are satisfied."** Low feedback volume means most users did not bother to provide feedback. Satisfied users are actually less likely to rate their experience than dissatisfied ones. Absence of negative feedback is not evidence of positive experience -- it is absence of evidence.

**"Thumbs up/down gives us the quality metric we need."** Binary feedback captures user sentiment but not diagnostic information. A thumbs-down does not distinguish between a wrong answer, a slow answer, an unsafe answer, or a technically correct answer that missed the user's actual intent. Complement binary ratings with category-specific questions or free-text fields.

**"Implicit feedback is too noisy to be useful."** Individual implicit signals are noisy, but aggregated patterns are remarkably stable and informative. A single user retrying a query might reflect ambiguous intent. A 15% week-over-week increase in retry rates across all users unambiguously signals a quality problem.

**"We should maximize feedback collection at all costs."** Aggressive feedback prompts degrade user experience. Asking for ratings after every interaction causes prompt fatigue and reduces both response rates and response quality over time. Best practice is to request feedback on a random sample of interactions (10-20%) rather than every single one.

## Connections to Other Concepts

- `production-quality-monitoring.md` describes how user feedback integrates into the broader monitoring pipeline
- `a-b-testing-for-agents.md` uses user feedback signals as primary and guardrail metrics for experiments
- `online-vs-offline-evaluation.md` positions user feedback within the online evaluation category
- `incident-analysis-and-evaluation-improvement.md` uses user feedback to identify and classify production failures
- `../03-automated-evaluation-methods/agent-as-judge.md` covers the LLM-as-judge evaluators that user feedback helps calibrate

## Further Reading

- "Implicit Feedback for Conversational AI: A Survey" -- Zhang et al., 2023
- "Beyond Thumbs Up/Down: Untangling Challenges of Fine-Grained Feedback for LLM Agents" -- Wu et al., 2024
- "Learning from User Interactions for AI System Improvement" -- Krause et al., 2023
- "Bias in User Feedback for Conversational AI Systems" -- Sharma et al., 2024
- "The Role of User Studies in the Evaluation of Conversational Systems" -- Deriu et al., 2021
