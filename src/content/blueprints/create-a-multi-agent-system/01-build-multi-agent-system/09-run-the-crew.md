# Step 9: Run the Crew

One-Line Summary: Write the main entry point, execute the full three-agent pipeline, and understand the agent interactions in the output.

Prerequisites: Steps 1-8 completed, all agents, tasks, and tools defined

---

## The Main Entry Point

Create `main.py` — the script that ties everything together:

```python
# main.py — Entry point for the content production crew

import sys
from crewai import Crew, Process
from agents import create_researcher, create_writer, create_editor
from tasks import (
    create_research_task,
    create_writing_task,
    create_editing_task,
)


def run_crew(topic: str) -> str:
    """Assemble and run the content production crew."""

    # Step 1: Create the agents
    researcher = create_researcher()
    writer = create_writer()
    editor = create_editor()

    # Step 2: Create the tasks with context wiring
    research_task = create_research_task(researcher, topic)
    writing_task = create_writing_task(writer, topic, research_task)
    editing_task = create_editing_task(editor, topic, writing_task)

    # Step 3: Assemble the crew
    crew = Crew(
        agents=[researcher, writer, editor],
        tasks=[research_task, writing_task, editing_task],
        process=Process.sequential,
        verbose=True,
    )

    # Step 4: Run the pipeline
    print(f"\n{'='*60}")
    print(f"Starting content crew for: {topic}")
    print(f"{'='*60}\n")

    result = crew.kickoff()

    print(f"\n{'='*60}")
    print("Crew finished!")
    print(f"{'='*60}\n")

    return result.raw


if __name__ == "__main__":
    # Accept topic from command line or use a default
    if len(sys.argv) > 1:
        topic = " ".join(sys.argv[1:])
    else:
        topic = "The Future of Quantum Computing"

    output = run_crew(topic)
    print(output)
```

## Run It

Execute the full pipeline:

```bash
python main.py "The Rise of Multi-Agent AI Systems"
```

Or with a different topic:

```bash
python main.py "How Rust Is Changing Systems Programming"
```

The entire run takes 2-5 minutes depending on the topic complexity and API response times.

## Understanding the Output

Watch the terminal as the crew executes. You will see three distinct phases:

**Phase 1 — Researcher at work:**

```
Working Agent: Senior Research Analyst
Starting Task: Research the following topic thoroughly...

> Using tool: web_search
> Tool input: "multi-agent AI systems 2024"
> Tool output: [1] Multi-Agent Systems: A Survey...

> Using tool: web_search
> Tool input: "multi-agent AI frameworks comparison"
> Tool output: [1] CrewAI vs AutoGen vs LangGraph...

Task output: ## Research Notes: The Rise of Multi-Agent AI Systems
### Key Themes
- Multi-agent systems divide complex tasks...
```

The Researcher makes multiple search calls, refines its queries based on results, and compiles structured notes.

**Phase 2 — Writer at work:**

```
Working Agent: Senior Content Writer
Starting Task: Write a comprehensive article about...

Task output: # The Rise of Multi-Agent AI Systems
In the past year, a quiet revolution has been unfolding...
```

The Writer receives the research notes as context and produces a full draft. No tool calls — just writing.

**Phase 3 — Editor at work:**

```
Working Agent: Senior Editor
Starting Task: Edit and polish the draft article...

> Using tool: save_to_file
> Tool input: {"filename": "rise-of-multi-agent-ai-systems.md", "content": "..."}
> Tool output: Article saved successfully to: output/rise-of-multi-agent-ai-systems.md
```

The Editor polishes the draft and saves it to the output directory.

## Check the Output

After the crew finishes, check the output directory:

```bash
ls output/
```

You should see a Markdown file with a descriptive name. Open it:

```bash
cat output/*.md
```

The article should have:

- A clear title and logical heading structure
- Well-organized sections with smooth transitions
- Specific facts and data from the research
- Clean, readable prose

## What Happens When Things Go Wrong

Common issues and how to fix them:

| Issue | Cause | Fix |
|-------|-------|-----|
| **Agent loops endlessly** | Task description is ambiguous | Make the expected output more specific |
| **Empty search results** | Search query too narrow | Adjust the research task to try broader queries |
| **Writer ignores research** | Context not wired correctly | Verify `context=[research_task]` on the writing task |
| **Editor does not save** | Tool not assigned | Check `tools=[save_to_file]` on the Editor agent |
| **Rate limiting errors** | Too many API calls too fast | Add `max_rpm=10` to the Crew constructor |

If you hit rate limits, add a rate limiter to the Crew:

```python
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, writing_task, editing_task],
    process=Process.sequential,
    verbose=True,
    max_rpm=10,  # Maximum requests per minute to the LLM
)
```

The full pipeline works. Next, we will explore ways to customize and extend it.

---

[← Tasks and Workflow](08-tasks-and-workflow.md) | [Next: Step 10 - Customize and Extend →](10-customize-and-extend.md)
