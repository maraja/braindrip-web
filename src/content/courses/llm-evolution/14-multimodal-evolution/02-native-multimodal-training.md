# Native Multimodal Training

**One-Line Summary**: Native multimodal training jointly trains a single model on text, images, audio, and video from the ground up, producing cross-modal understanding that adapter-based approaches cannot achieve.

**Prerequisites**: `01-vision-language-models.md`, `08-gemini-1.md`

## What Is Native Multimodal Training?

The adapter approach to multimodality is like hiring a translator between two people who speak different languages — it works, but something is always lost in translation. Native multimodal training is like raising someone bilingual from birth: the model learns to think in images and text simultaneously, developing connections between modalities that emerge naturally from joint training rather than being bolted on afterward.

The distinction matters because native models develop cross-modal representations that adapters fundamentally cannot replicate — they do not just translate between modalities but reason across them. An adapter model converts image features into text-like tokens; a native model develops internal representations that are neither purely visual nor purely textual but something richer.

## How It Works

**Late Fusion (Adapter) vs Early Fusion (Native) Multimodal:**

```
Late Fusion (Adapter Approach)        Early Fusion (Native Approach)
═══════════════════════════════       ══════════════════════════════

┌────────┐     ┌────────┐            ┌───────────────────────────┐
│ Vision │     │ Text   │            │ Interleaved Token Sequence│
│Encoder │     │Encoder │            │ [img][img][txt][txt][img] │
│(frozen)│     │(frozen)│            └─────────────┬─────────────┘
└───┬────┘     └───┬────┘                          │
    │              │                          ┌────▼────┐
    ▼              │                          │ Layer 1 │ Cross-modal
┌──────────┐       │                          │attention│ from the
│ Adapter  │───────┘                          └────┬────┘ very start
│ (narrow  │                                       │
│ bottleneck)                                 ┌────▼────┐
└────┬─────┘                                  │ Layer 2 │
     │                                        └────┬────┘
┌────▼──────────┐                                  │
│ LLM Layers    │                                  ...
│ (text-shaped  │                             ┌────▼────┐
│  representations)                           │ Layer N │ Rich cross-
└───────────────┘                             └─────────┘ modal repr.

Cross-modal interaction:     Cross-modal interaction:
Only at adapter boundary     At EVERY layer

Examples:                    Examples:
LLaVA, Flamingo, MiniGPT-4  Gemini, GPT-4o, Llama 4
```

### The Adapter Paradigm and Its Limits (2022-2023)

The adapter approach — exemplified by LLaVA, Flamingo, and MiniGPT-4 — connects pre-trained vision encoders to pre-trained language models using small trainable modules: linear projections, cross-attention layers, or perceiver resamplers. This is efficient because you leverage the substantial investment in pre-training both components and only train the connector.

But the approach imposes a fundamental ceiling on multimodal understanding. The limitations are structural:

- The vision encoder was trained for image classification or contrastive matching, not for the fine-grained visual understanding needed for complex reasoning about spatial relationships, small text, or subtle visual details.
- The language model's internal representations were shaped entirely by text — its intermediate layers have no concept of visual features, and the adapter must compress all visual information through a narrow bottleneck.
- Cross-modal interactions only happen at the boundary between the two pre-trained models, not throughout the processing pipeline.

You can improve adapter models with better base models and more training data, but you cannot overcome the architectural limitation that two independently trained systems are being stitched together at a single point.

### Early Fusion vs. Late Fusion

The technical distinction between native and adapter approaches comes down to where modalities are combined.

Late fusion (the adapter approach) processes each modality independently through most of the network and combines them only near the output layers. The vision encoder processes the image into features, these features are projected into the language model's space, and only then do visual and textual information interact.

Early fusion (the native approach) combines modalities at the input level and processes them together through all layers. Images, text, and audio are all tokenized and fed as a single interleaved sequence into the Transformer. Every attention layer can attend across all modalities from the very first layer, building increasingly rich cross-modal representations at every level of the network.

### Gemini: The First Major Native Multimodal Model (2023)

Google's Gemini (December 2023) was the first frontier model designed as natively multimodal from the ground up. Trained on interleaved sequences of text, images, audio, and video, Gemini could process and reason about mixed-modality inputs in ways that adapter models could not.

A user could show Gemini a photograph of a handwritten math problem, and the model would simultaneously recognize the handwriting, parse the mathematical notation, solve the problem, and explain the solution — all within a single forward pass that treated visual and mathematical reasoning as inseparable.

Gemini 1.5 Pro (February 2024) pushed native multimodality further with a 1 million token context window. Users could upload an hour of video with audio, hundreds of pages of documents, or thousands of images, and the model could reason about the entire collection. The extended context made cross-modal reasoning practical at scales impossible for adapter models: finding specific moments in long videos, comparing information across hundreds of document pages, or synthesizing insights from large image collections.

### GPT-4o: The Omni Architecture (2024)

GPT-4o ("omni," May 2024) represented a further evolution: a single model architecture that handles text, vision, and audio input and output in a unified forward pass. Previous systems like GPT-4V had separate processing paths for vision. GPT-4o processed all modalities through the same network.

The "omni" in GPT-4o signified that the model does not switch between modes or route to different components. Whether processing text, understanding an image, or generating speech, the same parameters handle everything. This enables cross-modal reasoning that would be impossible with separate components: understanding a meme requires simultaneously processing the image, the overlaid text, the cultural context, and the intended humor — something native training handles naturally.

GPT-4o achieved sub-300ms voice response latency — fast enough for natural conversation including interruptions, emotional expression, and non-verbal cues. This speed was only possible because there is no pipeline of separate models; everything happens in one pass.

### Tokenization Across Modalities

Native multimodal training requires converting all modalities into token sequences that can be interleaved and processed together.

Images are converted to patch tokens using a Vision Transformer (ViT): a 224x224 image with 16x16 patches yields 196 tokens; a 336x336 image yields 576 tokens. Higher-resolution images or multi-crop strategies can produce thousands of tokens per image.

Audio is typically converted to mel-spectrogram representations with 25ms frames, yielding approximately 2,400 tokens per minute of audio. Some approaches use learned audio codecs (like EnCodec) to produce discrete audio tokens.

Video is decomposed into sampled frames, each encoded as image tokens. At 1 frame per second, a 1-hour video produces 3,600 frames, each requiring hundreds of tokens.

### Training Data for Multimodal Models

Native multimodal training demands massive paired and interleaved datasets. Common sources include:

- Image-text pairs: LAION-5B (5 billion pairs), WebLI (10 billion pairs)
- Video-text pairs: WebVid (10 million), HD-VILA (100 million)
- Audio-text pairs: speech transcriptions, podcast descriptions, music captions

A critical challenge is modality imbalance: there is far more text data than image data, and far more image data than video data. Training recipes must carefully balance modality sampling rates to prevent the model from neglecting underrepresented modalities while still leveraging the abundant text data for language quality.

## Why It Matters

Native multimodal training represents a philosophical shift in how we think about AI. Rather than building specialized modules for each modality and connecting them, we train a unified system that perceives the world holistically — closer to how biological intelligence works.

The practical implications are significant. Native multimodal models can perform tasks that adapter models struggle with: understanding diagrams that require reading labels and interpreting spatial relationships simultaneously, following video narratives that depend on both audio dialogue and visual cues, or analyzing documents that interleave text with tables, charts, and images.

The training cost is higher than text-only models, but the per-modality cost can actually be lower than maintaining separate specialized models for each modality. One model that handles everything replaces an entire fleet of specialists.

## Key Technical Details

- **Gemini 1.0 Ultra** (Dec 2023): Native multimodal. Text + image + audio + video. First major native model.
- **Gemini 1.5 Pro** (Feb 2024): 1M token context. Processes 1 hour video, 11 hours audio, 30K lines of code.
- **GPT-4o** (May 2024): Unified text + vision + audio. Sub-300ms voice latency. Single forward pass.
- **Image Tokenization**: ViT-based, 14x14 or 16x16 patches. 336x336 image = 576 tokens.
- **Audio Tokenization**: 25ms mel-spectrogram frames. 1 minute = ~2,400 tokens.
- **Video Tokenization**: Sampled at 1-2 fps. 1 hour at 1 fps = 3,600 frames.
- **Training Data Scale**: LAION-5B (5B image-text pairs), WebLI (10B), large audio-transcript corpora.
- **Typical Modality Mix**: ~60% text, ~25% image, ~10% audio, ~5% video (varies by model).
- **Key Advantage**: Cross-modal representations in every layer, not just at adapter boundaries.

## Common Misconceptions

- **"Adapter-based models are just as good as native multimodal models."** For simple visual QA, adapters are competitive. But for complex cross-modal reasoning — tasks requiring deep integration of visual, textual, and auditory information — native models have a structural advantage that adapters cannot overcome through more data or better adapters alone.

- **"Native multimodal training is prohibitively expensive."** While more expensive than training a text-only model of the same size, the total cost can be lower than training and maintaining separate specialized models for each modality. The engineering simplicity of a single model also reduces deployment and maintenance costs.

- **"Native multimodal means the model processes all modalities equally well."** Even natively trained models tend to be strongest on text (the modality with the most training data) and weakest on video (the scarcest). Modality imbalance in training data creates corresponding capability imbalance.

## Connections to Other Concepts

Native multimodal training builds on the vision-language foundations in `01-vision-language-models.md`. `08-gemini-1.md` and `02-gemini-1-5.md` chronicle Google's native multimodal approach, while `03-gpt-4o.md` covers OpenAI's omni architecture. Audio capabilities are detailed in `03-audio-and-speech-models.md`, and video in `04-video-understanding.md`. The convergence of all modalities is the subject of `05-the-convergence-toward-omni-models.md`. For the attention mechanism enabling cross-modal processing, see `01-attention-is-all-you-need.md` in the `llm-concepts/` collection.

## Further Reading

- Team Gemini, "Gemini: A Family of Highly Capable Multimodal Models" (2023) — Google's native multimodal approach.
- Team Gemini, "Gemini 1.5: Unlocking Multimodal Understanding Across Millions of Tokens of Context" (2024) — long-context multimodal.
- OpenAI, "GPT-4o System Card" (2024) — the omni architecture.
- Alayrac et al., "Flamingo: a Visual Language Model for Few-Shot Learning" (2022) — adapter baseline for comparison.
- Liu et al., "Visual Instruction Tuning" (2023) — LLaVA adapter approach for comparison.
- Driess et al., "PaLM-E: An Embodied Multimodal Language Model" (2023) — multimodal for robotics.
