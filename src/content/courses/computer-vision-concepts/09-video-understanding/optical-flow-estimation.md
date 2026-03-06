# Optical Flow Estimation

**One-Line Summary**: Optical flow estimation computes dense per-pixel motion vectors between consecutive video frames, evolving from variational energy minimization to learned architectures like FlowNet, PWC-Net, and RAFT.

**Prerequisites**: Convolutional neural networks, image warping, correlation, encoder-decoder architectures, iterative refinement

## What Is Optical Flow Estimation?

Imagine holding a transparent sheet over a photograph and marking, for every single point, an arrow showing where that point moved in the next photograph. The collection of all these arrows -- one per pixel -- is the optical flow field. It answers the question: "Where did each pixel go?"

Formally, optical flow is a 2D vector field $(u, v)$ defined over the image plane, where $(u(x, y), v(x, y))$ represents the horizontal and vertical displacement of pixel $(x, y)$ between frame $I_t$ and frame $I_{t+1}$. The brightness constancy assumption underlying classical methods states:

$$I(x, y, t) = I(x + u, y + v, t + 1)$$

Taking a first-order Taylor expansion yields the optical flow constraint equation:

$$I_x u + I_y v + I_t = 0$$

where $I_x, I_y, I_t$ are spatiotemporal image gradients. Since this single equation has two unknowns per pixel, additional constraints (smoothness, local constancy) are needed.

## How It Works

### Classical Variational Methods

Horn-Schunck (1981) minimized a global energy combining the brightness constancy and smoothness:

$$E(u, v) = \iint \left[(I_x u + I_y v + I_t)^2 + \alpha^2 (|\nabla u|^2 + |\nabla v|^2)\right] dx\, dy$$

TV-L1 (Zach et al., 2007) replaced the quadratic data term with an $L_1$ norm for robustness to outliers and the smoothness term with total variation. TV-L1 became the standard for pre-computing flow in action recognition (~0.5s per frame pair on CPU, ~0.06s on GPU).

### FlowNet: Learning to Estimate Flow

Dosovitskiy et al. (2015) proposed FlowNet, the first end-to-end CNN for optical flow:

**FlowNetS (Simple)**: Encoder-decoder with skip connections. Two frames are concatenated as a 6-channel input and processed through a contracting encoder. The decoder upsamples with deconvolutions and skip connections from the encoder.

**FlowNetC (Correlation)**: Two frames are processed by separate (shared-weight) encoder branches up to a correlation layer. The correlation layer computes local matching scores:

$$c(\mathbf{x}_1, \mathbf{x}_2) = \sum_{\mathbf{o} \in [-k, k]^2} \langle f_1(\mathbf{x}_1 + \mathbf{o}), f_2(\mathbf{x}_2 + \mathbf{o}) \rangle$$

over a search neighborhood $D \times D$, producing a $D^2$-channel correlation volume. This explicit matching computation improved accuracy on small displacements.

FlowNet trained on the synthetic FlyingChairs dataset (22k image pairs). EPE (endpoint error) on Sintel: ~6.0 pixels (vs. ~5.0 for EpicFlow, a classical method at the time).

### FlowNet2.0: Stacking and Scheduling

Ilg et al. (2017) improved FlowNet through:

1. **Stacking**: Cascading multiple FlowNets where each refines the previous estimate. FlowNet2 stacks FlowNetC -> FlowNetS -> FlowNetS with warping between stages.
2. **Training schedule**: Curriculum learning from FlyingChairs (simple) to FlyingThings3D (complex).
3. **Small displacement network**: A specialized sub-network for sub-pixel motions.

FlowNet2.0 achieved 2.02 EPE on Sintel Clean, matching classical state-of-the-art at ~25 FPS on GPU (vs. minutes for variational methods).

### PWC-Net: Pyramidal Processing

Sun et al. (2018) introduced PWC-Net (Pyramid, Warping, Cost volume), achieving better accuracy with a fraction of FlowNet2's parameters:

1. **Feature pyramid**: Extract features at multiple scales using a learnable pyramid (not fixed Gaussian).
2. **Warping**: At each level, warp features of the second image using the upsampled flow estimate from the coarser level.
3. **Cost volume**: Compute a partial cost volume by correlating features within a limited search range ($d=4$ pixels at each level).
4. **CNN estimator**: A compact CNN predicts the flow residual from the cost volume and context features.

Processing coarse-to-fine enables handling large motions efficiently. PWC-Net: 2.55 EPE on Sintel Clean, 4.38 on Sintel Final, with only 8.75M parameters (vs. 162M for FlowNet2) at ~35 FPS.

### RAFT: Recurrent All-Pairs Field Transforms

Teed and Deng (2020) introduced RAFT, which fundamentally changed the approach:

1. **Feature extraction**: A shared encoder extracts features from both frames at 1/8 resolution.
2. **All-pairs correlation**: Compute correlations between ALL pairs of pixels (not just local neighborhoods), producing a 4D correlation volume $C \in \mathbb{R}^{H \times W \times H \times W}$:

$$C_{ijkl} = \sum_c f_1(i, j, c) \cdot f_2(k, l, c)$$

This volume is constructed once and stored as a correlation pyramid (pooled at multiple scales) for efficient lookup.

3. **Iterative refinement**: A GRU-based recurrent unit iteratively updates the flow estimate. At each iteration $k$:

$$h_{k+1}, \Delta f_k = \text{GRU}(h_k, x_k)$$
$$f_{k+1} = f_k + \Delta f_k$$

where $x_k$ includes correlation lookups indexed by the current flow estimate, the current flow, and context features. Typically 12--32 iterations during training, with the same number or more at inference.

RAFT achieved 1.61 EPE on Sintel Clean and 2.86 on Sintel Final, a major leap. Its recurrent design allows trading compute for accuracy at inference time (more iterations = better flow).

### Post-RAFT Developments

- **GMA** (Jiang et al., 2021): Added global motion aggregation via self-attention to handle occlusions; 1.39 EPE on Sintel Clean
- **FlowFormer** (Huang et al., 2022): Transformer-based cost volume processing; 1.16 EPE on Sintel Clean
- **VideoFlow** (Shi et al., 2023): Exploits temporal context from multiple frames; further improvements on Sintel

### Evaluation Metrics

**Endpoint Error (EPE)**: The Euclidean distance between predicted and ground-truth flow vectors, averaged over all pixels:

$$\text{EPE} = \frac{1}{N}\sum_{i=1}^N \sqrt{(u_i - u_i^{gt})^2 + (v_i - v_i^{gt})^2}$$

**Fl-all (KITTI)**: Percentage of pixels where EPE > 3 pixels AND relative error > 5%.

## Why It Matters

1. **Video understanding backbone**: Optical flow provides motion information critical for action recognition (two-stream networks), video segmentation, and frame interpolation.
2. **Autonomous driving**: Dense motion estimation enables independent motion detection (identifying other moving vehicles), ego-motion estimation, and scene flow computation. KITTI flow benchmarks directly evaluate this.
3. **Video editing and VFX**: Motion compensation, temporal interpolation (slow-motion), stabilization, and object tracking all rely on accurate flow.
4. **Self-supervised learning signal**: Flow provides a free supervisory signal for learning video representations without human annotations, and flow prediction can itself be trained self-supervised using photometric losses.

## Key Technical Details

- Sintel Clean / Final EPE: RAFT 1.61 / 2.86, FlowFormer 1.16 / 2.09, GMA 1.39 / 2.47
- KITTI-2015 Fl-all: RAFT 5.10%, FlowFormer 4.09%
- RAFT inference: ~10 FPS on 1080p with 20 iterations on a V100 GPU; faster with fewer iterations
- PWC-Net: 8.75M params, ~35 FPS at 1024x436; RAFT: ~5.3M params, ~10 FPS
- FlowNet2.0: 162M params, 25 FPS at 1024x436
- Training data: FlyingChairs (22k), FlyingThings3D (22k), Sintel (1k), KITTI (200); pre-train on synthetic, fine-tune on target
- RAFT correlation volume memory: $O(H^2 \times W^2 / 64)$ at 1/8 resolution; for $440 \times 1024$ input, ~600 MB
- TV-L1 flow (classical): ~0.06s/frame on GPU, ~0.5s on CPU; main bottleneck for two-stream training pipelines

## Common Misconceptions

- **"Learned optical flow has completely replaced classical methods."** TV-L1 remains widely used for pre-computing flow in action recognition pipelines due to its simplicity and sufficient quality. Classical methods also have no data distribution shift issues and work reliably on arbitrary inputs.
- **"Optical flow requires two frames and cannot handle occlusions."** Multi-frame methods (VideoFlow) and occlusion-aware architectures (GMA) explicitly reason about occluded regions. Forward-backward consistency checks ($|f_{01}(x) + f_{10}(x + f_{01}(x))| < \epsilon$) detect occlusions where flow is undefined.
- **"More parameters always improve flow quality."** RAFT (5.3M params) significantly outperforms FlowNet2 (162M params), demonstrating that architectural design (all-pairs correlation, iterative refinement) matters more than model size.

## Connections to Other Concepts

- **Two-Stream Networks**: Optical flow is the input to the temporal stream, making flow quality directly impact action recognition accuracy.
- **Video Representation**: Stacked flow fields are a primary video representation for motion-sensitive tasks.
- **Video Object Tracking**: Flow provides motion cues for predicting object locations in subsequent frames.
- **Video Generation**: Temporal coherence in generated videos can be evaluated and enforced using optical flow consistency.
- **3D Convolutions**: 3D CNNs learn implicit motion representations that partially overlap with optical flow information.

## Further Reading

- Dosovitskiy et al., "FlowNet: Learning Optical Flow with Convolutional Networks" (2015) -- First end-to-end CNN for optical flow.
- Ilg et al., "FlowNet 2.0: Evolution of Optical Flow Estimation with Deep Networks" (2017) -- Stacked refinement and training schedule improvements.
- Sun et al., "PWC-Net: CNNs for Optical Flow Using Pyramid, Warping, and Cost Volume" (2018) -- Efficient coarse-to-fine learned flow.
- Teed & Deng, "RAFT: Recurrent All-Pairs Field Transforms for Optical Flow" (2020) -- All-pairs correlation with iterative GRU refinement; current paradigm.
- Huang et al., "FlowFormer: A Transformer Architecture for Optical Flow" (2022) -- Transformer-based cost volume processing.
