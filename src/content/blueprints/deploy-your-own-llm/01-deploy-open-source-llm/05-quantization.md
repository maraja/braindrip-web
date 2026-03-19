# Step 5: Quantization

One-Line Summary: Understand how quantization shrinks model sizes by 2-4x while preserving most quality — and compare Q4, Q8, and FP16 variants hands-on.

Prerequisites: Ollama running with Llama 3.1 8B (Step 3), at least 16 GB free disk space to compare multiple variants

---

## What Is Quantization

Neural network weights are normally stored as 16-bit floating point numbers (FP16). Quantization reduces the precision of these weights to fewer bits — 8-bit, 4-bit, or even 2-bit — to shrink the model and speed up inference.

Think of it like image compression: a JPEG is much smaller than a RAW photo, and for most purposes you cannot tell the difference. Quantization does the same thing for model weights.

## Precision Levels Explained

| Precision | Bits per Weight | Llama 3.1 8B Size | Quality Impact | Use Case |
|-----------|----------------|-------------------|----------------|----------|
| **FP16** | 16 bits | ~16 GB | Baseline (best) | Production with ample VRAM |
| **Q8_0** | 8 bits | ~8.5 GB | Negligible loss | Production on consumer GPUs |
| **Q5_K_M** | ~5.5 bits | ~5.7 GB | Very minor loss | Good balance |
| **Q4_K_M** | ~4.5 bits | ~4.9 GB | Minor loss | Recommended default |
| **Q4_0** | 4 bits | ~4.7 GB | Noticeable on hard tasks | Minimum viable quality |
| **Q2_K** | ~2.5 bits | ~3.2 GB | Significant loss | Experiments only |

The naming convention: `Q4` = 4-bit, `K_M` = uses K-quant method with medium quality. K-quants keep important layers at higher precision, which improves quality compared to naive quantization.

## Pull Different Quantizations

Ollama tags specify quantization levels. Pull a few to compare:

```bash
# Pull the default Q4 quantization (smallest practical size)
ollama pull llama3.1:8b

# Pull the Q8 quantization (higher quality, larger)
ollama pull llama3.1:8b-instruct-q8_0

# Check sizes of all downloaded models
ollama list
```

## Compare Quality Across Quantizations

Create a script that sends the same prompts to different quantization levels:

```python
# compare_quant.py — Compare output quality across quantization levels
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",
)

# Models to compare — add or remove based on what you have pulled
models = [
    "llama3.1:8b",             # Q4_0 — default quantization
    "llama3.1:8b-instruct-q8_0",  # Q8_0 — higher precision
]

# Test prompts that reveal quality differences
test_prompts = [
    # Reasoning — tests logical capability
    "If a shirt costs $25 after a 20% discount, what was the original price? Show your work.",
    # Code generation — tests precision
    "Write a Python function that checks if a string is a valid IPv4 address without using regex.",
    # Nuance — tests language understanding
    "Explain the difference between concurrency and parallelism with a real-world analogy.",
]

for prompt in test_prompts:
    print(f"\n{'='*70}")
    print(f"PROMPT: {prompt}")
    print(f"{'='*70}")

    for model in models:
        print(f"\n--- {model} ---")
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0,  # Use 0 for deterministic comparison
                max_tokens=300,
            )
            print(response.choices[0].message.content)
        except Exception as e:
            print(f"Error: {e} — make sure this model is pulled")
```

Run the comparison:

```bash
# Compare quantization quality side by side
python compare_quant.py
```

## What to Look For

When comparing outputs across quantizations:

- **Math accuracy**: Q4 models occasionally make arithmetic errors that Q8 and FP16 get right
- **Code correctness**: Lower quantizations may miss edge cases or produce subtly wrong logic
- **Coherence on long outputs**: Quality differences become more visible in longer generations
- **Following instructions**: Higher precision models follow complex instructions more reliably

For most use cases, **Q4_K_M is the sweet spot** — the quality loss is minimal and the memory savings are substantial. Use Q8 or FP16 when accuracy on reasoning or code tasks is critical.

## The Memory Tradeoff

The relationship between quantization and memory is direct:

```
Model Size in Memory ≈ (Parameters × Bits per Weight) / 8 + Overhead

Llama 3.1 8B at FP16:  8B × 16 / 8 = 16 GB
Llama 3.1 8B at Q8:    8B × 8  / 8 =  8 GB
Llama 3.1 8B at Q4:    8B × 4  / 8 =  4 GB
```

This means quantization literally determines whether a model fits on your hardware. A Q4 model runs on a 8 GB laptop; the same model at FP16 needs a 24 GB GPU.

Now that you understand the quality-size tradeoff, let's measure performance with real numbers in the next step.

---

[← Previous: Step 4 - Ollama API](04-ollama-api.md) | [Next: Step 6 - Benchmark Models →](06-benchmark-models.md)
