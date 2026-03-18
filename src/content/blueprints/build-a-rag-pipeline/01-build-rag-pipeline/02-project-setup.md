# Step 2: Project Setup

One-Line Summary: Create the project directory, set up a Python virtual environment, install all dependencies, and configure your API keys.

Prerequisites: Python 3.11+ installed, a terminal, an OpenAI API key, an Anthropic API key

---

## Create the Project

```bash
# Create the project directory and navigate into it
mkdir rag-pipeline
cd rag-pipeline

# Create the folder structure
mkdir -p data src
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

Create a `requirements.txt` file with all the packages we need:

```txt
# requirements.txt
# ==========================================
# RAG Pipeline Dependencies
# ==========================================

# RAG framework — handles chunking, embeddings, and query orchestration
llama-index-core==0.12.5
llama-index-readers-file==0.4.3
llama-index-embeddings-openai==0.3.1
llama-index-llms-anthropic==0.6.6
llama-index-vector-stores-qdrant==0.4.3

# Vector database client
qdrant-client==1.13.3

# LLM providers
openai==1.66.3
anthropic==0.49.0

# Web framework for the API
fastapi==0.115.12
uvicorn==0.34.0

# Document parsing
pypdf==5.4.0

# Environment variable management
python-dotenv==1.1.0
```

Install everything:

```bash
pip install -r requirements.txt
```

This will take a minute or two. LlamaIndex pulls in several sub-packages for its modular architecture.

## Configure API Keys

Create a `.env` file in the project root. This keeps your secrets out of your code:

```bash
# .env
# ==========================================
# API Keys — DO NOT commit this file
# ==========================================

OPENAI_API_KEY=sk-your-openai-api-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
```

Replace the placeholder values with your actual keys:

- **OpenAI key**: Get one at [platform.openai.com/api-keys](https://platform.openai.com/api-keys). This is used only for embeddings (text-embedding-3-small costs about $0.02 per million tokens).
- **Anthropic key**: Get one at [console.anthropic.com](https://console.anthropic.com). This is used for the generation step.

Add `.env` to your `.gitignore` so you never accidentally commit your keys:

```bash
# Create .gitignore
echo ".env" >> .gitignore
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
```

## Verify the Installation

Run a quick check to make sure everything imported correctly:

```python
# verify_setup.py
# ==========================================
# Quick sanity check — run this once to confirm
# all packages installed correctly
# ==========================================

from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Verify API keys are set
assert os.getenv("OPENAI_API_KEY"), "OPENAI_API_KEY not found in .env"
assert os.getenv("ANTHROPIC_API_KEY"), "ANTHROPIC_API_KEY not found in .env"

# Verify core imports
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.anthropic import Anthropic
from qdrant_client import QdrantClient
from fastapi import FastAPI

print("All imports successful.")
print(f"OpenAI key: ...{os.getenv('OPENAI_API_KEY')[-4:]}")
print(f"Anthropic key: ...{os.getenv('ANTHROPIC_API_KEY')[-4:]}")
print("Setup complete — you are ready to build.")
```

Run it:

```bash
python verify_setup.py
```

If you see "All imports successful" and your key suffixes, your environment is ready. If any import fails, double-check that you activated the virtual environment and ran `pip install -r requirements.txt`.

---

[← What We're Building](01-what-were-building.md) | [Next: Step 3 - Start Qdrant →](03-start-qdrant.md)
