# Step 1: What We're Building

One-Line Summary: Deploy an open-source LLM locally with Ollama for development, then serve it as a production-ready API with vLLM — with benchmarking, quantization, and Docker deployment.

Prerequisites: A machine with at least 16 GB RAM (GPU recommended but not required for Ollama), basic command-line skills, Python 3.10+

---

## The Goal

By the end of this blueprint, you will have:

- **A local LLM running on your machine** via Ollama for fast experimentation
- **An OpenAI-compatible API** you can call from any language or framework
- **A production deployment** using vLLM with high-throughput serving
- **Benchmarking data** comparing quantization levels, tokens/sec, and latency
- **A Docker container** ready to deploy anywhere with GPU passthrough

You will be able to swap `https://api.openai.com` for `http://localhost:8000` in any existing OpenAI client code and it just works — no code changes, no vendor lock-in.

## Why Self-Host an LLM

| Reason | Details |
|--------|---------|
| **Privacy** | Data never leaves your infrastructure. No third-party logging. |
| **Cost** | No per-token billing. A single GPU pays for itself in weeks at high volume. |
| **Latency** | Local inference eliminates network round-trips. Sub-100ms first token. |
| **Control** | Choose your model, quantization, context length, and serving parameters. |
| **Availability** | No rate limits, no outages from upstream providers, no API deprecations. |

## The Model Landscape

We will use **Llama 3.1 8B** as our primary model. Here is how it fits among popular open-source options:

| Model | Parameters | Strengths | License |
|-------|-----------|-----------|---------|
| **Llama 3.1 8B** | 8B | Strong all-around, great instruction following | Llama 3.1 Community |
| Llama 3.1 70B | 70B | Near-GPT-4 quality, needs serious hardware | Llama 3.1 Community |
| Mistral 7B | 7B | Fast, efficient, strong for its size | Apache 2.0 |
| Qwen 2.5 7B | 7B | Excellent multilingual and coding | Apache 2.0 |
| Gemma 2 9B | 9B | Google's open model, strong reasoning | Gemma license |

We chose Llama 3.1 8B because it balances quality with resource needs — it runs on a laptop with 16 GB RAM (quantized) or a single consumer GPU.

## Hardware Requirements

**Minimum (Ollama, quantized models):**
- 16 GB RAM, no GPU required
- ~5 GB disk for the Q4 quantized model
- Any modern x86_64 or Apple Silicon CPU

**Recommended (vLLM, production serving):**
- NVIDIA GPU with 16+ GB VRAM (RTX 4090, A10, L4, A100)
- 32 GB system RAM
- ~16 GB disk for FP16 model weights

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                   Development                         │
│  ┌─────────┐    ┌─────────┐    ┌──────────────────┐  │
│  │ Terminal │───►│ Ollama  │───►│ Llama 3.1 8B     │  │
│  │ / Python │    │ Server  │    │ (Q4 quantized)   │  │
│  └─────────┘    └─────────┘    └──────────────────┘  │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                   Production                          │
│  ┌─────────┐    ┌─────────┐    ┌──────────────────┐  │
│  │ Any      │───►│  vLLM   │───►│ Llama 3.1 8B     │  │
│  │ OpenAI   │    │ Server  │    │ (FP16 on GPU)    │  │
│  │ Client   │    │ :8000   │    │ PagedAttention    │  │
│  └─────────┘    └─────────┘    └──────────────────┘  │
│                      │                                │
│                 ┌────┴────┐                           │
│                 │ Docker  │                           │
│                 │ + NVIDIA│                           │
│                 └─────────┘                           │
└──────────────────────────────────────────────────────┘
```

## What Each Step Covers

1. **This overview** — why, what, and how
2. **Install Ollama** — get your local runtime running
3. **Run your first model** — pull Llama 3.1 and start chatting
4. **Ollama API** — call your model from Python code
5. **Quantization** — understand quality vs. size tradeoffs
6. **Benchmarking** — measure performance with real numbers
7. **vLLM setup** — install the production inference engine
8. **Serve with vLLM** — launch an OpenAI-compatible API
9. **Docker deployment** — containerize with GPU passthrough
10. **What's next** — fine-tuning, LoRA, and beyond

Let's start by getting Ollama installed.

---

[Next: Step 2 - Install Ollama →](02-install-ollama.md)
