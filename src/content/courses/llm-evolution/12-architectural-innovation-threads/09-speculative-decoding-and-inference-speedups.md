# Speculative Decoding and Inference Speedups

**One-Line Summary**: Speculative decoding and related inference optimization techniques overcome the autoregressive bottleneck — generating tokens one at a time — to achieve 2-10x speedups in production LLM serving without sacrificing output quality.

**Prerequisites**: `06-kv-cache-and-serving-optimization.md`, `01-attention-is-all-you-need.md`

## What Is Speculative Decoding?

Imagine an executive who reviews and signs documents. Reading and approving a correct document takes seconds; writing one from scratch takes hours. Now imagine an assistant who drafts documents for the executive to review. The assistant works quickly but makes occasional mistakes. The executive reads each draft in one pass, approves the correct parts, and fixes the errors. This pipeline is faster than the executive writing everything alone because review is inherently faster than creation.

Speculative decoding applies this insight to language model inference. The fundamental bottleneck of autoregressive generation is that each token requires a full forward pass through the model, and tokens must be generated sequentially — you cannot generate token 5 without first generating tokens 1 through 4. This makes generation latency proportional to output length, regardless of how much GPU compute is available. A 70B model generating 100 tokens requires 100 sequential forward passes, each one waiting for the previous to complete.

Speculative decoding breaks this bottleneck by separating generation (slow, sequential) from verification (fast, parallelizable). A small, fast "draft" model speculatively generates several candidate tokens. The large target model then verifies all candidates in a single parallel forward pass, accepting the correct ones and rejecting the wrong ones. Since verification of N tokens costs roughly the same as generating 1 token (thanks to parallel computation), the speedup can be substantial — typically 2-3x with mathematically identical output.

## How It Works

**Speculative Decoding -- Draft and Verify Pipeline:**

```
Standard Autoregressive              Speculative Decoding
(Sequential, Slow)                   (Draft + Verify, 2-3x Faster)

  ┌──────────┐                         ┌───────────┐
  │ 70B Model│                         │ 1B Draft  │ (fast)
  └────┬─────┘                         └─────┬─────┘
       │                                     │
  Generate t1 ──▶ t2 ──▶ t3 ──▶ t4          Speculate: t1,t2,t3,t4,t5
  (each needs full                           (5 tokens, very fast)
   forward pass)                                   │
                                              ┌────▼──────┐
  Total: 4 serial                             │ 70B Model │
  forward passes                              │ (verify   │
                                              │  all at   │
                                              │  once)    │
                                              └────┬──────┘
                                                   │
                                              Accept: t1 ✓ t2 ✓ t3 ✓ t4 ✗
                                              (reject t4, resample from 70B)

                                              Total: 1 draft pass + 1 verify
                                              Output: mathematically identical!

  Variants:
  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │ Classical   │  │ Medusa      │  │ EAGLE       │
  │ Separate    │  │ Multi-head  │  │ Feature-    │
  │ draft model │  │ self-spec   │  │ level spec  │
  │ 2-3x       │  │ 2-3x       │  │ 2.5-3.5x   │
  └─────────────┘  └─────────────┘  └─────────────┘
```

### Classical Speculative Decoding (2023)

Two groups independently published the core algorithm in 2023: Leviathan, Kalman, and Matias at Google ("Fast Inference from Transformers via Speculative Decoding") and Chen, Borgeaud, et al. at DeepMind ("Accelerating Large Language Model Decoding with Speculative Sampling").

The algorithm works as follows: (1) A small draft model (e.g., a 1B model drafting for a 70B target) autoregressively generates K candidate tokens. (2) The target model processes all K candidates plus the context in a single forward pass, computing the probability distribution at each position. (3) A rejection sampling procedure compares the draft model's probabilities with the target model's probabilities. Tokens where the draft model's choice was sufficiently likely under the target model's distribution are accepted; tokens where it was unlikely are rejected, and the target model's distribution is used to sample a replacement. (4) Generation resumes from the first rejected position.

The critical mathematical property: the output distribution is identical to what the target model would produce on its own. Speculative decoding is not an approximation — it produces exactly the same statistical output, just faster. The speedup depends on how well the draft model approximates the target model. If the draft model is highly accurate (most tokens accepted), speedup approaches K (the speculation length). If it is poor, speedup approaches 1x (no benefit, but no harm).

### Medusa: Self-Speculative Heads (2024)

Cai et al. (2024) eliminated the need for a separate draft model entirely. Medusa adds multiple lightweight prediction heads to the target model itself, each predicting a different future token position. Head 1 predicts the next token (like normal), Head 2 predicts the token after next, Head 3 predicts two tokens ahead, and so on. These heads are much smaller than the full model and can be fine-tuned efficiently.

During inference, all heads generate predictions simultaneously, producing a tree of candidate token sequences. The model verifies the tree in a single forward pass using a modified attention mask. Accepted tokens are taken from the tree; rejected positions fall back to standard autoregressive generation. Medusa achieves 2-3x speedup without requiring a separate draft model, simplifying deployment.

### EAGLE: Feature-Level Speculation (2024)

Li et al. (2024) introduced EAGLE (Extrapolation Algorithm for Greater Language-model Efficiency), which speculates at the feature level rather than the token level. Instead of a separate model predicting tokens, EAGLE trains a lightweight autoregressive module that predicts the target model's hidden states (features) for future positions. These predicted features are fed into the target model's final layers for verification.

Because features carry richer information than discrete tokens, EAGLE's predictions are more accurate, yielding higher acceptance rates. The result is 2.5-3.5x speedup — among the highest for speculative methods — with the same guarantee of identical output distribution.

### Multi-Token Prediction (MTP)

DeepSeek V3 introduced a training-time version of this idea: training the model to predict multiple next tokens simultaneously using additional prediction heads. This serves dual purposes — it improves training (the model learns richer representations by predicting further ahead) and enables self-speculative decoding at inference time (the additional heads provide draft predictions without a separate model). This integration of speculative capability into the base training represents a convergence of training and inference optimization.

### Beyond Speculation: Complementary Techniques

Speculative decoding is one of several inference speedup techniques that can be combined:

**Continuous batching** (used in vLLM and TensorRT-LLM): Rather than waiting for an entire batch to finish before starting new requests, continuous batching dynamically adds and removes requests from the active batch as individual sequences complete. This keeps GPU utilization high even when sequences have different lengths.

**Prefix caching**: When multiple requests share a common prefix (a system prompt, for example), the KV cache from that prefix can be computed once and reused across requests. For applications where the system prompt is much longer than the user query, this can reduce per-request latency by 50% or more.

**FlashDecoding**: An extension of FlashAttention optimized specifically for the decode phase (generating one token at a time with a large KV cache). FlashDecoding parallelizes across the sequence length dimension of the KV cache, achieving better GPU utilization when the batch size is small but the sequence is long.

**Quantization for inference**: Reducing weight precision from 16-bit to 8-bit, 4-bit, or even 2-bit dramatically reduces memory requirements and increases throughput. Techniques like GPTQ, AWQ, and GGUF quantization enable running large models on consumer hardware with minimal quality loss. A 70B model in 4-bit precision requires roughly 35 GB of memory — feasible on a single high-end GPU — compared to 140 GB at full precision.

## Why It Matters

### The Latency Problem

For interactive applications — chatbots, coding assistants, real-time translation — latency matters as much as quality. A model that produces perfect answers in 30 seconds is less useful than one that produces good answers in 3 seconds. Speculative decoding and related techniques make frontier models viable for latency-sensitive applications without requiring model quality compromises.

### Combined Speedups in Production

No single technique provides a 10x speedup. But combining speculative decoding (2-3x), continuous batching (2-3x for throughput), prefix caching (1.5-2x for shared-prefix workloads), and hardware-aware attention (1.5-2x) can yield 5-10x total speedup in production inference pipelines. This is the difference between an economically viable API service and a money-losing one.

### Enabling Longer Reasoning

The reasoning revolution (o1, o3, R1, Gemini Deep Think) generates thousands of internal reasoning tokens. Without inference speedups, extended reasoning would be prohibitively slow for interactive use. Speculative decoding and efficient serving are what make "thinking for 30 seconds" feel like a reasonable wait rather than an hour-long computation.

## Key Technical Details

- Speculative decoding (2023): 2-3x speedup, mathematically identical output distribution
- Draft model: typically 10-20x smaller than target model (e.g., 1B drafting for 70B)
- Medusa (2024): multi-head self-speculation, 2-3x speedup, no separate draft model
- EAGLE (2024): feature-level speculation, 2.5-3.5x speedup, highest acceptance rates
- Multi-Token Prediction (DeepSeek V3): training-integrated speculation
- Continuous batching (vLLM): dynamic batch management, ~2-3x throughput improvement
- Prefix caching: reuse KV cache for shared prefixes, 50%+ latency reduction for shared-prompt workloads
- FlashDecoding: hardware-optimized decode-phase attention
- Combined production speedup: 5-10x achievable with stacked techniques

## Common Misconceptions

- **"Speculative decoding changes the model's outputs."** Classical speculative decoding with proper rejection sampling produces statistically identical outputs to standard autoregressive generation. It is a pure speedup with no quality trade-off.

- **"You need a perfectly matched draft model."** The draft model does not need to be a smaller version of the target model. Any model that approximately matches the target's distribution works. Even a simple n-gram model can provide some speedup for predictable text.

- **"Speculative decoding helps equally for all text."** Speedup varies by content. Predictable text (boilerplate, common patterns) achieves high acceptance rates and large speedups. Creative or low-probability text achieves lower acceptance rates and smaller speedups.

- **"These techniques are only for API providers."** Local inference tools like llama.cpp and Ollama implement speculative decoding and continuous batching. The techniques benefit anyone running an LLM, from cloud API services to laptop deployments.

## Connections to Other Concepts

Speculative decoding optimizes the inference pipeline built on the KV cache mechanisms in `06-kv-cache-and-serving-optimization.md`. It complements the hardware-aware computing approaches in `03-flash-attention-and-hardware-aware-computing.md`. DeepSeek V3's multi-token prediction, covered in `02-deepseek-v3.md`, integrates speculative capability into training. The MoE architecture in `04-mixture-of-experts-evolution.md` interacts favorably with speculation — lower active compute per token makes verification cheaper. The production deployment context connects to `02-the-api-economy.md` and the open-source serving ecosystem in `04-the-open-source-ecosystem.md`.

## Further Reading

- Leviathan, Kalman & Matias, "Fast Inference from Transformers via Speculative Decoding" (2023) — the original Google paper.
- Chen, Borgeaud et al., "Accelerating Large Language Model Decoding with Speculative Sampling" (2023) — the independent DeepMind paper.
- Cai et al., "Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads" (2024) — self-speculative heads.
- Li et al., "EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty" (2024) — feature-level speculation.
- Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention" (2023) — vLLM and continuous batching.
- DeepSeek-AI, "DeepSeek-V3 Technical Report" (2024) — multi-token prediction as a training and inference technique.
