# Autoencoders and VAEs

**One-Line Summary**: Autoencoders learn compressed latent representations by encoding inputs and reconstructing them, while Variational Autoencoders add a probabilistic structure that enables principled generation of new data.

**Prerequisites**: Convolutional neural networks, backpropagation, probability distributions, KL divergence basics

## What Is an Autoencoder?

Imagine compressing a photograph into a tiny summary -- a few numbers that capture the essence of the image -- then trying to reconstruct the full photograph from only that summary. An autoencoder does exactly this: an encoder network squeezes the input into a low-dimensional latent code $z$, and a decoder network expands $z$ back into the original input space. The bottleneck forces the network to learn which features truly matter.

A standard (deterministic) autoencoder minimizes reconstruction loss:

$$\mathcal{L}_{\text{AE}} = \| x - \hat{x} \|^2$$

where $x$ is the input and $\hat{x} = \text{Dec}(\text{Enc}(x))$ is the reconstruction.

A **Variational Autoencoder (VAE)**, introduced by Kingma and Welling (2013), replaces the deterministic latent code with a probability distribution. The encoder outputs parameters $\mu$ and $\sigma$ of a Gaussian, and a latent sample is drawn via the reparameterization trick: $z = \mu + \sigma \odot \epsilon$, where $\epsilon \sim \mathcal{N}(0, I)$.

## How It Works

### Deterministic Autoencoders

The encoder $q_\phi(z|x)$ maps input $x$ to a fixed-length vector $z \in \mathbb{R}^d$. The decoder $p_\theta(x|z)$ maps $z$ back to the input space. Training minimizes pixel-wise MSE or binary cross-entropy between input and output. Common variants include:

- **Undercomplete autoencoders**: Bottleneck dimension $d$ is smaller than input dimension, forcing compression.
- **Sparse autoencoders**: Add an $L_1$ penalty on activations to encourage sparse codes.
- **Denoising autoencoders**: Corrupt input with noise and train to recover the clean signal (Vincent et al., 2008).

### Variational Autoencoders

VAEs optimize the Evidence Lower Bound (ELBO):

$$\mathcal{L}_{\text{VAE}} = \mathbb{E}_{q_\phi(z|x)}[\log p_\theta(x|z)] - D_{\text{KL}}(q_\phi(z|x) \| p(z))$$

The first term is the reconstruction likelihood. The second term -- the KL divergence -- regularizes the encoder to produce latent distributions close to the prior $p(z) = \mathcal{N}(0, I)$.

For Gaussian encoder output $q_\phi(z|x) = \mathcal{N}(\mu, \text{diag}(\sigma^2))$, the KL term has a closed-form solution:

$$D_{\text{KL}} = -\frac{1}{2}\sum_{j=1}^{d}(1 + \log \sigma_j^2 - \mu_j^2 - \sigma_j^2)$$

### The Reparameterization Trick

Sampling $z \sim q_\phi(z|x)$ is not differentiable. The trick rewrites $z = \mu + \sigma \odot \epsilon$ with $\epsilon \sim \mathcal{N}(0, I)$, pushing stochasticity outside the computational graph so gradients flow through $\mu$ and $\sigma$.

### Beta-VAE and Disentanglement

Higgins et al. (2017) introduced $\beta$-VAE, which scales the KL term by $\beta > 1$:

$$\mathcal{L}_{\beta\text{-VAE}} = \mathbb{E}[\log p_\theta(x|z)] - \beta \cdot D_{\text{KL}}(q_\phi(z|x) \| p(z))$$

Higher $\beta$ encourages disentangled latent factors at the cost of reconstruction quality.

### VQ-VAE

Van den Oord et al. (2017) proposed Vector Quantized VAE, replacing continuous latents with a discrete codebook of $K$ embedding vectors $e_k \in \mathbb{R}^d$. The encoder output $z_e(x)$ is quantized by mapping to the nearest codebook entry:

$$z_q(x) = e_k \quad \text{where} \quad k = \arg\min_j \| z_e(x) - e_j \|_2$$

The training loss combines reconstruction, codebook alignment, and commitment terms:

$$\mathcal{L}_{\text{VQ}} = \| x - \hat{x} \|^2 + \| \text{sg}[z_e(x)] - e \|^2 + \beta \| z_e(x) - \text{sg}[e] \|^2$$

where $\text{sg}[\cdot]$ is the stop-gradient operator and $\beta = 0.25$ is the commitment coefficient. Gradients for the encoder pass through the quantization via straight-through estimation. VQ-VAE achieves high-fidelity reconstruction and serves as a foundation for later models like DALL-E.

## Why It Matters

1. **Dimensionality reduction**: Autoencoders learn nonlinear compressions superior to PCA for complex data like images.
2. **Generative modeling**: VAEs provide a principled framework to sample new images by drawing $z \sim \mathcal{N}(0, I)$ and decoding.
3. **Latent space arithmetic**: VAE latent spaces support interpolation -- walking between two face images produces smooth transitions.
4. **Downstream tasks**: Pretrained encoders serve as feature extractors for classification, anomaly detection, and retrieval.
5. **Foundation for modern architectures**: VQ-VAE is a core component of latent diffusion models (Stable Diffusion) and discrete generative models.

## Key Technical Details

- Typical latent dimensions: 64--512 for image autoencoders; VQ-VAE uses codebooks of 512--8192 vectors.
- VAEs trained on CelebA 64x64 typically achieve reconstruction FID around 40--60, significantly worse than GANs (~10) at the same resolution.
- The "posterior collapse" problem occurs when the decoder is too powerful and ignores $z$; mitigation strategies include KL annealing, free bits, and cyclical schedules.
- VQ-VAE-2 (Razavi et al., 2019) achieves FID 31 on 256x256 CelebA-HQ using a hierarchical discrete latent space.
- Training is stable compared to GANs -- standard Adam optimizer with learning rate 1e-4 works reliably.

## Common Misconceptions

- **"VAEs generate blurry images because the model is bad."** The blurriness comes from optimizing pixel-wise reconstruction likelihood under a Gaussian assumption, which averages over modes. Using perceptual losses or adversarial training (VAE-GAN) substantially sharpens outputs.
- **"The KL term is just a regularizer you can drop."** Without the KL term, the latent space has no structure and sampling from $\mathcal{N}(0, I)$ produces garbage. The KL term is what makes a VAE generative.
- **"Autoencoders are the same as PCA."** A linear autoencoder with MSE loss recovers the PCA subspace, but nonlinear autoencoders learn much richer representations.
- **"Larger latent dimensions are always better."** Beyond a task-dependent optimum, increasing latent dimension wastes capacity on noise and can degrade generalization. For CelebA faces, latent dimensions of 128--256 typically suffice.

## Connections to Other Concepts

- `diffusion-models.md`: Use a pretrained VAE (or VQ-VAE) encoder/decoder to move diffusion into a compressed latent space.
- `generative-adversarial-networks.md`: VAE-GAN hybrids use adversarial losses to sharpen VAE reconstructions.
- `image-super-resolution.md`: Autoencoders provide the backbone architecture for many super-resolution networks.
- `neural-style-transfer.md`: Encoder features from autoencoders overlap conceptually with VGG features used in style transfer.

## Further Reading

- Kingma and Welling, "Auto-Encoding Variational Bayes" (2013) -- The original VAE paper introducing the reparameterization trick and ELBO objective.
- Higgins et al., "beta-VAE: Learning Basic Visual Concepts with a Constrained Variational Framework" (2017) -- Disentangled representation learning via scaled KL.
- Van den Oord et al., "Neural Discrete Representation Learning" (2017) -- VQ-VAE with discrete codebooks.
- Razavi et al., "Generating Diverse High-Fidelity Images with VQ-VAE-2" (2019) -- Hierarchical VQ-VAE achieving near-GAN quality.
- Vincent et al., "Extracting and Composing Robust Features with Denoising Autoencoders" (2008) -- Denoising autoencoders and their connection to score matching.
