# Step 1: What We're Building

One-Line Summary: A multi-agent content production pipeline where three AI agents — Researcher, Writer, and Editor — collaborate to produce polished articles, built from scratch with the Anthropic SDK.

Prerequisites: Basic Python knowledge, familiarity with LLMs and API concepts, a text editor

---

## The Goal

By the end of this blueprint, you will have a working multi-agent system that:

- **Accepts a topic** and produces a well-researched, well-written article
- **Uses three specialized agents** that collaborate in sequence
- **Leverages Claude** directly through the Anthropic SDK
- **Outputs polished Markdown** files ready for publishing
- **Runs locally** from the command line

You will run a single command like:

```bash
python main.py "The Future of Quantum Computing"
```

...and get back a thoroughly researched, clearly written, and carefully edited article saved as a Markdown file.

## What Is a Multi-Agent System?

A single LLM call is like asking one person to do everything — research, write, and edit. It works, but the quality suffers. A multi-agent system splits the work across specialized agents, each with a focused role.

Think of it like a newsroom:

- The **Researcher** digs into sources and gathers facts
- The **Writer** turns raw research into a compelling draft
- The **Editor** polishes the prose, checks consistency, and produces the final piece

Each agent has its own system prompt, tools, and responsibilities. They pass their output to the next agent in the chain.

## Architecture

```
┌─────────────┐     research      ┌─────────────┐     draft       ┌─────────────┐
│  Researcher  │─────────────────►│    Writer    │───────────────►│    Editor    │
│              │                  │              │                │              │
│  Role: Find  │                  │  Role: Draft │                │  Role: Polish│
│  & summarize │                  │  content     │                │  & refine    │
│  information │                  │  from notes  │                │  the article │
│              │                  │              │                │              │
│  Tools:      │                  │  Tools:      │                │  Tools:      │
│  - web_search│                  │  (none)      │                │  - save_file │
└─────────────┘                  └─────────────┘                └──────┬───────┘
                                                                       │
                                                                       ▼
                                                                 ┌──────────┐
                                                                 │ article  │
                                                                 │   .md    │
                                                                 └──────────┘
```

## Why This Stack

| Choice | Why |
|--------|-----|
| **Anthropic SDK** | Call Claude directly — no framework wrappers, no middleware. You control every prompt, every tool call, every response. |
| **Plain Python classes** | Agents are simple classes with a `run()` method. No framework to learn, nothing hidden behind abstractions. |
| **DuckDuckGo search** | Free web search with no API key required. One `pip install` and it works. |
| **Python 3.11+** | Standard language for AI tooling. Better error messages and performance. |

Notice what is **not** in this stack: no CrewAI, no LangChain, no LangGraph, no LiteLLM. We build the multi-agent pattern from scratch so you understand exactly how agents work. Once you understand the pattern, you can use any framework — or none at all.

## Project Structure

```
content-crew/
├── main.py              # Entry point — accepts a topic and runs the pipeline
├── agent.py             # The base Agent class
├── agents.py            # Defines the three specialized agents
├── tools.py             # Tool functions (web search, save to file)
├── config.py            # Configuration and API keys
├── requirements.txt
├── .env                 # API key (never commit this)
└── output/              # Generated articles land here
    └── article.md
```

Let's start building.

---

[Next: Step 2 - Project Setup →](02-project-setup.md)
