# Step 2: Project Setup

One-Line Summary: Create the project directory, set up a Python virtual environment, install the four dependencies, and configure your API keys.

Prerequisites: Python 3.11+ installed, a terminal, an OpenAI API key, an Anthropic API key, a free Supabase account

---

## Create the Project

```bash
# Create the project directory and navigate into it
mkdir rag-pipeline
cd rag-pipeline

# Create the folder structure
mkdir -p data src
touch src/__init__.py
```

## Set Up the Virtual Environment

Always use a virtual environment to isolate your dependencies:

```bash
# Create a virtual environment
python3 -m venv venv

# Activate it
# macOS / Linux:
source venv/bin/activate

# Windows:
# venv\Scripts\activate
```

Your terminal prompt should now show `(venv)` at the beginning.

## Install Dependencies

Create a `requirements.txt` file:

```txt
# requirements.txt
# ==========================================
# RAG Pipeline Dependencies
# ==========================================

# Supabase client — database + vector storage
supabase==2.13.0

# LLM provider — Claude for answer generation
anthropic==0.49.0

# Embeddings — text-embedding-3-small
openai==1.66.3

# Environment variable management
python-dotenv==1.1.0
```

Install everything:

```bash
pip install -r requirements.txt
```

That is it — four packages. No frameworks, no Docker images, no extra infrastructure.

## Configure API Keys

Create a `.env` file in the project root:

```bash
# .env
# ==========================================
# API Keys — DO NOT commit this file
# ==========================================

OPENAI_API_KEY=sk-your-openai-api-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key-here
```

Where to get these:

- **OpenAI key**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys) — used only for embeddings (about $0.02 per million tokens).
- **Anthropic key**: [console.anthropic.com](https://console.anthropic.com) — used for the generation step.
- **Supabase URL and key**: You will get these when you create a Supabase project in the next step.

Add `.env` to your `.gitignore`:

```bash
echo ".env" >> .gitignore
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
```

## Create the Config Module

Create a shared config file that all modules will import:

```python
# src/config.py
# ==========================================
# Shared configuration for the RAG pipeline
# ==========================================

import os
from dotenv import load_dotenv

load_dotenv()

# Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# RAG settings
CHUNK_SIZE = 500          # characters per chunk
CHUNK_OVERLAP = 50        # overlapping characters between chunks
EMBEDDING_MODEL = "text-embedding-3-small"
CLAUDE_MODEL = "claude-sonnet-4-20250514"
TABLE_NAME = "documents"
TOP_K = 3                 # number of chunks to retrieve per query
```

## Verify the Installation

```python
# verify_setup.py
# ==========================================
# Quick sanity check — run once to confirm setup
# ==========================================

from dotenv import load_dotenv
import os

load_dotenv()

# Verify API keys are set
assert os.getenv("OPENAI_API_KEY"), "OPENAI_API_KEY not found in .env"
assert os.getenv("ANTHROPIC_API_KEY"), "ANTHROPIC_API_KEY not found in .env"

# Verify core imports
from supabase import create_client
from openai import OpenAI
from anthropic import Anthropic

print("All imports successful.")
print(f"OpenAI key: ...{os.getenv('OPENAI_API_KEY')[-4:]}")
print(f"Anthropic key: ...{os.getenv('ANTHROPIC_API_KEY')[-4:]}")
print("Setup complete — you are ready to build.")
```

Run it:

```bash
python verify_setup.py
```

If you see "All imports successful", your environment is ready.

---

[← What We're Building](01-what-were-building.md) | [Next: Step 3 - Set Up Supabase →](03-set-up-supabase.md)
