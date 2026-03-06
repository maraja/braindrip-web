# Normalization and Activation Evolution

**One-Line Summary**: The quiet evolution of normalization (LayerNorm to RMSNorm) and activation functions (ReLU to SwiGLU) in transformers represents the kind of incremental architectural refinement that individually yields small gains but collectively defines the "modern LLM recipe."

**Prerequisites**: `01-attention-is-all-you-need.md`

## What Are Normalization and Activation Functions?

Imagine you are mixing concrete. The normalization step is like ensuring your mix of cement, sand, and water has consistent proportions before you pour it — without this, some sections will be too wet and others too dry, and the structure will be unstable. The activation function is like the curing process that transforms the liquid mix into something structurally rigid — it introduces the nonlinearity that allows the material (or the neural network) to take on complex shapes rather than remaining a featureless slab.

In a transformer, these two operations appear in every layer, applied hundreds or thousands of times as a signal passes through the network. Normalization keeps the signal magnitudes stable so training does not diverge. Activation functions in the feed-forward network introduce the nonlinearity that gives the model its expressive power. Because they are applied at every layer, even small improvements in their efficiency or quality compound across the entire network.

The evolution of these components from 2016 to 2025 is not a story of dramatic breakthroughs but of careful empirical refinement. Each change — moving normalization before sublayers rather than after, dropping mean centering from normalization, switching from ReLU to gated activations — provided a modest improvement. Together, they account for a significant fraction of the quality and efficiency gains between early transformers and modern LLMs.

## How It Works

**The Modern LLM Recipe -- Component Evolution:**

```
Original Transformer (2017)          Modern LLM Recipe (2023+)
═══════════════════════════          ════════════════════════════

┌─────────────────────┐              ┌──────────────────────────┐
│ Post-LayerNorm      │    ──▶       │ Pre-RMSNorm              │
│ (after sublayer)    │              │ (before sublayer)        │
│ mean + variance     │              │ RMS only, no centering   │
│                     │              │ 10-50% faster            │
├─────────────────────┤              ├──────────────────────────┤
│ ReLU Activation     │    ──▶       │ SwiGLU Activation        │
│ f(x) = max(0, x)   │              │ Swish-gated linear unit  │
│ 2 FFN matrices      │              │ 3 FFN matrices           │
│ Dead neuron problem │              │ 1-3% quality gain        │
├─────────────────────┤              ├──────────────────────────┤
│ Sinusoidal / Learned│    ──▶       │ RoPE                     │
│ Positional Encoding │              │ Rotary embeddings        │
├─────────────────────┤              ├──────────────────────────┤
│ Multi-Head Attention│    ──▶       │ Grouped-Query Attention  │
│ (Full KV per head)  │              │ (Shared KV, 4-8x saving) │
└─────────────────────┘              └──────────────────────────┘

Adopted by: LLaMA, Mistral, Qwen, DeepSeek, Gemma
Each change: small gain. Together: 10-20% improvement.
```

### Normalization: From LayerNorm to RMSNorm

**LayerNorm (Ba, Kiros, & Hinton, 2016)** was the normalization method used in the original Transformer. For each token's representation, LayerNorm computes the mean and variance across all features, subtracts the mean (centering), and divides by the standard deviation (scaling). This produces a normalized representation with zero mean and unit variance, stabilizing training by preventing activations from growing or shrinking uncontrollably across layers. LayerNorm has two learned parameters per feature: a scale (gamma) and a shift (beta).

**Pre-LayerNorm (Xiong et al., 2020)** was not a change to the normalization formula but to its placement. The original Transformer applied LayerNorm after each sublayer (post-norm: sublayer output + residual, then normalize). Pre-LayerNorm moved it before each sublayer (normalize, then sublayer, then add residual). This seemingly minor change had a dramatic effect on training stability: pre-norm models could train at higher learning rates, converged faster, and were more robust to hyperparameter choices. The reason is that the residual connection in pre-norm carries an unnormalized signal, which helps gradient flow. By 2020, pre-norm became the default for most large language models.

**RMSNorm (Zhang & Sennrich, 2019)** simplified LayerNorm by removing the mean-centering step entirely. Instead of computing both mean and variance, RMSNorm only computes the root mean square (RMS) of the activations and divides by it. The hypothesis — validated empirically — was that the re-centering step contributed negligibly to model quality, while the re-scaling did the real work of stabilizing training. Removing the mean computation saves 10-50% of the normalization operation's compute, depending on implementation. RMSNorm also removes the beta (shift) parameter, further simplifying the layer. It was adopted by LLaMA, Mistral, Qwen, DeepSeek, and most modern LLMs, making it the de facto standard by 2024.

### Activation Functions: From ReLU to SwiGLU

**ReLU (Rectified Linear Unit)** was the activation function used in the original Transformer's feed-forward network (FFN). ReLU simply zeros out negative values: f(x) = max(0, x). It is computationally cheap and avoids the vanishing gradient problem of sigmoid/tanh, but it suffers from the "dead neuron" problem — neurons that output zero for all inputs during training never recover, wasting model capacity.

**GELU (Gaussian Error Linear Unit, Hendrycks & Gimpel, 2016)** provided a smooth approximation to ReLU that weights inputs by their percentile in a Gaussian distribution. Rather than a hard cutoff at zero, GELU gradually attenuates small negative values and amplifies positive values. It was adopted by BERT and GPT-2, establishing itself as the preferred activation for transformer-based models through 2022. GELU reduced the dead neuron problem and provided marginal quality improvements.

**GLU (Gated Linear Units, Dauphin et al., 2017)** introduced a different principle: gating. A GLU splits the FFN input into two halves, applies an activation to one half, and multiplies (gates) the result with the other half. This element-wise gating mechanism provides a richer nonlinearity than a single activation function. GLU variants use different base activations for the gating: ReGLU (ReLU), GEGLU (GELU), and SwiGLU (Swish).

**SwiGLU (Shazeer, 2020)** combines the Swish activation (x * sigmoid(beta * x), a smooth, self-gated function) with the GLU mechanism. Shazeer's paper systematically tested GLU variants in transformers and found that SwiGLU consistently outperformed alternatives by 1-3% on perplexity. The trade-off is that SwiGLU requires three weight matrices in the FFN instead of two (or equivalently, 50% more parameters in the FFN for the same hidden dimension). In practice, this is offset by reducing the FFN hidden dimension slightly to match the original parameter count.

SwiGLU was adopted by PaLM (2022), LLaMA (2023), Mistral, Qwen, and DeepSeek, making it the dominant FFN activation in modern LLMs.

### The Timeline of Adoption

The adoption of these innovations followed a remarkably consistent pattern. Academic papers proposing improvements were published 1-3 years before widespread adoption. RMSNorm was published in 2019 but not widely adopted until LLaMA in 2023. SwiGLU was proposed in 2020 but became standard with PaLM in 2022 and LLaMA in 2023. Pre-LayerNorm was analyzed in 2020 but had already been adopted by GPT-2 in 2019 based on empirical observation before formal analysis. The gap between "known to work" and "universally adopted" reflects the conservatism of the field — changing architectural defaults is risky when training runs cost millions of dollars.

### Interaction Effects

Normalization and activation choices do not exist in isolation. RMSNorm interacts with the choice of positional encoding (RoPE), attention mechanism (GQA/MQA), and model depth. SwiGLU's gating mechanism interacts with the model's overall capacity allocation between attention and feed-forward layers. Changing one component without adjusting others can yield suboptimal results. This interdependence is why the "modern LLM recipe" is typically adopted as a complete package rather than individual substitutions.

## Why It Matters

### The Modern LLM Recipe

The combination of Pre-RMSNorm + SwiGLU activation + RoPE positional encoding + GQA attention is often called the "modern LLM recipe" — the standard set of architectural choices that virtually every open LLM since LLaMA has adopted. None of these components individually represents a breakthrough. Together, they represent a 10-20% improvement in training efficiency and model quality over the original Transformer recipe — gains that compound when training at the trillion-token scale.

### The Compound Effect

A 1-3% improvement from SwiGLU. A 10-50% speedup in normalization from RMSNorm. Better training stability from pre-norm placement. These gains may seem modest, but at the scale of modern training (trillions of tokens, millions of GPU-hours), they translate to millions of dollars in saved compute or measurably better models at the same budget. The lesson is that architectural innovation is not only about dramatic inventions like attention or MoE — it is also about the disciplined accumulation of small improvements.

### Standardization and Its Risks

The near-universal adoption of RMSNorm + SwiGLU raises a question: has the field converged prematurely? If everyone uses the same recipe, unexplored alternatives might offer larger gains. ModernBERT (2024) demonstrated this by using GeGLU instead of SwiGLU and achieving strong results, suggesting that the space of normalization and activation choices is not fully explored.

### The Invisible Impact on Training Budgets

To appreciate why these seemingly small changes matter at scale, consider a concrete example. A 1% reduction in loss from SwiGLU, applied to a training run that costs $10M in compute, is equivalent to saving $100K-$500K in training budget (depending on how loss reduction translates to fewer required training steps). A 30% speedup in normalization computation, applied across trillions of tokens, saves days of training time on thousands of GPUs. At the scale of modern LLM training, "small" improvements have large dollar values.

### QK-Norm and Other Emerging Innovations

Beyond the established RMSNorm + SwiGLU recipe, newer normalization techniques continue to emerge. QK-Norm applies normalization to the query and key vectors in attention, which can stabilize training at very large scales where attention logits can grow large and cause numerical instability. DeepNorm (Microsoft, 2022) proposed a modified initialization scheme that allows training very deep transformers (over 1000 layers) without instability. These innovations suggest that the normalization design space still has unexplored territory.

## Key Technical Details

- LayerNorm (2016): mean-centering + variance scaling, two learned parameters (gamma, beta) per feature
- Pre-LayerNorm (2020): normalization before sublayer, dramatically improved training stability
- RMSNorm (2019): removes mean-centering, 10-50% faster, adopted by LLaMA/Mistral/Qwen/DeepSeek
- ReLU: max(0, x), original Transformer FFN activation, dead neuron problem
- GELU (2016): smooth approximation, used in BERT and GPT-2
- SwiGLU (2020): Swish-gated linear unit, 1-3% quality improvement, three FFN matrices
- GeGLU: GELU-gated variant, used in ModernBERT (2024)
- Modern LLM recipe: Pre-RMSNorm + SwiGLU + RoPE + GQA

## Common Misconceptions

- **"These are just implementation details that don't matter."** At scale, 1-3% quality improvements translate to hundreds of millions of dollars in equivalent compute savings. The choice of normalization and activation is among the most consequential architectural decisions.

- **"RMSNorm is just a faster LayerNorm."** RMSNorm is also a different normalization — it does not center activations around zero. The empirical finding that centering is unnecessary tells us something about what normalization actually does in transformers: it is primarily about scale control, not centering.

- **"SwiGLU adds parameters for free."** SwiGLU requires a third weight matrix in the FFN, increasing parameter count by ~50% in the FFN block if hidden dimensions are unchanged. In practice, the hidden dimension is reduced to keep total parameters constant, trading width for gating capability.

- **"The modern recipe is optimal."** It is the best known recipe as of 2025, but alternatives like GeGLU, DeepNorm, and QK-Norm suggest the design space is not exhausted. The convergence on a single recipe may reflect community momentum as much as true optimality.

## Connections to Other Concepts

The normalization and activation choices interact with the attention innovations in `01-attention-mechanism-evolution.md` and the positional encoding choices in `02-positional-encoding-evolution.md` to form the complete modern transformer recipe. Hardware-aware implementations of these operations are discussed in `03-flash-attention-and-hardware-aware-computing.md`. The ModernBERT application of GeGLU connects to `06-modernbert-and-the-encoder-revival.md`. The compound effect of these optimizations contributes to the training efficiency gains covered in `07-training-efficiency-breakthroughs.md`. The specific models that adopted these innovations — LLaMA, PaLM, Mistral — are documented across the model-specific files in this collection. The MoE architecture in `04-mixture-of-experts-evolution.md` applies SwiGLU and RMSNorm within each expert, meaning these choices are multiplied across all experts.

## Further Reading

- Ba, Kiros & Hinton, "Layer Normalization" (2016) — the original LayerNorm paper.
- Zhang & Sennrich, "Root Mean Square Layer Normalization" (2019) — RMSNorm simplification.
- Xiong et al., "On Layer Normalization in the Transformer Architecture" (2020) — pre-norm placement analysis.
- Hendrycks & Gimpel, "Gaussian Error Linear Units (GELUs)" (2016) — the GELU activation.
- Shazeer, "GLU Variants Improve Transformer" (2020) — systematic comparison including SwiGLU.
- Dauphin et al., "Language Modeling with Gated Convolutional Networks" (2017) — original GLU concept.
- Touvron et al., "LLaMA: Open and Efficient Foundation Language Models" (2023) — the model that popularized the RMSNorm + SwiGLU combination.
- Chowdhery et al., "PaLM: Scaling Language Modeling with Pathways" (2022) — early large-scale adoption of SwiGLU.
