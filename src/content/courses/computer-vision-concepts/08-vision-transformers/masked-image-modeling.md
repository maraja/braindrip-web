# Masked Image Modeling

**One-Line Summary**: Masked Image Modeling (MIM) pre-trains vision Transformers by masking a large portion of image patches and training the model to reconstruct the missing content -- either as discrete visual tokens (BEiT) or raw pixels (MAE).

**Prerequisites**: Vision Transformer (ViT), self-supervised learning, autoencoders, tokenization, BERT

## What Is Masked Image Modeling?

Imagine a jigsaw puzzle where 75% of the pieces are hidden. A skilled puzzle solver can infer the missing pieces from the visible ones because natural images have strong structure: edges continue, textures repeat, and objects have coherent shapes. Masked Image Modeling trains a neural network to be that puzzle solver. By learning to predict the missing patches, the model develops rich visual representations that transfer well to downstream tasks.

MIM is the vision analog of masked language modeling (MLM), the pre-training objective behind BERT. Where BERT masks ~15% of text tokens and predicts them, MIM masks a much larger fraction of image patches (often 75%) and reconstructs them. The key insight is that images are far more redundant than text -- neighboring patches share considerable information -- so a high masking ratio is both feasible and necessary to create a meaningful learning challenge.

## How It Works

### BEiT: Discrete Token Reconstruction

BEiT (Bao et al., 2022, Microsoft) takes a two-stage approach:

**Stage 1 -- Train a visual tokenizer**: A discrete variational autoencoder (dVAE) compresses each $16 \times 16$ patch into one of 8192 discrete visual tokens. This tokenizer is trained separately on the image dataset.

**Stage 2 -- Masked prediction**: Approximately 40% of patches are masked. The ViT encoder processes the corrupted image (with mask tokens replacing the masked patches). The model predicts the discrete token ID for each masked position using a cross-entropy loss:

$$\mathcal{L}_{\text{BEiT}} = -\sum_{i \in \mathcal{M}} \log P(z_i \mid \mathbf{x}_{\setminus \mathcal{M}})$$

where $\mathcal{M}$ is the set of masked positions and $z_i$ is the dVAE token for patch $i$.

BEiT-3 (Wang et al., 2023) extends this to a multimodal foundation model handling images, text, and image-text pairs.

### MAE: Pixel Reconstruction

MAE (He et al., 2022, Meta AI) takes a simpler, more radical approach:

**Asymmetric encoder-decoder**: Only the **visible** patches (25% of the image) are fed to the ViT encoder. This is the key efficiency insight -- the encoder never processes mask tokens, reducing compute by ~4x. A lightweight decoder (8 Transformer blocks with dim 512) takes the encoded visible patches plus mask tokens and reconstructs the full image.

The loss is MSE on the masked patches in pixel space:

$$\mathcal{L}_{\text{MAE}} = \frac{1}{|\mathcal{M}|} \sum_{i \in \mathcal{M}} \| \hat{\mathbf{x}}_i - \mathbf{x}_i \|^2$$

where $\hat{\mathbf{x}}_i$ is the predicted patch and $\mathbf{x}_i$ is the original. Only masked patches contribute to the loss. MAE applies per-patch normalization (subtracting mean, dividing by std of each patch) before computing the loss, which improves representation quality.

**Masking strategy**: MAE uses random uniform masking at **75%** ratio. This high ratio is critical -- at 50%, the task is too easy and representations are weaker. At 90%, there is insufficient context for meaningful reconstruction.

### SimMIM: Simple Masked Image Modeling

SimMIM (Xie et al., 2022, Microsoft) shows that a minimal design works well:

- Mask patches with random masking at a moderate ratio (e.g., 60%)
- Replace masked patches with a learnable mask token in the input
- Feed all tokens (masked and visible) through the encoder
- Predict raw pixel values for masked patches with a single linear layer as the "decoder"
- Use $\ell_1$ loss instead of MSE

SimMIM matches MAE's downstream accuracy with a simpler pipeline, demonstrating that the exact reconstruction target and decoder design matter less than the masking strategy.

### Comparison of MIM Methods

| Method | Masking Ratio | Reconstruction Target | Decoder | ViT-B Fine-tune Acc |
|--------|--------------|----------------------|---------|---------------------|
| BEiT | 40% | Discrete tokens (dVAE) | MLP head | 83.2% |
| MAE | 75% | Raw pixels | 8-block Transformer | 83.6% |
| SimMIM | 60% | Raw pixels | Linear layer | 83.8% |
| data2vec | 50% | Latent features (EMA teacher) | Regression head | 84.2% |

## Why It Matters

1. **Scalable pre-training**: MIM enables self-supervised pre-training that scales to massive ViT models. MAE pre-training of ViT-H takes ~19 hours on 128 A100 GPUs for 1600 epochs.
2. **Strong fine-tuning performance**: MAE pre-trained ViT-H achieves **87.8% top-1** on ImageNet, surpassing supervised pre-training.
3. **Training efficiency**: MAE's asymmetric design processes only 25% of tokens through the encoder, yielding ~3.5x speedup over processing all tokens.
4. **Reduced label dependence**: MIM pre-training followed by fine-tuning with just 1% of ImageNet labels can still achieve over 70% accuracy, demonstrating strong representation learning.
5. **Complementary to contrastive methods**: MIM and contrastive/distillation methods (DINO, MoCo) learn different properties. Combining them (e.g., iBOT, DINOv2) yields even stronger representations.

## Key Technical Details

- **75% masking ratio** is optimal for MAE. At this ratio, only 49 of 196 patches are visible for a $224 \times 224$ image with $16 \times 16$ patches.
- MAE's encoder processes 49 tokens instead of 196, reducing self-attention cost by approximately $16\times$ ($196^2 / 49^2$).
- MAE's decoder is intentionally small (512-dim, 8 layers) and asymmetric with the encoder (768-dim, 12 layers for ViT-B). The decoder is discarded after pre-training.
- BEiT's dVAE tokenizer is trained using the DALL-E tokenizer vocabulary (8192 codes). The tokenizer quality matters: poor tokenizers degrade BEiT performance.
- MIM pre-training typically requires **800-1600 epochs** on ImageNet, far more than supervised training (90-300 epochs), because each epoch only shows 25% of each image.
- MIM features are less linearly separable than DINO/contrastive features (lower $k$-NN accuracy) but are stronger after fine-tuning, suggesting they encode complementary information.

## Common Misconceptions

- **"75% masking would destroy all useful information."** Natural images are highly redundant -- spatial correlation means that 25% of patches carry enough information to reconstruct the rest. The high masking ratio forces the model to learn semantic features rather than exploiting local texture copying.
- **"MAE is just a denoising autoencoder."** While conceptually related, MAE differs fundamentally: it removes entire patches (not adding noise), uses an asymmetric encoder-decoder (not symmetric), and the encoder never sees mask tokens. These design choices are critical for representation quality and efficiency.
- **"Pixel reconstruction gives worse features than discrete token prediction."** Early results from BEiT suggested this, but MAE and SimMIM showed that pixel reconstruction performs comparably or better, especially when combined with per-patch normalization. The learning signal matters more than the target format.

## Connections to Other Concepts

- **Vision Transformer (ViT)**: MIM is designed specifically for ViT architectures; the patch-based structure makes masking natural.
- **DINO**: An alternative self-supervised paradigm based on self-distillation rather than reconstruction. DINO produces better linear probing features; MIM produces better fine-tuning features. DINOv2 combines both.
- **Attention in Vision**: The masking strategy directly affects attention patterns -- with 75% masking, the visible patches must attend to distant patches, encouraging long-range dependency learning.
- **Vision Transformer Scaling**: MIM enables effective pre-training at scales (ViT-H, ViT-g) where supervised pre-training on ImageNet alone underperforms.

## Further Reading

- He et al., "Masked Autoencoders Are Scalable Vision Learners" (2022) -- The MAE paper.
- Bao et al., "BEiT: BERT Pre-Training of Image Transformers" (2022) -- The BEiT paper introducing discrete token prediction.
- Xie et al., "SimMIM: A Simple Framework for Masked Image Modeling" (2022) -- Simplified MIM with linear decoder.
- Baevski et al., "data2vec: A General Framework for Self-supervised Learning in Speech, Vision and Language" (2022) -- Predicts latent representations instead of pixels or tokens.
- Zhou et al., "iBOT: Image BERT Pre-Training with Online Tokenizer" (2022) -- Combines MIM with self-distillation.
