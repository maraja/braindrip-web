# Vision-Language Models: Connecting Sight and Language

**One-Line Summary**: Vision-language models learn to connect visual perception with language understanding, evolving from contrastive image-text matching (CLIP) to full visual reasoning capabilities integrated into large language models.

**Prerequisites**: `07-gpt-4.md`, `03-bert.md`

## What Is a Vision-Language Model?

A vision-language model (VLM) is an AI system that can process both images and text, enabling tasks like describing images, answering questions about visual content, and reasoning about what it sees. Think of it as giving a language model eyes.

The challenge is fundamental: images are grids of pixels (continuous, spatial, high-dimensional) while language is sequences of tokens (discrete, sequential, symbolic). Bridging these two modalities requires learning a shared representation where visual concepts and their linguistic descriptions occupy the same space. The field has progressed from simple image-text matching to models that can reason about complex visual scenes with human-like understanding.

## How It Works

**Vision-Language Model Architectures -- Evolution of Approaches:**

```
CLIP (2021)                 Flamingo (2022)             LLaVA (2023)
Contrastive Matching        Adapter: Cross-Attention    Adapter: Simple Projection

┌────────┐  ┌────────┐     ┌────────┐                  ┌────────┐
│ Image  │  │ Text   │     │ Image  │                  │ Image  │
│Encoder │  │Encoder │     │Encoder │ (frozen)         │Encoder │ (CLIP ViT)
│ (ViT)  │  │        │     │(NFNet) │                  │        │
└───┬────┘  └───┬────┘     └───┬────┘                  └───┬────┘
    │           │              │                           │
    ▼           ▼              ▼                           ▼
┌────────┐  ┌────────┐     ┌──────────┐                ┌──────────┐
│Embedding│  │Embedding│    │Perceiver │                │ Linear / │
│ Space  │  │ Space  │     │Resampler │                │ MLP      │
└───┬────┘  └───┬────┘     │(64 tokens)│               │ Projector│
    │           │          └───┬──────┘                └───┬──────┘
    └─── match ─┘              │                           │
   (contrastive)          ┌────▼──────┐                ┌───▼───────┐
                          │  LLM      │                │  LLaMA    │
                          │(Chinchilla│  (frozen)      │  (fine-   │
                          │  80B)     │                │   tuned)  │
                          │ + cross-  │                └───────────┘
                          │ attention │
                          └───────────┘

  Zero-shot           Few-shot VQA             Visual conversation
  classification      16 benchmarks SOTA       Simple yet effective

  Native Multimodal (Gemini, GPT-4o):
  ┌─────────────────────────────────────────────────┐
  │ Image Tokens + Text Tokens + Audio Tokens       │
  │        ▼           ▼            ▼               │
  │ ┌─────────────────────────────────────────────┐ │
  │ │ Unified Transformer (all layers)            │ │
  │ │ Cross-modal attention from layer 1          │ │
  │ └─────────────────────────────────────────────┘ │
  │ No adapter -- modalities interact everywhere    │
  └─────────────────────────────────────────────────┘
```

### CLIP: Learning a Shared Embedding Space (2021)

CLIP (Contrastive Language-Image Pre-training, Radford et al., January 2021) was the conceptual breakthrough. OpenAI trained a vision encoder (ViT-L/14) and a text encoder jointly on 400 million image-text pairs scraped from the internet. The training objective was contrastive: given a batch of image-text pairs, push matching pairs together in embedding space and non-matching pairs apart.

This simple objective produced a model with remarkable zero-shot classification ability — to classify an image, you encode it and compare against text embeddings of candidate labels ("a photo of a dog," "a photo of a cat"). CLIP achieved 76.2% zero-shot accuracy on ImageNet without ever seeing ImageNet training data.

CLIP's deeper insight was that natural language supervision is vastly more scalable than manual annotation. Instead of labeling millions of images with fixed categories, CLIP learned from the natural descriptions people write alongside images on the internet. This approach generalized far better than supervised classifiers trained on fixed label sets, because the label space is effectively unlimited.

### Flamingo: Visual Tokens Meet LLMs (2022)

DeepMind's Flamingo (Alayrac et al., April 2022) introduced the paradigm of connecting a vision encoder to a frozen large language model. Visual features from images or video frames are projected into "visual tokens" that are interleaved with text tokens and fed to the LLM via gated cross-attention layers inserted between the LLM's existing layers.

The key architectural innovation was keeping both the vision encoder and the LLM frozen, training only the cross-attention layers and a Perceiver Resampler — a module that compresses variable-length visual features into a fixed number of tokens (64 per image). This made training efficient and preserved the language model's existing capabilities.

Flamingo-80B (built on Chinchilla-80B) achieved state-of-the-art few-shot performance on 16 visual QA benchmarks, demonstrating that LLMs could learn to reason about images from just a handful of in-context examples. This established the "adapter" paradigm: frozen vision encoder + frozen LLM + trainable connector.

### LLaVA: Simplicity Wins (2023)

LLaVA (Liu et al., April 2023) demonstrated that the adapter approach could be radically simplified. It used a single linear projection layer to map CLIP ViT-L/14 visual features into the LLaMA-13B token embedding space — no cross-attention, no perceiver, just a matrix multiplication. Despite this simplicity, LLaVA achieved strong visual conversation abilities.

The key was visual instruction tuning: training on 150,000 visual question-answer pairs generated by GPT-4 given image captions and bounding box annotations. The model learned to converse about images because it was trained on high-quality conversational data about images.

LLaVA-1.5 (Liu et al., October 2023) improved further with a two-layer MLP projector instead of a single linear layer, higher-resolution image processing (336x336 pixels), and more diverse training data. It matched or exceeded far more complex architectures on standard benchmarks. The lesson was clear: with good training data and a capable base LLM, even a minimal vision-language connector can produce strong multimodal understanding.

### GPT-4V and the Frontier (2023-2024)

GPT-4V (September 2023) brought vision understanding to the frontier of AI capability. While architectural details remain unpublished, it demonstrated capabilities far beyond previous VLMs:

- Reading handwritten text and understanding messy document layouts
- Interpreting charts, graphs, and scientific diagrams
- Solving visual math problems from photographed worksheets
- Understanding memes, humor, and cultural context in images
- Reasoning about spatial relationships between objects

GPT-4V's multimodal reasoning showed that vision-language understanding benefits enormously from the base language model's reasoning capabilities. A better text reasoner becomes a better visual reasoner once given the ability to see.

### Advancing the Architecture Space (2023-2024)

SigLIP (Zhai et al., Google, 2023) refined CLIP's contrastive approach by replacing the softmax-based InfoNCE loss with a simpler sigmoid loss applied independently to each image-text pair. This scaled better to larger batch sizes and produced better representations for downstream adaptation.

CogVLM (Wang et al., Tsinghua, December 2023) achieved deep fusion by adding visual expert modules — separate attention and FFN parameters for visual tokens — in every Transformer layer. This produced strong benchmark results by giving the model dedicated capacity for visual processing.

InternVL (Chen et al., Shanghai AI Lab, 2024) progressively scaled visual understanding, demonstrating that larger vision encoders (up to 6B parameters) and more pre-training data continue to improve multimodal capability.

## Why It Matters

Vision-language models transformed AI from text-only systems to systems that can perceive the visual world. This unlocked enormous practical applications: accessibility (describing images for visually impaired users), document understanding (reading and reasoning about PDFs, charts, and forms), medical imaging (interpreting X-rays and pathology slides), autonomous driving (understanding road scenes), and creative applications (image analysis and editing guidance).

The field revealed that visual understanding in LLMs follows the same scaling patterns as text understanding — more parameters, more data, and better training produce reliably better results. It also showed that text-based reasoning transfers powerfully to visual domains: a model that reasons well about text can reason well about images once given the ability to perceive them.

The progression from classification (CLIP) to visual QA (Flamingo) to open-ended visual reasoning (GPT-4V) to multi-image understanding mirrors the progression from narrow to general capability in text-only models. Each step built on the previous one, with CLIP providing the visual foundation, adapter models proving the concept, and native multimodal models pushing the frontier.

## Key Technical Details

- **CLIP** (Jan 2021): ViT-L/14 vision encoder, 400M image-text pairs. 76.2% zero-shot ImageNet accuracy.
- **Flamingo-80B** (Apr 2022): Chinchilla-80B LLM + NFNet vision encoder + Perceiver Resampler. 16 VQA benchmark SOTA.
- **LLaVA** (Apr 2023): CLIP ViT-L + LLaMA-13B + linear projection. 150K visual instruction tuning examples.
- **LLaVA-1.5** (Oct 2023): MLP projector, 336px resolution. Competitive with far more complex architectures.
- **GPT-4V** (Sep 2023): First frontier multimodal LLM. Architecture unpublished. Set new capability bar.
- **SigLIP** (2023): Sigmoid contrastive loss. Better scaling than CLIP's softmax approach.
- **CogVLM-17B** (Dec 2023): Visual expert modules in every layer. Strong on multi-benchmark evaluation.
- **InternVL 2.0** (2024): 6B vision encoder + LLM. Progressive scaling of visual understanding.
- **Image Tokenization**: ViT encodes images as patch tokens. 336x336 image at 14x14 patches = 576 tokens.
- **Multi-crop Strategy**: Process image at multiple resolutions. High-res for detail, low-res for global context.

## Common Misconceptions

- **"VLMs understand images the same way humans do."** VLMs process images as grids of patch tokens through statistical pattern matching. They can fail on spatial reasoning, counting objects, and fine-grained visual details that humans handle effortlessly. Their "understanding" is fundamentally different from human visual perception.

- **"You need a complex architecture to connect vision and language."** LLaVA showed that a simple linear projection works surprisingly well. The quality of the base LLM and the visual instruction tuning data matter far more than architectural complexity in the connector module.

- **"CLIP-style models can do visual reasoning."** CLIP excels at matching images to descriptions but lacks the generative reasoning capability of full VLMs. It is a retrieval and classification system, not a reasoning system. Full VLMs integrate CLIP's vision encoder with a language model's reasoning ability to produce something qualitatively different.

## Connections to Other Concepts

VLMs evolved from the vision foundations of CLIP toward integration with LLMs like `07-gpt-4.md` and `05-llama-3-and-3-1.md`. The adapter approach (LLaVA, Flamingo) contrasts with the native multimodal approach in `02-native-multimodal-training.md`. Multimodal extensions for open models are covered in `06-llama-3-2-multimodal.md`. The trajectory toward unified models is explored in `05-the-convergence-toward-omni-models.md`. For the attention mechanism underlying both vision and language processing, see `01-attention-is-all-you-need.md` in the `llm-concepts/` companion collection.

## Further Reading

- Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (2021) — CLIP.
- Alayrac et al., "Flamingo: a Visual Language Model for Few-Shot Learning" (2022) — Flamingo.
- Liu et al., "Visual Instruction Tuning" (2023) — LLaVA.
- Liu et al., "Improved Baselines with Visual Instruction Tuning" (2023) — LLaVA-1.5.
- Zhai et al., "Sigmoid Loss for Language Image Pre-Training" (2023) — SigLIP.
- Wang et al., "CogVLM: Visual Expert for Pretrained Language Models" (2023) — CogVLM.
- Chen et al., "InternVL: Scaling up Vision Foundation Models and Aligning for Generic Visual-Linguistic Tasks" (2024) — InternVL.
