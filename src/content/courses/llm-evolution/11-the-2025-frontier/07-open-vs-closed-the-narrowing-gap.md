# Open vs Closed: The Narrowing Gap

**One-Line Summary**: The capability gap between open-weight and closed frontier models collapsed from ~17.5 MMLU points in 2023 to near-parity by 2025, and by early 2026 the best open model trailed the best closed model by less than 1% on SWE-bench coding — driven by better training data, MoE architectures, and reasoning distillation, with remaining edges narrowing to multimodal, safety, and ecosystem differentiation.

**Prerequisites**: `05-llama-3-and-3-1.md`, `03-deepseek-r1.md`, `05-qwen-3-and-open-frontier.md`

## What Is the Open vs Closed Gap?

Imagine two car manufacturers: one sells completed vehicles with locked hoods, the other publishes complete blueprints and lets anyone build the car. For years, the locked-hood cars were dramatically better — faster, safer, more reliable. Then the blueprints started catching up. By 2025, the blueprint cars matched the locked-hood cars on most roads, even if the commercial vehicles still handled a few edge cases better. That is the story of open versus closed language models.

"Open" here means models whose weights are publicly released — anyone can download, run, modify, and build on them. LLaMA, Mistral, DeepSeek, and Qwen are the major open families. "Closed" means models accessible only through APIs, with weights proprietary: GPT-4/5, Claude, and Gemini. The gap between them has been one of the most consequential dynamics in AI, shaping who can build with the technology, how much it costs, and who controls it.

The narrowing of this gap was not a single event but a three-year compression. In early 2023, open models were a generation behind. By mid-2024, they trailed by months. By 2025, on many tasks, they matched. Understanding this trajectory — and its limits — is essential for understanding where the field is heading.

## How It Works

**The Narrowing Open vs Closed Gap (MMLU Scores Over Time):**

```
  MMLU Score
  90% ┤                                    ● GPT-4o (88.7%)
      │                                   ●  LLaMA 3.1 405B (88%)
      │                                  ●   Qwen 3 (~88%)
  85% ┤                         ● GPT-4 (86.4%)
      │
  80% ┤
      │
  75% ┤
      │                  Gap
  70% ┤             ◄──narrowing──►
      │         ● LLaMA 2 70B (~69%)
  65% ┤     ● LLaMA 1 65B (63.4%)
      │
  60% ┤
      │
      ├────┬──────┬──────┬──────┬──────┬───
        2023    2023    2024    2024   2025
        (Feb)   (Mar)   (Jul)  (Jul)

  Legend:  ● Open Models    ● Closed Models

  Gap:     ~23 pts (2023)  ──▶  <1 pt (2024)  ──▶  ~0 pts (2025)

  Drivers of Convergence:
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ Better Data  │ │ MoE Adoption │ │ Reasoning    │ │ Community    │
  │ (FineWeb,    │ │ (Mixtral,    │ │ Distillation │ │ Iteration    │
  │  Dolma)      │ │  DeepSeek)   │ │ (R1-Distill) │ │ (Hugging Face│
  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### 2023: The Chasm (17.5 MMLU Points)

When Meta released LLaMA 1 (February 2023) with 65B parameters, it scored approximately 63.4% on MMLU. GPT-4, released the following month, scored approximately 86.4%. The 23-point gap represented roughly a generation of capability difference. Open models could do research-grade experiments but were not competitive for production applications that required frontier quality. The gap was even larger on reasoning, coding, and instruction-following tasks.

### 2024: Rapid Convergence (5 MMLU Points)

LLaMA 3.1 405B (July 2024) scored approximately 88% on MMLU, while GPT-4o sat at approximately 88.7%. The gap had collapsed to under a single point on the benchmark that had defined the frontier for four years. On other benchmarks — coding (HumanEval), reasoning (GSM8K), and general knowledge — LLaMA 3.1 was competitive with GPT-4o and Claude 3.5 Sonnet.

The key drivers of this convergence were: (1) dramatically more training data (15T tokens for LLaMA 3.1 vs 1.4T for LLaMA 1), (2) better data quality and curation, (3) improved training recipes and infrastructure, and (4) post-training alignment techniques that had rapidly propagated from closed labs to the open community.

### 2025: Near-Parity on Core Tasks

By 2025, multiple open models matched or exceeded closed frontier models on specific dimensions:

**Reasoning**: DeepSeek R1 (January 2025) matched OpenAI o1 on mathematical and scientific reasoning benchmarks. It achieved this through large-scale RL training with verification-based rewards, demonstrating that the "reasoning breakthrough" was replicable without proprietary techniques.

**General capability**: Qwen 3 (April 2025) matched GPT-4o and Claude 3.5 Sonnet on MMLU, GPQA, and other general benchmarks. Its hybrid thinking mode (switchable between fast and reasoning modes) replicated the adaptive inference approach of closed models.

**Coding**: Qwen3-Coder (July 2025) approached Claude Opus 4 and Gemini 2.5 Pro on SWE-bench Verified. The gap on practical software engineering — arguably the highest-value AI application — was shrinking rapidly.

**Cost**: DeepSeek V3 delivered GPT-4-level quality for a fraction of the API cost, and self-hosting open models reduced per-query costs to near zero for organizations with available GPU capacity.

### Late 2025 / Early 2026: The Sub-1% Gap on Coding

By February 2026, the open-closed gap on the most consequential benchmark — SWE-bench Verified, measuring real-world software engineering — had narrowed to a margin barely distinguishable from noise. Claude Opus 4.5 led at 80.9%, but MiniMax M2.5, an open-weight model, reached 80.2%, trailing by only 0.7 percentage points. The details of M2.5 were striking: a 230B total / 10B active MoE architecture priced at $0.30/$1.10 per million tokens — approximately 1/10th to 1/20th the cost of Claude Opus. It also led Opus 4.6 by over 13 percentage points on multi-turn tool calling (76.8% vs ~63%).

Other open and open-weight models followed close behind. GLM-5 from Zhipu AI scored 77.8% with a 744B/40B MoE trained entirely on Huawei Ascend chips — zero NVIDIA dependency — and released under MIT license. Kimi K2.5 from Moonshot AI reached 76.8% with a 1.04T/32B MoE featuring Agent Swarm (100 sub-agents for parallel work) and native multimodal vision, priced at just $0.60/M input tokens. DeepSeek V3.2 achieved gold-medal performance in both the 2025 IMO and IOI, with its V3.2-Speciale variant surpassing GPT-5. And Mistral Large 3, a 675B/41B MoE from Europe released under Apache 2.0, debuted at #2 among open non-reasoning models on LMArena.

On the specialized SWE-Bench Pro benchmark, Qwen3-Coder-Next — with only 3B active parameters out of 80B total — performed roughly on par with Claude Sonnet 4.5, an astonishing result given the parameter efficiency gap. This was no longer a story of open models catching up; on coding tasks, the best open model was within 1% of the best closed model.

The LMArena (renamed to Arena in January 2026) leaderboard told a similar story of blurring boundaries. Grok 4.1 Thinking, while technically a closed model from xAI, sat at #4 with 1475 Elo, demonstrating that the competitive field had expanded well beyond the original OpenAI-Anthropic-Google triopoly. The proliferation of competitive models from Chinese labs (Qwen, DeepSeek, GLM, Kimi, MiniMax), European entrants (Mistral), and newer Western players (xAI) meant that frontier performance was no longer the exclusive province of two or three companies.

### The Drivers of Convergence

Several factors explain why the gap closed so quickly:

**Training data improvements**: Open datasets like FineWeb, RedPajama, and Dolma reached trillions of tokens of curated, high-quality text. The "data moat" that closed labs once held evaporated as open data curation caught up.

**Architecture democratization**: MoE, GQA, RoPE, SwiGLU, RMSNorm, and other innovations were published and adopted by open model developers within months of their introduction. Architectural advantages were inherently temporary.

**Reasoning distillation**: DeepSeek R1's reasoning capabilities were partially distilled into smaller models, and the techniques (RL with verification rewards) were replicable. Open labs could train reasoning models using the same published methods.

**Community iteration**: Hugging Face, the open evaluation ecosystem, and the fine-tuning community created a flywheel where open models were rapidly tested, improved, and specialized by thousands of contributors.

**Compute democratization**: Cloud GPU access through providers like Lambda Labs, CoreWeave, and major cloud platforms made training infrastructure available to organizations beyond the biggest tech companies. While frontier pre-training still requires massive investment, post-training, fine-tuning, and evaluation became accessible to a much broader range of researchers and developers.

### Where the Gap Persists

Despite the convergence on benchmarks, closed models maintained meaningful advantages in several areas as of mid-2025 — though even these edges continued to erode. Multimodal capabilities — especially audio and video — remained stronger in closed models with proprietary training data. Safety and alignment quality, particularly consistency across diverse prompts and robustness to adversarial inputs, favored models with large-scale RLHF investment. Agentic task completion — sustained autonomous work over complex multi-step tasks — still showed meaningful gaps, with Claude Opus 4's 72.5% on SWE-bench exceeding what any open model had achieved at that time. By early 2026, however, even the coding and agentic gap had compressed dramatically: MiniMax M2.5 reached 80.2% on SWE-bench Verified, within 0.7 points of the leading closed model. The persistent gaps are real but increasingly narrow, suggesting that differentiation will shift from raw capability to safety, reliability, ecosystem integration, and enterprise features.

## Why It Matters

### The "90% at 1%" Dynamic

The most disruptive aspect of the narrowing gap is economic. If an open model delivers 90% of closed frontier quality at 1% of the cost (self-hosted inference vs API pricing), the value proposition shifts dramatically for many applications. Production workloads that do not need the absolute frontier — customer support, content generation, code assistance, data analysis — can switch to open models and save orders of magnitude on costs.

### Pricing Pressure

DeepSeek's emergence forced industry-wide API price reductions. When an open model matches a closed model's quality, the closed provider cannot charge a premium for capability alone — they must differentiate on reliability, safety, support, or ecosystem integration. This pressure has been visible in OpenAI's and Google's aggressive price cuts throughout 2024-2025.

### Innovation Speed

Open models benefit from a distributed innovation engine that no single company can match. Thousands of researchers and developers experiment with open weights, discover improvements, and share results. The Alpaca effect demonstrated this early: within weeks of LLaMA's release, the community had fine-tuned it to be instruction-following. This pattern has repeated at every scale.

## Key Technical Details

- 2023 gap: LLaMA 1 65B ~63.4% MMLU vs GPT-4 ~86.4% MMLU (~23 points)
- 2024 gap: LLaMA 3.1 405B ~88% MMLU vs GPT-4o ~88.7% MMLU (<1 point)
- 2025: DeepSeek R1 matches o1 on reasoning; Qwen 3 matches GPT-4o on general tasks
- Qwen3-Coder approaches Claude Opus 4 on SWE-bench Verified
- SWE-bench Verified (Feb 2026): Claude Opus 4.5 at 80.9%, MiniMax M2.5 (open-weight) at 80.2% — gap of only 0.7 points
- MiniMax M2.5: 230B/10B MoE, $0.30/$1.10 per M tokens, 76.8% multi-turn tool calling (13+ pts ahead of Opus 4.6)
- GLM-5 (Zhipu AI, Feb 2026): 744B/40B MoE, 28.5T tokens, Huawei Ascend only, 77.8% SWE-bench, MIT license
- Kimi K2.5 (Moonshot AI, Jan 2026): 1.04T/32B MoE, 384 experts, 76.8% SWE-bench, Agent Swarm, $0.60/M input
- DeepSeek V3.2 (Dec 2025): 685B MoE, V3.2-Speciale surpasses GPT-5, IMO/IOI gold medals
- Mistral Large 3 (Dec 2025): 675B/41B MoE, Apache 2.0, 256K context, #2 open non-reasoning on LMArena
- Qwen3-Coder-Next: SWE-Bench Pro performance on par with Claude Sonnet 4.5 (80B total / 3B active params)
- Arena (formerly LMArena): Grok 4.1 Thinking at #4 (1475 Elo), competitive with top closed models
- Timeline compression: open models lag ~3 months behind closed frontier releases by 2025
- Key drivers: data quality, MoE adoption, reasoning distillation, community iteration
- Economic pressure: open models force closed API pricing downward
- Best open model within 1% of best closed model on SWE-bench coding benchmark by early 2026

## Common Misconceptions

- **"Open models have fully caught up."** On general benchmarks and specific tasks like coding and math, yes. But closed models maintain meaningful edges on multimodal capabilities (especially video and audio), safety and alignment quality, consistency across diverse prompts, and agentic task completion. The gap has narrowed, not disappeared.

- **"Open means anyone can train these models."** Releasing weights is "open." Training a frontier model still requires tens of millions of dollars in compute. The "openness" is in deployment and modification, not in the ability to replicate training from scratch.

- **"The gap will close completely."** Closed labs invest billions in proprietary data, training infrastructure, and RLHF feedback that open models cannot easily replicate. The gap may reach a stable equilibrium where closed models maintain a small but persistent edge on the hardest tasks, while open models cover 90-95% of practical use cases.

- **"Open models are less safe."** Open models allow anyone to inspect, audit, and improve safety properties. Closed models require trusting the provider's safety claims without verifiable evidence. Both approaches have strengths and weaknesses for AI safety.

## Connections to Other Concepts

The cost dynamics are explored in `03-the-deepseek-cost-revolution.md`. The open ecosystem infrastructure is covered in `04-the-open-source-ecosystem.md`. Specific open model families are detailed in `05-llama-3-and-3-1.md`, `04-llama-4.md`, `03-deepseek-r1.md`, and `05-qwen-3-and-open-frontier.md`. The commercial implications connect to `02-the-api-economy.md`. The future trajectory is discussed in `05-where-llms-are-heading.md`. The specialization strategy is examined in `05-qwen-3-coder-and-specialization.md`.

## Further Reading

- Touvron et al., "LLaMA: Open and Efficient Foundation Language Models" (2023) — the release that started the open model revolution.
- DeepSeek-AI, "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning" (2025) — open reasoning model matching closed frontier.
- Qwen Team, "Qwen 3 Technical Report" (2025) — open model at general frontier parity.
- Penedo et al., "The FineWeb Datasets: Decanting the Web for the Finest Text Data at Scale" (2024) — open training data closing the data gap.
- Longpre et al., "The Data Provenance Initiative: A Large Scale Audit of Dataset Licensing & Attribution in AI" (2023) — the data ecosystem enabling open models.
