# 3D Reconstruction

**One-Line Summary**: 3D reconstruction recovers the shape and appearance of objects or scenes from sensor observations, producing explicit representations (meshes, voxel grids, point clouds) or neural implicit surfaces (signed distance functions, occupancy fields).

**Prerequisites**: Multi-view geometry, depth estimation, point cloud processing, camera models, neural network fundamentals

## What Is 3D Reconstruction?

Imagine walking around a sculpture and taking photographs from every angle. 3D reconstruction is the process of turning those flat images back into the full three-dimensional object -- a digital replica you can rotate, measure, 3D-print, or drop into a virtual scene. The field spans classical approaches that triangulate geometry from correspondences (multi-view stereo) and volumetric methods that fuse depth maps into grids (TSDF), all the way to modern neural implicit representations that encode surfaces as the zero-level set of a learned function.

## How It Works

### Multi-View Stereo (MVS)

MVS estimates dense 3D geometry from multiple calibrated images (camera poses from SfM):

1. **Depth map estimation**: For each reference image, compute a depth map by matching against neighboring views. PatchMatch-based methods (COLMAP, OpenMVS) sample depth hypotheses and propagate good matches to neighbors. The matching cost is typically normalized cross-correlation (NCC) over $5 \times 5$ to $11 \times 11$ patches.

2. **Depth map fusion**: Merge per-view depth maps into a consistent 3D point cloud. Consistency filtering removes outliers: a depth estimate is kept only if it is consistent across $\geq 3$ views (reprojection error < 1 pixel and depth difference < 1%).

3. **Surface reconstruction**: Convert the fused point cloud to a mesh via Screened Poisson Surface Reconstruction (Kazhdan & Hoppe, 2013) or Delaunay-based methods.

Learned MVS methods like **MVSNet** (Yao et al., 2018) build a 3D cost volume by warping features from source views to the reference via plane sweep at $D = 192$ depth hypotheses, then regularize with 3D convolutions. CasMVSNet (2020) uses a coarse-to-fine cascade to reduce memory.

### TSDF (Truncated Signed Distance Function) Fusion

TSDF fusion (Curless & Levoy, 1996) integrates depth maps from known poses into a voxel grid:

For each voxel at position $\mathbf{v}$, the TSDF value is the (truncated) signed distance to the nearest surface. Positive values are in front of the surface, negative behind. The surface is extracted as the zero-crossing.

Given a new depth map $D$ from camera $T$:

1. Project voxel $\mathbf{v}$ into the depth image: $\mathbf{p} = \pi(T^{-1}\mathbf{v})$.
2. Compute signed distance: $\text{sdf} = D(\mathbf{p}) - \|T^{-1}\mathbf{v}\|_z$.
3. Truncate: $\text{tsdf} = \min(1, \text{sdf} / \mu)$ where $\mu$ is the truncation distance (typically 3--5 voxel widths).
4. Running weighted average update:

$$\text{TSDF}(\mathbf{v}) = \frac{W_{old} \cdot \text{TSDF}_{old} + w_{new} \cdot \text{tsdf}_{new}}{W_{old} + w_{new}}$$

**Marching Cubes** extracts a triangle mesh from the TSDF grid by finding zero-crossings between voxel edges. KinectFusion (Newcombe et al., 2011) demonstrated real-time TSDF fusion at $512^3$ resolution using a GPU.

For large scenes, **voxel hashing** (Niessner et al., 2013) stores only allocated voxel blocks in a hash table, scaling to room- and building-size reconstructions with $O(n)$ memory in surface voxels rather than $O(N^3)$ for the full volume.

### Neural Implicit Surfaces

Neural implicit representations encode geometry as the zero-level set of a learned function, enabling continuous, resolution-independent surface representation.

**DeepSDF** (Park et al., 2019): An MLP $f_\theta(\mathbf{z}, \mathbf{x}) \rightarrow s$ takes a shape code $\mathbf{z}$ and 3D coordinate $\mathbf{x}$ and outputs the signed distance $s$ to the surface. The surface is $\{\mathbf{x} : f_\theta(\mathbf{z}, \mathbf{x}) = 0\}$.

Training uses an auto-decoder framework: shape codes $\mathbf{z}_i$ and network weights $\theta$ are jointly optimized to fit SDF samples from ground-truth meshes:

$$\mathcal{L} = \sum_i \sum_j |f_\theta(\mathbf{z}_i, \mathbf{x}_j) - s_j| + \frac{1}{\sigma^2}\|\mathbf{z}_i\|^2$$

where the regularizer encourages compact shape codes. At test time, a shape code for a new object is optimized while keeping $\theta$ fixed.

**Occupancy Networks** (Mescheder et al., 2019): Instead of signed distance, predict occupancy $o \in \{0, 1\}$ -- whether a point is inside or outside the object. An MLP $f_\theta(\mathbf{z}, \mathbf{x}) \rightarrow [0, 1]$ is trained with binary cross-entropy. Meshes are extracted via Multiresolution IsoSurface Extraction (MISE), a hierarchical variant of marching cubes.

**NeuS** (Wang et al., 2021): Learns a signed distance function from multi-view images (no 3D supervision). Converts SDF to density for volume rendering via a logistic function:

$$\sigma(s) = \frac{1}{\beta} \cdot \frac{e^{-s/\beta}}{(1 + e^{-s/\beta})^2}$$

where $\beta$ is a learnable parameter controlling surface sharpness. This allows photometric supervision (like NeRF) while maintaining a proper SDF whose zero-level set defines a clean surface.

**VolSDF** (Yariv et al., 2021): Similar to NeuS, uses a Laplace CDF to convert SDF to density, with theoretical guarantees on the bound of geometric approximation error.

### Mesh Extraction

From neural implicit functions, meshes are extracted by evaluating the function on a grid and running Marching Cubes. Grid resolution determines mesh quality:

- $128^3$: Coarse, fast (~10 seconds).
- $256^3$: Standard quality (~1 minute).
- $512^3$: High detail (~10 minutes, 4+ GB memory).

FlexiCubes (Shen et al., 2023) and DMTet (Shen et al., 2021) provide differentiable mesh extraction, enabling end-to-end optimization of mesh geometry and topology.

## Why It Matters

1. **Digital twins**: Reconstructing buildings, factories, and cities as 3D models for simulation, monitoring, and planning.
2. **Cultural heritage**: Preserving archaeological sites and artifacts as high-fidelity 3D models (e.g., Notre-Dame reconstruction after the 2019 fire).
3. **E-commerce**: Creating 3D product models from photographs for online shopping and AR try-on.
4. **Medical imaging**: Reconstructing patient anatomy from CT/MRI scans for surgical planning and 3D-printed implants.
5. **Robotics**: Robots need 3D models of their environment for manipulation planning and collision avoidance.
6. **Gaming and VR**: Scanning real environments to create game assets and virtual worlds.

## Key Technical Details

- **COLMAP MVS**: Produces point clouds with ~1 mm accuracy for small objects; ~1 cm for rooms. Processing 100 images at 12 MP takes 1--4 hours on a modern GPU.
- **TSDF resolution**: KinectFusion uses $512^3$ voxels for a $3 \times 3 \times 3$ m volume (5.9 mm voxel size). Voxel hashing scales to 50+ m rooms.
- **DeepSDF**: 256-dim shape code, 8-layer MLP with 512 hidden units. Reconstructs shapes at sub-millimeter accuracy on ShapeNet.
- **Occupancy Networks**: IoU of 0.571 on ShapeNet (single-image reconstruction), compared to 0.501 for Pixel2Mesh.
- **NeuS**: Achieves mean Chamfer distance of 0.83 mm on DTU dataset (15 scenes), outperforming NeRF-based geometry extraction.
- **Marching Cubes**: $O(N^3)$ time and space for grid resolution $N$. Output mesh size: a $256^3$ grid typically produces 200K--2M triangles.
- **TSDF truncation distance**: $\mu = 3\delta$ to $5\delta$ where $\delta$ is the voxel size. Too small causes holes; too large smooths details.

## Common Misconceptions

- **"NeRF and 3D reconstruction are the same thing."** NeRF optimizes for view synthesis (rendering quality); extracting geometry from NeRF yields noisy surfaces. Methods like NeuS and VolSDF are specifically designed for reconstruction quality.
- **"You need depth sensors for 3D reconstruction."** Multi-view stereo reconstructs from RGB images alone. Depth sensors help (especially indoors) but are not required.
- **"Neural implicit surfaces are always better than classical methods."** For large-scale outdoor scenes, classical MVS + Poisson reconstruction often produces more reliable results. Neural methods excel on single objects and controlled settings.
- **"Voxel grids cannot represent fine detail."** With voxel hashing and adaptive resolution (octrees), voxel-based methods achieve sub-millimeter detail in regions of interest while remaining memory-efficient.
- **"Marching Cubes produces water-tight meshes by default."** Marching Cubes can produce cracks, non-manifold edges, and artifacts at grid boundaries. Post-processing (mesh cleaning, hole filling) is typically needed.

## Connections to Other Concepts

- `multi-view-geometry.md`: SfM provides the camera poses required for MVS and neural reconstruction. Triangulation is the fundamental operation underlying sparse reconstruction.
- `depth-estimation.md`: Predicted depth maps serve as input for TSDF fusion when sensor depth is unavailable.
- `point-cloud-processing.md`: Fused point clouds from MVS or TSDF require filtering, normal estimation, and meshing.
- `neural-radiance-fields.md`: NeuS and VolSDF combine NeRF's differentiable rendering with SDF representations for reconstruction with photometric supervision.
- `3d-gaussian-splatting.md`: SuGaR extracts meshes from Gaussian splats, bridging novel view synthesis and reconstruction.
- `slam.md`: SLAM systems build maps online; offline reconstruction produces higher-quality geometry from the same data.

## Further Reading

- Curless & Levoy, "A Volumetric Method for Building Complex Models from Range Images" (SIGGRAPH 1996) -- Foundational TSDF fusion paper.
- Park et al., "DeepSDF: Learning Continuous Signed Distance Functions for Shape Representation" (CVPR 2019) -- Neural implicit shape representation.
- Mescheder et al., "Occupancy Networks: Learning 3D Reconstruction in Function Space" (CVPR 2019) -- Occupancy-based implicit representation.
- Wang et al., "NeuS: Learning Neural Implicit Surfaces by Volume Rendering for Multi-View Reconstruction" (NeurIPS 2021) -- SDF + volume rendering for reconstruction.
- Schonberger et al., "Pixelwise View Selection for Unstructured Multi-View Stereo" (ECCV 2016) -- COLMAP's MVS algorithm.
- Kazhdan & Hoppe, "Screened Poisson Surface Reconstruction" (2013) -- Standard point cloud to mesh algorithm.
