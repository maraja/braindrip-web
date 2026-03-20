# Plan-Then-Execute Pattern

**One-Line Summary**: The plan-then-execute pattern separates task planning from task execution into two distinct phases, producing more reliable and transparent agent behavior.

**Prerequisites**: `breaking-complex-tasks-into-steps.md`, basic familiarity with LangGraph

## What Is the Plan-Then-Execute Pattern?

Imagine a chess player who thinks through their next five moves before touching a single piece, versus one who grabs a pawn and improvises. The first player can evaluate trade-offs, spot dead ends, and commit to a coherent strategy. The second player may make locally reasonable moves that lead to a terrible position. AI agents face the same dilemma.

The plan-then-execute pattern forces the agent to generate a complete plan before taking any action. The planner LLM call produces a structured sequence of steps. Then a separate executor loop walks through those steps one at a time, invoking tools and collecting results. The plan is a first-class artifact -- it can be inspected, validated, stored, and revised.

This pattern contrasts with the more common ReAct loop, where the agent interleaves thinking and acting in a single stream. ReAct is flexible but prone to losing track of the overall goal, repeating steps, or going down rabbit holes. Plan-then-execute trades some flexibility for coherence and predictability.

## How It Works

### Planning Prompt Design

The planning step uses a dedicated system prompt that instructs the LLM to output a structured plan without executing anything. The prompt should include available tools, constraints, and the desired output format.

```python
PLANNER_PROMPT = """You are a planning agent. Given the user's goal, produce a
step-by-step plan. Do NOT execute any steps -- only plan.

Rules:
1. Each step must use exactly one available tool
2. Steps execute in order; later steps can reference earlier results as $step_N
3. Include 1-2 verification steps at the end
4. Keep the plan under 10 steps

Available tools:
- web_search(query) -> list of results
- scrape_page(url) -> page text
- extract_json(text, schema) -> structured data
- calculate(expression) -> number
- write_file(path, content) -> confirmation

Output as a JSON list:
[
  {"step": 1, "tool": "web_search", "input": "...", "expected_output": "..."},
  {"step": 2, "tool": "scrape_page", "input": "$step_1[0].url", "expected_output": "..."}
]
"""
```

### Plan Representation

Plans can be represented as numbered lists (simple), JSON arrays (machine-readable), or graph structures (for complex dependencies). JSON is the most practical default because it is parseable, serializable, and easy to validate.

```json
[
  {
    "step": 1,
    "tool": "web_search",
    "input": {"query": "OpenAI API pricing 2024"},
    "expected_output": "List of search results with URLs",
    "depends_on": []
  },
  {
    "step": 2,
    "tool": "scrape_page",
    "input": {"url": "$step_1.results[0].url"},
    "expected_output": "Raw HTML/text of pricing page",
    "depends_on": [1]
  },
  {
    "step": 3,
    "tool": "extract_json",
    "input": {"text": "$step_2.content", "schema": "pricing_tiers"},
    "expected_output": "Structured pricing data",
    "depends_on": [2]
  }
]
```

The `$step_N` notation creates a lightweight variable system that lets later steps reference earlier outputs without the planner needing to know the actual values.

### Plan Validation

Before execution, the agent validates the plan for structural correctness:

```python
def validate_plan(plan: list[dict], available_tools: set[str]) -> list[str]:
    """Return a list of validation errors, empty if plan is valid."""
    errors = []
    step_ids = set()

    for step in plan:
        sid = step["step"]
        if sid in step_ids:
            errors.append(f"Duplicate step ID: {sid}")
        step_ids.add(sid)

        if step["tool"] not in available_tools:
            errors.append(f"Step {sid}: unknown tool '{step['tool']}'")

        for dep in step.get("depends_on", []):
            if dep not in step_ids:
                errors.append(f"Step {sid}: depends on未知 step {dep}")
            if dep >= sid:
                errors.append(f"Step {sid}: forward dependency on step {dep}")

    return errors
```

### LangGraph Implementation

LangGraph provides a natural framework for plan-then-execute. The graph has two main nodes: a planner and an executor that loops through steps.

```python
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END

class PlanExecuteState(TypedDict):
    goal: str
    plan: list[dict]
    current_step: int
    step_results: Annotated[dict, lambda a, b: {**a, **b}]
    final_answer: str

def planner_node(state: PlanExecuteState) -> dict:
    """Generate the plan from the goal."""
    response = llm.invoke([
        SystemMessage(content=PLANNER_PROMPT),
        HumanMessage(content=state["goal"]),
    ])
    plan = json.loads(response.content)
    return {"plan": plan, "current_step": 0, "step_results": {}}

def executor_node(state: PlanExecuteState) -> dict:
    """Execute the current step in the plan."""
    step = state["plan"][state["current_step"]]
    resolved_input = resolve_references(step["input"], state["step_results"])

    result = execute_tool(step["tool"], resolved_input)

    return {
        "step_results": {f"step_{step['step']}": result},
        "current_step": state["current_step"] + 1,
    }

def should_continue(state: PlanExecuteState) -> str:
    if state["current_step"] >= len(state["plan"]):
        return "summarize"
    return "execute"

def summarize_node(state: PlanExecuteState) -> dict:
    """Produce the final answer from all step results."""
    summary_prompt = f"Goal: {state['goal']}\nResults: {state['step_results']}"
    response = llm.invoke([HumanMessage(content=summary_prompt)])
    return {"final_answer": response.content}

# Build the graph
graph = StateGraph(PlanExecuteState)
graph.add_node("plan", planner_node)
graph.add_node("execute", executor_node)
graph.add_node("summarize", summarize_node)

graph.add_edge(START, "plan")
graph.add_edge("plan", "execute")
graph.add_conditional_edges("execute", should_continue, {
    "execute": "execute",
    "summarize": "summarize",
})
graph.add_edge("summarize", END)

app = graph.compile()
```

### Plan Revision When Steps Fail

When a step fails, the agent has three options: retry the step, adjust the plan, or abort. A practical approach is to allow one retry, then trigger replanning if the retry also fails.

```python
def executor_with_retry(state: PlanExecuteState) -> dict:
    step = state["plan"][state["current_step"]]
    resolved_input = resolve_references(step["input"], state["step_results"])

    for attempt in range(2):
        try:
            result = execute_tool(step["tool"], resolved_input)
            return {
                "step_results": {f"step_{step['step']}": result},
                "current_step": state["current_step"] + 1,
            }
        except ToolError as e:
            if attempt == 0:
                continue
            # After retry failure, mark for replanning
            return {
                "step_results": {f"step_{step['step']}": f"FAILED: {e}"},
                "needs_replan": True,
            }
```

## Why It Matters

### Transparency and Debuggability

The plan is a tangible artifact. When something goes wrong, you can inspect the plan, identify which step diverged, and understand why. With ReAct-style agents, debugging means reading through an interleaved stream of thoughts and actions, trying to reconstruct the implicit plan.

### User Trust and Control

Exposing the plan to the user before execution creates a natural checkpoint. Users can review, modify, or reject the plan. This is especially important for agents that take consequential actions like sending emails, making purchases, or modifying databases.

## Key Technical Details

- Planning typically adds 1-3 seconds and 500-2000 tokens of overhead before execution begins
- Plans longer than 10 steps tend to degrade in quality; break into sub-plans for complex tasks
- The `$step_N` reference notation should be resolved lazily at execution time, not during planning
- Plan validation catches roughly 15-20% of malformed plans before they waste execution tokens
- Storing plans in a database enables replay, comparison, and optimization of recurring workflows
- The planner and executor can use different models: a stronger model for planning, a faster model for execution

## Common Misconceptions

**"Plan-then-execute is always better than ReAct"**: It is not. For simple, exploratory tasks like "find an answer to this question," ReAct's flexibility is an advantage. Plan-then-execute shines when the task has clear structure, multiple tools, and benefits from upfront coordination. Many production systems use a hybrid: plan-then-execute for the outer loop and ReAct for individual complex steps.

**"The plan should be detailed enough that execution is mechanical"**: Over-specified plans are brittle. The plan should capture the strategy and sequence, but each execution step still benefits from LLM reasoning to handle the specifics of the actual data encountered. Think of the plan as a recipe outline, not a precise algorithm.

## Connections to Other Concepts

- `breaking-complex-tasks-into-steps.md` -- The decomposition process that produces the raw material for the plan
- `adaptive-replanning.md` -- What happens when plan execution encounters unexpected results
- `dependency-graphs-for-skill-execution.md` -- Upgrading linear plans to DAGs for parallel execution
- `sequential-skill-chains.md` -- The simplest execution pattern for linear plans

## Further Reading

- Wang et al., "Plan-and-Solve Prompting" (2023) -- Research showing that explicit planning prompts improve LLM problem-solving accuracy
- LangGraph Documentation, "Plan-and-Execute" (2024) -- Official tutorial for implementing this pattern in LangGraph
- Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning" (2023) -- Extends plan-then-execute with self-reflection after execution
