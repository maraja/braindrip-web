# InstructGPT and RLHF

**One-Line Summary**: OpenAI's InstructGPT demonstrated that a 1.3B parameter model aligned with human preferences via reinforcement learning from human feedback could be preferred over the 175B GPT-3, proving that alignment technique matters as much as raw scale.

**Prerequisites**: `01-gpt-3.md`, `02-kaplan-scaling-laws.md`

## What Is InstructGPT?

Imagine you have a brilliant but socially unaware colleague who has memorized every book in the library. Ask them a question, and they might recite a relevant passage, start a tangentially related monologue, or respond in a language you did not request. They know everything but cannot figure out what you actually want. Now imagine giving this colleague months of coaching from patient human trainers who demonstrate what helpful responses look like, and then letting thousands of people vote on which of their responses are best. After this process, your colleague becomes one of the most helpful people you have ever worked with — even though they have not learned any new facts. That is what RLHF did to GPT-3.

Published in March 2022 by Long Ouyang and over 30 co-authors at OpenAI, "Training language models to follow instructions with human feedback" was one of the most consequential papers in the history of AI. The core insight was deceptively simple: GPT-3 was trained to predict the next token in internet text, but users wanted it to follow instructions, be helpful, and avoid harmful content. These objectives were misaligned. RLHF (Reinforcement Learning from Human Feedback) bridged this gap by training the model to optimize for what humans actually wanted, rather than what was statistically likely in web text.

The result shattered assumptions about scaling. A 1.3B parameter InstructGPT model — over 100x smaller than GPT-3 — was preferred by human raters in head-to-head comparisons. This was the first rigorous demonstration that alignment technique could substitute for, or at least dramatically complement, raw scale. It launched RLHF as the industry standard for training chatbots and assistant models, and its three-stage pipeline became the blueprint that every major lab would follow.

## How It Works

```
  RLHF: The Three-Stage Alignment Pipeline

  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │  STAGE 1: Supervised Fine-Tuning (SFT)                      │
  │  ┌───────────────────┐     ┌───────────────────┐            │
  │  │  Human-written     │────▶│  Fine-tune GPT-3  │            │
  │  │  demonstrations    │     │  on demonstrations│            │
  │  │  (~13K examples)   │     │  (supervised)     │            │
  │  └───────────────────┘     └────────┬──────────┘            │
  │                                      │                       │
  │  STAGE 2: Reward Model Training      ▼                       │
  │  ┌───────────────────┐     ┌───────────────────┐            │
  │  │  Human ranks       │────▶│  Train reward     │            │
  │  │  model outputs     │     │  model (RM)       │            │
  │  │  A > B > C > D     │     │  score = f(prompt, │            │
  │  │  (~33K comparisons)│     │  response)        │            │
  │  └───────────────────┘     └────────┬──────────┘            │
  │                                      │                       │
  │  STAGE 3: RL Optimization (PPO)      ▼                       │
  │  ┌───────────────────────────────────────────┐              │
  │  │  Model generates response                 │              │
  │  │       │                                   │              │
  │  │       ▼                                   │              │
  │  │  Reward model scores it                   │              │
  │  │       │                                   │              │
  │  │       ▼                                   │              │
  │  │  PPO updates model weights                │              │
  │  │  (+ KL penalty to stay close to SFT)      │              │
  │  └───────────────────────────────────────────┘              │
  │                                                              │
  │  Result: 1.3B InstructGPT preferred over 175B GPT-3!        │
  └──────────────────────────────────────────────────────────────┘
```
*Figure: The RLHF pipeline that became the industry standard. Stage 1 teaches the model what good responses look like, Stage 2 trains a reward model on human preferences, and Stage 3 uses RL to optimize the model against that reward model.*

### Stage 1: Supervised Fine-Tuning (SFT)

The process began with human labelers (a team of approximately 40 contractors) writing demonstrations of desired model behavior. Given prompts submitted to the OpenAI API, labelers wrote ideal responses — helpful, honest, and harmless completions. The base GPT-3 model was then fine-tuned on these demonstrations using standard supervised learning. This SFT model was already significantly better than base GPT-3 at following instructions, but it was limited by the relatively small number of demonstrations (approximately 13,000 training examples).

### Stage 2: Reward Model Training

Human labelers were shown multiple outputs from the SFT model for each prompt and asked to rank them from best to worst. These rankings were used to train a reward model (RM) — a separate neural network that takes a prompt and response as input and outputs a scalar score predicting how much a human would prefer that response. The reward model was trained on approximately 33,000 comparison examples. Critically, it was cheaper to collect comparisons than demonstrations: labelers found it easier to say "A is better than B" than to write ideal responses from scratch.

### Stage 3: PPO Reinforcement Learning

The SFT model was then further trained using Proximal Policy Optimization (PPO), a reinforcement learning algorithm. The reward model served as the "environment": the model generated responses, the reward model scored them, and PPO updated the model's weights to maximize the expected reward. A critical detail was the KL divergence penalty — the PPO objective included a term that penalized the model for deviating too far from the original SFT model, preventing "reward hacking" (gaming the reward model in ways that produce high scores but poor actual quality).

### The PPO-ptx Variant

OpenAI found that pure RL training caused the model to lose some of its general capabilities — a phenomenon called "alignment tax." To mitigate this, they introduced PPO-ptx, which mixed the RL objective with a small proportion of the original pre-training objective (next-token prediction on web text). This maintained the model's general knowledge while steering its behavior toward human preferences. The PPO-ptx variant showed minimal regression on NLP benchmarks while maintaining the alignment gains.

## Why It Matters

### Alignment Over Scale

The most stunning finding was quantitative: human raters preferred outputs from the 1.3B InstructGPT over the 175B GPT-3, despite the 100x+ size difference. This was a paradigm-shifting result. The scaling era had been defined by the assumption that bigger = better. InstructGPT showed that how you train matters as much as how big you build. A well-aligned small model beats a misaligned large one. This insight redirected billions of dollars of research investment toward alignment and post-training techniques.

### The Industry Standard

The three-stage RLHF pipeline (SFT -> Reward Model -> PPO) became the standard recipe for virtually every major chatbot and AI assistant that followed. ChatGPT, Claude, Gemini, and LLaMA 2's chat variants all used some form of this pipeline. While the specific RL algorithm evolved (with DPO later offering a simpler alternative), the fundamental approach of training on human preferences remained universal. InstructGPT did not just solve a problem — it defined the solution template.

### Redefining What "Good" Means

Before InstructGPT, language models were evaluated primarily on NLP benchmarks — accuracy on question answering, reading comprehension, and similar tasks. InstructGPT introduced a fundamentally different evaluation criterion: human preference. The question shifted from "does the model get the right answer?" to "does the model produce outputs that humans find helpful, honest, and harmless?" This reframing influenced every aspect of model development, from data collection to evaluation to deployment.

## Key Technical Details

- **Published**: March 2022 by Ouyang et al. at OpenAI
- **Base model**: GPT-3 (1.3B and 6B variants primarily; 175B also tested)
- **SFT training data**: ~13,000 human-written demonstrations
- **RM training data**: ~33,000 human preference comparisons
- **Key result**: 1.3B InstructGPT preferred over 175B GPT-3 by human raters
- **Labelers**: ~40 contractors, carefully selected and trained
- **RL algorithm**: Proximal Policy Optimization (PPO) with KL penalty
- **PPO-ptx**: Mixed RL + pre-training objectives to preserve general capabilities
- **Alignment tax**: Minimal NLP benchmark regression with PPO-ptx

## Common Misconceptions

- **"RLHF was invented for InstructGPT."** The concept of learning from human preferences dates to work by Christiano et al. (2017) and earlier. InstructGPT's contribution was scaling it to large language models and demonstrating its effectiveness for alignment.

- **"InstructGPT learns new knowledge from RLHF."** RLHF steers the model's existing knowledge toward desired behaviors. The model does not gain new factual information through the RLHF process — it learns which of its existing capabilities to surface and how to present them.

- **"The reward model perfectly captures human preferences."** Reward models are imperfect approximations. They can be "gamed" by models that find responses that score highly on the reward model but are not actually preferred by humans (reward hacking). The KL penalty partially addresses this, but reward model limitations remain an active research problem.

- **"RLHF makes models safe."** RLHF makes models more aligned with the preferences of the specific human labelers used in training. Whether this translates to genuine safety depends on the diversity and quality of the labelers, the distribution of training prompts, and many other factors. RLHF is a tool for alignment, not a guarantee of safety.

- **"PPO is the only RL algorithm that works for RLHF."** PPO was the first to be widely used, but later work showed that DPO, REINFORCE variants, and other algorithms can achieve similar or better results with less complexity. PPO's dominance was partly a matter of precedent.

## Connections to Other Concepts

- `01-gpt-3.md` — InstructGPT was applied to GPT-3, demonstrating alignment could transform its usefulness
- `02-chatgpt.md` — ChatGPT used the same RLHF pipeline with conversational fine-tuning
- `03-constitutional-ai.md` — Anthropic's alternative approach that reduces reliance on human labelers
- `04-direct-preference-optimization.md` — DPO simplified the RLHF pipeline by eliminating the separate reward model
- `05-instruction-tuning-and-flan.md` — Instruction tuning (Stage 1) was developed in parallel by Google
- `03-llama-2.md` — LLaMA 2 used RLHF with rejection sampling, extending InstructGPT's approach
- `08-the-scaling-hypothesis-debate.md` — InstructGPT challenged the "scale is all you need" thesis

## Further Reading

- Ouyang et al., "Training language models to follow instructions with human feedback" (2022) — The InstructGPT paper.
- Christiano et al., "Deep reinforcement learning from human preferences" (2017) — The foundational work on learning from human feedback.
- Stiennon et al., "Learning to summarize with human feedback" (2020) — OpenAI's earlier application of RLHF to summarization.
- Bai et al., "Training a Helpful and Harmless Assistant from Human Feedback" (2022) — Anthropic's parallel RLHF work.
- Schulman et al., "Proximal Policy Optimization Algorithms" (2017) — The PPO algorithm paper.
