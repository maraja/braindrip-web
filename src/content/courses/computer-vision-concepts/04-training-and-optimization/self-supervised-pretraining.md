# Self-Supervised Pretraining

**One-Line Summary**: Self-supervised pretraining learns visual representations from unlabeled images by solving pretext tasks -- such as predicting masked patches or matching augmented views -- producing features that rival or exceed supervised ImageNet pretraining.

**Prerequisites**: Contrastive loss, data augmentation, encoder architectures (ResNet, ViT), transfer learning, cosine similarity

## What Is Self-Supervised Pretraining?

Imagine a child learning about the physical world before they know any words. They pick up objects, notice that a ball looks the same from different angles, and discover that dropping things makes them fall. Without anyone labeling anything, they build a rich internal model of how the world works. Self-supervised pretraining does the same for vision models: it creates a learning signal from the structure of the data itself -- no human annotations required.

The key insight is that images contain massive redundancy. If you mask part of an image, a good representation should predict the missing piece. If you show two different crops of the same image, a good representation should recognize them as the same scene. These self-generated tasks, called pretext tasks, force the network to learn features that capture the semantic content of images.

## How It Works

### Contrastive Learning

Contrastive methods learn by pulling together representations of different views of the same image (positive pairs) and pushing apart representations of different images (negative pairs).

**SimCLR** (Chen et al., 2020): For each image in a batch of $N$, create two augmented views. The model maps each view through an encoder $f$ and a projection head $g$. The InfoNCE loss for a positive pair $(i, j)$ is:

$$\mathcal{L}_{i,j} = -\log \frac{\exp(\text{sim}(z_i, z_j) / \tau)}{\sum_{k=1}^{2N} \mathbf{1}_{k \neq i} \exp(\text{sim}(z_i, z_k) / \tau)}$$

where $\text{sim}(u, v) = u^T v / (\|u\| \|v\|)$ is cosine similarity and $\tau = 0.07$ is a temperature parameter. SimCLR requires large batch sizes (4096-8192) to provide enough negatives.

**MoCo** (He et al., 2020): Maintains a momentum-updated queue of negative representations, decoupling the negative set size from the batch size. The momentum encoder is updated as:

$$\theta_k \leftarrow m \cdot \theta_k + (1 - m) \cdot \theta_q$$

where $m = 0.999$ and $\theta_q$ is the query encoder updated by backpropagation. MoCo v2 combined MoCo's queue mechanism with SimCLR's stronger augmentation and projection head, achieving 71.1% top-1 on ImageNet with linear probing on a ResNet-50.

### Non-Contrastive Methods

These methods avoid the need for negative pairs entirely, preventing the representation from collapsing to a constant through architectural or algorithmic design.

**BYOL** (Grill et al., 2020): Uses an online network and a target network (momentum-updated). The online network additionally has a predictor head. The loss is a simple mean squared error between the normalized predictions and targets:

$$\mathcal{L} = 2 - 2 \cdot \frac{\langle q_\theta(z_\theta), z_\xi \rangle}{\|q_\theta(z_\theta)\| \cdot \|z_\xi\|}$$

BYOL avoids collapse because the predictor must anticipate the target network's representation, which is a moving target due to the momentum update. It achieved 74.3% top-1 linear probing accuracy.

**DINO** (Caron et al., 2021): Self-distillation with no labels. A student network learns to match the output of a momentum-updated teacher. Applied centering and sharpening to the teacher output to prevent collapse. Demonstrated that self-supervised ViTs learn features containing explicit object segmentation information, visible directly in the attention maps.

### Masked Image Modeling

Inspired by BERT's masked language modeling, these methods mask portions of the input image and train the model to reconstruct them.

**MAE** (He et al., 2022): Masks 75% of image patches and trains a ViT encoder-decoder to reconstruct the raw pixels of the masked patches. The high masking ratio is critical -- it forces the encoder to learn semantic features rather than relying on low-level interpolation.

```
Input: [P1][P2][P3][P4][P5][P6][P7][P8][P9]
Mask:  [P1][ ][ ][P4][ ][ ][ ][P8][ ]      (75% masked)
Encoder processes only visible patches (25%) -> fast training
Decoder reconstructs all patches from encoded visible + mask tokens
Loss: MSE on masked patches only
```

MAE achieves 87.8% top-1 on ImageNet with ViT-H after fine-tuning, and pretrains 3.5x faster than supervised training because the encoder only processes 25% of patches.

**BEiT** (Bao et al., 2022): Instead of reconstructing raw pixels, predicts discrete visual tokens from a pretrained tokenizer (dVAE), analogous to predicting word tokens in BERT.

### Augmentation Strategy Matters

For contrastive methods, the augmentation pipeline is the learning signal. SimCLR found that random cropping combined with color jitter was essential -- removing either degraded performance by 5-10%. The augmentations must be strong enough to create a non-trivial task but not so strong as to destroy the semantic content.

## Why It Matters

1. Self-supervised pretraining eliminates the need for the 14M human-annotated labels in ImageNet, enabling pretraining on arbitrarily large unlabeled datasets.
2. MAE with ViT-H achieves 87.8% top-1 on ImageNet, surpassing the best supervised-only training on the same architecture.
3. Self-supervised features often transfer better than supervised features to domains far from ImageNet (medical imaging, satellite imagery, scientific images).
4. DINO's self-supervised ViT features produce attention maps that segment objects without any segmentation training, suggesting deeper semantic understanding than supervised features.
5. These methods scale favorably with data: unlike supervised learning, performance does not plateau when adding more unlabeled images.

## Key Technical Details

- Linear probing protocol: freeze the pretrained backbone, train only a linear classifier on ImageNet labels. This measures the quality of the learned representation in isolation.
- SimCLR with ResNet-50: 69.3% top-1 linear probing (batch size 4096, 800 epochs).
- MoCo v2 with ResNet-50: 71.1% top-1 linear probing (batch size 256, 800 epochs).
- BYOL with ResNet-50: 74.3% top-1 linear probing (batch size 4096, 1000 epochs).
- MAE with ViT-L: 75.8% top-1 linear probing, 85.9% after fine-tuning (1600 epochs pretraining).
- Pretraining is computationally expensive: SimCLR and MoCo require 200-1000 epochs on ImageNet, but the resulting features amortize across many downstream tasks.
- For contrastive methods, the projection head (typically 2-3 layer MLP) is discarded after pretraining -- only the encoder is kept.
- Momentum coefficient for MoCo/BYOL: 0.996-0.999 with cosine schedule increasing toward 1.

## Common Misconceptions

- **"Self-supervised learning always beats supervised pretraining."** For tasks closely aligned with ImageNet (natural image classification), supervised pretraining can still be competitive, especially with smaller models. The advantage of self-supervised methods grows with model size and data diversity.
- **"You need millions of images for self-supervised pretraining."** While more data helps, methods like MAE can pretrain effectively on ImageNet-1k (1.28M images) and still outperform supervised training. Domain-specific pretraining on 10-50k images can also be beneficial.
- **"All self-supervised methods need large batch sizes."** MoCo and MAE work with standard batch sizes (256). The large batch requirement is specific to SimCLR and certain contrastive methods.
- **"The pretext task quality directly determines downstream task quality."** The relationship is indirect. Better reconstruction does not always mean better representations. What matters is whether the pretext task forces the encoder to learn semantic features.

## Connections to Other Concepts

- **Data Augmentation**: The augmentation policy IS the learning signal in contrastive methods. Strong augmentation (random crop + color jitter) is essential.
- **Transfer Learning**: Self-supervised pretraining provides an alternative to supervised pretraining. The resulting model is fine-tuned identically.
- **Knowledge Distillation**: DINO is fundamentally a self-distillation method with a momentum teacher. BYOL also uses a teacher-student paradigm.
- **Batch Normalization**: SimCLR originally used BN, which leaked information across the batch (one image could deduce its pair through shared BN statistics). MoCo resolved this with shuffle BN across GPUs.

## Further Reading

- Chen et al., "A Simple Framework for Contrastive Learning of Visual Representations" (2020) -- SimCLR: contrastive learning with large batches.
- He et al., "Momentum Contrast for Unsupervised Visual Representation Learning" (2020) -- MoCo: queue-based contrastive learning.
- Grill et al., "Bootstrap Your Own Latent: A New Approach to Self-Supervised Learning" (2020) -- BYOL: non-contrastive learning without negatives.
- He et al., "Masked Autoencoders Are Scalable Self-Supervised Learners" (2022) -- MAE: masked image modeling with ViTs.
- Caron et al., "Emerging Properties in Self-Supervised Vision Transformers" (2021) -- DINO: self-distillation producing semantically meaningful attention maps.
- Oquab et al., "DINOv2: Learning Robust Visual Features without Supervision" (2024) -- Scaled self-supervised training to produce general-purpose visual features.
