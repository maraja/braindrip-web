# SSD (Single Shot MultiBox Detector)

**One-Line Summary**: SSD performs object detection in a single forward pass by predicting bounding boxes and class scores from multiple convolutional feature maps at different scales, achieving 59 FPS with accuracy competitive with two-stage detectors.

**Prerequisites**: Convolutional neural networks, anchor boxes, multi-scale detection, non-maximum suppression, bounding box regression

## What Is SSD?

Consider a security guard monitoring a wall of screens, where each screen shows the same scene at a different zoom level. The guard can spot a person on the wide-angle view, read a license plate on the close-up, and catch a package on the mid-range view -- all simultaneously without switching cameras. SSD works similarly: it examines feature maps at multiple resolutions within a single network, detecting large objects on coarse maps and small objects on finer maps, all in one shot.

Technically, **SSD** (Liu et al., 2016) is a single-stage detector that attaches convolutional prediction heads to multiple feature maps from a backbone network (VGG-16) and additional convolutional layers. At each spatial location on each feature map, SSD predicts offsets and class scores for a set of default (anchor) boxes of varying aspect ratios. Detection is completed in one forward pass with no proposal generation stage.

## How It Works

### Architecture

SSD extends VGG-16 (truncated before classification layers) with extra convolutional layers that progressively reduce spatial resolution:

| Feature Map   | Size (300 input) | Anchors/cell | Total Anchors |
|---------------|-------------------|--------------|---------------|
| Conv4_3       | $38 \times 38$    | 4            | 5,776         |
| Conv7 (fc7)   | $19 \times 19$    | 6            | 2,166         |
| Conv8_2       | $10 \times 10$    | 6            | 600           |
| Conv9_2       | $5 \times 5$      | 6            | 150           |
| Conv10_2      | $3 \times 3$      | 6            | 54            |
| Conv11_2      | $1 \times 1$      | 4            | 4             |

**Total**: 8,732 default boxes per image (for SSD-300).

### Prediction Heads

At each feature map location with $k$ default boxes and $C$ classes:
- **Classification**: $k \times (C + 1)$ outputs (including background).
- **Localization**: $k \times 4$ outputs (offsets $\Delta cx, \Delta cy, \Delta w, \Delta h$).

Each head is a $3 \times 3$ convolutional layer applied to the feature map:

$$\text{Predictions} = \text{Conv}_{3 \times 3}(\text{feature map}) \in \mathbb{R}^{H \times W \times k(C+5)}$$

### Default Box Design

Default boxes are defined by:
- **Scale**: Linearly spaced from $s_{\min} = 0.2$ to $s_{\max} = 0.9$ across feature maps:
$$s_k = s_{\min} + \frac{s_{\max} - s_{\min}}{m - 1}(k - 1)$$
- **Aspect ratios**: $\{1, 2, 3, 1/2, 1/3\}$, plus an extra box with scale $s'_k = \sqrt{s_k \cdot s_{k+1}}$ at ratio 1.

### Training

**Matching**: Each ground-truth box is matched to the default box with highest IoU, plus all default boxes with IoU $> 0.5$.

**Loss function**:
$$L = \frac{1}{N}\left(L_{\text{conf}} + \alpha \cdot L_{\text{loc}}\right)$$

where $L_{\text{conf}}$ is cross-entropy over all classes and $L_{\text{loc}}$ is smooth $L_1$ loss over matched boxes. $\alpha = 1$ by default, $N$ is the number of matched boxes.

**Hard negative mining**: Negatives are sorted by confidence loss and the top ones are selected so the negative-to-positive ratio is at most 3:1.

**Data augmentation**: Aggressive random cropping, photometric distortions, and horizontal flipping. The authors reported that data augmentation improved mAP by ~8.8 points, making it critical for SSD's performance.

## Why It Matters

1. **SSD-300 achieved 74.3% mAP on VOC 2007 at 59 FPS** -- comparable to Faster R-CNN (73.2%) while being ~10x faster.
2. **SSD-512 reached 76.8% mAP** on VOC 2007, exceeding Faster R-CNN, though at a lower 22 FPS.
3. **It demonstrated that single-stage detectors could rival two-stage detectors** in accuracy, not just speed.
4. **Multi-scale feature map detection** became a standard design pattern adopted by subsequent architectures including DSSD, FSSD, and EfficientDet.

## Key Technical Details

- **SSD-300 (VGG-16)**: 74.3% mAP on VOC 2007, 59 FPS on Titan X GPU. 23.2% AP on COCO.
- **SSD-512 (VGG-16)**: 76.8% mAP on VOC 2007, 22 FPS. 26.8% AP on COCO.
- **Small object weakness**: SSD-300 achieves only ~6% AP_S on COCO, because the lowest feature map ($38 \times 38$) has already lost fine spatial detail. SSD-512 partially mitigates this with higher resolution.
- **L2 normalization** on Conv4_3 features is necessary because their magnitudes are ~10-20x larger than deeper layers.
- **Inference**: No proposal stage needed. A single forward pass produces all detections; NMS is applied per-class as a post-processing step.
- **Model size**: ~26M parameters (VGG-16 backbone dominates), ~95 MB.

## Common Misconceptions

- **"SSD is just YOLO with more feature maps."** While both are single-stage, SSD uses anchor boxes at multiple feature map scales (like an RPN at each level), whereas YOLOv1 used no anchors and predicted from a single $7 \times 7$ grid. The multi-scale anchor approach is SSD's key contribution.
- **"Single-stage detectors cannot match two-stage accuracy."** SSD showed they could come close, and later work (RetinaNet with focal loss) surpassed two-stage detectors entirely.
- **"SSD handles all object sizes equally well."** Small objects remain a significant weakness because they are detected on the lowest-resolution feature maps that have undergone many pooling operations. FPN-based architectures address this gap.

## Connections to Other Concepts

- **Multi-Scale Detection**: SSD is a canonical example of detecting objects at different scales from different network layers.
- **YOLO**: Another single-stage detector; YOLOv2+ adopted SSD-style anchor boxes.
- **Feature Pyramid Network**: FPN addresses SSD's small-object weakness by enriching low-level feature maps with top-down semantic information.
- **Focal Loss / RetinaNet**: Identifies and solves the class imbalance problem that limits SSD's accuracy, using FPN + focal loss to surpass two-stage detectors.
- **Non-Maximum Suppression**: Applied per-class after SSD's single forward pass to produce final detections.

## Further Reading

- Liu et al., "SSD: Single Shot MultiBox Detector" (2016) -- The original SSD paper.
- Fu et al., "DSSD: Deconvolutional Single Shot Detector" (2017) -- Added deconvolution modules to SSD for better feature maps.
- Tan et al., "EfficientDet: Scalable and Efficient Object Detection" (2020) -- Modern efficient detector building on SSD's multi-scale paradigm.
- Erhan et al., "Scalable Object Detection Using Deep Neural Networks (MultiBox)" (2014) -- Precursor that introduced the default box concept.
