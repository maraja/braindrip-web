# PaLM 2 and the Gemini Evolution

**One-Line Summary**: Google's journey from PaLM (540B dense, 2022) through PaLM 2 (Chinchilla-optimal, 2023) to Gemini 1.0 (2023) and Gemini 1.5 (MoE, 2024) traces the company's strategic pivot from "scale the biggest model" to "scale efficiently with MoE and long context."

**Prerequisites**: `07-gpt-4.md`, `03-chinchilla-and-compute-optimal-training.md`

## What Is the PaLM-to-Gemini Evolution?

Imagine a shipbuilding company that first builds the biggest battleship in the world, then realizes the future belongs to a fleet of faster, more fuel-efficient frigates. Google's model strategy followed exactly this trajectory. They started by building PaLM, the largest dense Transformer ever trained. Then they learned — partly from their own Chinchilla research — that brute-force scale was not the only path. PaLM 2 was smaller but smarter. Gemini 1.0 unified modalities. Gemini 1.5 introduced Mixture of Experts. Each step traded raw size for architectural sophistication.

The story begins in April 2022, when Google released PaLM (Pathways Language Model) — a 540 billion parameter dense Transformer that was the largest of its era. It achieved state-of-the-art results and showed striking emergent abilities, including chain-of-thought reasoning on math problems. But almost simultaneously, Google's own DeepMind division published the Chinchilla paper, which showed that PaLM was dramatically over-parameterized relative to its training data. The most efficient approach was to train smaller models on more data. This insight would reshape Google's entire model strategy.

PaLM 2 arrived in May 2023, designed from the ground up to apply Chinchilla-optimal training principles. Gemini 1.0 followed in December 2023 as Google's first natively multimodal model. And Gemini 1.5, released in February 2024, introduced the MoE architecture and million-token context that would become Google's primary competitive differentiators (see `02-gemini-1-5.md`). This four-model arc — PaLM to PaLM 2 to Gemini 1.0 to Gemini 1.5 — tells the story of the world's largest AI research organization finding its strategy.

## How It Works

**Google's model evolution -- from scale-first to efficiency-first:**

```
PaLM (Apr 2022)          PaLM 2 (May 2023)        Gemini 1.0 (Dec 2023)      Gemini 1.5 (Feb 2024)
┌──────────────┐         ┌──────────────┐          ┌──────────────┐           ┌──────────────┐
│   540B       │         │  ~340B       │          │  Ultra/Pro/  │           │  MoE         │
│   Dense      │         │  Dense       │          │  Nano        │           │  Architecture│
│   780B tok   │         │  3.6T tok    │          │  Natively    │           │  1M context  │
│              │         │  UL2 obj.    │          │  Multimodal  │           │  Pro = Ultra │
│   "Biggest   │         │  "Chinchilla │          │  "Google's   │           │  "Long ctx + │
│    model"    │         │   optimal"   │          │   GPT-4      │           │   efficient" │
│              │         │              │          │   answer"    │           │              │
└──────┬───────┘         └──────┬───────┘          └──────┬───────┘           └──────┬───────┘
       │   Chinchilla           │   Competitive           │   MoE wins             │
       │   shows over-          │   pressure               │                        │
       │   parameterized        │   from ChatGPT           │                        ▼
       └────────────────────────┴──────────────────────────┘              Google's differentiator:
                                                                          CONTEXT LENGTH + MoE
Strategy shift: Scale parameters ──────▶ Scale data ──────▶ Scale architecture efficiency
```

### PaLM (April 2022)

PaLM was a 540B parameter dense decoder-only Transformer, trained on 780 billion tokens across 6,144 TPU v4 chips using Google's Pathways system. The Pathways infrastructure was itself a major innovation: it allowed a single model to be trained across multiple TPU pods, enabling scales that were previously impractical. PaLM demonstrated breakthrough performance on reasoning tasks, particularly with chain-of-thought prompting, and showed "discontinuous" improvements at scale — capabilities that appeared to emerge suddenly as the model grew larger. It achieved state-of-the-art on 28 out of 29 widely used NLP benchmarks.

### PaLM 2 (May 2023)

PaLM 2 was Google's reset. While the exact parameter count was not officially disclosed, it is estimated at approximately 340 billion parameters — significantly smaller than PaLM's 540B. But it was trained on approximately 3.6 trillion tokens — nearly 5x PaLM's 780B tokens. This was textbook Chinchilla-optimal scaling: more data, fewer parameters, better efficiency.

The training innovations went beyond scale. PaLM 2 used a UL2 (Unified Language Learner) mixture of pre-training objectives rather than pure next-token prediction. This combined causal language modeling with prefix language modeling and span corruption — effectively teaching the model to both generate and understand text through multiple complementary tasks. The training data was also far more multilingual, covering over 100 languages with significant representation of non-English text. PaLM 2 powered Google's Bard chatbot, the early Gemini API, and numerous Google products.

### Gemini 1.0 (December 2023)

Gemini 1.0 represented Google's pivot to natively multimodal training. Released in three sizes — Ultra, Pro, and Nano — it was trained from the ground up on interleaved text, images, audio, and video data. Ultra was Google's answer to GPT-4, and Google claimed it was the first model to exceed human expert performance on MMLU (achieving 90.0% with chain-of-thought prompting). However, the launch was marred by a demo video controversy — a showcase video appeared to show real-time multimodal interaction that was actually heavily edited, damaging Google's credibility.

Gemini 1.0 Pro was deployed in Bard (later renamed Gemini), while Nano was designed for on-device deployment on Google's Pixel phones. The Ultra model, released separately in February 2024 as part of the "Gemini Advanced" subscription, demonstrated strong performance but faced stiff competition from the about-to-launch Claude 3 Opus and GPT-4 Turbo.

### Gemini 1.5 (February 2024)

Gemini 1.5 was the architectural turning point. By adopting Mixture of Experts, Google achieved Pro-level quality that matched the previous generation's Ultra — at significantly lower inference cost. The million-token context window became Google's signature differentiator (see `02-gemini-1-5.md` for full details). This was Google finding its competitive niche: rather than trying to beat OpenAI on general reasoning or Anthropic on safety, Google emphasized scale of context and multimodal breadth.

## Why It Matters

### The Chinchilla Pivot

The PaLM-to-PaLM 2 transition was one of the most visible applications of compute-optimal training in industry. Google took its own research seriously: Chinchilla showed that PaLM was over-parameterized, so PaLM 2 was smaller and trained on more data. This required organizational discipline — choosing to build a "smaller" model when the competitor (GPT-4) was likely bigger. The result validated the Chinchilla thesis and influenced every subsequent model's training data budget.

### From Catch-Up to Differentiation

Google spent 2023 in an uncomfortable position: the inventor of the Transformer was playing catch-up in the LLM race that Transformers had enabled. Gemini 1.0 was a credible response but not a clear winner. The pivot to MoE and long context in Gemini 1.5 was Google finding its strategic angle — not trying to win on the same axis as OpenAI and Anthropic, but redefining the competition around context length and multimodal breadth. This differentiation strategy would prove durable: through 2024 and 2025, Google consistently led on context window size.

### The Organizational Challenge

Google's model evolution also reveals the organizational challenges of AI development at a massive company. Google had the talent (the Transformer was invented there), the compute (TPU infrastructure), and the data (Search, YouTube, Gmail). But coordinating across Google Brain, DeepMind, and product teams slowed execution. The February 2023 merger of Google Brain and DeepMind into Google DeepMind was an organizational response to the competitive pressure from OpenAI's ChatGPT launch. The Gemini line was the first product of this merged organization.

## Key Technical Details

- **PaLM (Apr 2022)**: 540B dense, 780B tokens, 6,144 TPU v4 chips
- **PaLM 2 (May 2023)**: ~340B params (est.), 3.6T tokens, UL2 objectives, 100+ languages
- **Gemini 1.0 Ultra (Dec 2023)**: Natively multimodal, 90.0% MMLU (CoT), three sizes (Ultra/Pro/Nano)
- **Gemini 1.5 Pro (Feb 2024)**: MoE architecture, 1M token context, 99.7% needle-in-haystack
- **Google Brain + DeepMind merger**: February 2023
- **Training infrastructure**: Google TPU v4 and v5 pods
- **PaLM 2 multilingual**: Over 100 languages with significant non-English training data
- **Gemini 1.0 demo controversy**: December 2023, edited video misrepresented real-time capabilities

## Common Misconceptions

- **"Google was behind in AI because ChatGPT came from OpenAI."** Google had massive internal AI capabilities and had been deploying language models in Search, Gmail, and other products for years. They were behind in the consumer chatbot race, not in fundamental research.

- **"PaLM 2 was a step backward because it was smaller than PaLM."** Smaller parameter count with more training data produced a better model. This is the core Chinchilla insight — size without sufficient data is wasteful.

- **"Gemini 1.0 Ultra clearly beat GPT-4."** Google's MMLU claim of 90.0% used chain-of-thought prompting (CoT@32), which is not directly comparable to GPT-4's 5-shot result. The benchmarking methodology was contested, and independent evaluations showed mixed results.

- **"Google's advantage is just having more data."** While Google's data assets (Search, YouTube, Books) are enormous, data quality and training methodology matter as much as quantity. PaLM 2's UL2 objectives and careful multilingual data curation were at least as important as the raw data volume.

## Connections to Other Concepts

- `03-chinchilla-and-compute-optimal-training.md` — The Chinchilla paper that directly shaped PaLM 2's design philosophy
- `02-gemini-1-5.md` — Detailed coverage of the MoE architecture and million-token context
- `01-attention-is-all-you-need.md` — The Transformer paper that started at Google, making their catch-up especially notable
- `07-gpt-4.md` — The primary competitor that Google was responding to throughout this evolution
- `01-claude-3-family.md` — Launched weeks after Gemini 1.5, competing directly on benchmarks

## Further Reading

- Chowdhery et al., "PaLM: Scaling Language Modeling with Pathways" (2022) — The original 540B parameter PaLM paper.
- Google, "PaLM 2 Technical Report" (2023) — Details on Chinchilla-optimal training and multilingual capabilities.
- Gemini Team, "Gemini: A Family of Highly Capable Multimodal Models" (2023) — The Gemini 1.0 technical report.
- Tay et al., "UL2: Unifying Language Learning Paradigms" (2022) — The mixture-of-objectives approach used in PaLM 2's training.
- Google DeepMind, "Gemini 1.5: Unlocking multimodal understanding across millions of tokens of context" (2024) — The Gemini 1.5 technical report.
