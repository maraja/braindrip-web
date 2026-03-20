# Breaking Complex Tasks into Steps

**One-Line Summary**: Agents tackle complex requests by recursively decomposing them into atomic sub-tasks arranged in a dependency-aware hierarchy.

**Prerequisites**: Basic understanding of LLM prompting, familiarity with tree data structures

## What Is Task Decomposition?

When a human manager receives a request like "Research competitor pricing and create a comparison spreadsheet," they don't attempt everything at once. They mentally break it down: identify competitors, find pricing pages, extract data points, normalize formats, build the spreadsheet, and verify accuracy. Each of those steps might break down further. An AI agent does the same thing, but explicitly and programmatically.

Task decomposition is the process of transforming a high-level goal into a tree of smaller, actionable sub-tasks that an agent can execute with its available tools. Each leaf node in the tree represents an atomic operation -- something a single skill or tool call can accomplish. The internal nodes represent groupings and dependencies. This decomposition is what separates a capable agent from a naive prompt-and-pray system.

The quality of decomposition directly determines agent success. Decompose too coarsely and individual steps remain ambiguous. Decompose too finely and you waste tokens on trivial coordination. The sweet spot is sub-tasks that map cleanly to one tool invocation or one LLM reasoning step.

## How It Works

### Hierarchical Decomposition

The agent receives a complex task and uses the LLM to produce a structured breakdown. This typically happens in a dedicated planning step before any execution begins. The decomposition is hierarchical -- top-level goals split into phases, phases split into steps, and steps split into atomic actions.

```python
from openai import OpenAI

DECOMPOSITION_PROMPT = """You are a task planner. Break down the user's request
into a hierarchical task tree. Each leaf task should be achievable with a single
tool call or reasoning step.

Output format (JSON):
{
  "goal": "top-level goal",
  "subtasks": [
    {
      "id": "1",
      "description": "...",
      "subtasks": [
        {"id": "1.1", "description": "...", "tool": "web_search", "atomic": true},
        {"id": "1.2", "description": "...", "tool": "web_search", "atomic": true}
      ]
    }
  ]
}

Available tools: web_search, scrape_page, extract_data, create_spreadsheet,
calculate, send_email
"""

client = OpenAI()

def decompose_task(user_request: str) -> dict:
    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": DECOMPOSITION_PROMPT},
            {"role": "user", "content": user_request},
        ],
    )
    return json.loads(response.choices[0].message.content)
```

### A Real Decomposition Example

Consider the request: "Research competitor pricing and create a comparison spreadsheet." Here is a realistic task tree the agent might produce:

```
Goal: Research competitor pricing and create comparison spreadsheet
│
├── 1. Identify competitors
│   ├── 1.1 Search for "top competitors in [domain]"       [web_search]
│   └── 1.2 Extract company names from search results      [extract_data]
│
├── 2. Gather pricing data (for each competitor)
│   ├── 2.1 Search for "[competitor] pricing page"          [web_search]
│   ├── 2.2 Scrape the pricing page content                 [scrape_page]
│   └── 2.3 Extract plan names, prices, features            [extract_data]
│
├── 3. Normalize and compare
│   ├── 3.1 Convert all prices to monthly USD               [calculate]
│   ├── 3.2 Align feature lists across competitors          [extract_data]
│   └── 3.3 Identify cheapest/most expensive per tier       [calculate]
│
└── 4. Build deliverable
    ├── 4.1 Create spreadsheet with comparison table        [create_spreadsheet]
    └── 4.2 Add summary row with recommendations            [create_spreadsheet]
```

Notice that step 2 repeats for each competitor discovered in step 1 -- the agent cannot know the exact sub-tasks until step 1 completes. This is a common pattern: decomposition is partially deferred until runtime data is available.

### Dependency Identification

Not all sub-tasks are independent. Step 3.1 requires output from all instances of step 2.3. Step 2.1 requires the competitor list from step 1.2. The agent must identify these data dependencies to determine execution order.

```python
dependencies = {
    "1.1": [],
    "1.2": ["1.1"],
    "2.1": ["1.2"],       # needs competitor names
    "2.2": ["2.1"],       # needs URLs from search
    "2.3": ["2.2"],       # needs page content
    "3.1": ["2.3"],       # needs all pricing data
    "3.2": ["2.3"],
    "3.3": ["3.1", "3.2"],
    "4.1": ["3.3"],
    "4.2": ["4.1"],
}
```

There are three types of dependencies to watch for:

**Sequential dependencies**: Task B needs the direct output of task A. Task 2.2 cannot run until 2.1 provides the URL.

**Aggregation dependencies**: Task C needs combined outputs from tasks A1, A2, and A3. Task 3.1 needs all pricing data from every competitor before normalizing.

**Resource dependencies**: Tasks share a rate-limited API. Even if two searches are data-independent, they may need to serialize to avoid hitting rate limits.

### Parallelizable vs Sequential Steps

Once dependencies are mapped, the agent can identify which steps run in parallel and which must be sequential. Steps 2.1 through 2.3 for different competitors are independent of each other and can execute concurrently. Steps 3.1 and 3.2 can also run in parallel since they both depend on 2.3 but not on each other.

```python
from collections import deque

def find_execution_waves(dependencies: dict) -> list[list[str]]:
    """Group tasks into waves where all tasks in a wave can run in parallel."""
    remaining = dict(dependencies)
    completed = set()
    waves = []

    while remaining:
        wave = [
            task for task, deps in remaining.items()
            if all(d in completed for d in deps)
        ]
        if not wave:
            raise ValueError("Circular dependency detected")
        waves.append(wave)
        completed.update(wave)
        for task in wave:
            del remaining[task]

    return waves

# Result: [["1.1"], ["1.2"], ["2.1_A", "2.1_B", "2.1_C"], ...]
```

### Atomicity Testing

A sub-task is truly atomic when it meets three criteria: (1) it requires exactly one tool call or one reasoning step, (2) its success or failure is unambiguous, and (3) its output type is well-defined. If a sub-task feels like it needs its own decomposition, it is not atomic yet.

For example, "Research Competitor A's pricing" is not atomic. It involves navigating pages, handling login walls, and parsing tier structures. Better: "Fetch the HTML content of Competitor A's pricing URL" (one scrape call) followed by "Extract plan names and dollar amounts from the HTML" (one extraction call).

## Why It Matters

### Tractability

LLMs have limited context windows and reasoning depth. A single prompt asking the model to "research competitors and build a spreadsheet" will produce shallow, incomplete results. By decomposing the task, each sub-step gets focused attention and clear inputs, leading to dramatically better output quality.

### Reliability Through Isolation

When a monolithic task fails, you lose everything and must retry from scratch. When a decomposed task fails at step 2.3 for one competitor, you can retry just that step while keeping results from the others. Decomposition transforms brittle all-or-nothing execution into resilient, recoverable workflows.

## Key Technical Details

- LLMs produce better decompositions when given the list of available tools upfront -- they anchor sub-tasks to concrete capabilities
- Typical decomposition depth is 2-3 levels; deeper trees add coordination overhead without improving quality
- Leaf tasks should complete in under 30 seconds to keep the feedback loop tight and enable fast retries
- The decomposition step itself costs 500-2000 tokens depending on task complexity
- JSON output format for task trees has higher parsing reliability than free text (95%+ valid parse rate vs ~80% for numbered lists)
- Dynamic decomposition (expanding sub-tasks at runtime) handles cases where the task shape depends on intermediate results
- Tasks with more than 20 atomic steps should be split into separate agent sessions to avoid context window exhaustion
- Over-decomposition is preferable to under-decomposition: merging two steps is easier than splitting a failed monolithic step

## Common Misconceptions

**"The LLM should decompose and execute in one pass"**: This conflates planning with execution. The decomposition step should be its own dedicated LLM call with a structured output format. Mixing planning and execution leads to the model skipping steps, hallucinating results, or losing track of where it is in the plan. Separate the planner from the executor.

**"Decomposition is a one-time step"**: Initial decomposition is a best guess. As the agent executes and encounters unexpected results -- a competitor has no public pricing, an API returns an error -- the decomposition must be revised. Think of the initial tree as a draft, not a contract.

## Connections to Other Concepts

- `plan-then-execute-pattern.md` -- The architectural pattern that separates decomposition from execution
- `adaptive-replanning.md` -- How the task tree gets revised when reality diverges from the plan
- `dependency-graphs-for-skill-execution.md` -- Formalizing the dependency structure as a DAG for optimal scheduling
- `parallel-skill-execution.md` -- Executing independent branches of the task tree concurrently
- `sequential-skill-chains.md` -- The simplest execution pattern for fully sequential decompositions

## Further Reading

- Yao et al., "Tree of Thoughts: Deliberate Problem Solving with Large Language Models" (2023) -- Foundational work on structured LLM reasoning through decomposition
- Wei et al., "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (2022) -- The precursor technique that showed step-by-step reasoning improves LLM output
- Khot et al., "Decomposed Prompting: A Modular Approach for Solving Complex Tasks" (2023) -- Systematic study of decomposition strategies for LLM agents
