# Step 2: Project Setup

One-Line Summary: Create the Python project, install LangGraph and LangChain, configure your OpenAI API key, and scaffold the project directories.

Prerequisites: Python 3.11+ installed, an OpenAI API key (or Anthropic key)

---

## Create the Project

```bash
# Create the project directory and navigate into it
mkdir job-application-agent
cd job-application-agent

# Create a virtual environment
python -m venv .venv

# Activate it (Linux/macOS)
source .venv/bin/activate

# Activate it (Windows)
# .venv\Scripts\activate
```

## Install Dependencies

```bash
pip install langgraph langchain-openai python-dotenv
```

Here is what each package does:

| Package | Purpose |
|---------|---------|
| `langgraph` | Graph-based orchestration framework for multi-agent workflows |
| `langchain-openai` | OpenAI chat model integration (`ChatOpenAI`) |
| `python-dotenv` | Load API keys from a `.env` file |

Save the dependencies:

```bash
pip freeze > requirements.txt
```

### Using a Different LLM Provider

LangGraph works with any LangChain-compatible model. To use a different provider:

```bash
# For Anthropic (Claude)
pip install langchain-anthropic

# For Google (Gemini)
pip install langchain-google-genai

# For local models (Ollama)
pip install langchain-ollama
```

We will use OpenAI throughout this blueprint, but Step 10 shows how to swap providers.

## Configure Your API Key

Create a `.env` file in your project root:

```bash
# .env
OPENAI_API_KEY=sk-your-openai-key-here
```

> **Get a key:** Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys), create an account, and generate an API key. You will need to add credits — the API is pay-per-use.

## Scaffold the Project

```bash
# Create the directory structure
mkdir -p agents output

# Create the files
touch state.py graph.py utils.py main.py
touch agents/__init__.py agents/analyzer.py agents/tailor.py
touch agents/writer.py agents/reviewer.py
```

## Create the Config Loader

We need a simple way to initialize the LLM across all agents:

```python
# utils.py
# ==========================================
# Shared utilities and configuration
# ==========================================

import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

def get_llm(model: str = "gpt-4o", temperature: float = 0.3) -> ChatOpenAI:
    """Create a configured LLM instance."""
    return ChatOpenAI(model=model, temperature=temperature)


def save_output(filename: str, content: str) -> str:
    """Save content to the output directory."""
    output_dir = os.path.join(os.path.dirname(__file__), "output")
    os.makedirs(output_dir, exist_ok=True)

    filepath = os.path.join(output_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    return filepath


def load_file(filepath: str) -> str:
    """Load a text file and return its contents."""
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()
```

## Create a Sample Resume

Create `sample_resume.md` — a test resume we will use throughout development:

```markdown
# Alex Chen

**Software Engineer** | San Francisco, CA
alex.chen@email.com | github.com/alexchen

## Summary

Software engineer with 4 years of experience building web applications
and backend services. Focused on Python, JavaScript, and cloud infrastructure.

## Experience

### Software Engineer — Acme Corp (2022–Present)
- Built REST APIs serving 50k daily active users using Python and FastAPI
- Migrated legacy monolith to microservices architecture on AWS
- Led adoption of CI/CD pipelines, reducing deployment time by 60%
- Mentored 2 junior engineers through onboarding and code reviews

### Junior Developer — StartupXYZ (2020–2022)
- Developed React frontend for customer-facing dashboard
- Wrote integration tests that caught 30+ bugs before production
- Participated in on-call rotation and incident response

## Skills

Python, JavaScript, TypeScript, React, FastAPI, Django, PostgreSQL,
Redis, AWS (EC2, S3, Lambda), Docker, Git, CI/CD, REST APIs

## Education

B.S. Computer Science — UC Berkeley (2020)
```

## Verify Everything Works

```python
# test_setup.py
# ==========================================
# Verify LangGraph and OpenAI are working
# ==========================================

from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o", temperature=0)
response = llm.invoke("Say hello in exactly 5 words.")

print(response.content)
print("\nSetup verified — you're ready to build.")
```

```bash
python test_setup.py
```

If you see a five-word greeting, your environment is configured. Clean up:

```bash
rm test_setup.py
```

## Your Project So Far

```
job-application-agent/
├── agents/
│   ├── __init__.py       ✅ Package init
│   ├── analyzer.py       📝 Empty
│   ├── tailor.py         📝 Empty
│   ├── writer.py         📝 Empty
│   └── reviewer.py       📝 Empty
├── output/               ✅ Output directory
├── state.py              📝 Empty
├── graph.py              📝 Empty
├── utils.py              ✅ Config and helpers
├── main.py               📝 Empty
├── sample_resume.md      ✅ Test resume
├── .env                  ✅ API key configured
└── requirements.txt      ✅ Dependencies saved
```

---

**Reference:** [LangGraph Installation](https://langchain-ai.github.io/langgraph/) · [LangChain OpenAI](https://python.langchain.com/docs/integrations/chat/openai/)

[← What We're Building](01-what-were-building.md) | [Next: Step 3 - LangGraph Fundamentals →](03-langgraph-fundamentals.md)
