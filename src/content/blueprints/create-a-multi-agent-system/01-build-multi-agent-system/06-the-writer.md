# Step 6: The Writer

One-Line Summary: Build the Writer agent that takes the Researcher's notes and drafts a well-structured, engaging article.

Prerequisites: Steps 1-5 completed, Researcher agent defined

---

## The Writer's Job

The Writer sits in the middle of the pipeline. It receives the Researcher's structured notes and transforms them into a readable, well-organized article. The Writer does not need tools — it operates purely on the LLM's language capabilities, working with the context passed to it from the Researcher.

The key challenge for the Writer is not finding information (the Researcher did that) but organizing and presenting it effectively.

## Define the Writer Agent

Add the Writer to `agents.py`:

```python
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
        tools=[],                 # The Writer works purely with language
        llm=LLM_MODEL,
        verbose=True,
        allow_delegation=False,   # Stay focused on writing
    )
```

Notice the Writer has no tools. Not every agent needs tools. The Writer's strength is pure language — structuring, phrasing, and presenting the research it receives.

## Define the Writing Task

Add the writing task to `tasks.py`:

```python
def create_writing_task(agent, topic: str) -> Task:
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
    )
```

## Context: How Agents Share Information

The critical question: how does the Writer receive the Researcher's notes? In CrewAI, this is handled through **task context**. When you define a task, you can specify which previous tasks it depends on:

```python
# This is how we will wire it up in tasks.py (Step 8)
# The writing task receives the output of the research task as context
writing_task = Task(
    description="...",
    expected_output="...",
    agent=writer,
    context=[research_task],  # <-- This is the key line
)
```

The `context` parameter tells CrewAI: "Before the Writer starts, inject the output of `research_task` into its prompt." The Writer sees the Researcher's full output and can reference it while drafting.

This is different from agents communicating in real-time. In a sequential workflow, each agent completes its work fully before the next one starts. The context is a one-way data pipe.

## Writer Output Quality

The Writer's output quality depends on three factors:

| Factor | How to Control It |
|--------|------------------|
| **Input quality** | The Researcher's notes — better research = better writing |
| **Task description** | Explicit structure requirements in the writing task |
| **Backstory** | The persona shapes tone, style, and quality standards |

If the Writer's output is too generic, make the backstory more specific. If it is missing structure, add more detail to the task description. If it is missing facts, improve the Researcher's output.

## Verify the Agent Definition

At this point, your `agents.py` file should have two agent factory functions. Verify the file structure:

```python
# agents.py should now contain:
# - create_researcher() -> Agent (with web_search tool)
# - create_writer() -> Agent (no tools)
```

We will not test the Writer in isolation because it needs context from the Researcher to do useful work. We will test the full two-agent chain after building the Editor in the next step.

The Writer is ready. Next, we build the final agent in our pipeline — the Editor.

---

[← The Researcher](05-the-researcher.md) | [Next: Step 7 - The Editor →](07-the-editor.md)
