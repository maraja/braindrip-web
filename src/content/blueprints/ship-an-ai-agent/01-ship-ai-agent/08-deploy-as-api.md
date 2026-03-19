# Step 8: Deploy as API

One-Line Summary: Wrap your research agent in a FastAPI server with streaming support so any application can use it.

Prerequisites: Complete agent with memory from Step 7

---

## Why FastAPI

FastAPI gives you a production-ready REST API with automatic OpenAPI documentation, request validation, and async support — all things you need for an AI agent backend.

## Build the Server

Create `server.py`:

```python
# server.py
# ==========================================
# FastAPI Server for the Research Agent
# ==========================================
# Exposes the agent as a REST API with session support
# and streaming responses.

import uuid
import json
import anthropic
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from config import ANTHROPIC_API_KEY, MODEL, MAX_TOKENS
from tools import TOOLS, execute_tool, saved_notes
from memory import store, trim_conversation

# ------------------------------------------
# FastAPI app setup
# ------------------------------------------

app = FastAPI(
    title="Research Agent API",
    description="An AI research agent powered by Claude",
    version="1.0.0",
)

# ------------------------------------------
# Request/Response models
# ------------------------------------------

class ResearchRequest(BaseModel):
    """Input for a research query."""
    query: str
    session_id: str | None = None

class ResearchResponse(BaseModel):
    """Output from a research query."""
    response: str
    session_id: str
    tools_used: list[str]
    notes_count: int

# ------------------------------------------
# System prompt
# ------------------------------------------

SYSTEM_PROMPT = """You are a research agent. Your job is to help users investigate topics
by searching the web, analyzing information, and compiling research reports.

Your capabilities:
- web_search: Find current information on any topic
- calculator: Perform mathematical calculations
- save_note: Record important findings for the final report

Always search before answering questions about current events or data.
Cite your sources. Be thorough but concise."""

# ------------------------------------------
# Anthropic client
# ------------------------------------------

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
MAX_ITERATIONS = 15

# ------------------------------------------
# Agent loop (server version)
# ------------------------------------------

def run_agent_for_api(query: str, session_id: str) -> dict:
    """Run the agent and return structured results."""
    session = store.get_or_create(session_id)
    session.add_user_message(query)
    working_messages = trim_conversation(session.messages)

    tools_used = []
    iterations = 0

    while iterations < MAX_ITERATIONS:
        iterations += 1

        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=working_messages,
        )

        if response.stop_reason == "end_turn":
            text = "".join(
                block.text for block in response.content if block.type == "text"
            )
            session.add_assistant_message(response.content)

            return {
                "response": text,
                "session_id": session_id,
                "tools_used": tools_used,
                "notes_count": len(saved_notes),
            }

        if response.stop_reason == "tool_use":
            working_messages.append({"role": "assistant", "content": response.content})
            session.add_assistant_message(response.content)

            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    tools_used.append(block.name)
                    result = execute_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            working_messages.append({"role": "user", "content": tool_results})
            session.add_tool_results(tool_results)

    return {
        "response": "Reached maximum iterations.",
        "session_id": session_id,
        "tools_used": tools_used,
        "notes_count": len(saved_notes),
    }

# ------------------------------------------
# API Routes
# ------------------------------------------

@app.post("/research", response_model=ResearchResponse)
async def research(request: ResearchRequest):
    """Run a research query. Optionally pass a session_id for multi-turn."""
    session_id = request.session_id or str(uuid.uuid4())

    try:
        result = run_agent_for_api(request.query, session_id)
        return ResearchResponse(**result)
    except anthropic.APIError as e:
        raise HTTPException(status_code=502, detail=f"Claude API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/research/stream")
async def research_stream(request: ResearchRequest):
    """Stream a research query — returns Server-Sent Events."""
    session_id = request.session_id or str(uuid.uuid4())
    session = store.get_or_create(session_id)
    session.add_user_message(request.query)

    async def event_stream():
        working_messages = trim_conversation(session.messages)
        iterations = 0

        while iterations < MAX_ITERATIONS:
            iterations += 1

            # Use streaming for the Claude call
            with client.messages.stream(
                model=MODEL,
                max_tokens=MAX_TOKENS,
                system=SYSTEM_PROMPT,
                tools=TOOLS,
                messages=working_messages,
            ) as stream:
                response = stream.get_final_message()

            if response.stop_reason == "end_turn":
                text = "".join(
                    block.text for block in response.content if block.type == "text"
                )
                session.add_assistant_message(response.content)

                # Send final response as SSE
                yield f"data: {json.dumps({'type': 'response', 'content': text, 'session_id': session_id})}\n\n"
                yield "data: [DONE]\n\n"
                return

            if response.stop_reason == "tool_use":
                working_messages.append({"role": "assistant", "content": response.content})
                session.add_assistant_message(response.content)

                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        # Notify client about tool usage
                        yield f"data: {json.dumps({'type': 'tool_call', 'tool': block.name, 'input': block.input})}\n\n"

                        result = execute_tool(block.name, block.input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result,
                        })

                working_messages.append({"role": "user", "content": tool_results})
                session.add_tool_results(tool_results)

        yield f"data: {json.dumps({'type': 'error', 'content': 'Max iterations reached'})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.get("/sessions/{session_id}/notes")
async def get_notes(session_id: str):
    """Get all saved notes for a session."""
    return {"session_id": session_id, "notes": saved_notes}


@app.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a session and its history."""
    store.delete(session_id)
    return {"status": "deleted", "session_id": session_id}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}
```

## Run Locally

```bash
# Start the server
uvicorn server:app --reload --port 8000
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) for the auto-generated Swagger UI. Test it:

```bash
# Send a research query
curl -X POST http://localhost:8000/research \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the top 3 AI trends right now?"}'
```

Your agent is now running as a REST API, ready to connect to any frontend or deploy to any cloud provider.

---

[← Memory and Context](07-memory-and-context.md) | [Next: Step 9 - What's Next →](09-whats-next.md)
