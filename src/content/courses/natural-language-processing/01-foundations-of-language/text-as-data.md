# Text as Data

**One-Line Summary**: Treating language as structured data -- corpora, annotation schemes, inter-annotator agreement, and the paradigm shift from hand-crafted features to learned representations that transformed how NLP systems consume text.

**Prerequisites**: `what-is-nlp.md`, `levels-of-linguistic-analysis.md`

## What Is Text as Data?

Raw language -- speech, handwriting, printed text, social media posts -- is unstructured in the computational sense. A computer cannot reason about "The cat sat on the mat" the way it can compute with the number 3.14 or sort a database column. Before any NLP can happen, language must be transformed into structured, computable representations. This transformation is what "text as data" is about.

Think of it like astronomy before and after the telescope. Ancient astronomers looked at the sky with their eyes and described what they saw in prose. Modern astronomers capture photons in CCD arrays, store them as numerical matrices, and run statistical analyses. The sky did not change -- but converting visual impressions into structured numerical data unleashed centuries of scientific progress. The same revolution happened in NLP when researchers began treating text not as something to be read, but as structured data to be measured, counted, modeled, and learned from.

This concept covers the full pipeline: where text data comes from (corpora), how humans add structure to it (annotation), how quality is measured (inter-annotator agreement), and how the field moved from humans defining features to machines discovering them.

## How It Works

### Corpora: Where Text Data Comes From

A **corpus** (plural: corpora) is a large, structured collection of text assembled for linguistic or NLP research. The design of a corpus -- what text it includes, how it was collected, what metadata accompanies it -- fundamentally shapes what can be learned from it.

**Landmark corpora in NLP history**:

| Corpus | Year | Size | Contents | Significance |
|--------|------|------|----------|-------------|
| Brown Corpus | 1961 | 1M words | 500 samples of American English across 15 genres | First machine-readable balanced corpus |
| Penn Treebank | 1993 | 4.5M words | Wall Street Journal articles with syntactic annotations | Defined parsing benchmarks for 20+ years |
| British National Corpus | 1994 | 100M words | Written and spoken British English | First large-scale representative corpus |
| WordNet | 1995 | 155K words | Lexical database with sense/relation annotations | Standard for lexical semantics |
| OntoNotes | 2006--2012 | 1.6M words | Multi-layer annotations (POS, parse, NER, coref, WSD) | Multi-task NLP benchmark |
| Wikipedia dumps | Ongoing | ~4B words (English) | Encyclopedic text, multilingual | Standard pre-training data component |
| Common Crawl | Ongoing | Petabytes | Web-scraped text from billions of pages | Foundation of large-scale pre-training |
| The Pile | 2020 | 825 GB | 22 diverse text sources curated for LM training | Influential open pre-training dataset |

Corpus design involves critical decisions: **genre balance** (news, fiction, conversation, web), **temporal coverage** (synchronic vs. diachronic), **language coverage** (monolingual vs. multilingual vs. parallel), and **annotation layers** (raw vs. tagged vs. parsed). These decisions introduce biases that propagate into any model trained on the corpus (see `bias-in-nlp.md`).

### Annotation Schemes

**Annotation** is the process of adding structured labels to raw text -- marking word boundaries, part-of-speech tags, named entities, syntactic structure, sentiment, or any other linguistic or task-relevant property. Annotation transforms unstructured text into training data for supervised learning.

**Common annotation formats**:

**CoNLL column format**: A tab-separated format where each row is a token and each column is an annotation layer. Used in the CoNLL shared tasks and widely adopted:

```
John    NNP    B-PER    nsubj
went    VBD    O        root
to      TO     O        case
New     NNP    B-LOC    compound
York    NNP    I-LOC    obl
.       .      O        punct
```

**BIO tagging** (Beginning, Inside, Outside): The standard scheme for sequence labeling tasks like named entity recognition (see `named-entity-recognition.md`):
- **B-PER**: Beginning of a person entity
- **I-PER**: Inside (continuation of) a person entity
- **O**: Outside any entity
- Extended variants include BIOES (adding End and Single tags) and BILOU (Begin, Inside, Last, Outside, Unit)

**Treebank annotation**: Bracketed constituency trees or dependency triples encoding syntactic structure:
```
(S (NP (NNP John)) (VP (VBD went) (PP (TO to) (NP (NNP New) (NNP York)))))
```

**Standoff annotation**: Labels stored separately from the source text, referencing character offsets. Used by brat, Prodigy, and other annotation tools. Advantage: the source text is never modified.

**XML/HTML markup**: Inline tags wrapping annotated spans. Common in older corpora and web data:
```xml
<entity type="PER">John</entity> went to <entity type="LOC">New York</entity>.
```

### Inter-Annotator Agreement

When multiple humans annotate the same data, they inevitably disagree on some items. **Inter-annotator agreement (IAA)** quantifies how consistent annotators are, serving both as a quality check on the annotation and as an empirical ceiling on how well automated systems can perform.

**Cohen's kappa** measures agreement between two annotators, correcting for chance agreement:

```
kappa = (P_observed - P_chance) / (1 - P_chance)
```

Where P_observed is the proportion of items on which annotators agree, and P_chance is the agreement expected by random chance given the label distribution.

**Interpretation scale** (Landis and Koch, 1977):
- kappa < 0.20: Slight agreement
- 0.21--0.40: Fair
- 0.41--0.60: Moderate
- 0.61--0.80: Substantial
- 0.81--1.00: Almost perfect

**Fleiss' kappa** generalizes to more than two annotators. **Krippendorff's alpha** handles missing data, multiple annotators, and various measurement scales (nominal, ordinal, interval, ratio).

Typical IAA values across NLP tasks:
- Part-of-speech tagging: kappa approximately 0.95--0.97
- Named entity recognition: kappa approximately 0.85--0.95
- Sentiment annotation: kappa approximately 0.70--0.85
- Word sense annotation: kappa approximately 0.65--0.80
- Discourse relation labeling: kappa approximately 0.60--0.70
- Sarcasm/irony annotation: kappa approximately 0.50--0.70

These numbers reveal an important truth: the more semantically and pragmatically complex the annotation task, the more humans disagree. Any NLP system claiming super-human accuracy on a task with kappa 0.70 is likely fitting to annotation artifacts rather than solving the underlying linguistic problem.

### From Hand-Crafted Features to Learned Representations

The "text as data" paradigm has undergone a fundamental shift in how features are defined:

**Era 1 -- Feature Engineering (1990s--2012)**:
Human experts designed features to convert text into numerical vectors. For a sentiment classifier, features might include:
- Word presence/absence (bag of words; see `bag-of-words.md`)
- TF-IDF weighted word frequencies (see `tf-idf.md`)
- Part-of-speech tag distributions
- Negation scope indicators
- Hand-crafted lexicon features (AFINN, SentiWordNet scores)

This required deep domain knowledge and was labor-intensive. A POS tagging system, a NER system, and a sentiment system each required entirely different feature sets.

**Era 2 -- Learned Representations (2013--2017)**:
Word embeddings like Word2Vec (see `word2vec.md`) and GloVe (see `glove.md`) replaced sparse hand-crafted features with dense learned vectors. Features were still somewhat task-specific (choosing which embeddings to use, whether to freeze or fine-tune), but the representations themselves were learned from data.

**Era 3 -- Pre-trained Models (2018--present)**:
BERT, GPT, and their successors learn universal text representations from massive corpora via self-supervised pre-training. A single pre-trained model produces features that transfer to virtually any NLP task with minimal task-specific engineering. The text is tokenized into subword units, embedded, and processed through transformer layers -- the "features" are the hidden states of these layers. See `transfer-learning-in-nlp.md` and `bert.md`.

This shift fundamentally changed what "text as data" means. In 2005, converting a document to data meant extracting a sparse vector of hundreds of hand-picked features. In 2025, it means feeding raw text into a pre-trained encoder and using the resulting 768- or 1024-dimensional dense vector as the representation.

### Data Quality and Curation

The maxim "garbage in, garbage out" applies forcefully to NLP. Key data quality considerations:

- **Deduplication**: Common Crawl contains massive near-duplicate content. The C4 dataset (used to train T5) applied deduplication, reducing the corpus by approximately 60%.
- **Filtering**: Removing toxic, low-quality, or non-natural-language content. Quality filters typically use a combination of heuristics (minimum length, language ID, perplexity thresholds) and classifier-based filtering.
- **Representativeness**: Web-scraped corpora overrepresent certain demographics, registers, and topics. Active efforts like the ROOTS corpus (used for BLOOM) explicitly curate for linguistic diversity. See `bias-in-nlp.md`.
- **Licensing and consent**: The use of copyrighted or personally identifiable text raises legal and ethical questions that the field is actively grappling with. See `privacy-in-nlp.md`.

## Why It Matters

1. **Reproducibility**: Standardized corpora and annotation schemes enable fair comparison of methods. Without the Penn Treebank, parsing research would have been fragmented and progress would have been slower.
2. **Scale enables breakthroughs**: The jump from million-word to billion-word to trillion-token training corpora drove each paradigm shift in NLP. GPT-3 was trained on approximately 300 billion tokens; current frontier models on trillions.
3. **Annotation quality bounds system quality**: A model trained on annotations with kappa 0.70 cannot reliably exceed 70% accuracy. Understanding IAA sets realistic expectations and guides annotation improvement.
4. **Data documentation**: Model cards (Mitchell et al., 2019) and datasheets for datasets (Gebru et al., 2021) are emerging standards for documenting how data was collected, what biases it may contain, and what it should (and should not) be used for. See `responsible-nlp-development.md`.
5. **The data-centric paradigm**: Andrew Ng's "data-centric AI" movement argues that in many settings, improving data quality yields larger gains than improving model architecture. This makes the "text as data" pipeline -- collection, cleaning, annotation, quality assurance -- a first-class engineering discipline.

## Key Technical Details

- The Brown Corpus (1961) took approximately 3 years to compile 1 million words. GPT-3's training data (approximately 300 billion tokens) would take a human reader approximately 34,000 years to read at average speed.
- Penn Treebank annotation cost approximately $1 million and took approximately 3 years with a team of annotators. Modern crowdsourcing platforms (Amazon Mechanical Turk, Prolific) can collect annotations faster and cheaper but with variable quality.
- Cohen's kappa for NER on the CoNLL-2003 English dataset is approximately 0.93, indicating that NER annotation is well-defined. For more subjective tasks like hate speech detection, kappa can drop below 0.50.
- BPE tokenization (the standard for modern LLMs) produces a vocabulary of 32,000--100,000 subword tokens from training data. GPT-4 uses approximately 100,000 tokens; LLaMA 2 uses 32,000.
- The Common Crawl archive contains over 250 billion web pages. After filtering and deduplication, usable high-quality text is typically reduced to 1--5% of the raw crawl.
- Active learning can reduce annotation effort by 50--80% by intelligently selecting which examples to annotate next, focusing human effort on the most informative data points. See `data-annotation-and-labeling.md`.

## Common Misconceptions

**"More data is always better."**
Data quality, diversity, and relevance matter as much as quantity. The Chinchilla scaling laws (Hoffmann et al., 2022) showed that many LLMs were undertrained relative to their size -- they needed more data, yes, but specifically high-quality, deduplicated data. Training on larger but noisier data can actually degrade performance. See the sibling **LLM Concepts** collection for detailed scaling law analysis.

**"Annotation is a simple mechanical task."**
Annotation requires linguistic expertise, clear guidelines, iterative refinement, and careful quality control. Ambiguous cases (which are frequent -- see `ambiguity-in-language.md`) require adjudication. Poor annotation guidelines produce noisy labels that limit model performance regardless of model sophistication.

**"Pre-trained models eliminate the need for annotated data."**
Pre-trained models reduce the amount of annotated data needed (few-shot learning, prompt-based methods), but they still require task-specific evaluation data at minimum. For domain-specific applications (clinical NLP, legal NLP), task-specific annotated data remains essential for reliable performance. See `domain-adaptation.md`.

**"Kappa above 0.80 means the annotation is perfect."**
Kappa of 0.80 means annotators disagree on approximately 20% of items after correcting for chance. This disagreement often reflects genuine ambiguity in the data, not annotator incompetence. Researchers are increasingly modeling annotator disagreement rather than forcing consensus, recognizing that many NLP tasks have legitimately multiple valid answers.

**"Web-scraped data is free and unproblematic."**
Web data involves copyright considerations, privacy concerns (personally identifiable information), content quality variation, and demographic biases. Responsible use requires filtering, documentation, and consideration of downstream harms.

## Connections to Other Concepts

- `what-is-nlp.md` provides the field context for why text must be treated as data.
- `levels-of-linguistic-analysis.md` defines the linguistic layers that annotation schemes encode.
- `tokenization-in-nlp.md` is the first step in converting raw text to structured data.
- `text-normalization.md` and `text-cleaning-and-noise-removal.md` cover preprocessing that ensures data quality.
- `data-annotation-and-labeling.md` provides a deep dive into the annotation process and crowdsourcing.
- `bag-of-words.md` and `tf-idf.md` are classical representations of text as data.
- `word2vec.md`, `glove.md`, and `contextual-embeddings.md` cover learned representations.
- `transfer-learning-in-nlp.md` and `bert.md` describe the pre-trained model paradigm.
- `bias-in-nlp.md` and `responsible-nlp-development.md` address the ethical dimensions of data curation.
- `part-of-speech-tagging.md` and `named-entity-recognition.md` are annotated sequence labeling tasks.
- The sibling **LLM Concepts** collection covers training data curation, scaling laws, and data mixture strategies for large language models.

## Further Reading

- Francis, W.N. and Kucera, H., *Frequency Analysis of English Usage: Lexicon and Grammar*, 1982 -- The Brown Corpus study that launched corpus linguistics.
- Marcus, M. et al., "Building a Large Annotated Corpus of English: The Penn Treebank," Computational Linguistics, 1993 -- The defining work in treebank construction and NLP benchmarking.
- Artstein, R. and Poesio, M., "Inter-Coder Agreement for Computational Linguistics," Computational Linguistics, 2008 -- The definitive survey on measuring annotation quality.
- Gebru, T. et al., "Datasheets for Datasets," Communications of the ACM, 2021 -- The proposal for standardized documentation of datasets, addressing bias and responsible use.
- Gao, L. et al., "The Pile: An 800GB Dataset of Diverse Text for Language Modeling," 2020 -- A carefully curated, diverse pre-training corpus with detailed documentation.
- Hoffmann, J. et al., "Training Compute-Optimal Large Language Models," NeurIPS, 2022 -- The Chinchilla paper showing that data quantity must scale with model size for optimal performance.
