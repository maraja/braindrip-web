# Community Tools

**One-Line Summary**: The LangChain ecosystem provides a rich library of pre-built tools — from web search to code execution — available through `langchain-community` and partner packages, so you can equip agents with real-world capabilities without writing tool logic from scratch.

**Prerequisites**: `langchain-tool-decorator.md`, `binding-tools-to-models.md`, `tool-node.md`.

## What Are Community Tools?

Building every tool from scratch is like insisting on growing your own wheat before making a sandwich. The LangChain community has already built and packaged dozens of tools for common tasks — searching the web, querying Wikipedia, running Python code, calling REST APIs, and more. These tools follow the same `BaseTool` interface as your custom `@tool`-decorated functions, meaning they plug directly into `bind_tools()` and `ToolNode` with zero adaptation.

The ecosystem is split across several packages. Core integrations live in `langchain-community`, while more experimental or specialized tools are in `langchain-experimental`. Some high-quality integrations have their own dedicated packages, like `langchain-tavily` for web search. The consistent interface means you can mix community tools and custom tools freely within the same agent.

The most popular starting point is web search — specifically Tavily, which was designed for LLM consumption and returns clean, structured results rather than raw HTML. Adding a single search tool transforms a knowledge-limited LLM into a web-aware research assistant.

## How It Works

### Tavily Web Search

```python
import os
from langchain_tavily import TavilySearchResults

os.environ["TAVILY_API_KEY"] = "tvly-your-api-key-here"

search_tool = TavilySearchResults(
    max_results=3,
    search_depth="basic",  # or "advanced" for deeper results
)

results = search_tool.invoke({"query": "latest AI research 2025"})
```

Tavily returns structured results with `url`, `content`, and `title` fields, making them easy for the LLM to parse and cite.

### Wikipedia Search

```python
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper

wiki_tool = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper(
    top_k_results=2,
    doc_content_chars_max=2000,
))

result = wiki_tool.invoke("Large Language Models")
```

### Python REPL for Code Execution

```python
from langchain_experimental.tools import PythonREPLTool

python_tool = PythonREPLTool()

result = python_tool.invoke("print(sum(range(1, 101)))")
# Output: "5050\n"
```

**Warning**: `PythonREPLTool` executes arbitrary code. Use it only in sandboxed environments.

### Combining Community and Custom Tools

```python
from langchain_core.tools import tool
from langchain_tavily import TavilySearchResults
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import ToolNode

@tool
def calculate(expression: str) -> str:
    """Evaluate a math expression safely."""
    allowed = set("0123456789+-*/.() ")
    if all(c in allowed for c in expression):
        return str(eval(expression))
    return "Invalid expression"

tools = [
    TavilySearchResults(max_results=3),
    calculate,
]

llm = ChatOpenAI(model="gpt-4o").bind_tools(tools)
tool_node = ToolNode(tools)
```

### HTTP Requests Tool

```python
from langchain_community.tools import RequestsGetTool
from langchain_community.utilities import TextRequestsWrapper

requests_tool = RequestsGetTool(
    requests_wrapper=TextRequestsWrapper(),
    allow_dangerous_requests=True,
)
```

## Why It Matters

1. **Rapid capability expansion** — add web search, code execution, or API access to an agent in minutes rather than hours.
2. **Battle-tested implementations** — community tools handle edge cases, rate limiting, and error handling that you would otherwise build yourself.
3. **Consistent interface** — all tools implement `BaseTool`, so they work with `bind_tools()`, `ToolNode`, and every agent framework.
4. **Composability** — mix any number of community and custom tools in the same agent.
5. **Growing ecosystem** — new tools and integrations are added regularly by both LangChain maintainers and the open-source community.

## Key Technical Details

- Install community tools via `pip install langchain-community` or specific packages like `pip install langchain-tavily`.
- Tavily requires an API key set as `TAVILY_API_KEY` environment variable; free tier available at tavily.com.
- `PythonREPLTool` lives in `langchain-experimental` due to its security implications.
- `RequestsGetTool` requires `allow_dangerous_requests=True` as a safety acknowledgment.
- Community tools expose `.name`, `.description`, and `.args_schema` just like `@tool`-decorated functions.
- Some tools accept configuration via their constructor (e.g., `max_results`, `search_depth`).
- All community tools can be used synchronously or within async LangGraph workflows.

## Common Misconceptions

- **"Community tools require a different API than custom tools."** They implement the same `BaseTool` interface and are used identically with `bind_tools()` and `ToolNode`.
- **"Tavily is the only search option."** Other search tools exist (DuckDuckGo, Google Search, Bing), but Tavily is optimized for LLM-friendly output.
- **"PythonREPLTool is safe to use in production."** It executes arbitrary code with full system access. Always sandbox it or use alternatives like a Docker-based executor.
- **"You need langchain-community for all third-party tools."** Many popular integrations now have dedicated packages (e.g., `langchain-tavily`, `langchain-google-community`).

## Connections to Other Concepts

- `langchain-tool-decorator.md` — community tools follow the same interface as `@tool`-decorated functions.
- `binding-tools-to-models.md` — community tools are passed to `bind_tools()` just like custom tools.
- `tool-node.md` — `ToolNode` executes community tools alongside custom tools.
- `tool-schemas-and-validation.md` — community tools define their own Pydantic schemas internally.

## Further Reading

- [LangChain Tools Integration Directory](https://python.langchain.com/docs/integrations/tools/)
- [Tavily API Documentation](https://docs.tavily.com/)
- [langchain-community Package on PyPI](https://pypi.org/project/langchain-community/)
- [LangChain Experimental Tools](https://python.langchain.com/docs/integrations/tools/python/)
