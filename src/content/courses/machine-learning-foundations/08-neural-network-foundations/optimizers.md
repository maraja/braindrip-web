# Optimizers

**One-Line Summary**: SGD, momentum, RMSProp, Adam, and AdamW -- adaptive methods that navigate loss landscapes faster than vanilla gradient descent.

**Prerequisites**: Gradient descent, partial derivatives, backpropagation, loss functions, learning rate concept.

## What Are Optimizers?

Imagine hiking down a mountain in dense fog. Vanilla gradient descent tells you to always step in the steepest downhill direction. Momentum is like being a heavy ball that accumulates speed and rolls through small bumps. Adaptive methods are like having a different step size for every direction -- taking large steps across flat plains and small steps along steep ravines. Optimizers are the algorithms that use gradient information to update network parameters toward a loss minimum.

Formally, given a loss function $\mathcal{L}(\theta)$ and its gradient $\mathbf{g}_t = \nabla_\theta \mathcal{L}(\theta_t)$ at step $t$, an optimizer defines the update rule $\theta_{t+1} = \theta_t + \Delta\theta_t$. The design of $\Delta\theta_t$ determines convergence speed, stability, and the quality of the final solution.

## How It Works

### Stochastic Gradient Descent (SGD)

The simplest optimizer computes gradients on a mini-batch and updates directly:

$$\theta_{t+1} = \theta_t - \eta \mathbf{g}_t$$

where $\eta$ is the learning rate. SGD is noisy due to mini-batch sampling, but this noise can help escape shallow local minima. The learning rate $\eta$ is the most critical hyperparameter -- too large causes divergence, too small causes painfully slow convergence.

### SGD with Momentum

Momentum accumulates a running average of past gradients, smoothing updates and accelerating convergence along consistent gradient directions:

$$\mathbf{v}_t = \beta \mathbf{v}_{t-1} + \mathbf{g}_t$$
$$\theta_{t+1} = \theta_t - \eta \mathbf{v}_t$$

where $\beta \in [0, 1)$ is the momentum coefficient (typically 0.9). Momentum helps in two ways: (1) it accelerates progress along low-curvature directions where the gradient is consistent, and (2) it dampens oscillations along high-curvature directions where the gradient alternates sign.

The effective step size in a consistent direction grows to $\frac{\eta}{1-\beta}$ -- with $\beta=0.9$, this is a 10x amplification.

### Nesterov Accelerated Gradient (NAG)

Nesterov momentum evaluates the gradient at the "lookahead" position rather than the current position:

$$\mathbf{v}_t = \beta \mathbf{v}_{t-1} + \nabla_\theta \mathcal{L}(\theta_t - \eta \beta \mathbf{v}_{t-1})$$
$$\theta_{t+1} = \theta_t - \eta \mathbf{v}_t$$

This "look before you leap" approach provides a corrective factor that reduces overshooting. NAG has provably better convergence rates than standard momentum for convex functions.

### Adagrad

Adagrad adapts the learning rate per-parameter based on the history of squared gradients:

$$\mathbf{G}_t = \mathbf{G}_{t-1} + \mathbf{g}_t^2 \quad \text{(elementwise square)}$$
$$\theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{\mathbf{G}_t + \epsilon}} \odot \mathbf{g}_t$$

Parameters with large cumulative gradients get smaller learning rates; parameters with small gradients get larger ones. This is excellent for sparse features (NLP, recommendations) but problematic for deep learning because $\mathbf{G}_t$ only grows, eventually driving the learning rate to zero.

### RMSProp

RMSProp (Hinton, unpublished lecture notes, 2012) fixes Adagrad's decaying learning rate by using an exponential moving average of squared gradients:

$$\mathbf{s}_t = \rho \mathbf{s}_{t-1} + (1 - \rho) \mathbf{g}_t^2$$
$$\theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{\mathbf{s}_t + \epsilon}} \odot \mathbf{g}_t$$

where $\rho$ is the decay rate (typically 0.99). This forgets old gradient information, keeping the effective learning rate from vanishing.

### Adam (Adaptive Moment Estimation)

Adam (Kingma and Ba, 2014) combines momentum (first moment) with RMSProp (second moment), plus bias correction:

$$\mathbf{m}_t = \beta_1 \mathbf{m}_{t-1} + (1 - \beta_1) \mathbf{g}_t \quad \text{(first moment estimate)}$$
$$\mathbf{v}_t = \beta_2 \mathbf{v}_{t-1} + (1 - \beta_2) \mathbf{g}_t^2 \quad \text{(second moment estimate)}$$
$$\hat{\mathbf{m}}_t = \frac{\mathbf{m}_t}{1 - \beta_1^t}, \quad \hat{\mathbf{v}}_t = \frac{\mathbf{v}_t}{1 - \beta_2^t} \quad \text{(bias correction)}$$
$$\theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{\hat{\mathbf{v}}_t} + \epsilon} \hat{\mathbf{m}}_t$$

Default hyperparameters: $\beta_1 = 0.9$, $\beta_2 = 0.999$, $\epsilon = 10^{-8}$. The bias correction terms compensate for the zero-initialization of $\mathbf{m}$ and $\mathbf{v}$, which would otherwise bias early estimates toward zero.

### AdamW (Decoupled Weight Decay)

Loshchilov and Hutter (2017) showed that Adam's handling of $L_2$ regularization is flawed. In standard Adam, weight decay is applied to the gradient before adaptive scaling, which means heavily-updated parameters get less regularization -- the opposite of the intended effect.

AdamW decouples weight decay from the gradient update:

$$\theta_{t+1} = \theta_t - \eta\left(\frac{\hat{\mathbf{m}}_t}{\sqrt{\hat{\mathbf{v}}_t} + \epsilon} + \lambda \theta_t\right)$$

where $\lambda$ is the weight decay coefficient. AdamW is now the default optimizer for training transformers and large language models.

### Learning Rate Warmup

Starting training with a large learning rate can cause divergence because the adaptive moment estimates in Adam are inaccurate initially. Warmup linearly increases the learning rate from a small value to the target value over the first few hundred to few thousand steps:

$$\eta_t = \eta_{\text{target}} \cdot \min\left(1, \frac{t}{T_{\text{warmup}}}\right)$$

Warmup is especially important for large-batch training and transformer architectures.

## Why It Matters

The optimizer determines how efficiently a model navigates its loss landscape. SGD with momentum remains competitive for computer vision tasks (often finding flatter minima that generalize better), while Adam/AdamW dominates in NLP and transformer training. Choosing the right optimizer and tuning its hyperparameters can reduce training time by orders of magnitude.

## Key Technical Details

- **SGD + momentum**: Fewer hyperparameters, often better generalization, but requires careful learning rate scheduling.
- **Adam**: Faster convergence, less sensitive to learning rate, but can generalize slightly worse without weight decay.
- **AdamW**: The standard for transformers. Typical: $\eta = 10^{-4}$ to $3 \times 10^{-4}$, $\lambda = 0.01$ to $0.1$.
- **Memory**: Adam/AdamW store two additional tensors per parameter (first and second moments), tripling memory versus SGD.
- **Learning rate schedules** (cosine decay, linear decay, step decay) are as important as the optimizer choice itself.

## Common Misconceptions

- **"Adam always converges faster than SGD."** Adam converges faster initially but SGD with momentum and proper scheduling often reaches better final performance in computer vision. The choice is task-dependent.
- **"Adaptive learning rates mean you don't need to tune the learning rate."** Adam still requires tuning $\eta$. The adaptation is per-parameter relative scaling, not automatic global tuning.
- **"Weight decay and $L_2$ regularization are the same thing."** They are equivalent for SGD but not for adaptive optimizers like Adam, which is precisely why AdamW was developed.

## Connections to Other Concepts

- **Backpropagation**: Computes the gradients $\mathbf{g}_t$ that all optimizers consume.
- **Weight Initialization**: Good initialization reduces the burden on the optimizer by starting in a favorable region of the loss landscape.
- **Batch Normalization**: Smooths the loss landscape, making optimization easier for any optimizer.
- **Dropout and Regularization**: Weight decay in AdamW is a form of regularization; the optimizer and regularizer are deeply intertwined.

## Further Reading

- Kingma and Ba, "Adam: A Method for Stochastic Optimization" (2014) -- The original Adam paper.
- Loshchilov and Hutter, "Decoupled Weight Decay Regularization" (2017) -- The AdamW paper, now standard for transformers.
- Ruder, "An Overview of Gradient Descent Optimization Algorithms" (2016) -- Excellent survey of the optimizer landscape.
- Zhang et al., "Which Algorithmic Choices Matter at Scale?" (2019) -- Empirical comparison of optimizers on large-scale tasks.
