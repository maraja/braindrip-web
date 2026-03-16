# Depth Estimation

**One-Line Summary**: Depth estimation recovers per-pixel distance from the camera to the scene, either from a single image (monocular) or from stereo image pairs, enabling 3D understanding from 2D observations.

**Prerequisites**: Convolutional neural networks, encoder-decoder architectures, loss functions, epipolar geometry basics

## What Is Depth Estimation?

Imagine holding up a photograph and trying to judge how far away each object is -- your brain does this effortlessly using cues like relative size, occlusion, texture gradients, and perspective. Depth estimation teaches machines to do the same: given one or more images, predict a dense map where each pixel stores its distance from the camera. With stereo cameras, the problem reduces to geometry (triangulation from known baselines). With a single image, the network must learn statistical priors about the 3D world from data alone.

## How It Works

### Stereo Depth Estimation

Stereo methods exploit the horizontal disparity between left and right images captured from cameras with a known baseline $b$. Depth $Z$ relates to disparity $d$ and focal length $f$ by:

$$Z = \frac{f \cdot b}{d}$$

Classical approaches (SGM, Semi-Global Matching) compute matching costs over a disparity range. Modern learned methods like AANet (2020) and RAFT-Stereo (2021) build 4D cost volumes of shape $H \times W \times D_{\max} \times F$ and iteratively refine disparity predictions. RAFT-Stereo achieves sub-pixel accuracy on Middlebury with end-point error below 1.3 px.

### Monocular Depth Estimation

Monocular methods predict depth from a single RGB image using an encoder-decoder architecture. The encoder (often a pretrained backbone like DPT with a Vision Transformer) extracts multi-scale features, and the decoder upsamples to produce a dense depth map.

**Key supervised models:**
- **MiDaS** (Ranftl et al., 2020): Trained on a mix of 10+ datasets with affine-invariant loss, producing relative depth that generalizes across domains. MiDaS v3.1 uses DPT-Large (BEiT backbone) and achieves state-of-the-art zero-shot transfer.
- **Depth Anything** (Yang et al., 2024): Scales monocular depth via a DINOv2 encoder with 62M unlabeled images for self-training. Depth Anything V2 uses synthetic data from virtual engines for metric depth, achieving 0.064 AbsRel on NYUv2 and 1.86m SqRel on KITTI.

**Supervised loss** typically combines scale-invariant log-depth loss:

$$\mathcal{L}_{si} = \frac{1}{n}\sum_i g_i^2 - \frac{\lambda}{n^2}\left(\sum_i g_i\right)^2, \quad g_i = \log \hat{d}_i - \log d_i$$

with gradient-matching terms for edge sharpness.

### Self-Supervised Approaches

Self-supervised monocular depth (Monodepth2, Godard et al., 2019) trains using stereo pairs or video sequences without ground-truth depth. The key idea: predict depth from a target image, then use the predicted depth plus known/estimated camera pose to warp a source image onto the target. The photometric reprojection loss drives learning:

$$\mathcal{L}_{ph} = \alpha \cdot \text{SSIM}(I_t, \hat{I}_{t}) + (1 - \alpha) \|I_t - \hat{I}_{t}\|_1$$

where $\alpha = 0.85$ is standard. A separate pose network estimates relative camera motion between frames.

### Metric vs. Relative Depth

- **Relative depth**: Predicts up-to-scale ordering (MiDaS). Robust across domains but cannot give absolute distances.
- **Metric depth**: Predicts depth in real-world units (meters). Requires domain-specific training or fine-tuning. ZoeDepth (2023) bridges both with a two-stage approach: relative backbone + metric bins head.

## Why It Matters

1. **Autonomous driving**: LiDAR costs thousands of dollars; monocular depth from cheap cameras provides a complementary or replacement signal for 3D perception.
2. **Augmented reality**: AR applications need real-time depth to place virtual objects at correct distances and handle occlusions.
3. **Robotics**: Manipulation and navigation require metric depth for obstacle avoidance and grasp planning.
4. **Computational photography**: Portrait mode, depth-of-field effects, and 3D photos rely on consumer-grade depth estimation on mobile devices.
5. **3D reconstruction**: Depth maps are a core input for TSDF fusion, point cloud generation, and neural implicit surface methods.

## Key Technical Details

- MiDaS v3.1 DPT-Large runs at ~11 FPS on an A100 at 384x384 resolution; smaller variants (MiDaS-small, EfficientNet backbone) reach 30+ FPS on mobile GPUs.
- Depth Anything V2 (ViT-L) achieves 0.056 AbsRel on NYUv2 (indoor) and 0.064 on KITTI (outdoor), competitive with supervised methods trained on those specific datasets.
- Self-supervised methods typically trail supervised methods by 5--15% on standard metrics (AbsRel, RMSE) but require no ground-truth depth labels.
- Common evaluation metrics: AbsRel ($\frac{1}{n}\sum|d^* - d|/d^*$), SqRel, RMSE, and $\delta_i$ thresholds ($\%$ of pixels with $\max(d/d^*, d^*/d) < 1.25^i$).
- Stereo methods produce metric depth directly but require calibrated camera pairs; monocular methods work with any single camera.

## Common Misconceptions

- **"Monocular depth gives you actual distances."** Most monocular models (MiDaS, Depth Anything v1) predict relative depth -- ordering is correct but scale is arbitrary. Metric depth requires additional calibration or specialized training heads.
- **"Stereo depth is always better than monocular."** Stereo struggles with textureless surfaces, repetitive patterns, and occlusions. In these cases, monocular priors can outperform pure stereo matching.
- **"Self-supervised depth is just a curiosity."** Self-supervised methods are deployed in production (e.g., Tesla's vision-only system uses photometric consistency principles). They unlock training on millions of unlabeled video frames.
- **"Higher resolution always means better depth."** Depth accuracy depends more on the receptive field and training data diversity than raw resolution. Downsampling to 384x384 often suffices for strong zero-shot performance.

## Connections to Other Concepts

- `multi-view-geometry.md`: Stereo depth is a direct application of epipolar constraints and triangulation.
- `3d-reconstruction.md`: Depth maps are fused into volumetric representations (TSDF) or point clouds for surface reconstruction.
- `3d-object-detection.md`: Predicted depth enables pseudo-LiDAR approaches that lift 2D detections into 3D space.
- `slam.md`: Depth estimation provides the mapping component in visual SLAM systems.
- `vision-transformer.md`: DPT and Depth Anything leverage ViT and DINOv2 backbones for global context in depth prediction.

## Further Reading

- Ranftl et al., "Towards Robust Monocular Depth Estimation: Mixing Datasets for Zero-Shot Cross-Dataset Transfer" (2020) -- Introduces MiDaS and multi-dataset training with affine-invariant losses.
- Godard et al., "Digging Into Self-Supervised Monocular Depth Estimation" (2019) -- Monodepth2 with minimum reprojection loss and auto-masking.
- Yang et al., "Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data" (2024) -- Scales monocular depth with DINOv2 and self-training on 62M images.
- Bhat et al., "ZoeDepth: Zero-Shot Transfer by Combining Relative and Metric Depth" (2023) -- Bridges relative and metric depth with bin-based prediction heads.
- Lipson et al., "RAFT-Stereo: Multilevel Recurrent Field Transforms for Stereo Matching" (2021) -- Iterative refinement for high-accuracy stereo disparity.
