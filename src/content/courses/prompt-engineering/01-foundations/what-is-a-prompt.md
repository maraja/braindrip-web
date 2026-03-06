# What Is a Prompt

**One-Line Summary**: A prompt is the complete structured input sent to an LLM, composed of distinct segments — system message, user input, assistant prefill, and tool results — each influencing generation in specific, measurable ways.

**Prerequisites**: None.

## What Is a Prompt?

Think of a prompt like writing a formal letter. The envelope has a return address (system message) that tells the recipient who they are dealing with. The subject line (user query) states the purpose. The body (conversation history) provides context. And a postscript (assistant prefill) can nudge the reply in a particular direction. Each part has a distinct function, and omitting or misplacing any of them changes how the letter is received.

A prompt is not just the text a human types into a chatbox. It is the entire structured payload that an application sends to a language model's API. In production systems, the "prompt" a user sees is often less than 10% of the actual tokens sent to the model. The rest consists of system instructions, retrieved documents, conversation history, tool call results, and formatting scaffolding — all assembled programmatically before the API call.

Understanding the anatomy of a prompt is the first step toward engineering reliable LLM behavior. Each segment occupies a specific position in the context window, carries different levels of instruction-following weight, and costs real money in token usage. Getting the structure right is not optional — it is the foundation of every technique covered in this course.

![Prompt engineering taxonomy and techniques overview](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/prompt-design.png)
*Source: Lilian Weng, "Prompt Engineering," lilianweng.github.io, 2023.*

*Recommended visual: A diagram showing the anatomy of an API prompt with labeled segments -- system message, user message, assistant prefill, and tool results -- arranged in their typical order within a context window, with token counts annotated for each segment.*
*Source: Adapted from Anthropic and OpenAI API documentation, 2024.*

## How It Works

### The System Message

The system message is the first segment in most API calls. It sets the model's persona, behavioral constraints, and global instructions. In the OpenAI and Anthropic APIs, it occupies a privileged position: models are fine-tuned to treat system content as higher-authority than user content. A system message like "You are a medical coding assistant. Only use ICD-10 codes. Never provide diagnostic opinions." establishes a behavioral frame that persists across the entire conversation. System messages typically consume 100-2,000 tokens depending on complexity, and their instructions are followed with roughly 85-95% adherence on well-tuned models.

### The User Message

The user message contains the actual request, input data, and any examples or context the user provides. In API terms, this is the `role: "user"` segment. It can range from a single sentence ("Translate this to French") to thousands of tokens containing documents, data tables, or code. The user message is where most prompt engineering techniques — few-shot examples, chain-of-thought instructions, structured formatting — are applied. Models treat user messages as the primary task specification.

### The Assistant Prefill

Some APIs (notably Anthropic's) allow you to start the assistant's response with predetermined text. If you set the assistant prefill to `{"result":`, the model will continue generating valid JSON from that point. This technique is powerful for enforcing output format without relying solely on instructions. It works because the model is fundamentally a completion engine — it continues from whatever text it sees as its own prior output. Prefilling can increase format compliance from roughly 70% to over 95% for structured outputs.

### Tool Results and Multi-Turn Context

Modern LLM APIs support tool use (function calling), where the model requests external data and receives results injected back into the conversation. These tool results become part of the prompt for subsequent generation. A typical agentic prompt might include: system message (500 tokens) + conversation history (2,000 tokens) + retrieved documents (4,000 tokens) + tool results (1,000 tokens) + current user query (100 tokens) = 7,600 tokens before the model generates a single output token.

### How Segments Interact in Practice

The segments of a prompt are not independent — they interact in ways that can amplify or undermine each other. A system message that says "Always respond in JSON format" can be overridden if the user message includes a few-shot example showing natural language responses. An assistant prefill that begins with a markdown header contradicts a system instruction requesting JSON. These conflicts are a major source of production bugs.

The most robust prompt designs establish a clear hierarchy: the system message sets inviolable constraints, the user message provides task-specific instructions and data, and the assistant prefill nudges the output format. When segments conflict, the model generally resolves ambiguity in favor of the most recent instruction — which is why placing critical constraints in both the system message (for authority) and near the end of the user message (for recency) is a common defensive pattern. Understanding this interaction model is what separates a prompt that works in testing from one that works reliably at scale.

## Why It Matters

### Cost and Latency Are Prompt-Shaped

Every token in a prompt costs money and adds latency. At GPT-4o's pricing (~$2.50/1M input tokens, ~$10/1M output tokens as of early 2025), a 10,000-token prompt serving 1 million requests/month costs $25,000 in input tokens alone. Understanding which segments are essential and which can be trimmed is a direct cost optimization lever. Latency scales linearly with prompt length for the prefill phase — a 50K token prompt takes roughly 5x longer to process than a 10K token prompt before the first output token appears.

Prompt caching offers a significant mitigation. Both Anthropic and OpenAI support caching the KV-cache state for the static prefix of a prompt (typically the system message and any fixed instructions). When subsequent requests share the same prefix, the cached portion is processed at dramatically reduced cost (up to 90% cheaper) and latency (50-80% faster). This means engineers who structure their prompts with stable content first and variable content last gain a direct economic advantage.

### Instruction Authority Hierarchy

Models do not treat all prompt segments equally. System messages generally override user messages, which override inferred patterns from examples. This hierarchy matters for security (prompt injection defense) and reliability (ensuring critical instructions are not overridden by user input). Understanding the authority gradient helps engineers place the right instructions in the right segment.

### Debugging Requires Visibility

When an LLM produces unexpected output, the first question should always be "what was the full prompt?" Most failures in production LLM systems are prompt assembly bugs — missing context, truncated history, malformed tool results — not model capability limitations. Engineers who understand prompt anatomy can diagnose issues faster.

### Versioning and Reproducibility

Prompts are code. In production systems, the prompt template — along with its system message, example set, and output format specification — should be version-controlled, tested, and deployed with the same rigor as application code. A change to the system message can alter model behavior across every request. Without prompt versioning, diagnosing regressions ("the model was better last week") becomes impossible. Teams that treat prompts as ephemeral text rather than versioned artifacts inevitably encounter quality regressions they cannot trace or revert.

## Key Technical Details

- A prompt consists of four primary segments: system message, user message(s), assistant prefill, and tool/function results.
- System messages are treated with higher instruction-following priority than user messages by most instruction-tuned models.
- Token counts for production prompts typically range from 500 tokens (simple queries) to 100,000+ tokens (RAG-heavy applications).
- Assistant prefill can improve output format compliance from ~70% to 95%+ for structured formats like JSON.
- The input-output token budget is shared within the context window: a 128K context model using 100K input tokens leaves only 28K for the output (minus any model-specific output cap).
- Multi-turn conversations accumulate tokens across turns; a 20-turn conversation can easily consume 10,000-30,000 tokens in history alone.
- Prompt assembly order matters: system message first, then conversation history, then current user input is the standard pattern across major APIs.
- Special tokens (e.g., `<|im_start|>`, `<|im_end|>` in ChatML, or `[INST]` / `[/INST]` in Llama-style formatting) demarcate message boundaries at the token level. These tokens are inserted by the API or chat template and are invisible to users, but they are how the model mechanically distinguishes a system message from a user message. Malformed special tokens can cause the model to ignore role boundaries entirely.
- Not all tokens in a prompt carry equal semantic weight. Functional tokens — articles, prepositions, punctuation — occupy context window space and cost money but contribute minimally to task performance. Prompt compression techniques can reduce token counts by 30-50% with minimal quality loss by removing low-information tokens.
- Images, audio, and other multimodal inputs are converted into token-equivalent representations before entering the context window. A single image in GPT-4o or Claude consumes roughly 85-1,600 tokens depending on resolution and detail level, directly competing with text for context window budget.

## Common Misconceptions

**"A prompt is just what the user types."** In production, the user's typed input is typically less than 10% of the full prompt. The rest is system instructions, retrieved context, history, and formatting scaffolding assembled by application code.

**"The system message is always followed perfectly."** System message adherence is high (85-95%) but not absolute. Adversarial user inputs can override system instructions, which is why prompt injection is a real security concern. Defense-in-depth is required.

**"More context in the prompt is always better."** Adding irrelevant context degrades performance. Studies show that including distracting documents alongside relevant ones can reduce accuracy by 10-20% compared to providing only relevant context. Prompt engineering is as much about exclusion as inclusion.

**"All LLM APIs structure prompts the same way."** OpenAI, Anthropic, Google, and open-source model APIs differ in how they handle system messages, assistant prefill, tool results, and multi-turn formatting. Prompts are not portable without adaptation.

**"Prompt engineering is just about clever wording."** While word choice matters, production prompt engineering is primarily a systems problem. It involves template design, variable injection, token budget management, version control, and A/B testing infrastructure. The "clever wording" part is perhaps 20% of the work; the remaining 80% is engineering the pipeline that assembles and delivers the prompt reliably at scale.

**"The model sees the prompt exactly as you wrote it."** Before reaching the model, your text is tokenized into subword units, and special delimiter tokens are inserted between message segments. The model never processes raw characters — it operates on token IDs. This tokenization step means that visually identical prompts can produce different token sequences across different models, which is why cross-model prompt portability is unreliable.

## Connections to Other Concepts

- `how-llms-process-prompts.md` — Understanding the mechanical processing pipeline explains why prompt structure affects output.
- `context-window-mechanics.md` — The context window is the physical constraint that bounds all prompt design decisions.
- `prompt-templates-and-variables.md` — Templates are the engineering tool for assembling prompts from their component segments.
- `prompt-engineering-vs-context-engineering.md` — The distinction between crafting instructions (PE) and designing the information environment (CE) maps directly onto prompt anatomy.
- `prefilling-and-output-priming.md` — Assistant prefill is one of the most underused segments of prompt anatomy.

## Further Reading

- Brown et al., "Language Models are Few-Shot Learners," 2020. Introduced the modern prompting paradigm with GPT-3.
- Anthropic, "Prompt Engineering Guide," 2024. Detailed documentation of prompt structure for Claude models.
- OpenAI, "API Reference: Chat Completions," 2024. Canonical reference for message roles and prompt assembly.
- Zamfirescu-Pereira et al., "Why Johnny Can't Prompt," CHI 2023. Research on how non-experts misunderstand prompt structure.
