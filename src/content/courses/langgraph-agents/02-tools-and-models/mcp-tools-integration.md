# MCP Tools Integration

**One-Line Summary**: The Model Context Protocol (MCP) lets LangGraph agents use tools hosted on external servers -- connecting to databases, APIs, and services through a standardized protocol without writing custom tool implementations.

**Prerequisites**: `langchain-tool-decorator.md`, `binding-tools-to-models.md`, `tool-node.md`, `tool-runtime-and-context.md`

## What Is MCP Tools Integration?

Think of USB. Before USB, every device had its own proprietary connector -- printers, keyboards, cameras each needed different cables and drivers. USB standardized the interface so any device could plug into any computer. MCP (Model Context Protocol) does the same for AI tools. Instead of writing custom tool integrations for every external service, MCP provides a standard protocol for tool servers to expose their capabilities and for agents to discover and invoke them.

An MCP server is a separate process that exposes tools over the MCP protocol. It might provide database access, file system operations, API integrations, or any other capability. The `langchain-mcp-adapters` package bridges MCP servers into LangChain's tool system, converting MCP tools into `BaseTool` instances that work with `bind_tools()`, `ToolNode`, and LangGraph agents out of the box.

The real power comes from the ecosystem. Hundreds of MCP servers exist for popular services (GitHub, Slack, Google Drive, databases), and any MCP server works with any MCP-compatible agent. You can compose tools from multiple MCP servers into a single agent, giving it access to a wide range of capabilities without writing integration code.

## How It Works

### Connecting to MCP Servers

```python
# pip install langchain-mcp-adapters

from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_agent

# Connect to multiple MCP servers simultaneously
client = MultiServerMCPClient({
    "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp/workspace"],
    },
    "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {"GITHUB_TOKEN": "ghp_..."},
    },
})

# Get LangChain-compatible tools from MCP servers
tools = await client.get_tools()
# tools is a list of BaseTool instances: [read_file, write_file, search_repos, ...]

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=tools,
)
```

### Using MCP Tools in a LangGraph Agent

```python
from langgraph.prebuilt import create_react_agent

# MCP tools plug directly into create_react_agent
agent = create_react_agent(
    model="claude-sonnet-4-5-20250929",
    tools=tools,  # MCP tools work like any other LangChain tool
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "List the files in the workspace."}]
})
```

### Tool Interceptors

MCP servers run as separate processes and cannot access LangGraph runtime information (store, context, state). Interceptors bridge this gap by giving you middleware-like control over MCP tool calls:

```python
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.interceptors import MCPToolCallRequest
from langchain.messages import ToolMessage

async def inject_user_context(request: MCPToolCallRequest, handler):
    """Add user credentials to MCP tool calls."""
    runtime = request.runtime
    user_id = runtime.context.user_id

    # Modify the tool call arguments before execution
    modified_request = request.override(
        args={**request.args, "user_id": user_id}
    )
    return await handler(modified_request)

async def require_authentication(request: MCPToolCallRequest, handler):
    """Block sensitive MCP tools if user is not authenticated."""
    runtime = request.runtime
    is_authenticated = runtime.state.get("authenticated", False)

    sensitive_tools = ["delete_file", "update_settings", "export_data"]
    if request.name in sensitive_tools and not is_authenticated:
        return ToolMessage(
            content="Authentication required. Please log in first.",
            tool_call_id=runtime.tool_call_id,
        )

    return await handler(request)

client = MultiServerMCPClient(
    {"filesystem": {...}},
    tool_interceptors=[require_authentication, inject_user_context],
)
```

### Personalizing MCP Tools with Store Access

```python
async def personalize_search(request: MCPToolCallRequest, handler):
    """Use stored preferences to customize MCP tool behavior."""
    runtime = request.runtime
    user_id = runtime.context.user_id
    store = runtime.store

    prefs = store.get(("preferences",), user_id)
    if prefs and request.name == "search":
        modified_args = {
            **request.args,
            "language": prefs.value.get("language", "en"),
            "limit": prefs.value.get("result_limit", 10),
        }
        request = request.override(args=modified_args)

    return await handler(request)
```

## Why It Matters

1. **Instant tool ecosystem** -- hundreds of MCP servers provide ready-made tools for databases, APIs, file systems, and SaaS products without custom integration code.
2. **Standardized protocol** -- any MCP server works with any MCP-compatible agent, avoiding per-service integration effort.
3. **Interceptors bridge the gap** -- tool interceptors give MCP tools access to LangGraph runtime features (store, context, state) that external processes cannot access directly.
4. **Composable tool sets** -- connect multiple MCP servers to give a single agent access to tools across different services.
5. **Security through interception** -- interceptors can enforce authentication, filter tools, rate-limit calls, and audit tool usage before execution.

## Key Technical Details

- Install with `pip install langchain-mcp-adapters`.
- `MultiServerMCPClient` manages connections to one or more MCP servers, each specified with a `command` and `args` to start the server process.
- MCP tools are converted to `BaseTool` instances, making them compatible with `bind_tools()`, `ToolNode`, and all LangGraph agent patterns.
- Tool interceptors are async functions with the signature `(request: MCPToolCallRequest, handler) -> ToolMessage`. They execute in order, with `handler` calling the next interceptor or the actual tool.
- Interceptors can modify requests (changing arguments), short-circuit execution (returning a `ToolMessage` directly), or add logging and auditing.
- MCP servers run as child processes; environment variables (API keys, tokens) are passed via the `env` field.
- The MCP protocol supports tool discovery -- the client automatically learns what tools a server provides.
- MCP servers can be written in any language; the protocol uses JSON-RPC over stdin/stdout.

## Common Misconceptions

- **"MCP tools require a different integration pattern than LangChain tools."** After conversion by the adapter, MCP tools implement `BaseTool` and are used identically to custom or community tools.
- **"MCP servers can access LangGraph state directly."** They cannot -- they run as separate processes. Interceptors are the mechanism for passing runtime context to MCP tools.
- **"You need to run MCP servers separately."** `MultiServerMCPClient` starts and manages the server processes automatically based on the `command` and `args` you provide.
- **"MCP is only for Anthropic/Claude models."** MCP is an open protocol. MCP tools work with any LLM that supports function calling (OpenAI, Anthropic, Google, etc.) via LangChain.

## Connections to Other Concepts

- `langchain-tool-decorator.md` -- MCP tools are converted to the same interface as `@tool`-decorated functions
- `binding-tools-to-models.md` -- MCP tools are bound to models with `bind_tools()` like any other tool
- `tool-node.md` -- `ToolNode` executes MCP tools alongside custom tools
- `tool-runtime-and-context.md` -- interceptors access `ToolRuntime` for context and store injection
- `community-tools.md` -- MCP tools complement the existing community tool ecosystem

## Further Reading

- [LangChain MCP Integration Guide](https://docs.langchain.com/oss/python/langchain/mcp)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
- [langchain-mcp-adapters on PyPI](https://pypi.org/project/langchain-mcp-adapters/)
