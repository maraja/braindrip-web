# Image Histograms

**One-Line Summary**: An image histogram counts the frequency of each pixel intensity level, providing a compact statistical summary that drives contrast enhancement, thresholding, and exposure analysis.

**Prerequisites**: Digital images and pixels, color spaces, basic probability and statistics.

## What Is an Image Histogram?

Imagine pouring a bag of M&Ms onto a table and sorting them by color into separate piles. The height of each pile tells you how many candies of that color you have. An image histogram does the same thing with pixel intensities: it sorts every pixel into bins based on its brightness (or color channel value) and counts how many pixels fall into each bin. The result is a bar chart showing the distribution of intensities across the image.

Formally, for a grayscale image $I$ with intensity levels $\{0, 1, \dots, L-1\}$, the histogram $h(k)$ is:

$$h(k) = \#\{(m, n) : I[m, n] = k\}, \quad k = 0, 1, \dots, L-1$$

The **normalized histogram** (probability mass function) is:

$$p(k) = \frac{h(k)}{M \times N}$$

where $M \times N$ is the total number of pixels.

## How It Works

### Computing a Histogram

For an 8-bit image ($L = 256$), histogram computation is a single pass through all pixels, incrementing a 256-element counter array. The time complexity is $O(M \times N)$, and it requires only $O(L)$ additional memory.

```python
import cv2
import numpy as np

img = cv2.imread("photo.jpg", cv2.IMREAD_GRAYSCALE)

# Using NumPy (fastest for large images)
hist, bin_edges = np.histogram(img.ravel(), bins=256, range=(0, 256))

# Using OpenCV (optimized C++ backend)
hist_cv = cv2.calcHist([img], [0], None, [256], [0, 256])
```

### Histogram Equalization

Histogram equalization remaps intensity values so the output histogram is approximately uniform, maximizing contrast. The transformation uses the **cumulative distribution function** (CDF):

$$T(k) = \text{round}\left((L - 1) \cdot \sum_{j=0}^{k} p(j)\right)$$

Each input pixel with value $k$ is mapped to $T(k)$. This is a monotonic, invertible mapping that stretches crowded intensity regions and compresses sparse ones.

```python
# OpenCV's built-in equalization
equalized = cv2.equalizeHist(img)
```

**Limitation**: Global equalization can over-amplify noise in uniform regions and produce unnatural-looking results.

### Contrast Limited Adaptive Histogram Equalization (CLAHE)

CLAHE (Zuiderveld, 1994) addresses global equalization's problems by:

1. Dividing the image into small tiles (default 8x8 grid).
2. Computing and equalizing the histogram of each tile independently.
3. Clipping the histogram at a threshold (`clipLimit`) to prevent noise amplification -- clipped counts are redistributed uniformly across all bins.
4. Bilinearly interpolating between tile mappings to eliminate block boundary artifacts.

```python
clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
result = clahe.apply(img)
```

CLAHE is the standard preprocessing step in medical imaging (retinal scans, X-rays) where local contrast enhancement reveals diagnostic details.

### Histogram-Based Thresholding (Otsu's Method)

Otsu's method (1979) automatically selects a binarization threshold by maximizing the **between-class variance** $\sigma_B^2(t)$:

$$\sigma_B^2(t) = \omega_0(t) \cdot \omega_1(t) \cdot [\mu_0(t) - \mu_1(t)]^2$$

where $\omega_0(t)$ and $\omega_1(t)$ are the class probabilities (pixels below and above threshold $t$), and $\mu_0(t)$, $\mu_1(t)$ are the corresponding class means. The optimal threshold is:

$$t^* = \arg\max_{t} \sigma_B^2(t)$$

This exhaustive search over 256 possible thresholds is $O(L)$ after precomputing cumulative sums, making it effectively instantaneous.

```python
threshold_value, binary_img = cv2.threshold(
    img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
)
```

### Histogram Comparison

Histograms can be compared for image retrieval or change detection. Common metrics:

| Metric | Formula | Range |
|--------|---------|-------|
| Correlation | $\frac{\sum_k (h_1(k) - \bar{h_1})(h_2(k) - \bar{h_2})}{\sqrt{\sum_k (h_1(k) - \bar{h_1})^2 \cdot \sum_k (h_2(k) - \bar{h_2})^2}}$ | [-1, 1] |
| Chi-squared | $\sum_k \frac{(h_1(k) - h_2(k))^2}{h_1(k)}$ | [0, inf) |
| Bhattacharyya | $\sqrt{1 - \sum_k \sqrt{p_1(k) \cdot p_2(k)}}$ | [0, 1] |
| Earth Mover's Distance | Min-cost transport between distributions | [0, inf) |

## Why It Matters

1. Histograms provide a global summary of image exposure in $O(N)$ time, which is why every camera and photo editor displays them in real time.
2. Otsu's thresholding remains one of the most widely used segmentation methods in industrial inspection, document scanning, and biomedical imaging due to its simplicity and zero-parameter design.
3. CLAHE is a standard preprocessing step in medical imaging pipelines, directly improving diagnostic accuracy in retinal and chest X-ray analysis.
4. Histogram comparison was the backbone of early content-based image retrieval systems and remains useful as a fast, coarse similarity measure.

## Key Technical Details

- Computing a histogram for a 12-megapixel image takes under 5 ms on a modern CPU.
- Otsu's method assumes a bimodal histogram. For multimodal distributions, multi-level Otsu or alternative methods (e.g., Kapur's entropy method) are needed.
- CLAHE's default `clipLimit=2.0` and `tileGridSize=(8,8)` work well for many applications, but medical imaging often uses clipLimit values of 1.0--4.0 depending on modality.
- Histogram equalization of color images should be done on the luminance channel only (e.g., L in LAB or V in HSV), not independently on R, G, B, which would cause color shifts.
- The cumulative histogram (CDF) is also used in histogram matching (specification), which transforms one image's distribution to match a target distribution.

## Common Misconceptions

- **"Two images with identical histograms look the same."** A histogram discards all spatial information. A checkerboard and a half-black/half-white split image can have identical histograms but look completely different.

- **"Histogram equalization always improves image quality."** Global equalization can wash out images that are intentionally low-contrast (e.g., foggy scenes) and amplify sensor noise in dark regions. It is a tool, not a universal enhancement.

- **"Otsu's method works on any image."** Otsu assumes two dominant intensity classes. It fails on images with unimodal histograms (no clear foreground/background separation) or more than two peaks without extension to multi-threshold Otsu.

## Connections to Other Concepts

- **Digital Images and Pixels**: Histograms are computed directly from pixel values; the bit depth determines the number of bins.
- **Color Spaces**: Equalizing in LAB (on L*) or HSV (on V) preserves color relationships, while per-channel RGB equalization introduces hue shifts.
- **Image Noise and Denoising**: Noise broadens histograms and can merge distinct peaks, making threshold selection harder; denoising before thresholding is common practice.
- **Morphological Operations**: Binary images produced via histogram-based thresholding are often refined with morphological opening and closing.

## Further Reading

- Otsu, "A Threshold Selection Method from Gray-Level Histograms" (1979) -- The seminal paper on automatic thresholding; one of the most cited papers in image processing with over 50,000 citations.
- Zuiderveld, "Contrast Limited Adaptive Histogram Equalization" (1994) -- Introduces CLAHE, now a standard tool in medical and industrial imaging.
- Gonzalez & Woods, "Digital Image Processing" (4th ed., 2018) -- Chapters 3-4 cover histogram processing, equalization, and specification in thorough detail.
- Swain & Ballard, "Color Indexing" (1991) -- Pioneered the use of color histograms for object recognition and image retrieval.
