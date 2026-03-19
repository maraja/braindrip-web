# Step 7: Customize with Modelfiles

One-Line Summary: Create custom models using Ollama's Modelfile system — set system prompts, adjust parameters, and build specialized models for different use cases.

Prerequisites: Ollama running with Llama 3.1 pulled (Steps 2-3)

---

## What Is a Modelfile

A Modelfile is Ollama's configuration format for creating custom models. Think of it like a Dockerfile but for LLMs. You start from a base model and customize:

- **System prompt** — persistent instructions that define the model's behavior
- **Temperature** — how creative or deterministic the responses are
- **Context window** — how much conversation history to keep
- **Stop tokens** — when the model should stop generating

## Your First Custom Model

Create a file called `Modelfile.coder` in your project directory:

```
# Modelfile.coder — A coding assistant based on Llama 3.1
FROM llama3.1:8b

# System prompt that shapes every response
SYSTEM """You are a senior software engineer. You write clean, well-documented code.

Rules:
- Always include type hints in Python code
- Explain your reasoning before writing code
- Point out potential edge cases
- Suggest tests for the code you write
- Keep responses concise — no unnecessary preamble"""

# Lower temperature for more deterministic code output
PARAMETER temperature 0.3

# Increase context window for longer code discussions
PARAMETER num_ctx 8192
```

Build and run it:

```bash
# Create the custom model
ollama create coder -f Modelfile.coder

# Test it
ollama run coder "Write a Python function to find the longest palindrome substring"
```

The model now has your system prompt baked in. Every conversation starts with those instructions, and the lower temperature produces more consistent code output.

## A Research Assistant

```
# Modelfile.researcher — A focused research assistant
FROM llama3.1:8b

SYSTEM """You are a research analyst. Your job is to analyze information thoroughly and present findings clearly.

Rules:
- Structure your responses with clear headings
- Cite specific data points when available
- Distinguish between facts and opinions
- Present multiple perspectives on controversial topics
- End with a brief summary of key takeaways"""

PARAMETER temperature 0.5
PARAMETER num_ctx 4096
```

```bash
ollama create researcher -f Modelfile.researcher
ollama run researcher "Analyze the pros and cons of microservices vs monoliths"
```

## A Creative Writer

```
# Modelfile.writer — A creative writing assistant
FROM llama3.1:8b

SYSTEM """You are a creative writing partner. You help with stories, dialogue, and prose.

Style:
- Use vivid, specific language
- Show, don't tell
- Vary sentence length for rhythm
- Avoid clichés and purple prose"""

# Higher temperature for more creative output
PARAMETER temperature 0.8
PARAMETER num_ctx 4096

# Stop generating at these tokens to keep responses focused
PARAMETER stop "---"
PARAMETER stop "THE END"
```

```bash
ollama create writer -f Modelfile.writer
ollama run writer "Write the opening paragraph of a noir detective story set in Tokyo"
```

## Modelfile Reference

Here are the most useful parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `temperature` | 0.8 | Randomness (0.0 = deterministic, 1.0 = creative) |
| `num_ctx` | 2048 | Context window size in tokens |
| `top_p` | 0.9 | Nucleus sampling threshold |
| `top_k` | 40 | Top-k sampling — consider the top k tokens |
| `repeat_penalty` | 1.1 | Penalty for repeating tokens |
| `stop` | — | Stop sequence — model stops when it generates this |
| `seed` | — | Random seed for reproducible output |

## Using Custom Models from Python

Your custom models work with the same OpenAI-compatible API:

```python
# Use a custom model from Python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",
)

# Call the coder model
response = client.chat.completions.create(
    model="coder",  # Your custom model name
    messages=[
        {"role": "user", "content": "Write a binary search in Python"},
    ],
)

print(response.choices[0].message.content)
```

## Managing Custom Models

```bash
# List all models (including custom ones)
ollama list

# Show the Modelfile of an existing model
ollama show coder --modelfile

# Copy a model (to experiment with variations)
ollama cp coder coder-v2

# Delete a custom model
ollama rm coder
```

## When to Use Modelfiles

| Use Case | What to Customize |
|----------|------------------|
| **Domain-specific assistant** | System prompt with domain knowledge and rules |
| **Code generation** | Low temperature (0.2-0.4), specific coding instructions |
| **Creative writing** | High temperature (0.7-0.9), style guidelines |
| **Strict Q&A** | Low temperature, instruction to only answer from context |
| **Chat interface** | Moderate temperature, conversational tone |

Modelfiles are the simplest way to specialize a model. For deeper customization (changing the model's actual knowledge), you would fine-tune — which we cover in the next step.

---

[← Benchmark Models](06-benchmark-models.md) | [Next: Step 8 - What's Next →](08-whats-next.md)
