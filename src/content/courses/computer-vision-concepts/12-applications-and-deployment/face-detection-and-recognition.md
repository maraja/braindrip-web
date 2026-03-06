# Face Detection and Recognition

**One-Line Summary**: Face detection locates faces in images while face recognition maps them to identities, evolving from Viola-Jones cascades to deep embedding models like ArcFace that achieve >99.8% verification accuracy.

**Prerequisites**: Convolutional Neural Networks, Object Detection, Metric Learning, Transfer Learning

## What Is Face Detection and Recognition?

Think of face detection as a bouncer scanning a crowd to find every face, and face recognition as the bouncer checking each face against a guest list. Detection answers "where are the faces?" while recognition answers "whose face is this?"

Technically, face detection is a special case of object detection that localizes face bounding boxes (and often facial landmarks). Face recognition extracts a compact embedding vector from a detected face and compares it against a gallery of known identities. The two fundamental tasks are:

- **Verification** (1:1): Are these two face images the same person? Binary decision with a threshold on embedding distance.
- **Identification** (1:N): Given a probe face, find the closest match in a gallery of $N$ identities.

## How It Works

### Evolution of Face Detection

**Viola-Jones (2001)**: Cascaded classifiers using Haar-like features and AdaBoost. Achieved real-time detection at ~15 FPS on 2001 hardware. Limited to frontal, upright faces.

**MTCNN (2016)**: Multi-task Cascaded CNN with three stages -- Proposal Network (P-Net), Refine Network (R-Net), Output Network (O-Net). Jointly detects faces and five facial landmarks. Runs at ~50 FPS on a GPU.

**RetinaFace (2020)**: Single-stage anchor-based detector built on a Feature Pyramid Network. Predicts bounding boxes, five landmarks, and 3D face mesh vertices simultaneously. Achieves 96.9% AP on WIDER FACE hard set. Uses a multi-task loss:

$$L = L_{cls} + \lambda_1 L_{box} + \lambda_2 L_{pts} + \lambda_3 L_{mesh}$$

### Face Alignment

Before recognition, faces are aligned to a canonical pose using detected landmarks. A similarity transform (rotation, scale, translation) maps five key points (two eyes, nose, two mouth corners) to template positions. This normalization improves recognition accuracy by 2--5%.

### Face Recognition Embeddings

Modern recognition maps a $112 \times 112$ aligned face to a 512-dimensional unit vector. Training uses classification on large identity datasets, but the classifier head is discarded at inference -- only the embedding is kept.

**Loss Functions**:

- **Softmax Loss**: Baseline, but does not enforce inter-class separation.
- **Triplet Loss** (Schroff et al., 2015): Requires mining hard positive/negative pairs. Used in FaceNet; produces 128-D embeddings.
- **ArcFace** (Deng et al., 2019): Adds an angular margin $m$ to the target logit, enforcing a geodesic margin on the hypersphere:

$$L = -\log \frac{e^{s \cos(\theta_{y_i} + m)}}{e^{s \cos(\theta_{y_i} + m)} + \sum_{j \neq y_i} e^{s \cos \theta_j}}$$

where $s = 64$ is a scale factor and $m = 0.5$ radians. ArcFace achieves 99.83% on LFW and 98.35% on IJB-C (TAR@FAR=1e-4).

### Verification vs. Identification

**Verification**: Compute cosine similarity between two embeddings. If $\text{sim}(e_1, e_2) > \tau$, declare same identity. At $\tau = 0.4$ with ArcFace embeddings, FAR $\approx$ 1e-6.

**Identification**: Given a probe embedding, find the nearest neighbor in a gallery using approximate nearest neighbor search (e.g., FAISS). Complexity scales with gallery size; a gallery of 1M identities requires efficient indexing.

### Anti-Spoofing

Preventing presentation attacks (photos, video replays, 3D masks) is critical. Methods include:

- **Liveness detection**: Detect eye blinks, head movement, or texture analysis (LBP patterns differ for printed photos).
- **Depth estimation**: Structured light or time-of-flight sensors distinguish flat photos from real 3D faces.
- **Multi-spectral imaging**: Near-infrared captures subsurface skin features absent in printed media.

### Key Benchmarks

| Benchmark | Protocol | Scale | Focus |
|-----------|----------|-------|-------|
| LFW | 6,000 pairs, 10-fold cross-val | 13K images, 5,749 identities | Verification (unconstrained) |
| IJB-C | TAR@FAR curves | 31K images, 3,531 identities | Mixed media (still + video) |
| MegaFace | 1:N identification | 1M distractors | Large-scale identification |
| WIDER FACE | AP on Easy/Medium/Hard | 32K images, 394K faces | Detection in the wild |

LFW is near-saturated (top methods >99.8%); IJB-C with its strict FAR thresholds (1e-4, 1e-5) remains discriminating.

## Why It Matters

1. Face recognition unlocks phones (Apple Face ID processes ~30,000 infrared dots), secures airports, and enables photo organization.
2. Surveillance and law enforcement use cases raise significant ethical and privacy concerns, leading to bans in several jurisdictions.
3. The technology enables entertainment applications (face filters, deepfake detection) and accessibility tools.
4. Verification at 99.8%+ accuracy now matches or exceeds human performance on controlled benchmarks like LFW.

## Key Technical Details

- ArcFace with ResNet-100 backbone trained on MS1MV2 (5.8M images, 85K identities) achieves 99.83% on LFW.
- RetinaFace runs at ~30 FPS on a single GPU for VGA-resolution images.
- 512-dimensional embeddings at FP16 require 1 KB per face; a 10M-face gallery fits in ~10 GB.
- Apple Face ID uses a TrueDepth camera with 30,000 IR dots, storing a 3D facial geometry model on-device.
- Bias audits (Buolamwini & Gebru, 2018) showed commercial systems had error rates up to 34.7% on darker-skinned females vs. 0.8% on lighter-skinned males, driving industry-wide improvements.

## Common Misconceptions

- **"Face recognition is face detection."** Detection finds faces; recognition identifies them. Many applications need only detection (e.g., autofocus, anonymization).
- **"99% accuracy means the system rarely makes mistakes."** At 1:N identification with N = 1M, even 99.9% accuracy produces thousands of false matches. The FAR at the operating threshold is what matters.
- **"Face recognition works equally well for everyone."** Demographic bias is well-documented. Models trained predominantly on one demographic perform worse on others. Balanced training data and bias-aware evaluation are essential.

## Connections to Other Concepts

- **Metric Learning**: ArcFace and triplet loss are metric learning approaches that shape the embedding space.
- **Object Detection**: Face detection is a specialized detection task; RetinaFace borrows FPN and anchor-based designs.
- **Image Retrieval**: Face identification is a retrieval problem -- finding the nearest embedding in a gallery.
- **Edge Deployment**: Face recognition on phones requires quantized, efficient models (e.g., MobileFaceNet at 1M parameters).

## Further Reading

- Viola & Jones, "Rapid Object Detection using a Boosted Cascade of Simple Features" (2001) -- The foundational real-time face detector.
- Schroff et al., "FaceNet: A Unified Embedding for Face Recognition and Clustering" (2015) -- Introduced triplet loss for face embeddings.
- Deng et al., "ArcFace: Additive Angular Margin Loss for Deep Face Recognition" (2019) -- State-of-the-art margin-based loss function.
- Buolamwini & Gebru, "Gender Shades" (2018) -- Landmark study on demographic bias in commercial face recognition.
