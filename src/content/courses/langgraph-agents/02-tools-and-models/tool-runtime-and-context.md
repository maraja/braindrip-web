# Tool Runtime and Context

**One-Line Summary**: `ToolRuntime` is a special parameter type that gives tools access to runtime context, long-term memory (store), and user-specific data -- enabling tools to read and write persistent state without polluting the LLM's tool schema.

**Prerequisites**: `langchain-tool-decorator.md`, `tool-node.md`, `long-term-memory-store.md`

## What Is Tool Runtime?

Think of a hotel concierge. When a guest asks for restaurant recommendations, the concierge does not just look up restaurants -- they check the guest's profile for dietary preferences, note which restaurants they have already visited, and consider their loyalty tier. The guest did not have to say "I'm a vegetarian platinum member" in their request; the concierge had access to that context behind the scenes.

`ToolRuntime` works the same way for LangGraph tools. It is a special parameter that is invisible to the LLM (it never appears in the tool's JSON schema) but gives the tool function access to three things at execution time: the runtime **context** (user-specific data like user IDs or API keys), the **store** (long-term memory that persists across conversations), and the **config** (runtime configuration). This means your tools can be personalized, stateful, and context-aware without burdening the LLM with implementation details.

This pattern is called dependency injection -- the framework "injects" runtime resources into your tool function automatically, without the caller (the LLM) needing to know about or provide them.

## How It Works

### Basic ToolRuntime Usage

```python
from dataclasses import dataclass
from langchain.tools import tool, ToolRuntime
from langchain.agents import create_agent
from langgraph.store.memory import InMemoryStore

@dataclass
class Context:
    user_id: str

@tool
def get_user_info(runtime: ToolRuntime[Context]) -> str:
    """Look up the current user's profile information."""
    store = runtime.store
    user_id = runtime.context.user_id
    user_info = store.get(("users",), user_id)
    return str(user_info.value) if user_info else "Unknown user"

store = InMemoryStore()
store.put(("users",), "user_123", {"name": "Alice", "language": "English"})

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[get_user_info],
    store=store,
    context_schema=Context,
)

# The context is passed at invocation time, not at tool definition time
result = agent.invoke(
    {"messages": [{"role": "user", "content": "Look up my profile"}]},
    context=Context(user_id="user_123"),
)
```

### Writing to the Store

```python
from typing import Any
from typing_extensions import TypedDict

class UserInfo(TypedDict):
    name: str
    email: str

@tool
def save_user_info(user_info: UserInfo, runtime: ToolRuntime[Context]) -> str:
    """Save or update the current user's profile information."""
    store = runtime.store
    user_id = runtime.context.user_id
    store.put(("users",), user_id, user_info)
    return "Successfully saved user info."
```

### Mixing Regular Parameters with Runtime

```python
@tool
def search_user_documents(query: str, runtime: ToolRuntime[Context]) -> str:
    """Search the current user's documents for relevant information.

    Args:
        query: The search query to find relevant documents.
    """
    user_id = runtime.context.user_id
    store = runtime.store

    # Only the 'query' parameter appears in the tool schema for the LLM
    # The LLM never sees or provides the runtime parameter
    docs = store.get(("documents", user_id), query)
    return str(docs.value) if docs else "No documents found."
```

### Context with Multiple Fields

```python
@dataclass
class AppContext:
    user_id: str
    api_key: str
    organization_id: str

@tool
def call_external_api(endpoint: str, runtime: ToolRuntime[AppContext]) -> str:
    """Call an external API endpoint on behalf of the user.

    Args:
        endpoint: The API endpoint to call.
    """
    # Access all context fields
    api_key = runtime.context.api_key
    org_id = runtime.context.organization_id
    # Use for authenticated API calls
    return f"Called {endpoint} for org {org_id}"

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[call_external_api],
    context_schema=AppContext,
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "Fetch the latest report"}]},
    context=AppContext(user_id="u1", api_key="sk-...", organization_id="org-42"),
)
```

### Streaming Progress from Tools

Tools can emit real-time updates to the client using `get_stream_writer`:

```python
from langchain.tools import tool
from langgraph.config import get_stream_writer

@tool
def query_database(query: str) -> str:
    """Query the database and return results.

    Args:
        query: The SQL query to execute.
    """
    writer = get_stream_writer()
    writer({"data": "Retrieved 0/100 records", "type": "progress"})
    # ... perform query ...
    writer({"data": "Retrieved 100/100 records", "type": "progress"})
    return "query results here"

# Client receives progress events via stream_mode="custom"
for chunk in graph.stream(inputs, stream_mode="custom"):
    print(chunk)
```

### Tool Artifacts (Rich Return Values)

Tools can return both content for the model and structured artifacts for downstream programmatic use:

```python
@tool(response_format="content_and_artifact")
def retrieve_context(query: str):
    """Retrieve information to help answer a query.

    Args:
        query: The search query.
    """
    docs = vector_store.similarity_search(query, k=2)
    serialized = "\n\n".join(f"Source: {d.metadata}\nContent: {d.page_content}" for d in docs)
    return serialized, docs  # (content_for_model, artifact_not_sent_to_model)
```

## Why It Matters

1. **Clean tool schemas** -- the LLM only sees parameters it needs to provide (like `query`), not infrastructure details (like `user_id` or `store`). This reduces confusion and improves tool call accuracy.
2. **Personalized tools** -- tools can behave differently per user without the LLM needing to know about user profiles, preferences, or permissions.
3. **Persistent memory in tools** -- tools can read from and write to the store, enabling agents to build up knowledge across conversations.
4. **Secure credential passing** -- API keys and tokens are injected via context at invocation time, never exposed to the LLM or hardcoded in tool definitions.
5. **Separation of concerns** -- tool logic focuses on what the tool does; infrastructure wiring is handled by the framework.

## Key Technical Details

- `ToolRuntime` is imported from `langchain.tools` and is a generic type parameterized by your context dataclass.
- The `runtime` parameter is automatically excluded from the tool's JSON schema -- the LLM never sees it.
- `runtime.store` gives access to the same store instance passed to `create_agent()`.
- `runtime.context` gives access to the context object passed at `agent.invoke()` time.
- The context schema must be a `dataclass` and is specified via `context_schema=` when creating the agent.
- `InMemoryStore` is for development; use a database-backed store (e.g., PostgreSQL-backed) in production.
- Store operations use a namespace tuple (e.g., `("users",)`) and a key string for organizing data.
- Multiple tools in the same agent share the same store and context instance during a single invocation.

## Common Misconceptions

- **"The LLM needs to provide the user_id to the tool."** No. `ToolRuntime` injects context automatically. The LLM only provides parameters that appear in the tool's schema.
- **"ToolRuntime is the same as passing config to the graph."** Config is graph-level configuration (like `thread_id`). ToolRuntime provides tool-specific access to context, store, and runtime resources.
- **"The store is scoped to a single thread."** The store is independent of threads. Data written via `store.put()` is accessible from any thread, any tool, any invocation. Namespaces control data organization.
- **"You must use ToolRuntime to access the store."** ToolRuntime is the standard pattern for tools. Graph nodes can access the store directly through the config object.

## Connections to Other Concepts

- `langchain-tool-decorator.md` -- `@tool` is used together with `ToolRuntime` to create context-aware tools
- `long-term-memory-store.md` -- the store that `runtime.store` accesses for cross-thread persistent memory
- `tool-node.md` -- `ToolNode` handles the injection of runtime resources when executing tools
- `tool-schemas-and-validation.md` -- ToolRuntime parameters are excluded from the schema seen by the LLM
- `binding-tools-to-models.md` -- tools with ToolRuntime bind to models normally; the runtime parameter is transparent

## Further Reading

- [LangChain ToolRuntime Documentation](https://docs.langchain.com/oss/python/langchain/runtime)
- [LangChain Tools with Memory](https://docs.langchain.com/oss/python/langchain/tools)
- [LangChain Long-Term Memory Guide](https://docs.langchain.com/oss/python/langchain/long-term-memory)
- [LangGraph Store Concepts](https://langchain-ai.github.io/langgraph/concepts/persistence/#memory-store)
