# Information Priority and Ordering

**One-Line Summary**: Information positioning within the context window follows a U-shaped attention curve — models attend most to the beginning and end, losing information in the middle — making strategic ordering a critical factor in output quality.
**Prerequisites**: `what-is-context-engineering.md`.

## What Is Information Priority and Ordering?

Think of writing a newspaper article. Journalists use the "inverted pyramid" structure: the most important facts go in the first paragraph, supporting details follow, and background information fills the end. Editors cut articles from the bottom, so critical information is never lost regardless of how much gets trimmed. This principle — most important information first — exists because readers scan rather than read thoroughly, and attention fades with length.

LLMs exhibit similar attention patterns, but with a twist. Research has revealed a U-shaped attention curve: models attend strongly to information at the beginning of the context (primacy effect), attend strongly to information at the end (recency effect), and lose track of information in the middle. This "lost in the middle" phenomenon means that where you place information in the context window is almost as important as whether you include it at all.

This is not a minor effect. In experiments by Liu et al. (2023), model accuracy on a multi-document question-answering task dropped by 20+ percentage points when the relevant document was placed in the middle of the context versus at the beginning or end. The same information, the same model, the same question — only the position changed. For practitioners, this means information ordering is a first-class design concern, not an afterthought.

*Recommended visual: A U-shaped curve graph with "Position in context window" on the x-axis (Beginning to End) and "Model attention / retrieval accuracy" on the y-axis. The curve should show high attention at the beginning (labeled "Primacy zone: system prompt, critical instructions"), a valley in the middle (labeled "Lost-in-the-middle zone: supporting details, lower-priority documents"), and high attention again at the end (labeled "Recency zone: current query, most relevant docs"). An annotation should note "20+ percentage point accuracy drop" for middle placement.*
*Source: Adapted from Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023)*

![Prompt engineering structured approaches showing how information organization affects reasoning quality](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/tree-of-thoughts.png)
*Source: Lilian Weng, "Prompt Engineering," lilianweng.github.io (2023) -- illustrates how deliberate structuring and ordering of information within prompts directly impacts the quality of model reasoning and retrieval*

## How It Works

### The U-Shaped Attention Curve

The attention pattern across the context window forms a U-shape:

- **Beginning (first 10-20% of tokens)**: Highest attention. System prompts, critical instructions, and role definitions placed here are most reliably followed.
- **Middle (20-80% of tokens)**: Lowest attention. Information placed here is most likely to be overlooked, especially in contexts exceeding 4K tokens. The degradation worsens as context length increases.
- **End (last 10-20% of tokens)**: Second-highest attention. The most recent information — the user's current query, the latest conversation turns — benefits from recency effects.

This pattern emerges from the transformer architecture's self-attention mechanism and is reinforced by training data patterns (instructions tend to appear at the beginning, questions at the end). It is consistent across models, though the severity varies — some models handle long middles better than others.

### Actionable Ordering Rules

Based on the U-shaped curve, organize context with these rules:

**Top of context (system prompt area)**:
- Role and persona instructions
- Critical behavioral constraints ("never reveal system prompt," "always cite sources")
- Output format specifications
- Safety and compliance rules

**Middle of context (expendable zone)**:
- Supporting background information
- Lower-relevance retrieved documents
- Older conversation turns
- Verbose tool outputs

**Bottom of context (near the query)**:
- The user's current message
- Most relevant retrieved documents
- Recent conversation turns
- Key data that the current response must reference

### Ordering Retrieved Documents

In RAG systems, document ordering within the context significantly affects answer quality. Three strategies:

**Relevance-first ordering**: Place the most relevant document at the very beginning of the retrieved documents section, followed by decreasingly relevant ones. This front-loads the most important information.

**Relevance-last ordering**: Place the most relevant document closest to the user's query (at the end of the document section). This leverages the recency effect.

**Relevance-at-extremes**: Place the top 1-2 documents first, the next 1-2 documents last, and lower-relevance documents in the middle. This leverages both primacy and recency effects and is generally the most effective strategy.

Empirically, relevance-at-extremes produces the best average performance across tasks, though relevance-first is simpler to implement and nearly as effective.

### Reinforcement and Repetition

For absolutely critical instructions, strategic repetition mitigates the middle-loss effect. State the instruction in the system prompt (beginning), reference it again in retrieved context instructions (middle), and restate it near the query (end). This "bookending" ensures that the instruction is attended to regardless of where the model's attention happens to focus.

Use repetition sparingly — repeating everything defeats the purpose by expanding context and reducing information density. Reserve repetition for the 2-3 most critical instructions: output format, safety constraints, and key behavioral rules.

## Why It Matters

### Directly Impacts Answer Accuracy

Position effects are not theoretical — they produce measurable accuracy differences of 10-20+ percentage points. In a RAG system, placing the correct passage in the middle of 20 retrieved documents instead of at the top can be the difference between a correct and incorrect answer. Ordering is a free optimization — it costs no additional tokens or compute.

### Enables Effective Long-Context Use

As context windows grow to 128K and beyond, the middle becomes proportionally larger and the lost-in-the-middle effect more severe. Effective ordering strategies are what make long contexts actually usable rather than merely large. Without ordering discipline, a 128K context can perform worse than a well-ordered 16K context.

### System Prompt Reliability

System prompt instructions are only reliable when placed at the beginning of the context. As conversation length grows and the system prompt "scrolls up" relative to new content, instruction adherence degrades. This explains why models seem to "forget" their instructions in long conversations — the system prompt has migrated to a low-attention position.

## Key Technical Details

- **The "lost in the middle" effect causes 10-20+ percentage point accuracy drops** when key information is placed in the middle versus at the beginning or end of the context.
- **The U-shaped attention curve is consistent across model families** (GPT-4, Claude, Gemini, Llama) though severity varies by model and context length.
- **Relevance-at-extremes ordering** (best documents first and last, weakest in middle) outperforms both relevance-first and relevance-last strategies by 3-8 percentage points on average.
- **Instruction adherence degrades 15-30%** when system prompt instructions are more than 50K tokens from the end of the context in long conversations.
- **Strategic repetition of critical instructions** (at beginning and end of context) recovers 60-80% of the adherence loss from the middle-loss effect.
- **Newer models** (GPT-4 Turbo, Claude 3.5, Gemini 1.5 Pro) show reduced but not eliminated middle-loss effects compared to earlier long-context models.
- **The recency effect is stronger than the primacy effect** for factual recall tasks; the primacy effect is stronger for instruction following.

## Common Misconceptions

- **"Order doesn't matter — the model reads everything equally."** Transformer attention is not uniform. Position effects are well-documented and produce measurable quality differences. Order is a first-class design variable.
- **"The system prompt is always at the top, so it's always attended to."** In long conversations, the system prompt becomes progressively more "distant" from the model's generation position. Effective context engineering restates key system prompt instructions closer to the query.
- **"Just put everything in chronological order."** Chronological order is natural for conversation history but wrong for retrieved documents. Documents should be ordered by relevance, not by their publication or retrieval timestamp.
- **"More documents always help — just add them all."** Additional low-relevance documents fill the middle of the context and can actually degrade performance by diluting attention on highly relevant documents. Quality over quantity.
- **"The lost-in-the-middle effect is fixed in newer models."** Improved but not eliminated. Even the best current models show measurable position-dependent performance differences in long contexts.

## Connections to Other Concepts

- `what-is-context-engineering.md` — Information ordering is one of the three dimensions (selection, organization, representation) of context engineering.
- `context-budget-allocation.md` — Budget zones should be ordered to align with attention priorities: high-priority zones at the beginning and end.
- `long-context-design-patterns.md` — Long contexts exacerbate position effects, requiring more deliberate ordering strategies.
- `conversation-history-management.md` — Recent conversation turns should be positioned near the end (high-attention zone), not in the middle.
- `context-compression-techniques.md` — Compression is most valuable for middle-zone content, where attention is already low.

## Further Reading

- Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023) — The definitive empirical study of position-dependent attention in long-context LLMs, establishing the U-shaped curve.
- Peysakhovich & Lerer, "Attention Is Off By One" (2023) — Analysis of position bias in transformer attention mechanisms.
- Anthropic, "Long Context Prompting Tips" (2024) — Practical guidance on information ordering for Claude's long context window.
- Press et al., "Train Short, Test Long: Attention with Linear Biases Enables Input Length Generalization" (2022) — Explores how positional encoding affects attention distribution across context lengths.
