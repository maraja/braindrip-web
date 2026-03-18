# Step 7: The Editor

One-Line Summary: Build the Editor agent that polishes the draft, checks facts, improves clarity, and saves the final article.

Prerequisites: Steps 1-6 completed, Researcher and Writer agents built

---

## The Editor's Job

The Editor is the final agent in the pipeline. It receives the Writer's draft and:

1. Checks for factual accuracy against the original research
2. Improves grammar, clarity, and sentence structure
3. Ensures consistent tone and formatting
4. Adds any missing context or caveats
5. Saves the final polished article to a Markdown file

This is where the multi-agent approach really shines. A single-prompt system would struggle to both write creatively and self-edit critically. By separating these into distinct agents, each one does its job without conflicting priorities.

## Define the Editor Agent

```python
# agents/editor.py
"""
Editor agent definition.
This agent reviews and polishes article drafts, checking for
factual accuracy, clarity, grammar, and consistent formatting.
"""

from crewai import Agent
from config.settings import MODEL_NAME
from tools.file_tool import SaveToFileTool


def create_editor() -> Agent:
    """
    Create and return the Editor agent.

    The Editor reviews article drafts for accuracy, clarity,
    and style, then saves the final polished version.
    """
    return Agent(
        role="Senior Editor",
        goal=(
            "Review and polish the article draft to publication quality. "
            "Fix any factual errors, improve clarity and flow, ensure "
            "consistent formatting, and save the final version as a "
            "Markdown file."
        ),
        backstory=(
            "You are a senior editor with 15 years of experience at major "
            "technology publications including MIT Technology Review and "
            "The Verge. You have a sharp eye for factual inaccuracies, "
            "logical gaps, and unclear explanations. You believe good editing "
            "is invisible — the reader should never notice your work, only "
            "enjoy the seamless result. You follow the principle: cut anything "
            "that does not serve the reader. You also ensure all Markdown "
            "formatting is clean and consistent."
        ),
        llm=MODEL_NAME,
        tools=[SaveToFileTool()],
        allow_delegation=False,
        verbose=True,
        max_iter=5,
        memory=True,
    )
```

## The Editor's Backstory Strategy

The Editor backstory is designed for critical analysis, not creative writing:

- **"sharp eye for factual inaccuracies"** — Activates fact-checking behavior
- **"logical gaps and unclear explanations"** — Catches structural issues
- **"good editing is invisible"** — Prevents the editor from rewriting in a completely different style
- **"cut anything that does not serve the reader"** — Reduces bloat

This is an important design pattern: agent backstories should create complementary, non-overlapping expertise. The Writer optimizes for engagement; the Editor optimizes for accuracy and clarity.

## Test the Editor Alone

```python
# test_editor.py
"""Test the Editor agent with a rough draft."""

from crewai import Task, Crew
from agents.editor import create_editor

# Create the Editor agent
editor = create_editor()

# Simulate a rough draft that needs editing
rough_draft = """
# Multi-Agent AI Systems: The Next Step

Multi-agent AI systems are really cool and interesting. They use
lots of agents that work together. This is becoming very popular
in the AI community.

## What Are They

Basicly, multi-agent systems have multiple AI agents each with
their own role. The agents can use tools and talk to each other.
Its like having a team of specialists instead of one generalist.

## Why They Matter

They matter because they can do things that single agents cant.
For example, a researcher agent can search the web while a writer
agent focuses on writing. This division of labor is very effective
and produces much better results than a single agent trying to
do everything. The frameworks available include CrewAI, LangGraph,
and Microsoft's AutoGen.

## Conclusion

In conclusion, multi-agent systems are the future of AI
applications. Everyone should learn about them.
"""

# Define the editing task
edit_task = Task(
    description=(
        f"Edit and polish the following article draft. Fix all grammatical "
        f"errors, improve clarity and flow, strengthen weak statements with "
        f"specifics, and ensure the Markdown formatting is clean. "
        f"Save the final version using the save_to_file tool with the "
        f"filename 'test-edited-article.md'.\n\nDraft:\n{rough_draft}"
    ),
    expected_output=(
        "A polished, publication-ready article in Markdown format. "
        "All grammar errors fixed, vague statements replaced with "
        "specific claims, and formatting cleaned up. The article should "
        "also be saved to 'test-edited-article.md'."
    ),
    agent=editor,
)

# Run the Editor
crew = Crew(
    agents=[editor],
    tasks=[edit_task],
    verbose=True,
)

if __name__ == "__main__":
    result = crew.kickoff()
    print("\n" + "=" * 60)
    print("EDITED ARTICLE:")
    print("=" * 60)
    print(result.raw)
```

```bash
python test_editor.py
```

## What the Editor Should Fix

In the rough draft above, the Editor should:

- Fix spelling ("Basicly" to "Basically", "cant" to "can't")
- Replace vague phrases ("really cool and interesting") with substantive claims
- Strengthen the conclusion beyond "everyone should learn about them"
- Clean up Markdown formatting and heading hierarchy
- Add specific examples or data points where claims are too general

Check `output/test-edited-article.md` to verify the file was saved correctly.

---

[← The Writer](06-the-writer.md) | [Next: Step 8 - Tasks and Workflow →](08-tasks-and-workflow.md)
