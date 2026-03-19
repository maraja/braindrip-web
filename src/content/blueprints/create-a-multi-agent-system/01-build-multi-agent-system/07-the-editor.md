# Step 7: The Editor

One-Line Summary: Build the Editor agent that polishes the Writer's draft, checks consistency, and saves the final article to a Markdown file.

Prerequisites: Steps 1-6 completed, Researcher and Writer agents defined

---

## The Editor's Job

The Editor is the last agent in the pipeline. It receives the Writer's draft and:

1. Reviews for clarity, grammar, and flow
2. Checks that claims are supported
3. Tightens the prose — removes filler, sharpens phrasing
4. Ensures consistent formatting
5. Saves the final article using the `save_to_file` tool

## Define the Editor

Add the Editor to `agents.py`:

```python
def create_editor():
    """Create the Editor agent that polishes and saves the final article."""
    return Agent(
        name="Editor",
        system_prompt=(
            "You are a meticulous editor with 20 years of experience "
            "at top-tier publications. You have an eye for unclear "
            "phrasing, logical gaps, and unsupported claims.\n\n"
            "Your editing process:\n"
            "1. Fix grammatical errors and awkward phrasing\n"
            "2. Ensure every claim is supported by evidence\n"
            "3. Cut filler words and redundancy\n"
            "4. Verify logical flow between sections\n"
            "5. Check that the introduction hooks the reader\n"
            "6. Ensure the conclusion provides clear takeaways\n"
            "7. Verify all Markdown formatting is correct\n\n"
            "Rules:\n"
            "- Your edits make articles shorter and sharper, not longer\n"
            "- When you spot a vague claim, sharpen it or cut it\n"
            "- After editing, save the final article using the save_to_file tool\n"
            "- Use a descriptive filename based on the topic (e.g., 'quantum-computing.md')"
        ),
        tools=[SAVE_TO_FILE_TOOL],
        tool_functions={"save_to_file": save_to_file},
    )
```

## The Complete agents.py

Your file should now contain all three agents:

```python
# agents.py — Define the crew's three agents

from agent import Agent
from tools import (
    web_search, WEB_SEARCH_TOOL,
    save_to_file, SAVE_TO_FILE_TOOL,
)


def create_researcher():
    """Create the Researcher agent with web search capability."""
    return Agent(
        name="Researcher",
        system_prompt=(
            "You are a veteran research analyst with 15 years of "
            "experience in investigative journalism and academic "
            "research. You are known for your ability to quickly "
            "find reliable sources, identify key themes, and "
            "separate signal from noise.\n\n"
            "Your process:\n"
            "1. Search for the topic to understand the landscape\n"
            "2. Search for recent developments and current state\n"
            "3. Search for expert opinions and data points\n"
            "4. Compile everything into structured research notes\n\n"
            "Rules:\n"
            "- Never fabricate information — if you cannot find it, say so\n"
            "- Reference your sources\n"
            "- Produce thorough but concise notes in bullet-point format\n"
            "- Include enough material for a 1000-word article"
        ),
        tools=[WEB_SEARCH_TOOL],
        tool_functions={"web_search": web_search},
    )


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


def create_editor():
    """Create the Editor agent that polishes and saves the final article."""
    return Agent(
        name="Editor",
        system_prompt=(
            "You are a meticulous editor with 20 years of experience "
            "at top-tier publications. You have an eye for unclear "
            "phrasing, logical gaps, and unsupported claims.\n\n"
            "Your editing process:\n"
            "1. Fix grammatical errors and awkward phrasing\n"
            "2. Ensure every claim is supported by evidence\n"
            "3. Cut filler words and redundancy\n"
            "4. Verify logical flow between sections\n"
            "5. Check that the introduction hooks the reader\n"
            "6. Ensure the conclusion provides clear takeaways\n"
            "7. Verify all Markdown formatting is correct\n\n"
            "Rules:\n"
            "- Your edits make articles shorter and sharper, not longer\n"
            "- When you spot a vague claim, sharpen it or cut it\n"
            "- After editing, save the final article using the save_to_file tool\n"
            "- Use a descriptive filename based on the topic"
        ),
        tools=[SAVE_TO_FILE_TOOL],
        tool_functions={"save_to_file": save_to_file},
    )
```

## Agent Summary

| Agent | System Prompt Focus | Tools | Receives | Produces |
|-------|-------------------|-------|----------|----------|
| **Researcher** | Find reliable sources, structured notes | `web_search` | Topic | Research notes |
| **Writer** | Clear structure, engaging prose | None | Topic + notes | Article draft |
| **Editor** | Tighten, verify, save | `save_to_file` | Draft | Final article |

All three agents are instances of the same `Agent` class — they differ only in their system prompts and tools. This is the power of the pattern: the agent loop is generic, the specialization comes from configuration.

---

[← The Writer](06-the-writer.md) | [Next: Step 8 - Run the Pipeline →](08-run-the-pipeline.md)
