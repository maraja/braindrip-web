# Cross-Lingual Transfer

**One-Line Summary**: Cross-lingual transfer leverages multilingual pre-trained models to transfer NLP capabilities from high-resource languages (primarily English) to low-resource languages without target-language labeled data -- enabling zero-shot task performance across 100+ languages through shared representations.

**Prerequisites**: `transfer-learning-in-nlp.md`, `bert.md`, `word2vec.md`, `contextual-embeddings.md`, `named-entity-recognition.md`

## What Is Cross-Lingual Transfer?

Imagine a polyglot translator who learned to identify spam emails in English. One day, they receive spam in Hindi -- a language they speak but were never specifically trained to filter. Remarkably, they can still detect the spam because the underlying patterns (urgency cues, fake offers, suspicious links) transcend language boundaries. Their multilingual brain maps these patterns into a shared conceptual space where "Win a free iPhone!" and its Hindi equivalent activate similar detection circuits.

Cross-lingual transfer works on the same principle. A multilingual model pre-trained on text from many languages develops an internal representation space where semantically equivalent expressions across languages end up close together. When you fine-tune such a model on English NER data, the learned ability to recognize person names, organizations, and locations partially transfers to German, Chinese, Arabic, and dozens of other languages -- even though the model never saw labeled examples in those languages.

This capability is transformative because labeled NLP data is overwhelmingly concentrated in English and a handful of other high-resource languages. Of the world's ~7,000 languages, fewer than 100 have significant NLP resources. Cross-lingual transfer is one of the most practical paths toward making NLP work for the remaining 6,900+. See `low-resource-nlp.md` and `multilingual-nlp.md` in Category 10 for complementary perspectives.

## How It Works

### Multilingual Model Mechanisms

**Shared Vocabulary.** Models like mBERT and XLM-R use a single WordPiece or SentencePiece vocabulary shared across all training languages. For XLM-R, this is a 250K-token vocabulary learned from 100 languages. Shared subword tokens (many languages share Latin script, numbers, punctuation, and borrowed words) create natural anchor points that encourage aligned representations.

**Shared Parameters.** The entire transformer -- all attention heads, feed-forward layers, and layer norms -- is shared across languages. There are no language-specific parameters. During pre-training, a batch might contain sentences from English, French, Hindi, and Japanese simultaneously. The shared parameters must learn representations that work across all these languages, which pressure the model toward language-agnostic abstractions.

**Emergent Alignment.** Despite no explicit alignment objective, multilingual models develop remarkably aligned cross-lingual representations. Pires et al. (2019) showed that mBERT's representations cluster by meaning rather than by language: the German word "Katze" and the English word "cat" end up near each other in representation space. This alignment emerges from three factors: (1) shared subword vocabulary, (2) similar sentence structures across languages, and (3) shared entities and concepts in the training data (Wikipedia articles on the same topic exist in multiple languages).

### Zero-Shot Cross-Lingual Transfer

The most common approach:
1. Pre-train a multilingual model (mBERT, XLM-R) on unlabeled text from 100+ languages.
2. Fine-tune on the downstream task using only English labeled data.
3. Apply the fine-tuned model directly to other languages at inference time.

This works because fine-tuning adapts the shared representation space for the task, and the cross-lingual alignment ensures that the task-relevant features activate similarly across languages.

### Translate-Train vs. Translate-Test

**Translate-Train**: Machine-translate the English training data into target languages, then train the model on the translated data (possibly combined with the original English data). This can be more effective than zero-shot transfer but requires a machine translation system for each target language.

**Translate-Test**: At inference time, translate the target-language input into English, then apply the English-trained model. This leverages the model's strongest language but introduces translation errors and latency.

**Comparison**: On XNLI (cross-lingual NLI), translate-train achieves ~77% average accuracy across 15 languages, compared to ~71% for zero-shot transfer and ~75% for translate-test (Conneau et al., 2020). However, zero-shot transfer requires no translation infrastructure and works for languages without MT systems.

### Key Multilingual Models

**mBERT** (Devlin et al., 2019): Standard BERT pre-trained on Wikipedia text from 104 languages. Despite no explicit cross-lingual objective, mBERT achieves surprisingly strong cross-lingual transfer. On NER (WikiAnn), English-fine-tuned mBERT achieves 62.2% average F1 across 40 languages in zero-shot.

**XLM** (Conneau and Lample, 2019): Added explicit cross-lingual pre-training through Translation Language Modeling (TLM), which concatenates parallel sentence pairs during MLM training, encouraging alignment.

**XLM-R** (Conneau et al., 2020): Scaled to 100 languages using 2.5TB of CommonCrawl data and a larger 550M-parameter architecture. XLM-R significantly outperforms mBERT: on XNLI zero-shot, 79.2% average accuracy vs. mBERT's 65.4%. On WikiAnn NER, 65.4% average F1 vs. mBERT's 62.2%.

### The Curse of Multilinguality

A fundamental tension in multilingual models: adding more languages to a fixed-capacity model eventually degrades per-language performance. Conneau et al. (2020) documented this trade-off:

- Models with 7 languages outperform monolingual models (positive transfer from related languages).
- Performance peaks at around 15-30 languages, depending on model capacity.
- Beyond this, adding more languages causes per-language degradation (negative transfer), particularly for low-resource languages that get diluted.

Increasing model capacity partially mitigates this: XLM-R (550M) suffers less from multilinguality than mBERT (110M). The implication is that truly universal multilingual models require very large capacity, which motivates language-specific adapters (see `llm-concepts/06-parameter-efficient-fine-tuning/adapters-and-prompt-tuning.md` in the LLM Concepts collection).

## Why It Matters

1. **Democratizes NLP globally**: Cross-lingual transfer enables NLP applications for thousands of languages that lack labeled training data -- healthcare chatbots in Swahili, legal document processing in Bengali, content moderation in Tagalog.
2. **Reduces annotation costs**: Instead of labeling data in every target language (~$5K-50K per language per task), one English dataset ($5K-50K) transfers to 100+ languages simultaneously.
3. **Enables rapid deployment**: A model fine-tuned on English NER can be deployed for 100 languages within hours, without waiting for translation or annotation in each language.
4. **Supports linguistic research**: Cross-lingual transfer patterns reveal which languages share deep structural similarities, contributing to computational typology (see `language-diversity-and-typology.md`).
5. **Foundation for multilingual products**: Global products (search engines, social media platforms, virtual assistants) rely on cross-lingual transfer to provide consistent NLP capabilities across their supported languages.

## Key Technical Details

- **mBERT**: 110M parameters, 104 languages, trained on Wikipedia (~2.5B tokens across all languages), 110K shared WordPiece vocabulary.
- **XLM-R Base**: 270M parameters, 100 languages, 2.5TB of filtered CommonCrawl, 250K SentencePiece vocabulary.
- **XLM-R Large**: 550M parameters, same data and vocabulary as Base.
- **XNLI zero-shot accuracy (English fine-tuned)**: mBERT 65.4%, XLM-R Base 76.2%, XLM-R Large 79.2% (average over 15 languages); English-specific: mBERT 82.1%, XLM-R Large 88.7%.
- **WikiAnn NER zero-shot F1**: mBERT 62.2%, XLM-R Large 65.4% (average over 40 languages).
- **XTREME benchmark**: XLM-R Large achieves an average score of 79.5 across 9 tasks in 40 languages.
- **Cross-lingual transfer gap**: Performance drops 5-25% from English to target languages depending on language similarity, script, and resource level; closely related languages (English-German) lose ~5%, distant languages (English-Japanese) lose ~20%.
- **Curse of multilinguality threshold**: Performance degradation begins around 15-30 languages for a 110M-parameter model; scales approximately linearly with model capacity.

## Common Misconceptions

**"Cross-lingual transfer requires parallel corpora."** mBERT and XLM-R achieve strong cross-lingual transfer without any parallel data -- they are trained only on monolingual text from each language. Parallel data (as in XLM's TLM) helps but is not required. The alignment emerges from shared vocabulary and structural similarities.

**"All languages transfer equally well."** Transfer effectiveness varies dramatically by language pair. Typologically similar languages (English-German, Spanish-Portuguese) transfer well. Distant languages (English-Japanese, English-Finnish) transfer poorly. Script differences add another barrier: languages using non-Latin scripts receive fewer shared subword tokens, weakening alignment.

**"Multilingual models are as good as monolingual models."** For high-resource languages like English, monolingual BERT typically outperforms mBERT by 1-3% due to capacity dilution. The multilingual model trades peak performance in any single language for breadth across many languages. This trade-off is acceptable for cross-lingual applications but suboptimal for monolingual tasks.

**"Zero-shot means zero English data."** "Zero-shot cross-lingual" means zero labeled data in the target language. The model is still fine-tuned on English labeled data. True zero-shot (no labeled data in any language) requires prompting or task reformulation (see `prompt-based-nlp.md`).

## Connections to Other Concepts

- `transfer-learning-in-nlp.md` provides the general framework; cross-lingual transfer extends it across language boundaries.
- `bert.md` is the base architecture for mBERT; understanding BERT's pre-training is essential for understanding how multilingual variants work.
- `domain-adaptation.md` addresses a parallel challenge: transferring across domains rather than across languages. Both can be combined (e.g., multilingual biomedical NER).
- `word2vec.md` and `cross-lingual-word-embeddings.md` (Category 10) represent earlier approaches to cross-lingual transfer using aligned static embeddings.
- `multilingual-transformers.md` (Category 10) covers mBERT, XLM-R, and their architecture in greater depth.
- `named-entity-recognition.md` and `natural-language-inference.md` are the most commonly evaluated cross-lingual transfer tasks.
- `prompt-based-nlp.md` offers an alternative cross-lingual approach where multilingual prompts can elicit target-language outputs.
- In the LLM Concepts collection, `llm-concepts/06-parameter-efficient-fine-tuning/adapters-and-prompt-tuning.md` describes language-specific adapters that mitigate the curse of multilinguality.

## Further Reading

- Pires et al., *How Multilingual is Multilingual BERT?*, 2019 -- first systematic study of mBERT's cross-lingual transfer capabilities and limitations.
- Conneau et al., *Unsupervised Cross-lingual Representation Learning at Scale (XLM-R)*, 2020 -- scaled multilingual pre-training and documented the curse of multilinguality.
- Hu et al., *XTREME: A Massively Multilingual Multi-task Benchmark for Evaluating Cross-lingual Generalization*, 2020 -- comprehensive benchmark covering 40 languages across 9 diverse tasks.
- Conneau and Lample, *Cross-lingual Language Model Pretraining (XLM)*, 2019 -- introduced Translation Language Modeling for explicit cross-lingual alignment.
- K et al., *Cross-Lingual Ability of Multilingual BERT: An Empirical Study*, 2020 -- analyzed the factors contributing to mBERT's cross-lingual success (shared vocabulary, structural similarity, parameter sharing).
