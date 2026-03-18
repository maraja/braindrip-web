# Step 7: vLLM Setup

One-Line Summary: Install vLLM — the high-performance inference engine that uses PagedAttention for efficient GPU memory management and serves models 2-4x faster than naive implementations.

Prerequisites: NVIDIA GPU with 16+ GB VRAM (A10, L4, RTX 4090, or A100), CUDA 12.1+, Python 3.10+

---

## Why vLLM for Production

Ollama is great for development, but production serving needs more:

| Feature | Ollama | vLLM |
|---------|--------|------|
| **Concurrent requests** | Sequential (queued) | Continuous batching |
| **Memory efficiency** | Standard | PagedAttention (2-4x better) |
| **Throughput** | Single user | Hundreds of concurrent users |
| **GPU utilization** | Moderate | Near-optimal |
| **API compatibility** | OpenAI-compatible | OpenAI-compatible |
| **Tensor parallelism** | No | Multi-GPU support |

vLLM was created at UC Berkeley and is the most widely used production LLM serving framework. Companies like Anyscale, Databricks, and many startups run it in production.

## How PagedAttention Works

The key innovation in vLLM is **PagedAttention** — it manages GPU memory for the KV cache the same way operating systems manage virtual memory with paging.

```
Traditional Serving:
┌──────────────────────────────────────────┐
│ GPU Memory                               │
│ ┌──────────┐ ┌──────────┐ ┌───────────┐ │
│ │ Request 1 │ │ Request 2 │ │  Wasted   │ │
│ │ KV Cache  │ │ KV Cache  │ │  Memory   │ │
│ │ (padded)  │ │ (padded)  │ │ (padding) │ │
│ └──────────┘ └──────────┘ └───────────┘ │
└──────────────────────────────────────────┘

vLLM with PagedAttention:
┌──────────────────────────────────────────┐
│ GPU Memory — KV Cache Pages              │
│ ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐    │
│ │R1 ││R2 ││R1 ││R3 ││R2 ││R1 ││R3 │    │
│ │pg1││pg1││pg2││pg1││pg2││pg3││pg2│    │
│ └───┘└───┘└───┘└───┘└───┘└───┘└───┘    │
│ No wasted memory — pages allocated       │
│ on demand, freed immediately             │
└──────────────────────────────────────────┘
```

The result: vLLM can serve **2-4x more concurrent requests** with the same GPU by eliminating memory waste from pre-allocated, padded KV caches.

## Check Your GPU

Before installing vLLM, verify your GPU setup:

```bash
# Check NVIDIA driver and CUDA version
nvidia-smi

# Verify CUDA toolkit version (need 12.1+)
nvcc --version

# Check available GPU memory — need 16+ GB for Llama 3.1 8B at FP16
nvidia-smi --query-gpu=name,memory.total,memory.free --format=csv
```

Expected output:

```
name, memory.total [MiB], memory.free [MiB]
NVIDIA A10, 24576 MiB, 24200 MiB
```

## Install vLLM

Install vLLM in a fresh virtual environment:

```bash
# Create a dedicated environment for vLLM
python3 -m venv vllm-env
source vllm-env/bin/activate

# Install vLLM — this pulls PyTorch and CUDA dependencies (~5 GB)
pip install vllm
```

The installation takes several minutes as it downloads PyTorch with CUDA support and compiles custom kernels.

Verify the installation:

```bash
# Verify vLLM is installed and can see your GPU
python -c "import vllm; print(f'vLLM version: {vllm.__version__}')"

# Check that PyTorch can see the GPU
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}'); print(f'GPU: {torch.cuda.get_device_name(0)}')"
```

## Download the Model

vLLM downloads models from Hugging Face. For Llama 3.1 8B, you need to accept the license agreement first:

```bash
# Install the Hugging Face CLI
pip install huggingface-hub

# Log in to Hugging Face (needed for gated models like Llama)
huggingface-cli login
```

Go to [meta-llama/Llama-3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) on Hugging Face, accept the license, then the download will work when vLLM requests it.

Alternatively, you can pre-download the model:

```bash
# Pre-download the model weights (~16 GB for FP16)
huggingface-cli download meta-llama/Llama-3.1-8B-Instruct
```

## Quick Smoke Test

Verify vLLM can load and run the model:

```python
# smoke_test.py — Verify vLLM can load the model and generate text
from vllm import LLM, SamplingParams

# Load the model — this takes 30-60 seconds on first run
llm = LLM(model="meta-llama/Llama-3.1-8B-Instruct")

# Set generation parameters
sampling_params = SamplingParams(temperature=0.7, max_tokens=100)

# Run a single inference
outputs = llm.generate(["What is the capital of Japan?"], sampling_params)

# Print the generated text
for output in outputs:
    print(output.outputs[0].text)
```

```bash
# Run the smoke test
python smoke_test.py
```

If you see a generated response, vLLM is working correctly. In the next step, we will launch it as a production API server.

---

[← Previous: Step 6 - Benchmark Models](06-benchmark-models.md) | [Next: Step 8 - Serve with vLLM →](08-serve-with-vllm.md)
