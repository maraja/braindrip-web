# Customer Support Agent

**One-Line Summary**: A manually constructed support agent that routes simple questions to FAQ lookup, order queries to an order tool, and complex or sensitive issues to a human operator via `interrupt()`.

**Prerequisites**: `manual-react-agent.md`, `edges-and-routing.md`, `state-and-state-schema.md`, `interrupt-and-resume.md`, `checkpointers.md`, `langchain-tool-decorator.md`

## What Is the Customer Support Agent?

This project builds a customer support agent using a manual `StateGraph` with conditional routing. Simple FAQ questions get answered from a knowledge base, order-related queries hit an order lookup tool, and sensitive issues pause execution so a human agent can take over. Conditional routing at the classification node directs each message type to the appropriate handler, and `interrupt()` pauses the graph for human escalation when needed. When the human responds, `Command(resume=value)` injects their reply back into the graph.

## How It Works

### Architecture Overview

The graph has four nodes: a classifier, an FAQ handler, an order lookup handler, and a human escalation node with `interrupt()`.

### Step 1: Define State and Tools

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages
from langchain_core.tools import tool

class SupportState(TypedDict):
    messages: Annotated[list, add_messages]
    category: str  # "faq", "order", "escalate"
    order_info: str

@tool
def lookup_order(order_id: str) -> str:
    """Look up order details by order ID."""
    orders = {
        "12345": "Order #12345: Shipped Feb 20, arriving Feb 27. Item: Blue Widget.",
        "67890": "Order #67890: Processing. Item: Red Gadget. Est. ship: Mar 1.",
    }
    return orders.get(order_id, f"No order found with ID {order_id}.")

@tool
def search_faq(question: str) -> str:
    """Search the FAQ knowledge base for answers."""
    faqs = {
        "return": "Our return policy allows returns within 30 days with receipt.",
        "shipping": "Standard shipping: 5-7 business days. Express: 2-3 days.",
        "payment": "We accept Visa, Mastercard, AMEX, and PayPal.",
    }
    for key, answer in faqs.items():
        if key in question.lower():
            return answer
    return "No FAQ match found. Let me connect you with a team member."
```

### Step 2: Build the Graph

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-sonnet-4-5-20250929")

def classify(state: SupportState) -> dict:
    last_msg = state["messages"][-1].content
    response = llm.invoke(
        f"Classify this support message as 'faq', 'order', or 'escalate'. "
        f"Reply with just the category.\n\nMessage: {last_msg}"
    )
    return {"category": response.content.strip().lower()}

def handle_faq(state: SupportState) -> dict:
    answer = search_faq.invoke({"question": state["messages"][-1].content})
    return {"messages": [{"role": "assistant", "content": answer}]}

def handle_order(state: SupportState) -> dict:
    last_msg = state["messages"][-1].content
    extraction = llm.invoke(f"Extract the order ID from: {last_msg}. Reply with just the ID.")
    order_id = extraction.content.strip().replace("#", "")
    result = lookup_order.invoke({"order_id": order_id})
    return {"messages": [{"role": "assistant", "content": result}], "order_info": result}

def handle_escalation(state: SupportState) -> dict:
    human_response = interrupt({
        "reason": "Customer issue requires human attention",
        "conversation": [m.content for m in state["messages"][-3:]],
    })
    return {"messages": [{"role": "assistant", "content": human_response}]}

builder = StateGraph(SupportState)
builder.add_node("classify", classify)
builder.add_node("faq", handle_faq)
builder.add_node("order", handle_order)
builder.add_node("escalate", handle_escalation)

builder.add_edge(START, "classify")
builder.add_conditional_edges("classify", lambda s: s["category"], {
    "faq": "faq", "order": "order", "escalate": "escalate",
})
builder.add_edge("faq", END)
builder.add_edge("order", END)
builder.add_edge("escalate", END)

graph = builder.compile(checkpointer=MemorySaver())
```

### Step 3: Run and Test

```python
# FAQ question -- routes to FAQ handler
c1 = {"configurable": {"thread_id": "session-1"}}
result = graph.invoke({"messages": [{"role": "user", "content": "What is your return policy?"}]}, c1)
print(result["messages"][-1].content)

# Order query -- routes to order handler
c2 = {"configurable": {"thread_id": "session-2"}}
result = graph.invoke({"messages": [{"role": "user", "content": "Where is my order #12345?"}]}, c2)
print(result["messages"][-1].content)

# Sensitive issue -- triggers human escalation, graph pauses with __interrupt__
c3 = {"configurable": {"thread_id": "session-3"}}
result = graph.invoke({"messages": [{"role": "user", "content": "Fraudulent charges on my account!"}]}, c3)

# Human agent responds via Command(resume=...)
final = graph.invoke(Command(resume="Account flagged. A specialist will call within 1 hour."), c3)
print(final["messages"][-1].content)
```

## Why It Matters

1. **Conditional routing** -- demonstrates how a single entry point branches into specialized handlers based on classification.
2. **Human-in-the-loop escalation** -- shows the production pattern of pausing an agent for human takeover when AI alone is insufficient.
3. **Tool routing vs. tool calling** -- unlike the ReAct loop where the LLM picks tools freely, this graph enforces which tool runs based on structural routing.
4. **Conversation memory** -- the checkpointer preserves context so escalated conversations include full history for the human agent.

## Key Technical Details

- The classifier uses a simple LLM prompt but could be replaced with a fine-tuned classifier for lower latency.
- `interrupt()` requires a checkpointer; without one, escalation raises a runtime error.
- Each handler ends with an edge to `END`, making the graph a single-pass pipeline rather than a loop.
- The routing function reads from state, keeping routing deterministic after classification.
- Tools are invoked directly via `.invoke()` inside handler nodes rather than through a `ToolNode`.

## Common Misconceptions

- **"You need `create_react_agent` for any agent with tools."** This project uses tools inside manually defined nodes with no ReAct loop, showing that tools and agents are independent concepts.
- **"Interrupt stops the entire application."** It only pauses the specific graph thread. Other threads and users continue processing normally.
- **"The human escalation replaces the AI entirely."** The graph resumes after the human responds, so you could add post-escalation nodes for logging or follow-up automation.

## Connections to Other Concepts

- `../03-building-your-first-agent/manual-react-agent.md` -- the manual graph-building approach this project uses.
- `../01-langgraph-foundations/edges-and-routing.md` -- conditional edges powering category-based routing.
- `../05-human-in-the-loop/interrupt-and-resume.md` -- the escalation mechanism.
- `../04-memory-and-persistence/checkpointers.md` -- enables both escalation and conversation memory.
- `research-assistant.md` -- a simpler project using the prebuilt agent.
- `multi-agent-content-pipeline.md` -- a more complex project using multiple agents with a supervisor.

## Further Reading

- [LangGraph Human-in-the-Loop Patterns](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/)
- [LangGraph Conditional Edges Docs](https://langchain-ai.github.io/langgraph/concepts/low_level/#conditional-edges)
