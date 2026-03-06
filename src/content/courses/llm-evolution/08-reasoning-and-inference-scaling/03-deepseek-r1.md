# DeepSeek-R1: Open Reasoning from Pure RL

**One-Line Summary**: DeepSeek-R1 demonstrated that sophisticated reasoning capabilities could emerge from pure reinforcement learning without supervised fine-tuning, matching OpenAI o1 at a fraction of the cost and releasing everything under an open license.

**Prerequisites**: `01-openai-o1.md`, `02-deepseek-v3.md`

## What Is DeepSeek-R1?

Imagine discovering that a student could teach themselves to solve calculus problems just by being told whether their final answers were right or wrong, without any worked examples or step-by-step instruction. That is essentially what DeepSeek-R1-Zero demonstrated. Released on January 20, 2025, by DeepSeek, a Chinese AI lab based in Hangzhou and backed by the quantitative hedge fund High-Flyer Capital, R1 showed that reasoning behaviors like self-verification, reflection, and extended chains of thought could emerge organically from reinforcement learning alone.

The significance went beyond the technical achievement. While OpenAI kept o1's methods proprietary and its weights closed, DeepSeek released R1 under the MIT license with full weights, a detailed technical report, and distilled versions ranging from 1.5B to 70B parameters. This democratized access to frontier reasoning AI and triggered what the media called the "DeepSeek shock," a geopolitical and financial earthquake that rattled markets and forced a re-evaluation of Western AI dominance.

What made R1 particularly remarkable was the scientific clarity of the contribution. The paper presented a clean story: start with pure RL, observe emergent reasoning, then add minimal supervision to clean up the output. This recipe was reproducible, understandable, and immediately useful to the broader research community.

## How It Works

**DeepSeek-R1 -- reasoning emerges from pure reinforcement learning:**

```
R1-Zero: Reasoning from scratch (no human demonstrations)

┌──────────────┐     Only reward:      ┌─────────────────────────────────┐
│ DeepSeek-V3  │     "Is the final     │  Emergent Behaviors:            │
│ Base Model   │     answer correct?"  │                                 │
│ (671B MoE)   │──────────────────────▶│  "Let me break this down..."   │
│              │     GRPO Training     │  "Wait, let me reconsider..."  │
│ No reasoning │     (no SFT, no       │  "I need to verify step 3..."  │
│ ability      │      demonstrations)  │  "Let me try another method"   │
└──────────────┘                       │                                 │
                                       │  Self-verification EMERGED     │
                                       │  Backtracking EMERGED          │
                                       │  Compute allocation EMERGED    │
                                       └──────────┬──────────────────────┘
                                                   │
                                    ┌──────────────┴──────────────┐
                                    ▼                             ▼
                           ┌──────────────┐             ┌──────────────────┐
                           │  R1-Zero     │   +small    │  R1 (Final)      │
                           │  (messy but  │───SFT──────▶│  Clean output    │
                           │  reasoning   │  cleanup    │  MIT License     │
                           │  works!)     │             │  Matches o1      │
                           └──────────────┘             └──────────────────┘
                                                                │
                                                     Distill into smaller models
                                                     1.5B, 7B, 14B, 32B, 70B
                                                     (32B beats o1-mini on math!)
```

### DeepSeek-R1-Zero: Reasoning from Pure RL

The most scientifically remarkable result was R1-Zero. Starting from the DeepSeek-V3 base model (671B MoE, 37B active parameters), the team applied Group Relative Policy Optimization (GRPO) with only a simple reward: correctness of the final answer for math and coding problems. No supervised fine-tuning data, no human demonstrations of reasoning, no chain-of-thought examples. The model was simply rewarded for getting answers right and penalized for getting them wrong.

What emerged was stunning. R1-Zero spontaneously developed sophisticated reasoning behaviors: it learned to break problems into steps, check its own work, try alternative approaches when stuck, and allocate more thinking to harder problems. The team documented an "aha moment" where the model, mid-training, began producing self-reflective statements like "Wait, let me reconsider" and "I need to verify this step." These behaviors were not taught; they were discovered by the model as strategies that maximized reward.

R1-Zero also exhibited emergent compute allocation. As training progressed, the model naturally generated longer reasoning chains for harder problems and shorter ones for easy problems. This mirrored the theoretical predictions of test-time compute scaling without any explicit mechanism to encourage it.

### R1-Zero's Limitations and the R1 Fix

Despite its conceptual elegance, R1-Zero had practical problems. Its reasoning traces were messy, often mixing languages unpredictably (switching between Chinese and English mid-sentence). Outputs were poorly formatted and hard to read. The model sometimes entered repetitive loops or produced excessively long reasoning chains on simple problems. These issues made R1-Zero unsuitable for production use.

DeepSeek addressed this with the full R1 by adding a small amount of "cold-start" supervised fine-tuning data: a few thousand high-quality chain-of-thought examples to establish readable formatting and consistent language use before applying RL. This hybrid approach (minimal SFT followed by extensive RL) preserved the emergent reasoning capabilities while making outputs clean, structured, and usable. The cold-start data was carefully curated to teach formatting without constraining the reasoning strategies that RL would later develop.

### GRPO: Group Relative Policy Optimization

Rather than using PPO (Proximal Policy Optimization) with a separate critic model that estimates value functions, DeepSeek used GRPO, which estimates baselines from groups of sampled outputs. For each problem, the model generates multiple solutions (typically 16-64). Rewards are computed for each solution, and the policy gradient is calculated relative to the group's mean performance. Solutions better than the group average are reinforced; those worse are discouraged.

This eliminates the need for a value function model, reducing memory requirements by roughly 50% compared to PPO. For a 671B parameter model, this savings was critical: it meant the RL training could proceed on existing hardware rather than requiring even larger clusters. The reward signal combined rule-based correctness checking (for math and code) with a simple format reward to encourage structured thinking within designated tags.

### Distillation: Reasoning for Everyone

DeepSeek distilled R1's reasoning capabilities into smaller dense models by training them on R1's reasoning traces. The process was straightforward: generate high-quality reasoning traces from R1 for thousands of problems, then fine-tune smaller models on these traces using standard supervised learning.

Remarkably, the distilled R1-Distill-Qwen-32B outperformed OpenAI's o1-mini on multiple math benchmarks, scoring 72.6% on AIME 2024 compared to o1-mini's 63.6%. Even the tiny R1-Distill-Qwen-1.5B showed meaningful reasoning abilities that far exceeded what a model of that size would normally achieve. This proved that reasoning capabilities, once developed in a large model, could be efficiently transferred to models small enough to run on consumer hardware.

The distillation finding had broad implications. It meant that the expensive RL training needed to happen only once, in the large model. The resulting reasoning knowledge could then be cheaply transferred to any number of smaller models, dramatically reducing the per-model cost of reasoning capability.

Interestingly, the distilled models sometimes exhibited different reasoning styles than the original R1. While R1 might produce lengthy, exploratory reasoning chains, the distilled models learned to produce more concise but still effective reasoning. This suggested that distillation captured the essence of the reasoning strategy rather than copying it verbatim, a form of knowledge compression that preserved capability while reducing computational overhead.

## Why It Matters

DeepSeek-R1 mattered on three levels. Scientifically, it showed that reasoning is a naturally emergent capability under the right RL training conditions, not something that must be carefully engineered with supervised demonstrations. This was a profound finding about the nature of intelligence in language models: given the right incentive (correctness), sophisticated cognitive strategies emerge without explicit instruction.

Economically, it proved that frontier reasoning did not require the estimated $100M+ budgets of Western labs. R1 was trained for approximately $5.9M, and its MIT license meant anyone could deploy it. The distilled versions could run on a single consumer GPU. This moved frontier reasoning from a luxury good to a commodity within weeks of release.

Geopolitically, it demonstrated that US chip export restrictions had not prevented Chinese labs from reaching the frontier; if anything, the constraints had driven more efficient innovation. The open release was equally consequential: within weeks, R1's reasoning traces were being used to train dozens of other models globally. R1 proved that reasoning was not a moat that could be defended through secrecy.

The distillation results had particularly far-reaching impact. By showing that a 32B model could outperform o1-mini on reasoning through knowledge distillation, R1 implied that the expensive RL training needed to happen only once. The resulting reasoning knowledge could then be cheaply transferred to models of any size, fundamentally changing the economics of AI reasoning capability. Researchers at universities, small companies, and institutions in developing countries could suddenly access reasoning-capable models at costs that were previously inconceivable.

## Key Technical Details

- Released: January 20, 2025
- Architecture: 671B MoE / 37B active parameters (same as DeepSeek-V3)
- Training cost: approximately $5.9M total
- AIME 2024: 79.8% (pass@1), 97.3% (consensus@64)
- MATH-500: 97.3%
- GPQA Diamond: 71.5%
- Codeforces rating: 2029 (96.3rd percentile)
- SWE-bench Verified: 49.2%
- License: MIT (fully open weights and code)
- Distilled versions: 1.5B, 7B, 8B, 14B, 32B, 70B (based on Qwen and LLaMA)
- R1-Distill-Qwen-32B AIME 2024: 72.6% (vs o1-mini's 63.6%)
- R1-Distill-Qwen-7B AIME 2024: 55.5% (extraordinary for 7B parameters)
- Reasoning traces: typically 3,000-10,000+ tokens of internal thinking
- GRPO group size: 16-64 samples per problem during training
- "Aha moment" observed at approximately step 5,000 of RL training
- Cold-start SFT data: several thousand high-quality chain-of-thought examples
- Languages: primarily English and Chinese reasoning, with multilingual capability from V3 base
- Deployment: available via DeepSeek API and downloadable from HuggingFace
- Community impact: thousands of derivative models within weeks of release

## Common Misconceptions

- **"R1 is just a copy of o1."** While inspired by the same paradigm, R1's approach was fundamentally different. The use of pure RL (in R1-Zero) and GRPO, the emergent reasoning without SFT, and the open release all represented distinct technical contributions. R1-Zero's approach of deriving reasoning from scratch was arguably more scientifically interesting than o1's undisclosed method. The two models arrived at similar capabilities through different paths.

- **"R1 only works because DeepSeek copied Western research."** DeepSeek's innovations, including Multi-head Latent Attention, auxiliary-loss-free load balancing, GRPO, and the pure-RL reasoning discovery, were original contributions that Western labs subsequently studied and adopted. Innovation in AI is global and bidirectional.

- **"The $5.9M training cost means anyone can train R1."** That figure covers only the final RL training phase. The underlying DeepSeek-V3 base model required its own substantial training investment. The full cost of the R1 pipeline, including V3 pre-training, infrastructure development, and failed experiments, was considerably higher. However, the distillation approach does make R1-quality reasoning accessible at truly low cost.

- **"R1's open weights mean there are no safety concerns."** Open weights enable both beneficial uses (research, education, accessibility) and misuse. R1's reasoning capabilities could potentially be applied to generate more convincing misinformation or assist with harmful tasks. The debate about open versus closed release of powerful AI models intensified with R1.

## Connections to Other Concepts

R1 built on the DeepSeek-V3 architecture described in `02-deepseek-v3.md` and directly competed with OpenAI's o1 detailed in `01-openai-o1.md`. The theoretical framework for why inference-time compute works is covered in `04-test-time-compute-scaling.md`. R1's impact on the broader reasoning landscape is analyzed in `05-the-reasoning-paradigm-shift.md`. The distillation technique that made R1's knowledge transferable connects to methods in `03-knowledge-distillation-for-llms.md`. For the economic and geopolitical impact, see `03-the-deepseek-cost-revolution.md`. The o-series models that R1 challenged are covered in `02-the-o-series-evolution.md`.

## Further Reading

- DeepSeek-AI, "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning" (2025) — the full technical report.
- Shao et al., "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models" (2024) — precursor work on math reasoning with RL.
- Schulman et al., "Proximal Policy Optimization Algorithms" (2017) — the PPO baseline that GRPO improves upon.
- OpenAI, "Learning to Reason with LLMs" (2024) — the o1 work that R1 responded to and matched.
- Zelikman et al., "STaR: Bootstrapping Reasoning With Reasoning" (2022) — related work on self-improving reasoning.
- Hinton et al., "Distilling the Knowledge in a Neural Network" (2015) — the knowledge distillation technique that R1 applied to reasoning.
- Uesato et al., "Solving Math Word Problems with Process- and Outcome-Based Feedback" (2022) — process vs outcome reward, context for GRPO design.
