# LangGraph Dev Server

**One-Line Summary**: The `langgraph dev` command launches a built-in development server with an API, visual Studio UI, and auto-generated docs -- the fastest way to test and debug agents locally.

**Prerequisites**: `prebuilt-react-agent.md`, `checkpointers.md`, `streaming-tokens.md`

## What Is the LangGraph Dev Server?

Think of it like the live preview mode in a web development framework. When you run `next dev` in Next.js, you get a local server, hot reloading, and dev tools without writing any server code yourself. The `langgraph dev` command does the same for LangGraph agents -- it takes your compiled graph, wraps it in an API server, and gives you a visual debugging interface, all with zero boilerplate.

The dev server runs at `localhost:8123` and exposes a standardized REST API for invoking your graph, streaming responses, managing threads, and inspecting state. But the real power is LangGraph Studio -- a visual UI that shows your graph structure, lets you step through executions node by node, inspect state at each checkpoint, and replay conversations. It turns debugging from reading log files into watching your agent think in real time.

This is strictly a development tool. It is not designed for production traffic, multi-user concurrency, or custom middleware. For production, wrap your agent in FastAPI (see `fastapi-deployment.md`). But for building and debugging, the dev server eliminates the entire boilerplate layer so you can focus on agent logic.

## How It Works

### Installation

```python
# Install the CLI tool
# pip install langgraph-cli

# Verify installation
# langgraph --version
```

### Configuration File

The dev server requires a `langgraph.json` file in your project root that tells it where to find your graph:

```python
# langgraph.json
# {
#   "graphs": {
#     "agent": "./agent.py:graph"
#   },
#   "dependencies": ["requirements.txt"],
#   "env_file": ".env"
# }
```

The `"./agent.py:graph"` syntax means: import the `graph` variable from `agent.py`. This must be a compiled `CompiledStateGraph` instance.

### Agent File

```python
# agent.py
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o")
tools = []

# The variable name here must match langgraph.json
graph = create_react_agent(model=model, tools=tools)
```

### Running the Dev Server

```python
# Start the dev server (opens Studio UI automatically)
# langgraph dev

# Server runs at http://localhost:8123
# Studio UI opens in your browser automatically

# Test via curl
# curl -X POST http://localhost:8123/runs/stream \
#   -H "Content-Type: application/json" \
#   -d '{
#     "assistant_id": "agent",
#     "input": {"messages": [{"role": "user", "content": "Hello!"}]},
#     "config": {"configurable": {"thread_id": "test-1"}}
#   }'
```

### Using the Studio UI

LangGraph Studio provides a visual interface for interacting with your agent:

```python
# Studio features:
# 1. Graph visualization -- see nodes and edges rendered as a flowchart
# 2. Step-through execution -- watch each node execute in sequence
# 3. State inspection -- view the full state object at any checkpoint
# 4. Thread management -- switch between conversation threads
# 5. Replay and branch -- go back to any step and try different inputs
```

### Multiple Graphs

```python
# langgraph.json with multiple agents
# {
#   "graphs": {
#     "researcher": "./agents/researcher.py:graph",
#     "coder": "./agents/coder.py:graph",
#     "supervisor": "./agents/supervisor.py:graph"
#   },
#   "dependencies": ["requirements.txt"],
#   "env_file": ".env"
# }
```

## Why It Matters

1. **Zero-boilerplate testing** -- invoke and stream your agent through a proper API without writing a single line of server code.
2. **Visual debugging** -- LangGraph Studio shows graph structure, execution flow, and state at each step, making complex multi-step agent behavior understandable at a glance.
3. **Rapid iteration** -- the dev server watches for file changes, so you can edit agent logic and test immediately without restarting.
4. **Standardized API** -- the dev server exposes the same API shape used by LangGraph Cloud, so local testing translates directly to production behavior.
5. **Thread management built in** -- create, list, and switch between conversation threads through the UI without managing any database.

### `langgraph dev` vs `langgraph up`

The CLI provides two server commands for different stages:

| Feature | `langgraph dev` | `langgraph up` |
|---------|-----------------|----------------|
| Storage | In-memory | PostgreSQL (persistent) |
| Docker required | No | Yes |
| Hot reload | Yes | No (rebuild needed) |
| Production parity | Low | High |
| Use case | Development | Staging / integration testing |

`langgraph up` runs your agent in a Docker container with a PostgreSQL backend, mirroring the production LangSmith Cloud environment. Use it for integration testing before deploying.

## Key Technical Details

- Install with `pip install "langgraph-cli[inmem]"`; the CLI provides the `langgraph` command. Requires Python 3.11+.
- The `langgraph.json` config file must be in the directory where you run the command.
- The graph variable must be a compiled graph (call `.compile()` or use `create_react_agent` which returns one).
- The dev server uses an in-memory checkpointer by default -- state is lost on restart.
- Studio requires a LangSmith account for authentication (free tier is sufficient).
- The API runs at port 2024 by default; override with `--port`.
- Use `langgraph dev --tunnel` if you encounter Safari/HTTPS connection issues with Studio.
- Multiple graphs can be registered in a single config, each accessible by its key name.
- Other CLI commands: `langgraph new` (scaffold project), `langgraph build` (build Docker image), `langgraph test` (run tests).

## Common Misconceptions

- **"The dev server is production-ready."** It is designed for local development and debugging only. It lacks production essentials like custom auth, rate limiting, horizontal scaling, and persistent storage.
- **"You need Docker to run `langgraph dev`."** The dev server runs directly on your local Python environment. Docker is only needed for `langgraph up` (the production-oriented command).
- **"LangGraph Studio is a separate paid product."** Studio is included with the dev server and works with a free LangSmith account. It launches automatically when you run `langgraph dev`.
- **"The dev server API is proprietary and non-standard."** The API follows REST conventions and the same patterns used in the LangGraph SDK, making it straightforward to replicate with FastAPI when moving to production.

## Connections to Other Concepts

- `fastapi-deployment.md` -- the production alternative to the dev server
- `checkpointers.md` -- the dev server uses an in-memory checkpointer; production needs PostgresSaver
- `prebuilt-react-agent.md` -- the quickest agent to expose via the dev server
- `production-checklist.md` -- steps needed when graduating from the dev server to production
- `containerization.md` -- Docker packaging for production, complementing the Docker-free dev workflow

## Further Reading

- [LangGraph CLI Documentation](https://langchain-ai.github.io/langgraph/cloud/reference/cli/)
- [LangGraph Studio Guide](https://langchain-ai.github.io/langgraph/concepts/langgraph_studio/)
- [LangGraph Dev Server Quickstart](https://langchain-ai.github.io/langgraph/tutorials/langgraph-platform/local-server/)
- [LangSmith Free Tier Signup](https://smith.langchain.com/)
