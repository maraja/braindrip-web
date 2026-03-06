# Textual Entailment

**One-Line Summary**: Textual entailment is the task of determining whether the meaning of one text (the hypothesis) can be logically inferred from another text (the premise), forming the foundation of computational semantic inference.

**Prerequisites**: `semantics.md`, `text-classification.md`, `sentence-embeddings.md`, `attention-mechanism.md`, `bert.md`.

## What Is Textual Entailment?

Imagine a courtroom where a lawyer presents a piece of evidence (the premise) and makes a claim (the hypothesis). The judge must decide: does the evidence actually support that claim? Textual entailment poses exactly this question to a machine. Given a premise P and a hypothesis H, the system must determine whether P logically implies H -- whether a human reading P would reasonably conclude that H is true.

For example, given P = "The cat sat on the mat in the living room" and H = "An animal was on a piece of furniture," entailment holds because a cat is an animal, a mat can be considered a piece of furniture, and "sat on" implies "was on." Crucially, this inference requires lexical knowledge (cat is an animal), world knowledge (a mat is a type of furnishing), and logical reasoning (the spatial relationship is preserved).

Textual entailment was formalized as a unifying framework for semantic inference by Dagan, Glickman, and Magnini (2005), who argued that many NLP tasks -- question answering, information extraction, summarization, machine translation evaluation -- implicitly require recognizing entailment relationships. If a QA system retrieves a passage that entails the expected answer, it has found a correct response. If a summary entails the key claims of the source document, it is faithful.

The task has evolved from binary classification (entailment vs. non-entailment) to the more informative three-way classification: **entailment** (H follows from P), **contradiction** (H is incompatible with P), and **neutral** (H is neither supported nor contradicted by P). This three-way framing is now standard and is synonymous with natural language inference (see `natural-language-inference.md`).

## How It Works

### The RTE Challenge

The Recognizing Textual Entailment (RTE) Challenge, launched in 2005 as part of the PASCAL network, was the first systematic evaluation of textual entailment systems. The challenge provided text-hypothesis pairs with binary labels (entailment or not-entailment).

- **RTE-1 (2005)**: 800 development + 800 test pairs, drawn from QA, information retrieval, information extraction, and comparable documents tasks.
- **RTE-2 (2006)**: Similar size, refined guidelines, introduced multi-source pair generation.
- **RTE-3 (2007)**: Added a pilot task for answer validation.
- **RTE-5 (2009)**: Introduced a search task requiring systems to find entailing sentences in a corpus.

Each RTE dataset was deliberately small (hundreds to low thousands of pairs), reflecting the difficulty and cost of expert annotation. Accuracy on RTE-1 ranged from 50% (random baseline) to approximately 59% for the best systems, highlighting the challenge.

### PASCAL RTE Datasets and Evolution

The PASCAL RTE datasets were carefully constructed to require diverse reasoning capabilities:

- **Lexical inference**: "bought" entails "acquired" (synonym/hypernym relations)
- **Syntactic variation**: Active/passive alternation preserving meaning
- **World knowledge**: "Paris is the capital of France" supports "The Eiffel Tower is in France's capital" only with background knowledge
- **Numerical reasoning**: "More than 100 people attended" entails "Dozens of people attended"
- **Temporal reasoning**: Inferring event ordering from tense and temporal markers

Later datasets expanded the scope. The SICK dataset (Sentences Involving Compositional Knowledge, Marelli et al., 2014) focused on compositional semantics with 10,000 sentence pairs. SNLI (Bowman et al., 2015) and MultiNLI (Williams et al., 2018) scaled to hundreds of thousands of pairs, enabling neural approaches (covered in detail in `natural-language-inference.md`).

### Feature-Based Approaches

Early RTE systems relied on manually engineered features capturing various dimensions of the premise-hypothesis relationship:

**Lexical overlap features**: Word overlap, BLEU-style n-gram precision between P and H, and edit distance. Higher overlap between H and P correlates with entailment, though this is easily fooled by word order changes.

**Semantic similarity features**: WordNet-based similarity between aligned word pairs, distributional similarity from co-occurrence statistics, and paraphrase database (PPDB) matching.

**Syntactic features**: Dependency tree matching -- checking whether the syntactic structure of H can be embedded in or derived from the structure of P through syntactic transformations.

**Logical features**: Translating P and H into logical forms and checking entailment via theorem proving or model building. The BLUE system (Bos and Markert, 2005) converted sentences to first-order logic and used a theorem prover, achieving competitive RTE results.

**Alignment-based approaches**: MacCartney and Manning's (2008) natural logic approach aligned words and phrases between P and H and classified each alignment as equivalent, forward entailing, reverse entailing, negating, or independent. The composition of these local relations determined the global entailment relation.

### Neural Approaches

Neural models for textual entailment process premise and hypothesis through shared or separate encoders and predict the entailment label from their representations.

**Sentence encoding models**: Encode P and H independently into fixed-length vectors, then classify the relationship from the concatenation of these vectors (and their element-wise difference and product). Bowman et al. (2015) established this framework with LSTMs on SNLI.

**Cross-sentence attention models**: Rather than encoding P and H independently, these models compute attention between all pairs of words in P and H. The Decomposable Attention Model (Parikh et al., 2016) achieved 86.8% accuracy on SNLI using only word-level attention alignment, demonstrating that fine-grained word interaction is critical. ESIM (Enhanced Sequential Inference Model by Chen et al., 2017) combined BiLSTM encoding with cross-sentence attention, reaching 88.0% on SNLI.

**Pre-trained transformer models**: BERT (Devlin et al., 2018) treats entailment as sentence-pair classification: P and H are concatenated with a [SEP] token, and the [CLS] representation is used for classification. BERT-large achieved approximately 91% on SNLI and approximately 86% on MultiNLI, establishing the current paradigm. Later models (RoBERTa, DeBERTa, T5) further improve these numbers.

### The Three-Way Classification

The shift from binary to three-way classification (entailment, contradiction, neutral) added significant nuance:

- **Entailment**: P = "A dog is running through a field." H = "An animal is moving outdoors." (H follows from P)
- **Contradiction**: P = "A dog is running through a field." H = "A cat is sleeping on a couch." (H conflicts with P)
- **Neutral**: P = "A dog is running through a field." H = "The dog is chasing a ball." (H is possible but not necessarily implied by P)

The neutral category is particularly challenging because it captures the vast space of statements that are compatible with but not entailed by the premise.

## Why It Matters

1. **Unifying framework for NLU**: Dagan et al. (2005) showed that QA, IE, summarization, and MT evaluation can all be cast as entailment problems, making it a general-purpose semantic reasoning benchmark.
2. **Fact verification**: Checking whether a claim is supported by evidence is a direct application of entailment, central to fake news detection and automated fact-checking.
3. **Question answering**: Verifying that a candidate answer is entailed by the supporting passage improves QA accuracy and faithfulness.
4. **Summarization evaluation**: A faithful summary should be entailed by the source document -- entailment-based metrics detect hallucination and omission.
5. **Semantic search**: Entailment enables going beyond keyword matching to find passages that semantically support a query's intent.

## Key Technical Details

- RTE-1 (2005) best system accuracy: approximately 59% on binary entailment, only 9 points above random chance.
- SNLI contains 570,152 sentence pairs with three-way labels; inter-annotator agreement is approximately 89%.
- BERT-large achieves approximately 91.0% accuracy on SNLI and approximately 86.3% on MultiNLI matched.
- Human performance on SNLI is approximately 89% (individual annotator) and approximately 98% (5-annotator majority vote).
- The decomposable attention model (Parikh et al., 2016) achieved 86.8% on SNLI with only 380K parameters, demonstrating that cross-sentence alignment is the key operation.
- MacCartney and Manning's natural logic system was one of the few approaches capable of handling monotonicity reasoning (e.g., "all dogs" entails "all poodles" is wrong, but "all poodles" entails some claims about "all dogs").

## Common Misconceptions

**"Textual entailment is the same as logical entailment."**
Textual entailment is softer than strict logical entailment. It asks whether a "reasonable person" would conclude H from P, allowing common-sense inferences that formal logic would not sanction. "The dog is barking" textually entails "There is noise" even though this requires world knowledge that barking produces sound.

**"High word overlap means entailment."**
Lexical overlap is correlated with entailment but is not sufficient. "The dog bit the man" and "The man bit the dog" share all the same words but have different -- even contradictory -- meanings. Conversely, "He purchased a vehicle" entails "He bought a car" despite low surface overlap.

**"Textual entailment and natural language inference are different tasks."**
They are essentially the same task under different names. "Textual entailment" was the original term from the RTE challenges (binary classification). "Natural language inference" became the preferred term with SNLI (three-way classification). Modern usage treats them as synonymous, with NLI being the more common term in the deep learning era.

**"Entailment is symmetric."**
Entailment is a directional relation. "A dog is running" entails "An animal is moving," but "An animal is moving" does not entail "A dog is running" (it could be a cat walking). Confusing direction is a common error in both human annotation and system design.

## Connections to Other Concepts

- `natural-language-inference.md` covers the scaled-up, three-way version of textual entailment with SNLI, MultiNLI, and neural approaches.
- `semantic-similarity.md` measures graded meaning overlap, while entailment captures a directional logical relationship -- related but distinct.
- `word-sense-disambiguation.md` is often needed to correctly resolve entailment when polysemous words appear in premise or hypothesis.
- `commonsense-reasoning.md` covers the world knowledge frequently required for non-trivial entailment judgments.
- `bert.md` and `gpt-for-nlp-tasks.md` describe the pre-trained models that achieve state-of-the-art entailment performance.
- `semantic-role-labeling.md` provides predicate-argument structure that supports structured entailment reasoning.
- `negation-and-speculation-detection.md` is critical for contradiction detection, since negation flips entailment to contradiction.
- `sentiment-analysis.md` can leverage entailment for zero-shot opinion classification via hypothesis framing.

## Further Reading

- Dagan, I., Glickman, O., and Magnini, B., "The PASCAL Recognising Textual Entailment Challenge," 2005 -- The founding paper establishing textual entailment as a unifying NLP task.
- Bowman, S., Angeli, G., Potts, C., and Manning, C., "A Large Annotated Corpus for Learning Natural Language Inference," 2015 -- Introduction of SNLI, enabling neural approaches to entailment at scale.
- MacCartney, B. and Manning, C., "Modeling Semantic Containment and Exclusion in Natural Language Inference," 2008 -- Natural logic approach to entailment using monotonicity-based reasoning.
- Parikh, A., Tackstrom, O., Das, D., and Uszkoreit, J., "A Decomposable Attention Model for Natural Language Inference," 2016 -- Lightweight cross-attention model achieving strong results with minimal parameters.
- Chen, Q., Zhu, X., Ling, Z., Wei, S., Jiang, H., and Inkpen, D., "Enhanced LSTM for Natural Language Inference," 2017 -- ESIM model combining sequential encoding with cross-sentence attention.
- Marelli, M. et al., "A SICK Cure for the Evaluation of Compositional Distributional Semantic Models," 2014 -- The SICK dataset targeting compositional reasoning in entailment.
