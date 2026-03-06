# LLaMA 3 and LLaMA 3.1

**One-Line Summary**: Meta's LLaMA 3 (April 2024) and LLaMA 3.1 (July 2024) proved that open-weight models could compete at the absolute frontier, with the 405B parameter model rivaling GPT-4o and Claude 3.5 Sonnet while being freely available for download.

**Prerequisites**: `03-llama-2.md`, `03-chinchilla-and-compute-optimal-training.md`, `04-claude-3-5-sonnet.md`

## What Is LLaMA 3?

Imagine a group of scientists who have been freely sharing their blueprints for building bridges while the leading construction firms guard theirs as trade secrets. Each version of the public blueprint gets better, and eventually the open-source bridges become as strong as the proprietary ones. That is the story of LLaMA 3 — the release where open-weight models stopped being "surprisingly good for being free" and started being simply good, period.

Meta released LLaMA 3 on April 18, 2024, with 8B and 70B parameter models. Three months later, on July 23, 2024, LLaMA 3.1 added the 405B variant — the largest open-weight model ever released, and the first to genuinely compete with GPT-4o and Claude 3.5 Sonnet on major benchmarks. This was not an incremental step from LLaMA 2; it was a generational leap, built on 15 trillion training tokens (7x more than LLaMA 2), a dramatically expanded context window of 128K tokens, and a post-training pipeline that combined supervised fine-tuning with direct preference optimization.

The significance extended beyond benchmarks. By releasing the 405B model as open-weight, Meta made a strategic argument: that the future of AI should not be controlled by a few API providers. The 405B model could be downloaded, fine-tuned, deployed on private infrastructure, and customized for any purpose — capabilities that closed models explicitly prevent. This was not philanthropy; it was a bet that open-weight models would grow Meta's ecosystem and ensure the company was not dependent on competitors' APIs.

## How It Works

**LLaMA 3 evolution -- open-weight models reach the frontier:**

```
LLaMA 1 (Feb 2023)    LLaMA 2 (Jul 2023)    LLaMA 3.1 (Jul 2024)
┌──────────────┐      ┌──────────────┐       ┌──────────────┐
│ 7B-65B       │      │ 7B-70B       │       │ 8B-405B      │
│ 1.0-1.4T tok │      │ 2T tokens    │       │ 15T tokens   │
│ 2K context   │      │ 4K context   │       │ 128K context │
│ Non-commercial│      │ Commercial   │       │ Commercial   │
│              │      │ RLHF aligned │       │ SFT + DPO    │
│ MMLU (65B):  │      │ MMLU (70B):  │       │ MMLU (405B): │
│  63.4%       │      │  68.9%       │       │  88.6%       │
└──────┬───────┘      └──────┬───────┘       └──────┬───────┘
       │                     │                      │
       ▼                     ▼                      ▼
  "Good for open"     "Best open model"       "MATCHES GPT-4o
                                                and Claude 3.5"

Training compute: 2K A100s ──▶ ??? ──▶ 16K H100s (39.3M GPU-hrs)
```

### Architecture Decisions

LLaMA 3 used a dense decoder-only Transformer — no Mixture of Experts. This was a deliberate choice. Meta's researchers evaluated MoE architectures but chose dense models for training stability, simplicity of deployment, and more predictable scaling behavior. The architecture featured Grouped Query Attention (GQA) with 8 key-value heads, a vocabulary of 128,256 tokens (expanded from LLaMA 2's 32K to better handle multilingual text and code), and RoPE positional embeddings supporting 128K context length. The feedforward dimension used SwiGLU activations, following the design pattern established in LLaMA 1.

### Massive Training Scale

The training data for LLaMA 3 was approximately 15 trillion tokens — an enormous corpus that represented one of the most aggressive data curation efforts in the field. Sources included multilingual web data, code, and curated high-quality text. Meta applied extensive data filtering: heuristic filters, NSFW classifiers, deduplication at multiple granularities, and quality classifiers trained on data that Meta's own models rated as high-quality (a form of synthetic data curation).

LLaMA 3.1 405B was trained on 16,000 NVIDIA H100 GPUs, consuming an estimated 39.3 million GPU hours in total (including pre-training, post-training, and evaluation). This required custom infrastructure: Meta built its own training framework to handle the scale, with innovations in parallelism, checkpoint management, and failure recovery. Over the course of training, hardware failures were a constant — the system had to gracefully handle GPU, network, and storage failures without losing significant compute.

### Post-Training Pipeline

The post-training process for LLaMA 3.1 was as important as pre-training and represented one of the most detailed publicly documented alignment pipelines at the time. It consisted of several stages: (1) Supervised Fine-Tuning (SFT) on high-quality human-written demonstrations, (2) Direct Preference Optimization (DPO) using human preference data, and (3) iterative rounds of additional SFT and DPO with progressively harder examples and synthetic data generated by the model itself. This iterative approach — where each round of fine-tuning used data that included model-generated responses from the previous round — was a key innovation that allowed the model to improve on its own outputs.

### The 405B Milestone

The 405B model was the crown jewel. On MMLU, it scored 88.6% — matching GPT-4o (88.7%) and Claude 3.5 Sonnet (88.7%). On HumanEval, 89.0%. On GSM8K, 96.8%. On MATH, 73.8%. These were not "good for open-source" numbers; they were frontier-competitive numbers. For the first time, an organization or researcher could download a model that performed at the same level as the best commercial APIs — and run it on their own hardware, fine-tune it for their specific needs, and inspect its weights.

## Why It Matters

### Open Weight Reaches the Frontier

LLaMA 3.1 405B was the proof point that the open-weight community had been waiting for. The persistent argument against open models — that they would always trail closed models by a generation — was definitively refuted. This had cascading effects: enterprises that had been locked into API-only deployments now had a credible self-hosted option, researchers gained a frontier-class model they could study and modify, and the broader AI community gained confidence that open development could keep pace with the best-funded closed labs.

### The Data Quality Revolution

LLaMA 3's training data story was as important as its architecture. The 15T token corpus was not just big — it was carefully curated. Meta's data pipeline, with its quality classifiers, deduplication, and filtering, showed that data quality at scale was the differentiating factor. This was consistent with the broader industry trend away from "scrape everything" toward "curate ruthlessly" — a lesson first articulated by Chinchilla's compute-optimal training insights (see `03-chinchilla-and-compute-optimal-training.md`).

### Foundation for an Ecosystem

LLaMA 3.1 became the foundation for an extraordinary ecosystem of derived models. Within months, thousands of fine-tuned variants appeared on Hugging Face, specialized for everything from medical reasoning to creative writing to specific programming languages. The model was integrated into dozens of inference frameworks and deployment platforms. Meta had succeeded in making LLaMA the "Linux of AI" — a shared foundation that an entire community could build upon.

## Key Technical Details

- **LLaMA 3 release**: April 18, 2024 (8B and 70B)
- **LLaMA 3.1 release**: July 23, 2024 (8B, 70B, 405B)
- **Architecture**: Dense decoder-only Transformer (no MoE)
- **Training tokens**: ~15T
- **Context window**: 128K tokens
- **Vocabulary**: 128,256 tokens (tiktoken-based tokenizer)
- **Grouped Query Attention**: 8 KV heads
- **Training compute**: 16,000 H100 GPUs, ~39.3M GPU hours total
- **405B MMLU**: 88.6%
- **405B HumanEval**: 89.0%
- **405B GSM8K**: 96.8%
- **License**: Meta LLaMA 3.1 Community License (permissive, with usage restrictions above 700M monthly active users)

## Common Misconceptions

- **"LLaMA 3 is fully open-source."** It is open-weight, not open-source. The model weights and inference code are released, but the training data, training code, and full data pipeline details are not. The license also includes restrictions for very large deployments.

- **"The 405B model requires a supercomputer to run."** While training required 16,000 H100s, inference can run on much more modest hardware. Quantized versions (4-bit, 8-bit) can run on a single high-end server with multiple consumer GPUs, and the 8B model runs on a single GPU.

- **"Dense architecture means LLaMA 3 is less efficient than MoE models."** Per-token, dense models activate all parameters while MoE models only activate a subset. But dense models are simpler to deploy, require less memory for routing infrastructure, and have more predictable performance. The trade-off depends on the deployment scenario.

- **"Meta releases LLaMA out of altruism."** Meta's open-weight strategy serves clear business interests: it commoditizes the model layer (where Meta's competitors monetize), builds an ecosystem around Meta's technology, and ensures Meta has access to frontier AI capabilities without depending on OpenAI or Google.

## Connections to Other Concepts

- `03-llama-2.md` — The predecessor that established Meta's open-weight strategy
- `03-chinchilla-and-compute-optimal-training.md` — LLaMA 3's 15T tokens reflect Chinchilla-informed data scaling
- `04-claude-3-5-sonnet.md` — The closed-source benchmark target that LLaMA 3.1 405B competed with
- `03-gpt-4o.md` — Another benchmark target, matched by 405B on MMLU
- `06-llama-3-2-multimodal.md` — The next evolution, adding vision and small model variants
- `02-deepseek-v3.md` — Used MoE to achieve similar performance at dramatically lower cost

## Further Reading

- Meta AI, "The Llama 3 Herd of Models" (2024) — The comprehensive technical report covering architecture, training, and evaluation.
- Dubey et al., "The Llama 3 Herd of Models" (arXiv, 2024) — The academic paper with full technical details.
- Meta AI, "Introducing Meta Llama 3: The most capable openly available LLM to date" (April 2024) — Launch announcement for LLaMA 3.
- Meta AI, "Llama 3.1: Our most capable and cost-effective models to date" (July 2024) — The 405B launch announcement.
