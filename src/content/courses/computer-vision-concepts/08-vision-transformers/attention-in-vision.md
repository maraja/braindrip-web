# Attention Mechanisms in Vision

**One-Line Summary**: Applying self-attention to images requires careful handling of 2D spatial structure, patch size tradeoffs, and the quadratic cost of attention over thousands of visual tokens -- design choices that fundamentally shape every vision Transformer.

**Prerequisites**: Self-attention, Vision Transformer (ViT), computational complexity, convolutional neural networks, positional encoding

## What Is Attention in Vision?

Imagine a security guard monitoring a wall of surveillance screens. With a few screens (say 4), the guard can easily compare every pair of feeds to spot coordinated activity. With 100 screens, comparing all pairs becomes overwhelming -- there are 4,950 pairs to track. With 1,000 screens, it's 499,500 pairs. This is the fundamental challenge of self-attention in vision: images naturally decompose into many more tokens than text sequences, and the pairwise cost grows quadratically.

A $224 \times 224$ image with $16 \times 16$ patches produces 196 tokens -- manageable. But a $1024 \times 1024$ medical image with the same patch size yields 4,096 tokens, and attention cost scales as $O(N^2)$. At $2048 \times 2048$ (common in pathology), the 16,384 tokens make standard attention infeasible. This section covers the core design decisions that make attention work for images: how to encode spatial position in 2D, how patch size trades off resolution for efficiency, why the quadratic cost is particularly painful for vision, and how windowed attention provides a practical escape.

## How It Works

### 2D Positional Encoding

Unlike text, image tokens have spatial structure in two dimensions. Several encoding strategies exist:

**Learnable 1D embeddings** (ViT): Flatten patches into a 1D sequence and learn a separate embedding for each position. Surprisingly, this works well -- the model learns 2D structure from data. Dosovitskiy et al. (2020) reported negligible benefit from explicit 2D encodings.

**Learnable 2D embeddings**: Assign separate embeddings for row and column indices. A patch at position $(i, j)$ receives $\mathbf{e}_{\text{row}}^i + \mathbf{e}_{\text{col}}^j$. This reduces parameters from $N \times D$ to $(H/P + W/P) \times D$.

**Sinusoidal 2D embeddings**: Extend the original sinusoidal encoding from Vaswani et al. (2017) to two dimensions, using different frequency bands for height and width.

**Relative position bias** (Swin, CoAtNet): Instead of absolute positions, encode the relative offset $(i_1 - i_2, j_1 - j_2)$ between pairs of tokens as a bias added to the attention logits:

$$\text{Attention}_{i,j} = \frac{q_i \cdot k_j}{\sqrt{d}} + B_{(r_i - r_j, c_i - c_j)}$$

where $B$ is a learnable bias table indexed by relative position. This approach generalizes better to different resolutions and is the dominant choice in modern architectures.

**Rotary Position Embedding (RoPE)**: Originally from NLP, RoPE has been adapted for 2D images by applying separate rotations for x and y coordinates. Used in EVA and some recent ViT variants, RoPE supports variable resolution without interpolation.

### Patch Size Tradeoffs

Patch size $P$ determines the number of tokens $N = (H \times W) / P^2$ and directly controls the resolution-efficiency tradeoff:

| Patch Size | Tokens (224x224) | Tokens (512x512) | Attention FLOPs Ratio |
|-----------|-----------------|-----------------|----------------------|
| 32x32 | 49 | 256 | 1x |
| 16x16 | 196 | 1024 | 16x |
| 14x14 | 256 | 1369 | 27x |
| 8x8 | 784 | 4096 | 256x |

Key observations:

- **Smaller patches preserve finer detail** but dramatically increase compute. ViT-B/16 is 4x more expensive than ViT-B/32.
- **Larger patches lose spatial information**. For dense prediction tasks (segmentation, detection), $16 \times 16$ or $14 \times 14$ patches are the practical minimum.
- **Non-square patches** are rarely used because standard image augmentations assume square spatial structure.
- The patch embedding projection is a single convolution with kernel = stride = $P$. Some architectures use overlapping patches (stride < kernel) for slightly better features at marginally higher cost.

### The Quadratic Cost Problem

Standard self-attention computes pairwise similarities among all $N$ tokens:

$$O(\text{self-attention}) = O(N^2 \cdot d)$$

For a $224 \times 224$ image with $P = 16$: $N = 196$, yielding $196^2 = 38,416$ pairwise interactions per head. This is comparable to typical NLP sequence lengths and remains tractable.

For a $1024 \times 1024$ image: $N = 4096$, yielding $4096^2 \approx 16.8M$ interactions -- roughly $430\times$ the cost of the 224-pixel case. This makes standard ViT impractical for high-resolution inputs without modification.

Memory is an equally critical bottleneck. The attention matrix $\mathbf{A} \in \mathbb{R}^{N \times N}$ per head consumes $N^2 \times 4$ bytes in float32. For $N = 4096$ and 12 heads: $4096^2 \times 12 \times 4 \approx 768$ MB just for attention weights.

### Windowed and Efficient Attention

Several strategies address the quadratic cost:

**Windowed attention** (Swin Transformer): Restrict attention to local $M \times M$ windows (typically $M = 7$), reducing cost to $O(N \cdot M^2)$. Shifted windows in alternating layers restore cross-window communication.

**Dilated/strided attention**: Attend to every $k$-th token, reducing the effective sequence length by a factor of $k$. Used in some efficient Transformer variants.

**Linear attention**: Replace softmax attention with kernel-based approximations, reducing complexity to $O(N \cdot d^2)$. Methods like Performer and linear attention variants achieve this but often sacrifice accuracy.

**Flash Attention** (Dao et al., 2022): Not a change to the attention pattern but an IO-aware implementation that fuses the attention computation to avoid materializing the $N \times N$ matrix in GPU HBM. Reduces memory from $O(N^2)$ to $O(N)$ and provides 2-4x wall-clock speedup. This has become the default attention implementation.

**Neighborhood attention** (NAT, Hassani et al., 2023): Each token attends to its $k \times k$ nearest spatial neighbors. More flexible than rigid windows; can be implemented efficiently with NATTEN kernels.

### Multi-Scale Attention

Some architectures vary the attention scope across layers:

- **Early layers**: Local/windowed attention (cheap, captures local structure)
- **Later layers**: Global attention (expensive, captures semantics)

This mirrors the receptive field growth in CNNs and is used in architectures like CrossFormer and MaxViT (which alternates between block and grid attention within each stage).

## Why It Matters

1. **Determines practical resolution limits**: The attention mechanism directly constrains the maximum image resolution a vision Transformer can handle.
2. **Dictates architecture design**: Every major design difference between ViT, Swin, and their successors comes down to how they handle attention's cost and spatial structure.
3. **Affects what features are learned**: Global attention from layer 1 (ViT) produces different representations than progressive local-to-global attention (Swin, CNN hybrids).
4. **Enables new applications**: Efficient attention mechanisms make Transformers viable for video (spatiotemporal tokens), 3D medical imaging, and gigapixel pathology slides.

## Key Technical Details

- Flash Attention reduces peak memory from $O(N^2)$ to $O(N)$ by computing attention in tiles and never materializing the full attention matrix. It is now the standard implementation in PyTorch 2.0+.
- Relative position biases generalize better to unseen resolutions than absolute embeddings. When transferring ViT from 224 to 384 resolution, absolute embeddings require interpolation; relative biases need no modification if the window size stays constant.
- For dense prediction, most architectures use $P = 16$ and upsample features with FPN or decoder heads. Using $P = 4$ directly would yield 3,136 tokens for a $224 \times 224$ image -- feasible but expensive.
- The attention pattern in early ViT layers often resembles local convolutions (attending primarily to nearby patches), while later layers exhibit global patterns. This has been empirically confirmed by Raghu et al. (2021).

## Common Misconceptions

- **"Self-attention gives every patch global context from layer 1."** While theoretically true, in practice early-layer attention weights are sharply peaked on local neighbors. The effective receptive field grows gradually across layers, similar to CNNs, just with a softer boundary.
- **"Windowed attention sacrifices too much quality."** Swin Transformer matches or exceeds ViT's accuracy with windowed attention plus shifting. The combination of local attention with cross-window communication is sufficient for strong performance on nearly all benchmarks.
- **"You need special 2D positional encodings for vision."** The original ViT with simple 1D learnable embeddings achieved top results. The model's patch layout is fixed, so 1D position indices implicitly encode 2D structure. That said, relative position bias does provide a measurable improvement (~1%).

## Connections to Other Concepts

- `vision-transformer.md`: Uses global self-attention with 1D positional embeddings -- the simplest attention-in-vision design.
- `swin-transformer.md`: The most influential instance of windowed attention for vision.
- `hybrid-cnn-transformer.md`: CNN early layers avoid the attention cost problem entirely at high resolutions.
- `masked-image-modeling.md`: MAE's 75% masking dramatically reduces the number of tokens the encoder must attend to, sidestepping the quadratic cost during pre-training.
- `vision-transformer-scaling.md`: Efficient attention mechanisms determine how far vision Transformers can scale in resolution and sequence length.

## Further Reading

- Vaswani et al., "Attention Is All You Need" (2017) -- Original self-attention mechanism.
- Dao et al., "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness" (2022) -- The dominant efficient attention implementation.
- Raghu et al., "Do Vision Transformers See Like Convolutional Neural Networks?" (2021) -- Analysis of ViT attention patterns versus CNN features.
- Hassani et al., "Neighborhood Attention Transformer" (2023) -- Flexible local attention with NATTEN kernels.
- Tu et al., "MaxViT: Multi-Axis Vision Transformer" (2022) -- Alternating block and grid attention for multi-scale processing.
