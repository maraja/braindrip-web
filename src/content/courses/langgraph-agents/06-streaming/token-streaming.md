# Token Streaming

**One-Line Summary**: The `"messages"` stream mode delivers LLM output token-by-token as `(message_chunk, metadata)` tuples, enabling responsive real-time chat interfaces.

**Prerequisites**: `stream-modes.md`, `../01-langgraph-foundations/what-is-langgraph.md`, `../03-building-your-first-agent/prebuilt-react-agent.md`

## What Is Token Streaming?

Picture a news ticker scrolling across the bottom of a TV screen. Each word appears the moment it is available rather than waiting for the entire headline to be written. Token streaming works the same way -- instead of waiting for the LLM to finish its entire response, you receive each token (roughly a word or word fragment) the instant the model produces it. This turns a multi-second wait into a fluid, typewriter-like experience.

Without token streaming, a user staring at a chat interface sees nothing until the model finishes -- which can take 5 to 30 seconds for long responses. With token streaming, the first token appears in under a second, and the response builds in real time. This perceived speed is what makes modern chat applications feel responsive.

In LangGraph, token streaming is activated by using the `"messages"` stream mode. Every chunk the graph yields is a tuple of a message fragment and metadata describing where it came from.

## How It Works

### Basic Token Streaming

```python
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o", streaming=True)
agent = create_react_agent(llm, tools=[])

for msg, metadata in agent.stream(
    {"messages": [("user", "Explain quantum computing")]},
    stream_mode="messages",
):
    if msg.content:
        print(msg.content, end="", flush=True)
```

Each `msg` is an `AIMessageChunk` object containing a small piece of the response. The `end=""` and `flush=True` arguments ensure tokens print on the same line without buffering.

### Understanding Metadata

The `metadata` dict tells you which node generated the chunk, allowing you to filter or route output.

```python
for msg, metadata in agent.stream(input, stream_mode="messages"):
    node_name = metadata.get("langgraph_node", "unknown")

    # Only stream tokens from the main agent node
    if node_name == "agent" and msg.content:
        print(msg.content, end="", flush=True)
    elif node_name == "tools":
        pass  # Suppress tool execution output
```

### Filtering by Node in Multi-Node Graphs

In complex graphs with multiple LLM-calling nodes, you often want to stream from only one.

```python
STREAM_NODES = {"writer", "summarizer"}

for msg, metadata in graph.stream(input, stream_mode="messages"):
    if metadata.get("langgraph_node") in STREAM_NODES and msg.content:
        yield msg.content
```

### Collecting the Full Response

You can accumulate chunks into a complete message while streaming.

```python
full_response = ""
for msg, metadata in agent.stream(input, stream_mode="messages"):
    if msg.content and metadata.get("langgraph_node") == "agent":
        full_response += msg.content
        print(msg.content, end="", flush=True)

print(f"\n\nFull response length: {len(full_response)}")
```

### Tool Call Chunks

When the LLM decides to call a tool, the stream emits chunks with `tool_call_chunks` instead of `content`.

```python
for msg, metadata in agent.stream(input, stream_mode="messages"):
    if msg.content:
        print(msg.content, end="", flush=True)
    elif msg.tool_call_chunks:
        for tc in msg.tool_call_chunks:
            print(f"\n[Calling tool: {tc.get('name', '...')}]")
```

## Why It Matters

1. **Perceived latency drops dramatically** -- Users see the first token in under a second even if the full response takes 15 seconds.
2. **Chat UIs feel natural** -- Token-by-token rendering matches the experience users expect from modern AI assistants.
3. **Node-level filtering** -- Metadata lets you stream selectively, showing only the final answer and hiding internal reasoning.
4. **Progressive rendering** -- Frontends can parse partial markdown, render lists, and format code blocks as tokens arrive.

## Key Technical Details

- Each chunk is a `(BaseMessageChunk, dict)` tuple -- typically `AIMessageChunk` for LLM responses.
- The `metadata` dict always contains `langgraph_node` identifying the source node.
- The LLM must support streaming; most modern providers (OpenAI, Anthropic, Google) do by default.
- Tool call decisions stream as `tool_call_chunks` on the message object, not as `content`.
- Empty `content` strings are common between tool calls -- always check `if msg.content` before rendering.
- Token streaming works with both `graph.stream()` (sync) and `graph.astream()` (async).
- The `"messages"` mode only emits during LLM inference; non-LLM nodes are silent.
- Message chunks include `id` and `response_metadata` for tracking and billing.

## Common Misconceptions

- **"Token streaming requires special LLM configuration."** Most LangChain chat model wrappers stream by default. You rarely need to set `streaming=True` explicitly.
- **"Every chunk contains meaningful text."** Many chunks have empty `content` -- especially during tool call generation. Always guard with `if msg.content`.
- **"Token streaming shows all graph activity."** It only shows LLM output. For full graph visibility, use `"events"` or `"updates"` mode instead.

## Connections to Other Concepts

- `stream-modes.md` -- Overview of all four stream modes including messages mode.
- `async-streaming.md` -- Async token streaming with `astream()` for non-blocking applications.
- `streaming-in-production.md` -- Forwarding token streams over SSE and WebSocket connections.
- `../02-tools-and-models/binding-tools-to-models.md` -- How tool binding affects what appears in the token stream.
- `../03-building-your-first-agent/prebuilt-react-agent.md` -- The prebuilt agent used in examples above.
- `../09-deployment/fastapi-deployment.md` -- Integrating token streaming into a FastAPI endpoint.

## Further Reading

- [LangGraph Streaming Messages How-To](https://langchain-ai.github.io/langgraph/how-tos/streaming-tokens/) -- Official guide to token streaming.
- [LangChain Streaming Documentation](https://python.langchain.com/docs/concepts/streaming/) -- How LangChain chat models handle streaming under the hood.
- [OpenAI Streaming API Reference](https://platform.openai.com/docs/api-reference/streaming) -- The upstream protocol that messages mode wraps.
