# Step 10: Customize and Extend

One-Line Summary: Add more agents, run tasks in parallel, use callbacks to monitor progress, and add human-in-the-loop approval.

Prerequisites: Steps 1-9 completed, full pipeline running

---

## Add a Fact-Checker Agent

The simplest extension is adding more agents. Here is a Fact-Checker that runs between the Writer and Editor:

```python
# Add to agents.py

def create_fact_checker() -> Agent:
    """Create a Fact-Checker agent that verifies claims."""
    return Agent(
        role="Senior Fact Checker",
        goal=(
            "Verify every factual claim in the article against "
            "the original research notes. Flag any unsupported "
            "claims, incorrect statistics, or misleading statements."
        ),
        backstory=(
            "You are a rigorous fact-checker who worked at "
            "The New York Times for a decade. You compare every "
            "claim against source material and flag anything that "
            "cannot be verified. You produce a clean version of "
            "the article with corrections applied and a list of "
            "changes made."
        ),
        tools=[web_search],  # Can search to verify claims
        llm=LLM_MODEL,
        verbose=True,
        allow_delegation=False,
    )
```

Add the corresponding task:

```python
# Add to tasks.py

def create_fact_check_task(
    agent: Agent,
    topic: str,
    research_task: Task,
    writing_task: Task,
) -> Task:
    """Create a fact-checking task that cross-references the article."""
    return Task(
        description=(
            f"Fact-check the draft article about: {topic}\n\n"
            "Compare every factual claim in the article against "
            "the original research notes. For each claim:\n"
            "1. Verify it appears in the research notes\n"
            "2. Check that statistics and numbers are accurate\n"
            "3. Search the web to verify any claim you are unsure about\n"
            "4. Flag any claim that cannot be verified\n\n"
            "Produce a corrected version of the article with all "
            "issues resolved."
        ),
        expected_output=(
            "A corrected version of the article with all factual "
            "claims verified. Include a brief summary of changes made."
        ),
        agent=agent,
        context=[research_task, writing_task],  # Sees both
    )
```

Then update the crew in `main.py` to include the new agent in the pipeline.

## Parallel Tasks

Not all tasks need to run sequentially. If you have independent work, run tasks in parallel:

```python
# Example: Two researchers working on different subtopics simultaneously

from crewai import Crew, Process

# Two independent research tasks
tech_research = Task(
    description="Research the technical aspects of quantum computing...",
    expected_output="Technical research notes...",
    agent=tech_researcher,
)

market_research = Task(
    description="Research the market and business aspects of quantum computing...",
    expected_output="Market research notes...",
    agent=market_researcher,
)

# Writer receives both research outputs
writing_task = Task(
    description="Write an article combining both perspectives...",
    expected_output="A comprehensive article...",
    agent=writer,
    context=[tech_research, market_research],  # Both feed into the writer
)

# CrewAI detects that tech_research and market_research
# have no dependencies on each other and can run in parallel
crew = Crew(
    agents=[tech_researcher, market_researcher, writer],
    tasks=[tech_research, market_research, writing_task],
    process=Process.sequential,
    verbose=True,
)
```

When tasks have no dependency on each other (neither appears in the other's `context`), CrewAI can recognize they are independent. The sequential process still runs them in order, but you can use hierarchical mode for true parallelism.

## Callbacks for Monitoring

Add callbacks to track progress in real time. This is essential for production systems where you need logging and monitoring:

```python
# callbacks.py — Monitor agent and task progress

from datetime import datetime


def on_task_start(task_output):
    """Called when a task begins execution."""
    print(f"[{datetime.now():%H:%M:%S}] Task started")


def on_task_complete(task_output):
    """Called when a task finishes."""
    output_preview = str(task_output)[:100]
    print(f"[{datetime.now():%H:%M:%S}] Task complete: {output_preview}...")


# Use callbacks in your task definitions
research_task = Task(
    description="...",
    expected_output="...",
    agent=researcher,
    callback=on_task_complete,  # Fires when this task completes
)
```

## Human-in-the-Loop

For workflows where you want human approval before proceeding, CrewAI supports human input on tasks:

```python
# Add human review before the Editor finalizes

editing_task = Task(
    description=(
        "Edit and polish the draft article. Present the edited "
        "version to the human reviewer for approval before saving."
    ),
    expected_output="A polished article approved by the human reviewer.",
    agent=editor,
    human_input=True,  # Pauses and asks for human feedback
)
```

When `human_input=True`, the crew pauses before completing this task and prints the agent's output to the terminal. You can provide feedback, request changes, or approve. The agent incorporates your feedback and continues.

This is useful for:

- Reviewing article quality before publishing
- Catching tone or accuracy issues
- Adding domain expertise the agents lack

## Hierarchical Process

For complex systems, switch from sequential to hierarchical. A manager agent delegates tasks:

```python
# Hierarchical crew with a manager
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, writing_task, editing_task],
    process=Process.hierarchical,
    manager_llm=LLM_MODEL,  # The manager uses the same LLM
    verbose=True,
)
```

In hierarchical mode, CrewAI creates a manager agent that:

- Reads all task descriptions
- Decides which agent should handle each task
- Routes work and manages dependencies
- Synthesizes the final output

Use hierarchical when the workflow is not a simple linear chain — for example, when the manager might decide to send work back for revision.

## Configuration Summary

| Extension | When to Use |
|-----------|------------|
| **More agents** | When you need specialized expertise (fact-checking, SEO, translation) |
| **Parallel tasks** | When independent work can happen simultaneously |
| **Callbacks** | When you need logging, monitoring, or progress tracking |
| **Human-in-the-loop** | When human judgment is required at key decision points |
| **Hierarchical process** | When the workflow has branching, delegation, or revision loops |

Start with the simple sequential pipeline. Add complexity only when you have a specific need.

---

[← Run the Crew](09-run-the-crew.md) | [Next: Step 11 - What's Next →](11-whats-next.md)
