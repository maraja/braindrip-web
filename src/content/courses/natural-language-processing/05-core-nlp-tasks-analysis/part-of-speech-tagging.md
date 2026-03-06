# Part-of-Speech Tagging

**One-Line Summary**: Part-of-speech (POS) tagging assigns a grammatical category (noun, verb, adjective, etc.) to each word in a sentence, serving as a foundational sequence labeling task for downstream NLP.

**Prerequisites**: `morphology.md`, `syntax-and-grammar.md`, `n-gram-language-models.md`, `recurrent-neural-networks.md`, `contextual-embeddings.md`

## What Is Part-of-Speech Tagging?

Consider how a grammar teacher diagrams a sentence, labeling each word as a noun, verb, adjective, and so on. POS tagging automates this process: given a sentence, the model assigns a grammatical tag to every token. "The quick brown fox jumps over the lazy dog" becomes DT JJ JJ NN VBZ IN DT JJ NN.

Formally, POS tagging is a **sequence labeling** task: given tokens $x_1, \dots, x_n$, assign tags $y_1, \dots, y_n$ where each $y_i$ comes from a predefined tag set. The tag set defines the granularity -- the Penn Treebank (PTB) uses 36 tags (distinguishing verb tenses like VB, VBD, VBG, VBN, VBP, VBZ), while Universal Dependencies (UD) uses 17 coarser tags (a single VERB tag covers all forms). POS tagging is one of the oldest NLP tasks and among the first to approach human-level performance, yet it remains an essential preprocessing step for parsing, NER, and many other downstream applications.

## How It Works

### Tag Sets

**Penn Treebank (PTB)**: 36 tags covering fine-grained distinctions. Nouns split into NN (singular), NNS (plural), NNP (proper singular), NNPS (proper plural). Verbs split across 6 tense/form categories. This fine granularity captures morphosyntactic detail.

**Universal Dependencies (UD)**: 17 tags designed for cross-linguistic consistency. Tags like NOUN, VERB, ADJ, ADV, ADP (adposition) abstract away language-specific distinctions, enabling multilingual models and typological analysis. See `language-diversity-and-typology.md` for why cross-linguistic tag sets matter.

### HMM Taggers

Hidden Markov Models treat POS tagging as a generative sequence model. The model defines:

$$P(y_1, \dots, y_n, x_1, \dots, x_n) = \prod_{i=1}^{n} P(y_i \mid y_{i-1}) \cdot P(x_i \mid y_i)$$

where $P(y_i \mid y_{i-1})$ is the **transition probability** (tag bigram) and $P(x_i \mid y_i)$ is the **emission probability** (word given tag). The Viterbi algorithm finds the most likely tag sequence in O(nT^2) time, where T is the tag set size. HMM taggers achieve ~95--96% accuracy on PTB, limited by the first-order Markov assumption and inability to use rich features.

### CRF Taggers

Conditional Random Fields (CRFs) model $P(y_1, \dots, y_n \mid x_1, \dots, x_n)$ directly, allowing arbitrary feature functions over the entire input. Features include the current word, surrounding words, prefixes/suffixes, capitalization patterns, and word shapes. CRF taggers achieve ~97% accuracy on PTB, a significant improvement over HMMs due to richer feature representations.

### Neural Taggers

**BiLSTM taggers** encode the sentence bidirectionally and classify each token independently (or with a CRF layer on top). Pre-trained word embeddings from `word2vec.md` or `glove.md` provide the input representations.

**Transformer-based taggers**: Fine-tuning BERT for POS tagging achieves ~97.8--98% accuracy on PTB, with most errors occurring on genuinely ambiguous tokens. Multilingual BERT and XLM-R (see `multilingual-transformers.md`) enable POS tagging across 100+ languages with a single model.

Current SOTA systems on the Penn Treebank English POS task achieve approximately **97.9--98%** token-level accuracy, approaching the estimated human inter-annotator agreement ceiling of ~98%.

## Why It Matters

1. **Parsing prerequisite**: Both `dependency-parsing.md` and `constituency-parsing.md` use POS tags as input features or constraints, even in neural systems.
2. **NER feature**: POS tags help disambiguate entity boundaries -- proper nouns (NNP) are strong signals for named entities in `named-entity-recognition.md`.
3. **Lemmatization**: Accurate POS tags enable correct lemmatization; "saw" lemmatizes to "see" (verb) or "saw" (noun) depending on its POS. See `stemming-and-lemmatization.md`.
4. **Information extraction**: POS patterns (e.g., noun-noun compounds, adjective-noun phrases) drive `keyword-extraction.md` and terminology extraction.
5. **Linguistic research**: POS-tagged corpora are essential resources for computational linguistics, stylometry, and language typology studies.
6. **Low-resource languages**: POS taggers can be trained with relatively small annotated datasets (~3,000 sentences), making them feasible for low-resource settings described in `low-resource-nlp.md`.

## Key Technical Details

- **Penn Treebank (English)**: 36 tags; SOTA ~97.9% accuracy; ~1 million annotated tokens from Wall Street Journal text.
- **Universal Dependencies**: 17 tags across 100+ languages; accuracy varies from ~98% (English, German) to ~85% (low-resource languages).
- **Human agreement**: Estimated at ~97--98% on PTB, meaning current models are near ceiling.
- **Most common errors**: Confusing NN/JJ ("stone" wall), VBD/VBN (past tense vs. past participle), IN/RB (preposition vs. adverb).
- **Unknown words**: Account for ~3--5% of tokens in test data; sub-word features and contextual embeddings largely solve this.
- **Speed**: CRF taggers process ~50,000 tokens/sec on CPU; BERT-based taggers process ~10,000 tokens/sec on GPU.
- **Training data**: 1,000--3,000 annotated sentences typically suffice for ~95% accuracy; returns diminish beyond ~40,000 sentences.

## Common Misconceptions

**"POS tagging is a solved problem."** At ~98% accuracy on clean news text, it may seem solved, but accuracy drops to ~90--93% on social media, historical text, and code-switched multilingual data. The long tail of errors (ambiguous words in unusual contexts) still matters for downstream tasks.

**"Each word has one POS tag."** Many words are systematically ambiguous: "run" can be NN or VB; "that" can be DT, IN, WDT, or RB depending on context. Roughly 40% of English word types are ambiguous across POS categories, though the most frequent tag is correct ~90% of the time (baseline heuristic).

**"POS tagging is irrelevant in the era of BERT."** While end-to-end models can sometimes bypass explicit POS features, POS tags remain useful for interpretability, rule-based post-processing, linguistic analysis, and as auxiliary training signals. Many production NLP pipelines still include an explicit POS tagging step.

**"Universal POS tags lose important information."** The 17 UD tags are intentionally coarse for cross-linguistic compatibility, but UD also includes morphological features (tense, number, case) that capture fine-grained distinctions. The tag set and the feature set together are richer than PTB tags alone.

## Connections to Other Concepts

- POS tagging is a sequence labeling task with the same formulation as `named-entity-recognition.md`, differing in label granularity and span behavior.
- Tags from POS tagging feed into `dependency-parsing.md` and `constituency-parsing.md` as features or constraints.
- `morphology.md` explains the inflectional patterns that create POS ambiguity (e.g., English -ed for VBD/VBN).
- `syntax-and-grammar.md` provides the linguistic theory behind grammatical categories.
- HMM taggers connect to `n-gram-language-models.md` through their use of Markov assumptions.
- Neural taggers build on `recurrent-neural-networks.md`, `bidirectional-rnns.md`, and `contextual-embeddings.md`.
- `stemming-and-lemmatization.md` depends on POS tags for correct lemma selection.

## Further Reading

- Brill, *A Simple Rule-Based Part of Speech Tagger*, 1992 -- introduced transformation-based learning for POS tagging, a historically influential approach.
- Toutanova et al., *Feature-Rich Part-of-Speech Tagging with a Cyclic Dependency Network*, 2003 -- established the Stanford POS Tagger and demonstrated the value of rich features.
- Lafferty et al., *Conditional Random Fields: Probabilistic Models for Segmenting and Labeling Sequence Data*, 2001 -- introduced CRFs, which became the dominant framework for POS tagging and other sequence labeling tasks.
- Nivre et al., *Universal Dependencies v2: An Evergrowing Multilingual Treebank Collection*, 2020 -- describes the UD project and its cross-lingual POS annotation scheme.
- Manning, *Part-of-Speech Tagging from 97% to 100%: Is It Time for Some Linguistics?*, 2011 -- insightful analysis of remaining POS tagging errors and whether linguistic knowledge can close the gap.
