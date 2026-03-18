# Step 10: Customize and Extend

One-Line Summary: Add more agents, parallel execution, callbacks, and human-in-the-loop approval to your crew.

Prerequisites: Running crew from Step 9

---

## Add a Fact-Checker Agent

Your pipeline currently produces content, but nothing verifies accuracy. Add a fourth agent:

```python
# agents/fact_checker.py
from crewai import Agent

def create_fact_checker(llm):
    return Agent(
        role="Fact Checker",
        goal="Verify claims and statistics in the article against reliable sources",
        backstory=(
            "You are a meticulous fact-checker with a background in journalism. "
            "You cross-reference every claim, statistic, and quote against "
            "authoritative sources. You flag anything unverified."
        ),
        llm=llm,
        verbose=True,
    )
```

Add a fact-checking task between the editor and the final output:

```python
from crewai import Task

fact_check_task = Task(
    description=(
        "Review the edited article and verify all factual claims, "
        "statistics, and technical statements. Flag anything that "
        "cannot be verified. Add [VERIFIED] or [NEEDS CITATION] "
        "markers to each claim."
    ),
    expected_output="The article with fact-check annotations",
    agent=fact_checker,
    context=[editing_task],
)
```

## Parallel Task Execution

By default, CrewAI runs tasks sequentially. For independent research tasks, use parallel execution:

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, writer, editor, fact_checker],
    tasks=[
        research_task,       # Runs first
        writing_task,        # Waits for research
        editing_task,        # Waits for writing
        fact_check_task,     # Waits for editing
    ],
    process=Process.sequential,  # Default
    verbose=True,
)
```

For multiple independent research topics, you can create parallel research tasks:

```python
# Two research tasks that run in parallel
research_ai = Task(
    description="Research recent AI developments",
    agent=researcher,
    async_execution=True,  # Runs in parallel
)

research_business = Task(
    description="Research business impact of AI",
    agent=researcher,
    async_execution=True,  # Runs in parallel
)

# Writing task waits for both
writing_task = Task(
    description="Write an article combining both research threads",
    agent=writer,
    context=[research_ai, research_business],  # Depends on both
)
```

## Human-in-the-Loop

Add approval checkpoints where a human reviews output before the next agent proceeds:

```python
editing_task = Task(
    description="Edit and polish the article",
    agent=editor,
    human_input=True,  # Pauses for human approval
)
```

When `human_input=True`, CrewAI will print the agent's output and prompt you in the terminal to approve, reject, or provide feedback before continuing.

## Custom Callbacks

Track agent activity with callbacks:

```python
from crewai import Crew

def on_task_complete(task_output):
    print(f"\n{'='*50}")
    print(f"Task completed: {task_output.description[:50]}...")
    print(f"Output length: {len(task_output.raw)} chars")
    print(f"{'='*50}\n")

crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, writing_task, editing_task],
    task_callback=on_task_complete,
    verbose=True,
)
```

---

[← Run the Crew](09-run-the-crew.md) | [Next: Step 11 - What's Next →](11-whats-next.md)
