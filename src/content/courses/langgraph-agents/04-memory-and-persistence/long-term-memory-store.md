# Long-Term Memory Store

**One-Line Summary**: Cross-thread memory using a Store lets agents persist knowledge -- user preferences, learned facts, and accumulated context -- across entirely separate conversations.

**Prerequisites**: `checkpointers.md`, `thread-based-memory.md`, `graph-state.md`

## What Is Long-Term Memory Store?

Think of thread-based memory as a notepad you use during a single phone call -- when the call ends, the notepad is set aside. Long-term memory is the filing cabinet in the back office. Information placed there survives across calls, across days, and across different conversations. Any agent handling any thread for the same user can open that cabinet and retrieve what was stored.

In LangGraph, the Store is a key-value system that lives alongside the checkpointer. While the checkpointer handles within-thread memory (short-term), the Store handles across-thread memory (long-term). You can store user preferences ("Alice prefers dark mode"), learned facts ("Bob's project deadline is March 15"), or accumulated knowledge that should follow a user from session to session.

The combination of a checkpointer and a Store gives your agent both short-term conversational recall and long-term institutional memory -- similar to how a human support agent remembers your current call details while also having access to your account history in a CRM.

## How It Works

### Setting Up the Store

Compile your graph with both a checkpointer (short-term) and a store (long-term):

```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.store.memory import InMemoryStore

checkpointer = MemorySaver()
store = InMemoryStore()

graph = builder.compile(checkpointer=checkpointer, store=store)
```

### Writing to the Store

Inside a node function, access the store via the config and save items under a namespace:

```python
from langgraph.store.base import BaseStore

def save_preference(state, config, *, store: BaseStore):
    user_id = config["configurable"]["user_id"]
    namespace = ("user_preferences", user_id)

    store.put(
        namespace=namespace,
        key="theme",
        value={"preference": "dark_mode", "set_on": "2025-01-15"}
    )
    return state
```

### Reading from the Store

Retrieve items from any thread, as long as you know the namespace:

```python
def load_preferences(state, config, *, store: BaseStore):
    user_id = config["configurable"]["user_id"]
    namespace = ("user_preferences", user_id)

    items = store.search(namespace)
    preferences = {item.key: item.value for item in items}

    return {"user_context": preferences}
```

### Full Example -- Cross-Thread Recall

```python
config_thread_1 = {
    "configurable": {"thread_id": "morning-chat", "user_id": "alice"}
}
config_thread_2 = {
    "configurable": {"thread_id": "evening-chat", "user_id": "alice"}
}

# Morning conversation -- agent learns Alice's preference
graph.invoke(
    {"messages": [("user", "I prefer concise answers")]},
    config=config_thread_1
)

# Evening conversation -- different thread, same user
# Agent retrieves Alice's stored preference and responds concisely
graph.invoke(
    {"messages": [("user", "Explain recursion")]},
    config=config_thread_2
)
```

### Namespace Design Patterns

Organize stored data with meaningful namespace tuples:

```python
# Per-user preferences
("preferences", user_id)

# Per-user, per-topic knowledge
("knowledge", user_id, "project_alpha")

# Shared organizational knowledge
("org", org_id, "policies")
```

## Why It Matters

1. **Personalization across sessions** -- agents remember user preferences, communication style, and context without users repeating themselves every conversation.
2. **Knowledge accumulation** -- agents build up domain knowledge over time, becoming more useful with each interaction.
3. **Multi-agent coordination** -- different agents can share knowledge about the same user through a common store.
4. **Separation of concerns** -- short-term conversational state (checkpointer) is cleanly separated from long-term knowledge (store), each with its own lifecycle.

## Key Technical Details

- `InMemoryStore` is for development only; data is lost on process restart.
- The Store uses a namespace-key-value structure: namespaces are tuples of strings, keys are strings, values are dictionaries.
- `store.put()` upserts -- calling it with an existing namespace+key replaces the value.
- `store.search(namespace)` returns all items under a namespace as a list of `Item` objects.
- `store.get(namespace, key)` retrieves a single item by its exact namespace and key.
- Nodes that need store access must declare `store: BaseStore` as a keyword argument.
- The `user_id` (or any custom key) must be passed in the config's `configurable` dict -- it is not automatic.

## Common Misconceptions

- **"The Store replaces the checkpointer."** They serve different purposes. The checkpointer handles within-thread state (messages, current step). The Store handles cross-thread knowledge. You typically need both.
- **"InMemoryStore persists data to disk."** Despite the name, `InMemoryStore` is purely in-process memory. Use a persistent backend for production.
- **"Store data is automatically scoped to the current user."** There is no automatic scoping. You must design your namespace hierarchy to include the user ID or other scoping keys.
- **"The agent automatically decides what to store long-term."** You must explicitly implement the logic for what gets saved to the Store. LangGraph does not automatically promote thread memory to long-term memory.

## Connections to Other Concepts

- `checkpointers.md` -- short-term persistence that complements the Store
- `thread-based-memory.md` -- within-thread memory vs. the Store's cross-thread memory
- `state-schema-design.md` -- designing state that interacts cleanly with stored data
- `state-inspection-and-replay.md` -- inspecting thread state alongside stored knowledge
- `tool-integration.md` -- tools that read/write to the Store for dynamic memory

## Further Reading

- [LangGraph Store Concepts](https://langchain-ai.github.io/langgraph/concepts/memory/#long-term-memory)
- [How to Use Cross-Thread Memory](https://langchain-ai.github.io/langgraph/how-tos/memory/cross-thread-memory/)
- [LangGraph Store API Reference](https://langchain-ai.github.io/langgraph/reference/store/)
