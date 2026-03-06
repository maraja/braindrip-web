# Instance Segmentation

**One-Line Summary**: Instance segmentation combines object detection and semantic segmentation to produce pixel-level masks for each *individual* object instance in an image, distinguishing between separate objects of the same class.

**Prerequisites**: Semantic segmentation, object detection (bounding boxes), fully convolutional networks, region proposal networks, non-maximum suppression

## What Is Instance Segmentation?

Suppose you are photographing a crowded parking lot. Semantic segmentation tells you which pixels are "car" -- but every car pixel gets the same label, so you cannot tell where one car ends and the next begins. Object detection draws a bounding box around each car, but bounding boxes include background and overlap with neighboring vehicles. Instance segmentation gives you the best of both: a separate, precise pixel mask for each individual car.

Formally, the task requires predicting a set $\{(m_k, c_k, s_k)\}_{k=1}^{K}$ where $m_k \in \{0,1\}^{H \times W}$ is a binary mask for instance $k$, $c_k$ is its class label, and $s_k$ is a confidence score. Unlike semantic segmentation, the number of outputs $K$ varies per image. Unlike detection, the output is a pixel mask rather than a bounding box.

## How It Works

### Two Paradigms

**Top-down (detect-then-segment)**:
1. Run an object detector (e.g., Faster R-CNN) to produce bounding-box proposals.
2. For each proposal, predict a binary mask within the box region.
3. The detector handles instance separation; the mask head handles pixel-level detail.
4. Examples: Mask R-CNN, Cascade Mask R-CNN, HTC.

**Bottom-up (segment-then-group)**:
1. Predict per-pixel embeddings or intermediate representations.
2. Group pixels into instances using clustering, associative embeddings, or watershed-like algorithms.
3. No explicit detection step -- instances emerge from pixel grouping.
4. Examples: Associative Embedding (Newell et al., 2017), SOLO/SOLOv2.

**Hybrid / query-based**:
1. Use a set of learned queries that each attend to and predict one instance.
2. Each query produces a class label, a confidence score, and a mask.
3. Examples: Mask2Former, QueryInst.

### Top-Down Pipeline (Mask R-CNN Style)

```
Image -> Backbone (ResNet/FPN) -> Region Proposal Network -> RoI proposals
                                                                |
                                                          RoIAlign (pool to 14x14 or 28x28)
                                                                |
                                                     +----+----+----+
                                                     |    |         |
                                                  Box head  Class head  Mask head (FCN)
                                                     |    |         |
                                                  bbox  class   28x28 binary mask
```

The mask head is a small fully convolutional network (typically 4 conv layers + 1 transposed conv) that predicts a $28 \times 28$ binary mask per class. The mask is then resized to the detected bounding box region.

### Loss Function

Instance segmentation losses combine detection and mask terms:

$$\mathcal{L} = \mathcal{L}_{\text{cls}} + \mathcal{L}_{\text{box}} + \mathcal{L}_{\text{mask}}$$

- $\mathcal{L}_{\text{cls}}$: classification loss (cross-entropy) for the detected class.
- $\mathcal{L}_{\text{box}}$: bounding box regression loss (smooth L1 or GIoU).
- $\mathcal{L}_{\text{mask}}$: per-pixel binary cross-entropy on the $28 \times 28$ mask, computed *only* for the ground-truth class channel, decoupling mask prediction from classification.

### Evaluation: COCO Metrics

The standard benchmark is MS COCO, using **mask AP** (average precision over IoU thresholds 0.50:0.05:0.95):

- **AP**: primary metric, averaged over IoU thresholds and all 80 classes.
- **AP$_{50}$**: AP at IoU threshold 0.50 (lenient).
- **AP$_{75}$**: AP at IoU threshold 0.75 (strict).
- **AP$_S$, AP$_M$, AP$_L$**: AP for small (<32x32), medium (32-96), and large (>96x96) objects.

## Why It Matters

1. **Autonomous driving**: knowing that there are three separate pedestrians -- not just "pedestrian pixels" -- is critical for trajectory prediction and collision avoidance.
2. **Robotics**: a robot picking objects from a bin needs to know each object's exact shape and boundary to plan a grasp, not just the class.
3. **Video analysis**: instance masks enable per-object tracking through video (track each person or car independently).
4. **Medical imaging**: counting and measuring individual cells, lesions, or nodules requires instance-level separation.
5. **Content creation**: selecting and editing individual objects in photos (remove this person but not that one) requires instance-level masks.

## Key Technical Details

- COCO instance segmentation has 80 "thing" categories (countable objects like person, car, dog).
- Mask R-CNN achieves ~37 mask AP on COCO test-dev with a ResNet-101-FPN backbone. Recent models like Mask2Former reach ~50 mask AP.
- Mask resolution is typically 28x28 in Mask R-CNN, upsampled to the box region. PointRend (2020) refines masks at adaptively selected points, improving boundary quality.
- Inference speed for Mask R-CNN with ResNet-50-FPN is approximately 5 FPS on a V100 GPU at 1333x800 resolution. Lightweight variants (YOLACT) achieve 30+ FPS.
- Instance overlap: unlike semantic segmentation, instance masks can overlap in the prediction (e.g., a person riding a horse). The evaluation handles this through per-instance IoU matching.
- NMS or soft-NMS is applied to remove duplicate detections before mask output.

## Common Misconceptions

- **"Instance segmentation is just semantic segmentation with separate colors."** It is fundamentally harder because the number of instances is unknown and variable, requiring either detection or learned grouping mechanisms.
- **"You need bounding boxes to do instance segmentation."** Bottom-up methods (SOLO, associative embedding) and query-based methods (Mask2Former) can produce instance masks without explicit bounding box predictions.
- **"Instance segmentation handles all pixel labeling."** It only labels "thing" classes -- discrete, countable objects. Amorphous "stuff" (sky, road, grass) requires semantic segmentation. Panoptic segmentation unifies both.

## Connections to Other Concepts

- **Semantic Segmentation**: labels every pixel but does not distinguish instances. Instance segmentation adds the instance-separation requirement.
- **Mask R-CNN**: the most influential top-down instance segmentation architecture.
- **Panoptic Segmentation**: combines instance segmentation (for things) with semantic segmentation (for stuff) into a unified output.
- **Segment Anything**: SAM produces class-agnostic instance masks that can serve as proposals for downstream instance segmentation.
- **Fully Convolutional Networks**: the mask prediction head in top-down approaches is itself a small FCN.

## Further Reading

- He et al., "Mask R-CNN" (2017) -- Defined the modern top-down instance segmentation pipeline.
- Bolya et al., "YOLACT: Real-time Instance Segmentation" (2019) -- One-stage instance segmentation at 30+ FPS.
- Wang et al., "SOLO: Segmenting Objects by Locations" (2020) -- Box-free, single-stage instance segmentation.
- Cheng et al., "Masked-attention Mask Transformer for Universal Image Segmentation" (Mask2Former, 2022) -- Unified query-based architecture achieving state-of-the-art on instance, semantic, and panoptic segmentation.
- Kirillov et al., "PointRend: Image Segmentation as Rendering" (2020) -- Adaptive refinement of mask boundaries at selected points.
