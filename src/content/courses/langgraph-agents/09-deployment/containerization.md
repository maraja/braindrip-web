# Containerization

**One-Line Summary**: Docker packages your LangGraph agent, its dependencies, and runtime into a portable container that runs identically everywhere -- from your laptop to production servers.

**Prerequisites**: `fastapi-deployment.md`, `checkpointers.md`

## What Is Containerization?

Think of a shipping container at a port. Before containers existed, every cargo load was a unique puzzle -- different shapes, sizes, fragile items mixed with heavy ones. Containers standardized everything: pack your goods into a standard box, and any ship, truck, or crane can handle it without knowing what is inside. Docker does the same for software.

Without Docker, deploying a LangGraph agent means installing Python, matching exact dependency versions, setting environment variables, and configuring the runtime on every server. One mismatched library version and the agent breaks. A Docker container bundles your agent code, Python interpreter, all pip packages, and configuration into a single image that runs identically on any machine with Docker installed.

For LangGraph agents specifically, containerization also solves the infrastructure problem of connecting your agent to production services. Docker Compose lets you define your FastAPI agent and a PostgreSQL database (for the production checkpointer) in a single file, spinning up the entire stack with one command.

## How It Works

### Dockerfile

```python
# Dockerfile
# --- Stage 1: Build dependencies ---
# FROM python:3.11-slim AS builder
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# --- Stage 2: Production image ---
# FROM python:3.11-slim
# WORKDIR /app
# COPY --from=builder /install /usr/local
# COPY . .
# EXPOSE 8000
# HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
#   CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

### Requirements File

```python
# requirements.txt
# fastapi==0.115.0
# uvicorn[standard]==0.30.0
# langgraph==0.4.1
# langchain-openai==0.3.12
# langgraph-checkpoint-postgres==2.0.0
# psycopg[binary]==3.2.0
# pydantic==2.10.0
```

### Docker Compose with PostgreSQL

```python
# docker-compose.yml
# services:
#   agent:
#     build: .
#     ports:
#       - "8000:8000"
#     environment:
#       - OPENAI_API_KEY=${OPENAI_API_KEY}
#       - DATABASE_URL=postgresql://agent:secret@db:5432/agentdb
#       - LANGSMITH_API_KEY=${LANGSMITH_API_KEY}
#     depends_on:
#       db:
#         condition: service_healthy
#
#   db:
#     image: postgres:16
#     environment:
#       POSTGRES_USER: agent
#       POSTGRES_PASSWORD: secret
#       POSTGRES_DB: agentdb
#     volumes:
#       - pgdata:/var/lib/postgresql/data
#     healthcheck:
#       test: ["CMD-SHELL", "pg_isready -U agent"]
#       interval: 5s
#       timeout: 3s
#       retries: 5
#
# volumes:
#   pgdata:
```

### Building and Running

```python
# Build the image
# docker build -t langgraph-agent .

# Run standalone
# docker run -p 8000:8000 --env-file .env langgraph-agent

# Run full stack with Compose
# docker compose up --build

# Check health
# curl http://localhost:8000/health
```

### Connecting to PostgreSQL in Code

```python
import os
from langgraph.checkpoint.postgres import PostgresSaver

database_url = os.environ["DATABASE_URL"]
checkpointer = PostgresSaver(conn_string=database_url)

agent = create_react_agent(
    model="openai:gpt-4o",
    tools=tools,
    checkpointer=checkpointer,
)
```

## Why It Matters

1. **Environment parity** -- the exact same image runs in development, staging, and production, eliminating "works on my machine" failures.
2. **One-command infrastructure** -- `docker compose up` launches your agent and its PostgreSQL database together, fully configured and networked.
3. **Scalable deployments** -- container images deploy to Kubernetes, AWS ECS, Google Cloud Run, or Azure Container Apps with minimal configuration changes.
4. **Secure secrets management** -- API keys pass through environment variables, never baked into the image, preventing accidental exposure in version control.
5. **Reproducible builds** -- pinned dependency versions in requirements.txt and a deterministic Dockerfile mean builds produce identical images months apart.

## Key Technical Details

- Use `python:3.11-slim` as the base image -- it is 150MB smaller than the full image and sufficient for LangGraph agents.
- Multi-stage builds keep the final image small by discarding build tools and caches from the first stage.
- The `HEALTHCHECK` directive lets Docker and orchestrators detect when the agent is unresponsive and restart it automatically.
- Never put API keys in the Dockerfile or image layers; use `--env-file` or orchestrator secrets.
- Set `--workers 2` or higher in uvicorn to handle concurrent requests, but ensure the checkpointer supports shared state (PostgreSQL does, MemorySaver does not).
- Pin all dependency versions in requirements.txt to prevent unexpected breakage from upstream releases.
- Use `.dockerignore` to exclude `.env`, `__pycache__`, `.git`, and local virtual environments from the build context.

## Common Misconceptions

- **"Docker adds significant latency to LLM calls."** Container overhead is negligible -- networking adds microseconds, not milliseconds. LLM API latency dominates by orders of magnitude.
- **"You need Docker Compose for production."** Compose is excellent for development and simple deployments, but production typically uses Kubernetes, ECS, or Cloud Run with the same Docker image.
- **"Each request spawns a new container."** The container runs continuously like any server process. Uvicorn inside the container handles concurrent requests across its worker processes.
- **"You should use the latest tag for base images."** Always pin to a specific Python version like `3.11-slim`. Using `latest` creates non-reproducible builds that can break without warning.

## Connections to Other Concepts

- `fastapi-deployment.md` -- the application code that this Dockerfile packages
- `checkpointers.md` -- PostgresSaver requires a database, provided here via Docker Compose
- `production-checklist.md` -- containerization is one step in a broader production readiness process
- `langgraph-dev-server.md` -- an alternative development workflow that does not require Docker
- `thread-based-memory.md` -- thread isolation works across container restarts when backed by PostgreSQL

## Further Reading

- [Docker Official Python Guide](https://docs.docker.com/language/python/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Uvicorn Deployment with Docker](https://www.uvicorn.org/deployment/#running-with-docker)
- [LangGraph PostgreSQL Checkpointer Setup](https://langchain-ai.github.io/langgraph/how-tos/persistence_postgres/)
