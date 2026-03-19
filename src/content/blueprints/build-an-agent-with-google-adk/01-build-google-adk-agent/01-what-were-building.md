# Step 1: What We're Building

One-Line Summary: A research agent powered by Google's Agent Development Kit (ADK) and Gemini that can search the web, perform calculations, save notes, and deploy to Cloud Run with a single command.

Prerequisites: Basic Python knowledge, a Google account, a text editor

---

## The Goal

By the end of this blueprint, you will have a working AI agent that:

- **Searches the web** for information using Google Search (built into ADK)
- **Performs calculations** when your research involves numbers
- **Saves notes** to build up a research report over time
- **Remembers context** across multi-turn conversations with session management
- **Deploys to Cloud Run** with a single CLI command

You will send requests like:

> "Research the latest developments in quantum computing and compile a summary"

> "Search for statistics on global AI adoption rates and calculate the year-over-year growth"

> "Find three recent articles about climate tech startups and save the key takeaways"

...and your agent will autonomously decide which tools to use, call them in sequence, and return a polished response.

## What Is an AI Agent?

A regular LLM call is **one turn**: you send a prompt, you get a response. An agent is a **loop**. The model can:

1. Receive your message
2. Decide it needs to take an action (call a tool)
3. See the result of that action
4. Decide to take another action — or respond to the user

The key insight: **the model decides what to do next**. You define the tools. Gemini decides when and how to use them.

## What Is Google ADK?

Google's [Agent Development Kit](https://google.github.io/adk-docs/) is an open-source, code-first Python framework for building AI agents. It is designed to make agent development feel like regular software development:

- **Code-first** — define agents, tools, and orchestration in plain Python
- **Built-in tools** — Google Search, code execution, and more are included out of the box
- **Session management** — track conversations and state without building it yourself
- **One-command deploy** — ship to Cloud Run or Vertex AI with `adk deploy`

ADK is optimized for Gemini but is model-agnostic — you can swap in other LLMs if needed.

## Architecture

```
┌──────────────┐       adk web       ┌──────────────────┐
│   Browser     │◄───────────────────►│  ADK Dev Server   │
│  (test UI)    │   localhost:8000    │  (your agent)     │
└──────────────┘                     └────────┬──────────┘
                                              │
                                     ┌────────▼──────────┐
                                     │   Runner + Agent    │
                                     │                    │
                                     │  1. Send to Gemini │
                                     │  2. Tool call?     │
                                     │     → Execute it   │
                                     │     → Loop back    │
                                     │  3. Text response? │
                                     │     → Return it    │
                                     └────────┬──────────┘
                                              │
                          ┌───────────────────┼───────────────────┐
                          │                   │                   │
                   ┌──────▼──────┐    ┌───────▼──────┐   ┌───────▼──────┐
                   │ Google Search│    │  Calculator   │   │  Save Note   │
                   │ (built-in)  │    │  (custom fn)  │   │  (custom fn) │
                   └─────────────┘    └──────────────┘   └──────────────┘
```

## Why This Stack

| Choice | Why |
|--------|-----|
| **Python 3.12+** | Recommended by ADK. The most popular language for AI development. |
| **Google ADK** | Code-first agent framework with built-in tools, sessions, and deployment. |
| **Gemini** | Google's frontier model — fast, capable, and integrated with ADK out of the box. |
| **Cloud Run** | Serverless containers. Scales to zero. One-command deploy from ADK. |
| **Google Search** | Built into ADK — no extra API key needed for web search. |

## Project Structure

Here is what we will build:

```
research-agent/
├── research_agent/       # Agent package
│   ├── __init__.py       # Package init — exports the agent
│   ├── agent.py          # Agent definition and tools
│   └── tools.py          # Custom tool functions
├── .env                  # API key (not committed)
└── requirements.txt      # Dependencies
```

ADK expects your agent to live in a Python package (a directory with `__init__.py`). Each step builds one piece. By the end, everything connects.

---

**Reference:** [Google ADK Documentation](https://google.github.io/adk-docs/) · [ADK GitHub Repository](https://github.com/google/adk-python)

[Next: Step 2 - Project Setup →](02-project-setup.md)
