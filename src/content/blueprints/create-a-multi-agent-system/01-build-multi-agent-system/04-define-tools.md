# Step 4: Define Tools

One-Line Summary: Create custom tools — web search and file saving — that agents can invoke to interact with the real world.

Prerequisites: Steps 1-3 completed

---

## Why Agents Need Tools

Without tools, an agent can only work with what the LLM already knows. That means no current information, no file output, and no interaction with external systems. Tools bridge this gap.

In CrewAI, a tool is a Python function decorated with `@tool`. When an agent decides it needs information or wants to perform an action, it calls the appropriate tool automatically. You define the tools; CrewAI handles the plumbing.

## The Web Search Tool

Our Researcher agent needs to find current information. We will create a web search tool using DuckDuckGo (free, no API key required):

```bash
# Install the DuckDuckGo search library
pip install duckduckgo-search
```

Now open `tools.py` and add the search tool:

```python
# tools.py — Custom tools for agents

import os
import json
from datetime import datetime
from crewai.tools import tool
from duckduckgo_search import DDGS


@tool("web_search")
def web_search(query: str) -> str:
    """
    Search the web for information on a given query.
    Returns the top 5 results with titles, URLs, and snippets.
    Use this tool to find current information about any topic.
    """
    try:
        # Initialize DuckDuckGo search
        ddgs = DDGS()

        # Fetch the top 5 results
        results = list(ddgs.text(query, max_results=5))

        if not results:
            return f"No results found for: {query}"

        # Format results as a clean string
        formatted = []
        for i, result in enumerate(results, 1):
            formatted.append(
                f"[{i}] {result['title']}\n"
                f"    URL: {result['href']}\n"
                f"    {result['body']}\n"
            )

        return "\n".join(formatted)

    except Exception as e:
        return f"Search error: {str(e)}. Try a different query."
```

The docstring matters — CrewAI shows it to the agent so it knows when and how to use the tool. Write docstrings that describe what the tool does and when to use it.

## The Save-to-File Tool

Our Editor agent needs to save the final article. Add the file-saving tool to `tools.py`:

```python
@tool("save_to_file")
def save_to_file(filename: str, content: str) -> str:
    """
    Save content to a Markdown file in the output directory.
    Use this tool to save the final version of an article.
    The filename should end with .md (e.g., 'article.md').
    """
    # Ensure the output directory exists
    output_dir = os.path.join(os.path.dirname(__file__), "output")
    os.makedirs(output_dir, exist_ok=True)

    # Sanitize the filename
    if not filename.endswith(".md"):
        filename += ".md"

    # Remove any path separators to prevent directory traversal
    filename = filename.replace("/", "_").replace("\\", "_")

    # Write the file
    filepath = os.path.join(output_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    return f"Article saved successfully to: {filepath}"
```

## Test the Tools

Verify both tools work independently before wiring them to agents:

```python
# test_tools.py — Quick test of both tools

from tools import web_search, save_to_file

# Test web search
print("Testing web search...")
results = web_search.run("Python multi-agent frameworks 2024")
print(results[:500])
print()

# Test file saving
print("Testing file save...")
result = save_to_file.run(
    filename="test-article.md",
    content="# Test Article\n\nThis is a test."
)
print(result)
```

```bash
python test_tools.py
```

You should see search results printed and a confirmation that the file was saved to `output/test-article.md`. Clean up:

```bash
rm test_tools.py output/test-article.md
```

## How CrewAI Uses Tools

When you assign a tool to an agent, CrewAI:

1. **Describes the tool** to the LLM (name, parameters, docstring)
2. **Watches for tool calls** in the agent's response
3. **Executes the function** with the arguments the agent provided
4. **Returns the result** to the agent so it can continue reasoning

The agent decides when to use a tool based on its task. You do not need to explicitly tell it "use the search tool" — if the task requires information and the agent has access to a search tool, it will use it.

## Tool Summary

| Tool | Used By | Purpose |
|------|---------|---------|
| `web_search` | Researcher | Find current information on any topic |
| `save_to_file` | Editor | Save the final article as a Markdown file |

These are intentionally simple. In production, you might add tools for database queries, API calls, image generation, or anything else your agents need. The pattern is always the same: decorate a function with `@tool`, write a clear docstring, and assign it to an agent.

Next, we will build the first real agent in our pipeline — the Researcher.

---

[← Your First Agent](03-your-first-agent.md) | [Next: Step 5 - The Researcher →](05-the-researcher.md)
