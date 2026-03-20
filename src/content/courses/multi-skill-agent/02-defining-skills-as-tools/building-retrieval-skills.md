# Building Retrieval Skills

**One-Line Summary**: Retrieval skills search and fetch information from external sources — web search, databases, file systems, and vector stores — giving the agent access to knowledge beyond its training data.

**Prerequisites**: `designing-effective-tool-schemas.md`, `output-contracts.md`

## What Are Retrieval Skills?

Think of retrieval skills as the agent's research department. When you need a fact, you might Google it, check a database, look through your files, or search your notes. Each of these is a different retrieval channel with different strengths: web search is broad but noisy, databases are precise but require knowing the schema, file search is local but fast, and vector search handles fuzzy semantic queries. A well-equipped agent has retrieval skills covering multiple channels so it can find the right information regardless of where it lives.

Retrieval skills are read-only operations that fetch information without modifying any external state. This distinction from action skills (which create, update, or delete things) is architecturally important: retrieval skills are safe to retry, safe to run in parallel, and safe to run speculatively. If a search returns bad results, you just search again with different terms — no harm done.

Technically, a retrieval skill takes a query or lookup key as input, searches an information source, and returns ranked results with enough context for the LLM to determine relevance. The skill handles the messy details of API authentication, result parsing, pagination, and error handling. The LLM sees clean, structured results it can reason about.

## How It Works

### Web Search Skill

Web search gives the agent access to current information. Here is a production-quality implementation using a search API:

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
            "metadata": {"total_estimated": data.get("web", {}).get("totalResults", 0)},
        }
    except httpx.TimeoutException:
        return {
            "status": "error",
            "message": "Search timed out. Try a simpler or more specific query.",
        }
    except httpx.HTTPStatusError as e:
        return {
            "status": "error",
            "message": f"Search API returned {e.response.status_code}. Try again later.",
        }
```

The tool schema the LLM sees:

```json
{
    "name": "web_search",
    "description": "Search the web for current information. Returns titles, URLs, and snippets. Use for up-to-date facts, recent events, or topics not in your training data. Use specific keywords for best results.",
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

Database skills let the agent access structured data with precision:

```python
import sqlite3
from pydantic import BaseModel, Field, field_validator

class DatabaseQueryInput(BaseModel):
    sql: str = Field(..., description="SQL SELECT query.")

    @field_validator("sql")
    @classmethod
    def must_be_select(cls, v):
        normalized = v.strip().upper()
        if not normalized.startswith("SELECT"):
            raise ValueError("Only SELECT queries are allowed. No INSERT, UPDATE, DELETE, or DROP.")
        dangerous = ["DROP", "DELETE", "INSERT", "UPDATE", "ALTER", "TRUNCATE"]
        for keyword in dangerous:
            if keyword in normalized.split("SELECT", 1)[-1].split("FROM")[0:]:
                continue  # Ignore if in column name
            # Simple check — production systems use SQL parsers
        return v

def database_query_skill(params: DatabaseQueryInput) -> dict:
    """Execute a read-only SQL query against the application database."""
    try:
        conn = sqlite3.connect("app.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.execute(params.sql)
        rows = cursor.fetchmany(100)  # Cap at 100 rows

        columns = [desc[0] for desc in cursor.description] if cursor.description else []
        data = [dict(row) for row in rows]
        total = len(data)

        return {
            "status": "success",
            "data": data,
            "message": f"Query returned {total} rows with columns: {', '.join(columns)}.",
            "metadata": {
                "columns": columns,
                "row_count": total,
                "truncated": total >= 100,
            },
        }
    except sqlite3.Error as e:
        return {
            "status": "error",
            "message": f"SQL error: {str(e)}. Check table and column names.",
        }
    finally:
        conn.close()
```

### File System Search Skill

File search lets the agent find and read local files:

```python
import os
import fnmatch
from pathlib import Path
from pydantic import BaseModel, Field

WORKSPACE = Path("/workspace")

class FileSearchInput(BaseModel):
    pattern: str = Field(
        ..., description="Glob pattern to match. Examples: '*.py', 'src/**/*.ts', 'README*'"
    )
    content_query: str | None = Field(
        default=None,
        description="Optional text to search for within matching files."
    )

def file_search_skill(params: FileSearchInput) -> dict:
    """Search for files by name pattern and optionally by content."""
    try:
        matches = []
        for path in WORKSPACE.rglob(params.pattern):
            if path.is_file() and len(matches) < 50:
                entry = {
                    "path": str(path.relative_to(WORKSPACE)),
                    "size_bytes": path.stat().st_size,
                }

                # If content search requested, check file contents
                if params.content_query:
                    try:
                        text = path.read_text(errors="ignore")
                        if params.content_query.lower() in text.lower():
                            # Find matching lines for context
                            matching_lines = []
                            for i, line in enumerate(text.splitlines(), 1):
                                if params.content_query.lower() in line.lower():
                                    matching_lines.append({"line": i, "text": line.strip()[:200]})
                                    if len(matching_lines) >= 3:
                                        break
                            entry["matching_lines"] = matching_lines
                            matches.append(entry)
                    except (UnicodeDecodeError, PermissionError):
                        continue
                else:
                    matches.append(entry)

        return {
            "status": "success",
            "data": matches,
            "message": f"Found {len(matches)} files matching '{params.pattern}'"
                       + (f" containing '{params.content_query}'" if params.content_query else "")
                       + ".",
            "metadata": {"truncated": len(matches) >= 50},
        }
    except Exception as e:
        return {"status": "error", "message": f"File search failed: {str(e)}"}
```

### Vector Search (RAG) Skill

Vector search enables semantic retrieval — finding information by meaning rather than exact keywords:

```python
from pydantic import BaseModel, Field
import numpy as np

class VectorSearchInput(BaseModel):
    query: str = Field(..., description="Natural language question or topic to search for.")
    collection: str = Field(default="default", description="Document collection to search.")
    top_k: int = Field(default=5, ge=1, le=20, description="Number of results to return.")

def vector_search_skill(params: VectorSearchInput) -> dict:
    """Search documents by semantic similarity using vector embeddings."""
    try:
        # Generate embedding for the query
        query_embedding = embedding_model.encode(params.query)

        # Search the vector store (using chromadb as example)
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
            formatted.append({
                "id": results["ids"][0][i],
                "text": results["documents"][0][i][:500],  # Truncate long docs
                "source": results["metadatas"][0][i].get("source", "unknown"),
                "relevance_score": round(1 - results["distances"][0][i], 3),
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
        return {"status": "error", "message": f"Vector search failed: {str(e)}"}
```

### Result Ranking and Snippet Extraction

All retrieval skills benefit from good result ranking and snippet extraction:

```python
def extract_relevant_snippet(text: str, query: str, context_chars: int = 200) -> str:
    """Extract the most relevant snippet from a document."""
    query_lower = query.lower()
    text_lower = text.lower()

    # Find the best match position
    pos = text_lower.find(query_lower)
    if pos == -1:
        # If exact match not found, find the first query word
        for word in query_lower.split():
            pos = text_lower.find(word)
            if pos != -1:
                break

    if pos == -1:
        return text[:context_chars * 2]  # Fallback to beginning

    # Extract context around the match
    start = max(0, pos - context_chars)
    end = min(len(text), pos + len(query) + context_chars)

    snippet = text[start:end].strip()
    if start > 0:
        snippet = "..." + snippet
    if end < len(text):
        snippet = snippet + "..."

    return snippet


def rank_results(results: list[dict], query: str) -> list[dict]:
    """Re-rank search results by relevance to query."""
    query_words = set(query.lower().split())

    for result in results:
        text = (result.get("title", "") + " " + result.get("snippet", "")).lower()
        text_words = set(text.split())
        overlap = len(query_words & text_words)
        result["_relevance"] = overlap / max(len(query_words), 1)

    results.sort(key=lambda r: r["_relevance"], reverse=True)
    for r in results:
        r.pop("_relevance", None)
    return results
```

### Source Attribution

Always include source information so the LLM can cite its sources:

```python
def format_with_attribution(results: list[dict]) -> str:
    """Format results with clear source attribution."""
    lines = []
    for i, r in enumerate(results, 1):
        lines.append(f"[{i}] {r['title']}")
        lines.append(f"    Source: {r['url']}")
        lines.append(f"    {r['snippet']}")
        lines.append("")
    return "\n".join(lines)
```

## Why It Matters

### Information Access Is the Foundation of Useful Agents

An agent that cannot retrieve information is limited to its training data. Retrieval skills are what make agents genuinely useful for real-world tasks — they can look up current prices, read your actual codebase, query your production database, and search your internal documentation. Without retrieval, the agent is just a chatbot.

### Different Sources Serve Different Needs

Web search handles breadth and recency. Database queries handle precision and structured data. File search handles local context. Vector search handles fuzzy semantic matching. A well-equipped agent has all four channels and knows when to use each one based on the task.

## Key Technical Details

- Web search APIs (Brave, Serper, Tavily) typically return results in 200-500ms and cost $0.001-0.005 per query
- Database queries should always have a LIMIT clause to prevent runaway result sets
- File system search should be bounded to a workspace directory to prevent security issues
- Vector search relevance scores above 0.8 are typically strong matches; below 0.5 are often noise
- Truncate individual results to 300-500 characters to keep context window usage manageable
- Return 3-10 results per search — too few misses relevant information, too many wastes context tokens
- Always include source URLs or file paths for attribution and verification

## Common Misconceptions

**"Vector search (RAG) is always better than keyword search"**: Vector search excels at semantic similarity but can miss exact matches that keyword search catches easily. A query for error code "ERR_0x4F2A" will perform better with keyword search than semantic search. The best retrieval systems use both: vector search for meaning, keyword search for precision.

**"Retrieval skills don't need error handling because they're read-only"**: Read-only does not mean failure-free. Network timeouts, rate limits, missing tables, corrupt files, and empty result sets are all common. Every retrieval skill needs robust error handling that returns clear messages the LLM can act on.

## Connections to Other Concepts

- `building-action-skills.md` — The counterpart to retrieval: skills that modify state
- `output-contracts.md` — How to structure retrieval results for reliable LLM consumption
- `designing-effective-tool-schemas.md` — How to describe retrieval skills so the LLM knows when to use each one
- `input-validation-and-type-safety.md` — Validating search queries and file paths before execution

## Further Reading

- Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (2020) — The foundational RAG paper
- ChromaDB Documentation, "Getting Started" (2024) — Popular open-source vector database
- Brave Search API Documentation (2024) — Web search API commonly used with agents
- Robertson & Zaragoza, "The Probabilistic Relevance Framework: BM25 and Beyond" (2009) — The math behind keyword-based ranking
