# Implementing the Skill Set

**One-Line Summary**: Step-by-step implementation of the five core skills for the research agent -- web search, page reading, summarization, fact checking, and report writing -- each with typed interfaces and error handling.

**Prerequisites**: `project-overview-and-requirements.md`, `the-skill-abstraction.md`, `designing-effective-tool-schemas.md`

## What Is the Skill Set?

Think of each skill as a specialist on a research team. The web searcher finds relevant sources. The reader extracts substance from web pages. The summarizer distills long articles into key points. The fact checker cross-references claims. The report writer assembles everything into a coherent document. Each specialist has a clear job description (input schema), delivers a specific product (output schema), and knows how to handle problems in their domain.

In technical terms, each skill is a Python async function with Pydantic input and output models, a focused implementation, and standardized error behavior. The skills are stateless: they receive all necessary data as input and return a complete result. This makes them testable in isolation, cacheable, and easy to swap for improved versions later.

The implementation follows a consistent pattern across all five skills: define the types, implement the core logic, add error handling, and write a tool-compatible wrapper that the agent graph can invoke.

## How It Works

### Skill 1: Web Search

The web search skill wraps a search API to find relevant pages:

```python
import httpx
from pydantic import BaseModel, Field

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

async def web_search(input: WebSearchInput) -> WebSearchOutput:
    """Search the web using Tavily API."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            "https://api.tavily.com/search",
            json={"api_key": TAVILY_API_KEY, "query": input.query,
                  "max_results": input.num_results, "search_depth": "basic"},
        )
        response.raise_for_status()
        data = response.json()
    results = [
        WebSearchResult(title=r.get("title", ""), url=r["url"],
                        snippet=r.get("content", "")[:300])
        for r in data.get("results", [])
    ]
    return WebSearchOutput(results=results, query_used=input.query)
```

### Skill 2: Read Page

The page reader fetches a URL and extracts main textual content:

```python
from readability import Document as ReadabilityDocument
from bs4 import BeautifulSoup

class ReadPageInput(BaseModel):
    url: str = Field(description="URL to fetch and extract text from")
    max_chars: int = Field(default=10000)

class ReadPageOutput(BaseModel):
    url: str
    title: str
    content: str
    char_count: int
    success: bool
    error: str | None = None

async def read_page(input: ReadPageInput) -> ReadPageOutput:
    """Fetch a URL and extract main text content."""
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True,
                                      headers={"User-Agent": "ResearchAgent/1.0"}) as client:
            response = await client.get(input.url)
            response.raise_for_status()
        doc = ReadabilityDocument(response.text)
        soup = BeautifulSoup(doc.summary(), "html.parser")
        text = soup.get_text(separator="\n", strip=True)
        if len(text) > input.max_chars:
            text = text[:input.max_chars] + "\n[...truncated]"
        return ReadPageOutput(url=input.url, title=doc.title(), content=text,
                              char_count=len(text), success=True)
    except (httpx.TimeoutException, httpx.HTTPStatusError, Exception) as e:
        msg = f"HTTP {e.response.status_code}" if hasattr(e, "response") else str(e)[:200]
        return ReadPageOutput(url=input.url, title="", content="",
                              char_count=0, success=False, error=msg)
```

### Skill 3: Summarize

The summarizer uses an LLM call to extract key points and specific claims:

```python
from openai import AsyncOpenAI
llm_client = AsyncOpenAI()

class SummarizeInput(BaseModel):
    text: str = Field(description="Text to summarize")
    focus: str = Field(default="")
    max_sentences: int = Field(default=5)
    source_url: str | None = None

class SummarizeOutput(BaseModel):
    summary: str
    key_claims: list[str]
    source_url: str | None = None

async def summarize(input: SummarizeInput) -> SummarizeOutput:
    """Summarize text and extract factual claims using an LLM."""
    focus_line = f"Focus on: {input.focus}" if input.focus else ""
    prompt = (f"Summarize in {input.max_sentences} sentences. {focus_line}\n"
              f"List 3-5 specific factual claims. Respond as JSON: "
              f'{{"summary": "...", "key_claims": ["..."]}}\n\nTEXT:\n{input.text[:8000]}')
    response = await llm_client.chat.completions.create(
        model="gpt-4o-mini", temperature=0.2,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )
    import json
    result = json.loads(response.choices[0].message.content)
    return SummarizeOutput(summary=result["summary"],
                           key_claims=result.get("key_claims", []),
                           source_url=input.source_url)
```

### Skill 4: Fact Check

The fact checker searches for corroborating or contradicting evidence:

```python
class FactCheckInput(BaseModel):
    claim: str = Field(description="A specific factual claim to verify")
    original_source: str = Field(description="URL where the claim was found")

class FactCheckOutput(BaseModel):
    claim: str
    verdict: str  # "verified" | "disputed" | "unverifiable"
    supporting_sources: list[str]
    explanation: str

async def fact_check(input: FactCheckInput) -> FactCheckOutput:
    """Verify a claim by cross-referencing with web search results."""
    search_result = await web_search(WebSearchInput(query=input.claim, num_results=5))
    context_parts = []
    for r in search_result.results[:3]:
        page = await read_page(ReadPageInput(url=r.url, max_chars=3000))
        if page.success:
            context_parts.append(f"Source: {r.url}\n{page.content[:1500]}")
    if not context_parts:
        return FactCheckOutput(claim=input.claim, verdict="unverifiable",
                               supporting_sources=[], explanation="No sources found.")
    prompt = (f"Fact check this claim: {input.claim}\nOriginal: {input.original_source}"
              f"\n\nEvidence:\n{'---'.join(context_parts)}\n\n"
              f'Respond as JSON: {{"verdict": "verified|disputed|unverifiable", '
              f'"supporting_sources": ["url"], "explanation": "..."}}')
    response = await llm_client.chat.completions.create(
        model="gpt-4o", temperature=0.1,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )
    import json
    result = json.loads(response.choices[0].message.content)
    return FactCheckOutput(claim=input.claim, verdict=result["verdict"],
                           supporting_sources=result.get("supporting_sources", []),
                           explanation=result["explanation"])
```

### Skill 5: Write Report

The report writer synthesizes all findings into a structured document:

```python
class WriteReportInput(BaseModel):
    topic: str
    summaries: list[SummarizeOutput]
    fact_checks: list[FactCheckOutput]
    sources: list[WebSearchResult]

class ReportSection(BaseModel):
    heading: str
    content: str

class WriteReportOutput(BaseModel):
    title: str
    executive_summary: str
    sections: list[ReportSection]
    fact_status: list[dict]
    references: list[str]

async def write_report(input: WriteReportInput) -> WriteReportOutput:
    """Synthesize research findings into a structured report."""
    summaries_text = "\n\n".join(
        f"[Source: {s.source_url}]\n{s.summary}" for s in input.summaries)
    facts_text = "\n".join(
        f"- {fc.claim}: {fc.verdict} -- {fc.explanation}" for fc in input.fact_checks)
    sources_text = "\n".join(
        f"[{i+1}] {s.title} -- {s.url}" for i, s in enumerate(input.sources))
    prompt = (f"Write a research report on: {input.topic}\nUse ONLY this info. "
              f"Cite with [1],[2],etc.\n\nSUMMARIES:\n{summaries_text}\n\n"
              f"FACT CHECKS:\n{facts_text}\n\nSOURCES:\n{sources_text}\n\n"
              f'Respond as JSON: {{"title":"...","executive_summary":"...",'
              f'"sections":[{{"heading":"...","content":"..."}}],'
              f'"fact_status":[{{"claim":"...","verdict":"..."}}]}}')
    response = await llm_client.chat.completions.create(
        model="gpt-4o", temperature=0.3, max_tokens=4000,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )
    import json
    result = json.loads(response.choices[0].message.content)
    refs = [f"[{i+1}] {s.title} -- {s.url}" for i, s in enumerate(input.sources)]
    return WriteReportOutput(
        title=result["title"], executive_summary=result["executive_summary"],
        sections=[ReportSection(**s) for s in result["sections"]],
        fact_status=result.get("fact_status", []), references=refs)
```

## Why It Matters

### Clean Interfaces Enable Independent Development

Each skill can be developed, tested, and improved independently. You can swap the search provider from Tavily to Brave without touching the summarizer. You can upgrade the summarization model without affecting the fact checker. This modularity is what makes the system maintainable as requirements evolve.

### Error Boundaries Prevent Cascade Failures

Each skill handles its own errors and returns structured failure information rather than throwing exceptions that crash the whole agent. The `ReadPageOutput` with `success=False` allows the orchestrator to skip failed pages and continue. This resilience pattern is critical for a system that depends on external services.

## Key Technical Details

- Web search returns results in 0.5-2 seconds; Tavily API costs approximately $0.005 per search
- Page reading succeeds for 75-85% of URLs; common failures are timeouts, 403s, and JS-rendered pages
- Summarization with GPT-4o-mini costs approximately $0.001 per article
- Fact checking is the most expensive skill: 1 search + 2-3 page reads + 1 GPT-4o call per claim ($0.02-0.05)
- Report writing uses the most output tokens (1000-3000) and benefits from the strongest model
- Total skill implementation is approximately 300 lines of Python excluding imports and prompts

## Common Misconceptions

**"You need a different LLM for each skill"**: Most skills share the same LLM client. The key optimization is using cheaper models (GPT-4o-mini) for simpler tasks like summarization and reserving expensive models (GPT-4o) for judgment-heavy tasks like fact checking and report writing. This is model routing at the skill level, not the client level.

**"Web scraping always works with the right library"**: Many modern websites render content with JavaScript, serve different content to bots, or block automated access. The read_page skill will fail on 15-25% of URLs regardless of your HTTP library. Design for unreliability by fetching more sources than the minimum required.

## Connections to Other Concepts

- `project-overview-and-requirements.md` -- The skill interfaces defined here implement the architecture from the overview
- `wiring-the-agent-graph.md` -- These skills become the node functions in the LangGraph agent
- `running-and-iterating.md` -- Testing reveals which skills need improvement
- `the-skill-abstraction.md` -- The design principles behind these skill interfaces
- `designing-effective-tool-schemas.md` -- Why Pydantic models matter for reliable tool invocation

## Further Reading

- Tavily, "Search API Documentation" (2024) -- Official docs for the search API used in web_search
- Mozilla, "Readability.js" (2015) -- The algorithm behind the readability library used in page extraction
- OpenAI, "Structured Outputs" (2024) -- Guide to JSON mode and structured output from LLMs
- Pydantic, "Model Validators and Serialization" (2024) -- Reference for the type system used in skill interfaces
