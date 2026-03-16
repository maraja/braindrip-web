# Fully Convolutional Networks

**One-Line Summary**: Fully Convolutional Networks (FCNs) replace the fully connected layers of classification CNNs with convolutional layers, enabling dense, pixel-wise prediction on inputs of arbitrary spatial size.

**Prerequisites**: Convolutional neural networks, image classification backbones (VGG, AlexNet), semantic segmentation, transposed convolution, transfer learning

## What Is a Fully Convolutional Network?

Think of a standard image classifier as a funnel: an image goes in, features get compressed through convolutional layers, and then fully connected layers crush everything into a single vector of class scores. The spatial layout -- *where* things are -- is deliberately discarded. Now imagine removing the bottom of the funnel so the spatial structure flows all the way through. That is the core idea behind FCNs: every layer is convolutional, so the network preserves spatial information and outputs a prediction *map* instead of a prediction *vector*.

Technically, an FCN is any network composed entirely of convolutional, pooling, and upsampling layers -- no fully connected (dense) layers. Given an input $I \in \mathbb{R}^{H \times W \times 3}$, the network produces $O \in \mathbb{R}^{H \times W \times C}$, where $C$ is the number of classes. Because convolutions are translation-equivariant and have no fixed spatial dimensions, FCNs accept inputs of any height and width at inference time.

## How It Works

### Converting Classification Networks to FCNs

Long et al. (2015) showed that any classification CNN can be "convolutionalized":

1. Take a trained classifier (e.g., VGG-16 with three 4096-d FC layers).
2. Reinterpret each FC layer as a 1x1 convolution. A fully connected layer with 4096 outputs applied to a $7 \times 7 \times 512$ feature map is equivalent to a $7 \times 7$ convolution with 4096 output channels.
3. The resulting network produces a low-resolution score map (e.g., $H/32 \times W/32 \times C$ for VGG-16).

This conversion preserves the learned weights exactly -- no retraining is needed for the conversion itself.

### Upsampling to Full Resolution

The coarse score map must be upsampled back to the input resolution. FCN introduced **learnable transposed convolutions** (also called deconvolutions, though they are not true mathematical deconvolutions):

$$y = W^T * x$$

where $W^T$ denotes the transposed filter and $*$ is the convolution operation. In practice, the transposed convolution inserts zeros between input elements and performs a standard convolution, effectively upsampling by the stride factor.

### Skip Connections for Multi-Scale Fusion

A 32x upsampling from the final layer produces very coarse boundaries. FCN addressed this with **skip architectures** that fuse predictions from multiple encoder stages:

- **FCN-32s**: upsample the final layer 32x directly. Coarse output.
- **FCN-16s**: combine pool5 predictions (32x coarse) with pool4 predictions (16x coarse), then upsample 16x. Finer boundaries.
- **FCN-8s**: additionally fuse pool3 predictions (8x coarse), then upsample 8x. The best variant.

```
Input -> [conv1-pool1] -> [conv2-pool2] -> [conv3-pool3] -> [conv4-pool4] -> [conv5-pool5]
                                              |                 |                 |
                                          (1x1 conv)       (1x1 conv)       (1x1 conv)
                                              |                 |                 |
                                              +--------+--------+
                                                       |
                                                  Fuse & Upsample 8x
                                                       |
                                                  Dense Prediction
```

### Training Details

- **Loss**: per-pixel cross-entropy, summed over all spatial locations.
- **Initialization**: backbone weights from ImageNet-pretrained VGG-16. Transposed convolution layers initialized to bilinear interpolation.
- **Optimizer**: SGD with momentum 0.9, learning rate $10^{-4}$ for the adapted classification layers, $10^{-2}$ for the new score layers.
- **Data**: PASCAL VOC 2011/2012 segmentation benchmark with 21 classes (20 objects + background).

## Why It Matters

1. **Foundational architecture**: FCN was the first end-to-end trainable network for dense pixel prediction, making hand-crafted feature pipelines obsolete for segmentation.
2. **Transfer learning for dense tasks**: demonstrated that classification features transfer directly to segmentation, saving enormous amounts of labeled data.
3. **Arbitrary input sizes**: because there are no FC layers, the same trained model can process a 256x256 patch or a 4000x3000 photograph without modification.
4. **Conceptual template**: virtually every subsequent segmentation architecture (U-Net, DeepLab, PSPNet, SegFormer) inherits the FCN principle of all-convolutional design with learned upsampling.

## Key Technical Details

- FCN-8s achieved 62.2% mIoU on PASCAL VOC 2012 test -- a massive jump from prior non-deep methods (~40%).
- Inference on a 500x500 image takes ~200ms on a NVIDIA Titan X (2015 GPU). Modern reimplementations on current hardware are far faster.
- The "convolutionalization" trick means a VGG-16 FC layer with $7 \times 7 \times 512 \times 4096 = 102$M parameters becomes a $7 \times 7$ conv with exactly the same parameter count.
- A 1x1 convolution acts as a per-pixel linear classifier over the channel dimension; this is how the final score map is produced.
- Bilinear initialization of transposed convolution filters provides a strong starting point and converges faster than random initialization.
- The 32x output stride of VGG means fine structures (thin poles, bicycle wheels) are poorly captured -- motivating all subsequent work on preserving resolution.

## Common Misconceptions

- **"FCN means no parameters."** FCNs have as many parameters as the classification network they derive from, plus a few additional layers for scoring and upsampling. The "fully convolutional" label refers to the *type* of layer, not the parameter count.
- **"Transposed convolutions are deconvolutions."** The operation is not an inverse convolution in the signal-processing sense. It is an upsampling operation parameterized as a convolution. The term "deconvolution" persists but is technically misleading.
- **"FCN is outdated and no longer relevant."** While the specific FCN-8s architecture is rarely used directly, the principle of all-convolutional dense prediction underlies every modern segmentation network. Understanding FCN is essential to understanding what followed.

## Connections to Other Concepts

- `semantic-segmentation.md`: FCN is the architecture that made learned semantic segmentation practical.
- `u-net.md`: extends the FCN skip-connection idea into a symmetric encoder-decoder with concatenation-based fusion.
- `deeplab-and-atrous-convolution.md`: addresses FCN's resolution loss problem by replacing some pooling layers with dilated convolutions.
- `instance-segmentation.md`: applies FCN-style heads to region proposals, producing per-instance masks.
- `conditional-random-fields.md`: frequently used as post-processing on FCN outputs to sharpen boundaries.

## Further Reading

- Long et al., "Fully Convolutional Networks for Semantic Segmentation" (2015) -- The original paper; one of the most cited in computer vision.
- Noh et al., "Learning Deconvolution Network for Semantic Segmentation" (2015) -- Explored deeper deconvolution architectures building on FCN.
- Shelhamer et al., "Fully Convolutional Networks for Semantic Segmentation" (2017) -- Extended journal version with additional experiments and analysis.
- Yu and Koltun, "Multi-Scale Context Aggregation by Dilated Convolutions" (2016) -- Proposed dilated convolutions as an alternative to the pooling + upsampling pipeline of FCN.
