# Step 6: Store Vectors

One-Line Summary: Insert your embedded chunks into the Supabase documents table and verify they are stored correctly.

Prerequisites: Chunks with embeddings from Step 5, Supabase set up from Step 3

---

## What Happens in This Step

We have chunks of text, each with a 1536-dimensional embedding vector. Now we store them in Supabase so we can search by similarity later. This is a simple insert into the `documents` table we created in Step 3 — Supabase and pgvector handle the indexing automatically.

## Add the Storage Function

Add this function to `src/ingest.py`:

```python
# Add these imports at the top of src/ingest.py
import json
from supabase import create_client
from src.config import SUPABASE_URL, SUPABASE_KEY, TABLE_NAME
```

```python
# Add this function to src/ingest.py

def store_in_supabase(chunks):
    """
    Insert all chunks with their embeddings into Supabase.
    Clears existing data first to avoid duplicates on re-ingestion.
    """
    client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Clear existing documents (simple approach for development)
    client.table(TABLE_NAME).delete().neq("id", 0).execute()
    print("Cleared existing documents.")

    # Insert chunks in batches of 50
    batch_size = 50
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        rows = [
            {
                "content": chunk["content"],
                "metadata": json.dumps(chunk["metadata"]),
                "embedding": chunk["embedding"],
            }
            for chunk in batch
        ]
        client.table(TABLE_NAME).insert(rows).execute()
        print(f"  Inserted batch {i // batch_size + 1} "
              f"({len(batch)} chunks)")

    print(f"Stored {len(chunks)} chunks in Supabase.")
```

## Update the Main Function

Replace the `if __name__` block at the bottom of `src/ingest.py`:

```python
if __name__ == "__main__":
    # Full ingestion pipeline: load → chunk → embed → store
    docs = load_documents()
    chunks = chunk_documents(docs)
    chunks = embed_chunks(chunks)
    store_in_supabase(chunks)

    # Verify: count rows in Supabase
    from supabase import create_client
    from src.config import SUPABASE_URL, SUPABASE_KEY
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    result = client.table("documents").select("id", count="exact").execute()
    print(f"\nVerification: {result.count} vectors stored in Supabase")
```

## Run the Full Ingestion

```bash
python -m src.ingest
```

Expected output:

```
  Loaded: company-policy.txt (651 chars)
  Loaded: onboarding-guide.txt (623 chars)
Loaded 2 document(s)
Split into 4 chunk(s)
Generating embeddings...
Embedded 4 chunk(s) (dimension: 1536)
Cleared existing documents.
  Inserted batch 1 (4 chunks)
Stored 4 chunks in Supabase.

Verification: 4 vectors stored in Supabase
```

## Verify in the Supabase Dashboard

Open your Supabase project dashboard and go to **Table Editor → documents**. You should see your chunks with:

- **content** — the text of each chunk
- **metadata** — JSON with the source file name and chunk index
- **embedding** — a long array of 1536 floats (the dashboard shows a preview)

This is the same data you would see in a Qdrant dashboard or Pinecone console — but it lives in a standard Postgres table you can query with SQL.

## The Complete Ingest Script

Here is the full `src/ingest.py` for reference:

```python
# src/ingest.py
# ==========================================
# Full Ingestion Pipeline
# Load → Chunk → Embed → Store in Supabase
# ==========================================

import json
from pathlib import Path
from openai import OpenAI
from supabase import create_client

from src.config import (
    OPENAI_API_KEY, SUPABASE_URL, SUPABASE_KEY,
    CHUNK_SIZE, CHUNK_OVERLAP, EMBEDDING_MODEL, TABLE_NAME,
)

DATA_DIR = Path(__file__).parent.parent / "data"
SUPPORTED_EXTENSIONS = {".txt", ".md"}

openai_client = OpenAI(api_key=OPENAI_API_KEY)


def load_documents(directory: Path = DATA_DIR):
    """Load all text files from the given directory."""
    if not directory.exists():
        raise FileNotFoundError(f"Data directory not found: {directory}")

    documents = []
    for file_path in sorted(directory.iterdir()):
        if file_path.suffix not in SUPPORTED_EXTENSIONS:
            continue
        text = file_path.read_text(encoding="utf-8")
        documents.append({
            "content": text,
            "metadata": {"file_name": file_path.name},
        })
        print(f"  Loaded: {file_path.name} ({len(text)} chars)")

    print(f"Loaded {len(documents)} document(s)")
    return documents


def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    """Split text into overlapping chunks at sentence boundaries."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        if end < len(text):
            break_point = text.rfind(". ", start, end)
            if break_point > start:
                end = break_point + 2
        chunks.append(text[start:end].strip())
        start = end - overlap
    return [c for c in chunks if c]


def chunk_documents(documents):
    """Split all documents into chunks, preserving metadata."""
    all_chunks = []
    for doc in documents:
        chunks = chunk_text(doc["content"])
        for i, chunk in enumerate(chunks):
            all_chunks.append({
                "content": chunk,
                "metadata": {**doc["metadata"], "chunk_index": i},
            })
    print(f"Split into {len(all_chunks)} chunk(s)")
    return all_chunks


def embed_chunks(chunks):
    """Generate embeddings for each chunk using OpenAI."""
    print("Generating embeddings...")
    texts = [c["content"] for c in chunks]
    response = openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=texts,
    )
    for i, item in enumerate(response.data):
        chunks[i]["embedding"] = item.embedding
    print(f"Embedded {len(chunks)} chunk(s)")
    return chunks


def store_in_supabase(chunks):
    """Insert all chunks with embeddings into Supabase."""
    client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Clear existing documents
    client.table(TABLE_NAME).delete().neq("id", 0).execute()
    print("Cleared existing documents.")

    # Insert in batches
    batch_size = 50
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        rows = [
            {
                "content": c["content"],
                "metadata": json.dumps(c["metadata"]),
                "embedding": c["embedding"],
            }
            for c in batch
        ]
        client.table(TABLE_NAME).insert(rows).execute()
        print(f"  Inserted batch {i // batch_size + 1} ({len(batch)} chunks)")

    print(f"Stored {len(chunks)} chunks in Supabase.")


if __name__ == "__main__":
    docs = load_documents()
    chunks = chunk_documents(docs)
    chunks = embed_chunks(chunks)
    store_in_supabase(chunks)

    # Verify
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    result = client.table(TABLE_NAME).select("id", count="exact").execute()
    print(f"\nVerification: {result.count} vectors stored in Supabase")
```

Your documents are now embedded and stored. Next, we query them.

---

[← Chunking and Embedding](05-chunking-and-embedding.md) | [Next: Step 7 - Query Engine →](07-query-engine.md)
