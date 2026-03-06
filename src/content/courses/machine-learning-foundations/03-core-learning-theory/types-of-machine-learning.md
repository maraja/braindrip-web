# Types of Machine Learning

**One-Line Summary**: Supervised, unsupervised, semi-supervised, and self-supervised -- a taxonomy based on what labels are available.

**Prerequisites**: What Is Machine Learning, basic probability, basic statistics.

## What Are the Types of Machine Learning?

Think of learning types as different teaching styles. Supervised learning is like a tutor who grades every homework problem -- you always know the right answer. Unsupervised learning is like exploring a library with no catalog -- you discover structure on your own. Semi-supervised learning is a mix: a few graded examples plus a mountain of ungraded ones. Self-supervised learning is the student who invents their own quizzes from the textbook to prepare for the real exam.

Formally, the types are distinguished by the **nature of the supervision signal** available during training.

## How It Works

### Supervised Learning

Given a dataset $\mathcal{D} = \{(\mathbf{x}_i, y_i)\}_{i=1}^n$ where $\mathbf{x}_i \in \mathcal{X}$ are inputs and $y_i \in \mathcal{Y}$ are labels, the goal is to learn $f: \mathcal{X} \rightarrow \mathcal{Y}$ that generalizes to unseen data.

**Classification**: $\mathcal{Y}$ is a discrete set of categories. Binary classification ($|\mathcal{Y}| = 2$) includes spam detection and medical diagnosis. Multi-class classification ($|\mathcal{Y}| > 2$) includes image recognition (ImageNet has 1,000 classes). The model typically outputs a probability distribution over classes:

$$P(y = k \mid \mathbf{x}) = \text{softmax}(f(\mathbf{x}))_k$$

**Regression**: $\mathcal{Y} = \mathbb{R}$ (or $\mathbb{R}^d$). Examples: predicting house prices, stock returns, temperature. The model outputs a continuous value, and training minimizes a loss like MSE:

$$\mathcal{L} = \frac{1}{n}\sum_{i=1}^n (f(\mathbf{x}_i) - y_i)^2$$

### Unsupervised Learning

Given only $\mathcal{D} = \{\mathbf{x}_i\}_{i=1}^n$ with no labels, the goal is to discover hidden structure.

**Clustering**: Partition data into groups. K-means minimizes within-cluster variance:

$$\arg\min_{\mu_1, \ldots, \mu_K} \sum_{k=1}^K \sum_{\mathbf{x}_i \in C_k} \|\mathbf{x}_i - \mu_k\|^2$$

Examples: customer segmentation, gene expression grouping.

**Dimensionality Reduction**: Find a lower-dimensional representation that preserves important structure. PCA finds directions of maximum variance. t-SNE and UMAP emphasize local neighborhood structure for visualization.

**Density Estimation**: Model the probability distribution $p(\mathbf{x})$ of the data. Gaussian mixture models, kernel density estimation, and normalizing flows all fall here. Useful for anomaly detection: flag points where $p(\mathbf{x})$ is low.

**Generative Modeling**: Learn to generate new samples that resemble the training data. GANs, VAEs, and diffusion models are all unsupervised generative methods.

### Semi-Supervised Learning

You have a small labeled set $\mathcal{D}_l = \{(\mathbf{x}_i, y_i)\}_{i=1}^l$ and a large unlabeled set $\mathcal{D}_u = \{\mathbf{x}_j\}_{j=1}^u$ where $u \gg l$. The key assumption is that the structure of $p(\mathbf{x})$ -- revealed by unlabeled data -- contains information about $p(y|\mathbf{x})$.

Common techniques include self-training (pseudo-labeling), co-training, graph-based methods, and consistency regularization. Example: medical imaging where only a radiologist can label, so you have 100 labeled scans and 100,000 unlabeled ones.

### Self-Supervised Learning

The model generates its own supervision from the data through **pretext tasks** -- artificially constructed prediction problems. The key idea: design a task where the labels come for free from the data itself.

Examples of pretext tasks:
- **Masked language modeling** (BERT): Mask 15% of tokens, predict them from context.
- **Next token prediction** (GPT): Predict $x_{t+1}$ given $x_1, \ldots, x_t$.
- **Contrastive learning** (SimCLR): Two augmented views of the same image should have similar representations; views of different images should not.

Self-supervised learning has become dominant in NLP and increasingly in computer vision because it leverages vast amounts of unlabeled data.

### Transfer Learning

A model trained on task A (source) is adapted to task B (target), typically with less data. The assumption is that low-level features learned on A are useful for B. A common pattern: pre-train a large model with self-supervised learning on massive data, then fine-tune on a small labeled dataset for a specific task.

### Online Learning

Data arrives sequentially, and the model updates incrementally. At each round $t$, the learner predicts $\hat{y}_t$, observes the true $y_t$, and updates. Performance is measured by **regret** -- the gap between cumulative loss and the best fixed strategy in hindsight:

$$R_T = \sum_{t=1}^T \ell(\hat{y}_t, y_t) - \min_{h \in \mathcal{H}} \sum_{t=1}^T \ell(h(\mathbf{x}_t), y_t)$$

### Active Learning

The learner can **query** which examples to label, selecting the most informative ones. This is critical when labeling is expensive. Strategies include uncertainty sampling (query points where the model is least confident), query-by-committee, and expected model change.

### Summary Table

| Paradigm | Labels | Goal | Example |
|---|---|---|---|
| Supervised | Full | Predict $y$ from $\mathbf{x}$ | Email spam detection |
| Unsupervised | None | Discover structure | Customer segmentation |
| Semi-supervised | Partial | Predict $y$, leverage unlabeled | Medical image classification |
| Self-supervised | Auto-generated | Learn representations | BERT pre-training |
| Reinforcement | Reward signal | Maximize cumulative reward | Game-playing agents |
| Transfer | Source task labels | Adapt to target task | ImageNet pre-train, fine-tune |
| Online | Sequential | Minimize regret | Ad click prediction |
| Active | Queried selectively | Efficient labeling | Drug screening |

### Paradigm Selection in Practice

Choosing the right paradigm depends on several practical factors:

1. **Label availability**: If you have abundant labeled data, start with supervised learning. If labels are scarce or expensive, consider semi-supervised, self-supervised, or active learning.
2. **Data volume**: Self-supervised methods require large amounts of unlabeled data to learn useful representations. With small datasets, supervised learning with careful regularization may be more effective.
3. **Feedback structure**: If the problem involves sequential decision-making with delayed rewards, reinforcement learning is the natural framework. If decisions are one-shot, supervised or unsupervised methods are simpler.
4. **Deployment constraints**: Online learning is necessary when the data distribution shifts over time and the model must adapt continuously.

## Why It Matters

Choosing the right learning paradigm is arguably the most important design decision in any ML project. It determines what data you need, what models are applicable, and what performance is achievable. In practice, the boundaries blur -- modern systems often combine paradigms (e.g., self-supervised pre-training followed by supervised fine-tuning).

## Key Technical Details

- **Label cost** drives paradigm choice: supervised requires full labels, semi-supervised requires few, self-supervised requires none.
- **Data volume**: Self-supervised methods thrive on massive unlabeled corpora; supervised methods need proportionally more labels as complexity grows.
- Supervised learning has the most mature theory (PAC learning, VC dimension); unsupervised learning theory is less developed.
- **Multi-task learning** trains on multiple related tasks simultaneously, sharing representations across them.
- **Few-shot** and **zero-shot** learning aim to generalize from very few (or zero) labeled examples, often by leveraging transfer from pre-trained models.

## Common Misconceptions

- **"Unsupervised learning requires no assumptions."** Every unsupervised method encodes assumptions about what structure matters -- K-means assumes spherical clusters, PCA assumes linear subspaces.
- **"Self-supervised is the same as unsupervised."** Self-supervised learning creates a supervised signal from the data. It is technically supervised, but the labels are derived automatically rather than annotated by humans.
- **"Reinforcement learning is always the best approach for sequential decisions."** RL is sample-inefficient and unstable. If you can formulate the problem as supervised learning with logged data, that is often preferable.
- **"You must choose exactly one paradigm."** Modern pipelines frequently chain paradigms -- for example, self-supervised pre-training, then supervised fine-tuning, then online adaptation.

## Connections to Other Concepts

- **What Is Machine Learning**: Introduces the three core paradigms at a high level; this file provides the detailed taxonomy.
- **Loss Functions**: Different paradigms use different losses -- cross-entropy for classification, reconstruction loss for autoencoders, contrastive losses for self-supervised learning.
- **Overfitting and Underfitting**: Semi-supervised and self-supervised methods are partly motivated by the overfitting risk when labeled data is scarce.
- **Empirical Risk Minimization**: The theoretical framework applies primarily to supervised and semi-supervised settings.
- **Curse of Dimensionality**: Unsupervised methods like dimensionality reduction directly address this problem.

## Further Reading

- Chapelle, O., Scholkopf, B., Zien, A., *Semi-Supervised Learning* (2006) -- Comprehensive treatment of the semi-supervised setting.
- Liu, X. et al., "Self-Supervised Learning: Generative or Contrastive" (2021) -- Survey covering the modern self-supervised landscape.
- Settles, B., "Active Learning Literature Survey" (2009) -- The standard reference for active learning strategies.
- Sutton, R. & Barto, A., *Reinforcement Learning: An Introduction* (2018) -- The definitive textbook for RL.
