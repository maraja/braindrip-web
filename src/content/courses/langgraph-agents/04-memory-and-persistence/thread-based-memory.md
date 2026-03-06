# Thread-Based Memory

**One-Line Summary**: Thread-based memory gives an agent short-term recall within a single conversation by persisting messages across invocations that share the same `thread_id`.

**Prerequisites**: `checkpointers.md`, `graph-state.md`, `message-handling.md`

## What Is Thread-Based Memory?

Imagine calling a customer support line. As long as you stay on the same call, the agent remembers everything you have said. But if you hang up and call back, you get a fresh agent who knows nothing about your previous call. Thread-based memory works exactly like this -- it is the "same call" memory for your LangGraph agent.

When you attach a checkpointer to your graph and invoke it with a `thread_id`, every message and state update is automatically saved. The next time you invoke the graph with the same `thread_id`, the agent picks up with full context of the previous exchange. This is short-term, session-scoped memory -- it lives and dies with the thread.

Thread isolation is a critical property. Two users chatting with your agent simultaneously will never see each other's messages because they use different `thread_id` values. Each thread is a completely independent conversation with its own state history.

## How It Works

### Enabling Thread-Based Memory

Thread-based memory requires two things: a checkpointer and a `thread_id`. There is no additional configuration:

```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, MessagesState

builder = StateGraph(MessagesState)
# ... add nodes and edges ...

checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)
```

### Conversational Continuity

Each invocation with the same `thread_id` continues the conversation:

```python
config = {"configurable": {"thread_id": "session-42"}}

# Turn 1
graph.invoke({"messages": [("user", "My name is Bob")]}, config=config)

# Turn 2 -- agent remembers Bob's name from turn 1
graph.invoke({"messages": [("user", "What did I just tell you?")]}, config=config)
# Agent responds: "You told me your name is Bob."
```

### Thread Isolation in Practice

Different `thread_id` values create completely separate conversations:

```python
config_alice = {"configurable": {"thread_id": "alice-session"}}
config_bob = {"configurable": {"thread_id": "bob-session"}}

graph.invoke({"messages": [("user", "I love Python")]}, config=config_alice)
graph.invoke({"messages": [("user", "I love Rust")]}, config=config_bob)

# Alice's thread only knows about Python
graph.invoke({"messages": [("user", "What do I love?")]}, config=config_alice)
# "You said you love Python."

# Bob's thread only knows about Rust
graph.invoke({"messages": [("user", "What do I love?")]}, config=config_bob)
# "You said you love Rust."
```

### Accessing Thread State Programmatically

You can inspect any thread's current state without invoking the graph:

```python
config = {"configurable": {"thread_id": "session-42"}}
state = graph.get_state(config)

# All messages in this thread
for msg in state.values["messages"]:
    print(f"{msg.type}: {msg.content}")

# Which node would run next (empty tuple if graph is finished)
print(state.next)
```

### Managing Thread Lifecycle

Threads accumulate messages over time. For long conversations, manage context window limits by trimming or summarizing:

```python
from langchain_core.messages import trim_messages

def chatbot(state: MessagesState):
    trimmed = trim_messages(state["messages"], max_tokens=4000)
    response = llm.invoke(trimmed)
    return {"messages": [response]}
```

## Why It Matters

1. **Conversational agents feel natural** -- users expect the agent to remember what was said earlier in the same session without repeating themselves.
2. **Multi-turn tool use becomes possible** -- an agent can call a tool in step 1, discuss the results in step 2, and refine the approach in step 3, all within one thread.
3. **Session isolation is automatic** -- no manual scoping or key management is needed; the `thread_id` handles everything.
4. **Context management is your responsibility** -- while memory is automatic, you must handle token limits through trimming or summarization to avoid context window overflow.

## Key Technical Details

- Thread-based memory is entirely powered by checkpointers; there is no separate "memory" component.
- The `thread_id` is a string you control -- it can be a user ID, session token, UUID, or any unique identifier.
- Messages accumulate indefinitely within a thread unless you explicitly trim or summarize them.
- State includes all fields, not just messages -- counters, flags, and metadata persist too.
- Invoking with a new `thread_id` always starts a completely fresh conversation.
- The `MessagesState` built-in schema uses `add_messages` as a reducer, which appends rather than replaces messages automatically.

## Common Misconceptions

- **"Thread memory persists across different thread IDs."** Each `thread_id` is completely isolated. There is zero data sharing between threads unless you use a cross-thread store.
- **"Thread memory handles context window limits automatically."** Messages accumulate without limit. You must implement trimming or summarization yourself to stay within the LLM's context window.
- **"You need a special memory class to enable conversational memory."** No special memory object is needed. A checkpointer plus a `thread_id` is all it takes.
- **"Thread-based memory works without a checkpointer."** Without a checkpointer, every invocation is stateless. The graph starts fresh each time regardless of the `thread_id` you pass.

## Connections to Other Concepts

- `checkpointers.md` -- the mechanism that powers thread-based memory
- `long-term-memory-store.md` -- cross-thread memory for information that should survive beyond a single conversation
- `state-schema-design.md` -- designing state fields that thread memory will persist
- `message-handling.md` -- how messages are structured and managed within state
- `state-inspection-and-replay.md` -- inspecting and replaying thread history

## Further Reading

- [LangGraph Memory Concepts](https://langchain-ai.github.io/langgraph/concepts/memory/)
- [How to Manage Conversation History](https://langchain-ai.github.io/langgraph/how-tos/memory/manage-conversation-history/)
- [Trimming Messages in LangChain](https://python.langchain.com/docs/how_to/trim_messages/)
