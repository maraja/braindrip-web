# Step 3: Build the Agent Class

One-Line Summary: Create a reusable Agent class that wraps the Anthropic SDK with a system prompt, optional tools, and a clean `run()` interface.

Prerequisites: Step 2 completed, virtual environment active

---

## What Is an Agent?

An agent is just an LLM call with structure. At its core, an agent has:

- **A system prompt** — defines who the agent is and how it behaves
- **Tools** — functions the agent can call to interact with the world
- **A run method** — takes input, calls Claude, handles tool use, returns output

That is it. No framework magic. We will build this in about 60 lines of Python.

## The Agent Class

```python
# agent.py — A reusable agent built on the Anthropic SDK

import json
from anthropic import Anthropic
from config import ANTHROPIC_API_KEY, MODEL


client = Anthropic(api_key=ANTHROPIC_API_KEY)


class Agent:
    """
    A simple agent that wraps Claude with a system prompt and tools.
    """

    def __init__(self, name, system_prompt, tools=None, tool_functions=None):
        """
        Args:
            name: Display name for logging
            system_prompt: The system prompt that defines the agent's behavior
            tools: List of tool definitions (Anthropic tool format)
            tool_functions: Dict mapping tool names to callable functions
        """
        self.name = name
        self.system_prompt = system_prompt
        self.tools = tools or []
        self.tool_functions = tool_functions or {}

    def run(self, user_message, max_iterations=10):
        """
        Run the agent on a user message.
        Handles tool calls in a loop until the agent produces a final text response.
        """
        print(f"\n{'='*60}")
        print(f"Agent: {self.name}")
        print(f"{'='*60}")

        messages = [{"role": "user", "content": user_message}]

        for i in range(max_iterations):
            # Call Claude
            response = client.messages.create(
                model=MODEL,
                max_tokens=4096,
                system=self.system_prompt,
                tools=self.tools if self.tools else [],
                messages=messages,
            )

            # Check if we are done (no more tool calls)
            if response.stop_reason == "end_turn":
                # Extract the final text response
                text_parts = [
                    block.text
                    for block in response.content
                    if block.type == "text"
                ]
                result = "\n".join(text_parts)
                print(f"  [{self.name}] Done.")
                return result

            # Handle tool use
            if response.stop_reason == "tool_use":
                # Add assistant's response to messages
                messages.append({
                    "role": "assistant",
                    "content": response.content,
                })

                # Process each tool call
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        tool_name = block.name
                        tool_input = block.input
                        print(f"  [{self.name}] Using tool: {tool_name}")

                        # Execute the tool function
                        if tool_name in self.tool_functions:
                            result = self.tool_functions[tool_name](**tool_input)
                        else:
                            result = f"Error: Unknown tool '{tool_name}'"

                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": str(result),
                        })

                # Add tool results to messages
                messages.append({
                    "role": "user",
                    "content": tool_results,
                })

        # If we hit max iterations, return whatever we have
        print(f"  [{self.name}] Max iterations reached.")
        return "Agent reached maximum iterations without completing."
```

## How It Works

The core loop is simple:

1. Send the message to Claude with the system prompt and available tools
2. If Claude responds with text (`stop_reason == "end_turn"`), we are done — return the text
3. If Claude wants to use a tool (`stop_reason == "tool_use"`), execute the tool and send the result back
4. Repeat until Claude gives a final text response

This is the **agentic loop** — the same pattern used by every agent framework. The difference is we are writing it ourselves in 60 lines instead of importing it from a library.

## Test the Agent

Create a quick test:

```python
# test_agent.py — Verify the Agent class works

from agent import Agent

# Create a simple agent with no tools
assistant = Agent(
    name="Test Assistant",
    system_prompt=(
        "You are a helpful assistant. Be concise and direct. "
        "Answer in 2-3 sentences maximum."
    ),
)

# Run it
result = assistant.run("What is a multi-agent system?")
print(f"\nResult:\n{result}")
```

```bash
python test_agent.py
```

You should see the agent name, then a concise answer from Claude. Clean up:

```bash
rm test_agent.py
```

## Key Design Decisions

| Decision | Why |
|----------|-----|
| **No framework** | You see every line of the agent loop. Nothing is hidden. |
| **Tools as plain functions** | Any Python function can be a tool. No decorators, no special classes. |
| **Iteration limit** | Prevents runaway tool loops. 10 iterations is generous for most tasks. |
| **Logging built in** | The agent prints what it is doing so you can follow the execution. |

This Agent class is the foundation for everything we build next. The Researcher, Writer, and Editor are all instances of this class with different system prompts and tools.

---

[← Project Setup](02-project-setup.md) | [Next: Step 4 - Adding Tools →](04-adding-tools.md)
