# Dropout and Regularization

**One-Line Summary**: Dropout randomly zeroes neuron activations during training to prevent co-adaptation, while L2 regularization and its variants penalize large weights -- together they are the primary tools for controlling overfitting in deep networks.

**Prerequisites**: Overfitting, gradient descent, backpropagation, fully connected and convolutional layers, loss functions

## What Is Dropout and Regularization?

Consider a rowing team where the same four members always row together. They develop compensating habits -- if one pulls too hard left, another adjusts right -- making the team fragile and unable to perform if any member is absent. Dropout is the coach's strategy of randomly benching different rowers each practice, forcing every individual to be independently competent. Regularization, more broadly, is any constraint that prevents the model from fitting noise in the training data.

Dropout (Srivastava et al., 2014) randomly sets each neuron's activation to zero with probability $p$ during training. The surviving activations are scaled by $\frac{1}{1-p}$ (inverted dropout) so that expected values remain unchanged at test time.

## How It Works

### Dropout

During training, for a layer with activation vector $\mathbf{h}$:

$$\mathbf{m} \sim \text{Bernoulli}(1 - p)$$
$$\tilde{\mathbf{h}} = \mathbf{m} \odot \mathbf{h} \cdot \frac{1}{1-p}$$

where $p$ is the drop probability (typically 0.5 for fully connected layers, 0.1-0.3 for other positions). At test time, no neurons are dropped and no scaling is applied (inverted dropout handles this automatically).

The ensemble interpretation: a network with $n$ neurons and dropout is implicitly training $2^n$ sub-networks with shared weights. At test time, the full network approximates the ensemble average.

```python
# PyTorch dropout usage
class Classifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(...)
        self.dropout = nn.Dropout(p=0.5)
        self.fc = nn.Linear(2048, num_classes)

    def forward(self, x):
        x = self.features(x)
        x = self.dropout(x)  # Only active during training
        return self.fc(x)
```

### DropBlock for Convolutional Networks

Standard dropout is ineffective for conv layers because adjacent activations are highly correlated -- dropping individual pixels is easily compensated by neighbors. DropBlock (Ghiasi et al., 2018) addresses this by dropping contiguous rectangular regions of the feature map.

$$\text{DropBlock}(\mathbf{H}, \text{block\_size}, \gamma) = \mathbf{H} \odot \mathbf{M}_{\text{block}}$$

where $\mathbf{M}_{\text{block}}$ is a mask with rectangular zero regions. The block size is typically 7x7, and $\gamma$ controls the overall keep probability.

### L2 Regularization (Weight Decay)

L2 regularization adds a penalty on the squared magnitude of weights to the loss:

$$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{data}} + \frac{\lambda}{2}\sum_i w_i^2$$

This encourages smaller weights, which smooths the decision boundary. In SGD, this is equivalent to weight decay: $w \leftarrow (1 - \lambda \eta) w - \eta \nabla \mathcal{L}_{\text{data}}$.

**Important**: For Adam and other adaptive optimizers, L2 regularization and weight decay are NOT equivalent. Loshchilov & Hutter (2019) showed that decoupled weight decay (AdamW) is superior to L2 regularization applied inside Adam.

### Other Regularization Techniques

- **L1 regularization**: Encourages sparsity ($\sum |w_i|$), less common in vision.
- **Stochastic Depth** (Huang et al., 2016): Randomly drops entire residual blocks during training. Allows training very deep networks (1000+ layers) that would otherwise fail.
- **Label Smoothing**: Regularizes the output distribution (covered separately).
- **Early Stopping**: Halt training when validation loss stops improving.

## Why It Matters

1. Without regularization, deep networks with millions of parameters will memorize training data, achieving near-zero training loss but poor generalization.
2. Dropout reduced the error rate of AlexNet by roughly 1-2% on ImageNet, a significant margin at the time.
3. Weight decay of 1e-4 is nearly universal in CNN training and costs nothing computationally.
4. DropBlock improved ResNet-50 top-1 accuracy by 1.6% on ImageNet compared to no spatial dropout.
5. Stochastic Depth enabled the training of 1202-layer ResNets and remains used in modern architectures like DeiT and CaiT.

## Key Technical Details

- Standard dropout rate: $p=0.5$ for FC layers, $p=0.1$-$0.3$ elsewhere. Higher rates for larger models.
- Weight decay defaults: 1e-4 for SGD with momentum, 0.01-0.1 for AdamW.
- DropBlock should be scheduled: start with a low drop rate and linearly increase during training for best results.
- Dropout is generally NOT used in modern conv backbones (ResNets, EfficientNets) -- BN provides sufficient regularization. It is still used in classification heads and Transformer-based models.
- When combining Dropout and BN, place Dropout after BN to avoid variance shift (Li et al., 2019).
- MC Dropout: running dropout at test time across multiple forward passes provides uncertainty estimates, useful in safety-critical applications.

## Common Misconceptions

- **"Dropout is essential for every network."** Modern convolutional architectures often omit dropout entirely, relying on BN, data augmentation, and weight decay. Dropout remains common in FC layers and Transformers but is not universal.
- **"Higher dropout rate always means more regularization."** Excessively high dropout ($p > 0.7$) can prevent the network from learning at all, as too little information passes through each forward pass.
- **"Weight decay and L2 regularization are the same thing."** They are equivalent only for vanilla SGD. For adaptive optimizers (Adam, RMSprop), decoupled weight decay (AdamW) performs significantly better.

## Connections to Other Concepts

- **Batch Normalization**: Provides a regularization effect that often makes dropout unnecessary in conv layers.
- **Data Augmentation**: Regularizes the input space rather than the parameter space; highly complementary to dropout and weight decay.
- **Label Smoothing**: Regularizes the target distribution, reducing overconfidence in a way orthogonal to dropout.
- **Mixup and CutMix**: Provide regularization through data-level interpolation, reducing the need for explicit dropout.
- **Knowledge Distillation**: Soft targets from a teacher network act as a form of regularization for the student.

## Further Reading

- Srivastava et al., "Dropout: A Simple Way to Prevent Neural Networks from Overfitting" (2014) -- The original dropout paper.
- Ghiasi et al., "DropBlock: A Regularization Method for Convolutional Networks" (2018) -- Spatial dropout for conv layers.
- Loshchilov & Hutter, "Decoupled Weight Decay Regularization" (2019) -- Demonstrates AdamW over Adam with L2.
- Huang et al., "Deep Networks with Stochastic Depth" (2016) -- Regularization by dropping entire residual blocks.
- Li et al., "Understanding the Disharmony between Dropout and Batch Normalization" (2019) -- Analyzes the interaction between the two techniques.
