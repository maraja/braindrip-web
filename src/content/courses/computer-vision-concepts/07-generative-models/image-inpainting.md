# Image Inpainting

**One-Line Summary**: Image inpainting fills in missing or masked regions of an image with plausible content, using contextual reasoning from surrounding pixels through techniques ranging from partial convolutions to diffusion-based generation.

**Prerequisites**: Convolutional neural networks, generative adversarial networks, attention mechanisms, diffusion models

## What Is Image Inpainting?

Imagine a Renaissance painting restorer carefully filling in a damaged section of a fresco, matching the surrounding style, color, and perspective so seamlessly that no one can tell it was ever damaged. Image inpainting is the computational equivalent: given an image with missing regions (defined by a binary mask), the task is to generate content that is both visually coherent with the surroundings and semantically plausible.

Traditional methods propagated texture from boundaries inward. Deep learning methods learn semantic priors from large datasets, enabling them to synthesize complex structures -- generating a missing eye, completing a building facade, or removing an unwanted object.

## How It Works

### Problem Formulation

Given an image $I$ and a binary mask $M$ (1 where pixels are missing), inpainting produces a completed image $\hat{I}$ such that:
- $\hat{I} \odot (1 - M) = I \odot (1 - M)$ (known pixels are preserved)
- $\hat{I} \odot M$ looks natural and consistent with the surrounding context

### Early Deep Learning Approaches

**Context Encoders** (Pathak et al., 2016) trained an encoder-decoder with adversarial loss to fill in central 64x64 rectangular holes. The architecture resembles an autoencoder where the encoder sees the masked image and the decoder predicts the missing region:

$$\mathcal{L} = \lambda_{\text{rec}} \mathcal{L}_{\text{L2}} + \lambda_{\text{adv}} \mathcal{L}_{\text{GAN}}$$

with $\lambda_{\text{rec}} = 0.999$ and $\lambda_{\text{adv}} = 0.001$.

Limitation: Only handles fixed rectangular masks. Fails on irregular or large missing regions.

### Partial Convolutions

Liu et al. (2018) introduced partial convolutions to handle irregular masks. Standard convolutions treat missing pixels as valid, corrupting features. Partial convolutions operate only on valid (unmasked) pixels:

$$x' = \begin{cases}
W^T (X \odot M) \frac{\text{sum}(1)}{\text{sum}(M)} + b & \text{if sum}(M) > 0 \\
0 & \text{otherwise}
\end{cases}$$

The mask is updated at each layer: a position becomes valid if any input within its receptive field was valid. This progressively shrinks the hole from the boundaries inward through the network.

### Gated Convolutions

Yu et al. (2019) argued that hard binary masking is suboptimal and proposed learning soft attention masks via gated convolutions:

$$\text{Gating}_{y,x} = \sigma(W_g \cdot I)$$
$$\text{Feature}_{y,x} = \phi(W_f \cdot I)$$
$$O_{y,x} = \text{Gating}_{y,x} \odot \text{Feature}_{y,x}$$

The gating mechanism learns where and how much each spatial location should contribute, providing a more flexible alternative to partial convolutions.

### Contextual Attention

Yu et al. (2018) introduced a contextual attention layer that explicitly borrows features from known regions to fill unknown regions:

1. Extract patches from known regions as a collection of reference features.
2. For each position in the missing region, compute similarity (normalized inner product) to all reference patches.
3. Apply softmax to get attention weights and reconstruct the missing region as a weighted combination of reference patches.

This enables long-range copying of textures and structures, crucial for completing repetitive patterns (brick walls, fabric, foliage).

### Two-Stage Coarse-to-Fine Architecture

Many methods (Yu et al., 2018; Zeng et al., 2019) use a two-stage approach:

1. **Coarse network**: Produces a rough initial completion using dilated convolutions for large receptive fields.
2. **Refinement network**: Uses contextual attention or non-local mechanisms to refine details.

The coarse output provides global structure; the refinement network adds texture coherence and sharp details.

### Diffusion-Based Inpainting

Diffusion models offer a natural framework for inpainting. During the reverse denoising process, known pixels are replaced at each step:

$$x_{t-1}^{\text{known}} = \sqrt{\bar{\alpha}_{t-1}} x_0 + \sqrt{1 - \bar{\alpha}_{t-1}} \epsilon$$
$$x_{t-1} = M \odot x_{t-1}^{\text{generated}} + (1 - M) \odot x_{t-1}^{\text{known}}$$

**RePaint** (Lugmayr et al., 2022) improves this by iterating the forward-reverse process multiple times per timestep (resampling), which improves harmony between generated and known regions. Stable Diffusion's inpainting pipeline fine-tunes the model with mask-concatenated inputs, achieving state-of-the-art results for large missing regions.

### Loss Functions for Inpainting

- **Pixel reconstruction**: $\mathcal{L}_1 = \| \hat{I} - I_{\text{GT}} \|_1$ (L1 preferred over L2 for sharpness)
- **Perceptual loss**: $\mathcal{L}_{\text{perc}} = \sum_l \| \phi_l(\hat{I}) - \phi_l(I_{\text{GT}}) \|_1$ using VGG features
- **Style loss**: Gram matrix matching to ensure texture consistency
- **Adversarial loss**: PatchGAN or spectral-normalized discriminator for realism
- **Total variation**: $\mathcal{L}_{\text{TV}}$ on the boundary between known and generated regions to reduce seam artifacts

## Why It Matters

1. **Object removal**: Remove unwanted objects, watermarks, or text overlays from photographs -- the most common consumer use case.
2. **Image restoration**: Repair damaged or corrupted images, including historical photographs and artworks.
3. **Photo editing**: Fill regions after perspective correction, panorama stitching, or content-aware cropping.
4. **Data augmentation**: Generate training data variations by masking and inpainting regions with new content.
5. **3D and video**: Temporal inpainting removes objects from video; depth-aware inpainting supports novel view synthesis.

## Key Technical Details

- Partial convolutions: Trained on 55,116 irregular masks from random strokes. Handles masks covering 0--60% of image area.
- DeepFill v2 (gated convolutions): FID 7.8 on Places2 at 256x256 with free-form masks. User study preferred DeepFill v2 over partial convolutions 61% of the time.
- Contextual attention: Patch size 3x3 with stride 1. Attention computed at 1/4 resolution for efficiency, then upsampled.
- RePaint: 10 resampling steps per timestep, 250 total timesteps. Inference time: ~2 minutes per 256x256 image on a V100.
- Stable Diffusion inpainting: Fine-tuned SD v1.5 with 5 input channels (4 latent + 1 mask). ~5 seconds per 512x512 on RTX 3090.
- Large mask inpainting (>50% missing): Traditional CNN methods struggle; diffusion-based methods excel because they leverage strong generative priors.

## Common Misconceptions

- **"Inpainting just copies nearby textures."** Modern methods understand semantics: they can generate missing faces, complete architectural structures, and synthesize contextually appropriate objects.
- **"GAN-based inpainting is always better than diffusion."** For small masks and fast inference, GAN methods are competitive. For large or complex masks, diffusion models produce more coherent and diverse completions.
- **"The output is deterministic."** Most inpainting methods can produce multiple plausible completions for the same mask. Diffusion models make this explicit by sampling different noise realizations.
- **"Partial convolutions solved the irregular mask problem completely."** Partial convolutions handle irregular masks but can produce artifacts at mask boundaries and struggle with very large holes where no nearby context exists.

## Connections to Other Concepts

- `diffusion-models.md`: Diffusion provides a natural inpainting framework by conditioning denoising on known pixels.
- `latent-diffusion-and-stable-diffusion.md`: SD inpainting operates in latent space, enabling high-resolution completion with text guidance.
- `generative-adversarial-networks.md`: Most CNN-based inpainting methods use adversarial training for realistic texture synthesis.
- `image-to-image-translation.md`: Inpainting can be viewed as translating a masked image to a complete one.
- `image-super-resolution.md`: Both tasks hallucinate missing information using learned priors about natural images.

## Further Reading

- Pathak et al., "Context Encoders: Feature Learning by Inpainting" (2016) -- Pioneered deep learning inpainting with encoder-decoder and adversarial loss.
- Yu et al., "Generative Image Inpainting with Contextual Attention" (2018) -- Contextual attention mechanism for long-range feature borrowing.
- Liu et al., "Image Inpainting for Irregular Holes Using Partial Convolutions" (2018) -- Partial convolutions handling arbitrary mask shapes.
- Yu et al., "Free-Form Image Inpainting with Gated Convolution" (2019) -- Gated convolutions and user-guided sketch-based inpainting.
- Lugmayr et al., "RePaint: Inpainting using Denoising Diffusion Probabilistic Models" (2022) -- Resampling-based diffusion inpainting without fine-tuning.
