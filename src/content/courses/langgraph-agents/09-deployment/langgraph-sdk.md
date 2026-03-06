# LangGraph SDK

**One-Line Summary**: The `langgraph-sdk` package provides Python and JavaScript clients for interacting with any LangGraph server -- managing threads, streaming runs, inspecting state, and controlling agent execution through a unified API.

**Prerequisites**: `langgraph-dev-server.md`, `langgraph-platform.md`, `checkpointers.md`, `thread-based-memory.md`

## What Is the LangGraph SDK?

Think of a TV remote control. The TV (your deployed agent) can do many things -- play content, adjust volume, change channels -- but you need a consistent interface to control it. The LangGraph SDK is that remote. Whether your agent runs locally via `langgraph dev`, on LangSmith Cloud, or on a self-hosted server, the SDK provides the same set of operations: create threads, stream runs, inspect state, and manage execution.

The SDK abstracts the REST API into idiomatic Python (and JavaScript) methods. Instead of crafting HTTP requests with headers, JSON payloads, and SSE parsing, you call `client.runs.stream()` and get structured events back. This is especially valuable for streaming, where the SDK handles the SSE connection, event parsing, and reconnection logic that would be tedious to implement manually.

The key insight is that the SDK is not just for cloud deployments. It works against any server that implements the LangGraph API -- `langgraph dev` locally, a self-hosted production server, or LangSmith Cloud. This means your client code is portable across all deployment targets.

## How It Works

### Installation and Client Setup

```python
# pip install langgraph-sdk

from langgraph_sdk import get_client, get_sync_client

# Async client (for async/await code)
async_client = get_client(
    url="http://localhost:2024",        # local dev server
    # url="your-deployment-url",        # cloud deployment
    # api_key="your-langsmith-api-key", # required for cloud
)

# Sync client (for scripts and notebooks)
sync_client = get_sync_client(url="http://localhost:2024")
```

### Threadless Runs (Stateless)

```python
# Threadless run -- no conversation history, no persistence
for chunk in sync_client.runs.stream(
    None,       # None = threadless, no thread_id
    "agent",    # assistant name from langgraph.json
    input={"messages": [{"role": "human", "content": "What is 2 + 2?"}]},
    stream_mode="updates",
):
    print(f"{chunk.event}: {chunk.data}")
```

### Thread-Based Runs (Stateful Conversations)

```python
# Create a thread for persistent multi-turn conversation
thread = sync_client.threads.create()
print(f"Thread ID: {thread['thread_id']}")

# First message
for chunk in sync_client.runs.stream(
    thread["thread_id"],
    "agent",
    input={"messages": [{"role": "human", "content": "Remember: my favorite color is blue."}]},
    stream_mode="messages-tuple",
):
    if chunk.event == "messages":
        content = chunk.data[0].get("content", "")
        if content:
            print(content, end="", flush=True)

# Second message (agent has context from first message)
for chunk in sync_client.runs.stream(
    thread["thread_id"],
    "agent",
    input={"messages": [{"role": "human", "content": "What is my favorite color?"}]},
    stream_mode="messages-tuple",
):
    if chunk.event == "messages":
        content = chunk.data[0].get("content", "")
        if content:
            print(content, end="", flush=True)
```

### Async Streaming

```python
import asyncio
from langgraph_sdk import get_client

async def main():
    client = get_client(url="http://localhost:2024")
    thread = await client.threads.create()

    async for chunk in client.runs.stream(
        thread["thread_id"],
        "agent",
        input={"messages": [{"role": "human", "content": "Tell me a story."}]},
        stream_mode="updates",
    ):
        print(f"{chunk.event}: {chunk.data}")

asyncio.run(main())
```

### State Inspection

```python
# Get the current state of a thread
state = sync_client.threads.get_state(thread["thread_id"])
print(state["values"]["messages"])

# Get state history (all checkpoints)
history = sync_client.threads.get_state_history(thread["thread_id"])
for snapshot in history:
    print(f"Step: {snapshot['checkpoint_id']}")
```

### Human-in-the-Loop with the SDK

```python
# When the agent hits an interrupt, the run pauses
# Resume with the user's response
for chunk in sync_client.runs.stream(
    thread["thread_id"],
    "agent",
    input=None,  # no new user message
    command={"resume": {"action": "approve"}},  # respond to the interrupt
    stream_mode="updates",
):
    print(chunk.data)
```

## Why It Matters

1. **One client for all targets** -- the same code works against local dev, self-hosted, and cloud deployments by changing only the URL and API key.
2. **Streaming made simple** -- SSE parsing, reconnection, and event typing are handled internally, eliminating boilerplate.
3. **Thread lifecycle management** -- create, list, get state, get history, and update threads through clean method calls.
4. **Human-in-the-loop support** -- the `command` parameter enables resuming interrupted runs with user input.
5. **Both sync and async** -- `get_sync_client` for scripts and notebooks, `get_client` for async applications.

## Key Technical Details

- Install with `pip install langgraph-sdk` (Python) or `npm install @langchain/langgraph-sdk` (JavaScript).
- `get_client()` returns an async client; `get_sync_client()` returns a synchronous client.
- The `stream_mode` parameter controls what events you receive: `"updates"` (node outputs), `"messages-tuple"` (message chunks), `"values"` (full state snapshots).
- Threadless runs (`thread_id=None`) are stateless and create no persistent state.
- The `command` parameter on `runs.stream()` and `runs.create()` enables resuming interrupted runs.
- The SDK automatically handles authentication via the `api_key` parameter in the client constructor.
- The local dev server runs on port 2024 by default (not 8123 -- the dev command updated the default port).
- Thread state can be inspected at any checkpoint, enabling replay and debugging of past executions.

## Common Misconceptions

- **"The SDK only works with LangSmith Cloud."** It works with any LangGraph-compatible server, including `langgraph dev` and self-hosted FastAPI deployments that implement the API.
- **"You need the SDK to use LangGraph agents."** The SDK is for client-server communication. If your agent runs in the same process as your application, you invoke the graph directly with `.invoke()` or `.stream()`.
- **"Threadless runs cannot stream."** Threadless runs support full streaming; they simply do not persist state between calls.
- **"The sync and async clients have different features."** They expose identical functionality; the only difference is the calling convention (blocking vs. async/await).

## Connections to Other Concepts

- `langgraph-dev-server.md` -- the local server that the SDK connects to during development
- `langgraph-platform.md` -- the cloud deployment that the SDK connects to in production
- `thread-based-memory.md` -- the SDK manages threads, which are the persistence mechanism for conversation memory
- `checkpointers.md` -- state inspection via the SDK reads from the checkpointer backend
- `interrupt-and-resume.md` -- the SDK's `command` parameter enables resuming human-in-the-loop workflows
- `streaming-tokens.md` -- the SDK's `stream_mode` maps to LangGraph's streaming modes

## Further Reading

- [LangGraph SDK Python Reference](https://langchain-ai.github.io/langgraph/cloud/reference/sdk/python/)
- [LangGraph SDK JavaScript Reference](https://langchain-ai.github.io/langgraph/cloud/reference/sdk/js/)
- [LangGraph Local Server Quickstart](https://docs.langchain.com/oss/python/langgraph/local-server)
- [Streaming How-To Guides](https://langchain-ai.github.io/langgraph/how-tos/streaming-tokens/)
