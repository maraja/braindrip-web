# Planning Quality Assessment

**One-Line Summary**: Evaluating the quality of an agent's plans before execution begins, measuring completeness, feasibility, efficiency, and robustness as predictors of downstream success.

**Prerequisites**: `trajectory-quality-metrics.md`, `../ai-agent-concepts/08-evaluation-and-testing/trajectory-evaluation.md`

## What Is Planning Quality Assessment?

Think of an architect reviewing blueprints before construction starts. A good blueprint accounts for structural loads, plumbing routes, electrical wiring, emergency exits, and local building codes. A poor blueprint might look elegant but omit the stairwell or specify materials that don't exist. Catching these problems at the blueprint stage is orders of magnitude cheaper than discovering them during construction. Planning quality assessment applies this same principle to AI agents.

Planning quality assessment is the evaluation of an agent's generated plans prior to (or independent of) execution. Many modern agents produce explicit plans, whether as natural language outlines, structured task decompositions, or sequences of intended actions. Evaluating these plans as first-class artifacts reveals whether the agent understands the task, has identified the right subgoals, can anticipate obstacles, and has chosen a reasonable approach.

The key question planning assessment answers is: given this plan alone, how confident should we be that execution will succeed? This is distinct from evaluating the execution itself, though plan quality and execution quality are correlated. Research shows that plan quality explains 40-60% of variance in execution outcomes, making it one of the strongest single predictors of agent success.

## How It Works

### Plan Completeness (PC)

Plan Completeness measures whether the plan covers all necessary steps to achieve the goal:

```
PC = planned_necessary_steps / total_necessary_steps
```

A complete plan addresses every required subgoal. An incomplete plan omits steps that will eventually need to happen. Completeness is evaluated against a reference decomposition of the task into required subgoals, typically created by domain experts.

For example, a coding task plan that includes "read the codebase, identify the bug, write a fix, test the fix" but omits "update the documentation" and "handle edge cases" scores lower on completeness. Common completeness gaps include: missing error handling steps, omitting validation or testing, forgetting cleanup or teardown actions, and neglecting dependency ordering.

### Plan Feasibility (PF)

Plan Feasibility assesses whether the planned actions are actually possible given the agent's tools, permissions, and environmental constraints:

```
PF = feasible_planned_steps / total_planned_steps
```

A plan step is infeasible if it requires a tool the agent doesn't have, assumes permissions that aren't granted, depends on information that isn't available, or violates physical or logical constraints of the environment. Feasibility checking can be partially automated by validating planned tool calls against the tool registry and checking planned file operations against the filesystem state.

Typical feasibility scores range from 0.75-0.95 for frontier agents. The most common feasibility failures are: assuming tools have capabilities they don't (e.g., planning to use a search tool for write operations), planning actions that require intermediate results not yet computed, and underestimating resource constraints.

### Plan Efficiency (PE)

Plan Efficiency measures whether the plan takes a reasonably direct path to the goal:

```
PE = minimum_steps_for_plan_goals / planned_steps
```

An efficient plan avoids unnecessary steps, redundant operations, and circuitous approaches. Unlike Step Efficiency Ratio (which measures execution), Plan Efficiency evaluates the intended path. A PE of 1.0 indicates an optimally efficient plan; a PE of 0.5 means the plan includes twice as many steps as necessary.

Efficiency must be balanced against robustness. A plan that includes verification steps, checkpoints, or fallback branches is less efficient but may be more likely to succeed. The evaluation should account for this trade-off.

### Plan Robustness (PR)

Plan Robustness evaluates whether the plan accounts for potential failures, edge cases, and uncertainty:

Robustness is scored on a structured rubric:

- **Contingency coverage**: Does the plan include fallback actions for likely failure points? (0-3 scale)
- **Assumption explicitness**: Does the plan state its assumptions rather than leaving them implicit? (0-3 scale)
- **Edge case awareness**: Does the plan acknowledge and handle boundary conditions? (0-3 scale)
- **Information gathering**: Does the plan include verification steps before committing to irreversible actions? (0-3 scale)

```
PR = total_robustness_score / 12
```

Plans with PR > 0.7 typically include explicit "if X fails, then Y" structures, pre-execution validation steps, and acknowledgment of assumptions. Plans with PR < 0.3 are brittle: they assume everything will work perfectly.

### Plan-Execution Correlation

A critical meta-analysis is measuring how well plan quality predicts execution quality:

```
r(plan_quality, execution_success) = correlation coefficient
```

Across published benchmarks, this correlation ranges from r=0.45 to r=0.72 depending on the domain. Higher correlations indicate that planning is a genuine bottleneck and improving plans will improve outcomes. Lower correlations suggest that execution capabilities (tool use, error recovery) matter more than planning.

### When Planning Overhead Helps vs. Hurts

Not all tasks benefit from explicit planning. The planning value threshold depends on:

- **Task complexity**: Tasks with 5+ steps benefit significantly from planning; tasks with 1-2 steps see negligible benefit
- **Task reversibility**: Irreversible actions (sending emails, deploying code) benefit more from planning than reversible ones
- **Information availability**: Tasks where all information is available upfront benefit from planning; tasks requiring exploration benefit less from upfront plans
- **Time constraints**: Planning adds 15-40% overhead in tokens and time. Under strict time budgets, abbreviated or no planning can outperform full planning

Empirically, planning improves outcomes by 10-25% on complex multi-step tasks but decreases performance by 3-8% on simple single-step tasks due to unnecessary overhead and overthinking.

## Why It Matters

1. **Early failure detection**: Evaluating plans catches fundamental misunderstandings before the agent wastes execution resources. A plan that omits a critical step will fail no matter how well the execution proceeds.
2. **Reduced evaluation cost**: Plan evaluation is cheaper than execution evaluation because plans are shorter, don't require environment setup, and can be assessed by human reviewers or LLM judges without running the agent.
3. **Architectural feedback**: Plan quality assessment reveals whether an agent's planning module is the performance bottleneck, guiding investment in planning improvements vs. execution improvements.
4. **Alignment signal**: Plans make the agent's intent legible. A plan that includes "delete all test files" to fix a bug reveals a misaligned strategy that outcome evaluation might miss if the tests happen to pass.

## Key Technical Details

- Plan Completeness requires reference task decompositions; these take 15-30 minutes per task to create and should be validated by 2+ domain experts
- LLM-as-judge for plan quality (using GPT-4-class models) achieves 70-78% agreement with human expert assessments, sufficient for large-scale screening but not for final evaluation
- The optimal plan granularity is 1 plan step per 2-3 execution steps; finer-grained plans are more complete but harder to assess and execute
- Plans generated by chain-of-thought prompting score 15-20% higher on completeness than plans generated by direct prompting
- Plan Robustness is the metric most strongly correlated with error recovery success (r=0.61), confirming that good planning anticipates failures
- Evaluation datasets should include tasks spanning low complexity (3-5 steps), medium complexity (6-12 steps), and high complexity (13+ steps) to test planning across difficulty levels

## Common Misconceptions

**"Longer plans are better plans."** Length is not quality. Verbose plans often include unnecessary steps that reduce efficiency without improving completeness. The best plans are comprehensive but concise, covering all necessary steps without padding.

**"Plans should be evaluated in isolation from the agent's capabilities."** A plan to "use the internet search tool to find documentation" is only feasible if the agent has a search tool. Plan evaluation must account for the agent's actual toolset and capabilities, not an idealized set.

**"If the agent succeeds without a plan, planning evaluation is irrelevant."** Agents can succeed on easy tasks without planning through reactive step-by-step reasoning. But this approach fails to scale to complex tasks. Planning evaluation identifies whether an agent has the capability to handle increasing complexity.

**"Good plans guarantee good execution."** Plans are necessary but not sufficient. An agent might generate a perfect plan and then fail during execution due to tool errors, hallucinated parameters, or environmental changes. Plan quality and execution quality are correlated but not identical.

## Connections to Other Concepts

- `trajectory-quality-metrics.md` measures execution quality, which plan quality partially predicts; comparing plan metrics to execution metrics reveals the plan-execution gap
- `error-recovery-evaluation.md` assesses Plan Robustness in action: do the contingencies planned actually work when errors occur?
- `tool-use-correctness.md` evaluates whether planned tool usage is correct, a key component of Plan Feasibility
- `comparative-trajectory-analysis.md` can compare plans across agent versions to diagnose whether performance changes stem from planning or execution differences
- `process-reward-models.md` can be trained to score plan steps, providing automated plan quality assessment

## Further Reading

- "Understanding the Effects of RLHF on LLM Summarisation" -- Stiennon et al., 2020
- "Tree of Thoughts: Deliberate Problem Solving with Large Language Models" -- Yao et al., 2023
- "Plan-and-Solve Prompting" -- Wang et al., 2023
- "LLM+P: Empowering Large Language Models with Optimal Planning Proficiency" -- Liu et al., 2023
- "On the Planning Abilities of Large Language Models" -- Valmeekam et al., 2023
