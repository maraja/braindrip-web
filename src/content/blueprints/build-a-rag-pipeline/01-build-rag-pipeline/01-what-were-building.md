# Step 1: What We're Building

One-Line Summary: A document Q&A system that lets you upload company docs, embed them into a vector database, and ask questions in natural language — powered by LlamaIndex, Qdrant, and Claude.

Prerequisites: Basic Python knowledge, familiarity with APIs and the command line

---

## The Goal

By the end of this blueprint, you will have a working RAG (Retrieval-Augmented Generation) pipeline that:

- **Ingests documents** — PDFs and text files dropped into a folder
- **Chunks and embeds** them using OpenAI's text-embedding-3-small model
- **Stores vectors** in Qdrant, an open-source vector database running locally
- **Answers questions** by retrieving relevant chunks and sending them to Claude
- **Exposes a REST API** via FastAPI so any frontend or tool can query your docs

You will start your server and ask things like:

> "What is our refund policy?"

> "Summarize the Q3 earnings report."

> "What are the requirements for the new hire onboarding process?"

...and get accurate, grounded answers drawn directly from your documents.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Your Documents                        │
│              (PDFs, .txt files in /data)                  │
└──────────────────┬───────────────────────────────────────┘
                   │  1. Load & chunk
                   ▼
┌──────────────────────────────────────────────────────────┐
│               LlamaIndex Ingestion Pipeline               │
│         (SentenceSplitter → chunk documents)              │
└──────────────────┬───────────────────────────────────────┘
                   │  2. Embed chunks
                   ▼
┌──────────────────────────────────────────────────────────┐
│            OpenAI text-embedding-3-small                  │
│              (1536-dimension vectors)                     │
└──────────────────┬───────────────────────────────────────┘
                   │  3. Store vectors
                   ▼
┌──────────────────────────────────────────────────────────┐
│              Qdrant Vector Database                        │
│            (running locally via Docker)                    │
└──────────────────┬───────────────────────────────────────┘
                   │  4. Query: retrieve top-k chunks
                   ▼
┌──────────────────────────────────────────────────────────┐
│         Claude (Anthropic API) — Generation               │
│   "Given these document excerpts, answer the question"    │
└──────────────────┬───────────────────────────────────────┘
                   │  5. Return answer
                   ▼
┌──────────────────────────────────────────────────────────┐
│              FastAPI REST Endpoint                         │
│            POST /query  { "question": "..." }             │
└──────────────────────────────────────────────────────────┘
```

## Why This Stack

| Choice | Why |
|--------|-----|
| **Python 3.11+** | The standard language for AI/ML tooling. Broad library support. |
| **LlamaIndex** | Most beginner-friendly RAG framework. Built-in chunking, embedding, and query engine abstractions. Less boilerplate than LangChain. |
| **Qdrant** | Open-source vector database. Runs locally in Docker with zero configuration. Rich filtering, fast similarity search. |
| **OpenAI text-embedding-3-small** | Cost-effective, high-quality embeddings. 1536 dimensions. Widely supported. |
| **Claude (Anthropic SDK)** | Excellent at following instructions, synthesizing information, and citing sources. Great for Q&A generation. |
| **FastAPI** | Modern Python web framework with automatic OpenAPI docs. Async support out of the box. |

## Project Structure

Here is what we will build:

```
rag-pipeline/
├── data/                    # Drop your PDFs and .txt files here
│   ├── sample.pdf
│   └── company-handbook.txt
├── src/
│   ├── ingest.py            # Document loading, chunking, and embedding
│   ├── query.py             # Query engine that retrieves and generates answers
│   └── api.py               # FastAPI endpoint
├── requirements.txt
├── .env                     # API keys (never commit this)
└── docker-compose.yml       # Qdrant container config
```

## What is RAG?

RAG stands for **Retrieval-Augmented Generation**. Instead of relying on what an LLM already knows (which can be outdated or hallucinated), RAG retrieves relevant context from your own documents and includes it in the prompt. The LLM then generates an answer grounded in that context.

The pipeline has two phases:

1. **Indexing** (offline) — Load documents, split them into chunks, create embeddings, store in a vector database.
2. **Querying** (online) — Take a user question, embed it, find similar chunks, pass them to the LLM with the question, return the answer.

This is the most practical pattern for building AI features on top of private data. Let's build it.

---

[Next: Step 2 - Project Setup →](02-project-setup.md)
