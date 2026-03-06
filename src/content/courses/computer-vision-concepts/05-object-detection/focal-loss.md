# Focal Loss

**One-Line Summary**: Focal loss down-weights the contribution of easy, well-classified examples during training by applying a modulating factor $(1 - p_t)^\gamma$, solving the extreme foreground-background class imbalance that limits single-stage detector accuracy.

**Prerequisites**: Cross-entropy loss, single-stage detection (SSD, YOLO), class imbalance, anchor boxes, feature pyramid network

## What Is Focal Loss?

In a typical image, a single-stage detector evaluates tens of thousands of anchor locations, but only a handful (perhaps 10-50) contain actual objects. The rest are background. Standard cross-entropy loss treats every example equally, so the overwhelming majority of easy background examples dominate the loss and gradients, drowning out the signal from the rare, hard foreground examples. It is like trying to learn a new song in a stadium where 99,000 fans are humming a simple tune and only 1,000 are singing the complex melody you need to learn.

Focal loss turns down the volume on those 99,000 easy hummers. Technically, **focal loss** (Lin et al., 2017) modifies the standard cross-entropy loss with a factor $(1 - p_t)^\gamma$ that smoothly reduces the loss contribution from confidently classified (easy) examples, focusing training on the hard, misclassified examples that matter most.

## How It Works

### Standard Cross-Entropy

For a binary classification with probability $p$ of the correct class:

$$\text{CE}(p_t) = -\log(p_t)$$

where $p_t = p$ if the example is positive, and $p_t = 1 - p$ otherwise.

The problem: when a background anchor is classified correctly with $p_t = 0.9$, the loss is $-\log(0.9) \approx 0.105$. With 100,000 such examples, these easy negatives contribute $\sim 10,500$ to the total loss, overwhelming the few hundred hard examples.

### Balanced Cross-Entropy

A common first attempt: weight positive and negative examples by a factor $\alpha_t$:

$$\text{CE}_{\text{balanced}} = -\alpha_t \log(p_t)$$

This addresses the imbalance in number of positives vs. negatives but does not distinguish between easy and hard examples.

### Focal Loss Definition

$$\text{FL}(p_t) = -\alpha_t (1 - p_t)^\gamma \log(p_t)$$

The **modulating factor** $(1 - p_t)^\gamma$ has two key properties:
1. When an example is misclassified ($p_t$ is small), the factor approaches 1, and the loss is unaffected.
2. When an example is well-classified ($p_t \to 1$), the factor approaches 0, down-weighting the loss.

### Effect of $\gamma$ (Focusing Parameter)

| $\gamma$ | Easy example ($p_t = 0.9$) loss reduction | Behavior |
|-----------|-------------------------------------------|----------|
| 0         | 1x (standard CE)                          | No focusing |
| 1         | ~10x reduction                            | Mild focusing |
| 2         | ~100x reduction                           | Standard choice |
| 5         | ~100,000x reduction                       | Aggressive focusing |

At $\gamma = 2$ (the recommended value), an example with $p_t = 0.9$ has its loss reduced by a factor of 100 compared to CE. An example with $p_t = 0.5$ is only reduced by 4x.

### RetinaNet Architecture

Focal loss was introduced alongside **RetinaNet**, a single-stage detector designed to demonstrate that class imbalance (not architecture) was the reason single-stage detectors lagged behind two-stage ones:

- **Backbone**: ResNet + FPN producing feature maps at 5 scales ($P_3$ through $P_7$).
- **Anchor configuration**: 9 anchors per location (3 scales $\times$ 3 aspect ratios), for ~100K anchors total.
- **Classification subnet**: 4 conv layers ($3 \times 3$, 256 channels) + sigmoid output per anchor per class.
- **Regression subnet**: Same architecture, predicting 4 box offsets per anchor.

Both subnets are shared across all FPN levels but have separate parameters.

### Training Details

- **$\gamma = 2$, $\alpha = 0.25$**: Optimal values found by grid search on COCO val.
- **Initialization bias**: The classification subnet's final layer bias is initialized to $b = -\log((1 - \pi)/\pi)$ where $\pi = 0.01$, ensuring the model starts by predicting low probability for all anchors. This prevents the massive initial loss from the ~100K negative anchors from destabilizing early training.
- **No hard negative mining**: Unlike SSD, focal loss naturally handles the imbalance without explicit sampling strategies.

## Why It Matters

1. **RetinaNet with focal loss achieved 39.1% AP on COCO** (ResNet-101-FPN), surpassing all existing two-stage detectors at the time (Faster R-CNN + FPN: ~36% AP).
2. **It definitively proved** that the accuracy gap between single-stage and two-stage detectors was caused by class imbalance during training, not architectural inferiority.
3. **Focal loss is architecture-agnostic** and has been adopted in segmentation, medical imaging, NLP, and any task with severe class imbalance.
4. **The initialization bias trick** is now standard practice in anchor-based detectors to stabilize early training.

## Key Technical Details

- **RetinaNet (ResNet-50-FPN)**: 35.7% AP on COCO at ~8 FPS. (ResNet-101-FPN): 39.1% AP at ~5 FPS.
- **$\gamma$ sensitivity**: AP varies from 31.1% ($\gamma = 0$, standard CE) to 36.0% ($\gamma = 2$) on ResNet-50, a +4.9% AP gain from focal loss alone.
- **$\alpha$ interaction**: The optimal $\alpha$ decreases as $\gamma$ increases (from $\alpha = 0.75$ at $\gamma = 0$ to $\alpha = 0.25$ at $\gamma = 2$) because focal loss already down-weights easy negatives.
- **Comparison with OHEM**: Online Hard Example Mining (OHEM) achieves 32.8% AP; focal loss achieves 36.0% AP on the same architecture, demonstrating that smooth re-weighting outperforms hard thresholding.
- **Number of anchors**: ~100K per image, of which ~99.9% are negatives. Only ~10-50 anchors have IoU $\geq 0.5$ with ground-truth.

## Common Misconceptions

- **"Focal loss only works for object detection."** It is widely applicable to any classification task with class imbalance. It has been used in semantic segmentation (medical imaging), text classification, and anomaly detection.
- **"$\gamma = 2$ is always optimal."** The best $\gamma$ depends on the degree of class imbalance and the difficulty distribution. For tasks with less extreme imbalance, lower $\gamma$ values may work better.
- **"Focal loss replaces hard negative mining entirely."** While focal loss eliminates the need for explicit sampling (as in SSD's 3:1 negative mining), some methods still benefit from combining focal loss with mining strategies in specific scenarios.
- **"Two-stage detectors don't have the class imbalance problem."** They do, but the RPN pre-filters proposals to ~300, and the second stage uses balanced sampling (1:3 positive:negative ratio), effectively managing the imbalance architecturally rather than through the loss function.

## Connections to Other Concepts

- **SSD**: Uses hard negative mining (3:1 ratio) to handle class imbalance; focal loss provides a smoother, more effective alternative.
- **YOLO**: Also suffers from class imbalance; later YOLO versions incorporate focal-loss-like objectives.
- **Feature Pyramid Network**: RetinaNet's backbone, enabling multi-scale anchor placement.
- **Fast and Faster R-CNN**: Two-stage detectors that handle imbalance via proposal filtering and balanced sampling.
- **Multi-Scale Detection**: RetinaNet detects at multiple FPN scales, assigning anchors of different sizes to each level.
- **Anchor-Free Detection**: FCOS uses focal loss for its per-pixel classification head.

## Further Reading

- Lin et al., "Focal Loss for Dense Object Detection" (2017) -- The original focal loss and RetinaNet paper.
- Shrivastava et al., "Training Region-based Object Detectors with Online Hard Example Mining" (2016) -- OHEM, the sampling-based alternative to focal loss.
- Li et al., "Gradient Harmonizing Mechanism for Single-stage Detector" (2019) -- GHM loss, an alternative approach to rebalancing gradient contributions.
- Zhang et al., "Varifocal Loss for Dense Object Detection" (2021) -- A variant of focal loss that treats positive and negative examples asymmetrically.
