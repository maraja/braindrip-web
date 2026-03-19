# Step 8: What's Next

One-Line Summary: Explore fine-tuning with LoRA, production serving with vLLM, and a cost comparison showing when self-hosting beats API providers.

Prerequisites: Completed Steps 1-7 with Ollama running and custom models created

---

## What You Built

Over the last seven steps, you went from zero to a working local LLM deployment:

| Component | What You Did |
|-----------|-------------|
| **Ollama** | Installed and configured the local LLM runtime |
| **Model serving** | Pulled and ran Llama 3.1 8B with a single command |
| **Python integration** | Called your model from Python using the OpenAI client |
| **Quantization** | Understood and compared quality vs. size tradeoffs |
| **Benchmarking** | Measured real performance on your hardware |
| **Custom models** | Created specialized models with Modelfiles |

One tool, one model, one API. No Docker, no complex infrastructure.

## Production Serving with vLLM

When you are ready to serve your model to multiple users concurrently, look into **vLLM**. It is a production inference engine that uses PagedAttention for efficient GPU memory management:

- **Continuous batching** — handles many concurrent requests (Ollama queues them)
- **2-4x higher throughput** than naive serving
- **OpenAI-compatible API** — same client code works
- **Requires a GPU** with 16+ GB VRAM (A10, L4, RTX 4090, or A100)

```bash
# Install and run vLLM (requires NVIDIA GPU)
pip install vllm
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --host 0.0.0.0 --port 8000
```

Use Ollama for development and experimentation. Switch to vLLM when you need to serve multiple users.

## Fine-Tuning with LoRA

Instead of training all 8 billion parameters, **LoRA (Low-Rank Adaptation)** trains a small set of adapter weights that modify the base model's behavior. The result is a ~50 MB adapter file that customizes the model for your specific use case.

```python
# Conceptual overview — requires a GPU and training dataset
# pip install peft transformers trl

from peft import LoraConfig
from transformers import AutoModelForCausalLM, AutoTokenizer
from trl import SFTTrainer, SFTConfig

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.1-8B-Instruct",
    torch_dtype="auto",
    device_map="auto",
)

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    task_type="CAUSAL_LM",
)

# Train on your data
trainer = SFTTrainer(
    model=model,
    train_dataset=your_dataset,
    peft_config=lora_config,
    args=SFTConfig(output_dir="./adapter", num_train_epochs=3),
)
trainer.train()
trainer.save_model("./adapter")  # Only ~50 MB
```

## Cost Comparison: Self-Hosted vs API

| Approach | Monthly Cost (1M tokens/day) | Latency | Privacy |
|----------|------------------------------|---------|---------|
| **OpenAI GPT-4o** | ~$450/mo | 500-2000ms | Data sent to OpenAI |
| **OpenAI GPT-4o-mini** | ~$45/mo | 300-1000ms | Data sent to OpenAI |
| **Self-hosted (cloud GPU)** | ~$250/mo | 50-200ms | Your infrastructure |
| **Self-hosted (own hardware)** | ~$80/mo (electricity) | 50-200ms | Never leaves your machine |

The breakeven:

- **Low volume** (<100K tokens/day): APIs are cheaper and simpler
- **Medium volume** (100K-1M tokens/day): Self-hosting starts to win
- **High volume** (>1M tokens/day): Self-hosting is significantly cheaper
- **Any volume with privacy needs**: Self-hosting is the only option

## Models to Try Next

```bash
# Strong alternatives to Llama 3.1 8B
ollama pull mistral          # 7B, fast, great for code
ollama pull qwen2.5:7b       # Excellent multilingual
ollama pull gemma2:9b        # Google's open model
ollama pull phi3:14b         # Microsoft's compact model
ollama pull deepseek-coder-v2:16b  # Strong for code generation
```

## Where to Go From Here

1. **Build an app** — connect your local LLM to a web frontend or CLI tool
2. **RAG pipeline** — combine your LLM with document retrieval for Q&A on your own data
3. **Multi-model setup** — use different models for different tasks (small for routing, large for generation)
4. **Production deployment** — move to vLLM + Docker when you need to serve concurrent users
5. **Fine-tune** — train a LoRA adapter on your own data for domain-specific quality

You have the foundation. The open-source LLM ecosystem moves fast — the model you deploy today will be surpassed next quarter. But the serving knowledge and API patterns you have built here carry forward to every future model.

---

[← Customize with Modelfiles](07-customize-with-modelfiles.md)
