# State Schema Design

**One-Line Summary**: Well-designed state schemas keep agent data flat, typed, and organized with reducers for messages, audit trails, and error tracking -- making persistence, debugging, and scaling straightforward.

**Prerequisites**: `graph-state.md`, `checkpointers.md`, `reducers.md`

## What Is State Schema Design?

Think of a state schema as the blueprint for a warehouse. A well-designed warehouse has labeled sections, standardized shelving, and clear pathways -- anyone can find anything quickly. A poorly designed warehouse is a pile of boxes where finding one item means digging through everything. Your agent's state schema determines whether debugging takes seconds or hours.

In LangGraph, the state schema is a TypedDict (or Pydantic model) that defines every piece of data your agent tracks. Since checkpointers save and restore the entire state, and every node reads from and writes to it, the schema is the single most important design decision in your agent architecture. A good schema separates concerns clearly: messages for conversation, fields for task tracking, counters for error handling, and lists for audit trails.

Getting the schema right early saves enormous refactoring pain later. Unlike a regular Python dict where you can toss in any key at runtime, a well-typed schema enforces structure, catches bugs at definition time, and makes state inspection output immediately readable.

## How It Works

### Basic Schema with Messages

Start with `MessagesState` for simple conversational agents, or define your own for more control:

```python
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import MessagesState, add_messages

# Option 1: Use the built-in (just messages)
# class State(MessagesState): ...

# Option 2: Extend with custom fields
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    current_task: str
    iteration_count: int
```

### Adding Audit Trails with Reducers

Use `operator.add` to create append-only lists that accumulate across nodes:

```python
import operator
from typing import Annotated, Optional

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    actions_taken: Annotated[list[str], operator.add]
    tools_called: Annotated[list[str], operator.add]

# In a node -- return a list, it gets appended automatically
def research_node(state: AgentState):
    # ... do research ...
    return {
        "actions_taken": ["searched_web_for_topic"],
        "tools_called": ["tavily_search"]
    }
```

### Error Handling Fields

Include fields for tracking errors and retry state:

```python
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    current_task: str
    error: Optional[str]
    retry_count: int
    last_successful_step: Optional[str]

def tool_node(state: AgentState):
    try:
        result = execute_tool(state["current_task"])
        return {
            "error": None,
            "retry_count": 0,
            "last_successful_step": "tool_execution"
        }
    except Exception as e:
        return {
            "error": str(e),
            "retry_count": state["retry_count"] + 1
        }
```

### Complete Production Schema Example

```python
import operator
from typing import Annotated, Optional
from typing_extensions import TypedDict
from langgraph.graph import add_messages

class ProductionAgentState(TypedDict):
    messages: Annotated[list, add_messages]       # Conversation
    current_task: Optional[str]                   # Task tracking
    task_status: str                              # "pending" | "in_progress" | "completed"
    actions_taken: Annotated[list[str], operator.add]  # Audit trail
    error: Optional[str]                          # Error handling
    retry_count: int
    final_output: Optional[str]                   # Results
```

## Why It Matters

1. **Checkpointers persist the entire state** -- every field you define is saved and restored, so the schema determines what survives across invocations.
2. **Flat schemas simplify debugging** -- when you inspect state with `get_state()`, flat fields are immediately readable versus deeply nested structures.
3. **Reducers prevent data loss** -- without `add_messages`, returning messages from a node would overwrite the entire conversation history instead of appending.
4. **Error fields enable self-healing** -- an agent can check `retry_count` and `error` to decide whether to retry, escalate, or fail gracefully.
5. **Audit trails support compliance** -- append-only `actions_taken` lists create a complete record of every decision the agent made.

## Key Technical Details

- Use `Annotated[list, add_messages]` for message fields to ensure append behavior, not overwrite.
- Use `Annotated[list[str], operator.add]` for any accumulating list (audit logs, tool calls, errors).
- Fields without a reducer annotation use last-write-wins semantics -- the most recent node's return value replaces the previous value.
- `Optional[T]` fields default to `None` if not set in the initial input.
- Keep state flat -- avoid nested dicts or complex objects that are hard to inspect and serialize.
- Every field in the schema is persisted by the checkpointer on every step, so avoid storing large blobs unnecessarily.
- Pydantic `BaseModel` can replace `TypedDict` for runtime validation, but adds serialization overhead.

## Common Misconceptions

- **"You can add new fields to state at runtime without defining them in the schema."** TypedDict schemas are fixed at definition time. Any field your nodes read or write must be declared in the schema.
- **"The `add_messages` reducer replaces old messages with new ones."** It appends new messages to the existing list. It also handles deduplication by message ID, updating existing messages rather than creating duplicates.
- **"Deeply nested state objects work fine with checkpointers."** While technically serializable, deeply nested state makes inspection output unreadable, debugging difficult, and reducer logic complex. Flat schemas are strongly preferred.
- **"You only need a messages field for a conversational agent."** Even simple agents benefit from `error`, `retry_count`, and `actions_taken` fields for production reliability and observability.

## Connections to Other Concepts

- `graph-state.md` -- foundational concepts of state in LangGraph
- `reducers.md` -- how `add_messages` and `operator.add` control state updates
- `checkpointers.md` -- persists the state you design here
- `thread-based-memory.md` -- thread memory stores instances of this schema
- `state-inspection-and-replay.md` -- well-designed state makes inspection useful
- `long-term-memory-store.md` -- complements schema-level state with cross-thread knowledge

## Further Reading

- [LangGraph State Schema Documentation](https://langchain-ai.github.io/langgraph/concepts/low_level/#state)
- [How to Define Graph State](https://langchain-ai.github.io/langgraph/how-tos/state-model/)
- [LangGraph Reducers Guide](https://langchain-ai.github.io/langgraph/concepts/low_level/#reducers)
- [MessagesState Reference](https://langchain-ai.github.io/langgraph/concepts/low_level/#messagesstate)
