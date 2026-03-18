# Step 3: Basic Claude Call

One-Line Summary: Make your first Claude API call, understand the message format, and set up a system prompt for your research agent.

Prerequisites: Working setup from Step 2

---

## The Messages API

Every interaction with Claude goes through the Messages API. You send a list of messages (a conversation), and Claude responds. The structure is simple:

```python
# basic_call.py
# ==========================================
# Your first Claude API call
# ==========================================

import anthropic
from config import ANTHROPIC_API_KEY, MODEL, MAX_TOKENS

# Initialize the Anthropic client
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# Send a message to Claude
response = client.messages.create(
    model=MODEL,
    max_tokens=MAX_TOKENS,
    messages=[
        {"role": "user", "content": "What are the three biggest trends in AI right now?"}
    ],
)

# The response contains a list of content blocks
# For a simple text response, there is one block of type "text"
print(response.content[0].text)
```

## Understanding the Response

The `response` object contains several useful fields:

```python
# Inspect the response structure
print(f"Model: {response.model}")
print(f"Stop reason: {response.stop_reason}")  # "end_turn" or "tool_use"
print(f"Input tokens: {response.usage.input_tokens}")
print(f"Output tokens: {response.usage.output_tokens}")

# Content is a list of blocks — text blocks and tool-use blocks
for block in response.content:
    print(f"Block type: {block.type}")
    if block.type == "text":
        print(f"Text: {block.text[:100]}...")
```

The `stop_reason` field is critical for agents. When Claude wants to use a tool, `stop_reason` will be `"tool_use"` instead of `"end_turn"`. This is how you know to enter the agent loop.

## Adding a System Prompt

A system prompt shapes Claude's behavior for every message in the conversation. For our research agent, this is where we define its personality and capabilities:

```python
# agent_prompt.py
# ==========================================
# System prompt for the research agent
# ==========================================

SYSTEM_PROMPT = """You are a research agent. Your job is to help users investigate topics
by searching the web, analyzing information, and compiling research reports.

Your capabilities:
- Search the web for current information
- Perform calculations on data you find
- Save important notes and findings as you research

Your approach:
1. Break the user's request into specific research questions
2. Search for information relevant to each question
3. Analyze and cross-reference what you find
4. Compile your findings into a clear, structured response

Guidelines:
- Always cite your sources when presenting facts
- If search results are insufficient, say so honestly
- Use the calculator for any numerical analysis
- Save key findings as notes so you can reference them later
- Be thorough but concise — quality over quantity"""
```

## Putting It Together

Here is a complete call with the system prompt:

```python
# research_call.py
# ==========================================
# Claude call with system prompt
# ==========================================

import anthropic
from config import ANTHROPIC_API_KEY, MODEL, MAX_TOKENS

SYSTEM_PROMPT = """You are a research agent. Your job is to help users investigate topics
by searching the web, analyzing information, and compiling research reports.
Always be thorough, cite sources, and structure your responses clearly."""

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

response = client.messages.create(
    model=MODEL,
    max_tokens=MAX_TOKENS,
    system=SYSTEM_PROMPT,
    messages=[
        {"role": "user", "content": "What should I know about building AI agents?"}
    ],
)

print(response.content[0].text)

# Check how Claude wants to respond
# "end_turn" = normal text response
# "tool_use" = Claude wants to call a tool (we will add this next)
print(f"\nStop reason: {response.stop_reason}")
```

Run this and you will get a detailed text response. But notice that Claude cannot actually search the web yet — it is working from its training data. In the next steps, we give Claude tools so it can take real actions.

## Key Takeaways

- **Messages** are a list of `{"role": "user" | "assistant", "content": ...}` objects
- **System prompts** set behavior for the entire conversation — use them to define your agent's role
- **`stop_reason`** tells you if Claude finished talking (`"end_turn"`) or wants to use a tool (`"tool_use"`)
- **Content blocks** can be text or tool-use requests — agents rely on both

---

[← Project Setup](02-project-setup.md) | [Next: Step 4 - Define Tools →](04-define-tools.md)
