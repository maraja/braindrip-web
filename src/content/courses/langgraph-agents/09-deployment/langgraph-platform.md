# LangGraph Platform

**One-Line Summary**: LangGraph Platform (deployed via LangSmith) is a managed hosting service purpose-built for stateful, long-running agents -- handling infrastructure, scaling, persistence, and operational concerns so you can deploy directly from a GitHub repository.

**Prerequisites**: `langgraph-dev-server.md`, `fastapi-deployment.md`, `checkpointers.md`, `containerization.md`

## What Is LangGraph Platform?

Think of the difference between cooking at home and opening a restaurant. When you cook at home (self-hosted FastAPI), you control everything but also handle everything -- the stove, the plumbing, the health inspections. LangGraph Platform is like renting a fully equipped commercial kitchen: you bring your recipes (your agent code), and the platform provides industrial-grade infrastructure, scaling, monitoring, and all the operational machinery that keeps things running under real-world load.

Traditional hosting platforms (Heroku, Railway, generic container services) are built for stateless, short-lived HTTP request-response cycles. AI agents are fundamentally different: they maintain state across interactions, run long-lived executions that can span minutes or hours, require persistent checkpointing, and need specialized features like human-in-the-loop interrupts and background task queues. LangGraph Platform is purpose-built for these requirements.

The platform exposes a standardized REST API and is accessible via the LangGraph SDK (Python and JavaScript). This means the same SDK code that talks to your local `langgraph dev` server works identically against a cloud deployment -- the only change is the URL and an API key.

## How It Works

### Deployment Flow

The deployment process starts with your `langgraph.json` configuration file and a GitHub repository:

```python
# langgraph.json -- the same file used for local dev
# {
#   "graphs": {
#     "agent": "./my_agent/agent.py:graph"
#   },
#   "dependencies": ["./my_agent"],
#   "env": ".env"
# }
```

### Application Structure

```python
# Standard project layout for deployment
# my-app/
# ├── my_agent/
# │   ├── __init__.py
# │   ├── agent.py          # graph = create_react_agent(...)
# │   ├── tools.py           # tool definitions
# │   └── state.py           # state schema
# ├── requirements.txt       # or pyproject.toml
# ├── .env                   # environment variables (not committed)
# └── langgraph.json         # deployment configuration
```

### Deploying to LangSmith Cloud

```python
# Step 1: Push your code to GitHub
# git push origin main

# Step 2: In LangSmith UI:
#   - Navigate to Deployments
#   - Click "New Deployment"
#   - Connect your GitHub repository
#   - Select the branch and langgraph.json location
#   - Configure environment variables (OPENAI_API_KEY, etc.)
#   - Deploy

# Step 3: Get your deployment URL and API key from the deployment details page
```

### Testing the Deployment

```python
from langgraph_sdk import get_sync_client

client = get_sync_client(
    url="your-deployment-url",
    api_key="your-langsmith-api-key",
)

# Threadless run (stateless, single interaction)
for chunk in client.runs.stream(
    None,       # None = threadless run
    "agent",    # assistant name from langgraph.json
    input={"messages": [{"role": "human", "content": "What is LangGraph?"}]},
    stream_mode="updates",
):
    print(f"Event: {chunk.event}")
    print(chunk.data)
```

### Testing via REST API

```python
# curl -s --request POST \
#   --url <DEPLOYMENT_URL>/runs/stream \
#   --header 'Content-Type: application/json' \
#   --header 'X-Api-Key: <LANGSMITH_API_KEY>' \
#   --data '{
#     "assistant_id": "agent",
#     "input": {
#       "messages": [{"role": "human", "content": "What is LangGraph?"}]
#     },
#     "stream_mode": "updates"
#   }'
```

### Thread Management (Stateful Conversations)

```python
# Create a thread for persistent conversation
thread = client.threads.create()

# First message
for chunk in client.runs.stream(
    thread["thread_id"],
    "agent",
    input={"messages": [{"role": "human", "content": "My name is Alice."}]},
    stream_mode="updates",
):
    print(chunk.data)

# Follow-up (agent remembers the thread context)
for chunk in client.runs.stream(
    thread["thread_id"],
    "agent",
    input={"messages": [{"role": "human", "content": "What is my name?"}]},
    stream_mode="updates",
):
    print(chunk.data)
```

### Assistants (Configurable Agent Variants)

Each graph in `langgraph.json` automatically becomes a default assistant. You can also create custom assistants -- same graph logic but different configurations:

```python
# Create a custom assistant with specific settings
assistant = client.assistants.create(
    graph_id="agent",
    config={"configurable": {"model": "gpt-4", "system_prompt": "You are a coding assistant."}},
    name="Coding Helper",
)

# Use it by UUID instead of graph name
for chunk in client.runs.stream(thread["thread_id"], assistant["assistant_id"], input={...}):
    print(chunk.data)
```

### Double-Texting (Concurrent Message Handling)

When a user sends a new message while a previous run is still executing, the platform handles it via configurable multitask strategies:

```python
for chunk in client.runs.stream(
    thread["thread_id"], "agent",
    input={"messages": [{"role": "human", "content": "Actually, do this instead."}]},
    multitask_strategy="interrupt",  # cancel current run, start new one
):
    print(chunk.data)

# Strategies:
# "reject"    -- reject the new run if one is in progress
# "enqueue"   -- queue the new run to execute after the current one
# "interrupt" -- cancel current run, roll back to last checkpoint, start new run
# "rollback"  -- like interrupt but explicitly rolls back all state changes
```

### Background Runs and Cron Jobs

```python
# Background run (returns immediately, agent works asynchronously)
run = client.runs.create(
    thread["thread_id"], "agent",
    input={"messages": [{"role": "human", "content": "Analyze this dataset"}]},
)
status = client.runs.get(thread["thread_id"], run["run_id"])  # check progress

# Scheduled cron job
cron = client.crons.create(
    assistant_id="agent",
    schedule="0 9 * * *",  # every day at 9 AM
    input={"messages": [{"role": "human", "content": "Generate daily report"}]},
)
```

## Why It Matters

1. **Zero infrastructure management** -- no Kubernetes clusters, no database provisioning, no container orchestration. Deploy from GitHub and the platform handles everything.
2. **Built for stateful agents** -- persistent checkpointing, thread management, and long-running execution are native features, not afterthoughts bolted onto a stateless platform.
3. **Same API everywhere** -- the REST API and SDK work identically against `langgraph dev`, self-hosted servers, and cloud deployments, making the local-to-production transition seamless.
4. **Integrated observability** -- LangSmith tracing is built in, giving you full execution traces, cost tracking, and debugging tools without additional instrumentation.
5. **Scaling without configuration** -- the platform handles concurrent users, background runs, and resource allocation automatically.
6. **Double-texting solved** -- multitask strategies handle concurrent messages gracefully, a common pain point in chat applications that generic platforms ignore.

## Key Technical Details

- Deploy from GitHub by connecting your repository in the LangSmith UI; the platform builds and deploys from your `langgraph.json`.
- The deployment exposes a REST API at a unique URL, authenticated via LangSmith API key (`X-Api-Key` header).
- Threads provide persistent conversation state; threadless runs (`None`) are stateless single interactions.
- The platform manages checkpointing automatically -- no need to configure PostgresSaver or any database.
- Environment variables (API keys, secrets) are configured in the deployment settings, not baked into the image.
- The `langgraph.json` supports multiple graphs, each accessible by its key name as the `assistant_id`.
- The same `langgraph-sdk` Python package (`pip install langgraph-sdk`) works for both local and cloud deployments.
- LangSmith Studio connects to cloud deployments for visual debugging and testing.

## Common Misconceptions

- **"LangGraph Platform is the only way to deploy LangGraph agents."** It is one option. You can deploy with FastAPI, Docker, and any hosting provider. The platform adds convenience and agent-specific infrastructure.
- **"You need to rewrite your agent for cloud deployment."** The same `langgraph.json` and agent code used for `langgraph dev` deploys directly to the platform with no code changes.
- **"The platform API is proprietary and locks you in."** The REST API follows standard conventions, and the same agent code runs on self-hosted infrastructure via FastAPI. Migration in either direction is straightforward.
- **"Cloud deployment is only for large-scale production."** The platform is useful for prototyping, demos, and team collaboration, not just high-traffic production systems.

## Connections to Other Concepts

- `langgraph-dev-server.md` -- local development uses the same API shape, making the transition to cloud seamless
- `langgraph-sdk.md` -- the Python/JS client that communicates with both local and cloud deployments
- `fastapi-deployment.md` -- the self-hosted alternative when you need full infrastructure control
- `containerization.md` -- the platform handles containerization internally, but understanding Docker helps with self-hosted alternatives
- `production-checklist.md` -- many checklist items (persistence, observability) are handled automatically by the platform
- `checkpointers.md` -- the platform manages checkpointing infrastructure; you do not configure it manually

## Further Reading

- [LangSmith Deployment Guide](https://docs.langchain.com/oss/python/langgraph/deploy)
- [LangGraph Application Structure](https://docs.langchain.com/oss/python/langgraph/application-structure)
- [LangGraph SDK Documentation](https://langchain-ai.github.io/langgraph/cloud/reference/sdk/)
- [LangSmith Platform](https://smith.langchain.com/)
