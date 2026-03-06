# Why Agent Evaluation Is Hard

**One-Line Summary**: Evaluating AI agents is fundamentally harder than evaluating language models or traditional software because agents operate in open-ended environments with non-deterministic behavior, multi-step compounding errors, and multiple valid solution paths.

**Prerequisites**: None (this is an entry point)

## What Is the Agent Evaluation Problem?

Imagine testing a human employee. You cannot simply check their answers on a written exam -- you need to observe them handling ambiguous requests, recovering from mistakes, coordinating with colleagues, and making judgment calls under uncertainty. Now imagine that employee behaves slightly differently every time you give them the same task. That is the agent evaluation problem.

Traditional LLM evaluation is comparatively straightforward: give the model a prompt, collect the output, compare it to a reference answer. You can evaluate thousands of completions per minute with string matching or embedding similarity. Traditional software testing is even simpler -- the same input deterministically produces the same output, and you write assertions that either pass or fail.

Agent evaluation breaks both paradigms. An agent interacts with external environments, makes sequences of decisions, uses tools, and produces results through trajectories that may differ across runs even with identical inputs. The evaluation surface is not a single output string but an entire execution trace spanning minutes or hours of autonomous operation.

## How It Works

### The Six Fundamental Challenges

Agent evaluation must contend with challenges that do not arise -- or arise only weakly -- in simpler evaluation settings.

### 1. Non-Determinism

LLM-based agents use sampling (temperature > 0) to generate actions. Even at temperature 0, floating-point non-determinism in GPU operations can produce different outputs. External APIs return different data at different times. File systems and databases change state between runs. The result: running the same agent on the same task twice may produce different outcomes. Research from the tau-bench benchmark (Yao et al., 2024) showed that single-run pass rates can overestimate or underestimate true agent capability by 10-20 percentage points. See `the-non-determinism-problem.md` for a thorough treatment.

### 2. Multi-Step Error Compounding

If an agent has a 95% chance of executing each individual step correctly, a 10-step task drops to roughly $0.95^{10} \approx 60\%$ success probability. A 20-step task falls to $0.95^{20} \approx 36\%$. This exponential decay means that agents which appear competent on short tasks may fail catastrophically on realistic workflows. Traditional software does not have this property because each function either works or it does not -- there is no probabilistic degradation. See `compounding-errors-in-multi-step-tasks.md` for the full mathematical treatment.

### 3. Multiple Valid Solution Paths

Ask an agent to "refactor this module for better performance" and there are dozens of legitimate approaches. Reference-based evaluation -- comparing output to a gold standard -- fails when the space of correct answers is large or ill-defined. A coding agent might solve a bug by patching the function, rewriting the module, or adding a workaround upstream. All three could be correct. This is covered in depth in `multiple-valid-solutions.md`.

### 4. Environment Interaction and Side Effects

Agents do not just produce text; they modify file systems, call APIs, execute code, send messages, and alter database state. Evaluating these side effects requires environment instrumentation far beyond output comparison. You need sandbox environments, state diffing tools, and sometimes human review of changed artifacts.

### 5. Emergent System-Level Behavior

An agent is a system composed of an LLM, a prompt, tools, memory, and orchestration logic. Changing any one component can produce non-obvious effects on the whole. A prompt tweak that improves coding accuracy might degrade the agent's ability to ask clarifying questions. A tool upgrade might change the agent's planning strategy. Evaluation must capture these system-level interactions, not just component-level performance.

### 6. Benchmark Contamination

LLMs are trained on vast internet corpora that increasingly include benchmark datasets, agent traces, and evaluation results. The HumanEval coding benchmark, for instance, has been widely discussed and reproduced online since its 2021 release. Agents evaluated on contaminated benchmarks may appear more capable than they are in novel situations. LiveCodeBench (Jain et al., 2024) addresses this by using only problems released after training cutoffs.

## Why It Matters

1. **Overestimated capability leads to deployment failures.** If evaluation is too easy or too narrow, agents get deployed into production where they fail on real-world complexity. The 2024 METR report found significant gaps between benchmark performance and real-world task completion.
2. **Underestimated capability wastes resources.** Overly strict evaluation -- requiring exact match to a single reference solution -- penalizes creative and valid agent behavior, causing teams to over-engineer solutions to non-problems.
3. **Safety depends on evaluation rigor.** Agents that modify code, send emails, or interact with production systems can cause real harm. Evaluation must catch dangerous behaviors before deployment, not after incidents.
4. **Investment decisions require honest measurement.** Organizations making build-vs-buy decisions about agent tooling need reliable evaluation to compare options. Misleading benchmarks distort the market.
5. **Iterative improvement requires signal.** Without evaluation that provides clear, actionable signal, teams cannot systematically improve their agents. They resort to vibes-based development.

## Key Technical Details

- Single-run evaluation can differ from true pass rate by 10-20 percentage points (tau-bench findings)
- SWE-bench Verified, the most widely cited coding agent benchmark, contains 500 curated GitHub issues -- but real-world coding involves far more task diversity
- The cost of a single SWE-bench evaluation run can exceed $500 in API calls for frontier models
- Benchmark saturation is accelerating: HumanEval went from ~30% (2021) to >95% (2024) in three years
- Agent evaluation often requires 5-10x more infrastructure than LLM evaluation due to sandboxing, environment setup, and state management

## Common Misconceptions

**"Agent evaluation is just LLM evaluation with extra steps."** LLM evaluation checks input-output mappings. Agent evaluation must assess sequential decision-making, tool use, error recovery, and environment interaction over extended trajectories. The evaluation surface is qualitatively different, not just quantitatively larger.

**"Higher benchmark scores mean better real-world performance."** Benchmark scores measure performance on a specific task distribution under specific conditions. Agents that optimize for SWE-bench may learn patterns specific to GitHub issue resolution that do not transfer to internal codebases, legacy systems, or novel problem types.

**"You can evaluate agents by evaluating their components."** An agent with a state-of-the-art LLM backbone, best-in-class retrieval, and excellent tools can still fail as a system if the orchestration logic is poor, the prompt engineering is misaligned, or the components interact badly. System-level evaluation is irreducible.

**"Deterministic tests are sufficient."** Even if you make the LLM sampling deterministic (temperature = 0), external environment non-determinism, timing effects, and API variability mean that end-to-end agent behavior is inherently stochastic. Statistical evaluation with multiple runs is not optional -- it is necessary.

## Connections to Other Concepts

- `the-non-determinism-problem.md` -- deep dive into variance sources and statistical methods
- `compounding-errors-in-multi-step-tasks.md` -- mathematical treatment of multi-step degradation
- `multiple-valid-solutions.md` -- evaluation methods for open-ended tasks
- `outcome-vs-process-evaluation.md` -- the core tension in what to measure
- `evaluation-dimensions-taxonomy.md` -- the full space of what can be measured
- `evaluation-driven-development.md` -- practical methodology for building evaluation into agent development
- `../02-benchmark-ecosystem/swe-bench-deep-dive.md` -- detailed analysis of the most prominent coding agent benchmark

## Further Reading

- "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" -- Jimenez et al., 2024
- "tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains" -- Yao et al., 2024
- "LiveCodeBench: Holistic and Contamination-Free Evaluation of Large Language Models for Code" -- Jain et al., 2024
- "Evaluating Language-Model Agents on Realistic Autonomous Tasks" -- METR, 2024
- "Do Agents Dream of Electric Benchmarks? A Systematic Review of Agent Evaluation" -- Survey, 2024
