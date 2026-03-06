# Prebuilt ReAct Agent

**One-Line Summary**: `create_react_agent` from `langgraph.prebuilt` is the highest-level abstraction for building a fully functional tool-calling agent in under 10 lines of code.

**Prerequisites**: `tool-calling-loop.md`, `langgraph-overview.md`

## What Is the Prebuilt ReAct Agent?

Imagine you want to drive somewhere. You could build a car from raw steel and rubber, or you could walk into a dealership and drive one off the lot. `create_react_agent` is the dealership option. It gives you a complete, production-ready agent with a built-in reason-act-observe loop, automatic tool execution, and message management -- all wired together and ready to go.

Under the hood, it constructs a full `StateGraph` with a model node, a tool-execution node, and conditional routing between them. But you never have to touch any of that. You hand it a model, a list of tools, and optionally a system prompt, and it returns a compiled graph that handles the entire ReAct cycle automatically.

This is the recommended starting point for most agent projects. You get the same architecture you would build manually (see `manual-react-agent.md`), but without the boilerplate. When you eventually need custom routing, state, or control flow, you can graduate to the manual approach.

## How It Works

### Minimal Example

```python
from langgraph.prebuilt import create_react_agent
from langchain_anthropic import ChatAnthropic

model = ChatAnthropic(model="claude-sonnet-4-5-20250929")

agent = create_react_agent(
    model=model,
    tools=[search, calculate],
    prompt="You are a helpful research assistant.",
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "What is 25 * 4?"}]
})

print(result["messages"][-1].content)
```

### Using a Model String

You can pass a model identifier string instead of an instance. LangGraph resolves it using the `init_chat_model` interface:

```python
agent = create_react_agent(
    model="anthropic:claude-sonnet-4-5-20250929",
    tools=[search, calculate],
)
```

### Adding Memory with a Checkpointer

To make the agent remember previous turns across invocations, pass a checkpointer and a `thread_id` in the config:

```python
from langgraph.checkpoint.memory import MemorySaver

agent = create_react_agent(
    model=model,
    tools=[search, calculate],
    checkpointer=MemorySaver(),
)

config = {"configurable": {"thread_id": "user-session-42"}}
result = agent.invoke(
    {"messages": [{"role": "user", "content": "Remember my name is Amit."}]},
    config=config,
)
```

### What the Function Builds Internally

When you call `create_react_agent`, it constructs a `StateGraph` equivalent to:

1. An **agent node** that calls the LLM with the current messages and available tool schemas.
2. A **tools node** (`ToolNode`) that executes any tool calls the LLM requested.
3. A **conditional edge** using `tools_condition` -- if the LLM response contains tool calls, route to the tools node; otherwise, route to `END`.
4. An **edge** from the tools node back to the agent node, completing the loop.

This is the exact same graph described in `manual-react-agent.md`, assembled for you automatically.

## Why It Matters

1. **Rapid prototyping** -- go from zero to a working agent in under 10 lines, letting you validate ideas before investing in custom architecture.
2. **Best-practice defaults** -- the prebuilt agent encodes the standard ReAct loop correctly, eliminating an entire class of wiring bugs.
3. **Smooth upgrade path** -- since the prebuilt agent produces a normal compiled `StateGraph`, you can inspect it, stream from it, and eventually replace it with a manual graph when your needs grow.
4. **Checkpointer compatibility** -- passing a checkpointer gives you multi-turn memory with zero additional code, which is critical for conversational agents.

## Key Technical Details

- Returns a compiled `CompiledStateGraph`, not a special agent class -- all standard LangGraph APIs (`.invoke()`, `.stream()`, `.astream()`) work on it.
- The `prompt` parameter accepts a string (converted to a system message) or a list of messages prepended to every invocation.
- The `tools` parameter accepts any mix of LangChain `BaseTool` instances and plain Python functions decorated with `@tool`.
- The model must support tool calling (OpenAI, Anthropic, Google models all do).
- If no checkpointer is provided, the agent is stateless -- each `.invoke()` call is independent.
- The agent automatically handles the message format conversion between user messages, AI messages with tool calls, and `ToolMessage` results.
- You can pass `state_schema` to extend the default `AgentState` with custom fields if needed.

## Common Misconceptions

- **"The prebuilt agent is a toy that cannot be used in production."** It produces the same compiled graph you would build manually. Many production systems start and stay with it.
- **"You cannot customize the prebuilt agent at all."** You can pass a custom `state_schema`, custom `prompt`, and even a `state_modifier` callable for dynamic prompt injection.
- **"The prebuilt agent only works with OpenAI models."** It works with any LangChain chat model that supports tool calling, including Anthropic, Google, Mistral, and others.
- **"`create_react_agent` and AgentExecutor are the same thing."** `AgentExecutor` is the legacy LangChain abstraction. `create_react_agent` is the LangGraph replacement with better streaming, persistence, and human-in-the-loop support.

## Connections to Other Concepts

- `tool-calling-loop.md` -- the fundamental cycle that this function automates end to end.
- `manual-react-agent.md` -- the manual equivalent, for when you need full control over every node and edge.
- `structured-output.md` -- often used alongside the agent for parsing or evaluating the agent's final output.
- `state-and-message-management.md` -- how the `add_messages` reducer accumulates the conversation history inside the graph.
- `checkpointing-and-memory.md` -- deep dive on the checkpointer that enables multi-turn memory.

## Further Reading

- [LangGraph Prebuilt Agents Documentation](https://langchain-ai.github.io/langgraph/how-tos/create-react-agent/)
- [ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2022)](https://arxiv.org/abs/2210.03629)
- [LangGraph Quickstart Tutorial](https://langchain-ai.github.io/langgraph/tutorials/introduction/)
