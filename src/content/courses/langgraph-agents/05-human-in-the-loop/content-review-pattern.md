# Content Review Pattern

**One-Line Summary**: The content review pattern uses `interrupt()` to surface agent-generated content for human review and optional editing before the content is used downstream.

**Prerequisites**: `interrupt-and-resume.md`, `../04-memory-and-persistence/checkpointers.md`, `../01-langgraph-foundations/state-and-state-schema.md`

## What Is the Content Review Pattern?

Imagine a speechwriter who drafts a keynote address, then hands it to the executive for review. The executive reads the draft, crosses out a few sentences, scribbles in replacements, and hands it back. The speechwriter then delivers the final version to the teleprompter team. The writer does the heavy lifting; the executive shapes the message.

In LangGraph, the content review pattern follows this same flow. An agent generates content -- an email draft, a report summary, a code snippet, a social media post -- and then calls `interrupt()` to surface that content to a human reviewer. The human can accept the content as-is, edit it, or rewrite it entirely. When the human resumes with `Command(resume="final text")`, the graph continues with the human-approved version.

Unlike the approval gate, which is a binary yes/no decision, content review is about **collaborative refinement**. The human is not just deciding whether to proceed -- they are actively shaping the output. This makes it ideal for any workflow where the agent's generation is good but may need human polish, tone adjustment, or factual correction.

## How It Works

### The Generate-Review-Publish Flow

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command

class State(TypedDict):
    topic: str
    draft: str
    final_content: str

def generate_draft(state: State) -> dict:
    # In practice, this calls an LLM
    draft = f"Subject: Weekly Update on {state['topic']}\n\n"
    draft += "Dear team,\n\nHere are the key developments this week..."
    return {"draft": draft}

def review_content(state: State) -> dict:
    # Surface the draft for human review
    reviewed = interrupt({
        "message": "Please review this draft. Return edited version or 'ok' to approve as-is.",
        "draft": state["draft"]
    })
    # If human says "ok", keep original; otherwise use their edits
    if reviewed.strip().lower() == "ok":
        return {"final_content": state["draft"]}
    return {"final_content": reviewed}

def publish(state: State) -> dict:
    # Send the human-approved content
    print(f"Publishing: {state['final_content']}")
    return {}
```

### Building and Running the Graph

```python
builder = StateGraph(State)
builder.add_node("generate", generate_draft)
builder.add_node("review", review_content)
builder.add_node("publish", publish)

builder.add_edge(START, "generate")
builder.add_edge("generate", "review")
builder.add_edge("review", "publish")
builder.add_edge("publish", END)

graph = builder.compile(checkpointer=MemorySaver())
config = {"configurable": {"thread_id": "newsletter-q1"}}

# Phase 1: Generate and pause for review
result = graph.invoke({"topic": "Q1 Revenue"}, config=config)
draft = result["__interrupt__"][0].value["draft"]
print(draft)  # Human reads the draft

# Phase 2: Human edits and resumes
edited = draft.replace("key developments", "critical milestones")
final = graph.invoke(Command(resume=edited), config=config)
```

### Multi-Round Review with a Loop

For content that may need multiple revision passes:

```python
def should_continue(state: State) -> str:
    if state["final_content"]:
        return "publish"
    return "generate"  # Re-generate if human rejected entirely

builder.add_conditional_edges("review", should_continue, ["publish", "generate"])
```

## Why It Matters

1. **Quality assurance** -- LLM-generated content often needs tone, accuracy, or style adjustments that only a human can provide.
2. **Brand safety** -- Marketing and customer-facing content can be reviewed before publication to prevent embarrassing errors.
3. **Legal compliance** -- Regulated communications (financial disclosures, medical information) require human sign-off on exact wording.
4. **Human-AI collaboration** -- The agent handles the heavy lifting of drafting while the human contributes judgment and domain expertise.

## Key Technical Details

- The interrupt payload should include the full generated content plus clear instructions for the reviewer.
- The resume value is typically a string (edited text) but can be a structured object for complex edits.
- Returning `"ok"` or an empty string is a common convention for accepting the draft without changes.
- The original draft remains in the checkpointed state even after the human edits, preserving an audit trail.
- Multiple review nodes can exist in a single graph for different content sections.
- The pattern works with any content type: plain text, HTML, Markdown, JSON, or code.
- Streaming via `stream()` can surface the draft in real time as the LLM generates it, before the interrupt fires.

## Common Misconceptions

- **"The human must accept or reject the entire draft."** The human can return any modification -- a single word change, a full rewrite, or the original text unchanged. The resume value replaces the draft entirely, giving complete flexibility.
- **"Content review requires a rich text editor."** The interface can be as simple as a terminal prompt. The `interrupt()` payload is just data; how you display and collect edits is up to your application.
- **"Edits are lost if the server restarts."** The checkpointer persists the full state including the draft. The human can resume hours or days later and the graph picks up at the same point.
- **"This pattern only works for text content."** You can review and edit any serializable data: JSON configurations, structured records, image generation prompts, or API request parameters.

## Connections to Other Concepts

- `interrupt-and-resume.md` -- The core mechanism that powers the review pause.
- `approval-gates.md` -- A simpler pattern for binary approve/reject decisions without content editing.
- `tool-level-approval.md` -- Reviewing individual tool parameters rather than generated content.
- `../04-memory-and-persistence/checkpointers.md` -- Persistence that preserves drafts across the review pause.
- `../04-memory-and-persistence/state-inspection-and-replay.md` -- Reviewing the history of drafts and edits.
- `../10-practical-projects/multi-agent-content-pipeline.md` -- A full pipeline using content review between writer and editor agents.

## Further Reading

- [LangGraph Human-in-the-Loop Guide](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/) -- Conceptual overview of HITL patterns.
- [How to Wait for User Input](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/wait-user-input/) -- Tutorial on the interrupt/resume cycle.
- [LangGraph Command API Reference](https://langchain-ai.github.io/langgraph/reference/types/#langgraph.types.Command) -- Details on `Command(resume=...)`.
