# Llama 4

**One-Line Summary**: Meta's Llama 4 (April 2025) brought native Mixture of Experts and early-fusion multimodality to the open-weight frontier, with Scout's 10 million-token context window setting a new record for open models.

**Prerequisites**: `05-llama-3-and-3-1.md`, `04-mixture-of-experts-evolution.md`

## What Is Llama 4?

Imagine being handed the blueprints and materials for a factory that previously only the wealthiest companies could build. That has been the Llama story from the beginning — Meta releasing increasingly capable model weights for anyone to use. Llama 4 was the most ambitious chapter yet: the first Llama generation built natively as a Mixture of Experts architecture with early-fusion multimodal capabilities, trained on roughly 40 trillion tokens of multilingual data.

Llama 4 arrived in April 2025 as two released models and one announced-but-unreleased behemoth. **Llama 4 Scout** (17B active / 109B total, 16 experts) was optimized for efficiency and featured a record-setting 10 million-token context window. **Llama 4 Maverick** (17B active / 400B total, 128 experts) was the performance-focused variant, competitive with GPT-4o and Gemini 2.0 Flash. **Llama 4 Behemoth** (288B active / ~2T total) was announced as a future release — a model that would have been the largest open-weight model ever released.

The launch was notable not just for the technical achievements but for its controversial reception. Strong benchmark scores were met with mixed real-world feedback from the community, igniting a debate about the gap between benchmark performance and practical usefulness. Some researchers questioned whether benchmark-optimized training had come at the cost of the qualitative "feel" that users care about in practice — response coherence, appropriate tone, and consistent instruction following.

## How It Works

**Llama 4 Model Family -- MoE Architecture:**

```
  Llama 4 Scout           Llama 4 Maverick         Llama 4 Behemoth
  ┌──────────────┐        ┌──────────────┐         ┌──────────────┐
  │ 109B Total   │        │ 400B Total   │         │ ~2T Total    │
  │ 17B Active   │        │ 17B Active   │         │ 288B Active  │
  │ 16 Experts   │        │ 128 Experts  │         │ (Announced)  │
  │ 10M Context  │        │ Top-1 Routing│         │              │
  └──────┬───────┘        └──────┬───────┘         └──────────────┘
         │                       │
         │    MoE Routing (per token):
         │    ┌──────────────────────────────────────────┐
         │    │  Input Token                             │
         │    │       │                                  │
         │    │  ┌────▼─────┐                            │
         │    │  │  Router  │   (learned gating network) │
         │    │  └────┬─────┘                            │
         │    │       │ selects top-k experts             │
         │    │  ┌────┼────┬────┬────┬────┐              │
         │    │  │E1  │E2  │E3  │... │En  │  (n experts) │
         │    │  │ ■  │    │ ■  │    │    │  ■ = active   │
         │    │  └────┴────┴────┴────┴────┘              │
         │    │  Only selected experts compute            │
         │    └──────────────────────────────────────────┘
         │
    Early Fusion Multimodal:
    ┌──────────┐  ┌──────────┐
    │ Image    │  │ Text     │──▶ Interleaved from
    │ Tokens   │  │ Tokens   │    earliest layers
    └────┬─────┘  └────┬─────┘
         └──────┬──────┘
                ▼
        Shared Transformer
```

### Mixture of Experts Architecture

Llama 4 marked Meta's first adoption of MoE for the Llama family, a significant architectural departure from the dense transformers used in Llama 1 through 3.1. The MoE approach allowed dramatically larger total parameter counts while keeping active parameters — and therefore inference cost — manageable.

**Scout** used 16 experts with a relatively standard routing design. Each token activates a subset of these experts, keeping compute at the 17B-active-parameter level while drawing on 109B total parameters of learned knowledge. The 16-expert design balanced routing complexity against specialization depth.

**Maverick** scaled to 128 experts — a fine-grained approach more similar to DeepSeek V3's 256-expert design than to Mixtral's 8-expert model. With 400B total parameters but only 17B active per token, Maverick achieved an impressive 23:1 ratio of total to active parameters. This aggressive sparsity enabled frontier-competitive quality at a fraction of the dense compute cost.

### Early Fusion Multimodality

Unlike models that process images through separate encoders and then fuse representations with text at a later stage, Llama 4 used early fusion — interleaving image and text tokens from the earliest layers of the model. This approach, which maps images directly into the token space shared by text, enables richer cross-modal reasoning because visual and linguistic representations interact throughout the entire network rather than only at fusion boundaries.

### The 10M Context Window

Scout's 10 million-token context window was the longest of any open model at release. This was enabled by **iRoPE** (interleaved Rotary Position Embeddings), an innovation that alternates between layers using standard RoPE positional encodings and layers with no positional encoding at all. The intuition is that not every layer needs explicit position information — some layers can focus purely on content-based attention. This interleaving allows better length generalization, enabling the model to handle sequences far longer than those seen during training. The 10M context window means Scout can theoretically ingest an entire codebase, a full book series, or months of conversation history in a single prompt — though practical applications at this extreme length remain nascent.

### MetaP: Hyperparameter Prediction

Training models at Llama 4's scale requires setting thousands of hyperparameters — learning rates, weight initialization scales, dropout rates — that traditionally require expensive grid searches or manual tuning. MetaP (Meta Param) is a system that predicts near-optimal hyperparameters based on model architecture and scale, reducing the need for costly training runs devoted purely to hyperparameter search. This system contributed to training efficiency by reducing the number of expensive ablation runs needed before committing to a full-scale training configuration. While Meta disclosed limited details about the system's implementation, the concept represents a growing trend toward automating the meta-decisions of model development — using machine learning to optimize the machine learning pipeline itself.

### Training Data and Scale

Llama 4 models were trained on approximately 40 trillion tokens of multilingual data, a substantial increase from Llama 3.1's 15 trillion tokens. The dataset included text in dozens of languages as well as image-text pairs for multimodal training. The multilingual expansion reflected Meta's strategy of building models for a global user base — consistent with their products serving billions of users worldwide.

The training infrastructure leveraged Meta's massive GPU clusters, with training distributed across tens of thousands of GPUs using custom parallelism strategies. The combination of MoE architecture with Meta's training infrastructure expertise enabled efficient training despite the enormous total parameter counts. Meta reported using a combination of data parallelism, expert parallelism, and tensor parallelism to distribute the training workload.

### Post-Training and Alignment

Llama 4 underwent extensive post-training, including supervised fine-tuning on instruction-following demonstrations and reinforcement learning from human feedback. Meta also invested in safety training, including red-teaming for harmful content generation, bias evaluation across languages, and robustness testing against adversarial prompts. The post-training pipeline was designed to produce models that were both helpful and safe, consistent with Meta's commitment to responsible open release under the Llama Community License.

## Why It Matters

### Open MoE at Scale

Llama 4 validated that MoE architectures could be released as open weights and run by the broader community. While DeepSeek V3 had demonstrated MoE at scale, it came from a less established ecosystem. Llama's adoption of MoE — backed by Meta's resources and community — signaled that MoE was now the default architecture for frontier open models.

### The Context Length Race

Scout's 10M context window pushed the boundaries of what open models could handle. While the practical utility of 10 million tokens remains debated — few applications routinely require it — the capability established that open models need not trail closed models on context length, and it demonstrated that architectural innovations like iRoPE could enable extreme length generalization.

### The Benchmark-Reality Gap

Llama 4's launch exposed a persistent tension in the AI community. The models achieved strong scores on standard benchmarks (competitive with GPT-4o and Gemini 2.0 Flash), but early user feedback was mixed, with reports of inconsistent quality on real-world tasks. This reinforced growing skepticism about benchmark-driven evaluation and the importance of Chatbot Arena-style human preference testing.

## Key Technical Details

- Released: April 2025 (Scout and Maverick); Behemoth announced, not released
- Developer: Meta AI
- Llama 4 Scout: 17B active / 109B total, 16 experts, 10M token context window
- Llama 4 Maverick: 17B active / 400B total, 128 experts, competitive with GPT-4o
- Llama 4 Behemoth: 288B active / ~2T total (announced)
- Training data: ~40T tokens, multilingual
- Architecture: MoE with early-fusion multimodal, iRoPE positional encoding
- MetaP: hyperparameter prediction system for training efficiency
- License: Llama Community License (open weights with usage restrictions above 700M monthly users)
- Post-training: SFT + RLHF for instruction following and safety
- iRoPE: interleaved RoPE layers with no-position-embedding layers for length generalization
- Predecessor: LLaMA 3.1 (dense architecture, 15T tokens, up to 405B parameters)

## Common Misconceptions

- **"Llama 4 has 400 billion parameters you need to run."** Maverick has 400B total parameters but only activates 17B per token. With expert parallelism, you need memory for all weights, but compute scales with active parameters. The inference cost is comparable to a 17B dense model.

- **"The 10M context means Scout is better than GPT-4o for long documents."** Context length is a necessary but not sufficient condition for long-document performance. Retrieval accuracy, reasoning coherence, and attention quality across the full context all matter. Scout's 10M capability is impressive but not automatically superior to shorter-context models on all long-context tasks.

- **"Llama 4's benchmarks prove it matches GPT-4o."** The mixed real-world feedback suggests that benchmark scores do not fully capture model quality. Factors like instruction following, tone, consistency, and handling of edge cases matter for practical usefulness but are poorly captured by standard benchmarks.

- **"Behemoth will be the most capable open model ever."** Behemoth's 288B active / ~2T total scale is extraordinary, but capability depends on training quality, not just size. Its actual performance relative to frontier closed models remains to be seen.

- **"Early fusion means Llama 4 understands images as well as text."** While early fusion enables richer cross-modal interaction, image understanding in Llama 4 is not at the same level as text understanding. The model was trained on far more text tokens than image tokens, and image tasks generally showed more variance in quality than text tasks. Early fusion is an architectural advantage, not a guarantee of multimodal parity.

- **"MoE means each expert handles a different language."** While some experts may develop language-related specialization, MoE routing is learned and often produces subtle, overlapping specializations rather than clean divisions. Many experts contribute to multiple languages and tasks simultaneously.

## Connections to Other Concepts

Llama 4's MoE architecture is part of the broader trend covered in `04-mixture-of-experts-evolution.md`. Its position in the open-source ecosystem connects to `07-open-vs-closed-the-narrowing-gap.md` and the dynamics of `04-the-open-source-ecosystem.md`. The iRoPE innovation relates to `02-positional-encoding-evolution.md`. The early-fusion multimodal approach connects to `02-native-multimodal-training.md`. The context length capabilities build on techniques explored in `07-long-context-techniques.md`. The benchmark-reality gap observed at launch connects to evaluation challenges discussed in `01-the-benchmark-and-evaluation-landscape.md`. As an open model, Llama 4's deployment relies on the infrastructure covered in `06-llama-cpp-and-local-inference.md` and the broader ecosystem in `04-the-open-source-ecosystem.md`.

## Further Reading

- Meta AI, "Llama 4 Model Card and Technical Report" (2025) — architecture, training, and evaluation details.
- Shazeer et al., "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer" (2017) — foundational MoE work that Llama 4 builds upon.
- Su et al., "RoFormer: Enhanced Transformer with Rotary Position Embedding" (2021) — the RoPE foundation for iRoPE.
- Meta AI, "The Llama 3 Herd of Models" (2024) — the predecessor architecture and training methodology.
- Jiang et al., "Mixtral of Experts" (2023) — the open MoE model that blazed the trail Llama 4 followed.
- DeepSeek-AI, "DeepSeek-V3 Technical Report" (2024) — the fine-grained MoE approach that influenced Maverick's 128-expert design.
