# Tool Use Benchmarks

**One-Line Summary**: Tool use benchmarks evaluate how well AI agents select, invoke, parameterize, and chain tools in realistic scenarios, revealing reliability gaps that single-call evaluations miss entirely.

**Prerequisites**: `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md`, `../01-foundations-of-agent-evaluation/outcome-vs-process-evaluation.md`

## What Is Tool Use Benchmarking?

Imagine hiring a contractor and evaluating them not just on whether the house got built, but on whether they picked the right tools for each job -- using a level instead of eyeballing it, choosing the correct drill bit for each material, knowing when to call in a specialist. Tool use benchmarks evaluate AI agents on this same dimension: not just whether they reach the right answer, but whether they can reliably discover, select, parameterize, and sequence external tools to accomplish tasks.

Tool use is the capability that separates language models from agents. A language model can discuss how to query a database; an agent actually invokes the query, interprets the results, and acts on them. Tool use benchmarks specifically target this boundary, measuring whether agents can bridge the gap between reasoning about actions and executing them correctly.

What makes tool use evaluation particularly revealing is the reliability dimension. An agent that succeeds 90% of the time on individual tool calls will succeed only 35% of the time on a 10-tool-call sequence. Tool use benchmarks have exposed alarming reliability gaps: even frontier models like GPT-4o achieve less than 50% success on multi-step tool use tasks, and their reliability drops precipitously with repeated trials.

## How It Works

### tau-bench

tau-bench (Yao et al., 2024) evaluates tool-augmented agents in dynamic, conversational settings across three domains:

- **Retail**: Order management, returns processing, product lookup, inventory checking
- **Airline**: Flight booking, seat selection, itinerary changes, loyalty program management
- **Telecom**: Plan changes, billing inquiries, service activation, troubleshooting

Each task involves a simulated user conversation where the agent must use domain-specific tools (APIs for database lookup, order modification, payment processing, etc.) to resolve the user's request.

**The pass^k metric**: tau-bench's key innovation is the pass^k metric, which measures the probability that an agent succeeds on all of k independent trials of the same task. This captures reliability rather than peak performance:

- **pass^1**: Standard single-trial success rate. GPT-4o achieves ~48% on retail tasks.
- **pass^4**: Success on all 4 trials. GPT-4o drops to ~32%.
- **pass^8**: Success on all 8 trials. GPT-4o falls to below 25%.

The dramatic decay from pass^1 to pass^8 reveals that many "successes" are lucky runs through non-deterministic execution paths. For production deployment, where an agent must work reliably every time, pass^k is far more informative than pass^1.

### MCP-Bench

MCP-Bench (2025) evaluates agents on multi-step workflows executed through Model Context Protocol (MCP) servers. MCP has emerged as a standard for tool integration, and MCP-Bench tests three critical capabilities:

1. **Tool discovery**: Can the agent identify which MCP tools are available and understand their capabilities from schema descriptions?
2. **Tool invocation**: Can the agent construct correct API calls with proper parameters, handling authentication, pagination, and error responses?
3. **Result synthesis**: Can the agent combine outputs from multiple tool calls into a coherent response or action?

Tasks include multi-step workflows like "Find all open GitHub issues labeled 'bug' in repository X, check which ones have failing CI, and create a summary report in a Google Doc." This requires chaining 5-10 MCP tool calls across different servers (GitHub, Google Workspace, CI platform).

### AppWorld

AppWorld (Trivedi et al., 2024) provides the most comprehensive tool use evaluation environment, featuring:

- **9 interconnected applications**: Email, calendar, messaging, notes, file storage, contacts, maps, weather, reminders
- **457 distinct APIs** across these applications
- **750 tasks** at three difficulty levels: normal, challenge, and adversarial

Key statistics reveal the difficulty:
- GPT-4o solves only 49% of normal tasks and 30% of challenge tasks
- Tasks require an average of 4.2 API calls, with challenge tasks averaging 7.8 calls
- The adversarial set introduces misleading context, ambiguous instructions, and tasks that require the agent to recognize when a request cannot be fulfilled

AppWorld is distinctive in testing inter-application reasoning: a task might require reading an email to find a meeting time, creating a calendar event, sending a confirmation message, and setting a reminder -- a workflow that spans 4 applications and 6+ API calls.

### What These Benchmarks Reveal

Across tau-bench, MCP-Bench, and AppWorld, consistent patterns emerge:

- **Parameter errors dominate**: 40-50% of tool-use failures come from incorrect parameter values, not wrong tool selection
- **Error handling is weak**: Agents retry failed calls with the same parameters rather than diagnosing the error
- **Context window pressure**: Multi-step tool use consumes context rapidly, causing degraded performance on later steps
- **API schema misinterpretation**: Agents frequently misunderstand optional vs. required parameters, enum values, and nested object structures

## Why It Matters

1. **Production reliability**: Tool use is the mechanism through which agents affect the world. Unreliable tool use means unreliable agents, regardless of reasoning quality.
2. **The pass^k gap**: The dramatic difference between single-trial and multi-trial success rates reveals that reported benchmark scores massively overstate real-world reliability.
3. **Integration complexity**: As the tool ecosystem expands (MCP, OpenAPI, function calling), agents must handle increasingly diverse and complex tool interfaces.
4. **Error propagation**: Tool-use errors propagate through multi-step chains. A malformed API call in step 3 corrupts all downstream steps, unlike reasoning errors that can sometimes be self-corrected.

## Key Technical Details

- tau-bench retail domain includes 12 tools with a total of 47 parameters across all tools
- pass^k = (pass^1)^k under independence assumptions, but empirical pass^k is often lower, indicating correlated failure modes
- MCP-Bench tasks span 15 MCP servers covering GitHub, Google Workspace, Slack, Jira, databases, and file systems
- AppWorld's 457 APIs average 3.8 parameters each; 23% of parameters are optional, creating a large space of possible invocations
- Tool-use latency adds 200-2000ms per call, making multi-step workflows significantly slower than pure reasoning
- Agents with structured output (JSON mode) show 15-25% fewer parameter errors than free-form tool callers
- Fine-tuning on tool-use traces improves pass^1 by 10-15% but pass^8 by only 3-5%, suggesting the reliability gap is structural

## Common Misconceptions

**"Tool selection is the hard part."** In practice, agents select the correct tool 80-90% of the time. The failures are overwhelmingly in parameterization: wrong date formats, incorrect field names, missing required parameters, and mishandled edge cases.

**"pass^1 scores are sufficient for evaluating tool-use agents."** A 48% pass^1 score sounds mediocre but workable. The corresponding ~25% pass^8 score reveals that the agent is unreliable on more than three-quarters of tasks when you need consistent performance. Production deployments need pass^k evaluation.

**"More tools always means better agents."** Agents with access to more tools often perform worse due to selection confusion and context window pressure. Tool set curation -- providing the right tools for the task -- is as important as the agent's tool-use capability.

**"Function calling solves tool use."** Structured function calling (as in OpenAI's or Anthropic's APIs) reduces formatting errors but does not address the deeper challenges: knowing when to use a tool, handling multi-step dependencies, recovering from tool errors, and synthesizing results across calls.

## Connections to Other Concepts

- `gaia-and-general-assistant-benchmarks.md` covers GAIA, which implicitly tests tool use as part of general assistant capability
- `swe-bench-deep-dive.md` discusses how coding agents use tools (file editing, test execution) within a specific domain
- `benchmark-design-methodology.md` addresses the challenge of designing tool environments that are realistic but reproducible
- `../04-trajectory-and-process-analysis/tool-use-correctness.md` provides detailed metrics for evaluating individual tool calls
- `../01-foundations-of-agent-evaluation/compounding-errors-in-multi-step-tasks.md` explains the mathematical basis for why multi-step tool use is so unreliable
- `../06-cost-quality-latency-tradeoffs/the-evaluation-triangle.md` discusses how tool-use overhead impacts the cost-latency tradeoff

## Further Reading

- "tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains" -- Yao et al., 2024
- "AppWorld: A Controllable World of Apps and People for Benchmarking Interactive Coding Agents" -- Trivedi et al., 2024
- "MCP-Bench: Evaluating Agents on Multi-Step Tool Workflows via the Model Context Protocol" -- Zhang et al., 2025
- "Gorilla: Large Language Model Connected with Massive APIs" -- Patil et al., 2023
- "ToolBench: An Open Platform for Training, Serving, and Evaluating LLM Tool Learning" -- Qin et al., 2024
