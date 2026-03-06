# YOLO (You Only Look Once)

**One-Line Summary**: YOLO frames object detection as a single regression problem from image pixels to bounding box coordinates and class probabilities, enabling real-time detection by processing the entire image in one pass through the network.

**Prerequisites**: Convolutional neural networks, bounding box regression, non-maximum suppression, anchor boxes, feature pyramid network

## What Is YOLO?

Imagine glancing at a photograph and instantly knowing where every person, car, and dog is located -- no need to methodically scan each region. That is YOLO's approach: instead of examining thousands of candidate regions, it looks at the whole image once, divides it into a grid, and simultaneously predicts what objects exist and where they are in every grid cell. The name -- "You Only Look Once" -- captures this single-pass philosophy.

Technically, **YOLO** (Redmon et al., 2016) divides the input image into an $S \times S$ grid. Each grid cell predicts $B$ bounding boxes (each with coordinates and a confidence score) and $C$ class probabilities. Detection is accomplished in a single forward pass, making YOLO extremely fast.

## How It Works

### YOLOv1 (2016)

The image is divided into a $7 \times 7$ grid. Each cell predicts:
- $B = 2$ bounding boxes, each with 5 values: $(x, y, w, h, \text{confidence})$
- $C = 20$ class probabilities (PASCAL VOC)

Total output tensor: $7 \times 7 \times (2 \times 5 + 20) = 7 \times 7 \times 30$

Confidence is defined as:
$$\text{Confidence} = \Pr(\text{Object}) \times \text{IoU}(\text{pred}, \text{truth})$$

The loss function combines localization, confidence, and classification terms:
$$L = \lambda_{\text{coord}} \sum_{i,j} \mathbb{1}_{ij}^{\text{obj}} \left[(x_i - \hat{x}_i)^2 + (y_i - \hat{y}_i)^2 + (\sqrt{w_i} - \sqrt{\hat{w}_i})^2 + (\sqrt{h_i} - \sqrt{\hat{h}_i})^2\right] + \ldots$$

The square root on width/height penalizes errors in small boxes more than large ones. $\lambda_{\text{coord}} = 5$, $\lambda_{\text{noobj}} = 0.5$.

### YOLOv2 / YOLO9000 (2017)

Key improvements:
- **Anchor boxes**: Borrowed from Faster R-CNN; $k$-means clustering on training data determined 5 anchor shapes.
- **Batch normalization** on all convolutional layers (+2% mAP).
- **High-resolution classifier**: Fine-tuned at $448 \times 448$ before detection training (+4% mAP).
- **Passthrough layer**: Concatenated high-resolution features from earlier layers to detect small objects.
- **Multi-scale training**: Randomly resized input every 10 batches among $\{320, 352, \ldots, 608\}$.

### YOLOv3 (2018)

- **Darknet-53 backbone**: 53-layer backbone with residual connections.
- **Multi-scale prediction** at 3 scales (FPN-like), predicting at $1/32$, $1/16$, and $1/8$ resolution.
- **9 anchor boxes** (3 per scale), determined by $k$-means.
- **Independent logistic classifiers** per class (replacing softmax) to handle multi-label scenarios.

### YOLOv4 (2020) and YOLOv5

- **CSPDarknet53** backbone, **SPP** and **PANet** neck.
- "Bag of freebies" (training improvements): mosaic augmentation, CIoU loss, label smoothing.
- "Bag of specials" (architecture changes): Mish activation, SAM attention, DIoU-NMS.
- YOLOv5 (Ultralytics, 2020) was a PyTorch reimplementation with auto-anchor learning and extensive engineering optimizations. Not a peer-reviewed publication.

### YOLOv8 (2023) and Beyond

- **Anchor-free design**: Predicts center offsets and width/height directly, eliminating anchor box hyperparameters.
- **Decoupled detection head**: Separate branches for classification and regression.
- **Task-specific variants**: Detection, segmentation, pose estimation, and classification in one framework.
- **Distribution Focal Loss** for bounding box regression.

## Why It Matters

1. **YOLOv1 ran at 45 FPS** (155 FPS for Fast YOLO), establishing real-time detection as feasible for the first time.
2. **YOLO made detection practical for robotics, autonomous driving, and video analytics** where latency matters as much as accuracy.
3. **The YOLO series has been the most widely deployed detector family** in production systems due to its speed-accuracy tradeoff.
4. **Each iteration introduced ideas adopted broadly**: anchor clustering (v2), multi-scale prediction (v3), mosaic augmentation (v4), anchor-free heads (v8).

## Key Technical Details

| Version | Backbone       | VOC 2007 mAP | COCO AP  | Speed (FPS) | Input Size |
|---------|----------------|---------------|----------|-------------|------------|
| v1      | Custom 24-layer| 63.4%         | --       | 45          | 448        |
| v2      | Darknet-19     | 78.6%         | 21.6%    | 67          | 416        |
| v3      | Darknet-53     | --            | 33.0%    | 30          | 608        |
| v4      | CSPDarknet53   | --            | 43.5%    | 62          | 608        |
| v8-L    | Modified CSP   | --            | 52.9%    | ~80         | 640        |

- **YOLOv1 limitations**: Struggles with small objects and groups of small objects (only 2 boxes per cell). Localization errors are the primary failure mode.
- **YOLOv3 at 608**: 33.0% AP on COCO, roughly matching SSD-512 accuracy but 3x faster.
- **YOLOv8-L**: 52.9% AP on COCO at ~80 FPS on an A100 GPU.

## Common Misconceptions

- **"YOLO sacrifices too much accuracy for speed."** This was partially true for v1 (63.4% vs. 73.2% for Faster R-CNN on VOC), but by v4/v5/v8, YOLO variants match or exceed two-stage detectors while maintaining real-time speed.
- **"All YOLO versions use anchor boxes."** YOLOv1 does not use anchors at all, and YOLOv8 moved back to an anchor-free design.
- **"YOLOv5-v8 are direct successors by the original authors."** Joseph Redmon stopped computer vision research after v3. Subsequent versions are by different teams (Bochkovskiy for v4, Ultralytics for v5/v8), leading to community fragmentation.

## Connections to Other Concepts

- **SSD**: A concurrent single-stage detector using multi-scale feature maps with anchor boxes; SSD and YOLO deeply influenced each other.
- **Anchor-Free Detection**: YOLOv8 adopted anchor-free prediction heads inspired by FCOS and CenterNet.
- **Feature Pyramid Network**: YOLOv3+ adopted FPN-style multi-scale feature fusion.
- **Focal Loss**: Addresses the class imbalance problem in single-stage detectors that also affects YOLO.
- **Non-Maximum Suppression**: Essential post-processing step for all YOLO versions.

## Further Reading

- Redmon et al., "You Only Look Once: Unified, Real-Time Object Detection" (2016) -- The original YOLO paper.
- Redmon and Farhadi, "YOLO9000: Better, Faster, Stronger" (2017) -- YOLOv2 with anchor boxes and multi-scale training.
- Redmon and Farhadi, "YOLOv3: An Incremental Improvement" (2018) -- Multi-scale prediction with Darknet-53.
- Bochkovskiy et al., "YOLOv4: Optimal Speed and Accuracy of Object Detection" (2020) -- Comprehensive study of training and architecture improvements.
- Jocher et al., "Ultralytics YOLOv8" (2023) -- Anchor-free design with decoupled head, widely used in industry.
