# Step 5: Chunking and Embedding

One-Line Summary: Split documents into overlapping chunks using LlamaIndex's SentenceSplitter, then generate vector embeddings with OpenAI's text-embedding-3-small model.

Prerequisites: Document loader from Step 4 working correctly

---

## Why Chunk?

LLMs have context windows, and embedding models work best on focused passages rather than entire documents. Chunking breaks a long document into smaller, semantically coherent pieces. When a user asks a question, we retrieve the most relevant chunks — not the whole document.

The key parameters are:

- **Chunk size** — how many tokens per chunk (we start with 512)
- **Chunk overlap** — how many tokens overlap between consecutive chunks (we use 50). Overlap prevents information from being split across chunk boundaries.

## Why These Embeddings?

OpenAI's `text-embedding-3-small` produces 1536-dimensional vectors. It strikes a good balance between quality and cost ($0.02 per million tokens). Each chunk becomes a vector that captures its semantic meaning, so "refund policy" and "return items for money" end up close together in vector space.

## Add Chunking and Embedding to the Ingestion Script

Update `src/ingest.py` to add the chunking and embedding logic:

```python
# src/ingest.py
# ==========================================
# Document Ingestion — Load, chunk, and embed
# ==========================================

import os
from pathlib import Path
from dotenv import load_dotenv

from llama_index.core import SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.openai import OpenAIEmbedding

# Load API keys from .env
load_dotenv()

# Path to the documents directory
DATA_DIR = Path(__file__).parent.parent / "data"

# ------------------------------------------
# Chunking configuration
# ------------------------------------------
CHUNK_SIZE = 512       # tokens per chunk
CHUNK_OVERLAP = 50     # overlapping tokens between consecutive chunks


def load_documents(directory: Path = DATA_DIR):
    """
    Load all supported documents from the given directory.
    Returns a list of LlamaIndex Document objects.
    """
    if not directory.exists():
        raise FileNotFoundError(f"Data directory not found: {directory}")

    reader = SimpleDirectoryReader(input_dir=str(directory))
    documents = reader.load_data()
    print(f"Loaded {len(documents)} document(s) from {directory}")
    return documents


def chunk_documents(documents):
    """
    Split documents into smaller, overlapping chunks.
    Each chunk becomes a Node object with text + metadata.
    """
    # SentenceSplitter tries to break at sentence boundaries
    # rather than cutting mid-sentence
    splitter = SentenceSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )

    nodes = splitter.get_nodes_from_documents(documents)
    print(f"Split into {len(nodes)} chunk(s) "
          f"(chunk_size={CHUNK_SIZE}, overlap={CHUNK_OVERLAP})")
    return nodes


def get_embedding_model():
    """
    Initialize the OpenAI embedding model.
    Uses text-embedding-3-small (1536 dimensions).
    """
    return OpenAIEmbedding(
        model="text-embedding-3-small",
        api_key=os.getenv("OPENAI_API_KEY"),
    )


def embed_nodes(nodes, embed_model):
    """
    Generate embeddings for each chunk.
    Modifies nodes in-place, adding the embedding vector to each.
    """
    print("Generating embeddings...")
    for i, node in enumerate(nodes):
        # Generate embedding for this chunk's text
        node.embedding = embed_model.get_text_embedding(node.get_content())
        if (i + 1) % 10 == 0 or (i + 1) == len(nodes):
            print(f"  Embedded {i + 1}/{len(nodes)} chunks")
    print("Embedding complete.")
    return nodes


if __name__ == "__main__":
    # Full ingestion pipeline: load → chunk → embed
    docs = load_documents()
    nodes = chunk_documents(docs)

    # Show what the chunks look like
    for i, node in enumerate(nodes[:3]):
        print(f"\n--- Chunk {i + 1} ---")
        print(f"Source: {node.metadata.get('file_name', 'unknown')}")
        print(f"Text ({len(node.get_content())} chars): "
              f"{node.get_content()[:150]}...")

    # Generate embeddings
    embed_model = get_embedding_model()
    nodes = embed_nodes(nodes, embed_model)

    # Verify embeddings
    sample = nodes[0]
    print(f"\nSample embedding dimension: {len(sample.embedding)}")
    print(f"First 5 values: {sample.embedding[:5]}")
```

## Test Chunking and Embedding

```bash
python -m src.ingest
```

Expected output:

```
Loaded 2 document(s) from /path/to/rag-pipeline/data
Split into 4 chunk(s) (chunk_size=512, overlap=50)

--- Chunk 1 ---
Source: company-policy.txt
Text (321 chars): Company Refund Policy

All purchases are eligible for a full refund within 30 days...

Generating embeddings...
  Embedded 4/4 chunks
Embedding complete.

Sample embedding dimension: 1536
First 5 values: [0.0123, -0.0456, 0.0789, ...]
```

## Understanding the Output

Each node (chunk) now has three key attributes:

- **`node.get_content()`** — the chunk text
- **`node.metadata`** — inherited from the source document (file name, page number)
- **`node.embedding`** — a list of 1536 floats representing the semantic meaning

The SentenceSplitter is smart about boundaries. It tries to split at sentence endings rather than cutting words in half. The 50-token overlap means the end of one chunk and the beginning of the next share some context, reducing the chance that a relevant passage gets split across chunks and becomes unfindable.

In the next step, we store these embedded chunks in Qdrant.

---

[← Document Loader](04-document-loader.md) | [Next: Step 6 - Vector Store →](06-vector-store.md)
