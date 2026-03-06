# Anomaly Detection

**One-Line Summary**: Visual anomaly detection learns the distribution of "normal" images and flags deviations, using methods like PatchCore and student-teacher networks to detect manufacturing defects without requiring defect examples during training.

**Prerequisites**: Convolutional Neural Networks, Transfer Learning, Feature Extraction, Image Segmentation

## What Is Anomaly Detection?

Imagine a quality inspector on a factory production line who has seen millions of perfect products but only a handful of defective ones -- and the defects are always different. The inspector learns "normal" so thoroughly that anything unusual instantly stands out. Visual anomaly detection works the same way: models learn the distribution of normal appearance and detect anomalies as deviations from that distribution.

Technically, anomaly detection (AD) in computer vision is a one-class classification problem. During training, only normal (defect-free) images are available. At inference, the model must detect and localize anomalies it has never seen. This is fundamentally different from supervised defect detection, where labeled examples of each defect type are required. The one-class setting is practical because defects are rare, diverse, and often unknown in advance.

## How It Works

### Problem Formulation

Given a training set $\mathcal{D}_{train} = \{x_1, ..., x_N\}$ of normal images, learn a scoring function $s(x)$ such that $s(x)$ is low for normal images and high for anomalous ones. Anomaly localization further produces a pixel-level anomaly map $s(x, i, j)$ for each spatial location.

### Feature-Embedding Approaches

The dominant paradigm extracts features from a pretrained network (typically ImageNet-pretrained ResNet or WideResNet) and models the distribution of normal features.

**PatchCore** (Roth et al., 2022): The current standard for industrial anomaly detection.

1. Extract patch-level features from intermediate layers of a pretrained WideResNet-50 (layers 2 and 3).
2. Build a memory bank (coreset) of normal patch features using greedy coreset subsampling to reduce the bank to ~1--10% of all patches while preserving coverage.
3. At inference, compute the distance from each test patch feature to its nearest neighbor in the memory bank.
4. The anomaly score is the maximum nearest-neighbor distance across all patches.

PatchCore achieves 99.6% image-level AUROC on MVTec AD, the primary benchmark. Inference takes ~80 ms per image on a GPU with a coreset of ~10K features.

**PaDiM** (Defard et al., 2021): Models the distribution of normal patch features as a multivariate Gaussian per spatial location. The Mahalanobis distance to the fitted distribution serves as the anomaly score:

$$s(x, i, j) = \sqrt{(f_{i,j} - \mu_{i,j})^T \Sigma_{i,j}^{-1} (f_{i,j} - \mu_{i,j})}$$

where $f_{i,j}$ is the feature at position $(i,j)$ and $(\mu_{i,j}, \Sigma_{i,j})$ are the per-position mean and covariance.

### Student-Teacher Networks

**STPM** (Wang et al., 2021): A pretrained teacher network (e.g., ResNet-18) extracts features from normal images. A student network is trained to match the teacher's feature maps on normal data. At inference, discrepancies between student and teacher features indicate anomalies:

$$s(x, i, j) = \|f_{teacher}(x)_{i,j} - f_{student}(x)_{i,j}\|^2$$

The student learns to replicate normal features but fails on anomalous regions it has never seen, producing high discrepancy scores.

**EfficientAD** (Batzner et al., 2024): Uses a lightweight student-teacher pair with a patch description network and an autoencoder for logical anomaly detection. Achieves 99.1% image AUROC on MVTec AD with inference at ~4 ms per image -- enabling real-time industrial inspection.

### Reconstruction-Based Methods

Autoencoders trained on normal images reconstruct normal inputs well but produce high reconstruction error on anomalies. However, modern autoencoders can be too powerful, reconstructing anomalies too. Techniques to prevent this:

- **Memory-augmented autoencoders**: Store normal prototypes and reconstruct by combining stored features.
- **Masked autoencoding**: Reconstruct masked patches; anomalous patches are harder to predict from normal context.

### Normalizing Flows

**CFLOW-AD** (Gudovskiy et al., 2022): Uses conditional normalizing flows to model the density of normal features at each spatial position. The log-likelihood under the learned density serves as the normality score. Normalizing flows provide a principled probabilistic framework and achieve 98.3% image AUROC on MVTec AD.

The advantage over Gaussian models (PaDiM) is that normalizing flows can capture non-Gaussian feature distributions, which arise in complex textures.

### Logical vs. Structural Anomalies

- **Structural anomalies**: Local texture or appearance defects (scratches, stains, dents). Well-captured by patch-level methods.
- **Logical anomalies**: Correct components in wrong positions or relationships (e.g., a missing screw, a rotated label). Require global context. The MVTec LOCO dataset specifically evaluates this distinction.

### Threshold Selection and Deployment

In production, the anomaly score must be converted to a binary decision (normal/anomaly) via a threshold $\tau$. Setting $\tau$ requires balancing:

- **False Positive Rate (FPR)**: Flagging normal products as defective wastes inspection time. Target FPR: <1% in most manufacturing settings.
- **False Negative Rate (FNR)**: Missing actual defects risks shipping faulty products. Target FNR: <0.1% for safety-critical components.

Threshold selection is typically done on a small validation set containing both normal and known anomaly examples, even though training uses only normal data.

## Why It Matters

1. Manufacturing defect detection is a multi-billion-dollar application. Manual inspection costs $0.5--2.0 per unit; automated inspection reduces this to $0.01--0.05.
2. The one-class setting eliminates the need to collect and label defect examples, which is the primary bottleneck in supervised approaches.
3. Anomaly detection applies beyond manufacturing: medical imaging (detecting rare pathologies), video surveillance (unusual events), and semiconductor inspection (wafer defect detection).
4. PatchCore-style methods require no training -- only feature extraction and coreset construction -- making deployment fast (hours, not weeks).

## Key Technical Details

- **MVTec AD benchmark**: 15 categories (5 textures, 10 objects), 5,354 images total, 73 anomaly types. Image-level AUROC and pixel-level AUROC are the primary metrics.
- PatchCore: 99.6% image AUROC, 98.1% pixel AUROC on MVTec AD. Memory bank of ~10K features per category; ~80 ms inference.
- EfficientAD: 99.1% image AUROC, 96.8% pixel AUROC. Runs at ~4 ms/image (250 FPS), enabling real-time inspection.
- Feature extraction typically uses layers 2--3 of a WideResNet-50 or ResNet-50 pretrained on ImageNet. Layer 1 features are too low-level; layer 4 features are too semantic.
- Coreset subsampling reduces memory bank size by 90--99% with <0.5% AUROC loss.
- **MVTec LOCO**: 5 categories with logical anomalies. PatchCore drops to ~80% AUROC, showing the challenge of logical anomaly detection.

## Common Misconceptions

- **"Anomaly detection requires examples of anomalies."** The defining characteristic of one-class AD is that only normal examples are used for training. Methods that require anomaly examples are supervised defect detection, not anomaly detection.
- **"Autoencoders are the best approach."** Modern autoencoders often reconstruct anomalies too well. Feature-embedding methods (PatchCore, PaDiM) consistently outperform reconstruction-based methods on MVTec AD.
- **"A pretrained feature extractor needs fine-tuning on the target domain."** PatchCore uses frozen ImageNet features and achieves near-perfect results on industrial textures. Fine-tuning can actually hurt by overfitting to the limited normal training set.

## Connections to Other Concepts

- **Feature Extraction**: Pretrained CNN features (especially intermediate layers) are the foundation of most modern AD methods.
- **Image Retrieval**: PatchCore's nearest-neighbor search in feature space is conceptually similar to image retrieval.
- **Image Segmentation**: Pixel-level anomaly maps are a form of binary segmentation (normal vs. anomaly).
- **Edge Deployment**: Factory-floor deployment requires fast inference on embedded hardware; EfficientAD's 4 ms latency enables this.

## Further Reading

- Roth et al., "Towards Total Recall in Industrial Anomaly Detection" (2022) -- PatchCore; the current standard for feature-embedding AD.
- Bergmann et al., "MVTec AD -- A Comprehensive Real-World Dataset for Unsupervised Anomaly Detection" (2019) -- The benchmark dataset.
- Wang et al., "Student-Teacher Feature Pyramid Matching for Anomaly Detection" (2021) -- STPM; student-teacher AD framework.
- Batzner et al., "EfficientAD: Accurate Visual Anomaly Detection at Millisecond-Level Latencies" (2024) -- Real-time AD for production.
