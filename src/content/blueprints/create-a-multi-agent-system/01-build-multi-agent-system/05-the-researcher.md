# Step 5: The Researcher

One-Line Summary: Build the Researcher agent — the first agent in our pipeline — that searches the web and compiles structured research notes on any topic.

Prerequisites: Steps 1-4 completed, tools defined in `tools.py`

---

## The Researcher's Job

The Researcher is the foundation of our pipeline. Given a topic, it:

1. Searches the web for relevant, current information
2. Identifies key themes, facts, and data points
3. Compiles everything into structured research notes
4. Passes those notes to the Writer agent

A good Researcher produces organized, factual notes — not prose. The Writer handles the writing. This separation of concerns is what makes multi-agent systems effective.

## Define the Researcher Agent

Open `agents.py` and replace the test agent with the Researcher. We will build up the file step by step and have all three agents in it by Step 7:

```python
# agents.py — Define the crew's agents

from crewai import Agent
from config import LLM_MODEL
from tools import web_search, save_to_file


def create_researcher() -> Agent:
    """Create the Researcher agent that finds and summarizes information."""
    return Agent(
        role="Senior Research Analyst",
        goal=(
            "Find comprehensive, accurate, and current information "
            "about the given topic. Produce well-organized research "
            "notes that a writer can easily turn into an article."
        ),
        backstory=(
            "You are a veteran research analyst with 15 years of "
            "experience in investigative journalism and academic "
            "research. You are known for your ability to quickly "
            "find reliable sources, identify key themes, and "
            "separate signal from noise. You never fabricate "
            "information — if you cannot find something, you say so. "
            "Your research notes are legendary for being thorough "
            "yet concise."
        ),
        tools=[web_search],       # The Researcher can search the web
        llm=LLM_MODEL,
        verbose=True,
        allow_delegation=False,    # Stay focused on research
        max_iter=10,               # Allow multiple search iterations
    )
```

## Backstory Engineering

Notice how specific the backstory is. This is intentional. Compare these two backstories:

**Vague:** "You are a researcher who finds information."

**Specific:** "You are a veteran research analyst with 15 years of experience in investigative journalism... You never fabricate information... Your research notes are legendary for being thorough yet concise."

The specific backstory produces measurably better output because it:

- Sets a quality standard ("thorough yet concise")
- Establishes behavioral guardrails ("never fabricate information")
- Gives the LLM a concrete persona to embody

Treat the backstory as a compressed system prompt. Every word shapes behavior.

## Define the Research Task

The Researcher needs a task. We will define all tasks in `tasks.py`. Start the file with the research task:

```python
# tasks.py — Define tasks for each agent

from crewai import Task


def create_research_task(agent, topic: str) -> Task:
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
```

The `description` is explicit about the research process because it gives the agent a clear sequence to follow. The `expected_output` tells the agent what format to aim for.

## Test the Researcher

Create a quick test to see the Researcher in action:

```python
# test_researcher.py — Run the Researcher agent standalone

from crewai import Crew, Process
from agents import create_researcher
from tasks import create_research_task

# Create the Researcher and its task
researcher = create_researcher()
task = create_research_task(researcher, "The current state of quantum computing")

# Run as a single-agent crew
crew = Crew(
    agents=[researcher],
    tasks=[task],
    process=Process.sequential,
    verbose=True,
)

result = crew.kickoff()

print("\n" + "=" * 60)
print("RESEARCH NOTES:")
print("=" * 60)
print(result.raw)
```

```bash
python test_researcher.py
```

Watch the verbose output. You will see the Researcher decide to search, receive results, search again with refined queries, and eventually compile its notes. This iterative search-and-synthesize behavior is the Researcher working as intended.

Clean up after testing:

```bash
rm test_researcher.py
```

The Researcher is ready. Next, we will build the Writer that turns these research notes into a polished draft.

---

[← Define Tools](04-define-tools.md) | [Next: Step 6 - The Writer →](06-the-writer.md)
