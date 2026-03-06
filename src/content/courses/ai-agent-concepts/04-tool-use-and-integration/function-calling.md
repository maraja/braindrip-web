# Function Calling

**One-Line Summary**: Function calling enables LLMs to generate structured JSON objects that invoke external tools, bridging the gap between natural language understanding and programmatic action.

**Prerequisites**: Prompt engineering, JSON schema basics, API design fundamentals

## What Is Function Calling?

Imagine you are a translator at the United Nations. You listen to a diplomat speak in French, understand the meaning, and then express it precisely in Mandarin following strict grammatical rules. Function calling works the same way: the LLM listens to a user's natural language request, understands the intent, and translates it into a structured JSON object that a computer can execute. The "grammar" here is a predefined JSON schema that specifies exactly what parameters the function expects.

Function calling is a capability built into modern LLMs (starting with OpenAI's June 2023 release, followed by Anthropic's tool use, Google's function calling in Gemini, and others) that allows the model to output structured function invocations instead of plain text. The model does not execute the function itself — it produces a JSON object specifying which function to call and with what arguments. The host application then executes the function and optionally feeds the result back to the model.

![Overview of LLM-powered autonomous agent system with Planning, Action, and Memory components](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Source: [Lilian Weng, "LLM Powered Autonomous Agents" (2023)](https://lilianweng.github.io/posts/2023-06-23-agent/) — Function calling is the mechanism within the Action component that enables the LLM to invoke external tools.*

This mechanism is what transforms a chatbot into an agent. Without function calling, an LLM can only produce text. With it, the LLM can query databases, send emails, control smart home devices, write files, and interact with any system that exposes a callable interface. The key insight is that LLMs are remarkably good at mapping natural language intent to structured parameter schemas when given clear function descriptions.

## How It Works

### Schema Definition

Every function is described to the LLM via a JSON schema that includes the function name, a natural language description, and parameter definitions with types, descriptions, and constraints. For example:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {"type": "string", "description": "City and state, e.g. San Francisco, CA"},
      "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
    },
    "required": ["location"]
  }
}
```

The quality of the description field is critical — it serves as documentation that the LLM reads to decide when and how to use the tool.

### Model Decision and Generation

When the LLM receives a user message along with available function schemas, it makes two decisions: (1) whether to call a function at all or respond with plain text, and (2) if calling a function, which one and with what arguments. The model outputs a special structured response (not free-form text) containing the function name and argument JSON. OpenAI uses a `tool_calls` field in the response; Anthropic uses a `tool_use` content block with an `id`, `name`, and `input`.

### Execution Loop

*Recommended visual: A sequence diagram showing the function calling loop: User message to Model to Tool Call to Execution to Result to Model to Final Response — see [Anthropic, "Tool Use Documentation" (2024)](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)*

The host application receives the function call, validates the arguments against the schema, executes the actual function, and returns the result to the model in a subsequent message. This creates a conversation loop: User message -> Model function call -> System executes function -> Result returned to model -> Model generates final response. This loop can repeat multiple times for complex tasks requiring several function calls.

### Validation and Error Handling

Robust implementations validate the generated JSON against the schema before execution. Common failure modes include: the model hallucinating function names that do not exist, providing wrong parameter types (string instead of integer), omitting required parameters, or producing malformed JSON. Error responses should be fed back to the model with clear descriptions so it can retry with corrections.

## Why It Matters

### From Chat to Action

Function calling is the single most important capability that separates a chatbot from an agent. Before function calling, integrating LLMs with external systems required fragile regex parsing of free-text output. Now, the model natively produces machine-readable instructions, enabling reliable tool integration at scale.

### Ecosystem Standardization

The function calling pattern has become a de facto standard across LLM providers. OpenAI, Anthropic, Google, Mistral, and open-source models (via libraries like Outlines or llama.cpp grammars) all support some form of structured function invocation. This standardization means tool definitions are increasingly portable across providers.

### Compound AI Systems

Function calling is the foundation of compound AI systems where LLMs orchestrate multiple services. Every agent framework — LangChain, CrewAI, AutoGen, Semantic Kernel — builds on function calling as the primitive for tool use. Understanding this mechanism is essential for building any non-trivial AI application.

## Key Technical Details

- **Parallel function calling**: OpenAI and Anthropic both support the model requesting multiple function calls in a single response turn, enabling concurrent tool execution.
- **Forced function calling**: You can constrain the model to always call a specific function (OpenAI's `tool_choice: {"type": "function", "function": {"name": "X"}}`) or to call any function (`tool_choice: "required"`).
- **Token cost**: Function schemas consume input tokens. Ten functions with detailed schemas can easily add 2,000-3,000 tokens to every request.
- **Nested objects and arrays**: Schemas support complex nested structures, but models become less reliable as schema depth increases beyond 2-3 levels.
- **Anthropic tool use** returns a `tool_use` block with a unique `id`; the result must be returned in a `tool_result` block referencing that same `id`.
- **Streaming**: Function call arguments can be streamed token-by-token, allowing UIs to show progress, but the function cannot be executed until the full JSON is assembled.
- **Fine-tuning for tools**: OpenAI allows fine-tuning models on function calling examples, which can significantly improve accuracy for domain-specific tool sets.

## Common Misconceptions

- **"The LLM executes the function"**: The model only generates the call specification. Execution happens in the host application. The model never directly accesses databases, APIs, or file systems.
- **"Function calling is just prompt engineering"**: While early approaches used prompt tricks to get JSON output, modern function calling is implemented at the model architecture level with specific training on structured output generation, making it far more reliable.
- **"More functions are always better"**: Performance degrades significantly beyond 10-20 functions. Models struggle to select the right tool when presented with dozens of similar options, and schema tokens eat into the context window.
- **"Function calling guarantees valid JSON"**: Even with native function calling, models occasionally produce malformed output. Schema validation on the application side is mandatory for production systems.

## Connections to Other Concepts

- `tool-selection-and-routing.md` — Explores the decision process of picking the right function when many are available.
- `structured-output-for-actions.md` — Covers the broader challenge of ensuring LLM outputs conform to expected formats, of which function calling is a specific instance.
- `model-context-protocol.md` — MCP builds on function calling to create a standardized protocol for tool discovery and invocation across applications.
- `tool-chaining.md` — When a single function call is not enough and the agent needs to sequence multiple calls, feeding outputs forward.
- `api-integration.md` — Function calling is the mechanism; API integration is the common target of those calls.

## Further Reading

- Schick et al., "Toolformer: Language Models Can Teach Themselves to Use Tools" (2023) — Seminal paper on training LLMs to autonomously decide when and how to call tools.
- OpenAI, "Function Calling and Other API Updates" (2023) — The original announcement and documentation for function calling in the OpenAI API.
- Anthropic, "Tool Use Documentation" (2024) — Anthropic's guide to implementing tool use with Claude, including best practices for schema design.
- Patil et al., "Gorilla: Large Language Model Connected with Massive APIs" (2023) — Research on training LLMs to accurately call APIs from large catalogs, addressing hallucination in function names and parameters.
- Berkeley Function-Calling Leaderboard (2024) — Standardized benchmark comparing LLM accuracy on function calling tasks across providers and models.
