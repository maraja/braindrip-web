# OpenAI o1: Trained Reasoning

**One-Line Summary**: OpenAI o1 was the first model explicitly trained to reason through reinforcement learning on chain-of-thought, proving that thinking longer at inference time could dramatically improve performance on hard problems.

**Prerequisites**: `07-gpt-4.md`, `02-chatgpt.md`

## What Is OpenAI o1?

Imagine a student who has been taught not just facts, but how to think through problems step by step before writing down an answer. Previous language models were like students who blurted out the first thing that came to mind. OpenAI o1, released in preview on September 12, 2024, and fully on December 5, 2024, was the first model trained to pause, reason internally, and then respond. It represented a fundamental paradigm shift: rather than making models bigger or training them on more data, OpenAI made models smarter by teaching them to use more compute at inference time.

The motivation was clear. GPT-4 was remarkably capable but still struggled with multi-step reasoning, complex math, and scientific problems that required sustained logical chains. Chain-of-thought prompting helped, but it was a hack layered on top of a model that had not been trained to reason. The question OpenAI pursued was radical in its simplicity: what if, instead of prompting a model to think, you trained the thinking itself?

The result upended assumptions about how to build better AI. For years, the recipe had been straightforward: more parameters, more data, more training compute. o1 added a new ingredient to the recipe: more inference compute. A model that could think longer could solve harder problems, and the improvement was consistent and predictable. This single insight spawned an entire new paradigm of "reasoning models" that dominated AI research through 2025.

## How It Works

**o1's paradigm shift -- adding inference-time compute as a new scaling axis:**

```
Traditional Scaling (GPT-1 to GPT-4):
  Better AI = More training compute (one-time cost)

  Training ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ──▶  Fixed-quality model
  Inference ▓▓                                      Same speed for all queries

o1 Paradigm (New):
  Better AI = Training compute + Inference compute (per-query)

  Training ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ──▶  Model that can THINK
  Inference ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░       Variable depth per query

  Query ──▶ ┌─────────────────────────────────┐ ──▶ Answer
            │  Hidden Chain-of-Thought        │
            │  "Let me break this down..."    │
            │  "Wait, that approach won't..." │
            │  "Let me try another way..."    │
            │  "I should verify step 3..."    │
            │  (100s-1000s of thinking tokens)│
            └─────────────────────────────────┘
  Easy question: short chain  ──▶ fast, cheap
  Hard question: long chain   ──▶ slow, expensive, MUCH better
```

### Reinforcement Learning on Chain-of-Thought

Unlike previous models fine-tuned with RLHF on human preferences for helpfulness and harmlessness, o1 was trained with reinforcement learning specifically to produce effective reasoning chains. The model learns a "reasoning policy" that determines how to break down problems, verify intermediate steps, try alternative approaches, and catch errors. This is not prompt engineering or few-shot examples; the reasoning behavior is baked into the model's weights through RL training.

The training process used reward signals derived from correctness: math problems had verifiable answers, coding problems had test cases, and science questions had ground truth. The model received positive reward for reasoning chains that led to correct answers and negative reward for chains that led to errors. Over millions of training steps, the model learned which reasoning strategies were effective and which were not.

### Hidden Chain-of-Thought

When o1 receives a query, it generates an internal chain-of-thought before producing a visible response. This hidden reasoning can span hundreds or thousands of tokens. The user sees only the final answer, though a summary of the reasoning is sometimes provided. OpenAI chose to hide the full chain-of-thought partly for competitive reasons and partly because the raw reasoning traces could be messy, non-linear, and confusing to users.

The hidden chain-of-thought is not just a verbose version of the final answer. It contains backtracking ("Wait, that approach won't work"), self-correction ("I made an error in step 3, let me redo"), and exploration of alternatives ("Let me try a different method"). These metacognitive behaviors emerged through RL training and are qualitatively different from what prompted chain-of-thought produces.

### Inference-Time Compute Scaling

The core insight behind o1 is that performance improves as the model is allowed to "think" longer. Given a harder problem, o1 will naturally produce a longer internal chain-of-thought, using more tokens and more compute. This creates a new scaling dimension: instead of only scaling training (bigger models, more data), you can scale inference (more thinking per query). OpenAI demonstrated consistent log-linear improvements on benchmarks as inference compute increased.

This insight had profound economic implications. Training happens once and is amortized across all users. Inference happens every time someone asks a question, making it a recurring cost. By shifting capability gains to inference time, o1 created a new economic model where harder problems cost more to solve, enabling quality-cost tradeoffs that were impossible with fixed-capability models.

### Deliberative Alignment

o1 introduced "deliberative alignment," where the model actively reasons about its safety policies during its hidden chain-of-thought. Rather than relying solely on trained instincts to refuse harmful requests, o1 can think through whether a request violates its guidelines, consider edge cases, and make nuanced decisions. This made the model more robust against jailbreaks and more consistent in its safety behavior.

In practice, when o1 encounters an ambiguous request, its internal reasoning might include thoughts like "The user is asking about X, which could be used for Y harmful purpose, but the context suggests they want Z benign application. According to my guidelines, this falls under acceptable use." This explicit policy reasoning represented a significant advance over the implicit safety behaviors of earlier models.

The safety implications extended beyond individual requests. By making safety reasoning explicit and auditable (at least internally), deliberative alignment created a foundation for more trustworthy AI systems. Safety researchers could study the model's policy reasoning, identify failure patterns, and improve the safety guidelines in a way that was not possible when safety was purely an implicit property of the model's weights. OpenAI's safety team reported that o1 was significantly more robust against jailbreak attempts than GPT-4o, specifically because it could reason about whether a clever prompt was trying to circumvent its guidelines.

## Why It Matters

o1 marked the beginning of the "reasoning era" in AI. Before o1, the primary lever for improving AI was scaling up training: more parameters, more data, more compute during the training phase. o1 demonstrated a second lever: scaling inference compute. Training happens once, but inference happens millions of times per day. By shifting capability gains to inference time, OpenAI opened a new frontier where performance could be dynamically adjusted per query.

The model also proved that certain capabilities previously thought to require enormous scale could emerge from better training methods. o1 achieved PhD-level performance on science benchmarks not because it was dramatically larger than GPT-4, but because it was trained to think. This challenged the prevailing "bigger is better" narrative and suggested that training methodology mattered as much as raw scale.

The competitive impact was immediate. Within four months of o1's release, DeepSeek had released R1 (an open-weight reasoning model matching o1), Anthropic had released Claude 3.7 Sonnet (a hybrid thinking model), and Google was developing Gemini reasoning variants. o1 did not just create a product; it created a paradigm that the entire industry scrambled to adopt.

For researchers, o1 opened new questions about the nature of reasoning in neural networks. How much of the reasoning was genuine logical inference versus sophisticated pattern matching? Could reasoning capabilities transfer to domains without verifiable answers? Was there a ceiling to inference-time scaling? These questions would drive an active research program through 2025 and beyond.

## Key Technical Details

- Released: September 12, 2024 (o1-preview), December 5, 2024 (full o1)
- 89th percentile on Codeforces competitive programming
- 83rd percentile on AMC qualifier examinations
- GPQA Diamond (graduate-level science): 78.0% (vs GPT-4o's 53.6%)
- MATH benchmark: 94.8% (vs GPT-4o's 60.3%)
- SWE-bench Verified: 48.9% (o1-preview)
- International Mathematics Olympiad qualifying problems: gold medal level
- Pricing: $15/million input tokens, $60/million output tokens
- GPT-4o pricing for comparison: $2.50/$10 per million tokens
- Cost ratio: o1 output was 6x more expensive than GPT-4o output per token
- Hidden chain-of-thought: hundreds to thousands of tokens per response
- Typical reasoning overhead: 5-50x more tokens generated per response compared to GPT-4o
- Training methodology: largely undisclosed by OpenAI; rumored to use a custom RL algorithm
- Latency: seconds to minutes depending on problem complexity
- Initial limitations (o1-preview): no image input, no tool use, no streaming
- Full o1 additions: vision, function calling, structured outputs, developer messages
- Available via API and ChatGPT Pro ($200/month subscription)
- Safety: deliberative alignment reduced successful jailbreak rate significantly vs GPT-4o
- Architecture details: undisclosed; rumored to be based on GPT-4 family with RL modifications
- Context window: 128K tokens input, 65K tokens output (including hidden reasoning)

## Common Misconceptions

- **"o1 is just doing chain-of-thought prompting internally."** While o1 does produce reasoning chains, the key difference is that this behavior was trained via reinforcement learning, not simply elicited through prompting. The model has learned when and how to reason, which approaches to try, and when to backtrack. A prompted model is improvising; o1 has practiced. The distinction is analogous to the difference between asking someone to sight-read a piano piece versus having them perform one they have rehearsed extensively.

- **"o1 is better than GPT-4o at everything."** o1 excels at reasoning-heavy tasks like math, science, and competitive programming, but it can be slower, more expensive, and sometimes worse at simple tasks where quick responses suffice. For creative writing, casual conversation, or straightforward factual queries, GPT-4o often produces better results faster and cheaper. o1 is a specialist in deep thinking, not a universal upgrade.

- **"The hidden chain-of-thought means we can't trust the model's reasoning."** While the full chain is hidden from end users, OpenAI monitors it internally for safety and quality. The deliberative alignment approach actually makes safety reasoning more transparent to auditors, even if users see only summaries. The debate about whether chains should be visible is ongoing, with transparency advocates pushing for full disclosure and OpenAI citing competitive and usability concerns.

- **"o1 made GPT-4 obsolete."** GPT-4 and GPT-4o remained the recommended models for the majority of use cases throughout 2024 and into 2025. The o-series was positioned as a premium tier for problems that genuinely required deep reasoning. Most real-world AI applications do not need multi-minute reasoning chains.

## Connections to Other Concepts

The o1 model spawned an entire family documented in `02-the-o-series-evolution.md`, evolving through o3, o3-mini, and o4-mini with dramatic efficiency gains. DeepSeek replicated and extended the trained reasoning approach with open weights in `03-deepseek-r1.md`. The theoretical foundations of inference-time scaling are explored in `04-test-time-compute-scaling.md`. The broader shift from prompting tricks to trained reasoning capabilities is chronicled in `05-the-reasoning-paradigm-shift.md`. Hybrid models that make reasoning optional are covered in `06-hybrid-thinking-models.md`. For understanding the RLHF training foundation that o1 built upon, see `01-instructgpt-and-rlhf.md`.

## Further Reading

- OpenAI, "Learning to Reason with LLMs" (2024) — the blog post announcing o1 and the reasoning paradigm.
- OpenAI, "OpenAI o1 System Card" (2024) — safety evaluation and deliberative alignment details.
- Snell et al., "Scaling LLM Test-Time Compute Optimally Can be More Effective than Scaling Model Parameters" (2024) — theoretical framework for inference-time scaling.
- Wei et al., "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (2022) — the prompting precursor to trained reasoning.
- Lightman et al., "Let's Verify Step by Step" (2023) — process reward models that informed o1's step-level reasoning verification.
- Cobbe et al., "Training Verifiers to Solve Math Word Problems" (2021) — early work on using verifiers to improve reasoning.
- Uesato et al., "Solving Math Word Problems with Process- and Outcome-Based Feedback" (2022) — process vs outcome reward for mathematical reasoning.
- Silver et al., "Mastering the Game of Go with Deep Neural Networks and Tree Search" (2016) — the AlphaGo precedent for combining neural networks with search, a conceptual ancestor of reasoning models.
- Nye et al., "Show Your Work: Scratchpads for Intermediate Computation with Language Models" (2021) — early exploration of scratchpad-based reasoning in language models.
- Wang et al., "Self-Consistency Improves Chain of Thought Reasoning in Language Models" (2023) — the inference-time scaling technique of sampling multiple reasoning paths.
