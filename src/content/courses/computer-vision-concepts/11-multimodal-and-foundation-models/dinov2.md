# DINOv2

**One-Line Summary**: DINOv2 is a family of self-supervised Vision Transformers trained by Meta with distillation at scale on 142 million curated images, producing visual features that match or surpass supervised pretraining across diverse downstream tasks without fine-tuning.

**Prerequisites**: Vision transformers, self-supervised learning, knowledge distillation, contrastive learning, masked image modeling, linear probing

## What Is DINOv2?

Imagine learning to see by studying 142 million photographs without anyone telling you what is in them -- no labels, no captions, no descriptions. You would develop an intuitive understanding of edges, textures, objects, and scenes purely from visual structure. DINOv2 does exactly this: it trains Vision Transformers using only self-supervised objectives (no labels or text) and produces general-purpose visual features that transfer remarkably well to tasks ranging from classification to depth estimation to semantic segmentation.

Technically, DINOv2 combines the self-distillation approach of DINO (self-DIstillation with NO labels) with masked image modeling (like MAE) and trains at unprecedented scale. The key finding is that with sufficient data curation and training scale, self-supervised vision-only pretraining produces features that are as good as or better than those from supervised or language-supervised (CLIP-style) pretraining -- without needing any human annotation.

## How It Works

### Training Objectives

DINOv2 combines two complementary self-supervised losses:

**1. Self-distillation (DINO/iBOT image-level loss):**
A student network and an exponential moving average (EMA) teacher network process different augmented views of the same image. The student is trained to match the teacher's output distribution:

$$\mathcal{L}_{\text{DINO}} = -\sum_{x \in V_{\text{teacher}}} \sum_{x' \in V_{\text{student}}} P_t(x) \log P_s(x')$$

where $P_t$ and $P_s$ are the softmax-normalized outputs of teacher and student CLS tokens, and $V_{\text{teacher}}$, $V_{\text{student}}$ are sets of global and local crop views. The teacher is updated via EMA: $\theta_t \leftarrow \lambda \theta_t + (1 - \lambda) \theta_s$.

**2. Masked image modeling (iBOT patch-level loss):**
Random patches are masked in the student input. The student must predict the teacher's patch-level representations for the masked positions:

$$\mathcal{L}_{\text{iBOT}} = -\sum_{i \in \mathcal{M}} P_t^{(i)} \log P_s^{(i)}$$

where $\mathcal{M}$ is the set of masked patch indices. This forces the model to learn local feature representations, complementing the global CLS token loss.

The total loss is: $\mathcal{L} = \mathcal{L}_{\text{DINO}} + \lambda_{\text{iBOT}} \mathcal{L}_{\text{iBOT}}$

### Data Curation: LVD-142M

A critical contribution is the curated dataset of 142 million images (LVD-142M):

1. Start with a pool of 1.2 billion uncurated web images
2. Use a pretrained model to compute image embeddings
3. Deduplicate images: remove near-duplicates within and across datasets
4. Rebalance by retrieving images similar to curated datasets (ImageNet, Google Landmarks, etc.) to ensure concept coverage
5. Remove unsafe or irrelevant content

This pipeline produces a dataset that is diverse, balanced, and free of label noise -- without requiring a single human annotation.

### Distillation for Model Scaling

DINOv2 trains a large teacher model (ViT-g/14, 1.1B parameters) and then distills it into smaller student models:

- **ViT-S/14** (21M parameters): distilled from ViT-g
- **ViT-B/14** (86M parameters): distilled from ViT-g
- **ViT-L/14** (300M parameters): distilled from ViT-g
- **ViT-g/14** (1.1B parameters): the teacher model itself

Distillation preserves most of the teacher's performance while dramatically reducing inference cost. The ViT-B/14 distilled model achieves within 1-2 points of the ViT-g teacher on most benchmarks.

### Feature Properties

DINOv2 features exhibit remarkable properties:

- **Patch features are semantically meaningful**: Individual patch tokens correspond to semantic parts (e.g., a dog's ear, a car's wheel) without any supervision
- **PCA of patch features produces segmentation**: The first few principal components of DINOv2 patch features naturally segment objects from backgrounds
- **Features transfer across domains**: Features trained on natural images transfer to satellite imagery, medical images, and microscopy

## Why It Matters

1. **Self-supervised surpasses supervised**: DINOv2 ViT-g achieves 86.3% linear probe accuracy on ImageNet, surpassing supervised ViTs (85.6% for ViT-H/14 supervised), demonstrating that labels are not necessary for learning strong visual representations.
2. **Universal visual backbone**: A single DINOv2 model provides competitive features for classification, segmentation, depth estimation, and retrieval -- no task-specific pretraining needed.
3. **No text dependency**: Unlike CLIP, DINOv2 needs no text data, making it applicable in domains where image-text pairs are unavailable (medical imaging, satellite imagery, scientific microscopy).
4. **Efficient downstream adaptation**: Frozen DINOv2 features with a simple linear head or lightweight decoder match or approach fully fine-tuned task-specific models.

## Key Technical Details

- **ImageNet linear probe**: ViT-g/14: 86.3% top-1; ViT-L/14: 84.5%; ViT-B/14: 82.1%; ViT-S/14: 79.0%
- **Training compute**: ViT-g trained for ~22,000 A100 GPU-hours (roughly 500 A100-days)
- **Resolution**: Pretrained at 518x518 (37x37 patches with patch size 14); supports arbitrary resolutions at inference via interpolated position embeddings
- **Embedding dimensions**: ViT-S: 384; ViT-B: 768; ViT-L: 1024; ViT-g: 1536
- **Depth estimation (NYUv2)**: DINOv2 ViT-g + linear head achieves RMSE of 0.298, competitive with specialized depth models
- **Semantic segmentation (ADE20K)**: DINOv2 ViT-g + linear head achieves 49.0 mIoU; with a simple Transformer decoder, 53.0 mIoU
- **KNN classification**: DINOv2 ViT-g achieves 84.6% on ImageNet with a simple k-nearest neighbor classifier (no training at all)
- **Registers (2024 update)**: DINOv2 with registers adds 4 extra tokens that absorb artifacts in attention maps, improving dense prediction tasks

## Common Misconceptions

- **"Self-supervised learning always produces weaker features than supervised."** DINOv2 conclusively disproved this at sufficient scale. The key ingredients are data curation, training scale, and combining complementary self-supervised objectives.

- **"DINOv2 is just a bigger DINO."** While it inherits the self-distillation framework, DINOv2 adds masked image modeling (iBOT), a curated 142M-image dataset, and systematic distillation -- these are substantive methodological advances, not just scaling.

- **"CLIP is always better because it uses language."** DINOv2 matches CLIP on many benchmarks and significantly outperforms it on dense prediction tasks (segmentation, depth) because its patch-level features are more spatially precise. CLIP is better for tasks requiring text-image alignment; DINOv2 is better for pure visual understanding.

- **"You need to fine-tune DINOv2 for it to work."** Frozen DINOv2 features with a linear probe or KNN classifier are already highly competitive. Fine-tuning helps on specialized domains but is not required for strong baseline performance.

## Connections to Other Concepts

- `clip.md`: CLIP uses language supervision while DINOv2 uses self-supervision only. They are complementary: CLIP excels at text-aligned tasks, DINOv2 at dense visual tasks. Many modern systems (e.g., Depth Anything) use DINOv2 as the visual backbone.
- `vision-transformer.md`: DINOv2 models are all ViTs; the architecture enables the patch-level self-supervision that makes DINOv2 features so transferable.
- `vision-foundation-models.md`: DINOv2 is one of the three pillars (alongside CLIP and SAM) defining the foundation model paradigm in vision.
- **Self-Supervised Learning**: DINOv2 represents the culmination of self-supervised vision research, combining the best ideas from DINO, iBOT, and MAE into a single framework.
- **Image Segmentation**: DINOv2 features enable unsupervised segmentation and serve as strong backbones for supervised segmentation methods.

## Further Reading

- Oquab et al., "DINOv2: Learning Robust Visual Features without Supervision" (2023) -- The DINOv2 paper.
- Caron et al., "Emerging Properties in Self-Supervised Vision Transformers" (DINO, 2021) -- The original DINO self-distillation method.
- Darcet et al., "Vision Transformers Need Registers" (2024) -- Adding register tokens to DINOv2 to fix attention artifacts.
- Zhou et al., "iBOT: Image BERT Pre-Training with Online Tokenizer" (2022) -- Masked image modeling component used in DINOv2.
