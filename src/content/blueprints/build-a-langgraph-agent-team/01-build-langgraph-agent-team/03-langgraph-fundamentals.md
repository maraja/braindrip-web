# Step 3: LangGraph Fundamentals

One-Line Summary: Learn the four building blocks of every LangGraph application — State, Nodes, Edges, and Conditional Edges — by building a minimal graph before tackling the full agent system.

Prerequisites: Working setup from Step 2

---

## The Four Building Blocks

Every LangGraph application has four parts:

| Building Block | What It Is |
|---------------|-----------|
| **State** | A typed dictionary that flows through the graph. Each node reads from it and writes to it. |
| **Nodes** | Python functions that do work — call an LLM, process data, save files. Each node receives the state and returns updates. |
| **Edges** | Connections between nodes that define the flow. "After node A, run node B." |
| **Conditional Edges** | Branches that route to different nodes based on the current state. "If X, go to node B. If Y, go to node C." |

## 1. State: The Shared Backbone

State is a `TypedDict` that every node can read from and write to. It is the shared memory of your graph:

```python
# A simple state definition
from typing import TypedDict

class JobApplicationState(TypedDict):
    job_posting: str        # Raw job posting text
    resume: str             # User's original resume
    requirements: str       # Extracted job requirements
    tailored_resume: str    # Rewritten resume
    cover_letter: str       # Generated cover letter
    review: str             # Quality review notes
```

When a node returns `{"requirements": "5+ years Python..."}`, LangGraph merges that into the state. Other nodes see the updated value on their next read.

## 2. Nodes: Functions That Do Work

A node is any Python function that takes the state and returns a partial state update:

```python
def analyze_job(state: JobApplicationState) -> dict:
    """Extract requirements from the job posting."""
    # Call an LLM, parse text, whatever you need
    requirements = extract_requirements(state["job_posting"])
    return {"requirements": requirements}
```

Rules:
- **Input:** The full state object
- **Output:** A dictionary with only the keys you want to update
- **No side effects on state:** Return updates, don't mutate the input

## 3. Edges: The Wiring

Edges connect nodes in sequence:

```python
from langgraph.graph import StateGraph, START, END

graph = StateGraph(JobApplicationState)

# Add nodes
graph.add_node("analyze", analyze_job)
graph.add_node("tailor", tailor_resume)
graph.add_node("review", review_application)

# Wire them: START → analyze → tailor → review → END
graph.add_edge(START, "analyze")
graph.add_edge("analyze", "tailor")
graph.add_edge("tailor", "review")
graph.add_edge("review", END)
```

`START` and `END` are special constants. `START` marks where the graph begins. `END` marks where it finishes and returns the final state.

## 4. Conditional Edges: Branching Logic

Conditional edges let you route to different nodes based on the state:

```python
from typing import Literal

def should_write_cover_letter(state: JobApplicationState) -> Literal["write_letter", "skip_letter"]:
    """Decide if a cover letter is needed."""
    if "cover letter required" in state["requirements"].lower():
        return "write_letter"
    return "skip_letter"

graph.add_conditional_edges(
    "analyze",                    # After this node...
    should_write_cover_letter,    # Run this function...
    {                             # And route based on return value:
        "write_letter": "writer",
        "skip_letter": "review",
    }
)
```

The routing function returns a string key. The dictionary maps keys to node names.

## Putting It Together: A Minimal Graph

Let's build a tiny graph to see all four pieces in action:

```python
# mini_graph.py
# ==========================================
# Minimal LangGraph example — learn the basics
# ==========================================

from typing import TypedDict, Literal
from langgraph.graph import StateGraph, START, END

# --- State ---
class State(TypedDict):
    topic: str
    research: str
    draft: str
    needs_revision: bool
    final: str

# --- Nodes ---
def research_node(state: State) -> dict:
    """Simulate researching a topic."""
    return {"research": f"Key facts about {state['topic']}: [fact 1, fact 2, fact 3]"}

def draft_node(state: State) -> dict:
    """Simulate writing a draft from research."""
    return {
        "draft": f"Draft article based on: {state['research']}",
        "needs_revision": len(state.get("research", "")) < 50,
    }

def revise_node(state: State) -> dict:
    """Simulate revising a draft."""
    return {
        "final": f"REVISED: {state['draft']}",
        "needs_revision": False,
    }

def publish_node(state: State) -> dict:
    """Simulate publishing the final version."""
    content = state.get("final", state["draft"])
    return {"final": f"PUBLISHED: {content}"}

# --- Conditional Edge ---
def check_quality(state: State) -> Literal["revise", "publish"]:
    """Route based on whether the draft needs revision."""
    if state.get("needs_revision", False):
        return "revise"
    return "publish"

# --- Build the Graph ---
builder = StateGraph(State)

builder.add_node("research", research_node)
builder.add_node("draft", draft_node)
builder.add_node("revise", revise_node)
builder.add_node("publish", publish_node)

builder.add_edge(START, "research")
builder.add_edge("research", "draft")
builder.add_conditional_edges("draft", check_quality)
builder.add_edge("revise", "publish")
builder.add_edge("publish", END)

# --- Compile and Run ---
graph = builder.compile()

result = graph.invoke({"topic": "LangGraph multi-agent systems"})
print(f"Final output: {result['final']}")
```

Run it:

```bash
python mini_graph.py
```

## Visualizing the Flow

The graph you just built looks like this:

```
START
  │
  ▼
research
  │
  ▼
draft
  │
  ├──── needs_revision=True ────► revise ──┐
  │                                         │
  └──── needs_revision=False ───► publish ◄─┘
                                     │
                                     ▼
                                    END
```

This is exactly the pattern we will use for the job application system — but with real LLM calls in each node.

## Key Rules to Remember

1. **State is immutable from the node's perspective.** Return updates as a dictionary. LangGraph merges them for you.
2. **Nodes are just functions.** No special decorators, no base classes. Any function that takes state and returns a dict works.
3. **Edges define execution order.** Normal edges for fixed flow, conditional edges for branching.
4. **The graph must be compiled** before you can run it. `graph = builder.compile()` produces the runnable.
5. **`invoke()` runs the graph** with an initial state and returns the final state after all nodes have executed.

Clean up:

```bash
rm mini_graph.py
```

---

**Reference:** [LangGraph Concepts](https://langchain-ai.github.io/langgraph/concepts/) · [StateGraph API](https://langchain-ai.github.io/langgraph/reference/graphs/)

[← Project Setup](02-project-setup.md) | [Next: Step 4 - The Job Analyzer →](04-the-job-analyzer.md)
