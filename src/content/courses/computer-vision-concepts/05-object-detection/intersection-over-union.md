# Intersection over Union

**One-Line Summary**: Intersection over Union (IoU) measures the overlap between two bounding boxes as the ratio of their intersection area to their union area, serving as the universal metric for evaluating localization quality in object detection.

**Prerequisites**: Bounding box representation, object detection fundamentals

## What Is Intersection over Union?

Picture two rectangles of transparent colored film laid on a table -- one red (your prediction) and one blue (the ground truth). Where they overlap, you see purple. IoU asks: what fraction of the total colored area is purple? If the rectangles are perfectly aligned, the answer is 1.0 (100% overlap). If they do not touch at all, the answer is 0.0. This single number captures how well a predicted bounding box matches the true object location.

Technically, **Intersection over Union** (also called the Jaccard index for sets) is defined as:

$$\text{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|} = \frac{\text{Area of Overlap}}{\text{Area of Union}}$$

where $A$ and $B$ are two bounding box regions. IoU ranges from 0 (no overlap) to 1 (perfect overlap). It is symmetric: $\text{IoU}(A, B) = \text{IoU}(B, A)$.

## How It Works

### Computing IoU for Axis-Aligned Boxes

Given two boxes defined by their corners:
- Box A: $(x_1^A, y_1^A, x_2^A, y_2^A)$
- Box B: $(x_1^B, y_1^B, x_2^B, y_2^B)$

**Step 1: Compute intersection coordinates**:
$$x_1^I = \max(x_1^A, x_1^B), \quad y_1^I = \max(y_1^A, y_1^B)$$
$$x_2^I = \min(x_2^A, x_2^B), \quad y_2^I = \min(y_2^A, y_2^B)$$

**Step 2: Compute intersection area**:
$$\text{Area}_I = \max(0, x_2^I - x_1^I) \times \max(0, y_2^I - y_1^I)$$

**Step 3: Compute union area**:
$$\text{Area}_U = \text{Area}_A + \text{Area}_B - \text{Area}_I$$

**Step 4: Compute IoU**:
$$\text{IoU} = \frac{\text{Area}_I}{\text{Area}_U}$$

### IoU Thresholds in Evaluation

| Threshold | Name             | Use Case                              |
|-----------|------------------|---------------------------------------|
| 0.5       | AP50             | Standard PASCAL VOC metric, lenient   |
| 0.75      | AP75             | Strict localization quality           |
| 0.5:0.95  | AP (COCO primary)| Average over 10 thresholds: 0.50, 0.55, ..., 0.95 |

A detection is a **true positive** if IoU with a matched ground-truth box exceeds the threshold and the class is correct; otherwise, it is a false positive.

### IoU as a Loss Function

Standard IoU loss for bounding box regression:
$$\mathcal{L}_{\text{IoU}} = 1 - \text{IoU}(B_{\text{pred}}, B_{\text{gt}})$$

This has a critical flaw: when boxes do not overlap ($\text{IoU} = 0$), the gradient is zero, providing no learning signal.

### Generalized IoU (GIoU, 2019)

Rezatofighi et al. addressed the zero-gradient problem:

$$\text{GIoU} = \text{IoU} - \frac{|C \setminus (A \cup B)|}{|C|}$$

where $C$ is the smallest enclosing box of $A$ and $B$. GIoU ranges from $-1$ to $1$, providing a gradient even when boxes do not overlap.

### Distance-IoU (DIoU) and Complete-IoU (CIoU, 2020)

$$\text{DIoU} = \text{IoU} - \frac{\rho^2(\mathbf{b}, \mathbf{b}^{gt})}{c^2}$$

where $\rho$ is the Euclidean distance between box centers and $c$ is the diagonal of the enclosing box.

CIoU adds an aspect ratio consistency term:
$$\text{CIoU} = \text{IoU} - \frac{\rho^2(\mathbf{b}, \mathbf{b}^{gt})}{c^2} - \alpha v$$

where $v$ measures aspect ratio consistency and $\alpha$ is a balancing parameter.

## Why It Matters

1. **IoU is the standard localization metric** used in every major detection benchmark (PASCAL VOC, COCO, Open Images, LVIS).
2. **COCO's primary metric (AP averaged over IoU 0.5:0.95)** incentivizes precise localization, not just approximate overlap.
3. **IoU-based losses (GIoU, DIoU, CIoU)** consistently outperform $L_1$ and $L_2$ box regression losses by 1-3% AP because they directly optimize the evaluation metric.
4. **IoU thresholds define what counts as a detection**, making them among the most consequential hyperparameters in the entire detection pipeline.

## Key Technical Details

- **Computation cost**: IoU between two boxes requires ~10 arithmetic operations. Pairwise IoU for $n$ boxes is $O(n^2)$.
- **Scale invariance**: IoU is invariant to box scale -- a 50% overlap at $32 \times 32$ scores the same as at $512 \times 512$.
- **GIoU loss** improves Faster R-CNN by ~1% AP and YOLOv3 by ~2-3% AP compared to smooth $L_1$ loss.
- **CIoU loss** further improves over GIoU by ~0.5-1% AP by incorporating center distance and aspect ratio.
- **PASCAL VOC uses AP50** (IoU $\geq 0.5$); COCO uses AP (averaged over 0.5:0.05:0.95), which is much stricter.
- **IoU 0.5 vs. 0.75**: A detector scoring 50% AP50 might score only 30% AP75, revealing coarse localization.

## Common Misconceptions

- **"IoU 0.5 means the prediction is 50% correct."** IoU 0.5 means 50% of the union area is shared, but the prediction may include significant background or miss part of the object. Visually, IoU 0.5 boxes can look quite misaligned.
- **"IoU is always the best matching metric."** For very small objects (e.g., $10 \times 10$ pixels), a shift of a few pixels causes a large IoU drop, even though the detection is essentially correct. Some benchmarks use pixel distance for very small objects.
- **"L1 or L2 loss on box coordinates is equivalent to IoU."** These losses treat each coordinate independently and are not scale-invariant. A 10-pixel error matters much more for a $30 \times 30$ box than a $300 \times 300$ box; IoU captures this naturally.

## Connections to Other Concepts

- `non-maximum-suppression.md`: Uses IoU to determine which overlapping boxes to suppress.
- `r-cnn.md`: IoU thresholds determine positive/negative assignment during training (e.g., IoU $\geq 0.5$ for positives, IoU $< 0.3$ for negatives).
- `detr.md`: Uses Generalized IoU in its matching cost and training loss.
- `focal-loss.md`: Training sample assignment relies on IoU between anchors and ground-truth boxes.
- `sliding-window-and-region-proposals.md`: Proposal recall is evaluated at specific IoU thresholds.

## Further Reading

- Everingham et al., "The PASCAL Visual Object Classes (VOC) Challenge" (2010) -- Established IoU-based AP evaluation for detection.
- Lin et al., "Microsoft COCO: Common Objects in Context" (2014) -- Introduced the averaged AP metric over multiple IoU thresholds.
- Rezatofighi et al., "Generalized Intersection over Union: A Metric and A Loss for Bounding Box Regression" (2019) -- GIoU.
- Zheng et al., "Distance-IoU Loss: Faster and Better Learning for Bounding Box Regression" (2020) -- DIoU and CIoU losses.
