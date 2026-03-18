# Step 1: What We're Building

One-Line Summary: A research agent powered by Claude that can search the web, summarize articles, extract key facts, and compile reports — deployed as a REST API with FastAPI.

Prerequisites: Basic Python knowledge, familiarity with REST APIs, a text editor

---

## The Goal

By the end of this blueprint, you will have a working AI agent that:

- **Searches the web** for information on any topic using a real search API
- **Summarizes articles** and extracts key facts from search results
- **Performs calculations** when your research involves numbers
- **Saves notes** to build up a research report over time
- **Runs as a REST API** you can call from any frontend or script

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

The key insight: **the model decides what to do next**. You define the tools. Claude decides when and how to use them.

## Architecture

```
┌──────────────┐        HTTP         ┌──────────────────┐
│   Client      │◄──────────────────►│  FastAPI Server   │
│  (any app)    │   POST /research   │  (your agent)     │
└──────────────┘                     └────────┬──────────┘
                                              │
                                     ┌────────▼──────────┐
                                     │   Agent Loop       │
                                     │                    │
                                     │  1. Send to Claude │
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
                   │ Web Search   │    │  Calculator   │   │  Save Note   │
                   │ (Brave API)  │    │  (eval-safe)  │   │  (in-memory) │
                   └─────────────┘    └──────────────┘   └──────────────┘
```

## Why This Stack

| Choice | Why |
|--------|-----|
| **Python 3.11+** | The most popular language for AI development. Rich ecosystem. |
| **Anthropic SDK** | Direct API access — no framework magic. You understand every line. |
| **Tool-use pattern** | Claude's native function-calling. Structured, typed, reliable. |
| **FastAPI** | Modern, async, auto-generates OpenAPI docs. Perfect for AI backends. |
| **Docker** | Reproducible deployment. Works everywhere. |

## Project Structure

Here is what we will build:

```
research-agent/
├── agent.py              # Core agent loop
├── tools.py              # Tool definitions and implementations
├── server.py             # FastAPI server
├── config.py             # Configuration and API keys
├── requirements.txt      # Dependencies
├── Dockerfile            # Container deployment
└── .env                  # API keys (not committed)
```

Each step builds one piece. By the end, everything connects.

---

[Next: Step 2 - Project Setup →](02-project-setup.md)
