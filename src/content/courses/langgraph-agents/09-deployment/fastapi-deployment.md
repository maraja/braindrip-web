# FastAPI Deployment

**One-Line Summary**: Wrapping a LangGraph agent in FastAPI gives you a production-ready API with sync and streaming endpoints, full control over auth, rate limiting, and zero vendor lock-in.

**Prerequisites**: `prebuilt-react-agent.md`, `checkpointers.md`, `streaming-tokens.md`

## What Is FastAPI Deployment?

Think of FastAPI as building your own restaurant around a chef. The chef (your LangGraph agent) does the cooking, but you need a front-of-house -- a door to receive customers, a menu they can read, waitstaff to carry plates, and a system to handle the bill. FastAPI provides all of that infrastructure so your agent can serve real users over HTTP.

The simplest production deployment pattern wraps your compiled LangGraph agent in two FastAPI endpoints: a synchronous `/chat` endpoint that returns a complete response, and a `/chat/stream` endpoint that uses Server-Sent Events (SSE) to push tokens to the client in real time. This gives frontend applications everything they need -- a request-response pattern for simple use cases and a streaming pattern for the ChatGPT-style typing effect users expect.

This approach is the most common way to deploy LangGraph agents because it requires no proprietary platform, works with any hosting provider (AWS, GCP, Azure, a VPS), and gives you complete control over authentication, rate limiting, error handling, and observability. If you can deploy a Python web server, you can deploy a LangGraph agent.

## How It Works

### Complete Working Example

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
import json, uvicorn

app = FastAPI(title="AI Agent API")

# Initialize agent at module level (created once, shared across requests)
checkpointer = MemorySaver()  # Use PostgresSaver in production
agent = create_react_agent(
    model="openai:gpt-4o",
    tools=[],
    checkpointer=checkpointer,
)

class ChatRequest(BaseModel):
    message: str
    thread_id: str = "default"

@app.post("/chat")
async def chat(request: ChatRequest):
    config = {"configurable": {"thread_id": request.thread_id}}
    result = agent.invoke(
        {"messages": [{"role": "user", "content": request.message}]}, config=config
    )
    return {"response": result["messages"][-1].content, "thread_id": request.thread_id}

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

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Running the Server

```python
# Terminal: start the server
# uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Test sync endpoint
# curl -X POST http://localhost:8000/chat \
#   -H "Content-Type: application/json" \
#   -d '{"message": "Hello!", "thread_id": "user-1"}'

# Test streaming endpoint
# curl -X POST http://localhost:8000/chat/stream \
#   -H "Content-Type: application/json" \
#   -d '{"message": "Tell me a joke", "thread_id": "user-1"}'
```

### Adding Authentication Middleware

```python
from fastapi import Depends, HTTPException, Header

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != "your-secret-key":
        raise HTTPException(status_code=401, detail="Invalid API key")

@app.post("/chat", dependencies=[Depends(verify_api_key)])
async def chat(request: ChatRequest):
    ...  # same as above
```

## Why It Matters

1. **Full ownership** -- you control every layer of the stack, from authentication to error handling, with no platform abstractions hiding behavior.
2. **Universal deployment** -- any infrastructure that runs Python containers can host this, from a $5 VPS to a Kubernetes cluster.
3. **Two endpoints cover all UX patterns** -- sync for simple integrations and SSE streaming for real-time chat interfaces.
4. **Auto-generated documentation** -- FastAPI produces OpenAPI/Swagger docs at `/docs`, making it trivial for frontend teams to integrate.
5. **Incremental complexity** -- start with this minimal setup and add middleware for auth, rate limiting, and CORS as requirements grow.

## Key Technical Details

- The agent must be initialized at module level so it is shared across requests, not recreated per call.
- Use `astream` with `stream_mode="messages"` for token-level streaming via SSE.
- The `[DONE]` sentinel follows the OpenAI SSE convention, making the API compatible with many existing chat clients.
- `MemorySaver` works for single-process development; switch to `PostgresSaver` before deploying with multiple workers.
- FastAPI's async support means the server can handle concurrent requests while one is waiting on an LLM response.
- Set `--workers` in uvicorn for multi-process deployment, but note this requires a shared checkpointer backend.
- Add CORS middleware via `fastapi.middleware.cors.CORSMiddleware` for browser-based frontends.

## Common Misconceptions

- **"You need LangServe or LangGraph Cloud to deploy LangGraph agents."** Plain FastAPI works perfectly. LangServe adds convenience but is not required, and LangGraph Cloud is an optional managed service.
- **"The streaming endpoint needs WebSockets."** Server-Sent Events over HTTP are simpler, widely supported, and sufficient for token streaming. WebSockets add unnecessary complexity for unidirectional data flow.
- **"You should create a new agent instance per request."** Agents are stateless executors; state lives in the checkpointer. One agent instance serves all requests, and thread_id isolates conversations.
- **"FastAPI can only handle one request at a time."** FastAPI is async-native. While one request awaits an LLM response, others are processed concurrently on the same event loop.

## Connections to Other Concepts

- `checkpointers.md` -- persistence backend that enables memory across requests
- `thread-based-memory.md` -- how thread_id maps to conversation isolation in the API
- `streaming-tokens.md` -- the underlying streaming mechanics used by the SSE endpoint
- `containerization.md` -- packaging this FastAPI app into a Docker container
- `production-checklist.md` -- essential hardening steps before going live
- `langgraph-platform.md` -- the managed alternative that eliminates the need to build your own FastAPI wrapper
- `cloud-provider-deployment.md` -- deploying this FastAPI app to AWS, GCP, or Azure

## Further Reading

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Server-Sent Events MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [LangGraph Streaming How-To](https://langchain-ai.github.io/langgraph/how-tos/streaming-tokens/)
- [Uvicorn Deployment Guide](https://www.uvicorn.org/deployment/)
