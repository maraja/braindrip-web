# Step 10: What's Next

One-Line Summary: Production considerations, scaling strategies, and alternative stacks to explore as you take your RAG pipeline beyond local development.

Prerequisites: All previous steps completed

---

## What You Built

You now have a complete RAG pipeline that:

| Component | Implementation |
|-----------|---------------|
| **Document ingestion** | LlamaIndex SimpleDirectoryReader (PDF + text) |
| **Chunking** | SentenceSplitter with configurable size and overlap |
| **Embeddings** | OpenAI text-embedding-3-small (1536 dimensions) |
| **Vector storage** | Qdrant running locally in Docker |
| **Generation** | Claude via Anthropic SDK |
| **API** | FastAPI with Swagger docs |

This is a solid foundation. Here is how to take it further.

## Production Considerations

### Authentication and Rate Limiting

Your API is currently open to anyone who can reach it. Before deploying, add API key authentication:

```python
# Add to src/api.py
# ==========================================
# Simple API key authentication
# ==========================================

from fastapi import Depends, Security
from fastapi.security import APIKeyHeader

API_KEY_HEADER = APIKeyHeader(name="X-API-Key")


async def verify_api_key(api_key: str = Security(API_KEY_HEADER)):
    """Reject requests without a valid API key."""
    if api_key != os.getenv("RAG_API_KEY"):
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key


# Then protect your endpoints:
@app.post("/query", response_model=QueryResponse)
async def query_documents(
    request: QueryRequest,
    api_key: str = Depends(verify_api_key),
):
    # ... existing code
```

### Persistent Storage and Backups

Qdrant data lives in a Docker volume. For production:

- Mount a host directory instead of a Docker volume for easier backups
- Set up snapshot-based backups with Qdrant's built-in snapshot API
- Consider Qdrant Cloud for managed hosting with automatic backups

```bash
# Host directory mount for easier backup
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -v /path/to/qdrant-data:/qdrant/storage \
  qdrant/qdrant:v1.13.2
```

### Incremental Ingestion

Right now, `/ingest` reprocesses all documents. For a production system, track which files have been indexed and only process new or changed ones:

```python
# Concept: track file hashes to detect changes
# ==========================================

import hashlib

def file_hash(path):
    """SHA-256 hash of file contents."""
    return hashlib.sha256(path.read_bytes()).hexdigest()

def get_new_or_changed_files(data_dir, known_hashes):
    """Return only files that are new or modified."""
    new_files = []
    for f in data_dir.iterdir():
        h = file_hash(f)
        if f.name not in known_hashes or known_hashes[f.name] != h:
            new_files.append(f)
    return new_files
```

### Metadata Filtering

Qdrant supports filtering vectors by metadata during search. This is powerful for multi-tenant systems or scoped queries:

```python
# Filter by source file during retrieval
from qdrant_client.models import Filter, FieldCondition, MatchValue

# Only search within a specific document
filter_condition = Filter(
    must=[
        FieldCondition(
            key="file_name",
            match=MatchValue(value="company-policy.txt"),
        )
    ]
)
```

## Scaling Strategies

### More Document Types

LlamaIndex supports many more formats beyond PDF and text:

- **Docx, PPTX, XLSX** — via `llama-index-readers-file`
- **Web pages** — crawl and index URLs with `BeautifulSoupWebReader`
- **Notion, Confluence, Google Docs** — dedicated reader integrations
- **Databases** — index rows from SQL databases

### Better Retrieval

- **Hybrid search** — combine vector similarity with BM25 keyword search. Qdrant supports this natively with sparse vectors.
- **Re-ranking** — after retrieving top-k chunks, use a cross-encoder model to re-rank them for higher precision.
- **Multi-query** — generate multiple search queries from the user's question to improve recall.

### Observability

Track what your pipeline does in production:

- **LlamaIndex Callbacks** — log every retrieval and generation step
- **Arize Phoenix** — open-source LLM observability with tracing
- **Latency metrics** — instrument your FastAPI endpoints with Prometheus

## Alternative Stacks

| Component | Alternatives |
|-----------|-------------|
| **RAG framework** | LangChain, Haystack, raw API calls |
| **Vector DB** | Pinecone (managed), Weaviate, ChromaDB (in-memory), pgvector (Postgres) |
| **Embeddings** | Cohere embed-v4, Voyage AI, local models via Ollama |
| **LLM** | GPT-4o, Gemini, local models via Ollama + Llama 3 |
| **API framework** | Flask, Django, gRPC |

## Where to Go From Here

1. **Add a frontend** — build a simple chat interface with React or even plain HTML + fetch
2. **Deploy to the cloud** — containerize with Docker Compose, deploy to Railway, Fly.io, or AWS ECS
3. **Add conversation memory** — store chat history so follow-up questions work ("What about digital products?" after asking about refunds)
4. **Evaluate systematically** — build a test set of 50+ question-answer pairs and track retrieval precision and answer accuracy over time
5. **Try agentic RAG** — let the LLM decide whether to search, which collection to query, or whether to ask a clarifying question before retrieving

You have the foundation. Every production RAG system is built on these same primitives — load, chunk, embed, store, retrieve, generate. The rest is iteration.

---

[← Test and Iterate](09-test-and-iterate.md)
