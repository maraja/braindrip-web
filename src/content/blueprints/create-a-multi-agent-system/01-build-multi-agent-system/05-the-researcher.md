# Step 5: The Researcher

One-Line Summary: Build the Researcher agent — the first in our pipeline — that searches the web and compiles structured research notes on any topic.

Prerequisites: Steps 1-4 completed, Agent class and tools defined

---

## The Researcher's Job

Given a topic, the Researcher:

1. Searches the web for relevant, current information
2. Identifies key themes, facts, and data points
3. Compiles everything into structured research notes
4. Passes those notes to the Writer agent

A good Researcher produces organized, factual notes — not prose. The Writer handles the writing.

## Define the Researcher

Open `agents.py` and create the Researcher:

```python
# agents.py — Define the three specialized agents

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
```

## System Prompt Engineering

Notice how specific the system prompt is. Compare:

**Vague:** "You are a researcher who finds information."

**Specific:** "You are a veteran research analyst with 15 years of experience... You never fabricate information... Your research notes are thorough but concise."

The specific prompt produces measurably better output because it:

- Sets a quality standard ("thorough but concise")
- Establishes behavioral guardrails ("never fabricate")
- Defines the output format ("bullet-point format")
- Gives a concrete process to follow (numbered steps)

## Test the Researcher

```python
# test_researcher.py — Run the Researcher standalone

from agents import create_researcher

researcher = create_researcher()
notes = researcher.run(
    "Research the current state of quantum computing. "
    "Find key developments, major players, and recent breakthroughs."
)

print("\n" + "=" * 60)
print("RESEARCH NOTES:")
print("=" * 60)
print(notes)
```

```bash
python test_researcher.py
```

Watch the output. You will see the Researcher make multiple search calls, refine its queries based on results, and compile structured notes. This iterative search-and-synthesize behavior is the agent loop in action.

The output should be organized research notes with:

- Key themes and main points
- Specific facts and statistics with source references
- Recent developments and trends
- Different perspectives where relevant

Clean up:

```bash
rm test_researcher.py
```

---

[← Adding Tools](04-adding-tools.md) | [Next: Step 6 - The Writer →](06-the-writer.md)
