# Encoder-Only vs Decoder-Only vs Encoder-Decoder: The Three Architecture Paradigms

**One-Line Summary**: The Transformer spawned three architectural families — encoder-only (BERT), decoder-only (GPT), and encoder-decoder (T5) — each with distinct strengths, and the surprising dominance of the decoder-only paradigm in the scaling era is one of the most consequential developments in modern AI, though the story is more nuanced than "decoder-only won."

**Prerequisites**: `03-bert.md`, `02-gpt-1.md`, `05-t5-text-to-text-framework.md`

## What Are the Three Paradigms?

Imagine three different approaches to language tasks, each inspired by different aspects of human communication. The **encoder** is a reader: it absorbs an entire text at once, understands it deeply, and forms a rich internal representation — but it cannot speak. The **decoder** is a writer: it produces text one word at a time, each word informed by everything written so far — but it only reads its own output. The **encoder-decoder** is a translator: it first reads and understands the full input, then generates an output word by word, consulting its understanding of the input at every step.

These three paradigms all descend from the original Transformer (`01-attention-is-all-you-need.md`), which was itself an encoder-decoder. But researchers quickly discovered that using only the encoder or only the decoder yielded models better suited to specific families of tasks. The subsequent divergence, competition, and eventual convergence of these three paradigms is one of the central narratives in the evolution of large language models.

## How They Work

```
  The Three Transformer Architecture Paradigms

  ENCODER-ONLY (BERT)          DECODER-ONLY (GPT)        ENCODER-DECODER (T5)
  ┌─────────────────┐         ┌─────────────────┐       ┌────────┐  ┌────────┐
  │  ◀──────────▶   │         │  ──────────▶    │       │ ◀────▶ │  │ ─────▶ │
  │  Bidirectional  │         │  Left-to-right  │       │Encoder │  │Decoder │
  │  Self-Attention │         │  Causal Mask    │       │  (bi)  │──│ (auto) │
  │                 │         │                 │       │        │  │        │
  │  Input ──▶ Repr│         │  Input ──▶ Next │       │Input──▶│  │──▶Out  │
  │                 │         │  token          │       └────────┘  └────────┘
  └─────────────────┘         └─────────────────┘
                                                         cross-attention
  Best for:                   Best for:                  Best for:
  • Classification            • Text generation          • Translation
  • NER, extraction           • Dialogue, chat           • Summarization
  • Embeddings, retrieval     • Code generation          • Structured gen.
  • Semantic similarity       • Reasoning via prompts    • Seq-to-seq tasks

  Scale trajectory:
  BERT 340M ──▶ DeBERTa 1.5B  GPT-1 117M ──▶ GPT-4 ~1.7T  T5 11B ──▶ UL2 20B
  (plateaued ~2021)            (dominant paradigm)          (niche but capable)
```
*Figure: The three Transformer architecture families, their attention patterns, best-use tasks, and scaling trajectories. Decoder-only models have dominated the scaling era, but encoders remain superior for embedding and retrieval tasks.*

### Encoder-Only: Bidirectional Understanding

Encoder-only models — `03-bert.md`, `01-roberta.md`, `04-deberta.md`, `05-electra.md` — use only the Transformer's encoder stack. Every token attends to every other token with no causal mask, providing full bidirectional context. The model processes the entire input simultaneously and produces rich contextual representations for each token.

Pre-training typically uses **masked language modeling** (MLM): mask some tokens, predict them from surrounding context. Fine-tuning adds a task-specific head: a classification layer on the [CLS] token for sentence tasks, per-token classifiers for NER or QA. The key constraint: encoder-only models cannot generate text autoregressively. They produce fixed-size representations, not sequences.

**Best for**: classification, named entity recognition, semantic similarity, extractive question answering, sentence embeddings, retrieval. Tasks where you need to deeply understand a given input.

### Decoder-Only: Autoregressive Generation

Decoder-only models — `02-gpt-1.md`, `04-gpt-2.md`, `01-gpt-3.md`, and every modern frontier LLM — use only the Transformer's decoder stack with a causal attention mask. Each token can only attend to previous tokens (and itself). The model generates text one token at a time, each conditioned on all preceding tokens.

Pre-training uses **causal language modeling** (next-token prediction): given all tokens up to position t, predict token t+1. This objective is simple, scalable, and naturally suited to generation. During inference, the model generates tokens autoregressively — each new token is appended and fed back as context for the next.

**Best for**: text generation, dialogue, code generation, reasoning, general-purpose tasks via prompting. Tasks where you need to produce arbitrary-length output.

### Encoder-Decoder: Understand Then Generate

Encoder-decoder models — `05-t5-text-to-text-framework.md`, BART, mBART, UL2, Flan-T5 — use both stacks. The encoder processes the full input with bidirectional attention. The decoder generates the output autoregressively, using cross-attention to consult the encoder's representations at each step. This architecture was the original Transformer design, purpose-built for sequence-to-sequence tasks like translation.

Pre-training typically uses **span corruption**: mask contiguous spans in the input, and the decoder must generate the missing spans. Fine-tuning casts every task as text-to-text: input text goes to the encoder, output text comes from the decoder.

**Best for**: translation, summarization, structured generation, tasks with clear input-output separation. Tasks where understanding the input and generating the output are distinct phases.

## Why Decoder-Only Won the Scaling Era

### Simplicity and Scalability

Decoder-only models have a single stack with a single objective. There is no encoder-decoder split, no cross-attention, no span corruption. Next-token prediction is the simplest possible training signal: predict the next word. This simplicity has profound engineering advantages: less code to maintain, fewer hyperparameters to tune, simpler parallelism strategies. When you are training a model with hundreds of billions of parameters across thousands of GPUs, simplicity is not a luxury — it is a survival requirement.

### In-Context Learning Emerged Naturally

`01-gpt-3.md` demonstrated that sufficiently large decoder-only models could perform tasks via in-context learning — processing examples in the prompt and generating the answer, with no gradient updates. This capability emerged naturally from the autoregressive training objective: the model learned to continue patterns, and "few-shot examples followed by a query" is just another pattern to continue. Encoder-only models cannot do this (they do not generate). Encoder-decoder models can, but less naturally — the task framing is more constrained.

### Instruction Tuning and RLHF Fit Naturally

The alignment techniques that created ChatGPT — instruction tuning, RLHF, DPO (see `01-instructgpt-and-rlhf.md`, `04-direct-preference-optimization.md`) — map naturally onto decoder-only models. An instruction goes in, a response comes out, and you optimize the response quality. The unidirectional generation paradigm aligns perfectly with conversational AI. Encoder-decoder models can be instruction-tuned (Flan-T5), but the input-output separation adds friction.

### The Self-Reinforcing Ecosystem

Once GPT-3 demonstrated that decoder-only models could handle both understanding and generation, investment and infrastructure concentrated around them. More compute, more data, better tooling, more research — all focused on decoder-only architectures. This created a self-reinforcing cycle: decoder-only models got more investment because they were better, and they got better because they got more investment.

## The Nuanced Reality

### BERT's 2018-2020 Dominance Was Real

From 2018 to 2020, encoder-only models dominated NLU. BERT and its variants (`01-roberta.md`, `04-deberta.md`, `05-electra.md`) were the default choice for classification, NER, QA, and virtually every understanding benchmark. BERT's bidirectional attention provided genuinely better representations than GPT-era decoders for fixed-input tasks. The shift came not because encoders got worse, but because decoder-only models got big enough to subsume encoder capabilities via prompting.

### T5 Showed Encoder-Decoder Was Competitive

`05-t5-text-to-text-framework.md` demonstrated that at equal parameter counts, encoder-decoder models slightly outperformed decoder-only models on most tasks. The bidirectional encoding of the input gave a real advantage, especially for tasks requiring deep input understanding. The Flan-T5 line showed that instruction-tuned encoder-decoder models could be remarkably capable. The architecture did not lose on quality — it lost on scaling convenience and ecosystem momentum.

### The Encoder Revival

In 2024, `06-modernbert-and-the-encoder-revival.md` challenged the "encoders are dead" narrative. ModernBERT, trained with modern techniques (RoPE, Flash Attention, GeGLU activations) on 2 trillion tokens, outperformed all existing encoders and demonstrated that for retrieval, classification, and embedding tasks, encoders remain more efficient than decoder-only models. A 395M encoder can match or exceed what a 7B decoder does for these tasks.

NomicBERT, GTE-en-MLM, and other 2024 encoders reinforced this trend: encoders are not obsolete; they were under-invested. The right architectural choice depends on the use case.

## Key Technical Details

- **Encoder-only**: BERT (110M/340M, 2018), RoBERTa (125M/355M, 2019), DeBERTa (390M-1.5B, 2020), ModernBERT (149M/395M, 2024)
- **Decoder-only**: GPT-1 (117M, 2018), GPT-2 (1.5B, 2019), GPT-3 (175B, 2020), PaLM (540B, 2022), LLaMA 3 (8B-405B, 2024)
- **Encoder-decoder**: T5 (60M-11B, 2019), BART (140M/400M, 2019), Flan-T5 (80M-11B, 2022), UL2 (20B, 2022)
- **Scaling trajectory**: Largest encoder ~1.5B (DeBERTa-xxlarge); largest encoder-decoder ~20B (UL2); largest decoder-only ~1.8T (GPT-4, estimated)
- **Crossover point**: ~2020-2021, when GPT-3 demonstrated that decoder-only could handle NLU via prompting
- **Efficiency gap**: For embedding/retrieval tasks, a 395M encoder can match a 7B decoder (ModernBERT, 2024)

## Common Misconceptions

- **"Decoder-only is objectively the best architecture."** Decoder-only dominates the frontier because it scales well, attracts investment, and supports generation. But for embedding, retrieval, and classification, encoders are more parameter-efficient. For translation and structured generation, encoder-decoder models have real advantages. The best architecture depends on the task.

- **"Encoder-only models are obsolete."** Encoder models power the majority of production search, classification, and embedding systems. BERT-based models handle billions of queries daily in Google Search. `06-modernbert-and-the-encoder-revival.md` showed that modernized encoders remain state-of-the-art for their target tasks.

- **"Encoder-decoder is just encoder + decoder stapled together."** The cross-attention mechanism — where the decoder attends to encoder representations — is the critical component that differentiates encoder-decoder from simply running an encoder then a decoder. This architectural feature allows the decoder to dynamically consult different parts of the encoded input at each generation step.

- **"GPT-3 made encoders unnecessary."** GPT-3 showed that a sufficiently large decoder could perform NLU tasks via prompting. But "can do" is not "should do." Running a 175B-parameter decoder for binary classification is orders of magnitude more expensive than running a 355M-parameter encoder. The economics favor the right architecture for the right task.

## Connections to Other Concepts

- The original Transformer was encoder-decoder (`01-attention-is-all-you-need.md`)
- BERT established the encoder-only paradigm (`03-bert.md`); GPT-1 established decoder-only (`02-gpt-1.md`)
- T5 made the strongest case for encoder-decoder (`05-t5-text-to-text-framework.md`)
- GPT-3 was the inflection point for decoder-only dominance (`01-gpt-3.md`)
- ModernBERT revived the encoder case (`06-modernbert-and-the-encoder-revival.md`)
- The BERT ecosystem shows the peak of encoder-only research: `01-roberta.md`, `04-deberta.md`, `05-electra.md`, `02-albert.md`, `03-distilbert.md`
- For the attention mechanisms underlying all three paradigms, see `01-attention-mechanism-evolution.md`

## Further Reading

- Vaswani et al., "Attention Is All You Need" (2017, arXiv:1706.03762) — the original encoder-decoder Transformer
- Devlin et al., "BERT: Pre-training of Deep Bidirectional Transformers" (2018, arXiv:1810.04805) — encoder-only pioneer
- Radford et al., "Improving Language Understanding by Generative Pre-Training" (2018, OpenAI) — decoder-only pioneer
- Raffel et al., "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer" (2019, arXiv:1910.10683) — systematic architecture comparison
- Lewis et al., "BART: Denoising Sequence-to-Sequence Pre-training" (2019, arXiv:1910.13461) — encoder-decoder denoising approach
- Warner et al., "Smarter, Better, Faster, Longer: A Modern Bidirectional Encoder for Fast, Memory Efficient, and Long Context Finetuning and Inference" (2024, arXiv:2412.13663) — the encoder revival argument
