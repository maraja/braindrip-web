# Human-in-the-Loop Checkpoints

**One-Line Summary**: Human-in-the-loop checkpoints pause agent execution at critical decision points to get human approval before proceeding with high-stakes or irreversible actions.

**Prerequisites**: `sequential-skill-chains.md`, basic LangGraph knowledge, understanding of agent tool execution

## What Is Human-in-the-Loop?

Consider an AI assistant that manages your email. It drafts a reply to your boss, and you would probably want to review that draft before it gets sent. Now consider the same assistant filing a support ticket -- you might not care about reviewing that. Human-in-the-loop is the design principle that some agent actions require human approval and others do not, and the system should know the difference.

In agent orchestration, a human-in-the-loop checkpoint is a deliberate pause in execution where the agent presents its intended action to a human, waits for approval (or modification), and only proceeds after receiving the green light. The agent's execution state is persisted so it can resume exactly where it left off, even if the human takes hours to respond.

This is not about the agent being incapable -- it is about risk management. Sending an email, transferring money, deleting data, and deploying code are all actions where the cost of a mistake far exceeds the cost of a brief human review. The checkpoint transforms a fully autonomous agent into a supervised one at precisely the moments that matter.

## How It Works

### Identifying Checkpoint-Worthy Actions

Not every action needs human approval. The decision depends on reversibility, impact, and confidence:

```python
CHECKPOINT_RULES = {
    # Action category: (needs_approval, reason)
    "send_email": (True, "External communication cannot be unsent"),
    "delete_file": (True, "Destructive action, may be irreversible"),
    "transfer_money": (True, "Financial transaction"),
    "deploy_code": (True, "Affects production systems"),
    "web_search": (False, "Read-only, no side effects"),
    "read_file": (False, "Read-only, no side effects"),
    "create_draft": (False, "Draft can be discarded"),
    "calculate": (False, "Pure computation, no side effects"),
}

def needs_human_approval(action: str, amount: float = 0) -> bool:
    """Determine if an action requires human checkpoint."""
    rule = CHECKPOINT_RULES.get(action)
    if rule is None:
        return True  # Unknown actions default to requiring approval
    needs_approval, _ = rule

    # Additional threshold-based rules
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
    """Draft the email content using LLM."""
    response = llm.invoke(
        f"Draft a professional email.\n"
        f"Request: {state['user_request']}\n"
        f"Recipient: {state['recipient']}"
    )
    return {
        "draft_email": response.content,
        "subject": extract_subject(response.content),
    }

def send_email_node(state: EmailState) -> dict:
    """Send the email -- only runs after human approval."""
    result = email_api.send(
        to=state["recipient"],
        subject=state["subject"],
        body=state["draft_email"],
    )
    return {"send_result": f"Sent successfully. ID: {result.id}"}

def confirm_node(state: EmailState) -> dict:
    """Present draft to human for review."""
    # This node's output is what the human sees
    return {
        "draft_email": state["draft_email"],
        "subject": state["subject"],
        "recipient": state["recipient"],
    }

graph = StateGraph(EmailState)
graph.add_node("draft", draft_email_node)
graph.add_node("confirm", confirm_node)
graph.add_node("send", send_email_node)

graph.add_edge(START, "draft")
graph.add_edge("draft", "confirm")
graph.add_edge("confirm", "send")
graph.add_edge("send", END)

# Compile with interrupt BEFORE the send node
checkpointer = MemorySaver()
app = graph.compile(
    checkpointer=checkpointer,
    interrupt_before=["send"],
)

# --- Execution flow ---

# Step 1: Run until interrupt
config = {"configurable": {"thread_id": "email-123"}}
result = app.invoke(
    {
        "user_request": "Thank the client for the meeting",
        "recipient": "client@example.com",
        "human_approved": False,
    },
    config=config,
)
# Execution pauses here -- draft is ready for review

print(f"Subject: {result['subject']}")
print(f"To: {result['recipient']}")
print(f"Draft:\n{result['draft_email']}")
print("\nApprove? [y/n/edit]")

# Step 2: Human reviews and approves
# Resume execution with updated state
app.update_state(config, {"human_approved": True})
final_result = app.invoke(None, config=config)
print(final_result["send_result"])
```

### The interrupt() Function Pattern

LangGraph also provides an `interrupt()` function for inline checkpoints within a node, which is useful when the approval logic is part of a larger node:

```python
from langgraph.types import interrupt, Command

def process_and_maybe_send(state: EmailState) -> dict:
    """Draft, present for review, and send in one node."""
    # Draft the email
    draft = llm.invoke(f"Draft email for: {state['user_request']}")

    # Present to human and wait for approval
    human_response = interrupt({
        "type": "approval_request",
        "message": "Please review this email draft:",
        "draft": draft.content,
        "recipient": state["recipient"],
        "options": ["approve", "reject", "edit"],
    })

    if human_response["decision"] == "reject":
        return {"send_result": "Cancelled by user"}

    if human_response["decision"] == "edit":
        final_draft = human_response["edited_text"]
    else:
        final_draft = draft.content

    # Send the approved/edited email
    result = email_api.send(
        to=state["recipient"],
        subject=extract_subject(final_draft),
        body=final_draft,
    )
    return {"send_result": f"Sent. ID: {result.id}", "draft_email": final_draft}
```

### Budget Confirmation Pattern

For financial actions, the checkpoint includes the cost estimate and asks for explicit budget approval:

```python
def execute_with_budget_check(state: dict) -> dict:
    """Execute an action that costs money, with human budget approval."""
    estimated_cost = estimate_action_cost(state["action"], state["params"])

    if estimated_cost > state.get("auto_approve_limit", 0):
        approval = interrupt({
            "type": "budget_approval",
            "action": state["action"],
            "estimated_cost": f"${estimated_cost:.2f}",
            "description": state["action_description"],
            "budget_remaining": f"${state['budget_remaining']:.2f}",
        })

        if not approval.get("approved"):
            return {"status": "cancelled", "reason": "Budget not approved"}

    result = execute_action(state["action"], state["params"])
    return {
        "status": "completed",
        "result": result,
        "cost_incurred": estimated_cost,
    }
```

### Multi-Stage Approval

Complex workflows may need multiple checkpoints at different stages:

```python
graph = StateGraph(WorkflowState)

graph.add_node("research", research_node)
graph.add_node("plan_review", plan_review_node)       # checkpoint 1
graph.add_node("execute_plan", execute_plan_node)
graph.add_node("result_review", result_review_node)    # checkpoint 2
graph.add_node("deliver", deliver_node)

graph.add_edge(START, "research")
graph.add_edge("research", "plan_review")
graph.add_edge("plan_review", "execute_plan")
graph.add_edge("execute_plan", "result_review")
graph.add_edge("result_review", "deliver")
graph.add_edge("deliver", END)

app = graph.compile(
    checkpointer=checkpointer,
    interrupt_before=["execute_plan", "deliver"],  # two checkpoints
)
```

### State Persistence Across Interrupts

The checkpointer serializes the full graph state when execution pauses, allowing the agent to resume hours or days later:

```python
from langgraph.checkpoint.sqlite import SqliteSaver

# Persistent storage for long-running workflows
checkpointer = SqliteSaver.from_conn_string("checkpoints.db")

app = graph.compile(checkpointer=checkpointer, interrupt_before=["send"])

# Execution pauses and state is saved to SQLite
# The server can restart, and the workflow resumes from the checkpoint
```

## Why It Matters

### Risk Mitigation

Autonomous agents that send emails, transfer funds, or modify databases can cause real damage if they make a mistake. A single checkpoint before irreversible actions transforms a potential disaster into a minor inconvenience (reviewing a draft). The cost of a 30-second human review is negligible compared to the cost of an incorrect wire transfer.

### Regulatory Compliance

Many industries (finance, healthcare, legal) require human oversight for automated decisions. Human-in-the-loop checkpoints provide auditable proof that a human reviewed and approved each consequential action, satisfying compliance requirements without sacrificing automation benefits.

## Key Technical Details

- State serialization for checkpointing adds 10-50ms overhead per interrupt -- negligible compared to human review time
- MemorySaver is suitable for development; use SqliteSaver or PostgresSaver for production persistence
- Each interrupted state consumes storage proportional to the graph state size -- typically 1-100KB per checkpoint
- The interrupt payload should include all context the human needs to make a decision, reducing back-and-forth
- Set timeout limits on human responses (e.g., 24 hours) with auto-cancellation for abandoned workflows
- Log all human decisions (approve, reject, edit) for audit trails and for training future auto-approval models
- Multiple concurrent interrupted workflows each need unique thread IDs to avoid state conflicts

## Common Misconceptions

**"Human-in-the-loop means the agent is not autonomous"**: Autonomy is a spectrum, not a binary. An agent that autonomously researches, analyzes, and drafts -- pausing only for a 5-second human approval before sending -- is 99% autonomous. The checkpoint makes it trustworthy, not less capable.

**"Every action should have a human checkpoint"**: Over-checkpointing creates approval fatigue. Humans start rubber-stamping without reading, defeating the purpose. Reserve checkpoints for truly consequential actions. Use auto-approval with logging for low-risk actions, and full checkpoints for high-risk ones.

## Connections to Other Concepts

- `the-supervisor-pattern.md` -- The supervisor can include human-in-the-loop at the delegation level
- `adaptive-replanning.md` -- Major replanning decisions can be escalated to human review
- `sequential-skill-chains.md` -- Checkpoints are inserted between sequential steps
- `plan-then-execute-pattern.md` -- The plan itself can be a human checkpoint before execution begins

## Further Reading

- LangGraph Documentation, "Human-in-the-Loop" (2024) -- Official guide to interrupt patterns and state persistence
- Amershi et al., "Guidelines for Human-AI Interaction" (2019) -- Microsoft Research guidelines for designing effective human-AI collaboration
- Shneiderman, "Human-Centered AI" (2022) -- Comprehensive framework for balancing automation with human oversight
