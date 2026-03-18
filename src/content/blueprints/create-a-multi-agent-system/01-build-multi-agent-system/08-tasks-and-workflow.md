# Step 8: Tasks and Workflow

One-Line Summary: Define the three tasks — research, write, and edit — and wire them into a sequential CrewAI workflow where each agent's output feeds the next.

Prerequisites: Steps 1-7 completed, all three agents built and tested individually

---

## How CrewAI Tasks Work

A **Task** is a specific assignment for an agent. It has:

- **description** — What the agent needs to do (can include variables)
- **expected_output** — The format and content you expect back
- **agent** — Which agent handles this task
- **context** — (Optional) A list of other tasks whose outputs are injected as context

The `context` parameter is how you create the data pipeline between agents. When Task B lists Task A in its context, CrewAI automatically passes Task A's output into Task B's prompt.

## Define the Three Tasks

```python
# tasks.py
"""
Task definitions for the content production pipeline.
Each task is assigned to one agent and wired together via context dependencies.
"""

from crewai import Task
from agents.researcher import create_researcher
from agents.writer import create_writer
from agents.editor import create_editor


def create_tasks(topic: str):
    """
    Create the research, write, and edit tasks for a given topic.

    Args:
        topic: The subject to research and write about.

    Returns:
        A tuple of (agents_list, tasks_list) ready for crew assembly.
    """

    # --- Instantiate agents ---
    researcher = create_researcher()
    writer = create_writer()
    editor = create_editor()

    # --- Task 1: Research ---
    research_task = Task(
        description=(
            f"Conduct comprehensive research on the topic: '{topic}'. "
            f"Search the web for the latest information, key developments, "
            f"expert opinions, and relevant data. Organize your findings "
            f"into structured notes with clear sections and bullet points. "
            f"Include source references where possible."
        ),
        expected_output=(
            "Structured research notes in Markdown format with sections for: "
            "1) Overview and Key Concepts, "
            "2) Current State and Recent Developments, "
            "3) Key Players and Technologies, "
            "4) Challenges and Open Questions, "
            "5) Notable Sources. "
            "Each section should contain 3-5 detailed bullet points."
        ),
        agent=researcher,
    )

    # --- Task 2: Write ---
    # The context parameter automatically injects research_task's output
    write_task = Task(
        description=(
            f"Using the research notes provided, write a comprehensive article "
            f"about '{topic}'. The article should be 800-1200 words, have a "
            f"compelling title, strong introduction, 3-4 body sections with "
            f"H2 headers, and a forward-looking conclusion. "
            f"Write for a technical audience that values depth and clarity."
        ),
        expected_output=(
            "A complete article in Markdown format with: "
            "1) An engaging, specific title (H1), "
            "2) An introduction that establishes why this topic matters, "
            "3) 3-4 body sections (H2) that build on each other, "
            "4) A conclusion that points toward future implications. "
            "Professional but approachable tone. 800-1200 words."
        ),
        agent=writer,
        # This is the key line — it pipes the Researcher's output to the Writer
        context=[research_task],
    )

    # --- Task 3: Edit ---
    # The editor receives both the research notes AND the draft for fact-checking
    edit_task = Task(
        description=(
            f"Review and polish the article draft about '{topic}'. "
            f"Check factual accuracy against the research notes. "
            f"Fix any grammar or spelling errors. Improve clarity, flow, "
            f"and transitions. Ensure Markdown formatting is clean and consistent. "
            f"Save the final version using the save_to_file tool with the "
            f"filename 'article.md'."
        ),
        expected_output=(
            "A publication-ready article in Markdown format. All facts verified, "
            "grammar polished, formatting consistent. The article must be saved "
            "to 'article.md' using the save_to_file tool. Return the final "
            "article text as output."
        ),
        agent=editor,
        # Editor gets both the research AND the draft for cross-referencing
        context=[research_task, write_task],
    )

    agents = [researcher, writer, editor]
    tasks = [research_task, write_task, edit_task]

    return agents, tasks
```

## The Data Flow

Here is exactly what happens when the crew runs:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  research_task                                              │
│  ┌─────────────┐                                           │
│  │ Researcher   │──► Output: structured research notes      │
│  └─────────────┘                     │                      │
│                                      ▼                      │
│  write_task              context: [research_task]            │
│  ┌─────────────┐                                           │
│  │ Writer       │──► Output: article draft                  │
│  └─────────────┘                     │                      │
│                                      ▼                      │
│  edit_task      context: [research_task, write_task]         │
│  ┌─────────────┐                                           │
│  │ Editor       │──► Output: polished article + saved file  │
│  └─────────────┘                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Sequential vs. Hierarchical

CrewAI supports two process types:

| Process | How It Works | Best For |
|---------|-------------|----------|
| **Sequential** | Tasks run in order, one after another | Pipelines with clear stages (our use case) |
| **Hierarchical** | A manager agent delegates tasks dynamically | Complex, branching workflows |

We use sequential because our pipeline has a clear linear flow: research, then write, then edit. Each step depends on the previous one.

## Why Context Matters

The `context` parameter does more than just pass text. CrewAI formats it with clear labels so the receiving agent knows where the information came from:

```
# What the Writer sees in its prompt (simplified):
You are a Senior Content Writer...

## Context from previous tasks:

### Task output from Senior Research Analyst:
[The researcher's full output appears here]

## Your current task:
Write a comprehensive article about...
```

This structured injection is why multi-agent pipelines produce better results than a single mega-prompt. Each agent gets exactly the context it needs, clearly labeled.

---

[← The Editor](07-the-editor.md) | [Next: Step 9 - Run the Crew →](09-run-the-crew.md)
