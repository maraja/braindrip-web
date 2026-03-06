# ToolNode

**One-Line Summary**: `ToolNode` is a prebuilt LangGraph node that extracts tool calls from the last AI message, executes the corresponding tool functions (in parallel when possible), and returns `ToolMessage` results to the graph state.

**Prerequisites**: `langchain-tool-decorator.md`, `binding-tools-to-models.md`, basic LangGraph graph concepts (nodes, edges, state).

## What Is ToolNode?

Think of a ToolNode as a dispatch desk in an office. When a manager (the LLM) writes a set of work orders (tool calls), the dispatch desk reads each order, finds the right employee (tool function) to handle it, sends them all off to work simultaneously, and collects the completed results to send back to the manager. The manager never runs the tasks directly — the dispatch desk handles all execution and routing.

In a LangGraph workflow, the LLM node produces `AIMessage` objects that may contain `tool_calls`. The `ToolNode` sits downstream, inspects the last message, and for each tool call, invokes the matching function with the provided arguments. The results come back as `ToolMessage` objects that get appended to the conversation state, allowing the LLM to see what happened and decide its next step.

This creates the classic agent loop: the LLM reasons and requests tool calls, `ToolNode` executes them, the results flow back to the LLM, and the cycle repeats until the LLM responds with plain text instead of tool calls.

## How It Works

### Basic Setup with ToolNode and tools_condition

```python
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.graph import StateGraph, MessagesState, START, END

@tool
def search(query: str) -> str:
    """Search the web for current information."""
    return f"Top result for: {query}"

@tool
def calculate(expression: str) -> str:
    """Evaluate a mathematical expression."""
    return str(eval(expression))

tools = [search, calculate]
llm = ChatOpenAI(model="gpt-4o").bind_tools(tools)

def chatbot(state: MessagesState):
    return {"messages": [llm.invoke(state["messages"])]}

graph = StateGraph(MessagesState)
graph.add_node("chatbot", chatbot)
graph.add_node("tools", ToolNode(tools))

graph.add_edge(START, "chatbot")
graph.add_conditional_edges("chatbot", tools_condition)
graph.add_edge("tools", "chatbot")

app = graph.compile()
```

### Understanding tools_condition

`tools_condition` is a routing function that inspects the last AI message:
- If `tool_calls` is present and non-empty, it routes to the `"tools"` node.
- If no tool calls exist (the model responded with text), it routes to `END`.

```python
from langgraph.prebuilt import tools_condition

# Equivalent logic:
def custom_tools_condition(state: MessagesState):
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return END
```

### Parallel Tool Execution

When the LLM generates multiple tool calls in a single response, `ToolNode` executes them all:

```python
# If the LLM responds with two tool_calls:
# [{"name": "search", "args": {"query": "AI news"}},
#  {"name": "calculate", "args": {"expression": "2**10"}}]
#
# ToolNode runs both, returns two ToolMessages:
# [ToolMessage(content="Top result for: AI news", tool_call_id="call_1"),
#  ToolMessage(content="1024", tool_call_id="call_2")]
```

Each `ToolMessage` carries the `tool_call_id` that links it back to the original request, so the LLM can match results to calls.

### Running the Agent

```python
from langchain_core.messages import HumanMessage

result = app.invoke({
    "messages": [HumanMessage(content="What is 2^10 and what's the latest AI news?")]
})

for msg in result["messages"]:
    print(f"{msg.type}: {msg.content}")
```

## Why It Matters

1. **Eliminates manual dispatch** — without `ToolNode`, you would write boilerplate to match tool call names to functions, invoke them, and format results.
2. **Parallel execution** — multiple tool calls in one LLM turn are executed concurrently, reducing latency.
3. **Standardized message flow** — `ToolMessage` objects follow LangChain's message protocol, keeping state consistent.
4. **Pairs with tools_condition** — together they form the complete routing logic for any tool-calling agent loop.

## Key Technical Details

- `ToolNode` accepts the same list of tools you pass to `bind_tools()`.
- It matches tool calls by function name, so names must be consistent between binding and the node.
- Each executed tool returns a `ToolMessage` with `content` (the result) and `tool_call_id` (correlation ID).
- If a tool raises an exception, `ToolNode` catches it and returns the error as the `ToolMessage` content by default.
- `tools_condition` returns the string `"tools"` or `END`, used by `add_conditional_edges`.
- The `"tools"` edge name must match the node name you registered with `add_node`.
- `ToolNode` works with both sync and async tool functions.

## Common Misconceptions

- **"ToolNode calls the LLM to decide which tool to use."** It does not involve the LLM at all. It simply reads the `tool_calls` from the last `AIMessage` and executes the named functions.
- **"tools_condition is required for ToolNode to work."** `tools_condition` is a convenience router. You can write custom conditional edge logic that routes to the tools node.
- **"ToolNode can only execute one tool at a time."** It supports parallel execution of multiple tool calls from a single LLM response.
- **"You need separate ToolNodes for each tool."** A single `ToolNode` instance handles all tools passed to it in the list.

## Connections to Other Concepts

- `binding-tools-to-models.md` — the LLM must have tools bound to generate the `tool_calls` that `ToolNode` processes.
- `langchain-tool-decorator.md` — `@tool`-decorated functions are what `ToolNode` executes.
- `tool-schemas-and-validation.md` — schemas validate arguments before tool functions run.
- `community-tools.md` — pre-built community tools can be passed directly to `ToolNode`.

## Further Reading

- [LangGraph: ToolNode API Reference](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.tool_node.ToolNode)
- [LangGraph: Build a Basic Chatbot with Tools](https://langchain-ai.github.io/langgraph/tutorials/get-started/3-tools-and-api/)
- [LangChain: ToolMessage Documentation](https://python.langchain.com/api_reference/core/messages/langchain_core.messages.tool.ToolMessage.html)
