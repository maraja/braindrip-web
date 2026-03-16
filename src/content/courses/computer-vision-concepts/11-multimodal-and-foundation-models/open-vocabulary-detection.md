# Open-Vocabulary Detection

**One-Line Summary**: Open-vocabulary detection extends object detection beyond fixed label sets by conditioning on arbitrary text queries, enabling detection of any object category described in natural language.

**Prerequisites**: Object detection, anchor-based and anchor-free detectors, CLIP, region proposals, vision transformers, transfer learning

## What Is Open-Vocabulary Detection?

Traditional object detectors are like customs officers who only know a fixed list of items to look for -- if something is not on the list, it passes through unnoticed. Open-vocabulary detection (OVD) replaces that fixed checklist with a language-based interface: you describe what you want to find in words, and the detector locates it. This means a single model can detect "a golden retriever wearing a red bandana" without ever being trained on that specific combination.

Technically, OVD replaces the fixed classification head of a detector (a linear layer mapping region features to $C$ class logits) with a similarity computation between region features and text embeddings. The detector proposes regions, encodes them visually, and then scores each region against text embeddings of the target categories using cosine similarity or a learned projection. This architecture leverages the open-ended nature of language to generalize beyond training categories.

## How It Works

### Core Architecture Pattern

Most OVD methods share a three-stage pipeline:

1. **Region proposal**: Generate class-agnostic bounding box candidates (RPN, deformable attention, or anchor-free heads)
2. **Region encoding**: Extract visual features for each proposed region
3. **Text-conditioned classification**: Score each region against text embeddings instead of a fixed classifier

The classification score for region $r$ against text category $t$ is:

$$\text{score}(r, t) = \sigma\left(\frac{\mathbf{v}_r \cdot \mathbf{t}}{\|\mathbf{v}_r\| \|\mathbf{t}\|} \cdot \tau\right)$$

where $\mathbf{v}_r$ is the visual region embedding, $\mathbf{t}$ is the text embedding, and $\tau$ is a temperature parameter.

### OWL-ViT (Google, 2022)

OWL-ViT (Vision Transformer for Open-World Localization) takes a direct approach:

- Starts from a pretrained CLIP ViT-L/14 model
- Removes CLIP's token pooling and attaches a lightweight detection head to per-patch token outputs
- Each patch token predicts a bounding box (4 coordinates) and an objectness score
- Classification is performed via dot product between patch features and text embeddings
- Trained on a mix of detection data (Objects365, Visual Genome) and image-text pairs

OWL-ViT achieves 34.6 AP on LVIS rare categories in zero-shot transfer, where categories have fewer than 10 training examples.

### OWL-ViTv2 (2023)

The successor introduces self-training at scale:

- Uses OWL-ViT to generate pseudo-labels on web images
- Trains a student model on the combination of human-annotated and pseudo-labeled data
- Achieves 44.6 AP on LVIS in zero-shot evaluation, a 10-point improvement
- Scales to detecting over 10,000 object categories

### Grounding DINO (2023)

Grounding DINO fuses language and vision at multiple stages within the detector rather than only at the classification head:

- Combines DINO (a DETR-based detector) with grounded pretraining
- Uses a text backbone (BERT) in parallel with an image backbone (Swin Transformer)
- Cross-modality fusion occurs in both the encoder and decoder via feature enhancer layers
- Achieves 52.5 AP on COCO zero-shot (without COCO training data)
- See the dedicated Grounding DINO concept file for full details.

### YOLO-World (2024)

Brings open-vocabulary capability to real-time detection:

- Builds on YOLOv8 with a Re-parameterizable Vision-Language Path Aggregation Network (RepVL-PAN)
- Pre-encodes text embeddings offline so inference requires only the vision branch
- Achieves 35.4 AP on LVIS zero-shot at 52 FPS on V100 -- the first real-time OVD model

## Why It Matters

1. **Eliminates dataset-specific training**: A single OVD model can replace dozens of specialized detectors, each trained on different label sets.
2. **Enables interactive detection**: Users can specify what to find at inference time, enabling applications like visual search ("find all fire extinguishers in this building") without retraining.
3. **Handles rare and novel categories**: Long-tail objects that lack training data can still be detected through language descriptions.
4. **Bridges perception and language**: OVD models serve as the visual grounding backbone for multimodal LLMs, robotics, and embodied AI systems.

## Key Technical Details

- **LVIS benchmark**: The standard evaluation uses LVIS (1,203 categories) split into frequent, common, and rare; OVD models are evaluated primarily on rare categories in zero-shot settings
- **Base-to-novel generalization**: Models trained on COCO base categories (48 classes) are evaluated on novel categories (17 classes); top models reach ~60 AP on novel categories
- **Prompt engineering**: Detection accuracy is sensitive to text prompts; "a photo of a {class}" works worse than category-specific descriptions for rare objects
- **Inference speed**: OWL-ViT runs at ~5 FPS; Grounding DINO at ~10 FPS; YOLO-World at ~52 FPS (all on V100)
- **Training data mix**: Best results combine detection-annotated data (Objects365, COCO), grounding data (GoldG, RefCOCO), and image-text pairs (CC3M, SBU)
- **Region-text alignment**: Distilling CLIP embeddings into region features (as in ViLD) remains a strong baseline, but end-to-end methods now dominate

## Common Misconceptions

- **"Open-vocabulary detection can find anything."** Performance degrades significantly for fine-grained distinctions (e.g., bird species), abstract concepts, and categories poorly represented in the pretraining text. It excels at common-noun object categories.

- **"You need detection annotations for all categories."** The key insight is that you need detection annotations for proposal generation (class-agnostic) but not for classification. The text encoder generalizes classification to unseen categories.

- **"Open-vocabulary and zero-shot detection are the same thing."** Zero-shot detection means no training examples for test categories. Open-vocabulary is broader -- it means the label set is defined by text at inference time, which may or may not include training categories.

- **"OVD models are too slow for production."** YOLO-World demonstrated real-time OVD at 52 FPS, and offline text encoding eliminates language model overhead at inference time.

## Connections to Other Concepts

- `clip.md`: Provides the pretrained vision-language embeddings that most OVD methods build upon.
- `grounding-dino.md`: A leading OVD architecture that deeply fuses language and vision within the detection pipeline.
- `3d-object-detection.md`: OVD extends classical detection by replacing fixed classifiers with language-conditioned scoring.
- `zero-shot-classification.md`: OVD applies the same principle (text as class prototype) at the region level rather than the image level.
- `vision-foundation-models.md`: OVD models like Grounding DINO are becoming standard perception modules in foundation-model stacks.

## Further Reading

- Minderer et al., "Simple Open-Vocabulary Object Detection with Vision Transformers" (2022) -- OWL-ViT paper.
- Minderer et al., "Scaling Open-Vocabulary Object Detection" (2023) -- OWL-ViTv2 with self-training.
- Liu et al., "Grounding DINO: Marrying DINO with Grounded Pre-Training for Open-Set Object Detection" (2023) -- Grounding DINO paper.
- Cheng et al., "YOLO-World: Real-Time Open-Vocabulary Object Detection" (2024) -- First real-time OVD system.
- Gu et al., "Open-Vocabulary Object Detection via Vision and Language Knowledge Distillation" (2022) -- ViLD, influential distillation approach.
