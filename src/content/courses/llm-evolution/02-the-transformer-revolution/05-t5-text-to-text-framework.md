# T5: The Text-to-Text Transfer Transformer

**One-Line Summary**: T5 (Raffel et al., 2019) unified every NLP task into a single text-to-text format, conducted the most systematic empirical study of transfer learning design choices, and introduced the C4 dataset — demonstrating that encoder-decoder models could match or exceed decoder-only approaches when all tasks are treated as text generation.

**Prerequisites**: `01-attention-is-all-you-need.md`, `03-bert.md`, `04-gpt-2.md`

## What Is T5?

Imagine a universal translator — not just between languages, but between any form of text input and text output. You ask it to translate, it translates. You ask it to summarize, it summarizes. You ask it to classify sentiment, it outputs "positive" or "negative" as text. You ask it a question, it answers in text. Every possible NLP task is reduced to one format: text goes in, text comes out. The model doesn't need different architectures or output heads for different tasks. It just needs to know what task to perform — which you tell it in the input.

This was the elegant insight behind T5, the **Text-to-Text Transfer Transformer**. Published by Colin Raffel and colleagues at Google Research in October 2019, the paper had a deliberate subtitle: "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer." This was not just another model release. It was a massive empirical study — the paper is 67 pages long — systematically testing every major design decision in transfer learning: model architecture, pre-training objective, pre-training dataset, transfer approach, and scale.

The NLP landscape in 2019 was fragmented. BERT used an encoder with MLM. GPT used a decoder with causal LM. XLNet used permutation LM. Different tasks used different fine-tuning strategies. T5 cut through this complexity by asking: what if we just unify everything as text-to-text? The answer was a model that could do everything and a study that mapped the design space with unprecedented rigor.

## How It Works

```
  T5: Every Task as Text-to-Text

  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  │  Translation:                                               │
  │  INPUT:  "translate English to German: That is good."       │
  │  OUTPUT: "Das ist gut."                                     │
  │                                                             │
  │  Classification:                                            │
  │  INPUT:  "cola sentence: The course is jumping well."       │
  │  OUTPUT: "not acceptable"                                   │
  │                                                             │
  │  Summarization:                                             │
  │  INPUT:  "summarize: [long article text...]"                │
  │  OUTPUT: "[concise summary]"                                │
  │                                                             │
  │  Question Answering:                                        │
  │  INPUT:  "question: What is the capital? context: France..."│
  │  OUTPUT: "Paris"                                            │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘

  Architecture: Full Encoder-Decoder Transformer
  ┌─────────────────┐         ┌─────────────────┐
  │     ENCODER      │         │     DECODER      │
  │  (bidirectional  │  cross  │  (autoregressive │
  │   self-attention)│──attn──▶│   generation)    │
  │                  │         │                  │
  │  Reads full      │         │  Generates       │
  │  input text      │         │  output text     │
  └─────────────────┘         └─────────────────┘
   "translate English            "Das ist gut."
    to German: ..."
```
*Figure: T5 converts every NLP task into the same text-to-text format with a task prefix, using a full encoder-decoder Transformer. The encoder reads the input bidirectionally; the decoder generates the output autoregressively.*

### The Text-to-Text Framework

T5 converts every task into the same format by prepending a task-specific prefix:

- **Translation**: "translate English to German: That is good." → "Das ist gut."
- **Summarization**: "summarize: [article text]" → "[summary text]"
- **Classification**: "cola sentence: The course is jumping well." → "not acceptable"
- **Question answering**: "question: What is the capital of France? context: [passage]" → "Paris"
- **Similarity**: "stsb sentence1: The cat sat on the mat. sentence2: A cat is on the mat." → "5.0"

Even classification tasks that traditionally output a single label are reformulated as generating the label text. This means the same model architecture, the same loss function, and the same decoding procedure are used for every task. The prefix is the only task-specific component.

### Architecture: Encoder-Decoder

T5 uses the original encoder-decoder Transformer architecture from `01-attention-is-all-you-need.md`, unlike the encoder-only BERT or decoder-only GPT. The encoder processes the full input with bidirectional attention (no causal mask), and the decoder generates the output autoregressively with causal masking and cross-attention to the encoder. T5 came in several sizes:

| Model | Layers | d_model | Heads | Parameters |
|-------|--------|---------|-------|------------|
| T5-Small | 6+6 | 512 | 8 | 60M |
| T5-Base | 12+12 | 768 | 12 | 220M |
| T5-Large | 24+24 | 1024 | 16 | 770M |
| T5-3B | 24+24 | 1024 | 32 | 3B |
| T5-11B | 24+24 | 1024 | 128 | 11B |

The architecture used relative position biases (instead of sinusoidal or learned absolute positions), which proved important for generalization to sequence lengths not seen during training.

### C4: The Colossal Clean Crawled Corpus

T5 introduced **C4**, a new pre-training dataset constructed by aggressively filtering Common Crawl. The cleaning pipeline removed: pages with profanity, pages shorter than 5 sentences, pages with boilerplate indicators (like "lorem ipsum" or "terms of service"), duplicate sentences (detected with 3-gram deduplication), and pages not primarily in English. The result was approximately **750GB of clean English text** — far larger than BERT's 16GB or GPT-2's 40GB. C4 became a standard pre-training dataset used by many subsequent models.

### The Systematic Exploration

The paper systematically tested alternatives for each design choice:

**Architectures**: Encoder-decoder vs decoder-only vs prefix LM (decoder with non-causal prefix). Finding: encoder-decoder slightly outperformed decoder-only on most tasks when both had the same number of parameters, though the advantage was modest.

**Pre-training objectives**: Causal LM vs MLM vs span corruption (mask contiguous spans, not individual tokens) vs several other variants. Finding: span corruption with mean span length of 3 and 15% corruption rate was optimal.

**Pre-training datasets**: C4 vs Wikipedia vs other corpora. Finding: more diverse data was better; domain-specific data helped for domain-specific tasks.

**Training strategies**: Fine-tuning all parameters vs adapter layers vs gradual unfreezing. Finding: fine-tuning all parameters was simplest and best for most tasks.

**Scale**: From 60M to 11B parameters. Finding: scale consistently improved performance, with no sign of diminishing returns.

## Why It Matters

### The Most Systematic Study of Transfer Learning

No other paper of this era conducted such a comprehensive, controlled exploration of design choices. By changing one variable at a time (architecture, objective, data, scale), T5 provided the field with a roadmap. Many of its findings — span corruption is better than individual masking, more data is better, encoder-decoder is competitive with decoder-only — influenced years of subsequent research.

### Unifying the Task Landscape

The text-to-text framework was conceptually liberating. Instead of designing different model heads, loss functions, and training procedures for different tasks, practitioners could use a single model for everything. This approach anticipated the prompt-based paradigm that would dominate with GPT-3 and later models. The T5 framework showed that task-specific knowledge could be entirely in the text prompt, not in the model architecture.

### The Encoder-Decoder Alternative

While the field was moving toward decoder-only models (GPT-2, GPT-3), T5 demonstrated that encoder-decoder models had real advantages. Bidirectional encoding of the input, combined with autoregressive decoding of the output, provided the best of both worlds for many tasks. The T5 lineage continued through Flan-T5 (instruction-tuned), UL2, and influenced the design of models like PaLM-2.

## Key Technical Details

- **Paper**: Raffel et al., "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer" (Oct 2019, arXiv:1910.10683, JMLR 2020)
- **Largest model**: T5-11B — 11 billion parameters, the largest model at time of publication
- **Pre-training data**: C4 (Colossal Clean Crawled Corpus), ~750GB of clean English text from Common Crawl
- **Pre-training objective**: Span corruption — mask contiguous spans of mean length 3, covering 15% of tokens
- **Training**: T5-11B trained for ~1 trillion tokens; estimated $1.3M in TPU compute
- **Results**: SOTA or near-SOTA on GLUE (90.3), SuperGLUE (88.9), SQuAD (93.8 F1), CNN/DailyMail (summarization), WMT EN-DE (BLEU 30.9)
- **Paper length**: 67 pages — the most exhaustive empirical study of its era
- **Key finding**: Encoder-decoder with span corruption + 15% masking rate + diverse data + scale → best results
- **Downstream influence**: C4 became a standard pre-training corpus; text-to-text format adopted by many subsequent models

## Common Misconceptions

- **"T5 proved encoder-decoder is better than decoder-only."** The advantage was modest and task-dependent. For equivalent parameter counts, encoder-decoder slightly outperformed decoder-only on understanding tasks. But decoder-only models proved to scale better with massively more parameters (GPT-3, PaLM), and the simplicity advantage of decoder-only architectures ultimately won out for the largest models.

- **"T5 is just BERT with a decoder."** T5's pre-training objective (span corruption) is different from BERT's MLM. The text-to-text framework means fine-tuning is fundamentally different — BERT adds task-specific heads, T5 generates text. And T5 explored design choices far more systematically than BERT.

- **"The text-to-text framework is just a gimmick."** Converting classification to text generation does add overhead (generating "positive" takes more compute than a softmax over 2 classes). But the unification benefit is real: one model, one training procedure, one codebase for every task. This simplicity proved valuable in practice and anticipated the prompt-based paradigm.

- **"T5-11B was impractically large."** At 11 billion parameters, T5-11B was the largest published model in 2019. But within a year, GPT-3 (175B) made it look small. The 11B size turned out to be a practical sweet spot for many years — large enough to be powerful, small enough to fine-tune on reasonable hardware.

## Connections to Other Concepts

- Used the encoder-decoder architecture from `01-attention-is-all-you-need.md`
- Systematically compared against approaches from `03-bert.md` (MLM), `02-gpt-1.md` (causal LM), and `06-xlnet.md` (permutation LM)
- The text-to-text framework anticipated the prompt-based paradigm popularized by `04-gpt-2.md` and later GPT-3
- C4 dataset became a standard reference corpus, used by many subsequent models
- The architecture comparison feeds directly into `07-encoder-vs-decoder-vs-encoder-decoder.md`
- For deeper discussion of pre-training objectives, see `llm-concepts/pre-training-and-fine-tuning.md`

## Further Reading

- Raffel et al., "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer" (2019, arXiv:1910.10683) — the T5 paper
- Chung et al., "Scaling Instruction-Finetuned Language Models" (2022, arXiv:2210.11416) — Flan-T5, instruction-tuned T5
- Tay et al., "UL2: Unifying Language Learning Paradigms" (2022, arXiv:2205.05131) — unified pre-training that built on T5's exploration
- Roberts et al., "How Much Knowledge Can You Pack Into the Parameters of a Language Model?" (2020, arXiv:2002.08910) — probing T5's stored knowledge
- Xue et al., "mT5: A Massively Multilingual Pre-trained Text-to-Text Transformer" (2020, arXiv:2010.11934) — multilingual T5
