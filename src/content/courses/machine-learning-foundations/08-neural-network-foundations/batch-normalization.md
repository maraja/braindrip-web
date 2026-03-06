# Batch Normalization

**One-Line Summary**: Normalizing layer inputs within each mini-batch -- stabilizing training, enabling higher learning rates, and acting as regularization.

**Prerequisites**: Mean and variance, perceptrons and multilayer networks, backpropagation, activation functions, gradient descent.

## What Is Batch Normalization?

Imagine you are a teacher grading exams from different schools. One school's exams are scored 0-100, another's 0-10, and a third uses letter grades. Before you can fairly compare students, you must standardize the scores. Batch normalization does the same for neural network activations: it standardizes the inputs to each layer so that every layer sees data with consistent statistical properties, regardless of how the preceding layers have shifted and scaled their outputs.

Formally, Batch Normalization (BatchNorm), introduced by Ioffe and Szegedy in 2015, normalizes the pre-activation values within each mini-batch to have zero mean and unit variance, then applies a learnable affine transformation. This simple operation has dramatic effects on training stability and speed.

## How It Works

### The BatchNorm Formula

For a mini-batch $\mathcal{B} = \{x_1, \ldots, x_B\}$ of pre-activation values at a particular neuron:

**Step 1: Compute batch statistics**

$$\mu_\mathcal{B} = \frac{1}{B} \sum_{i=1}^{B} x_i, \quad \sigma_\mathcal{B}^2 = \frac{1}{B} \sum_{i=1}^{B} (x_i - \mu_\mathcal{B})^2$$

**Step 2: Normalize**

$$\hat{x}_i = \frac{x_i - \mu_\mathcal{B}}{\sqrt{\sigma_\mathcal{B}^2 + \epsilon}}$$

where $\epsilon$ (typically $10^{-5}$) prevents division by zero.

**Step 3: Scale and shift with learnable parameters**

$$y_i = \gamma \hat{x}_i + \beta$$

The learnable parameters $\gamma$ (scale) and $\beta$ (shift) allow the network to undo the normalization if that is optimal. If $\gamma = \sqrt{\sigma_\mathcal{B}^2 + \epsilon}$ and $\beta = \mu_\mathcal{B}$, the transformation is an identity. This means BatchNorm can never reduce the network's representational capacity.

### Internal Covariate Shift

The original motivation for BatchNorm was the **internal covariate shift** hypothesis: as parameters in earlier layers change during training, the distribution of inputs to later layers shifts, forcing those layers to continually adapt to a moving target. By normalizing inputs, BatchNorm stabilizes these distributions.

However, subsequent research (Santurkar et al., 2018) suggested that BatchNorm's effectiveness stems more from **smoothing the loss landscape** (reducing the Lipschitz constant of the loss and its gradients) than from reducing covariate shift per se. The smoothed landscape enables larger learning rates and faster convergence.

### Training vs. Inference

During **training**, $\mu_\mathcal{B}$ and $\sigma_\mathcal{B}^2$ are computed from the current mini-batch. The network also maintains exponential moving averages:

$$\mu_{\text{running}} \leftarrow (1-\alpha)\mu_{\text{running}} + \alpha \mu_\mathcal{B}$$
$$\sigma^2_{\text{running}} \leftarrow (1-\alpha)\sigma^2_{\text{running}} + \alpha \sigma^2_\mathcal{B}$$

where $\alpha$ is the momentum (typically 0.1).

During **inference**, the running statistics are used instead of batch statistics, ensuring deterministic outputs that do not depend on other examples in the batch.

This train/inference discrepancy is a frequent source of bugs. Forgetting to switch a model to evaluation mode before inference will cause it to use batch statistics, producing erratic outputs, especially with small batch sizes.

### Where to Place BatchNorm

There are two conventions:
- **Pre-activation**: $\mathbf{z} \to \text{BN}(\mathbf{z}) \to f(\cdot)$ (normalize before activation). This is the original formulation.
- **Post-activation**: $\mathbf{z} \to f(\mathbf{z}) \to \text{BN}(\cdot)$ (normalize after activation).

Both work in practice, with pre-activation being more common. The key insight is that BatchNorm keeps pre-activations in the non-saturating regime of the activation function, improving gradient flow.

### Normalization Variants

**Layer Normalization (LayerNorm)**: Normalizes across all features within a single example, rather than across the batch. Statistics are computed as $\mu = \frac{1}{D}\sum_{i=1}^D x_i$ for each example independently. LayerNorm has no train/inference discrepancy and works with any batch size. It is the standard for transformers and recurrent networks.

**Group Normalization (GroupNorm)**: Divides channels into groups and normalizes within each group. A compromise between LayerNorm (one group) and Instance Normalization (each channel is its own group). Useful when batch sizes are too small for reliable batch statistics (e.g., object detection, video).

**RMS Normalization (RMSNorm)**: A simplified variant that skips mean centering:

$$\hat{x}_i = \frac{x_i}{\text{RMS}(\mathbf{x})} \cdot \gamma_i, \quad \text{RMS}(\mathbf{x}) = \sqrt{\frac{1}{D}\sum_{i=1}^D x_i^2}$$

RMSNorm is computationally cheaper and is used in LLaMA, Gemma, and other modern large language models. Empirically, it performs comparably to LayerNorm.

## Why It Matters

BatchNorm was one of the most impactful techniques of the 2015-2020 deep learning era. It enabled training deeper networks, using learning rates 10x larger, and reduced sensitivity to weight initialization. Its variants (LayerNorm, RMSNorm) are essential components of every modern transformer architecture.

## Key Technical Details

- BatchNorm adds $2D$ learnable parameters per layer ($\gamma, \beta \in \mathbb{R}^D$) and stores $2D$ running statistics.
- Effective batch sizes for BatchNorm should be at least 16-32 for reliable statistics; smaller batches favor GroupNorm or LayerNorm.
- BatchNorm provides implicit regularization through the noise in mini-batch statistics. Larger batches reduce this noise and may require additional explicit regularization.
- In convolutional networks, BatchNorm is applied per-channel: $\gamma, \beta \in \mathbb{R}^C$ where $C$ is the number of channels, with statistics computed across the batch and spatial dimensions.
- When using BatchNorm immediately after a linear or convolutional layer, the bias term in that layer is redundant (absorbed by $\beta$) and should be omitted.

## Common Misconceptions

- **"BatchNorm works because it reduces internal covariate shift."** This was the original hypothesis, but Santurkar et al. (2018) showed that BatchNorm's primary benefit is smoothing the loss landscape. Networks with artificially induced covariate shift still train well with BatchNorm.
- **"BatchNorm and LayerNorm are interchangeable."** BatchNorm normalizes across the batch (coupling examples together); LayerNorm normalizes across features (each example is independent). They have very different properties for sequence models, attention mechanisms, and small-batch regimes.
- **"BatchNorm makes initialization irrelevant."** BatchNorm reduces sensitivity to initialization, but extremely poor initialization (e.g., all zeros) can still cause problems. Proper initialization combined with BatchNorm gives the best results.

## Connections to Other Concepts

- **Activation Functions**: BatchNorm keeps pre-activations in the sensitive (non-saturating) range of activations like sigmoid and tanh.
- **Weight Initialization**: BatchNorm reduces but does not eliminate the importance of initialization; both work together for stable training.
- **Backpropagation**: The gradient flows through the normalization statistics, coupling the gradients of all examples in the batch.
- **Dropout and Regularization**: BatchNorm provides implicit regularization via mini-batch noise; combining it with dropout requires care (they can interact poorly).
- **Optimizers**: BatchNorm's loss landscape smoothing enables larger learning rates, which interacts with optimizer step size tuning.

## Further Reading

- Ioffe and Szegedy, "Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift" (2015) -- The original BatchNorm paper.
- Santurkar et al., "How Does Batch Normalization Help Optimization?" (2018) -- Revisits the covariate shift hypothesis with the loss landscape smoothing explanation.
- Ba, Kiros, and Hinton, "Layer Normalization" (2016) -- LayerNorm, now standard in transformers.
- Zhang and Sennrich, "Root Mean Square Layer Normalization" (2019) -- RMSNorm, used in modern LLMs.
