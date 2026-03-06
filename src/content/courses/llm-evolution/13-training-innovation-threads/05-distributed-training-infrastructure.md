# Distributed Training Infrastructure

**One-Line Summary**: Training modern LLMs requires distributing computation across thousands to hundreds of thousands of GPUs using sophisticated parallelism strategies, making distributed training infrastructure as critical as model architecture itself.

**Prerequisites**: `01-gpt-3.md`, `04-palm.md`

## What Is Distributed Training Infrastructure?

No single GPU can train a modern LLM. GPT-3's 175 billion parameters require approximately 700GB of memory in FP32 — a single A100 GPU has 80GB. Training requires storing not just the model parameters but also optimizer states (2x model size for Adam), gradients (1x model size), and activations (variable, often 5-10x model size), pushing total memory to 10-20x the raw parameter count.

Distributed training is the art of splitting this enormous computation across hundreds or thousands of GPUs while keeping them all working efficiently together. It is the unglamorous but essential engineering that makes frontier AI possible. Without it, the largest model you could train would be roughly 2-3 billion parameters.

## How It Works

**Distributed Training: The 3D/4D Parallelism Stack:**

```
  Single GPU                     3D Parallelism (TP + PP + DP)
  (max ~3B params)               (enables 100B+ models)

  ┌─────────┐                    Node 0          Node 1
  │ Full    │                    ┌──────────┐    ┌──────────┐
  │ Model   │                    │GPU0│GPU1 │    │GPU2│GPU3 │
  │ on 1 GPU│                    │TP ◄────► │    │TP ◄────► │
  └─────────┘                    │Layers 1-20│   │Layers 1-20│
                                 └─────┬─────┘   └─────┬─────┘
                                       │ PP             │ PP
                                 ┌─────▼─────┐   ┌─────▼─────┐
                                 │GPU4│GPU5 │    │GPU6│GPU7 │
                                 │TP ◄────► │    │TP ◄────► │
                                 │Layers21-40│   │Layers21-40│
                                 └───────────┘   └───────────┘
                                 ◄── DP (data replicas) ──►

  TP (Tensor Parallel):  Split matrices within a node (NVLink: 900 GB/s)
  PP (Pipeline Parallel): Split layers across nodes
  DP (Data Parallel):    Replicate across groups, split data
  EP (Expert Parallel):  Each expert on different GPU (MoE models)

  Scale Examples:
  ┌──────────────────────────────────────────────────────────┐
  │ GPT-3:      ~1,000 V100 GPUs        │ ~$4.6M           │
  │ PaLM:       6,144 TPUv4 chips       │ ~$10M            │
  │ LLaMA 3:    16,384 H100 GPUs        │ ~30M GPU-hours   │
  │ DeepSeek V3: 2,048 H100 GPUs        │ $5.6M (efficient)│
  │ Grok 3:     100,000 H100 GPUs       │ Largest cluster  │
  └──────────────────────────────────────────────────────────┘
```

### Data Parallelism (DP) -- The Simplest Approach

Data parallelism replicates the entire model on every GPU and splits the training data across them. Each GPU processes a different mini-batch, computes gradients locally, and then all GPUs synchronize gradients via an all-reduce operation. After synchronization, every GPU has identical gradients and applies the same parameter update.

This is the simplest parallelism strategy and works well when the model fits on a single GPU. The training speed scales nearly linearly with the number of GPUs (minus communication overhead). But for models that exceed single-GPU memory — anything above roughly 3B parameters on an 80GB A100 — pure data parallelism is impossible.

### Tensor Parallelism (TP) — Splitting Matrix Operations

Tensor Parallelism, pioneered by Megatron-LM (Shoeybi et al., 2019, NVIDIA), splits individual matrix multiplications across GPUs within a single node. A large weight matrix is partitioned column-wise or row-wise, each GPU computes its portion of the matrix multiplication, and results are combined via all-reduce.

TP requires high-bandwidth interconnects because communication happens within every single layer — multiple times per forward pass. NVLink provides 600-900 GB/s between GPUs within a node, making intra-node TP practical. But inter-node TP over slower InfiniBand (400 Gb/s) is typically too slow to be efficient.

### Pipeline Parallelism (PP) — Splitting Layers

Pipeline parallelism splits the model's layers across GPUs sequentially. GPU 0 processes layers 1-10, GPU 1 processes layers 11-20, and so on. The output of one GPU's layers becomes the input to the next GPU's layers.

The challenge is the "pipeline bubble" — while GPU 1 waits for GPU 0's output, it sits idle. Micro-batching (GPipe, Huang et al., 2019) mitigates this by splitting each mini-batch into smaller micro-batches that can be pipelined: GPU 0 processes micro-batch 2 while GPU 1 processes micro-batch 1. This reduces idle time but does not eliminate it entirely — typically 20-30% of GPU time is wasted in the pipeline bubble.

### Expert Parallelism (EP) — For Mixture of Experts

Expert Parallelism is specific to Mixture of Experts (MoE) models. Each expert resides on a different GPU, and tokens are routed between GPUs based on the gating function's decisions. This requires all-to-all communication — every GPU must be able to send tokens to every other GPU — making network topology critical.

The communication pattern for EP is fundamentally different from TP or PP: rather than broadcasting the same data to all GPUs (all-reduce), EP requires point-to-point communication between specific GPU pairs (all-to-all). This demands a high-bisection-bandwidth network where any two nodes can communicate efficiently.

### ZeRO and FSDP: Sharding Everything

ZeRO (Zero Redundancy Optimizer, Rajbhandari et al., 2020, Microsoft DeepSpeed) recognized that data parallelism wastes memory by replicating optimizer states, gradients, and parameters on every GPU.

ZeRO partitions these across GPUs in three stages: ZeRO-1 shards optimizer states (4x memory reduction), ZeRO-2 adds gradient sharding (8x reduction), and ZeRO-3 adds parameter sharding (linear scaling with GPU count). Parameters are gathered on-demand when needed for computation and released afterward.

PyTorch's FSDP (Fully Sharded Data Parallelism) implements a similar approach natively in PyTorch, becoming the standard for training models up to ~100B parameters in the open-source ecosystem.

### The 3D/4D Parallelism Stack

Real training runs combine all strategies simultaneously. Megatron-LM pioneered 3D parallelism (TP + PP + DP) for training models beyond 100B parameters. A typical configuration for a 175B model on 1,024 GPUs might use:
- TP=8 (8 GPUs per tensor parallel group within a node)
- PP=16 (16 pipeline stages across nodes)
- DP=8 (8 data parallel replicas)

DeepSeek V3 added a fourth dimension with Expert Parallelism, and introduced DualPipe — a novel scheduling algorithm that overlaps forward computation, backward computation, and inter-node communication to achieve near-zero pipeline bubble time.

### Frontier-Scale Clusters

Google's Pathways system trained PaLM (540B) across 6,144 TPUv4 chips in two pods connected by Google's datacenter network. xAI's Colossus cluster scaled to 100,000 H100 GPUs — the largest known training cluster — for training Grok 3.

Meta used 16,384 H100 GPUs for Llama 3 405B training, reporting that approximately 30% of training time was lost to hardware failures, network issues, and other infrastructure problems at that scale. At frontier scale, reliability engineering — checkpointing every few hours, automatic fault detection, job restart without losing progress — becomes as important as parallelism efficiency.

## Why It Matters

Distributed training infrastructure determines who can train frontier models. The cost of a 100K GPU cluster exceeds $4 billion in hardware alone, plus hundreds of millions in power, cooling, and networking. This creates an enormous barrier to entry that concentrates frontier AI development among a handful of organizations.

DeepSeek's achievement with V3 — training a frontier-quality model for $5.6M on just 2,048 H100 GPUs — demonstrated that clever training infrastructure (FP8 precision, DualPipe scheduling, efficient parallelism) can partially offset hardware disadvantage. But the gap between 2,048 and 100,000 GPUs still represents a qualitative difference in what can be attempted.

The communication overhead of distributed training is often the bottleneck. All-reduce operations for gradient synchronization, all-to-all communication for expert routing, and pipeline stage transitions all consume time that could be spent on computation. Reducing this overhead through better algorithms, faster interconnects, and overlapping communication with computation directly translates to faster and cheaper training.

## Key Technical Details

- **GPT-3** (2020): Trained on ~1,000 V100 GPUs. Estimated $4.6M compute cost. 3D parallelism.
- **PaLM** (Apr 2022): 540B params, 6,144 TPUv4 chips, Pathways system. ~$10M estimated.
- **LLaMA 3 405B** (Jul 2024): 16,384 H100 GPUs, 3D parallelism + FSDP. ~30M GPU hours.
- **DeepSeek V3** (Dec 2024): 2,048 H100 GPUs, DualPipe + FP8. $5.6M compute cost.
- **Grok 3** (Feb 2025): Colossus cluster, 100K H100 GPUs. Largest known training run.
- **NVLink Bandwidth**: 900 GB/s (H100). Critical for intra-node tensor parallelism.
- **InfiniBand Bandwidth**: 400 Gb/s per link (NDR). Standard for inter-node communication.
- **ZeRO-3 Memory**: Reduces per-GPU memory from O(model_size) to O(model_size / num_GPUs).
- **Pipeline Bubble**: Typically 20-30% idle time with standard scheduling. DualPipe reduces to near zero.
- **Failure Rate**: At 16K+ GPU scale, hardware failures occur every few hours. Checkpointing is essential.

## Common Misconceptions

- **"You just need more GPUs to train a bigger model."** Adding GPUs without proper parallelism strategy can actually slow training due to communication overhead. Efficient distributed training requires careful co-design of parallelism strategies, network topology, and batch scheduling.

- **"Data parallelism is enough for any model."** Pure data parallelism requires the full model to fit on each GPU. For models above ~3B parameters on 80GB GPUs, some form of model parallelism (TP, PP, or ZeRO-3) is mandatory.

- **"Distributed training is just an engineering problem, not a research problem."** DeepSeek's DualPipe, Google's Pathways, and DeepSpeed's ZeRO represent genuine research innovations that required novel algorithms and mathematical analysis, not just implementation effort.

## Connections to Other Concepts

Distributed training infrastructure enabled the scale of `01-gpt-3.md`, `04-palm.md`, and all subsequent frontier models. `02-deepseek-v3.md` introduced DualPipe and FP8 training as efficiency breakthroughs. `07-training-efficiency-breakthroughs.md` covers the computational optimizations that complement infrastructure. `07-grok-and-xai.md` pushed the frontier of cluster scale with Colossus. For the economic implications of training infrastructure costs, see `03-the-deepseek-cost-revolution.md`.

## Further Reading

- Shoeybi et al., "Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism" (2019) — tensor parallelism.
- Huang et al., "GPipe: Efficient Training of Giant Neural Networks using Pipeline Parallelism" (2019) — pipeline parallelism.
- Rajbhandari et al., "ZeRO: Memory Optimizations Toward Training Trillion Parameter Models" (2020) — DeepSpeed ZeRO.
- Narayanan et al., "Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM" (2021) — 3D parallelism.
- Chowdhery et al., "PaLM: Scaling Language Modeling with Pathways" (2022) — Pathways training system.
- DeepSeek-AI, "DeepSeek-V3 Technical Report" (2024) — DualPipe and efficient distributed training.
- Grattafiori et al., "The Llama 3 Herd of Models" (2024) — Meta's large-scale training infrastructure.
