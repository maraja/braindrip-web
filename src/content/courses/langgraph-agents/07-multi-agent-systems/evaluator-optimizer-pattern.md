# Evaluator-Optimizer Pattern

**One-Line Summary**: An iterative loop where one LLM generates content and another evaluates it with structured feedback, repeating until the output meets a defined quality threshold.

**Prerequisites**: `structured-output.md`, `edges-and-routing.md`, `nodes.md`

## What Is the Evaluator-Optimizer Pattern?

Think of a writer and editor working together on a magazine article. The writer produces a draft, the editor reads it and returns a marked-up copy with specific notes: "The opening is weak, tighten the second paragraph, the conclusion needs a call to action." The writer revises based on that feedback and resubmits. This back-and-forth continues until the editor approves the piece for publication.

In LangGraph, the evaluator-optimizer pattern formalizes this loop as a two-node cycle. A generator node produces content, and an evaluator node grades it using `with_structured_output` to produce typed feedback. A conditional edge inspects the grade: if it fails the threshold, control routes back to the generator with the evaluator's feedback appended to state. If it passes, the loop exits. The structured output ensures that feedback is machine-readable, not just free text.

This pattern is powerful for any task where quality is subjective and iterative refinement is natural -- writing, code generation, data extraction, translation, and summarization.

## How It Works

### Defining the State

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class JokeState(TypedDict):
    topic: str
    joke: str
    feedback: str
    grade: str
```

### The Evaluation Schema

```python
from pydantic import BaseModel, Field

class JokeEvaluation(BaseModel):
    grade: str = Field(description="Either 'funny' or 'not funny'")
    feedback: str = Field(description="Specific suggestions for improvement")
```

### Building the Generator and Evaluator Nodes

```python
from langchain_openai import ChatOpenAI

generator_llm = ChatOpenAI(model="gpt-4o")
evaluator_llm = ChatOpenAI(model="gpt-4o").with_structured_output(JokeEvaluation)

def generate_joke(state: JokeState) -> dict:
    prompt = f"Write a joke about {state['topic']}."
    if state.get("feedback"):
        prompt += f" Previous feedback: {state['feedback']}"
    response = generator_llm.invoke(prompt)
    return {"joke": response.content}

def evaluate_joke(state: JokeState) -> dict:
    evaluation = evaluator_llm.invoke(
        f"Evaluate this joke. Is it funny?\n\nJoke: {state['joke']}"
    )
    return {"grade": evaluation.grade, "feedback": evaluation.feedback}
```

### Wiring the Iterative Loop

```python
from langgraph.graph import StateGraph, START, END

def route_after_evaluation(state: JokeState) -> str:
    if state["grade"] == "funny":
        return "accept"
    return "retry"

builder = StateGraph(JokeState)
builder.add_node("generate", generate_joke)
builder.add_node("evaluate", evaluate_joke)

builder.add_edge(START, "generate")
builder.add_edge("generate", "evaluate")
builder.add_conditional_edges(
    "evaluate",
    route_after_evaluation,
    {"accept": END, "retry": "generate"},
)

graph = builder.compile()
result = graph.invoke({"topic": "programming", "joke": "", "feedback": "", "grade": ""})
```

### Adding a Safety Limit

Prevent infinite loops by tracking iterations:

```python
class SafeJokeState(TypedDict):
    topic: str
    joke: str
    feedback: str
    grade: str
    attempts: int

def route_with_limit(state: SafeJokeState) -> str:
    if state["grade"] == "funny" or state["attempts"] >= 3:
        return "accept"
    return "retry"
```

## Why It Matters

1. **Measurable quality improvement** -- each iteration demonstrably improves output based on specific, structured feedback rather than blind regeneration.
2. **Separation of generation and judgment** -- the generator and evaluator can use different models, prompts, and even temperature settings optimized for their roles.
3. **Composable within larger systems** -- the evaluator-optimizer loop can be a subgraph inside a supervisor-managed multi-agent pipeline.
4. **Structured feedback prevents drift** -- typed evaluation schemas ensure the generator receives actionable, consistent feedback rather than vague commentary.

## Key Technical Details

- The evaluator must use `with_structured_output` to return a typed Pydantic model, ensuring grades and feedback are machine-parseable.
- The conditional edge after the evaluator inspects the grade field to decide whether to loop or exit.
- The generator should include previous feedback in its prompt for meaningful iteration, not just retry blindly.
- Always add a maximum iteration limit to prevent runaway loops and excessive API costs.
- Different models can be used for generation versus evaluation to balance cost and quality.
- The pattern works with any evaluation schema: numeric scores, pass/fail grades, multi-dimensional rubrics.
- State accumulates all feedback, so later iterations have the full history of improvement suggestions.

## Common Misconceptions

- **"The evaluator and generator must be different LLMs."** They can be the same model with different system prompts. Using separate models is an optimization, not a requirement.
- **"The loop always produces better output."** Without specific, actionable feedback in the evaluation schema, the generator may oscillate or degrade. The quality of the evaluation prompt matters enormously.
- **"This pattern is only useful for creative content."** Evaluator-optimizer loops work for code generation, data extraction, SQL queries, translations, and any task where output quality can be programmatically assessed.
- **"Structured output is optional for the evaluator."** Without structured output, the conditional edge cannot reliably parse the grade. Free-text evaluation breaks the routing logic.

## Connections to Other Concepts

- `structured-output.md` -- the `with_structured_output` method that powers typed evaluations
- `supervisor-pattern.md` -- evaluator-optimizer loops often run as sub-agents within a supervisor system
- `edges-and-routing.md` -- conditional edges drive the accept/retry routing decision
- `subgraph-architecture.md` -- the evaluator-optimizer loop is a natural candidate for encapsulation as a subgraph
- `agent-handoffs.md` -- the loop can also be implemented using Command-based handoffs between generator and evaluator

## Further Reading

- [LangGraph Multi-Agent Concepts](https://langchain-ai.github.io/langgraph/concepts/multi_agent/)
- [LangChain Structured Output Guide](https://python.langchain.com/docs/how_to/structured_output/)
- [LangGraph Evaluator-Optimizer Example](https://langchain-ai.github.io/langgraph/tutorials/multi_agent/)
