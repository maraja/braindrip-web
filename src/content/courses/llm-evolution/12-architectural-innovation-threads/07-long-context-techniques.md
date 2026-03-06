# Long-Context Techniques

**One-Line Summary**: The twenty-fold expansion of context windows from 512 tokens to 10 million — achieved through positional encoding tricks, memory-efficient attention, and the hard-won realization that nominal context length and effective context length are not the same thing.

**Prerequisites**: `02-positional-encoding-evolution.md`, `03-flash-attention-and-hardware-aware-computing.md`, `06-kv-cache-and-serving-optimization.md`

## What Is the Long-Context Thread?

Imagine trying to write a book report after reading only one page at a time, forgetting the previous page as soon as you turn to the next. That was early LLMs: BERT could see 512 tokens (roughly a paragraph), GPT-3 could see 2048 (about 1.5 pages). Now imagine being able to read the entire book at once, compare any chapter to any other, and synthesize a coherent analysis. That is the promise of long-context models — and the engineering story of how we went from 512 tokens to 10 million is one of the most consequential in the field.

Long context is not just "more tokens." It enables qualitatively different applications: analyzing entire codebases, summarizing book-length documents, maintaining multi-hour conversations, processing video transcripts, and reasoning over large databases of evidence. But achieving long context required simultaneous advances in positional encoding (how models represent token position), attention efficiency (how to compute without quadratic memory explosion), serving infrastructure (how to manage memory for long sequences), and training methodology (how to teach models to actually use all that context).

The gap between nominal context length (what the model card says) and effective context length (what the model can actually use) remains one of the field's most important and under-discussed challenges.

## How It Works

**The Long-Context Stack -- Techniques That Enabled 10M Token Windows:**

```
Context Window Growth:
512 ──▶ 2K ──▶ 4K ──▶ 100K ──▶ 128K ──▶ 1M ──▶ 2M ──▶ 10M
BERT   GPT-3 GPT-3.5 Claude2 GPT-4T  Gem1.5 Gem1.5  Llama4
2018   2020   2023   2023    2023    2024   2024    2025

The Full Stack Required:
┌─────────────────────────────────────────────────────────┐
│ Layer 4: Serving Infrastructure                         │
│ PagedAttention │ Continuous Batching │ KV Compression   │
├─────────────────────────────────────────────────────────┤
│ Layer 3: Memory-Efficient Attention                     │
│ FlashAttention │ Ring Attention │ Sliding Window        │
├─────────────────────────────────────────────────────────┤
│ Layer 2: Positional Encoding                            │
│ RoPE + YaRN │ NTK-Aware Scaling │ iRoPE (Llama 4)     │
├─────────────────────────────────────────────────────────┤
│ Layer 1: Training Methodology                           │
│ Curriculum (4K ──▶ 128K) │ Long-Sequence Fine-Tuning    │
└─────────────────────────────────────────────────────────┘

Effective vs Nominal Context -- "Lost in the Middle":
┌─────────────────────────────────────────────────────┐
│  Retrieval Accuracy Across Context Position         │
│                                                     │
│  ██████                              ██████         │
│  ██████       ████████████           ██████         │
│  ██████       ████████████           ██████         │
│  ██████       ████████████           ██████         │
│  Start        Middle (degraded)       End           │
│              ◄── "Lost in the Middle" ──►           │
└─────────────────────────────────────────────────────┘
```

### The Positional Encoding Barrier (2017-2022)

The first bottleneck was positional encoding. Models with learned positional embeddings (GPT-2: 1024 positions, GPT-3: 2048) had a hard ceiling: no embedding existed for positions beyond the training maximum. Sinusoidal encodings theoretically generalized but degraded rapidly. ALiBi (2021) showed that attention-based position biases could extrapolate to ~2x training length, but this was modest. The real breakthrough came with RoPE extensions in 2023: linear interpolation, NTK-aware scaling, and YaRN demonstrated that models trained at 4K tokens could be fine-tuned to function at 32K, 64K, or 128K. LLaMA 3.1 pushed the RoPE base frequency from 10,000 to 500,000 to natively support 128K context. These positional techniques are detailed in `02-positional-encoding-evolution.md`.

### Memory-Efficient Attention — Making Long Context Computable

Even with extended positional encodings, computing attention over 128K tokens requires processing a 128K x 128K attention matrix. Standard attention would need ~64 GB of memory just for this matrix in FP16. FlashAttention (2022) reduced this to O(N) memory through tiling, making long-context training feasible. Sliding window attention (Mistral, Longformer) restricts each token to attending only to a local window (e.g., 4096 tokens), reducing cost to O(N * W) where W is window size. Global+local hybrid attention (BigBird, Longformer) adds a small number of global tokens that attend everywhere. Ring Attention (2023) distributes the sequence across multiple GPUs, each computing attention over a chunk, achieving near-linear scaling with the number of devices.

### Training Strategies for Long Context

Extending a model's context requires more than architectural support — the model must be trained on long sequences. The standard approach: pre-train at moderate length (4K-8K), then do a short "continued pre-training" phase on progressively longer sequences. LLaMA 2 was pre-trained at 4K, then LLaMA 2 Long was extended to 32K through continued training. LLaMA 3 used a multi-stage approach: most training at 8K, then gradual extension to 128K in the final phase. This curriculum avoids the enormous cost of training at 128K from the start (128K-token training is roughly 32x more expensive per sample than 4K). Gemini 1.5 Pro natively trained on sequences up to 10M tokens, reportedly using interleaved long and short sequences with heavy use of sliding window and sparse attention patterns.

### The Context Window Timeline

The growth has been exponential: BERT (2018) = 512, GPT-3 (2020) = 2K, GPT-3.5 Turbo (Mar 2023) = 4K, Claude 2 (Jul 2023) = 100K, GPT-4 Turbo (Nov 2023) = 128K, Gemini 1.5 Pro (Feb 2024) = 1M, Gemini 1.5 Pro update (Jun 2024) = 2M, Llama 4 Scout (2025) = 10M. Each jump required combining multiple innovations: positional encoding extensions, memory-efficient attention, training curriculum design, and serving optimization.

### Effective vs. Nominal Context — The "Lost in the Middle" Problem

Liu et al. (2023) demonstrated a troubling finding: models with 128K context windows showed significantly degraded performance when relevant information was placed in the middle of the context, compared to the beginning or end. This "lost in the middle" effect suggested that long context was partly an illusion — models had the context window but could not fully utilize it. The "needle in a haystack" test (Kamradt, 2023) became the standard evaluation: insert a specific fact at various positions in a long document and test retrieval. Most models show near-perfect performance at the start and end but degraded performance in the middle 30-40%. Effective context is typically estimated at 60-80% of nominal context for most tasks. Recent models (GPT-4o, Claude 3.5, Gemini 1.5 Pro) have significantly improved on this, with near-uniform needle retrieval across the full context, but complex reasoning over long contexts remains harder than simple retrieval.

## Why It Matters

### Enabling New Application Categories

Long context transforms what LLMs can do. At 4K tokens, you can process a short email. At 128K, you can analyze a codebase. At 1M, you can ingest an entire book, a full legal case file, or hours of meeting transcripts. Each order-of-magnitude increase enables qualitatively different applications, not just quantitatively more of the same.

### The RAG vs. Long Context Debate

Retrieval-Augmented Generation (RAG) was the primary solution for knowledge beyond the context window: retrieve relevant chunks and insert them. Long context challenges RAG's necessity — if the entire document fits in context, why bother with imperfect retrieval? In practice, both approaches have roles: long context for documents that must be fully comprehended, RAG for vast knowledge bases that exceed even million-token windows. The interplay between these approaches is an active area of research.

### Cost Implications

Long context is expensive. Processing 128K tokens costs roughly 32x more than 4K tokens (quadratic attention scaling, even with FlashAttention). At API pricing of $0.01 per 1K input tokens, a 128K-token request costs $1.28 — viable for some applications, prohibitive for others. This creates pressure for KV cache optimization, speculative decoding, and architectural efficiency.

## Key Technical Details

- Context window timeline: 512 (BERT, 2018) → 2K (GPT-3, 2020) → 4K (GPT-3.5, 2023) → 100K (Claude 2, Jul 2023) → 128K (GPT-4 Turbo, Nov 2023) → 1M (Gemini 1.5 Pro, Feb 2024) → 2M (Gemini 1.5, Jun 2024) → 10M (Llama 4 Scout, 2025).
- Training cost: 128K-token sequences are ~32x more expensive per sample than 4K (quadratic attention, even with FlashAttention).
- Sliding window attention: Mistral 7B uses 4096-token windows. Reduces memory but limits global reasoning.
- RoPE extensions: NTK-aware scaling, YaRN enable 32x extension with minimal fine-tuning. LLaMA 3.1 uses base freq 500,000.
- Needle-in-a-haystack: Top models (GPT-4o, Claude 3.5, Gemini 1.5) achieve >95% retrieval across full context. Older models degrade 20-40% in middle positions.
- Effective context: Typically 60-80% of nominal for complex reasoning tasks. Retrieval tasks show higher utilization.
- Ring Attention (2023): Distributes attention across GPUs for sequences too long for a single device.
- KV cache at 128K: LLaMA 2 70B (MHA) would need ~300+ GB. LLaMA 3 70B (GQA-8) needs ~40 GB. DeepSeek V2 (MLA) needs <10 GB.

## Common Misconceptions

- **"A 1M-token context window means the model understands 1M tokens equally well."** Effective utilization degrades with context length. Models perform best on information at the beginning and end of the context, with weaker performance in the middle.

- **"Long context makes RAG obsolete."** For knowledge bases of billions of tokens, long context is insufficient. RAG and long context are complementary, not competing approaches.

- **"Extending context is just a matter of training on longer sequences."** Without the right positional encoding, memory-efficient attention, and serving infrastructure, training on longer sequences alone does not work. All components must evolve together.

- **"Sliding window attention is a complete solution."** Sliding windows reduce memory but prevent tokens from directly attending to distant tokens. Global tokens or hierarchical mechanisms are needed for true long-range reasoning.

## Connections to Other Concepts

`02-positional-encoding-evolution.md` covers the RoPE extensions that are the foundation of context extension. `03-flash-attention-and-hardware-aware-computing.md` provides the memory-efficient computation that makes long-context training feasible. `06-kv-cache-and-serving-optimization.md` addresses the serving-side memory crisis that long context creates. `01-attention-mechanism-evolution.md` shows how GQA and MLA reduce the per-token memory cost of long context. `05-state-space-models-and-mamba.md` offers the radical alternative: linear-time models with constant-size state, sidestepping the long-context memory problem entirely.

## Further Reading

- Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023) — the finding that changed how we evaluate long context.
- Peng et al., "YaRN: Efficient Context Window Extension of Large Language Models" (2023) — state-of-the-art RoPE extension.
- Reid et al., "Gemini 1.5: Unlocking multimodal understanding across millions of tokens of context" (2024) — the first production 1M-token model.
- Li et al., "Ring Attention with Blockwise Transformers for Near-Infinite Context" (2023) — distributed attention for very long sequences.
- Kamradt, "Needle in a Haystack" (2023) — the evaluation method that became the standard for long-context testing.
