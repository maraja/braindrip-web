# The Supervisor Pattern

**One-Line Summary**: The supervisor pattern uses a meta-agent to coordinate specialized worker agents, routing tasks to the right expert and aggregating their results into a coherent response.

**Prerequisites**: `conditional-branching.md`, `parallel-skill-execution.md`, basic LangGraph knowledge

## What Is the Supervisor Pattern?

Think of a newsroom editor. The editor does not write every article -- they assess incoming stories, assign the sports story to the sports reporter, the financial story to the business desk, and the breaking news to the field correspondent. The editor then reviews all drafts, requests revisions, and assembles the final edition. The editor's value is judgment and coordination, not individual expertise.

The supervisor pattern in agent orchestration works the same way. A supervisor agent receives a complex request, breaks it into sub-tasks, delegates each sub-task to a specialized worker agent, monitors their progress, and synthesizes their outputs into a final answer. The supervisor does not call tools directly -- it manages agents that call tools.

This pattern emerges naturally when a single agent with many tools becomes unreliable. LLMs struggle when given 15+ tools to choose from. Splitting those tools across specialized workers -- each with 3-5 focused tools -- and adding a supervisor to coordinate them produces better results than one agent trying to do everything.

## How It Works

### When to Use Supervisor vs Single Agent

Use a **single agent** when the task requires fewer than 8 tools, all tools belong to the same domain, and the task is linear. Use a **supervisor** when tools span multiple domains (research, coding, data analysis), sub-tasks require different system prompts or expertise levels, you need quality control between sub-task outputs, or the task benefits from parallel delegation.

### Complete LangGraph Supervisor Implementation

```python
import json
from typing import Annotated, TypedDict
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langgraph.graph import StateGraph, START, END

SUPERVISOR_PROMPT = """You are a supervisor coordinating specialized workers.
1. Analyze the user's request
2. Delegate to the right worker with clear instructions
3. Review outputs and synthesize a final answer

Workers:
- researcher: Searches the web, extracts information. For factual questions.
- analyst: Processes numbers, comparisons, calculations. For quantitative tasks.
- writer: Drafts polished text, summarizes, formats. For final deliverables.

Respond with JSON: {"action": "delegate"|"respond", "worker": "...", "instruction": "..."}
Do NOT delegate more than 5 times total."""

class SupervisorState(TypedDict):
    user_request: str
    messages: Annotated[list, lambda a, b: a + b]
    worker_results: Annotated[dict, lambda a, b: {**a, **b}]
    delegation_count: int
    final_answer: str

supervisor_llm = ChatOpenAI(model="gpt-4o")
worker_llm = ChatOpenAI(model="gpt-4o-mini")

WORKER_PROMPTS = {
    "researcher": "You are a research specialist. Search thoroughly and cite URLs.",
    "analyst": "You are a data analyst. Be precise with calculations.",
    "writer": "You are a professional writer. Create clear, polished content.",
}
WORKER_TOOLS = {
    "researcher": [web_search, scrape_page],
    "analyst": [calculator, create_chart],
    "writer": [format_document],
}

def create_worker_node(worker_name: str):
    def worker_node(state: SupervisorState) -> dict:
        instruction = state["messages"][-1].content
        worker_agent = create_react_agent(
            worker_llm, tools=WORKER_TOOLS[worker_name],
            state_modifier=WORKER_PROMPTS[worker_name],
        )
        result = worker_agent.invoke({"messages": [HumanMessage(content=instruction)]})
        output = result["messages"][-1].content
        return {
            "worker_results": {worker_name: output},
            "messages": [AIMessage(content=f"[{worker_name}] {output}", name=worker_name)],
        }
    return worker_node

def supervisor_node(state: SupervisorState) -> dict:
    messages = [SystemMessage(content=SUPERVISOR_PROMPT),
                HumanMessage(content=f"User request: {state['user_request']}")]
    messages.extend(state.get("messages", []))
    response = supervisor_llm.invoke(messages)
    action = json.loads(response.content)

    if action["action"] == "respond":
        return {"final_answer": action["instruction"],
                "messages": [AIMessage(content=response.content, name="supervisor")]}
    return {"messages": [AIMessage(content=action["instruction"], name="supervisor")],
            "delegation_count": state.get("delegation_count", 0) + 1}

def route_supervisor(state: SupervisorState) -> str:
    if state.get("final_answer") or state.get("delegation_count", 0) >= 5:
        return "done"
    last = state["messages"][-1] if state["messages"] else None
    if last and last.name in ("researcher", "analyst", "writer"):
        return "supervisor"  # worker done, back to supervisor
    # supervisor just delegated -- route to the named worker
    action = json.loads(last.content) if last else {}
    return action.get("worker", "done")

# Build the graph
graph = StateGraph(SupervisorState)
graph.add_node("supervisor", supervisor_node)
for name in ("researcher", "analyst", "writer"):
    graph.add_node(name, create_worker_node(name))

graph.add_edge(START, "supervisor")
graph.add_conditional_edges("supervisor", route_supervisor, {
    "researcher": "researcher", "analyst": "analyst",
    "writer": "writer", "done": END,
})
for name in ("researcher", "analyst", "writer"):
    graph.add_edge(name, "supervisor")

app = graph.compile()
result = app.invoke({
    "user_request": "Compare cloud provider pricing and write a recommendation.",
    "messages": [], "worker_results": {}, "delegation_count": 0, "final_answer": "",
})
```

### Result Aggregation

The supervisor synthesizes worker outputs in its final response. When worker results are lengthy, summarize earlier results to keep the supervisor's context under 4000 tokens. Independent worker tasks can also be dispatched in parallel using LangGraph fan-out to reduce total latency.

## Why It Matters

### Scalable Complexity

A single agent with 20 tools degrades rapidly -- the LLM makes poor tool choices and loses track of multi-step reasoning. The supervisor pattern distributes this complexity: each worker has 3-5 tools and a focused prompt. Adding a new capability means adding a new worker, not bloating an existing agent.

### Quality Control

The supervisor acts as a quality gate. It can reject subpar worker output and request revisions before presenting results to the user. This review loop catches errors that a single-pass agent would miss.

## Key Technical Details

- Use the most capable model for the supervisor (GPT-4o, Claude Sonnet); workers can use cheaper models (GPT-4o-mini)
- Each delegation adds ~2-4 seconds of latency; keep total delegations under 5
- Worker system prompts should be under 500 tokens each
- Log the full supervisor decision trace for debugging
- Independent worker tasks can be dispatched in parallel via LangGraph fan-out

## Common Misconceptions

**"The supervisor should do all the thinking and workers just execute"**: Workers should have their own reasoning capabilities. The supervisor provides strategic direction, but workers make tactical decisions about how to accomplish their sub-task. Overly prescriptive instructions produce worse results than high-level delegation.

**"Every multi-tool agent needs a supervisor"**: The supervisor pattern adds coordination overhead. For tasks with 5-7 related tools and a clear workflow, a single agent with good prompt engineering outperforms a supervisor setup. The pattern shines when tools span distinct domains or when quality review between steps is important.

## Connections to Other Concepts

- `conditional-branching.md` -- The supervisor's routing logic is a form of conditional branching
- `parallel-skill-execution.md` -- Independent worker tasks can execute in parallel
- `human-in-the-loop-checkpoints.md` -- The supervisor can pause for human review before critical delegations

## Further Reading

- Wu et al., "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation" (2023) -- Multi-agent framework with supervisor-style coordination
- LangGraph Documentation, "Multi-Agent Supervisor" (2024) -- Official tutorial for building supervisor architectures
- Minsky, "Society of Mind" (1986) -- Theoretical foundation for multi-agent cognitive architectures
