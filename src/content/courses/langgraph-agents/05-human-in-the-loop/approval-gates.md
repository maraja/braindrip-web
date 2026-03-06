# Approval Gates

**One-Line Summary**: An approval gate is a graph pattern where the agent proposes an action, pauses for human approval via `interrupt()`, then executes or cancels based on the human's response.

**Prerequisites**: `interrupt-and-resume.md`, `../04-memory-and-persistence/checkpointers.md`, `../01-langgraph-foundations/edges-and-routing.md`

## What Is an Approval Gate?

Think of an approval gate like a bank teller preparing a large wire transfer. The teller fills out all the paperwork, calculates the fees, and then slides the form under the glass for the customer to review and sign. The money does not move until the customer signs. If the customer catches an error, the teller voids the form and starts over. The teller does the work; the customer controls the risk.

In LangGraph, an approval gate is a three-node pattern: **propose**, **approve**, and **execute**. The agent autonomously prepares an action in the propose node, then the approve node calls `interrupt()` to surface the proposal to a human. The human reviews and responds with approval or rejection. Based on that response, the execute node either carries out the action or gracefully cancels it.

This pattern is essential for any agent that performs irreversible or high-stakes operations -- sending emails, modifying databases, making purchases, or calling external APIs with side effects. The gate gives humans veto power without forcing them to do the agent's work.

## How It Works

### The Three-Node Architecture

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command

class State(TypedDict):
    task: str
    proposal: dict
    approved: bool
    result: str

def propose(state: State) -> dict:
    # Agent autonomously builds the action plan
    proposal = {
        "action": "DELETE",
        "table": "users",
        "filter": f"inactive_since < 2024-01-01",
        "affected_rows": 1_247
    }
    return {"proposal": proposal}

def approve(state: State) -> dict:
    response = interrupt({
        "message": "The agent wants to perform the following action:",
        "proposal": state["proposal"],
        "instructions": "Reply 'yes' to approve or 'no' to reject."
    })
    return {"approved": response.lower().strip() == "yes"}

def execute(state: State) -> dict:
    if state["approved"]:
        # Perform the dangerous operation
        count = state["proposal"]["affected_rows"]
        return {"result": f"Deleted {count} inactive user records."}
    return {"result": "Operation cancelled by human reviewer."}
```

### Wiring the Graph

```python
builder = StateGraph(State)
builder.add_node("propose", propose)
builder.add_node("approve", approve)
builder.add_node("execute", execute)

builder.add_edge(START, "propose")
builder.add_edge("propose", "approve")
builder.add_edge("approve", "execute")
builder.add_edge("execute", END)

graph = builder.compile(checkpointer=MemorySaver())
```

### Running the Approval Flow

```python
config = {"configurable": {"thread_id": "cleanup-job-1"}}

# Phase 1: Agent proposes, gate pauses
result = graph.invoke({"task": "Clean up inactive users"}, config=config)
proposal = result["__interrupt__"][0].value
print(proposal["proposal"])  # Shows the DELETE plan

# Phase 2: Human reviews and resumes
final = graph.invoke(Command(resume="yes"), config=config)
print(final["result"])  # "Deleted 1247 inactive user records."
```

### Conditional Routing After Approval

For more complex flows, use conditional edges to route rejected proposals back for revision:

```python
def route_after_approval(state: State) -> str:
    if state["approved"]:
        return "execute"
    return "revise"

builder.add_conditional_edges("approve", route_after_approval, ["execute", "revise"])
```

## Why It Matters

1. **Risk mitigation** -- Prevents agents from executing destructive or costly operations without human oversight.
2. **Compliance** -- Many regulated industries require human sign-off for automated decisions affecting users or finances.
3. **Trust building** -- Users gain confidence in the agent system when they see exactly what will happen before it happens.
4. **Graceful rejection** -- The cancel path lets the system handle rejections cleanly without crashing or leaving partial state.

## Key Technical Details

- The approve node must call `interrupt()` to pause execution; this requires a checkpointer and `thread_id`.
- The interrupt payload should contain enough context for the human to make an informed decision.
- The resume value can be any type: a boolean, a string like "yes"/"no", or a structured object with modifications.
- Approval gates compose naturally -- you can chain multiple gates for multi-level approval workflows.
- The proposal is saved in the checkpointed state, so it persists across server restarts.
- Conditional edges after the approve node enable rejection-and-revise loops.

## Common Misconceptions

- **"The agent stops completely when it hits the gate."** Only the current graph execution pauses. Other threads and other graphs continue running independently.
- **"Approval gates require a web UI."** They work anywhere -- CLI scripts, Slack bots, email workflows, or REST APIs. The human interface is entirely up to you.
- **"You need one gate per dangerous action."** A single approval node can gate multiple actions by including all proposals in the interrupt payload and routing based on the response.
- **"Rejected proposals are lost."** The full state including the proposal is checkpointed. You can route rejected proposals to a revision node and loop back for re-approval.

## Connections to Other Concepts

- `interrupt-and-resume.md` -- The underlying mechanism that powers the approval pause.
- `content-review-pattern.md` -- A related pattern where the human edits content rather than approving an action.
- `tool-level-approval.md` -- Approval at the individual tool call level rather than the node level.
- `../01-langgraph-foundations/edges-and-routing.md` -- Conditional edges for routing approved vs. rejected proposals.
- `../04-memory-and-persistence/checkpointers.md` -- Persistence layer that preserves the proposal across the approval pause.
- `../04-memory-and-persistence/state-inspection-and-replay.md` -- Reviewing the full history of proposals and approvals.

## Further Reading

- [LangGraph Human-in-the-Loop Guide](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/) -- Conceptual overview of all HITL patterns.
- [How to Review Tool Calls](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/review-tool-calls/) -- Official tutorial on gating tool execution.
- [LangGraph Persistence Docs](https://langchain-ai.github.io/langgraph/concepts/persistence/) -- Understanding checkpointers that enable approval pauses.
