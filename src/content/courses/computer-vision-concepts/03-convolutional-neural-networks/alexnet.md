# AlexNet

**One-Line Summary**: AlexNet won the 2012 ImageNet Large Scale Visual Recognition Challenge with 16.4% top-5 error, demonstrating that deep convolutional neural networks trained on GPUs could dramatically outperform traditional computer vision methods.

**Prerequisites**: Convolution in neural networks, pooling layers, ReLU activation, dropout, softmax classification

## What Is AlexNet?

Imagine a community of craftspeople who had been building furniture by hand for decades, each master specializing in one technique -- carving, joinery, finishing. Then someone brings in a general-purpose CNC machine that, with enough examples and electricity, learns to do all those tasks and produces better furniture than any single specialist. AlexNet was that machine for computer vision. Before 2012, image classification pipelines relied on hand-engineered features (SIFT, HOG) fed into shallow classifiers (SVMs). AlexNet showed that an end-to-end trained deep CNN could learn features directly from pixels and crush the competition.

AlexNet was designed by Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton at the University of Toronto. It achieved a top-5 error rate of 16.4% on the ImageNet LSVRC-2012 challenge, compared to 26.2% for the second-place entry -- a margin so large it effectively ended the debate about whether deep learning was viable for large-scale vision tasks.

## How It Works

### Architecture

AlexNet processes $224 \times 224 \times 3$ RGB images through 5 convolutional layers and 3 fully connected layers:

| Layer | Type | Filters | Kernel | Stride | Output Size |
|-------|------|---------|--------|--------|-------------|
| 1 | Conv + ReLU | 96 | 11x11 | 4 | 55x55x96 |
| 2 | Max Pool | -- | 3x3 | 2 | 27x27x96 |
| 3 | Conv + ReLU | 256 | 5x5 | 1 | 27x27x256 |
| 4 | Max Pool | -- | 3x3 | 2 | 13x13x256 |
| 5 | Conv + ReLU | 384 | 3x3 | 1 | 13x13x384 |
| 6 | Conv + ReLU | 384 | 3x3 | 1 | 13x13x384 |
| 7 | Conv + ReLU | 256 | 3x3 | 1 | 13x13x256 |
| 8 | Max Pool | -- | 3x3 | 2 | 6x6x256 |
| 9 | FC + ReLU | 4096 | -- | -- | 4096 |
| 10 | FC + ReLU | 4096 | -- | -- | 4096 |
| 11 | FC + Softmax | 1000 | -- | -- | 1000 |

Total parameters: approximately 60 million, making it the largest CNN trained at scale at the time.

### Key Innovations

**ReLU Activation**: AlexNet used $f(x) = \max(0, x)$ instead of sigmoid or tanh. ReLU trained roughly 6x faster on CIFAR-10, reaching 25% training error in far fewer epochs. This was critical for making deep networks trainable at scale.

**GPU Training**: The network was split across two NVIDIA GTX 580 GPUs (3 GB memory each). Certain layers communicated across GPUs while others operated independently. Layers 3, 4, and 5 only connected to feature maps on the same GPU, while layers 1 and 2 communicated across GPUs. Training took 5--6 days on 1.2 million ImageNet images.

**Overlapping Pooling**: Max pooling with $3 \times 3$ windows and stride 2 (overlapping by 1 pixel) reduced top-1 and top-5 error by 0.4% and 0.3% compared to non-overlapping $2 \times 2$ pooling.

**Local Response Normalization (LRN)**: A form of lateral inhibition that normalized activations across adjacent feature maps at the same spatial position. This reduced top-1 error by 1.4%. LRN has since been superseded by batch normalization and is rarely used today.

**Dropout**: Applied with probability 0.5 in the two fully connected layers during training. This roughly doubled the number of iterations needed for convergence but substantially reduced overfitting. Without dropout, the network exhibited substantial overfitting given that the FC layers alone contained ~58M parameters trained on 1.2M images.

### Data Augmentation

- Random $224 \times 224$ crops from $256 \times 256$ images (and horizontal flips), generating a 2048x augmentation factor at test time (10 crops).
- PCA-based color jittering: adding multiples of the principal components of RGB pixel values, reducing top-1 error by over 1%.

### Weight Initialization

The convolutional layers were initialized with zero-mean Gaussian random weights with standard deviation 0.01. Biases in layers 2, 4, and 5 were initialized to 1 (to provide positive inputs to ReLU early in training), while biases in the remaining layers were initialized to 0. This careful initialization was necessary because more principled methods like He initialization had not yet been developed.

## Why It Matters

1. **Launched the deep learning era in computer vision.** The 10-percentage-point gap over the next best method on ImageNet 2012 convinced the field that CNNs trained on GPUs were the path forward.
2. **Demonstrated the value of scale**: 60M parameters, 1.2M training images, and GPU computation -- a recipe that has only grown in scale since.
3. **Established foundational techniques** (ReLU, dropout, data augmentation, GPU training) that became standard practice in virtually all subsequent architectures.
4. **Transfer learning**: Features from AlexNet's intermediate layers proved highly transferable to other tasks (Donahue et al., 2014), initiating the practice of fine-tuning pretrained CNNs.
5. **Sparked industry investment.** After AlexNet's success, major technology companies (Google, Facebook, Microsoft, Baidu) rapidly expanded their deep learning research teams, accelerating progress across the entire field.
6. **Validated the ImageNet benchmark.** AlexNet proved that large-scale benchmarks with millions of labeled images could drive meaningful architectural progress, establishing ImageNet as the standard proving ground for the next several years of CNN research.

## Key Technical Details

- **Top-5 error**: 16.4% (single model), 15.3% (ensemble of 7 models).
- **Top-1 error**: 38.1% (single model).
- **Parameters**: ~60 million, with the vast majority (~58M) in the three fully connected layers.
- **FLOPs**: ~720 million per forward pass.
- **Training**: SGD with momentum 0.9, weight decay $5 \times 10^{-4}$, batch size 128, initial learning rate 0.01 reduced by 10x when validation error plateaued. Training ran for approximately 90 epochs.
- **Input preprocessing**: Images resized so the shorter side was 256 pixels, then center-cropped to $256 \times 256$; mean pixel value subtracted.
- **The FC layers** (layers 9-10) each have $6 \times 6 \times 256 \times 4096 \approx 37.7$M parameters, dominating the parameter count.
- **Dataset**: ImageNet LSVRC-2012 with 1.2 million training images, 50,000 validation images, and 150,000 test images across 1,000 classes.
- **Historical context**: The second-place entry (ISI) achieved 26.2% top-5 error using hand-crafted SIFT features with Fisher vector encoding and SVMs -- a fundamentally different approach.
- **Visualization**: Zeiler and Fergus (2014) later visualized AlexNet's learned features, confirming that layer 1 learned oriented edges and color gradients, layer 2 learned corner and edge conjunctions, and deeper layers captured object parts and full objects.

## Common Misconceptions

- **"AlexNet invented CNNs."** Convolutional neural networks were introduced by LeCun et al. in the late 1980s (LeNet). AlexNet's contribution was demonstrating that scaling CNNs to large datasets with GPU training was dramatically effective.
- **"AlexNet's architecture is still competitive."** By modern standards, AlexNet is quite shallow and uses large kernels (11x11) that are parameter-inefficient. On ImageNet, it has been surpassed by over 12 percentage points in top-5 error.
- **"The two-GPU split was an architectural innovation."** It was a practical necessity driven by GPU memory constraints (3 GB per GTX 580). Modern GPUs have enough memory that such splitting is unnecessary for networks of this size.
- **"LRN was an important innovation."** Local Response Normalization provided modest gains (1.4% top-1) but was quickly superseded by batch normalization, which is simpler, more effective, and does not require tuning the LRN hyperparameters ($k$, $\alpha$, $\beta$, $n$).

## Connections to Other Concepts

- `convolution-in-neural-networks.md`: AlexNet stacks five convolutional layers with varying kernel sizes, demonstrating learned hierarchical features.
- `pooling-layers.md`: Used overlapping max pooling as a form of regularization.
- `receptive-field.md`: The large kernel sizes ($11 \times 11$, $5 \times 5$) combined with stride-4 in the first layer gave AlexNet a large receptive field despite relatively few layers.
- `vggnet.md`: Followed AlexNet's blueprint but replaced large kernels with uniform 3x3 convolutions, showing that depth was more important than kernel size.
- `inception.md`: GoogLeNet (2014) retained some of AlexNet's multi-scale philosophy but formalized it through parallel branches with dimensionality reduction.
- `dropout-and-regularization.md`: AlexNet was one of the first large-scale demonstrations of dropout as a regularizer.

## Further Reading

- Krizhevsky et al., "ImageNet Classification with Deep Convolutional Neural Networks" (2012) -- The original AlexNet paper.
- Donahue et al., "DeCAF: A Deep Convolutional Activation Feature for Generic Visual Recognition" (2014) -- Demonstrated transfer learning from AlexNet features.
- Russakovsky et al., "ImageNet Large Scale Visual Recognition Challenge" (2015) -- Comprehensive history and analysis of the ILSVRC benchmark.
- Zeiler & Fergus, "Visualizing and Understanding Convolutional Networks" (2014) -- Deconvolution-based visualization of AlexNet's learned feature hierarchy.
- Sermanet et al., "OverFeat: Integrated Recognition, Localization and Detection using Convolutional Networks" (2014) -- Extended the AlexNet framework to multi-scale classification and detection.
