# Designing Effective Tool Schemas

**One-Line Summary**: Well-designed tool schemas with descriptive names, clear descriptions, typed parameters, and sensible defaults are the single biggest factor in whether an LLM reliably selects and invokes the right tool.

**Prerequisites**: `the-skill-abstraction.md`, basic understanding of JSON Schema

## What Are Tool Schemas?

Imagine handing someone a TV remote with no labels on the buttons. They would press random buttons, get confused by unexpected results, and eventually give up. Now imagine a remote where every button is clearly labeled with what it does, and the most common buttons are bigger and easier to find. That is the difference between a bad tool schema and a good one. The schema is the label on the button — it is the only thing the LLM sees when deciding which tool to use and what inputs to provide.

A tool schema is a structured definition that tells the LLM three things: what the tool does (name and description), what inputs it expects (parameters with types and constraints), and what it returns. In practice, this takes the form of a JSON Schema object paired with a natural language description. The LLM never sees your implementation code — it makes every decision based solely on the schema. If the schema is vague, the LLM will guess. If it is clear, the LLM will perform reliably.

The principle behind effective schemas is simple: describe the tool as if you are explaining it to a competent intern on their first day. They are smart enough to use the tool correctly if you tell them clearly what it does, when to use it, and what inputs it needs. They will make mistakes if you leave things ambiguous. The LLM is that intern.

## How It Works

### The Five Elements of a Good Schema

Every effective tool schema nails these five elements:

**1. Descriptive Name**: The name should be a verb-noun pair that immediately communicates the action.

```python
# Bad: vague, ambiguous
"name": "search"          # Search what? Where?
"name": "process_data"    # What kind of processing?
"name": "helper"          # Meaningless

# Good: specific, action-oriented
"name": "search_web"              # Clearly searches the web
"name": "query_database"          # Queries a database
"name": "send_slack_message"      # Sends a Slack message
"name": "create_github_issue"     # Creates a GitHub issue
```

**2. Clear Description**: The description should explain what the tool does, when to use it, and any important constraints.

```python
# Bad: too brief, doesn't help with selection
{
    "name": "search_web",
    "description": "Searches the web."
}

# Good: explains purpose, use case, and behavior
{
    "name": "search_web",
    "description": "Search the web for current information using a search engine. "
    "Returns the top results with titles, URLs, and text snippets. "
    "Use this when you need up-to-date information that may not be in your training data. "
    "For best results, use specific keywords rather than full questions. "
    "Does NOT fetch full page content — use fetch_webpage for that."
}
```

The description serves double duty: it helps the LLM decide *when* to use the tool (selection) and *how* to use it (invocation). Include both.

**3. Typed Parameters with Descriptions**:

```json
{
    "name": "search_web",
    "description": "Search the web for current information...",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Search query. Use specific keywords, not full sentences. Example: 'Python 3.12 new features' rather than 'What are the new features in Python 3.12?'"
            },
            "num_results": {
                "type": "integer",
                "description": "Number of results to return. More results give broader coverage but take longer.",
                "minimum": 1,
                "maximum": 20,
                "default": 5
            },
            "time_range": {
                "type": "string",
                "description": "Filter results by recency.",
                "enum": ["day", "week", "month", "year", "all"],
                "default": "all"
            }
        },
        "required": ["query"]
    }
}
```

Every parameter gets a `description`. Optional parameters get `default` values. Numeric parameters get `minimum` and `maximum`. Enum parameters list valid options. This reduces the LLM's decision space and prevents invalid inputs.

**4. Sensible Defaults**: Defaults reduce the number of decisions the LLM needs to make per call:

```json
{
    "name": "read_file",
    "input_schema": {
        "type": "object",
        "properties": {
            "path": {
                "type": "string",
                "description": "Absolute path to the file to read."
            },
            "encoding": {
                "type": "string",
                "description": "File encoding.",
                "default": "utf-8"
            },
            "max_lines": {
                "type": "integer",
                "description": "Maximum number of lines to return. Use for large files.",
                "default": 1000
            }
        },
        "required": ["path"]
    }
}
```

The LLM only needs to specify `path`. Encoding and line limits have reasonable defaults that work in the common case.

**5. Examples in Descriptions**: For complex parameters, embed examples directly in the description:

```json
{
    "name": "query_database",
    "input_schema": {
        "type": "object",
        "properties": {
            "sql": {
                "type": "string",
                "description": "SQL SELECT query to execute. Only read-only queries are allowed. Examples: 'SELECT name, price FROM products WHERE category = \"electronics\" LIMIT 10' or 'SELECT COUNT(*) FROM orders WHERE date > \"2025-01-01\"'"
            }
        },
        "required": ["sql"]
    }
}
```

### A Complete Schema Example

Here is a production-quality schema for a GitHub issue creation tool:

```json
{
    "name": "create_github_issue",
    "description": "Create a new issue in a GitHub repository. Use this when you need to report a bug, request a feature, or track a task. The issue will be created under the authenticated user's account. Returns the issue URL and number on success.",
    "input_schema": {
        "type": "object",
        "properties": {
            "repo": {
                "type": "string",
                "description": "Repository in 'owner/repo' format. Example: 'anthropics/claude-sdk'"
            },
            "title": {
                "type": "string",
                "description": "Issue title. Keep it concise (under 100 characters) and descriptive.",
                "maxLength": 200
            },
            "body": {
                "type": "string",
                "description": "Issue body in GitHub-flavored Markdown. Include context, steps to reproduce (for bugs), or acceptance criteria (for features)."
            },
            "labels": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Labels to apply. Must be existing labels in the repo. Common labels: 'bug', 'enhancement', 'documentation'.",
                "default": []
            },
            "assignees": {
                "type": "array",
                "items": {"type": "string"},
                "description": "GitHub usernames to assign. Must be collaborators on the repo.",
                "default": []
            }
        },
        "required": ["repo", "title", "body"]
    }
}
```

### Anti-Patterns to Avoid

**Overloaded tools**: A tool that does too many things confuses the LLM.

```python
# Bad: one tool tries to do everything
{
    "name": "file_operations",
    "description": "Read, write, delete, copy, or move files.",
    "input_schema": {
        "properties": {
            "operation": {"enum": ["read", "write", "delete", "copy", "move"]},
            "path": {"type": "string"},
            "content": {"type": "string"},  # Only for write
            "destination": {"type": "string"},  # Only for copy/move
        }
    }
}

# Good: separate tools with clear purposes
# read_file, write_file, delete_file, copy_file, move_file
```

**Missing descriptions on parameters**: The LLM sees parameter names and descriptions. Without descriptions, it guesses based on the name alone.

**Inconsistent naming**: If one tool uses `file_path` and another uses `filepath` and a third uses `path`, the LLM has to learn three conventions. Pick one and stick with it across all tools.

## Why It Matters

### Schema Quality Directly Predicts Agent Reliability

In testing, improving tool descriptions from one-line summaries to detailed descriptions with examples improves tool selection accuracy from roughly 70% to over 95%. The schema is not documentation — it is part of the system's runtime behavior.

### Bad Schemas Cause Cascading Failures

When the LLM picks the wrong tool or provides bad inputs, the error propagates. The tool fails, the LLM tries to recover (often incorrectly), and the agent wastes iterations. One bad schema can turn a 3-step task into a 10-step failure. Getting schemas right upfront saves debugging time later.

## Key Technical Details

- Tool descriptions should be 2-5 sentences: enough to disambiguate from other tools
- Parameter descriptions should be 1-2 sentences plus examples for complex types
- The total token cost of tool schemas is sent with every LLM call — keep schemas concise but complete
- Claude supports up to ~128 tools per request, but accuracy degrades above 15-20
- `enum` types are strongly preferred over free-text for parameters with known valid values
- `required` fields should be the minimum set needed for the tool to function — prefer defaults for the rest
- Avoid nested object parameters when possible — flat schemas are easier for LLMs to populate

## Common Misconceptions

**"The LLM reads the implementation code"**: The LLM never sees your Python, JavaScript, or any implementation code. It sees only the schema: name, description, and input_schema. If your implementation handles edge cases that the schema doesn't mention, the LLM won't know about them. The schema is the complete interface.

**"Short descriptions are better because they save tokens"**: While token efficiency matters, description quality matters far more. A 50-token description that prevents a wrong tool selection saves thousands of tokens that would be wasted on error recovery. Invest tokens in descriptions — they have the highest ROI of any prompt engineering.

## Connections to Other Concepts

- `the-skill-abstraction.md` — Schemas are the external face of the skill abstraction
- `input-validation-and-type-safety.md` — What happens after the schema: runtime validation
- `output-contracts.md` — The other half of the contract: what the tool returns
- `anatomy-of-a-multi-skill-agent.md` — How schemas fit into the skill registry layer

## Further Reading

- Anthropic, "Tool Use Best Practices" (2024) — Official guidelines for writing Claude-compatible tool schemas
- JSON Schema Specification, "Understanding JSON Schema" (2024) — The underlying schema format
- OpenAI, "Function Calling Guide" (2024) — Similar principles for OpenAI's function calling format
- Stripe, "Designing APIs for Humans" (2023) — API design principles that apply directly to tool schema design
