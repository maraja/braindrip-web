# Vision Transformer Scaling

**One-Line Summary**: Vision Transformers follow predictable scaling laws where performance improves log-linearly with compute and data, but they require substantially more training data than CNNs to reach their potential -- a threshold that, once crossed, allows ViTs to decisively overtake convolutional models.

**Prerequisites**: Vision Transformer (ViT), transfer learning, computational complexity, ImageNet, pre-training

## What Is Vision Transformer Scaling?

Imagine two runners: one is a natural sprinter who starts fast but plateaus, and the other is a marathoner who starts slow but keeps improving. CNNs are the sprinter -- strong performance with modest data, but diminishing returns at scale. ViTs are the marathoner -- mediocre with limited data, but their performance keeps climbing as data and compute increase. Vision Transformer scaling studies quantify exactly where the crossover happens and how to allocate resources (model size, data, compute) optimally.

The study of scaling laws for vision Transformers was catalyzed by Dosovitskiy et al. (2020), who showed ViT underperforms CNNs on ImageNet-1K but dominates with JFT-300M pre-training. Subsequent work by Zhai et al. (2022) formalized these observations into power-law relationships and pushed the frontier to ViT-22B -- the largest dense vision Transformer to date.

## How It Works

### Scaling Laws for ViTs

Zhai et al. (2022) systematically varied model size and training data to establish scaling behavior. The key finding:

$$\text{Error} \propto \left(\frac{1}{C}\right)^\alpha$$

where $C$ is the total training compute (FLOPs) and $\alpha$ is a power-law exponent. For ViTs, $\alpha \approx 0.07$ -- meaning that each doubling of compute reduces error by approximately 5%. This relationship holds across several orders of magnitude.

### Data Requirements

The data-hunger of ViTs is well-documented:

| Pre-training Data | ViT-B/16 Top-1 | ResNet-152 Top-1 |
|-------------------|----------------|-----------------|
| ImageNet-1K (1.3M) | 79.7% | 82.0% |
| ImageNet-21K (14M) | 83.6% | 83.0% |
| JFT-300M (300M) | 84.2% | 83.5% (ceiling) |

The crossover point where ViT-B matches a comparable ResNet is roughly **10-30 million images**. Below this threshold, the CNN's inductive biases dominate. Above it, ViT's flexibility pays off.

Steiner et al. (2021) showed that training recipe improvements (augmentation, regularization) can partially compensate for data scarcity, shifting the crossover point downward:

- **Vanilla ViT-B on ImageNet-1K**: ~79.7%
- **ViT-B with improved recipe** (augmentation, weight decay, dropout): ~81.8%
- **DeiT-B with distillation**: ~83.4%

### Model Size Scaling

The ViT family spans a wide range of model sizes:

| Model | Params | Hidden Dim | Layers | Heads |
|-------|--------|-----------|--------|-------|
| ViT-Ti | 6M | 192 | 12 | 3 |
| ViT-S | 22M | 384 | 12 | 6 |
| ViT-B | 86M | 768 | 12 | 12 |
| ViT-L | 307M | 1024 | 24 | 16 |
| ViT-H | 632M | 1280 | 32 | 16 |
| ViT-g | 1.0B | 1408 | 40 | 16 |
| ViT-G | 1.8B | 1664 | 48 | 16 |
| ViT-22B | 22B | 6144 | 48 | 32 |

Key observations from scaling studies:

- **Larger models are more data-efficient**: ViT-L at 10M images outperforms ViT-B at 30M images, because larger models extract more information per sample.
- **Diminishing returns without sufficient data**: Scaling ViT-H on ImageNet-1K alone yields marginal gains over ViT-L. The model needs more data to exploit its capacity.
- **Compute-optimal scaling**: Given a fixed compute budget, it is better to train a moderately large model on more data than to train a very large model on less data (analogous to Chinchilla scaling in NLP).

### ViT-22B

ViT-22B (Dehghani et al., 2023, Google) is the largest dense vision Transformer:

- **22 billion parameters** with hidden dimension 6144 and 48 layers
- Trained on JFT-4B (4 billion images)
- Achieves **89.5% top-1** on ImageNet (frozen features + linear probe) -- remarkable without fine-tuning
- Uses **parallel attention and FFN** (computing attention and MLP in parallel rather than sequentially), following PaLM's architecture
- Training required custom model parallelism across TPU v4 pods
- QK normalization was necessary to stabilize training at this scale

ViT-22B demonstrates that vision Transformers continue to improve well into the tens of billions of parameters, with no obvious saturation.

### When ViTs Overtake CNNs

The crossover depends on multiple factors:

**On classification (ImageNet fine-tuned)**:
- With ImageNet-1K only: ViT-B underperforms ResNet-152; DeiT narrows the gap but doesn't clearly win.
- With ImageNet-21K (14M images): ViT-L surpasses all ResNet variants.
- With 100M+ images: ViTs dominate decisively.

**On dense prediction (detection, segmentation)**:
- Swin-L pre-trained on ImageNet-22K set COCO and ADE20K records by 2021.
- With sufficient pre-training, ViT-based detectors (ViTDet, Zhai et al.) surpass CNN-based detectors.

**On robustness and distribution shift**:
- ViTs are more robust to texture bias and common corruptions than CNNs (Naseer et al., 2021).
- This advantage grows with model size and pre-training data.

**The general rule**: ViTs overtake CNNs when pre-training data exceeds ~10M images or when model size exceeds ~300M parameters (with appropriate data). Below these thresholds, CNNs or hybrid models are typically preferred.

## Why It Matters

1. **Resource allocation guidance**: Scaling laws help practitioners decide whether to invest in a larger model, more data, or longer training.
2. **No performance ceiling in sight**: ViT-22B shows no saturation, suggesting that future models with more data could continue improving.
3. **Foundation model viability**: Large-scale ViTs (CLIP, DINOv2) serve as general-purpose vision backbones precisely because they scale well.
4. **Training infrastructure planning**: Understanding compute requirements helps organizations budget GPU/TPU hours and select appropriate hardware.

## Key Technical Details

- **Compute-optimal ViT training** follows an approximate rule: model parameters and training tokens should scale roughly proportionally. Under-training a large model wastes parameters; over-training a small model wastes compute.
- ViT-22B uses **QK normalization** ($\ell_2$ normalization of queries and keys before the dot product) to prevent attention logit explosion at large hidden dimensions.
- At the 22B scale, **parallel attention/FFN** saves ~15% wall-clock time with negligible accuracy loss.
- Training ViT-H on JFT-300M for 300 epochs takes approximately **10,000 TPU-v3 core-hours**. Training ViT-22B on JFT-4B requires orders of magnitude more.
- Resolution scaling (fine-tuning at higher resolution, e.g., 384 or 518) provides 0.5-2.0% accuracy improvement across all model sizes, but at quadratic cost increase.
- **FlexiViT** (Beyer et al., 2023) trains a single ViT that works with multiple patch sizes at inference time, allowing dynamic accuracy-efficiency tradeoffs without retraining.

## Common Misconceptions

- **"ViTs always need more data than CNNs."** This is true at initialization, but with modern training recipes (DeiT augmentations, MAE pre-training), ViT-B is competitive with ResNets on ImageNet-1K. The data gap is a function of training strategy, not just architecture.
- **"Bigger is always better."** Without sufficient training data, a larger ViT will overfit or undertrain. ViT-H trained only on ImageNet-1K underperforms ViT-L trained with the same recipe, because the additional capacity has no useful signal to absorb.
- **"Scaling laws mean we can predict exact accuracy at any scale."** Scaling laws describe trends, not point predictions. They are log-linear approximations that break down at extremes and are sensitive to training recipe changes, data quality, and distribution shifts.
- **"ViT-22B is the practical limit."** Dense models face diminishing returns, but mixture-of-experts, sparse models, and efficient architectures continue to push the frontier beyond what dense scaling alone achieves.

## Connections to Other Concepts

- **Vision Transformer (ViT)**: Scaling laws describe how ViT's performance evolves as its size grows.
- **DeiT**: Shows how training strategy (distillation, augmentation) partially compensates for data scarcity, effectively shifting the scaling curve.
- **Swin Transformer**: Swin V2 scales to 3B parameters with windowed attention, demonstrating that efficient attention mechanisms enable scaling to high resolutions.
- **Masked Image Modeling**: MAE and BEiT enable effective pre-training at large scale without labels, making it practical to train massive ViTs on unlabeled data.
- **Hybrid CNN-Transformer**: At smaller scales (under ~10M training images), hybrids offer better accuracy-efficiency tradeoffs than pure ViTs.

## Further Reading

- Zhai et al., "Scaling Vision Transformers" (2022) -- Systematic study of ViT scaling laws, introducing ViT-G.
- Dehghani et al., "Scaling Vision Transformers to 22 Billion Parameters" (2023) -- ViT-22B architecture and training.
- Dosovitskiy et al., "An Image is Worth 16x16 Words" (2020) -- Initial data-scaling experiments showing ViT vs. CNN crossover.
- Steiner et al., "How to Train Your ViT?" (2021) -- Training recipe analysis showing how augmentation shifts the data requirement.
- Beyer et al., "FlexiViT: One Model for All Patch Sizes" (2023) -- Training ViTs that work across multiple patch sizes.
- Cherti et al., "Reproducible scaling laws for contrastive language-image learning" (2023) -- Scaling laws for CLIP-style ViT training.
