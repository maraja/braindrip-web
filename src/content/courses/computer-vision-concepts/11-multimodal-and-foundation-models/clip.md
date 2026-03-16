# CLIP (Contrastive Language-Image Pretraining)

**One-Line Summary**: CLIP learns a shared embedding space for images and text by training on 400 million image-text pairs with a contrastive objective, enabling zero-shot visual recognition without task-specific fine-tuning.

**Prerequisites**: Contrastive learning, vision transformers, transfer learning, embedding spaces, cosine similarity

## What Is CLIP?

Imagine a bilingual translator who has read 400 million photo captions in two languages -- images and English. After enough exposure, the translator can look at any new photo and immediately describe it in English, or hear a description and pick the matching photo from a lineup. CLIP works the same way: it learns to align visual and textual representations so tightly that you can perform image classification simply by comparing an image embedding against text embeddings of candidate class names.

Technically, CLIP consists of two encoders -- one for images (either a ResNet or Vision Transformer) and one for text (a Transformer) -- trained jointly so that matching image-text pairs have high cosine similarity while non-matching pairs are pushed apart. Published by OpenAI in January 2021, CLIP demonstrated that natural language supervision at web scale could rival or exceed task-specific supervised models on dozens of benchmarks without ever seeing a single labeled example from those datasets.

## How It Works

### Architecture

CLIP uses two parallel encoders:

- **Image encoder**: Either a modified ResNet (ResNet-50, ResNet-50x4, ResNet-50x16, ResNet-50x64) or a Vision Transformer (ViT-B/32, ViT-B/16, ViT-L/14). The best-performing variant uses ViT-L/14 at 336px resolution.
- **Text encoder**: A 12-layer, 512-wide Transformer with 63M parameters and a vocabulary of 49,152 BPE tokens. Maximum context length is 76 tokens.

Both encoders project their outputs into a shared embedding space of dimension $d = 512$ (or 768 for larger variants) via learned linear projections.

### Contrastive Training Objective

Given a batch of $N$ image-text pairs, CLIP computes an $N \times N$ matrix of cosine similarities:

$$s_{ij} = \frac{\mathbf{I}_i \cdot \mathbf{T}_j}{\|\mathbf{I}_i\| \|\mathbf{T}_j\|} \cdot \exp(\tau)$$

where $\mathbf{I}_i$ and $\mathbf{T}_j$ are the normalized embeddings and $\tau$ is a learned temperature parameter (initialized to 0.07). The loss is a symmetric cross-entropy over the similarity matrix:

$$\mathcal{L} = \frac{1}{2}\left(\text{CE}(\mathbf{S}, \text{labels}_{\text{row}}) + \text{CE}(\mathbf{S}^T, \text{labels}_{\text{col}})\right)$$

where the labels are simply the diagonal (each image matches its own caption). Training uses batches of 32,768 pairs across 256 GPUs.

### Zero-Shot Inference

At test time, classification requires no retraining:

1. Encode each class name as text: `"a photo of a {class}"`
2. Encode the query image
3. Compute cosine similarity between the image and all class text embeddings
4. Predict the class with highest similarity

Prompt engineering matters significantly. Using templates like `"a photo of a {class}, a type of pet"` improved ImageNet accuracy by ~5 percentage points over naive prompts. Ensembling 80 different prompt templates yields further gains.

### Training Data: WIT

CLIP was trained on WebImageText (WIT), a proprietary dataset of 400 million image-text pairs collected from the internet. The dataset was filtered but not manually curated, covering an enormous breadth of visual concepts and language descriptions.

## Why It Matters

1. **Zero-shot transfer eliminates labeling**: CLIP matches a supervised ResNet-50 on ImageNet (76.2% top-1) without seeing a single ImageNet training image, fundamentally challenging the supervised learning paradigm.
2. **Robustness to distribution shift**: CLIP shows dramatically better performance on ImageNet variants (ImageNet-V2, ImageNet-Sketch, ImageNet-A, ImageNet-R) compared to models trained directly on ImageNet, suggesting language supervision encourages more generalizable features.
3. **Foundation for downstream systems**: CLIP embeddings power DALL-E 2's image generation, open-vocabulary detection (OWL-ViT), image search engines, and content moderation systems.
4. **Democratized multimodal AI**: Open-source reimplementations (OpenCLIP) trained on LAION-5B have matched or exceeded the original, enabling broad community adoption.

## Key Technical Details

- **Training compute**: The largest model (ViT-L/14@336px) required ~12 days on 256 V100 GPUs, roughly 3,500 GPU-days
- **ImageNet zero-shot accuracy**: 76.2% top-1 (ViT-L/14@336px), matching a fully supervised ResNet-50
- **Linear probe accuracy**: 85.4% on ImageNet, competitive with state-of-the-art fine-tuned models at the time
- **Embedding dimension**: 512 (ViT-B) or 768 (ViT-L)
- **Batch size**: 32,768 -- critical for contrastive learning to work at scale
- **Temperature parameter**: Learned, initialized at $\tau = 0.07$; controls the sharpness of the similarity distribution
- **OpenCLIP ViT-G/14** trained on LAION-2B achieves 80.1% zero-shot ImageNet top-1

## Common Misconceptions

- **"CLIP understands images like humans do."** CLIP matches text-image patterns statistically. It fails on systematic compositional reasoning (e.g., distinguishing "a red cube on a blue sphere" from "a blue cube on a red sphere") and struggles with counting, spatial relations, and negation.

- **"CLIP is only useful for classification."** The shared embedding space enables retrieval, generation guidance, open-vocabulary detection, image-text matching, and content filtering -- classification is just the simplest application.

- **"Bigger datasets always help CLIP."** Quality and diversity of image-text pairs matter as much as scale. Noisy web-crawled pairs with generic alt-text provide diminishing returns compared to descriptive captions. LAION-5B vs. LAION-400M showed sublinear scaling.

- **"Zero-shot means no human design choices."** Prompt engineering (template selection, ensembling) is a form of task-specific tuning that can swing accuracy by 5-10 percentage points.

## Connections to Other Concepts

- `zero-shot-classification.md`: CLIP is the canonical method for zero-shot visual classification via language-vision alignment.
- `open-vocabulary-detection.md`: Models like OWL-ViT and Grounding DINO build on CLIP embeddings to detect arbitrary objects specified by text.
- `text-to-image-generation.md`: DALL-E 2 and Stable Diffusion use CLIP embeddings to guide image synthesis.
- `vision-transformer.md`: CLIP's best image encoder is a ViT, demonstrating the architecture's strength as a general visual backbone.
- **Contrastive Learning**: CLIP extends self-supervised contrastive frameworks (SimCLR, MoCo) by replacing augmentation-based positive pairs with language-based semantic pairs.

## Further Reading

- Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (2021) -- The original CLIP paper.
- Cherti et al., "Reproducible Scaling Laws for Contrastive Language-Image Learning" (2023) -- OpenCLIP scaling analysis on LAION.
- Yuksekgonul et al., "When and Why Vision-Language Models Behave like Bags-of-Words" (2023) -- Systematic analysis of CLIP's compositional failures.
- Ilharco et al., "OpenCLIP" (2021) -- Open-source reproduction enabling community research.
