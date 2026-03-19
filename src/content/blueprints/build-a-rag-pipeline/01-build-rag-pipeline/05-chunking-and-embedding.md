# Step 5: Chunking and Embedding

One-Line Summary: Split documents into overlapping chunks with a simple Python function, then generate vector embeddings using OpenAI's API directly.

Prerequisites: Document loader from Step 4 working correctly

---

## Why Chunk?

LLMs have context windows, and embedding models work best on focused passages rather than entire documents. Chunking breaks a long document into smaller, semantically coherent pieces. When a user asks a question, we retrieve the most relevant chunks — not the whole document.

## Why These Embeddings?

OpenAI's `text-embedding-3-small` produces 1536-dimensional vectors. It strikes a good balance between quality and cost ($0.02 per million tokens). Each chunk becomes a vector that captures its semantic meaning, so "refund policy" and "return items for money" end up close together in vector space.

## Write the Chunking Function

We will write our own chunker in about 15 lines of Python. No framework needed — just split on sentences and respect the size limits.

Update `src/ingest.py`:

```python
# src/ingest.py
# ==========================================
# Document Ingestion — Load, chunk, and embed
# ==========================================

from pathlib import Path
from openai import OpenAI

from src.config import OPENAI_API_KEY, CHUNK_SIZE, CHUNK_OVERLAP, EMBEDDING_MODEL

DATA_DIR = Path(__file__).parent.parent / "data"
SUPPORTED_EXTENSIONS = {".txt", ".md"}

# OpenAI client — used only for embeddings
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
    """
    Split text into overlapping chunks.
    Tries to break at sentence boundaries (periods followed by spaces).
    """
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size

        # If we are not at the end, try to break at a sentence boundary
        if end < len(text):
            # Look for the last period followed by a space within the chunk
            break_point = text.rfind(". ", start, end)
            if break_point > start:
                end = break_point + 2  # include the period and space

        chunks.append(text[start:end].strip())
        start = end - overlap

    return [c for c in chunks if c]  # filter out empty chunks


def chunk_documents(documents):
    """Split all documents into chunks, preserving metadata."""
    all_chunks = []
    for doc in documents:
        chunks = chunk_text(doc["content"])
        for i, chunk in enumerate(chunks):
            all_chunks.append({
                "content": chunk,
                "metadata": {
                    **doc["metadata"],
                    "chunk_index": i,
                },
            })

    print(f"Split into {len(all_chunks)} chunk(s)")
    return all_chunks


def embed_chunks(chunks):
    """
    Generate embeddings for each chunk using OpenAI.
    Returns the chunks with an 'embedding' field added.
    """
    print("Generating embeddings...")

    # OpenAI supports batch embedding — send all texts at once
    texts = [c["content"] for c in chunks]
    response = openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=texts,
    )

    for i, item in enumerate(response.data):
        chunks[i]["embedding"] = item.embedding

    print(f"Embedded {len(chunks)} chunk(s) "
          f"(dimension: {len(chunks[0]['embedding'])})")
    return chunks


if __name__ == "__main__":
    docs = load_documents()
    chunks = chunk_documents(docs)

    # Show what the chunks look like
    for i, chunk in enumerate(chunks[:3]):
        print(f"\n--- Chunk {i + 1} ---")
        print(f"Source: {chunk['metadata']['file_name']}")
        print(f"Text ({len(chunk['content'])} chars): "
              f"{chunk['content'][:150]}...")

    # Generate embeddings
    chunks = embed_chunks(chunks)
    sample = chunks[0]
    print(f"\nSample embedding dimension: {len(sample['embedding'])}")
    print(f"First 5 values: {sample['embedding'][:5]}")
```

## Test Chunking and Embedding

```bash
python -m src.ingest
```

Expected output:

```
  Loaded: company-policy.txt (651 chars)
  Loaded: onboarding-guide.txt (623 chars)
Loaded 2 document(s)
Split into 4 chunk(s)

--- Chunk 1 ---
Source: company-policy.txt
Text (321 chars): Company Refund Policy

All purchases are eligible for a full refund within 30 days...

Generating embeddings...
Embedded 4 chunk(s) (dimension: 1536)

Sample embedding dimension: 1536
First 5 values: [0.0123, -0.0456, 0.0789, ...]
```

## Understanding the Output

Each chunk is a plain Python dict with three fields:

- **`content`** — the chunk text
- **`metadata`** — source file name and chunk index
- **`embedding`** — a list of 1536 floats representing semantic meaning

The chunker tries to break at sentence boundaries (periods followed by spaces) rather than cutting mid-sentence. The 50-character overlap means consecutive chunks share some context, reducing the chance that a relevant passage gets split and becomes unfindable.

Notice how simple this is compared to using a framework. The chunking function is 15 lines of Python. The embedding call is a single API request. No abstractions to learn, no configuration objects, no global settings. You can read every line and understand exactly what happens.

---

[← Document Loader](04-document-loader.md) | [Next: Step 6 - Store Vectors →](06-store-vectors.md)
