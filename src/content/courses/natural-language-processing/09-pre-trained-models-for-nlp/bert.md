# BERT

**One-Line Summary**: BERT (Bidirectional Encoder Representations from Transformers) pre-trains a deep transformer encoder using masked language modeling and next sentence prediction, producing bidirectional contextualized representations that shattered records across 11 NLP benchmarks and spawned an entire family of variants that continue to dominate NLP.

**Prerequisites**: `attention-mechanism.md`, `contextual-embeddings.md`, `transfer-learning-in-nlp.md`, `text-classification.md`, `elmo.md`

## What Is BERT?

Imagine trying to understand a sentence with one eye closed -- you can only see words to the left of whatever word you are currently reading. That is how traditional language models like GPT-1 work: they process text left-to-right. Now open both eyes. You can see the full sentence simultaneously, using both the left and right context to understand each word. That is BERT. The word "bank" in "I sat on the river bank" is unambiguous when you can see both "river" to the left and the broader sentence structure to the right.

BERT, introduced by Devlin et al. (2019) at Google, is a pre-trained transformer encoder that learns bidirectional representations of text. Unlike `elmo.md`, which concatenates independently trained left-to-right and right-to-left models, BERT uses a masked language modeling (MLM) objective that allows every position to attend to every other position simultaneously through multi-head self-attention. This deep bidirectionality is BERT's core innovation.

After pre-training on 3.3 billion tokens, BERT can be fine-tuned for virtually any NLP task by adding a simple output layer. This simplicity -- combined with state-of-the-art results on GLUE, SQuAD, and other benchmarks -- made BERT the most influential NLP paper of the decade and established the pre-train-then-fine-tune paradigm as the default approach.

## How It Works

### Pre-Training Objectives

**Masked Language Modeling (MLM).** BERT randomly masks 15% of input tokens and trains the model to predict them from their bidirectional context. Of the selected tokens, 80% are replaced with [MASK], 10% with a random token, and 10% are left unchanged. This 80/10/10 strategy prevents the model from learning that [MASK] always indicates a prediction target, reducing the mismatch between pre-training and fine-tuning (where no [MASK] tokens appear).

For a masked position i, the loss is the cross-entropy between the predicted token distribution and the true token:

```
L_MLM = -log P(t_i | context)
```

**Next Sentence Prediction (NSP).** BERT receives pairs of sentences (A, B) and predicts whether B actually follows A in the corpus (IsNext) or is a random sentence (NotNext). The `[CLS]` token representation is passed through a binary classifier. NSP was intended to capture inter-sentence relationships important for tasks like QA and NLI. However, later work (RoBERTa, Liu et al., 2019) showed that NSP provides minimal benefit and may even hurt performance when training with longer sequences.

### Input Representation

Each input token is represented as the sum of three embeddings:
1. **Token embedding**: WordPiece subword token (vocabulary of 30,522 tokens).
2. **Segment embedding**: Indicates whether the token belongs to Sentence A or Sentence B (for sentence-pair tasks).
3. **Position embedding**: Learned absolute position embedding (max sequence length 512).

Special tokens: `[CLS]` is prepended to every input (its final representation is used for classification tasks), and `[SEP]` separates the two sentences in a pair.

### Architecture

BERT uses only the encoder portion of the original transformer architecture (Vaswani et al., 2017). For a detailed treatment of transformer mechanics, see the LLM Concepts collection at `llm-concepts/01-foundational-architecture/self-attention.md`.

| Configuration | Layers | Hidden Size | Attention Heads | Parameters |
|--------------|--------|-------------|-----------------|------------|
| BERT-base    | 12     | 768         | 12              | 110M       |
| BERT-large   | 24     | 1,024       | 16              | 340M       |

Each layer applies multi-head self-attention followed by a position-wise feed-forward network, with residual connections and layer normalization at each step.

### Fine-Tuning for Downstream Tasks

BERT fine-tuning is remarkably uniform across tasks:

- **Classification** (sentiment, NLI): Take the `[CLS]` representation, add a linear layer + softmax. Fine-tune entire model.
- **Token-level tasks** (NER, POS tagging): Take each token's final-layer representation, add a per-token classifier.
- **Extractive QA** (SQuAD): Add start and end token classifiers over the passage tokens; the answer is the span with the highest combined start + end score.
- **Sentence-pair tasks** (paraphrase, entailment): Encode both sentences with segment embeddings; classify from `[CLS]`.

Fine-tuning hyperparameters: learning rate 2e-5 to 5e-5, batch size 16 or 32, 3-4 epochs. Training takes 1-25 minutes on a single cloud GPU depending on dataset size.

### The BERT Variant Explosion

BERT's success spawned an entire family of improved models:

- **RoBERTa** (Liu et al., 2019): Removed NSP, trained longer with more data (160GB), dynamic masking. Improved GLUE from 82.1 to 88.5.
- **ALBERT** (Lan et al., 2020): Factorized embedding parameters and cross-layer sharing, reducing parameters from 108M to 12M while maintaining 96% of BERT performance.
- **DistilBERT** (Sanh et al., 2019): Knowledge distillation to 6 layers, retaining 97% of BERT's performance at 60% size and 60% faster inference.
- **DeBERTa** (He et al., 2021): Disentangled attention (separate content and position representations) + enhanced mask decoder. Achieved 90.7 on SuperGLUE, surpassing human baselines.
- **SpanBERT** (Joshi et al., 2020): Masks contiguous spans instead of random tokens, improving performance on span-selection tasks like QA.
- **ELECTRA** (Clark et al., 2020): Replaced MLM with a replaced-token-detection objective, achieving BERT-level performance with 1/4 the compute.

## Why It Matters

1. **Benchmark domination**: BERT-large improved GLUE by 7.7 absolute points over previous SOTA, achieved 93.2 F1 on SQuAD 1.1 (vs. 91.6 for the prior best), and surpassed human performance on several tasks.
2. **Simplified NLP engineering**: The pre-train-then-fine-tune paradigm reduced the need for task-specific architectures, feature engineering, and large labeled datasets. One model architecture fits nearly all tasks.
3. **Democratized high-performance NLP**: Hugging Face Transformers made BERT accessible in a few lines of code, enabling non-specialists to deploy state-of-the-art models.
4. **Launched the pre-training arms race**: BERT's success motivated a flood of research into pre-training objectives, architectures, and scaling -- leading to RoBERTa, T5, GPT-3, and the modern LLM ecosystem.
5. **Industry adoption**: BERT was deployed in Google Search (October 2019) to improve query understanding for ~10% of English queries, representing one of the largest real-world NLP deployments at the time.

## Key Technical Details

- **Pre-training data**: BooksCorpus (800M words) + English Wikipedia (2,500M words) = 3.3B tokens total.
- **Pre-training compute**: 4 days on 4-16 Cloud TPUs (BERT-base); 4 days on 64 TPUs (BERT-large). Estimated cost: $10K-$50K.
- **WordPiece vocabulary**: 30,522 tokens, learned from the training corpus.
- **Maximum sequence length**: 512 tokens (shorter sequences used for 90% of pre-training steps for efficiency).
- **GLUE benchmark scores**: BERT-base 79.6, BERT-large 82.1, RoBERTa-large 88.5, DeBERTa-v3-large ~91.
- **SQuAD 1.1**: BERT-large single model 90.9 F1, ensemble 93.2 F1.
- **SQuAD 2.0**: BERT-large 83.1 F1 (includes unanswerable questions).
- **Fine-tuning cost**: $1-10 per task on a single GPU (minutes to ~1 hour).

## Common Misconceptions

**"BERT is a language model."** Strictly, BERT is not a language model in the traditional sense -- it cannot generate text autoregressively. MLM is a denoising objective (predict masked tokens from context), not a left-to-right generative model. BERT is an encoder that produces representations; for generation, see `gpt-for-nlp-tasks.md` and `t5-and-text-to-text.md`.

**"BERT understands language."** BERT learns statistical patterns from massive text corpora. It excels at tasks that require pattern matching over surface forms and distributional semantics, but it does not reason in a human-like way. It can fail spectacularly on tasks requiring causal reasoning, negation, or world knowledge beyond its training data (see `commonsense-reasoning.md`).

**"Bigger BERT is always better."** BERT-large outperforms BERT-base on most benchmarks, but the gap is often small (1-3 points) while compute triples. On small datasets, BERT-large can actually underperform BERT-base due to overfitting. For production, DistilBERT or ALBERT often provide the best accuracy-efficiency trade-off.

**"The [CLS] token is a sentence embedding."** Out of the box, the `[CLS]` representation is not a good sentence embedding -- it was trained for NSP, not semantic similarity. For sentence-level tasks, fine-tuning or dedicated models like Sentence-BERT (Reimers and Gurevych, 2019) are needed. See `sentence-embeddings.md`.

**"BERT handles long documents well."** BERT's 512-token limit is a hard constraint. Documents longer than ~400 words must be truncated or processed in sliding windows. This motivated long-context models like Longformer and BigBird. See `llm-concepts/01-foundational-architecture/sliding-window-attention.md`.

## Connections to Other Concepts

- `transfer-learning-in-nlp.md` explains the paradigm that BERT established as the dominant approach.
- `elmo.md` was BERT's most direct predecessor; BERT's key insight was replacing ELMo's concatenated bidirectional LSTMs with a masked transformer encoder.
- `contextual-embeddings.md` describes the general concept of context-dependent word representations that BERT produces.
- `text-classification.md`, `named-entity-recognition.md`, `question-answering.md`, and `natural-language-inference.md` are all downstream tasks where BERT set new benchmarks.
- `gpt-for-nlp-tasks.md` represents the decoder-only alternative to BERT's encoder-only approach.
- `t5-and-text-to-text.md` compared BERT-style and GPT-style approaches systematically, unifying them under an encoder-decoder framework.
- `domain-adaptation.md` covers models like BioBERT and SciBERT that continue BERT's pre-training on domain-specific corpora.
- `prompt-based-nlp.md` describes how BERT's MLM objective can be exploited for zero-shot and few-shot classification via cloze prompts.
- In the LLM Concepts collection, `llm-concepts/01-foundational-architecture/self-attention.md` details the transformer architecture underlying BERT.

## Further Reading

- Devlin et al., *BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding*, 2019 -- the original paper introducing masked language modeling and the fine-tuning paradigm.
- Liu et al., *RoBERTa: A Robustly Optimized BERT Pretraining Approach*, 2019 -- demonstrated that BERT was significantly undertrained and that removing NSP, training longer, and dynamic masking yield major gains.
- Clark et al., *ELECTRA: Pre-training Text Encoders as Discriminators Rather Than Generators*, 2020 -- replaced MLM with replaced-token detection for more sample-efficient pre-training.
- He et al., *DeBERTa: Decoding-enhanced BERT with Disentangled Attention*, 2021 -- disentangled content and position representations to achieve the highest GLUE and SuperGLUE scores.
- Rogers et al., *A Primer in BERTology: What We Know About How BERT Works*, 2020 -- comprehensive survey of BERT interpretability and analysis studies.
