# Mixup and CutMix

**One-Line Summary**: Mixup linearly blends pairs of images and their labels, while CutMix cuts and pastes rectangular regions between images, both producing soft training targets that improve generalization, calibration, and robustness.

**Prerequisites**: Cross-entropy loss, data augmentation, label smoothing, regularization

## What Is Mixup and CutMix?

Imagine learning to classify animals by seeing not just pure photos of cats and dogs, but also composite images that are 70% cat and 30% dog, with labels reflecting that blend. This forces you to learn what makes a cat truly cat-like rather than memorizing specific images. Mixup does this by pixel-wise blending two images; CutMix does it by physically cutting a patch from one image and pasting it onto another. Both train the model on the interpolated space between classes, producing smoother decision boundaries.

## How It Works

### Mixup

Given two training samples $(x_i, y_i)$ and $(x_j, y_j)$, Mixup (Zhang et al., 2018) creates a virtual sample:

$$\tilde{x} = \lambda x_i + (1 - \lambda) x_j$$
$$\tilde{y} = \lambda y_i + (1 - \lambda) y_j$$

where $\lambda \sim \text{Beta}(\alpha, \alpha)$ and $\alpha$ is a hyperparameter controlling the strength of mixing. Common choices:

- $\alpha = 0.2$: mild mixing, most $\lambda$ values near 0 or 1
- $\alpha = 1.0$: uniform mixing, $\lambda$ uniform on [0, 1]
- $\alpha = 0.4$: moderate mixing, used in many modern recipes

```python
# Mixup implementation
def mixup(x, y, alpha=0.2):
    lam = np.random.beta(alpha, alpha)
    batch_size = x.size(0)
    index = torch.randperm(batch_size)
    mixed_x = lam * x + (1 - lam) * x[index]
    y_a, y_b = y, y[index]
    return mixed_x, y_a, y_b, lam

# Loss computation
def mixup_criterion(criterion, pred, y_a, y_b, lam):
    return lam * criterion(pred, y_a) + (1 - lam) * criterion(pred, y_b)
```

### CutMix

CutMix (Yun et al., 2019) replaces a rectangular region of one image with the corresponding region from another:

$$\tilde{x} = \mathbf{M} \odot x_i + (1 - \mathbf{M}) \odot x_j$$
$$\tilde{y} = \lambda y_i + (1 - \lambda) y_j$$

where $\mathbf{M} \in \{0, 1\}^{W \times H}$ is a binary mask with a rectangular hole, and $\lambda$ is the area ratio of the retained region:

$$\lambda = 1 - \frac{r_w \cdot r_h}{W \cdot H}$$

The cut region dimensions are sampled as $r_w = W\sqrt{1 - \lambda}$ and $r_h = H\sqrt{1 - \lambda}$, with the center position uniformly random.

```python
# CutMix implementation
def cutmix(x, y, alpha=1.0):
    lam = np.random.beta(alpha, alpha)
    batch_size = x.size(0)
    index = torch.randperm(batch_size)

    # Generate random bounding box
    W, H = x.size(2), x.size(3)
    cut_ratio = np.sqrt(1.0 - lam)
    cut_w = int(W * cut_ratio)
    cut_h = int(H * cut_ratio)
    cx = np.random.randint(W)
    cy = np.random.randint(H)
    x1 = np.clip(cx - cut_w // 2, 0, W)
    y1 = np.clip(cy - cut_h // 2, 0, H)
    x2 = np.clip(cx + cut_w // 2, 0, W)
    y2 = np.clip(cy + cut_h // 2, 0, H)

    x[:, :, x1:x2, y1:y2] = x[index, :, x1:x2, y1:y2]
    lam = 1 - ((x2 - x1) * (y2 - y1) / (W * H))  # Adjust for clipping
    return x, y, y[index], lam
```

### Key Difference

Mixup blends globally, creating ghostly superimposed images that are unnatural. CutMix preserves local pixel statistics -- each region looks natural because it comes from a real image -- while still providing soft labels. This preserves spatial information better, which matters for localization tasks.

### Variants

- **Manifold Mixup** (Verma et al., 2019): applies mixing in hidden layers rather than input space, providing stronger regularization.
- **SaliencyMix** (Uddin et al., 2021): pastes the salient region of one image onto another, ensuring informative content is mixed.
- **ResizeMix** (Qin et al., 2020): resizes one image and pastes it onto another instead of cutting.
- **FMix** (Harris et al., 2020): uses Fourier-space masks for non-rectangular cut regions.

## Why It Matters

1. CutMix improved ResNet-50 top-1 on ImageNet from 76.3% to 78.6% (+2.3%) compared to the baseline and outperformed both Cutout and Mixup.
2. Both methods significantly improve model calibration -- models trained with Mixup/CutMix produce confidence scores that better reflect actual accuracy.
3. CutMix improves weakly-supervised object localization because the model must attend to all parts of an object, not just the most discriminative region.
4. These methods improve robustness to adversarial examples and out-of-distribution inputs (Thulasidasan et al., 2019).
5. They are standard components in modern training recipes (DeiT, Swin, ConvNeXt) and add negligible computational cost.

## Key Technical Details

- Standard recipe: apply Mixup or CutMix with probability 0.5 each per batch (randomly choosing one), with $\alpha = 0.8$ for Mixup and $\alpha = 1.0$ for CutMix (DeiT recipe).
- Mixup and CutMix should NOT be applied during validation or testing.
- For object detection, CutMix requires care -- pasted regions may introduce objects without corresponding bounding box annotations.
- CutMix with very small $\lambda$ (large cut region) can effectively destroy the original image's label information, degrading training. Some implementations clamp $\lambda$ to [0.3, 0.7].
- Mixup interacts with label smoothing: both soften the target, and using both simultaneously requires lower values of each (e.g., $\epsilon = 0.05$ with Mixup instead of $\epsilon = 0.1$).
- These methods increase training time per epoch minimally (~1-2%) since the mixing operation is cheap.

## Common Misconceptions

- **"Mixup creates unrealistic images, so it should not help."** The blended images are indeed unnatural, but they regularize the linear interpolation between class representations, which provably smooths the decision boundary. The model never sees these at test time.
- **"CutMix and Cutout are the same thing."** Cutout replaces the cut region with zeros (losing information) and does not change the label. CutMix replaces the cut region with content from another image and adjusts the label proportionally, providing more training signal.
- **"These techniques only help with classification."** CutMix improves localization, and both methods improve representation learning for downstream tasks including transfer learning and semi-supervised learning.

## Connections to Other Concepts

- **Data Augmentation**: Mixup and CutMix extend augmentation beyond single-image transforms to multi-image composition.
- **Label Smoothing**: Both produce soft targets but through different mechanisms -- label smoothing is target-side, Mixup/CutMix is input-side.
- **Knowledge Distillation**: Soft targets in distillation share the same intuition as Mixup/CutMix soft labels: richer gradients from non-extreme targets.
- **Dropout and Regularization**: Mixup/CutMix are data-space regularizers, complementary to parameter-space regularizers like dropout and weight decay.

## Further Reading

- Zhang et al., "mixup: Beyond Empirical Risk Minimization" (2018) -- Introduced Mixup training.
- Yun et al., "CutMix: Regularization Strategy to Train Strong Classifiers with Localizable Features" (2019) -- Proposed CutMix with localization benefits.
- Verma et al., "Manifold Mixup: Better Representations by Interpolating Hidden States" (2019) -- Extended Mixup to hidden layers.
- Touvron et al., "Training Data-Efficient Image Transformers & Distillation Through Attention" (2021) -- DeiT recipe combining Mixup and CutMix for ViT training.
