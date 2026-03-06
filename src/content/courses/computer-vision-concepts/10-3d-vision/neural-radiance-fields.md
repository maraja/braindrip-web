# Neural Radiance Fields (NeRF)

**One-Line Summary**: NeRF represents a 3D scene as a continuous volumetric function, implemented by an MLP that maps 5D coordinates (position + viewing direction) to color and density, enabling photorealistic novel view synthesis.

**Prerequisites**: Multi-layer perceptrons, volume rendering, camera models and projection, gradient-based optimization

## What Is NeRF?

Imagine you could freeze time and walk around a scene, viewing it from any angle, even positions where no camera was placed. NeRF makes this possible: given a sparse set of photographs with known camera poses (typically 20--100 images), it trains a neural network to memorize the entire scene's appearance and geometry. The network learns a function that, for any 3D point and viewing direction, outputs the color you would see and how opaque that point is. Rendering a new view then amounts to casting rays through the scene and accumulating color along each ray -- classical volume rendering, but with a neural network replacing the volume data.

## How It Works

### The Core Representation

NeRF models a scene as a function $F_\Theta$:

$$F_\Theta: (\mathbf{x}, \mathbf{d}) \rightarrow (\mathbf{c}, \sigma)$$

where $\mathbf{x} = (x, y, z)$ is the 3D position, $\mathbf{d} = (\theta, \phi)$ is the viewing direction, $\mathbf{c} = (r, g, b)$ is the emitted color, and $\sigma$ is the volume density (opacity).

The architecture enforces a physical prior: density $\sigma$ depends only on position (geometry is view-independent), while color $\mathbf{c}$ depends on both position and direction (to model view-dependent effects like specular reflections). Concretely, the MLP first processes $\mathbf{x}$ through 8 fully connected layers (256 units each, ReLU activation) to produce $\sigma$ and a 256-dim feature vector. The feature is concatenated with the encoded viewing direction and passed through one additional layer to produce $\mathbf{c}$.

### Positional Encoding

MLPs are biased toward learning low-frequency functions. To capture fine details, NeRF applies a positional encoding $\gamma$ that lifts inputs to a higher-dimensional space:

$$\gamma(p) = \left[\sin(2^0\pi p), \cos(2^0\pi p), \ldots, \sin(2^{L-1}\pi p), \cos(2^{L-1}\pi p)\right]$$

For position, $L = 10$ (mapping 3D to 60D). For direction, $L = 4$ (mapping 2D to 24D). This encoding is critical -- without it, NeRF produces blurry results.

### Volume Rendering

To render a pixel, NeRF casts a ray $\mathbf{r}(t) = \mathbf{o} + t\mathbf{d}$ from the camera origin $\mathbf{o}$ through the pixel. The expected color $C(\mathbf{r})$ is computed by integrating along the ray:

$$C(\mathbf{r}) = \int_{t_n}^{t_f} T(t) \cdot \sigma(\mathbf{r}(t)) \cdot \mathbf{c}(\mathbf{r}(t), \mathbf{d}) \, dt$$

where $T(t) = \exp\left(-\int_{t_n}^{t} \sigma(\mathbf{r}(s)) \, ds\right)$ is the accumulated transmittance (probability that the ray has not hit anything yet).

In practice, this integral is approximated via stratified sampling: $N_c = 64$ coarse samples along each ray, followed by $N_f = 128$ fine samples concentrated where the coarse network predicts high density (hierarchical sampling).

### Training

The loss is simply the L2 photometric error between rendered and ground-truth pixel colors:

$$\mathcal{L} = \sum_{\mathbf{r} \in \mathcal{R}} \|C(\mathbf{r}) - C_{gt}(\mathbf{r})\|_2^2$$

Training uses 4096 rays per batch, Adam optimizer ($\text{lr} = 5 \times 10^{-4}$), and takes ~100K--300K iterations (~1--2 days on a single V100 GPU) for a single scene.

### Faster Variants

- **Instant-NGP** (Muller et al., 2022): Replaces the large MLP with a multi-resolution hash encoding and a tiny MLP (2 layers, 64 units). Training drops from hours to **5--15 seconds**. Rendering reaches 15+ FPS at 1080p.
- **Plenoxels** (Yu et al., 2022): No neural network at all -- optimizes a sparse voxel grid of spherical harmonics directly. Trains in 11 minutes, renders at 15 FPS.
- **TensoRF** (Chen et al., 2022): Factorizes the radiance field into low-rank tensor components, achieving fast training (30 minutes) with low memory.

## Why It Matters

1. **Novel view synthesis**: NeRF produces photorealistic renderings of real scenes from new viewpoints, enabling virtual tours, real estate walkthroughs, and filmmaking.
2. **3D content creation**: NeRF allows capturing real objects as 3D assets without manual modeling -- scan with a phone, reconstruct with NeRF.
3. **Robotics and simulation**: NeRF scenes serve as differentiable simulators for training robot policies with realistic visual observations.
4. **Digital twins**: Building and city-scale NeRFs (Block-NeRF, Mega-NeRF) create photorealistic digital replicas for urban planning.
5. **Foundation for 3DGS**: NeRF's volume rendering framework directly inspired 3D Gaussian Splatting, which achieves real-time performance.

## Key Technical Details

- Original NeRF: ~1.2M parameters, 1--2 days training per scene on a V100, renders at ~0.05 FPS (800x800).
- Instant-NGP: 12M hash table entries + tiny MLP, trains in 5--15 seconds on an RTX 3090, renders at 15+ FPS.
- Input requirements: 20--100 posed images (COLMAP is standard for pose estimation). Fewer images cause artifacts; more images improve quality.
- PSNR on Synthetic-NeRF benchmark: original NeRF 31.0 dB, Instant-NGP 33.2 dB, 3D Gaussian Splatting 33.3 dB.
- NeRF requires per-scene optimization -- it does not generalize across scenes without extensions (pixelNeRF, IBRNet).
- Mip-NeRF (Barron et al., 2021) replaces point samples with cone frustums, reducing aliasing artifacts and improving PSNR by ~1 dB.

## Common Misconceptions

- **"NeRF is a 3D model format."** NeRF is an optimization procedure that produces a trained MLP for a specific scene. It is not a portable 3D format like a mesh or point cloud (though extraction methods exist).
- **"NeRF renders in real-time."** The original NeRF renders at ~0.05 FPS. Real-time rendering requires follow-up work (Instant-NGP, baked NeRF, or 3D Gaussian Splatting).
- **"NeRF needs hundreds of images."** Quality results are possible with 20--50 well-distributed images. Few-shot methods (DietNeRF, RegNeRF) work with as few as 3--8 views.
- **"NeRF replaces traditional 3D reconstruction."** NeRF excels at view synthesis but extracting clean geometry (meshes) from NeRF remains challenging. NeuS and VolSDF address this by combining NeRF with signed distance functions.

## Connections to Other Concepts

- **3D Gaussian Splatting**: The primary successor to NeRF, replacing volumetric ray marching with differentiable point rasterization for real-time rendering.
- **Multi-View Geometry**: NeRF requires accurate camera poses, typically obtained via structure-from-motion (COLMAP).
- **3D Reconstruction**: NeRF provides an implicit 3D representation; extracting explicit geometry connects to mesh reconstruction and implicit surfaces.
- **Depth Estimation**: NeRF implicitly learns depth (the expected ray termination distance), and depth supervision improves NeRF quality.
- **Volume Rendering**: NeRF's rendering equation is classical volume rendering from computer graphics, differentiably implemented.

## Further Reading

- Mildenhall et al., "NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis" (ECCV 2020) -- The foundational paper.
- Muller et al., "Instant Neural Graphics Primitives with a Multiresolution Hash Encoding" (SIGGRAPH 2022) -- Reduces training to seconds.
- Barron et al., "Mip-NeRF: A Multiscale Representation for Anti-Aliasing Neural Radiance Fields" (ICCV 2021) -- Cone tracing for anti-aliased rendering.
- Yu et al., "Plenoxels: Radiance Fields without Neural Networks" (CVPR 2022) -- Sparse voxel grid optimization.
- Tancik et al., "Block-NeRF: Scalable Large Scene Neural View Synthesis" (CVPR 2022) -- City-scale NeRF composition.
