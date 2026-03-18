# Step 6: Vector Store

One-Line Summary: Store your embedded chunks in Qdrant, creating a persistent vector index that supports fast similarity search.

Prerequisites: Qdrant running (Step 3), chunks with embeddings (Step 5)

---

## What Happens in This Step

We now have chunks of text, each with a 1536-dimensional embedding vector. We need to store them somewhere that supports fast nearest-neighbor search. That is what Qdrant does — it takes your vectors, indexes them, and when you query with a new vector, it returns the most similar stored vectors in milliseconds.

LlamaIndex provides a `QdrantVectorStore` integration that handles the storage details. We create a `VectorStoreIndex` on top of it, which is the central abstraction we will use for both storage and retrieval.

## Update the Ingestion Script

Replace the contents of `src/ingest.py` with the complete ingestion pipeline that stores vectors in Qdrant:

```python
# src/ingest.py
# ==========================================
# Full Ingestion Pipeline
# Load → Chunk → Embed → Store in Qdrant
# ==========================================

import os
from pathlib import Path
from dotenv import load_dotenv

from llama_index.core import (
    SimpleDirectoryReader,
    StorageContext,
    VectorStoreIndex,
)
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

# Load API keys from .env
load_dotenv()

# ------------------------------------------
# Configuration
# ------------------------------------------
DATA_DIR = Path(__file__).parent.parent / "data"
COLLECTION_NAME = "company_docs"
CHUNK_SIZE = 512
CHUNK_OVERLAP = 50

# Qdrant connection settings
QDRANT_HOST = "localhost"
QDRANT_PORT = 6333


def create_qdrant_client():
    """Connect to the local Qdrant instance."""
    client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
    print(f"Connected to Qdrant at {QDRANT_HOST}:{QDRANT_PORT}")
    return client


def build_index():
    """
    Complete ingestion pipeline:
    1. Load documents from the data/ directory
    2. Configure chunking and embedding settings
    3. Build a VectorStoreIndex backed by Qdrant
    """
    # ------------------------------------------
    # Step 1: Configure global settings
    # ------------------------------------------
    # LlamaIndex uses a global Settings object for defaults
    Settings.embed_model = OpenAIEmbedding(
        model="text-embedding-3-small",
        api_key=os.getenv("OPENAI_API_KEY"),
    )
    Settings.chunk_size = CHUNK_SIZE
    Settings.chunk_overlap = CHUNK_OVERLAP

    # ------------------------------------------
    # Step 2: Load documents
    # ------------------------------------------
    if not DATA_DIR.exists():
        raise FileNotFoundError(f"Data directory not found: {DATA_DIR}")

    reader = SimpleDirectoryReader(input_dir=str(DATA_DIR))
    documents = reader.load_data()
    print(f"Loaded {len(documents)} document(s) from {DATA_DIR}")

    # ------------------------------------------
    # Step 3: Set up Qdrant vector store
    # ------------------------------------------
    qdrant_client = create_qdrant_client()

    vector_store = QdrantVectorStore(
        client=qdrant_client,
        collection_name=COLLECTION_NAME,
    )

    # StorageContext tells LlamaIndex where to persist data
    storage_context = StorageContext.from_defaults(
        vector_store=vector_store,
    )

    # ------------------------------------------
    # Step 4: Build the index
    # This automatically chunks, embeds, and stores
    # ------------------------------------------
    print("Building index (chunking, embedding, storing)...")
    index = VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context,
        show_progress=True,
    )
    print(f"Index built. Collection '{COLLECTION_NAME}' ready in Qdrant.")

    return index


def load_existing_index():
    """
    Connect to an existing Qdrant collection.
    Use this when documents are already ingested and you
    just need to query.
    """
    Settings.embed_model = OpenAIEmbedding(
        model="text-embedding-3-small",
        api_key=os.getenv("OPENAI_API_KEY"),
    )

    qdrant_client = create_qdrant_client()

    vector_store = QdrantVectorStore(
        client=qdrant_client,
        collection_name=COLLECTION_NAME,
    )

    index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
    print(f"Loaded existing index from collection '{COLLECTION_NAME}'.")
    return index


if __name__ == "__main__":
    index = build_index()

    # Verify: check the collection in Qdrant
    client = create_qdrant_client()
    info = client.get_collection(COLLECTION_NAME)
    print(f"\nCollection stats:")
    print(f"  Vectors: {info.points_count}")
    print(f"  Dimensions: {info.config.params.vectors.size}")
    print(f"  Distance metric: {info.config.params.vectors.distance}")
```

## Run the Ingestion

```bash
python -m src.ingest
```

Expected output:

```
Connected to Qdrant at localhost:6333
Loaded 2 document(s) from /path/to/rag-pipeline/data
Building index (chunking, embedding, storing)...
Index built. Collection 'company_docs' ready in Qdrant.

Collection stats:
  Vectors: 4
  Dimensions: 1536
  Distance metric: Distance.COSINE
```

## Verify in the Qdrant Dashboard

Open `http://localhost:6333/dashboard` in your browser. You should see the `company_docs` collection with your vectors stored. Click into it to inspect individual points — each one shows the chunk text, metadata, and the embedding vector.

## Key Concepts

**`VectorStoreIndex.from_documents()`** is doing a lot behind the scenes:

1. Splits each document into chunks using `SentenceSplitter` (configured via `Settings`)
2. Generates an embedding for each chunk using the configured embedding model
3. Stores each chunk + embedding + metadata in Qdrant as a "point"

**`load_existing_index()`** is the function you will use in the query step. It connects to the existing Qdrant collection without re-ingesting documents. This is important — you only run ingestion once (or when you add new documents), but you query many times.

The collection in Qdrant is persistent. Even if you restart the Docker container, your vectors are preserved thanks to the volume mount we configured earlier.

---

[← Chunking and Embedding](05-chunking-and-embedding.md) | [Next: Step 7 - Query Engine →](07-query-engine.md)
