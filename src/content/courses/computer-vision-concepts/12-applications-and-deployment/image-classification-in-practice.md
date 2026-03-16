# Image Classification in Practice

**One-Line Summary**: Deploying image classification beyond academic benchmarks requires handling class imbalance, domain shift, fine-grained distinctions, and serving millions of predictions per second.

**Prerequisites**: Convolutional Neural Networks, Transfer Learning, Data Augmentation, Batch Normalization

## What Is Image Classification in Practice?

Imagine you trained a model that scores 95% on ImageNet -- then you deploy it to classify defects on a factory floor and accuracy drops to 60%. Academic benchmarks use balanced classes, clean labels, and fixed distributions. Production classification must cope with long-tailed distributions (99% of images are "OK", 1% are defects), label noise from human annotators, distribution shift between training and deployment, and throughput demands that require batching thousands of images per second.

Technically, practical classification is the engineering discipline of closing the gap between research accuracy and deployed reliability across the full lifecycle: data collection, labeling, training, calibration, serving, and monitoring.

## How It Works

### Handling Class Imbalance

Real-world datasets are almost never balanced. A 1:100 imbalance between minority and majority classes causes naive models to predict only the majority class.

**Resampling**: Oversample minority classes or undersample majority classes. Random oversampling risks overfitting; SMOTE-style augmentation in feature space can help.

**Loss reweighting**: Assign higher loss to minority classes. Focal loss (Lin et al., 2017) down-weights well-classified examples:

$$FL(p_t) = -\alpha_t (1 - p_t)^\gamma \log(p_t)$$

With $\gamma = 2$ and $\alpha_t$ inversely proportional to class frequency, focal loss improves rare-class recall by 3--5 points on typical production datasets.

**Class-Balanced Loss** (Cui et al., 2019): Weights inversely proportional to effective number of samples $E_n = (1 - \beta^n) / (1 - \beta)$, where $n$ is the sample count and $\beta \in [0, 1)$.

### Fine-Grained Recognition

Distinguishing 200 bird species or 196 car models requires learning subtle differences -- beak shape, wing pattern, headlight curvature. Standard CNNs struggle because discriminative features occupy small regions.

- **Bilinear CNNs**: Compute outer product of two feature maps to capture part-feature correlations. Achieves ~85% on CUB-200 birds.
- **Attention cropping**: Learn to zoom into discriminative regions (e.g., RA-CNN, NTS-Net).
- **Part-based models**: Detect parts (head, body, tail) then classify from concatenated part features.

### Model Calibration

A model that outputs 0.9 confidence should be correct 90% of the time. Uncalibrated models (most modern deep networks) are overconfident. Temperature scaling (Guo et al., 2017) learns a single scalar $T$ on a validation set:

$$q_i = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}$$

This reduces Expected Calibration Error (ECE) from ~15% to ~2% with zero accuracy loss.

### Serving at Scale

Production systems serve classification at 1,000--100,000 queries per second (QPS). Key techniques:

- **Batched inference**: GPU utilization jumps from ~30% to ~90% when batch size increases from 1 to 32.
- **Model distillation**: Compress a ResNet-152 teacher into a MobileNetV3 student, losing ~1--2% accuracy but gaining 10x throughput.
- **TorchServe / Triton Inference Server**: Handle request queuing, batching, and multi-model serving.
- **Caching**: For repeated queries (e.g., product images), cache predictions to avoid redundant inference.

### Monitoring and Drift Detection

Data distribution shifts silently degrade accuracy. Monitor:

- **Prediction distribution**: Alert if the fraction of a class changes significantly (e.g., KL divergence > threshold).
- **Confidence histograms**: A spike in low-confidence predictions signals out-of-distribution inputs.
- **Periodic re-evaluation**: Sample and label production data weekly; compare against baseline metrics.

### Label Quality and Active Learning

Production labeling pipelines are noisy. Techniques for improving label quality:

- **Consensus labeling**: Multiple annotators per image; majority vote or Dawid-Skene model to estimate true labels. Reduces effective noise from ~10% to ~3%.
- **Confident learning** (Northcutt et al., 2021): Automatically identifies label errors by finding disagreements between model predictions and given labels. Cleaning ImageNet labels improved top-1 accuracy by ~1% without any model change.
- **Active learning**: Select the most informative unlabeled samples for human annotation. Uncertainty sampling (label the images the model is least confident about) reduces annotation cost by 30--50% compared to random sampling while achieving the same accuracy.

## Why It Matters

1. The majority of ML project failures occur not in modeling but in data quality, pipeline engineering, and monitoring -- all practical classification concerns.
2. Class imbalance is the default in fraud detection, medical diagnosis, manufacturing quality control, and content moderation.
3. Fine-grained recognition powers billion-dollar applications: visual search (Google Lens), species identification (iNaturalist), and product categorization (e-commerce).
4. Miscalibrated confidence scores lead to poor downstream decisions in safety-critical systems like medical triage.

## Key Technical Details

- ImageNet top-1 accuracy saturates above 90% (e.g., CoCa at 91.0%), but production accuracy on domain-specific data is typically 10--30 points lower without fine-tuning.
- Focal loss with $\gamma = 2$ is the most common starting point for imbalanced classification.
- Temperature scaling adds exactly one learned parameter and is the simplest effective calibration method.
- Triton Inference Server achieves ~50,000 QPS for ResNet-50 on a single A100 GPU with INT8 quantization and dynamic batching.
- Label noise of 5--10% is typical in crowd-sourced annotations; cleaning labels often improves accuracy more than architecture changes.

## Common Misconceptions

- **"Higher ImageNet accuracy always means better production performance."** Domain shift means a model scoring 85% on ImageNet may underperform a model scoring 80% that was fine-tuned on in-domain data.
- **"Class imbalance is solved by collecting more data."** If the imbalance reflects real-world frequency (e.g., rare diseases), more data preserves the same ratio. Loss reweighting and stratified sampling are needed.
- **"Softmax outputs are probabilities."** They sum to one but are not calibrated probabilities. Post-hoc calibration is required for reliable confidence estimates.

## Connections to Other Concepts

- `transfer-learning.md`: Fine-tuning pretrained backbones is the standard starting point for practical classification.
- `data-augmentation.md`: Essential for combating overfitting when minority classes have few samples.
- `edge-deployment.md`: Production classification often runs on mobile or embedded devices with strict latency budgets.
- `classification-metrics.md`: Precision, recall, and F1 matter more than raw accuracy in imbalanced settings.

## Further Reading

- Lin et al., "Focal Loss for Dense Object Detection" (2017) -- Introduced focal loss; widely adopted beyond detection.
- Guo et al., "On Calibration of Modern Neural Networks" (2017) -- Demonstrated deep networks are miscalibrated; proposed temperature scaling.
- Cui et al., "Class-Balanced Loss Based on Effective Number of Samples" (2019) -- Principled reweighting for long-tailed distributions.
- Menon et al., "Long-tail Learning via Logit Adjustment" (2021) -- Label-frequency-aware logit correction at training or inference time.
