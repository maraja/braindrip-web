# Binding Tools to Models

**One-Line Summary**: `model.bind_tools(tools)` attaches tool definitions to a chat model so the LLM can generate structured `tool_calls` instead of plain text when it determines a tool should be used.

**Prerequisites**: `langchain-tool-decorator.md`, `tool-schemas-and-validation.md`, understanding of chat model APIs.

## What Is Tool Binding?

Imagine giving a customer service agent a binder of forms they can fill out — one for processing refunds, another for scheduling callbacks, another for looking up orders. The agent still talks to the customer normally, but when the situation calls for it, they pull out the right form and fill it in. Tool binding is exactly this: you hand the LLM a catalog of available tools, and it decides when to "fill out a form" (generate a tool call) instead of responding with plain text.

Without binding, the model has no awareness that tools exist. The `bind_tools()` method injects tool schemas into the model's API request, enabling the native function-calling capabilities of providers like OpenAI, Anthropic, and Google. The model then returns structured `tool_calls` objects rather than free-form text whenever it determines a tool is appropriate.

Critically, the model does not execute the tool. It only generates the call specification — the name, arguments, and a unique ID. Execution happens downstream, typically in a `ToolNode`.

## How It Works

### Basic Tool Binding

```python
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

@tool
def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    return f"72°F and sunny in {city}"

@tool
def get_population(city: str) -> int:
    """Get the population of a city."""
    return 8_336_817  # placeholder

llm = ChatOpenAI(model="gpt-4o")
llm_with_tools = llm.bind_tools([get_weather, get_population])
```

### Provider-Agnostic Initialization

```python
from langchain.chat_models import init_chat_model

llm = init_chat_model("gpt-4o", model_provider="openai")
# or
llm = init_chat_model("claude-sonnet-4-20250514", model_provider="anthropic")

llm_with_tools = llm.bind_tools([get_weather, get_population])
```

`init_chat_model()` lets you swap providers without changing your tool-binding code.

### Inspecting Tool Calls in the Response

```python
response = llm_with_tools.invoke("What's the weather in Tokyo?")

print(response.content)       # Often empty when tool call is made
print(response.tool_calls)
# [{'name': 'get_weather',
#   'args': {'city': 'Tokyo'},
#   'id': 'call_abc123',
#   'type': 'tool_call'}]
```

The response is an `AIMessage` with a `tool_calls` list. Each entry contains:
- `name` — which tool the model wants to invoke
- `args` — the arguments as a dictionary
- `id` — a unique identifier for matching results back to the call

### Forcing a Specific Tool

```python
llm_forced = llm.bind_tools(
    [get_weather, get_population],
    tool_choice="get_weather"
)
```

Setting `tool_choice` forces the model to always call a specific tool, useful for single-purpose pipelines.

## Why It Matters

1. **Enables function calling** — without `bind_tools()`, the model cannot generate structured tool invocations.
2. **Provider abstraction** — the same binding API works across OpenAI, Anthropic, Google, and other supported providers.
3. **Separation of concerns** — the model decides what to call; downstream nodes handle execution, keeping the architecture clean.
4. **Dynamic tool sets** — you can bind different tool subsets for different conversation stages or user permissions.
5. **Foundation for agents** — every ReAct agent, plan-and-execute agent, and custom LangGraph agent starts with tool binding.

## Key Technical Details

- `bind_tools()` returns a new model instance; it does not mutate the original.
- The method accepts a list of `@tool`-decorated functions, `StructuredTool` objects, or Pydantic models.
- `tool_calls` is a list on `AIMessage`; it can contain zero, one, or multiple calls.
- Each `tool_call` has a unique `id` used to correlate `ToolMessage` results back to the originating call.
- `init_chat_model()` requires the provider's package (e.g., `langchain-openai`, `langchain-anthropic`).
- When no tool is appropriate, the model responds with normal text and an empty `tool_calls` list.
- `tool_choice="any"` forces the model to call at least one tool without specifying which.

## Common Misconceptions

- **"bind_tools() executes the tools when the model responds."** It does not. The model only generates a call specification. A `ToolNode` or manual code must execute the actual function.
- **"You can only bind tools to OpenAI models."** Tool binding works with any LangChain chat model that supports function calling, including Anthropic, Google, Mistral, and others.
- **"The model always calls a tool when tools are bound."** The model may respond with plain text if it determines no tool is needed. Use `tool_choice` to force tool usage.
- **"bind_tools() modifies the model in place."** It returns a new runnable instance, leaving the original model unchanged.

## Connections to Other Concepts

- `langchain-tool-decorator.md` — tools must be created before they can be bound.
- `tool-schemas-and-validation.md` — Pydantic schemas are serialized into the tool definitions sent to the model.
- `tool-node.md` — `ToolNode` receives the `tool_calls` from the model and executes the corresponding functions.
- `community-tools.md` — pre-built community tools can be passed directly to `bind_tools()`.

## Further Reading

- [LangChain: How to Use Chat Models to Call Tools](https://python.langchain.com/docs/how_to/tool_calling/)
- [LangChain: init_chat_model API Reference](https://python.langchain.com/api_reference/langchain/chat_models/langchain.chat_models.base.init_chat_model.html)
- [OpenAI Function Calling Documentation](https://platform.openai.com/docs/guides/function-calling)
- [Anthropic Tool Use Documentation](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
