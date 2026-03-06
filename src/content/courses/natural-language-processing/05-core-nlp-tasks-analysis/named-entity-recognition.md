# Named Entity Recognition

**One-Line Summary**: Named entity recognition (NER) identifies and classifies spans of text that refer to real-world entities such as persons, organizations, locations, dates, and other domain-specific categories.

**Prerequisites**: `part-of-speech-tagging.md`, `contextual-embeddings.md`, `bidirectional-rnns.md`, `bert.md`, `data-annotation-and-labeling.md`

## What Is Named Entity Recognition?

Imagine highlighting every name, place, organization, and date in a newspaper article with different colored markers -- yellow for people, blue for locations, green for organizations, and red for dates. NER does exactly this automatically: given raw text, it identifies entity mentions and assigns each a semantic type.

Formally, NER is a **sequence labeling** task: given an input sequence of tokens $x_1, x_2, \dots, x_n$, the model assigns a label $y_i$ to each token from a set that includes both entity types and a special non-entity tag ("O" for Outside). The standard label set includes PER (person), ORG (organization), LOC (location), and MISC (miscellaneous), though domain-specific schemas add types like DISEASE, CHEMICAL, GENE (biomedical), or MONEY, PERCENT, DATE (financial). NER is a foundational step in information extraction pipelines, feeding directly into `relation-extraction.md`, `coreference-resolution.md`, and `knowledge-graphs-for-nlp.md`.

## How It Works

### The BIO/IOB2 Tagging Scheme

Because entities span multiple tokens, NER uses a positional tagging scheme. In IOB2 (Inside-Outside-Beginning), each entity-starting token gets a B-TYPE tag, continuation tokens get I-TYPE, and non-entity tokens get O:

```
[Barack]  [Obama]  [visited]  [New]   [York]   [City]
 B-PER    I-PER    O          B-LOC   I-LOC    I-LOC
```

This encoding resolves adjacency ambiguity: two consecutive entities of the same type are distinguished by the B tag starting the second entity.

### CRF-Based Approaches

Conditional Random Fields (CRFs) model the conditional probability of the entire label sequence given the input, capturing dependencies between adjacent labels (e.g., I-PER should not follow B-LOC). Hand-crafted features include word shapes (capitalization, digits), prefixes/suffixes, gazetteer membership, and POS tags from `part-of-speech-tagging.md`. CRF-based systems achieved ~89 F1 on CoNLL-2003 English NER.

### BiLSTM-CRF

Lample et al. (2016) introduced the BiLSTM-CRF architecture that became the standard neural NER model for several years. The pipeline:

1. **Character-level CNN/LSTM** encodes sub-word features (capturing morphology, capitalization).
2. **Word embeddings** (pre-trained GloVe or Word2Vec) provide semantic features.
3. **Bidirectional LSTM** contextualizes each token using left and right context.
4. **CRF layer** on top models label-transition constraints, ensuring valid BIO sequences.

This architecture achieved ~91 F1 on CoNLL-2003 without hand-crafted features, demonstrating that neural representations could replace manual feature engineering.

### BERT for NER

Fine-tuning BERT for NER treats each sub-word token as a classification target. Since BERT uses WordPiece tokenization, entity labels are typically assigned only to the first sub-token of each word, and the remaining sub-tokens are ignored during loss computation. BERT-large achieves ~92.8 F1 on CoNLL-2003; with document-level context and careful hyperparameter tuning, scores exceed 93 F1.

### Nested and Few-Shot NER

**Nested NER** handles overlapping entities: in "Bank of America headquarters," both "Bank of America" (ORG) and "America" (LOC) are valid entities. Span-based models that classify all possible spans, rather than tagging individual tokens, naturally handle nesting.

**Few-shot NER** addresses the challenge of recognizing new entity types with minimal labeled examples. Approaches include prototype networks that learn entity-type representations from a handful of examples and prompt-based methods that reformulate NER as a text generation task using large language models.

## Why It Matters

1. **Information extraction backbone**: NER is the first step in extracting structured knowledge from unstructured text, feeding `relation-extraction.md` and `knowledge-graphs-for-nlp.md`.
2. **Search and indexing**: Named entities are high-value index terms; entity-aware search dramatically improves precision for queries about specific people, places, or organizations.
3. **Document understanding**: Legal, financial, and medical documents require entity identification for automated processing (e.g., extracting party names from contracts).
4. **Content personalization**: Identifying entities in news articles enables topic linking, recommendation, and knowledge panel generation.
5. **De-identification**: In healthcare and legal domains, NER identifies protected health information (PHI) and personally identifiable information (PII) for anonymization.

## Key Technical Details

- **CoNLL-2003 English benchmark**: 4 entity types (PER, LOC, ORG, MISC); SOTA ~94 F1 (ensemble models with document context).
- **OntoNotes 5.0**: 18 entity types; SOTA ~92 F1; more diverse and challenging than CoNLL-2003.
- **BiLSTM-CRF (Lample et al., 2016)**: ~91.0 F1 on CoNLL-2003 without external gazetteers.
- **BERT-large fine-tuned**: ~92.8 F1 on CoNLL-2003; with additional techniques (document context, entity typing), ~93.5+ F1.
- **Biomedical NER** (BC5CDR dataset): chemical/disease recognition at ~90 F1 using BioBERT.
- **Speed**: CRF-based systems process ~10,000 tokens/sec on CPU; BERT NER processes ~5,000 tokens/sec on GPU.
- **Annotation cost**: NER annotation typically requires 2--5 minutes per 100-token passage, with inter-annotator agreement (F1) around 95--97% for well-defined entity types.

## Common Misconceptions

**"NER is just dictionary lookup."** Gazetteer-based lookup catches known entities but misses novel ones ("Elon Musk's new company Neuralink" before it was widely known), ambiguous mentions ("Apple" as company vs. fruit), and morphological variants. Context-dependent classification is essential.

**"NER and entity linking are the same task."** NER identifies entity mentions and their types; entity linking (or entity disambiguation) maps those mentions to specific entries in a knowledge base (e.g., mapping "Obama" to the Wikidata entity Q76). They are related but distinct pipeline stages.

**"Flat NER is sufficient for all applications."** Many real-world texts contain nested entities ("University of California, Berkeley" contains LOC "California" inside ORG). Flat IOB tagging cannot represent overlaps, motivating span-based and layered approaches.

**"High F1 on CoNLL-2003 means NER is solved."** CoNLL-2003 is a clean, news-domain benchmark. Performance drops 10--20 F1 points on noisy social media text, low-resource languages, and domains with specialized entity types (biomedical, legal). Robustness and generalization remain open challenges.

## Connections to Other Concepts

- NER extends the sequence labeling paradigm of `part-of-speech-tagging.md` to entity-level spans.
- Entity mentions identified by NER feed directly into `relation-extraction.md` for structured knowledge extraction.
- `coreference-resolution.md` links different NER mentions that refer to the same entity.
- The BiLSTM-CRF architecture builds on `bidirectional-rnns.md` and `long-short-term-memory.md`.
- Fine-tuning approaches leverage `bert.md` and `contextual-embeddings.md`.
- NER is a core component of `information-extraction.md` and `knowledge-graphs-for-nlp.md` pipelines.
- `data-annotation-and-labeling.md` covers the annotation schemes and inter-annotator agreement metrics critical for NER dataset creation.

## Further Reading

- Lample et al., *Neural Architectures for Named Entity Recognition*, 2016 -- introduced the BiLSTM-CRF architecture that became the neural NER standard.
- Devlin et al., *BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding*, 2019 -- demonstrated that fine-tuning pre-trained transformers advances NER SOTA.
- Tjong Kim Sang & De Meulder, *Introduction to the CoNLL-2003 Shared Task: Language-Independent Named Entity Recognition*, 2003 -- established the most widely-used NER benchmark.
- Li et al., *A Survey on Deep Learning for Named Entity Recognition*, 2020 -- comprehensive survey covering architectures, encodings, and emerging directions.
- Ratinov & Roth, *Design Challenges and Misconceptions in Named Entity Recognition*, 2009 -- influential analysis of BIO vs. BILOU tagging, gazetteers, and feature design choices.
