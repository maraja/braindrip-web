# Knowledge Distillation

**One-Line Summary**: Knowledge distillation transfers the learned behavior of a large teacher network into a smaller student network by training the student to match the teacher's soft output probabilities, capturing inter-class relationships that hard labels miss.

**Prerequisites**: Softmax function, cross-entropy loss, temperature scaling, model compression, transfer learning

## What Is Knowledge Distillation?

Consider an experienced chess grandmaster teaching a beginner. Rather than just saying "this move wins, that move loses" (hard labels), the grandmaster explains "this move is strong, that one is decent, and that third option looks tempting but leads to trouble" (soft labels). The nuanced ranking of alternatives contains far more information than a binary correct/incorrect signal. Knowledge distillation works the same way: a large, powerful teacher network produces probability distributions over all classes that reveal which classes the teacher finds similar, and the student learns from these rich signals.

Hinton et al. (2015) called this information "dark knowledge" -- the knowledge hidden in the wrong answers. A teacher that assigns 0.01 probability to "cat" and 0.001 to "car" when the image is a dog is telling the student that dogs look more like cats than cars. This relational structure is invisible in one-hot labels.

## How It Works

### Temperature-Scaled Softmax

Standard softmax produces peaked distributions where the correct class dominates and other classes have negligible probability. To expose the dark knowledge, both teacher and student use a temperature parameter $T$ to soften the distribution:

$$p_i = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}$$

At $T = 1$, this is the standard softmax. As $T$ increases, the distribution becomes softer (more uniform), revealing the relative magnitudes of the logits. Typical values: $T = 3$ to $T = 20$.

### Distillation Loss

The student is trained with a combination of two losses:

$$\mathcal{L} = \alpha \cdot T^2 \cdot \text{KL}(p^T_{\text{teacher}} \| p^T_{\text{student}}) + (1 - \alpha) \cdot \mathcal{L}_{\text{CE}}(p_{\text{student}}, y_{\text{hard}})$$

where $p^T$ denotes softmax with temperature $T$, $y_{\text{hard}}$ is the one-hot ground truth, and $\alpha$ balances the two terms. The $T^2$ factor compensates for the reduced gradient magnitudes at high temperatures.

```python
# Knowledge distillation loss
def distillation_loss(student_logits, teacher_logits, labels, T=4.0, alpha=0.7):
    # Soft target loss (KL divergence with temperature)
    soft_loss = F.kl_div(
        F.log_softmax(student_logits / T, dim=-1),
        F.softmax(teacher_logits / T, dim=-1),
        reduction='batchmean'
    ) * (T * T)

    # Hard target loss
    hard_loss = F.cross_entropy(student_logits, labels)

    return alpha * soft_loss + (1 - alpha) * hard_loss
```

### Distillation Strategies

**Logit Distillation (Response-Based)**: Match the teacher's final output distribution. Simple and effective.

**Feature Distillation (Hint-Based)**: Match intermediate feature maps between teacher and student. FitNets (Romero et al., 2015) introduced this approach using a regressor to align the student's hidden layer with the teacher's hint layer:

$$\mathcal{L}_{\text{hint}} = \|W_r \cdot f_{\text{student}} - f_{\text{teacher}}\|^2$$

**Attention Distillation**: Transfer the attention maps (spatial activation patterns) from teacher to student (Zagoruyko & Komodakis, 2017).

**Relational Distillation**: Match the pairwise or higher-order relationships between samples in the teacher's embedding space.

### Self-Distillation

The teacher and student can share the same architecture. Born-Again Networks (Furlanello et al., 2018) showed that training a new copy of the same model using the original's soft predictions consistently improves accuracy by 0.5-1%. This can be iterated multiple generations.

### Distillation for Vision Transformers

DeiT (Touvron et al., 2021) introduced a distillation token alongside the class token. A CNN teacher (RegNet) distills knowledge into a ViT student through hard label distillation (using the teacher's argmax prediction as the target), which outperformed soft distillation for this architecture pair.

## Why It Matters

1. Distillation can compress a model by 10-50x with only 1-3% accuracy loss. For example, a ResNet-50 teacher can produce a MobileNet student that achieves 70-74% top-1 on ImageNet.
2. DeiT showed that ViT-B trained with distillation from a CNN teacher achieved 83.4% top-1 on ImageNet vs. 81.8% without distillation.
3. Distilled models are faster and cheaper to deploy, enabling complex models on mobile and edge devices.
4. The soft target signal provides roughly $\log_2(K)$ bits more information per sample than a one-hot label for $K$ classes.
5. Distillation enables deploying ensembles' knowledge in a single model, capturing the diversity of multiple teachers.

## Key Technical Details

- Temperature $T$: typically 3-20. Higher $T$ for large class counts. Start with $T = 4$ and tune.
- Alpha ($\alpha$): typically 0.5-0.9 (weighting soft loss higher). Start with $\alpha = 0.7$.
- The teacher should be significantly larger than the student. A teacher that is too close in capacity provides little additional signal.
- Teacher accuracy matters: better teachers generally produce better students, but there are diminishing returns and a "capacity gap" effect where very large teachers can be poor teachers for very small students (Cho & Hariharan, 2019).
- Training the student for longer than normal (1.5-2x epochs) often helps because soft targets provide a denser signal that benefits from extended training.
- Label smoothing in the teacher can hurt distillation by flattening the soft targets and removing inter-class similarity information (Muller et al., 2019).
- Online distillation: teacher and student train simultaneously, avoiding the cost of pre-training the teacher.

## Common Misconceptions

- **"The student can match the teacher's accuracy."** Generally, the student is worse than the teacher. Distillation closes the gap but rarely eliminates it. The student is better than it would be trained with hard labels alone.
- **"You need the teacher's training data."** In data-free distillation, synthetic or out-of-distribution data can be used with a pre-trained teacher. However, performance is typically worse than using the original data.
- **"Distillation is only for compression."** Self-distillation improves same-architecture models. Multi-teacher distillation can exceed any single teacher. Cross-architecture distillation (CNN to ViT) transfers useful inductive biases.

## Connections to Other Concepts

- **Label Smoothing**: Both produce soft targets, but distillation targets are learned from data (capturing real inter-class structure) while label smoothing targets are uniform. Label smoothing in the teacher can degrade distillation quality.
- **Transfer Learning**: Distillation transfers knowledge between models of different sizes, while transfer learning transfers knowledge between tasks.
- **Self-Supervised Pretraining**: DINO and similar methods can be viewed as a form of self-distillation where the teacher is an exponential moving average of the student.
- **Mixup and CutMix**: Soft labels from mixing and soft labels from distillation serve similar regularization roles and can be combined.

## Further Reading

- Hinton et al., "Distilling the Knowledge in a Neural Network" (2015) -- The foundational knowledge distillation paper.
- Romero et al., "FitNets: Hints for Thin Deep Nets" (2015) -- Feature-level distillation for training deeper, thinner students.
- Touvron et al., "Training Data-Efficient Image Transformers & Distillation Through Attention" (2021) -- DeiT's distillation token approach.
- Cho & Hariharan, "On the Efficacy of Knowledge Distillation" (2019) -- Analyzes the capacity gap between teacher and student.
- Furlanello et al., "Born Again Neural Networks" (2018) -- Self-distillation across generations of the same architecture.
