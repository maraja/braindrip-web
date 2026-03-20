# Implementing the Skill Set

**One-Line Summary**: Step-by-step implementation of the five core skills for the research agent — web search, page reading, summarization, fact checking, and report writing — each with typed interfaces and error handling.

**Prerequisites**: `project-overview-and-requirements.md`, `the-skill-abstraction.md`, `designing-effective-tool-schemas.md`

## What Is the Skill Set?

Think of each skill as a specialist on a research team. The web searcher knows how to find relevant sources. The reader knows how to extract the substance from a web page, ignoring ads and navigation. The summarizer distills long articles into key points. The fact checker cross-references claims against other sources. The report writer assembles everything into a coherent document. Each specialist has a clear job description (input schema), delivers a specific product (output schema), and knows how to handle problems in their domain (error handling).

In technical terms, each skill is a Python function with Pydantic input and output models, a focused implementation, and standardized error behavior. The skills are stateless: they receive all necessary data as input and return a complete result. This statelessness makes them testable in isolation, cacheable, and easy to swap out for improved versions later.

The implementation strategy follows a consistent pattern across all five skills: define the types, implement the core logic, add error handling, and write a tool-compatible wrapper that the agent graph can invoke.

## How It Works

### Skill 1: Web Search

The web search skill wraps a search API to find relevant pages for a given query:

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
    """Search the web using Tavily API (or SerpAPI, Brave, etc.)."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            "https://api.tavily.com/search",
            json={
                "api_key": TAVILY_API_KEY,
                "query": input.query,
                "max_results": input.num_results,
                "include_answer": False,
                "search_depth": "basic",
            },
        )
        response.raise_for_status()
        data = response.json()

    results = [
        WebSearchResult(
            title=r.get("title", ""),
            url=r["url"],
            snippet=r.get("content", "")[:300],
        )
        for r in data.get("results", [])
    ]

    return WebSearchOutput(
        results=results,
        query_used=input.query,
    )
```

### Skill 2: Read Page

The page reader fetches a URL and extracts the main textual content, stripping HTML boilerplate:

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
        async with httpx.AsyncClient(
            timeout=15.0,
            follow_redirects=True,
            headers={"User-Agent": "ResearchAgent/1.0"},
        ) as client:
            response = await client.get(input.url)
            response.raise_for_status()

        # Extract main content using readability
        doc = ReadabilityDocument(response.text)
        title = doc.title()

        # Convert HTML to plain text
        soup = BeautifulSoup(doc.summary(), "html.parser")
        text = soup.get_text(separator="\n", strip=True)

        # Truncate to max_chars
        if len(text) > input.max_chars:
            text = text[:input.max_chars] + "\n[...truncated]"

        return ReadPageOutput(
            url=input.url,
            title=title,
            content=text,
            char_count=len(text),
            success=True,
        )

    except httpx.TimeoutException:
        return ReadPageOutput(
            url=input.url, title="", content="",
            char_count=0, success=False,
            error=f"Timeout fetching {input.url}",
        )
    except httpx.HTTPStatusError as e:
        return ReadPageOutput(
            url=input.url, title="", content="",
            char_count=0, success=False,
            error=f"HTTP {e.response.status_code} from {input.url}",
        )
    except Exception as e:
        return ReadPageOutput(
            url=input.url, title="", content="",
            char_count=0, success=False,
            error=f"Failed to read {input.url}: {str(e)[:200]}",
        )
```

### Skill 3: Summarize

The summarizer uses an LLM call to extract key points and specific claims from article text:

```python
from openai import AsyncOpenAI

llm_client = AsyncOpenAI()


class SummarizeInput(BaseModel):
    text: str = Field(description="Text to summarize")
    focus: str = Field(default="", description="Aspect to focus on")
    max_sentences: int = Field(default=5)
    source_url: str | None = None


class SummarizeOutput(BaseModel):
    summary: str
    key_claims: list[str]
    source_url: str | None = None


SUMMARIZE_PROMPT = """Summarize the following text in {max_sentences} sentences.
{focus_instruction}

After the summary, list 3-5 specific factual claims made in the text.
Each claim should be a concrete, verifiable statement (include numbers,
dates, or names where present).

Respond in this exact JSON format:
{{
  "summary": "Your summary here.",
  "key_claims": [
    "Specific claim 1",
    "Specific claim 2"
  ]
}}

TEXT:
{text}"""


async def summarize(input: SummarizeInput) -> SummarizeOutput:
    """Summarize text and extract factual claims using an LLM."""
    focus_instruction = (
        f"Focus specifically on: {input.focus}" if input.focus else ""
    )
    prompt = SUMMARIZE_PROMPT.format(
        max_sentences=input.max_sentences,
        focus_instruction=focus_instruction,
        text=input.text[:8000],  # Cap input to avoid token limits
    )

    response = await llm_client.chat.completions.create(
        model="gpt-4o-mini",  # Cheaper model sufficient for summarization
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.2,
    )

    import json
    result = json.loads(response.choices[0].message.content)

    return SummarizeOutput(
        summary=result["summary"],
        key_claims=result.get("key_claims", []),
        source_url=input.source_url,
    )
```

### Skill 4: Fact Check

The fact checker takes a specific claim and searches for corroborating or contradicting evidence:

```python
class FactCheckInput(BaseModel):
    claim: str = Field(description="A specific factual claim to verify")
    original_source: str = Field(description="URL where the claim was found")


class FactCheckOutput(BaseModel):
    claim: str
    verdict: str          # "verified" | "disputed" | "unverifiable"
    supporting_sources: list[str]
    explanation: str


FACT_CHECK_PROMPT = """You are a fact checker. You have been given a claim and
search results about that claim. Determine whether the claim is supported.

CLAIM: {claim}
ORIGINAL SOURCE: {original_source}

SEARCH RESULTS:
{search_context}

Respond in this exact JSON format:
{{
  "verdict": "verified" or "disputed" or "unverifiable",
  "supporting_sources": ["url1", "url2"],
  "explanation": "Brief explanation of why you reached this verdict."
}}

Rules:
- "verified": At least 2 independent sources support the claim.
- "disputed": At least 1 source contradicts the claim.
- "unverifiable": No clear supporting or contradicting evidence found."""


async def fact_check(input: FactCheckInput) -> FactCheckOutput:
    """Verify a claim by cross-referencing with web search results."""
    # Step 1: Search for the claim
    search_result = await web_search(WebSearchInput(
        query=input.claim,
        num_results=5,
    ))

    # Step 2: Read the top 2 results for context
    search_context_parts = []
    for result in search_result.results[:3]:
        page = await read_page(ReadPageInput(url=result.url, max_chars=3000))
        if page.success:
            search_context_parts.append(
                f"Source: {result.url}\nTitle: {result.title}\n"
                f"Content: {page.content[:1500]}\n"
            )

    search_context = "\n---\n".join(search_context_parts)
    if not search_context:
        return FactCheckOutput(
            claim=input.claim,
            verdict="unverifiable",
            supporting_sources=[],
            explanation="Could not retrieve any sources to verify this claim.",
        )

    # Step 3: LLM judgment
    prompt = FACT_CHECK_PROMPT.format(
        claim=input.claim,
        original_source=input.original_source,
        search_context=search_context,
    )

    response = await llm_client.chat.completions.create(
        model="gpt-4o",  # Use stronger model for judgment
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.1,
    )

    import json
    result = json.loads(response.choices[0].message.content)

    return FactCheckOutput(
        claim=input.claim,
        verdict=result["verdict"],
        supporting_sources=result.get("supporting_sources", []),
        explanation=result["explanation"],
    )
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


REPORT_PROMPT = """Write a structured research report on: {topic}

Use ONLY the information provided below. Cite sources using [1], [2], etc.

SUMMARIES FROM SOURCES:
{summaries_text}

FACT CHECK RESULTS:
{fact_checks_text}

SOURCES:
{sources_text}

Respond in this exact JSON format:
{{
  "title": "Report title",
  "executive_summary": "2-3 paragraph executive summary",
  "sections": [
    {{"heading": "Section heading", "content": "Section content with [1] citations"}}
  ],
  "fact_status": [
    {{"claim": "The claim", "verdict": "verified/disputed/unverifiable"}}
  ]
}}

Rules:
- Create 3-5 thematic sections grouping related findings.
- Every factual statement must cite at least one source.
- Note any disputed or unverifiable claims explicitly in the text.
- Write in a neutral, analytical tone."""


async def write_report(input: WriteReportInput) -> WriteReportOutput:
    """Synthesize research findings into a structured report."""
    # Format summaries
    summaries_text = "\n\n".join(
        f"[Source: {s.source_url}]\n{s.summary}\nClaims: {'; '.join(s.key_claims)}"
        for s in input.summaries
    )

    # Format fact checks
    fact_checks_text = "\n".join(
        f"- Claim: {fc.claim}\n  Verdict: {fc.verdict}\n  "
        f"Explanation: {fc.explanation}"
        for fc in input.fact_checks
    )

    # Format source list
    sources_text = "\n".join(
        f"[{i+1}] {s.title} — {s.url}"
        for i, s in enumerate(input.sources)
    )

    prompt = REPORT_PROMPT.format(
        topic=input.topic,
        summaries_text=summaries_text,
        fact_checks_text=fact_checks_text,
        sources_text=sources_text,
    )

    response = await llm_client.chat.completions.create(
        model="gpt-4o",  # Use strongest model for final synthesis
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.3,
        max_tokens=4000,
    )

    import json
    result = json.loads(response.choices[0].message.content)

    references = [f"[{i+1}] {s.title} — {s.url}" for i, s in enumerate(input.sources)]

    return WriteReportOutput(
        title=result["title"],
        executive_summary=result["executive_summary"],
        sections=[ReportSection(**s) for s in result["sections"]],
        fact_status=result.get("fact_status", []),
        references=references,
    )
```

## Why It Matters

### Clean Interfaces Enable Independent Development

Each skill can be developed, tested, and improved independently. You can swap the search provider from Tavily to Brave without touching the summarizer. You can upgrade the summarization model without affecting the fact checker. This modularity is not academic — it is what makes the system maintainable as requirements evolve.

### Error Boundaries Prevent Cascade Failures

Each skill handles its own errors and returns structured failure information rather than throwing exceptions that crash the whole agent. The `ReadPageOutput` with `success=False` allows the orchestrator to skip failed pages and continue with the ones that worked. This resilience pattern is critical for a system that depends on external services.

## Key Technical Details

- Web search typically returns results in 0.5-2 seconds; Tavily API costs ~$0.005 per search
- Page reading succeeds for 75-85% of URLs; common failures are timeouts, 403 errors, and JavaScript-rendered pages
- Summarization with GPT-4o-mini costs approximately $0.001 per article (1K input tokens, 200 output tokens)
- Fact checking is the most expensive skill: each claim requires 1 search + 2-3 page reads + 1 GPT-4o call (~$0.02-0.05 per claim)
- Report writing uses the most output tokens (1000-3000) and benefits from the strongest model
- Total skill implementation is approximately 300 lines of Python excluding imports and prompts

## Common Misconceptions

**"You need a different LLM for each skill"**: Most skills can share the same LLM client. The key optimization is using cheaper models (GPT-4o-mini) for simpler skills like summarization and reserving expensive models (GPT-4o) for judgment-heavy skills like fact checking and report writing. This model routing is configured at the skill level, not the client level.

**"Web scraping always works if you have the right library"**: Many modern websites render content with JavaScript, serve different content to bots, or block automated access entirely. The read_page skill will fail on 15-25% of URLs regardless of your HTTP library. The system design must treat page reading as an unreliable operation and compensate by fetching more sources than the minimum required.

## Connections to Other Concepts

- `project-overview-and-requirements.md` — The skill interfaces defined here implement the architecture from the overview
- `wiring-the-agent-graph.md` — These skills become the node functions in the LangGraph agent
- `running-and-iterating.md` — Testing reveals which skills need improvement
- `the-skill-abstraction.md` — The design principles behind these skill interfaces
- `designing-effective-tool-schemas.md` — Why Pydantic models matter for reliable tool invocation
- `error-recovery-and-retry-strategies.md` — The error handling patterns used in each skill

## Further Reading

- Tavily, "Search API Documentation" (2024) — Official docs for the search API used in web_search
- Mozilla, "Readability.js" (2015) — The algorithm behind the readability library used in page extraction
- OpenAI, "Structured Outputs" (2024) — Guide to JSON mode and structured output from LLMs
- Pydantic, "Model Validators and Serialization" (2024) — Reference for the type system used in skill interfaces
