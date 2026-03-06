# LangChain @tool Decorator

**One-Line Summary**: The `@tool` decorator from `langchain_core.tools` transforms ordinary Python functions into structured, LLM-callable tools by extracting names, docstrings, and type hints automatically.

**Prerequisites**: Basic Python (decorators, type hints, docstrings), familiarity with LLM function calling concepts.

## What Is the @tool Decorator?

Think of the `@tool` decorator as a translator badge you pin onto a Python function. Without it, your function is just code that Python can run. With it, the function gains a machine-readable "name tag" that tells an LLM what it does, what inputs it expects, and what it returns — much like how a restaurant menu describes each dish so a customer can order without entering the kitchen.

The decorator inspects three things automatically: the function's name (becomes the tool name), the docstring (becomes the description the LLM reads to decide when to use the tool), and the type hints on parameters (become the JSON schema that validates inputs). This means the docstring is not just documentation for humans — it is the primary instruction the LLM uses to decide whether and how to invoke your tool.

Because LLMs choose tools based on natural language understanding of the description, a vague or missing docstring leads to incorrect or missed tool calls. Writing a clear, specific docstring is one of the highest-leverage things you can do when building agents.

## How It Works

### Basic Usage

```python
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multiply two numbers together.

    Args:
        a: First integer
        b: Second integer
    """
    return a * b
```

After decoration, `multiply` is no longer a plain function — it is a `StructuredTool` instance with `.name`, `.description`, and `.args_schema` attributes.

### Inspecting the Generated Tool

```python
print(multiply.name)          # "multiply"
print(multiply.description)   # "Multiply two numbers together."
print(multiply.args_schema.schema())
# {'properties': {'a': {'title': 'A', 'type': 'integer'},
#                 'b': {'title': 'B', 'type': 'integer'}},
#  'required': ['a', 'b'], 'title': 'multiplySchema', 'type': 'object'}
```

### Customizing Tool Name and Return Behavior

```python
@tool("calculator_multiply", return_direct=True)
def multiply_v2(a: int, b: int) -> int:
    """Multiply two integers and return the product directly to the user."""
    return a * b
```

Setting `return_direct=True` tells the agent to return the tool's output straight to the user without further LLM processing.

### Async Tool Support

```python
@tool
async def fetch_weather(city: str) -> str:
    """Get the current weather for a given city name."""
    # async HTTP call would go here
    return f"Sunny in {city}"
```

Async tools are essential for I/O-bound operations inside agents that run in async event loops.

## Why It Matters

1. **Eliminates boilerplate** — you do not need to manually define JSON schemas or register tools; the decorator handles it.
2. **Docstring-driven LLM behavior** — the quality of your docstring directly controls how accurately the LLM selects and parameterizes the tool.
3. **Type safety** — type hints are converted into JSON Schema constraints, reducing malformed inputs from the LLM.
4. **Composability** — decorated tools plug directly into `bind_tools()`, `ToolNode`, and agent frameworks without adaptation.
5. **Rapid prototyping** — turn any existing utility function into an agent-ready tool with a single line.

## Key Technical Details

- The decorator produces a `StructuredTool` instance, not a raw function.
- The function's docstring is parsed in Google-style format; `Args:` sections become per-parameter descriptions in the schema.
- If no docstring is provided, the LLM receives an empty description and will likely misuse or ignore the tool.
- Type hints are required for proper schema generation; missing hints default to `string`.
- `return_direct=True` skips the LLM's post-processing step after tool execution.
- You can override the auto-generated schema by passing `args_schema=MyPydanticModel`.
- The tool name defaults to the function name but can be overridden with `@tool("custom_name")`.
- Tools can be synchronous or asynchronous; both variants are supported.

## Common Misconceptions

- **"The docstring is just for developers reading the code."** In LangChain tools, the docstring is the description sent to the LLM. It is the primary mechanism by which the model decides when to call the tool.
- **"The @tool decorator executes the function immediately."** It does not. It wraps the function in a `StructuredTool` object. Execution only happens when an agent or `ToolNode` invokes it.
- **"You need to write JSON Schema by hand for each tool."** The decorator generates the schema automatically from type hints and docstring. Manual schemas are optional.
- **"Any Python function works without type hints."** Functions without type hints produce incomplete schemas, leading to unreliable LLM parameter generation.

## Connections to Other Concepts

- `tool-schemas-and-validation.md` — for complex inputs, use Pydantic models instead of relying on auto-generated schemas.
- `binding-tools-to-models.md` — after creating tools, bind them to an LLM with `bind_tools()`.
- `tool-node.md` — `ToolNode` executes decorated tools inside a LangGraph workflow.
- `community-tools.md` — pre-built tools that follow the same interface as `@tool`-decorated functions.

## Further Reading

- [LangChain Tools Documentation](https://python.langchain.com/docs/concepts/tools/)
- [LangChain How-To: Create Custom Tools](https://python.langchain.com/docs/how_to/custom_tools/)
- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [Python Type Hints (PEP 484)](https://peps.python.org/pep-0484/)
