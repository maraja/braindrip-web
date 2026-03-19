# Step 2: Project Setup

One-Line Summary: Create the Python project, install the Anthropic SDK and DuckDuckGo search, and configure your API key.

Prerequisites: Python 3.11+ installed, an Anthropic API key

---

## Create the Project Directory

```bash
# Create the project directory
mkdir content-crew
cd content-crew

# Create a virtual environment
python3 -m venv venv

# Activate it
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate
```

## Install Dependencies

```bash
pip install anthropic duckduckgo-search python-dotenv
```

That is three packages:

| Package | Purpose |
|---------|---------|
| **anthropic** | Official Anthropic SDK — call Claude directly |
| **duckduckgo-search** | Web search with no API key required |
| **python-dotenv** | Loads API keys from a `.env` file |

Create a `requirements.txt` for reproducibility:

```txt
# requirements.txt
anthropic>=0.49.0
duckduckgo-search>=6.0.0
python-dotenv>=1.0.0
```

## Configure Your API Key

Create a `.env` file:

```bash
# .env — API key (never commit this file)
ANTHROPIC_API_KEY=your-api-key-here
```

Replace `your-api-key-here` with your actual key from [console.anthropic.com](https://console.anthropic.com).

Create the config module:

```python
# config.py — Load environment variables and configure the LLM

import os
from dotenv import load_dotenv

load_dotenv()

# Verify the API key is set
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise ValueError(
        "ANTHROPIC_API_KEY not found. Add it to your .env file."
    )

# Model to use for all agents
MODEL = "claude-sonnet-4-20250514"
```

## Create the Project Skeleton

```bash
# Create the Python files
touch main.py agent.py agents.py tools.py

# Create the output directory
mkdir -p output

# Create .gitignore
cat > .gitignore << 'EOF'
.env
venv/
__pycache__/
output/*.md
EOF
```

## Verify the Setup

```python
# test_setup.py — Verify installation and API key

from config import ANTHROPIC_API_KEY, MODEL
from anthropic import Anthropic

client = Anthropic(api_key=ANTHROPIC_API_KEY)
response = client.messages.create(
    model=MODEL,
    max_tokens=50,
    messages=[{"role": "user", "content": "Say 'Setup complete!' in exactly two words."}],
)
print(f"Model: {MODEL}")
print(f"Response: {response.content[0].text}")
print("Setup verified.")
```

```bash
python test_setup.py
```

If you see a response from Claude, everything is working. Clean up:

```bash
rm test_setup.py
```

---

[← What We're Building](01-what-were-building.md) | [Next: Step 3 - Build the Agent Class →](03-build-the-agent-class.md)
