# Claude 1 and 2

**One-Line Summary**: Anthropic's Claude models brought Constitutional AI from theory to product, establishing the "safety-first" brand in commercial AI and pioneering the long-context paradigm with 100K and eventually 200K token windows.

**Prerequisites**: `02-chatgpt.md`, `03-constitutional-ai.md`

## What Is Claude?

Imagine two competing airlines. One obsesses over speed — getting passengers to their destination as fast as possible, accepting turbulence and tight margins. The other obsesses over safety — not because it does not care about speed, but because it believes that the passengers who trust the safest airline will fly with them for decades.

Anthropic, the company behind Claude, took the second approach to AI. In a year when every lab raced to match ChatGPT's viral success, Anthropic built its brand on the premise that how you build AI matters as much as what it can do.

Anthropic was founded in 2021 by Dario Amodei, Daniela Amodei, and several other former OpenAI researchers who departed over disagreements about the pace and safety of AI development. The company's thesis was that the most powerful AI systems would also be the most dangerous, and that building safety into the training process — not bolting it on after the fact — was the only responsible path. Claude was the commercial embodiment of that thesis.

Claude 1 launched in March 2023, four months after ChatGPT. Claude 2 followed in July 2023 with a headline feature that no competitor could match: a 100,000-token context window. While GPT-4 processed roughly 8K-32K tokens and LLaMA 2 handled 4K, Claude 2 could ingest an entire novel, a full codebase, or hundreds of pages of legal documents in a single prompt.

This was not just a quantitative improvement — it enabled qualitatively new use cases that shorter-context models could not attempt.

## How It Works

**Claude's Constitutional AI alignment vs. standard RLHF:**

```
Standard RLHF (OpenAI approach):
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│  Model   │───▶│  Human       │───▶│  Reward      │───▶ RLHF
│  Output  │    │  Annotators  │    │  Model       │     Training
└──────────┘    │  rank pairs  │    └──────────────┘
                └──────────────┘

Constitutional AI (Anthropic approach):
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
│  Model   │───▶│  Self-       │───▶│  Revised     │───▶│  RLAIF   │
│  Output  │    │  Critique    │    │  Output      │    │  (AI     │
└──────────┘    │  against     │    │  (improved)  │    │  Feedback)│
                │  Constitution│    └──────────────┘    └──────────┘
                │  (HHH        │
                │  principles) │
                └──────────────┘

Constitution = "Be Helpful, Harmless, and Honest"
```

### Constitutional AI in Practice

Claude was the first commercial deployment of Constitutional AI (CAI), Anthropic's alignment methodology. Rather than relying solely on human preference ratings (as in OpenAI's RLHF approach), CAI trains the model to evaluate its own outputs against a set of explicit principles — a "constitution."

The training process has two phases. First, the model generates responses to potentially harmful prompts, then critiques and revises its own outputs according to the constitutional principles (the "self-critique" phase). Second, a preference model is trained on the revised outputs and used for reinforcement learning (RLHF from AI feedback, or RLAIF).

The constitution includes principles around being helpful, harmless, and honest — Anthropic's "HHH" framework. This approach was designed to scale better than pure human feedback, since AI-generated critiques could be produced far more cheaply than human annotations.

### The Context Length Revolution

Claude 2's 100K token context window (approximately 75,000 words) was a technical achievement that required careful engineering across multiple dimensions. Handling 100K tokens means the attention mechanism must process sequences where the KV cache alone can exceed available GPU memory.

The specific techniques Anthropic used were not publicly disclosed, but the approach likely involved a combination of efficient attention implementations (related to Flash Attention), careful memory management, and positional encoding schemes that generalize beyond training lengths.

Claude 2.1, released in November 2023, extended this to 200K tokens — roughly 150,000 words, or a 500-page book. At the time, this was by far the largest context window available in any commercial model.

### Tiered Model Strategy

Anthropic deployed a tiered model strategy throughout 2023:

- **Claude 1** (March 2023): Initial release, competitive with GPT-3.5
- **Claude 1.3** (mid-2023): Improved accuracy and instruction-following
- **Claude Instant** (2023): Smaller, faster, cheaper variant for high-volume use cases
- **Claude 2** (July 2023): Major upgrade with 100K context window
- **Claude 2.1** (November 2023): 200K context window, 50% fewer hallucinations

This tiering — offering models at different quality-cost-speed points — mirrored OpenAI's GPT-3.5/GPT-4 strategy and became the industry standard for AI providers. The Instant tier was particularly important for cost-sensitive applications where Claude 2's full capability was overkill.

### Reducing Hallucinations

Claude 2.1 introduced significant improvements in factual grounding. Anthropic reported a 50% reduction in hallucination rates compared to Claude 2.0 on internal benchmarks.

The model was more likely to say "I don't know" rather than confabulate, and performed better at citing relevant passages from documents provided in its context window. These improvements came from a combination of training data curation, RLHF focused on honesty, and techniques for improving the model's calibration — its ability to distinguish between what it knows and what it does not.

This emphasis on honesty over helpfulness was a deliberate philosophical choice that distinguished Claude from competitors who optimized more aggressively for user engagement.

## Why It Matters

### Establishing the Safety-First Brand

In a year dominated by capability races, Anthropic successfully differentiated on safety. Claude's refusals were sometimes frustrating to users — the model would decline requests that GPT-4 would handle — but this conservatism was deliberate.

Anthropic's bet was that as AI became more powerful, enterprises and governments would increasingly prefer the vendor that prioritized safety, even at the cost of some capability. By 2024, this bet appeared to be paying off: Anthropic secured partnerships with Amazon (up to $4 billion investment), Google ($2 billion), and multiple government agencies.

### Long Context as a Category

Claude 2's 100K context window was not just a feature — it created a new category of AI applications. Legal professionals could upload entire contracts for review. Developers could paste entire codebases for debugging. Researchers could submit full papers for summarization. Financial analysts could process complete earnings reports.

These use cases were impossible with 4K-8K context models and impractical even with 32K. The long-context paradigm pushed every competitor to extend their own windows: GPT-4 Turbo (128K), Gemini 1.5 (1M), and others followed. Claude was the catalyst that made long context a competitive requirement.

### The Closed-Source Safety Argument

Anthropic's decision to keep Claude closed-source (API-only, no weights released) was tied to its safety thesis. The argument was that releasing weights of a powerful model meant losing control over its deployment — anyone could remove safety training, fine-tune for harmful purposes, or deploy without safeguards.

This positioned Anthropic in direct philosophical opposition to Meta's open-weight approach, creating one of the defining debates of the era: is AI safety better served by openness (enabling community oversight) or closedness (enabling centralized control)? The debate remains unresolved, with compelling arguments on both sides.

## Key Technical Details

- **Claude 1**: Released March 2023, competitive with GPT-3.5, API-only
- **Claude 1.3**: Improved version, mid-2023
- **Claude Instant**: Smaller, faster, cheaper variant for high-volume applications
- **Claude 2**: Released July 2023, 100K token context window (~75,000 words)
- **Claude 2.1**: Released November 2023, 200K token context window, 50% fewer hallucinations
- **Alignment**: Constitutional AI (RLAIF) with HHH (Helpful, Harmless, Honest) principles
- **Anthropic founded**: 2021 by Dario Amodei, Daniela Amodei, and ex-OpenAI researchers
- **Anthropic funding (2023)**: $4B from Amazon, $2B from Google, $750M Series C, $450M Series B
- **Context comparison (mid-2023)**: Claude 2 100K vs. GPT-4 8K/32K vs. LLaMA 2 4K
- **Deployment**: API-only, no open weights; available via console, API, and AWS Bedrock
- **Key differentiator**: Long context + safety-first positioning

## Common Misconceptions

- **"Claude was just a ChatGPT clone."** Claude used fundamentally different alignment methodology (Constitutional AI vs. pure RLHF), had different safety-capability trade-offs, and pioneered long-context processing. The products served similar user needs but were technically and philosophically distinct.

- **"100K context means the model uses all 100K tokens equally well."** Early long-context models, including Claude 2, showed degraded attention to information in the middle of very long contexts (the "lost in the middle" phenomenon). Claude 2.1 improved on this, but context utilization was not perfectly uniform.

- **"Anthropic was anti-AI development."** Anthropic's thesis was not that AI should be slowed down but that it should be developed with safety as a first-class priority. The company actively competed at the frontier and pushed capabilities forward — it simply argued that safety and capability should advance together.

- **"Constitutional AI eliminates the need for human feedback."** CAI still uses human-written constitutions and human evaluation at various stages. It reduces but does not eliminate the human role in alignment, supplementing human preferences with principle-based self-critique.

## Connections to Other Concepts

- `03-constitutional-ai.md` — Claude was the commercial deployment of Anthropic's Constitutional AI research
- `02-chatgpt.md` — ChatGPT's success four months earlier created the market Claude entered
- `08-the-ai-arms-race-begins.md` — Claude's launch was part of the industry-wide race triggered by ChatGPT
- `07-long-context-techniques.md` — Claude pioneered the long-context paradigm that reshaped the industry
- `01-claude-3-family.md` — The next generation (March 2024) brought multimodality and the Haiku/Sonnet/Opus tiering
- `01-instructgpt-and-rlhf.md` — Constitutional AI was developed as an alternative to the pure RLHF approach used by OpenAI

## Further Reading

- Bai et al., "Constitutional AI: Harmlessness from AI Feedback" (2022) — The foundational CAI paper underlying Claude's alignment.
- Bai et al., "Training a Helpful and Harmless Assistant with Reinforcement Learning from Human Feedback" (2022) — Anthropic's earlier RLHF work informing Claude's training.
- Anthropic, "Model Card and Evaluations for Claude Models" (2023) — Documentation of Claude's capabilities and limitations.
- Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023) — Research on long-context utilization challenges relevant to Claude's architecture.
- Ganguli et al., "Red Teaming Language Models to Reduce Harms" (2022) — Anthropic's red-teaming methodology used for Claude's safety evaluation.
