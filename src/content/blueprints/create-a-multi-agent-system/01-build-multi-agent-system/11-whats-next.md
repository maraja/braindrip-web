# Step 11: What's Next

One-Line Summary: Explore production deployment, alternative frameworks like LangGraph, scaling patterns, and advanced multi-agent architectures.

Prerequisites: Steps 1-10 completed

---

## What You Built

You now have a working multi-agent content production pipeline:

| Component | What It Does |
|-----------|-------------|
| **Researcher agent** | Searches the web and compiles structured research notes |
| **Writer agent** | Transforms research into a well-structured Markdown article |
| **Editor agent** | Polishes the draft and saves the final output |
| **Custom tools** | Web search and file saving capabilities |
| **Sequential workflow** | Orchestrated pipeline with automatic data passing |

Run it with a single command and get a publication-ready article:

```bash
python main.py "Any Topic You Want"
```

## Production Deployment

To move from a local script to a production service, consider these patterns.

**Wrap in a FastAPI service:**

```python
# api.py — Serve the crew as an HTTP API

from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from main import run_crew

app = FastAPI()


class ArticleRequest(BaseModel):
    topic: str


class ArticleResponse(BaseModel):
    status: str
    article: str


@app.post("/generate", response_model=ArticleResponse)
async def generate_article(
    request: ArticleRequest,
    background_tasks: BackgroundTasks,
):
    """Generate an article on the given topic."""
    # For long-running crews, consider using background tasks
    # and a job queue (Celery, Redis Queue, etc.)
    article = run_crew(request.topic)
    return ArticleResponse(status="complete", article=article)
```

```bash
# Install and run
pip install fastapi uvicorn
uvicorn api:app --host 0.0.0.0 --port 8000
```

**Add error handling and retries:**

```python
# robust_runner.py — Production-grade crew execution

import time
from crewai import Crew


def run_with_retries(crew: Crew, max_retries: int = 3) -> str:
    """Run a crew with exponential backoff on failure."""
    for attempt in range(max_retries):
        try:
            result = crew.kickoff()
            return result.raw
        except Exception as e:
            wait_time = 2 ** attempt  # 1s, 2s, 4s
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise RuntimeError(
                    f"Crew failed after {max_retries} attempts: {e}"
                )
```

## The LangGraph Alternative

CrewAI is excellent for role-based agent systems. But for more complex workflows with branching, conditional logic, and state machines, **LangGraph** is a strong alternative:

| Feature | CrewAI | LangGraph |
|---------|--------|-----------|
| **Best for** | Role-based agent teams | Complex stateful workflows |
| **Learning curve** | Low — intuitive roles/tasks model | Medium — graph-based thinking required |
| **Workflow style** | Sequential or hierarchical | Arbitrary directed graphs |
| **Branching logic** | Limited | Native — conditional edges, cycles |
| **State management** | Automatic via context | Explicit state object you control |
| **Human-in-the-loop** | Built-in parameter | Built-in with breakpoints |

A LangGraph version of our pipeline would define each agent as a node and the data flow as edges in a graph:

```python
# Conceptual LangGraph equivalent (not runnable — illustrative)
from langgraph.graph import StateGraph

# Define the graph
workflow = StateGraph(ArticleState)

# Add nodes (each is a function that calls an LLM)
workflow.add_node("research", research_node)
workflow.add_node("write", write_node)
workflow.add_node("edit", edit_node)

# Add edges (define the flow)
workflow.add_edge("research", "write")
workflow.add_edge("write", "edit")

# Compile and run
app = workflow.compile()
result = app.invoke({"topic": "Quantum Computing"})
```

Choose CrewAI when you want role-based agents that are quick to set up. Choose LangGraph when you need fine-grained control over workflow logic.

## Scaling Patterns

As your multi-agent systems grow, keep these patterns in mind:

**Hierarchical crews** — Add a manager agent that delegates to sub-agents based on the task. CrewAI supports this with `Process.hierarchical`.

**Crew pipelines** — Chain multiple crews together. One crew researches and writes, another reviews and publishes.

**Specialized tool sets** — Build domain-specific tools: database queries, API integrations, image generation. The more capable your tools, the more capable your agents.

**Observability** — Log every agent decision, tool call, and output. Use structured logging and consider tools like LangSmith or Langfuse for tracing multi-agent runs.

**Cost management** — Multi-agent systems make many LLM calls. Track token usage per agent, set spending limits, and cache frequent queries.

## Ideas to Build Next

- **Code review crew** — Researcher finds best practices, Reviewer analyzes code, Reporter writes the review
- **Customer support pipeline** — Classifier routes tickets, Responder drafts replies, QA checks for accuracy
- **Data analysis team** — Collector gathers data, Analyst runs calculations, Narrator writes the report
- **Translation pipeline** — Translator converts text, Cultural Reviewer checks nuance, Formatter ensures consistency

## Key Takeaways

1. **Agents are defined by their role, goal, and backstory** — these are not decorative; they directly shape output quality
2. **Tools give agents real capabilities** — without tools, agents only know what the LLM knows
3. **Context wiring is the backbone** — it determines what information flows between agents
4. **Start simple, add complexity** — a sequential three-agent crew handles a surprising range of tasks
5. **Multi-agent systems are composable** — once you know how to build one crew, you can build many and chain them together

You have the foundation. Now go build something.

---

[← Customize and Extend](10-customize-and-extend.md)
