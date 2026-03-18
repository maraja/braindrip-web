# Step 9: What's Next

One-Line Summary: Production hardening — add error handling, guardrails, rate limiting, and learn how to scale your agent for real-world use.

Prerequisites: Deployed agent from Step 8

---

## What You Built

You now have a working AI research agent that:

- Receives natural language research requests via a REST API
- Uses Claude to reason about what tools to call and in what order
- Searches the web for current information
- Performs calculations on research data
- Saves notes and compiles findings
- Maintains conversation history across multiple turns
- Streams responses in real time
- Runs in a Docker container

That is a real agent. But shipping to production requires a few more layers.

## Add Error Handling and Retries

The Anthropic API can return transient errors. Wrap your API calls with retry logic:

```python
# resilience.py
# ==========================================
# Retry logic for API calls
# ==========================================

import time
import anthropic

def call_claude_with_retry(client, max_retries: int = 3, **kwargs) -> anthropic.types.Message:
    """Call Claude with exponential backoff on transient errors."""
    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)
        except anthropic.RateLimitError:
            # Rate limited — wait and retry
            wait_time = 2 ** attempt
            print(f"Rate limited. Retrying in {wait_time}s...")
            time.sleep(wait_time)
        except anthropic.APIStatusError as e:
            if e.status_code >= 500:
                # Server error — retry
                wait_time = 2 ** attempt
                print(f"API error {e.status_code}. Retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                # Client error — don't retry
                raise
    raise Exception("Max retries exceeded for Claude API call")
```

Replace `client.messages.create(...)` in your agent loop with `call_claude_with_retry(client, ...)`.

## Add Input Guardrails

Validate and sanitize user input before it reaches Claude:

```python
# guardrails.py
# ==========================================
# Input validation and safety checks
# ==========================================

import re

# Maximum query length to prevent abuse
MAX_QUERY_LENGTH = 2000

# Topics to block (customize for your use case)
BLOCKED_PATTERNS = [
    r"ignore (previous|all|above) instructions",
    r"you are now",
    r"pretend you are",
    r"system prompt",
]


def validate_query(query: str) -> tuple[bool, str]:
    """
    Validate a user query before sending to the agent.

    Returns:
        (is_valid, error_message)
    """
    # Check length
    if len(query) > MAX_QUERY_LENGTH:
        return False, f"Query too long. Maximum {MAX_QUERY_LENGTH} characters."

    if len(query.strip()) == 0:
        return False, "Query cannot be empty."

    # Check for prompt injection patterns
    query_lower = query.lower()
    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, query_lower):
            return False, "Query contains disallowed content."

    return True, ""
```

Wire this into your `/research` endpoint:

```python
from guardrails import validate_query

@app.post("/research", response_model=ResearchResponse)
async def research(request: ResearchRequest):
    # Validate input
    is_valid, error_msg = validate_query(request.query)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    # ... rest of the handler
```

## Add Rate Limiting

Protect your API from abuse with a simple in-memory rate limiter:

```python
# Add to server.py
from collections import defaultdict

# Track requests per IP — simple sliding window
request_counts: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT = 10  # requests per minute

@app.middleware("http")
async def rate_limit_middleware(request, call_next):
    client_ip = request.client.host
    now = time.time()

    # Clean old entries
    request_counts[client_ip] = [
        t for t in request_counts[client_ip] if now - t < 60
    ]

    if len(request_counts[client_ip]) >= RATE_LIMIT:
        return JSONResponse(
            status_code=429,
            content={"detail": "Rate limit exceeded. Try again in a minute."}
        )

    request_counts[client_ip].append(now)
    return await call_next(request)
```

## Add Logging

Structured logging helps you debug agent behavior in production:

```python
# Add to server.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("research-agent")

# Log in your agent loop
logger.info(f"Session {session_id}: query='{query[:100]}'")
logger.info(f"Session {session_id}: tool_call={block.name}")
logger.info(f"Session {session_id}: response_length={len(text)}")
```

## Scaling Considerations

| Challenge | Solution |
|-----------|----------|
| **Session storage** | Replace in-memory `SessionStore` with Redis for multi-instance deployments |
| **Long-running requests** | Add background task processing with Celery or FastAPI's `BackgroundTasks` |
| **Cost control** | Track token usage per session and set per-user budgets |
| **Observability** | Add OpenTelemetry tracing to see the full tool-call chain |
| **Multiple models** | Use `claude-haiku-4-20250514` for tool routing and `claude-sonnet-4-20250514` for final synthesis to reduce costs |
| **Persistent notes** | Move saved notes to a database (PostgreSQL, SQLite) for long-term storage |

## Deploy to the Cloud

Your Dockerized agent can deploy anywhere:

```bash
# Example: Deploy to Google Cloud Run
gcloud run deploy research-agent \
  --source . \
  --set-env-vars ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY,BRAVE_API_KEY=$BRAVE_API_KEY \
  --allow-unauthenticated \
  --region us-central1
```

```bash
# Example: Deploy to AWS with Fargate
# (after pushing to ECR)
aws ecs create-service \
  --service-name research-agent \
  --task-definition research-agent:1 \
  --desired-count 2 \
  --launch-type FARGATE
```

## Where to Go From Here

You have the foundation. Here are directions to explore:

- **Add more tools** — file reader, database queries, code execution, email sending
- **Build a frontend** — connect a React or Next.js app to your API
- **Add authentication** — protect your API with JWT tokens or API keys
- **Multi-agent systems** — have one agent delegate sub-tasks to specialized agents
- **Evaluation** — build test suites to measure your agent's accuracy and reliability
- **Fine-tuning prompts** — iterate on your system prompt based on real usage patterns

You shipped an AI agent. Now make it yours.

---

[← Deploy as API](08-deploy-as-api.md)
