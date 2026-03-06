# Tool-Level Approval

**One-Line Summary**: Tool-level approval places an `interrupt()` call inside individual tool functions, pausing execution for human review before the tool's side effect runs, with support for parameter modification.

**Prerequisites**: `interrupt-and-resume.md`, `../02-tools-and-models/langchain-tool-decorator.md`, `../02-tools-and-models/tool-node.md`

## What Is Tool-Level Approval?

Think of a pharmacist filling prescriptions. A doctor's order (the LLM's tool call) arrives saying "dispense Drug X, 200mg, to Patient Y." Before handing over the medication, the pharmacist verifies the prescription: Is the dosage safe? Is the patient allergic? The pharmacist can approve as-is, adjust the dosage, or refuse entirely. The check happens at the point of dispensing, not when the doctor writes the order.

Tool-level approval works the same way. Instead of gating an entire node or workflow, you embed `interrupt()` directly inside a tool function -- right before the irreversible side effect. When the LLM decides to call `send_email`, `delete_records`, or `transfer_funds`, the tool pauses, surfaces its parameters to a human, and waits. The human can approve, reject, or modify the parameters before execution proceeds.

This gives the finest granularity of human control. The agent's reasoning and planning run freely, but every dangerous action requires individual sign-off. A single agent turn might invoke five tools, and only the two with side effects pause for approval while the three read-only tools run automatically.

## How It Works

### Embedding interrupt() in a Tool

```python
from langchain_core.tools import tool
from langgraph.types import interrupt

@tool
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email to the specified recipient."""
    # Pause for human review before sending
    decision = interrupt({
        "tool": "send_email",
        "message": "Review this email before sending:",
        "parameters": {"to": to, "subject": subject, "body": body}
    })

    # Handle human response
    if isinstance(decision, dict):
        # Human modified parameters
        to = decision.get("to", to)
        subject = decision.get("subject", subject)
        body = decision.get("body", body)
    elif decision is False or decision == "reject":
        return "Email cancelled by human reviewer."

    # Execute the side effect only after approval
    # email_client.send(to=to, subject=subject, body=body)
    return f"Email sent to {to}: {subject}"
```

### Mixing Approved and Auto-Run Tools

```python
@tool
def search_contacts(query: str) -> str:
    """Search the contact database. Read-only, no approval needed."""
    return f"Found contacts matching '{query}': alice@co.com, bob@co.com"

@tool
def delete_contact(email: str) -> str:
    """Delete a contact. Requires human approval."""
    decision = interrupt({
        "tool": "delete_contact",
        "message": f"Confirm deletion of contact: {email}",
        "parameters": {"email": email}
    })
    if decision != "yes":
        return f"Deletion of {email} cancelled."
    # perform_deletion(email)
    return f"Contact {email} deleted."
```

### Wiring into a ReAct Agent

```python
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o")
tools = [search_contacts, send_email, delete_contact]

agent = create_react_agent(
    model=llm,
    tools=tools,
    checkpointer=MemorySaver()
)

config = {"configurable": {"thread_id": "outreach-1"}}

# Agent plans: search_contacts (auto) -> send_email (pauses)
result = agent.invoke(
    {"messages": [{"role": "user", "content": "Find Alice and email her the Q1 report"}]},
    config=config
)

# The search ran automatically; send_email paused
email_review = result["__interrupt__"][0].value
print(email_review["parameters"])

# Human modifies the subject and approves
agent.invoke(
    Command(resume={"to": "alice@co.com", "subject": "Q1 Report - Final", "body": email_review["parameters"]["body"]}),
    config=config
)
```

### Structured Decision Protocol

For a consistent interface across all gated tools, standardize the resume format:

```python
# Convention: resume with a dict containing "action" and optional "params"
# {"action": "approve"}                     -- run as-is
# {"action": "approve", "params": {...}}     -- run with modifications
# {"action": "reject", "reason": "..."}     -- cancel with reason
```

## Why It Matters

1. **Granular control** -- Only dangerous tools pause; read-only tools run freely, keeping the agent responsive.
2. **Parameter modification** -- Humans can fix errors (wrong recipient, bad amount) without rejecting the entire action.
3. **Selective gating** -- You choose which tools need approval. Adding `interrupt()` to a tool is a single-function change.
4. **Audit trail** -- Each tool-level interrupt creates a checkpoint recording what was proposed and what the human decided.

## Key Technical Details

- The `interrupt()` call goes inside the tool function body, before the side-effect code.
- The tool must be used in a graph compiled with a checkpointer; otherwise `interrupt()` fails.
- Read-only tools should not call `interrupt()` to avoid unnecessary human involvement.
- The resume value can be any type: boolean, string, or a dict with modified parameters.
- Multiple tool calls in a single LLM turn will each pause independently if they contain `interrupt()`.
- The `ToolNode` from `langgraph.prebuilt` handles tools with interrupts transparently.
- Tools with interrupts work in both `create_react_agent` and custom graph architectures.

## Common Misconceptions

- **"Tool-level approval requires modifying ToolNode or the agent loop."** It does not. The `interrupt()` call lives inside the tool function itself. The agent framework handles the pause and resume automatically.
- **"All tools in the agent must have approval."** Only tools with side effects need `interrupt()`. Read-only tools like search or lookup should run without pausing to keep the workflow efficient.
- **"The human can only approve or reject."** The resume value is fully flexible. Humans can return modified parameters, and the tool code applies those modifications before executing.
- **"If one tool pauses, all pending tool calls are cancelled."** Each tool call with `interrupt()` pauses independently. When resumed, remaining tool calls in the same turn continue executing in order.

## Connections to Other Concepts

- `interrupt-and-resume.md` -- The foundational mechanism that `interrupt()` inside tools relies on.
- `approval-gates.md` -- A coarser pattern that gates entire nodes rather than individual tool calls.
- `content-review-pattern.md` -- A related pattern focused on reviewing generated content rather than tool parameters.
- `../02-tools-and-models/langchain-tool-decorator.md` -- The `@tool` decorator used to define tool functions.
- `../02-tools-and-models/tool-node.md` -- The prebuilt node that executes tools, including those with interrupts.
- `../03-building-your-first-agent/prebuilt-react-agent.md` -- The `create_react_agent` helper that supports tool-level approval.

## Further Reading

- [LangGraph Human-in-the-Loop Guide](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/) -- Conceptual overview of all HITL patterns.
- [How to Review Tool Calls](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/review-tool-calls/) -- Official tutorial on gating tool execution.
- [LangGraph interrupt() API Reference](https://langchain-ai.github.io/langgraph/reference/types/#langgraph.types.interrupt) -- Function signature and behavior.
- [LangGraph ToolNode Reference](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.tool_node.ToolNode) -- How ToolNode handles interrupted tools.
