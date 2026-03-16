# Sliding Window and Region Proposals

**One-Line Summary**: Sliding windows exhaustively scan every location and scale in an image, while region proposals intelligently suggest a small subset of likely object locations to dramatically reduce computation.

**Prerequisites**: Convolutional neural networks, image pyramids, histogram of oriented gradients (HOG), bounding boxes

## What Is Sliding Window and Region Proposal?

Imagine searching for a lost earring in a room. The sliding window approach checks every single square inch of floor, furniture, and countertop at every possible zoom level -- thorough but painfully slow. Region proposals are like a friend who says, "I saw something shiny near the couch and by the window" -- you only need to check a handful of promising spots.

Technically, a **sliding window** detector moves a fixed-size window across an image at multiple scales and aspect ratios, running a classifier at each position. **Region proposals** replace this brute-force search with an algorithm that generates a sparse set of candidate bounding boxes (typically 1,000-2,000) that are likely to contain objects, based on low-level cues such as color, texture, and edge groupings.

## How It Works

### Sliding Window Detection

1. Construct an **image pyramid** by resizing the input to multiple scales (e.g., 10-20 levels with a factor of ~1.2 between adjacent scales).
2. At each scale, slide a fixed-size window (e.g., $64 \times 128$ pixels for pedestrians) across the image with a stride $s$ (commonly 4-8 pixels).
3. Extract features from each window (HOG, LBP, or CNN features).
4. Run a binary classifier (linear SVM, boosted cascade) on each window.
5. Apply non-maximum suppression to merge overlapping detections.

The total number of windows evaluated is approximately:

$$N = \sum_{l=1}^{L} \left\lfloor \frac{W_l - w}{s} + 1 \right\rfloor \times \left\lfloor \frac{H_l - h}{s} + 1 \right\rfloor$$

where $W_l, H_l$ are the image dimensions at pyramid level $l$, and $w, h$ are the window dimensions. For a $640 \times 480$ image with 12 scales and stride 8, this yields roughly 50,000-100,000 windows.

### Selective Search (2012)

Uijlings et al. proposed Selective Search, the most widely used region proposal method before deep learning took over:

1. Over-segment the image using Felzenszwalb's graph-based method (~1,000-2,000 initial segments).
2. Iteratively merge adjacent segments based on similarity in color, texture, size, and fill.
3. At each merge step, record the bounding box of the merged region as a proposal.
4. Output the union of all recorded boxes (~2,000 proposals).

### EdgeBoxes (2014)

Zitnick and Dollar proposed using edge density within candidate boxes:

1. Compute structured edge responses across the image.
2. Score candidate boxes by the number of contour groups wholly enclosed.
3. Rank and return top-$k$ proposals.

EdgeBoxes runs at ~0.25 seconds per image, compared to ~2 seconds for Selective Search.

### Deep Proposal Methods

- **Region Proposal Network (RPN)**: Introduced in Faster R-CNN, generates proposals directly from convolutional feature maps using anchor boxes (see fast-and-faster-rcnn).
- **DeepMask / SharpMask** (Pinheiro et al., 2015-2016): Predict segmentation masks and objectness scores simultaneously.

## Why It Matters

1. **Sliding windows enabled the first successful object detectors**, including the Viola-Jones face detector (2001) and Dalal-Triggs pedestrian detector (2005), which operated in real-time via cascaded classifiers.
2. **Region proposals reduced computation by 100-1000x** compared to dense sliding windows, making it feasible to apply expensive CNN classifiers to each candidate.
3. **Selective Search was the backbone of R-CNN**, achieving a 30% relative improvement in mAP on PASCAL VOC 2010 over the prior state of the art.
4. **The transition from external proposals to learned proposals (RPN)** was a key step toward end-to-end trainable object detection.

## Key Technical Details

- Selective Search generates ~2,000 proposals per image with a recall of ~98% at IoU 0.5 on PASCAL VOC.
- EdgeBoxes achieves comparable recall at 1,000 proposals, running ~8x faster than Selective Search.
- Sliding window with HOG+SVM runs at ~0.07 seconds per window on CPU (2005 hardware), but requires tens of thousands of evaluations.
- Viola-Jones achieves real-time speed (15 FPS at $384 \times 288$) using integral images and a cascade of 38 stages with ~6,000 features.
- RPN generates ~300 proposals with 99% recall at IoU 0.5, running in ~10ms on a GPU -- effectively eliminating the need for external proposal methods.

## Common Misconceptions

- **"Sliding windows are obsolete."** While no longer used for high-accuracy detection, sliding-window principles persist in anchor-based detectors like SSD and YOLO, which evaluate a fixed grid of locations and scales.
- **"Region proposals find objects."** Proposals are class-agnostic -- they identify regions likely to contain *any* object. Classification happens in a subsequent stage.
- **"More proposals always means better recall."** Recall saturates quickly. Selective Search achieves ~96% recall at 1,000 proposals and ~98% at 2,000; adding more proposals beyond this yields diminishing returns while increasing downstream computation.

## Connections to Other Concepts

- `r-cnn.md`: Directly uses Selective Search proposals as input to a CNN feature extractor and SVM classifier.
- `r-cnn.md`: Replaces external proposals with a learned Region Proposal Network.
- `non-maximum-suppression.md`: Applied after both sliding-window and proposal-based detectors to remove duplicate detections.
- `multi-scale-detection.md`: Sliding windows require explicit image pyramids; modern methods build feature pyramids instead.
- `intersection-over-union.md`: Used to evaluate proposal quality by measuring overlap with ground-truth boxes.

## Further Reading

- Viola and Jones, "Rapid Object Detection using a Boosted Cascade of Simple Features" (2001) -- Introduced the sliding-window cascade detector for real-time face detection.
- Dalal and Triggs, "Histograms of Oriented Gradients for Human Detection" (2005) -- Defined the HOG+SVM sliding-window pipeline for pedestrian detection.
- Uijlings et al., "Selective Search for Object Recognition" (2013) -- The region proposal method that enabled R-CNN.
- Zitnick and Dollar, "Edge Boxes: Locating Object Proposals from Edges" (2014) -- Fast proposal generation using edge grouping.
- Hosang et al., "What Makes for Effective Detection Proposals?" (2016) -- Comprehensive benchmark comparing proposal methods.
