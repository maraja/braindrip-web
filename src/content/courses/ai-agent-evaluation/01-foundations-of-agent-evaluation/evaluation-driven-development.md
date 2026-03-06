# Evaluation-Driven Development

**One-Line Summary**: The most effective agent development methodology starts with a small set of real failure cases, builds evaluations around them, iterates the agent against those evaluations, and continuously expands the eval suite from production incidents -- yet 29.5% of teams run no evaluations at all.

**Prerequisites**: `why-agent-evaluation-is-hard.md`, `outcome-vs-process-evaluation.md`, `evaluation-dimensions-taxonomy.md`

## What Is Evaluation-Driven Development?

Think of evaluation-driven development (EDD) as test-driven development (TDD) adapted for probabilistic, non-deterministic systems. In TDD, you write a failing test, write code to make it pass, then refactor. In EDD, you collect real failure cases, build evaluation tasks around them, improve your agent until it handles those cases, then expand the eval suite as new failures emerge.

The key insight, championed by teams at Anthropic, OpenAI, and leading agent startups, is that you should not start by building a comprehensive benchmark. You should start by understanding how your agent fails in practice, then build targeted evaluations that measure whether those failures are fixed. A curated set of 20-50 high-signal failure cases provides more actionable signal than 1,000 synthetic benchmarks.

This methodology inverts the typical development flow. Instead of building an agent and then evaluating it, you build evaluations first and then build the agent to satisfy them. This ensures that every development cycle is grounded in real user needs rather than abstract capability metrics.

## How It Works

### The EDD Cycle

The evaluation-driven development cycle has four phases:

#### Phase 1: Failure Collection (Start Here)

Begin by collecting 20-50 real failure cases from your agent's target domain. Sources include:

- **Manual testing**: Use the agent yourself on realistic tasks and document every failure
- **User reports**: Collect bug reports, complaints, and support tickets from early users
- **Production logs**: Analyze traces where the agent produced incorrect or suboptimal results
- **Adversarial probing**: Deliberately try to break the agent with edge cases

Each failure case should be documented with:
- The input/task description
- What the agent did (the actual trajectory)
- What the agent should have done (the expected behavior)
- Why it matters (severity, frequency, user impact)

**Anthropic's approach with Claude Code**: The initial evaluation suite was not built from synthetic coding problems. It was built from real failures observed during internal use -- cases where the agent was too verbose, edited the wrong file, over-engineered a simple change, or failed to ask clarifying questions.

#### Phase 2: Eval Construction

Convert failure cases into reproducible, automated evaluation tasks:

1. **Define the input**: A task description, relevant context, and initial environment state
2. **Define success criteria**: What constitutes a passing result? Use test-based verification, constraint checks, or LLM-as-judge rubrics (see `multiple-valid-solutions.md`)
3. **Define the environment**: Sandbox, file system state, available tools, mock APIs
4. **Define failure modes**: What specific incorrect behaviors should be penalized?

**Practical example from Claude Code's eval suite evolution:**

| Phase | Eval Focus | Example Checks |
|-------|-----------|----------------|
| Early | Basic functionality | Does it edit the correct file? Does the code compile? |
| Middle | Quality dimensions | Is the output concise? Does it avoid unnecessary changes? |
| Late | Subtle behaviors | Does it detect over-engineering? Does it ask questions when context is ambiguous? |

The evolution from "does it work" to "does it work well" to "does it work wisely" reflects maturation of the evaluation suite alongside the agent.

#### Phase 3: Agent Improvement

With evaluations in place, iterate on the agent:

- **Prompt engineering**: Adjust system prompts, few-shot examples, and instructions
- **Tool design**: Modify tool interfaces, add guardrails, improve error messages
- **Architecture changes**: Add planning steps, verification loops, or memory systems
- **Model selection**: Test different LLM backends or configurations

Each change is validated against the eval suite. The eval suite provides a clear answer: did this change help, hurt, or have no effect? Without it, development degenerates into subjective judgment calls.

**Critical rule**: Never modify evaluations to make them easier when the agent fails. The temptation is strong -- "this eval is too hard" or "no agent could handle this case." Resist it. If the eval represents a real user need, the agent must improve to meet it.

#### Phase 4: Expansion from Production

Once the agent is deployed, new failure modes will emerge:

- Tasks the eval suite did not cover
- Edge cases from diverse users
- Environment conditions not anticipated during development
- Adversarial inputs from real-world usage

Feed these back into Phase 1, creating new evaluation cases. This creates a virtuous cycle: production experience improves evaluations, better evaluations improve the agent, the improved agent handles more production cases, revealing subtler failure modes.

### Industry Reality: The Evaluation Gap

Despite the clear value of evaluations, adoption is alarmingly low:

- **29.5% of teams** building AI agents run no evaluations at all (Galileo AI Industry Survey, 2024)
- **44%** rely solely on manual/human evaluation with no automated pipeline
- **Only 26.5%** have automated evaluation integrated into their development workflow

This means nearly three-quarters of agent development teams are either flying blind or relying on subjective human judgment that does not scale.

Common reasons for the evaluation gap:
- "We do not know what to evaluate" -- EDD solves this by starting from failures, not from abstract metrics
- "Evaluation is too expensive" -- A focused 20-50 case eval suite costs far less than a comprehensive benchmark
- "Our task is too unique for standard benchmarks" -- That is exactly why you need custom evaluations
- "We will add evals later" -- Technical debt compounds. Agents developed without evals are harder to evaluate retroactively

### Case Study: Claude Code's Eval Suite

Claude Code's evaluation system illustrates EDD in practice:

**Starting point**: A handful of evals checking basic coding capabilities -- can the agent edit files, run commands, and produce valid code?

**Evolution**: As usage expanded, the team observed patterns:
- Users complained about overly verbose output -- added concision evaluations
- The agent sometimes made unnecessary changes to unrelated files -- added scope evaluations
- Simple tasks received architecturally complex solutions -- added over-engineering detection evaluations
- The agent failed to ask clarifying questions on ambiguous tasks -- added clarification evaluations

**Current state**: The eval suite spans multiple dimensions:
- **Functional correctness**: Does the code work? Do tests pass?
- **Concision**: Is the response appropriately brief?
- **Scope discipline**: Does the agent change only what is necessary?
- **Complexity calibration**: Is the solution's complexity proportional to the task?
- **Error handling**: Does the agent recover gracefully from failures?
- **Multi-file coherence**: Are changes across files consistent?

Each evaluation was added in response to a specific observed failure, not from a theoretical taxonomy.

### Building Your First Eval Suite

A practical starting recipe:

1. **Days 1-3**: Use the agent on 30-50 tasks from your target domain. Document every failure, surprise, or suboptimal behavior.
2. **Days 4-7**: Select the 20 most important failures. Convert them into reproducible eval tasks with clear pass/fail criteria.
3. **Day 8+**: Run the eval suite after every significant change to the agent. Track metrics over time.
4. **Ongoing**: Add 2-5 new eval cases per week from production observations.

The 20-50 case starting point is not arbitrary. It is large enough to cover major failure modes and small enough to build in a week. Teams that try to build 500-case suites before launching never launch. Teams that start with 20 cases and expand iteratively ship better agents faster.

## Why It Matters

1. **Evaluations are the only objective measure of progress.** Without them, agent development is driven by intuition, anecdotes, and recency bias. EDD provides a quantitative progress signal.
2. **Evaluations prevent regressions.** Agent changes often have non-obvious side effects (see `compounding-errors-in-multi-step-tasks.md`). An eval suite catches regressions before users encounter them.
3. **Evaluations enable team scaling.** When multiple engineers work on an agent, shared evaluations ensure everyone is optimizing for the same objectives and changes are compatible.
4. **Evaluations compound in value.** Every eval case added makes the suite more comprehensive. Over months, a diligently maintained eval suite becomes the team's most valuable asset -- a precise specification of what the agent should and should not do.
5. **Starting from failures is more efficient than starting from theory.** Theoretical evaluation taxonomies are useful (see `evaluation-dimensions-taxonomy.md`) but can lead to evaluation suites that miss the specific failure modes that matter for your use case.

## Key Technical Details

- The recommended starting size of 20-50 eval cases is based on Anthropic's internal guidance and industry best practices from teams at Vercel, Cursor, and Cognition
- Eval run time should be under 30 minutes for the full suite to enable tight iteration loops; longer suites should be run nightly
- Cost of running a 50-case eval suite with a frontier model: approximately $25-$100 per full run
- Version control your eval suite alongside your agent code -- evals are code
- Track eval metrics over time in a dashboard; trend lines matter more than absolute numbers
- Consider separating "fast evals" (run on every commit, 5-10 minutes) from "deep evals" (run nightly or weekly, 30-120 minutes)

## Common Misconceptions

**"You need a large benchmark before you can evaluate."** This is the single most damaging misconception in agent development. Waiting for a perfect, comprehensive benchmark delays all progress. Start with 20 cases from real failures and expand. Imperfect evaluations are infinitely better than no evaluations.

**"Public benchmarks are sufficient for development."** Public benchmarks like SWE-bench measure general capability but not your specific use case. An agent that scores well on SWE-bench may fail on your codebase's conventions, your team's workflow, or your users' typical requests. Custom evaluations are necessary.

**"Evaluations should be synthetic and diverse."** Synthetic evaluations -- generated from templates or by LLMs -- can pad out a suite but often lack the specificity and realism of cases derived from actual failures. Prioritize real cases. Use synthetic generation only to increase coverage of validated failure patterns.

**"Once built, evaluations do not need maintenance."** Eval suites decay. As the agent improves, easy evals become uninformative. As the product evolves, old evals become irrelevant. Budget 10-20% of development time for eval maintenance: adding new cases, retiring saturated ones, and updating criteria.

## Connections to Other Concepts

- `why-agent-evaluation-is-hard.md` -- EDD is a practical methodology for navigating the fundamental challenges
- `outcome-vs-process-evaluation.md` -- eval cases should include both outcome checks and process checks
- `evaluation-dimensions-taxonomy.md` -- the taxonomy guides which dimensions to add evals for as the suite matures
- `the-non-determinism-problem.md` -- EDD must account for non-determinism by running evals multiple times
- `multiple-valid-solutions.md` -- eval criteria must allow for multiple valid solutions rather than exact-match checking
- `../08-evaluation-tooling-and-infrastructure/eval-pipeline-architecture.md` -- technical infrastructure for running EDD pipelines
- `../09-production-evaluation-and-monitoring/production-monitoring-for-agents.md` -- closing the loop from production back to evaluations

## Further Reading

- "Building Effective Agents" -- Anthropic, 2024
- "A Practical Guide to Building AI Agents with Claude" -- Anthropic, 2025
- "Evaluation-Driven Development for LLM Applications" -- Hamel Husain, 2024
- "The State of AI Agent Evaluation" -- Galileo AI Industry Survey, 2024
- "How We Build Claude Code: Agent Engineering Practices" -- Anthropic Engineering Blog, 2025
