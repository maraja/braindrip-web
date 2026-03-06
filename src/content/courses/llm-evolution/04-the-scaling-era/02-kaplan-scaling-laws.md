# Kaplan Scaling Laws

**One-Line Summary**: Kaplan et al. discovered that language model loss follows smooth power-law relationships with model size, dataset size, and compute, providing a quantitative roadmap for building ever-larger models.

**Prerequisites**: `04-gpt-2.md`, `01-attention-is-all-you-need.md`

## What Is the Kaplan Scaling Laws?

Imagine you are a civil engineer in the 1800s, and someone hands you a set of equations that precisely predict how tall a building can be based on the strength of your steel, the depth of your foundation, and your budget. Before these equations, architecture was part science, part guesswork. After them, you could plan with confidence. Kaplan's scaling laws did exactly this for language models: they turned the art of "how big should we build?" into a quantitative science.

Published in January 2020 by Jared Kaplan and colleagues at OpenAI, the paper "Scaling Laws for Neural Language Models" was one of the most consequential empirical studies in the history of deep learning. The team systematically trained hundreds of language models, varying size from 768 parameters to over 1.5 billion, dataset size from 22 million to 23 billion tokens, and compute budget from tiny to substantial. What they found was remarkably clean: loss decreased as a power law across all three axes, spanning over seven orders of magnitude with no sign of plateauing.

The timing was not accidental. By early 2020, the field had seen GPT, GPT-2, and various BERT models, each larger than the last, each better. But "bigger is better" was an intuition, not a law. Kaplan's work transformed it into something closer to physics — a set of empirical equations that could predict, before training, how good a model of a given size would be. This was the intellectual foundation that justified the enormous investment in GPT-3, and it shaped how every major lab thought about resource allocation for the next two years.

## How It Works

```
  Kaplan Scaling Laws: Loss Follows Power Laws

  Loss (L)
    │
    │╲
    │  ╲
    │    ╲              L(N) = (N₀/N)^0.076
    │      ╲            L(D) = (D₀/D)^0.095
    │        ╲──────    L(C) = (C₀/C)^0.050
    │               ───────────────
    │                              ─────────────
    └──────────────────────────────────────────▶
                  Model Size (N) / Data (D) / Compute (C)
                         (log scale)

  The Three Scaling Variables:
  ┌──────────────────────────────────────────────────────┐
  │  1. Model Size (N):  More params ──▶ lower loss      │
  │     α_N ≈ 0.076                                      │
  │                                                      │
  │  2. Dataset Size (D): More tokens ──▶ lower loss     │
  │     α_D ≈ 0.095                                      │
  │                                                      │
  │  3. Compute (C):      More FLOPs ──▶ lower loss      │
  │     α_C ≈ 0.050                                      │
  └──────────────────────────────────────────────────────┘

  Kaplan Prescription (later revised by Chinchilla):
  "Given fixed compute, prioritize MODEL SIZE over data."
   ──▶ Led to GPT-3: 175B params but only 300B tokens
```
*Figure: Kaplan's scaling laws showed that language model loss decreases as smooth power laws with model size, dataset size, and compute, spanning 7+ orders of magnitude. The original prescription to prioritize model size was later revised by Chinchilla.*

### The Three Power Laws

The paper identified three key scaling relationships, each following the form L(x) = (x_0 / x)^alpha, where L is the cross-entropy loss and x is the scaling variable:

1. **Model size (N)**: Loss scales as a power law with the number of non-embedding parameters. The exponent alpha_N was approximately 0.076, meaning each 10x increase in parameters yields a predictable decrease in loss.
2. **Dataset size (D)**: Loss scales as a power law with the number of training tokens, with alpha_D approximately 0.095.
3. **Compute (C)**: Loss scales as a power law with the amount of compute (measured in PF-days), with alpha_C approximately 0.050.

These relationships held across seven or more orders of magnitude — an extraordinary degree of regularity for an empirical finding in machine learning, where most results are noisy and dataset-dependent.

### The Compute-Optimal Allocation

Perhaps the most actionable finding was the prescription for how to allocate a fixed compute budget. Kaplan et al. concluded that under a fixed compute budget, you should prioritize making the model as large as possible, even if this means training on relatively fewer tokens. Specifically, they found that model size should scale faster than dataset size: if you 10x your compute, most of the benefit comes from making the model bigger, not from training longer on more data. This led to the practical recommendation that shaped GPT-3's design: train the biggest model you can afford, and don't worry too much about training it for many epochs.

### Sample Efficiency of Larger Models

A key finding was that larger models are more sample-efficient — they extract more information from each training token. A 1B parameter model achieves the same loss on 10x fewer tokens than a 100M parameter model. This meant that scaling up model size was not just about raw capability; it was also about getting more value from your data. This finding reinforced the "go big" strategy and was a major factor in the decision to train GPT-3 at 175B parameters.

### What Doesn't Matter (Much)

Surprisingly, Kaplan et al. found that many architectural details had minimal impact on the scaling curves. Model shape (depth vs. width ratio), learning rate schedule details, and other hyperparameters shifted the curves slightly but did not change the fundamental power-law behavior. This suggested that scaling was a more reliable lever than architectural innovation — a finding that was both liberating (you can use simple architectures) and somewhat dispiriting (clever tricks don't compound the way scale does).

## Why It Matters

### The Blueprint for the Scaling Era

Kaplan's laws provided the quantitative justification for the massive investments that followed. When OpenAI decided to train GPT-3 at 175B parameters and $4.6M in compute, it was not a shot in the dark — the scaling laws predicted, with reasonable accuracy, what the loss would be. When Google trained PaLM at 540B parameters, the same framework guided expectations. The laws turned AI development from exploratory research into something closer to engineering, where you could forecast returns on investment.

### The Controversy That Drove Progress

The laws were influential but not the final word. In 2022, Hoffmann et al. at DeepMind challenged Kaplan's allocation prescription in the Chinchilla paper, arguing that model size and training tokens should scale equally — not that model size should be prioritized. This disagreement was enormously productive: it led to Chinchilla's design (70B params, 1.4T tokens), which beat GPT-3 despite being smaller. The Kaplan vs. Chinchilla debate reshaped the field's understanding of compute-optimal training and influenced every major model designed after 2022.

### Predictability as a Safety Tool

One underappreciated consequence of scaling laws is their relevance to AI safety. If model capabilities are predictable from scale, then dangerous capabilities might also be predictable. Labs began using scaling laws to forecast when models might develop risky capabilities, enabling preemptive safety work. The flip side — that some capabilities appear to emerge unpredictably (see `06-emergent-abilities.md`) — made this a contested area, but the aspiration to predict capability development began with Kaplan's work.

## Key Technical Details

- **Published**: January 2020, by Jared Kaplan et al. at OpenAI
- **Models trained**: Hundreds, ranging from 768 to ~1.5B non-embedding parameters
- **Data range**: 22M to 23B tokens
- **Compute range**: Over 7 orders of magnitude
- **Loss scaling with params (alpha_N)**: ~0.076
- **Loss scaling with data (alpha_D)**: ~0.095
- **Loss scaling with compute (alpha_C)**: ~0.050
- **Key prescription**: Under fixed compute, prioritize model size over training duration
- **Larger models are ~10x more sample-efficient** per parameter decade

## Common Misconceptions

- **"The scaling laws prove bigger is always better."** The laws describe loss scaling, not task performance. A model can have lower loss but still fail on specific tasks. And Chinchilla later showed that the allocation between size and data matters enormously.

- **"Architecture doesn't matter."** Kaplan found that architectural details don't change the power-law exponents much, but this applies within the Transformer family. The Transformer architecture itself was essential — RNNs and LSTMs would not show the same scaling behavior.

- **"The power laws will hold forever."** Empirical laws describe observed ranges. There is no theoretical guarantee that the smooth power-law trends will continue at scales far beyond those tested. The potential for plateaus or phase transitions remains an open question.

- **"Kaplan's compute-optimal allocation was correct."** Chinchilla (Hoffmann et al., 2022) showed that Kaplan's prescription was suboptimal — it recommended undertrained, oversized models. The corrected prescription calls for roughly equal scaling of parameters and training tokens.

## Connections to Other Concepts

- `01-gpt-3.md` — Designed using Kaplan's "go big" prescription; 175B params on ~300B tokens
- `03-chinchilla-and-compute-optimal-training.md` — Directly challenged and revised Kaplan's allocation recommendations
- `06-emergent-abilities.md` — Raises the question of whether all capabilities follow smooth scaling laws
- `08-the-scaling-hypothesis-debate.md` — Kaplan's laws are the central empirical evidence in the scaling debate
- `04-palm.md` — Google's 540B model was another bet on the Kaplan scaling philosophy
- `07-gpt-4.md` — OpenAI used scaling laws to predict GPT-4's performance from smaller models

## Further Reading

- Kaplan et al., "Scaling Laws for Neural Language Models" (2020) — The original paper establishing the power-law relationships.
- Henighan et al., "Scaling Laws for Autoregressive Generative Modeling" (2020) — Extended scaling laws to other modalities.
- Hoffmann et al., "Training Compute-Optimal Large Language Models" (2022) — The Chinchilla paper that revised Kaplan's allocation.
- Clark et al., "Unified Scaling Laws for Routed Language Models" (2022) — Extended scaling laws to MoE architectures.
