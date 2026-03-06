# Prompt Chaining

**One-Line Summary**: Prompt chaining decomposes complex tasks into sequential LLM calls where the output of one prompt becomes the input to the next, enabling tasks too complex for a single prompt while introducing error propagation that must be managed through validation gates.

**Prerequisites**: `what-is-a-prompt.md`, `instruction-prompting.md`, `context-window-mechanics.md`.

## What Is Prompt Chaining?

Think of an assembly line where each station performs one specialized job. Station 1 cuts the raw material. Station 2 shapes it. Station 3 polishes it. Station 4 inspects it. No single station does everything, and each station is optimized for its specific task. If Station 2 produces a defective shape, Station 3 polishes a defective piece — the error propagates down the line. The solution is quality checkpoints between stations, catching defects before they compound.

Prompt chaining applies this assembly-line principle to LLM workflows. Instead of writing one massive prompt that asks the model to do everything at once — extract data, analyze it, format it, and generate a report — you break the work into discrete steps, each handled by a separate LLM call. Step 1 extracts relevant data. Step 2 analyzes the extracted data. Step 3 formats the analysis into a report. Each step receives a focused prompt optimized for its specific task, and the output of each step is passed as input to the next.

This technique is powerful because it converts a single hard problem into multiple easier problems. An LLM that struggles to extract-analyze-format in one pass often performs each individual task with high accuracy. The cost is increased latency (multiple API calls), increased token usage (repeated context), and error propagation (mistakes compound across steps). Understanding when chaining helps and when it hurts — and how to manage the propagation risk — separates effective pipelines from fragile ones.

![Agent overview showing sequential planning and tool use patterns](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Source: Lilian Weng, "LLM Powered Autonomous Agents," lilianweng.github.io, 2023. Prompt chaining follows the same sequential decomposition pattern used in agentic systems.*

*Recommended visual: A pipeline flow diagram showing 4 sequential steps (Extract -> Analyze -> Recommend -> Format) with arrows between them, each step annotated with its prompt focus and output format. Between each step, a diamond-shaped "validation gate" node shows programmatic and LLM-based checks, with pass/retry/fallback paths.*
*Source: Adapted from Wu et al., "AI Chains," CHI 2022, and Khattab et al., "DSPy," 2023.*

## How It Works

### Pipeline Architecture

A typical chain has 3-7 steps. Each step has:

1. **Input**: The output from the previous step (or the original user input for Step 1).
2. **Prompt**: A focused instruction set optimized for this specific sub-task.
3. **Output**: A structured result passed to the next step.
4. **Validation gate** (optional): A check — programmatic or LLM-based — that the output meets quality criteria before passing it forward.

Example pipeline for document analysis:

```
Step 1: Extract → "Extract all financial figures from this document. Return as JSON."
           ↓ (JSON output)
Step 2: Analyze → "Given these financial figures, identify trends and anomalies."
           ↓ (analysis text)
Step 3: Recommend → "Based on this analysis, provide 3 actionable recommendations."
           ↓ (recommendations)
Step 4: Format → "Format the following recommendations as an executive memo."
           ↓ (final output)
```

### Error Propagation Mathematics

The critical risk in chaining is error propagation. If each step has accuracy p, the end-to-end accuracy after n steps is approximately p^n (assuming independent errors):

| Per-step accuracy | 3 steps | 5 steps | 7 steps |
|---|---|---|---|
| 95% | 86% | 77% | 70% |
| 90% | 73% | 59% | 48% |
| 85% | 61% | 44% | 32% |

At 90% accuracy per step, a 5-step chain delivers only 59% end-to-end accuracy. This is why validation gates are essential — catching errors after each step prevents compounding.

### Validation Gates

Validation gates between steps are the key to making chains reliable:

- **Programmatic validation**: Check JSON parsability, required field presence, value ranges, string format patterns. Cheap, fast, deterministic.
- **LLM-based validation**: Use a separate LLM call to evaluate the output. "Does the following extraction correctly capture all financial figures from the source document? Respond yes/no with corrections if needed." More expensive but handles semantic errors.
- **Retry logic**: When validation fails, retry the step (optionally with a modified prompt or higher temperature for diversity). Typically allow 1-3 retries before escalating.
- **Fallback paths**: If a step consistently fails, route to an alternative approach (simpler prompt, different model, human review).

With validation gates achieving 95% catch rate on per-step errors, the effective per-step accuracy jumps from 90% to 99.5%, making a 5-step chain viable at 97.5% end-to-end accuracy.

### When to Chain vs. Single Prompt

Chain when:
- The task has clearly separable sub-tasks requiring different capabilities (extraction vs. analysis vs. formatting).
- A single prompt exceeds 70-80% of the context window (not enough room for output).
- Intermediate results need programmatic validation or transformation.
- Different steps benefit from different model configurations (temperature, model size).

Use a single prompt when:
- The task is straightforward and well within model capability.
- Latency is critical (each chain step adds 1-5 seconds).
- The sub-tasks are tightly interdependent (output of one step is hard to evaluate without the context of others).
- The total token cost of chaining (repeated context) exceeds the cost of a larger single prompt.

## Why It Matters

### Handling Complex Tasks Reliably

Tasks that models handle unreliably in a single pass often become reliable when decomposed. A model asked to "read this legal contract, identify all obligations, categorize them, assess risk levels, and produce a summary table" in one prompt might achieve 60-70% quality. The same task decomposed into extract-categorize-assess-format steps might achieve 85-95% quality because each step is individually tractable.

### Debugging and Observability

Chains provide natural inspection points. When the final output is wrong, you can examine intermediate outputs to identify which step failed. This is vastly easier than debugging a single monolithic prompt where the failure mode is opaque. In production, logging each step's input and output creates an audit trail that supports both debugging and quality monitoring.

### Modular Prompt Development

Chains enable modular development. Each step's prompt can be developed, tested, and optimized independently. Step 2 can be improved without touching Steps 1, 3, or 4. Different team members can own different steps. This modularity scales development effort more effectively than trying to optimize a single complex prompt.

## Key Technical Details

- Typical chains have 3-7 steps; more than 7 steps introduces excessive latency and error propagation risk.
- Error propagation follows approximately p^n: 90% per-step accuracy yields 59% over 5 steps without validation.
- Validation gates (programmatic + LLM-based) can boost effective per-step accuracy from 90% to 99%+.
- Each chain step adds 1-5 seconds of latency (API round trip + model processing), making a 5-step chain 5-25 seconds total.
- Token cost increases because context is partially repeated across steps; a 5-step chain typically uses 2-4x the tokens of a single equivalent prompt.
- Structured intermediate formats (JSON, XML) between steps reduce parsing errors and enable programmatic validation.
- Parallel branches (where steps are independent) can reduce latency: if Steps 2a and 2b are independent, run them simultaneously.
- Each step can use a different model or temperature: extraction at T=0 with a cheaper model, creative generation at T=0.8 with a frontier model.

## Common Misconceptions

**"Chaining always produces better results than a single prompt."** For simple tasks, chaining adds latency, cost, and error propagation without quality benefit. Chaining helps when the task is complex enough that a single prompt struggles — typically when the task has 3+ distinct sub-tasks or exceeds model capability in a single pass.

**"More steps mean more control."** Each additional step is an opportunity for error and a latency cost. The goal is the minimum number of steps needed for reliability, not the maximum decomposition. Over-decomposing simple tasks creates overhead without benefit.

**"Error propagation is unavoidable."** Validation gates dramatically reduce compounding errors. A well-designed chain with validation at every step can achieve 95%+ end-to-end accuracy even with mediocre per-step accuracy. The engineering effort should focus on validation design, not just prompt optimization.

**"Chains must be strictly sequential."** Many pipelines have steps that can run in parallel. Extract entities AND extract dates simultaneously, then merge the results. Directed acyclic graphs (DAGs) are more flexible than linear chains and can significantly reduce total latency.

## Connections to Other Concepts

- `instruction-prompting.md` — Each chain step needs focused, specific instructions optimized for that sub-task.
- `context-window-mechanics.md` — Chaining is one strategy for working within context limits: split the work rather than stuffing everything into one call.
- `prompt-templates-and-variables.md` — Chain steps are typically implemented as templates where variables carry the output of previous steps.
- `delimiter-and-markup-strategies.md` — Structured delimiters (JSON, XML) between chain steps enable reliable parsing and validation.
- `prompt-engineering-vs-context-engineering.md` — Each chain step requires its own context engineering: what context does this specific step need?

## Further Reading

- Wu et al., "AI Chains: Transparent and Controllable Human-AI Interaction by Chaining Large Language Model Steps," CHI 2022. User-facing chain design patterns.
- Khattab et al., "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines," 2023. Framework for programmatic LLM chains with automatic optimization.
- Anthropic, "Building Effective Agents," 2024. Practical guidance on chaining and workflow design for production LLM systems.
- Chase, "LangChain Documentation," 2023-2024. The most widely used framework for implementing LLM chains, with extensive chain design patterns.
