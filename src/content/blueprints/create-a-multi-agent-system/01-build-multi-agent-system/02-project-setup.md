# Step 2: Project Setup

One-Line Summary: Create the Python project, install CrewAI and its dependencies, and configure your Anthropic API key.

Prerequisites: Python 3.11+ installed, an Anthropic API key

---

## Create the Project Directory

Start by creating a clean project folder and setting up a virtual environment:

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

You should see `(venv)` in your terminal prompt, confirming the virtual environment is active.

## Install Dependencies

CrewAI integrates with Claude through LiteLLM, which provides a unified interface for calling different LLM providers. Install everything with a single command:

```bash
# Install CrewAI with tool support
pip install crewai crewai-tools litellm python-dotenv
```

This installs:

| Package | Purpose |
|---------|---------|
| **crewai** | The multi-agent orchestration framework |
| **crewai-tools** | Built-in tool library for agents |
| **litellm** | Unified LLM API — lets CrewAI call Claude |
| **python-dotenv** | Loads API keys from a `.env` file |

Verify the installation:

```bash
pip show crewai | grep Version
```

You should see version 0.80.0 or later.

## Configure Your API Key

Create a `.env` file in the project root to store your Anthropic API key:

```bash
# Create the .env file
touch .env
```

Add your key:

```bash
# .env — API keys (never commit this file)

ANTHROPIC_API_KEY=your-api-key-here
```

Replace `your-api-key-here` with your actual API key from [console.anthropic.com](https://console.anthropic.com).

Now create a `config.py` file that loads this key and sets up the LLM:

```python
# config.py — Load environment variables and configure the LLM

import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

# Verify the API key is set
api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError(
        "ANTHROPIC_API_KEY not found. "
        "Add it to your .env file."
    )

# LLM identifier for CrewAI (uses LiteLLM format)
# This tells LiteLLM to route requests to Anthropic's API
LLM_MODEL = "anthropic/claude-sonnet-4-20250514"
```

CrewAI uses LiteLLM under the hood, so the model string follows the `provider/model-name` format. LiteLLM reads `ANTHROPIC_API_KEY` from the environment automatically — no extra configuration needed.

## Create the Project Skeleton

Set up the remaining files and the output directory:

```bash
# Create the Python files we will fill in later
touch main.py agents.py tasks.py tools.py

# Create the output directory for generated articles
mkdir -p output

# Create a .gitignore to keep secrets out of version control
cat > .gitignore << 'EOF'
.env
venv/
__pycache__/
output/*.md
EOF

# Create a requirements file for reproducibility
cat > requirements.txt << 'EOF'
crewai>=0.80.0
crewai-tools>=0.14.0
litellm>=1.40.0
python-dotenv>=1.0.0
EOF
```

## Verify the Setup

Run a quick check to make sure everything is wired up:

```python
# test_setup.py — Verify the installation and API key

from config import LLM_MODEL, api_key

print(f"LLM Model: {LLM_MODEL}")
print(f"API Key loaded: {'Yes' if api_key else 'No'}")
print(f"API Key prefix: {api_key[:12]}...")

# Test that CrewAI imports work
from crewai import Agent, Task, Crew
print("CrewAI imported successfully")
```

```bash
python test_setup.py
```

You should see output confirming the model, API key, and successful imports. If you get import errors, make sure your virtual environment is active and you ran `pip install` inside it.

Your project is ready. Next, we will create your first agent.

---

[← What We're Building](01-what-were-building.md) | [Next: Step 3 - Your First Agent →](03-your-first-agent.md)
