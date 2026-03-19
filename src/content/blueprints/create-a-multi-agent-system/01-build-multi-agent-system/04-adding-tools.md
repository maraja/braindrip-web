# Step 4: Adding Tools

One-Line Summary: Create web search and file-saving tools as plain Python functions, then define their schemas so Claude knows how to call them.

Prerequisites: Steps 1-3 completed

---

## Why Agents Need Tools

Without tools, an agent can only work with what the LLM already knows. Tools give agents real-world capabilities — searching the web, saving files, querying databases, calling APIs. In our pipeline, the Researcher needs web search and the Editor needs file saving.

With the Anthropic SDK, tools are:

1. **A Python function** that does the work
2. **A JSON schema** that tells Claude the function's name, description, and parameters

Claude reads the schema, decides when to call the tool, and provides the arguments. Our Agent class executes the function and returns the result.

## The Web Search Tool

```python
# tools.py — Tool functions and their schemas

import os
from duckduckgo_search import DDGS


def web_search(query: str) -> str:
    """Search the web and return the top 5 results."""
    try:
        ddgs = DDGS()
        results = list(ddgs.text(query, max_results=5))

        if not results:
            return f"No results found for: {query}"

        formatted = []
        for i, r in enumerate(results, 1):
            formatted.append(
                f"[{i}] {r['title']}\n"
                f"    URL: {r['href']}\n"
                f"    {r['body']}\n"
            )
        return "\n".join(formatted)

    except Exception as e:
        return f"Search error: {str(e)}. Try a different query."


# Schema that tells Claude how to call this function
WEB_SEARCH_TOOL = {
    "name": "web_search",
    "description": (
        "Search the web for information on a given query. "
        "Returns the top 5 results with titles, URLs, and snippets. "
        "Use this to find current information about any topic."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query",
            }
        },
        "required": ["query"],
    },
}
```

## The Save-to-File Tool

```python
# Add to tools.py

def save_to_file(filename: str, content: str) -> str:
    """Save content to a Markdown file in the output directory."""
    output_dir = os.path.join(os.path.dirname(__file__), "output")
    os.makedirs(output_dir, exist_ok=True)

    if not filename.endswith(".md"):
        filename += ".md"

    # Prevent directory traversal
    filename = filename.replace("/", "_").replace("\\", "_")

    filepath = os.path.join(output_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    return f"Article saved to: {filepath}"


SAVE_TO_FILE_TOOL = {
    "name": "save_to_file",
    "description": (
        "Save content to a Markdown file in the output directory. "
        "Use this to save the final version of an article. "
        "The filename should be descriptive (e.g., 'quantum-computing.md')."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "filename": {
                "type": "string",
                "description": "The filename (e.g., 'article-title.md')",
            },
            "content": {
                "type": "string",
                "description": "The Markdown content to save",
            },
        },
        "required": ["filename", "content"],
    },
}
```

## How Tool Schemas Work

The schema is how Claude understands your tool. When you pass tools to the API, Claude sees:

- **name** — what to call the tool
- **description** — when and why to use it (this is the most important part)
- **input_schema** — what arguments it accepts

Write descriptions that explain the tool's purpose clearly. Claude uses the description to decide whether and when to call the tool.

## Test the Tools

```python
# test_tools.py — Verify both tools work

from tools import web_search, save_to_file

# Test web search
print("Testing web search...")
results = web_search("Python multi-agent systems")
print(results[:500])
print()

# Test file save
print("Testing file save...")
result = save_to_file("test-article.md", "# Test\n\nThis is a test.")
print(result)
```

```bash
python test_tools.py
```

You should see search results and a file saved confirmation. Clean up:

```bash
rm test_tools.py output/test-article.md
```

## Tool Summary

| Tool | Used By | Purpose | API Key Required? |
|------|---------|---------|-------------------|
| `web_search` | Researcher | Find current information | No (DuckDuckGo is free) |
| `save_to_file` | Editor | Save the final article | No |

Both tools are plain Python functions. No decorators, no framework classes, no special registration. Any function that takes arguments and returns a string can be a tool.

---

[← Build the Agent Class](03-build-the-agent-class.md) | [Next: Step 5 - The Researcher →](05-the-researcher.md)
