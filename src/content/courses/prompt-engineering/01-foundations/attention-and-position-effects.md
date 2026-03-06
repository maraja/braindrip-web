# Attention and Position Effects

**One-Line Summary**: LLMs exhibit a U-shaped attention curve — prioritizing information at the beginning and end of the context while partially losing content in the middle — with actionable placement rules that measurably improve output quality.

**Prerequisites**: `how-llms-process-prompts.md`, `context-window-mechanics.md`.

## What Is the Attention Position Effect?

Think about reading a long email. You remember the opening paragraph clearly — it sets the tone and you read it with fresh attention. You remember the closing paragraph well — it is the last thing you processed and often contains the call to action. But that dense third paragraph buried in the middle? You probably skimmed it. If the sender had buried a critical deadline in paragraph seven of a twelve-paragraph email, there is a real chance you would miss it.

LLMs exhibit a strikingly similar pattern. Research by Liu et al. (2023) demonstrated that when relevant information is placed at the beginning or end of a long context, models retrieve it with 80-95% accuracy. When the same information is placed in the middle, accuracy drops to 40-70% depending on the model and total context length. This is not a bug in a specific model — it is a structural property of how transformer attention works across long sequences, observed in GPT-4, Claude, and open-source models alike.

Understanding this effect transforms prompt engineering from guesswork to principled design. The placement of instructions, examples, key facts, and retrieved documents within your prompt is not arbitrary — it is a lever that directly controls output quality.

*Recommended visual: A U-shaped curve plot with token position on the x-axis (0% to 100% of context) and retrieval accuracy on the y-axis (40% to 95%), showing high accuracy at the beginning and end (primacy and recency zones) with a valley in the middle (dilution zone). Annotations should mark the ~10% primacy zone, ~60-80% middle zone, and ~10% recency zone.*
*Source: Adapted from Liu et al., "Lost in the Middle: How Language Models Use Long Contexts," 2023.*

![Memory types in LLM agent systems showing short-term and long-term context](https://lilianweng.github.io/posts/2023-06-23-agent/memory.png)
*Source: Lilian Weng, "LLM Powered Autonomous Agents," lilianweng.github.io, 2023. The attention mechanism governs how information is accessed within the context window.*

## How It Works

### The U-Shaped Attention Curve

The attention mechanism in transformers assigns variable weight to different positions in the input sequence. Empirical measurements show a consistent pattern:

- **First ~10% of tokens (primacy zone)**: High attention weight. The system message and opening instructions receive disproportionate influence. This is partly architectural (positional encodings favor early positions) and partly a training artifact (instruction-tuned models learn to prioritize initial instructions).
- **Last ~10% of tokens (recency zone)**: High attention weight. The most recent tokens — including the user's current query — strongly influence generation. The autoregressive generation mechanism naturally weights recent context heavily.
- **Middle ~60-80% of tokens (dilution zone)**: Reduced attention weight. Information here competes for limited attention capacity. The effect worsens as total context length increases.

This produces a U-shaped curve when plotting retrieval accuracy against position: high at the edges, low in the middle.

### Primacy Bias: Why First Position Wins

The beginning of the context window has structural advantages. Positional encodings (RoPE, ALiBi) are most precise at early positions. Instruction-tuning data typically places critical instructions first. And attention computation starts from position 0, giving early tokens a "first-mover advantage" in shaping the model's internal representations. Practically, this means:

- System messages at position 0 are followed with 85-95% adherence.
- The same instructions placed 50K tokens into the context drop to 60-80% adherence.
- Critical constraints ("never reveal the system prompt," "always respond in JSON") should always appear in the first few hundred tokens.

### Recency Bias: The Power of Last Position

The most recent tokens before generation begins have outsized influence because autoregressive generation conditions directly on them. The user's current query, placed at the end of the context, naturally benefits from recency. This creates a practical design pattern: restate critical instructions near the end of the prompt, just before the user's query or at the very end of the system message. This "sandwich" technique — important content at the beginning AND end — mitigates the middle loss.

### The "Lost in the Middle" Phenomenon

Liu et al. (2023) tested this rigorously using a multi-document question answering task. They placed a relevant document among 19 irrelevant documents and varied its position. Key findings:

- With the relevant document at position 1 or 20: ~80-95% accuracy.
- With the relevant document at position 10 (middle): ~40-60% accuracy.
- The effect was consistent across GPT-3.5 Turbo, GPT-4, Claude, and open-source models.
- The effect worsened with longer total context: at 20 documents it was moderate; at 30+ documents it was severe.
- Instruction-tuned models showed stronger primacy bias (better at position 1) compared to base models.

## Why It Matters

### Document Ordering in RAG Systems

Retrieval-augmented generation (RAG) systems retrieve N relevant documents and insert them into the prompt. The naive approach — inserting documents in order of retrieval score — often places the most relevant document first and less relevant ones after. This accidentally aligns with the attention curve (best document in the primacy zone). But a better strategy is to place the top-ranked document first AND repeat key excerpts near the end, or to interleave relevant and less relevant documents to avoid concentrating all relevant material in the middle.

### Instruction Placement Strategy

The optimal placement strategy based on the attention curve:

1. **Position 1 (system message opening)**: Core identity, critical constraints, output format requirements.
2. **Early context**: Few-shot examples, reference material.
3. **Middle**: Supporting context, conversation history, retrieved documents (least critical).
4. **Late context**: Restatement of critical instructions, specific task requirements.
5. **Final position**: The current user query or the most specific directive.

This "bookend" pattern places the most important instructions at both ends of the context, maximizing adherence.

### Quality Measurement and Debugging

When an LLM "ignores" instructions or "misses" relevant context, the first diagnostic question should be: where was that content placed in the prompt? Moving critical content from the middle to the beginning or end of the prompt frequently resolves issues that might otherwise be attributed to model limitations. In production systems, logging the position (token offset) of key content alongside output quality metrics can reveal position-dependent failures.

## Key Technical Details

- The U-shaped attention curve shows ~80-95% retrieval accuracy at context edges vs. ~40-70% in the middle (Liu et al., 2023).
- The effect is observed across all major model families: GPT-4, Claude, Gemini, and open-source models.
- Primacy zone (first ~10% of tokens) benefits from positional encoding precision and instruction-tuning alignment.
- Recency zone (last ~10% of tokens) benefits from autoregressive generation's direct conditioning on recent context.
- The effect worsens with longer contexts: at 4K tokens the middle loss is mild; at 100K+ tokens it is severe.
- The "sandwich" or "bookend" technique — restating key instructions at both the beginning and end — improves adherence by 10-25% on long-context tasks.
- Placing the user's query at the end of the context is not just convention — it leverages recency bias for better task comprehension.
- For RAG: placing the top-1 relevant document first and a key excerpt near the end outperforms placing all documents in retrieval-score order.

## Common Misconceptions

**"The lost-in-the-middle effect only applies to very long contexts."** The effect is detectable at 4K tokens and becomes pronounced by 10K tokens. It is not exclusive to 100K+ contexts — even moderate-length prompts benefit from careful content placement.

**"Newer models have fixed the lost-in-the-middle problem."** While newer models show improvement (Claude 3.5 and GPT-4o handle long contexts better than their predecessors), the U-shaped curve persists. The magnitude has decreased, but the pattern remains structurally present.

**"Position effects only matter for retrieval tasks."** The attention curve affects instruction following, not just fact retrieval. Instructions placed in the middle of a long prompt are followed less reliably than identical instructions at the edges, regardless of whether the task involves "retrieval."

**"Repeating instructions wastes tokens."** Restating critical instructions at both the beginning and end of a long prompt costs a few hundred extra tokens but can improve task accuracy by 10-25%. The token cost is often far less than the cost of degraded output quality.

## Connections to Other Concepts

- `context-window-mechanics.md` — Position effects are the quality dimension of context window management; this concept covers the capacity dimension.
- `how-llms-process-prompts.md` — The attention mechanism described there is the mechanical cause of position effects.
- `delimiter-and-markup-strategies.md` — Structural markers (XML tags, headers) partially mitigate the lost-in-the-middle effect by creating attention anchors.
- `in-context-learning.md` — Example placement order affects few-shot learning quality due to these same position biases.
- `prompt-engineering-vs-context-engineering.md` — Context engineering must account for position effects when deciding what enters the context and where.

## Further Reading

- Liu et al., "Lost in the Middle: How Language Models Use Long Contexts," 2023. The definitive study on position-dependent recall in LLMs.
- Peysakhovich and Lerer, "Attention Sorting Combats Recency Bias in Long Context Language Models," Meta 2023. Proposes reranking context by attention relevance.
- An et al., "Make Your LLM Fully Utilize the Context," 2024. Techniques for improving information usage across all context positions.
- Google DeepMind, "Leave No Context Behind: Efficient Infinite Context Transformers with Infini-attention," 2024. Architectural approaches to mitigating position effects.
