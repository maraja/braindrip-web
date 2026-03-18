# Step 8: Tasks and Workflow

One-Line Summary: Wire the three agents into a sequential crew workflow using tasks and context passing, so each agent builds on the previous one's output.

Prerequisites: Steps 1-7 completed, all three agents defined

---

## The Workflow Pattern

Our pipeline follows a simple sequential pattern:

```
Topic → [Research Task] → [Writing Task] → [Editing Task] → Article
```

Each task produces output that feeds into the next task as context. CrewAI manages this flow automatically — you just need to define the dependencies.

## The Complete tasks.py

Update `tasks.py` with all three tasks and a factory function that wires them together:

```python
# tasks.py — Define tasks and wire the workflow

from crewai import Task, Agent


def create_research_task(agent: Agent, topic: str) -> Task:
    """Create the research task for the Researcher agent."""
    return Task(
        description=(
            f"Research the following topic thoroughly: {topic}\n\n"
            "Your research process:\n"
            "1. Search for the topic and identify the most relevant sources\n"
            "2. Search for recent developments and current state\n"
            "3. Search for expert opinions and contrasting viewpoints\n"
            "4. Search for concrete data, statistics, or examples\n\n"
            "Compile your findings into structured research notes with:\n"
            "- Key themes and main points (with source references)\n"
            "- Important facts, statistics, and data points\n"
            "- Notable expert quotes or opinions\n"
            "- Recent developments or trends\n"
            "- Any areas of debate or controversy"
        ),
        expected_output=(
            "Comprehensive, well-organized research notes in a clear "
            "bullet-point format. Each major point should reference "
            "its source. The notes should contain enough material "
            "for a 1000-word article."
        ),
        agent=agent,
    )


def create_writing_task(
    agent: Agent, topic: str, research_task: Task
) -> Task:
    """Create the writing task for the Writer agent."""
    return Task(
        description=(
            f"Write a comprehensive article about: {topic}\n\n"
            "Using the research notes provided, write an article that:\n"
            "1. Opens with a compelling hook that draws the reader in\n"
            "2. Provides necessary background and context\n"
            "3. Covers the key themes identified in the research\n"
            "4. Includes specific examples, data points, and quotes\n"
            "5. Addresses different perspectives where relevant\n"
            "6. Concludes with forward-looking insights\n\n"
            "Article requirements:\n"
            "- Length: approximately 1000-1500 words\n"
            "- Format: Markdown with proper headings (##, ###)\n"
            "- Tone: Informative and engaging, not academic\n"
            "- Include a title as an H1 heading\n"
            "- Use short paragraphs (3-4 sentences max)"
        ),
        expected_output=(
            "A well-written Markdown article of 1000-1500 words with "
            "a clear title, logical structure, smooth transitions, "
            "and specific supporting evidence from the research."
        ),
        agent=agent,
        context=[research_task],  # Writer receives Researcher's output
    )


def create_editing_task(
    agent: Agent, topic: str, writing_task: Task
) -> Task:
    """Create the editing task for the Editor agent."""
    return Task(
        description=(
            f"Edit and polish the draft article about: {topic}\n\n"
            "Review the draft and make these improvements:\n"
            "1. Fix any grammatical errors or awkward phrasing\n"
            "2. Ensure every claim is supported by the research\n"
            "3. Tighten the prose — cut filler words and redundancy\n"
            "4. Verify the article has a logical flow from section "
            "to section\n"
            "5. Check that the introduction hooks the reader\n"
            "6. Ensure the conclusion provides clear takeaways\n"
            "7. Verify all Markdown formatting is correct\n\n"
            "After editing, save the final article using the "
            "save_to_file tool with a descriptive filename based "
            "on the topic (e.g., 'quantum-computing.md')."
        ),
        expected_output=(
            "A polished, publication-ready Markdown article that "
            "has been saved to a file. The article should be "
            "tighter and clearer than the draft, with no filler "
            "or unsupported claims."
        ),
        agent=agent,
        context=[writing_task],  # Editor receives Writer's output
    )
```

## The Context Chain

The `context` parameter is where the workflow comes together:

```
research_task (no context — starts fresh)
       │
       ▼ output injected as context
writing_task (context=[research_task])
       │
       ▼ output injected as context
editing_task (context=[writing_task])
```

When CrewAI runs the crew, it:

1. Executes `research_task` and captures the output
2. Injects that output into `writing_task`'s prompt, then executes it
3. Injects the writing output into `editing_task`'s prompt, then executes it

The agents never talk to each other directly. Context flows through the task chain.

## Alternative: Multiple Context Sources

You could also give the Editor access to both the research and the draft:

```python
# The Editor sees both the research and the draft
editing_task = Task(
    description="...",
    expected_output="...",
    agent=editor,
    context=[research_task, writing_task],  # Both previous tasks
)
```

This lets the Editor cross-reference claims in the draft against the original research. It uses more tokens but can improve fact-checking quality. We will keep it simple with a single context source for now.

## Assembling the Crew

The final piece is the Crew itself. This is the orchestrator that runs the workflow. Preview what `main.py` will look like (we will finalize it in Step 9):

```python
# Preview — how the crew is assembled
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, writing_task, editing_task],
    process=Process.sequential,  # Run tasks one after another
    verbose=True,
)

# Kick off the pipeline
result = crew.kickoff()
```

`Process.sequential` means tasks run in the order they are listed. CrewAI also supports `Process.hierarchical`, where a manager agent delegates tasks to workers — but sequential is the right choice for a linear pipeline.

## Task Design Principles

| Principle | Why It Matters |
|-----------|---------------|
| **Be explicit about the process** | Numbered steps guide the agent through a reliable workflow |
| **Specify the expected output format** | Prevents agents from guessing what you want |
| **Use context to pass data** | Cleaner than having agents share a database or file system |
| **One agent per task** | Each task has a single owner — no ambiguity about responsibility |

The workflow is wired. Next, we will write `main.py` and run the full pipeline end to end.

---

[← The Editor](07-the-editor.md) | [Next: Step 9 - Run the Crew →](09-run-the-crew.md)
