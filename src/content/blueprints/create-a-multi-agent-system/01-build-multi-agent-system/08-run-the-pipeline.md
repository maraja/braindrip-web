# Step 8: Run the Pipeline

One-Line Summary: Write the main entry point that orchestrates all three agents in sequence, execute the full pipeline, and understand the output.

Prerequisites: Steps 1-7 completed, all agents defined

---

## The Orchestration

Our pipeline is a simple sequence: Researcher → Writer → Editor. Each agent's output becomes the next agent's input. The orchestration code is straightforward:

```python
# main.py — Entry point for the content production pipeline

import sys
from agents import create_researcher, create_writer, create_editor


def run_pipeline(topic: str) -> str:
    """Run the three-agent content production pipeline."""

    # Step 1: Create the agents
    researcher = create_researcher()
    writer = create_writer()
    editor = create_editor()

    # Step 2: Research
    print(f"\nTopic: {topic}")
    print(f"{'='*60}")

    research_notes = researcher.run(
        f"Research the following topic thoroughly: {topic}"
    )

    # Step 3: Write (receives research notes as context)
    draft = writer.run(
        f"Write a comprehensive article about: {topic}\n\n"
        f"Use these research notes as your source material:\n\n"
        f"{research_notes}"
    )

    # Step 4: Edit and save (receives the draft)
    final = editor.run(
        f"Edit and polish this draft article about: {topic}\n\n"
        f"After editing, save the final version using the save_to_file tool.\n\n"
        f"Draft to edit:\n\n{draft}"
    )

    print(f"\n{'='*60}")
    print("Pipeline complete!")
    print(f"{'='*60}")

    return final


if __name__ == "__main__":
    if len(sys.argv) > 1:
        topic = " ".join(sys.argv[1:])
    else:
        topic = "The Future of Quantum Computing"

    output = run_pipeline(topic)
    print(output)
```

## Run It

```bash
python main.py "The Rise of Multi-Agent AI Systems"
```

Or with a different topic:

```bash
python main.py "How Rust Is Changing Systems Programming"
```

The entire run takes 2-5 minutes depending on topic complexity and API response times.

## Understanding the Output

Watch the terminal. You will see three distinct phases:

**Phase 1 — Researcher at work:**

```
============================================================
Agent: Researcher
============================================================
  [Researcher] Using tool: web_search
  [Researcher] Using tool: web_search
  [Researcher] Using tool: web_search
  [Researcher] Done.
```

The Researcher makes multiple search calls, refines queries based on results, and compiles structured notes.

**Phase 2 — Writer at work:**

```
============================================================
Agent: Writer
============================================================
  [Writer] Done.
```

The Writer receives the research notes and produces a full draft. No tool calls — just writing.

**Phase 3 — Editor at work:**

```
============================================================
Agent: Editor
============================================================
  [Editor] Using tool: save_to_file
  [Editor] Done.
```

The Editor polishes the draft and saves it to the output directory.

## Check the Output

```bash
ls output/
cat output/*.md
```

The article should have a clear title, logical heading structure, specific facts from the research, and clean prose.

## How This Compares to Using a Framework

Here is what our pipeline looks like versus CrewAI:

```python
# Our approach — explicit and transparent
research_notes = researcher.run(f"Research: {topic}")
draft = writer.run(f"Write about: {topic}\n\nNotes:\n{research_notes}")
final = editor.run(f"Edit this draft:\n{draft}")
```

```python
# CrewAI approach — declarative but opaque
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, writing_task, editing_task],
    process=Process.sequential,
)
result = crew.kickoff()
```

Both produce the same result. The framework version is fewer lines, but our version is completely transparent — you can see exactly what each agent receives and produces. When something goes wrong, you know exactly where to look.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| **Agent loops without producing output** | System prompt is ambiguous | Make instructions more explicit |
| **Empty search results** | Search query too narrow | Check the Researcher's queries in the logs |
| **Writer ignores research** | Notes not included in the message | Verify the string concatenation in `run_pipeline()` |
| **Editor does not save** | Tool not called | Check the Editor's system prompt mentions `save_to_file` |
| **Rate limit errors** | Too many API calls | Add a `time.sleep(1)` between agent runs |

---

[← The Editor](07-the-editor.md) | [Next: Step 9 - What's Next →](09-whats-next.md)
