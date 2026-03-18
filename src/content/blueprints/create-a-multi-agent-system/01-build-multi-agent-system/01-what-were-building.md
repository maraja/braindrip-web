# Step 1: What We're Building

One-Line Summary: A multi-agent content production pipeline where three AI agents — Researcher, Writer, and Editor — collaborate to produce polished articles from a single topic prompt.

Prerequisites: Basic Python knowledge, familiarity with LLMs and API concepts, a text editor

---

## The Goal

By the end of this blueprint, you will have a working multi-agent system that:

- **Accepts a topic** and produces a well-researched, well-written article
- **Uses three specialized agents** that collaborate in sequence
- **Leverages Claude** as the underlying LLM via CrewAI
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

Each agent has its own role, goal, backstory, and set of tools. They pass their output to the next agent in the chain.

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

The agents execute sequentially: the Researcher's output feeds into the Writer's task, and the Writer's output feeds into the Editor's task. CrewAI orchestrates this pipeline automatically.

## Why CrewAI

| Choice | Why |
|--------|-----|
| **CrewAI** | The most intuitive framework for role-based multi-agent systems. Agents are defined with plain-English roles, goals, and backstories. |
| **Claude (via LiteLLM)** | Anthropic's Claude provides strong reasoning and writing. LiteLLM gives CrewAI a unified interface to call it. |
| **Python 3.11+** | CrewAI is a Python-native framework. Python 3.11+ gives us better error messages and performance. |
| **Built-in tools** | We will create simple, focused tools — web search and file saving — that agents invoke when needed. |

## Project Structure

Here is what we will build:

```
content-crew/
├── main.py              # Entry point — accepts a topic and runs the crew
├── agents.py            # Defines the three agents (Researcher, Writer, Editor)
├── tasks.py             # Defines the tasks each agent performs
├── tools.py             # Custom tools (web search, save to file)
├── config.py            # Configuration and API keys
├── requirements.txt     # Python dependencies
└── output/              # Generated articles land here
    └── article.md
```

Let's start building.

---

[Next: Step 2 - Project Setup →](02-project-setup.md)
