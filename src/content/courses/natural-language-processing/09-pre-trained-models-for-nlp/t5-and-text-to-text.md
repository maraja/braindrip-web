# T5 and Text-to-Text

**One-Line Summary**: T5 (Text-to-Text Transfer Transformer) unifies every NLP task -- classification, translation, summarization, question answering, and more -- into a single text-to-text framework where both inputs and outputs are text strings, enabling a systematic comparison of pre-training objectives, architectures, and datasets at scales from 60M to 11B parameters.

**Prerequisites**: `transfer-learning-in-nlp.md`, `bert.md`, `gpt-for-nlp-tasks.md`, `attention-mechanism.md`, `sequence-to-sequence-models.md`

## What Is T5?

Imagine a universal translator -- not just between languages, but between task formats. You speak to it in natural language ("Translate English to German: That is good."), and it responds in natural language ("Das ist gut."). Ask it to classify sentiment ("sst2 sentence: this movie is great"), and it responds with the text label ("positive"). Ask it to summarize, and it produces a summary. The machine never changes its structure -- the same model, the same input format, the same output format. That is T5.

T5, introduced by Raffel et al. (2020) at Google, takes a deliberately unified approach: every NLP task is cast as a text-to-text problem. The model receives a text input and produces a text output. Classification becomes text generation (the model generates the label string "positive" rather than selecting class index 1). Translation, summarization, question answering, and grammatical acceptability all use the identical encoder-decoder architecture with the identical training procedure -- only the text prefix that identifies the task changes.

This design enabled the paper's other major contribution: the most comprehensive empirical study of transfer learning in NLP, systematically comparing pre-training objectives, architectures (encoder-only, decoder-only, encoder-decoder), unsupervised objectives (language modeling, denoising, span corruption), and data strategies. T5 is as much a research methodology paper as a model paper.

## How It Works

### The Text-to-Text Framework

Every task is formatted with a task-specific text prefix followed by the input, and the model generates the output as text:

```
Input:  "translate English to German: That is good."
Output: "Das ist gut."

Input:  "sst2 sentence: this movie was terrible."
Output: "negative"

Input:  "summarize: [long article text]"
Output: "[summary text]"

Input:  "stsb sentence1: The cat sat on the mat. sentence2: A cat is on the mat."
Output: "4.2"
```

Even regression tasks (like semantic similarity scores) are formatted as text: the model generates the string "4.2" rather than outputting a floating-point number. This radical uniformity means the same loss function (cross-entropy on output tokens), the same architecture, and the same training procedure are used for everything.

### Architecture: Encoder-Decoder Transformer

T5 uses the original encoder-decoder transformer architecture (Vaswani et al., 2017), with some modifications:

- **Encoder**: Bidirectional self-attention (like BERT) processes the input text.
- **Decoder**: Causal self-attention (like GPT) generates the output text token-by-token, with cross-attention to encoder representations.
- **Relative position biases**: Instead of absolute position embeddings, T5 uses learned relative position biases in the attention computation, allowing better generalization to unseen sequence lengths.
- **Simplified layer norm**: Pre-norm (layer norm applied before, rather than after, each sub-layer) with no bias terms in dense layers.

This encoder-decoder design combines the strengths of both BERT (bidirectional encoding for understanding) and GPT (autoregressive decoding for generation), which Raffel et al. found consistently outperformed encoder-only and decoder-only alternatives in controlled comparisons.

### Pre-Training: Span Corruption

T5's pre-training objective is **span corruption** -- a denoising task where contiguous spans of tokens are replaced with sentinel tokens, and the model must generate the missing spans:

```
Input:  "The <X> brown <Y> over the lazy dog."
Output: "<X> quick <Y> fox jumps"
```

Approximately 15% of tokens are masked, with an average span length of 3 tokens. This is more efficient than BERT's token-level MLM because: (1) the model predicts multiple tokens per corrupted region, (2) the target sequence is shorter (only the masked spans), reducing compute, and (3) contiguous span prediction encourages learning multi-word patterns.

Raffel et al. compared span corruption against BERT-style MLM, GPT-style language modeling, deshuffling, and other objectives. Span corruption consistently outperformed alternatives in the text-to-text setting.

### The C4 Dataset

T5 was pre-trained on the **Colossal Clean Crawled Corpus (C4)** -- approximately 750GB of English text extracted from Common Crawl with aggressive quality filtering:
- Removed pages with fewer than 5 sentences.
- Removed pages with profanity or placeholder text ("lorem ipsum").
- Removed duplicate paragraphs.
- Retained only English text (detected via langdetect).

C4 represented a significant step toward curated, high-quality pre-training data, influencing subsequent efforts like The Pile and RedPajama.

### T5 Model Sizes

| Model | Parameters | Layers | d_model | d_ff  | Heads |
|-------|-----------|--------|---------|-------|-------|
| T5-Small  | 60M   | 6+6    | 512     | 2,048  | 8     |
| T5-Base   | 220M  | 12+12  | 768     | 3,072  | 12    |
| T5-Large  | 770M  | 24+24  | 1,024   | 4,096  | 16    |
| T5-3B     | 3B    | 24+24  | 1,024   | 16,384 | 32    |
| T5-11B    | 11B   | 24+24  | 1,024   | 65,536 | 128   |

The 11B model achieved SOTA on GLUE (90.3), SuperGLUE (88.9), SQuAD (96.2 F1), and CNN/DailyMail summarization (43.5 ROUGE-1) at the time of publication.

### Flan-T5: Instruction Tuning

Chung et al. (2022) applied instruction tuning to T5, creating **Flan-T5**. The model was fine-tuned on 1,836 tasks phrased as natural language instructions (from the Flan collection). Flan-T5 outperforms T5 on zero-shot and few-shot tasks by large margins: Flan-T5-XL (3B) matches or exceeds T5-11B on many benchmarks, demonstrating that instruction tuning is an effective way to extract more capability from a pre-trained model. This connects to the broader alignment and post-training literature in `llm-concepts/05-alignment-and-post-training/`.

## Why It Matters

1. **Unified NLP framework**: By casting all tasks as text-to-text, T5 eliminated the need for task-specific output heads, enabling a single model to handle classification, generation, and structured prediction identically.
2. **Systematic empirical study**: The T5 paper's controlled experiments on pre-training objectives, model architectures, dataset sizes, and training strategies remain the most comprehensive comparison in transfer learning.
3. **Encoder-decoder vindication**: T5 showed that encoder-decoder architectures often outperform both encoder-only (BERT-style) and decoder-only (GPT-style) models when both understanding and generation are required.
4. **Data quality matters**: The C4 dataset demonstrated that pre-training data quality significantly affects downstream performance, foreshadowing the modern emphasis on data curation.
5. **Foundation for instruction tuning**: Flan-T5 showed that T5's text-to-text framework naturally lends itself to instruction following, bridging pre-trained models and the instruction-tuned LLMs covered in the LLM Concepts collection.

## Key Technical Details

- **Pre-training data**: C4, ~750GB of cleaned English web text from Common Crawl.
- **Pre-training compute**: T5-11B trained for ~1T tokens; estimated cost comparable to GPT-3 pre-training (~$1M+ in 2020 cloud pricing).
- **Span corruption**: 15% of tokens masked, average span length 3, sentinel tokens replacing each span.
- **Vocabulary**: SentencePiece with 32,000 subword tokens.
- **GLUE**: T5-11B achieved 90.3 (single model), surpassing BERT-large (82.1) by 8.2 points.
- **SuperGLUE**: T5-11B achieved 88.9, approaching human baseline (89.8).
- **SQuAD 1.1**: T5-11B F1 of 96.2.
- **CNN/DailyMail**: T5-11B ROUGE-1 of 43.5.
- **Multi-task training**: T5 can be fine-tuned on multiple tasks simultaneously by mixing task-prefixed examples, with proportional sampling to prevent large-dataset tasks from dominating.
- **Flan-T5 gain**: Instruction tuning improves T5-XL by an average of ~10% on held-out tasks compared to the base T5 model.

## Common Misconceptions

**"T5 is just BART with a different name."** While T5 and BART (Lewis et al., 2020) both use encoder-decoder architectures for pre-training, they differ substantially. BART uses a combination of corruption strategies (token masking, deletion, infilling, rotation, permutation), while T5 uses span corruption only. More importantly, T5's text-to-text framework fundamentally changes how tasks are formatted, and the paper's systematic experiments distinguish it from BART's more pragmatic approach.

**"The text-to-text framework is inefficient for classification."** Generating the word "positive" is more expensive than a single softmax, but the overhead is minimal (1-2 extra decoding steps). The benefit is architectural simplicity and the ability to handle any task without specialized output heads. In practice, the inference cost difference is negligible for classification.

**"T5-11B is necessary for good results."** T5-Base (220M) already outperforms BERT-base (110M) on most benchmarks. T5-Large (770M) matches or exceeds BERT-large (340M). The 11B model represents the best performance, but the smaller variants offer excellent accuracy-efficiency trade-offs for production deployment.

**"Span corruption is just masked language modeling."** Span corruption differs from BERT's MLM in three ways: (1) it masks contiguous spans rather than random tokens, (2) the model generates the masked content rather than predicting it in place, and (3) the decoder processes only the masked spans, reducing computational cost.

## Connections to Other Concepts

- `transfer-learning-in-nlp.md` provides the paradigm that T5 systematically evaluated and unified.
- `bert.md` represents the encoder-only approach that T5 compared against (and outperformed with its encoder-decoder design).
- `gpt-for-nlp-tasks.md` represents the decoder-only alternative; T5 showed that encoder-decoder is superior for tasks requiring both input understanding and output generation.
- `sequence-to-sequence-models.md` describes the encoder-decoder foundation that T5 is built upon.
- `text-summarization.md`, `machine-translation.md`, and `question-answering.md` are all tasks naturally handled by T5's text-to-text framework.
- `prompt-based-nlp.md` shares T5's philosophy of reformulating tasks through text, though T5 uses task prefixes rather than cloze-style prompts.
- `domain-adaptation.md` can leverage T5 as the base model for continued pre-training on domain-specific corpora.
- In the LLM Concepts collection, `llm-concepts/01-foundational-architecture/encoder-decoder-architecture.md` covers the architectural details, and `llm-concepts/05-alignment-and-post-training/synthetic-data.md` relates to Flan-T5's use of diverse instruction data.

## Further Reading

- Raffel et al., *Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer (T5)*, 2020 -- the foundational paper with comprehensive experiments on pre-training objectives, architectures, and data.
- Lewis et al., *BART: Denoising Sequence-to-Sequence Pre-training for Natural Language Generation, Translation, and Comprehension*, 2020 -- a contemporaneous encoder-decoder model with complementary design choices.
- Chung et al., *Scaling Instruction-Finetuned Language Models (Flan-T5/PaLM)*, 2022 -- demonstrated that instruction tuning dramatically improves T5 on zero-shot and few-shot tasks.
- Xue et al., *mT5: A Massively Multilingual Pre-trained Text-to-Text Transformer*, 2021 -- extended T5 to 101 languages, enabling multilingual text-to-text transfer.
- Tay et al., *UL2: Unifying Language Learning Paradigms*, 2022 -- proposed a mixture-of-denoisers objective that generalizes T5's span corruption, further improving on the text-to-text framework.
