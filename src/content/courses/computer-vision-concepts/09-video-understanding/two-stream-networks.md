# Two-Stream Networks

**One-Line Summary**: Two-stream networks process video through parallel spatial (RGB) and temporal (optical flow) pathways, fusing their predictions to capture both appearance and motion for action recognition.

**Prerequisites**: Convolutional neural networks, optical flow, transfer learning, softmax classification, video representation

## What Is Two-Stream Networks?

Imagine watching a soccer game with one eye seeing only still photographs and the other eye seeing only motion trails. The photograph eye recognizes the ball, the players, and the field. The motion-trail eye detects who is running, the direction of a kick, and the speed of the ball. Your brain fuses both signals to understand the full action. Two-stream networks do exactly this: one CNN processes static frames (spatial stream) while another processes optical flow (temporal stream), and their outputs are combined.

Formally introduced by Simonyan and Zisserman (2014), two-stream networks decompose video understanding into appearance recognition and motion recognition, each handled by a separate deep convolutional network. This design was motivated by neuroscience evidence of the ventral ("what") and dorsal ("where/how") visual pathways in the human visual cortex. The architecture achieved 88.0% accuracy on UCF-101, a substantial leap over single-stream approaches at the time.

## How It Works

### Spatial Stream

The spatial stream is a standard image classification CNN (originally VGG-M or VGG-16, later ResNets) applied to a single RGB frame sampled from the video clip. It captures appearance information: objects, scenes, textures, and poses. The input is a single frame of shape $H \times W \times 3$.

Since individual frames already contain strong cues for many actions (e.g., a basketball court for "playing basketball"), the spatial stream alone achieves reasonable accuracy -- around 73% on UCF-101 with VGG-16.

### Temporal Stream

The temporal stream receives a stack of $L$ consecutive optical flow fields as input. Each flow field has two channels $(u, v)$ representing horizontal and vertical displacement. With $L=10$ frames, the input shape is $H \times W \times 20$.

The optical flow is typically pre-computed using TV-L1 or Farneback algorithms. The flow values are truncated to $[-20, 20]$ pixels and rescaled to $[0, 255]$ for storage as images. This stream captures pure motion patterns independent of appearance.

The temporal stream alone achieves approximately 83% on UCF-101, demonstrating that motion information is highly discriminative for action recognition.

### Fusion Strategies

The two streams must be combined to produce a final prediction. Key approaches:

**Late fusion (score averaging)**: The simplest and original approach. Each stream produces a softmax probability distribution over classes, and the final prediction is their (optionally weighted) average:

$$p(c | v) = \frac{1}{2}\left[p_{\text{spatial}}(c | v) + p_{\text{temporal}}(c | v)\right]$$

or with learned weight $\lambda$:

$$p(c | v) = \lambda \cdot p_{\text{spatial}}(c | v) + (1 - \lambda) \cdot p_{\text{temporal}}(c | v)$$

Typical optimal $\lambda$ values weight the temporal stream higher: $\lambda \approx 0.4$ for spatial.

**SVM fusion**: Concatenate the $L_2$-normalized softmax scores from both streams and train a multi-class SVM. This yielded ~0.5% improvement over simple averaging.

**Convolutional fusion (Feichtenhofer et al., 2016)**: Fuse intermediate feature maps rather than final scores. Spatial correspondence is maintained by connecting feature maps at a specific convolutional layer (e.g., after conv5). The fused representation is:

$$\mathbf{x}^{\text{fuse}} = f(\mathbf{x}^{\text{spatial}}, \mathbf{x}^{\text{temporal}})$$

where $f$ can be element-wise sum, max, or concatenation followed by a $1 \times 1$ convolution. This improved accuracy by 1--2% over late fusion.

### Training Details

- Both streams are initialized from ImageNet-pretrained weights (the temporal stream adapts the first convolutional layer to accept 20-channel input by averaging the pretrained 3-channel weights)
- Training uses SGD with momentum 0.9, initial learning rate 0.01, reduced by factor 10 at plateaus
- Spatial stream is prone to overfitting on small datasets; dropout (0.5--0.9) and data augmentation are critical
- Temporal stream converges faster and generalizes better due to the regularity of flow patterns

## Why It Matters

1. **Established the paradigm**: Two-stream processing dominated video understanding from 2014 to approximately 2018 and remains a conceptual foundation for modern architectures like SlowFast.
2. **Demonstrated motion importance**: Proved that explicit motion representation (optical flow) provides complementary information to appearance, boosting accuracy by 10--15% over single-stream models.
3. **Enabled transfer learning for video**: Showed that ImageNet-pretrained 2D CNNs could be effectively repurposed for video tasks without training 3D convolutions from scratch, which was prohibitively expensive at the time.
4. **Benchmark results**: Achieved state-of-the-art on UCF-101 (88.0%) and HMDB-51 (59.4%) upon release, later improved to 94.2% and 69.2% with deeper networks and temporal segment networks.

## Key Technical Details

- Original architecture: Two VGG-M-2048 networks with 8 layers each
- Optical flow input: $L=10$ stacked frames, yielding 20-channel input, truncated to $[-20, 20]$ pixels
- UCF-101 accuracy: 88.0% (original), improved to 94.2% with TSN and BN-Inception
- HMDB-51 accuracy: 59.4% (original), improved to 69.4% with TSN
- Flow pre-computation cost: TV-L1 at ~0.06s per frame pair on GPU (OpenCV CUDA), ~0.5s on CPU
- Storage overhead: Optical flow doubles the storage requirement (flow images stored as JPEG/PNG)
- Inference requires computing flow at test time or pre-caching, adding significant latency
- Two-stream fusion with ResNet-152 backbone: 94.5% on UCF-101

## Common Misconceptions

- **"Two-stream networks require optical flow at inference time and are therefore impractical."** While the original formulation does require flow, later work (e.g., hidden two-stream by Zhu et al., 2017) learned to estimate flow internally, and architectures like I3D learn motion implicitly from RGB. The two-stream concept has been internalized into modern architectures.
- **"The spatial stream is less important than the temporal stream."** Their relative importance is task-dependent. For actions defined by motion (e.g., "clapping"), the temporal stream dominates. For actions defined by scene context (e.g., "cooking"), the spatial stream is critical. Fusion consistently outperforms either stream alone.
- **"Late fusion is naive and always inferior."** Late fusion is remarkably robust. Feichtenhofer et al. (2016) showed that early and mid-level fusion only improved accuracy by 1--2% over late fusion, at the cost of significant architectural complexity.

## Connections to Other Concepts

- `optical-flow-estimation.md`: Provides the temporal stream's input; quality of flow affects recognition accuracy.
- `video-representation.md`: Two-stream networks define two distinct video representations (RGB frames and flow stacks).
- `3d-convolutions.md`: I3D can be seen as a single-stream architecture that implicitly learns both appearance and motion, effectively internalizing the two-stream idea.
- `action-recognition.md`: The primary evaluation task for two-stream networks.
- **SlowFast Networks**: Conceptual descendant that replaces the appearance/motion split with a fast/slow frame rate split.

## Further Reading

- Simonyan & Zisserman, "Two-Stream Convolutional Networks for Action Recognition in Videos" (2014) -- The foundational paper introducing the two-stream architecture.
- Feichtenhofer et al., "Convolutional Two-Stream Network Fusion" (2016) -- Systematic study of spatial and temporal stream fusion strategies.
- Wang et al., "Temporal Segment Networks: Towards Good Practices for Deep Action Recognition" (2016) -- Extended two-stream with segment-based sampling for long-range modeling.
- Carreira & Zisserman, "Quo Vadis, Action Recognition? A New Model and the Kinetics Dataset" (2017) -- I3D inflated 2D two-stream filters into 3D, bridging two-stream and 3D convolution approaches.
