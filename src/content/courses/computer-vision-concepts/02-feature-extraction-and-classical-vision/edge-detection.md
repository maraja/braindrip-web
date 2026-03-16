# Edge Detection

**One-Line Summary**: Edge detection identifies boundaries in images where pixel intensity changes sharply, using gradient-based operators like Sobel and multi-stage pipelines like Canny.

**Prerequisites**: Pixels and color spaces, convolution and filtering, image gradients

## What Is Edge Detection?

Imagine tracing the outline of objects in a photograph with a pen -- you instinctively follow the places where one surface ends and another begins. Edge detection automates exactly this: it finds pixels where intensity changes abruptly, producing a binary or weighted map of boundary locations.

Formally, an edge is a point where the first derivative of image intensity reaches a local extremum, or equivalently, where the second derivative crosses zero. In practice, we approximate these derivatives with discrete convolution kernels applied to the pixel grid.

## How It Works

### Gradient Computation with Sobel

The Sobel operator convolves the image with two $3 \times 3$ kernels to estimate horizontal and vertical gradients:

$$G_x = \begin{bmatrix} -1 & 0 & +1 \\ -2 & 0 & +2 \\ -1 & 0 & +1 \end{bmatrix} * I, \quad G_y = \begin{bmatrix} -1 & -2 & -1 \\ 0 & 0 & 0 \\ +1 & +2 & +1 \end{bmatrix} * I$$

The gradient magnitude and direction are then:

$$M = \sqrt{G_x^2 + G_y^2}, \quad \theta = \arctan\!\left(\frac{G_y}{G_x}\right)$$

Sobel is fast (six additions and two multiplications per pixel per kernel) but produces thick edges and is sensitive to noise.

### The Canny Edge Detector

Canny (1986) formalized three criteria for an optimal edge detector -- good detection, good localization, and single response -- and proposed a multi-stage pipeline:

1. **Gaussian smoothing.** Convolve with a Gaussian kernel ($\sigma$ typically 1.0--2.0) to suppress noise.
2. **Gradient computation.** Apply Sobel or similar kernels to get $M$ and $\theta$.
3. **Non-maximum suppression (NMS).** For each pixel, check whether its gradient magnitude is the local maximum along the gradient direction. Suppress pixels that are not, thinning edges to one-pixel width.
4. **Double thresholding.** Classify pixels as strong ($M > T_{\text{high}}$), weak ($T_{\text{low}} < M \le T_{\text{high}}$), or suppressed ($M \le T_{\text{low}}$). A common ratio is $T_{\text{high}} / T_{\text{low}} \approx 2$--$3$.
5. **Edge tracking by hysteresis.** Retain weak pixels only if they are connected (8-connected) to at least one strong pixel.

### Laplacian of Gaussian (LoG)

An alternative approach convolves the image with the Laplacian of a Gaussian:

$$\text{LoG}(x, y) = -\frac{1}{\pi\sigma^4}\left[1 - \frac{x^2 + y^2}{2\sigma^2}\right]e^{-(x^2+y^2)/(2\sigma^2)}$$

Zero crossings of the output indicate edges. The Difference of Gaussians (DoG) approximation is computationally cheaper and forms the basis of multi-scale edge analysis.

### Code Example (OpenCV)

```python
import cv2
import numpy as np

img = cv2.imread("scene.jpg", cv2.IMREAD_GRAYSCALE)

# Sobel edges
sobel_x = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)
sobel_y = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)
sobel_mag = np.sqrt(sobel_x**2 + sobel_y**2)

# Canny edges
canny = cv2.Canny(img, threshold1=50, threshold2=150, apertureSize=3)
```

## Why It Matters

1. Edge maps are the foundation for contour detection, shape analysis, and object boundary extraction.
2. Nearly every classical vision pipeline -- from OCR to lane detection -- begins with edge detection as a preprocessing step.
3. The Canny detector remains a default choice in industrial inspection systems where reliability and speed matter more than learned features.
4. Edge-based representations reduce image data by roughly 90--95%, keeping only structurally informative pixels.

## Key Technical Details

- Sobel runs in $O(n)$ per pixel for a $k \times k$ kernel (separable into two 1D passes), making it suitable for real-time applications at 1080p and above.
- Canny's five-stage pipeline typically adds 3--5 ms per 640x480 frame on a modern CPU.
- The Gaussian $\sigma$ in Canny controls the scale of detected edges: $\sigma = 1$ captures fine texture; $\sigma = 3$+ emphasizes coarse object boundaries.
- The Scharr operator offers improved rotational symmetry over Sobel with kernels weighted $[{-3, 0, 3}; {-10, 0, 10}; {-3, 0, 3}]$.
- Structured Edge Detection (Dollar and Zitnick, 2013) uses random forests on edge patches and achieves an ODS F-score of 0.746 on BSDS500, outperforming Canny (approx. 0.60).

## Common Misconceptions

- **"Canny is obsolete because we have deep learning."** Canny is still widely used in robotics, embedded systems, and preprocessing pipelines. Learned edge detectors like HED achieve higher benchmark scores but require GPU inference.
- **"Edge detection and contour detection are the same thing."** Edge detection finds individual boundary pixels; contour detection groups them into ordered curves. OpenCV's `findContours` operates on a binary edge map but performs a separate chain-code tracing step.
- **"A single threshold is sufficient for Sobel."** Single thresholding produces many false edges in noisy regions. Canny's hysteresis (double threshold) exists precisely to handle this problem.

## Connections to Other Concepts

- `convolution-and-filtering.md`: Edge kernels are specific convolution filters; understanding padding, stride, and separability is essential.
- `corner-detection.md`: Corners are points where edges meet at high curvature; Harris detection builds directly on gradient computation.
- `hough-transform.md`: Operates on edge maps to detect parametric shapes like lines and circles.
- `hog.md`: Histograms of gradient orientations aggregate edge information over spatial cells for object recognition.

## Further Reading

- Canny, J., "A Computational Approach to Edge Detection" (1986) -- The foundational paper defining optimal edge detection criteria.
- Dollar, P. and Zitnick, C.L., "Structured Forests for Fast Edge Detection" (2013) -- Learning-based edges with real-time speed.
- Xie, S. and Tu, Z., "Holistically-Nested Edge Detection (HED)" (2015) -- Deep multi-scale edge prediction reaching ODS F-score 0.782 on BSDS500.
