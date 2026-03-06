# Progressive Resizing

**One-Line Summary**: Progressive resizing starts training on small images and gradually increases resolution, achieving faster convergence and often better accuracy by providing a natural curriculum from coarse to fine features.

**Prerequisites**: Convolutional neural networks, image resizing and interpolation, learning rate scheduling, transfer learning, batch normalization

## What Is Progressive Resizing?

Imagine learning to paint. An instructor would not hand you a 4K canvas on day one -- you would start with small sketches to learn composition and shape, then progressively move to larger canvases where you refine details. Progressive resizing applies this curriculum to CNN training: begin with low-resolution images (e.g., 128x128) where batches are large and forward passes are fast, then increase to the target resolution (e.g., 224x224 or higher) for the final phase of training. The model first learns coarse features cheaply, then fine-tunes spatial details.

This technique was popularized by the fast.ai library (Howard & Gugger, 2020) and became a key component of several competition-winning solutions.

## How It Works

### Basic Protocol

A typical progressive resizing schedule for ImageNet:

| Phase | Resolution | Epochs | Batch Size | Effective Throughput |
|---|---|---|---|---|
| 1 | 128x128 | 0-30 | 512 | ~4x baseline |
| 2 | 192x192 | 30-60 | 256 | ~2x baseline |
| 3 | 224x224 | 60-90 | 128 | 1x baseline |

Since computational cost scales roughly as $O(\text{resolution}^2)$, a 128x128 image requires ~3.1x fewer FLOPs per sample than 224x224. Combined with the ability to fit larger batch sizes in GPU memory, the throughput advantage of early phases is substantial.

### Implementation

```python
# Progressive resizing training loop sketch
phases = [
    {'size': 128, 'epochs': 30, 'lr': 0.1},
    {'size': 192, 'epochs': 30, 'lr': 0.05},
    {'size': 224, 'epochs': 30, 'lr': 0.01},
]

for phase in phases:
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(phase['size']),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize(mean, std),
    ])
    train_dataset.transform = train_transform
    train_loader = DataLoader(train_dataset, batch_size=auto_batch_size(phase['size']))

    # Adjust learning rate for new phase
    for param_group in optimizer.param_groups:
        param_group['lr'] = phase['lr']

    for epoch in range(phase['epochs']):
        train_one_epoch(model, train_loader, optimizer)
```

### Resolution Changes and BN Statistics

When resolution changes, the activation statistics shift. There are two strategies:

1. **Reset BN running statistics**: Run a few forward passes on the new resolution to re-estimate running mean and variance before resuming training.
2. **Freeze BN layers**: Keep BN in eval mode during the transition, relying on training-mode batch statistics to adapt naturally. This is less common but works for short transitions.

### Connection to EfficientNet Compound Scaling

EfficientNet (Tan & Le, 2019) showed that resolution, width, and depth should scale together. Progressive resizing can be seen as a temporal version of this -- starting at a lower point in the scaling curve and climbing up during training.

### FixRes: Addressing the Train-Test Resolution Discrepancy

Touvron et al. (2019) demonstrated that models trained at one resolution and tested at another suffer from a distribution shift in the crop statistics. Training at 224x224 with random resized crop means the model typically sees objects at a certain scale. Testing at 288x288 or 384x384 changes this scale. Their FixRes approach fine-tunes the classifier head (and optionally the last few layers) at the test resolution for a few epochs to close this gap, improving top-1 by 1-2%.

## Why It Matters

1. Progressive resizing reduced total ImageNet training time by approximately 30-40% in fast.ai experiments while maintaining accuracy.
2. It enables training at final resolutions (e.g., 384x384, 512x512) that would otherwise be prohibitively expensive if used from the start.
3. The coarse-to-fine curriculum can act as regularization: the model is forced to learn general features before memorizing fine-grained details.
4. It is particularly effective for fine-tuning pretrained models, where starting at a low resolution provides a gentle warm-up for the new task.
5. Competition winners in Kaggle and elsewhere routinely use progressive resizing as part of their training pipeline.

## Key Technical Details

- The FLOP savings are quadratic in the resolution ratio: training at 128 instead of 224 is $(224/128)^2 \approx 3.1$x cheaper per image.
- When increasing resolution, reduce the learning rate. The shift in feature statistics is similar to a domain change, and a high LR can cause instability.
- Batch size can often be automatically increased at lower resolutions to fully utilize GPU memory, further improving throughput via better hardware utilization.
- For detection and segmentation, progressive resizing is less straightforward because anchor sizes and feature pyramid levels are resolution-dependent. Some practitioners pre-compute anchors per phase.
- A warmup of 1-2 epochs at each new resolution (with a temporarily reduced LR) helps stabilize training after the transition.
- Progressive resizing does NOT change the model architecture -- only the input pipeline changes.

## Common Misconceptions

- **"Progressive resizing only saves time, it does not improve accuracy."** In several cases (particularly with strong augmentation), progressive resizing improves final accuracy by 0.1-0.5% because the coarse-to-fine curriculum provides implicit regularization.
- **"You can just train at low resolution and test at high resolution."** The train-test resolution discrepancy causes a significant accuracy drop (1-3%) due to mismatched crop statistics and object scales. Fine-tuning at the test resolution is necessary (Touvron et al., 2019).
- **"This only works for classification."** Progressive resizing has been successfully applied to segmentation, super-resolution, and generative models (Progressive GAN explicitly used this idea for high-resolution image synthesis).

## Connections to Other Concepts

- **Batch Normalization**: Resolution changes affect BN statistics; re-calibration is needed at each phase transition.
- **Learning Rate Scheduling**: Progressive resizing introduces a schedule within a schedule -- the learning rate often resets or drops at each resolution increase.
- **Transfer Learning**: Fine-tuning a pretrained model with progressive resizing is a common and effective pattern.
- **Data Augmentation**: Random resized crop parameters may need adjustment at different resolutions to maintain consistent augmentation intensity.

## Further Reading

- Howard & Gugger, "Fastai: A Layered API for Deep Learning" (2020) -- Popularized progressive resizing as part of the fast.ai training methodology.
- Touvron et al., "Fixing the Train-Test Resolution Discrepancy" (2019) -- Analyzed and resolved the resolution mismatch between training and testing.
- Tan & Le, "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks" (2019) -- Compound scaling of resolution, width, and depth.
- Karras et al., "Progressive Growing of GANs for Improved Quality, Stability, and Variation" (2018) -- Applied progressive resolution to generative models.
