# Step 4: Ollama API

One-Line Summary: Use Ollama's OpenAI-compatible REST API from curl and Python to integrate your local LLM into real applications.

Prerequisites: Ollama running with Llama 3.1 8B pulled (Step 3), Python 3.10+, pip

---

## Ollama's Two APIs

Ollama exposes two API formats on `localhost:11434`:

1. **Native Ollama API** — Ollama's own format at `/api/generate` and `/api/chat`
2. **OpenAI-compatible API** — Drop-in replacement at `/v1/chat/completions`

We will focus on the OpenAI-compatible API because it means any code, library, or tool built for OpenAI works with your local model — zero changes.

## Test with curl

Start with a raw HTTP request to confirm the API works:

```bash
# Send a chat completion request to the OpenAI-compatible endpoint
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1:8b",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is Docker in one sentence?"}
    ],
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

The response follows the exact OpenAI format:

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1700000000,
  "model": "llama3.1:8b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Docker is a platform that packages applications and their dependencies into lightweight, portable containers that run consistently across any environment."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 28,
    "total_tokens": 53
  }
}
```

## Set Up a Python Environment

Create a project folder and install the OpenAI Python client:

```bash
# Create a project directory and virtual environment
mkdir llm-deploy && cd llm-deploy
python3 -m venv venv
source venv/bin/activate

# Install the OpenAI Python client — works with any OpenAI-compatible API
pip install openai
```

## Call Ollama from Python

Create a file called `chat.py`:

```python
# chat.py — Call your local LLM using the OpenAI Python client
from openai import OpenAI

# Point the client at Ollama instead of OpenAI
# No API key needed for local inference
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",  # Required by the client but not validated
)

# Send a chat completion request — identical to OpenAI's API
response = client.chat.completions.create(
    model="llama3.1:8b",
    messages=[
        {"role": "system", "content": "You are a senior Python developer."},
        {"role": "user", "content": "Write a function to find duplicates in a list."},
    ],
    temperature=0.7,
    max_tokens=500,
)

# Print the model's response
print(response.choices[0].message.content)

# Print token usage statistics
print(f"\nTokens used: {response.usage.total_tokens}")
print(f"  Prompt: {response.usage.prompt_tokens}")
print(f"  Completion: {response.usage.completion_tokens}")
```

Run it:

```bash
# Execute the chat script
python chat.py
```

## Streaming Responses

For real-time output (like a chatbot), use streaming:

```python
# stream.py — Stream responses token-by-token from your local LLM
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",
)

# Enable streaming to receive tokens as they are generated
stream = client.chat.completions.create(
    model="llama3.1:8b",
    messages=[
        {"role": "user", "content": "Explain how a CPU cache works."},
    ],
    stream=True,  # Return an iterator of partial responses
)

# Print each token as it arrives — no buffering
for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="", flush=True)

print()  # Final newline after streaming completes
```

## Multi-Turn Conversations

The API is stateless — you manage conversation history yourself:

```python
# conversation.py — Multi-turn conversation with message history
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",
)

# Maintain conversation history as a list of messages
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
]

def chat(user_message: str) -> str:
    """Send a message and get a response, maintaining conversation history."""
    # Append the user's message to history
    messages.append({"role": "user", "content": user_message})

    # Send the full conversation history to the model
    response = client.chat.completions.create(
        model="llama3.1:8b",
        messages=messages,
        temperature=0.7,
    )

    # Extract and store the assistant's reply
    assistant_message = response.choices[0].message.content
    messages.append({"role": "assistant", "content": assistant_message})

    return assistant_message

# Simulate a multi-turn conversation
print(chat("What is the largest planet in our solar system?"))
print("---")
print(chat("How many moons does it have?"))
print("---")
print(chat("Which is the largest moon?"))
```

Notice the second and third questions work because the full history is sent each time. The model "remembers" context through the message list, not through any server-side state.

You now have a fully programmable local LLM. In the next step, we will explore quantization to understand the tradeoffs between model size and quality.

---

[← Previous: Step 3 - Run Your First Model](03-run-your-first-model.md) | [Next: Step 5 - Quantization →](05-quantization.md)
