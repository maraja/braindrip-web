# StyleGAN

**One-Line Summary**: StyleGAN introduces a style-based generator architecture that injects learned styles at each resolution through adaptive instance normalization, enabling unprecedented control over face synthesis at 1024x1024 resolution.

**Prerequisites**: Generative adversarial networks, GAN training dynamics, progressive growing, batch and instance normalization

## What Is StyleGAN?

Imagine painting a portrait where you separately control the face shape, skin texture, hair style, and lighting with independent dials. Traditional generators entangle all these factors in a single noise vector, making fine control impossible. StyleGAN (Karras et al., 2019) disentangles them by routing noise through a mapping network that produces "styles" -- vectors injected at different layers to control different levels of image detail.

The result was the first GAN to produce photorealistic 1024x1024 face images with smooth, interpretable latent space navigation, setting a new standard for controllable image synthesis.

## How It Works

### Architecture Overview

StyleGAN replaces the traditional generator input with a constant learned tensor $4 \times 4 \times 512$ and introduces three new components:

1. **Mapping Network $f$**: An 8-layer MLP that maps the input noise $z \in \mathbb{R}^{512}$ to an intermediate latent space $w \in \mathcal{W} \subset \mathbb{R}^{512}$. This nonlinear mapping disentangles factors of variation.
2. **Style injection via AdaIN**: At each convolutional layer, the style vector $w$ is affinely transformed to produce scale $y_s$ and bias $y_b$, then applied via Adaptive Instance Normalization:

$$\text{AdaIN}(x_i, y) = y_{s,i} \frac{x_i - \mu(x_i)}{\sigma(x_i)} + y_{b,i}$$

where $x_i$ is the $i$-th feature map, and $\mu$, $\sigma$ are per-channel spatial statistics.

3. **Stochastic noise injection**: Per-pixel Gaussian noise is added after each convolution (before AdaIN) to introduce stochastic variation in fine details like hair strands, skin pores, and freckles.

### Style Mixing

Because styles are injected independently at each layer, using different $w$ vectors at different resolutions (style mixing) allows compositing coarse features from one latent code with fine features from another. Coarse styles (4x4 -- 8x8) control pose, face shape, and glasses. Medium styles (16x16 -- 32x32) control hair style, eyes, and mouth. Fine styles (64x64 -- 1024x1024) control color scheme, micro-structure, and background.

### $\mathcal{W}$ vs $\mathcal{Z}$ Space

The intermediate latent space $\mathcal{W}$ is empirically more disentangled than the input space $\mathcal{Z}$. Linear interpolation in $\mathcal{W}$ produces smoother, more semantically meaningful transitions. The Perceptual Path Length (PPL) metric, introduced alongside StyleGAN, quantifies this: lower PPL indicates smoother latent traversals.

### StyleGAN2 Improvements

Karras et al. (2020) addressed several artifacts:

- **Droplet artifacts**: Caused by AdaIN normalizing away useful signal. Fixed by replacing AdaIN with weight demodulation -- modulating convolution weights directly instead of feature statistics.
- **Progressive growing artifacts**: Phase artifacts at resolution boundaries. Fixed by using a single-resolution architecture with skip connections and residual paths.
- **Path length regularization**: Encourages the mapping from $\mathcal{W}$ to images to have uniform Jacobian norm, improving latent space smoothness.
- **Lazy regularization**: Apply R1 penalty every 16 steps instead of every step, reducing overhead by ~40% with no quality loss.

### StyleGAN3

Karras et al. (2021) tackled texture sticking -- fine details that stay fixed in screen coordinates rather than moving with objects during latent space animation. The solution involved alias-free signal processing: carefully filtered nonlinearities and upsampling to ensure strict equivariance to continuous translation and rotation.

Two configurations were proposed:
- **StyleGAN3-T** (translation equivariant): Filtered activations to prevent aliasing, replacing standard ReLU with continuous piecewise-linear activations.
- **StyleGAN3-R** (rotation + translation equivariant): Adds rotational equivariance via Fourier features, at additional computational cost.

### GAN Inversion

GAN inversion -- projecting a real image into StyleGAN's latent space -- enables editing real photographs. Three main approaches exist:

- **Optimization-based**: Directly optimize $w$ to minimize $\|G(w) - x\|$ plus perceptual loss. Slow (~1 min per image) but accurate.
- **Encoder-based** (e4e, pSp): Train a separate encoder to predict $w^+$ from an image in a single forward pass (~0.1s). Trades accuracy for speed.
- **Hybrid**: Use an encoder for initialization, then refine with a few optimization steps. Balances speed and quality.

## Why It Matters

1. **Face generation benchmark**: StyleGAN set the standard for photorealistic face synthesis and remains a benchmark architecture. FID of 2.84 on FFHQ 1024x1024 (StyleGAN2).
2. **Controllable editing**: The disentangled $\mathcal{W}$ space enables semantic face editing (aging, expression, pose) via linear directions, powering tools like InterFaceGAN.
3. **GAN inversion**: Projecting real images into $\mathcal{W}^+$ space (using a different $w$ per layer) enables editing real photographs, forming the basis of commercial editing products.
4. **Domain adaptation**: StyleGAN pretrained on faces transfers to other domains (cars, churches, cats) via fine-tuning with as few as 1000 images.
5. **Deepfake awareness**: StyleGAN-generated faces raised public awareness of synthetic media, driving research into detection methods.

## Key Technical Details

- Mapping network: 8 FC layers, 512 units each, LeakyReLU activation, learning rate 0.01 (100x lower than synthesis network).
- Training: FFHQ dataset (70,000 images), batch size 32, ~25M images shown, training time ~7 days on 8 V100 GPUs (StyleGAN2).
- FID scores (FFHQ 1024x1024): StyleGAN = 4.40, StyleGAN2 = 2.84, StyleGAN3 = 4.40 (tradeoff for equivariance).
- $\mathcal{W}^+$ space has dimension $18 \times 512 = 9216$ for StyleGAN2 (18 layers, each receiving a 512-d style vector).
- Generator parameters: ~30M (StyleGAN2 config F). Discriminator: ~29M.
- Truncation trick: Sample $w' = \bar{w} + \psi(w - \bar{w})$ where $\bar{w}$ is the mean of $\mathcal{W}$ and $\psi \in [0.5, 1.0]$ controls the quality-diversity tradeoff.

## Common Misconceptions

- **"StyleGAN only works for faces."** While faces are the showcase application, StyleGAN has been successfully trained on cars (LSUN Cars), churches (LSUN Church), bedrooms, landscapes, and even medical images.
- **"The mapping network is just an implementation detail."** The mapping network is architecturally critical. Without it, the input noise distribution directly constrains the latent space geometry, preventing disentanglement.
- **"StyleGAN3 is strictly better than StyleGAN2."** StyleGAN3 achieves equivariance at a slight cost to FID. For static image generation where animation is not needed, StyleGAN2 often remains preferred.
- **"Style mixing always produces coherent results."** Mixing styles from very different latent codes can produce artifacts, especially at coarse levels where face geometry is determined.
- **"Stochastic noise injection is essential for quality."** Removing noise injection barely changes FID. Its primary role is adding per-pixel stochastic variation (hair placement, skin texture) rather than affecting overall image quality.

## Connections to Other Concepts

- `gan-training-dynamics.md`: StyleGAN uses R1 gradient penalty, exponential moving average, and lazy regularization -- all key stabilization techniques.
- `generative-adversarial-networks.md`: StyleGAN is a GAN architecture; it relies on adversarial training with a standard discriminator.
- `image-to-image-translation.md`: StyleGAN's encoder-based inversion enables GAN-based editing pipelines related to domain transfer.
- `diffusion-models.md`: Diffusion models have surpassed StyleGAN in diversity metrics while StyleGAN retains advantages in latent space controllability and speed.
- `neural-style-transfer.md`: AdaIN, central to StyleGAN's architecture, was originally developed for arbitrary neural style transfer (Huang and Belongie, 2017).

## Further Reading

- Karras et al., "A Style-Based Generator Architecture for Generative Adversarial Networks" (2019) -- The original StyleGAN paper introducing mapping network, AdaIN injection, and style mixing.
- Karras et al., "Analyzing and Improving the Image Quality of StyleGAN" (2020) -- StyleGAN2 with weight demodulation and path length regularization.
- Karras et al., "Alias-Free Generative Adversarial Networks" (2021) -- StyleGAN3 achieving continuous equivariance via alias-free operations.
- Shen et al., "Interpreting the Latent Space of GANs for Semantic Face Editing" (2020) -- InterFaceGAN for linear editing in StyleGAN latent space.
- Richardson et al., "Encoding in Style: a StyleGAN Encoder for Image-to-Image Translation" (2021) -- pSp encoder for projecting images into StyleGAN's latent space.
