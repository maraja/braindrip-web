# Generative Adversarial Networks

**One-Line Summary**: GANs pit a generator network against a discriminator network in a minimax game, producing remarkably realistic synthetic images when the two reach equilibrium.

**Prerequisites**: Neural network training, loss functions, probability distributions, basic game theory

## What Is a GAN?

Think of a counterfeiter (generator) trying to produce fake currency and a detective (discriminator) trying to spot fakes. As the detective gets better, the counterfeiter must improve too, and vice versa. Over time, the counterfeiter produces bills indistinguishable from real ones. Generative Adversarial Networks, introduced by Goodfellow et al. (2014), formalize this as a two-player minimax game between neural networks.

The generator $G$ maps random noise $z \sim p_z(z)$ to synthetic data $G(z)$. The discriminator $D$ outputs the probability that its input is real rather than generated. The objective is:

$$\min_G \max_D \; \mathbb{E}_{x \sim p_{\text{data}}}[\log D(x)] + \mathbb{E}_{z \sim p_z}[\log(1 - D(G(z)))]$$

At the theoretical optimum, $G$ perfectly replicates the data distribution and $D$ outputs 0.5 everywhere -- a Nash equilibrium.

## How It Works

### Architecture

The original GAN used fully connected layers, but modern GANs are almost universally convolutional. DCGAN (Radford et al., 2015) established the template:

- **Generator**: Takes a noise vector $z \in \mathbb{R}^{128}$, projects it to a small spatial feature map, then upsamples via transposed convolutions with batch normalization and ReLU activations.
- **Discriminator**: A standard CNN with strided convolutions, LeakyReLU activations, and a sigmoid output.

### Training Procedure

Training alternates between two steps:

1. **Discriminator update**: Sample a batch of real images $x$ and fake images $G(z)$. Maximize $\log D(x) + \log(1 - D(G(z)))$ with respect to $D$.
2. **Generator update**: Sample noise $z$ and minimize $\log(1 - D(G(z)))$ with respect to $G$. In practice, maximizing $\log D(G(z))$ (the non-saturating loss) provides stronger gradients early in training.

### Theoretical Properties

Goodfellow et al. proved that if $G$ and $D$ have infinite capacity and are trained to convergence at each step, the global minimum of the minimax game is achieved when $p_G = p_{\text{data}}$. At this point, the Jensen-Shannon divergence between the two distributions is zero.

In practice, finite capacity, simultaneous gradient updates, and mode imbalance mean the theoretical guarantees rarely hold exactly.

### Conditional GANs

Conditional GANs (Mirza and Osindero, 2014) feed auxiliary information $y$ (class labels, text embeddings, segmentation maps) to both $G$ and $D$:

$$\min_G \max_D \; \mathbb{E}_{x}[\log D(x|y)] + \mathbb{E}_{z}[\log(1 - D(G(z|y)|y))]$$

This enables controlled generation: produce an image of a specific class, matching a text description, or conforming to a layout.

### Loss Function Variants

The original minimax loss has known gradient issues. Several alternatives are widely used:

- **Non-saturating loss**: Replace $\min_G \log(1 - D(G(z)))$ with $\max_G \log D(G(z))$. Same fixed point but stronger gradients when $D$ is confident.
- **Hinge loss**: $\mathcal{L}_D = -\mathbb{E}[\min(0, -1 + D(x))] - \mathbb{E}[\min(0, -1 - D(G(z)))]$. Used in BigGAN and StyleGAN.
- **Least-squares GAN (LSGAN)**: Replace log-likelihood with $L_2$: $\mathcal{L}_D = \mathbb{E}[(D(x) - 1)^2] + \mathbb{E}[D(G(z))^2]$. More stable gradients.

### Evaluation Metrics

- **Frechet Inception Distance (FID)**: Measures distance between real and generated feature distributions in Inception-v3 space. Lower is better. State-of-the-art models achieve FID < 3 on CIFAR-10 and < 5 on LSUN Bedrooms.
- **Inception Score (IS)**: Measures quality and diversity via classification confidence. Less reliable than FID for comparing models.
- **Precision and Recall**: Separately measure fidelity (are generated images realistic?) and diversity (does the model cover the full distribution?).
- **Kernel Inception Distance (KID)**: Similar to FID but uses an unbiased MMD estimator, making it more reliable on small sample sizes (< 5000 images).

## Why It Matters

1. **Photorealistic synthesis**: GANs generate faces, scenes, and objects indistinguishable from real photographs at resolutions up to 1024x1024 and beyond.
2. **Data augmentation**: Synthetic GAN images improve classifier performance when real labeled data is scarce, particularly in medical imaging.
3. **Creative tools**: GAN-based editing enables interactive face manipulation, style mixing, and semantic image editing used in commercial products.
4. **Super-resolution and restoration**: GAN discriminators provide perceptual quality signals that surpass pixel-wise losses.
5. **Scientific applications**: GANs generate realistic molecular structures, astronomical images, and physics simulations.

## Key Technical Details

- DCGAN (2015): 64x64 resolution, batch size 128, learning rate 0.0002 for Adam with $\beta_1 = 0.5$.
- BigGAN (Brock et al., 2018): Class-conditional ImageNet 128x128 at FID 6.9 using large batch sizes (2048), orthogonal regularization, and truncation trick.
- The truncation trick trades diversity for quality: sampling $z$ from a truncated normal (e.g., $|z_i| < 1.0$) improves FID but reduces variety.
- Typical generator parameters: 20--80M for high-resolution models. Discriminator is usually similar in size.
- Training duration: 12--48 hours on 8 V100 GPUs for 256x256 models, depending on dataset size and architecture.
- ProGAN (Karras et al., 2017): First GAN to produce 1024x1024 faces via progressive growing, achieving FID 7.48 on CelebA-HQ.

## Common Misconceptions

- **"GANs can generate anything once trained."** GANs are limited to the distribution of their training data. A GAN trained on faces cannot generate cars.
- **"The discriminator should always win early in training."** If the discriminator is too strong too early, it provides no useful gradient to the generator. Balanced training is essential.
- **"GANs learn a bijective mapping from noise to images."** The generator is a many-to-one mapping from $\mathbb{R}^{128}$ to image space. Different noise vectors can produce similar images, and not all images are reachable.
- **"FID score alone tells you how good a GAN is."** FID conflates quality and diversity. A model can achieve low FID by producing high-quality but low-diversity outputs.

## Connections to Other Concepts

- `gan-training-dynamics.md`: Practical challenges including mode collapse, instability, and solutions like Wasserstein loss and spectral normalization.
- `stylegan.md`: The most influential GAN architecture, extending the generator with a mapping network and style injection.
- `image-super-resolution.md`: SRGAN and Real-ESRGAN use GAN discriminators to achieve perceptually sharp upscaling.
- `image-to-image-translation.md`: Pix2Pix and CycleGAN apply conditional GAN frameworks to domain transfer tasks.
- `diffusion-models.md`: Gradually displaced GANs as the dominant generative paradigm starting around 2021.

## Further Reading

- Goodfellow et al., "Generative Adversarial Nets" (2014) -- The foundational paper introducing the GAN framework and its theoretical analysis.
- Radford et al., "Unsupervised Representation Learning with Deep Convolutional Generative Adversarial Networks" (2015) -- DCGAN architecture guidelines that became standard practice.
- Brock et al., "Large Scale GAN Training for High Fidelity Natural Image Synthesis" (2018) -- BigGAN scaling techniques and the truncation trick.
- Mirza and Osindero, "Conditional Generative Adversarial Nets" (2014) -- Extension of GANs to conditional generation.
- Heusel et al., "GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium" (2017) -- Introduction of FID as an evaluation metric.
