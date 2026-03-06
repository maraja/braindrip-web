# Tracing and Debugging

**One-Line Summary**: LangSmith traces provide nested span visibility into every node, edge, and LLM call, with the `@traceable` decorator extending coverage to custom functions.

**Prerequisites**: `langsmith-setup.md`, `langgraph-overview.md`

## What Is Tracing and Debugging?

Imagine you are a detective investigating a case, and someone hands you a complete timeline of every person involved — where they went, what they said, how long each conversation lasted, and what decisions they made. That is what a LangSmith trace gives you for an agent execution. Every node traversal, every LLM prompt and response, every tool call and return value is recorded in a nested, time-ordered hierarchy.

Debugging LLM applications is fundamentally different from debugging traditional software. A conventional bug produces the same wrong output every time for the same input. An agent bug might manifest as the model choosing the wrong tool 30% of the time, or producing subtly incorrect reasoning that looks plausible on the surface. You cannot find these problems with print statements or breakpoints. You need structured traces that let you compare runs side by side and pinpoint exactly where behavior diverged.

LangSmith traces solve this by capturing the full call tree automatically for LangChain and LangGraph components, while the `@traceable` decorator lets you extend that same visibility to any custom Python function in your pipeline.

## How It Works

### Reading a Trace

A LangSmith trace is a tree of spans. For a LangGraph agent, the hierarchy typically looks like this: the top-level graph run contains child spans for each node execution, and each node span contains child spans for LLM calls, tool invocations, or retriever queries. Every span records its input, output, start time, end time, and metadata.

### The @traceable Decorator

The `@traceable` decorator from the `langsmith` package adds any custom function to the trace tree:

```python
from langsmith import traceable

@traceable
def my_custom_function(query: str) -> str:
    result = process(query)
    return result

@traceable(name="Custom Retrieval", metadata={"version": "2.0"})
def retrieve_documents(query: str) -> list:
    docs = vector_store.search(query)
    return docs
```

When these functions are called within a traced LangGraph execution, they appear as named spans in the trace tree with their inputs, outputs, and timing captured automatically.

### Adding Context to Traces

You can enrich traces with custom metadata and tags for easier filtering:

```python
from langsmith import traceable

@traceable(
    name="Query Classifier",
    tags=["classification", "routing"],
    metadata={"model_version": "v3", "team": "search"}
)
def classify_query(query: str) -> str:
    """Classify user intent for routing."""
    if "weather" in query.lower():
        return "weather_tool"
    elif "search" in query.lower():
        return "web_search"
    return "general_llm"
```

### Debugging a Failed Agent Run

A typical debugging workflow using traces follows these steps:

```python
from langsmith import Client

client = Client()

# Fetch recent failed runs for investigation
runs = list(client.list_runs(
    project_name="my-agent-project",
    filter='eq(status, "error")',
    limit=10
))

for run in runs:
    print(f"Run ID: {run.id}")
    print(f"Error: {run.error}")
    print(f"Input: {run.inputs}")
    print(f"Latency: {run.total_tokens} tokens, {run.latency}s")
    print("---")
```

### Comparing Runs Side by Side

When an agent produces inconsistent results, pull two runs and compare their execution paths:

```python
from langsmith import Client

client = Client()

# Fetch child spans for a specific run to see the full call tree
child_runs = list(client.list_runs(
    project_name="my-agent-project",
    filter='eq(parent_run_id, "run-uuid-here")'
))

for child in child_runs:
    print(f"  {child.name}: {child.run_type}")
    print(f"    Input: {str(child.inputs)[:100]}")
    print(f"    Output: {str(child.outputs)[:100]}")
    print(f"    Latency: {child.latency:.2f}s")
```

## Why It Matters

1. **Root cause analysis**: When an agent takes the wrong action, traces show exactly which LLM call produced the incorrect reasoning and what context it had available.
2. **Performance optimization**: Latency per span reveals whether the bottleneck is a slow model call, a network-bound tool, or redundant graph loops.
3. **Token cost attribution**: Traces break down token usage per step, showing which nodes are expensive and where prompt optimization will have the most impact.
4. **Regression detection**: Comparing traces across model versions or prompt changes reveals behavioral differences that aggregate metrics would miss.

## Key Technical Details

- Traces are **hierarchical**: a graph run contains node runs, which contain LLM runs, which may contain tool runs.
- The `@traceable` decorator works on both sync and async functions with the same syntax.
- Custom spans created with `@traceable` automatically nest under the nearest parent span in the call stack.
- Each span records `start_time`, `end_time`, `inputs`, `outputs`, `error`, `metadata`, and `tags`.
- Traces can be filtered in the dashboard by tags, metadata, latency ranges, token counts, and error status.
- The `run_tree` context variable lets you programmatically access the current trace from within a function.
- LangSmith retains traces based on your plan tier, with configurable retention policies for production.

## Common Misconceptions

- **"I need @traceable on every function in my codebase."** Only decorate functions whose inputs and outputs you want visible in traces. LangChain and LangGraph components are already auto-instrumented.
- **"Traces only capture text inputs and outputs."** Traces capture any serializable Python object, including lists, dictionaries, dataclass instances, and Pydantic models.
- **"Debugging with traces replaces traditional debugging tools."** Traces complement debuggers and logging. Use traces for understanding agent-level behavior across runs, and traditional tools for stepping through individual function logic.
- **"Each @traceable call creates a separate top-level trace."** Decorated functions nest automatically under the parent trace when called within a traced execution context.

## Connections to Other Concepts

- `langsmith-setup.md` — Environment variable configuration required before any tracing works.
- `evaluation-with-datasets.md` — Traces from evaluation runs help diagnose why specific test cases fail.
- `production-monitoring.md` — Production traces feed into dashboards and alerting systems.
- `state-management-deep-dive.md` — State snapshots at each node appear in trace inputs and outputs.
- `tool-calling-basics.md` — Tool call spans show the exact arguments sent and values returned.
- `conditional-edges.md` — Conditional routing decisions are visible as edge spans in the trace tree.

## Further Reading

- [LangSmith Tracing Guide](https://docs.smith.langchain.com/tracing) — Official documentation on trace structure and the `@traceable` API.
- [Debugging LLM Applications (LangChain Blog)](https://blog.langchain.dev/debugging-llm-applications/) — Practical debugging strategies with trace examples.
- [LangSmith Python SDK Reference](https://docs.smith.langchain.com/reference/python) — Complete API for programmatic trace access.
