# Step 5: The Agent Loop

One-Line Summary: Build the core agent loop — the engine that sends messages to Claude, detects tool calls, executes them, and loops until Claude has a final answer.

Prerequisites: Tool definitions from Step 4

---

## The Heart of Every Agent

The agent loop is the pattern that turns a single LLM call into an autonomous agent. Here is the logic:

```
User message
    │
    ▼
Send to Claude (with tools)
    │
    ▼
┌─ Check stop_reason ──────────────┐
│                                   │
│  "end_turn" → Return text to user │
│                                   │
│  "tool_use" → Extract tool call   │
│       │                           │
│       ▼                           │
│  Execute the tool                 │
│       │                           │
│       ▼                           │
│  Append tool result to messages   │
│       │                           │
│       ▼                           │
│  Loop back to "Send to Claude"    │
└───────────────────────────────────┘
```

Claude might call one tool or five tools in sequence. Each tool result gets appended to the conversation, so Claude has full context when deciding what to do next.

## Build the Agent

Create `agent.py`:

```python
# agent.py
# ==========================================
# Core Agent Loop
# ==========================================
# This is the engine of the research agent. It sends messages to Claude,
# detects when Claude wants to use a tool, executes it, and loops
# until Claude produces a final text response.

import anthropic
from config import ANTHROPIC_API_KEY, MODEL, MAX_TOKENS
from tools import TOOLS, execute_tool

# ------------------------------------------
# System prompt — defines the agent's role
# ------------------------------------------

SYSTEM_PROMPT = """You are a research agent. Your job is to help users investigate topics
by searching the web, analyzing information, and compiling research reports.

Your capabilities:
- web_search: Find current information on any topic
- calculator: Perform mathematical calculations
- save_note: Record important findings for the final report

Your approach:
1. Break the user's request into specific research questions
2. Search for information relevant to each question
3. Use the calculator for any numerical analysis
4. Save key findings as notes
5. Compile everything into a clear, structured response

Guidelines:
- Always search before answering questions about current events or data
- Cite your sources with URLs when presenting facts
- Use save_note to record critical findings as you go
- Be thorough but concise"""

# ------------------------------------------
# Initialize the Anthropic client
# ------------------------------------------

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# ------------------------------------------
# Maximum iterations to prevent infinite loops
# ------------------------------------------

MAX_ITERATIONS = 15


def run_agent(user_message: str, conversation_history: list | None = None) -> str:
    """
    Run the agent loop for a single user message.

    Args:
        user_message: The user's input
        conversation_history: Optional existing conversation for multi-turn

    Returns:
        The agent's final text response
    """
    # Start with existing history or a fresh conversation
    messages = conversation_history or []

    # Add the new user message
    messages.append({"role": "user", "content": user_message})

    iterations = 0

    while iterations < MAX_ITERATIONS:
        iterations += 1

        # -------------------------------------------
        # Step 1: Send the conversation to Claude
        # -------------------------------------------
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages,
        )

        # -------------------------------------------
        # Step 2: Check if Claude is done or wants tools
        # -------------------------------------------
        if response.stop_reason == "end_turn":
            # Claude is done — extract the final text
            assistant_text = ""
            for block in response.content:
                if block.type == "text":
                    assistant_text += block.text

            # Append assistant response to history
            messages.append({"role": "assistant", "content": response.content})
            return assistant_text

        # -------------------------------------------
        # Step 3: Claude wants to use tools
        # -------------------------------------------
        if response.stop_reason == "tool_use":
            # Append Claude's response (contains tool_use blocks)
            messages.append({"role": "assistant", "content": response.content})

            # Process each tool call in the response
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    tool_name = block.name
                    tool_input = block.input
                    tool_use_id = block.id

                    print(f"  [Tool] {tool_name}({tool_input})")

                    # Execute the tool
                    result = execute_tool(tool_name, tool_input)

                    print(f"  [Result] {result[:200]}...")

                    # Collect the result
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": tool_use_id,
                        "content": result,
                    })

            # Append all tool results as a single user message
            messages.append({"role": "user", "content": tool_results})

    # Safety net — agent hit max iterations
    return "I reached the maximum number of research steps. Here is what I found so far based on the conversation above."


# ------------------------------------------
# Quick test — run the agent from the CLI
# ------------------------------------------

if __name__ == "__main__":
    print("Research Agent (type 'quit' to exit)")
    print("-" * 40)

    history = []

    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() in ("quit", "exit", "q"):
            break

        result = run_agent(user_input, history)
        print(f"\nAgent: {result}")
```

## Try It Out

```bash
python agent.py
```

Try these prompts:

- `"What is the square root of 1764?"` — Claude will use the calculator
- `"Save a note titled 'Test' with content 'Agent loop is working'"` — uses save_note
- `"Search for recent AI news"` — uses web_search (placeholder for now)

Watch the `[Tool]` and `[Result]` lines in your terminal. You can see exactly what Claude decides to do and what comes back.

## Why This Pattern Works

- **Claude controls the flow.** You do not hard-code when to search or calculate. Claude reads the user's request and picks the right tools.
- **Tool results become context.** Each tool result is appended to the conversation, so Claude can reason about what it learned.
- **Multiple tools per turn.** Claude can call several tools before giving a final answer.
- **The loop is bounded.** `MAX_ITERATIONS` prevents runaway loops that burn through your API credits.

---

[← Define Tools](04-define-tools.md) | [Next: Step 6 - Web Search Tool →](06-web-search-tool.md)
