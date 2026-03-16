# Edge Deployment

**One-Line Summary**: Edge deployment runs computer vision models on mobile phones, embedded devices, and microcontrollers by applying quantization, pruning, and compiler optimizations to meet strict latency and power budgets.

**Prerequisites**: Convolutional Neural Networks, Model Architecture Design, Transfer Learning, Batch Normalization

## What Is Edge Deployment?

Imagine a security camera that needs to detect intruders in under 50 milliseconds, runs on a 5-watt chip, and has no internet connection. Cloud inference is not an option -- the model must run on the device itself. Edge deployment is the discipline of compressing and optimizing vision models to run efficiently on resource-constrained hardware: smartphones (4--8 TOPS), embedded GPUs (NVIDIA Jetson, 20--275 TOPS), dedicated NPUs (Google Edge TPU, 4 TOPS), and even microcontrollers (256 KB RAM).

Technically, edge deployment encompasses model compression (quantization, pruning, distillation), hardware-aware architecture design (MobileNets, EfficientNets), inference runtime optimization (TensorRT, ONNX Runtime, TFLite), and the engineering of meeting real-time latency, memory, and power constraints.

## How It Works

### Quantization

Quantization reduces the precision of weights and activations from 32-bit floating point (FP32) to lower bit-widths.

**INT8 Quantization**: The most common production format. Maps FP32 values to 8-bit integers using a scale factor $s$ and zero point $z$:

$$x_{int8} = \text{round}\left(\frac{x_{fp32}}{s}\right) + z$$

Two approaches:
- **Post-Training Quantization (PTQ)**: Calibrate scale factors using a small representative dataset (100--1,000 samples). No retraining needed. Typical accuracy loss: 0.5--1.0% on ImageNet.
- **Quantization-Aware Training (QAT)**: Simulate quantization during training using straight-through estimators for gradients. Recovers most accuracy; typical loss: <0.3%.

**INT4 Quantization**: Aggressive 4-bit quantization. Weights only (activations remain INT8) works reasonably; fully INT4 requires careful QAT. Accuracy loss of 1--3% is common. Used in NVIDIA's W4A8 configurations.

**Binary / Ternary**: Extreme 1-bit or 2-bit weights. Accuracy drops significantly (5--15% on ImageNet) but enables pure bitwise operations.

| Precision | Model Size (ResNet-50) | Typical Accuracy Loss | Speedup vs FP32 |
|-----------|----------------------|----------------------|------------------|
| FP32 | 97 MB | -- | 1x |
| FP16 | 49 MB | ~0.1% | 2x |
| INT8 | 25 MB | 0.5--1.0% | 3--4x |
| INT4 | 13 MB | 1--3% | 4--8x |

### Pruning

Pruning removes redundant weights or entire structures (channels, layers) from a model.

**Unstructured Pruning**: Zero out individual weights based on magnitude. Achieves 80--90% sparsity with <1% accuracy loss. Requires sparse matrix libraries for actual speedup; without hardware support, wall-clock time may not improve.

**Structured Pruning**: Remove entire filters or channels. A ResNet-50 pruned to 50% of channels yields ~2x speedup with ~1% accuracy loss. No special hardware required -- the resulting model is simply smaller.

**Pruning workflow**: Train to convergence, prune (by magnitude or learned importance), fine-tune for 10--20 epochs, repeat iteratively.

### Knowledge Distillation

Train a small "student" model to mimic a large "teacher" model's outputs:

$$L = \alpha \cdot L_{CE}(y, \sigma(z_s)) + (1 - \alpha) \cdot T^2 \cdot KL(\sigma(z_t/T), \sigma(z_s/T))$$

where $T$ is the temperature (typically 3--20), $z_s$ and $z_t$ are student and teacher logits, and $\alpha$ balances hard labels with soft targets. Distillation consistently improves student accuracy by 1--3% over training from scratch.

### Hardware-Aware Architecture Design

- **MobileNetV3** (Howard et al., 2019): Combines depthwise separable convolutions, squeeze-and-excite blocks, and NAS-searched architecture. MobileNetV3-Large achieves 75.2% ImageNet top-1 at 219M MAdds and 5.4 ms latency on a Pixel 4.
- **EfficientNet-Lite**: EfficientNet adapted for mobile by removing squeeze-and-excite (poorly supported on some NPUs) and using fixed input resolution.

### Inference Runtimes and Compilers

- **TensorRT** (NVIDIA): Optimizes models for NVIDIA GPUs. Applies layer fusion, kernel auto-tuning, and precision calibration. Achieves 2--5x speedup over vanilla PyTorch.
- **ONNX Runtime**: Cross-platform inference engine. Supports CPU, GPU, and NPU backends. The ONNX format is the standard interchange format between frameworks.
- **TFLite**: Google's runtime for mobile and embedded. Supports INT8 quantization, GPU delegate, and NNAPI (Android neural network API).
- **Core ML**: Apple's framework for iOS/macOS. Leverages the Neural Engine (15.8 TOPS on A16 chip).
- **Apache TVM**: Compiler-based optimization that generates hardware-specific kernels through auto-tuning.

### Latency Budgets

Real-time applications impose strict latency constraints:
- **Smartphone AR**: <33 ms per frame (30 FPS)
- **Autonomous driving**: <50 ms (20 Hz perception loop)
- **Industrial inspection**: <16 ms (60 FPS conveyor belt)
- **Security camera**: <100 ms (acceptable for alert systems)

## Why It Matters

1. Over 6.8 billion smartphones exist worldwide; edge deployment brings vision AI to every pocket without cloud dependency.
2. Privacy-sensitive applications (medical, surveillance) benefit from on-device inference where data never leaves the device.
3. Latency: A cloud round-trip adds 50--200 ms; edge inference eliminates this, enabling real-time interaction.
4. Cost: At scale, cloud inference costs dominate; a one-time hardware cost for edge inference is often more economical for high-throughput applications.

## Key Technical Details

- NVIDIA Jetson Orin delivers 275 TOPS (INT8) at 60W; Jetson Orin Nano delivers 40 TOPS at 15W.
- Google Edge TPU: 4 TOPS at 2W. Runs MobileNetV2 at 400 FPS for classification.
- Apple Neural Engine (M2): 15.8 TOPS. Core ML handles automatic FP16 inference.
- INT8 quantization of YOLOv8-S on TensorRT achieves 1.2 ms inference on an RTX 4090 (~830 FPS); on Jetson Orin, ~8 ms (~125 FPS).
- MobileNetV3-Small: 2.9M parameters, 66M MAdds, 67.4% ImageNet top-1. Runs at ~3 ms on a Pixel 4.

## Common Misconceptions

- **"Quantization always causes significant accuracy loss."** INT8 PTQ loses only 0.5--1.0% on most classification and detection models. With QAT, the loss is often negligible (<0.3%).
- **"FLOPs directly predict latency."** Memory bandwidth, data movement, and operator support matter as much as arithmetic operations. A model with fewer FLOPs can be slower if it uses operators poorly supported by the hardware.
- **"You need a GPU for real-time inference."** Modern NPUs (Edge TPU, Apple Neural Engine) and even optimized CPU inference (with ONNX Runtime or TFLite) can achieve real-time performance for many vision tasks.

## Connections to Other Concepts

- `image-classification-in-practice.md`: Efficient models (MobileNet, EfficientNet) are designed for edge classification.
- `3d-object-detection.md`: YOLO and SSD families are optimized for edge deployment with INT8 quantization.
- `autonomous-driving-perception.md`: In-vehicle inference runs on edge hardware (NVIDIA Orin, Tesla FSD chip).
- `anomaly-detection.md`: Factory-floor deployment often runs on embedded devices without cloud access.

## Further Reading

- Jacob et al., "Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference" (2018) -- Google's INT8 quantization framework used in TFLite.
- Howard et al., "Searching for MobileNetV3" (2019) -- NAS-designed efficient architecture for mobile.
- Hinton et al., "Distilling the Knowledge in a Neural Network" (2015) -- Foundational knowledge distillation paper.
- NVIDIA, "TensorRT Developer Guide" (2024) -- Reference for GPU inference optimization.
