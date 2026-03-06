# ModernBERT and the Encoder Revival

**One-Line Summary**: ModernBERT (Warner et al., 2024) applied 2024-era techniques — RoPE positional encodings, Flash Attention 2, GeGLU activations, unpadding, and training on 2 trillion tokens — to the encoder-only architecture, outperforming all existing encoders and disproving the narrative that "encoders are dead" by showing they were not obsolete but simply under-invested.

**Prerequisites**: `03-bert.md`, `01-roberta.md`

## What Is ModernBERT?

Imagine a classic car from the 1960s — beautifully designed, mechanically sound, but overshadowed by modern vehicles with fuel injection, turbocharging, and advanced electronics. Everyone assumes the classic is inferior. Then someone rebuilds the same chassis with a modern engine, modern transmission, and modern electronics — and it outperforms most cars on the road. The design was never the problem. The components were just out of date.

This is the story of ModernBERT. The encoder-only architecture pioneered by `03-bert.md` in 2018 dominated NLP for two years before the field's attention — and investment — shifted decisively toward decoder-only models like GPT-3 and beyond. By 2023, the conventional wisdom was that encoders were a dead end: interesting historically, but irrelevant to the frontier of AI. Encoder models had not been seriously updated since DeBERTa in 2020-2021. Meanwhile, decoder-only models absorbed years of architectural innovations: RoPE positional encodings, Flash Attention, modern activation functions, better training recipes, and vastly more training data.

In December 2024, Benjamin Warner, Antoine Chaffin, Benjamin Clavie, Orion Weller, Oskar Hallstrom, Said Taghadouini, Alexis Gallagher, Raja Biswas, Faisal Ladhak, Tom Aarsen, Nathan Cooper, and others published ModernBERT — an encoder model rebuilt from the ground up with every significant architectural and training innovation developed since BERT. The results challenged the "encoders are dead" narrative directly: ModernBERT outperformed every existing encoder model on classification, retrieval, and code tasks, and was competitive with or superior to decoder-only models many times its size on these specific tasks.

## How It Works

```
  ModernBERT: Classic Architecture + Modern Components

  BERT (2018)                          ModernBERT (2024)
  ┌────────────────────────┐           ┌──────────────────────────────┐
  │ Absolute Position Emb  │    ──▶    │ RoPE (Rotary Position Emb)  │
  │ (max 512 tokens)       │           │ (supports 8,192 tokens)     │
  ├────────────────────────┤           ├──────────────────────────────┤
  │ Standard Attention     │    ──▶    │ Flash Attention 2            │
  │ (O(n²) memory)         │           │ (linear memory, 2-4x faster)│
  ├────────────────────────┤           ├──────────────────────────────┤
  │ GELU activation        │    ──▶    │ GeGLU (gated activation)    │
  ├────────────────────────┤           ├──────────────────────────────┤
  │ Padded sequences       │    ──▶    │ Unpadding (no wasted compute)│
  ├────────────────────────┤           ├──────────────────────────────┤
  │ 3.3B training tokens   │    ──▶    │ 2T training tokens (600x!)  │
  │ (Books + Wikipedia)    │           │ (web + code + science)      │
  ├────────────────────────┤           ├──────────────────────────────┤
  │ 12/24 layers           │    ──▶    │ 22/28 layers (optimized)    │
  │ 110M/340M params       │           │ 149M/395M params            │
  └────────────────────────┘           └──────────────────────────────┘

  Result: Encoders were not obsolete — they were under-invested.
  A 395M encoder matches/beats 7B decoder models on retrieval tasks.
```
*Figure: ModernBERT upgrades every component of the original BERT architecture with 2024-era techniques while preserving the encoder-only design. The result outperforms all existing encoders and challenges the "encoders are dead" narrative.*

### Modern Architecture Components

ModernBERT took the basic encoder-only Transformer and upgraded every component to 2024 standards:

**Rotary Position Embeddings (RoPE)**: BERT used learned absolute position embeddings limited to 512 tokens. ModernBERT adopted RoPE from `02-positional-encoding-evolution.md`, which encodes position information through rotation of the query and key vectors. RoPE supports generalization to longer sequences, provides natural relative position awareness, and has become the standard in modern decoder-only models. ModernBERT used RoPE to support an **8,192 token context length** — 16x BERT's 512 limit.

**Flash Attention 2**: BERT used standard scaled dot-product attention, which is memory-bound and scales quadratically with sequence length. ModernBERT integrated Flash Attention 2 (`03-flash-attention-and-hardware-aware-computing.md`), a hardware-aware attention implementation that reduces memory usage from quadratic to linear and provides 2-4x speedups by optimizing GPU memory access patterns. This was critical for making the 8K context length practical.

**GeGLU Activations**: BERT's feed-forward layers used GELU activations. ModernBERT replaced these with GeGLU (Gated GELU Linear Unit), a gated activation function that provides richer non-linearity. GeGLU multiplies the GELU output with a linear gate, allowing the network to learn which information to pass through. This activation function, identified as superior in systematic studies, had become standard in decoder-only models but had never been applied to a production encoder.

**Unpadding (Variable-Length Processing)**: Standard BERT pads all sequences to the maximum length in a batch, wasting computation on padding tokens. ModernBERT implemented unpadding — removing all padding tokens and processing only real tokens, then restoring the sequence structure afterward. This is particularly impactful for batches with highly variable sequence lengths, where traditional padding can waste 30-50% of compute.

### Training at Modern Scale

The most dramatic change was the training data. BERT was trained on approximately 3.3 billion tokens. `01-roberta.md` expanded to roughly 30 billion tokens. ModernBERT was trained on **2 trillion tokens** — approximately 600x more data than BERT. The training corpus included diverse web text, code (a novel addition for encoder models), scientific text, and other sources. This scale of training had been standard for decoder-only models since 2022 but had never been applied to an encoder.

The training recipe incorporated modern best practices: a trapezoidal learning rate schedule (linear warmup, constant, linear decay), large batch sizes, and gradient accumulation. ModernBERT was trained from scratch — no weights were inherited from BERT or RoBERTa.

### Model Configurations

| Model | Layers | Hidden | Heads | Parameters | Context |
|-------|--------|--------|-------|------------|---------|
| ModernBERT-base | 22 | 768 | 12 | 149M | 8,192 |
| ModernBERT-large | 28 | 1024 | 16 | 395M | 8,192 |

Note the slightly different layer counts compared to BERT (12/24). The configurations were optimized through ablation studies, balancing parameter count against compute efficiency.

## Why It Matters

### Disproving "Encoders Are Dead"

The most significant contribution of ModernBERT was narrative, not just technical. By 2023-2024, the AI community had largely written off encoder-only models. Frontier research focused exclusively on decoder-only architectures. ModernBERT demonstrated that encoders had not failed — they had simply stopped receiving investment. When given the same architectural innovations and training scale that decoder-only models enjoyed, encoders remained state-of-the-art for their target tasks.

This finding has practical implications. Many production NLP systems — search engines, classification pipelines, embedding services, retrieval systems — use encoder models because they are more efficient than decoders for these tasks. ModernBERT showed that these systems can be dramatically improved by applying modern techniques, without switching to a fundamentally different architecture.

### The "Right Architecture for the Right Task" Argument

ModernBERT strengthened the argument that architectural choice should be task-driven, not trend-driven. For **embedding and retrieval** tasks, a 395M-parameter encoder can match or exceed what a 7B-parameter decoder achieves — at a fraction of the cost and latency. For **classification** tasks, encoders process the entire input simultaneously and produce representations without the overhead of autoregressive generation. For **code understanding** (not generation), encoders' bidirectional context provides advantages.

The counterpoint is clear: for generation, dialogue, reasoning, and general-purpose tasks, decoder-only models remain superior. The argument is not "encoders are better" but "encoders are better for specific, high-volume tasks" — and those tasks represent a massive share of production NLP workloads.

### Part of a Broader Encoder Renaissance

ModernBERT was not alone. NomicBERT (Nomic AI, 2024) applied similar modernizations to create an efficient encoder for embeddings. GTE-en-MLM (Alibaba, 2024) modernized encoders for text embedding. The JinaBERT family introduced ALiBi-based encoders with extended context. These models collectively demonstrated that the encoder revival was not a one-off result but a genuine trend — the encoder architecture had years of catching up to do, and that catching up yielded substantial gains.

## Key Technical Details

- **Paper**: Warner et al., "Smarter, Better, Faster, Longer: A Modern Bidirectional Encoder for Fast, Memory Efficient, and Long Context Finetuning and Inference" (Dec 2024, arXiv:2412.13663)
- **ModernBERT-base**: 22 layers, 768 hidden, 12 heads, 149M params, 8,192 context
- **ModernBERT-large**: 28 layers, 1024 hidden, 16 heads, 395M params, 8,192 context
- **Training data**: 2 trillion tokens (vs BERT's ~3.3B and RoBERTa's ~30B) — ~600x BERT
- **Context length**: 8,192 tokens (vs BERT's 512) — 16x increase
- **Architecture innovations**: RoPE, Flash Attention 2, GeGLU activations, unpadding, alternating local/global attention
- **Results**: State-of-the-art on GLUE, retrieval benchmarks (BEIR, MTEB subsets), and code understanding tasks
- **Efficiency**: 2x faster inference than comparably-sized encoder models due to Flash Attention + unpadding
- **Training**: From scratch on modern hardware; no inherited BERT/RoBERTa weights
- **Code training**: First major encoder explicitly trained on code data, enabling strong code understanding

## Common Misconceptions

- **"ModernBERT is just BERT with more data."** While the 600x increase in training data is the single largest improvement, the architectural changes (RoPE, Flash Attention, GeGLU, unpadding) are each individually significant. RoPE enables the 16x context extension. Flash Attention enables the long context to be computationally feasible. GeGLU improves representation quality. Unpadding reduces wasted compute. The combination is greater than the sum.

- **"ModernBERT shows encoders are better than decoders."** ModernBERT shows encoders are better than decoders for specific tasks (embedding, retrieval, classification) at specific scales (hundreds of millions of parameters). For generation, reasoning, dialogue, and general-purpose use, decoder-only models remain superior. The right framing is "right architecture for the right task."

- **"The encoder was a dead architecture that got revived."** Encoder models never stopped being used in production. Google Search still uses BERT-based models. Sentence-BERT and its descendants power most embedding systems. What changed was research investment — the frontier research community moved on, but production systems never did. ModernBERT brought research attention back to a thriving production paradigm.

- **"8K context makes encoders suitable for long-document tasks."** 8,192 tokens is a major improvement over 512 but still modest compared to decoder-only models with 128K+ context windows. For very long documents, decoder-only or encoder-decoder architectures may still be necessary. ModernBERT's 8K context is best suited for passage-level tasks, not full-document understanding.

## Connections to Other Concepts

- Modernizes the encoder-only architecture from `03-bert.md` with 6 years of innovations
- Builds on `01-roberta.md`'s insight that training methodology matters as much as architecture
- Uses RoPE from `02-positional-encoding-evolution.md` for extended context
- Uses Flash Attention from `03-flash-attention-and-hardware-aware-computing.md` for efficiency
- Uses GeGLU from the activation function improvements in `08-normalization-and-activation-evolution.md`
- Central to the architectural debate in `07-encoder-vs-decoder-vs-encoder-decoder.md`
- The encoder ecosystem it revitalizes includes `04-deberta.md`, `05-electra.md`, `02-albert.md`, `03-distilbert.md`
- For the broader context of model efficiency, see `07-the-slm-revolution.md` and `04-quantization-and-compression.md`

## Further Reading

- Warner et al., "Smarter, Better, Faster, Longer: A Modern Bidirectional Encoder for Fast, Memory Efficient, and Long Context Finetuning and Inference" (2024, arXiv:2412.13663) — the ModernBERT paper
- Nussbaum et al., "Nomic Embed: Training a Reproducible Long Context Text Embedder" (2024, arXiv:2402.01613) — NomicBERT, a parallel encoder modernization effort
- Devlin et al., "BERT: Pre-training of Deep Bidirectional Transformers" (2018, arXiv:1810.04805) — the original architecture ModernBERT modernizes
- Su et al., "RoFormer: Enhanced Transformer with Rotary Position Embedding" (2021, arXiv:2104.09864) — RoPE, the positional encoding ModernBERT adopts
- Dao et al., "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning" (2023, arXiv:2307.08691) — the attention implementation ModernBERT uses
