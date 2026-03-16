# Convolution in Neural Networks

**One-Line Summary**: A convolution layer slides small learned filters across an input, producing feature maps that detect local patterns through weight sharing and local connectivity.

**Prerequisites**: Linear algebra basics, feedforward neural networks, gradient descent

## What Is Convolution in Neural Networks?

Imagine running a small magnifying glass across a photograph. At each position, the glass highlights a tiny patch and summarizes what it sees -- an edge, a color gradient, a texture. The glass itself never changes; it applies the same inspection everywhere. That is essentially what a convolutional layer does: a small matrix of learnable weights (the filter or kernel) slides across the input, computing a dot product at every spatial location to produce a feature map.

Formally, the discrete 2D convolution (technically cross-correlation in most frameworks) between an input $I$ and a kernel $K$ of size $k \times k$ is:

$$S(i, j) = \sum_{m=0}^{k-1} \sum_{n=0}^{k-1} I(i+m,\; j+n) \cdot K(m, n) + b$$

where $b$ is a learnable bias term. In practice, the input has multiple channels (e.g., 3 for RGB), so the kernel is three-dimensional: $k \times k \times C_{in}$, and each filter produces one output channel. Stacking $C_{out}$ such filters yields a full convolutional layer.

## How It Works

### Local Connectivity

Unlike a fully connected layer where every input unit connects to every output unit, a convolutional neuron only sees a small spatial neighborhood defined by the kernel size. For a $3 \times 3$ kernel on a $224 \times 224$ input, each output neuron depends on just 9 spatial positions per channel, rather than all 50,176.

### Weight Sharing

The same kernel weights are reused at every spatial position. This has two critical consequences:

1. **Dramatically fewer parameters.** A $3 \times 3$ kernel operating on 64 input channels to produce 128 output channels requires $3 \times 3 \times 64 \times 128 + 128 = 73{,}856$ parameters -- independent of the spatial resolution of the input.
2. **Translation equivariance.** If a pattern shifts in the input, its response shifts correspondingly in the output feature map.

### Stride and Padding

- **Stride** $s$: The kernel moves $s$ pixels at a time. Stride 2 halves the spatial dimensions.
- **Padding** $p$: Zeros (or other values) are added around the input border. "Same" padding preserves spatial size; "valid" padding uses no padding.

The output spatial dimension for one axis is:

$$o = \left\lfloor \frac{n + 2p - k}{s} \right\rfloor + 1$$

where $n$ is the input size, $k$ is the kernel size, $s$ is stride, and $p$ is padding.

### Transposed Convolution

Also called deconvolution or fractionally strided convolution, transposed convolutions upsample feature maps by inserting zeros between input elements and then applying a standard convolution. They are widely used in decoder networks for semantic segmentation (FCN), image generation (GANs), and super-resolution. The output size is:

$$o = (n - 1) \times s - 2p + k$$

where $n$ is the input size. Transposed convolutions can produce checkerboard artifacts if the kernel size is not divisible by the stride.

### Dilated (Atrous) Convolution

Inserting gaps of size $d - 1$ between kernel elements expands the receptive field without increasing parameter count. A $3 \times 3$ kernel with dilation $d = 2$ covers a $5 \times 5$ effective area using only 9 weights. This is central to architectures like DeepLab for semantic segmentation.

### Groups and 1x1 Convolutions

- **Grouped convolutions** partition input channels into $g$ groups, each processed independently, reducing computation by a factor of $g$. When $g = C_{in}$, this becomes a depthwise convolution. AlexNet originally used $g = 2$ groups to split computation across two GPUs.
- **$1 \times 1$ convolutions** operate only across channels at each spatial position, functioning as per-pixel fully connected layers. They are used to change channel dimensionality without affecting spatial resolution. They were introduced by Lin et al. (2013) in the Network in Network paper and became central to Inception and ResNet bottleneck designs.

## Why It Matters

1. **Parameter efficiency** enables training on images that would be intractable with fully connected layers (a single FC layer on a $224 \times 224 \times 3$ image to 4,096 units would need over 600 million weights).
2. **Translation equivariance** lets the network detect a feature regardless of where it appears, which is a natural prior for visual data.
3. **Hierarchical feature learning** emerges from stacking convolutions: early layers learn edges and textures, deeper layers learn parts and objects.
4. **Hardware friendliness**: convolutions map efficiently onto GPUs and specialized accelerators (TPUs, NPUs) through matrix multiplication reformulation (im2col).
5. **Foundation for transfer learning.** Features learned by convolutional layers on large datasets like ImageNet transfer remarkably well to other tasks, making pretrained CNNs the starting point for most applied computer vision work.

## Key Technical Details

- Most modern architectures use $3 \times 3$ kernels almost exclusively, following VGGNet's finding that two stacked $3 \times 3$ layers have the same receptive field as one $5 \times 5$ layer but fewer parameters ($2 \times 9 = 18$ vs. $25$) and an extra nonlinearity.
- A conv layer with $C_{in}$ input channels, $C_{out}$ output channels, and kernel size $k$ requires $k^2 \times C_{in} \times C_{out}$ multiply-accumulate (MAC) operations per spatial output position.
- Total FLOPs for one convolutional layer: $2 \times k^2 \times C_{in} \times C_{out} \times H_{out} \times W_{out}$ (the factor of 2 accounts for multiply and add).
- Batch normalization is typically applied after convolution and before activation in modern practice.
- cuDNN provides multiple convolution algorithms (direct, FFT-based, Winograd) and auto-tunes for each layer shape.
- **im2col**: The most common implementation strategy rearranges input patches into columns of a matrix, converting convolution into a dense matrix multiplication. This trades memory (the unrolled matrix can be 9x larger for $3 \times 3$ kernels) for computational speed on GPUs.
- **Winograd convolution** reduces the number of multiplications for small kernels: a $3 \times 3$ convolution on $4 \times 4$ tiles requires only $4 \times 4 = 16$ multiplications instead of $4 \times 4 \times 3 \times 3 = 144$, a theoretical 2.25x speedup.
- Learned filters in early layers typically resemble Gabor filters and color blobs; deeper layers develop increasingly abstract and task-specific patterns.
- **Bias terms** in convolutional layers are optional. Many modern architectures omit biases when batch normalization is used, since BN's learnable shift parameter ($\beta$) subsumes the bias.

## Common Misconceptions

- **"Convolution in CNNs is the same as mathematical convolution."** Technically, most deep learning frameworks implement cross-correlation (no kernel flip). The distinction is irrelevant for learned kernels since the network can learn the flipped version, but it matters when comparing to signal processing literature.
- **"Larger kernels always capture more information."** Stacking small kernels achieves the same receptive field with fewer parameters and more nonlinearities. Large kernels ($7 \times 7$, $11 \times 11$) have largely been abandoned except in the first layer of some architectures or in recent work like ConvNeXt.
- **"Convolutions are only for images."** 1D convolutions are standard in audio and time-series processing; 3D convolutions are used in video and volumetric medical imaging.
- **"More filters always means better performance."** Increasing the number of filters adds parameters and computation. Beyond a point, additional filters yield diminishing returns or cause overfitting on smaller datasets. Width scaling must be balanced with depth and input resolution, as shown by EfficientNet's compound scaling work.

## Connections to Other Concepts

- `pooling-layers.md`: Typically follow convolutions to downsample feature maps and add local translation invariance.
- `receptive-field.md`: Each convolution layer expands the receptive field; understanding this is key to architecture design.
- `depthwise-separable-convolutions.md`: Factor standard convolutions into spatial and channel components for efficiency.
- `batch-normalization.md`: Almost always paired with convolutions in modern architectures.
- `alexnet.md`: The first large-scale CNN to demonstrate the power of learned convolutional filters on ImageNet.
- `resnet.md`: Uses convolutions with skip connections, enabling networks of 100+ layers.

## Further Reading

- LeCun et al., "Gradient-Based Learning Applied to Document Recognition" (1998) -- The foundational paper introducing LeNet and modern convolutional architectures.
- Dumoulin & Visin, "A Guide to Convolution Arithmetic for Deep Learning" (2016) -- Comprehensive visual reference for convolution, padding, stride, and transposed convolutions.
- Liu et al., "A ConvNet for the 2020s" (2022) -- ConvNeXt revisits pure convolution designs, showing they remain competitive with Transformers.
- Lavin & Gray, "Fast Algorithms for Convolutional Neural Networks" (2016) -- Details Winograd-based convolution implementations for efficient GPU computation.
- Krizhevsky et al., "ImageNet Classification with Deep Convolutional Neural Networks" (2012) -- AlexNet paper that demonstrated the power of learned convolutional filters at scale.
