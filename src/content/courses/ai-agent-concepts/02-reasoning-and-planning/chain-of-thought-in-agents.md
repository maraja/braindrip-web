# Chain-of-Thought in Agents

**One-Line Summary**: Chain-of-thought reasoning within agent loops provides structured scratchpad space where agents reason through complex decisions before acting, reducing errors in multi-step tasks by making the reasoning process explicit and auditable.

**Prerequisites**: Chain-of-thought prompting basics, ReAct pattern, agent loop fundamentals

## What Is Chain-of-Thought in Agents?

Think of an experienced surgeon who narrates their thought process during a complex operation: "The bleeding is coming from the left hepatic artery. I need to clamp proximal to the injury before I can repair it. Let me first check the portal triad to confirm there are no anatomical variations." This verbal reasoning, spoken aloud (or thought internally), helps the surgeon organize their decisions, catch potential mistakes, and maintain situational awareness. The act of articulating the reasoning itself improves the quality of the decision.

Chain-of-thought (CoT) in agents is the practice of having the agent generate explicit intermediate reasoning steps before deciding on its next action. While CoT was originally introduced by Wei et al. (2022) for single-turn question answering, its application within agent loops is distinct and more nuanced. In an agent context, CoT serves as a scratchpad where the agent can: analyze the current state, recall relevant information, consider alternative actions, predict consequences, and justify the chosen action, all before committing to executing anything.

*Recommended visual: A comparison showing standard prompting (question -> answer) versus chain-of-thought prompting (question -> step-by-step reasoning -> answer) with higher accuracy — see [Wei et al., "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (2022)](https://arxiv.org/abs/2201.11903)*

This differs from standalone CoT prompting in a critical way: within an agent loop, the reasoning must be practical and action-oriented. The agent is not just solving a puzzle in isolation; it is deciding what to do next in a dynamic environment where actions have real consequences. The CoT in an agent loop must bridge the gap between the current observation and the next concrete action.

## How It Works

### Scratchpad Patterns

The most common implementation is a dedicated scratchpad section in the agent's prompt where it is instructed to reason before acting:

```
[Observation from previous action]

Scratchpad:
- The search returned 5 results about PostgreSQL performance
- Result #2 mentions TPC-C benchmarks showing 15% improvement in v16
- I still need MySQL benchmarks for a fair comparison
- The user specifically asked about web application workloads, so I should
  focus on OLTP benchmarks rather than analytical workloads

Next Action: search("MySQL TPC-C benchmark 2024 OLTP performance")
```

The scratchpad is consumed by the framework (parsed to extract the action) but the reasoning portion helps the model produce better actions by forcing it to think through the decision.

### Extended Thinking and Thinking Blocks

Modern LLM APIs provide explicit support for agent-level CoT through dedicated thinking blocks. Anthropic's extended thinking feature allocates a separate "thinking" section where the model can reason at length before producing its visible response. This is architecturally distinct from the main response: the thinking block can be much longer, is not shown to the user by default, and is optimized for internal reasoning.

In an agent loop, extended thinking might produce:

```
[Thinking Block - not visible to user]
The user wants me to refactor this function. Let me analyze:
1. The function currently handles both validation and processing - SRP violation
2. There are 3 callers: api_handler.py:45, cli.py:89, test_main.py:22
3. If I split the function, I need to update all 3 callers
4. The test file uses a mock, so I need to check if the mock interface changes
5. Best approach: extract validation into validate_input(), keep process() for logic
[End Thinking Block]

[Visible Response]
I'll refactor the function by extracting the validation logic...
```

### Structured Reasoning Formats

Some agent frameworks enforce specific reasoning structures:

**Goal-Status-Plan (GSP)**: At each step, the agent states the goal, the current status toward that goal, and the plan for the next action.

**Observation-Reflection-Action (ORA)**: The agent observes the current state, reflects on what it means, and then acts.

**Hypothesis-Test (HT)**: The agent forms a hypothesis about what action will produce the desired result, then tests it. Useful for debugging and exploratory tasks.

### CoT Length and Quality Trade-offs

Longer CoT generally produces better actions, but with diminishing returns and increasing token costs. Research shows:

- 0 reasoning tokens (direct action): Baseline performance
- 50-100 reasoning tokens: Significant improvement on multi-step tasks (20-40% error reduction)
- 100-500 reasoning tokens: Moderate additional improvement (10-20% error reduction)
- 500+ reasoning tokens: Minimal improvement, risk of overthinking and tangential reasoning

The optimal CoT length depends on task complexity. Simple tool calls need minimal reasoning; complex decisions with multiple constraints benefit from longer deliberation.

## Why It Matters

### Reduces Action Errors

In multi-step agent tasks, each action error can compound through subsequent steps. By reasoning before acting, the agent catches potential mistakes before they happen. Studies on code-generation agents show that requiring explicit reasoning before code edits reduces syntax errors by 30-50% and logical errors by 20-30%.

### Enables Debugging and Audit

When an agent makes a wrong decision, the CoT trace explains why. This is invaluable for debugging agent systems: instead of guessing why the agent chose action X over action Y, developers can read the reasoning and identify the flawed assumption or missing information. In regulated industries, this audit trail may be a compliance requirement.

### Improves Planning Within Steps

Even within a single ReAct step, CoT enables micro-planning: "Before I search, let me think about what keywords will be most effective" or "Before I edit this file, let me consider what other files might be affected." This within-step planning prevents the agent from taking hasty actions that require correction later.

## Key Technical Details

- **Token cost**: CoT typically adds 50-300 tokens per agent step; for a 10-step task, this is 500-3000 additional tokens, roughly 10-30% overhead on total token usage
- **Extended thinking budgets**: Anthropic's extended thinking allows up to 128K thinking tokens; most agent steps use 200-2000 thinking tokens effectively
- **Scratchpad visibility**: In production systems, the scratchpad is typically hidden from end users but logged for debugging. Some systems expose reasoning on demand for transparency
- **Few-shot CoT**: Including 1-2 examples of good reasoning in the agent prompt significantly improves reasoning quality compared to zero-shot "think step by step"
- **CoT faithfulness**: Research shows that CoT is not always faithful to the model's actual decision process; the model may post-hoc rationalize rather than genuinely reason. This affects interpretability claims
- **Format enforcement**: Structured output formats (JSON with a "reasoning" field) ensure the model always produces reasoning before acting, preventing cases where the model skips reasoning for "obvious" actions
- **Reasoning-action coupling**: Tight coupling (reasoning immediately followed by action in the same output) is more effective than loose coupling (reasoning in one call, action in another) because the reasoning context is maximally fresh

## Common Misconceptions

- **"CoT in agents is the same as CoT for question answering."** Agent CoT must be action-oriented and state-aware. It incorporates observations from the environment, tracks progress toward a goal, and produces a concrete next action. QA CoT just produces a final answer.

- **"More reasoning is always better."** Excessive reasoning can lead to analysis paralysis, where the agent overthinks and generates contradictory considerations that confuse the final action selection. CoT should be focused and goal-directed.

- **"CoT makes agent reasoning trustworthy."** CoT improves transparency but does not guarantee faithfulness. The model may produce plausible-sounding reasoning that does not reflect its actual decision process. CoT is a debugging aid, not a proof of correct reasoning.

- **"You need explicit CoT prompting for agents to reason."** Capable models reason implicitly even without explicit CoT prompting. However, explicit CoT tends to be more systematic and catches more edge cases, especially for complex multi-constraint decisions.

- **"Extended thinking replaces scratchpad patterns."** Extended thinking is one implementation of the scratchpad concept, but scratchpad patterns also include visible reasoning in the response, reasoning stored in memory, and multi-turn reasoning chains that span several agent steps.

## Connections to Other Concepts

- `react-pattern.md` — The "Thought" step in ReAct is a form of CoT; ReAct interleaves CoT with actions while pure CoT reasons without acting
- `inner-monologue.md` — Inner monologue is CoT that is specifically hidden from the user; it explores the design space of what to expose vs keep private
- `reflection-and-self-critique.md` — Reflection is backward-looking CoT (analyzing past actions), while standard CoT is forward-looking (planning next actions)
- `metacognition.md` — Metacognitive CoT reasons about the reasoning process itself: "Am I approaching this the right way?" rather than "What should I do next?"
- `world-models.md` — CoT can include mental simulation: "If I take action X, the result will likely be Y, because..." This leverages the agent's world model within the reasoning process

## Further Reading

- Wei, J., Wang, X., Schuurmans, D., et al. (2022). "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models." NeurIPS 2022. The foundational CoT paper.
- Nye, M., Andreassen, A., Gur-Ari, G., et al. (2021). "Show Your Work: Scratchpads for Intermediate Computation with Language Models." Early demonstration of scratchpad-style reasoning for multi-step computation.
- Anthropic. (2024). "Extended Thinking in Claude." Documentation on Anthropic's implementation of dedicated thinking blocks for agent reasoning.
- Wang, X., Wei, J., Schuurmans, D., et al. (2022). "Self-Consistency Improves Chain of Thought Reasoning in Language Models." Demonstrates that sampling multiple CoT paths and taking the majority vote improves reliability.
