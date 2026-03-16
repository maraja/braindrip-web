# Data-Efficient Image Transformers (DeiT)

**One-Line Summary**: DeiT demonstrates that Vision Transformers can be trained competitively on ImageNet-1K alone -- without hundreds of millions of private images -- by using knowledge distillation from a CNN teacher and aggressive data augmentation.

**Prerequisites**: Vision Transformer (ViT), knowledge distillation, data augmentation, ImageNet, convolutional neural networks

## What Is DeiT?

Imagine a student who learns not by attending every lecture but by studying a brilliant tutor's solved examples. The student doesn't need access to the entire library -- just the tutor's guidance and clever study habits are enough. DeiT applies this idea to Vision Transformers: instead of requiring massive proprietary datasets like JFT-300M, it distills knowledge from a strong CNN teacher (typically a RegNet) into a ViT student, while compensating for limited data with heavy augmentation.

DeiT was introduced by Touvron et al. (2021) at Facebook AI Research. The key contribution is not a new architecture but a training strategy that makes ViT practical for researchers who only have access to ImageNet-1K (1.28 million images). DeiT-B achieves 83.1% top-1 accuracy on ImageNet, rivaling EfficientNet-B7 while training on 8 GPUs in under 3 days.

## How It Works

### Distillation Token

DeiT introduces a dedicated **distillation token** alongside the standard class token. Both are prepended to the patch sequence:

$$\mathbf{z}_0 = [\mathbf{x}_{\text{class}};\; \mathbf{x}_{\text{distill}};\; \mathbf{x}_1^p;\; \mathbf{x}_2^p;\; \ldots;\; \mathbf{x}_N^p] + \mathbf{E}_{\text{pos}}$$

The class token is trained with the standard cross-entropy loss against ground-truth labels. The distillation token is trained to match the teacher's output. At the end of the Transformer, each token produces its own prediction:

- $\mathbf{y}_{\text{class}} = \text{head}_{\text{class}}(\mathbf{z}_L^0)$ -- supervised by the true label
- $\mathbf{y}_{\text{distill}} = \text{head}_{\text{distill}}(\mathbf{z}_L^1)$ -- supervised by the teacher

### Distillation Strategies

DeiT explores two forms of distillation:

**Soft distillation** minimizes the KL divergence between student and teacher softmax outputs:

$$\mathcal{L}_{\text{soft}} = (1 - \lambda)\,\mathcal{L}_{\text{CE}}(y, \psi(\mathbf{z}_s)) + \lambda\,\tau^2 \, \text{KL}(\psi(\mathbf{z}_t / \tau),\, \psi(\mathbf{z}_s / \tau))$$

where $\tau$ is the temperature and $\lambda$ controls the balance.

**Hard-label distillation** simply uses the teacher's argmax prediction as a pseudo-label:

$$\mathcal{L}_{\text{hard}} = \frac{1}{2}\,\mathcal{L}_{\text{CE}}(y, \psi(\mathbf{z}_s^{\text{class}})) + \frac{1}{2}\,\mathcal{L}_{\text{CE}}(y_t, \psi(\mathbf{z}_s^{\text{distill}}))$$

Surprisingly, hard-label distillation outperforms soft distillation in DeiT, likely because the label smoothing and augmentation already provide enough soft signal.

### Training Recipe

The augmentation and regularization pipeline is critical:

- **RandAugment**: Random combinations of image transformations
- **Mixup** ($\alpha = 0.8$) and **CutMix** ($\alpha = 1.0$): Blending and pasting regions across training pairs
- **Random Erasing** (probability 0.25): Masking random patches
- **Stochastic Depth** (drop rate 0.1): Randomly dropping Transformer layers during training
- **Repeated Augmentation**: Sampling the same image multiple times per epoch with different augmentations
- **Label smoothing** ($\epsilon = 0.1$)

Training uses AdamW optimizer with cosine learning rate schedule, 5-epoch warmup, and batch size 1024.

### Model Variants

| Model | Params | ImageNet Top-1 | Throughput (img/s) |
|-------|--------|----------------|-------------------|
| DeiT-Ti | 5M | 72.2% | 2536 |
| DeiT-S | 22M | 79.8% | 940 |
| DeiT-B | 86M | 81.8% | 292 |
| DeiT-B (distilled) | 87M | 83.4% | 292 |

## Why It Matters

1. **Democratized ViT training**: Before DeiT, ViT required JFT-300M (a private Google dataset). DeiT made competitive ViT training accessible to anyone with ImageNet.
2. **Established distillation as standard practice**: The distillation token approach became a baseline strategy for training vision Transformers efficiently.
3. **Proved augmentation compensates for inductive bias**: The gap between CNNs and Transformers on limited data can be largely closed through training strategy rather than architecture changes.
4. **Practical throughput**: DeiT models are fast enough for real deployment -- DeiT-S processes over 900 images/second on a single V100.

## Key Technical Details

- The default teacher is a **RegNetY-16GF** (84.0% top-1), a CNN chosen because CNNs provide complementary inductive biases to the ViT student.
- A CNN teacher outperforms a Transformer teacher for distillation into a ViT -- the inductive bias transfer is what provides the benefit.
- The distillation token learns a different representation than the class token; at test time, both predictions are averaged (late fusion).
- DeiT-B distilled reaches **83.4%** top-1 on ImageNet-1K, closing the gap with ViT-B pre-trained on JFT-300M (84.15%).
- Training DeiT-B takes approximately **53 hours on 8 V100 GPUs**, compared to weeks on TPU pods for the original ViT.
- DeiT-III (Touvron et al., 2022) later improved these results to **85.2%** for DeiT-B by revisiting augmentations and using a 3-augment strategy.

## Common Misconceptions

- **"DeiT is a new architecture."** DeiT uses the exact same ViT architecture (with one additional token). The contribution is entirely in the training strategy: distillation, augmentation, and regularization.
- **"Knowledge distillation always means soft labels."** In DeiT, hard-label distillation (using argmax teacher predictions) actually works better than soft-label KL divergence, challenging the conventional wisdom from Hinton et al. (2015).
- **"You need the distillation token."** The distillation token provides a modest gain (~0.5-1.0% top-1), but the augmentation and regularization recipe alone accounts for most of DeiT's improvement over naively trained ViT.

## Connections to Other Concepts

- `vision-transformer.md`: DeiT uses the ViT architecture directly; it is a training methodology for ViT, not a new model.
- `dino.md`: Also trains ViT with a teacher-student framework but without labels, using self-distillation rather than CNN-to-Transformer distillation.
- `masked-image-modeling.md`: An alternative self-supervised pre-training strategy (MAE, BEiT) that also makes ViT data-efficient, but through reconstruction rather than distillation.
- `vision-transformer-scaling.md`: DeiT shows what's achievable at the ImageNet-1K scale; scaling laws describe how performance changes as data and model grow beyond this point.

## Further Reading

- Touvron et al., "Training data-efficient image transformers & distillation through attention" (2021) -- The original DeiT paper.
- Touvron et al., "DeiT III: Revenge of the ViT" (2022) -- Improved training recipe pushing DeiT-B to 85.2%.
- Hinton et al., "Distilling the Knowledge in a Neural Network" (2015) -- Foundational knowledge distillation paper.
- Cubuk et al., "RandAugment: Practical Automated Data Augmentation with a Reduced Search Space" (2020) -- Key augmentation method used in DeiT.
