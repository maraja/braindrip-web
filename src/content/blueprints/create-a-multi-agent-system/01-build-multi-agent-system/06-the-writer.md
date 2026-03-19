# Step 6: The Writer

One-Line Summary: Build the Writer agent that takes the Researcher's notes and drafts a well-structured, engaging article.

Prerequisites: Steps 1-5 completed, Researcher agent defined

---

## The Writer's Job

The Writer sits in the middle of the pipeline. It receives the Researcher's notes and transforms them into a readable, well-organized article. The Writer has no tools — it operates purely on Claude's language capabilities.

## Define the Writer

Add the Writer to `agents.py`:

```python
def create_writer():
    """Create the Writer agent — pure language, no tools."""
    return Agent(
        name="Writer",
        system_prompt=(
            "You are an experienced technical writer who has written "
            "for publications like Wired, Ars Technica, and MIT "
            "Technology Review. You make complex topics accessible "
            "without dumbing them down.\n\n"
            "When given research notes, write an article that:\n"
            "1. Opens with a compelling hook\n"
            "2. Provides necessary background and context\n"
            "3. Covers the key themes from the research\n"
            "4. Includes specific examples and data points\n"
            "5. Concludes with forward-looking insights\n\n"
            "Requirements:\n"
            "- Length: 1000-1500 words\n"
            "- Format: Markdown with proper headings (##, ###)\n"
            "- Tone: Informative and engaging, not academic\n"
            "- Short paragraphs (3-4 sentences max)\n"
            "- Include a title as an H1 heading\n"
            "- Write in a direct, confident voice — no filler"
        ),
        tools=[],
        tool_functions={},
    )
```

The Writer has no tools because it does not need them. Not every agent needs tools. The Writer's job is to take structured input (research notes) and produce structured output (an article). That is a pure language task.

## How the Writer Receives Research Notes

In our pipeline, the Researcher's output is passed directly as the Writer's input:

```python
# This is what happens in main.py (we will write this in Step 8)
research_notes = researcher.run(f"Research: {topic}")
draft = writer.run(f"Write an article about: {topic}\n\nResearch notes:\n{research_notes}")
```

The Writer sees both the topic and the full research notes in its input message. No special context-passing mechanism — just string concatenation. This is simpler and more transparent than framework-based context wiring.

## Writer Output Quality

The Writer's output quality depends on three factors:

| Factor | How to Control It |
|--------|------------------|
| **Input quality** | The Researcher's notes — better research means better writing |
| **System prompt** | Explicit structure requirements and style guidelines |
| **The topic instruction** | How you frame the writing task in the user message |

If the Writer's output is too generic, make the system prompt more specific. If it is missing structure, add format requirements. If it is missing facts, improve the Researcher's output.

## Verify the Agent Definition

Your `agents.py` now has two factory functions:

```python
# agents.py should contain:
# - create_researcher() -> Agent (with web_search tool)
# - create_writer() -> Agent (no tools)
```

We will not test the Writer in isolation because it needs research notes to produce useful output. We will test the full chain after building the Editor.

---

[← The Researcher](05-the-researcher.md) | [Next: Step 7 - The Editor →](07-the-editor.md)
