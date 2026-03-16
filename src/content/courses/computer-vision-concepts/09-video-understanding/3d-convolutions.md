# 3D Convolutions

**One-Line Summary**: 3D convolutions extend standard 2D spatial filters with a temporal dimension, enabling neural networks to learn spatiotemporal features directly from raw video clips.

**Prerequisites**: 2D convolutions, convolutional neural networks, pooling operations, video representation, transfer learning

## What Is 3D Convolutions?

Consider a metal detector sweeping across a field: it scans left-right and forward-backward in two dimensions. Now imagine that detector also moves through layers of soil -- it simultaneously scans three dimensions. A 3D convolution does the same thing with video: instead of sliding a filter only across height and width of a single image, it slides across height, width, and time, detecting patterns that span multiple frames simultaneously.

Formally, a 3D convolution applies a kernel of size $k_t \times k_h \times k_w$ to an input tensor of shape $T \times H \times W \times C_{in}$, producing an output with $C_{out}$ channels. The operation at output position $(t, i, j)$ for output channel $n$ is:

$$y(t, i, j, n) = \sum_{c=1}^{C_{in}} \sum_{\tau=0}^{k_t-1} \sum_{p=0}^{k_h-1} \sum_{q=0}^{k_w-1} w(n, c, \tau, p, q) \cdot x(t+\tau, i+p, j+q, c) + b(n)$$

This joint spatiotemporal filtering allows the network to learn motion-aware features end-to-end without pre-computing optical flow.

## How It Works

### C3D: The Pioneer

C3D (Tran et al., 2015) was the first successful deep 3D CNN for video. Key design choices:

- All convolution kernels: $3 \times 3 \times 3$ (found optimal over $k_t \in \{1, 3, 5, 7\}$)
- Architecture: 8 convolutional layers, 5 max-pooling layers, 2 fully connected layers
- Input: 16-frame clips at $112 \times 112$
- Trained on Sports-1M dataset (1.1 million videos)
- UCF-101 accuracy: 82.3% (below two-stream at the time)

C3D was computationally expensive and had limited accuracy, but its learned features transferred well as generic video descriptors.

### I3D: Inflating 2D into 3D

Inflated 3D ConvNets (I3D) by Carreira and Zisserman (2017) addressed C3D's limitations by "inflating" proven 2D architectures. The key insight: a 2D kernel of size $k \times k$ pretrained on ImageNet can be expanded to $k \times k \times k$ by repeating the weights along the temporal dimension and dividing by $k$:

$$W_{3D}(\tau, p, q) = \frac{1}{k_t} W_{2D}(p, q) \quad \text{for } \tau = 0, \ldots, k_t - 1$$

This initialization ("bootstrapping") means the 3D network starts with the same effective function as the 2D network when applied to static inputs, then learns temporal patterns through fine-tuning.

I3D inflated the Inception-V1 (GoogLeNet) architecture:
- Two-stream I3D: 98.0% on UCF-101, 80.7% on HMDB-51
- RGB-only I3D: 95.6% on UCF-101, 74.8% on HMDB-51
- Trained on Kinetics-400 (first large-scale video dataset)

### R(2+1)D: Factorized 3D Convolutions

Tran et al. (2018) showed that a $3 \times 3 \times 3$ 3D convolution can be factorized into a spatial $1 \times 3 \times 3$ convolution followed by a temporal $3 \times 1 \times 1$ convolution. Benefits:

- Doubles the number of nonlinearities (ReLU between the two operations)
- Reduces parameters while maintaining the receptive field
- Easier to optimize: spatial and temporal patterns are learned separately
- R(2+1)D with ResNet-34 backbone: 95.7% on UCF-101

### SlowFast Networks

Feichtenhofer et al. (2019) proposed processing video at two temporal resolutions simultaneously:

**Slow pathway**: Operates at low frame rate ($T=4$ or $8$ frames, stride $\tau=16$). Uses a standard ResNet-like architecture with high channel capacity. Captures spatial semantics and appearance.

**Fast pathway**: Operates at high frame rate ($T=32$ or $64$ frames, stride $\tau=2$). Uses a lightweight architecture with reduced channels (typically $\beta = 1/8$ of the slow pathway). Captures fine-grained temporal patterns.

Lateral connections fuse information from fast to slow via:

$$\mathbf{x}^{\text{slow}}_{\text{fused}} = [\mathbf{x}^{\text{slow}}, \text{Transform}(\mathbf{x}^{\text{fast}})]$$

where Transform can be strided 3D convolution or temporal pooling to match dimensions. The fast pathway contributes only ~20% of total computation due to its thin architecture.

SlowFast-R101 achieves 79.8% top-1 on Kinetics-400, a significant result for its time.

### Computational Considerations

A single 3D convolution layer with $C_{in}$ input channels, $C_{out}$ output channels, and kernel $k_t \times k_h \times k_w$ has:

$$\text{Parameters} = C_{out} \times C_{in} \times k_t \times k_h \times k_w + C_{out}$$

The FLOPs scale as:

$$\text{FLOPs} = T_{out} \times H_{out} \times W_{out} \times C_{out} \times C_{in} \times k_t \times k_h \times k_w$$

For a $3 \times 3 \times 3$ kernel, this is $3\times$ the cost of a $3 \times 3$ 2D convolution -- and that multiplier compounds across all layers. A ResNet-50 3D model processes ~33 GFLOPs per clip versus ~4 GFLOPs for the 2D version.

## Why It Matters

1. **End-to-end motion learning**: 3D convolutions eliminate the need for pre-computed optical flow, removing a major preprocessing bottleneck (flow computation can be 10x slower than the network itself).
2. **State-of-the-art accuracy**: I3D and SlowFast established new benchmarks on Kinetics, Something-Something, and other video datasets, demonstrating that learned spatiotemporal features outperform hand-crafted motion representations.
3. **Transfer learning for video**: I3D's inflation trick enabled leveraging the massive ImageNet pretraining ecosystem for video, avoiding the need to train 3D networks from scratch on limited video data.
4. **Architectural design space**: The factorization insight (R(2+1)D, SlowFast) showed that temporal and spatial processing can be partially decoupled, leading to more efficient architectures.

## Key Technical Details

- Standard 3D kernel: $3 \times 3 \times 3$; temporal-only: $3 \times 1 \times 1$; spatial-only: $1 \times 3 \times 3$
- I3D input: 64 frames at $224 \times 224$; FLOPs: ~108 GFLOPs per clip
- SlowFast-R50: slow ($T=8, \tau=8$), fast ($T=32, \tau=2$); 36.1 GFLOPs; 77.0% top-1 on Kinetics-400
- SlowFast-R101 + NL: 79.8% top-1 on Kinetics-400 with non-local attention blocks
- R(2+1)D-34: 57.0 GFLOPs, 95.7% on UCF-101
- C3D: 38.5 GFLOPs, 82.3% on UCF-101
- Training typically requires 8--32 GPUs for Kinetics-scale datasets, taking 2--5 days
- Temporal pooling in early layers is generally avoided (preserves temporal resolution)

## Common Misconceptions

- **"3D convolutions are just 2D convolutions applied independently to each frame."** A 2D convolution applied per frame (i.e., $1 \times 3 \times 3$ kernel) shares no information across time. True 3D convolutions with $k_t > 1$ jointly process multiple frames, enabling the detection of motion patterns like direction changes and speed.
- **"3D CNNs always outperform two-stream networks."** On smaller datasets like UCF-101, two-stream networks with pre-computed flow can match or exceed 3D CNNs because explicit flow provides a strong prior. The advantage of 3D CNNs emerges at scale (Kinetics and beyond) where end-to-end learning prevails.
- **"SlowFast is a two-stream network."** While architecturally similar (two pathways), SlowFast is fundamentally different: both pathways process RGB at different temporal resolutions, whereas two-stream uses RGB and optical flow. SlowFast has lateral connections enabling information flow between pathways during processing.

## Connections to Other Concepts

- `two-stream-networks.md`: I3D was introduced as a two-stream architecture (RGB + flow), bridging the two-stream and 3D convolution paradigms.
- `video-representation.md`: 3D convolutions operate on the $T \times H \times W \times C$ tensor format.
- `video-transformers.md`: TimeSformer and ViViT emerged as alternatives to 3D CNNs, replacing local spatiotemporal filtering with global self-attention.
- `action-recognition.md`: The primary evaluation benchmark for 3D convolution architectures.
- `optical-flow-estimation.md`: 3D CNNs reduce (but do not eliminate) the reliance on pre-computed flow.

## Further Reading

- Tran et al., "Learning Spatiotemporal Features with 3D Convolutional Networks" (2015) -- C3D: the first large-scale 3D CNN for video feature learning.
- Carreira & Zisserman, "Quo Vadis, Action Recognition? A New Model and the Kinetics Dataset" (2017) -- I3D with inflation from 2D to 3D and the Kinetics dataset.
- Tran et al., "A Closer Look at Spatiotemporal Convolutions for Action Recognition" (2018) -- R(2+1)D factorized convolutions.
- Feichtenhofer et al., "SlowFast Networks for Video Recognition" (2019) -- Dual-pathway architecture with asymmetric temporal resolution.
