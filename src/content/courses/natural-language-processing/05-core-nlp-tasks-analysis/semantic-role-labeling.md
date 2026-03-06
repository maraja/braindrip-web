# Semantic Role Labeling

**One-Line Summary**: Semantic role labeling (SRL) identifies the predicate-argument structure of a sentence -- determining who did what to whom, where, when, and how -- bridging syntactic parsing and meaning representation.

**Prerequisites**: `syntax-and-grammar.md`, `dependency-parsing.md`, `constituency-parsing.md`, `named-entity-recognition.md`, `contextual-embeddings.md`

## What Is Semantic Role Labeling?

Imagine reading a news headline and mentally answering: Who performed the action? What was the action? Who or what was affected? Where and when did it happen? SRL automates this process. Given "The company fired the CEO in January," SRL identifies "fired" as the predicate, "The company" as the agent (ARG0), "the CEO" as the patient (ARG1), and "in January" as the temporal modifier (ARG-TMP).

Formally, SRL assigns **semantic roles** to spans of text with respect to a **predicate** (typically a verb, though nominal predicates are also annotated). The roles describe the relationship between the argument and the event: who initiated it (agent), who was affected (patient/theme), the instrument used, the location, the time, and so on. SRL sits between syntactic parsing and full semantic interpretation -- it abstracts over surface syntactic variation ("The CEO was fired by the company" yields the same roles) while stopping short of full logical meaning representation.

## How It Works

### Linguistic Frameworks

**PropBank** (Palmer et al., 2005) defines roles relative to each verb's specific usage (its "roleset"). Numbered arguments (ARG0 through ARG5) have verb-specific meanings: for "break," ARG0 is the breaker and ARG1 is the thing broken. Modifier arguments are shared across verbs: ARG-TMP (temporal), ARG-LOC (locative), ARG-MNR (manner), ARG-CAU (cause), ARG-PRP (purpose), and ARG-DIR (direction). PropBank annotates over 11,000 verb senses across ~113,000 predicate instances in the Penn Treebank.

**FrameNet** (Baker et al., 1998) takes a richer, frame-semantic approach. Each verb (or noun or adjective) evokes a **frame** -- a conceptual structure with named roles called **frame elements**. For the "Commerce_buy" frame, roles include Buyer, Goods, Seller, Money, and Purpose. FrameNet has ~1,200 frames and ~200,000 annotated sentences but less systematic coverage than PropBank.

### Predicate-Argument Structure

A typical SRL output for "Mary sold the car to John for $5,000":

```
Predicate: sold
ARG0 (Seller):   Mary
ARG1 (Goods):    the car
ARG2 (Buyer):    to John
ARG3 (Price):    for $5,000
```

The key insight is that semantic roles are preserved across syntactic alternations: "John bought the car from Mary for $5,000" maps to the same event structure with different syntactic realization.

### Span-Based vs. Dependency-Based SRL

**Span-based SRL** (CoNLL-2005 style) identifies argument spans in the surface string and labels them. This aligns with constituency-based annotation.

**Dependency-based SRL** (CoNLL-2009 style) identifies the syntactic head of each argument rather than the full span. This is more compact and aligns with dependency tree annotation.

Both formulations are actively used. Span-based SRL is more common in English, while dependency-based SRL suits languages with freer word order where constituents may be discontinuous.

### Neural SRL

**He et al. (2017)** demonstrated that a deep BiLSTM with highway connections could perform SRL without any syntactic input, achieving SOTA on CoNLL-2005 and CoNLL-2012. The model treats SRL as sequence labeling: given a sentence and a designated predicate, tag each token with its role using BIO notation.

The architecture:
1. Concatenate word embeddings with a predicate indicator feature (binary flag marking the target predicate).
2. Pass through 8 alternating forward/backward LSTM layers with highway connections.
3. Apply a softmax layer to predict BIO role tags.

This "syntax-free" approach achieved 83.1 F1 on CoNLL-2005, surpassing prior syntax-heavy systems and sparking debate about whether explicit syntax is needed for semantic analysis.

**BERT-based SRL** models (Shi & Lin, 2019) push F1 to ~86--87% on CoNLL-2005 and ~85--86% on CoNLL-2012 by replacing BiLSTMs with pre-trained transformer representations. These models further reduce the need for explicit syntactic features.

## Why It Matters

1. **Question answering**: SRL identifies answer candidates by matching question roles ("Who sold...?" -> ARG0) in `question-answering.md`.
2. **Information extraction**: Predicate-argument structures provide a structured representation of events for `event-extraction.md` and `information-extraction.md`.
3. **Machine translation**: Preserving semantic roles across languages improves translation quality, especially for divergent syntactic structures.
4. **Text summarization**: SRL identifies the core "who-did-what" skeleton of sentences, informing compression in `text-summarization.md`.
5. **Knowledge base population**: SRL output maps directly to knowledge graph triples (subject, relation, object) in `knowledge-graphs-for-nlp.md`.
6. **Reading comprehension**: Understanding semantic roles helps models reason about events and their participants.

## Key Technical Details

- **CoNLL-2005 (WSJ test, span-based)**: SOTA ~87% F1; He et al. (2017) without syntax achieved 83.1 F1; BERT-based models ~86--87%.
- **CoNLL-2012 (OntoNotes, span-based)**: SOTA ~86% F1; more diverse genres than CoNLL-2005.
- **PropBank coverage**: ~11,000 verb senses (rolesets); ARG0 and ARG1 cover >80% of all argument instances.
- **FrameNet coverage**: ~1,200 frames, ~13,000 lexical units, ~200,000 annotated sentences.
- **Syntax-free vs. syntax-aware**: The gap has narrowed from ~5 F1 points to ~1--2 F1 points, but syntactic features still help for long-range arguments and complex constructions.
- **Predicate identification**: Usually treated as a separate step; verbal predicate detection is >99% accurate, but nominal predicate identification is harder (~92%).
- **Argument span boundaries**: Most errors (40--50%) involve incorrect span boundaries rather than incorrect role labels.

## Common Misconceptions

**"SRL is the same as dependency parsing."** Dependency parsing captures syntactic relations (subject, object); SRL captures semantic roles (agent, patient). The passive sentence "The window was broken by the ball" has different syntactic subjects but the same ARG0 (ball) and ARG1 (window) in SRL. SRL abstracts over syntactic variation.

**"ARG0 always means agent."** In PropBank, numbered arguments are verb-specific. For most verbs, ARG0 is proto-agent and ARG1 is proto-patient, but for verbs like "receive," ARG0 is the recipient, not a prototypical agent. Always consult the verb's roleset.

**"SRL requires syntactic parsing as preprocessing."** He et al. (2017) showed that deep BiLSTMs can perform SRL competitively without any syntactic input. BERT-based models have further demonstrated that pre-trained contextual representations implicitly capture syntactic information sufficient for SRL.

**"PropBank and FrameNet are interchangeable."** They have different theoretical foundations. PropBank roles are numbered and verb-specific; FrameNet roles are named and frame-specific. PropBank has broader verb coverage; FrameNet provides richer semantic characterization. They complement each other.

## Connections to Other Concepts

- SRL builds on the syntactic structures from `dependency-parsing.md` and `constituency-parsing.md`, using them as features or as the representation basis for dependency-based SRL.
- `named-entity-recognition.md` identifies the entities that fill argument roles.
- SRL outputs feed `relation-extraction.md`, `event-extraction.md`, and `knowledge-graphs-for-nlp.md`.
- The `semantics.md` concept provides the linguistic theory of thematic roles underlying SRL.
- Neural SRL models use `bidirectional-rnns.md`, `long-short-term-memory.md`, and `contextual-embeddings.md`.
- `coreference-resolution.md` links different mentions of the same SRL argument across sentences.
- `question-answering.md` and `text-summarization.md` are direct downstream consumers of SRL output.

## Further Reading

- Palmer et al., *The Proposition Bank: An Annotated Corpus of Semantic Roles*, 2005 -- the foundational resource for verb-argument structure annotation.
- He et al., *Deep Semantic Role Labeling: What Works and What's Next*, 2017 -- the syntax-free deep BiLSTM model that redefined SRL baselines.
- Baker et al., *The Berkeley FrameNet Project*, 1998 -- introduced frame semantics as a computational resource.
- Carreras & Marquez, *Introduction to the CoNLL-2005 Shared Task: Semantic Role Labeling*, 2005 -- established the standard SRL benchmark.
- Shi & Lin, *Simple BERT Models for Relation Classification and Semantic Role Labeling*, 2019 -- demonstrated BERT's effectiveness for SRL with minimal architectural modification.
