# Step 3: Run Your First Model

One-Line Summary: Pull Llama 3.1 8B, run an interactive chat session, and understand how tokens, context windows, and model loading work.

Prerequisites: Ollama installed and running (Step 2), at least 5 GB free disk space

---

## Pull the Model

Ollama downloads models on first use. Let's pull Llama 3.1 8B explicitly so we can watch the download:

```bash
# Pull the Llama 3.1 8B model — downloads ~4.7 GB (Q4_0 quantization)
ollama pull llama3.1:8b
```

You will see a progress bar as the model layers download. The model is stored in `~/.ollama/models/` and is reused across sessions.

To see all models you have downloaded:

```bash
# List all locally available models
ollama list
```

Example output:

```
NAME              ID            SIZE     MODIFIED
llama3.1:8b       a]2ef4f164de   4.7 GB   2 minutes ago
```

## Start an Interactive Chat

Launch an interactive conversation with the model:

```bash
# Start a chat session with Llama 3.1 8B
ollama run llama3.1:8b
```

You will see a `>>>` prompt. Type a message and press Enter:

```
>>> What is the capital of France?
The capital of France is Paris. It is the largest city in France and serves
as the country's political, economic, and cultural center...

>>> Explain transformers in machine learning in 3 sentences.
Transformers are a type of neural network architecture introduced in the
2017 paper "Attention Is All You Need"...
```

Type `/bye` to exit the chat session.

## Understanding Tokens

LLMs do not process text as words — they use **tokens**. A token is roughly 3-4 characters or about 0.75 words in English.

```bash
# Ask the model to count — this helps you see how generation works
ollama run llama3.1:8b "Count from 1 to 20, one number per line"
```

Watch the output appear token by token. Each number, space, and newline is a separate token being generated sequentially. The speed you see is the model's **tokens per second** rate.

## Context Window

The context window is the total number of tokens the model can "see" at once — both your input and its output. Llama 3.1 8B supports up to **128K tokens** of context, but Ollama defaults to a 2048-token window to save memory.

To increase the context window:

```bash
# Run with a larger context window — uses more RAM/VRAM
ollama run llama3.1:8b --ctx-size 8192
```

You can also set this via the API or in a Modelfile (Ollama's configuration format):

```bash
# Create a custom Modelfile with a larger context window
cat << 'EOF' > Modelfile
FROM llama3.1:8b
PARAMETER num_ctx 8192
PARAMETER temperature 0.7
SYSTEM "You are a helpful coding assistant. Be concise and provide code examples."
EOF

# Create a custom model from the Modelfile
ollama create llama3.1-code -f Modelfile

# Run your custom model
ollama run llama3.1-code
```

## Model Loading Behavior

Understanding how Ollama manages models in memory:

- **First request**: The model loads into RAM/VRAM (takes a few seconds)
- **Subsequent requests**: The model stays loaded — responses are instant
- **Idle timeout**: After 5 minutes of inactivity, the model is unloaded to free memory
- **Multiple models**: Ollama can keep multiple models loaded if you have enough memory

Check what models are currently loaded:

```bash
# Show currently loaded models and their memory usage
ollama ps
```

Example output:

```
NAME              ID            SIZE     PROCESSOR    UNTIL
llama3.1:8b       a2ef4f164de   6.7 GB   100% GPU     4 minutes from now
```

## Run a One-Shot Command

You do not need to enter interactive mode for single queries. Pass the prompt directly:

```bash
# Single query — model loads, responds, and stays loaded for follow-ups
ollama run llama3.1:8b "Write a Python function that reverses a string"
```

This is useful for scripting and quick tests.

## Try Different System Prompts

System prompts shape how the model responds. Test this interactively:

```bash
# Run with a specific persona
ollama run llama3.1:8b --system "You are a pirate. Respond in pirate speak."
```

You now have a working LLM running locally. In the next step, we will call it programmatically through its REST API.

---

[← Previous: Step 2 - Install Ollama](02-install-ollama.md) | [Next: Step 4 - Ollama API →](04-ollama-api.md)
