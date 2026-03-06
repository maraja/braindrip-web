# Tool Schemas and Validation

**One-Line Summary**: Pydantic `BaseModel` with `Field()` descriptors lets you define rich, validated input schemas for LangChain tools, giving LLMs detailed JSON Schema instructions for correct parameter generation.

**Prerequisites**: `langchain-tool-decorator.md`, basic Pydantic knowledge (BaseModel, Field).

## What Are Tool Schemas?

Imagine ordering food through a form instead of shouting at a counter. The form has labeled fields, dropdown menus with valid options, and character limits — it constrains what you can submit so the kitchen gets a valid order every time. Pydantic schemas serve the same role for LLM tool calls: they define exactly what inputs are acceptable, with descriptions that guide the model and constraints that reject malformed arguments.

When you use the `@tool` decorator alone, LangChain infers a basic schema from type hints. But for tools with complex inputs — optional fields, value ranges, enumerations, or nested objects — you need explicit Pydantic models. These models are converted to JSON Schema, which the LLM sees as part of its system prompt, making precise descriptions and constraints directly influence how well the model fills in parameters.

The key insight is that every `Field(description=...)` you write is a mini-prompt to the LLM. Better field descriptions lead to more accurate tool invocations, fewer retries, and more reliable agents.

## How It Works

### Defining a Schema with Pydantic

```python
from pydantic import BaseModel, Field
from langchain_core.tools import tool

class SearchInput(BaseModel):
    query: str = Field(description="The search query string")
    max_results: int = Field(
        default=5,
        ge=1,
        le=20,
        description="Number of results to return (1-20)"
    )
    language: str = Field(
        default="en",
        description="ISO 639-1 language code, e.g. 'en', 'es', 'fr'"
    )

@tool(args_schema=SearchInput)
def web_search(query: str, max_results: int = 5, language: str = "en") -> str:
    """Search the web for information on a given topic."""
    return f"Results for '{query}' (top {max_results}, lang={language})"
```

### What the LLM Sees

The Pydantic model is serialized to JSON Schema and included in the model's tool definition:

```json
{
  "name": "web_search",
  "description": "Search the web for information on a given topic.",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {"type": "string", "description": "The search query string"},
      "max_results": {"type": "integer", "description": "Number of results to return (1-20)", "default": 5, "minimum": 1, "maximum": 20},
      "language": {"type": "string", "description": "ISO 639-1 language code, e.g. 'en', 'es', 'fr'", "default": "en"}
    },
    "required": ["query"]
  }
}
```

### Nested and Complex Schemas

```python
from typing import Optional
from pydantic import BaseModel, Field

class DateRange(BaseModel):
    start_date: str = Field(description="Start date in YYYY-MM-DD format")
    end_date: Optional[str] = Field(
        default=None,
        description="End date in YYYY-MM-DD format. Omit for single-day queries."
    )

class EventSearchInput(BaseModel):
    keyword: str = Field(description="Event name or keyword to search for")
    date_range: DateRange = Field(description="The date range to search within")
    category: str = Field(
        default="all",
        description="Event category: 'music', 'sports', 'tech', or 'all'"
    )
```

### Validation in Action

```python
try:
    SearchInput(query="AI news", max_results=50)  # exceeds le=20
except Exception as e:
    print(e)  # ValidationError: max_results must be <= 20
```

Pydantic validates inputs before the tool function executes, catching invalid LLM outputs early.

## Why It Matters

1. **Precision over guessing** — field descriptions act as micro-prompts, steering the LLM toward correct parameter values.
2. **Input validation** — constraints like `ge`, `le`, and `max_length` reject bad inputs before they reach your tool logic.
3. **Default handling** — optional fields with defaults mean the LLM does not need to guess values for every parameter.
4. **Self-documenting APIs** — the schema doubles as documentation for both the LLM and human developers.
5. **Reduced agent failures** — validated inputs mean fewer runtime errors and retry loops inside agents.

## Key Technical Details

- Pass the schema via `@tool(args_schema=MyModel)` to override auto-generated schemas.
- Every `Field(description=...)` value is visible to the LLM in the JSON Schema.
- Constraints such as `ge`, `le`, `min_length`, `max_length`, and `pattern` map to JSON Schema validation keywords.
- Fields with defaults become optional in the schema; fields without defaults are required.
- Nested Pydantic models produce nested JSON Schema objects.
- `Optional[T]` with `default=None` marks a field as nullable and optional.
- Pydantic v2 is the standard in current LangChain; avoid mixing v1 and v2 syntax.

## Common Misconceptions

- **"Field descriptions are optional nice-to-haves."** They are the primary way the LLM understands what each parameter means. Missing descriptions lead to hallucinated or incorrect values.
- **"Pydantic validation runs inside the LLM."** Validation runs on the Python side after the LLM generates arguments. The LLM only sees the JSON Schema representation.
- **"You always need a Pydantic schema for every tool."** Simple tools with one or two clearly-named parameters and good docstrings work fine with auto-generated schemas.
- **"Constraints guarantee the LLM will never violate them."** Constraints validate after generation. The LLM may still produce out-of-range values, which Pydantic then rejects, triggering a retry or error.

## Connections to Other Concepts

- `langchain-tool-decorator.md` — the `@tool` decorator that accepts `args_schema` as a parameter.
- `binding-tools-to-models.md` — schemas are serialized when tools are bound to models via `bind_tools()`.
- `tool-node.md` — `ToolNode` passes validated arguments to the tool function during execution.
- `community-tools.md` — many community tools define their own Pydantic schemas internally.

## Further Reading

- [Pydantic Field Documentation](https://docs.pydantic.dev/latest/concepts/fields/)
- [LangChain: Tool Input Schemas](https://python.langchain.com/docs/how_to/custom_tools/#tool-input-schema)
- [JSON Schema Specification](https://json-schema.org/understanding-json-schema/)
