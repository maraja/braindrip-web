# Step 2: Project Setup

One-Line Summary: Create the Python project, install Google ADK, and configure your Gemini API key.

Prerequisites: Python 3.12+ installed, a Google account

---

## Create the Project

Open your terminal and set up the project directory:

```bash
# Create the project directory and navigate into it
mkdir research-agent
cd research-agent

# Create a virtual environment
python -m venv .venv

# Activate it (Linux/macOS)
source .venv/bin/activate

# Activate it (Windows)
# .venv\Scripts\activate
```

## Install Google ADK

```bash
# Install the Agent Development Kit
pip install google-adk
```

That single package brings in everything you need:

| What You Get | Purpose |
|--------------|---------|
| `google-adk` | Agent framework — agents, tools, runner, sessions |
| `google-genai` | Gemini API client (installed as a dependency) |
| `adk` CLI | Create, run, test, and deploy agents from the terminal |

Save the dependencies:

```bash
pip freeze > requirements.txt
```

## Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **Create API Key**
3. Copy the key

Create a `.env` file in your project root:

```bash
# .env
GOOGLE_API_KEY=your-gemini-api-key-here
```

> **Cost:** Gemini has a generous free tier. The `gemini-2.5-flash` model we will use is fast and affordable for development.

## Create the Agent Package

ADK expects your agent to live in a Python package. Create the directory structure:

```bash
# Create the agent package directory
mkdir research_agent

# Create the required files
touch research_agent/__init__.py
touch research_agent/agent.py
```

Add the package init that tells ADK where to find your agent:

```python
# research_agent/__init__.py
# ==========================================
# Package init — ADK discovers agents through this file
# ==========================================

from . import agent
```

## Verify ADK Is Installed

Run a quick check to make sure everything is working:

```bash
# Check ADK version
adk --version
```

You should see a version number like `1.x.x`. If you see a command not found error, make sure your virtual environment is activated.

## Verify Your API Key

Create a quick test to confirm your Gemini API key works:

```python
# test_setup.py
# ==========================================
# Quick smoke test — verifies API key works
# ==========================================

import google.genai as genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client()
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Say hello in exactly 5 words.",
)

print(response.text)
print("\nSetup verified — you're ready to build.")
```

Run it:

```bash
python test_setup.py
```

If you see a five-word greeting and the success message, your environment is configured correctly. If you get an authentication error, double-check your API key in `.env`.

## Your Project So Far

```
research-agent/
├── research_agent/
│   ├── __init__.py       ✅ Package init
│   └── agent.py          📝 Empty (we fill this next)
├── .env                  ✅ API key configured
├── requirements.txt      ✅ Dependencies saved
└── test_setup.py         ✅ Setup verified
```

---

**Reference:** [ADK Python Get Started](https://google.github.io/adk-docs/get-started/python/) · [Google AI Studio](https://aistudio.google.com/apikey)

[← What We're Building](01-what-were-building.md) | [Next: Step 3 - Your First Agent →](03-your-first-agent.md)
