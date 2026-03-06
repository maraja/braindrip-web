# Gemma

**One-Line Summary**: Google DeepMind's Gemma series brought Gemini-class technology to the open-weight ecosystem, evolving from simple text models to multimodal, multilingual systems designed for edge deployment.

**Prerequisites**: `08-gemini-1.md`, `02-kaplan-scaling-laws.md`, `07-the-slm-revolution.md`

## What Is Gemma?

Think of Gemini as Google's luxury flagship sedan -- powerful, packed with features, but only available through Google's showroom. Gemma is Google taking the same engineering blueprints and building a series of compact, efficient vehicles that anyone can own, modify, and drive wherever they want. Same DNA, different form factor, vastly broader reach.

Before Gemma, Google's position in the open-weight landscape was conspicuously absent. Meta had LLaMA, Microsoft had Phi, Mistral had its eponymous models, but Google -- the company that invented the Transformer architecture -- had kept its model weights locked behind API walls. This was increasingly untenable. The open-source community was thriving, developers were building on competitors' models, and Google risked becoming irrelevant in the ecosystem where most real-world AI applications were being built. Gemma was Google's answer: a family of lightweight, state-of-the-art models built from the same research and technology that powers Gemini, released as open weights for anyone to use.

The name "Gemma" derives from the Latin word for "precious stone," a deliberate echo of "Gemini" (twins). Launched in February 2024, the series rapidly evolved across three major generations, each substantially expanding capabilities -- from simple text-only models to multimodal, multilingual systems with architectural innovations that push the boundaries of what small models can achieve.

## How It Works

**Gemma's three-generation evolution -- from text-only to multimodal edge AI:**

```
Gemma 1 (Feb 2024)       Gemma 2 (Jun 2024)         Gemma 3 (Mar 2025)
┌─────────────────┐      ┌─────────────────┐         ┌─────────────────────┐
│  2B, 7B         │      │  2B, 9B, 27B    │         │  270M, 1B, 4B,     │
│  Text only      │      │  Text only      │         │  12B, 27B           │
│  2T-6T tokens   │      │                 │         │                     │
│                 │      │  + Knowledge    │         │  + Vision (SigLIP)  │
│  Outperformed   │      │    distillation │         │  + 128K context     │
│  LLaMA-2-13B    │      │    from Gemini  │         │  + 140+ languages   │
│  at 7B          │      │                 │         │  + Matformer (3n)   │
└────────┬────────┘      │  27B approached │         │                     │
         │               │  LLaMA-3-70B    │         │  27B matched        │
         ▼               └────────┬────────┘         │  Gemini 1.5 Pro     │
    Google enters                 │                   └──────────┬──────────┘
    open-weight race              ▼                              │
                           Quality leap via                      ▼
                           distillation                   ┌────────────────┐
                                                          │  Gemma 3n      │
                                                          │  Matformer:    │
                                                          │  ┌──────────┐  │
                                                          │  │ Full 27B │  │
                                                          │  │ ┌──────┐ │  │
                                                          │  │ │ 12B  │ │  │
                                                          │  │ │┌────┐│ │  │
                                                          │  │ ││ 2B ││ │  │
                                                          │  │ │└────┘│ │  │
                                                          │  │ └──────┘ │  │
                                                          │  └──────────┘  │
                                                          │  One checkpoint│
                                                          │  multiple sizes│
                                                          └────────────────┘
```

### Gemma 1: The Foundation (February 2024)

The initial release included two sizes: 2B and 7B parameters. These were dense Transformer models (no Mixture of Experts) trained on 2 trillion tokens for Gemma-2B and 6 trillion tokens for Gemma-7B. The training data included web documents, code, and mathematics -- drawn from the same data pipelines used for Gemini but filtered and processed for the smaller model context.

Gemma-7B outperformed LLaMA-2-13B on most benchmarks despite being roughly half the size. On MMLU, Gemma-7B scored 64.3% compared to LLaMA-2-13B's 54.8%. The models used a vocabulary of 256,000 tokens (much larger than LLaMA's 32,000), RoPE positional embeddings, and GeGLU activations. Google released both pre-trained and instruction-tuned variants, along with a "Responsible Generative AI Toolkit" for safe deployment.

### Gemma 2: Architectural Refinement (June 2024)

The second generation introduced meaningful architectural changes. Available in 2B, 9B, and 27B sizes, Gemma 2 incorporated knowledge distillation from larger models during training -- a technique that transferred capabilities from Gemini-scale models into the compact Gemma architecture. The 27B variant was particularly notable: it approached the quality of LLaMA-3-70B while being less than half the size.

Gemma 2 also introduced sliding window attention alternating with full attention layers, grouped-query attention for efficiency, and a technique called "model merging" that combined checkpoints from different training stages. The 9B model became especially popular in the developer community as a sweet spot between capability and compute requirements.

### Gemma 3: The Multimodal Leap (March 2025)

Gemma 3 represented a qualitative transformation. Five sizes -- 1B, 4B, 12B, 27B, and a tiny 270M "Gemma Nano" -- covered the full spectrum from mobile deployment to workstation use. The major advances were:

**Multimodality**: Models 4B and above gained vision capabilities via a SigLIP (Sigmoid Loss for Language-Image Pre-Training) vision encoder. Unlike bolted-on vision adapters, SigLIP was deeply integrated, allowing the model to reason about images with genuine understanding rather than surface-level description. The model could process interleaved text and image inputs with up to 10 images per request.

**Massive context**: 128K token context window across all sizes, enabling the 27B model to process entire codebases or book-length documents. This was achieved through a hybrid attention scheme: local sliding window attention (4,096 tokens) on most layers with global full attention on every fifth layer, dramatically reducing memory requirements compared to full attention at 128K length.

**Multilingual breadth**: Support for over 140 languages, making Gemma 3 one of the most linguistically diverse open-weight models available. This was critical for adoption outside English-dominant markets.

**Quantized variants**: ShieldGemma for safety classification and pre-quantized INT4 variants were released alongside the full models, acknowledging that most real-world deployments use quantized models.

### Gemma 3n: The Matformer Innovation

Perhaps the most architecturally novel addition was Gemma 3n, which used the Matformer (Matryoshka Transformer) architecture. Named after Russian nesting dolls, Matformer trains a single set of weights that contains multiple models of different sizes nested within each other. A single Gemma 3n checkpoint can be deployed as a 2B-equivalent model on a constrained device or a full-size model on capable hardware, with smooth quality-compute tradeoffs in between. This eliminated the need to train, store, and manage separate model checkpoints for different deployment targets.

## Why It Matters

### Google Enters the Open-Weight Race

Gemma's launch signaled a philosophical shift at Google. After years of keeping model weights proprietary, releasing Gemma acknowledged that the open ecosystem was too important to ignore. The move validated Meta's open-source strategy with LLaMA and created a three-way race between Google, Meta, and Microsoft for open-weight supremacy. Developers gained access to models built with Google's unmatched infrastructure and data resources.

### Edge AI Becomes Real

The Gemma 3 lineup, especially the 270M Nano variant and the Matformer-based 3n, made sophisticated language models viable on smartphones, IoT devices, and embedded systems. A 270M model running on-device means real-time text processing without network latency, without cloud costs, and without privacy concerns from sending data externally. For applications like real-time translation, voice assistants, and on-device content filtering, this is transformative.

### Raising the Open-Weight Quality Floor

With Gemma 3-27B approaching the quality of much larger closed models, Google raised the floor for what open-weight models could achieve. The 27B model matched Gemini 1.5 Pro on several benchmarks -- meaning a model anyone could download and run locally was competitive with Google's own commercial API offering from just months prior. This compression of the capability gap between open and closed models accelerated across the industry.

## Key Technical Details

- Gemma 1 (February 2024): 2B and 7B sizes, trained on 2T-6T tokens, 256K vocabulary
- Gemma 2 (June 2024): 2B, 9B, 27B sizes, knowledge-distilled from larger Gemini models
- Gemma 3 (March 2025): 270M, 1B, 4B, 12B, 27B sizes, 128K context, 140+ languages
- SigLIP vision encoder integrated for 4B+ models, supporting up to 10 images per request
- Hybrid local/global attention: sliding window (4,096) on most layers, full attention every 5th layer
- Gemma 3n uses Matformer architecture -- single checkpoint, multiple deployment sizes
- Gemma 3-27B matched Gemini 1.5 Pro on several benchmarks
- Released under Google's custom Gemma License, permitting commercial use with some restrictions

## Common Misconceptions

- **"Gemma is just a smaller Gemini."** While Gemma shares research lineage with Gemini, it has its own distinct architecture, training process, and optimizations. Gemma 2 and 3 include architectural innovations (like Matformer) not present in Gemini.

- **"Open weights means open source."** Gemma's license permits commercial use but includes restrictions (e.g., usage policies and redistribution terms) that differ from truly permissive licenses like MIT. It is "open weights," not "open source" in the strict sense.

- **"Small models can't do multimodal well."** Gemma 3's 4B model demonstrates competent image understanding via SigLIP integration, and the 12B and 27B variants are genuinely capable multimodal reasoners.

- **"You need separate models for different devices."** Gemma 3n's Matformer architecture specifically solves this -- a single set of weights adapts to available compute, eliminating the need for device-specific model variants.

## Connections to Other Concepts

Gemma's relationship to its parent model is explored in `03-gemini-2-and-beyond.md`. Its role in the broader small model trend connects to `07-the-slm-revolution.md` and competes directly with `01-phi-series.md`. The knowledge distillation techniques used in Gemma 2 are covered in `03-knowledge-distillation-for-llms.md`. Gemma models are popular targets for `04-quantization-and-compression.md` and `05-lora-and-fine-tuning-democratization.md`. The local inference story ties to `06-llama-cpp-and-local-inference.md`, and Gemma's contribution to the open ecosystem is analyzed in `07-open-vs-closed-the-narrowing-gap.md`.

## Further Reading

- Gemma Team, "Gemma: Open Models Based on Gemini Research and Technology" (2024) -- the initial technical report for Gemma 1
- Gemma Team, "Gemma 2: Improving Open Language Models at a Practical Size" (2024) -- architectural refinements and distillation approach
- Gemma Team, "Gemma 3 Technical Report" (2025) -- the multimodal, multilingual expansion
- Zhai et al., "Sigmoid Loss for Language-Image Pre-Training" (2023) -- the SigLIP vision encoder used in Gemma 3
- Devvrit et al., "Matformer: Nested Transformer for Elastic Inference" (2023) -- the architecture behind Gemma 3n
