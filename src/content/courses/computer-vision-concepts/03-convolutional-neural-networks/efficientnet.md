# EfficientNet

**One-Line Summary**: EfficientNet uses compound scaling to uniformly scale network depth, width, and resolution with a fixed ratio, achieving state-of-the-art accuracy-efficiency tradeoffs from a neural architecture search baseline (B0) up to B7.

**Prerequisites**: Depthwise separable convolutions, MobileNet (inverted residuals), neural architecture search, batch normalization

## What Is EfficientNet?

Imagine you have a photograph and want to see more detail. You could buy a higher-resolution camera (more pixels), use a more powerful zoom lens (deeper processing), or get a wider-angle lens (see more at once). Traditionally, researchers scaled CNNs along just one of these dimensions: deeper (ResNet-18 to ResNet-152), wider (WideResNet), or higher resolution. EfficientNet's insight is that these three dimensions are interdependent and should be scaled together in a balanced way -- like upgrading the camera, lens, and sensor simultaneously according to an optimal ratio.

EfficientNet was developed by Mingxing Tan and Quoc Le at Google Brain in 2019. The key idea is **compound scaling**: given a fixed computational budget multiplier $\phi$, depth, width, and resolution are scaled by:

$$d = \alpha^\phi, \quad w = \beta^\phi, \quad r = \gamma^\phi$$

where $\alpha, \beta, \gamma$ are constants determined by a small grid search, subject to $\alpha \cdot \beta^2 \cdot \gamma^2 \approx 2$ (so that FLOPs roughly double for each unit increase in $\phi$).

## How It Works

### The Compound Scaling Method

The starting point is the observation that scaling any single dimension has diminishing returns. Scaling depth from 18 to 152 layers (ResNet) improves top-1 accuracy from 69.8% to 76.3% but going deeper yields marginal gains. Width scaling saturates similarly. The compound method scales all three simultaneously:

1. Fix $\phi = 1$ and search for the best $\alpha$, $\beta$, $\gamma$ using a small grid search on the baseline model.
2. The search found $\alpha = 1.2$, $\beta = 1.1$, $\gamma = 1.15$.
3. Fix $\alpha$, $\beta$, $\gamma$ and scale by increasing $\phi$ to get B1 through B7.

The constraint $\alpha \cdot \beta^2 \cdot \gamma^2 \approx 2$ ensures that the total FLOP budget roughly doubles with each increment of $\phi$.

### Baseline Architecture (EfficientNet-B0)

B0 was discovered through NAS (specifically MnasNet-style search) optimizing for both accuracy and FLOPS:

```
Stage 1: Conv 3x3, stride 2      -> 112x112x32
Stage 2: MBConv1, k3x3           -> 112x112x16    (1 block)
Stage 3: MBConv6, k3x3, stride 2 -> 56x56x24      (2 blocks)
Stage 4: MBConv6, k5x5, stride 2 -> 28x28x40      (2 blocks)
Stage 5: MBConv6, k3x3, stride 2 -> 14x14x80      (3 blocks)
Stage 6: MBConv6, k5x5           -> 14x14x112     (3 blocks)
Stage 7: MBConv6, k5x5, stride 2 -> 7x7x192       (4 blocks)
Stage 8: MBConv6, k3x3           -> 7x7x320       (1 block)
Stage 9: Conv 1x1 + Pool + FC    -> 1000
```

**MBConv** denotes the mobile inverted bottleneck convolution block from MobileNetV2, with an expansion factor (1 or 6) and optional squeeze-and-excitation (SE) attention with a reduction ratio of 4.

### Model Family

| Model | Input Res | Depth Coeff | Width Coeff | Params | FLOPs | Top-1 Acc |
|-------|-----------|-------------|-------------|--------|-------|-----------|
| B0 | 224 | 1.0 | 1.0 | 5.3M | 0.39B | 77.1% |
| B1 | 240 | 1.1 | 1.0 | 7.8M | 0.70B | 79.1% |
| B2 | 260 | 1.1 | 1.1 | 9.2M | 1.0B | 80.1% |
| B3 | 300 | 1.2 | 1.2 | 12M | 1.8B | 81.6% |
| B4 | 380 | 1.4 | 1.4 | 19M | 4.2B | 82.9% |
| B5 | 456 | 1.6 | 1.6 | 30M | 9.9B | 83.6% |
| B6 | 528 | 1.8 | 1.8 | 43M | 19B | 84.0% |
| B7 | 600 | 2.0 | 2.0 | 66M | 37B | 84.3% |

### Training Details

- **Optimizer**: RMSProp with decay 0.9 and momentum 0.9.
- **Learning rate**: 0.256, decayed by 0.97 every 2.4 epochs.
- **Batch size**: 2048 with batch normalization momentum 0.99.
- **Data augmentation**: AutoAugment policy, dropout, and stochastic depth (survival probability 0.8 for B0, lower for larger models).
- **Swish activation**: $\text{swish}(x) = x \cdot \sigma(x)$, used throughout instead of ReLU.
- **Training time**: B0 takes ~23 hours on 8 V100 GPUs; B7 takes several days.

### EfficientNetV2

Tan & Le (2021) introduced EfficientNetV2 with several improvements:

- **Fused-MBConv** blocks in early stages: replaces depthwise + pointwise with standard convolutions in the first few stages, which are faster on modern accelerators due to better arithmetic intensity.
- **Progressive learning**: Training starts at lower resolution with weaker augmentation and progressively increases both, reducing training time by 5-11x.
- **NAS with training-aware search**: The search optimizes for training speed, not just inference FLOPs.

EfficientNetV2-L achieves 85.7% top-1 accuracy, training 6.8x faster than B7.

## Why It Matters

1. **Established the scaling law for CNNs.** Before EfficientNet, scaling was ad hoc. Compound scaling provides a principled method that generalizes across architectures.
2. **State-of-the-art efficiency.** EfficientNet-B0 matches ResNet-152's accuracy with 7.6x fewer parameters and 17x fewer FLOPs. B7 achieved 84.3% top-1, the highest at the time without extra data.
3. **Transfer learning performance.** EfficientNet features transfer exceptionally well: B7 pretrained on ImageNet achieved state-of-the-art results on 5 of 8 common transfer learning datasets.
4. **Practical deployment.** The B0-B3 range is well-suited for edge devices, while B4-B7 serve cloud applications, all from a single unified design methodology.

## Key Technical Details

- **SE (Squeeze-and-Excitation) ratio**: 0.25 in all MBConv blocks. The SE module first squeezes spatial dimensions via global average pooling, then uses two FC layers to compute channel-wise attention weights.
- **Stochastic depth** with linearly increasing drop probability from 0 (early layers) to 0.2-0.3 (final layers) is critical for regularization in larger models.
- **The $\alpha \cdot \beta^2 \cdot \gamma^2 \approx 2$ constraint** reflects that FLOPs scale linearly with depth, quadratically with width (both input and output channels), and quadratically with resolution (both spatial dimensions).
- **EfficientNet-B0 vs. ResNet-50**: B0 achieves 77.1% top-1 (vs. 76.0%) with 5.3M params (vs. 25.6M) and 0.39B FLOPs (vs. 4.1B).
- **Noisy Student Training** (Xie et al., 2020): Using EfficientNet with semi-supervised learning achieved 88.4% top-1 on ImageNet, demonstrating the architecture's capacity when data is scaled.
- Larger models (B5-B7) are memory-intensive due to high-resolution inputs; B7 at 600x600 resolution requires substantial GPU memory during training.

## Common Misconceptions

- **"Compound scaling is specific to EfficientNet."** The principle applies to any architecture. The authors showed compound scaling improves MobileNets and ResNets too, though the optimal ratios may differ.
- **"EfficientNet is always efficient."** B5-B7 are quite large (30M-66M parameters, up to 37B FLOPs) and not suitable for mobile deployment. "Efficient" refers to the accuracy-per-FLOP ratio, not absolute cost.
- **"The NAS component is the main contribution."** The NAS finds a good B0 baseline, but the compound scaling method is the primary contribution. Applying compound scaling to a manually designed baseline also yields strong results.

## Connections to Other Concepts

- `mobilenet.md`: EfficientNet uses MobileNetV2's inverted residual blocks (MBConv) as its building block.
- `depthwise-separable-convolutions.md`: The core operation within every MBConv block.
- `neural-architecture-search.md`: NAS discovers the B0 architecture; the compound scaling method then scales it.
- `resnet.md`: EfficientNet demonstrates that scaling more carefully (compound) outperforms scaling only depth (ResNet's approach) for the same computational budget.

## Further Reading

- Tan & Le, "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks" (2019) -- The original EfficientNet paper introducing compound scaling.
- Tan & Le, "EfficientNetV2: Smaller Models and Faster Training" (2021) -- Improved training with fused-MBConv and progressive learning.
- Xie et al., "Self-Training With Noisy Student Improves ImageNet Classification" (2020) -- Pushed EfficientNet to 88.4% top-1 with semi-supervised learning.
