# Inner Monologue

**One-Line Summary**: Inner monologue is the agent's private reasoning process -- hidden thoughts that guide decision-making without being exposed to the user, enabling more honest deliberation, safety checks, and complex multi-step reasoning behind the scenes.

**Prerequisites**: Chain-of-thought in agents, ReAct pattern, system prompts and message roles

## What Is Inner Monologue?

Consider a diplomat negotiating a treaty. Outwardly, they present composed, measured statements. Inwardly, they are running a constant stream of strategic calculations: "They just conceded on tariffs, which means agriculture is their real priority. If I push hard on agriculture now, they might walk away. I should offer a small concession on fishing rights to build goodwill, then circle back to agriculture later." This internal deliberation is essential to effective diplomacy but would be counterproductive if spoken aloud. The diplomat's inner monologue serves their decision-making without being part of the public conversation.

Inner monologue in AI agents is the architectural pattern of providing the model with a private reasoning space that is not visible in the user-facing output. The agent "thinks" before it "speaks" or "acts," and these thoughts are logged for debugging but hidden from the end user. This separation allows the agent to reason more freely: it can consider sensitive edge cases, evaluate whether it should refuse a request, work through uncertainty, and organize complex plans without cluttering the user experience with internal deliberation.

*Recommended visual: A diagram showing the architectural separation between the private thinking block (hidden from user) and the visible response, with the thinking block feeding into the response generation — see [Anthropic, "Extended Thinking in Claude" (2024)](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)*

The concept has been implemented independently by multiple AI labs. Anthropic's extended thinking gives Claude a dedicated thinking block before each response. OpenAI's o1 and o3 models use hidden chain-of-thought that the user never sees. Google's Gemini uses internal reasoning tokens. The specific implementation varies, but the core idea is the same: private reasoning improves output quality and enables safety-relevant deliberation that should not be exposed.

## How It Works

### Architectural Separation

Inner monologue requires a clear architectural boundary between private reasoning and public output. This is implemented in several ways:

**Dedicated thinking blocks**: The API provides a separate field for thinking content. The model generates thinking first, then produces the visible response. The framework stores thinking for logging but does not send it to the user.

```
[Thinking Block - private]
The user is asking me to write a web scraper. Let me consider:
1. Is this request within my acceptable use policy? Yes, web scraping for
   personal research is fine.
2. What approach should I take? The target site appears to use JavaScript
   rendering, so I'll need Playwright or Selenium rather than simple requests.
3. Should I include rate limiting? Yes, always include rate limiting to be
   a good citizen.
[End Thinking Block]

[Response - visible to user]
Here's a web scraper using Playwright with built-in rate limiting...
```

**System-level scratchpads**: The agent writes reasoning into a designated section of the prompt that the framework strips before displaying to the user. Less robust than dedicated thinking blocks because parsing is required.

**Multi-call reasoning**: The agent makes one or more LLM calls for "thinking" and a separate call for the user-facing response. The thinking calls are not shown to the user. More expensive but provides maximum flexibility.

### Private Safety Deliberation

One critical function of inner monologue is safety reasoning. The agent can privately evaluate whether a request is harmful, whether the current approach might cause unintended damage, or whether it should ask for confirmation before proceeding:

```
[Thinking - private]
The user asked me to delete all files matching *.log in /var/log/. This is
potentially dangerous because:
1. Some system processes depend on active log files
2. The glob might match more than expected
3. The user might not realize this includes rotated logs

I should warn the user about these risks and ask for confirmation rather
than executing directly.
[End Thinking]
```

This deliberation would be awkward if exposed ("Here are the reasons I'm worried about your request...") but is essential for safe agent behavior.

### Reasoning Depth Control

Inner monologue can be calibrated for different situations:

- **Shallow thinking** (50-200 tokens): Simple tool calls, straightforward questions. "The user wants the weather. I'll call the weather API for their location."
- **Medium thinking** (200-1000 tokens): Multi-step tasks, ambiguous requests. "The user wants to 'fix the bug.' Let me identify which bug, analyze the code, consider multiple fixes, and choose the best one."
- **Deep thinking** (1000-10000+ tokens): Complex reasoning, safety-sensitive decisions, novel situations. Extended deliberation for hard problems.

Some APIs expose a "thinking budget" parameter that controls how many tokens the model can use for inner monologue before it must produce output.

### Streaming Considerations

In streaming responses, inner monologue creates a user experience challenge. The model may spend several seconds generating thinking tokens before producing any visible output. Implementations handle this by:

- Showing a "thinking..." indicator to the user during the private reasoning phase
- Streaming the thinking content in a collapsible UI element that the user can optionally expand
- Starting to stream the visible response as soon as it begins, after thinking completes

## Why It Matters

### Enables Honest Internal Reasoning

When reasoning is visible to the user, the model may "perform" rather than genuinely reason. It might avoid stating uncertainty, skip safety considerations that could seem paternalistic, or oversimplify to avoid appearing confused. Private reasoning removes this pressure, allowing more honest and thorough deliberation.

### Supports Complex Agent Tasks

Agents working on multi-file code changes, research tasks, or multi-step workflows need extensive internal planning that would overwhelm users if displayed. Inner monologue lets the agent maintain detailed working notes (which files to modify, what dependencies exist, what order to make changes) without flooding the conversation.

### Critical for Safety and Alignment

Inner monologue is where agents evaluate whether they should comply with a request, what guardrails apply, and whether their planned actions might cause harm. Making this reasoning private prevents adversarial users from learning and circumventing the agent's safety checks, while still allowing the agent to apply them rigorously.

## Key Technical Details

- **Anthropic's extended thinking**: Uses `thinking` blocks that appear before the response. Supports budgets up to 128K thinking tokens. Thinking is included in API responses but marked as a separate content block type
- **OpenAI's hidden CoT**: In o1/o3 models, chain-of-thought is generated but not exposed through the API at all. Users see only the final answer. Reasoning token count is reported but content is not accessible
- **Token accounting**: Thinking tokens count toward total token usage and billing. A response with 2000 thinking tokens and 500 response tokens costs the same as a 2500-token response
- **Thinking latency**: Extended thinking adds 1-10 seconds of latency before the first visible token streams. This is the most significant UX trade-off
- **Faithfulness concern**: There is ongoing debate about whether hidden reasoning is truly faithful to the model's decision process or is post-hoc rationalization. This has implications for interpretability and safety auditing
- **Logging practices**: Production systems should log thinking content for debugging and safety auditing, with appropriate access controls to prevent over-exposure of private reasoning

## Common Misconceptions

- **"Inner monologue is just chain-of-thought that's hidden."** While related, inner monologue serves additional purposes beyond reasoning: safety deliberation, uncertainty assessment, multi-step planning, and self-monitoring. It is a superset of CoT that includes strategic and safety reasoning.

- **"Users should always see the agent's reasoning."** Exposing all reasoning can be overwhelming, confusing, and in some cases actively harmful (e.g., if it reveals safety bypass reasoning). The right approach is selective transparency: show high-level reasoning when it helps the user, keep detailed deliberation private.

- **"Hidden reasoning means the agent is being deceptive."** Private deliberation is not deception; it is a normal part of effective communication. Humans routinely think before speaking without being considered deceptive. The key ethical requirement is that the hidden reasoning should serve the user's interests, not undermine them.

- **"More thinking tokens always improve output quality."** Beyond a certain threshold, additional thinking tokens show diminishing returns and may even degrade quality as the model goes down tangential reasoning paths. Optimal thinking budgets are task-dependent.

## Connections to Other Concepts

- `chain-of-thought-in-agents.md` — Inner monologue is the private implementation of CoT; CoT can be either visible or hidden, and inner monologue specifically refers to the hidden variant
- `metacognition.md` — Much metacognitive reasoning (assessing own capabilities, deciding when to ask for help) happens within inner monologue because it would be awkward to expose to users
- `reflection-and-self-critique.md` — Agents can reflect on their planned actions within inner monologue before executing them, catching potential mistakes before they become visible errors
- `world-models.md` — Mental simulation of action consequences ("if I do X, the result will be Y") happens within inner monologue as the agent evaluates candidate actions
- `error-detection-and-recovery.md` — When an agent detects an error, the analysis of what went wrong and the decision of how to recover typically happens in inner monologue before the user sees the corrective action

## Further Reading

- Anthropic. (2024). "Extended Thinking." Technical documentation on Claude's thinking block architecture, usage patterns, and best practices.
- Huang, W., Abbeel, P., Pathak, D., et al. (2022). "Inner Monologue: Embodied Reasoning through Planning with Language Models." Introduces inner monologue for robotic agents that combine language reasoning with environmental feedback.
- OpenAI. (2024). "Learning to Reason with LLMs." Blog post introducing o1's hidden chain-of-thought approach and its performance benefits on reasoning benchmarks.
- Lanham, T., Chen, A., Radhakrishnan, A., et al. (2023). "Measuring Faithfulness in Chain-of-Thought Reasoning." Investigates whether CoT (and by extension inner monologue) faithfully represents the model's actual reasoning process.
