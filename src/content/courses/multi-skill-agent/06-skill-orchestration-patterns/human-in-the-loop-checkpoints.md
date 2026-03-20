# Human-in-the-Loop Checkpoints

**One-Line Summary**: Human-in-the-loop checkpoints pause agent execution at critical decision points to get human approval before proceeding with high-stakes or irreversible actions.

**Prerequisites**: `sequential-skill-chains.md`, basic LangGraph knowledge, understanding of agent tool execution

## What Is Human-in-the-Loop?

Consider an AI assistant that manages your email. It drafts a reply to your boss, and you would probably want to review that draft before it gets sent. Now consider the same assistant filing a support ticket -- you might not care about reviewing that. Human-in-the-loop is the design principle that some agent actions require human approval and others do not, and the system should know the difference.

In agent orchestration, a human-in-the-loop checkpoint is a deliberate pause in execution where the agent presents its intended action to a human, waits for approval (or modification), and only proceeds after receiving the green light. The agent's execution state is persisted so it can resume exactly where it left off, even if the human takes hours to respond.

This is not about the agent being incapable -- it is about risk management. Sending an email, transferring money, deleting data, and deploying code are all actions where the cost of a mistake far exceeds the cost of a brief human review.

## How It Works

### Identifying Checkpoint-Worthy Actions

Not every action needs human approval. The decision depends on reversibility, impact, and confidence:

```python
CHECKPOINT_RULES = {
    "send_email": (True, "External communication cannot be unsent"),
    "delete_file": (True, "Destructive action, may be irreversible"),
    "transfer_money": (True, "Financial transaction"),
    "web_search": (False, "Read-only, no side effects"),
    "read_file": (False, "Read-only, no side effects"),
    "calculate": (False, "Pure computation, no side effects"),
}

def needs_human_approval(action: str, amount: float = 0) -> bool:
    rule = CHECKPOINT_RULES.get(action)
    if rule is None:
        return True  # Unknown actions default to requiring approval
    needs_approval, _ = rule
    if action == "transfer_money" and amount < 10.0:
        return False  # Small amounts auto-approved
    return needs_approval
```

### LangGraph interrupt_before Pattern

LangGraph provides `interrupt_before` to pause execution before a specific node runs. The graph state is persisted, and execution resumes when the human provides input.

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict

class EmailState(TypedDict):
    user_request: str
    draft_email: str
    recipient: str
    subject: str
    human_approved: bool
    send_result: str

def draft_email_node(state: EmailState) -> dict:
    response = llm.invoke(
        f"Draft a professional email.\nRequest: {state['user_request']}\n"
        f"Recipient: {state['recipient']}"
    )
    return {"draft_email": response.content, "subject": extract_subject(response.content)}

def send_email_node(state: EmailState) -> dict:
    result = email_api.send(to=state["recipient"], subject=state["subject"],
                            body=state["draft_email"])
    return {"send_result": f"Sent successfully. ID: {result.id}"}

graph = StateGraph(EmailState)
graph.add_node("draft", draft_email_node)
graph.add_node("send", send_email_node)
graph.add_edge(START, "draft")
graph.add_edge("draft", "send")
graph.add_edge("send", END)

checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer, interrupt_before=["send"])

# Step 1: Run until interrupt
config = {"configurable": {"thread_id": "email-123"}}
result = app.invoke(
    {"user_request": "Thank the client for the meeting",
     "recipient": "client@example.com", "human_approved": False},
    config=config,
)
print(f"Draft:\n{result['draft_email']}\nApprove? [y/n/edit]")

# Step 2: Human approves, resume execution
app.update_state(config, {"human_approved": True})
final_result = app.invoke(None, config=config)
```

### The interrupt() Function Pattern

LangGraph also provides an inline `interrupt()` function for checkpoints within a node, useful when approval logic is part of a larger operation:

```python
from langgraph.types import interrupt, Command

def process_and_maybe_send(state: EmailState) -> dict:
    draft = llm.invoke(f"Draft email for: {state['user_request']}")

    human_response = interrupt({
        "type": "approval_request",
        "message": "Please review this email draft:",
        "draft": draft.content,
        "options": ["approve", "reject", "edit"],
    })

    if human_response["decision"] == "reject":
        return {"send_result": "Cancelled by user"}
    final_draft = human_response.get("edited_text", draft.content)

    result = email_api.send(to=state["recipient"],
                            subject=extract_subject(final_draft), body=final_draft)
    return {"send_result": f"Sent. ID: {result.id}", "draft_email": final_draft}
```

### Multi-Stage Approval and Persistence

Complex workflows may need multiple checkpoints. Use `interrupt_before` with a list of nodes. For production, replace `MemorySaver` with persistent storage so workflows survive server restarts:

```python
from langgraph.checkpoint.sqlite import SqliteSaver

checkpointer = SqliteSaver.from_conn_string("checkpoints.db")
app = graph.compile(
    checkpointer=checkpointer,
    interrupt_before=["execute_plan", "deliver"],  # Two checkpoints
)
```

## Why It Matters

### Risk Mitigation

Autonomous agents that send emails, transfer funds, or modify databases can cause real damage if they make a mistake. A single checkpoint before irreversible actions transforms a potential disaster into a minor inconvenience. The cost of a 30-second human review is negligible compared to the cost of an incorrect wire transfer.

### Regulatory Compliance

Many industries (finance, healthcare, legal) require human oversight for automated decisions. Human-in-the-loop checkpoints provide auditable proof that a human reviewed and approved each consequential action, satisfying compliance requirements without sacrificing automation benefits.

## Key Technical Details

- State serialization adds 10-50ms overhead per interrupt -- negligible compared to human review time
- MemorySaver is for development; use SqliteSaver or PostgresSaver for production persistence
- Each interrupted state consumes 1-100KB of storage depending on graph state size
- The interrupt payload should include all context the human needs to decide, reducing back-and-forth
- Set timeout limits (e.g., 24 hours) with auto-cancellation for abandoned workflows
- Log all human decisions (approve, reject, edit) for audit trails
- Multiple concurrent interrupted workflows need unique thread IDs to avoid state conflicts

## Common Misconceptions

**"Human-in-the-loop means the agent is not autonomous"**: Autonomy is a spectrum. An agent that autonomously researches, analyzes, and drafts -- pausing only for a 5-second approval before sending -- is 99% autonomous. The checkpoint makes it trustworthy, not less capable.

**"Every action should have a human checkpoint"**: Over-checkpointing creates approval fatigue. Humans start rubber-stamping without reading, defeating the purpose. Reserve checkpoints for truly consequential actions and use auto-approval with logging for low-risk ones.

## Connections to Other Concepts

- `the-supervisor-pattern.md` -- The supervisor can include human-in-the-loop at the delegation level
- `sequential-skill-chains.md` -- Checkpoints are inserted between sequential steps
- `conditional-branching.md` -- Some branches may require human approval before proceeding

## Further Reading

- LangGraph Documentation, "Human-in-the-Loop" (2024) -- Official guide to interrupt patterns and state persistence
- Amershi et al., "Guidelines for Human-AI Interaction" (2019) -- Microsoft Research guidelines for human-AI collaboration
- Shneiderman, "Human-Centered AI" (2022) -- Framework for balancing automation with human oversight
