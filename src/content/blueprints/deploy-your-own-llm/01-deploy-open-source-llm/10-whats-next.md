# Step 10: What's Next

One-Line Summary: Explore fine-tuning with LoRA, model routing for cost optimization, and a cost comparison showing when self-hosting beats API providers.

Prerequisites: Completed Steps 1-9 with a working Docker deployment of your LLM

---

## What You Have Built

Over the last nine steps, you went from zero to a production-ready LLM deployment:

- **Local development** with Ollama for fast iteration
- **OpenAI-compatible API** that works with any existing client code
- **Quantization knowledge** to balance quality against resource constraints
- **Benchmarking data** specific to your hardware
- **Production serving** with vLLM and PagedAttention
- **Docker deployment** with GPU passthrough and health checks

This is a solid foundation. Here is where to go next.

## Fine-Tuning with LoRA

Instead of training all 8 billion parameters, **LoRA (Low-Rank Adaptation)** trains a small set of adapter weights that modify the base model's behavior. This is how you customize a model for your specific use case.

```python
# Example: Fine-tuning Llama 3.1 8B with LoRA using the PEFT library
# This is a conceptual overview — full training requires a dataset and GPU time

# pip install peft transformers datasets trl
from peft import LoraConfig
from transformers import AutoModelForCausalLM, AutoTokenizer
from trl import SFTTrainer, SFTConfig

# Load the base model
model_name = "meta-llama/Llama-3.1-8B-Instruct"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto",
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Configure LoRA — only trains ~0.1% of total parameters
lora_config = LoraConfig(
    r=16,                # Rank — higher = more capacity, more memory
    lora_alpha=32,       # Scaling factor
    target_modules=[     # Which layers to adapt
        "q_proj",
        "k_proj",
        "v_proj",
        "o_proj",
    ],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

# Training configuration
training_config = SFTConfig(
    output_dir="./llama-lora-adapter",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    learning_rate=2e-4,
    logging_steps=10,
    save_strategy="epoch",
)

# The SFTTrainer handles LoRA integration automatically
trainer = SFTTrainer(
    model=model,
    args=training_config,
    train_dataset=your_dataset,  # Your training data here
    peft_config=lora_config,
    processing_class=tokenizer,
)

trainer.train()

# Save the adapter weights — only ~50 MB instead of 16 GB
trainer.save_model("./llama-lora-adapter")
```

The resulting LoRA adapter is tiny (50-200 MB) and can be loaded alongside the base model in vLLM:

```bash
# Serve the base model with a LoRA adapter in vLLM
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --enable-lora \
    --lora-modules my-adapter=./llama-lora-adapter
```

## Model Routing

Not every request needs the same model. A **model router** sends simple queries to a small, fast model and complex queries to a larger, more capable one:

```python
# router.py — Simple model router based on query complexity
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="key")

def estimate_complexity(message: str) -> str:
    """Route queries to the appropriate model based on heuristics."""
    # Simple heuristics — replace with a classifier for production
    complex_keywords = [
        "explain", "analyze", "compare", "debug",
        "architect", "design", "optimize", "tradeoff"
    ]
    word_count = len(message.split())

    # Long queries or those with complex keywords go to the big model
    if word_count > 50 or any(kw in message.lower() for kw in complex_keywords):
        return "large"
    return "small"

def route_and_respond(user_message: str) -> str:
    """Route a message to the appropriate model and return the response."""
    complexity = estimate_complexity(user_message)

    # Map complexity levels to models
    model_map = {
        "small": "meta-llama/Llama-3.1-8B-Instruct",    # Fast, cheap
        "large": "meta-llama/Llama-3.1-70B-Instruct",    # Accurate, slower
    }

    model = model_map[complexity]
    print(f"Routing to {model} (complexity: {complexity})")

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": user_message}],
    )
    return response.choices[0].message.content
```

## Cost Comparison: Self-Hosted vs API

Here is a real cost analysis. Assume 1 million tokens per day of usage:

| Approach | Monthly Cost | Latency | Privacy |
|----------|-------------|---------|---------|
| **OpenAI GPT-4o** | ~$450/mo (input + output) | 500-2000ms TTFT | Data sent to OpenAI |
| **OpenAI GPT-4o-mini** | ~$45/mo | 300-1000ms TTFT | Data sent to OpenAI |
| **Self-hosted (A10 cloud GPU)** | ~$250/mo (cloud instance) | 50-200ms TTFT | Data stays on your infra |
| **Self-hosted (own hardware)** | ~$80/mo (electricity for RTX 4090) | 50-200ms TTFT | Data never leaves |

The breakeven point:

- **Low volume** (<100K tokens/day): APIs are cheaper and simpler
- **Medium volume** (100K-1M tokens/day): Self-hosting starts to win on cost
- **High volume** (>1M tokens/day): Self-hosting is significantly cheaper
- **Any volume with privacy requirements**: Self-hosting is the only option

## Where to Learn More

**Fine-tuning and training:**
- Hugging Face PEFT library documentation for LoRA training
- Axolotl framework for streamlined fine-tuning workflows
- Unsloth for 2x faster LoRA training with lower memory

**Serving and infrastructure:**
- vLLM documentation for advanced serving configurations
- TensorRT-LLM for NVIDIA-optimized inference
- SGLang for advanced prompt programming

**Models to try next:**
- **Llama 3.1 70B** — significant quality jump, needs 2x A10 or 1x A100
- **Mistral 7B / Mixtral 8x7B** — excellent efficiency, strong for code
- **Qwen 2.5 72B** — top-tier open model, strong multilingual
- **DeepSeek V3** — strong reasoning and math capabilities

**Monitoring and observability:**
- Prometheus metrics from vLLM for throughput and latency monitoring
- Grafana dashboards for GPU utilization and request patterns
- OpenTelemetry integration for distributed tracing

## You Did It

You went from "what is an LLM" to running a production-ready, OpenAI-compatible API serving an open-source model on your own infrastructure. Every tool and technique in this blueprint is used in production by companies serving millions of requests per day.

The open-source LLM ecosystem is moving fast. The model you deploy today will be surpassed next quarter. But the infrastructure, the API patterns, and the serving knowledge you have built here will carry forward to every future model.

---

[← Previous: Step 9 - Docker Deployment](09-docker-deployment.md)
