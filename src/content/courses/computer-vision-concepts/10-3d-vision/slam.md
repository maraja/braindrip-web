# SLAM (Simultaneous Localization and Mapping)

**One-Line Summary**: SLAM simultaneously estimates a sensor's pose (localization) and builds a map of the environment (mapping), solving the chicken-and-egg problem where you need a map to localize and a location to map.

**Prerequisites**: Multi-view geometry, feature extraction and matching, optimization (nonlinear least squares), camera models, point cloud processing basics

## What Is SLAM?

Imagine being blindfolded and dropped into an unfamiliar building with only a camera. To navigate, you need to know two things simultaneously: where you are (localization) and what the building looks like (mapping). But you cannot build a map without knowing where you are, and you cannot localize without a map. SLAM solves both problems jointly, incrementally building a consistent map while tracking the sensor's trajectory through it. Originally developed for robotics in the 1980s, SLAM has become foundational for autonomous vehicles, AR headsets, drones, and any system that must understand its spatial relationship to the world.

## How It Works

### The SLAM Problem Formulation

At time $t$, the system state includes the sensor pose $\mathbf{x}_t = (R_t, \mathbf{t}_t)$ and a map $\mathcal{M}$ (a set of 3D landmarks $\{\mathbf{m}_j\}$). Given sensor observations $\mathbf{z}_{1:t}$ and control inputs $\mathbf{u}_{1:t}$, SLAM estimates the joint posterior:

$$p(\mathbf{x}_{1:t}, \mathcal{M} | \mathbf{z}_{1:t}, \mathbf{u}_{1:t})$$

This can be solved via filtering (EKF-SLAM, particle filters) or optimization (graph-based SLAM, bundle adjustment). Modern systems overwhelmingly use the optimization approach.

### Visual SLAM Pipeline

A typical visual SLAM system (monocular, stereo, or RGB-D) has four main components:

**1. Frontend -- Tracking**: Estimates the camera pose for each new frame.
- Extract features (ORB, SIFT, or learned features like SuperPoint).
- Match features to the existing map's 3D landmarks.
- Solve for pose via PnP + RANSAC (P3P gives the minimal solution from 3 correspondences).
- Track frame-to-frame using optical flow or descriptor matching for robustness when map matches are insufficient.

**2. Frontend -- Local Mapping**: Expands the map with new observations.
- Triangulate new 3D points from feature matches across keyframes.
- Local bundle adjustment refines recent keyframe poses and landmark positions.
- Keyframe selection: insert a new keyframe when tracking quality drops (fewer than 90% matched features) or sufficient baseline exists.

**3. Backend -- Loop Closure**: Detects when the sensor revisits a previously mapped area.
- Use a visual place recognition system (DBoW2 for ORB-SLAM, NetVLAD for learned approaches) to retrieve candidate loop frames.
- Verify geometrically: estimate the relative pose between current and candidate frames, check for consistency.
- When a loop is confirmed, add a constraint to the pose graph and optimize.

**4. Backend -- Global Optimization**: Corrects accumulated drift.
- **Pose graph optimization**: Represent keyframe poses as nodes and relative pose measurements as edges. Minimize the total edge error:

$$\min_{\mathbf{x}_{1:n}} \sum_{(i,j) \in \mathcal{E}} \|\mathbf{z}_{ij} - h(\mathbf{x}_i, \mathbf{x}_j)\|_{\Sigma_{ij}}^2$$

- Solved efficiently using sparse solvers (g2o, GTSAM, Ceres). A pose graph with 10,000 nodes optimizes in <1 second.
- Full bundle adjustment (optimizing both poses and landmarks) provides higher accuracy but is more expensive.

### ORB-SLAM (Mur-Artal et al., 2015, 2017)

ORB-SLAM is the most widely cited visual SLAM system:

- Uses ORB features (fast binary descriptor, rotation invariant).
- Three parallel threads: tracking, local mapping, loop closing.
- DBoW2 bag-of-words for loop detection with geometric verification.
- Achieves ~1% translational drift on TUM RGB-D benchmark before loop closure.
- ORB-SLAM3 (2021) unifies monocular, stereo, RGB-D, and visual-inertial modes with multi-map support.

### Visual-Inertial SLAM

Fusing camera data with an IMU (Inertial Measurement Unit) provides:
- Metric scale recovery (monocular SLAM is scale-ambiguous; IMU gives absolute scale).
- Robust tracking during fast motion and visual degradation.
- Higher-frequency pose estimates (IMU at 200--400 Hz vs. camera at 30 Hz).

**VINS-Mono** (Qin et al., 2018): Tightly-coupled visual-inertial optimization using sliding window bundle adjustment with IMU preintegration. Achieves < 0.5% translational error on EuRoC benchmark.

IMU preintegration (Forster et al., 2017) compactly represents the effect of many IMU measurements between keyframes as a single relative motion constraint, avoiding reintegration when linearization points change during optimization.

### LiDAR SLAM

LiDAR-based SLAM (LOAM, LeGO-LOAM, LIO-SAM) uses point cloud registration instead of feature matching:

- Extract edge and planar features from LiDAR scans.
- Register consecutive scans using point-to-edge and point-to-plane ICP variants.
- LIO-SAM (Shan et al., 2020) tightly couples LiDAR, IMU, and GPS in a factor graph framework.

### Dense and Neural SLAM

Recent systems build dense maps rather than sparse landmark maps:

- **DTAM** (2011): Dense tracking and mapping using photometric alignment on every pixel.
- **KinectFusion** (2011): Real-time dense reconstruction using TSDF fusion from depth cameras.
- **DROID-SLAM** (Teed & Deng, 2021): End-to-end differentiable SLAM using dense optical flow with learned feature matching and differentiable bundle adjustment. Achieves state-of-the-art accuracy.
- **Gaussian Splatting SLAM** (2024): Uses 3D Gaussians as the map representation, enabling photorealistic rendering alongside tracking.

## Why It Matters

1. **Autonomous vehicles**: SLAM provides real-time localization and mapping for self-driving cars, complementing GPS in tunnels, parking garages, and urban canyons.
2. **Augmented reality**: Every AR headset (Apple Vision Pro, Meta Quest, HoloLens) runs visual-inertial SLAM for spatial tracking at >30 Hz.
3. **Robotics**: Service robots, warehouse automation (Amazon), and delivery drones depend on SLAM for autonomous navigation.
4. **Mapping and surveying**: LiDAR SLAM produces centimeter-accurate 3D maps of buildings, mines, and infrastructure.
5. **Spatial AI**: SLAM is evolving toward semantic understanding -- building maps that include not just geometry but object identities, relationships, and affordances.

## Key Technical Details

- **ORB-SLAM3 accuracy**: 0.35% translational error on KITTI (stereo), 0.04 m ATE on TUM RGB-D.
- **VINS-Mono accuracy**: 0.08 m ATE on EuRoC MAV dataset (11 sequences).
- **Real-time requirements**: Tracking must run at camera frame rate (30 Hz). Mapping and loop closure run in parallel threads at lower rates.
- **Keyframe density**: Typically 1 keyframe per 10--20 frames, yielding manageable optimization problems.
- **Feature count**: ORB-SLAM extracts 1000--2000 ORB features per frame. Map sizes range from 10K to 1M+ landmarks.
- **Loop closure impact**: Without loop closure, drift accumulates at ~1--5% of distance traveled. Loop closure reduces this to ~0.1--0.5%.
- **IMU preintegration**: Compresses hundreds of IMU measurements into a single relative pose + velocity + bias constraint, critical for efficient optimization.

## Common Misconceptions

- **"SLAM is solved."** While SLAM works well in controlled settings, it remains fragile in challenging conditions: dynamic environments, feature-poor scenes (white walls), extreme lighting, and long-term operation with appearance changes.
- **"Visual SLAM gives metric scale from a single camera."** Monocular visual SLAM recovers only up-to-scale geometry. Metric scale requires stereo, depth cameras, IMU fusion, or known object sizes.
- **"More features mean better SLAM."** Tracking quality depends on feature distribution and repeatability, not count. Well-distributed, stable features across the image outperform dense but unreliable detections.
- **"Loop closure just corrects the current position."** Loop closure propagates corrections through the entire pose graph, globally adjusting the trajectory and map -- not just a local fix.
- **"Deep learning has replaced classical SLAM."** Learned components (SuperPoint features, DROID-SLAM's dense flow) improve specific modules, but production SLAM systems remain largely optimization-based with geometric reasoning.

## Connections to Other Concepts

- `multi-view-geometry.md`: SLAM relies directly on epipolar geometry, PnP, triangulation, and bundle adjustment.
- `feature-extraction-and-transformation.md`: ORB, SIFT, and learned features (SuperPoint) provide the correspondences SLAM needs for tracking and mapping.
- `depth-estimation.md`: Predicted depth can initialize or constrain SLAM maps, especially for monocular systems.
- `point-cloud-processing.md`: LiDAR SLAM uses point cloud registration (ICP variants) and spatial indexing (KD-trees).
- `3d-reconstruction.md`: SLAM provides the camera poses needed for dense reconstruction pipelines (MVS, TSDF fusion, NeRF).
- `3d-gaussian-splatting.md`: Emerging SLAM systems use Gaussian maps for simultaneous tracking and photorealistic rendering.

## Further Reading

- Mur-Artal et al., "ORB-SLAM: A Versatile and Accurate Monocular SLAM System" (2015) -- The foundational modern visual SLAM system.
- Campos et al., "ORB-SLAM3: An Accurate Open-Source Library for Visual, Visual-Inertial, and Multimap SLAM" (2021) -- Comprehensive multi-sensor SLAM.
- Qin et al., "VINS-Mono: A Robust and Versatile Monocular Visual-Inertial State Estimator" (2018) -- State-of-the-art visual-inertial odometry.
- Teed & Deng, "DROID-SLAM: Deep Visual SLAM for Monocular, Stereo, and RGB-D Cameras" (NeurIPS 2021) -- Learned dense SLAM with differentiable BA.
- Cadena et al., "Past, Present, and Future of Simultaneous Localization and Mapping: Toward the Robust-Perception Age" (2016) -- Comprehensive survey of SLAM evolution.
