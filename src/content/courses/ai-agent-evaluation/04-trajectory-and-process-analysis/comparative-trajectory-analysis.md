# Comparative Trajectory Analysis

**One-Line Summary**: Systematic methods for comparing agent trajectories across versions, configurations, or models to diagnose performance differences and identify regression points.

**Prerequisites**: `trajectory-quality-metrics.md`, `process-reward-models.md`, `tool-use-correctness.md`

## What Is Comparative Trajectory Analysis?

Consider a car manufacturer testing a new engine design. They don't just check whether the new car reaches the finish line; they instrument every aspect of both the old and new engines, comparing torque curves, fuel injection timing, exhaust temperatures, and vibration patterns. When the new engine underperforms, they can pinpoint exactly which component diverges from the old design. Comparative trajectory analysis gives AI agent developers the same diagnostic power.

Comparative trajectory analysis is the systematic comparison of execution trajectories across different agent versions, configurations, model backbones, or prompting strategies. Rather than comparing only aggregate scores ("Agent A scores 72%, Agent B scores 68%"), it aligns and compares the step-by-step execution paths to identify exactly where and why performance differs. This transforms opaque performance numbers into actionable engineering insights.

The motivation is practical: when you upgrade a model, change a prompt, or modify an agent's architecture, you need to understand what changed and why. A 4% score drop could be caused by worse planning, degraded tool use, reduced error recovery, or dozens of other factors. Without trajectory comparison, debugging is guesswork. With it, debugging becomes systematic.

## How It Works

### Trajectory Alignment

Before comparing trajectories, corresponding steps must be aligned. Two trajectories for the same task will rarely have identical step counts or exact step correspondence. Alignment establishes which steps in Trajectory A correspond to which steps in Trajectory B.

**Semantic alignment** matches steps based on their intent or effect rather than their position. A step that reads a file is aligned with another step that reads the same file, regardless of when it occurs. This uses embeddings of step descriptions or actions, with alignment computed via dynamic time warping or optimal transport:

```
alignment_cost = min_π Σ_i distance(step_A[i], step_B[π(i)])
```

where π is a mapping from steps in A to steps in B that preserves ordering.

**Anchor-based alignment** identifies shared milestone steps (tool calls with identical parameters, identical reasoning conclusions, same subgoal completions) and uses these as anchors, interpolating alignment between them. This is more robust than pure semantic alignment for long trajectories.

**Phase alignment** groups steps into task phases (planning, information gathering, execution, verification) and aligns within phases. This prevents cross-phase misalignment where a planning step in one trajectory aligns with an execution step in another.

Typical alignment accuracy with semantic methods is 80-88% at the step level. Anchor-based alignment achieves 85-92% when anchors are available for at least 30% of steps.

### Divergence Analysis

Once trajectories are aligned, divergence analysis identifies where they differ:

**Action divergence**: At aligned positions, do the agents take different actions? Action divergences are categorized as:
- Tool selection divergence: Different tool chosen for the same subgoal
- Parameter divergence: Same tool but different parameters
- Strategy divergence: Fundamentally different approaches to the same subgoal
- Ordering divergence: Same actions in different sequence

**Reasoning divergence**: At aligned positions, do the agents reason differently? This examines the chain-of-thought or reasoning traces for:
- Different beliefs about the current state
- Different interpretations of previous results
- Different subgoal selection
- Different confidence levels

**Outcome divergence**: At aligned positions, do the agents achieve different step-level results? One agent may successfully complete a step while the other fails, or both may succeed but with different quality levels.

A divergence profile summarizes the distribution of divergence types:

```
divergence_profile = {
  tool_selection: 12%,
  parameter: 28%,
  strategy: 15%,
  ordering: 8%,
  reasoning: 22%,
  outcome: 15%
}
```

### Regression Point Identification

The most valuable application of comparative trajectory analysis is identifying regression points: the specific step where a new agent version starts underperforming.

**First divergence method**: Identify the earliest aligned step where the trajectories diverge. This is the simplest approach but may flag benign divergences (different but equally valid approaches).

**Quality-weighted divergence**: Weight each divergence by its impact on subsequent steps. A divergence at step 5 that leads to 10 subsequent failures is more important than a divergence at step 3 that has no downstream impact. The regression point is the divergence with the highest downstream impact:

```
impact(divergence_t) = Σ_{s>t} quality_delta(step_s)
```

**Causal attribution**: Run counterfactual experiments where the new agent's trajectory is modified to match the old agent's choice at specific divergence points. If overriding the new agent's choice at step t restores downstream performance, step t is the causal regression point. This is expensive (requires re-running from intermediate states) but provides the strongest evidence.

### Diagnostic Categories

Trajectory comparison naturally categorizes performance differences into actionable diagnostic buckets:

**Planning regression**: Divergences concentrated in early planning phases. Symptoms: different task decomposition, missing subgoals, different prioritization. Intervention: improve planning prompts or planning module.

**Tool use regression**: Divergences concentrated in tool selection and parameterization. Symptoms: wrong tool choices, malformed parameters, misinterpreted results. Intervention: improve tool documentation, few-shot examples, or tool-use training.

**Error recovery regression**: Divergences emerge after error encounters. Symptoms: new version handles failures worse, spirals more frequently, takes longer to recover. Intervention: improve error handling prompts or recovery training data.

**Reasoning regression**: Divergences in reasoning traces despite similar actions. Symptoms: less coherent reasoning, contradictory beliefs, worse information integration. Intervention: improve base model or reasoning scaffolding.

### Visualization Techniques

Effective trajectory comparison relies on visualization:

**Parallel timeline view**: Two trajectories displayed as parallel vertical timelines with alignment links between corresponding steps. Divergences are highlighted in color (red for regressions, yellow for neutral changes, green for improvements). This is the primary overview visualization.

**Step-level diff view**: For individual aligned step pairs, a side-by-side diff showing exactly what changed: different tool calls, different parameters, different reasoning text. Similar to code diffs but for agent behavior.

**Metric trajectory plots**: Line plots showing trajectory quality metrics (from `trajectory-quality-metrics.md`) computed cumulatively at each step. Where the lines diverge shows when quality started differing. Overlaying multiple metrics identifies whether the divergence is in efficiency, relevance, coherence, or tool accuracy.

**Divergence heatmap**: Tasks on one axis, trajectory positions on the other, with cell color indicating divergence severity. This reveals whether regressions are concentrated in specific task types or trajectory phases.

## Why It Matters

1. **Root cause diagnosis**: Aggregate metrics show that performance changed; comparative trajectory analysis shows why. This reduces debugging time from days of speculation to hours of targeted investigation.
2. **Regression prevention**: By identifying the specific capability that regressed, teams can add targeted tests for that capability, preventing future regressions in the same area.
3. **Architecture decisions**: Trajectory comparisons between agent architectures (e.g., ReAct vs. plan-then-execute) reveal which approach is better for which phase of task execution, informing hybrid designs.
4. **Confidence in deployment**: Before deploying a new agent version, trajectory comparison against the production version provides fine-grained confidence that improvements are genuine and regressions are understood and acceptable.

## Key Technical Details

- Semantic trajectory alignment requires embedding models; task-specific fine-tuned embeddings improve alignment accuracy by 8-12% over general-purpose embeddings
- Dynamic time warping alignment has O(n*m) complexity for trajectories of length n and m; for trajectories longer than 50 steps, approximate methods (FastDTW) are recommended
- Meaningful regression point identification requires at least 20-30 task instances to distinguish systematic regressions from per-task noise
- Counterfactual causal attribution requires environment checkpointing and replay capability; not all agent frameworks support this natively
- Visualization tools: custom implementations using D3.js or Plotly are common; no standardized trajectory comparison tool has achieved broad adoption
- Storage requirements for trajectory comparison: approximately 5-15 KB per step (including reasoning traces), or 50-300 KB per complete trajectory. A comparison corpus of 1000 task pairs requires 100-600 MB
- Automated divergence classification (planning vs. tool use vs. reasoning) achieves 72-80% agreement with human classification using LLM-based categorizers

## Common Misconceptions

**"Comparing final scores is sufficient for versioning decisions."** Final scores show what changed but not why or where. A new version with the same aggregate score might have improved planning but regressed in tool use. Without trajectory comparison, compensating changes mask regressions that will surface in different task distributions.

**"Trajectory alignment is straightforward."** Alignment is one of the hardest technical challenges in comparative analysis. Agents that take fundamentally different approaches to the same task may have no meaningful step-level alignment. In such cases, phase-level comparison is more appropriate than step-level comparison.

**"More divergence means worse performance."** Divergence is change, not necessarily regression. A new agent version might diverge in beneficial ways (better strategies, more efficient approaches). The analysis must qualify divergences as improvements, regressions, or neutral changes.

**"Trajectory comparison works best with identical tasks."** While identical tasks make comparison easiest, the technique also applies to similar tasks, task families, or even different tasks that share subtask structures. The alignment algorithms adapt to varying degrees of task similarity.

## Connections to Other Concepts

- `trajectory-quality-metrics.md` provides the per-step metrics used to score aligned steps and identify quality divergences
- `process-reward-models.md` can provide automated step-quality scores for both trajectories, enabling scalable comparison without human annotation
- `error-recovery-evaluation.md` specializes in comparing recovery behaviors, a common source of trajectory divergence
- `planning-quality-assessment.md` evaluates the planning phase that often drives early trajectory divergences
- `tool-use-correctness.md` provides the detailed tool use analysis needed when divergence is identified in tool interaction steps
- `specification-gaming-detection.md` can be informed by trajectory comparison: if a new version achieves higher scores through qualitatively different (suspicious) trajectories, gaming may be occurring

## Further Reading

- "Evaluating Large Language Models Trained on Code" -- Chen et al., 2021
- "A Survey on Evaluation of Large Language Models" -- Chang et al., 2024
- "Dynamic Time Warping for Sequence Comparison" -- Berndt and Clifford, 1994
- "Optimal Transport for Machine Learning" -- Peyre and Cuturi, 2019
- "Debugging Machine Learning Tasks with Comprehensive Trajectory Analysis" -- Amershi et al., 2015
