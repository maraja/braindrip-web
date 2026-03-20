# Skill Selection Reasoning

**One-Line Summary**: The LLM's ability to choose the right tool for each step depends on how well tool descriptions match user intent, and description quality is the single biggest lever for selection accuracy.

**Prerequisites**: `system-prompt-as-agent-dna.md`, understanding of how function calling works in LLM APIs

## What Is Skill Selection Reasoning?

Imagine a chef in a kitchen with 30 different knives. When a recipe says "dice the onion," the chef does not consciously evaluate all 30 knives — they reach for the chef's knife because experience has mapped "dicing" to that tool. If you handed the chef 30 unlabeled knives, they would have to test each one, waste time, and probably cut themselves.

Skill selection reasoning is the process by which an LLM maps a user's request to the most appropriate tool from its available set. When a user says "What's the weather in Tokyo?", the agent must recognize this as a weather lookup, identify which tool handles weather data, construct the correct parameters, and invoke it. This happens through the model's learned ability to match semantic intent to tool descriptions — there is no explicit rule engine unless you build one.

In practice, skill selection is the most frequent decision an agent makes. Every step in the agent loop begins with the model asking itself: "Given what the user wants and what I've done so far, which tool should I use next — or should I respond directly?" The quality of this decision determines whether the agent solves the task in 3 steps or 15, or whether it solves it at all.

## How It Works

### Intent-to-Tool Matching

The LLM performs a soft semantic match between the user's request and each tool's description. This is not keyword matching — the model understands paraphrases, implications, and context.

```python
# These tool definitions are passed to the LLM via the API
tools = [
    {
        "name": "search_web",
        "description": "Search the internet for current information. "
                       "Use when the user asks about recent events, facts "
                       "you don't know, or anything requiring up-to-date data.",
        "parameters": {
            "query": {"type": "string", "description": "The search query"}
        }
    },
    {
        "name": "search_knowledge_base",
        "description": "Search the company's internal knowledge base for "
                       "policies, procedures, and product documentation. "
                       "Use when the user asks about company-specific information.",
        "parameters": {
            "query": {"type": "string", "description": "The search query"}
        }
    }
]
```

When a user asks "What is our refund policy?", the model must choose between `search_web` and `search_knowledge_base`. The phrase "our refund policy" signals company-specific information, which matches `search_knowledge_base`. Without the "company-specific" qualifier in the description, the model might default to web search.

### The Critical Role of Tool Descriptions

Tool descriptions are the single biggest lever for selection accuracy. A vague description forces the model to guess; a precise description makes the choice obvious.

```python
# BAD: Vague descriptions cause confusion
bad_tools = [
    {"name": "tool_a", "description": "Processes data"},
    {"name": "tool_b", "description": "Handles data operations"},
]

# GOOD: Specific descriptions with use-case guidance
good_tools = [
    {
        "name": "aggregate_metrics",
        "description": "Compute aggregate statistics (sum, average, min, max) "
                       "over a numeric dataset. Use when the user asks for "
                       "totals, averages, or statistical summaries. "
                       "Do NOT use for filtering or sorting — use query_data instead."
    },
    {
        "name": "query_data",
        "description": "Filter, sort, and retrieve specific rows from a dataset. "
                       "Use when the user asks to find specific records, filter "
                       "by conditions, or sort results. "
                       "Do NOT use for computing aggregates — use aggregate_metrics."
    },
]
```

A well-written tool description has four components:
1. **What it does** — the core capability in one sentence
2. **When to use it** — positive trigger conditions
3. **When NOT to use it** — negative guidance pointing to alternatives
4. **Parameter hints** — what inputs it expects

### Disambiguation When Multiple Tools Could Work

Sometimes multiple tools could handle a request. The model must choose the best one, and you can help by encoding disambiguation rules.

```python
# User asks: "How many orders did we get last month?"
# Both tools COULD answer this:

tools = [
    {
        "name": "query_database",
        "description": "Run a SQL query against the orders database. "
                       "Use for precise numerical queries about orders, "
                       "revenue, and customers. Returns exact figures. "
                       "Preferred when the user needs specific numbers."
    },
    {
        "name": "ask_analytics_dashboard",
        "description": "Query the analytics dashboard for high-level metrics. "
                       "Use for trend analysis, comparisons, and visualizations. "
                       "Returns approximate figures with charts. "
                       "Preferred when the user needs trends or visual summaries."
    }
]
```

The phrase "How many" signals a precise count, so the model should prefer `query_database`. If the user asked "How have orders been trending?", the model should prefer `ask_analytics_dashboard`. The words "precise" and "specific numbers" vs. "trends" and "visual summaries" give the model the disambiguation signal it needs.

### Selection Accuracy vs. Tool Count

As the number of available tools grows, selection accuracy degrades. This is a well-documented phenomenon:

| Tool Count | Typical Selection Accuracy | Notes |
|------------|---------------------------|-------|
| 1-5        | 95-98%                    | Minimal confusion |
| 6-15       | 88-94%                    | Occasional misselection |
| 16-30      | 78-88%                    | Needs excellent descriptions |
| 31-50      | 65-80%                    | Consider tool grouping |
| 50+        | Below 70%                 | Requires routing layer |

When you have more than 15-20 tools, consider a two-stage approach: a router model first selects a *category*, then the agent selects from the tools within that category.

```python
# Two-stage routing for large tool sets
TOOL_CATEGORIES = {
    "data_analysis": ["query_database", "aggregate_metrics", "generate_chart"],
    "communication": ["send_email", "send_slack", "create_ticket"],
    "file_management": ["read_file", "write_file", "list_directory"],
}

# Stage 1: Route to category (3 choices, not 9)
# Stage 2: Select tool within category (3 choices, not 9)
```

## Why It Matters

### Wrong Tool Selection Cascades Into Wasted Steps

If the agent selects the wrong tool at step 2, the result is unusable at step 3. This triggers a retry or a completely different plan, costing additional API calls and tokens. A single misselection can double the total cost of a task. In a 5-step task, one wrong tool choice at step 2 typically adds 3-4 recovery steps.

### Tool Descriptions Are a Form of Programming

Most developers spend hours writing code but minutes writing tool descriptions. This is backwards for agents. The tool descriptions are the interface between human intent and machine action — they deserve the same rigor as function signatures and docstrings. Investing an hour improving tool descriptions can eliminate thousands of misselections per month.

## Key Technical Details

- GPT-4-class models achieve ~95% tool selection accuracy with 5 well-described tools and clear intent
- Selection accuracy drops roughly 1-2% per additional tool beyond 10
- Adding "Do NOT use for..." guidance to descriptions reduces misselection by 25-40%
- Tool name matters: `search_web` is clearer than `sw_query` — semantic names improve selection by ~5%
- Parameter descriptions also affect selection: the model uses them to gauge whether a tool fits the task
- Models tend to over-select the most general-purpose tool; adding specificity to narrow tools helps them compete
- Temperature 0 improves selection consistency by ~8% compared to temperature 0.7, at the cost of some creativity in parameter construction

## Common Misconceptions

**"The model reads the tool name and picks the obvious match"**: Tool selection is not simple keyword matching. The model considers the full description, the parameter schema, the conversation history, and the system prompt. A tool named `process` with an excellent description will be selected correctly more often than a tool named `search_web` with a vague one.

**"More tools is always better — just give the agent everything"**: Beyond 15-20 tools, selection accuracy drops sharply unless you implement routing. Each additional tool adds noise to the selection space. A focused agent with 8 well-described tools will outperform a Swiss-army-knife agent with 40 poorly described ones.

**"If the model picks the wrong tool, it's a model quality issue"**: In most cases, misselection is a *description quality* issue. Before blaming the model, try improving the tool descriptions with clearer use-case guidance and negative constraints. This fixes the majority of selection errors without changing models.

## Connections to Other Concepts

- `system-prompt-as-agent-dna.md` — Tool descriptions are part of the system prompt and are shaped by its overall design
- `chain-of-thought-for-multi-step-tasks.md` — Explicit reasoning before tool selection improves accuracy on ambiguous requests
- `when-to-stop.md` — The model must also decide when NO tool is needed and it should respond directly
- `context-window-pressure.md` — Tool descriptions consume context window space; more tools means less room for conversation
- `structured-state-management.md` — State from previous steps informs which tool to select next

## Further Reading

- Schick et al., "Toolformer: Language Models Can Teach Themselves to Use Tools" (2023) — Foundational paper on LLM tool use and selection
- Qin et al., "ToolLLM: Facilitating Large Language Models to Master 16000+ Real-world APIs" (2023) — Research on scaling tool selection to large tool sets
- Patil et al., "Gorilla: Large Language Model Connected with Massive APIs" (2023) — Benchmark and training approach for API selection accuracy
- OpenAI, "Function Calling Guide" (2024) — Practical guide on structuring tool definitions for optimal selection
