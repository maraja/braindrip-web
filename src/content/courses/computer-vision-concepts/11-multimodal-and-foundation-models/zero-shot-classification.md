# Zero-Shot Classification

**One-Line Summary**: Zero-shot classification recognizes visual categories never seen during training by using natural language descriptions as class prototypes in a shared vision-language embedding space.

**Prerequisites**: CLIP, embedding spaces, cosine similarity, transfer learning, softmax classification

## What Is Zero-Shot Classification?

Consider how you can recognize a pangolin even if you have never seen one in person -- someone describes it as "an armored mammal covered in overlapping scales that rolls into a ball," and you match that description against what you see. Zero-shot classification works on the same principle: instead of learning from labeled images of each category, the model uses text descriptions as stand-ins for visual prototypes.

Formally, zero-shot classification is the task of assigning an image $\mathbf{x}$ to one of $C$ categories $\{y_1, \ldots, y_C\}$ when none of these categories appeared in the training set. The model has learned a mapping from images and text into a shared embedding space during pretraining (typically on image-caption pairs), and at inference time it computes:

$$\hat{y} = \arg\max_{c \in \{1, \ldots, C\}} \frac{\exp(\text{sim}(\mathbf{v}, \mathbf{t}_c) / \tau)}{\sum_{j=1}^{C} \exp(\text{sim}(\mathbf{v}, \mathbf{t}_j) / \tau)}$$

where $\mathbf{v}$ is the image embedding, $\mathbf{t}_c$ is the text embedding for class $c$, and $\tau$ is a temperature parameter.

## How It Works

### The Text-as-Classifier Paradigm

Traditional classifiers learn a weight vector $\mathbf{w}_c$ for each class from labeled data. In zero-shot classification, the text encoder generates $\mathbf{t}_c$ from a natural language description of class $c$, effectively replacing $\mathbf{w}_c$ with a semantically meaningful prototype. This swap is possible because the shared embedding space preserves cross-modal semantic structure.

### Prompt Engineering

The text input for each class significantly affects accuracy. Common strategies include:

**Simple templates:**
```
"a photo of a {class}"
"a {class}"
"this is a {class}"
```

**Context-enriched templates:**
```
"a photo of a {class}, a type of food"
"a centered satellite photo of {class}"
"a black and white photo of a {class}"
```

**Prompt ensembling:** CLIP uses 80 handcrafted templates per dataset and averages the resulting text embeddings:

$$\mathbf{t}_c = \frac{1}{M} \sum_{m=1}^{M} f_{\text{text}}(\text{template}_m(\text{class}_c))$$

This ensembling improved ImageNet zero-shot accuracy from 68.3% to 76.2% for CLIP ViT-L/14@336px.

### Generalized Zero-Shot Learning (GZSL)

In the generalized setting, the test set contains both seen and unseen categories. This is harder because models are biased toward seen classes. Calibrated stacking addresses this by subtracting a bias term from seen-class scores:

$$\hat{y} = \arg\max_{c} \text{sim}(\mathbf{v}, \mathbf{t}_c) - \gamma \cdot \mathbf{1}[c \in \mathcal{S}]$$

where $\mathcal{S}$ is the set of seen classes and $\gamma$ is a calibration constant.

### Hierarchy of Zero-Shot Approaches

1. **Attribute-based** (classic): Map images and classes to a shared attribute space (e.g., "has stripes," "is furry"). Limited by predefined attributes.
2. **Embedding-based** (2013-2019): Use Word2Vec or GloVe to embed class names, learn a mapping from visual features. Limited by text embedding quality.
3. **Vision-language pretraining** (2021+): CLIP, ALIGN, SigLIP learn aligned spaces from web-scale data. Dominant paradigm.

### SigLIP: Improving the Contrastive Objective

SigLIP (Google, 2023) replaces CLIP's softmax-based contrastive loss with a sigmoid loss applied to each image-text pair independently:

$$\mathcal{L} = -\frac{1}{N^2} \sum_{i,j} \log \sigma\left(z_{ij}(-1)^{\mathbf{1}[i \neq j]}(\mathbf{v}_i \cdot \mathbf{t}_j - b)\right)$$

This removes the need for all-to-all communication within a batch, enabling larger effective batch sizes. SigLIP ViT-B/16 achieves 78.2% zero-shot ImageNet top-1 accuracy, outperforming CLIP ViT-B/16 at 71.1%.

## Why It Matters

1. **Eliminates per-task annotation**: Deploying a classifier for a new set of categories requires only writing text descriptions, not collecting and labeling thousands of images.
2. **Scales to thousands of classes**: Text prototypes can be generated for any number of categories at negligible cost, while labeled datasets become exponentially harder to build.
3. **Enables rapid prototyping**: Product teams can evaluate whether a visual classification task is feasible in minutes rather than weeks.
4. **Handles evolving taxonomies**: When new categories emerge (e.g., a new product line), the system adapts immediately through new text descriptions without retraining.

## Key Technical Details

- **ImageNet zero-shot benchmarks** (top-1 accuracy): CLIP ViT-L/14@336px: 76.2%; OpenCLIP ViT-G/14: 80.1%; SigLIP ViT-SO400M: 83.1%; EVA-CLIP ViT-18B: 83.8%
- **Domain sensitivity**: Zero-shot accuracy drops sharply on specialized domains -- CLIP achieves 76.2% on ImageNet but only 58.8% on EuroSAT (satellite) and 43.3% on DTD (textures)
- **Few-shot hybrid**: Adding even 1-4 labeled examples per class (few-shot) via linear probing or adapter tuning often boosts accuracy by 10-20 points over pure zero-shot
- **Compute at inference**: Zero-shot classification requires only one forward pass per image plus precomputed text embeddings, making it faster than ensemble methods
- **Label granularity**: Performance degrades with fine-grained classes; zero-shot distinguishing dog breeds (Stanford Dogs) is much harder than distinguishing broad categories (CIFAR-10)
- **Embedding normalization**: Both image and text embeddings must be L2-normalized before similarity computation; skipping this degrades accuracy by 10+ points

## Common Misconceptions

- **"Zero-shot means no training at all."** The model is extensively pretrained on hundreds of millions of image-text pairs. "Zero-shot" refers specifically to the target classification task -- no examples from those categories were used during pretraining in a labeled sense.

- **"Zero-shot classification works equally well for all domains."** Performance varies enormously by domain. CLIP's accuracy can range from 95%+ on simple benchmarks (CIFAR-10) to below 50% on specialized domains (fine-grained medical, satellite imagery).

- **"Text embeddings are a drop-in replacement for trained classifiers."** On in-distribution data, a linear probe trained on even 16 labeled examples per class typically outperforms zero-shot classification by 5-15 percentage points. Zero-shot is powerful when labeled data is unavailable, not when it is plentiful.

- **"Any text description will work."** The text must be phrased in a style similar to the pretraining captions. Technical jargon, long descriptions, and negations often degrade performance compared to simple noun-phrase templates.

## Connections to Other Concepts

- **CLIP**: The dominant model for zero-shot classification; provides the shared embedding space and contrastive training framework.
- **Open-Vocabulary Detection**: Extends zero-shot classification from whole images to localized regions within images.
- **Image Captioning**: The inverse task -- generating text from images rather than matching images to text categories.
- **Vision Foundation Models**: Zero-shot capability is a key evaluation metric for foundation models like CLIP, SigLIP, and EVA-CLIP.
- **Transfer Learning**: Zero-shot classification is an extreme form of transfer where no task-specific adaptation occurs.

## Further Reading

- Radford et al., "Learning Transferable Visual Models From Natural Language Supervision" (2021) -- CLIP's zero-shot evaluation protocol.
- Zhai et al., "Sigmoid Loss for Language Image Pre-Training" (2023) -- SigLIP, improving contrastive training for zero-shot performance.
- Xian et al., "Zero-Shot Learning -- A Comprehensive Evaluation of the Good, the Bad and the Ugly" (2019) -- Systematic benchmark of pre-CLIP zero-shot methods.
- Zhou et al., "Learning to Prompt for Vision-Language Models" (CoOp, 2022) -- Learnable prompt tuning to bridge zero-shot and few-shot regimes.
