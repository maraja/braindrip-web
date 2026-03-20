# Implementing the Skill Set

**One-Line Summary**: Step-by-step implementation of the five core skills -- web search, page reading, summarization, fact checking, and report writing -- each with typed interfaces and error handling.

**Prerequisites**: `project-overview-and-requirements.md`, `the-skill-abstraction.md`, `designing-effective-tool-schemas.md`

## What Is the Skill Set?

Think of each skill as a specialist on a research team. The searcher finds sources, the reader extracts substance, the summarizer distills key points, the fact checker cross-references claims, and the writer assembles the report. Each has a clear input schema, output schema, and domain-specific error handling.

Each skill is a Python async function with Pydantic models, stateless by design -- receiving all data as input and returning a complete result. This makes them testable, cacheable, and swappable. The pattern is consistent: define types, implement logic, add error handling.

## How It Works

### Skills 1-2: Web Search and Read Page

```python
import httpx
from pydantic import BaseModel, Field
from readability import Document as ReadabilityDocument
from bs4 import BeautifulSoup
from openai import AsyncOpenAI
llm_client = AsyncOpenAI()

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
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post("https://api.tavily.com/search",
            json={"api_key": TAVILY_API_KEY, "query": input.query,
                  "max_results": input.num_results, "search_depth": "basic"})
        resp.raise_for_status()
    results = [WebSearchResult(title=r.get("title", ""), url=r["url"],
               snippet=r.get("content", "")[:300]) for r in resp.json().get("results", [])]
    return WebSearchOutput(results=results, query_used=input.query)
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
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True,
                headers={"User-Agent": "ResearchAgent/1.0"}) as client:
            response = await client.get(input.url)
            response.raise_for_status()
        doc = ReadabilityDocument(response.text)
        soup = BeautifulSoup(doc.summary(), "html.parser")
        text = soup.get_text(separator="\n", strip=True)[:input.max_chars]
        return ReadPageOutput(url=input.url, title=doc.title(),
            content=text, char_count=len(text), success=True)
    except Exception as e:
        return ReadPageOutput(url=input.url, title="", content="",
            char_count=0, success=False, error=str(e)[:200])
```

### Skills 3-4: Summarize and Fact Check

The summarizer uses GPT-4o-mini to extract key points. The fact checker searches for corroborating evidence and uses GPT-4o for judgment:

```python
class SummarizeInput(BaseModel):
    text: str
    focus: str = ""
    max_sentences: int = 5
    source_url: str | None = None

class SummarizeOutput(BaseModel):
    summary: str
    key_claims: list[str]
    source_url: str | None = None
async def summarize(input: SummarizeInput) -> SummarizeOutput:
    import json
    focus = f"Focus on: {input.focus}. " if input.focus else ""
    prompt = (f"{focus}Summarize in {input.max_sentences} sentences. "
              f"List 3-5 verifiable claims. JSON: "
              f'{{"summary":"...","key_claims":["..."]}}\n\n{input.text[:8000]}')
    resp = await llm_client.chat.completions.create(model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}, temperature=0.2)
    data = json.loads(resp.choices[0].message.content)
    return SummarizeOutput(summary=data["summary"],
        key_claims=data.get("key_claims", []), source_url=input.source_url)

class FactCheckInput(BaseModel):
    claim: str = Field(description="A specific factual claim to verify")
    original_source: str = Field(description="URL where the claim was found")

class FactCheckOutput(BaseModel):
    claim: str
    verdict: str  # "verified" | "disputed" | "unverifiable"
    supporting_sources: list[str]
    explanation: str
async def fact_check(input: FactCheckInput) -> FactCheckOutput:
    import json
    search_result = await web_search(WebSearchInput(query=input.claim, num_results=5))
    ctx = []
    for r in search_result.results[:3]:
        page = await read_page(ReadPageInput(url=r.url, max_chars=3000))
        if page.success:
            ctx.append(f"Source: {r.url}\n{page.content[:1500]}")
    if not ctx:
        return FactCheckOutput(claim=input.claim, verdict="unverifiable",
            supporting_sources=[], explanation="No sources found.")
    prompt = (f"Fact check: {input.claim}\nEvidence:\n{'---'.join(ctx)}\n\n"
              f'JSON: {{"verdict":"...","supporting_sources":[...],"explanation":"..."}}')
    resp = await llm_client.chat.completions.create(model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}, temperature=0.1)
    data = json.loads(resp.choices[0].message.content)
    return FactCheckOutput(claim=input.claim, verdict=data["verdict"],
        supporting_sources=data.get("supporting_sources", []),
        explanation=data["explanation"])
```

### Skill 5: Write Report

```python
class WriteReportInput(BaseModel):
    topic: str
    summaries: list[SummarizeOutput]
    fact_checks: list[FactCheckOutput]
    sources: list[WebSearchResult]

class WriteReportOutput(BaseModel):
    title: str
    executive_summary: str
    sections: list[dict]  # {"heading": str, "content": str}
    fact_status: list[dict]
    references: list[str]
async def write_report(input: WriteReportInput) -> WriteReportOutput:
    import json
    sums = "\n\n".join(f"[{s.source_url}] {s.summary}" for s in input.summaries)
    facts = "\n".join(f"- {fc.claim}: {fc.verdict}" for fc in input.fact_checks)
    refs = "\n".join(f"[{i+1}] {s.title} -- {s.url}" for i, s in enumerate(input.sources))
    prompt = (f"Research report on: {input.topic}\nCite [1],[2],etc.\n\n"
              f"SUMMARIES:\n{sums}\n\nFACTS:\n{facts}\n\nSOURCES:\n{refs}\n\n"
              f'JSON: {{"title":"...","executive_summary":"...","sections":[...],"fact_status":[...]}}')
    resp = await llm_client.chat.completions.create(model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}, temperature=0.3, max_tokens=4000)
    data = json.loads(resp.choices[0].message.content)
    return WriteReportOutput(title=data["title"],
        executive_summary=data["executive_summary"], sections=data["sections"],
        fact_status=data.get("fact_status", []),
        references=[f"[{i+1}] {s.title} -- {s.url}" for i, s in enumerate(input.sources)])
```

## Why It Matters

### Clean Interfaces Enable Independent Development

Swap Tavily for Brave without touching the summarizer. Upgrade the summarization model without affecting fact checking. Modularity makes the system maintainable as requirements evolve.

### Error Boundaries Prevent Cascade Failures

Each skill returns structured failure information rather than throwing exceptions. `ReadPageOutput` with `success=False` lets the orchestrator skip failed pages -- critical for external service dependencies.

## Key Technical Details

- Web search: 0.5-2s latency, ~$0.005 per Tavily API call
- Page reading: 75-85% success rate; failures from timeouts, 403s, JS-rendered pages
- Summarization: ~$0.001 per article with GPT-4o-mini
- Fact checking: most expensive at $0.02-0.05 per claim (1 search + 2-3 reads + 1 GPT-4o call)
- Report writing: 1000-3000 output tokens, benefits from strongest model

## Common Misconceptions

**"You need a different LLM for each skill"**: Most skills share one client. Use cheaper models for simple tasks, reserve expensive ones for judgment.

**"Web scraping always works with the right library"**: Expect 15-25% failure from JS rendering, bot blocking, and paywalls. Fetch more sources than the minimum.

## Connections to Other Concepts

- `project-overview-and-requirements.md` -- Architecture that these skills implement
- `wiring-the-agent-graph.md` -- Skills become node functions in the LangGraph agent
- `running-and-iterating.md` -- Testing reveals which skills need improvement
- `the-skill-abstraction.md` -- Design principles behind these interfaces

## Further Reading

- Tavily, "Search API Documentation" (2024) -- Official docs for the search API
- Mozilla, "Readability.js" (2015) -- Algorithm behind the readability library
- OpenAI, "Structured Outputs" (2024) -- Guide to JSON mode and structured output
