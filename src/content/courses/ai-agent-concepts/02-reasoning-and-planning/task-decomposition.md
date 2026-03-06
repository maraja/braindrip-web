# Task Decomposition

**One-Line Summary**: Task decomposition breaks complex, ambiguous goals into atomic, executable subtasks, transforming vague instructions like "research topic X" into concrete sequences of retrievable, verifiable actions.

**Prerequisites**: Plan-and-execute pattern, agent loop fundamentals, tool use basics

## What Is Task Decomposition?

Consider how a chef prepares a complex banquet. The goal "prepare a five-course dinner for 20 guests" is not a single action; it is an umbrella that must be broken into courses, each course into recipes, each recipe into prep steps, and each prep step into individual actions (chop, measure, heat, combine). The chef also manages dependencies: the sauce must reduce before it can be plated, the oven must preheat before the roast goes in. This recursive breakdown of a high-level goal into a dependency-aware set of concrete actions is task decomposition.

For AI agents, task decomposition is the critical bridge between a user's intent and actionable steps. When a user says "research the current state of quantum computing and write a summary," the agent cannot execute this as a single action. It must decompose it: identify key subtopics (hardware, algorithms, error correction, commercial players), determine what information to gather for each, decide on search queries, retrieve and read sources, synthesize findings, and structure the output. The quality of this decomposition directly determines the quality of the final result.

![Agent overview showing task decomposition as part of the Planning component, with subtask chains and self-reflection](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Source: [Lilian Weng, "LLM Powered Autonomous Agents" (2023)](https://lilianweng.github.io/posts/2023-06-23-agent/) — Task decomposition is a core element of the Planning component in agent architectures.*

Task decomposition is not merely listing steps in order. Sophisticated decomposition produces a directed acyclic graph (DAG) of subtasks with explicit dependencies, estimated resource requirements, and success criteria for each subtask. This structure enables parallel execution of independent branches, early detection of blocking dependencies, and intelligent replanning when a subtask fails.

## How It Works

### Recursive Decomposition

The most natural approach is top-down recursive decomposition. The agent takes the top-level goal and breaks it into 3-7 major subtasks. Each subtask is then examined: if it is still too complex to execute directly, it is further decomposed. This continues until every leaf node is an atomic action that can be completed with a single tool call or a simple reasoning step.

Example for "Research the impact of remote work on productivity":
```
Level 0: Research remote work and productivity
  Level 1.1: Find meta-analyses and systematic reviews (2020-2024)
    Level 2.1.1: Search Google Scholar for "remote work productivity meta-analysis"
    Level 2.1.2: Search Semantic Scholar for recent systematic reviews
    Level 2.1.3: Read and extract key findings from top 5 results
  Level 1.2: Identify key metrics used to measure productivity
    Level 2.2.1: Search for "remote work productivity metrics"
    Level 2.2.2: Categorize metrics (output-based, time-based, self-reported)
  Level 1.3: Gather counterarguments and limitations
    Level 2.3.1: Search for "remote work productivity criticism"
    Level 2.3.2: Identify common confounding variables
  Level 1.4: Synthesize findings into structured summary
```

### DAG Structure and Dependencies

Real task decompositions are not simple linear sequences. They form DAGs where some subtasks depend on others and some can run in parallel. Representing tasks as a DAG enables:

- **Parallel execution**: Independent subtasks (e.g., searching different databases) can run simultaneously
- **Critical path identification**: The longest chain of dependent subtasks determines minimum completion time
- **Failure isolation**: If one branch fails, independent branches can still complete

Dependencies are typed: data dependencies (subtask B needs output from subtask A), resource dependencies (subtask C needs the same API as subtask D, so they must be sequenced), and logical dependencies (subtask E only makes sense after subtask F confirms a hypothesis).

### Decomposition Strategies

**Top-down (goal-driven)**: Start from the goal and recursively break down. Best when the goal is well-understood and the domain structure is clear.

**Bottom-up (capability-driven)**: Start from available tools and capabilities, then figure out how to combine them to achieve the goal. Best when tools are constrained and the agent needs to work within fixed capabilities.

**Analogy-based**: Recall how similar tasks were decomposed in the past (from episodic memory or few-shot examples) and adapt the decomposition to the current task. Best when the agent has access to prior task traces.

### Granularity Calibration

The hardest part of decomposition is deciding when to stop: what counts as "atomic"? Too coarse, and the executor struggles with ambiguous steps. Too fine, and the plan becomes unwieldy with hundreds of trivial actions. A good heuristic: a subtask is atomic if a single tool call plus a brief reasoning step can complete it and its success can be verified with a clear criterion.

## Why It Matters

### Enables Complex Task Completion

Without decomposition, agents are limited to tasks that fit within a single reasoning-action cycle. Decomposition is what allows agents to tackle research projects, multi-file code changes, data analysis pipelines, and other tasks that require sustained, structured effort across many steps.

### Improves Reliability Through Verification

Each subtask in a decomposition can have its own success criterion. This enables the agent to verify progress incrementally rather than only checking at the end. If subtask 3 of 8 produces incorrect results, the agent catches this immediately rather than propagating errors through five more steps.

### Supports Resource Estimation

A well-structured decomposition enables the agent to estimate total cost (in tokens, API calls, time) before beginning execution. This allows the system to warn users about expensive operations, choose cheaper execution strategies, or decline tasks that exceed resource budgets.

## Key Technical Details

- **Optimal decomposition depth**: 2-3 levels for most tasks; deeper decomposition has diminishing returns and increases planning overhead
- **Ideal subtask count per level**: 3-7 subtasks; fewer than 3 suggests the decomposition is too coarse, more than 7 suggests it needs another level of hierarchy
- **Decomposition prompt pattern**: "Break this goal into a numbered list of subtasks. Each subtask should be specific enough to execute with a single tool call. Include dependencies (which steps depend on which)."
- **Common failure**: Over-decomposition where the agent generates 20+ trivially small steps, spending more tokens on planning than execution would require
- **Dependency representation**: Often stored as a list of (task_id, depends_on: [task_ids]) pairs, enabling topological sort for execution ordering
- **Verification criteria**: Each subtask should specify what "done" looks like, e.g., "Search returns at least 3 relevant results" or "Summary is 200-300 words and covers all three perspectives"
- **Adaptive decomposition**: Start with coarse decomposition, then further decompose only those subtasks that the executor identifies as too complex during execution

## Common Misconceptions

- **"Decomposition is just making a to-do list."** A to-do list is a flat, ordered sequence. Proper decomposition produces a DAG with dependencies, verification criteria, and hierarchical structure. The dependency graph is what makes decomposition powerful.

- **"The LLM should decompose the entire task before starting any work."** For exploratory tasks, full upfront decomposition is impossible because later steps depend on discoveries made in earlier steps. Partial decomposition with lazy expansion of later steps is often more practical.

- **"Smaller subtasks are always better."** Over-decomposition creates overhead: more planning tokens, more context management, more opportunities for the plan to drift. The goal is the right granularity, not the finest granularity.

- **"Task decomposition is only for multi-step tasks."** Even seemingly simple tasks benefit from decomposition when reliability matters. "Answer this question" can be decomposed into "search for evidence," "verify the source," "synthesize the answer," and "check for contradictions."

- **"The decomposition must be perfect upfront."** Decomposition is iterative. The initial decomposition is a hypothesis about the task structure. Execution reveals whether the decomposition was right, and replanning adjusts it.

## Connections to Other Concepts

- `plan-and-execute.md` — Plan-and-Execute uses task decomposition as its planning phase; the decomposed plan is what gets executed step by step
- `tree-search-and-branching.md` — When multiple decomposition strategies are possible, tree search can explore alternative decompositions to find the best one
- `react-pattern.md` — Each leaf-level subtask in a decomposition can be executed using a ReAct loop for grounded reasoning
- `error-detection-and-recovery.md` — Verification criteria on each subtask enable early error detection; failed subtasks trigger replanning of downstream dependencies
- `memory-architecture-overview.md` — Past decompositions stored in episodic memory can inform future decomposition of similar tasks

## Further Reading

- Khot, T., Trivedi, H., Finlayson, M., et al. (2022). "Decomposed Prompting: A Modular Approach for Solving Complex Tasks." Demonstrates systematic decomposition strategies for LLM-based problem solving.
- Zhou, A., Yan, K., Shlapentokh-Rothman, M., et al. (2022). "Least-to-Most Prompting Enables Complex Reasoning in Large Language Models." Progressive decomposition from simple to complex subproblems.
- Wei, J., et al. (2022). "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models." While focused on CoT, the paper's examples demonstrate implicit decomposition within reasoning traces.
- Dohan, D., Xu, W., Lewkowycz, A., et al. (2022). "Language Model Cascades." Explores how decomposed tasks can be distributed across different models based on subtask difficulty.
