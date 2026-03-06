# Evaluation with Datasets

**One-Line Summary**: LangSmith datasets and the `evaluate()` function enable systematic, repeatable testing of agent behavior with custom evaluators and regression tracking.

**Prerequisites**: `langsmith-setup.md`, `tracing-and-debugging.md`

## What Is Evaluation with Datasets?

Think of LangSmith evaluation like a standardized test for your agent. You prepare a set of questions (inputs) with answer keys (expected outputs), run the agent through all of them, and then grade the results automatically. Just as a teacher uses rubrics to score essays consistently, LangSmith evaluators apply defined criteria to every response, producing scores you can track across model versions, prompt changes, and code updates.

Without systematic evaluation, agent quality is judged by vibes. A developer runs a few queries, glances at the outputs, and declares the agent "good enough." This breaks down because agents are non-deterministic, edge cases are invisible during casual testing, and regressions creep in silently. Dataset-driven evaluation replaces intuition with evidence.

LangSmith provides the infrastructure for this workflow: dataset storage, evaluation orchestration, custom evaluator functions, and a dashboard that tracks scores over time.

## How It Works

### Creating a Dataset

Datasets are collections of input/expected-output pairs stored in LangSmith:

```python
from langsmith import Client

client = Client()

dataset = client.create_dataset(
    dataset_name="agent-qa-tests",
    description="Core QA test cases for the support agent"
)

client.create_examples(
    dataset_name="agent-qa-tests",
    inputs=[
        {"question": "What is your return policy?"},
        {"question": "How do I reset my password?"},
        {"question": "What payment methods do you accept?"},
    ],
    outputs=[
        {"answer": "30-day return policy with full refund"},
        {"answer": "Click 'Forgot Password' on the login page"},
        {"answer": "Visa, Mastercard, PayPal, and Apple Pay"},
    ]
)
```

### Defining the Predict Function

The predict function wraps your agent so the evaluator can call it with each dataset input:

```python
# Assume `app` is your compiled LangGraph agent
def predict(inputs: dict) -> dict:
    """Run the agent on a single test input."""
    result = app.invoke({
        "messages": [("user", inputs["question"])]
    })
    final_message = result["messages"][-1].content
    return {"answer": final_message}
```

### Writing Custom Evaluators

Evaluators score each prediction against the expected output:

```python
def correctness_evaluator(run, example) -> dict:
    """Check if the prediction contains key information."""
    predicted = run.outputs.get("answer", "")
    expected = example.outputs.get("answer", "")
    expected_words = set(expected.lower().split())
    predicted_words = set(predicted.lower().split())
    overlap = len(expected_words & predicted_words)
    score = overlap / max(len(expected_words), 1)
    return {"key": "correctness", "score": score}

def length_evaluator(run, example) -> dict:
    """Ensure responses are concise."""
    predicted = run.outputs.get("answer", "")
    word_count = len(predicted.split())
    score = 1.0 if word_count < 100 else 0.5
    return {"key": "conciseness", "score": score}
```

### Running the Evaluation

The `evaluate()` function ties everything together:

```python
from langsmith.evaluation import evaluate

results = evaluate(
    predict,
    data="agent-qa-tests",
    evaluators=[correctness_evaluator, length_evaluator],
    experiment_prefix="v2-gpt4o",
    max_concurrency=4,
)
print(f"Mean correctness: {results['correctness'].mean():.2f}")
```

### Regression Testing Across Versions

Run the same dataset after every change to detect regressions:

```python
# After updating the prompt or model
results_v3 = evaluate(
    predict_v3,
    data="agent-qa-tests",
    evaluators=[correctness_evaluator, length_evaluator],
    experiment_prefix="v3-claude-sonnet",
    max_concurrency=4,
)
# Compare v2 vs v3 in the LangSmith dashboard
# Each experiment_prefix creates a named column for comparison
```

## Why It Matters

1. **Objective quality measurement**: Evaluation scores replace subjective judgments with repeatable, quantitative metrics that the entire team can agree on.
2. **Regression prevention**: Running the test suite after every change catches degradation immediately, before bad outputs reach production users.
3. **Model comparison**: The same dataset evaluated against different models or prompt versions produces direct, apples-to-apples comparisons.
4. **Edge case coverage**: Datasets grow over time as production failures are added as new test cases, building a comprehensive safety net.

## Key Technical Details

- Datasets are stored server-side in LangSmith and versioned, so evaluation results always reference the exact data used.
- The `evaluate()` function runs predictions and evaluators concurrently with configurable `max_concurrency`.
- Each evaluation run creates an **experiment** that appears as a column in the dataset's comparison view.
- Evaluators receive the full `run` object, including traces, so they can inspect intermediate steps, not just final output.
- Built-in evaluators are available for common criteria like hallucination detection, relevance, and helpfulness.
- Datasets support **key-value pairs**, **chat messages**, and **LLM prompt** formats for different use cases.
- Evaluation results include per-example scores, aggregate statistics, and links to individual traces.

## Common Misconceptions

- **"Evaluation datasets need hundreds of examples to be useful."** Even 10 to 20 well-chosen examples covering core scenarios and known edge cases provide significant regression protection.
- **"Custom evaluators must use LLM-based grading."** Simple heuristic evaluators using string matching, keyword checks, or structured output validation are fast, cheap, and often sufficient.
- **"Evaluation replaces manual testing entirely."** Automated evaluation catches known failure modes. Manual review is still essential for discovering new failure categories and validating evaluator quality.
- **"You need separate evaluation infrastructure outside LangSmith."** LangSmith handles dataset storage, execution, scoring, and comparison in a single platform without requiring external test runners.

## Connections to Other Concepts

- `langsmith-setup.md` -- Required environment configuration before evaluation runs can be traced.
- `tracing-and-debugging.md` -- Every evaluation run produces full traces for debugging individual failures.
- `production-monitoring.md` -- Production failures should be added to evaluation datasets as new test cases.
- `tool-calling-basics.md` -- Evaluators can verify that the agent called the correct tools with the right arguments.
- `building-a-basic-chatbot.md` -- The chatbot agent is a natural first candidate for dataset evaluation.

## Further Reading

- [LangSmith Evaluation Guide](https://docs.smith.langchain.com/evaluation) -- Official documentation on datasets, evaluators, and experiments.
- [Testing LLM Applications (LangChain Blog)](https://blog.langchain.dev/testing-llm-applications/) -- Strategies for building effective test suites.
- [LangSmith Cookbook: Evaluation Recipes](https://github.com/langchain-ai/langsmith-cookbook) -- Practical examples of custom evaluators and dataset management.
