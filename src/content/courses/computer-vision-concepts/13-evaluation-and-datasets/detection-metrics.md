# Detection Metrics

**One-Line Summary**: Object detection evaluation uses mean Average Precision (mAP), computed over precision-recall curves at various IoU thresholds, with the COCO protocol (AP@[.50:.05:.95]) as the standard benchmark.

**Prerequisites**: Object Detection, Classification Metrics, Intersection over Union

## What Is Detection Metrics?

Imagine you built a model to detect pedestrians in street images. It finds 8 out of 10 actual pedestrians (recall = 80%), but 3 of its 11 detections are false alarms (precision = 73%). Now change the confidence threshold: at a stricter threshold, precision rises to 95% but recall drops to 40%. Detection metrics capture this entire precision-recall trade-off in a single number -- Average Precision (AP) -- and then average across object categories to produce mAP.

Technically, detection metrics must handle two challenges absent in classification: (1) spatial matching -- a detection is correct only if it sufficiently overlaps the ground truth (measured by IoU), and (2) multiple predictions per image -- duplicates must be penalized. The COCO evaluation protocol has become the universal standard, reporting AP at multiple IoU thresholds, object sizes, and detection counts.

## How It Works

### Intersection over Union (IoU)

IoU measures the spatial overlap between a predicted box $B_p$ and a ground-truth box $B_{gt}$:

$$IoU = \frac{|B_p \cap B_{gt}|}{|B_p \cup B_{gt}|}$$

IoU ranges from 0 (no overlap) to 1 (perfect overlap). A detection is considered a True Positive if $IoU \geq \tau$ for some threshold $\tau$.

### Matching Predictions to Ground Truth

1. Sort all detections by confidence score (descending).
2. For each detection, find the ground-truth box with highest IoU.
3. If $IoU \geq \tau$ and the ground-truth box has not already been matched, mark as TP. Otherwise, mark as FP.
4. Each ground-truth box can be matched to at most one detection. Duplicate detections of the same object are FP.

### Precision-Recall Curve

Walking through detections from highest to lowest confidence:

- After each detection, update cumulative TP and FP counts.
- $\text{Precision}_k = \frac{TP_k}{TP_k + FP_k}$
- $\text{Recall}_k = \frac{TP_k}{\text{Total Ground Truth}}$

This generates a zigzag precision-recall curve that generally trends downward (precision drops as recall increases).

### Average Precision (AP)

AP is the area under the precision-recall curve. Two interpolation methods exist:

**11-Point Interpolation** (Pascal VOC 2007): Sample precision at 11 recall values $\{0, 0.1, 0.2, ..., 1.0\}$:

$$AP = \frac{1}{11} \sum_{r \in \{0, 0.1, ..., 1.0\}} p_{interp}(r)$$

where $p_{interp}(r) = \max_{r' \geq r} p(r')$ is the maximum precision at recall $\geq r$.

**All-Point Interpolation** (Pascal VOC 2010+, COCO): Integrate the entire monotonically decreasing envelope of the PR curve:

$$AP = \sum_k (r_k - r_{k-1}) \cdot p_{interp}(r_k)$$

All-point interpolation is more precise and is the current standard. It typically produces slightly lower AP values than 11-point interpolation.

### COCO Evaluation Protocol

COCO defines the comprehensive evaluation standard used by most modern detection papers:

**Primary metric -- AP** (or mAP): Averaged over 10 IoU thresholds from 0.50 to 0.95 in steps of 0.05, then averaged over all 80 categories:

$$AP = \frac{1}{10} \sum_{\tau=0.50}^{0.95} AP_\tau$$

This is stricter than AP50 alone because it rewards precise localization.

**Additional metrics**:
- **AP50**: AP at IoU = 0.50. Lenient; rewards detection even with imprecise boxes.
- **AP75**: AP at IoU = 0.75. Stricter; requires tight localization.
- **AP_S**: AP for small objects (area < $32^2$ pixels).
- **AP_M**: AP for medium objects ($32^2$ < area < $96^2$).
- **AP_L**: AP for large objects (area > $96^2$).
- **AR_1, AR_10, AR_100**: Maximum recall given 1, 10, or 100 detections per image.

**Detection limits**: COCO evaluates at most 100 detections per image (to prevent flooding with low-confidence predictions).

### Worked Example

Consider 3 ground-truth boxes (GT1, GT2, GT3) and 5 detections sorted by confidence:

| Detection | Confidence | Best IoU | Match | TP | FP | Precision | Recall |
|-----------|-----------|----------|-------|----|----|-----------|--------|
| D1 | 0.95 | 0.82 (GT1) | TP | 1 | 0 | 1.00 | 0.33 |
| D2 | 0.88 | 0.71 (GT2) | TP | 2 | 0 | 1.00 | 0.67 |
| D3 | 0.75 | 0.30 (--) | FP | 2 | 1 | 0.67 | 0.67 |
| D4 | 0.60 | 0.65 (GT1) | FP* | 2 | 2 | 0.50 | 0.67 |
| D5 | 0.40 | 0.55 (GT3) | TP | 3 | 2 | 0.60 | 1.00 |

*D4 matches GT1, but GT1 was already matched by D1, so D4 is FP.

At IoU threshold 0.50, AP is computed from the interpolated PR curve. The monotonic envelope: at recall = 0.33, precision = 1.0; at recall = 0.67, precision = 1.0; at recall = 1.0, precision = 0.60. Approximate AP = 0.33 * 1.0 + 0.33 * 1.0 + 0.33 * 0.60 = 0.86.

### mAP: Mean over Categories

$$mAP = \frac{1}{C} \sum_{c=1}^{C} AP_c$$

where $C$ is the number of object categories. All categories contribute equally, regardless of frequency.

## Why It Matters

1. mAP is the primary metric reported in every detection paper and competition; understanding it is essential for interpreting results.
2. The gap between AP50 and AP75 reveals whether a model detects objects reliably (AP50) but localizes them poorly (low AP75).
3. AP_S is critical for safety applications (autonomous driving, surveillance) where small objects (distant pedestrians) are the hardest and most dangerous to miss.
4. The COCO evaluation protocol's rigor prevents gaming metrics with loose IoU thresholds.

## Key Technical Details

- COCO 2017 detection: 118K training images, 5K validation images, 80 object categories, ~7.3 objects per image on average.
- State-of-the-art COCO AP: ~64--66% (Co-DETR, 2023). AP50 for the same models: ~83--85%. AP75: ~70--72%.
- Pascal VOC mAP (AP50 only) saturated above 90% by 2020; COCO's multi-threshold AP remains more discriminating.
- Small object detection (AP_S) is typically 15--20 points below AP_L for the same model.
- COCO evaluation script (`pycocotools`) is the reference implementation. Always use it for COCO-compatible evaluation.
- Maximum detections per image: COCO caps at 100 (AR_100). Some papers also report AR_300 or AR_1000 for proposal evaluation.

## Common Misconceptions

- **"mAP and AP mean the same thing."** In COCO, "AP" already means averaged over categories (i.e., it is mAP). In Pascal VOC, per-class AP is reported separately. The terminology is inconsistent across the field.
- **"Higher AP50 means the model is better."** AP50 is lenient. A model with AP50 = 80% but AP75 = 40% detects objects but draws sloppy boxes. COCO AP (averaged over IoU thresholds) is more informative.
- **"mAP captures everything about detection quality."** mAP does not measure localization precision beyond the IoU thresholds, does not account for detection speed, and does not reflect performance on rare categories well (macro averaging).

## Connections to Other Concepts

- `3d-object-detection.md`: mAP is the standard evaluation metric for all detection architectures (Faster R-CNN, YOLO, DETR).
- `classification-metrics.md`: Precision, recall, and F1 are the building blocks of AP.
- `segmentation-metrics.md`: Instance segmentation uses mask AP (IoU computed on masks rather than boxes).
- `benchmark-leaderboards.md`: COCO leaderboard rankings are determined by AP, driving architectural innovation.

## Further Reading

- Everingham et al., "The Pascal Visual Object Classes (VOC) Challenge" (2010) -- Defined the original mAP protocol.
- Lin et al., "Microsoft COCO: Common Objects in Context" (2014) -- Introduced the multi-threshold COCO evaluation protocol.
- Padilla et al., "A Survey on Performance Metrics for Object-Detection Algorithms" (2020) -- Comprehensive comparison of detection metrics.
- Henderson & Ferrari, "End-to-End Training of Object Class Detectors with Mean Average Precision Loss" (2017) -- Differentiable AP for direct optimization.
