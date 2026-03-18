# Step 9: Run the Crew

One-Line Summary: Assemble all agents and tasks into a crew, execute it on a real topic, and understand the agent interactions and output.

Prerequisites: Steps 1-8 completed, all agents and tasks defined

---

## The Main Entry Point

This is the file that ties everything together. It accepts a topic from the command line, builds the crew, and runs it:

```python
# main.py
"""
Multi-Agent Content Production Pipeline.

Usage:
    python main.py "Your topic here"
    python main.py "The future of quantum computing"
    python main.py "How RAG systems work in production"

Three agents collaborate to produce a well-researched article:
    1. Researcher — finds and organizes information
    2. Writer — drafts the article from research notes
    3. Editor — polishes and saves the final version
"""

import sys
import time
from crewai import Crew, Process
from tasks import create_tasks


def run_crew(topic: str) -> str:
    """
    Run the content production crew on a given topic.

    Args:
        topic: The subject to research and write about.

    Returns:
        The final article text.
    """
    print(f"\n{'=' * 60}")
    print(f"MULTI-AGENT CONTENT PIPELINE")
    print(f"Topic: {topic}")
    print(f"{'=' * 60}\n")

    # Create agents and tasks for this topic
    agents, tasks = create_tasks(topic)

    # Assemble the crew
    crew = Crew(
        agents=agents,
        tasks=tasks,
        # Sequential process — tasks run in order
        process=Process.sequential,
        # Print detailed agent reasoning
        verbose=True,
        # Memory allows agents to recall context across tasks
        memory=True,
        # Cache tool results to avoid duplicate API calls
        cache=True,
        # Maximum requests per minute (prevents rate limiting)
        max_rpm=30,
    )

    # Track execution time
    start_time = time.time()

    # Kick off the crew — this runs all three agents in sequence
    result = crew.kickoff()

    elapsed = time.time() - start_time

    print(f"\n{'=' * 60}")
    print(f"PIPELINE COMPLETE")
    print(f"Time: {elapsed:.1f} seconds")
    print(f"{'=' * 60}\n")

    return result.raw


def main():
    """Parse command-line arguments and run the crew."""
    if len(sys.argv) < 2:
        print("Usage: python main.py \"Your topic here\"")
        print("Example: python main.py \"The future of quantum computing\"")
        sys.exit(1)

    topic = sys.argv[1]
    article = run_crew(topic)

    # Print the final article
    print("\nFINAL ARTICLE:")
    print("-" * 60)
    print(article)
    print("-" * 60)
    print("\nArticle saved to: output/article.md")


if __name__ == "__main__":
    main()
```

## Run It

```bash
# Run the crew on a topic
python main.py "The future of quantum computing"
```

The pipeline takes 2-5 minutes depending on the complexity of the topic and the number of web searches. Watch the verbose output to see each agent working.

## Reading the Output

The verbose logs show three distinct phases:

**Phase 1: Researcher**
```
[Agent: Senior Research Analyst] Starting task...
[Agent: Senior Research Analyst] Using tool: web_search
[Agent: Senior Research Analyst] web_search("quantum computing 2025 breakthroughs")
[Agent: Senior Research Analyst] Observation: ...
[Agent: Senior Research Analyst] Using tool: web_search
[Agent: Senior Research Analyst] web_search("quantum error correction progress")
[Agent: Senior Research Analyst] Final Answer: ## Research Notes...
```

**Phase 2: Writer**
```
[Agent: Senior Content Writer] Starting task...
[Agent: Senior Content Writer] Thinking...
[Agent: Senior Content Writer] Final Answer: # The Quantum Leap...
```

**Phase 3: Editor**
```
[Agent: Senior Editor] Starting task...
[Agent: Senior Editor] Thinking...
[Agent: Senior Editor] Using tool: save_to_file
[Agent: Senior Editor] Final Answer: # The Quantum Leap (polished)...
```

## Check the Output File

```bash
# View the saved article
cat output/article.md
```

You should see a complete, well-structured Markdown article with a title, introduction, body sections, and conclusion.

## Understanding Token Usage

Each agent makes one or more LLM calls. A typical run uses:

| Agent | Approximate Tokens | Notes |
|-------|-------------------|-------|
| Researcher | 3,000-8,000 | Multiple tool calls increase usage |
| Writer | 4,000-6,000 | Single generation, longest output |
| Editor | 3,000-5,000 | Receives all prior context |
| **Total** | **10,000-19,000** | Roughly $0.05-0.15 per article with Claude Sonnet |

## Troubleshooting

**"Rate limit exceeded" errors:**
Lower the `max_rpm` parameter in the Crew configuration, or add a delay between runs.

**Agent stuck in a loop:**
The `max_iter` parameter on each agent limits how many times it can call tools. If an agent hits this limit, it returns its best answer so far.

**Empty or short output:**
Check that the `expected_output` field in your tasks is specific enough. Vague expected outputs produce vague results.

**Tool errors:**
Check the verbose logs for the exact error message. Common issues are missing API keys or network connectivity problems.

---

[← Tasks and Workflow](08-tasks-and-workflow.md) | [Next: Step 10 - Customize and Extend →](10-customize-and-extend.md)
