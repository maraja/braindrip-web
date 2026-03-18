# Step 7: The Editor

One-Line Summary: Build the Editor agent that polishes the Writer's draft, checks consistency, and saves the final article to a Markdown file.

Prerequisites: Steps 1-6 completed, Researcher and Writer agents defined

---

## The Editor's Job

The Editor is the last agent in the pipeline. It receives the Writer's draft and:

1. Reviews for clarity, grammar, and flow
2. Checks that claims are supported by the research
3. Tightens the prose — removes filler, sharpens phrasing
4. Ensures consistent formatting
5. Saves the final article to a Markdown file

The Editor has access to the `save_to_file` tool, making it responsible for producing the final deliverable.

## Define the Editor Agent

Add the Editor to `agents.py`:

```python
def create_editor() -> Agent:
    """Create the Editor agent that polishes and saves the final article."""
    return Agent(
        role="Senior Editor",
        goal=(
            "Polish the draft article to publication quality. "
            "Ensure the writing is clear, accurate, well-structured, "
            "and free of errors. Save the final version as a "
            "Markdown file."
        ),
        backstory=(
            "You are a meticulous editor with 20 years of experience "
            "at top-tier publications. You have an eye for unclear "
            "phrasing, logical gaps, and unsupported claims. You "
            "never add fluff — your edits make articles shorter and "
            "sharper, not longer. You check that every section flows "
            "logically into the next. When you spot a vague claim, "
            "you either sharpen it with specifics or cut it. Your "
            "edited articles are consistently praised for their "
            "clarity and precision."
        ),
        tools=[save_to_file],     # The Editor saves the final output
        llm=LLM_MODEL,
        verbose=True,
        allow_delegation=False,
    )
```

## Define the Editing Task

Add the editing task to `tasks.py`:

```python
def create_editing_task(agent, topic: str) -> Task:
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
    )
```

Notice the task explicitly instructs the Editor to use the `save_to_file` tool. While agents can figure out tool usage on their own, being explicit in the task description improves reliability.

## The Complete agents.py

Your `agents.py` file should now contain all three agents:

```python
# agents.py — Define the crew's three agents

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
        tools=[web_search],
        llm=LLM_MODEL,
        verbose=True,
        allow_delegation=False,
        max_iter=10,
    )


def create_writer() -> Agent:
    """Create the Writer agent that drafts content from research notes."""
    return Agent(
        role="Senior Content Writer",
        goal=(
            "Write a compelling, well-structured article based on "
            "the provided research notes. The article should be "
            "informative, engaging, and accessible to a technical "
            "but non-specialist audience."
        ),
        backstory=(
            "You are an experienced technical writer who has written "
            "for publications like Wired, Ars Technica, and MIT "
            "Technology Review. You have a talent for making complex "
            "topics accessible without dumbing them down. Your "
            "articles are known for their clear structure, smooth "
            "transitions, and engaging narrative flow. You always "
            "use concrete examples to illustrate abstract concepts. "
            "You write in a direct, confident voice — never fluffy "
            "or full of filler."
        ),
        tools=[],
        llm=LLM_MODEL,
        verbose=True,
        allow_delegation=False,
    )


def create_editor() -> Agent:
    """Create the Editor agent that polishes and saves the final article."""
    return Agent(
        role="Senior Editor",
        goal=(
            "Polish the draft article to publication quality. "
            "Ensure the writing is clear, accurate, well-structured, "
            "and free of errors. Save the final version as a "
            "Markdown file."
        ),
        backstory=(
            "You are a meticulous editor with 20 years of experience "
            "at top-tier publications. You have an eye for unclear "
            "phrasing, logical gaps, and unsupported claims. You "
            "never add fluff — your edits make articles shorter and "
            "sharper, not longer. You check that every section flows "
            "logically into the next. When you spot a vague claim, "
            "you either sharpen it with specifics or cut it. Your "
            "edited articles are consistently praised for their "
            "clarity and precision."
        ),
        tools=[save_to_file],
        llm=LLM_MODEL,
        verbose=True,
        allow_delegation=False,
    )
```

## Agent Summary

| Agent | Role | Tools | Receives From | Passes To |
|-------|------|-------|--------------|-----------|
| **Researcher** | Find and summarize information | `web_search` | User topic | Writer |
| **Writer** | Draft article from research | None | Researcher notes | Editor |
| **Editor** | Polish and save final article | `save_to_file` | Writer draft | Output file |

All three agents are defined. Next, we will wire them together into a sequential workflow with tasks and context passing.

---

[← The Writer](06-the-writer.md) | [Next: Step 8 - Tasks and Workflow →](08-tasks-and-workflow.md)
