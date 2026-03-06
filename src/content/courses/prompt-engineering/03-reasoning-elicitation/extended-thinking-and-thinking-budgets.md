# Extended Thinking and Thinking Budgets

**One-Line Summary**: Extended thinking gives LLMs a dedicated, often hidden, token budget for internal reasoning before producing a visible response, formalizing the insight that harder problems benefit from more "thinking time."
**Prerequisites**: `03-reasoning-elicitation/chain-of-thought-prompting.md`, `01-foundations/how-llms-process-prompts.md`, `01-foundations/context-window-mechanics.md`

## What Is Extended Thinking?

Imagine you ask someone a difficult question. If you demand an immediate answer, they might blurt out something plausible but wrong. If you give them five minutes to think, they will likely produce a much better answer. If you give them thirty minutes, they can work through edge cases, double-check their reasoning, and produce a thorough, well-considered response. Extended thinking applies this same principle to LLMs: instead of generating a response immediately, the model first generates a sequence of "thinking tokens" -- internal reasoning that may or may not be shown to the user -- before producing its final output.

This concept has been implemented differently by different providers. Anthropic's Claude models offer "extended thinking" as an API parameter where the model generates thinking tokens visible in a separate field. OpenAI's o1 and o3 models use "reasoning tokens" that are generated internally and hidden from the user, with only the final answer returned. Both approaches share the same underlying principle: allocating dedicated compute to reasoning before output. The key innovation is making the thinking budget an explicit, controllable parameter rather than an emergent property of prompt engineering.

Extended thinking represents a paradigm shift from prompt-level reasoning elicitation (like chain-of-thought) to model-level reasoning allocation. Instead of hoping the model will "show its work" based on prompt instructions, extended thinking guarantees that the model spends a specified amount of computation on reasoning before responding.

*Recommended visual: A stacked bar diagram showing token budget allocation for a single API call with extended thinking -- the bottom section (blue) represents input tokens (prompt/context), the middle section (orange) represents thinking tokens (internal reasoning), and the top section (green) represents output tokens (visible response) -- with the total bounded by the context window. Annotations show that thinking tokens are billed at output token rates.*
*Source: Adapted from Anthropic's "Extended Thinking in Claude" documentation, 2025, and OpenAI's "Learning to Reason with LLMs" blog, 2024.*

*Recommended visual: A benchmark comparison table showing performance of standard prompting vs. extended thinking models on AIME (competition math), SWE-bench (coding), and MMLU (knowledge), with percentage improvements of 10-30% annotated, illustrating that harder tasks benefit more from additional thinking budget.*
*Source: Adapted from Snell et al., "Scaling LLM Test-Time Compute Optimally," 2024, and Muennighoff et al., "s1: Simple Test-Time Scaling," 2025.*

## How It Works

### Thinking Tokens vs. Output Tokens

In extended thinking models, the total generation is divided into two categories: thinking tokens and output tokens.

Thinking tokens are the model's internal reasoning -- scratch work, hypothesis testing, self-correction, and deliberation. Output tokens are the final response shown to the user. The model generates thinking tokens first, then uses the accumulated reasoning context to produce the output.

In Anthropic's implementation, thinking tokens are accessible via a separate API field (`thinking` content block). In OpenAI's o1/o3, reasoning tokens are hidden and only the output is returned.

### Budget Allocation

Extended thinking introduces a new dimension of prompt engineering: budget allocation. Key decisions include how many thinking tokens to allocate (the "thinking budget"), how this interacts with the maximum output tokens, and when extended thinking is worth the cost.

Anthropic's API allows setting `budget_tokens` within the `thinking` parameter, specifying the maximum number of tokens the model can spend on reasoning. OpenAI's reasoning models have implicit budgets controlled by the `reasoning_effort` parameter (low, medium, high).

The budget allocation decision should be task-driven: allocate more budget for harder problems and less for simpler ones. Some production systems use a classifier to estimate task difficulty and dynamically set the thinking budget accordingly.

### When Extended Thinking Helps

Extended thinking provides the largest benefits on tasks that require genuine deliberation: complex mathematical proofs, multi-step code generation, intricate logical reasoning, nuanced analysis requiring weighing multiple factors, and tasks where the first intuition is often wrong.

Empirically, extended thinking models show 10-30% accuracy improvements on competition-level math (AIME, AMC) and coding benchmarks (SWE-bench) compared to their non-thinking counterparts. The improvement correlates with task complexity -- the harder the problem, the greater the benefit of additional thinking budget.

### When Extended Thinking Is Wasteful

For simple tasks -- factual recall, straightforward classification, template-based generation, or tasks where the model is already near-perfect -- extended thinking consumes tokens (and cost) without improving quality.

A simple question like "What is the capital of Japan?" does not benefit from 1,000 thinking tokens. In production, dynamically allocating thinking budgets based on estimated task complexity is an important optimization.

Wasteful thinking is not just a cost problem -- it can also degrade output quality. On simple tasks, excessive thinking budget can lead to overthinking, where the model second-guesses correct initial intuitions, finds edge cases that do not apply, or generates unnecessarily hedged responses.

## Why It Matters

### Formalized Inference-Time Compute Scaling

Extended thinking formalizes the insight from self-consistency, tree-of-thought, and other techniques that spending more compute at inference time can improve output quality. But instead of requiring external orchestration (multiple API calls, voting, tree search), extended thinking internalizes the additional computation within a single model call. This simplifies the engineering while achieving similar or better results.

### Controllable Quality-Cost Trade-off

By making the thinking budget an explicit parameter, extended thinking gives practitioners fine-grained control over the quality-cost trade-off. A coding task might warrant 10,000 thinking tokens; a simple formatting task might warrant none. This controllability is more nuanced than prompt-level techniques, where the amount of reasoning is determined by the model's generation dynamics rather than an explicit budget.

### Shifting the Prompt Engineering Landscape

Extended thinking changes what prompt engineering needs to accomplish. With thinking-enabled models, the prompt engineer's job shifts from eliciting reasoning (the model will reason internally regardless) to providing the right context, constraints, and goals. The emphasis moves from "how to make the model think" to "what to make the model think about" -- a shift toward context engineering.

### Democratizing Complex Problem Solving

Extended thinking makes complex reasoning accessible without the need for multi-call orchestration. Before extended thinking, solving exploration-dependent problems required implementing tree-of-thought or self-consistency through external code. Now, a single API call with a sufficient thinking budget can achieve comparable results, lowering the engineering barrier for complex reasoning tasks.

## Key Technical Details

- **Anthropic's implementation**: The `thinking` parameter with `budget_tokens` controls the thinking budget. Thinking content is returned in a separate `thinking` content block. Minimum budget is 1,024 tokens; can go up to the full context window minus output tokens.
- **OpenAI's implementation**: The o1 and o3 models use hidden reasoning tokens controlled by `reasoning_effort` (low/medium/high). Reasoning tokens are billed but not visible to the user. The o3-mini model offers a lower-cost option with reduced reasoning capacity.
- **Cost implications**: Thinking tokens are billed at the same rate as output tokens. A 10,000-token thinking budget on a hard problem costs as much as 10,000 output tokens, potentially 3-10x the cost of a non-thinking response.
- **Math benchmark gains**: Extended thinking models (o1, Claude with extended thinking) show 10-30% improvements on AIME and AMC competition math compared to standard models.
- **Code benchmark gains**: SWE-bench scores improved by 15-25% with extended thinking models compared to standard prompting on the same base models.
- **Diminishing returns**: Like self-consistency, thinking budget exhibits diminishing returns. Doubling the budget from 5,000 to 10,000 tokens yields much less improvement than doubling from 500 to 1,000 tokens.
- **Latency impact**: Thinking tokens increase time-to-first-visible-token significantly. A 10,000-token thinking budget may add 10-30 seconds of latency before the response begins.
- **Streaming**: Both Anthropic and OpenAI support streaming with extended thinking, allowing the client to display a "thinking" indicator while reasoning tokens are generated.
- **Dynamic budget allocation**: Advanced implementations adjust the thinking budget based on estimated task complexity -- a routing layer classifies the query difficulty and allocates more thinking tokens to harder problems.
- **Thinking token visibility**: Anthropic exposes thinking tokens in the API response; OpenAI hides them. Visible thinking tokens enable debugging and quality analysis; hidden tokens prevent prompt injection through the reasoning layer.

## Common Misconceptions

- **"Extended thinking is just chain-of-thought built into the model."** While conceptually similar, extended thinking models have been specifically trained to use thinking tokens effectively, often with reinforcement learning on reasoning tasks. The model's thinking process is more sophisticated than the CoT traces produced by standard models following "think step by step" instructions.

- **"More thinking tokens is always better."** Like all inference-time compute strategies, thinking budget exhibits diminishing returns. Additionally, excessive thinking on simple tasks can lead to overthinking -- generating unnecessary caveats, second-guessing correct intuitions, or finding problems that do not exist.

- **"Hidden reasoning tokens mean you cannot debug the model's reasoning."** With OpenAI's o1/o3, reasoning tokens are hidden by default, but Anthropic's implementation exposes thinking tokens. Even with hidden tokens, you can often infer reasoning quality from output quality and use techniques like asking the model to "explain your reasoning" in the output.

- **"Extended thinking replaces all other reasoning techniques."** Extended thinking handles internal reasoning well but does not replace external tools, retrieval, or multi-agent collaboration. A thinking model still benefits from good context, clear instructions, and access to relevant information.

- **"Standard prompting techniques don't matter for thinking models."** The thinking budget determines how much the model reasons, but the prompt determines what it reasons about. Poorly specified prompts lead to wasted thinking tokens, even with large budgets. Clear objectives, relevant context, and well-defined constraints are still essential.

## Connections to Other Concepts

- `03-reasoning-elicitation/chain-of-thought-prompting.md` -- Extended thinking can be viewed as the model-native successor to prompt-level CoT, internalizing the "show your work" pattern into the model's architecture and training.
- `03-reasoning-elicitation/self-consistency.md` -- Extended thinking may internally perform something akin to self-consistency (exploring multiple paths and selecting the best), reducing the need for explicit multi-sample voting.
- `03-reasoning-elicitation/tree-of-thought-prompting.md` -- Thinking models may internally implement tree-search-like reasoning, making explicit ToT orchestration less necessary for capable thinking models.
- `01-foundations/context-window-mechanics.md` -- Thinking tokens consume the same budget as regular tokens, creating a three-way trade-off between context (input), thinking (reasoning), and output (response).
- `04-system-prompts-and-instruction-design/system-prompt-anatomy.md` -- System prompts for thinking models should focus on what to think about (goals, constraints, context) rather than how to think (step-by-step instructions).

## Further Reading

- Anthropic. (2025). "Extended Thinking in Claude." Anthropic Documentation. Official documentation for Claude's extended thinking feature, including API parameters and best practices.
- OpenAI. (2024). "Learning to Reason with LLMs." OpenAI Blog. Introduction of o1 and the reasoning token paradigm, including benchmark results and design philosophy.
- Snell, C., Lee, J., Xu, K., & Kumar, A. (2024). "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters Alone." Theoretical and empirical analysis of when inference-time compute scaling (including extended thinking) is more efficient than model scaling.
- Muennighoff, N., Yang, Z., Shi, W., et al. (2025). "s1: Simple Test-Time Scaling." Demonstrates that simple thinking budget allocation strategies can match more complex approaches.
