# Neural Architecture Search

**One-Line Summary**: Neural Architecture Search (NAS) automates the design of neural network architectures by searching over a defined space of possible configurations, optimizing for accuracy, latency, or other objectives.

**Prerequisites**: Convolutional neural networks, reinforcement learning basics, gradient descent, depthwise separable convolutions, MobileNet

## What Is Neural Architecture Search?

Imagine you are an architect designing a building. You know the materials available (types of layers), the constraints (budget, building codes), and the goal (maximize usable space). Traditionally, expert architects draw on years of experience to make design choices. NAS replaces the human architect with an automated search algorithm that explores thousands or millions of possible designs and selects the best one based on measured performance. The human still defines the building codes (search space) and the evaluation criteria, but the search itself is automated.

Neural Architecture Search was popularized by Zoph and Le (2017) at Google Brain, who used a recurrent neural network controller trained with reinforcement learning to generate CNN architectures. The approach discovered architectures that matched or exceeded human-designed networks, but at extraordinary computational cost -- 800 GPUs for 28 days. Since then, the field has evolved dramatically toward efficient search methods that require orders of magnitude less computation.

## How It Works

### The Three Components of NAS

Every NAS method defines three things:

1. **Search space**: The set of possible architectures. This includes the types of operations (convolutions, pooling, skip connections), how they can be connected, and any structural constraints.
2. **Search strategy**: The algorithm that explores the search space -- reinforcement learning, evolutionary algorithms, gradient-based methods, or Bayesian optimization.
3. **Performance estimation**: How candidate architectures are evaluated -- full training, weight sharing, proxy tasks, or performance predictors.

### Search Space Design

**Cell-based search** (NASNet, DARTS): Instead of searching for the entire network, search for a small repeatable cell that is stacked to form the full architecture. A cell typically has $N$ nodes, where each node chooses an operation from a predefined set and two input connections. Two types of cells are searched:

- **Normal cell**: Preserves spatial dimensions.
- **Reduction cell**: Reduces spatial dimensions by a factor of 2.

The operation set commonly includes: $3 \times 3$ and $5 \times 5$ separable convolutions, $3 \times 3$ and $5 \times 5$ dilated separable convolutions, $3 \times 3$ max pooling, $3 \times 3$ average pooling, identity (skip connection), and zero (no connection).

**Macro search** searches for the entire network topology, including the number of layers and connections. This is more flexible but much more expensive.

### Search Strategies

**Reinforcement Learning (RL)**:
The original NAS (Zoph & Le, 2017) used an RNN controller that samples architecture descriptions as sequences of tokens. The controller is trained with REINFORCE to maximize the expected validation accuracy:

$$\nabla_\theta J(\theta) = \frac{1}{m} \sum_{k=1}^{m} \sum_{t=1}^{T} \nabla_\theta \log P(a_t | a_{1:t-1}; \theta) (R_k - b)$$

where $R_k$ is the validation accuracy of the $k$-th sampled architecture and $b$ is a baseline. This required training ~12,800 candidate architectures.

**Evolutionary Algorithms**:
AmoebaNet (Real et al., 2019) used regularized evolution: maintain a population of architectures, repeatedly sample a subset, mutate the best one (change an operation or connection), train the mutant, and remove the oldest member. This matched RL performance with simpler implementation.

**Gradient-Based Search (DARTS)**:
Liu et al. (2019) made the search space continuous by relaxing the discrete choice of operations to a softmax-weighted mixture:

$$\bar{o}(x) = \sum_{o \in \mathcal{O}} \frac{\exp(\alpha_o)}{\sum_{o'} \exp(\alpha_{o'})} o(x)$$

where $\alpha_o$ are architecture parameters optimized alongside network weights via gradient descent. This reduces search cost from thousands of GPU-days to a single GPU-day. After search, the operation with the highest $\alpha$ at each edge is selected.

**One-Shot Methods**:
Train a single "supernet" that contains all possible architectures as sub-networks with shared weights. After training, evaluate sub-networks by inheriting weights from the supernet without retraining. This includes methods like single-path NAS (Guo et al., 2020) and BigNAS.

### Key NAS Architectures

**NASNet** (Zoph et al., 2018):
- Cell-based search on CIFAR-10, transferred to ImageNet.
- NASNet-A: 88.9M params, 23.8B FLOPs, 82.7% top-1 on ImageNet.
- Search cost: 500 GPUs for 4 days (~2,000 GPU-days).

**MnasNet** (Tan et al., 2019):
- Platform-aware search: optimized for real latency on a Pixel phone, not proxy FLOPs.
- Multi-objective reward: $\text{ACC}(m) \times [\text{LAT}(m) / T]^w$, where $T$ is target latency and $w = -0.07$.
- MnasNet-A1: 3.9M params, 312M FLOPs, 75.2% top-1.
- Search cost: ~40,000 architectures evaluated, each for 5 epochs.

**DARTS** (Liu et al., 2019):
- Gradient-based search on CIFAR-10.
- Search cost: 1.5 GPU-days (4 orders of magnitude cheaper than original NAS).
- DARTS cells transferred to ImageNet: 4.7M params, 574M FLOPs, 73.3% top-1.
- Known stability issues: the search can collapse to skip-connection-heavy architectures. Various fixes have been proposed (DARTS+, FairDARTS, RobustDARTS).

### Hardware-Aware NAS

Modern NAS increasingly incorporates hardware constraints directly into the search:

- **Latency-aware reward** (MnasNet): Measures real inference time on target hardware.
- **Multi-hardware search** (Once-for-All, OFA): Trains a single supernet that supports different sub-networks for different hardware targets. OFA can deploy optimized models to diverse hardware without retraining, covering 190 deployment scenarios.
- **Latency lookup tables** approximate hardware latency as a sum of per-layer costs, avoiding expensive on-device measurement during search.

## Why It Matters

1. **Surpassed human-designed architectures.** NAS-discovered cells (NASNet, EfficientNet-B0) outperform manually designed ones on ImageNet accuracy-efficiency Pareto frontiers.
2. **Reduced architecture engineering time.** Instead of months of expert experimentation, NAS can discover competitive architectures in hours to days.
3. **Hardware-specific optimization.** NAS can discover different architectures for different hardware targets (mobile CPU, GPU, TPU, FPGA), optimizing for real-world latency rather than theoretical FLOPs.
4. **Foundation for scalable design.** EfficientNet's B0, discovered by NAS, became the basis for an entire family of models via compound scaling, demonstrating that NAS and manual insights are complementary.

## Key Technical Details

- **Original NAS cost**: 12,800 architectures, each trained for 50 epochs on CIFAR-10, using 800 GPUs for 28 days (~22,400 GPU-days).
- **DARTS cost**: 1.5 GPU-days on a single GPU -- a ~15,000x reduction from original NAS.
- **One-shot methods** reduce search to ~8 GPU-hours for CIFAR-10 in some implementations.
- **Search space size**: A typical DARTS cell search space with 14 edges and 8 operations per edge has $8^{14} \approx 4.4 \times 10^{12}$ possible architectures.
- **The search-evaluation gap**: Architectures that perform well during search (with shared weights or short training) may not perform well when fully trained. This is a known limitation, especially for one-shot methods.
- **Reproducibility concerns**: DARTS results are sensitive to random seeds and hyperparameters. Successive papers reported high variance in found architectures.
- **Carbon footprint**: The original NAS consumed approximately the lifetime CO2 equivalent of 5 average cars. Efficient methods have reduced this by 3-4 orders of magnitude.

## Common Misconceptions

- **"NAS always finds better architectures than humans."** NAS finds good architectures within the defined search space. If the search space is poorly designed, NAS will find the best of a mediocre set. The search space design still requires expert knowledge.
- **"NAS is too expensive to be practical."** While the original NAS was prohibitively expensive, modern methods (DARTS, one-shot NAS) can run on a single GPU in hours. The field has matured well past the "800 GPUs for 28 days" era.
- **"NAS eliminates the need for architecture expertise."** Defining the search space, setting constraints, choosing the search strategy, and interpreting results all require significant expertise. NAS automates architecture selection, not architecture understanding.
- **"Architectures found by NAS are interpretable."** NAS-discovered cells often appear irregular and difficult to explain intuitively. This lack of interpretability can make debugging and modification challenging compared to clean, human-designed architectures.

## Connections to Other Concepts

- `mobilenet.md`: MobileNetV3 used NAS to discover its block configuration. MnasNet, the NAS method used for EfficientNet-B0, builds on the MobileNet design space.
- `efficientnet.md`: The B0 baseline was discovered by NAS; compound scaling then produced B1-B7 without additional search.
- `depthwise-separable-convolutions.md`: A common operation in NAS search spaces, as they provide good accuracy-efficiency tradeoffs.
- `inception.md`: Inception's multi-branch cells inspired NASNet's cell-based search space.

## Further Reading

- Zoph & Le, "Neural Architecture Search with Reinforcement Learning" (2017) -- The original NAS paper using RL-based search.
- Liu et al., "DARTS: Differentiable Architecture Search" (2019) -- Gradient-based NAS reducing search cost by 4 orders of magnitude.
- Tan et al., "MnasNet: Platform-Aware Neural Architecture Search for Mobile" (2019) -- Hardware-aware NAS that discovered the EfficientNet-B0 backbone.
- Elsken et al., "Neural Architecture Search: A Survey" (2019) -- Comprehensive survey covering search spaces, strategies, and evaluation methods.
