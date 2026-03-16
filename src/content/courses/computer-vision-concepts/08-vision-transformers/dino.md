# DINO (Self-Distillation with No Labels)

**One-Line Summary**: DINO trains a Vision Transformer through self-distillation -- a student network learns to match the output of a momentum-updated teacher network on different augmented views of the same image -- producing features that exhibit emergent object segmentation without any labels.

**Prerequisites**: Vision Transformer (ViT), self-supervised learning, knowledge distillation, exponential moving average, data augmentation

## What Is DINO?

Imagine an apprentice painter studying a master's technique by observing how the master depicts the same scene from different angles and under different lighting. The apprentice never receives explicit instruction about what objects are in the scene -- just the master's consistent interpretations. Over time, the apprentice internalizes a deep understanding of the scene's structure. DINO works similarly: a student network learns to match a teacher's representations of different crops of the same image. The teacher is simply a smoothed version of the student itself, updated via exponential moving average. No labels are ever used.

DINO (Self-**Di**stillation with **No** Labels) was introduced by Caron et al. (2021) at Facebook AI Research. Its most striking result is that the self-attention maps of a DINO-trained ViT spontaneously learn to segment objects -- attending precisely to foreground objects without any segmentation supervision. This emergent property demonstrated that self-supervised ViTs learn fundamentally richer representations than previously understood.

## How It Works

### Student-Teacher Framework

Both the student $f_{\theta_s}$ and teacher $f_{\theta_t}$ share the same ViT architecture. Given an image, two global crops and several local crops are generated:

- **Global crops**: Two crops covering 50-100% of the image, resized to $224 \times 224$
- **Local crops**: Multiple (typically 6-8) smaller crops covering 5-50% of the image, resized to $96 \times 96$

The teacher processes only the global crops. The student processes all crops (both global and local). This asymmetry encourages the student to learn from partial views what the teacher sees in the full view -- a form of "local-to-global correspondence."

### Loss Function

Both networks produce probability distributions over $K$ dimensions (typically $K = 65536$) using a projection head with a softmax:

$$P_s(x)^{(i)} = \frac{\exp(g_{\theta_s}(x)^{(i)} / \tau_s)}{\sum_k \exp(g_{\theta_s}(x)^{(k)} / \tau_s)}$$

The loss minimizes the cross-entropy between teacher and student outputs across all crop pairs where the teacher sees a different view than the student:

$$\mathcal{L} = \sum_{x \in \{x_1^g, x_2^g\}} \;\sum_{\substack{x' \in V \\ x' \neq x}} -P_t(x) \log P_s(x')$$

where $V$ is the set of all crops, and the teacher outputs $P_t$ use a lower (sharper) temperature $\tau_t = 0.04$ versus $\tau_s = 0.1$ for the student.

### Teacher Update via EMA

The teacher parameters are not trained by gradient descent. Instead, they are an exponential moving average of the student:

$$\theta_t \leftarrow \lambda\,\theta_t + (1 - \lambda)\,\theta_s$$

The momentum coefficient $\lambda$ follows a cosine schedule from $0.996$ to $1.0$ during training. This makes the teacher a slowly evolving, more stable version of the student.

### Centering to Avoid Collapse

Without precaution, both networks could collapse to outputting the same constant vector for all inputs. DINO prevents this with **centering**: the teacher's output is adjusted by subtracting a running mean:

$$g_t(x) \leftarrow g_t(x) - \mathbf{c}, \quad \mathbf{c} \leftarrow m\,\mathbf{c} + (1 - m)\,\bar{g}_t$$

where $\bar{g}_t$ is the mean teacher output over the batch and $m = 0.9$ is the centering momentum. This simple operation, combined with sharpening (low teacher temperature), is sufficient to prevent collapse -- no contrastive negatives, no predictor network, no batch normalization in the projection head.

### Emergent Segmentation

When visualizing the self-attention maps of the $[\texttt{CLS}]$ token in the last layer, DINO-trained ViTs produce attention maps that cleanly segment foreground objects from background. Different attention heads specialize in different objects or parts. This property is not trained -- it emerges purely from self-supervised multi-crop training.

## Why It Matters

1. **Label-free feature learning**: DINO features rival or exceed supervised features on many downstream tasks, especially for tasks requiring spatial understanding.
2. **Emergent segmentation**: Demonstrated that self-supervised ViTs discover object boundaries without segmentation labels, suggesting deep semantic understanding.
3. **Strong $k$-NN performance**: DINO features achieve **77.3% top-1** on ImageNet using a simple $k$-NN classifier (no fine-tuning), indicating high linear separability.
4. **Foundation for DINOv2**: DINO's framework was extended to DINOv2 (Oquab et al., 2023), which produces general-purpose visual features competitive with task-specific models across classification, segmentation, and depth estimation.

## Key Technical Details

- DINO with ViT-B/16 achieves **78.3% top-1** on ImageNet using linear evaluation (frozen features + linear classifier).
- The projection head is a 3-layer MLP (2048-2048-256) with GELU activation and $\ell_2$ normalization, followed by a weight-normalized fully connected layer to $K$ dimensions.
- Training uses LARS optimizer for the first 10 epochs (warmup), then switches to AdamW. Batch size is 1024, and training runs for 300-800 epochs.
- The number of local crops trades off compute for quality: 8 local crops provides diminishing returns over 6.
- DINO works with both ViT and ResNet backbones, but the emergent segmentation property is far more pronounced with ViTs.
- DINOv2 scales the approach to ViT-g/14 (1.1B parameters) trained on a curated 142M-image dataset, achieving state-of-the-art self-supervised results.

## Common Misconceptions

- **"DINO requires negative pairs like contrastive learning."** DINO is not contrastive. It uses no negative pairs. Collapse is prevented solely by centering and sharpening, making the framework simpler than methods like MoCo or SimCLR.
- **"The emergent segmentation means DINO learns pixel-level labels."** The attention maps correlate with object boundaries, but DINO does not produce per-pixel segmentation masks. Turning attention maps into proper segmentation requires post-processing or fine-tuning.
- **"The teacher is a separate, pre-trained model."** The teacher is the student's own exponential moving average -- there is no external model. "Self-distillation" means the model distills knowledge from a smoothed version of itself.

## Connections to Other Concepts

- `vision-transformer.md`: DINO uses ViT as the backbone and reveals properties of self-supervised ViT representations.
- `deit.md`: DeiT distills from an external CNN teacher with labels; DINO distills from itself without labels. Both are distillation-based training strategies for ViT.
- `masked-image-modeling.md`: MAE and BEiT are alternative self-supervised methods that reconstruct masked patches rather than matching augmented views. DINO tends to produce better $k$-NN features, while MAE tends to produce better features after fine-tuning.
- `attention-in-vision.md`: DINO's emergent segmentation directly visualizes what attention heads learn, providing insight into how self-attention operates on images.

## Further Reading

- Caron et al., "Emerging Properties in Self-Supervised Vision Transformers" (2021) -- The original DINO paper.
- Oquab et al., "DINOv2: Learning Robust Visual Features without Supervision" (2023) -- Scaled-up successor with curated data.
- Grill et al., "Bootstrap Your Own Latent: A New Approach to Self-Supervised Learning" (2020) -- BYOL, a related self-distillation method that inspired DINO's asymmetric design.
- He et al., "Momentum Contrast for Unsupervised Visual Representation Learning" (2020) -- MoCo, another momentum-based self-supervised method, but contrastive.
