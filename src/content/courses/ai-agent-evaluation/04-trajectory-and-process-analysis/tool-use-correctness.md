# Tool Use Correctness

**One-Line Summary**: A comprehensive evaluation framework for assessing the full lifecycle of agent tool usage, from selection through parameterization, execution, and result interpretation.

**Prerequisites**: `trajectory-quality-metrics.md`, `planning-quality-assessment.md`

## What Is Tool Use Correctness?

Imagine watching a home cook in the kitchen. Even if the final dish tastes fine, you can learn a great deal by observing their process. Do they reach for the right knife? Do they set the oven to the correct temperature? When a sauce looks wrong, do they correctly identify whether it needs more acid or more salt? Tool use correctness applies this observational framework to AI agents, evaluating not just whether the agent gets the right answer, but whether it uses its tools properly along the way.

Tool use correctness is the evaluation of every aspect of how an agent interacts with external tools: selecting the right tool for each situation, providing correct and appropriate parameters, interpreting the results accurately, and composing multiple tool calls into logical sequences. This evaluation is independent of the final outcome, because an agent can use tools incorrectly and still stumble to a correct answer (masking fragility), or use tools correctly and fail due to factors outside tool use (revealing that the problem lies elsewhere).

The importance of tool use evaluation has grown as agents gain access to increasingly powerful tool suites. A coding agent might have access to file operations, shell commands, search, web browsing, and code execution. A data analysis agent might orchestrate SQL queries, Python execution, charting libraries, and API calls. Each tool interaction is a potential failure point, and the failure modes are distinct enough to warrant specialized evaluation.

## How It Works

### Selection Correctness

Selection correctness measures whether the agent chose the appropriate tool for its current subgoal:

```
Selection Accuracy = correct_selections / total_tool_invocations
```

A selection is "correct" if the chosen tool is the most appropriate available option for the agent's stated or inferred intent. Evaluation requires a mapping from intents to optimal tools, typically defined per-task by domain experts.

Common selection errors include:
- **Category confusion**: Using a write tool when a read tool is needed
- **Capability overestimation**: Choosing a tool based on what the agent assumes it can do rather than what it actually does
- **Availability blindness**: Attempting to use a tool that isn't in the current toolset, or ignoring a better tool that is available
- **Habit formation**: Defaulting to a familiar tool when a specialized tool would be more appropriate (e.g., always using `grep` when a dedicated code search tool exists)

### Parameter Correctness

Parameter correctness evaluates whether the agent provided valid, appropriate arguments to the selected tool:

```
Parameter Accuracy = correct_parameterizations / total_tool_invocations
```

Parameter evaluation has multiple dimensions:

- **Type correctness**: Are parameter types valid? (string where string is expected, integer where integer is expected)
- **Value validity**: Are parameter values within acceptable ranges? (valid file paths, well-formed queries, reasonable numeric values)
- **Semantic appropriateness**: Even if technically valid, are the parameters what the agent should have provided? (searching for the right query terms, using the correct file path for the current context)
- **Completeness**: Are all required parameters provided? Are optional parameters used when they would help?

Parameter errors are the most common tool use failure mode, accounting for 40-55% of all tool use errors in published evaluations. The most frequent subtypes are hallucinated file paths (25-30% of parameter errors), malformed query syntax (15-20%), and incorrect argument ordering (10-15%).

### Result Interpretation

Result interpretation measures whether the agent correctly understands and acts on tool outputs:

```
Interpretation Accuracy = correct_interpretations / total_tool_results
```

An interpretation is "correct" if the agent extracts the right information from the tool output and incorporates it appropriately into its reasoning. Evaluation requires examining the agent's reasoning traces after each tool call.

Common interpretation errors:
- **Selective reading**: The agent focuses on one part of the output and ignores contradicting information elsewhere
- **Hallucinated content**: The agent "reads" information from the tool output that isn't actually there
- **Misattribution**: The agent attributes tool output to the wrong source or context
- **Missed implications**: The agent understands the literal output but misses what it implies for the task

### Chaining Logic

Chaining logic evaluates whether sequences of tool calls follow a sensible order and information flow:

- **Dependency respect**: Does the agent call tools in an order that respects data dependencies? (reading a file before trying to edit it)
- **Information flow**: Is the output of one tool call properly used as input to the next?
- **Redundancy avoidance**: Does the agent avoid re-calling tools for information it already has?
- **Progressive refinement**: Do tool call sequences narrow down toward the goal rather than circling?

Chaining is scored by examining consecutive pairs of tool calls and assessing whether each transition is logical:

```
Chaining Score = logical_transitions / total_transitions
```

### Building Tool-Use Evaluation Datasets

Constructing robust tool-use evaluation datasets requires:

1. **Task selection**: Choose tasks that require 3-8 tool calls across 2+ distinct tools, ensuring evaluation exercises selection, not just usage of a single tool
2. **Reference trajectories**: Have domain experts solve each task, recording the optimal tool usage sequence as ground truth
3. **Error injection variants**: Create modified versions of tasks that tempt specific tool use errors (e.g., ambiguous situations where two tools seem equally appropriate)
4. **Annotation schema**: Define clear rubrics for each dimension (selection, parameters, interpretation, chaining) with examples of correct and incorrect behavior
5. **Tool documentation variance**: Include tasks where tool descriptions are precise and tasks where they are ambiguous, testing the agent's ability to handle documentation quality variation

A minimum viable tool-use evaluation dataset contains 50 tasks with reference trajectories, covering at least 5 distinct tools. Robust datasets contain 200+ tasks with multiple reference trajectories per task.

## Why It Matters

1. **Diagnostic precision**: Tool use errors are the most actionable failure mode. Knowing that an agent struggles with parameter correctness for SQL tools points directly to fixable improvements (better SQL formatting, schema-aware parameter generation).
2. **Safety implications**: Incorrect tool use can cause real harm. An agent that runs `rm -rf /` instead of `rm -rf ./build/` made a parameter error with catastrophic consequences. Evaluating tool use catches dangerous patterns before deployment.
3. **Cost optimization**: Tool calls often incur real costs (API fees, compute resources, rate limits). Incorrect tool calls waste these resources and may trigger unnecessary charges or rate limiting.
4. **Generalization predictor**: Tool use correctness on familiar tools predicts performance with new tools. Agents with strong fundamentals (correct selection logic, careful parameterization) adapt better to novel tool suites.

## Key Technical Details

- Across major agent benchmarks, the tool use error distribution is approximately: parameter errors 45%, interpretation errors 25%, selection errors 20%, chaining errors 10%
- Automated tool use evaluation (comparing agent calls against reference trajectories) achieves 82-90% agreement with human evaluation for selection and parameters, but only 65-72% for interpretation
- Tool documentation quality has a measurable impact: agents make 30-40% fewer selection errors with detailed tool descriptions vs. minimal descriptions
- The number of available tools affects selection accuracy nonlinearly: accuracy is stable up to ~10 tools, then degrades significantly. At 20+ tools, selection accuracy drops by 15-25%
- Parameter correctness is strongly correlated with the agent's ability to follow structured output formats (JSON schema adherence r=0.73)
- Evaluating chaining logic requires trajectory-level analysis; step-level evaluation misses dependency violations
- Tool use evaluation should include both isolated tool tests (unit tests for each tool) and integrated multi-tool tasks (integration tests for chaining)

## Common Misconceptions

**"If the tool call succeeds, the tool use was correct."** Tools often silently accept incorrect parameters and return misleading results. A search tool with a misspelled query returns empty results rather than an error. The tool call "succeeded" but the usage was incorrect.

**"Tool use is a binary correct/incorrect judgment."** Tool use exists on a spectrum. An agent might select the right tool, provide mostly correct parameters but miss an optional parameter that would have improved results, and partially interpret the output. Graduated scoring captures more information than binary assessment.

**"Better tool descriptions always improve tool use."** Beyond a quality threshold, additional tool documentation can actually hurt performance by increasing context length and creating confusion between similar-sounding tools. The optimal documentation length is typically 50-150 words per tool.

**"Tool use evaluation requires running the tools."** Many aspects of tool use can be evaluated statically: was the right tool selected? Are the parameters well-formed? Does the agent's reasoning about the expected output match the tool's documented behavior? Static evaluation is cheaper and catches many errors without execution.

## Connections to Other Concepts

- `trajectory-quality-metrics.md` includes Tool Selection Accuracy as one of its core metrics; this document provides the full decomposition
- `planning-quality-assessment.md` evaluates planned tool usage; this document evaluates actual tool usage during execution
- `error-recovery-evaluation.md` covers how agents handle tool-level failures, a specific subset of tool use scenarios
- `specification-gaming-detection.md` identifies cases where technically correct tool use achieves goals through unintended means
- `process-reward-models.md` can be trained on tool use annotations to provide automated tool use scoring

## Further Reading

- "Gorilla: Large Language Model Connected with Massive APIs" -- Patil et al., 2023
- "ToolBench: An Open Platform for Training, Serving, and Evaluating LLM Tool Learning" -- Qin et al., 2024
- "API-Bank: A Comprehensive Benchmark for Tool-Augmented LLMs" -- Li et al., 2023
- "ToolEmu: Identifying the Risks of LM Agents with an LM-Emulated Sandbox" -- Ruan et al., 2024
- "MINT: Evaluating LLMs in Multi-Turn Interaction with Tools and Language Feedback" -- Wang et al., 2024
