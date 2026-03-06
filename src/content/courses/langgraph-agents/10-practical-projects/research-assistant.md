# Research Assistant Agent

**One-Line Summary**: A multi-tool research agent that searches the web, synthesizes findings, and produces structured reports using `create_react_agent` with memory for iterative, multi-turn research sessions.

**Prerequisites**: `prebuilt-react-agent.md`, `langchain-tool-decorator.md`, `checkpointers.md`, `stream-modes.md`, `thread-based-memory.md`

## What Is the Research Assistant Agent?

This project builds an end-to-end research agent that takes a question, searches the web for relevant sources, summarizes key findings, and formats a structured report. It demonstrates how `create_react_agent` can handle a real workflow when given the right combination of tools -- search for discovery, summarization for distillation, and formatting for output.

The agent uses Tavily search to find current information, a summarize tool to condense long content into key points, and a report formatter that structures everything into a clean markdown report. Because it is backed by a checkpointer, the agent remembers prior research across turns, so a user can ask follow-up questions like "dig deeper into point 3" without losing context.

This is the simplest practical project in this category. It uses the prebuilt agent with no custom graph construction, showing how far tool composition alone can take you before you need manual graph building.

## How It Works

### Architecture Overview

The agent follows a straightforward ReAct loop: the LLM reasons about what information it needs, calls the search tool, reads the results, optionally summarizes them, and then either searches again or formats a final report. The checkpointer enables follow-up turns that build on prior research.

### Step 1: Define Tools

```python
from langchain_core.tools import tool
from tavily import TavilyClient

tavily = TavilyClient()

@tool
def web_search(query: str) -> str:
    """Search the web for current information on a topic."""
    results = tavily.search(query=query, max_results=5)
    formatted = []
    for r in results["results"]:
        formatted.append(f"**{r['title']}**\n{r['url']}\n{r['content'][:500]}")
    return "\n\n---\n\n".join(formatted)

@tool
def summarize(text: str, focus: str) -> str:
    """Summarize a block of text, focusing on a specific aspect."""
    from langchain_anthropic import ChatAnthropic
    llm = ChatAnthropic(model="claude-sonnet-4-5-20250929")
    response = llm.invoke(
        f"Summarize the following text, focusing on: {focus}\n\n{text}"
    )
    return response.content

@tool
def format_report(title: str, sections: str) -> str:
    """Format research findings into a structured markdown report.
    sections should be a pipe-separated list of 'heading:content' pairs.
    """
    parts = [f"# {title}\n"]
    for section in sections.split("|"):
        heading, content = section.split(":", 1)
        parts.append(f"## {heading.strip()}\n{content.strip()}\n")
    return "\n".join(parts)
```

### Step 2: Build the Agent

```python
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_anthropic import ChatAnthropic

model = ChatAnthropic(model="claude-sonnet-4-5-20250929")

agent = create_react_agent(
    model=model,
    tools=[web_search, summarize, format_report],
    prompt=(
        "You are a research assistant. When given a question, search for "
        "information, summarize key findings, then produce a structured "
        "report using the format_report tool. Always cite your sources."
    ),
    checkpointer=MemorySaver(),
)
```

### Step 3: Run and Test

```python
config = {"configurable": {"thread_id": "research-session-1"}}

# Initial research question
result = agent.invoke(
    {"messages": [{"role": "user", "content": "What are the latest advances in quantum computing in 2025?"}]},
    config=config,
)
print(result["messages"][-1].content)

# Follow-up question -- agent remembers prior research
result = agent.invoke(
    {"messages": [{"role": "user", "content": "Go deeper on error correction breakthroughs you found."}]},
    config=config,
)
print(result["messages"][-1].content)

# Stream for real-time progress
for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "Compare IBM and Google approaches."}]},
    config=config,
    stream_mode="updates",
):
    node_name = list(chunk.keys())[0]
    print(f"[{node_name}] processing...")
```

## Why It Matters

1. **Tool composition** -- shows how multiple tools work together in a single agent loop, with the LLM deciding when and how to combine them.
2. **Memory-driven iteration** -- the checkpointer enables multi-turn research sessions where each turn builds on prior findings, a pattern critical for real-world assistants.
3. **Streaming feedback** -- demonstrates `stream_mode="updates"` to give users real-time visibility into which tools the agent is invoking during long research tasks.
4. **Minimal scaffolding** -- proves that `create_react_agent` can power a useful application without any custom graph code.

## Key Technical Details

- Tavily is used here but any search API (SerpAPI, Brave, Bing) works as a drop-in replacement via the `@tool` decorator.
- The summarize tool delegates to a second LLM call; this is a common pattern for expensive sub-operations within tools.
- `format_report` uses a string-based interface because tool arguments must be JSON-serializable primitives.
- The checkpointer stores the full message history, so follow-up questions have access to all prior search results and summaries.
- Streaming with `stream_mode="updates"` emits state diffs after each node, showing tool calls in real time.
- The `thread_id` acts as a session key; different threads represent independent research sessions.
- For production use, swap `MemorySaver` for `PostgresSaver` to persist across restarts.

## Common Misconceptions

- **"The agent always calls every tool on every turn."** The LLM decides which tools to call based on the question. Simple follow-ups may skip searching entirely and use prior context.
- **"You need a custom graph for multi-tool agents."** The prebuilt `create_react_agent` handles multi-tool orchestration automatically via the ReAct loop.
- **"Memory means the agent remembers across all users."** Memory is scoped to a `thread_id`. Different threads are completely independent sessions.

## Connections to Other Concepts

- `../03-building-your-first-agent/prebuilt-react-agent.md` -- the foundation this project builds on.
- `../02-tools-and-models/langchain-tool-decorator.md` -- how each research tool is defined and exposed to the agent.
- `../04-memory-and-persistence/checkpointers.md` -- enables the multi-turn research sessions.
- `../04-memory-and-persistence/thread-based-memory.md` -- how `thread_id` scopes conversations.
- `../06-streaming/stream-modes.md` -- the streaming approach used for real-time research progress.
- `customer-support-agent.md` -- a more complex project that uses a manual graph instead of the prebuilt agent.

## Further Reading

- [LangGraph Prebuilt Agent Docs](https://langchain-ai.github.io/langgraph/how-tos/create-react-agent/)
- [Tavily Search API](https://docs.tavily.com/)
- [LangGraph Streaming Guide](https://langchain-ai.github.io/langgraph/how-tos/streaming-tokens/)
- [Building a Research Agent (LangChain Blog)](https://blog.langchain.dev/building-a-research-agent/)
