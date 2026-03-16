# Benchmark Leaderboards

**One-Line Summary**: Benchmark leaderboards -- tracked by Papers With Code, COCO, and ImageNet evaluation servers -- standardize model comparison, drive competitive progress, and shape research priorities, but also introduce biases toward benchmark-specific optimization.

**Prerequisites**: Classification Metrics, Detection Metrics, Segmentation Metrics, Landmark Datasets

## What Are Benchmark Leaderboards?

Imagine a scoreboard in a sports league: every team plays the same game under the same rules, and rankings are clear. Benchmark leaderboards serve the same function for computer vision -- they provide standardized evaluation on fixed datasets with agreed-upon metrics, enabling apples-to-apples comparison of methods. When a paper claims "state-of-the-art," it means the method tops a leaderboard.

Technically, a benchmark leaderboard is a public ranking of methods evaluated on a held-out test set using a standardized protocol. The ranking metric (top-1 accuracy, mAP, mIoU, FID) is predefined. Test set labels are typically hidden to prevent overfitting; submissions are evaluated by a server (e.g., COCO evaluation server, CodaLab). Leaderboards are maintained by dataset organizers, conferences (CVPR/ECCV challenges), and aggregator platforms (Papers With Code).

## How It Works

### Major Leaderboards and Their Metrics

**ImageNet (ILSVRC)**:
- Metric: Top-1 and top-5 accuracy on 50K validation images.
- History: AlexNet (2012, 63.3% top-1) to CoCa (2022, 91.0% top-1). A 28-point improvement in 10 years.
- Status: Near-saturated. Top models exceed 90% top-1. Research has shifted to efficiency, robustness, and transfer.

**COCO Detection**:
- Metric: AP@[.50:.05:.95] (primary), AP50, AP75, AP_S, AP_M, AP_L.
- History: Faster R-CNN (2015, ~37% AP) to Co-DETR (2023, ~66% AP).
- Evaluation server: test-dev results are submitted and evaluated remotely.

**COCO Panoptic**:
- Metric: PQ, PQ_Th, PQ_St.
- State-of-the-art: ~63% PQ (Mask2Former variants).

**ADE20K Semantic Segmentation**:
- Metric: mIoU on 150 classes.
- History: FCN (2015, ~29% mIoU) to InternImage/SegGPT (2023, ~62--64% mIoU).

**Cityscapes**:
- Metric: mIoU on 19 classes (val and test sets).
- State-of-the-art: ~86% mIoU.

### Papers With Code

Papers With Code (PwC) is the largest aggregator of benchmark results, tracking:
- 6,500+ benchmarks across vision, NLP, audio, and more.
- 100,000+ results from published papers.
- Automatic linking of papers to code repositories and datasets.

For each benchmark, PwC maintains a sortable leaderboard with the method name, metric value, paper link, and code link. It has become the de facto standard for checking state-of-the-art results.

**Limitations of PwC**: Results are self-reported (anyone can submit); not all entries are verified. Some results use non-standard settings (extra training data, larger models) that make comparison unfair.

### EfficientNet and the Scaling Paradigm

The EfficientNet family (Tan & Le, 2019) exemplifies how leaderboards drive systematic progress. Rather than designing one architecture, EfficientNet defines a compound scaling rule that uniformly scales depth, width, and resolution:

$$d = \alpha^\phi, \quad w = \beta^\phi, \quad r = \gamma^\phi$$

subject to $\alpha \cdot \beta^2 \cdot \gamma^2 \approx 2$, where $\phi$ controls overall model size.

| Model | Params | FLOPs | ImageNet Top-1 |
|-------|--------|-------|----------------|
| EfficientNet-B0 | 5.3M | 0.39B | 77.1% |
| EfficientNet-B3 | 12M | 1.8B | 81.6% |
| EfficientNet-B7 | 66M | 37B | 84.3% |
| EfficientNetV2-L | 120M | 53B | 85.7% |

This scaling approach demonstrated that systematic architecture-metric tradeoff curves are more informative than single-point results.

### Standardized Evaluation Practices

Rigorous benchmarking requires:

1. **Fixed test set**: Labels are hidden; evaluation happens on a server. Prevents overfitting to test data.
2. **Standard preprocessing**: Defined image resolution, augmentation, and normalization. COCO specifies multi-scale testing protocols.
3. **Reproducibility**: Code must be public; training details (learning rate, epochs, hardware) must be reported.
4. **Fair comparison**: Same backbone, same training data, same input resolution. Many papers use different backbones (ResNet-50 vs. Swin-L), making direct comparison misleading.
5. **Statistical significance**: Reporting mean and standard deviation over multiple runs, though this is still uncommon in vision papers.

### Competition-Driven Progress

Annual challenges at CVPR, ECCV, and ICCV organize competitive evaluation:

- **COCO Challenges**: Detection, segmentation, keypoint, captioning. Running since 2015.
- **LVIS Challenge**: Long-tail instance segmentation (1,203 categories). Highlights failure on rare classes.
- **Robust Vision Challenge**: Evaluates robustness across distribution shifts (weather, corruption, domain).
- **BioMedical challenges (BraTS, MICCAI)**: Standardized evaluation for medical segmentation.

Winners typically achieve 1--3% improvement over the previous year's best, often through a combination of architectural innovation, training tricks, and larger models.

### The Goodhart's Law Problem

"When a measure becomes a target, it ceases to be a good measure." Benchmark leaderboards suffer from this:

- **Overfitting to benchmarks**: Models are tuned specifically for benchmark quirks (COCO's category distribution, ImageNet's class granularity) and may not generalize.
- **Test set contamination**: Web-crawled training data (LAION, CLIP) may inadvertently contain test images from benchmarks.
- **Metric gaming**: Tricks that improve AP by 0.1% (test-time augmentation, model ensembles) are impractical for deployment but standard on leaderboards.
- **Neglected dimensions**: Leaderboards optimize accuracy but rarely track inference speed, memory, energy cost, or fairness.

## Why It Matters

1. Leaderboards provide a common language for progress: "3% mAP improvement on COCO" is universally understood in the detection community.
2. Competition-driven research has produced rapid progress: COCO AP improved from ~37% to ~66% in eight years.
3. Standardized evaluation prevents cherry-picking results and forces methods to prove generalization.
4. However, leaderboard culture also narrows research focus: problems without good benchmarks (fairness, robustness, efficiency) receive less attention.

## Key Technical Details

- ImageNet top-1 accuracy trajectory: 63.3% (AlexNet, 2012) -> 74.9% (VGG, 2014) -> 76.1% (ResNet, 2015) -> 84.4% (EfficientNet-B7, 2019) -> 88.5% (ViT-L, 2021) -> 91.0% (CoCa, 2022).
- COCO AP trajectory: 37.4% (Faster R-CNN, 2015) -> 43.4% (FPN, 2017) -> 50.7% (DETR, 2020) -> 57.5% (DINO-DETR, 2022) -> 66.0% (Co-DETR, 2023).
- ADE20K mIoU: 29.4% (FCN, 2015) -> 45.7% (DeepLabV3+, 2018) -> 53.5% (Swin, 2021) -> 62.9% (InternImage, 2023).
- COCO test-dev submissions are rate-limited (a few per month) to prevent excessive test-time tuning.
- Papers With Code tracks ~1,500 benchmarks in computer vision alone, covering classification, detection, segmentation, generation, video, 3D, medical, and more.

## Common Misconceptions

- **"State-of-the-art on a leaderboard means the method is best for my task."** Leaderboard winners use large models with expensive training. A smaller model fine-tuned on your specific domain data often outperforms them in practice.
- **"Leaderboard improvements are always meaningful."** A 0.1% improvement on COCO might be within the noise of training variance. Few papers report confidence intervals or run multiple seeds.
- **"Papers With Code rankings are authoritative."** PwC aggregates self-reported results. Some entries use non-standard settings (extra data, different input resolution, model ensembles) that inflate numbers.

## Connections to Other Concepts

- `classification-metrics.md`: ImageNet leaderboards use top-1/top-5 accuracy.
- `detection-metrics.md`: COCO leaderboards use AP@[.50:.05:.95].
- `segmentation-metrics.md`: ADE20K uses mIoU; COCO panoptic uses PQ.
- `landmark-datasets.md`: Every major leaderboard is defined by a specific dataset and evaluation protocol.
- `generative-model-metrics.md`: FID leaderboards track generative model progress on CIFAR-10, FFHQ, and COCO.

## Further Reading

- Russakovsky et al., "ImageNet Large Scale Visual Recognition Challenge" (2015) -- Defined the ImageNet competition that catalyzed deep learning.
- Tan & Le, "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks" (2019) -- Compound scaling; Pareto-optimal accuracy-efficiency tradeoffs.
- Recht et al., "Do ImageNet Classifiers Generalize to ImageNet?" (2019) -- Showed a 11--14% accuracy drop on a new test set, revealing benchmark overfitting.
- Dehghani et al., "The Benchmark Lottery" (2021) -- Demonstrated that method rankings change dramatically across benchmarks, questioning single-benchmark evaluation.
