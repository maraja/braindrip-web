# Mask R-CNN

**One-Line Summary**: Mask R-CNN extends Faster R-CNN with a parallel mask prediction branch and introduces RoIAlign for pixel-accurate feature extraction, establishing the dominant framework for instance segmentation.

**Prerequisites**: Object detection, Faster R-CNN, region proposal networks, fully convolutional networks, instance segmentation, feature pyramid networks

## What Is Mask R-CNN?

Faster R-CNN is a two-stage object detector: it proposes regions, then classifies and refines bounding boxes. Mask R-CNN asks a deceptively simple question: what if, alongside predicting "this box contains a dog," the network also predicts *exactly which pixels* inside that box belong to the dog? The answer is to add a small fully convolutional branch that outputs a binary mask for each detected region -- and to fix the feature-extraction alignment so that pixel-level predictions actually make sense.

The critical insight is that this mask branch can be trained in parallel with the existing box and class heads with minimal overhead (~20% additional compute), turning an object detector into a full instance segmentation system.

## How It Works

### Architecture Overview

```
Image -> Backbone (ResNet + FPN) -> Region Proposal Network
                                          |
                                    ~1000 proposals
                                          |
                                    RoIAlign (7x7 for box/cls, 14x14 for mask)
                                          |
                              +-----------+-----------+
                              |           |           |
                          Box Head    Class Head   Mask Head
                          (2 FC)     (softmax)    (4 conv + deconv)
                              |           |           |
                          Bbox offsets  Class probs  28x28 binary mask
                                                    (per class)
```

### RoIAlign: The Key Innovation

**The problem with RoIPool**: Faster R-CNN's RoI Pooling quantizes floating-point region coordinates to integer grid positions, then quantizes again when dividing the region into pooling bins. Each quantization introduces misalignment of up to 0.5 pixels. For bounding box regression, this is tolerable. For pixel-level masks, it is catastrophic -- the feature map does not actually correspond to the spatial location it claims to represent.

**RoIAlign solution**: instead of snapping to grid positions, RoIAlign computes the exact floating-point coordinates of each sampling point within each bin and uses **bilinear interpolation** to compute the feature value at that precise location.

For each bin in the output:
1. Compute the exact floating-point boundaries of the bin within the feature map.
2. Sample at 4 regularly spaced points within the bin (2x2 grid).
3. Bilinear interpolate the feature map at each sample point.
4. Average (or max) pool the 4 samples to get the bin output.

$$\text{RoIAlign}(x, y) = \sum_{i,j} \max(0, 1-|x - x_i|) \cdot \max(0, 1-|y - y_j|) \cdot f(x_i, y_j)$$

This eliminates all quantization. The improvement: **+3 mask AP** and **+0.5 box AP** on COCO compared to RoIPool.

### Mask Head Design

The mask branch is a small FCN applied to each RoI:
- 4 consecutive 3x3 convolutions with 256 channels (each followed by ReLU).
- 1 transposed convolution (2x2, stride 2) that upsamples from 14x14 to 28x28.
- 1x1 convolution producing $C$ channels (one per class).
- Output: $28 \times 28 \times C$ -- a binary mask for each of the $C$ classes.

### Decoupled Mask and Classification

A crucial design choice: the mask head predicts a *separate binary mask for each class*, and only the mask corresponding to the predicted class is used. The mask loss is:

$$\mathcal{L}_{\text{mask}} = -\frac{1}{m^2} \sum_{i,j} \left[ y_{i,j} \log \hat{p}_{i,j}^{(c^*)} + (1 - y_{i,j}) \log (1 - \hat{p}_{i,j}^{(c^*)}) \right]$$

where $c^*$ is the ground-truth class, $m = 28$ is the mask resolution, and $\hat{p}^{(c^*)}$ is the predicted mask for class $c^*$.

This decoupling avoids competition between classes within the mask prediction and was shown to improve AP by ~4 points compared to a multi-class (softmax) mask formulation.

### Full Training Loss

$$\mathcal{L} = \mathcal{L}_{\text{cls}} + \mathcal{L}_{\text{box}} + \mathcal{L}_{\text{mask}}$$

All three losses are computed only on positive (matched) proposals. The mask loss adds negligible overhead since the mask head is lightweight.

### Training Recipe

- Backbone: ResNet-50 or ResNet-101 with FPN, pretrained on ImageNet.
- Input: images resized so the shorter edge is 800 pixels.
- Batch size: 16 images (2 per GPU on 8 GPUs).
- Learning rate: 0.02, reduced by 10x at 60k and 80k iterations (90k total for COCO ~12 epochs).
- Weight decay: $10^{-4}$, momentum: 0.9.
- 512 RoIs sampled per image (positive:negative ratio 1:3).

## Why It Matters

1. **Unified detection + segmentation**: by adding a mask branch to an existing detector, Mask R-CNN showed that instance segmentation need not be a fundamentally different problem from detection.
2. **RoIAlign became standard**: the bilinear-interpolation-based pooling is now used in virtually all region-based architectures, not just for masks but also for improved box prediction.
3. **Extensible framework**: Mask R-CNN has been extended to keypoint detection (predicting human joint locations), 3D mesh prediction, and video instance segmentation.
4. **Industrial adoption**: Mask R-CNN variants power production systems in autonomous driving (Waymo, Cruise), aerial imagery analysis, medical imaging, and augmented reality.
5. **Benchmark standard**: for years, Mask R-CNN with various backbones was the default baseline on COCO instance segmentation.

## Key Technical Details

- Mask R-CNN with ResNet-50-FPN: 37.1 mask AP on COCO test-dev (original 2017 paper).
- Mask R-CNN with ResNet-101-FPN: 38.2 mask AP. With ResNeXt-101-FPN: 39.8 mask AP.
- Inference speed: ~5 FPS on a V100 at 1333x800 resolution with ResNet-101-FPN. The mask head adds only ~15ms per image on top of Faster R-CNN.
- RoIAlign uses 4 sampling points per bin (2x2 regular grid). More points give diminishing returns.
- The 28x28 mask resolution is a sweet spot: 14x14 loses boundary detail, 56x56 provides marginal gains with significant compute increase.
- FPN (Feature Pyramid Network) is essential: it assigns proposals to the appropriate pyramid level based on their size, ensuring small objects get high-resolution features.
- Mask R-CNN can also predict keypoints by replacing the mask head with a keypoint head (predicting $K$ heatmaps for $K$ keypoints). With ResNet-50-FPN, this achieves 65.0 keypoint AP on COCO.

## Common Misconceptions

- **"Mask R-CNN is slow because it processes each region independently."** While it is not single-shot, the shared backbone computes features once, and the per-RoI heads are lightweight. The overhead of the mask branch over Faster R-CNN is ~20%, not 2x.
- **"The mask branch needs ground-truth boxes during training."** During training, the mask loss is computed on proposals matched to ground-truth boxes (IoU > 0.5), not on the ground-truth boxes themselves. This is standard proposal-based training.
- **"RoIAlign only helps masks."** RoIAlign also improves box AP by ~0.5 points and is beneficial for any task requiring spatially precise feature pooling, including keypoint detection.
- **"28x28 masks are too coarse."** The 28x28 prediction is bilinearly upsampled to the bounding box dimensions, which can be hundreds of pixels. The interpolation produces visually smooth masks for most objects. For truly pixel-precise boundaries, methods like PointRend refine selected points.

## Connections to Other Concepts

- `instance-segmentation.md`: Mask R-CNN is the canonical top-down approach to this task.
- `fully-convolutional-networks.md`: the mask head is itself a small FCN operating on pooled features.
- `panoptic-segmentation.md`: Panoptic FPN extends Mask R-CNN's FPN with a semantic segmentation branch for stuff classes.
- `segment-anything.md`: SAM can be viewed as a generalized promptable mask prediction system, whereas Mask R-CNN couples detection with mask prediction.
- `deeplab-and-atrous-convolution.md`: an alternative paradigm that avoids region proposals entirely, addressing segmentation as a dense prediction problem.

## Further Reading

- He et al., "Mask R-CNN" (2017) -- The original paper; foundational for modern instance segmentation.
- Lin et al., "Feature Pyramid Networks for Object Detection" (2017) -- FPN, essential to Mask R-CNN's multi-scale handling.
- Kirillov et al., "PointRend: Image Segmentation as Rendering" (2020) -- Refines Mask R-CNN's coarse masks at adaptively selected boundary points.
- Cai and Vasconcelos, "Cascade R-CNN" (2018) -- Multi-stage refinement that improves both box and mask quality when combined with Mask R-CNN.
- Wu et al., "Detectron2" (2019) -- Facebook AI's open-source library implementing Mask R-CNN and variants; the reference implementation.
