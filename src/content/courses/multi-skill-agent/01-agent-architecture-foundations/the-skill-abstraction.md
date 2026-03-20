# The Skill Abstraction

**One-Line Summary**: A skill is a self-contained, well-defined capability with clear inputs, outputs, and side effects that an agent can invoke as a building block for complex tasks.

**Prerequisites**: `anatomy-of-a-multi-skill-agent.md`

## What Is the Skill Abstraction?

Imagine a Swiss Army knife. Each blade, screwdriver, and bottle opener is a distinct tool — self-contained, purpose-built, and usable independently. You don't need to understand the screwdriver to use the blade. You can swap in a better blade without redesigning the whole knife. Each tool has a clear interface: you grip, you apply, you get a result. In agent architecture, a "skill" works exactly the same way. It is a discrete unit of capability that the agent can invoke without knowing the implementation details, only the interface.

Technically, a skill is a function-like abstraction that wraps a specific capability behind a well-defined contract: a name, a description, an input schema, an output format, and a declaration of side effects. The agent's LLM sees only the contract (the schema), while the runtime handles execution of the actual implementation. This separation is what makes skills composable — the agent can chain search, then parse, then write without any skill knowing about the others.

The skill abstraction matters because it is the boundary at which complexity is managed. Without it, you get a monolithic agent where every capability is tangled with every other one. With it, you get a modular system where skills can be developed, tested, and replaced independently. This is the same insight that drives microservices, Unix pipes, and functional programming — isolate concerns behind clean interfaces.

## How It Works

### Anatomy of a Skill

Every skill has five components:

```python
from dataclasses import dataclass
from typing import Any

@dataclass
class SkillDefinition:
    name: str              # Unique identifier (e.g., "web_search")
    description: str       # What this skill does, in plain English
    input_schema: dict     # JSON Schema defining expected inputs
    execute: callable      # The actual implementation
    side_effects: list     # What external state this modifies
```

Here is a concrete example — a web search skill:

```python
web_search_skill = SkillDefinition(
    name="web_search",
    description="Search the web for current information. Returns top results with titles, URLs, and snippets. Use this when you need up-to-date information not in your training data.",
    input_schema={
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query. Be specific and use keywords."
            },
            "num_results": {
                "type": "integer",
                "description": "Number of results to return (1-10).",
                "default": 5
            }
        },
        "required": ["query"]
    },
    execute=perform_web_search,
    side_effects=[]  # Read-only, no external state changes
)
```

And a file-write skill that modifies state:

```python
file_write_skill = SkillDefinition(
    name="write_file",
    description="Write content to a file on disk. Creates the file if it doesn't exist. Overwrites existing content.",
    input_schema={
        "type": "object",
        "properties": {
            "path": {
                "type": "string",
                "description": "Absolute path to the file to write."
            },
            "content": {
                "type": "string",
                "description": "The full content to write to the file."
            }
        },
        "required": ["path", "content"]
    },
    execute=perform_file_write,
    side_effects=["filesystem:write"]  # Declares external mutation
)
```

### Skills vs. Raw Tool Calls

A raw tool call is just a function the LLM can invoke. A skill wraps that function with structure:

| Aspect | Raw Tool Call | Skill |
|--------|--------------|-------|
| Interface | Minimal schema | Rich description, typed params, defaults |
| Error handling | Caller's problem | Built into the skill |
| Validation | None | Input validated before execution |
| Output | Arbitrary | Standardized format |
| Side effects | Implicit | Explicitly declared |
| Testability | Requires full agent | Unit-testable in isolation |

```python
# Raw tool call — minimal, fragile
def search(query):
    return requests.get(f"https://api.search.com?q={query}").json()

# Skill — robust, self-describing
class WebSearchSkill:
    name = "web_search"
    description = "Search the web for current information..."

    def validate_input(self, params: dict) -> dict:
        if not params.get("query") or not params["query"].strip():
            raise ValueError("Query cannot be empty")
        params.setdefault("num_results", 5)
        params["num_results"] = max(1, min(10, params["num_results"]))
        return params

    def execute(self, params: dict) -> dict:
        params = self.validate_input(params)
        try:
            results = requests.get(
                "https://api.search.com/search",
                params={"q": params["query"], "n": params["num_results"]},
                timeout=10,
            ).json()
            return {"status": "success", "results": results["items"]}
        except requests.Timeout:
            return {"status": "error", "message": "Search timed out after 10 seconds"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
```

### Comparisons to Familiar Patterns

**Functions**: Skills are like functions with enforced type signatures. Both take inputs and produce outputs. But skills also declare side effects and carry their own documentation for an LLM consumer, not just a human one.

**Microservices**: Like a microservice, each skill has a defined API contract and can be deployed or updated independently. The agent's runtime acts like an API gateway, routing requests to the right service.

**Unix utilities**: The Unix philosophy of "do one thing well" applies directly. `grep` searches, `sort` sorts, `wc` counts — and the shell pipes them together. Skills follow the same principle: `web_search` searches, `write_file` writes, and the agent orchestrates them into pipelines.

### Why Clean Boundaries Matter

Clean skill boundaries deliver three critical benefits:

**Composability**: Skills with well-defined inputs and outputs can be chained in any order. The agent can use `web_search` then `write_file`, or `read_file` then `web_search`, without either skill needing to know about the other.

**Testability**: Each skill can be unit-tested with mock inputs, without running the full agent:

```python
def test_web_search_skill():
    skill = WebSearchSkill()

    # Test input validation
    with pytest.raises(ValueError):
        skill.validate_input({"query": ""})

    # Test successful execution (with mocked HTTP)
    with mock.patch("requests.get") as mock_get:
        mock_get.return_value.json.return_value = {"items": [{"title": "Result 1"}]}
        result = skill.execute({"query": "python testing"})
        assert result["status"] == "success"
        assert len(result["results"]) == 1
```

**Replaceability**: You can swap one search provider for another without touching the agent or any other skill. The contract stays the same; only the implementation changes.

## Why It Matters

### Modularity Enables Iteration

When skills are cleanly abstracted, you can improve the agent incrementally. Upgrade your search from a basic API to a RAG pipeline, add caching to your file reader, swap your email provider — all without regression risk to the rest of the system. This is how production agents evolve.

### The LLM Needs a Clear Menu

The LLM selects skills based entirely on names and descriptions. If skills overlap in purpose, have vague descriptions, or accept ambiguous inputs, the LLM will make bad choices. Clean abstractions force you to write clear contracts, which directly improves agent reliability.

## Key Technical Details

- Skill descriptions should be 1-3 sentences: enough for the LLM to know when and how to use them
- Each skill should do exactly one thing — if you find yourself writing "and" in the description, split it
- Input schemas should use JSON Schema with `description` fields on every parameter
- Default values reduce the number of decisions the LLM must make per invocation
- Side effects should be declared explicitly so the runtime can enforce safety policies
- Skills should return structured results (dicts), not raw strings, for reliable downstream parsing

## Common Misconceptions

**"Skills are just API wrappers"**: While many skills do wrap APIs, the abstraction is richer than a simple wrapper. A skill includes input validation, error handling, output normalization, rate limiting, and retry logic. The API call itself is often the simplest part. A well-built skill insulates the agent from the messiness of external services.

**"The LLM understands the skill implementation"**: The LLM never sees your Python code. It sees only the name, description, and input schema you provide. If your schema says the parameter is called `q` but your description says "search query," the LLM will figure it out — but it is working from the description, not from reading your source code. The description is the interface.

## Connections to Other Concepts

- `anatomy-of-a-multi-skill-agent.md` — How skills fit into the three-layer agent architecture
- `agent-runtime-loop.md` — How the runtime dispatches skill calls during execution
- `designing-effective-tool-schemas.md` — How to write schemas that make skills LLM-friendly
- `input-validation-and-type-safety.md` — Deep dive into validating skill inputs
- `output-contracts.md` — Standardizing what skills return

## Further Reading

- Anthropic, "Tool Use Best Practices" (2024) — Guidelines for designing tools that LLMs use reliably
- Martin Fowler, "Microservices" (2014) — The architectural pattern that inspires skill boundaries
- Eric Raymond, "The Art of Unix Programming" (2003) — The philosophy of small, composable tools
- Pydantic Documentation, "Models and Validation" (2024) — The go-to library for Python skill input validation
