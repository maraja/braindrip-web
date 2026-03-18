# Step 7: Query Engine

One-Line Summary: Build the query engine that takes a natural language question, retrieves relevant document chunks from Qdrant, and generates an answer using Claude.

Prerequisites: Documents indexed in Qdrant from Step 6

---

## How RAG Querying Works

When a user asks a question, the query engine performs three steps:

1. **Embed the question** — convert the question into a vector using the same embedding model
2. **Retrieve** — find the top-k most similar chunks in Qdrant using cosine similarity
3. **Generate** — send the retrieved chunks plus the question to Claude, which synthesizes an answer grounded in the source material

LlamaIndex's `QueryEngine` abstracts all three steps into a single `.query()` call.

## Create the Query Module

```python
# src/query.py
# ==========================================
# Query Engine — Retrieve and generate answers
# using Claude as the LLM
# ==========================================

import os
from dotenv import load_dotenv

from llama_index.core import Settings
from llama_index.llms.anthropic import Anthropic
from llama_index.embeddings.openai import OpenAIEmbedding

from src.ingest import load_existing_index

# Load API keys from .env
load_dotenv()

# ------------------------------------------
# Configuration
# ------------------------------------------
# Number of chunks to retrieve for each query
TOP_K = 3

# Claude model to use for generation
CLAUDE_MODEL = "claude-sonnet-4-20250514"


def create_query_engine():
    """
    Build a query engine backed by:
    - Qdrant for retrieval
    - OpenAI for embedding the question
    - Claude for generating the answer
    """
    # ------------------------------------------
    # Configure the LLM (Claude via Anthropic SDK)
    # ------------------------------------------
    llm = Anthropic(
        model=CLAUDE_MODEL,
        api_key=os.getenv("ANTHROPIC_API_KEY"),
        # System prompt that guides how Claude answers
        system_prompt=(
            "You are a helpful assistant that answers questions based on "
            "the provided document excerpts. Always ground your answers in "
            "the source material. If the documents do not contain enough "
            "information to answer the question, say so clearly. "
            "Cite which document the information comes from when possible."
        ),
    )

    # ------------------------------------------
    # Configure embeddings (same model used during ingestion)
    # ------------------------------------------
    Settings.llm = llm
    Settings.embed_model = OpenAIEmbedding(
        model="text-embedding-3-small",
        api_key=os.getenv("OPENAI_API_KEY"),
    )

    # ------------------------------------------
    # Load the existing index from Qdrant
    # ------------------------------------------
    index = load_existing_index()

    # ------------------------------------------
    # Build the query engine
    # ------------------------------------------
    query_engine = index.as_query_engine(
        # How many chunks to retrieve
        similarity_top_k=TOP_K,
        # Stream responses for faster perceived latency
        streaming=False,
    )

    print(f"Query engine ready (top_k={TOP_K}, model={CLAUDE_MODEL})")
    return query_engine


def ask(question: str, engine=None):
    """
    Ask a question and get an answer grounded in your documents.

    Returns a dict with the answer text and source information.
    """
    if engine is None:
        engine = create_query_engine()

    print(f"\nQuestion: {question}")
    print("Retrieving relevant chunks and generating answer...")

    # This single call embeds the question, retrieves chunks,
    # and sends everything to Claude
    response = engine.query(question)

    # Extract source information from the response
    sources = []
    for node in response.source_nodes:
        sources.append({
            "file": node.metadata.get("file_name", "unknown"),
            "score": round(node.score, 4) if node.score else None,
            "text_preview": node.get_content()[:200],
        })

    result = {
        "answer": str(response),
        "sources": sources,
        "num_sources": len(sources),
    }

    return result


if __name__ == "__main__":
    # Interactive testing mode
    engine = create_query_engine()

    test_questions = [
        "What is the refund policy?",
        "What happens in the first week of onboarding?",
        "How do I contact IT support?",
    ]

    for question in test_questions:
        result = ask(question, engine)
        print(f"\nAnswer: {result['answer']}")
        print(f"\nSources ({result['num_sources']}):")
        for src in result["sources"]:
            print(f"  - {src['file']} (score: {src['score']})")
            print(f"    {src['text_preview'][:100]}...")
        print("\n" + "=" * 60)
```

## Test the Query Engine

```bash
python -m src.query
```

Expected output:

```
Connected to Qdrant at localhost:6333
Loaded existing index from collection 'company_docs'.
Query engine ready (top_k=3, model=claude-sonnet-4-20250514)

Question: What is the refund policy?
Retrieving relevant chunks and generating answer...

Answer: Based on the company policy document, all purchases are eligible
for a full refund within 30 days of the original purchase date. To request
a refund, customers must contact support@example.com with their order
number and reason. Digital product refunds are processed within 5 business
days, while physical products must be returned in original packaging.
After 30 days, only store credit is available.

Sources (3):
  - company-policy.txt (score: 0.8921)
    Company Refund Policy All purchases are eligible for a full refund...
```

## What is Happening Under the Hood

When you call `engine.query("What is the refund policy?")`:

1. LlamaIndex embeds the question using `text-embedding-3-small`, producing a 1536-dim vector
2. It sends this vector to Qdrant, which returns the 3 most similar chunks (cosine similarity)
3. LlamaIndex constructs a prompt like: "Given the following context, answer the question..." with the retrieved chunks injected
4. Claude reads the chunks and generates a grounded answer
5. The response includes both the answer text and references to which chunks were used

The `similarity_top_k=3` parameter controls how many chunks Claude sees. More chunks means more context but higher token cost and potential noise. For most use cases, 3-5 is a good starting point. We will experiment with this in Step 9.

---

[← Vector Store](06-vector-store.md) | [Next: Step 8 - API Endpoint →](08-api-endpoint.md)
