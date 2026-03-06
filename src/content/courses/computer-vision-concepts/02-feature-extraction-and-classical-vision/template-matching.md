# Template Matching

**One-Line Summary**: Template matching slides a reference image patch across a target image, computing a similarity score at every position to find where the template appears.

**Prerequisites**: Convolution and filtering, pixels and color spaces, image gradients, correlation

## What Is Template Matching?

Imagine you have a photograph of a specific traffic sign and you want to find that exact sign in a dashboard camera image. You could hold the photograph up to each location of the larger image, checking how well it matches. Template matching automates exactly this: it takes a small reference patch (the template), slides it pixel by pixel across the search image, and computes a similarity or distance metric at every position. The location with the best score is the detected match.

This is one of the simplest and oldest computer vision techniques, yet it remains useful for controlled environments where the target appearance is fixed and predictable.

## How It Works

### Sliding Window Comparison

Given a grayscale image $I$ of size $W \times H$ and a template $T$ of size $w \times h$, compute a response map $R$ of size $(W - w + 1) \times (H - h + 1)$:

$$R(x, y) = f\!\left(I[x:x+w,\; y:y+h],\; T\right)$$

where $f$ is a similarity or distance function evaluated over the overlapping region.

### Common Metrics

**Sum of Squared Differences (SSD):**

$$R_{\text{SSD}}(x,y) = \sum_{i,j} \left[I(x+i, y+j) - T(i,j)\right]^2$$

The minimum of $R_{\text{SSD}}$ indicates the best match. Sensitive to brightness changes.

**Normalized Cross-Correlation (NCC):**

$$R_{\text{NCC}}(x,y) = \frac{\sum_{i,j}\left[I(x+i,y+j) - \bar{I}_{xy}\right]\left[T(i,j) - \bar{T}\right]}{\sqrt{\sum_{i,j}\left[I(x+i,y+j) - \bar{I}_{xy}\right]^2 \cdot \sum_{i,j}\left[T(i,j) - \bar{T}\right]^2}}$$

where $\bar{I}_{xy}$ is the local mean of $I$ under the template and $\bar{T}$ is the template mean. NCC outputs values in $[-1, 1]$; the maximum indicates the best match. It is invariant to linear brightness and contrast changes.

**Zero-mean SSD and correlation coefficient** variants provide intermediate trade-offs between speed and illumination robustness.

### OpenCV Implementation

OpenCV provides six template matching methods via `matchTemplate`:

```python
import cv2
import numpy as np

img = cv2.imread("scene.jpg", cv2.IMREAD_GRAYSCALE)
template = cv2.imread("sign.jpg", cv2.IMREAD_GRAYSCALE)

# Normalized cross-correlation (best match at maximum)
result = cv2.matchTemplate(img, template, cv2.TM_CCOEFF_NORMED)
min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

# Draw bounding box at best match
h, w = template.shape
top_left = max_loc
bottom_right = (top_left[0] + w, top_left[1] + h)
cv2.rectangle(img, top_left, bottom_right, 255, 2)
```

### Multi-Scale Template Matching

Because basic template matching is not scale-invariant, a common extension scans the template at multiple scales:

1. Build an image pyramid or resize the template to $s \in \{0.5, 0.6, \ldots, 1.5\}$ of original size.
2. Run `matchTemplate` at each scale.
3. Keep the scale and position with the highest NCC score.

This adds a linear factor in the number of scales tested.

### Frequency-Domain Acceleration

The cross-correlation in SSD and NCC can be computed via the FFT:

$$R = \mathcal{F}^{-1}\!\left[\mathcal{F}(I) \cdot \overline{\mathcal{F}(T_{\text{padded}})}\right]$$

For large templates, this reduces complexity from $O(WHwh)$ to $O(WH \log(WH))$, providing speedups of 10--100x when $w \cdot h > 1000$.

## Why It Matters

1. Template matching is the simplest object detection method to implement and requires no training data -- only a reference image.
2. It is widely used in manufacturing for quality control: verifying component placement, checking label alignment, and detecting defects against known-good references.
3. Screen-based UI testing tools (e.g., Sikuli, Appium image comparison) use template matching to locate buttons and widgets.
4. Template matching serves as a pedagogical foundation for understanding more advanced detectors -- sliding window + HOG and even convolutional networks follow the same scan-and-score paradigm.

## Key Technical Details

- For a 640x480 image and a 64x64 template, brute-force SSD evaluates roughly $577 \times 417 \times 4096 \approx 10^9$ operations. NCC adds mean subtraction and normalization overhead.
- OpenCV's `matchTemplate` with `TM_CCOEFF_NORMED` uses integral images for the local mean and sum-of-squares terms, running in approximately 10--30 ms for the above scenario on a modern CPU.
- NCC scores above 0.8 are generally considered strong matches for clean, well-conditioned templates. In noisy or cluttered scenes, 0.6--0.7 may be acceptable with additional verification.
- Template matching fails under rotation (even 10--15 degrees degrades NCC significantly), occlusion (partial matches score poorly), and non-rigid deformation.
- For detecting multiple instances, threshold the response map and apply non-maximum suppression rather than taking only the global maximum.

## Common Misconceptions

- **"Template matching is too simple to be useful."** In controlled industrial settings with fixed cameras and known object appearance, it achieves near-perfect accuracy with minimal development time.
- **"NCC handles all illumination changes."** NCC is invariant to linear brightness and contrast changes ($\alpha I + \beta$) but not to non-uniform illumination, shadows, or specular highlights.
- **"Template matching is the same as feature matching."** Feature matching (SIFT, ORB) extracts and compares sparse local descriptors, handling rotation and scale changes. Template matching compares dense pixel grids and is fundamentally rigid.

## Connections to Other Concepts

- **Convolution and Filtering**: Template matching via cross-correlation is mathematically identical to convolution with a flipped kernel, connecting it directly to the theory of linear filters.
- **HOG**: The sliding window + HOG + SVM pipeline replaces the raw pixel template with a gradient-based descriptor, gaining robustness to illumination at the cost of added computation.
- **SIFT**: Where template matching requires an exact appearance match, SIFT tolerates viewpoint, scale, and rotation changes by abstracting to local descriptors.
- **Edge Detection**: Edge-based template matching (matching edge maps rather than intensity images) improves robustness to lighting variations in some industrial applications.

## Further Reading

- Lewis, J.P., "Fast Normalized Cross-Correlation" (1995) -- Efficient NCC computation using integral images and sum tables.
- Briechle, K. and Hanebeck, U., "Template Matching Using Fast Normalized Cross Correlation" (2001) -- Analysis of FFT-based and integral-image-based acceleration strategies.
- Brunelli, R., "Template Matching Techniques in Computer Vision" (2009) -- Comprehensive textbook covering theory and applications.
