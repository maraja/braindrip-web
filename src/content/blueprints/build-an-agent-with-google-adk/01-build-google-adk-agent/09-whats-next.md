# Step 9: What's Next

One-Line Summary: Production hardening, multi-agent systems, and where to go from here with your ADK agent.

Prerequisites: Deployed agent from Step 8

---

## What You Built

You now have a working AI research agent that:

- Receives natural language research requests
- Uses Gemini to reason about what tools to call and in what order
- Searches the web with Google Search (built-in, zero config)
- Performs calculations on research data
- Saves and retrieves notes using session state
- Maintains conversation history across multiple turns
- Deploys to Cloud Run with a single command

That is a real agent. Here is how to take it further.

## Add More Tools

ADK makes it easy to add tools. Here are a few ideas:

```python
# Example: A URL fetcher tool
import httpx

def fetch_url(url: str) -> dict:
    """Fetch the content of a web page and return the text.

    Use this to read the full content of articles found via search.

    Args:
        url: The URL to fetch.

    Returns:
        The page title and text content.
    """
    response = httpx.get(url, timeout=10.0, follow_redirects=True)
    return {"url": url, "status": response.status_code, "text": response.text[:5000]}
```

Just add the function to your agent's `tools` list — ADK handles the rest.

## Build a Multi-Agent System

ADK supports hierarchical agent architectures. Specialized agents handle sub-tasks, coordinated by a parent:

```python
from google.adk.agents import Agent
from google.adk.tools import google_search

# Specialist: searches and summarizes
researcher = Agent(
    name="researcher",
    model="gemini-2.5-flash",
    description="Searches the web and summarizes findings.",
    instruction="Search for information and provide concise summaries with sources.",
    tools=[google_search],
)

# Specialist: analyzes data
analyst = Agent(
    name="analyst",
    model="gemini-2.5-flash",
    description="Performs data analysis and calculations.",
    instruction="Analyze data, perform calculations, and identify trends.",
    tools=[calculator],
)

# Coordinator: delegates to specialists
root_agent = Agent(
    name="coordinator",
    model="gemini-2.5-flash",
    description="Coordinates research by delegating to specialist agents.",
    instruction="""You coordinate research tasks. Delegate to:
- researcher: for web searches and summaries
- analyst: for calculations and data analysis
Combine their findings into a final report.""",
    sub_agents=[researcher, analyst],
)
```

The coordinator decides which sub-agent to involve based on the user's request. Each sub-agent has its own tools and instructions.

## Switch to Database Sessions

For production, switch from in-memory to persistent sessions:

```python
from google.adk.sessions import DatabaseSessionService

# SQLite for single-instance deployments
session_service = DatabaseSessionService(
    db_url="sqlite+aiosqlite:///./agent_sessions.db"
)

# PostgreSQL for multi-instance / Cloud SQL
session_service = DatabaseSessionService(
    db_url="postgresql+asyncpg://user:pass@host:5432/agent_db"
)
```

This ensures conversations survive server restarts and can be shared across multiple Cloud Run instances.

## Add Input Validation

Validate user input before it reaches your agent:

```python
import re

MAX_QUERY_LENGTH = 2000

BLOCKED_PATTERNS = [
    r"ignore (previous|all|above) instructions",
    r"you are now",
    r"pretend you are",
]

def validate_query(query: str) -> tuple[bool, str]:
    """Validate a user query before sending to the agent."""
    if len(query) > MAX_QUERY_LENGTH:
        return False, f"Query too long. Maximum {MAX_QUERY_LENGTH} characters."
    if len(query.strip()) == 0:
        return False, "Query cannot be empty."
    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, query.lower()):
            return False, "Query contains disallowed content."
    return True, ""
```

## Add Observability

ADK integrates with Google Cloud Trace for production monitoring:

```bash
# Deploy with tracing enabled
adk deploy cloud_run \
  --project=YOUR_PROJECT_ID \
  --region=us-central1 \
  --service_name=research-agent \
  --trace_to_cloud \
  research_agent
```

This lets you see the full tool-call chain in the Google Cloud Console — how long each tool took, which tools were called, and where bottlenecks are.

## Scaling Considerations

| Challenge | Solution |
|-----------|----------|
| **Session persistence** | Switch to `DatabaseSessionService` with PostgreSQL or Cloud SQL |
| **Cost control** | Use `gemini-2.5-flash` for tool routing and `gemini-2.5-pro` for final synthesis |
| **Rate limiting** | Add Cloud Run concurrency limits and API Gateway |
| **Authentication** | Add IAM or API key authentication to your Cloud Run service |
| **Multi-region** | Deploy to multiple Cloud Run regions behind a load balancer |
| **Evaluation** | Use `adk eval` to measure agent accuracy against test cases |

## ADK vs. Building From Scratch

Having seen both approaches (the Claude blueprint and this one), here is how they compare:

| Aspect | Raw SDK (Claude) | Framework (ADK) |
|--------|-------------------|-----------------|
| **Setup** | More code, full control | Less code, convention-based |
| **Agent loop** | You build it | Runner handles it |
| **Tools** | JSON schemas by hand | Auto-generated from functions |
| **Sessions** | You build it | Built-in with multiple backends |
| **Deployment** | You Dockerize and deploy | One CLI command |
| **Flexibility** | Maximum | High (but within the framework) |
| **Learning** | Understand everything | Some abstraction |

Neither approach is better. The raw SDK teaches you how agents work. A framework like ADK lets you ship faster. Most production systems use a mix — understanding the internals helps you debug framework issues.

## Where to Go From Here

- **[ADK Samples](https://github.com/google/adk-samples)** — Official example agents for different use cases
- **[ADK Documentation](https://google.github.io/adk-docs/)** — Complete reference for all ADK features
- **[Gemini API Docs](https://ai.google.dev/gemini-api/docs)** — Deep dive into the model's capabilities
- **[Cloud Run Documentation](https://cloud.google.com/run/docs)** — Production deployment patterns
- **[ADK Evaluation](https://google.github.io/adk-docs/evaluate/)** — Test and measure your agent's performance

You shipped an AI agent with Google's stack. Now make it yours.

---

**Reference:** [ADK Multi-Agent](https://google.github.io/adk-docs/agents/) · [ADK Evaluation](https://google.github.io/adk-docs/evaluate/) · [Cloud Trace Integration](https://google.github.io/adk-docs/integrations/cloud-trace/)

[← Deploy to Cloud Run](08-deploy-to-cloud-run.md)
