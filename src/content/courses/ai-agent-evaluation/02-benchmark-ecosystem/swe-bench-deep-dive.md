# SWE-bench Deep Dive

**One-Line Summary**: SWE-bench is the dominant benchmark for evaluating coding agents on real-world software engineering tasks derived from GitHub issues and pull requests.

**Prerequisites**: `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md`, `../01-foundations-of-agent-evaluation/outcome-vs-process-evaluation.md`

## What Is SWE-bench?

Imagine giving a junior developer a bug report from a real open-source project and asking them to produce a working patch -- with no guidance beyond the issue description and the codebase itself. That is essentially what SWE-bench asks of AI agents.

SWE-bench, introduced by Jimenez et al. at Princeton in 2024, draws tasks from actual GitHub issues across 12 popular Python repositories (Django, Flask, scikit-learn, sympy, matplotlib, and others). Each task provides the agent with the repository at a specific commit, the text of an issue or bug report, and expects a code patch as output. The patch is validated by running the project's existing test suite -- specifically the tests added or modified in the human-authored pull request that originally resolved the issue.

What makes SWE-bench distinctive is its grounding in real developer work. These are not contrived coding puzzles. They are genuine maintenance tasks that required professional developers anywhere from hours to days to resolve, spanning bug fixes, feature additions, refactors, and documentation changes.

## How It Works

### Task Format

Each SWE-bench instance consists of:

1. **Repository snapshot** -- the codebase checked out at the commit just before the fix
2. **Issue description** -- the original GitHub issue text (sometimes with additional context)
3. **Gold patch** -- the human-authored pull request diff (used only to identify relevant tests, not shown to the agent)
4. **Test specification** -- tests that must pass after the agent's patch is applied

The agent receives only items 1 and 2. It must produce a unified diff patch that, when applied, causes all specified tests to pass.

### The "Resolved" Metric

SWE-bench uses a binary evaluation metric: an instance is "resolved" if and only if all fail-to-pass tests (tests that failed before the patch but should pass after) now pass, and no previously passing tests have broken. There is no partial credit. This strict criterion means an agent that fixes the core bug but introduces a minor regression scores zero on that instance.

### Variants and Their Purpose

- **SWE-bench Full** (2,294 tasks): The original dataset. Broad coverage but includes noisy, ambiguous, or trivially solvable instances.
- **SWE-bench Lite** (300 tasks): A curated subset removing tasks with overly specific hints in the issue text or environment setup difficulties. This became the primary leaderboard through most of 2024-2025.
- **SWE-bench Verified** (500 tasks): Human-validated by professional software engineers to confirm task solvability and test correctness. Addresses complaints that some Lite tasks were ambiguous or had flawed test oracles.
- **SWE-bench Live**: Uses issues created after model training cutoff dates, directly addressing data contamination. New issues are added on a rolling basis.
- **SWE-bench Pro**: Developed with Scale AI, featuring harder tasks that require cross-file reasoning, architectural understanding, and multi-step debugging.

### Current State of the Art (Early 2026)

On SWE-bench Verified, top agents have reached approximately 79% resolution rate (Sonar agent), up from roughly 30% when the benchmark launched in early 2024. Median cost per resolved issue has dropped to approximately $1.26, with average resolution time around 10.5 minutes. On SWE-bench Lite, top scores exceed 55%, though community attention has shifted to Verified as the primary metric.

### The Evaluation Pipeline

```
GitHub Issue Text --> Agent System --> Generated Patch --> Apply to Repo --> Run Test Suite --> Pass/Fail
```

The pipeline requires Docker-based sandboxing because each task needs its specific repository environment with correct dependencies. The SWE-bench harness handles environment setup, patch application, and test execution.

## Why It Matters

1. **Real-world grounding**: Unlike synthetic coding benchmarks, SWE-bench tasks come from actual developer workflows, making scores more interpretable as proxies for practical utility.
2. **End-to-end evaluation**: Agents must perform the full software engineering loop -- understanding the problem, navigating the codebase, planning a fix, implementing it, and implicitly verifying correctness -- not just code generation.
3. **Industry adoption**: SWE-bench scores have become the de facto metric for comparing coding agents (Devin, Cursor, OpenHands, Aider, etc.), influencing product decisions and funding.
4. **Difficulty calibration**: The range of task difficulty -- from single-line fixes to multi-file architectural changes -- provides signal across the agent capability spectrum.
5. **Contamination awareness**: The introduction of Live and the Rebench protocol demonstrate a maturing understanding of benchmark integrity in the AI evaluation community.

## Key Technical Details

- Tasks span 12 Python repositories; Django alone accounts for roughly 30% of instances
- Average gold patch modifies 2.3 files with a median of 40 changed lines
- Approximately 15% of tasks require modifying 4+ files
- The fail-to-pass test criterion means some tasks have only 1 decisive test while others have 20+
- SWE-bench Verified found that roughly 10% of original Lite tasks had issues with test oracles or task clarity
- Cost efficiency has improved roughly 10x from early 2024 to early 2026
- The Rebench protocol re-collects instances to create contamination-free evaluation sets

## Common Misconceptions

**"A 79% SWE-bench Verified score means the agent can resolve 79% of real bugs."** SWE-bench tasks are pre-filtered to have clear issue descriptions and verifiable test suites. Real-world issues are often vague, underspecified, or lack test coverage. Actual production performance is substantially lower.

**"Higher SWE-bench scores always mean a better coding agent."** Score improvements can come from better scaffolding (retries, test feedback loops, multi-agent architectures) rather than better code understanding. Two agents with the same score may have very different failure modes and cost profiles.

**"SWE-bench is Python-only, so it does not matter for other languages."** While the tasks are Python, the cognitive skills tested -- codebase navigation, debugging, patch generation -- transfer. Language-specific benchmarks like Aider's polyglot tests complement SWE-bench but do not replace it.

**"Data contamination has been solved by SWE-bench Live."** Live addresses direct memorization of solutions, but models may still benefit from having seen the repositories, coding patterns, and similar issues during training. Contamination exists on a spectrum.

## Connections to Other Concepts

- `benchmark-saturation-and-evolution.md` examines how SWE-bench Lite's rapid score inflation exemplifies benchmark lifecycle dynamics
- `real-world-vs-synthetic-benchmarks.md` positions SWE-bench as the canonical example of a real-world-derived benchmark
- `benchmark-design-methodology.md` discusses the design decisions behind SWE-bench's task selection and metric choices
- `tool-use-benchmarks.md` covers complementary benchmarks that evaluate the tool-use capabilities SWE-bench implicitly requires
- `../03-automated-evaluation-methods/code-execution-based-evaluation.md` details the test-suite-as-oracle approach SWE-bench pioneered
- `../01-foundations-of-agent-evaluation/outcome-vs-process-evaluation.md` discusses why SWE-bench's outcome-only metric misses trajectory quality

## Further Reading

- "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" -- Jimenez et al., 2024
- "SWE-bench Verified: A Validated Benchmark for Software Engineering Agents" -- Chowdhury et al., 2024
- "Rebench: Evaluating AI Agents on Real-World Software Issues at Scale" -- Beck et al., 2025
- "SWE-bench Pro: Challenging Software Engineering Benchmarks for Advanced AI Agents" -- Scale AI Research, 2025
- "OpenHands: An Open Platform for AI Software Developers as Generalist Agents" -- Wang et al., 2024
