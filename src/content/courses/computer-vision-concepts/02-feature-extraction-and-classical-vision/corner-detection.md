# Corner Detection

**One-Line Summary**: Corner detection identifies points where image intensity changes sharply in multiple directions, producing stable landmarks for tracking and matching via methods like Harris and Shi-Tomasi.

**Prerequisites**: Image gradients, edge detection, convolution and filtering, eigenvalues (linear algebra)

## What Is Corner Detection?

Think of standing at a street intersection versus walking along a straight road. On the road, sliding forward or backward looks similar; at the intersection, any direction of movement changes the scene. A corner in an image works the same way: it is a point where shifting a small window in any direction produces a significant change in pixel intensities.

Technically, a corner is a location where the local autocorrelation function of the image has high curvature in all directions. This is captured by analyzing the eigenvalues of a structure tensor computed from image gradients.

## How It Works

### The Structure Tensor

For a grayscale image $I$, compute the gradient components $I_x$ and $I_y$ (e.g., via Sobel). At each pixel, form the $2 \times 2$ structure tensor (also called the second-moment matrix):

$$M = \sum_{(x,y) \in W} w(x,y) \begin{bmatrix} I_x^2 & I_x I_y \\ I_x I_y & I_y^2 \end{bmatrix}$$

where $W$ is a local window and $w(x,y)$ is typically a Gaussian weighting function with $\sigma = 1$--$2$ pixels.

### Harris Corner Detector

Harris and Stephens (1988) avoid explicit eigenvalue computation by defining a corner response function:

$$R = \det(M) - k \cdot (\text{trace}(M))^2 = \lambda_1 \lambda_2 - k(\lambda_1 + \lambda_2)^2$$

where $k$ is an empirical constant, typically $0.04$--$0.06$. The classification rule is:

- $R > T$ (positive, large): **corner** -- both eigenvalues are large.
- $R < -T$ (negative, large magnitude): **edge** -- one eigenvalue dominates.
- $|R| \approx 0$: **flat region** -- both eigenvalues are small.

After computing $R$ for every pixel, apply non-maximum suppression in a local neighborhood (commonly $3 \times 3$ or $5 \times 5$) to retain only the sharpest corners.

### Shi-Tomasi ("Good Features to Track")

Shi and Tomasi (1994) simplified the criterion to:

$$R = \min(\lambda_1, \lambda_2)$$

A point is a corner if $\min(\lambda_1, \lambda_2) > T$. This directly measures the weaker of the two gradient directions and has been shown experimentally to produce features that are more reliably tracked across frames. OpenCV's `goodFeaturesToTrack` implements this method.

### Code Example

```python
import cv2
import numpy as np

img = cv2.imread("building.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)

# Harris corners
harris = cv2.cornerHarris(gray, blockSize=2, ksize=3, k=0.04)
corners_harris = harris > 0.01 * harris.max()

# Shi-Tomasi corners
shi_tomasi = cv2.goodFeaturesToTrack(
    gray, maxCorners=500, qualityLevel=0.01, minDistance=10
)
```

### Sub-pixel Refinement

For applications demanding high geometric precision (stereo vision, calibration), detected corners are refined to sub-pixel accuracy using `cv2.cornerSubPix`, which iteratively solves the system $M \cdot \Delta p = 0$ within a search window. This typically improves localization from integer-pixel to 0.05--0.1 pixel accuracy.

## Why It Matters

1. Corners serve as the primary interest points for feature matching, visual odometry, and SLAM pipelines.
2. The Shi-Tomasi detector is the default front-end for the KLT (Kanade-Lucas-Tomasi) tracker, one of the most deployed tracking algorithms in history.
3. Camera calibration depends on accurate corner detection in checkerboard patterns to estimate intrinsic and extrinsic parameters.
4. Corner features are inherently more discriminative than edge pixels because they encode 2D structure, enabling unambiguous correspondence.

## Key Technical Details

- Harris response computation costs roughly 15 multiply-accumulate operations per pixel (for a $3 \times 3$ Sobel and $3 \times 3$ Gaussian window).
- The Harris detector is rotation-invariant but not scale-invariant. Multi-scale extensions build Gaussian pyramids and detect at each level.
- Shi-Tomasi requires an explicit eigenvalue decomposition (or equivalent), adding approximately 30% compute over Harris but improving tracking stability.
- On a 640x480 image, `goodFeaturesToTrack` with 500 corners runs in under 2 ms on a modern CPU.
- The FAST detector (Rosten and Drummond, 2006) tests a Bresenham circle of 16 pixels and runs 5--10x faster than Harris, making it the go-to choice for real-time systems like ORB-SLAM.

## Common Misconceptions

- **"Harris corners correspond to geometric corners of objects."** Not necessarily. Harris detects any point with high gradient variation in two directions -- textured patches, T-junctions, and even some texture patterns qualify.
- **"The $k$ parameter in Harris does not matter much."** Values outside the $0.04$--$0.06$ range can dramatically change the number and distribution of detected points. Lower $k$ biases toward edges; higher $k$ suppresses corners with moderate response.
- **"Shi-Tomasi always outperforms Harris."** Shi-Tomasi is better for tracking because it directly optimizes the weaker gradient direction, but Harris can be preferred in recognition tasks where the full response distribution matters.

## Connections to Other Concepts

- **Edge Detection**: Corners are special cases where two or more edges meet; the structure tensor generalizes the gradient magnitude used in edge detectors.
- **SIFT**: SIFT keypoints use Difference-of-Gaussian extrema rather than Harris, but the underlying principle of seeking high-information locations is the same.
- **Optical Flow**: The KLT tracker explicitly requires corners (Shi-Tomasi features) because the linear system for flow estimation is only well-conditioned at points with two large eigenvalues.
- **Camera Calibration and Geometry**: Checkerboard corner detection is the first step in Zhang's calibration method.

## Further Reading

- Harris, C. and Stephens, M., "A Combined Corner and Edge Detector" (1988) -- The original Harris detector paper.
- Shi, J. and Tomasi, C., "Good Features to Track" (1994) -- Eigenvalue-based reformulation with tracking experiments.
- Rosten, E. and Drummond, T., "Machine Learning for High-Speed Corner Detection" (2006) -- The FAST corner detector, learned from a decision tree on pixel comparisons.
