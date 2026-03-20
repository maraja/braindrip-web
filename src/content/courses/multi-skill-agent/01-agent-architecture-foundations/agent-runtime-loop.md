# The Agent Runtime Loop

**One-Line Summary**: The agent runtime loop is the core execution cycle where the agent repeatedly reasons about what to do next, executes a skill, observes the result, and decides whether to continue or stop.

**Prerequisites**: `anatomy-of-a-multi-skill-agent.md`, `the-skill-abstraction.md`

## What Is the Agent Runtime Loop?

Think of a chess player analyzing a board. They study the current position (observe), think about their options (reason), make a move (act), then look at the board again to see how it changed (observe again). They repeat this cycle until checkmate or a draw. The agent runtime loop follows the same pattern: it is the repeating cycle of reasoning, acting, and observing that drives an agent from its initial goal to a final result.

In technical terms, the runtime loop is the control structure that orchestrates an agent's execution. It takes a user's goal, passes it to the LLM along with available tools, receives either a final answer or a tool call request, executes any requested tools, feeds results back into the LLM's context, and repeats. The loop terminates when the LLM produces a final response without requesting more tools, or when a safety condition (max steps, timeout, budget) is hit.

This loop is conceptually similar to other iterative control patterns in software. A game loop processes input, updates state, and renders — then repeats at 60fps. A web server's event loop accepts connections, handles requests, and sends responses. The agent runtime loop accepts context, makes decisions, executes actions, and gathers observations. Same structure, different domain.

## How It Works

### The Core Cycle

The runtime loop has four phases per iteration:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│   │ ASSEMBLE │───>│  REASON  │───>│ DISPATCH │     │
│   │ CONTEXT  │    │  (LLM)   │    │  (TOOL)  │     │
│   └──────────┘    └──────────┘    └──────────┘     │
│        ^                               │            │
│        │          ┌──────────┐         │            │
│        └──────────│ OBSERVE  │<────────┘            │
│                   │ (RESULT) │                      │
│                   └──────────┘                      │
│                                                     │
│   Terminates when: LLM returns final answer,        │
│   max iterations hit, or error threshold exceeded    │
└─────────────────────────────────────────────────────┘
```

**Phase 1 — Assemble Context**: Gather everything the LLM needs to make its next decision: the system prompt, user goal, conversation history, previous tool results, and available tool schemas. This is where context window management happens.

**Phase 2 — Reason (LLM Call)**: Send the assembled context to the LLM. The model either produces a final text response (meaning it believes the task is complete) or emits one or more tool use requests.

**Phase 3 — Dispatch (Tool Execution)**: If the LLM requested tool calls, the runtime executes each one. This involves looking up the skill in the registry, validating inputs, running the skill's execute function, and capturing the result or error.

**Phase 4 — Observe (Result Integration)**: Append the tool results to the conversation history so the LLM can see them on the next iteration. This closes the loop.

### Pseudocode Implementation

```python
def agent_runtime_loop(
    user_goal: str,
    tools: list[Tool],
    model: str = "claude-sonnet-4-20250514",
    max_iterations: int = 15,
    max_tokens_budget: int = 100_000,
) -> AgentResult:
    """Core runtime loop for a multi-skill agent."""

    messages = [{"role": "user", "content": user_goal}]
    tokens_used = 0
    iteration = 0

    while iteration < max_iterations:
        iteration += 1

        # Phase 1: Assemble context
        context = assemble_context(messages, tools, model)

        # Phase 2: Reason (LLM call)
        response = llm_call(
            model=model,
            system=context.system_prompt,
            messages=context.messages,
            tools=context.tool_schemas,
            max_tokens=4096,
        )
        tokens_used += response.usage.input_tokens + response.usage.output_tokens

        # Check budget
        if tokens_used > max_tokens_budget:
            return AgentResult(
                status="budget_exceeded",
                output="Stopped: token budget exceeded.",
            )

        # Check if LLM is done (no tool calls)
        if response.stop_reason == "end_turn":
            final_text = extract_text(response.content)
            return AgentResult(status="complete", output=final_text)

        # Phase 3: Dispatch tool calls
        tool_results = []
        for tool_call in extract_tool_calls(response.content):
            result = dispatch_tool(
                tool_name=tool_call.name,
                tool_input=tool_call.input,
                registry=tools,
            )
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": tool_call.id,
                "content": result.to_string(),
            })

        # Phase 4: Observe (append to history)
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

    return AgentResult(
        status="max_iterations",
        output="Stopped: reached maximum iteration count.",
    )
```

### Context Assembly

Context assembly is where the runtime earns its keep. Naive implementations just append everything to the message list, but this hits context window limits fast. Production runtimes use strategies to manage context:

```python
def assemble_context(messages, tools, model):
    """Prepare context for the next LLM call."""

    # Strategy 1: Sliding window — keep last N messages
    if count_tokens(messages) > MAX_CONTEXT:
        messages = [messages[0]] + messages[-20:]  # Keep goal + recent history

    # Strategy 2: Summarize old tool results
    for i, msg in enumerate(messages):
        if is_old_tool_result(msg, threshold=5):
            messages[i] = summarize_tool_result(msg)

    # Strategy 3: Prune tool schemas for tools unlikely to be needed
    relevant_tools = rank_tools_by_relevance(tools, messages[-3:])

    return Context(
        system_prompt=build_system_prompt(),
        messages=messages,
        tool_schemas=[t.schema for t in relevant_tools],
    )
```

### Tool Dispatch

The dispatch layer handles the messy details of actually running skills:

```python
def dispatch_tool(tool_name: str, tool_input: dict, registry: list[Tool]) -> ToolResult:
    """Execute a tool call with validation and error handling."""

    # Look up tool
    tool = find_tool(registry, tool_name)
    if tool is None:
        return ToolResult(
            status="error",
            content=f"Unknown tool: {tool_name}. Available tools: {[t.name for t in registry]}"
        )

    # Validate inputs
    try:
        validated_input = tool.validate(tool_input)
    except ValidationError as e:
        return ToolResult(status="error", content=f"Invalid input: {e}")

    # Execute with timeout
    try:
        result = run_with_timeout(tool.execute, validated_input, timeout=30)
        return ToolResult(status="success", content=result)
    except TimeoutError:
        return ToolResult(status="error", content=f"Tool {tool_name} timed out after 30s")
    except Exception as e:
        return ToolResult(status="error", content=f"Tool {tool_name} failed: {e}")
```

### Termination Conditions

The loop must know when to stop. There are several termination conditions:

1. **Natural completion**: The LLM returns a response with `stop_reason == "end_turn"` (no tool calls). This means the agent believes it has finished.
2. **Max iterations**: A hard limit on loop cycles (typically 10-25). Prevents runaway agents.
3. **Token budget**: A cap on total tokens consumed across all LLM calls.
4. **Time budget**: A wall-clock timeout for the entire agent run.
5. **Error threshold**: Stop after N consecutive tool failures.
6. **Human interrupt**: The user or an operator cancels execution.

```python
@dataclass
class TerminationPolicy:
    max_iterations: int = 15
    max_tokens: int = 100_000
    max_wall_time_seconds: float = 300.0
    max_consecutive_errors: int = 3
```

## Why It Matters

### The Loop Is the Agent

Without the loop, you have a chatbot that makes one tool call per turn. The loop is what gives the agent autonomy — the ability to take multiple steps without human intervention at each step. Understanding the loop is understanding what an agent fundamentally is.

### Control and Safety Live in the Runtime

The runtime loop is where you enforce safety: budget limits, iteration caps, confirmation prompts for dangerous actions, and audit logging. If you don't control the loop, you don't control the agent.

## Key Technical Details

- Each loop iteration requires one LLM API call (typically 0.5-5 seconds latency)
- Claude can return multiple tool calls in a single response (parallel tool use), reducing total iterations
- Context grows by ~500-2000 tokens per iteration (tool result size varies widely)
- Production agents typically complete tasks in 3-12 iterations
- The system prompt is sent with every LLM call, so its token cost multiplies by the iteration count
- Error results should be fed back to the LLM — models are good at self-correcting when they see what went wrong

## Common Misconceptions

**"The agent plans all steps upfront"**: Most agent implementations do not plan a full sequence of steps before starting. They operate one step at a time: reason about the current situation, take one action, observe the result, then reason again. This makes them adaptive but also means they can wander. Some frameworks add explicit planning phases, but the default pattern is step-by-step.

**"Parallel tool calls mean parallel execution"**: When the LLM emits multiple tool calls in one response, the runtime can execute them in parallel — but this is an implementation choice. Some runtimes run them sequentially for simplicity or safety. The LLM doesn't control execution order; the runtime does.

## Connections to Other Concepts

- `anatomy-of-a-multi-skill-agent.md` — The three-layer architecture that the runtime loop operates within
- `the-skill-abstraction.md` — The skills that the loop dispatches to
- `choosing-your-framework.md` — How frameworks implement the runtime loop differently
- `output-contracts.md` — How structured tool outputs make the observe phase reliable

## Further Reading

- Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (2023) — The paper that formalized the reason-act-observe loop
- Anthropic, "Claude Agent SDK" (2025) — A minimal runtime that implements this loop pattern
- LangGraph Documentation, "Agent Executor" (2024) — A graph-based implementation of the runtime loop
- Brooks, "A Robust Layered Control System for a Mobile Robot" (1986) — The subsumption architecture that inspired reactive agent loops
