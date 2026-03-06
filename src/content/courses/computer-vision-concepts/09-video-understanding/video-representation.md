# Video Representation

**One-Line Summary**: Video representation converts raw video into structured tensors suitable for neural networks through frame stacking, temporal differencing, and clip sampling strategies.

**Prerequisites**: Convolutional neural networks, image tensors (H x W x C), data augmentation, batch normalization

## What Is Video Representation?

Think of a flipbook: each page is a still image, but flipping through them quickly creates the illusion of motion. A video representation is the computational equivalent of deciding how to organize those pages for a neural network -- how many pages to include, whether to show the raw drawings or highlight the differences between consecutive pages, and how to stack everything into a single block the network can process.

Technically, video representation is the mapping from a raw video (a sequence of frames at a given resolution and frame rate) into a fixed-size tensor that a model can ingest. The dominant format is a 4D tensor of shape $T \times H \times W \times C$, where $T$ is the number of temporal frames, $H$ and $W$ are spatial dimensions, and $C$ is the channel count (typically 3 for RGB). The design choices around $T$, sampling strategy, and what goes into $C$ have profound effects on both accuracy and compute cost.

## How It Works

### Frame Stacking

The simplest approach stacks $T$ consecutive RGB frames into a tensor of shape $T \times H \times W \times 3$. Common choices for $T$ range from 8 (lightweight models) to 64 (high-accuracy models like SlowFast). Doubling $T$ roughly doubles memory consumption for 3D convolution-based models.

For 2D CNN approaches that lack a temporal dimension, frames can be concatenated along the channel axis, producing a tensor of shape $H \times W \times (T \times 3)$. This was used in early work but sacrifices temporal structure.

### Temporal Stride and Clip Sampling

Raw videos at 30 fps contain massive redundancy. Temporal stride $\tau$ selects every $\tau$-th frame, so a clip of $T$ frames with stride $\tau$ covers $T \times \tau$ original frames. Common configurations:

- **Dense sampling**: $T=8, \tau=8$ covers 64 frames (~2.1s at 30 fps)
- **Sparse sampling**: $T=16, \tau=4$ covers 64 frames with finer granularity
- **TSN-style sampling**: Divide the video into $T$ equal segments and sample one frame per segment, covering the entire video regardless of length

During training, temporal jittering randomly shifts the starting frame within each segment. During inference, multi-clip evaluation (e.g., 10 clips x 3 spatial crops = 30 views) is standard, with predictions averaged.

### Temporal Difference

Instead of raw RGB values, temporal difference frames encode motion:

$$D_t = I_{t+1} - I_t$$

where $I_t$ is frame $t$. These difference images highlight moving regions and suppress static backgrounds. They can be stacked as additional channels alongside RGB, yielding $C = 3 + 3 = 6$ channels per frame pair, or used independently.

### Optical Flow as Representation

Pre-computed optical flow fields provide dense motion vectors $(u, v)$ per pixel. Stacking $L$ consecutive flow fields produces a tensor of shape $H \times W \times 2L$. Simonyan and Zisserman (2014) used $L=10$, yielding 20 input channels for the temporal stream. This remains one of the strongest motion representations but requires expensive pre-computation (e.g., TV-L1 flow at ~0.5 seconds per frame pair on CPU).

### Modern Tokenization for Transformers

Video transformers like ViViT partition the video into non-overlapping spatiotemporal tubes of size $t \times h \times w$, where typical values are $t=2, h=16, w=16$. Each tube is linearly projected into a token embedding. For a video of shape $T \times H \times W$, this produces:

$$N = \frac{T}{t} \times \frac{H}{h} \times \frac{W}{w}$$

tokens. With $T=32, H=224, W=224$, and the above patch sizes, $N = 16 \times 14 \times 14 = 3{,}136$ tokens -- a significant computational burden.

## Why It Matters

1. **Accuracy-compute tradeoff**: The choice of $T$ and $\tau$ determines how much temporal context the model sees versus how much compute it uses. SlowFast networks exploit this by running two pathways at different frame rates.
2. **Storage and preprocessing**: Kinetics-400 raw videos occupy ~450 GB; pre-extracted frames at 224x224 consume ~1.2 TB. Representation choices dictate storage infrastructure.
3. **Training efficiency**: Clip sampling with temporal stride allows coverage of long videos without proportional memory growth, enabling training on standard GPU memory (16--80 GB).
4. **Downstream task matching**: Action recognition benefits from short clips (2--10s), while activity detection and video understanding require representations spanning minutes.

## Key Technical Details

- Standard input size for most benchmarks: $T \times 224 \times 224 \times 3$, with $T \in \{8, 16, 32, 64\}$
- SlowFast uses $T=64, \tau=2$ for the slow pathway and $T=64, \tau=2/\alpha$ with $\alpha=8$ for the fast pathway
- Multi-clip testing typically uses 10 temporal clips x 3 spatial crops, increasing inference cost by 30x
- TSN-style sampling with $T=8$ segments achieves competitive accuracy while covering entire videos
- Temporal difference is essentially a high-pass temporal filter and loses absolute appearance information
- Pre-computing optical flow for Kinetics-400 (~240k videos) can take weeks on a single machine without GPU-accelerated flow

## Common Misconceptions

- **"More frames always means better accuracy."** Beyond a saturation point (often around $T=32$ for action recognition), additional frames yield diminishing returns while linearly increasing compute. The temporal stride matters as much as the frame count.
- **"Videos should always be processed at their native frame rate."** Most successful models aggressively subsample. Processing 30 fps directly is wasteful for most recognition tasks where actions unfold over seconds, not milliseconds.
- **"RGB frames contain all the information needed."** While theoretically true, explicitly encoding motion through optical flow or temporal differences provides a strong inductive bias that helps models learn faster and with less data, though modern large-scale training is closing this gap.

## Connections to Other Concepts

- **Optical Flow Estimation**: Provides the dense motion fields used as an alternative representation channel.
- **Two-Stream Networks**: Architecture that processes RGB and flow representations in parallel pathways.
- **3D Convolutions**: Operate directly on the $T \times H \times W \times C$ tensor to extract spatiotemporal features.
- **Video Transformers**: Tokenize the video tensor into spatiotemporal patches for self-attention.
- **Action Recognition**: The primary downstream task driving representation design choices.

## Further Reading

- Simonyan & Zisserman, "Two-Stream Convolutional Networks for Action Recognition in Videos" (2014) -- Introduced the dual RGB + optical flow representation paradigm.
- Wang et al., "Temporal Segment Networks: Towards Good Practices for Deep Action Recognition" (2016) -- Proposed segment-based sampling for long-range temporal modeling.
- Feichtenhofer et al., "SlowFast Networks for Video Recognition" (2019) -- Dual-pathway architecture exploiting different temporal resolutions.
- Arnab et al., "ViViT: A Video Vision Transformer" (2021) -- Introduced tubelet tokenization for video transformers.
