# Knowledge Graphs for NLP

**One-Line Summary**: Structured knowledge representations connecting entities and relations in graph form -- enabling reasoning, retrieval, and grounding that complement the statistical patterns learned by language models.

**Prerequisites**: Information Extraction (`information-extraction.md`), Relation Extraction (`05-core-nlp-tasks-analysis/relation-extraction.md`), Word2Vec (`03-text-representation/word2vec.md`).

## What Is a Knowledge Graph?

Imagine a vast web where every node is a thing in the world -- a person, a city, a concept, a protein -- and every edge is a fact connecting two things: "Einstein" --born_in--> "Ulm," "Ulm" --located_in--> "Germany," "Einstein" --won--> "Nobel Prize in Physics." That web is a knowledge graph (KG): a structured, queryable representation of real-world knowledge stored as a network of entities and typed relations.

Formally, a knowledge graph is a directed, labeled multigraph G = (E, R, T), where E is a set of entities, R is a set of relation types, and T is a set of triples (h, r, t) with h, t in E and r in R. Each triple asserts a fact: the head entity h is related to the tail entity t by relation r. Knowledge graphs also store entity attributes (e.g., population = 120,000) and type hierarchies (e.g., Ulm is_a City is_a Location). For NLP, KGs provide the structured factual backbone that language models lack -- explicit, verifiable, and updatable world knowledge.

## How It Works

### RDF Triples

The Resource Description Framework (RDF) is the W3C standard for representing knowledge graph data. Every fact is a triple (subject, predicate, object):
```
<http://dbpedia.org/resource/Albert_Einstein> <http://dbpedia.org/ontology/birthPlace> <http://dbpedia.org/resource/Ulm>
```

RDF uses URIs for global uniqueness and supports literals (strings, numbers, dates) as objects. SPARQL is the standard query language for RDF graphs, enabling complex graph queries like "find all Nobel laureates born in German cities with population > 100,000."

### Knowledge Graph Construction from Text

Building a KG from text follows the IE pipeline (see `information-extraction.md`):

1. **Entity extraction and linking**: Identify entity mentions via NER (see `05-core-nlp-tasks-analysis/named-entity-recognition.md`) and link them to canonical KG entities (entity linking/disambiguation). For example, linking "Einstein" in text to the Wikidata entity Q937.
2. **Relation extraction**: Classify the relation between entity pairs (see `05-core-nlp-tasks-analysis/relation-extraction.md`). Both supervised models and distant supervision (Mintz et al., 2009) are used.
3. **Open IE integration**: Extract schema-free triples (see `open-information-extraction.md`) and map them to canonical relations through relation canonicalization.
4. **Event extraction**: Extract event-centric facts with typed arguments (see `event-extraction.md`).
5. **Validation and fusion**: Deduplicate facts, resolve conflicts, and assign confidence scores. Knowledge graph completion models (below) can also predict missing links.

### Prominent Knowledge Graphs

- **Freebase** (Bollacker et al., 2008): Google's structured knowledge base, containing 1.9 billion triples about 125 million entities before its deprecation in 2016. Its data was migrated to Wikidata. Freebase powered Google's original Knowledge Graph panels.
- **Wikidata** (Vrandecic and Krotzsch, 2014): A free, collaborative, multilingual KG with 100+ million items and 1.5+ billion statements. Edited by a global community and serving as the structured backbone for Wikipedia.
- **DBpedia** (Auer et al., 2007): Extracts structured data from Wikipedia infoboxes, producing ~400 million triples covering 4.5 million entities. Linked to external datasets via the Linked Open Data cloud.
- **ConceptNet** (Speer et al., 2017): A commonsense knowledge graph with 21 million edges connecting everyday concepts via relations like IsA, UsedFor, CapableOf, HasProperty. Derived from crowdsourced data (Open Mind Common Sense) and games with a purpose. Critical for commonsense reasoning (see `08-semantic-understanding/commonsense-reasoning.md`).

### Knowledge Graph Embeddings

To reason over knowledge graphs computationally, entities and relations are embedded as dense vectors in continuous space. The goal: for a true triple (h, r, t), the embedding-based score function f(h, r, t) should be high; for false triples, it should be low.

**TransE** (Bordes et al., 2013): The simplest and most elegant embedding model. It represents entities as points and relations as translation vectors in R^d: for a true triple, **h + r ≈ t**. The scoring function is:

```
f(h, r, t) = -||h + r - t||
```

Training minimizes the distance for positive triples and maximizes it for corrupted (negative) triples via margin-based ranking loss. TransE is fast (O(d) per triple) and effective for one-to-one relations but struggles with one-to-many, many-to-one, and symmetric relations.

**RotatE** (Sun et al., 2019): Represents relations as rotations in complex vector space. Each entity is a complex vector, and each relation performs element-wise rotation: **t = h ○ r**, where ○ is the Hadamard product and |r_i| = 1. RotatE can model symmetric, antisymmetric, inversion, and composition relation patterns -- all of which TransE cannot. It achieves state-of-the-art results on FB15k-237 (Hits@10: 53.3%) and WN18RR (Hits@10: 57.1%).

Other notable models: DistMult (bilinear scoring), ComplEx (complex-valued DistMult), ConvE (convolutional), and TuckER (tensor factorization).

### Link Prediction

Link prediction is the core KG completion task: given a query (h, r, ?) or (?, r, t), rank all candidate entities to predict the missing element. Evaluation metrics:

- **Hits@k**: Fraction of test triples where the correct entity ranks in the top-k predictions. Hits@10 is standard.
- **Mean Reciprocal Rank (MRR)**: The average reciprocal rank of the correct entity. Higher is better.
- **Mean Rank**: Average rank of the correct entity. Sensitive to outliers.

Benchmark datasets: FB15k-237 (14,541 entities, 237 relations, 310,116 triples) and WN18RR (40,943 entities, 11 relations, 93,003 triples).

### KG-Enhanced NLP

Knowledge graphs enhance a wide range of NLP tasks:

- **Entity linking**: Given a mention "Apple" in text, determine whether it refers to Apple Inc. or the fruit by comparing the textual context with the KG neighborhood of each candidate entity.
- **Fact verification**: Cross-reference claims with KG facts. "Einstein was born in Munich" can be flagged as false by checking the birthPlace triple in Wikidata.
- **Knowledge-grounded generation**: Inject KG triples into language model prompts or attention mechanisms to reduce hallucination and improve factual accuracy.
- **Relation extraction with distant supervision**: Align KG triples with text to automatically generate training data for relation extraction models (Mintz et al., 2009).
- **Question answering over KGs (KGQA)**: Parse natural language questions into SPARQL or graph traversal queries. Systems like GrailQA handle complex multi-hop questions over Freebase.

## Why It Matters

1. **Grounding LLMs in facts**: Language models hallucinate; knowledge graphs provide verifiable facts. Retrieval-augmented generation (RAG) increasingly uses KG lookups alongside document retrieval.
2. **Structured search**: KGs enable semantic search beyond keyword matching -- querying "chemists who won Nobel Prizes after 2000" requires structured reasoning that text search cannot provide.
3. **Data integration**: KGs unify information from heterogeneous sources (databases, text, APIs) into a common representation, enabling cross-source querying.
4. **Drug discovery and biomedicine**: Biomedical KGs (UMLS, DrugBank, Hetionet) link drugs, diseases, genes, and side effects, enabling computational drug repurposing.
5. **Recommendation systems**: KG-based recommenders explain suggestions via relation paths ("recommended because you liked X, which shares director Y with Z").

## Key Technical Details

- **Scale**: Wikidata contains 100+ million items and 1.5+ billion statements; Google's Knowledge Graph reportedly contains 500+ billion facts.
- **TransE embedding dimensions**: Typically d = 100-500. Training on FB15k-237 takes 30-60 minutes on a single GPU.
- **RotatE on FB15k-237**: MRR = 0.338, Hits@1 = 0.241, Hits@10 = 0.533. On WN18RR: MRR = 0.476, Hits@10 = 0.571.
- **Entity linking accuracy**: State-of-the-art systems achieve >90% accuracy on TAC-KBP entity linking benchmarks for English text.
- **ConceptNet coverage**: 21 million edges, 8 million nodes, 36 relation types, data sourced from 304 languages. NumberBatch embeddings trained on ConceptNet improve performance on commonsense reasoning benchmarks by 5-15%.

## Common Misconceptions

**"Knowledge graphs are just databases."** KGs differ from relational databases in their graph-native schema (triples, not tables), open-world assumption (absence of a fact does not mean it is false), and emphasis on entity identity and linking across sources. They are designed for flexible, evolving schema and cross-source integration.

**"KG embeddings understand the meaning of relations."** Embedding models learn statistical patterns from the graph structure -- they do not understand that "born_in" implies a physical location or that "married_to" is symmetric. They capture co-occurrence patterns, not deep semantics.

**"Large language models make knowledge graphs obsolete."** LLMs store knowledge implicitly in parameters, but this knowledge is unverifiable, hard to update, and prone to hallucination. KGs provide explicit, auditable, and dynamically updatable facts. The emerging paradigm combines both: KG-augmented LLMs.

**"Bigger knowledge graphs are always better."** KG quality matters more than size. Noisy or contradictory triples degrade downstream task performance. Quality metrics (precision, freshness, completeness) are as important as scale.

## Connections to Other Concepts

- `information-extraction.md`: The primary method for constructing KGs from text -- NER, relation extraction, and event extraction feed the graph.
- `open-information-extraction.md`: Open IE triples, after canonicalization, populate KGs at web scale.
- `event-extraction.md`: Events with argument structures contribute event-centric knowledge to KGs.
- `05-core-nlp-tasks-analysis/named-entity-recognition.md`: NER identifies the entity mentions that become KG nodes.
- `05-core-nlp-tasks-analysis/relation-extraction.md`: RE identifies the typed relationships that become KG edges.
- `08-semantic-understanding/commonsense-reasoning.md`: ConceptNet and ATOMIC provide commonsense knowledge as structured graphs.
- `03-text-representation/word2vec.md`: KG embedding methods (TransE, RotatE) draw conceptual inspiration from word embedding approaches.
- `06-core-nlp-tasks-generation/question-answering.md`: KGQA systems answer questions by traversing knowledge graphs.

## Further Reading

- Bordes et al., "Translating Embeddings for Modeling Multi-relational Data," 2013 -- TransE, the foundational KG embedding model proposing the translation principle h + r ≈ t.
- Sun et al., "RotatE: Knowledge Graph Embedding by Relational Rotation in Complex Space," 2019 -- Rotation-based embeddings handling symmetric, antisymmetric, inversion, and composition patterns.
- Vrandecic and Krotzsch, "Wikidata: A Free Collaborative Knowledgebase," 2014 -- The paper introducing Wikidata, the largest open-domain collaborative KG.
- Speer et al., "ConceptNet 5.5: An Open Multilingual Graph of General Knowledge," 2017 -- The commonsense KG connecting everyday concepts via 36 relation types.
- Ji et al., "A Survey on Knowledge Graphs: Representation, Acquisition, and Application," 2022 -- Comprehensive survey covering KG construction, embedding, and application to NLP.
- Hogan et al., "Knowledge Graphs," 2021 -- A thorough technical overview spanning representation, querying, reasoning, and learning over KGs.
