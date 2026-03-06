# Image Stitching and Homography

**One-Line Summary**: Image stitching combines overlapping photographs into seamless panoramas by matching features, estimating projective homographies with RANSAC, and blending warped images together.

**Prerequisites**: SIFT or ORB (feature detection and matching), linear algebra (matrix transformations), camera calibration basics, least squares

## What Is Image Stitching?

Imagine standing on a mountaintop and taking a series of photographs while slowly rotating. Each photo captures a slice of the view with some overlap with its neighbors. Image stitching is the process of aligning and merging these slices into a single wide-angle panorama. The mathematical tool that makes this possible is the homography -- a $3 \times 3$ projective transformation that maps points from one image plane to another when the scene is planar or the camera rotates about its optical center.

## How It Works

### Step 1: Feature Detection and Matching

Extract keypoints and descriptors from both images using SIFT, ORB, or similar. Match descriptors using brute-force or FLANN-based nearest-neighbor search, then apply Lowe's ratio test (threshold 0.7--0.8) to filter ambiguous matches.

A typical overlap region between two 1920x1080 images yields 200--2,000 initial matches, reduced to 50--500 after the ratio test.

### Step 2: Homography Estimation with RANSAC

A homography $H$ maps a point $(x, y, 1)^T$ in image 1 to $(x', y', 1)^T$ in image 2 via:

$$\begin{bmatrix} x' \\ y' \\ 1 \end{bmatrix} \sim H \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}, \quad H = \begin{bmatrix} h_{11} & h_{12} & h_{13} \\ h_{21} & h_{22} & h_{23} \\ h_{31} & h_{32} & h_{33} \end{bmatrix}$$

where $\sim$ denotes equality up to scale ($H$ has 8 degrees of freedom). Four point correspondences suffice to solve for $H$ using the Direct Linear Transform (DLT):

Each correspondence contributes two equations. Stacking four correspondences yields an $8 \times 9$ system solved via SVD (the solution is the right singular vector corresponding to the smallest singular value).

**RANSAC (Random Sample Consensus):**

1. Randomly select 4 matches.
2. Compute $H$ via DLT.
3. Count inliers: matches where the reprojection error $\|p' - Hp\| < \epsilon$ (typically $\epsilon = 3$--$5$ pixels).
4. Repeat for $N$ iterations. Keep the $H$ with the most inliers.
5. Re-estimate $H$ using all inliers via least-squares DLT.

The number of RANSAC iterations needed for $p = 0.99$ confidence with inlier ratio $w$ and sample size $s = 4$:

$$N = \frac{\log(1 - p)}{\log(1 - w^s)}$$

For $w = 0.5$: $N \approx 72$. For $w = 0.3$: $N \approx 588$.

### Step 3: Image Warping

Apply the estimated homography to warp one image into the coordinate frame of the other using inverse warping with bilinear interpolation:

$$\begin{bmatrix} x \\ y \\ w \end{bmatrix} = H^{-1} \begin{bmatrix} x' \\ y' \\ 1 \end{bmatrix}, \quad \text{source pixel} = \left(\frac{x}{w}, \frac{y}{w}\right)$$

### Step 4: Blending

Simple overlay produces visible seams due to exposure and vignetting differences. Common blending strategies:

- **Feathering (alpha blending)**: Linear weight ramp based on distance from image edges.
- **Multi-band blending** (Burt and Adelson, 1983): Blend low frequencies over wide transitions and high frequencies over narrow transitions using Laplacian pyramids. This is the standard in production stitchers.
- **Gain compensation**: Estimate per-image gain factors that minimize intensity differences in overlap regions.

### Code Example

```python
import cv2
import numpy as np

sift = cv2.SIFT_create()
kp1, des1 = sift.detectAndCompute(img1, None)
kp2, des2 = sift.detectAndCompute(img2, None)

bf = cv2.BFMatcher()
matches = bf.knnMatch(des1, des2, k=2)
good = [m for m, n in matches if m.distance < 0.75 * n.distance]

src_pts = np.float32([kp1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
dst_pts = np.float32([kp2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)

H, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)

h, w = img2.shape[:2]
result = cv2.warpPerspective(img1, H, (w * 2, h))
result[0:h, 0:w] = img2
```

### OpenCV's High-Level Stitcher

```python
stitcher = cv2.Stitcher_create(mode=cv2.Stitcher_PANORAMA)
status, panorama = stitcher.stitch([img1, img2, img3])
```

This wraps feature detection, matching, homography estimation, bundle adjustment, multi-band blending, and exposure compensation into a single call.

## Why It Matters

1. Panoramic stitching is built into every modern smartphone camera and powers products like Google Street View (processing billions of images).
2. Satellite and aerial image mosaicking uses the same homography-based alignment to produce large-area maps from overlapping tiles.
3. The RANSAC algorithm, popularized through homography estimation, became the dominant robust estimation method across all of computer vision and robotics.
4. Medical imaging uses stitching to combine microscope or endoscope fields of view into high-resolution composite images.

## Key Technical Details

- Homography estimation is valid when the scene is approximately planar or when the camera undergoes pure rotation (no translation). For general 3D scenes with camera translation, parallax causes homography misalignment.
- RANSAC with 500--1,000 iterations and a 3-pixel threshold is standard. MAGSAC++ (Barath et al., 2020) improves robustness by eliminating the manual threshold parameter.
- Bundle adjustment refines all homographies jointly by minimizing reprojection error across all images simultaneously; this is critical for multi-image panoramas to avoid drift.
- Multi-band blending with 5--6 pyramid levels produces visually seamless results even with significant exposure differences between images.
- A full panorama pipeline (detect, match, RANSAC, warp, blend) for two 12-megapixel images takes approximately 2--5 seconds on a modern CPU, dominated by feature extraction and warping.
- OpenCV's `Stitcher` class supports both panorama mode (assumes rotation-only) and scans mode (for flat document stitching with affine transforms).

## Common Misconceptions

- **"A homography can align any two images of the same scene."** Homography is exact only for planar scenes or pure camera rotation. With translating cameras and 3D scenes, you need fundamental/essential matrices or per-pixel depth-based warping.
- **"More feature matches always produce better stitching."** After RANSAC filters outliers, 20--50 well-distributed inlier matches are sufficient for an accurate homography. Thousands of matches in a small area provide diminishing returns and can slow computation.
- **"RANSAC always finds the correct model."** RANSAC is probabilistic. With low inlier ratios (< 30%), the required iterations grow rapidly, and the algorithm may fail within a fixed iteration budget. PROSAC and MAGSAC offer improvements.

## Connections to Other Concepts

- **SIFT**: SIFT features are the traditional front-end for stitching; their scale and rotation invariance handles the geometric differences between overlapping views.
- **ORB and Binary Descriptors**: ORB is the fast alternative for real-time stitching on mobile devices and drones.
- **Camera Calibration and Geometry**: Lens distortion correction (using calibration parameters) before stitching prevents warping artifacts, especially for wide-angle lenses.
- **Optical Flow**: Dense alignment methods can refine stitching at the pixel level, handling local deformations that a single homography cannot capture.

## Further Reading

- Szeliski, R., "Image Alignment and Stitching: A Tutorial" (2006) -- Comprehensive survey of stitching theory and practice.
- Fischler, M. and Bolles, R., "Random Sample Consensus: A Paradigm for Model Fitting" (1981) -- The original RANSAC paper.
- Brown, M. and Lowe, D., "Automatic Panoramic Image Stitching Using Invariant Features" (2007) -- End-to-end automatic stitching with bundle adjustment.
