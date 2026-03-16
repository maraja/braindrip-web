# Information Extraction

**One-Line Summary**: Automatically extracting structured knowledge -- entities, relations, and events -- from unstructured text at scale, turning the flood of natural language into queryable data.

**Prerequisites**: Named Entity Recognition (`05-core-nlp-tasks-analysis/named-entity-recognition.md`), Relation Extraction (`05-core-nlp-tasks-analysis/relation-extraction.md`), Semantic Role Labeling (`05-core-nlp-tasks-analysis/semantic-role-labeling.md`).

## What Is Information Extraction?

Imagine reading thousands of news articles and filling in a spreadsheet with every company acquisition mentioned -- who acquired whom, for how much, and when. A human analyst would take weeks; an Information Extraction (IE) system does it in minutes. IE is the automated librarian that reads unstructured text and produces structured records a database can store.

Formally, Information Extraction is the task of identifying specific pieces of information from natural language text and organizing them into predefined structures such as tables, knowledge bases, or templates. Unlike Information Retrieval (see `information-retrieval.md`), which finds *documents* relevant to a query, IE looks *inside* documents to pull out specific facts. The output is structured data: entity mentions, typed relations between entities, events with their participants, and filled templates with attribute-value pairs.

## How It Works

### The IE Pipeline

Classical IE follows a cascade of increasingly complex subtasks:

1. **Named Entity Recognition (NER)**: Identify entity mentions and classify them into types (PERSON, ORGANIZATION, LOCATION, DATE, etc.). See `05-core-nlp-tasks-analysis/named-entity-recognition.md` for details.
2. **Coreference Resolution**: Link different mentions of the same entity ("Google," "the company," "it"). See `05-core-nlp-tasks-analysis/coreference-resolution.md`.
3. **Relation Extraction**: Classify the semantic relationship between entity pairs -- e.g., (Google, acquired, YouTube) is an `acquisition` relation. See `05-core-nlp-tasks-analysis/relation-extraction.md`.
4. **Event Extraction**: Identify event triggers ("acquired," "exploded") and fill event-specific argument roles (buyer, target, price, date). See `event-extraction.md`.

Each stage feeds the next, and errors propagate downward -- a missed entity in step 1 means a missed relation in step 3.

### Template Filling and Slot Filling

Template filling is one of the oldest IE formulations, dating to the MUC (Message Understanding Conference) evaluations in the late 1980s. Given a predefined template (e.g., a terrorist attack with slots for perpetrator, target, weapon, date, location), the system reads a document and fills in each slot.

Slot filling, formalized in the TAC-KBP (Text Analysis Conference -- Knowledge Base Population) evaluations starting in 2009, focuses on populating knowledge base entries for specific entities. Given an entity like "Barack Obama," the system must find values for slots like `per:spouse`, `per:date_of_birth`, `per:schools_attended` from a large text corpus.

### Rule-Based vs. ML-Based IE

**Rule-based IE** uses hand-crafted patterns -- often lexico-syntactic rules or regular expressions over dependency parse trees. For example, a pattern like `[ORG] acquired [ORG] for [MONEY]` captures acquisition events. Systems like GATE (General Architecture for Text Engineering) provide frameworks for building such rule cascades. Advantages: high precision, interpretability, no labeled data needed. Disadvantages: low recall, brittle, expensive to maintain.

**ML-based IE** treats each subtask as a classification or sequence labeling problem. CRFs (Conditional Random Fields) dominated NER for a decade. SVMs and kernel methods were standard for relation extraction. Feature engineering was extensive: lexical features, POS tags, dependency paths, gazetteer membership.

### Modern End-to-End Neural IE

Modern systems replace the cascade with joint or end-to-end neural architectures:

- **Joint entity and relation extraction**: Models like SpERT (Eberts and Ulges, 2020) and PFN (Yan et al., 2021) extract entities and relations simultaneously, avoiding pipeline error propagation. BERT-based encoders produce span representations that are scored for entity types and pairwise relation labels.
- **Generative IE**: Systems like TANL (Paolini et al., 2021) and UIE (Lu et al., 2022) cast IE as sequence-to-sequence generation, producing structured output strings from input text using T5 or BART. This unifies NER, relation extraction, and event extraction under a single framework.
- **Prompt-based IE**: With large language models, IE can be formulated as prompted generation -- e.g., "Extract all (person, works_at, organization) triples from the following text." GPT-4-class models achieve competitive results on relation extraction benchmarks in zero-shot and few-shot settings.

### The ACE and TAC-KBP Evaluation Programs

**ACE (Automatic Content Extraction)**: Running from 1999 to 2008, ACE defined standard entity types (7 types), relation types (6 major types, 18 subtypes), and event types (8 types, 33 subtypes). The ACE 2005 dataset remains a widely used benchmark, with state-of-the-art models achieving ~90% F1 on entity detection and ~65-70% F1 on event argument extraction.

**TAC-KBP**: From 2009 onward, TAC-KBP shifted focus to knowledge base population -- extracting slot fillers for entity profiles from large document collections. Tasks included slot filling, entity linking, event detection, and belief/sentiment evaluation. Best systems achieved ~38-42% F1 on the full slot filling task, highlighting the difficulty of corpus-level IE.

## Why It Matters

1. **Knowledge base construction**: IE is the backbone of populating knowledge graphs like Wikidata and Google's Knowledge Graph from the billions of web pages that exist only as text.
2. **Biomedical text mining**: Extracting drug-gene interactions, protein-protein interactions, and adverse drug events from PubMed's 36+ million abstracts accelerates biomedical research.
3. **Intelligence and security**: Government agencies use IE to extract entities, relationships, and events from news and social media at scale for situational awareness.
4. **Business intelligence**: Automatically tracking mergers, executive changes, product launches, and earnings data from financial filings and news.
5. **Question answering support**: Structured knowledge extracted by IE feeds the retrieval component of QA systems (see `06-core-nlp-tasks-generation/question-answering.md`).

## Key Technical Details

- **ACE 2005 benchmarks (2024 SOTA)**: Entity detection F1 ~90%, relation extraction F1 ~75%, event trigger classification F1 ~78%, event argument extraction F1 ~58-65%.
- **TAC-KBP slot filling**: Best systems reach ~42% F1 end-to-end -- the bottleneck is recall across large corpora.
- **Pipeline vs. joint models**: Joint entity-relation extraction improves relation F1 by 2-5 points over pipeline approaches on benchmarks like ACE 2005 and SciERC.
- **Data efficiency**: Prompt-based IE with GPT-4 achieves within 5-10% of fine-tuned BERT models on relation extraction using zero examples, but at significantly higher inference cost.
- **Distant supervision**: Mintz et al. (2009) proposed aligning knowledge base triples with text to generate noisy training data -- a technique that produces large but label-noisy datasets (estimated 10-30% label noise).

## Common Misconceptions

**"IE and NER are the same thing."** NER is one component of the IE pipeline. IE encompasses relation extraction, event extraction, template filling, and temporal reasoning -- all building on entity recognition as a foundation.

**"IE requires large annotated datasets for every new domain."** While supervised IE benefits from labeled data, transfer learning from pre-trained models, distant supervision, and few-shot prompting have dramatically reduced the annotation burden. Modern systems can bootstrap IE in new domains with tens of examples rather than thousands.

**"End-to-end neural models always outperform rule-based IE."** In narrow, well-defined domains (e.g., extracting dates and amounts from financial filings), hand-crafted rules can achieve near-perfect precision. The advantage of neural models emerges in broad, open-domain settings with diverse linguistic expressions.

**"IE produces perfectly clean structured data."** IE outputs are noisy -- typical F1 scores of 60-80% mean significant errors. Downstream consumers of IE output must handle uncertainty, duplicates, and contradictions.

## Connections to Other Concepts

- `05-core-nlp-tasks-analysis/named-entity-recognition.md`: The first stage of the IE pipeline -- identifying entity mentions in text.
- `05-core-nlp-tasks-analysis/relation-extraction.md`: The second stage -- classifying semantic relationships between identified entities.
- `event-extraction.md`: The most complex stage -- detecting events and their argument structures.
- `open-information-extraction.md`: Schema-free IE that does not require predefined relation types.
- `knowledge-graphs-for-nlp.md`: IE is the primary method for constructing and populating knowledge graphs from text.
- `information-retrieval.md`: While IR finds relevant documents, IE extracts structured facts from within them -- the two are often combined in pipeline systems.
- `05-core-nlp-tasks-analysis/coreference-resolution.md`: Essential for linking entity mentions across a document before extraction.

## Further Reading

- Jurafsky and Martin, *Speech and Language Processing*, Chapter 17, 2024 -- Comprehensive textbook treatment of IE covering NER, relation extraction, and event extraction.
- Mintz et al., "Distant Supervision for Relation Extraction without Labeled Data," 2009 -- Introduced the distant supervision paradigm that dramatically scaled relation extraction training data.
- Lu et al., "Unified Structure Generation for Universal Information Extraction," 2022 -- Proposed UIE, a generative framework unifying all IE tasks under a single model architecture.
- Eberts and Ulges, "Span-based Joint Entity and Relation Extraction with Transformer Pre-training," 2020 -- SpERT, a influential joint extraction model using BERT span representations.
- Grishman, "Twenty-Five Years of Information Extraction," 2019 -- Historical survey of the field from MUC through deep learning, by one of the field's founders.
