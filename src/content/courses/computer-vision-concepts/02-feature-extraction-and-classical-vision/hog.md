# HOG (Histogram of Oriented Gradients)

**One-Line Summary**: HOG captures local shape and appearance by aggregating gradient orientation histograms over dense spatial cells, forming the classical descriptor behind the breakthrough Dalal-Triggs pedestrian detector.

**Prerequisites**: Image gradients, edge detection, histogram representations, sliding window detection

## What Is HOG?

Consider how a caricature artist captures a person's likeness -- they emphasize the dominant outlines and proportions, ignoring color and fine texture. HOG does something analogous: it discards raw pixel values and instead encodes the distribution of gradient directions within small spatial regions. The resulting descriptor captures the shape silhouette of objects and is robust to small changes in appearance, position, and illumination.

Dalal and Triggs (2005) introduced HOG for pedestrian detection at CVPR 2005, achieving results that immediately outperformed all prior methods and launched a decade of sliding-window object detection research.

## How It Works

### Step 1: Gradient Computation

Apply simple centered difference filters $[-1, 0, 1]$ horizontally and vertically to compute gradient magnitude $M$ and orientation $\theta$ at every pixel:

$$M(x,y) = \sqrt{G_x^2 + G_y^2}, \quad \theta(x,y) = \arctan\!\left(\frac{G_y}{G_x}\right)$$

Use unsigned gradients ($0$--$180^\circ$) for most applications, since the sign of the contrast is less informative for shape. Dalal and Triggs found that no Gaussian smoothing is needed before gradient computation.

### Step 2: Cell Histograms

Divide the detection window (typically $64 \times 128$ pixels for pedestrians) into small spatial cells, usually $8 \times 8$ pixels. Within each cell, accumulate a histogram of $B = 9$ orientation bins (each covering $20^\circ$), weighted by gradient magnitude. Use bilinear interpolation to distribute each pixel's vote across adjacent bins and adjacent cells, reducing aliasing.

### Step 3: Block Normalization

Group cells into overlapping blocks (typically $2 \times 2$ cells = $16 \times 16$ pixels) with a stride of 8 pixels (50% overlap). Normalize each block's concatenated histogram to counteract local illumination and contrast variations. Dalal and Triggs tested four normalization schemes; L2-Hys (L2-norm, clip values above 0.2, re-normalize) performed best:

$$v \leftarrow \frac{v}{\sqrt{\|v\|^2 + \epsilon^2}}, \quad \text{then } v_i \leftarrow \min(v_i, 0.2), \quad v \leftarrow \frac{v}{\sqrt{\|v\|^2 + \epsilon^2}}$$

### Step 4: Descriptor Assembly

Concatenate all block histograms across the detection window. For a $64 \times 128$ window with $8 \times 8$ cells, $2 \times 2$ blocks, and 8-pixel stride:

- Cells: $8 \times 16 = 128$
- Blocks: $7 \times 15 = 105$
- Descriptor dimension: $105 \times (2 \times 2 \times 9) = 3780$

### Step 5: Classification

Feed the HOG descriptor into a linear SVM. Dalal and Triggs trained on the INRIA Person dataset (2,416 positives, 12,180 negative windows) and achieved a miss rate of approximately 10% at $10^{-4}$ false positives per window.

```python
import cv2

hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

boxes, weights = hog.detectMultiScale(
    img, winStride=(8, 8), padding=(16, 16), scale=1.05
)
```

## Why It Matters

1. HOG + linear SVM was the dominant pedestrian detection method from 2005 to roughly 2014, deployed in automotive safety systems and surveillance cameras.
2. The Deformable Parts Model (DPM) by Felzenszwalb et al. (2010), which won the PASCAL VOC challenge, is built on HOG features -- establishing HOG as the feature backbone of an era.
3. HOG demonstrated that handcrafted gradient statistics can rival early neural approaches, providing a strong baseline that deep learning methods had to surpass.
4. The HOG descriptor remains useful for lightweight embedded detection where neural network inference is prohibitively expensive.

## Key Technical Details

- Computing HOG over a $64 \times 128$ window takes roughly 0.5 ms on a modern CPU; scanning a full 640x480 image at multiple scales requires 50--200 ms.
- The 3780-D descriptor is dense but linear-SVM-friendly: training converges quickly and inference is a single dot product.
- Unsigned gradients ($0$--$180^\circ$) outperform signed gradients ($0$--$360^\circ$) for pedestrian detection by about 1.5% in miss rate.
- Gamma correction (square root) as a preprocessing step provides a modest improvement (1--2%) by compressing the dynamic range.
- HOG is not scale-invariant by design; multi-scale detection is achieved by rescaling the image in a pyramid (typically scale factor 1.05--1.2 per level).
- On the INRIA Person benchmark, HOG + linear SVM achieves a log-average miss rate of approximately 46% (lower is better); DPM improves this to approximately 20%; modern CNNs reach below 5%.

## Common Misconceptions

- **"HOG is a feature detector."** HOG is a descriptor, not a detector. It describes a fixed-size window. Detection requires scanning this window over an image at multiple scales and positions.
- **"More orientation bins always improve performance."** Dalal and Triggs found that performance plateaus at 9 bins ($20^\circ$ each) and can degrade with finer binning due to quantization noise. The interpolation across bins matters more than bin count.
- **"HOG is only useful for pedestrians."** HOG descriptors are used in face detection (Zhu and Ramanan, 2012), vehicle detection, handwritten digit recognition, and general object classification via DPM.

## Connections to Other Concepts

- `edge-detection.md`: HOG aggregates gradient information that edge detectors threshold. Both rely on the same underlying gradient computation.
- `sift.md`: SIFT's descriptor is also a histogram of gradient orientations, but computed locally around sparse keypoints rather than densely over a grid. HOG can be seen as a dense, fixed-window analogue of SIFT.
- `optical-flow.md`: HOG-OF (HOG of optical flow) extends the descriptor to temporal gradients for action recognition.
- `template-matching.md`: HOG replaces raw pixel templates with gradient-based representations, providing robustness to illumination changes that break pixel-level matching.

## Further Reading

- Dalal, N. and Triggs, B., "Histograms of Oriented Gradients for Human Detection" (2005) -- The foundational HOG paper.
- Felzenszwalb, P. et al., "Object Detection with Discriminatively Trained Part-Based Models" (2010) -- The Deformable Parts Model built on HOG, winner of PASCAL VOC.
- Dollar, P. et al., "Pedestrian Detection: An Evaluation of the State of the Art" (2012) -- Comprehensive benchmark comparing HOG variants and extensions.
