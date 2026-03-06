# R-CNN

**One-Line Summary**: Region-based Convolutional Neural Network (R-CNN) applies a deep CNN to each of ~2,000 region proposals independently, achieving a dramatic leap in detection accuracy while being prohibitively slow at 47 seconds per image.

**Prerequisites**: Convolutional neural networks, transfer learning, sliding window and region proposals, support vector machines, bounding box regression

## What Is R-CNN?

Think of R-CNN like a museum security system that first identifies ~2,000 suspicious zones in a surveillance frame using motion detection (region proposals), then sends a high-resolution camera feed of each zone to a trained analyst (CNN) who decides what is in that zone. It is thorough and accurate, but analyzing each zone independently means the analyst spends a lot of time reprocessing overlapping areas.

Technically, R-CNN (Girshick et al., 2014) is a three-stage pipeline: (1) generate ~2,000 class-agnostic region proposals via Selective Search, (2) extract a fixed-size CNN feature vector from each proposal by warping it to $227 \times 227$ and running it through AlexNet or VGG-16, and (3) classify each feature vector with per-class linear SVMs and refine the bounding box with a linear regressor.

## How It Works

### Stage 1: Region Proposal Generation

Selective Search produces ~2,000 candidate bounding boxes per image. Each box is warped (with 16 pixels of context padding) to $227 \times 227$ pixels regardless of aspect ratio.

### Stage 2: Feature Extraction

Each warped region is passed through a CNN (originally AlexNet, later VGG-16) pre-trained on ImageNet and fine-tuned on the detection dataset. The output of the `fc7` layer yields a 4096-dimensional feature vector per proposal:

$$\mathbf{f}_i = \text{CNN}(\text{warp}(R_i)) \in \mathbb{R}^{4096}$$

### Stage 3: Classification and Regression

- **Classification**: One-vs-all linear SVMs (one per class) score each feature vector. The SVM was found to outperform the softmax layer by ~4 mAP points, likely because fine-tuning used a loose IoU threshold (0.5) for positives while SVM training used a stricter definition.
- **Bounding box regression**: A class-specific linear regressor maps the proposal box to a tighter bounding box:

$$\hat{t}_x = w_x^T \mathbf{f}, \quad \hat{t}_y = w_y^T \mathbf{f}, \quad \hat{t}_w = w_w^T \mathbf{f}, \quad \hat{t}_h = w_h^T \mathbf{f}$$

where $t_x, t_y$ encode center offsets and $t_w, t_h$ encode log-space width/height adjustments.

### Training Protocol

1. **Pre-train** on ImageNet (1.2M images, 1000 classes).
2. **Fine-tune** on detection data: proposals with IoU $\geq 0.5$ with a ground-truth box are positives; the rest are negatives. Mini-batches sample 32 positives and 96 negatives.
3. **Train SVMs** with hard negative mining: ground-truth boxes are positives, proposals with IoU $< 0.3$ are negatives.
4. **Train regressors** on proposals with IoU $\geq 0.6$.

### Inference Pipeline

```
Image -> Selective Search (~2,000 proposals)
       -> Warp each to 227x227
       -> CNN forward pass (per proposal)
       -> SVM classification + bbox regression
       -> Non-maximum suppression (per class)
       -> Final detections
```

## Why It Matters

1. **R-CNN achieved 53.3% mAP on PASCAL VOC 2010**, a 30% relative improvement over the previous best (DPM at 33.4%), demonstrating that CNNs transfer powerfully to detection.
2. **It established the extract-then-classify paradigm** that dominated detection research from 2014-2016.
3. **Transfer learning from ImageNet** became standard practice -- removing the need for detection-specific architectures trained from scratch.
4. **It revealed the gap between recognition and detection**, motivating the development of Fast R-CNN, Faster R-CNN, and eventually end-to-end detectors.

## Key Technical Details

- **Inference time**: ~47 seconds per image on a GPU (VGG-16 backbone), dominated by ~2,000 independent CNN forward passes.
- **Feature storage**: Extracting features for PASCAL VOC 2007 requires ~200 GB of disk space for caching.
- **PASCAL VOC 2012 result**: 53.3% mAP (with bounding box regression).
- **ILSVRC 2013 result**: 31.4% mAP on the 200-class detection task.
- **AlexNet backbone**: 58.5% mAP on VOC 2007; VGG-16 backbone: 66.0% mAP on VOC 2007.
- **Fine-tuning boost**: +8 mAP points compared to using ImageNet features without fine-tuning.
- **Bounding box regression boost**: +3-4 mAP points on top of SVM classification alone.

## Common Misconceptions

- **"R-CNN uses the CNN's softmax for classification."** The published R-CNN pipeline uses linear SVMs trained on CNN features, not the softmax layer. SVMs with hard negative mining outperformed softmax by ~4 mAP points in the original experiments.
- **"R-CNN is end-to-end trainable."** It is not. The three stages (proposal, feature extraction + fine-tuning, SVM + regressor training) are disjoint. This was a major limitation addressed by Fast R-CNN.
- **"The CNN processes the whole image."** Each of the ~2,000 proposals is independently warped and forwarded through the CNN, causing massive redundant computation on overlapping regions.

## Connections to Other Concepts

- **Sliding Window and Region Proposals**: R-CNN relies entirely on Selective Search for candidate generation.
- **Fast and Faster R-CNN**: Direct successors that share computation across proposals and eliminate the SVM stage.
- **Non-Maximum Suppression**: Applied per-class after SVM scoring to produce final detections.
- **Intersection over Union**: Used to assign proposals to ground-truth boxes during training and to evaluate detection quality.
- **Transfer Learning (ImageNet pre-training)**: R-CNN demonstrated that features learned on classification transfer effectively to detection.

## Further Reading

- Girshick et al., "Rich Feature Hierarchies for Accurate Object Detection and Semantic Segmentation" (2014) -- The original R-CNN paper.
- Sermanet et al., "OverFeat: Integrated Recognition, Localization and Detection using Convolutional Networks" (2014) -- Concurrent work applying CNNs to detection with a multi-scale sliding window.
- Girshick, "Fast R-CNN" (2015) -- Addressed R-CNN's speed and storage bottlenecks.
- Uijlings et al., "Selective Search for Object Recognition" (2013) -- The proposal method used by R-CNN.
