# MobileNet

**One-Line Summary**: MobileNet is a family of efficient CNN architectures built on depthwise separable convolutions, designed for mobile and embedded deployment with tunable width and resolution multipliers.

**Prerequisites**: Depthwise separable convolutions, batch normalization, ResNet (skip connections), 1x1 convolutions

## What Is MobileNet?

Think of designing a car for city driving. A Formula 1 car has incredible performance but is impractical for daily use -- too expensive, too wide for narrow streets, and fuel-hungry. MobileNet is the compact city car of neural networks: engineered from the ground up for constrained environments (smartphones, drones, AR glasses) while still being capable enough for real-world tasks. Rather than compressing a large network after the fact, MobileNet builds efficiency into the architecture itself.

MobileNet was introduced by Andrew Howard and colleagues at Google in 2017 (V1), with significant architectural improvements in V2 (2018) and V3 (2019). The family has become the most widely deployed CNN architecture on mobile devices.

## How It Works

### MobileNetV1

MobileNetV1 replaces every standard convolution (except the first layer) with a depthwise separable convolution:

```
Standard Conv Layer:
  Input -> Conv kxk -> BN -> ReLU

MobileNetV1 Layer:
  Input -> DepthwiseConv 3x3 -> BN -> ReLU -> PointwiseConv 1x1 -> BN -> ReLU
```

The architecture is a stack of 13 such depthwise separable blocks:

| Layer | Stride | Output Channels |
|-------|--------|----------------|
| Conv 3x3 (standard) | 2 | 32 |
| DW + PW | 1 | 64 |
| DW + PW | 2 | 128 |
| DW + PW | 1 | 128 |
| DW + PW | 2 | 256 |
| DW + PW | 1 | 256 |
| DW + PW | 2 | 512 |
| 5x (DW + PW) | 1 | 512 |
| DW + PW | 2 | 1024 |
| DW + PW | 1 | 1024 |
| Global AvgPool | -- | 1024 |
| FC | -- | 1000 |

**Width multiplier** $\alpha \in (0, 1]$ scales the number of channels in every layer by factor $\alpha$. At $\alpha = 1.0$: 4.2M params, 569M FLOPs, 70.6% top-1. At $\alpha = 0.5$: 1.3M params, 149M FLOPs, 63.7% top-1.

**Resolution multiplier** $\rho$ scales the input resolution (e.g., $224 \rightarrow 192 \rightarrow 160 \rightarrow 128$), reducing computation quadratically.

### MobileNetV2: Inverted Residuals

V2 introduced two key changes:

**Inverted residual block**: Unlike ResNet's bottleneck (wide -> narrow -> wide), V2 uses narrow -> wide -> narrow:

```
Input (narrow, e.g., 24 channels)
  -> Conv 1x1 (expand by factor t=6) -> BN -> ReLU6   [144 channels]
  -> DepthwiseConv 3x3 -> BN -> ReLU6                 [144 channels]
  -> Conv 1x1 (project back) -> BN                     [24 channels]
  -> Add residual connection (if stride=1 and in_ch == out_ch)
```

The expansion factor $t = 6$ means the intermediate representation is 6x wider than the input/output. The rationale: depthwise convolutions operate on individual channels, so more channels give them more capacity.

**Linear bottleneck**: The final pointwise convolution has no ReLU activation. The authors showed that ReLU on low-dimensional features causes information loss (it collapses values to zero), so the narrow bottleneck uses a linear projection.

V2 stats: 3.4M params, 300M FLOPs, 72.0% top-1 accuracy -- better than V1 with fewer parameters and fewer FLOPs.

### MobileNetV3: NAS + Handcrafted

V3 combined neural architecture search (NAS) with manual refinements:

- **Architecture search**: Platform-aware NAS (similar to MnasNet) optimized for latency on mobile hardware, not just FLOPs.
- **Swish activation**: Replaced ReLU6 with h-swish: $\text{h-swish}(x) = x \cdot \frac{\text{ReLU6}(x + 3)}{6}$, a hardware-friendly approximation of swish.
- **Squeeze-and-Excitation (SE) blocks**: Added lightweight channel attention modules to some blocks.
- **Redesigned head**: The expensive final layers were restructured, moving the first $1 \times 1$ expansion after global pooling, saving 7ms (15% of inference time) on a Pixel phone.

V3-Large: 5.4M params, 219M FLOPs, 75.2% top-1.
V3-Small: 2.9M params, 56M FLOPs, 67.4% top-1.

## Why It Matters

1. **Mobile deployment at scale.** MobileNets run on billions of devices via TensorFlow Lite, CoreML, and NNAPI. Google uses them in Google Lens, on-device face detection, and smart reply.
2. **Backbone for real-time applications.** MobileNet-SSD runs object detection at 30+ FPS on a smartphone; MobileNet-based segmentation runs at 15+ FPS.
3. **Established the mobile-efficient design paradigm**: inverted residuals, linear bottlenecks, and hardware-aware design choices that influenced EfficientNet, once-for-all networks, and many NAS-discovered architectures.
4. **Tunable accuracy-latency tradeoff.** Width and resolution multipliers allow a single architecture family to span a wide range of deployment constraints without redesigning the network.

## Key Technical Details

- **MobileNetV1**: 4.2M params, 569M MAdds, 70.6% top-1 on ImageNet. On a Pixel 1 phone: 113ms inference.
- **MobileNetV2**: 3.4M params, 300M MAdds, 72.0% top-1. Inference: 75ms on Pixel 1.
- **MobileNetV3-Large**: 5.4M params, 219M MAdds, 75.2% top-1. Inference: 51ms on Pixel 1.
- **Expansion ratio $t = 6$** in V2/V3 inverted residuals is the standard setting; higher values increase accuracy but also cost.
- **ReLU6** ($\min(\max(0, x), 6)$) was used in V1/V2 for numerical stability in fixed-point arithmetic on mobile processors.
- **Quantization**: MobileNets are designed to be quantization-friendly. INT8 quantized MobileNetV2 runs 2-4x faster than float32 with less than 1% accuracy drop.
- The memory bottleneck in V2 is well-suited to mobile: the narrow bottleneck channels (e.g., 24) between blocks require very little activation memory, while the expanded representation (e.g., 144) exists only temporarily within the block.

## Common Misconceptions

- **"MobileNet is just a compressed version of a larger network."** MobileNet was designed from scratch for efficiency, not derived by pruning or distilling a larger model. The architecture itself embodies the efficiency, unlike post-hoc compression methods.
- **"Inverted residuals are counterintuitive -- bottlenecks should be narrow."** The inversion makes sense because depthwise convolutions need wider representations to have sufficient capacity (they process each channel independently). The narrow bottleneck at the boundaries reduces memory and facilitates skip connections.
- **"MobileNets are only for classification."** MobileNets serve as backbones for detection (SSD-MobileNet), segmentation (DeepLabV3-MobileNet), pose estimation, face detection, and many other tasks in production systems.

## Connections to Other Concepts

- `depthwise-separable-convolutions.md`: The fundamental operation underlying all MobileNet variants.
- `resnet.md`: V2's residual connections borrow from ResNet, but with an inverted bottleneck structure.
- `efficientnet.md`: Built on MobileNet-style inverted residual blocks (MBConv), scaling them with compound scaling.
- `neural-architecture-search.md`: V3 used NAS to discover the block configuration and activation choices, bridging hand-designed and automated architecture design.

## Further Reading

- Howard et al., "MobileNets: Efficient Convolutional Neural Networks for Mobile Vision Applications" (2017) -- MobileNetV1 paper.
- Sandler et al., "MobileNetV2: Inverted Residuals and Linear Bottlenecks" (2018) -- Introduced the inverted residual block.
- Howard et al., "Searching for MobileNetV3" (2019) -- Combined NAS with manual refinements for the V3 architecture.
