# Step 2: Install Ollama

One-Line Summary: Install Ollama on your machine and verify it is running — the simplest way to run open-source LLMs locally.

Prerequisites: macOS, Linux, or Windows (WSL2), terminal access, ~10 GB free disk space

---

## What Is Ollama

Ollama is an open-source tool that packages LLM weights, configuration, and a runtime into a single, easy-to-use system. Think of it as "Docker for LLMs" — you pull models by name and run them with a single command.

Under the hood, Ollama uses `llama.cpp` for inference, which means:

- **CPU inference works out of the box** — no GPU required
- **Automatic quantization support** — run large models on limited hardware
- **Apple Silicon acceleration** — uses Metal on M1/M2/M3/M4 Macs
- **NVIDIA GPU acceleration** — uses CUDA when available

## Install on macOS

Download and install from the official site:

```bash
# Download the macOS installer
# Visit https://ollama.com/download and install the app

# Or install via Homebrew
brew install ollama
```

## Install on Linux

The install script handles everything automatically:

```bash
# One-line install script — downloads and configures Ollama
curl -fsSL https://ollama.com/install.sh | sh
```

This installs the `ollama` binary and sets up a systemd service. On Linux, Ollama will automatically detect and use NVIDIA GPUs if the CUDA drivers are installed.

## Install on Windows

Ollama runs natively on Windows or inside WSL2:

```bash
# Option 1: Download the Windows installer from https://ollama.com/download

# Option 2: Inside WSL2, use the Linux install script
curl -fsSL https://ollama.com/install.sh | sh
```

## Verify the Installation

After installing, confirm Ollama is working:

```bash
# Check the installed version
ollama --version
```

You should see output like `ollama version 0.4.x` or newer.

## Start the Ollama Server

On macOS, the Ollama app starts the server automatically. On Linux, the systemd service handles it. You can also start it manually:

```bash
# Start the Ollama server in the foreground
ollama serve
```

In a separate terminal, verify the server is responding:

```bash
# Check that the API is reachable — should return "Ollama is running"
curl http://localhost:11434
```

You should see the response:

```
Ollama is running
```

## Understand the Ollama Architecture

When you run Ollama, here is what happens:

```
┌──────────────┐     HTTP API      ┌──────────────────┐
│  ollama CLI  │───────────────────►│  Ollama Server   │
│  or curl     │   localhost:11434  │                  │
└──────────────┘                    │  ┌────────────┐  │
                                    │  │ llama.cpp  │  │
                                    │  │ runtime    │  │
                                    │  └─────┬──────┘  │
                                    │        │         │
                                    │  ┌─────▼──────┐  │
                                    │  │ Model files │  │
                                    │  │ ~/.ollama/  │  │
                                    │  └────────────┘  │
                                    └──────────────────┘
```

Key details:

- **Model storage**: Models are stored in `~/.ollama/models/` on macOS/Linux
- **Port**: The server listens on port `11434` by default
- **API**: Ollama exposes a REST API that is compatible with the OpenAI chat completions format
- **Concurrency**: Ollama handles one inference request at a time by default, queuing additional requests

## Check GPU Detection

If you have an NVIDIA GPU, verify Ollama can see it:

```bash
# Check if NVIDIA drivers are installed
nvidia-smi

# Ollama will log GPU detection when starting — check the logs
# On Linux with systemd:
journalctl -u ollama --no-pager | head -20
```

If you see your GPU listed, Ollama will automatically offload model layers to it for faster inference. If not, CPU inference still works — just slower.

You now have Ollama installed and running. In the next step, we will pull our first model and start chatting with it.

---

[← Previous: Step 1 - What We're Building](01-what-were-building.md) | [Next: Step 3 - Run Your First Model →](03-run-your-first-model.md)
