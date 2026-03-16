# Multi-View Geometry

**One-Line Summary**: Multi-view geometry provides the mathematical framework for relating 2D image observations from multiple cameras to 3D scene structure, grounded in epipolar geometry, the fundamental matrix, and triangulation.

**Prerequisites**: Linear algebra (SVD, eigenvalues), projective geometry basics, camera intrinsic and extrinsic parameters, homogeneous coordinates

## What Is Multi-View Geometry?

Imagine two people standing at different positions photographing the same building. Each photograph is a 2D projection of the same 3D structure, but from a different viewpoint. Multi-view geometry is the mathematics that connects these views: given a point in one image, it constrains where that point can appear in the other image (a line, not an arbitrary location). Given correspondences across views, it recovers 3D structure and camera motion. This is the theoretical backbone of structure-from-motion, stereo vision, visual SLAM, and every system that reconstructs 3D from multiple 2D observations.

## How It Works

### Camera Model

A pinhole camera projects a 3D world point $\mathbf{X} = (X, Y, Z, 1)^T$ (homogeneous) to a 2D image point $\mathbf{x} = (u, v, 1)^T$ via:

$$\lambda \mathbf{x} = K[R | \mathbf{t}]\mathbf{X} = P\mathbf{X}$$

where $K$ is the $3 \times 3$ intrinsic matrix (focal lengths $f_x, f_y$, principal point $c_x, c_y$), $R$ is the $3 \times 3$ rotation, $\mathbf{t}$ is the translation, and $P$ is the $3 \times 4$ projection matrix. The scalar $\lambda$ is the projective depth.

### Epipolar Geometry

For two cameras observing the same scene, epipolar geometry constrains the relationship between corresponding points. If $\mathbf{x}$ and $\mathbf{x}'$ are corresponding points in images 1 and 2:

$$\mathbf{x}'^T F \mathbf{x} = 0$$

where $F$ is the $3 \times 3$ **fundamental matrix** (rank 2, 7 degrees of freedom). This equation states that $\mathbf{x}'$ must lie on the **epipolar line** $\ell' = F\mathbf{x}$ in the second image. This reduces correspondence search from 2D to 1D.

The **essential matrix** $E$ is the calibrated version:

$$E = K'^T F K$$

$E$ has 5 degrees of freedom and encodes the relative rotation $R$ and translation direction $\hat{\mathbf{t}}$ (up to scale) between cameras:

$$E = [\mathbf{t}]_\times R$$

where $[\mathbf{t}]_\times$ is the skew-symmetric cross-product matrix of $\mathbf{t}$.

### The 8-Point Algorithm

The fundamental matrix is estimated from point correspondences using the 8-point algorithm (Longuet-Higgins, 1981; Hartley's normalized version, 1997):

1. **Normalize**: Translate and scale points so their centroid is at the origin and average distance from origin is $\sqrt{2}$. This conditioning is essential for numerical stability.
2. **Build system**: Each correspondence $(x_i, y_i) \leftrightarrow (x_i', y_i')$ gives one equation. Stack $n \geq 8$ correspondences into matrix $A$ where each row is $[x_i'x_i, x_i'y_i, x_i', y_i'x_i, y_i'y_i, y_i', x_i, y_i, 1]$.
3. **Solve**: $F$ (vectorized) is the right singular vector of $A$ corresponding to the smallest singular value (SVD of $A$).
4. **Enforce rank-2**: Compute SVD of $F = U\Sigma V^T$, set the smallest singular value to zero: $F = U \text{diag}(\sigma_1, \sigma_2, 0) V^T$.
5. **Denormalize**: $F = T'^T F' T$ where $T, T'$ are the normalization transforms.

In practice, RANSAC wraps the 8-point algorithm: sample 8 correspondences, estimate $F$, count inliers (points satisfying $|\mathbf{x}'^T F \mathbf{x}| < \epsilon$, typically $\epsilon = 1$--$3$ pixels), and repeat for ~1000 iterations.

### Triangulation

Given correspondences and known cameras $(P, P')$, triangulation recovers the 3D point. Each correspondence provides two equations per view. For point $\mathbf{X}$:

$$\mathbf{x} \times P\mathbf{X} = 0, \quad \mathbf{x}' \times P'\mathbf{X} = 0$$

This gives a $4 \times 4$ linear system (DLT triangulation) solved via SVD. In practice, nonlinear refinement (minimizing reprojection error) improves accuracy:

$$\min_{\mathbf{X}} \|d(\mathbf{x}, P\mathbf{X})\|^2 + \|d(\mathbf{x}', P'\mathbf{X})\|^2$$

### Structure from Motion (SfM)

SfM recovers both 3D structure and camera poses from unordered images:

1. Extract and match features (SIFT, SuperPoint + SuperGlue).
2. Estimate pairwise $F$ or $E$ matrices with RANSAC.
3. Initialize with a two-view reconstruction (decompose $E$ to get $R, \mathbf{t}$, triangulate).
4. Incrementally add cameras via PnP (Perspective-n-Point) and triangulate new points.
5. **Bundle adjustment**: Jointly optimize all camera parameters and 3D points to minimize total reprojection error. This is a large sparse nonlinear least-squares problem, solved with Levenberg-Marquardt (implemented in Ceres Solver, g2o).

COLMAP (Schonberger & Frahm, 2016) is the standard SfM pipeline, handling thousands of images with robust feature matching, geometric verification, and bundle adjustment.

### Homography

When all points lie on a plane (or the camera undergoes pure rotation), the mapping between views is a **homography** $H$ (a $3 \times 3$ invertible matrix with 8 DoF):

$$\mathbf{x}' = H\mathbf{x}$$

Estimated from 4+ correspondences via DLT. Used in panorama stitching, planar AR, and as a degeneracy check in SfM.

## Why It Matters

1. **Foundation of 3D vision**: Every system that reconstructs 3D from 2D images relies on multi-view geometry -- SfM, SLAM, stereo matching, NeRF pose estimation.
2. **Autonomous driving**: Camera-based perception systems use multi-view geometry to calibrate surround-view cameras and estimate ego-motion.
3. **Augmented reality**: AR systems track the camera relative to the environment using PnP and bundle adjustment.
4. **Photogrammetry**: Surveying, mapping, and heritage preservation depend on SfM and MVS pipelines built on these principles.
5. **Feature matching validation**: Epipolar geometry provides a geometric consistency check to filter incorrect feature matches.

## Key Technical Details

- The fundamental matrix has 7 DoF (9 entries - 1 scale - 1 rank constraint). The essential matrix has 5 DoF.
- RANSAC for F estimation with 50% outlier rate needs ~590 iterations (8-point) at 99% confidence. The 5-point algorithm (Nister, 2004) for E requires only ~150 iterations.
- Bundle adjustment for 1000 images and 500K 3D points has millions of parameters but exploits the sparse Jacobian structure (each point appears in few images) for efficient solving.
- COLMAP achieves sub-pixel reprojection error (mean ~0.5 px) on well-textured scenes.
- Triangulation accuracy degrades with small baselines (intersection angle). A baseline-to-depth ratio of 0.1--0.5 is recommended.
- The 5-point algorithm (Nister, 2004) solves for E from 5 correspondences and returns up to 10 solutions, making it more efficient with RANSAC than the 8-point method.

## Common Misconceptions

- **"The fundamental matrix gives you 3D structure."** $F$ encodes the geometric relationship between two views but does not directly give 3D points. You need $F$ plus correspondences plus triangulation to recover 3D.
- **"More correspondences always help."** Outlier correspondences degrade the estimate catastrophically. Robust estimation (RANSAC) is essential, and quality matters far more than quantity.
- **"Epipolar geometry fails for pure rotation."** Correct -- with pure rotation and no translation, all epipoles are at infinity and $F$ is undefined. This is a degenerate configuration handled by detecting the homography model instead.
- **"Bundle adjustment is optional."** Without bundle adjustment, accumulated drift makes large reconstructions unusable. BA is the single most important step for accurate SfM.

## Connections to Other Concepts

- `depth-estimation.md`: Stereo depth estimation is a direct application of epipolar geometry with rectified images.
- `slam.md`: Visual SLAM systems use multi-view geometry for tracking (PnP), mapping (triangulation), and optimization (bundle adjustment).
- `neural-radiance-fields.md`: NeRF and 3DGS require accurate camera poses, typically obtained via SfM (COLMAP).
- `3d-reconstruction.md`: Multi-view stereo extends pairwise geometry to dense reconstruction from many views.
- `feature-extraction-and-transformation.md`: SIFT, SuperPoint, and other feature detectors provide the correspondences that multi-view geometry algorithms consume.

## Further Reading

- Hartley & Zisserman, "Multiple View Geometry in Computer Vision" (2003) -- The definitive textbook on the subject.
- Longuet-Higgins, "A Computer Algorithm for Reconstructing a Scene from Two Projections" (1981) -- Origin of the 8-point algorithm.
- Nister, "An Efficient Solution to the Five-Point Relative Pose Problem" (2004) -- The 5-point algorithm for calibrated cameras.
- Schonberger & Frahm, "Structure-from-Motion Revisited" (CVPR 2016) -- COLMAP: the standard SfM pipeline.
- Sarlin et al., "SuperGlue: Learning Feature Matching with Graph Neural Networks" (CVPR 2020) -- Learned feature matching that dramatically improves SfM robustness.
