# Feature Pyramid Network

**One-Line Summary**: Feature Pyramid Networks (FPN) build a multi-scale feature hierarchy by combining top-down semantically strong features with bottom-up spatially precise features through lateral connections, enabling robust detection of objects at all sizes.

**Prerequisites**: Convolutional neural networks, residual networks, fast and faster R-CNN, multi-scale detection

## What Is Feature Pyramid Network?

Imagine an editor reviewing a satellite image. Looking at the full zoomed-out view, they can identify cities and highways (high-level semantics), but houses and cars are invisible. Zooming into a neighborhood reveals individual structures (spatial detail), but they lose the big-picture context. FPN is like giving the editor a set of annotated overlays: each zoom level retains both the fine detail native to that scale and the contextual understanding from the broader view.

Technically, a **Feature Pyramid Network** (Lin et al., 2017) augments a standard CNN backbone with a top-down pathway and lateral connections. The bottom-up pathway is the backbone's forward pass, producing feature maps at progressively lower resolutions. The top-down pathway upsamples coarse, semantically rich features and merges them with corresponding bottom-up maps via $1 \times 1$ convolutions, producing a pyramid of feature maps that are all semantically strong.

## How It Works

### Bottom-Up Pathway

A standard backbone (e.g., ResNet) naturally produces a feature pyramid through its stages. For ResNet, we use the output of each residual block group:

- $C_2$: stride 4, $1/4$ spatial resolution
- $C_3$: stride 8, $1/8$ spatial resolution
- $C_4$: stride 16, $1/16$ spatial resolution
- $C_5$: stride 32, $1/32$ spatial resolution

### Top-Down Pathway and Lateral Connections

Starting from the coarsest level:

1. $P_5 = \text{Conv}_{1 \times 1}(C_5)$ -- reduce $C_5$ to $d$ channels (typically $d = 256$).
2. $P_4 = \text{Conv}_{1 \times 1}(C_4) + \text{Upsample}_{2\times}(P_5)$ -- element-wise addition.
3. $P_3 = \text{Conv}_{1 \times 1}(C_3) + \text{Upsample}_{2\times}(P_4)$
4. $P_2 = \text{Conv}_{1 \times 1}(C_2) + \text{Upsample}_{2\times}(P_3)$

Each merged map is followed by a $3 \times 3$ convolution to reduce aliasing from upsampling:

$$P_l = \text{Conv}_{3 \times 3}\left(\text{Conv}_{1 \times 1}(C_l) + \text{Upsample}_{2\times}(P_{l+1})\right)$$

An additional $P_6$ level is often added via stride-2 convolution on $P_5$ for detecting very large objects.

### Scale Assignment

Objects are assigned to pyramid levels based on their area:

$$l = \lfloor l_0 + \log_2(\sqrt{wh}/224) \rfloor$$

where $l_0 = 4$ is the canonical level for an object of area $224^2$. Small objects go to finer levels ($P_2, P_3$), large objects to coarser levels ($P_4, P_5$).

### Integration with Detectors

FPN serves as a drop-in feature extractor. Each pyramid level independently feeds:
- **Faster R-CNN**: RPN anchors and RoI heads operate on the assigned level.
- **RetinaNet**: Dense classification and regression heads are applied at every level.
- **Mask R-CNN**: RoI Align extracts features from the appropriate pyramid level.

```
C2 --[1x1]--> + --[3x3]--> P2 (stride 4)
               ^
C3 --[1x1]--> + --[3x3]--> P3 (stride 8)
               ^
C4 --[1x1]--> + --[3x3]--> P4 (stride 16)
               ^
C5 --[1x1]--> + --[3x3]--> P5 (stride 32)
```

## Why It Matters

1. **FPN improved Faster R-CNN by ~8% AP on COCO** (from 33.9% to 36.2% AP with ResNet-50) with negligible extra computation.
2. **Small object detection improved dramatically** -- AP for small objects on COCO roughly doubled compared to single-scale baselines.
3. **FPN became ubiquitous**: virtually every modern detector (Mask R-CNN, RetinaNet, FCOS, DETR variants) uses FPN or a descendant.
4. **It replaced image pyramids** for multi-scale detection, avoiding the 3-4x cost of running the backbone at multiple resolutions.

## Key Technical Details

- **Channel dimension**: All pyramid levels use $d = 256$ channels, keeping memory and computation uniform.
- **Computation overhead**: FPN adds ~1-2ms to inference (negligible compared to backbone forward pass).
- **COCO results** (ResNet-101-FPN + Faster R-CNN): 36.2% AP, 59.1% AP50, 39.0% AP75.
- **Small object AP**: 18.2% AP_S with FPN vs. ~10% without, on COCO.
- **Nearest-neighbor upsampling** is used in the original paper; some variants use deconvolution or bilinear interpolation.
- **FPN variants**: PANet (2018) adds a bottom-up path on top of FPN; BiFPN (EfficientDet, 2020) uses weighted bidirectional fusion; NAS-FPN (2019) uses neural architecture search to find the fusion topology.

## Common Misconceptions

- **"FPN replaces the backbone."** FPN is built *on top of* a backbone. It does not change the backbone architecture -- it adds lateral connections and a top-down path.
- **"Higher-resolution feature maps are always better for small objects."** Without FPN's semantic enrichment, high-resolution maps ($C_2$) contain mainly low-level features (edges, textures) that are insufficient for classification. FPN's top-down pathway adds the semantic context needed.
- **"FPN adds significant computation."** The lateral connections and top-down path use $1 \times 1$ and $3 \times 3$ convolutions with only 256 channels, adding less than 5% to the backbone's FLOPs.

## Connections to Other Concepts

- **Multi-Scale Detection**: FPN is the modern answer to the image pyramid approach, providing multi-scale features without multi-scale input.
- **Fast and Faster R-CNN**: FPN is most commonly paired with Faster R-CNN's two-stage design.
- **SSD**: Also performs multi-scale detection but uses different feature maps directly from the backbone without top-down enrichment.
- **Focal Loss / RetinaNet**: RetinaNet pairs FPN with focal loss for a strong single-stage detector.
- **YOLO**: YOLOv3 and later adopted FPN-like feature fusion for multi-scale prediction.

## Further Reading

- Lin et al., "Feature Pyramid Networks for Object Detection" (2017) -- The original FPN paper.
- Liu et al., "Path Aggregation Network for Instance Segmentation" (2018) -- PANet, adding a bottom-up augmentation path to FPN.
- Tan et al., "EfficientDet: Scalable and Efficient Object Detection" (2020) -- BiFPN with weighted bidirectional feature fusion.
- Ghiasi et al., "NAS-FPN: Learning Scalable Feature Pyramid Architecture for Object Detection" (2019) -- Using NAS to discover optimal FPN topology.
