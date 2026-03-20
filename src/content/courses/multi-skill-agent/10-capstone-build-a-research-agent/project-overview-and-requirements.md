# Project Overview and Requirements

**One-Line Summary**: The capstone project is a fully functional research agent that takes a topic, searches the web, reads and summarizes articles, cross-references facts, and produces a structured report.

**Prerequisites**: All modules 01-09

## What Is the Research Agent?

Imagine hiring a research assistant for a day. You give them a topic — say, "the current state of solid-state battery technology" — and walk away. When you return, they hand you a well-organized report: an executive summary, key findings from multiple sources, facts that have been cross-verified, and a list of references. They didn't just copy-paste from one article. They searched broadly, read critically, checked claims against multiple sources, and synthesized everything into something you can act on. That is exactly what we are building.

The research agent is a multi-skill AI system that orchestrates five distinct capabilities: searching the web for relevant sources, reading and extracting content from web pages, summarizing lengthy articles into key points, fact-checking claims by cross-referencing multiple sources, and writing a structured final report. Each capability is implemented as a standalone skill with a clean interface, and a LangGraph state machine coordinates them into a coherent research workflow.

This capstone ties together every concept from the course: the agent architecture (Module 01), skill design (Module 02), framework integration (Module 03), orchestration patterns (Module 04), task decomposition (Module 05), state management (Module 06), error handling (Module 07), evaluation (Module 08), and production deployment patterns (Module 09). You will build something that actually works end-to-end.

## How It Works

### Feature Requirements

The research agent must satisfy these functional requirements:

```
INPUT:
  - A research topic (string, 5-200 characters)
  - Optional: depth parameter ("quick" = 3 sources, "standard" = 5, "deep" = 8)
  - Optional: focus areas (list of specific aspects to investigate)

OUTPUT:
  - Structured report containing:
    ├── Title
    ├── Executive Summary (2-3 paragraphs)
    ├── Key Findings (numbered list with source citations)
    ├── Detailed Sections (one per major theme discovered)
    ├── Fact Verification Status (which claims were verified, which were not)
    ├── Sources (numbered list of URLs with titles)
    └── Metadata (time taken, steps executed, sources consulted, cost)

NON-FUNCTIONAL REQUIREMENTS:
  - Complete within 90 seconds for "standard" depth
  - Cost under $0.50 per research task
  - Handle tool failures gracefully (retry once, then skip and note)
  - Produce output even if some sources are inaccessible
```

### Skill Inventory

The agent uses five skills, each with a well-defined interface:

```python
from pydantic import BaseModel, Field


# Skill 1: Web Search
class WebSearchInput(BaseModel):
    query: str = Field(description="Search query string")
    num_results: int = Field(default=5, ge=1, le=10)

class WebSearchResult(BaseModel):
    title: str
    url: str
    snippet: str

class WebSearchOutput(BaseModel):
    results: list[WebSearchResult]
    query_used: str


# Skill 2: Read Page
class ReadPageInput(BaseModel):
    url: str = Field(description="URL to fetch and extract text from")
    max_chars: int = Field(default=10000, description="Max characters to extract")

class ReadPageOutput(BaseModel):
    url: str
    title: str
    content: str
    char_count: int
    success: bool
    error: str | None = None


# Skill 3: Summarize
class SummarizeInput(BaseModel):
    text: str = Field(description="Text to summarize")
    focus: str = Field(default="", description="Aspect to focus the summary on")
    max_sentences: int = Field(default=5)

class SummarizeOutput(BaseModel):
    summary: str
    key_claims: list[str]
    source_url: str | None = None


# Skill 4: Fact Check
class FactCheckInput(BaseModel):
    claim: str = Field(description="A specific factual claim to verify")
    original_source: str = Field(description="URL where the claim was found")

class FactCheckOutput(BaseModel):
    claim: str
    verdict: str          # "verified" | "disputed" | "unverifiable"
    supporting_sources: list[str]
    explanation: str


# Skill 5: Write Report
class WriteReportInput(BaseModel):
    topic: str
    summaries: list[SummarizeOutput]
    fact_checks: list[FactCheckOutput]
    sources: list[WebSearchResult]

class WriteReportOutput(BaseModel):
    title: str
    executive_summary: str
    sections: list[dict]   # {"heading": str, "content": str}
    fact_status: list[dict] # {"claim": str, "verdict": str}
    references: list[str]
```

### Architecture Overview

The agent follows a graph-based architecture with conditional routing:

```
                    ┌──────────┐
                    │  START   │
                    │ (parse   │
                    │  topic)  │
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │  SEARCH  │◀──────────────┐
                    │ (web     │               │
                    │  search) │               │
                    └────┬─────┘               │
                         │                     │
                    ┌────▼─────┐               │
                    │  READ    │               │
                    │ (fetch & │               │
                    │  extract)│               │
                    └────┬─────┘               │
                         │                     │
                    ┌────▼─────┐        ┌──────┴───┐
                    │SUMMARIZE │        │  NEED    │
                    │ (extract │        │  MORE    │
                    │  claims) │        │ SOURCES? │
                    └────┬─────┘        └──────────┘
                         │                     ▲
                    ┌────▼─────┐               │
                    │  ENOUGH  │───── no ──────┘
                    │ SOURCES? │
                    └────┬─────┘
                         │ yes
                    ┌────▼─────┐
                    │  FACT    │
                    │  CHECK   │
                    │ (verify  │
                    │  claims) │
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │  WRITE   │
                    │  REPORT  │
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │   END    │
                    └──────────┘
```

### Complete Flow Description

1. **START**: Parse the user's topic and depth setting. Generate 2-3 search queries that cover different angles of the topic.

2. **SEARCH**: Execute web searches for each query. Collect URLs, titles, and snippets. Deduplicate by URL.

3. **READ**: Fetch the top N pages (based on depth setting). Extract main content, stripping navigation, ads, and boilerplate. Handle failures gracefully — if a page is inaccessible, log the error and continue.

4. **SUMMARIZE**: For each successfully read page, produce a focused summary and extract specific factual claims. Tag each claim with its source URL.

5. **ENOUGH SOURCES?**: Check whether the number of successfully summarized sources meets the depth requirement. If not, generate a refined search query based on what has been found so far and loop back to SEARCH. Cap at 2 additional search rounds to prevent infinite loops.

6. **FACT CHECK**: Take the top 3-5 most important claims and cross-reference them by searching for corroborating or contradicting evidence. Mark each claim as verified, disputed, or unverifiable.

7. **WRITE REPORT**: Synthesize all summaries and fact-check results into a structured report. Group findings into thematic sections. Include inline citations.

8. **END**: Return the completed report along with metadata (execution time, cost, sources consulted).

## Why It Matters

### Integration of All Course Concepts

This project is not an exercise in calling APIs. It requires you to make real architectural decisions: How do you handle a page that takes 15 seconds to load? How do you decide when you have "enough" sources? How do you route claims to the fact-checker efficiently? Every module in this course contributes to a design decision in this project.

### A Genuinely Useful Tool

Unlike toy examples, a well-built research agent has real utility. Journalists, analysts, students, and developers all spend hours on research tasks that follow exactly this pattern: search, read, verify, synthesize. Building this agent gives you a template for a category of useful applications.

## Key Technical Details

- The agent typically executes 8-15 steps for a "standard" depth research task
- Web search uses 3 queries on average, yielding 10-15 candidate URLs after deduplication
- Page reading succeeds for approximately 75-85% of URLs (the rest are paywalled, broken, or dynamically rendered)
- Fact checking adds 3-6 additional search queries, which is the most expensive phase by token count
- Total token usage for a standard task: 30,000-60,000 input tokens, 3,000-8,000 output tokens
- Estimated cost per task: $0.10-$0.30 with GPT-4o, $0.01-$0.03 with GPT-4o-mini for non-critical steps

## Common Misconceptions

**"The agent should read every search result"**: Reading all results wastes time and tokens on low-quality sources. The agent should rank results by relevance (using snippet quality and source authority) and read only the top N. Diminishing returns set in quickly after 5-6 sources for most topics.

**"Fact checking means the report is guaranteed to be accurate"**: Automated fact checking verifies internal consistency (do multiple sources agree?) but cannot catch systematic errors where all sources share the same incorrect information. The fact-check step increases confidence but does not provide certainty. Always note this limitation in the report output.

## Connections to Other Concepts

- `implementing-the-skill-set.md` — Detailed implementation of each skill referenced here
- `wiring-the-agent-graph.md` — How to assemble these skills into the LangGraph state machine
- `running-and-iterating.md` — Testing and improving the completed agent
- `anatomy-of-a-multi-skill-agent.md` — The three-layer architecture this project instantiates
- `breaking-complex-tasks-into-steps.md` — The research task is a textbook example of task decomposition
- `cost-tracking-and-optimization.md` — Applying cost budgets to keep research tasks under $0.50

## Further Reading

- Anthropic, "Building Effective Agents" (2024) — Design patterns for production agent systems
- Gao et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (2020) — Foundational approach to grounding LLM output in retrieved documents
- Nakano et al., "WebGPT: Browser-Assisted Question-Answering with Human Feedback" (2022) — Research on LLMs that search and read the web to answer questions
- Trivedi et al., "Interleaving Retrieval with Chain-of-Thought Reasoning" (2023) — Combining search with multi-step reasoning
