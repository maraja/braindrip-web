# Point Cloud Processing

**One-Line Summary**: Point cloud processing handles unordered sets of 3D points acquired from LiDAR, depth cameras, or photogrammetry, using specialized data structures and algorithms for efficient spatial reasoning.

**Prerequisites**: Linear algebra, coordinate systems, convolutional neural networks basics, k-nearest neighbors

## What Is Point Cloud Processing?

Imagine standing in a room with a laser pointer that fires millions of beams in every direction, each beam recording where it hits a surface. The collection of all those hit points -- each with an (x, y, z) coordinate and possibly color or intensity -- forms a point cloud. Unlike images arranged on a regular pixel grid, point clouds are unordered, irregularly spaced, and vary in density. Processing them requires data structures and algorithms purpose-built for sparse, unstructured 3D data.

## How It Works

### Point Cloud Acquisition

- **LiDAR (Light Detection and Ranging)**: Emits laser pulses and measures time-of-flight. Automotive LiDAR (e.g., Velodyne VLP-64) produces ~2.2 million points per second with range up to 120 m. Accuracy is typically 1--3 cm.
- **RGB-D cameras**: Intel RealSense and Microsoft Azure Kinect produce depth images that can be back-projected into 3D. Range is limited (~0.3--10 m) with depth noise of 1--2% at max range.
- **Photogrammetry / MVS**: Multi-view stereo produces dense point clouds from overlapping photographs. Quality depends on image resolution and baseline.

### Core Data Structures

**Voxel grids** partition 3D space into regular cubes of side length $s$. A point $(x, y, z)$ maps to voxel index:

$$v_i = \lfloor (x - x_{\min}) / s \rfloor, \quad v_j = \lfloor (y - y_{\min}) / s \rfloor, \quad v_k = \lfloor (z - z_{\min}) / s \rfloor$$

Voxel grids enable O(1) neighbor lookups and are used in VoxelNet, SECOND, and 3D convolution methods. The trade-off: memory scales as $O(N^3)$ for resolution $N$, so sparse voxel representations (e.g., hash maps storing only occupied voxels) are essential for large scenes.

**KD-trees** recursively partition space along alternating axes. Building takes $O(n \log n)$; nearest-neighbor queries run in $O(\log n)$ average case. KD-trees underpin radius search, k-NN queries, and are the backbone of libraries like Open3D and PCL.

**Octrees** subdivide space into 8 children recursively, concentrating resolution where points exist. Used in OctNet and O-CNN for adaptive 3D convolutions.

### Preprocessing Operations

**Downsampling** reduces point count for efficiency. Voxel grid downsampling replaces all points within each voxel with their centroid, typically reducing counts by 5--20x. Farthest point sampling (FPS) greedily selects points maximizing mutual distance, preserving geometric coverage better than random sampling.

**Normal estimation** computes surface normals by fitting a plane to each point's k-nearest neighbors via PCA. The smallest eigenvector of the local covariance matrix gives the normal direction.

**Statistical outlier removal** filters noise by removing points whose mean distance to k neighbors exceeds $\mu + \alpha \cdot \sigma$ (typically $k = 50$, $\alpha = 1.0$).

**Registration** aligns two point clouds. The Iterative Closest Point (ICP) algorithm alternates between finding correspondences (nearest neighbors) and solving for the rigid transform $(R, t)$ that minimizes:

$$\min_{R, t} \sum_i \|R \cdot p_i + t - q_{c(i)}\|^2$$

ICP converges to local minima; coarse alignment (e.g., RANSAC on FPFH features) is needed first. Modern learned registration methods (DCP, PRNet) predict correspondences via neural networks.

### Feature Descriptors

- **FPFH (Fast Point Feature Histograms)**: Encodes local geometry in a 33-dimensional histogram. Used for coarse registration and keypoint matching.
- **SHOT (Signatures of Histograms of Orientations)**: Captures 3D shape context in a 352-dimensional descriptor.
- **Learned features**: FCGF (Fully Convolutional Geometric Features, Choy et al., 2019) uses sparse 3D convolutions to produce per-point descriptors, outperforming handcrafted features on 3DMatch benchmark.

## Why It Matters

1. **Autonomous driving**: LiDAR point clouds are the primary sensor modality for 3D object detection and mapping in self-driving vehicles.
2. **Robotics**: Manipulation tasks require precise 3D understanding of object surfaces and obstacle geometry from depth sensors.
3. **Surveying and mapping**: Airborne LiDAR produces terrain models for civil engineering, forestry, and urban planning with centimeter-level accuracy.
4. **AR/VR**: Real-time point cloud processing enables spatial understanding for mixed reality headsets (e.g., Apple Vision Pro uses depth sensing for room mapping).
5. **Cultural heritage**: Dense photogrammetric point clouds preserve archaeological sites and monuments digitally.

## Key Technical Details

- A single Velodyne VLP-128 scan contains ~300,000 points; a full 360-degree sweep at 10 Hz yields ~3 million points per second.
- Voxel sizes for autonomous driving typically range from 0.05 m (fine) to 0.2 m (coarse). PointPillars uses pillars of infinite height with 0.16 m x-y resolution.
- KD-tree construction for 1M points takes ~50 ms on a modern CPU; radius search at $r = 0.1$ m returns 20--100 neighbors in typical LiDAR scans.
- Open3D (Zhou et al., 2018) and PCL (Point Cloud Library) are the standard open-source frameworks for point cloud processing.
- Sparse convolution libraries (MinkowskiEngine, TorchSparse) achieve 5--10x speedups over dense 3D convolutions by operating only on occupied voxels.

## Common Misconceptions

- **"Point clouds are just 3D images."** Images have regular grid structure enabling standard convolutions. Point clouds are unordered and irregularly sampled, requiring entirely different architectures (PointNet, sparse convolutions, graph networks).
- **"More points always means better results."** Beyond a density threshold, additional points add noise and computational cost without improving accuracy. Downsampling to 16--32k points is standard for detection networks.
- **"Voxelization loses all fine detail."** With voxel sizes of 0.05 m and sparse representations, voxel methods retain sufficient detail for most tasks while enabling efficient 3D convolutions. The real trade-off is memory, not resolution.
- **"LiDAR will be replaced by cameras."** While camera-only 3D perception has improved dramatically (BEVDet, Depth Anything), LiDAR provides direct metric depth unaffected by lighting conditions. Most production autonomous systems use sensor fusion.

## Connections to Other Concepts

- **PointNet / PointNet++**: Neural architectures designed specifically for consuming raw point clouds without voxelization.
- **3D Object Detection**: Point clouds are the primary input for LiDAR-based detectors like VoxelNet and PointPillars.
- **Depth Estimation**: Predicted depth maps can be unprojected into point clouds using camera intrinsics.
- **3D Reconstruction**: Point clouds are an intermediate representation fused into meshes or implicit surfaces.
- **SLAM**: Real-time point cloud registration and mapping are central to LiDAR-based SLAM systems.

## Further Reading

- Rusu et al., "Fast Point Feature Histograms (FPFH) for 3D Registration" (2009) -- Foundational handcrafted 3D descriptor still widely used.
- Zhou et al., "Open3D: A Modern Library for 3D Data Processing" (2018) -- Standard open-source toolkit for point cloud operations.
- Choy et al., "Fully Convolutional Geometric Features" (2019) -- Learned 3D feature descriptors using sparse convolutions.
- Besl and McKay, "A Method for Registration of 3-D Shapes" (1992) -- The original ICP algorithm paper.
- Graham et al., "3D Semantic Segmentation with Submanifold Sparse Convolutional Networks" (2018) -- Sparse convolutions for efficient voxel processing.
