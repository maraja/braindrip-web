# State Space Models and Mamba

**One-Line Summary**: The bet that linear-time sequence models can challenge the Transformer's quadratic attention — and the selective state space mechanism that made that bet credible.

**Prerequisites**: `01-attention-mechanism-evolution.md`, `03-flash-attention-and-hardware-aware-computing.md`, `07-long-context-techniques.md`

## What Is the SSM/Mamba Thread?

Imagine two ways to watch a parade. The first is standing on a rooftop where you can see every float simultaneously, comparing any float to any other — that is the Transformer with its all-pairs attention. The second is standing on the street corner, watching each float pass in order, updating your understanding of the parade as each new float appears — that is a state space model. The rooftop gives you a perfect global view but becomes impractical as the parade gets longer. The street corner scales effortlessly — a parade of 1,000 floats takes the same effort per float as one of 100.

State Space Models (SSMs) are a class of sequence models derived from continuous-time dynamical systems. They process sequences by maintaining a hidden state that is updated linearly for each new input — crucially, without the quadratic cost of attention. The evolution from classical SSMs to the Mamba architecture represents the field's most serious attempt to find a post-Transformer sequence modeling paradigm.

The fundamental question this thread addresses is: can you achieve Transformer-level quality on language tasks without ever computing all-pairs attention? If so, the implications for very long sequences — millions or billions of tokens — would be transformative. The answer, as of 2024-2025, is "not quite for pure language modeling, but the gap is closing and hybrids look promising."

## How It Works

**Transformer vs SSM/Mamba -- Architectural Comparison:**

```
Transformer (Attention)              Mamba (Selective SSM)
═══════════════════════              ═════════════════════

  Every token attends to              Hidden state updated
  every other token:                  linearly per token:

  t1  t2  t3  t4  t5                 t1 ──▶ t2 ──▶ t3 ──▶ t4 ──▶ t5
  ↕   ↕   ↕   ↕   ↕                      │       │       │       │
  ┌─────────────────┐                     ▼       ▼       ▼       ▼
  │ Full N×N        │                ┌────────────────────────────────┐
  │ Attention Matrix│                │  State: x_k = A*x_{k-1} + B*u │
  │ (all pairs)     │                │  (selective: A,B depend on     │
  └─────────────────┘                │   input content in Mamba)      │
                                     └────────────────────────────────┘

  Compute: O(N^2)                     Compute: O(N)
  Memory:  O(N^2) or O(N) w/ Flash   Memory:  O(1) per token (fixed state)
  KV Cache: grows with N              No KV Cache needed

  Hybrid Approach (Jamba, 2024):
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ Mamba    │ │ Mamba    │ │Attention │ │ Mamba    │  ...
  │ Layer    │ │ Layer    │ │ Layer    │ │ Layer    │
  └──────────┘ └──────────┘ └──────────┘ └──────────┘
  Efficient sequential      Global info    Efficient
  processing                mixing         processing
```

### Classical State Space Models — S4 (2021)

Albert Gu et al. introduced the Structured State Space Sequence Model (S4) in late 2021. S4 is based on the continuous-time state space equation: x'(t) = Ax(t) + Bu(t), y(t) = Cx(t) + Du(t), where A, B, C, D are learned matrices, x is the hidden state, u is the input, and y is the output. Discretized for sequence processing, this becomes x_k = A_bar * x_{k-1} + B_bar * u_k, which is a linear recurrence that can be computed in O(N) time. The breakthrough in S4 was the HiPPO (High-order Polynomial Projection Operator) initialization of A, which lets the hidden state efficiently remember long-range dependencies. S4 achieved state-of-the-art on the Long Range Arena benchmark, a suite designed to test long-range modeling (sequence lengths up to 16K). On the Path-X task (16K-length sequences), S4 achieved 88% accuracy where Transformers struggled below 60%.

### The Selectivity Problem — Why S4 Was Not Enough

Despite its strengths on long-range tasks, S4 had a fundamental limitation: the state transition matrices A and B were input-independent. Every token was processed through the same dynamics, regardless of content. This meant S4 could not perform content-based reasoning — it could not, for example, decide to "pay more attention" to a particular word based on what that word was. Transformers excel at this through their query-key mechanism. Several extensions (H3, Hyena, RWKV) tried to add input-dependence to linear recurrent models with mixed success, but none achieved Transformer parity on standard language benchmarks.

### Mamba — Selective State Spaces (December 2023)

Gu and Dao (now together) introduced Mamba, which solved the selectivity problem elegantly. In Mamba, the B, C, and delta (discretization step) parameters are functions of the input — they change at every time step based on what the model is processing. This "selective" mechanism means the model can decide, for each token, how much to update its state and what to retain. The cost of this input dependence is that the efficient convolutional mode of S4 no longer works (convolution requires time-invariant kernels). Mamba compensates with a hardware-aware implementation: a custom CUDA kernel that keeps the expanded state in SRAM, avoids materializing it in HBM, and processes the selective scan in a single fused operation. The result: Mamba-3B matched Transformer-3B quality on language modeling while achieving 5x higher throughput at inference time. On generation tasks, the advantage was even larger because Mamba's inference cost scales as O(1) per token (constant state size) rather than O(N) (growing KV cache).

### Mamba-2 — Unifying Transformers and SSMs (2024)

Dao and Gu published Mamba-2, which revealed a deep mathematical connection: the selective state space mechanism can be expressed as a structured form of attention with specific masking and decomposition properties. This "state space duality" (SSD) framework showed that Transformers and SSMs are not fundamentally different architectures but different points on a spectrum. Mamba-2 used this insight to design a more efficient implementation that leverages matrix multiplication hardware (tensor cores) more effectively than Mamba-1. The result was 2-8x faster training than Mamba-1 while maintaining quality.

### Hybrid Architectures — The Pragmatic Path (2024-2025)

Rather than replacing Transformers entirely, hybrids emerged as the practical direction. AI21's Jamba (March 2024) interleaved Transformer attention layers with Mamba layers in a 52B-parameter MoE model. The design: Mamba layers handle the efficient sequential processing for most of the network, while attention layers at strategic intervals provide the global information mixing that pure SSMs sometimes miss. Jamba fit a 256K-token context in a single 80 GB GPU — far beyond what a pure Transformer of similar quality could achieve. NVIDIA's Hymba (2024) and Zamba (Zyphra, 2024) explored similar hybrid designs. The emerging consensus: attention for global reasoning, SSMs for efficient sequence processing, combined in the same model.

## Why It Matters

### Linear-Time Inference

Mamba's O(1) per-token generation cost (constant state, no growing KV cache) is fundamentally different from the Transformer's O(N) per-token cost (KV cache grows with context). For very long sequences — 1M+ tokens — this difference becomes decisive. A Transformer serving 1M-token context needs enormous KV cache memory; Mamba needs only its fixed-size state.

### Challenging Architectural Monopoly

The Transformer has been the sole architecture for language since 2018. Mamba demonstrated that alternatives are viable, spurring a wave of research into non-Transformer architectures (RWKV, RetNet, Griffin, xLSTM). Even if Transformers remain dominant, this competition drives innovation.

### The Hybrid Future

The Mamba-2 duality result suggests that the future is not "Transformers vs SSMs" but a unified framework where models choose attention-like or SSM-like processing per layer or per task. This could yield architectures that are both more capable and more efficient than either pure approach.

## Key Technical Details

- S4 (Gu et al., late 2021): Structured state spaces. O(N) time, O(N) memory. State-of-the-art on Long Range Arena (88% on Path-X vs <60% for Transformers).
- Mamba (Gu & Dao, Dec 2023): Selective SSM with input-dependent parameters. Mamba-3B matches Transformer-3B. 5x throughput at inference.
- Mamba inference: O(1) per token (fixed state size, typically 16-64 per channel). No KV cache needed.
- Mamba-2 (Dao & Gu, 2024): State space duality framework. 2-8x faster training than Mamba-1. Tensor core friendly.
- Jamba (AI21, March 2024): Hybrid Transformer+Mamba MoE. 52B parameters. 256K context in a single 80 GB GPU.
- State size: Mamba uses hidden state of dimension d_model x d_state (typically d_state = 16). Total state per layer: ~16x smaller than KV cache.
- Limitation: Pure Mamba still lags Transformers by 1-2% on standard language benchmarks (MMLU, HumanEval). Hybrids close this gap.
- Throughput: Mamba-3B generates tokens at ~5x the rate of same-size Transformer on A100, with the gap widening at longer sequences.

## Common Misconceptions

- **"Mamba replaces Transformers."** As of 2025, pure Mamba models have not matched Transformer quality on standard language benchmarks at scale. Hybrids are the practical path. The Transformer is not dead.

- **"SSMs cannot do in-context learning."** Mamba demonstrates meaningful in-context learning (following instructions, few-shot examples). The selective mechanism provides content-based gating that enables this. However, some retrieval-heavy tasks still favor attention.

- **"Linear-time means SSMs are always faster."** For short sequences (under ~2K tokens), Transformers with FlashAttention are often faster due to better hardware utilization. Mamba's advantage emerges at longer sequences where the quadratic cost of attention dominates.

- **"Mamba-2 proved SSMs and Transformers are the same thing."** The duality is mathematical — it shows they can be expressed in a common framework. But the computational properties (linear vs quadratic), memory requirements, and hardware efficiency remain different.

## Connections to Other Concepts

`01-attention-mechanism-evolution.md` and `03-flash-attention-and-hardware-aware-computing.md` represent the Transformer side of the efficiency story — making attention cheaper. Mamba represents the alternative: avoiding attention entirely. `07-long-context-techniques.md` is where SSMs have the clearest advantage — linear scaling with sequence length. `06-kv-cache-and-serving-optimization.md` describes the problem Mamba sidesteps entirely (no KV cache). `04-mixture-of-experts-evolution.md` connects through Jamba, which combines MoE with the Mamba/Transformer hybrid.

## Further Reading

- Gu et al., "Efficiently Modeling Long Sequences with Structured State Spaces" (2021) — the S4 paper.
- Gu and Dao, "Mamba: Linear-Time Sequence Modeling with Selective State Spaces" (2023) — the Mamba paper.
- Dao and Gu, "Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality" (2024) — Mamba-2 and the SSD framework.
- Lieber et al., "Jamba: A Hybrid Transformer-Mamba Language Model" (2024) — the first major hybrid model.
- Poli et al., "Hyena Hierarchy: Towards Larger Convolutional Language Models" (2023) — another approach to sub-quadratic attention alternatives.
