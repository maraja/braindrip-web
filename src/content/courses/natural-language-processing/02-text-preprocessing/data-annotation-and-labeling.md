# Data Annotation and Labeling

**One-Line Summary**: Creating labeled NLP datasets through systematic annotation schemes, measuring inter-annotator agreement, managing crowdsourced labor, and applying active learning to minimize the high cost of human labeling.

**Prerequisites**: `text-as-data.md`, `tokenization-in-nlp.md`, `named-entity-recognition.md` (for BIO tagging context), basic statistics

## What Is Data Annotation and Labeling?

Imagine teaching a child to recognize animals by showing them thousands of photographs, each carefully labeled: "dog," "cat," "horse." The quality of the child's learning depends entirely on the quality and consistency of those labels. Data annotation is the adult version of this process for NLP: humans read text and assign structured labels -- categories, entity boundaries, syntactic relations, sentiment scores -- that supervised models then learn to replicate.

This is the most labor-intensive, expensive, and error-prone step in the supervised NLP pipeline. A single NER dataset like CoNLL-2003 required annotators to label 301,418 tokens; the Penn Treebank required over 4.5 years of annotator effort to tag and parse 1 million words. The quality of annotations directly determines the ceiling on model performance -- a model cannot learn patterns that are inconsistently or incorrectly labeled.

Data annotation sits at the intersection of linguistics, project management, and quality control. It is as much a human factors problem as a technical one.

## How It Works

### Annotation Schemes

#### Sequence Labeling: BIO and IOB2

For tasks like NER (see `named-entity-recognition.md`) and chunking, the BIO (Beginning-Inside-Outside) scheme encodes entity boundaries at the token level:

```
John    B-PER
Smith   I-PER
went    O
to      O
New     B-LOC
York    I-LOC
City    I-LOC
```

- **B-X**: Beginning of an entity of type X
- **I-X**: Inside (continuation) of entity X
- **O**: Outside any entity

The **IOB2** variant (Ratinov and Roth, 2009) is now the de facto standard: every entity begins with B-, even if it is a single-token entity. This eliminates ambiguity when two entities of the same type are adjacent ("New York" "City" as separate entities vs. one entity).

The **BIOES** (or BILOU) scheme adds **E** (End) and **S** (Single-token entity) tags, providing 0.5-1.0% F1 improvement on NER because it gives the model richer boundary information.

#### Dependency Annotation

Dependency annotations (see `dependency-parsing.md`) assign each token a head (the token it modifies) and a relation label:

```
The   -> fox   (det)
quick -> fox   (amod)
brown -> fox   (amod)
fox   -> ROOT  (nsubj)
jumped -> ROOT (root)
over  -> dog   (case)
the   -> dog   (det)
lazy  -> dog   (amod)
dog   -> jumped (obl)
```

Universal Dependencies (UD) standardizes 37 relation types across 150+ languages, enabling cross-lingual parsing research (see `multilingual-nlp.md`). The UD project has produced treebanks for 140+ languages, totaling over 30 million annotated words.

#### Other Annotation Types

- **Text classification**: Document-level or sentence-level labels (sentiment, topic, intent). The SST-2 sentiment dataset contains 67,349 labeled sentences.
- **Span annotation**: Marking text spans for question answering (see `question-answering.md`). SQuAD 2.0 contains 150,000 question-answer pairs.
- **Relation annotation**: Labeling relationships between entity pairs for `relation-extraction.md`. TACRED contains 106,264 relation instances.
- **Semantic Role Labeling annotation**: PropBank-style predicate-argument structures for `semantic-role-labeling.md`.

### Inter-Annotator Agreement (IAA)

Agreement metrics quantify how consistently multiple annotators label the same data. High agreement suggests the task is well-defined; low agreement indicates ambiguous guidelines or a genuinely subjective task.

#### Cohen's Kappa

Measures agreement between exactly two annotators, correcting for chance:

```
kappa = (p_o - p_e) / (1 - p_e)
```

Where `p_o` is observed agreement and `p_e` is expected agreement by chance. Interpretation thresholds (Landis and Koch, 1977):

| Kappa | Interpretation |
|-------|---------------|
| < 0.20 | Slight |
| 0.21-0.40 | Fair |
| 0.41-0.60 | Moderate |
| 0.61-0.80 | Substantial |
| 0.81-1.00 | Almost perfect |

For NER annotation, a kappa of 0.85+ is expected. For sentiment annotation, 0.70+ is typical due to inherent subjectivity.

#### Fleiss' Kappa

Extends Cohen's kappa to three or more annotators. Used when multiple crowd workers label each item. The formula generalizes the chance correction across all annotator pairs.

#### Krippendorff's Alpha

The most general agreement metric: handles any number of annotators, missing data, and multiple data types (nominal, ordinal, interval, ratio). Krippendorff recommends alpha >= 0.80 for reliable conclusions, with alpha >= 0.67 as the minimum for tentative conclusions. For NLP annotation, alpha is increasingly preferred because it handles incomplete annotation matrices common in crowdsourcing.

```python
import krippendorff
# Reliability data: rows = annotators, columns = items
# Missing values indicated by None
alpha = krippendorff.alpha(reliability_data, level_of_measurement='nominal')
```

### Crowdsourcing

#### Amazon Mechanical Turk (MTurk)

MTurk is the most widely used platform for NLP annotation. Key design decisions:

- **HIT design**: Each Human Intelligence Task should take 30-60 seconds for classification, 2-5 minutes for span annotation.
- **Payment**: Ethical practice mandates at least minimum wage ($7.25/hour US federal, higher in many states). Snow et al. (2008) found that 4 non-expert Turkers can match 1 expert annotator when results are aggregated.
- **Qualification tests**: Screen workers with a gold-standard test (10-20 pre-labeled items). Workers scoring below 80% accuracy are filtered out.

#### Annotation Platforms

- **Prodigy**: Active-learning-powered annotation tool from the makers of spaCy. Supports NER, text classification, and custom workflows.
- **Label Studio**: Open-source platform supporting text, image, and audio annotation.
- **Doccano**: Open-source tool optimized for sequence labeling and text classification.
- **Amazon SageMaker Ground Truth**: Cloud-based annotation with built-in quality control and active learning.

### Quality Control

#### Gold Standard Items

Embed pre-labeled items (5-10% of the batch) among unlabeled items. Workers who fail gold standards are flagged for retraining or removal. This catches random clicking and systematic misunderstandings.

#### Redundancy and Aggregation

Label each item with 3-5 annotators and aggregate using majority vote or more sophisticated methods:
- **MACE** (Hovy et al., 2013): Probabilistic model that jointly estimates annotator reliability and true labels.
- **Dawid-Skene model**: EM algorithm estimating annotator confusion matrices and true labels.

Aggregation with 5 annotators typically achieves 95-98% accuracy on binary classification, versus 85-90% for a single non-expert annotator.

#### Adjudication

For disagreements, an expert annotator reviews disputed items and makes a final decision. This is standard for high-stakes datasets (medical, legal) where errors have real consequences.

### Active Learning for Annotation

Active learning selects the most informative unlabeled examples for annotation, reducing labeling cost by 30-70% (Settles, 2012). Strategies:

1. **Uncertainty sampling**: Select examples where the current model is least confident. For a classifier, this means items near the decision boundary.
2. **Query-by-committee**: Train multiple models and select items where they disagree most.
3. **Expected model change**: Select items that would most change the model's parameters if labeled.

In practice, uncertainty sampling with a retrained model every 100-500 annotations is the most common approach. On the CoNLL-2003 NER task, active learning reaches 95% of full-data performance with only 25% of the labels.

### The Cost of Annotation

Annotation costs vary dramatically by task complexity:

| Task | Cost per Item | Items per Hour | Typical Dataset Size |
|------|--------------|----------------|---------------------|
| Binary classification | $0.02-0.05 | 200-500 | 10K-100K |
| Multi-class (5+ classes) | $0.05-0.15 | 100-200 | 10K-50K |
| NER (BIO tagging) | $0.10-0.50 per sentence | 30-60 sentences | 15K-50K sentences |
| Dependency parsing | $0.50-2.00 per sentence | 10-20 sentences | 10K-20K sentences |
| Machine translation | $0.10-0.30 per sentence | 20-40 sentences | 100K+ sentence pairs |

The Penn Treebank cost approximately $1 million (in 1990s dollars) to annotate. Modern large-scale datasets like SQuAD 2.0 cost an estimated $50,000-100,000 in crowdsourcing fees.

## Why It Matters

1. **Model ceiling**: A supervised model can only be as good as its training labels. Noisy annotations introduce a label noise ceiling that no architecture can overcome.
2. **Benchmark validity**: NLP benchmarks (CoNLL, SQuAD, GLUE) are only meaningful if their annotations are consistent. IAA below 0.80 means the "gold standard" itself contains errors.
3. **Cost-quality tradeoff**: Understanding annotation economics helps allocate budget: spend more per item on high-value labels (medical NER) and optimize with active learning for large-scale tasks (sentiment classification).
4. **Reproducibility**: Annotation guidelines must be documented precisely so that others can replicate the labeling process. The ACL Reproducibility Checklist now requires annotation documentation.
5. **Bias propagation**: Annotator demographics, instructions, and interface design all introduce biases (see `bias-in-nlp.md`) that propagate through models into production systems.

## Key Technical Details

- Snow et al. (2008) found that aggregating labels from 4 non-expert MTurk annotators matches a single expert on 5 out of 6 NLP tasks.
- MACE (Multi-Annotator Competence Estimation) reduces label noise by 30-50% compared to majority vote on datasets with varying annotator quality.
- The Universal Dependencies project (v2.14) contains treebanks for 148 languages, with over 35 million tokens annotated for morphology, POS, and dependency relations.
- Active learning reduces annotation cost by an average of 50% across NER, sentiment, and classification tasks (Settles, 2012 survey of 20+ studies).
- For subjective tasks (sentiment, offensiveness), Krippendorff's alpha typically ranges from 0.40-0.70, reflecting genuine disagreement rather than annotator error. Disagreement itself can be modeled as a feature (Plank et al., 2014).
- Annotation speed decreases approximately 40% when annotators switch between different label types (e.g., NER and relation extraction simultaneously), arguing for single-task annotation batches.
- Pre-annotation (using model predictions or `regular-expressions-for-nlp.md` patterns as initial labels for human correction) speeds annotation by 30-50% on NER tasks.

## Common Misconceptions

**"More data always beats better labels."** Retraining BERT with 50% cleaner labels can outperform training with 100% noisier labels. Northcutt et al. (2021) found that correcting label errors in standard benchmarks (ImageNet, CIFAR, Amazon Reviews) improved model performance by 1-5%.

**"Inter-annotator agreement below 1.0 means the guidelines are bad."** Some tasks are genuinely subjective. Sentiment annotation on sarcastic text has inherently low agreement. The appropriate response is to model the disagreement distribution, not to force artificial consensus.

**"Crowdsourcing always produces low-quality labels."** With proper qualification tests, gold standards, and aggregation, crowdsourced annotations match expert quality on many tasks. The key is quality control infrastructure, not the source of labor.

**"Annotation is a one-time cost."** Guidelines evolve, label schemas change, and errors are discovered over time. Maintaining a high-quality dataset requires ongoing annotation audits and corrections. The Penn Treebank has been through multiple revision cycles.

**"Active learning eliminates the need for domain expertise."** Active learning reduces the *volume* of needed annotations but not the *difficulty*. Ambiguous edge cases selected by uncertainty sampling are the hardest items to label, requiring more expert judgment, not less.

## Connections to Other Concepts

- Annotation assumes prior `tokenization-in-nlp.md` -- BIO tags, dependency arcs, and span annotations are all defined over token sequences.
- `text-cleaning-and-noise-removal.md` and `text-normalization.md` should precede annotation to ensure annotators see clean, consistent text.
- NER annotation (BIO/IOB2) is the labeling scheme for `named-entity-recognition.md`.
- Dependency annotation produces training data for `dependency-parsing.md` and `constituency-parsing.md`.
- IAA metrics connect to `human-evaluation-for-nlp.md` -- both measure human consistency in judgment tasks.
- Annotation bias feeds into `bias-in-nlp.md` and `fairness-in-nlp.md` -- biased labels create biased models.
- Active learning connects to `low-resource-nlp.md` -- efficient annotation strategies are critical when resources are scarce.
- `regular-expressions-for-nlp.md` enables pre-annotation for structured patterns (dates, emails, phone numbers) before human review.

## Further Reading

- Snow, O'Connor, Jurafsky, and Ng, "Cheap and Fast -- But is it Good? Evaluating Non-Expert Annotations for Natural Language Tasks," *EMNLP*, 2008 -- the foundational study on crowdsourced NLP annotation quality.
- Hovy, Berg-Kirkpatrick, Vaswani, and Hovy, "Learning Whom to Trust with MACE," *NAACL*, 2013 -- probabilistic annotator modeling for noise reduction.
- Settles, "Active Learning," *Synthesis Lectures on Artificial Intelligence and Machine Learning*, Morgan & Claypool, 2012 -- the definitive survey on active learning for annotation.
- Krippendorff, *Content Analysis: An Introduction to Its Methodology*, 4th edition, Sage, 2018 -- the authoritative reference on inter-annotator agreement and Krippendorff's alpha.
- Pustejovsky and Stubbs, *Natural Language Annotation for Machine Learning*, O'Reilly, 2012 -- practical guide to designing annotation tasks, writing guidelines, and managing annotation projects.
- Northcutt, Jiang, and Chuang, "Confident Learning: Estimating Uncertainty in Dataset Labels," *JAIR*, 2021 -- detecting and correcting label errors in benchmark datasets.
