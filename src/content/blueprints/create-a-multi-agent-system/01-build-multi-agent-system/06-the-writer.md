# Step 6: The Writer

One-Line Summary: Build the Writer agent that takes research notes and transforms them into a well-structured, engaging article draft.

Prerequisites: Steps 1-5 completed, Researcher agent built

---

## The Writer's Job

The Writer is the second agent in the pipeline. It receives the Researcher's structured notes and produces a full article draft. The key challenge is turning bullet points and facts into flowing, readable prose.

The Writer has access to the `save_to_file` tool so it can persist drafts, but its primary output is the article text itself, which gets passed to the Editor.

## Define the Writer Agent

```python
# agents/writer.py
"""
Writer agent definition.
This agent takes research notes and produces a well-structured
article draft with clear sections, transitions, and narrative flow.
"""

from crewai import Agent
from config.settings import MODEL_NAME
from tools.file_tool import SaveToFileTool


def create_writer() -> Agent:
    """
    Create and return the Writer agent.

    The Writer transforms research notes into a polished article draft.
    It focuses on structure, readability, and engaging prose.
    """
    return Agent(
        role="Senior Content Writer",
        goal=(
            "Transform research notes into a compelling, well-structured "
            "article that is informative, engaging, and accessible to a "
            "technical audience. The article should flow naturally and "
            "maintain reader interest throughout."
        ),
        backstory=(
            "You are a senior content writer who spent 10 years at Wired and "
            "Ars Technica before becoming a freelance technology journalist. "
            "You have a gift for making complex technical topics accessible "
            "without dumbing them down. Your articles are known for strong "
            "opening hooks, clear section structure, smooth transitions between "
            "ideas, and memorable closing thoughts. You never pad your writing "
            "with filler — every paragraph advances the reader's understanding."
        ),
        llm=MODEL_NAME,
        tools=[SaveToFileTool()],
        allow_delegation=False,
        verbose=True,
        max_iter=5,
        memory=True,
    )
```

## Backstory Design Choices

The Writer's backstory is calibrated for article quality:

| Element | Effect on Output |
|---------|-----------------|
| "10 years at Wired and Ars Technica" | Sets the tone — technical but accessible |
| "strong opening hooks" | The agent will write engaging introductions |
| "smooth transitions between ideas" | Reduces the "list of paragraphs" problem |
| "never pad with filler" | Keeps the output concise and valuable |

Experiment with different backstories to see how they change the writing style. A backstory referencing academic papers will produce formal prose; one referencing blog posts will be more conversational.

## Test the Writer Alone

We can test the Writer by providing research notes directly in the task description:

```python
# test_writer.py
"""Test the Writer agent with pre-made research notes."""

from crewai import Task, Crew
from agents.writer import create_writer

# Create the Writer agent
writer = create_writer()

# Simulate research notes that would come from the Researcher
sample_research = """
## Research Notes: Multi-Agent AI Systems

### Overview
- Multi-agent systems use multiple specialized AI agents working together
- Each agent has a defined role, tools, and decision-making capability
- Coordination happens through message passing or shared memory

### Key Frameworks
- CrewAI: Role-based, Python-native, intuitive agent definitions
- LangGraph: Graph-based workflows, more flexible but complex
- AutoGen (Microsoft): Conversational agents, strong for coding tasks

### Applications
- Content production pipelines (research → write → edit)
- Software development (architect → coder → reviewer)
- Data analysis (collector → analyst → visualizer)

### Challenges
- Agent coordination and error propagation
- Cost management with multiple LLM calls
- Debugging multi-step agent workflows
"""

# Define the writing task
write_task = Task(
    description=(
        f"Using the following research notes, write a complete article "
        f"about multi-agent AI systems. The article should be 600-800 words, "
        f"have a compelling title, introduction, 3-4 body sections, and a "
        f"conclusion.\n\nResearch Notes:\n{sample_research}"
    ),
    expected_output=(
        "A complete Markdown-formatted article with: "
        "1) An engaging title, "
        "2) An introduction that hooks the reader, "
        "3) 3-4 body sections with H2 headers, "
        "4) A conclusion with forward-looking insights. "
        "The tone should be professional but approachable."
    ),
    agent=writer,
)

# Run the Writer
crew = Crew(
    agents=[writer],
    tasks=[write_task],
    verbose=True,
)

if __name__ == "__main__":
    result = crew.kickoff()
    print("\n" + "=" * 60)
    print("ARTICLE DRAFT:")
    print("=" * 60)
    print(result.raw)
```

```bash
python test_writer.py
```

## What Good Output Looks Like

A successful Writer output will have:

- A title that is specific, not generic (not just "Multi-Agent AI Systems")
- An opening paragraph that creates curiosity or states a bold claim
- Sections that build on each other rather than just listing facts
- Transitions between sections that connect ideas
- A conclusion that goes beyond summarizing — it points forward

If the output reads like a reformatted version of the bullet points, tweak the backstory to emphasize narrative flow and storytelling.

---

[← The Researcher](05-the-researcher.md) | [Next: Step 7 - The Editor →](07-the-editor.md)
