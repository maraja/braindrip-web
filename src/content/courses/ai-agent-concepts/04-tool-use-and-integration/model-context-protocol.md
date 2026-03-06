# Model Context Protocol (MCP)

**One-Line Summary**: MCP is an open standard that provides a unified protocol for connecting AI models to external tools, data sources, and services through a client-server architecture with three core primitives: resources, tools, and prompts.

**Prerequisites**: Function calling, API integration, client-server architecture basics, JSON-RPC

## What Is Model Context Protocol?

Imagine the USB standard before it existed. Every device — printer, mouse, keyboard, camera — had its own proprietary connector. Buying a new device meant hoping you had the right port. USB solved this by creating a single standard connector that any device could use with any computer. MCP does the same for AI tool integration: it creates a single standard protocol by which any AI application (the client) can connect to any tool or data source (the server). Before MCP, every agent framework had its own way of defining and invoking tools, making integrations non-portable.

MCP (Model Context Protocol) was released by Anthropic in November 2024 as an open specification. It defines how AI-powered applications (hosts/clients) communicate with external servers that provide tools, data, and prompt templates. Instead of writing custom integration code for every tool in every framework, a developer writes one MCP server for their service, and any MCP-compatible client can use it. Claude Desktop, Claude Code, Cursor, Zed, Sourcegraph Cody, and other applications already support MCP.

The practical impact is an ecosystem effect. A single MCP server for Slack means every MCP-compatible AI application gets Slack integration. A server for PostgreSQL means every client can query databases. This composability and reusability is what distinguishes MCP from ad-hoc function calling — it is not just about invoking tools, but about discovering, connecting, and managing tools through a standardized layer.

*Recommended visual: An architecture diagram showing the MCP client-server model: Host Application containing MCP Clients, each connected via JSON-RPC (stdio or SSE) to MCP Servers that expose Tools, Resources, and Prompts — see [Model Context Protocol Specification (2024)](https://modelcontextprotocol.io)*

## How It Works

### Architecture: Hosts, Clients, and Servers

MCP uses a three-layer architecture:

- **Host**: The AI application the user interacts with (e.g., Claude Desktop, an IDE with AI integration). The host manages one or more MCP clients.
- **Client**: A component within the host that maintains a 1:1 connection to a specific MCP server. Each client negotiates capabilities and routes requests/responses.
- **Server**: A lightweight program that exposes specific capabilities (tools, resources, prompts) via the MCP protocol. A server for GitHub exposes tools like `create_issue`, `search_repos`; a server for a local file system exposes file read/write tools.

Communication uses JSON-RPC 2.0 over either **stdio** (local servers, launched as subprocesses) or **SSE/HTTP** (remote servers, accessed over the network). The protocol supports request-response patterns, notifications, and capability negotiation at connection time.

### The Three Primitives

**Tools**: Functions that the AI model can invoke, equivalent to function calling. Each tool has a name, description, and input schema. When the model decides to use a tool, the client sends the invocation to the appropriate server, which executes it and returns the result. Example: a `query_database` tool that accepts SQL and returns rows.

**Resources**: Data that the application can present to the model as context. Resources are identified by URIs (e.g., `file:///path/to/doc.md`, `postgres://db/table`) and provide read-only content. Unlike tools (which the model invokes), resources are typically selected by the application or user and attached to the conversation as context. Example: the contents of a file the user wants the agent to analyze.

**Prompts**: Reusable prompt templates with optional arguments that servers can expose. These are user-triggered — they appear as available actions or slash commands in the host UI. Example: a code review server might expose a `review_pr` prompt template that structures the model's analysis.

### Discovery and Capability Negotiation

When a client connects to a server, they exchange capability messages. The server declares which primitives it supports (tools, resources, prompts) and their specifications. The client declares what it can handle (e.g., whether it supports resource subscriptions or tool progress updates). This negotiation allows both sides to adapt to each other's capabilities.

### Lifecycle Management

MCP servers can be local processes (started and stopped by the host application) or remote services (always running). The protocol includes initialization handshakes, keepalive mechanisms, and graceful shutdown procedures. For local servers, the host manages the process lifecycle — starting the server when needed and cleaning up when the connection closes.

## Why It Matters

### Ecosystem Composability

MCP's primary value is composability. A growing registry of community-built MCP servers covers databases (PostgreSQL, SQLite), developer tools (GitHub, GitLab, Linear), communication (Slack, email), file systems, web search, and more. Each server works with every MCP-compatible client, creating an N-times-M integration surface from N+M components instead of N*M custom integrations.

### Separation of Concerns

MCP cleanly separates the AI reasoning layer (the model and its host) from the tool execution layer (servers). This means: tool developers do not need to understand LLM prompt engineering, AI application developers do not need to understand every API they integrate with, and tools can be updated independently of the AI application.

### Standardization for Enterprise

For organizations deploying AI agents, MCP provides a standard interface for security review, access control, and audit logging. Instead of reviewing custom integration code for every tool, security teams can review the MCP protocol layer once and then evaluate individual servers against a consistent standard.

## Key Technical Details

- **Transport options**: Stdio transport launches the server as a local subprocess and communicates via stdin/stdout — simple, fast, secure (no network). SSE transport communicates over HTTP with Server-Sent Events — needed for remote servers but requires authentication and network security.
- **JSON-RPC 2.0**: All messages follow JSON-RPC format with `method`, `params`, `id` (for requests), and `result`/`error` (for responses). This is a well-established protocol with broad library support.
- **Tool annotations**: Tools can carry metadata indicating whether they are read-only or have side effects, enabling clients to implement appropriate confirmation flows.
- **Resource subscriptions**: Clients can subscribe to resource changes, receiving notifications when the underlying data updates. This enables reactive patterns where the agent re-reads context when files change.
- **Progress reporting**: Long-running tool executions can send progress notifications, allowing the host to display progress indicators to the user.
- **Sampling**: MCP allows servers to request that the client perform an LLM inference (called "sampling"), enabling servers to leverage AI capabilities without embedding their own model. This is a powerful but carefully controlled feature.
- **Security model**: MCP servers run with the permissions of the user who launched them. Sensitive operations should require explicit user consent. The protocol supports but does not mandate specific authentication mechanisms for remote servers.

## Common Misconceptions

- **"MCP replaces function calling"**: MCP builds on function calling, not replacing it. The model still uses function calling to invoke tools. MCP standardizes how those tools are discovered, described, and executed across a client-server boundary.
- **"MCP is only for Anthropic/Claude"**: MCP is an open specification. While Anthropic created it, adoption extends to Cursor, Zed, Sourcegraph Cody, Replit, and others. Any application can implement the client or server side.
- **"Every tool needs its own MCP server"**: A single MCP server can expose multiple tools. A "developer tools" server might expose GitHub, Git, and terminal tools all through one server process. Grouping related tools reduces connection overhead.
- **"MCP servers are complex to build"**: A minimal MCP server can be built in under 50 lines of Python or TypeScript using the official SDKs. The protocol is designed for simplicity, and most of the complexity is in the underlying tool logic, not the MCP layer.
- **"Resources and tools are the same thing"**: Resources are passive data (read by the application to provide context), while tools are active functions (invoked by the model to take action). This distinction is important for security and UX: reading a file (resource) is safe; deleting a file (tool) requires confirmation.

## Connections to Other Concepts

- `function-calling.md` — MCP tools are invoked via the model's function calling mechanism. MCP standardizes the discovery and transport; function calling handles the model-side invocation.
- `tool-selection-and-routing.md` — MCP's discovery protocol provides the tool descriptions that feed into tool selection. Dynamic discovery means the tool set can change across sessions.
- `api-integration.md` — MCP servers are often thin wrappers around REST/GraphQL APIs, providing a standardized interface that any MCP client can use.
- `structured-output-for-actions.md` — MCP tool input schemas use JSON Schema, the same format used for structured output validation.
- `tool-chaining.md` — Agents chain MCP tools just as they chain any other tools. The MCP layer is transparent to the chaining logic.

## Further Reading

- Anthropic, "Introducing the Model Context Protocol" (2024) — The announcement blog post explaining MCP's motivation, design, and ecosystem vision.
- Model Context Protocol Specification (2024) — The official specification at modelcontextprotocol.io, detailing the protocol, transports, and all primitives.
- Anthropic, "MCP SDKs: TypeScript and Python" (2024) — Official SDK documentation for building MCP servers and clients in the two most common languages.
- David Soria Parra and Justin Spahr-Summers, "MCP Design Philosophy" (2024) — Technical discussion of the design decisions behind MCP, including why JSON-RPC was chosen and how the primitive types were selected.
- Mahesh Murag, "Building MCP Servers" (2025) — Practical guide to building production MCP servers with authentication, error handling, and deployment considerations.
