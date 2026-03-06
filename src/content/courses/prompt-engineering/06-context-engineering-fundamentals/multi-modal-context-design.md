# Multi-Modal Context Design

**One-Line Summary**: Multi-modal context design integrates images, audio, video, and PDFs alongside text in the context window, managing token costs, placement strategies, and modality-specific formatting to maximize model comprehension across input types.
**Prerequisites**: `what-is-context-engineering.md`, `context-budget-allocation.md`.

## What Is Multi-Modal Context Design?

Think of preparing a presentation with slides, speaker notes, and handouts. Each medium communicates differently: slides convey visual information at a glance, speaker notes provide detailed verbal explanation, and handouts give reference material for later review. A good presentation coordinates all three — the slide shows the chart, the speaker explains the trend, and the handout provides the raw data. Miscoordination (describing a chart that is not visible, or showing data without explanation) creates confusion.

Multi-modal context design applies this coordination principle to LLM inputs. Modern frontier models can process text, images, audio, and video within the same context window. But simply including a screenshot next to a text prompt is not enough — you need to consider token costs, placement ordering, format selection, and how different modalities interact.

Each modality has different token economics, different information density, and different strengths. An image can convey layout, color, spatial relationships, and visual patterns that would take hundreds of words to describe in text. But that image also costs 85-1,600 tokens depending on resolution, and the model might miss fine details that text would capture precisely. Multi-modal context design makes these trade-offs explicit and systematic.

*Recommended visual: A token cost comparison infographic showing different modalities and their token costs: a text block icon ("1 page of text = ~500 tokens"), an image icon at low resolution ("512x512 = 85 tokens"), an image icon at high resolution ("2048x2048 = 2,805 tokens"), a PDF icon ("1 page = 200-400 tokens"), and an audio waveform icon ("60 seconds = ~1,920 tokens"), enabling practitioners to compare costs across modalities at a glance.*
*Source: Adapted from OpenAI Vision documentation (2024), Anthropic Vision documentation (2024), and Google Gemini documentation (2024)*

*Recommended visual: A 2x2 placement strategy matrix with "Task type" on one axis (directed/analytical vs. open-ended/descriptive) and "Placement" on the other (image-first vs. question-first), with each quadrant showing the recommended approach and accuracy impact: "Question-then-image for directed tasks (+5-10% accuracy)" and "Image-then-question for open analysis," plus a "Reference-style" variant for multi-image tasks shown alongside.*
*Source: Adapted from Yang et al., "The Dawn of LMMs: Preliminary Explorations with GPT-4V(ision)" (2023)*

## How It Works

### Image Token Costs and Resolution Strategies

Images are converted to tokens using provider-specific methods. The cost varies dramatically with resolution:

**OpenAI (GPT-4 Vision)**:
- Low resolution (512x512 fixed): 85 tokens regardless of original size.
- High resolution: Image is divided into 512x512 tiles. Each tile costs 170 tokens, plus a base of 85. A 1024x1024 image = 4 tiles = 765 tokens. A 2048x2048 image = 16 tiles = 2,805 tokens.

**Anthropic (Claude Vision)**:
- Token cost scales with image size. Typical range: 200-1,600 tokens per image depending on dimensions.
- Recommended maximum: 1568 pixels on the longest side for optimal cost-quality balance.

**Google (Gemini)**:
- Images cost approximately 258 tokens per image at standard resolution.
- Video is processed as sampled frames, costing approximately 258 tokens per frame.

**Resolution strategy**: Use the lowest resolution that preserves the information you need. For text extraction from screenshots, high resolution is necessary. For general scene understanding ("is this a cat?"), low resolution suffices. Downscale images before sending when high resolution is not needed.

### Placement Strategies

Where images appear relative to text in the context affects how the model interprets them:

**Image-then-question**: Place the image first, followed by the text question. This mirrors how humans look at a picture and then read a question about it. Best for analytical tasks: "Describe what you see in this chart."

**Question-then-image**: Place the text question first, followed by the image. This primes the model to look for specific information. Best for directed tasks: "What is the revenue for Q3?" followed by the chart image.

**Interleaved**: Place images inline with text, creating a document-like flow. Best for tasks involving multiple images with per-image questions or instructions.

**Reference-style**: Place all images at the beginning with labels ("Image A: screenshot of homepage"), then reference them in subsequent text instructions ("Analyze the navigation structure shown in Image A"). Best for complex multi-image tasks.

### Interleaving Modalities

When a task involves multiple modalities, the interleaving strategy matters:

**Sequential grouping**: All text first, then all images, then all audio. Simple but loses the natural relationship between content.

**Contextual interleaving**: Place each image adjacent to the text that discusses it. A product description followed by the product photo, then the next description with its photo. This maintains semantic associations.

**Redundant reinforcement**: Provide both the image and a text description of the same content. The image captures visual information; the text captures precise details the model might miss. This is the most expensive approach but the most reliable for critical tasks.

### Text Descriptions as Fallback

When image processing is too expensive, unavailable, or unreliable for specific details, text descriptions serve as a cost-effective fallback:

**When to use text instead of images**:
- The image primarily contains text (use OCR + text instead).
- You need precise numerical values from charts (describe the data instead).
- The image is low quality or low contrast.
- Token budget is tight and the visual information can be summarized in fewer tokens as text.

**When images are irreplaceable**:
- Layout and spatial relationships matter (UI design, architecture).
- Color, pattern, or texture is relevant (design review, medical imaging).
- The content is inherently visual (photographs, diagrams, maps).
- Describing the image would take more tokens than including it.

### Provider Differences

Multi-modal capabilities differ significantly across providers:

| Capability | OpenAI (GPT-4o) | Anthropic (Claude 3.5) | Google (Gemini 1.5) |
|-----------|-----------------|----------------------|---------------------|
| Images | Yes | Yes | Yes |
| PDFs | Yes (as images) | Yes (native) | Yes (native) |
| Audio | Yes (native) | No | Yes (native) |
| Video | No | No | Yes (native) |
| Multiple images | Up to 20 | Up to 20 | Up to 3,600 frames |
| Max image size | 20MB | 5MB per image | 20MB |

These capabilities evolve rapidly — verify current provider documentation before designing your system.

## Why It Matters

### Richer Information Input

Some information is fundamentally visual — a screenshot, a chart, a photograph, a diagram. Text-only LLM applications must either exclude this information (losing fidelity) or describe it in text (expensive and lossy). Multi-modal context enables the model to process information in its natural form.

### Reduced Preprocessing Overhead

Before multi-modal models, processing an image required an OCR pipeline, a description generator, or manual annotation. Multi-modal context allows direct image input, eliminating entire preprocessing stages and their associated errors.

### New Application Categories

Multi-modal context enables applications that were impossible with text-only models: visual QA over screenshots, document understanding from scanned PDFs, UI analysis from mockups, medical image interpretation, and video content analysis. These applications serve industries and use cases that text-only models cannot address.

## Key Technical Details

- **Image token costs range from 85 to 2,805 tokens** per image depending on resolution and provider, making resolution selection a critical budget decision.
- **Low resolution (512x512) at 85 tokens** is sufficient for scene understanding and general visual questions; high resolution is needed for text extraction and fine detail analysis.
- **PDF processing costs approximately 200-400 tokens per page** with native PDF support (Anthropic, Google), less than converting to images.
- **Placing the question before the image** improves directed task accuracy by 5-10% compared to image-first placement, because the model knows what to look for.
- **Redundant reinforcement** (image + text description) improves accuracy by 10-15% on detail-critical tasks at the cost of roughly doubling the token usage.
- **Multiple images in a single context** are supported (up to 20 for OpenAI/Anthropic), but accuracy per image decreases with the number of images due to attention dilution.
- **Audio tokens** (where supported) cost approximately 32 tokens per second of audio, making a 60-second clip about 1,920 tokens.

## Common Misconceptions

- **"Images are free to include — just add them."** Images carry significant token costs, especially at high resolution. A single high-resolution image can cost 1,600+ tokens — equivalent to a full page of text. Budget image tokens explicitly.
- **"The model sees images exactly as humans do."** Models process images through a vision encoder that may miss fine text, small details, or subtle color differences that humans notice immediately. For precise information, combine images with text descriptions.
- **"Multi-modal is always better than text-only."** For tasks where the relevant information can be fully captured in text (structured data, code, numerical analysis), adding images provides no benefit and wastes tokens. Use images when they carry information that text cannot efficiently represent.
- **"All providers handle multi-modal input the same way."** Token costs, supported modalities, maximum image counts, and processing quality differ significantly across providers. Design for your specific provider's capabilities.
- **"Video input means the model watches the entire video."** Video is processed as sampled frames (typically 1 frame per second), not as continuous motion. The model sees a sequence of images, not video. Fast motion, transitions, and temporal details between frames are lost.

## Connections to Other Concepts

- `what-is-context-engineering.md` — Multi-modal context design extends context engineering principles to non-text modalities.
- `context-budget-allocation.md` — Image and audio tokens must be budgeted alongside text tokens, with explicit allocation for multi-modal content.
- `context-compression-techniques.md` — Resolution reduction and text-description fallback are compression techniques for visual content.
- `long-context-design-patterns.md` — Multi-modal content in long contexts requires the same organizational patterns (section markers, ordering) as text-only content.
- `information-priority-and-ordering.md` — Image placement relative to text questions affects comprehension, following the same attention principles as text ordering.

## Further Reading

- OpenAI, "Vision" documentation (2024) — Official guide to image input, token costs, and resolution strategies for GPT-4 Vision.
- Anthropic, "Vision" documentation (2024) — Claude's multi-modal capabilities, image sizing recommendations, and best practices.
- Google, "Gemini 1.5 Pro: Long-Context Multimodal Models" (2024) — Technical report on Gemini's multi-modal context handling across text, images, audio, and video.
- Yang et al., "The Dawn of LMMs: Preliminary Explorations with GPT-4V(ision)" (2023) — Comprehensive evaluation of multi-modal model capabilities and limitations across diverse visual tasks.
