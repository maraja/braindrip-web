# 3D Object Detection

**One-Line Summary**: 3D object detection localizes objects with oriented 3D bounding boxes (x, y, z, width, height, length, yaw) from LiDAR point clouds, camera images, or fused sensor inputs.

**Prerequisites**: 2D object detection (anchor-based and anchor-free), point cloud processing, depth estimation, convolutional neural networks

## What Is 3D Object Detection?

In 2D detection, you draw a rectangle around a car in an image. In 3D detection, you place a box around that car in the real world -- specifying not just where it appears in the image, but its actual position in 3D space, its physical dimensions, and its heading angle. This is the core perception task for autonomous driving: you need to know that a vehicle is 30 meters ahead, 1.8 m tall, 4.5 m long, and heading northeast at 45 degrees. The output is a 7-DoF oriented bounding box $(x, y, z, w, h, l, \theta)$ plus a class label and confidence score.

## How It Works

### LiDAR-Based Methods

**VoxelNet** (Zhou & Tuzel, 2018): Divides the 3D space into voxels, applies a PointNet-like feature extractor within each voxel, then processes the resulting 3D feature grid with sparse 3D convolutions and a 2D detection head. Voxel size is typically $(0.1, 0.1, 0.2)$ m for the KITTI benchmark.

**SECOND** (Yan et al., 2018): Introduces spatially sparse 3D convolutions to VoxelNet, reducing computation by 3--4x while maintaining accuracy. Only occupied voxels are processed.

**PointPillars** (Lang et al., 2019): Simplifies voxels into vertical "pillars" -- voxels with infinite height. Points within each pillar are encoded with a simplified PointNet, producing a 2D pseudo-image of shape $C \times H \times W$. Standard 2D detection heads (SSD-style) then predict 3D boxes. Runs at 62 Hz on a single GPU, making it the go-to real-time LiDAR detector.

The 3D box regression typically parameterizes offsets from anchors:

$$\Delta x = \frac{x_{gt} - x_a}{d_a}, \quad \Delta z = \frac{z_{gt} - z_a}{h_a}, \quad \Delta \theta = \sin(\theta_{gt} - \theta_a)$$

where $d_a = \sqrt{w_a^2 + l_a^2}$ is the anchor diagonal.

**CenterPoint** (Yin et al., 2021): Anchor-free approach. Predicts object centers as heatmap peaks on a bird's-eye-view (BEV) feature map, then regresses box dimensions, height, and heading from center features. Achieves 67.3 NDS on nuScenes test set.

### Camera-Based Methods

Camera-only 3D detection has gained traction for its lower sensor cost.

**BEVDet** (Huang et al., 2022): Lifts multi-camera 2D features into a 3D voxel space using predicted depth distributions, then collapses to BEV for detection. BEVDet4D adds temporal fusion.

**PETR** (Liu et al., 2022): Encodes 3D position information into image features via 3D position-aware embeddings, enabling a transformer decoder to directly predict 3D boxes from multi-view images.

**BEVFormer** (Li et al., 2022): Uses deformable attention to query spatial and temporal BEV features from multi-camera images. Achieves 56.9 NDS on nuScenes, competitive with some LiDAR methods.

### Sensor Fusion

**PointPainting** (Vora et al., 2020): Projects LiDAR points onto camera images, appends semantic segmentation scores to each point, and feeds the decorated point cloud to a LiDAR detector. Simple but effective: +3-4 mAP improvement.

**TransFusion** (Bai et al., 2022): Fuses LiDAR BEV features with camera features using a transformer decoder with spatially-aware cross-attention. Achieves 71.7 NDS on nuScenes test.

**BEVFusion** (Liu et al., 2023): Independently encodes LiDAR and camera inputs into BEV representations, then concatenates them. Achieves 72.9 NDS on nuScenes, demonstrating that unified BEV fusion is highly effective.

### Evaluation Metrics

The standard metric is **3D Average Precision (AP)** at IoU thresholds (0.7 for cars, 0.5 for pedestrians/cyclists on KITTI). nuScenes uses **NDS (nuScenes Detection Score)**, which combines mAP with metrics for translation, scale, orientation, velocity, and attribute errors.

3D IoU between two oriented boxes is computed by finding the intersection volume, which requires polygon clipping in BEV and height overlap.

## Why It Matters

1. **Autonomous driving safety**: Accurate 3D detection is the first link in the safety chain -- incorrect localization directly causes planning failures.
2. **Cost reduction**: Camera-only methods could eliminate expensive LiDAR sensors ($500--$10,000+), enabling affordable self-driving at scale.
3. **Robotics**: Warehouse robots and delivery drones need 3D object detection for navigation and manipulation.
4. **Traffic monitoring**: Infrastructure-mounted sensors use 3D detection for traffic flow analysis and incident detection.
5. **Indoor robotics**: RGB-D-based 3D detection (e.g., VoteNet) enables service robots to perceive furniture, appliances, and obstacles.

## Key Technical Details

- **KITTI benchmark (car, moderate)**: PointPillars 77.3 AP, SECOND 83.3 AP, CenterPoint ~84 AP (3D AP @ IoU 0.7).
- **nuScenes test set**: CenterPoint 67.3 NDS, BEVFusion 72.9 NDS, TransFusion 71.7 NDS.
- **Latency**: PointPillars runs at 62 Hz, CenterPoint at ~11 Hz, BEVFormer at ~4 Hz (on an A100).
- **Point cloud range**: KITTI covers [0, 70.4] x [-40, 40] x [-3, 1] meters; nuScenes uses [-54, 54] x [-54, 54] x [-5, 3] meters.
- **Typical voxel sizes**: (0.05, 0.05, 0.1) m for high-resolution, (0.16, 0.16, 4.0) m for PointPillars pillars.
- **Anchor sizes for cars**: (3.9, 1.6, 1.56) m (length, width, height) on KITTI, matching average sedan dimensions.

## Common Misconceptions

- **"LiDAR-based methods always beat camera-based."** As of 2024, camera-based methods like Far3D and StreamPETR approach or match early LiDAR methods on nuScenes. The gap has narrowed from ~20 NDS to ~5 NDS in three years.
- **"3D IoU is just 2D IoU extended to 3D."** 3D IoU requires computing the intersection of two oriented boxes in 3D, which involves oriented polygon clipping in BEV -- significantly more complex than axis-aligned 2D IoU.
- **"You need perfect depth to do camera-based 3D detection."** Methods like PETR and DETR3D predict 3D positions via learned queries without explicit depth estimation. Depth helps (BEVDet) but is not strictly required.
- **"More sensor modalities always improve performance."** Naive fusion can degrade results if modalities conflict. Effective fusion requires careful alignment (spatial and temporal) and learned weighting.

## Connections to Other Concepts

- **Point Cloud Processing**: LiDAR detectors consume point clouds that require voxelization, downsampling, and spatial indexing.
- **PointNet**: Serves as the per-voxel or per-pillar feature encoder in VoxelNet and PointPillars.
- **Depth Estimation**: Camera-based 3D detectors often rely on monocular depth to lift 2D features into 3D.
- **2D Object Detection**: Many 3D detection heads reuse anchor-based or center-based designs from 2D detectors (SSD, CenterNet).
- **Multi-View Geometry**: Camera-based BEV methods perform implicit multi-view triangulation when fusing images from surrounding cameras.

## Further Reading

- Zhou & Tuzel, "VoxelNet: End-to-End Learning for Point Cloud Based 3D Object Detection" (CVPR 2018) -- Pioneering voxel-based 3D detector.
- Lang et al., "PointPillars: Fast Encoders for Object Detection from Point Clouds" (CVPR 2019) -- Real-time pillar-based detection.
- Yin et al., "Center-Based 3D Object Detection and Tracking" (CVPR 2021) -- CenterPoint anchor-free approach.
- Liu et al., "BEVFusion: Multi-Task Multi-Sensor Fusion with Unified Bird's-Eye View Representation" (ICRA 2023) -- State-of-the-art LiDAR-camera fusion.
- Li et al., "BEVFormer: Learning Bird's-Eye-View Representation from Multi-Camera Images via Spatiotemporal Transformers" (ECCV 2022) -- Transformer-based camera-only BEV detection.
