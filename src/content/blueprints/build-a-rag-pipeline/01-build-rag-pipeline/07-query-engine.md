# Step 7: Query Engine

One-Line Summary: Build the query engine that embeds a question, searches Supabase for relevant chunks, and generates an answer using Claude.

Prerequisites: Documents stored in Supabase from Step 6

---

## How RAG Querying Works

When a user asks a question, three things happen:

1. **Embed the question** — convert it to a vector using the same embedding model
2. **Retrieve** — find the most similar chunks in Supabase using the `match_documents` function we created
3. **Generate** — send the retrieved chunks plus the question to Claude, which synthesizes an answer

We will build all three steps in a single Python module.

## Create the Query Module

```python
# src/query.py
# ==========================================
# Query Engine — Search Supabase + generate
# answers with Claude
# ==========================================

from openai import OpenAI
from anthropic import Anthropic
from supabase import create_client

from src.config import (
    OPENAI_API_KEY, ANTHROPIC_API_KEY,
    SUPABASE_URL, SUPABASE_KEY,
    EMBEDDING_MODEL, CLAUDE_MODEL, TOP_K,
)

# Clients
openai_client = OpenAI(api_key=OPENAI_API_KEY)
anthropic_client = Anthropic(api_key=ANTHROPIC_API_KEY)
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)


def embed_query(question: str) -> list[float]:
    """Embed the user's question using the same model as ingestion."""
    response = openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=question,
    )
    return response.data[0].embedding


def search_similar_chunks(query_embedding: list[float], top_k: int = TOP_K):
    """
    Find the most similar chunks in Supabase using pgvector.
    Calls the match_documents SQL function we created in Step 3.
    """
    result = supabase_client.rpc(
        "match_documents",
        {
            "query_embedding": query_embedding,
            "match_count": top_k,
        },
    ).execute()

    return result.data


def generate_answer(question: str, chunks: list[dict]) -> str:
    """
    Send the question and retrieved chunks to Claude.
    Returns a grounded answer.
    """
    # Build context from retrieved chunks
    context_parts = []
    for i, chunk in enumerate(chunks):
        source = chunk.get("metadata", {})
        if isinstance(source, str):
            import json
            source = json.loads(source)
        file_name = source.get("file_name", "unknown")
        context_parts.append(
            f"[Source: {file_name}]\n{chunk['content']}"
        )
    context = "\n\n---\n\n".join(context_parts)

    # Call Claude with the context and question
    response = anthropic_client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1024,
        system=(
            "You are a helpful assistant that answers questions based on "
            "the provided document excerpts. Always ground your answers in "
            "the source material. If the documents do not contain enough "
            "information to answer the question, say so clearly. "
            "Cite which document the information comes from when possible."
        ),
        messages=[
            {
                "role": "user",
                "content": (
                    f"Based on the following document excerpts, "
                    f"answer this question: {question}\n\n"
                    f"Document excerpts:\n\n{context}"
                ),
            }
        ],
    )

    return response.content[0].text


def ask(question: str):
    """
    Full RAG pipeline: embed → search → generate.
    Returns a dict with the answer and source information.
    """
    print(f"\nQuestion: {question}")

    # Step 1: Embed the question
    query_embedding = embed_query(question)
    print("Embedded question.")

    # Step 2: Search for similar chunks
    chunks = search_similar_chunks(query_embedding)
    print(f"Retrieved {len(chunks)} relevant chunk(s).")

    # Step 3: Generate answer with Claude
    answer = generate_answer(question, chunks)

    # Build result with source info
    sources = []
    for chunk in chunks:
        metadata = chunk.get("metadata", {})
        if isinstance(metadata, str):
            import json
            metadata = json.loads(metadata)
        sources.append({
            "file": metadata.get("file_name", "unknown"),
            "score": round(chunk.get("similarity", 0), 4),
            "preview": chunk["content"][:200],
        })

    return {
        "answer": answer,
        "sources": sources,
    }


if __name__ == "__main__":
    test_questions = [
        "What is the refund policy?",
        "What happens in the first week of onboarding?",
        "How do I contact IT support?",
    ]

    for question in test_questions:
        result = ask(question)
        print(f"\nAnswer: {result['answer']}")
        print(f"\nSources:")
        for src in result["sources"]:
            print(f"  - {src['file']} (similarity: {src['score']})")
        print("\n" + "=" * 60)
```

## Test the Query Engine

```bash
python -m src.query
```

Expected output:

```
Question: What is the refund policy?
Embedded question.
Retrieved 3 relevant chunk(s).

Answer: Based on the company policy document, all purchases are eligible
for a full refund within 30 days of the original purchase date. To request
a refund, customers must contact support@example.com with their order
number and reason. Digital product refunds are processed within 5 business
days, while physical products must be returned in original packaging.
After 30 days, only store credit is available.

Sources:
  - company-policy.txt (similarity: 0.8921)

============================================================
```

## What is Happening Under the Hood

When you call `ask("What is the refund policy?")`:

1. The question is sent to OpenAI's embedding API, producing a 1536-dim vector
2. That vector is sent to Supabase's `match_documents` function, which runs a cosine similarity search using pgvector inside Postgres
3. The top 3 most similar chunks are returned with their similarity scores
4. The chunks are formatted into a prompt and sent to Claude
5. Claude reads the chunks and generates a grounded answer

The entire retrieval step happens inside Postgres — no external vector database needed. pgvector's `<=>` operator computes cosine distance directly on your table rows, and the IVFFlat index we created makes it fast even with thousands of vectors.

---

[← Store Vectors](06-store-vectors.md) | [Next: Step 8 - Test and Iterate →](08-test-and-iterate.md)
