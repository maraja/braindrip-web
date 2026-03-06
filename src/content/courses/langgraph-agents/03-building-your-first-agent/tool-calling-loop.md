# Tool-Calling Loop

**One-Line Summary**: The tool-calling loop is the fundamental cycle where an LLM reasons about a task, invokes tools, observes results, and repeats until it can answer without further tool use.

**Prerequisites**: `langgraph-overview.md`, `what-are-agents.md`

## What Is the Tool-Calling Loop?

Think of a researcher working at a desk. They read the question, decide they need a specific fact, walk to the library to look it up, return to their desk with the answer, reconsider the question with this new information, and decide whether they need another trip to the library or can write their final answer. Each round trip is one iteration of the tool-calling loop.

In LLM-powered agents, this loop is the engine that transforms a passive text generator into an active problem solver. The model does not execute code or query databases directly -- it generates structured requests (tool calls) that a runtime executes on its behalf. The results come back as messages, and the model decides what to do next. The loop continues until the model responds with plain text and no tool calls, signaling that it is done.

Every agent framework -- LangGraph, CrewAI, AutoGen, or a hand-rolled script -- implements some version of this loop. Understanding it at this level makes every framework easier to learn because you can always identify the same six steps underneath the abstraction.

## How It Works

### The Six Steps

1. **LLM receives messages and tool schemas** -- the conversation history plus a JSON description of each available tool (name, description, parameters) is sent to the model.
2. **LLM generates a response with tool calls** -- instead of (or in addition to) text, the model returns structured `tool_calls`, each specifying a tool name and arguments.
3. **Runtime extracts and executes tool calls** -- the framework parses the tool calls and invokes the corresponding Python functions with the provided arguments.
4. **Tool results are appended as ToolMessages** -- each result is wrapped in a `ToolMessage` linked back to its originating tool call by `tool_call_id`.
5. **LLM is called again with updated messages** -- the full history, now including the tool calls and their results, is sent back to the model.
6. **Loop terminates when the LLM responds without tool calls** -- a plain text response with no `tool_calls` signals the final answer.

### Visualizing the Loop

```
User Message
     |
     v
+-----------+     tool_calls present     +------------+
|  LLM Call | --------------------------> | Execute    |
|           |                             | Tools      |
+-----------+                             +------------+
     ^                                         |
     |           ToolMessages                  |
     +-----------------------------------------+
     |
     | no tool_calls
     v
  Final Answer
```

### What the Messages Look Like

```python
# After one loop iteration, the message list looks like:
messages = [
    HumanMessage(content="What is the weather in Paris?"),
    AIMessage(
        content="",
        tool_calls=[{"name": "get_weather", "args": {"city": "Paris"}, "id": "call_1"}]
    ),
    ToolMessage(content="22°C, partly cloudy", tool_call_id="call_1"),
    AIMessage(content="The weather in Paris is 22°C and partly cloudy."),
]
```

### Parallel Tool Calls

Modern models can request multiple tools in a single response:

```python
# The LLM might return:
AIMessage(
    content="",
    tool_calls=[
        {"name": "get_weather", "args": {"city": "Paris"}, "id": "call_1"},
        {"name": "get_weather", "args": {"city": "London"}, "id": "call_2"},
    ]
)
# Both are executed, producing two ToolMessages before the next LLM call.
```

### The Termination Condition

The loop ends when the AI message contains **no** `tool_calls`. In LangGraph, the `tools_condition` function checks this:

```python
from langgraph.prebuilt import tools_condition

# tools_condition returns "tools" if tool_calls exist, END otherwise.
graph.add_conditional_edges("agent", tools_condition)
```

## Why It Matters

1. **Universal pattern** -- every tool-using agent implements this loop. Recognizing it lets you understand any agent framework by identifying its version of these six steps.
2. **Debugging anchor** -- when an agent misbehaves, the bug is always in one of the six steps: wrong schemas sent, bad tool call generated, execution error, malformed result, or premature termination.
3. **Cost awareness** -- each loop iteration is a full LLM call. A task requiring five tool calls means at least six LLM invocations (one initial plus one after each tool result), directly impacting latency and cost.
4. **Safety boundary** -- the LLM never executes tools directly. The runtime is the gatekeeper, which means you can add validation, rate limiting, or human approval at step 3.

## Key Technical Details

- Tool schemas follow the OpenAI function-calling JSON Schema format; most LLM providers have adopted this standard.
- Each `tool_call` has a unique `id` that the corresponding `ToolMessage` must reference via `tool_call_id` -- mismatched IDs cause errors.
- The LLM can return text content alongside tool calls, though most models leave `content` empty when making tool calls.
- There is no hard limit on loop iterations in the protocol itself; you must enforce max iterations in your application code to prevent runaway loops.
- `ToolNode` in LangGraph handles step 3 automatically, including parallel execution and error wrapping.
- If a tool raises an exception, `ToolNode` wraps the error in a `ToolMessage` so the LLM can see what went wrong and retry or adjust.
- The entire message list is sent on every iteration, so context window usage grows with each loop cycle.

## Common Misconceptions

- **"The LLM executes the tools itself."** The LLM only generates a structured request. A separate runtime -- your Python process -- actually calls the functions and returns results.
- **"One tool call means one loop iteration."** A single LLM response can contain multiple parallel tool calls, all resolved in one iteration before the next LLM call.
- **"The loop always converges quickly."** Without a max-iteration guard, an agent can loop indefinitely if the LLM keeps requesting tools. Always set a practical upper bound.
- **"Tool results go directly to the user."** Tool results go back to the LLM as `ToolMessage` objects. The LLM synthesizes them into a coherent final answer for the user.

## Connections to Other Concepts

- `prebuilt-react-agent.md` -- automates this entire loop with a single function call.
- `manual-react-agent.md` -- implements this loop explicitly as a `StateGraph` with nodes and edges.
- `structured-output.md` -- tool calling and structured output share the same underlying mechanism: constrained LLM generation.
- `state-and-message-management.md` -- how the growing message list is stored and managed across iterations.
- `human-in-the-loop.md` -- inserting a human approval step at the tool-execution stage of the loop.

## Further Reading

- [OpenAI Function Calling Documentation](https://platform.openai.com/docs/guides/function-calling)
- [Anthropic Tool Use Documentation](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [LangGraph Tool Calling Concepts](https://langchain-ai.github.io/langgraph/concepts/agentic_concepts/)
