# The Supervisor Pattern

**One-Line Summary**: The supervisor pattern uses a meta-agent to coordinate specialized worker agents, routing tasks to the right expert and aggregating their results into a coherent response.

**Prerequisites**: `conditional-branching.md`, `parallel-skill-execution.md`, basic LangGraph knowledge

## What Is the Supervisor Pattern?

Think of a newsroom editor. The editor does not write every article -- they assess incoming stories, assign the sports story to the sports reporter, the financial story to the business desk, and the breaking news to the field correspondent. The editor then reviews all drafts, requests revisions, and assembles the final edition. The editor's value is judgment and coordination, not individual expertise.

The supervisor pattern in agent orchestration works the same way. A supervisor agent (the editor) receives a complex request, breaks it into sub-tasks, delegates each sub-task to a specialized worker agent (the reporters), monitors their progress, and synthesizes their outputs into a final answer. The supervisor does not call tools directly -- it manages agents that call tools.

This pattern emerges naturally when a single agent with many tools becomes unreliable. LLMs struggle when given 15+ tools to choose from. Splitting those tools across specialized workers -- each with 3-5 focused tools -- and adding a supervisor to coordinate them produces better results than one agent trying to do everything.

## How It Works

### When to Use Supervisor vs Single Agent

Use a **single agent** when:
- The task requires fewer than 8 tools
- All tools belong to the same domain
- The task is linear (no delegation needed)

Use a **supervisor** when:
- Tools span multiple domains (research, coding, data analysis)
- Sub-tasks require different system prompts or expertise levels
- You need quality control between sub-task outputs
- The task benefits from parallel delegation

### Supervisor Prompt Design

The supervisor's system prompt must clearly define its role, the available workers, and the expected interaction protocol:

```python
SUPERVISOR_PROMPT = """You are a supervisor agent coordinating a team of
specialized workers. Your job is to:
1. Analyze the user's request
2. Decide which worker(s) to delegate to
3. Provide clear, specific instructions to each worker
4. Review worker outputs for quality and completeness
5. Synthesize a final answer or request revisions

Available workers:
- researcher: Searches the web and extracts information. Best for factual
  questions, finding data, and gathering sources.
- analyst: Processes numerical data, creates comparisons, and performs
  calculations. Best for quantitative tasks.
- writer: Drafts text content, summarizes information, and formats output.
  Best for producing polished final deliverables.

Respond with a JSON action:
{
  "action": "delegate" | "respond" | "request_revision",
  "worker": "researcher" | "analyst" | "writer",
  "instruction": "specific task for the worker",
  "context": "relevant results from previous workers"
}

When all sub-tasks are complete, use action "respond" with the final answer.
Do NOT delegate more than 5 times total.
"""
```

### Complete LangGraph Supervisor Implementation

```python
import json
from typing import Annotated, TypedDict
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langgraph.graph import StateGraph, START, END

class SupervisorState(TypedDict):
    user_request: str
    messages: Annotated[list, lambda a, b: a + b]
    worker_results: Annotated[dict, lambda a, b: {**a, **b}]
    delegation_count: int
    final_answer: str

supervisor_llm = ChatOpenAI(model="gpt-4o")
worker_llm = ChatOpenAI(model="gpt-4o-mini")  # cheaper for workers

# --- Worker Definitions ---

WORKER_PROMPTS = {
    "researcher": "You are a research specialist. Search for information and "
                  "return well-sourced findings. Be thorough and cite URLs.",
    "analyst": "You are a data analyst. Process numbers, create comparisons, "
               "and identify trends. Be precise with calculations.",
    "writer": "You are a professional writer. Create polished, clear content "
              "from the provided information. Match the requested format.",
}

WORKER_TOOLS = {
    "researcher": [web_search, scrape_page],
    "analyst": [calculator, create_chart],
    "writer": [format_document],
}

def create_worker_node(worker_name: str):
    """Factory function to create a worker node."""
    def worker_node(state: SupervisorState) -> dict:
        # Find the latest instruction for this worker
        instruction = None
        for msg in reversed(state["messages"]):
            if hasattr(msg, "worker") and msg.worker == worker_name:
                instruction = msg.content
                break

        if not instruction:
            return {}

        # Execute the worker with its specialized tools
        worker_agent = create_react_agent(
            worker_llm,
            tools=WORKER_TOOLS[worker_name],
            state_modifier=WORKER_PROMPTS[worker_name],
        )

        result = worker_agent.invoke({
            "messages": [HumanMessage(content=instruction)]
        })

        worker_output = result["messages"][-1].content
        return {
            "worker_results": {worker_name: worker_output},
            "messages": [AIMessage(
                content=f"[{worker_name}] {worker_output}",
                name=worker_name,
            )],
        }

    return worker_node

def supervisor_node(state: SupervisorState) -> dict:
    """The supervisor decides what to do next."""
    messages = [
        SystemMessage(content=SUPERVISOR_PROMPT),
        HumanMessage(content=f"User request: {state['user_request']}"),
    ]

    # Include history of worker results
    for msg in state.get("messages", []):
        messages.append(msg)

    response = supervisor_llm.invoke(messages)
    action = json.loads(response.content)

    if action["action"] == "respond":
        return {
            "final_answer": action.get("instruction", ""),
            "messages": [AIMessage(content=response.content, name="supervisor")],
        }

    # Create a delegation message
    delegation_msg = AIMessage(content=response.content, name="supervisor")
    delegation_msg.worker = action["worker"]
    delegation_msg.content = action["instruction"]

    return {
        "messages": [delegation_msg],
        "delegation_count": state.get("delegation_count", 0) + 1,
    }

def route_supervisor(state: SupervisorState) -> str:
    """Route based on supervisor's decision."""
    if state.get("final_answer"):
        return "done"
    if state.get("delegation_count", 0) >= 5:
        return "done"

    last_msg = state["messages"][-1] if state["messages"] else None
    if last_msg and hasattr(last_msg, "worker"):
        return last_msg.worker
    return "done"

# --- Build the Graph ---

graph = StateGraph(SupervisorState)

graph.add_node("supervisor", supervisor_node)
graph.add_node("researcher", create_worker_node("researcher"))
graph.add_node("analyst", create_worker_node("analyst"))
graph.add_node("writer", create_worker_node("writer"))

graph.add_edge(START, "supervisor")

graph.add_conditional_edges("supervisor", route_supervisor, {
    "researcher": "researcher",
    "analyst": "analyst",
    "writer": "writer",
    "done": END,
})

# Workers always report back to supervisor
graph.add_edge("researcher", "supervisor")
graph.add_edge("analyst", "supervisor")
graph.add_edge("writer", "supervisor")

app = graph.compile()

# --- Run it ---

result = app.invoke({
    "user_request": "Compare the pricing of the top 3 cloud providers "
                    "and write a recommendation for a startup.",
    "messages": [],
    "worker_results": {},
    "delegation_count": 0,
    "final_answer": "",
})
```

### Result Aggregation

The supervisor aggregates worker results in its final response. This aggregation can be explicit (the supervisor writes a synthesis) or structural (worker outputs are concatenated with formatting):

```python
def final_synthesis_node(state: SupervisorState) -> dict:
    """Produce a polished final answer from all worker results."""
    synthesis_prompt = f"""Synthesize these worker results into a single,
coherent response to the user's request.

User request: {state['user_request']}

Worker results:
{json.dumps(state['worker_results'], indent=2)}

Requirements:
- Maintain factual accuracy from the researcher
- Include precise numbers from the analyst
- Use clear, professional language
- Address the user's request directly
"""
    response = supervisor_llm.invoke([HumanMessage(content=synthesis_prompt)])
    return {"final_answer": response.content}
```

## Why It Matters

### Scalable Complexity

A single agent with 20 tools degrades rapidly -- the LLM makes poor tool choices and loses track of multi-step reasoning. The supervisor pattern distributes this complexity: each worker has 3-5 tools and a focused prompt, making each component more reliable. Adding a new capability means adding a new worker, not bloating an existing agent.

### Quality Control

The supervisor acts as a quality gate. It can reject subpar worker output and request revisions before presenting results to the user. This review loop catches errors that a single-pass agent would miss.

## Key Technical Details

- The supervisor LLM should be the most capable model (GPT-4o, Claude Sonnet); workers can use cheaper, faster models (GPT-4o-mini)
- Each supervisor-to-worker delegation adds ~2-4 seconds of latency; keep total delegations under 5
- Worker prompts should be short and focused -- each worker's system prompt should be under 500 tokens
- The supervisor's context grows with each worker response; summarize earlier results when the context exceeds 4000 tokens
- Independent worker tasks can be dispatched in parallel using LangGraph fan-out, reducing total latency
- Log the full supervisor decision trace for debugging -- include the action JSON and the reasoning behind each delegation

## Common Misconceptions

**"The supervisor should do all the thinking and workers just execute"**: Workers should have their own reasoning capabilities. The supervisor provides strategic direction, but workers make tactical decisions about how to accomplish their specific sub-task. Overly prescriptive supervisor instructions produce worse results than high-level delegation.

**"Every multi-tool agent needs a supervisor"**: The supervisor pattern adds coordination overhead. For tasks with 5-7 related tools and a clear workflow, a single agent with good prompt engineering outperforms a supervisor setup. The supervisor pattern shines when tools span distinct domains or when quality review between steps is important.

## Connections to Other Concepts

- `conditional-branching.md` -- The supervisor's routing logic is a form of conditional branching
- `parallel-skill-execution.md` -- Independent worker tasks can execute in parallel
- `human-in-the-loop-checkpoints.md` -- The supervisor can pause for human review before critical delegations
- `plan-then-execute-pattern.md` -- The supervisor can generate a delegation plan before executing it
- `breaking-complex-tasks-into-steps.md` -- The supervisor decomposes the user request into worker-sized sub-tasks

## Further Reading

- Wu et al., "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation" (2023) -- Multi-agent framework with supervisor-style coordination
- LangGraph Documentation, "Multi-Agent Supervisor" (2024) -- Official tutorial for building supervisor architectures
- Minsky, "Society of Mind" (1986) -- Theoretical foundation for multi-agent cognitive architectures
