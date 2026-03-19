# Step 6: Web Search

One-Line Summary: Add Google Search to your agent using ADK's built-in tool — no extra API keys, no setup, just one import.

Prerequisites: Agent with Runner from Step 5

---

## The Easiest Tool You Will Ever Add

Most agent frameworks require you to sign up for a search API, get an API key, write HTTP request code, and parse the response. ADK ships with Google Search as a built-in tool. Adding it is one line:

```python
from google.adk.tools import google_search
```

That is it. No API key. No HTTP client. No response parsing. ADK handles everything.

## Update Your Agent

Update `research_agent/agent.py` to include Google Search alongside your custom tools:

```python
# research_agent/agent.py
# ==========================================
# Research agent with web search
# ==========================================

from google.adk.agents import Agent
from google.adk.tools import google_search
from .tools import calculator, save_note, get_notes

root_agent = Agent(
    name="research_agent",
    model="gemini-2.5-flash",
    description="A research assistant that searches the web, analyzes data, and compiles reports.",
    instruction="""You are a research agent. Your job is to help users investigate topics
by searching the web, analyzing information, and compiling research reports.

Your tools:
- google_search: Search the web for current information on any topic
- calculator: Perform mathematical calculations
- save_note: Record important findings during research
- get_notes: Review all saved notes

Your approach:
1. Break the user's request into specific research questions
2. Search for information relevant to each question
3. Use the calculator for any numerical analysis
4. Save key findings as notes with save_note
5. Compile everything into a clear, structured response

Guidelines:
- Always search before answering questions about current events or data
- Cite your sources with URLs when presenting facts
- Use save_note to record critical findings as you go
- Be thorough but concise — quality over quantity
- If search results are insufficient, say so honestly""",
    tools=[google_search, calculator, save_note, get_notes],
)
```

## Test It

```bash
adk web
```

Now try prompts that require live information:

- `"Search for the latest news about AI agents and summarize the top 3 results"`
- `"What is the current population of Tokyo? Save the answer as a note."`
- `"Search for AI adoption statistics, calculate the year-over-year growth, and save the key findings"`

Watch the web UI — you will see Google Search tool calls with real results flowing through, followed by calculator and save_note calls as Gemini processes the information.

## How Google Search Works in ADK

Under the hood, ADK uses Gemini's **grounding** capability. When Gemini decides to search, it:

1. Formulates a search query from the conversation context
2. Calls Google Search internally
3. Receives search results with titles, URLs, and snippets
4. Uses the results to generate a grounded response

The search results are integrated directly into Gemini's reasoning — you do not need to parse or format them yourself.

## Other Built-In Tools

ADK includes several built-in tools beyond Google Search:

| Tool | What It Does |
|------|-------------|
| `google_search` | Search the web for current information |
| `code_execution` | Run Python code in a sandboxed environment |

You can mix built-in tools with your custom functions in any combination:

```python
from google.adk.tools import google_search, code_execution

root_agent = Agent(
    name="research_agent",
    model="gemini-2.5-flash",
    tools=[
        google_search,       # Built-in: web search
        code_execution,      # Built-in: run Python code
        calculator,          # Custom: math calculations
        save_note,           # Custom: save findings
        get_notes,           # Custom: retrieve findings
    ],
    # ...
)
```

## Full Research Test

Run the conversation script from Step 5 and try a complex research query:

```bash
python run_conversation.py
```

```
You: Research the top 3 programming languages by popularity in 2025,
     calculate the percentage difference between #1 and #3,
     and save a summary note with your findings.
```

Watch the agent chain together multiple tools: search → analyze → calculate → save. This is the core value of an agent — autonomous multi-step reasoning.

## Key Takeaways

- **`google_search`** is a one-import, zero-config built-in tool in ADK
- **No API key needed** — it uses Gemini's grounding capability
- **Combine built-in and custom tools** freely in the same agent
- **Gemini decides when to search** — your instructions guide it, but the model chooses

---

**Reference:** [ADK Built-in Tools](https://google.github.io/adk-docs/tools/) · [Gemini Grounding](https://ai.google.dev/gemini-api/docs/grounding)

[← The Agent Loop](05-the-agent-loop.md) | [Next: Step 7 - Sessions and Memory →](07-sessions-and-memory.md)
