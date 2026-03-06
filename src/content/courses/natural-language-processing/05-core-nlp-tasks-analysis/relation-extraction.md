# Relation Extraction

**One-Line Summary**: Relation extraction identifies and classifies semantic relationships between entities mentioned in text, converting unstructured prose into structured knowledge triples (subject, relation, object).

**Prerequisites**: `named-entity-recognition.md`, `dependency-parsing.md`, `text-classification.md`, `contextual-embeddings.md`, `bert.md`

## What Is Relation Extraction?

Imagine reading a biography and mentally noting facts: "born in Pretoria," "founded Tesla," "married to (person)." You are extracting relations -- structured facts connecting two entities through a defined relationship type. Relation extraction (RE) automates this process: given a sentence containing two entity mentions, the model classifies the relationship between them from a predefined set (or determines that no relation holds).

Formally, given a sentence $s$ and two entity mentions $e_1$ and $e_2$ (identified by `named-entity-recognition.md`), relation extraction assigns a label $r \in R \cup \{\text{NONE}\}$, where $R$ is a set of predefined relation types such as born-in, works-for, part-of, capital-of, founded-by, spouse-of, and located-in. A triple $(e_1, r, e_2)$ represents the extracted fact. Relation extraction is a core component of `information-extraction.md` and the primary mechanism for populating `knowledge-graphs-for-nlp.md`.

## How It Works

### Pipeline vs. Joint Extraction

**Pipeline approach**: First run NER to identify entity mentions, then classify the relation for each entity pair. This is simpler to implement and debug but suffers from error propagation -- NER mistakes cannot be recovered by the relation classifier.

**Joint extraction**: Simultaneously identify entities and their relations using a single model. Joint models (Miwa & Bansal, 2016; Zheng et al., 2017) reduce error propagation and can leverage interactions between entity types and relation types (e.g., a born-in relation constrains the first entity to be PER and the second to be LOC). Joint approaches typically improve F1 by 1--3 points over pipelines.

### Pattern-Based Methods

Early relation extraction relied on manually crafted or semi-automatically learned lexical-syntactic patterns. Hearst (1992) showed that patterns like "NP such as NP" reliably extract hyponymy relations. The **DIPRE** (Brin, 1998) and **Snowball** (Agichtein & Gravano, 2000) systems bootstrapped patterns from seed examples, iteratively discovering new patterns and new entity pairs.

Pattern-based methods have high precision but low recall, and they require significant manual effort to develop and maintain for each new relation type.

### Supervised Neural Methods

**CNN-based RE**: Zeng et al. (2014) applied CNNs over word embeddings concatenated with position embeddings (distance from each token to the two entities). Max pooling over the convolutional output produces a fixed-size representation for classification. This approach achieved ~82% F1 on SemEval-2010 Task 8.

**LSTM-based RE**: BiLSTMs with entity-aware attention capture long-range dependencies between entity mentions. The shortest dependency path between entities (from `dependency-parsing.md`) is a particularly powerful feature -- Zhou et al. (2016) achieved 84% F1 on SemEval-2010 Task 8 using attention-based BiLSTMs.

**BERT-based RE**: Fine-tuning BERT with special entity markers (inserting [E1] and [/E1] around the first entity, [E2] and [/E2] around the second) achieves ~89% F1 on SemEval-2010 Task 8 (Baldini Soares et al., 2019). The [CLS] token or the entity-marker representations are fed to a classification head.

### Distant Supervision

Mintz et al. (2009) introduced **distant supervision** to address the bottleneck of labeled training data. The key assumption: if a knowledge base contains the fact (Steve_Jobs, founded, Apple), then any sentence mentioning both "Steve Jobs" and "Apple" likely expresses the founded relation. This assumption generates large but noisy training datasets automatically from existing knowledge bases (e.g., Freebase, Wikidata).

The noise problem is significant -- many sentences mentioning both entities express different or no relations. Multi-instance learning (Riedel et al., 2010) addresses this by treating each bag of sentences mentioning an entity pair as a single training example, allowing the model to learn from the most informative sentences while tolerating noisy ones.

### Few-Shot and Zero-Shot RE with LLMs

Recent work explores relation extraction with minimal or no training data:

**Few-shot RE**: Given 5--10 examples of a new relation type, models use metric learning (prototype networks) or meta-learning to classify new instances. FewRel (Han et al., 2018) benchmarks few-shot RE with 100 relation types and N-way K-shot evaluation, where SOTA models achieve ~90% accuracy in 5-way 5-shot settings.

**Zero-shot RE with LLMs**: Large language models can extract relations via prompting without any relation-specific training. Given a prompt like "Extract the relationship between [entity1] and [entity2] in the following sentence," GPT-class models and instruction-tuned models achieve competitive performance on common relation types, though they struggle with domain-specific or rare relations.

## Why It Matters

1. **Knowledge graph construction**: RE is the primary method for extracting facts from text to populate knowledge bases like Wikidata and domain-specific ontologies. See `knowledge-graphs-for-nlp.md`.
2. **Biomedical NLP**: Extracting drug-gene interactions, protein-protein interactions, and disease-treatment relations from scientific literature accelerates biomedical research.
3. **Financial intelligence**: Extracting ownership, acquisition, and partnership relations from news and filings supports financial analysis.
4. **Intelligence analysis**: Identifying person-organization affiliations, event participation, and communication patterns from text supports security applications.
5. **Question answering**: Knowledge triples from RE directly answer factoid questions ("Where was Einstein born?") in `question-answering.md`.
6. **Search enhancement**: Extracted relations enable structured search and entity-centric knowledge panels.

## Key Technical Details

- **SemEval-2010 Task 8**: 9 relation types + NONE; SOTA ~89--90% F1 (BERT-based); CNN baseline ~82%.
- **TACRED**: 42 relation types, ~106k sentences; SOTA ~75% F1; more challenging due to class imbalance (~80% NONE).
- **DocRED**: Document-level RE with 96 relation types; SOTA ~65% F1, reflecting the difficulty of cross-sentence RE.
- **FewRel** (few-shot): 100 relations, 70k instances; 5-way 5-shot SOTA ~95% accuracy.
- **Distant supervision noise**: Roughly 30--40% of automatically labeled instances are incorrectly labeled in typical distantly supervised datasets.
- **Entity pair coverage**: In any sentence with two entities, the probability of an actual relation holding is typically only 10--20%, making the NONE class dominant.
- **Cross-sentence relations**: An estimated 25--40% of relational facts in text require information spanning multiple sentences, motivating document-level RE.

## Common Misconceptions

**"Relation extraction and relation classification are the same."** Relation classification assumes entity pairs are given and only assigns a label. Full relation extraction includes entity identification, pair enumeration, and classification -- a substantially harder pipeline.

**"Distant supervision produces clean training data."** The distant supervision assumption is frequently violated. Two entities may co-occur without the KB relation being expressed, or a different relation may hold. Noise-aware training (multi-instance learning, reinforcement learning for instance selection) is essential.

**"More relation types are always better."** Fine-grained relation inventories increase ambiguity and data sparsity. The choice of relation ontology should balance coverage against annotability and downstream utility. Coarser schemas often yield higher precision.

**"LLMs have replaced supervised relation extraction."** While LLMs show impressive zero-shot RE capabilities on common relations, they underperform supervised models on domain-specific, rare, or nuanced relation types. They also lack the consistency and controllability required for large-scale knowledge base construction. Supervised and distantly supervised methods remain essential for production systems.

## Connections to Other Concepts

- RE depends on `named-entity-recognition.md` to identify the entities between which relations are extracted.
- `dependency-parsing.md` provides syntactic features (shortest dependency path) that are among the strongest signals for RE.
- `coreference-resolution.md` links entity mentions across sentences, enabling cross-sentence relation extraction.
- RE outputs populate `knowledge-graphs-for-nlp.md` and support `information-extraction.md`.
- Distant supervision connects to `data-annotation-and-labeling.md` as an automatic labeling strategy.
- `text-classification.md` provides the classification framework that RE builds upon.
- `open-information-extraction.md` addresses RE without a predefined relation schema.
- `event-extraction.md` extends RE to event structures with multiple participants and temporal anchoring.
- Few-shot RE connects to `prompt-based-nlp.md` and `low-resource-nlp.md`.

## Further Reading

- Mintz et al., *Distant Supervision for Relation Extraction Without Labeled Data*, 2009 -- introduced the distant supervision paradigm that enabled large-scale RE training.
- Zeng et al., *Relation Classification via Convolutional Deep Neural Network*, 2014 -- the first successful CNN-based approach to relation classification.
- Baldini Soares et al., *Matching the Blanks: Distributional Similarity for Relation Learning*, 2019 -- demonstrated BERT-based relation extraction with entity markers.
- Han et al., *FewRel: A Large-Scale Supervised Few-Shot Relation Classification Dataset*, 2018 -- established the benchmark for few-shot relation extraction.
- Riedel et al., *Modeling Relations and Their Mentions Without Labeled Text*, 2010 -- introduced multi-instance learning to handle distant supervision noise.
- Miwa & Bansal, *End-to-End Relation Extraction Using LSTMs on Sequences and Tree Structures*, 2016 -- joint entity and relation extraction using sequence and dependency tree LSTMs.
