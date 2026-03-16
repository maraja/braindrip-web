# Multi-Scale Detection

**One-Line Summary**: Multi-scale detection addresses the challenge of recognizing objects that vary enormously in size (from a few pixels to thousands) within a single image, using strategies ranging from image pyramids to feature pyramids to scale-aware architectures.

**Prerequisites**: Convolutional neural networks, feature maps and receptive fields, pooling and stride, image pyramids, feature pyramid network

## What Is Multi-Scale Detection?

Consider a wildlife photographer with a single lens. A sparrow one meter away and an eagle three hundred meters away need very different zoom settings. If the photographer can only use one zoom level, they will capture one bird well and miss the other entirely. Multi-scale detection is the suite of techniques that let a detector handle this vast size range -- seeing both the sparrow and the eagle in the same frame.

Technically, **multi-scale detection** refers to methods that enable object detectors to locate and classify objects across a wide range of spatial sizes. In COCO, objects range from $10 \times 10$ pixels (small) to $500 \times 500$ pixels (large) -- a 50:1 ratio in linear dimension and 2,500:1 in area. No single feature map resolution can optimally represent all these scales, so detectors must employ explicit strategies to span this range.

## How It Works

### Strategy 1: Image Pyramids (Brute Force)

The simplest approach: resize the input image to multiple scales and run the detector independently at each scale.

```
Original image (800x600)
    |-> Resize to 1200x900  -> Detector -> Detections
    |-> Resize to 800x600   -> Detector -> Detections
    |-> Resize to 533x400   -> Detector -> Detections
    |-> Resize to 356x267   -> Detector -> Detections
    Merge all detections + NMS
```

**Pros**: Each scale gets the full representational power of the network.
**Cons**: Computation scales linearly (or worse) with the number of pyramid levels. Processing 4 scales means ~4x the cost.

Multi-scale testing (test-time augmentation) in modern detectors typically uses 3-5 scales and improves AP by 2-4%, but is too slow for real-time use.

### Strategy 2: Single Feature Map (Naive)

Early CNN detectors (OverFeat, YOLOv1) predicted from a single feature map at the network's output stride.

- **YOLOv1**: Predicts from a $7 \times 7$ feature map (stride 64). Each cell covers $\sim 64 \times 64$ pixels, making small object detection nearly impossible.
- **Limitation**: The receptive field and resolution are fixed; objects much smaller or larger than the effective detection range are missed.

### Strategy 3: Multi-Layer Prediction (SSD Approach)

Attach detection heads to multiple layers within the network, each at a different resolution:

| Layer         | Stride | Detection Range | Object Size  |
|---------------|--------|-----------------|--------------|
| Conv4_3       | 8      | Fine             | Small        |
| Conv7         | 16     | Medium           | Medium       |
| Conv8_2       | 32     | Coarse           | Large        |
| Conv9_2-11_2  | 64-256 | Very coarse      | Very large   |

**Problem**: Lower layers have strong spatial resolution but weak semantics. Higher layers have strong semantics but coarse resolution. There is no layer that has both.

### Strategy 4: Feature Pyramid Network (Top-Down Enrichment)

FPN solves the semantic gap by merging top-down semantic information with bottom-up spatial detail:

$$P_l = \text{Conv}_{3 \times 3}\left(\text{Conv}_{1 \times 1}(C_l) + \text{Upsample}(P_{l+1})\right)$$

Every pyramid level now has both fine spatial resolution (from the bottom-up path) and strong semantic features (from the top-down path). This is the dominant approach in modern detectors.

### Strategy 5: Scale-Aware Assignment

Different detectors assign objects to scales differently:

**Anchor-based (Faster R-CNN + FPN)**: Objects are assigned to the pyramid level $l$ where their area best matches the anchor sizes at that level:

$$l = \lfloor l_0 + \log_2(\sqrt{wh} / 224) \rfloor$$

**Anchor-free (FCOS)**: Objects are assigned based on the regression target range at each level. Level $P_3$ handles objects with regression targets in $[0, 64]$, $P_4$ handles $[64, 128]$, etc.

**ATSS (Adaptive Training Sample Selection)**: Selects positive samples based on statistical properties of IoU distributions rather than fixed thresholds, adapting to each object's characteristics.

### Strategy 6: Deformable Convolutions

Dai et al. (2017) introduced convolutions with learned spatial offsets, allowing the network to adaptively adjust its receptive field to match object scale:

$$\mathbf{y}(\mathbf{p}_0) = \sum_{k} \mathbf{w}_k \cdot \mathbf{x}(\mathbf{p}_0 + \mathbf{p}_k + \Delta\mathbf{p}_k)$$

where $\Delta\mathbf{p}_k$ are learned offsets. This provides a form of implicit multi-scale handling.

## Why It Matters

1. **Object size variation is one of the hardest problems in detection.** On COCO, AP for small objects (AP_S) is typically 15-25 percentage points lower than AP for large objects (AP_L), even for state-of-the-art detectors.
2. **FPN-based multi-scale detection improved small object AP by ~2x** compared to single-scale baselines, bringing AP_S from ~10% to ~20% for Faster R-CNN.
3. **Multi-scale test-time augmentation** remains the single most effective way to boost AP for competition settings, consistently providing +2-4% AP.
4. **Scale handling defines the practical utility of a detector**: autonomous driving must detect both nearby pedestrians (large) and distant vehicles (small) simultaneously.

## Key Technical Details

- **COCO size definitions**: Small ($\text{area} < 32^2$), Medium ($32^2 \leq \text{area} < 96^2$), Large ($\text{area} \geq 96^2$).
- **Scale gap**: State-of-the-art detectors (2023) achieve ~35% AP_S vs. ~55% AP_L on COCO -- small objects remain ~20 AP points behind.
- **FPN overhead**: Adds <5% FLOPs to the backbone, making it essentially free in terms of computation.
- **Image pyramid cost**: Processing 5 scales costs ~4-5x single-scale inference time (not exactly 5x due to smaller scales being cheaper).
- **SNIP (2018)**: Singh and Davis showed that training on scale-appropriate instances only (ignoring too-small and too-large objects at each pyramid level) improves AP by ~2%.
- **Trident Networks (2019)**: Use dilated convolutions with different dilation rates to construct parallel branches for different scales, sharing all parameters.
- **High-resolution input**: Simply increasing input resolution from 800 to 1333 pixels improves AP_S by ~3-5% but increases compute by ~2.8x.

## Common Misconceptions

- **"FPN completely solves multi-scale detection."** FPN significantly narrows the gap, but small object detection remains much harder than large object detection. The fundamental challenge is that small objects have very few pixels of information, regardless of feature map resolution.
- **"More scales are always better."** Diminishing returns set in quickly. Going from 1 to 3 FPN levels yields large gains; going from 5 to 7 levels yields minimal improvement at significant cost.
- **"Image pyramids and feature pyramids are equivalent."** Image pyramids provide exact multi-scale representation but at linear cost. Feature pyramids approximate multi-scale representation at near-zero additional cost, but lower pyramid levels may not perfectly reconstruct fine details lost during downsampling.
- **"Larger input resolution always helps."** Beyond a point, larger inputs increase computation quadratically while providing diminishing accuracy gains. The optimal input size depends on the object size distribution in the target application.

## Connections to Other Concepts

- `feature-pyramid-network.md`: The primary architectural solution to multi-scale detection in modern systems.
- `ssd.md`: Pioneered multi-layer prediction for multi-scale detection without top-down enrichment.
- `yolo.md`: YOLOv1 used single-scale prediction; v3 onward adopted multi-scale FPN-like architectures.
- `sliding-window-and-region-proposals.md`: Classical methods used image pyramids for multi-scale scanning.
- `focal-loss.md`: Applies focal loss across all FPN levels, with scale-specific anchor assignment.
- `detr.md`: Original DETR used single-scale features; Deformable DETR added multi-scale attention for improved small-object detection.

## Further Reading

- Lin et al., "Feature Pyramid Networks for Object Detection" (2017) -- The dominant multi-scale feature extraction method.
- Liu et al., "SSD: Single Shot MultiBox Detector" (2016) -- Multi-scale detection from different convolutional layers.
- Singh and Davis, "An Analysis of Scale Invariance in Object Detection -- SNIP" (2018) -- Scale-aware training strategy.
- Li et al., "Scale-Aware Trident Networks for Object Detection" (2019) -- Parallel branches with different receptive fields for multi-scale handling.
- Dai et al., "Deformable Convolutional Networks" (2017) -- Adaptive receptive fields for implicit scale handling.
- Ghiasi et al., "NAS-FPN: Learning Scalable Feature Pyramid Architecture for Object Detection" (2019) -- Neural architecture search for optimal multi-scale feature fusion.
