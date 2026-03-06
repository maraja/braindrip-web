# Structured Output

**One-Line Summary**: `model.with_structured_output(Schema)` forces LLM responses into typed Pydantic models, turning free-form text into reliable, parseable data structures.

**Prerequisites**: `tool-calling-loop.md`, `langgraph-overview.md`

## What Is Structured Output?

Imagine asking a colleague to fill out a form instead of writing a free-text email. The form has labeled fields, dropdown menus, and checkboxes -- there is no ambiguity about what goes where. Structured output does the same thing for LLMs: instead of generating arbitrary text, the model fills in the fields of a predefined schema, producing valid JSON that maps directly to a Python object.

Under the hood, most providers implement this by injecting the schema as a tool definition and forcing the model to "call" that tool. The response is then parsed into your Pydantic model automatically. You get type safety, IDE autocompletion, and deterministic field names without writing a single regex or JSON parser.

This capability is essential wherever downstream code depends on the shape of the LLM's output -- routing decisions, database inserts, API calls, evaluation scores, or any logic that branches on specific values rather than interpreting prose.

## How It Works

### Basic Usage

```python
from typing import Literal
from pydantic import BaseModel, Field
from langchain_anthropic import ChatAnthropic

class Feedback(BaseModel):
    grade: Literal["pass", "fail"]
    feedback: str = Field(description="Explanation of the grade")

model = ChatAnthropic(model="claude-sonnet-4-5-20250929")
evaluator = model.with_structured_output(Feedback)

result = evaluator.invoke("Evaluate whether 'Paris is in Germany' is correct.")
print(result.grade)     # "fail"
print(result.feedback)  # "Paris is the capital of France, not Germany."
```

The returned `result` is a `Feedback` instance, not a string. You can access `.grade` and `.feedback` as typed attributes.

### Classification and Routing

Structured output is a natural fit for routing decisions inside an agent:

```python
class RouteDecision(BaseModel):
    reasoning: str = Field(description="Why this route was chosen")
    route: Literal["search", "calculate", "respond_directly"]

router = model.with_structured_output(RouteDecision)
decision = router.invoke("The user asked: what is 2 + 2?")

if decision.route == "calculate":
    # send to calculation subgraph
    ...
```

### Data Extraction

Pull structured records from unstructured text:

```python
class Person(BaseModel):
    name: str
    age: int
    occupation: str

extractor = model.with_structured_output(Person)
person = extractor.invoke(
    "Dr. Sarah Chen, a 41-year-old neuroscientist, published new findings today."
)
# person.name == "Dr. Sarah Chen"
# person.age == 41
# person.occupation == "neuroscientist"
```

### Using Inside a LangGraph Node

```python
def evaluate_node(state):
    evaluator = model.with_structured_output(Feedback)
    last_message = state["messages"][-1].content
    result = evaluator.invoke(f"Evaluate this response: {last_message}")
    return {"grade": result.grade, "feedback": result.feedback}
```

## Why It Matters

1. **Eliminates parsing fragility** -- no more regex or string splitting on LLM output that might change format between runs.
2. **Enables programmatic branching** -- agent routing, evaluation gates, and conditional logic require discrete values, not prose paragraphs.
3. **Type safety in Python** -- Pydantic validation catches schema violations immediately, surfacing errors close to their source.
4. **Consistent downstream contracts** -- APIs, databases, and UI components can rely on a fixed schema regardless of prompt variations.
5. **Self-documenting** -- the Pydantic model serves as living documentation of what the LLM is expected to produce.

## Key Technical Details

- `with_structured_output` returns a new runnable; it does not modify the original model instance.
- The schema is typically injected as a tool-call schema. Some providers (OpenAI) also support a native `response_format` JSON mode.
- `Field(description=...)` is sent to the LLM as part of the schema, giving the model guidance on what each field should contain. Always write clear descriptions.
- `Literal` types constrain the model to an exact set of allowed values, which is ideal for classification and routing.
- If the model's output fails Pydantic validation, a `ValidationError` is raised. Wrap calls in try/except for resilience.
- You can use `Optional` fields for data the model may or may not be able to extract.
- Nested Pydantic models are supported for complex hierarchical schemas (e.g., a `Report` containing a list of `Finding` objects).
- The method works with any LangChain chat model that supports tool calling: Anthropic, OpenAI, Google, and others.

## Common Misconceptions

- **"Structured output is the same as asking the LLM to return JSON in the prompt."** Prompt-based JSON is unreliable and unvalidated. `with_structured_output` uses the provider's native schema enforcement and returns a parsed Pydantic object.
- **"You can only use simple flat schemas."** Nested models, lists, optional fields, and `Literal` enums are all supported and commonly used.
- **"Structured output replaces tool calling."** They share underlying mechanics but serve different purposes. Tool calling triggers external actions; structured output shapes the model's response format.
- **"The model always produces valid output on the first attempt."** While provider-level enforcement is strong, edge cases exist. Always handle potential `ValidationError` exceptions in production code.

## Connections to Other Concepts

- `tool-calling-loop.md` -- structured output and tool calling share the same underlying mechanism of schema-constrained generation.
- `prebuilt-react-agent.md` -- structured output is often used to evaluate or post-process the agent's final response.
- `manual-react-agent.md` -- custom nodes in a manual graph frequently use structured output for typed decision-making.
- `evaluation-and-testing.md` -- LLM-as-judge evaluators almost always use structured output to produce graded scores.
- `corrective-rag.md` -- document relevance grading in corrective RAG pipelines relies on structured output with pass/fail schemas.

## Further Reading

- [LangChain Structured Output How-To](https://python.langchain.com/docs/how_to/structured_output/)
- [Pydantic V2 Documentation](https://docs.pydantic.dev/latest/)
- [Anthropic Tool Use for Structured Output](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [OpenAI Structured Outputs Guide](https://platform.openai.com/docs/guides/structured-outputs)
