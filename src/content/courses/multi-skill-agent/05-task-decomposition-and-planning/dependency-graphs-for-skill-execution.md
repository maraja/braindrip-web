# Dependency Graphs for Skill Execution

**One-Line Summary**: Modeling task steps as a directed acyclic graph (DAG) enables agents to identify parallelizable work and execute skills in optimal order.

**Prerequisites**: `breaking-complex-tasks-into-steps.md`, basic graph theory (nodes, edges, topological sort)

## What Is a Dependency Graph for Skill Execution?

Think of a dependency graph like a recipe with timing constraints. You can chop vegetables while the oven preheats -- those tasks are independent. But you cannot frost the cake until it has baked and cooled -- those tasks form a chain. A skilled cook identifies these relationships and overlaps independent tasks to finish faster. An AI agent does the same with its tool calls.

A dependency graph represents each sub-task as a node and each "must happen before" relationship as a directed edge. When task B requires the output of task A, there is an edge from A to B. The resulting graph must be acyclic (no circular dependencies) -- a DAG. This structure tells the agent exactly which tasks can run in parallel, which must wait, and in what order the waiting tasks should execute.

Without a dependency graph, the agent defaults to sequential execution -- one step at a time, even when three or four steps could run simultaneously. For tasks involving multiple independent API calls, this difference can mean 3-4x slower execution. The graph transforms a linear plan into an optimized parallel schedule.

## How It Works

### Building the Dependency Graph

The agent constructs the graph by analyzing each step's inputs and outputs. If step C's input references step A's output, there is a dependency edge from A to C.

```python
from dataclasses import dataclass, field

@dataclass
class TaskNode:
    id: str
    tool: str
    input_spec: dict
    depends_on: list[str] = field(default_factory=list)
    output_key: str = ""

class DependencyGraph:
    def __init__(self):
        self.nodes: dict[str, TaskNode] = {}

    def add_task(self, node: TaskNode):
        self.nodes[node.id] = node

    def add_dependency(self, from_id: str, to_id: str):
        """from_id must complete before to_id can start."""
        self.nodes[to_id].depends_on.append(from_id)

    def validate(self) -> bool:
        """Check for cycles using DFS."""
        visited = set()
        in_stack = set()

        def dfs(node_id: str) -> bool:
            if node_id in in_stack:
                return False  # Cycle detected
            if node_id in visited:
                return True
            visited.add(node_id)
            in_stack.add(node_id)
            for dep in self.nodes[node_id].depends_on:
                if not dfs(dep):
                    return False
            in_stack.discard(node_id)
            return True

        return all(dfs(nid) for nid in self.nodes if nid not in visited)
```

### Topological Sorting for Execution Order

Topological sorting produces an ordering where every task appears after all of its dependencies. More usefully for parallel execution, we compute the topological sort in layers (also called "levels" or "waves") -- each layer contains tasks that can run concurrently.

```python
from collections import deque

def topological_layers(graph: DependencyGraph) -> list[list[str]]:
    """Return tasks grouped into parallelizable layers."""
    in_degree = {nid: 0 for nid in graph.nodes}
    for node in graph.nodes.values():
        for dep in node.depends_on:
            in_degree[node.id] += 1  # counts are per-node, not per-dep

    # Recount properly
    in_degree = {nid: len(graph.nodes[nid].depends_on) for nid in graph.nodes}

    queue = deque([nid for nid, deg in in_degree.items() if deg == 0])
    layers = []

    while queue:
        layer = list(queue)
        layers.append(layer)
        queue.clear()

        for nid in layer:
            for candidate_id, candidate in graph.nodes.items():
                if nid in candidate.depends_on:
                    in_degree[candidate_id] -= 1
                    if in_degree[candidate_id] == 0:
                        queue.append(candidate_id)

    executed = sum(len(l) for l in layers)
    if executed != len(graph.nodes):
        raise ValueError("Cycle detected: not all tasks were scheduled")

    return layers
```

### Fan-Out / Fan-In Pattern

The most common parallel pattern in agent execution is fan-out/fan-in: one task produces a list, multiple tasks process items from that list in parallel, and a final task aggregates the results.

```
        ┌── Search API A ──┐
        │                   │
Start ──┼── Search API B ──┼── Merge Results ── Format Output
        │                   │
        └── Search API C ──┘

     (fan-out)          (fan-in)
```

Here is a concrete implementation:

```python
import asyncio

async def execute_dag(graph: DependencyGraph) -> dict[str, any]:
    """Execute a dependency graph with maximum parallelism."""
    results: dict[str, any] = {}
    layers = topological_layers(graph)

    for layer in layers:
        # All tasks in a layer can run concurrently
        tasks = []
        for node_id in layer:
            node = graph.nodes[node_id]
            resolved_input = resolve_inputs(node.input_spec, results)
            tasks.append(execute_single(node_id, node.tool, resolved_input))

        layer_results = await asyncio.gather(*tasks, return_exceptions=True)

        for node_id, result in zip(layer, layer_results):
            if isinstance(result, Exception):
                results[node_id] = {"error": str(result)}
            else:
                results[node_id] = result

    return results

async def execute_single(node_id: str, tool: str, inputs: dict) -> any:
    """Execute a single tool call."""
    tool_fn = TOOL_REGISTRY[tool]
    return await tool_fn(**inputs)

def resolve_inputs(input_spec: dict, results: dict) -> dict:
    """Replace $task_id references with actual results."""
    resolved = {}
    for key, value in input_spec.items():
        if isinstance(value, str) and value.startswith("$"):
            ref_id = value[1:].split(".")[0]
            path = value[1:].split(".")[1:]
            obj = results[ref_id]
            for p in path:
                obj = obj[p] if isinstance(obj, dict) else getattr(obj, p)
            resolved[key] = obj
        else:
            resolved[key] = value
    return resolved
```

### Real Example: Concurrent API Lookups

Consider an agent that needs to gather a company's stock price, recent news, and weather at their headquarters to generate a briefing. The stock and news lookups are independent, but the weather lookup requires knowing the HQ location (which comes from the company info).

```python
# Build the graph
g = DependencyGraph()

g.add_task(TaskNode(
    id="company_info",
    tool="web_search",
    input_spec={"query": "Acme Corp headquarters location"},
))
g.add_task(TaskNode(
    id="stock_price",
    tool="finance_api",
    input_spec={"symbol": "ACME"},
))
g.add_task(TaskNode(
    id="recent_news",
    tool="news_api",
    input_spec={"query": "Acme Corp"},
))
g.add_task(TaskNode(
    id="hq_weather",
    tool="weather_api",
    input_spec={"location": "$company_info.hq_city"},
    depends_on=["company_info"],
))
g.add_task(TaskNode(
    id="briefing",
    tool="llm_summarize",
    input_spec={
        "stock": "$stock_price",
        "news": "$recent_news",
        "weather": "$hq_weather",
        "info": "$company_info",
    },
    depends_on=["stock_price", "recent_news", "hq_weather"],
))

# Execution layers:
# Layer 0: [company_info, stock_price, recent_news]  -- 3 tasks in parallel
# Layer 1: [hq_weather]                               -- needs company_info
# Layer 2: [briefing]                                  -- needs all above

# Sequential: 5 steps × ~1s each = ~5s
# DAG-parallel: 3 layers × ~1s each = ~3s (40% faster)
```

### Handling Failures in the DAG

When a node fails, all downstream nodes that depend on it must be marked as blocked. Independent branches continue executing normally.

```python
def mark_blocked(graph: DependencyGraph, failed_id: str) -> set[str]:
    """Find all nodes transitively dependent on the failed node."""
    blocked = set()
    queue = deque([failed_id])
    while queue:
        current = queue.popleft()
        for nid, node in graph.nodes.items():
            if current in node.depends_on and nid not in blocked:
                blocked.add(nid)
                queue.append(nid)
    return blocked
```

## Why It Matters

### Execution Speed

For tasks with independent branches, DAG-based execution can reduce wall-clock time by 40-70%. An agent making 6 independent API calls sequentially takes 6 round trips. With a DAG, those 6 calls happen in one round trip.

### Correctness Guarantees

The dependency graph makes execution order explicit and verifiable. There is no risk of a step running before its prerequisites are ready, which is a common bug in ad-hoc parallel execution code.

## Key Technical Details

- Topological layer computation is O(V + E) where V is nodes and E is edges -- negligible overhead even for 100+ step plans
- In practice, most agent DAGs have 5-15 nodes and 2-4 layers
- asyncio.gather with `return_exceptions=True` prevents one failure from canceling parallel siblings
- Fan-out degree (number of parallel tasks) should be capped at 5-10 to avoid overwhelming rate-limited APIs
- The critical path (longest chain of dependent tasks) determines the minimum possible execution time regardless of parallelism
- Dynamic DAG modification (adding/removing nodes at runtime) supports adaptive replanning

## Common Misconceptions

**"More parallelism is always better"**: Parallelism is limited by the critical path, API rate limits, and resource constraints. If three of your five parallel API calls hit the same rate-limited endpoint, they serialize anyway. The DAG shows theoretical parallelism; the executor must respect practical limits.

**"DAGs cannot handle loops"**: Correct -- a DAG is acyclic by definition. For iterative processes (retry loops, pagination), the loop logic lives inside a single node. The node appears once in the DAG, but its internal implementation may iterate multiple times.

## Connections to Other Concepts

- `breaking-complex-tasks-into-steps.md` -- Decomposition produces the nodes; dependency analysis produces the edges
- `parallel-skill-execution.md` -- The runtime execution of parallel DAG layers
- `plan-then-execute-pattern.md` -- Plans can be represented as DAGs rather than linear sequences
- `adaptive-replanning.md` -- Failed DAG nodes trigger replanning of downstream subgraphs

## Further Reading

- Kahn, "Topological Sorting of Large Networks" (1962) -- The original algorithm for topological sort used in DAG scheduling
- LangGraph Documentation, "Branching and Merging" (2024) -- Practical guide to fan-out/fan-in in LangGraph
- Dean and Ghemawat, "MapReduce: Simplified Data Processing on Large Clusters" (2004) -- The fan-out/fan-in pattern at massive scale
