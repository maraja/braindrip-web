# Multiple Valid Solutions

**One-Line Summary**: Agents solving open-ended tasks produce legitimately different solutions, making reference-based evaluation fundamentally inadequate and requiring solution-agnostic methods like test-based verification, constraint checking, and LLM-as-judge.

**Prerequisites**: `why-agent-evaluation-is-hard.md`, `outcome-vs-process-evaluation.md`

## What Is the Multiple Valid Solutions Problem?

Ask ten experienced developers to fix a bug, and you will get ten different patches. Some will fix the root cause, others will add defensive checks. Some will refactor the surrounding code, others will make minimal changes. Some will add tests, others will not. All ten patches may be correct -- they all fix the bug and pass the test suite. But no two are identical.

This is the multiple valid solutions problem. When a task has a large or ill-defined space of correct answers, evaluation methods that compare agent output to a single reference answer systematically penalize valid alternatives. An agent that produces a correct but unexpected solution scores zero, while an agent that memorizes the reference scores perfectly.

The problem is especially acute for AI agents because agents operate in creative, open-ended domains: writing code, generating reports, planning research, configuring systems. In these domains, the space of correct solutions is not just large -- it is often impossible to enumerate. Evaluation methods must be fundamentally redesigned to handle this reality.

## How It Works

### Why Reference-Based Evaluation Fails

Reference-based evaluation compares agent output to one or more gold-standard answers using similarity metrics. Common approaches include:

- **Exact match**: Output must be character-for-character identical to the reference
- **BLEU/ROUGE scores**: N-gram overlap between output and reference
- **Embedding similarity**: Cosine distance in a learned embedding space
- **Structural comparison**: AST diff for code, DOM comparison for web pages

Each of these fails for multi-solution tasks:

**Exact match** fails obviously. Two correct Python functions can differ in variable names, whitespace, import ordering, and algorithmic approach while being semantically identical.

**BLEU/ROUGE** measures surface-level text overlap. A solution that uses a `for` loop has low BLEU score compared to a reference using a list comprehension, despite equivalent functionality. Research has shown BLEU correlates poorly with code correctness (r < 0.3 in most studies).

**Embedding similarity** captures semantic similarity better but still penalizes structurally different solutions. A recursive solution and an iterative solution to the same problem may have low embedding similarity despite identical behavior.

**Structural comparison** (e.g., AST diff) is more robust but still assumes structural similarity. An agent that fixes a bug by refactoring the function signature has a large AST diff compared to one that adds a single conditional, even if both are correct.

### Solution-Agnostic Evaluation Methods

The alternative is to define correctness through properties the solution must satisfy, rather than through similarity to a reference.

#### 1. Test-Based Verification

The most widely used approach, and the foundation of benchmarks like SWE-bench and HumanEval:

- Define a test suite that any correct solution must pass
- Run the agent's output against the tests
- Score based on pass/fail or fraction of tests passed

**Strengths**: Objective, automatable, allows unlimited solution diversity.
**Weaknesses**: Test suites are incomplete specifications. An agent can satisfy all tests while introducing security vulnerabilities, performance regressions, or maintainability issues. Writing comprehensive tests is itself a hard problem -- in SWE-bench, each task typically has 1-5 test cases, which may not cover edge cases.

Quality of test-based evaluation depends entirely on test quality:

| Test Coverage | Risk |
|---------------|------|
| Functional correctness only | Misses performance, security, style |
| Happy path only | Misses edge cases and error handling |
| Narrow assertions | Allows technically passing but semantically wrong solutions |
| Comprehensive suite | High authoring cost, may over-constrain |

#### 2. Constraint Checking

Define a set of constraints that any valid solution must satisfy, without specifying the solution form:

- **Output constraints**: "The function must return a sorted list" (verifiable without a reference)
- **Resource constraints**: "The solution must complete in under 100ms" (performance bound)
- **Structural constraints**: "The change must not modify files outside the `src/` directory" (scope limitation)
- **Behavioral constraints**: "The solution must not break any existing tests" (regression prevention)

Constraint checking is more flexible than test-based verification because constraints can express non-functional requirements that tests struggle with.

#### 3. LLM-as-Judge

Use a language model to evaluate the agent's output against task requirements:

- Provide the judge LLM with the task description, the agent's output, and evaluation criteria
- The judge assesses correctness, quality, and completeness without a reference answer
- Can evaluate aspects that are hard to automate: code readability, explanation quality, approach elegance

**Key findings from research:**
- GPT-4-class models show 80-85% agreement with human evaluators on code quality judgments (Zheng et al., 2023)
- Judge agreement is highest for binary correct/incorrect decisions and lowest for subjective quality ratings
- Self-evaluation bias exists: models tend to rate their own outputs higher than other models' outputs
- Providing rubrics and scoring criteria significantly improves judge consistency

See `../03-automated-evaluation-methods/llm-as-judge.md` for a comprehensive treatment.

#### 4. Property-Based Testing

Borrowed from software testing (QuickCheck-style), property-based evaluation defines invariants:

- **Idempotency**: Running the agent's solution twice produces the same result
- **Symmetry**: Reversible operations can be undone
- **Equivalence**: The solution produces the same outputs as the original for a set of random inputs
- **Monotonicity**: Performance metrics do not degrade compared to baseline

This approach is particularly powerful for refactoring and optimization tasks where the behavioral specification is "do the same thing, but better."

### The Challenge of Creative and Exploratory Tasks

Some agent tasks have genuinely subjective correctness criteria:

- **"Write a research summary of recent progress in protein folding"**: Many valid structures, emphases, and conclusions
- **"Suggest improvements to this codebase architecture"**: Dependent on priorities, constraints, and taste
- **"Design a database schema for a social media application"**: Dozens of valid normalizations and denormalizations

For these tasks, no fully automated evaluation is satisfactory. The practical approach is:

1. **Decompose into objective sub-criteria** where possible (e.g., "Does the summary cite at least 3 recent papers?", "Does the schema support the listed queries?")
2. **Use LLM-as-judge with detailed rubrics** for subjective dimensions
3. **Accept evaluation uncertainty** and report confidence intervals rather than point estimates
4. **Triangulate with multiple judges** (LLM judges, human evaluators) and report inter-rater agreement

## Why It Matters

1. **Reference-based evaluation penalizes innovation.** If agents are evaluated against a fixed reference, they learn to produce reference-like outputs rather than genuinely solving problems. This creates agents that are good at benchmarks but poor at novel tasks.
2. **Real-world tasks almost always have multiple solutions.** The single-correct-answer paradigm from school exams does not apply to professional work. Evaluation must reflect this reality.
3. **Evaluation method choice affects agent development.** Teams that use test-based verification build agents that focus on functional correctness. Teams that use LLM-as-judge can also optimize for style, efficiency, and maintainability. The evaluation method shapes the agent.
4. **Benchmark gaming exploits reference dependence.** When agents (or their developers) know the reference solutions, they can overfit to specific patterns rather than developing general capability. Solution-agnostic evaluation resists this.

## Key Technical Details

- SWE-bench uses test-based verification exclusively; each task has a "fail-to-pass" test set that the solution must flip from failing to passing
- HumanEval+ (Liu et al., 2023) augmented HumanEval with 80x more tests per problem, catching solutions that passed the original tests but were incorrect -- demonstrating the insufficiency of sparse test suites
- LLM-as-judge inter-rater reliability (Cohen's kappa) with human evaluators: 0.6-0.8 for binary judgments, 0.4-0.6 for Likert-scale ratings
- The "oracle problem" in software testing -- how do you test a program when you do not know the correct output? -- is essentially the multiple valid solutions problem applied to agent evaluation
- Constraint-based evaluation can be partially automated using static analysis tools (linters, type checkers, complexity analyzers) that verify properties without reference solutions

## Common Misconceptions

**"More reference solutions solve the problem."** Having 5 reference solutions instead of 1 is better but still insufficient for tasks with combinatorially many valid approaches. You would need an impractical number of references to cover the solution space. Test-based and constraint-based methods scale better.

**"LLM-as-judge replaces all other methods."** LLM judges are powerful but have known biases: position bias (preferring the first option), verbosity bias (preferring longer outputs), and self-preference bias. They should complement, not replace, objective evaluation methods like test suites.

**"If the agent's solution differs from mine, it is probably wrong."** Human evaluators consistently exhibit anchoring bias toward their own solution. Studies show that evaluators rate correct-but-different solutions 15-20% lower than correct-and-similar solutions, even when both are objectively equivalent.

**"Test-based verification is fully objective."** The test suite itself embodies subjective choices about what to test, how thoroughly, and what edge cases matter. Two different test authors may produce test suites that accept different solution sets. Tests are a proxy for correctness, not correctness itself.

## Connections to Other Concepts

- `outcome-vs-process-evaluation.md` -- multiple valid solutions complicate outcome evaluation, potentially increasing the value of process evaluation
- `why-agent-evaluation-is-hard.md` -- the multiple solutions problem is one of the six fundamental challenges
- `evaluation-dimensions-taxonomy.md` -- different solutions may excel on different dimensions (one is faster, another is more readable)
- `evaluation-driven-development.md` -- eval design must account for solution diversity when creating test cases
- `../03-automated-evaluation-methods/llm-as-judge.md` -- detailed treatment of using LLMs for solution-agnostic evaluation
- `../02-benchmark-ecosystem/swe-bench-deep-dive.md` -- how SWE-bench handles the multiple solutions problem with test-based verification

## Further Reading

- "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" -- Zheng et al., 2023
- "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation" -- Liu et al., 2023
- "EvalPlus: A Rigorous Evaluation Framework for LLM4Code" -- Liu et al., 2024
- "Agent-as-a-Judge: Evaluate Agents with Agents" -- Zhuge et al., 2024
- "Beyond Reference-Based Evaluation: Analyzing Behaviors of Open LLMs on Instruction-Following" -- Workshop Paper, 2024
