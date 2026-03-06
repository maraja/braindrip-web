# Image Interpolation and Resampling

**One-Line Summary**: Image interpolation estimates pixel values at non-integer coordinates by combining nearby known samples, enabling image resizing, rotation, warping, and any geometric transformation that maps output pixels to fractional input positions.

**Prerequisites**: Digital images and pixels, convolution and filtering, basic polynomial math.

## What Is Image Interpolation?

Imagine you have a thermometer reading every 10 meters along a hiking trail, and you want to estimate the temperature at a point 7 meters past one sensor. You could take the nearest sensor's reading (nearest-neighbor), average the two flanking sensors (linear interpolation), or fit a smooth curve through several nearby sensors (cubic interpolation). Image interpolation does the same thing in 2D: when a geometric transformation (scaling, rotation, perspective warp) maps an output pixel to a fractional position in the input image, you must estimate the value at that non-integer coordinate from the surrounding integer-grid samples.

Formally, given a discrete image $I[m, n]$, interpolation constructs a continuous function $\hat{I}(x, y)$ such that $\hat{I}(m, n) = I[m, n]$ at integer coordinates, and $\hat{I}(x, y)$ provides reasonable estimates at all real-valued $(x, y)$.

The general framework uses an **interpolation kernel** $h$:

$$\hat{I}(x, y) = \sum_{m} \sum_{n} I[m, n] \cdot h(x - m) \cdot h(y - n)$$

This is a convolution of the discrete samples with the interpolation kernel, and different kernels yield different methods with different quality/speed tradeoffs.

## How It Works

### Nearest-Neighbor Interpolation

The simplest method: assign the value of the closest integer-coordinate pixel.

$$\hat{I}(x, y) = I[\text{round}(x), \text{round}(y)]$$

**Kernel**: A box function of width 1 centered at the origin.

**Pros**: Fastest. Preserves hard edges (no blending). Preserves exact pixel values.
**Cons**: Produces blocky, jagged artifacts (aliasing) on diagonal edges when upscaling. Not suitable for smooth imagery.

**Use case**: Label maps, segmentation masks, and palette-indexed images where interpolated values would be meaningless.

### Bilinear Interpolation

Performs linear interpolation in two directions. For a query point $(x, y)$ surrounded by four neighbors at integer coordinates:

$$\hat{I}(x, y) = (1-\alpha)(1-\beta) \cdot I[x_0, y_0] + \alpha(1-\beta) \cdot I[x_1, y_0] + (1-\alpha)\beta \cdot I[x_0, y_1] + \alpha\beta \cdot I[x_1, y_1]$$

where $\alpha = x - x_0$, $\beta = y - y_0$, $(x_0, y_0)$ is the top-left neighbor, and $(x_1, y_1) = (x_0 + 1, y_0 + 1)$.

**Kernel**: Triangle (tent) function: $h(t) = \max(0, 1 - |t|)$.

**Pros**: Smooth results. Fast (4 multiplications + 3 additions per pixel).
**Cons**: Slight blurring, especially noticeable in text and fine patterns. Only $C^0$ continuous (smooth but with slope discontinuities).

### Bicubic Interpolation

Fits a cubic polynomial through 16 surrounding neighbors (4x4 grid). The standard cubic convolution kernel (Keys, 1981):

$$h(t) = \begin{cases} (a+2)|t|^3 - (a+3)|t|^2 + 1 & \text{if } |t| \leq 1 \\ a|t|^3 - 5a|t|^2 + 8a|t| - 4a & \text{if } 1 < |t| \leq 2 \\ 0 & \text{otherwise} \end{cases}$$

where $a = -0.5$ (the Catmull-Rom spline, which matches the ideal sinc function through the sample points) or $a = -0.75$ (sharper, often preferred for photographic images).

**Pros**: $C^1$ continuous. Sharper than bilinear with fewer artifacts. The default for most image editing software.
**Cons**: Slightly negative lobes can introduce small ringing near high-contrast edges. 4x slower than bilinear (16 samples per query).

```python
import cv2

img = cv2.imread("photo.jpg")

# Resize to 2x with different interpolation methods
h, w = img.shape[:2]
new_size = (w * 2, h * 2)

nearest = cv2.resize(img, new_size, interpolation=cv2.INTER_NEAREST)
bilinear = cv2.resize(img, new_size, interpolation=cv2.INTER_LINEAR)
bicubic = cv2.resize(img, new_size, interpolation=cv2.INTER_CUBIC)
lanczos = cv2.resize(img, new_size, interpolation=cv2.INTER_LANCZOS4)
```

### Lanczos Interpolation

Uses a windowed sinc kernel with support over $2a$ samples (typically $a = 3$, examining 36 neighbors in 2D):

$$h(t) = \begin{cases} \text{sinc}(t) \cdot \text{sinc}(t/a) & \text{if } |t| < a \\ 0 & \text{otherwise} \end{cases}$$

where $\text{sinc}(t) = \sin(\pi t) / (\pi t)$.

The sinc function is the ideal interpolation kernel (it perfectly reconstructs bandlimited signals), but it has infinite support. Lanczos approximates it with a finite window, providing the best frequency-domain characteristics among practical interpolation methods.

**Pros**: Sharpest results with minimal aliasing. Best for high-quality photographic resampling.
**Cons**: Slowest (36 samples per query for Lanczos-3). Can produce visible ringing on very sharp edges.

### Anti-Aliasing for Downsampling

Interpolation methods described above are designed for **upsampling** (mapping to positions between existing samples). When **downsampling** (reducing resolution), you must first apply a low-pass filter to prevent aliasing -- the same principle as the Nyquist theorem.

The proper pipeline for downsampling by factor $s$:

1. Apply a Gaussian blur with $\sigma \approx s / 2$.
2. Resample at the lower resolution using any interpolation method.

OpenCV's `INTER_AREA` mode handles this automatically for downsampling by averaging over source pixel regions, producing correct results without a separate pre-filter step.

```python
# Correct downsampling (halving resolution)
small = cv2.resize(img, (w // 2, h // 2), interpolation=cv2.INTER_AREA)

# Incorrect: using bicubic for downsampling without pre-filtering
# Can introduce aliasing artifacts
small_bad = cv2.resize(img, (w // 2, h // 2), interpolation=cv2.INTER_CUBIC)
```

### Geometric Transformations

Interpolation is triggered whenever a geometric transformation $T$ maps output coordinates $(x', y')$ to non-integer input coordinates $(x, y) = T^{-1}(x', y')$. Common transformations:

| Transformation | DOF | Preserves |
|---------------|-----|-----------|
| Translation | 2 | Everything |
| Rigid (Euclidean) | 3 | Distances, angles |
| Similarity | 4 | Angles, ratios |
| Affine | 6 | Parallelism |
| Projective (homography) | 8 | Straight lines |

All of these require interpolation at the transformed coordinates. The **inverse mapping** approach is standard: for each output pixel, compute where it came from in the input, then interpolate.

```python
# Rotation by 30 degrees around center using affine transform
center = (w // 2, h // 2)
M = cv2.getRotationMatrix2D(center, angle=30, scale=1.0)
rotated = cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_CUBIC,
                          borderMode=cv2.BORDER_REFLECT)
```

## Why It Matters

1. Every image resizing operation -- from displaying a thumbnail to preparing training data at a fixed input size for a neural network -- requires interpolation. The choice of method directly affects visual quality and downstream accuracy.
2. Data augmentation for deep learning (random crops, rotations, affine transforms) involves repeated interpolation; using bilinear instead of nearest-neighbor can measurably affect training outcomes.
3. Panorama stitching, image registration, and optical flow visualization all rely on sub-pixel accurate interpolation to produce seamless results.
4. Medical imaging standards (DICOM) specify interpolation requirements for displaying images at non-native resolutions to ensure diagnostic quality is maintained.

## Key Technical Details

- Bilinear interpolation on a 1-megapixel image takes approximately 1 ms on a modern CPU; bicubic takes approximately 4 ms; Lanczos-3 approximately 10 ms.
- For CNN input preprocessing, bilinear is the most common choice (used by default in PyTorch's `F.interpolate` and TensorFlow's `tf.image.resize`), balancing quality and speed.
- Bicubic with $a = -0.5$ (Catmull-Rom) exactly reproduces third-order polynomial interpolation and achieves $O(h^3)$ approximation order, compared to $O(h^2)$ for bilinear and $O(h)$ for nearest-neighbor.
- In GPU texture sampling, bilinear interpolation is hardware-accelerated and essentially free (built into the texture unit), which is why it is the standard for real-time rendering.
- Pillow (PIL) uses Lanczos-3 as its default high-quality resizing filter (`Image.LANCZOS`), while OpenCV defaults to bilinear (`INTER_LINEAR`).

## Common Misconceptions

- **"Bicubic is always better than bilinear."** For downsampling without pre-filtering, bicubic can actually produce worse results (more aliasing) than `INTER_AREA` because it does not properly band-limit the signal. The "best" method depends on the operation direction and content type.

- **"Interpolation creates new information."** Interpolation estimates values between known samples based on assumptions about signal smoothness. It cannot recover information that was lost during the original sampling. True super-resolution requires learned priors about natural image statistics.

- **"Nearest-neighbor is always inferior."** For categorical data (segmentation masks, label maps, indexed color), nearest-neighbor is the only correct choice. Bilinear interpolation of a binary mask produces gray values that have no semantic meaning; bilinear on a class-index map creates nonexistent class indices.

## Connections to Other Concepts

- **Digital Images and Pixels**: Interpolation reconstructs the continuous signal from discrete samples -- the inverse of the sampling process described in image formation.
- **Convolution and Filtering**: Every interpolation method can be expressed as convolution with an interpolation kernel, connecting resampling theory to filtering theory.
- **Image Pyramids and Scale Space**: Pyramid construction requires downsampling (with anti-aliasing), and Laplacian pyramid reconstruction requires upsampling -- both are interpolation operations.
- **Frequency Domain and Fourier Transform**: The ideal interpolation kernel (sinc function) is derived from the sampling theorem in the frequency domain. Practical kernels are finite approximations to the sinc, and their frequency responses determine aliasing behavior.

## Further Reading

- Keys, "Cubic Convolution Interpolation for Digital Image Processing" (1981) -- Derives the cubic convolution kernel family and proves the Catmull-Rom variant ($a = -0.5$) achieves third-order accuracy.
- Thevenaz et al., "Interpolation Revisited" (2000) -- Comprehensive comparison of interpolation methods from a signal processing perspective, including B-splines and their computational properties.
- Parker et al., "Comparison of Interpolating Methods for Image Resampling" (1983) -- Early systematic comparison of nearest-neighbor, bilinear, bicubic, and sinc-based methods with visual and quantitative evaluation.
- Szeliski, "Computer Vision: Algorithms and Applications" (2nd ed., 2022) -- Section 3.5 covers resampling, anti-aliasing, and the connection between interpolation and the sampling theorem.
