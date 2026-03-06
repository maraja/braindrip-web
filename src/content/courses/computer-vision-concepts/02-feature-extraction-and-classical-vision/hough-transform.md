# Hough Transform

**One-Line Summary**: The Hough transform detects parametric shapes (lines, circles, ellipses) by having each edge pixel vote in a parameter space, where peaks correspond to the shapes present in the image.

**Prerequisites**: Edge detection, coordinate geometry (polar and Cartesian), image gradients

## What Is the Hough Transform?

Imagine you are in a room full of people and you want to find who is singing the same note. You ask everyone to call out their note, and you listen for the pitch that gets the most voices. The Hough transform works the same way: each edge pixel "calls out" all the shapes it could belong to (voting), and the shapes that receive the most votes are the ones actually present in the image.

Introduced by Paul Hough in 1962 (patented for particle track detection) and generalized by Duda and Hart (1972), the Hough transform converts the difficult problem of global shape detection into a simpler peak-finding problem in a parameter accumulator array.

## How It Works

### Line Detection in Normal Parameterization

A line in Cartesian coordinates $y = mx + b$ has an unbounded slope parameter. The normal (Hesse) parameterization avoids this:

$$x \cos\theta + y \sin\theta = \rho$$

where $\rho$ is the perpendicular distance from the origin to the line and $\theta$ is the angle of the perpendicular. Both parameters are bounded: $\theta \in [0, \pi)$ and $\rho \in [-d, d]$ where $d$ is the image diagonal.

**Algorithm:**

1. Run an edge detector (Canny is standard) to produce a binary edge map.
2. Create an accumulator array $A[\rho, \theta]$ initialized to zero. Typical resolution: $\Delta\rho = 1$ pixel, $\Delta\theta = 1^\circ$ (giving a 180-column array).
3. For each edge pixel $(x_i, y_i)$, compute $\rho = x_i \cos\theta + y_i \sin\theta$ for every $\theta$ and increment $A[\rho, \theta]$.
4. Find peaks in the accumulator above a threshold. Each peak $(\rho^*, \theta^*)$ corresponds to a detected line.

Each edge pixel traces a sinusoidal curve in $(\rho, \theta)$ space. Where curves from collinear pixels intersect, votes accumulate.

### Probabilistic Hough Transform

The standard Hough transform votes with every edge pixel for every $\theta$, which is $O(n \cdot N_\theta)$ where $n$ is the number of edge pixels. The probabilistic variant (Matas et al., 2000) randomly samples a subset of edge pixels and extracts line segments (with endpoints) rather than infinite lines, reducing computation by 5--10x.

```python
import cv2
import numpy as np

edges = cv2.Canny(gray, 50, 150)

# Standard Hough
lines = cv2.HoughLines(edges, rho=1, theta=np.pi/180, threshold=150)

# Probabilistic Hough (returns line segments with endpoints)
segments = cv2.HoughLinesP(
    edges, rho=1, theta=np.pi/180,
    threshold=50, minLineLength=50, maxLineGap=10
)
```

### Circle Detection (Hough Gradient Method)

For circles parameterized by $(a, b, r)$ (center and radius), a full 3D accumulator is expensive. OpenCV's `HoughCircles` uses the Hough gradient method:

1. For each edge pixel, vote along the gradient direction in a 2D $(a, b)$ accumulator for potential circle centers.
2. For each candidate center, determine the radius from the edge pixel distances.

This reduces the parameter space from 3D to 2D + 1D search.

$$\text{Circle: } (x - a)^2 + (y - b)^2 = r^2$$

```python
circles = cv2.HoughCircles(
    gray, cv2.HOUGH_GRADIENT, dp=1, minDist=30,
    param1=100, param2=30, minRadius=10, maxRadius=80
)
```

### Generalized Hough Transform

Ballard (1981) extended the Hough transform to arbitrary shapes using an R-table (lookup table) that encodes the spatial relationship between boundary points and a reference point. This allows detection of any shape whose silhouette is known.

## Why It Matters

1. Hough line detection is the standard method for lane detection in autonomous driving, detecting road markings at 30+ fps.
2. Circle detection via Hough is used in industrial inspection for finding bolts, washers, and circular defects on assembly lines.
3. The voting paradigm is inherently robust to partial occlusion -- a shape missing 30--40% of its boundary can still produce a strong accumulator peak.
4. The Hough transform inspired the voting principle used in modern methods like the Hough Forest (Gall and Lempitsky, 2009) for object detection and pose estimation.

## Key Technical Details

- Standard Hough for lines on a 640x480 Canny edge map (typically 5,000--20,000 edge pixels) runs in 5--20 ms with $1^\circ$ angular resolution.
- Accumulator size for lines: $\lceil 2d / \Delta\rho \rceil \times \lceil 180 / \Delta\theta \rceil$. For 640x480 with $\Delta\rho=1$, $\Delta\theta=1^\circ$: approximately $1131 \times 180 \approx 204\text{K}$ cells.
- The probabilistic Hough transform uses only 2--10% of edge pixels and directly outputs line segment endpoints, making it preferable for most practical applications.
- For circle detection, `dp=1` means the accumulator has the same resolution as the input; `dp=2` halves it, reducing memory and computation by 4x at the cost of localization precision.
- Peak detection in the accumulator typically uses a local maximum search with non-maximum suppression over a window of 5--15 cells.
- The Hough transform degrades with heavy noise because spurious edge pixels add random votes, raising the accumulator floor and obscuring true peaks.

## Common Misconceptions

- **"The Hough transform finds shapes directly in the image."** It operates on an edge map, not the raw image. The quality of edge detection directly determines the quality of Hough results.
- **"The Hough transform only works for lines and circles."** The generalized Hough transform handles arbitrary shapes. The limitation is that higher-dimensional parameter spaces (e.g., ellipses with 5 parameters) become computationally expensive and require dimensionality reduction tricks.
- **"More votes always mean a more confident detection."** The vote count depends on the line's length (or circle's circumference). A long weak edge can out-vote a short strong edge. Normalizing by expected boundary length improves reliability.

## Connections to Other Concepts

- **Edge Detection**: Hough transform takes edge maps as input; Canny is the standard preprocessing step. Poor edges lead to poor Hough detections.
- **SIFT**: Both handle geometric inference from local image evidence, but SIFT works with keypoints while Hough works with edge pixels and parametric models.
- **Image Stitching and Homography**: Line correspondences detected via Hough can constrain homography estimation, especially in urban scenes with strong rectilinear structure.
- **Camera Calibration and Geometry**: Vanishing point estimation uses Hough-detected lines to infer 3D scene structure and camera orientation.

## Further Reading

- Duda, R. and Hart, P., "Use of the Hough Transformation to Detect Lines and Curves in Pictures" (1972) -- The standard reference for the voting-based formulation.
- Ballard, D., "Generalizing the Hough Transform to Detect Arbitrary Shapes" (1981) -- Extension to non-parametric shapes via R-tables.
- Matas, J. et al., "Robust Detection of Lines Using the Progressive Probabilistic Hough Transform" (2000) -- The randomized variant that outputs line segments.
