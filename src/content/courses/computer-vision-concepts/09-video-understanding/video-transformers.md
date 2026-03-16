# Video Transformers

**One-Line Summary**: Video transformers apply self-attention to spatiotemporal tokens extracted from video, achieving strong accuracy but facing a quadratic cost challenge that demands factorized attention strategies.

**Prerequisites**: Vision transformers (ViT), self-attention mechanism, positional encoding, 3D convolutions, video representation

## What Is Video Transformers?

Imagine trying to understand a complex scene by looking at every detail in relation to every other detail -- not just in the current moment, but across time. A detective reviewing security footage might note that a person in frame 1 is connected to a bag in frame 50 and a car in frame 100. Video transformers work similarly: they break the video into small spatiotemporal patches (tokens) and use self-attention to let every patch attend to every other patch across space and time, capturing long-range dependencies that local convolutions miss.

Video transformers extend the Vision Transformer (ViT) paradigm from images to video. The input video is divided into spatiotemporal tokens (either frame-level patches or volumetric "tubelets"), which are linearly embedded and processed through transformer encoder layers. The central challenge is that the number of tokens scales as $O(T \times H \times W)$, and self-attention is $O(N^2)$ in the number of tokens $N$, making naive full spatiotemporal attention prohibitively expensive.

## How It Works

### Tokenization

A video of shape $T \times H \times W \times 3$ is divided into tokens. Two main strategies exist:

**Frame-level patches**: Each frame is independently divided into $\frac{H}{p} \times \frac{W}{p}$ patches of size $p \times p$. For $T$ frames, total tokens:

$$N = T \times \frac{H}{p} \times \frac{W}{p}$$

With $T=8, H=W=224, p=16$: $N = 8 \times 14 \times 14 = 1{,}568$ tokens.

**Tubelet embedding**: The video is divided into non-overlapping 3D volumes of size $t \times p \times p$ and each is linearly projected:

$$N = \frac{T}{t} \times \frac{H}{p} \times \frac{W}{p}$$

With $t=2, T=16, p=16, H=W=224$: $N = 8 \times 14 \times 14 = 1{,}568$ tokens. Tubelets capture local temporal information within each token.

### TimeSformer: Divided Space-Time Attention

Bertasius et al. (2021) proposed TimeSformer, which avoids full spatiotemporal attention by factorizing it into separate operations:

1. **Temporal attention**: Each spatial patch attends only to patches at the same spatial location across all frames. For a patch at position $(h, w)$, it attends to the $T$ tokens at $(t', h, w)$ for all $t'$.

2. **Spatial attention**: Each patch attends only to patches within the same frame. For a patch at time $t$, it attends to all $\frac{H}{p} \times \frac{W}{p}$ tokens at $(t, h', w')$.

These are applied sequentially within each transformer block. The cost per block drops from $O(N^2 \cdot d)$ for full attention to:

$$O\left(T \cdot S \cdot d + S \cdot T \cdot d\right) \cdot \frac{N}{S} + \frac{N}{T} \cdot \text{terms}$$

Simplified, the cost scales as $O(N \cdot (T + S) \cdot d)$ rather than $O(N^2 \cdot d)$, where $S = \frac{H}{p} \times \frac{W}{p}$ is the number of spatial tokens per frame.

TimeSformer-L with $T=96$ frames: 79.7% top-1 on Kinetics-400.

### ViViT: Factorized Encoder

Arnab et al. (2021) proposed ViViT with four attention variants:

**Model 1 -- Spatio-temporal attention**: Full self-attention over all $N$ tokens. Most accurate but $O(N^2)$ cost. Impractical for long videos.

**Model 2 -- Factorized encoder**: Two separate transformer encoders. First, a spatial encoder processes patches within each frame independently ($T$ parallel forward passes). Then, a temporal encoder processes the [CLS] tokens (or averaged spatial tokens) across frames. Cost: $O(T \cdot S^2 \cdot d + T^2 \cdot d)$.

**Model 3 -- Factorized self-attention**: Similar to TimeSformer's divided attention but within a single encoder. Spatial and temporal attention alternate within each block.

**Model 4 -- Factorized dot-product attention**: Computes spatial and temporal attention heads separately within the same multi-head attention layer (some heads attend spatially, others temporally).

ViViT-L/16x2 (Model 2): 81.3% top-1 on Kinetics-400 (with JFT-300M pretraining).

### VideoMAE: Self-Supervised Video Transformers

Tong et al. (2022) showed that masked autoencoding is highly effective for video transformers. By masking a very high ratio (90--95%) of spatiotemporal tubes and reconstructing them, VideoMAE learns strong representations without labels. Key findings:

- 90% masking ratio for video (vs. 75% for images) due to temporal redundancy
- VideoMAE with ViT-B: 81.5% on Kinetics-400 (self-supervised, then fine-tuned)
- Data-efficient: competitive results with only 3.5k training videos on SSv2

### Computational Reality

For a ViT-B model with $d=768$, 12 layers, and $N$ tokens, the self-attention cost per layer is:

$$\text{FLOPs}_{\text{attn}} = 4Nd^2 + 2N^2 d$$

The $2N^2 d$ term dominates for large $N$. With $N=3{,}136$ (32 frames, 224x224, patch 16):

- Full attention per layer: ~15.1 GFLOPs
- Factorized (TimeSformer-style) per layer: ~2.3 GFLOPs
- Full model (12 layers + FFN): ~590 GFLOPs (full) vs. ~180 GFLOPs (factorized)

Memory scales similarly: storing the $N \times N$ attention matrix for $N=3{,}136$ requires ~37 MB per head per layer in FP32.

## Why It Matters

1. **Long-range temporal modeling**: Self-attention captures dependencies across the entire video in a single layer, whereas 3D CNNs require many layers to achieve a comparable temporal receptive field.
2. **Scalability with data**: Video transformers benefit significantly from large-scale pretraining (Kinetics-710, JFT-300M) and self-supervised learning (VideoMAE), with accuracy continuing to improve with more data.
3. **Flexible attention patterns**: Factorized attention enables architectural experimentation impossible with fixed convolution kernels -- different layers can focus on different spatiotemporal patterns.
4. **State-of-the-art accuracy**: Video transformers (especially with MAE pretraining) hold top results on Kinetics-400 (87--88%), Something-Something V2 (~77%), and other benchmarks.

## Key Technical Details

- TimeSformer-HR (high resolution, $T=16$, $448 \times 448$): 80.7% top-1 on Kinetics-400, 1703 GFLOPs
- ViViT-L/16x2 (factorized encoder): 81.3% on K400 (JFT pretrained), 3992 GFLOPs x 4 views
- VideoMAE V2 ViT-g: 87.4% on Kinetics-400 (at time of publication)
- Standard training: AdamW optimizer, cosine learning rate schedule, 0.1--0.2 label smoothing
- Positional embeddings: learned or sinusoidal; separate spatial and temporal embeddings are common
- Inference: 4--12 temporal clips x 1--3 spatial crops, averaged
- Typical training: 32--64 GPUs, 1--3 days on Kinetics-400

## Common Misconceptions

- **"Video transformers always outperform 3D CNNs."** On datasets where temporal reasoning is critical (Something-Something V2), transformers show clear advantages. On appearance-dominated datasets (Kinetics), the gap over well-tuned 3D CNNs like SlowFast is modest (1--3%). Efficiency-wise, 3D CNNs are often faster at inference.
- **"Full spatiotemporal attention is always best."** TimeSformer's divided attention and ViViT's factorized encoder achieve comparable accuracy to full attention at a fraction of the cost. Full attention shows diminishing returns beyond short temporal windows because nearby frames are highly redundant.
- **"Video transformers don't need convolutions."** Many top-performing video transformers incorporate convolutional components: tubelet embedding (3D convolution for tokenization), convolutional position encoding, and hybrid architectures like MViT that use pooling attention.

## Connections to Other Concepts

- `3d-convolutions.md`: Video transformers emerged as alternatives, though hybrid designs combining both remain competitive.
- `video-representation.md`: Tubelet tokenization defines how raw video is converted into the token sequence transformers process.
- `action-recognition.md`: The primary benchmark task driving video transformer development.
- `two-stream-networks.md`: Some video transformers adopt two-stream designs (RGB + flow or RGB at two resolutions).
- `video-object-tracking.md`: Transformer-based trackers (STARK, MixFormer) adapt video transformer ideas for tracking.

## Further Reading

- Bertasius et al., "Is Space-Time Attention All You Need for Video Understanding?" (2021) -- TimeSformer with divided space-time attention.
- Arnab et al., "ViViT: A Video Vision Transformer" (2021) -- Systematic exploration of factorized video transformer designs.
- Fan et al., "Multiscale Vision Transformers" (2021) -- MViT with pooling attention for efficient multi-scale spatiotemporal processing.
- Tong et al., "VideoMAE: Masked Autoencoders are Data-Efficient Learners for Self-Supervised Video Pre-Training" (2022) -- Self-supervised pretraining with 90% masking ratio.
