# GAN Training Dynamics

**One-Line Summary**: Training GANs is notoriously unstable due to the adversarial minimax objective, with mode collapse and oscillation as primary failure modes, mitigated by architectural and loss function innovations.

**Prerequisites**: Generative adversarial networks, gradient descent optimization, Lipschitz continuity, batch normalization

## What Are GAN Training Dynamics?

Imagine two chess players learning simultaneously -- each adapts to the other's strategy, but neither stands still. The game can spiral into cycles where neither improves, or one player dominates so completely the other cannot learn. GAN training faces analogous problems: the generator and discriminator are coupled optimizers whose loss landscapes shift with every update, creating a non-stationary optimization problem fundamentally different from standard supervised learning.

Understanding and stabilizing these dynamics has been one of the most active research areas in generative modeling, producing a toolbox of techniques that made high-resolution GAN synthesis practical.

## How It Works

### Mode Collapse

Mode collapse occurs when the generator maps many different noise vectors to a small set of outputs, covering only a few modes of the data distribution. In the extreme case, $G$ produces a single image regardless of input $z$.

This happens because the minimax game has no explicit diversity objective. If the generator finds one output that consistently fools the discriminator, gradient descent reinforces that choice rather than exploring alternatives.

**Diagnosis**: Plot generated samples and check for repetition. Compute pairwise distances in feature space -- low average distance signals collapse.

### Training Instability and Oscillation

The simultaneous gradient descent on competing objectives can produce:

- **Oscillation**: $G$ and $D$ chase each other without converging. Loss curves fluctuate without trending downward.
- **Vanishing gradients**: When $D$ is too confident, $\log(1 - D(G(z))) \to 0$ provides near-zero gradient to $G$.
- **Divergence**: Unchecked discriminator growth leads to exploding gradients in the generator.

### Wasserstein GAN (WGAN)

Arjovsky et al. (2017) replaced the Jensen-Shannon divergence with the Earth Mover (Wasserstein-1) distance:

$$W(p_{\text{data}}, p_G) = \inf_{\gamma \in \Pi(p_{\text{data}}, p_G)} \mathbb{E}_{(x,y) \sim \gamma}[\|x - y\|]$$

The practical objective becomes:

$$\min_G \max_{D \in \mathcal{D}_L} \; \mathbb{E}_{x \sim p_{\text{data}}}[D(x)] - \mathbb{E}_{z \sim p_z}[D(G(z))]$$

where $\mathcal{D}_L$ is the set of 1-Lipschitz functions. The key insight is that Wasserstein distance provides meaningful gradients even when the two distributions have non-overlapping support, which is common in high-dimensional image spaces.

**Weight clipping** (original WGAN): Clamp discriminator weights to $[-c, c]$ (e.g., $c = 0.01$). Simple but limits discriminator capacity and can cause pathological gradients.

**Gradient penalty** (WGAN-GP, Gulrajani et al., 2017): Enforce the Lipschitz constraint softly:

$$\mathcal{L}_{\text{GP}} = \lambda \mathbb{E}_{\hat{x}}[(\|\nabla_{\hat{x}} D(\hat{x})\|_2 - 1)^2]$$

where $\hat{x}$ is sampled uniformly along lines between real and generated points, and $\lambda = 10$ is standard.

### Spectral Normalization

Miyato et al. (2018) proposed normalizing each weight matrix $W$ by its spectral norm (largest singular value):

$$\bar{W} = \frac{W}{\sigma(W)}$$

This ensures each layer is Lipschitz-1, making the entire discriminator Lipschitz-bounded without gradient penalties or weight clipping. It adds negligible computational overhead (one power iteration per layer per step) and stabilizes training dramatically.

### Progressive Growing

Karras et al. (2017) introduced progressive training for high-resolution generation. Training starts at 4x4 resolution and progressively doubles spatial dimensions:

4x4 -> 8x8 -> 16x16 -> 32x32 -> ... -> 1024x1024

New layers are blended in smoothly using a learnable fade-in parameter $\alpha$ that transitions from 0 to 1 over thousands of iterations. This curriculum-based approach allows $G$ and $D$ to first learn coarse structure before refining details.

### Other Stabilization Techniques

- **Two-timescale update rule (TTUR)**: Use a higher learning rate for $D$ than $G$ (e.g., $D$: 4e-4, $G$: 1e-4). Heusel et al. (2017) showed this converges to a local Nash equilibrium.
- **R1 gradient penalty**: Penalize $\|\nabla D(x)\|^2$ only on real data (Mescheder et al., 2018). Simpler than WGAN-GP and often equally effective.
- **Exponential moving average (EMA)** of generator weights: Use an EMA-smoothed copy of $G$ for evaluation, reducing output variance. Typical decay: 0.999--0.9999.
- **Minibatch discrimination**: Append statistics about the batch to discriminator features, helping it detect mode collapse (Salimans et al., 2016).

## Why It Matters

1. **Enabled practical high-res synthesis**: Without these stabilization techniques, GAN training above 64x64 was unreliable. Progressive growing and spectral normalization unlocked 1024x1024 generation.
2. **Reduced hyperparameter sensitivity**: WGAN-GP and spectral normalization make training less dependent on precise learning rate and architecture choices.
3. **Informed diffusion model design**: Many lessons from GAN training dynamics (EMA, gradient penalties, progressive schedules) transferred to diffusion model training.
4. **Benchmarking reliability**: Stable training means FID scores are reproducible, enabling meaningful comparisons between architectures.

## Key Technical Details

- WGAN-GP: Gradient penalty coefficient $\lambda = 10$, critic updates 5 per generator update, Adam with $\beta_1 = 0$, $\beta_2 = 0.9$.
- Spectral normalization: One power iteration per forward pass is sufficient; more iterations add cost without measurable benefit.
- Progressive growing: Each resolution phase trains for 600k--800k images on CelebA-HQ. Total training for 1024x1024: ~12M images seen.
- R1 penalty: Coefficient $\gamma = 10$ is standard for StyleGAN-family models. Applied every 16 steps (lazy regularization) to reduce overhead by ~40%.
- EMA decay of 0.9999 for generator weights is standard in StyleGAN2 and later models.

## Common Misconceptions

- **"Mode collapse means the GAN failed completely."** Partial mode collapse is common and may still produce useful high-quality samples. The issue is reduced diversity, not necessarily poor quality.
- **"Wasserstein loss solves all GAN training problems."** WGAN-GP improves stability but does not eliminate all failure modes. It can still suffer from training stagnation and requires careful hyperparameter selection.
- **"You should always train the discriminator more than the generator."** The optimal ratio depends on architecture and loss function. With spectral normalization and hinge loss, 1:1 updates often work well.
- **"Loss curves should decrease monotonically."** GAN losses reflect the adversarial game and often oscillate even during successful training. FID computed periodically is a better indicator of progress.

## Connections to Other Concepts

- `generative-adversarial-networks.md`: This concept dives deep into the practical challenges of the GAN framework introduced there.
- `stylegan.md`: Builds directly on progressive growing and adds style-based architecture. Uses R1 penalty and EMA extensively.
- `diffusion-models.md`: Partly motivated by the desire to avoid adversarial training instabilities entirely.
- `image-super-resolution.md`: SRGAN and variants inherit GAN training challenges and use spectral normalization and gradient penalties.

## Further Reading

- Arjovsky et al., "Wasserstein GAN" (2017) -- Introduced Earth Mover distance for GAN training and analyzed gradient behavior.
- Gulrajani et al., "Improved Training of Wasserstein GANs" (2017) -- Gradient penalty replacing weight clipping for Lipschitz enforcement.
- Miyato et al., "Spectral Normalization for Generative Adversarial Networks" (2018) -- Simple, effective Lipschitz constraint via spectral norm.
- Karras et al., "Progressive Growing of GANs for Improved Quality, Stability, and Variation" (2017) -- Resolution-progressive training enabling 1024x1024 synthesis.
- Mescheder et al., "Which Training Methods for GANs do actually Converge?" (2018) -- Convergence analysis and the R1 gradient penalty.
