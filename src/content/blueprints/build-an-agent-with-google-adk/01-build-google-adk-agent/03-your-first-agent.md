# Step 3: Your First Agent

One-Line Summary: Define a minimal ADK agent with Gemini, run it with the built-in CLI and web UI, and understand the core Agent class.

Prerequisites: Working setup from Step 2

---

## The Agent Class

Every ADK agent starts with the `Agent` class. You give it a name, a model, instructions, and optionally a set of tools:

```python
# research_agent/agent.py
# ==========================================
# Your first ADK agent — a simple assistant
# ==========================================

from google.adk.agents import Agent

root_agent = Agent(
    name="research_agent",
    model="gemini-2.5-flash",
    description="A research assistant that helps investigate topics.",
    instruction="""You are a research assistant. Help users investigate topics
by providing clear, well-structured answers. Be thorough but concise.
Always cite your reasoning.""",
)
```

That is a complete ADK agent. Four lines of configuration:

| Parameter | What It Does |
|-----------|-------------|
| `name` | Unique identifier for this agent |
| `model` | Which LLM to use — `gemini-2.5-flash` is fast and capable |
| `description` | Short summary used by parent agents in multi-agent setups |
| `instruction` | The system prompt — defines the agent's personality and behavior |

> **Important:** The variable must be named `root_agent`. ADK looks for this specific name when loading your agent package.

## Run It with the CLI

ADK includes a built-in command-line interface for testing:

```bash
# Run your agent in the terminal
adk run research_agent
```

You will see an interactive prompt. Try asking a question:

```
You: What are the three biggest trends in AI right now?
```

Gemini will respond with its knowledge. But notice it cannot search the web yet — it is working from training data only. We will fix that in the next steps.

Type `exit` to quit.

## Run It with the Web UI

ADK also includes a browser-based testing interface:

```bash
# Start the web UI
adk web
```

Open [http://localhost:8000](http://localhost:8000) in your browser. You will see a chat interface where you can:

- Select your agent from the dropdown
- Send messages and see responses
- View tool calls and their results in real time
- Inspect the conversation history

This is great for development — you can see exactly what your agent is doing at each step.

> **Note:** The ADK web UI is for development and testing only, not production deployment.

## Understanding the Agent Loop

When you send a message, here is what happens inside ADK:

```
Your message
    │
    ▼
Runner sends message + tools to Gemini
    │
    ▼
┌─ Gemini responds ────────────────────┐
│                                       │
│  Text response → Return to user       │
│                                       │
│  Tool call → Runner executes tool     │
│       │                               │
│       ▼                               │
│  Tool result sent back to Gemini      │
│       │                               │
│       ▼                               │
│  Loop back to "Gemini responds"       │
└───────────────────────────────────────┘
```

The `Runner` class handles this loop automatically. You do not need to write it yourself — ADK manages the orchestration. You just define the agent and its tools.

## Running Programmatically

You can also run your agent from a Python script, which is useful for testing and integration:

```python
# run_agent.py
# ==========================================
# Run the agent from a Python script
# ==========================================

import asyncio
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from research_agent.agent import root_agent

APP_NAME = "research_app"
USER_ID = "test_user"
SESSION_ID = "test_session"

async def main():
    # Create a session service and session
    session_service = InMemorySessionService()
    session = await session_service.create_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        session_id=SESSION_ID,
    )

    # Create the runner
    runner = Runner(
        agent=root_agent,
        app_name=APP_NAME,
        session_service=session_service,
    )

    # Send a message
    message = types.Content(
        role="user",
        parts=[types.Part(text="What should I know about building AI agents?")],
    )

    # Run and collect the response
    events = runner.run_async(
        user_id=USER_ID,
        session_id=SESSION_ID,
        new_message=message,
    )

    async for event in events:
        if event.is_final_response():
            print("Agent:", event.content.parts[0].text)

asyncio.run(main())
```

Run it:

```bash
python run_agent.py
```

## Key Takeaways

- **`Agent`** is the core class — you give it a model, instructions, and tools
- **`root_agent`** is the required variable name ADK looks for in your package
- **`adk run`** and **`adk web`** let you test interactively without writing any server code
- **`Runner`** manages the agent loop — sending messages, executing tools, and looping back
- **`InMemorySessionService`** stores conversation state in memory for development

---

**Reference:** [ADK Agent Class](https://google.github.io/adk-docs/agents/) · [ADK Runner](https://google.github.io/adk-docs/runtime/runner/)

[← Project Setup](02-project-setup.md) | [Next: Step 4 - Add Custom Tools →](04-add-custom-tools.md)
