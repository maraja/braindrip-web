# Interrupt and Resume

**One-Line Summary**: The `interrupt()` function from `langgraph.types` pauses graph execution, surfaces a payload to the caller, and waits for human input before resuming via `Command(resume=value)`.

**Prerequisites**: `checkpointers.md`, `the-command-api.md`, `state-and-state-schema.md`

## What Is Interrupt and Resume?

Imagine a factory assembly line with a big red "PAUSE" button at a quality-check station. When the product reaches that station, the line stops, a light flashes showing what needs inspection, and a human operator examines the item. Only after the operator presses "CONTINUE" -- possibly with an adjustment note -- does the line start moving again. The `interrupt()` function is that pause button for your LangGraph agent.

In LangGraph, `interrupt()` is a built-in primitive that halts graph execution mid-node, packages an arbitrary payload for the human caller, and suspends the graph's state to a checkpointer. The graph stays frozen at that exact point -- no data is lost, no node re-executes. When the human is ready, they resume execution by invoking the graph again with `Command(resume=value)`, and the node picks up right where it left off, with the human's response now assigned to the variable that called `interrupt()`.

This mechanism is the foundation for every human-in-the-loop pattern in LangGraph. Approval gates, content review, and tool-level approval are all built on top of `interrupt()` and `Command(resume=...)`.

## How It Works

### Core Requirements

Two things **must** be in place before `interrupt()` will work:

1. The graph must be compiled with a **checkpointer** (e.g., `MemorySaver`, `PostgresSaver`).
2. Every invocation must include a **`thread_id`** in the config so the checkpointer knows which conversation to suspend and resume.

### Basic Pattern

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command

class State(TypedDict):
    action: str
    approved: bool

def propose(state: State) -> dict:
    return {"action": "Send 10,000 marketing emails"}

def human_review(state: State) -> dict:
    # interrupt() pauses here and surfaces the payload
    response = interrupt({
        "question": "Do you approve this action?",
        "proposed_action": state["action"]
    })
    return {"approved": response}

def execute(state: State) -> dict:
    if state["approved"]:
        return {"action": f"EXECUTED: {state['action']}"}
    return {"action": "CANCELLED"}

builder = StateGraph(State)
builder.add_node("propose", propose)
builder.add_node("human_review", human_review)
builder.add_node("execute", execute)
builder.add_edge(START, "propose")
builder.add_edge("propose", "human_review")
builder.add_edge("human_review", "execute")
builder.add_edge("execute", END)

graph = builder.compile(checkpointer=MemorySaver())
```

### Running the Interrupt-Resume Cycle

```python
config = {"configurable": {"thread_id": "session-42"}}

# Step 1: Run until the interrupt fires
result = graph.invoke({"action": "", "approved": False}, config=config)
# result["__interrupt__"] contains the payload:
# [Interrupt(value={"question": "Do you approve?", ...})]

# Step 2: Resume with the human's decision
final = graph.invoke(Command(resume=True), config=config)
print(final["action"])  # "EXECUTED: Send 10,000 marketing emails"
```

### What Happens Under the Hood

1. The graph executes nodes normally until it hits `interrupt()`.
2. The current node's execution is suspended; state is saved to the checkpointer.
3. The `invoke` call returns with an `__interrupt__` key holding the payload.
4. On the next `invoke` with `Command(resume=value)`, the checkpointer restores state.
5. The node resumes from the `interrupt()` call, with `value` as its return value.
6. Execution continues through remaining nodes normally.

## Why It Matters

1. **Safety for high-stakes actions** -- Agents can propose dangerous operations (deletes, payments, emails) without executing them until a human confirms.
2. **Asynchronous workflows** -- The graph can pause for minutes, hours, or days. The checkpointer preserves state across server restarts.
3. **Auditability** -- Every interrupt creates a checkpoint, giving you a full record of what was proposed and what was approved.
4. **Flexible payloads** -- The interrupt value can be any serializable object: strings, dicts, lists, or structured data for rich UIs.
5. **Composable** -- Multiple `interrupt()` calls can exist in different nodes, creating multi-step human review flows.

## Key Technical Details

- `interrupt()` is imported from `langgraph.types`, not `langgraph.graph`.
- The interrupt payload must be JSON-serializable.
- Without a checkpointer, calling `interrupt()` raises a runtime error.
- Without a `thread_id` in config, the checkpointer cannot locate the suspended state.
- `Command` is also imported from `langgraph.types`.
- The `__interrupt__` key in the result is a list of `Interrupt` objects, each with a `.value` attribute.
- You can call `interrupt()` multiple times in the same node; each resume handles the next one sequentially.
- Streaming works with interrupts -- use `stream()` and look for interrupt events.

## Common Misconceptions

- **"You can use interrupt() without a checkpointer."** No. The graph must be compiled with a checkpointer. Without one, there is no mechanism to save and restore the suspended state, and `interrupt()` will fail.
- **"Resuming re-runs the entire graph from the start."** It does not. The checkpointer restores the graph to the exact point where `interrupt()` was called, and execution continues from there.
- **"The interrupt payload is limited to strings."** Any JSON-serializable Python object works -- dictionaries, lists, numbers, nested structures -- enabling rich review interfaces.
- **"You need a special server to handle interrupts."** Interrupt and resume work in a plain Python script. The caller just needs to handle the two-phase invoke pattern.

## Connections to Other Concepts

- `../04-memory-and-persistence/checkpointers.md` -- The persistence layer that makes interrupt/resume possible.
- `../04-memory-and-persistence/thread-based-memory.md` -- Thread IDs that identify which suspended conversation to resume.
- `../01-langgraph-foundations/the-command-api.md` -- The `Command` object used for resuming and for routing control.
- `approval-gates.md` -- A pattern built directly on interrupt and resume.
- `content-review-pattern.md` -- Another pattern using interrupt to surface generated content for editing.
- `tool-level-approval.md` -- Using interrupt inside tool functions for fine-grained control.

## Further Reading

- [LangGraph Human-in-the-Loop Guide](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/) -- Official conceptual guide.
- [LangGraph interrupt() API Reference](https://langchain-ai.github.io/langgraph/reference/types/#langgraph.types.interrupt) -- Function signature and details.
- [How to Add Human-in-the-Loop (How-To)](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/wait-user-input/) -- Step-by-step tutorial.
- [LangGraph Checkpointer Docs](https://langchain-ai.github.io/langgraph/concepts/persistence/) -- Understanding the persistence layer.
