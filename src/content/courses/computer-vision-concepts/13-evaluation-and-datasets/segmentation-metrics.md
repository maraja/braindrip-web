# Segmentation Metrics

**One-Line Summary**: Segmentation is evaluated using mean Intersection over Union (mIoU) for semantic tasks, Dice/F1 for medical imaging, pixel accuracy for basic assessment, and Panoptic Quality (PQ = SQ x RQ) for unified panoptic evaluation.

**Prerequisites**: Image Segmentation, Classification Metrics, Intersection over Union

## What Is Segmentation Metrics?

Imagine coloring every pixel in a photo -- sky blue, road gray, car red, person green. Now compare your coloring to the answer key. Segmentation metrics quantify how well your pixel-level coloring matches the ground truth. Unlike detection (which evaluates bounding boxes), segmentation evaluates per-pixel or per-region predictions, requiring metrics that handle spatial overlap, boundary precision, and the distinction between "stuff" (amorphous regions like sky) and "things" (countable objects like cars).

Technically, segmentation metrics operate on prediction masks and ground-truth masks. The choice of metric depends on the segmentation task: semantic (per-pixel class labels), instance (separate mask per object), or panoptic (unified stuff + things).

## How It Works

### Pixel Accuracy

The simplest metric: fraction of correctly classified pixels.

$$\text{Pixel Accuracy} = \frac{\sum_i n_{ii}}{\sum_i t_i}$$

where $n_{ii}$ is the number of pixels of class $i$ correctly predicted, and $t_i$ is the total number of pixels of class $i$.

**Limitation**: Dominated by large classes. If "background" covers 90% of pixels, a model predicting all pixels as background achieves 90% pixel accuracy while completely failing on objects.

### Mean Intersection over Union (mIoU)

The standard metric for semantic segmentation. For each class $c$, compute the IoU between predicted and ground-truth pixel sets:

$$IoU_c = \frac{|P_c \cap G_c|}{|P_c \cup G_c|} = \frac{TP_c}{TP_c + FP_c + FN_c}$$

Then average across all $C$ classes:

$$mIoU = \frac{1}{C} \sum_{c=1}^{C} IoU_c$$

mIoU treats all classes equally (macro average), so rare classes have equal influence. This is desirable because rare classes (e.g., bicyclists in driving scenes) are often the most safety-critical.

**Frequency-Weighted IoU (FWIoU)**: Weights each class by its pixel frequency:

$$FWIoU = \frac{1}{\sum_i t_i} \sum_c t_c \cdot IoU_c$$

Less common than mIoU; mostly used when large-area classes matter most.

### Dice Coefficient / F1 Score

The Dice coefficient is equivalent to the F1 score computed at the pixel level:

$$Dice_c = \frac{2 |P_c \cap G_c|}{|P_c| + |G_c|} = \frac{2 \cdot TP_c}{2 \cdot TP_c + FP_c + FN_c}$$

The relationship to IoU: $Dice = \frac{2 \cdot IoU}{1 + IoU}$. Dice is always $\geq$ IoU for the same prediction.

Dice is the dominant metric in medical image segmentation because:
1. It directly corresponds to the Dice loss used during training.
2. Values are slightly higher than IoU (e.g., IoU = 0.75 corresponds to Dice = 0.857), which some argue provides finer discrimination in the high-performance range.
3. Historical convention in the medical imaging community.

### Boundary Metrics

Standard mIoU and Dice can be insensitive to boundary quality -- a prediction that is 2 pixels off everywhere gets nearly the same score as a perfect one.

**Boundary IoU** (Cheng et al., 2021): Computes IoU only within a narrow band ($d$ pixels) around the ground-truth boundary. With $d = 2$, it highlights boundary precision that mIoU misses. Boundary IoU is typically 10--20 points lower than standard mIoU.

**Hausdorff Distance**: The maximum distance from any point on one boundary to the nearest point on the other:

$$HD(P, G) = \max\left(\max_{p \in \partial P} \min_{g \in \partial G} d(p,g), \; \max_{g \in \partial G} \min_{p \in \partial P} d(g,p)\right)$$

Sensitive to outliers; the 95th percentile Hausdorff distance (HD95) is more robust and commonly used in medical imaging. Values in pixels; lower is better.

### Instance Segmentation Metrics

Instance segmentation uses **mask AP** -- the same COCO AP protocol as detection, but IoU is computed between predicted and ground-truth masks instead of bounding boxes.

$$IoU_{mask} = \frac{|M_p \cap M_{gt}|}{|M_p \cup M_{gt}|}$$

COCO mask AP is evaluated at IoU thresholds 0.50 to 0.95 (same as box AP). State-of-the-art: ~50--53% mask AP on COCO (Mask2Former, 2022).

### Panoptic Quality (PQ)

Panoptic segmentation unifies semantic and instance segmentation. PQ (Kirillov et al., 2019) evaluates both recognition and segmentation quality:

$$PQ = \underbrace{\frac{\sum_{(p,g) \in TP} IoU(p,g)}{|TP|}}_{\text{SQ (Segmentation Quality)}} \times \underbrace{\frac{|TP|}{|TP| + \frac{1}{2}|FP| + \frac{1}{2}|FN|}}_{\text{RQ (Recognition Quality)}}$$

- **SQ**: Average IoU of matched segments. Measures segmentation precision (how well matched segments align).
- **RQ**: F1 score of segment matching. Measures detection/recognition quality (how many segments are correctly found).
- **PQ = SQ x RQ**: Decomposes into "how well did you segment?" and "how many did you find?"

Matching: A predicted segment is a TP if it has IoU > 0.5 with a ground-truth segment (with a unique 1:1 matching). PQ is computed per-class and averaged.

**PQ for Stuff vs. Things**: PQ_Th (things -- countable objects) and PQ_St (stuff -- amorphous regions) are reported separately, as they pose different challenges.

## Why It Matters

1. mIoU is reported in every semantic segmentation paper; understanding its properties is essential for interpreting results.
2. The choice between mIoU and Dice has practical implications: optimizing Dice loss vs. cross-entropy loss leads to measurably different boundary quality.
3. Panoptic Quality's SQ/RQ decomposition reveals whether a model fails at detection (low RQ) or segmentation (low SQ), guiding targeted improvements.
4. Boundary metrics are critical for applications requiring precise delineation (medical organ segmentation, satellite image analysis).

## Key Technical Details

- ADE20K benchmark (150 classes): state-of-the-art mIoU ~62--64% (Mask2Former, SegGPT). Human agreement mIoU: ~82%.
- Cityscapes (19 classes): state-of-the-art mIoU ~86% (InternImage, 2023). Pixel accuracy: ~98%.
- COCO panoptic (133 classes): state-of-the-art PQ ~60--63%. PQ_Th ~65%, PQ_St ~55%.
- Medical segmentation Dice scores: liver ~0.96, kidney ~0.95, lung tumors ~0.70, brain tumors ~0.85 (BraTS challenge).
- mIoU is undefined for classes absent from both prediction and ground truth; such classes are excluded from the average.
- HD95 for organ segmentation: <5 mm is considered clinically acceptable for most organs.

## Common Misconceptions

- **"Pixel accuracy is a good segmentation metric."** Pixel accuracy is dominated by majority classes and can be >95% even when small objects are completely missed. Always use mIoU or Dice as the primary metric.
- **"Dice and IoU rank models the same way."** While monotonically related for a single class, their averages across classes can produce different rankings because Dice compresses the scale at high values.
- **"PQ > 0.5 means good panoptic segmentation."** PQ values are generally lower than mIoU or Dice because PQ penalizes both missed detections (via RQ) and imprecise masks (via SQ). State-of-the-art PQ on COCO is ~60%, which represents strong performance.

## Connections to Other Concepts

- **Image Segmentation**: mIoU and Dice are the primary training and evaluation metrics for all segmentation architectures.
- **Detection Metrics**: Mask AP applies the COCO detection protocol to instance masks. PQ's RQ component is essentially an F1 score.
- **Classification Metrics**: Pixel-level precision, recall, and F1 are the building blocks of segmentation metrics.
- **Medical Image Analysis**: Dice coefficient and HD95 are the standard metrics in medical segmentation challenges (BraTS, KiTS, ACDC).

## Further Reading

- Long et al., "Fully Convolutional Networks for Semantic Segmentation" (2015) -- Established mIoU as the standard metric via Pascal VOC evaluation.
- Kirillov et al., "Panoptic Segmentation" (2019) -- Defined PQ and the panoptic evaluation protocol.
- Cheng et al., "Boundary IoU: Improving Object-Centric Image Segmentation Evaluation" (2021) -- Proposed boundary-aware metrics.
- Reinke et al., "Common Limitations of Image Processing Metrics" (2024) -- Comprehensive analysis of metric pitfalls in medical image segmentation.
