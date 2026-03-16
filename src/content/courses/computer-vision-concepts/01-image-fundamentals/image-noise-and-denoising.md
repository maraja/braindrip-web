# Image Noise and Denoising

**One-Line Summary**: Image noise is unwanted random variation in pixel values introduced during capture or transmission, and denoising methods attempt to suppress it while preserving edges and detail -- a fundamental tradeoff that runs through all of image processing.

**Prerequisites**: Digital images and pixels, convolution and filtering, frequency domain and Fourier transform, basic probability (Gaussian and Poisson distributions).

## What Is Image Noise?

Imagine trying to listen to a friend speak at a loud concert. Their voice (the signal) is mixed with crowd noise, music, and reverberations. You can still understand them if the noise is mild, but as it gets louder, words become garbled. Image noise is the visual equivalent: random fluctuations overlaid on the true pixel values, degrading the information you are trying to capture. Just as you might cup your ear or lean closer to filter out concert noise, denoising algorithms attempt to suppress these fluctuations while keeping the important visual details intact.

The standard degradation model is:

$$I_{\text{observed}}[m, n] = I_{\text{clean}}[m, n] + \eta[m, n]$$

where $\eta[m, n]$ is the noise component. The goal of denoising is to estimate $I_{\text{clean}}$ from $I_{\text{observed}}$.

## How It Works

### Types of Noise

**Gaussian (additive white) noise**: Each pixel is corrupted by an independent sample from $\mathcal{N}(0, \sigma^2)$. This models thermal noise in the sensor's electronics and readout circuitry. The noise level is characterized by $\sigma$ (standard deviation).

**Poisson (shot) noise**: Arises from the discrete nature of photon counting. Variance equals the signal intensity: $\text{Var}[\eta] = I_{\text{clean}}$. Dominant in low-light photography, X-ray imaging, and fluorescence microscopy. Brighter regions have more absolute noise but less relative noise.

**Salt-and-pepper (impulse) noise**: Random pixels are set to the minimum (0, "pepper") or maximum (255, "salt") value. Caused by dead pixels, transmission errors, or analog-to-digital converter failures.

**Speckle noise**: Multiplicative noise following $I_{\text{observed}} = I_{\text{clean}} \cdot (1 + \eta)$. Characteristic of coherent imaging systems: ultrasound, SAR (synthetic aperture radar), and laser imaging.

**Quantization noise**: The rounding error introduced when continuous sensor voltages are mapped to discrete integer levels. For uniform quantization with step size $\Delta$, the noise has variance $\Delta^2/12$.

### Signal-to-Noise Ratio (SNR)

$$\text{SNR} = \frac{\mu_{\text{signal}}}{\sigma_{\text{noise}}}, \quad \text{SNR}_{\text{dB}} = 20 \log_{10}\left(\frac{\mu_{\text{signal}}}{\sigma_{\text{noise}}}\right)$$

A related metric for comparing denoised results to ground truth is Peak Signal-to-Noise Ratio (PSNR):

$$\text{PSNR} = 10 \log_{10}\left(\frac{\text{MAX}^2}{\text{MSE}}\right)$$

where MAX is the maximum possible pixel value (255 for 8-bit). A PSNR of 30 dB is generally considered acceptable quality; above 40 dB, differences from the original are nearly imperceptible.

### Spatial Filtering Methods

**Mean (box) filter**: Replaces each pixel with the average of its neighborhood. Simple but blurs edges.

**Gaussian filter**: Weighted averaging where closer neighbors contribute more. Reduces noise by $\sqrt{k^2}$ for a $k \times k$ kernel but blurs edges proportionally to $\sigma$.

**Median filter**: Replaces each pixel with the median of its neighborhood. Extremely effective against salt-and-pepper noise because outlier values are rejected. Nonlinear, so it does not blur edges as severely as mean filtering.

```python
import cv2
import numpy as np

noisy = cv2.imread("noisy_photo.jpg")

# Gaussian blur denoising
gaussian_denoised = cv2.GaussianBlur(noisy, (5, 5), sigmaX=1.0)

# Median filter (best for salt-and-pepper noise)
median_denoised = cv2.medianBlur(noisy, 5)
```

**Bilateral filter**: A nonlinear, edge-preserving filter that weights neighbors by both spatial distance and intensity similarity:

$$I_{\text{out}}[m, n] = \frac{1}{W} \sum_{(i,j) \in \mathcal{N}} I[i, j] \cdot \exp\left(-\frac{(m-i)^2 + (n-j)^2}{2\sigma_s^2}\right) \cdot \exp\left(-\frac{(I[m,n] - I[i,j])^2}{2\sigma_r^2}\right)$$

Pixels across strong edges have very different intensities, so they receive near-zero range weights, preserving the edge. This makes bilateral filtering particularly useful for noise reduction while maintaining sharp boundaries.

```python
# Bilateral filter: d=9 pixel diameter, sigmaColor=75, sigmaSpace=75
bilateral_denoised = cv2.bilateralFilter(noisy, d=9, sigmaColor=75, sigmaSpace=75)
```

### Non-Local Means (NLM)

Buades et al. (2005) introduced a method that averages pixels not by spatial proximity but by **patch similarity**. For each pixel, NLM searches a wide window for patches (typically 7x7) that look similar to the patch centered on the current pixel, then averages the center values of all matching patches.

$$\hat{I}[m, n] = \frac{1}{C} \sum_{(i,j) \in S} I[i, j] \cdot \exp\left(-\frac{\|P_{m,n} - P_{i,j}\|^2}{h^2}\right)$$

where $P_{m,n}$ is the patch centered at $(m, n)$, $S$ is the search window, and $h$ controls the filtering strength.

NLM exploits the self-similarity of natural images: textures and patterns repeat throughout the image, providing multiple noisy observations of the same underlying signal.

```python
# OpenCV's Non-Local Means implementation
# h=10 (filter strength), templateWindowSize=7, searchWindowSize=21
nlm_denoised = cv2.fastNlMeansDenoisingColored(noisy, None, h=10, hForColorComponents=10,
                                                 templateWindowSize=7, searchWindowSize=21)
```

### Frequency-Domain Denoising

**Wiener filter**: The optimal linear filter in the MSE sense, formulated in the frequency domain:

$$\hat{F}(u, v) = \frac{H^*(u, v)}{|H(u, v)|^2 + \frac{S_\eta(u, v)}{S_f(u, v)}} \cdot G(u, v)$$

where $H$ is the degradation function, $S_\eta$ and $S_f$ are the noise and signal power spectra. When $H = 1$ (noise-only degradation), this reduces to simple spectral weighting that suppresses frequencies dominated by noise.

### Deep Learning Denoising

**DnCNN** (Zhang et al., 2017): A 17-layer CNN trained to predict the noise residual $\hat{\eta}$ rather than the clean image directly, with the denoised result obtained as $\hat{I} = I_{\text{noisy}} - \hat{\eta}$. Batch normalization and residual learning enable training a single model effective across a range of noise levels.

**BM3D** (Dabov et al., 2007): A non-neural benchmark that combines block matching (grouping similar patches into 3D stacks), collaborative filtering in a transform domain, and aggregation. For years the gold standard in denoising, and still competitive with many deep learning methods.

Typical PSNR benchmarks on BSD68 with $\sigma = 25$ Gaussian noise:

| Method | PSNR (dB) |
|--------|-----------|
| BM3D | 28.57 |
| DnCNN | 29.23 |
| FFDNet | 29.19 |
| DRUNet (2021) | 29.48 |

## Why It Matters

1. Every digital camera image contains noise; the entire computational photography pipeline (including smartphone night modes) is built around noise management.
2. In medical imaging, noise directly limits diagnostic sensitivity. Denoising enables lower radiation doses in CT and X-ray while maintaining image quality.
3. Noise corrupts downstream algorithms: edge detection, feature matching, segmentation, and object detection all degrade with increasing noise. Proper denoising is prerequisite to robust processing.
4. The noise-detail tradeoff is one of the central tensions in image processing -- aggressive denoising removes noise but also fine textures, creating an overly smooth, "waxy" appearance.

## Key Technical Details

- A 5x5 median filter processes a 1-megapixel image in approximately 2 ms on a modern CPU; bilateral filtering at the same size takes approximately 50 ms due to its range kernel.
- OpenCV's `fastNlMeansDenoisingColored` is optimized with block-matching acceleration but still takes ~500 ms for a 1-megapixel image.
- For Poisson noise, the Anscombe transform ($f(x) = 2\sqrt{x + 3/8}$) stabilizes variance to approximately 1, allowing Gaussian denoising methods to be applied.
- Smartphone "night mode" captures 5-15 frames and averages them after alignment, reducing noise by $\sqrt{N}$ (where $N$ is the number of frames) while preserving sharpness.
- SSIM (Structural Similarity Index) is a better perceptual quality metric than PSNR for evaluating denoising; PSNR penalizes all pixel deviations equally, while SSIM accounts for structural preservation.

## Common Misconceptions

- **"More blur always means less noise."** Increasing the Gaussian kernel size reduces noise variance but also destroys signal detail. The optimal kernel size balances noise reduction with edge/texture preservation. Edge-preserving methods (bilateral, NLM) outperform isotropic blur because they adapt to local content.

- **"Noise is always additive and Gaussian."** Poisson noise (dominant in low-light), speckle noise (in ultrasound/radar), and impulse noise (dead pixels) all have fundamentally different statistical properties requiring different denoising approaches.

- **"Deep learning denoisers always beat classical methods."** On Gaussian noise benchmarks, deep methods have a clear edge. But BM3D remains competitive, especially on structured noise or out-of-distribution noise types where trained networks can produce artifacts. Classical methods also require no training data.

## Connections to Other Concepts

- `convolution-and-filtering.md`: Gaussian blur, bilateral filtering, and the smoothing step of NLM are all filtering operations. Understanding convolution is prerequisite to understanding denoising.
- `frequency-domain-and-fourier-transform.md`: Noise is typically broadband (flat power spectrum), while image content is concentrated at lower frequencies. Wiener filtering and spectral subtraction exploit this separation.
- `image-histograms.md`: Noise broadens histogram peaks, merging distinct modes and degrading the performance of threshold-based segmentation (e.g., Otsu's method). Denoising before thresholding is standard practice.
- `digital-images-and-pixels.md`: Noise originates in the image formation process (photon shot noise, read noise, quantization noise), directly connected to sensor physics.

## Further Reading

- Buades et al., "A Non-Local Algorithm for Image Denoising" (2005) -- Introduces NLM, shifting the paradigm from local to non-local averaging using patch similarity.
- Dabov et al., "Image Denoising by Sparse 3D Transform-Domain Collaborative Filtering" (2007) -- The BM3D paper, a long-standing benchmark for image denoising.
- Zhang et al., "Beyond a Gaussian Denoiser: Residual Learning of Deep CNN for Image Denoising" (2017) -- Introduces DnCNN, demonstrating that residual learning with batch normalization enables effective blind denoising.
- Foi et al., "Practical Poissonian-Gaussian Noise Modeling and Fitting for Single-Image Raw-Data" (2008) -- Provides practical models for real camera noise that combine Poisson and Gaussian components.
