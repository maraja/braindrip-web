# Camera Calibration and Geometry

**One-Line Summary**: Camera calibration determines the intrinsic and extrinsic parameters that define how a camera maps 3D world points to 2D image pixels, based on the pinhole model and its extensions.

**Prerequisites**: Linear algebra (matrix multiplication, SVD), coordinate systems, homography, corner detection

## What Is Camera Calibration?

A camera is a measurement device, but out of the box you do not know its ruler. You see that a building appears 200 pixels tall in the image, but how tall is it in meters? Camera calibration answers this by recovering the mathematical relationship between 3D world coordinates and 2D pixel coordinates. It is the essential first step for any application that needs metric measurements from images: 3D reconstruction, augmented reality, autonomous driving, and robotic manipulation.

The calibration process determines two sets of parameters: intrinsic parameters (properties of the camera itself, like focal length and lens distortion) and extrinsic parameters (the camera's position and orientation in the world).

## How It Works

### The Pinhole Camera Model

The idealized pinhole model projects a 3D point $\mathbf{P}_w = (X, Y, Z)^T$ in world coordinates to a 2D pixel $(u, v)$ through:

$$s \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = K \begin{bmatrix} R & \mathbf{t} \end{bmatrix} \begin{bmatrix} X \\ Y \\ Z \\ 1 \end{bmatrix}$$

where $s$ is a scale factor and:

**Intrinsic matrix $K$:**

$$K = \begin{bmatrix} f_x & \gamma & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}$$

- $f_x, f_y$: focal lengths in pixel units (typically 500--2000 for standard lenses)
- $(c_x, c_y)$: principal point, ideally the image center
- $\gamma$: skew coefficient, nearly zero for modern sensors

**Extrinsic parameters $[R \mid \mathbf{t}]$:**

- $R$: $3 \times 3$ rotation matrix (camera orientation)
- $\mathbf{t}$: $3 \times 1$ translation vector (camera position)

Together, $[R \mid \mathbf{t}]$ transforms world coordinates into the camera coordinate frame.

### Lens Distortion

Real lenses introduce distortion, primarily radial:

$$x_{\text{distorted}} = x(1 + k_1 r^2 + k_2 r^4 + k_3 r^6)$$
$$y_{\text{distorted}} = y(1 + k_1 r^2 + k_2 r^4 + k_3 r^6)$$

where $r^2 = x^2 + y^2$ in normalized camera coordinates. Tangential distortion adds two more parameters $(p_1, p_2)$. The standard OpenCV model uses 5 distortion coefficients: $(k_1, k_2, p_1, p_2, k_3)$.

Wide-angle and fisheye lenses require higher-order models or the equidistant fisheye model ($r = f \cdot \theta$).

### Zhang's Calibration Method

Zhang (2000) proposed the widely-used calibration method based on a planar pattern (typically a checkerboard):

1. **Capture** 10--25 images of a planar calibration target at varied orientations.
2. **Detect** the inner corners of the checkerboard with sub-pixel accuracy using `cv2.findChessboardCorners` followed by `cv2.cornerSubPix`.
3. **Estimate homographies** between the pattern plane and each image using DLT.
4. **Extract initial intrinsics** from the homographies by solving a system of linear constraints (exploiting the orthogonality of rotation matrix columns).
5. **Refine** all parameters jointly (intrinsics, extrinsics per image, distortion) via nonlinear least-squares minimization (Levenberg-Marquardt) of the total reprojection error:

$$\min_{K, k_i, R_j, \mathbf{t}_j} \sum_{j=1}^{M} \sum_{i=1}^{N} \left\| \mathbf{p}_{ij} - \hat{\mathbf{p}}(K, k, R_j, \mathbf{t}_j, \mathbf{P}_i) \right\|^2$$

where $\mathbf{p}_{ij}$ is the detected corner and $\hat{\mathbf{p}}$ is the projected model point.

### Code Example

```python
import cv2
import numpy as np

# Prepare object points for a 9x6 checkerboard (Z=0 on the pattern plane)
objp = np.zeros((6 * 9, 3), np.float32)
objp[:, :2] = np.mgrid[0:9, 0:6].T.reshape(-1, 2) * square_size_mm

obj_points = []  # 3D points in world coordinates
img_points = []  # 2D points in image coordinates

for img_path in calibration_images:
    gray = cv2.cvtColor(cv2.imread(img_path), cv2.COLOR_BGR2GRAY)
    ret, corners = cv2.findChessboardCorners(gray, (9, 6), None)
    if ret:
        corners_refined = cv2.cornerSubPix(
            gray, corners, (11, 11), (-1, -1),
            (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)
        )
        obj_points.append(objp)
        img_points.append(corners_refined)

ret, K, dist, rvecs, tvecs = cv2.calibrateCamera(
    obj_points, img_points, gray.shape[::-1], None, None
)

# Undistort an image
undistorted = cv2.undistort(img, K, dist)

# Reprojection error
total_error = 0
for i in range(len(obj_points)):
    proj, _ = cv2.projectPoints(obj_points[i], rvecs[i], tvecs[i], K, dist)
    error = cv2.norm(img_points[i], proj, cv2.NORM_L2) / len(proj)
    total_error += error
mean_error = total_error / len(obj_points)
print(f"Mean reprojection error: {mean_error:.4f} pixels")
```

### Stereo Calibration

For stereo cameras, calibrate each camera individually, then estimate the relative rotation $R$ and translation $\mathbf{t}$ between them via `cv2.stereoCalibrate`. This enables depth estimation through triangulation:

$$Z = \frac{f \cdot B}{d}$$

where $B$ is the baseline (distance between cameras) and $d$ is the disparity (pixel offset between corresponding points).

## Why It Matters

1. Every 3D vision application -- autonomous driving, AR/VR, robotic grasping, drone mapping -- requires calibrated cameras to make metric measurements.
2. Lens distortion correction is necessary for accurate feature matching, stitching, and any geometric computation; uncorrected distortion introduces systematic errors that compound across the pipeline.
3. Stereo calibration enables passive depth sensing, which is cheaper and more robust outdoors than active sensors like structured light.
4. The projection model underpins all of multi-view geometry: epipolar constraints, triangulation, structure from motion, and visual SLAM.

## Key Technical Details

- A well-calibrated camera achieves mean reprojection error below 0.5 pixels. Errors above 1.0 pixel indicate poor calibration (insufficient images, bad corner detection, or overfitting distortion coefficients).
- Zhang's method requires a minimum of 3 checkerboard images for 5 intrinsic parameters, but 15--25 images at varied orientations produce more stable results.
- The checkerboard should cover at least 50% of the image area across all captures, with pattern rotations spanning at least 45 degrees in each axis.
- For a standard 1080p webcam, typical intrinsic values are $f_x \approx f_y \approx 900$--$1200$ pixels, $(c_x, c_y) \approx (960, 540)$, $k_1 \approx -0.2$ to $-0.4$.
- Fisheye lenses (FOV > 120 degrees) require the specialized `cv2.fisheye` module, which uses an equidistant projection model with 4 distortion parameters.
- Camera calibration should be repeated if the lens is changed, the focus ring is adjusted, or the sensor-to-lens assembly is physically disturbed. Zoom lenses require recalibration at each zoom setting.

## Common Misconceptions

- **"The principal point is always at the image center."** Manufacturing tolerances, sensor mounting, and lens misalignment mean the principal point can be offset by 10--50 pixels from the geometric center. Always calibrate rather than assume.
- **"Calibration with more distortion coefficients is always better."** Overfitting distortion parameters (e.g., using 8+ coefficients with few images) can produce worse results than the standard 5-parameter model. The model order should match the lens characteristics and the amount of calibration data.
- **"Intrinsic calibration and extrinsic calibration are separate problems."** Zhang's method solves them jointly. The intrinsics and per-image extrinsics are coupled through the projection equation and must be optimized together for best accuracy.

## Connections to Other Concepts

- **Corner Detection**: Sub-pixel corner detection on calibration patterns is the critical input; errors here propagate directly into calibration accuracy.
- **Image Stitching and Homography**: The homography between a calibration plane and the image plane provides the linear constraints that initialize Zhang's method.
- **SIFT**: Feature correspondences between views, combined with calibrated cameras, enable structure-from-motion 3D reconstruction.
- **Optical Flow**: Decomposing optical flow into rotation and translation components requires the intrinsic matrix $K$ to convert pixel displacements to angular measurements.

## Further Reading

- Zhang, Z., "A Flexible New Technique for Camera Calibration" (2000) -- The standard planar calibration method used in OpenCV.
- Hartley, R. and Zisserman, A., "Multiple View Geometry in Computer Vision" (2004) -- The definitive textbook on projective geometry, calibration, and 3D reconstruction.
- Bradski, G. and Kaehler, A., "Learning OpenCV 3" (2016) -- Practical calibration tutorials with code examples.
