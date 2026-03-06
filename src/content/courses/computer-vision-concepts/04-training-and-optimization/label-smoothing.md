# Label Smoothing

**One-Line Summary**: Label smoothing replaces hard one-hot target vectors with soft distributions, preventing the model from becoming overconfident and improving generalization and calibration.

**Prerequisites**: Cross-entropy loss, softmax function, one-hot encoding, overfitting

## What Is Label Smoothing?

Imagine a teacher grading essays with only two marks: perfect (100%) or zero. This extreme grading forces students to game the rubric rather than deeply understand the material. Label smoothing is the equivalent of grading on a nuanced scale -- instead of demanding the model assign 100% confidence to the correct class, it asks for something like 90%, distributing the remaining probability mass across all other classes. This small change discourages the model from learning to produce extreme logits and leads to better-calibrated predictions.

Formally, given $K$ classes and a ground truth class $k$, the standard one-hot target is $y_i = \mathbf{1}_{i=k}$. With label smoothing parameter $\epsilon$, the target becomes:

$$y_i^{\text{LS}} = (1 - \epsilon) \cdot \mathbf{1}_{i=k} + \frac{\epsilon}{K}$$

The typical value is $\epsilon = 0.1$, meaning the correct class gets probability $0.9 + 0.1/K \approx 0.9$ and each incorrect class gets $0.1/K \approx 0.0001$ for ImageNet ($K=1000$).

## How It Works

### Mechanism

The cross-entropy loss with label smoothing becomes:

$$\mathcal{L}_{\text{LS}} = (1 - \epsilon) \cdot \mathcal{L}_{\text{CE}}(p, y) + \epsilon \cdot \mathcal{L}_{\text{CE}}(p, u)$$

where $u = 1/K$ is the uniform distribution. This is equivalent to interpolating between the standard cross-entropy and the KL divergence from the uniform distribution:

$$\mathcal{L}_{\text{LS}} = -\sum_{i=1}^{K} y_i^{\text{LS}} \log p_i$$

### Effect on Logits

Without label smoothing, the cross-entropy loss drives the logit of the correct class toward $+\infty$ and all other logits toward $-\infty$. With label smoothing, the optimal logits have a finite gap between the correct and incorrect classes. Muller et al. (2019) showed that label smoothing encourages the penultimate-layer representations to form tighter, more separated clusters.

```python
# PyTorch implementation
loss_fn = nn.CrossEntropyLoss(label_smoothing=0.1)

# Equivalent manual implementation
def label_smoothing_loss(logits, target, epsilon=0.1):
    K = logits.size(-1)
    log_probs = F.log_softmax(logits, dim=-1)
    nll_loss = -log_probs.gather(dim=-1, index=target.unsqueeze(1)).squeeze(1)
    smooth_loss = -log_probs.mean(dim=-1)
    return (1 - epsilon) * nll_loss + epsilon * smooth_loss
```

### Choosing Epsilon

| Epsilon | Behavior |
|---|---|
| 0.0 | Standard hard targets (no smoothing) |
| 0.05 | Light smoothing, minimal effect |
| 0.1 | Standard choice, used in most papers |
| 0.2 | Aggressive smoothing, occasionally used for noisy labels |
| 1.0 | Uniform targets, model learns nothing useful |

The choice of $\epsilon$ should reflect the expected label noise. For clean datasets like ImageNet, $\epsilon = 0.1$ is standard. For datasets with known annotation noise, higher values (0.2-0.4) can help.

## Why It Matters

1. Label smoothing improved Inception-v2 top-1 accuracy by ~0.2% on ImageNet (Szegedy et al., 2016) with zero computational overhead.
2. It significantly improves model calibration -- the predicted probabilities better reflect true likelihoods, which is critical for decision-making systems.
3. It reduces sensitivity to noisy or incorrect labels by not demanding the model assign full confidence to any single class.
4. It penalizes large logit magnitudes, which has a regularization effect similar to but distinct from weight decay.
5. It is a standard component in virtually all modern training recipes (EfficientNet, ViT, DeiT, Swin Transformer).

## Key Technical Details

- Computational cost: effectively zero. It changes only the target vector, not the forward or backward pass complexity.
- Label smoothing + knowledge distillation interaction: Muller et al. (2019) found that label smoothing in the teacher can hurt the student's performance because it erases the "dark knowledge" (inter-class similarity information) in the teacher's soft predictions. Use unsmoothed teachers for distillation.
- For binary classification ($K=2$) with $\epsilon = 0.1$: the positive target becomes 0.95 and the negative becomes 0.05.
- Label smoothing is incompatible with techniques that rely on hard targets, such as certain forms of confidence-based sample weighting.
- In PyTorch >= 1.10, label smoothing is built into `nn.CrossEntropyLoss` via the `label_smoothing` parameter.

## Common Misconceptions

- **"Label smoothing is just a minor trick."** It is a small code change but has a meaningful and consistent effect on generalization, calibration, and robustness. It appears in virtually every competitive training recipe.
- **"Label smoothing and temperature scaling serve the same purpose."** Temperature scaling adjusts confidence at test time without changing training. Label smoothing changes the training objective itself, producing representations with different geometry (Muller et al., 2019).
- **"Higher epsilon is always more regularization."** Beyond a certain point, excessive smoothing destroys the training signal. The model struggles to learn when the correct class target is barely above the incorrect class targets.

## Connections to Other Concepts

- **Knowledge Distillation**: Soft targets from a teacher serve a similar function to label smoothing but carry richer inter-class information. However, using label smoothing in the teacher can degrade distillation quality.
- **Mixup and CutMix**: These techniques also produce soft labels by blending ground truths, providing a data-driven form of label smoothing.
- **Dropout and Regularization**: Label smoothing regularizes the output distribution, while dropout regularizes the hidden representations -- they are complementary.
- **Learning Rate Scheduling**: Label smoothing is typically combined with cosine annealing in modern training recipes.

## Further Reading

- Szegedy et al., "Rethinking the Inception Architecture" (2016) -- Introduced label smoothing as a regularization technique.
- Muller et al., "When Does Label Smoothing Help?" (2019) -- Analyzes how label smoothing changes representation geometry and its interaction with distillation.
- Pereyra et al., "Regularizing Neural Networks by Penalizing Confident Output Distributions" (2017) -- Connects label smoothing to confidence penalty and entropy regularization.
