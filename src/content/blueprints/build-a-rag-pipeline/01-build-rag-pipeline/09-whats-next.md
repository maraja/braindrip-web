# Step 9: What's Next

One-Line Summary: Production considerations, extensions, and where to go from here with your RAG pipeline.

Prerequisites: All previous steps completed

---

## What You Built

You now have a complete RAG pipeline with a minimal stack:

| Component | Implementation |
|-----------|---------------|
| **Document loading** | Plain Python file reading |
| **Chunking** | Custom sentence-aware splitter (15 lines) |
| **Embeddings** | OpenAI text-embedding-3-small (direct API call) |
| **Vector storage + search** | Supabase with pgvector |
| **Generation** | Claude via Anthropic SDK |

Four Python packages. No frameworks. No Docker. No separate vector database. Everything you need for RAG in about 150 lines of code.

## Add an API Endpoint

When you are ready to connect a frontend or integrate with other tools, add FastAPI:

```bash
pip install fastapi uvicorn
```

```python
# src/api.py
# ==========================================
# Optional: REST API for document Q&A
# ==========================================

from fastapi import FastAPI
from pydantic import BaseModel
from src.query import ask

app = FastAPI(title="Document Q&A API")


class QueryRequest(BaseModel):
    question: str


@app.post("/query")
async def query_documents(request: QueryRequest):
    result = ask(request.question)
    return result
```

```bash
uvicorn src.api:app --host 0.0.0.0 --port 8000
```

That is all you need — FastAPI becomes a thin wrapper around your existing `ask()` function.

## Add PDF Support

Install `pypdf` and add a loader:

```bash
pip install pypdf
```

```python
# Add to src/ingest.py
from pypdf import PdfReader

def load_pdf(file_path):
    """Extract text from a PDF file."""
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text
```

Then update `load_documents()` to handle `.pdf` files alongside `.txt` and `.md`.

## Production Considerations

### Row Level Security

Supabase supports Row Level Security (RLS) for multi-tenant applications. You can scope document access per user:

```sql
-- Enable RLS on the documents table
alter table documents enable row level security;

-- Allow users to only see their own documents
create policy "Users can view their own documents"
  on documents for select
  using (metadata->>'user_id' = auth.uid()::text);
```

### Incremental Ingestion

Right now, ingestion clears all documents and re-inserts. For production, track which files have been indexed:

```python
import hashlib

def file_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
```

Store the hash in the metadata and skip files that have not changed.

### Supabase Edge Functions

For a fully serverless deployment, you can move the query logic into a Supabase Edge Function (Deno/TypeScript). This keeps everything — database, vectors, and API — inside the Supabase platform.

## Scaling Strategies

### Better Retrieval

- **Hybrid search** — combine vector similarity with full-text search. Supabase supports both pgvector and `tsvector` in the same table.
- **Re-ranking** — after retrieving top-k chunks, use a cross-encoder to re-rank for higher precision.
- **Metadata filtering** — add filters to narrow search by file type, date, or department.

```sql
-- Example: search only within a specific file
select * from match_documents(query_embedding, 5)
where metadata->>'file_name' = 'company-policy.txt';
```

### HNSW Index

For larger datasets (100K+ vectors), switch from IVFFlat to HNSW indexing:

```sql
-- Drop the old index
drop index documents_embedding_idx;

-- Create an HNSW index (better recall, uses more memory)
create index on documents
  using hnsw (embedding vector_cosine_ops);
```

## Where to Go From Here

1. **Add a frontend** — build a simple chat interface with React or plain HTML + fetch
2. **Add conversation memory** — store chat history so follow-up questions work
3. **Try agentic RAG** — let Claude decide whether to search, which chunks to use, or whether to ask a clarifying question
4. **Add more document types** — PDFs, web pages, Notion exports
5. **Evaluate systematically** — build a test set of 50+ question-answer pairs and track accuracy over time

You have the foundation. Every production RAG system is built on these same primitives — load, chunk, embed, store, retrieve, generate. The rest is iteration.

---

[← Test and Iterate](08-test-and-iterate.md)
