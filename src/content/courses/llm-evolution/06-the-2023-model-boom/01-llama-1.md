# LLaMA 1

**One-Line Summary**: Meta AI's LLaMA proved that smaller models trained on more data could outperform much larger ones, and its leaked weights ignited the open-source AI movement.

**Prerequisites**: `01-gpt-3.md`, `03-chinchilla-and-compute-optimal-training.md`

## What Is LLaMA?

Imagine two students preparing for an exam. One skims through a thousand textbooks in a weekend. The other carefully reads two hundred books, taking notes, re-reading difficult passages, and connecting ideas across chapters. The second student — slower to prepare but more thorough — scores higher on the test. That is what LLaMA demonstrated: you do not need the biggest model if you train it on enough data for long enough.

LLaMA (Large Language Model Meta AI) was released by Hugo Touvron and colleagues at Meta AI in February 2023. It was a direct response to the Chinchilla scaling laws published by DeepMind in 2022, which had shown that most large language models — including GPT-3 — were dramatically undertrained relative to their size. Rather than pushing parameter counts ever higher, the LLaMA team asked a different question: how good can smaller models get if you train them for much longer on much more data?

The answer shocked the field. LLaMA-13B, with 13 billion parameters, outperformed GPT-3's 175 billion parameters on most benchmarks. The implication was profound: the AI community had been scaling the wrong axis. Compute was better spent on training smaller models longer than on inflating parameter counts.

But LLaMA's greatest impact was not its benchmark scores — it was what happened when its weights leaked online within a week of release, sparking an open-source revolution that Meta never intended.

## How It Works

### Architecture and Design Choices

LLaMA uses a standard decoder-only Transformer architecture with several modern refinements. It employs pre-normalization using RMSNorm (from Zhang and Sennrich, 2019) applied before each sub-layer rather than after, improving training stability.

The feedforward layers use the SwiGLU activation function (Shazeer, 2020) instead of the standard ReLU, with a hidden dimension of 2/3 of 4d rather than the typical 4d to maintain a comparable parameter count. Rotary Positional Embeddings (RoPE) replace learned absolute positional encodings, enabling better generalization to different sequence lengths.

These were not novel inventions but careful selections from the best available techniques. The LLaMA team's contribution was assembling them into a coherent, well-tuned recipe and validating the combination at multiple scales.

### Chinchilla-Optimal Training

**LLaMA's compute-optimal training strategy vs. GPT-3:**

```
GPT-3 Approach:                    LLaMA Approach:
┌─────────────────────┐            ┌─────────────────────┐
│  175B Parameters    │            │  13B Parameters     │
│  300B Tokens        │            │  1T Tokens          │
│                     │            │                     │
│  Many params,       │            │  Fewer params,      │
│  little data        │            │  much more data     │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░  │            │  ▓▓░░░░░░░░░░░░░░  │ <- Parameters
│  ▓▓░░░░░░░░░░░░░░  │            │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░  │ <- Training Data
└─────────────────────┘            └─────────────────────┘
  Result: MMLU 43.9%                Result: MMLU 56.9%
  (13B model BEATS 175B)
```

The key strategic decision was to follow Chinchilla's insight: train smaller models on significantly more tokens. The LLaMA-7B model was trained on approximately 1 trillion tokens, while the 13B, 33B, and 65B variants were trained on 1.0 to 1.4 trillion tokens.

By comparison, GPT-3 (175B parameters) was trained on only 300 billion tokens, and Chinchilla (70B) on 1.4 trillion. LLaMA proved that the compute-optimal approach extended to smaller model sizes, achieving far better performance per parameter than any prior model.

The training curves in the LLaMA paper were striking: even after 1 trillion tokens, the loss was still decreasing. The models were not overtrained — they could have continued improving with even more data, suggesting that the community was still underestimating the data requirements for smaller models.

### Training Data: Publicly Available Only

A critical design choice was to train exclusively on publicly available datasets. The training corpus comprised:

- English CommonCrawl (67%)
- C4 (15%)
- GitHub (4.5%)
- Wikipedia (4.5%)
- Books — Gutenberg and Books3 (4.5%)
- ArXiv (2.5%)
- StackExchange (2%)

All data was open or publicly scraped. This was deliberate — Touvron et al. wanted to demonstrate that competitive models could be built without proprietary or licensed data, making LLaMA's recipe fully reproducible by anyone with sufficient compute.

The CommonCrawl data underwent extensive preprocessing: language filtering with CCNet, deduplication at the line level, and quality filtering using a linear classifier trained to distinguish Wikipedia content from random web text.

### The Four-Model Family

LLaMA was released as four sizes: 7B, 13B, 33B, and 65B parameters. This family design was essential for studying scaling behavior.

The 7B model was small enough to run on a single GPU, making it accessible for academic researchers. The 13B was the "value" model — outperforming GPT-3 while being runnable on modest hardware. The 33B hit a sweet spot for serious applications. The 65B model was Meta's flagship, competitive with Chinchilla-70B and PaLM-540B on several benchmarks despite being far smaller than PaLM.

Each size filled a distinct niche in the emerging open-source ecosystem, and the 7B model would become the single most fine-tuned base model in AI history.

## Why It Matters

### Proving Chinchilla-Optimal Scaling at Every Size

LLaMA was the definitive validation of compute-optimal training. LLaMA-13B outperforming GPT-3 (175B) on most benchmarks was a headline result: a model 13x smaller beating one of the most famous AI systems in the world.

LLaMA-65B was competitive with Chinchilla-70B and PaLM-540B despite having far fewer parameters than PaLM. This proved that the community had been dramatically overparameterizing models and that the relationship between model size and model quality was far more nuanced than "bigger is better."

### The Leak That Changed Everything

LLaMA was released under a non-commercial research license with a gated access process. Within a week, the weights were leaked on 4chan and subsequently distributed widely via BitTorrent and Hugging Face. Meta could not contain the spread.

This leak — arguably accidental, though some speculate it was quietly tolerated — was the most consequential event in open-source AI. Within months, LLaMA became the foundation for Alpaca, Vicuna, Koala, GPT4All, WizardLM, and dozens of other fine-tuned models. An entire ecosystem crystallized around leaked weights.

The speed of derivative development was unprecedented. Stanford's Alpaca appeared within two weeks. Vicuna followed days later. By May 2023, the Hugging Face model hub hosted thousands of LLaMA-based models covering every language, domain, and use case imaginable.

### Democratizing AI Research

Before LLaMA, serious language model research required either corporate backing (OpenAI, Google, Microsoft) or massive academic grants. LLaMA-7B could run on a single consumer GPU with quantization.

Suddenly, graduate students, independent researchers, and hobbyists could experiment with frontier-class language models on hardware they already owned. This shifted the center of gravity in AI research from a handful of labs to a global, distributed community. Papers using LLaMA as a base model flooded arxiv within months.

## Key Technical Details

- **Parameters**: 7B, 13B, 33B, 65B (four-model family)
- **Training tokens**: 1.0T (7B/13B) to 1.4T (33B/65B)
- **Training data**: Publicly available only (CommonCrawl, C4, GitHub, Wikipedia, Books, ArXiv, StackExchange)
- **Architecture**: Decoder-only Transformer with RMSNorm, SwiGLU, RoPE
- **Context window**: 2,048 tokens
- **LLaMA-13B MMLU**: 56.9% (5-shot) vs. GPT-3 175B at 43.9%
- **LLaMA-65B MMLU**: 63.4% (5-shot), competitive with Chinchilla-70B (67.5%)
- **Training compute**: 2,048 A100 GPUs for 65B model (~21 days for 1.4T tokens)
- **Estimated training cost**: ~$2-5M for the 65B model
- **Released**: February 24, 2023 (paper and gated access); weights leaked within ~1 week
- **License**: Non-commercial research license (effectively moot after leak)

## Common Misconceptions

- **"Meta intentionally open-sourced LLaMA."** The original LLaMA 1 was released under a restrictive non-commercial license with gated access. The weights were leaked without authorization. Meta's later open releases (LLaMA 2 and beyond) were deliberate strategy shifts that came after.

- **"LLaMA invented Chinchilla-optimal training."** The Chinchilla scaling laws came from DeepMind's Hoffmann et al. in 2022. LLaMA's contribution was applying those laws to build a practical family of models and demonstrating the approach worked at multiple scales.

- **"LLaMA was the first open language model."** BLOOM (176B), OPT-175B, GPT-NeoX-20B, and others preceded it. LLaMA's distinction was its combination of small size, high quality, and the timing of the open-source AI movement.

- **"Smaller always means worse."** LLaMA-13B beat GPT-3 175B specifically because it was trained on far more data relative to its size. Model quality depends on the interaction of parameters, data, and compute — not parameters alone.

## Connections to Other Concepts

- `01-gpt-3.md` — LLaMA-13B outperformed GPT-3 175B, proving compute-optimal training matters more than raw scale
- `03-chinchilla-and-compute-optimal-training.md` — LLaMA was the practical embodiment of Chinchilla's scaling laws
- `02-the-alpaca-effect.md` — The fine-tuning explosion that followed the LLaMA leak
- `03-llama-2.md` — Meta's follow-up with commercial licensing and RLHF alignment
- `05-lora-and-fine-tuning-democratization.md` — LoRA enabled community fine-tuning of LLaMA on consumer hardware
- `04-mistral-7b.md` — Mistral built on LLaMA's proof that small, well-trained models could be powerful

## Further Reading

- Touvron et al., "LLaMA: Open and Efficient Foundation Language Models" (2023) — The original LLaMA paper.
- Hoffmann et al., "Training Compute-Optimal Large Language Models" (2022) — The Chinchilla scaling laws that informed LLaMA's design.
- Zhang and Sennrich, "Root Mean Square Layer Normalization" (2019) — RMSNorm used in LLaMA's architecture.
- Su et al., "RoFormer: Enhanced Transformer with Rotary Position Embedding" (2021) — RoPE positional encoding adopted by LLaMA.
- Shazeer, "GLU Variants Improve Transformer" (2020) — The SwiGLU activation function used in LLaMA's feedforward layers.
