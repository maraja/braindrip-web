# Step 1: What We're Building

One-Line Summary: A document Q&A system that stores your files in Supabase, embeds them with pgvector, and answers questions using Claude — all with just one platform and two API calls.

Prerequisites: Basic Python knowledge, familiarity with APIs and the command line

---

## The Goal

By the end of this blueprint, you will have a working RAG (Retrieval-Augmented Generation) pipeline that:

- **Ingests documents** — text files dropped into a folder
- **Chunks and embeds** them using OpenAI's embedding model
- **Stores vectors** in Supabase using the pgvector extension (no Docker, no separate database)
- **Answers questions** by retrieving relevant chunks and sending them to Claude
- **Runs as a Python script** you can query from the command line

You will run your script and ask things like:

> "What is our refund policy?"

> "Summarize the Q3 earnings report."

> "What are the requirements for the new hire onboarding process?"

...and get accurate, grounded answers drawn directly from your documents.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Your Documents                        │
│                  (text files in /data)                    │
└──────────────────┬───────────────────────────────────────┘
                   │  1. Load & chunk
                   ▼
┌──────────────────────────────────────────────────────────┐
│              Simple Text Splitter (Python)                │
│           (split into overlapping chunks)                 │
└──────────────────┬───────────────────────────────────────┘
                   │  2. Embed chunks
                   ▼
┌──────────────────────────────────────────────────────────┐
│          OpenAI text-embedding-3-small                    │
│            (1536-dimension vectors)                       │
└──────────────────┬───────────────────────────────────────┘
                   │  3. Store vectors
                   ▼
┌──────────────────────────────────────────────────────────┐
│         Supabase (Postgres + pgvector)                    │
│       Hosted database — no Docker required                │
└──────────────────┬───────────────────────────────────────┘
                   │  4. Query: similarity search
                   ▼
┌──────────────────────────────────────────────────────────┐
│       Claude (Anthropic API) — Generation                 │
│   "Given these document excerpts, answer the question"    │
└──────────────────────────────────────────────────────────┘
```

## Why This Stack

| Choice | Why |
|--------|-----|
| **Python 3.11+** | The standard language for AI/ML tooling. Broad library support. |
| **Supabase** | Free hosted Postgres with pgvector built in. Database, vector store, and dashboard in one platform. No Docker, no infrastructure to manage. |
| **OpenAI text-embedding-3-small** | Cost-effective, high-quality embeddings. 1536 dimensions. One API call per chunk. |
| **Claude (Anthropic SDK)** | Excellent at synthesizing information and citing sources. Great for Q&A generation. |

Notice what is **not** in this stack: no RAG frameworks (LlamaIndex, LangChain), no separate vector database (Qdrant, Pinecone), no Docker, no API server (FastAPI). Supabase replaces all the infrastructure, and we write the RAG logic directly in Python so you understand every step.

## Project Structure

```
rag-pipeline/
├── data/                    # Drop your text files here
│   ├── company-policy.txt
│   └── onboarding-guide.txt
├── src/
│   ├── ingest.py            # Document loading, chunking, embedding, and storage
│   ├── query.py             # Similarity search + Claude answer generation
│   └── config.py            # Shared configuration
├── setup_supabase.sql       # SQL to set up your Supabase table
├── requirements.txt
└── .env                     # API keys (never commit this)
```

## What is RAG?

RAG stands for **Retrieval-Augmented Generation**. Instead of relying on what an LLM already knows (which can be outdated or hallucinated), RAG retrieves relevant context from your own documents and includes it in the prompt. The LLM then generates an answer grounded in that context.

The pipeline has two phases:

1. **Indexing** (offline) — Load documents, split them into chunks, create embeddings, store in a vector database.
2. **Querying** (online) — Take a user question, embed it, find similar chunks, pass them to the LLM with the question, return the answer.

This is the most practical pattern for building AI features on top of private data. Let's build it.

---

[Next: Step 2 - Project Setup →](02-project-setup.md)
