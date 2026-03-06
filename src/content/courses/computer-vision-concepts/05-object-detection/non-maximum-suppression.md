# Non-Maximum Suppression

**One-Line Summary**: Non-maximum suppression (NMS) is a greedy post-processing algorithm that removes duplicate detections by iteratively keeping the highest-scoring box and discarding all boxes that overlap with it above an IoU threshold.

**Prerequisites**: Intersection over union, bounding box regression, object detection fundamentals

## What Is Non-Maximum Suppression?

Imagine a crowd of reporters shouting out sightings of the same celebrity. Ten reporters point to roughly the same spot: "There! There! Over there!" NMS is the editor who listens to the most confident reporter first, silences everyone who is pointing in essentially the same direction, then moves on to the next-most-confident reporter pointing somewhere different. The result is one clean report per actual celebrity sighting instead of a cacophony of duplicates.

Technically, **non-maximum suppression** takes a set of overlapping bounding box predictions (each with a confidence score), selects the highest-scoring box, removes all other boxes whose Intersection over Union (IoU) with the selected box exceeds a threshold (commonly 0.5), and repeats until no boxes remain. It is applied independently per class.

## How It Works

### The Greedy NMS Algorithm

```
Input:  B = list of boxes, S = list of scores, threshold = IoU threshold
Output: D = list of final detections

1. Sort B by S in descending order.
2. Initialize D = empty list.
3. While B is not empty:
   a. Take the box b_i with the highest score, add it to D.
   b. Remove b_i from B.
   c. For each remaining box b_j in B:
      - Compute IoU(b_i, b_j).
      - If IoU(b_i, b_j) > threshold, remove b_j from B.
4. Return D.
```

**Time complexity**: $O(n^2)$ in the number of boxes (pairwise IoU computation), though in practice $n$ is small after score thresholding (typically a few hundred per class).

### IoU Threshold Selection

- **$\tau = 0.5$**: Standard choice. Removes clearly overlapping boxes while tolerating some spatial imprecision.
- **$\tau = 0.3$**: More aggressive suppression. Better for non-overlapping objects but risks removing valid detections of nearby objects.
- **$\tau = 0.7$**: Permissive. Retains more boxes, useful when objects frequently overlap (e.g., pedestrians in crowds).

### Soft-NMS (2017)

Bodla et al. observed that hard NMS can accidentally suppress valid detections when objects genuinely overlap (e.g., two people standing close together). Soft-NMS replaces the hard removal step with a score decay:

**Linear decay**:
$$s_j = \begin{cases} s_j (1 - \text{IoU}(b_i, b_j)) & \text{if IoU}(b_i, b_j) > \tau \\ s_j & \text{otherwise} \end{cases}$$

**Gaussian decay** (more common):
$$s_j = s_j \cdot \exp\left(-\frac{\text{IoU}(b_i, b_j)^2}{\sigma}\right)$$

where $\sigma$ controls the decay rate (typically $\sigma = 0.5$). Boxes are removed only when their decayed score falls below a minimum threshold.

Soft-NMS improves AP by ~1-2% on COCO with no retraining required.

### DIoU-NMS (2020)

Zheng et al. proposed replacing IoU with Distance-IoU in the suppression criterion:

$$\text{DIoU} = \text{IoU} - \frac{\rho^2(\mathbf{b}, \mathbf{b}^{gt})}{c^2}$$

where $\rho$ is the Euclidean distance between box centers and $c$ is the diagonal of the smallest enclosing box. This considers center distance in addition to overlap, better handling occluded objects.

### NMS Variants in Practice

| Variant      | Suppression Rule              | Typical Gain |
|--------------|-------------------------------|--------------|
| Greedy NMS   | Hard removal at IoU > $\tau$  | Baseline     |
| Soft-NMS     | Gaussian score decay          | +1-2% AP     |
| DIoU-NMS     | Distance-aware suppression    | +0.5-1% AP   |
| Adaptive NMS | Per-object density threshold  | +1% AP dense |
| Weighted NMS | Score-weighted box merging    | +0.5% AP     |

## Why It Matters

1. **NMS is essential for virtually every detector** (except DETR). Without it, detectors produce dozens of overlapping boxes per object, making output unusable.
2. **The IoU threshold is a critical hyperparameter** that directly affects precision-recall tradeoff: too low causes missed detections, too high causes duplicates.
3. **Soft-NMS provides a simple, training-free improvement** that is now widely adopted as a drop-in replacement.
4. **NMS is a computational bottleneck in real-time systems** because it is sequential (each suppression decision depends on previous ones), limiting GPU parallelization.

## Key Technical Details

- **Standard threshold**: $\tau = 0.5$ for most benchmarks; some competitions use $\tau = 0.3$.
- **Per-class application**: NMS is typically run independently for each class, which means a person box and a car box at the same location are both kept.
- **Score pre-filtering**: Before NMS, detections with confidence below a threshold (e.g., 0.05) are removed to reduce computation.
- **Soft-NMS ($\sigma = 0.5$)**: +1.7% AP on COCO for Faster R-CNN, +1.3% AP for R-FCN (Bodla et al., 2017).
- **Speed**: Greedy NMS on 1,000 boxes takes ~0.5-1ms on CPU, but batched GPU implementations (e.g., torchvision.ops.nms) run in ~0.1ms.
- **DETR eliminates NMS** by using set-based prediction with bipartite matching -- a fundamentally different approach.

## Common Misconceptions

- **"NMS is a simple, solved problem."** NMS introduces a hard threshold that inevitably trades off between removing duplicates and preserving detections of nearby objects. This is an active research area, with learned NMS methods (e.g., Relation Networks for NMS) exploring end-to-end alternatives.
- **"A higher NMS threshold always helps."** A higher threshold retains more boxes, improving recall for overlapping objects but also increasing false positives. The optimal threshold depends heavily on the application and dataset.
- **"NMS only matters for two-stage detectors."** Single-stage detectors (YOLO, SSD, RetinaNet) also require NMS. Even anchor-free detectors like FCOS use NMS. Only DETR-family detectors avoid it entirely.

## Connections to Other Concepts

- **Intersection over Union**: The core metric used by NMS to measure box overlap.
- **R-CNN / Fast and Faster R-CNN**: All R-CNN variants rely on NMS for final detection output.
- **YOLO / SSD**: Single-stage detectors apply NMS per-class as a final post-processing step.
- **DETR**: The first major detector to eliminate NMS through set-based prediction.
- **Anchor-Free Detection**: FCOS requires NMS; CenterNet replaces it with heatmap peak extraction.

## Further Reading

- Neubeck and Van Gool, "Efficient Non-Maximum Suppression" (2006) -- Early analysis of NMS algorithms and their computational properties.
- Bodla et al., "Soft-NMS -- Improving Object Detection With One Line of Code" (2017) -- Soft-NMS with Gaussian score decay.
- Zheng et al., "Distance-IoU Loss: Faster and Better Learning for Bounding Box Regression" (2020) -- DIoU-NMS using center distance.
- Hu et al., "Relation Networks for Object Detection" (2018) -- Learning NMS-like duplicate removal end-to-end.
- Hosang et al., "Learning Non-Maximum Suppression" (2017) -- Replacing hand-crafted NMS with a learned network.
