# Negative Prompting and Constraints

**One-Line Summary**: Telling an LLM what NOT to do ("do not hallucinate") is systematically less effective than telling it what TO do ("only cite provided sources"), because negation is processed less reliably by attention mechanisms and can paradoxically increase the unwanted behavior.

**Prerequisites**: `instruction-prompting.md`, `how-llms-process-prompts.md`.

## What Is Negative Prompting?

Think about someone telling you "don't think about elephants." The moment you hear the instruction, you think about elephants. The concept must be activated in your mind in order to be suppressed — and the activation itself is the problem. Human psychology calls this "ironic process theory" (Wegner, 1987): trying to suppress a thought makes it more accessible, not less.

LLMs exhibit a strikingly similar pattern. When you write "Do not hallucinate facts," the model processes the tokens "hallucinate" and "facts" — activating the very concepts and patterns you want to suppress. The word "hallucinate" draws attention to the concept of generating ungrounded claims. The negation ("do not") is a modifier that the model processes less reliably than the concepts it modifies. The result: negative instructions are followed with 60-80% reliability, compared to 85-95% for equivalent positive instructions.

This is not a flaw unique to any specific model — it is a structural property of how transformer attention processes negation. Understanding this pattern transforms how you write constraints, moving from instinctive "don't do X" formulations to deliberate "always do Y" positive reframing that the model follows more reliably.

*Recommended visual: A bar chart comparing constraint adherence rates for negative instructions ("Do not hallucinate" at ~60-80%) versus their positive reframings ("Only cite provided sources" at ~85-95%), with a third bar showing the combined "positive first, negative second" stacking pattern at ~90-95%.*
*Source: Adapted from Jang et al., "Can Large Language Models Truly Understand Prompts? A Case Study with Negated Prompts," 2023.*

*Recommended visual: A two-column transformation table showing 5-6 common negative prompts on the left ("Do not hallucinate," "Do not be verbose," "Do not use jargon") with arrows pointing to their positive reframings on the right ("Only state facts from provided documents," "Respond in 3 sentences or fewer," "Use language a 12-year-old would understand"), visually illustrating the reframing pattern.*
*Source: Adapted from Anthropic's "Prompt Engineering Guide: Be Direct and Clear," 2024.*

## How It Works

### Why Negation Is Processed Unreliably

The attention mechanism in transformers assigns variable weight to tokens. When processing "Do not include personal opinions," the high-information tokens — "include," "personal," "opinions" — receive strong attention weights. The negation token "not" modifies the relationship but is a low-information, high-frequency word that the model encounters in thousands of different contexts during pretraining. The result:

- The model strongly activates the concept of "including personal opinions."
- The negation modifier is applied with variable reliability.
- Under attention pressure (long context, complex tasks), the negation is more likely to be dropped.
- The model may generate content that includes personal opinions while believing it is following the instruction.

This effect is stronger in longer contexts (where attention is distributed across more tokens) and with more abstract negations ("do not be verbose") compared to concrete ones ("do not exceed 100 words").

### The Positive Reframing Pattern

For every negative constraint, there is a positive reframing that specifies the desired behavior instead of the unwanted behavior:

| Negative (Less Effective) | Positive Reframing (More Effective) |
|---|---|
| "Do not hallucinate" | "Only state facts from the provided documents" |
| "Do not make up information" | "If unsure, say 'I don't have this information'" |
| "Do not be verbose" | "Respond in 3 sentences or fewer" |
| "Do not use technical jargon" | "Use language a 12-year-old would understand" |
| "Do not include your opinion" | "Only report findings from the data" |
| "Do not format as a list" | "Write in paragraph form" |
| "Don't start with 'I'" | "Begin your response with the key finding" |

The positive versions work better because they specify the target behavior directly, giving the model a clear generation target rather than a behavior to avoid.

### Exclusion Patterns That Work

Some negative instructions work better than others. Concrete, verifiable exclusions are followed more reliably:

**Effective exclusions** (concrete, verifiable):
- "Do not include any dates before 2020."
- "Exclude items priced above $100."
- "Do not mention competitor names: {list}."

These work because the exclusion criterion is objective and the model can evaluate it during generation. A token representing "2019" can be checked against the constraint "before 2020."

**Ineffective exclusions** (abstract, subjective):
- "Do not be biased."
- "Do not hallucinate."
- "Don't be repetitive."

These fail because the model cannot reliably evaluate the constraint during token-by-token generation. "Bias" and "hallucination" are emergent properties of generated text, not properties of individual tokens.

### Constraint Stacking Strategy

For critical constraints, combine positive specification with negative reinforcement as a secondary layer:

```
Primary (positive): Only use information from the provided document.
Cite the specific section for every claim you make.

Reinforcement (negative): Do not introduce facts, statistics, or claims
not found in the document.
```

This "positive first, negative second" pattern achieves higher adherence than either approach alone — approximately 90-95% compared to 85-90% for positive-only and 60-80% for negative-only. The positive instruction establishes the behavior; the negative instruction catches edge cases.

## Why It Matters

### Reducing Hallucination

Hallucination reduction is one of the highest-priority goals in production LLM systems. The naive approach ("do not hallucinate") is one of the least effective. Replacing it with positive grounding instructions ("only cite provided sources," "if unsure, state your uncertainty") combined with structural techniques (retrieval augmentation, source attribution requirements) produces measurably lower hallucination rates.

### Improving Constraint Adherence at Scale

In production, constraint violations are costly. A system that violates content policies 5% of the time may be unacceptable for regulated industries. Reframing constraints from negative to positive can move violation rates from 5-10% down to 1-3%. Combined with output validation, this reaches production-acceptable levels.

### Better Prompt Engineering Habits

Understanding the negation problem changes how you approach prompt design. Instead of starting with "what should the model NOT do" and writing a list of prohibitions, you start with "what should the model DO" and write a specification of desired behavior. This positive-specification mindset produces better prompts across all techniques, not just constraint writing.

## Key Technical Details

- Negative instructions are followed with ~60-80% reliability; equivalent positive instructions achieve ~85-95% reliability.
- The "positive first, negative second" stacking pattern achieves ~90-95% constraint adherence.
- Abstract negations ("don't be verbose") are less effective than concrete negations ("do not exceed 100 words") by approximately 15-25%.
- The negation reliability gap widens with context length: in short prompts (1K tokens), negative instructions work reasonably well; in long prompts (50K+ tokens), they degrade significantly.
- Exclusion lists with specific items ("do not mention: Apple, Google, Microsoft") are followed with ~90% reliability because the constraint is concrete and token-level.
- Negation of format instructions ("do not use bullet points") is more reliable (~85%) than negation of content instructions ("do not include opinions," ~65%) because format is more mechanically verifiable.
- Combining positive constraints with output validation catches the remaining 5-10% of violations that even positive instructions miss.
- The ironic process effect is stronger in smaller models (7B-13B) and weaker (but still present) in frontier models (GPT-4, Claude 3.5).

## Common Misconceptions

**"Negative instructions don't work at all."** Negative instructions do work — they are just less reliable than positive alternatives. For non-critical constraints, "do not include dates" is fine. For critical constraints (safety, compliance, factual accuracy), positive reframing is strongly recommended due to the reliability gap.

**"If I write 'DO NOT' in capitals, the model will follow it better."** Capitalization has minimal effect on instruction adherence. The issue is structural (how attention processes negation), not emphasis-related. Emphasis markers (capitals, bold, exclamation marks) improve adherence by at most 1-3%.

**"The solution is to repeat the negative instruction multiple times."** Repetition helps marginally (5-10% improvement), but repeating a positive instruction is more effective than repeating a negative one. Three repetitions of "Do not hallucinate" are less effective than one statement of "Only cite provided sources."

**"Positive reframing always says the same thing as the negative."** Not exactly. Positive reframing often reveals that the negative instruction was underspecified. "Do not hallucinate" could mean: cite sources, express uncertainty, refuse to answer, or flag low-confidence claims. The positive reframing forces you to specify which desired behavior you actually want, which is independently valuable for instruction clarity.

**"This is just a style preference — negative and positive mean the same thing to the model."** The processing difference is measurable. Negative instructions produce higher variance output and lower constraint adherence. This is an empirical finding, not a style recommendation.

## Connections to Other Concepts

- `instruction-prompting.md` — Positive constraint framing is a key principle of effective instruction design.
- `how-llms-process-prompts.md` — The attention mechanism's handling of negation tokens explains why negative instructions are unreliable.
- `role-and-persona-prompting.md` — Behavioral constraints within personas benefit from positive framing.
- `delimiter-and-markup-strategies.md` — Structurally separating constraints from other content using delimiters improves constraint visibility.
- `prefilling-and-output-priming.md` — Prefilling the output start (e.g., with a source citation) positively constrains behavior more effectively than prohibiting unsourced claims.

## Further Reading

- Wegner, "Ironic Processes of Mental Control," 1994. The psychological theory of thought suppression that parallels LLM negation processing.
- Jang et al., "Can Large Language Models Truly Understand Prompts? A Case Study with Negated Prompts," 2023. Empirical study of negation comprehension in LLMs.
- Anthropic, "Prompt Engineering Guide: Be Direct and Clear," 2024. Practical guidance on positive constraint framing for Claude.
- McKenzie et al., "Inverse Scaling: When Bigger Isn't Better," 2023. Documents cases where larger models perform worse on negation tasks, suggesting the issue persists across scales.
