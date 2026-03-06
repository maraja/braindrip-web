# Image Retrieval

**One-Line Summary**: Image retrieval finds visually similar images in a database by encoding images as compact embedding vectors and performing approximate nearest neighbor search, powered by metric learning and contrastive losses.

**Prerequisites**: Convolutional Neural Networks, Transfer Learning, Metric Learning, Feature Extraction

## What Is Image Retrieval?

Imagine pointing your phone at a pair of shoes and instantly finding where to buy them online from a catalog of 100 million products. This is image retrieval: given a query image, find the most visually similar images in a large database. Unlike classification (which assigns a label), retrieval ranks all database images by similarity to the query.

Technically, image retrieval maps images to compact embedding vectors in a learned metric space, then uses approximate nearest neighbor (ANN) search to efficiently find the closest database embeddings to the query. The pipeline has two stages: (1) an offline indexing phase that encodes all database images and builds a search index, and (2) an online query phase that encodes the query and searches the index.

## How It Works

### Learned Embeddings

A CNN or Vision Transformer backbone (typically ResNet-50, EfficientNet, or ViT-B/16) extracts a feature map, which is pooled into a single vector. Common pooling strategies:

- **Global Average Pooling (GAP)**: Simple mean over spatial dimensions. Standard baseline.
- **GeM (Generalized Mean Pooling)** (Radenovic et al., 2019): $f_{GeM} = \left(\frac{1}{HW}\sum_{i} x_i^p\right)^{1/p}$ where $p > 1$ is a learnable parameter (typically $p \approx 3$). Emphasizes high-activation regions, consistently outperforming GAP by 2--5% mAP on retrieval benchmarks.

The embedding is L2-normalized to lie on the unit hypersphere, ensuring cosine similarity equals the dot product.

### Metric Learning Losses

The backbone is trained so that embeddings of similar images are close and dissimilar images are far apart.

**Contrastive Loss** (Hadsell et al., 2006): For pairs $(x_i, x_j)$ with label $y \in \{0, 1\}$ (same/different):

$$L = y \cdot d^2 + (1-y) \cdot \max(0, m - d)^2$$

where $d = \|f(x_i) - f(x_j)\|$ and $m$ is the margin.

**Triplet Loss** (Schroff et al., 2015): For triplets (anchor $a$, positive $p$, negative $n$):

$$L = \max(0, \|f(a) - f(p)\|^2 - \|f(a) - f(n)\|^2 + m)$$

Hard negative mining is critical -- randomly sampled negatives are too easy and provide no gradient signal.

**InfoNCE / NT-Xent** (Chen et al., 2020): Treats retrieval as an $(N+1)$-way classification problem within a batch. For a positive pair $(i, j)$ in a batch of $2N$ augmented views:

$$L_i = -\log \frac{\exp(\text{sim}(z_i, z_j)/\tau)}{\sum_{k \neq i} \exp(\text{sim}(z_i, z_k)/\tau)}$$

Temperature $\tau$ (typically 0.05--0.1) controls the sharpness of the distribution. This is the loss used by SimCLR, CLIP, and most modern contrastive frameworks.

**Proxy-based Losses**: Instead of mining pairs/triplets from the dataset, maintain a set of learnable proxy vectors (one per class). ProxyNCA++ achieves similar or better performance than triplet loss with faster convergence.

### Approximate Nearest Neighbor Search

Exact nearest neighbor search in a database of $N$ embeddings of dimension $d$ costs $O(Nd)$, which is prohibitive for millions of images. ANN methods trade small accuracy for dramatic speedup.

**FAISS** (Johnson et al., 2019): Facebook's library for efficient similarity search. Key index types:
- **IVF (Inverted File Index)**: Clusters embeddings into $k$ Voronoi cells using k-means. At query time, only searches the nearest $nprobe$ cells. With $k = 4096$ and $nprobe = 64$, achieves >95% recall@1 while searching only ~1.5% of the database.
- **PQ (Product Quantization)**: Compresses each embedding from $d \times 4$ bytes to $m$ bytes (e.g., 64 bytes for $d = 256$). Combined with IVF as IVF-PQ, this is the standard for billion-scale search.
- **HNSW (Hierarchical Navigable Small World)**: Graph-based index. Higher recall than IVF at the same speed, but uses more memory.

**ScaNN** (Guo et al., 2020): Google's ANN library using anisotropic vector quantization. Achieves higher recall than FAISS IVF-PQ at the same throughput on internal benchmarks.

### Re-Ranking

Initial ANN retrieval returns the top-$K$ candidates (e.g., $K = 100$). Re-ranking refines this list:

- **Query Expansion (QE)**: Average the query embedding with top-$k$ result embeddings and re-search. Improves mAP by 2--5%.
- **Spatial Verification**: Match local features (SuperPoint, DISK) between query and candidates using RANSAC. Removes false positives but adds 10--50 ms per candidate.
- **Cross-Encoder Re-Ranking**: Feed concatenated query-candidate pairs through a Transformer for fine-grained similarity scoring.

## Why It Matters

1. Visual product search powers e-commerce at companies like Pinterest (10B+ visual searches/year), Google Lens, and Amazon.
2. Reverse image search detects copyright infringement and tracks misinformation (finding the original source of viral images).
3. Geo-localization matches query photos to a database of geotagged images for place recognition in robotics and AR.
4. Content-based recommendation systems use image retrieval to suggest visually similar items.

## Key Technical Details

- Embedding dimensions: 128--2048; 512 is a common sweet spot balancing accuracy and index size.
- FAISS IVF-PQ with 64-byte codes indexes 1 billion 256-D vectors in ~64 GB RAM, answering queries in <5 ms on a single CPU core.
- Standard retrieval benchmarks: ROxford5k and RParis6k (revisited) with Easy, Medium, Hard protocols. State-of-the-art: ~85% mAP on Medium, ~65% mAP on Hard.
- Google Landmarks v2 (GLDv2): 5M images, 200K landmarks. Used for place recognition.
- GeM pooling + ArcFace loss on a ResNet-101 backbone is a strong baseline: ~80% mAP on ROxford5k Medium.
- CLIP embeddings (ViT-L/14, 768-D) achieve competitive zero-shot retrieval without any fine-tuning on retrieval-specific data.

## Common Misconceptions

- **"Image retrieval is just classification with many classes."** Retrieval must handle open-set queries (unseen during training) and rank by continuous similarity rather than assigning discrete labels.
- **"Bigger embeddings are always better."** Beyond 512--1024 dimensions, accuracy gains are marginal while index size and search time grow linearly. PQ compression makes this less of an issue but adds quantization error.
- **"ANN search is lossy and unreliable."** Well-tuned HNSW or IVF indexes achieve 99%+ recall@10 while searching less than 1% of the database. The approximation is negligible compared to embedding model errors.

## Connections to Other Concepts

- **Metric Learning**: Contrastive, triplet, and proxy losses are the training objectives for retrieval embeddings.
- **Face Detection and Recognition**: Face retrieval (identification) is a specialized image retrieval task.
- **Anomaly Detection**: PatchCore uses nearest-neighbor search in feature space, analogous to retrieval.
- **Multimodal Models**: CLIP enables cross-modal retrieval (text query, image results) using shared embedding spaces.

## Further Reading

- Radenovic et al., "Fine-tuning CNN Image Retrieval with No Human Annotation" (2019) -- GeM pooling and self-supervised fine-tuning for retrieval.
- Johnson et al., "Billion-Scale Similarity Search with GPUs" (2019) -- FAISS; the standard library for ANN search.
- Guo et al., "Accelerating Large-Scale Inference with Anisotropic Vector Quantization" (2020) -- ScaNN; Google's ANN system.
- Musgrave et al., "A Metric Learning Reality Check" (2020) -- Rigorous evaluation showing many metric learning advances are due to implementation details, not loss function design.
