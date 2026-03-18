# Step 3: Your First Agent

One-Line Summary: Create a single CrewAI agent with a role, goal, and backstory, then run it on a simple task to see how agents work.

Prerequisites: Step 2 completed, virtual environment active

---

## What Is an Agent?

In CrewAI, an agent is an autonomous unit defined by three core attributes:

- **Role** — What the agent is (e.g., "Senior Research Analyst")
- **Goal** — What the agent is trying to achieve (e.g., "Find accurate, comprehensive information")
- **Backstory** — Context that shapes the agent's behavior and personality

These are not decorative labels. CrewAI injects them into the system prompt sent to the LLM, directly influencing the quality and style of the output. A well-crafted backstory produces dramatically better results than a vague one.

## Create Your First Agent

Open `agents.py` and add a simple agent:

```python
# agents.py — Define CrewAI agents

from crewai import Agent
from config import LLM_MODEL


def create_test_agent() -> Agent:
    """Create a simple test agent to verify the setup."""
    return Agent(
        role="Helpful Assistant",
        goal="Provide clear, accurate, and concise answers to questions",
        backstory=(
            "You are a knowledgeable assistant with expertise across "
            "many domains. You pride yourself on giving direct, "
            "well-structured answers without unnecessary filler."
        ),
        llm=LLM_MODEL,
        verbose=True,  # Print the agent's reasoning to the console
    )
```

The `verbose=True` flag is important during development — it prints the agent's chain-of-thought reasoning so you can see exactly what it is doing.

## Run the Agent on a Task

An agent needs a task to do something useful. Create a quick test script:

```python
# test_agent.py — Run a single agent on a single task

from crewai import Task, Crew, Process
from agents import create_test_agent

# Create the agent
agent = create_test_agent()

# Define a simple task
task = Task(
    description=(
        "Explain what a multi-agent system is in 3 concise paragraphs. "
        "Cover: what it is, why it is useful, and give one real-world example."
    ),
    expected_output=(
        "A clear, 3-paragraph explanation of multi-agent systems "
        "written for a developer audience."
    ),
    agent=agent,
)

# Create a crew with one agent and one task
crew = Crew(
    agents=[agent],
    tasks=[task],
    process=Process.sequential,
    verbose=True,
)

# Run the crew
result = crew.kickoff()

# Print the output
print("\n" + "=" * 60)
print("RESULT:")
print("=" * 60)
print(result.raw)
```

Run it:

```bash
python test_agent.py
```

## What You Should See

The console will show CrewAI's execution flow:

1. **Agent thinking** — The agent receives the task and begins reasoning
2. **Final answer** — The agent produces its response
3. **Result** — The crew returns the completed output

The verbose output looks something like this:

```
[2024-01-15 10:30:00] Working Agent: Helpful Assistant
[2024-01-15 10:30:00] Starting Task: Explain what a multi-agent system is...
[2024-01-15 10:30:05] Task output: A multi-agent system (MAS) is a computational
framework where multiple autonomous agents work together...
```

## Key Concepts

Notice the structure: **Agent + Task + Crew = Execution**.

| Concept | What It Does |
|---------|-------------|
| **Agent** | Defines who does the work (role, goal, backstory) |
| **Task** | Defines what needs to be done (description, expected output) |
| **Crew** | Orchestrates agents and tasks into a runnable workflow |
| **Process** | Determines execution order (`sequential` or `hierarchical`) |

The `expected_output` field on a task is important — it tells the agent what format and quality to aim for. Without it, agents tend to produce inconsistent outputs.

## Agent Configuration Tips

A few parameters worth knowing about:

```python
# Additional agent parameters (we will use some of these later)
agent = Agent(
    role="...",
    goal="...",
    backstory="...",
    llm=LLM_MODEL,
    verbose=True,
    allow_delegation=False,  # Prevent this agent from passing work to others
    max_iter=5,              # Maximum reasoning iterations before stopping
    memory=True,             # Enable short-term memory across tasks
)
```

For now, `allow_delegation=False` is a good default. Delegation lets agents hand off work to other agents, which can be powerful but also unpredictable when you are starting out.

Clean up the test file — we will not need it going forward:

```bash
rm test_agent.py test_setup.py
```

You have a working agent. Next, we will build the tools that give agents real-world capabilities.

---

[← Project Setup](02-project-setup.md) | [Next: Step 4 - Define Tools →](04-define-tools.md)
