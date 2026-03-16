# Event Extraction

**One-Line Summary**: Identifying events, their triggers, and participant arguments from text -- detecting not just that something happened, but who was involved, where, when, and how.

**Prerequisites**: Named Entity Recognition (`05-core-nlp-tasks-analysis/named-entity-recognition.md`), Relation Extraction (`05-core-nlp-tasks-analysis/relation-extraction.md`), Semantic Role Labeling (`05-core-nlp-tasks-analysis/semantic-role-labeling.md`), Information Extraction (`information-extraction.md`).

## What Is Event Extraction?

Reading a news article, you naturally notice not just the entities mentioned but the *events* -- a bombing, an election, a corporate merger. You identify who did what, where it happened, when, and with what consequence. Event extraction gives machines this same capability: it identifies event occurrences in text, classifies their types, and extracts the structured arguments that describe each event's participants and circumstances.

Formally, an event is a specific occurrence involving participants, typically anchored by an event trigger (a word or phrase that most clearly expresses the event's occurrence). Event extraction involves: (1) **trigger detection** -- identifying the word(s) that signal an event and classifying the event type; and (2) **argument extraction** -- identifying the entities and values that fill specific roles in the event. For example, in "A car bomb killed 20 people in Baghdad on Tuesday," the trigger is "killed" (type: Attack), and the arguments are instrument="car bomb," victim="20 people," place="Baghdad," time="Tuesday."

## How It Works

### Event Types and Triggers

An **event trigger** is the word or phrase that most clearly indicates the event's occurrence -- typically a verb ("attacked," "married," "resigned") or a nominalization ("explosion," "acquisition," "election"). Trigger detection is a word-level classification task: for each token in the sentence, predict whether it triggers an event and, if so, which event type.

Event types are organized in ontologies. The most widely used is the ACE (Automatic Content Extraction) event ontology.

### The ACE Event Ontology

ACE 2005 defines:
- **8 event types**: Life, Movement, Transaction, Business, Conflict, Contact, Personnel, Justice
- **33 event subtypes**: e.g., Life:Be-Born, Life:Die, Conflict:Attack, Conflict:Demonstrate, Transaction:Transfer-Ownership, Personnel:Start-Position, Justice:Arrest-Jail
- **35 argument roles**: e.g., Attacker, Target, Victim, Instrument, Place, Time, Agent, Destination, Origin

The ACE 2005 dataset contains 599 documents with 5,349 event mentions and 9,649 argument mentions. Despite its age, ACE 2005 remains the primary benchmark for sentence-level event extraction.

### Argument Role Identification

Once a trigger is detected, the system must identify which entities in the sentence fill which argument roles. This is typically modeled as:

1. **Candidate identification**: All entity mentions in the sentence (from NER) are considered as candidate arguments.
2. **Role classification**: For each (trigger, candidate) pair, classify the argument role or "None" if the candidate does not participate in the event.

This resembles semantic role labeling (see `05-core-nlp-tasks-analysis/semantic-role-labeling.md`) but with event-specific role labels rather than PropBank-style roles.

### Classical Approaches

**Pipeline models**: Separate classifiers for trigger detection and argument extraction, often using feature-rich SVMs or MaxEnt models. Features include lexical features, entity types, dependency paths between triggers and argument candidates, and positional features. Li et al. (2013) achieved 73.7% trigger classification F1 and 65.4% argument role F1 on ACE 2005 using this approach.

**Joint models**: Jointly predict triggers and arguments to capture their dependencies. For example, knowing the event type constrains which argument roles are possible (an Attack event expects Attacker and Target roles, not Buyer and Seller). Li et al. (2013) showed that joint inference improved argument F1 by 1-2% over pipeline approaches.

### Neural Event Extraction

Modern systems use transformer-based architectures:

- **BERT-based classification**: Encode the sentence with BERT, classify each token for trigger type, then for each detected trigger, classify each entity mention for argument role. BERT-based models achieve ~78% trigger F1 and ~58-62% argument role F1 on ACE 2005.
- **DEGREE** (Hsu et al., 2022): Frames event extraction as conditional generation -- given a trigger, generate a natural language description of the event filling in argument slots. Uses a seq2seq model (BART) with template-guided decoding.
- **EEQA** (Du and Cardie, 2020): Casts argument extraction as question answering. For each argument role, a question template is constructed (e.g., "Who was attacked?" for the Target role), and a QA model extracts the answer span from the sentence.
- **Prompt-based extraction**: Large language models with carefully designed prompts can perform event extraction in zero-shot or few-shot settings, though they lag behind fine-tuned models by 5-15% F1.

### Document-Level Event Extraction

Sentence-level extraction misses arguments scattered across multiple sentences. Document-level event extraction addresses this:

- **Cross-sentence argument extraction**: An event trigger in sentence 3 may have its Place argument mentioned only in sentence 1. Models like Doc2EDAG (Zheng et al., 2019) use entity-centric representations and memory networks to aggregate information across document spans.
- **Event table filling**: Given an event type, fill in a table of arguments by reading the entire document. The RAMS dataset (Ebner et al., 2020) specifically benchmarks cross-sentence argument linking, with 65% of arguments appearing in different sentences from their triggers.
- **Multi-event documents**: Real documents contain multiple interleaved events. Disentangling which arguments belong to which events is a combinatorial challenge.

### Timeline Construction

Beyond individual events, event extraction supports temporal ordering:

1. Extract events and their time expressions (see `08-semantic-understanding/temporal-reasoning.md`).
2. Identify temporal relations between events (before, after, simultaneous, includes).
3. Construct a timeline by topological sorting of the temporal relation graph.

The TimeBank corpus provides 186 documents with 7,935 temporal relation annotations for benchmarking.

### Challenges

- **Implicit events**: Some events are implied but never explicitly stated. "The earthquake devastated the city" implies casualties without explicitly mentioning them.
- **Cross-document event coreference**: The same event may be reported across multiple documents with different wordings. Linking these mentions requires cross-document reasoning and entity coreference (see `05-core-nlp-tasks-analysis/coreference-resolution.md`).
- **Event causality and subevent structure**: Understanding that "the protest led to a riot" involves causal reasoning beyond simple extraction.
- **Negative and hypothetical events**: "The planned attack was prevented" describes an event that did *not* occur -- distinguishing actual from non-actual events requires modality detection (see `08-semantic-understanding/negation-and-speculation-detection.md`).

## Why It Matters

1. **Intelligence and security**: Automatic monitoring of news, social media, and reports for conflict events, natural disasters, and security threats.
2. **Biomedical event extraction**: Extracting molecular events (gene expression, protein binding, phosphorylation) from PubMed supports drug discovery and biomedical research. The GENIA event corpus contains over 36,000 biomedical event annotations.
3. **Financial event detection**: Tracking mergers, acquisitions, earnings announcements, and regulatory actions from financial news for automated trading and risk management.
4. **Historical analysis**: Extracting and ordering events from historical texts to build structured timelines.
5. **Emergency response**: Detecting and tracking disaster events from social media for real-time situational awareness.

## Key Technical Details

- **ACE 2005 SOTA (2024)**: Trigger identification F1 ~78%, trigger classification F1 ~76%, argument identification F1 ~60%, argument role classification F1 ~56-62%.
- **Cross-sentence arguments**: In the RAMS dataset, 65% of arguments appear in a different sentence from the trigger, and document-level models improve over sentence-level by 8-12% argument F1.
- **Biomedical event extraction**: On GENIA (BioNLP Shared Task), best systems achieve ~58% F1 on the full event extraction task, with simpler event types (Gene_expression) at ~80% F1 and complex nested events at ~40% F1.
- **Event trigger ambiguity**: The same word can trigger different event types depending on context ("fired" can be a Conflict:Attack or Personnel:End-Position event).
- **Data scarcity**: ACE 2005 has only ~5,300 event mentions -- far less than datasets for NER (~200K+ mentions in OntoNotes). This data scarcity motivates few-shot and transfer learning approaches.

## Common Misconceptions

**"Event extraction is just NER plus relation extraction."** Events have fundamentally different structure: they are anchored by triggers (often verbs, not noun phrases), involve typed argument roles specific to each event type, and carry temporal and modal properties. The task requires dedicated modeling beyond entity-relation extraction.

**"Extracting the event trigger is the hard part."** Trigger detection achieves ~78% F1 on ACE 2005, but argument role classification lags at ~58% F1. The bottleneck is argument extraction, especially for roles that require long-range reasoning or world knowledge.

**"Events are always expressed by verbs."** Nominalizations ("the bombing," "his resignation"), adjectives ("the dead soldiers"), and even implicit constructions express events without overt verb triggers. Systems focusing only on verb triggers miss a substantial portion of events.

**"Sentence-level extraction is sufficient."** Real documents scatter event information across multiple sentences. Extracting events from isolated sentences misses arguments, temporal context, and causal links that emerge only at the document level.

## Connections to Other Concepts

- `information-extraction.md`: Event extraction is the most complex stage of the IE pipeline.
- `05-core-nlp-tasks-analysis/semantic-role-labeling.md`: SRL identifies predicate-argument structure; event extraction adds event-type classification and event-specific role labels.
- `05-core-nlp-tasks-analysis/named-entity-recognition.md`: NER provides candidate arguments for event extraction.
- `open-information-extraction.md`: Open IE extracts general triples; event extraction adds typed event structure and argument roles.
- `08-semantic-understanding/temporal-reasoning.md`: Ordering extracted events into timelines requires temporal relation identification.
- `08-semantic-understanding/negation-and-speculation-detection.md`: Distinguishing actual events from hypothetical, negated, or planned events.
- `knowledge-graphs-for-nlp.md`: Extracted events populate event-centric knowledge graphs.
- `05-core-nlp-tasks-analysis/coreference-resolution.md`: Cross-document event coreference links different reports of the same event.

## Further Reading

- Ahn, "The Stages of Event Extraction," 2006 -- Formalized the trigger detection + argument extraction pipeline that defines modern event extraction.
- Li et al., "Joint Event Extraction via Structured Prediction with Global Features," 2013 -- Demonstrated the benefits of joint modeling for event extraction.
- Du and Cardie, "Event Extraction by Answering (Almost) Natural Questions," 2020 -- EEQA, casting argument extraction as question answering.
- Hsu et al., "DEGREE: A Data-Efficient Generation-Based Event Extraction Model," 2022 -- Generative event extraction using template-guided seq2seq.
- Ebner et al., "Multi-Sentence Argument Linking," 2020 -- Introduced the RAMS dataset for document-level argument extraction.
- Zheng et al., "Doc2EDAG: An End-to-End Document-level Framework for Chinese Financial Event Extraction," 2019 -- Pioneered entity-centric document-level event extraction.
