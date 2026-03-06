# Intrinsic vs. Extrinsic Evaluation

**One-Line Summary**: Intrinsic evaluation measures a model component's quality in isolation (e.g., perplexity for a language model), while extrinsic evaluation measures its contribution to a downstream end-task (e.g., translation accuracy).

**Prerequisites**: `n-gram-language-models.md`, `word2vec.md`, `contextual-embeddings.md`, `evaluation-metrics-for-nlp.md`, `transfer-learning-in-nlp.md`

## What Is Intrinsic vs. Extrinsic Evaluation?

Imagine evaluating a car engine. An intrinsic evaluation would test the engine on a dynamometer -- measuring horsepower, torque, and fuel efficiency in isolation on a test bench. An extrinsic evaluation would install the engine in a car and measure lap times around a track. The dynamometer tells you about the engine itself; the lap time tells you how well it performs in the context that actually matters. A high-horsepower engine paired with poor tires might lose to a lower-horsepower engine with better traction.

In NLP, intrinsic evaluation tests a model component (embeddings, a language model, a parser) using metrics tied directly to that component's objective -- word analogy accuracy for embeddings, perplexity for language models, attachment scores for parsers. Extrinsic evaluation tests the same component by plugging it into a downstream application and measuring end-task performance -- do these embeddings improve sentiment classification accuracy? Does this parser improve relation extraction F1?

The distinction matters because intrinsic improvements do not always translate to extrinsic gains, and the gap between the two is one of the most important lessons in applied NLP.

## How It Works

### Intrinsic Evaluation Methods

**Perplexity for Language Models**: The most common intrinsic metric for language models (see `n-gram-language-models.md`, `gpt-for-nlp-tasks.md`) measures how well the model predicts held-out text. Lower perplexity means better prediction. GPT-2 (1.5B) achieves 17.5 perplexity on Penn Treebank vs. a trigram model's ~140. But perplexity does not directly indicate whether the model will generate coherent stories or accurate answers.

**Word Analogy Tasks for Embeddings**: Mikolov et al. (2013) introduced the analogy task (e.g., king - man + woman = queen) to evaluate `word2vec.md` and `glove.md`. The Google analogy dataset contains 19,544 questions across semantic and syntactic categories. GloVe (300d, 840B tokens) achieves ~75% accuracy on this benchmark. However, Faruqui et al. (2016) showed that analogy accuracy has low correlation with downstream task performance, calling the metric's utility into question.

**Probing Tasks for Representations**: Conneau et al. (2018) introduced probing classifiers -- simple linear or MLP classifiers trained on frozen representations to predict linguistic properties such as sentence length, tree depth, top constituent, tense, and subject number. These probes test what information is encoded in `contextual-embeddings.md` without fine-tuning. BERT layers 6--9 tend to encode the most syntactic information, while earlier layers capture surface features and later layers capture task-specific semantics.

**Word Similarity Benchmarks**: Datasets like WordSim-353, SimLex-999, and MEN measure whether embedding cosine similarity correlates with human similarity judgments. Spearman correlations of 0.70--0.80 are typical for strong embeddings. These benchmarks conflate similarity and relatedness (car/road are related but not similar), and SimLex-999 specifically targets genuine similarity.

### Extrinsic Evaluation Methods

**Downstream Task Performance**: The gold standard for extrinsic evaluation. Replace one component (e.g., swap random embeddings for GloVe) and measure the change in task metrics -- classification accuracy, NER F1, translation BLEU. This directly answers the question "does this component help?"

**GLUE and SuperGLUE Benchmarks**: Wang et al. (2018, 2019) created standardized multi-task benchmarks that serve as extrinsic evaluation suites for pre-trained models. GLUE includes sentiment analysis (SST-2), similarity (STS-B), inference (MNLI, RTE), and paraphrase detection (QQP, MRPC). SuperGLUE adds harder tasks like reading comprehension (ReCoRD) and word sense disambiguation (WiC). These benchmarks made it possible to compare `bert.md`, `gpt-for-nlp-tasks.md`, and `t5-and-text-to-text.md` on a common playing field.

**Ablation Studies**: Systematically removing or replacing components to isolate their contribution. For example, comparing a system using contextual vs. static embeddings while holding all other components constant measures the extrinsic value of contextualization.

### The Intrinsic-Extrinsic Gap

The gap between intrinsic and extrinsic results is well-documented. Chiu et al. (2016) found that word embedding dimensions optimized for word similarity benchmarks differed from those optimal for NER. Schnabel et al. (2015) demonstrated that no single intrinsic metric reliably predicts downstream performance across tasks. More recently, Ethayarajh (2019) showed that contextual embeddings from GPT-2 and BERT behave very differently on intrinsic measures (isotropy, self-similarity) than their downstream performance might suggest.

## Why It Matters

1. **Resource allocation**: Intrinsic evaluation is cheap and fast (minutes); extrinsic evaluation can require expensive fine-tuning, labeled data, and GPU compute (hours to days). Knowing when each is appropriate saves significant resources.
2. **Research direction**: Over-optimizing for intrinsic metrics can lead to dead ends. The word analogy task drove years of embedding research, yet improvements there did not consistently improve downstream systems.
3. **Component selection**: When choosing between pre-trained models for a production system, extrinsic evaluation on the target task is the only reliable signal. Perplexity differences between language models may not predict which will generate better customer-facing text.
4. **Benchmark design**: Understanding the intrinsic-extrinsic gap informs better benchmark design -- modern benchmarks like SuperGLUE and BIG-bench favor extrinsic, multi-task evaluation.
5. **Publication standards**: The field has shifted from accepting intrinsic results alone to expecting extrinsic evidence, especially for representation learning papers.

## Key Technical Details

- **Perplexity-task correlation**: Chen et al. (2019) found a logarithmic relationship between LM perplexity and downstream task performance -- gains from reducing perplexity show diminishing returns on tasks.
- **Embedding dimension trade-off**: Yin and Shen (2018) found intrinsic benchmarks favor higher dimensions (300--500), while downstream tasks often plateau at 100--300 dimensions.
- **GLUE baseline**: A random baseline scores ~45 on GLUE; BERT-base scores ~79; human performance is ~87. On SuperGLUE, BERT-large scores ~69 while human performance is ~90.
- **Probing accuracy**: Linear probes on BERT-base achieve ~85% accuracy on part-of-speech tagging, ~70% on tree depth prediction, and ~62% on top-constituent identification from frozen representations alone.
- **Evaluation speed**: Intrinsic benchmarks (word similarity, analogies) run in seconds on CPU. Extrinsic evaluation (fine-tuning BERT on MNLI) takes ~1 hour on a single GPU.
- **Modern trend**: The proportion of NLP papers reporting only intrinsic results dropped from ~35% in 2015 to ~10% by 2023, reflecting the community's shift toward extrinsic evaluation.

## Common Misconceptions

**"Intrinsic evaluation is useless."** Intrinsic metrics remain valuable for rapid development iteration, debugging, and understanding what a model has learned. Probing tasks reveal interpretable properties of representations that downstream accuracy alone cannot expose. The key is not to treat intrinsic results as sufficient evidence of quality.

**"Better perplexity always means better downstream performance."** This holds roughly at large scale differences (perplexity 140 vs. 20 matters enormously), but not for small differences (perplexity 20 vs. 18 may not translate to measurable task gains). The relationship is logarithmic with diminishing returns.

**"Extrinsic evaluation is always the right choice."** Extrinsic evaluation requires choosing a downstream task, and results may not generalize across tasks. A component that helps sentiment classification may not help NER. Multi-task benchmarks mitigate this but cannot cover all possible applications.

**"Probing classifiers prove what a model 'knows'."** A probe achieving high accuracy demonstrates that information is accessible in the representation, but not that the model uses that information during inference. Hewitt and Liang (2019) introduced control tasks showing that expressive probes can memorize labels rather than extract encoded features.

## Connections to Other Concepts

- `evaluation-metrics-for-nlp.md` provides the specific metrics (BLEU, F1, perplexity) used in both intrinsic and extrinsic evaluation.
- `word2vec.md` and `glove.md` were historically evaluated using intrinsic word analogy and similarity benchmarks.
- `contextual-embeddings.md` sparked the probing task paradigm to understand what transformer layers encode.
- `bert.md` and `t5-and-text-to-text.md` are primarily evaluated extrinsically via GLUE, SuperGLUE, and SQuAD.
- `transfer-learning-in-nlp.md` inherently requires extrinsic evaluation -- the whole point is downstream task improvement.
- `human-evaluation-for-nlp.md` serves as the ultimate extrinsic benchmark, against which all automated metrics are validated.
- `text-classification.md` and `named-entity-recognition.md` are common downstream tasks used for extrinsic evaluation.

## Further Reading

- Mikolov et al., *Efficient Estimation of Word Representations in Vector Space*, 2013 -- introduced the word analogy intrinsic benchmark that shaped embedding research for years.
- Schnabel et al., *Evaluation Methods for Unsupervised Word Embeddings*, 2015 -- systematic analysis showing weak correlation between intrinsic and extrinsic metrics.
- Conneau et al., *What You Can Cram into a Single $&!#* Vector: Probing Sentence Embeddings for Linguistic Properties*, 2018 -- the influential probing task framework for intrinsic analysis.
- Wang et al., *GLUE: A Multi-Task Benchmark and Analysis Platform for Natural Language Understanding*, 2018 -- established the modern paradigm of multi-task extrinsic evaluation.
- Hewitt and Liang, *Designing and Interpreting Probes with Control Tasks*, 2019 -- critical examination of probing methodology and what probes actually measure.
- Ethayarajh, *How Contextual Are Contextualized Word Representations?*, 2019 -- intrinsic analysis of BERT, ELMo, and GPT-2 representations revealing surprising geometric properties.
