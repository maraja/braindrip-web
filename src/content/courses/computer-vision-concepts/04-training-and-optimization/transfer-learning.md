# Transfer Learning

**One-Line Summary**: Transfer learning reuses features learned on a large source dataset (typically ImageNet) to solve a different target task, eliminating the need to train from scratch and dramatically reducing data and compute requirements.

**Prerequisites**: Convolutional neural networks, feature hierarchies in deep networks, ImageNet classification, gradient descent

## What Is Transfer Learning?

Consider a radiologist who spent years learning general anatomy before specializing in chest X-rays. They did not forget everything about anatomy when they switched focus -- they built upon it. Transfer learning follows the same principle: a network trained on ImageNet has already learned to detect edges, textures, parts, and objects. Rather than discarding that knowledge, we reuse it as a starting point for a new task, fine-tuning only what needs to change.

Formally, transfer learning assumes a source domain $\mathcal{D}_S$ with task $\mathcal{T}_S$ and a target domain $\mathcal{D}_T$ with task $\mathcal{T}_T$. The goal is to improve the learning of the target predictive function $f_T$ using knowledge from $\mathcal{D}_S$ and $\mathcal{T}_S$, where $\mathcal{D}_S \neq \mathcal{D}_T$ or $\mathcal{T}_S \neq \mathcal{T}_T$.

## How It Works

### Why ImageNet Features Transfer

Yosinski et al. (2014) showed that the first layers of CNNs learn general features (Gabor-like filters, color blobs) that are nearly identical across different tasks and datasets. Deeper layers become increasingly task-specific. This hierarchy means early-layer features are almost universally useful.

### Two Strategies

**Feature Extraction**: Freeze all pretrained layers, remove the final classification head, and train only a new head on the target data. The pretrained network acts as a fixed feature extractor.

```python
# Feature extraction with PyTorch
model = torchvision.models.resnet50(weights=ResNet50_Weights.IMAGENET1K_V2)
for param in model.parameters():
    param.requires_grad = False  # Freeze everything

model.fc = nn.Linear(2048, num_target_classes)  # New trainable head
```

**Fine-Tuning**: Initialize from pretrained weights, then train the entire network (or a subset of layers) on the target data with a small learning rate. This allows the features to adapt to the target domain.

```python
# Fine-tuning with differential learning rates
model = torchvision.models.resnet50(weights=ResNet50_Weights.IMAGENET1K_V2)
model.fc = nn.Linear(2048, num_target_classes)

optimizer = torch.optim.SGD([
    {'params': model.layer1.parameters(), 'lr': 1e-5},
    {'params': model.layer2.parameters(), 'lr': 1e-5},
    {'params': model.layer3.parameters(), 'lr': 1e-4},
    {'params': model.layer4.parameters(), 'lr': 1e-4},
    {'params': model.fc.parameters(), 'lr': 1e-3},
])
```

### Decision Guide

| Target dataset size | Similarity to source | Strategy |
|---|---|---|
| Small (< 1k) | High | Feature extraction |
| Small (< 1k) | Low | Feature extraction from earlier layers |
| Large (> 10k) | High | Fine-tune entire network |
| Large (> 10k) | Low | Fine-tune with caution, possibly from scratch |

### Beyond ImageNet Pretraining

- **Self-supervised pretraining** (MoCo, MAE) often produces features that transfer better than supervised ImageNet features, especially to domains far from natural images.
- **CLIP** (Radford et al., 2021) pretrains on 400M image-text pairs from the internet, yielding features that transfer to a wider range of tasks with zero or few shots.
- **Domain-specific pretraining**: Medical imaging models pretrained on large radiology datasets transfer better to medical tasks than ImageNet-pretrained models.

## Why It Matters

1. Training a ResNet-50 from scratch on ImageNet takes ~90 epochs and ~14 hours on 8 V100 GPUs. Fine-tuning on a target task typically takes 10-30 epochs on a single GPU.
2. On datasets with fewer than 5,000 images, transfer learning consistently outperforms training from scratch by 10-30% accuracy.
3. It democratizes deep learning -- practitioners without massive compute budgets can achieve strong results by starting from publicly available pretrained weights.
4. Transfer learning is the default approach in essentially all applied computer vision, from medical imaging to autonomous driving to satellite analysis.

## Key Technical Details

- Fine-tuning learning rates are typically 10-100x smaller than training from scratch (e.g., 1e-4 vs. 1e-2 for SGD).
- The new classification head should use a higher learning rate (10x) than the pretrained backbone.
- Input preprocessing must match the pretrained model's expectations (e.g., ImageNet mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]).
- Kornblith et al. (2019) showed that ImageNet accuracy is strongly correlated with transfer performance -- better ImageNet models generally transfer better.
- For detection and segmentation, the pretrained backbone is combined with task-specific heads (FPN, decoder, etc.) and fine-tuned end-to-end.
- He et al. (2019) found that training from scratch can match fine-tuning on COCO detection given enough data and training time, but requires 2-3x more training iterations.

## Common Misconceptions

- **"You should always freeze early layers."** For domains very different from ImageNet (e.g., medical CT scans, satellite SAR imagery), even early features may need adaptation. Freezing can be suboptimal.
- **"Training from scratch is never competitive."** With sufficient data (>100k labeled images) and compute, training from scratch can match or exceed transfer learning, though it is rarely cost-effective.
- **"Any pretrained model will work."** The quality and domain of pretraining matter enormously. A model pretrained on ImageNet may transfer poorly to tasks with very different image statistics (e.g., depth maps, spectrograms).

## Connections to Other Concepts

- `self-supervised-pretraining.md`: Provides an alternative source of pretrained features that can outperform supervised ImageNet pretraining.
- `knowledge-distillation.md`: Can compress a large fine-tuned model into a smaller one deployable on edge devices.
- `batch-normalization.md`: BN statistics from pretraining may not match the target domain; consider freezing BN layers or using small batch sizes carefully during fine-tuning.
- `data-augmentation.md`: Strong augmentation during fine-tuning helps prevent overfitting to small target datasets.

## Further Reading

- Yosinski et al., "How Transferable Are Features in Deep Neural Networks?" (2014) -- Foundational analysis of feature transferability across layers.
- Kornblith et al., "Do Better ImageNet Models Transfer Better?" (2019) -- Systematic study of the correlation between source and target performance.
- He et al., "Rethinking ImageNet Pre-training" (2019) -- Shows training from scratch can be competitive given sufficient data and time.
- Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (2021) -- CLIP demonstrates broad transfer from image-text pretraining.
