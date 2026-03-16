# Model Deployment and Serving

**One-Line Summary**: Batch vs. real-time inference, containerization, model registries, and the infrastructure of production ML.

**Prerequisites**: Model training basics, ML pipelines, REST APIs, basic distributed systems concepts.

## What Is Model Deployment and Serving?

Training a model is like writing a recipe. Deployment and serving is opening the restaurant. The recipe might be perfect, but the restaurant needs a kitchen (infrastructure), wait staff (APIs), quality control (monitoring), and the ability to handle a dinner rush (scaling). Most of the complexity in production ML is not in the model itself but in everything required to serve predictions reliably, quickly, and at scale.

Model deployment is the process of moving a trained model from a development environment into a production system where it makes predictions on new data. Model serving is the runtime infrastructure that executes inference requests.

## How It Works

### Inference Patterns

**Batch Inference**: Run the model on a large dataset on a schedule (hourly, daily, weekly). Predictions are stored in a database or data warehouse and served to users via lookup.

```
Schedule (cron) --> Load model --> Process dataset --> Write predictions to DB
```

Best for: Recommendations pre-computed overnight, risk scores updated daily, reports generated weekly. Advantages: simple infrastructure, efficient hardware utilization, tolerance for slow models. Disadvantage: predictions are stale between runs.

**Real-Time Inference**: The model runs on-demand for each request, typically behind a REST API or gRPC endpoint.

```
User request --> API gateway --> Model server --> Response (<100ms)
```

Best for: Search ranking, fraud detection at transaction time, chatbots, content moderation. Advantages: fresh predictions reflecting current context. Disadvantage: strict latency requirements, complex scaling, high availability demands.

**Streaming Inference**: The model processes events from a stream (Kafka, Kinesis) and emits predictions to another stream. A hybrid between batch and real-time: processes events individually (like real-time) but asynchronously (like batch).

Best for: Anomaly detection on sensor data, real-time feature enrichment, event-driven architectures.

### Containerization

**Docker**: Package the model, its dependencies, and the serving code into a self-contained container image. This eliminates "works on my machine" problems and ensures consistent behavior across environments.

```dockerfile
FROM python:3.10-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY model/ /app/model/
COPY serve.py /app/
CMD ["python", "/app/serve.py"]
```

**Kubernetes**: Orchestrate multiple model containers across a cluster. Kubernetes provides:
- **Horizontal autoscaling**: Automatically add or remove pods based on request volume or latency.
- **Health checks**: Restart containers that become unresponsive.
- **Rolling updates**: Deploy new model versions with zero downtime.
- **Resource limits**: Guarantee CPU/memory/GPU allocation per container.

### Model Formats

Models must be serialized into formats that serving infrastructure can load efficiently:

| Format | Ecosystem | Strengths |
|--------|-----------|-----------|
| **ONNX** | Cross-framework | Interoperability between PyTorch, TensorFlow, scikit-learn |
| **SavedModel** | TensorFlow | Native TF Serving support, includes computation graph |
| **TorchScript** | PyTorch | Serialized PyTorch models, supports C++ runtime |
| **PMML/PFA** | Traditional ML | XML/JSON-based, vendor-neutral for classical models |
| **Pickle** | Python/scikit-learn | Simple but fragile -- breaks across Python versions |

ONNX deserves special attention: it defines a standard computational graph format, enabling you to train in PyTorch and serve with TensorFlow, or optimize with TensorRT for NVIDIA GPUs.

### Edge Deployment

For latency-critical or offline scenarios, models run directly on user devices:

- **TensorFlow Lite (TFLite)**: Optimized runtime for mobile and embedded devices. Supports quantized models.
- **CoreML**: Apple's on-device inference framework for iOS/macOS.
- **ONNX Runtime Mobile**: Cross-platform edge inference.

Edge deployment requires aggressive model compression (see below) and careful testing across diverse hardware.

### Model Compression for Serving

Production latency and memory constraints often require smaller models:

- **Quantization**: Reduce weight precision from 32-bit float to 8-bit integer. Typically 2-4x speedup with minimal accuracy loss. Post-training quantization is simplest; quantization-aware training is more accurate.

$$w_{quantized} = \text{round}\!\left(\frac{w - w_{min}}{w_{max} - w_{min}} \cdot (2^b - 1)\right)$$

- **Pruning**: Remove near-zero weights. Structured pruning (removing entire neurons or filters) is more hardware-friendly than unstructured pruning.
- **Knowledge distillation**: Train a smaller "student" model to mimic a larger "teacher" model's predictions.

### Deployment Strategies

**Canary Deployment**: Route a small fraction (1-5%) of traffic to the new model. Monitor for errors or performance degradation before increasing traffic. Provides early warning with minimal blast radius.

**Blue-Green Deployment**: Maintain two identical environments. The "blue" environment runs the current model; the "green" runs the new model. Switch all traffic at once by updating the load balancer. Enables instant rollback by switching back.

**Shadow Deployment**: The new model receives production traffic and makes predictions, but those predictions are *not* served to users. Compare its outputs against the current model to validate correctness before live deployment.

$$\text{Risk spectrum: Shadow} < \text{Canary} < \text{Blue-Green} < \text{Direct replacement}$$

### Model Registries

A model registry (MLflow Model Registry, SageMaker Model Registry, Vertex AI Model Registry) serves as the bridge between experiment tracking and deployment:

- Stores versioned model artifacts with metadata.
- Manages lifecycle stages: Development, Staging, Production, Archived.
- Enforces approval workflows before production promotion.
- Provides a single source of truth for "what model is currently serving?"

## Why It Matters

The gap between a trained model and a production system is where most ML projects fail. Research by Gartner and others suggests that a significant majority of ML models never reach production. Deployment and serving infrastructure is the bridge that turns model accuracy into business value. Without it, ML is an expensive research exercise.

## Key Technical Details

- **Latency budgets**: Decompose end-to-end latency: network (~5ms), feature lookup (~10ms), model inference (~20ms), post-processing (~5ms). Optimize the largest contributor.
- **Batched inference in real-time serving**: Accumulate requests over a short window (e.g., 10ms) and process as a batch for GPU efficiency. Trades latency for throughput.
- **Model warmup**: Load the model and run a few dummy predictions before accepting traffic. Avoids cold-start latency spikes.
- **A/B traffic splitting**: Deployment infrastructure must support routing percentages of traffic to different model versions for A/B testing.
- **Graceful degradation**: When the model server is overloaded, fall back to a simpler model or cached predictions rather than failing entirely.

## Common Misconceptions

- **"Deploying a model means wrapping it in a Flask app."** A Flask prototype works for demos but lacks health checks, autoscaling, logging, monitoring, and graceful shutdown. Production serving requires purpose-built infrastructure.
- **"Batch and real-time are interchangeable."** They serve fundamentally different use cases. Batch is for precomputation; real-time is for context-dependent predictions. Choosing incorrectly leads to stale predictions or unacceptable latency.
- **"The fastest model is the best for production."** Latency matters, but so do accuracy, maintainability, and interpretability. A slightly slower model that is easier to debug may have lower total cost of ownership.

## Connections to Other Concepts

- `ml-pipelines.md`: Deployment is the final pipeline stage. CI/CD for ML automates the path from trained model to production serving.
- `ab-testing-for-ml.md`: Serving infrastructure must support traffic splitting to enable A/B tests comparing model versions.
- `data-drift-and-model-monitoring.md`: Monitoring hooks into the serving layer to track prediction distributions, latency, and error rates in real time.
- `experiment-tracking.md`: The model registry links deployed models back to the experiments that produced them, ensuring traceability.

## Further Reading

- Crankshaw et al., "Clipper: A Low-Latency Online Prediction Serving System" (2017) -- Foundational work on model serving systems with batching and caching.
- Olston et al., "TensorFlow-Serving: Flexible, High-Performance ML Serving" (2017) -- Google's production serving system design.
- Hermann and Del Balso, "Meet Michelangelo: Uber's Machine Learning Platform" (2017) -- End-to-end deployment platform design at scale.
