# Step 9: Docker Deployment

One-Line Summary: Containerize your vLLM server with Docker, configure GPU passthrough with the NVIDIA Container Toolkit, and orchestrate everything with docker-compose.

Prerequisites: Docker installed, NVIDIA GPU with drivers, vLLM serving working (Step 8)

---

## Why Docker

Running vLLM directly works, but Docker gives you:

- **Reproducible environments** — no "works on my machine" issues
- **Easy deployment** — ship the same container to any GPU server
- **Isolation** — CUDA versions, Python versions, and dependencies are locked
- **Orchestration** — restart policies, health checks, resource limits

## Install NVIDIA Container Toolkit

Docker needs the NVIDIA Container Toolkit to pass GPUs into containers:

```bash
# Add the NVIDIA container toolkit repository
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey \
  | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list \
  | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' \
  | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# Install the toolkit
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit

# Configure Docker to use the NVIDIA runtime
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

Verify GPU access inside Docker:

```bash
# Test that Docker can see your GPU
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi
```

You should see your GPU listed in the output.

## Create the Dockerfile

Create a `Dockerfile` for your vLLM server:

```dockerfile
# Dockerfile — Production vLLM server for Llama 3.1 8B
# Uses the official vLLM image with CUDA support
FROM vllm/vllm-openai:latest

# Set environment variables for optimal performance
ENV VLLM_WORKER_MULTIPROC_METHOD=spawn
ENV HF_HOME=/models

# Create a directory for cached model weights
RUN mkdir -p /models

# Expose the API port
EXPOSE 8000

# Health check — verify the server responds to model listing
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/v1/models || exit 1

# Start the vLLM server with production settings
ENTRYPOINT ["python", "-m", "vllm.entrypoints.openai.api_server"]

# Default arguments — can be overridden in docker-compose or docker run
CMD [ \
  "--model", "meta-llama/Llama-3.1-8B-Instruct", \
  "--host", "0.0.0.0", \
  "--port", "8000", \
  "--max-model-len", "8192", \
  "--dtype", "auto", \
  "--gpu-memory-utilization", "0.9" \
]
```

Build the image:

```bash
# Build the Docker image — this uses the pre-built vLLM base
docker build -t llm-server .
```

## Create docker-compose.yml

For easier management, use docker-compose:

```yaml
# docker-compose.yml — Production LLM serving stack
services:
  vllm:
    build: .
    container_name: llm-server
    ports:
      - "8000:8000"
    volumes:
      # Persist downloaded model weights across container restarts
      - model-cache:/models
    environment:
      - HF_TOKEN=${HF_TOKEN}  # Hugging Face token for gated models
      - VLLM_WORKER_MULTIPROC_METHOD=spawn
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1  # Number of GPUs to allocate
              capabilities: [gpu]
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/v1/models"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 120s  # Model loading takes time

volumes:
  model-cache:
    driver: local
```

## Create the Environment File

Store your Hugging Face token securely:

```bash
# Create .env file with your Hugging Face token
echo "HF_TOKEN=hf_your_token_here" > .env

# Make sure .env is in .gitignore
echo ".env" >> .gitignore
```

## Launch the Stack

```bash
# Start the LLM server in the background
docker compose up -d

# Watch the logs — model download and loading takes a few minutes
docker compose logs -f vllm
```

Wait until you see `Uvicorn running on http://0.0.0.0:8000` in the logs.

## Test the Containerized Server

```bash
# Verify the container is healthy
docker compose ps

# Test the API — same curl as before
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Llama-3.1-8B-Instruct",
    "messages": [{"role": "user", "content": "Hello from Docker!"}],
    "max_tokens": 50
  }'
```

## Production Checklist

Before deploying to a real environment, verify these settings:

```bash
# Check GPU memory usage inside the container
docker exec llm-server nvidia-smi

# Monitor container resource usage
docker stats llm-server
```

Key considerations for production:

| Setting | Recommendation |
|---------|---------------|
| **Restart policy** | `unless-stopped` — auto-restart on crashes |
| **Health check** | Start period of 120s+ to allow model loading |
| **Volume mount** | Persist model cache to avoid re-downloading |
| **API key** | Add `--api-key` flag for authentication |
| **Memory limit** | Set based on model size + overhead |
| **Logging** | Use `docker compose logs` or ship to a logging service |

## Common Operations

```bash
# Stop the server
docker compose down

# Restart after configuration changes
docker compose up -d --build

# View real-time logs
docker compose logs -f

# Shell into the container for debugging
docker exec -it llm-server bash
```

Your LLM is now containerized and production-ready. In the final step, we will look at where to go from here.

---

[← Previous: Step 8 - Serve with vLLM](08-serve-with-vllm.md) | [Next: Step 10 - What's Next →](10-whats-next.md)
