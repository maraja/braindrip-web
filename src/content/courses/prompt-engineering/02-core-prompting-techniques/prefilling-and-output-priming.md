# Prefilling and Output Priming

**One-Line Summary**: Prefilling starts the assistant's response with predetermined text — such as `{` for JSON or `Step 1:` for structured reasoning — exploiting the autoregressive generation mechanism to dramatically improve output format compliance and quality.

**Prerequisites**: `how-llms-process-prompts.md`, `temperature-and-sampling.md`, `mental-models-for-prompting.md`.

## What Is Prefilling and Output Priming?

Imagine filling in the first line of a form to set the expected format. If someone hands you a blank page and says "write about your experience," the response could take any form — a paragraph, a list, a poem, a single sentence. But if the page already has "1." printed at the top, you immediately understand: this is a numbered list. You continue with your first point and naturally add "2." for the next. The printed "1." cost almost nothing but completely determined the output format.

Prefilling (also called output priming or assistant prefill) works the same way for LLMs. Instead of hoping the model will produce the right output format based on instructions alone, you start the model's response with a few predetermined tokens that set the trajectory. If you want JSON, you begin the response with `{`. If you want Python code, you begin with ` ```python\n`. If you want structured reasoning, you begin with `Step 1:`. The model, being an autoregressive completion engine, continues from where you started — and the starting point constrains everything that follows.

This technique exploits the most fundamental property of LLMs: each token is generated conditional on all previous tokens. By controlling the first few output tokens, you control the trajectory of the entire generation. It is arguably the highest-ROI prompt engineering technique relative to its simplicity — a few tokens of prefill can improve format compliance from ~70% to 95%+ for structured outputs.

*Recommended visual: A before-and-after diagram showing model output without prefilling (preamble text like "Sure, here's the JSON..." followed by the actual JSON) versus with prefilling (response starts directly with "{" and produces clean JSON), with format compliance percentages annotated: ~70-85% without prefill vs. ~95-99% with prefill.*
*Source: Adapted from Anthropic's "Prefill Claude's Response" documentation, 2024.*

*Recommended visual: A catalog of common prefill patterns showing 5-6 examples in a grid: JSON prefill ({"result":), Code prefill (```python\ndef), Reasoning prefill (Step 1:), Classification prefill (Category:), XML prefill (<response>), with each annotated with the output behavior it triggers.*
*Source: Adapted from Willison, "Prompt Engineering Techniques: Prefilling," 2024.*

## How It Works

### API Mechanics

Prefilling is implemented differently across providers:

**Anthropic (Claude)**: The Messages API supports an `assistant` turn in the message history. You include a partial assistant message as the last item:

```json
{
  "messages": [
    {"role": "user", "content": "Extract the name and email from this text: ..."},
    {"role": "assistant", "content": "{\"name\": \""}
  ]
}
```

Claude continues generation from `{"name": "` — guaranteeing the output starts as JSON with the expected first key.

**OpenAI (GPT-4)**: Does not natively support assistant prefill in the same way. Workarounds include:
- Using a fake assistant message in the conversation history.
- Using the `logit_bias` parameter to boost tokens like `{` at position 0.
- Using structured output mode (JSON mode), which achieves a similar effect through a different mechanism.

**Open-source models (via vLLM, Ollama)**: Most serving frameworks support prefill by including it in the raw prompt string before the generation start point.

### Common Prefill Patterns

Different output formats benefit from different prefills:

**JSON output**:
```
Prefill: {"
```
The model generates valid JSON from this starting point. For complex schemas:
```
Prefill: {"analysis": {"sentiment": "
```
This constrains both the structure and the first field.

**Code output**:
```
Prefill: ```python
def
```
Forces Python code generation starting with a function definition.

**Structured reasoning**:
```
Prefill: Let me analyze this step by step.

Step 1:
```
Triggers chain-of-thought reasoning with numbered steps.

**Classification**:
```
Prefill: Category:
```
Forces a direct classification output without preamble or hedging.

**XML-structured output**:
```
Prefill: <response>
<summary>
```
Guarantees XML structure from the first token.

### Combining with Constrained Decoding

Some serving frameworks support constrained decoding (also called guided generation), which restricts the model's vocabulary at each generation step to tokens that maintain validity of a specified grammar (JSON schema, regex pattern, etc.). When combined with prefilling:

- **Prefill** sets the starting trajectory.
- **Constrained decoding** ensures every subsequent token maintains structural validity.

Together, they achieve near-100% format compliance for structured outputs. Tools like Outlines (for open-source models) and OpenAI's structured output mode implement forms of constrained decoding.

### Prefill Length and Specificity

The optimal prefill length depends on the task:

- **1-3 tokens** (`{`, `[`, `Step`): Sufficient for format constraints. Minimal cost.
- **5-20 tokens** (`{"name": "`, `## Summary\n\n`): Sets both format and initial content direction. Good for structured extraction.
- **50-200 tokens**: Essentially starting the model's response for it. Useful when you need a specific opening paragraph or boilerplate. Risk: overly long prefills can constrain the model too much, reducing quality on content that requires model judgment.

The sweet spot for most applications is 3-20 tokens — enough to set format and trajectory without over-constraining content.

## Why It Matters

### Format Compliance in Production

For applications where model output is parsed by downstream code (JSON APIs, data pipelines, structured reports), format compliance is not optional — a malformed response breaks the pipeline. Without prefilling, format compliance for JSON output is approximately 70-85% depending on the model and prompt quality. With prefilling (`{`), compliance jumps to 95-99%. For production systems processing thousands of requests, this difference means the difference between a system that works and one that requires constant error handling and retries.

### Eliminating Preamble and Hedging

LLMs, especially instruction-tuned models, tend to add preamble ("Sure, I'd be happy to help! Here's the JSON you requested:") before the actual output. This preamble breaks parsers and wastes tokens. Prefilling eliminates it entirely — if the response starts with `{`, there is no room for preamble. This also reduces output token count by 20-50 tokens per response, saving cost at scale.

### Steering Reasoning Quality

Prefilling with reasoning scaffolds ("Step 1:", "First, let me identify the key variables:") does more than format the output — it changes the quality of reasoning. Models that begin with structured reasoning steps produce more accurate final answers than models that jump to the answer directly. Prefilling is a lightweight way to activate chain-of-thought reasoning without adding few-shot examples or lengthy instructions.

## Key Technical Details

- Anthropic's Claude API natively supports assistant prefill through partial assistant messages; OpenAI's API does not have direct equivalent but offers JSON mode and structured outputs.
- Prefilling `{` for JSON output improves format compliance from ~70-85% (instructions only) to ~95-99%.
- Prefilling eliminates model preamble, saving 20-50 tokens per response in typical conversational contexts.
- Optimal prefill length is 3-20 tokens for most applications; longer prefills risk over-constraining content.
- Prefilling with reasoning scaffolds ("Step 1:") improves reasoning task accuracy by 5-15%, similar to chain-of-thought but with lower prompt overhead.
- Constrained decoding (Outlines, OpenAI structured outputs) combined with prefilling achieves near-100% format compliance for schema-defined outputs.
- Prefilling works because LLMs are autoregressive: each token is conditioned on all previous tokens, including the prefilled ones.
- Token cost of prefilling is negligible (3-20 tokens), making it one of the highest-ROI prompt engineering techniques.

## Common Misconceptions

**"Prefilling is just a formatting trick."** Prefilling affects content quality, not just format. Starting with reasoning scaffolds ("Step 1:") activates different generation trajectories than starting with "The answer is:". The first few tokens influence the entire response — this is path dependence, not cosmetics.

**"All APIs support prefilling equally."** Anthropic's Claude has first-class prefilling support. OpenAI requires workarounds (JSON mode, fake assistant turns, logit bias). Open-source frameworks vary. Always check your provider's documentation for the recommended approach.

**"Prefilling guarantees valid output."** Prefilling with `{` makes JSON output much more likely but does not guarantee structural validity. The model can still produce malformed JSON (missing closing brackets, invalid escaping). For guaranteed validity, combine prefilling with constrained decoding or output validation and retry logic.

**"You should prefill as much as possible."** Over-prefilling constrains the model excessively. If you prefill 200 tokens of the response, you are writing the response yourself and using the model only for the remainder. The value of prefilling comes from setting the trajectory with minimal tokens, not from replacing model generation.

**"Prefilling only works for structured output."** Prefilling also works for controlling tone ("I'd be happy to" for friendly, "Based on the analysis," for formal), triggering reasoning ("Let me think through this carefully"), and preventing unwanted patterns ("The key finding is:" to prevent hedging).

## Connections to Other Concepts

- `how-llms-process-prompts.md` — Prefilling exploits the autoregressive generation mechanism described in the generation stage.
- `temperature-and-sampling.md` — Prefilling and temperature interact: prefilling constrains the starting trajectory, temperature controls diversity from that point forward.
- `mental-models-for-prompting.md` — Prefilling is the most direct application of the "completion engine" mental model.
- `delimiter-and-markup-strategies.md` — Prefilling with opening delimiters (XML tags, JSON brackets) combines output priming with structural formatting.
- `negative-prompting-and-constraints.md` — Prefilling is a positive alternative to negative constraints: instead of "do not include preamble," prefill past it.

## Further Reading

- Anthropic, "Prefill Claude's Response," Prompt Engineering Guide, 2024. Official documentation on using assistant prefill with Claude's API.
- Willison, "Prompt Engineering Techniques: Prefilling," 2024. Practical guide with examples across multiple providers.
- Guidance (Microsoft), "Constrained Generation," 2023. Framework documentation on combining prefilling with constrained decoding.
- Outlines (dottxt), "Structured Generation with LLMs," 2024. Open-source constrained decoding library that complements prefilling for guaranteed format compliance.
