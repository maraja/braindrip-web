# Qwen 1 and 2: Alibaba's Ascent

**One-Line Summary**: Alibaba's Qwen model family evolved from a competent bilingual system in 2023 to a leading open-weight family by late 2024, demonstrating that consistent iteration on data quality and architecture could close the gap with Western frontier models.

**Prerequisites**: `03-llama-2.md`, `03-chinchilla-and-compute-optimal-training.md`

## What Is the Qwen Series?

The Qwen series (short for Tongyi Qianwen, meaning "seeking answers from a thousand questions") represents Alibaba Cloud's sustained investment in building a competitive open-weight language model family. Starting with Qwen 1 in August 2023, the series grew through four major iterations in under two years, each expanding in data scale, multilingual capability, model variety, and community adoption.

What distinguished Qwen from many competitors was not a single flashy breakthrough but relentless, methodical improvement. Each version trained on more data, supported more languages, offered more size variants, and integrated more deeply with the open-source tooling ecosystem. While other labs made headlines with dramatic announcements, Alibaba quietly shipped version after version, each meaningfully better than the last. By the time Qwen 2.5 arrived in September 2024, it had become the most widely adopted Chinese open-weight model family and was competitive with Western models several times its parameter count.

The Qwen story is also the story of how Chinese AI labs learned to build global communities. Rather than releasing models only for domestic consumption with Chinese-only documentation, Alibaba pursued Apache 2.0 licensing, English documentation, HuggingFace integration, and active engagement with the international open-source community. This strategy paid off: Qwen became a foundation model for developers worldwide, not just in China.

## How It Works

**Qwen's four-generation evolution -- methodical improvement at every step:**

```
                    Qwen 1         Qwen 1.5        Qwen 2         Qwen 2.5
                   (Aug 2023)      (Feb 2024)      (Jun 2024)      (Sep 2024)
                      │               │               │               │
  Training Data:     3T ────────▶   ~4T ──────────▶  7T ──────────▶ 18T tokens
  Languages:          2 ────────▶   30+ ──────────▶ 30+ ──────────▶ 30+
  Context:           2K ────────▶   32K ──────────▶128K ──────────▶128K
  Sizes:        7B/14B/72B     0.5B-110B        0.5B-72B        0.5B-72B
  Attention:        MHA ────────▶   GQA ──────────▶ GQA ──────────▶ GQA
  Alignment:       RLHF ────────▶ RLHF+DPO ─────▶RLHF+DPO ─────▶RLHF+DPO

  MMLU (72B):      ~68% ────────▶ 77.5% ────────▶ 84.2% ────────▶ 86.1%
                                                                     │
                                                    Competitive with ▼
                                                    LLaMA 3.1 405B (88.6%)
                                                    at 6x fewer parameters!
```

### Qwen 1: Establishing the Foundation (August 2023)

Qwen 1 launched in August 2023 with 7B and 14B parameter models, later expanding to a 72B flagship. Trained on approximately 3 trillion tokens of Chinese and English text sourced from web crawls, books, code repositories, and curated datasets, it established a standard dense Transformer architecture. The technical choices were sound if conventional: Rotary Position Embeddings (RoPE) for position encoding, SwiGLU activation functions for improved training dynamics, and RMSNorm for stable layer normalization.

The 72B model was competitive with LLaMA 2 70B on English benchmarks while significantly outperforming it on Chinese-language tasks. This asymmetry reflected Alibaba's key advantage: access to massive, high-quality Chinese training data that Western labs could not easily match. The Chinese-language superiority made Qwen the default choice for applications targeting Chinese users.

The initial release also included Qwen-VL (vision-language) and Qwen-Audio variants, signaling that the Qwen ecosystem would extend beyond text from the start. This multimodal ambition, present from the first generation, gave Qwen a broader scope than many competitors who focused exclusively on text.

### Qwen 1.5: Multilingual Expansion (February 2024)

Released just six months after Qwen 1, the 1.5 version was a refinement rather than a redesign. The most significant architectural change was the addition of Grouped-Query Attention (GQA), which reduced the KV cache size and improved inference throughput without meaningful quality loss. Context length increased to 32K tokens, a substantial improvement that enabled processing of longer documents.

The biggest impact was in multilingual capability. Qwen 1.5 expanded from bilingual (Chinese and English) to over 30 languages, including Japanese, Korean, French, German, Spanish, Arabic, and Vietnamese. This expansion was achieved through both additional multilingual training data and architectural tuning to improve cross-lingual transfer.

The size range expanded to cover 0.5B to 110B parameters, with the smaller models specifically optimized for deployment on resource-constrained devices including smartphones and edge hardware. The alignment process improved through better RLHF data collection and the addition of DPO (Direct Preference Optimization) training.

### Qwen 2: The Quality Leap (June 2024)

Qwen 2 represented the first major architectural and data overhaul. Training data expanded to 7 trillion tokens, more than double Qwen 1's dataset. The data quality improved through better deduplication, filtering, and synthetic data generation. The 72B model extended its context to 128K tokens through YaRN (Yet another RoPE extension), a positional encoding interpolation technique that allowed models to generalize to longer sequences than they were primarily trained on.

GQA became standard across all sizes, replacing the Multi-Head Attention used in Qwen 1's larger models. The model family spanned 0.5B to 72B parameters, with each size point carefully tuned with hyperparameters and learning rate schedules optimized for that specific scale rather than simply scaling up a single configuration.

Benchmark results showed the magnitude of the leap. Qwen2-72B achieved 84.2% on MMLU (vs Qwen1.5-72B's 77.5%), 64.6% on HumanEval (vs 41.5%), and strong results across multilingual benchmarks in over 30 languages. The coding-specialized Qwen2-Coder and math-specialized variants demonstrated that the base architecture could be effectively adapted for domain expertise through specialized fine-tuning.

### Qwen 2.5: Data-Driven Frontier (September 2024)

Qwen 2.5 pushed training data to 18 trillion tokens, the largest dataset in the Qwen line and one of the largest publicly acknowledged training sets for any open model. Rather than scaling parameters, Alibaba scaled data quantity and refined data quality through improved filtering, deduplication, and synthetic data generation. The result validated the Chinchilla insight at extreme scale: that data scaling can substitute for parameter scaling.

Qwen2.5-72B became competitive with LLaMA 3.1 405B on several benchmarks despite being nearly 6x smaller in parameter count. On MMLU, Qwen2.5-72B scored 86.1% compared to LLaMA 3.1 405B's 88.6%, a remarkably small gap given the size difference. On coding benchmarks, the story was even more dramatic: Qwen2.5-Coder-32B achieved 92.7% on HumanEval, making it the strongest open-weight coding model at its size class, competitive with GPT-4o on code generation tasks.

The 128K context window was maintained across all sizes, and instruction-following quality improved substantially through better alignment data and refined DPO training. Qwen2.5 also introduced improved quantization support, with GPTQ and AWQ quantized versions available on release day.

## Why It Matters

Qwen's trajectory mattered for three reasons. First, it demonstrated that a non-US lab could build and maintain a competitive open-weight model family through sustained engineering investment rather than a single breakthrough moment. While DeepSeek grabbed headlines with architectural innovations and R1's reasoning, Qwen demonstrated that methodical iteration, each generation better than the last, could achieve similar competitive results.

Second, it proved the value of data quality and quantity over raw parameter counts. Qwen 2.5's 72B model rivaling a 405B model was a powerful validation that data investment was at least as important as parameter investment. This had practical implications: a 72B model is far cheaper to deploy and serve than a 405B model, meaning the "same quality at 6x fewer parameters" translated directly into lower costs for users.

Third, the Apache 2.0 licensing and active community engagement created a viable alternative to Meta's LLaMA for developers seeking open-weight foundations. Within China's AI ecosystem, Qwen became the default foundation for fine-tuning and deployment, similar to LLaMA's role in the Western community. Thousands of derivative models were built on Qwen bases, creating a self-reinforcing ecosystem of tools, tutorials, fine-tuned variants, and community expertise.

DeepSeek's R1 was distilled into Qwen bases (the R1-Distill-Qwen family), further cementing Qwen's role as a foundational architecture for the broader open-source AI ecosystem.

## Key Technical Details

- Qwen 1 (Aug 2023): 7B/14B/72B, 3T tokens, Chinese+English, RoPE+SwiGLU+RMSNorm
- Qwen 1.5 (Feb 2024): 0.5B to 110B, GQA added, 30+ languages, 32K context
- Qwen 2 (Jun 2024): 0.5B to 72B, 7T tokens, 128K context (72B), GQA standard
- Qwen 2.5 (Sep 2024): 0.5B to 72B, 18T tokens, 128K context all sizes
- Qwen2-72B MMLU: 84.2% (vs Qwen1.5-72B: 77.5%)
- Qwen2.5-72B MMLU: 86.1% (competitive with LLaMA 3.1 405B: 88.6%)
- Qwen2.5-Coder-32B HumanEval: 92.7%
- License: Apache 2.0 for most sizes
- Supported platforms: HuggingFace, vLLM, GGUF/Ollama, TensorRT-LLM
- R1-Distill-Qwen series: 1.5B, 7B, 14B, 32B distilled reasoning models
- Community: largest Chinese open-weight ecosystem, 10K+ derivative models on HuggingFace
- Architecture: dense Transformer (no MoE until Qwen 3)
- Multimodal variants: Qwen-VL (vision-language), Qwen-Audio from first generation
- Alignment methods: evolved from RLHF (Qwen 1) to RLHF+DPO (Qwen 1.5+)
- Data composition: web crawl, books, code, academic papers, synthetic data
- Context extension: YaRN (Yet another RoPE extension) for 128K in Qwen 2+
- Quantization support: GPTQ, AWQ, GGUF variants available for all model sizes

## Common Misconceptions

- **"Qwen is just a Chinese copy of LLaMA."** While Qwen shares the standard Transformer architecture with LLaMA (as does virtually every modern LLM), Alibaba's training data, training recipes, alignment approaches, and multimodal extensions are independent developments. Many of Qwen's architectural choices (SwiGLU, RMSNorm, RoPE) predate or parallel LLaMA's adoption of the same techniques. The resemblance reflects convergent evolution toward a standard Transformer recipe, not copying.

- **"Qwen models are only good for Chinese tasks."** Qwen 2 and 2.5 are genuinely multilingual, supporting 30+ languages with competitive performance. English benchmark results consistently match or exceed comparably sized Western models. The Chinese specialization is an additional strength, not the sole one. Many international developers use Qwen for English-only applications.

- **"Smaller Qwen models are just distilled from larger ones."** Each size in the Qwen family is trained from scratch with architecture and hyperparameters optimized for that specific scale. Learning rates, batch sizes, and training durations are all tuned per size. The training data may be shared, but the models are not compressed versions of larger siblings.

- **"Qwen 2.5 closed the gap only on easy benchmarks."** The competitive performance extended to challenging benchmarks including GPQA, MATH, and LiveCodeBench. On coding specifically, Qwen2.5-Coder was the strongest open-weight model at its size, competitive with proprietary models costing far more to serve.

## Connections to Other Concepts

Qwen's evolution continued with the Qwen 3 series in `05-qwen-3-and-open-frontier.md`, which added hybrid thinking and MoE architecture. The broader Chinese AI landscape is covered in `06-chinese-ai-labs.md`. DeepSeek's R1 reasoning model was distilled into Qwen bases, creating the R1-Distill-Qwen family mentioned in `03-deepseek-r1.md`. For the data quality approaches that drove Qwen's improvements, see `02-the-data-quality-revolution.md`. The open-weight model movement that Qwen participates in is discussed in `07-open-vs-closed-the-narrowing-gap.md`. The Chinchilla-optimal training principles that Qwen 2.5 validated at scale are in `03-chinchilla-and-compute-optimal-training.md`.

## Further Reading

- Bai et al., "Qwen Technical Report" (2023) — the original Qwen 1 technical report.
- Yang et al., "Qwen2 Technical Report" (2024) — architecture and training details for Qwen 2.
- Qwen Team, "Qwen2.5: A Party of Foundation Models" (2024) — the Qwen 2.5 release and benchmark results.
- Hui et al., "Qwen2.5-Coder Technical Report: Building the Most Versatile Code LLM" (2024) — coding specialization details.
- Touvron et al., "LLaMA 2: Open Foundation and Fine-Tuned Chat Models" (2023) — the Western open-weight model Qwen most directly competed with.
- Hoffmann et al., "Training Compute-Optimal Large Language Models" (2022) — the Chinchilla scaling laws that Qwen 2.5's data-heavy approach validated.
