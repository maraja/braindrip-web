# Optical Flow

**One-Line Summary**: Optical flow estimates the per-pixel apparent motion between consecutive video frames, using methods like Lucas-Kanade for sparse tracking and Horn-Schunck for dense fields.

**Prerequisites**: Image gradients, convolution and filtering, corner detection, linear algebra (least squares)

## What Is Optical Flow?

Watch a car drive past a window. Your eyes effortlessly track its motion -- every point on the car has an apparent velocity across your visual field. Optical flow is the computational equivalent: a 2D vector field $(u, v)$ assigning a horizontal and vertical displacement to every pixel between two frames, capturing how the scene's projection moves on the image plane.

Formally, optical flow estimates the displacement field that maps pixel $(x, y)$ at time $t$ to $(x + u, y + v)$ at time $t + \Delta t$, under the assumption that pixel intensities are approximately conserved over short intervals.

## How It Works

### The Brightness Constancy Assumption

The core constraint assumes a pixel's intensity does not change as it moves:

$$I(x, y, t) = I(x + u, y + v, t + \Delta t)$$

Taking a first-order Taylor expansion and dividing by $\Delta t$:

$$I_x u + I_y v + I_t = 0$$

where $I_x$, $I_y$ are spatial gradients and $I_t$ is the temporal derivative. This is one equation in two unknowns (the **aperture problem**), so additional constraints are needed.

### Lucas-Kanade: Sparse, Local Flow

Lucas and Kanade (1981) assume flow is constant within a small window $W$ (typically $5 \times 5$ to $15 \times 15$). For each window, the overdetermined system:

$$\begin{bmatrix} I_{x_1} & I_{y_1} \\ \vdots & \vdots \\ I_{x_n} & I_{y_n} \end{bmatrix} \begin{bmatrix} u \\ v \end{bmatrix} = -\begin{bmatrix} I_{t_1} \\ \vdots \\ I_{t_n} \end{bmatrix}$$

is solved via least squares:

$$\begin{bmatrix} u \\ v \end{bmatrix} = (A^T W A)^{-1} A^T W \mathbf{b}$$

where $W$ is a diagonal Gaussian weighting matrix. This system is well-conditioned only where both eigenvalues of $A^T W A$ are large -- precisely at corners (Shi-Tomasi features). Lucas-Kanade is therefore typically applied to tracked feature points, not the entire image.

**Pyramidal extension.** Large displacements violate the linearization. The iterative pyramidal Lucas-Kanade builds a Gaussian pyramid, estimates coarse flow at the top level, warps, and refines downward. OpenCV's `calcOpticalFlowPyrLK` implements this with default pyramid depth of 3 and iteration count of 30.

### Horn-Schunck: Dense, Global Flow

Horn and Schunck (1981) regularize the aperture problem by adding a global smoothness term:

$$E = \iint \left[(I_x u + I_y v + I_t)^2 + \alpha^2(\|\nabla u\|^2 + \|\nabla v\|^2)\right] dx\, dy$$

The smoothness weight $\alpha$ controls the trade-off: large $\alpha$ produces smooth flow fields; small $\alpha$ preserves motion discontinuities but may amplify noise. The Euler-Lagrange equations yield an iterative scheme (Gauss-Seidel or Jacobi) that converges in 50--200 iterations.

### Modern Dense Methods

- **Farneback (2003)**: Approximates each neighborhood with a polynomial and estimates displacement analytically. OpenCV's `calcOpticalFlowFarneback` uses this method, running at approximately 10--20 fps on 640x480.
- **TV-L1 (Zach et al., 2007)**: Replaces the quadratic smoothness with total variation, better preserving edges. Widely used as a preprocessing step for action recognition (two-stream networks).
- **RAFT (Teed and Deng, 2020)**: A deep learning method using recurrent all-pairs field transforms, achieving end-point error (EPE) of 1.43 on KITTI 2015 and 0.76 on Sintel Clean -- significantly outperforming classical methods.

### Code Example

```python
import cv2
import numpy as np

prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
next_gray = cv2.cvtColor(next_frame, cv2.COLOR_BGR2GRAY)

# Sparse flow (Lucas-Kanade)
pts = cv2.goodFeaturesToTrack(prev_gray, maxCorners=200, qualityLevel=0.01, minDistance=10)
new_pts, status, err = cv2.calcOpticalFlowPyrLK(prev_gray, next_gray, pts, None)

# Dense flow (Farneback)
flow = cv2.calcOpticalFlowFarneback(
    prev_gray, next_gray, None,
    pyr_scale=0.5, levels=3, winsize=15,
    iterations=3, poly_n=5, poly_sigma=1.2, flags=0
)
```

## Why It Matters

1. Optical flow is the primary motion cue for video understanding: action recognition, video segmentation, and autonomous driving all consume flow fields.
2. Visual odometry and SLAM systems use sparse flow (KLT tracking) to estimate camera ego-motion at 30+ fps.
3. Video codecs (H.264, H.265) use block-based motion estimation -- a simplified form of optical flow -- for inter-frame compression.
4. Two-stream convolutional networks (Simonyan and Zisserman, 2014) showed that optical flow as an explicit input stream improves action recognition accuracy by 10--15% over RGB alone.

## Key Technical Details

- Lucas-Kanade on 200 tracked points runs in under 2 ms per frame on a modern CPU; it scales linearly with point count.
- Dense Farneback flow on 640x480 takes approximately 30--80 ms per frame on CPU, depending on pyramid levels and iteration count.
- End-point error (EPE) is the standard metric: average Euclidean distance between predicted and ground-truth flow vectors. On Sintel Clean, Horn-Schunck achieves EPE around 5.0; RAFT achieves 0.76.
- The brightness constancy assumption fails under shadows, reflections, and transparency. Gradient constancy or census transforms provide partial robustness.
- Occlusion -- where a surface disappears between frames -- fundamentally violates optical flow assumptions and requires explicit handling (forward-backward consistency check, or occlusion prediction in learned methods).

## Common Misconceptions

- **"Optical flow equals scene motion."** Optical flow captures apparent 2D image motion, which conflates camera motion, object motion, and depth effects. A static object closer to the camera has larger flow than a moving distant object.
- **"Lucas-Kanade cannot handle large displacements."** The pyramidal extension handles displacements up to roughly half the image width, depending on the number of pyramid levels. The base algorithm is limited to a few pixels.
- **"Dense optical flow is always better than sparse."** Dense flow provides more information but at much higher cost. For feature tracking and ego-motion estimation, sparse flow on well-chosen keypoints is often more robust and sufficient.

## Connections to Other Concepts

- `corner-detection.md`: Lucas-Kanade requires corners (high eigenvalue points) for well-conditioned estimation; Shi-Tomasi features are the standard initialization.
- `hog.md`: Histograms of optical flow (HOF) extend HOG to the temporal domain for action recognition.
- `image-stitching-and-homography.md`: Flow estimation and homography computation both solve for geometric relationships between frames; homography assumes a single planar transformation while flow allows per-pixel variation.
- `camera-calibration-and-geometry.md`: Ego-motion decomposition of optical flow into rotation and translation requires known camera intrinsics.

## Further Reading

- Lucas, B. and Kanade, T., "An Iterative Image Registration Technique with an Application to Stereo Vision" (1981) -- The original sparse optical flow method.
- Horn, B. and Schunck, B., "Determining Optical Flow" (1981) -- The foundational variational dense flow formulation.
- Teed, Z. and Deng, J., "RAFT: Recurrent All-Pairs Field Transforms for Optical Flow" (2020) -- State-of-the-art learned flow with iterative refinement.
