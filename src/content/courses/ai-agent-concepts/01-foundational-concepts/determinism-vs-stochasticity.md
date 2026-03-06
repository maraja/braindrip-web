# Determinism vs. Stochasticity

**One-Line Summary**: LLM-based agents are inherently non-deterministic — the same input can produce different outputs across runs due to temperature sampling, floating-point arithmetic, and tool output variability — and managing this stochasticity requires deliberate strategies while recognizing that some randomness is actually beneficial.

**Prerequisites**: `what-is-an-ai-agent.md`, `agent-loop.md`, `llm-as-reasoning-engine.md`

## What Is the Determinism Challenge?

Imagine two identical chess computers analyzing the same board position. You expect them to recommend the same move every time. Traditional software works this way — the same input produces the same output, deterministically. Now imagine replacing those chess computers with two grandmasters. They might recommend different moves, each valid but reflecting different strategic preferences. Run the same position past the same grandmaster twice, and they might even recommend different moves depending on their mood, what they had for lunch, and which variations they happen to explore first. LLM-based agents behave like the grandmaster, not the chess computer.

Stochasticity in AI agents means that running the same task with the same input may produce different execution paths, different tool call sequences, and different final outputs across runs. This is fundamentally different from traditional software, where determinism is the default and randomness must be explicitly introduced. In LLM-based systems, randomness is the default and determinism must be actively pursued — and even then, it is never fully guaranteed.

This non-determinism arises from multiple sources: the temperature parameter in LLM sampling, floating-point non-determinism in GPU computation, batching effects in inference infrastructure, and variability in external tool outputs. The agent loop amplifies these sources because small variations in one turn compound across subsequent turns — a different tool choice on turn 3 leads to different observations on turn 4, which leads to a different plan on turn 5, and so on. Understanding and managing this stochasticity is essential for building reliable agent systems.

*Recommended visual: A branching tree diagram showing how a single starting point diverges into multiple execution paths across turns, labeled with divergence sources (temperature sampling, tool output variation) — see [Wang et al., "Self-Consistency Improves Chain of Thought Reasoning" (2023)](https://arxiv.org/abs/2203.11171)*

## How It Works

### Sources of Non-Determinism

**Temperature and Top-p Sampling**
LLMs generate output by predicting probability distributions over tokens. The temperature parameter controls how these distributions are sampled:
- **Temperature = 0**: The model always selects the highest-probability token (greedy decoding). This is the most deterministic setting but does not guarantee identical outputs across runs.
- **Temperature = 0.1-0.3**: Slight randomness, occasionally selecting lower-probability tokens. Most output is identical across runs, but occasional variation occurs.
- **Temperature = 0.5-0.8**: Moderate randomness. Outputs vary noticeably across runs while remaining coherent.
- **Temperature = 1.0+**: High randomness. Outputs vary significantly and may become less coherent.

Most agent systems use temperature 0 or near-zero for maximum consistency. But even at temperature 0, outputs are not guaranteed identical due to the following sources.

**Floating-Point Non-Determinism**
GPUs perform massive parallel floating-point computations. Due to the non-associativity of floating-point arithmetic (`(a + b) + c != a + (b + c)` in floating point), the order in which parallel operations complete can affect results. Different GPU hardware, different driver versions, and even different load conditions can produce slightly different logits for the same input, leading to different token selections — especially when two tokens have very similar probabilities.

**Infrastructure Variability**
API providers (Anthropic, OpenAI, Google) run inference across distributed infrastructure. The same API call might be served by different hardware, different model replicas, or different batch sizes. These infrastructure-level variations can produce different outputs for identical inputs.

**Tool Output Variability**
External tools introduce their own non-determinism:
- **Web searches** return different results at different times.
- **File system operations** reflect changes made by other processes.
- **API calls** may return different data due to backend state changes.
- **Command execution** may produce different output due to system state (CPU load, available memory, process ordering).
- **Time-dependent operations** inherently vary (timestamps, relative dates, "last modified" information).

*Recommended visual: A probability tree showing how per-step reliability (e.g., 95% per step) compounds across 20 steps to produce much lower end-to-end reliability (36%) — see [Chen et al., "Evaluating Large Language Models Trained on Code" (2021)](https://arxiv.org/abs/2107.03374)*

**Compound Divergence in the Agent Loop**
The agent loop amplifies all sources of non-determinism. Consider a 20-step task:
- If each step has a 95% chance of producing the same output, the probability of the entire run being identical is 0.95^20 = 36%.
- If each step has a 90% chance, the full-run probability drops to 0.90^20 = 12%.
- If each step has a 80% chance, it drops to 0.80^20 = 1%.

Small per-step variations compound into large run-level variations. This is why reproducibility is significantly harder for agents than for single LLM calls.

### Strategies for Increasing Determinism

**Temperature 0 with Seed Pinning**
Setting temperature to 0 and providing a fixed seed (where supported by the API) maximizes reproducibility. OpenAI's API supports a `seed` parameter; Anthropic's API uses temperature 0 without an explicit seed. Even with these settings, API providers note that determinism is not guaranteed due to infrastructure changes.

**Deterministic Tool Implementations**
Where possible, design tools to produce consistent outputs:
- Cache web search results and replay them for reproducibility testing.
- Use fixed timestamps in test environments.
- Mock external API responses in development.
- Sort output lists that might be returned in arbitrary order.

**Canonical Prompt Construction**
Ensure the prompt sent to the LLM is identical across runs. This means:
- Consistent message ordering.
- Consistent formatting of tool results.
- No inclusion of timestamps, random IDs, or other run-varying data unless necessary.
- Consistent system prompt (no dynamic elements that change between runs).

**Retry-with-Validation**
Instead of trying to make individual runs deterministic, run the agent and validate the output:
1. Execute the agent task.
2. Apply automated validation (run tests, check output format, verify constraints).
3. If validation fails, retry (potentially with slight prompt variations).
4. Accept the first run that passes validation.

This approach accepts non-determinism in the process while enforcing determinism in the outcome. It is the most practical strategy for production agent systems.

**Checkpoint and Resume**
Save agent state at key checkpoints. If a run diverges unacceptably, rewind to a checkpoint and retry from there rather than starting from scratch. This limits the scope of compound divergence.

### When Stochasticity Is Useful

Non-determinism is not always a problem — sometimes it is a feature:

**Exploration**: When an agent is stuck (repeated failures with the same approach), increased temperature can help it explore alternative strategies. Some agent architectures deliberately increase temperature after N consecutive failures.

**Diversity in generation**: For creative tasks (writing, brainstorming, generating test cases), stochastic output produces diverse results that can be filtered or combined.

**Ensemble approaches**: Running the same task multiple times with different random seeds and selecting the best result (via automated evaluation) can produce higher-quality outcomes than any single deterministic run. This is the "best-of-N" strategy.

**Robustness testing**: If an agent's output changes significantly across runs with identical input, this reveals fragile reasoning that should be made more robust. Stochastic testing exposes these weaknesses.

## Why It Matters

### Testing and Quality Assurance

Traditional software testing relies on determinism: given input X, the function produces output Y, and a test verifies this. Agent testing cannot rely on exact output matching. Instead, agent tests must use:
- **Behavioral assertions**: "The output contains a function with these parameters" rather than "the output is exactly this code."
- **Statistical pass rates**: "The agent completes this task successfully in 8 out of 10 runs."
- **Property-based checks**: "The generated code compiles and passes the test suite" rather than "the generated code matches this exact string."

This fundamentally changes how agent systems are tested and what "passing" means.

### Debugging Non-Deterministic Failures

When an agent fails intermittently, debugging requires:
1. Logging complete state at every turn (all messages, tool calls, tool results).
2. Identifying the specific turn where behavior diverged from the successful path.
3. Analyzing whether the divergence was caused by LLM sampling, tool output differences, or context differences.
4. Reproducing the issue by replaying the logged state up to the divergence point.

This is significantly more complex than debugging traditional deterministic software, where reproducing the bug is usually straightforward.

### User Trust and Expectations

Users accustomed to deterministic software may be surprised or frustrated when an agent handles the same request differently across sessions. Managing expectations — through documentation, progress visibility, and output validation — is important for user trust in agent systems.

## Key Technical Details

- **Temperature 0 reproducibility rate**: With temperature 0 and identical prompts, single LLM calls reproduce the same output roughly 85-95% of the time (varying by provider and model). This drops to 30-60% for full agent task runs of 20+ steps.
- **Seed parameter support**: OpenAI supports a `seed` parameter in API calls (introduced late 2023). Anthropic does not expose an explicit seed parameter but uses temperature 0 for maximum consistency. Google's Gemini supports temperature 0 but not explicit seeding.
- **Best-of-N effectiveness**: Running an agent 3 times and selecting the best result (by automated evaluation) improves task completion rates by 10-20% compared to single runs, at 3x the cost. Running 5 times improves by 15-25% at 5x cost.
- **Divergence detection**: Tools like `diff` applied to agent logs across runs can identify the first point of divergence. Typically, divergence occurs within the first 5-10 turns for a given task.
- **Latent non-determinism**: Even when outputs appear identical, internal logits may differ. A model might assign 0.6 probability to a token in one run and 0.59 in another — same output, but a slight change in the prompt could flip the selection.
- **Evaluation metrics for stochastic systems**: Pass@k (task solved in at least 1 of k attempts) is the standard metric for evaluating stochastic agents. Claude Code's SWE-bench results, for example, report the pass@1 rate (single attempt).
- **Cost of determinism pursuit**: Implementing full determinism (cached tools, fixed seeds, canonical prompts, mocked environments) typically adds 20-40% development overhead. For many applications, retry-with-validation is more cost-effective.

## Common Misconceptions

**"Setting temperature to 0 makes the agent deterministic."**
Temperature 0 makes the LLM's sampling deterministic (greedy decoding), but floating-point non-determinism, infrastructure variability, and tool output changes still introduce variation. Temperature 0 is necessary but not sufficient for determinism.

**"Non-determinism is always a bug to be fixed."**
In many agent applications, exact reproducibility is unnecessary. What matters is that the agent consistently achieves the correct outcome, even if it takes different paths to get there. Two different code implementations that both pass the test suite are both correct, regardless of which one the agent produces on a given run.

**"Agents should behave like traditional software — same input, same output."**
This expectation is unrealistic for LLM-based systems and leads to brittle testing and misaligned quality criteria. Agent evaluation should focus on outcome correctness and behavioral properties rather than exact output matching.

**"More compute (retries) always compensates for stochasticity."**
Retrying a fundamentally flawed approach does not fix it regardless of how many times you retry. If the agent fails because of a systematic issue (wrong tool selection strategy, insufficient context, unclear instructions), retrying with the same setup produces the same category of failure. Retries help with transient stochastic failures, not systematic ones.

**"Stochastic behavior means the agent is unreliable."**
Humans are stochastic — they approach the same problem differently on different days — but we do not consider them unreliable. Reliability means consistently achieving acceptable outcomes, not producing identical outputs. An agent that solves a task in 9 out of 10 runs via different paths is highly reliable.

## Connections to Other Concepts

- `agent-loop.md` — The agent loop is the amplification mechanism for stochasticity: small per-step variations compound across iterations.
- `llm-as-reasoning-engine.md` — The LLM's probabilistic nature is the primary source of non-determinism in agent systems.
- `agent-state-management.md` — Different state at any turn produces different LLM outputs. State management inconsistencies are a source of apparent non-determinism.
- `agent-vs-workflow.md` — Workflows are inherently more deterministic than agents, which is a key factor in the decision of when to use each approach.
- `goal-specification.md` — Ambiguous goals amplify stochastic behavior because the agent has more room to interpret the goal differently across runs.

## Further Reading

- **Ouyang et al., "Training Language Models to Follow Instructions with Human Feedback" (2022)** — Discusses temperature and sampling strategies in the context of instruction-tuned models.
- **Chen et al., "Evaluating Large Language Models Trained on Code" (2021)** — Introduces the pass@k metric for evaluating stochastic code generation, establishing the standard evaluation framework for non-deterministic systems.
- **Wang et al., "Self-Consistency Improves Chain of Thought Reasoning in Language Models" (2023)** — Demonstrates that sampling multiple reasoning paths and selecting the most consistent answer improves accuracy, directly leveraging stochasticity as a feature.
- **Anthropic, "Building Effective Agents" (2024)** — Practical guidance on building reliable agent systems that account for non-determinism through validation and error handling.
- **Anil et al., "Many-Shot In-Context Learning" (2024)** — Studies how increasing the number of examples in context reduces output variability, a technique applicable to reducing stochasticity in agent behavior.
