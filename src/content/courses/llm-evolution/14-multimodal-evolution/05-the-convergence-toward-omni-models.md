# The Convergence Toward Omni-Models

**One-Line Summary**: The AI field is converging from separate specialized models for each modality toward unified "omni-models" that perceive, reason about, and generate text, images, audio, video, and code within a single architecture.

**Prerequisites**: `02-native-multimodal-training.md`, `03-gpt-4o.md`

## What Is the Convergence Toward Omni-Models?

In 2020, the AI landscape was a collection of specialists: GPT-3 for text, ViT for images, Wav2Vec for audio, each excelling in its domain but blind to the others. By 2025, the field has converged toward omni-models — single systems that can see, hear, read, write, speak, generate images, reason about video, execute code, and use tools, all within one unified architecture.

This convergence is not just an engineering convenience. It reflects a deeper insight: intelligence is fundamentally cross-modal, and artificially separating modalities limits what AI systems can understand and do. The omni-model trajectory is reshaping how we build, deploy, and think about AI.

## How It Works

**The Four Phases of Multimodal Convergence:**

```
Phase 1 (2018-2021)      Phase 2 (2022-2023)     Phase 3 (2023-2024)
Separate Specialists      Adapter-Connected        Native Multimodal

┌──────┐ ┌──────┐        ┌──────┐                 ┌─────────────────┐
│ GPT-3│ │ ViT  │        │ CLIP │──┐              │                 │
│(text)│ │(image│        │ViT   │  │ adapter      │  Gemini / GPT-4o│
└──────┘ └──────┘        └──────┘  │              │                 │
┌──────┐ ┌──────┐           ┌──────▼──────┐       │  All modalities │
│Wav2V │ │Video │           │ LLM (frozen)│       │  in ONE model   │
│(audio│ │model │           └─────────────┘       │  from training  │
└──────┘ └──────┘        Shallow connection        │                 │
Isolated, no cross-      at adapter boundary       └─────────────────┘
modal understanding                                Deep cross-modal
                                                   understanding

Phase 4 (2025): Omni-Models with Generation
┌─────────────────────────────────────────────────────────┐
│                    Omni-Model                            │
│                                                         │
│  UNDERSTAND            GENERATE              ACT        │
│  ┌─────────┐          ┌─────────┐          ┌─────────┐ │
│  │ Text    │          │ Text    │          │ Tools   │ │
│  │ Image   │          │ Image   │          │ Code    │ │
│  │ Audio   │          │ Speech  │          │ Browser │ │
│  │ Video   │          │ (Music) │          │ APIs    │ │
│  └─────────┘          └─────────┘          └─────────┘ │
│                                                         │
│  Perceive ──────▶ Reason ──────▶ Create/Act             │
│                                                         │
│  Examples: GPT-4o (Mar 2025 image gen), Gemini 2.5,     │
│            Llama 4 (open-source multimodal MoE)          │
└─────────────────────────────────────────────────────────┘
```

### Phase 1: Separate Specialists (2018-2021)

The early deep learning era was defined by specialization. BERT (2018) and GPT-3 (2020) dominated text. Vision Transformers (Dosovitskiy et al., October 2020) and ResNets handled images. Wav2Vec 2.0 (Baevski et al., 2020) and DeepSpeech processed audio. Video models like TimeSformer (2021) handled video understanding.

Each model had its own architecture, training data, training procedure, and deployment infrastructure. Building a system that could analyze a video call — understanding speech, facial expressions, shared documents, and conversation context — required orchestrating 4-5 separate models with hand-engineered pipelines.

Information was lost at every boundary between models. The speech recognition system could not know that the speaker was being sarcastic (visible from their facial expression). The image classifier could not know that the document on screen was being discussed in the audio. The text model could not see the visual context. Each specialist was blind to the information processed by the others.

### Phase 2: Adapter-Connected Models (2022-2023)

CLIP (January 2021) demonstrated that vision and language could share an embedding space. Flamingo (April 2022) showed that visual tokens could be injected into a frozen LLM. LLaVA (April 2023) proved that even a simple linear projection between a vision encoder and an LLM could produce strong multimodal understanding.

These adapter approaches were pragmatic — they leveraged expensive pre-trained models and required training only small connector modules. Within months, the adapter paradigm became the standard approach for open-source multimodal models.

But adapters remained fundamentally limited. They bolted new modalities onto systems designed for text, creating shallow cross-modal connections. The LLM's internal representations were still text-shaped, and visual or audio information had to be translated into that text-shaped space rather than being natively represented. Cross-modal reasoning could only happen at the adapter boundary, not throughout the network.

### Phase 3: Native Multimodal Training (2023-2024)

Gemini (December 2023) was the first frontier model designed as natively multimodal from the start. Text, images, audio, and video were all tokenized and processed through the same Transformer architecture during pre-training. The model learned cross-modal associations not through post-hoc adapters but through billions of examples of naturally co-occurring multimodal data.

GPT-4o (May 2024) took the "omni" label explicitly, processing text, vision, and audio in a single forward pass with 232ms average voice response latency. A user could show the model an image, discuss it verbally, and receive a spoken response — all within one model, with the response reflecting understanding of both the visual content and the vocal nuance of the question.

Gemini 1.5 Pro (February 2024) added the dimension of scale: a 1 million token context window that could hold an hour of video, 11 hours of audio, or thousands of pages of documents simultaneously. Cross-modal reasoning at this scale — finding the moment in a 45-minute video where a specific concept is discussed, for example — demonstrated capabilities impossible with separate specialist models.

### Phase 4: Omni-Models With Generation (2025)

The frontier in 2025 extends beyond understanding to generation across modalities.

GPT-4o gained native image generation capabilities (March 2025), allowing the same model that understands images and text to create new images from text descriptions or modify existing images based on natural language instructions. The same model that can analyze a chart can also create one from data.

Gemini 2.5 (March 2025) combined text, image, audio, and video understanding with chain-of-thought reasoning, tool use, and code execution in a single model — representing the most complete omni-model at the time of its release.

Llama 4 (April 2025) brought multimodal omni-model capabilities to the open-source ecosystem. Using a Mixture of Experts architecture, Llama 4 processes text and images natively, with the Scout variant handling up to 10 million tokens of context. The open availability of multimodal omni-models means the convergence is not limited to frontier labs with proprietary systems.

The generation frontier follows a clear arc: perception (understanding modalities) came first, followed by generation (creating content in each modality), with interaction (acting in the world via tools and agents) as the emerging third phase. Each phase builds on the previous one — you must understand images before you can generate good ones, and you must be able to generate actions before you can act as an autonomous agent.

## Why It Matters

The convergence toward omni-models has three profound implications.

First, it radically simplifies AI deployment. Instead of maintaining separate models for text understanding, vision, speech recognition, speech synthesis, and image generation — each with its own infrastructure, latency characteristics, and failure modes — organizations can deploy a single model that handles everything. This reduces engineering complexity, latency (no inter-model communication), and operational cost.

Second, it enables capabilities that specialist models cannot provide. Understanding a meme requires simultaneous visual and linguistic processing. Analyzing a meeting requires processing speech, facial expressions, and shared documents together. Tutoring a student requires seeing their work, hearing their questions, and responding with both spoken explanation and generated diagrams. These cross-modal tasks are natural for humans but impossible for siloed AI systems.

Third, it lays the foundation for AI agents that interact with the full richness of the world. An agent that can see a screen, hear a user's voice command, generate a response, write code, and use tools to execute actions is qualitatively more capable than an agent limited to text. Omni-models provide the perceptual and generative foundation that makes autonomous AI agents practical.

### Remaining Gaps

Despite rapid progress, significant gaps remain. No current omni-model has haptic or tactile understanding — it cannot feel texture or pressure. 3D spatial reasoning from 2D images remains limited. Embodied interaction — physically manipulating objects in the real world — is still largely the domain of specialized robotics systems.

The "foundation model" vision — one model, all modalities, all tasks — is approaching reality for digital modalities (text, image, audio, video, code) but remains distant for physical world interaction.

## Key Technical Details

- **2020 Landscape**: GPT-3 (text), ViT (images), Wav2Vec 2.0 (audio) — separate models, separate pipelines.
- **CLIP** (Jan 2021): Shared vision-text embedding. 400M image-text pairs. Zero-shot classification.
- **Flamingo-80B** (Apr 2022): Visual tokens in frozen LLM. Adapter paradigm established.
- **Gemini 1.0 Ultra** (Dec 2023): First natively multimodal frontier model. Text + image + audio + video.
- **GPT-4o** (May 2024): "Omni" model. Text + vision + audio. 232ms voice latency.
- **Gemini 1.5 Pro** (Feb 2024): 1M token context. 1 hour video, 11 hours audio.
- **GPT-4o Image Gen** (Mar 2025): Native image generation added. Understanding + generation unified.
- **Gemini 2.5 Pro** (Mar 2025): Reasoning + multimodal + tools + code. Most complete omni-model.
- **Llama 4** (Apr 2025): Open-source multimodal MoE. Text + image native. Up to 10M token context.
- **Remaining Gaps**: Haptic understanding, 3D spatial reasoning, embodied physical interaction.

## Common Misconceptions

- **"Omni-models are just many specialist models packaged together."** True omni-models process all modalities through shared parameters and develop genuinely cross-modal representations. This is architecturally different from running separate models behind a unified API, which still suffers from information loss at model boundaries.

- **"Separate specialist models will always outperform generalist omni-models."** While specialists initially outperform generalists on their specific modality, omni-models at sufficient scale match or exceed specialists because cross-modal training provides additional learning signal. Visual training improves text understanding; code training improves reasoning.

- **"The convergence means we only need one model for everything."** Omni-models handle most common tasks well, but specialized fine-tuned models still outperform them on specific domains like medical imaging, music transcription, or protein structure prediction. The convergence is about the base model, not the elimination of all specialization.

- **"Omni-models are close to artificial general intelligence."** While omni-models are impressively capable across modalities, they still lack persistent memory, genuine causal understanding, long-horizon planning, and robust out-of-distribution reasoning. Multimodal breadth is not the same as depth of intelligence.

## Connections to Other Concepts

The convergence story begins with `01-vision-language-models.md` and progresses through `02-native-multimodal-training.md`. Individual modalities are covered in `03-audio-and-speech-models.md` and `04-video-understanding.md`. Key milestone models include `08-gemini-1.md`, `03-gpt-4o.md`, and `03-gemini-2-and-beyond.md`. The agent implications are explored in `06-agent-native-models.md`, and the broader trajectory in `05-where-llms-are-heading.md`. For open-source multimodal models, see `04-llama-4.md`.

## Further Reading

- Team Gemini, "Gemini: A Family of Highly Capable Multimodal Models" (2023) — native multimodal architecture.
- OpenAI, "GPT-4o System Card" (2024) — the omni-model concept.
- Team Gemini, "Gemini 1.5: Unlocking Multimodal Understanding Across Millions of Tokens" (2024) — long-context multimodal.
- Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (2021) — CLIP cross-modal foundation.
- Dosovitskiy et al., "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale" (2020) — Vision Transformer.
- Driess et al., "PaLM-E: An Embodied Multimodal Language Model" (2023) — multimodal for embodied agents.
- Meta, "Introducing Llama 4" (2025) — open-source omni-model.
