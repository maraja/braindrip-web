# LLaMA 2

**One-Line Summary**: Meta's LLaMA 2 was the first truly commercially licensed open-weight language model, combining 2 trillion tokens of training with extensive RLHF alignment to narrow the gap between open and closed AI.

**Prerequisites**: `01-llama-1.md`, `01-instructgpt-and-rlhf.md`

## What Is LLaMA 2?

Imagine a company that inadvertently started a revolution. Their research prototype leaked, was modified by thousands of people, and spawned an entire ecosystem outside their control. Now the company faces a choice: try to shut it down, or lean into it and lead the movement officially. Meta chose the second path.

LLaMA 2 was Meta's deliberate, strategic embrace of open AI — not a research artifact that escaped, but a fully supported product released with a commercial license, safety documentation, and corporate partnerships.

Released in July 2023 by Hugo Touvron and an expanded Meta AI team, LLaMA 2 came in three sizes (7B, 13B, and 70B parameters) with both pre-trained and chat-aligned variants. The headline was the license: for the first time, a frontier-quality open-weight model could be used commercially by businesses, startups, and developers without restriction (for organizations under 700 million monthly active users).

Meta partnered with Microsoft to distribute the models through Azure, and with Hugging Face for community access. The message was clear — Meta was betting that open models would become the industry standard, and it intended to be the default choice.

## How It Works

### Scaling Up Pre-Training

LLaMA 2 was trained on 2 trillion tokens — a 40% increase over LLaMA 1's 1.0-1.4 trillion. The training corpus was drawn from publicly available sources, though Meta did not disclose the exact mixture.

The architecture retained LLaMA 1's core design (decoder-only Transformer with RMSNorm, SwiGLU, and RoPE) but with a critical change: the context window doubled from 2,048 to 4,096 tokens, enabling the model to process longer documents and multi-turn conversations.

The 70B model used Grouped-Query Attention (GQA) with 8 key-value heads instead of the standard multi-head attention, reducing memory requirements during inference by approximately 30% while maintaining quality. The 7B and 13B models retained standard multi-head attention.

**LLaMA 2 Chat alignment pipeline with dual reward models:**

```
┌────────────┐     ┌────────────────┐     ┌─────────────────────────────┐
│  LLaMA 2   │────▶│  Supervised    │────▶│  RLHF with Dual Rewards    │
│  Base       │     │  Fine-Tuning   │     │                             │
│  (2T tokens)│     │  (SFT on       │     │  ┌───────────┐ ┌─────────┐ │
└────────────┘     │  dialogue)     │     │  │Helpfulness│ │ Safety  │ │
                    └────────────────┘     │  │  Reward   │ │ Reward  │ │
                                           │  │  Model    │ │ Model   │ │
                                           │  └─────┬─────┘ └────┬────┘ │
                                           │        └──────┬─────┘      │
                                           │               ▼            │
                                           │     ┌──────────────┐       │
                                           │     │ Rejection    │       │
                                           │     │ Sampling +   │       │
                                           │     │ PPO          │       │
                                           │     └──────────────┘       │
                                           └─────────────────────────────┘
                                                        │
                                                        ▼
                                           ┌─────────────────────────┐
                                           │  LLaMA 2 Chat           │
                                           │  + Ghost Attention      │
                                           │  (system prompt kept    │
                                           │   across all turns)     │
                                           └─────────────────────────┘
```

### RLHF Alignment Pipeline

The chat models underwent a multi-stage alignment process. First, supervised fine-tuning (SFT) on a curated set of high-quality dialogue examples produced a base conversational model.

Then, two separate reward models were trained — one for helpfulness and one for safety — using over 1 million human preference annotations. These reward models scored candidate responses, which were then used to optimize the chat model via Rejection Sampling and Proximal Policy Optimization (PPO).

The dual reward model approach allowed Meta to balance helpfulness and safety as separate, sometimes competing objectives. This was a meaningful methodological contribution: rather than collapsing both goals into a single reward signal, Meta could independently tune the trade-off between being maximally helpful and being maximally safe.

### Ghost Attention (GAtt)

One of LLaMA 2's most practical innovations was Ghost Attention, a technique to maintain system prompt adherence across multi-turn conversations.

In standard training, models tend to "forget" their system prompt instructions after several conversational turns, reverting to default behavior. GAtt addressed this by synthetically prepending the system prompt to each training example in a multi-turn dialogue and training the model to respect it throughout.

This was critical for deployment scenarios where businesses needed models to maintain a specific persona, follow safety guidelines, or stay within a defined role across extended conversations. Without GAtt, a model told to "only discuss cooking" might drift to other topics after a few turns.

### Safety and Red-Teaming

Meta invested heavily in safety for LLaMA 2 Chat. The safety RLHF training used adversarial prompts collected through extensive red-teaming exercises.

The team published a detailed responsible use guide, shared safety benchmarks, and was transparent about failure modes. The safety reward model was used during training to steer the model away from generating harmful, biased, or dangerous content.

This was a deliberate response to criticism of LLaMA 1's unguarded release and represented a new standard for safety documentation in open models. The 77-page technical report included detailed safety evaluations across categories including violence, criminal planning, hate speech, and regulated advice.

## Why It Matters

### The First Commercial Open-Weight Model

LLaMA 2's commercial license transformed the business landscape of AI. Before July 2023, companies building on open models faced legal uncertainty — LLaMA 1 was non-commercial, and its leaked status made any commercial use legally risky.

LLaMA 2 gave businesses explicit permission to build, deploy, and profit from products built on an open-weight foundation model. This triggered a wave of enterprise adoption and startup activity that had been bottled up by licensing concerns. Companies like Perplexity, Together AI, and Anyscale immediately integrated LLaMA 2 into their products.

### Meta's Open Strategy

LLaMA 2 crystallized Meta's strategic vision: that the AI industry would evolve like mobile, with an "Android" (open) and an "iOS" (closed) ecosystem. Meta bet on being the Android — the default open platform that everyone builds on.

By making its models freely available, Meta commoditized the model layer and positioned itself to benefit from the broader AI ecosystem. This was not altruism; it was a calculated strategy to prevent OpenAI and Google from establishing monopolistic control over AI infrastructure.

### Narrowing the Open-Closed Gap

LLaMA 2 70B Chat was competitive with early versions of GPT-3.5 Turbo on many tasks, and significantly closed the gap with closed-source models. While it remained clearly behind GPT-4, the gap was narrowing quarter by quarter.

This trajectory — open models consistently closing in on closed-model performance — became one of the defining dynamics of 2023-2024 and fueled debates about whether closed-source AI would retain any lasting advantage.

## Key Technical Details

- **Parameters**: 7B, 13B, 70B (three-model family)
- **Training tokens**: 2 trillion (40% more than LLaMA 1)
- **Context window**: 4,096 tokens (doubled from LLaMA 1's 2,048)
- **Architecture**: Decoder-only Transformer with RMSNorm, SwiGLU, RoPE; GQA in 70B model
- **Alignment**: SFT + RLHF with 1M+ human annotations, dual reward models (helpfulness + safety)
- **Ghost Attention**: Maintained system prompt adherence across multi-turn conversations
- **LLaMA 2 70B MMLU**: 68.9% (5-shot)
- **LLaMA 2 70B Chat human eval**: Preferred over ChatGPT (GPT-3.5) in 36% of head-to-head comparisons (tied 31.5%)
- **License**: Commercial use permitted (for organizations < 700M MAU)
- **Released**: July 18, 2023
- **Distribution**: Microsoft Azure, Hugging Face, Meta AI website
- **Safety**: Extensive red-teaming, 77-page technical report, responsible use guide

## Common Misconceptions

- **"LLaMA 2 is fully open-source."** LLaMA 2 is open-weight, not open-source. The model weights are freely available, but the training code, data, and infrastructure details are proprietary. You can use the model but cannot fully reproduce its training.

- **"LLaMA 2 matched GPT-4."** LLaMA 2 70B was competitive with early GPT-3.5 but remained significantly behind GPT-4 on reasoning, coding, and complex instruction-following. The gap was meaningful, even if it was narrower than before.

- **"The 700M MAU restriction was a dealbreaker."** The license restricted use by companies with over 700 million monthly active users (essentially Meta's competitors: Google, Apple, Amazon, Microsoft). For the vast majority of companies, startups, and developers, the license was effectively unrestricted.

- **"RLHF made LLaMA 2 Chat always safe."** Despite extensive safety training, LLaMA 2 Chat could still generate harmful content under adversarial prompting. RLHF reduced but did not eliminate safety risks, and the open release meant anyone could remove the safety fine-tuning entirely.

## Connections to Other Concepts

- `01-llama-1.md` — LLaMA 2 directly succeeded LLaMA 1 with more data, longer context, and commercial licensing
- `01-instructgpt-and-rlhf.md` — LLaMA 2 Chat applied OpenAI's RLHF alignment methodology to open models
- `02-the-alpaca-effect.md` — LLaMA 2 gave the fine-tuning community a legal, commercial-grade foundation
- `03-constitutional-ai.md` — Anthropic's alternative approach to the safety-helpfulness trade-off Meta addressed with dual reward models
- `05-llama-3-and-3-1.md` — The next generation, scaling to 405B parameters and 128K context
- `04-mistral-7b.md` — Mistral emerged as a competitor to LLaMA 2 at the 7B scale, outperforming it within months

## Further Reading

- Touvron et al., "Llama 2: Open Foundation and Fine-Tuned Chat Models" (2023) — The full 77-page technical report.
- Ouyang et al., "Training language models to follow instructions with human feedback" (2022) — The InstructGPT RLHF methodology adapted for LLaMA 2.
- Anil et al., "PaLM 2 Technical Report" (2023) — Contemporary comparison point for LLaMA 2's capabilities.
- Meta AI, "Llama 2: Responsible Use Guide" (2023) — Meta's safety documentation and deployment guidelines.
- Ainslie et al., "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints" (2023) — Grouped-Query Attention used in the LLaMA 2 70B model.
