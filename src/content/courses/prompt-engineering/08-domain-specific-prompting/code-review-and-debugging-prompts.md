# Code Review and Debugging Prompts

**One-Line Summary**: Code review and debugging prompts are fundamentally analytical rather than creative, requiring the model to identify issues in existing code rather than generate new code from scratch.
**Prerequisites**: `code-generation-prompting.md`, `03-reasoning-elicitation/chain-of-thought-prompting.md`

## What Is Code Review and Debugging Prompting?

Think of the distinction like a proofreader versus a writer. A writer creates new text from a blank page; a proofreader examines existing text for errors, inconsistencies, and improvements. The skills are related but distinct — a great writer can be a poor proofreader and vice versa. Similarly, code review and debugging prompts require the model to analyze existing code rather than generate it, using different reasoning patterns: pattern matching for known bug classes, systematic checking against coding standards, and hypothesis-driven debugging.

Code review and debugging prompts provide the model with existing code and ask it to find problems, suggest improvements, or diagnose specific errors. This is an analytical task where the model must read carefully, understand the code's intent, and identify discrepancies between intent and implementation. The prompt must provide sufficient context for the model to understand what the code should do, not just what it does.

The challenge is that bugs are often subtle — an off-by-one error in a loop boundary, a missing null check in a rarely-executed path, a race condition in concurrent code. Surface-level code review catches the easy issues; deep review requires the model to reason about execution paths, state changes, and edge cases. Well-structured prompts guide the model toward the level of analysis needed.

*Recommended visual: A diagnostic workflow diagram showing the "Reproduce-Isolate-Fix-Verify" debugging loop -- starting with the diagnostic triad (code + error + expected behavior), branching into isolation techniques (ablation, minimal reproduction, context attribution), then converging on a targeted fix, followed by verification against the original failure and regression suite.*
*Source: Adapted from Jesse et al., "Large Language Models and Simple, Stupid Bugs," 2023.*

*Recommended visual: A radar chart comparing review effectiveness across four focus areas (security, performance, readability, architecture) for generic "review this code" prompts vs. focused review prompts with explicit checklists -- showing the 2-3x improvement in actionable findings when review focus is specified.*
*Source: Adapted from Fan et al., "Large Language Models for Software Engineering: A Systematic Literature Review," 2023.*

## How It Works

### Bug Identification Prompts

Effective bug identification requires three pieces of context: the code, the error (or unexpected behavior), and the expected behavior.

**The diagnostic triad**:
1. **Code**: The relevant code, including imports, surrounding context, and any configuration
2. **Error**: The exact error message, stack trace, or description of unexpected behavior ("returns 0 instead of expected 5 for input [1,2,2]")
3. **Expected behavior**: What the code should do ("should return the count of unique elements")

**Structured debugging prompt**:
```
Here is a function that is producing incorrect results:

[code]

Error: [error message/unexpected behavior]
Expected: [correct behavior]
Environment: [Python 3.11, pytest 7.4]

Please:
1. Identify the root cause of the bug
2. Explain why it produces the observed behavior
3. Provide the corrected code
4. Explain what edge cases the fix handles
```

This structure consistently outperforms "find the bug in this code" by 30-40% in bug identification accuracy because it constrains the model's search space. Without the error description, the model may identify irrelevant style issues instead of the actual bug.

### Code Review Focus Areas

Code review prompts should specify the review focus to avoid generic feedback:

**Security review**: "Review this code for security vulnerabilities. Focus on: input validation, SQL injection, XSS, authentication/authorization checks, sensitive data exposure, and insecure deserialization. Rate each finding as Critical, High, Medium, or Low severity."

**Performance review**: "Review this code for performance issues. Focus on: unnecessary database queries (N+1 problems), memory allocation in loops, missing caching opportunities, inefficient algorithms (provide Big-O analysis), and blocking operations in async contexts."

**Readability review**: "Review this code for readability and maintainability. Focus on: naming conventions, function length (suggest splitting functions over 30 lines), documentation gaps, magic numbers, and code duplication."

**Architecture review**: "Review this code for architectural issues. Focus on: separation of concerns, dependency direction, testability, coupling between modules, and adherence to SOLID principles."

Focused reviews produce 2-3x more actionable findings than unfocused "review this code" prompts because the model systematically checks each specified area rather than making scattered observations.

### Diff-Based Review

For code changes (pull requests, patches), providing the diff rather than the full file focuses the review on what changed:

**Diff review prompt**: "Review the following code diff. Focus on: whether the change achieves its stated goal, whether it introduces new bugs, whether edge cases are handled, and whether tests cover the new behavior. Here is the diff:"

Diff-based reviews are more efficient because the model focuses on the changed lines and their immediate context rather than reviewing the entire file. However, the prompt should also include sufficient surrounding context (the full function or class containing the change) for the model to understand the impact.

### Refactoring Suggestions

Refactoring prompts ask the model to improve code without changing its behavior:

**Pattern**: "Refactor this code to [specific goal]. Maintain identical external behavior — the same inputs must produce the same outputs. Show the refactored code and explain each change."

Common refactoring goals include:
- "Reduce cyclomatic complexity by extracting helper functions"
- "Replace the inheritance hierarchy with composition"
- "Convert the callback-based code to async/await"
- "Apply the repository pattern to separate data access from business logic"

Including "maintain identical external behavior" as an explicit constraint reduces the risk of the model accidentally changing functionality during refactoring.

## Why It Matters

### Bug Finding Is Harder Than Bug Creating

Models are generally better at generating code than finding bugs in existing code, because generation is a forward process while debugging requires backward reasoning from symptoms to causes. This means debugging prompts must be more carefully structured than generation prompts to achieve comparable quality.

### Systematic Review Catches More Issues

Human code reviewers suffer from anchoring bias (focusing on the first issue found) and fatigue (attention degrades after 200-400 lines of review). Model-based review can systematically check every specified category across the entire codebase without fatigue. But the model only checks what the prompt tells it to check — the prompt defines the review's thoroughness.

### Security Vulnerabilities Require Specialized Prompts

Generic code review prompts miss 60-70% of security vulnerabilities because the model defaults to checking functionality and style. Security-specific prompts with explicit vulnerability checklists (OWASP Top 10, CWE categories) improve vulnerability detection from 30-40% to 60-75%.

## Key Technical Details

- The diagnostic triad (code + error + expected behavior) improves bug identification accuracy by 30-40% compared to providing code alone.
- Focused review prompts (specifying security, performance, or readability) produce 2-3x more actionable findings than generic "review this code" prompts.
- Security-focused review prompts detect 60-75% of common vulnerabilities (OWASP Top 10) compared to 30-40% for generic review prompts.
- Models reliably identify common bug patterns (off-by-one, null pointer, resource leaks) with 70-85% accuracy when the code is under 100 lines.
- Accuracy drops to 40-60% for bugs requiring understanding of complex state across multiple functions or files, highlighting the importance of providing sufficient context.
- Diff-based review prompts produce 50-70% more relevant feedback than whole-file review prompts for change-focused reviews.
- Including the test suite alongside the code under review helps the model identify gaps in test coverage with 65-80% accuracy.
- Chain-of-thought prompting ("trace the execution step by step for this input") improves bug-finding accuracy by 15-25% for logic errors.

## Common Misconceptions

- **"Code review prompts are just code generation prompts in reverse."** Code review requires different reasoning patterns: pattern matching against known vulnerability classes, systematic checking against standards, and hypothesis-driven debugging. The prompt structure and instructions differ significantly.

- **"The model can review any amount of code effectively."** Review quality degrades significantly beyond 200-300 lines in a single prompt. For larger codebases, break the review into file-level or function-level segments with appropriate context for each.

- **"A model that generates good code will automatically find bugs well."** Generation and analysis are different skills. Models can generate code with a subtle bug and fail to identify that same bug when asked to review the code. Specialized review prompts with explicit checklists compensate for this asymmetry.

- **"Model-based code review can replace human review."** Model-based review excels at catching mechanical issues (style violations, common patterns, known vulnerability types) but misses domain-specific logic errors and architectural concerns. It complements but does not replace human review.

## Connections to Other Concepts

- `code-generation-prompting.md` — Code review is the analytical complement to code generation; together they form a generate-review-refine loop.
- `03-reasoning-elicitation/chain-of-thought-prompting.md` — Step-by-step execution tracing is a form of chain-of-thought reasoning applied to code analysis.
- `mathematical-and-logical-prompting.md` — Formal verification of code properties overlaps with mathematical/logical prompting techniques.
- `classification-and-extraction-at-scale.md` — Automated code review at scale across large codebases uses batch processing and consistency patterns from classification prompting.
- `04-system-prompts-and-instruction-design/behavioral-constraints-and-rules.md` — Review focus areas function as behavioral constraints that guide the model's analytical attention.

## Further Reading

- Fan, Y., Ma, W., Mukherjee, S., Jaganathan, K., Bansal, C., & Zimmermann, T. (2023). "Large Language Models for Software Engineering: A Systematic Literature Review." Comprehensive survey of LLMs for code review and debugging.
- Tufano, R., Deng, S., Sundaresan, N., & Svyatkovskiy, A. (2024). "Automating Code Review Activities by Large-Scale Pre-training." Analysis of model capabilities and limitations in code review.
- Jesse, K., Ahmed, T., Devanbu, P. T., & Morgan, E. (2023). "Large Language Models and Simple, Stupid Bugs." Study of model effectiveness at identifying common programming errors.
- Pearce, H., Ahmad, B., Tan, B., Dolan-Gavitt, B., & Karri, R. (2022). "Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions." Security analysis of generated and reviewed code.
