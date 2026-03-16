# Batch Normalization

**One-Line Summary**: Batch normalization normalizes activations across the mini-batch at each layer, enabling higher learning rates, faster convergence, and acting as a mild regularizer.

**Prerequisites**: Forward and backward propagation, mini-batch gradient descent, vanishing/exploding gradients, convolutional neural networks

## What Is Batch Normalization?

Imagine a factory assembly line where each station expects parts within a specific size range. If station 3 suddenly outputs oversized parts, stations 4 through 10 must constantly re-calibrate, slowing the entire line. Batch normalization is the quality control inspector inserted between every station: it ensures that the output of each layer stays within a consistent, well-behaved range, so subsequent layers do not waste capacity adapting to shifting input distributions.

Technically, batch normalization (Ioffe & Szegedy, 2015) normalizes the pre-activation values across the mini-batch dimension, then applies a learned affine transformation to restore representational power.

## How It Works

### The Core Operation

For a mini-batch $\mathcal{B} = \{x_1, \dots, x_m\}$ of activations at a given layer:

$$\mu_{\mathcal{B}} = \frac{1}{m}\sum_{i=1}^{m} x_i$$

$$\sigma^2_{\mathcal{B}} = \frac{1}{m}\sum_{i=1}^{m}(x_i - \mu_{\mathcal{B}})^2$$

$$\hat{x}_i = \frac{x_i - \mu_{\mathcal{B}}}{\sqrt{\sigma^2_{\mathcal{B}} + \epsilon}}$$

$$y_i = \gamma \hat{x}_i + \beta$$

where $\gamma$ (scale) and $\beta$ (shift) are learned parameters, and $\epsilon \approx 10^{-5}$ prevents division by zero. The network can learn to undo the normalization if that is optimal, since setting $\gamma = \sigma_{\mathcal{B}}$ and $\beta = \mu_{\mathcal{B}}$ recovers the original activation.

### Placement in the Network

The standard placement is: **Conv -> BN -> ReLU**. Some work suggests **Conv -> ReLU -> BN** can work equally well, but the former is conventional and better supported by frameworks.

For convolutional layers, BN computes statistics per channel across all spatial positions and batch elements. A Conv layer with $C$ output channels has $2C$ BN parameters ($\gamma_c$ and $\beta_c$ for each channel).

### Training vs. Inference

During training, BN uses mini-batch statistics. During inference, it uses running estimates (exponential moving average) accumulated during training:

$$\mu_{\text{running}} \leftarrow (1 - \alpha)\mu_{\text{running}} + \alpha \mu_{\mathcal{B}}$$

where $\alpha$ is the momentum (default 0.1 in PyTorch). At inference, BN becomes a fixed linear transformation and can be fused into the preceding Conv/Linear layer for zero overhead.

### Alternatives: Group Norm, Layer Norm, Instance Norm

| Normalization | Computes statistics over | Best for |
|---|---|---|
| **Batch Norm** | (N, H, W) per channel | Large-batch image classification |
| **Layer Norm** | (C, H, W) per sample | Transformers, NLP, small batches |
| **Instance Norm** | (H, W) per sample per channel | Style transfer |
| **Group Norm** | (C/G, H, W) per sample | Detection/segmentation with small batches |

Group Normalization (Wu & He, 2018) divides channels into groups (default $G=32$) and normalizes within each group. It is independent of batch size, making it the preferred choice when batch size per GPU drops below 8 (common in detection and segmentation with large images).

## Why It Matters

1. BN allowed the original Inception-v2 to train 14x faster than the non-BN baseline while achieving the same accuracy.
2. It enables learning rates 5-10x higher than possible without normalization, accelerating convergence substantially.
3. BN acts as a regularizer (due to the noise from mini-batch statistics), sometimes allowing the removal of Dropout.
4. It mitigates vanishing/exploding gradients by keeping activations in a well-conditioned range across depth.
5. Nearly every modern CNN architecture (ResNet, EfficientNet, ConvNeXt) relies on some form of normalization.

## Key Technical Details

- BN adds 2 parameters per channel (negligible compared to Conv weight count) and stores 2 running statistics per channel.
- Default momentum in PyTorch is 0.1; TensorFlow uses 0.99 (note: PyTorch defines momentum as $\alpha$, TensorFlow as $1 - \alpha$).
- BN performs poorly with very small batch sizes (< 4) because batch statistics become noisy. Use Group Norm or Sync BN instead.
- **Synchronized BN** computes statistics across all GPUs, giving accurate estimates when per-GPU batch size is small. Essential for detection and segmentation training.
- When fine-tuning with small datasets, freezing BN layers (keeping them in eval mode) often improves results because the pretrained running statistics are more reliable than noisy small-batch estimates.
- BN before the bias term: since BN subtracts the mean, the bias in the preceding Conv layer is redundant and can be removed (set `bias=False`).

## Common Misconceptions

- **"BN works because it reduces internal covariate shift."** The original paper (Ioffe & Szegedy, 2015) proposed this explanation, but Santurkar et al. (2018) showed that BN's primary benefit is smoothing the loss landscape, making optimization easier regardless of covariate shift.
- **"You always need BN."** Some modern architectures (ConvNeXt, Vision Transformers) use Layer Norm instead and achieve state-of-the-art results. BN is not the only path to stable training.
- **"BN and Dropout should always be used together."** They can interact poorly: BN's noise during training and Dropout's noise can compound, and the mismatch between training and inference statistics for both can hurt. Many practitioners use BN alone.

## Connections to Other Concepts

- `dropout-and-regularization.md`: BN's regularization effect can partially replace Dropout, but the two mechanisms are complementary under some conditions.
- `learning-rate-scheduling.md`: BN's loss-landscape smoothing effect is what enables the higher learning rates that modern schedules exploit.
- `transfer-learning.md`: BN running statistics are domain-specific; care is needed when fine-tuning across domains.
- `progressive-resizing.md`: Changing input resolution affects BN statistics, which may need re-calibration.

## Further Reading

- Ioffe & Szegedy, "Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift" (2015) -- The original BN paper.
- Wu & He, "Group Normalization" (2018) -- Batch-size-independent alternative widely used in detection.
- Santurkar et al., "How Does Batch Normalization Help Optimization?" (2018) -- Challenges the internal covariate shift explanation.
- Ba et al., "Layer Normalization" (2016) -- The normalization technique that became standard in Transformers.
