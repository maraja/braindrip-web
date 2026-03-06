# Multi-Agent Content Pipeline

**One-Line Summary**: A supervisor-orchestrated pipeline where a researcher, writer, and editor agent collaborate with an evaluator-optimizer loop for iterative content improvement.

**Prerequisites**: `supervisor-pattern.md`, `edges-and-routing.md`, `state-and-state-schema.md`, `tool-schemas-and-validation.md`, `checkpointers.md`

## What Is the Multi-Agent Content Pipeline?

This project builds a content production system with three specialized agents coordinated by a supervisor. The researcher gathers information, the writer produces a draft, and the editor reviews with structured feedback. If the editor scores the draft below threshold, the supervisor loops back to the writer -- creating an evaluator-optimizer cycle that iterates until quality standards are met.

The supervisor never produces content itself. Its only job is routing. Each agent has a distinct role and distinct tools. This separation of concerns mirrors how real content teams operate and demonstrates why multi-agent architectures outperform monolithic prompts on complex tasks.

## How It Works

### Architecture Overview

The graph has four nodes: supervisor, researcher, writer, and editor. After each specialist runs, control returns to the supervisor for the next routing decision. The editor's structured feedback determines whether to loop back to the writer or finish.

### Step 1: Define State and Agent Tools

```python
from typing import TypedDict, Annotated, Literal
from langgraph.graph.message import add_messages
from langchain_core.tools import tool
from pydantic import BaseModel, Field

class PipelineState(TypedDict):
    messages: Annotated[list, add_messages]
    next_agent: str
    research_notes: str
    current_draft: str
    edit_score: int
    revision_count: int

class RoutingDecision(BaseModel):
    next: Literal["researcher", "writer", "editor", "FINISH"]
    reasoning: str

class EditFeedback(BaseModel):
    score: int = Field(description="Quality score 1-10")
    passes: bool = Field(description="True if draft is ready to publish")
    feedback: str = Field(description="Specific revision instructions")

@tool
def web_search(query: str) -> str:
    """Search the web for information on a topic."""
    from tavily import TavilyClient
    results = TavilyClient().search(query=query, max_results=3)
    return "\n\n".join(r["content"][:300] for r in results["results"])
```

### Step 2: Build the Graph

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_anthropic import ChatAnthropic

supervisor_llm = ChatAnthropic(model="claude-sonnet-4-5-20250929")
agent_llm = ChatAnthropic(model="claude-sonnet-4-5-20250929")

def supervisor(state: PipelineState) -> dict:
    context = (f"Notes: {state.get('research_notes', 'None')[:100]} | "
               f"Draft: {'Yes' if state.get('current_draft') else 'No'} | "
               f"Score: {state.get('edit_score', 'N/A')} | Rev: {state.get('revision_count', 0)}")
    decision = supervisor_llm.with_structured_output(RoutingDecision).invoke([
        {"role": "system", "content":
            "You coordinate a content pipeline: researcher -> writer -> editor. "
            "Route to researcher first, then writer, then editor. "
            "If editor score < 7 and revisions < 3, route back to writer. Otherwise FINISH."},
        {"role": "user", "content": context},
    ])
    return {"next_agent": decision.next}

def researcher(state: PipelineState) -> dict:
    results = web_search.invoke({"query": state["messages"][0].content})
    summary = agent_llm.invoke(f"Summarize into research notes:\n\n{results}")
    return {"messages": [{"role": "assistant", "content": f"[Researcher] {summary.content}"}],
            "research_notes": summary.content}

def writer(state: PipelineState) -> dict:
    notes, prior = state.get("research_notes", ""), state.get("current_draft", "")
    prompt = f"Research notes:\n{notes}\n\n"
    prompt += f"Revise this draft:\n{prior}" if prior else "Write a well-structured article."
    response = agent_llm.invoke(prompt)
    return {"messages": [{"role": "assistant", "content": "[Writer] Draft complete."}],
            "current_draft": response.content,
            "revision_count": state.get("revision_count", 0) + 1}

def editor(state: PipelineState) -> dict:
    feedback = agent_llm.with_structured_output(EditFeedback).invoke(
        f"Review this draft. Score 1-10 with specific feedback:\n\n{state['current_draft']}")
    return {"messages": [{"role": "assistant", "content": f"[Editor] {feedback.score}/10. {feedback.feedback}"}],
            "edit_score": feedback.score}

builder = StateGraph(PipelineState)
builder.add_node("supervisor", supervisor)
builder.add_node("researcher", researcher)
builder.add_node("writer", writer)
builder.add_node("editor", editor)

builder.add_edge(START, "supervisor")
builder.add_conditional_edges("supervisor", lambda s: s["next_agent"], {
    "researcher": "researcher", "writer": "writer",
    "editor": "editor", "FINISH": END,
})
builder.add_edge("researcher", "supervisor")
builder.add_edge("writer", "supervisor")
builder.add_edge("editor", "supervisor")

graph = builder.compile(checkpointer=MemorySaver())
```

### Step 3: Run and Test

```python
config = {"configurable": {"thread_id": "pipeline-1"}}
result = graph.invoke(
    {"messages": [{"role": "user", "content": "Write an article about AI in healthcare"}]},
    config=config,
)
for msg in result["messages"]:
    if hasattr(msg, "content"):
        print(msg.content[:120])
print(f"Final score: {result.get('edit_score')} | Revisions: {result.get('revision_count')}")
```

## Why It Matters

1. **Supervisor orchestration** -- demonstrates the most common multi-agent coordination pattern with a real use case.
2. **Evaluator-optimizer loop** -- the editor-to-writer feedback cycle is a reusable pattern for iterative quality improvement.
3. **Structured output for control flow** -- `EditFeedback` and `RoutingDecision` turn LLM output into reliable routing signals.
4. **Bounded iteration** -- the `revision_count` cap prevents infinite loops, a critical safeguard in evaluator-optimizer systems.

## Key Technical Details

- The supervisor uses `with_structured_output(RoutingDecision)` to guarantee valid routing values.
- All specialist nodes route back to the supervisor via fixed edges; only the supervisor has conditional outbound edges.
- The `revision_count` field acts as a circuit breaker, capping the edit loop at 3 iterations.
- The editor's `EditFeedback` Pydantic model enforces a numeric score and boolean pass/fail.
- For production, each agent could be a subgraph with its own internal tool-calling loop.

## Common Misconceptions

- **"The supervisor needs to be a more powerful model than the specialists."** The supervisor only routes; it never produces content. A smaller model with structured output often suffices.
- **"More revision loops always produce better content."** Quality plateaus quickly. Beyond 2-3 passes, editor and writer often oscillate rather than improve.
- **"Each agent must be a separate `create_react_agent`."** Agents are plain functions here. They become subgraphs only when they need their own internal tool-calling loops.

## Connections to Other Concepts

- `../07-multi-agent-systems/supervisor-pattern.md` -- the architectural pattern this project implements.
- `../01-langgraph-foundations/edges-and-routing.md` -- conditional edges powering supervisor routing.
- `../02-tools-and-models/tool-schemas-and-validation.md` -- structured output for feedback and routing.
- `customer-support-agent.md` -- a simpler manual graph project for comparison.
- `research-assistant.md` -- contrasts a single prebuilt agent with the multi-agent approach here.

## Further Reading

- [LangGraph Multi-Agent Supervisor Tutorial](https://langchain-ai.github.io/langgraph/tutorials/multi_agent/agent_supervisor/)
- [Evaluator-Optimizer Pattern](https://langchain-ai.github.io/langgraph/concepts/multi_agent/#evaluator-pattern)
