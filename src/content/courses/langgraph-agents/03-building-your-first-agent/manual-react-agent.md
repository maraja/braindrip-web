# Manual ReAct Agent

**One-Line Summary**: Building the ReAct pattern by hand with `StateGraph` gives you full control over every node, edge, and routing decision in the agent loop.

**Prerequisites**: `tool-calling-loop.md`, `prebuilt-react-agent.md`, `langgraph-overview.md`

## What Is a Manual ReAct Agent?

If `create_react_agent` is buying a car off the lot, building a manual ReAct agent is assembling one in your garage. You pick every component: the engine (LLM node), the transmission (conditional routing), and the drivetrain (tool execution). The result is the same reason-act-observe loop, but you control every bolt.

This matters because real-world agents rarely stay simple. You may need to inject a validation step between the LLM and tool execution, add a human approval gate, or branch into entirely different subgraphs depending on context. The manual approach gives you those extension points from the start.

The construction follows a repeatable recipe: define state, create nodes, wire edges, compile. Once you internalize this recipe, you can build arbitrarily complex agent architectures by adding more nodes and edges to the same pattern.

## How It Works

### Step 1 -- Define the Agent State

```python
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
```

The `add_messages` reducer ensures new messages are appended to the list rather than replacing it. This is what accumulates the conversation history across loop iterations.

### Step 2 -- Create the Model Node

```python
from langchain_anthropic import ChatAnthropic

model = ChatAnthropic(model="claude-sonnet-4-5-20250929")
model_with_tools = model.bind_tools([search, calculate])

def call_model(state: AgentState):
    response = model_with_tools.invoke(state["messages"])
    return {"messages": [response]}
```

The node receives the current state, calls the LLM with all accumulated messages, and returns the response. The `add_messages` reducer appends it to the history.

### Step 3 -- Set Up Tool Execution

```python
from langgraph.prebuilt import ToolNode

tool_node = ToolNode([search, calculate])
```

`ToolNode` automatically extracts `tool_calls` from the last AI message, executes the corresponding functions, and returns the results as `ToolMessage` objects.

### Step 4 -- Wire the Graph

```python
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import tools_condition

graph = StateGraph(AgentState)

graph.add_node("agent", call_model)
graph.add_node("tools", tool_node)

graph.set_entry_point("agent")
graph.add_conditional_edges("agent", tools_condition)
graph.add_edge("tools", "agent")

agent = graph.compile()
```

The `tools_condition` function inspects the last message: if it contains `tool_calls`, it routes to `"tools"`; otherwise, it routes to `END`. The edge from `"tools"` back to `"agent"` closes the loop.

### Step 5 -- Run the Agent

```python
result = agent.invoke({
    "messages": [{"role": "user", "content": "Search for the population of France."}]
})
print(result["messages"][-1].content)
```

### Full Code in One Block

```python
from typing import Annotated
from typing_extensions import TypedDict
from langchain_anthropic import ChatAnthropic
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

model = ChatAnthropic(model="claude-sonnet-4-5-20250929")
model_with_tools = model.bind_tools([search, calculate])

def call_model(state: AgentState):
    response = model_with_tools.invoke(state["messages"])
    return {"messages": [response]}

graph = StateGraph(AgentState)
graph.add_node("agent", call_model)
graph.add_node("tools", ToolNode([search, calculate]))
graph.set_entry_point("agent")
graph.add_conditional_edges("agent", tools_condition)
graph.add_edge("tools", "agent")

agent = graph.compile()
```

## Why It Matters

1. **Extensibility** -- you can insert custom nodes (logging, validation, human-in-the-loop) anywhere in the loop without fighting the abstraction.
2. **Debugging visibility** -- every node and edge is explicit, making it straightforward to trace exactly where a run went wrong.
3. **Custom routing** -- replace `tools_condition` with your own function to implement multi-path branching, retry logic, or fallback strategies.
4. **Foundation for advanced patterns** -- multi-agent systems, hierarchical agents, and plan-and-execute architectures all build on this same graph construction recipe.

## Key Technical Details

- `add_messages` is a **reducer**, not a setter. Returning `{"messages": [response]}` appends rather than replaces.
- `tools_condition` returns the string `"tools"` or `END`. You can write your own function with any return values as long as they match node names.
- `ToolNode` handles parallel tool calls automatically when the LLM requests multiple tools in a single response.
- `bind_tools` attaches the tool schemas to the model so the LLM knows what tools are available on every call.
- `set_entry_point("agent")` is equivalent to `add_edge(START, "agent")`.
- The compiled graph supports `.invoke()`, `.stream()`, `.astream()`, and `.get_graph().draw_mermaid()` for visualization.
- Adding a checkpointer to `graph.compile(checkpointer=MemorySaver())` enables multi-turn memory, identical to the prebuilt agent.

## Common Misconceptions

- **"You need the manual approach to get production quality."** The prebuilt agent produces the exact same compiled graph. Use manual construction when you need structural changes, not as a quality measure.
- **"Each node must be a class."** Nodes are plain Python functions that accept state and return a partial state dict. No class inheritance is required.
- **"The tools node calls the LLM again."** `ToolNode` only executes the requested tool functions. The LLM is called again only when control flows back to the agent node.
- **"You must define routing logic for every possible path."** `add_conditional_edges` maps return values to node names. Unmapped values raise an error at runtime, which is desirable for catching bugs early.

## Connections to Other Concepts

- `prebuilt-react-agent.md` -- the automated version that builds this exact graph for you.
- `tool-calling-loop.md` -- the conceptual cycle that this graph implements structurally.
- `structured-output.md` -- can be used inside custom nodes for typed decision-making within the loop.
- `state-and-message-management.md` -- deeper explanation of `AgentState`, reducers, and state channels.
- `human-in-the-loop.md` -- adding interrupt points to this graph for human approval before tool execution.

## Further Reading

- [LangGraph StateGraph Documentation](https://langchain-ai.github.io/langgraph/concepts/low_level/)
- [ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2022)](https://arxiv.org/abs/2210.03629)
- [LangGraph How-To: Build a ReAct Agent from Scratch](https://langchain-ai.github.io/langgraph/how-tos/react-agent-from-scratch/)
