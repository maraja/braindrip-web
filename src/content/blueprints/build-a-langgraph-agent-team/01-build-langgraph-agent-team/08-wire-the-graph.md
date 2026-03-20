# Step 8: Wire the Graph

One-Line Summary: Connect all four agents into a LangGraph workflow with parallel execution, conditional routing, and a revision loop — the complete pipeline.

Prerequisites: All four agents from Steps 4-7

---

## The Full Graph

Here is the complete flow we are building:

```
START
  │
  ▼
analyze_job
  │
  ├──────────────┐
  │              │
  ▼              ▼
tailor_resume    write_cover_letter   ← parallel execution
  │              │
  ├──────────────┘
  │
  ▼
review_application
  │
  ├── PASS ──────────────► save_outputs → END
  │
  └── NEEDS_REVISION ────► tailor_resume (loop back, max 1 retry)
```

Three key features:

1. **Parallel execution** — Resume Tailor and Cover Letter Writer run simultaneously
2. **Conditional routing** — the Reviewer decides pass or revise
3. **Bounded loop** — revision happens at most once to prevent infinite cycles

## Build the Graph

```python
# graph.py
# ==========================================
# LangGraph workflow — wires all agents together
# ==========================================

from typing import Literal
from langgraph.graph import StateGraph, START, END
from state import JobApplicationState
from agents.analyzer import analyze_job
from agents.tailor import tailor_resume
from agents.writer import write_cover_letter
from agents.reviewer import review_application
from utils import save_output


# ------------------------------------------
# Output node — saves all files to disk
# ------------------------------------------

def save_outputs(state: JobApplicationState) -> dict:
    """Save the final application materials to the output directory."""
    if state.get("tailored_resume"):
        path = save_output("tailored_resume.md", state["tailored_resume"])
        print(f"  Saved: {path}")

    if state.get("cover_letter"):
        path = save_output("cover_letter.md", state["cover_letter"])
        print(f"  Saved: {path}")

    if state.get("review"):
        path = save_output("review.md", state["review"])
        print(f"  Saved: {path}")

    return {}


# ------------------------------------------
# Routing function — decides pass or revise
# ------------------------------------------

def should_revise(state: JobApplicationState) -> Literal["save", "revise"]:
    """Check if the application passed review or needs revision."""
    # Count how many times we have reviewed (prevent infinite loops)
    # We track this by checking if the review mentions "NEEDS_REVISION"
    # and if we already have a tailored resume (meaning this is a re-review)
    if state.get("review_passed", False):
        return "save"

    # Allow one revision cycle, then force save
    if state.get("tailored_resume") and "REVISED" not in state.get("review", ""):
        return "revise"

    # Fallback — save what we have
    return "save"


# ------------------------------------------
# Build the graph
# ------------------------------------------

def build_graph() -> StateGraph:
    """Construct the complete job application pipeline."""

    builder = StateGraph(JobApplicationState)

    # --- Add all nodes ---
    builder.add_node("analyze", analyze_job)
    builder.add_node("tailor", tailor_resume)
    builder.add_node("writer", write_cover_letter)
    builder.add_node("review", review_application)
    builder.add_node("save", save_outputs)

    # --- Wire the edges ---

    # START → analyze (always the first step)
    builder.add_edge(START, "analyze")

    # analyze → tailor AND writer (parallel fan-out)
    builder.add_edge("analyze", "tailor")
    builder.add_edge("analyze", "writer")

    # tailor → review AND writer → review (parallel fan-in)
    builder.add_edge("tailor", "review")
    builder.add_edge("writer", "review")

    # review → conditional: save or revise
    builder.add_conditional_edges(
        "review",
        should_revise,
        {
            "save": "save",
            "revise": "tailor",  # Loop back to rewrite the resume
        },
    )

    # save → END
    builder.add_edge("save", END)

    return builder.compile()


# ------------------------------------------
# Export the compiled graph
# ------------------------------------------

app = build_graph()
```

## Understanding Parallel Fan-Out / Fan-In

This is the most important pattern in the graph:

```python
# Fan-out: one node connects to two downstream nodes
builder.add_edge("analyze", "tailor")
builder.add_edge("analyze", "writer")

# Fan-in: two nodes connect to one downstream node
builder.add_edge("tailor", "review")
builder.add_edge("writer", "review")
```

When `analyze` completes, LangGraph sees that both `tailor` and `writer` are ready to run. Since they have no dependency on each other, **LangGraph runs them in parallel**.

The `review` node waits for both `tailor` and `writer` to finish before it starts — it needs both the tailored resume and the cover letter to do its review.

This is free parallelism. You did not write any threading or async code. The graph structure implies it.

## Understanding the Revision Loop

The conditional edge after `review` creates a bounded loop:

```python
builder.add_conditional_edges(
    "review",
    should_revise,
    {
        "save": "save",       # Passed → save and finish
        "revise": "tailor",   # Failed → rewrite the resume
    },
)
```

If the Reviewer says `NEEDS_REVISION`, the pipeline loops back to the Resume Tailor. The tailor rewrites the resume with the review feedback now in the state. Then it flows back to the Reviewer.

The `should_revise` function limits this to one retry to prevent infinite loops. In production, you would add a more robust counter.

## Test the Graph

```python
# test_graph.py
# ==========================================
# Test the complete pipeline with a sample job
# ==========================================

from graph import app
from utils import load_file

resume = load_file("sample_resume.md")

job_posting = """
Senior Python Developer — DataFlow Inc.

We are looking for a Senior Python Developer to join our platform team.
You will design and build core data pipeline services.

Requirements:
- 5+ years of professional Python experience
- Strong experience with FastAPI or Django
- Experience with distributed systems (Kafka, RabbitMQ)
- PostgreSQL and Redis proficiency
- Docker and Kubernetes experience
- CI/CD pipeline experience

We are a remote-first startup that values ownership and shipping fast.
"""

# Run the full pipeline
print("Running job application pipeline...")
print("=" * 50)

result = app.invoke({
    "job_posting": job_posting,
    "resume": resume,
})

print("\n" + "=" * 50)
print(f"Company: {result.get('company_name')}")
print(f"Title: {result.get('job_title')}")
print(f"Review passed: {result.get('review_passed')}")
print(f"\nCheck the output/ directory for your files.")
```

```bash
python test_graph.py
```

You should see:
- The Job Analyzer running first
- The Resume Tailor and Cover Letter Writer running (potentially in parallel)
- The Application Reviewer scoring the results
- Files saved to the `output/` directory

Clean up:

```bash
rm test_graph.py
```

## Key Design Decisions

| Decision | Why |
|----------|-----|
| **Parallel branches** | Resume and cover letter are independent — no reason to wait |
| **Bounded revision loop** | Prevents infinite cycles while allowing quality improvement |
| **Separate save node** | Keeps file I/O out of the agent logic — clean separation |
| **`should_revise` as a function** | Routing logic is testable independently of the graph |

---

**Reference:** [LangGraph Branching](https://langchain-ai.github.io/langgraph/how-tos/branching/) · [Conditional Edges](https://langchain-ai.github.io/langgraph/concepts/low_level/#conditional-edges)

[← The Application Reviewer](07-the-application-reviewer.md) | [Next: Step 9 - Run Locally →](09-run-locally.md)
