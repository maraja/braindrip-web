# Step 8: Serve with vLLM

One-Line Summary: Launch Llama 3.1 8B as an OpenAI-compatible API server using vLLM, then test it with curl and Python — the same client code works as with Ollama and OpenAI.

Prerequisites: vLLM installed with GPU access (Step 7), model downloaded from Hugging Face

---

## Launch the vLLM Server

vLLM includes a built-in OpenAI-compatible API server. Start it with a single command:

```bash
# Start the vLLM server with Llama 3.1 8B Instruct
# --host 0.0.0.0 makes it accessible from other machines
# --port 8000 is the default OpenAI API port
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --host 0.0.0.0 \
    --port 8000 \
    --max-model-len 8192 \
    --dtype auto
```

The server will log its startup progress:

```
INFO:     Loading model meta-llama/Llama-3.1-8B-Instruct...
INFO:     Model loaded in 28.4 seconds
INFO:     Using PagedAttention with 16384 KV cache blocks
INFO:     Started server process [12345]
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Key flags explained:

| Flag | Purpose |
|------|---------|
| `--model` | Hugging Face model ID or local path |
| `--max-model-len` | Maximum context length (reduce to save VRAM) |
| `--dtype auto` | Automatically use FP16 or BF16 based on GPU |
| `--gpu-memory-utilization 0.9` | Use 90% of GPU memory (default) |
| `--tensor-parallel-size 2` | Split model across 2 GPUs |

## Test with curl

In a new terminal, verify the server is responding:

```bash
# Check that the server is running and list available models
curl http://localhost:8000/v1/models | python -m json.tool
```

Expected response:

```json
{
  "data": [
    {
      "id": "meta-llama/Llama-3.1-8B-Instruct",
      "object": "model",
      "owned_by": "vllm"
    }
  ]
}
```

Now send a chat completion request:

```bash
# Send a chat completion request — identical format to OpenAI
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Llama-3.1-8B-Instruct",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain containerization in two sentences."}
    ],
    "temperature": 0.7,
    "max_tokens": 150
  }'
```

## Use from Python

The same OpenAI client code from Step 4 works — just change the base URL and model name:

```python
# vllm_client.py — Call the vLLM server using the OpenAI client
from openai import OpenAI

# Point to the vLLM server instead of Ollama
client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-needed",  # vLLM does not require an API key by default
)

# Chat completion — identical API to OpenAI and Ollama
response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[
        {"role": "system", "content": "You are a senior backend engineer."},
        {"role": "user", "content": "What are the tradeoffs between REST and gRPC?"},
    ],
    temperature=0.7,
    max_tokens=400,
)

print(response.choices[0].message.content)
print(f"\nUsage: {response.usage.prompt_tokens} prompt + "
      f"{response.usage.completion_tokens} completion = "
      f"{response.usage.total_tokens} total tokens")
```

## Streaming with vLLM

Streaming works identically to the OpenAI API:

```python
# vllm_stream.py — Stream responses from the vLLM server
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-needed",
)

# Stream tokens as they are generated
stream = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[
        {"role": "user", "content": "Write a haiku about GPU computing."},
    ],
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()
```

## Benchmark vLLM vs Ollama

Run the same benchmark script from Step 6 against vLLM to compare:

```python
# benchmark_vllm.py — Compare vLLM throughput against Ollama
import time
from openai import OpenAI

# Test the same prompt against both servers
prompt = [
    {"role": "user", "content": "Explain how a hash table works in 200 words."}
]

servers = {
    "Ollama": {
        "base_url": "http://localhost:11434/v1",
        "model": "llama3.1:8b",
    },
    "vLLM": {
        "base_url": "http://localhost:8000/v1",
        "model": "meta-llama/Llama-3.1-8B-Instruct",
    },
}

for name, config in servers.items():
    client = OpenAI(base_url=config["base_url"], api_key="test")

    # Measure streaming performance
    start = time.perf_counter()
    first_token = None
    tokens = 0

    stream = client.chat.completions.create(
        model=config["model"],
        messages=prompt,
        max_tokens=250,
        stream=True,
    )

    for chunk in stream:
        if chunk.choices[0].delta.content:
            if first_token is None:
                first_token = time.perf_counter()
            tokens += 1

    elapsed = time.perf_counter() - start
    gen_time = time.perf_counter() - first_token if first_token else elapsed
    tps = tokens / gen_time if gen_time > 0 else 0

    print(f"{name}: {tps:.1f} tok/s, TTFT={first_token - start:.3f}s, "
          f"Total={elapsed:.3f}s, Tokens={tokens}")
```

On the same GPU, vLLM will typically show **1.5-3x higher throughput** than Ollama, especially under concurrent load, thanks to continuous batching and PagedAttention.

## Add an API Key

For production, protect your endpoint with an API key:

```bash
# Start vLLM with API key authentication
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --host 0.0.0.0 \
    --port 8000 \
    --api-key your-secret-key-here
```

Then include the key in your client:

```python
client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="your-secret-key-here",
)
```

Your LLM is now running as a production API. In the next step, we will containerize everything with Docker.

---

[← Previous: Step 7 - vLLM Setup](07-vllm-setup.md) | [Next: Step 9 - Docker Deployment →](09-docker-deployment.md)
