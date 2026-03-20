# Step 1: What We're Building

One-Line Summary: A multi-agent job application assistant powered by LangGraph where four specialized AI agents collaborate — analyzing job postings, tailoring resumes, writing cover letters, and reviewing the final package.

Prerequisites: Basic Python knowledge, familiarity with LLMs, a text editor

---

## The Goal

By the end of this blueprint, you will have a working multi-agent system that:

- **Analyzes a job posting** and extracts requirements, skills, and qualifications
- **Tailors your resume** to match the specific role and its keywords
- **Writes a cover letter** targeted to the company and position
- **Reviews everything** for consistency, gaps, and quality
- **Runs locally** from the command line with a single command

You will run:

```bash
python main.py --job "https://example.com/job-posting" --resume resume.md
```

...and get back a tailored resume, a targeted cover letter, and a quality review — all saved to an output directory.

## Why a Job Application Assistant?

This is not a toy example. Applying for jobs is tedious, repetitive, and high-stakes. Each application needs:

- A resume customized for the role's specific requirements
- A cover letter that speaks to the company's needs
- Consistency between your resume and cover letter
- The right keywords to pass ATS (Applicant Tracking System) filters

A multi-agent system is perfect for this because each task requires a different skill set. One agent that does everything produces mediocre results. Specialized agents produce better output.

## Architecture

```
                         ┌────────────────────┐
                         │    User Input       │
                         │  (job + resume)     │
                         └─────────┬──────────┘
                                   │
                         ┌─────────▼──────────┐
                         │   Job Analyzer      │
                         │   Extracts:         │
                         │   - Requirements    │
                         │   - Skills needed   │
                         │   - Company culture │
                         └─────────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │                             │
          ┌─────────▼──────────┐       ┌─────────▼──────────┐
          │   Resume Tailor    │       │  Cover Letter       │
          │   Rewrites resume  │       │  Writer             │
          │   for the role     │       │  Drafts targeted    │
          │                    │       │  cover letter       │
          └─────────┬──────────┘       └─────────┬──────────┘
                    │                             │
                    └──────────────┬──────────────┘
                                   │
                         ┌─────────▼──────────┐
                         │  Application        │
                         │  Reviewer           │
                         │  Checks quality,    │
                         │  consistency, gaps  │
                         └─────────┬──────────┘
                                   │
                         ┌─────────▼──────────┐
                         │   Final Package     │
                         │  - Tailored resume  │
                         │  - Cover letter     │
                         │  - Review notes     │
                         └────────────────────┘
```

Notice the **parallel branches** — the Resume Tailor and Cover Letter Writer run independently from each other. They both need the Job Analyzer's output, but not each other's. LangGraph makes this parallel execution trivial.

## What Is LangGraph?

[LangGraph](https://github.com/langchain-ai/langgraph) is a framework for building stateful, multi-step AI applications as **graphs**. It is built by the LangChain team but can be used independently.

The core idea: you model your workflow as a directed graph where:

- **Nodes** are functions that do work (call an LLM, process data, save a file)
- **Edges** connect nodes and define the flow
- **State** is a shared object that flows through the graph, updated by each node
- **Conditional edges** let you branch based on what happened (like routing to different agents)

Think of it as a flowchart that executes itself. You define the nodes and connections. LangGraph handles the execution, state passing, and even parallel branches.

## Why LangGraph for Multi-Agent Systems?

| Feature | Why It Matters |
|---------|---------------|
| **Graph-based flow** | Visualize and reason about your agent pipeline as a diagram |
| **Shared state** | All agents read from and write to a common state object — no manual plumbing |
| **Conditional routing** | Branch the flow based on agent output (e.g., skip cover letter if not needed) |
| **Parallel execution** | Nodes without dependencies run concurrently |
| **Built-in persistence** | Checkpoint and resume long-running workflows |
| **LLM-agnostic** | Works with OpenAI, Anthropic, Google, Ollama — swap models freely |

## Why This Stack

| Choice | Why |
|--------|-----|
| **Python 3.11+** | Standard for AI development. Rich ecosystem. |
| **LangGraph** | Graph-based orchestration with built-in state management and parallelism. |
| **LangChain** | Provides the LLM abstractions (`ChatOpenAI`, `ChatAnthropic`) that LangGraph builds on. |
| **OpenAI GPT-4o** | Fast, capable, and widely available. Easy to swap for Claude or Gemini. |

## Project Structure

```
job-application-agent/
├── main.py              # Entry point — accepts job posting + resume
├── state.py             # Shared state definition (TypedDict)
├── agents/
│   ├── __init__.py
│   ├── analyzer.py      # Job Analyzer agent
│   ├── tailor.py        # Resume Tailor agent
│   ├── writer.py        # Cover Letter Writer agent
│   └── reviewer.py      # Application Reviewer agent
├── graph.py             # Wires agents into a LangGraph workflow
├── utils.py             # Helper functions (file I/O, text parsing)
├── requirements.txt
├── .env                 # API keys (not committed)
├── sample_resume.md     # Example resume for testing
└── output/              # Generated application materials
    ├── tailored_resume.md
    ├── cover_letter.md
    └── review.md
```

Each step builds one piece. By the end, everything connects into a graph that runs your complete job application pipeline.

---

**Reference:** [LangGraph Documentation](https://langchain-ai.github.io/langgraph/) · [LangGraph GitHub](https://github.com/langchain-ai/langgraph)

[Next: Step 2 - Project Setup →](02-project-setup.md)
