# Constrained Decoding from the Prompt Perspective

**One-Line Summary**: Constrained decoding uses grammar-based filtering, regex constraints, and schema enforcement at the token level to guarantee structural output validity, complementing prompt-based format control.
**Prerequisites**: `json-mode-and-schema-enforcement.md`.

## What Is Constrained Decoding?

Think of guardrails on a bowling lane. Without them, a bowler might throw a gutter ball — the ball goes anywhere, including off the lane entirely. With guardrails, every throw stays on the lane and hits at least some pins. The bowler still chooses the angle and power, but the guardrails eliminate entire categories of failure. Constrained decoding works the same way for LLM output: the model still "chooses" what to say, but structural guardrails prevent it from producing syntactically invalid output.

In standard LLM generation, the model samples from its full vocabulary at each token position. Any token can follow any other token, which means the model can produce invalid JSON, nonexistent enum values, malformed dates, or any other structurally broken output. Constrained decoding modifies this process: at each step, a grammar or schema defines which tokens are valid continuations, and invalid tokens are masked out before sampling.

From a prompt engineer's perspective, constrained decoding is a complementary tool to prompt-based control. Prompts influence what the model wants to say; constraints control what it is allowed to say. Together, they produce output that is both semantically relevant (from the prompt) and structurally valid (from the constraint).

*Recommended visual: A token-level generation diagram showing two parallel paths: "Unconstrained generation" (full vocabulary available at each step, can produce invalid tokens, resulting in malformed JSON) versus "Constrained generation" (grammar mask applied at each step, invalid tokens grayed out, only valid continuations selectable), with the grammar tree for a simple JSON schema shown alongside.*
*Source: Adapted from Willard & Louf, "Efficient Guided Generation for Large Language Models" (2023)*

*Recommended visual: A Venn diagram showing two overlapping circles: "What the prompt controls" (semantic correctness, factual accuracy, relevance, completeness) and "What constraints control" (valid syntax, correct structure, valid enum values, format compliance), with the overlap region labeled "Both needed for reliable output" -- emphasizing that constraints and prompts are complementary, not substitutes.*
*Source: Adapted from Beurer-Kellner et al., "Prompting Is Programming (LMQL)" (2023) and Zheng et al., "SGLang" (2024)*

## How It Works

### Grammar-Based Filtering

The most general form of constrained decoding uses context-free grammars (CFGs) to define valid output. A JSON grammar specifies that output must start with `{` or `[`, keys must be quoted strings, values must be valid JSON types, and so on. At each token position, the grammar determines which tokens can legally appear next, and all other tokens are masked (their probabilities set to zero).

This is what powers JSON mode in major APIs. The grammar guarantees syntactic validity without any prompt engineering. The model is physically incapable of producing invalid syntax because invalid tokens are removed from the sampling distribution.

Grammar-based filtering extends beyond JSON. You can define grammars for XML, CSV, YAML, SQL, Python code, or any language with a formal grammar. The constraint operates at the structural level, ensuring the output is parseable regardless of content.

### Regex Constraints

For simpler structural requirements, regular expression constraints are more practical than full grammars. Want the output to be a date in ISO format? Constrain it to `\d{4}-\d{2}-\d{2}`. Want an email address? Use an email regex. Want one of three specific labels? Use `(positive|negative|neutral)`.

Regex constraints are particularly valuable for individual fields within a larger structured output. Even if the overall output uses JSON grammar constraints, specific field values can be further constrained with regex patterns for dates, phone numbers, URLs, or custom formats.

### Schema Enforcement at the Token Level

Schema enforcement combines grammar-based filtering with semantic constraints. A JSON Schema defines not just valid JSON syntax, but valid structure: required fields, allowed types, enum values, minimum/maximum values, and pattern constraints. The schema is converted into a grammar at runtime, and this grammar guides generation.

OpenAI's structured outputs, Outlines, and similar systems work this way. The schema `{"type": "string", "enum": ["low", "medium", "high"]}` is converted to a grammar that only allows the tokens forming "low", "medium", or "high" at that position. The model cannot produce "moderate" or "very high" — only the defined enum values are reachable.

### Tools and Frameworks

**Outlines** (Python): Open-source library that converts JSON schemas and regex patterns into token-level constraints for any HuggingFace model. The standard for self-hosted constrained decoding.

**LMQL** (Language Model Query Language): A programming language for LLM interaction that includes constraint specifications directly in the query. Write something like `"classify: [LABEL]" where LABEL in ["positive", "negative"]`.

**Guidance** (Microsoft): A template language that interleaves fixed text with constrained generation blocks. You write a template with holes, and the model fills the holes under specified constraints.

**API-level enforcement**: OpenAI's structured outputs and Anthropic's tool use provide server-side constrained decoding without requiring any local infrastructure.

### What Constraints Can and Cannot Guarantee

This is the critical distinction for practitioners:

**Constraints guarantee**: Valid syntax (parseable JSON, XML, etc.), correct structure (required fields present, correct types), valid enum values, format compliance (dates, emails, patterns), and output length bounds.

**Constraints cannot guarantee**: Semantic correctness (the extracted name is actually a name), factual accuracy (the date is the right date), logical consistency (the confidence score matches the reasoning), completeness (all relevant entities were found), or relevance (the output addresses the question).

Constrained decoding eliminates structural failure modes entirely while leaving semantic quality entirely to the prompt and model capability. A response can be perfectly valid JSON with completely hallucinated values.

## Why It Matters

### Eliminating Structural Failures

In production systems, structural output failures (malformed JSON, unexpected fields, invalid types) account for 5-15% of prompt-only LLM calls. Each failure requires error handling, retries, or fallbacks. Constrained decoding reduces structural failures to 0%, simplifying error handling and improving throughput.

### Reducing Retry Overhead

Without constraints, systems need validation-retry loops that add latency and cost. Each retry is another full API call. Constrained decoding eliminates retries for structural issues, providing both cost savings and predictable latency.

### Enabling Reliable Automation

Truly autonomous LLM pipelines — systems that run without human oversight — require absolute structural reliability. A pipeline that fails 5% of the time due to output format issues is not automatable; it needs monitoring and intervention. Constrained decoding provides the structural guarantees that make full automation feasible.

## Key Technical Details

- **Constrained decoding adds 5-15% latency overhead** due to grammar checking at each token position, though optimized implementations minimize this.
- **Outlines achieves 100% structural validity** for any JSON Schema that can be expressed as a context-free grammar.
- **LMQL supports Python-like constraint expressions** including type constraints, length bounds, and set membership.
- **Schema-to-grammar compilation** happens once at setup time; the grammar is then reused across all generations with that schema, making amortized overhead minimal.
- **Constrained decoding can reduce output diversity** because masking tokens reduces the sampling space. This is desirable for structured output but potentially harmful for creative tasks.
- **Token boundaries can cause issues**: a constrained value like "California" might span multiple tokens, and the grammar must track valid multi-token sequences correctly. Modern implementations handle this via token healing.
- **API-level constrained decoding** (OpenAI structured outputs) is the easiest to use but limits you to provider-supported constraint types. Self-hosted solutions (Outlines) offer more flexibility.

## Common Misconceptions

- **"Constrained decoding makes prompts unnecessary."** Constraints handle structure; prompts handle content. A constrained model will produce valid JSON with wrong values if the prompt does not specify what to extract. Both are needed.
- **"Constrained decoding always reduces output quality."** For structured output tasks (classification, extraction), quality is identical or improved because the model does not waste tokens on structural errors. For reasoning tasks, quality can decrease if the model cannot produce intermediate thinking tokens.
- **"Grammar constraints work with any output format."** Some formats are ambiguity-free and grammar-friendly (JSON, XML). Others have context-sensitive rules that are harder to express as CFGs (natural language with specific constraints). The technique works best for formal, well-defined formats.
- **"If it passes the constraint, it's correct."** This is the most dangerous misconception. Structural validity does not imply semantic correctness. Constrained decoding guarantees the "shape" of the output, not its "truth." Validation (structural) and evaluation (semantic) are separate concerns.
- **"Constrained decoding is only for JSON."** While JSON is the most common use case, constrained decoding works for any format with a formal grammar: XML, YAML, CSV, SQL, programming languages, and custom domain-specific formats.

## Connections to Other Concepts

- `json-mode-and-schema-enforcement.md` — JSON mode is the most common application of constrained decoding, implemented server-side by API providers.
- `classification-and-labeling-output.md` — Enum constraints in constrained decoding guarantee valid labels from the defined set.
- `extraction-and-parsing-prompts.md` — Constrained decoding ensures extracted field values conform to expected formats and types.
- `multi-step-output-pipelines.md` — Each pipeline step can use constrained decoding to guarantee parseability for the next step.
- `xml-and-tag-based-output.md` — XML grammars can be used for constrained decoding of tag-based output.

## Further Reading

- Willard & Louf, "Efficient Guided Generation for Large Language Models" (2023) — Foundational paper on Outlines, establishing the grammar-based constrained decoding approach.
- Beurer-Kellner et al., "Prompting Is Programming: A Query Language for Large Language Models" (2023) — LMQL paper introducing programmatic constraints on LLM output.
- Microsoft, "Guidance: A Generation Language for LLMs" (2023) — Template-based constrained generation framework.
- Zheng et al., "SGLang: Efficient Execution of Structured Language Model Programs" (2024) — High-performance structured generation with constrained decoding optimizations.
