# Code Execution-Based Evaluation

**One-Line Summary**: Code execution-based evaluation uses automated test suites as objective oracles for assessing coding agent output, providing reproducible and scalable correctness verification while facing limitations around test completeness and gaming vulnerability.

**Prerequisites**: `reference-free-evaluation.md`, `../ai-agent-concepts/tool-use.md`, `rubric-engineering.md`

## What Is Code Execution-Based Evaluation?

Think of a driving test. Instead of asking a candidate to describe how they would navigate a roundabout, you put them in a car and have them actually drive through one. The proof is in the execution, not the explanation. If they make it through safely and correctly, they pass -- regardless of whether their approach matches the textbook description.

Code execution-based evaluation applies this principle to coding agents. Rather than having an LLM judge read generated code and estimate its quality, you run the code against a test suite and observe whether it produces correct results. The test suite acts as an oracle: an authoritative source of truth about whether the code works. This makes evaluation objective, reproducible, and scalable -- properties that are difficult to achieve with text-based evaluation alone.

This approach is the backbone of major coding agent benchmarks. SWE-bench evaluates whether agents can resolve real GitHub issues by running the repository's test suite after the agent's changes. HumanEval tests function-level code generation against input-output test cases. The common thread is that execution replaces judgment.

## How It Works

### Test-as-Oracle: The Core Pattern

The evaluation loop is straightforward:

1. Present the coding task to the agent
2. Collect the agent's code output
3. Execute the code in a sandboxed environment
4. Run the test suite against the executed code
5. Record pass/fail results for each test case
6. Compute aggregate metrics (pass rate, pass@k)

The test suite serves as the oracle -- the authoritative determination of correctness. This is powerful because it is binary (each test passes or fails), objective (no subjective judgment involved), and reproducible (same code, same tests, same result every time).

### Strengths of Test-Based Evaluation

- **Objectivity**: No prompt engineering, no rubric ambiguity, no judge bias. A test passes or it does not.
- **Reproducibility**: Given identical code and tests, results are deterministic.
- **Scalability**: Running test suites is computationally cheap compared to LLM-based evaluation. Thousands of evaluations can run in parallel.
- **Groundedness**: Tests verify actual behavior, not predicted behavior. The code must truly work, not just look correct.

### Limitations of Test-Based Evaluation

- **Test incompleteness**: Tests only verify the behaviors they cover. Code that passes all tests may still contain bugs in untested paths. A function that correctly handles the 5 test cases but crashes on the 6th input pattern will appear correct.
- **Incorrect tests**: Tests can themselves be buggy. In SWE-bench, researchers found that some test cases had errors, leading to false negatives (correct code judged as failing) or false positives (incorrect code judged as passing).
- **Gaming vulnerability**: Agents can learn to game test suites. Hardcoding expected outputs, detecting test patterns, or exploiting test structure to pass without genuine problem-solving. This is a well-documented concern in competitive programming benchmarks.
- **Binary signal**: A test either passes or fails. There is no partial credit for code that is 90% correct or that handles 4 of 5 edge cases. This can be harsh for complex tasks.

### Agent-Generated Tests vs. Human-Written Tests

**Human-written tests** are the traditional oracle: created by developers who understand the specification, edge cases, and expected behavior. They are generally higher quality but expensive to create and may not cover all evaluation scenarios.

**Agent-generated tests** offer a scalable alternative: have one agent (or the same agent) generate test cases, then evaluate whether the code passes them. This introduces a bootstrapping problem -- if the test-generating agent is flawed, the tests may be wrong. Mitigations include:

- Generating tests from the specification (not from the code) to avoid circular validation
- Using multiple independent test generation passes and taking the union
- Having a separate model review generated tests for correctness
- Combining agent-generated tests with a small set of human-verified tests as anchors

### Beyond Pass/Fail: Measuring Solution Quality

"Tests pass" is a necessary but insufficient measure of code quality. Comprehensive evaluation also considers:

- **Code quality**: Does the code follow project conventions, use meaningful variable names, include appropriate comments, and handle errors gracefully? Measured via linters (pylint, eslint) and static analysis tools.
- **Efficiency**: What is the time and space complexity? For a sorting task, both O(n log n) and O(n^2) solutions may pass all tests, but the former is clearly superior. Measure via execution time profiling on large inputs.
- **Maintainability**: Is the code modular, readable, and easy to modify? Measured via cyclomatic complexity, function length, and coupling metrics.
- **Test coverage of the solution**: How much of the agent's generated code is actually exercised by the test suite? Low coverage means the tests are not thoroughly validating the code.

### SWE-bench's Methodology

SWE-bench evaluates coding agents on real-world GitHub issue resolution:

1. Each task is a real issue from a popular open-source repository (Django, scikit-learn, sympy, etc.)
2. The agent receives the issue description and the repository state before the fix
3. The agent produces a patch (code changes)
4. The patch is applied to the repository
5. The repository's existing test suite is run, plus specific tests that verify the fix
6. The task is "resolved" only if all relevant tests pass

Key design decisions: SWE-bench uses the project's own test suite (not synthetic tests), applies the agent's patch to the real codebase (not an isolated function), and requires that existing tests continue passing (no regressions). SWE-bench Verified is a human-validated subset of 500 instances where annotators confirmed the test cases correctly capture the issue requirements.

## Why It Matters

1. **Execution-based evaluation provides the strongest objectivity guarantee among all evaluation methods.** When code runs correctly against comprehensive tests, that is an empirical fact, not an opinion.

2. **It enables large-scale agent comparison.** Benchmarks like SWE-bench, HumanEval, and MBPP allow direct comparison of coding agents because evaluation is deterministic and standardized.

3. **It catches errors that text-based evaluation misses.** Code that looks correct to an LLM judge may have subtle bugs (off-by-one errors, race conditions, encoding issues) that only manifest at runtime.

4. **It grounds evaluation in real-world software engineering.** SWE-bench tasks come from real repositories with real test suites, making evaluation results more predictive of real-world agent utility.

## Key Technical Details

- SWE-bench Verified contains 500 human-validated instances; top agent performance as of early 2025 is approximately 50-60% resolved
- pass@k metric: probability that at least one of k generated solutions passes all tests. pass@1 measures first-attempt accuracy; pass@10 measures best-of-10
- Sandboxing is critical: agent-generated code must run in isolated containers (Docker) to prevent file system damage, network abuse, or resource exhaustion
- Test execution timeouts prevent infinite loops from consuming evaluation infrastructure; typical limits are 30-300 seconds per test case
- Flaky tests (tests that non-deterministically pass or fail) must be identified and excluded to prevent noise in evaluation results
- Mutation testing (injecting small bugs into correct code and verifying tests catch them) can validate test suite quality

## Common Misconceptions

**"If all tests pass, the code is correct."** Tests verify specific behaviors, not all behaviors. Test coverage is rarely 100%, and even full line coverage does not guarantee correctness. Tests are a necessary condition, not a sufficient one.

**"Agent-generated tests are as reliable as human-written tests."** They are useful for scaling but less reliable. Agent-generated tests may miss edge cases, contain errors, or be overly aligned with the agent's own implementation approach, reducing their ability to catch bugs.

**"Execution-based evaluation works for all agent tasks."** It is limited to tasks with executable outputs. Customer service agents, research agents, and planning agents produce outputs that cannot be meaningfully "executed" against a test suite.

**"Higher pass@k always indicates a better agent."** pass@k with large k rewards agents that occasionally generate correct solutions, even if most attempts fail. For production deployment, pass@1 (first-attempt accuracy) is usually more relevant than pass@100.

## Connections to Other Concepts

- Provides the execution verification component of `reference-free-evaluation.md`
- Evaluated environment state connects to `environment-state-evaluation.md` for broader state checking
- Test results flow through `evaluation-pipeline-architecture.md` for aggregation and reporting
- Rubrics from `rubric-engineering.md` can assess code quality dimensions beyond pass/fail
- Can be combined with `agent-as-judge.md` for holistic code quality assessment

## Further Reading

- "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" -- Jimenez et al., 2024
- "Evaluating Large Language Models Trained on Code" -- Chen et al., 2021 (HumanEval)
- "Is Your Code Generated by ChatGPT Really Correct?" -- Liu et al., 2024
- "SWE-bench Verified: A Verified Benchmark for Real-World Software Engineering" -- Chowdhury et al., 2024
