# Convolution and Filtering

**One-Line Summary**: Convolution slides a small kernel (weight matrix) across an image, computing weighted sums at each position to achieve effects like blurring, sharpening, and edge detection -- and is the same operation at the heart of convolutional neural networks.

**Prerequisites**: Digital images and pixels, matrix arithmetic, basic calculus (partial derivatives).

## What Is Convolution?

Imagine holding a small magnifying glass over a page of text and sliding it across. At each position, the magnifying glass integrates what it sees into a single impression -- emphasizing some parts, ignoring others, depending on the lens shape. Image convolution works the same way: a small matrix of weights (the **kernel** or **filter**) slides across the image, and at every position it multiplies the overlapping pixel values by the corresponding weights and sums them into a single output value. Different weight patterns produce different effects: averaging weights blur, derivative-approximating weights detect edges.

Formally, the 2D discrete convolution of image $I$ with kernel $K$ of size $(2a+1) \times (2b+1)$ is:

$$(I * K)[m, n] = \sum_{i=-a}^{a} \sum_{j=-b}^{b} I[m - i, n - j] \cdot K[i, j]$$

Note: most image processing libraries actually implement **cross-correlation** (no kernel flip), which is equivalent to convolution when the kernel is symmetric:

$$(I \star K)[m, n] = \sum_{i=-a}^{a} \sum_{j=-b}^{b} I[m + i, n + j] \cdot K[i, j]$$

## How It Works

### Gaussian Blur

The Gaussian kernel approximates a 2D bell curve:

$$G(x, y) = \frac{1}{2\pi\sigma^2} \exp\left(-\frac{x^2 + y^2}{2\sigma^2}\right)$$

It is the only kernel that is both **rotationally symmetric** and **separable**: a 2D Gaussian convolution can be decomposed into two 1D passes (horizontal then vertical), reducing complexity from $O(N \cdot k^2)$ to $O(N \cdot 2k)$ where $k$ is the kernel width and $N$ is the pixel count.

```python
import cv2

# Gaussian blur with sigma=1.5, kernel auto-sized to 6*sigma+1
blurred = cv2.GaussianBlur(img, (0, 0), sigmaX=1.5)

# Box (mean) blur: 5x5 uniform averaging kernel
box_blurred = cv2.blur(img, (5, 5))
```

A practical rule: the kernel size should be at least $\lceil 6\sigma \rceil + 1$ (or the next odd integer) to capture 99.7% of the Gaussian's mass.

### Edge Detection Kernels

Edges are rapid intensity changes, detectable via first or second derivatives.

**Sobel operator** -- Approximates first derivatives with smoothing:

$$S_x = \begin{bmatrix} -1 & 0 & 1 \\ -2 & 0 & 2 \\ -1 & 0 & 1 \end{bmatrix}, \quad S_y = \begin{bmatrix} -1 & -2 & -1 \\ 0 & 0 & 0 \\ 1 & 2 & 1 \end{bmatrix}$$

Gradient magnitude: $G = \sqrt{(I * S_x)^2 + (I * S_y)^2}$

**Laplacian** -- Second derivative, detects edges as zero-crossings:

$$\nabla^2 = \begin{bmatrix} 0 & 1 & 0 \\ 1 & -4 & 1 \\ 0 & 1 & 0 \end{bmatrix}$$

**Laplacian of Gaussian (LoG)** -- Combines smoothing and edge detection, often approximated by the Difference of Gaussians (DoG).

```python
# Sobel edges
grad_x = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)
grad_y = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)
magnitude = np.sqrt(grad_x**2 + grad_y**2)

# Laplacian
laplacian = cv2.Laplacian(img, cv2.CV_64F, ksize=3)
```

### Sharpening

Sharpening enhances edges by adding a scaled Laplacian back to the original:

$$I_{\text{sharp}} = I - \alpha \cdot \nabla^2 I$$

Equivalently, unsharp masking subtracts a blurred version:

$$I_{\text{sharp}} = I + \alpha \cdot (I - I_{\text{blur}})$$

A common sharpening kernel:

$$K_{\text{sharp}} = \begin{bmatrix} 0 & -1 & 0 \\ -1 & 5 & -1 \\ 0 & -1 & 0 \end{bmatrix}$$

### Boundary Handling

When the kernel overlaps the image boundary, a strategy is needed for the missing pixels:

| Strategy | Description | Use Case |
|----------|-------------|----------|
| Zero padding | Missing pixels = 0 | Default in many CNNs |
| Replicate | Extend edge pixels outward | General filtering |
| Reflect | Mirror pixels at boundary | Avoids edge artifacts |
| Wrap | Periodic boundary | Frequency-domain consistency |

### Separable Kernels

A kernel $K$ is **separable** if it can be expressed as $K = \mathbf{c} \cdot \mathbf{r}^T$ (outer product of a column and row vector). This reduces a $k \times k$ convolution from $k^2$ multiplications per pixel to $2k$. Gaussian, box, and Sobel kernels are all separable. Checking separability: compute the rank of the kernel matrix; rank 1 means separable.

### Convolution in CNNs

In convolutional neural networks, the kernel weights are **learned** rather than hand-designed. A typical Conv2D layer applies $C_{\text{out}}$ kernels, each of size $C_{\text{in}} \times k \times k$, with a stride $s$ and padding $p$. The output spatial dimension is:

$$\text{out\_size} = \left\lfloor \frac{\text{in\_size} + 2p - k}{s} \right\rfloor + 1$$

Modern architectures (ResNet, EfficientNet) typically use 3x3 kernels stacked in depth, which is computationally more efficient than larger kernels for the same receptive field.

## Why It Matters

1. Convolution is the single most important operation in computer vision -- from classical Sobel edge detectors to billion-parameter CNNs, it is the universal mechanism for extracting local patterns.
2. Gaussian blur is the preprocessing step for nearly every scale-space and feature detection algorithm (SIFT, Harris corners, Canny edges).
3. Separability reduces the cost of large-kernel filtering from quadratic to linear in kernel size, making real-time processing practical.
4. Understanding hand-crafted kernels (Sobel, Laplacian) builds intuition for what CNN layers learn in their early stages.

## Key Technical Details

- A 3x3 convolution on a 1920x1080 single-channel image requires ~18.7 million multiply-add operations; a GPU can handle this in under 0.1 ms.
- Sobel is more noise-robust than simple finite differences because it incorporates perpendicular smoothing.
- The Scharr operator (an optimized variant of Sobel) provides better rotational symmetry for gradient estimation: weights of [3, 10, 3] instead of [1, 2, 1].
- Depthwise separable convolutions (MobileNet) further factorize standard convolution into a depthwise spatial pass and a 1x1 pointwise pass, reducing computation by a factor of roughly $k^2$.
- When filtering with large kernels ($k > 11$), frequency-domain multiplication via FFT becomes faster than spatial convolution.

## Common Misconceptions

- **"Convolution in CNNs is the same as mathematical convolution."** Most deep learning frameworks implement cross-correlation (no kernel flip). Since the kernels are learned, the distinction is irrelevant in practice, but it matters when comparing to signal processing definitions.

- **"Larger kernels are always better for detecting features."** Larger kernels have a bigger receptive field but more parameters and higher computational cost. Stacking two 3x3 convolutions achieves a 5x5 receptive field with fewer parameters (18 vs. 25) and adds a nonlinearity between them.

- **"Edge detection requires specialized kernels."** While Sobel and Canny are classic, learned CNN features in early layers converge to edge-like and Gabor-like detectors without explicit kernel design.

## Connections to Other Concepts

- `frequency-domain-and-fourier-transform.md`: Convolution in the spatial domain is equivalent to element-wise multiplication in the frequency domain (convolution theorem), enabling efficient implementation for large kernels.
- `image-pyramids-and-scale-space.md`: Gaussian blur (convolution with increasing $\sigma$) is the foundation of scale-space theory and image pyramids.
- `image-noise-and-denoising.md`: Gaussian and bilateral filtering are convolution-based denoising methods; median filtering is a nonlinear alternative.
- `morphological-operations.md`: Erosion and dilation can be viewed as nonlinear analogues of convolution using min/max instead of sum.

## Further Reading

- Canny, "A Computational Approach to Edge Detection" (1986) -- Defines the three criteria for optimal edge detection and introduces the Canny edge detector based on Gaussian-smoothed gradients.
- Krizhevsky et al., "ImageNet Classification with Deep Convolutional Neural Networks" (2012) -- AlexNet demonstrated that learned convolutional filters dramatically outperform hand-crafted features for image classification.
- Szeliski, "Computer Vision: Algorithms and Applications" (2nd ed., 2022) -- Chapter 3 provides a comprehensive treatment of linear filtering, edge detection, and separable kernels.
- Howard et al., "MobileNets: Efficient Convolutional Neural Networks for Mobile Vision Applications" (2017) -- Introduces depthwise separable convolutions that reduce computation by 8-9x with minimal accuracy loss.
