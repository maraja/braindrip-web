# Multimodal NLP

**One-Line Summary**: Combining language with vision, audio, and other modalities to build systems that perceive and reason across multiple information channels -- from contrastive pre-training (CLIP) to multimodal large language models (GPT-4V, Gemini).

**Prerequisites**: `transfer-learning-in-nlp.md`, `bert.md`, `attention-mechanism.md`, `contextual-embeddings.md`, `sentence-embeddings.md`

## What Is Multimodal NLP?

Imagine describing a photograph to someone who cannot see it. You must translate visual information -- spatial relationships, colors, actions, emotions, context -- into language. Now imagine the reverse: understanding a caption well enough to pick the correct image from thousands of candidates. Humans do this effortlessly because our brains fuse information from multiple sensory channels into a unified understanding. A sentence like "the glass shattered" evokes a sound, a visual image, and the tactile sensation of sharpness simultaneously.

Multimodal NLP extends natural language processing beyond text to incorporate other information channels -- primarily vision (images, video), but also audio, structured data, sensor readings, and more. The core challenge is learning shared representations that capture semantic correspondences across modalities: the word "dog" and a photograph of a dog should be nearby in some representation space, despite originating from entirely different data types.

This is not simply "NLP + computer vision" glued together. Genuine multimodal understanding requires cross-modal reasoning: determining that a sarcastic Instagram caption contradicts the image, that a spoken instruction refers to a specific region in a visual scene, or that a chart and its surrounding text make complementary claims. The field has exploded since 2021, driven by contrastive pre-training (CLIP), generative multimodal models, and the emergence of multimodal large language models.

## How It Works

### Vision-Language Pre-training: CLIP and ALIGN

**CLIP** (Radford et al., 2021, OpenAI) learns a shared embedding space for images and text via contrastive learning. The architecture is simple:

1. An image encoder (ViT-L/14 or ResNet) maps images to vectors.
2. A text encoder (Transformer) maps captions to vectors.
3. Contrastive loss maximizes the cosine similarity of matched (image, caption) pairs while minimizing similarity for mismatched pairs within each batch.

CLIP was trained on 400 million image-text pairs collected from the internet (WIT dataset). The result: a model that performs zero-shot image classification by comparing an image embedding against text embeddings of class descriptions (e.g., "a photo of a dog"). CLIP achieved 76.2% zero-shot accuracy on ImageNet -- competitive with supervised ResNet-50 -- without seeing a single ImageNet training image.

**ALIGN** (Jia et al., 2021, Google) scaled this approach to 1.8 billion noisy image-text pairs with minimal filtering, demonstrating that scale compensates for noise. ALIGN used an EfficientNet image encoder and BERT text encoder, achieving 76.4% zero-shot ImageNet accuracy.

### Multimodal Pre-training Objectives

Beyond contrastive learning, multimodal models use several pre-training objectives:

**Image-Text Matching (ITM)**: Binary classification of whether an image-text pair is matched or mismatched, requiring finer-grained cross-modal understanding than contrastive loss alone.

**Masked Language Modeling with Visual Grounding**: Masking text tokens and predicting them from both surrounding text and the image -- forcing the model to ground language in visual context. Used in ViLBERT, UNITER, and Oscar.

**Image-Text Generation**: Generating captions from images (or images from text), used in models like CoCa (Yu et al., 2022) that combine contrastive and generative objectives.

**Prefix Language Modeling**: Treating the image embedding as a prefix to the text and training the model to generate the caption autoregressively, as in Frozen (Tsimpoukelli et al., 2021) and Flamingo.

### Multimodal Fusion Strategies

How information from different modalities is combined is a fundamental design choice:

**Early Fusion**: Concatenate raw inputs (or early features) from all modalities and process them jointly through a single model. Simple but computationally expensive, as the model must learn cross-modal interactions from scratch. Used in VisualBERT, which concatenates image region features with text tokens and feeds them to a single Transformer.

**Late Fusion**: Process each modality independently through separate encoders, then combine the final representations (e.g., via concatenation, element-wise product, or bilinear pooling). Efficient but limits cross-modal interaction to the final stage. CLIP uses late fusion -- the encoders never attend to each other.

**Cross-Attention Fusion**: Use cross-attention layers where one modality queries the other. Flamingo (Alayrac et al., 2022) inserts cross-attention layers between frozen LLM layers, allowing text generation to attend to visual features. This balances efficiency (modality-specific encoders process most of the computation) with rich cross-modal interaction.

**Mixed Fusion**: Models like BEiT-3 (Wang et al., 2022) use a single shared Transformer backbone with modality-specific experts, allowing early fusion of token sequences while maintaining modality-specific processing paths.

### Multimodal Large Language Models

**Flamingo** (Alayrac et al., 2022, DeepMind): Interleaves frozen visual encoder features into a frozen large language model via cross-attention layers. Trained on interleaved image-text web data, Flamingo achieves strong few-shot performance on VQA, captioning, and visual dialogue by conditioning on a few in-context examples.

**GPT-4V** (OpenAI, 2023): Extends GPT-4 to accept image inputs alongside text. GPT-4V demonstrates remarkable capabilities in visual question answering, chart understanding, OCR, spatial reasoning, and multimodal chain-of-thought. It processes images as visual tokens within the same transformer context as text tokens.

**Gemini** (Google, 2023): Natively multimodal from the ground up, processing interleaved text, images, audio, and video. Gemini Ultra achieved 90.0% on MMMU (Massive Multi-discipline Multimodal Understanding), a benchmark requiring college-level reasoning across subjects.

**LLaVA** (Liu et al., 2023): A cost-effective approach that projects CLIP visual features into the LLaMA token space via a simple linear projection, then fine-tunes on visual instruction data. Despite its simplicity, LLaVA demonstrates that visual instruction tuning on ~150K examples can produce strong multimodal reasoning.

## Why It Matters

1. **Richer understanding**: Real-world information is inherently multimodal. A doctor reads X-rays (vision) alongside patient notes (text); a driver processes road signs (vision + text), spoken navigation (audio), and road conditions simultaneously.
2. **Zero-shot transfer**: CLIP-style models enable classification and retrieval for categories never seen during training, simply by describing them in natural language.
3. **Accessibility**: Multimodal models can describe images for visually impaired users, transcribe and summarize video content, and bridge modality gaps.
4. **Document understanding**: Real documents contain text, layout, tables, figures, and charts -- understanding them requires multimodal reasoning (see `document-understanding.md`).
5. **Creative applications**: Text-to-image generation (DALL-E, Stable Diffusion), video captioning, and multimodal content creation depend on cross-modal understanding.

## Key Technical Details

- CLIP was trained on 400M image-text pairs using a batch size of 32,768 with in-batch negative sampling. The contrastive loss creates 32,768^2 - 32,768 negative pairs per batch.
- CLIP ViT-L/14 achieves 76.2% zero-shot top-1 accuracy on ImageNet; with fine-tuning, this reaches 88.7%.
- Flamingo (80B parameters) achieves 67.6% on VQA v2 with 32-shot in-context learning, competitive with fine-tuned models.
- GPT-4V and Gemini process images as sequences of visual tokens (typically 256--576 tokens per image), integrated into the same context window as text.
- Gemini Ultra scores 90.0% on MMMU, 59.4% on MathVista, demonstrating strong multimodal reasoning. Gemini 1.5 Pro supports 1M token context windows, enabling processing of hour-long videos.
- Training multimodal models at scale requires billions of image-text pairs: CLIP used 400M, ALIGN used 1.8B, PaLI used 10B image-text pairs.

## Common Misconceptions

- **"Multimodal models understand images like humans do."** Current models struggle with spatial reasoning ("is the cup to the left or right of the plate?"), counting, fine-grained attribute binding ("the red cube and the blue sphere" vs. "the blue cube and the red sphere"), and understanding physical causality in images. Benchmarks like Winoground reveal that CLIP performs near chance (25%) on compositional image-text matching.

- **"CLIP understands language deeply."** CLIP's text encoder is relatively shallow compared to dedicated language models. It excels at matching nouns and objects but struggles with negation ("a photo without a dog"), relationships, and compositional language. CLIP is a retrieval model, not a reasoning model.

- **"More modalities always help."** Adding modalities introduces noise when the modalities are not aligned or relevant. Multimodal sentiment analysis, for example, sometimes performs worse than text-only models when audio/visual signals are uninformative or contradictory. Careful fusion design matters more than naively adding channels.

- **"Multimodal LLMs are just image captioning models with better prompting."** Models like GPT-4V and Gemini demonstrate genuine visual reasoning -- following multi-step instructions, reading charts, solving visual puzzles, and explaining spatial relationships -- capabilities far beyond captioning.

## Connections to Other Concepts

- **`visual-question-answering.md`**: VQA is a core multimodal task testing joint vision-language reasoning, serving as a primary evaluation benchmark.
- **`image-captioning.md`**: Captioning is the prototypical vision-to-language generation task, now subsumed by multimodal LLMs.
- **`document-understanding.md`**: Document AI requires multimodal fusion of text, layout, and visual features.
- **`speech-language-models.md`**: The speech-text unification trend parallels vision-language unification -- both point toward universal multimodal models.
- **`bert.md`**: Many early multimodal models (ViLBERT, VisualBERT, UNITER) extended BERT's masked language modeling to the multimodal setting.
- **`gpt-for-nlp-tasks.md`**: Multimodal LLMs extend the GPT paradigm to accept and generate across modalities.
- **`sentence-embeddings.md`**: CLIP's text embeddings serve as powerful sentence-level representations for retrieval and zero-shot classification.

## Further Reading

- Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (2021) -- CLIP: contrastive pre-training of image-text representations that enabled zero-shot visual recognition.
- Alayrac et al., "Flamingo: A Visual Language Model for Few-Shot Learning" (2022) -- Few-shot multimodal learning via cross-attention between frozen vision and language models.
- Li et al., "BLIP-2: Bootstrapping Language-Image Pre-training with Frozen Image Encoders and Large Language Models" (2023) -- Efficient multimodal pre-training bridging frozen vision encoders and LLMs.
- Liu et al., "Visual Instruction Tuning" (2023) -- LLaVA: visual instruction tuning for multimodal LLMs.
- Team Gemini, "Gemini: A Family of Highly Capable Multimodal Models" (2023) -- Google's natively multimodal foundation model.
- Yao et al., "MMMU: A Massive Multi-discipline Multimodal Understanding and Reasoning Benchmark" (2023) -- A challenging benchmark requiring expert-level multimodal reasoning.
