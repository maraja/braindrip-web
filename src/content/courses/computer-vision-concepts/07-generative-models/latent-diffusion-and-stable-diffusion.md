# Latent Diffusion and Stable Diffusion

**One-Line Summary**: Latent diffusion models run the diffusion process in a compressed latent space rather than pixel space, dramatically reducing computational cost and enabling practical high-resolution text-to-image generation as realized in Stable Diffusion.

**Prerequisites**: Diffusion models, autoencoders and VAEs, CLIP, text encoders, cross-attention mechanisms

## What Is Latent Diffusion?

Running diffusion directly on 512x512 images means the U-Net must process tensors of shape $512 \times 512 \times 3$ at every denoising step -- enormously expensive. Latent diffusion, introduced by Rombach et al. (2022), solves this by first compressing images into a small latent space using a pretrained autoencoder, then performing the entire diffusion process in that latent space. It is like writing a story outline (latent) rather than drafting every sentence (pixels), then expanding the outline into full prose at the end.

Stable Diffusion is the most prominent implementation of latent diffusion, combining it with CLIP-based text conditioning to create an open-source text-to-image model that runs on consumer GPUs.

## How It Works

### Two-Stage Architecture

**Stage 1: Perceptual Compression (Autoencoder)**

A VQ-VAE or KL-regularized autoencoder is trained to encode images $x \in \mathbb{R}^{H \times W \times 3}$ into latent representations $z \in \mathbb{R}^{h \times w \times c}$ with a spatial downsampling factor $f$:

$$z = \mathcal{E}(x), \quad \hat{x} = \mathcal{D}(z)$$

Stable Diffusion uses $f = 8$, so a 512x512 image becomes a 64x64x4 latent. The autoencoder is trained once with a combination of reconstruction loss, perceptual loss (LPIPS), a patch-based adversarial loss, and a small KL penalty ($\text{weight} \approx 10^{-6}$).

**Stage 2: Diffusion in Latent Space**

A U-Net $\epsilon_\theta(z_t, t, c)$ is trained to denoise latent representations, conditioned on timestep $t$ and optional conditioning $c$:

$$\mathcal{L}_{\text{LDM}} = \mathbb{E}_{z_0, t, \epsilon, c} \left[ \| \epsilon - \epsilon_\theta(z_t, t, c) \|^2 \right]$$

Because $z$ is 48x smaller than the pixel representation ($64 \times 64 \times 4$ vs. $512 \times 512 \times 3$), training and inference are dramatically faster.

### Text Conditioning

Text prompts are encoded into embeddings using a frozen text encoder:

- **Stable Diffusion v1.x**: CLIP ViT-L/14 text encoder (77 token context, 768-d embeddings).
- **Stable Diffusion v2.x**: OpenCLIP ViT-H/14 (1024-d embeddings).
- **SDXL**: Dual text encoders -- CLIP ViT-L/14 + OpenCLIP ViT-bigG/14, concatenated to 2048-d.

Text embeddings are injected into the U-Net via cross-attention at multiple resolutions:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d}}\right)V$$

where $Q = W_Q \cdot \phi(z_t)$ comes from the spatial features and $K = W_K \cdot \tau_\theta(y)$, $V = W_V \cdot \tau_\theta(y)$ come from the text embeddings $\tau_\theta(y)$.

### Classifier-Free Guidance in Latent Space

During training, text conditioning is dropped with probability 10%. At inference:

$$\hat{\epsilon} = \epsilon_\theta(z_t, t, \varnothing) + w \cdot (\epsilon_\theta(z_t, t, c) - \epsilon_\theta(z_t, t, \varnothing))$$

Stable Diffusion v1.5 typically uses guidance scale $w = 7.5$. SDXL uses $w = 5.0$--$7.5$.

### Stable Diffusion Architecture Details

**U-Net**: ResNet blocks with GroupNorm, SiLU activations. Self-attention and cross-attention at resolutions 32x32, 16x16, and 8x8. Channel multipliers [1, 2, 4, 4] from base channels 320. Total: ~860M parameters (SD v1.5).

**Autoencoder**: Encoder and decoder with ResNet blocks and attention. 4-channel latent with KL regularization. ~84M parameters.

**SDXL** (Podell et al., 2023): Larger U-Net (~2.6B parameters), micro-conditioning on original image resolution and crop coordinates, a separate refiner model for final denoising steps.

### Conditioning Extensions

The cross-attention mechanism makes latent diffusion easily extensible:

- **ControlNet** (Zhang et al., 2023): Adds spatial conditioning (edges, depth, pose) via a trainable copy of the encoder.
- **IP-Adapter**: Image prompt conditioning via decoupled cross-attention for image features.
- **LoRA** (Low-Rank Adaptation): Efficient fine-tuning by adding low-rank weight matrices (~4--64 MB) to attention layers.
- **Textual Inversion**: Learns new "words" (embedding vectors) to represent specific concepts.

## Why It Matters

1. **Democratized generation**: Stable Diffusion runs on a single consumer GPU (6 GB VRAM for SD v1.5), making high-quality generation accessible to millions.
2. **Open-source ecosystem**: The open release of Stable Diffusion created an ecosystem of fine-tuned models, ControlNets, LoRAs, and community tools.
3. **Computational efficiency**: Latent diffusion requires ~4x less compute than pixel-space diffusion at the same resolution, enabling 512x512 generation in ~5 seconds on an RTX 3090.
4. **Versatile conditioning**: The cross-attention architecture supports text, images, depth maps, segmentation masks, and more -- all within the same framework.
5. **Commercial impact**: Text-to-image generation powered by latent diffusion drives products across advertising, game development, film, and design.

## Key Technical Details

- Autoencoder downsampling factor: $f = 8$ (Stable Diffusion), $f = 4$ (some research variants). Reconstruction FID < 1.0, meaning the autoencoder is near-lossless for perceptual quality.
- Training data: SD v1.5 trained on LAION-5B subset (~2B image-text pairs). SDXL trained on an internal dataset with quality filtering.
- Training cost: SD v1.5 required ~150K A100-hours (~$600K at cloud prices). SDXL approximately double.
- Inference (50 DDIM steps): SD v1.5 at 512x512 takes ~5s on RTX 3090. With DPM-Solver++, 20 steps achieves comparable quality in ~2s.
- SDXL FID on COCO 2017 (zero-shot): ~2.3 at 1024x1024, competitive with DALL-E 3 and Midjourney v5.
- LoRA fine-tuning: 4-rank LoRA takes ~30 minutes on a single A100 with 200 training images.

## Common Misconceptions

- **"Latent diffusion sacrifices quality for speed."** The autoencoder preserves perceptual quality nearly perfectly (LPIPS < 0.01 reconstruction error). The latent space discards imperceptible high-frequency details.
- **"Stable Diffusion memorizes its training data."** Studies show that verbatim memorization occurs for only ~0.03% of duplicated training images (Carlini et al., 2023). The model generalizes compositionally.
- **"More steps always means better images."** Beyond 30--50 steps with modern samplers (DPM-Solver++, UniPC), quality plateaus. Extremely high step counts can even degrade quality.
- **"SDXL is just a bigger SD v1.5."** SDXL introduces micro-conditioning, dual text encoders, a refiner model, and architectural changes that are qualitatively different, not just scaled.

## Connections to Other Concepts

- **Diffusion Models**: Latent diffusion is the practical realization of the DDPM framework, made efficient through perceptual compression.
- **Autoencoders and VAEs**: The pretrained autoencoder is a critical component; its quality directly bounds generation quality.
- **Image Inpainting**: Stable Diffusion natively supports inpainting by fixing known latent regions during denoising.
- **Image Super-Resolution**: Latent diffusion upscalers (SD x4 Upscaler) apply diffusion conditioned on low-resolution input.
- **Image-to-Image Translation**: SDEdit and img2img pipelines perform domain transfer by adding noise to an input and denoising with a text prompt.

## Further Reading

- Rombach et al., "High-Resolution Image Synthesis with Latent Diffusion Models" (2022) -- The foundational LDM paper introducing perceptual compression + latent diffusion.
- Podell et al., "SDXL: Improving Latent Diffusion Models for High-Resolution Image Synthesis" (2023) -- SDXL architecture with micro-conditioning and refiner.
- Zhang et al., "Adding Conditional Control to Text-to-Image Diffusion Models" (2023) -- ControlNet for spatial conditioning.
- Hu et al., "LoRA: Low-Rank Adaptation of Large Language Models" (2021) -- Efficient fine-tuning applied widely in Stable Diffusion community.
- Carlini et al., "Extracting Training Data from Diffusion Models" (2023) -- Analysis of memorization in Stable Diffusion.
