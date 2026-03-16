# 3D Gaussian Splatting

**One-Line Summary**: 3D Gaussian Splatting represents scenes as collections of learnable 3D Gaussian primitives that are rasterized via differentiable tile-based splatting, achieving NeRF-quality novel views at real-time rendering speeds exceeding 100 FPS.

**Prerequisites**: Neural radiance fields, differentiable rendering, Gaussian distributions, camera projection models, gradient-based optimization

## What Is 3D Gaussian Splatting?

Imagine building a scene out of millions of tiny, colored, semi-transparent cotton balls -- each one a 3D Gaussian with a specific position, shape, orientation, color, and transparency. To render a view, you project all these cotton balls onto the screen and blend them front-to-back. Because each Gaussian has an analytic projection formula (a 3D Gaussian projects to a 2D Gaussian), this "splatting" is extremely fast -- no ray marching, no volume integration. 3D Gaussian Splatting (3DGS, Kerbl et al., 2023) makes this entire pipeline differentiable so that the Gaussians' properties can be optimized from multi-view photographs, producing photorealistic renderings at over 100 FPS.

## How It Works

### Gaussian Primitive Definition

Each Gaussian is parameterized by:

- **Position** $\boldsymbol{\mu} \in \mathbb{R}^3$: The center in world coordinates.
- **Covariance** $\Sigma \in \mathbb{R}^{3\times3}$: Encodes shape and orientation. Parameterized as $\Sigma = RSS^TR^T$ where $R$ is a rotation (stored as a quaternion) and $S$ is a diagonal scaling matrix, guaranteeing positive semi-definiteness.
- **Opacity** $\alpha \in [0,1]$: Controls transparency (stored as logit, activated by sigmoid).
- **Color**: Represented via spherical harmonics (SH) coefficients up to degree 3 (48 coefficients total for RGB), enabling view-dependent appearance.

### Differentiable Rasterization

Rendering proceeds in three steps:

1. **Projection**: Each 3D Gaussian with covariance $\Sigma$ is projected to 2D using the viewing transform $W$ and Jacobian $J$ of the projective mapping:

$$\Sigma' = J W \Sigma W^T J^T$$

This yields a 2D Gaussian on the image plane.

2. **Tile-based sorting**: The image is divided into $16 \times 16$ pixel tiles. Each Gaussian is assigned to the tiles it overlaps. Gaussians within each tile are sorted by depth.

3. **Alpha blending**: For each pixel, Gaussians are composited front-to-back:

$$C = \sum_{i=1}^{N} c_i \alpha_i \prod_{j=1}^{i-1}(1 - \alpha_j)$$

where $\alpha_i$ is the Gaussian's opacity multiplied by its 2D Gaussian weight at the pixel location. This is mathematically equivalent to NeRF's volume rendering but computed via rasterization rather than ray marching.

### Adaptive Density Control

During training, 3DGS adaptively manages the number of Gaussians:

- **Densification (cloning)**: Gaussians in under-reconstructed regions (high positional gradient, small scale) are duplicated.
- **Densification (splitting)**: Large Gaussians covering too much area are split into two smaller ones.
- **Pruning**: Gaussians with opacity below a threshold ($\alpha < 0.005$) are removed periodically.
- **Opacity reset**: Every 3000 iterations, all opacities are reset to near-zero, forcing non-contributing Gaussians to be pruned.

A typical scene converges to 500K--5M Gaussians.

### Training

The loss combines L1 photometric error with a D-SSIM term:

$$\mathcal{L} = (1 - \lambda) \mathcal{L}_1 + \lambda \mathcal{L}_{\text{D-SSIM}}$$

with $\lambda = 0.2$. Training uses Adam optimizer with separate learning rates: position ($1.6 \times 10^{-4}$, exponentially decayed), opacity ($0.05$), scaling ($5 \times 10^{-3}$), rotation ($10^{-3}$), SH coefficients ($2.5 \times 10^{-3}$). Convergence takes 30K iterations (~15--30 minutes on an RTX 3090).

### Comparison with NeRF

| Aspect | NeRF (Original) | Instant-NGP | 3D Gaussian Splatting |
|---|---|---|---|
| Training time | 1--2 days | 5--15 seconds | 15--30 minutes |
| Render speed | 0.05 FPS | 15 FPS | 100--200 FPS |
| PSNR (Synthetic) | 31.0 dB | 33.2 dB | 33.3 dB |
| Representation | MLP weights | Hash grid + MLP | Explicit Gaussians |
| Editability | Very difficult | Difficult | Intuitive (move/delete Gaussians) |

## Why It Matters

1. **Real-time rendering**: For the first time, neural scene representations achieve >100 FPS at 1080p, making them viable for interactive applications, VR, and gaming.
2. **Explicit representation**: Unlike NeRF's implicit MLP, Gaussians are explicit primitives that can be inspected, edited, animated, and composited with traditional graphics pipelines.
3. **Quality parity with NeRF**: 3DGS matches or exceeds NeRF quality on standard benchmarks while being orders of magnitude faster to render.
4. **Streaming and compression**: Gaussian parameters can be quantized and streamed progressively, enabling web-based 3D viewers (e.g., Luma AI, Polycam).
5. **Rapid iteration**: 15--30 minute training enables practical capture-to-render workflows for content creation.

## Key Technical Details

- **Memory**: A scene with 2M Gaussians requires ~500 MB of GPU memory (each Gaussian stores ~200 bytes: 3 position + 4 quaternion + 3 scale + 1 opacity + 48 SH = 59 floats).
- **PSNR on Mip-NeRF 360 scenes**: 3DGS achieves 27.2 dB average; Mip-NeRF 360 achieves 27.7 dB but renders 1000x slower.
- **Rendering resolution**: 1080p at 100--200 FPS, 4K at 30--60 FPS on an RTX 3090.
- **Initialization**: Gaussians are initialized from a sparse SfM point cloud (COLMAP). Random initialization works but converges slower and to lower quality.
- **Storage**: Uncompressed, a 2M-Gaussian scene is ~500 MB. Compressed (Compact3D, Lee et al., 2024) reduces this to 10--50 MB with minimal quality loss.
- **SH degree**: Training starts with SH degree 0 (constant color) and progressively increases to degree 3 every 1000 iterations.

## Common Misconceptions

- **"3DGS is just a faster NeRF."** The representations are fundamentally different. NeRF stores the scene in MLP weights (implicit); 3DGS stores it as explicit point primitives. This changes everything about editing, compositing, and rendering.
- **"Gaussians produce blurry results."** Individual Gaussians are smooth, but millions of overlapping Gaussians with view-dependent color (via SH) produce sharp, detailed renderings. The 33+ dB PSNR confirms this.
- **"You need a powerful GPU to view 3DGS."** Rendering is a lightweight rasterization operation. Mobile and web viewers already exist (e.g., WebGL-based splat viewers run at 30+ FPS on laptops).
- **"3DGS handles dynamic scenes natively."** The original method is static. Dynamic extensions (Dynamic 3D Gaussians, Deformable 3DGS) add temporal modeling but remain an active research area.
- **"3DGS replaces meshes for all use cases."** Gaussians lack hard surface boundaries, making them unsuitable for physics simulation, collision detection, or applications requiring watertight meshes.

## Connections to Other Concepts

- `neural-radiance-fields.md`: 3DGS was directly motivated by NeRF's quality but addresses its rendering speed limitation with an explicit, rasterization-based approach.
- `multi-view-geometry.md`: 3DGS depends on accurate camera poses from SfM (COLMAP) and uses the sparse point cloud as initialization.
- `point-cloud-processing.md`: Gaussians are an enriched form of point cloud (each point carries covariance, opacity, and SH color), and standard point cloud operations (downsampling, registration) can be adapted.
- `3d-reconstruction.md`: While 3DGS focuses on rendering, extracting surfaces from Gaussians (SuGaR, Guedon et al., 2024) bridges to mesh reconstruction.
- `depth-estimation.md`: Depth can be rendered from Gaussians as the expected depth along each ray, and depth supervision improves geometry.

## Further Reading

- Kerbl et al., "3D Gaussian Splatting for Real-Time Radiance Field Rendering" (SIGGRAPH 2023) -- The original paper introducing 3DGS.
- Zwicker et al., "EWA Splatting" (2002) -- Classical elliptical weighted average splatting that 3DGS builds upon.
- Luiten et al., "Dynamic 3D Gaussians: Tracking by Persistent Dynamic View Synthesis" (3DV 2024) -- Extension to dynamic scenes.
- Guedon & Lepetit, "SuGaR: Surface-Aligned Gaussian Splatting for Efficient 3D Mesh Reconstruction" (CVPR 2024) -- Extracting meshes from Gaussians.
- Fan et al., "LightGaussian: Unbounded 3D Gaussian Compression" (NeurIPS 2024) -- Pruning and quantization for compact Gaussians.
