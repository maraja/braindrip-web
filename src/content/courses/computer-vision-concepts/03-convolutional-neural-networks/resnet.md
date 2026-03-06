# ResNet

**One-Line Summary**: ResNet introduced skip connections that enable identity mappings, allowing successful training of networks up to 152 layers deep and achieving 3.57% top-5 error on ImageNet.

**Prerequisites**: Convolution in neural networks, pooling layers, batch normalization, vanishing gradients, VGGNet

## What Is ResNet?

Imagine climbing a tall ladder. On a regular ladder, if a single rung is slippery, you can fall all the way down. But if every few rungs you are attached to a safety cable that connects back to a lower rung, you can never fall more than a few rungs at a time. Skip connections in ResNet work the same way for gradient flow: instead of requiring every layer to learn a completely new representation, each block only needs to learn the **residual** -- the difference between the desired output and the input. If the optimal transformation is close to the identity, the network can simply drive the residual toward zero, which is far easier than learning an identity mapping from scratch.

ResNet was developed by Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun at Microsoft Research. It won the ILSVRC-2015 classification challenge with 3.57% top-5 error (surpassing human-level performance of ~5.1%) and simultaneously won the detection, localization, COCO detection, and COCO segmentation tracks.

## How It Works

### The Degradation Problem

Before ResNet, a puzzling observation plagued deep network design: adding more layers to a sufficiently deep network actually increased both training and test error. This was not overfitting (training error also increased), but an optimization difficulty. A 56-layer plain network performed worse than a 20-layer one on CIFAR-10.

### Residual Learning

Instead of learning a mapping $\mathcal{H}(\mathbf{x})$ directly, a residual block learns:

$$\mathcal{F}(\mathbf{x}) = \mathcal{H}(\mathbf{x}) - \mathbf{x}$$

The output is then:

$$\mathbf{y} = \mathcal{F}(\mathbf{x}) + \mathbf{x}$$

If the optimal mapping is close to identity, pushing $\mathcal{F}(\mathbf{x})$ toward zero is easier than learning $\mathcal{H}(\mathbf{x}) = \mathbf{x}$ through a stack of nonlinear layers. The skip connection provides a direct path for gradients during backpropagation.

### Basic Block vs. Bottleneck Block

**Basic Block** (used in ResNet-18, ResNet-34):
```
x -> Conv3x3 -> BN -> ReLU -> Conv3x3 -> BN -> (+x) -> ReLU
```

**Bottleneck Block** (used in ResNet-50, ResNet-101, ResNet-152):
```
x -> Conv1x1 -> BN -> ReLU -> Conv3x3 -> BN -> ReLU -> Conv1x1 -> BN -> (+x) -> ReLU
```

The bottleneck reduces channels with the first $1 \times 1$ conv (e.g., 256 to 64), applies the $3 \times 3$ conv on the reduced channels, then expands back with the second $1 \times 1$ conv. This makes deeper networks computationally feasible: a bottleneck block with 256-channel input/output has roughly the same cost as a basic block with 64 channels.

### Dimension Matching

When the input and output dimensions differ (due to stride-2 downsampling or channel changes), the skip connection uses a $1 \times 1$ convolution with appropriate stride to match dimensions:

$$\mathbf{y} = \mathcal{F}(\mathbf{x}) + W_s \mathbf{x}$$

where $W_s$ is the projection matrix implemented as a $1 \times 1$ convolution.

### Architecture Variants

| Model | Layers | Parameters | FLOPs | Top-5 Error |
|-------|--------|------------|-------|-------------|
| ResNet-18 | 18 | 11.7M | 1.8B | 10.9% |
| ResNet-34 | 34 | 21.8M | 3.7B | 7.8% |
| ResNet-50 | 50 | 25.6M | 4.1B | 6.7% |
| ResNet-101 | 101 | 44.5M | 7.8B | 6.0% |
| ResNet-152 | 152 | 60.2M | 11.6B | 5.7% |

### Pre-activation ResNet

He et al. (2016) later proposed moving BN and ReLU before the convolution:

```
x -> BN -> ReLU -> Conv3x3 -> BN -> ReLU -> Conv3x3 -> (+x)
```

This "pre-activation" arrangement creates a true identity path and improves performance on CIFAR (4.62% error with a 1001-layer network). The identity mapping allows unimpeded gradient flow.

## Why It Matters

1. **Broke the depth barrier.** Before ResNet, networks beyond ~20 layers suffered from degradation. ResNet trained 152-layer networks successfully, and pre-activation variants scaled to 1001 layers.
2. **Surpassed human-level performance** on ImageNet (3.57% vs. ~5.1% human top-5 error), though this comparison has significant caveats about task definitions.
3. **Universal backbone.** ResNet-50 and ResNet-101 are the most common feature extractors for object detection (Faster R-CNN, YOLO), segmentation (Mask R-CNN, DeepLab), and many other vision tasks.
4. **Influenced all subsequent architectures.** Skip connections became ubiquitous: DenseNet, U-Net, Transformers (residual connections in each attention block), and even non-vision networks all incorporate this idea.

## Key Technical Details

- **Training**: SGD with momentum 0.9, weight decay $1 \times 10^{-4}$, batch size 256. Learning rate starts at 0.1 and is divided by 10 at epochs 30 and 60 (90 epochs total).
- **Initialization**: Kaiming (He) initialization, designed specifically for ReLU networks.
- **Batch normalization** is applied after every convolution and before ReLU (in the original formulation).
- **No dropout** is used -- BN provides sufficient regularization.
- **Global average pooling** replaces fully connected layers (except the final 1000-way FC), following GoogLeNet.
- **ResNet-50** has become the de facto benchmark model: 25.6M parameters, 4.1B FLOPs, and readily available pretrained in every major framework.
- **Gradient flow analysis**: In a plain network, gradients must pass through $L$ multiplicative weight matrices. With skip connections, the gradient has a direct path: $\frac{\partial \mathcal{L}}{\partial \mathbf{x}_l} = \frac{\partial \mathcal{L}}{\partial \mathbf{x}_L} \prod_{i=l}^{L-1} (1 + \frac{\partial \mathcal{F}_i}{\partial \mathbf{x}_i})$, ensuring the gradient never vanishes completely.

## Common Misconceptions

- **"Skip connections solve vanishing gradients."** More precisely, they provide an alternative gradient path that bypasses potentially vanishing paths. The residual branch can still have vanishing gradients, but the identity path ensures some gradient always flows through.
- **"ResNet learns identity mappings."** ResNet makes it easy to learn identity mappings when they are optimal, but the network typically learns non-trivial residual functions. The residuals tend to be small in magnitude, especially in deeper layers.
- **"More layers always help in ResNet."** Returns diminish: ResNet-152 is only 0.3% better than ResNet-101 in top-5 error despite 50 additional layers and 50% more computation. The architecture has practical depth limits governed by diminishing returns, not optimization failure.

## Connections to Other Concepts

- **VGGNet**: ResNet solved the degradation problem that limited VGG-style plain networks to ~19 effective layers.
- **Inception**: The bottleneck block's $1 \times 1$ convolutions for dimensionality reduction were inspired by Inception's approach. Inception-ResNet later combined both ideas.
- **DenseNet**: Extended the skip connection idea from single shortcuts to dense all-to-all connections within blocks.
- **Batch Normalization**: Essential component of ResNet; pre-activation variants reorganized the BN placement for better identity mapping.

## Further Reading

- He et al., "Deep Residual Learning for Image Recognition" (2016) -- The original ResNet paper.
- He et al., "Identity Mappings in Deep Residual Networks" (2016) -- Pre-activation ResNets with analysis of why clean identity paths matter.
- Veit et al., "Residual Networks Behave Like Ensembles of Relatively Shallow Networks" (2016) -- Analysis showing ResNets can be viewed as implicit ensembles.
