# Step 2: Project Setup

One-Line Summary: Create the Python project, install dependencies, and configure your Anthropic API key.

Prerequisites: Python 3.11+ installed, an Anthropic API key

---

## Create the Project

Open your terminal and set up the project directory:

```bash
# Create the project directory and navigate into it
mkdir research-agent
cd research-agent

# Create a virtual environment
python -m venv venv

# Activate it (Linux/macOS)
source venv/bin/activate

# Activate it (Windows)
# venv\Scripts\activate
```

## Install Dependencies

```bash
# Install all required packages
pip install anthropic duckduckgo-search fastapi uvicorn python-dotenv
```

Here is what each package does:

| Package | Purpose |
|---------|---------|
| `anthropic` | Official Python SDK for the Claude API |
| `duckduckgo-search` | Web search — free, no API key required |
| `fastapi` | Web framework for our REST API |
| `uvicorn` | ASGI server to run FastAPI |
| `python-dotenv` | Load environment variables from a `.env` file |

Save the dependencies:

```bash
# Freeze dependencies to a requirements file
pip freeze > requirements.txt
```

## Configure Your API Key

Create a `.env` file in your project root. This keeps secrets out of your code:

```bash
# .env
# Your Anthropic API key — get one at https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Now create `config.py` to load these values:

```python
# config.py
# ==========================================
# Configuration — loads API keys from .env
# ==========================================

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Anthropic API key for Claude
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY is not set. Add it to your .env file.")

# Model to use — claude-sonnet-4-20250514 is fast and capable
MODEL = "claude-sonnet-4-20250514"

# Maximum tokens per response
MAX_TOKENS = 4096
```

## Verify Everything Works

Create a quick test script to confirm your setup:

```python
# test_setup.py
# ==========================================
# Quick smoke test — verifies API key works
# ==========================================

import anthropic
from config import ANTHROPIC_API_KEY, MODEL

# Initialize the client
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# Make a minimal API call
response = client.messages.create(
    model=MODEL,
    max_tokens=100,
    messages=[{"role": "user", "content": "Say hello in exactly 5 words."}],
)

# Print the response
print(response.content[0].text)
print("\nSetup verified — you're ready to build.")
```

Run it:

```bash
python test_setup.py
```

If you see a five-word greeting and the success message, your environment is configured correctly. If you get an authentication error, double-check your API key in `.env`.

## Getting Your API Keys

**Anthropic API key:** Go to [console.anthropic.com](https://console.anthropic.com/), create an account, and generate an API key under Settings. You will need to add credits — the API is pay-per-use.

We use DuckDuckGo for web search, which requires no API key — one less account to create.

---

[← What We're Building](01-what-were-building.md) | [Next: Step 3 - Basic Claude Call →](03-basic-claude-call.md)
