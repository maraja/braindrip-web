# Image Pyramids and Scale Space

**One-Line Summary**: Image pyramids and scale-space representations capture an image at multiple resolutions and blur levels, enabling algorithms to detect features and objects regardless of their size in the scene.

**Prerequisites**: Digital images and pixels, convolution and filtering (Gaussian blur), frequency domain and Fourier transform, image interpolation and resampling.

## What Is Scale Space?

Imagine looking at a forest from different distances. From a satellite, you see the shape of the entire forest. From a hilltop, you distinguish individual tree clusters. Up close, you notice individual leaves and bark texture. The physical scene is the same, but the details you perceive depend entirely on your scale of observation. Scale-space theory formalizes this idea: by progressively blurring an image with Gaussians of increasing width, you create a family of images where fine details disappear first and coarse structures persist, allowing algorithms to "observe" the scene at whatever scale is appropriate.

Formally, the **linear scale-space representation** of an image $I(x, y)$ is defined as the family of images obtained by convolution with Gaussians of increasing variance:

$$L(x, y, t) = I(x, y) * G(x, y; t), \quad \text{where } G(x, y; t) = \frac{1}{2\pi t} \exp\left(-\frac{x^2 + y^2}{2t}\right)$$

and $t = \sigma^2$ is the scale parameter. This is the unique family of derived images satisfying the **causality** property: no new local extrema (spurious details) are created as $t$ increases.

## How It Works

### Gaussian Pyramid

A Gaussian pyramid is a discrete multi-resolution representation built by repeated smooth-then-subsample steps:

1. Start with the original image at level 0.
2. Convolve with a Gaussian kernel (typically $\sigma = 1.0$).
3. Downsample by a factor of 2 (discard every other row and column).
4. Repeat.

Each level has half the width and height of the previous one. A $1024 \times 1024$ image produces levels of size $512 \times 512$, $256 \times 256$, $128 \times 128$, etc. The total storage for the entire pyramid is $\sum_{k=0}^{\infty} (1/4)^k = 4/3$ times the original image -- only 33% overhead.

```python
import cv2

img = cv2.imread("photo.jpg")

# Build Gaussian pyramid (4 levels)
pyramid = [img]
for i in range(4):
    img = cv2.pyrDown(img)  # blur + downsample by 2
    pyramid.append(img)

# pyramid[0] = original, pyramid[1] = half-size, etc.
```

### Laplacian Pyramid

The Laplacian pyramid stores the **difference** between consecutive Gaussian pyramid levels, capturing the band-pass detail lost at each downsampling step:

$$L_k = G_k - \text{Upsample}(G_{k+1})$$

where $G_k$ is the Gaussian pyramid level $k$. The original image can be perfectly reconstructed by summing the Laplacian levels from coarsest to finest:

$$G_k = L_k + \text{Upsample}(G_{k+1})$$

Laplacian pyramids are the basis of multi-resolution blending (Burt & Adelson, 1983), where two images are blended at each frequency band independently to create seamless composites.

```python
# Build Laplacian pyramid
gaussian_pyr = [img]
for i in range(4):
    gaussian_pyr.append(cv2.pyrDown(gaussian_pyr[-1]))

laplacian_pyr = []
for i in range(4):
    upsampled = cv2.pyrUp(gaussian_pyr[i + 1],
                           dstsize=(gaussian_pyr[i].shape[1],
                                    gaussian_pyr[i].shape[0]))
    laplacian_pyr.append(gaussian_pyr[i].astype(np.float32) -
                         upsampled.astype(np.float32))
# Residual (coarsest Gaussian level) completes the representation
laplacian_pyr.append(gaussian_pyr[-1].astype(np.float32))
```

### Scale-Space Feature Detection (SIFT)

Lowe's SIFT (1999, 2004) builds a scale space by computing Difference-of-Gaussians (DoG) across octaves and scales:

1. For each **octave** (a factor-of-2 resolution level), compute Gaussian-blurred images at $s$ scales per octave: $\sigma, k\sigma, k^2\sigma, \dots$ where $k = 2^{1/s}$.
2. Compute DoG images: $D(x, y, \sigma) = L(x, y, k\sigma) - L(x, y, \sigma)$.
3. Detect local extrema (keypoints) in the 3D $(x, y, \sigma)$ space by comparing each DoG sample to its 26 neighbors (8 spatial + 9 above + 9 below).
4. Refine keypoint locations to sub-pixel/sub-scale accuracy via quadratic interpolation.

The DoG is a computationally efficient approximation to the scale-normalized Laplacian of Gaussian ($\sigma^2 \nabla^2 G$), which Lindeberg (1994) showed is the natural detector for blob-like features in scale space.

### Steerable Pyramids and Wavelets

Beyond Gaussian/Laplacian pyramids, other multi-scale decompositions exist:

- **Steerable pyramids** (Simoncelli & Freeman, 1995): Decompose into oriented sub-bands, enabling rotation-invariant analysis. Used in texture synthesis and perceptual quality metrics.
- **Wavelet transforms**: Provide a complete, non-redundant multi-resolution decomposition. The discrete wavelet transform (DWT) is used in JPEG 2000 compression.

## Why It Matters

1. Objects in real scenes appear at arbitrary scales; a pedestrian detection system must find people whether they are 20 pixels or 200 pixels tall. Multi-scale processing is the standard solution.
2. SIFT keypoints, detected in scale space, are the foundation of robust feature matching for panorama stitching, 3D reconstruction, and visual SLAM.
3. Laplacian pyramid blending produces seamless image composites used in every modern photo editor and movie VFX pipeline.
4. Feature Pyramid Networks (FPN) in deep learning (Lin et al., 2017) bring the multi-scale pyramid concept into object detection architectures like Faster R-CNN and RetinaNet, becoming the standard for detecting objects at multiple scales.

## Key Technical Details

- A typical SIFT implementation uses 4 octaves with 3 DoG scales per octave, producing 12 DoG images from which keypoints are extracted.
- The storage overhead for a complete Gaussian pyramid is exactly 1/3 of the original image (for a factor-of-2 pyramid: $1/4 + 1/16 + 1/64 + \cdots = 1/3$).
- `cv2.pyrDown` uses a 5x5 Gaussian kernel with weights $[1, 4, 6, 4, 1]/16$ before subsampling, following Burt and Adelson's original design.
- In FPN, a top-down pathway upsamples coarse feature maps and adds them element-wise to corresponding bottom-up maps, creating semantically rich features at all spatial resolutions.
- Lindeberg (1994) proved that the Gaussian kernel is the unique choice for linear scale space under natural axioms (linearity, shift invariance, isotropy, causality).

## Common Misconceptions

- **"You can just resize the image to handle multiple scales."** Naive downsampling without anti-aliasing (Gaussian pre-filtering) introduces aliasing artifacts that corrupt both the image and any features detected on it. The smooth-then-subsample pipeline is essential.

- **"The Laplacian pyramid is the same as applying a Laplacian filter."** The Laplacian pyramid captures band-pass differences between Gaussian levels. The Laplacian filter ($\nabla^2$) is a single second-derivative operator. They are related through the Difference of Gaussians approximation but are different constructs.

- **"Deep learning has made image pyramids obsolete."** Feature Pyramid Networks and multi-scale training strategies are direct descendants of the pyramid concept. The idea persists; only the implementation has shifted from hand-crafted to learned representations.

## Connections to Other Concepts

- `convolution-and-filtering.md`: Gaussian blur (convolution) is the fundamental building block of both pyramids and scale space.
- `frequency-domain-and-fourier-transform.md`: Each Gaussian pyramid level retains a progressively narrower low-frequency band; the Laplacian pyramid isolates specific frequency bands, analogous to a bank of bandpass filters.
- `image-interpolation-and-resampling.md`: Upsampling in the Laplacian pyramid reconstruction and in FPN's top-down pathway requires interpolation methods.
- `digital-images-and-pixels.md`: Pyramid construction changes the effective spatial resolution, directly relating to the sampling and Nyquist concepts of image formation.

## Further Reading

- Burt & Adelson, "The Laplacian Pyramid as a Compact Image Code" (1983) -- Introduces the Laplacian pyramid for image compression and multi-resolution blending.
- Lindeberg, "Scale-Space Theory in Computer Vision" (1994) -- The theoretical foundation for scale-space axioms and their consequences for feature detection.
- Lowe, "Distinctive Image Features from Scale-Invariant Keypoints" (2004) -- Defines the SIFT algorithm, including scale-space extrema detection and descriptor computation.
- Lin et al., "Feature Pyramid Networks for Object Detection" (2017) -- Brings multi-scale pyramid representations into modern deep learning architectures for object detection.
