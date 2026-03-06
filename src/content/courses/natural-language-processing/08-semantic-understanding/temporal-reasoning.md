# Temporal Reasoning

**One-Line Summary**: Temporal reasoning is the ability to identify, interpret, and reason about time expressions, event ordering, and temporal relationships in text, enabling systems to construct timelines and answer when-questions.

**Prerequisites**: `semantics.md`, `named-entity-recognition.md`, `relation-extraction.md`, `event-extraction.md`, `information-extraction.md`.

## What Is Temporal Reasoning?

Imagine reading a news article: "The company filed for bankruptcy on March 15. Two weeks earlier, the CEO had resigned. By the end of the month, all employees had been laid off." A human reader effortlessly constructs a mental timeline: CEO resignation (around March 1), bankruptcy filing (March 15), layoffs (by March 31). This involves recognizing explicit dates ("March 15"), interpreting relative expressions ("two weeks earlier"), understanding tense and aspect ("had resigned" indicates prior completion), and inferring the ordering of events. Temporal reasoning gives machines this same capability.

Time is woven into nearly every text humans produce, yet it is remarkably complex to process computationally. Temporal expressions range from simple absolute dates ("January 1, 2024") to relative references ("last Tuesday," "three days ago"), vague durations ("a while," "recently"), and implicit temporal information encoded in verb tense, aspect, and world knowledge ("He graduated and then started his first job" -- we infer the job began after graduation even without an explicit temporal marker).

Temporal reasoning is essential for any NLP application that needs to understand when events occurred and how they relate in time: clinical NLP (understanding disease progression from patient records), news analysis (tracking the evolution of a story), legal text processing (establishing timelines of events in a case), and question answering ("What happened before the invasion?"). It sits at the intersection of information extraction, semantic understanding, and discourse analysis.

## How It Works

### Temporal Expression Recognition and Normalization

**TimeML and TIMEX3 Annotation**

TimeML (Pustejovsky et al., 2003) is the most widely adopted annotation framework for temporal information in text. It defines three core annotation layers:

1. **TIMEX3**: Temporal expressions -- dates, times, durations, and frequencies. Each TIMEX3 tag includes:
   - `type`: DATE, TIME, DURATION, SET (recurring)
   - `value`: Normalized ISO 8601 value (e.g., "2024-03-15", "P2W" for two weeks, "XXXX-WXX-1" for every Monday)
   - `temporalFunction`: Whether the expression requires anchoring to a reference time
   - `anchorTimeID`: The reference time for relative expressions

   Examples:
   - "March 15, 2024" -> `<TIMEX3 type="DATE" value="2024-03-15">`
   - "two weeks" -> `<TIMEX3 type="DURATION" value="P2W">`
   - "every Monday" -> `<TIMEX3 type="SET" value="XXXX-WXX-1">`
   - "yesterday" -> `<TIMEX3 type="DATE" value="2024-03-14" temporalFunction="true">`

2. **EVENT**: Words or phrases denoting events, annotated with tense, aspect, modality, and polarity. "The CEO *resigned*" marks "resigned" as an EVENT with tense=PAST and aspect=PERFECTIVE.

3. **TLINK (Temporal Link)**: Relations between events and/or temporal expressions, capturing the temporal ordering.

**Normalization Tools**

SUTime (Chang and Manning, 2012), part of Stanford CoreNLP, is a widely used rule-based temporal expression normalizer. It uses a cascade of pattern-matching rules to identify and normalize temporal expressions, achieving approximately 90% F1 on TIMEX3 recognition in the TempEval evaluations. HeidelTime (Strotgen and Gertz, 2010) takes a similar rule-based approach with multilingual support, covering over 200 languages.

Neural approaches, including fine-tuned BERT models, now match or exceed rule-based systems on TIMEX3 recognition (approximately 90-92% F1), though rule-based systems often produce more consistent normalizations for complex expressions.

### Temporal Relation Extraction

The core challenge of temporal reasoning is determining how events and times relate to each other. TimeML defines 13 temporal relation types, commonly simplified to the six Allen interval relations plus identity:

- **BEFORE**: Event A occurs entirely before Event B
- **AFTER**: Event A occurs entirely after Event B
- **DURING/INCLUDES**: Event A occurs during Event B (or B includes A)
- **SIMULTANEOUS**: Events A and B overlap in time
- **BEGINS/ENDS**: Event A begins/ends at the same time as Event B
- **VAGUE**: The temporal relationship cannot be determined

Extracting these relations is a classification task: given a pair of events (or an event and a time expression), predict their temporal relation. This is challenging because:

- Documents contain O(n^2) potential event pairs, most with no explicit temporal signal.
- Many temporal relations are implicit, requiring world knowledge or discourse structure.
- Annotator agreement on temporal relations is relatively low (approximately 65-80% depending on the relation type and annotation scheme), reflecting genuine ambiguity.

**Approaches**:

- **Rule-based**: Exploiting tense, aspect, temporal signals ("before," "after," "during"), and syntactic patterns. For example, "After he ate, he slept" signals BEFORE(ate, slept).
- **Feature-based ML**: SVM and MaxEnt classifiers using features including tense, aspect, temporal signals, event class, syntactic path between events, and document creation time relations. ClearTK-TimeML (Bethard, 2013) achieved the best results at TempEval-3 using such features.
- **Neural approaches**: BiLSTM and transformer-based models encoding event pairs with their context. Structured learning approaches (Ning et al., 2017) enforce temporal consistency constraints (transitivity: if A before B and B before C, then A before C). BERT-based temporal relation classifiers achieve approximately 65-70% F1 on TimeBank-Dense, the most carefully annotated temporal relation dataset.

### Timeline Construction

The ultimate goal of temporal reasoning is constructing a coherent timeline -- a partial or total ordering of events and times in a document or document collection. This involves:

1. **Extracting** all events and temporal expressions.
2. **Classifying** pairwise temporal relations.
3. **Ensuring global consistency**: Pairwise predictions may conflict (A before B, B before C, but C before A). Constraint satisfaction or integer linear programming (ILP) can enforce transitivity and other temporal axioms.
4. **Anchoring** events to the calendar when possible (using document creation time and explicit dates).

Chambers and Jurafsky (2008) introduced narrative chains -- sequences of events sharing a protagonist -- as a framework for learning typical event orderings from text. "He was arrested, tried, and sentenced" represents a canonical temporal ordering that systems can learn from large corpora.

### TempEval Shared Tasks

TempEval has been the primary evaluation venue for temporal reasoning, running as part of SemEval:

- **TempEval-1 (2007)**: Focused on three specific temporal relation classification subtasks (event-time, event-DCT, main event pairs).
- **TempEval-2 (2010)**: Expanded to include temporal expression extraction and event extraction alongside relation classification. Six subtasks across English, Chinese, French, Italian, Korean, and Spanish.
- **TempEval-3 (2013)**: Full pipeline evaluation -- end-to-end temporal processing including TIMEX3 extraction, event extraction, and temporal relation classification. The platinum-standard TimeBank was used for evaluation. Best system (ClearTK-TimeML) achieved F1 of approximately 36% on end-to-end temporal relation extraction, highlighting the difficulty of the full pipeline.

The low end-to-end scores reflect both the inherent difficulty of temporal reasoning and the propagation of errors across pipeline stages. Later work on TimeBank-Dense (Cassidy et al., 2014) showed that dense annotation (annotating all event pairs within a window, not just salient ones) reveals that approximately 40% of temporal relations are "vague" -- genuinely ambiguous.

### Challenges

**Implicit temporal references**: Many temporal relations are never explicitly stated. "She graduated from Harvard. She now works at Google." implies a temporal ordering (graduation before work) through world knowledge and discourse conventions, not explicit markers.

**Relative and deictic time**: Expressions like "yesterday," "next week," "recently," and "soon" require knowing the reference time (typically the document creation time) and the speaker's temporal perspective. In reported speech ("He said he would come tomorrow"), "tomorrow" is relative to the time of speaking, not the document creation time.

**Granularity mismatches**: "The war lasted from 2003 to 2011" and "The battle took place on March 20" describe events at different temporal granularities. Reasoning about their relationship requires handling temporal inclusion across scales.

**Vagueness and underspecification**: "In the early 2000s," "around noon," "a few years ago" -- temporal language is frequently vague, and forcing precise normalizations can be misleading. Systems must represent and reason about temporal uncertainty.

### Domain Applications

**Clinical NLP**: Medical records are inherently temporal -- disease onset, treatment dates, symptom progression, medication schedules. Clinical TempEval (Bethard et al., 2015, 2016, 2017) adapted temporal evaluation to clinical narratives, using the THYME corpus of clinical and pathology notes. Systems must handle medical-specific temporal patterns ("post-op day 3," "q.i.d.").

**News and intelligence analysis**: Tracking how events unfold over time across multiple news articles requires cross-document temporal reasoning. Systems like NewsReader construct event-centric timelines from news streams, enabling questions like "What happened in the three days before the election?"

**Legal and financial text**: Establishing timelines of events is critical for legal case analysis, contract interpretation, and financial audit trails.

## Why It Matters

1. **Question answering**: Temporal questions ("When did X happen?", "What happened before Y?") require temporal reasoning for accurate answers.
2. **Clinical decision support**: Understanding disease timelines and treatment sequences from medical records enables clinical decision support and pharmacovigilance (see `negation-and-speculation-detection.md` for related challenges in clinical NLP).
3. **News summarization**: Presenting events in chronological order requires temporal extraction and ordering, even when the source text uses non-chronological narrative structure.
4. **Event forecasting**: Predicting future events from historical patterns requires understanding temporal sequences and causal chains.
5. **Legal and forensic analysis**: Constructing event timelines from witness statements, documents, and communications is fundamental to legal proceedings.

## Key Technical Details

- TimeML defines 3 annotation layers (TIMEX3, EVENT, TLINK) with 13 temporal relation types, commonly reduced to 6 or 7 in practice.
- TimeBank 1.2 contains 183 news documents with approximately 7,935 events, 1,414 temporal expressions, and 6,418 temporal links.
- TimeBank-Dense annotates all event pairs within a local window, revealing approximately 40% of relations are "vague."
- SUTime achieves approximately 90% F1 on TIMEX3 recognition; BERT-based systems reach approximately 90-92% F1.
- End-to-end temporal relation extraction (TempEval-3): best system approximately 36% F1, demonstrating the difficulty of the full pipeline.
- Inter-annotator agreement on temporal relations ranges from approximately 65% to 80% depending on the scheme and relation type.
- Clinical TempEval systems achieve approximately 74% F1 on CONTAINS relation identification in clinical narratives.
- MATRES (Ning et al., 2018) simplifies temporal annotation to multi-axis relations, improving agreement to approximately 84%.

## Common Misconceptions

**"Temporal reasoning is just named entity recognition for dates."**
Recognizing and normalizing temporal expressions is only the first step. The harder problem is determining how events relate temporally -- which happened first, which overlaps, which caused which -- and constructing a globally consistent timeline.

**"Verb tense directly tells you temporal ordering."**
Tense provides clues but is not deterministic. "She said she would go" uses future tense ("would go") but describes a past utterance. Past perfect ("had gone") typically indicates anteriority but can be used for politeness ("I had wanted to ask you..."). Discourse conventions and world knowledge often override tense-based heuristics.

**"If two events are mentioned in sequence, the first happened first."**
Narrative order does not equal temporal order. "The company went bankrupt. It had been losing money for years" presents the bankruptcy first even though the losses preceded it. Flashbacks, background information, and journalistic conventions frequently violate chronological ordering.

**"Temporal reasoning is a solved preprocessing step."**
End-to-end temporal relation extraction remains one of the hardest structured prediction tasks in NLP. TempEval-3 best scores of approximately 36% F1 for the full pipeline are far from practical reliability, and even state-of-the-art neural models on simplified formulations (e.g., MATRES) achieve only approximately 80% F1.

## Connections to Other Concepts

- `event-extraction.md` covers the identification of events that temporal reasoning then orders and relates.
- `named-entity-recognition.md` provides the foundation for recognizing temporal expressions as a type of named entity.
- `relation-extraction.md` shares techniques with temporal relation classification -- both predict typed relationships between spans.
- `commonsense-reasoning.md` supplies the world knowledge needed for implicit temporal inferences ("graduation before career").
- `information-extraction.md` provides the broader pipeline context in which temporal reasoning operates.
- `negation-and-speculation-detection.md` intersects with temporal reasoning in clinical NLP, where negated or speculative events must be distinguished from confirmed ones on timelines.
- `dependency-parsing.md` provides syntactic structure that helps identify temporal signals and their scope.
- `coreference-resolution.md` is needed to track the same event across multiple mentions before temporal ordering.

## Further Reading

- Pustejovsky, J. et al., "TimeML: Robust Specification of Event and Temporal Expressions in Text," 2003 -- The foundational annotation specification for temporal information in text.
- UzZaman, N. et al., "SemEval-2013 Task 1: TempEval-3: Evaluating Time Expressions, Events, and Temporal Relations," 2013 -- The most comprehensive temporal evaluation campaign.
- Ning, Q., Wu, H., and Roth, D., "A Multi-Axis Annotation Scheme for Event Temporal Relations," 2018 -- MATRES, simplifying temporal annotation and improving inter-annotator agreement.
- Chambers, N. and Jurafsky, D., "Unsupervised Learning of Narrative Event Chains," 2008 -- Learning typical event sequences from text for temporal and causal reasoning.
- Cassidy, T. et al., "An Annotation Framework for Dense Event Ordering," 2014 -- TimeBank-Dense, revealing the prevalence of vague temporal relations.
- Bethard, S. et al., "SemEval-2015 Task 6: Clinical TempEval," 2015 -- Adapting temporal evaluation to the clinical domain.
- Chang, A.X. and Manning, C.D., "SUTime: A Library for Recognizing and Normalizing Time Expressions," 2012 -- Widely used rule-based temporal expression recognizer.
