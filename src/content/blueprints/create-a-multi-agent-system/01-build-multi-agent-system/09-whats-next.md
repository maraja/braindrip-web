# Step 9: What's Next

One-Line Summary: Extend your pipeline with more agents, explore frameworks like CrewAI and LangGraph, and learn scaling patterns for production.

Prerequisites: Steps 1-8 completed

---

## What You Built

You now have a working multi-agent content production pipeline:

| Component | Implementation |
|-----------|---------------|
| **Agent class** | 60-line Python class wrapping the Anthropic SDK |
| **Researcher** | Web search + structured note compilation |
| **Writer** | Research-to-article transformation |
| **Editor** | Draft polishing + file saving |
| **Pipeline** | Sequential orchestration with string-based context passing |

Three packages. No frameworks. About 200 lines of code total.

## Add More Agents

The Agent class makes it easy to add new agents. Here is a Fact-Checker that slots between the Writer and Editor:

```python
# Add to agents.py

def create_fact_checker():
    """Fact-Checker that verifies claims against research."""
    return Agent(
        name="Fact Checker",
        system_prompt=(
            "You are a rigorous fact-checker. Compare every claim "
            "in the article against the research notes. Flag any "
            "unsupported claims, incorrect statistics, or misleading "
            "statements. Produce a corrected version of the article."
        ),
        tools=[WEB_SEARCH_TOOL],
        tool_functions={"web_search": web_search},
    )
```

Then update the pipeline:

```python
# In main.py — add fact-checking between writing and editing
fact_checker = create_fact_checker()
checked = fact_checker.run(
    f"Fact-check this article about: {topic}\n\n"
    f"Original research notes:\n{research_notes}\n\n"
    f"Article to check:\n{draft}"
)
final = editor.run(f"Edit this fact-checked draft:\n{checked}")
```

## Human-in-the-Loop

Add a human review step by pausing the pipeline:

```python
# In main.py — add human review before final editing

draft = writer.run(...)

# Show the draft and ask for feedback
print("\n" + "=" * 60)
print("DRAFT FOR REVIEW:")
print("=" * 60)
print(draft)
print("\nEnter feedback (or press Enter to approve):")
feedback = input("> ").strip()

if feedback:
    # Re-run the writer with feedback
    draft = writer.run(
        f"Revise this article about: {topic}\n\n"
        f"Current draft:\n{draft}\n\n"
        f"Editor feedback: {feedback}"
    )

final = editor.run(...)
```

## When to Use a Framework

Our from-scratch approach is great for learning and for simple pipelines. Consider a framework when you need:

| Need | Framework |
|------|-----------|
| Complex workflows with branching | **LangGraph** — graph-based state machines |
| Many agents with role-based delegation | **CrewAI** — intuitive roles/tasks model |
| Production observability and tracing | **LangSmith** or **Langfuse** |
| Managed agent infrastructure | **Claude Agent SDK** |

The concepts transfer directly. Our `Agent` class maps to any framework's agent abstraction. Our string-based context passing maps to context/state objects. The pipeline pattern maps to sequential/graph execution.

## Framework Comparison

| Feature | Our Approach | CrewAI | LangGraph |
|---------|-------------|--------|-----------|
| **Lines of code** | ~200 | ~80 | ~150 |
| **Dependencies** | 3 packages | 4 packages | 3 packages |
| **Transparency** | Full — you see every prompt | Moderate — some abstraction | High — explicit state graph |
| **Branching** | Manual if/else | Limited | Native |
| **Learning curve** | Just Python + Claude API | Low | Medium |

## Scaling Patterns

**Parallel agents** — Run independent agents concurrently:

```python
import concurrent.futures

def run_parallel_research(topics):
    """Run multiple researchers in parallel."""
    researcher = create_researcher()
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        futures = {
            pool.submit(researcher.run, f"Research: {t}"): t
            for t in topics
        }
        results = {}
        for future in concurrent.futures.as_completed(futures):
            topic = futures[future]
            results[topic] = future.result()
    return results
```

**Cost management** — Multi-agent systems make many LLM calls. Track usage:

```python
# Add to agent.py — track token usage
def run(self, user_message, max_iterations=10):
    total_tokens = 0
    # ... in the loop after each API call:
    total_tokens += response.usage.input_tokens + response.usage.output_tokens
    # ... at the end:
    print(f"  [{self.name}] Tokens used: {total_tokens}")
```

## Ideas to Build Next

- **Code review pipeline** — Researcher finds best practices, Reviewer analyzes code, Reporter writes the review
- **Customer support** — Classifier routes tickets, Responder drafts replies, QA checks accuracy
- **Data analysis** — Collector gathers data, Analyst interprets, Narrator writes the report

## Key Takeaways

1. **An agent is just an LLM call in a loop** — system prompt + tools + iteration
2. **Tools are plain functions** — any Python function can be a tool
3. **Context passes through strings** — no special mechanism needed
4. **System prompts are the main lever** — specific prompts produce specific results
5. **Start without frameworks** — understand the pattern first, adopt frameworks when you need their specific features

You have the foundation. Now go build something.

---

[← Run the Pipeline](08-run-the-pipeline.md)
