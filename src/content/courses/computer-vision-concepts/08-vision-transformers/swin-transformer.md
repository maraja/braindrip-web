# Swin Transformer

**One-Line Summary**: The Swin Transformer computes self-attention within local windows and shifts those windows between layers to achieve hierarchical feature maps and linear computational complexity with respect to image size.

**Prerequisites**: Vision Transformer (ViT), self-attention, feature pyramids, object detection, semantic segmentation

## What Is the Swin Transformer?

Imagine reading a newspaper by focusing on one column at a time, then shifting your gaze half a column over to catch information that spans column boundaries. You never try to read the entire page at once -- that would be overwhelming -- but by alternating your reading window, you eventually process every cross-column connection. The Swin Transformer applies this principle to image patches: it restricts attention to small local windows, then shifts those windows in alternating layers so information flows across boundaries.

The Swin Transformer, introduced by Liu et al. (2021) at Microsoft Research Asia, addresses two fundamental limitations of the original ViT: (1) ViT's quadratic complexity with image size makes it impractical for high-resolution dense prediction tasks, and (2) ViT produces single-scale features, while tasks like object detection and segmentation need multi-scale feature pyramids. Swin solves both problems, becoming the first general-purpose Transformer backbone competitive with CNNs on detection, segmentation, and classification simultaneously.

## How It Works

### Hierarchical Feature Maps via Patch Merging

Swin builds a feature pyramid analogous to a CNN backbone:

- **Stage 1**: $4 \times 4$ patch embedding, producing $\frac{H}{4} \times \frac{W}{4}$ tokens with dimension $C$
- **Stage 2**: Patch merging (concatenating $2 \times 2$ neighboring patches and projecting), producing $\frac{H}{8} \times \frac{W}{8}$ tokens with dimension $2C$
- **Stage 3**: $\frac{H}{16} \times \frac{W}{16}$ tokens, dimension $4C$
- **Stage 4**: $\frac{H}{32} \times \frac{W}{32}$ tokens, dimension $8C$

This produces feature maps at 4 scales, directly compatible with FPN, UNet, and other multi-scale architectures.

### Window-Based Multi-Head Self-Attention (W-MSA)

Instead of global self-attention over all $N$ tokens, Swin partitions the feature map into non-overlapping windows of size $M \times M$ (default $M = 7$). Attention is computed independently within each window:

$$\text{Attention}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{softmax}\left(\frac{\mathbf{QK}^T}{\sqrt{d}} + \mathbf{B}\right)\mathbf{V}$$

where $\mathbf{B}$ is a learnable relative position bias. The complexity of global self-attention is $O(N^2)$ where $N = HW/P^2$. Window attention reduces this to:

$$O\left(\frac{HW}{M^2} \cdot M^4\right) = O(HW \cdot M^2)$$

which is **linear in image size** $HW$ for a fixed window size $M$.

### Shifted Window Multi-Head Self-Attention (SW-MSA)

Window attention alone would isolate each window. Swin alternates between two configurations:

- **Layer $\ell$**: Regular window partition (W-MSA)
- **Layer $\ell+1$**: Windows shifted by $(\lfloor M/2 \rfloor, \lfloor M/2 \rfloor)$ pixels (SW-MSA)

The shift creates cross-window connections. To handle the uneven windows at image boundaries efficiently, Swin uses a **cyclic shift** with attention masking, avoiding any padding overhead.

### Relative Position Bias

Rather than absolute positional embeddings, Swin uses a learnable relative position bias $\mathbf{B} \in \mathbb{R}^{M^2 \times M^2}$ indexed from a bias table of size $(2M-1) \times (2M-1)$. This relative encoding is critical -- removing it drops ImageNet accuracy by ~1.2%.

### Model Variants

| Variant | C | Layers | Params | ImageNet Top-1 |
|---------|---|--------|--------|----------------|
| Swin-T | 96 | [2,2,6,2] | 29M | 81.3% |
| Swin-S | 96 | [2,2,18,2] | 50M | 83.0% |
| Swin-B | 128 | [2,2,18,2] | 88M | 83.5% |
| Swin-L | 192 | [2,2,18,2] | 197M | 86.3% (ImageNet-22K pre-train) |

## Why It Matters

1. **General-purpose backbone**: Swin was the first Transformer to serve as a drop-in replacement for CNN backbones across classification, detection, and segmentation.
2. **Linear complexity**: The window attention mechanism makes Swin practical for high-resolution inputs (1024x1024 and beyond) needed in medical imaging and satellite imagery.
3. **State-of-the-art dense prediction**: Swin-L achieved **58.7 box AP** on COCO object detection and **53.5 mIoU** on ADE20K semantic segmentation at the time of publication.
4. **Influenced subsequent designs**: Swin's hierarchical window approach inspired Swin V2, CSwin, and many other efficient Transformer architectures.

## Key Technical Details

- Default window size is $M = 7$, yielding $7 \times 7 = 49$ tokens per window -- small enough for efficient attention.
- The cyclic shift implementation avoids padding by rolling the feature map and using attention masks, adding negligible overhead.
- Swin uses **pre-norm** (LayerNorm before attention) rather than post-norm.
- Training uses AdamW, cosine schedule, 20-epoch warmup, and augmentations similar to DeiT (RandAugment, Mixup, CutMix, random erasing).
- Swin-B with $384 \times 384$ input pre-trained on ImageNet-22K reaches **86.4%** top-1 on ImageNet-1K.
- Swin V2 (Liu et al., 2022) scales to **3 billion parameters** and $1536 \times 1536$ resolution using log-spaced continuous relative position bias and residual post-normalization.

## Common Misconceptions

- **"Shifted windows are just a different form of dilated convolution."** Dilated convolutions sample sparse pixels at fixed offsets. Shifted window attention computes full pairwise attention among all tokens within the shifted window -- it captures arbitrary relationships, not just fixed spatial patterns.
- **"Swin doesn't have global attention, so it can't model long-range dependencies."** Information propagates across the entire image through successive shifted-window layers. After a few layers, the effective receptive field spans the full image, similar to how stacked $3 \times 3$ convolutions eventually reach global scope.
- **"Window size of 7 is always optimal."** The optimal window size depends on the task and resolution. Larger windows (e.g., 12 or 16) can improve accuracy at the cost of more compute, and some tasks benefit from adaptive window sizes.

## Connections to Other Concepts

- **Vision Transformer (ViT)**: Swin addresses ViT's quadratic cost and single-scale limitation by introducing local windows and hierarchical structure.
- **Attention in Vision**: Swin's windowed attention is a key instance of the broader design space for efficient attention in vision.
- **Hybrid CNN-Transformer**: Swin's hierarchical design mirrors CNN feature pyramids, making it a natural bridge between CNN and Transformer paradigms.
- **Vision Transformer Scaling**: Swin V2 demonstrates how windowed Transformers scale to billions of parameters and very high resolutions.

## Further Reading

- Liu et al., "Swin Transformer: Hierarchical Vision Transformer using Shifted Windows" (2021) -- The original Swin paper.
- Liu et al., "Swin Transformer V2: Scaling Up Capacity and Resolution" (2022) -- Scaling Swin to 3B parameters.
- Dong et al., "CSwin Transformer: A General Vision Transformer Backbone with Cross-Shaped Window Self-Attention" (2022) -- Cross-shaped windows as an alternative to shifted windows.
- Yang et al., "Focal Self-attention for Local-Global Interactions in Vision Transformers" (2021) -- Another approach to bridging local and global attention.
