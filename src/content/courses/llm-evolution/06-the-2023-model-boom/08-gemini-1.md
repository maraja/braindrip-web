# Gemini 1

**One-Line Summary**: Google DeepMind's Gemini was the first natively multimodal large model — trained from the ground up on text, images, audio, and video — and represented Google's consolidated answer to GPT-4 after a year of playing catch-up.

**Prerequisites**: `07-gpt-4.md`, `04-palm.md`

## What Is Gemini 1?

Imagine two approaches to building a translator who works across languages. In one approach, you train separate specialists — one for French, one for Mandarin, one for Arabic — and wire them together through an English intermediary. In the other, you raise someone from birth in a household where all languages are spoken simultaneously, so they develop an intuitive, native understanding of each language and the relationships between them.

The second approach is what Google attempted with Gemini: a model that did not learn vision and language as separate skills bolted together, but as intertwined modalities understood natively from the start.

Gemini 1 was announced on December 6, 2023, by Google DeepMind — itself a recently consolidated entity formed by merging Google Brain (the team behind the original Transformer) and DeepMind (the lab behind AlphaGo and AlphaFold). The merger, completed in April 2023, was driven by a single imperative: Google needed to respond to ChatGPT and GPT-4, and having two competing AI labs was a luxury it could no longer afford. Gemini was the first major product of the unified team, and it carried the weight of Google's entire AI credibility.

The model launched in three tiers: Gemini Ultra (the largest and most capable), Gemini Pro (a balanced option for most applications), and Gemini Nano (a compact variant designed to run directly on mobile devices).

## How It Works

**Gemini's native multimodal training vs. adapter-based approaches:**

```
Adapter-Based Multimodal (e.g., GPT-4V):
┌─────────┐   ┌──────────┐   ┌─────────────┐
│  Vision  │──▶│ Adapter/ │──▶│  Language    │──▶ Text Output
│  Encoder │   │ Projector│   │  Model       │
└─────────┘   └──────────┘   │  (trained    │
                              │  on text)    │
  Trained       Bridge        └─────────────┘
  separately    layer         Separate training

Native Multimodal (Gemini):
┌──────────────────────────────────────────────┐
│           Single Unified Model               │
│                                              │
│  Text ──┐                                    │
│          │                                   │
│  Image ─┼──▶ Interleaved Training ──▶ Output │
│          │   (all modalities from             │
│  Audio ─┤    the ground up)                  │
│          │                                   │
│  Video ──┘                                   │
│                                              │
│  Cross-modal understanding is NATIVE         │
└──────────────────────────────────────────────┘
```

### Native Multimodal Architecture

Unlike GPT-4, which was reported to use separate vision and language encoders fused through adapters, Gemini was described as natively multimodal: a single model trained from the start on interleaved text, images, audio, and video data.

The theoretical advantage is that native multimodal training allows the model to develop unified representations across modalities — understanding that a photograph of a cat, the word "cat," a meowing sound, and a video of a cat jumping are all related concepts, without needing an explicit alignment step.

Google published limited architectural details but indicated the model used a Transformer-based architecture with likely MoE components, building on the Pathways infrastructure developed for PaLM. The training data included web text, images, video, and audio at scales Google did not disclose.

### Three-Tier Design

The three-tier approach was designed to cover the full deployment spectrum:

- **Gemini Ultra**: Google's GPT-4 competitor — the flagship model for the most demanding tasks, available through API and Google's premium AI products
- **Gemini Pro**: The workhorse — capable enough for most applications, fast enough for production serving, and the default model powering Bard
- **Gemini Nano**: Two sizes (Nano-1 at 1.8B and Nano-2 at 3.25B parameters) designed for on-device inference on smartphones

Nano deployed to the Pixel 8 Pro for features like Smart Reply in messaging apps and audio summarization in the Recorder app — representing Google's bet that AI would move to the edge.

### Multimodal Reasoning

Gemini's multimodal capabilities went beyond simple image captioning. The model could reason across modalities: interpreting handwritten math problems from photographs, extracting data from charts and graphs, understanding spatial relationships in images, following action sequences in video, and transcribing and reasoning about audio content.

On multimodal benchmarks, Gemini Ultra achieved state-of-the-art results on 30 of 32 benchmarks tested, including MMMU (59.4%), AI2D (79.5%), and MathVista (53.0%). The model could process up to 32K tokens of combined text and visual input.

The headline claim was Gemini Ultra's 90.04% score on MMLU — the first model to exceed estimated human expert performance (~89.8%) on this widely-cited benchmark.

### Training Infrastructure

Gemini was trained on Google's TPU v4 and TPU v5e accelerator pods using the Pathways distributed training framework. The specific compute requirements were not disclosed, but training a model of Gemini Ultra's scale on multimodal data likely required tens of thousands of TPUs over several months — representing hundreds of millions of dollars in compute.

Google's advantage was its custom hardware: TPU pods offered superior inter-chip bandwidth compared to commodity GPU clusters, enabling more efficient training of very large models with complex multi-modal data pipelines. This infrastructure advantage was something no other company could easily replicate.

## Why It Matters

### Google's Competitive Response

For over a year after ChatGPT's launch, Google appeared to be losing the AI race despite having invented the underlying technology. The rushed launch of Bard in February 2023 (which hallucinated in its first public demo, wiping $100 billion from Alphabet's market cap) was humiliating. PaLM 2, launched in May 2023, was competitive but incremental.

Gemini was Google's genuine counter-punch — a model that could credibly claim to match or exceed GPT-4 on key benchmarks. Whether it actually surpassed GPT-4 in practice was debatable, but the fact that Google had closed the gap was undeniable. The model replaced PaLM 2 as the backbone of Google's AI products, and Bard was eventually rebranded to Gemini.

### The Native Multimodal Paradigm

Gemini's native multimodal training approach influenced the entire field's direction. If a single model could learn from text, images, audio, and video simultaneously and develop cross-modal reasoning, this suggested that the future of AI was not specialized models for each modality but unified models that understand the world across all its sensory channels.

This paradigm shift accelerated multimodal research across the industry and set expectations that frontier models of 2024-2025 would be natively multimodal rather than text-first with adapters bolted on.

### The Controversial Launch

Gemini's announcement was marred by controversy. A demonstration video titled "Hands-on with Gemini" showed the model responding in real-time to a user's visual prompts — pointing at drawings, showing objects, performing gestures. The video implied fluid, real-time multimodal interaction.

It was later revealed that the demo was heavily edited: responses were generated from still images with text prompts, not from live video, and the interactions were not real-time. Bloomberg and other outlets reported on the discrepancy, and the backlash was significant.

The episode became a cautionary tale about AI demo ethics and set a more skeptical tone for subsequent model launches across the industry.

### On-Device AI

Gemini Nano represented an important strategic bet: that AI would increasingly run on the device rather than in the cloud. Running a 1.8B or 3.25B parameter model on a smartphone required aggressive quantization (4-bit) and optimization for mobile chipsets.

The Pixel 8 Pro integration was an early proof of concept, and the approach previewed a future where AI features would work offline, with lower latency, and without sending user data to external servers. This edge-AI strategy later expanded with Gemini Nano being integrated into more Google products and third-party Android devices.

## Key Technical Details

- **Announced**: December 6, 2023
- **Three tiers**: Ultra (largest), Pro (balanced), Nano (on-device: 1.8B and 3.25B parameters)
- **Architecture**: Transformer-based, reportedly MoE; trained natively on multimodal data
- **Gemini Ultra MMLU**: 90.04% (CoT@32 protocol, first to exceed human expert ~89.8%)
- **Gemini Ultra MMLU (5-shot)**: 83.7% under standard protocol
- **Multimodal benchmarks**: SOTA on 30 of 32 benchmarks tested
- **Context window**: 32K tokens (text + multimodal input)
- **MMMU**: 59.4% (multimodal understanding)
- **MathVista**: 53.0%
- **Training hardware**: TPU v4 and v5e pods via Pathways framework
- **Replaced**: PaLM 2 as Google's flagship; Bard rebranded to Gemini
- **Gemini Nano**: Deployed on Pixel 8 Pro (Smart Reply, audio summarization)
- **Team**: Google DeepMind (merged Google Brain + DeepMind, April 2023)
- **Demo controversy**: Launch video revealed to be edited/staged, not real-time interaction

## Common Misconceptions

- **"Gemini clearly beat GPT-4."** The MMLU result (90.04% vs. GPT-4's 86.4%) was achieved using a specific evaluation protocol (CoT@32, choosing the best of 32 chain-of-thought samples). Under the same 5-shot protocol used for GPT-4, the gap was much smaller. On many practical tasks, users reported similar or slightly lower quality compared to GPT-4.

- **"Gemini was a single model."** Gemini was a family of three distinct models (Ultra, Pro, Nano) with very different sizes and capabilities. Comparing "Gemini" to "GPT-4" without specifying the tier was misleading — most users interacted with Gemini Pro, not Ultra.

- **"The demo video showed real capabilities."** The Gemini launch video depicted idealized interactions that did not reflect the actual user experience. The model could process images and video, but not with the speed and fluidity the demo implied.

- **"Google DeepMind was always a single entity."** Google Brain and DeepMind were separate organizations with different cultures, leadership, and research agendas for nearly a decade. The merger in April 2023 was driven by competitive pressure from OpenAI, not organic convergence.

- **"Native multimodal is definitively better than adapter-based multimodal."** While native multimodal training is theoretically elegant, it also requires vastly more diverse training data and compute. Whether it produces categorically better results than adapter-based approaches (like LLaVA or GPT-4V) remains an active research question with evidence on both sides.

## Connections to Other Concepts

- `07-gpt-4.md` — Gemini was Google's direct response to GPT-4's multimodal capabilities
- `04-palm.md` — PaLM 2 was Gemini's predecessor as Google's flagship model
- `02-gemini-1-5.md` — Gemini 1.5 (February 2024) extended context to 1M tokens and refined the architecture
- `01-vision-language-models.md` — Gemini's native multimodal approach represents one end of the vision-language design spectrum
- `02-native-multimodal-training.md` — Gemini was the highest-profile example of native multimodal training
- `08-the-ai-arms-race-begins.md` — Gemini's launch was a pivotal moment in the industry-wide competition triggered by ChatGPT

## Further Reading

- Gemini Team, Google, "Gemini: A Family of Highly Capable Multimodal Models" (2023) — The Gemini technical report.
- Chowdhery et al., "PaLM: Scaling Language Modeling with Pathways" (2022) — The predecessor architecture and training infrastructure.
- Barham et al., "Pathways: Asynchronous Distributed Dataflow for ML" (2022) — The distributed training framework underlying Gemini.
- Hendrycks et al., "Measuring Massive Multitask Language Understanding" (2021) — The MMLU benchmark on which Gemini Ultra claimed a record score.
- Grant, Nico, and Metz, Cade, "Google Gemini AI Demo Was Misleading" (Bloomberg, December 2023) — Reporting on the demo controversy.
