# Semantic Segmentation

**One-Line Summary**: Semantic segmentation assigns a class label to every pixel in an image, producing a dense prediction map that tells you *what* is at each spatial location.

**Prerequisites**: Convolutional neural networks, image classification, pooling and stride, loss functions (cross-entropy)

## What Is Semantic Segmentation?

Imagine coloring every square centimeter of a satellite photo with a different crayon: green for forest, blue for water, gray for road, brown for building. You are not drawing boxes around regions -- you are labeling *every single point*. That is semantic segmentation: a pixel-level classification task where the output has the same spatial dimensions as the input and each pixel carries a class label.

Formally, given an image $I \in \mathbb{R}^{H \times W \times 3}$, the goal is to learn a mapping $f: \mathbb{R}^{H \times W \times 3} \rightarrow \{1, \dots, C\}^{H \times W}$, where $C$ is the number of semantic classes. Unlike object detection, which outputs bounding boxes, or image classification, which outputs a single label, semantic segmentation produces a *dense* prediction -- one decision per pixel.

## How It Works

### Problem Formulation

Each pixel $(i, j)$ is treated as an independent classification problem, though spatial context from the surrounding region heavily influences the prediction. The network typically outputs a tensor of shape $H \times W \times C$, where each spatial location holds a probability distribution over classes. The predicted label is:

$$\hat{y}_{i,j} = \arg\max_{c} \; p(c \mid I, i, j)$$

### Loss Function

The standard training objective is per-pixel cross-entropy, averaged over all spatial locations:

$$\mathcal{L} = -\frac{1}{H \cdot W} \sum_{i,j} \sum_{c=1}^{C} y_{i,j,c} \log \hat{p}_{i,j,c}$$

Because class frequencies are often severely imbalanced (e.g., "road" dominates in driving scenes while "bicycle" is rare), practitioners use **class-weighted cross-entropy** or **focal loss** to rebalance gradients.

### Evaluation Metrics

- **Pixel Accuracy**: fraction of correctly labeled pixels. Simple but misleading when classes are imbalanced.
- **Mean Intersection over Union (mIoU)**: the standard metric. For each class $c$, compute $\text{IoU}_c = \frac{TP_c}{TP_c + FP_c + FN_c}$, then average across classes. A model scoring 80% mIoU on Cityscapes is considered strong.
- **Frequency-Weighted IoU**: weights each class IoU by its pixel frequency.

### Encoder-Decoder Architecture Pattern

Most modern approaches follow an encoder-decoder structure:

1. **Encoder**: a backbone CNN (ResNet, EfficientNet) that progressively downsamples the spatial resolution while increasing channel depth, extracting rich features.
2. **Decoder**: a series of upsampling operations (transposed convolutions, bilinear interpolation) that recover the original resolution.
3. **Skip connections**: shortcut paths from encoder to decoder that preserve fine spatial detail lost during downsampling.

### Key Datasets

| Dataset | Classes | Images | Domain |
|---|---|---|---|
| PASCAL VOC 2012 | 21 | ~11k | General objects |
| Cityscapes | 19 | 5,000 fine | Urban driving |
| ADE20K | 150 | 25k | Diverse scenes |
| COCO-Stuff | 172 | 164k | General + stuff |

## Why It Matters

1. **Autonomous driving** depends on pixel-level understanding: the car must know exactly where the road ends and the sidewalk begins, not just that a road exists somewhere in the frame.
2. **Medical imaging** uses segmentation to delineate tumors, organs, and lesions with sub-millimeter precision, directly influencing treatment planning.
3. **Remote sensing and agriculture** apply segmentation to satellite imagery for crop monitoring, deforestation tracking, and urban planning.
4. **Robotics and AR** require dense scene understanding for grasping, navigation, and real-time overlay of virtual content.
5. **Photo editing tools** rely on segmentation for automatic background removal, portrait mode effects, and selective adjustments.

## Key Technical Details

- State-of-the-art mIoU on Cityscapes val exceeds 85% (e.g., SegFormer-B5 achieves 84.0%, InternImage reaches 86.2%).
- ADE20K, with 150 classes, is considered the harder benchmark; top models reach ~60% mIoU.
- Typical output stride (ratio of input resolution to feature map resolution before upsampling) is 8 or 16. Smaller output strides preserve more spatial detail but cost more compute.
- Training often requires 40k--160k iterations with batch sizes of 8--16 on 512x1024 crops for Cityscapes.
- Data augmentation (random scaling 0.5--2.0x, horizontal flip, color jitter) is critical for generalization.
- Post-processing with CRFs can add +1--2% mIoU at the cost of inference speed.

## Common Misconceptions

- **"Semantic segmentation tells you how many objects there are."** It does not. Two adjacent cars of the same class receive the same label. Distinguishing individual instances requires instance or panoptic segmentation.
- **"Higher pixel accuracy means a better model."** A model that labels every pixel as "background" in a dataset where background covers 90% of pixels achieves 90% pixel accuracy but is useless. mIoU is the proper metric.
- **"You need fully convolutional networks."** While FCNs popularized the approach, modern methods also use vision transformers (SegFormer, Mask2Former) that tokenize patches and still produce dense outputs.

## Connections to Other Concepts

- **Fully Convolutional Networks**: the foundational architecture that made end-to-end dense prediction practical.
- **U-Net**: the dominant encoder-decoder design with skip connections, especially in medical imaging.
- **DeepLab and Atrous Convolution**: uses dilated convolutions and ASPP to capture multi-scale context without losing resolution.
- **Instance Segmentation**: extends semantic segmentation by also separating individual object instances.
- **Panoptic Segmentation**: unifies semantic and instance segmentation into a single coherent output.
- **Conditional Random Fields**: a classical post-processing step that enforces spatial smoothness on segmentation outputs.

## Further Reading

- Long et al., "Fully Convolutional Networks for Semantic Segmentation" (2015) -- The paper that launched modern dense prediction.
- Chen et al., "DeepLab: Semantic Image Segmentation with Deep Convolutional Nets, Atrous Convolution, and Fully Connected CRFs" (2017) -- Introduced atrous convolution and CRF post-processing.
- Xie et al., "SegFormer: Simple and Efficient Design for Semantic Segmentation with Transformers" (2021) -- Demonstrated that transformers can match or beat CNNs for segmentation with simpler decoders.
- Zhou et al., "Scene Parsing through ADE20K Dataset" (2017) -- Established ADE20K as the large-scale segmentation benchmark.
