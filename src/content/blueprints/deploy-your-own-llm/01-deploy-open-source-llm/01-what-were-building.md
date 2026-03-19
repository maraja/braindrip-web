# Step 1: What We're Building

One-Line Summary: Deploy an open-source LLM locally with Ollama — pull a model, run it, call it from Python, benchmark it, and customize it with Modelfiles.

Prerequisites: A machine with at least 16 GB RAM (GPU recommended but not required), basic command-line skills, Python 3.10+

---

## The Goal

By the end of this blueprint, you will have:

- **A local LLM running on your machine** via Ollama
- **An OpenAI-compatible API** you can call from any language or framework
- **An understanding of quantization** and how to choose the right quality/size tradeoff
- **Benchmarking data** with real performance numbers for your hardware
- **A custom model** tailored with your own system prompt and parameters

You will be able to swap `https://api.openai.com` for `http://localhost:11434` in any existing OpenAI client code and it just works — no code changes, no vendor lock-in.

## Why Self-Host an LLM

| Reason | Details |
|--------|---------|
| **Privacy** | Data never leaves your machine. No third-party logging. |
| **Cost** | No per-token billing. Free after the initial hardware investment. |
| **Latency** | Local inference eliminates network round-trips. Sub-100ms first token. |
| **Control** | Choose your model, quantization, context length, and parameters. |
| **Availability** | No rate limits, no outages, no API deprecations. |

## Why Ollama

Ollama is "Docker for LLMs." One install, one command to pull a model, one command to run it. It handles:

- **Model downloads** — pull models by name like `ollama pull llama3.1:8b`
- **Quantization** — automatically serves optimized quantized versions
- **API server** — built-in OpenAI-compatible REST API
- **GPU acceleration** — detects and uses your GPU automatically
- **Modelfiles** — customize models with system prompts and parameters

No Python environments to manage, no CUDA toolkit to install, no Docker containers to orchestrate.

## The Model Landscape

We will use **Llama 3.1 8B** as our primary model:

| Model | Parameters | Strengths | License |
|-------|-----------|-----------|---------|
| **Llama 3.1 8B** | 8B | Strong all-around, great instruction following | Llama 3.1 Community |
| Mistral 7B | 7B | Fast, efficient, strong for its size | Apache 2.0 |
| Qwen 2.5 7B | 7B | Excellent multilingual and coding | Apache 2.0 |
| Gemma 2 9B | 9B | Google's open model, strong reasoning | Gemma license |

We chose Llama 3.1 8B because it balances quality with resource needs — it runs on a laptop with 16 GB RAM.

## Hardware Requirements

- **16 GB RAM** — minimum for quantized 8B models
- **~5 GB disk** — for the Q4 quantized model
- **Any modern CPU** — x86_64 or Apple Silicon
- **GPU (optional)** — NVIDIA or Apple Silicon GPU speeds up inference significantly but is not required

## Architecture

```
┌──────────────────────────────────────────────────────┐
│  ┌─────────┐    ┌─────────┐    ┌──────────────────┐  │
│  │ Terminal │───►│ Ollama  │───►│ Llama 3.1 8B     │  │
│  │ / Python │    │ Server  │    │ (Q4 quantized)   │  │
│  │ / Any    │    │ :11434  │    │                  │  │
│  │ OpenAI   │    │         │    │ Runs on CPU      │  │
│  │ client   │    │ REST API│    │ or GPU           │  │
│  └─────────┘    └─────────┘    └──────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## What Each Step Covers

1. **This overview** — why, what, and how
2. **Install Ollama** — get your local runtime running
3. **Run your first model** — pull Llama 3.1 and start chatting
4. **Ollama API** — call your model from Python code
5. **Quantization** — understand quality vs. size tradeoffs
6. **Benchmarking** — measure performance with real numbers
7. **Customize with Modelfiles** — create tailored models with custom system prompts
8. **What's next** — production serving, fine-tuning, and beyond

Let's start by getting Ollama installed.

---

[Next: Step 2 - Install Ollama →](02-install-ollama.md)
