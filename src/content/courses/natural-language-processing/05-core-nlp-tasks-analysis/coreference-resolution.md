# Coreference Resolution

**One-Line Summary**: Coreference resolution determines which expressions (mentions) in a text refer to the same real-world entity, linking pronouns, names, and descriptions into coherent entity chains.

**Prerequisites**: `named-entity-recognition.md`, `dependency-parsing.md`, `pragmatics-and-discourse.md`, `contextual-embeddings.md`, `bert.md`

## What Is Coreference Resolution?

Imagine reading a novel and keeping track of who "he," "she," "the detective," and "Maria" all refer to across paragraphs and chapters. Your brain effortlessly links these different expressions to the same character. Coreference resolution gives machines this same ability: it identifies all the mentions in a text that refer to the same entity and clusters them together.

Formally, given a document $D$ containing mentions $m_1, m_2, \dots, m_n$, coreference resolution partitions these mentions into **entity clusters** $\{E_1, E_2, \dots, E_k\}$ such that all mentions within a cluster refer to the same real-world entity. A **mention** can be a proper noun ("Barack Obama"), a pronoun ("he"), a nominal phrase ("the president"), or even a nested entity. Two mentions are **coreferent** if they denote the same entity in the discourse. The task is central to discourse understanding, connecting isolated sentence-level analysis to document-level coherence.

## How It Works

### Mention Detection

The first step identifies candidate mentions -- spans of text that could refer to an entity. Common mention types:

- **Pronouns**: he, she, it, they, his, their, etc.
- **Named entities**: "Barack Obama," "Google" (often from `named-entity-recognition.md`).
- **Nominal phrases**: "the company," "a tall man," "the first president."

Over-generation followed by filtering is typical: extract all noun phrases, named entities, and pronouns, then prune implausible mentions (e.g., pleonastic "it" in "It is raining").

### Approaches

**Rule-Based: The Stanford Sieve System (Lee et al., 2013)** applies a cascade of deterministic sieves, from highest precision to lowest:

1. Exact string match (highest precision).
2. Precise constructs (appositives, predicate nominatives, acronyms).
3. Strict head matching with compatible modifiers.
4. Relaxed head matching.
5. Pronoun resolution using syntactic and semantic constraints.

Each sieve links mentions that pass its criteria, and clusters merge transitively. This approach achieved ~60 CoNLL F1 and remains a strong interpretable baseline.

**Neural Mention-Pair Models**: Early neural approaches (Wiseman et al., 2015; Clark & Manning, 2016) score pairs of mentions for coreference compatibility using features from distributed representations. A mention pair $(m_i, m_j)$ receives a score from a feed-forward network, and clustering algorithms (closest-first, best-first) link mentions into chains.

**End-to-End Neural (Lee et al., 2017)**: The landmark model jointly performs mention detection and coreference resolution without a separate mention detection pipeline. For each span $(i, j)$ in the document:

1. Compute a **mention score** $s_m(i, j)$ indicating whether the span is a valid mention.
2. For each pair of candidate mentions, compute a **coreference score** $s_c(m_i, m_j)$.
3. The final score for linking $m_j$ to antecedent $m_i$ is $s_m(m_i) + s_m(m_j) + s_c(m_i, m_j)$.

The model considers all spans up to a maximum width (e.g., 10 tokens), prunes to the top-scoring candidates, and selects antecedents greedily. With SpanBERT (Joshi et al., 2020), this architecture achieves ~79.6 CoNLL F1 on OntoNotes, a substantial improvement over rule-based systems.

### Higher-Order and Cluster-Level Models

The mention-pair approach makes independent pairwise decisions, potentially producing inconsistent clusters. Higher-order models incorporate cluster-level features -- for instance, an entity-level representation aggregated from all current cluster members -- to enforce global coherence. Xu & Choi (2020) showed that incorporating cluster-level features improves F1 by 1--2 points.

## Why It Matters

1. **Document understanding**: Without coreference, systems treat each sentence independently and cannot track entities across a document.
2. **Question answering**: Resolving "she" or "the organization" to specific entities is essential for multi-hop reasoning in `question-answering.md`.
3. **Summarization**: Coreference chains identify the most salient entities in a document, informing content selection in `text-summarization.md`.
4. **Information extraction**: Linking entity mentions across sentences allows `relation-extraction.md` and `knowledge-graphs-for-nlp.md` to aggregate facts about the same entity.
5. **Dialogue systems**: Tracking entity references across conversation turns is critical for coherent `dialogue-systems.md`.
6. **Machine translation**: Pronoun translation depends on knowing the antecedent's gender and number, which requires coreference resolution.

## Key Technical Details

- **OntoNotes 5.0 benchmark**: English coreference with ~3,500 documents across 7 genres; SOTA ~80--83 CoNLL F1.
- **CoNLL F1**: Average of MUC, B-CUBED, and CEAF_e F1 scores (see evaluation metrics below).
- **Evaluation metrics**:
  - **MUC** (Vilain et al., 1995): Counts minimum links needed to align predicted and gold clusters. Favors large clusters.
  - **B-CUBED** (Bagga & Baldwin, 1998): Computes precision/recall per mention, then averages. Handles singletons well.
  - **CEAF** (Luo, 2005): Finds optimal alignment between predicted and gold entities, then computes entity-level or mention-level scores.
  - **CoNLL F1**: Average of MUC, B-CUBED, and CEAF_e; the standard composite metric since CoNLL-2012.
- **Lee et al. (2017) end-to-end model**: 67.2 CoNLL F1 (initial); with SpanBERT (2020): ~79.6 F1.
- **Winograd Schema Challenge** (Levesque et al., 2012): Coreference problems requiring commonsense reasoning; accuracy ~75--80% for best models, well below human ~95%.
- **Document length**: Performance degrades on long documents (>2,000 tokens) due to memory constraints and increased ambiguity.

## Common Misconceptions

**"Coreference resolution is just pronoun resolution."** Pronoun resolution is one component, but coreference also involves linking nominal phrases ("the company" = "Google"), proper name variants ("Barack Obama" = "Obama" = "the president"), and resolving event coreference. Pronouns account for only ~30--40% of coreference links.

**"Syntactic rules suffice for pronoun resolution."** Binding theory and syntactic constraints (e.g., reflexives must be bound locally) handle some cases, but most real-world pronoun resolution requires world knowledge, pragmatic reasoning, and discourse context. The Winograd Schema Challenge explicitly tests this with examples like: "The trophy doesn't fit in the suitcase because it is too [big/small]."

**"High CoNLL F1 means coreference is solved."** The composite CoNLL F1 metric averages three sub-metrics that can mask specific weaknesses. Models still struggle with cataphora (forward references), long-distance coreference, and cases requiring commonsense reasoning. Performance on the Winograd Schema Challenge highlights the remaining gap.

**"Singleton mentions don't matter."** Many coreference datasets exclude singletons (entities mentioned only once), but in practice, correctly identifying that a mention is not coreferent with anything else is important for downstream applications like entity counting and knowledge base population.

## Connections to Other Concepts

- `named-entity-recognition.md` provides the entity mentions that are input to coreference resolution.
- `pragmatics-and-discourse.md` covers the discourse coherence theory underlying coreference.
- Coreference feeds entity-level information to `relation-extraction.md`, `knowledge-graphs-for-nlp.md`, and `information-extraction.md`.
- `dependency-parsing.md` provides syntactic features (e.g., subject position) used in coreference models.
- Neural coreference models leverage `contextual-embeddings.md`, `bert.md`, and `attention-mechanism.md`.
- `commonsense-reasoning.md` addresses the world knowledge required for Winograd-style coreference.
- Coreference is essential for coherent `dialogue-systems.md` and multi-document `text-summarization.md`.

## Further Reading

- Lee et al., *End-to-End Neural Coreference Resolution*, 2017 -- introduced the first joint mention detection and coreference model, transforming the field.
- Lee et al., *Deterministic Coreference Resolution Based on Entity-Centric, Precision-Ranked Rules*, 2013 -- the Stanford sieve system that was the strongest rule-based approach.
- Joshi et al., *SpanBERT: Improving Pre-training by Representing and Predicting Spans*, 2020 -- demonstrated that span-oriented pre-training significantly improves coreference resolution.
- Levesque et al., *The Winograd Schema Challenge*, 2012 -- proposed coreference problems as a test of machine intelligence requiring commonsense reasoning.
- Pradhan et al., *CoNLL-2012 Shared Task: Modeling Multilingual Unrestricted Coreference in OntoNotes*, 2012 -- established the standard coreference benchmark and evaluation protocol.
