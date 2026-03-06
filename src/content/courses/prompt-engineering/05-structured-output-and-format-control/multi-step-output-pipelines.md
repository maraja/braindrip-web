# Multi-Step Output Pipelines

**One-Line Summary**: Multi-step output pipelines chain multiple LLM calls where each step's structured output feeds as input to downstream code or prompts, enabling complex tasks through decomposition.
**Prerequisites**: `json-mode-and-schema-enforcement.md`, `extraction-and-parsing-prompts.md`.

## What Is a Multi-Step Output Pipeline?

Think of a factory assembly line with inspection stations between steps. Raw materials enter at one end. The first station cuts them to shape, an inspector checks dimensions, the second station welds components together, another inspector checks joints, and so on until the finished product emerges. Each station does one job, produces inspectable output, and passes it forward. If any station fails, the problem is caught before it propagates.

Multi-step output pipelines apply this same principle to LLM tasks. Instead of asking a single prompt to do everything — analyze a document, extract data, classify it, generate a summary, and format the report — you decompose the task into discrete steps. Each step takes structured input, performs one focused operation, and produces structured output that feeds the next step.

This decomposition is powerful because LLMs are significantly more reliable on focused, well-defined tasks than on broad, multi-part tasks. A single prompt that tries to do five things might achieve 70% overall success. Five prompts, each doing one thing at 95% reliability, achieve 77% combined — and critically, failures are diagnosable and fixable at the specific step that fails.

![Agent system overview showing multi-step pipeline architecture with planning, execution, and tool use](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Source: Lilian Weng, "LLM Powered Autonomous Agents," lilianweng.github.io (2023) -- illustrates the multi-step pipeline concept where tasks are decomposed into discrete stages with structured handoffs between components*

*Recommended visual: A four-pattern comparison showing the four pipeline architecture types side by side: "Linear" (Step 1 -> Step 2 -> Step 3), "Branching" (Step 1 -> classification -> diverging paths), "Fan-out/Fan-in" (Step 1 -> parallel branches -> aggregation), and "Iterative Refinement" (Step -> evaluate -> loop back or proceed), each with typical use cases annotated below.*
*Source: Adapted from Khattab et al., "DSPy" (2023) and Wu et al., "AutoGen" (2023)*

## How It Works

### Designing for Parseability

Every intermediate output in a pipeline must be reliably parseable by code. This means choosing formats that are both machine-readable and well-suited to the content:

- **JSON** for structured data: extracted fields, classification results, numerical outputs, configuration parameters. JSON is the default for machine-consumed intermediate outputs because every programming language has native JSON parsing.

- **Markdown** for human-reviewed intermediates: when a person needs to inspect or approve an intermediate result before the pipeline continues.

- **XML tags** for mixed content: when intermediate output contains both structured data and natural language that must be preserved (e.g., a `<reasoning>` section and a `<result>` section).

Design each step's output schema before writing any prompts. The output schema of step N must be compatible with the input expectations of step N+1. Incompatibilities between steps are the most common source of pipeline failures.

### Intermediate Format Selection

The choice of intermediate format depends on who or what consumes it:

**Code-consumed intermediates** should use JSON with strict schemas. The consuming code expects specific fields with specific types. Use schema enforcement or validation at each step to guarantee structural correctness.

**LLM-consumed intermediates** can use natural language or loosely structured formats. When one LLM call feeds another, the downstream model can handle some structural variation. However, structured intermediates still improve reliability because they focus the downstream model on specific information.

**Human-consumed intermediates** should use markdown or rich text. When a pipeline includes human review or approval gates, format for readability. Humans can handle ambiguity; invest formatting effort in clarity rather than strict structure.

### Error Handling Between Steps

Pipeline errors propagate: a failure in step 2 corrupts every subsequent step. Robust error handling requires:

**Validation at each boundary**: After each LLM call, validate the output structurally (schema conformance) and semantically (sanity checks). Catch errors early before they compound.

**Retry with feedback**: When a step produces invalid output, feed the validation error back to the model: "Your output failed validation: field 'date' expected ISO format but got 'next Tuesday.' Please correct." One retry resolves 80-90% of structural failures.

**Graceful degradation**: Design pipelines so that a single step's failure does not crash the entire process. Use default values, skip optional steps, or route to human review when automated recovery fails.

**Logging and observability**: Record every intermediate output. When the final result is wrong, these logs let you trace the error to the specific step that introduced it. Without logging, debugging a 5-step pipeline is nearly impossible.

### Pipeline Architecture Patterns

**Linear pipelines**: Step 1 -> Step 2 -> Step 3. Simple, predictable, easy to debug. Most common pattern.

**Branching pipelines**: Step 1 produces a classification that routes to different step-2 variants. A support ticket might be classified as "billing" or "technical," and each branch has different subsequent processing.

**Fan-out/fan-in**: Step 1 produces a list, each item is processed independently in parallel (fan-out), and results are aggregated (fan-in). Processing a 50-page document by extracting entities from each page in parallel, then merging.

**Iterative refinement**: Output from step N is evaluated, and if insufficient, fed back into a revised version of step N. Common for quality-critical tasks like summarization or writing.

## Why It Matters

### Reliability Through Decomposition

Complex single-prompt tasks are fragile. A 500-word prompt asking for analysis, extraction, classification, and formatting creates numerous failure modes that interact unpredictably. Decomposing into focused steps makes each step more reliable and every failure diagnosable. This is the same principle that makes functions in programming more reliable than monolithic scripts.

### Debuggability and Iteration

When a pipeline produces a wrong result, intermediate outputs reveal exactly where things went wrong. Was the extraction correct but the classification wrong? Did the summarization lose a key fact? This visibility enables targeted prompt improvement on the specific failing step rather than guessing which part of a monolithic prompt needs adjustment.

### Flexibility and Maintainability

Pipelines are modular. Swap out the extraction step without touching classification. Upgrade one step to a better model while keeping others on a cheaper model. Add a new step between existing ones. This modularity mirrors good software engineering practices and makes LLM applications maintainable at scale.

## Key Technical Details

- **Focused single-task prompts achieve 90-95% per-step reliability**, compared to 60-80% for complex multi-task prompts.
- **Retry with validation feedback resolves 80-90% of structural failures** in a single retry attempt.
- **JSON is the default intermediate format** for code-consumed outputs due to universal parser availability and schema enforcement support.
- **Pipeline latency is additive**: a 5-step pipeline with 2-second steps takes 10 seconds. Parallel steps (fan-out) can mitigate this.
- **Cost scales linearly with steps**: each step is a separate API call. Offset by using smaller/cheaper models for simpler steps and frontier models only where needed.
- **Intermediate token counts compound**: step 1's output becomes part of step 2's input. Design concise intermediates to avoid context window exhaustion in later steps.
- **Schema versioning matters**: when updating one step's output schema, all downstream steps must be updated to match. Treat schemas like API contracts.

## Common Misconceptions

- **"A single sophisticated prompt is always better than a pipeline."** For simple tasks, yes — a single prompt avoids overhead. For complex, multi-part tasks, pipelines are more reliable, debuggable, and maintainable. The crossover point is roughly when a single prompt requires more than 3 distinct operations.
- **"Pipelines are too slow for real-time use."** Linear pipelines add latency, but parallel steps (fan-out) and step-level model selection (fast models for simple steps) keep total latency manageable. Many production pipelines complete in 3-10 seconds.
- **"Each step needs a frontier model."** Use the cheapest model that achieves acceptable quality for each step. Classification might work fine with a smaller model; complex reasoning might need the frontier. Per-step model selection optimizes cost.
- **"If individual steps work, the pipeline works."** Integration failures — incompatible schemas, lost context between steps, edge cases that span multiple steps — are the primary failure mode. End-to-end testing is essential.

## Connections to Other Concepts

- `json-mode-and-schema-enforcement.md` — JSON schema enforcement is the primary mechanism for reliable intermediate outputs in pipelines.
- `extraction-and-parsing-prompts.md` — Extraction is often the first step in a pipeline, converting unstructured input to structured data.
- `classification-and-labeling-output.md` — Classification steps serve as routing decisions in branching pipelines.
- `xml-and-tag-based-output.md` — XML tags provide intermediate structure for mixed content outputs between steps.
- `context-assembly-patterns.md` — Each pipeline step requires assembling the right context from previous steps' outputs.

## Further Reading

- Khattab et al., "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines" (2023) — Framework for building and optimizing multi-step LLM pipelines with automatic prompt tuning.
- Wu et al., "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation" (2023) — Multi-agent pipeline framework with structured message passing between steps.
- Chase, "LangChain: Building Applications with LLMs Through Composability" (2022) — Early and influential framework for chaining LLM calls into pipelines.
- Dohan et al., "Language Model Cascades" (2022) — Theoretical framework for composing language model calls into probabilistic programs.
