# DeepLab and Atrous Convolution

**One-Line Summary**: DeepLab uses dilated (atrous) convolutions and Atrous Spatial Pyramid Pooling (ASPP) to expand the receptive field without reducing spatial resolution, achieving dense prediction with multi-scale context.

**Prerequisites**: Semantic segmentation, fully convolutional networks, convolutional neural networks, receptive field, conditional random fields

## What Is DeepLab / Atrous Convolution?

Standard convolutions face a fundamental tradeoff: pooling and striding increase the receptive field (how much of the image each neuron "sees") but shrink the feature map, losing spatial detail. Imagine reading a book through a magnifying glass -- you can either see a large area at low magnification or a small area at high magnification, but not both at once.

Atrous (dilated) convolution breaks this tradeoff by inserting gaps ("holes" -- *trous* in French) between filter elements. A 3x3 filter with dilation rate 2 covers a 5x5 area while using only 9 parameters. The receptive field grows without any downsampling. DeepLab is the family of segmentation architectures (v1 through v3+) that systematically exploits this idea, combined with multi-scale feature aggregation and CRF-based refinement.

## How It Works

### Atrous (Dilated) Convolution

A standard 2D convolution computes:

$$y[i, j] = \sum_{m} \sum_{n} x[i + m, \; j + n] \cdot w[m, n]$$

An atrous convolution with dilation rate $r$ computes:

$$y[i, j] = \sum_{m} \sum_{n} x[i + r \cdot m, \; j + r \cdot n] \cdot w[m, n]$$

The effective receptive field of a $k \times k$ kernel with rate $r$ is $k_e = k + (k-1)(r-1)$. For a 3x3 kernel: rate 1 covers 3x3, rate 2 covers 5x5, rate 6 covers 13x13, rate 12 covers 25x25 -- all with just 9 parameters.

### DeepLab v1 (2015)

- Adapted VGG-16 by replacing the last two max-pooling layers with atrous convolutions (rates 2 and 4), maintaining an output stride of 8 instead of 32.
- Applied a dense CRF as post-processing to sharpen boundaries.
- Achieved 71.6% mIoU on PASCAL VOC 2012.

### DeepLab v2 (2017)

Introduced **Atrous Spatial Pyramid Pooling (ASPP)**: parallel atrous convolutions at multiple dilation rates applied to the same feature map, capturing objects at different scales simultaneously.

```
Feature Map (output stride 8)
    |
    +---> Atrous Conv (rate=6)  ---+
    +---> Atrous Conv (rate=12) ---+---> Concatenate -> 1x1 Conv -> Prediction
    +---> Atrous Conv (rate=18) ---+
    +---> 1x1 Conv              ---+
```

Each branch captures context at a different spatial scale. The concatenated result is fused with a 1x1 convolution. Backbone upgraded to ResNet-101. Result: 79.7% mIoU on VOC 2012.

### DeepLab v3 (2017)

- Improved ASPP with batch normalization and an additional **global average pooling** branch (image-level features) to capture whole-image context.
- Removed the CRF post-processing -- the network alone was strong enough.
- Applied atrous convolution in the last ResNet blocks in a "multi-grid" fashion with rates (1, 2, 4) within each block.
- Achieved 85.7% mIoU on VOC 2012 test with multi-scale inference.

### DeepLab v3+ (2018)

Added a lightweight decoder module inspired by encoder-decoder architectures:

1. ASPP output (output stride 16) is upsampled 4x with bilinear interpolation.
2. Concatenated with low-level features from an early encoder layer (after 1x1 conv to reduce channels to 48).
3. Followed by 3x3 convolutions and another 4x bilinear upsampling.

This simple decoder recovered boundary detail that pure ASPP missed. With a Xception-65 backbone, v3+ reached 89.0% mIoU on VOC 2012 test.

### Output Stride

A critical hyperparameter. Output stride = (input resolution) / (feature map resolution):
- **Stride 32**: standard classification network. Fast, coarse.
- **Stride 16**: replace one pooling with atrous conv. Moderate.
- **Stride 8**: replace two poolings. Fine detail, 4x the memory of stride 16.

At training time, stride 16 is common for efficiency. At inference, stride 8 with multi-scale inputs gives best results.

## Why It Matters

1. **Resolution preservation**: atrous convolutions let networks maintain high-resolution feature maps without the computational explosion of simply removing all pooling.
2. **Multi-scale context**: ASPP captures both local texture and global scene structure in a single forward pass, outperforming fixed-scale approaches.
3. **State-of-the-art lineage**: the DeepLab family dominated PASCAL VOC and Cityscapes leaderboards for several years (2015--2019), influencing virtually all subsequent work.
4. **Practical deployability**: DeepLab v3+ with MobileNet-v2 backbone runs in real time on mobile devices, enabling on-device segmentation in products like Google Pixel's portrait mode.
5. **Eliminated CRF dependence**: by v3, the network's own predictions were sharp enough to drop the CRF, simplifying the pipeline.

## Key Technical Details

- ASPP rates in v3+: typically (6, 12, 18) at output stride 16, or (12, 24, 36) at output stride 8.
- DeepLab v3+ with Xception-65: 89.0% mIoU on VOC 2012 test, 82.1% on Cityscapes test.
- With a MobileNet-v2 backbone, DeepLab v3+ achieves 75.3% mIoU on VOC 2012 at 15+ FPS on a mobile GPU.
- Atrous convolution introduces no additional parameters compared to standard convolution with the same kernel size -- only the sampling pattern changes.
- The "gridding artifact" (regular hole patterns in the output when using high dilation rates) is mitigated by multi-grid rates and the hybrid architecture in v3/v3+.
- Training uses poly learning rate schedule: $\text{lr} = \text{base\_lr} \times (1 - \frac{\text{iter}}{\text{max\_iter}})^{0.9}$.

## Common Misconceptions

- **"Atrous convolution uses more parameters than standard convolution."** It uses exactly the same number of parameters. A 3x3 atrous conv has 9 weights regardless of the dilation rate. Only the sampling positions change.
- **"Higher dilation rate is always better."** Very high rates cause the "gridding problem" where the filter samples from disconnected positions, missing local structure. This is why ASPP uses multiple moderate rates rather than one extreme rate.
- **"DeepLab replaces the encoder-decoder paradigm."** DeepLab v3+ explicitly incorporates a decoder. The distinction is that atrous convolutions reduce the need for aggressive downsampling in the encoder, so the decoder can be simpler.

## Connections to Other Concepts

- **Semantic Segmentation**: DeepLab is one of the most successful architectures for this task.
- **Fully Convolutional Networks**: DeepLab builds on the FCN principle but addresses its resolution loss problem.
- **U-Net**: takes the opposite approach -- aggressive downsampling followed by a heavy decoder. DeepLab minimizes downsampling in the first place.
- **Conditional Random Fields**: used in DeepLab v1 and v2 as post-processing; dropped in v3 when network accuracy made it unnecessary.
- **Panoptic Segmentation**: Panoptic-DeepLab extends the framework to jointly handle stuff and things.

## Further Reading

- Chen et al., "Semantic Image Segmentation with Deep Convolutional Nets and Fully Connected CRFs" (2015) -- DeepLab v1.
- Chen et al., "DeepLab: Semantic Image Segmentation with Deep Convolutional Nets, Atrous Convolution, and Fully Connected CRFs" (2017) -- DeepLab v2 with ASPP.
- Chen et al., "Rethinking Atrous Convolution for Semantic Image Segmentation" (2017) -- DeepLab v3 with improved ASPP and multi-grid.
- Chen et al., "Encoder-Decoder with Atrous Separable Convolution for Semantic Image Segmentation" (2018) -- DeepLab v3+ with decoder module.
- Yu and Koltun, "Multi-Scale Context Aggregation by Dilated Convolutions" (2016) -- Independent concurrent work on dilated convolutions for dense prediction.
