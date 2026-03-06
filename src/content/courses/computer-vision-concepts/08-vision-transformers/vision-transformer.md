# Vision Transformer (ViT)

**One-Line Summary**: The Vision Transformer splits an image into fixed-size patches, treats each patch as a token, and processes the sequence with a standard Transformer encoder to perform image classification.

**Prerequisites**: Self-attention, positional encoding, Transformer architecture, image classification, transfer learning

## What Is the Vision Transformer?

Imagine cutting a photograph into a grid of small squares, then reading those squares left-to-right, top-to-bottom like words in a sentence. A language model could then "read" the image the same way it reads text. That is essentially what the Vision Transformer (ViT) does: it converts a 2D image into a 1D sequence of patch embeddings and feeds them into a Transformer encoder originally designed for natural language.

Formally, an image $\mathbf{x} \in \mathbb{R}^{H \times W \times C}$ is reshaped into a sequence of $N = HW / P^2$ flattened patches, each of size $P \times P \times C$. Each patch is linearly projected into a $D$-dimensional embedding. A learnable class token $[\texttt{CLS}]$ is prepended, and learnable 1D positional embeddings are added before the sequence enters $L$ layers of multi-head self-attention.

ViT was introduced by Dosovitskiy et al. (2020) at Google Brain and demonstrated that a pure Transformer, with no convolutional layers whatsoever, can match or exceed state-of-the-art CNNs when pre-trained on sufficient data.

## How It Works

### Patch Embedding

Given a $224 \times 224 \times 3$ image and patch size $P = 16$:

$$N = \frac{224 \times 224}{16 \times 16} = 196 \text{ patches}$$

Each patch is flattened to a vector of length $16 \times 16 \times 3 = 768$ and projected through a linear layer $\mathbf{E} \in \mathbb{R}^{768 \times D}$ to produce the patch embedding. This linear projection is equivalent to a single convolutional layer with kernel size and stride both equal to $P$.

### Class Token and Positional Embeddings

A learnable $[\texttt{CLS}]$ token embedding $\mathbf{z}_0^0 \in \mathbb{R}^D$ is prepended, yielding a sequence of length $N + 1 = 197$. Learnable 1D positional embeddings $\mathbf{E}_{\text{pos}} \in \mathbb{R}^{(N+1) \times D}$ are added element-wise. The authors found that 2D-aware positional embeddings offered negligible improvement over simple 1D embeddings.

### Transformer Encoder

The sequence passes through $L$ identical blocks, each consisting of:

1. Layer normalization
2. Multi-head self-attention (MSA)
3. Residual connection
4. Layer normalization
5. MLP (two linear layers with GELU activation)
6. Residual connection

$$\mathbf{z}'_\ell = \text{MSA}(\text{LN}(\mathbf{z}_{\ell-1})) + \mathbf{z}_{\ell-1}$$
$$\mathbf{z}_\ell = \text{MLP}(\text{LN}(\mathbf{z}'_\ell)) + \mathbf{z}'_\ell$$

### Classification Head

The final representation of the $[\texttt{CLS}]$ token $\mathbf{z}_L^0$ is fed to a linear classification head during pre-training and a smaller MLP head during fine-tuning.

### Model Variants

| Variant | Layers | Hidden Dim | Heads | Params |
|---------|--------|-----------|-------|--------|
| ViT-Base (ViT-B/16) | 12 | 768 | 12 | 86M |
| ViT-Large (ViT-L/16) | 24 | 1024 | 16 | 307M |
| ViT-Huge (ViT-H/14) | 32 | 1280 | 16 | 632M |

The notation ViT-B/16 means Base model with $16 \times 16$ patches. ViT-B/32 uses $32 \times 32$ patches, yielding only 49 tokens for a 224-pixel image and running roughly 4x faster.

## Why It Matters

1. **Architectural unification**: ViT showed that the same Transformer architecture used for language can handle vision, enabling shared tooling and multi-modal models.
2. **Scalability**: ViT scales more gracefully than CNNs -- performance improves log-linearly with compute and data without saturating as quickly.
3. **Global receptive field**: Every patch attends to every other patch from layer 1, unlike CNNs that build receptive fields gradually.
4. **Foundation for multi-modal AI**: Models like CLIP, DALL-E, and GPT-4V build directly on ViT-style vision encoders.

## Key Technical Details

- Pre-trained on JFT-300M (Google internal), ViT-H/14 achieved **88.55%** top-1 on ImageNet, exceeding the prior CNN SOTA.
- When trained only on ImageNet-1K (1.28M images), ViT-B/16 underperforms a comparable ResNet -- large-scale pre-training is critical.
- Fine-tuning at higher resolution (e.g., 384 or 512) is common; positional embeddings are bilinearly interpolated to handle the longer sequence.
- Training uses learning rate warmup, cosine decay, and heavy regularization (dropout, stochastic depth) for the smaller data regimes.
- Inference throughput for ViT-B/16 is comparable to ResNet-50 on modern GPU hardware despite higher FLOPs, thanks to Transformer-optimized kernels.

## Common Misconceptions

- **"ViT has no inductive bias for images, so it can never work on small datasets."** While ViT lacks the translation equivariance of convolutions, techniques like DeiT, strong augmentation, and distillation have closed the gap on ImageNet-1K training. The inductive bias gap narrows with more data but is not an absolute barrier.
- **"The class token is essential."** Global average pooling over all patch tokens works equally well or better in many settings; the class token is a design choice inherited from BERT, not a requirement.
- **"Patch size doesn't matter much."** Reducing patch size from 16 to 14 increases the sequence length from 196 to 256, raising compute quadratically. Patch size is a critical accuracy-efficiency tradeoff.

## Connections to Other Concepts

- **DeiT**: Demonstrated that ViT can be trained effectively on ImageNet-1K alone using distillation and strong augmentation.
- **Swin Transformer**: Introduced hierarchical features and windowed attention to address ViT's quadratic cost and single-resolution limitation.
- **Attention in Vision**: ViT's core mechanism; understanding 2D positional encoding and patch-size tradeoffs deepens understanding of ViT design choices.
- **DINO**: Uses ViT as the backbone for self-supervised learning, revealing that attention heads learn semantic segmentation without labels.
- **Vision Transformer Scaling**: Quantifies how much data ViT needs to overtake CNNs and how performance grows with model size.

## Further Reading

- Dosovitskiy et al., "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale" (2020) -- The original ViT paper.
- Vaswani et al., "Attention Is All You Need" (2017) -- The Transformer architecture that ViT adapts.
- Steiner et al., "How to Train Your ViT? Data, Augmentation, and Regularization in Vision Transformers" (2021) -- Practical training recipes for ViT.
- Beyer et al., "Better plain ViT baselines for ImageNet-1k" (2022) -- Shows that simple tweaks make ViT competitive on ImageNet-1K without distillation.
