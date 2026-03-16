# DETR (Detection Transformer)

**One-Line Summary**: DETR reformulates object detection as a direct set prediction problem using a transformer encoder-decoder architecture with bipartite matching, eliminating the need for anchors, non-maximum suppression, and most hand-designed components.

**Prerequisites**: Convolutional neural networks, transformer architecture (self-attention, cross-attention), feature pyramid network, non-maximum suppression, intersection over union

## What Is DETR?

Imagine you have 100 assistants in a room, each holding an empty card. You show them a photo and ask each assistant to either write down one object (class + location) or write "no object." They can see each other's cards (self-attention) and the photo (cross-attention), so they coordinate to avoid duplicates. When they are done, you simply collect the cards -- no need to merge duplicate answers because each assistant claimed exactly one object or none. This is DETR's approach: a fixed set of learned "object queries" that directly output the final set of detections.

Technically, **DETR** (Carion et al., 2020) feeds CNN features into a transformer encoder, then uses a transformer decoder with $N$ learned object queries (typically $N = 100$) to predict $N$ detection outputs in parallel. Training uses Hungarian matching to find the optimal one-to-one assignment between predictions and ground-truth objects, avoiding duplicate predictions without NMS.

## How It Works

### Architecture

```
Image -> CNN Backbone -> Flatten + Positional Encoding
                              |
                    Transformer Encoder (6 layers)
                              |
                    Transformer Decoder (6 layers)
                         (N object queries)
                              |
                    N prediction heads
                    (class + bbox per query)
```

**1. Backbone**: A ResNet (e.g., ResNet-50) extracts features, producing a feature map $\mathbf{f} \in \mathbb{R}^{C \times H \times W}$ (typically $C = 2048$, reduced to $d = 256$ via $1 \times 1$ conv).

**2. Transformer Encoder**: The flattened feature map ($HW$ tokens of dimension $d$) is processed by 6 self-attention layers with fixed sinusoidal positional encodings. This enables global reasoning about the image.

**3. Transformer Decoder**: $N = 100$ learned object queries attend to the encoded features via cross-attention and to each other via self-attention. Each query specializes in detecting objects in certain spatial regions and of certain types.

**4. Prediction Heads**: Each query output feeds into a shared FFN that predicts:
- A class label (including a "no object" class $\varnothing$).
- A normalized bounding box $(c_x, c_y, w, h) \in [0, 1]^4$.

### Bipartite Matching Loss

Given $N$ predictions and $M$ ground-truth objects ($M \ll N$), DETR finds the optimal one-to-one assignment $\hat{\sigma}$ using the Hungarian algorithm:

$$\hat{\sigma} = \arg\min_{\sigma \in \mathfrak{S}_N} \sum_{i=1}^{N} \mathcal{L}_{\text{match}}(y_i, \hat{y}_{\sigma(i)})$$

The matching cost combines classification, $L_1$ box distance, and generalized IoU:

$$\mathcal{L}_{\text{match}} = -\mathbb{1}_{c_i \neq \varnothing} \hat{p}_{\sigma(i)}(c_i) + \lambda_{L_1} \|b_i - \hat{b}_{\sigma(i)}\|_1 + \lambda_{\text{giou}} \mathcal{L}_{\text{giou}}(b_i, \hat{b}_{\sigma(i)})$$

The training loss is computed on matched pairs:

$$\mathcal{L} = \sum_{i=1}^{N} \left[-\log \hat{p}_{\hat{\sigma}(i)}(c_i) + \lambda_{L_1} \|b_i - \hat{b}_{\hat{\sigma}(i)}\|_1 + \lambda_{\text{giou}} \mathcal{L}_{\text{giou}}(b_i, \hat{b}_{\hat{\sigma}(i)})\right]$$

with $\lambda_{L_1} = 5$ and $\lambda_{\text{giou}} = 2$.

### Auxiliary Decoding Losses

The loss is applied after every decoder layer (not just the last), which stabilizes training and accelerates convergence.

## Why It Matters

1. **DETR eliminated NMS, anchors, and proposal generation** -- the first detector to do so, achieving a dramatically simpler pipeline.
2. **Set-based prediction** introduced a new paradigm: instead of filtering redundant predictions post hoc, DETR prevents duplicates by construction.
3. **DETR matched Faster R-CNN on COCO**: 42.0% AP (ResNet-50) vs. Faster R-CNN + FPN's ~42% AP, validating the transformer-based approach.
4. **It spawned a family of successors** (Deformable DETR, DAB-DETR, DINO, RT-DETR) that addressed its limitations and now define the state of the art.

## Key Technical Details

- **DETR (ResNet-50)**: 42.0% AP on COCO, ~28 FPS on a V100 GPU. Training requires 500 epochs (~3 days on 16 GPUs), roughly 10-20x longer than Faster R-CNN.
- **DETR (ResNet-101)**: 43.5% AP on COCO.
- **Small object performance**: DETR achieves 20.5% AP_S, significantly below Faster R-CNN's 24.1% AP_S. The coarse single-scale feature map (stride 32) limits small object detection.
- **Number of queries**: $N = 100$ is sufficient for COCO (max ~60 objects per image in practice). For denser datasets, $N$ must be increased.
- **Convergence**: The attention mechanism requires many epochs to learn spatial priors that anchor-based methods encode by design. Deformable DETR reduces training to 50 epochs.
- **Self-attention in the decoder** is critical for preventing duplicate detections -- removing it causes a 3.9% AP drop.

### Deformable DETR (2021)

Addresses DETR's convergence and small-object weaknesses:
- Replaces dense attention with **deformable attention** that attends to a small set of learned sampling points (e.g., 4 per reference point).
- Operates on **multi-scale feature maps** (like FPN), improving small object detection.
- Converges in **50 epochs** (10x faster), reaching 46.2% AP with ResNet-50.

### DINO (2023)

- Combines deformable attention with contrastive denoising training and mixed query selection.
- Achieves **63.3% AP on COCO** with a Swin-L backbone and test-time augmentation.

## Common Misconceptions

- **"DETR is slow because of the transformer."** The transformer encoder-decoder adds modest computation (~10ms). The slow training convergence (500 epochs) is the real bottleneck, not inference speed.
- **"DETR cannot handle many objects."** The fixed number of queries is a soft limit. Increasing $N$ to 300 or 900 accommodates denser scenes, though with increased memory usage.
- **"DETR replaced all other detectors."** Original DETR was competitive but not superior. Its successors (Deformable DETR, DINO) have become top performers, but YOLO-family detectors remain dominant for real-time applications.

## Connections to Other Concepts

- `non-maximum-suppression.md`: DETR is the first major detector to eliminate NMS entirely via set prediction.
- `anchor-free-detection.md`: DETR is anchor-free by design, predicting boxes directly without anchor templates.
- `feature-pyramid-network.md`: Original DETR does not use FPN (a notable limitation); Deformable DETR adds multi-scale features.
- `intersection-over-union.md`: Generalized IoU (GIoU) is used in both the matching cost and training loss.
- `focal-loss.md`: DETR uses standard cross-entropy, but some successors incorporate focal loss for classification.

## Further Reading

- Carion et al., "End-to-End Object Detection with Transformers" (2020) -- The original DETR paper.
- Zhu et al., "Deformable DETR: Deformable Transformers for End-to-End Object Detection" (2021) -- Deformable attention for faster convergence and multi-scale detection.
- Zhang et al., "DINO: DETR with Improved DeNoising Anchor Boxes for End-to-End Object Detection" (2023) -- State-of-the-art DETR variant.
- Li et al., "DN-DETR: Accelerate DETR Training by Introducing Query DeNoising" (2022) -- Denoising training strategy for faster convergence.
- Zhao et al., "RT-DETR: DETRs Beat YOLOs on Real-time Object Detection" (2024) -- Real-time DETR variant competitive with YOLO.
