# Step 6: Benchmark Models

One-Line Summary: Write a Python benchmarking script that measures tokens per second, time to first token, and total latency — giving you real performance data for your hardware.

Prerequisites: Ollama running with at least one model pulled (Step 3), Python 3.10+ with openai package installed (Step 4)

---

## Why Benchmark

Numbers from blog posts and model cards are measured on different hardware with different settings. The only performance data that matters is from **your machine, your model, your workload**. We will measure three key metrics:

- **Time to First Token (TTFT)** — How long before the first token appears. Critical for interactive UX.
- **Tokens per Second (TPS)** — Generation throughput. Determines how fast responses complete.
- **Total Latency** — End-to-end time from request to finished response.

## The Benchmarking Script

Create `benchmark.py`:

```python
# benchmark.py — Measure LLM inference performance on your hardware
import time
import json
import statistics
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",
)

# Configuration — adjust these for your setup
MODELS = ["llama3.1:8b"]  # Add more models to compare
NUM_RUNS = 3  # Number of runs per prompt for averaging
MAX_TOKENS = 200  # Maximum tokens to generate per response

# Test prompts with varying complexity
PROMPTS = [
    {
        "name": "short_factual",
        "messages": [
            {"role": "user", "content": "What is the speed of light in km/s?"}
        ],
    },
    {
        "name": "code_generation",
        "messages": [
            {"role": "user", "content": "Write a Python function that implements binary search on a sorted list."}
        ],
    },
    {
        "name": "long_explanation",
        "messages": [
            {"role": "user", "content": "Explain how HTTPS works, including the TLS handshake, certificate validation, and symmetric key exchange."}
        ],
    },
]


def benchmark_single_request(model: str, messages: list) -> dict:
    """Run a single inference request and measure timing."""
    # Record the start time
    start_time = time.perf_counter()
    first_token_time = None
    token_count = 0

    # Use streaming to measure time to first token
    stream = client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=MAX_TOKENS,
        temperature=0.7,
        stream=True,
    )

    # Iterate through the stream, counting tokens
    output_text = ""
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            # Record when the first token arrives
            if first_token_time is None:
                first_token_time = time.perf_counter()
            token_count += 1
            output_text += chunk.choices[0].delta.content

    end_time = time.perf_counter()

    # Calculate metrics
    total_time = end_time - start_time
    ttft = first_token_time - start_time if first_token_time else total_time
    generation_time = end_time - first_token_time if first_token_time else total_time
    tps = token_count / generation_time if generation_time > 0 else 0

    return {
        "total_time": round(total_time, 3),
        "ttft": round(ttft, 3),
        "tokens": token_count,
        "tokens_per_sec": round(tps, 1),
        "output_length": len(output_text),
    }


def run_benchmarks() -> list:
    """Run all benchmarks and collect results."""
    all_results = []

    for model in MODELS:
        print(f"\n{'='*60}")
        print(f"Benchmarking: {model}")
        print(f"{'='*60}")

        # Warm up — first request loads the model into memory
        print("Warming up (loading model into memory)...")
        client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=10,
        )
        print("Model loaded. Starting benchmarks...\n")

        for prompt_config in PROMPTS:
            prompt_name = prompt_config["name"]
            messages = prompt_config["messages"]
            run_results = []

            for run in range(NUM_RUNS):
                result = benchmark_single_request(model, messages)
                run_results.append(result)
                print(
                    f"  {prompt_name} (run {run+1}/{NUM_RUNS}): "
                    f"{result['tokens_per_sec']} tok/s, "
                    f"TTFT={result['ttft']}s, "
                    f"Total={result['total_time']}s"
                )

            # Calculate averages across runs
            avg_result = {
                "model": model,
                "prompt": prompt_name,
                "avg_ttft": round(
                    statistics.mean(r["ttft"] for r in run_results), 3
                ),
                "avg_tps": round(
                    statistics.mean(r["tokens_per_sec"] for r in run_results), 1
                ),
                "avg_total": round(
                    statistics.mean(r["total_time"] for r in run_results), 3
                ),
                "avg_tokens": round(
                    statistics.mean(r["tokens"] for r in run_results), 0
                ),
            }
            all_results.append(avg_result)
            print(
                f"  >> AVG: {avg_result['avg_tps']} tok/s, "
                f"TTFT={avg_result['avg_ttft']}s\n"
            )

    return all_results


def print_summary(results: list):
    """Print a formatted summary table of benchmark results."""
    print(f"\n{'='*60}")
    print("BENCHMARK SUMMARY")
    print(f"{'='*60}")
    print(
        f"{'Model':<25} {'Prompt':<20} {'TPS':>6} {'TTFT':>7} {'Total':>7}"
    )
    print("-" * 65)
    for r in results:
        print(
            f"{r['model']:<25} {r['prompt']:<20} "
            f"{r['avg_tps']:>6.1f} {r['avg_ttft']:>6.3f}s {r['avg_total']:>6.3f}s"
        )


if __name__ == "__main__":
    results = run_benchmarks()
    print_summary(results)

    # Save results to JSON for later analysis
    with open("benchmark_results.json", "w") as f:
        json.dump(results, f, indent=2)
    print("\nResults saved to benchmark_results.json")
```

## Run the Benchmark

```bash
# Run benchmarks — takes a few minutes depending on your hardware
python benchmark.py
```

Example output on an M2 MacBook Pro (16 GB):

```
============================================================
BENCHMARK SUMMARY
============================================================
Model                     Prompt               TPS    TTFT   Total
-----------------------------------------------------------------
llama3.1:8b               short_factual        38.2  0.412s  1.847s
llama3.1:8b               code_generation      35.7  0.398s  5.621s
llama3.1:8b               long_explanation      36.1  0.405s  5.540s
```

## Interpreting Results

Here are rough performance tiers to gauge your results:

| Tokens/sec | Experience |
|-----------|------------|
| **5-15** | Usable but slow — CPU inference on most machines |
| **15-30** | Comfortable for development — Apple Silicon or older GPUs |
| **30-60** | Good — modern laptop GPU or mid-range desktop GPU |
| **60-100+** | Excellent — high-end GPU (RTX 4090, A100) |

**Time to First Token** under 500ms feels instant to users. Over 2 seconds feels sluggish. This is your most important UX metric for interactive applications.

## Comparing Multiple Models

To benchmark different models or quantizations, update the `MODELS` list:

```python
# Compare quantization levels — make sure these are pulled first
MODELS = [
    "llama3.1:8b",                 # Q4 default
    "llama3.1:8b-instruct-q8_0",   # Q8 higher quality
]
```

You now have concrete performance data for your hardware. In the next step, we will customize models using Ollama's Modelfile system.

---

[← Previous: Step 5 - Quantization](05-quantization.md) | [Next: Step 7 - Customize with Modelfiles →](07-customize-with-modelfiles.md)
