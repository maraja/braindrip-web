# Chinchilla and Compute-Optimal Training

**One-Line Summary**: DeepMind's Chinchilla paper overturned the prevailing wisdom on model scaling, proving that a 70B model trained on 1.4 trillion tokens could beat models 2-8x its size by simply using more training data.

**Prerequisites**: `02-kaplan-scaling-laws.md`, `01-gpt-3.md`

## What Is Chinchilla?

Imagine two chefs preparing for a cooking competition. The first buys the most expensive, largest oven available — but only stocks it with half the ingredients the recipe calls for. The second buys a more modest oven but follows the recipe exactly, using every ingredient in the right proportion. The second chef wins. Chinchilla was the second chef: a smaller model that beat its oversized rivals because it was trained with the right amount of data.

Published in March 2022 by Jordan Hoffmann and colleagues at DeepMind, "Training Compute-Optimal Large Language Models" was a direct challenge to the scaling philosophy that had dominated since Kaplan's 2020 scaling laws. Kaplan had argued that under a fixed compute budget, you should prioritize model size — build the biggest model possible and don't worry too much about training data. This prescription led to GPT-3 (175B params, ~300B tokens) and Gopher (280B params, ~300B tokens), both of which had far more parameters than training tokens.

Hoffmann's team ran over 400 training experiments, varying model size from 70M to 16B parameters and training data from 5B to 500B tokens, to derive a revised scaling law. Their conclusion was stark: for compute-optimal training, model size and training tokens should scale in roughly equal proportion. By this measure, GPT-3, Gopher, and virtually every other large model in existence were massively undertrained. They then proved their point by training Chinchilla — a 70B parameter model on 1.4 trillion tokens — using the same compute budget as Gopher (280B). Chinchilla outperformed Gopher on nearly every benchmark.

## How It Works

```
  Chinchilla: The Compute-Optimal Correction

  Kaplan Prescription:        Chinchilla Correction:
  "Make the model as big      "Scale model AND data
   as possible"                equally"

  GPT-3:     175B params ×  300B tokens = undertrained!
  Gopher:    280B params ×  300B tokens = undertrained!
  Chinchilla: 70B params × 1.4T tokens = compute-optimal ✓

  Same Compute Budget, Different Results:
  ┌────────────────────┐     ┌────────────────────┐
  │  Gopher (280B)     │     │  Chinchilla (70B)   │
  │  300B tokens       │     │  1.4T tokens        │
  │                    │     │                     │
  │  MMLU: 60.0%       │     │  MMLU: 67.6%  (+7.6)│
  │  4x inference cost │     │  1x inference cost  │
  └────────────────────┘     └────────────────────┘
         SAME compute budget ──▶ Smaller model wins!

  The Optimal Ratio:
  ┌─────────────────────────────────────────────┐
  │  ~20 training tokens per parameter          │
  │                                             │
  │  Model Size    Optimal Tokens               │
  │  ──────────    ──────────────                │
  │  7B            140B                          │
  │  70B           1.4T                          │
  │  175B          3.5T (GPT-3 used only 300B!) │
  │  1T            20T  (more than exists!)      │
  └─────────────────────────────────────────────┘
```
*Figure: Chinchilla demonstrated that GPT-3 and Gopher were massively undertrained. A 70B model trained on 1.4T tokens outperformed a 280B model trained on 300B tokens using the same compute, establishing the ~20:1 token-to-parameter ratio.*

### The Experimental Design

The DeepMind team used three complementary approaches to determine the optimal allocation of compute between model size and training data:

1. **Approach 1**: Fix several compute budgets, train models of varying sizes for each budget, and find the model size that minimizes loss for each budget level. This produced an IsoFLOP curve showing the optimal model size for each compute level.
2. **Approach 2**: Fix model sizes and vary the number of training tokens, fitting a parametric loss function L(N, D) to the results.
3. **Approach 3**: Directly fit the parameters of the loss function to all experimental runs simultaneously.

All three approaches converged on the same conclusion: the compute-optimal ratio is approximately 20 training tokens per parameter. For a 70B model, that means 1.4 trillion tokens. For GPT-3's 175B parameters, it would have meant 3.5 trillion tokens — over 10x what OpenAI actually used.

### Chinchilla vs. the Giants

Chinchilla (70B parameters, 1.4T tokens) was trained using the same compute budget as Gopher (280B parameters, 300B tokens). The results were decisive:

- **MMLU**: Chinchilla scored 67.6% vs. Gopher's 60.0% — a 7.6 percentage point improvement
- **Reading comprehension**: Improvements across RACE, LAMBADA, and other benchmarks
- **BIG-bench**: Chinchilla outperformed on the majority of tasks
- **Math**: Significant gains on mathematical reasoning benchmarks

It also outperformed GPT-3 (175B), Jurassic-1 (178B), and Megatron-Turing NLG (530B) on most evaluations, despite being 2.5x to 7.5x smaller in parameter count.

### The Revised Scaling Law

Where Kaplan had found that model size should scale faster than data, Hoffmann found approximately equal scaling. Specifically, if compute budget increases by a factor of k, both model size and training tokens should increase by approximately k^0.5. This can be expressed as: for a compute-optimal model, N_opt is proportional to C^0.5 and D_opt is proportional to C^0.5, where C is total compute.

### Implications for Inference Cost

A critical practical consequence: compute-optimal models are not just better at training time — they are cheaper at inference time. A 70B model that outperforms a 280B model requires 4x less memory, 4x fewer GPUs to serve, and generates tokens 4x faster. When you multiply this by billions of API calls, the economic advantage is enormous. Chinchilla's insight aligned training efficiency with deployment economics.

## Why It Matters

### The End of the "Biggest Model Wins" Era

Before Chinchilla, the competitive landscape was defined by parameter counts. Labs raced to train the biggest model: GPT-3 at 175B, Gopher at 280B, Megatron-Turing NLG at 530B, PaLM at 540B. Chinchilla broke this arms race by showing that a well-trained smaller model could dominate. The conversation shifted from "how many parameters?" to "how much data, and how well was it used?" This was a paradigm shift that influenced every major model designed after March 2022.

### Direct Influence on LLaMA

Meta's LLaMA models (February 2023) were explicitly designed using the Chinchilla insight — but taken even further. LLaMA-7B was trained on 1 trillion tokens, roughly 5x the Chinchilla-optimal amount for a 7B model. The reasoning: if you plan to serve a model at inference time, you want the smallest model that achieves your target performance, so it is worth "overtrain" relative to Chinchilla-optimal to push smaller models to their maximum capability. LLaMA-13B outperformed GPT-3 175B precisely because of this philosophy. Chinchilla opened the door; LLaMA walked through it.

### Reframing the Data Problem

Chinchilla implied that the biggest bottleneck for scaling was not compute or model size — it was training data. A Chinchilla-optimal 1 trillion parameter model would require approximately 20 trillion tokens of training text. High-quality English text on the internet is estimated at only a few trillion tokens. This realization accelerated research into synthetic data generation, multilingual training, multimodal data sources, and data quality filtering — all of which became defining themes of 2023-2024 AI development.

## Key Technical Details

- **Published**: March 2022, by Jordan Hoffmann et al. at DeepMind
- **Experiments**: Over 400 training runs, model sizes from 70M to 16B
- **Chinchilla model**: 70B parameters, 1.4T training tokens
- **Comparison model**: Gopher at 280B parameters, ~300B tokens (same compute budget)
- **MMLU improvement**: 67.6% (Chinchilla) vs. 60.0% (Gopher)
- **Optimal ratio**: ~20 training tokens per parameter
- **Key revision**: Model size and data should scale equally (not model-first as Kaplan suggested)
- **Inference advantage**: 4x smaller model means 4x cheaper to serve

## Common Misconceptions

- **"Chinchilla proved bigger models are worse."** Chinchilla proved that undertrained big models are worse than well-trained smaller ones. A 280B model trained on 5.6T tokens (Chinchilla-optimal) would outperform 70B Chinchilla — but no one had that much quality data or compute at the time.

- **"The 20:1 token-to-parameter ratio is a hard rule."** It is an empirical finding for a specific compute-cost model. If inference costs dominate (as they do for widely deployed models), you may want to overtrain a smaller model, as LLaMA demonstrated. The optimal ratio depends on your deployment economics.

- **"Chinchilla solved the scaling question."** Subsequent work (Muennighoff et al., 2023) showed that data can be repeated with diminishing but positive returns, and that the optimal ratio depends on data quality. The Chinchilla ratio is a useful guideline, not a universal law.

- **"All models before Chinchilla were poorly designed."** They were designed under a different, reasonable interpretation of the evidence available at the time. Science progresses by revising previous conclusions.

## Connections to Other Concepts

- `02-kaplan-scaling-laws.md` — Chinchilla directly revised Kaplan's compute-optimal allocation
- `01-gpt-3.md` — One of the "undertrained" models Chinchilla outperformed (175B on only 300B tokens)
- `04-palm.md` — PaLM (540B, 780B tokens) was also undertrained by Chinchilla's standards
- `01-llama-1.md` — LLaMA applied and extended the Chinchilla insight, overtraining small models
- `08-the-scaling-hypothesis-debate.md` — Chinchilla added nuance: scale matters, but so does data balance
- `06-synthetic-data-for-training.md` — Chinchilla's data hunger accelerated synthetic data research
- `06-falcon.md` — Falcon's RefinedWeb project was partly motivated by the Chinchilla data challenge

## Further Reading

- Hoffmann et al., "Training Compute-Optimal Large Language Models" (2022) — The Chinchilla paper.
- Kaplan et al., "Scaling Laws for Neural Language Models" (2020) — The prior scaling laws that Chinchilla revised.
- Muennighoff et al., "Scaling Data-Constrained Language Models" (2023) — Extended Chinchilla to data-constrained regimes.
- Touvron et al., "LLaMA: Open and Efficient Foundation Language Models" (2023) — Applied Chinchilla insight to open models.
