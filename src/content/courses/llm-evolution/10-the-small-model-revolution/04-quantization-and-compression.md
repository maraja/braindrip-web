# Quantization and Compression

**One-Line Summary**: Quantization techniques evolved from a niche optimization into the critical bridge that brought frontier-class language models from data center clusters to consumer laptops, shrinking memory requirements by 4x with less than 1% quality loss.

**Prerequisites**: `02-kaplan-scaling-laws.md`, `05-distributed-training-infrastructure.md`

## What Is Quantization and Compression?

Imagine a professional photographer who shoots in RAW format -- each image is 50 megabytes of pristine detail, capturing subtle gradations invisible to the human eye. Now imagine converting those images to high-quality JPEG: each file drops to 5 megabytes, and for almost any practical purpose -- printing, sharing, displaying on a screen -- the quality difference is imperceptible. Only a trained eye examining edge cases would spot the compression artifacts. Quantization does the same thing for neural network weights: it reduces the numerical precision of each parameter, dramatically shrinking memory footprint while preserving the behavior that matters.

The need for quantization grew directly from the scaling era's central contradiction. By 2023, the most capable models had billions to trillions of parameters, but each parameter was stored as a 16-bit or 32-bit floating-point number. A 70B parameter model in FP16 (16-bit floating point) requires 140 GB of memory just for the weights -- more than any single consumer GPU could hold, and expensive even in cloud environments. As models grew more powerful, they also grew further out of reach for most developers and organizations.

Quantization emerged as the practical answer. By representing weights in 8-bit, 4-bit, or even lower precision, models could be compressed by 2-4x with minimal quality degradation. A 70B model quantized to 4-bit integers fits in roughly 35 GB -- within reach of a high-end consumer GPU or even a MacBook Pro with 64GB of unified memory. This wasn't just a convenience optimization; it was the enabling technology that made the local AI revolution possible.

## How It Works

**Quantization precision levels -- the memory-quality tradeoff:**

```
70B Parameter Model -- Memory Requirements by Precision:

FP32 (32-bit)   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  280 GB
                 (Training precision -- full accuracy)

BF16 (16-bit)   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                    140 GB
                 (Standard inference -- <0.1% quality loss)

INT8 (8-bit)    ▓▓▓▓▓▓▓▓                               70 GB
                 (First practical quantization target)

INT4 (4-bit)    ▓▓▓▓                                    35 GB  <-- Sweet spot!
                 (<1% quality loss on benchmarks)

INT3 (3-bit)    ▓▓▓                                    ~26 GB
                 (2-5% quality loss, still usable)

Hardware needed:
FP32: Multi-GPU cluster ($20K+)
BF16: 2x A100 80GB ($15K+)
INT4: Single RTX 4090 or MacBook Pro 64GB ($1,500-2,000)  <-- Democratization!

Key insight: Quality loss at INT4 is nearly imperceptible
             but hardware requirement drops by 10x
```

### The Basics: Precision Formats

Neural network weights are numbers, and the precision with which you store them determines both memory usage and computational accuracy:

- **FP32 (32-bit float)**: 4 bytes per parameter. Full precision, used during training. A 70B model requires 280 GB.
- **FP16/BF16 (16-bit float)**: 2 bytes per parameter. Standard inference precision. 70B model requires 140 GB.
- **INT8 (8-bit integer)**: 1 byte per parameter. First practical quantization target. 70B model requires 70 GB.
- **INT4 (4-bit integer)**: 0.5 bytes per parameter. The sweet spot for consumer deployment. 70B model requires 35 GB.
- **INT3/INT2**: Experimental ultra-low precision. Significant quality loss, but models under 7B can survive it for simple tasks.

The challenge is that not all weights are equally important. Naively rounding every weight to the nearest 4-bit value introduces cumulative errors that can devastate model quality. The breakthroughs in LLM quantization came from understanding which weights matter most and preserving their precision.

### GPTQ: Post-Training Quantization (2022)

Elias Frantar and colleagues introduced GPTQ (GPT Quantization) in October 2022, building on the Optimal Brain Quantization framework. GPTQ works as a post-training method -- you take a fully trained FP16 model and quantize it without any additional training. The key innovation was processing weights column by column, using a small calibration dataset (typically 128 samples) to measure the impact of quantizing each weight and compensating for errors by adjusting remaining weights.

GPTQ could quantize a 175B model to 3-4 bits in approximately 4 GPU-hours -- a one-time cost that made the quantized model permanently smaller and faster. On OPT-175B, GPTQ at 4-bit achieved perplexity within 0.5 points of the full-precision model while reducing memory by 4x. This was the technique that first made running large models on consumer hardware plausible.

### AWQ: Activation-Aware Weight Quantization (2023)

Ji Lin and colleagues at MIT introduced AWQ in June 2023, with an insight that was elegant in its simplicity: not all weights are equally important, and the important ones can be identified by looking at activation magnitudes rather than weight magnitudes. Weights connected to channels with large activations carry more information and should be quantized more carefully.

AWQ's approach: identify the top 1% of "salient" weight channels (based on activation patterns from a calibration set), apply per-channel scaling to protect these critical weights, then quantize the scaled weights uniformly. This achieved better quality than GPTQ at the same bit-width, with particular improvements on tasks requiring precise factual recall. AWQ also enabled more efficient GPU kernels, achieving up to 3.3x speedup over FP16 on certain hardware.

### QLoRA: Quantization Meets Fine-Tuning (May 2023)

Tim Dettmers and colleagues bridged quantization and fine-tuning with QLoRA -- a method that quantizes the base model to 4-bit precision using a novel "NormalFloat4" data type, then applies LoRA (Low-Rank Adaptation) adapters on top in higher precision. The base model weights remain frozen in 4-bit, while only the small LoRA matrices are trained in BF16.

The practical impact was extraordinary: a 65B parameter model could be fine-tuned on a single 48 GB GPU (A6000 or equivalent). Previously, fine-tuning a model this size required multiple 80 GB A100s. QLoRA's Guanaco model, fine-tuned from LLaMA-65B, achieved 99.3% of ChatGPT's performance on the Vicuna benchmark. The method made fine-tuning accessible to researchers with modest hardware budgets.

### The Modern Quantization Ecosystem

By 2024-2025, quantization had matured into a rich ecosystem:

- **GGUF format**: The community-standard format for quantized models, used by llama.cpp and its derivatives. Supports mixed quantization (different precision for different layers), with common variants like Q4_K_M (4-bit with medium-precision key layers) offering excellent quality-size tradeoffs.
- **AQLM/QuIP#**: Advanced methods pushing toward 2-bit quantization with acceptable quality, using vector quantization and incoherence processing.
- **LLM-QAT**: Quantization-aware training, where the model is trained with quantization noise injected, producing weights that are inherently more robust to low-precision representation.
- **Speculative quantization**: Using lower precision for draft tokens in speculative decoding, combining compression with latency optimization.

## Why It Matters

### The 4-Bit Revolution

The shift from FP16 to INT4 isn't just a 4x memory savings -- it's a qualitative shift in who can use large language models. At FP16, a 70B model requires hardware costing $20,000+. At INT4, the same model runs on a $2,000 MacBook Pro or a single $1,500 RTX 4090. This 10x reduction in hardware cost, multiplied across millions of potential users, represents a fundamental democratization of AI capabilities. When TheBloke (a prolific community quantizer) uploaded GPTQ and GGUF versions of every major open-weight model to Hugging Face, downloads numbered in the millions.

### Enabling the Edge AI Economy

Quantization is what makes on-device AI economically viable. Running inference on cloud GPUs costs $1-5 per million tokens. Running a quantized model locally costs only electricity. For applications requiring constant inference -- code completion, real-time translation, voice assistants -- the cost difference over millions of queries is enormous. Companies like Apple (with CoreML quantized models) and Google (with Gemma Nano) have built entire product strategies around quantized on-device inference.

### Closing the Deployment Gap

Before quantization, there was a painful gap between what researchers could train and what engineers could deploy. A model that achieved state-of-the-art on benchmarks might require $50,000 in GPU infrastructure to serve at reasonable latency. Quantization closed this gap, making deployment costs proportional to model capabilities. This accelerated the transition of LLMs from research artifacts to production systems.

## Key Technical Details

- FP16 to INT4 quantization: 4x memory reduction (70B model: 140 GB to ~35 GB)
- GPTQ (October 2022): post-training quantization, ~4 GPU-hours for 175B model, <0.5 perplexity degradation
- AWQ (June 2023): activation-aware approach, up to 3.3x speedup over FP16, better factual retention
- QLoRA (May 2023): fine-tune 65B model on single 48 GB GPU, 99.3% of ChatGPT quality on Vicuna benchmark
- Quality degradation at INT4: typically <1% on standard benchmarks for models 7B+
- INT3 and INT2: experimental, 2-5% quality loss, viable for models under 7B on constrained devices
- GGUF format supports 15+ quantization variants with different quality-size tradeoffs
- Modern quantization takes minutes to hours -- negligible cost compared to model training

## Common Misconceptions

- **"Quantization destroys model quality."** At INT8, quality loss is essentially unmeasurable. At INT4, it's typically under 1% on standard benchmarks. Only at INT3 and below do meaningful degradations appear, and even then, the model remains useful for many tasks.

- **"You need to retrain the model after quantization."** Post-training quantization methods like GPTQ and AWQ work on pre-trained models with no additional training -- just a small calibration dataset and a few hours of processing.

- **"Quantized models are slower."** They're actually faster for most deployments because they require less memory bandwidth, which is typically the bottleneck for inference. A 4-bit model can process tokens 2-3x faster than the same model in FP16 on the same hardware.

- **"All quantization methods are the same."** There are significant differences. GPTQ optimizes for GPU inference, GGUF/GGML targets CPU inference, AWQ preserves activation-critical weights, and QLoRA enables fine-tuning. Choosing the right method for the deployment target matters considerably.

## Connections to Other Concepts

Quantization is the enabling technology for `06-llama-cpp-and-local-inference.md` and the broader movement described in `07-the-slm-revolution.md`. QLoRA bridges to `05-lora-and-fine-tuning-democratization.md`. The models most commonly quantized for local use include `01-phi-series.md`, `02-gemma.md`, and the LLaMA family. Quantization economics directly affect the cost dynamics in `05-distributed-training-infrastructure.md` and the accessibility argument in `07-open-vs-closed-the-narrowing-gap.md`.

## Further Reading

- Frantar et al., "GPTQ: Accurate Post-Training Quantization for Generative Pre-Trained Transformers" (2022) -- the foundational LLM quantization method
- Lin et al., "AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration" (2023) -- the insight that activations reveal weight importance
- Dettmers et al., "QLoRA: Efficient Finetuning of Quantized Language Models" (2023) -- bridging quantization and fine-tuning
- Dettmers et al., "The Case for 4-bit Precision: k-bit Inference Scaling Laws" (2023) -- the theoretical foundation for why 4-bit works
- Egiazarian et al., "Extreme Compression of Large Language Models via Additive Quantization" (2024) -- pushing toward 2-bit precision with AQLM
