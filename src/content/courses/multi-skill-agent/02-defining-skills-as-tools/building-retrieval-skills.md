# Building Retrieval Skills

**One-Line Summary**: Retrieval skills search and fetch information from external sources -- web search, databases, file systems, and vector stores -- giving the agent access to knowledge beyond its training data.

**Prerequisites**: `designing-effective-tool-schemas.md`, `output-contracts.md`

## What Are Retrieval Skills?

Think of retrieval skills as the agent's research department. When you need a fact, you might search the web, query a database, look through files on disk, or search your notes by topic. Each of these is a different retrieval channel with different strengths. Web search is broad but noisy. Database queries are precise but require knowing the schema. File search is local and fast. Vector search handles fuzzy semantic queries that keyword matching misses. A well-equipped agent has retrieval skills covering multiple channels so it can find the right information regardless of where it lives.

Retrieval skills are read-only operations that fetch information without modifying any external state. This distinction from action skills is architecturally important: retrieval skills are safe to retry, safe to run in parallel, and safe to run speculatively. If a search returns bad results, you search again with different terms. No data was changed, no message was sent, no file was overwritten. This safety property makes retrieval skills the easiest category to build and the hardest to break.

Technically, a retrieval skill takes a query or lookup key as input, searches an information source, and returns ranked results with enough context for the LLM to judge relevance. The skill handles the messy details of API authentication, result parsing, pagination, and error handling. The LLM sees clean, structured results it can reason about immediately.

## How It Works

### Web Search Skill

Web search gives the agent access to current information that postdates its training cutoff. Here is a production-quality implementation:

```python
import httpx
from pydantic import BaseModel, Field

class WebSearchInput(BaseModel):
    query: str = Field(..., min_length=1, max_length=300)
    num_results: int = Field(default=5, ge=1, le=10)

class WebSearchResult(BaseModel):
    title: str
    url: str
    snippet: str

def web_search_skill(params: WebSearchInput) -> dict:
    """Search the web using Brave Search API."""
    try:
        response = httpx.get(
            "https://api.search.brave.com/res/v1/web/search",
            headers={"X-Subscription-Token": BRAVE_API_KEY},
            params={"q": params.query, "count": params.num_results},
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()

        results = []
        for item in data.get("web", {}).get("results", []):
            results.append(WebSearchResult(
                title=item["title"],
                url=item["url"],
                snippet=item.get("description", "No description available."),
            ))

        return {
            "status": "success",
            "data": [r.model_dump() for r in results],
            "message": f"Found {len(results)} results for '{params.query}'.",
            "metadata": {
                "total_estimated": data.get("web", {}).get("totalResults", 0),
            },
        }
    except httpx.TimeoutException:
        return {
            "status": "error",
            "message": "Search timed out. Try a simpler or more specific query.",
            "error_code": "TIMEOUT",
        }
    except httpx.HTTPStatusError as e:
        return {
            "status": "error",
            "message": f"Search API returned HTTP {e.response.status_code}. Try again later.",
            "error_code": "API_ERROR",
        }
```

The corresponding tool schema the LLM sees:

```json
{
    "name": "web_search",
    "description": "Search the web for current information. Returns titles, URLs, and text snippets. Use for recent events, current data, or topics beyond training data. Use specific keywords for best results.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Search keywords. Be specific."},
            "num_results": {"type": "integer", "default": 5, "minimum": 1, "maximum": 10}
        },
        "required": ["query"]
    }
}
```

### Database Query Skill

Database skills let the agent access structured data with precision. The key constraint is restricting queries to read-only operations:

```python
import sqlite3
from pydantic import BaseModel, Field, field_validator

class DatabaseQueryInput(BaseModel):
    sql: str = Field(..., description="SQL SELECT query to execute.")

    @field_validator("sql")
    @classmethod
    def must_be_read_only(cls, v):
        normalized = v.strip().upper()
        if not normalized.startswith("SELECT"):
            raise ValueError(
                "Only SELECT queries allowed. "
                "No INSERT, UPDATE, DELETE, or DROP."
            )
        forbidden = ["DROP", "DELETE", "INSERT", "UPDATE", "ALTER", "TRUNCATE"]
        for keyword in forbidden:
            # Check if keyword appears outside of string literals
            if keyword in normalized and not normalized.startswith("SELECT"):
                raise ValueError(f"Forbidden keyword: {keyword}")
        return v

def database_query_skill(params: DatabaseQueryInput) -> dict:
    """Execute a read-only SQL query against the application database."""
    conn = None
    try:
        conn = sqlite3.connect("app.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.execute(params.sql)
        rows = cursor.fetchmany(100)  # Cap at 100 rows

        columns = [desc[0] for desc in cursor.description] if cursor.description else []
        data = [dict(row) for row in rows]

        return {
            "status": "success",
            "data": data,
            "message": f"Query returned {len(data)} rows. Columns: {', '.join(columns)}.",
            "metadata": {
                "columns": columns,
                "row_count": len(data),
                "truncated": len(data) >= 100,
            },
        }
    except sqlite3.Error as e:
        return {
            "status": "error",
            "message": f"SQL error: {str(e)}. Check table and column names.",
            "error_code": "QUERY_ERROR",
        }
    finally:
        if conn:
            conn.close()
```

### File System Search Skill

File search lets the agent find and inspect local files by name pattern and content:

```python
from pathlib import Path
from pydantic import BaseModel, Field

WORKSPACE = Path("/workspace")

class FileSearchInput(BaseModel):
    pattern: str = Field(
        ...,
        description="Glob pattern to match. Examples: '*.py', 'src/**/*.ts', 'README*'"
    )
    content_query: str | None = Field(
        default=None,
        description="Optional text to search for within matching files."
    )

def file_search_skill(params: FileSearchInput) -> dict:
    """Search for files by name pattern, optionally filtering by content."""
    try:
        matches = []
        for path in sorted(WORKSPACE.rglob(params.pattern)):
            if not path.is_file() or len(matches) >= 50:
                continue

            entry = {
                "path": str(path.relative_to(WORKSPACE)),
                "size_bytes": path.stat().st_size,
            }

            if params.content_query:
                try:
                    text = path.read_text(errors="ignore")
                    if params.content_query.lower() not in text.lower():
                        continue  # Skip files without the content match
                    # Extract matching lines for context
                    matching_lines = []
                    for i, line in enumerate(text.splitlines(), 1):
                        if params.content_query.lower() in line.lower():
                            matching_lines.append({
                                "line_number": i,
                                "text": line.strip()[:200],
                            })
                            if len(matching_lines) >= 3:
                                break
                    entry["matching_lines"] = matching_lines
                except (UnicodeDecodeError, PermissionError):
                    continue

            matches.append(entry)

        qualifier = f" containing '{params.content_query}'" if params.content_query else ""
        return {
            "status": "success",
            "data": matches,
            "message": f"Found {len(matches)} files matching '{params.pattern}'{qualifier}.",
            "metadata": {"truncated": len(matches) >= 50},
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"File search failed: {str(e)}",
            "error_code": "SEARCH_ERROR",
        }
```

### Vector Search (RAG) Skill

Vector search enables semantic retrieval, finding information by meaning rather than exact keyword matches. This is the foundation of Retrieval-Augmented Generation:

```python
from pydantic import BaseModel, Field

class VectorSearchInput(BaseModel):
    query: str = Field(..., description="Natural language question or topic.")
    collection: str = Field(default="default", description="Document collection to search.")
    top_k: int = Field(default=5, ge=1, le=20, description="Number of results.")

def vector_search_skill(params: VectorSearchInput) -> dict:
    """Search documents by semantic similarity using vector embeddings."""
    try:
        query_embedding = embedding_model.encode(params.query)

        import chromadb
        client = chromadb.PersistentClient(path="./vectorstore")
        collection = client.get_collection(params.collection)

        results = collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=params.top_k,
            include=["documents", "metadatas", "distances"],
        )

        formatted = []
        for i in range(len(results["ids"][0])):
            score = round(1 - results["distances"][0][i], 3)
            formatted.append({
                "id": results["ids"][0][i],
                "text": results["documents"][0][i][:500],
                "source": results["metadatas"][0][i].get("source", "unknown"),
                "relevance_score": score,
            })

        return {
            "status": "success",
            "data": formatted,
            "message": f"Found {len(formatted)} relevant documents for '{params.query}'.",
            "metadata": {
                "collection": params.collection,
                "best_score": formatted[0]["relevance_score"] if formatted else 0,
            },
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Vector search failed: {str(e)}",
            "error_code": "VECTOR_ERROR",
        }
```

### Result Ranking and Snippet Extraction

All retrieval skills benefit from re-ranking results by relevance and extracting the most useful snippets:

```python
def extract_relevant_snippet(text: str, query: str, context_chars: int = 200) -> str:
    """Extract the most relevant snippet from a longer document."""
    query_lower = query.lower()
    text_lower = text.lower()

    # Find exact query match first
    pos = text_lower.find(query_lower)
    if pos == -1:
        # Fall back to first matching word
        for word in query_lower.split():
            if len(word) > 3:  # Skip short words
                pos = text_lower.find(word)
                if pos != -1:
                    break

    if pos == -1:
        return text[:context_chars * 2]  # Fallback: beginning of text

    start = max(0, pos - context_chars)
    end = min(len(text), pos + len(query) + context_chars)
    snippet = text[start:end].strip()

    if start > 0:
        snippet = "..." + snippet
    if end < len(text):
        snippet = snippet + "..."
    return snippet


def rank_results(results: list[dict], query: str) -> list[dict]:
    """Re-rank search results by keyword overlap with the query."""
    query_words = set(query.lower().split())

    for result in results:
        text = (result.get("title", "") + " " + result.get("snippet", "")).lower()
        text_words = set(text.split())
        overlap = len(query_words & text_words)
        result["_score"] = overlap / max(len(query_words), 1)

    results.sort(key=lambda r: r["_score"], reverse=True)
    for r in results:
        r.pop("_score", None)
    return results
```

### Source Attribution

Always include source information so the LLM can cite where information came from:

```python
def format_with_attribution(results: list[dict]) -> str:
    """Format results with numbered source attribution."""
    lines = []
    for i, r in enumerate(results, 1):
        lines.append(f"[{i}] {r['title']}")
        lines.append(f"    Source: {r.get('url', r.get('source', 'unknown'))}")
        lines.append(f"    {r['snippet']}")
        lines.append("")
    return "\n".join(lines)
```

This pattern lets the LLM write responses like "According to [1], the population is..." with traceable references.

## Why It Matters

### Information Access Is What Makes Agents Useful

An agent without retrieval skills is limited to its training data. It cannot look up current prices, read your actual codebase, query your production database, or search your internal documentation. Retrieval skills are the bridge between the LLM's general intelligence and your specific, current data. They are what transform a chatbot into a genuinely useful assistant.

### Different Sources Serve Different Needs

No single retrieval channel covers all information needs. Web search handles breadth and recency. Database queries handle precision and structured data. File search handles local project context. Vector search handles fuzzy semantic matching across large document collections. A well-equipped agent has all four channels and the schema descriptions to know when each one is appropriate.

## Key Technical Details

- Web search APIs (Brave, Serper, Tavily) typically return results in 200-500ms at $0.001-0.005 per query
- Database queries should always include a LIMIT clause to prevent runaway result sets consuming the context window
- File system search must be bounded to a workspace directory to prevent the agent from reading sensitive system files
- Vector search relevance scores above 0.8 are typically strong matches; below 0.5 are often noise worth filtering out
- Truncate individual result snippets to 300-500 characters to keep total context window usage manageable
- Return 3-10 results per search call: too few risks missing relevant information, too many wastes context tokens
- Always include source URLs or file paths so the LLM can cite and the user can verify

## Common Misconceptions

**"Vector search (RAG) is always better than keyword search"**: Vector search excels at semantic similarity but can miss exact matches that keyword search catches trivially. A query for error code "ERR_0x4F2A" will perform far better with keyword search than with semantic search, because the meaning of that string is opaque to embedding models. The best retrieval systems combine both: vector search for meaning, keyword search for precision.

**"Retrieval skills don't need error handling because they are read-only"**: Read-only does not mean failure-free. Network timeouts, rate limits, missing database tables, corrupt files, and empty result sets are all common failure modes. Every retrieval skill needs robust error handling that returns clear messages the LLM can act on, just like any other skill.

## Connections to Other Concepts

- `building-action-skills.md` -- The counterpart to retrieval: skills that modify external state
- `output-contracts.md` -- How to structure retrieval results for reliable LLM consumption
- `designing-effective-tool-schemas.md` -- How to describe retrieval skills so the LLM selects the right one
- `input-validation-and-type-safety.md` -- Validating search queries and file paths before execution

## Further Reading

- Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (2020) -- The foundational RAG paper introducing retrieval-augmented generation
- ChromaDB Documentation, "Getting Started" (2024) -- Popular open-source vector database for building RAG systems
- Brave Search API Documentation (2024) -- Web search API commonly used with AI agents
- Robertson and Zaragoza, "The Probabilistic Relevance Framework: BM25 and Beyond" (2009) -- The math behind keyword-based document ranking
