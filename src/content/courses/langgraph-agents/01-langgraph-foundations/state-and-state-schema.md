# State and State Schema

**One-Line Summary**: State is a typed, shared data structure that flows through every node in a LangGraph graph, with reducers controlling how concurrent or sequential updates are merged.

**Prerequisites**: `what-is-langgraph.md`

## What Is State?

Imagine a hospital chart that follows a patient from admission through triage, diagnosis, and treatment. Every specialist reads the same chart, adds their notes, and passes it along. No specialist erases what came before — they append. The chart is the single source of truth about the patient's journey.

In LangGraph, **state** is that chart. It is a Python `TypedDict` (or Pydantic model, or dataclass) that every node receives as input and updates as output. Nodes never see each other directly — they communicate exclusively through state. This design makes the graph modular, testable, and easy to reason about.

The critical nuance is **how** updates merge. By default, returning `{"answer": "new"}` from a node replaces the previous value of `answer`. But for fields like message histories, you want to *append* rather than replace. LangGraph handles this through **reducers** — small functions declared in the schema that control merge behavior.

## How It Works

### Basic State Schema

```python
from typing import TypedDict

class AgentState(TypedDict):
    question: str       # replaced on each update
    answer: str         # replaced on each update
    iteration: int      # replaced on each update
```

When a node returns `{"answer": "42"}`, the `answer` field is overwritten. All other fields remain unchanged.

### Reducers with Annotated

```python
import operator
from typing import Annotated, TypedDict

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]  # append on update
    final_answer: str                         # replace on update
```

The `Annotated[list, operator.add]` syntax tells LangGraph: when a node returns `{"messages": [new_msg]}`, concatenate it with the existing list instead of replacing it.

### The add_messages Reducer

For chat-based agents, LangGraph provides a purpose-built reducer:

```python
from langgraph.graph import MessagesState
# MessagesState is equivalent to:
# class MessagesState(TypedDict):
#     messages: Annotated[list[AnyMessage], add_messages]
```

`add_messages` does more than simple append — it deduplicates by message ID. If you return a message with the same `id` as an existing one, it replaces that message in-place rather than appending a duplicate. This is essential for tool-call flows where the LLM message may be updated.

### Partial State Updates

Nodes return only the keys they want to change:

```python
def analyze(state: AgentState) -> dict:
    # Only updates 'final_answer'; 'messages' is untouched
    return {"final_answer": "The answer is 42."}
```

### Custom Reducers

You can write any binary function as a reducer:

```python
def keep_unique(existing: list, new: list) -> list:
    return list(set(existing + new))

class AgentState(TypedDict):
    tags: Annotated[list, keep_unique]
```

## Why It Matters

1. **Single source of truth** — All inter-node communication goes through state, eliminating hidden side channels and making debugging straightforward.
2. **Controlled concurrency** — Reducers ensure that parallel nodes updating the same field produce deterministic results rather than race conditions.
3. **Persistence-ready** — Because state is a serializable dict, checkpointers can snapshot and restore it trivially.
4. **Schema validation** — TypedDict and Pydantic schemas catch malformed updates early, before they propagate through the graph.

## Key Technical Details

- The default reducer is **replacement** — no `Annotated` wrapper means last-write-wins.
- `operator.add` works on lists (concatenation) and numbers (addition).
- `add_messages` is imported from `langgraph.graph.message` and handles ID-based deduplication.
- `MessagesState` is a convenience class with a single `messages` field using `add_messages`.
- State can use Pydantic `BaseModel` instead of `TypedDict` for runtime validation.
- A node returning `None` or `{}` leaves state completely unchanged.
- All state fields must be present in the initial input or have default values; missing keys raise errors at runtime.
- Reducers must be pure functions — they should not have side effects.

## Common Misconceptions

- **"Nodes modify state in place."** Nodes never mutate the state object directly. They return a partial dict, and LangGraph applies the update using the appropriate reducer.
- **"Returning a list replaces the existing list."** Only if no reducer is declared. With `Annotated[list, operator.add]`, the returned list is concatenated with the existing one.
- **"You must use TypedDict."** LangGraph also supports Pydantic models and dataclasses as state schemas, though TypedDict is the most common pattern.
- **"All fields must be returned by every node."** Nodes return only the fields they want to update. Omitted fields are left unchanged.

## Connections to Other Concepts

- `what-is-langgraph.md` — Overview of how state fits into the node-edge-state triad.
- `nodes.md` — How nodes receive state and return partial updates.
- `edges-and-routing.md` — Conditional edges read state to decide routing.
- `graph-compilation.md` — Compile step validates that state schema and node signatures align.
- `the-command-api.md` — Command objects combine state updates with routing directives.
- `../04-memory-and-persistence/` — Checkpointers serialize state for long-running conversations.

## Further Reading

- [LangGraph State Documentation](https://langchain-ai.github.io/langgraph/concepts/low_level/#state) — Official reference on state schemas and reducers.
- [LangGraph MessagesState Reference](https://langchain-ai.github.io/langgraph/concepts/low_level/#messagesstate) — Details on the built-in messages reducer.
- [Python typing.Annotated PEP 593](https://peps.python.org/pep-0593/) — The Python standard behind LangGraph's reducer syntax.
