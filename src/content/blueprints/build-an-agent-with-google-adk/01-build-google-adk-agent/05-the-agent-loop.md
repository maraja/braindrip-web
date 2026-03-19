# Step 5: The Agent Loop

One-Line Summary: Understand the Runner, Events, and the execution loop that powers your agent — then build a Python script that runs multi-turn conversations.

Prerequisites: Agent with custom tools from Step 4

---

## How ADK Runs Your Agent

In the previous blueprint ("Ship an AI Agent with Claude"), you built the agent loop by hand — checking `stop_reason`, executing tools, appending results, and looping. With ADK, the **Runner** handles all of that for you.

The `Runner` is the engine that:

1. Takes a user message
2. Sends it to Gemini along with your tool definitions
3. Receives the response
4. If Gemini wants to call a tool → executes it and loops back
5. If Gemini produces a final text response → returns it

You never write the loop. You define the agent and tools. The Runner orchestrates everything.

## The Runner in Detail

```python
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService

# The Runner needs two things:
# 1. Your agent (with its tools)
# 2. A session service (to store conversation state)

session_service = InMemorySessionService()

runner = Runner(
    agent=root_agent,         # Your agent definition
    app_name="research_app",  # Application identifier
    session_service=session_service,  # Where to store sessions
)
```

| Component | What It Does |
|-----------|-------------|
| `Runner` | Orchestrates the agent loop — message → model → tool → loop |
| `InMemorySessionService` | Stores conversation history and state in memory |
| `app_name` | Groups sessions under one application |

## Events: The Agent's Stream of Consciousness

When you call `runner.run_async()`, you get back a stream of **Events**. Each event represents something that happened during the agent's execution:

```
Event: tool_call (calculator, expression="sqrt(1764)")
Event: tool_result (result=42)
Event: tool_call (save_note, title="Square Root", content="√1764 = 42")
Event: tool_result (status="saved")
Event: final_response ("The square root of 1764 is 42. I've saved this as a note.")
```

You iterate over events and check `event.is_final_response()` to find the agent's answer.

## Build a Multi-Turn CLI

Create a script that runs multi-turn conversations — each message builds on the last:

```python
# run_conversation.py
# ==========================================
# Multi-turn conversation with the research agent
# ==========================================

import asyncio
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from research_agent.agent import root_agent

APP_NAME = "research_app"
USER_ID = "user_1"
SESSION_ID = "session_1"


async def send_message(runner: Runner, text: str) -> str:
    """Send a message to the agent and return the final response."""
    message = types.Content(
        role="user",
        parts=[types.Part(text=text)],
    )

    final_text = ""
    events = runner.run_async(
        user_id=USER_ID,
        session_id=SESSION_ID,
        new_message=message,
    )

    async for event in events:
        # Print tool calls so you can see the agent's reasoning
        if event.actions and event.actions.tool_code_execution_result:
            print(f"  [Tool Result] {event.actions.tool_code_execution_result}")

        if event.is_final_response():
            final_text = event.content.parts[0].text

    return final_text


async def main():
    # Set up session and runner
    session_service = InMemorySessionService()
    await session_service.create_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        session_id=SESSION_ID,
    )

    runner = Runner(
        agent=root_agent,
        app_name=APP_NAME,
        session_service=session_service,
    )

    print("Research Agent (type 'quit' to exit)")
    print("-" * 40)

    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() in ("quit", "exit", "q"):
            break

        response = await send_message(runner, user_input)
        print(f"\nAgent: {response}")


asyncio.run(main())
```

## Test Multi-Turn Memory

```bash
python run_conversation.py
```

Try a multi-turn session:

1. `"Calculate 15% of 8500"` — Gemini uses the calculator
2. `"Save that result as a note titled 'Budget Calculation'"` — uses save_note
3. `"What notes have I saved?"` — uses get_notes, and remembers the previous context

The Runner maintains conversation history through the session service, so each message has full context of what came before.

## Why the Runner Pattern Matters

Compared to building the loop by hand (as in the Claude blueprint):

| Manual Loop (Claude) | ADK Runner |
|----------------------|------------|
| You write the while loop | Runner handles it |
| You check `stop_reason` | Runner checks automatically |
| You serialize tool results | Runner serializes for you |
| You manage message history | Session service handles it |
| You cap iterations manually | Runner has built-in limits |

The benefit: you focus on **what your agent does** (tools and instructions), not **how it executes** (the loop mechanics).

## Key Takeaways

- **`Runner`** is the execution engine — it manages the tool-call loop automatically
- **Events** are the stream of actions the agent takes during execution
- **`is_final_response()`** tells you when the agent has finished and produced an answer
- **Session service** maintains conversation history across turns
- **You never write the loop** — define the agent and tools, let the Runner orchestrate

---

**Reference:** [ADK Runner](https://google.github.io/adk-docs/runtime/runner/) · [ADK Events](https://google.github.io/adk-docs/runtime/events/)

[← Add Custom Tools](04-add-custom-tools.md) | [Next: Step 6 - Web Search →](06-web-search.md)
