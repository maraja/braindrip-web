# Knowledge Conflicts and Resolution

**One-Line Summary**: When retrieved documents contradict each other or conflict with the model's training data, explicit conflict resolution strategies prevent the model from silently choosing one version or hallucinating a compromise.
**Prerequisites**: `grounding-and-faithfulness.md`, `rag-prompt-design.md`

## What Is Knowledge Conflict?

Think of knowledge conflicts like the situation when two reference books disagree on the same topic. Your chemistry textbook from 2015 says the boiling point of a compound is 178 degrees C, but a 2024 research paper reports 182 degrees C after more precise measurement. Which do you trust? The answer depends on context: the recency of the source, the authority of the authors, the precision of the measurement. You need a principled decision framework, not a coin flip.

Knowledge conflicts in RAG systems arise in three forms. First, inter-context conflicts: two or more retrieved documents contradict each other on the same factual claim. Second, context-parametric conflicts: the retrieved documents contradict what the model learned during training. Third, intra-context conflicts: a single document contains internally inconsistent information (common in long documents edited by multiple authors over time).

Without explicit conflict resolution instructions, language models handle conflicts unpredictably. Studies show that models default to their parametric knowledge 40-60% of the time when context conflicts with training data, and they silently select one version without acknowledging the disagreement when retrieved documents conflict with each other. This silent resolution is dangerous because users have no way to know a conflict existed or how it was resolved.

*Recommended visual: A taxonomy diagram showing three types of knowledge conflicts -- inter-context (Document A vs. Document B), context-parametric (retrieved context vs. model training data), and intra-context (contradictions within a single document) -- with arrows showing the model's default resolution behavior (silent selection) vs. the desired behavior (explicit surfacing with citations).*
*Source: Adapted from Xie et al., "Adaptive Chameleon or Stubborn Sloth: Revealing the Behavior of Large Language Models in Knowledge Conflicts," 2024.*

*Recommended visual: A decision flowchart for conflict resolution -- detect conflict, then branch based on resolution strategy: recency-based (compare timestamps), authority-based (check source hierarchy), or uncertainty-flagging (present both positions with confidence indicators) -- with each path showing the output format template.*
*Source: Adapted from Chen et al., "Benchmarking Large Language Models in Retrieval-Augmented Generation," 2024.*

## How It Works

### Conflict Detection Prompting

The first step is instructing the model to detect and surface conflicts rather than silently resolving them:

**Explicit detection instruction**: "Before answering, check whether the provided sources agree on the relevant facts. If you find any contradictions between sources, explicitly identify them before providing your answer."

**Structured conflict reporting**: "For each key claim in your answer, check if all sources agree. If sources disagree, format your response as: 'Sources agree: [agreed facts]. Sources disagree: Source [1] states X, while Source [3] states Y. Resolution: [your assessment based on the resolution criteria below].'"

Detection prompting reduces silent conflict resolution from 70-80% to 20-30%, making most conflicts visible to the user.

### Recency-Based Resolution

For factual claims that change over time (statistics, regulations, scientific findings, pricing), recency is a strong resolution signal:

**Implementation**: Include timestamps or dates in source metadata. Instruct the model: "When sources provide different values for the same fact, prefer the most recent source. State the date of the information and note that earlier sources reported different values."

**Limitations**: Recency is not always appropriate. An older primary source may be more authoritative than a newer secondary summary. Legal precedents may be superseded by newer rulings or may still be in effect. The recency heuristic should be applied with domain awareness.

### Source Authority Hierarchies

Define explicit trust hierarchies for different source types:

**Example hierarchy for a medical RAG system**:
1. Peer-reviewed clinical guidelines (highest authority)
2. Systematic reviews and meta-analyses
3. Individual clinical trials
4. Expert opinion articles
5. General health information websites (lowest authority)

**Implementation**: Tag each source with its authority level during indexing. Include the hierarchy in the prompt: "When sources conflict, prefer sources with higher authority levels. The authority ranking from highest to lowest is: [list]. Cite the authority level when resolving a conflict."

### Explicit Uncertainty Flagging

When conflicts cannot be cleanly resolved, the model should communicate uncertainty rather than presenting a false consensus:

**Calibrated uncertainty**: "When sources disagree and you cannot determine which is more reliable, present both positions with citations and explicitly state that there is disagreement: 'There is conflicting information on this topic. Source [1] reports X, while Source [2] reports Y. Users should verify the current status from [appropriate verification source].'"

**Confidence indicators**: "Rate your confidence in each key claim as HIGH (all sources agree), MEDIUM (most sources agree with minor discrepancies), or LOW (sources directly contradict each other)."

### Context-Parametric Conflict Handling

When retrieved documents conflict with the model's training knowledge:

**Context-priority instruction**: "If the provided documents contain information that differs from your general knowledge, always defer to the provided documents. Your training data may be outdated, and the provided documents represent the most current and relevant information for this query."

**Flagging training knowledge**: "If you believe the provided documents contain an error based on your general knowledge, answer based on the documents but add a note: 'Note: The provided sources state X, which differs from commonly reported information. Users may wish to verify this claim.'"

Research shows that context-priority instructions cause models to follow retrieved context over parametric knowledge in 70-85% of conflict cases, compared to 40-60% without such instructions.

## Why It Matters

### Silent Conflicts Erode Trust

When a model silently resolves a conflict, the user receives a confident-sounding answer without knowing that the evidence was ambiguous. If the user later discovers the conflict, their trust in the system collapses. Transparent conflict reporting preserves trust even when the answer is uncertain.

### Regulatory and Compliance Requirements

In regulated domains, presenting one side of a factual disagreement as settled fact can have legal consequences. Medical advice that omits disagreement in clinical guidelines, or financial analysis that ignores conflicting reports, creates liability. Conflict surfacing is a compliance requirement in many enterprise deployments.

### Improving Source Quality Over Time

When conflicts are detected and logged, they become a signal for improving the knowledge base. Persistent conflicts between sources indicate stale documents, data quality issues, or gaps in coverage that the knowledge engineering team can address. Without conflict detection, these quality issues remain hidden.

## Key Technical Details

- Without conflict resolution instructions, models silently pick one version in 70-80% of inter-context conflicts and default to parametric knowledge in 40-60% of context-parametric conflicts.
- Explicit conflict detection prompting reduces silent resolution to 20-30% of cases, surfacing most conflicts for user awareness.
- Context-priority instructions cause models to follow retrieved context over training data in 70-85% of cases, compared to 40-60% baseline.
- Recency-based resolution is effective for 60-70% of factual conflicts (where the disagreement is due to information changing over time) but inappropriate for the remaining 30-40%.
- Source authority hierarchies with 3-5 explicit levels reduce conflict resolution errors by 25-35% compared to unstructured conflict handling.
- Adding confidence indicators (HIGH/MEDIUM/LOW) to conflict resolution improves user decision-making quality by 20-30% in user studies.
- Approximately 15-25% of RAG queries in enterprise knowledge bases encounter at least one form of knowledge conflict, making this a routine rather than rare occurrence.

## Common Misconceptions

- **"Knowledge conflicts are rare edge cases."** In enterprise knowledge bases with documents spanning multiple years and authors, 15-25% of queries encounter conflicts. Outdated documents, regional variations, and evolving policies make conflicts common.

- **"The model will naturally prefer the retrieved context."** Without explicit instructions, models follow retrieved context only 40-60% of the time when it conflicts with training data. The model's parametric knowledge exerts strong influence, especially on well-known topics.

- **"Newer information is always more accurate."** Recency is a useful heuristic but not universally applicable. A recent blog post may be less accurate than an older peer-reviewed paper. Domain-specific authority hierarchies are more reliable than pure recency.

- **"Acknowledging uncertainty makes the system seem unreliable."** User studies consistently show that transparent uncertainty reporting increases trust. Users prefer systems that say "sources disagree" over systems that confidently present one version of contested information.

- **"The model can reliably detect all conflicts."** Models detect explicit contradictions (A says X, B says Y) more reliably than implicit conflicts (A says revenue grew, B reports declining market share — which implies revenue may not have grown). Detection prompting helps but is not exhaustive.

## Connections to Other Concepts

- `grounding-and-faithfulness.md` — Conflict resolution extends faithfulness from "be faithful to context" to "be faithful to context while handling disagreements within it."
- `citation-and-attribution-prompting.md` — Citation is essential for conflict resolution; users need to see which source supports which claim to evaluate the conflict themselves.
- `reranking-and-context-selection.md` — Source diversity in context selection increases the likelihood of surfacing conflicts, which is actually desirable for completeness.
- `dynamic-context-augmentation.md` — When conflicts are detected, dynamic retrieval can fetch additional sources to help resolve the disagreement.
- `04-system-prompts-and-instruction-design/behavioral-constraints-and-rules.md` — Conflict handling policies are behavioral constraints that define how the system manages ambiguity.

## Further Reading

- Chen, J., Lin, H., Han, X., & Sun, L. (2024). "Benchmarking Large Language Models in Retrieval-Augmented Generation." Includes systematic evaluation of how models handle conflicting retrieved context.
- Xie, J., Zhang, K., Chen, J., Lou, R., & Su, Y. (2024). "Adaptive Chameleon or Stubborn Sloth: Revealing the Behavior of Large Language Models in Knowledge Conflicts." Analysis of when models defer to context versus parametric knowledge.
- Li, X., Zhu, Y., Tan, C., & Zhao, W. X. (2023). "Large Language Models are not Robust Multiple Choice Selectors." Demonstrates model susceptibility to superficial cues when resolving conflicts.
- Longpre, S., Periez, L., Chen, A., Dhakal, N., Wang, B., Park, H., & Kim, G. (2021). "Entity-Based Knowledge Conflicts in Question Answering." Early systematic study of knowledge conflicts in QA systems.
