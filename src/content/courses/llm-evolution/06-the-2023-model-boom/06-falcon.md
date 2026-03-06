# Falcon

**One-Line Summary**: The Technology Innovation Institute's Falcon models proved that exceptional data curation alone — without novel architectures or proprietary text — could produce world-class language models, briefly topping the Hugging Face Open LLM Leaderboard.

**Prerequisites**: `01-gpt-3.md`, `02-the-data-quality-revolution.md`

## What Is Falcon?

Imagine two chefs given the same budget. One invests in exotic ingredients and cutting-edge kitchen equipment. The other uses basic ingredients — the same vegetables and grains available at any market — but spends months developing techniques for selecting, cleaning, and preparing them. The second chef wins the competition.

Falcon was the second chef. While most labs focused on bigger models, better architectures, or proprietary training data, the Technology Innovation Institute (TII) in Abu Dhabi bet on a different thesis: that the quality of publicly available web data, if cleaned aggressively enough, could rival any curated corpus.

Falcon was developed by TII, a UAE government-backed research institution, and released in stages through 2023. Falcon-7B and Falcon-40B appeared in May 2023, with Falcon-40B immediately claiming the top spot on the Hugging Face Open LLM Leaderboard — the de facto ranking for open language models. The 40B model outperformed LLaMA-65B on several benchmarks despite being significantly smaller.

In September 2023, TII followed with Falcon-180B, the largest openly released language model at the time, trained on an astonishing 3.5 trillion tokens. The secret was RefinedWeb: a 5-trillion-token dataset of deduplicated, extensively filtered Common Crawl data.

## How It Works

**Falcon's RefinedWeb data curation pipeline -- from raw web to high-quality tokens:**

```
┌─────────────────┐
│  Common Crawl   │  (raw internet -- petabytes of messy data)
│  (Raw Web Data) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Language ID    │────▶│  URL Filtering   │────▶│  Document-Level │
│  (English only) │     │  (remove spam,   │     │  Dedup (MinHash)│
└─────────────────┘     │  adult, low-Q)   │     │  (~50% removed) │
                        └─────────────────┘     └────────┬────────┘
                                                         │
         ┌───────────────────────────────────────────────┘
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Paragraph-     │────▶│  Heuristic       │────▶│  ML Quality     │
│  Level Dedup    │     │  Filters (length,│     │  Classifier     │
└─────────────────┘     │  repetition)     │     │  (final stage)  │
                        └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                              ┌─────────────────────┐
                                              │  RefinedWeb: ~5T    │
                                              │  high-quality tokens│
                                              │  (web data ONLY)    │
                                              └─────────────────────┘
```

### RefinedWeb: The Data-Centric Innovation

RefinedWeb was the centerpiece of Falcon's approach. Starting from Common Crawl, the TII team applied an aggressive multi-stage filtering pipeline:

- Language identification (keeping only English text)
- URL filtering (removing adult, spam, and low-quality domains)
- Document-level deduplication using MinHash (reducing near-duplicate content by over 50%)
- Paragraph-level deduplication
- Heuristic quality filters (document length, word length, special character ratio, repetition detection)
- Machine-learning-based quality classifier as a final stage

The result was approximately 5 trillion high-quality tokens extracted from what most researchers treated as the internet's junk drawer. The team partially released the RefinedWeb dataset (~600 billion tokens) for the research community, enabling others to study and build on their data curation methodology.

### Multi-Query Attention for Efficient Inference

Falcon adopted Multi-Query Attention (MQA), first proposed by Shazeer (2019). In standard multi-head attention, each attention head has its own key, value, and query projections. MQA shares a single set of key and value projections across all attention heads while maintaining separate query projections.

This dramatically reduces the KV cache size — by a factor equal to the number of heads — without significantly impacting model quality. For Falcon-40B with its 64 attention heads, MQA reduced KV cache memory by 64x compared to standard multi-head attention, making inference far more practical on limited hardware.

The quality trade-off was minimal: MQA typically cost less than 1% on benchmarks while delivering substantial speedups during autoregressive generation.

### Architecture and Training

Falcon uses a standard decoder-only Transformer architecture with a few notable choices beyond MQA. The models use RoPE positional encodings and a parallel attention-FFN formulation, computing attention and feedforward in parallel rather than sequentially (following the approach used in PaLM).

Falcon-40B has 40 billion parameters across 60 layers with a hidden dimension of 8,192. Falcon-180B scales to 80 layers with a hidden dimension of 14,848.

The 180B model was trained on 3.5 trillion tokens of RefinedWeb data using 4,096 A100 GPUs over approximately two months — a massive compute investment backed by UAE government resources. This made Falcon-180B one of the most expensive open models ever trained.

### The 180B Scale

Falcon-180B, released in September 2023, was the largest openly available language model at its time of release. Trained on 3.5 trillion tokens, it approached GPT-3.5 quality on many benchmarks.

However, the model's sheer size — requiring multiple high-end GPUs just for inference — limited its practical adoption. Where LLaMA 2 70B and Mistral 7B could be quantized and run on consumer or single-GPU setups, Falcon-180B required enterprise-grade infrastructure with at least 4 A100 GPUs for basic inference.

This size-accessibility trade-off illustrated the tension between capability and deployment practicality that would define much of the open model landscape.

## Why It Matters

### The Data Quality Thesis

Falcon's most lasting contribution was proving the data quality thesis empirically. Before RefinedWeb, the conventional wisdom was that training competitive models required diverse, curated corpora combining web text with books, academic papers, code, and other high-quality sources.

Falcon showed that sufficiently cleaned web data alone could match or exceed multi-source approaches. This finding influenced the entire field's approach to data preparation and helped establish data curation as a first-class research discipline rather than an engineering afterthought.

The RefinedWeb paper demonstrated that a model trained exclusively on filtered Common Crawl outperformed one trained on the curated C4 dataset, directly challenging the assumption that web data was inherently lower quality.

### Non-Western AI Leadership

Falcon was significant as one of the first frontier AI models from outside the US-China-UK axis. TII's success demonstrated that government-backed research institutes with sufficient funding and the right talent could produce globally competitive models.

It placed the UAE on the AI map and contributed to broader discussions about geographic diversification in AI development. The model was partially funded as part of Abu Dhabi's broader strategy to position the UAE as a technology hub, alongside investments in other advanced research domains.

### The Leaderboard Moment and Its Aftermath

Falcon-40B's stint atop the Hugging Face Open LLM Leaderboard in May-June 2023 was a validation moment, but the triumph was short-lived. LLaMA 2 (July 2023) and especially Mistral 7B (September 2023) redirected community attention.

Falcon's initial license (a custom "Falcon LLM License" that was partially restrictive, requiring royalties for high-revenue commercial use) created friction that the Apache 2.0-licensed Mistral did not. TII eventually switched to Apache 2.0, but the ecosystem had moved on.

Falcon's story is a case study in how technical quality alone is not sufficient — licensing, community engagement, and ecosystem momentum matter enormously in the open-source AI world.

## Key Technical Details

- **Falcon-7B**: 7 billion parameters, trained on 1.5T tokens of RefinedWeb
- **Falcon-40B**: 40 billion parameters, 60 layers, d_model=8192, trained on 1T tokens
- **Falcon-180B**: 180 billion parameters, 80 layers, d_model=14848, trained on 3.5T tokens
- **RefinedWeb**: ~5T tokens of deduplicated, filtered Common Crawl data
- **Attention**: Multi-Query Attention (single KV head shared across all query heads)
- **Falcon-40B MMLU**: 55.4% (5-shot) — briefly #1 on Hugging Face Open LLM Leaderboard
- **Falcon-180B MMLU**: 70.4% (5-shot) — approaching GPT-3.5 Turbo quality
- **Training compute (180B)**: 4,096 A100 GPUs, ~2 months
- **Released**: Falcon-7B/40B (May 2023), Falcon-180B (September 2023)
- **License**: Initially custom Falcon LLM License, later switched to Apache 2.0
- **RefinedWeb partial release**: ~600B tokens made available for research
- **Parallel attention-FFN**: Following PaLM's approach for faster training

## Common Misconceptions

- **"Falcon used proprietary training data."** The opposite is true. Falcon's entire training corpus was derived from Common Crawl, a publicly available web scrape. The innovation was in the filtering, not the sourcing.

- **"Falcon 180B was better than GPT-4."** Falcon 180B approached GPT-3.5 quality on many benchmarks but was well below GPT-4. Its significance was being the largest open model, not the best model overall.

- **"Multi-Query Attention significantly hurts quality."** MQA does involve a small quality trade-off compared to full multi-head attention, but Falcon showed the degradation was minimal — typically less than 1% on benchmarks — while the inference speedup was dramatic.

- **"Data quality only matters for small models."** Falcon 180B demonstrated that data quality benefits scale with model size. Even at 180B parameters, the choice of training data had significant impact on model quality.

- **"Falcon failed."** While Falcon lost the adoption battle to LLaMA 2 and Mistral, its RefinedWeb methodology was widely influential. The data quality thesis it proved informed training decisions at labs worldwide.

## Connections to Other Concepts

- `01-gpt-3.md` — Falcon showed that GPT-3-class performance could be achieved with better data curation
- `03-chinchilla-and-compute-optimal-training.md` — Falcon's training token counts followed Chinchilla-optimal principles
- `01-roberta.md` — Like RoBERTa, Falcon showed that careful training choices outweigh architectural novelty
- `01-llama-1.md` — LLaMA and Falcon were released in the same period, both emphasizing data over architecture
- `04-mistral-7b.md` — Mistral's Apache 2.0 license and architectural innovations ultimately eclipsed Falcon in community adoption
- `02-the-data-quality-revolution.md` — Falcon is a primary case study in the data quality revolution

## Further Reading

- Penedo et al., "The RefinedWeb Dataset for Falcon LLM: Outperforming Curated Corpora with Web Data, and Web Data Only" (2023) — The RefinedWeb data paper.
- Almazrouei et al., "The Falcon Series of Open Language Models" (2023) — The Falcon technical report.
- Shazeer, "Fast Transformer Decoding: One Write-Head is All You Need" (2019) — Multi-Query Attention used in Falcon.
- Chowdhery et al., "PaLM: Scaling Language Modeling with Pathways" (2022) — The parallel attention-FFN formulation adopted by Falcon.
- Lee et al., "Deduplicating Training Data Makes Language Models Better" (2022) — Research on deduplication that informed RefinedWeb's methodology.
