# LangSmith Setup

**One-Line Summary**: LangSmith provides automatic observability for LangChain and LangGraph applications through simple environment variable configuration.

**Prerequisites**: `langgraph-overview.md`, `building-a-basic-chatbot.md`

## What Is LangSmith?

Think of LangSmith as a flight data recorder for your AI applications. Just as a black box automatically captures every parameter of a flight without the pilot doing anything special, LangSmith automatically records every LLM call, tool invocation, and agent decision once you flip it on. You do not need to add logging statements or modify your application code.

LangSmith is the observability and evaluation platform built by LangChain specifically for LLM-powered applications. It captures the full execution trace of every request that flows through your LangChain or LangGraph application, including inputs, outputs, token counts, latency, cost estimates, and errors. This visibility is essential because agent behavior is non-deterministic and often difficult to reason about from code alone.

The setup is deliberately minimal. You configure three environment variables, and every downstream call through LangChain or LangGraph is automatically instrumented. There is no SDK initialization code, no wrapper classes, and no middleware to configure.

## How It Works

### Environment Variable Configuration

The entire setup requires three environment variables:

```python
import os

# Enable tracing globally
os.environ["LANGSMITH_TRACING"] = "true"

# Your API key from smith.langchain.com
os.environ["LANGSMITH_API_KEY"] = "lsv2_pt_your_key_here"

# Project name to organize traces
os.environ["LANGSMITH_PROJECT"] = "my-agent-project"
```

Alternatively, set them in your shell or `.env` file:

```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=lsv2_pt_your_key_here
export LANGSMITH_PROJECT=my-agent-project
```

### Automatic Tracing in Action

Once the environment variables are set, all LangChain and LangGraph calls are traced automatically:

```python
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated

# No special LangSmith imports needed — tracing is automatic
llm = ChatOpenAI(model="gpt-4o")

class State(TypedDict):
    messages: list

def agent_node(state: State):
    response = llm.invoke(state["messages"])
    return {"messages": state["messages"] + [response]}

graph = StateGraph(State)
graph.add_node("agent", agent_node)
graph.add_edge(START, "agent")
graph.add_edge("agent", END)

app = graph.compile()

# This invocation is fully traced in LangSmith
result = app.invoke({"messages": [("user", "What is LangGraph?")]})
```

### What Gets Captured

Every trace automatically records the following for each step: the input and output payloads, the model name and parameters, prompt and completion token counts, estimated cost in USD, wall-clock latency, tool call arguments and results, and any exceptions or error messages. These traces appear in the LangSmith dashboard organized by project, with each run showing a nested tree of every operation.

### Installing the SDK

```python
# Install the LangSmith SDK alongside LangGraph
# pip install langsmith langgraph langchain-openai

from langsmith import Client

# Verify your connection
client = Client()
print(client.list_projects())
```

## Why It Matters

1. **Zero-friction adoption**: No code changes means you can add observability to an existing application in under a minute, removing the barrier to understanding agent behavior.
2. **Full execution visibility**: Agents make autonomous decisions across multiple steps, and without tracing you are debugging blind. LangSmith shows exactly why an agent chose a particular tool or produced a specific output.
3. **Cost management**: Token usage and cost estimates per trace let you identify expensive operations, optimize prompts, and set budgets before costs spiral.
4. **Latency profiling**: Trace timelines reveal which steps are bottlenecks, whether it is a slow LLM call, a network-bound tool, or an unnecessary loop iteration.
5. **Production confidence**: Moving from prototype to production requires evidence that the system works reliably. Traces provide that evidence for every single request.

## Key Technical Details

- LangSmith tracing is **opt-in via environment variables** and adds negligible overhead (traces are sent asynchronously).
- The `LANGSMITH_PROJECT` variable groups traces logically; you can use different projects for dev, staging, and production.
- Traces are stored in the LangSmith cloud at `smith.langchain.com`, with a free tier available for development.
- Every LangChain `Runnable` (LLMs, chains, tools, retrievers) is automatically instrumented.
- LangGraph nodes, edges, conditional routing, and state transitions all appear as nested spans.
- Setting `LANGSMITH_TRACING=false` disables tracing entirely with no performance impact.
- API keys are scoped to organizations and can be rotated without code changes.
- Self-hosted LangSmith is available for enterprise deployments with data residency requirements.

## Common Misconceptions

- **"LangSmith requires adding decorators or wrappers to every function."** All LangChain and LangGraph components are auto-instrumented. Decorators are only needed for custom non-LangChain functions.
- **"Tracing slows down my application significantly."** Traces are sent asynchronously in background threads. The latency overhead is typically under 1ms per span.
- **"I need a paid plan to use LangSmith during development."** LangSmith offers a free tier with generous trace limits that is sufficient for most development and testing workflows.
- **"LangSmith only works with OpenAI models."** LangSmith traces any model provider supported by LangChain, including Anthropic, Google, Cohere, local models, and custom LLM wrappers.

## Connections to Other Concepts

- `tracing-and-debugging.md` — Deep dive into reading traces and using the `@traceable` decorator for custom functions.
- `evaluation-with-datasets.md` — Use LangSmith datasets and evaluators to systematically test agent quality.
- `production-monitoring.md` — Dashboards, alerting, and feedback collection for deployed agents.
- `tool-calling-basics.md` — Tool calls are a primary trace element; LangSmith captures every argument and return value.
- `langgraph-overview.md` — LangGraph's graph execution model maps directly to nested trace spans.

## Further Reading

- [LangSmith Documentation](https://docs.smith.langchain.com/) — Official setup guides and API reference.
- [LangSmith Walkthrough (LangChain Blog)](https://blog.langchain.dev/langsmith/) — Introductory overview with screenshots.
- [LangGraph + LangSmith Tutorial](https://langchain-ai.github.io/langgraph/how-tos/tracing/) — Step-by-step tracing for LangGraph agents.
- [LangSmith Cookbook](https://github.com/langchain-ai/langsmith-cookbook) — Practical recipes for common observability patterns.
