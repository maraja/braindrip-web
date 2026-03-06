# PaLM

**One-Line Summary**: Google's 540-billion-parameter Pathways Language Model demonstrated that a single dense Transformer, trained across 6,144 TPU v4 chips, could achieve breakthrough performance on reasoning, code, and multilingual tasks simultaneously.

**Prerequisites**: `01-gpt-3.md`, `02-kaplan-scaling-laws.md`, `01-attention-is-all-you-need.md`

## What Is PaLM?

Imagine an orchestra where every musician is world-class, but they have never rehearsed together. Now imagine building a concert hall and a conductor system that lets 6,144 musicians play in perfect synchrony for the first time. PaLM was that concert: the technical challenge was not just building a large model, but orchestrating an unprecedented scale of parallel computation to train it.

Published in April 2022 by Aakanksha Chowdhery and over 70 co-authors at Google, PaLM (Pathways Language Model) was the largest dense Transformer language model ever trained at the time, with 540 billion parameters. It arrived at a pivotal moment: GPT-3 had proven the scaling thesis in 2020, Chinchilla had just shown (March 2022) that data quantity mattered as much as model size, and Google needed to demonstrate that it could compete at the frontier of large-scale language modeling. PaLM was Google's answer — and it was also a showcase for the Pathways infrastructure, a new system designed to train models across thousands of TPU chips with unprecedented efficiency.

The project was motivated by a belief that many of the limitations observed in prior models — inconsistent reasoning, weak code generation, poor multilingual performance — could be overcome by training at sufficient scale on sufficiently diverse data. PaLM was not just "GPT-3 but bigger"; it introduced specific architectural innovations and was trained on a carefully curated mixture of multilingual web text, books, code, conversations, and scientific papers.

## How It Works

```
  PaLM: Training at Unprecedented Scale

  Hardware: 6,144 TPU v4 chips
  ┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐
  │ Pod 1 ││ Pod 2 ││ Pod 3 ││ Pod 4 ││ ... ││Pod N │
  └──┬───┘└──┬───┘└──┬───┘└──┬───┘└──┬───┘└──┬───┘
     └───────┴───────┴───┬───┴───────┴───────┘
                         │
                  ┌──────▼──────┐
                  │   PaLM      │
                  │   540B      │
                  │   params    │
                  │   118 layers│
                  │   d=18,432  │
                  └─────────────┘
                  57.8% MFU (hardware utilization)

  Training Data Mixture:
  ┌──────────────────────────────────────────┐
  │  Social media conversations    50%       │
  │  ████████████████████████████████████████ │
  │  Filtered web pages            27%       │
  │  ██████████████████████                  │
  │  Books                         13%       │
  │  ██████████                              │
  │  Code (GitHub)                  5%       │
  │  ████                                    │
  │  Wikipedia                      4%       │
  │  ███                                     │
  └──────────────────────────────────────────┘
  Surprise: Only 5% code ──▶ strong code generation!

  Key Innovation: Parallel Attention + FFN
  Standard:  Input ──▶ Attention ──▶ FFN ──▶ Output  (sequential)
  PaLM:     Input ──▶ Attention ─┐
                      FFN ───────┼──▶ Sum ──▶ Output  (~15% faster)
```
*Figure: PaLM was trained across 6,144 TPU v4 chips with 57.8% hardware utilization. Its training mixture (only 5% code) still produced strong code generation, suggesting deep transfer between natural language and code reasoning.*

### Architecture and Innovations

PaLM uses a standard decoder-only Transformer with several important modifications. The most significant was **parallel attention and feedforward computation**: instead of computing attention and then the feedforward layer sequentially (as in standard Transformers), PaLM computes them in parallel and sums the results. This reduces communication overhead and improves hardware utilization by approximately 15% on TPU v4 chips, with no loss in model quality at scale (though it slightly hurts quality at smaller scales, an acceptable tradeoff).

Other architectural choices include SwiGLU activation functions (replacing the standard ReLU or GELU), RoPE (Rotary Position Embeddings) for position encoding, multi-query attention in some configurations, no bias terms in any dense layers or layer norms, and a SentencePiece tokenizer with a 256K vocabulary. The model has 118 layers with a hidden dimension of 18,432.

### Training at Scale with Pathways

PaLM was trained on 6,144 TPU v4 chips arranged in a pod-level configuration. The Pathways system enabled efficient model parallelism across this hardware — a combination of data parallelism (across pods) and model parallelism (within pods using 2-way data parallelism and 12-way model parallelism per pod). This achieved 57.8% hardware utilization (model FLOPs utilization, or MFU), which was state-of-the-art for a model of this scale. Training consumed approximately 780 billion tokens of mixed-quality data.

### Training Data Composition

The training mixture included: social media conversations (50% of tokens), filtered web pages (27%), books (13%), Wikipedia (4%), code from GitHub (5%), and a small amount of other sources. The 5% code allocation proved surprisingly impactful — despite being a small fraction of training data, PaLM showed strong code generation capabilities, suggesting that code and natural language share underlying reasoning patterns that transfer bidirectionally.

### Breakthrough Capabilities

PaLM achieved state-of-the-art results on hundreds of benchmarks. On BIG-Bench, it outperformed the average human rater on 58% of tasks. On code generation, it matched or exceeded Codex (a model specifically fine-tuned for code) on some benchmarks despite having only 5% code in its training data. On reasoning tasks, PaLM combined with chain-of-thought prompting achieved 58.1% on the GSM8K math benchmark (vs. 55% for the previous best). Multilingual capabilities were strong across dozens of languages.

## Why It Matters

### Google's Frontier Demonstration

PaLM was Google's definitive statement that it could train at the frontier. After GPT-3 had established OpenAI as the leader in large language models, there were questions about whether Google — which had invented the Transformer — could compete at scale. PaLM answered decisively, and its results helped justify the massive internal investment that would eventually produce Gemini.

### The Pathways Vision

PaLM was the first major model trained using Google's Pathways infrastructure, which was designed to enable training of models that could handle multiple modalities and tasks through a single system. While PaLM itself was text-only, the infrastructure demonstrated the feasibility of the Pathways vision: training enormous models across thousands of chips with high efficiency. This laid the groundwork for Google's subsequent multimodal models.

### Code Generation from Incidental Data

One of PaLM's most surprising findings was that strong code generation could emerge from a model trained with only 5% code data. This suggested that the relationship between natural language understanding and code generation was deeper than previously assumed — that reasoning patterns learned from text transfer to code, and vice versa. This finding influenced subsequent training data mixture decisions across the industry.

## Key Technical Details

- **Parameters**: 540 billion (118 layers, 48 heads, d_model=18,432)
- **Training data**: ~780 billion tokens across web, books, code, Wikipedia, conversations
- **Hardware**: 6,144 TPU v4 chips
- **MFU**: 57.8% hardware utilization (state-of-the-art)
- **BIG-Bench**: Outperformed average human on 58% of tasks
- **GSM8K (with CoT)**: 58.1% accuracy
- **Code data**: Only 5% of training mix, yet strong code generation
- **Published**: April 2022 by Chowdhery et al. at Google
- **Key innovation**: Parallel attention + FFN computation (~15% throughput gain)

## Common Misconceptions

- **"PaLM was compute-optimal by Chinchilla standards."** At 540B parameters trained on 780B tokens, PaLM was significantly undertrained by the Chinchilla prescription (~20 tokens per parameter would require ~10.8T tokens). It was designed before Chinchilla's results were widely known.

- **"PaLM was the first model to use rotary position embeddings."** RoPE was developed by Su et al. in 2021 and used in several earlier models. PaLM adopted it but did not introduce it.

- **"Parallel attention+FFN always helps."** The paper showed this technique slightly hurts quality at smaller scales. It is specifically beneficial at very large scales where the hardware efficiency gains outweigh the minor quality cost.

- **"PaLM was a multimodal model."** PaLM was text-only. Its successor, PaLM-2, and the later Gemini models incorporated multimodal capabilities, but PaLM itself processed only text.

## Connections to Other Concepts

- `01-gpt-3.md` — PaLM was Google's response to GPT-3, trained at 3x the scale
- `02-kaplan-scaling-laws.md` — PaLM's design followed the Kaplan "go big" philosophy
- `03-chinchilla-and-compute-optimal-training.md` — Chinchilla showed PaLM was undertrained by data standards
- `06-emergent-abilities.md` — PaLM provided key evidence for emergent capabilities at scale
- `05-codex-and-code-generation.md` — PaLM's code results challenged the need for code-specific fine-tuning
- `05-instruction-tuning-and-flan.md` — Flan-PaLM applied instruction tuning to PaLM with dramatic improvements
- `08-gemini-1.md` — Google's successor to PaLM, natively multimodal

## Further Reading

- Chowdhery et al., "PaLM: Scaling Language Modeling with Pathways" (2022) — The PaLM paper.
- Anil et al., "PaLM 2 Technical Report" (2023) — The successor model with improved multilingual and reasoning capabilities.
- Barham et al., "Pathways: Asynchronous Distributed Dataflow for ML" (2022) — The training infrastructure behind PaLM.
- Chung et al., "Scaling Instruction-Finetuned Language Models" (2022) — Flan-PaLM results showing the power of instruction tuning on top of PaLM.
