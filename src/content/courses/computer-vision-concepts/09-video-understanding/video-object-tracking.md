# Video Object Tracking

**One-Line Summary**: Video object tracking localizes a target object across video frames, encompassing single-object tracking (SOT) with template matching and multi-object tracking (MOT) with detection-and-association pipelines.

**Prerequisites**: Convolutional neural networks, bounding box regression, object detection, cross-correlation, self-attention mechanism

## What Is Video Object Tracking?

Imagine following a specific person through a crowded train station using security cameras. You see them at the entrance, and your task is to keep locating them in every subsequent frame as they walk, turn, get partially hidden behind pillars, and reappear. This is precisely what video object tracking does: given an initial indication of a target (a bounding box in the first frame), the system must predict that target's location in every subsequent frame.

Tracking is divided into two major paradigms:

**Single Object Tracking (SOT)**: Track one target specified in the first frame. No category-specific training is needed -- the tracker must generalize to arbitrary objects. Evaluated on benchmarks like OTB-100, LaSOT, GOT-10k, and TrackingNet.

**Multi-Object Tracking (MOT)**: Track all objects of a specific category (typically pedestrians) across frames, maintaining unique identities. Requires handling object birth, death, occlusion, and identity switches. Evaluated on MOT16/17/20 and TAO benchmarks.

## How It Works

### Single Object Tracking (SOT)

#### Correlation Filter Trackers

Before deep learning dominated, correlation filter (CF) trackers were the standard. The target template is learned as a filter in the Fourier domain, enabling efficient tracking:

$$\hat{W} = \frac{\hat{X}^* \odot \hat{Y}}{\hat{X}^* \odot \hat{X} + \lambda}$$

where $\hat{X}$ is the Fourier transform of the training sample, $\hat{Y}$ is the desired Gaussian response, and $\lambda$ is a regularization term. Tracking via circular correlation in the Fourier domain runs at hundreds of FPS. Key trackers:

- MOSSE (Bolme et al., 2010): ~669 FPS, foundational correlation filter approach
- KCF (Henriques et al., 2015): Used kernel trick with HOG features, ~292 FPS
- ECO (Danelljan et al., 2017): Factorized convolution operators, state-of-the-art CF tracker

#### Siamese Trackers

SiamFC (Bertinetto et al., 2016) formulated tracking as template matching using a Siamese CNN:

$$f(z, x) = \phi(z) * \phi(x) + b$$

where $z$ is the target template, $x$ is the search region, $\phi$ is a shared feature extractor (originally AlexNet), and $*$ denotes cross-correlation. The resulting response map indicates the target's location.

Key Siamese trackers and their innovations:

- **SiamFC** (2016): Cross-correlation for similarity, ~86 FPS, 58.2% AUC on OTB-100
- **SiamRPN** (Li et al., 2018): Added Region Proposal Network for bounding box regression, 160 FPS
- **SiamRPN++** (Li et al., 2019): Depth-wise cross-correlation with deeper backbones (ResNet-50), 69.6% AUC on LaSOT
- **SiamBAN** (Chen et al., 2020): Box-adaptive tracking head, eliminated anchors

#### Transformer Trackers

Transformers brought global context and flexible attention to tracking:

**STARK** (Yan et al., 2021): Uses a transformer encoder-decoder architecture. The encoder processes concatenated template and search region tokens with self-attention, enabling the template to attend to the search region and vice versa. A corner prediction head outputs the bounding box. STARK achieved 67.1% AUC on LaSOT at ~30 FPS.

**MixFormer** (Cui et al., 2022): Eliminates the separate template-search dichotomy. A mixed attention mechanism (MAM) jointly processes template and search tokens in every attention layer:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q K^\top}{\sqrt{d}}\right) V$$

where $Q, K, V$ are constructed from the concatenation of template and search features. This implicit feature interaction replaces explicit cross-correlation. MixFormer achieved 70.1% AUC on LaSOT.

**OSTrack** (Ye et al., 2022): One-stream tracking with joint feature extraction and relation modeling using a plain ViT backbone. 71.1% AUC on LaSOT at 105 FPS (ViT-B with candidate elimination).

### Multi-Object Tracking (MOT)

The dominant paradigm is **tracking-by-detection**: run an object detector per frame, then associate detections across frames.

#### Association Strategies

**Hungarian algorithm**: Formulates frame-to-frame association as a bipartite matching problem. The cost matrix uses IoU, appearance embeddings, or motion predictions. SORT (Bewley et al., 2016) uses Kalman filter motion prediction + IoU matching, running at 260 FPS.

**DeepSORT** (Wojke et al., 2017): Extends SORT with a Re-ID appearance model. Cosine distance between appearance embeddings is combined with Mahalanobis distance from the Kalman filter:

$$d(i, j) = \lambda \cdot d_{\text{appearance}}(i, j) + (1 - \lambda) \cdot d_{\text{motion}}(i, j)$$

This handles occlusions better by re-identifying targets after they reappear.

**ByteTrack** (Zhang et al., 2022): Uses all detection boxes (not just high-confidence ones) in a two-stage association. First matches high-confidence detections, then associates low-confidence detections with unmatched tracks. Achieved 80.3 MOTA on MOT17 with YOLOX detector.

**Transformer-based MOT**: TrackFormer (Meinhardt et al., 2022) and MOTRv2 (Zhang et al., 2023) use track queries in DETR-style architectures, where each query represents a tracked identity across frames.

## Why It Matters

1. **Surveillance and security**: Real-time person tracking across camera networks enables anomaly detection and forensic analysis.
2. **Autonomous driving**: Tracking vehicles, pedestrians, and cyclists is essential for trajectory prediction and collision avoidance. Trackers must maintain identity through occlusions and handle fast-moving objects.
3. **Sports analytics**: Player tracking enables automated statistics, tactical analysis, and broadcast augmentation. Systems like Hawk-Eye and Second Spectrum process 25--30 FPS with sub-pixel accuracy.
4. **Robotics**: Object tracking enables robots to manipulate, follow, and interact with objects in dynamic environments.
5. **Video editing**: Tracking enables automatic rotoscoping, object removal, and visual effects compositing.

## Key Technical Details

- SOT benchmarks: LaSOT (1,400 sequences, long-term), GOT-10k (10,000 sequences, zero-shot), TrackingNet (30,000 sequences)
- MOT benchmarks: MOT17 (pedestrian tracking, 7 training + 7 test sequences), MOT20 (crowded scenes)
- SiamFC: AlexNet backbone, 86 FPS, 58.2% AUC on OTB-100
- STARK-ST101: ResNet-101 encoder + transformer decoder, 67.1% AUC on LaSOT, ~30 FPS
- OSTrack-384: ViT-B backbone, 71.1% AUC on LaSOT, 105 FPS (with candidate elimination)
- ByteTrack: 80.3 MOTA on MOT17, 30 FPS with YOLOX-X detector
- DeepSORT Re-ID model: trained on person re-identification datasets (Market-1501, MARS)
- Typical SOT model size: 20--90M parameters; inference on a single GPU at 30--100+ FPS
- MOT metrics: MOTA (accuracy), IDF1 (identity preservation), HOTA (unified metric)

## Common Misconceptions

- **"SOT and MOT are the same problem at different scales."** They are fundamentally different. SOT is class-agnostic (track any object specified by a template) and focuses on appearance matching. MOT is class-specific (track all pedestrians), requires detection, and focuses on data association and identity management.
- **"Faster trackers sacrifice too much accuracy."** Modern efficient trackers like OSTrack achieve both high accuracy (71.1% AUC on LaSOT) and real-time speed (105 FPS). The accuracy-speed Pareto frontier has improved dramatically.
- **"Tracking is just detection applied per frame."** Frame-by-frame detection without temporal association fails catastrophically in occlusion, crowded scenes, and identity maintenance. Tracking requires motion modeling, appearance memory, and association logic beyond detection.

## Connections to Other Concepts

- `3d-object-detection.md`: Provides the per-frame detections that MOT trackers associate across time.
- `optical-flow-estimation.md`: Flow provides motion cues that can improve tracking through occlusions.
- `video-transformers.md`: Transformer architectures (STARK, MixFormer, OSTrack) now dominate SOT.
- `action-recognition.md`: Tracking provides actor-centric trajectories that can improve activity understanding.
- `video-representation.md`: Trackers must efficiently represent both the target template and the search region across time.

## Further Reading

- Bertinetto et al., "Fully-Convolutional Siamese Networks for Object Tracking" (2016) -- SiamFC: foundational Siamese tracker.
- Li et al., "SiamRPN++: Evolution of Siamese Visual Tracking with Very Deep Networks" (2019) -- Enabled deep backbones for Siamese tracking.
- Yan et al., "Learning Spatio-Temporal Transformer for Visual Tracking" (2021) -- STARK: first successful transformer tracker.
- Cui et al., "MixFormer: End-to-End Tracking with Iterative Mixed Attention" (2022) -- Unified template-search processing.
- Zhang et al., "ByteTrack: Multi-Object Tracking by Associating Every Detection Box" (2022) -- Simple, effective MOT using all detections.
