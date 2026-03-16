# Learning Rate Scheduling

**One-Line Summary**: Learning rate scheduling systematically varies the learning rate during training -- typically warming up, then decaying -- to achieve faster convergence and better final accuracy than any fixed rate.

**Prerequisites**: Stochastic gradient descent, loss landscapes, mini-batch training, convergence theory basics

## What Is Learning Rate Scheduling?

Think of hiking down a mountain in fog. At first, you take large steps to cover ground quickly while you are far from the valley floor. As the terrain flattens and you suspect you are near the bottom, you shorten your steps to avoid overshooting the lowest point. A learning rate schedule does exactly this for gradient descent: it starts with a large step size for fast progress, then reduces it to enable fine-grained convergence.

The learning rate $\eta$ is the single most important hyperparameter in deep learning (Bengio, 2012). A fixed learning rate forces a compromise between early training speed and final precision. Scheduling removes this trade-off by adapting $\eta$ over the course of training.

## How It Works

### Step Decay

The simplest and historically most common schedule. Multiply the learning rate by a factor $\gamma$ at predetermined epochs:

$$\eta_t = \eta_0 \cdot \gamma^{\lfloor t / s \rfloor}$$

where $s$ is the step interval and $\gamma$ is typically 0.1. The classic ImageNet recipe: $\eta_0 = 0.1$, decay by 10x at epochs 30, 60, 90 (out of 90 total).

### Cosine Annealing

Loshchilov & Hutter (2017) proposed a smooth decay following a cosine curve:

$$\eta_t = \eta_{\min} + \frac{1}{2}(\eta_{\max} - \eta_{\min})\left(1 + \cos\left(\frac{t \cdot \pi}{T}\right)\right)$$

where $T$ is the total number of iterations and $\eta_{\min}$ is typically 0 or a small value like 1e-6. This has become the default schedule for most modern training recipes, including those for Vision Transformers.

### Cosine Annealing with Warm Restarts (SGDR)

Instead of a single cosine decay, periodically reset the learning rate to $\eta_{\max}$ and restart the cosine schedule. Each restart period $T_i$ can grow geometrically:

$$T_i = T_0 \cdot T_{\text{mult}}^{i}$$

Warm restarts allow the optimizer to escape local minima and explore different basins, and the snapshot models from each restart can be ensembled.

### Linear Warmup

Modern training typically begins with a short warmup phase where $\eta$ increases linearly from 0 (or a small value) to $\eta_{\max}$ over the first $W$ iterations:

$$\eta_t = \eta_{\max} \cdot \frac{t}{W}, \quad t \leq W$$

Warmup is essential when using large batch sizes (Goyal et al., 2017) because the initial gradient estimates from random weights are noisy and large steps would destabilize training. A typical warmup is 5-10 epochs for ImageNet, or 500-2000 iterations.

### One-Cycle Policy

Smith & Topin (2019) proposed a single cycle of learning rate that first increases from $\eta_{\min}$ to $\eta_{\max}$ over the first ~30% of training, then decreases back below $\eta_{\min}$ for the remainder:

```
LR: low --ramp up--> high --cosine decay--> very low
     |---- 30% ----||------- 70% ---------|
```

This "super-convergence" technique allows training at 5-10x higher peak learning rates and can reduce total training time by 70-90% compared to standard schedules.

```python
# PyTorch one-cycle scheduler
scheduler = torch.optim.lr_scheduler.OneCycleLR(
    optimizer,
    max_lr=0.1,
    total_steps=total_steps,
    pct_start=0.3,      # 30% warmup
    anneal_strategy='cos',
    div_factor=25,       # initial_lr = max_lr / 25
    final_div_factor=1e4 # final_lr = initial_lr / 1e4
)
```

### Polynomial Decay

Common in segmentation tasks (used in DeepLab):

$$\eta_t = \eta_0 \left(1 - \frac{t}{T}\right)^{\text{power}}$$

where power is typically 0.9.

## Why It Matters

1. Switching from step decay to cosine annealing typically improves ImageNet top-1 accuracy by 0.3-0.5% with no other changes.
2. Warmup prevents training divergence with large batch sizes (up to 32k images) and is a prerequisite for efficient distributed training.
3. One-cycle policy can achieve comparable accuracy in 1/5 to 1/10 the training time, saving significant compute.
4. The learning rate schedule interacts with every other training choice -- augmentation strength, regularization, batch size -- making it a central lever in the training recipe.

## Key Technical Details

- The linear scaling rule (Goyal et al., 2017): when multiplying batch size by $k$, multiply learning rate by $k$. Valid up to ~8k batch size for SGD with warmup.
- Cosine annealing with $\eta_{\min} = 0$ outperforms $\eta_{\min} = 10^{-6}$ in practice for standard-length training.
- For fine-tuning, start with a much lower $\eta_{\max}$ (e.g., 1e-4 instead of 0.1) and use cosine decay without warmup or with very short warmup.
- AdamW + cosine decay is the standard recipe for Vision Transformers: $\eta_{\max} = 1\text{e-}3$, warmup 5 epochs, cosine to 0 over remaining epochs.
- Learning rate finders (Smith, 2017) sweep $\eta$ from very small to very large over one epoch; the steepest-descent region of the loss curve suggests the optimal $\eta_{\max}$.
- Layer-wise learning rate decay (LLRD): multiply each layer's LR by a factor $< 1$ per layer depth. Used in fine-tuning ViTs (Clark et al., 2020).

## Common Misconceptions

- **"A constant learning rate with Adam is good enough."** Adam adapts per-parameter, but a global schedule still matters. Adam with cosine decay consistently outperforms Adam with a fixed LR.
- **"Warmup is only needed for huge batch sizes."** While it originated for large-batch training, warmup also stabilizes training with Transformers and certain architectures regardless of batch size.
- **"Lower learning rate always means better convergence."** A learning rate that is too low leads to slow convergence and can get trapped in sharp local minima that generalize poorly. The goal is to find the highest stable rate and decay from there.

## Connections to Other Concepts

- `batch-normalization.md`: BN's landscape-smoothing effect enables the use of higher learning rates that schedules exploit.
- `transfer-learning.md`: Fine-tuning uses much smaller initial LRs and shorter schedules than training from scratch.
- `progressive-resizing.md`: Changing resolution mid-training may require adjusting the learning rate schedule.
- `label-smoothing.md`: Combined with cosine scheduling, label smoothing is part of the modern ImageNet training recipe.

## Further Reading

- Loshchilov & Hutter, "SGDR: Stochastic Gradient Descent with Warm Restarts" (2017) -- Introduced cosine annealing with restarts.
- Smith & Topin, "Super-Convergence: Very Fast Training of Neural Networks Using Large Learning Rates" (2019) -- One-cycle policy and super-convergence.
- Goyal et al., "Accurate, Large Minibatch SGD: Training ImageNet in 1 Hour" (2017) -- Linear scaling rule and warmup.
- Smith, "Cyclical Learning Rates for Training Neural Networks" (2017) -- Introduced cyclical LR and LR range test.
