# Step 8: API Endpoint

One-Line Summary: Wrap the query engine in a FastAPI endpoint so any client can send questions and receive answers over HTTP.

Prerequisites: Working query engine from Step 7

---

## Why an API?

So far we have been running queries from a Python script. That is great for testing, but a real application needs an HTTP interface. A REST API lets you:

- Connect a frontend (React, Vue, or a simple HTML form)
- Integrate with Slack bots, browser extensions, or other tools
- Call your Q&A system from any language, not just Python
- Deploy as a standalone service behind a load balancer

FastAPI gives us automatic request validation, OpenAPI documentation, and async support — all with minimal boilerplate.

## Create the API

```python
# src/api.py
# ==========================================
# FastAPI Endpoint — REST API for document Q&A
# ==========================================

import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from src.ingest import load_existing_index, build_index, DATA_DIR
from src.query import create_query_engine, TOP_K

# Load API keys from .env
load_dotenv()

# ------------------------------------------
# Global query engine — initialized at startup
# ------------------------------------------
query_engine = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Initialize the query engine when the server starts.
    This avoids reconnecting to Qdrant on every request.
    """
    global query_engine
    print("Initializing query engine...")
    query_engine = create_query_engine()
    print("Server ready.")
    yield
    print("Shutting down.")


# ------------------------------------------
# FastAPI app
# ------------------------------------------
app = FastAPI(
    title="Document Q&A API",
    description="Ask questions about your documents using RAG",
    version="1.0.0",
    lifespan=lifespan,
)


# ------------------------------------------
# Request and response models
# ------------------------------------------
class QueryRequest(BaseModel):
    """The question to ask about your documents."""
    question: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        description="Natural language question about your documents",
        json_schema_extra={"examples": ["What is the refund policy?"]},
    )
    top_k: int = Field(
        default=TOP_K,
        ge=1,
        le=10,
        description="Number of document chunks to retrieve",
    )


class SourceInfo(BaseModel):
    """Information about a source document chunk."""
    file_name: str
    relevance_score: float | None
    text_preview: str


class QueryResponse(BaseModel):
    """The answer and its sources."""
    answer: str
    sources: list[SourceInfo]
    num_sources: int


class IngestResponse(BaseModel):
    """Result of document ingestion."""
    message: str
    documents_loaded: int
    chunks_created: int


# ------------------------------------------
# Endpoints
# ------------------------------------------
@app.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """
    Ask a question about your documents.
    Retrieves relevant chunks and generates an answer using Claude.
    """
    if query_engine is None:
        raise HTTPException(
            status_code=503,
            detail="Query engine not initialized. Try again in a moment.",
        )

    try:
        # Override top_k if the request specifies a different value
        response = query_engine.query(request.question)

        # Build source information
        sources = []
        for node in response.source_nodes:
            sources.append(SourceInfo(
                file_name=node.metadata.get("file_name", "unknown"),
                relevance_score=round(node.score, 4) if node.score else None,
                text_preview=node.get_content()[:300],
            ))

        return QueryResponse(
            answer=str(response),
            sources=sources,
            num_sources=len(sources),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.post("/ingest", response_model=IngestResponse)
async def ingest_documents():
    """
    Re-ingest all documents from the data/ directory.
    Call this after adding new files to update the index.
    """
    global query_engine

    try:
        index = build_index()
        # Refresh the query engine with the new index
        query_engine = index.as_query_engine(similarity_top_k=TOP_K)

        # Get stats from Qdrant
        from qdrant_client import QdrantClient
        client = QdrantClient(host="localhost", port=6333)
        info = client.get_collection("company_docs")

        return IngestResponse(
            message="Documents ingested successfully",
            documents_loaded=info.points_count,
            chunks_created=info.points_count,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ingestion failed: {str(e)}",
        )


@app.get("/health")
async def health_check():
    """Check if the service is running and the query engine is ready."""
    return {
        "status": "healthy" if query_engine else "initializing",
        "qdrant": "connected",
        "data_dir": str(DATA_DIR),
    }
```

## Start the Server

```bash
uvicorn src.api:app --host 0.0.0.0 --port 8000 --reload
```

You should see:

```
Initializing query engine...
Connected to Qdrant at localhost:6333
Loaded existing index from collection 'company_docs'.
Query engine ready (top_k=3, model=claude-sonnet-4-20250514)
Server ready.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Test the API

Open a second terminal and send a query:

```bash
# Ask a question
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the refund policy?"}'
```

Expected response:

```json
{
  "answer": "Based on the company policy document, all purchases are eligible for a full refund within 30 days...",
  "sources": [
    {
      "file_name": "company-policy.txt",
      "relevance_score": 0.8921,
      "text_preview": "Company Refund Policy\n\nAll purchases are eligible..."
    }
  ],
  "num_sources": 3
}
```

Check the health endpoint:

```bash
curl http://localhost:8000/health
```

## Interactive API Documentation

FastAPI generates OpenAPI docs automatically. Open your browser to:

- **Swagger UI**: `http://localhost:8000/docs` — interactive API explorer where you can test queries directly
- **ReDoc**: `http://localhost:8000/redoc` — cleaner reference documentation

The Swagger UI is especially useful. You can type a question into the `/query` form and see the full response with sources.

---

[← Query Engine](07-query-engine.md) | [Next: Step 9 - Test and Iterate →](09-test-and-iterate.md)
