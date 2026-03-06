# LLaMA 3.2: Multimodal and Edge Models

**One-Line Summary**: Meta's LLaMA 3.2 (September 2024) brought vision capabilities to the open-weight LLaMA family for the first time with 11B and 90B multimodal models, while also releasing tiny 1B and 3B text models for on-device deployment — and LLaMA 3.3 later showed a 70B model could match the 405B.

**Prerequisites**: `05-llama-3-and-3-1.md`, `03-gpt-4o.md`

## What Is LLaMA 3.2?

Imagine a family of vehicles that started as sedans — reliable, powerful, but limited to paved roads. Then the manufacturer releases an update: the same family now includes an SUV that handles off-road terrain (images and documents), plus two ultralight motorcycles that can go anywhere, even places without gas stations (on-device, no internet required). LLaMA 3.2 was that expansion — taking the proven LLaMA architecture and stretching it in two opposite directions: larger and multimodal, smaller and portable.

Meta released LLaMA 3.2 on September 25, 2024, at the Meta Connect event. It was a four-model release: two text-only models (1B and 3B parameters) designed for edge and mobile deployment, and two vision-language models (11B and 90B parameters) that could understand images alongside text. This was the first time the LLaMA family included visual understanding — filling a gap that had made open-weight models less competitive against GPT-4o and Claude 3.5 Sonnet for multimodal applications.

The timing was deliberate. By late 2024, the frontier had moved beyond text-only models. Enterprise customers increasingly needed AI that could interpret documents, analyze charts, understand screenshots, and process visual data. Without vision capabilities, even the impressive LLaMA 3.1 405B was excluded from a growing category of use cases. LLaMA 3.2 addressed this gap while simultaneously pushing in the opposite direction — toward models small enough to run on a smartphone.

## How It Works

**LLaMA 3.2's dual expansion -- bigger (multimodal) and smaller (edge):**

```
                    LLaMA 3.2 Family (Sep 2024)
                           │
         ┌─────────────────┼─────────────────┐
         ▼                                   ▼
  Edge / On-Device                    Multimodal Vision
  ┌──────────────┐                ┌───────────────────────┐
  │  1B  │  3B   │                │    11B    │    90B    │
  │ text │ text  │                │  (8B LM   │ (70B LM  │
  │ only │ only  │                │  + vision │ + vision  │
  ├──────┴───────┤                │  adapter) │ adapter)  │
  │ Runs on      │                ├───────────┴──────────┤
  │ smartphones  │                │ ┌─────────────┐      │
  │ IoT devices  │                │ │ SigLIP      │      │
  │ 128K context │                │ │ Image       │──┐   │
  │ No internet  │                │ │ Encoder     │  │   │
  │ needed       │                │ └─────────────┘  │   │
  └──────────────┘                │ ┌─────────────┐  │   │
                                  │ │Cross-Attn   │◀─┘   │
                                  │ │Layers       │      │
                                  │ └──────┬──────┘      │
                                  │ ┌──────┴──────┐      │
                                  │ │ LLaMA Text  │      │
                                  │ │ Backbone    │      │
                                  │ └─────────────┘      │
                                  └──────────────────────┘
```

### Vision Architecture

The multimodal models (11B and 90B) used a vision adapter architecture rather than training from scratch as a natively multimodal model. The approach involved three components: a pre-trained image encoder based on a SigLIP-style architecture (a contrastive vision-language model), cross-attention layers that allowed the language model to attend to visual features, and the LLaMA 3.1 text backbone (8B or 70B) that served as the language reasoning engine.

The image encoder processed input images into a sequence of visual tokens. These visual tokens were then integrated into the language model through dedicated cross-attention layers inserted between existing Transformer blocks. This approach had a key advantage: the pre-trained text capabilities of LLaMA 3.1 were largely preserved, since the core language model weights were initialized from the already-trained text models and then fine-tuned with the vision components.

### Image Understanding Capabilities

The vision models could handle a range of visual tasks: document understanding (reading and reasoning about PDFs, invoices, and forms), chart and graph interpretation (extracting data points, identifying trends, comparing values), image captioning and description, visual question answering, and natural image understanding. The 90B model, with its larger language backbone, showed significantly stronger reasoning over visual inputs — particularly on tasks requiring multi-step inference about chart data or complex document layouts.

### The Tiny Text Models

The 1B and 3B text-only models were a different bet entirely. These were not scaled-down versions of the larger models but purpose-built for on-device deployment. They were designed to run on mobile phones, IoT devices, and edge hardware without requiring cloud connectivity. The 1B model could handle basic summarization, instruction following, and simple Q&A locally. The 3B model added stronger reasoning and could handle tool calling and retrieval-augmented generation at the edge. Both supported a 128K context window despite their small size, achieved through the same GQA and RoPE architectures used in larger LLaMA models.

### LLaMA 3.3: The Efficient Frontier

In December 2024, Meta released LLaMA 3.3 — a 70B parameter model that achieved performance matching the 405B LLaMA 3.1 on most benchmarks. At roughly 43GB in quantized form (compared to hundreds of GB for the 405B), this made frontier-competitive performance accessible on a single high-end GPU. The 70B matching the 405B was a stunning demonstration of how much room existed for training efficiency improvements: better data curation, improved post-training, and more effective fine-tuning could close most of the gap that raw parameter count had provided.

## Why It Matters

### Open-Weight Multimodal AI

Before LLaMA 3.2, developers who needed vision-language capabilities had limited open-weight options. Models like LLaVA and InternVL existed, but none had the backing, quality, and ecosystem support of the LLaMA family. LLaMA 3.2's vision models gave the open community a credible multimodal foundation that could be fine-tuned for specialized visual tasks — medical imaging, industrial inspection, document processing — without relying on closed APIs.

### The Edge AI Push

The 1B and 3B models signaled that the AI industry was not only racing to make models bigger but simultaneously racing to make them smaller and more portable. On-device AI avoids network latency, works offline, preserves privacy (data never leaves the device), and reduces cloud costs. By releasing these tiny models under the same LLaMA license, Meta enabled an entirely new category of applications — from smart home devices to mobile apps — to incorporate LLM capabilities.

### The Compression of Capability

LLaMA 3.3's demonstration that a 70B model could match a 405B model was perhaps the most consequential result. It suggested that much of the capability attributed to massive scale could be recovered through better training and post-training techniques. This had implications for the economics of the entire field: if you could get 405B-level performance at 70B cost, the return on investment for training ever-larger dense models became questionable. It was a data point that supported the emerging thesis of `03-the-deepseek-cost-revolution.md` — that the field had been overspending on raw compute.

## Key Technical Details

- **Release date**: September 25, 2024 (LLaMA 3.2); December 2024 (LLaMA 3.3)
- **Text-only models**: 1B and 3B parameters
- **Vision-language models**: 11B (8B text + vision adapter) and 90B (70B text + vision adapter)
- **Vision encoder**: SigLIP-based contrastive image encoder
- **Vision integration**: Cross-attention layers between Transformer blocks
- **Context window**: 128K tokens (all models)
- **LLaMA 3.3**: 70B parameters, matching 3.1-405B on most benchmarks
- **LLaMA 3.3 size**: ~43GB quantized (vs. hundreds of GB for 405B)
- **License**: Meta LLaMA Community License (similar terms to LLaMA 3.1)

## Common Misconceptions

- **"The 11B and 90B vision models are natively multimodal like GPT-4o."** They use an adapter architecture — a vision encoder plus cross-attention layers grafted onto the text model. GPT-4o (see `03-gpt-4o.md`) was trained end-to-end across modalities, which enables different (and generally more fluid) cross-modal reasoning.

- **"The 1B model is too small to be useful."** For basic tasks like text classification, simple Q&A, keyword extraction, and summarization of short texts, the 1B model is surprisingly capable. Its value lies not in matching larger models but in running instantly on resource-constrained hardware.

- **"LLaMA 3.3 70B made the 405B obsolete."** The 405B still offered advantages on the most demanding tasks, particularly long-context reasoning and complex multi-step problems. The 70B matched it on common benchmarks, but benchmark averages can obscure capability differences at the tails.

- **"Vision capabilities in LLaMA 3.2 match GPT-4o or Claude 3.5 Sonnet."** The adapter approach produced strong but not frontier-leading vision capabilities. The closed models with more extensive multimodal training generally performed better on complex visual reasoning tasks.

## Connections to Other Concepts

- `05-llama-3-and-3-1.md` — The direct predecessor; LLaMA 3.2's text backbones are initialized from 3.1 weights
- `03-gpt-4o.md` — Comparison point for end-to-end multimodal training vs. adapter approaches
- `01-claude-3-family.md` — Competing vision capabilities with different architectural approaches
- `03-the-deepseek-cost-revolution.md` — LLaMA 3.3's efficiency gains echo the broader theme of doing more with less
- `09-mistral-large-and-enterprise.md` — Pixtral as another open multimodal competitor

## Further Reading

- Meta AI, "Llama 3.2: Revolutionizing edge AI and vision with open, customizable models" (September 2024) — The official launch announcement.
- Meta AI, "The Llama 3 Herd of Models" (2024) — Technical report covering the full LLaMA 3 family including 3.2 models.
- Zhai et al., "Sigmoid Loss for Language Image Pre-Training" (2023) — The SigLIP paper whose vision architecture influenced LLaMA 3.2's image encoder.
- Meta AI, "Llama 3.3" (December 2024) — Announcement of the efficient 70B model matching 405B performance.
