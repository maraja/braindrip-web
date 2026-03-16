# ORB and Binary Descriptors

**One-Line Summary**: ORB, BRIEF, and BRISK encode local image patches as compact binary strings compared via Hamming distance, enabling feature matching orders of magnitude faster than floating-point descriptors like SIFT.

**Prerequisites**: Corner detection, image gradients, SIFT (for context), bitwise operations

## What Are Binary Descriptors?

Imagine describing a face to a sketch artist using only yes/no questions: "Is the left eye darker than the right? Is the nose wider than the mouth?" Each answer is one bit, and the full set of answers forms a binary code. Binary descriptors work exactly this way -- they compare pairs of pixel intensities within a patch and encode the results as a bit string. Matching two descriptors reduces to counting differing bits (Hamming distance), which modern CPUs execute in a single instruction.

ORB (Oriented FAST and Rotated BRIEF), introduced by Rublee et al. (2011), combines the FAST keypoint detector with a rotation-aware version of the BRIEF descriptor, providing a patent-free, real-time alternative to SIFT and SURF.

## How It Works

### BRIEF: Binary Robust Independent Elementary Features

Calonder et al. (2010) proposed BRIEF as the first practical binary descriptor:

1. Smooth the patch with a Gaussian ($\sigma \approx 2$) to reduce noise sensitivity.
2. Select $n$ pairs of pixel locations $(p_i, q_i)$ within the patch (typically $n = 256$).
3. For each pair, compute: $b_i = \begin{cases} 1 & \text{if } I(p_i) < I(q_i) \\ 0 & \text{otherwise} \end{cases}$
4. Concatenate to form an $n$-bit string.

BRIEF is fast to compute and match but not rotation-invariant, limiting its use to scenarios with small viewpoint changes.

### ORB: Oriented FAST and Rotated BRIEF

ORB addresses BRIEF's limitations in two stages:

**Detection (oFAST).** Use the FAST-9 corner detector across an image pyramid (typically 8 levels, scale factor 1.2). Assign each keypoint an orientation using the intensity centroid method:

$$\theta = \arctan\!\left(\frac{m_{01}}{m_{10}}\right), \quad m_{pq} = \sum_{x,y \in \text{patch}} x^p y^q I(x,y)$$

**Description (rBRIEF).** Rotate the BRIEF sampling pattern by the keypoint orientation $\theta$. To maintain discriminability after rotation, the 256 test pairs are selected via a greedy learning procedure that maximizes variance and minimizes correlation across a training set.

The resulting 256-bit descriptor is matched using Hamming distance:

$$d_H(a, b) = \text{popcount}(a \oplus b)$$

where $\oplus$ is bitwise XOR and `popcount` counts set bits. On x86 CPUs, this is a single `POPCNT` instruction per 64-bit word -- four instructions for a 256-bit descriptor.

### BRISK: Binary Robust Invariant Scalable Keypoints

Leutenegger et al. (2011) proposed BRISK with scale-space FAST detection and a hand-crafted circular sampling pattern:

- **Short pairs** (distance < $\delta_{\max}$): Used for the 512-bit descriptor.
- **Long pairs** (distance > $\delta_{\min}$): Used to estimate local gradient direction for rotation normalization.

BRISK operates at a comparable speed to ORB with slightly better scale invariance due to its continuous scale-space interpolation.

### Code Example

```python
import cv2

orb = cv2.ORB_create(nfeatures=1000)
kp1, des1 = orb.detectAndCompute(img1, None)
kp2, des2 = orb.detectAndCompute(img2, None)

# Hamming distance matcher
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
matches = bf.match(des1, des2)
matches = sorted(matches, key=lambda x: x.distance)
```

## Why It Matters

1. ORB runs at 10--30 ms per frame on a mobile CPU, enabling real-time SLAM on drones, phones, and embedded devices (e.g., ORB-SLAM2).
2. Binary matching is approximately 100x faster than L2-distance matching on 128-D float descriptors: a 256-bit Hamming comparison takes roughly 1 ns versus 100+ ns for SIFT.
3. Storage is dramatically reduced: 32 bytes per ORB descriptor versus 512 bytes per SIFT descriptor (16x compression).
4. ORB is completely patent-free, unlike SIFT (until 2020) and SURF, making it the default choice for open-source robotics projects.

## Key Technical Details

- ORB typically extracts 500--2,000 keypoints per 640x480 frame in 5--15 ms on a laptop CPU.
- Matching 1,000 ORB features against 1,000 takes under 1 ms with brute-force Hamming; FLANN-based LSH reduces this further for large databases.
- The FAST detector threshold (default 20 in OpenCV) controls the sensitivity: lower values yield more keypoints but include weaker corners.
- ORB's image pyramid uses 8 levels with scale factor 1.2 by default, covering a total scale range of about $1.2^8 \approx 4.3\times$.
- ORB-SLAM2 (Mur-Artal and Tardos, 2017) demonstrated ORB supporting full monocular, stereo, and RGB-D SLAM at 30 fps with comparable accuracy to systems using denser features.
- BRIEF and ORB descriptors degrade beyond about 30 degrees of in-plane rotation if orientation estimation fails; BRISK handles up to 45 degrees more reliably.

## Common Misconceptions

- **"Binary descriptors are less accurate than SIFT for all tasks."** On planar scenes and moderate viewpoint changes, ORB achieves matching precision within 5--10% of SIFT while being 100x faster. The accuracy gap widens mainly under extreme scale or illumination changes.
- **"ORB is just FAST + BRIEF."** ORB adds orientation estimation (intensity centroid), learned pair selection for rBRIEF, and pyramid-based scale handling -- significant engineering beyond naive concatenation.
- **"Hamming distance is an approximation of Euclidean distance."** Hamming distance is a proper metric on binary strings and is not an approximation; it measures exactly how many bits differ, which for independently sampled tests correlates with patch dissimilarity.

## Connections to Other Concepts

- `corner-detection.md`: ORB relies on FAST corners, which test a 16-pixel Bresenham circle -- a machine-learned acceleration of intensity comparison.
- `sift.md`: ORB was explicitly designed as a faster, patent-free replacement; understanding SIFT clarifies what invariances ORB preserves and which it trades away.
- `image-stitching-and-homography.md`: ORB features feed into RANSAC-based homography estimation for real-time stitching.
- `optical-flow.md`: Sparse tracking with binary features complements dense optical flow in hybrid motion estimation systems.

## Further Reading

- Rublee, E. et al., "ORB: An Efficient Alternative to SIFT or SURF" (2011) -- The original ORB paper from Willow Garage.
- Calonder, M. et al., "BRIEF: Binary Robust Independent Elementary Features" (2010) -- The foundational binary descriptor.
- Leutenegger, S. et al., "BRISK: Binary Robust Invariant Scalable Keypoints" (2011) -- Scale-continuous binary features.
- Mur-Artal, R. and Tardos, J.D., "ORB-SLAM2" (2017) -- State-of-the-art visual SLAM built entirely on ORB features.
