# Stream Modes

**One-Line Summary**: LangGraph provides four streaming modes -- updates, values, messages, and events -- each offering a different granularity of visibility into graph execution.

**Prerequisites**: `what-is-langgraph.md`, `state-and-state-schema.md`, `graph-compilation.md`

## What Is Stream Modes?

Imagine watching a factory assembly line. You could monitor it in several ways: you could see only what changed at each station (a wheel was attached), you could see the entire car after each station, you could watch a single worker's hands move in real time, or you could see every event on the floor including conveyor belt movements. Each perspective is useful for a different purpose. LangGraph's four stream modes give you exactly these perspectives on your graph execution.

When you call `graph.stream()` instead of `graph.invoke()`, LangGraph yields chunks of data as the graph runs rather than waiting for the final result. The `stream_mode` parameter determines what those chunks contain. Choosing the right mode means the difference between a responsive chat UI and an overwhelming firehose of debug data.

The four modes form a spectrum from high-level summaries to granular internals, and you can even combine multiple modes in a single call to get exactly the visibility you need.

## How It Works

### Updates Mode

The `"updates"` mode yields the state delta produced by each node. You see what changed, not the full picture.

```python
# Each chunk is a dict: {node_name: {changed_keys: new_values}}
for chunk in graph.stream(input, stream_mode="updates"):
    print(chunk)  # {'agent': {'messages': [AIMessage(content='Hello')]}}
```

This is ideal for progress tracking -- you can display "Agent is thinking..." then "Tool executed" as each node completes.

### Values Mode

The `"values"` mode yields the complete state snapshot after each node finishes.

```python
# Each chunk is the full state dict
for chunk in graph.stream(input, stream_mode="values"):
    print(chunk)  # {'messages': [...], 'tool_results': [...], ...}
```

Use this when downstream logic needs the full picture at every step, such as rendering an evolving dashboard.

### Messages Mode

The `"messages"` mode streams LLM tokens as they are generated. Each chunk is a `(message_chunk, metadata)` tuple.

```python
# Real-time token streaming for chat UIs
for msg, metadata in graph.stream(input, stream_mode="messages"):
    if msg.content:
        print(msg.content, end="", flush=True)
```

This is the mode you want for responsive chat interfaces where users see text appear character by character.

### Events Mode

The `"events"` mode emits every internal event -- node starts, node ends, LLM calls, tool invocations, and more.

```python
for event in graph.stream(input, stream_mode="events"):
    print(event["event"], event.get("name"))
    # on_chain_start, on_chat_model_stream, on_tool_end, etc.
```

### Combining Multiple Modes

You can request several modes at once by passing a list. Chunks are then tagged with their mode.

```python
for mode, chunk in graph.stream(input, stream_mode=["updates", "messages"]):
    if mode == "messages":
        msg, metadata = chunk
        print(msg.content, end="", flush=True)
    elif mode == "updates":
        print(f"\nNode completed: {list(chunk.keys())}")
```

## Why It Matters

1. **Right tool for the job** -- A chat UI needs `"messages"` for token streaming, while a monitoring dashboard needs `"updates"` for progress bars.
2. **Performance control** -- `"updates"` sends minimal data over the wire; `"values"` sends full state snapshots. Choose based on bandwidth constraints.
3. **Debugging without code changes** -- Switch to `"events"` mode to see every internal operation without adding print statements to your nodes.
4. **Composable observability** -- Combining modes in one call avoids running the graph multiple times to get different views.

## Key Technical Details

- The default `stream_mode` is `"values"` when no mode is specified.
- `"messages"` mode only yields chunks when an LLM is invoked inside a node; non-LLM nodes produce no output in this mode.
- `"events"` mode follows the LangChain event streaming protocol and includes `event`, `name`, `data`, and `run_id` fields.
- When combining modes, each yielded item is a `(mode_name, chunk)` tuple.
- `stream_mode` is passed to `graph.stream()` or `graph.astream()` -- it is not set at compile time.
- The `"updates"` mode respects reducers -- the chunk shows the value after the reducer has been applied.
- Streaming begins immediately; you do not need to wait for the full graph to finish.

## Common Misconceptions

- **"You must choose one stream mode per graph."** You can pass a list of modes to `stream_mode` and receive tagged chunks from all of them in a single run.
- **"The messages mode works for any node output."** It only streams content from LLM calls. Nodes that do pure computation without calling an LLM produce no output in messages mode.
- **"Streaming is only for chat applications."** Updates and values modes are equally useful for backend pipelines, monitoring dashboards, and progress tracking.
- **"Events mode is the same as updates mode with more detail."** Events mode follows a fundamentally different protocol, emitting lifecycle events (start, end, stream) for every component, not just state deltas.

## Connections to Other Concepts

- `token-streaming.md` -- Deep dive into the messages mode for real-time LLM output.
- `async-streaming.md` -- Async versions of all streaming modes using `astream()`.
- `streaming-in-production.md` -- How to expose stream modes over SSE and WebSocket endpoints.
- `../01-langgraph-foundations/state-and-state-schema.md` -- The state object that updates and values modes expose.
- `../01-langgraph-foundations/graph-compilation.md` -- Compilation produces the runnable that supports streaming.
- `../08-observability/tracing-and-debugging.md` -- Events mode complements LangSmith tracing for deep debugging.

## Further Reading

- [LangGraph Streaming Conceptual Guide](https://langchain-ai.github.io/langgraph/concepts/streaming/) -- Official explanation of all streaming modes.
- [LangGraph Streaming How-To Guides](https://langchain-ai.github.io/langgraph/how-tos/streaming/) -- Practical examples for each mode.
- [LangChain Event Streaming Protocol](https://python.langchain.com/docs/concepts/streaming/) -- The underlying protocol used by events mode.
