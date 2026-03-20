# Sequential Skill Chains

**One-Line Summary**: Sequential skill chains execute tools in strict order where each step's output feeds directly into the next step's input, forming the simplest and most predictable orchestration pattern.

**Prerequisites**: Basic Python, understanding of function composition

## What Is a Sequential Skill Chain?

A sequential skill chain is the assembly line of agent orchestration. Just as a car chassis moves from station to station -- welding, painting, wiring, inspection -- each station transforming it and passing it along, a sequential chain moves data through a series of skills where each one transforms the result and hands it to the next.

Concretely, skill A runs and produces output X. Output X becomes the input to skill B, which produces output Y. Output Y feeds into skill C, which produces the final result. No step runs until the previous step completes. There is no branching, no parallelism, no conditional logic -- just a straight pipeline from input to output.

This simplicity is the pattern's greatest strength. Sequential chains are easy to build, easy to debug, and easy to reason about. When a chain fails, you know exactly which step failed and what its input was. For many real-world agent tasks -- search then summarize, fetch then parse, translate then format -- sequential execution is not just adequate but optimal.

## How It Works

### Basic Chain Implementation

The simplest implementation is just function composition with error handling:

```python
from typing import Any, Callable

class SkillChain:
    def __init__(self):
        self.steps: list[tuple[str, Callable]] = []

    def add_step(self, name: str, fn: Callable) -> "SkillChain":
        self.steps.append((name, fn))
        return self

    def run(self, initial_input: Any) -> dict:
        """Execute all steps in sequence, passing output forward."""
        current = initial_input
        results = {"input": initial_input}

        for name, fn in self.steps:
            try:
                current = fn(current)
                results[name] = current
            except Exception as e:
                results[name] = {"error": str(e)}
                results["failed_at"] = name
                return results

        results["final_output"] = current
        return results
```

### Search-Then-Summarize Example

The classic two-step chain: search the web for information, then use an LLM to summarize the results.

```python
from openai import OpenAI
import requests

client = OpenAI()

def web_search(query: str) -> list[dict]:
    """Search the web and return top results."""
    response = requests.get(
        "https://api.search-provider.com/search",
        params={"q": query, "count": 5},
        headers={"Authorization": f"Bearer {API_KEY}"},
    )
    response.raise_for_status()
    return response.json()["results"]

def summarize(search_results: list[dict]) -> str:
    """Summarize search results into a concise answer."""
    context = "\n\n".join(
        f"**{r['title']}**\n{r['snippet']}" for r in search_results
    )
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Summarize these search results into "
             "a clear, concise answer. Cite sources."},
            {"role": "user", "content": context},
        ],
    )
    return response.choices[0].message.content

# Build and run the chain
chain = SkillChain()
chain.add_step("search", web_search)
chain.add_step("summarize", summarize)

result = chain.run("What are the latest advances in solid-state batteries?")
print(result["final_output"])
```

### Data Flow Between Skills

The critical design decision in sequential chains is the data contract between steps. Each step must produce output in a format the next step expects. There are two approaches:

**Implicit contracts**: Each function knows the output format of the previous function. Simple but brittle -- changing one step's output format breaks the chain.

**Explicit contracts with adapters**: Insert transformation functions between steps to decouple them.

```python
def search_to_text(search_results: list[dict]) -> str:
    """Adapter: convert search results to plain text for summarizer."""
    return "\n\n".join(
        f"Source: {r['url']}\nTitle: {r['title']}\n{r['snippet']}"
        for r in search_results
    )

chain = SkillChain()
chain.add_step("search", web_search)
chain.add_step("format", search_to_text)
chain.add_step("summarize", summarize_text)  # takes str, not list[dict]
```

### Intermediate Result Management

For debugging and recovery, the chain should store all intermediate results, not just the final output:

```python
class TracedSkillChain(SkillChain):
    def run(self, initial_input: Any) -> dict:
        current = initial_input
        trace = {
            "input": initial_input,
            "steps": [],
            "status": "running",
        }

        for name, fn in self.steps:
            import time
            start = time.time()
            try:
                current = fn(current)
                trace["steps"].append({
                    "name": name,
                    "status": "success",
                    "output_preview": str(current)[:500],
                    "duration_ms": int((time.time() - start) * 1000),
                })
            except Exception as e:
                trace["steps"].append({
                    "name": name,
                    "status": "error",
                    "error": str(e),
                    "duration_ms": int((time.time() - start) * 1000),
                })
                trace["status"] = "failed"
                trace["failed_at"] = name
                return trace

        trace["status"] = "complete"
        trace["final_output"] = current
        return trace
```

### LangChain Expression Language (LCEL) Chains

LangChain provides a concise syntax for sequential chains using the pipe operator:

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.tools import TavilySearchResults

search = TavilySearchResults(max_results=5)
llm = ChatOpenAI(model="gpt-4o")

summarize_prompt = ChatPromptTemplate.from_template(
    "Summarize these search results concisely:\n\n{results}"
)

# LCEL chain with pipe syntax
chain = (
    {"results": lambda x: search.invoke(x["query"])}
    | summarize_prompt
    | llm
    | StrOutputParser()
)

answer = chain.invoke({"query": "solid-state battery advances 2024"})
```

### When Sequential Is the Right Choice

Sequential chains are the best pattern when:
- Every step depends on the previous step's output
- The task has a natural linear flow (fetch, transform, output)
- Simplicity and debuggability are priorities
- The total number of steps is small (2-5)
- There are no independent sub-tasks that could benefit from parallelism

## Why It Matters

### Predictability

Sequential chains have deterministic execution order. Given the same input, they execute the same steps in the same order. This makes testing straightforward -- you can mock each step and verify the chain end-to-end with unit tests.

### Composability

Sequential chains are themselves composable. A chain that does search-then-summarize can be used as a single "step" in a larger chain. This enables building complex workflows from simple, tested components.

## Key Technical Details

- Sequential chains add approximately 50-200ms of overhead between steps for data passing and logging
- Total chain latency is the sum of all step latencies -- there is no parallelism to amortize slow steps
- Storing intermediate results typically costs 1-10KB of memory per step; negligible for most applications
- Chains longer than 5-7 steps become difficult to debug and should be broken into sub-chains
- Error propagation should include the step name and input to enable rapid diagnosis
- Retry logic (if any) should be per-step, not per-chain, to avoid repeating successful early steps

## Common Misconceptions

**"Sequential chains are too simple for real applications"**: Many production agent systems are built primarily on sequential chains. The LangChain documentation reports that the majority of deployed chains use sequential patterns. Complexity should be added only when the task structure demands it -- parallel execution for independent sub-tasks, branching for conditional logic. Starting with a sequential chain and adding complexity as needed is a sound engineering practice.

**"Each step should be a separate LLM call"**: Not all steps need LLM reasoning. Many steps are deterministic transformations -- parsing JSON, formatting text, filtering results. Using the LLM for these wastes tokens and adds latency. Reserve LLM calls for steps that require language understanding or generation.

## Connections to Other Concepts

- `parallel-skill-execution.md` -- The alternative when steps are independent and can overlap
- `conditional-branching.md` -- Adding decision logic between sequential steps
- `plan-then-execute-pattern.md` -- Sequential chains are the simplest executor for linear plans
- `breaking-complex-tasks-into-steps.md` -- Decomposition that produces a linear sequence results in a sequential chain

## Further Reading

- LangChain Documentation, "LangChain Expression Language (LCEL)" (2024) -- Official guide to building chains with the pipe syntax
- Fowler, "Pipes and Filters" in Patterns of Enterprise Application Architecture (2002) -- The original software pattern that sequential chains implement
- Unix Philosophy, "Write programs that do one thing and do it well" -- The composability principle that makes sequential chains powerful
