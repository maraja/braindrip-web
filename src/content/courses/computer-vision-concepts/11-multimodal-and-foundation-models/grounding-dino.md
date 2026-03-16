# Grounding DINO

**One-Line Summary**: Grounding DINO combines the DINO detection Transformer with grounded language pretraining to perform open-set object detection, localizing objects in images from arbitrary text descriptions without being limited to predefined categories.

**Prerequisites**: DETR, deformable attention, DINO detector, BERT, cross-attention, object detection, CLIP, open-vocabulary detection

## What Is Grounding DINO?

Imagine showing a photograph to someone and saying "find the wooden chair next to the fireplace." A traditional object detector would only find "chairs" if it was trained with a "chair" label -- and it would ignore the "wooden" and "next to the fireplace" qualifiers entirely. Grounding DINO can take that entire phrase, understand it, and draw a bounding box precisely around the matching object. It grounds language in visual content at the level of spatial localization.

Technically, Grounding DINO is a Transformer-based detector that accepts both an image and a text prompt as inputs, producing bounding boxes for regions that match the text. It extends DINO (DETR with Improved deNoising anchOr boxes) by integrating a text backbone (BERT) alongside the image backbone (Swin Transformer) and fusing their features at multiple stages through cross-modality attention. Published by IDEA Research in 2023, it achieves 52.5 AP on COCO zero-shot -- detecting COCO objects without any COCO training data -- setting a new standard for open-set detection.

## How It Works

### Architecture Overview

Grounding DINO has four main components:

1. **Dual-encoder backbone**: A Swin Transformer (Swin-T or Swin-L) processes the image; a BERT model processes the text prompt. Both produce feature sequences.

2. **Feature enhancer (encoder)**: Cross-modality fusion modules that allow image features and text features to exchange information before detection. This is a key distinction from models that only fuse at the classification head.

3. **Language-guided query selection**: Instead of using random or learned queries (as in vanilla DETR), Grounding DINO selects the top-$N$ queries based on their similarity to the text features. This focuses detection on text-relevant regions.

4. **Cross-modality decoder**: A Transformer decoder that refines bounding boxes using both visual and textual information through cross-attention.

### Feature Enhancer: Deep Fusion

The feature enhancer consists of stacked blocks, each containing:

- **Image self-attention**: Standard deformable self-attention over image tokens
- **Text self-attention**: Standard self-attention over text tokens
- **Image-to-text cross-attention**: Image tokens attend to text tokens

$$\text{Img}' = \text{CrossAttn}(\mathbf{Q}_{\text{img}}, \mathbf{K}_{\text{text}}, \mathbf{V}_{\text{text}}) + \text{Img}$$

- **Text-to-image cross-attention**: Text tokens attend to image tokens

$$\text{Text}' = \text{CrossAttn}(\mathbf{Q}_{\text{text}}, \mathbf{K}_{\text{img}}, \mathbf{V}_{\text{img}}) + \text{Text}$$

This bidirectional fusion occurs multiple times, creating deeply intertwined visual-linguistic representations. In contrast, approaches like OWL-ViT only compare visual and text features at the final classification step.

### Language-Guided Query Selection

Standard DINO uses 900 learnable queries. Grounding DINO replaces this with a selection mechanism:

1. Compute similarity between each position in the image feature map and the text features
2. Select the top-$N$ positions (typically $N = 900$) with highest text-image similarity as initial query positions
3. Use these positions to initialize both the content queries and reference anchor boxes

This ensures the decoder focuses on regions likely to contain objects described by the text, rather than distributing attention uniformly.

### Training Pipeline

Grounding DINO is trained on a mixture of three data types:

1. **Detection data**: Objects365 (365 categories, 1.7M images) and COCO (80 categories, 118K images) -- box annotations with category labels
2. **Grounding data**: GoldG (grounded noun phrases from Flickr30K entities), RefCOCO/RefCOCO+/RefCOCOg (referring expressions)
3. **Image-text pairs**: Cap4M (a subset of CC3M + SBU + VG captions) -- pseudo-labeled with noun phrase extraction and grounding

For detection data, category names are concatenated with separators as the text input: `"cat . dog . car . person ."`. The model learns to associate each text token span with the corresponding boxes.

The total loss combines:

$$\mathcal{L} = \lambda_1 \mathcal{L}_{\text{L1}} + \lambda_2 \mathcal{L}_{\text{GIoU}} + \lambda_3 \mathcal{L}_{\text{contrastive}}$$

where the contrastive loss aligns each predicted box's feature with the corresponding text span, replacing the fixed classification loss of standard detectors.

### Inference

At inference, the user provides:
- An image
- A text prompt: either category names separated by periods (`"cat . dog . person ."`) or a free-form phrase (`"the red car on the left"`)

The model outputs bounding boxes with associated text-similarity scores. A confidence threshold (typically 0.3-0.5) filters predictions.

## Why It Matters

1. **True open-set detection**: Unlike closed-vocabulary detectors limited to training categories, Grounding DINO can detect any object describable in text, including novel compositions and attributes.
2. **State-of-the-art zero-shot performance**: 52.5 AP on COCO without COCO training data surpasses many fully supervised COCO-trained detectors, demonstrating that language grounding provides powerful generalization.
3. **Referring expression grounding**: The same model handles both detection ("find all cats") and grounding ("find the orange tabby on the couch"), unifying two tasks.
4. **Composable with SAM**: Grounding DINO + SAM (Grounded SAM) creates a text-to-mask pipeline: text query produces boxes, boxes prompt SAM to produce masks. This modular composition is a hallmark of the foundation model paradigm.
5. **Robotics and embodied AI**: Language-guided detection is essential for robots that receive natural language instructions ("pick up the blue mug next to the keyboard").

## Key Technical Details

- **COCO zero-shot**: 52.5 AP (Swin-L backbone) without any COCO training data; with COCO fine-tuning: 63.0 AP
- **LVIS zero-shot**: Achieves strong results on rare categories, though exact numbers vary by evaluation protocol
- **Backbone variants**: Swin-T (~172M total parameters, faster) and Swin-L (~341M total parameters, more accurate)
- **Text encoder**: BERT-base (110M parameters) with maximum 256 token input
- **Inference speed**: ~10 FPS on V100 with Swin-L backbone; ~20 FPS with Swin-T
- **Query count**: 900 queries selected per image, matching DINO's default
- **Training data scale**: ~3M detection images + ~800K grounding images + ~4M caption images
- **Text prompt format**: Categories separated by `.` (period); the model tokenizes and matches spans. Maximum ~250 categories per forward pass due to text encoder length limits
- **Grounding DINO 1.5 (2024)**: Scales to 1.8B parameters with improved edge cases and stronger performance on fine-grained detection

## Common Misconceptions

- **"Grounding DINO uses CLIP for text encoding."** It uses BERT, not CLIP. The text features are trained from scratch within the detection framework rather than borrowing from a frozen vision-language model. This allows tighter integration between text and spatial features.

- **"It can only detect noun phrases."** Grounding DINO can ground referring expressions that include attributes, relationships, and context ("the tallest building in the background"). However, performance degrades for highly complex or abstract descriptions.

- **"Zero-shot means it works perfectly on any category."** Performance on fine-grained or domain-specific categories (e.g., "Honda Civic vs Toyota Corolla") is significantly weaker than on common objects. The model generalizes best for categories well-represented in its training data's text distribution.

- **"Grounding DINO replaces supervised detection."** For fixed-vocabulary applications where maximum accuracy matters (e.g., autonomous driving with a known set of road objects), fine-tuned closed-set detectors still achieve higher AP on their specific categories. Grounding DINO's strength is flexibility, not peak per-category accuracy.

- **"The text prompt has no effect on speed."** Longer text prompts increase the cost of cross-attention in the feature enhancer and decoder. Prompts with 50+ categories are noticeably slower than single-category queries.

## Connections to Other Concepts

- `clip.md`: While Grounding DINO uses BERT (not CLIP) for text encoding, it shares CLIP's philosophy of using language to define visual categories. Grounding DINO operates at the region level where CLIP operates at the image level.
- `open-vocabulary-detection.md`: Grounding DINO is a leading open-vocabulary detector, distinguished by its deep fusion architecture versus approaches that only fuse at the classification head.
- `vision-foundation-models.md`: Grounding DINO is a core component in foundation model stacks, especially in the Grounded SAM pipeline for text-guided segmentation.
- `detr.md`: Grounding DINO directly extends the DINO detector architecture, inheriting its deformable attention, denoising training, and anchor box initialization.
- **Image Segmentation (SAM)**: Grounding DINO provides bounding boxes that serve as prompts for SAM, creating a complete text-to-mask system without any mask-level training data for the target categories.

## Further Reading

- Liu et al., "Grounding DINO: Marrying DINO with Grounded Pre-Training for Open-Set Object Detection" (2023) -- The original paper.
- Zhang et al., "DINO: DETR with Improved DeNoising Anchor Boxes for End-to-End Object Detection" (2023) -- The base detector architecture.
- Ren et al., "Grounding DINO 1.5: Advance the 'Edge' of Open-Set Object Detection" (2024) -- Scaled-up successor.
- Kamath et al., "MDETR: Modulated Detection for End-to-End Multi-Modal Understanding" (2021) -- Earlier work on language-modulated detection.
- Kirillov et al., "Segment Anything" (2023) -- SAM, frequently paired with Grounding DINO for the Grounded SAM pipeline.
