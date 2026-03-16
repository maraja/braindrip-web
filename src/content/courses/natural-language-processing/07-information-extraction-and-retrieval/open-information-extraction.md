# Open Information Extraction

**One-Line Summary**: Extracting relation triples from text without predefined schemas -- domain-independent knowledge harvesting that scales across the open web.

**Prerequisites**: Information Extraction (`information-extraction.md`), Part-of-Speech Tagging (`05-core-nlp-tasks-analysis/part-of-speech-tagging.md`), Dependency Parsing (`05-core-nlp-tasks-analysis/dependency-parsing.md`).

## What Is Open Information Extraction?

Traditional information extraction requires a predefined schema: you decide in advance that you want to extract `(company, acquired, company)` relations and train a model specifically for that. But what if you want to extract *every* relationship mentioned in a billion web pages without knowing what those relationships will be? You cannot define schemas for all possible relations in advance.

Open Information Extraction (Open IE) solves this by extracting relation triples in the form **(subject, relation, object)** without requiring any predefined relation types, training data, or domain-specific engineering. Think of it as a universal fact vacuum: given any sentence, it extracts who did what to whom, what is related to what, and what properties things have -- all without being told what to look for.

Formally, given a sentence, an Open IE system produces a set of triples (arg1, rel, arg2) where arg1 and arg2 are noun phrase arguments and rel is a textual relation phrase (typically a verb phrase or a verb-mediated expression). For example, from "Albert Einstein was born in Ulm in 1879," an Open IE system might extract (Albert Einstein; was born in; Ulm) and (Albert Einstein; was born in; 1879). The relation strings are surface-level text, not mapped to a canonical ontology.

## How It Works

### The Open IE Paradigm

The key insight driving Open IE is that syntactic patterns can reliably signal semantic relations without domain knowledge. A verb connecting two noun phrases almost always expresses a relationship between them. Open IE systems exploit this by:

1. Identifying candidate argument pairs (noun phrases).
2. Extracting the relation expression connecting them (verb phrases, prepositional patterns).
3. Assigning a confidence score to each triple.

This requires no relation-specific training data, making it domain-independent by design.

### ReVerb (Fader et al., 2011)

ReVerb was the first Open IE system to achieve high precision by constraining extracted relation phrases to syntactically coherent verb-based expressions. It addressed the problem of *incoherent extractions* (fragmented or meaningless relation phrases) that plagued earlier systems like TextRunner.

**Syntactic constraint**: Relation phrases must match the POS pattern:
```
V | V P | V W* P
```
Where V = verb (including auxiliaries), P = preposition, W = any word. This captures patterns like "is," "was born in," "has been working on."

**Lexical constraint**: ReVerb discards relation phrases appearing in fewer than a threshold number of distinct argument pairs across a large corpus, filtering out rare/noisy patterns.

ReVerb processed 500 million web pages from the ClueWeb09 corpus, extracting over 15 million high-confidence triples. Precision at the top confidence tier exceeded 80%.

### OLLIE (Mausam et al., 2012)

OLLIE (Open Language Learning for Information Extraction) expanded Open IE beyond verb-mediated relations to capture:
- **Noun-mediated relations**: "Bill Gates, the founder of Microsoft" yields (Bill Gates; is the founder of; Microsoft).
- **Adjective-mediated relations**: "Edison was prolific" yields (Edison; was; prolific).
- **Context clauses**: Attributions and conditions attached to extractions, e.g., "According to Reuters, ..." adds a context clause to the triple.

OLLIE bootstraps extraction patterns from a high-precision seed set (ReVerb extractions aligned with dependency parses), then generalizes these patterns to capture new syntactic constructions. It improved recall by 1.9x over ReVerb while maintaining comparable precision.

### Stanford Open IE (Angeli et al., 2015)

Stanford Open IE takes a different approach: instead of pattern matching, it systematically decomposes long, complex sentences into short, self-contained clauses, then extracts one triple per clause. The process:

1. **Clause splitting**: Use natural logic and dependency parse tree operators to split "Obama, who was born in Hawaii, was the 44th president" into "Obama was born in Hawaii" and "Obama was the 44th president."
2. **Natural logic entailment**: Ensure each decomposed clause is entailed by the original sentence.
3. **Triple extraction**: Extract a single (subject, relation, object) triple from each short clause.

This decomposition-based approach handles complex sentences with relative clauses, conjunctions, and appositives more reliably than pattern-based methods.

### Modern Neural Open IE

Recent systems use neural sequence labeling or generation:

- **OpenIE6** (Kolluru et al., 2020): A BERT-based sequence labeling model that iteratively extracts multiple triples from a sentence. It uses a 2-D grid labeling scheme where each cell (i, j) indicates whether token i belongs to the subject, relation, or object of the j-th extraction. Achieves state-of-the-art F1 on the CaRB benchmark.
- **Multi2OIE** (Ro et al., 2020): Uses a BERT encoder with multi-head attention to predict argument and relation spans for multiple extractions simultaneously.
- **GenIE and generative approaches**: Frame Open IE as text generation, where a language model produces structured triples given an input sentence.

### Confidence Scoring

Open IE systems assign confidence scores to extracted triples, enabling downstream consumers to filter by reliability:
- **Logistic regression classifiers**: Trained on features like relation phrase length, POS patterns, and frequency (ReVerb, OLLIE).
- **Neural scoring**: BERT-based models score extraction plausibility (OpenIE6).
- **Calibration**: Confidence scores are often poorly calibrated; Platts scaling or isotonic regression can improve reliability.

## Why It Matters

1. **Knowledge base population**: Open IE feeds large-scale knowledge bases. NELL (Never-Ending Language Learner) and Google's Knowledge Vault used Open IE-style extraction to harvest millions of facts from the web (see `knowledge-graphs-for-nlp.md`).
2. **Question answering**: Open IE triples can be indexed and queried directly, supporting factoid QA without task-specific training (see `06-core-nlp-tasks-generation/question-answering.md`).
3. **Textual entailment support**: Decomposing sentences into atomic propositions aids natural language inference (see `08-semantic-understanding/natural-language-inference.md`).
4. **Scalability**: Because Open IE requires no domain-specific schemas, it scales to the entire web -- billions of pages across all domains simultaneously.
5. **Corpus analysis**: Researchers use Open IE to survey the claims and relationships expressed across large scientific literature collections.

## Key Technical Details

- **ReVerb extraction volume**: 15+ million triples from 500 million web pages with >80% precision at the highest confidence tier.
- **OLLIE recall improvement**: 1.9x higher recall than ReVerb at comparable precision, primarily from capturing noun-mediated and adjective-mediated relations.
- **OpenIE6 benchmarks**: F1 of ~52% on the CaRB (Crowdsourced Benchmark for Open IE) evaluation, compared to ~38% for ReVerb and ~45% for OLLIE.
- **Extraction speed**: Rule-based systems (ReVerb, Stanford Open IE) process 1,000-10,000 sentences/second on a single CPU; neural systems (OpenIE6) process 50-200 sentences/second on GPU.
- **Average extractions per sentence**: 1.5-3.0 triples per sentence for well-formed English text, depending on sentence complexity.

## Common Misconceptions

**"Open IE extractions are as precise as schema-based IE."** Open IE trades precision for generality. Relation phrases are surface-level strings, not canonical relations -- "was born in," "is from," and "hails from" are three separate relations in Open IE but map to the same `born_in` relation in schema-based IE. Canonicalization is a separate, unsolved problem.

**"Open IE works equally well on all text."** Performance degrades significantly on informal text (tweets, chat), highly technical text (legal documents), and languages other than English. Most Open IE research focuses on well-edited English text.

**"Open IE replaces traditional relation extraction."** Open IE and schema-based relation extraction (see `05-core-nlp-tasks-analysis/relation-extraction.md`) serve different use cases. When you know exactly which relations matter (e.g., extracting drug interactions from medical literature), schema-based RE with a trained model will outperform Open IE in precision and recall for those specific relations.

**"The (subject, relation, object) format captures all information."** Many facts require n-ary relations (temporal qualifiers, locations, conditions) that the basic triple format cannot represent. Extensions like OLLIE's context clauses and quint formats (5-tuples) partially address this.

## Connections to Other Concepts

- `information-extraction.md`: Open IE is the schema-free counterpart to traditional, schema-driven IE.
- `05-core-nlp-tasks-analysis/relation-extraction.md`: Schema-based relation extraction predicts from a fixed relation inventory; Open IE uses free-text relation phrases.
- `knowledge-graphs-for-nlp.md`: Open IE triples, after canonicalization, feed knowledge graph construction pipelines.
- `05-core-nlp-tasks-analysis/dependency-parsing.md`: Most Open IE systems rely on dependency parses to identify syntactic patterns.
- `event-extraction.md`: Events can be viewed as a special class of Open IE extractions with additional argument structure.
- `05-core-nlp-tasks-analysis/named-entity-recognition.md`: NER identifies the entity arguments that Open IE connects via relations.
- `05-core-nlp-tasks-analysis/semantic-role-labeling.md`: SRL identifies predicate-argument structure in a manner complementary to Open IE, with predefined role labels.

## Further Reading

- Banko et al., "Open Information Extraction from the Web," 2007 -- The original TextRunner paper that launched the Open IE paradigm.
- Fader et al., "Identifying Relations for Open Information Extraction," 2011 -- ReVerb, introducing syntactic and lexical constraints for high-precision Open IE.
- Mausam et al., "Open Language Learning for Information Extraction," 2012 -- OLLIE, extending Open IE to noun-mediated relations and contextual clauses.
- Angeli et al., "Leveraging Linguistic Structure for Open Domain Information Extraction," 2015 -- Stanford Open IE, using natural logic for clause decomposition.
- Kolluru et al., "OpenIE6: Iterative Grid Labeling and Coordination Analysis for Open Information Extraction," 2020 -- Neural Open IE achieving state-of-the-art performance on CaRB.
