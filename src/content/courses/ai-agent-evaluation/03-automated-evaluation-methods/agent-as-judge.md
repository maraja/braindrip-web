# Agent-as-Judge

**One-Line Summary**: Agent-as-Judge extends LLM-as-Judge by giving the evaluator its own tools, multi-step reasoning, and environment access to examine entire agent trajectories rather than just final outputs.

**Prerequisites**: `../llm-concepts/llm-as-judge.md`, `../ai-agent-concepts/tool-use.md`, `../ai-agent-concepts/agentic-reasoning.md`

## What Is Agent-as-Judge?

Imagine the difference between grading an essay by reading only the conclusion versus sitting beside the student, watching them research, draft, revise, and finalize. LLM-as-Judge reads the conclusion. Agent-as-Judge watches the entire process.

LLM-as-Judge makes a single LLM call: it receives an input-output pair (or sometimes a trajectory log) and produces a score. This works well for surface-level quality checks, but it cannot verify claims against external sources, execute code to check correctness, or navigate environments to confirm that an agent actually accomplished its task. Agent-as-Judge removes these limitations by giving the judge its own agentic capabilities -- tool access, multi-step reasoning, and the ability to interact with the same environment the evaluated agent used.

The distinction matters because as agents become more capable, their outputs become harder to evaluate from a static transcript alone. An agent that modifies a codebase across 15 files, runs tests, and deploys a service produces work that demands an evaluator with similar environmental access to verify.

## How It Works

### LLM-as-Judge: The Baseline

A standard LLM-as-Judge call follows a simple pattern: construct a prompt containing the evaluation criteria, the agent's input, and the agent's output. Send it to an LLM. Parse the returned score and justification. The entire evaluation completes in a single inference call.

Typical cost: ~$0.06 per evaluation. Typical latency: ~14.7 seconds. These numbers make LLM-as-Judge viable for continuous monitoring across thousands of interactions.

### Agent-as-Judge: The Extension

Agent-as-Judge wraps the judge in an agentic loop. The judge LLM can:

- **Execute code** to verify that generated programs actually run and produce correct output
- **Browse the web** to fact-check claims made by the evaluated agent
- **Query databases** to confirm that data modifications were applied correctly
- **Inspect file systems** to verify that file operations completed as specified
- **Run test suites** to validate software changes end-to-end

The judge reasons in multiple steps, deciding which tools to invoke, interpreting results, and synthesizing a final assessment. This mirrors how a human expert would evaluate complex agent work -- not by reading a summary, but by poking at the result.

Typical cost: ~$0.96 per evaluation (roughly 16x LLM-as-Judge). Typical latency: ~913 seconds (roughly 62x LLM-as-Judge). These costs restrict Agent-as-Judge to high-stakes, low-volume evaluation scenarios.

### Trajectory Evaluation

A key advantage of Agent-as-Judge is trajectory-level evaluation. Rather than scoring only the final output, the judge examines the sequence of actions the agent took:

- Did the agent explore reasonable approaches before committing?
- Were tool calls made efficiently, or did the agent waste steps?
- Did the agent recover gracefully from errors?
- Were intermediate results validated before proceeding?

This provides diagnostic value that final-output evaluation cannot: two agents may produce identical outputs, but one did so in 3 well-reasoned steps while the other thrashed for 40 steps before stumbling on the answer.

### When to Use Which

| Criterion | LLM-as-Judge | Agent-as-Judge |
|-----------|-------------|----------------|
| Use case | Continuous monitoring, A/B tests | Pre-deployment audits, capability assessment |
| Volume | Thousands per day | Tens to hundreds per evaluation cycle |
| Verification depth | Surface-level quality | Ground-truth verification |
| Cost tolerance | Low (~$0.06/eval) | High (~$0.96/eval) |
| Latency tolerance | Real-time to minutes | Minutes to hours |

## Why It Matters

1. **Agent outputs are increasingly unverifiable from text alone.** When an agent modifies a cloud infrastructure configuration, no amount of text analysis can confirm the change was applied correctly. Agent-as-Judge can actually check.

2. **Trajectory quality predicts reliability.** An agent that produces correct output through chaotic, unreliable reasoning is a deployment risk. Agent-as-Judge can distinguish robust from brittle processes.

3. **The evaluation gap is widening.** Per the LangChain 2024 State of AI Agents survey, 53.3% of teams use LLM-as-Judge and 59.8% use human review. As agent complexity grows, the gap between what LLM-as-Judge can assess and what requires human review can be partially filled by Agent-as-Judge.

4. **Pre-deployment safety requires deep evaluation.** Before deploying an agent that handles financial transactions or modifies production systems, teams need evaluation that goes beyond surface-level checks. Agent-as-Judge provides this without requiring full human review of every case.

## Key Technical Details

- Cost ratio: Agent-as-Judge is approximately 16x more expensive per evaluation than LLM-as-Judge
- Latency ratio: Agent-as-Judge is approximately 62x slower than LLM-as-Judge
- Agent-as-Judge evaluations typically involve 5-20 tool calls per evaluation, depending on task complexity
- The judge agent itself needs careful prompt engineering to avoid over- or under-scrutinizing agent behavior
- Judge tool access should mirror but not exceed the evaluated agent's tool access to maintain evaluation fairness
- Hybrid approaches run LLM-as-Judge first as a fast filter, then escalate uncertain or critical cases to Agent-as-Judge

## Common Misconceptions

**"Agent-as-Judge is just LLM-as-Judge with a longer prompt."** No. The fundamental difference is agentic capability: the judge can take actions in the environment, gather new information, and reason over multiple steps. A longer prompt is still a single inference call with no ability to verify claims externally.

**"Agent-as-Judge should replace LLM-as-Judge entirely."** The 16x cost and 62x latency overhead make this impractical. The two approaches serve different purposes and are best used in combination: LLM-as-Judge for breadth, Agent-as-Judge for depth.

**"The judge agent needs to be a more powerful model than the evaluated agent."** Not necessarily. The judge needs appropriate tool access and well-designed evaluation criteria. A smaller model with the right tools and rubric can effectively evaluate a larger model's agent outputs.

**"Agent-as-Judge eliminates the need for human evaluation."** It reduces the burden but does not eliminate it. Agent-as-Judge itself needs calibration against human judgments (see `judge-calibration-and-validation.md`), and edge cases still require human review.

## Connections to Other Concepts

- Builds directly on `../llm-concepts/llm-as-judge.md` by adding agentic capabilities to the judge
- Uses `rubric-engineering.md` to structure what the agent judge evaluates at each step
- Requires `judge-calibration-and-validation.md` to verify the agent judge's reliability
- Connects to `environment-state-evaluation.md` as the judge agent can check environment state directly
- Relates to `evaluation-pipeline-architecture.md` for orchestrating Agent-as-Judge at scale
- Evaluates the `../ai-agent-concepts/agentic-reasoning.md` process, not just outcomes

## Further Reading

- "Agent-as-a-Judge: Evaluate Agents with Agents" -- Zhuge et al., 2024
- "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" -- Zheng et al., 2023
- "LangChain State of AI Agents Report" -- LangChain, 2024
- "Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs" -- Shankar et al., 2024
