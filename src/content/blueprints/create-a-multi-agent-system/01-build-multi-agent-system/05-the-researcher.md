# Step 5: The Researcher

One-Line Summary: Build the Researcher agent that searches the web and compiles structured research notes on any given topic.

Prerequisites: Steps 1-4 completed, tools defined

---

## The Researcher's Job

The Researcher is the first agent in our pipeline. Its job is to:

1. Take a topic as input
2. Search the web for relevant, current information
3. Organize findings into structured research notes
4. Pass those notes to the Writer agent

A strong backstory is critical here. The more specific you are about the agent's expertise and approach, the better the output quality.

## Define the Researcher Agent

```python
# agents/researcher.py
"""
Researcher agent definition.
This agent searches the web and compiles structured research notes
that serve as the foundation for article writing.
"""

from crewai import Agent
from config.settings import MODEL_NAME
from tools.search_tool import WebSearchTool


def create_researcher() -> Agent:
    """
    Create and return the Researcher agent.

    The Researcher uses web search to gather current information
    and produces structured notes organized by subtopic.
    """
    return Agent(
        role="Senior Research Analyst",
        goal=(
            "Conduct thorough research on the given topic and produce "
            "comprehensive, well-organized research notes with key facts, "
            "statistics, expert opinions, and source references."
        ),
        backstory=(
            "You are a senior research analyst with 20 years of experience "
            "at a top-tier think tank. You have a PhD in Information Science "
            "and are known for your ability to quickly find the most relevant "
            "and credible sources on any topic. You always verify claims from "
            "multiple sources and clearly distinguish between established facts "
            "and emerging opinions. Your research notes are legendary for being "
            "thorough yet concise — every sentence earns its place."
        ),
        llm=MODEL_NAME,
        tools=[WebSearchTool()],
        allow_delegation=False,
        verbose=True,
        # Max iterations prevents infinite tool-calling loops
        max_iter=10,
        # Memory lets the agent remember previous steps within a task
        memory=True,
    )
```

## Why This Backstory Works

Notice the backstory is not generic. It specifies:

- **Experience level** — "20 years", "top-tier think tank" signals depth
- **Credentials** — "PhD in Information Science" anchors the expertise
- **Work style** — "verify claims from multiple sources" guides behavior
- **Quality standard** — "every sentence earns its place" reduces fluff

CrewAI injects this directly into the system prompt. Claude reads it and adopts the persona, which measurably changes the output quality and structure.

## Test the Researcher Alone

Before wiring the full crew, test the Researcher in isolation:

```python
# test_researcher.py
"""Test the Researcher agent with a single task."""

from crewai import Task, Crew
from agents.researcher import create_researcher

# Create the Researcher agent
researcher = create_researcher()

# Define a standalone research task
research_task = Task(
    description=(
        "Research the topic: 'Large Language Model agents and multi-agent systems'. "
        "Find the latest developments, key frameworks, real-world applications, "
        "and any notable limitations or challenges. "
        "Organize your findings into clear sections with bullet points."
    ),
    expected_output=(
        "Structured research notes with sections for: "
        "1) Overview/Definition, "
        "2) Key Frameworks and Tools, "
        "3) Real-World Applications, "
        "4) Challenges and Limitations, "
        "5) Sources and References. "
        "Each section should have 3-5 bullet points with specific details."
    ),
    agent=researcher,
)

# Run in a single-agent crew
crew = Crew(
    agents=[researcher],
    tasks=[research_task],
    verbose=True,
)

if __name__ == "__main__":
    result = crew.kickoff()
    print("\n" + "=" * 60)
    print("RESEARCH NOTES:")
    print("=" * 60)
    print(result.raw)
```

```bash
python test_researcher.py
```

## What to Look For

When the Researcher runs, watch the verbose output for:

- **Tool calls** — You should see the agent calling `web_search` multiple times with different queries
- **Reasoning** — The agent should explain why it is searching for specific terms
- **Structure** — The final output should have clear sections matching the `expected_output` format

If the agent is not using the search tool, check that the tool's `description` clearly explains when to use it. The description is what the agent reads to decide whether a tool is relevant.

## Register the Agent

```python
# agents/__init__.py
"""Agent definitions for the multi-agent crew."""

from agents.researcher import create_researcher
from agents.writer import create_writer
from agents.editor import create_editor

__all__ = ["create_researcher", "create_writer", "create_editor"]
```

Note: `create_writer` and `create_editor` do not exist yet — we will build them in the next two steps. For now this file will raise an import error if you import everything, but it shows the final structure.

---

[← Define Tools](04-define-tools.md) | [Next: Step 6 - The Writer →](06-the-writer.md)
