# Streaming in Production

**One-Line Summary**: Production streaming requires Server-Sent Events or WebSocket transport, stateful thread management, interrupt handling, and resilience against timeouts, disconnections, and backpressure.

**Prerequisites**: `stream-modes.md`, `token-streaming.md`, `async-streaming.md`, `../04-memory-and-persistence/thread-based-memory.md`

## What Is Streaming in Production?

Building a streaming chat in a notebook is like testing a garden hose in your backyard. Production streaming is plumbing a high-rise building -- you need pressure regulators (backpressure), shutoff valves (timeouts), return pipes (bidirectional communication), and apartment numbers (thread IDs) so water reaches the right unit. The core concept is the same, but the infrastructure around it is what makes it reliable at scale.

In production, your LangGraph agent runs on a server and clients connect over HTTP or WebSocket. The server must stream tokens to the right client, maintain conversation state across requests, handle clients that disconnect mid-stream, and support human-in-the-loop interrupts without losing progress. This file covers the patterns and protocols that make all of this work.

## How It Works

### Server-Sent Events with FastAPI

SSE is the most common transport for unidirectional streaming. The protocol is simple: the server sends lines formatted as `data: {json}\n\n` and the client reads them with an `EventSource` or `fetch` call.

```python
import json
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    thread_id: str

@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    config = {"configurable": {"thread_id": request.thread_id}}
    async def event_generator():
        async for chunk in agent.astream(
            {"messages": [{"role": "user", "content": request.message}]},
            config=config, stream_mode="messages",
        ):
            message_chunk, metadata = chunk
            if message_chunk.content:
                yield f"data: {json.dumps({'content': message_chunk.content})}\n\n"
        yield "data: [DONE]\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

The `[DONE]` sentinel tells the client the stream is complete, following the convention established by the OpenAI API.

### WebSocket for Bidirectional Communication

When the client needs to send messages during a stream -- such as cancellation signals or HITL approvals -- WebSockets provide a bidirectional channel.

```python
from fastapi import WebSocket

@app.websocket("/chat/ws")
async def chat_websocket(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_json()
        config = {"configurable": {"thread_id": data["thread_id"]}}
        async for msg, metadata in agent.astream(
            {"messages": [("user", data["message"])]},
            config=config, stream_mode="messages",
        ):
            if msg.content:
                await websocket.send_json({"content": msg.content})
        await websocket.send_json({"done": True})
```

### Handling Interrupts During Streaming

When a graph hits an `interrupt()`, the stream pauses. The server must detect this and signal the client to collect human input.

```python
from langgraph.types import Interrupt

@app.post("/chat/stream")
async def chat_with_hitl(request: ChatRequest):
    config = {"configurable": {"thread_id": request.thread_id}}
    async def event_generator():
        async for mode, chunk in agent.astream(
            {"messages": [("user", request.message)]},
            config=config, stream_mode=["messages", "updates"],
        ):
            if mode == "messages":
                msg, metadata = chunk
                if msg.content:
                    yield f"data: {json.dumps({'content': msg.content})}\n\n"
            elif mode == "updates" and "__interrupt" in str(chunk):
                yield f"data: {json.dumps({'interrupt': True})}\n\n"
        yield "data: [DONE]\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

### Production Resilience Patterns

```python
import asyncio

async def resilient_stream(agent, input_data, config, timeout=120):
    """Stream with timeout and graceful error handling."""
    try:
        async for msg, metadata in asyncio.wait_for(
            collect_async_gen(agent.astream(
                input_data, config=config, stream_mode="messages"
            )),
            timeout=timeout,
        ):
            yield f"data: {json.dumps({'content': msg.content})}\n\n"
    except asyncio.TimeoutError:
        yield f"data: {json.dumps({'error': 'timeout'})}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
    finally:
        yield "data: [DONE]\n\n"
```

## Why It Matters

1. **User experience at scale** -- SSE delivers real-time token streaming over standard HTTP without requiring special infrastructure.
2. **Stateful conversations** -- Thread IDs combined with checkpointers give every user a persistent conversation across streaming requests.
3. **Human-in-the-loop compatibility** -- Interrupt handling during streaming lets approval workflows feel seamless to the end user.
4. **Reliability** -- Timeout guards, error boundaries, and connection drop handling prevent silent failures in production.
5. **Protocol flexibility** -- SSE for simple streaming, WebSocket for bidirectional, chosen per use case rather than one-size-fits-all.

## Key Technical Details

- SSE format requires each message to be `data: <payload>\n\n` with a double newline terminator.
- Set `media_type="text/event-stream"` on FastAPI `StreamingResponse` for proper SSE behavior.
- Thread IDs are passed via the `config["configurable"]["thread_id"]` pattern to enable checkpointed state.
- WebSocket connections persist across messages, reducing connection overhead for multi-turn conversations.
- Implement heartbeat pings (`data: {"heartbeat": true}\n\n`) to keep connections alive through proxies and load balancers.
- CORS headers must be configured for browser-based SSE clients connecting from different origins.
- Backpressure occurs when the client reads slower than the server produces; async generators naturally handle this by yielding control.

## Common Misconceptions

- **"SSE requires WebSocket infrastructure."** SSE runs over standard HTTP/1.1 or HTTP/2. No special server configuration is needed beyond supporting long-lived connections.
- **"WebSocket is always better than SSE."** SSE is simpler, works through more proxies, and supports automatic reconnection. Use WebSocket only when the client needs to send data during a stream.
- **"Connection drops lose conversation history."** With checkpointers and thread IDs, the full state is persisted. A reconnecting client can resume or replay from the last checkpoint.
- **"Streaming endpoints do not need authentication."** Production SSE endpoints need the same auth (JWT, API keys) as any other endpoint. Pass tokens via headers or query parameters.

## Connections to Other Concepts

- `stream-modes.md` -- The streaming modes exposed over SSE and WebSocket transports.
- `token-streaming.md` -- The messages mode that powers real-time token delivery to clients.
- `async-streaming.md` -- The `astream()` method that SSE and WebSocket handlers wrap.
- `../04-memory-and-persistence/thread-based-memory.md` -- Thread IDs that make streaming stateful across requests.
- `../05-human-in-the-loop/interrupt-and-resume.md` -- Interrupt handling during active streams.
- `../09-deployment/fastapi-deployment.md` -- Full FastAPI deployment patterns including streaming endpoints.

## Further Reading

- [MDN Server-Sent Events Guide](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) -- Browser-side SSE API reference.
- [FastAPI WebSocket Documentation](https://fastapi.tiangolo.com/advanced/websockets/) -- Official FastAPI WebSocket guide.
- [LangGraph Streaming How-To](https://langchain-ai.github.io/langgraph/how-tos/streaming/) -- Official streaming patterns and examples.
- [OpenAI Streaming Convention](https://platform.openai.com/docs/api-reference/streaming) -- The `data: [DONE]` sentinel convention used industry-wide.
