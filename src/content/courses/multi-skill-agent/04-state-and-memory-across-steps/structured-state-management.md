# Structured State Management

**One-Line Summary**: When conversation history alone cannot reliably track complex agent state, typed state objects and explicit key-value stores give agents a structured, programmatically accessible memory that survives context window pressure.

**Prerequisites**: `conversation-as-working-memory.md`, basic Python typing knowledge

## What Is Structured State Management?

Imagine two office workers tracking a project. One uses sticky notes scattered across their desk — each note has a piece of information, but finding anything requires scanning every note, and the desk only holds so many. The other uses a spreadsheet with labeled columns: task status, assignee, deadline, dependencies. Both have the same information, but the spreadsheet worker can instantly look up any field and never loses track as the project grows.

Conversation-based working memory is the sticky notes. Structured state management is the spreadsheet. Instead of relying on the LLM to sift through hundreds of messages to find "what was the user's email again?", you maintain a typed state object that is updated after each step and injected into the prompt in a clean, predictable format.

This matters most when agents handle complex workflows with many variables: multi-stage data pipelines, order processing with several dependent fields, or research tasks that accumulate dozens of findings. The conversation grows noisy; the structured state stays clean.

## How It Works

### When You Need Explicit State vs. Conversation

Not every agent needs structured state. Here is a decision framework:

| Scenario | Conversation Sufficient? | Need Structured State? |
|----------|-------------------------|----------------------|
| Single question-answer | Yes | No |
| 2-3 tool calls, simple flow | Yes | No |
| 5+ tool calls, dependent data | Maybe | Recommended |
| Multiple entities being tracked | No | Yes |
| Workflow with explicit stages | No | Yes |
| Agent needs to report progress % | No | Yes |
| Long-running agent (15+ steps) | No | Yes |

### State Schema Design with TypedDict

LangGraph popularized the pattern of defining agent state as a typed Python dictionary. This gives you IDE support, runtime validation, and clear documentation of what the agent tracks.

```python
from typing import TypedDict, Annotated, List, Optional
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages

class OrderProcessingState(TypedDict):
    """State for an order processing agent."""
    # Conversation messages — the working memory
    messages: Annotated[list, add_messages]

    # Structured fields — explicit state
    customer_id: Optional[str]
    order_id: Optional[str]
    order_status: Optional[str]
    items: List[dict]
    total_amount: Optional[float]
    shipping_address: Optional[str]
    current_stage: str  # "intake" | "validation" | "processing" | "confirmation"
    error_log: List[str]
```

The key insight is that `messages` (conversation) and the structured fields coexist. The conversation handles natural language reasoning; the structured fields handle data that must be reliably accessed.

### Building a Stateful Agent with LangGraph

Here is a complete example of a stateful agent using LangGraph's StateGraph.

```python
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

class ResearchState(TypedDict):
    messages: Annotated[list, add_messages]
    query: str
    sources_found: List[dict]
    facts_extracted: List[str]
    current_step: str
    steps_completed: int

llm = ChatOpenAI(model="gpt-4")

def search_node(state: ResearchState) -> dict:
    """Search for sources related to the query."""
    # Tool execution happens here
    results = web_search(state["query"])
    return {
        "sources_found": results,
        "current_step": "extract",
        "steps_completed": state["steps_completed"] + 1,
    }

def extract_node(state: ResearchState) -> dict:
    """Extract key facts from found sources."""
    facts = []
    for source in state["sources_found"]:
        extracted = extract_facts(source)
        facts.extend(extracted)
    return {
        "facts_extracted": facts,
        "current_step": "synthesize",
        "steps_completed": state["steps_completed"] + 1,
    }

def synthesize_node(state: ResearchState) -> dict:
    """Synthesize facts into a final response."""
    response = llm.invoke(
        f"Synthesize these facts into a coherent answer:\n"
        f"Query: {state['query']}\n"
        f"Facts: {state['facts_extracted']}"
    )
    return {
        "messages": [{"role": "assistant", "content": response.content}],
        "current_step": "done",
        "steps_completed": state["steps_completed"] + 1,
    }

# Build the graph
graph = StateGraph(ResearchState)
graph.add_node("search", search_node)
graph.add_node("extract", extract_node)
graph.add_node("synthesize", synthesize_node)

graph.set_entry_point("search")
graph.add_edge("search", "extract")
graph.add_edge("extract", "synthesize")
graph.add_edge("synthesize", END)

app = graph.compile()
```

### Reducers for Accumulating State

A reducer defines *how* a state field is updated. Without reducers, each update replaces the previous value. With reducers, updates are accumulated.

```python
from typing import Annotated
import operator

class AccumulatingState(TypedDict):
    # This field REPLACES on update (default behavior)
    current_step: str

    # This field APPENDS on update (using add_messages reducer)
    messages: Annotated[list, add_messages]

    # This field EXTENDS on update (list concatenation)
    findings: Annotated[List[str], operator.add]

    # Custom reducer: keep only the highest value
    max_confidence: Annotated[float, max]
```

Here is how reducers affect updates:

```python
# Initial state
state = {
    "current_step": "search",
    "messages": [],
    "findings": ["Earth is round"],
    "max_confidence": 0.7,
}

# Update applied
update = {
    "current_step": "analyze",        # REPLACES: "search" -> "analyze"
    "findings": ["Water is wet"],      # APPENDS: ["Earth is round", "Water is wet"]
    "max_confidence": 0.9,             # MAX: max(0.7, 0.9) = 0.9
}
```

### Key-Value Scratchpads

For simpler use cases, a key-value scratchpad injected into the prompt can work without a full state framework.

```python
class Scratchpad:
    """Simple key-value state injected into the conversation."""
    def __init__(self):
        self.data = {}

    def set(self, key: str, value):
        self.data[key] = value

    def get(self, key: str, default=None):
        return self.data.get(key, default)

    def to_prompt_string(self) -> str:
        """Format for injection into the system prompt."""
        if not self.data:
            return "[Scratchpad is empty]"
        lines = ["[Current Scratchpad]"]
        for k, v in self.data.items():
            lines.append(f"  {k}: {v}")
        return "\n".join(lines)

# Usage in agent loop
scratchpad = Scratchpad()

# After a tool call returns the customer's email
scratchpad.set("customer_email", "alice@example.com")
scratchpad.set("order_id", "ORD-9921")
scratchpad.set("stage", "awaiting_confirmation")

# Inject into messages before each LLM call
messages[0]["content"] = (
    SYSTEM_PROMPT + "\n\n" + scratchpad.to_prompt_string()
)
```

The scratchpad is rebuilt and injected on every call, so the model always sees the current state in a clean format rather than having to extract it from a long conversation.

## Why It Matters

### Structured State Survives Context Window Pressure

When a conversation grows too long and must be trimmed (see `context-window-pressure.md`), you lose information. But structured state exists outside the conversation. Even if you truncate 80% of the message history, the state object still holds every key-value pair. This makes structured state essential for long-running agents.

### State Enables Progress Reporting and Debugging

With structured state, you can build dashboards that show the agent's current stage, completed steps, and accumulated data in real time. Without it, you would have to parse natural language from the conversation to understand where the agent is — an unreliable and fragile approach.

## Key Technical Details

- LangGraph's `StateGraph` is the most widely used framework for typed agent state in Python
- State schemas should include a `messages` field for conversation and explicit fields for structured data
- Reducers control how state fields are updated: replace (default), append (`operator.add`), or custom logic
- Scratchpad state injected into the system prompt adds a fixed token cost per field (~10-20 tokens per key-value pair)
- A scratchpad with 20 entries adds roughly 200-400 tokens per call
- State validation catches bugs early: a field typed as `float` that receives a `str` will raise an error before the agent proceeds
- State checkpointing (serializing state to disk/database) is the foundation of persistent memory (see `persistent-memory-across-sessions.md`)

## Common Misconceptions

**"The conversation is enough — you don't need separate state"**: For short, simple tasks, the conversation is fine. But as task complexity grows, the model's ability to extract specific values from a long conversation degrades. Structured state provides O(1) lookup for any piece of information, regardless of conversation length.

**"Structured state replaces the conversation"**: No. They serve different purposes. The conversation handles natural language reasoning, tool call/result pairs, and nuanced context. Structured state handles discrete facts and workflow stages. Most production agents use both together.

**"State management adds too much complexity"**: A simple key-value scratchpad takes 20 lines of code and dramatically improves reliability for multi-step tasks. You do not need LangGraph or any framework to start — a Python dictionary injected into the prompt is sufficient for many use cases.

## Connections to Other Concepts

- `conversation-as-working-memory.md` — Conversation and structured state are complementary forms of agent memory
- `context-window-pressure.md` — Structured state is resilient to context pruning, unlike conversation-based memory
- `persistent-memory-across-sessions.md` — State checkpointing enables state to persist across sessions
- `chain-of-thought-for-multi-step-tasks.md` — CoT reasoning can be guided by structured state (e.g., "current_step" tells the model where it is)
- `when-to-stop.md` — State fields like `steps_completed` and `current_stage` help determine termination conditions
- `system-prompt-as-agent-dna.md` — Scratchpad state is typically injected alongside or within the system prompt

## Further Reading

- LangGraph Documentation, "State Management" (2024) — Official guide on defining and using TypedDict state in LangGraph
- Harrison Chase, "Building Stateful Agents with LangGraph" (2024) — Tutorial on state schemas, reducers, and checkpointing
- Anthropic, "Tool Use Patterns" (2024) — Patterns for managing tool results and agent state
- Microsoft, "AutoGen: State and Memory" (2024) — Alternative approach to structured agent state in the AutoGen framework
