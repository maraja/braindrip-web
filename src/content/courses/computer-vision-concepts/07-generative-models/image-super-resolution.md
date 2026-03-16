# Image Super-Resolution

**One-Line Summary**: Image super-resolution recovers high-resolution detail from low-resolution inputs, evolving from simple CNN upscaling (SRCNN) through GAN-based perceptual methods (SRGAN) to robust real-world models (Real-ESRGAN).

**Prerequisites**: Convolutional neural networks, generative adversarial networks, perceptual loss, image degradation models

## What Is Image Super-Resolution?

Imagine zooming into a small, blurry photograph and having the computer fill in crisp details -- sharpening facial features, revealing text, reconstructing textures. Image super-resolution (SR) is the task of estimating a high-resolution (HR) image from a low-resolution (LR) input, typically at 2x, 4x, or 8x magnification. The problem is inherently ill-posed: many HR images could produce the same LR image when downsampled, so the model must learn plausible priors about natural images.

The field has progressed from pixel-accuracy-focused methods that produce smooth but blurry outputs to perception-focused methods that synthesize realistic textures at the cost of exact pixel fidelity.

## How It Works

### SRCNN: The Pioneer

Dong et al. (2014) introduced the first deep learning SR method. SRCNN is a shallow 3-layer CNN applied to a bicubic-upsampled input:

1. Patch extraction: $9 \times 9$ conv, 64 filters
2. Nonlinear mapping: $1 \times 1$ conv, 32 filters
3. Reconstruction: $5 \times 5$ conv, 1 filter (or 3 for RGB)

Trained with MSE loss: $\mathcal{L} = \|I^{\text{HR}} - f(I^{\text{LR}})\|^2$

Despite only ~57K parameters, SRCNN outperformed all classical methods (bicubic, sparse coding) by 0.5--1.0 dB PSNR.

### Sub-Pixel Convolution

Shi et al. (2016) introduced an efficient upsampling strategy: instead of upsampling the input first, operate entirely at low resolution and use a sub-pixel shuffle (pixel shuffle) layer to rearrange $r^2$ channels into spatial dimensions:

$$I^{\text{HR}}_{x,y} = I^{\text{LR}}_{\lfloor x/r \rfloor, \lfloor y/r \rfloor, r \cdot \text{mod}(y,r) + \text{mod}(x,r)}$$

This is computationally cheaper than transposed convolutions and avoids checkerboard artifacts.

### EDSR and Deeper Networks

Lim et al. (2017) proposed Enhanced Deep Super-Resolution (EDSR), removing batch normalization from residual blocks (saving ~40% memory) and scaling residual connections by 0.1. With 32 residual blocks and 256 filters, EDSR achieved 32.46 dB PSNR on Set5 at 4x, a significant jump over earlier methods.

### SRGAN: Perceptual Super-Resolution

Ledig et al. (2017) recognized that MSE-optimized models produce high PSNR but perceptually blurry results. SRGAN introduced:

**Perceptual loss** (content loss): Compare VGG-19 features instead of pixels:

$$\mathcal{L}_{\text{perceptual}} = \frac{1}{C_j H_j W_j} \| \phi_j(I^{\text{HR}}) - \phi_j(G(I^{\text{LR}})) \|^2$$

where $\phi_j$ is the $j$-th layer feature map of a pretrained VGG-19.

**Adversarial loss**: A discriminator distinguishes real HR images from super-resolved outputs:

$$\mathcal{L}_{\text{adv}} = -\log D(G(I^{\text{LR}}))$$

**Total loss**: $\mathcal{L} = \mathcal{L}_{\text{perceptual}} + 10^{-3} \mathcal{L}_{\text{adv}}$

SRGAN produces sharper textures than MSE-optimized methods but at 0.5--1.0 dB lower PSNR -- illustrating the perception-distortion tradeoff (Blau and Michaeli, 2018).

### ESRGAN

Wang et al. (2018) improved SRGAN with:
- Residual-in-Residual Dense Blocks (RRDB): Dense connections without batch normalization.
- Relativistic discriminator: $D$ predicts whether a real image is "more realistic" than a fake one, rather than absolute real/fake.
- VGG features before activation (instead of after), providing stronger supervision.

ESRGAN achieves better perceptual quality and won the PIRM 2018 SR challenge (perception track).

### Real-ESRGAN: Handling Real-World Degradation

Classical SR assumes a simple bicubic downsampling degradation. Real images suffer from blur, noise, compression artifacts, and ringing -- simultaneously. Wang et al. (2021) introduced Real-ESRGAN:

**High-order degradation model**: Apply degradation twice in sequence:

$$I^{\text{LR}} = [(\text{blur}_2 \circ \text{resize}_2 \circ \text{noise}_2 \circ \text{JPEG}_2) \circ (\text{blur}_1 \circ \text{resize}_1 \circ \text{noise}_1 \circ \text{JPEG}_1)](I^{\text{HR}})$$

Each stage randomly samples blur kernels (isotropic and anisotropic Gaussian, generalized Gaussian, plateau), resize operations (area, bilinear, bicubic), noise (Gaussian, Poisson), and JPEG compression (quality 30--95).

**U-Net discriminator**: Replaces the patch discriminator with a U-Net that provides both global and local feedback via per-pixel real/fake predictions plus a global classification.

### Diffusion-Based Super-Resolution

SR3 (Saharia et al., 2022) applies diffusion models to SR, conditioning the denoising process on the LR input concatenated with the noisy HR estimate. StableSR (Wang et al., 2023) uses Stable Diffusion's pretrained generative prior for SR, achieving remarkable detail synthesis on real-world images.

## Why It Matters

1. **Media and entertainment**: Upscaling old films, photos, and video game textures to modern display resolutions.
2. **Surveillance and forensics**: Enhancing low-resolution security camera footage for identification.
3. **Medical imaging**: Improving resolution of MRI, CT, and microscopy images without increased acquisition time or radiation.
4. **Satellite imagery**: Enhancing spatial resolution of remote sensing data for urban planning and environmental monitoring.
5. **Computational photography**: Smartphone cameras use SR to produce detailed images from small sensors.

## Key Technical Details

- PSNR benchmarks on Set5 (4x): Bicubic = 28.42 dB, SRCNN = 30.48 dB, EDSR = 32.46 dB, RCAN = 32.63 dB. Higher PSNR does not always mean better perceptual quality.
- SRGAN vs EDSR on perceptual metrics: SRGAN achieves LPIPS ~0.07 vs. EDSR ~0.12 on BSD100 (lower is better), despite EDSR having ~1 dB higher PSNR.
- Real-ESRGAN model size: ~16.7M parameters (RRDB architecture). Inference: ~0.1s per 256x256 to 1024x1024 on an RTX 3090.
- Training data: DIV2K (800 images) is the standard benchmark dataset. Real-ESRGAN augments with degradation synthesis on ~3000 high-quality images.
- The perception-distortion tradeoff is mathematically proven: no algorithm can simultaneously minimize distortion (PSNR) and maximize perceptual quality (human preference).

## Common Misconceptions

- **"Super-resolution recovers true details."** SR hallucinates plausible details based on learned priors. The generated textures look realistic but are not ground truth -- this matters critically for forensic and medical applications.
- **"Higher PSNR means better visual quality."** PSNR measures pixel-level accuracy. Human perception favors sharp textures over blurry but pixel-accurate reconstructions. LPIPS and FID better correlate with human judgment.
- **"4x SR on any image gives good results."** Quality depends heavily on the degradation type. Models trained on bicubic downsampling fail on JPEG-compressed or noisy inputs. Real-ESRGAN addresses this with realistic degradation modeling.
- **"You can keep upscaling repeatedly for unlimited resolution."** Each SR pass introduces hallucinated details and potential artifacts. Cascading 2x models to achieve 8x produces worse results than a single 8x model.

## Connections to Other Concepts

- `generative-adversarial-networks.md`: SRGAN and Real-ESRGAN rely on GAN discriminators for perceptual quality.
- `diffusion-models.md`: Diffusion-based SR (SR3, StableSR) uses iterative denoising conditioned on LR input.
- `autoencoders-and-vaes.md`: The autoencoder in latent diffusion SR compresses and reconstructs the image.
- `image-inpainting.md`: Both tasks fill in missing information -- inpainting fills spatial gaps, SR fills frequency gaps.
- `neural-style-transfer.md`: Perceptual loss (VGG features) originated in style transfer and became central to SR.

## Further Reading

- Dong et al., "Image Super-Resolution Using Deep Convolutional Networks" (2014) -- SRCNN, the first deep learning SR method.
- Ledig et al., "Photo-Realistic Single Image Super-Resolution Using a Generative Adversarial Network" (2017) -- SRGAN introducing perceptual and adversarial losses for SR.
- Wang et al., "ESRGAN: Enhanced Super-Resolution Generative Adversarial Networks" (2018) -- RRDB architecture and relativistic discriminator.
- Wang et al., "Real-ESRGAN: Training Real-World Blind Super-Resolution with Pure Synthetic Data" (2021) -- Realistic degradation modeling for practical SR.
- Blau and Michaeli, "The Perception-Distortion Tradeoff" (2018) -- Theoretical foundation for the PSNR vs. perceptual quality tradeoff.
