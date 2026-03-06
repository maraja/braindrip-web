# Anomaly Detection

**One-Line Summary**: Identifying data points that deviate significantly from the norm -- isolation forests, autoencoders, and statistical approaches.

**Prerequisites**: Probability distributions, decision trees (for isolation forests), neural networks (for autoencoders), principal component analysis.

## What Is Anomaly Detection?

Consider a factory producing ball bearings. Millions are identical within tight tolerances, but occasionally one comes off the line with an unusual defect. Inspecting every bearing by hand is infeasible; you need an automated system that flags the rare, abnormal ones. Anomaly detection is this system -- it learns what "normal" looks like and raises an alarm when something deviates.

Formally, anomaly detection identifies observations that do not conform to an expected pattern. These observations are called anomalies, outliers, or novelties. The challenge is that anomalies are rare, diverse (they deviate in unpredictable ways), and often the most important data points -- representing fraud, equipment failure, disease, or security breaches.

## How It Works

### Statistical Methods

The simplest approaches use distributional assumptions:

- **Z-score**: For univariate data assumed to be Gaussian, flag points where $|z| = |x - \mu| / \sigma > \tau$ (typically $\tau = 3$). In multivariate settings, use the Mahalanobis distance: $d_M(x) = \sqrt{(x - \mu)^T \Sigma^{-1} (x - \mu)}$.
- **IQR method**: Flag points below $Q_1 - 1.5 \cdot \text{IQR}$ or above $Q_3 + 1.5 \cdot \text{IQR}$. Distribution-free but limited to univariate data.
- **Grubbs' test**: A formal hypothesis test for detecting a single outlier in a univariate sample, assuming normality.

These methods are fast and interpretable but fail on multimodal, non-Gaussian, or high-dimensional data.

### Isolation Forest

Isolation Forest (Liu et al., 2008) exploits a key insight: anomalies are few and different, so they are easier to isolate. The algorithm:

1. Build an ensemble of random trees (isolation trees). At each node, select a random feature and a random split value between the feature's min and max.
2. A point's **path length** is the number of splits needed to isolate it (reach a leaf node with one point).
3. Anomalies, being rare and distinct, require fewer splits to isolate and thus have shorter average path lengths.

The anomaly score for point $x$ is:

$$s(x, n) = 2^{-E[h(x)] / c(n)}$$

where $E[h(x)]$ is the average path length across all trees and $c(n)$ is the average path length in an unsuccessful search in a binary search tree with $n$ nodes (a normalization constant). Scores near 1 indicate anomalies; scores near 0.5 indicate normal points.

**Advantages**: Linear time complexity $O(n \cdot t \cdot \log \psi)$ where $t$ is the number of trees and $\psi$ is the subsample size. No distance computations. Works well in high dimensions.

### One-Class SVM

One-Class SVM (Scholkopf et al., 1999) learns a decision boundary around normal data in a kernel-induced feature space. It solves:

$$\min_{w, \xi, \rho} \frac{1}{2} \|w\|^2 + \frac{1}{\nu n} \sum_i \xi_i - \rho$$

subject to $w \cdot \phi(x_i) \geq \rho - \xi_i$ and $\xi_i \geq 0$. The parameter $\nu \in (0, 1]$ controls the fraction of training points allowed to fall outside the boundary. Points outside are anomalies.

### Autoencoder-Based Detection

An autoencoder is a neural network trained to reconstruct its input through a bottleneck:

$$\hat{x} = \text{decoder}(\text{encoder}(x))$$

The key insight: an autoencoder trained on normal data learns to reconstruct normal patterns. Anomalous inputs, not conforming to learned patterns, yield high reconstruction error:

$$\text{anomaly\_score}(x) = \|x - \hat{x}\|^2$$

Points with reconstruction error above a threshold are flagged as anomalies. This approach naturally handles high-dimensional, complex data (images, time series, sequences) and can capture nonlinear relationships.

### Local Outlier Factor (LOF)

LOF (Breunig et al., 2000) measures the local density deviation of a point relative to its neighbors:

$$\text{LOF}_k(x) = \frac{1}{|N_k(x)|} \sum_{o \in N_k(x)} \frac{\text{lrd}_k(o)}{\text{lrd}_k(x)}$$

where $\text{lrd}_k(x)$ is the local reachability density -- roughly the inverse of the average reachability distance to $k$ nearest neighbors. LOF $\approx 1$ means similar density to neighbors (normal); LOF $\gg 1$ means lower density (anomaly). The strength of LOF is detecting local anomalies -- points that are outliers relative to their neighborhood, even if their absolute position seems unremarkable.

### Supervised vs. Unsupervised Anomaly Detection

- **Unsupervised**: No labels required. Assumes anomalies are rare and different. Most methods above are unsupervised.
- **Semi-supervised**: Train only on normal data (one-class classification). Assumes clean training set.
- **Supervised**: Uses labeled anomalies and normal points. More accurate when labels exist, but labels are expensive and anomalies are rare (extreme class imbalance).

In practice, a hybrid approach is common: start unsupervised to identify candidates, then refine with expert labels.

## Why It Matters

Anomaly detection is critical across industries:
- **Finance**: Detecting fraudulent transactions in real time among billions of legitimate ones.
- **Cybersecurity**: Identifying network intrusions or malicious behavior from normal traffic patterns.
- **Manufacturing**: Catching defective products on the production line before they ship.
- **Healthcare**: Flagging unusual patient vitals or rare disease patterns.
- **Infrastructure**: Monitoring sensor data for equipment failure prediction.

The asymmetry of costs -- missing an anomaly can be catastrophic, while a false alarm is merely annoying -- makes this a uniquely consequential ML application.

### Practical Example

A credit card company monitors millions of daily transactions. Each transaction is described by features: amount, merchant category, time of day, geographic distance from last transaction, and frequency of recent transactions. An isolation forest trained on historical normal transactions assigns an anomaly score to each new transaction. Transactions scoring above a threshold (calibrated to flag roughly 0.1% of volume) are routed to a fraud investigation team. The model catches unusual patterns -- such as a small test purchase in a foreign country followed immediately by a large purchase -- that rule-based systems might miss.

## Key Technical Details

- **Contamination parameter**: Most methods require an estimate of the fraction of anomalies in the data. This can be tuned via domain knowledge or cross-validation when some labels exist.
- **Feature engineering matters**: Anomaly detection performance depends heavily on choosing features that make anomalies distinguishable. Domain expertise is crucial.
- **Evaluation metrics**: Accuracy is meaningless with extreme class imbalance. Use precision-recall curves, F1 score, area under the ROC curve (AUC-ROC), or average precision (AUC-PR).
- **Curse of dimensionality**: In very high dimensions, all points become approximately equidistant, making distance-based methods unreliable. Dimensionality reduction (PCA, autoencoders) is often a prerequisite.
- **Ensemble approaches**: Combining scores from multiple detectors (isolation forest + LOF + autoencoder) often outperforms any single method, as different algorithms capture different types of anomalies.

## Common Misconceptions

- **"Anomaly detection finds all anomalies."** Methods find deviations from the learned normal pattern. Novel types of anomalies not reflected in the training data may be missed (unknown unknowns).
- **"More complex models are always better."** Isolation forests often outperform deep learning methods on tabular data. Match model complexity to data complexity.
- **"Anomalies are always errors."** An anomaly is a statistical deviation. It might be an error, a fraud, a rare but legitimate event, or a data collection artifact. Human review is essential.
- **"You can evaluate anomaly detection without labels."** Truly unsupervised evaluation is nearly impossible. Some labeled anomalies are needed for meaningful performance assessment.

## Connections to Other Concepts

- **Gaussian Mixture Models**: Points with low probability $p(x)$ under a fitted GMM are natural anomaly candidates. GMMs provide a density-based anomaly score that accounts for cluster shape and covariance structure.
- **DBSCAN**: Noise points in DBSCAN are density-based outliers. DBSCAN provides a complementary view of anomalies as points in low-density regions. The noise label is DBSCAN's built-in anomaly detector.
- **Principal Component Analysis**: PCA reconstruction error (projection residual in discarded components) is a classical anomaly score. High residual implies the point does not conform to the principal subspace. This is computationally efficient and works well when normal data lies on a low-dimensional subspace.
- **Association Rules**: Unusual transaction patterns (items rarely bought together) can signal anomalous behavior in market basket contexts. A transaction that violates high-confidence rules warrants investigation.
- **K-Means Clustering**: Points with large distance to their nearest centroid after K-means clustering can serve as a simple anomaly score, though this approach inherits K-means' limitation to spherical cluster shapes.
- **t-SNE and UMAP**: Visualization via t-SNE or UMAP can reveal anomalies as isolated points, but this is a qualitative tool and should not replace quantitative anomaly scoring.

## Further Reading

- Chandola, Banerjee, and Kumar, "Anomaly Detection: A Survey" (2009) -- Comprehensive survey covering all major paradigms.
- Liu, Ting, and Zhou, "Isolation Forest" (2008) -- The foundational paper on isolation-based anomaly detection.
- Breunig et al., "LOF: Identifying Density-Based Local Outliers" (2000) -- Introduced local outlier factor for context-aware anomaly detection.
- Pang et al., "Deep Learning for Anomaly Detection: A Review" (2021) -- Modern survey covering autoencoder, GAN, and self-supervised approaches.
