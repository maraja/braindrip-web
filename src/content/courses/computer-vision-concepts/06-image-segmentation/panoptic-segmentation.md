# Panoptic Segmentation

**One-Line Summary**: Panoptic segmentation unifies semantic segmentation and instance segmentation into a single coherent output, assigning every pixel both a class label and an instance ID -- covering both "stuff" (amorphous regions) and "things" (countable objects).

**Prerequisites**: Semantic segmentation, instance segmentation, Mask R-CNN, fully convolutional networks, feature pyramid networks

## What Is Panoptic Segmentation?

Look at any photograph. Some regions are countable, distinct objects -- a person, a car, a dog. Computer vision calls these **things**. Other regions are amorphous, uncountable masses -- sky, road, grass, water. These are **stuff**. Before panoptic segmentation, the field treated these with separate systems: instance segmentation for things, semantic segmentation for stuff. But the real world does not have this split. Every pixel belongs to *something*.

Panoptic segmentation, introduced by Kirillov et al. (2019), demands a single prediction that labels every pixel with a semantic class *and*, for thing classes, a unique instance ID. The output is a panoptic map $P \in \mathbb{N}^{H \times W}$ where each value encodes both class and instance:

$$P(i,j) = \text{class\_id} \times L + \text{instance\_id}$$

where $L$ is a large constant (e.g., 1000) ensuring unique encoding. Stuff classes have instance\_id = 0; thing classes have instance\_id $\geq 1$.

## How It Works

### Task Definition

Given $C_{\text{th}}$ thing classes and $C_{\text{st}}$ stuff classes:
- Every pixel must receive exactly one label (no overlapping masks, no unlabeled pixels).
- Thing pixels: assigned a (class, instance\_id) pair.
- Stuff pixels: assigned a class label only (all sky pixels share the same label).

### Panoptic Quality (PQ) Metric

PQ is the standard evaluation metric, decomposed into recognition and segmentation quality:

$$\text{PQ} = \underbrace{\frac{\sum_{(p,g) \in TP} \text{IoU}(p,g)}{|TP|}}_{\text{SQ (Segmentation Quality)}} \times \underbrace{\frac{|TP|}{|TP| + \frac{1}{2}|FP| + \frac{1}{2}|FN|}}_{\text{RQ (Recognition Quality)}}$$

- **TP**: predicted segments matched to ground truth (IoU > 0.5).
- **FP**: predicted segments with no match.
- **FN**: ground truth segments with no match.
- PQ is computed per-class and averaged. PQ = SQ x RQ, where SQ measures mask quality and RQ measures detection quality (similar to F1 score).

### Architectural Approaches

**1. Separate branches, merge with heuristics (early methods)**

- Run Mask R-CNN for things and a semantic segmentation network (e.g., DeepLab) for stuff.
- Merge outputs with conflict-resolution rules: thing masks take priority over stuff; overlapping thing masks resolved by confidence score.
- Simple but inelegant -- errors from both branches compound.

**2. Panoptic FPN (Kirillov et al., 2019)**

A unified architecture:
- Shared ResNet + FPN backbone.
- Instance branch: Mask R-CNN head on FPN for thing masks.
- Semantic branch: lightweight FCN on FPN for stuff predictions.
- Merge logic fuses the two outputs into a single panoptic map.

**3. Panoptic-DeepLab (Cheng et al., 2020)**

A bottom-up approach:
- Semantic segmentation head for all classes.
- Instance center prediction head (heatmap of object centers).
- Instance center regression head (each pixel votes for its instance center).
- Grouping: assign each thing pixel to its nearest predicted center.
- No boxes, no proposals -- purely dense prediction.

**4. Mask2Former (Cheng et al., 2022)**

A query-based transformer approach that unifies all segmentation tasks:
- A set of $N$ learned queries (e.g., 100 or 200).
- Each query attends to the image features via masked cross-attention.
- Each query predicts: a class distribution (including "no object") and a binary mask.
- No distinction between thing and stuff queries at the architecture level -- the assignment emerges from training.
- Achieves state-of-the-art on panoptic, instance, and semantic segmentation with a single architecture.

### COCO Panoptic Benchmark

| Model | Backbone | PQ | PQ$^{\text{Th}}$ | PQ$^{\text{St}}$ |
|---|---|---|---|---|
| Panoptic FPN | ResNet-101 | 43.0 | 48.6 | 34.7 |
| Panoptic-DeepLab | Xception-71 | 41.4 | 45.1 | 35.9 |
| Mask2Former | Swin-L | 57.8 | 64.2 | 48.1 |

## Why It Matters

1. **Complete scene understanding**: autonomous vehicles and robots need to know about every pixel -- both the three pedestrians (things) and the road surface they stand on (stuff).
2. **Unified evaluation**: PQ provides a single metric for whole-scene parsing, ending the fragmented evaluation of separate semantic and instance benchmarks.
3. **Architectural convergence**: panoptic segmentation drove the development of universal architectures (Mask2Former, OneFormer) that handle all segmentation tasks with a single model.
4. **Downstream tasks**: complete panoptic maps enable richer reasoning -- scene graphs, spatial relationships, and layout understanding.
5. **Industry applications**: HD map construction for autonomous driving, warehouse robotics scene understanding, and augmented reality scene completion all benefit from panoptic outputs.

## Key Technical Details

- COCO Panoptic has 80 thing classes and 53 stuff classes (133 total).
- Cityscapes Panoptic has 8 thing classes and 11 stuff classes (19 total). Top models exceed 67 PQ.
- The PQ metric treats all segments equally regardless of size, which can make small objects disproportionately influential.
- Mask2Former uses 100 queries for COCO and 200 for Cityscapes. Each query is a 256-d vector.
- Masked cross-attention in Mask2Former restricts each query's attention to the spatial region of its predicted mask from the previous decoder layer, improving both efficiency and accuracy.
- Post-processing for query-based models: filter by confidence threshold, remove overlapping masks by score ranking, assign remaining pixels to the nearest segment.
- Training Mask2Former on COCO Panoptic takes ~50 GPU-hours on 8 A100s.

## Common Misconceptions

- **"Panoptic segmentation is just running instance and semantic segmentation together."** While early approaches did this, modern methods (Mask2Former, kMaX-DeepLab) use architectures where the unified nature is fundamental, not a post-hoc merge. The constraints (no overlaps, no unlabeled pixels) also require explicit resolution strategies.
- **"Stuff classes do not need instance separation."** By definition, stuff classes have no instances. Sky is sky -- there is no "sky instance 1" vs "sky instance 2." If you need to count things, they should be annotated as thing classes.
- **"PQ is similar to mIoU."** PQ penalizes both recognition failures (missed or hallucinated segments) and segmentation quality (poor mask overlap). mIoU does not account for instance-level matching at all. A model with perfect semantic segmentation but no instance separation would score high mIoU but low PQ on thing classes.

## Connections to Other Concepts

- `semantic-segmentation.md`: provides the stuff component of panoptic output.
- `instance-segmentation.md`: provides the things component of panoptic output.
- `r-cnn.md`: the instance branch in Panoptic FPN is essentially Mask R-CNN.
- `deeplab-and-atrous-convolution.md`: Panoptic-DeepLab uses atrous convolutions and ASPP for the semantic branch.
- `segment-anything.md`: SAM produces class-agnostic masks that could serve as panoptic proposals but does not itself perform panoptic labeling.

## Further Reading

- Kirillov et al., "Panoptic Segmentation" (2019) -- Defined the task, metric, and baseline approaches.
- Kirillov et al., "Panoptic Feature Pyramid Networks" (2019) -- First unified architecture for panoptic segmentation.
- Cheng et al., "Panoptic-DeepLab: A Simple, Strong, and Fast Baseline for Bottom-Up Panoptic Segmentation" (2020) -- Box-free panoptic segmentation.
- Cheng et al., "Masked-attention Mask Transformer for Universal Image Segmentation" (Mask2Former, 2022) -- Current state-of-the-art universal architecture.
- Li et al., "Panoptic SegFormer" (2022) -- Transformer-based panoptic segmentation with efficient query design.
