# Choosing Your Framework

**One-Line Summary**: The right framework for building a multi-skill agent depends on your complexity needs, control requirements, and team experience — options range from raw API loops to full orchestration platforms.

**Prerequisites**: `anatomy-of-a-multi-skill-agent.md`, `agent-runtime-loop.md`

## What Is an Agent Framework?

Think of agent frameworks the way you think about web frameworks. You could write a web server from scratch using raw sockets, but most people use Express, Django, or Rails because those frameworks handle routing, middleware, error handling, and a hundred other concerns. Agent frameworks do the same thing for the agent runtime loop: they provide the loop structure, tool dispatch, context management, and state handling so you can focus on defining skills and behavior.

The landscape in 2025 spans a wide spectrum. On one end, you can write a raw API loop in 50 lines of Python — full control, no dependencies, no magic. On the other end, platforms like LangGraph and CrewAI provide rich abstractions for state machines, multi-agent coordination, and persistence. In between, lightweight SDKs like the Claude Agent SDK offer a minimal runtime that handles the loop and tool dispatch without imposing an opinionated architecture.

Choosing the right framework is a genuine architectural decision. The wrong choice can mean fighting the framework's abstractions when your use case doesn't fit, or reinventing wheels when a framework already solves your problem. The key is understanding what each framework gives you and what it costs in terms of complexity, lock-in, and learning curve.

## How It Works

### Framework Comparison

| Framework | Approach | Best For | Complexity | Control |
|-----------|----------|----------|------------|---------|
| **Raw API Loop** | DIY with HTTP calls | Learning, simple agents | Minimal | Total |
| **Claude Agent SDK** | Code-first, minimal | Production agents, Claude-native | Low | High |
| **LangGraph** | Graph-based state machine | Complex workflows, branching logic | Medium-High | High |
| **CrewAI** | Role-based multi-agent | Team simulations, parallel agents | Medium | Medium |
| **AutoGen** | Conversation-based | Research, multi-model setups | Medium | Medium |
| **OpenAI Agents SDK** | Runner-based with handoffs | OpenAI-native, agent transfers | Low-Medium | Medium |

### Raw API Loop

The most direct approach. You write the loop yourself using the model provider's API:

```python
import anthropic

client = anthropic.Anthropic()

def run_agent(goal: str, tools: list[dict]) -> str:
    messages = [{"role": "user", "content": goal}]

    for _ in range(15):
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            tools=tools,
            messages=messages,
        )

        if response.stop_reason == "end_turn":
            return response.content[0].text

        # Execute tools, append results
        messages.append({"role": "assistant", "content": response.content})
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result,
                })
        messages.append({"role": "user", "content": tool_results})

    return "Max iterations reached."
```

**Pros**: Zero dependencies, complete understanding of every line, no framework-imposed constraints.
**Cons**: You must build context management, error handling, retries, logging, and state persistence yourself.

### Claude Agent SDK

A lightweight, code-first SDK designed to make the common case easy without hiding the mechanics:

```python
from claude_code_sdk import Agent, tool

@tool
def web_search(query: str, num_results: int = 5) -> str:
    """Search the web for current information."""
    results = search_api(query, num_results)
    return format_results(results)

@tool
def read_file(path: str) -> str:
    """Read the contents of a file."""
    with open(path) as f:
        return f.read()

agent = Agent(
    model="claude-sonnet-4-20250514",
    tools=[web_search, read_file],
    system_prompt="You are a helpful research assistant.",
    max_turns=15,
)

result = agent.run("Summarize the latest news about renewable energy.")
print(result)
```

**Pros**: Minimal boilerplate, Pythonic tool definitions, handles the loop and dispatch for you.
**Cons**: Tightly coupled to Claude models, less community ecosystem than LangChain/LangGraph.

### LangGraph

A graph-based framework where you define agent behavior as a state machine with explicit nodes and edges:

```python
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_anthropic import ChatAnthropic

model = ChatAnthropic(model="claude-sonnet-4-20250514").bind_tools(tools)

def should_continue(state):
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return END

def call_model(state):
    response = model.invoke(state["messages"])
    return {"messages": [response]}

workflow = StateGraph(dict)
workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode(tools))
workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
workflow.add_edge("tools", "agent")

app = workflow.compile()
result = app.invoke({"messages": [("human", "Research renewable energy trends")]})
```

**Pros**: Visual graph representation, checkpointing and state persistence built in, human-in-the-loop patterns, supports complex branching and cycles.
**Cons**: Steeper learning curve, more abstraction layers, graph-based thinking is not natural for all developers.

### CrewAI

A role-based framework where you define agents as team members with specific roles:

```python
from crewai import Agent, Task, Crew

researcher = Agent(
    role="Senior Research Analyst",
    goal="Find comprehensive data on renewable energy trends",
    tools=[web_search, read_file],
    llm="claude-sonnet-4-20250514",
)

writer = Agent(
    role="Technical Writer",
    goal="Create clear, well-structured reports",
    tools=[write_file],
    llm="claude-sonnet-4-20250514",
)

research_task = Task(
    description="Research the latest renewable energy trends for 2025",
    agent=researcher,
)
writing_task = Task(
    description="Write a summary report based on the research",
    agent=writer,
)

crew = Crew(agents=[researcher, writer], tasks=[research_task, writing_task])
result = crew.kickoff()
```

**Pros**: Intuitive role-based mental model, built-in multi-agent delegation, good for tasks that naturally decompose into roles.
**Cons**: Less fine-grained control over the execution loop, role abstraction can be forced for tasks that don't naturally have roles.

### AutoGen

A conversation-based framework where agents interact through messages:

```python
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent(
    name="research_assistant",
    llm_config={"model": "claude-sonnet-4-20250514"},
)

user_proxy = UserProxyAgent(
    name="user",
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "workspace"},
)

user_proxy.initiate_chat(
    assistant,
    message="Research renewable energy trends and save a summary to report.md",
)
```

**Pros**: Multi-agent conversations feel natural, strong code execution support, good for research workflows.
**Cons**: Conversation-based routing can be unpredictable, harder to enforce strict execution patterns.

### Decision Criteria

Ask these questions to choose your framework:

1. **How complex is the workflow?** Simple linear chains: raw loop or Agent SDK. Branching, cycles, checkpoints: LangGraph. Multi-role coordination: CrewAI.
2. **How much control do you need?** If you need to control every LLM call: raw loop. If you want guardrails but not micromanagement: Agent SDK or LangGraph.
3. **Is this a single-agent or multi-agent system?** Single agent: raw loop, Agent SDK, or LangGraph. Multiple cooperating agents: CrewAI or AutoGen.
4. **What's your team's experience?** New to agents: start with raw loop to understand the fundamentals, then adopt a framework. Experienced: choose based on the specific workflow pattern.
5. **What model(s) are you using?** Claude-only: Agent SDK or raw Anthropic API. Multi-model: LangGraph or AutoGen.

## Why It Matters

### Frameworks Encode Opinions

Every framework makes assumptions about how agents should work. LangGraph assumes graph-based state machines are the right abstraction. CrewAI assumes role-based decomposition. Understanding these opinions helps you choose the framework whose assumptions match your problem.

### The Right Abstraction Level Matters

Too much framework and you spend time fighting it. Too little and you reinvent basics. The sweet spot depends on your team and your problem. Most teams building their first agent should start with a raw loop or minimal SDK, then adopt a richer framework only when they hit specific pain points that the framework solves.

## Key Technical Details

- Raw API loops require ~50-100 lines of boilerplate; frameworks reduce this to ~10-30 lines
- LangGraph adds ~200ms overhead per node transition for state serialization
- CrewAI agents can run in parallel, but inter-agent communication adds latency
- Framework lock-in is real: migrating between frameworks typically requires rewriting tool definitions and orchestration logic
- All frameworks ultimately make the same API calls — the differences are in state management, error handling, and developer experience
- Most frameworks support streaming responses, but the implementation details vary significantly

## Common Misconceptions

**"You need a framework to build an agent"**: A raw API loop in 50 lines of Python is a fully functional agent. Frameworks add convenience and handle edge cases, but they are not prerequisites. If your agent has 3-5 tools and a linear workflow, a raw loop may be the best choice — less code, fewer dependencies, easier to debug.

**"The framework determines agent quality"**: The quality of an agent depends primarily on the skill definitions (schemas, descriptions, implementations) and the system prompt — not the framework. A poorly designed agent in LangGraph will underperform a well-designed raw loop. Frameworks handle plumbing; you handle the intelligence.

## Connections to Other Concepts

- `anatomy-of-a-multi-skill-agent.md` — The three-layer architecture that all frameworks implement
- `agent-runtime-loop.md` — The core loop that frameworks abstract over
- `the-skill-abstraction.md` — Skill definitions are the one thing you always write yourself, regardless of framework
- `designing-effective-tool-schemas.md` — Schemas must work with your chosen framework's tool format

## Further Reading

- LangGraph Documentation, "Quick Start" (2024) — Official guide to building graph-based agents
- Anthropic, "Claude Agent SDK" (2025) — Lightweight agent runtime for Claude
- CrewAI Documentation, "Getting Started" (2024) — Role-based multi-agent framework
- Microsoft, "AutoGen: Enabling Next-Gen LLM Applications" (2023) — Conversational agent framework
- Andrew Ng, "Agentic Design Patterns" (2024) — Framework-agnostic patterns for agent architecture
