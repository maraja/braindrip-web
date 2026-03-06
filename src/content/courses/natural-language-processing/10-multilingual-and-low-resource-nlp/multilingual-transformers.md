# Multilingual Transformers

**One-Line Summary**: Pre-trained transformer models like mBERT and XLM-R that learn shared representations across 100+ languages from massive multilingual corpora, enabling zero-shot cross-lingual transfer.

**Prerequisites**: `bert.md`, `transfer-learning-in-nlp.md`, `tokenization-in-nlp.md`, `cross-lingual-word-embeddings.md`

## What Is a Multilingual Transformer?

Imagine a translator who learned languages not by studying grammar textbooks but by reading vast libraries in 100 different languages simultaneously. Over time, this translator develops an internal "language of thought" -- abstract representations of meaning that transcend any single language. When asked to analyze a Swahili sentence for sentiment, they can draw on patterns learned from millions of English reviews, because both languages use the same internal meaning space. Multilingual transformers work exactly this way.

A multilingual transformer is a transformer-based model (encoder, decoder, or encoder-decoder) pre-trained on text from many languages using a shared vocabulary and shared parameters. The key insight is that when languages share the same model parameters, the model is forced to discover cross-lingual structure: semantic concepts that transcend language boundaries. This enables remarkable zero-shot transfer -- fine-tune on English labeled data, deploy on any of the pre-training languages without any target-language supervision.

## How It Works

### mBERT: Multilingual BERT (Devlin et al., 2019)

The original multilingual BERT was trained on Wikipedia text from the 104 languages with the largest Wikipedias. Key design choices:

- **Shared WordPiece vocabulary**: A single 110K-token vocabulary covering all 104 languages. Tokens are allocated roughly proportional to Wikipedia size, with exponential smoothing (alpha = 0.7) to prevent total domination by English.
- **No cross-lingual signal**: Surprisingly, mBERT uses no parallel data, no translation objectives, and no explicit language alignment. It is simply BERT (masked language modeling + next sentence prediction) trained on concatenated multilingual Wikipedia.
- **Architecture**: Same as BERT-Base: 12 layers, 768 hidden dimensions, 12 attention heads, 110M parameters.

Despite the absence of any cross-lingual training signal, mBERT produces representations that transfer across languages. Wu and Dredze (2019) showed that mBERT achieves 60--80% of supervised performance on NER and POS tagging in zero-shot cross-lingual settings. The mechanism is debated, but shared subword tokens (many languages share Latin-script tokens, numbers, and borrowed words) and shared positional patterns likely contribute.

### XLM: Cross-Lingual Language Model (Conneau & Lample, 2019)

XLM introduced explicit cross-lingual pre-training objectives:

- **Causal Language Modeling (CLM)**: Standard left-to-right language modeling, monolingually.
- **Masked Language Modeling (MLM)**: Same as BERT, applied to monolingual text from each language.
- **Translation Language Modeling (TLM)**: The key innovation. Concatenate parallel sentence pairs (e.g., an English sentence and its French translation) and apply masked language modeling. When a French word is masked, the model can attend to the English translation to predict it, forcing the model to align representations across languages.

TLM requires parallel data but dramatically improves cross-lingual transfer. On the XNLI benchmark (natural language inference in 15 languages), XLM with TLM outperformed mBERT by 4--6 accuracy points.

### XLM-R: XLM-RoBERTa (Conneau et al., 2020)

XLM-R scaled up multilingual pre-training to demonstrate that massive monolingual data alone, without parallel corpora, can achieve state-of-the-art cross-lingual transfer:

- **Training data**: CC-100 corpus, 2.5TB of CommonCrawl data filtered for 100 languages. This is 100x more data than mBERT's Wikipedia-only training.
- **Architecture**: Transformer with 270M parameters (Base) or 550M parameters (Large), using the RoBERTa training recipe (no NSP, dynamic masking, larger batches).
- **Vocabulary**: SentencePiece unigram model with 250K tokens (vs. mBERT's 110K), providing better coverage of non-Latin scripts.
- **Results**: XLM-R Large achieved state-of-the-art on XNLI (81.4% average across 15 languages), MLQA, and other cross-lingual benchmarks, outperforming XLM with TLM despite using no parallel data.

### The Curse of Multilinguality

Conneau et al. (2020) identified a critical trade-off: for a fixed model capacity, adding more languages initially improves transfer to low-resource languages (positive transfer) but eventually degrades performance on all languages (negative transfer). They found:

- Going from 7 to 15 languages: +1.4% average accuracy on XNLI.
- Going from 15 to 30 languages: +0.2% average.
- Going from 30 to 100 languages: -2.1% average, with high-resource languages losing the most.

The solution is either to increase model capacity proportionally or to use language-specific components.

### Language-Specific Adapters

Adapter modules (Houlsby et al., 2019; Pfeiffer et al., 2020) address the curse of multilinguality by inserting small trainable bottleneck layers into the frozen multilingual backbone:

```
Adapter(h) = h + f(h * W_down) * W_up
```

where W_down projects from dimension d to bottleneck dimension m (typically m = 64 or 128), and W_up projects back. This adds only 2 * d * m parameters per adapter layer.

The MAD-X framework (Pfeiffer et al., 2020) stacks language adapters (trained on monolingual MLM) with task adapters (trained on labeled data), enabling modular composition: train a task adapter on English, swap in a Quechua language adapter at inference. This approach matches or exceeds full fine-tuning while adding only 2--4% parameters per language.

## Why It Matters

1. **Zero-shot cross-lingual transfer**: Fine-tune on English, deploy on 100 languages. This is the single most impactful capability for extending NLP to low-resource languages without target-language labeled data.
2. **Unified architecture**: One model replaces 100 language-specific pipelines, dramatically reducing engineering and maintenance costs.
3. **State-of-the-art multilingual performance**: XLM-R and its successors set the standard on cross-lingual benchmarks including XNLI, MLQA, XQuAD, and WikiANN-NER.
4. **Democratization**: Open-source availability of mBERT and XLM-R through HuggingFace Transformers made multilingual NLP accessible to researchers worldwide.
5. **Adapter ecosystem**: The adapter approach enables community-driven expansion to new languages without retraining the entire model.

## Key Technical Details

- mBERT: 104 languages, 110M parameters, 110K WordPiece vocabulary, trained on Wikipedia only.
- XLM: 15--100 languages (depending on configuration), TLM objective requires parallel data from OPUS or similar sources.
- XLM-R Base: 100 languages, 270M parameters, 250K SentencePiece vocabulary, trained on 2.5TB CC-100.
- XLM-R Large: 100 languages, 550M parameters, same vocabulary and data as Base.
- On XNLI (15-language NLI benchmark), accuracy ranges from 65% (mBERT) to 81.4% (XLM-R Large) averaged across languages.
- Vocabulary allocation is critical: XLM-R's 250K vocabulary gives non-Latin scripts 2--3x better token efficiency than mBERT's 110K vocabulary.
- Training XLM-R Large required 500 NVIDIA V100 GPUs for approximately 5 days.
- Per-language performance varies by up to 20 points: XLM-R scores 89% on English XNLI but only 72% on Swahili.
- Subsequent models like BLOOM (176B, 46 languages), mT5 (13B, 101 languages), and NLLB (54B, 200 languages for translation) extend the paradigm further.

## Common Misconceptions

- **"mBERT was intentionally designed for cross-lingual transfer."** mBERT was simply BERT trained on multilingual Wikipedia. Its cross-lingual ability was an emergent, unintended property discovered after release. No parallel data, no alignment objectives, no language tags were used.

- **"More languages always make a better multilingual model."** The curse of multilinguality shows that for fixed model capacity, adding languages beyond a saturation point (around 30 for a 270M-parameter model) degrades per-language performance. Scaling model size or using adapters is necessary.

- **"Multilingual transformers work well for all 100 covered languages."** Performance is highly correlated with pre-training data size. Languages with less than 10MB of training data in CC-100 show substantially degraded zero-shot transfer, sometimes performing only marginally above random baselines.

- **"You need parallel data for effective multilingual pre-training."** XLM-R demonstrated that pure monolingual MLM on sufficient data matches or exceeds TLM-based approaches that use parallel corpora, as long as the monolingual data is large and diverse enough.

## Connections to Other Concepts

- **`bert.md`**: mBERT is literally BERT trained multilingually; understanding BERT's masked language modeling objective is prerequisite.
- **`cross-lingual-word-embeddings.md`**: The predecessor approach to cross-lingual representation; multilingual transformers can be seen as learning contextual cross-lingual embeddings end-to-end.
- **`multilingual-nlp.md`**: Multilingual transformers are the dominant tool for modern multilingual NLP systems.
- **`low-resource-nlp.md`**: Zero-shot transfer via multilingual transformers is the primary strategy for low-resource languages.
- **`transfer-learning-in-nlp.md`**: Cross-lingual transfer is a specialized form of transfer learning where the distribution shift is across languages.
- **`cross-lingual-transfer.md`**: Detailed treatment of the mechanisms and limitations of cross-lingual task transfer.
- **`domain-adaptation.md`**: Adapting multilingual models to specific domains (e.g., legal, biomedical) in specific languages combines domain and language adaptation.
- **`tokenization-in-nlp.md`**: Shared multilingual tokenizers (WordPiece, SentencePiece) are foundational to how these models handle multiple scripts and morphologies.

## Further Reading

- Devlin et al., "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding" (2019) -- The original BERT paper; mBERT is the multilingual variant released alongside it.
- Conneau and Lample, "Cross-Lingual Language Model Pretraining" (2019) -- Introduced XLM with the Translation Language Modeling objective.
- Conneau et al., "Unsupervised Cross-Lingual Representation Learning at Scale" (2020) -- The XLM-R paper demonstrating that scale compensates for the absence of parallel data.
- Pfeiffer et al., "MAD-X: An Adapter-Based Framework for Multi-Task Cross-Lingual Transfer" (2020) -- Language and task adapters enabling modular multilingual NLP.
- Wu and Dredze, "Beto, Bentz, Becas: The Surprising Cross-Lingual Effectiveness of BERT" (2019) -- Systematic evaluation of mBERT's unexpected cross-lingual abilities.
- Hu et al., "XTREME: A Massively Multilingual Multi-task Benchmark for Evaluating Cross-lingual Generalization" (2020) -- The standard benchmark suite for evaluating multilingual models.
