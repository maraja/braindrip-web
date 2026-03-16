# Diffusion Models

**One-Line Summary**: Diffusion models generate images by learning to reverse a gradual noising process, iteratively denoising random Gaussian noise into coherent images, and have dethroned GANs as the dominant paradigm for image synthesis.

**Prerequisites**: Gaussian distributions, Markov chains, variational inference, U-Net architecture, score functions

## What Is a Diffusion Model?

Imagine dropping ink into water: the ink gradually spreads until the water is uniformly colored. Now imagine filming this process and playing it in reverse -- the uniform color coalesces back into a sharp ink drop. Diffusion models work exactly this way. The **forward process** progressively adds Gaussian noise to an image until it becomes pure noise. The **reverse process** -- a learned neural network -- takes pure noise and iteratively removes noise to produce a clean image.

Unlike GANs, which require an adversarial game, diffusion models use a simple denoising objective that is stable to train and covers the full data distribution without mode collapse.

## How It Works

### Forward Diffusion Process

Given a data point $x_0$, the forward process produces a sequence $x_1, x_2, \ldots, x_T$ by adding noise at each step:

$$q(x_t | x_{t-1}) = \mathcal{N}(x_t; \sqrt{1 - \beta_t} \, x_{t-1}, \beta_t I)$$

where $\beta_t \in (0, 1)$ is a noise schedule. A key property allows sampling $x_t$ directly from $x_0$:

$$q(x_t | x_0) = \mathcal{N}(x_t; \sqrt{\bar{\alpha}_t} \, x_0, (1 - \bar{\alpha}_t) I)$$

where $\alpha_t = 1 - \beta_t$ and $\bar{\alpha}_t = \prod_{s=1}^{t} \alpha_s$. At $T = 1000$ with standard schedules, $\bar{\alpha}_T \approx 0$, so $x_T \approx \mathcal{N}(0, I)$.

### Reverse Process (DDPM)

Ho et al. (2020) parameterize the reverse process as:

$$p_\theta(x_{t-1} | x_t) = \mathcal{N}(x_{t-1}; \mu_\theta(x_t, t), \Sigma_\theta(x_t, t))$$

The network predicts the noise $\epsilon_\theta(x_t, t)$ added at step $t$, and the mean is computed as:

$$\mu_\theta(x_t, t) = \frac{1}{\sqrt{\alpha_t}} \left( x_t - \frac{\beta_t}{\sqrt{1 - \bar{\alpha}_t}} \epsilon_\theta(x_t, t) \right)$$

The training objective simplifies to:

$$\mathcal{L}_{\text{simple}} = \mathbb{E}_{t, x_0, \epsilon} \left[ \| \epsilon - \epsilon_\theta(\sqrt{\bar{\alpha}_t} x_0 + \sqrt{1 - \bar{\alpha}_t} \epsilon, t) \|^2 \right]$$

This is remarkably simple: sample a timestep $t$, add noise to a training image, and train the network to predict that noise.

### Score Matching Perspective

Song and Ermon (2019) showed an equivalent formulation via score matching. The score function $\nabla_x \log p(x)$ points toward high-density regions. A score network $s_\theta(x, t) \approx \nabla_{x_t} \log q(x_t)$ is trained with denoising score matching:

$$\mathcal{L}_{\text{DSM}} = \mathbb{E}_{t, x_0, x_t} \left[ \| s_\theta(x_t, t) - \nabla_{x_t} \log q(x_t | x_0) \|^2 \right]$$

The noise prediction and score matching perspectives are equivalent: $s_\theta(x_t, t) = -\epsilon_\theta(x_t, t) / \sqrt{1 - \bar{\alpha}_t}$.

### Noise Schedules

- **Linear** (DDPM): $\beta_t$ linearly increases from $\beta_1 = 10^{-4}$ to $\beta_T = 0.02$ over $T = 1000$ steps.
- **Cosine** (Nichol and Dhariwal, 2021): $\bar{\alpha}_t = \cos^2\left(\frac{t/T + s}{1 + s} \cdot \frac{\pi}{2}\right)$ with $s = 0.008$. Produces better results at lower resolutions by avoiding spending too many steps at near-zero noise.

### Accelerated Sampling

The original DDPM requires 1000 denoising steps. Faster alternatives:

- **DDIM** (Song et al., 2020): Deterministic sampling with a non-Markovian process. Reduces to 50--100 steps with minimal quality loss.
- **DPM-Solver** (Lu et al., 2022): ODE solvers achieving high quality in 10--20 steps.
- **Consistency Models** (Song et al., 2023): Map any noisy input directly to the clean image in a single step, trained via consistency distillation.

### Classifier-Free Guidance

Ho and Salimans (2022) introduced a technique to trade diversity for quality without a separate classifier. During training, the condition $c$ (e.g., class label or text) is randomly dropped with probability $p = 0.1$, training both conditional and unconditional models simultaneously. At inference:

$$\hat{\epsilon}_\theta(x_t, t, c) = \epsilon_\theta(x_t, t, \varnothing) + w \cdot (\epsilon_\theta(x_t, t, c) - \epsilon_\theta(x_t, t, \varnothing))$$

where $w > 1$ is the guidance scale (typically 3--15). Higher $w$ produces outputs more aligned with the condition at the cost of diversity.

## Why It Matters

1. **State-of-the-art image quality**: Dhariwal and Nichol (2021) demonstrated that diffusion models beat GANs on ImageNet with FID 2.97 (256x256), ending GAN dominance.
2. **Training stability**: No adversarial dynamics, no mode collapse. Standard MSE loss with a U-Net works reliably.
3. **Distribution coverage**: Diffusion models achieve high recall (diversity) alongside high precision (quality), unlike GANs which often sacrifice one for the other.
4. **Foundation for commercial tools**: DALL-E 2, Stable Diffusion, Midjourney, and Imagen all build on diffusion.
5. **Beyond images**: Diffusion has been applied to video (Sora), audio (AudioLDM), 3D shapes (Point-E, DreamFusion), protein structures (RFdiffusion), and molecular design.

## Key Technical Details

- DDPM architecture: U-Net with ResNet blocks, self-attention at 16x16 resolution, sinusoidal timestep embeddings. ~114M parameters for 256x256.
- Training: Adam optimizer, learning rate 2e-4, batch size 256, EMA decay 0.9999. ~500K iterations on ImageNet 256x256 (~3 days on 8 A100s).
- Sampling cost: DDPM needs 1000 forward passes (~20 seconds per image on a V100). DDIM reduces this to 50 steps (~1 second). DPM-Solver++ achieves good quality in 15--20 steps.
- FID scores on ImageNet 256x256: DDPM = 11.09, ADM (guided) = 2.97, DiT-XL/2 = 2.27.
- Memory: Training a 256x256 model requires ~32 GB per GPU with batch size 8. Sampling requires ~6 GB.

## Common Misconceptions

- **"Diffusion models are just denoising autoencoders."** While the training loss resembles denoising, diffusion models are a principled probabilistic framework with a specific forward process, variational bound, and iterative sampling -- not a single-shot denoiser.
- **"More diffusion steps always means better quality."** Beyond ~1000 steps for DDPM (or ~50 for DDIM), additional steps provide diminishing returns. The noise schedule matters more than the number of steps.
- **"Diffusion models are too slow for practical use."** With DDIM, DPM-Solver, and distillation techniques, generation takes 1--5 seconds per image, which is practical for most applications.
- **"Diffusion models replaced GANs entirely."** GANs remain competitive for real-time applications requiring single-step generation and for tasks where controllable latent spaces are essential (e.g., face editing).

## Connections to Other Concepts

- `latent-diffusion-and-stable-diffusion.md`: Apply diffusion in a compressed latent space for efficiency, enabling high-resolution text-to-image generation.
- `autoencoders-and-vaes.md`: VAEs share the variational framework; diffusion can be viewed as a hierarchical VAE with a fixed encoder.
- `generative-adversarial-networks.md`: Diffusion models surpassed GANs in image quality benchmarks, motivating hybrid approaches.
- `image-inpainting.md`: Diffusion naturally supports inpainting by conditioning the denoising process on known pixels.
- `image-super-resolution.md`: Diffusion-based super-resolution (SR3) produces higher-quality results than GAN-based methods.

## Further Reading

- Ho et al., "Denoising Diffusion Probabilistic Models" (2020) -- The foundational DDPM paper establishing practical diffusion for images.
- Song et al., "Score-Based Generative Modeling through Stochastic Differential Equations" (2021) -- Unified SDE framework connecting score matching and diffusion.
- Dhariwal and Nichol, "Diffusion Models Beat GANs on Image Synthesis" (2021) -- Classifier guidance and architectural improvements achieving state-of-the-art FID.
- Song et al., "Denoising Diffusion Implicit Models" (2020) -- DDIM accelerated sampling via deterministic non-Markovian process.
- Ho and Salimans, "Classifier-Free Diffusion Guidance" (2022) -- The guidance technique underlying most modern text-to-image models.
