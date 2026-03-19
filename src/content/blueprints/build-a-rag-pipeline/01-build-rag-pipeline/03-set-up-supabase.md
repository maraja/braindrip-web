# Step 3: Set Up Supabase

One-Line Summary: Create a Supabase project, enable the pgvector extension, and create the documents table that will store your text chunks and their embeddings.

Prerequisites: A free Supabase account at [supabase.com](https://supabase.com)

---

## Why Supabase?

Supabase gives you a full Postgres database with the `pgvector` extension built in. That means you get a vector database without installing anything — no Docker, no separate service, no infrastructure to manage. You also get a dashboard to inspect your data, built-in Row Level Security, and a generous free tier.

In our previous architecture, we needed Docker + Qdrant just for vector storage. Supabase replaces all of that with a single hosted service you can set up in two minutes.

## Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account)
2. Click **New Project**
3. Choose a name (e.g., `rag-pipeline`) and set a database password
4. Select the region closest to you
5. Click **Create new project** and wait about 30 seconds

Once created, go to **Project Settings → API** and copy:

- **Project URL** — this is your `SUPABASE_URL`
- **anon public key** — this is your `SUPABASE_KEY`

Paste both into your `.env` file:

```bash
SUPABASE_URL=https://abcdefghijklm.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

## Enable pgvector and Create the Table

Go to the **SQL Editor** in your Supabase dashboard and run this SQL:

```sql
-- setup_supabase.sql
-- ==========================================
-- Enable the pgvector extension and create
-- the documents table for RAG storage
-- ==========================================

-- Step 1: Enable the vector extension
create extension if not exists vector;

-- Step 2: Create the documents table
create table documents (
  id bigserial primary key,
  content text not null,              -- the chunk text
  metadata jsonb default '{}'::jsonb, -- source file, page number, etc.
  embedding vector(1536)              -- OpenAI text-embedding-3-small dimensions
);

-- Step 3: Create an index for fast similarity search
-- IVFFlat is good for datasets up to ~1M vectors
create index on documents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
```

Save this as `setup_supabase.sql` in your project root so you can reference it later.

After running the SQL, you should see the `documents` table in the **Table Editor** with columns: `id`, `content`, `metadata`, and `embedding`.

## Create the Search Function

Still in the SQL Editor, create a function that performs similarity search. This is the core of our retrieval step:

```sql
-- Create a function to search for similar documents
-- This runs entirely inside Postgres — no external calls needed
create or replace function match_documents (
  query_embedding vector(1536),
  match_count int default 3
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

This function takes a query vector and returns the most similar chunks, ranked by cosine similarity. The `<=>` operator is pgvector's cosine distance operator.

## Verify the Setup

Back in Python, test the connection:

```python
# test_supabase.py
# ==========================================
# Verify Supabase connection and table setup
# ==========================================

from src.config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client

client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Check we can query the documents table (should be empty)
result = client.table("documents").select("id").limit(1).execute()
print(f"Connected to Supabase. Documents in table: {len(result.data)}")
print("Supabase setup complete.")
```

```bash
python test_supabase.py
```

Expected output:

```
Connected to Supabase. Documents in table: 0
Supabase setup complete.
```

## Troubleshooting

**"relation 'documents' does not exist"** — The SQL did not run successfully. Go back to the SQL Editor and run the create table statement again. Check for typos.

**"Could not find the function match_documents"** — Run the search function SQL separately. Make sure it completes without errors.

**Connection refused** — Double-check your `SUPABASE_URL` and `SUPABASE_KEY` in `.env`. The URL should start with `https://` and the key should be the **anon** key (not the service role key).

Your vector database is ready. Next, we load some documents.

---

[← Project Setup](02-project-setup.md) | [Next: Step 4 - Document Loader →](04-document-loader.md)
